import './hero.css'
import heroBackground from '../../assets/hero/ice-cream-factory-heladeria.jpg'

export default function Hero() {
  return (
    <section id="inicio" className="hero-section" aria-labelledby="hero-title">
      {/* Fondo con imagen y gradiente */}
      <div className="hero-bg">
        <img
          src={heroBackground}
          alt="Helados artesanales Cremissimo"
          className="hero-bg-img"
        />
        <div className="hero-bg-overlay" />
      </div>

      {/* Círculos decorativos */}
      <div className="hero-circle-yellow" />
      <div className="hero-circle-pink" />

      <div className="hero-container">
          {/* Contenido principal */}
        <div className="hero-content">
          <span className="hero-badge">
            🍦 Desde 1999, haciendo pausas deliciosas
          </span>

          <h1 id="hero-title" className="hero-title">
            El sabor de lo<br />
            <span className="hero-title-highlight">bien hecho</span>. 🍨
          </h1>

          <p className="hero-description">
            Helados cremosos preparados para convertir cualquier día en una pequeña celebración. Elaborados con ingredientes naturales y el amor de siempre.
          </p>

          <div className="hero-buttons">
            <a href="#productos" className="hero-btn-primary">
              Explorar sabores
            </a>
            <a href="#nosotros" className="hero-btn-secondary">
              Nuestra Historia
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-item">
              <div className="hero-stat-number">+50</div>
              <div className="hero-stat-label">Sabores</div>
            </div>

            <div className="hero-stat-divider" />

            <div className="hero-stat-item">
              <div className="hero-stat-number">27</div>
              <div className="hero-stat-label">Años</div>
            </div>

            <div className="hero-stat-divider" />

            <div className="hero-stat-item">
              <div className="hero-stat-number">+8K</div>
              <div className="hero-stat-label">Clientes</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}