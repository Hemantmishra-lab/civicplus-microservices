package com.hemant.civicplus.complaintservice.repository;

import com.hemant.civicplus.complaintservice.domain.StatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {
    List<StatusHistory> findByComplaintIdOrderByUpdatedAtAsc(Long complaintId);
    List<StatusHistory> findByComplaintId(Long complaintId);
}
