package com.hemant.civicplus.analyticsservice.application;

import com.hemant.civicplus.analyticsservice.dto.DashboardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final org.springframework.web.client.RestTemplate restTemplate;

    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public DashboardResponse getDashboardStatistics() {
        // Fetch total users from user-service
        Long totalUsers = 0L;
        try {
            totalUsers = restTemplate.getForObject("http://user-service/api/v1/users/profile/internal/count", Long.class);
        } catch (Exception e) {
            // Fallback or log if user-service is down
            totalUsers = 0L;
        }

        // Fetch all complaints from complaint-service
        List<Map<String, Object>> complaints = new java.util.ArrayList<>();
        try {
            List<Map<String, Object>> response = restTemplate.exchange(
                    "http://complaint-service/api/v1/complaints/internal/all",
                    org.springframework.http.HttpMethod.GET,
                    null,
                    new org.springframework.core.ParameterizedTypeReference<List<Map<String, Object>>>() {}
            ).getBody();
            if (response != null) {
                complaints = response;
            }
        } catch (Exception e) {
            // Ignore if complaint-service is down
        }

        long totalComplaints = complaints.size();
        long resolvedComplaints = 0L;
        long totalResolutionTimeMs = 0L;
        
        Map<String, Long> statusCounts = new HashMap<>();
        Map<String, Long> categoryCounts = new HashMap<>();

        for (Map<String, Object> c : complaints) {
            String status = (String) c.get("status");
            String category = (String) c.get("category");

            statusCounts.put(status, statusCounts.getOrDefault(status, 0L) + 1);
            categoryCounts.put(category, categoryCounts.getOrDefault(category, 0L) + 1);

            if ("RESOLVED".equalsIgnoreCase(status) && c.get("createdAt") != null && c.get("updatedAt") != null) {
                resolvedComplaints++;
                try {
                    java.time.LocalDateTime createdAt = java.time.LocalDateTime.parse((String) c.get("createdAt"));
                    java.time.LocalDateTime updatedAt = java.time.LocalDateTime.parse((String) c.get("updatedAt"));
                    totalResolutionTimeMs += java.time.Duration.between(createdAt, updatedAt).toMillis();
                } catch (Exception ex) {
                    // Ignore parse errors
                }
            }
        }

        long averageResolutionTimeHours = 0L;
        if (resolvedComplaints > 0) {
            averageResolutionTimeHours = (totalResolutionTimeMs / resolvedComplaints) / (1000 * 60 * 60);
        }

        return DashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalComplaints(totalComplaints)
                .resolvedComplaints(resolvedComplaints)
                .averageResolutionTimeHours(averageResolutionTimeHours)
                .complaintsByStatus(statusCounts)
                .complaintsByCategory(categoryCounts)
                .build();
    }
}
