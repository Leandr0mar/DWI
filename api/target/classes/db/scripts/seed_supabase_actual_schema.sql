BEGIN;

DO $$
DECLARE missing_columns TEXT;
BEGIN
    SELECT STRING_AGG(expected.table_name || '.' || expected.column_name, ', ')
    INTO missing_columns
    FROM (VALUES
        ('cliente', 'id_usuario'),
        ('pedido', 'cliente_id_snapshot'),
        ('pedido', 'cliente_nombre_snapshot'),
        ('pedido', 'cliente_email_snapshot'),
        ('pedido', 'direccion_entrega'),
        ('detalle_pedido', 'producto_id_snapshot'),
        ('detalle_pedido', 'producto_nombre_snapshot'),
        ('detalle_pedido', 'producto_sku_snapshot'),
        ('detalle_pedido', 'sabores_snapshot'),
        ('historial_stock', 'producto_id_snapshot')
    ) AS expected(table_name, column_name)
    LEFT JOIN information_schema.columns actual
      ON actual.table_schema = current_schema()
     AND actual.table_name = expected.table_name
     AND actual.column_name = expected.column_name
    WHERE actual.column_name IS NULL;

    IF missing_columns IS NOT NULL THEN
        RAISE EXCEPTION 'El esquema Supabase no está migrado para este seed. Faltan columnas: %', missing_columns;
    END IF;
END $$;

