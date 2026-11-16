package com.dwi.api.direccion.controller;

import com.dwi.api.direccion.model.Direccion;
import com.dwi.api.direccion.service.DireccionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/direcciones")
public class DireccionController {
    
    private final DireccionService direccionService;
    public DireccionController(DireccionService direccionService) {
        this.direccionService = direccionService;
    }
    
    /**
     * Obtiene todas las direcciones (todas las existentes en la DB)
     * GET /api/direcciones
     */
    @GetMapping
    public List<Direccion> listarTodos() {
        return direccionService.listarTodas();
    }
    
    /**
     * Obtiene una dirección por su ID
     * GET /api/direcciones/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Direccion> getPorId(@PathVariable Long id) {
        return direccionService.getDireccionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Obtiene todas las direcciones de un cliente
     * GET /api/direcciones/cliente/{clienteId}
     */
    @GetMapping("/cliente/{clienteId}")
    public List<Direccion> obtenerPorCliente(@PathVariable Long clienteId) {
        return direccionService.obtenerDireccionesDeCliente(clienteId);
    }
    
    /**
     * Obtiene todas las direcciones de un cliente en una zona específica
     * GET /api/direcciones/cliente/{clienteId}/zona/{zonaId}
     */
    @GetMapping("/cliente/{clienteId}/zona/{zonaId}")
    public List<Direccion> obtenerPorClienteYZona(
            @PathVariable Long clienteId, 
            @PathVariable Long zonaId) {
        
        return direccionService.obtenerDireccionesEnZona(clienteId, zonaId);
    }
    
    /**
     * Obtiene la dirección principal de un cliente
     * GET /api/direcciones/principal/cliente/{clienteId}
     */
    @GetMapping("/principal/cliente/{clienteId}")
    public ResponseEntity<Direccion> obtenerPrincipalDeCliente(@PathVariable Long clienteId) {
        return direccionService.obtenerDireccionPrincipal(clienteId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Verifica si un cliente tiene al menos una dirección
     * GET /api/direcciones/tiene/cliente/{clienteId}
     */
    @GetMapping("/tiene/cliente/{clienteId}")
    public ResponseEntity<Boolean> verificarSiTieneDirecciones(@PathVariable Long clienteId) {
        boolean tiene = direccionService.tieneDirecciones(clienteId);
        return ResponseEntity.ok(tiene);
    }
    
    /**
     * Crea una nueva dirección para un cliente
     * POST /api/direcciones/cliente/{clienteId}
     */
    @PostMapping("/cliente/{clienteId}")
    public Direccion crearParaCliente(@PathVariable Long clienteId, @RequestBody Direccion direccion) {
        return direccionService.crearDireccion(clienteId, direccion);
    }
    
    /**
     * Actualiza una dirección existente por su ID
     * PUT /api/direcciones/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Direccion> actualizar(@PathVariable Long id, @RequestBody Direccion datosActualizacion) {
        return ResponseEntity.ok(direccionService.actualizarDireccion(id, datosActualizacion));
    }
    
    /**
     * Elimina una dirección por su ID
     * DELETE /api/direcciones/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        direccionService.eliminarDireccion(id);
        return ResponseEntity.noContent().build();
    }
}