package com.dwi.api.pedido.controller;

import com.dwi.api.pedido.model.Pedido;
import com.dwi.api.pedido.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    
    private final PedidoService pedidoService;
    
    @Autowired
    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }
    
    /**
     * Obtiene todos los pedidos (para admin/administrador)
     * GET /api/pedidos
     */
    @GetMapping
    public List<Pedido> listarTodos() {
        return pedidoService.listarTodos();
    }
    
    /** No crea pedidos vacíos; falta recibir y validar los detalles y precios del carrito. */
    @PostMapping("/cliente/{clienteId}/direccion/{direccionId}")
    public ResponseEntity<Pedido> crear(
            @PathVariable Long clienteId, 
            @PathVariable Long direccionId) {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }
    
    /**
     * Obtiene un pedido por su ID
     * GET /api/pedidos/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getPorId(@PathVariable Long id) {
        return pedidoService.getPedidoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Obtiene un pedido por su UUID
     * GET /api/pedidos/uuid/{uuid}
     */
    @GetMapping("/uuid/{uuid}")
    public ResponseEntity<Pedido> getPorUuid(@PathVariable String uuid) {
        return pedidoService.getPedidoPorUuid(uuid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Verifica si existe un pedido por UUID
     * GET /api/pedidos/existe/uuid/{uuid}
     */
    @GetMapping("/existe/uuid/{uuid}")
    public ResponseEntity<Boolean> verificarExistencia(@PathVariable String uuid) {
        boolean existe = pedidoService.existePorUuid(uuid);
        return ResponseEntity.ok(existe);
    }
    
    /**
     * Obtiene todos los pedidos de un cliente específico
     * GET /api/pedidos/cliente/{clienteId}
     */
    @GetMapping("/cliente/{clienteId}")
    public List<Pedido> obtenerPorCliente(@PathVariable Long clienteId) {
        return pedidoService.obtenerPedidosDeCliente(clienteId);
    }
    
    /**
     * Actualiza el estado de pago de un pedido
     * PUT /api/pedidos/{id}/pago/{estadoPago}
     */
    @PutMapping("/{id}/pago/{estado}")
    public ResponseEntity<String> actualizarEstadoPago(
            @PathVariable Long id, 
            @PathVariable String estado) {
        
        try {
            pedidoService.actualizarEstadoPago(id, Pedido.EstadoPago.valueOf(estado.toUpperCase()));
            return ResponseEntity.ok("Estado actualizado a: " + estado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}