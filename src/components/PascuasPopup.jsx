import { useState } from "react";
import "../styles/pascuasPopup.css";

export default function PascuasPopup() {
  const [open, setOpen] = useState(true);

  const phone = "5493541587914";
  const message = "Hola! Quiero encargar mi huevo de Pascua 😊";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  if (!open) return null;

  return (
    <div className="pascuas-overlay" onClick={() => setOpen(false)}>
      <div
        className="pascuas-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pascuas-title"
      >
        <button
          className="pascuas-close"
          onClick={() => setOpen(false)}
          aria-label="Cerrar anuncio"
          type="button"
        >
          ×
        </button>

        <div className="pascuas-content">
          <h2 id="pascuas-title" className="pascuas-title">
            Estamos en época de Pascuas, encargá tu huevo ahora!
          </h2>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pascuas-btn"
          >
            Quiero mi huevo
          </a>
        </div>
      </div>
    </div>
  );
}
