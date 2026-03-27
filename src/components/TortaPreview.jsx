// src/components/TortaPreview.jsx
import React, { useMemo } from "react";
import "../styles/tortaPreview.css";

function getPisosFromCantidadRellenos(cantidadRellenos) {
  if (cantidadRellenos === 4) return 2;
  return 1;
}

function getPasoImagen(paso, pisos) {
  const p = pisos === 2 ? 2 : 1;

  if (paso === 1) {
    return `/assets/tortas/presupuesto/paso-1_base_${p === 1 ? "1-piso" : "2-pisos"}.png`;
  }
  if (paso === 2) {
    return `/assets/tortas/presupuesto/paso-2_bizcochuelo_${p === 1 ? "1-piso" : "2-pisos"}.png`;
  }
  return `/assets/tortas/presupuesto/paso-3_rellenos_${p === 1 ? "1-piso" : "2-pisos"}.png`;
}

export default function TortaPreview({ pedido }) {
  const {
    paso = 1,
    pasoVista = 1,
    cantidadRellenos = 0,
    pisos: pisosFromParent = 0,
  } = pedido || {};

  const pisos = useMemo(() => {
    if (pisosFromParent) return pisosFromParent;
    return getPisosFromCantidadRellenos(cantidadRellenos);
  }, [pisosFromParent, cantidadRellenos]);

  const imgSrc = useMemo(
    () => getPasoImagen(pasoVista, pisos),
    [pasoVista, pisos],
  );

  const tituloPaso = useMemo(() => {
    if (paso === 1) return "Elegí la cantidad de pisos";
    if (paso === 2) return "Elegí el tamaño";
    if (paso === 3) return "Elegí el sabor del bizcochuelo";
    if (paso === 4) return "Elegí los rellenos";
    if (paso === 5) return "Look / diseño";
    return "Datos";
  }, [paso]);

  return (
    <aside className="tp-card" aria-label="Vista previa de torta">
      <div className="tp-header tp-header--center">
        <h3 className="tp-title">Así va quedando tu torta</h3>
        <p className="tp-subtitle">{tituloPaso}</p>
      </div>

      <div className="tp-previewWrap">
        <div className="tp-imgWrap">
          <img
            key={imgSrc} // ✅ fuerza re-montaje cuando cambia la imagen
            className="tp-img tp-img-anim"
            src={imgSrc}
            alt="Vista previa torta"
          />
        </div>
      </div>

      <div className="tp-notes">
        {/* Tamaño: desde paso 2 */}
        {pedido?.tamanioLabel && paso >= 2 && (
          <div className="tp-note">
            Tamaño: <strong>{pedido.tamanioLabel}</strong>
          </div>
        )}

        {/* Sabor: desde paso 3 */}
        {pedido?.saborLabel && paso >= 3 && (
          <div className="tp-note">
            Bizcochuelo: <strong>{pedido.saborLabel}</strong>
          </div>
        )}

        {/* Rellenos: desde paso 4 (solo cuando están completos) */}
        {Array.isArray(pedido?.rellenosLabels) &&
          paso >= 4 &&
          Number(pedido?.cantidadRellenos) > 0 &&
          pedido.rellenosLabels.length === Number(pedido.cantidadRellenos) && (
            <div className="tp-note">
              Rellenos: <strong>{pedido.rellenosLabels.join(" + ")}</strong>
            </div>
          )}
      </div>
    </aside>
  );
}
