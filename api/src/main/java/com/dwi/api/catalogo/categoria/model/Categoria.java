package com.dwi.api.catalogo.categoria.model;

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
@Table(name = "categoria")
@SQLDelete(sql = "UPDATE categoria SET is_deleted = true WHERE id_categoria=?")
@SQLRestriction("is_deleted = false")
public class Categoria extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false)
    private boolean estado = true;
}