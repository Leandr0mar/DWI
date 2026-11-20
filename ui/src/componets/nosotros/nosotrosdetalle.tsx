import { useEffect, useState } from 'react'
import './nosotrosdetalle.css'
import heroBackground1 from '../../assets/hero/img1.jpg'
import heroBackground2 from '../../assets/hero/img2.jpg'
import heroBackground3 from '../../assets/hero/img3.webp'
import erikCv from '../../assets/cv/erik-eduardo.pdf'
import erikCvPreview from '../../assets/cv/erik-eduardo-preview.png'
import callirgosCv from '../../assets/cv/callirgos.pdf'
import callirgosCvPreview from '../../assets/cv/callirgos-preview.png'
import valentinCv from '../../assets/cv/valentin.pdf'
import valentinCvPreview from '../../assets/cv/valentin-preview.png'
import leandroCv from '../../assets/cv/leandro-candia.pdf'
import christianCv from '../../assets/cv/christian-villacorta.pdf'
import leandroCvPreview from '../../assets/cv/leandro-candia-preview.png'
import christianCvPreview from '../../assets/cv/christian-villacorta-preview.png'
const CRAFT_IMAGE =
  "https://images.unsplash.com/photo-1745455695240-3755405ef686?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200";

const HERO_IMAGES = [
  { src: heroBackground1, alt: 'Vitrina de helados artesanales' },
  { src: heroBackground2, alt: 'Helado artesanal servido en una copa' },
  { src: heroBackground3, alt: 'Variedad de helados artesanales' },
]

type TeamMember = {
  id: string
  name: string
  role: string
  cvUrl: string | null
  cvPreviewUrl: string | null
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: 'coordinator', name: 'Candia Falcón Leandro Omar', role: 'Coordinador/Programador de control de Versiones', cvUrl: leandroCv, cvPreviewUrl: leandroCvPreview },
  { id: 'developer-1', name: 'Barrera Chavez Erik Eduardo', role: 'Programador Backend', cvUrl: erikCv, cvPreviewUrl: erikCvPreview },
  { id: 'developer-2', name: 'Callirgos Huaman Ian Arturo', role: 'Programador Frontend', cvUrl: callirgosCv, cvPreviewUrl: callirgosCvPreview },
  { id: 'developer-3', name: 'Valentín Garay José Alberto', role: 'Programador de Base de Datos', cvUrl: valentinCv, cvPreviewUrl: valentinCvPreview },
  { id: 'developer-4', name: 'Villacorta Latorre Christian Aldair', role: 'Programador Frontend', cvUrl: christianCv, cvPreviewUrl: christianCvPreview },
]