-- ==============================================================================
-- 1. ZONAS DE REPARTO
-- ==============================================================================
INSERT INTO zona_reparto (id_zona, nombre_distrito, costo_envio, tiempo_estimado_minutos, estado, is_deleted, version, created_at, updated_at) VALUES
(1, 'Miraflores',             5.50, 30, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(2, 'San Isidro',             4.50, 25, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(3, 'Santa Rita',             6.00, 35, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(4, 'La Molina',              7.50, 40, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(5, 'San Borja',              5.00, 30, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(6, 'Jesús María',            6.50, 35, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(7, 'Lince',                  5.50, 30, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(8, 'Surquillo',              5.00, 30, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(9, 'Los Olivos',             4.00, 25, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(10, 'Venteles Unidos',       4.50, 28, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(11, 'San Miguel',           4.00, 25, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(12, 'El Agustino',          3.50, 35, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(13, 'Comas',                3.00, 40, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(14, 'Pueblo Libre',         5.00, 30, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(15, 'Barranco',             6.00, 35, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(16, 'San Martín',           4.50, 30, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(17, 'Ate',                  5.50, 35, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(18, 'Pucusana',             8.00, 45, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(19, 'Carabayllo',           3.50, 40, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(20, 'Los Mochis',          3.00, 45, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(21, 'Carabayllo Sur',       3.50, 42, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(22, 'Ate Vitarte',         5.00, 38, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(23, 'Vidal',               4.00, 35, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(24, 'San Luis',            5.00, 30, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(25, 'Breña',               4.50, 30, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(26, 'Pueblo Nuevo',        4.00, 32, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(27, 'Sangarará',           4.50, 35, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(28, 'La Victoria',         4.00, 30, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(29, 'Lima Cercado',        4.50, 30, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00'),
(30, 'Callao',               5.50, 35, true,  false, 0, '2026-10-15 10:00:00', '2026-10-15 10:00:00')
ON CONFLICT (id_zona) DO UPDATE SET nombre_distrito = EXCLUDED.nombre_distrito;

-- ==============================================================================
-- 2. DIRECCIONES DE CLIENTES
-- ==============================================================================
INSERT INTO direccion (id_direccion, id_cliente, id_zona, alias, linea_1, linea_2, referencia, es_principal, is_deleted, version, created_at, updated_at) VALUES
(1, 1, 1, 'Casa', 'Av. Larco Marítimo 456-302', '', '', true, false, 0, '2026-10-10 14:23:00', '2026-10-10 14:23:00'),
(2, 1, 1, 'Oficina', 'Calle Los Próceres 789', '', '', false, false, 0, '2026-10-10 14:25:00', '2026-10-10 14:25:00'),
(3, 2, 2, 'Casa', 'Av. Javier Prado Este 8901', 'Piso 2', 'Entrada por el patio', true, false, 0, '2026-10-08 09:15:00', '2026-10-08 09:15:00'),
(4, 2, 2, 'Universidad', 'Av. Universitaria 234', '', '', false, false, 0, '2026-10-08 09:18:00', '2026-10-08 09:18:00'),
(5, 3, 5, 'Casa', 'Av. Arequipa 4567', '', '', true, false, 0, '2026-10-12 16:45:00', '2026-10-12 16:45:00'),
(6, 3, 5, 'Trabajo', 'Av. Javier Prado 3456', '', '', false, false, 0, '2026-10-12 16:47:00', '2026-10-12 16:47:00'),
(7, 4, 8, 'Casa', 'Av. Circunvalación Norte 567', '', '', true, false, 0, '2026-10-14 11:30:00', '2026-10-14 11:30:00'),
(8, 4, 8, 'Abuela', 'Jr. Los Pinos 890', '', '', false, false, 0, '2026-10-14 11:32:00', '2026-10-14 11:32:00'),
(9, 1, 7, 'Cercado', 'Jr. de la Unión 123', '', '', false, false, 0, '2026-10-18 08:20:00', '2026-10-18 08:20:00'),
(10, 2, 10, 'Casa', 'Av. Cañete 678', '', '', true, false, 0, '2026-10-09 13:50:00', '2026-10-09 13:50:00'),
(11, 3, 11, 'Casa', 'Av. La Mar 890', '', '', true, false, 0, '2026-10-13 10:10:00', '2026-10-13 10:10:00'),
(12, 4, 12, 'Casa', 'Av. Brasil 567', '', '', true, false, 0, '2026-10-11 15:40:00', '2026-10-11 15:40:00'),
(13, 1, 14, 'Trabajo', 'Av. Brasil 890', '', '', false, false, 0, '2026-10-17 09:15:00', '2026-10-17 09:15:00'),
(14, 2, 15, 'Casa', 'Av. Larco Marítimo 1234', '', '', true, false, 0, '2026-10-07 17:30:00', '2026-10-07 17:30:00'),
(15, 3, 16, 'Casa', 'Av. Javier Prado 5678', '', '', true, false, 0, '2026-10-12 12:20:00', '2026-10-12 12:20:00'),
(16, 4, 17, 'Casa', 'Av. Los Olivos 890', '', '', true, false, 0, '2026-10-15 14:00:00', '2026-10-15 14:00:00'),
(17, 1, 3, 'Casa', 'Av. Javier Prado Sur 9012', '', '', true, false, 0, '2026-10-06 18:45:00', '2026-10-06 18:45:00'),
(18, 2, 4, 'Casa', 'Av. La Victoria 3456', '', '', true, false, 0, '2026-10-09 11:25:00', '2026-10-09 11:25:00'),
(19, 3, 18, 'Casa', 'Av. Pucusana 789', '', '', true, false, 0, '2026-10-13 16:10:00', '2026-10-13 16:10:00'),
(20, 4, 19, 'Casa', 'Av. Carabayllo 1234', '', '', true, false, 0, '2026-10-16 10:50:00', '2026-10-16 10:50:00')
ON CONFLICT (id_direccion) DO NOTHING;

-- ==============================================================================
-- 3. ACTUALIZAR STOCK DE PRODUCTOS ORIGINALES
-- ==============================================================================
UPDATE producto AS original
SET stock_disponible = newer.stock_disponible,
    version = original.version + 1
FROM (
    SELECT id_categoria, MAX(stock_disponible) AS stock_disponible
    FROM producto WHERE id_producto > 20 GROUP BY id_categoria
) AS newer
WHERE original.id_producto <= 20 AND original.id_categoria = newer.id_categoria;

-- ==============================================================================
-- 4. RELACIÓN PRODUCTO-SABOR
-- ==============================================================================
INSERT INTO producto_sabor (id_producto, id_sabor) VALUES
(16, 3), (16, 5),
(17, 6), (17, 9), (17, 11),
(18, 14), (18, 10),
(19, 3), (19, 10),
(20, 14), (20, 11)
ON CONFLICT (id_producto, id_sabor) DO NOTHING;

-- ==============================================================================
-- 5. HISTORIAL DE STOCK
-- ==============================================================================
INSERT INTO historial_stock (id_historial, producto_id_snapshot, id_admin, cantidad_alterada, tipo_movimiento, observacion, fecha_movimiento) VALUES
(1, 1, 5, -2, 'VENTA', 'Venta de cono vainilla - Pedido #PED-001', '2026-11-18 14:30:00'),
(2, 2, 5, -1, 'VENTA', 'Venta vaso chocolate - Pedido #PED-002', '2026-11-18 14:35:00'),
(3, 3, 5, -3, 'VENTA', 'Paletas fresa para evento - Pedido #PED-003', '2026-11-17 16:20:00'),
(4, 5, 5, -2, 'VENTA', 'Vaso dulce de leche - Pedido #PED-004', '2026-11-17 10:15:00'),
(5, 7, 5, -2, 'VENTA', 'Café para cliente regular - Pedido #PED-005', '2026-11-16 15:45:00'),
(6, 8, 5, -1, 'VENTA', 'Cono menta granizada - Pedido #PED-006', '2026-11-16 12:30:00'),
(7, 9, 5, -1, 'VENTA', 'Copa avellana - Pedido #PED-007', '2026-11-15 18:20:00'),
(8, 4, 5, -1, 'VENTA', 'Vaso pistacho premium - Pedido #PED-008', '2026-11-15 14:10:00'),
(9, 10, 5, -2, 'VENTA', 'Paletas frutos del bosque - Pedido #PED-009', '2026-11-15 11:40:00'),
(10, 12, 5, -3, 'VENTA', 'Conos limón para oficina - Pedido #PED-010', '2026-11-14 17:30:00'),
(11, 14, 5, -2, 'VENTA', 'Paletas maracuyá - Pedido #PED-011', '2026-11-14 13:25:00'),
(12, 16, 5, -1, 'VENTA', 'Dúo cono artesanal - Pedido #PED-012', '2026-11-13 19:00:00'),
(13, 17, 5, -2, 'VENTA', 'Trilogía cremissimo - Pedido #PED-013', '2026-11-13 16:45:00'),
(14, 19, 5, -1, 'VENTA', 'Tarrina familiar - Pedido #PED-014', '2026-11-12 20:10:00'),
(15, 20, 5, -1, 'VENTA', 'Copa degustación - Pedido #PED-015', '2026-11-12 18:55:00'),
(16, 13, 5, 10, 'AJUSTE', 'Ajuste de stock - envases sucios devueltos', '2026-11-18 09:00:00'),
(17, 6, 5, -5, 'MERMA', 'Merma por derrames en refrigeración', '2026-11-17 08:30:00'),
(18, 8, 5, -3, 'MERMA', 'Merma de presentación expirada', '2026-11-16 14:20:00'),
(19, 11, 5, -8, 'MERMA', 'Productos derramados en piso', '2026-11-15 11:10:00'),
(20, 3, 5, -2, 'MERMA', 'Merma por entrega fuera de temperatura', '2026-11-14 16:45:00'),
(21, 15, 5, 5, 'AJUSTE', 'Ajuste periódico - stock físico vs sistema', '2026-11-13 10:00:00'),
(22, 2, 5, -10, 'MERMA', 'Merma de producto expirado', '2026-11-12 09:15:00'),
(23, 7, 5, 3, 'INGRESO', 'Ingreso nuevo lote café tostado', '2026-11-11 14:30:00'),
(24, 9, 5, -5, 'MERMA', 'Merma de producto dañado en transporte', '2026-11-10 17:00:00'),
(25, 17, 5, -3, 'MERMA', 'Productos derramados en venta', '2026-11-09 18:20:00'),
(26, 1, 5, -15, 'VENTA', 'Venta semanal - conos vainilla', '2026-11-08 14:00:00'),
(27, 5, 5, -10, 'VENTA', 'Venta dulce de leche tradicional', '2026-11-07 15:30:00'),
(28, 9, 5, -8, 'VENTA', 'Venta copas avellana', '2026-11-06 16:45:00'),
(29, 17, 5, -20, 'VENTA', 'Ventas trilogía cremissimo', '2026-11-05 19:10:00'),
(30, 19, 5, -12, 'VENTA', 'Tarrinas familiares vendidas', '2026-11-04 20:00:00')
ON CONFLICT (id_historial) DO NOTHING;

-- ==============================================================================
-- 6. PEDIDOS (con estado_pedido e is_deleted)
-- ==============================================================================
INSERT INTO pedido (id_pedido, uuid_pedido, cliente_id_snapshot, cliente_nombre_snapshot, cliente_email_snapshot, direccion_entrega, stripe_payment_intent_id, subtotal, costo_envio, igv, total, estado_pago, estado_pedido, is_deleted, created_at, updated_at, version) VALUES
(1, gen_random_uuid()::text, 1, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 1), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 1), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 1), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C1aBcDeFg', 17.00, 5.50, 3.40, 25.90, 'PAGADO', 'EN_CAMINO', false, '2026-11-18 14:30:00', '2026-11-18 14:35:00', 0),
(2, gen_random_uuid()::text, 2, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 2), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 2), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 3), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C2aBcDeFh', 7.00, 4.50, 1.40, 12.90, 'PAGADO', 'EN_CAMINO', false, '2026-11-18 14:35:00', '2026-11-18 14:40:00', 0),
(3, gen_random_uuid()::text, 3, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 3), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 3), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 5), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C3aBcDeFi', 16.50, 7.50, 3.30, 27.30, 'PAGADO', 'ENTREGADO', false, '2026-11-17 16:20:00', '2026-11-17 16:25:00', 0),
(4, gen_random_uuid()::text, 3, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 3), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 3), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 6), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C4aBcDeFj', 15.00, 5.00, 3.00, 23.00, 'PAGADO', 'ENTREGADO', false, '2026-11-17 10:15:00', '2026-11-17 10:20:00', 0),
(5, gen_random_uuid()::text, 4, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 4), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 4), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 8), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C5aBcDeFk', 7.20, 5.00, 1.44, 13.64, 'PAGADO', 'ENTREGADO', false, '2026-11-16 15:45:00', '2026-11-16 15:50:00', 0),
(6, gen_random_uuid()::text, 4, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 4), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 4), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 8), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C6aBcDeFl', 6.80, 5.00, 1.36, 13.16, 'PAGADO', 'ENTREGADO', false, '2026-11-16 12:30:00', '2026-11-16 12:35:00', 0),
(7, gen_random_uuid()::text, 1, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 1), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 1), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 9), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C7aBcDeFm', 10.00, 5.50, 2.00, 17.50, 'PAGADO', 'ENTREGADO', false, '2026-11-16 18:10:00', '2026-11-16 18:15:00', 0),
(8, gen_random_uuid()::text, 2, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 2), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 2), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 10), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C8aBcDeFn', 8.50, 4.50, 1.70, 14.70, 'PAGADO', 'ENTREGADO', false, '2026-11-15 14:10:00', '2026-11-15 14:15:00', 0),
(9, gen_random_uuid()::text, 3, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 3), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 3), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 11), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C9aBcDeFo', 11.00, 4.00, 2.20, 17.20, 'PAGADO', 'ENTREGADO', false, '2026-11-15 11:40:00', '2026-11-15 11:45:00', 0),
(10, gen_random_uuid()::text, 1, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 1), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 1), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 13), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C10aBcDeFp', 6.00, 5.00, 1.20, 12.20, 'PAGADO', 'ENTREGADO', false, '2026-11-14 17:30:00', '2026-11-14 17:35:00', 0),
(11, gen_random_uuid()::text, 3, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 3), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 3), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 15), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C11aBcDeFq', 7.00, 4.50, 1.40, 12.90, 'PAGADO', 'ENTREGADO', false, '2026-11-14 13:25:00', '2026-11-14 13:30:00', 0),
(12, gen_random_uuid()::text, 4, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 4), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 4), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 7), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C12aBcDeFr', 11.50, 5.00, 2.30, 18.80, 'PAGADO', 'ENTREGADO', false, '2026-11-13 19:00:00', '2026-11-13 19:05:00', 0),
(13, gen_random_uuid()::text, 3, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 3), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 3), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 5), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C13aBcDeFs', 15.00, 7.50, 3.00, 25.50, 'PAGADO', 'ENTREGADO', false, '2026-11-13 16:45:00', '2026-11-13 16:50:00', 0),
(14, gen_random_uuid()::text, 4, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 4), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 4), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 16), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C14aBcDeFt', 32.00, 5.50, 6.40, 43.90, 'PAGADO', 'ENTREGADO', false, '2026-11-12 20:10:00', '2026-11-12 20:15:00', 0),
(15, gen_random_uuid()::text, 2, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 2), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 2), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 3), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C15aBcDeFu', 18.50, 4.50, 3.70, 26.70, 'PAGADO', 'ENTREGADO', false, '2026-11-12 18:55:00', '2026-11-12 19:00:00', 0),
(16, gen_random_uuid()::text, 1, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 1), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 1), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 1), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C16aBcDeFv', 14.00, 5.50, 2.80, 22.30, 'PAGADO', 'ENTREGADO', false, '2026-11-11 14:00:00', '2026-11-11 14:05:00', 0),
(17, gen_random_uuid()::text, 2, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 2), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 2), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 10), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C17aBcDeFw', 8.00, 4.00, 1.60, 13.60, 'PAGADO', 'ENTREGADO', false, '2026-11-10 15:30:00', '2026-11-10 15:35:00', 0),
(18, gen_random_uuid()::text, 3, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 3), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 3), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 5), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C18aBcDeFx', 18.50, 7.50, 3.70, 29.70, 'PAGADO', 'ENTREGADO', false, '2026-11-09 16:45:00', '2026-11-09 16:50:00', 0),
(19, gen_random_uuid()::text, 4, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 4), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 4), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 7), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C19aBcDeFy', 9.50, 5.00, 1.90, 16.40, 'PAGADO', 'ENTREGADO', false, '2026-11-08 19:10:00', '2026-11-08 19:15:00', 0),
(20, gen_random_uuid()::text, 3, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 3), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 3), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 15), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C20aBcDeFz', 12.50, 5.50, 2.50, 20.50, 'PAGADO', 'ENTREGADO', false, '2026-11-07 20:00:00', '2026-11-07 20:05:00', 0),
(21, gen_random_uuid()::text, 1, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 1), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 1), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 1), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C21aBcDeFA', 16.50, 5.50, 3.30, 25.30, 'PAGADO', 'ENTREGADO', false, '2026-11-06 14:30:00', '2026-11-06 14:35:00', 0),
(22, gen_random_uuid()::text, 2, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 2), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 2), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 3), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C22aBcDeFB', 7.50, 4.50, 1.50, 13.50, 'PAGADO', 'ENTREGADO', false, '2026-11-05 15:15:00', '2026-11-05 15:20:00', 0),
(23, gen_random_uuid()::text, 3, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 3), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 3), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 5), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C23aBcDeFC', 21.50, 7.50, 4.30, 33.30, 'PAGADO', 'ENTREGADO', false, '2026-11-04 18:45:00', '2026-11-04 18:50:00', 0),
(24, gen_random_uuid()::text, 4, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 4), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 4), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 8), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C24aBcDeFD', 8.50, 5.00, 1.70, 15.20, 'PAGADO', 'ENTREGADO', false, '2026-11-03 12:20:00', '2026-11-03 12:25:00', 0),
(25, gen_random_uuid()::text, 2, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 2), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 2), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 14), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C25aBcDeFE', 17.00, 6.00, 3.40, 26.40, 'PAGADO', 'ENTREGADO', false, '2026-11-02 19:30:00', '2026-11-02 19:35:00', 0)
ON CONFLICT (id_pedido) DO NOTHING;

