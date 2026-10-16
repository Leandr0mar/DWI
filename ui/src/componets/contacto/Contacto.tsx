import { useState, type ChangeEvent, type FormEvent } from 'react'
import './contacto.css'

interface FormularioContacto {
  nombre: string
  correo: string
  telefono: string
  asunto: string
  mensaje: string
}

interface FAQItem {
  pregunta: string
  respuesta: string
}

const formularioVacio: FormularioContacto = {
  nombre: '',
  correo: '',
  telefono: '',
  asunto: 'Consulta general',
  mensaje: '',
}

const datosContacto = [
  { icono: '📍', titulo: 'Dirección', detalle: 'Parque Municipal 123, Barranco, Lima' },
  { icono: '📞', titulo: 'Teléfono', detalle: '+51 912 345 678' },
  { icono: '✉️', titulo: 'Correo', detalle: 'u23309079@utp.edu.pe' },
  { icono: '🕙', titulo: 'Horario', detalle: 'Lun–Dom: 10:00 – 22:00' },
]

const preguntasFrecuentes: FAQItem[] = [
  {
    pregunta: '¿Hacen entregas a domicilio o delivery?',
    respuesta: '¡Sí! Realizamos envíos a través de nuestra flota propia en Barranco, Miraflores, San Isidro y distritos aledaños.',
  },
  {
    pregunta: '¿Tienen opciones veganas o sin lactosa?',
    respuesta: 'Contamos con una línea especial de sorbetes a base de fruta 100% natural sin lácteos y helados endulzados naturalmente.',
  },
  {
    pregunta: '¿Con cuánta anticipación debo hacer un pedido especial para eventos?',
    respuesta: 'Recomendamos solicitar catering o pedidos de gran volumen con al menos 48 horas de anticipación.',
  },
]

function Contacto() {
  const [formulario, setFormulario] = useState<FormularioContacto>(formularioVacio)
  const [enviado, setEnviado] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [faqAbierta, setFaqAbierta] = useState<number | null>(null)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
    if (enviado) setEnviado(false)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulación de envío asíncrono
    setTimeout(() => {
      setIsSubmitting(false)
      setEnviado(true)
      setFormulario(formularioVacio)
    }, 1200)
  }

  const toggleFAQ = (index: number) => {
    setFaqAbierta(faqAbierta === index ? null : index)
  }

  return (
    <section className="contacto-section" aria-labelledby="contacto-title">
      {/* Encabezado */}
      <div className="contacto-heading">
        <span className="contacto-eyebrow">Hablemos</span>
        <h1 id="contacto-title">Contáctanos</h1>
        <p>
          ¿Tienes una duda, un pedido especial o quieres celebrar con nuestros helados?
          Escríbenos y te responderemos a la brevedad.
        </p>
      </div>

      <div className="contacto-layout">
        {/* Columna Izquierda: Datos, WhatsApp y Mapa */}
        <div className="contacto-sidebar">
          <div className="contacto-info-grid">
            {datosContacto.map((dato) => (
              <div className="contacto-info-card" key={dato.titulo}>
                <span className="contacto-info-icon" aria-hidden="true">{dato.icono}</span>
                <div>
                  <strong>{dato.titulo}</strong>
                  <span>{dato.detalle}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Acceso rápido por WhatsApp */}
          <div className="contacto-whatsapp-card">
            <div className="whatsapp-text">
              <strong>¿Necesitas atención rápida?</strong>
              <p>Chatea con nosotros directamente por WhatsApp para pedidos express.</p>
            </div>
            <a
              href="https://wa.me/51921963381?text=Hola,%20quisiera%20hacer%20una%20consulta"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              💬 Escribir al WhatsApp
            </a>
          </div>

          {/* Mapa embebido */}
          <div className="contacto-mapa-container">
            <iframe
              title="Ubicación de la heladería"
              src="https://maps.google.com/maps?q=Parque%20Municipal%20Barranco%20Lima&t=&z=15&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="contacto-form-container">
          {enviado ? (
            <div className="contacto-exito-card" role="status">
              <div className="exito-icono">🎉</div>
              <h2>¡Mensaje enviado con éxito!</h2>
              <p>Gracias por escribirnos. Nuestro equipo se pondrá en contacto contigo muy pronto.</p>
              <button
                type="button"
                className="contacto-submit btn-secundario"
                onClick={() => setEnviado(false)}
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <>
              <div className="contacto-form-heading">
                <h2>Envíanos un mensaje</h2>
                <p>Completa el formulario y nos pondremos en contacto contigo.</p>
              </div>
              <form className="contacto-form" onSubmit={handleSubmit}>
                <div className="contacto-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre completo</label>
                    <input
                      id="nombre"
                      type="text"
                      name="nombre"
                      value={formulario.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Mateo Rossi"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="correo">Correo electrónico</label>
                    <input
                      id="correo"
                      type="email"
                      name="correo"
                      value={formulario.correo}
                      onChange={handleChange}
                      placeholder="tucorreo@ejemplo.com"
                      required
                    />
                  </div>
                </div>

                <div className="contacto-row">
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono (opcional)</label>
                    <input
                      id="telefono"
                      type="tel"
                      name="telefono"
                      value={formulario.telefono}
                      onChange={handleChange}
                      placeholder="+51 999 999 999"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="asunto">Asunto</label>
                    <select id="asunto" name="asunto" value={formulario.asunto} onChange={handleChange}>
                      <option value="Consulta general">Consulta general</option>
                      <option value="Pedido especial / eventos">Pedido especial / eventos</option>
                      <option value="Seguimiento de un pedido">Seguimiento de un pedido</option>
                      <option value="Reclamos y sugerencias">Reclamos y sugerencias</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="mensaje">Mensaje</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formulario.mensaje}
                    onChange={handleChange}
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                    rows={5}
                    required
                  />
                </div>

                <button type="submit" className="contacto-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Sección opcional: Preguntas Frecuentes */}
      <div className="contacto-faq">
        <h2>Preguntas Frecuentes</h2>
        <div className="faq-list">
          {preguntasFrecuentes.map((faq, index) => (
            <div className={`faq-item ${faqAbierta === index ? 'abierto' : ''}`} key={faq.pregunta}>
              <button
                type="button"
                className="faq-pregunta"
                aria-expanded={faqAbierta === index}
                aria-controls={`faq-respuesta-${index}`}
                onClick={() => toggleFAQ(index)}
              >
                <span className="faq-pregunta-text">{faq.pregunta}</span>
                <span className="faq-icon" aria-hidden="true">{faqAbierta === index ? '−' : '+'}</span>
              </button>
              <p
                className="faq-respuesta"
                id={`faq-respuesta-${index}`}
                hidden={faqAbierta !== index}
              >
                {faq.respuesta}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Contacto