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

export function gradoAVisualRad(grado: number, ascendente: number): number {
  const delta = grado - ascendente;
  return Math.PI + (delta * Math.PI) / 180;
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