-- ==============================================================================
-- 7. HISTORIAL DE ESTADO PEDIDO
-- ==============================================================================
INSERT INTO historial_estado_pedido (id_historial, id_pedido, estado_nuevo, observacion, created_at) VALUES
(1, 1, 'PREPARANDO', 'Pedido recibido en bodega', '2026-11-18 14:32:00'),
(2, 1, 'EN_CAMINO', 'En camino al cliente', '2026-11-18 14:55:00'),
(3, 2, 'PREPARANDO', 'Pedido recibido', '2026-11-18 14:37:00'),
(4, 2, 'EN_CAMINO', 'Salida de cocina', '2026-11-18 14:45:00'),
(5, 3, 'PREPARANDO', 'Pedido procesado', '2026-11-17 16:22:00'),
(6, 3, 'ENTREGADO', 'Cliente satisfecho', '2026-11-17 16:50:00'),
(7, 4, 'PREPARANDO', 'Nuevo pedido', '2026-11-17 10:17:00'),
(8, 4, 'ENTREGADO', 'Entregado correctamente', '2026-11-17 10:55:00'),
(9, 5, 'PREPARANDO', 'Pedido confirmado', '2026-11-16 15:47:00'),
(10, 5, 'ENTREGADO', 'Cliente recogió en local', '2026-11-16 16:15:00'),
(11, 6, 'PREPARANDO', 'Pedido para cliente regular', '2026-11-16 12:32:00'),
(12, 6, 'ENTREGADO', 'Entregado sin problemas', '2026-11-16 12:55:00'),
(13, 7, 'PREPARANDO', 'Pedido de cercado', '2026-11-16 18:12:00'),
(14, 7, 'ENTREGADO', 'Cliente feliz con el pedido', '2026-11-16 18:50:00'),
(15, 8, 'PREPARANDO', 'Nuevo pedido vaso pistacho', '2026-11-15 14:12:00'),
(16, 8, 'ENTREGADO', 'Entregado a tiempo', '2026-11-15 14:45:00'),
(17, 9, 'PREPARANDO', 'Paletas para evento', '2026-11-15 11:42:00'),
(18, 9, 'ENTREGADO', 'Evento completado con éxito', '2026-11-15 12:30:00'),
(19, 10, 'PREPARANDO', 'Conos de oficina', '2026-11-14 17:32:00'),
(20, 10, 'ENTREGADO', 'Reunión en oficina', '2026-11-14 18:15:00'),
(21, 11, 'PREPARANDO', 'Pedido pequeño', '2026-11-14 13:27:00'),
(22, 11, 'ENTREGADO', 'Entregado rápido', '2026-11-14 13:50:00'),
(23, 12, 'PREPARANDO', 'Dúo cono artesanal', '2026-11-13 19:02:00'),
(24, 12, 'ENTREGADO', 'Cliente muy feliz', '2026-11-13 19:35:00'),
(25, 13, 'PREPARANDO', 'Trilogía clásica', '2026-11-13 16:47:00'),
(26, 13, 'ENTREGADO', 'Presentación perfecta', '2026-11-13 17:20:00'),
(27, 14, 'PREPARANDO', 'Tarrina familiar', '2026-11-12 20:12:00'),
(28, 14, 'ENTREGADO', 'Familia contenta', '2026-11-12 20:55:00'),
(29, 15, 'PREPARANDO', 'Copa degustación', '2026-11-12 18:57:00'),
(30, 15, 'ENTREGADO', 'Degustación exitosa', '2026-11-12 19:40:00')
ON CONFLICT (id_historial) DO NOTHING;

