package com.hemant.civicplus.userservice.application;

import com.hemant.civicplus.userservice.domain.UserProfile;
import com.hemant.civicplus.userservice.dto.UserProfileRequest;
import com.hemant.civicplus.userservice.dto.UserProfileResponse;
import com.hemant.civicplus.userservice.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository userProfileRepository;

    @Transactional
    @SuppressWarnings("null")
    public UserProfileResponse getProfileByUserId(Long userId) {
        // Auto-create an empty profile on first access if it doesn't exist
        UserProfile profile = userProfileRepository.findByUserId(userId).orElseGet(() -> {
            UserProfile newProfile = UserProfile.builder().userId(userId).build();
            return userProfileRepository.save(newProfile);
        });
        return mapToResponse(profile);
    }

    @Transactional
    public UserProfileResponse createOrUpdateProfile(Long userId, UserProfileRequest request) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(UserProfile.builder().userId(userId).build());

        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhoneNumber(request.getPhoneNumber());
        profile.setAddress(request.getAddress());
        profile.setArea(request.getArea());
        profile.setDistrict(request.getDistrict());
        profile.setBio(request.getBio());
        profile.setAvatarUrl(request.getAvatarUrl());
        
        if (request.getDepartment() != null) profile.setDepartment(request.getDepartment());
        if (request.getRole() != null) profile.setRole(request.getRole());
        if (request.getLatitude() != null) profile.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) profile.setLongitude(request.getLongitude());
        if (request.getNationality() != null) profile.setNationality(request.getNationality());

        userProfileRepository.save(profile);
        return mapToResponse(profile);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getNearestOfficer(Double lat, Double lng, String area, String district, String role) {
        if (lat != null && lng != null) {
            java.util.Optional<UserProfile> byLocation = userProfileRepository.findNearestOfficerByRole(lat, lng, role);
            if (byLocation.isPresent()) {
                return mapToResponse(byLocation.get());
            }
        }
        
        if (area != null && !area.isEmpty()) {
            java.util.Optional<UserProfile> byArea = userProfileRepository.findFirstByRoleAndAreaIgnoreCase(role, area);
            if (byArea.isPresent()) {
                return mapToResponse(byArea.get());
            }
        }
        
        if (district != null && !district.isEmpty()) {
            java.util.Optional<UserProfile> byDistrict = userProfileRepository.findFirstByRoleAndDistrictIgnoreCase(role, district);
            if (byDistrict.isPresent()) {
                return mapToResponse(byDistrict.get());
            }
        }
        
        return null;
    }

    @Transactional(readOnly = true)
    public Long getUserCount() {
        return userProfileRepository.count();
    }

    private UserProfileResponse mapToResponse(UserProfile profile) {
        return UserProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .phoneNumber(profile.getPhoneNumber())
                .address(profile.getAddress())
                .area(profile.getArea())
                .district(profile.getDistrict())
                .bio(profile.getBio())
                .avatarUrl(profile.getAvatarUrl())
                .department(profile.getDepartment())
                .role(profile.getRole())
                .latitude(profile.getLatitude())
                .longitude(profile.getLongitude())
                .nationality(profile.getNationality())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
