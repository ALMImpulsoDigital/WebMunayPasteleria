import "../../styles/cookieCard.css";

export default function CategoriaCookieCard({
  cookie,
  onVerFotos,
  onAgregarAlCarrito,
}) {
  return (
    <article className="cookie-card">
      {cookie.imagen && (
        <img
          className="cookie-card__img"
          src={cookie.imagen}
          alt={cookie.nombre}
          loading="lazy"
        />
      )}

      <h3 className="cookie-card__title">{cookie.nombre}</h3>

      {cookie.descripcion && (
        <p className="cookie-card__desc">{cookie.descripcion}</p>
      )}

      {cookie.precioUnitario && (
        <p className="cookie-card__price">${cookie.precioUnitario}</p>
      )}

      <div className="cookie-card__actions">
        <button
          type="button"
          onClick={onVerFotos}
          className="btn-soft btn-soft--pink"
        >
          Ver fotos
        </button>

        <button
          type="button"
          onClick={() => {
            if (onAgregarAlCarrito) onAgregarAlCarrito();
          }}
          className="btn-soft btn-soft--mint"
        >
          Agregar
        </button>
      </div>
    </article>
  );
}
