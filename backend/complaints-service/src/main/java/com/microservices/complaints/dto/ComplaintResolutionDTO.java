package com.microservices.complaints.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResolutionDTO {
    private String status;
    private String response;
    private String handledBy;
    private Long handledByUserId;
}