package com.dwi.api.cliente.controller;

import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.cliente.service.ClienteService;
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
    public List<Cliente> listarTodos() {
        return clienteService.getAllClientes();
    }
    
    /**
     * Obtiene un cliente por su ID
     * GET /api/clientes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getPorId(@PathVariable Long id) {
        return clienteService.getClienteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Obtiene un cliente por su DNI
     * GET /api/clientes/dni/{dni}
     */
    @GetMapping("/dni/{dni}")
    public ResponseEntity<Cliente> getPorDni(@PathVariable String dni) {
        return clienteService.getClientePorDni(dni)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Crea un nuevo cliente
     * POST /api/clientes
     */
    @PostMapping
    public Cliente crear(@RequestBody Cliente cliente) {
        return clienteService.crearCliente(cliente);
    }
    
    /**
     * Actualiza un cliente existente por su ID
     * PUT /api/clientes/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizar(@PathVariable Long id, @RequestBody Cliente datosActualizacion) {
        try {
            Cliente clienteActualizado = clienteService.actualizarCliente(id, datosActualizacion);
            return ResponseEntity.ok(clienteActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
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

