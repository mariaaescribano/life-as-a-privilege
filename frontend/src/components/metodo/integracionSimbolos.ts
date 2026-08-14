// ─────────────────────────────────────────────────────────────────────────
// LA INTEGRACIÓN · Etiquetas de los arquetipos
//
// El texto de cada arquetipo (su interpretación) NO vive aquí: se lee con el
// mismo popup que en Astrología (SaberMasModal → getTextoSigno/getTextoCasa).
// Aquí sólo quedan ayudas de etiquetado para las tarjetas y los chips.
//
// El IDIOMA lo resuelven las utilidades de Astrología (astrologiaNombres.ts):
// el dato sigue guardándose con su nombre español («Géminis», `sol`) y de allí
// sale únicamente el rótulo. Así estas etiquetas cambian con el selector sin
// tocar nada de lo guardado, y sin una segunda tabla de nombres que mantener.
// ─────────────────────────────────────────────────────────────────────────

import { cuerpoEnCasa, cuerpoEnSigno, nombreCuerpo as rotuloCuerpo } from "./astrologiaNombres";

/** Nombre del cuerpo: «Saturno» / "Saturn", «Sol» / "Sun", «Ascendente». */
export function nombreCuerpo(cuerpoKey: string): string {
  return rotuloCuerpo(cuerpoKey);
}

/** Etiqueta de UNA faceta del arquetipo: «Sol en Géminis» / "Sun in Gemini",
 *  «Sol en Casa 10» / "Sun in House 10". */
export function arquetipoLabel(a: {
  cuerpoKey: string;
  faceta: "signo" | "casa";
  signo: string | null;
  casa: number | null;
}): string {
  return a.faceta === "casa"
    ? cuerpoEnCasa(a.cuerpoKey, a.casa ?? "")
    : cuerpoEnSigno(a.cuerpoKey, a.signo);
}
