package com.microservices.gateway.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

/**
 * Centralized Swagger/OpenAPI Configuration for API Gateway
 * 
 * This configuration aggregates all microservices' OpenAPI documentation
 * into a single Swagger UI accessible at the Gateway level.
 * 
 * Access: http://localhost:8080/swagger-ui.html
 * 
 * Each service's API docs are grouped by service name:
 *  - Auth Service
 *  - Courses Service
 *  - Students Service
 *  - Complaints Service
 *  - Clubs Service
 *  - Quiz Service
 */
@Configuration
public class SwaggerConfig {

    /**
     * Defines grouped OpenAPI documentation for each microservice.
     * Each group points to the service's /v3/api-docs endpoint via the Gateway.
     */
    @Bean
    public List<GroupedOpenApi> apis() {
        List<GroupedOpenApi> groups = new ArrayList<>();
        
        // Auth Service
        groups.add(GroupedOpenApi.builder()
                .group("auth-service")
                .pathsToMatch("/api/auth/**")
                .build());
        
        // Courses Service
        groups.add(GroupedOpenApi.builder()
                .group("courses-service")
                .pathsToMatch("/api/courses/**")
                .build());
        
        // Students Service
        groups.add(GroupedOpenApi.builder()
                .group("students-service")
                .pathsToMatch("/api/students/**", "/api/enrollments/**")
                .build());
        
        // Complaints Service
        groups.add(GroupedOpenApi.builder()
                .group("complaints-service")
                .pathsToMatch("/api/complaints/**")
                .build());
        
        // Clubs Service
        groups.add(GroupedOpenApi.builder()
                .group("clubs-service")
                .pathsToMatch("/api/clubs/**")
                .build());
        
        // Quiz Service
        groups.add(GroupedOpenApi.builder()
                .group("quiz-service")
                .pathsToMatch("/api/quizzes/**")
                .build());
        
        return groups;
    }
}
