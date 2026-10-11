package com.dwi.api.usuario.administrador;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AdministradorService {

    private final AdministradorRepository administradorRepository;
    private final PasswordEncoder passwordEncoder;

    public AdministradorService(
            AdministradorRepository administradorRepository,
            PasswordEncoder passwordEncoder) {
        this.administradorRepository = administradorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<Administrador> listarTodos() {
        return administradorRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Administrador obtenerPorId(Long id) {
        return administradorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Administrador no encontrado con ID: " + id));
    }

    @Transactional
    public Administrador guardar(Administrador administrador) {
        administrador.setPassword(passwordEncoder.encode(administrador.getPassword()));
        return administradorRepository.save(administrador);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!administradorRepository.existsById(id)) {
            throw new EntityNotFoundException("Administrador no encontrado con ID: " + id);
        }
        administradorRepository.deleteById(id);
    }
}
