import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "../../styles/carrusel.css";

export default function CarruselCategoria({ categoriaId, onClose }) {
  const [productos, setProductos] = useState([]);
  const [index, setIndex] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setCargando(true);
        const q = query(
          collection(db, "productos"),
          where("categoria", "==", categoriaId),
          where("activo", "==", true),
        );

        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(list);
        setIndex(0);
      } catch (error) {
        console.error("Error cargando productos de la categoría:", error);
      } finally {
        setCargando(false);
      }
    }

    if (categoriaId) fetchData();
  }, [categoriaId]);

  const handlePrev = () => {
    setIndex((i) => (i === 0 ? productos.length - 1 : i - 1));
  };

  const handleNext = () => {
    setIndex((i) => (i + 1) % productos.length);
  };

  return (
    <div
      className="car-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="car-card" onClick={(e) => e.stopPropagation()}>
        <button className="car-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>

        {cargando ? (
          <p className="car-msg">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="car-msg">
            No hay productos cargados para esta categoría todavía.
          </p>
        ) : (
          <>
            <div className="car-media">
              {productos[index]?.imagen && (
                <img
                  className="car-img"
                  src={productos[index].imagen}
                  alt={productos[index].nombre}
                />
              )}

              <button
                className="car-arrow car-arrow--left"
                onClick={handlePrev}
                aria-label="Anterior"
              >
                ‹
              </button>

              <button
                className="car-arrow car-arrow--right"
                onClick={handleNext}
                aria-label="Siguiente"
              >
                ›
              </button>
            </div>

            <p className="car-name">{productos[index].nombre}</p>
          </>
        )}
      </div>
    </div>
  );
}
