package com.dwi.api.oferta.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record OfertaAdminDTO(
        Long id,
        String nombre,
        BigDecimal porcentaje,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        List<Long> productosIds,
        List<String> productos,
        String estado
) {}
