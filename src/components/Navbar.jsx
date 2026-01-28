// src/components/Navbar.jsx
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/navbar.css";

function CartIcon() {
  return (
    <svg
      className="cart-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2ZM7.2 14h9.9c.8 0 1.5-.5 1.8-1.2l2.1-5.1A1 1 0 0 0 20.1 6H6.2L5.8 4.6A1.5 1.5 0 0 0 4.4 3.5H2.5a1 1 0 1 0 0 2h1.5l2.3 8.2c.2.8 1 1.3 1.9 1.3Zm-.4-6h11.8l-1.6 3.8H7.9L6.8 8Z" />
    </svg>
  );
}

function ProductosDropdown({ locationKey }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, []);

  return (
    <div
      key={locationKey} // se reinicia al navegar
      className={`nav__dropdown ${open ? "is-open" : ""}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className="nav__link nav__dropdownToggle"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        PRODUCTOS{" "}
        <span className="nav__chev" aria-hidden="true">
          ▾
        </span>
      </button>

      <div className="nav__dropdownMenu" role="menu">
        <NavLink
          to="/cookies"
          className="nav__dropdownItem"
          role="menuitem"
          onClick={() => setOpen(false)}
        >
          Cookies
        </NavLink>

        <NavLink
          to="/productos"
          className="nav__dropdownItem"
          role="menuitem"
          onClick={() => setOpen(false)}
        >
          Otros Productos
        </NavLink>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + (item.cantidad || 0), 0);
  const location = useLocation();

  return (
    <header className="nav">
      <div className="nav__inner">
        <nav className="nav__links nav__links--left">
          <NavLink to="/" className="nav__link">
            INICIO
          </NavLink>
        </nav>

        <NavLink to="/" className="nav__brand" aria-label="Munay - Inicio">
          <img
            className="nav__logo"
            src="/assets/logo-munay.png"
            alt="Munay Pastelería"
          />
        </NavLink>

        <nav className="nav__links nav__links--right">
          <ProductosDropdown locationKey={location.key} />

          <NavLink to="/presupuesto" className="nav__link">
            PRESUPUESTO
          </NavLink>

          <NavLink
            to="/carrito"
            className="nav__link nav__cart"
            aria-label={`Carrito${cartCount ? `, ${cartCount} productos` : ""}`}
          >
            <span className="nav__cartIconWrap">
              <CartIcon />
              {cartCount > 0 && (
                <span className="nav__badge" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
