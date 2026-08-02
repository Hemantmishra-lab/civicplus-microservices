package com.hemant.civicplus.authservice.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    private final String fromEmail = "h3086097@gmail.com";

    /**
     * Sends OTP email asynchronously. Email failures are logged as warnings
     * so they never crash the registration transaction.
     */
    @Async
    public void sendOtpEmail(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Your CivicPlus Account OTP");
            message.setText("Your OTP for CivicPlus account verification is: " + otp + "\n\nThis OTP is valid for 10 minutes.");
            mailSender.send(message);
            log.info("OTP email sent successfully to {}", to);
        } catch (Exception e) {
            // Log but do NOT rethrow â€” email failure should never fail registration
            log.warn("[DEV] Failed to send OTP email to {}. OTP for testing: {}. Error: {}", to, otp, e.getMessage());
        }
    }
}
