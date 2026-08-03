package com.hemant.civicplus.notificationservice.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "newsletter_subscribers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsletterSubscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "subscribed_at", updatable = false)
    private LocalDateTime subscribedAt;
}
