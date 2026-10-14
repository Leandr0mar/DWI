package com.dwi.api.usuario.repository;

import com.dwi.api.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Spring Data construye automáticamente la consulta SQL: SELECT * FROM usuario WHERE email = ?
    Optional<Usuario> findByEmail(String email);
    
    // Buscar por UUID para exponer en la API en lugar del ID numérico
    Optional<Usuario> findByUuid(String uuid);
}