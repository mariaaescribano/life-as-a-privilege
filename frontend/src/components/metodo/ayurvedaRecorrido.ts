// ─────────────────────────────────────────────────────────────────────────
// ÍNDICE DEL RECORRIDO · AYURVEDA
//
// Orden canónico de las páginas del recorrido de cada dosha (los mismos pasos
// que encadenan las cabeceras con sus botones «← / →»). Alimenta el botón
// «Índice» reutilizado de psicología (ver IndiceRecorrido / IndiceAyurveda).
// Las rutas reciben el dosha (vata/pitta/kapha), que va en la URL.
// ─────────────────────────────────────────────────────────────────────────
import type { PasoRecorrido } from "./psicologiaRecorrido";

export const AYURVEDA_INDICE: PasoRecorrido[] = [
  { n: 1, titulo: "Naturaleza",     ruta: (d) => `/metodo/ayurveda/dosha/${d}` },
  { n: 2, titulo: "Descúbrete",     ruta: (d) => `/metodo/ayurveda/dosha/${d}/comenzar` },
  { n: 3, titulo: "Cuerpo",         ruta: (d) => `/metodo/ayurveda/dosha/${d}/cuerpo` },
  { n: 4, titulo: "Equilibrio",     ruta: (d) => `/metodo/ayurveda/dosha/${d}/desequilibrio` },
  { n: 5, titulo: "Alimentación",   ruta: (d) => `/metodo/ayurveda/dosha/${d}/cuidarte` },
  { n: 6, titulo: "Estilo de Vida", ruta: (d) => `/metodo/ayurveda/dosha/${d}/estilo` },
  { n: 7, titulo: "Tu día",         ruta: (d) => `/metodo/ayurveda/dosha/${d}/dia` },
  { n: 8, titulo: "Tu mapa",   ruta: (d) => `/metodo/ayurveda/dosha/${d}/recorrido` },
  { n: 9, titulo: "Cursos",         ruta: (d) => `/metodo/ayurveda/dosha/${d}/cursos` },
];

export const AYURVEDA_TOTAL = AYURVEDA_INDICE.length;
