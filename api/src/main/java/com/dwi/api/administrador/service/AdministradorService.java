package com.dwi.api.administrador.service;

import com.dwi.api.administrador.dto.AdministradorDTO;
import com.dwi.api.administrador.dto.AdministradorRequestDTO;
import com.dwi.api.administrador.model.Administrador;
import com.dwi.api.administrador.repository.AdministradorRepository;
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
public class AdministradorService {
    
    private final AdministradorRepository administradorRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public AdministradorService(
            AdministradorRepository administradorRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        this.administradorRepository = administradorRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    /**
     * Obtiene un administrador por su ID
     */
    public Optional<Administrador> getAdministradorById(Long id) {
        return administradorRepository.findById(id);
    }
    
    /**
     * Obtiene todos los administradores
     */
    public List<AdministradorDTO> getAllAdministradores() {
        return administradorRepository.findAll().stream().map(this::toDto).toList();
    }
    
    /**
     * Crea un nuevo administrador
     */
    public AdministradorDTO crearAdministrador(AdministradorRequestDTO request) {
        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria para crear un administrador.");
        }
        validarEmailUnico(request.email(), null);
        Administrador administrador = new Administrador();
        administrador.setNombres(request.nombres().trim());
        administrador.setApellidos(request.apellidos().trim());
        administrador.setEmail(request.email().trim().toLowerCase());
        administrador.setAvatarUrl(limpiarOpcional(request.avatarUrl()));
        administrador.setPasswordHash(passwordEncoder.encode(request.password()));
        administrador.setRolSistema(Usuario.RolSistema.ADMIN);
        administrador.setNivelAcceso(request.nivelAcceso());
        return toDto(administradorRepository.save(administrador));
    }
    
    /**
     * Actualiza un administrador existente
     */
    public AdministradorDTO actualizarAdministrador(Long id, AdministradorRequestDTO request) {
        return administradorRepository.findById(id)
                .map(admin -> {
                    validarEmailUnico(request.email(), id);
                    admin.setNombres(request.nombres().trim());
                    admin.setApellidos(request.apellidos().trim());
                    admin.setEmail(request.email().trim().toLowerCase());
                    if (request.avatarUrl() != null) {
                        admin.setAvatarUrl(limpiarOpcional(request.avatarUrl()));
                    }
                    admin.setNivelAcceso(request.nivelAcceso());
                    if (request.password() != null && !request.password().isBlank()) {
                        admin.setPasswordHash(passwordEncoder.encode(request.password()));
                    }
                    return toDto(administradorRepository.save(admin));
                })
                .orElseThrow(() -> new IllegalArgumentException("Administrador no encontrado."));
    }
    
    /**
     * Elimina un administrador por su ID
     */
    public void eliminarAdministrador(Long id) {
        Administrador admin = administradorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Administrador no encontrado."));
        if (admin.getNivelAcceso() == Administrador.NivelAcceso.SUPERADMIN
                && administradorRepository.countByNivelAcceso(Administrador.NivelAcceso.SUPERADMIN) <= 1) {
            throw new IllegalStateException("No se puede eliminar al último administrador SUPERADMIN.");
        }
        administradorRepository.delete(admin);
    }
    
    /**
     * Obtiene administradores por nivel de acceso
     */
    public List<Administrador> getAdministradoresPorNivel(Administrador.NivelAcceso nivelAcceso) {
        return administradorRepository.findByNivelAcceso(nivelAcceso);
    }
    
    /**
     * Verifica si existe un administrador con el nivel de acceso especificado
     */
    public boolean existsByNivelAcceso(Administrador.NivelAcceso nivelAcceso) {
        return administradorRepository.existsByNivelAcceso(nivelAcceso);
    }
    
    /**
     * Actualiza la fecha del último acceso de un administrador
     */
    private AdministradorDTO toDto(Administrador admin) {
        return new AdministradorDTO(
                admin.getId(), admin.getUuid(), admin.getNombres(), admin.getApellidos(),
                admin.getEmail(), admin.getAvatarUrl(), admin.getNivelAcceso().name(), admin.getUltimoAcceso());
    }

    private String limpiarOpcional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private void validarEmailUnico(String email, Long idActual) {
        usuarioRepository.findByEmail(email.trim()).ifPresent(existing -> {
            if (!existing.getId().equals(idActual)) {
                throw new IllegalArgumentException("Ya existe una cuenta con ese email.");
            }
        });
    }
}