-- ==============================================================================
-- 8. DETALLES DE PEDIDOS
-- ==============================================================================
INSERT INTO detalle_pedido (id_detalle, id_pedido, producto_id_snapshot, producto_nombre_snapshot, producto_sku_snapshot, sabores_snapshot, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, COALESCE((SELECT nombre FROM producto WHERE id_producto = 1), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 1), ''), '', 1, 6.50, 6.50),
(2, 2, 2, COALESCE((SELECT nombre FROM producto WHERE id_producto = 2), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 2), ''), '', 1, 7.00, 7.00),
(3, 3, 3, COALESCE((SELECT nombre FROM producto WHERE id_producto = 3), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 3), ''), '', 2, 5.50, 11.00),
(4, 4, 5, COALESCE((SELECT nombre FROM producto WHERE id_producto = 5), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 5), ''), '', 1, 7.50, 7.50),
(5, 5, 7, COALESCE((SELECT nombre FROM producto WHERE id_producto = 7), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 7), ''), '', 1, 7.20, 7.20),
(6, 6, 8, COALESCE((SELECT nombre FROM producto WHERE id_producto = 8), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 8), ''), '', 1, 6.80, 6.80),
(7, 7, 9, COALESCE((SELECT nombre FROM producto WHERE id_producto = 9), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 9), ''), '', 1, 9.00, 9.00),
(8, 8, 4, COALESCE((SELECT nombre FROM producto WHERE id_producto = 4), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 4), ''), '', 1, 9.50, 9.50),
(9, 9, 10, COALESCE((SELECT nombre FROM producto WHERE id_producto = 10), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 10), ''), '', 2, 5.80, 11.60),
(10, 10, 12, COALESCE((SELECT nombre FROM producto WHERE id_producto = 12), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 12), ''), '', 1, 6.00, 6.00),
(11, 11, 14, COALESCE((SELECT nombre FROM producto WHERE id_producto = 14), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 14), ''), '', 1, 5.50, 5.50),
(12, 12, 16, COALESCE((SELECT nombre FROM producto WHERE id_producto = 16), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 16), ''), '', 1, 11.50, 11.50),
(13, 13, 17, COALESCE((SELECT nombre FROM producto WHERE id_producto = 17), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 17), ''), '', 1, 15.00, 15.00),
(14, 14, 19, COALESCE((SELECT nombre FROM producto WHERE id_producto = 19), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 19), ''), '', 1, 32.00, 32.00),
(15, 15, 20, COALESCE((SELECT nombre FROM producto WHERE id_producto = 20), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 20), ''), '', 1, 18.50, 18.50),
(16, 16, 1, COALESCE((SELECT nombre FROM producto WHERE id_producto = 1), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 1), ''), '', 1, 6.50, 6.50),
(17, 17, 2, COALESCE((SELECT nombre FROM producto WHERE id_producto = 2), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 2), ''), '', 1, 7.00, 7.00),
(18, 18, 3, COALESCE((SELECT nombre FROM producto WHERE id_producto = 3), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 3), ''), '', 1, 5.50, 5.50),
(19, 19, 9, COALESCE((SELECT nombre FROM producto WHERE id_producto = 9), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 9), ''), '', 1, 9.00, 9.00),
(20, 20, 17, COALESCE((SELECT nombre FROM producto WHERE id_producto = 17), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 17), ''), '', 1, 15.00, 15.00),
(21, 21, 1, COALESCE((SELECT nombre FROM producto WHERE id_producto = 1), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 1), ''), '', 1, 6.50, 6.50),
(22, 22, 2, COALESCE((SELECT nombre FROM producto WHERE id_producto = 2), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 2), ''), '', 1, 7.00, 7.00),
(23, 23, 3, COALESCE((SELECT nombre FROM producto WHERE id_producto = 3), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 3), ''), '', 1, 5.50, 5.50),
(24, 24, 9, COALESCE((SELECT nombre FROM producto WHERE id_producto = 9), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 9), ''), '', 1, 9.00, 9.00),
(25, 25, 20, COALESCE((SELECT nombre FROM producto WHERE id_producto = 20), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 20), ''), '', 1, 18.50, 18.50)
ON CONFLICT (id_detalle) DO NOTHING;

