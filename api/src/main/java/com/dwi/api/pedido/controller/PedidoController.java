package com.dwi.api.pedido.controller;

import com.dwi.api.pedido.dto.PedidoAdminDTO;
import com.dwi.api.pedido.dto.PedidoCrearRequestDTO;
import com.dwi.api.pedido.model.HistorialEstadoPedido;
import com.dwi.api.pedido.model.Pedido;
import com.dwi.api.pedido.service.PedidoService;
import jakarta.validation.Valid;
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
    public List<PedidoAdminDTO> listarTodos() {
        return pedidoService.listarTodos();
    }
    
    @PostMapping
    public ResponseEntity<PedidoAdminDTO> crear(@Valid @RequestBody PedidoCrearRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.crearPedido(request));
    }
    
    /**
     * Obtiene un pedido por su ID
     * GET /api/pedidos/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<PedidoAdminDTO> getPorId(@PathVariable Long id) {
        return pedidoService.getPedidoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Obtiene un pedido por su UUID
     * GET /api/pedidos/uuid/{uuid}
     */
    @GetMapping("/uuid/{uuid}")
    public ResponseEntity<PedidoAdminDTO> getPorUuid(@PathVariable String uuid) {
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
    public List<PedidoAdminDTO> obtenerPorCliente(@PathVariable Long clienteId) {
        return pedidoService.obtenerPedidosDeCliente(clienteId);
    }
    
    /**
     * Actualiza el estado de pago de un pedido
     * PUT /api/pedidos/{id}/pago/{estadoPago}
     */
    @PutMapping("/{id}/pago/{estado}")
    public ResponseEntity<Void> actualizarEstadoPago(
            @PathVariable Long id, 
            @PathVariable String estado) {
        
        pedidoService.actualizarEstadoPago(id, Pedido.EstadoPago.valueOf(estado.toUpperCase()));
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/estado/{estado}")
    public ResponseEntity<Void> actualizarEstadoPedido(
            @PathVariable Long id,
            @PathVariable String estado) {
        pedidoService.actualizarEstadoPedido(
                id,
                HistorialEstadoPedido.EstadoPedido.valueOf(estado.toUpperCase()));
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pedidoService.eliminarPedidoPendiente(id);
        return ResponseEntity.noContent().build();
    }
}