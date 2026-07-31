// ─────────────────────────────────────────────────────────────────────────
// Overrides de los arquetipos GUARDADOS EN LA BASE DE DATOS.
//
// Antes los textos editados en /admin/astrologia-textos solo se podían guardar
// en local (el back reescribía astrologiaTextos.overrides.ts y había que hacer
// commit + deploy). Ahora el panel los guarda en la BD y el recorrido los lee
// de ahí, así que editar en producción funciona.
//
// Quién manda: si la BD tiene fila, ESA es la verdad para todo el conjunto —
// también para lo borrado (si una celda ya no está, vuelve el texto original).
// Si no hay fila (o el servidor no responde), se usan los del proyecto, que
// viajan en el bundle. Por eso esto devuelve `null` y no un objeto vacío.
//
// Se pide UNA sola vez por carga de página (promesa cacheada): son unos pocos
// kB de texto y cambian solo cuando la autora edita.
// ─────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../GlobalVariables";

export interface ArquetiposOverrides {
  signo: Record<string, Record<string, string>>;
  casa: Record<string, Record<string, string>>;
}

let remotos: ArquetiposOverrides | null = null;
let promesa: Promise<ArquetiposOverrides | null> | null = null;

/** Los overrides de la BD ya cargados, o null si no hay / aún no han llegado. */
export const overridesRemotos = (): ArquetiposOverrides | null => remotos;

/** Deja el objeto en la forma { signo, casa } con solo strings no vacíos. */
function sanear(input: unknown): ArquetiposOverrides | null {
  if (!input || typeof input !== "object") return null;
  const src = input as Record<string, unknown>;
  const out: ArquetiposOverrides = { signo: {}, casa: {} };
  for (const faceta of ["signo", "casa"] as const) {
    const porCuerpo = src[faceta];
    if (!porCuerpo || typeof porCuerpo !== "object") continue;
    for (const [cuerpo, celdas] of Object.entries(porCuerpo as Record<string, unknown>)) {
      if (!celdas || typeof celdas !== "object") continue;
      for (const [valor, texto] of Object.entries(celdas as Record<string, unknown>)) {
        if (typeof texto !== "string" || texto.trim() === "") continue;
        (out[faceta][cuerpo] ??= {})[valor] = texto;
      }
    }
  }
  return out;
}

/**
 * Pide los overrides al servidor (una vez). Si falla, devuelve null y el
 * recorrido sigue con los textos del bundle: nunca se queda sin texto.
 * `recargar` fuerza otra petición (lo usa el editor tras guardar).
 */
export function cargarOverridesRemotos(recargar = false): Promise<ArquetiposOverrides | null> {
  if (recargar) {
    promesa = null;
    remotos = null;
  }
  promesa ??= axios
    .get<{ overrides?: unknown }>(`${API_URL}/astrologia-arquetipos`)
    .then((r) => {
      remotos = sanear(r.data?.overrides);
      return remotos;
    })
    .catch(() => {
      remotos = null;
      return null;
    });
  return promesa;
}

/**
 * Para las pantallas que pintan el texto de forma síncrona (getTextoSigno /
 * getTextoCasa): espera a que lleguen los overrides y provoca un re-render.
 * Devuelve true cuando ya se ha resuelto la petición.
 */
export function useOverridesRemotos(): boolean {
  const [listo, setListo] = useState<boolean>(() => remotos != null);
  useEffect(() => {
    let vivo = true;
    cargarOverridesRemotos().then(() => {
      if (vivo) setListo(true);
    });
    return () => {
      vivo = false;
    };
  }, []);
  return listo;
}
