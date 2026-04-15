package com.microservices.complaints.messaging;

import com.microservices.complaints.messaging.events.ComplaintCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

/**
 * Publishes complaint-related events to RabbitMQ.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ComplaintEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    /**
     * Publishes a ComplaintCreatedEvent when a new complaint is submitted.
     * Consumed by: Student Service (to notify the student)
     */
    public void publishComplaintCreated(ComplaintCreatedEvent event) {
        log.info("[RabbitMQ] Publishing ComplaintCreatedEvent: complaintId={}, studentId={}",
                event.getComplaintId(), event.getStudentId());
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.COMPLAINT_EXCHANGE,
                RabbitMQConfig.COMPLAINT_CREATED_KEY,
                event
        );
        log.info("[RabbitMQ] ComplaintCreatedEvent published successfully");
    }
}
