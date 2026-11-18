package com.dwi.api.oferta.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record OfertaProductoProjection(
        Long productoId,
        Long ofertaId,
        String nombre,
        BigDecimal porcentaje,
        LocalDate fechaInicio,
        LocalDate fechaFin
) {}
