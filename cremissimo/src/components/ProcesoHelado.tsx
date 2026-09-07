export default function ProcesoHelado() {
  return (
    <section className="proceso-section" id="proceso">
      <div className="proceso-overlay">
        <span className="proceso-etiqueta">🎬 Conoce Cremissimo</span>
        <h2>La magia detrás de cada helado</h2>
        <p>
          Descubre el proceso artesanal que hace únicos a nuestros helados. Desde los ingredientes hasta el cono final.
        </p>

        <div className="video-container">
          <img
            src="https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=1200&q=80"
            alt="Proceso artesanal del helado"
          />
          <button className="play-button" type="button" aria-label="Reproducir video">▶</button>
          <div className="video-info">▶ El proceso artesanal de Cremissimo — 3:42</div>
        </div>
      </div>
    </section>
  )
}
