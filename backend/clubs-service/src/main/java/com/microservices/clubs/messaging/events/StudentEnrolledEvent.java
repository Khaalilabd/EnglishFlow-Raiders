package com.microservices.clubs.messaging.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Event received when a student enrolls in a course.
 *
 * Exchange : student.exchange
 * Routing  : student.enrolled
 * Publisher: Student Service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentEnrolledEvent {
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long courseId;
    private String courseName;
    private LocalDateTime enrolledAt;
}
