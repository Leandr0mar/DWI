package com.dwi.api.oferta.model;

import com.dwi.api.catalogo.producto.model.Producto;
import com.dwi.api.common.audit.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "oferta")
@SQLDelete(sql = "UPDATE oferta SET is_deleted = true WHERE id_oferta=?")
@SQLRestriction("is_deleted = false")
public class Oferta extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_oferta")
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotNull
    @DecimalMin("0.01")
    @DecimalMax("100.00")
    @Column(name = "porcentaje_descuento", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentaje;

    @NotNull
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @NotNull
    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "oferta_producto",
            joinColumns = @JoinColumn(name = "id_oferta"),
            inverseJoinColumns = @JoinColumn(name = "id_producto"))
    private Set<Producto> productos = new HashSet<>();

    public static BigDecimal calcularPrecioFinal(BigDecimal precioBase, BigDecimal porcentaje) {
        return precioBase.multiply(BigDecimal.valueOf(100).subtract(porcentaje))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }
}
