-- Datos iniciales del catálogo para una instalación nueva.
-- Las instalaciones existentes se marcan como línea base y no ejecutan esta versión.

-- 1. INSERTAR CATEGORÍAS (Se mantiene igual)
INSERT INTO categoria (id_categoria, nombre, estado, is_deleted, created_at, updated_at, version) VALUES
(1, 'Clásicos', 1, 0, NOW(), NOW(), 0),
(2, 'Gourmet', 1, 0, NOW(), NOW(), 0),
(3, 'Frutales', 1, 0, NOW(), NOW(), 0),
(4, 'Premium', 1, 0, NOW(), NOW(), 0),
(5, 'Tradicional', 1, 0, NOW(), NOW(), 0),
(6, 'Sorbetes', 1, 0, NOW(), NOW(), 0),
(7, 'Especiales', 1, 0, NOW(), NOW(), 0),
(8, 'Personalizables', 1, 0, NOW(), NOW(), 0);

-- 2. INSERTAR SABORES (Se mantiene igual)
INSERT INTO sabor (id_sabor, nombre, color_hex, estado_disponibilidad, is_deleted, created_at, updated_at, version) VALUES
(1, 'Vainilla Bourbon de Madagascar', '#F3E5AB', 1, 0, NOW(), NOW(), 0),
(2, 'Chocolate Belga 70%', '#4A2511', 1, 0, NOW(), NOW(), 0),
(3, 'Fresa Silvestre', '#E84D60', 1, 0, NOW(), NOW(), 0),
(4, 'Pistacho de Bronte', '#93C572', 1, 0, NOW(), NOW(), 0),
(5, 'Dulce de Leche Repostero', '#D4A373', 1, 0, NOW(), NOW(), 0),
(6, 'Mango y Maracuyá', '#FFC857', 1, 0, NOW(), NOW(), 0),
(7, 'Café Espresso Arábica', '#3B2F2F', 1, 0, NOW(), NOW(), 0),
(8, 'Menta Granizada', '#98FF98', 1, 0, NOW(), NOW(), 0),
(9, 'Avellana Piamonte', '#BCA88E', 1, 0, NOW(), NOW(), 0),
(10, 'Frutos del Bosque', '#5B1E3E', 1, 0, NOW(), NOW(), 0),
(11, 'Caramelo Salado', '#C68E17', 1, 0, NOW(), NOW(), 0),
(12, 'Limón Siciliano', '#FFFDD0', 1, 0, NOW(), NOW(), 0),
(13, 'Coco Tostado', '#F5F5DC', 1, 0, NOW(), NOW(), 0),
(14, 'Maracuyá Puro', '#FCA311', 1, 0, NOW(), NOW(), 0),
(15, 'Stracciatella Clásica', '#FFFAFA', 1, 0, NOW(), NOW(), 0);

