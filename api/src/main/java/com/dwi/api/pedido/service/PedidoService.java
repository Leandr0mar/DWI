package com.dwi.api.pedido.service;

import com.dwi.api.catalogo.producto.historial.HistorialStock;
import com.dwi.api.catalogo.producto.historial.HistorialStockRepository;
import com.dwi.api.catalogo.producto.model.Producto;
import com.dwi.api.catalogo.producto.repository.ProductoRepository;
import com.dwi.api.catalogo.sabor.model.Sabor;
import com.dwi.api.catalogo.sabor.repository.SaborRepository;
import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.cliente.repository.ClienteRepository;
import com.dwi.api.common.exception.ResourceNotFoundException;
import com.dwi.api.direccion.model.Direccion;
import com.dwi.api.direccion.repository.DireccionRepository;
import com.dwi.api.oferta.dto.OfertaProductoProjection;
import com.dwi.api.oferta.model.Oferta;
import com.dwi.api.oferta.service.OfertaService;
import com.dwi.api.pedido.dto.PedidoAdminDTO;
import com.dwi.api.pedido.dto.PedidoCrearRequestDTO;
import com.dwi.api.pedido.dto.PedidoCheckoutRequestDTO;
import com.dwi.api.pedido.dto.PedidoDetalleAdminDTO;
import com.dwi.api.pedido.model.DetallePedido;
import com.dwi.api.pedido.model.HistorialEstadoPedido;
import com.dwi.api.pedido.model.Pedido;
import com.dwi.api.pedido.repository.DetallePedidoRepository;
import com.dwi.api.pedido.repository.HistorialEstadoPedidoRepository;
import com.dwi.api.pedido.repository.PedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.Map;
import java.util.Collection;
import java.util.stream.Collectors;

@Service
@Transactional
public class PedidoService {

    private static final BigDecimal IGV_RATE = new BigDecimal("0.18");

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final DireccionRepository direccionRepository;
    private final ProductoRepository productoRepository;
    private final SaborRepository saborRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final HistorialEstadoPedidoRepository historialEstadoRepository;
    private final HistorialStockRepository historialStockRepository;
    private final OfertaService ofertaService;

