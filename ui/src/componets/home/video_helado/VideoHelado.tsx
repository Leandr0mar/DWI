import "./video_helado.css"

function VideoHelado() {
  return (
    <section className="proceso-section" id="proceso">
      <div className="proceso-overlay">
        <h2>La magia detrás de cada helado</h2>
        <p>
          Descubre el proceso artesanal que hace únicos a nuestros helados. Desde los ingredientes hasta el cono final.
        </p>

        <div className="video-container">
          <iframe
            src="https://www.youtube.com/embed/FKqGHLjSXb8"
            title="Promotional video for Ice Cream"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}

export default VideoHelado