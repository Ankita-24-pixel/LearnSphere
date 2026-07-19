package com.ankitaeduplatform.educationplatform.Controller;

import com.ankitaeduplatform.educationplatform.Service.CourseService;
import com.ankitaeduplatform.educationplatform.dto.*;
import com.ankitaeduplatform.educationplatform.entity.*;
import com.ankitaeduplatform.educationplatform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/course")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public Course addCourse(@RequestBody Course course){
        return courseService.saveCourse(course);
    }

    @GetMapping
    public List<CourseResponse> getAllCourses(){
        return courseService.getAllCourses()
                .stream()
                .map(course -> new CourseResponse(
                        course.getId(),
                        course.getName()
                ))
                .toList();
    }

    @PostMapping("/year")
    public Year addYear(@RequestBody Year year){
        return courseService.saveYear(year);
    }

    @GetMapping("/years")
    public List<YearResponse> getAllYears(){
        return courseService.getAllYears()
                .stream()
                .map(year -> new YearResponse(
                        year.getId(),
                        year.getSem(),
                        year.getCourse().getId(),
                        year.getCourse().getName()
                ))
                .toList();
    }
    @GetMapping("/{courseId}/years")
    public List<YearResponse> getAllYearsByCourseId(@PathVariable Long courseId){
        return courseService.getYearsByCourseId(courseId)
                .stream()
                .map(year -> new YearResponse(
                        year.getId(),
                        year.getSem(),
                        year.getCourse().getId(),
                        year.getCourse().getName()
                ))
                .toList();
    }

    @PostMapping("/subject")
    public Subject addSubject(@RequestBody Subject subject){
        return courseService.saveSubject(subject);
    }

    @GetMapping("/subjects")
    public List<SubjectResponse> getAllSubjects(){
        return courseService.getAllSubjects()
                .stream()
                .map(subject -> new SubjectResponse(
                        subject.getId(),
                        subject.getName(),
                        subject.getSem().getId(),
                        subject.getSem().getSem(),
                        subject.getSem().getCourse().getName()
                ))
                .toList();
    }
    @GetMapping("/year/{semId}/subjects")
    public List<SubjectResponse> getAllSubjectsByYearId(@PathVariable Long semId){
        return courseService.getSubjectsByYearId(semId)
                .stream()
                .map(subject -> new SubjectResponse(
                        subject.getId(),
                        subject.getName(),
                        subject.getSem().getId(),
                        subject.getSem().getSem(),
                        subject.getSem().getCourse().getName()
                ))
                .toList();
    }
    @GetMapping("/subject/search")
    public List<SubjectResponse> searchSubject(@RequestParam String keyword){
        return courseService.searchBySubject(keyword)
                .stream()
                .map(subject -> new SubjectResponse(
                        subject.getId(),
                        subject.getName(),
                        subject.getSem().getId(),
                        subject.getSem().getSem(),
                        subject.getSem().getCourse().getName()
                ))
                .toList();
    }

    @PostMapping("/chapter")
    public Chapter addChapter(@RequestBody Chapter chapter){
        return courseService.saveChapter(chapter);
    }

    @GetMapping("/chapters")
    public List<ChapterResponse> getAllChapters(){
        return courseService.getAllChapters()
                .stream()
                .map(chapter -> new ChapterResponse(
                        chapter.getId(),
                        chapter.getName(),
                        chapter.getSubject().getId(),
                        chapter.getSubject().getName(),
                        chapter.getSubject().getSem().getSem(),
                        chapter.getSubject().getSem().getCourse().getName()
                )).toList();
    }
    @GetMapping("/subject/{subjectId}/chapters")
    public List<ChapterResponse> getAllChaptersBySubjectId(@PathVariable Long subjectId){
        return courseService.getChapterBySubjectId(subjectId)
                .stream()
                .map(chapter -> new ChapterResponse(
                        chapter.getId(),
                        chapter.getName(),
                        chapter.getSubject().getId(),
                        chapter.getSubject().getName(),
                        chapter.getSubject().getSem().getSem(),
                        chapter.getSubject().getSem().getCourse().getName()
                )).toList();
    }
    @GetMapping("/chapter/search")
    public List<ChapterResponse> searchChapter(@RequestParam String keyword){
        return courseService.searchByChapter(keyword)
                .stream()
                .map(chapter -> new ChapterResponse(
                        chapter.getId(),
                        chapter.getName(),
                        chapter.getSubject().getId(),
                        chapter.getSubject().getName(),
                        chapter.getSubject().getSem().getSem(),
                        chapter.getSubject().getSem().getCourse().getName()
                )).toList();
    }

    @PostMapping("/topic")
    public Topic addTopic(@RequestBody Topic topic){
        return courseService.saveTopic(topic);
    }

    @GetMapping("/topics")
    public List<TopicResponse> getAllTopics(){
        return courseService.getAllTopics()
                .stream()
                .map(topic -> new TopicResponse(
                        topic.getId(),
                        topic.getName(),
                        topic.getChapter().getId(),
                        topic.getChapter().getName(),
                        topic.getChapter().getSubject().getName(),
                        topic.getChapter().getSubject().getSem().getSem(),
                        topic.getChapter().getSubject().getSem().getCourse().getName()
                )).toList();
    }
    @GetMapping("/chapter/{chapterId}/topics")
    public List<TopicResponse> getAllTopicsByChapterId(@PathVariable Long chapterId){
        return courseService.getTopicByChapterId(chapterId)
                .stream()
                .map(topic -> new TopicResponse(
                        topic.getId(),
                        topic.getName(),
                        topic.getChapter().getId(),
                        topic.getChapter().getName(),
                        topic.getChapter().getSubject().getName(),
                        topic.getChapter().getSubject().getSem().getSem(),
                        topic.getChapter().getSubject().getSem().getCourse().getName()
                )).toList();
    }
    @GetMapping("/topic/search")
    public List<TopicResponse> searchTopics(@RequestParam String keyword){
        return courseService.searchByTopic(keyword)
                .stream()
                .map(topic -> new TopicResponse(
                        topic.getId(),
                        topic.getName(),
                        topic.getChapter().getId(),
                        topic.getChapter().getName(),
                        topic.getChapter().getSubject().getName(),
                        topic.getChapter().getSubject().getSem().getSem(),
                        topic.getChapter().getSubject().getSem().getCourse().getName()
                )).toList();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id){
        courseService.deleteCourse(id);
        return ResponseEntity.ok("Course deleted successfully");
    }
}
