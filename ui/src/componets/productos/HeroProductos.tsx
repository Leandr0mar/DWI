import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './hero_productos.css'
import vitrinaSabores from '../../assets/hero_productos/ai-generated-caught-raw-seafood-food-freshly-ai-generated-photo.jpg'
import saboresFrutales from '../../assets/hero_productos/consumo-energetico-heladeria.jpg'
import servirGelato from '../../assets/hero_productos/gelato-ice-cream-scooping-colorful-and-delicious-dessert-free-photo.jpg'

const imagenesCatalogo = [
  { src: vitrinaSabores, alt: 'Vitrina con una variedad de sabores de helado' },
  { src: saboresFrutales, alt: 'Helados de distintos colores y sabores frutales' },
  { src: servirGelato, alt: 'Preparación y servido de helado artesanal' },
]

export default function HeroProductos() {
  const [imagenActiva, setImagenActiva] = useState(0)

  useEffect(() => {
    const temporizador = window.setInterval(() => {
      setImagenActiva((actual) => (actual + 1) % imagenesCatalogo.length)
    }, 6500)

    return () => window.clearInterval(temporizador)
  }, [])

  return (
    <section className="hero-productos" aria-labelledby="hero-productos-title">
      <div className="hero-productos-fondos" aria-hidden="true">
        {imagenesCatalogo.map((imagen, indice) => (
          <img
            key={imagen.src}
            src={imagen.src}
            alt=""
            className={`hero-productos-fondo${indice === imagenActiva ? ' activo' : ''}`}
            loading="eager"
            decoding={indice === 0 ? 'sync' : 'async'}
            fetchPriority={indice === imagenActiva ? 'high' : 'low'}
          />
        ))}
      </div>
      <div className="hero-productos-velo" aria-hidden="true" />
      <div className="hero-productos-contenido">
        <span className="hero-productos-etiqueta">El catálogo Cremissimo</span>
        <h1 id="hero-productos-title">Un sabor para cada antojo</h1>
        <p>
          Explora nuestra selección de helados, conoce sus sabores y presentaciones,
          y encuentra tu próximo favorito.
        </p>
        <div className="hero-productos-acciones">
          <a href="#productos" className="hero-productos-boton-principal">Explorar productos</a>
          <Link to="/nosotros" className="hero-productos-boton-secundario">Nuestra historia</Link>
        </div>
      </div>
      <div className="hero-productos-controles" aria-label="Selector de imágenes del catálogo">
        {imagenesCatalogo.map((imagen, indice) => (
          <button
            key={imagen.src}
            type="button"
            className={`hero-productos-punto${indice === imagenActiva ? ' activo' : ''}`}
            aria-label={`Mostrar imagen ${indice + 1}: ${imagen.alt}`}
            aria-current={indice === imagenActiva ? 'true' : undefined}
            onClick={() => setImagenActiva(indice)}
          />
        ))}
      </div>
    </section>
  )
}
