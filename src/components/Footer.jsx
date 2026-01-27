// src/components/Footer.jsx
import "../styles/footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

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
          <a href="/cookies">Cookies</a>
          <a href="/presupuestos">Presupuestos</a>
          <a href="/contacto">Contacto</a>
        </div>

        <p className="footer__copy">
          © {year} Munay. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
