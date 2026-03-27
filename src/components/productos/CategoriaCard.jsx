// src/components/productos/CategoriaCard.jsx
import "../../styles/categoriaCard.css";
import { NavLink } from "react-router-dom";

export default function CategoriaCard({ categoria, onVerFotos, esTorta }) {
  const linkPresupuesto = esTorta ? "/presupuesto/tortas" : "/presupuesto";

  return (
    <article className="cat-card">
      <div className="cat-card__imgWrap">
        <img
          className="cat-card__img"
          src={categoria.imagen}
          alt={categoria.nombre}
          loading="lazy"
        />
      </div>

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
          to={linkPresupuesto}
          className="btn-soft-link btn-soft-link--mint"
        >
          Pedir presupuesto
        </NavLink>
      </div>
    </article>
  );
}
