package com.dwi.api.usuario.cliente;

import java.util.ArrayList;
import java.util.List;

import com.dwi.api.usuario.Usuario;
import com.dwi.api.usuario.cliente.direccion.Direccion;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="clientes")
@PrimaryKeyJoinColumn(name = "idUsuario")
public class Cliente extends Usuario{
    
    @Column(name = "dni", length = 8)
    @Pattern(regexp = "^\\d{8}$" ,message="El numero debe tener 8 digitos")
    private String dni;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Direccion> direcciones = new ArrayList<>();
}
