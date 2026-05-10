package com.ankitaeduplatform.educationplatform.Controller;

import com.ankitaeduplatform.educationplatform.dto.ContentResponse;
import com.ankitaeduplatform.educationplatform.entity.Content;
import com.ankitaeduplatform.educationplatform.repository.ContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/content")
public class ContentController {

    @Autowired
    private ContentRepository contentRepository;

    @PostMapping
    public ContentResponse addContent(@RequestBody Content content){
        String loggedIn = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        content.setUploadedBy(loggedIn);
        Content saved = contentRepository.save(content);
        return new ContentResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getUrl(),
                saved.getLikes(),
                saved.getType().name(),
                saved.getTopic().getId(),
                saved.getUploadedBy()
        );
    }

    @GetMapping("/topic/{id}")
    public List<ContentResponse> getContentByTopic(@PathVariable Long id){
        List<Content> contents = contentRepository.findByTopicId(id);

        return contents.stream()
                .map(c -> new ContentResponse(
                        c.getId(),
                        c.getTitle(),
                        c.getUrl(),
                        c.getLikes(),
                        c.getType().name(),
                        c.getTopic().getId(),
                        c.getUploadedBy()
                ))
                .toList();
    }

    @GetMapping
    public List<ContentResponse> getAllContent() {
        return contentRepository.findAll()
                .stream()
                .map(this::mapTOdto)
                .toList();
    }

    @GetMapping("/chapter/{id}")
    public List<ContentResponse> getContentByChapter(@PathVariable Long id){
        List<Content> contents = contentRepository.findByTopic_Chapter_Id(id);
        return contents.stream()
                .map(this::mapTOdto)
                .toList();
    }

    private ContentResponse mapTOdto(Content c) {
        return new ContentResponse(
                c.getId(),
                c.getTitle(),
                c.getUrl(),
                c.getLikes(),
                c.getType().name(),
                c.getTopic().getId(),
                c.getUploadedBy()
        );
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<Content> likeContent(@PathVariable Long id){
        return contentRepository.findById(id)
                .map(content -> {
                    content.setLikes(content.getLikes() + 1);
                    return ResponseEntity.ok(contentRepository.save(content));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
