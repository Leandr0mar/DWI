package com.dwi.api.pedido.dto;

import java.math.BigDecimal;
import java.util.List;

public record PedidoDetalleAdminDTO(
        Long productoId,
        String producto,
        Integer cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal,
        List<String> sabores
) {}
