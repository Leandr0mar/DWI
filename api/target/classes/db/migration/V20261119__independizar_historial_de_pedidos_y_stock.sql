-- PostgreSQL: ejecutar una vez antes de desplegar el modelo con snapshots.
-- Conserva la información histórica y elimina dependencias de pedidos e inventario
-- respecto de direcciones, clientes, productos y sabores editables.

ALTER TABLE pedido ADD COLUMN IF NOT EXISTS cliente_id_snapshot BIGINT;
ALTER TABLE pedido ADD COLUMN IF NOT EXISTS cliente_nombre_snapshot VARCHAR(201);
ALTER TABLE pedido ADD COLUMN IF NOT EXISTS cliente_email_snapshot VARCHAR(100);
ALTER TABLE pedido ADD COLUMN IF NOT EXISTS direccion_entrega VARCHAR(1000);

UPDATE pedido p
SET cliente_id_snapshot = COALESCE(p.cliente_id_snapshot, p.id_cliente),
    cliente_nombre_snapshot = COALESCE(p.cliente_nombre_snapshot,
        (SELECT u.nombres || ' ' || u.apellidos FROM usuario u WHERE u.id_usuario = p.id_cliente), 'Cliente eliminado'),
    cliente_email_snapshot = COALESCE(p.cliente_email_snapshot,
        (SELECT u.email FROM usuario u WHERE u.id_usuario = p.id_cliente), ''),
    direccion_entrega = COALESCE(p.direccion_entrega,
        (SELECT d.alias || ': ' || d.linea_1 ||
            CASE WHEN NULLIF(BTRIM(d.linea_2), '') IS NULL THEN '' ELSE ', ' || d.linea_2 END
         FROM direccion d WHERE d.id_direccion = p.id_direccion), 'Dirección histórica no disponible');

ALTER TABLE detalle_pedido ADD COLUMN IF NOT EXISTS producto_id_snapshot BIGINT;
ALTER TABLE detalle_pedido ADD COLUMN IF NOT EXISTS producto_nombre_snapshot VARCHAR(100);
ALTER TABLE detalle_pedido ADD COLUMN IF NOT EXISTS producto_sku_snapshot VARCHAR(50);
ALTER TABLE detalle_pedido ADD COLUMN IF NOT EXISTS sabores_snapshot VARCHAR(2000);

UPDATE detalle_pedido dp
SET producto_id_snapshot = COALESCE(dp.producto_id_snapshot, dp.id_producto),
    producto_nombre_snapshot = COALESCE(dp.producto_nombre_snapshot,
        (SELECT p.nombre FROM producto p WHERE p.id_producto = dp.id_producto), 'Producto eliminado'),
    producto_sku_snapshot = COALESCE(dp.producto_sku_snapshot,
        (SELECT p.sku FROM producto p WHERE p.id_producto = dp.id_producto), ''),
    sabores_snapshot = COALESCE(dp.sabores_snapshot,
        (SELECT STRING_AGG(s.nombre, ', ' ORDER BY s.nombre)
         FROM detalle_pedido_sabor dps JOIN sabor s ON s.id_sabor = dps.id_sabor
         WHERE dps.id_detalle = dp.id_detalle), '');

ALTER TABLE historial_stock ADD COLUMN IF NOT EXISTS producto_id_snapshot BIGINT;
UPDATE historial_stock hs
SET producto_id_snapshot = COALESCE(hs.producto_id_snapshot, hs.id_producto),
    nombre_producto = COALESCE(hs.nombre_producto,
        (SELECT p.nombre FROM producto p WHERE p.id_producto = hs.id_producto)),
    sku_producto = COALESCE(hs.sku_producto,
        (SELECT p.sku FROM producto p WHERE p.id_producto = hs.id_producto));

-- Quita restricciones entrantes a las columnas que pasan a ser snapshots.
DO $$
DECLARE
    fk RECORD;
BEGIN
    FOR fk IN
        SELECT conrelid::regclass AS table_name, conname
        FROM pg_constraint
        WHERE contype = 'f'
          AND (
            (conrelid = to_regclass('pedido') AND confrelid IN (to_regclass('cliente'), to_regclass('direccion'))) OR
            (conrelid = to_regclass('detalle_pedido') AND confrelid = to_regclass('producto')) OR
            (conrelid = to_regclass('detalle_pedido_sabor') AND confrelid = to_regclass('sabor')) OR
            (conrelid = to_regclass('historial_stock') AND confrelid = to_regclass('producto'))
          )
    LOOP
        EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', fk.table_name, fk.conname);
    END LOOP;
END $$;

-- Las columnas antiguas podían ser NOT NULL; se retiran tras copiar sus datos.
ALTER TABLE pedido DROP COLUMN IF EXISTS id_cliente;
ALTER TABLE pedido DROP COLUMN IF EXISTS id_direccion;
ALTER TABLE detalle_pedido DROP COLUMN IF EXISTS id_producto;
ALTER TABLE historial_stock DROP COLUMN IF EXISTS id_producto;
DROP TABLE IF EXISTS detalle_pedido_sabor;

ALTER TABLE pedido ALTER COLUMN cliente_nombre_snapshot SET NOT NULL;
ALTER TABLE pedido ALTER COLUMN cliente_email_snapshot SET NOT NULL;
ALTER TABLE pedido ALTER COLUMN direccion_entrega SET NOT NULL;
ALTER TABLE detalle_pedido ALTER COLUMN producto_nombre_snapshot SET NOT NULL;
ALTER TABLE detalle_pedido ALTER COLUMN producto_sku_snapshot SET NOT NULL;
