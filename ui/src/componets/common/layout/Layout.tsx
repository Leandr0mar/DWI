import { useEffect, useState } from 'react'
import { Outlet, useLocation, useOutletContext } from 'react-router-dom'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import CarritoModal from '../carrito_flotante/CarritoModal'
import type { Producto } from '../../productos/ProductoCard'

export interface LayoutContext {
  agregarAlCarrito: (producto: Producto) => void
}

// Hook para que las páginas hijas puedan agregar productos al carrito
export function useLayout() {
  return useOutletContext<LayoutContext>()
}

export default function Layout() {
  const [carrito, setCarrito] = useState<Producto[]>([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const { pathname } = useLocation()

  // Al cambiar de página, volver arriba
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((actual) => [...actual, producto])
    setCarritoAbierto(true)
  }

  return (
    <>
      <Header onAbrirCarrito={() => setCarritoAbierto(true)} />

      <main>
        <Outlet context={{ agregarAlCarrito } satisfies LayoutContext} />
      </main>

      <CarritoModal
        abierto={carritoAbierto}
        carrito={carrito}
        onCerrar={() => setCarritoAbierto(false)}
      />

      <Footer />
    </>
  )
}
