package com.microservices.auth.controller;

import com.microservices.auth.client.StudentClient;
import com.microservices.auth.dto.*;
import com.microservices.auth.entity.User;
import com.microservices.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StudentClient studentClient;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userRepository.findByUsername(request.getUsername())
            .map(user -> {
                if (user.getPassword().equals(request.getPassword())) {
                    user.setLastLogin(LocalDateTime.now());
                    userRepository.save(user);
                    
                    AuthResponse response = new AuthResponse();
                    response.setToken(UUID.randomUUID().toString());
                    response.setUsername(user.getUsername());
                    response.setEmail(user.getEmail());
                    response.setRole(user.getRole());
                    response.setFirstName(user.getFirstName());
                    response.setLastName(user.getLastName());
                    response.setMessage("Login successful");
                    
                    return ResponseEntity.ok(response);
                }
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, null, null, null, null, null, "Invalid credentials"));
            })
            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse(null, null, null, null, null, null, "User not found")));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new AuthResponse(null, null, null, null, null, null, "Username already exists"));
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new AuthResponse(null, null, null, null, null, null, "Email already exists"));
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole() != null ? request.getRole() : User.Role.STUDENT);
        
        User savedUser = userRepository.save(user);
        
        // Si le rôle est STUDENT, créer automatiquement un étudiant dans student-service
        if (savedUser.getRole() == User.Role.STUDENT) {
            try {
                StudentDTO studentDTO = new StudentDTO();
                studentDTO.setFirstName(savedUser.getFirstName());
                studentDTO.setLastName(savedUser.getLastName());
                studentDTO.setEmail(savedUser.getEmail());
                studentDTO.setEnrollmentDate(LocalDate.now().toString());
                
                studentClient.createStudent(studentDTO);
            } catch (Exception e) {
                // Log l'erreur mais ne pas bloquer la création de l'utilisateur
                System.err.println("Failed to create student in student-service: " + e.getMessage());
            }
        }
        
        AuthResponse response = new AuthResponse();
        response.setMessage("User registered successfully");
        response.setUsername(savedUser.getUsername());
        response.setRole(savedUser.getRole());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/users/role/{role}")
    public List<User> getUsersByRole(@PathVariable String role) {
        return userRepository.findByRole(User.Role.valueOf(role.toUpperCase()));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id)
            .map(user -> {
                if (userDetails.getFirstName() != null) user.setFirstName(userDetails.getFirstName());
                if (userDetails.getLastName() != null) user.setLastName(userDetails.getLastName());
                if (userDetails.getEmail() != null) user.setEmail(userDetails.getEmail());
                if (userDetails.getRole() != null) user.setRole(userDetails.getRole());
                if (userDetails.getActive() != null) user.setActive(userDetails.getActive());
                return ResponseEntity.ok(userRepository.save(user));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(user -> {
                userRepository.delete(user);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
