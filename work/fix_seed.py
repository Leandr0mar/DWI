from pathlib import Path
import re

source = Path(r"C:\Users\leand\.codex\attachments\480cc3d6-0b51-43d9-a140-39f60b260359\Texto pegado.txt")
target = Path(r"C:\Repositorios\DWI\api\src\main\resources\db\scripts\seed_supabase_actual_schema.sql")
sql = source.read_text(encoding="utf-8-sig")


def parse_values(block: str):
    rows, i = [], 0
    while i < len(block):
        while i < len(block) and (block[i].isspace() or block[i] == ','):
            i += 1
        if i >= len(block):
            break
        if block[i] != '(':
            raise ValueError(f"Expected tuple at {block[i:i+30]!r}")
        i += 1
        start = i
        depth, in_string = 0, False
        fields, field_start = [], i
        while i < len(block):
            char = block[i]
            if char == "'":
                if in_string and i + 1 < len(block) and block[i + 1] == "'":
                    i += 2
                    continue
                in_string = not in_string
            elif not in_string:
                if char == '(':
                    depth += 1
                elif char == ')':
                    if depth == 0:
                        fields.append(block[field_start:i].strip())
                        rows.append(fields)
                        i += 1
                        break
                    depth -= 1
                elif char == ',' and depth == 0:
                    fields.append(block[field_start:i].strip())
                    field_start = i + 1
            i += 1
        else:
            raise ValueError("Unclosed VALUES tuple")
    return rows


def replace_insert(table, transform):
    global sql
    pattern = re.compile(rf"(INSERT INTO {table} \((.*?)\) VALUES\s*)(.*?)(\s*ON CONFLICT.*?;)", re.S | re.I)
    matches = list(pattern.finditer(sql))
    for match in reversed(matches):
        columns = [part.strip() for part in match.group(2).split(',')]
        rows = parse_values(match.group(3))
        new_columns, new_rows = transform(columns, rows)
        replacement = match.group(1).split('VALUES')[0] + ', '.join(new_columns) + ') VALUES\n' \
            + ',\n'.join('(' + ', '.join(row) + ')' for row in new_rows) + match.group(4)
        # Preserve ON CONFLICT separately while replacing the original column list.
        replacement = re.sub(rf"INSERT INTO {table} \(.*?\) VALUES\s*", 
                             f"INSERT INTO {table} ({', '.join(new_columns)}) VALUES\n", 
                             match.group(0), count=1, flags=re.S | re.I)
        replacement = re.sub(r"VALUES\s*.*?(\s*ON CONFLICT.*?;)$", 
                             'VALUES\n' + ',\n'.join('(' + ', '.join(row) + ')' for row in new_rows) + r"\1", 
                             replacement, count=1, flags=re.S | re.I)
        sql = sql[:match.start()] + replacement + sql[match.end():]


def stock(columns, rows):
    idx = columns.index('id_producto')
    columns[idx] = 'producto_id_snapshot'
    return columns, rows


def pedidos(columns, rows):
    client_i, address_i = columns.index('id_cliente'), columns.index('id_direccion')
    columns[client_i:address_i + 1] = [
        'cliente_id_snapshot', 'cliente_nombre_snapshot', 'cliente_email_snapshot', 'direccion_entrega'
    ]
    new_rows = []
    for row in rows:
        client_id, address_id = row[client_i], row[address_i]
        row[client_i:address_i + 1] = [
            client_id,
            f"COALESCE((SELECT CONCAT(nombres, ' ', apellidos) FROM usuario WHERE id_usuario = {client_id}), 'Cliente eliminado')",
            f"COALESCE((SELECT email FROM usuario WHERE id_usuario = {client_id}), '')",
            f"COALESCE((SELECT CONCAT(alias, ': ', linea_1, CASE WHEN NULLIF(BTRIM(linea_2), '') IS NULL THEN '' ELSE CONCAT(', ', linea_2) END) FROM direccion WHERE id_direccion = {address_id}), 'Dirección histórica no disponible')"
        ]
        row[1] = row[1].replace('gen_random_uuid()', 'gen_random_uuid()::text')
        new_rows.append(row)
    return columns, new_rows


