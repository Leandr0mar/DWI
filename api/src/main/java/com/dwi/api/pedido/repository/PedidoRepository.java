package com.dwi.api.pedido.repository;

import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.direccion.model.Direccion;
import com.dwi.api.pedido.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    // Buscar pedido por UUID
    Optional<Pedido> findByUuid(String uuid);
    
    // Verificar si existe un pedido por UUID
    boolean existsByUuid(String uuid);
    
    // Buscar pedidos por cliente
    List<Pedido> findByCliente(Cliente cliente);
    
    // Buscar pedidos por dirección
    List<Pedido> findByDireccion(Direccion direccion);
    
}