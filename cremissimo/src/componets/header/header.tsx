import { useState } from 'react'
import './Header.css'
import logoCremissimo from '../../assets/footer/Logo-cremissimo.jpg'
export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [carritoCount, setCarritoCount] = useState(0)

  return (
    <header className="header-navbar">
      <div className="header-container">
        <a href="#inicio" className="header-logo-link">
          <img src={logoCremissimo} alt="Logo" className="header-logo-img" />
        </a>

        {/* Navegación Desktop */}
        <nav className="header-nav-desktop">
          <a href="#inicio" className="header-nav-link">Inicio</a>
          <a href="#nosotros" className="header-nav-link">Nosotros</a>
          <a href="#productos" className="header-nav-link">Productos</a>
          <a href="#testimonios" className="header-nav-link">Testimonios</a>
        </nav>

        {/* Botones */}
        <div className="header-actions">
          <button 
            className="header-cart-btn"
            onClick={() => setCarritoCount(c => c + 1)}
          >
            🛒
            {carritoCount > 0 && (
              <span className="header-cart-badge">{carritoCount}</span>
            )}
            <span className="header-cart-text">Carrito</span>
          </button>

          <button 
            className="header-menu-toggle"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Abrir menú"
          >
            <span className="header-menu-bar"></span>
            <span className="header-menu-bar"></span>
            <span className="header-menu-bar"></span>
          </button>
        </div>
      </div>

      {/* Menú Móvil */}
      {menuAbierto && (
        <div className="header-nav-mobile">
          <a href="#inicio" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Inicio</a>
          <a href="#nosotros" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Nosotros</a>
          <a href="#productos" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Productos</a>
          <a href="#testimonios" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Testimonios</a>
        </div>
      )}
    </header>
  )
}