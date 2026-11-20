package com.dwi.api.catalogo.producto.historial;

import com.dwi.api.administrador.model.Administrador;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "historial_stock")
public class HistorialStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    private Long id;

    @Column(name = "producto_id_snapshot")
    private Long productoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_admin")
    private Administrador administrador;

    @Column(name = "cantidad_alterada", nullable = false)
    private Integer cantidadAlterada;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_movimiento", nullable = false)
    private TipoMovimiento tipoMovimiento;

    @Column(columnDefinition = "TEXT")
    private String observacion;

    @Column(name = "nombre_producto")
    private String nombreProducto;

    @Column(name = "sku_producto")
    private String skuProducto;

    @CreationTimestamp
    @Column(name = "fecha_movimiento", updatable = false)
    private LocalDateTime fechaMovimiento;

    public enum TipoMovimiento {
        INGRESO, MERMA, VENTA, AJUSTE
    }
}
