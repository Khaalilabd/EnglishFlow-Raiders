package com.microservices.complaints.messaging.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Event published when a new complaint is created.
 *
 * Exchange : complaint.exchange
 * Routing  : complaint.created
 * Consumers: Student Service (notify student their complaint was received)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintCreatedEvent {
    private Long complaintId;
    private String title;
    private String category;
    private String priority;
    private Long studentId;
    private String studentName;
    private LocalDateTime createdAt;
}
