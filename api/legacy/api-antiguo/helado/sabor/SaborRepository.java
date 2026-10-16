package com.dwi.api.helado.sabor;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
public interface SaborRepository extends JpaRepository<Sabor, Long> {

    // Para listar solo los sabores activos en el modal de selección
    List<Sabor> findByActivoTrue();

    // Para verificar si un sabor ya existe al crearlo
    Optional<Sabor> findByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCase(String nombre);
}