package com.microservices.auth.client;

import com.microservices.auth.dto.StudentDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "students-service")
public interface StudentClient {
    
    @PostMapping("/students")
    StudentDTO createStudent(@RequestBody StudentDTO studentDTO);
}
