import type { DisciplinaClave } from "./recorridoContenido";
import type { ClaveTexto } from "../i18n";

/**
 * El RECORRIDO de cada disciplina en «Asesorías 1:1»: las sesiones, en orden, con el
 * texto de lo que se hace en cada una. Es lo que enseña el box de al lado del mandala:
 * arriba la disciplina, en medio el texto de la sesión elegida y abajo un circulito por
 * cada sesión.
 *
 * LA LISTA ESTÁ VACÍA HASTA QUE MARÍA PASE LOS TEXTOS. Para rellenarla:
 *   1. Añade las frases en `i18n/textos/es/asesoria.ts` (y su traducción en `en`), con
 *      claves del estilo `asesoria.sesion.astrologia.1`, `asesoria.sesion.astrologia.2`…
 *   2. Ponlas aquí, en orden, en la disciplina que toque. El número de circulitos del
 *      box sale solo de cuántas pongas.
 * Una disciplina sin sesiones se ve sin texto y sin circulitos. `?sesionesDemo` en la
 * dirección enseña textos de ejemplo para ver el diseño (no salen en producción).
 */
export const SESIONES: Record<DisciplinaClave, ClaveTexto[]> = {
  astrologia: [],
  psicologia: [],
  fisiologia: [],
  nutricion: [],
  ayurveda: [],
  tcm: [],
  cultura: [],
  cabala: [],
};
