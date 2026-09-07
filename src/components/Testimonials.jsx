import "./Testimonials.css";

const testimonialsData = [
  {
    id: 1,
    stars: 5,
    text: "¡El mejor helado artesanal que he probado en mi vida! El cono arcoíris es una experiencia única. Vuelvo cada semana sin falta.",
    name: "Valentina Rojas",
    role: "Cliente habitual",
    avatar: "/cliente-1.jpg", // Usa tus imágenes de la carpeta public
  },
  {
    id: 2,
    stars: 5,
    text: '"Cremissimo redefinió lo que significa un helado artesanal. Ingredientes frescos, sabores originales y una atención al cliente excepcional."',
    name: "Andrés Mendoza",
    role: "Foodie & Blogger",
    avatar: "/cliente-2.jpg",
  },
  {
    id: 3,
    stars: 5,
    text: '"Mis hijos piden ir a Cremissimo todos los fines de semana. El ambiente es increíble y los helados son pura magia. ¡Recomendadísimo!"',
    name: "Sofía Herrera",
    role: "Mamá de 3 hijos",
    avatar: "/cliente-3.jpg",
  },
];

function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        
        <div className="badge">
          <span className="badge-icon">💬</span> Testimonios
        </div>

        <h2 className="testimonials-title">Lo que dicen nuestros clientes</h2>

        <div className="testimonials-grid">
          {testimonialsData.map((item) => (
            <div key={item.id} className="testimonial-card">
              
              <div className="stars">
                {"★".repeat(item.stars)}
              </div>

              <p className="testimonial-text">{item.text}</p>

              <div className="card-divider"></div>

              <div className="user-info">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="user-avatar"
                />
                <div className="user-details">
                  <strong className="user-name">{item.name}</strong>
                  <span className="user-role">{item.role}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Testimonials;