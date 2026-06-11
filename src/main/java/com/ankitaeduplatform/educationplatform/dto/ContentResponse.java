package com.ankitaeduplatform.educationplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContentResponse {

    private Long id;
    private String title;
    private String url;
    private int likes;
    private String type;
    private Long topicId;

    private String uploadedByName;
    private boolean isLikedByCurrentUser;
    private boolean isOwner;

}