function TeamCard({ member }: { member: TeamMember }) {
  const hasCv = Boolean(member.cvUrl)

  return (
    <article className="ns-team-card">
      <span className="ns-team-role">{member.role}</span>
      <h3>{member.name}</h3>
      <a
        className={`ns-cv-preview${hasCv ? '' : ' is-placeholder'}`}
        href={member.cvUrl ?? undefined}
        download={hasCv ? true : undefined}
        tabIndex={hasCv ? undefined : -1}
        aria-label={hasCv ? `Abrir o descargar CV de ${member.name}` : `Vista previa del CV de ${member.name}, pendiente de agregar`}
        aria-disabled={!hasCv}
        onClick={(event) => { if (!hasCv) event.preventDefault() }}
      >
        <span className="ns-cv-preview-window">
          {member.cvPreviewUrl ? (
            <img className="ns-cv-thumbnail" src={member.cvPreviewUrl} alt={`Vista previa de la primera página del CV de ${member.name}`} />
          ) : (
            <span className="ns-cv-sheet" aria-hidden="true"><span>PDF</span><i /><i /><i /></span>
          )}
        </span>
        <span>{hasCv ? 'Abrir / descargar CV' : 'CV pendiente de agregar'}</span>
      </a>
    </article>
  )
}

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
  const [activeHeroImage, setActiveHeroImage] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const intervalId = window.setInterval(() => {
      setActiveHeroImage((current) => (current + 1) % HERO_IMAGES.length)
    }, 7000)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <div className="nosotros-page">
      <main>
        <section className="ns-hero" aria-labelledby="ns-hero-title">
          <div className="ns-hero-background" aria-hidden="true">
            {HERO_IMAGES.map((image, index) => (
              <img
                key={image.src}
                src={image.src}
                alt=""
                className={`ns-hero-background-image${index === activeHeroImage ? ' is-active' : ''}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            ))}
            <div className="ns-hero-overlay" />
          </div>
          <div className="ns-hero-inner">
            <div className="ns-hero-copy">
              <span className="ns-pill ns-pill--dark">
                Nuestra esencia
              </span>
              <h1 id="ns-hero-title" className="ns-hero-title">
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
          <div className="ns-hero-slider-controls" role="group" aria-label="Imágenes destacadas">
            {HERO_IMAGES.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={`ns-hero-slider-dot${index === activeHeroImage ? ' is-active' : ''}`}
                aria-label={`Mostrar imagen ${index + 1}: ${image.alt}`}
                aria-pressed={index === activeHeroImage}
                onClick={() => setActiveHeroImage(index)}
              />
            ))}
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

        <section className="ns-section ns-section--white ns-team-section" aria-labelledby="ns-team-title">
          <div className="ns-container">
            <div className="ns-team-heading">
              <span className="ns-eyebrow">Mapa Organizacional</span>
              <h2 id="ns-team-title" className="ns-section-title">Organización del proyecto</h2>
              <p>Un equipo coordinado, con responsabilidades claras y colaboración en cada etapa.</p>
            </div>
            <div className="ns-org-chart">
              <div className="ns-org-level ns-org-level--coordinator">
                {TEAM_MEMBERS.slice(0, 1).map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
              <div className="ns-org-connector" aria-hidden="true" />
              <div className="ns-org-level ns-org-level--developers">
                {TEAM_MEMBERS.slice(1).map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="ns-section ns-section--cream ns-methodology-section" aria-labelledby="ns-methodology-title">
          <div className="ns-container">
            <div className="ns-methodology-heading">
              <span className="ns-eyebrow">Cómo trabajamos</span>
              <h2 id="ns-methodology-title" className="ns-section-title">Metodología ágil con Kanban</h2>
              <p>Organizamos el trabajo en ciclos cortos, con seguimiento visible y entregas integradas.</p>
            </div>
            <ol className="ns-methodology-steps">
              <li className="ns-methodology-card">
                <span className="ns-methodology-step">01</span>
                <h3>Requerimientos y organización</h3>
                <p>Centralizamos la información y el seguimiento del equipo en Trello, y registramos los requerimientos en GitHub Issues para organizarlos con Kanban.</p>
                <div className="ns-methodology-tools"><span>GitHub Issues</span><span>Trello</span><span>Kanban</span></div>
              </li>
              <li className="ns-methodology-card">
                <span className="ns-methodology-step">02</span>
                <h3>Sprints semanales</h3>
                <p>Planificamos sprints de una semana y avanzamos de manera incremental, haciendo visible el estado de cada tarea.</p>
              </li>
              <li className="ns-methodology-card">
                <span className="ns-methodology-step">03</span>
                <h3>Revisión y colaboración</h3>
                <p>Nos reunimos por Zoom para revisar avances, compartir el trabajo y resolver bloqueos durante el sprint.</p>
              </li>
              <li className="ns-methodology-card">
                <span className="ns-methodology-step">04</span>
                <h3>Integración antes de la entrega</h3>
                <p>Tres días antes de la fecha de entrega integramos en GitHub las ramas de cada integrante, revisamos conflictos y preparamos una versión funcional.</p>
                <div className="ns-methodology-tools"><span>GitHub</span><span>Integración de ramas</span></div>
              </li>
            </ol>
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
