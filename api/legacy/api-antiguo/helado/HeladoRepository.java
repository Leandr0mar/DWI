package com.dwi.api.helado;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HeladoRepository extends JpaRepository<Helado, Long> {

    @Query("SELECT DISTINCT h FROM Helado h LEFT JOIN FETCH h.sabores WHERE h.id= :id")
    Optional<Helado> findByIdWithSabor(@Param("id") Long id);

    @Query("SELECT DISTINCT h FROM Helado h LEFT JOIN FETCH h.sabores")
    List<Helado> findAllWithSabor();

    // Fallback por si aún no hay ventas en la semana
    @Query("SELECT DISTINCT h FROM Helado h LEFT JOIN FETCH h.sabores WHERE h.estado = 'ACTIVO' AND h.stock > 0 ORDER BY h.stock DESC")
    List<Helado> findTopFallback(Pageable pageable);
}