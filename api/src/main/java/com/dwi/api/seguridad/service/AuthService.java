package com.dwi.api.seguridad.service;

import com.dwi.api.seguridad.dto.AuthResponseDTO;
import com.dwi.api.seguridad.dto.LoginRequestDTO;
import com.dwi.api.seguridad.jwt.JwtService;
import com.dwi.api.usuario.model.Usuario;
import com.dwi.api.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public LoginResult login(LoginRequestDTO request) {
        // 1. Spring Security maneja la validación de la contraseña internamente aquí
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // 2. Si pasa el paso anterior, la contraseña es correcta. Buscamos al usuario
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // El AuthenticationManager devuelve el principal ya validado para firmar el JWT.
        String jwtToken = jwtService.generateToken((UserDetails) authentication.getPrincipal());

        return new LoginResult(jwtToken, toProfile(usuario));
    }

    public AuthResponseDTO getCurrentUser(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return toProfile(usuario);
    }

    private AuthResponseDTO toProfile(Usuario usuario) {
        return new AuthResponseDTO(
                usuario.getNombres() + " " + usuario.getApellidos(),
                usuario.getRolSistema().name(),
                usuario.getAvatarUrl()
        );
    }

    public record LoginResult(String token, AuthResponseDTO profile) {}
}
