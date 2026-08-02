package com.hemant.civicplus.notificationservice.kafka;

import com.hemant.civicplus.notificationservice.application.NotificationService;
import com.hemant.civicplus.notificationservice.event.ComplaintEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintEventListener {

    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "complaint-events", groupId = "notification-group")
    @SuppressWarnings("null")
    public void handleComplaintEvent(ComplaintEvent event) {
        log.info("Received Kafka Event: Complaint ID {} is now {}", event.getComplaintId(), event.getStatus());

        String message = String.format("Grievance #%d '%s' has updated status to: %s",
                event.getComplaintId(), event.getTitle(), event.getStatus());

        // Save notification and email logs (we mock email address as citizenId@civicplus.com)
        notificationService.createNotificationAndLogEmail(
                event.getCitizenId(),
                message,
                event.getCitizenId() + "@civicplus.com"
        );

        // Push real-time WS STOMP update for Citizen
        String destination = "/topic/status/" + event.getCitizenId();
        log.info("Broadcasting WS STOMP notification to {}", destination);
        messagingTemplate.convertAndSend(destination, (Object) message);

        // Push real-time WS STOMP update for Assigned Officer
        if (event.getAssignedTo() != null) {
            String officerDestination = "/topic/status/" + event.getAssignedTo();
            log.info("Broadcasting WS STOMP notification to assigned officer {}", officerDestination);
            messagingTemplate.convertAndSend(officerDestination, (Object) message);
        }
    }
}