def detalle(columns, rows):
    product_i = columns.index('id_producto')
    columns[product_i:product_i + 1] = [
        'producto_id_snapshot', 'producto_nombre_snapshot', 'producto_sku_snapshot', 'sabores_snapshot'
    ]
    new_rows = []
    for row in rows:
        product_id = row[product_i]
        row[product_i:product_i + 1] = [
            product_id,
            f"COALESCE((SELECT nombre FROM producto WHERE id_producto = {product_id}), 'Producto eliminado')",
            f"COALESCE((SELECT sku FROM producto WHERE id_producto = {product_id}), '')",
            "''"
        ]
        new_rows.append(row)
    return columns, new_rows


replace_insert('historial_stock', stock)
replace_insert('pedido', pedidos)
replace_insert('detalle_pedido', detalle)

# Joined inheritance uses the inherited Usuario key in the Cliente table.
sql = sql.replace('INSERT INTO cliente (id_cliente, dni, telefono, stripe_customer_id)',
                  'INSERT INTO cliente (id_usuario, dni, telefono, stripe_customer_id)')
sql = sql.replace('gen_random_uuid(),', 'gen_random_uuid()::text,')
sql = sql.replace('ON CONFLICT (id_cliente) DO NOTHING;', 'ON CONFLICT DO NOTHING;')

# Make seed re-runs safe for records with stable IDs.
sql = sql.replace('ON CONFLICT (id_direccion) DO UPDATE SET linea_1 = EXCLUDED.linea_1;',
                  'ON CONFLICT (id_direccion) DO NOTHING;')
sql = sql.replace('ON CONFLICT (id_usuario) DO NOTHING;', 'ON CONFLICT DO NOTHING;')
sql = sql.replace('ON CONFLICT (id_pedido) DO UPDATE SET total = EXCLUDED.total, estado_pedido = EXCLUDED.estado_pedido;',
                  'ON CONFLICT (id_pedido) DO NOTHING;')
sql = sql.replace('ON CONFLICT (id_detalle) DO UPDATE SET subtotal = EXCLUDED.subtotal;',
                  'ON CONFLICT (id_detalle) DO NOTHING;')

# Correct the stock correlation and prevent a repeated +50 adjustment.
sql = re.sub(
    r"UPDATE producto\s+SET stock_disponible = COALESCE\(\s*\(SELECT MAX\(stock_disponible\) FROM producto WHERE id_producto > 20 AND id_categoria = producto\.id_categoria\),\s*stock_disponible \+ 50\s*\),\s*version = version \+ 1\s*WHERE id_producto <= 20;",
    "UPDATE producto AS original\nSET stock_disponible = newer.stock_disponible,\n    version = original.version + 1\nFROM (\n    SELECT id_categoria, MAX(stock_disponible) AS stock_disponible\n    FROM producto WHERE id_producto > 20 GROUP BY id_categoria\n) AS newer\nWHERE original.id_producto <= 20 AND original.id_categoria = newer.id_categoria;",
    sql,
    flags=re.S
)

# Synchronize identity sequences without skipping ID 1 on empty tables.
for table, column in [
    ('zona_reparto', 'id_zona'), ('direccion', 'id_direccion'), ('usuario', 'id_usuario'),
    ('pedido', 'id_pedido'), ('historial_estado_pedido', 'id_historial'),
    ('detalle_pedido', 'id_detalle'), ('historial_stock', 'id_historial')
]:
    old = f"SELECT setval(pg_get_serial_sequence('{table}', '{column}'), COALESCE(MAX({column}), 1)) FROM {table};"
    new = (f"SELECT setval(pg_get_serial_sequence('{table}', '{column}'), COALESCE(MAX({column}), 1), "
           f"MAX({column}) IS NOT NULL) FROM {table};")
    sql = sql.replace(old, new)

preflight = """DO $$
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

"""
sql = "BEGIN;\n\n" + preflight + sql.removeprefix("BEGIN;\n\n").rstrip() + "\n\nCOMMIT;\n"

for match in re.finditer(r"INSERT INTO (\w+) \((.*?)\) VALUES\s*(.*?)(?:\s*ON CONFLICT.*?;)", sql, re.S | re.I):
    column_count = len(match.group(2).split(','))
    for row_number, row in enumerate(parse_values(match.group(3)), start=1):
        if len(row) != column_count:
            raise ValueError(f"{match.group(1)} tuple {row_number}: {len(row)} values for {column_count} columns")

target.write_text(sql, encoding="utf-8")
print(f"Wrote {target} ({len(sql)} chars)")
