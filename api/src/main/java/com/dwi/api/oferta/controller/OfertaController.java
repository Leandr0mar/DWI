package com.dwi.api.oferta.controller;

import com.dwi.api.oferta.dto.OfertaAdminDTO;
import com.dwi.api.oferta.dto.OfertaRequestDTO;
import com.dwi.api.oferta.service.OfertaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/ofertas")
public class OfertaController {

    private final OfertaService ofertaService;

    public OfertaController(OfertaService ofertaService) {
        this.ofertaService = ofertaService;
    }

    @GetMapping
    public List<OfertaAdminDTO> listar() {
        return ofertaService.listar();
    }

    @GetMapping("/{id}")
    public OfertaAdminDTO obtener(@PathVariable Long id) {
        return ofertaService.obtener(id);
    }

    @PostMapping
    public ResponseEntity<OfertaAdminDTO> crear(@Valid @RequestBody OfertaRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ofertaService.crear(request));
    }

    @PutMapping("/{id}")
    public OfertaAdminDTO actualizar(@PathVariable Long id, @Valid @RequestBody OfertaRequestDTO request) {
        return ofertaService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ofertaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
