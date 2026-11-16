package com.dwi.api.seguridad.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDTO {
    
    private String nombreCompleto;
    private String rolSistema;
    private String avatarUrl;
}
