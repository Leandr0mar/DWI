package com.dwi.api.usuario.service;

import com.dwi.api.usuario.model.Usuario;
import com.dwi.api.usuario.repository.UsuarioRepository;
import com.dwi.api.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    
    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    
    /**
     * Obtiene un usuario por su UUID
     */
    public Optional<Usuario> getUsuarioPorUuid(String uuid) {
        return usuarioRepository.findByUuid(uuid);
    }
    
    /**
     * Obtiene un usuario por su email
     */
    public Optional<Usuario> getUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
    
    /**
     * Obtiene todos los usuarios no eliminados
     */
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }
    
    /**
     * Crea un nuevo usuario
     */
    public Usuario crearUsuario(Usuario usuario) {
        Usuario entidadCreada = usuarioRepository.save(usuario);
        // No se actualiza el UUID o email para mantener la unicidad
        return entidadCreada;
    }
    
    /**
     * Actualiza un usuario existente por su ID
     */
    public Usuario actualizarUsuario(Long id, Usuario datosActualizacion) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    // Sincronizar campos de la entidad con los datos actualizados
                    String uuidActual = usuario.getUuid();
                    String emailActual = usuario.getEmail();
                    
                    // Solo actualizar campos que no sean UUID o Email (para mantener unicidad)
                    if (datosActualizacion.getNombres() != null && 
                        !usuarioRepository.existsById(id)) {
                        usuario.setNombres(datosActualizacion.getNombres());
                    }
                    if (datosActualizacion.getApellidos() != null) {
                        usuario.setApellidos(datosActualizacion.getApellidos());
                    }
                    if (datosActualizacion.getPasswordHash() != null) {
                        usuario.setPasswordHash(datosActualizacion.getPasswordHash());
                    }
                    if (datosActualizacion.getRolSistema() != null) {
                        usuario.setRolSistema(datosActualizacion.getRolSistema());
                    }
                    if (datosActualizacion.getAvatarUrl() != null) {
                        usuario.setAvatarUrl(datosActualizacion.getAvatarUrl());
                    }
                    
                    Usuario entidadActualizada = usuarioRepository.save(usuario);
                    return entidadActualizada;
                })
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }
    
    /**
     * Elimina un usuario (lógicamente mediante soft delete)
     */
    public void eliminarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        usuarioRepository.delete(usuario);
    }
    
    /**
     * Verifica si existe un usuario por email
     */
    public boolean existePorEmail(String email) {
        return usuarioRepository.findByEmail(email).isPresent();
    }
    
    /**
     * Verifica si existe un usuario por UUID
     */
    public boolean existePorUuid(String uuid) {
        return usuarioRepository.findByUuid(uuid).isPresent();
    }
}
