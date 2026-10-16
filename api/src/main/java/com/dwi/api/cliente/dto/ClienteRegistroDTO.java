package com.dwi.api.cliente.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ClienteRegistroDTO(
        @NotBlank(message = "El nombre es obligatorio")
        String nombres,

        @NotBlank(message = "El apellido es obligatorio")
        String apellidos,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "Formato de correo inválido")
        String email,

        @NotBlank(message = "Ingresa una contraseña.")
        @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres.")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\\\":{}|<>]).+$",
                message = "La contraseña debe incluir mayúscula, minúscula, número y símbolo especial."
        )
        String password,

        @Pattern(regexp = "^[0-9]{8}$", message = "El DNI debe tener 8 dígitos")
        String dni,

        @Pattern(regexp = "^9[0-9]{8}$", message = "El celular debe empezar con 9 y tener 9 dígitos")
        String telefono
) {}
