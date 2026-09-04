package com.dwi.api.usuario.cliente.direccion;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.dwi.api.usuario.Usuario;
import com.dwi.api.usuario.cliente.Cliente;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "direcciones")
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDireccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnore // Evita ciclos infinitos en serialización JSON
    private Cliente cliente; // <--- Este nombre DEBE coincidir con mappedBy = "cliente"

    @NotBlank(message = "Debes asignar un alias (ej. Casa, Trabajo)")
    @Size(max = 30)
    @Column(nullable = false, length = 30)
    private String alias;

    @NotBlank(message = "El departamento es obligatorio")
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String departamento;

    @NotBlank(message = "La provincia es obligatoria")
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String provincia;

    @NotBlank(message = "El distrito es obligatorio")
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String distrito;

    @NotBlank(message = "La dirección (calle/avenida y número) es obligatoria")
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String direccion;

    @Size(max = 200, message = "La referencia no puede superar los 200 caracteres")
    @Column(length = 200)
    private String referencia;

    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal; // Opcional, sin @NotBlank
}