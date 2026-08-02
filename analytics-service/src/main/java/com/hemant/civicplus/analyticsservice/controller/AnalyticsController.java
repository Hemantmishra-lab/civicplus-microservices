package com.hemant.civicplus.analyticsservice.controller;

import com.hemant.civicplus.analyticsservice.application.AnalyticsService;
import com.hemant.civicplus.analyticsservice.dto.DashboardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DashboardResponse> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStatistics());
    }
}
