import { useState, type ChangeEvent, type FormEvent } from 'react'
import './contacto.css'

interface FormularioContacto {
  nombre: string
  correo: string
  telefono: string
  asunto: string
  mensaje: string
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

function Contacto() {
  const [formulario, setFormulario] = useState<FormularioContacto>(formularioVacio)
  const [enviado, setEnviado] = useState(false)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
    setEnviado(false)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: conectar con el backend cuando exista el endpoint de contacto
    setEnviado(true)
    setFormulario(formularioVacio)
  }

  return (
    <section className="contacto-section" aria-labelledby="contacto-title">
      <div className="contacto-heading">
        <span className="contacto-eyebrow">Hablemos</span>
        <h1 id="contacto-title">Contáctanos</h1>
        <p>
          ¿Tienes una duda, un pedido especial o quieres celebrar con nuestros
          helados? Escríbenos y te responderemos lo antes posible.
        </p>
      </div>

      <div className="contacto-layout">
        <div className="contacto-info">
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

        <form className="contacto-form" onSubmit={handleSubmit}>
          <div className="contacto-row">
            <label>
              Nombre completo
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </label>

            <label>
              Correo electrónico
              <input
                type="email"
                name="correo"
                value={formulario.correo}
                onChange={handleChange}
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </label>
          </div>

          <div className="contacto-row">
            <label>
              Teléfono (opcional)
              <input
                type="tel"
                name="telefono"
                value={formulario.telefono}
                onChange={handleChange}
                placeholder="+51 999 999 999"
              />
            </label>

            <label>
              Asunto
              <select name="asunto" value={formulario.asunto} onChange={handleChange}>
                <option>Consulta general</option>
                <option>Pedido especial / eventos</option>
                <option>Seguimiento de un pedido</option>
                <option>Reclamos y sugerencias</option>
              </select>
            </label>
          </div>

          <label>
            Mensaje
            <textarea
              name="mensaje"
              value={formulario.mensaje}
              onChange={handleChange}
              placeholder="Cuéntanos en qué podemos ayudarte"
              rows={5}
              required
            />
          </label>

          <button type="submit" className="contacto-submit">Enviar mensaje</button>

          {enviado && (
            <p className="contacto-exito" role="status">
              ¡Gracias! Recibimos tu mensaje y te contactaremos pronto.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default Contacto
