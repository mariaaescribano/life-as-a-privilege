// ─────────────────────────────────────────────────────────────────────────
// ÍNDICE DEL RECORRIDO · AYURVEDA
//
// El recorrido tiene DOS niveles, y el Índice los enseña como dos secciones:
//
//   1. EL MAPA (neutral) · Ayurveda → Test → Resultado → Doṣhas → Prāṇāyāma →
//      Cursos. No depende de ningún doṣha concreto: son las páginas comunes.
//      Prāṇāyāma y Cursos viven en una ruta con doṣha por herencia, pero ya no
//      pertenecen al submapa: se llega a ellos desde las tarjetas.
//
//   2. EL SUBMAPA DE UN DOṢHA · Naturaleza → … → Tu mapa. Solo tiene sentido
//      dentro de un doṣha concreto: fuera de él, el Índice lo enseña bloqueado.
//
// Alimenta el botón «Índice» reutilizado de psicología (IndiceRecorrido /
// IndiceAyurveda). Las rutas reciben el doṣha (vata/pitta/kapha).
// ─────────────────────────────────────────────────────────────────────────
import type { PasoRecorrido } from "./psicologiaRecorrido";

/** Nivel 1 · las páginas comunes, las mismas sea cual sea tu doṣha. */
export const AYURVEDA_MAPA: PasoRecorrido[] = [
  { n: 1, titulo: "Ayurveda",   ruta: () => "/metodo/ayurveda" },
  { n: 2, titulo: "Test",       ruta: () => "/metodo/ayurveda/test" },
  { n: 3, titulo: "Resultado",  ruta: () => "/metodo/ayurveda/resultado" },
  { n: 4, titulo: "Doṣhas",     ruta: () => "/metodo/ayurveda/tarjetas" },
  { n: 5, titulo: "Prāṇāyāma",  ruta: (d) => `/metodo/ayurveda/dosha/${d}/pranayama` },
  { n: 6, titulo: "Cursos",     ruta: (d) => `/metodo/ayurveda/dosha/${d}/cursos` },
];

/** Nivel 2 · el submapa de UN doṣha. Fuera de un doṣha no es pulsable. */
export const AYURVEDA_DOSHA_INDICE: PasoRecorrido[] = [
  { n: 1, titulo: "Naturaleza",     ruta: (d) => `/metodo/ayurveda/dosha/${d}` },
  { n: 2, titulo: "Descúbrete",     ruta: (d) => `/metodo/ayurveda/dosha/${d}/comenzar` },
  { n: 3, titulo: "Cuerpo",         ruta: (d) => `/metodo/ayurveda/dosha/${d}/cuerpo` },
  { n: 4, titulo: "Equilibrio",     ruta: (d) => `/metodo/ayurveda/dosha/${d}/desequilibrio` },
  { n: 5, titulo: "Alimentación",   ruta: (d) => `/metodo/ayurveda/dosha/${d}/cuidarte` },
  { n: 6, titulo: "Estilo de Vida", ruta: (d) => `/metodo/ayurveda/dosha/${d}/estilo` },
  { n: 7, titulo: "Tu día",         ruta: (d) => `/metodo/ayurveda/dosha/${d}/dia` },
  { n: 8, titulo: "Tu mapa",        ruta: (d) => `/metodo/ayurveda/dosha/${d}/recorrido` },
];

export const AYURVEDA_DOSHA_TOTAL = AYURVEDA_DOSHA_INDICE.length;

// ─────────────────────────────────────────────────────────────────────────
// ALCANZABILIDAD · «hasta dónde puede llegar» el usuario dentro del submapa de
// un dosha. Replica el gate `!guardado` de cada página (el dato ya persistido
// de su sección, keyed por dosha). Los pasos sin requisito devuelven true.
//
// ⚠️ Si cambias el gate del botón «siguiente» de una página, cámbialo aquí.
// ─────────────────────────────────────────────────────────────────────────
type AyurvedaData = Record<string, any>;

const tieneContenido = (v: unknown): boolean =>
  typeof v === "string" ? v.trim().length > 0 : Array.isArray(v) ? v.length > 0 : false;

/** Gate para avanzar MÁS ALLÁ del paso `n` (1-based) del submapa del dosha. */
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
    // 5 (Alimentación) y 8 (Tu mapa) no piden nada.
    default: return true;
  }
}

/** Paso máximo ALCANZABLE (1-based) del submapa de un dosha. */
export function pasoAlcanzableAyurveda(data: AyurvedaData, dosha: string): number {
  let n = 1;
  while (n < AYURVEDA_DOSHA_TOTAL && puedeAvanzarAyurveda(data, dosha, n)) n++;
  return n;
}
