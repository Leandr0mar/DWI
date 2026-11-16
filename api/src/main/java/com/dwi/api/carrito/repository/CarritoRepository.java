package com.dwi.api.carrito.repository;

import com.dwi.api.carrito.model.CarritoSesion;
import com.dwi.api.carrito.model.DetalleCarrito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarritoRepository extends JpaRepository<CarritoSesion, Long> {
    
    // Buscar carrito por UUID
    Optional<CarritoSesion> findByUuid(String uuid);
    
    // Verificar si existe un carrito por UUID
    boolean existsByUuid(String uuid);
}