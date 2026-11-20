package com.dwi.api.usuario.repository;

import com.dwi.api.usuario.model.Usuario;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Spring Data construye automáticamente la consulta SQL: SELECT * FROM usuario WHERE email = ?
    Optional<Usuario> findByEmail(String email);
    
    // Buscar por UUID para exponer en la API en lugar del ID numérico
    Optional<Usuario> findByUuid(String uuid);

    @Modifying
    @Transactional
    @Query(value = "UPDATE usuario SET is_deleted = TRUE WHERE id_usuario = :id AND is_deleted = FALSE", nativeQuery = true)
    int softDeleteById(@Param("id") Long id);
}
