// src/pages/Presupuesto.jsx
import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/presupuesto.css";

export default function Presupuesto() {
  const [formData, setFormData] = useState({
    nombreCliente: "",
    emailCliente: "",
    telefonoCliente: "",
    tipoEvento: "",
    productoDeseado: "", // 👈 NUEVO CAMPO
    cantidadPersonas: 1,
    fechaEvento: "",
    saboresPreferidos: "",
    restricciones: "",
    descripcionPedido: "",
  });

  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cantidadPersonas"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    // ✅ VALIDACIONES
    if (!formData.nombreCliente.trim()) {
      return setError("Por favor ingresá tu nombre.");
    }
    if (!formData.emailCliente.trim()) {
      return setError("Por favor ingresá un email de contacto.");
    }
    if (!formData.telefonoCliente.trim()) {
      return setError("Por favor ingresá un teléfono de contacto.");
    }
    if (!formData.tipoEvento.trim()) {
      return setError("Por favor seleccioná el tipo de evento.");
    }
    if (!formData.productoDeseado.trim()) {
      return setError("Por favor seleccioná el producto deseado.");
    }
    if (!formData.fechaEvento) {
      return setError("Por favor seleccioná la fecha del evento.");
    }
    if (!formData.cantidadPersonas || formData.cantidadPersonas <= 0) {
      return setError("La cantidad de personas debe ser mayor a 0.");
    }

    try {
      setEnviando(true);

      const fechaEventoDate = new Date(formData.fechaEvento);

      await addDoc(collection(db, "presupuestos"), {
        nombreCliente: formData.nombreCliente.trim(),
        emailCliente: formData.emailCliente.trim(),
        telefonoCliente: formData.telefonoCliente.trim(),
        tipoEvento: formData.tipoEvento.trim(),
        productoDeseado: formData.productoDeseado.trim(), // 👈 GUARDAMOS EL PRODUCTO
        cantidadPersonas: Number(formData.cantidadPersonas),
        fechaEvento: Timestamp.fromDate(fechaEventoDate),
        saboresPreferidos: formData.saboresPreferidos.trim(),
        restricciones: formData.restricciones.trim(),
        descripcionPedido: formData.descripcionPedido.trim(),
        estado: "pendiente",
        fechaCreacion: serverTimestamp(),
      });

      const numeroWhatsApp = "5493541587914"; // 👈 tu número con código de país y sin espacios

      const mensaje = `
Hola! Soy ${formData.nombreCliente} y quiero solicitar un presupuesto 🎉

Evento: ${formData.tipoEvento}
Fecha: ${formData.fechaEvento}
Cantidad de personas: ${formData.cantidadPersonas}

Producto deseado: ${formData.productoDeseado}
Sabores preferidos: ${formData.saboresPreferidos || "No especificado"}
Restricciones/alergias: ${formData.restricciones || "No especificado"}

Teléfono: ${formData.telefonoCliente}
Email: ${formData.emailCliente}

Detalles del pedido:
${formData.descripcionPedido || "Sin detalles adicionales."}
`;

      // Armamos la URL de WhatsApp
      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
        mensaje
      )}`;

      // Abrimos WhatsApp en una nueva pestaña
      window.open(urlWhatsApp, "_blank");

      setMensaje("¡Tu solicitud de presupuesto se envió correctamente! 😊");
      setFormData({
        nombreCliente: "",
        emailCliente: "",
        telefonoCliente: "",
        tipoEvento: "",
        productoDeseado: "",
        cantidadPersonas: 1,
        fechaEvento: "",
        saboresPreferidos: "",
        restricciones: "",
        descripcionPedido: "",
      });
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al enviar el presupuesto. Intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  // Para no permitir fechas anteriores a hoy
  const hoyISO = new Date().toISOString().split("T")[0];

  return (
    <section className="presupuesto-section">
      <h2>Solicitar presupuesto</h2>
      <p>
        Contanos qué estás planeando y te vamos a responder con una propuesta
        personalizada para tu evento.
      </p>

      <form className="presupuesto-form" onSubmit={handleSubmit}>
        {/* DATOS DE CONTACTO */}
        <div className="presupuesto-grid">
          <div className="campo">
            <label htmlFor="nombreCliente">Nombre y Apellido *</label>
            <input
              type="text"
              id="nombreCliente"
              name="nombreCliente"
              value={formData.nombreCliente}
              onChange={handleChange}
              placeholder="Ej: Nombre y Apellido"
            />
          </div>

          <div className="campo">
            <label htmlFor="emailCliente">Email *</label>
            <input
              type="email"
              id="emailCliente"
              name="emailCliente"
              value={formData.emailCliente}
              onChange={handleChange}
              placeholder="Ej: tuemail@gmail.com"
            />
          </div>

          <div className="campo">
            <label htmlFor="telefonoCliente">Teléfono / WhatsApp *</label>
            <input
              type="tel"
              id="telefonoCliente"
              name="telefonoCliente"
              value={formData.telefonoCliente}
              onChange={handleChange}
              placeholder="Ej: 3541-123456"
            />
          </div>
        </div>

        {/* INFO DEL EVENTO + PRODUCTO */}
        <div className="presupuesto-grid">
          <div className="campo">
            <label htmlFor="tipoEvento">Tipo de evento *</label>
            <select
              id="tipoEvento"
              name="tipoEvento"
              value={formData.tipoEvento}
              onChange={handleChange}
            >
              <option value="">Seleccioná una opción</option>
              <option value="Cumpleaños">Cumpleaños</option>
              <option value="Casamiento">Casamiento</option>
              <option value="Bautismo">Bautismo</option>
              <option value="Evento corporativo">Evento corporativo</option>
              <option value="Reunión familiar">Reunión familiar</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="productoDeseado">Producto deseado *</label>
            <select
              id="productoDeseado"
              name="productoDeseado"
              value={formData.productoDeseado}
              onChange={handleChange}
            >
              <option value="">Seleccioná un producto</option>
              <option value="Torta personalizada">Torta personalizada</option>
              <option value="Mesa dulce">Mesa dulce</option>
              <option value="Cookies decoradas">Cookies decoradas</option>
              <option value="Cupcakes decorados">Cupcakes decorados</option>
              <option value="Mini postres / mini tartas">
                Mini postres / mini tartas
              </option>
              <option value="Alfajores artesanales">
                Alfajores artesanales
              </option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="cantidadPersonas">Cantidad de personas *</label>
            <input
              type="number"
              id="cantidadPersonas"
              name="cantidadPersonas"
              min="1"
              value={formData.cantidadPersonas}
              onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label htmlFor="fechaEvento">Fecha del evento *</label>
            <input
              type="date"
              id="fechaEvento"
              name="fechaEvento"
              value={formData.fechaEvento}
              onChange={handleChange}
              min={hoyISO}
            />
          </div>
        </div>

        {/* DETALLES DEL PEDIDO */}
        <div className="campo">
          <label htmlFor="saboresPreferidos">Sabores preferidos</label>
          <textarea
            id="saboresPreferidos"
            name="saboresPreferidos"
            value={formData.saboresPreferidos}
            onChange={handleChange}
            rows={2}
            placeholder="Ej: chocolate, frutos rojos, lemon pie, tiramisú..."
          />
        </div>

        <div className="campo">
          <label htmlFor="restricciones">
            Restricciones / alergias / preferencias especiales
          </label>
          <textarea
            id="restricciones"
            name="restricciones"
            value={formData.restricciones}
            onChange={handleChange}
            rows={2}
            placeholder="Ej: sin TACC, sin azúcar, opciones veganas…"
          />
        </div>

        <div className="campo">
          <label htmlFor="descripcionPedido">
            Contanos un poco más sobre lo que necesitás
          </label>
          <textarea
            id="descripcionPedido"
            name="descripcionPedido"
            value={formData.descripcionPedido}
            onChange={handleChange}
            rows={4}
            placeholder="Ej: Mesa dulce con torta principal, cupcakes y cookies decoradas con temática floral pastel..."
          />
        </div>

        <p className="mensaje-info">
          Tu solicitud se enviará a <strong>Munay Pastelería</strong> y también
          podrás enviarla directamente por WhatsApp para una respuesta más
          rápida 💬✨
        </p>

        {/* MENSAJES */}
        {error && <p className="mensaje-error">{error}</p>}
        {mensaje && <p className="mensaje-exito">{mensaje}</p>}

        <button type="submit" disabled={enviando} className="btn-enviar">
          {enviando ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>
    </section>
  );
}
