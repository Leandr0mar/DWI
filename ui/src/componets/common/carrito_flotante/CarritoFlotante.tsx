import { FiShoppingCart } from 'react-icons/fi'
import './carrito_flotante.css'

interface Props {
  cantidad: number
  onAbrir: () => void
}

export default function CarritoFlotante({ cantidad, onAbrir }: Props) {
  const etiquetaCantidad = cantidad === 1 ? '1 producto' : `${cantidad} productos`

  return (
    <button
      className="carrito-flotante"
      type="button"
      onClick={onAbrir}
      aria-label={`Abrir carrito, ${etiquetaCantidad}`}
      title={`Abrir carrito, ${etiquetaCantidad}`}
    >
      <FiShoppingCart className="carrito-flotante-icono" aria-hidden="true" />
      {cantidad > 0 && (
        <span className="carrito-flotante-cantidad" aria-hidden="true">
          {cantidad}
        </span>
      )}
    </button>
  )
}
