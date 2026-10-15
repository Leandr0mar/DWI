import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './header.css'
import logoCremissimo from '../../../assets/logo/img_logo3.png'

interface HeaderProps {
  onAbrirCarrito: () => void
}

export default function Header({ onAbrirCarrito }: HeaderProps) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="header-navbar">
      <div className="header-container">
        <Link to="/inicio" className="header-logo-link">
          <img src={logoCremissimo} alt="Logo" className="header-logo-img" />
        </Link>

        {/* Navegación Desktop */}
        <nav className="header-nav-desktop">
          <NavLink to="/inicio" className="header-nav-link">Inicio</NavLink>
          <NavLink to="/nosotros" className="header-nav-link">Nosotros</NavLink>
          <NavLink to="/productos" className="header-nav-link">Productos</NavLink>
          <NavLink to="/contactos" className="header-nav-link">Contactos</NavLink>
        </nav>

        {/* Botones */}
        <div className="header-actions">
          <button 
            className="header-cart-btn"
            onClick={onAbrirCarrito}
          >
            🛒
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
          <NavLink to="/inicio" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Inicio</NavLink>
          <NavLink to="/nosotros" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Nosotros</NavLink>
          <NavLink to="/productos" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Productos</NavLink>
          <NavLink to="/contactos" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Contactos</NavLink>
        </div>
      )}
    </header>
  )
}