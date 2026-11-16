package com.dwi.api.cliente.service;

import com.dwi.api.cliente.dto.ClienteRegistroDTO;
import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.cliente.repository.ClienteRepository;
import com.dwi.api.usuario.model.Usuario;
import com.dwi.api.usuario.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ClienteService {
    
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public ClienteService(
            ClienteRepository clienteRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Cliente registrarCliente(ClienteRegistroDTO request) {
        if (usuarioRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una cuenta con ese email.");
        }
        if (request.dni() != null && !request.dni().isBlank()
                && clienteRepository.findByDni(request.dni()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un cliente con ese DNI.");
        }

        Cliente cliente = new Cliente();
        cliente.setNombres(request.nombres());
        cliente.setApellidos(request.apellidos());
        cliente.setEmail(request.email());
        cliente.setPasswordHash(passwordEncoder.encode(request.password()));
        cliente.setRolSistema(Usuario.RolSistema.CLIENTE);
        cliente.setDni(request.dni());
        cliente.setTelefono(request.telefono());
        return clienteRepository.save(cliente);
    }
    
    /**
     * Obtiene un cliente por su ID
     */
    public Optional<Cliente> getClienteById(Long id) {
        return clienteRepository.findById(id);
    }
    
    /**
     * Obtiene un cliente por su DNI
     */
    public Optional<Cliente> getClientePorDni(String dni) {
        return clienteRepository.findByDni(dni);
    }
    
    /**
     * Obtiene todos los clientes no eliminados (herencia de Usuario)
     */
    public List<Cliente> getAllClientes() {
        return clienteRepository.findAll();
    }
    
    /**
     * Crea un nuevo cliente
     */
    public Cliente crearCliente(Cliente cliente) {
        // No guardar directamente para evitar duplicados de DNI/Email
        if (cliente.getDni() != null && !cliente.getDni().isEmpty()) {
            if (clienteRepository.findByDni(cliente.getDni()).isPresent()) {
                throw new RuntimeException("Ya existe un cliente con el DNI: " + cliente.getDni());
            }
        }
        
        Cliente entidadCreada = clienteRepository.save(cliente);
        // No actualizar los campos de usuario para mantener la integridad
        return entidadCreada;
    }
    
    /**
     * Actualiza un cliente existente por su ID
     */
    public Cliente actualizarCliente(Long id, Cliente datosActualizacion) {
        return clienteRepository.findById(id)
                .map(cliente -> {
                    // Solo actualizar campos específicos del Cliente
                    if (datosActualizacion.getDni() != null && !datosActualizacion.getDni().isEmpty()) {
                        if (!clienteRepository.findByDni(datosActualizacion.getDni()).isPresent()) {
                            cliente.setDni(datosActualizacion.getDni());
                        } else {
                            throw new RuntimeException("Ya existe un cliente con el DNI: " + datosActualizacion.getDni());
                        }
                    }
                    
                    if (datosActualizacion.getTelefono() != null) {
                        cliente.setTelefono(datosActualizacion.getTelefono());
                    }
                    
                    if (datosActualizacion.getStripeCustomerId() != null) {
                        cliente.setStripeCustomerId(datosActualizacion.getStripeCustomerId());
                    }
                    
                    Cliente entidadActualizada = clienteRepository.save(cliente);
                    return entidadActualizada;
                })
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + id));
    }
    
    /**
     * Elimina un cliente por su ID (soft delete)
     */
    public void eliminarCliente(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new RuntimeException("Cliente no encontrado con ID: " + id);
        }
        clienteRepository.deleteById(id);
    }
    
    /**
     * Verifica si existe un cliente por DNI
     */
    public boolean existePorDni(String dni) {
        return clienteRepository.findByDni(dni).isPresent();
    }
}
