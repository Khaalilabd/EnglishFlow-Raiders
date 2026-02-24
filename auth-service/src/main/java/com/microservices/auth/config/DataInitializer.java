package com.microservices.auth.config;

import com.microservices.auth.entity.User;
import com.microservices.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // Créer un admin
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@demo.com");
            admin.setPassword("admin123");
            admin.setFirstName("Admin");
            admin.setLastName("System");
            admin.setRole(User.Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);

            // Créer un tuteur
            User tutor = new User();
            tutor.setUsername("tutor");
            tutor.setEmail("tutor@demo.com");
            tutor.setPassword("tutor123");
            tutor.setFirstName("John");
            tutor.setLastName("Tutor");
            tutor.setRole(User.Role.TUTOR);
            tutor.setActive(true);
            userRepository.save(tutor);

            // Créer un étudiant
            User student = new User();
            student.setUsername("student");
            student.setEmail("student@demo.com");
            student.setPassword("student123");
            student.setFirstName("Alice");
            student.setLastName("Student");
            student.setRole(User.Role.STUDENT);
            student.setActive(true);
            userRepository.save(student);

            System.out.println("✅ Utilisateurs de test créés:");
            System.out.println("   Admin: admin/admin123");
            System.out.println("   Tutor: tutor/tutor123");
            System.out.println("   Student: student/student123");
        }
    }
}
