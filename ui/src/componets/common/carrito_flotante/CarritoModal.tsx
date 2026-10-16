import { useEffect, useState } from 'react'
import type { Producto } from '../../productos/ProductoCard'
import './carrito_modal.css'

interface Props {
  abierto: boolean
  carrito: Producto[]
  onCerrar: () => void
  onEliminar: (producto: Producto) => void
  onReducir: (producto: Producto) => void
}

interface LineaCarrito {
  producto: Producto
  cantidad: number
}

function agruparProductos(carrito: Producto[]): LineaCarrito[] {
  const lineas = new Map<string, LineaCarrito>()

  for (const producto of carrito) {
    const llave = `${producto.id}:${producto.sabor}`
    const linea = lineas.get(llave)
    if (linea) linea.cantidad += 1
    else lineas.set(llave, { producto, cantidad: 1 })
  }

  return Array.from(lineas.values())
}

export default function CarritoModal({ abierto, carrito, onCerrar, onEliminar, onReducir }: Props) {
  const [visible, setVisible] = useState(abierto)

  useEffect(() => {
    if (abierto) {
      setVisible(true)
      return
    }

    const temporizador = window.setTimeout(() => setVisible(false), 260)
    return () => window.clearTimeout(temporizador)
  }, [abierto])

  if (!visible) return null

  const lineas = agruparProductos(carrito)
  const subtotal = carrito.reduce((suma, producto) => suma + producto.precio, 0)

  return (
    <div
      className={`carrito-backdrop ${abierto ? 'is-open' : 'is-closing'}`}
      aria-hidden={!abierto}
      inert={!abierto}
      onClick={() => { if (abierto) onCerrar() }}
    >
      <aside className="carrito-panel" onClick={(event) => event.stopPropagation()} aria-label="Carrito de compras">
        <div className="carrito-header">
          <div>
            <h2>Tu carrito</h2>
            <p>{carrito.length} {carrito.length === 1 ? 'unidad' : 'unidades'} · {lineas.length} {lineas.length === 1 ? 'producto' : 'productos'}</p>
          </div>
          <button onClick={onCerrar} aria-label="Cerrar carrito">✕</button>
        </div>

        {carrito.length === 0 ? (
          <p className="carrito-vacio">Todavía no agregaste productos. Explora el catálogo para elegir algo delicioso.</p>
        ) : (
          <>
            <div className="carrito-items">
              {lineas.map(({ producto, cantidad }) => (
                <article className="carrito-item" key={`${producto.id}-${producto.sabor}`}>
                  <img src={producto.imagen} alt={producto.nombre} />
                  <div className="carrito-item-info">
                    <strong>{producto.nombre}</strong>
                    <small>{producto.sabor}</small>
                    <span className="carrito-precio-unitario">S/ {producto.precio.toFixed(2)} c/u</span>
                    <div className="carrito-linea-acciones">
                      <div className="carrito-cantidad" aria-label={`Cantidad: ${cantidad}`}>
                        <button type="button" onClick={() => onReducir(producto)} aria-label={`Reducir cantidad de ${producto.nombre}`}>−</button>
                        <span>{cantidad}</span>
                        <span className="carrito-cantidad-sufijo">unid.</span>
                      </div>
                      <button className="carrito-eliminar" type="button" onClick={() => onEliminar(producto)}>Eliminar</button>
                    </div>
                  </div>
                  <strong className="carrito-subtotal-linea">S/ {(producto.precio * cantidad).toFixed(2)}</strong>
                </article>
              ))}
            </div>

            <div className="carrito-resumen">
              <div><span>Subtotal ({carrito.length} {carrito.length === 1 ? 'unidad' : 'unidades'})</span><strong>S/ {subtotal.toFixed(2)}</strong></div>
              <p>El costo de envío y el total final se calcularán al continuar con la compra.</p>
              <button className="carrito-seguir-comprando" type="button" onClick={onCerrar}>Seguir comprando</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
