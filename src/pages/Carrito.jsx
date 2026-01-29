import { useState } from "react";
import { useCart } from "../context/CartContext";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../styles/carrito.css";

export default function Carrito() {
  const { items, total, updateQuantity, removeItem } = useCart();

  const [nombreCliente, setNombreCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [notas, setNotas] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const handlePagar = async (e) => {
    e.preventDefault();
    setMensajeError("");

    if (!items.length) {
      setMensajeError("Tu carrito está vacío.");
      return;
    }

    if (!nombreCliente || !emailCliente || !telefonoCliente) {
      setMensajeError("Completá todos los datos obligatorios.");
      return;
    }

    try {
      setEnviando(true);

      const pedidoRef = await addDoc(collection(db, "pedidos"), {
        nombreCliente,
        emailCliente,
        telefonoCliente,

        notas,
        estado: "pendiente_pago",
        estadoPago: "pending",
        total,
        items: items.map((item) => ({
          cookieId: item.id,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          subtotal: item.cantidad * item.precioUnitario,
        })),
        fechaCreacion: serverTimestamp(),
      });

      const response = await fetch(
        "https://us-central1-pasteleria-munay.cloudfunctions.net/createPreference",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idPedido: pedidoRef.id }),
        },
      );

      if (!response.ok) {
        setMensajeError(
          "Ocurrió un error al iniciar el pago. Intentá nuevamente.",
        );
        setEnviando(false);
        return;
      }

      const data = await response.json();
      window.location.href = data.init_point;
    } catch (err) {
      console.error(err);
      setMensajeError(
        "Ocurrió un error al iniciar el pago. Intentá nuevamente.",
      );
    } finally {
      setEnviando(false);
    }
  };

  if (!items.length) {
    return (
      <section className="cart-page">
        <div className="cart-container">
          <h2 className="cart-title">Tu pedido</h2>
          <p className="cart-empty">Tu carrito está vacío.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-container">
        <header className="cart-header">
          <h2 className="cart-title">Tu pedido</h2>
          <p className="cart-subtitle">
            Revisá tu pedido y completá tus datos para pagar.
          </p>
        </header>

        {mensajeError && <p className="cart-error">{mensajeError}</p>}

        <div className="cart-layout">
          {/* Lista de items */}
          <div className="cart-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                {item.imagen && (
                  <img
                    className="cart-item__img"
                    src={item.imagen}
                    alt={item.nombre}
                  />
                )}

                <div className="cart-item__info">
                  <strong className="cart-item__name">{item.nombre}</strong>
                  <p className="cart-item__price">${item.precioUnitario}</p>

                  <div className="cart-item__qty">
                    <label className="cart-item__label">Cantidad:</label>

                    <input
                      className="cart-item__input"
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                    />

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="cart-item__remove"
                    >
                      Quitar
                    </button>
                  </div>
                </div>

                <div className="cart-item__subtotal">
                  ${item.cantidad * item.precioUnitario}
                </div>
              </div>
            ))}

            <div className="cart-total">
              <span>Total</span>
              <strong>${total}</strong>
            </div>
          </div>

          {/* Datos del cliente */}
          <form className="cart-form" onSubmit={handlePagar}>
            <h3 className="cart-form__title">Datos de contacto</h3>

            <label className="cart-field">
              <span>Nombre completo *</span>
              <input
                type="text"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                required
              />
            </label>

            <label className="cart-field">
              <span>Email *</span>
              <input
                type="email"
                value={emailCliente}
                onChange={(e) => setEmailCliente(e.target.value)}
                required
              />
            </label>

            <label className="cart-field">
              <span>Teléfono *</span>
              <input
                type="text"
                value={telefonoCliente}
                onChange={(e) => setTelefonoCliente(e.target.value)}
                required
              />
            </label>

            <label className="cart-field">
              <span>Notas (opcional)</span>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
              />
            </label>

            <button type="submit" disabled={enviando} className="cart-paybtn">
              {enviando
                ? "Redirigiendo a Mercado Pago..."
                : "Confirmar y pagar"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
