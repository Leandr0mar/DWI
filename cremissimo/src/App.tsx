import './App.css'
import Nosotros from './nosotros'
import ProductosDestacados from './productos_destacados'
import logo from './assets/logo/img_logo.png'

function App() {
  return (
    <main>
      <header className="site-header">
        <a className="site-logo" href="#nosotros" aria-label="Cremissimo, inicio">
          <img src={logo} alt="Cremissimo" />
        </a>
        <nav aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#productos">Productos</a>
          <a href="#destacados">Destacados</a>
          <a href="#testimonios">Testimonios</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <button className="cart-button" type="button" aria-label="Abrir carrito">
          🛒 <span>Carrito</span>
        </button>
      </header>
      <Nosotros />
      <ProductosDestacados />
    </main>
  )
}

export default App
