import { useState } from "react";
import CategoriaCard from "../components/productos/CategoriaCard";
import CarruselCategoria from "../components/productos/CarruselCategoria";
import { categorias } from "../data/categorias";

import "../styles/productos.css";

export default function Productos() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  return (
    <section className="productos-page">
      <div className="productos-container">
        <header className="productos-header">
          <h2 className="productos-title">Productos Especiales</h2>
          <p className="productos-subtitle">
            Elegí una categoría para ver ejemplos de nuestros trabajos.
          </p>
        </header>

        <div className="productos-grid">
          {categorias.map((cat) => (
            <CategoriaCard
              key={cat.id}
              categoria={cat}
              onVerFotos={(id) => setCategoriaSeleccionada(id)}
            />
          ))}
        </div>

        {categoriaSeleccionada && (
          <CarruselCategoria
            categoriaId={categoriaSeleccionada}
            onClose={() => setCategoriaSeleccionada(null)}
          />
        )}
      </div>
    </section>
  );
}
