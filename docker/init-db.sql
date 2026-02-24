-- Création des bases de données pour chaque microservice
CREATE DATABASE courses_db;
CREATE DATABASE students_db;

-- Connexion à courses_db
\c courses_db;

CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructor VARCHAR(100),
    duration_hours INTEGER,
    level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO courses (title, description, instructor, duration_hours, level) VALUES
('Spring Boot Fundamentals', 'Learn the basics of Spring Boot', 'John Doe', 40, 'BEGINNER'),
('Microservices Architecture', 'Build scalable microservices', 'Jane Smith', 60, 'INTERMEDIATE'),
('Docker & Kubernetes', 'Container orchestration', 'Bob Johnson', 50, 'ADVANCED');

-- Connexion à students_db
\c students_db;

CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_courses (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

INSERT INTO students (first_name, last_name, email) VALUES
('Alice', 'Martin', 'alice.martin@example.com'),
('Bob', 'Dupont', 'bob.dupont@example.com'),
('Charlie', 'Bernard', 'charlie.bernard@example.com');

INSERT INTO student_courses (student_id, course_id) VALUES
(1, 1), (1, 2),
(2, 1), (2, 3),
(3, 2);
