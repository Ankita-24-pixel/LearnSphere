package com.ankitaeduplatform.educationplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubjectResponse {

    private Long id;
    private String name;

    private Long semId;
    private int sem;

    private String courseName;
}
