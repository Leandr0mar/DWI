import { useEffect, useState } from 'react'
import './hero.css'
import heroBackground1 from '../../assets/hero/img1.jpg'
import heroBackground2 from '../../assets/hero/img2.jpg'
import heroBackground3 from '../../assets/hero/img3.webp'

const heroImages = [
  {
    src: heroBackground1,
    alt: 'Vitrina de helados artesanales',
  },
  {
    src: heroBackground2,
    alt: 'Helado artesanal servido en una copa',
  },
  {
    src: heroBackground3,
    alt: 'Variedad de helados artesanales',
  },
]

export default function Hero() {
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveImage((currentImage) => (currentImage + 1) % heroImages.length)
    }, 7000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <section
      id="inicio"
      className="hero-section"
      aria-labelledby="hero-title"
    >
      <div className="hero-bg" aria-live="polite">
        {heroImages.map((image, index) => (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            className={`hero-bg-img ${index === activeImage ? 'is-active' : ''}`}
          />
        ))}
        <div className="hero-bg-overlay" />
      </div>

      {/* Círculos decorativos */}
      <div className="hero-circle-yellow" />
      <div className="hero-circle-pink" />

      <div className="hero-container">
          {/* Contenido principal */}
        <div className="hero-content">

          <h1 id="hero-title" className="hero-title">
            El sabor de lo<br />
            <span className="hero-title-highlight">bien hecho</span>
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

        </div>
      </div>

      <div className="hero-slider-controls" aria-label="Selector de imágenes del hero">
        {heroImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className={`hero-slider-dot ${index === activeImage ? 'is-active' : ''}`}
            aria-label={`Mostrar imagen ${index + 1}`}
            aria-current={index === activeImage ? 'true' : undefined}
            onClick={() => setActiveImage(index)}
          />
        ))}
      </div>
    </section>
  )
}