package com.ankitaeduplatform.educationplatform.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class HierarchyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; //course, topic, subject, chapter

    private String name;

    private String status = "PENDING";

    @ManyToOne
    private User requestedBy;
}
