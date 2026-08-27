package com.hemant.civicplus.complaintservice.kafka;

import com.hemant.civicplus.complaintservice.event.ComplaintEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "incident.messaging.mode", havingValue = "kafka", matchIfMissing = true)
public class KafkaComplaintEventPublisher implements ComplaintEventPublisher {

    private final KafkaTemplate<String, ComplaintEvent> kafkaTemplate;
    private static final String TOPIC = "complaint-events";

    @Override
    public void publishComplaintCreated(ComplaintEvent event) {
        log.info("Publishing ComplaintCreated event for complaint id: {}", event.getComplaintId());
        kafkaTemplate.send(TOPIC, "CREATED_" + event.getComplaintId(), event);
    }

    @Override
    public void publishComplaintUpdated(ComplaintEvent event) {
        log.info("Publishing ComplaintUpdated event for complaint id: {}", event.getComplaintId());
        kafkaTemplate.send(TOPIC, "UPDATED_" + event.getComplaintId(), event);
    }
}
