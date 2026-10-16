package com.dwi.api.catalogo.producto.repository;

import com.dwi.api.catalogo.producto.model.Producto;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    @Override
    @EntityGraph(attributePaths = {"categoria", "sabores"})
    List<Producto> findAll();

    @Override
    @EntityGraph(attributePaths = {"categoria", "sabores"})
    Optional<Producto> findById(Long id);

    @EntityGraph(attributePaths = {"categoria", "sabores"})
    Optional<Producto> findByUuid(String uuid);

    boolean existsBySkuIgnoreCase(String sku);
}
