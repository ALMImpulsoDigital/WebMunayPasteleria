// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // 👈 nuevo

export default function Header() {
  const { items } = useCart(); // 👈 leemos el carrito
  const cantidad = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <header
      style={{
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #f3c5cd",
        backgroundColor: "#fff7f9",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#c96b84" }}>
        Munay Pastelería
      </h1>

      <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link to="/">Inicio</Link>
        <Link to="/productos">Tortas y mesas dulces</Link>
        <Link to="/cookies">Cookies y boxes</Link>
        <Link to="/presupuesto">Presupuesto</Link>

        {/* Carrito */}
        <Link to="/carrito" style={{ position: "relative" }}>
          Carrito
          {cantidad > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-0.4rem",
                right: "-0.8rem",
                background: "#c96b84",
                color: "white",
                borderRadius: "999px",
                padding: "0 0.35rem",
                fontSize: "0.7rem",
                minWidth: "1.1rem",
                textAlign: "center",
              }}
            >
              {cantidad}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
