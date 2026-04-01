package com.microservices.complaints.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResolutionDTO {
    private String status; // IN_PROGRESS, RESOLVED, CLOSED
    private String response; // Réponse de l'admin/tuteur
    private String handledBy; // Nom de l'admin/tuteur
    private Long handledByUserId; // ID de l'admin/tuteur
}
