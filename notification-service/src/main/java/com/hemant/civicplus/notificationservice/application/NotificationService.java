package com.hemant.civicplus.notificationservice.application;

import com.hemant.civicplus.notificationservice.domain.EmailLog;
import com.hemant.civicplus.notificationservice.domain.Notification;
import com.hemant.civicplus.notificationservice.domain.NewsletterSubscriber;
import com.hemant.civicplus.notificationservice.repository.EmailLogRepository;
import com.hemant.civicplus.notificationservice.repository.NotificationRepository;
import com.hemant.civicplus.notificationservice.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailLogRepository emailLogRepository;
    private final NewsletterSubscriberRepository newsletterSubscriberRepository;

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

    /**
     * Subscribe an email address to the CivicPlus newsletter.
     * Idempotent: if the email already exists and is active, this is a no-op.
     * If the email was previously unsubscribed it is re-activated.
     *
     * @param email the subscriber's email address
     */
    @Transactional
    public void subscribeToNewsletter(String email) {
        Optional<NewsletterSubscriber> existing = newsletterSubscriberRepository.findByEmail(email);
        if (existing.isPresent()) {
            NewsletterSubscriber subscriber = existing.get();
            if (!subscriber.getActive()) {
                subscriber.setActive(true);
                newsletterSubscriberRepository.save(subscriber);
                log.info("Re-activated newsletter subscription for: {}", email);
            } else {
                log.info("Email already subscribed (active): {}", email);
            }
            return;
        }
        NewsletterSubscriber subscriber = NewsletterSubscriber.builder()
                .email(email)
                .active(true)
                .build();
        newsletterSubscriberRepository.save(subscriber);
        log.info("New newsletter subscription saved for: {}", email);
    }
}
