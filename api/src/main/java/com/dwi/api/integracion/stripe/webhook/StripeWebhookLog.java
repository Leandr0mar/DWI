package com.dwi.api.integracion.stripe.webhook;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "stripe_webhook_log")
public class StripeWebhookLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_log")
    private Long id;

    @Column(name = "evento_id", nullable = false, unique = true, length = 150)
    private String eventoId;

    @Column(name = "tipo_evento", nullable = false, length = 100)
    private String tipoEvento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoWebhook estado;

    @CreationTimestamp
    @Column(name = "fecha_procesado", updatable = false)
    private LocalDateTime fechaProcesado;

    public enum EstadoWebhook {
        PROCESADO, ERROR
    }
}