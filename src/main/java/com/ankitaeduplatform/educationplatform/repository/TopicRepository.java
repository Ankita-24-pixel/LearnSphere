package com.ankitaeduplatform.educationplatform.repository;

import com.ankitaeduplatform.educationplatform.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByChapterId(Long chapterId);
    List<Topic> findByNameContainingIgnoreCase(String keyword);
}
