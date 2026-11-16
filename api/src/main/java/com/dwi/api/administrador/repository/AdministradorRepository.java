package com.dwi.api.administrador.repository;

import com.dwi.api.administrador.model.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    
    List<Administrador> findByNivelAcceso(Administrador.NivelAcceso nivelAcceso);
    
    boolean existsByNivelAcceso(Administrador.NivelAcceso nivelAcceso);
}