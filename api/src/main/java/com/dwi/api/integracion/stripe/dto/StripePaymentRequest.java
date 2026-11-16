package com.dwi.api.integracion.stripe.dto;

import lombok.Data;

/**
 * DTO para la petición de creación de pago
 */
@Data
public class StripePaymentRequest {
    
    private String clientId;
    private String stripeCustomerId;
    private Integer amount; // en centavos (ej: 9990 = $99.90)
    private String currency; // default: "usd"
    private String email;
}