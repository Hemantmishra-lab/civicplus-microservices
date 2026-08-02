package com.hemant.civicplus.departmentservice.controller;

import com.hemant.civicplus.departmentservice.application.DepartmentService;
import com.hemant.civicplus.departmentservice.dto.DepartmentRequest;
import com.hemant.civicplus.departmentservice.dto.DepartmentResponse;
import com.hemant.civicplus.departmentservice.dto.OfficerRequest;
import com.hemant.civicplus.departmentservice.dto.OfficerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    public ResponseEntity<DepartmentResponse> createDepartment(@RequestBody DepartmentRequest request) {
        return ResponseEntity.ok(departmentService.createDepartment(request));
    }

    @PutMapping("/{id}/assign-head")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    public ResponseEntity<DepartmentResponse> assignHead(@PathVariable Long id, @RequestParam Long headId) {
        return ResponseEntity.ok(departmentService.assignHead(id, headId));
    }

    @PostMapping("/officers")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_DEPARTMENT_HEAD')")
    public ResponseEntity<OfficerResponse> registerOfficer(@RequestBody OfficerRequest request) {
        return ResponseEntity.ok(departmentService.registerOfficer(request));
    }

    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/officers/{userId}")
    public ResponseEntity<OfficerResponse> getOfficer(@PathVariable Long userId) {
        return ResponseEntity.ok(departmentService.getOfficerByUserId(userId));
    }
}
