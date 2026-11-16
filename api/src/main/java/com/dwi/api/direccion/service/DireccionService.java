package com.dwi.api.direccion.service;

import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.cliente.repository.ClienteRepository;
import com.dwi.api.common.exception.ResourceNotFoundException;
import com.dwi.api.direccion.model.Direccion;
import com.dwi.api.direccion.repository.DireccionRepository;
import com.dwi.api.zona.model.ZonaReparto;
import com.dwi.api.zona.repository.ZonaRepartoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional
public class DireccionService {
    
    private final DireccionRepository direccionRepository;
    private final ClienteRepository clienteRepository;
    private final ZonaRepartoRepository zonaRepartoRepository;
    
    @Autowired
    public DireccionService(
            DireccionRepository direccionRepository,
            ClienteRepository clienteRepository,
            ZonaRepartoRepository zonaRepartoRepository) {
        this.direccionRepository = direccionRepository;
        this.clienteRepository = clienteRepository;
        this.zonaRepartoRepository = zonaRepartoRepository;
    }

    public List<Direccion> listarTodas() {
        return direccionRepository.findAll();
    }
    
    /**
     * Obtiene una dirección por su ID
     */
    public Optional<Direccion> getDireccionById(Long id) {
        return direccionRepository.findById(id);
    }
    
    /**
     * Obtiene todas las direcciones de un cliente
     */
    public List<Direccion> obtenerDireccionesDeCliente(Long clienteId) {
        return direccionRepository.findByCliente(obtenerCliente(clienteId));
    }
    
    /**
     * Obtiene todas las direcciones de un cliente en una zona específica
     */
    public List<Direccion> obtenerDireccionesEnZona(Long clienteId, Long zonaId) {
        return direccionRepository.findByClienteAndZona(obtenerCliente(clienteId), obtenerZona(zonaId));
    }
    
    /**
     * Crea una nueva dirección
     */
    public Direccion crearDireccion(Long clienteId, Direccion direccion) {
        Cliente cliente = obtenerCliente(clienteId);
        direccion.setCliente(cliente);
        if (direccion.isEsPrincipal()) {
            desmarcarOtrasDireccionesPrincipales(cliente, null);
        }
        
        return direccionRepository.save(direccion);
    }
    
    /**
     * Actualiza una dirección existente por su ID
     */
    public Direccion actualizarDireccion(Long id, Direccion datosActualizacion) {
        return direccionRepository.findById(id)
                .map(direccion -> {
                    // Sincronizar campos de la entidad con los datos actualizados
                    if (datosActualizacion.getAlias() != null) {
                        direccion.setAlias(datosActualizacion.getAlias());
                    }
                    
                    if (datosActualizacion.getLinea1() != null) {
                        direccion.setLinea1(datosActualizacion.getLinea1());
                    }
                    
                    if (datosActualizacion.getLinea2() != null) {
                        direccion.setLinea2(datosActualizacion.getLinea2());
                    }
                    
                    if (datosActualizacion.getReferencia() != null) {
                        direccion.setReferencia(datosActualizacion.getReferencia());
                    }
                    
                    if (datosActualizacion.getZona() != null) {
                        if (datosActualizacion.getZona().getId() == null) {
                            throw new IllegalArgumentException("La zona debe incluir su ID.");
                        }
                        direccion.setZona(obtenerZona(datosActualizacion.getZona().getId()));
                    }

                    direccion.setEsPrincipal(datosActualizacion.isEsPrincipal());
                    if (direccion.isEsPrincipal()) {
                        desmarcarOtrasDireccionesPrincipales(
                                direccion.getCliente(),
                                direccion.getId());
                    }
                    
                    Direccion entidadActualizada = direccionRepository.save(direccion);
                    return entidadActualizada;
                })
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada con ID: " + id));
    }
    
    /**
     * Elimina una dirección por su ID
     */
    public void eliminarDireccion(Long id) {
        if (!direccionRepository.existsById(id)) {
            throw new RuntimeException("Dirección no encontrada con ID: " + id);
        }
        direccionRepository.deleteById(id);
    }
    
    /**
     * Obtiene la dirección principal de un cliente (si existe)
     */
    public Optional<Direccion> obtenerDireccionPrincipal(Long clienteId) {
        return direccionRepository.findByClienteAndEsPrincipalTrue(obtenerCliente(clienteId));
    }
    
    /**
     * Verifica si un cliente tiene al menos una dirección
     */
    public boolean tieneDirecciones(Long clienteId) {
        return direccionRepository.existsByCliente(obtenerCliente(clienteId));
    }

    private Cliente obtenerCliente(Long clienteId) {
        return clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado: " + clienteId));
    }

    private ZonaReparto obtenerZona(Long zonaId) {
        return zonaRepartoRepository.findById(zonaId)
                .orElseThrow(() -> new ResourceNotFoundException("Zona no encontrada: " + zonaId));
    }

    private void desmarcarOtrasDireccionesPrincipales(Cliente cliente, Long direccionExcluidaId) {
        List<Direccion> direccionesPrincipales = direccionRepository.findByCliente(cliente).stream()
                .filter(Direccion::isEsPrincipal)
                .filter(direccion -> !Objects.equals(direccion.getId(), direccionExcluidaId))
                .toList();
        direccionesPrincipales.forEach(direccion -> direccion.setEsPrincipal(false));
        direccionRepository.saveAll(direccionesPrincipales);
    }
}