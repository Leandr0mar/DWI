import ProductoCard, { type Producto } from './producto_card.tsx'
import './productos.css'

interface Props {
  onAgregar: (producto: Producto) => void
}

const productos: Producto[] = [
  ['Vainilla Clásica', 'Vainilla', 3.2, '1563805042-7684c019e1cb'],
  ['Chocolate Intenso', 'Chocolate', 3.2, '1570197788417-0e82375c9371'],
  ['Fresa Natural', 'Fresa', 3.5, '1557142046-c704a3adf364'],
  ['Cono Clásico', 'Mixto', 4.5, '1497034825429-c343d7c6a68f'],
  ['Menta Chip', 'Menta', 3.8, '1501443762994-82bd5dace89a'],
  ['Mango Tropical', 'Tropical', 3.6, '1551024506-0bccd828d307'],
  ['Caramelo Salado', 'Caramelo', 3.9, '1579954115545-a95591f28bfc'],
  ['Blueberry Burst', 'Arándano', 3.7, '1560008581-09826d1de69e'],
  ['Coco Cremoso', 'Coco', 3.5, '1497034825429-c343d7c6a68f'],
  ['Pistacho Italiano', 'Pistacho', 4.1, '1567206563064-6f60f40a2b57'],
  ['Cookies & Cream', 'Galleta', 4.0, '1570197788417-0e82375c9371'],
  ['Frutos Rojos', 'Frutos rojos', 4.2, '1501443762994-82bd5dace89a'],
  ['Limón Refrescante', 'Limón', 3.4, '1560008581-09826d1de69e'],
  ['Dulce de Leche', 'Manjar', 3.9, '1551024506-0bccd828d307'],
  ['Maracuyá Tropical', 'Maracuyá', 3.6, '1557142046-c704a3adf364'],
  ['Café Cremoso', 'Café', 4.0, '1563805042-7684c019e1cb'],
  ['Choco Avellana', 'Avellana', 4.3, '1570197788417-0e82375c9371'],
  ['Frambuesa', 'Frambuesa', 3.8, '1501443762994-82bd5dace89a'],
  ['Chocolate Blanco', 'Chocolate blanco', 4.2, '1497034825429-c343d7c6a68f'],
  ['Rainbow Mix', 'Mix de sabores', 4.5, '1567206563064-6f60f40a2b57'],
].map(([nombre, sabor, precio, id]) => ({
  id: Number(productosId(id as string, nombre as string)),
  nombre: nombre as string,
  sabor: sabor as string,
  precio: precio as number,
  imagen: `https://images.unsplash.com/photo-${id as string}?auto=format&fit=crop&w=700&q=80`,
}))

function productosId(seed: string, nombre: string) {
  const n = Array.from(seed + nombre).reduce((a, c) => a + c.charCodeAt(0), 0)
  return n
}

function Productos({ onAgregar }: Props) {
  return (
    <section className="productos-section" id="productos">
      <div className="productos-titulo">
        <span className="catalogo">🍦 Catálogo Completo</span>
        <h2>Todos Nuestros Sabores</h2>
        <p>Más de 20 sabores artesanales para todos los gustos. ¿Cuál es tu favorito?</p>
      </div>

      <div className="productos-grid">
        {productos.map((producto, index) => (
          <ProductoCard key={`${producto.id}-${index}`} producto={{ ...producto, id: index + 1 }} onAgregar={onAgregar} />
        ))}
      </div>
    </section>
  )
}

export default Productos