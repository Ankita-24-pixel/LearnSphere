package com.ankitaeduplatform.educationplatform.repository;

import com.ankitaeduplatform.educationplatform.entity.Content;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContentRepository extends JpaRepository<Content, Long> {

    List<Content> findAllByOrderByLikesDesc();
    Page<Content> findByTopicId(Long topicId, Pageable pageable);
    List<Content> findByTopic_Chapter_Id(Long id);
    List<Content> findByTitle(String keyword);
}
