package com.dwi.api.seguridad.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
    @NotBlank(message = "Ingresa tu correo electrónico.")
    @Email(message = "Ingresa una dirección de correo válida.")
    String email,

    @NotBlank(message = "Ingresa tu contraseña.")
    String password
) {}
