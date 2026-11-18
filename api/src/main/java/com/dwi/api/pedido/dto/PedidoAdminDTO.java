package com.dwi.api.pedido.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoAdminDTO(
        Long id,
        String uuid,
        Long clienteId,
        String clienteNombre,
        String clienteEmail,
        String direccion,
        BigDecimal subtotal,
        BigDecimal costoEnvio,
        BigDecimal igv,
        BigDecimal total,
        String estadoPago,
        String estadoPedido,
        List<PedidoDetalleAdminDTO> detalles,
        LocalDateTime createdAt
) {}
