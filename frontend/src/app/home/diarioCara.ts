// ─────────────────────────────────────────────────────────────────────────────
// La CARA de una entrada del diario: con qué color, icono y nombre se pinta.
//
// Vive aparte porque la usan las dos piezas del diario (la tarjeta del Home y
// la página /diario) y también el panel de administración, que necesita la
// misma lista para el desplegable de disciplina.
// ─────────────────────────────────────────────────────────────────────────────
import { ADMIN_DISCIPLINAS, disciplinaByKey } from "../../data/adminDisciplinas";

export interface CaraEntrada {
  /** nombre INTERNO de la disciplina (el de GlobalVariables). Vacío si no tiene. */
  nom: string;
  bg: string;
  txt: string;
  Icon?: React.ComponentType<{ size?: any }>;
}

/** Neutra: las sesiones sin disciplina se pintan con el blanco del Home. */
const NEUTRA: CaraEntrada = {
  nom: "",
  bg: "rgba(255,255,255,0.07)",
  txt: "#ffffff",
};

/**
 * Cara de una entrada a partir de su `disciplina`.
 *
 * Una key desconocida (una disciplina que se renombró, una fila antigua) cae en
 * la neutra en vez de romper el render.
 */
export const caraDeEntrada = (disciplina: string | null): CaraEntrada => {
  if (!disciplina) return NEUTRA;
  const d = disciplinaByKey(disciplina);
  if (!d) return NEUTRA;
  return { nom: d.nombre, bg: d.bg, txt: d.txt, Icon: d.Icon };
};

/** Las 8 disciplinas para el desplegable del panel (key + nombre en español). */
export const DISCIPLINAS_DIARIO = ADMIN_DISCIPLINAS.map((d) => ({
  key: d.key,
  nombre: d.nombre,
  bg: d.bg,
  txt: d.txt,
}));

/** «12 de septiembre de 2026». Si la fecha no vale, cadena vacía. */
export const fechaLarga = (iso: string, locale = "es-ES"): string => {
  if (!iso) return "";
  // `2026-09-12` sin hora lo interpreta el navegador como UTC y en España
  // podría retroceder un día: se parte a mano para que sea la fecha escrita.
  const [a, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!a || !m || !d) return "";
  const fecha = new Date(a, m - 1, d);
  if (Number.isNaN(fecha.getTime())) return "";
  return fecha.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
};

/** «12 sept» — la versión corta de la tarjeta del Home. */
export const fechaCorta = (iso: string, locale = "es-ES"): string => {
  if (!iso) return "";
  const [a, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!a || !m || !d) return "";
  const fecha = new Date(a, m - 1, d);
  if (Number.isNaN(fecha.getTime())) return "";
  return fecha.toLocaleDateString(locale, { day: "numeric", month: "short" });
};
