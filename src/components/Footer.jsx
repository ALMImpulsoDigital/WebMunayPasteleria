// src/components/Footer.jsx
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
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            <span className="footer__icon">
              {/* WhatsApp SVG */}
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.52 3.48A11.8 11.8 0 0 0 12.05 0C5.43 0 .06 5.37.06 12c0 2.11.55 4.18 1.6 6.01L0 24l6.2-1.62A11.9 11.9 0 0 0 12.05 24c6.62 0 11.99-5.37 11.99-12 0-3.2-1.25-6.2-3.52-8.52zM12.05 21.8c-1.8 0-3.56-.48-5.1-1.4l-.36-.22-3.68.96.98-3.58-.23-.37A9.8 9.8 0 0 1 2.25 12c0-5.4 4.4-9.8 9.8-9.8 2.62 0 5.08 1.02 6.94 2.88A9.75 9.75 0 0 1 21.8 12c0 5.4-4.4 9.8-9.75 9.8zm5.4-7.3c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.1 4.48.71.3 1.26.48 1.7.61.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
              </svg>
            </span>
            WhatsApp
          </a>

          <a
            href="https://instagram.com/TU_USUARIO"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            <span className="footer__icon">
              {/* Instagram SVG */}
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5.3A4.7 4.7 0 1 1 7.3 12 4.7 4.7 0 0 1 12 7.3zm0 7.7A3 3 0 1 0 9 12a3 3 0 0 0 3 3zm4.8-8.9a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1z" />
              </svg>
            </span>
            Instagram
          </a>
        </div>
        <p className="footer__copy">
          © {year} Munay. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
