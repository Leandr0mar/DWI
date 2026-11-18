package com.dwi.api.cliente.controller;

import com.dwi.api.cliente.dto.ClienteAdminDTO;
import com.dwi.api.cliente.dto.ClienteAdminRequestDTO;
import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.cliente.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    
    private final ClienteService clienteService;
    
    @Autowired
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }
    
    /**
     * Obtiene todos los clientes no eliminados
     * GET /api/clientes
     */
    @GetMapping
    public List<ClienteAdminDTO> listarTodos() {
        return clienteService.listarParaAdministracion();
    }
    
    /**
     * Obtiene un cliente por su ID
     * GET /api/clientes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClienteAdminDTO> getPorId(@PathVariable Long id) {
        return clienteService.getParaAdministracion(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Obtiene un cliente por su DNI
     * GET /api/clientes/dni/{dni}
     */
    @GetMapping("/dni/{dni}")
    public ResponseEntity<ClienteAdminDTO> getPorDni(@PathVariable String dni) {
        return clienteService.getClientePorDni(dni)
                .map(cliente -> new ClienteAdminDTO(cliente.getId(), cliente.getUuid(), cliente.getNombres(),
                        cliente.getApellidos(), cliente.getEmail(), cliente.getAvatarUrl(), cliente.getDni(), cliente.getTelefono()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Crea un nuevo cliente
     * POST /api/clientes
     */
    @PostMapping
    public ClienteAdminDTO crear(@Valid @RequestBody ClienteAdminRequestDTO request) {
        return clienteService.crearDesdeAdministracion(request);
    }
    
    /**
     * Actualiza un cliente existente por su ID
     * PUT /api/clientes/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClienteAdminDTO> actualizar(@PathVariable Long id, @Valid @RequestBody ClienteAdminRequestDTO request) {
        try {
            ClienteAdminDTO clienteActualizado = clienteService.actualizarDesdeAdministracion(id, request);
            return ResponseEntity.ok(clienteActualizado);
        } catch (IllegalArgumentException e) {
            if ("Cliente no encontrado.".equals(e.getMessage())) return ResponseEntity.notFound().build();
            throw e;
        }
    }
    
    /**
     * Elimina un cliente por su ID
     * DELETE /api/clientes/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            clienteService.eliminarCliente(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Verifica si existe un cliente por DNI
     * GET /api/clientes/existe/dni/{dni}
     */
    @GetMapping("/existe/dni/{dni}")
    public ResponseEntity<Boolean> verificarExistenciaDni(@PathVariable String dni) {
        boolean existe = clienteService.existePorDni(dni);
        return ResponseEntity.ok(existe);
    }
}

