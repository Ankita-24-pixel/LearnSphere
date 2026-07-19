package com.ankitaeduplatform.educationplatform.Controller;

import com.ankitaeduplatform.educationplatform.Service.ContentService;
import com.ankitaeduplatform.educationplatform.dto.ContentResponse;
import com.ankitaeduplatform.educationplatform.entity.Content;
import com.ankitaeduplatform.educationplatform.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpRequest;
import org.springframework.http.ResponseEntity;
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
        System.out.println(
                "AUTH = " +
                        SecurityContextHolder.getContext().getAuthentication()
        );
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
        // Safely check who is currently looking at the data
        User currentUser = null;
        try {
            currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            // User is not logged in (fallback)
        }

        // Calculate our two new variables
        int totalLikes = c.getLikedByUsers().size();
        boolean isLiked = (currentUser != null) && c.getLikedByUsers().contains(currentUser);

        boolean isOwner = currentUser != null &&
                c.getUploadedBy().getId().equals(currentUser.getId());

        boolean isAdmin = currentUser != null &&
                "ADMIN".equals(currentUser.getRole());
        return new ContentResponse(
                c.getId(),
                c.getTitle(),
                c.getUrl(),
                totalLikes, // <-- Send the total count here
                c.getType().name(),
                c.getTopic().getId(),
                c.getUploadedBy().getUserName(),
                isLiked,// <-- Send the boolean here! (Make sure your DTO constructor accepts this)
                isOwner
        );
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<ContentResponse> likeContent(@PathVariable Long id){
        // Find out who is clicking the button
        User currentUser = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return contentService.getById(id)
                .map(content -> {
                    // TOGGLE LOGIC: If they already liked it, unlike it!
                    if (content.getLikedByUsers().contains(currentUser)) {
                        content.getLikedByUsers().remove(currentUser);
                    } else {
                        // Otherwise, add their like
                        content.getLikedByUsers().add(currentUser);
                    }
                    Content saved = contentService.save(content);

                    // Return the updated DTO back to React
                    return ResponseEntity.ok(mapTOdto(saved));
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
