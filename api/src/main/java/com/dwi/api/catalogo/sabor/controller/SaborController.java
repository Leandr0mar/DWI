package com.dwi.api.catalogo.sabor.controller;

import com.dwi.api.catalogo.sabor.model.Sabor;
import com.dwi.api.catalogo.sabor.service.SaborService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalogo/sabores")
public class SaborController {
    
    private final SaborService saborService;
    
    @Autowired
    public SaborController(SaborService saborService) {
        this.saborService = saborService;
    }
    
    /**
     * Obtiene todos los sabores disponibles
     * GET /api/v1/catalogo/sabores
     */
    @GetMapping
    public List<Sabor> listarDisponibles() {
        return saborService.obtenerSaboresDisponibles();
    }
    
    /**
     * Obtiene un sabor por su ID
     * GET /api/v1/catalogo/sabores/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Sabor> getPorId(@PathVariable Long id) {
        return saborService.getSaborById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Crea un nuevo sabor disponible
     * POST /api/v1/catalogo/sabores
     */
    @PostMapping
    public Sabor crear(@RequestBody Sabor sabor) {
        return saborService.crearSabor(sabor);
    }
    
    /**
     * Actualiza un sabor existente por su ID
     * PUT /api/v1/catalogo/sabores/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Sabor> actualizar(@PathVariable Long id, @RequestBody Sabor datosActualizacion) {
        try {
            Sabor saborActualizado = saborService.actualizarSabor(id, datosActualizacion);
            return ResponseEntity.ok(saborActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Elimina un sabor por su ID (soft delete)
     * DELETE /api/v1/catalogo/sabores/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        saborService.eliminarSabor(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Verifica si existe un sabor por nombre
     * GET /api/v1/catalogo/sabores/existe/nombre/{nombre}
     */
    @GetMapping("/existe/nombre/{nombre}")
    public ResponseEntity<Boolean> verificarExistenciaNombre(@PathVariable String nombre) {
        boolean existe = saborService.existePorNombre(nombre);
        return ResponseEntity.ok(existe);
    }
    
    /**
     * Obtiene sabores por estado de disponibilidad
     * GET /api/sabores/disponibilidad/{estado}
     */
    @GetMapping("/disponibilidad/{estado}")
    public List<Sabor> listarPorEstado(@PathVariable Boolean estado) {
        return saborService.obtenerPorDisponibilidad(estado);
    }
}

