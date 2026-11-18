package com.dwi.api.catalogo.producto.historial;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/stock-movements")
public class HistorialStockController {

    private final HistorialStockService historialStockService;

    public HistorialStockController(HistorialStockService historialStockService) {
        this.historialStockService = historialStockService;
    }

    @GetMapping
    public List<HistorialStockDTO> listar() {
        return historialStockService.listar();
    }

    @PostMapping
    public HistorialStockDTO crear(
            @Valid @RequestBody HistorialStockRequestDTO request,
            Authentication authentication) {
        return historialStockService.crear(request, authentication.getName());
    }
}
