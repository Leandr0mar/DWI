-- Esquema inicial de Cremissimo. Incluye las entidades nuevas y las tablas
-- del paquete heredado que todavía forman parte de la aplicación compilada.

CREATE TABLE roles (
    id_rol BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_rol),
    CONSTRAINT uk_roles_name UNIQUE (name)
);

CREATE TABLE usuarios (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(9) NOT NULL,
    activo BIT NOT NULL,
    fecha_registro DATETIME(6),
    PRIMARY KEY (id)
);

CREATE TABLE administradores (
    idUsuario BIGINT NOT NULL,
    codigo_empleado VARCHAR(20) UNIQUE,
    area VARCHAR(50),
    cargo VARCHAR(50),
    ultimo_acceso DATETIME(6),
    PRIMARY KEY (idUsuario),
    CONSTRAINT fk_legacy_administrador_usuario FOREIGN KEY (idUsuario) REFERENCES usuarios (id)
);

CREATE TABLE clientes (
    idUsuario BIGINT NOT NULL,
    dni VARCHAR(8),
    PRIMARY KEY (idUsuario),
    CONSTRAINT fk_legacy_cliente_usuario FOREIGN KEY (idUsuario) REFERENCES usuarios (id)
);

CREATE TABLE usuario_rol (
    usuario_id BIGINT NOT NULL,
    rol_id BIGINT NOT NULL,
    PRIMARY KEY (usuario_id, rol_id),
    CONSTRAINT fk_usuario_rol_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    CONSTRAINT fk_usuario_rol_rol FOREIGN KEY (rol_id) REFERENCES roles (id_rol)
);

CREATE TABLE direcciones (
    id BIGINT NOT NULL AUTO_INCREMENT,
    cliente_id BIGINT NOT NULL,
    alias VARCHAR(30) NOT NULL,
    departamento VARCHAR(50) NOT NULL,
    provincia VARCHAR(50) NOT NULL,
    distrito VARCHAR(50) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    referencia VARCHAR(200),
    codigo_postal VARCHAR(10),
    PRIMARY KEY (id),
    CONSTRAINT fk_legacy_direccion_cliente FOREIGN KEY (cliente_id) REFERENCES clientes (idUsuario)
);

CREATE TABLE sabores (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200),
    activo BIT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_legacy_sabores_nombre UNIQUE (nombre)
);

CREATE TABLE helados (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(80) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descripcion VARCHAR(255),
    stock INT NOT NULL,
    url_imagen VARCHAR(500) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    peso_volumen VARCHAR(30) NOT NULL,
    tipo_presentacion VARCHAR(30) NOT NULL,
    es_personalizable BIT NOT NULL,
    max_sabores INT,
    fecha_creacion DATETIME(6),
    fecha_actualizacion DATETIME(6),
    PRIMARY KEY (id)
);

CREATE TABLE helado_sabores (
    id_helado BIGINT NOT NULL,
    id_sabor BIGINT NOT NULL,
    PRIMARY KEY (id_helado, id_sabor),
    CONSTRAINT fk_helado_sabores_helado FOREIGN KEY (id_helado) REFERENCES helados (id),
    CONSTRAINT fk_helado_sabores_sabor FOREIGN KEY (id_sabor) REFERENCES sabores (id)
);

CREATE TABLE categoria (
    id_categoria BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    estado BIT NOT NULL,
    is_deleted BIT NOT NULL,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    version INT,
    PRIMARY KEY (id_categoria)
);

CREATE TABLE sabor (
    id_sabor BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7),
    estado_disponibilidad BIT NOT NULL,
    is_deleted BIT NOT NULL,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    version INT,
    PRIMARY KEY (id_sabor)
);

CREATE TABLE producto (
    id_producto BIGINT NOT NULL AUTO_INCREMENT,
    uuid_producto VARCHAR(36) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(10,2) NOT NULL,
    max_sabores INT NOT NULL,
    stock_disponible INT NOT NULL,
    url_imagen VARCHAR(500),
    peso_volumen VARCHAR(30),
    tipo_presentacion VARCHAR(30),
    id_categoria BIGINT NOT NULL,
    is_deleted BIT NOT NULL,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    version INT,
    PRIMARY KEY (id_producto),
    CONSTRAINT uk_producto_uuid UNIQUE (uuid_producto),
    CONSTRAINT uk_producto_sku UNIQUE (sku),
    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES categoria (id_categoria)
);

