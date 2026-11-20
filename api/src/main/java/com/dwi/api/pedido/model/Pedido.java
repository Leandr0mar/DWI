package com.dwi.api.pedido.model;

import com.dwi.api.common.audit.BaseEntity;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "pedido")
@SQLDelete(sql = "UPDATE pedido SET is_deleted = true, version = version + 1 WHERE id_pedido=? AND version=?")
@SQLRestriction("is_deleted = false")
public class Pedido extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Long id;

    @Column(name = "uuid_pedido", updatable = false, nullable = false, unique = true, length = 36)
    private String uuid = UUID.randomUUID().toString();

    @Column(name = "cliente_id_snapshot")
    private Long clienteId;

    @Column(name = "cliente_nombre_snapshot", nullable = false, length = 201)
    private String clienteNombre;

    @Column(name = "cliente_email_snapshot", nullable = false, length = 100)
    private String clienteEmail;

    @Column(name = "direccion_entrega", nullable = false, length = 1000)
    private String direccionEntrega;

    @Column(name = "stripe_payment_intent_id", length = 150)
    private String stripePaymentIntentId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "costo_envio", nullable = false, precision = 10, scale = 2)
    private BigDecimal costoEnvio;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal igv;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_pago", nullable = false)
    private EstadoPago estadoPago = EstadoPago.PENDIENTE;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_pedido", nullable = false)
    private HistorialEstadoPedido.EstadoPedido estadoPedido = HistorialEstadoPedido.EstadoPedido.PREPARANDO;

    public enum EstadoPago {
        PENDIENTE, PAGADO, FALLIDO, REEMBOLSADO
    }
}
