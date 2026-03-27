package com.microservices.complaints.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    private String category; // TECHNICAL, CONTENT, SERVICE, OTHER
    
    private String status; // PENDING, IN_PROGRESS, RESOLVED, CLOSED
    
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    
    private Long studentId;
    
    private String studentName;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private String response;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "PENDING";
        }
        if (priority == null) {
            priority = "MEDIUM";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
