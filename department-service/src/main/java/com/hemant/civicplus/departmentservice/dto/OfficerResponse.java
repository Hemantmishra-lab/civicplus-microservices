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
public class OfficerResponse {
    private Long id;
    private Long userId;
    private Long departmentId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
