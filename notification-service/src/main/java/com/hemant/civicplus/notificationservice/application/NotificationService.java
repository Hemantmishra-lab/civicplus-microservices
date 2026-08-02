package com.hemant.civicplus.notificationservice.application;

import com.hemant.civicplus.notificationservice.domain.EmailLog;
import com.hemant.civicplus.notificationservice.domain.Notification;
import com.hemant.civicplus.notificationservice.repository.EmailLogRepository;
import com.hemant.civicplus.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailLogRepository emailLogRepository;

    @Transactional(readOnly = true)
    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public void createNotificationAndLogEmail(Long userId, String message, String recipientEmail) {
        Notification notification = Objects.requireNonNull(Notification.builder()
                .userId(userId)
                .message(message)
                .readStatus(false)
                .build());
        Objects.requireNonNull(notificationRepository.save(notification));

        EmailLog emailLog = Objects.requireNonNull(EmailLog.builder()
                .recipient(recipientEmail)
                .subject("CivicPlus Grievance Alert")
                .body(message)
                .sentStatus("SENT")
                .build());
        Objects.requireNonNull(emailLogRepository.save(emailLog));

        log.info("Notification successfully logged and saved in DB for user: {}", userId);
    }
}
