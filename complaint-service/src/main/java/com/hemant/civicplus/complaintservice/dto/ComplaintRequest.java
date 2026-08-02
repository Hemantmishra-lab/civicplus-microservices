package com.hemant.civicplus.complaintservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ComplaintRequest {
    private String title;
    private String description;
    private String category;
    private Double latitude;
    private Double longitude;
    private String priority;
    private String area;
    private String district;
    private List<String> imageUrls;
}
