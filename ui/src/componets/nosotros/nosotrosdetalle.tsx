import './nosotrosdetalle.css'
const HERO_IMAGE =
  "https://images.unsplash.com/flagged/photo-1577997292296-be87ba314290?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400";
const CRAFT_IMAGE =
  "https://images.unsplash.com/photo-1745455695240-3755405ef686?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200";

const VALUES = [
  {
    title: "Calidad sin atajos",
    description: "Elegimos ingredientes frescos y cuidamos cada lote desde la mezcla hasta el servido.",
    color: "ns-value-number--gold",
  },
  {
    title: "Cercanía",
    description: "Escuchamos a nuestros clientes y creamos experiencias que se sienten familiares.",
    color: "ns-value-number--blue",
  },
  {
    title: "Creatividad",
    description: "Combinamos tradición y curiosidad para desarrollar sabores memorables durante todo el año.",
    color: "ns-value-number--pink",
  },
  {
    title: "Responsabilidad",
    description: "Trabajamos con proveedores locales y buscamos reducir el impacto de cada operación.",
    color: "ns-value-number--green",
  },
];

const MILESTONES = [
  { year: "2012", title: "Nace Cremissimo", text: "Abrimos nuestro primer local con seis sabores y una receta familiar." },
  { year: "2017", title: "Crecemos en comunidad", text: "Superamos los 3.000 clientes y sumamos productores locales a nuestra cadena." },
  { year: "2021", title: "Innovación artesanal", text: "Creamos una línea de sabores de temporada y opciones para diferentes preferencias." },
  { year: "Hoy", title: "Seguimos creando", text: "Más de 50 sabores y una comunidad que inspira cada nueva cucharada." },
];

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="ns-check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 12.5l4 4L19 7" />
    </svg>
  );
}

export default function Nosotros() {
  return (
    <div className="nosotros-page">
      <main>
        <section className="ns-hero">
          <div className="ns-hero-inner">
            <div className="ns-hero-copy">
              <span className="ns-pill ns-pill--dark">
                Nuestra esencia
              </span>
              <h1 className="ns-hero-title">
                Creamos momentos que saben a <span>felicidad</span>
              </h1>
              <p className="ns-hero-description">
                Cremissimo es una heladería artesanal nacida del amor por los ingredientes honestos, las recetas cuidadas y la alegría de compartir algo delicioso.
              </p>
              <div className="ns-hero-actions">
                <a href="#historia" className="ns-button ns-button--dark">
                  Conoce nuestra historia
                </a>
                <a href="/productos" className="ns-button ns-button--outline">
                  Ver nuestros sabores
                </a>
              </div>
            </div>
            <div className="ns-hero-visual">
              <div className="ns-hero-frame" />
              <img
                src={HERO_IMAGE}
                alt="Preparación artesanal de un helado Cremissimo"
                className="ns-hero-image"
              />
              <div className="ns-stats">
                {[
                  ["12+", "años creando"],
                  ["50+", "sabores"],
                  ["8K+", "clientes"],
                ].map(([value, label], index) => (
                  <div key={label} className={`ns-stat${index > 0 ? ' ns-stat--divided' : ''}`}>
                    <div className="ns-stat-value">{value}</div>
                    <div className="ns-stat-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="ns-section ns-section--white">
          <div className="ns-container">
            <div className="ns-intro">
              <span className="ns-eyebrow">Quiénes somos</span>
              <h2 className="ns-section-title">Una empresa con propósito y sabor</h2>
              <p className="ns-intro-copy">
                Somos un equipo de maestros heladeros, creativos y amantes de los buenos momentos. Elaboramos nuestros productos en pequeños lotes para cuidar la textura, el sabor y la frescura que distinguen a Cremissimo.
              </p>
            </div>

            <div className="ns-purpose-grid">
              <article className="ns-purpose-card ns-purpose-card--mission">
                <div className="ns-purpose-icon ns-purpose-icon--gold">
                  <svg aria-hidden="true" className="ns-purpose-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c3-3.2 4.5-6.2 4.5-9S15 6.2 12 3c-3 3.2-4.5 6.2-4.5 9s1.5 5.8 4.5 9zM3.5 9h17M3.5 15h17" />
                  </svg>
                </div>
                <h3>Nuestra misión</h3>
                <p>
                  Crear helados artesanales excepcionales con ingredientes de calidad, ofreciendo experiencias cercanas que despierten alegría y conecten a las personas.
                </p>
              </article>
              <article className="ns-purpose-card ns-purpose-card--vision">
                <div className="ns-purpose-icon ns-purpose-icon--soft">
                  <svg aria-hidden="true" className="ns-purpose-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                </div>
                <h3>Nuestra visión</h3>
                <p>
                  Ser una marca referente de helados artesanales, reconocida por innovar responsablemente, impulsar el talento local y convertir cada visita en un recuerdo especial.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="historia" className="ns-section ns-section--cream">
          <div className="ns-container">
            <div className="ns-history-grid">
              <div className="ns-history-visual">
                <img src={CRAFT_IMAGE} alt="Vitrina de sabores artesanales" className="ns-history-image" />
                <div className="ns-history-quote">
                  <p>
                    “Cada sabor debe contar una historia y cada servicio debe hacer sentir a alguien bienvenido.”
                  </p>
                </div>
              </div>
              <div className="ns-history-copy">
                <span className="ns-eyebrow">Nuestro recorrido</span>
                <h2 className="ns-section-title">De una receta familiar a una comunidad</h2>
                <div className="ns-timeline">
                  {MILESTONES.map((item, index) => (
                    <div key={item.year} className="ns-timeline-item">
                      {index < MILESTONES.length - 1 && <div className="ns-timeline-line" />}
                      <div className="ns-timeline-year">
                        {item.year}
                      </div>
                      <div className="ns-timeline-text">
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ns-section ns-section--white">
          <div className="ns-container">
            <div className="ns-values-heading">
              <span className="ns-eyebrow">Lo que nos guía</span>
              <h2 className="ns-section-title">Nuestros valores están en cada detalle</h2>
            </div>
            <div className="ns-values-grid">
              {VALUES.map((value, index) => (
                <article key={value.title} className="ns-value-card">
                  <div className={`ns-value-number ${value.color}`}>
                    0{index + 1}
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ns-section ns-section--cream ns-commitment-section">
          <div className="ns-commitment">
              <div className="ns-commitment-grid">
                <div className="ns-commitment-copy">
                  <span className="ns-eyebrow ns-eyebrow--light">Nuestro compromiso</span>
                  <h2>Crecer de una forma más consciente</h2>
                  <p>
                    Creemos que un gran producto también debe aportar a su entorno. Por eso fortalecemos relaciones duraderas con productores y mejoramos continuamente nuestros procesos.
                  </p>
                </div>
                <ul className="ns-commitment-list">
                  {["Ingredientes de origen responsable", "Producción en pequeños lotes", "Alianzas con proveedores locales", "Mejora continua de empaques"].map((item) => (
                    <li key={item}>
                      <span className="ns-commitment-check"><CheckIcon /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
          </div>
        </section>

        <section className="ns-cta">
          <p className="ns-eyebrow ns-eyebrow--light">Conoce el sabor Cremissimo</p>
          <h2>Nuestra historia continúa contigo</h2>
          <p className="ns-cta-copy">Explora el catálogo y encuentra ese sabor que convertirá un día cualquiera en algo especial.</p>
          <a href="/#productos" className="ns-button ns-button--gold">
            Descubrir sabores
          </a>
        </section>
      </main>

    </div>
  );
}