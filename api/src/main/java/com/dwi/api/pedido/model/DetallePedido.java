package com.dwi.api.pedido.model;

import com.dwi.api.catalogo.producto.model.Producto;
import com.dwi.api.catalogo.sabor.model.Sabor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    // Sabores congelados al momento de la compra
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "detalle_pedido_sabor",
        joinColumns = @JoinColumn(name = "id_detalle"),
        inverseJoinColumns = @JoinColumn(name = "id_sabor")
    )
    private Set<Sabor> sabores = new HashSet<>();
}