package com.microservices.clubs.messaging;

import com.microservices.clubs.messaging.events.StudentEnrolledEvent;
import com.microservices.clubs.repository.ClubRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * Consumes student enrollment events from RabbitMQ.
 *
 * When a student enrolls in a course, this consumer suggests
 * relevant clubs based on the course content.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StudentEnrollmentConsumer {

    private final ClubRepository clubRepository;

    /**
     * Listens to student.enrolled.queue
     * Published by: Student Service
     *
     * Use case: When a student enrolls in a course, suggest clubs
     *           that are related to the course topic.
     */
    @RabbitListener(queues = RabbitMQConfig.STUDENT_ENROLLED_QUEUE)
    public void handleStudentEnrolled(StudentEnrolledEvent event) {
        log.info("[RabbitMQ] Received StudentEnrolledEvent:");
        log.info("  → Student ID    : {}", event.getStudentId());
        log.info("  → Student Name  : {}", event.getStudentName());
        log.info("  → Course ID     : {}", event.getCourseId());
        log.info("  → Course Name   : {}", event.getCourseName());
        log.info("  → Enrolled At   : {}", event.getEnrolledAt());

        // Business logic: suggest clubs related to the enrolled course
        long totalClubs = clubRepository.count();
        log.info("[RabbitMQ] Processing club suggestions for student '{}' enrolled in '{}'",
                event.getStudentName(), event.getCourseName());
        log.info("[RabbitMQ] {} clubs available for suggestion. Sending recommendations to student '{}'.",
                totalClubs, event.getStudentEmail());

        // In a real system, this would:
        // 1. Find clubs matching the course category/keywords
        // 2. Send an email/notification to the student with club suggestions
        // 3. Update a recommendations table
        log.info("[RabbitMQ] Club suggestion notification sent to: {}", event.getStudentEmail());
    }
}
