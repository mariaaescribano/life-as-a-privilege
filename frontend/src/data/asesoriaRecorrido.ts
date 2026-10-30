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
  astrologia: ["asesoria.sesion.astrologia.1", "asesoria.sesion.astrologia.2", "asesoria.sesion.astrologia.3"],
  psicologia: ["asesoria.sesion.psicologia.1", "asesoria.sesion.psicologia.2", "asesoria.sesion.psicologia.3", "asesoria.sesion.psicologia.4"],
  fisiologia: ["asesoria.sesion.fisiologia.1", "asesoria.sesion.fisiologia.2", "asesoria.sesion.fisiologia.3"],
  nutricion: ["asesoria.sesion.nutricion.1", "asesoria.sesion.nutricion.2", "asesoria.sesion.nutricion.3"],
  ayurveda: ["asesoria.sesion.ayurveda.1", "asesoria.sesion.ayurveda.2", "asesoria.sesion.ayurveda.3"],
  tcm: ["asesoria.sesion.tcm.1", "asesoria.sesion.tcm.2", "asesoria.sesion.tcm.3"],
  cultura: ["asesoria.sesion.cultura.1", "asesoria.sesion.cultura.2", "asesoria.sesion.cultura.3"],
  cabala: ["asesoria.sesion.cabala.1", "asesoria.sesion.cabala.2"],
};

/** Botón bajo el texto de una sesión (clave del texto del botón). Abre el reel `video` en una
 *  ventana emergente; mientras no haya enlace, el botón sale pero no abre nada. */
export const BOTON_SESION: Partial<Record<DisciplinaClave, { sesion: number; texto: ClaveTexto; video?: string }>> = {
  astrologia: { sesion: 0, texto: "asesoria.sesion.astrologia.1.boton", video: "" },
};
