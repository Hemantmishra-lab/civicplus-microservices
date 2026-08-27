package com.hemant.civicplus.complaintservice.kafka;

import com.hemant.civicplus.complaintservice.event.ComplaintEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "incident.messaging.mode", havingValue = "rest")
public class RestComplaintEventPublisher implements ComplaintEventPublisher {

    // Ensure you have a RestTemplate bean configured in your Spring Boot application (e.g. @LoadBalanced if using Eureka)
    private final RestTemplate restTemplate;

    private static final String NOTIFICATION_SERVICE_URL = "http://notification-service/api/v1/notifications";
    private static final String ANALYTICS_SERVICE_URL = "http://analytics-service/api/v1/analytics";

    @Override
    public void publishComplaintCreated(ComplaintEvent event) {
        log.info("Publishing ComplaintCreated event via REST (Synchronous) for complaint id: {}", event.getComplaintId());
        sendToDownstreamServices(event);
    }

    @Override
    public void publishComplaintUpdated(ComplaintEvent event) {
        log.info("Publishing ComplaintUpdated event via REST (Synchronous) for complaint id: {}", event.getComplaintId());
        sendToDownstreamServices(event);
    }

    private void sendToDownstreamServices(ComplaintEvent event) {
        try {
            log.debug("Sending event to Notification Service...");
            restTemplate.postForObject(NOTIFICATION_SERVICE_URL, event, Void.class);
        } catch (Exception e) {
            log.error("Failed to synchronously notify Notification Service for complaint: {}", event.getComplaintId(), e);
        }

        try {
            log.debug("Sending event to Analytics Service...");
            restTemplate.postForObject(ANALYTICS_SERVICE_URL, event, Void.class);
        } catch (Exception e) {
            log.error("Failed to synchronously notify Analytics Service for complaint: {}", event.getComplaintId(), e);
        }
    }
}
