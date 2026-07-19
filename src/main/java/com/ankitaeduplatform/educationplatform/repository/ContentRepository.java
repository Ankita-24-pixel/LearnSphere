package com.ankitaeduplatform.educationplatform.repository;

import com.ankitaeduplatform.educationplatform.entity.Content;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ContentRepository extends JpaRepository<Content, Long> {

    @Query("SELECT c FROM Content c ORDER BY SIZE(c.likedByUsers) DESC")
    List<Content> findAllByOrderByLikesDesc();
    Page<Content> findByTopicId(Long topicId, Pageable pageable);
    List<Content> findByTopic_Chapter_Id(Long id);
    List<Content> findByTitle(String keyword);
}
