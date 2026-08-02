package com.hemant.civicplus.notificationservice.repository;

import com.hemant.civicplus.notificationservice.domain.EmailLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailLogRepository extends JpaRepository<EmailLog, Long> {
}
