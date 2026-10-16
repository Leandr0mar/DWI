package com.dwi.api.administrador.model;

import com.dwi.api.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "administrador")
public class Administrador extends Usuario {

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_acceso", nullable = false)
    private NivelAcceso nivelAcceso;

    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;

    public enum NivelAcceso {
        SUPERADMIN, EDITOR, ALMACEN
    }
}