package com.dwi.api.pedido.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record PedidoCrearRequestDTO(
        @NotNull Long clienteId,
        @NotNull Long direccionId,
        @NotEmpty Set<@Valid DetalleRequestDTO> detalles
) {
    public record DetalleRequestDTO(
            @NotNull Long productoId,
            @NotNull @Min(1) Integer cantidad,
            Set<@NotNull Long> saboresIds
    ) {}
}
