package com.dwi.api.catalogo.producto.controller;

import com.dwi.api.catalogo.producto.dto.ProductoRequestDTO;
import com.dwi.api.catalogo.producto.dto.ProductoResponseDTO;
import com.dwi.api.catalogo.producto.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalogo/productos")
public class ProductoController {
    
    private final ProductoService productoService;
    
    @Autowired
    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }
    
    /**
     * Obtiene todos los productos (con relaciones eager de categoria y sabores)
     * GET /api/v1/catalogo/productos
     */
    @GetMapping
    public List<ProductoResponseDTO> listarTodos() {
        return productoService.getAllProductos();
    }
    
    /**
     * Obtiene un producto por su ID
     * GET /api/v1/catalogo/productos/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> getPorId(@PathVariable Long id) {
        return productoService.getProductoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Obtiene un producto por su UUID
     * GET /api/v1/catalogo/productos/uuid/{uuid}
     */
    @GetMapping("/uuid/{uuid}")
    public ResponseEntity<ProductoResponseDTO> getPorUuid(@PathVariable String uuid) {
        return productoService.getProductoPorUuid(uuid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Crea un nuevo producto
     * POST /api/v1/catalogo/productos
     */
    @PostMapping
    public ProductoResponseDTO crear(@Valid @RequestBody ProductoRequestDTO request) {
        return productoService.crearProducto(request);
    }
    
    /**
     * Actualiza un producto existente por su ID
     * PUT /api/v1/catalogo/productos/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProductoRequestDTO request) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, request));
    }
    
    /**
     * Elimina un producto por su ID
     * DELETE /api/v1/catalogo/productos/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            productoService.eliminarProducto(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Verifica si existe un producto por SKU
     * GET /api/v1/catalogo/productos/existe/sku/{sku}
     */
    @GetMapping("/existe/sku/{sku}")
    public ResponseEntity<Boolean> verificarExistenciaSku(@PathVariable String sku) {
        boolean existe = productoService.existePorSku(sku);
        return ResponseEntity.ok(existe);
    }
    
    /**
     * Obtiene productos por categoría
     * GET /api/v1/catalogo/productos/categoria/{categoriaId}
     */
    @GetMapping("/categoria/{categoriaId}")
    public List<ProductoResponseDTO> listarPorCategoria(@PathVariable Long categoriaId) {
        return productoService.getProductosPorCategoria(categoriaId);
    }
    
    /**
     * Obtiene productos filtrados por categoría y nombre de sabor
     * GET /api/v1/catalogo/productos/categoria/{categoriaId}/sabor/{nombreSabor}
     */
    @GetMapping("/categoria/{categoriaId}/sabor/{nombreSabor}")
    public List<ProductoResponseDTO> listarPorCategoriaYSabor(
            @PathVariable Long categoriaId, 
            @PathVariable String nombreSabor) {
        return productoService.getProductosPorCategoriaYSabor(categoriaId, nombreSabor);
    }
}

