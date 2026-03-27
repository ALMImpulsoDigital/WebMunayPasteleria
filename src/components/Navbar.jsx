import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../styles/navbar.css";

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
      key={locationKey}
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
          to="/tortas"
          className="nav__dropdownItem"
          role="menuitem"
          onClick={() => setOpen(false)}
        >
          Tortas
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

function PresupuestoDropdown({ locationKey }) {
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
      key={locationKey}
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
        PRESUPUESTO
        <span className="nav__chev" aria-hidden="true">
          ▾
        </span>
      </button>

      <div className="nav__dropdownMenu" role="menu">
        <NavLink
          to="/presupuesto/tortas"
          className="nav__dropdownItem"
          role="menuitem"
          onClick={() => setOpen(false)}
        >
          Tortas
        </NavLink>

        <NavLink
          to="/presupuesto"
          className="nav__dropdownItem"
          role="menuitem"
          onClick={() => setOpen(false)}
        >
          Otros productos
        </NavLink>
      </div>
    </div>
  );
}

export default function Navbar() {
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
          <PresupuestoDropdown locationKey={location.key} />
        </nav>
      </div>
    </header>
  );
}
