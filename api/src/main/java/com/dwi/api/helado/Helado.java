package com.dwi.api.helado;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;

import com.dwi.api.helado.enums.EstadoHelado;
import com.dwi.api.helado.enums.TipoPresentacion;
import com.dwi.api.helado.sabor.Sabor;

@Entity
@Table(name = "helados")
public class Helado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_helado")
    private Long idHelado;

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
    @Column(name = "peso_volumen", nullable = false, length = 30) // Ej: "120 g", "500 ml", "1 L"
    private String pesoVolumen;

    @NotNull(message = "El tipo de presentación es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_presentacion", nullable = false, length = 30)
    private TipoPresentacion tipoPresentacion;

    @NotNull(message = "El sabor es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sabor_id", nullable = false)
    private Sabor sabor;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    public Helado() {
    }

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

    // Getters y Setters
    public Long getIdHelado() {
        return idHelado;
    }

    public void setIdHelado(Long idHelado) {
        this.idHelado = idHelado;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getUrlImagen() {
        return urlImagen;
    }

    public void setUrlImagen(String urlImagen) {
        this.urlImagen = urlImagen;
    }

    public EstadoHelado getEstado() {
        return estado;
    }

    public void setEstado(EstadoHelado estado) {
        this.estado = estado;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getPesoVolumen() {
        return pesoVolumen;
    }

    public void setPesoVolumen(String pesoVolumen) {
        this.pesoVolumen = pesoVolumen;
    }

    public TipoPresentacion getTipoPresentacion() {
        return tipoPresentacion;
    }

    public void setTipoPresentacion(TipoPresentacion tipoPresentacion) {
        this.tipoPresentacion = tipoPresentacion;
    }

    public Sabor getSabor() {
        return sabor;
    }

    public void setSabor(Sabor sabor) {
        this.sabor = sabor;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
}