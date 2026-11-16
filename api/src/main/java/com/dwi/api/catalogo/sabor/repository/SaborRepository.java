package com.dwi.api.catalogo.sabor.repository;

import com.dwi.api.catalogo.sabor.model.Sabor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SaborRepository extends JpaRepository<Sabor, Long> {
    
    // Buscar por nombre (para validación)
    Optional<Sabor> findByNombre(String nombre);
    
    // Verificar si existe un sabor con el mismo nombre
    boolean existsByNombre(String nombre);
    
    // Buscar sabores activos
    List<Sabor> findByEstadoDisponibilidadTrue();

    List<Sabor> findByEstadoDisponibilidad(boolean estadoDisponibilidad);
}

