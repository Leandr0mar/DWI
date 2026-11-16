-- Script manual de creación del esquema MySQL; no se ejecuta automáticamente al iniciar la API.
CREATE DATABASE IF NOT EXISTS cremissimo;
USE cremissimo;

-- ==============================================================================
-- 1. ACTORES Y SEGURIDAD (HERENCIA)
-- ==============================================================================

CREATE TABLE usuario (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    uuid_usuario CHAR(36) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255) NULL, -- AQUÍ SE GUARDA EL LINK DE LA IMAGEN
    rol_sistema ENUM('CLIENTE', 'ADMIN') NOT NULL,
    
    -- Auditoría y Soft Delete
    is_deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version INT DEFAULT 0
);

CREATE TABLE password_reset_token (
    id_reset BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    fecha_expiracion TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT 0,
    ip_solicitud VARCHAR(45), -- (Opcional) Guarda la IP desde donde se pidió el reseteo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE cliente (
    id_cliente BIGINT PRIMARY KEY,
    dni VARCHAR(8) UNIQUE,
    telefono VARCHAR(15),
    stripe_customer_id VARCHAR(100),
    FOREIGN KEY (id_cliente) REFERENCES usuario(id_usuario)
);

CREATE TABLE administrador (
    id_admin BIGINT PRIMARY KEY,
    nivel_acceso ENUM('SUPERADMIN', 'EDITOR', 'ALMACEN') NOT NULL,
    ultimo_acceso TIMESTAMP NULL,
    FOREIGN KEY (id_admin) REFERENCES usuario(id_usuario)
);

-- ==============================================================================
-- 2. LOGÍSTICA Y CLIENTE
-- ==============================================================================

CREATE TABLE zona_reparto (
    id_zona BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_distrito VARCHAR(100) NOT NULL,
    costo_envio DECIMAL(10,2) NOT NULL,
    tiempo_estimado_minutos INT,
    estado BOOLEAN DEFAULT 1,
    is_deleted BOOLEAN DEFAULT 0
);

CREATE TABLE direccion (
    id_direccion BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_cliente BIGINT NOT NULL,
    id_zona BIGINT NOT NULL,
    alias VARCHAR(50) NOT NULL, -- Ej: Casa, Universidad
    linea_1 VARCHAR(200) NOT NULL,
    linea_2 VARCHAR(200),
    referencia TEXT,
    es_principal BOOLEAN DEFAULT 0,
    
    is_deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_zona) REFERENCES zona_reparto(id_zona)
);

-- ==============================================================================
-- 3. CATÁLOGO E INVENTARIO
-- ==============================================================================

CREATE TABLE categoria (
    id_categoria BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    estado BOOLEAN DEFAULT 1,
    is_deleted BOOLEAN DEFAULT 0
);

CREATE TABLE producto (
    id_producto BIGINT AUTO_INCREMENT PRIMARY KEY,
    uuid_producto CHAR(36) NOT NULL UNIQUE,
    id_categoria BIGINT NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(10,2) NOT NULL,
    imagen_url VARCHAR(255),
    max_sabores INT NOT NULL DEFAULT 1, 
    stock_disponible INT NOT NULL DEFAULT 0, -- Stock de envases
    
    is_deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT NULL, -- ID del admin que editó
    version INT DEFAULT 0,
    
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    FOREIGN KEY (updated_by) REFERENCES administrador(id_admin)
);

CREATE TABLE sabor (
    id_sabor BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7),
    estado_disponibilidad BOOLEAN DEFAULT 1, -- Si se acaba la lúcuma, se apaga aquí
    is_deleted BOOLEAN DEFAULT 0
);

CREATE TABLE producto_sabor (
    id_producto BIGINT NOT NULL,
    id_sabor BIGINT NOT NULL,
    PRIMARY KEY (id_producto, id_sabor),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_sabor) REFERENCES sabor(id_sabor)
);

-- ==============================================================================
-- 4. CARRITO DE COMPRAS PERSISTENTE
-- ==============================================================================

CREATE TABLE carrito_sesion (
    id_carrito BIGINT AUTO_INCREMENT PRIMARY KEY,
    uuid_carrito CHAR(36) NOT NULL UNIQUE,
    id_cliente BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE detalle_carrito (
    id_detalle BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_carrito BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_carrito) REFERENCES carrito_sesion(id_carrito),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

CREATE TABLE detalle_carrito_sabor (
    id_detalle BIGINT NOT NULL,
    id_sabor BIGINT NOT NULL,
    PRIMARY KEY (id_detalle, id_sabor),
    FOREIGN KEY (id_detalle) REFERENCES detalle_carrito(id_detalle) ON DELETE CASCADE,
    FOREIGN KEY (id_sabor) REFERENCES sabor(id_sabor)
);

-- ==============================================================================
-- 5. E-COMMERCE Y VENTAS (STRIPE)
-- ==============================================================================

CREATE TABLE pedido (
    id_pedido BIGINT AUTO_INCREMENT PRIMARY KEY,
    uuid_pedido CHAR(36) NOT NULL UNIQUE,
    id_cliente BIGINT NOT NULL,
    id_direccion BIGINT NOT NULL,
    stripe_payment_intent_id VARCHAR(150),
    
    subtotal DECIMAL(10,2) NOT NULL,
    costo_envio DECIMAL(10,2) NOT NULL,
    igv DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    
    estado_pago ENUM('PENDIENTE', 'PAGADO', 'FALLIDO', 'REEMBOLSADO') DEFAULT 'PENDIENTE',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version INT DEFAULT 0,
    
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_direccion) REFERENCES direccion(id_direccion)
);

CREATE TABLE historial_estado_pedido (
    id_historial BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_pedido BIGINT NOT NULL,
    estado_nuevo ENUM('PREPARANDO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO') NOT NULL,
    observacion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);

CREATE TABLE detalle_pedido (
    id_detalle BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_pedido BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

CREATE TABLE detalle_pedido_sabor (
    id_detalle BIGINT NOT NULL,
    id_sabor BIGINT NOT NULL,
    PRIMARY KEY (id_detalle, id_sabor),
    FOREIGN KEY (id_detalle) REFERENCES detalle_pedido(id_detalle),
    FOREIGN KEY (id_sabor) REFERENCES sabor(id_sabor)
);

-- ==============================================================================
-- 6. IDEMPOTENCIA (WEBHOOKS) E HISTORIAL DE INVENTARIO
-- ==============================================================================

CREATE TABLE stripe_webhook_log (
    id_log BIGINT AUTO_INCREMENT PRIMARY KEY,
    evento_id VARCHAR(150) NOT NULL UNIQUE, -- ID del evento de Stripe (ej. evt_1M...)
    tipo_evento VARCHAR(100) NOT NULL,
    estado ENUM('PROCESADO', 'ERROR') NOT NULL,
    fecha_procesado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historial_stock (
    id_historial BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_producto BIGINT NULL,
    id_admin BIGINT NOT NULL,
    cantidad_alterada INT NOT NULL,
    tipo_movimiento ENUM('INGRESO', 'MERMA', 'VENTA', 'AJUSTE') NOT NULL,
    observacion TEXT,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_admin) REFERENCES administrador(id_admin)
);