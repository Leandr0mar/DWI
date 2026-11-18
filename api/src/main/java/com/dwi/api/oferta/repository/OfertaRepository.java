package com.dwi.api.oferta.repository;

import com.dwi.api.oferta.dto.OfertaProductoProjection;
import com.dwi.api.oferta.model.Oferta;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, Long> {

    @EntityGraph(attributePaths = "productos")
    List<Oferta> findAllByOrderByFechaInicioDesc();

    @EntityGraph(attributePaths = "productos")
    List<Oferta> findAllByProductos_Id(Long productoId);

    @Query("""
            select new com.dwi.api.oferta.dto.OfertaProductoProjection(
                p.id, o.id, o.nombre, o.porcentaje, o.fechaInicio, o.fechaFin)
            from Oferta o join o.productos p
            where p.id in :productoIds
            """)
    List<OfertaProductoProjection> findAssignmentsByProductIds(
            @Param("productoIds") Collection<Long> productoIds);

    @Query("""
            select new com.dwi.api.oferta.dto.OfertaProductoProjection(
                p.id, o.id, o.nombre, o.porcentaje, o.fechaInicio, o.fechaFin)
            from Oferta o join o.productos p
            where p.id in :productoIds
              and o.fechaInicio <= :fecha
              and o.fechaFin >= :fecha
            """)
    List<OfertaProductoProjection> findEffectiveOffersByProductIds(
            @Param("productoIds") Collection<Long> productoIds,
            @Param("fecha") LocalDate fecha);

    @Query("""
            select distinct o.id
            from Oferta o join o.productos p
            where p.id in :productoIds
              and o.fechaInicio <= :fechaFin
              and o.fechaFin >= :fechaInicio
              and (:excludeId is null or o.id <> :excludeId)
            """)
    List<Long> findOverlappingOfferIds(
            @Param("productoIds") Collection<Long> productoIds,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin,
            @Param("excludeId") Long excludeId);
}
