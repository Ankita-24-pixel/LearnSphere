package com.ankitaeduplatform.educationplatform.repository;

import com.ankitaeduplatform.educationplatform.entity.HierarchyRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HierarchyRequestRepository extends JpaRepository<HierarchyRequest, Long > {
    List<HierarchyRequest> findByStatus(String status);
}
