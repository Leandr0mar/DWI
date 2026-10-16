import Hero from '../../componets/home/hero/Hero'
import Nosotros from '../../componets/nosotros/nosotros.tsx'
import ProductosDestacados from '../../componets/home/productos_destacados/ProductosDestacados'
import VideoHelado from '../../componets/home/video_helado/VideoHelado'
import Testimonios from '../../componets/home/testimonios/Testimonios'
import { useLayout } from '../../componets/common/layout/Layout'

function Home() {
  const { agregarAlCarrito } = useLayout()

  return (
    <>
      <Hero />

      <Nosotros />
      <ProductosDestacados onAgregar={agregarAlCarrito} />
      
      <VideoHelado />
      <Testimonios />
    </>
  )
}

export default Home
