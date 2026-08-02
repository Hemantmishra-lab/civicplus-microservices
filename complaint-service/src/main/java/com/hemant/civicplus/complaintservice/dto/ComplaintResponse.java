package com.hemant.civicplus.complaintservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ComplaintResponse {
    private Long id;
    private Long citizenId;
    private String title;
    private String description;
    private String category;
    private Double latitude;
    private Double longitude;
    private String status;
    private String priority;
    private String area;
    private String district;
    private Long assignedTo;
    private String department;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> imageUrls;
}
