package com.ankitaeduplatform.educationplatform.Controller;

import com.ankitaeduplatform.educationplatform.Service.ContentService;
import com.ankitaeduplatform.educationplatform.dto.ContentResponse;
import com.ankitaeduplatform.educationplatform.entity.Content;
import com.ankitaeduplatform.educationplatform.entity.User;
import com.ankitaeduplatform.educationplatform.repository.ContentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/content")
public class ContentController {

    @Autowired
    private ContentService contentService;


    @PostMapping
    public ContentResponse addContent(@Valid @RequestBody Content content){
        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        content.setUploadedBy(user);
        Content saved = contentService.saveContent(content, user);
        return mapTOdto(saved);
    }

    @GetMapping("/topic/{id}/paginated")
    public Page<ContentResponse> getContentByTopicPaginated(

            @PathVariable Long id,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "latest")
            String sort){

        return contentService
                .getContentByTopicPaginated(
                        id,
                        page,
                        size,
                        sort
                )
                .map(this::mapTOdto);
    }

    @GetMapping
    public List<ContentResponse> getAllContent() {
        return contentService.getAllContent()
                .stream()
                .map(this::mapTOdto)
                .toList();
    }

    @GetMapping("/chapter/{id}")
    public List<ContentResponse> getContentByChapter(@PathVariable Long id){
        List<Content> contents = contentService.getByChapter(id);
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
                c.getUploadedBy().getUserName()
        );
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<Content> likeContent(@PathVariable Long id){
        return contentService.getById(id)
                .map(content -> {
                    content.setLikes(content.getLikes() + 1);
                    return ResponseEntity.ok(contentService.save(content));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/popular")
    public List<ContentResponse> getPopularContent(){
        return contentService.getPopularContent()
                .stream()
                .map(this::mapTOdto)
                .toList();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContent(@PathVariable Long id){
        User currentUser = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return contentService.getById(id)
                .map(content -> {
                    boolean isOwner = content.getUploadedBy()
                            .getId()
                            .equals(currentUser.getId());

                    boolean isAdmin =
                            currentUser.getRole().equals("ADMIN");

                    if(!isOwner && !isAdmin){
                        return ResponseEntity
                                .status(403)
                                .body("You are not allowed to delete this content");
                    }
                    contentService.deleteById(id);
                    return ResponseEntity.ok("Content deleted successfully");
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/search")
    public List<ContentResponse> searchContent(@RequestParam String keyword){
        return contentService.searchByTitle(keyword)
                .stream()
                .map(this::mapTOdto)
                .toList();
    }

    //pagination
    @GetMapping("/paginated")
    public Page<ContentResponse> getPaginatedContent(@RequestParam (defaultValue = "0") int page, @RequestParam (defaultValue = "10") int size, @RequestParam(defaultValue = "latest") String sort){
        return contentService
                .getPaginatedContent(page, size, sort)
                .map(this::mapTOdto);

    }
}
