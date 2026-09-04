package com.dwi.api.helado.sabor;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "sabores")
public class Sabor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del sabor es obligatorio")
    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 y 50 caracteres")
    @Column(nullable = false, unique = true, length = 50)
    private String nombre;

    @Size(max = 200, message = "La descripción no debe superar los 200 caracteres")
    @Column(length = 200)
    private String descripcion;

    @Column(nullable = false)
    private Boolean activo = true;

    public Sabor() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}