package com.hemant.civicplus.departmentservice.application;

import com.hemant.civicplus.departmentservice.domain.Department;
import com.hemant.civicplus.departmentservice.domain.Officer;
import com.hemant.civicplus.departmentservice.dto.DepartmentRequest;
import com.hemant.civicplus.departmentservice.dto.DepartmentResponse;
import com.hemant.civicplus.departmentservice.dto.OfficerRequest;
import com.hemant.civicplus.departmentservice.dto.OfficerResponse;
import com.hemant.civicplus.departmentservice.repository.DepartmentRepository;
import com.hemant.civicplus.departmentservice.repository.OfficerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final OfficerRepository officerRepository;

    @Transactional
    @SuppressWarnings("null")
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        Department department = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .headId(request.getHeadId())
                .area(request.getArea())
                .district(request.getDistrict())
                .level(request.getLevel())
                .build();
        
        Department saved = departmentRepository.save(department);
        return mapToDepartmentResponse(saved);
    }

    @Transactional
    @SuppressWarnings("null")
    public DepartmentResponse assignHead(Long departmentId, Long headId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        department.setHeadId(headId);
        Department saved = departmentRepository.save(department);
        return mapToDepartmentResponse(saved);
    }

    @Transactional
    @SuppressWarnings("null")
    public OfficerResponse registerOfficer(OfficerRequest request) {
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Officer officer = Officer.builder()
                .userId(request.getUserId())
                .department(department)
                .status("ACTIVE")
                .build();

        Officer saved = officerRepository.save(officer);
        return mapToOfficerResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDepartmentResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OfficerResponse getOfficerByUserId(Long userId) {
        Officer officer = officerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Officer profile not found"));
        return mapToOfficerResponse(officer);
    }

    private DepartmentResponse mapToDepartmentResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .description(department.getDescription())
                .headId(department.getHeadId())
                .area(department.getArea())
                .district(department.getDistrict())
                .level(department.getLevel())
                .createdAt(department.getCreatedAt())
                .updatedAt(department.getUpdatedAt())
                .build();
    }

    private OfficerResponse mapToOfficerResponse(Officer officer) {
        return OfficerResponse.builder()
                .id(officer.getId())
                .userId(officer.getUserId())
                .departmentId(officer.getDepartment().getId())
                .status(officer.getStatus())
                .createdAt(officer.getCreatedAt())
                .updatedAt(officer.getUpdatedAt())
                .build();
    }
}
