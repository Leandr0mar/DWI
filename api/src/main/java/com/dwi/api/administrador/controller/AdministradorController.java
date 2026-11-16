package com.dwi.api.administrador.controller;

import com.dwi.api.administrador.model.Administrador;
import com.dwi.api.administrador.service.AdministradorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/administradores")
public class AdministradorController {
    
    private final AdministradorService administradorService;
    
    public AdministradorController(AdministradorService administradorService) {
        this.administradorService = administradorService;
    }
    
    /**
     * Obtiene todos los administradores
     * GET /api/v1/admin/administradores
     */
    @GetMapping
    public List<Administrador> listarTodos() {
        return administradorService.getAllAdministradores();
    }
    
    /**
     * Obtiene un administrador por su ID
     * GET /api/v1/admin/administradores/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Administrador> getPorId(@PathVariable Long id) {
        return administradorService.getAdministradorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Crea un nuevo administrador
     * POST /api/v1/admin/administradores
     */
    @PostMapping
    public Administrador crear(@RequestBody Administrador administrador) {
        return administradorService.crearAdministrador(administrador);
    }
    
    /**
     * Actualiza un administrador existente
     * PUT /api/v1/admin/administradores/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Administrador> actualizar(@PathVariable Long id, @RequestBody Administrador datosActualizacion) {
        try {
            Administrador administradorActualizado = administradorService.actualizarAdministrador(id, datosActualizacion);
            return ResponseEntity.ok(administradorActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Elimina un administrador por su ID
     * DELETE /api/v1/admin/administradores/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            administradorService.eliminarAdministrador(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtiene administradores por nivel de acceso
     * GET /api/v1/admin/administradores/nivel/{nivel}
     */
    @GetMapping("/nivel/{nivel}")
    public List<Administrador> listarPorNivel(@PathVariable Administrador.NivelAcceso nivel) {
        return administradorService.getAdministradoresPorNivel(nivel);
    }
    
    /**
     * Verifica si existe un administrador con el nivel de acceso especificado
     * GET /api/v1/admin/administradores/existe/nivel/{nivel}
     */
    @GetMapping("/existe/nivel/{nivel}")
    public ResponseEntity<Boolean> verificarExistenciaNivel(@PathVariable Administrador.NivelAcceso nivel) {
        boolean existe = administradorService.existsByNivelAcceso(nivel);
        return ResponseEntity.ok(existe);
    }
}