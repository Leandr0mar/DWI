package com.dwi.api.administrador.dto;

import com.dwi.api.administrador.model.Administrador;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdministradorRequestDTO(
        @NotBlank String nombres,
        @NotBlank String apellidos,
        @NotBlank @Email String email,
        String avatarUrl,
        @jakarta.validation.constraints.Pattern(regexp = "^$|^.{8,}$") String password,
        @NotNull Administrador.NivelAcceso nivelAcceso
) {}
