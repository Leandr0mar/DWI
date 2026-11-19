package com.dwi.api.direccion.service;

import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.cliente.repository.ClienteRepository;
import com.dwi.api.common.exception.ResourceNotFoundException;
import com.dwi.api.direccion.model.Direccion;
import com.dwi.api.direccion.repository.DireccionRepository;
import com.dwi.api.zona.repository.ZonaRepartoRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DireccionServiceTest {

    @Test
    void noPermiteActualizarLaDireccionDeOtroCliente() {
        Cliente titular = new Cliente();
        titular.setId(8L);
        Cliente usuarioAutenticado = new Cliente();
        usuarioAutenticado.setId(12L);
        Direccion direccion = new Direccion();
        direccion.setCliente(titular);

        ClienteRepository clienteRepository = mock(ClienteRepository.class);
        DireccionRepository direccionRepository = mock(DireccionRepository.class);
        when(clienteRepository.findByEmail("cliente@example.test")).thenReturn(Optional.of(usuarioAutenticado));
        when(direccionRepository.findById(3L)).thenReturn(Optional.of(direccion));
        DireccionService service = new DireccionService(
                direccionRepository,
                clienteRepository,
                mock(ZonaRepartoRepository.class));

        assertThrows(ResourceNotFoundException.class, () -> service.actualizarParaUsuario(
                "cliente@example.test", 3L, null));
        verify(direccionRepository, never()).save(direccion);
    }

    @Test
    void noPermiteEliminarLaDireccionDeOtroCliente() {
        Cliente titular = new Cliente();
        titular.setId(8L);
        Cliente usuarioAutenticado = new Cliente();
        usuarioAutenticado.setId(12L);
        Direccion direccion = new Direccion();
        direccion.setCliente(titular);

        ClienteRepository clienteRepository = mock(ClienteRepository.class);
        DireccionRepository direccionRepository = mock(DireccionRepository.class);
        when(clienteRepository.findByEmail("cliente@example.test")).thenReturn(Optional.of(usuarioAutenticado));
        when(direccionRepository.findById(3L)).thenReturn(Optional.of(direccion));
        DireccionService service = new DireccionService(
                direccionRepository,
                clienteRepository,
                mock(ZonaRepartoRepository.class));

        assertThrows(ResourceNotFoundException.class,
                () -> service.eliminarParaUsuario("cliente@example.test", 3L));
        verify(direccionRepository, never()).delete(direccion);
    }
}
