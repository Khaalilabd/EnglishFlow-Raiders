package com.microservices.complaints.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI complaintsServiceAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8084");
        devServer.setDescription("Development Server");
        
        Server prodServer = new Server();
        prodServer.setUrl("http://localhost:8080/api/complaints");
        prodServer.setDescription("Production Server (via API Gateway)");
        
        Contact contact = new Contact();
        contact.setName("Microservices Team");
        contact.setEmail("support@microservices.com");
        
        Info info = new Info()
                .title("Complaints Service API")
                .version("1.0.0")
                .description("API pour la gestion des réclamations")
                .contact(contact);
        
        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer, prodServer));
    }
}
