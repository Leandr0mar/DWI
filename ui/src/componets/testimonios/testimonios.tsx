import "./testimonios.css";
import cliente1 from "../../assets/testimonios/cliente-1.jpg";
import cliente2 from "../../assets/testimonios/cliente-2.jpg";
import cliente3 from "../../assets/testimonios/cliente-3.jpg";

const testimoniosData = [
  {
    id: 1,
    stars: 5,
    text: "¡El mejor helado artesanal que he probado en mi vida! El cono arcoíris es una experiencia única. Vuelvo cada semana sin falta.",
    name: "Valentina Rojas",
    role: "Cliente habitual",
    avatar: cliente1,
  },
  {
    id: 2,
    stars: 5,
    text: '"Cremissimo redefinió lo que significa un helado artesanal. Ingredientes frescos, sabores originales y una atención al cliente excepcional."',
    name: "Andrés Mendoza",
    role: "Foodie & Blogger",
    avatar: cliente2,
  },
  {
    id: 3,
    stars: 5,
    text: '"Mis hijos piden ir a Cremissimo todos los fines de semana. El ambiente es increíble y los helados son pura magia. ¡Recomendadísimo!"',
    name: "Sofía Herrera",
    role: "Mamá de 3 hijos",
    avatar: cliente3,
  },
];

function Testimonios() {
  return (
    <section className="testimonials-section" id="testimonios">
      <div className="testimonials-container">
        

        <h2 className="testimonials-title">Lo que dicen nuestros clientes</h2>

        <div className="testimonials-grid">
          {testimoniosData.map((item) => (
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

export default Testimonios;