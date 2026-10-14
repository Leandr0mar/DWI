package com.dwi.api.seguridad.controller;

import com.dwi.api.seguridad.service.AuthService;
import com.dwi.api.cliente.dto.ClienteRegistroDTO;
import com.dwi.api.cliente.service.ClienteService;
import com.dwi.api.seguridad.dto.AuthResponseDTO;
import com.dwi.api.seguridad.dto.LoginRequestDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ClienteService clienteService;
    private final AuthService authService; // Inyectar el nuevo servicio
    @PostMapping("/registro")
    public ResponseEntity<Map<String, String>> registrarCliente(@Valid @RequestBody ClienteRegistroDTO request) {
        clienteService.registrarCliente(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensaje", "Cuenta creada exitosamente. Ya puedes iniciar sesión."));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthService.LoginResult> iniciarSesion(@Valid @RequestBody LoginRequestDTO request) {
        AuthService.LoginResult result = authService.login(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/me")
    public AuthResponseDTO usuarioActual(@AuthenticationPrincipal UserDetails userDetails) {
        return authService.getCurrentUser(userDetails.getUsername());
    }

    @PostMapping("/recuperar-password")
    public ResponseEntity<Map<String, String>> solicitarRecuperacion(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        // TODO: Integrar servicio de PasswordResetToken y envío de email
    
        return ResponseEntity.ok(Map.of("mensaje", "Si existe una cuenta asociada, recibirás un enlace de recuperación."));
    }
}
