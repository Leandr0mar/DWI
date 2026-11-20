package com.dwi.api.pedido.repository;

import com.dwi.api.pedido.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Collection;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    // Buscar pedido por UUID
    Optional<Pedido> findByUuid(String uuid);

    List<Pedido> findAllByClienteId(Long clienteId);
    
    // Verificar si existe un pedido por UUID
    boolean existsByUuid(String uuid);
    
    List<Pedido> findAllByOrderByCreatedAtDesc();
    
}