    public PedidoService(
            PedidoRepository pedidoRepository,
            ClienteRepository clienteRepository,
            DireccionRepository direccionRepository,
            ProductoRepository productoRepository,
            SaborRepository saborRepository,
            DetallePedidoRepository detallePedidoRepository,
            HistorialEstadoPedidoRepository historialEstadoRepository,
            HistorialStockRepository historialStockRepository,
            OfertaService ofertaService) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.direccionRepository = direccionRepository;
        this.productoRepository = productoRepository;
        this.saborRepository = saborRepository;
        this.detallePedidoRepository = detallePedidoRepository;
        this.historialEstadoRepository = historialEstadoRepository;
        this.historialStockRepository = historialStockRepository;
        this.ofertaService = ofertaService;
    }

    public PedidoAdminDTO crearPedido(PedidoCrearRequestDTO request) {
        return crearPedido(request.clienteId(), request.direccionId(), request.detalles());
    }

    public PedidoAdminDTO crearPedidoParaUsuario(String email, PedidoCheckoutRequestDTO request) {
        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado."));
        List<PedidoCrearRequestDTO.DetalleRequestDTO> detalles = request.detalles().stream()
                .map(detalle -> new PedidoCrearRequestDTO.DetalleRequestDTO(
                        detalle.productoId(), detalle.cantidad(), detalle.saboresIds()))
                .toList();
        return crearPedido(cliente.getId(), request.direccionId(), detalles);
    }

    private PedidoAdminDTO crearPedido(
            Long clienteId,
            Long direccionId,
            Collection<PedidoCrearRequestDTO.DetalleRequestDTO> requestDetalles) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado."));
        Direccion direccion = direccionRepository.findById(direccionId)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada."));
        if (!direccion.getCliente().getId().equals(cliente.getId())) {
            throw new IllegalArgumentException("La dirección no pertenece al cliente indicado.");
        }
        if (!direccion.getZona().isEstado()) {
            throw new IllegalArgumentException("La zona de reparto no está disponible.");
        }

        Pedido pedido = new Pedido();
        pedido.setClienteId(cliente.getId());
        pedido.setClienteNombre(cliente.getNombres() + " " + cliente.getApellidos());
        pedido.setClienteEmail(cliente.getEmail());
        pedido.setDireccionEntrega(formatearDireccion(direccion));
        pedido.setCostoEnvio(direccion.getZona().getCostoEnvio());

        BigDecimal subtotal = BigDecimal.ZERO;
        List<DetallePedido> detalles = new java.util.ArrayList<>();
        Map<Long, List<OfertaProductoProjection>> ofertasVigentes = ofertaService.listarVigentes(
                        requestDetalles.stream().map(PedidoCrearRequestDTO.DetalleRequestDTO::productoId).toList())
                .stream()
                .collect(Collectors.groupingBy(OfertaProductoProjection::productoId));
        for (PedidoCrearRequestDTO.DetalleRequestDTO requestDetalle : requestDetalles) {
            Producto producto = productoRepository.findById(requestDetalle.productoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado."));
            if (producto.getStockDisponible() < requestDetalle.cantidad()) {
                throw new IllegalArgumentException("Stock insuficiente para el producto " + producto.getNombre() + ".");
            }

            Set<Long> saborIds = requestDetalle.saboresIds() == null ? Set.of() : requestDetalle.saboresIds();
            if (saborIds.size() > producto.getMaxSabores()) {
                throw new IllegalArgumentException("Se seleccionaron más sabores de los permitidos.");
            }
            Set<Long> permitidos = producto.getSabores().stream().map(Sabor::getId).collect(Collectors.toSet());
            if (!permitidos.containsAll(saborIds)) {
                throw new IllegalArgumentException("El producto tiene sabores no disponibles.");
            }
            Set<Sabor> sabores = saborRepository.findAllById(saborIds).stream().collect(Collectors.toSet());

            List<OfertaProductoProjection> ofertasProducto = ofertasVigentes.getOrDefault(producto.getId(), List.of());
            if (ofertasProducto.size() > 1) {
                throw new IllegalStateException("Hay más de una oferta vigente para el producto " + producto.getId() + ".");
            }
            OfertaProductoProjection oferta = ofertasProducto.isEmpty() ? null : ofertasProducto.get(0);
            BigDecimal precioUnitario = oferta == null
                    ? producto.getPrecioBase().setScale(2, RoundingMode.HALF_UP)
                    : Oferta.calcularPrecioFinal(producto.getPrecioBase(), oferta.porcentaje());
            BigDecimal subtotalDetalle = precioUnitario
                    .multiply(BigDecimal.valueOf(requestDetalle.cantidad()))
                    .setScale(2, RoundingMode.HALF_UP);
            subtotal = subtotal.add(subtotalDetalle);

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProductoId(producto.getId());
            detalle.setProductoNombre(producto.getNombre());
            detalle.setProductoSku(producto.getSku());
            detalle.setCantidad(requestDetalle.cantidad());
            detalle.setPrecioUnitario(precioUnitario);
            detalle.setSubtotal(subtotalDetalle);
            detalle.setSaboresSnapshot(sabores.stream().map(Sabor::getNombre).sorted().collect(Collectors.joining(", ")));
            detalles.add(detalle);

            producto.setStockDisponible(producto.getStockDisponible() - requestDetalle.cantidad());
            productoRepository.save(producto);
        }

        BigDecimal igv = subtotal.multiply(IGV_RATE)
                .divide(BigDecimal.ONE.add(IGV_RATE), 2, RoundingMode.HALF_UP);
        pedido.setSubtotal(subtotal.setScale(2, RoundingMode.HALF_UP));
        pedido.setIgv(igv);
        pedido.setTotal(pedido.getSubtotal().add(pedido.getCostoEnvio()));
        Pedido saved = pedidoRepository.save(pedido);
        detalles.forEach(detalle -> detalle.setPedido(saved));
        detallePedidoRepository.saveAll(detalles);
        for (DetallePedido detalle : detalles) {
            HistorialStock movimiento = new HistorialStock();
            movimiento.setProductoId(detalle.getProductoId());
            movimiento.setCantidadAlterada(-detalle.getCantidad());
            movimiento.setTipoMovimiento(HistorialStock.TipoMovimiento.VENTA);
            movimiento.setObservacion("Pedido #" + saved.getId());
            movimiento.setNombreProducto(detalle.getProductoNombre());
            movimiento.setSkuProducto(detalle.getProductoSku());
            historialStockRepository.save(movimiento);
        }
        guardarHistorialEstado(saved, saved.getEstadoPedido(), "Pedido creado.");
        return toAdminDto(saved);
    }

    public Optional<PedidoAdminDTO> getPedidoPorId(Long id) {
        return pedidoRepository.findById(id).map(this::toAdminDto);
    }

    public List<PedidoAdminDTO> listarTodos() {
        return pedidoRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toAdminDto).toList();
    }

    public Optional<PedidoAdminDTO> getPedidoPorUuid(String uuid) {
        return pedidoRepository.findByUuid(uuid).map(this::toAdminDto);
    }

    public boolean existePorUuid(String uuid) {
        return pedidoRepository.existsByUuid(uuid);
    }

    public List<PedidoAdminDTO> obtenerPedidosDeCliente(Long clienteId) {
        return pedidoRepository.findAllByClienteId(clienteId).stream().map(this::toAdminDto).toList();
    }

    public void actualizarEstadoPago(Long idPedido, Pedido.EstadoPago nuevoEstado) {
        Pedido pedido = buscarPedido(idPedido);
        Pedido.EstadoPago actual = pedido.getEstadoPago();
        boolean permitido = switch (actual) {
            case PENDIENTE -> nuevoEstado == Pedido.EstadoPago.PAGADO || nuevoEstado == Pedido.EstadoPago.FALLIDO;
            case PAGADO -> nuevoEstado == Pedido.EstadoPago.REEMBOLSADO;
            case FALLIDO, REEMBOLSADO -> false;
        };
        if (!permitido) throw new IllegalArgumentException("Transición de estado de pago no permitida.");
        pedido.setEstadoPago(nuevoEstado);
    }

    public void actualizarEstadoPedido(Long idPedido, HistorialEstadoPedido.EstadoPedido nuevoEstado) {
        Pedido pedido = buscarPedido(idPedido);
        HistorialEstadoPedido.EstadoPedido actual = pedido.getEstadoPedido();
        boolean permitido = switch (actual) {
            case PREPARANDO -> nuevoEstado == HistorialEstadoPedido.EstadoPedido.EN_CAMINO
                    || nuevoEstado == HistorialEstadoPedido.EstadoPedido.CANCELADO;
            case EN_CAMINO -> nuevoEstado == HistorialEstadoPedido.EstadoPedido.ENTREGADO
                    || nuevoEstado == HistorialEstadoPedido.EstadoPedido.CANCELADO;
            case ENTREGADO, CANCELADO -> false;
        };
        if (!permitido) throw new IllegalArgumentException("Transición de estado del pedido no permitida.");
        pedido.setEstadoPedido(nuevoEstado);
        guardarHistorialEstado(pedido, nuevoEstado, "Estado actualizado por administración.");
    }

    public void eliminarPedidoPendiente(Long id) {
        Pedido pedido = buscarPedido(id);
        if (pedido.getEstadoPago() != Pedido.EstadoPago.PENDIENTE
                || pedido.getStripePaymentIntentId() != null
                || pedido.getEstadoPedido() != HistorialEstadoPedido.EstadoPedido.PREPARANDO) {
            throw new IllegalArgumentException("Solo se pueden eliminar pedidos pendientes sin pago iniciado.");
        }
        for (DetallePedido detalle : detallePedidoRepository.findByPedidoId(id)) {
            productoRepository.findById(detalle.getProductoId()).ifPresent(producto -> {
                producto.setStockDisponible(producto.getStockDisponible() + detalle.getCantidad());
                productoRepository.save(producto);
                HistorialStock movimiento = new HistorialStock();
                movimiento.setProductoId(detalle.getProductoId());
                movimiento.setCantidadAlterada(detalle.getCantidad());
                movimiento.setTipoMovimiento(HistorialStock.TipoMovimiento.AJUSTE);
                movimiento.setObservacion("Reverso del pedido #" + id);
                movimiento.setNombreProducto(detalle.getProductoNombre());
                movimiento.setSkuProducto(detalle.getProductoSku());
                historialStockRepository.save(movimiento);
            });
        }
        pedidoRepository.delete(pedido);
    }

    private Pedido buscarPedido(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado."));
    }

    private void guardarHistorialEstado(Pedido pedido, HistorialEstadoPedido.EstadoPedido estado, String observacion) {
        HistorialEstadoPedido historial = new HistorialEstadoPedido();
        historial.setPedido(pedido);
        historial.setEstadoNuevo(estado);
        historial.setObservacion(observacion);
        historialEstadoRepository.save(historial);
    }

    private PedidoAdminDTO toAdminDto(Pedido pedido) {
        List<PedidoDetalleAdminDTO> detalles = detallePedidoRepository.findByPedidoId(pedido.getId()).stream()
                .map(detalle -> new PedidoDetalleAdminDTO(
                        detalle.getProductoId(),
                        detalle.getProductoNombre(),
                        detalle.getCantidad(),
                        detalle.getPrecioUnitario(),
                        detalle.getSubtotal(),
                        detalle.getSaboresSnapshot() == null || detalle.getSaboresSnapshot().isBlank()
                                ? List.of() : List.of(detalle.getSaboresSnapshot().split(", "))))
                .toList();
        return new PedidoAdminDTO(
                pedido.getId(),
                pedido.getUuid(),
                pedido.getClienteId(),
                pedido.getClienteNombre(),
                pedido.getClienteEmail(),
                pedido.getDireccionEntrega(),
                pedido.getSubtotal(),
                pedido.getCostoEnvio(),
                pedido.getIgv(),
                pedido.getTotal(),
                pedido.getEstadoPago().name(),
                pedido.getEstadoPedido().name(),
                detalles,
                pedido.getCreatedAt());
    }

    private String formatearDireccion(Direccion direccion) {
        String detalle = direccion.getLinea2() == null || direccion.getLinea2().isBlank()
                ? direccion.getLinea1()
                : direccion.getLinea1() + ", " + direccion.getLinea2();
        return direccion.getAlias() + ": " + detalle;
    }
}
