package com.microservices.clubs.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "club_members", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"club_id", "student_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "club_id", nullable = false)
    private Long clubId;
    
    @Column(name = "student_id", nullable = false)
    private Long studentId;
    
    @Column(name = "student_email")
    private String studentEmail;
    
    @Column(name = "student_name")
    private String studentName;
    
    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
    
    @Column(name = "status")
    private String status; // ACTIVE, INACTIVE
    
    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
        if (status == null) {
            status = "ACTIVE";
        }
    }
}
