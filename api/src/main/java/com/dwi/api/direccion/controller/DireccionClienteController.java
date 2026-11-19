package com.dwi.api.direccion.controller;

import com.dwi.api.direccion.dto.DireccionAdminDTO;
import com.dwi.api.direccion.dto.DireccionAdminRequestDTO;
import com.dwi.api.direccion.service.DireccionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
@RequestMapping("/api/v1/cliente/direcciones")
public class DireccionClienteController {

    private final DireccionService direccionService;

    public DireccionClienteController(DireccionService direccionService) {
        this.direccionService = direccionService;
    }

    @GetMapping
    public List<DireccionAdminDTO> listar(@AuthenticationPrincipal UserDetails usuario) {
        return direccionService.obtenerDireccionesDelUsuario(usuario.getUsername());
    }

    @PostMapping
    public ResponseEntity<DireccionAdminDTO> crear(
            @AuthenticationPrincipal UserDetails usuario,
            @Valid @RequestBody DireccionAdminRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(direccionService.crearParaUsuario(usuario.getUsername(), request));
    }

    @PutMapping("/{id}")
    public DireccionAdminDTO actualizar(
            @AuthenticationPrincipal UserDetails usuario,
            @PathVariable Long id,
            @Valid @RequestBody DireccionAdminRequestDTO request) {
        return direccionService.actualizarParaUsuario(usuario.getUsername(), id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @AuthenticationPrincipal UserDetails usuario,
            @PathVariable Long id) {
        direccionService.eliminarParaUsuario(usuario.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
