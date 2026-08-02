package com.hemant.civicplus.analyticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    private Long totalUsers;
    private Long totalComplaints;
    private Long resolvedComplaints;
    private Long averageResolutionTimeHours;
    private Map<String, Long> complaintsByStatus;
    private Map<String, Long> complaintsByCategory;
}