-- ==============================================================================
-- 9. HISTORIAL DE INVENTARIO
-- ==============================================================================
INSERT INTO historial_stock (id_historial, producto_id_snapshot, id_admin, cantidad_alterada, tipo_movimiento, observacion, fecha_movimiento) VALUES
(101, 1, 5, -1, 'VENTA', 'Pedido #PED-001 - Cono vainilla', '2026-11-18 14:33:00'),
(102, 2, 5, -1, 'VENTA', 'Pedido #PED-002 - Vaso chocolate', '2026-11-18 14:38:00'),
(103, 3, 5, -2, 'VENTA', 'Pedido #PED-003 - Paletas fresa', '2026-11-17 16:23:00'),
(104, 5, 5, -1, 'VENTA', 'Pedido #PED-004 - Vaso dulce de leche', '2026-11-17 10:16:00'),
(105, 7, 5, -1, 'VENTA', 'Pedido #PED-005 - Café', '2026-11-16 15:46:00'),
(106, 8, 5, -1, 'VENTA', 'Pedido #PED-006 - Cono menta', '2026-11-16 12:31:00'),
(107, 9, 5, -1, 'VENTA', 'Pedido #PED-007 - Copa avellana', '2026-11-15 14:11:00'),
(108, 10, 5, -2, 'VENTA', 'Pedido #PED-009 - Paletas frutos del bosque', '2026-11-15 11:41:00'),
(109, 12, 5, -1, 'VENTA', 'Pedido #PED-010 - Cono limón', '2026-11-14 17:31:00'),
(110, 14, 5, -1, 'VENTA', 'Pedido #PED-011 - Paleta maracuyá', '2026-11-14 13:26:00'),
(111, 16, 5, -1, 'VENTA', 'Pedido #PED-012 - Dúo cono', '2026-11-13 19:01:00'),
(112, 17, 5, -1, 'VENTA', 'Pedido #PED-013 - Trilogía', '2026-11-13 16:46:00'),
(113, 19, 5, -1, 'VENTA', 'Pedido #PED-014 - Tarrina familiar', '2026-11-12 20:11:00'),
(114, 20, 5, -1, 'VENTA', 'Pedido #PED-015 - Copa degustación', '2026-11-12 18:56:00')
ON CONFLICT (id_historial) DO NOTHING;

