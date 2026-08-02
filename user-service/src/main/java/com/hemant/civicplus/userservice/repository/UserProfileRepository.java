package com.hemant.civicplus.userservice.repository;

import com.hemant.civicplus.userservice.domain.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUserId(Long userId);

    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM user_profiles u WHERE u.role = ?3 AND u.latitude IS NOT NULL AND u.longitude IS NOT NULL " +
            "AND (6371 * acos(cos(radians(?1)) * cos(radians(u.latitude)) * cos(radians(u.longitude) - radians(?2)) + sin(radians(?1)) * sin(radians(u.latitude)))) <= 50 " +
            "ORDER BY (6371 * acos(cos(radians(?1)) * cos(radians(u.latitude)) * cos(radians(u.longitude) - radians(?2)) + sin(radians(?1)) * sin(radians(u.latitude)))) ASC LIMIT 1", nativeQuery = true)
    Optional<UserProfile> findNearestOfficerByRole(Double lat, Double lng, String role);

    Optional<UserProfile> findFirstByRoleAndAreaIgnoreCase(String role, String area);
    Optional<UserProfile> findFirstByRoleAndDistrictIgnoreCase(String role, String district);
}
