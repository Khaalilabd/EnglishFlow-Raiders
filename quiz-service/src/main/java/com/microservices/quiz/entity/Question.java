package com.microservices.quiz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long quizId;
    
    @Column(length = 500)
    private String questionText;
    
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    
    private Integer correctOption;
    
    private Integer points;
}
