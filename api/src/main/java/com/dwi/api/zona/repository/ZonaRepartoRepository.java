package com.dwi.api.zona.repository;

import com.dwi.api.zona.model.ZonaReparto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ZonaRepartoRepository extends JpaRepository<ZonaReparto, Long> {
    
    // Buscar por nombre del distrito
    Optional<ZonaReparto> findByNombreDistrito(String nombreDistrito);
    
    // Verificar si existe una zona con el mismo nombre
    boolean existsByNombreDistrito(String nombreDistrito);
    
    // Buscar zonas activas
    List<ZonaReparto> findByEstadoTrue();

    List<ZonaReparto> findByEstado(boolean estado);
}