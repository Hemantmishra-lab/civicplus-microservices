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
import lombok.extern.slf4j.Slf4j;
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
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
@Slf4j
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final ComplaintEventPublisher eventPublisher;
    private final RestTemplate restTemplate;
    
    // Inject components for programmatic caching
    private final RedisTemplate<String, Object> redisTemplate;
    private final CacheKeyGenerator cacheKeyGenerator;

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

        evictComplaintCaches(citizenId);

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

        evictComplaintCaches(savedComplaint.getCitizenId());

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

        evictComplaintCaches(savedComplaint.getCitizenId());

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
        
        evictComplaintCaches(savedComplaint.getCitizenId());
        
        return mapToResponse(savedComplaint);
    }



    @SuppressWarnings("unchecked")
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getComplaintsByCitizen(Long citizenId) {
        String cacheKey = cacheKeyGenerator.generateCitizenKey(citizenId);
        
        try {
            Object cachedData = redisTemplate.opsForValue().get(cacheKey);
            if (cachedData != null) {
                log.info("Cache Hit for key: {}", cacheKey);
                return (List<ComplaintResponse>) cachedData;
            }
            log.info("Cache Miss for key: {}", cacheKey);
        } catch (Exception e) {
            log.error("Redis error for key {}: {}", cacheKey, e.getMessage());
        }
        
        List<ComplaintResponse> complaints = complaintRepository.findByCitizenId(citizenId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
                
        try {
            redisTemplate.opsForValue().set(cacheKey, complaints, 15, TimeUnit.MINUTES);
        } catch (Exception e) {
            log.error("Redis error setting key {}: {}", cacheKey, e.getMessage());
        }
        
        return complaints;
    }

    @SuppressWarnings("unchecked")
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAssignedComplaints(Long officerId) {
        String cacheKey = cacheKeyGenerator.generateAssignedKey(officerId);
        
        try {
            Object cachedData = redisTemplate.opsForValue().get(cacheKey);
            if (cachedData != null) {
                log.info("Cache Hit for key: {}", cacheKey);
                return (List<ComplaintResponse>) cachedData;
            }
            log.info("Cache Miss for key: {}", cacheKey);
        } catch (Exception e) {
            log.error("Redis error for key {}: {}", cacheKey, e.getMessage());
        }
        
        List<ComplaintResponse> complaints = complaintRepository.findByAssignedTo(officerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
                
        try {
            redisTemplate.opsForValue().set(cacheKey, complaints, 15, TimeUnit.MINUTES);
        } catch (Exception e) {
            log.error("Redis error setting key {}: {}", cacheKey, e.getMessage());
        }
        
        return complaints;
    }

    @SuppressWarnings("unchecked")
    @Transactional(readOnly = true)
    public Page<ComplaintResponse> searchComplaints(String status, String department, String area, int page, int size) {
        // Generate Cache Key
        String cacheKey = cacheKeyGenerator.generateSearchKey(status, department, area, page, size);
        
        try {
            Object cachedData = redisTemplate.opsForValue().get(cacheKey);
            if (cachedData != null) {
                log.info("Cache Hit for key: {}", cacheKey);
                return (Page<ComplaintResponse>) cachedData;
            }
            log.info("Cache Miss for key: {}", cacheKey);
        } catch (Exception e) {
            log.error("Redis error for key {}: {}", cacheKey, e.getMessage());
        }
        
        // Cache Miss: Query Database
        ComplaintStatus complaintStatus = status != null ? ComplaintStatus.valueOf(status.toUpperCase()) : null;
        Pageable pageable = PageRequest.of(page, size);
        Page<Complaint> complaintsPage = complaintRepository.searchComplaints(complaintStatus, department, area, pageable);
        
        Page<ComplaintResponse> responsePage = complaintsPage.map(this::mapToResponse);
        
        // Save to Redis Cache for 15 minutes
        try {
            redisTemplate.opsForValue().set(cacheKey, responsePage, 15, TimeUnit.MINUTES);
        } catch (Exception e) {
            log.error("Redis error setting key {}: {}", cacheKey, e.getMessage());
        }
        
        return responsePage;
    }

    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintById(Long id) {
        String cacheKey = cacheKeyGenerator.generateComplaintIdKey(id);
        
        try {
            Object cachedData = redisTemplate.opsForValue().get(cacheKey);
            if (cachedData != null) {
                log.info("Cache Hit for key: {}", cacheKey);
                return (ComplaintResponse) cachedData;
            }
            log.info("Cache Miss for key: {}", cacheKey);
        } catch (Exception e) {
            log.error("Redis error for key {}: {}", cacheKey, e.getMessage());
        }

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        ComplaintResponse response = mapToResponse(complaint);
        
        try {
            redisTemplate.opsForValue().set(cacheKey, response, 15, TimeUnit.MINUTES);
        } catch (Exception e) {
            log.error("Redis error setting key {}: {}", cacheKey, e.getMessage());
        }
        
        return response;
    }

    @SuppressWarnings("unchecked")
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAllComplaints() {
        String cacheKey = cacheKeyGenerator.generateAllKey();
        
        try {
            Object cachedData = redisTemplate.opsForValue().get(cacheKey);
            if (cachedData != null) {
                log.info("Cache Hit for key: {}", cacheKey);
                return (List<ComplaintResponse>) cachedData;
            }
            log.info("Cache Miss for key: {}", cacheKey);
        } catch (Exception e) {
            log.error("Redis error for key {}: {}", cacheKey, e.getMessage());
        }
        
        List<ComplaintResponse> complaints = complaintRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
                
        try {
            redisTemplate.opsForValue().set(cacheKey, complaints, 15, TimeUnit.MINUTES);
        } catch (Exception e) {
            log.error("Redis error setting key {}: {}", cacheKey, e.getMessage());
        }
        
        return complaints;
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

    private void evictComplaintCaches(Long citizenId) {
        try {
            if (citizenId != null) {
                String citizenKey = cacheKeyGenerator.generateCitizenKey(citizenId);
                redisTemplate.delete(citizenKey);
                log.info("Evicted Redis cache for key: {}", citizenKey);
                
                List<ComplaintResponse> citizenComplaints = complaintRepository.findByCitizenId(citizenId).stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList());
                redisTemplate.opsForValue().set(citizenKey, citizenComplaints, 15, TimeUnit.MINUTES);
                log.info("Repopulated Redis cache for key: {}", citizenKey);
            }
            String allKey = cacheKeyGenerator.generateAllKey();
            redisTemplate.delete(allKey);
            log.info("Evicted Redis cache for key: {}", allKey);
            
            List<ComplaintResponse> allComplaints = complaintRepository.findAll().stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
            redisTemplate.opsForValue().set(allKey, allComplaints, 15, TimeUnit.MINUTES);
            log.info("Repopulated Redis cache for key: {}", allKey);
        } catch (Exception e) {
            log.error("Failed to evict/repopulate Redis cache: {}", e.getMessage());
        }
    }
}
