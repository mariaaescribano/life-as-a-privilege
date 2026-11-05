import type { CuerpoKey } from "../astrologiaData";

export type TipoAspecto =
  | "conjuncion"
  | "oposicion"
  | "trigono"
  | "cuadratura"
  | "sextil"
  | "semisextil"
  | "quincuncio";

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
  semisextil: "#a8d8a0",
  quincuncio: "#d0a0c8",
};

// NOTA: los orbes NO se calculan en el frontend. La carta (incluidos los
// aspectos) la calcula el backend en cartaNatal.service.ts (ASPECTOS_DEF),
// que es la única fuente de verdad. Aquí solo se pintan los aspectos recibidos.

/**
 * Mapea un grado eclíptico a un ángulo de la carta (math angle en 3D) con la geometría ESTÁNDAR
 * de las cartas natales (la de astro.com y la mayoría de webs): el zodíaco va uniforme, 30° por
 * signo, girado para que el Ascendente (cúspide 1) quede a la IZQUIERDA y los grados crezcan en
 * sentido antihorario. Las casas NO miden todas lo mismo (sus cúspides caen donde caen: la 10
 * rara vez está justo arriba), y cada planeta está en su grado real respecto a los signos.
 *
 * Antes se usaba un reparto «Placidus igualado» (cada casa a 30° de carta y el zodíaco estirado
 * para encajarlo): quedaba simétrico pero colocaba los planetas visualmente en otro sitio.
 */
export function gradoAVisualRad(grado: number, cusps: number[]): number {
  const asc = ((cusps[0] % 360) + 360) % 360;
  const off = (((grado - asc) % 360) + 360) % 360;
  return Math.PI + (off * Math.PI) / 180;
}

/**
 * Separa los ángulos que caen casi encima (conjunciones, estelios) para que sus glifos no se
 * solapen. Devuelve el ángulo DONDE SE DIBUJA cada glifo; el grado exacto sigue en su sitio
 * (marca en el aro de las casas + línea guía). `minSep` en radianes, medido al radio del glifo.
 */
export function separarAngulos(items: { key: string; ang: number }[], minSep: number): Map<string, number> {
  const TAU = Math.PI * 2;
  const orden = items
    .map((o) => ({ key: o.key, real: ((o.ang % TAU) + TAU) % TAU, ang: ((o.ang % TAU) + TAU) % TAU }))
    .sort((a, b) => a.real - b.real);
  const n = orden.length;
  if (n < 2) return new Map(orden.map((o) => [o.key, o.ang]));
  for (let vuelta = 0; vuelta < 80; vuelta++) {
    let movido = false;
    for (let i = 0; i < n; i++) {
      const a = orden[i];
      const b = orden[(i + 1) % n];
      let d = b.ang - a.ang;
      if (i === n - 1) d += TAU; // el par que cierra el círculo
      if (d < minSep - 1e-4) {
        const empuje = (minSep - d) / 2;
        a.ang -= empuje;
        b.ang += empuje;
        movido = true;
      }
    }
    // Un hilo suave los devuelve hacia su grado real, para que no se alejen más de lo necesario.
    for (const o of orden) o.ang += (o.real - o.ang) * 0.04;
    if (!movido) break;
  }
  return new Map(orden.map((o) => [o.key, o.ang]));
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

