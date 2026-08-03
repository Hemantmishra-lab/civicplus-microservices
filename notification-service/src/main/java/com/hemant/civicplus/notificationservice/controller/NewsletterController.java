package com.hemant.civicplus.notificationservice.controller;

import com.hemant.civicplus.notificationservice.application.NotificationService;
import com.hemant.civicplus.notificationservice.dto.NewsletterSubscribeRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NotificationService notificationService;

    /**
     * POST /api/v1/newsletter/subscribe
     * Public endpoint — no authentication required.
     * Body: { "email": "user@example.com" }
     */
    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(
            @Valid @RequestBody NewsletterSubscribeRequest request) {

        notificationService.subscribeToNewsletter(request.getEmail());
        return ResponseEntity.ok(Map.of(
                "message", "Thank you for subscribing! You will now receive the latest city updates directly in your inbox."
        ));
    }
}
