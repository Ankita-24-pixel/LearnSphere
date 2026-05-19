package com.ankitaeduplatform.educationplatform.Controller;

import com.ankitaeduplatform.educationplatform.Service.HierarchyRequestService;
import com.ankitaeduplatform.educationplatform.entity.HierarchyRequest;
import com.ankitaeduplatform.educationplatform.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requests")
public class HierarchyRequestController {

    @Autowired
    private HierarchyRequestService hierarchyRequestService;

    @PostMapping
    public HierarchyRequest createRequest(@RequestBody HierarchyRequest request){
        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        request.setRequestedBy(user);
        return hierarchyRequestService.save(request);
    }
    @GetMapping("/pending")
    private List<HierarchyRequest> pendingRequests(){
        return hierarchyRequestService.getPendingRequest();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public String approveRequest(@PathVariable Long id){
        HierarchyRequest request = hierarchyRequestService.getById(id);

        if(request == null){
            return "Request not found";
        }
        request.setStatus("APPROVED");
        hierarchyRequestService.save(request);
        return "Request approved";
    }


}
