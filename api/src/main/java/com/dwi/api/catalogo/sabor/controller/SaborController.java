package com.dwi.api.catalogo.sabor.controller;

import com.dwi.api.catalogo.sabor.dto.SaborResponseDTO;
import com.dwi.api.catalogo.sabor.service.SaborService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SaborController {

    private final SaborService saborService;

    @GetMapping("/api/v1/catalogo/sabores")
    public List<SaborResponseDTO> listarDisponibles() {
        return saborService.listarDisponibles();
    }
}
