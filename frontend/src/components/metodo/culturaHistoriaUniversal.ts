import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// HISTORIA UNIVERSAL (Cultura) — datos de la línea de tiempo.
//
// Cada "hito" es un círculo de la línea de tiempo (con título y época) y, al
// pulsarlo, abriría SU PROPIO cómic (vinetas). Ahora mismo los círculos son las
// grandes ERAS de la Historia, SIN cómic y SIN foto todavía (se añadirán después):
// las fotos del círculo irían en /img/cultura/historia/universal/<key>.png y las
// viñetas del cómic en /viñetas/cultura/historiauniversal/<key>/…
// ─────────────────────────────────────────────────────────────────────────

export interface HitoHistoria {
  key: string;
  /** Título que se muestra junto al círculo. */
  titulo: string;
  /** Año / época que se muestra bajo el título. */
  anio: string;
  /** Foto redonda del círculo (opcional; si falta, se pinta un marcador). */
  foto?: string;
  /** Cómic de este hito (se abre al pulsar el círculo). */
  vinetas: Vineta[];
}

export const HISTORIA_UNIVERSAL_HITOS: HitoHistoria[] = [
  {
    key: "prehistoria",
    titulo: "Prehistoria",
    anio: "hasta ~3500 a. C.",
    vinetas: [],
  },
  {
    key: "edad-antigua",
    titulo: "Edad Antigua",
    anio: "3500 a. C. – 476 d. C.",
    vinetas: [],
  },
  {
    key: "edad-media",
    titulo: "Edad Media",
    anio: "476 – 1453/1492",
    vinetas: [],
  },
  {
    key: "edad-moderna",
    titulo: "Edad Moderna",
    anio: "1450/1492 – 1789",
    vinetas: [],
  },
  {
    key: "era-industrial",
    titulo: "Era Industrial",
    anio: "1789 – 1945",
    vinetas: [],
  },
  {
    key: "era-digital",
    titulo: "Era Digital",
    anio: "1945 – actualidad",
    vinetas: [],
  },
];
