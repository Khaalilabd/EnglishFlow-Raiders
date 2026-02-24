package com.microservices.complaints;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ComplaintsServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ComplaintsServiceApplication.class, args);
    }
}
