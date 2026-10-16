package com.dwi.api.carrito.model;

import com.dwi.api.catalogo.producto.model.Producto;
import com.dwi.api.catalogo.sabor.model.Sabor;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "detalle_carrito")
public class DetalleCarrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_carrito", nullable = false)
    private CarritoSesion carrito;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Min(1)
    @Column(nullable = false)
    private Integer cantidad;

    // Relación directa a los sabores escogidos en esta línea del carrito
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "detalle_carrito_sabor",
        joinColumns = @JoinColumn(name = "id_detalle"),
        inverseJoinColumns = @JoinColumn(name = "id_sabor")
    )
    private Set<Sabor> sabores = new HashSet<>();
}