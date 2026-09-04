package com.dwi.api.helado;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dwi.api.helado.enums.EstadoHelado;
import com.dwi.api.helado.sabor.Sabor;
import com.dwi.api.helado.sabor.SaborRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class HeladoService {

    private final HeladoRepository heladoRepository;
    private final SaborRepository saborRepository;

    public HeladoService(HeladoRepository heladoRepository, SaborRepository saborRepository) {
        this.heladoRepository = heladoRepository;
        this.saborRepository = saborRepository;
    }

    @Transactional
    public Helado crear(Helado helado, Long idSabor) {
        Sabor sabor = saborRepository.findById(idSabor)
                .orElseThrow(() -> new EntityNotFoundException("Sabor  no encontrado con ID: " + idSabor));

        helado.setSabor(sabor);

        if (helado.getStock() != null && helado.getStock() == 0) {
            helado.setEstado(EstadoHelado.AGOTADO);
        }

        return heladoRepository.save(helado);
    }

    @Transactional(readOnly = true)
    public List<Helado> listarTodos() {
        return heladoRepository.findAllWithSabor();
    }

    @Transactional(readOnly = true)
    public Helado obtenerPorId(Long id) {
        return heladoRepository.findByIdWithSabor(id)
                .orElseThrow(() -> new EntityNotFoundException("Helado no encontrado con ID: " + id));
    }

    @Transactional
    public Helado actualizar(Long id, Helado datosNuevos, Long idSabor) {
        Helado heladoExistente = obtenerPorId(id);

        if (idSabor != null && !heladoExistente.getSabor().getId().equals(idSabor)) {
            Sabor nuevoSabor = saborRepository.findById(idSabor)
                    .orElseThrow(() -> new EntityNotFoundException("Sabor no encontrado con ID: " + idSabor));
            heladoExistente.setSabor(nuevoSabor);
        }

        heladoExistente.setNombre(datosNuevos.getNombre());
        heladoExistente.setPrecio(datosNuevos.getPrecio());
        heladoExistente.setDescripcion(datosNuevos.getDescripcion());
        heladoExistente.setStock(datosNuevos.getStock());
        heladoExistente.setUrlImagen(datosNuevos.getUrlImagen());
        heladoExistente.setCategoria(datosNuevos.getCategoria());
        heladoExistente.setPesoVolumen(datosNuevos.getPesoVolumen());
        heladoExistente.setTipoPresentacion(datosNuevos.getTipoPresentacion());

        if (datosNuevos.getStock() == 0) {
            heladoExistente.setEstado(EstadoHelado.AGOTADO);
        } else if (datosNuevos.getEstado() != null) {
            heladoExistente.setEstado(datosNuevos.getEstado());
        }

        return heladoRepository.save(heladoExistente);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!heladoRepository.existsById(id)) {
            throw new EntityNotFoundException("Helado no encontrado con ID: " + id);
        }
        heladoRepository.deleteById(id);
    }

    @Transactional
    public void cambiarEstado(Long id) {
        Helado helado = obtenerPorId(id);
        if (helado.getEstado() == EstadoHelado.ACTIVO) {
            helado.setEstado(EstadoHelado.INACTIVO);
        } else {
            helado.setEstado(helado.getStock() > 0 ? EstadoHelado.ACTIVO : EstadoHelado.AGOTADO);
        }
        heladoRepository.save(helado);
    }
}