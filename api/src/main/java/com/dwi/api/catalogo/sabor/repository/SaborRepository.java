package com.dwi.api.catalogo.sabor.repository;

import com.dwi.api.catalogo.sabor.model.Sabor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaborRepository extends JpaRepository<Sabor, Long> {
    List<Sabor> findAllByEstadoDisponibilidadTrueOrderByNombreAsc();
}
