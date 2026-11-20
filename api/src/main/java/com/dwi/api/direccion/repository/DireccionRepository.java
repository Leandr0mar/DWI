package com.dwi.api.direccion.repository;

import com.dwi.api.cliente.model.Cliente;
import com.dwi.api.direccion.model.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DireccionRepository extends JpaRepository<Direccion, Long> {

    interface DireccionAdminProjection {
        Long getId();
        Long getClienteId();
        String getClienteNombre();
        Long getZonaId();
        String getZona();
        String getAlias();
        String getLinea1();
        String getLinea2();
        String getReferencia();
        boolean getEsPrincipal();
    }

    @Query(value = """
            SELECT d.id_direccion AS id,
                   d.id_cliente AS "clienteId",
                   COALESCE(NULLIF(BTRIM(CONCAT(u.nombres, ' ', u.apellidos)), ''), CONCAT('Cliente #', d.id_cliente)) AS "clienteNombre",
                   d.id_zona AS "zonaId",
                   COALESCE(z.nombre_distrito, CONCAT('Zona #', d.id_zona)) AS zona,
                   d.alias AS alias,
                   d.linea_1 AS "linea1",
                   d.linea_2 AS "linea2",
                   d.referencia AS referencia,
                   d.es_principal AS "esPrincipal"
            FROM direccion d
            LEFT JOIN usuario u ON u.id_usuario = d.id_cliente
            LEFT JOIN zona_reparto z ON z.id_zona = d.id_zona
            WHERE d.is_deleted = FALSE
            ORDER BY d.id_direccion
            """, nativeQuery = true)
    List<DireccionAdminProjection> listarParaAdministracion();

    @Query(value = """
            SELECT d.id_direccion AS id,
                   d.id_cliente AS "clienteId",
                   COALESCE(NULLIF(BTRIM(CONCAT(u.nombres, ' ', u.apellidos)), ''), CONCAT('Cliente #', d.id_cliente)) AS "clienteNombre",
                   d.id_zona AS "zonaId",
                   COALESCE(z.nombre_distrito, CONCAT('Zona #', d.id_zona)) AS zona,
                   d.alias AS alias,
                   d.linea_1 AS "linea1",
                   d.linea_2 AS "linea2",
                   d.referencia AS referencia,
                   d.es_principal AS "esPrincipal"
            FROM direccion d
            LEFT JOIN usuario u ON u.id_usuario = d.id_cliente
            LEFT JOIN zona_reparto z ON z.id_zona = d.id_zona
            WHERE d.id_direccion = :id AND d.is_deleted = FALSE
            """, nativeQuery = true)
    Optional<DireccionAdminProjection> buscarParaAdministracion(@Param("id") Long id);
    
    // Buscar por cliente y zona
    List<Direccion> findByCliente(Cliente cliente);
    
    List<Direccion> findByClienteAndZona(Cliente cliente, com.dwi.api.zona.model.ZonaReparto zona);
    
    // Buscar la dirección principal de un cliente
    Optional<Direccion> findByClienteAndEsPrincipalTrue(Cliente cliente);
    
    // Verificar si un cliente tiene al menos una dirección
    boolean existsByCliente(Cliente cliente);
}
