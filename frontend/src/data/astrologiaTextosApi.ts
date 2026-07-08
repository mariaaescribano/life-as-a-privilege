// ─────────────────────────────────────────────────────────────────────────
// API de los TEXTOS de arquetipos (interpretaciones de la carta astral).
//
// Los textos viven ahora en el back (tabla `astrologia_textos`), editables
// desde el panel de admin. Mientras una celda no esté sembrada en la tabla,
// se cae al archivo estático `astrologiaTextos.ts` (fallback) para no romper
// nada durante la migración.
// ─────────────────────────────────────────────────────────────────────────
import axios from "axios";
import { API_URL } from "../GlobalVariables";
import { CUERPOS, ZODIAC_SIGNS } from "../components/metodo/astrologiaData";
import { getTextoSigno, getTextoCasa } from "../components/metodo/astrologiaTextos";
import { adminHeaders } from "../app/admin/useAdminGuard";

export type FacetaAstro = "signo" | "casa";

export interface AstroTextoInput {
  cuerpo: string;
  faceta: FacetaAstro;
  valor: string;
  texto: string;
}

export interface AstroTextoRow extends AstroTextoInput {
  updated_at?: string;
}

// Caché en memoria por (cuerpo|faceta|valor) para no repetir peticiones.
const cache = new Map<string, string | null>();
const claveCache = (c: string, f: string, v: string) => `${c}|${f}|${v}`;

/** El texto del archivo estático (fallback / origen para la importación). */
export function textoEstatico(cuerpo: string, faceta: FacetaAstro, valor: string): string | null {
  return faceta === "signo" ? getTextoSigno(cuerpo, valor) : getTextoCasa(cuerpo, Number(valor));
}

/** Texto de una interpretación: primero el back; si está vacío, el estático. */
export async function fetchAstroTexto(cuerpo: string, faceta: FacetaAstro, valor: string): Promise<string | null> {
  const key = claveCache(cuerpo, faceta, valor);
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  let texto: string | null = null;
  try {
    const { data } = await axios.get(
      `${API_URL}/astrologia-textos/item/${encodeURIComponent(cuerpo)}/${faceta}/${encodeURIComponent(valor)}`,
    );
    if (typeof data?.texto === "string" && data.texto.trim() !== "") texto = data.texto;
  } catch {
    // silencioso → probamos el fallback
  }
  if (texto == null) texto = textoEstatico(cuerpo, faceta, valor);
  cache.set(key, texto);
  return texto;
}

/** Vacía la caché (tras editar en admin). Sin args, la vacía entera. */
export function invalidarCacheAstro(cuerpo?: string, faceta?: FacetaAstro, valor?: string) {
  if (cuerpo && faceta && valor != null) cache.delete(claveCache(cuerpo, faceta, String(valor)));
  else cache.clear();
}

// ── Admin ──────────────────────────────────────────────────────────────────

/** Todas las interpretaciones guardadas en la tabla (para el editor). */
export async function fetchTodosTextos(): Promise<AstroTextoRow[]> {
  const { data } = await axios.get(`${API_URL}/astrologia-textos/todos`, { headers: adminHeaders() });
  return Array.isArray(data) ? (data as AstroTextoRow[]) : [];
}

/** Guarda (upsert) una interpretación. */
export async function guardarTexto(input: AstroTextoInput): Promise<{ success: boolean }> {
  const { data } = await axios.patch(`${API_URL}/astrologia-textos`, input, { headers: adminHeaders() });
  invalidarCacheAstro(input.cuerpo, input.faceta, input.valor);
  return data ?? { success: false };
}

/** Recopila TODOS los textos del archivo estático (para la siembra inicial). */
export function recopilarTextosEstaticos(): AstroTextoInput[] {
  const out: AstroTextoInput[] = [];
  for (const c of CUERPOS) {
    for (const s of ZODIAC_SIGNS) {
      const t = getTextoSigno(c.key, s.name);
      if (t && t.trim()) out.push({ cuerpo: c.key, faceta: "signo", valor: s.name, texto: t });
    }
    if (c.conCasa) {
      for (let h = 1; h <= 12; h++) {
        const t = getTextoCasa(c.key, h);
        if (t && t.trim()) out.push({ cuerpo: c.key, faceta: "casa", valor: String(h), texto: t });
      }
    }
  }
  return out;
}

/** Importa en bloque el archivo estático a la tabla (siembra inicial). */
export async function importarTextosEstaticos(): Promise<{ success: boolean; count: number; enviados: number }> {
  const textos = recopilarTextosEstaticos();
  const { data } = await axios.put(`${API_URL}/astrologia-textos/bulk`, { textos }, { headers: adminHeaders() });
  invalidarCacheAstro();
  return { success: !!data?.success, count: data?.count ?? 0, enviados: textos.length };
}
