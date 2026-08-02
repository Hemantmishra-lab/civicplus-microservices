package com.hemant.civicplus.complaintservice.repository;

import com.hemant.civicplus.complaintservice.domain.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByCitizenId(Long citizenId);
    List<Complaint> findByAssignedTo(Long officerId);
}
