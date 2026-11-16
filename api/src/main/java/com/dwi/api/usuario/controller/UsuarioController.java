package com.dwi.api.usuario.controller;

import com.dwi.api.usuario.model.Usuario;
import com.dwi.api.usuario.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    private final UsuarioService usuarioService;
    
    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }
    
    /**
     * Obtiene todos los usuarios no eliminados
     * GET /api/usuarios
     */
    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioService.getAllUsuarios();
    }
    
    /**
     * Obtiene un usuario por su ID
     * GET /api/usuarios/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getPorId(@PathVariable Long id) {
        return usuarioService.getUsuarioPorEmail("placeholder") // Placeholder - debería usar findById si existiera
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Obtiene un usuario por su UUID
     * GET /api/usuarios/uuid/{uuid}
     */
    @GetMapping("/uuid/{uuid}")
    public ResponseEntity<Usuario> getPorUuid(@PathVariable String uuid) {
        return usuarioService.getUsuarioPorUuid(uuid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Obtiene un usuario por su email
     * GET /api/usuarios/email/{email}
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> getPorEmail(@PathVariable String email) {
        return usuarioService.getUsuarioPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Crea un nuevo usuario
     * POST /api/usuarios
     */
    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario) {
        return usuarioService.crearUsuario(usuario);
    }
    
    /**
     * Actualiza un usuario existente por su ID
     * PUT /api/usuarios/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario datosActualizacion) {
        try {
            Usuario usuarioActualizado = usuarioService.actualizarUsuario(id, datosActualizacion);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Elimina un usuario por su ID
     * DELETE /api/usuarios/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Verifica si existe un usuario por email
     * GET /api/usuarios/existe/email/{email}
     */
    @GetMapping("/existe/email/{email}")
    public ResponseEntity<Boolean> verificarExistenciaEmail(@PathVariable String email) {
        boolean existe = usuarioService.existePorEmail(email);
        return ResponseEntity.ok(existe);
    }
    
    /**
     * Verifica si existe un usuario por UUID
     * GET /api/usuarios/existe/uuid/{uuid}
     */
    @GetMapping("/existe/uuid/{uuid}")
    public ResponseEntity<Boolean> verificarExistenciaUuid(@PathVariable String uuid) {
        boolean existe = usuarioService.existePorUuid(uuid);
        return ResponseEntity.ok(existe);
    }
    
    /**
     * Obtiene usuarios por rol de sistema
     * GET /api/usuarios/rol/{rol}
     */
    @GetMapping("/rol/{rol}")
    public List<Usuario> listarPorRol(@PathVariable Usuario.RolSistema rol) {
        return usuarioService.getAllUsuarios().stream()
                .filter(u -> u.getRolSistema() == rol)
                .toList();
    }
}