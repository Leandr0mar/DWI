create database cremissimo;
use cremissimo; 

INSERT INTO sabores (id, nombre, descripcion, activo) VALUES
(1, 'Vainilla Bourbon de Madagascar', 'Infusión natural de vainas de Madagascar con crema fresca.', 1),
(2, 'Chocolate Belga 70%', 'Cacao puro belga de origen sostenible con notas tostadas.', 1),
(3, 'Fresa Silvestre', 'Fresas naturales de huerto con toque cítrico equilibrado.', 1),
(4, 'Pistacho de Bronte', 'Pistachos tostados italianos molidos a la piedra.', 1),
(5, 'Dulce de Leche Repostero', 'Elaboración tradicional lenta con leche entera caramelizada.', 1),
(6, 'Mango y Maracuyá', 'Mix tropical a base de agua con pulpa fresca y ácida.', 1),
(7, 'Café Espresso Arábica', 'Extracción directa de granos tostados 100% arábica.', 1),
(8, 'Menta Granizada', 'Hojas de menta fresca infusionadas con chips de chocolate amargo.', 1),
(9, 'Avellana Piamonte', 'Crema artesanal de avellanas europeas tostadas.', 1),
(10, 'Frutos del Bosque', 'Frambuesas, moras y arándanos silvestres.', 1),
(11, 'Caramelo Salado', 'Toffee de mantequilla con escamas de sal marina.', 1),
(12, 'Limón Siciliano', 'Sorbet refrescante elaborado con limones mediterráneos.', 1),
(13, 'Coco Tostado', 'Leche de coco cremosa con ralladura tostada a fuego lento.', 1),
(14, 'Maracuyá Puro', 'Sorbet cítrico e intenso de maracuyá seleccionado.', 1),
(15, 'Stracciatella Clásica', 'Base láctea suave con hilos crujientes de chocolate fundido.', 1);

