package com.microservices.clubs.messaging;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ Configuration for Clubs Service
 *
 * [CONSUMER] student.exchange
 *   └── student.enrolled.queue  (routing key: student.enrolled)
 *       → Published by: Student Service (when a student enrolls in a course)
 *       → Action: suggest relevant clubs to the newly enrolled student
 */
@Configuration
public class RabbitMQConfig {

    public static final String STUDENT_EXCHANGE       = "student.exchange";
    public static final String STUDENT_ENROLLED_KEY   = "student.enrolled";
    public static final String STUDENT_ENROLLED_QUEUE = "student.enrolled.queue";

    @Bean
    public TopicExchange studentExchange() {
        return new TopicExchange(STUDENT_EXCHANGE, true, false);
    }

    @Bean
    public Queue studentEnrolledQueue() {
        return QueueBuilder.durable(STUDENT_ENROLLED_QUEUE).build();
    }

    @Bean
    public Binding studentEnrolledBinding() {
        return BindingBuilder
                .bind(studentEnrolledQueue())
                .to(studentExchange())
                .with(STUDENT_ENROLLED_KEY);
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
