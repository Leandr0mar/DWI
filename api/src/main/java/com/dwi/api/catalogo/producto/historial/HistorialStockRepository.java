package com.dwi.api.catalogo.producto.historial;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialStockRepository extends JpaRepository<HistorialStock, Long> {
    List<HistorialStock> findAllByOrderByFechaMovimientoDesc();
}
