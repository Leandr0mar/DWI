package com.dwi.api.catalogo.sabor.model;

import com.dwi.api.common.audit.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Getter
@Setter
@Entity
@Table(name = "sabor")
@SQLDelete(sql = "UPDATE sabor SET is_deleted = true WHERE id_sabor=?")
@SQLRestriction("is_deleted = false")
public class Sabor extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sabor")
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(name = "color_hex", length = 7)
    private String colorHex;

    @Column(name = "estado_disponibilidad", nullable = false)
    private boolean estadoDisponibilidad = true;
}