import { useState } from 'react'
import Productos from './components/Productos'
import ProcesoHelado from './components/ProcesoHelado'
import type { Producto } from './components/ProductoCard'
import './App.css'

function App() {
  const [carrito, setCarrito] = useState<Producto[]>([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((actual) => [...actual, producto])
  }

  const total = carrito.reduce((suma, producto) => suma + producto.precio, 0)

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo-text">🍨 <span>Cremissimo</span></div>
        <nav>
          <a href="#inicio">Inicio</a>
          <a href="#productos">Productos</a>
          <a href="#proceso">Nosotros</a>
        </nav>
        <button className="btn-carrito" onClick={() => setCarritoAbierto(true)}>
          🛒 Carrito <span>{carrito.length}</span>
        </button>
      </header>

      <main id="inicio">
        <Productos onAgregar={agregarAlCarrito} />
        <ProcesoHelado />
      </main>

      {carritoAbierto && (
        <div className="carrito-backdrop" onClick={() => setCarritoAbierto(false)}>
          <aside className="carrito-panel" onClick={(e) => e.stopPropagation()}>
            <div className="carrito-header">
              <h2>Tu carrito</h2>
              <button onClick={() => setCarritoAbierto(false)} aria-label="Cerrar">✕</button>
            </div>

            {carrito.length === 0 ? (
              <p className="carrito-vacio">Todavía no agregaste helados.</p>
            ) : (
              <>
                <div className="carrito-items">
                  {carrito.map((producto, index) => (
                    <div className="carrito-item" key={`${producto.id}-${index}`}>
                      <img src={producto.imagen} alt="" />
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
      )}
    </div>
  )
}

export default App
