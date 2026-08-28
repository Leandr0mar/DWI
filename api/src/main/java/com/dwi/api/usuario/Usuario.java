package com.dwi.api.usuario;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.dwi.api.direccion.Direccion;
import com.dwi.api.rol.Rol;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name="usuarios")
public class Usuario { 
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_usuario;

    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(min = 3, max= 30, message="El nombre debe tener entre 3 y 30 caracteres")
    @Column(name= "nombre",nullable = false, length = 30)
    private String nombre;

    @NotBlank(message = "El apellido de usuario es obligatorio")
    @Size(min = 3, max= 30, message="El apellido debe tener entre 3 y 30 caracteres")
    @Column(name = "apellido", nullable = false, length = 30)
    private String apellido;

    @NotBlank(message = "El correo electrónico es obligatorio.")
    @Email(message = "El formato del correo electrónico no es válido.")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "La contraseña es obligatorio")
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "El numero telefonico es obligatorio")
    @Pattern(regexp = "^\\d{9}$" ,message="El numero debe tener 9 digitos y ser solo numeros")
    @Column(name= "telefono",nullable = false, length = 9)
    private String telefono;

    @Column(nullable = false)
    private Boolean activo = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JsonIgnore
    @JoinTable(name = "usuario_rol",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "rol_id"))
    private Set<Rol> roles;

    @Column(name = "fecha_registro", updatable = false)
    private LocalDateTime fechaRegistro;

    @PrePersist
    public void prePersist() {
        this.fechaRegistro = LocalDateTime.now();
    }

}