INSERT INTO helados (id, nombre, precio, descripcion, stock, url_imagen, estado, categoria, peso_volumen, tipo_presentacion, es_personalizable, max_sabores, fecha_creacion, fecha_actualizacion) VALUES
(1, 'Cono Vainilla Real', 6.50, 'Bola de vainilla Bourbon pura servida en barquillo crocante.', 30, 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800', 'ACTIVO', 'Clásicos', '120 g', 'CONO', 0, 1, NOW(), NOW()),
(2, 'Vaso Chocolate Supremo', 7.00, 'Helado intenso de chocolate belga con textura ultra cremosa.', 25, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800', 'ACTIVO', 'Gourmet', '140 g', 'VASO', 0, 1, NOW(), NOW()),
(3, 'Paleta Fresa Silvestre', 5.50, 'Paleta artesanal elaborada con trozos de fresa entera.', 40, 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=800', 'ACTIVO', 'Frutales', '90 g', 'PALETA', 0, 1, NOW(), NOW()),
(4, 'Copa Pistacho Sublime', 9.50, 'Elaborado con auténtica pasta de pistacho siciliano.', 18, 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800', 'ACTIVO', 'Premium', '160 g', 'COPA', 0, 1, NOW(), NOW()),
(5, 'Tarrina Dulce de Leche', 7.50, 'El sabor tradicional argentino con vetas de manjar artesanal.', 35, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800', 'ACTIVO', 'Tradicional', '150 g', 'VASO', 0, 1, NOW(), NOW()),
(6, 'Sorbet Mango & Pasión', 6.00, 'Sorbet frutal a base de agua, 100% natural y sin lactosa.', 22, 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800', 'ACTIVO', 'Sorbetes', '130 g', 'VASO', 0, 1, NOW(), NOW()),
(7, 'Vaso Espresso Italiano', 7.20, 'Para amantes del café concentrado de tueste medio.', 20, 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=800', 'ACTIVO', 'Gourmet', '130 g', 'VASO', 0, 1, NOW(), NOW()),
(8, 'Cono Menta & Choco Crispy', 6.80, 'Frescura herbal combinada con escamas crocantes de chocolate.', 28, 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=800', 'ACTIVO', 'Especiales', '125 g', 'CONO', 0, 1, NOW(), NOW()),
(9, 'Copa Nocciola Piamontesa', 9.00, 'Avellana europea pura emulsionada con leche entera.', 15, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800', 'ACTIVO', 'Premium', '160 g', 'COPA', 0, 1, NOW(), NOW()),
(10, 'Paleta Berries Silvestres', 5.80, 'Frutos rojos enteros seleccionados y congelados al instante.', 30, 'https://7diasdesabor.com/wp-content/uploads/2023/06/7DDS_WEB6.png', 'ACTIVO', 'Frutales', '95 g', 'PALETA', 0, 1, NOW(), NOW()),
(11, 'Vaso Caramelo Toffee & Sal', 7.80, 'Caramelo fundido lentamente con un toque de flor de sal.', 26, 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800', 'ACTIVO', 'Gourmet', '140 g', 'VASO', 0, 1, NOW(), NOW()),
(12, 'Cono Limone Di Sicilia', 6.00, 'Cítrico, ligero, digestivo y altamente refrescante.', 32, 'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?w=800', 'ACTIVO', 'Sorbetes', '120 g', 'CONO', 0, 1, NOW(), NOW()),
(13, 'Tarrina Coco Criollo', 7.00, 'Pura pulpa de coco fresco infusionada sin colorantes.', 24, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800', 'ACTIVO', 'Tradicional', '140 g', 'VASO', 0, 1, NOW(), NOW()),
(14, 'Paleta Maracuyá Refrescante', 5.50, 'Acidez perfecta y natural con pepitas deshidratadas.', 38, 'https://images.unsplash.com/photo-1534706936160-d5ee67737249?w=800', 'ACTIVO', 'Frutales', '90 g', 'PALETA', 0, 1, NOW(), NOW()),
(15, 'Barra Stracciatella', 8.50, 'Nata pura campesina cruzada con lajas finas de chocolate amargo.', 16, 'https://http2.mlstatic.com/D_NQ_NP_601851-MCO112765666273_062026-O.webp', 'ACTIVO', 'Clásicos', '170 g', 'BARRA', 0, 1, NOW(), NOW()),
(16, 'Dúo Cono Artesanal', 11.50, 'Barquillo artesanal crujiente: selecciona 2 bolas de sabores.', 50, 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800', 'ACTIVO', 'Personalizables', '220 g', 'CONO', 1, 2, NOW(), NOW()),
(17, 'Copa Trilogía Cremissimo', 15.00, 'Copa de cristal clásica: combina hasta 3 sabores a elección.', 40, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800', 'ACTIVO', 'Personalizables', '300 g', 'COPA', 1, 3, NOW(), NOW()),
(18, 'Vaso Mediano Bi-Sabor', 10.00, 'Porción perfecta para dos gustos contrastantes en vaso térmico.', 45, 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=800', 'ACTIVO', 'Personalizables', '200 g', 'VASO', 1, 2, NOW(), NOW()),
(19, 'Tarrina Familiar 1 Litro', 32.00, 'Presentación de 1 Litro: escoge hasta 4 sabores de nuestra vitrina.', 25, 'https://tofuu.getjusto.com/orioneat-local/resized2/MWm8zgP4zKkSc4HKX-300-x.webp', 'ACTIVO', 'Personalizables', '1000 ml', 'LITRO', 1, 4, NOW(), NOW()),
(20, 'Copa Degustación Especial', 18.50, 'Presentación festiva para maridar 3 sabores con toppings.', 20, 'https://multisaba.com.pe/wp-content/uploads/2024/09/90050629.webp', 'ACTIVO', 'Personalizables', '350 g', 'COPA', 1, 3, NOW(), NOW());

INSERT INTO helado_sabores (id_helado, id_sabor) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15),
-- Sugerencias iniciales para los mixes (se pueden sustituir en frontend si es_personalizable = 1):
(16, 1), (16, 2),        -- Dúo Cono: Vainilla y Chocolate
(17, 3), (17, 4), (17, 5), -- Trilogía: Fresa, Pistacho y Dulce de Leche
(18, 6), (18, 12),       -- Vaso Bi-Sabor: Mango y Limón
(19, 1), (19, 2), (19, 9), (19, 11), -- 1 Litro: Vainilla, Chocolate, Avellana y Caramelo Salado
(20, 4), (20, 8), (20, 15); -- Degustación: Pistacho, Menta y Stracciatella


