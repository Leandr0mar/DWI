package com.dwi.api.catalogo.producto.model;

import com.dwi.api.catalogo.categoria.model.Categoria;
import com.dwi.api.catalogo.sabor.model.Sabor;
import com.dwi.api.common.audit.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "producto")
@SQLDelete(sql = "UPDATE producto SET is_deleted = true WHERE id_producto=?")
@SQLRestriction("is_deleted = false")
public class Producto extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Long id;

    @Column(name = "uuid_producto", updatable = false, nullable = false, unique = true, length = 36)
    private String uuid = UUID.randomUUID().toString();

    @NotBlank
    @Column(unique = true, length = 50, nullable = false)
    private String sku;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    @Column(name = "precio_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioBase;

    @Min(value = 0, message = "Los sabores máximos no pueden ser negativos")
    @Column(name = "max_sabores", nullable = false)
    private Integer maxSabores = 1;

    @Min(value = 0, message = "El stock no puede ser negativo")
    @Column(name = "stock_disponible", nullable = false)
    private Integer stockDisponible = 0;

    @URL(message = "La URL de la imagen no es válida")
    @Column(name = "url_imagen", length = 500)
    private String urlImagen;

    @Size(max = 30, message = "El peso o volumen no debe superar los 30 caracteres")
    @Column(name = "peso_volumen", length = 30)
    private String pesoVolumen;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_presentacion", length = 30)
    private TipoPresentacion tipoPresentacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    // Relación con Sabor
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "producto_sabor",
        joinColumns = @JoinColumn(name = "id_producto"),
        inverseJoinColumns = @JoinColumn(name = "id_sabor")
    )

    private Set<Sabor> sabores = new HashSet<>();
}
