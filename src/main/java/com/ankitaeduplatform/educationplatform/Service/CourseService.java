package com.ankitaeduplatform.educationplatform.Service;

import com.ankitaeduplatform.educationplatform.entity.*;
import com.ankitaeduplatform.educationplatform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

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

    public Course saveCourse(Course course){
        Optional<Course> existing =
                courseRepository.findByNameIgnoreCase(course.getName());

        if(existing.isPresent()){
            return existing.get();
        }
        return courseRepository.save(course);
    }
    public List<Course> getAllCourses(){
        return courseRepository.findAll();
    }
    public void deleteCourse(Long id){
        courseRepository.deleteById(id);
    }

    public Year saveYear(Year year){
        return yearRepository.save(year);
    }
    public List<Year> getAllYears(){
        return yearRepository.findAll();
    }
    public List<Year> getYearsByCourseId(Long courseId){
        return yearRepository.findByCourseId(courseId);
    }

    public Subject saveSubject(Subject subject){
        return subjectRepository.save(subject);
    }
    public List<Subject> getAllSubjects(){
        return subjectRepository.findAll();
    }
    public List<Subject> getSubjectsByYearId(Long semId){
        return subjectRepository.findBySemId(semId);
    }
    public List<Subject> searchBySubject(String keyword){
        return subjectRepository.findByNameContainingIgnoreCase(keyword);
    }

    public Chapter saveChapter(Chapter chapter){
        return chapterRepository.save(chapter);
    }
    public List<Chapter> getAllChapters(){
        return chapterRepository.findAll();
    }
    public List<Chapter> getChapterBySubjectId(Long subjectId){
        return chapterRepository.findBySubjectId(subjectId);
    }
    public List<Chapter> searchByChapter(String keyword){
        return chapterRepository.findByNameContainingIgnoreCase(keyword);
    }

    public Topic saveTopic(Topic topic){
        return topicRepository.save(topic);
    }
    public List<Topic> getAllTopics(){
        return topicRepository.findAll();
    }
    public List<Topic> getTopicByChapterId(Long chapterId){
        return topicRepository.findByChapterId(chapterId);
    }
    public List<Topic> searchByTopic(String keyword){
        return topicRepository.findByNameContainingIgnoreCase(keyword);
    }

}
