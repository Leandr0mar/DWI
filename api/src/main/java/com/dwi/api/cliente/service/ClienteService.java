package com.dwi.api.cliente.service;

import com.dwi.api.cliente.dto.ClienteRegistroDTO;
import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.cliente.repository.ClienteRepository;
import com.dwi.api.usuario.model.Usuario.RolSistema;
import com.dwi.api.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder; // Inyectado desde SecurityConfig

    @Transactional
    public Cliente registrarCliente(ClienteRegistroDTO dto) {
        
        // 1. Validar que el correo no exista en toda la tabla Usuario (ni clientes ni admins)
        if (usuarioRepository.findByEmail(dto.email()).isPresent()) {
            // Más adelante cambiaremos esto por una Excepción Personalizada global
            throw new IllegalArgumentException("El correo ya se encuentra registrado.");
        }

        // 2. Validar DNI único
        if (dto.dni() != null && clienteRepository.findByDni(dto.dni()).isPresent()) {
            throw new IllegalArgumentException("El DNI ya se encuentra registrado.");
        }

        // 3. Mapear DTO a Entidad
        Cliente nuevoCliente = new Cliente();
        nuevoCliente.setNombres(dto.nombres());
        nuevoCliente.setApellidos(dto.apellidos());
        nuevoCliente.setEmail(dto.email());
        
        // 4. Seguridad: Nunca guardar la contraseña en texto plano
        nuevoCliente.setPasswordHash(passwordEncoder.encode(dto.password()));
        
        nuevoCliente.setDni(dto.dni());
        nuevoCliente.setTelefono(dto.telefono());
        nuevoCliente.setRolSistema(RolSistema.CLIENTE);

        // 5. Guardar en Base de Datos
        return clienteRepository.save(nuevoCliente);
    }
}