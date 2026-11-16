import { ArrowLeft, ArrowRight, ShieldCheck, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { agruparProductos, calcularSubtotal } from '../../componets/common/carrito_flotante/cart-utils'
import { useLayout } from '../../componets/common/layout/Layout'
import './carrito.css'

export default function CarritoPage() {
  const { carrito, agregarAlCarrito, eliminarDelCarrito, reducirCantidad, vaciarCarrito } = useLayout()
  const lineas = agruparProductos(carrito)
  const subtotal = calcularSubtotal(carrito)
  const cantidadProductos = lineas.length
  const cantidadUnidades = carrito.length

  if (carrito.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <nav className="cart-breadcrumb" aria-label="Ruta de navegación">
            <Link to="/inicio">Inicio</Link><span>/</span><span>Carrito</span>
          </nav>
          <section className="cart-empty">
            <div className="cart-empty-icon"><ShoppingBag size={32} /></div>
            <span className="cart-eyebrow">TU SELECCIÓN CREMISSIMO</span>
            <h1>Tu carrito está esperando algo rico</h1>
            <p>Explora nuestros helados artesanales y encuentra tu próximo sabor favorito.</p>
            <Link className="cart-primary-link" to="/productos">Explorar productos <ArrowRight size={17} /></Link>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <nav className="cart-breadcrumb" aria-label="Ruta de navegación">
          <Link to="/inicio">Inicio</Link><span>/</span><Link to="/productos">Productos</Link><span>/</span><span>Carrito</span>
        </nav>

        <header className="cart-heading">
          <div>
            <span className="cart-eyebrow">TU SELECCIÓN CREMISSIMO</span>
            <h1>Tu carrito</h1>
            <p>{cantidadUnidades} {cantidadUnidades === 1 ? 'unidad' : 'unidades'} en {cantidadProductos} {cantidadProductos === 1 ? 'producto' : 'productos'}</p>
          </div>
          <button className="cart-clear-button" type="button" onClick={vaciarCarrito}>
            <Trash2 size={16} /> Vaciar carrito
          </button>
        </header>

        <div className="cart-layout">
          <section className="cart-items-panel" aria-labelledby="cart-items-title">
            <div className="cart-panel-heading">
              <div>
                <h2 id="cart-items-title">Productos seleccionados</h2>
                <p>Revisa las cantidades y sabores antes de continuar.</p>
              </div>
              <span>{cantidadUnidades} {cantidadUnidades === 1 ? 'unidad' : 'unidades'}</span>
            </div>

            <div className="cart-items-list">
              {lineas.map(({ producto, cantidad }) => (
                <article className="cart-item" key={`${producto.id}-${producto.sabor}`}>
                  <img className="cart-item-image" src={producto.imagen} alt={producto.nombre} />
                  <div className="cart-item-details">
                    <div className="cart-item-heading">
                      <div>
                        <h3>{producto.nombre}</h3>
                        <p><span>Sabor:</span> {producto.sabor}</p>
                      </div>
                      <strong className="cart-item-total">S/ {(producto.precio * cantidad).toFixed(2)}</strong>
                    </div>
                    <div className="cart-item-controls">
                      <div className="cart-quantity-control" aria-label={`Cantidad de ${producto.nombre}`}>
                        <button
                          type="button"
                          aria-label={`Reducir cantidad de ${producto.nombre}`}
                          onClick={() => reducirCantidad(producto)}
                        >
                          −
                        </button>
                        <span aria-live="polite">{cantidad}</span>
                        <button
                          type="button"
                          aria-label={`Aumentar cantidad de ${producto.nombre}`}
                          onClick={() => agregarAlCarrito(producto)}
                        >
                          +
                        </button>
                      </div>
                      <span className="cart-unit-price">S/ {producto.precio.toFixed(2)} c/u</span>
                      <button
                        className="cart-remove-button"
                        type="button"
                        onClick={() => eliminarDelCarrito(producto)}
                        aria-label={`Eliminar ${producto.nombre} del carrito`}
                      >
                        <Trash2 size={15} /> Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <Link className="cart-continue-shopping" to="/productos"><ArrowLeft size={16} /> Seguir comprando</Link>
          </section>

          <aside className="cart-summary-panel" aria-labelledby="cart-summary-title">
            <h2 id="cart-summary-title">Resumen de compra</h2>
            <p className="cart-summary-caption">Un último vistazo a tu selección.</p>
            <div className="cart-summary-lines">
              <div><span>Productos ({cantidadUnidades})</span><strong>S/ {subtotal.toFixed(2)}</strong></div>
              <div><span>Envío</span><span className="cart-summary-pending">Se calcula después</span></div>
            </div>
            <div className="cart-summary-total">
              <span>Subtotal</span>
              <strong>S/ {subtotal.toFixed(2)}</strong>
            </div>
            <p className="cart-summary-note">El costo de envío y el total final se confirmarán en el siguiente paso.</p>
            <Link className="cart-checkout-button" to="/checkout">
              Continuar al pago <ArrowRight size={17} />
            </Link>
            <div className="cart-benefits">
              <div><Truck size={17} /><span>Entrega coordinada en el siguiente paso</span></div>
              <div><ShieldCheck size={17} /><span>Tu pedido se confirma antes del pago</span></div>
            </div>
            <div className="cart-checkout-placeholder">La selección se mantiene mientras exploras la tienda.</div>
          </aside>
        </div>
      </div>
    </div>
  )
}
