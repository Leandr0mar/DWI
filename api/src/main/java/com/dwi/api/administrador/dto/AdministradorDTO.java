package com.dwi.api.administrador.dto;

import java.time.LocalDateTime;

public record AdministradorDTO(
        Long id,
        String uuid,
        String nombres,
        String apellidos,
        String email,
        String avatarUrl,
        String nivelAcceso,
        LocalDateTime ultimoAcceso
) {}
