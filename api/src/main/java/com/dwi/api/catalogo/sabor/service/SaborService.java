package com.dwi.api.catalogo.sabor.service;

import com.dwi.api.catalogo.sabor.model.Sabor;
import com.dwi.api.catalogo.sabor.repository.SaborRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SaborService {
    
    private final SaborRepository saborRepository;
    
    @Autowired
    public SaborService(SaborRepository saborRepository) {
        this.saborRepository = saborRepository;
    }
    
    /**
     * Obtiene todos los sabores disponibles
     */
    public List<Sabor> obtenerSaboresDisponibles() {
        return saborRepository.findByEstadoDisponibilidadTrue();
    }

    public List<Sabor> obtenerPorDisponibilidad(boolean disponible) {
        return saborRepository.findByEstadoDisponibilidad(disponible);
    }
    
    /**
     * Obtiene un sabor por su ID
     */
    public Optional<Sabor> getSaborById(Long id) {
        return saborRepository.findById(id);
    }
    
    /**
     * Crea un nuevo sabor
     */
    @Transactional
    public Sabor crearSabor(Sabor sabor) {
        // Verificar unicidad del nombre
        if (sabor.getNombre() != null && saborRepository.existsByNombre(sabor.getNombre())) {
            throw new RuntimeException("Ya existe un sabor con el nombre: " + sabor.getNombre());
        }
        
        Sabor entidadCreada = saborRepository.save(sabor);
        return entidadCreada;
    }
    
    /**
     * Actualiza un sabor existente por su ID
     */
    public Sabor actualizarSabor(Long id, Sabor datosActualizacion) {
        return saborRepository.findById(id)
                .map(sabor -> {
                    if (datosActualizacion.getNombre() != null) {
                        String nombreNuevo = datosActualizacion.getNombre();
                        // Verificar unicidad si el nombre está cambiando
                        if (!nombreNuevo.equalsIgnoreCase(sabor.getNombre())) {
                            if (saborRepository.existsByNombre(nombreNuevo)) {
                                throw new RuntimeException("Ya existe un sabor con el nombre: " + nombreNuevo);
                            }
                        }
                        sabor.setNombre(nombreNuevo);
                    }
                    
                    if (datosActualizacion.getColorHex() != null) {
                        sabor.setColorHex(datosActualizacion.getColorHex());
                    }
                    
                    sabor.setEstadoDisponibilidad(datosActualizacion.isEstadoDisponibilidad());
                    
                    Sabor entidadActualizada = saborRepository.save(sabor);
                    return entidadActualizada;
                })
                .orElseThrow(() -> new RuntimeException("Sabor no encontrado con ID: " + id));
    }
    
    /**
     * Elimina un sabor por su ID (soft delete)
     */
    public void eliminarSabor(Long id) {
        if (!saborRepository.existsById(id)) {
            throw new RuntimeException("Sabor no encontrado con ID: " + id);
        }
        saborRepository.deleteById(id);
    }
    
    /**
     * Verifica si existe un sabor por nombre
     */
    public boolean existePorNombre(String nombre) {
        return saborRepository.existsByNombre(nombre);
    }
}

