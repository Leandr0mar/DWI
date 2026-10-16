package com.dwi.api.catalogo.producto.service;

import com.dwi.api.catalogo.categoria.model.Categoria;
import com.dwi.api.catalogo.categoria.repository.CategoriaRepository;
import com.dwi.api.catalogo.producto.dto.ProductoRequestDTO;
import com.dwi.api.catalogo.producto.dto.ProductoResponseDTO;
import com.dwi.api.catalogo.producto.model.Producto;
import com.dwi.api.catalogo.producto.repository.ProductoRepository;
import com.dwi.api.catalogo.sabor.model.Sabor;
import com.dwi.api.catalogo.sabor.repository.SaborRepository;
import com.dwi.api.common.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final SaborRepository saborRepository;

    @Transactional
    public List<ProductoResponseDTO> listar() {
        return productoRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public ProductoResponseDTO obtenerPorUuid(String uuid) {
        return toDto(productoRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el producto solicitado.")));
    }

    @Transactional
    public ProductoResponseDTO crear(ProductoRequestDTO request) {
        if (productoRepository.existsBySkuIgnoreCase(request.sku())) {
            throw new IllegalArgumentException("Ya existe un producto con ese SKU.");
        }
        Producto producto = new Producto();
        aplicarDatos(producto, request);
        return toDto(productoRepository.save(producto));
    }

    @Transactional
    public ProductoResponseDTO actualizar(Long id, ProductoRequestDTO request) {
        Producto producto = buscarProducto(id);
        if (!producto.getSku().equalsIgnoreCase(request.sku()) && productoRepository.existsBySkuIgnoreCase(request.sku())) {
            throw new IllegalArgumentException("Ya existe un producto con ese SKU.");
        }
        aplicarDatos(producto, request);
        return toDto(productoRepository.save(producto));
    }

    @Transactional
    public void eliminar(Long id) {
        Producto producto = buscarProducto(id);
        productoRepository.delete(producto);
    }

    private void aplicarDatos(Producto producto, ProductoRequestDTO request) {
        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la categoría indicada."));
        Set<Long> idsSabores = request.saboresIds() == null ? Set.of() : request.saboresIds();
        List<Sabor> sabores = saborRepository.findAllById(idsSabores);
        if (sabores.size() != idsSabores.size()) {
            throw new ResourceNotFoundException("Uno o más sabores indicados no existen.");
        }
        if (sabores.stream().anyMatch(sabor -> !sabor.isEstadoDisponibilidad())) {
            throw new IllegalArgumentException("No se pueden asignar sabores no disponibles.");
        }
        if (sabores.size() > request.maxSabores()) {
            throw new IllegalArgumentException("La cantidad de sabores supera el máximo configurado.");
        }

        producto.setSku(request.sku().trim());
        producto.setNombre(request.nombre().trim());
        producto.setDescripcion(request.descripcion());
        producto.setPrecioBase(request.precioBase());
        producto.setMaxSabores(request.maxSabores());
        producto.setStockDisponible(request.stockDisponible());
        producto.setUrlImagen(request.urlImagen());
        producto.setPesoVolumen(request.pesoVolumen().trim());
        producto.setTipoPresentacion(request.tipoPresentacion());
        producto.setCategoria(categoria);
        producto.setSabores(sabores.stream().collect(Collectors.toSet()));
    }

    private Producto buscarProducto(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el producto con ID " + id + "."));
    }

    private ProductoResponseDTO toDto(Producto producto) {
        return new ProductoResponseDTO(
                producto.getId(),
                producto.getUuid(),
                producto.getSku(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecioBase(),
                producto.getMaxSabores(),
                producto.getStockDisponible(),
                producto.getCategoria().getNombre(),
                producto.getSabores().stream().map(Sabor::getNombre).sorted().toList(),
                producto.getUrlImagen(),
                producto.getPesoVolumen(),
                producto.getTipoPresentacion() == null ? null : producto.getTipoPresentacion().name()
        );
    }
}
