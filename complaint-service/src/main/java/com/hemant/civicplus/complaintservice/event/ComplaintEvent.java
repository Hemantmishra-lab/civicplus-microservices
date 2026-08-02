package com.hemant.civicplus.complaintservice.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ComplaintEvent implements Serializable {
    private Long complaintId;
    private Long citizenId;
    private String title;
    private String status;
    private String priority;
    private LocalDateTime timestamp;
    private Long assignedTo;
}
