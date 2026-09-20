import Header from '../../componets/common/header/Header'
import Hero from '../../componets/home/hero/Hero'
import Nosotros from '../../componets/nosotros/Nosotros'
import ProductosDestacados from '../../componets/home/productos_destacados/ProductosDestacados'
import Productos from '../../componets/productos/Productos'
import VideoHelado from '../../componets/home/video_helado/VideoHelado'
import Testimonios from '../../componets/home/testimonios/Testimonios'
import Footer from '../../componets/common/footer/Footer'
import CarritoModal from '../../componets/common/carrito_flotante/CarritoModal'
import { useState } from 'react'
import type { Producto } from '../../componets/productos/ProductoCard'

function Home() {

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

export default Home
