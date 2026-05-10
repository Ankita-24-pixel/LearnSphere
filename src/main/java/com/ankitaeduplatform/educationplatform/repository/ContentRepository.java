package com.ankitaeduplatform.educationplatform.repository;

import com.ankitaeduplatform.educationplatform.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContentRepository extends JpaRepository<Content, Long> {

    List<Content> findAllByOrderByLikesDesc();
    List<Content> findByTopicId(Long topicId);


    List<Content> findByTopic_Chapter_Id(Long id);
}
