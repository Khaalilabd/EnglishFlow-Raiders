package com.microservices.complaints.messaging;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ Configuration for Complaints Service
 *
 * [PUBLISHER] complaint.exchange
 *   └── complaint.student.queue  (routing key: complaint.created)
 *       → Consumed by: Student Service (notify student of new complaint)
 */
@Configuration
public class RabbitMQConfig {

    public static final String COMPLAINT_EXCHANGE     = "complaint.exchange";
    public static final String COMPLAINT_CREATED_KEY  = "complaint.created";
    public static final String COMPLAINT_STUDENT_QUEUE = "complaint.student.queue";

    @Bean
    public TopicExchange complaintExchange() {
        return new TopicExchange(COMPLAINT_EXCHANGE, true, false);
    }

    @Bean
    public Queue complaintStudentQueue() {
        return QueueBuilder.durable(COMPLAINT_STUDENT_QUEUE).build();
    }

    @Bean
    public Binding complaintStudentBinding() {
        return BindingBuilder
                .bind(complaintStudentQueue())
                .to(complaintExchange())
                .with(COMPLAINT_CREATED_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
