// ─────────────────────────────────────────────────────────────────────────
// Lo que se GUARDA de los chakras: qué cómics ha leído ya.
//
//   data.chakras_leidos = ["muladhara", …]
//
// Todo el recorrido de Ayurveda guarda UN blob `data` que el backend reemplaza
// entero, así que nunca se escribe sin tener antes lo que ya había (de ahí que
// el mapa se guarde el blob en un ref y `marcarChakraLeido` devuelva el blob
// nuevo, no solo la lista).
//
// Y al LEER: lo guardado puede venir con otra forma —o no venir—, y eso no
// puede reventar el render. De ahí `leerChakrasLeidos`.
// ─────────────────────────────────────────────────────────────────────────
import type { ChakraKey } from "./chakras";

/** Clave de primer nivel con la lista de chakras ya leídos. */
export const CHAKRAS_LEIDOS_KEY = "chakras_leidos";

/** Lista de leídos, blindada. */
export function leerChakrasLeidos(data: any): string[] {
  const arr = data?.[CHAKRAS_LEIDOS_KEY];
  return Array.isArray(arr) ? arr.filter((x: unknown) => typeof x === "string") : [];
}

/** Añade un chakra a los leídos sin duplicarlo (devuelve el blob nuevo). */
export function marcarChakraLeido(data: any, key: ChakraKey): Record<string, any> {
  const leidos = leerChakrasLeidos(data);
  if (leidos.includes(key)) return data ?? {};
  return { ...(data ?? {}), [CHAKRAS_LEIDOS_KEY]: [...leidos, key] };
}

/**
 * El doṣha de la URL. Los chakras NO dependen de él, pero la ruta cuelga de
 * `/dosha/:dosha/` (herencia de Prāṇāyāma y Cursos) y hay que devolver algo
 * válido para poder construir los enlaces de al lado.
 */
export const doshaDeUrl = (d: string | undefined): string =>
  d === "vata" || d === "pitta" || d === "kapha" ? d : "vata";
