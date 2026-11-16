package com.dwi.api.administrador.service;

import com.dwi.api.administrador.model.Administrador;
import com.dwi.api.administrador.repository.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AdministradorService {
    
    private final AdministradorRepository administradorRepository;
    
    @Autowired
    public AdministradorService(AdministradorRepository administradorRepository) {
        this.administradorRepository = administradorRepository;
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
    public List<Administrador> getAllAdministradores() {
        return administradorRepository.findAll();
    }
    
    /**
     * Crea un nuevo administrador
     */
    public Administrador crearAdministrador(Administrador administrador) {
        Administrador entidadCreada = administradorRepository.save(administrador);
        actualizarUltimoAcceso(entidadCreada);
        return entidadCreada;
    }
    
    /**
     * Actualiza un administrador existente
     */
    public Administrador actualizarAdministrador(Long id, Administrador datosActualizacion) {
        return administradorRepository.findById(id)
                .map(admin -> {
                    admin.setNivelAcceso(datosActualizacion.getNivelAcceso());
                    admin.setUltimoAcceso(LocalDateTime.now());
                    actualizarDatosComunes(datosActualizacion);
                    
                    Administrador entidadActualizada = administradorRepository.save(admin);
                    actualizarUltimoAcceso(entidadActualizada);
                    return entidadActualizada;
                })
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado con ID: " + id));
    }
    
    /**
     * Elimina un administrador por su ID
     */
    public void eliminarAdministrador(Long id) {
        if (!administradorRepository.existsById(id)) {
            throw new RuntimeException("Administrador no encontrado con ID: " + id);
        }
        administradorRepository.deleteById(id);
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
    private void actualizarUltimoAcceso(Administrador administrador) {
        if (administrador.getUltimoAcceso() == null) {
            administrador.setUltimoAcceso(LocalDateTime.now());
        }
    }
    
    /**
     * Actualiza los datos comunes de Usuario (herencia)
     */
    private void actualizarDatosComunes(Administrador administrador) {
        // Los campos de Usuario se actualizan aquí si fuera necesario
        // Ejemplo: admin.setUsuario(datosActualizacion.getUsuario());
    }
}