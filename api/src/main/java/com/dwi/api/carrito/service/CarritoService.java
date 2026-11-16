package com.dwi.api.carrito.service;

import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.catalogo.producto.model.Producto;
import com.dwi.api.catalogo.sabor.model.Sabor;
import com.dwi.api.carrito.model.CarritoSesion;
import com.dwi.api.carrito.model.DetalleCarrito;
import com.dwi.api.carrito.repository.CarritoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.HashSet;

@Service
@Transactional
public class CarritoService {
    
    private final CarritoRepository carritoRepository;
    
    @Autowired
    public CarritoService(CarritoRepository carritoRepository) {
        this.carritoRepository = carritoRepository;
    }
    
    /**
     * Crea un nuevo carrito para un cliente
     */
    @Transactional
    public CarritoSesion crearCarritoParaCliente(Cliente cliente) {
        CarritoSesion carrito = new CarritoSesion();
        carrito.setCliente(cliente);
        CarritoSesion entidadCreada = carritoRepository.save(carrito);
        return entidadCreada;
    }
    
    /**
     * Obtiene un carrito por su ID
     */
    public Optional<CarritoSesion> getCarritoPorId(Long id) {
        return carritoRepository.findById(id);
    }
    
    /**
     * Obtiene un carrito por su UUID
     */
    public Optional<CarritoSesion> getCarritoPorUuid(String uuid) {
        return carritoRepository.findByUuid(uuid);
    }
    
    /**
     * Verifica si existe un carrito por UUID
     */
    public boolean existePorUuid(String uuid) {
        return carritoRepository.existsByUuid(uuid);
    }
    
    /**
     * Agrega un producto al carrito de un cliente
     */
    @Transactional
    public DetalleCarrito agregarProducto(
            String carritoUuid, 
            Producto producto,
            Integer cantidad,
            List<Sabor> sabores) {
        
        CarritoSesion carrito = carritoRepository.findByUuid(carritoUuid)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado con UUID: " + carritoUuid));
        
        DetalleCarrito detalle = new DetalleCarrito();
        detalle.setCarrito(carrito);
        detalle.setProducto(producto);
        detalle.setCantidad(cantidad);
        detalle.setSabores(new HashSet<>(sabores));
        carrito.getDetalles().add(detalle);
        carritoRepository.save(carrito);
        return detalle;
    }
    
    /**
     * Actualiza la cantidad de un producto en el carrito
     */
    @Transactional
    public DetalleCarrito actualizarCantidad(String carritoUuid, Long productoId, Integer cantidad) {
        CarritoSesion carrito = carritoRepository.findByUuid(carritoUuid)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
        
        return carrito.getDetalles().stream()
                .filter(d -> d.getProducto().getId().equals(productoId))
                .findFirst()
                .map(detalle -> {
                    detalle.setCantidad(cantidad);
                    return carritoRepository.save(carrito)
                            .getDetalles()
                            .stream()
                            .filter(d -> d.getId().equals(detalle.getId()))
                            .findFirst()
                            .orElse(detalle);
                })
                .orElseThrow(() -> new RuntimeException("Detalle del producto no encontrado"));
    }
    
    /**
     * Elimina un producto del carrito por su ID de detalle
     */
    @Transactional
    public void eliminarProducto(String carritoUuid, Long idDetalle) {
        CarritoSesion carrito = carritoRepository.findByUuid(carritoUuid)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
        
        DetalleCarrito detalle = carrito.getDetalles().stream()
                .filter(d -> d.getId().equals(idDetalle))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Detalle del producto no encontrado"));
        
        // Eliminar sabores relacionados
        detalle.getSabores().clear();
        
        DetalleCarrito detalleActualizado = carritoRepository.save(carrito)
                .getDetalles()
                .stream()
                .filter(d -> d.getId().equals(detalle.getId()))
                .findFirst()
                .orElse(detalle);
        
        // Remover del lista de detalles
        carrito.getDetalles().remove(detalleActualizado);
        carrito.setUpdatedAt(java.time.LocalDateTime.now());
        
        CarritoSesion carritoActualizado = carritoRepository.save(carrito);
    }
    
    /**
     * Obtiene todos los productos del carrito
     */
    public List<DetalleCarrito> obtenerDetalles(Long carritoId) {
        return carritoRepository.findById(carritoId)
                .map(CarritoSesion::getDetalles)
                .orElse(List.of());
    }

    public List<CarritoSesion> obtenerTodos() {
        return carritoRepository.findAll();
    }
    
    /**
     * Obtiene todos los carritos de un cliente
     */
    public List<CarritoSesion> obtenerCarritosPorCliente(Cliente cliente) {
        return carritoRepository.findAll().stream()
                .filter(c -> c.getCliente().getId().equals(cliente.getId()))
                .toList();
    }
}