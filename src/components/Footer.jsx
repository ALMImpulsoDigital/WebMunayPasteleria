// src/components/Footer.jsx
import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  const phone = "5493541587914";
  const message = "Hola! Tengo una consulta sobre Pastelería Munay 😊";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <p className="footer__brand">Munay Pastelería</p>
          <p className="footer__muted">
            Hecho con amor para tus momentos especiales.
          </p>
        </div>

        <div className="footer__links">
          <Link to="/cookies">Cookies</Link>
          <Link to="/presupuesto">Presupuestos</Link>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            Contacto
          </a>
        </div>

        <p className="footer__copy">
          © {year} Munay. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
