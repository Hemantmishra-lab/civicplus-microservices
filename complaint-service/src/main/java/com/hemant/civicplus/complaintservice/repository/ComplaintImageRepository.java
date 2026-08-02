package com.hemant.civicplus.complaintservice.repository;

import com.hemant.civicplus.complaintservice.domain.ComplaintImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplaintImageRepository extends JpaRepository<ComplaintImage, Long> {
}
