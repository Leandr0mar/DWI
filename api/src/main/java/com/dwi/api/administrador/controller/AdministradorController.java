package com.dwi.api.administrador.controller;

import com.dwi.api.administrador.dto.AdministradorDTO;
import com.dwi.api.administrador.dto.AdministradorRequestDTO;
import com.dwi.api.administrador.model.Administrador;
import com.dwi.api.administrador.service.AdministradorService;
import jakarta.validation.Valid;
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
    public List<AdministradorDTO> listarTodos() {
        return administradorService.getAllAdministradores();
    }
    
    /**
     * Obtiene un administrador por su ID
     * GET /api/v1/admin/administradores/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdministradorDTO> getPorId(@PathVariable Long id) {
        return administradorService.getAdministradorById(id)
                .map(admin -> new AdministradorDTO(admin.getId(), admin.getUuid(), admin.getNombres(),
                        admin.getApellidos(), admin.getEmail(), admin.getAvatarUrl(), admin.getNivelAcceso().name(), admin.getUltimoAcceso()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Crea un nuevo administrador
     * POST /api/v1/admin/administradores
     */
    @PostMapping
    public AdministradorDTO crear(@Valid @RequestBody AdministradorRequestDTO request) {
        return administradorService.crearAdministrador(request);
    }
    
    /**
     * Actualiza un administrador existente
     * PUT /api/v1/admin/administradores/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<AdministradorDTO> actualizar(@PathVariable Long id, @Valid @RequestBody AdministradorRequestDTO request) {
        try {
            AdministradorDTO administradorActualizado = administradorService.actualizarAdministrador(id, request);
            return ResponseEntity.ok(administradorActualizado);
        } catch (IllegalArgumentException e) {
            if ("Administrador no encontrado.".equals(e.getMessage())) return ResponseEntity.notFound().build();
            throw e;
        }
    }
    
    /**
     * Elimina un administrador por su ID
     * DELETE /api/v1/admin/administradores/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        administradorService.eliminarAdministrador(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Obtiene administradores por nivel de acceso
     * GET /api/v1/admin/administradores/nivel/{nivel}
     */
    @GetMapping("/nivel/{nivel}")
    public List<AdministradorDTO> listarPorNivel(@PathVariable Administrador.NivelAcceso nivel) {
        return administradorService.getAdministradoresPorNivel(nivel).stream()
                .map(admin -> new AdministradorDTO(admin.getId(), admin.getUuid(), admin.getNombres(),
                        admin.getApellidos(), admin.getEmail(), admin.getAvatarUrl(), admin.getNivelAcceso().name(), admin.getUltimoAcceso()))
                .toList();
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
