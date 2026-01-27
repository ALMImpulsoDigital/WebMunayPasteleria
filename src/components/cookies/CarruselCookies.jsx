// src/components/cookies/CarruselCookies.jsx
import { useState } from "react";

export default function CarruselCookies({ cookie, onClose }) {
  // Si tiene array de imagenes, lo usamos. Si no, usamos la imagen principal.
  const imagenes =
    cookie.imagenes && cookie.imagenes.length > 0
      ? cookie.imagenes
      : cookie.imagen
      ? [cookie.imagen]
      : [];

  const [index, setIndex] = useState(0);

  if (!imagenes.length) {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
          <p>No hay fotos cargadas para esta cookie.</p>
        </div>
      </div>
    );
  }

  const actual = imagenes[index];

  const handlePrev = () => {
    setIndex((i) => (i === 0 ? imagenes.length - 1 : i - 1));
  };

  const handleNext = () => {
    setIndex((i) => (i + 1) % imagenes.length);
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        {/* Botón cerrar */}
        <button style={closeButtonStyle} onClick={onClose} aria-label="Cerrar">
          ×
        </button>

        {/* Imagen + flechas */}
        <div style={imageWrapperStyle}>
          <img src={actual} alt={cookie.nombre} style={imageStyle} />

          {/* Flecha izquierda */}
          {imagenes.length > 1 && (
            <button
              style={{ ...arrowButtonStyle, left: "0.4rem" }}
              onClick={handlePrev}
              aria-label="Anterior"
            >
              ‹
            </button>
          )}

          {/* Flecha derecha */}
          {imagenes.length > 1 && (
            <button
              style={{ ...arrowButtonStyle, right: "0.4rem" }}
              onClick={handleNext}
              aria-label="Siguiente"
            >
              ›
            </button>
          )}
        </div>

        {/* Nombre y precio */}
        <p style={nombreStyle}>{cookie.nombre}</p>
        {cookie.precioUnitario && (
          <p style={precioStyle}>${cookie.precioUnitario}</p>
        )}
      </div>
    </div>
  );
}

/* --- estilos (mismos que productos, adaptados) --- */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const cardStyle = {
  position: "relative",
  background: "#fffdfd",
  borderRadius: "10px",
  padding: "0.5rem 0.5rem 0.9rem",
  width: "90%",
  maxWidth: "460px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
  textAlign: "center",
};

const imageWrapperStyle = {
  position: "relative",
  borderRadius: "8px",
  overflow: "hidden",
};

const imageStyle = {
  width: "100%",
  maxHeight: "320px",
  objectFit: "cover",
  display: "block",
};

const arrowButtonStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: "2rem",
  cursor: "pointer",
  padding: "0 0.3rem",
  lineHeight: 1,
  textShadow: "0 0 6px rgba(0,0,0,0.6)",
};

const closeButtonStyle = {
  position: "absolute",
  top: "0.4rem",
  right: "0.4rem",
  background: "transparent",
  border: "none",
  fontSize: "1.8rem",
  color: "#c96b84",
  textShadow: "0 0 8px rgba(0,0,0,0.7)",
  cursor: "pointer",
  zIndex: 20,
  lineHeight: 1,
};

const nombreStyle = {
  margin: "0.5rem 0 0",
  fontSize: "0.9rem",
  color: "#555",
  fontWeight: 500,
};

const precioStyle = {
  margin: "0.2rem 0 0",
  fontSize: "1rem",
  color: "#b04863",
  fontWeight: 600,
};
