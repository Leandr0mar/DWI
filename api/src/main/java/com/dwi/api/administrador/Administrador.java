package com.dwi.api.administrador;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "administradores")
@PrimaryKeyJoinColumn(name = "id_usuario")
public class Administrador {
    
    @Column(name = "codigo_empleado", unique = true, length = 20)
    private String codigoEmpleado;

    @Column(name = "area", length = 50)
    private String area;

    @Column(name = "area", length = 50)
    private String cargo;

    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;
}
