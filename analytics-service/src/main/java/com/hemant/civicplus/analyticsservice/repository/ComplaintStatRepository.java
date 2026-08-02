package com.hemant.civicplus.analyticsservice.repository;

import com.hemant.civicplus.analyticsservice.domain.ComplaintStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplaintStatRepository extends JpaRepository<ComplaintStat, String> {

    @Modifying
    @Query("UPDATE ComplaintStat c SET c.statusCount = c.statusCount + 1 WHERE c.status = :status")
    void incrementCount(String status);
}
