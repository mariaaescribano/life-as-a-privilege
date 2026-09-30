import { ZODIAC_SIGNS, cuerpoByKey, type CuerpoKey } from "./astrologiaData";
import type { Aspecto, TipoAspecto } from "./CartaAstral3D/types";

/* ──────────────────────────────────────────────
   REGENCIAS MODERNAS (signo → planeta regente)
   Índice 0..11 según ZODIAC_SIGNS (Aries..Piscis)
   ────────────────────────────────────────────── */
export const REGENTE_MODERNO: CuerpoKey[] = [
  "marte",    // Aries
  "venus",    // Tauro
  "mercurio", // Géminis
  "luna",     // Cáncer
  "sol",      // Leo
  "mercurio", // Virgo
  "venus",    // Libra
  "pluton",   // Escorpio
  "jupiter",  // Sagitario
  "saturno",  // Capricornio
  "urano",    // Acuario
  "neptuno",  // Piscis
];

/** Color propio de cada signo (por su nombre en español), pensado para brillar
 *  sobre el cielo oscuro: Escorpio morado, Aries rojo, Acuario cian… */
export const COLOR_SIGNO: Record<string, string> = {
  Aries: "#ff5a4d",
  Tauro: "#7ddf7a",
  "Géminis": "#ffe066",
  "Cáncer": "#cfe3ff",
  Leo: "#ffc21a",
  Virgo: "#b5cf6a",
  Libra: "#ff9ec7",
  Escorpio: "#b46bff",
  Sagitario: "#ff8a3d",
  Capricornio: "#c9a27a",
  Acuario: "#3fe0ff",
  Piscis: "#5aa9ff",
};

function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Índice de signo (0..11) sobre el que cae la cúspide de la casa `casaNum` (1..12). */
export function signoIdxDeCasa(cusps: number[], casaNum: number): number | null {
  const cusp = cusps?.[casaNum - 1];
  if (cusp == null || !Number.isFinite(cusp)) return null;
  return Math.floor(norm360(cusp) / 30) % 12;
}

/** Info completa de una casa: signo en la cúspide y su planeta regente. */
export function infoCasa(cusps: number[], casaNum: number) {
  const signoIdx = signoIdxDeCasa(cusps, casaNum);
  if (signoIdx == null) return null;
  const signo = ZODIAC_SIGNS[signoIdx];
  const regenteKey = REGENTE_MODERNO[signoIdx];
  const regente = cuerpoByKey(regenteKey);
  return { signoIdx, signo, regenteKey, regente };
}

export const NUMEROS_ROMANOS = [
  "I", "II", "III", "IV", "V", "VI",
  "VII", "VIII", "IX", "X", "XI", "XII",
];

/* ──────────────────────────────────────────────
   ASPECTOS — etiquetas, símbolos y clave estable
   ────────────────────────────────────────────── */
export const ASPECTO_LABEL: Record<TipoAspecto, string> = {
  conjuncion: "Conjunción",
  oposicion: "Oposición",
  trigono: "Trígono",
  cuadratura: "Cuadratura",
  sextil: "Sextil",
  semisextil: "Semisextil",
  quincuncio: "Quincuncio",
};

export const ASPECTO_SYMBOL: Record<TipoAspecto, string> = {
  conjuncion: "☌",
  oposicion: "☍",
  trigono: "△",
  cuadratura: "□",
  sextil: "⚹",
  semisextil: "⚺",
  quincuncio: "⚻",
};

/** Clave estable de un aspecto para indexar el texto escrito a mano. */
export function aspectoKey(a: Aspecto): string {
  return `${a.a}-${a.b}-${a.tipo}`;
}
