package com.dwi.api.administrador.repository;

import com.dwi.api.administrador.model.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    
    List<Administrador> findByNivelAcceso(Administrador.NivelAcceso nivelAcceso);
    
    boolean existsByNivelAcceso(Administrador.NivelAcceso nivelAcceso);

    Optional<Administrador> findByEmail(String email);

    long countByNivelAcceso(Administrador.NivelAcceso nivelAcceso);
}