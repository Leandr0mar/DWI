package com.dwi.api.catalogo.producto.historial;

import java.time.LocalDateTime;

public record HistorialStockDTO(
        Long id,
        Long productoId,
        String producto,
        String sku,
        Integer cantidadAlterada,
        HistorialStock.TipoMovimiento tipoMovimiento,
        String observacion,
        String administrador,
        LocalDateTime fechaMovimiento
) {}