CREATE TABLE producto_sabor (
    id_producto BIGINT NOT NULL,
    id_sabor BIGINT NOT NULL,
    PRIMARY KEY (id_producto, id_sabor),
    CONSTRAINT fk_producto_sabor_producto FOREIGN KEY (id_producto) REFERENCES producto (id_producto),
    CONSTRAINT fk_producto_sabor_sabor FOREIGN KEY (id_sabor) REFERENCES sabor (id_sabor)
);

CREATE TABLE usuario (
    id_usuario BIGINT NOT NULL AUTO_INCREMENT,
    uuid_usuario VARCHAR(36) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    rol_sistema VARCHAR(255) NOT NULL,
    is_deleted BIT NOT NULL,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    version INT,
    PRIMARY KEY (id_usuario),
    CONSTRAINT uk_usuario_uuid UNIQUE (uuid_usuario),
    CONSTRAINT uk_usuario_email UNIQUE (email)
);

CREATE TABLE cliente (
    id_usuario BIGINT NOT NULL,
    dni VARCHAR(8) UNIQUE,
    telefono VARCHAR(15),
    stripe_customer_id VARCHAR(100),
    PRIMARY KEY (id_usuario),
    CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

CREATE TABLE administrador (
    id_usuario BIGINT NOT NULL,
    nivel_acceso VARCHAR(255) NOT NULL,
    ultimo_acceso DATETIME(6),
    PRIMARY KEY (id_usuario),
    CONSTRAINT fk_administrador_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

CREATE TABLE zona_reparto (
    id_zona BIGINT NOT NULL AUTO_INCREMENT,
    nombre_distrito VARCHAR(100) NOT NULL,
    costo_envio DECIMAL(10,2) NOT NULL,
    tiempo_estimado_minutos INT,
    estado BIT NOT NULL,
    is_deleted BIT NOT NULL,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    version INT,
    PRIMARY KEY (id_zona)
);

CREATE TABLE direccion (
    id_direccion BIGINT NOT NULL AUTO_INCREMENT,
    id_cliente BIGINT NOT NULL,
    id_zona BIGINT NOT NULL,
    alias VARCHAR(50) NOT NULL,
    linea_1 VARCHAR(200) NOT NULL,
    linea_2 VARCHAR(200),
    referencia TEXT,
    es_principal BIT NOT NULL,
    is_deleted BIT NOT NULL,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    version INT,
    PRIMARY KEY (id_direccion),
    CONSTRAINT fk_direccion_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_usuario),
    CONSTRAINT fk_direccion_zona FOREIGN KEY (id_zona) REFERENCES zona_reparto (id_zona)
);

CREATE TABLE carrito_sesion (
    id_carrito BIGINT NOT NULL AUTO_INCREMENT,
    uuid_carrito VARCHAR(36) NOT NULL,
    id_cliente BIGINT NOT NULL UNIQUE,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id_carrito),
    CONSTRAINT uk_carrito_uuid UNIQUE (uuid_carrito),
    CONSTRAINT fk_carrito_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_usuario)
);

CREATE TABLE detalle_carrito (
    id_detalle BIGINT NOT NULL AUTO_INCREMENT,
    id_carrito BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    cantidad INT NOT NULL,
    PRIMARY KEY (id_detalle),
    CONSTRAINT fk_detalle_carrito_carrito FOREIGN KEY (id_carrito) REFERENCES carrito_sesion (id_carrito),
    CONSTRAINT fk_detalle_carrito_producto FOREIGN KEY (id_producto) REFERENCES producto (id_producto)
);

