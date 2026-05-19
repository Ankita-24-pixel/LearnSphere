package com.ankitaeduplatform.educationplatform.Service;

import com.ankitaeduplatform.educationplatform.entity.HierarchyRequest;
import com.ankitaeduplatform.educationplatform.repository.HierarchyRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HierarchyRequestService {
    @Autowired
    private HierarchyRequestRepository hierarchyRequestRepository;

    public HierarchyRequest save(HierarchyRequest request){
        return hierarchyRequestRepository.save(request);
    }
    public List<HierarchyRequest> getPendingRequest(){
        return hierarchyRequestRepository.findByStatus("PENDING");
    }
    public HierarchyRequest getById(Long id){
        return hierarchyRequestRepository.findById(id).orElse(null);
    }
}
