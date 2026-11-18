package com.dwi.api.direccion.controller;

import com.dwi.api.direccion.dto.DireccionAdminDTO;
import com.dwi.api.direccion.dto.DireccionAdminRequestDTO;
import com.dwi.api.direccion.model.Direccion;
import com.dwi.api.direccion.service.DireccionService;
import jakarta.validation.Valid;
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
    public List<DireccionAdminDTO> listarTodos() {
        return direccionService.listarParaAdministracion();
    }
    
    /**
     * Obtiene una dirección por su ID
     * GET /api/direcciones/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<DireccionAdminDTO> getPorId(@PathVariable Long id) {
        return direccionService.getParaAdministracion(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Obtiene todas las direcciones de un cliente
     * GET /api/direcciones/cliente/{clienteId}
     */
    @GetMapping("/cliente/{clienteId}")
    public List<DireccionAdminDTO> obtenerPorCliente(@PathVariable Long clienteId) {
        return direccionService.obtenerParaCliente(clienteId);
    }
    
    /**
     * Obtiene todas las direcciones de un cliente en una zona específica
     * GET /api/direcciones/cliente/{clienteId}/zona/{zonaId}
     */
    @GetMapping("/cliente/{clienteId}/zona/{zonaId}")
    public List<DireccionAdminDTO> obtenerPorClienteYZona(
            @PathVariable Long clienteId, 
            @PathVariable Long zonaId) {
        
        return direccionService.obtenerDireccionesEnZona(clienteId, zonaId).stream()
                .map(direccion -> new DireccionAdminDTO(
                        direccion.getId(), direccion.getCliente().getId(),
                        direccion.getCliente().getNombres() + " " + direccion.getCliente().getApellidos(),
                        direccion.getZona().getId(), direccion.getZona().getNombreDistrito(),
                        direccion.getAlias(), direccion.getLinea1(), direccion.getLinea2(),
                        direccion.getReferencia(), direccion.isEsPrincipal()))
                .toList();
    }
    
    /**
     * Obtiene la dirección principal de un cliente
     * GET /api/direcciones/principal/cliente/{clienteId}
     */
    @GetMapping("/principal/cliente/{clienteId}")
    public ResponseEntity<DireccionAdminDTO> obtenerPrincipalDeCliente(@PathVariable Long clienteId) {
        return direccionService.obtenerDireccionPrincipal(clienteId)
                .map(direccion -> new DireccionAdminDTO(
                        direccion.getId(), direccion.getCliente().getId(),
                        direccion.getCliente().getNombres() + " " + direccion.getCliente().getApellidos(),
                        direccion.getZona().getId(), direccion.getZona().getNombreDistrito(),
                        direccion.getAlias(), direccion.getLinea1(), direccion.getLinea2(),
                        direccion.getReferencia(), direccion.isEsPrincipal()))
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
    public DireccionAdminDTO crearParaCliente(
            @PathVariable Long clienteId,
            @Valid @RequestBody DireccionAdminRequestDTO request) {
        return direccionService.crearParaAdministracion(clienteId, request);
    }
    
    /**
     * Actualiza una dirección existente por su ID
     * PUT /api/direcciones/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<DireccionAdminDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody DireccionAdminRequestDTO request) {
        return ResponseEntity.ok(direccionService.actualizarParaAdministracion(id, request));
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