package com.dwi.api.cliente.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ClienteAdminRequestDTO(
        @NotBlank String nombres,
        @NotBlank String apellidos,
        @NotBlank @Email String email,
        String avatarUrl,
        @jakarta.validation.constraints.Pattern(regexp = "^$|^.{8,}$") String password,
        @Pattern(regexp = "^$|^[0-9]{8}$") String dni,
        @Pattern(regexp = "^$|^9[0-9]{8}$") String telefono
) {}
