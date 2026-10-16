package com.dwi.api.cliente.model;

import com.dwi.api.usuario.model.Usuario;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "cliente")
public class Cliente extends Usuario {

    @Pattern(regexp = "^[0-9]{8}$", message = "El DNI debe tener exactamente 8 dígitos numéricos")
    @Column(unique = true, length = 8)
    private String dni;

    @Pattern(regexp = "^9[0-9]{8}$", message = "Formato de celular inválido")
    @Column(length = 15)
    private String telefono;

    @Column(name = "stripe_customer_id", length = 100)
    private String stripeCustomerId;
}