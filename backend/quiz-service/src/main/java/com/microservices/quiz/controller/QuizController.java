package com.microservices.quiz.controller;

import com.microservices.quiz.entity.Quiz;
import com.microservices.quiz.entity.Question;
import com.microservices.quiz.repository.QuizRepository;
import com.microservices.quiz.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizRepository quizRepository;
    
    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getQuizById(@PathVariable Long id) {
        return quizRepository.findById(id)
                .map(quiz -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("quiz", quiz);
                    response.put("questions", questionRepository.findByQuizId(id));
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        return quizRepository.save(quiz);
    }

    @PostMapping("/{quizId}/questions")
    public Question addQuestion(@PathVariable Long quizId, @RequestBody Question question) {
        question.setQuizId(quizId);
        return questionRepository.save(question);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable Long id, @RequestBody Quiz quizDetails) {
        return quizRepository.findById(id)
                .map(quiz -> {
                    quiz.setTitle(quizDetails.getTitle());
                    quiz.setDescription(quizDetails.getDescription());
                    quiz.setCourseId(quizDetails.getCourseId());
                    quiz.setDifficulty(quizDetails.getDifficulty());
                    quiz.setTimeLimit(quizDetails.getTimeLimit());
                    quiz.setPassingScore(quizDetails.getPassingScore());
                    return ResponseEntity.ok(quizRepository.save(quiz));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        return quizRepository.findById(id)
                .map(quiz -> {
                    questionRepository.deleteAll(questionRepository.findByQuizId(id));
                    quizRepository.delete(quiz);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
