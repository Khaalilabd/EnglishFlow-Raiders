package com.microservices.complaints.controller;

import com.microservices.complaints.entity.Complaint;
import com.microservices.complaints.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable Long id) {
        return complaintRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public List<Complaint> getComplaintsByStudent(@PathVariable Long studentId) {
        return complaintRepository.findByStudentId(studentId);
    }

    @GetMapping("/status/{status}")
    public List<Complaint> getComplaintsByStatus(@PathVariable String status) {
        return complaintRepository.findByStatus(status);
    }

    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        return complaintRepository.save(complaint);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Complaint> updateComplaint(@PathVariable Long id, @RequestBody Complaint complaintDetails) {
        return complaintRepository.findById(id)
                .map(complaint -> {
                    complaint.setTitle(complaintDetails.getTitle());
                    complaint.setDescription(complaintDetails.getDescription());
                    complaint.setCategory(complaintDetails.getCategory());
                    complaint.setStatus(complaintDetails.getStatus());
                    complaint.setPriority(complaintDetails.getPriority());
                    complaint.setResponse(complaintDetails.getResponse());
                    return ResponseEntity.ok(complaintRepository.save(complaint));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable Long id) {
        return complaintRepository.findById(id)
                .map(complaint -> {
                    complaintRepository.delete(complaint);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<Complaint> resolveComplaint(
            @PathVariable Long id, 
            @RequestBody com.microservices.complaints.dto.ComplaintResolutionDTO resolution) {
        return complaintRepository.findById(id)
                .map(complaint -> {
                    complaint.setStatus(resolution.getStatus());
                    complaint.setResponse(resolution.getResponse());
                    complaint.setHandledBy(resolution.getHandledBy());
                    complaint.setHandledByUserId(resolution.getHandledByUserId());
                    
                    // Si résolu ou fermé, enregistrer la date
                    if ("RESOLVED".equals(resolution.getStatus()) || "CLOSED".equals(resolution.getStatus())) {
                        complaint.setResolvedAt(java.time.LocalDateTime.now());
                    }
                    
                    return ResponseEntity.ok(complaintRepository.save(complaint));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
