package com.dwi.api.catalogo.producto.historial;

import com.dwi.api.administrador.model.Administrador;
import com.dwi.api.administrador.repository.AdministradorRepository;
import com.dwi.api.catalogo.producto.model.Producto;
import com.dwi.api.catalogo.producto.repository.ProductoRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class HistorialStockServiceTest {

    @Test
    void registraMermaYActualizaElStockEnUnaOperacion() {
        HistorialStockRepository historialRepository = mock(HistorialStockRepository.class);
        ProductoRepository productoRepository = mock(ProductoRepository.class);
        AdministradorRepository administradorRepository = mock(AdministradorRepository.class);
        HistorialStockService service = new HistorialStockService(
                historialRepository, productoRepository, administradorRepository);

        Producto producto = new Producto();
        producto.setId(3L);
        producto.setNombre("Fresa");
        producto.setSku("HEL-FRE-02");
        producto.setStockDisponible(8);
        Administrador administrador = new Administrador();
        administrador.setNombres("Ana");
        administrador.setApellidos("Morales");
        when(productoRepository.findById(3L)).thenReturn(Optional.of(producto));
        when(administradorRepository.findByEmail("admin@cremissimo.test")).thenReturn(Optional.of(administrador));
        when(historialRepository.save(any(HistorialStock.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        HistorialStockDTO result = service.crear(
                new HistorialStockRequestDTO(3L, -2, HistorialStock.TipoMovimiento.MERMA, "Producto dañado"),
                "admin@cremissimo.test");

        assertEquals(6, producto.getStockDisponible());
        assertEquals(-2, result.cantidadAlterada());
        verify(productoRepository).save(producto);
        verify(historialRepository).save(any(HistorialStock.class));
    }

    @Test
    void noPermiteCrearManualmenteMovimientosDeVenta() {
        HistorialStockService service = new HistorialStockService(
                mock(HistorialStockRepository.class),
                mock(ProductoRepository.class),
                mock(AdministradorRepository.class));

        assertThrows(IllegalArgumentException.class,
                () -> service.crear(
                        new HistorialStockRequestDTO(3L, -1, HistorialStock.TipoMovimiento.VENTA, "Venta"),
                        "admin@cremissimo.test"));
    }
}
