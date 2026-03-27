// src/pages/AdminPedidos.jsx
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../../styles/admin.css";

const ADMIN_EMAIL = "ana17.molina.am@gmail.com";

const ESTADOS_PEDIDO = [
  "pendiente_pago",
  "pagado",
  "en_preparacion",
  "listo",
  "entregado",
  "cancelado",
];

const etiquetaProducto = (tipo) => {
  const map = {
    torta: "🎂 Torta",
    tarta: "🥧 Tarta",
    cookies: "🍪 Cookies",
    budin: "🍞 Budín",
    mesadulce: "🍬 Mesa dulce",
  };

  return map[tipo] || tipo || "Producto";
};

// para mostrar más lindo
const etiquetaEstado = (estado) => {
  const map = {
    pendiente_pago: "Pendiente de pago",
    pagado: "Pagado",
    en_preparacion: "En preparación",
    listo: "Listo",
    entregado: "Entregado",
    cancelado: "Cancelado",
  };
  return map[estado] || estado;
};

const claseEstado = (estado) => {
  const map = {
    pendiente_pago: "st-pendiente",
    pagado: "st-pagado",
    en_preparacion: "st-preparacion",
    listo: "st-listo",
    entregado: "st-entregado",
    cancelado: "st-cancelado",
  };
  return map[estado] || "st-pendiente";
};

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setCheckingAuth(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (checkingAuth) return;
    if (!user || user.email !== ADMIN_EMAIL) return;

    const q = query(
      collection(db, "pedidos"),
      orderBy("fechaCreacion", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setPedidos(data);
        setCargando(false);
      },
      (err) => {
        console.error("Error escuchando pedidos:", err);
        setError("No se pudieron cargar los pedidos.");
        setCargando(false);
      },
    );

    return () => unsubscribe();
  }, [checkingAuth, user]);

  const cambiarEstado = async (idPedido, nuevoEstado) => {
    try {
      const ref = doc(db, "pedidos", idPedido);
      await updateDoc(ref, { estado: nuevoEstado });
    } catch (err) {
      console.error("Error actualizando estado:", err);
      alert("No se pudo actualizar el estado del pedido.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    // opcional: redirigir si querés
    // navigate("/admin/login");
  };

  const resumen = useMemo(() => {
    const total = pedidos.length;
    const porEstado = {};
    for (const p of pedidos) {
      const st = p.estado || "pendiente_pago";
      porEstado[st] = (porEstado[st] || 0) + 1;
    }
    return { total, porEstado };
  }, [pedidos]);

  if (checkingAuth) return <p className="adminText">Cargando...</p>;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <section className="adminPage">
        <div className="adminCard">
          <h2 className="adminTitle">Acceso restringido</h2>
          <p className="adminText">No tenés permiso para ver esta página.</p>
        </div>
      </section>
    );
  }

  if (cargando) return <p className="adminText">Cargando pedidos...</p>;
  if (error) return <p className="adminErrorText">{error}</p>;
  if (!pedidos.length)
    return <p className="adminText">No hay pedidos todavía.</p>;

  return (
    <section className="adminPage">
      <div className="adminTopbar">
        <div>
          <h2 className="adminTitle">Pedidos</h2>
          <p className="adminText">
            Acá ves <strong>todos los pedidos</strong> que se hicieron, estén
            pagos o no.
          </p>
        </div>

        <button className="adminBtnGhost" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className="adminStats">
        <div className="adminStatCard">
          <div className="adminStatLabel">Total</div>
          <div className="adminStatValue">{resumen.total}</div>
        </div>

        {Object.entries(resumen.porEstado).map(([st, n]) => (
          <div key={st} className="adminStatCard">
            <div className="adminStatLabel">{etiquetaEstado(st)}</div>
            <div className="adminStatValue">{n}</div>
          </div>
        ))}
      </div>

      <div className="adminTableWrap">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Total</th>
              <th>Estado pedido</th>
              <th>Estado pago</th>
              <th>Detalle</th>
            </tr>
          </thead>

          <tbody>
            {pedidos.map((p) => {
              const fecha =
                p.fechaCreacion?.toDate?.().toLocaleString("es-AR") ?? "-";

              const estadoPedido = p.estado || "pendiente_pago";

              return (
                <tr key={p.id}>
                  <td className="cell">{fecha}</td>

                  <td className="cell">
                    <span className="pillProducto">
                      {etiquetaProducto(p.tipo)}
                    </span>
                  </td>
                  <td className="cell">
                    <div className="strong">{p.nombreCliente}</div>
                  </td>

                  <td className="cell">
                    <div className="muted">{p.emailCliente}</div>
                    <div className="muted">{p.telefonoCliente}</div>
                  </td>

                  <td className="cell">
                    <span className="money">${Number(p.total ?? 0)}</span>
                  </td>

                  <td className="cell">
                    <div className="estadoWrap">
                      <span
                        className={`estadoPill ${claseEstado(estadoPedido)}`}
                      >
                        {etiquetaEstado(estadoPedido)}
                      </span>

                      <select
                        className="adminSelect"
                        value={estadoPedido}
                        onChange={(e) => cambiarEstado(p.id, e.target.value)}
                      >
                        {ESTADOS_PEDIDO.map((estado) => (
                          <option key={estado} value={estado}>
                            {etiquetaEstado(estado)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  <td className="cell">
                    <span className="pillPago">
                      {p.estadoPago || "pending"}
                    </span>
                  </td>

                  <td className="cell">
                    <div className="detalleItems">
                      {p.items?.map((item, idx) => (
                        <div key={idx} className="detalleItem">
                          <span className="detalleQty">{item.cantidad}x</span>
                          <span className="detalleName">{item.nombre}</span>
                          <span className="detallePrice">${item.subtotal}</span>
                        </div>
                      ))}
                    </div>

                    {p.notas && (
                      <div className="adminNotas">
                        <span>Notas:</span> {p.notas}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
