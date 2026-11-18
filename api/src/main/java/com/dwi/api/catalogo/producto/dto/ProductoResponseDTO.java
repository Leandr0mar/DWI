package com.dwi.api.catalogo.producto.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProductoResponseDTO(
        Long id,
        String uuid,
        String sku,
        String nombre,
        String descripcion,
        BigDecimal precioBase,
        Integer maxSabores,
        Integer stockDisponible,
        Long categoriaId,
        String categoria,
        List<Long> saboresIds,
        List<String> sabores,
        String urlImagen,
        String pesoVolumen,
        String tipoPresentacion,
        List<Long> ofertasIds,
        BigDecimal precioFinal,
        String nombreOferta,
        BigDecimal porcentajeDescuento
) {}
