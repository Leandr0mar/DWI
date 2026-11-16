package com.dwi.api.catalogo.producto.service;

import com.dwi.api.catalogo.categoria.model.Categoria;
import com.dwi.api.catalogo.categoria.repository.CategoriaRepository;
import com.dwi.api.catalogo.producto.dto.ProductoRequestDTO;
import com.dwi.api.catalogo.producto.dto.ProductoResponseDTO;
import com.dwi.api.catalogo.producto.model.Producto;
import com.dwi.api.catalogo.producto.repository.ProductoRepository;
import com.dwi.api.catalogo.sabor.model.Sabor;
import com.dwi.api.catalogo.sabor.repository.SaborRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class ProductoService {
    
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final SaborRepository saborRepository;
    
    @Autowired
    public ProductoService(
            ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository,
            SaborRepository saborRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.saborRepository = saborRepository;
    }
    
    /**
     * Obtiene todos los productos (con relaciones eager de categoria y sabores)
     */
    public List<ProductoResponseDTO> getAllProductos() {
        return productoRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }
    
    /**
     * Obtiene un producto por su ID
     */
    public Optional<ProductoResponseDTO> getProductoById(Long id) {
        return productoRepository.findById(id).map(this::toResponse);
    }
    
    /**
     * Obtiene un producto por su UUID
     */
    public Optional<ProductoResponseDTO> getProductoPorUuid(String uuid) {
        return productoRepository.findByUuid(uuid).map(this::toResponse);
    }
    
    /**
     * Crea un nuevo producto
     */
    @Transactional
    public ProductoResponseDTO crearProducto(ProductoRequestDTO request) {
        if (productoRepository.existsBySkuIgnoreCase(request.sku())) {
            throw new IllegalArgumentException("Ya existe un producto con ese SKU.");
        }

        return toResponse(productoRepository.save(toEntity(request)));
    }
    
    /**
     * Actualiza un producto existente por su ID
     */
    public ProductoResponseDTO actualizarProducto(Long id, ProductoRequestDTO request) {
        return productoRepository.findById(id)
                .map(producto -> {
                    if (!producto.getSku().equalsIgnoreCase(request.sku())
                            && productoRepository.existsBySkuIgnoreCase(request.sku())) {
                        throw new IllegalArgumentException("Ya existe un producto con ese SKU.");
                    }

                    Producto datosActualizacion = toEntity(request);
                    producto.setSku(datosActualizacion.getSku());
                    producto.setNombre(datosActualizacion.getNombre());
                    producto.setDescripcion(datosActualizacion.getDescripcion());
                    producto.setPrecioBase(datosActualizacion.getPrecioBase());
                    producto.setMaxSabores(datosActualizacion.getMaxSabores());
                    producto.setStockDisponible(datosActualizacion.getStockDisponible());
                    producto.setUrlImagen(datosActualizacion.getUrlImagen());
                    producto.setPesoVolumen(datosActualizacion.getPesoVolumen());
                    producto.setTipoPresentacion(datosActualizacion.getTipoPresentacion());
                    producto.setCategoria(datosActualizacion.getCategoria());
                    producto.setSabores(datosActualizacion.getSabores());

                    return toResponse(productoRepository.save(producto));
                })
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + id));
    }

    public List<ProductoResponseDTO> getProductosPorCategoria(Long categoriaId) {
        return productoRepository.findAll().stream()
                .filter(producto -> producto.getCategoria() != null
                        && producto.getCategoria().getId().equals(categoriaId))
                .map(this::toResponse)
                .toList();
    }

    public List<ProductoResponseDTO> getProductosPorCategoriaYSabor(Long categoriaId, String nombreSabor) {
        return productoRepository.findAll().stream()
                .filter(producto -> producto.getCategoria() != null
                        && producto.getCategoria().getId().equals(categoriaId))
                .filter(producto -> producto.getSabores().stream()
                        .anyMatch(sabor -> sabor.getNombre().equalsIgnoreCase(nombreSabor)))
                .map(this::toResponse)
                .toList();
    }
    
    /**
     * Elimina un producto por su ID (soft delete)
     */
    public void eliminarProducto(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }
        productoRepository.deleteById(id);
    }
    
    /**
     * Verifica si existe un producto por SKU (case insensitive)
     */
    public boolean existePorSku(String sku) {
        return productoRepository.existsBySkuIgnoreCase(sku);
    }

    private Producto toEntity(ProductoRequestDTO request) {
        Producto producto = new Producto();
        producto.setSku(request.sku());
        producto.setNombre(request.nombre());
        producto.setDescripcion(request.descripcion());
        producto.setPrecioBase(request.precioBase());
        producto.setMaxSabores(request.maxSabores());
        producto.setStockDisponible(request.stockDisponible());
        producto.setUrlImagen(request.urlImagen());
        producto.setPesoVolumen(request.pesoVolumen());
        producto.setTipoPresentacion(request.tipoPresentacion());
        producto.setCategoria(categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada.")));

        Set<Long> saborIds = request.saboresIds() == null ? Set.of() : request.saboresIds();
        List<Sabor> sabores = saborRepository.findAllById(saborIds);
        if (sabores.size() != saborIds.size()) {
            throw new EntityNotFoundException("Uno o más sabores no existen.");
        }
        producto.setSabores(new HashSet<>(sabores));
        return producto;
    }

    private ProductoResponseDTO toResponse(Producto producto) {
        Categoria categoria = producto.getCategoria();
        List<String> sabores = producto.getSabores().stream()
                .map(Sabor::getNombre)
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .toList();

        return new ProductoResponseDTO(
                producto.getId(),
                producto.getUuid(),
                producto.getSku(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecioBase(),
                producto.getMaxSabores(),
                producto.getStockDisponible(),
                categoria == null ? null : categoria.getNombre(),
                sabores,
                producto.getUrlImagen(),
                producto.getPesoVolumen(),
                producto.getTipoPresentacion() == null ? null : producto.getTipoPresentacion().name()
        );
    }
}

