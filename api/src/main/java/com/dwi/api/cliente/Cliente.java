package com.dwi.api.cliente;

import java.util.ArrayList;
import java.util.List;

import com.dwi.api.direccion.Direccion;
import com.dwi.api.usuario.Usuario;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name="Clientes")
@PrimaryKeyJoinColumn(name = "id_usuario")
public class Cliente extends Usuario{
    
    @Column(name = "dni", length = 8)
    @Pattern(regexp = "^\\d{8}$" ,message="El numero debe tener 8 digitos")
    private String dni;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Direccion> direcciones = new ArrayList<>();
}
