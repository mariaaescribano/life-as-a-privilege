// ─────────────────────────────────────────────────────────────────────────
// API de los TEXTOS de arquetipos (interpretaciones de la carta astral del
// recorrido).
//
// Los textos ORIGINALES viven hardcodeados en el proyecto (astrologiaTextos.ts).
// Los overrides (lo editado en /admin/astrologia-textos) tienen dos copias:
//   · la fila de la tabla astrologia_arquetipos → la que MANDA, y la que hace
//     que editar en producción funcione;
//   · astrologiaTextos.overrides.ts → respaldo commiteado, se usa mientras no
//     haya nada en la BD (y como arranque en frío).
// El texto efectivo lo resuelven getTextoSigno/getTextoCasa.
// ─────────────────────────────────────────────────────────────────────────
import axios from "axios";
import { API_URL } from "../GlobalVariables";
import { getTextoSigno, getTextoCasa } from "../components/metodo/astrologiaTextos";
import { ARQUETIPOS_OVERRIDES } from "../components/metodo/astrologiaTextos.overrides";
import { RESUMENES_SIGNO, RESUMENES_CASA } from "../components/metodo/astrologiaResumenes";
import { RESUMENES_SIGNO_EN, RESUMENES_CASA_EN } from "../components/metodo/astrologiaResumenes.en";
import type { CuerpoKey } from "../components/metodo/astrologiaData";
import { getIdioma } from "../i18n";
import { adminHeaders } from "../app/admin/useAdminGuard";
import {
  cargarOverridesRemotos,
  overridesRemotos,
  type ArquetiposOverrides,
} from "./astrologiaOverridesRemotos";

export type FacetaAstro = "signo" | "casa";

export type { ArquetiposOverrides };

/**
 * El resumen (2-3 frases memorables) de un arquetipo, si existe.
 *
 * En inglés sale el traducido y, mientras no lo esté, el español. El resumen es
 * un bloque cerrado —va arriba, separado del texto largo por una raya—, así que
 * enseñarlo ya traducido aunque su texto largo siga pendiente se lee bien y hace
 * que la traducción se note desde la primera frase. Lo ideal, de todas formas,
 * es traducir el resumen y el texto del mismo arquetipo a la vez.
 */
function resumenDe(cuerpo: string, faceta: FacetaAstro, valor: string): string | null {
  const k = cuerpo as CuerpoKey;
  const en = getIdioma() === "en";
  if (faceta === "signo") {
    return (en ? RESUMENES_SIGNO_EN[k]?.[valor] : null) ?? RESUMENES_SIGNO[k]?.[valor] ?? null;
  }
  const casa = Number(valor);
  return (en ? RESUMENES_CASA_EN[k]?.[casa] : null) ?? RESUMENES_CASA[k]?.[casa] ?? null;
}

/**
 * El texto efectivo (override si existe, si no el original hardcodeado), con el
 * resumen antepuesto: `resumen` + `---` + `texto`. El popup usa el «---» para
 * mostrar el resumen arriba y el texto detrás de «Seguir leyendo».
 * Si el texto ya trae su propio «---», se respeta tal cual.
 */
export function textoEstatico(cuerpo: string, faceta: FacetaAstro, valor: string): string | null {
  const texto = faceta === "signo" ? getTextoSigno(cuerpo, valor) : getTextoCasa(cuerpo, Number(valor));
  if (texto == null) return null;
  if (/^[ \t]*---[ \t]*$/m.test(texto)) return texto; // ya trae resumen propio
  const resumen = resumenDe(cuerpo, faceta, valor);
  return resumen ? `${resumen}\n\n---\n\n${texto}` : texto;
}

/**
 * Texto de una interpretación para el popup «saber más». Espera a los overrides
 * de la BD (una sola petición cacheada para toda la carga de página) y luego
 * resuelve en local; si el servidor no responde, sale el texto del bundle.
 */
export async function fetchAstroTexto(
  cuerpo: string,
  faceta: FacetaAstro,
  valor: string,
): Promise<string | null> {
  await cargarOverridesRemotos();
  return textoEstatico(cuerpo, faceta, valor);
}

// ── Admin (editor de overrides) ──────────────────────────────────────────────

const clonar = (o: ArquetiposOverrides): ArquetiposOverrides => ({
  signo: JSON.parse(JSON.stringify(o.signo ?? {})),
  casa: JSON.parse(JSON.stringify(o.casa ?? {})),
});

/** Los overrides del proyecto (respaldo del bundle), sin pasar por la red. */
export function cargarOverridesLocales(): ArquetiposOverrides {
  return clonar(ARQUETIPOS_OVERRIDES as ArquetiposOverrides);
}

/**
 * Los overrides que hay que EDITAR: los de la BD si hay fila, si no los del
 * proyecto. Importa que sea el conjunto completo, porque al guardar se manda
 * entero y la fila pasa a ser la verdad: si se editara sobre un conjunto a
 * medias, lo que faltara se borraría sin querer.
 */
export async function cargarOverrides(): Promise<ArquetiposOverrides> {
  const remotos = await cargarOverridesRemotos(true);
  return clonar(remotos ?? (ARQUETIPOS_OVERRIDES as ArquetiposOverrides));
}

/**
 * Guarda el conjunto completo. El back lo escribe en la BD (lo que funciona en
 * producción) y, si se está en local, también en el archivo del proyecto.
 */
export async function guardarOverrides(
  overrides: ArquetiposOverrides,
): Promise<{ success: boolean; error?: string; archivoLocal?: boolean }> {
  try {
    const { data } = await axios.put(
      `${API_URL}/astrologia-arquetipos`,
      { overrides },
      { headers: adminHeaders() },
    );
    // Que lo recién guardado sea ya lo que ve el recorrido en esta pestaña.
    if (data?.success) await cargarOverridesRemotos(true);
    return data ?? { success: false };
  } catch (e: unknown) {
    const error =
      axios.isAxiosError(e) && typeof e.response?.data?.error === "string"
        ? e.response.data.error
        : "No se pudo guardar";
    return { success: false, error };
  }
}

/** Reexport para las pantallas que pintan texto de forma síncrona. */
export { overridesRemotos };
