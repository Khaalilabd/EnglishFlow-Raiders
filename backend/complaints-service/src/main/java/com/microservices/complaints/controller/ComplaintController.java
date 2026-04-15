package com.microservices.complaints.controller;

import com.microservices.complaints.entity.Complaint;
import com.microservices.complaints.messaging.ComplaintEventPublisher;
import com.microservices.complaints.messaging.events.ComplaintCreatedEvent;
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

    @Autowired
    private ComplaintEventPublisher eventPublisher;

    @GetMapping
    public List<Complaint> getAllComplaints(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDir) {
        List<Complaint> complaints;
        if (search != null || status != null || priority != null || category != null) {
            String s = (search != null && !search.isBlank()) ? search : null;
            String st = (status != null && !status.isBlank()) ? status : null;
            String pr = (priority != null && !priority.isBlank()) ? priority : null;
            String cat = (category != null && !category.isBlank()) ? category : null;
            complaints = complaintRepository.searchComplaints(null, s, st, pr, cat);
        } else {
            complaints = complaintRepository.findAll();
        }
        if (sortBy != null && !sortBy.isEmpty()) {
            java.util.Comparator<Complaint> cmp = switch (sortBy) {
                case "status" -> java.util.Comparator.comparing(c -> c.getStatus() != null ? c.getStatus() : "");
                case "priority" -> java.util.Comparator.comparing(c -> c.getPriority() != null ? c.getPriority() : "");
                case "createdAt" -> java.util.Comparator.comparing(c -> c.getCreatedAt() != null ? c.getCreatedAt().toString() : "");
                default -> java.util.Comparator.comparing(c -> c.getTitle() != null ? c.getTitle().toLowerCase() : "");
            };
            if ("desc".equalsIgnoreCase(sortDir)) cmp = cmp.reversed();
            complaints = complaints.stream().sorted(cmp).collect(java.util.stream.Collectors.toList());
        }
        return complaints;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable Long id) {
        return complaintRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public List<Complaint> getComplaintsByStudent(
            @PathVariable Long studentId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDir) {
        List<Complaint> complaints;
        if (search != null || status != null || priority != null || category != null) {
            String s = (search != null && !search.isBlank()) ? search : null;
            String st = (status != null && !status.isBlank()) ? status : null;
            String pr = (priority != null && !priority.isBlank()) ? priority : null;
            String cat = (category != null && !category.isBlank()) ? category : null;
            complaints = complaintRepository.searchComplaints(studentId, s, st, pr, cat);
        } else {
            complaints = complaintRepository.findByStudentId(studentId);
        }
        if (sortBy != null && !sortBy.isEmpty()) {
            java.util.Comparator<Complaint> cmp = switch (sortBy) {
                case "status" -> java.util.Comparator.comparing(c -> c.getStatus() != null ? c.getStatus() : "");
                case "priority" -> java.util.Comparator.comparing(c -> c.getPriority() != null ? c.getPriority() : "");
                case "createdAt" -> java.util.Comparator.comparing(c -> c.getCreatedAt() != null ? c.getCreatedAt().toString() : "");
                default -> java.util.Comparator.comparing(c -> c.getTitle() != null ? c.getTitle().toLowerCase() : "");
            };
            if ("desc".equalsIgnoreCase(sortDir)) cmp = cmp.reversed();
            complaints = complaints.stream().sorted(cmp).collect(java.util.stream.Collectors.toList());
        }
        return complaints;
    }

    @GetMapping("/status/{status}")
    public List<Complaint> getComplaintsByStatus(@PathVariable String status) {
        return complaintRepository.findByStatus(status);
    }

    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        System.out.println("Received complaint: " + complaint);
        Complaint saved = complaintRepository.save(complaint);

        // Publish async event to RabbitMQ → consumed by Student Service
        try {
            ComplaintCreatedEvent event = new ComplaintCreatedEvent(
                    saved.getId(),
                    saved.getTitle(),
                    saved.getCategory(),
                    saved.getPriority(),
                    saved.getStudentId(),
                    saved.getStudentName(),
                    saved.getCreatedAt()
            );
            eventPublisher.publishComplaintCreated(event);
        } catch (Exception e) {
            // RabbitMQ failure must not block complaint creation
            System.err.println("[RabbitMQ] Failed to publish ComplaintCreatedEvent: " + e.getMessage());
        }

        return saved;
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
