import './App.css'
import Header from './componets/header/header'
import Hero from './componets/hero/hero'
import Nosotros from './componets/nosotros/nosotros'
import ProductosDestacados from './componets/productos_destacados/productos_destacados'
import Productos from './componets/productos/productos'
import VideoHelado from './componets/productos/video_helado'
import Testimonios from './componets/testimonios/testimonios'
import Footer from './componets/footer/footer'

function App() {
    return (
    <>
      <Header />
      <Hero />

      <Nosotros />
      <ProductosDestacados />
      
      <main id="inicio">
        <Productos onAgregar={() => {}} />
        <VideoHelado />
      </main>

      <Testimonios />
      <Footer />
      
    </>
  )
}

export default App
