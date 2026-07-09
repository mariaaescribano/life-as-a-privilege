// ─────────────────────────────────────────────────────────────────────────
// ÍNDICE DEL RECORRIDO · ASTROLOGÍA
//
// Orden canónico de las páginas del recorrido de astrología (los mismos números
// de paso que muestran sus cabeceras). Alimenta el botón «Índice» reutilizado de
// psicología (ver IndiceRecorrido / IndiceAstrologia). Las rutas son estáticas
// (astrología no usa `experienciaId`), por eso ignoran el argumento.
// ─────────────────────────────────────────────────────────────────────────
import type { PasoRecorrido } from "./psicologiaRecorrido";

export const ASTROLOGIA_INDICE: PasoRecorrido[] = [
  { n: 1, titulo: "Astrología",              ruta: () => "/metodo/astrologia" },
  { n: 2, titulo: "Sol, Luna y Ascendente",  ruta: () => "/metodo/astrologia/solascendenteluna" },
  { n: 3, titulo: "Arquetipos",              ruta: () => "/metodo/astrologia/cartaAstral" },
  { n: 4, titulo: "Puntos clave",            ruta: () => "/metodo/astrologia/lectura" },
  { n: 5, titulo: "Casas",                   ruta: () => "/metodo/astrologia/casas" },
  { n: 6, titulo: "Aspectos",                ruta: () => "/metodo/astrologia/aspectos" },
  { n: 7, titulo: "Llamada",                 ruta: () => "/metodo/astrologia/llamada" },
  { n: 8, titulo: "Cursos",                  ruta: () => "/metodo/astrologia/cursos" },
];

export const ASTROLOGIA_TOTAL = ASTROLOGIA_INDICE.length;
