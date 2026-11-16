package com.dwi.api.pedido.service;

import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.cliente.repository.ClienteRepository;
import com.dwi.api.common.exception.ResourceNotFoundException;
import com.dwi.api.direccion.model.Direccion;
import com.dwi.api.pedido.model.Pedido;
import com.dwi.api.pedido.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PedidoService {
    
    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    
    @Autowired
    public PedidoService(PedidoRepository pedidoRepository, ClienteRepository clienteRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
    }
    
    /**
     * Crea un nuevo pedido para un cliente con su dirección
     */
    @Transactional
    public Pedido crearPedido(Cliente cliente, Direccion direccion, BigDecimal subtotal, BigDecimal costoEnvio, BigDecimal igv) {
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDireccion(direccion);
        pedido.setSubtotal(subtotal);
        pedido.setCostoEnvio(costoEnvio);
        pedido.setIgv(igv);
        pedido.setTotal(subtotal.add(costoEnvio).add(igv));
        
        Pedido entidadCreada = pedidoRepository.save(pedido);
        return entidadCreada;
    }
    
    /**
     * Obtiene un pedido por su ID
     */
    public Optional<Pedido> getPedidoPorId(Long id) {
        return pedidoRepository.findById(id);
    }
    
    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    /**
     * Obtiene un pedido por su UUID
     */
    public Optional<Pedido> getPedidoPorUuid(String uuid) {
        return pedidoRepository.findByUuid(uuid);
    }
    
    /**
     * Verifica si existe un pedido por UUID
     */
    public boolean existePorUuid(String uuid) {
        return pedidoRepository.existsByUuid(uuid);
    }
    
    /**
     * Obtiene todos los pedidos de un cliente
     */
    public List<Pedido> obtenerPedidosDeCliente(Long clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado: " + clienteId));
        return pedidoRepository.findByCliente(cliente);
    }
    
    /**
     * Actualiza el estado de pago de un pedido
     */
    @Transactional
    public void actualizarEstadoPago(Long idPedido, Pedido.EstadoPago nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        pedido.setEstadoPago(nuevoEstado);
        pedidoRepository.save(pedido);
    }
}