import './producto_card.css'

export interface Producto {
  id: number
  nombre: string
  sabor: string
  precio: number
  imagen: string
}

interface Props {
  producto: Producto
  onAgregar: (producto: Producto) => void
}

function ProductoCard({ producto, onAgregar }: Props) {
  return (
    <article className="producto-card">
      <img className="producto-imagen" src={producto.imagen} alt={producto.nombre} loading="lazy" />
      <div className="producto-info">
        <h3>{producto.nombre}</h3>
        <p className="producto-sabor">Sabor: {producto.sabor}</p>
        <div className="producto-footer">
          <strong className="producto-precio">S/. {producto.precio.toFixed(2)}</strong>
          <button className="btn-agregar" onClick={() => onAgregar(producto)}>
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductoCard