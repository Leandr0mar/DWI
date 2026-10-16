package com.dwi.api.catalogo.sabor.service;

import com.dwi.api.catalogo.sabor.dto.SaborResponseDTO;
import com.dwi.api.catalogo.sabor.repository.SaborRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SaborService {

    private final SaborRepository saborRepository;

    @Transactional(readOnly = true)
    public List<SaborResponseDTO> listarDisponibles() {
        return saborRepository.findAllByEstadoDisponibilidadTrueOrderByNombreAsc().stream()
                .map(sabor -> new SaborResponseDTO(sabor.getId(), sabor.getNombre(), sabor.getColorHex()))
                .toList();
    }
}
