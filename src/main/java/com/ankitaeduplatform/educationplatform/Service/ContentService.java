package com.ankitaeduplatform.educationplatform.Service;

import com.ankitaeduplatform.educationplatform.entity.Content;
import com.ankitaeduplatform.educationplatform.entity.Topic;
import com.ankitaeduplatform.educationplatform.entity.User;
import com.ankitaeduplatform.educationplatform.repository.ContentRepository;
import com.ankitaeduplatform.educationplatform.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContentService {
    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private TopicRepository topicRepository;

    public Content saveContent(Content content, User user){

        Long topicId = content.getTopic().getId();

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() ->
                        new RuntimeException("Topic not found"));

        Content newContent = new Content();

        newContent.setTitle(content.getTitle());
        newContent.setUrl(content.getUrl());
        newContent.setType(content.getType());
        newContent.setTopic(topic);
        newContent.setUploadedBy(user);

        return contentRepository.save(newContent);
    }
    public List<Content> getAllContent(){
        return contentRepository.findAll();
    }
    public Page<Content> getContentByTopicPaginated(

            Long topicId,
            int page,
            int size,
            String sortBy){

        Sort sort;

        switch (sortBy.toLowerCase()){

            case "likes":
                sort = Sort.by(Sort.Direction.DESC, "likes");
                break;

            case "oldest":
                sort = Sort.by(Sort.Direction.ASC, "createdAt");
                break;

            default:
                sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                sort
        );

        return contentRepository.findByTopicId(
                topicId,
                pageable
        );
    }
    public List<Content> getByChapter(Long chapterId){
        return contentRepository.findByTopic_Chapter_Id(chapterId);
    }
    public Optional<Content> getById(Long id){
        return contentRepository.findById(id);
    }
    public Content save(Content content){
        return contentRepository.save(content);
    }
    public void deleteById(Long id){
        contentRepository.deleteById(id);
    }
    public List<Content> getPopularContent(){
        return contentRepository.findAllByOrderByLikesDesc();
    }
    public List<Content> searchByTitle(String title){
        return contentRepository.findByTitle(title);
    }
    //pagination
    public Page<Content> getPaginatedContent(int page, int size, String sortBy){
        Sort sort;

        switch(sortBy.toLowerCase()){
            case "likes":
                sort = Sort.by(Sort.Direction.DESC, "likes");
                break;
            case "oldest":
                sort = Sort.by(Sort.Direction.ASC, "createdAt");
                break;
            default:
                sort = Sort.by(Sort.Direction.ASC, "createdAt");

        }
        Pageable pageable = PageRequest.of(page, size, sort);
        return contentRepository.findAll(pageable);
    }
}