CREATE TABLE detalle_carrito_sabor (
    id_detalle BIGINT NOT NULL,
    id_sabor BIGINT NOT NULL,
    PRIMARY KEY (id_detalle, id_sabor),
    CONSTRAINT fk_detalle_carrito_sabor_detalle FOREIGN KEY (id_detalle) REFERENCES detalle_carrito (id_detalle),
    CONSTRAINT fk_detalle_carrito_sabor_sabor FOREIGN KEY (id_sabor) REFERENCES sabor (id_sabor)
);

CREATE TABLE pedido (
    id_pedido BIGINT NOT NULL AUTO_INCREMENT,
    uuid_pedido VARCHAR(36) NOT NULL,
    id_cliente BIGINT NOT NULL,
    id_direccion BIGINT NOT NULL,
    stripe_payment_intent_id VARCHAR(150),
    subtotal DECIMAL(10,2) NOT NULL,
    costo_envio DECIMAL(10,2) NOT NULL,
    igv DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado_pago VARCHAR(255) NOT NULL,
    is_deleted BIT NOT NULL,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    version INT,
    PRIMARY KEY (id_pedido),
    CONSTRAINT uk_pedido_uuid UNIQUE (uuid_pedido),
    CONSTRAINT fk_pedido_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_usuario),
    CONSTRAINT fk_pedido_direccion FOREIGN KEY (id_direccion) REFERENCES direccion (id_direccion)
);

CREATE TABLE detalle_pedido (
    id_detalle BIGINT NOT NULL AUTO_INCREMENT,
    id_pedido BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_detalle),
    CONSTRAINT fk_detalle_pedido_pedido FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido),
    CONSTRAINT fk_detalle_pedido_producto FOREIGN KEY (id_producto) REFERENCES producto (id_producto)
);

CREATE TABLE detalle_pedido_sabor (
    id_detalle BIGINT NOT NULL,
    id_sabor BIGINT NOT NULL,
    PRIMARY KEY (id_detalle, id_sabor),
    CONSTRAINT fk_detalle_pedido_sabor_detalle FOREIGN KEY (id_detalle) REFERENCES detalle_pedido (id_detalle),
    CONSTRAINT fk_detalle_pedido_sabor_sabor FOREIGN KEY (id_sabor) REFERENCES sabor (id_sabor)
);

CREATE TABLE historial_estado_pedido (
    id_historial BIGINT NOT NULL AUTO_INCREMENT,
    id_pedido BIGINT NOT NULL,
    estado_nuevo VARCHAR(255) NOT NULL,
    observacion TEXT,
    created_at DATETIME(6),
    PRIMARY KEY (id_historial),
    CONSTRAINT fk_historial_pedido FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido)
);

CREATE TABLE historial_stock (
    id_historial BIGINT NOT NULL AUTO_INCREMENT,
    id_producto BIGINT,
    id_admin BIGINT NOT NULL,
    cantidad_alterada INT NOT NULL,
    tipo_movimiento VARCHAR(255) NOT NULL,
    observacion TEXT,
    fecha_movimiento DATETIME(6),
    PRIMARY KEY (id_historial),
    CONSTRAINT fk_historial_stock_producto FOREIGN KEY (id_producto) REFERENCES producto (id_producto),
    CONSTRAINT fk_historial_stock_admin FOREIGN KEY (id_admin) REFERENCES administrador (id_usuario)
);

CREATE TABLE password_reset_token (
    id_reset BIGINT NOT NULL AUTO_INCREMENT,
    token VARCHAR(255) NOT NULL,
    fecha_expiracion DATETIME(6) NOT NULL,
    usado BIT NOT NULL,
    ip_solicitud VARCHAR(45),
    id_usuario BIGINT NOT NULL,
    PRIMARY KEY (id_reset),
    CONSTRAINT uk_password_reset_token UNIQUE (token),
    CONSTRAINT fk_password_reset_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

CREATE TABLE stripe_webhook_log (
    id_log BIGINT NOT NULL AUTO_INCREMENT,
    evento_id VARCHAR(150) NOT NULL,
    tipo_evento VARCHAR(100) NOT NULL,
    estado VARCHAR(255) NOT NULL,
    fecha_procesado DATETIME(6),
    PRIMARY KEY (id_log),
    CONSTRAINT uk_stripe_evento_id UNIQUE (evento_id)
);
