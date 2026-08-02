package com.hemant.civicplus.departmentservice.repository;

import com.hemant.civicplus.departmentservice.domain.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
