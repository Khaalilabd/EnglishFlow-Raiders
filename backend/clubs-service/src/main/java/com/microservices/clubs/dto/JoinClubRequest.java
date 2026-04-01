package com.microservices.clubs.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JoinClubRequest {
    private Long studentId;
    private String studentEmail;
    private String studentName;
}
