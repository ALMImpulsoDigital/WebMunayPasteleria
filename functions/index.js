// 👇 Ya lo tenías, lo dejamos igual
require("dotenv").config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const mercadopago = require("mercadopago");

// Inicializamos Admin SDK (una sola vez)
admin.initializeApp();

// ⚠️ Token de Mercado Pago (desde .env o variables de entorno de Firebase)
const mpToken = process.env.MP_ACCESS_TOKEN;

if (!mpToken) {
  console.warn("⚠️ MP_ACCESS_TOKEN no está configurado.");
}

// Configuramos Mercado Pago (SDK v1)
mercadopago.configure({
  access_token: mpToken,
});

exports.createPreference = functions.https.onRequest(async (req, res) => {
  // ✅ Orígenes permitidos (localhost + netlify + dominio propio)
  const allowedOrigins = [
    "http://localhost:5173",
    "https://munay-pasteleria.netlify.app",
    "https://munay-pasteleria.com.ar",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }

  res.set("Vary", "Origin");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { idPedido } = req.body || {};
  console.log("📩 idPedido recibido en createPreference:", idPedido);

  if (!idPedido) {
    return res.status(400).json({ error: "Falta idPedido" });
  }

  const db = admin.firestore();

  try {
    const pedidoSnap = await db.collection("pedidos").doc(idPedido).get();
    if (!pedidoSnap.exists) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    const pedido = pedidoSnap.data();
    if (!pedido.items || pedido.items.length === 0) {
      return res.status(400).json({ error: "El pedido no tiene items" });
    }

    // ✅ Determinar URL del front (preferimos el origin real si está permitido)
    const frontUrl = allowedOrigins.includes(origin)
      ? origin
      : "https://munay-pasteleria.netlify.app";

    const items = pedido.items.map((item) => ({
      title: item.nombre,
      quantity: Number(item.cantidad),
      unit_price: Number(item.precioUnitario),
      currency_id: "ARS",
    }));

    const preference = {
      items,
      external_reference: idPedido,
      back_urls: {
        success: `${frontUrl}/gracias`,
        failure: `${frontUrl}/error-pago`,
        pending: `${frontUrl}/pago-pendiente`,
      },
      // Cuando quieras, lo activamos:
      // auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    const pref = response.body;

    await db.collection("pagos").add({
      idPedido,
      metodo: "mercadopago",
      preferenceId: pref.id,
      status: "pending",
      montoPagado: 0,
      fechaCreacion: admin.firestore.FieldValue.serverTimestamp(),
      fechaActualizacion: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ init_point: pref.init_point });
  } catch (error) {
    console.error("Error creando preferencia de MP:", error);

    // ✅ devolver info “serializable” (sin mandar el objeto error entero)
    return res.status(500).json({
      error: "No se pudo crear la preferencia de pago",
      message: error?.message || null,
      mpDetails: error?.response?.data || null,
    });
  }
});



// 🔻🔻🔻 NUEVO: WEBHOOK DE MERCADO PAGO 🔻🔻🔻

exports.mercadoPagoWebhook = functions.https.onRequest(async (req, res) => {
  console.log("📬 Webhook de Mercado Pago recibido");
  console.log("Método:", req.method);
  console.log("Headers:", req.headers);
  console.log("Body:", JSON.stringify(req.body));

  // Mercado Pago suele mandar POST. Si viene otra cosa, respondemos OK y listo
  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  try {
    const db = admin.firestore();

    // MP puede mandar distintos formatos, pero en general:
    // {
    //   "action": "payment.created" / "payment.updated",
    //   "type": "payment",
    //   "data": { "id": "123456789" }
    // }
    const { action, type, data, id } = req.body || {};

    if (type !== "payment" && !String(action || "").startsWith("payment")) {
      console.log("Evento no relacionado a pagos. Se ignora.");
      return res.status(200).send("Evento ignorado");
    }

    let paymentId = null;

    if (data && data.id) {
      paymentId = data.id;
    } else if (id) {
      // a veces viene plano
      paymentId = id;
    }

    if (!paymentId) {
      console.error("No se encontró paymentId en el webhook");
      return res.status(400).send("Falta paymentId");
    }

    console.log("🔎 Buscando pago en MP. paymentId:", paymentId);

    // Obtener info del pago desde Mercado Pago
    const payment = await mercadopago.payment.findById(paymentId);
    const info = payment.response;

    console.log("🧾 Respuesta de MP payment.findById:", info);

    const preferenceId = info.preference_id;
    const status = info.status; // approved / rejected / pending / in_process...
    const montoPagado = info.transaction_amount;

    console.log("📌 preferenceId:", preferenceId);
    console.log("📌 estado:", status);
    console.log("📌 montoPagado:", montoPagado);

    if (!preferenceId) {
      console.error("El pago no tiene preference_id. No se puede vincular.");
      return res.status(200).send("Sin preference_id, no se actualiza nada");
    }

    // Buscar el documento en `pagos` que tenga ese preferenceId
    const pagosSnap = await db
      .collection("pagos")
      .where("preferenceId", "==", preferenceId)
      .limit(1)
      .get();

    if (pagosSnap.empty) {
      console.error("No se encontró documento en 'pagos' con ese preferenceId");
      return res.status(200).send("Pago no encontrado en Firestore (pagos)");
    }

    const pagoDoc = pagosSnap.docs[0];
    const pagoData = pagoDoc.data();

    // Actualizar documento en `pagos`
    await pagoDoc.ref.update({
      status: status, // "approved", "rejected", etc.
      montoPagado: montoPagado || 0,
      fechaActualizacion: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ Documento en 'pagos' actualizado.");

    // Actualizar documento en `pedidos`
    const pedidoRef = db.collection("pedidos").doc(pagoData.idPedido);

   // 🔹 Actualizar estadoPago (lo que devuelve Mercado Pago)
//    y, opcionalmente, estado del pedido si el pago se aprobó/rechazó

// No pisamos siempre `estado`, solo cuando el pago termina en approved/rejected.
// Así no arruinamos estados manuales como "en_preparacion", "entregado", etc.
const updates = {
  estadoPago: status,  // pending / approved / rejected / in_process...
  fechaPago: admin.firestore.FieldValue.serverTimestamp(),
};

// Si el pago fue aprobado, podemos marcar el pedido como "pagado"
if (status === "approved") {
  updates.estado = "pagado";
}

// Si el pago fue rechazado/cancelado, lo reflejamos también en el pedido
if (status === "rejected" || status === "cancelled") {
  updates.estado = "rechazado";
}

await pedidoRef.update(updates);

console.log("✅ Pedido actualizado con:", updates);

        // En este punto podríamos también disparar un mail a la dueña :)

    return res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Error procesando webhook de MP:", error);
    return res.status(500).send("Error procesando webhook");
  }
});

// ⚠️ SOLO PARA USO INTERNO: marcar un usuario como admin UNA VEZ
// Después de usarla, borrá esta función y volvé a hacer deploy de functions.
exports.setAdminRole = functions.https.onRequest(async (req, res) => {
  // Permitimos solo método GET o POST para algo rápido
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).send("Método no permitido");
  }

  // UID del usuario que querés marcar como admin
  const uid = "wpAxhG56nbcoFxwuLQmF7dFzfX52"; // 👈 TU UID

  try {
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });
    const user = await admin.auth().getUser(uid);

    console.log("✅ Rol admin asignado a:", user.email);

    return res
      .status(200)
      .send(`Listo, ${user.email} ahora tiene role: "admin"`);
  } catch (err) {
    console.error("❌ Error asignando rol admin:", err);
    return res.status(500).send("Error asignando rol admin");
  }
});

