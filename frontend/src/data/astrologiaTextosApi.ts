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
import { adminHeaders } from "../app/admin/useAdminGuard";

export type FacetaAstro = "signo" | "casa";

export interface ArquetiposOverrides {
  signo: Record<string, Record<string, string>>;
  casa: Record<string, Record<string, string>>;
}

/** El texto efectivo (override si existe, si no el original hardcodeado). */
export function textoEstatico(cuerpo: string, faceta: FacetaAstro, valor: string): string | null {
  return faceta === "signo" ? getTextoSigno(cuerpo, valor) : getTextoCasa(cuerpo, Number(valor));
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
