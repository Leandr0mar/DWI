package com.dwi.api.zona.model;

import com.dwi.api.common.audit.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "zona_reparto")
@SQLDelete(sql = "UPDATE zona_reparto SET is_deleted = true WHERE id_zona=?")
@SQLRestriction("is_deleted = false")
public class ZonaReparto extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_zona")
    private Long id;

    @NotBlank
    @Column(name = "nombre_distrito", nullable = false, length = 100)
    private String nombreDistrito;

    @NotNull
    @Column(name = "costo_envio", nullable = false, precision = 10, scale = 2)
    private BigDecimal costoEnvio;

    @Column(name = "tiempo_estimado_minutos")
    private Integer tiempoEstimadoMinutos;

    @Column(nullable = false)
    private boolean estado = true;
}