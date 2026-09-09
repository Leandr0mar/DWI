function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <a href="#" className="brand">
          Cremissimo
        </a>

        <nav className="nav">
          <a href="#inicio">Inicio</a>
          <a href="#next-steps">Documentación</a>
          <a href="#social">Comunidad</a>
        </nav>

        <a href="#inicio" className="header-button">
          Empezar
        </a>
      </div>
    </header>
  )
}

export default Header
