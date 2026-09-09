import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

function Hero() {
  return (
    <section id="inicio" className="hero-section">
      <div className="hero-content">
        <span className="hero-badge">React + Vite</span>

        <h1>
          Bienvenido a <span>Cremissimo</span>
        </h1>

        <p>
          Una plataforma moderna desarrollada con React y Vite, diseñada para
          ofrecer una experiencia rápida, sencilla y atractiva.
        </p>

        <div className="hero-buttons">
          <a href="#next-steps" className="hero-button primary">
            Comenzar ahora
          </a>

          <a href="#docs" className="hero-button secondary">
            Conocer más
          </a>
        </div>
      </div>

      <div className="hero-image">
        <div className="hero">
          <img
            src={heroImg}
            className="base"
            width="170"
            height="179"
            alt="Cremissimo"
          />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
      </div>
    </section>
  )
}

export default Hero
