// ─────────────────────────────────────────────────────────────────────────
// LA INTEGRACIÓN · Etiquetas de los arquetipos
//
// El texto de cada arquetipo (su interpretación) NO vive aquí: se lee con el
// mismo popup que en Astrología (SaberMasModal → getTextoSigno/getTextoCasa).
// Aquí sólo quedan ayudas de etiquetado para las tarjetas y los chips.
// ─────────────────────────────────────────────────────────────────────────

import { cuerpoByKey } from "./astrologiaData";

/** Nombre del cuerpo: «Saturno», «Sol», «Ascendente». */
export function nombreCuerpo(cuerpoKey: string): string {
  return cuerpoByKey(cuerpoKey)?.label ?? cuerpoKey;
}

/** Etiqueta de UNA faceta del arquetipo: «Sol en Géminis» o «Sol en casa 10». */
export function arquetipoLabel(a: {
  cuerpoKey: string;
  faceta: "signo" | "casa";
  signo: string | null;
  casa: number | null;
}): string {
  const n = nombreCuerpo(a.cuerpoKey);
  return a.faceta === "casa" ? `${n} en casa ${a.casa}` : `${n} en ${a.signo}`;
}
