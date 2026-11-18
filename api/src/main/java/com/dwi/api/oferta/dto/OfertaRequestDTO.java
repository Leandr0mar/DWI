package com.dwi.api.oferta.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

public record OfertaRequestDTO(
        @NotBlank @Size(max = 100) String nombre,
        @NotNull @DecimalMin("0.01") @DecimalMax("100.00") BigDecimal porcentaje,
        @NotNull LocalDate fechaInicio,
        @NotNull LocalDate fechaFin,
        @NotEmpty Set<@NotNull Long> productoIds
) {}