-- ==============================================================================
-- 10. USUARIOS ADICIONALES
-- ==============================================================================
INSERT INTO usuario (id_usuario, uuid_usuario, email, password_hash, nombres, apellidos, rol_sistema, avatar_url, is_deleted, created_at, updated_at, version) VALUES
(6, gen_random_uuid()::text, 'sophia.martinez@cremissimo.test', '$2a$10$deyeCWovBKQlI3sgGDJOPeWRFbHc/xi8mHKNuRdEeXGAYre3/UYve', 'Sophia', 'Martinez', 'CLIENTE', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', false, '2025-09-15 10:30:00', '2025-09-15 10:30:00', 0),
(7, gen_random_uuid()::text, 'david.sanchez@cremissimo.test', '$2a$10$deyeCWovBKQlI3sgGDJOPeWRFbHc/xi8mHKNuRdEeXGAYre3/UYve', 'David', 'Sanchez', 'CLIENTE', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', false, '2025-08-20 14:15:00', '2025-08-20 14:15:00', 0),
(8, gen_random_uuid()::text, 'elena.rodriguez@cremissimo.test', '$2a$10$deyeCWovBKQlI3sgGDJOPeWRFbHc/xi8mHKNuRdEeXGAYre3/UYve', 'Elena', 'Rodriguez', 'CLIENTE', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', false, '2025-07-10 09:45:00', '2025-07-10 09:45:00', 0),
(9, gen_random_uuid()::text, 'javier.lopez@cremissimo.test', '$2a$10$deyeCWovBKQlI3sgGDJOPeWRFbHc/xi8mHKNuRdEeXGAYre3/UYve', 'Javier', 'Lopez', 'CLIENTE', 'https://images.unsplash.com/photo-1500648767621-90ee61aaac7f?w=200', false, '2025-06-25 16:20:00', '2025-06-25 16:20:00', 0),
(10, gen_random_uuid()::text, 'isabella.gomez@cremissimo.test', '$2a$10$deyeCWovBKQlI3sgGDJOPeWRFbHc/xi8mHKNuRdEeXGAYre3/UYve', 'Isabella', 'Gomez', 'CLIENTE', 'https://images.unsplash.com/photo-1544005393-99knC967y9f6?w=200', false, '2025-05-18 11:10:00', '2025-05-18 11:10:00', 0)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 11. CLIENTES NUEVOS
-- ==============================================================================
INSERT INTO cliente (id_usuario, dni, telefono, stripe_customer_id) VALUES
(6, '45678901', '998765432', 'cus_3MkL9j2eZvKYLo2C'),
(7, '56789012', '997654321', 'cus_3MkL9j2eZvKYLo2D'),
(8, '67890123', '996543210', 'cus_3MkL9j2eZvKYLo2E'),
(9, '78901234', '995432109', 'cus_3MkL9j2eZvKYLo2F'),
(10, '89012345', '994321098', 'cus_3MkL9j2eZvKYLo2G')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 12. DIRECCIONES ADICIONALES
-- ==============================================================================
INSERT INTO direccion (id_direccion, id_cliente, id_zona, alias, linea_1, linea_2, referencia, es_principal, is_deleted, version, created_at, updated_at) VALUES
(21, 6, 1, 'Casa', 'Av. Larco Marítimo 789-401', '', '', true, false, 0, '2026-10-15 16:30:00', '2026-10-15 16:30:00'),
(22, 6, 1, 'Oficina', 'Calle Los Andes 456', '', '', false, false, 0, '2026-10-15 16:32:00', '2026-10-15 16:32:00'),
(23, 7, 2, 'Casa', 'Av. Javier Prado Sur 4567', '', '', true, false, 0, '2026-10-18 10:20:00', '2026-10-18 10:20:00'),
(24, 8, 5, 'Casa', 'Av. Arequipa 6789', '', '', true, false, 0, '2026-10-16 14:45:00', '2026-10-16 14:45:00'),
(25, 9, 8, 'Casa', 'Av. Circunvalación Sur 789', '', '', true, false, 0, '2026-10-17 11:30:00', '2026-10-17 11:30:00'),
(26, 10, 11, 'Casa', 'Av. La Mar 1234', '', '', true, false, 0, '2026-10-19 08:15:00', '2026-10-19 08:15:00')
ON CONFLICT (id_direccion) DO NOTHING;

-- ==============================================================================
-- 13. PEDIDOS DE NUEVOS CLIENTES (con estado_pedido e is_deleted)
-- ==============================================================================
INSERT INTO pedido (id_pedido, uuid_pedido, cliente_id_snapshot, cliente_nombre_snapshot, cliente_email_snapshot, direccion_entrega, stripe_payment_intent_id, subtotal, costo_envio, igv, total, estado_pago, estado_pedido, is_deleted, created_at, updated_at, version) VALUES
(26, gen_random_uuid()::text, 6, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 6), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 6), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 21), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C26aBcDeFg', 17.00, 5.50, 3.40, 25.90, 'PAGADO', 'EN_CAMINO', false, '2026-11-18 16:00:00', '2026-11-18 16:05:00', 0),
(27, gen_random_uuid()::text, 7, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 7), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 7), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 23), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C27aBcDeFh', 9.50, 4.50, 1.90, 15.90, 'PAGADO', 'PREPARANDO', false, '2026-11-18 17:30:00', '2026-11-18 17:35:00', 0),
(28, gen_random_uuid()::text, 8, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 8), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 8), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 24), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C28aBcDeFi', 12.50, 7.50, 2.50, 22.50, 'PAGADO', 'ENTREGADO', false, '2026-11-17 14:20:00', '2026-11-17 14:25:00', 0),
(29, gen_random_uuid()::text, 9, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 9), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 9), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 25), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C29aBcDeFj', 7.50, 5.00, 1.50, 14.00, 'PAGADO', 'ENTREGADO', false, '2026-11-17 18:45:00', '2026-11-17 18:50:00', 0),
(30, gen_random_uuid()::text, 10, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 10), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 10), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 26), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C30aBcDeFk', 8.50, 4.00, 1.70, 14.20, 'PAGADO', 'ENTREGADO', false, '2026-11-16 12:15:00', '2026-11-16 12:20:00', 0),
(31, gen_random_uuid()::text, 6, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 6), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 6), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 22), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C31aBcDeFl', 14.50, 5.50, 2.90, 22.90, 'PAGADO', 'ENTREGADO', false, '2026-11-16 19:30:00', '2026-11-16 19:35:00', 0),
(32, gen_random_uuid()::text, 7, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 7), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 7), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 23), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C32aBcDeFm', 18.00, 4.50, 3.60, 26.10, 'PAGADO', 'ENTREGADO', false, '2026-11-15 15:40:00', '2026-11-15 15:45:00', 0),
(33, gen_random_uuid()::text, 8, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 8), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 8), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 24), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C33aBcDeFn', 6.00, 5.50, 1.20, 12.70, 'PAGADO', 'ENTREGADO', false, '2026-11-14 11:25:00', '2026-11-14 11:30:00', 0),
(34, gen_random_uuid()::text, 9, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 9), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 9), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 25), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C34aBcDeFo', 10.50, 4.00, 2.10, 16.60, 'PAGADO', 'ENTREGADO', false, '2026-11-13 17:50:00', '2026-11-13 17:55:00', 0),
(35, gen_random_uuid()::text, 10, COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = 10), 'Cliente eliminado'), COALESCE((SELECT email FROM usuario WHERE id_usuario = 10), ''), COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = 26), 'Dirección histórica no disponible'), 'pi_3MkL9j2eZvKYLo2C35aBcDeFp', 15.50, 7.50, 3.10, 26.10, 'PAGADO', 'ENTREGADO', false, '2026-11-12 14:10:00', '2026-11-12 14:15:00', 0)
ON CONFLICT (id_pedido) DO NOTHING;

