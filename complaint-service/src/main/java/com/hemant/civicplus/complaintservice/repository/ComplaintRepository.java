package com.hemant.civicplus.complaintservice.repository;

import com.hemant.civicplus.complaintservice.domain.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByCitizenId(Long citizenId);
    List<Complaint> findByAssignedTo(Long officerId);

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Complaint c WHERE " +
            "(:status IS NULL OR c.status = :status) AND " +
            "(:department IS NULL OR c.department = :department) AND " +
            "(:area IS NULL OR c.area = :area)")
    org.springframework.data.domain.Page<Complaint> searchComplaints(
            @org.springframework.data.repository.query.Param("status") com.hemant.civicplus.complaintservice.domain.ComplaintStatus status,
            @org.springframework.data.repository.query.Param("department") String department,
            @org.springframework.data.repository.query.Param("area") String area,
            org.springframework.data.domain.Pageable pageable);
}
