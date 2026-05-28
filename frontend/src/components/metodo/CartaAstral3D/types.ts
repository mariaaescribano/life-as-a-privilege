import type { CuerpoKey } from "../astrologiaData";

export type TipoAspecto =
  | "conjuncion"
  | "oposicion"
  | "trigono"
  | "cuadratura"
  | "sextil";

export interface PosicionPlaneta {
  planeta: CuerpoKey;
  grado: number;
  signoIdx: number;
  casa: number;
}

export interface Aspecto {
  a: CuerpoKey;
  b: CuerpoKey;
  tipo: TipoAspecto;
}

export interface CartaNatal {
  ascendente: number;
  cusps: number[];
  planetas: PosicionPlaneta[];
  aspectos: Aspecto[];
}

export const COLOR_ASPECTO: Record<TipoAspecto, string> = {
  conjuncion: "#ffd97d",
  oposicion: "#ff6b6b",
  cuadratura: "#ff8a4c",
  trigono: "#6ec1ff",
  sextil: "#80efd8",
};

export const ORBE_GRADOS: Record<TipoAspecto, number> = {
  conjuncion: 8,
  oposicion: 8,
  trigono: 7,
  cuadratura: 7,
  sextil: 5,
};

/**
 * Mapea un grado eclíptico a un ángulo de la carta (math angle en 3D), usando un
 * render tipo Placidus: las 4 cúspides angulares (1, 4, 7, 10) quedan ancladas
 * a izquierda / abajo / derecha / arriba; el resto de cúspides reparten cada
 * cuadrante en 3 tercios iguales (30° de carta por casa). El zodíaco dentro de
 * cada casa se estira/comprime de forma proporcional al span eclíptico de la casa.
 */
export function gradoAVisualRad(grado: number, cusps: number[]): number {
  const lon = ((grado % 360) + 360) % 360;
  for (let h = 0; h < 12; h++) {
    const a = cusps[h];
    const b = cusps[(h + 1) % 12];
    const span = ((b - a) % 360 + 360) % 360 || 360;
    const offset = ((lon - a) % 360 + 360) % 360;
    if (offset < span) {
      const f = offset / span;
      // Cusp h en chart angle = π + h·(π/6); cada casa ocupa π/6 de chart angle.
      return Math.PI + h * (Math.PI / 6) + f * (Math.PI / 6);
    }
  }
  return Math.PI;
}

export const COLOR_SIGNOS: string[] = [
  "#e0625c",
  "#a8634c",
  "#b8d4c0",
  "#9bbd80",
  "#e89858",
  "#9eaa72",
  "#7fa470",
  "#a04848",
  "#5a8fbf",
  "#3a6e5c",
  "#e89048",
  "#7a5fa0",
];

