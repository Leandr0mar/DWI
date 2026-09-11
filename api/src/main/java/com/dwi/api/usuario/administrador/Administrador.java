package com.dwi.api.usuario.administrador;

import java.time.LocalDateTime;

import com.dwi.api.usuario.Usuario;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "administradores")
@PrimaryKeyJoinColumn(name = "idUsuario")
public class Administrador extends Usuario{
    
    @Column(name = "codigo_empleado", unique = true, length = 20)
    private String codigoEmpleado;

    @Column(name = "area", length = 50)
    private String area;

    @Column(name = "cargo", length = 50)
    private String cargo;

    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;
}
