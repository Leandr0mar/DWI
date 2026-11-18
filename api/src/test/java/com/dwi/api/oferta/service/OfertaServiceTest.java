package com.dwi.api.oferta.service;

import com.dwi.api.catalogo.producto.model.Producto;
import com.dwi.api.catalogo.producto.repository.ProductoRepository;
import com.dwi.api.oferta.dto.OfertaRequestDTO;
import com.dwi.api.oferta.model.Oferta;
import com.dwi.api.oferta.repository.OfertaRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OfertaServiceTest {

    @Test
    void calculaPrecioPromocionalConDosDecimales() {
        assertEquals(new BigDecimal("42.49"),
                Oferta.calcularPrecioFinal(new BigDecimal("49.99"), new BigDecimal("15")));
    }

    @Test
    void rechazaCrearOfertaCuandoElProductoYaTieneUnPeriodoSuperpuesto() {
        OfertaRepository ofertaRepository = mock(OfertaRepository.class);
        ProductoRepository productoRepository = mock(ProductoRepository.class);
        Producto producto = new Producto();
        producto.setId(7L);
        when(productoRepository.findAllById(Set.of(7L))).thenReturn(List.of(producto));
        when(ofertaRepository.findOverlappingOfferIds(
                List.of(7L), LocalDate.parse("2026-07-01"), LocalDate.parse("2026-07-10"), null))
                .thenReturn(List.of(3L));

        OfertaService service = new OfertaService(ofertaRepository, productoRepository);
        OfertaRequestDTO request = new OfertaRequestDTO(
                "Oferta de verano",
                new BigDecimal("15"),
                LocalDate.parse("2026-07-01"),
                LocalDate.parse("2026-07-10"),
                Set.of(7L));

        assertThrows(IllegalArgumentException.class, () -> service.crear(request));
        verify(ofertaRepository, never()).save(org.mockito.ArgumentMatchers.any(Oferta.class));
    }
}
