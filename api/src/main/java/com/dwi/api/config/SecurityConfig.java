package com.dwi.api.config; // Ajusta el paquete según tu estructura

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Habilitamos CORS a nivel de seguridad
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Deshabilitamos CSRF temporalmente (común en APIs REST sin cookies de sesión tradicionales)
            .csrf(csrf -> csrf.disable()) 
            // 2. Configuramos los permisos de las rutas
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/helados/listar").permitAll() // Permitir listar sin login
                .anyRequest().authenticated() // Bloquear el resto (crear, eliminar, etc.)
            );
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 3. Pon aquí la URL exacta de tu frontend
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); 
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // Opcional, pero útil si luego usas tokens
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}