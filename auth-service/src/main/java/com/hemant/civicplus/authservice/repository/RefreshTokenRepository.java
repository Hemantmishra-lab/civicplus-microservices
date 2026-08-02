package com.hemant.civicplus.authservice.repository;

import com.hemant.civicplus.authservice.domain.RefreshToken;
import com.hemant.civicplus.authservice.domain.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    
    @Modifying
    int deleteByUser(UserEntity user);
}
