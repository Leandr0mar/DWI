import "./footer.css";
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa6";
import empresa1 from "../../assets/footer/empresa-1.jpg";
import empresa2 from "../../assets/footer/empresa-2.jpg";
import empresa3 from "../../assets/footer/empresa-3.jpg";
import logoCremissimo from "../../assets/footer/Logo-cremissimo.jpg";
import logoUniversidad from "../../assets/footer/Logo-universidad.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* =========================
            REDES SOCIALES
        ========================== */}
        <section className="footer-social">
          <h2>Síguenos</h2>

          <div className="social-item">
            <div className="social-icon instagram">
              <FaInstagram />
            </div>
            <div className="social-info">
              <strong>Instagram</strong>
              <span>@cremissimo_oficial</span>
            </div>
            <span className="external-icon">↗</span>
          </div>

          <div className="social-item">
            <div className="social-icon facebook">
              <FaFacebookF />
            </div>
            <div className="social-info">
              <strong>Facebook</strong>
              <span>Cremissimo Oficial</span>
            </div>
            <span className="external-icon">↗</span>
          </div>

          <div className="social-item">
            <div className="social-icon tiktok">
              <FaTiktok />
            </div>
            <div className="social-info">
              <strong>TikTok</strong>
              <span>@cremissimo</span>
            </div>
            <span className="external-icon">↗</span>
          </div>

          <div className="social-item">
            <div className="social-icon youtube">
              <FaYoutube />
            </div>
            <div className="social-info">
              <strong>YouTube</strong>
              <span>Cremissimo TV</span>
            </div>
            <span className="external-icon">↗</span>
          </div>
        </section>

        {/* =========================
            CONTACTO
        ========================== */}
        <section className="footer-contact">
 

          <h2>Contacto</h2>

          <div className="contact-card">
            <div className="email-icon">✉</div>
            <a href="mailto:contacto@cremissimo.com" className="email">
              contacto@cremissimo.com
            </a>
            <div className="contact-line"></div>
            <strong className="contact-name">Leandro Omar Candia Falcon</strong>
            <span className="contact-position">
              Director de Atención al Cliente
            </span>
            <button className="contact-button">Escríbenos</button>
          </div>

          <div className="contact-information">
            <p>Parque Municipal 123, Barranco, Lima</p>
            <p>Tel: +51 912 345 678</p>
            <p>Lun–Dom: 10:00 – 22:00</p>
          </div>
        </section>

        {/* =========================
            EMPRESAS AFILIADAS
        ========================== */}
        <section className="footer-affiliates">
          <h2>Empresas Afiliadas</h2>

          <a
            href="https://www.bartori.com"
            target="_blank"
            rel="noopener noreferrer"
            className="affiliate-card"
          >
            <img src={empresa1} alt="Bartori" />
            <span className="affiliate-label">Afiliado</span>
            <strong>Bartori</strong>
          </a>

          <a
            href="https://www.fruverdelivery.com"
            target="_blank"
            rel="noopener noreferrer"
            className="affiliate-card"
          >
            <img src={empresa2} alt="Fruver Delivery" />
            <span className="affiliate-label">Afiliado</span>
            <strong>Fruver Delivery</strong>
          </a>

          <a
            href="https://www.nestle.com.pe"
            target="_blank"
            rel="noopener noreferrer"
            className="affiliate-card"
          >
            <img src={empresa3} alt="Nestlé" />
            <span className="affiliate-label">Afiliado</span>
            <strong>Nestlé</strong>
          </a>
        </section>
      </div> {/* <-- Aquí se cierra footer-container */}

      {/* =========================
          PARTE INFERIOR
      ========================== */}
      <div className="footer-bottom">
        {/* 1. IZQUIERDA: UNIVERSIDAD */}
        <div className="university-credit">
          <a
            href="https://www.utp.edu.pe"
            target="_blank"
            rel="noopener noreferrer"
            className="university-link"
          >
            <img
              src={logoUniversidad}
              alt="Universidad Tecnológica del Perú"
              className="university-logo"
            />
            <strong>Universidad Tecnológica del Perú</strong>
          </a>
        </div>

        {/* 2. CENTRO: HELADERÍA & COPYRIGHT */}
        <div className="copyright">
          <img
            src={logoCremissimo}
            alt="Cremissimo"
            className="footer-logo"
          />
          <span>
            © 2026 Cremissimo Helados Artesanales. Todos los derechos reservados.
          </span>
        </div>

        {/* 3. DERECHA: ENLACES Y VERSIÓN */}
        <div className="footer-links">
          <span className="version">v2.4.0</span>
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;