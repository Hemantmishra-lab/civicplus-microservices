package com.hemant.civicplus.complaintservice.kafka;

import com.hemant.civicplus.complaintservice.event.ComplaintEvent;

public interface ComplaintEventPublisher {

    void publishComplaintCreated(ComplaintEvent event);

    void publishComplaintUpdated(ComplaintEvent event);

}
