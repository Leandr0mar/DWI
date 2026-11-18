package com.dwi.api.cliente.dto;

public record ClienteAdminDTO(
        Long id,
        String uuid,
        String nombres,
        String apellidos,
        String email,
        String avatarUrl,
        String dni,
        String telefono
) {}