-- ==============================================================================
-- 14. DETALLES DE PEDIDOS PARA NUEVOS PEDIDOS
-- ==============================================================================
INSERT INTO detalle_pedido (id_detalle, id_pedido, producto_id_snapshot, producto_nombre_snapshot, producto_sku_snapshot, sabores_snapshot, cantidad, precio_unitario, subtotal) VALUES
(26, 26, 3, COALESCE((SELECT nombre FROM producto WHERE id_producto = 3), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 3), ''), '', 1, 5.50, 5.50),
(27, 27, 9, COALESCE((SELECT nombre FROM producto WHERE id_producto = 9), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 9), ''), '', 1, 9.00, 9.00),
(28, 28, 17, COALESCE((SELECT nombre FROM producto WHERE id_producto = 17), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 17), ''), '', 1, 15.00, 15.00),
(29, 29, 4, COALESCE((SELECT nombre FROM producto WHERE id_producto = 4), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 4), ''), '', 1, 9.50, 9.50),
(30, 30, 1, COALESCE((SELECT nombre FROM producto WHERE id_producto = 1), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 1), ''), '', 1, 6.50, 6.50),
(31, 31, 5, COALESCE((SELECT nombre FROM producto WHERE id_producto = 5), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 5), ''), '', 1, 7.50, 7.50),
(32, 32, 8, COALESCE((SELECT nombre FROM producto WHERE id_producto = 8), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 8), ''), '', 1, 6.80, 6.80),
(33, 33, 7, COALESCE((SELECT nombre FROM producto WHERE id_producto = 7), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 7), ''), '', 1, 7.20, 7.20),
(34, 34, 11, COALESCE((SELECT nombre FROM producto WHERE id_producto = 11), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 11), ''), '', 1, 7.80, 7.80),
(35, 35, 10, COALESCE((SELECT nombre FROM producto WHERE id_producto = 10), 'Producto eliminado'), COALESCE((SELECT sku FROM producto WHERE id_producto = 10), ''), '', 1, 5.80, 5.80)
ON CONFLICT (id_detalle) DO NOTHING;

