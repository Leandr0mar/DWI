import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../componets/common/header/Header';
import Footer from '../../componets/common/footer/Footer'; // O la ruta donde tengas tu footer
import './productos-detalle.css';

interface HeladoDetalle {
  idHelado: number;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  urlImagen: string;
  estado: string;
  categoria: string;
  pesoVolumen?: string;
  tipoPresentacion?: string;
}

export default function ProductosDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [producto, setProducto] = useState<HeladoDetalle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cantidad, setCantidad] = useState<number>(1);
  const [presentacionSeleccionada, setPresentacionSeleccionada] = useState<string>('1 LITRO');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetch(`http://localhost:8080/api/helados/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('No se pudo encontrar el producto');
          return res.json();
        })
        .then((data) => {
          setProducto(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error al cargar el detalle:", err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="detalle-page">
        <Header />
        <div style={{ textAlign: 'center', padding: '5rem', fontSize: '1.2rem', color: '#666' }}>
          Cargando detalles del helado artesanal...
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="detalle-page">
        <Header />
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <h2>Producto no encontrado</h2>
          <button onClick={() => navigate('/productos')} className="btn-volver-catalogo">
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detalle-page">
      {/* Navbar original mantenido */}
      <Header />

      <main className="detalle-main-container">
        {/* Contenedor principal de producto (2 columnas estilo la captura) */}
        <div className="detalle-grid-superior">
          
          {/* Columna Izquierda: Imágenes */}
          <div className="detalle-col-imagen">
            <div className="detalle-imagen-principal-wrapper">
              <span className="badge-artesanal">100% Artesanal</span>
              <span className="badge-temporada">Sabor de Temporada</span>
              <img 
                src={producto.urlImagen} 
                alt={producto.nombre} 
                className="detalle-imagen-principal" 
              />
            </div>

            {/* Miniaturas de galería simuladas / estéticas */}
            <div className="detalle-galeria-minaturas">
              <img src={producto.urlImagen} alt="Vista 1" className="miniatura active" />
              <img src={producto.urlImagen} alt="Vista 2" className="miniatura" />
              <img src={producto.urlImagen} alt="Vista 3" className="miniatura" />
              <img src={producto.urlImagen} alt="Vista 4" className="miniatura" />
            </div>
          </div>

          {/* Columna Derecha: Información y compra */}
          <div className="detalle-col-info">
            <div className="detalle-linea-header">
              <span className="detalle-linea-frutal">LÍNEA ARTESANAL DE GRANJA</span>
              <span className="detalle-sku">SKU: CRM-BLU-{producto.idHelado}</span>
            </div>

            <h1 className="detalle-titulo-producto">{producto.nombre}</h1>

            <div className="detalle-rating-box">
              <span className="estrellas">★★★★★</span>
              <span className="rating-num">4.9</span>
              <span className="rating-reviews">· 34 valoraciones de clientes</span>
            </div>

            <div className="detalle-precio-box">
              <span className="precio-actual">S/ {producto.precio.toFixed(2)}</span>
              <span className="iva-tag">IVA incluido</span>
              <span className="litro-tag">{producto.pesoVolumen || '1 Litro Familiar'}</span>
            </div>

            <p className="detalle-descripcion-texto">
              {producto.descripcion}
            </p>

            {/* Selector de presentaciones */}
            <div className="presentacion-seccion">
              <label className="presentacion-label-titulo">
                SELECCIONA LA PRESENTACIÓN <span>{producto.pesoVolumen || '1 LITRO (950 gr)'}</span>
              </label>
              <div className="presentacion-opciones-grid">
                <button 
                  className={`pres-btn ${presentacionSeleccionada === '1 BOLA' ? 'active' : ''}`}
                  onClick={() => setPresentacionSeleccionada('1 BOLA')}
                >
                  <strong>1 BOLA</strong>
                  <span>130 gr</span>
                </button>
                <button 
                  className={`pres-btn ${presentacionSeleccionada === '2 BOLAS' ? 'active' : ''}`}
                  onClick={() => setPresentacionSeleccionada('2 BOLAS')}
                >
                  <strong>2 BOLAS</strong>
                  <span>250 gr</span>
                </button>
                <button 
                  className={`pres-btn ${presentacionSeleccionada === '1/2 LITRO' ? 'active' : ''}`}
                  onClick={() => setPresentacionSeleccionada('1/2 LITRO')}
                >
                  <strong>1/2 LITRO</strong>
                  <span>500 gr</span>
                </button>
                <button 
                  className={`pres-btn ${presentacionSeleccionada === '1 LITRO' ? 'active' : ''}`}
                  onClick={() => setPresentacionSeleccionada('1 LITRO')}
                >
                  <strong>1 LITRO</strong>
                  <span>950 gr</span>
                </button>
              </div>
            </div>

            {/* Controles de cantidad y botones de acción */}
            <div className="detalle-acciones-compra">
              <div className="contador-cantidad-box">
                <button 
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="btn-cont"
                >
                  -
                </button>
                <span className="num-cont">{cantidad}</span>
                <button 
                  onClick={() => setCantidad(cantidad + 1)}
                  className="btn-cont"
                >
                  +
                </button>
              </div>

              <button 
                className="btn-accion-cesta"
                onClick={() => alert(`¡${cantidad} producto(s) añadido(s) a la cesta!`)}
              >
                🛒 Añadir a la cesta
              </button>

              <button 
                className="btn-accion-comprar"
                onClick={() => alert('Procesando compra directa...')}
              >
                Comprar ahora
              </button>
            </div>

            {/* Iconos de beneficios */}
            <div className="detalle-beneficios-grid">
              <div className="beneficio-item">
                <span className="ben-icon">🛡️</span>
                <div>
                  <strong>100% Natural</strong>
                  <p>Sin saborizantes</p>
                </div>
              </div>
              <div className="beneficio-item">
                <span className="ben-icon">❄️</span>
                <div>
                  <strong>Envío Frío</strong>
                  <p>Caja térmica sellada</p>
                </div>
              </div>
              <div className="beneficio-item">
                <span className="ben-icon">⏱️</span>
                <div>
                  <strong>En 45 min</strong>
                  <p>Delivery en tu puerta</p>
                </div>
              </div>
            </div>

            <div className="compartir-row">
              <span>Compartir este sabor:</span>
              <div className="share-icons">
                <button title="Comentarios">💬</button>
                <button title="Foto">📷</button>
                <button title="Compartir">🔗</button>
              </div>
            </div>

          </div>
        </div>

        {/* Sección inferior: También te puede interesar */}
        <section className="relacionados-section">
          <h2>También te puede interesar</h2>
          <p className="relacionados-sub">Descubre más de nuestras creaciones artesanales hechas con amor y fruta pura.</p>
          
          <div className="relacionados-grid">
            <Link to="/productos" className="rel-card">
              <div className="rel-img-box" style={{ background: '#fce4ec' }}>
                <span className="tag-card-s">Más vendido</span>
                <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2185b', fontWeight: 'bold' }}>Cono Arcoíris</div>
              </div>
              <div className="rel-info">
                <h3>Cono Arcoíris</h3>
                <p>Tres sabores artesanales en cono de waffle crujiente...</p>
                <div className="rel-footer-card">
                  <span className="rel-precio">S/ 4.50</span>
                  <span className="btn-mini-agregar">Ver más</span>
                </div>
              </div>
            </Link>

            <Link to="/productos" className="rel-card">
              <div className="rel-img-box" style={{ background: '#ffebee' }}>
                <span className="tag-card-s">Temporada</span>
                <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d32f2f', fontWeight: 'bold' }}>Fresa Cremosa</div>
              </div>
              <div className="rel-info">
                <h3>Fresa Cremosa</h3>
                <p>Helado artesanal de fresa fresca con trocitos...</p>
                <div className="rel-footer-card">
                  <span className="rel-precio">S/ 6.80</span>
                  <span className="btn-mini-agregar">Ver más</span>
                </div>
              </div>
            </Link>

            <Link to="/productos" className="rel-card">
              <div className="rel-img-box" style={{ background: '#e0f7fa' }}>
                <span className="tag-card-s">Nuevo</span>
                <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00796b', fontWeight: 'bold' }}>Cono Azul Mágico</div>
              </div>
              <div className="rel-info">
                <h3>Cono Azul Mágico</h3>
                <p>Sorpresa de arándano y menta azul, visualmente...</p>
                <div className="rel-footer-card">
                  <span className="rel-precio">S/ 4.20</span>
                  <span className="btn-mini-agregar">Ver más</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}