import { useState } from 'react'
import { Link } from 'react-router-dom'
import './header.css'
import logoCremissimo from '../../../assets/logo/img_logo3.png'

interface Usuario {
  nombre: string
  avatarUrl?: string
}

interface HeaderProps {
  usuario?: Usuario | null // Pasar el objeto si el usuario inició sesión, o null/undefined si no
  onCerrarSesion?: () => void
}

export default function Header({
  usuario = null,
  onCerrarSesion,
}: HeaderProps) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="header-navbar">
      <div className="header-container">
        {/* Logo */}
        <a href="#inicio" className="header-logo-link">
          <img src={logoCremissimo} alt="Logo Cremissimo" className="header-logo-img" />
        </a>

        {/* Navegación Desktop */}
        <nav className="header-nav-desktop">
          <a href="#inicio" className="header-nav-link">Inicio</a>
          <a href="#nosotros" className="header-nav-link">Nosotros</a>
          <a href="#productos" className="header-nav-link">Productos</a>
          <a href="#contactos" className="header-nav-link">Contactos</a>
        </nav>

        {/* Acciones Derecha */}
        <div className="header-actions">
          {/* Bloque de Autenticación / Perfil de Usuario */}
          <div className="header-auth-container">
            {usuario ? (
              /* --- USUARIO LOGUEADO --- */
              <div className="header-user-profile">
                {usuario.avatarUrl ? (
                  <img
                    src={usuario.avatarUrl}
                    alt={usuario.nombre}
                    className="header-user-avatar"
                  />
                ) : (
                  <div className="header-user-avatar-placeholder">
                    {usuario.nombre.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="header-user-name">{usuario.nombre}</span>
                <button
                  className="header-btn-logout"
                  onClick={onCerrarSesion}
                  title="Cerrar sesión"
                >
                  🚪 <span className="header-btn-logout-text">Salir</span>
                </button>
              </div>
            ) : (
              /* --- USUARIO NO LOGUEADO --- */
              <div className="header-auth-buttons">
                <Link
                  to="/login"
                  className="header-btn-login"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="header-btn-register"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Botón Menú Hamburguesa (Móvil) */}
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
          <a href="#contactos" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Contactos</a>

          {/* Sección de Autenticación dentro del menú móvil */}
          <div className="header-mobile-auth">
            {usuario ? (
              <div className="header-mobile-user">
                <div className="header-mobile-user-info">
                  {usuario.avatarUrl ? (
                    <img src={usuario.avatarUrl} alt={usuario.nombre} className="header-user-avatar" />
                  ) : (
                    <div className="header-user-avatar-placeholder">
                      {usuario.nombre.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="header-user-name">{usuario.nombre}</span>
                </div>
                <button 
                  className="header-btn-logout-mobile" 
                  onClick={() => { onCerrarSesion?.(); setMenuAbierto(false); }}
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="header-mobile-auth-btns">
                <Link
                  to="/login"
                  className="header-btn-login"
                  onClick={() => setMenuAbierto(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="header-btn-register"
                  onClick={() => setMenuAbierto(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}