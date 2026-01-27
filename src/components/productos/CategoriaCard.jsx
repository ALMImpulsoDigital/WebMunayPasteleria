import "../../styles/categoriaCard.css";
import { NavLink } from "react-router-dom";

export default function CategoriaCard({ categoria, onVerFotos }) {
  return (
    <article className="cat-card">
      <img
        className="cat-card__img"
        src={categoria.imagen}
        alt={categoria.nombre}
        loading="lazy"
      />

      <h3 className="cat-card__title">{categoria.nombre}</h3>

      {categoria.descripcion && (
        <p className="cat-card__desc">{categoria.descripcion}</p>
      )}

      <div className="cat-card__actions">
        <button
          type="button"
          onClick={() => onVerFotos(categoria.id)}
          className="btn-soft btn-soft--pink"
        >
          Ver fotos
        </button>

        <NavLink
          to="/presupuesto"
          className="btn-soft-link btn-soft-link--mint"
        >
          Pedir presupuesto
        </NavLink>
      </div>
    </article>
  );
}
