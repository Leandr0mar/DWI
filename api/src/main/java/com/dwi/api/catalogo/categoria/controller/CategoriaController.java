package com.dwi.api.catalogo.categoria.controller;

import com.dwi.api.catalogo.categoria.model.Categoria;
import com.dwi.api.catalogo.categoria.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalogo/categorias")
public class CategoriaController {
    
    private final CategoriaRepository categoriaRepository;
    
    @Autowired
    public CategoriaController(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }
    
    /**
     * Obtiene todas las categorías activas
     * GET /api/v1/catalogo/categorias
     */
    @GetMapping
    public List<Categoria> listarActivas() {
        return categoriaRepository.findByEstadoTrue();
    }
    
    /**
     * Obtiene una categoría por su ID
     * GET /api/v1/catalogo/categorias/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> getPorId(@PathVariable Long id) {
        return categoriaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Crea una nueva categoría activa
     * POST /api/v1/catalogo/categorias
     */
    @PostMapping
    public Categoria crear(@RequestBody Categoria categoria) {
        // Verificar unicidad del nombre
        if (categoria.getNombre() != null && categoriaRepository.existsByNombre(categoria.getNombre())) {
            throw new IllegalStateException("Ya existe una categoría con el nombre: " + categoria.getNombre());
        }
        
        Categoria entidadCreada = categoriaRepository.save(categoria);
        return entidadCreada;
    }
    
    /**
     * Actualiza una categoría existente por su ID
     * PUT /api/v1/catalogo/categorias/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizar(@PathVariable Long id, @RequestBody Categoria datosActualizacion) {
        return categoriaRepository.findById(id)
                .map(categoria -> {
                    if (datosActualizacion.getNombre() != null) {
                        String nombreNuevo = datosActualizacion.getNombre();
                        // Verificar unicidad si el nombre está cambiando
                        if (!nombreNuevo.equalsIgnoreCase(categoria.getNombre())) {
                            if (categoriaRepository.existsByNombre(nombreNuevo)) {
                                throw new IllegalStateException("Ya existe una categoría con el nombre: " + nombreNuevo);
                            }
                        }
                        categoria.setNombre(nombreNuevo);
                    }
                    
                    categoria.setEstado(datosActualizacion.isEstado());
                    
                    Categoria entidadActualizada = categoriaRepository.save(categoria);
                    return entidadActualizada;
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Elimina una categoría por su ID (soft delete)
     * DELETE /api/v1/catalogo/categorias/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElse(null);
        if (categoria == null) return ResponseEntity.notFound().build();
        categoriaRepository.delete(categoria);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Verifica si existe una categoría por nombre
     * GET /api/v1/catalogo/categorias/existe/nombre/{nombre}
     */
    @GetMapping("/existe/nombre/{nombre}")
    public ResponseEntity<Boolean> verificarExistenciaNombre(@PathVariable String nombre) {
        boolean existe = categoriaRepository.existsByNombre(nombre);
        return ResponseEntity.ok(existe);
    }
    
    /**
     * Obtiene categorías por estado
     * GET /api/v1/catalogo/categorias/estado/{estado}
     */
    @GetMapping("/estado/{estado}")
    public List<Categoria> listarPorEstado(@PathVariable Boolean estado) {
        return categoriaRepository.findByEstado(estado);
    }
}

