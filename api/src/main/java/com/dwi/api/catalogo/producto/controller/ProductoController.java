package com.dwi.api.catalogo.producto.controller;

import com.dwi.api.catalogo.producto.dto.ProductoRequestDTO;
import com.dwi.api.catalogo.producto.dto.ProductoResponseDTO;
import com.dwi.api.catalogo.producto.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping("/api/v1/catalogo/productos")
    public List<ProductoResponseDTO> listar() {
        return productoService.listar();
    }

    @GetMapping("/api/v1/catalogo/productos/{uuid}")
    public ProductoResponseDTO obtenerPorUuid(@PathVariable String uuid) {
        return productoService.obtenerPorUuid(uuid);
    }

    @PostMapping("/api/v1/admin/productos")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoResponseDTO crear(@Valid @RequestBody ProductoRequestDTO request) {
        return productoService.crear(request);
    }

    @PutMapping("/api/v1/admin/productos/{id}")
    public ProductoResponseDTO actualizar(@PathVariable Long id, @Valid @RequestBody ProductoRequestDTO request) {
        return productoService.actualizar(id, request);
    }

    @DeleteMapping("/api/v1/admin/productos/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
    }
}