-- 3. INSERTAR PRODUCTOS (ACTUALIZADO CON IMAGEN, PESO Y PRESENTACIÓN)
-- Columnas agregadas: peso_volumen, tipo_presentacion, url_imagen
INSERT INTO producto (id_producto, uuid_producto, sku, nombre, descripcion, precio_base, peso_volumen, tipo_presentacion, url_imagen, max_sabores, stock_disponible, id_categoria, is_deleted, created_at, updated_at, version) VALUES
(1, UUID(), 'HEL-001', 'Cono Vainilla Real', 'Bola de vainilla Bourbon pura servida en barquillo crocante.', 6.50, '120 g', 'CONO', 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800', 1, 30, 1, 0, NOW(), NOW(), 0),
(2, UUID(), 'HEL-002', 'Vaso Chocolate Supremo', 'Helado intenso de chocolate belga con textura ultra cremosa.', 7.00, '140 g', 'VASO', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800', 1, 25, 2, 0, NOW(), NOW(), 0),
(3, UUID(), 'HEL-003', 'Paleta Fresa Silvestre', 'Paleta artesanal elaborada con trozos de fresa entera.', 5.50, '90 g', 'PALETA', 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=800', 1, 40, 3, 0, NOW(), NOW(), 0),
(4, UUID(), 'HEL-004', 'Copa Pistacho Sublime', 'Elaborado con auténtica pasta de pistacho siciliano.', 9.50, '160 g', 'COPA', 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800', 1, 18, 4, 0, NOW(), NOW(), 0),
(5, UUID(), 'HEL-005', 'Tarrina Dulce de Leche', 'El sabor tradicional argentino con vetas de manjar artesanal.', 7.50, '150 g', 'VASO', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800', 1, 35, 5, 0, NOW(), NOW(), 0),
(6, UUID(), 'HEL-006', 'Sorbet Mango & Pasión', 'Sorbet frutal a base de agua, 100% natural y sin lactosa.', 6.00, '130 g', 'VASO', 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800', 1, 22, 6, 0, NOW(), NOW(), 0),
(7, UUID(), 'HEL-007', 'Vaso Espresso Italiano', 'Para amantes del café concentrado de tueste medio.', 7.20, '130 g', 'VASO', 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=800', 1, 20, 2, 0, NOW(), NOW(), 0),
(8, UUID(), 'HEL-008', 'Cono Menta & Choco Crispy', 'Frescura herbal combinada con escamas crocantes de chocolate.', 6.80, '125 g', 'CONO', 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=800', 1, 28, 7, 0, NOW(), NOW(), 0),
(9, UUID(), 'HEL-009', 'Copa Nocciola Piamontesa', 'Avellana europea pura emulsionada con leche entera.', 9.00, '160 g', 'COPA', 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800', 1, 15, 4, 0, NOW(), NOW(), 0),
(10, UUID(), 'HEL-010', 'Paleta Berries Silvestres', 'Frutos rojos enteros seleccionados y congelados al instante.', 5.80, '95 g', 'PALETA', 'https://7diasdesabor.com/wp-content/uploads/2023/06/7DDS_WEB6.png', 1, 30, 3, 0, NOW(), NOW(), 0),
(11, UUID(), 'HEL-011', 'Vaso Caramelo Toffee & Sal', 'Caramelo fundido lentamente con un toque de flor de sal.', 7.80, '140 g', 'VASO', 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800', 1, 26, 2, 0, NOW(), NOW(), 0),
(12, UUID(), 'HEL-012', 'Cono Limone Di Sicilia', 'Cítrico, ligero, digestivo y altamente refrescante.', 6.00, '120 g', 'CONO', 'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?w=800', 1, 32, 6, 0, NOW(), NOW(), 0),
(13, UUID(), 'HEL-013', 'Tarrina Coco Criollo', 'Pura pulpa de coco fresco infusionada sin colorantes.', 7.00, '140 g', 'VASO', 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800', 1, 0, 5, 0, NOW(), NOW(), 0),
(14, UUID(), 'HEL-014', 'Paleta Maracuyá Refrescante', 'Acidez perfecta y natural con pepitas deshidratadas.', 5.50, '90 g', 'PALETA', 'https://images.unsplash.com/photo-1534706936160-d5ee67737249?w=800', 1, 38, 3, 0, NOW(), NOW(), 0),
(15, UUID(), 'HEL-015', 'Barra Stracciatella', 'Nata pura campesina cruzada con lajas finas de chocolate amargo.', 8.50, '170 g', 'BARRA', 'https://http2.mlstatic.com/D_NQ_NP_601851-MCO112765666273_062026-O.webp', 1, 16, 1, 0, NOW(), NOW(), 0),
(16, UUID(), 'HEL-016', 'Dúo Cono Artesanal', 'Barquillo artesanal crujiente: selecciona 2 bolas de sabores.', 11.50, '220 g', 'CONO', 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800', 2, 50, 8, 0, NOW(), NOW(), 0),
(17, UUID(), 'HEL-017', 'Copa Trilogía Cremissimo', 'Copa de cristal clásica: combina hasta 3 sabores a elección.', 15.00, '300 g', 'COPA', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800', 3, 40, 8, 0, NOW(), NOW(), 0),
(18, UUID(), 'HEL-018', 'Vaso Mediano Bi-Sabor', 'Porción perfecta para dos gustos contrastantes en vaso térmico.', 10.00, '200 g', 'VASO', 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=800', 2, 45, 8, 0, NOW(), NOW(), 0),
(19, UUID(), 'HEL-019', 'Tarrina Familiar 1 Litro', 'Presentación de 1 Litro: escoge hasta 4 sabores de nuestra vitrina.', 32.00, '1000 ml', 'LITRO', 'https://tofuu.getjusto.com/orioneat-local/resized2/MWm8zgP4zKkSc4HKX-300-x.webp', 4, 25, 8, 0, NOW(), NOW(), 0),
(20, UUID(), 'HEL-020', 'Copa Degustación Especial', 'Presentación festiva para maridar 3 sabores con toppings.', 18.50, '350 g', 'COPA', 'https://multisaba.com.pe/wp-content/uploads/2024/09/90050629.webp', 3, 20, 8, 0, NOW(), NOW(), 0);

-- 4. INSERTAR RELACIÓN MUCHOS A MUCHOS (producto_sabor)
INSERT INTO producto_sabor (id_producto, id_sabor) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5),
(6, 6), (7, 7), (8, 8), (9, 9), (10, 10),
(11, 11), (12, 12), (13, 13), (14, 14), (15, 15),
(16, 1), (16, 2),
(17, 3), (17, 4), (17, 5),
(18, 6), (18, 12),
(19, 1), (19, 2), (19, 9), (19, 11),
(20, 4), (20, 8), (20, 15);