-- ==============================================================================
-- 15. SINCRONIZAR SECUENCIAS DE POSTGRESQL
-- ==============================================================================
SELECT setval(pg_get_serial_sequence('zona_reparto', 'id_zona'), COALESCE(MAX(id_zona), 1), MAX(id_zona) IS NOT NULL) FROM zona_reparto;
SELECT setval(pg_get_serial_sequence('direccion', 'id_direccion'), COALESCE(MAX(id_direccion), 1), MAX(id_direccion) IS NOT NULL) FROM direccion;
SELECT setval(pg_get_serial_sequence('usuario', 'id_usuario'), COALESCE(MAX(id_usuario), 1), MAX(id_usuario) IS NOT NULL) FROM usuario;
SELECT setval(pg_get_serial_sequence('pedido', 'id_pedido'), COALESCE(MAX(id_pedido), 1), MAX(id_pedido) IS NOT NULL) FROM pedido;
SELECT setval(pg_get_serial_sequence('historial_estado_pedido', 'id_historial'), COALESCE(MAX(id_historial), 1), MAX(id_historial) IS NOT NULL) FROM historial_estado_pedido;
SELECT setval(pg_get_serial_sequence('detalle_pedido', 'id_detalle'), COALESCE(MAX(id_detalle), 1), MAX(id_detalle) IS NOT NULL) FROM detalle_pedido;
SELECT setval(pg_get_serial_sequence('historial_stock', 'id_historial'), COALESCE(MAX(id_historial), 1), MAX(id_historial) IS NOT NULL) FROM historial_stock;

COMMIT;
