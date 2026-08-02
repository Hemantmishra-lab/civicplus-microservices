package com.hemant.civicplus.analyticsservice.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ComplaintEvent {
    private Long complaintId;
    private Long citizenId;
    private String title;
    private String status;
    private String priority;
    private LocalDateTime timestamp;
    private Long assignedTo;
}
