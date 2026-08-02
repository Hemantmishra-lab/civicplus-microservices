package com.hemant.civicplus.complaintservice.controller;

import com.hemant.civicplus.complaintservice.application.ComplaintService;
import com.hemant.civicplus.complaintservice.dto.ComplaintRequest;
import com.hemant.civicplus.complaintservice.dto.ComplaintResponse;
import com.hemant.civicplus.complaintservice.dto.StatusUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_CITIZEN')")
    public ResponseEntity<ComplaintResponse> createComplaint(@RequestBody ComplaintRequest request) {
        Long citizenId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(complaintService.createComplaint(citizenId, request));
    }

    @GetMapping("/citizen")
    @PreAuthorize("hasRole('ROLE_CITIZEN')")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints() {
        Long citizenId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(complaintService.getComplaintsByCitizen(citizenId));
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasAnyRole('ROLE_OFFICER', 'ROLE_DEPARTMENT_HEAD', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_DEPARTMENT', 'ROLE_DEPARTMENTAL_OFFICER', 'ROLE_HEAD_OFFICER', 'ROLE_AREA_INCHARGE', 'ROLE_DISTRICT', 'ROLE_HEADQUARTER', 'ROLE_SUPERVISOR')")
    public ResponseEntity<List<ComplaintResponse>> getAssignedComplaints() {
        Long officerId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next().getAuthority();
        
        if (role.equals("ROLE_HEAD_OFFICER") || role.equals("ROLE_ADMIN") || role.equals("ROLE_SUPER_ADMIN")) {
            return ResponseEntity.ok(complaintService.getAllComplaints());
        }
        
        return ResponseEntity.ok(complaintService.getAssignedComplaints(officerId));
    }

    @GetMapping("/internal/all")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaintsInternal() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getComplaintById(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<com.hemant.civicplus.complaintservice.domain.StatusHistory>> getComplaintHistory(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintHistory(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_CHIEF_OFFICER', 'ROLE_AREA_INCHARGE', 'ROLE_SUPERVISOR', 'ROLE_DEPARTMENT_OFFICER', 'ROLE_HEAD_OFFICER', 'ROLE_ADMIN')")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request
    ) {
        Long officerId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(complaintService.updateComplaintStatus(officerId, id, request));
    }

    @PutMapping("/{id}/escalate")
    @PreAuthorize("hasAnyRole('ROLE_CITIZEN', 'ROLE_AREA_INCHARGE', 'ROLE_DISTRICT')")
    public ResponseEntity<ComplaintResponse> escalateComplaint(@PathVariable Long id) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userRole = SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next().getAuthority();
        return ResponseEntity.ok(complaintService.escalateComplaint(userId, userRole, id));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ROLE_CHIEF_OFFICER', 'ROLE_AREA_INCHARGE', 'ROLE_DEPARTMENT_OFFICER', 'ROLE_HEAD_OFFICER', 'ROLE_ADMIN')")
    public ResponseEntity<ComplaintResponse> assignComplaint(
            @PathVariable Long id,
            @RequestParam Long supervisorId
    ) {
        Long officerId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(complaintService.assignComplaint(officerId, id, supervisorId));
    }


}
