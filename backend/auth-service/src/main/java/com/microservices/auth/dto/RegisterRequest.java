package com.microservices.auth.dto;

import com.microservices.auth.entity.User;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private User.Role role;
}
