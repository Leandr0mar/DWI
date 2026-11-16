-- Script manual con cuentas de desarrollo; contraseña de todas: Cremissimo123!
-- No usar estas credenciales en producción.

INSERT IGNORE INTO usuario (
    uuid_usuario,
    email,
    password_hash,
    nombres,
    apellidos,
    rol_sistema,
    is_deleted,
    created_at,
    updated_at,
    version
)
SELECT 'c58c4216-456e-4632-9dd4-2ea976160001',
       'ana.garcia@cremissimo.test',
       '$2a$10$deyeCWovBKQlI3sgGDJOPeWRFbHc/xi8mHKNuRdEeXGAYre3/UYve',
       'Ana',
       'Garcia',
       'CLIENTE',
       0,
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP,
       0
FROM DUAL;

INSERT IGNORE INTO usuario (
    uuid_usuario,
    email,
    password_hash,
    nombres,
    apellidos,
    rol_sistema,
    is_deleted,
    created_at,
    updated_at,
    version
)
SELECT 'c58c4216-456e-4632-9dd4-2ea976160002',
       'luis.torres@cremissimo.test',
       '$2a$10$deyeCWovBKQlI3sgGDJOPeWRFbHc/xi8mHKNuRdEeXGAYre3/UYve',
       'Luis',
       'Torres',
       'CLIENTE',
       0,
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP,
       0
FROM DUAL;

INSERT IGNORE INTO usuario (
    uuid_usuario,
    email,
    password_hash,
    nombres,
    apellidos,
    rol_sistema,
    is_deleted,
    created_at,
    updated_at,
    version
)
SELECT 'c58c4216-456e-4632-9dd4-2ea976160003',
       'maria.lopez@cremissimo.test',
       '$2a$10$deyeCWovBKQlI3sgGDJOPeWRFbHc/xi8mHKNuRdEeXGAYre3/UYve',
       'Maria',
       'Lopez',
       'CLIENTE',
       0,
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP,
       0
FROM DUAL;

INSERT IGNORE INTO usuario (
    uuid_usuario,
    email,
    password_hash,
    nombres,
    apellidos,
    rol_sistema,
    is_deleted,
    created_at,
    updated_at,
    version
)
SELECT 'c58c4216-456e-4632-9dd4-2ea976160004',
       'carlos.ramirez@cremissimo.test',
       '$2a$10$deyeCWovBKQlI3sgGDJOPeWRFbHc/xi8mHKNuRdEeXGAYre3/UYve',
       'Carlos',
       'Ramirez',
       'CLIENTE',
       0,
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP,
       0
FROM DUAL;

INSERT IGNORE INTO usuario (
    uuid_usuario,
    email,
    password_hash,
    nombres,
    apellidos,
    rol_sistema,
    is_deleted,
    created_at,
    updated_at,
    version
)
SELECT 'c58c4216-456e-4632-9dd4-2ea976160005',
       'admin@cremissimo.test',
       '$2a$10$deyeCWovBKQlI3sgGDJOPeWRFbHc/xi8mHKNuRdEeXGAYre3/UYve',
       'Administrador',
       'Cremissimo',
       'ADMIN',
       0,
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP,
       0
FROM DUAL;

INSERT IGNORE INTO cliente (id_usuario, dni, telefono)
SELECT id_usuario, '12345678', '987654321'
FROM usuario
WHERE email = 'ana.garcia@cremissimo.test'
  AND rol_sistema = 'CLIENTE';

INSERT IGNORE INTO cliente (id_usuario, dni, telefono)
SELECT id_usuario, '87654321', '986543210'
FROM usuario
WHERE email = 'luis.torres@cremissimo.test'
  AND rol_sistema = 'CLIENTE';

INSERT IGNORE INTO cliente (id_usuario, dni, telefono)
SELECT id_usuario, '23456789', '985432109'
FROM usuario
WHERE email = 'maria.lopez@cremissimo.test'
  AND rol_sistema = 'CLIENTE';

INSERT IGNORE INTO cliente (id_usuario, dni, telefono)
SELECT id_usuario, '34567890', '984321098'
FROM usuario
WHERE email = 'carlos.ramirez@cremissimo.test'
  AND rol_sistema = 'CLIENTE';

INSERT IGNORE INTO administrador (id_usuario, nivel_acceso, ultimo_acceso)
SELECT id_usuario, 'SUPERADMIN', NULL
FROM usuario
WHERE email = 'admin@cremissimo.test'
  AND rol_sistema = 'ADMIN';
