package com.dwi.api.helado.sabor;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
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

}