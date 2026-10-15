import './nosotros.css'
import imagenPrincipal from '../../assets/nosotros/img1.jpg'
import imagenLocal from '../../assets/nosotros/img2.png'
import imagenMostrador from '../../assets/nosotros/img3.png'

function ImagePlaceholder({
  className,
  label,
  image,
}: {
  className: string
  label: string
  image: string
}) {
  return (
    <div className={`nosotros-image-placeholder ${className}`}>
      <img src={image} alt={label} />
    </div>
  )
}

function Nosotros() {
  return (
    <section className="nosotros-section" id="nosotros" aria-labelledby="nosotros-title">
      <div className="nosotros-gallery" aria-label="Galería de Cremissimo">
        <ImagePlaceholder
          className="nosotros-image-main"
          label="Imagen principal"
          image={imagenPrincipal}
        />
        <ImagePlaceholder
          className="nosotros-image-small nosotros-image-small-one"
          label="Detalle del local"
          image={imagenLocal}
        />
        <ImagePlaceholder
          className="nosotros-image-small nosotros-image-small-two"
          label="Nuestro mostrador"
          image={imagenMostrador}
        />
      </div>

      <div className="nosotros-copy">
        <h1 id="nosotros-title">
          Artesanía en cada <span>cucharada</span>
        </h1>
        <p>
          Desde 2012, Cremissimo nació con una sola misión: traer los sabores más
          auténticos y naturales a cada cliente. Nuestros helados se elaboran
          diariamente con leche fresca, frutas de temporada y recetas familiares
          heredadas por generaciones.
        </p>
        <p>
          Cada sabor cuenta una historia. Cada cono es una obra artesanal. No usamos
          conservantes, colorantes artificiales ni ingredientes industriales. Solo lo
          mejor de la naturaleza, con técnicas tradicionales y mucho amor.
        </p>

      </div>
    </section>
  )
}

export default Nosotros