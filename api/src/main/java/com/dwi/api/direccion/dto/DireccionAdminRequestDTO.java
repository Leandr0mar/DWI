package com.dwi.api.direccion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DireccionAdminRequestDTO(
        @NotNull Long zonaId,
        @NotBlank String alias,
        @NotBlank String linea1,
        String linea2,
        String referencia,
        boolean esPrincipal
) {}
