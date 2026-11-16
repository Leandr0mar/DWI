package com.dwi.api.carrito.controller;

import com.dwi.api.carrito.model.CarritoSesion;
import com.dwi.api.carrito.model.DetalleCarrito;
import com.dwi.api.carrito.service.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/carritos")
public class CarritoController {
    
    private final CarritoService carritoService;
    
    @Autowired
    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }
    
    /**
     * Obtiene todos los carritos existentes
     * GET /api/v1/admin/carritos
     */
    @GetMapping
    public List<CarritoSesion> listarTodos() {
        return carritoService.obtenerTodos();
    }
    
    /**
     * Obtiene un carrito por su ID
     * GET /api/v1/admin/carritos/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CarritoSesion> getPorId(@PathVariable Long id) {
        return carritoService.getCarritoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Obtiene un carrito por su UUID
     * GET /api/v1/admin/carritos/uuid/{uuid}
     */
    @GetMapping("/uuid/{uuid}")
    public ResponseEntity<CarritoSesion> getPorUuid(@PathVariable String uuid) {
        return carritoService.getCarritoPorUuid(uuid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Verifica si existe un carrito por UUID
     * GET /api/v1/admin/carritos/existe/uuid/{uuid}
     */
    @GetMapping("/existe/uuid/{uuid}")
    public ResponseEntity<Boolean> verificarExistencia(@PathVariable String uuid) {
        boolean existe = carritoService.existePorUuid(uuid);
        return ResponseEntity.ok(existe);
    }
    
    /**
     * Obtiene todos los detalles (productos) de un carrito
     * GET /api/v1/admin/carritos/{id}/detalles
     */
    @GetMapping("/{id}/detalles")
    public List<DetalleCarrito> obtenerDetalles(@PathVariable Long id) {
        return carritoService.obtenerDetalles(id);
    }
}