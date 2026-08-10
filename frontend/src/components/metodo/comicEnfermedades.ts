import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Cómic de MEDICINA CHINA: «Las enfermedades». Seis viñetas. Se intercala
// ENTRE Los ciclos (/metodo/tcm/ciclos) y el Diagnóstico final
// (/metodo/tcm/diagnostico): ya ha visto cómo se generan y se controlan los
// cinco elementos, y aquí se cuenta qué pasa cuando esos ciclos se rompen —
// justo antes de que la página siguiente le dé su propio diagnóstico.
//
// OJO: este cómic NO está en las «Ilustraciones» de TCM (que son Origen, Yin
// Yang, Los Cinco Elementos y El Alma Humana); vive solo en este paso.
//
// ⚠️ FALTA EL TEXTO. Las seis ilustraciones ya están subidas; los `paragraphs`
// están vacíos a la espera del guion. Con el array vacío el visor pinta la
// viñeta sin texto, así que el cómic no rompe, pero hasta que se rellene se ve
// solo la imagen. Para completarlo: escribir los párrafos de cada viñeta aquí
// abajo y ya está — el cómic está enganchado y no hay que tocar nada más.
//
// Imágenes: /viñetas/tcm/enfermedades/enfermedades1.webp … enfermedades6.webp.
// ─────────────────────────────────────────────────────────────────────────

const P = "/viñetas/tcm/enfermedades";

export const VINETAS_ENFERMEDADES: Vineta[] = [
  {
    src: `${P}/enfermedades1.webp`,
    paragraphs: [],
  },
  {
    src: `${P}/enfermedades2.webp`,
    paragraphs: [],
  },
  {
    src: `${P}/enfermedades3.webp`,
    paragraphs: [],
  },
  {
    src: `${P}/enfermedades4.webp`,
    paragraphs: [],
  },
  {
    src: `${P}/enfermedades5.webp`,
    paragraphs: [],
  },
  {
    src: `${P}/enfermedades6.webp`,
    paragraphs: [],
  },
];
