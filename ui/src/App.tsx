import './App.css'
import Header from './componets/header/header'
import Hero from './componets/hero/hero'
import Nosotros from './componets/nosotros/nosotros'
import ProductosDestacados from './componets/productos_destacados/productos_destacados'
import Productos from './componets/productos/productos'
import VideoHelado from './componets/productos/video_helado'
import Testimonios from './componets/testimonios/testimonios'
import Footer from './componets/footer/footer'
import CarritoModal from './componets/carrito/carrito_modal'
import { useState } from 'react'
import type { Producto } from './componets/productos/producto_card'

function App() {

    const [carrito, setCarrito] = useState<Producto[]>([])
    const [carritoAbierto, setCarritoAbierto] = useState(false)

    const agregarAlCarrito = (producto: Producto) => {
      setCarrito((actual) => [...actual, producto])
      setCarritoAbierto(true)
  }

    return (
    <>
      <Header onAbrirCarrito={() => setCarritoAbierto(true)} />
      <Hero />

      <Nosotros />
      <ProductosDestacados />
      
      <main id="inicio">
        <Productos onAgregar={agregarAlCarrito} />
        <VideoHelado />
      </main>

      <CarritoModal
        abierto={carritoAbierto}
        carrito={carrito}
        onCerrar={() => setCarritoAbierto(false)}
      />

      <Testimonios />
      <Footer />
      
    </>
  )
}

export default App
