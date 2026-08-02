package com.hemant.civicplus.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private String area;
    private String district;
    private String bio;
    private String avatarUrl;
    private String department;
    private String role;
    private Double latitude;
    private Double longitude;
    private String nationality;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
