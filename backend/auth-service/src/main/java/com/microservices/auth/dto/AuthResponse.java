package com.microservices.auth.dto;

import com.microservices.auth.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private User.Role role;
    private String firstName;
    private String lastName;
    private String message;
}
