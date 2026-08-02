package com.hemant.civicplus.departmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentRequest {
    private String name;
    private String description;
    private Long headId;
    private String area;
    private String district;
    private String level;
}
