import type { Producto } from '../productos/producto_card.tsx'
import './carrito_modal.css'

interface Props {
  abierto: boolean
  carrito: Producto[]
  onCerrar: () => void
}

export default function CarritoModal({ abierto, carrito, onCerrar }: Props) {
  if (!abierto) return null

  const total = carrito.reduce((suma, producto) => suma + producto.precio, 0)

  return (
    <div className="carrito-backdrop" onClick={onCerrar}>
      <aside className="carrito-panel" onClick={(e) => e.stopPropagation()}>
        <div className="carrito-header">
          <h2>Tu carrito</h2>
          <button onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>

        {carrito.length === 0 ? (
          <p className="carrito-vacio">Todavía no agregaste helados.</p>
        ) : (
          <>
            <div className="carrito-items">
              {carrito.map((producto, index) => (
                <div className="carrito-item" key={`${producto.id}-${index}`}>
                  <img src={producto.imagen} alt={producto.nombre} />
                  <div>
                    <strong>{producto.nombre}</strong>
                    <small>S/. {producto.precio.toFixed(2)}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="carrito-total">
              <span>Total</span>
              <strong>S/. {total.toFixed(2)}</strong>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}