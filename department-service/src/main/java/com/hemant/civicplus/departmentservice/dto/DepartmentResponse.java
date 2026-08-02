package com.hemant.civicplus.departmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentResponse {
    private Long id;
    private String name;
    private String description;
    private Long headId;
    private String area;
    private String district;
    private String level;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
