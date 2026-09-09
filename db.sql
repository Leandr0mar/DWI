##create database cremissimo;

use cremissimo; 

INSERT INTO sabores (id, nombre, descripcion, activo) VALUES
(1, 'Vainilla Bourbon', 'Extracto natural de vainas de vainilla Bourbon de Madagascar.', 1),
(2, 'Fresa Silvestre', 'Pulpa 100% natural de fresas silvestres seleccionadas.', 1),
(3, 'Chocolate Belga', 'Cacao oscuro al 70% de origen belga con toques amargos.', 1),
(4, 'Dulce de Leche Repostero', 'Dulce de leche tradicional de cocción lenta.', 1),
(5, 'Menta Granizada', 'Infusión de menta verde con trozos crocantes de chocolate.', 1);

INSERT INTO helados (
    nombre, 
    precio, 
    descripcion, 
    stock, 
    url_imagen, 
    estado, 
    categoria, 
    peso_volumen, 
    tipo_presentacion, 
    sabor_id, 
    fecha_creacion, 
    fecha_actualizacion
) VALUES 
(
    'Copa Clásica de Vainilla', 
    4.50, 
    'Helado artesanal a base de crema pura con infusión de vainilla Bourbon.', 
    35, 
    'https://cdn.example.com/imagenes/helados/copa-vainilla.png', 
    'ACTIVO', 
    'Artesanal', 
    '150 ml', 
    'COPA', 
    1, 
    NOW(), 
    NOW()
),
(
    'Paleta de Fresa Salvaje', 
    3.00, 
    'Paleta de agua elaborada con trozos reales de fresa seleccionada.', 
    50, 
    'https://cdn.example.com/imagenes/helados/paleta-fresa.png', 
    'ACTIVO', 
    'Frutales', 
    '90 g', 
    'PALETA', 
    2, 
    NOW(), 
    NOW()
),
(
    'Cono Doble Chocolate Belga', 
    6.20, 
    'Intenso helado de chocolate 70% cacao servido en barquillo crocante.', 
    20, 
    'https://cdn.example.com/imagenes/helados/cono-chocolate.png', 
    'ACTIVO', 
    'Premium', 
    '180 g', 
    'CONO', 
    3, 
    NOW(), 
    NOW()
),
(
    'Envase Familiar de Dulce de Leche', 
    18.90, 
    'Envase familiar con veteado natural de caramelo y dulce de leche.', 
    15, 
    'https://cdn.example.com/imagenes/helados/litro-dulcedeleche.png', 
    'ACTIVO', 
    'Familiar', 
    '1 L', 
    'LITRO', 
    4, 
    NOW(), 
    NOW()
),
(
    'Barra Helada Menta Granizada', 
    4.00, 
    'Barra de helado de menta con chips crocantes de chocolate oscuro.', 
    0, 
    'https://cdn.example.com/imagenes/helados/barra-menta.png', 
    'INACTIVO', 
    'Snacks', 
    '110 g', 
    'BARRA', 
    5, 
    NOW(), 
    NOW()
);