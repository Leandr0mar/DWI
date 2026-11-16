package com.dwi.api.catalogo.categoria.repository;

import com.dwi.api.catalogo.categoria.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    
    // Buscar por nombre (para validación de unicidad)
    Optional<Categoria> findByNombre(String nombre);
    
    // Verificar si existe una categoría con el mismo nombre
    boolean existsByNombre(String nombre);
    
    // Buscar categorías activas
    List<Categoria> findByEstadoTrue();

    List<Categoria> findByEstado(boolean estado);
}
