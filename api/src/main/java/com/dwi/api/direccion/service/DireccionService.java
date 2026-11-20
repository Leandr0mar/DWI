package com.dwi.api.direccion.service;

import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.cliente.repository.ClienteRepository;
import com.dwi.api.common.exception.ResourceNotFoundException;
import com.dwi.api.direccion.dto.DireccionAdminDTO;
import com.dwi.api.direccion.dto.DireccionAdminRequestDTO;
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

    public List<DireccionAdminDTO> listarParaAdministracion() {
        return direccionRepository.listarParaAdministracion().stream().map(this::toAdminDto).toList();
    }

    public Optional<DireccionAdminDTO> getParaAdministracion(Long id) {
        return direccionRepository.buscarParaAdministracion(id).map(this::toAdminDto);
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

    public DireccionAdminDTO crearParaAdministracion(Long clienteId, DireccionAdminRequestDTO request) {
        Direccion direccion = new Direccion();
        direccion.setZona(obtenerZona(request.zonaId()));
        direccion.setAlias(request.alias().trim());
        direccion.setLinea1(request.linea1().trim());
        direccion.setLinea2(request.linea2());
        direccion.setReferencia(request.referencia());
        direccion.setEsPrincipal(request.esPrincipal());
        return toAdminDto(crearDireccion(clienteId, direccion));
    }

    public List<DireccionAdminDTO> obtenerParaCliente(Long clienteId) {
        return obtenerDireccionesDeCliente(clienteId).stream().map(this::toAdminDto).toList();
    }

    public List<DireccionAdminDTO> obtenerDireccionesDelUsuario(String email) {
        return obtenerDireccionesDeCliente(obtenerClientePorEmail(email).getId()).stream()
                .map(this::toAdminDto)
                .toList();
    }

    public DireccionAdminDTO crearParaUsuario(String email, DireccionAdminRequestDTO request) {
        Cliente cliente = obtenerClientePorEmail(email);
        Direccion direccion = new Direccion();
        direccion.setZona(obtenerZonaActiva(request.zonaId()));
        direccion.setAlias(request.alias().trim());
        direccion.setLinea1(request.linea1().trim());
        direccion.setLinea2(request.linea2());
        direccion.setReferencia(request.referencia());
        direccion.setEsPrincipal(request.esPrincipal() || !direccionRepository.existsByCliente(cliente));
        if (direccion.isEsPrincipal()) {
            desmarcarOtrasDireccionesPrincipales(cliente, null);
        }
        direccion.setCliente(cliente);
        return toAdminDto(direccionRepository.save(direccion));
    }

    public DireccionAdminDTO actualizarParaUsuario(
            String email,
            Long id,
            DireccionAdminRequestDTO request) {
        Cliente cliente = obtenerClientePorEmail(email);
        Direccion direccion = direccionRepository.findById(id)
                .filter(actual -> actual.getCliente().getId().equals(cliente.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada."));
        direccion.setZona(obtenerZonaActiva(request.zonaId()));
        direccion.setAlias(request.alias().trim());
        direccion.setLinea1(request.linea1().trim());
        direccion.setLinea2(request.linea2());
        direccion.setReferencia(request.referencia());
        direccion.setEsPrincipal(request.esPrincipal());
        if (direccion.isEsPrincipal()) {
            desmarcarOtrasDireccionesPrincipales(cliente, direccion.getId());
        }
        return toAdminDto(direccionRepository.save(direccion));
    }

    public void eliminarParaUsuario(String email, Long id) {
        Cliente cliente = obtenerClientePorEmail(email);
        Direccion direccion = direccionRepository.findById(id)
                .filter(actual -> actual.getCliente().getId().equals(cliente.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada."));
        boolean eraPrincipal = direccion.isEsPrincipal();
        direccionRepository.delete(direccion);
        if (eraPrincipal) {
            direccionRepository.findByCliente(cliente).stream()
                    .findFirst()
                    .ifPresent(siguiente -> {
                        siguiente.setEsPrincipal(true);
                        direccionRepository.save(siguiente);
                    });
        }
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

    public DireccionAdminDTO actualizarParaAdministracion(Long id, DireccionAdminRequestDTO request) {
        Direccion direccion = direccionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada."));
        direccion.setZona(obtenerZona(request.zonaId()));
        direccion.setAlias(request.alias().trim());
        direccion.setLinea1(request.linea1().trim());
        direccion.setLinea2(request.linea2());
        direccion.setReferencia(request.referencia());
        direccion.setEsPrincipal(request.esPrincipal());
        if (direccion.isEsPrincipal()) {
            desmarcarOtrasDireccionesPrincipales(direccion.getCliente(), direccion.getId());
        }
        return toAdminDto(direccionRepository.save(direccion));
    }
    
    /**
     * Elimina una dirección por su ID
     */
    public void eliminarDireccion(Long id) {
        Direccion direccion = direccionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada."));
        Cliente cliente = direccion.getCliente();
        boolean eraPrincipal = direccion.isEsPrincipal();
        direccionRepository.delete(direccion);
        if (eraPrincipal) {
            direccionRepository.findByCliente(cliente).stream()
                    .findFirst()
                    .ifPresent(siguiente -> {
                        siguiente.setEsPrincipal(true);
                        direccionRepository.save(siguiente);
                    });
        }
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

    private Cliente obtenerClientePorEmail(String email) {
        return clienteRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado."));
    }

    private ZonaReparto obtenerZona(Long zonaId) {
        return zonaRepartoRepository.findById(zonaId)
                .orElseThrow(() -> new ResourceNotFoundException("Zona no encontrada: " + zonaId));
    }

    private ZonaReparto obtenerZonaActiva(Long zonaId) {
        ZonaReparto zona = obtenerZona(zonaId);
        if (!zona.isEstado()) {
            throw new IllegalArgumentException("La zona de reparto no está disponible.");
        }
        return zona;
    }

    private void desmarcarOtrasDireccionesPrincipales(Cliente cliente, Long direccionExcluidaId) {
        List<Direccion> direccionesPrincipales = direccionRepository.findByCliente(cliente).stream()
                .filter(Direccion::isEsPrincipal)
                .filter(direccion -> !Objects.equals(direccion.getId(), direccionExcluidaId))
                .toList();
        direccionesPrincipales.forEach(direccion -> direccion.setEsPrincipal(false));
        direccionRepository.saveAll(direccionesPrincipales);
    }

    private DireccionAdminDTO toAdminDto(Direccion direccion) {
        return new DireccionAdminDTO(
                direccion.getId(),
                direccion.getCliente().getId(),
                direccion.getCliente().getNombres() + " " + direccion.getCliente().getApellidos(),
                direccion.getZona().getId(),
                direccion.getZona().getNombreDistrito(),
                direccion.getAlias(),
                direccion.getLinea1(),
                direccion.getLinea2(),
                direccion.getReferencia(),
                direccion.isEsPrincipal());
    }

    private DireccionAdminDTO toAdminDto(DireccionRepository.DireccionAdminProjection direccion) {
        return new DireccionAdminDTO(
                direccion.getId(),
                direccion.getClienteId(),
                direccion.getClienteNombre(),
                direccion.getZonaId(),
                direccion.getZona(),
                direccion.getAlias(),
                direccion.getLinea1(),
                direccion.getLinea2(),
                direccion.getReferencia(),
                direccion.getEsPrincipal());
    }
}
