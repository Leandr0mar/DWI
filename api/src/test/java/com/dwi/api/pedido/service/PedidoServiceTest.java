package com.dwi.api.pedido.service;

import com.dwi.api.catalogo.producto.historial.HistorialStockRepository;
import com.dwi.api.catalogo.producto.model.Producto;
import com.dwi.api.catalogo.producto.repository.ProductoRepository;
import com.dwi.api.catalogo.sabor.repository.SaborRepository;
import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.cliente.repository.ClienteRepository;
import com.dwi.api.direccion.model.Direccion;
import com.dwi.api.direccion.repository.DireccionRepository;
import com.dwi.api.oferta.dto.OfertaProductoProjection;
import com.dwi.api.pedido.model.Pedido;
import com.dwi.api.pedido.model.DetallePedido;
import com.dwi.api.pedido.dto.PedidoCrearRequestDTO;
import com.dwi.api.pedido.repository.DetallePedidoRepository;
import com.dwi.api.pedido.repository.HistorialEstadoPedidoRepository;
import com.dwi.api.pedido.repository.PedidoRepository;
import com.dwi.api.oferta.service.OfertaService;
import com.dwi.api.zona.model.ZonaReparto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PedidoServiceTest {

    private PedidoRepository pedidoRepository;
    private ClienteRepository clienteRepository;
    private DireccionRepository direccionRepository;
    private ProductoRepository productoRepository;
    private DetallePedidoRepository detallePedidoRepository;
    private OfertaService ofertaService;
    private PedidoService pedidoService;

    @BeforeEach
    void setUp() {
        pedidoRepository = mock(PedidoRepository.class);
        clienteRepository = mock(ClienteRepository.class);
        direccionRepository = mock(DireccionRepository.class);
        productoRepository = mock(ProductoRepository.class);
        detallePedidoRepository = mock(DetallePedidoRepository.class);
        ofertaService = mock(OfertaService.class);
        pedidoService = new PedidoService(
                pedidoRepository,
                clienteRepository,
                direccionRepository,
                productoRepository,
                mock(SaborRepository.class),
                detallePedidoRepository,
                mock(HistorialEstadoPedidoRepository.class),
                mock(HistorialStockRepository.class),
                ofertaService);
    }

    @Test
    void permiteConfirmarPagoPendiente() {
        Pedido pedido = new Pedido();
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        pedidoService.actualizarEstadoPago(1L, Pedido.EstadoPago.PAGADO);

        assertEquals(Pedido.EstadoPago.PAGADO, pedido.getEstadoPago());
    }

    @Test
    void rechazaReembolsarUnPedidoPendiente() {
        Pedido pedido = new Pedido();
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        assertThrows(IllegalArgumentException.class,
                () -> pedidoService.actualizarEstadoPago(1L, Pedido.EstadoPago.REEMBOLSADO));
        assertEquals(Pedido.EstadoPago.PENDIENTE, pedido.getEstadoPago());
    }

    @Test
    void aplicaElPrecioDeLaOfertaVigenteAlCrearUnPedido() {
        Cliente cliente = new Cliente();
        cliente.setId(2L);
        cliente.setNombres("Ana");
        cliente.setApellidos("García");
        cliente.setEmail("ana@example.test");

        ZonaReparto zona = new ZonaReparto();
        zona.setCostoEnvio(new BigDecimal("5.00"));
        Direccion direccion = new Direccion();
        direccion.setCliente(cliente);
        direccion.setZona(zona);
        direccion.setAlias("Casa");
        direccion.setLinea1("Av. Principal 123");

        Producto producto = new Producto();
        producto.setId(7L);
        producto.setNombre("Helado");
        producto.setSku("HEL-001");
        producto.setPrecioBase(new BigDecimal("49.99"));
        producto.setStockDisponible(5);
        producto.setMaxSabores(1);
        when(clienteRepository.findById(2L)).thenReturn(Optional.of(cliente));
        when(direccionRepository.findById(3L)).thenReturn(Optional.of(direccion));
        when(productoRepository.findById(7L)).thenReturn(Optional.of(producto));
        when(ofertaService.listarVigentes(List.of(7L))).thenReturn(List.of(new OfertaProductoProjection(
                7L, 4L, "Oferta de verano", new BigDecimal("15"),
                LocalDate.parse("2026-07-01"), LocalDate.parse("2026-07-10"))));

        List<DetallePedido> detallesGuardados = new ArrayList<>();
        doAnswer(invocation -> {
            List<DetallePedido> detalles = invocation.getArgument(0);
            detallesGuardados.addAll(detalles);
            return detalles;
        }).when(detallePedidoRepository).saveAll(any());
        when(detallePedidoRepository.findByPedidoId(anyLong())).thenAnswer(invocation -> detallesGuardados);
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocation -> {
            Pedido pedido = invocation.getArgument(0);
            pedido.setId(10L);
            return pedido;
        });

        PedidoCrearRequestDTO request = new PedidoCrearRequestDTO(
                2L,
                3L,
                Set.of(new PedidoCrearRequestDTO.DetalleRequestDTO(7L, 2, Set.of())));

        pedidoService.crearPedido(request);

        assertEquals(new BigDecimal("42.49"), detallesGuardados.get(0).getPrecioUnitario());
        assertEquals(new BigDecimal("84.98"), detallesGuardados.get(0).getSubtotal());
    }
}
