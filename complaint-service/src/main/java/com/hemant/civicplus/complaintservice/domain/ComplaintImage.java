package com.hemant.civicplus.complaintservice.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "complaint_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "complaint")
public class ComplaintImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;
}
