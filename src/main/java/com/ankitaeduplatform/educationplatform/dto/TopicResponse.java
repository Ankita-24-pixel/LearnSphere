package com.ankitaeduplatform.educationplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopicResponse {

    private Long id;
    private String name;

    private Long chapterId;
    private String chapterName;

    private String subjectName;

    private int sem;

    private String courseName;
}
