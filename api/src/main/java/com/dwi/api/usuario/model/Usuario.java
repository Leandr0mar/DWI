package com.dwi.api.usuario.model;

import com .dwi.api.common.audit.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "usuario")
@Inheritance(strategy = InheritanceType.JOINED)
@SQLDelete(sql = "UPDATE usuario SET is_deleted = true WHERE id_usuario=?")
@SQLRestriction("is_deleted = false") // Hibernate 6.3+ (Reemplaza a @Where)
public class Usuario extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "uuid_usuario", updatable = false, nullable = false, unique = true, length = 36)
    private String uuid = UUID.randomUUID().toString();

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String nombres;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol_sistema", nullable = false)
    private RolSistema rolSistema;
    
    public enum RolSistema {
        CLIENTE, ADMIN
    }
}