package com.hemant.civicplus.userservice.controller;

import com.hemant.civicplus.userservice.application.UserService;
import com.hemant.civicplus.userservice.dto.UserProfileRequest;
import com.hemant.civicplus.userservice.dto.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users/profile")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Value("${server.port:8082}")
    private String serverPort;

    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile() {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(userService.getProfileByUserId(userId));
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateProfile(@RequestBody UserProfileRequest request) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(userService.createOrUpdateProfile(userId, request));
    }

    @GetMapping("/nearest")
    public ResponseEntity<UserProfileResponse> getNearestOfficer(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String district,
            @RequestParam String role) {
        UserProfileResponse response = userService.getNearestOfficer(lat, lng, area, district, role);
        if (response != null) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/internal/count")
    public ResponseEntity<Long> getUserCount() {
        return ResponseEntity.ok(userService.getUserCount());
    }

    @PostMapping("/avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String fileName = StringUtils.cleanPath(originalFilename != null ? originalFilename : "unknown");
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path uploadPath = Paths.get("uploads/avatars");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "http://localhost:" + serverPort + "/uploads/avatars/" + uniqueFileName;
            return ResponseEntity.ok(Map.of("url", fileUrl));
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file", ex);
        }
    }
}
