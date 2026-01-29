import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
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

  const location = useLocation();
  const [avisoCerrado, setAvisoCerrado] = useState(false);

  const avisoTexto = useMemo(
    () =>
      `Las cookies se retiran únicamente por domicilio "******, Villa Carlos Paz, Córdoba".
Ccomunicate por WhatsApp para coordinar día y horario de retiro.`,
    [],
  );

  useEffect(() => {
    if (location.pathname === "/cookies") {
      setAvisoCerrado(false);
    }
  }, [location.key, location.pathname]);

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

  const cerrarAviso = () => {
    setAvisoCerrado(true);
  };

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

          {/* INFO FIJA BAJO EL TEXTO */}
          <div className="cookies-infoInline" role="note">
            <span className="cookies-infoInline__row">
              <span className="cookies-infoInline__icon" aria-hidden="true">
                📍
              </span>
              <span className="cookies-infoInline__text">
                Retiro por domicilio{" "}
                <b className="nowrap">"**** Villa Carlos Paz, Córdoba"</b>.
              </span>
            </span>

            <span className="cookies-infoInline__row cookies-infoInline__row--cta">
              <span className="cookies-infoInline__text">
                Coordiná por <b className="nowrap">WhatsApp</b>.
              </span>
            </span>
          </div>
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

      {/* ✅ AVISO MODAL: aparece siempre al entrar a /cookies */}
      {!avisoCerrado && (
        <div className="cookies-avisoOverlay" role="dialog" aria-modal="true">
          <div className="cookies-avisoCard">
            <button
              className="cookies-avisoClose"
              onClick={cerrarAviso}
              aria-label="Cerrar aviso"
            >
              ×
            </button>

            <h3 className="cookies-avisoTitle">Información importante</h3>

            <p className="cookies-avisoText">{avisoTexto}</p>
          </div>
        </div>
      )}
    </section>
  );
}
