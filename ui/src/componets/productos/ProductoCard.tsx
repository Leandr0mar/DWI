import './producto_card.css'
import { Link } from 'react-router-dom'

export interface Producto {
  id: number
  nombre: string
  sabor: string
  precio: number
  imagen: string
  stockDisponible?: number
}

export interface ProductoCatalogo extends Producto {
  uuid: string
  categoria: string
  stockDisponible: number
  descripcion: string | null
  pesoVolumen: string | null
  tipoPresentacion: string | null
  precioOriginal?: number
  porcentajeDescuento?: number | null
  nombreOferta?: string | null
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
        {producto.porcentajeDescuento != null && <span className="producto-oferta-badge">-{producto.porcentajeDescuento}%</span>}
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
          <span className="producto-precio-grupo">
            {producto.precioOriginal != null && producto.porcentajeDescuento != null && <del className="producto-precio-original">{`S/. ${producto.precioOriginal.toFixed(2)}`}</del>}
            <strong className="producto-precio">S/. {producto.precio.toFixed(2)}</strong>
            <small className="producto-precio-igv">IGV incluido</small>
          </span>
          <span className={`producto-disponibilidad${producto.stockDisponible > 0 ? '' : ' agotado'}`}>
            <span aria-hidden="true">●</span> {producto.stockDisponible > 0 ? 'Disponible' : 'Agotado'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductoCard
