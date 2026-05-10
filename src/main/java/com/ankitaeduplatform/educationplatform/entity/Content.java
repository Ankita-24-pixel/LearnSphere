package com.ankitaeduplatform.educationplatform.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private int likes = 0;

    @Enumerated(EnumType.STRING)
    private ContentType type;

    @ManyToOne
    private Topic topic;

    private String uploadedBy;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ContentType{
        VIDEO,
        PDF,
        PYQ
    }
}
