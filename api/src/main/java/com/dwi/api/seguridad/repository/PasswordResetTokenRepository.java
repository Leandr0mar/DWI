package com.dwi.api.seguridad.repository;

import com.dwi.api.seguridad.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    
    // Buscar token por su valor único
    Optional<PasswordResetToken> findByToken(String token);
    
    // Verificar si existe un token por su valor
    boolean existsByToken(String token);
    
    // Buscar todos los tokens usados
    List<PasswordResetToken> findByUsadoTrue();
}