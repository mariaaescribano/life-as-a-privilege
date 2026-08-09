// ─────────────────────────────────────────────────────────────────────────
// ÍNDICE DEL RECORRIDO · AYURVEDA
//
// Orden canónico de las páginas del recorrido de cada dosha (los mismos pasos
// que encadenan las cabeceras con sus botones «← / →»). Alimenta el botón
// «Índice» reutilizado de psicología (ver IndiceRecorrido / IndiceAyurveda).
// Las rutas reciben el dosha (vata/pitta/kapha), que va en la URL.
// ─────────────────────────────────────────────────────────────────────────
import type { PasoRecorrido } from "./psicologiaRecorrido";

export const AYURVEDA_INDICE: PasoRecorrido[] = [
  { n: 1, titulo: "Naturaleza",     ruta: (d) => `/metodo/ayurveda/dosha/${d}` },
  { n: 2, titulo: "Descúbrete",     ruta: (d) => `/metodo/ayurveda/dosha/${d}/comenzar` },
  { n: 3, titulo: "Cuerpo",         ruta: (d) => `/metodo/ayurveda/dosha/${d}/cuerpo` },
  { n: 4, titulo: "Equilibrio",     ruta: (d) => `/metodo/ayurveda/dosha/${d}/desequilibrio` },
  { n: 5, titulo: "Alimentación",   ruta: (d) => `/metodo/ayurveda/dosha/${d}/cuidarte` },
  { n: 6, titulo: "Estilo de Vida", ruta: (d) => `/metodo/ayurveda/dosha/${d}/estilo` },
  { n: 7, titulo: "Tu día",         ruta: (d) => `/metodo/ayurveda/dosha/${d}/dia` },
  { n: 8, titulo: "Tu mapa",   ruta: (d) => `/metodo/ayurveda/dosha/${d}/recorrido` },
  { n: 9, titulo: "Prāṇāyāma",      ruta: (d) => `/metodo/ayurveda/dosha/${d}/pranayama` },
  { n: 10, titulo: "Cursos",        ruta: (d) => `/metodo/ayurveda/dosha/${d}/cursos` },
];

export const AYURVEDA_TOTAL = AYURVEDA_INDICE.length;

// ─────────────────────────────────────────────────────────────────────────
// ALCANZABILIDAD · «hasta dónde puede llegar» el usuario en el recorrido de un
// dosha. Replica el gate `!guardado` de cada página (el dato ya persistido de
// su sección, keyed por dosha). Los pasos sin requisito devuelven true.
//
// ⚠️ Si cambias el gate del botón «siguiente» de una página, cámbialo aquí.
// ─────────────────────────────────────────────────────────────────────────
type AyurvedaData = Record<string, any>;

const tieneContenido = (v: unknown): boolean =>
  typeof v === "string" ? v.trim().length > 0 : Array.isArray(v) ? v.length > 0 : false;

/** Gate para avanzar MÁS ALLÁ del paso `n` (1-based) del recorrido del dosha. */
export function puedeAvanzarAyurveda(data: AyurvedaData, dosha: string, n: number): boolean {
  const sec = (k: string): AyurvedaData => (data?.[k]?.[dosha] || {});
  switch (n) {
    case 1: return tieneContenido(sec("doshaIntro").cambio);            // Naturaleza
    case 2: return tieneContenido(sec("doshaDescubre").reflexion);      // Descúbrete
    case 3: return tieneContenido(sec("doshaCuerpo").reflexion);        // Cuerpo
    case 4: return tieneContenido(sec("doshaDesequilibrio").reflexion); // Equilibrio
    // Estilo de Vida guarda su reflexión/compromiso bajo la sección doshaCuidarte.
    case 6: return tieneContenido(sec("doshaCuidarte").reflexion) || tieneContenido(sec("doshaCuidarte").compromiso);
    case 7: return tieneContenido(sec("doshaDia").bloques);             // Tu día
    // 5 (Alimentación), 8 (Tu mapa), 9 (Prāṇāyāma) y 10 (Cursos) no piden nada:
    // Prāṇāyāma se lee y se practica, pero no bloquea el paso a los Cursos.
    default: return true;
  }
}

/** Paso máximo ALCANZABLE (1-based) del recorrido de un dosha. */
export function pasoAlcanzableAyurveda(data: AyurvedaData, dosha: string): number {
  let n = 1;
  while (n < AYURVEDA_TOTAL && puedeAvanzarAyurveda(data, dosha, n)) n++;
  return n;
}
