package com.dwi.api.seguridad.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    
    private String email;
    private String password;
}

