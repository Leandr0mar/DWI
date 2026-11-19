package com.dwi.api.pedido.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Set;

public record PedidoCheckoutRequestDTO(
        @NotNull Long direccionId,
        @NotEmpty List<@Valid DetalleRequestDTO> detalles
) {
    public record DetalleRequestDTO(
            @NotNull Long productoId,
            @NotNull @Min(1) Integer cantidad,
            Set<@NotNull Long> saboresIds
    ) {}
}
