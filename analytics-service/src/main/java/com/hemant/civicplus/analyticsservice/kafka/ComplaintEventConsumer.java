package com.hemant.civicplus.analyticsservice.kafka;

import com.hemant.civicplus.analyticsservice.event.ComplaintEvent;
import com.hemant.civicplus.analyticsservice.repository.ComplaintStatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintEventConsumer {

    private final ComplaintStatRepository complaintStatRepository;

    @KafkaListener(topics = "complaint-events", groupId = "analytics-group")
    @Transactional
    public void consumeComplaintEvent(ComplaintEvent event) {
        log.info("Received Kafka Event for Analytics: Complaint ID {} is now {}", event.getComplaintId(), event.getStatus());
        
        String status = event.getStatus().toUpperCase();
        complaintStatRepository.incrementCount(status);
        log.info("Incremented aggregate count for status: {}", status);
    }
}
