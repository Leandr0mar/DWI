package com.dwi.api.catalogo.producto.historial;

import com.dwi.api.administrador.model.Administrador;
import com.dwi.api.administrador.repository.AdministradorRepository;
import com.dwi.api.catalogo.producto.model.Producto;
import com.dwi.api.catalogo.producto.repository.ProductoRepository;
import com.dwi.api.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class HistorialStockService {

    private final HistorialStockRepository historialRepository;
    private final ProductoRepository productoRepository;
    private final AdministradorRepository administradorRepository;

    public HistorialStockService(
            HistorialStockRepository historialRepository,
            ProductoRepository productoRepository,
            AdministradorRepository administradorRepository) {
        this.historialRepository = historialRepository;
        this.productoRepository = productoRepository;
        this.administradorRepository = administradorRepository;
    }

    public List<HistorialStockDTO> listar() {
        return historialRepository.findAllByOrderByFechaMovimientoDesc().stream().map(this::toDto).toList();
    }

    public HistorialStockDTO crear(HistorialStockRequestDTO request, String emailAdministrador) {
        if (request.cantidadAlterada() == 0) {
            throw new IllegalArgumentException("La cantidad del movimiento no puede ser cero.");
        }
        if (request.tipoMovimiento() == HistorialStock.TipoMovimiento.VENTA) {
            throw new IllegalArgumentException("Los movimientos de venta se generan desde los pedidos.");
        }
        if (request.tipoMovimiento() == HistorialStock.TipoMovimiento.INGRESO && request.cantidadAlterada() < 0
                || request.tipoMovimiento() == HistorialStock.TipoMovimiento.MERMA && request.cantidadAlterada() > 0) {
            throw new IllegalArgumentException("La cantidad no corresponde al tipo de movimiento.");
        }

        Producto producto = productoRepository.findById(request.productoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado."));
        Administrador administrador = administradorRepository.findByEmail(emailAdministrador)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador no encontrado."));
        int nuevoStock = producto.getStockDisponible() + request.cantidadAlterada();
        if (nuevoStock < 0) throw new IllegalArgumentException("El stock no puede quedar en negativo.");

        HistorialStock movimiento = new HistorialStock();
        movimiento.setProductoId(producto.getId());
        movimiento.setAdministrador(administrador);
        movimiento.setCantidadAlterada(request.cantidadAlterada());
        movimiento.setTipoMovimiento(request.tipoMovimiento());
        movimiento.setObservacion(request.observacion());
        movimiento.setNombreProducto(producto.getNombre());
        movimiento.setSkuProducto(producto.getSku());
        producto.setStockDisponible(nuevoStock);
        productoRepository.save(producto);
        return toDto(historialRepository.save(movimiento));
    }

    private HistorialStockDTO toDto(HistorialStock movimiento) {
        Administrador admin = movimiento.getAdministrador();
        return new HistorialStockDTO(
                movimiento.getId(),
                movimiento.getProductoId(),
                movimiento.getNombreProducto(),
                movimiento.getSkuProducto(),
                movimiento.getCantidadAlterada(),
                movimiento.getTipoMovimiento(),
                movimiento.getObservacion(),
                admin == null ? "Sistema" : admin.getNombres() + " " + admin.getApellidos(),
                movimiento.getFechaMovimiento());
    }
}
