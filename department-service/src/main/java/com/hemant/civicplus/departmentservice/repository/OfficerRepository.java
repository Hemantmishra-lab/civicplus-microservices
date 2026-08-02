package com.hemant.civicplus.departmentservice.repository;

import com.hemant.civicplus.departmentservice.domain.Officer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfficerRepository extends JpaRepository<Officer, Long> {
    Optional<Officer> findByUserId(Long userId);
    List<Officer> findByDepartmentId(Long departmentId);
}
