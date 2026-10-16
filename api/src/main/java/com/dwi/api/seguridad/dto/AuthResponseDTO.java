package com.dwi.api.seguridad.dto;

public record AuthResponseDTO(
    String nombreCompleto,
    String rol,
    String avatarUrl
) {}
