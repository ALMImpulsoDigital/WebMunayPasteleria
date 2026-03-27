// src/pages/PresupuestoTorta.jsx
import { useMemo, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/presupuestoTorta.css";
import TortaPreview from "../components/TortaPreview";

const OPC_PISOS = [
  { id: 1, label: "1 piso" },
  { id: 2, label: "2 pisos" },
];

const OPC_TAMANIOS = [
  // 1 piso (3 medidas)
  {
    id: "1p-15",
    pisos: 1,
    titulo: "15 cm",
    subtitulo: "2 rellenos",
    detalle: "15 porciones sugeridas",
  },
  {
    id: "1p-20",
    pisos: 1,
    titulo: "20 cm",
    subtitulo: "2 rellenos",
    detalle: "20/22 porciones sugeridas",
  },
  {
    id: "1p-25",
    pisos: 1,
    titulo: "25 cm",
    subtitulo: "2 rellenos",
    detalle: "30/32 porciones sugeridas",
  },

  // 2 pisos (3 medidas)
  {
    id: "2p-15",
    pisos: 2,
    titulo: "15 cm (2 pisos)",
    subtitulo: "4 rellenos",
    detalle: "aprox. 2 kg",
  },
  {
    id: "2p-20",
    pisos: 2,
    titulo: "20 cm (2 pisos)",
    subtitulo: "4 rellenos",
    detalle: "3–3,5 kg",
  },
  {
    id: "2p-25",
    pisos: 2,
    titulo: "25 cm (2 pisos)",
    subtitulo: "4 rellenos",
    detalle: "4–5 kg",
  },
];

const OPC_SABORES = [
  { id: "chocolate", label: "Chocolate" },
  { id: "vainilla", label: "Vainilla" },
  { id: "redvelvet", label: "Red Velvet" },
];

const OPC_RELLENOS = [
  {
    id: "ddl-merengue",
    label: "DDL con merengue",
    img: "/assets/rellenos/DdlMerengue.png",
  },
  {
    id: "ddl-chips",
    label: "DDL con chips de chocolate",
    img: "/assets/rellenos/DdlChips.png",
  },
  {
    id: "ddl-nuez",
    label: "DDL con nuez",
    img: "/assets/rellenos/DdlNuez.png",
  },
  {
    id: "oreo",
    label: "Oreo",
    img: "/assets/rellenos/Oreo.png",
  },
  {
    id: "mousse-frutilla",
    label: "Mousse de frutilla",
    img: "/assets/rellenos/MousseFrutilla.png",
  },
  {
    id: "mousse-chocolate",
    label: "Mousse de chocolate",
    img: "/assets/rellenos/MousseChocolate.png",
  },
  {
    id: "mocka",
    label: "Mocka",
    img: "/assets/rellenos/Mocka.png",
  },
  {
    id: "bonobon",
    label: "Bon o Bon",
    img: "/assets/rellenos/Bonobon.png",
  },
  {
    id: "chocotorta",
    label: "Chocotorta",
    img: "/assets/rellenos/Chocotorta.png",
  },
  {
    id: "crema-chocolate",
    label: "Crema con chocolate",
    img: "/assets/rellenos/CremaChocolate.png",
  },
  {
    id: "crema-frutilla",
    label: "Crema con frutilla",
    img: "/assets/rellenos/CremaFrutilla.png",
  },
  {
    id: "crema-durazno",
    label: "Crema con durazno",
    img: "/assets/rellenos/CremaDurazno.png",
  },
];

export default function PresupuestoTorta() {
  const [paso, setPaso] = useState(1);

  const [formData, setFormData] = useState({
    // selección torta
    pisos: "",
    tamanioId: "",
    saborId: "",
    rellenosIds: [], // array
    lookDescripcion: "",
    lookReferenciaUrl: "",

    // datos contacto
    nombreCliente: "",
    emailCliente: "",
    telefonoCliente: "",
    tipoEvento: "",
    cantidadPersonas: 1,
    fechaEvento: "",
    restricciones: "",
    descripcionPedido: "",
  });

  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const setField = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const pisosElegidos = useMemo(
    () => Number(formData.pisos) || 0,
    [formData.pisos],
  );

  const tamaniosFiltrados = useMemo(() => {
    if (!pisosElegidos) return [];
    return OPC_TAMANIOS.filter((t) => t.pisos === pisosElegidos);
  }, [pisosElegidos]);

  const tamanioElegido = useMemo(
    () => OPC_TAMANIOS.find((x) => x.id === formData.tamanioId),
    [formData.tamanioId],
  );

  const saborElegido = useMemo(
    () => OPC_SABORES.find((x) => x.id === formData.saborId),
    [formData.saborId],
  );

  const rellenosElegidos = useMemo(() => {
    const ids = Array.isArray(formData.rellenosIds) ? formData.rellenosIds : [];
    return ids
      .map((id) => OPC_RELLENOS.find((x) => x.id === id))
      .filter(Boolean);
  }, [formData.rellenosIds]);

  const cantRellenosPermitidos = useMemo(() => {
    if (pisosElegidos === 1) return 2;
    if (pisosElegidos === 2) return 4;
    return 0;
  }, [pisosElegidos]);

  // ✅ Paso que se muestra en la preview según lo confirmado (no según la pantalla)
  // ✅ Paso de imagen para la preview (según pantalla + lo que haya elegido)
  const pasoVista = useMemo(() => {
    const completos =
      cantRellenosPermitidos > 0 &&
      formData.rellenosIds.length === cantRellenosPermitidos;

    // Pantallas 1 y 2: siempre base (aunque ya haya elegido sabor/rellenos)
    if (paso <= 2) return 1;

    // Pantalla 3 (sabor): si eligió sabor, mostramos bizcochuelo, si no, base
    if (paso === 3) return formData.saborId ? 2 : 1;

    // Pantallas 4+ (rellenos/look/datos):
    if (completos) return 3;
    if (formData.saborId) return 2;
    return 1;
  }, [paso, formData.saborId, formData.rellenosIds, cantRellenosPermitidos]);

  const hoyISO = new Date().toISOString().split("T")[0];
  const numeroWhatsApp = "5493541587914";

  const requiereWhatsApp = pisosElegidos >= 2;

  const textoWhatsApp2Pisos = `Hola! Quiero solicitar un presupuesto de TORTA de ${pisosElegidos} pisos 🎂✨

(Desde la web) 
Quisiera que me cuenten opciones, tamaños y precios. Gracias!`;

  const urlWhatsApp2Pisos = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
    textoWhatsApp2Pisos,
  )}`;

  const puedeAvanzar = () => {
    if (requiereWhatsApp) return false;

    if (paso === 1) return !!formData.pisos;
    if (paso === 2) return !!formData.tamanioId;
    if (paso === 3) return !!formData.saborId;
    if (paso === 4)
      return (
        cantRellenosPermitidos > 0 &&
        formData.rellenosIds.length === cantRellenosPermitidos
      );

    return true;
  };

  const next = () => setPaso((p) => Math.min(6, p + 1));
  const prev = () => setPaso((p) => Math.max(1, p - 1));

  const toggleRelleno = (id) => {
    setFormData((prev) => {
      const actuales = Array.isArray(prev.rellenosIds) ? prev.rellenosIds : [];
      const yaEsta = actuales.includes(id);

      if (yaEsta) {
        return { ...prev, rellenosIds: actuales.filter((x) => x !== id) };
      }

      if (!cantRellenosPermitidos) return prev;
      if (actuales.length >= cantRellenosPermitidos) return prev;

      return { ...prev, rellenosIds: [...actuales, id] };
    });
  };

  const validarFinal = () => {
    if (!formData.tamanioId) return "Por favor elegí el tamaño.";
    if (!formData.saborId) return "Por favor elegí el sabor.";
    if (formData.rellenosIds.length !== cantRellenosPermitidos)
      return `Por favor elegí ${cantRellenosPermitidos} rellenos.`;

    if (!formData.nombreCliente.trim()) return "Por favor ingresá tu nombre.";
    if (!formData.emailCliente.trim())
      return "Por favor ingresá un email de contacto.";
    if (!formData.telefonoCliente.trim())
      return "Por favor ingresá un teléfono de contacto.";
    if (!formData.tipoEvento.trim())
      return "Por favor seleccioná el tipo de evento.";
    if (!formData.fechaEvento)
      return "Por favor seleccioná la fecha del evento.";
    if (!formData.cantidadPersonas || formData.cantidadPersonas <= 0)
      return "La cantidad de personas debe ser mayor a 0.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    const err = validarFinal();
    if (err) return setError(err);

    try {
      setEnviando(true);

      const fechaEventoDate = new Date(formData.fechaEvento);

      const payload = {
        tipo: "torta",
        productoDeseado: "Presupuesto - Torta personalizada",

        // 🔥 datos de la torta (lo tuyo)
        tamanio: {
          id: formData.tamanioId,
          titulo: tamanioElegido?.titulo || "",
          subtitulo: tamanioElegido?.subtitulo || "",
          detalle: tamanioElegido?.detalle || "",
        },
        sabor: {
          id: formData.saborId,
          label: saborElegido?.label || "",
        },
        cantRellenos: cantRellenosPermitidos,
        rellenos: rellenosElegidos.map((r) => ({ id: r.id, label: r.label })),
        look: {
          descripcion: formData.lookDescripcion.trim(),
          referenciaUrl: formData.lookReferenciaUrl.trim(),
        },

        // 👤 contacto (lo tuyo)
        nombreCliente: formData.nombreCliente.trim(),
        emailCliente: formData.emailCliente.trim(),
        telefonoCliente: formData.telefonoCliente.trim(),
        tipoEvento: formData.tipoEvento.trim(),
        cantidadPersonas: Number(formData.cantidadPersonas),
        fechaEvento: Timestamp.fromDate(fechaEventoDate),
        restricciones: formData.restricciones.trim(),
        descripcionPedido: formData.descripcionPedido.trim(),

        // ✅ compatibilidad con AdminPedidos.jsx
        estado: "pendiente_pago", // (no "pendiente")
        estadoPago: "pending",
        total: 0, // como es presupuesto, dejalo 0 (o null)
        items: [
          {
            cantidad: 1,
            nombre: `Torta ${tamanioElegido?.titulo || ""} - ${saborElegido?.label || ""} (${cantRellenosPermitidos} rellenos)`,
            subtotal: 0,
          },
        ],

        fechaCreacion: serverTimestamp(),
      };

      await addDoc(collection(db, "pedidos"), payload);

      const textoWhatsApp = `Hola! Soy ${payload.nombreCliente} y quiero solicitar un presupuesto de TORTA 🎂✨

