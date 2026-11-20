package com.dwi.api.pedido.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "detalle_pedido")
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    @Column(name = "producto_id_snapshot")
    private Long productoId;

    @Column(name = "producto_nombre_snapshot", nullable = false, length = 100)
    private String productoNombre;

    @Column(name = "producto_sku_snapshot", nullable = false, length = 50)
    private String productoSku;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "sabores_snapshot", length = 2000)
    private String saboresSnapshot;
}
