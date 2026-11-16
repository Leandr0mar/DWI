package com.dwi.api.integracion.stripe.dto;

import lombok.Data;

/**
 * DTO para la respuesta de operaciones con Stripe
 */
@Data
public class StripeResponse {
    
    private boolean success;
    private String message;
    private String error;
}