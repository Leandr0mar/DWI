package com.dwi.api.direccion.repository;

import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.direccion.model.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DireccionRepository extends JpaRepository<Direccion, Long> {
    
    // Buscar por cliente y zona
    List<Direccion> findByCliente(Cliente cliente);
    
    List<Direccion> findByClienteAndZona(Cliente cliente, com.dwi.api.zona.model.ZonaReparto zona);
    
    // Buscar la dirección principal de un cliente
    Optional<Direccion> findByClienteAndEsPrincipalTrue(Cliente cliente);
    
    // Verificar si un cliente tiene al menos una dirección
    boolean existsByCliente(Cliente cliente);
}