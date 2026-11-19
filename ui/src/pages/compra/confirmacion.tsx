import { CheckCircle2, ShoppingBag } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import type { PurchaseConfirmationData } from './checkout'
import './checkout.css'

function isPurchaseConfirmation(value: unknown): value is PurchaseConfirmationData {
  if (typeof value !== 'object' || value === null) return false

  const confirmation = value as Partial<PurchaseConfirmationData>
  return typeof confirmation.orderNumber === 'string'
    && typeof confirmation.total === 'number'
    && typeof confirmation.estadoPago === 'string'
}

export default function CompraConfirmadaPage() {
  const location = useLocation()
  const confirmation = isPurchaseConfirmation(location.state) ? location.state : null

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <nav className="checkout-breadcrumb" aria-label="Ruta de navegación">
          <Link to="/inicio">Inicio</Link><span>/</span><span>Confirmación de compra</span>
        </nav>

        {confirmation ? (
          <section className="checkout-panel checkout-confirmation-panel">
            <div className="checkout-confirmation-icon"><CheckCircle2 size={32} /></div>
            <span className="checkout-eyebrow">PEDIDO REGISTRADO</span>
            <h1>¡Gracias por tu pedido!</h1>
            <p className="checkout-confirmation-message">
              Guardamos tu pedido en la base de datos. El pago quedó pendiente; no se realizó ningún cobro.
            </p>
            <div className="checkout-confirmation-reference">
              <span>Número de pedido</span> <strong>#{confirmation.orderNumber}</strong>
            </div>
            <div className="checkout-confirmation-reference">
              <span>Total registrado</span> <strong>S/ {confirmation.total.toFixed(2)}</strong>
            </div>
            <div className="checkout-confirmation-note">
              <strong>Pago pendiente.</strong> El pedido está registrado y será coordinado por el equipo de Cremissimo.
            </div>
            <Link className="checkout-primary-link" to="/productos">Seguir comprando <ShoppingBag size={16} /></Link>
          </section>
        ) : (
          <section className="checkout-panel checkout-confirmation-panel checkout-confirmation-empty">
            <div className="checkout-confirmation-icon"><ShoppingBag size={30} /></div>
            <span className="checkout-eyebrow">SIN PEDIDO RECIENTE</span>
            <h1>No encontramos una compra para confirmar</h1>
            <p className="checkout-confirmation-message">Cuando completes el checkout, aquí verás el resumen de confirmación.</p>
            <Link className="checkout-primary-link" to="/productos">Ir a productos <ShoppingBag size={16} /></Link>
          </section>
        )}
      </div>
    </div>
  )
}
