package com.dwi.api.zona.controller;

import com.dwi.api.zona.model.ZonaReparto;
import com.dwi.api.zona.service.ZonaRepartoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zonas")
public class ZonaRepartoController {
    
    private final ZonaRepartoService zonaRepartoService;
    
    public ZonaRepartoController(ZonaRepartoService zonaRepartoService) {
        this.zonaRepartoService = zonaRepartoService;
    }
    
    /**
     * Obtiene todas las zonas activas
     * GET /api/zonas
     */
    @GetMapping
    public List<ZonaReparto> listarActivas() {
        return zonaRepartoService.obtenerTodasActivas();
    }
    
    /**
     * Obtiene una zona por su ID
     * GET /api/zonas/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ZonaReparto> getPorId(@PathVariable Long id) {
        return zonaRepartoService.getZonaPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Crea una nueva zona de reparto
     * POST /api/zonas
     */
    @PostMapping
    public ZonaReparto crear(@RequestBody ZonaReparto zona) {
        return zonaRepartoService.crearZona(zona);
    }
    
    /**
     * Actualiza una zona existente por su ID
     * PUT /api/zonas/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ZonaReparto> actualizar(@PathVariable Long id, @RequestBody ZonaReparto datosActualizacion) {
        try {
            ZonaReparto zonaActualizada = zonaRepartoService.actualizarZona(id, datosActualizacion);
            return ResponseEntity.ok(zonaActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Elimina una zona por su ID (soft delete)
     * DELETE /api/zonas/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            zonaRepartoService.eliminarZona(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Verifica si existe una zona por nombreDistrito
     * GET /api/zonas/existe/nombre/{nombre}
     */
    @GetMapping("/existe/nombre/{nombre}")
    public ResponseEntity<Boolean> verificarExistenciaNombre(@PathVariable String nombre) {
        boolean existe = zonaRepartoService.existePorNombreDistrito(nombre);
        return ResponseEntity.ok(existe);
    }
    
    /**
     * Obtiene zonas filtradas por estado de disponibilidad
     * GET /api/zonas/disponibilidad/{estado}
     */
    @GetMapping("/disponibilidad/{estado}")
    public List<ZonaReparto> listarPorEstado(@PathVariable Boolean estado) {
        return zonaRepartoService.obtenerPorEstado(estado);
    }
}