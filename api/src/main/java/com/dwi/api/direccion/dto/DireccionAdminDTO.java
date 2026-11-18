package com.dwi.api.direccion.dto;

public record DireccionAdminDTO(
        Long id,
        Long clienteId,
        String clienteNombre,
        Long zonaId,
        String zona,
        String alias,
        String linea1,
        String linea2,
        String referencia,
        boolean esPrincipal
) {}
