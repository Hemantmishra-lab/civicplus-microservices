package com.hemant.civicplus.analyticsservice.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "complaint_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintStat {

    @Id
    @Column(length = 50)
    private String status;

    @Column(name = "status_count")
    @Builder.Default
    private Long statusCount = 0L;
}
