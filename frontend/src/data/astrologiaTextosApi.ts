// ─────────────────────────────────────────────────────────────────────────
// API de los TEXTOS de arquetipos (interpretaciones de la carta astral del
// recorrido).
//
// Los textos viven HARDCODEADOS en el proyecto:
//   · originales  → astrologiaTextos.ts
//   · overrides   → astrologiaTextos.overrides.ts (editados desde /admin)
// El texto efectivo (override ?? original) lo resuelven getTextoSigno/getTextoCasa.
//
// El editor de admin persiste los overrides reescribiendo el archivo del
// proyecto a través del back (PUT /astrologia-arquetipos), solo en local. No hay
// base de datos de por medio.
// ─────────────────────────────────────────────────────────────────────────
import axios from "axios";
import { API_URL } from "../GlobalVariables";
import { getTextoSigno, getTextoCasa } from "../components/metodo/astrologiaTextos";
import { ARQUETIPOS_OVERRIDES } from "../components/metodo/astrologiaTextos.overrides";
import { RESUMENES_SIGNO, RESUMENES_CASA } from "../components/metodo/astrologiaResumenes";
import type { CuerpoKey } from "../components/metodo/astrologiaData";
import { adminHeaders } from "../app/admin/useAdminGuard";

export type FacetaAstro = "signo" | "casa";

export interface ArquetiposOverrides {
  signo: Record<string, Record<string, string>>;
  casa: Record<string, Record<string, string>>;
}

/** El resumen (2-3 frases memorables) de un arquetipo, si existe. */
function resumenDe(cuerpo: string, faceta: FacetaAstro, valor: string): string | null {
  const k = cuerpo as CuerpoKey;
  return faceta === "signo"
    ? RESUMENES_SIGNO[k]?.[valor] ?? null
    : RESUMENES_CASA[k]?.[Number(valor)] ?? null;
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
 * Texto de una interpretación para el popup «saber más». Ya no hay red ni BD:
 * el texto está hardcodeado, así que se resuelve en local y se devuelve envuelto
 * en una Promise para no tocar el llamante (SaberMasModal).
 */
export function fetchAstroTexto(cuerpo: string, faceta: FacetaAstro, valor: string): Promise<string | null> {
  return Promise.resolve(textoEstatico(cuerpo, faceta, valor));
}

// ── Admin (editor de overrides) ──────────────────────────────────────────────

/** Los overrides actuales del proyecto (clon del módulo hardcodeado). */
export function cargarOverrides(): ArquetiposOverrides {
  return {
    signo: JSON.parse(JSON.stringify(ARQUETIPOS_OVERRIDES.signo ?? {})),
    casa: JSON.parse(JSON.stringify(ARQUETIPOS_OVERRIDES.casa ?? {})),
  };
}

/** Reescribe el archivo de overrides del proyecto (solo funciona en local). */
export async function guardarOverrides(
  overrides: ArquetiposOverrides,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data } = await axios.put(
      `${API_URL}/astrologia-arquetipos`,
      { overrides },
      { headers: adminHeaders() },
    );
    return data ?? { success: false };
  } catch (e: unknown) {
    const error =
      axios.isAxiosError(e) && typeof e.response?.data?.error === "string"
        ? e.response.data.error
        : "No se pudo guardar";
    return { success: false, error };
  }
}
