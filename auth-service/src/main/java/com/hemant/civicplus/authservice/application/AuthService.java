package com.hemant.civicplus.authservice.application;

import com.hemant.civicplus.authservice.domain.OtpEntity;
import com.hemant.civicplus.authservice.domain.RefreshToken;
import com.hemant.civicplus.authservice.domain.RoleEntity;
import com.hemant.civicplus.authservice.domain.UserEntity;
import com.hemant.civicplus.authservice.dto.AuthRequest;
import com.hemant.civicplus.authservice.dto.AuthResponse;
import com.hemant.civicplus.authservice.dto.RegisterRequest;
import com.hemant.civicplus.authservice.repository.OtpRepository;
import com.hemant.civicplus.authservice.repository.RefreshTokenRepository;
import com.hemant.civicplus.authservice.repository.RoleRepository;
import com.hemant.civicplus.authservice.repository.UserRepository;
import com.hemant.civicplus.authservice.security.JwtUtil;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String sanitizedEmail = request.getEmail().toLowerCase().trim();
        String sanitizedUsername = request.getUsername().trim();
        String sanitizedFullName = request.getFullName().trim();

        if (userRepository.existsByEmailIgnoreCase(sanitizedEmail)) {
            throw new RuntimeException("Email already in use");
        }
        
        if (userRepository.existsByUsernameIgnoreCase(sanitizedUsername)) {
            throw new RuntimeException("Username already in use");
        }

        String roleName = request.getRole() != null ? request.getRole().toUpperCase() : "ROLE_CITIZEN";
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }
        // Role Injection Prevention - only allow known valid roles
        java.util.Set<String> allowedRoles = java.util.Set.of(
            "ROLE_CITIZEN",
            "ROLE_DEPARTMENT",
            "ROLE_DEPARTMENTAL_OFFICER",
            "ROLE_HEAD_OFFICER",
            "ROLE_AREA_INCHARGE",
            "ROLE_SUPERVISOR",
            "ROLE_DISTRICT",
            "ROLE_HEADQUARTER"
        );
        if (!allowedRoles.contains(roleName)) {
            roleName = "ROLE_CITIZEN";
        }

        RoleEntity userRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        UserEntity user = UserEntity.builder()
                .fullName(sanitizedFullName)
                .username(sanitizedUsername)
                .email(sanitizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(userRole))
                .enabled(false) // User is disabled until OTP is verified
                .build();

        userRepository.save(user);

        // Generate OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        OtpEntity otpEntity = OtpEntity.builder()
                .email(sanitizedEmail)
                .otp(otp)
                .expiryDate(Instant.now().plusSeconds(600)) // 10 minutes
                .build();
        
        otpRepository.deleteByEmail(sanitizedEmail); // Delete old OTP if any
        otpRepository.save(otpEntity);

        emailService.sendOtpEmail(sanitizedEmail, otp);

        return AuthResponse.builder()
                .message("User registered successfully. OTP sent to email for verification.")
                .build();
    }

    @Transactional
    public AuthResponse verifyAccount(String email, String otp) {
        OtpEntity otpEntity = otpRepository.findByEmailAndOtp(email, otp)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if (otpEntity.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("OTP has expired");
        }

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(true);
        userRepository.save(user);

        otpRepository.deleteByEmail(email);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .collect(Collectors.toList()));
        
        String accessToken = jwtUtil.generateToken(claims, userDetails);
        RefreshToken refreshToken = createRefreshToken(user.getId());
        String roleStr = user.getRoles().stream().findFirst().map(r -> r.getName().replace("ROLE_", "")).orElse("CITIZEN");

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .role(roleStr)
                .message("Account verified successfully")
                .username(user.getUsername())
                .build();
    }

    @Transactional
    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        UserEntity user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        if (!user.getEnabled()) {
            throw new RuntimeException("User account is not verified");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .collect(Collectors.toList()));

        String accessToken = jwtUtil.generateToken(claims, userDetails);
        
        // Remove old tokens
        refreshTokenRepository.deleteByUser(user);
        RefreshToken refreshToken = createRefreshToken(user.getId());

        String roleStr = user.getRoles().stream().findFirst().map(r -> r.getName().replace("ROLE_", "")).orElse("CITIZEN");

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .role(roleStr)
                .message("Authentication successful")
                .username(user.getUsername())
                .build();
    }

    public void forgotPassword(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new RuntimeException("User not found");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        OtpEntity otpEntity = OtpEntity.builder()
                .email(email)
                .otp(otp)
                .expiryDate(Instant.now().plusSeconds(600)) // 10 minutes
                .build();
        
        otpRepository.deleteByEmail(email);
        otpRepository.save(otpEntity);

        emailService.sendOtpEmail(email, otp);
    }

    public void verifyOtp(String email, String otp) {
        OtpEntity otpEntity = otpRepository.findByEmailAndOtp(email, otp)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if (otpEntity.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("OTP has expired");
        }
    }

    @Transactional
    public void resetPassword(String email, String otp, String newPassword) {
        verifyOtp(email, otp);

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        otpRepository.deleteByEmail(email);
    }

    public RefreshToken createRefreshToken(@NonNull Long userId) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(userRepository.findById(userId).orElseThrow())
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(604800000)) // 7 days
                .build();
        return refreshTokenRepository.save(refreshToken);
    }
}
