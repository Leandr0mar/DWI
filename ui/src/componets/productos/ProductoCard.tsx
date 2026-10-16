import './producto_card.css'
import { Link } from 'react-router-dom'

export interface Producto {
  id: number
  nombre: string
  sabor: string
  precio: number
  imagen: string
}

export interface ProductoCatalogo extends Producto {
  uuid: string
  categoria: string
  stockDisponible: number
  descripcion: string | null
  pesoVolumen: string | null
  tipoPresentacion: string | null
}

interface Props {
  producto: ProductoCatalogo
}

function ProductoCard({ producto }: Props) {
  return (
    <Link
      to={`/productos/${encodeURIComponent(producto.uuid)}`}
      className="producto-card"
      aria-label={`Ver detalles de ${producto.nombre}`}
    >
      <div className="producto-imagen-wrapper">
        <img className="producto-imagen" src={producto.imagen} alt={producto.nombre} loading="lazy" />
        <span className="producto-categoria">{producto.categoria || 'Catálogo'}</span>
      </div>
      <div className="producto-info">
        <h3>{producto.nombre}</h3>
        {producto.descripcion && <p className="producto-descripcion">{producto.descripcion}</p>}
        <p className="producto-sabor"><strong>Sabores:</strong> {producto.sabor}</p>
        <div className="producto-atributos">
          {producto.tipoPresentacion && <span>{producto.tipoPresentacion}</span>}
          {producto.pesoVolumen && <span>{producto.pesoVolumen}</span>}
        </div>
        <div className="producto-footer">
          <strong className="producto-precio">S/. {producto.precio.toFixed(2)}</strong>
          <span className={`producto-disponibilidad${producto.stockDisponible > 0 ? '' : ' agotado'}`}>
            <span aria-hidden="true">●</span> {producto.stockDisponible > 0 ? 'Disponible' : 'Agotado'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductoCard
