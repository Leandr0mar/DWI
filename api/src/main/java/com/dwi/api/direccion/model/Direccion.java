package com.dwi.api.direccion.model;

import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.common.audit.BaseEntity;
import com.dwi.api.zona.model.ZonaReparto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Getter
@Setter
@Entity
@Table(name = "direccion")
@SQLDelete(sql = "UPDATE direccion SET is_deleted = true WHERE id_direccion=?")
@SQLRestriction("is_deleted = false")
public class Direccion extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_direccion")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_zona", nullable = false)
    private ZonaReparto zona;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String alias;

    @NotBlank
    @Column(name = "linea_1", nullable = false, length = 200)
    private String linea1;

    @Column(name = "linea_2", length = 200)
    private String linea2;

    @Column(columnDefinition = "TEXT")
    private String referencia;

    @Column(name = "es_principal", nullable = false)
    private boolean esPrincipal = false;
}