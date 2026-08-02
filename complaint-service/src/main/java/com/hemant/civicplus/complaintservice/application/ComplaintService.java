package com.hemant.civicplus.complaintservice.application;

import com.hemant.civicplus.complaintservice.domain.*;
import com.hemant.civicplus.complaintservice.dto.ComplaintRequest;
import com.hemant.civicplus.complaintservice.dto.ComplaintResponse;
import com.hemant.civicplus.complaintservice.dto.StatusUpdateRequest;
import com.hemant.civicplus.complaintservice.event.ComplaintEvent;
import com.hemant.civicplus.complaintservice.kafka.ComplaintEventPublisher;
import com.hemant.civicplus.complaintservice.repository.ComplaintRepository;
import com.hemant.civicplus.complaintservice.repository.StatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final StatusHistoryRepository statusHistoryRepository;

    private final ComplaintEventPublisher eventPublisher;
    private final RestTemplate restTemplate;

    @Transactional
    public ComplaintResponse createComplaint(Long citizenId, ComplaintRequest request) {
        Complaint complaint = Complaint.builder()
                .citizenId(citizenId)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(ComplaintStatus.SUBMITTED)
                .priority(Priority.valueOf(request.getPriority().toUpperCase()))
                .area(request.getArea())
                .district(request.getDistrict())
                .build();

        if (request.getImageUrls() != null) {
            List<ComplaintImage> images = request.getImageUrls().stream()
                    .map(url -> ComplaintImage.builder().complaint(complaint).imageUrl(url).build())
                    .collect(Collectors.toList());
            complaint.setImages(images);
        }
        
        // Auto-assign to nearest Area Incharge based on location
        try {
            String url = "http://user-service/api/v1/users/profile/nearest?role=AREA_INCHARGE";
            if (request.getLatitude() != null && request.getLongitude() != null) {
                url += "&lat=" + request.getLatitude() + "&lng=" + request.getLongitude();
            }
            if (request.getArea() != null) {
                url += "&area=" + java.net.URLEncoder.encode(request.getArea(), "UTF-8");
            }
            if (request.getDistrict() != null) {
                url += "&district=" + java.net.URLEncoder.encode(request.getDistrict(), "UTF-8");
            }
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getBody() != null && response.getBody().get("userId") != null) {
                complaint.setAssignedTo(Long.valueOf(String.valueOf(response.getBody().get("userId"))));
                if (response.getBody().get("department") != null) {
                    complaint.setDepartment(String.valueOf(response.getBody().get("department")));
                }
            }
        } catch (Exception e) {
            // Ignore if user-service is down or no officer found, remains pending/unassigned
        }

        Complaint savedComplaint = Objects.requireNonNull(complaintRepository.save(complaint));

        // Save initial status history
        StatusHistory history = StatusHistory.builder()
                .complaint(savedComplaint)
                .status(ComplaintStatus.SUBMITTED)
                .statusComment("Complaint created successfully.")
                .updatedById(citizenId)
                .build();
        statusHistoryRepository.save(history);

        // Publish Event
        ComplaintEvent event = ComplaintEvent.builder()
                .complaintId(savedComplaint.getId())
                .citizenId(citizenId)
                .assignedTo(savedComplaint.getAssignedTo())
                .title(savedComplaint.getTitle())
                .status(savedComplaint.getStatus().name())
                .priority(savedComplaint.getPriority().name())
                .timestamp(LocalDateTime.now())
                .build();
        eventPublisher.publishComplaintCreated(event);

        return mapToResponse(savedComplaint);
    }

    @Transactional
    public ComplaintResponse updateComplaintStatus(Long officerId, Long complaintId, StatusUpdateRequest request) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));

        // Removed legacy department-service jurisdiction check
        // Assuming @PreAuthorize and frontend filters manage jurisdiction for now.

        ComplaintStatus newStatus = ComplaintStatus.valueOf(request.getStatus().toUpperCase());
        complaint.setStatus(newStatus);
        Complaint savedComplaint = Objects.requireNonNull(complaintRepository.save(complaint));

        // Save status history log
        StatusHistory history = StatusHistory.builder()
                .complaint(savedComplaint)
                .status(newStatus)
                .statusComment(request.getComment())
                .updatedById(officerId)
                .build();
        statusHistoryRepository.save(history);

        // Publish Event
        ComplaintEvent event = ComplaintEvent.builder()
                .complaintId(savedComplaint.getId())
                .citizenId(savedComplaint.getCitizenId())
                .assignedTo(savedComplaint.getAssignedTo())
                .title(savedComplaint.getTitle())
                .status(savedComplaint.getStatus().name())
                .priority(savedComplaint.getPriority().name())
                .timestamp(LocalDateTime.now())
                .build();
        eventPublisher.publishComplaintUpdated(event);

        return mapToResponse(savedComplaint);
    }

    @Transactional
    public ComplaintResponse escalateComplaint(Long userId, String userRole, Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));

        if (complaint.getStatus() == ComplaintStatus.RESOLVED || complaint.getStatus() == ComplaintStatus.CLOSED) {
            throw new RuntimeException("Cannot escalate a resolved or closed complaint");
        }

        String targetRole = null;
        if (userRole.contains("AREA_INCHARGE")) {
            targetRole = "DISTRICT";
        } else if (userRole.contains("DISTRICT")) {
            targetRole = "HEADQUARTER";
        } else if (userRole.contains("CITIZEN")) {
            if (complaint.getCreatedAt().plusDays(7).isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Citizens can only escalate after 7 days of inactivity");
            }
            targetRole = "HEADQUARTER";
        } else {
            throw new RuntimeException("You do not have permission to escalate this complaint");
        }

        try {
            String url = "http://user-service/api/v1/users/profile/nearest?role=" + targetRole;
            if (complaint.getLatitude() != null && complaint.getLongitude() != null) {
                url += "&lat=" + complaint.getLatitude() + "&lng=" + complaint.getLongitude();
            }
            if (complaint.getArea() != null) {
                url += "&area=" + java.net.URLEncoder.encode(complaint.getArea(), "UTF-8");
            }
            if (complaint.getDistrict() != null) {
                url += "&district=" + java.net.URLEncoder.encode(complaint.getDistrict(), "UTF-8");
            }
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getBody() != null && response.getBody().get("userId") != null) {
                complaint.setAssignedTo(Long.valueOf(String.valueOf(response.getBody().get("userId"))));
                if (response.getBody().get("department") != null) {
                    complaint.setDepartment(String.valueOf(response.getBody().get("department")));
                }
            } else {
                throw new RuntimeException("No higher authority found to escalate to");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to escalate: " + e.getMessage());
        }

        complaint.setStatus(ComplaintStatus.ESCALATED);
        Complaint savedComplaint = Objects.requireNonNull(complaintRepository.save(complaint));

        StatusHistory history = StatusHistory.builder()
                .complaint(savedComplaint)
                .status(ComplaintStatus.ESCALATED)
                .statusComment("Escalated by " + userRole)
                .updatedById(userId)
                .build();
        statusHistoryRepository.save(history);

        ComplaintEvent event = ComplaintEvent.builder()
                .complaintId(savedComplaint.getId())
                .citizenId(savedComplaint.getCitizenId())
                .assignedTo(savedComplaint.getAssignedTo())
                .title(savedComplaint.getTitle())
                .status(savedComplaint.getStatus().name())
                .priority(savedComplaint.getPriority().name())
                .timestamp(LocalDateTime.now())
                .build();
        eventPublisher.publishComplaintUpdated(event);

        return mapToResponse(savedComplaint);
    }

    @Transactional
    public ComplaintResponse assignComplaint(Long officerId, Long complaintId, Long supervisorId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));
        
        complaint.setAssignedTo(supervisorId);
        complaint.setStatus(ComplaintStatus.UNDER_PROCESS);
        Complaint savedComplaint = complaintRepository.save(complaint);
        
        // Save status history log
        StatusHistory history = StatusHistory.builder()
                .complaint(savedComplaint)
                .status(ComplaintStatus.UNDER_PROCESS)
                .statusComment("Assigned to Supervisor ID: " + supervisorId)
                .updatedById(officerId)
                .build();
        statusHistoryRepository.save(history);
        
        return mapToResponse(savedComplaint);
    }



    @Transactional(readOnly = true)
    public List<ComplaintResponse> getComplaintsByCitizen(Long citizenId) {
        return complaintRepository.findByCitizenId(citizenId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAssignedComplaints(Long officerId) {
        return complaintRepository.findByAssignedTo(officerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        return mapToResponse(complaint);
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StatusHistory> getComplaintHistory(Long id) {
        return statusHistoryRepository.findByComplaintIdOrderByUpdatedAtAsc(id);
    }

    private ComplaintResponse mapToResponse(Complaint complaint) {
        List<String> urls = complaint.getImages().stream()
                .map(ComplaintImage::getImageUrl)
                .collect(Collectors.toList());

        return ComplaintResponse.builder()
                .id(complaint.getId())
                .citizenId(complaint.getCitizenId())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .category(complaint.getCategory())
                .latitude(complaint.getLatitude())
                .longitude(complaint.getLongitude())
                .status(complaint.getStatus().name())
                .priority(complaint.getPriority().name())
                .area(complaint.getArea())
                .district(complaint.getDistrict())
                .assignedTo(complaint.getAssignedTo())
                .department(complaint.getDepartment())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .imageUrls(urls)
                .build();
    }
}
