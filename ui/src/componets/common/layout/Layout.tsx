import { useEffect, useState } from 'react'
import { Outlet, useLocation, useOutletContext } from 'react-router-dom'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import CarritoModal from '../carrito_flotante/CarritoModal'
import CarritoFlotante from '../carrito_flotante/CarritoFlotante'
import PageFade from './PageFade'
import type { Producto } from '../../productos/ProductoCard'

export interface LayoutContext {
  carrito: Producto[]
  agregarAlCarrito: (producto: Producto) => void
  eliminarDelCarrito: (producto: Producto) => void
  reducirCantidad: (producto: Producto) => void
  vaciarCarrito: () => void
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
    if (pathname !== '/carrito') setCarritoAbierto(true)
  }

  const eliminarDelCarrito = (producto: Producto) => {
    setCarrito((actual) => actual.filter((item) => !sonIguales(item, producto)))
  }

  const reducirCantidad = (producto: Producto) => {
    setCarrito((actual) => {
      const indice = actual.findIndex((item) => sonIguales(item, producto))
      return indice < 0 ? actual : actual.filter((_, itemIndex) => itemIndex !== indice)
    })
  }

  return (
    <>
      <Header />

      <main>
        <PageFade>
          <Outlet context={{
            carrito,
            agregarAlCarrito,
            eliminarDelCarrito,
            reducirCantidad,
            vaciarCarrito: () => setCarrito([]),
          } satisfies LayoutContext} />
        </PageFade>
      </main>

      <CarritoModal
        abierto={carritoAbierto}
        carrito={carrito}
        onEliminar={eliminarDelCarrito}
        onReducir={reducirCantidad}
        onCerrar={() => setCarritoAbierto(false)}
      />
      {pathname !== '/carrito' && pathname !== '/checkout' && pathname !== '/compra/confirmacion' && (
        <CarritoFlotante
          cantidad={carrito.length}
          onAbrir={() => setCarritoAbierto(true)}
        />
      )}

      <Footer />
    </>
  )
}

function sonIguales(a: Producto, b: Producto) {
  return a.id === b.id && a.sabor === b.sabor
}
