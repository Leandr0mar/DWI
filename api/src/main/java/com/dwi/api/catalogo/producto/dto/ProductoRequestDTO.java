package com.dwi.api.catalogo.producto.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;
import com.dwi.api.catalogo.producto.model.TipoPresentacion;

import java.math.BigDecimal;
import java.util.Set;

public record ProductoRequestDTO(
        @NotBlank String sku,
        @NotBlank String nombre,
        String descripcion,
        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal precioBase,
        @NotNull @Min(1) Integer maxSabores,
        @NotNull @Min(0) Integer stockDisponible,
        @NotNull Long categoriaId,
        Set<@NotNull Long> saboresIds,
        @NotNull @URL String urlImagen,
        @NotBlank @Size(max = 30) String pesoVolumen,
        @NotNull TipoPresentacion tipoPresentacion
) {}
