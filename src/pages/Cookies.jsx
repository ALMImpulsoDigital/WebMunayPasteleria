import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import CookieCard from "../components/cookies/CategoriaCookieCard";
import CarruselCookies from "../components/cookies/CarruselCookies";
import { useCart } from "../context/CartContext";

import "../styles/cookies.css";

export default function Cookies() {
  const [cookies, setCookies] = useState([]);
  const [cookieSeleccionada, setCookieSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchCookies() {
      try {
        setCargando(true);
        const q = query(collection(db, "cookies"), where("activo", "==", true));
        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCookies(list);
      } catch (e) {
        console.error("Error cargando cookies:", e);
      } finally {
        setCargando(false);
      }
    }

    fetchCookies();
  }, []);

  if (cargando) {
    return (
      <section className="cookies-page">
        <div className="cookies-container">
          <p className="cookies-loading">Cargando cookies...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="cookies-page">
      <div className="cookies-container">
        <header className="cookies-header">
          <h2 className="cookies-title">Nuestras Cookies</h2>
          <p className="cookies-subtitle">
            Elegí tu favorita para ver más fotos o agregarla al carrito.
          </p>
        </header>

        <div className="cookies-grid">
          {cookies.map((cookie) => (
            <CookieCard
              key={cookie.id}
              cookie={cookie}
              onVerFotos={() => setCookieSeleccionada(cookie)}
              onAgregarAlCarrito={() => addItem(cookie)}
            />
          ))}
        </div>

        {cookieSeleccionada && (
          <CarruselCookies
            cookie={cookieSeleccionada}
            onClose={() => setCookieSeleccionada(null)}
          />
        )}
      </div>
    </section>
  );
}
