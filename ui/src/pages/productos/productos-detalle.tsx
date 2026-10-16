import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLayout } from '../../componets/common/layout/Layout'
import type { Producto } from '../../componets/productos/ProductoCard'
import imagenProductoPredeterminada from '../../assets/productos_destacados/pd_1.jpg'
import './productos-detalle.css'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

interface ProductoDetalle {
  id: number
  uuid: string
  sku: string
  nombre: string
  descripcion: string | null
  precioBase: number
  maxSabores: number
  stockDisponible: number
  categoria: string
  sabores: string[]
  urlImagen: string | null
  pesoVolumen: string | null
  tipoPresentacion: string | null
}

async function fetchProducto(uuid: string): Promise<ProductoDetalle> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/catalogo/productos/${encodeURIComponent(uuid)}`,
  )
  if (!response.ok) {
    if (response.status === 404) throw new Error('No encontramos ese producto en el catálogo.')
    throw new Error(`No se pudo cargar el producto (HTTP ${response.status}).`)
  }
  return response.json() as Promise<ProductoDetalle>
}

export default function ProductosDetalle() {
  const { uuid } = useParams<{ uuid: string }>()
  const { agregarAlCarrito } = useLayout()
  const [cantidad, setCantidad] = useState(1)
  const [imagenActiva, setImagenActiva] = useState(0)
  const productoQuery = useQuery({
    queryKey: ['producto-catalogo', uuid],
    queryFn: () => fetchProducto(uuid!),
    enabled: Boolean(uuid),
    retry: false,
  })

  if (productoQuery.isPending) {
    return <div className="detalle-estado" role="status">Cargando detalles del producto…</div>
  }

  if (productoQuery.isError || !productoQuery.data) {
    return (
      <div className="detalle-estado" role="alert">
        <h1>Producto no disponible</h1>
        <p>{productoQuery.error instanceof Error ? productoQuery.error.message : 'No se pudo cargar el producto.'}</p>
        <Link to="/productos" className="btn-volver-catalogo">Volver al catálogo</Link>
      </div>
    )
  }

  const producto = productoQuery.data
  const imagen = producto.urlImagen?.trim() || imagenProductoPredeterminada
  const sabores = producto.sabores.length > 0 ? producto.sabores.join(', ') : 'Sin sabores asignados'
  const productoDisponible = producto.stockDisponible > 0

  function agregarProducto() {
    const itemCarrito: Producto = {
      id: producto.id,
      nombre: producto.nombre,
      sabor: sabores,
      precio: producto.precioBase,
      imagen,
    }

    for (let unidad = 0; unidad < cantidad; unidad += 1) {
      agregarAlCarrito(itemCarrito)
    }
  }

  return (
    <div className="detalle-page">
      <main className="detalle-main-container">
        <Link to="/productos" className="detalle-enlace-volver">← Volver al catálogo</Link>

        <div className="detalle-grid-superior">
          <div className="detalle-col-imagen">
            <div className="detalle-imagen-principal-wrapper">
              <img
                src={imagen}
                alt={producto.nombre}
                className="detalle-imagen-principal"
                onError={(event) => { event.currentTarget.src = imagenProductoPredeterminada }}
              />
              <span className="badge-artesanal">{producto.categoria || 'Catálogo'}</span>
              <span className="badge-temporada">{productoDisponible ? 'Disponible' : 'Agotado'}</span>
            </div>

            <div className="detalle-galeria-minaturas" aria-label="Galería del producto">
              {[0, 1, 2, 3].map((indice) => (
                <button
                  key={indice}
                  type="button"
                  className={`miniatura-placeholder${imagenActiva === indice ? ' active' : ''}`}
                  onClick={() => setImagenActiva(indice)}
                  aria-label={indice === 0 ? 'Ver imagen disponible' : `Imagen ${indice + 1}, próximamente`}
                  aria-pressed={imagenActiva === indice}
                >
                  {indice === 0
                    ? <img src={imagen} alt="" onError={(event) => { event.currentTarget.src = imagenProductoPredeterminada }} />
                    : <span>Próximamente</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="detalle-col-info">
            <div className="detalle-linea-header">
              <span className="detalle-linea-frutal">{producto.categoria || 'Producto'}</span>
              <span className="detalle-sku">SKU: {producto.sku}</span>
            </div>

            <h1 className="detalle-titulo-producto">{producto.nombre}</h1>

            <div className="detalle-rating-box" aria-label="Valoraciones próximamente">
              <span className="estrellas estrellas-placeholder" aria-hidden="true">☆☆☆☆☆</span>
              <span className="rating-reviews">Valoraciones próximamente</span>
            </div>

            <div className="detalle-precio-box">
              <span className="precio-actual">S/ {producto.precioBase.toFixed(2)}</span>
              <span className="iva-tag">Precio base</span>
              {producto.pesoVolumen && <span className="litro-tag">{producto.pesoVolumen}</span>}
            </div>

            <p className="detalle-descripcion-texto">
              {producto.descripcion || 'La descripción de este producto estará disponible próximamente.'}
            </p>

            <section className="presentacion-seccion" aria-labelledby="presentacion-titulo">
              <div className="presentacion-label-titulo">
                <span id="presentacion-titulo">Presentación disponible</span>
                <span className="placeholder-etiqueta">Otras opciones próximamente</span>
              </div>
              <div className="presentacion-opciones-grid">
                <div className="pres-btn active" aria-current="true">
                  <strong>{producto.tipoPresentacion || 'Presentación actual'}</strong>
                  <span>{producto.pesoVolumen || 'Tamaño no especificado'}</span>
                </div>
                <div className="pres-btn pres-btn-futuro" aria-disabled="true">
                  <strong>Más opciones</strong>
                  <span>Próximamente</span>
                </div>
              </div>
            </section>

            <dl className="detalle-datos-modelo">
              <div><dt>Sabores disponibles</dt><dd>{sabores}</dd></div>
              <div><dt>Máximo de sabores</dt><dd>{producto.maxSabores}</dd></div>
              <div><dt>Disponibilidad</dt><dd>{productoDisponible ? `Disponible (${producto.stockDisponible})` : 'Agotado'}</dd></div>
            </dl>

            <div className="detalle-acciones-compra">
              <div className="contador-cantidad-box" aria-label="Cantidad">
                <button type="button" className="btn-cont" aria-label="Reducir cantidad" onClick={() => setCantidad((actual) => Math.max(1, actual - 1))}>−</button>
                <span className="num-cont" aria-live="polite">{cantidad}</span>
                <button type="button" className="btn-cont" aria-label="Aumentar cantidad" onClick={() => setCantidad((actual) => Math.min(producto.stockDisponible, actual + 1))} disabled={cantidad >= producto.stockDisponible}>+</button>
              </div>
              <button className="btn-accion-cesta" onClick={agregarProducto} disabled={!productoDisponible}>
                {productoDisponible ? '🛒 Añadir al carrito' : 'Producto agotado'}
              </button>
              <button className="btn-accion-comprar" type="button" disabled title="Esta opción estará disponible próximamente">Comprar ahora · Próximamente</button>
            </div>

            <div className="detalle-beneficios-grid">
              <div className="beneficio-item"><span className="ben-icon" aria-hidden="true">🚚</span><div><strong>Información de envío</strong><p>Próximamente</p></div></div>
              <div className="beneficio-item"><span className="ben-icon" aria-hidden="true">❄️</span><div><strong>Conservación</strong><p>Detalles próximamente</p></div></div>
              <div className="beneficio-item"><span className="ben-icon" aria-hidden="true">✦</span><div><strong>Más detalles</strong><p>Próximamente</p></div></div>
            </div>

            <div className="compartir-row">
              <span>Compartir producto</span>
              <div className="share-icons" aria-label="Opciones para compartir próximamente">
                <button type="button" disabled aria-label="Compartir próximamente">↗</button>
                <button type="button" disabled aria-label="Compartir próximamente">✉</button>
                <span className="placeholder-etiqueta">Próximamente</span>
              </div>
            </div>
          </div>
        </div>

        <section className="relacionados-section">
          <h2>Descubre más productos</h2>
          <p className="relacionados-sub">Explora el catálogo para encontrar tu próximo favorito.</p>
          <div className="relacionados-grid">
            <Link to="/productos" className="rel-card">
              <div className="rel-img-box"><img src={imagenProductoPredeterminada} alt="" /><span className="tag-card-s">Catálogo</span></div>
              <div className="rel-info"><h3>Ver todos los productos</h3><p>Consulta las opciones disponibles en nuestro catálogo.</p><div className="rel-footer-card"><span className="rel-precio">Explorar</span><span className="btn-mini-agregar">Ver catálogo →</span></div></div>
            </Link>
            <div className="rel-card rel-card-placeholder" aria-label="Productos relacionados próximamente">
              <div className="rel-img-box rel-img-placeholder"><span>Próximamente</span></div>
              <div className="rel-info"><h3>Productos relacionados</h3><p>Las recomendaciones se integrarán cuando estén disponibles en la API.</p><div className="rel-footer-card"><span className="rel-precio">Próximamente</span></div></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