Evento: ${payload.tipoEvento}
Fecha: ${formData.fechaEvento}
Cantidad de personas: ${payload.cantidadPersonas}

Torta:
• Tamaño: ${payload.tamanio.titulo} (${payload.tamanio.subtitulo}) - ${payload.tamanio.detalle}
• Sabor: ${payload.sabor.label}
• Rellenos (${payload.cantRellenos}): ${payload.rellenos.map((r) => r.label).join(" + ")}

Look / diseño:
${payload.look.descripcion || "No especificado"}
Referencia: ${payload.look.referenciaUrl || "Sin link"}

Restricciones/alergias: ${payload.restricciones || "No especificado"}

Teléfono: ${payload.telefonoCliente}
Email: ${payload.emailCliente}

Detalles extra:
${payload.descripcionPedido || "Sin detalles adicionales."}`;

      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
        textoWhatsApp,
      )}`;

      window.open(urlWhatsApp, "_blank");

      setMensaje("¡Tu solicitud de torta se envió correctamente! 😊");

      // reset
      setPaso(1);
      setFormData({
        pisos: "",
        tamanioId: "",
        saborId: "",
        rellenosIds: [],
        lookDescripcion: "",
        lookReferenciaUrl: "",
        nombreCliente: "",
        emailCliente: "",
        telefonoCliente: "",
        tipoEvento: "",
        cantidadPersonas: 1,
        fechaEvento: "",
        restricciones: "",
        descripcionPedido: "",
      });
    } catch (err2) {
      console.error(err2);
      setError("Ocurrió un error al enviar el presupuesto. Intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="pt-section">
      <div className="pt-container">
        <header className="pt-header">
          <h2 className="pt-title">Presupuesto de torta</h2>
          <p className="pt-subtitle">
            Elegí tamaño, sabor y rellenos. Al final completás tus datos y lo
            enviás por WhatsApp 💬
          </p>
        </header>

        <div className="pt-layout">
          <div className="pt-preview">
            <TortaPreview
              pedido={{
                paso, // pantalla actual (para textos)
                pasoVista, // ✅ para la imagen
                pisos: Number(formData.pisos) || 0,
                tamanioLabel: tamanioElegido?.titulo || "",
                cantidadRellenos: cantRellenosPermitidos,
                saborId: formData.saborId,
                saborLabel: saborElegido?.label || "",
                rellenosLabels: rellenosElegidos.map((r) => r.label),
              }}
            />
          </div>

          <div className="pt-main">
            {/* Steps */}
            <div className="pt-steps">
              {!requiereWhatsApp ? (
                <>
                  <div className={`pt-step ${paso === 1 ? "active" : ""}`}>
                    <span className="pt-step-num">1</span>
                    <span className="pt-step-label">Pisos</span>
                  </div>

                  <div className={`pt-step ${paso === 2 ? "active" : ""}`}>
                    <span className="pt-step-num">2</span>
                    <span className="pt-step-label">Tamaño</span>
                  </div>

                  <div className={`pt-step ${paso === 3 ? "active" : ""}`}>
                    <span className="pt-step-num">3</span>
                    <span className="pt-step-label">Sabor</span>
                  </div>

                  <div className={`pt-step ${paso === 4 ? "active" : ""}`}>
                    <span className="pt-step-num">4</span>
                    <span className="pt-step-label">Rellenos</span>
                  </div>

                  <div className={`pt-step ${paso === 5 ? "active" : ""}`}>
                    <span className="pt-step-num">5</span>
                    <span className="pt-step-label">Look</span>
                  </div>

                  <div className={`pt-step ${paso === 6 ? "active" : ""}`}>
                    <span className="pt-step-num">6</span>
                    <span className="pt-step-label">Datos</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="pt-step active">
                    <span className="pt-step-num">1</span>
                    <span className="pt-step-label">Pisos</span>
                  </div>
                  <div className="pt-step disabled">
                    <span className="pt-step-num">💬</span>
                    <span className="pt-step-label">WhatsApp</span>
                  </div>
                </>
              )}
            </div>

            {/* Título grande del paso (notorio) */}
            <div className="pt-stepTitle">
              {!requiereWhatsApp ? (
                <>
                  <span className="pt-stepTitle-pill">PASO {paso}</span>
                  <span className="pt-stepTitle-text">
                    {paso === 1 && "Pisos"}
                    {paso === 2 && "Tamaño"}
                    {paso === 3 && "Sabor"}
                    {paso === 4 && "Rellenos"}
                    {paso === 5 && "Look"}
                    {paso === 6 && "Datos"}
                  </span>
                </>
              ) : (
                <>
                  <span className="pt-stepTitle-pill">PASO 1</span>
                  <span className="pt-stepTitle-text">Tamaño</span>
                </>
              )}
            </div>

            {/* PASO 1 */}
            {paso === 1 && (
              <div className="pt-panel">
                <h3 className="pt-h3">Elegí la cantidad de pisos</h3>

                <div className="pt-grid">
                  {OPC_PISOS.map((op) => (
                    <button
                      type="button"
                      key={op.id}
                      className={`pt-card ${Number(formData.pisos) === op.id ? "selected" : ""}`}
                      onClick={() => {
                        setPaso(1);
                        setFormData((prev) => ({
                          ...prev,
                          pisos: op.id,
                          tamanioId: "", // reinicia tamaño al cambiar pisos
                          saborId: "", // reinicia sabor
                          rellenosIds: [], // reinicia rellenos
                        }));
                      }}
                    >
                      <div className="pt-card-title">{op.label}</div>
                      <div className="pt-card-sub">
                        {op.id === 1 ? "2 rellenos" : "4 rellenos"}
                      </div>
                    </button>
                  ))}
                </div>

                {/* SOLO si eligió 2 pisos mostramos WhatsApp */}
                {requiereWhatsApp && formData.pisos && (
                  <div className="pt-alert" style={{ marginTop: "14px" }}>
                    <h4 className="pt-alert-title">
                      Presupuesto de tortas de 2 pisos
                    </h4>

                    <p className="pt-alert-text">
                      Para presupuestar tortas de <strong>2 pisos o más</strong>
                      , por favor comunicate por WhatsApp así podemos asesorarte
                      con tamaños, diseño y precio 😊
                    </p>

                    <a
                      className="pt-whatsBtn"
                      href={urlWhatsApp2Pisos}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="pt-whatsIcon">💬</span>
                      Pedir presupuesto por WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* PASO 2 */}
            {paso === 2 && (
              <div className="pt-panel">
                <h3 className="pt-h3">Elegí el tamaño</h3>

                {!formData.pisos ? (
                  <p className="pt-note">Primero elegí la cantidad de pisos.</p>
                ) : (
                  <div className="pt-grid pt-grid--sizes">
                    {tamaniosFiltrados.map((op) => (
                      <button
                        type="button"
                        key={op.id}
                        className={`pt-card pt-card--size ${formData.tamanioId === op.id ? "selected" : ""}`}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            tamanioId: op.id,
                            // al cambiar tamaño reinicio lo siguiente
                            saborId: "",
                            rellenosIds: [],
                          }));
                        }}
                      >
                        <div className="pt-card-title">{op.titulo}</div>
                        <div className="pt-chip">{op.subtitulo}</div>
                        <div className="pt-card-detail pt-card-detail--muted">
                          {op.detalle}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PASO 3 */}
            {paso === 3 && (
              <div className="pt-panel">
                <h3 className="pt-h3">¿De qué sabor querés el bizcochuelo?</h3>

                <div className="pt-grid">
                  {OPC_SABORES.map((op) => (
                    <button
                      type="button"
                      key={op.id}
                      className={`pt-card ${formData.saborId === op.id ? "selected" : ""}`}
                      onClick={() => setField("saborId", op.id)}
                    >
                      <div className="pt-card-title">{op.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 4 */}
            {paso === 4 && (
              <div className="pt-panel">
                <h3 className="pt-h3">
                  Elegí {cantRellenosPermitidos} rellenos
                </h3>

                <div className="pt-grid pt-grid--circles">
                  {OPC_RELLENOS.map((op) => {
                    const selected = formData.rellenosIds.includes(op.id);
                    const reachedLimit =
                      cantRellenosPermitidos > 0 &&
                      formData.rellenosIds.length >= cantRellenosPermitidos;

                    const disabled = !selected && reachedLimit;

                    return (
                      <button
                        type="button"
                        key={op.id}
                        disabled={disabled}
                        className={`pt-card pt-card--relleno ${selected ? "selected" : ""} ${disabled ? "disabled" : ""}`}
                        onClick={() => toggleRelleno(op.id)}
                        title={
                          disabled
                            ? `Ya elegiste el máximo (${cantRellenosPermitidos})`
                            : op.label
                        }
                      >
                        <div className="pt-relleno-circle">
                          <img
                            src={op.img}
                            alt={op.label}
                            className="pt-relleno-img"
                          />
                        </div>

                        <div className="pt-card-title pt-card-title--relleno">
                          {op.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PASO 5 */}
            {paso === 5 && (
              <div className="pt-panel">
                <h2 className="pt-h3">No olvides el diseño ✨ (opcional)</h2>

                <div className="pt-form">
                  <label>Descripción / temática</label>
                  <textarea
                    rows={3}
                    value={formData.lookDescripcion}
                    onChange={(e) =>
                      setField("lookDescripcion", e.target.value)
                    }
                    placeholder="Ej: temática flores, tonos pastel, con topper..."
                  />

                  <label>Link de referencia (Instagram / Pinterest)</label>
                  <input
                    type="url"
                    value={formData.lookReferenciaUrl}
                    onChange={(e) =>
                      setField("lookReferenciaUrl", e.target.value)
                    }
                    placeholder="https://..."
                  />

                  <p className="pt-note">
                    Si tenés una imagen, podés pegar el link acá. También podés
                    enviarla luego por WhatsApp.
                  </p>
                </div>
              </div>
            )}

            {/* PASO 6 */}
            {paso === 6 && (
              <form className="pt-panel pt-form" onSubmit={handleSubmit}>
                <h3 className="pt-h3">Datos para enviarlo</h3>

                <div className="pt-summary">
                  <strong>Resumen:</strong>
                  <div>
                    • Tamaño:{" "}
                    {tamanioElegido
                      ? `${tamanioElegido.titulo} (${tamanioElegido.subtitulo}) - ${tamanioElegido.detalle}`
                      : "-"}
                  </div>
                  <div>• Sabor: {saborElegido?.label || "-"}</div>
                  <div>
                    • Rellenos:{" "}
                    {rellenosElegidos.length
                      ? rellenosElegidos.map((r) => r.label).join(" + ")
                      : "-"}
                  </div>
                </div>

                <div className="pt-grid-form">
                  <div className="campo">
                    <label>Nombre y Apellido *</label>
                    <input
                      type="text"
                      value={formData.nombreCliente}
                      onChange={(e) =>
                        setField("nombreCliente", e.target.value)
                      }
                      placeholder="Nombre y Apellido"
                    />
                  </div>

                  <div className="campo">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.emailCliente}
                      onChange={(e) => setField("emailCliente", e.target.value)}
                      placeholder="Ej: tuemail@gmail.com"
                    />
                  </div>

                  <div className="campo">
                    <label>Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      value={formData.telefonoCliente}
                      onChange={(e) =>
                        setField("telefonoCliente", e.target.value)
                      }
                      placeholder="Ej: 3541-123456"
                    />
                  </div>

                  <div className="campo">
                    <label>Tipo de evento *</label>
                    <select
                      value={formData.tipoEvento}
                      onChange={(e) => setField("tipoEvento", e.target.value)}
                    >
                      <option value="">Seleccioná una opción</option>
                      <option value="Cumpleaños">Cumpleaños</option>
                      <option value="Casamiento">Casamiento</option>
                      <option value="Bautismo">Bautismo</option>
                      <option value="Evento corporativo">
                        Evento corporativo
                      </option>
                      <option value="Reunión familiar">Reunión familiar</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div className="campo">
                    <label>Cantidad de personas *</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.cantidadPersonas}
                      onChange={(e) =>
                        setField(
                          "cantidadPersonas",
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                    />
                  </div>

                  <div className="campo">
                    <label>Fecha del evento *</label>
                    <input
                      type="date"
                      min={hoyISO}
                      value={formData.fechaEvento}
                      onChange={(e) => setField("fechaEvento", e.target.value)}
                    />
                  </div>
                </div>

                <div className="campo">
                  <label>
                    Restricciones / alergias / preferencias especiales
                  </label>
                  <textarea
                    rows={2}
                    value={formData.restricciones}
                    onChange={(e) => setField("restricciones", e.target.value)}
                    placeholder="Ej: sin nueces…"
                  />
                </div>

                <div className="campo">
                  <label>Detalles extra</label>
                  <textarea
                    rows={4}
                    value={formData.descripcionPedido}
                    onChange={(e) =>
                      setField("descripcionPedido", e.target.value)
                    }
                    placeholder="Ej: colores, topper, temática, dedicatoria, etc..."
                  />
                </div>

                <p className="pt-info">
                  Tu solicitud se enviará a <strong>Munay Pastelería</strong> y
                  también se abrirá WhatsApp para enviarlo 💬✨
                </p>

                {error && <p className="pt-error">{error}</p>}
                {mensaje && <p className="pt-ok">{mensaje}</p>}

                <button type="submit" disabled={enviando} className="pt-submit">
                  {enviando ? "Enviando..." : "Enviar solicitud"}
                </button>
              </form>
            )}

            {/* navegación */}
            <div className="pt-nav">
              <button
                type="button"
                className="pt-btn"
                onClick={prev}
                disabled={paso === 1}
              >
                Atrás
              </button>

              {!requiereWhatsApp && (
                <button
                  type="button"
                  className="pt-btn pt-btn--primary"
                  onClick={next}
                  disabled={paso === 6 || !puedeAvanzar()}
                >
                  Siguiente
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
