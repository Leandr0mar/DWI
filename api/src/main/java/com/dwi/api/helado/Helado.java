package com.dwi.api.helado;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.hibernate.validator.constraints.URL;

import com.dwi.api.helado.enums.EstadoHelado;
import com.dwi.api.helado.enums.TipoPresentacion;
import com.dwi.api.helado.sabor.Sabor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "helados")
public class Helado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del helado es obligatorio")
    @Size(min = 3, max = 80, message = "El nombre debe tener entre 3 y 80 caracteres")
    @Column(name = "nombre", nullable = false, length = 80)
    private String nombre;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    @Digits(integer = 8, fraction = 2, message = "El formato de precio debe tener máximo 8 enteros y 2 decimales")
    @Column(name = "precio", nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Size(max = 255, message = "La descripción no puede superar los 255 caracteres")
    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    @Column(name = "stock", nullable = false)
    private Integer stock;

    @NotBlank(message = "La URL de la imagen es obligatoria")
    @URL(message = "Debe ser una URL válida")
    @Column(name = "url_imagen", nullable = false, length = 500)
    private String urlImagen;

    @NotNull(message = "El estado es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    private EstadoHelado estado = EstadoHelado.ACTIVO;

    @NotBlank(message = "La categoría es obligatoria")
    @Size(min = 3, max = 50, message = "La categoría debe tener entre 3 y 50 caracteres")
    @Column(name = "categoria", nullable = false, length = 50)
    private String categoria;

    @NotBlank(message = "El peso o volumen es obligatorio")
    @Size(max = 30, message = "El peso o volumen no debe superar los 30 caracteres")
    @Column(name = "peso_volumen", nullable = false, length = 30)
    private String pesoVolumen;

    @NotNull(message = "El tipo de presentación es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_presentacion", nullable = false, length = 30)
    private TipoPresentacion tipoPresentacion;

    @NotEmpty(message = "El helado debe tener al menos un sabor asignado")
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "helado_sabores",
        joinColumns = @JoinColumn(name = "id_helado"),
        inverseJoinColumns = @JoinColumn(name = "id_sabor")
    )
    private Set<Sabor> sabores = new HashSet<>();

    @Column(name = "es_personalizable", nullable = false)
    private Boolean esPersonalizable = false;

    @Column(name = "max_sabores")
    private Integer maxSabores = 1;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;


    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoHelado.ACTIVO;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }


}