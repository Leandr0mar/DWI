package com.dwi.api.integracion.stripe.controller;

import com.dwi.api.integracion.stripe.dto.StripePaymentRequest;
import com.dwi.api.integracion.stripe.dto.StripeResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/integracion/stripe")
public class StripeController {

    /** Pendiente de integrar con Stripe; se conserva la ruta sin simular un cobro. */
    @PostMapping("/payment")
    public ResponseEntity<StripeResponse> crearPago(
            @RequestBody StripePaymentRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }
    
    /** Pendiente de integrar con Stripe; paymentIntentId identifica el recurso consultado. */
    @GetMapping("/payment/status/{paymentIntentId}")
    public ResponseEntity<StripeResponse> verificarEstadoPago(@PathVariable String paymentIntentId) {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }
    
    /** Pendiente de validar la firma y procesar eventos de Stripe. */
    @PostMapping("/webhook")
    public ResponseEntity<Void> recibirWebhook(
            @RequestBody String payload,
            @RequestHeader(name = "stripe-signature", required = false) String signature) {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }
}