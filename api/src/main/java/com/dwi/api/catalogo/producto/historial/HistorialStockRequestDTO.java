package com.dwi.api.catalogo.producto.historial;

import jakarta.validation.constraints.NotNull;

public record HistorialStockRequestDTO(
        @NotNull Long productoId,
        @NotNull Integer cantidadAlterada,
        @NotNull HistorialStock.TipoMovimiento tipoMovimiento,
        String observacion
) {}
