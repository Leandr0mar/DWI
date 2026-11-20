package com.dwi.api.catalogo.producto.service;

import com.dwi.api.administrador.model.Administrador;
import com.dwi.api.administrador.repository.AdministradorRepository;
import com.dwi.api.catalogo.categoria.model.Categoria;
import com.dwi.api.catalogo.categoria.repository.CategoriaRepository;
import com.dwi.api.catalogo.producto.historial.HistorialStock;
import com.dwi.api.catalogo.producto.historial.HistorialStockRepository;
import com.dwi.api.catalogo.producto.dto.ProductoRequestDTO;
import com.dwi.api.catalogo.producto.dto.ProductoResponseDTO;
import com.dwi.api.catalogo.producto.model.Producto;
import com.dwi.api.catalogo.producto.repository.ProductoRepository;
import com.dwi.api.common.exception.ResourceNotFoundException;
import com.dwi.api.catalogo.sabor.model.Sabor;
import com.dwi.api.catalogo.sabor.repository.SaborRepository;
import com.dwi.api.common.exception.ResourceNotFoundException;
import com.dwi.api.oferta.dto.OfertaProductoProjection;
import com.dwi.api.oferta.model.Oferta;
import com.dwi.api.oferta.service.OfertaService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductoService {
    
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final SaborRepository saborRepository;
    private final HistorialStockRepository historialStockRepository;
    private final AdministradorRepository administradorRepository;
    private final OfertaService ofertaService;
    
    @Autowired
    public ProductoService(
            ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository,
            SaborRepository saborRepository,
            HistorialStockRepository historialStockRepository,
            AdministradorRepository administradorRepository,
            OfertaService ofertaService) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.saborRepository = saborRepository;
        this.historialStockRepository = historialStockRepository;
        this.administradorRepository = administradorRepository;
        this.ofertaService = ofertaService;
    }
    
    /**
     * Obtiene todos los productos (con relaciones eager de categoria y sabores)
     */
    public List<ProductoResponseDTO> getAllProductos() {
        return toResponses(productoRepository.findAll());
    }
    
    /**
     * Obtiene un producto por su ID
     */
    public Optional<ProductoResponseDTO> getProductoById(Long id) {
        return productoRepository.findById(id).map(producto -> toResponses(List.of(producto)).get(0));
    }
    
    /**
     * Obtiene un producto por su UUID
     */
    public Optional<ProductoResponseDTO> getProductoPorUuid(String uuid) {
        return productoRepository.findByUuid(uuid).map(producto -> toResponses(List.of(producto)).get(0));
    }
    
    /**
     * Crea un nuevo producto
     */
    @Transactional
    public ProductoResponseDTO crearProducto(ProductoRequestDTO request, String emailAdministrador) {
        if (productoRepository.existsBySkuIgnoreCase(request.sku())) {
            throw new IllegalArgumentException("Ya existe un producto con ese SKU.");
        }

        Producto producto = productoRepository.save(toEntity(request));
        ofertaService.sincronizarOfertasDeProducto(producto, request.ofertasIds());
        if (producto.getStockDisponible() > 0) {
            registrarMovimientoStock(
                    producto,
                    obtenerAdministrador(emailAdministrador),
                    producto.getStockDisponible(),
                    HistorialStock.TipoMovimiento.INGRESO,
                    "Stock inicial del producto.");
        }
        return toResponses(List.of(producto)).get(0);
    }
    
    /**
     * Actualiza un producto existente por su ID
     */
    public ProductoResponseDTO actualizarProducto(Long id, ProductoRequestDTO request, String emailAdministrador) {
        return productoRepository.findById(id)
                .map(producto -> {
                    int stockAnterior = producto.getStockDisponible();
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

                    Producto actualizado = productoRepository.save(producto);
                    ofertaService.sincronizarOfertasDeProducto(actualizado, request.ofertasIds());
                    int diferenciaStock = actualizado.getStockDisponible() - stockAnterior;
                    if (diferenciaStock != 0) {
                        registrarMovimientoStock(
                                actualizado,
                                obtenerAdministrador(emailAdministrador),
                                diferenciaStock,
                                HistorialStock.TipoMovimiento.AJUSTE,
                                "Ajuste desde mantenimiento de productos.");
                    }
                    return toResponses(List.of(actualizado)).get(0);
                })
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + id));
    }

    public List<ProductoResponseDTO> getProductosPorCategoria(Long categoriaId) {
        List<Producto> productos = productoRepository.findAll().stream()
                .filter(producto -> producto.getCategoria() != null
                        && producto.getCategoria().getId().equals(categoriaId))
                .toList();
        return toResponses(productos);
    }

    public List<ProductoResponseDTO> getProductosPorCategoriaYSabor(Long categoriaId, String nombreSabor) {
        List<Producto> productos = productoRepository.findAll().stream()
                .filter(producto -> producto.getCategoria() != null
                        && producto.getCategoria().getId().equals(categoriaId))
                .filter(producto -> producto.getSabores().stream()
                        .anyMatch(sabor -> sabor.getNombre().equalsIgnoreCase(nombreSabor)))
                .toList();
        return toResponses(productos);
    }
    
    /**
     * Elimina un producto por su ID (soft delete)
     */
    public void eliminarProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        productoRepository.delete(producto);
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

    private List<ProductoResponseDTO> toResponses(List<Producto> productos) {
        if (productos.isEmpty()) return List.of();
        List<Long> ids = productos.stream().map(Producto::getId).toList();
        Map<Long, List<OfertaProductoProjection>> asignaciones = ofertaService.listarAsignaciones(ids).stream()
                .collect(Collectors.groupingBy(OfertaProductoProjection::productoId));
        Map<Long, List<OfertaProductoProjection>> vigentes = ofertaService.listarVigentes(ids).stream()
                .collect(Collectors.groupingBy(OfertaProductoProjection::productoId));
        return productos.stream()
                .map(producto -> toResponse(producto, asignaciones.getOrDefault(producto.getId(), List.of()),
                        vigentes.getOrDefault(producto.getId(), List.of())))
                .toList();
    }

    private ProductoResponseDTO toResponse(
            Producto producto,
            List<OfertaProductoProjection> asignaciones,
            List<OfertaProductoProjection> vigentes) {
        Categoria categoria = producto.getCategoria();
        List<String> sabores = producto.getSabores().stream()
                .map(Sabor::getNombre)
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .toList();
        if (vigentes.size() > 1) {
            throw new IllegalStateException("Hay más de una oferta vigente para el producto " + producto.getId() + ".");
        }
        OfertaProductoProjection ofertaVigente = vigentes.isEmpty() ? null : vigentes.get(0);
        java.math.BigDecimal precioFinal = ofertaVigente == null
                ? producto.getPrecioBase()
                : Oferta.calcularPrecioFinal(producto.getPrecioBase(), ofertaVigente.porcentaje());

        return new ProductoResponseDTO(
                producto.getId(),
                producto.getUuid(),
                producto.getSku(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecioBase(),
                producto.getMaxSabores(),
                producto.getStockDisponible(),
                categoria == null ? null : categoria.getId(),
                categoria == null ? null : categoria.getNombre(),
                producto.getSabores().stream()
                        .map(Sabor::getId)
                        .sorted()
                        .toList(),
                sabores,
                producto.getUrlImagen(),
                producto.getPesoVolumen(),
                producto.getTipoPresentacion() == null ? null : producto.getTipoPresentacion().name(),
                asignaciones.stream().map(OfertaProductoProjection::ofertaId).distinct().sorted().toList(),
                precioFinal,
                ofertaVigente == null ? null : ofertaVigente.nombre(),
                ofertaVigente == null ? null : ofertaVigente.porcentaje()
        );
    }

    private Administrador obtenerAdministrador(String email) {
        return administradorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador no encontrado."));
    }

    private void registrarMovimientoStock(
            Producto producto,
            Administrador administrador,
            int cantidad,
            HistorialStock.TipoMovimiento tipo,
            String observacion) {
        HistorialStock movimiento = new HistorialStock();
        movimiento.setProductoId(producto.getId());
        movimiento.setAdministrador(administrador);
        movimiento.setCantidadAlterada(cantidad);
        movimiento.setTipoMovimiento(tipo);
        movimiento.setObservacion(observacion);
        movimiento.setNombreProducto(producto.getNombre());
        movimiento.setSkuProducto(producto.getSku());
        historialStockRepository.save(movimiento);
    }
}

