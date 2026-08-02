package com.hemant.civicplus.departmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfficerRequest {
    private Long userId;
    private Long departmentId;
}
