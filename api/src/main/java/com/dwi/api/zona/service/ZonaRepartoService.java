package com.dwi.api.zona.service;

import com.dwi.api.zona.model.ZonaReparto;
import com.dwi.api.zona.repository.ZonaRepartoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ZonaRepartoService {
    
    private final ZonaRepartoRepository zonaRepartoRepository;
    
    public ZonaRepartoService(ZonaRepartoRepository zonaRepartoRepository) {
        this.zonaRepartoRepository = zonaRepartoRepository;
    }
    
    /**
     * Obtiene una zona por su ID
     */
    public Optional<ZonaReparto> getZonaPorId(Long id) {
        return zonaRepartoRepository.findById(id);
    }
    
    /**
     * Obtiene todas las zonas activas
     */
    public List<ZonaReparto> obtenerTodasActivas() {
        return zonaRepartoRepository.findByEstadoTrue();
    }

    public List<ZonaReparto> obtenerPorEstado(boolean estado) {
        return zonaRepartoRepository.findByEstado(estado);
    }
    
    /**
     * Crea una nueva zona de reparto
     */
    @Transactional
    public ZonaReparto crearZona(ZonaReparto zona) {
        // Verificar unicidad del nombreDistrito
        if (zona.getNombreDistrito() != null && 
            zonaRepartoRepository.existsByNombreDistrito(zona.getNombreDistrito())) {
            throw new IllegalStateException("Ya existe una zona con el nombre: " + zona.getNombreDistrito());
        }
        
        ZonaReparto entidadCreada = zonaRepartoRepository.save(zona);
        return entidadCreada;
    }
    
    /**
     * Actualiza una zona existente por su ID
     */
    public ZonaReparto actualizarZona(Long id, ZonaReparto datosActualizacion) {
        return zonaRepartoRepository.findById(id)
                .map(zona -> {
                    // Sincronizar campos de la entidad con los datos actualizados
                    if (datosActualizacion.getNombreDistrito() != null) {
                        String nombreNuevo = datosActualizacion.getNombreDistrito();
                        // Verificar unicidad si el nombre está cambiando
                        if (!nombreNuevo.equalsIgnoreCase(zona.getNombreDistrito())) {
                            if (zonaRepartoRepository.existsByNombreDistrito(nombreNuevo)) {
                                throw new IllegalStateException("Ya existe una zona con el nombre: " + nombreNuevo);
                            }
                        }
                        zona.setNombreDistrito(nombreNuevo);
                    }
                    
                    if (datosActualizacion.getCostoEnvio() != null) {
                        zona.setCostoEnvio(datosActualizacion.getCostoEnvio());
                    }
                    
                    if (datosActualizacion.getTiempoEstimadoMinutos() != null) {
                        zona.setTiempoEstimadoMinutos(datosActualizacion.getTiempoEstimadoMinutos());
                    }
                    
                    zona.setEstado(datosActualizacion.isEstado());
                    
                    ZonaReparto entidadActualizada = zonaRepartoRepository.save(zona);
                    return entidadActualizada;
                })
                .orElseThrow(() -> new RuntimeException("Zona no encontrada con ID: " + id));
    }
    
    /**
     * Elimina una zona por su ID (soft delete)
     */
    public void eliminarZona(Long id) {
        if (!zonaRepartoRepository.existsById(id)) {
            throw new RuntimeException("Zona no encontrada con ID: " + id);
        }
        zonaRepartoRepository.deleteById(id);
    }
    
    /**
     * Verifica si existe una zona por nombreDistrito
     */
    public boolean existePorNombreDistrito(String nombreDistrito) {
        return zonaRepartoRepository.existsByNombreDistrito(nombreDistrito);
    }
}