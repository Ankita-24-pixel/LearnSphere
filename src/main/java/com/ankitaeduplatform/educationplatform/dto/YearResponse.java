package com.ankitaeduplatform.educationplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class YearResponse {

    private Long id;
    private int sem;

    private Long courseId;
    private String courseName;
}
