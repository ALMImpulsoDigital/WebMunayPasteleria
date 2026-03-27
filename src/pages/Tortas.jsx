import { useState } from "react";
import CategoriaCard from "../components/productos/CategoriaCard";
import CarruselCategoria from "../components/productos/CarruselCategoria";
import { categoriasTortas } from "../data/categoriasTortas";

import "../styles/productos.css";

export default function Tortas() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  return (
    <section className="productos-page">
      <div className="productos-container">
        <header className="productos-header">
          <h2 className="productos-title">Tortas Personalizadas</h2>
          <p className="productos-subtitle">
            Elegí una categoría para ver ejemplos de tortas realizadas.
          </p>
        </header>

        <div className="productos-grid">
          {categoriasTortas.map((cat) => (
            <CategoriaCard
              key={cat.id}
              categoria={cat}
              esTorta={true}
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
