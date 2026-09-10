import './App.css'
import Header from './componets/header/header.tsx'
import Hero from './componets/hero/hero.tsx'
import Nosotros from './componets/nosotros/nosotros.tsx'
import ProductosDestacados from './componets/productos_destacados/productos_destacados.tsx'
import Productos from './componets/productos/productos.tsx'
import VideoHelado from './componets/productos/video_helado.tsx'
import Testimonios from './componets/testimonios/testimonios.tsx'
import Footer from './componets/footer/footer.tsx'
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
