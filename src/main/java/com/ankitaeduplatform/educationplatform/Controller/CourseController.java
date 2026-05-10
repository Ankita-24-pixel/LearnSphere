package com.ankitaeduplatform.educationplatform.Controller;

import com.ankitaeduplatform.educationplatform.entity.*;
import com.ankitaeduplatform.educationplatform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/course")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private YearRepository yearRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private TopicRepository topicRepository;

    @PostMapping
    public Course addCourse(@RequestBody Course course){
        return courseRepository.save(course);
    }

    @GetMapping
    public List<Course> getAllCourses(){
        return courseRepository.findAll();
    }

    @PostMapping("/year")
    public Year addYear(@RequestBody Year year){
        return yearRepository.save(year);
    }

    @GetMapping("/year")
    public List<Year> getAllYears(){
        return yearRepository.findAll();
    }

    @PostMapping("/subject")
    public Subject addSubject(@RequestBody Subject subject){
        return subjectRepository.save(subject);
    }

    @GetMapping("/subject")
    public List<Subject> getAllSubjects(){
        return subjectRepository.findAll();
    }

    @PostMapping("/chapter")
    public Chapter addChapter(@RequestBody Chapter chapter){
        return chapterRepository.save(chapter);
    }

    @GetMapping("/chapter")
    public List<Chapter> getAllChapters(){
        return chapterRepository.findAll();
    }

    @PostMapping("/topic")
    public Topic addTopic(@RequestBody Topic topic){
        return topicRepository.save(topic);
    }

    @GetMapping("/topic")
    public List<Topic> getAllTopics(){
        return topicRepository.findAll();
    }
}
