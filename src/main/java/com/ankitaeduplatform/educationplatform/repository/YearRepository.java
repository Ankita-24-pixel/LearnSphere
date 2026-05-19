package com.ankitaeduplatform.educationplatform.repository;

import com.ankitaeduplatform.educationplatform.entity.Year;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface YearRepository extends JpaRepository<Year, Long> {
    List<Year> findByCourseId(Long courseId);
}
