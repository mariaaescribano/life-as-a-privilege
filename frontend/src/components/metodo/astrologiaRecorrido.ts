// ─────────────────────────────────────────────────────────────────────────
// ÍNDICE DEL RECORRIDO · ASTROLOGÍA
//
// Orden canónico de las páginas del recorrido de astrología (los mismos números
// de paso que muestran sus cabeceras). Alimenta el botón «Índice» reutilizado de
// psicología (ver IndiceRecorrido / IndiceAstrologia). Las rutas son estáticas
// (astrología no usa `experienciaId`), por eso ignoran el argumento.
//
// Los TÍTULOS salen del diccionario (`metodo.astro.paso.*`), así que el índice
// es una FUNCIÓN, no una constante: si fuera una constante se evaluaría al
// importar el módulo y los títulos se quedarían congelados en el idioma con el
// que arrancó la página, sin cambiar al pulsar el selector de idioma.
// ─────────────────────────────────────────────────────────────────────────
import { traducir } from "../../i18n";
import type { PasoRecorrido } from "./psicologiaRecorrido";

/** Los pasos del recorrido, con los títulos ya en el idioma activo. */
export const astrologiaIndice = (): PasoRecorrido[] => [
  { n: 1, titulo: traducir("metodo.astro.paso.astrologia"), ruta: () => "/metodo/astrologia" },
  // «Lo primero de tu carta» en vez de «Sol, Luna y Ascendente»: para quien
  // empieza, esos tres nombres todavía no significan nada, y lo que necesita
  // saber es que esta es la primera de las partes de su lectura. Los tres
  // nombres se explican dentro de la página, que es donde hacen falta.
  // En móvil se abrevia, que el largo no cabe de una línea en un botón.
  {
    n: 2,
    titulo: traducir("metodo.astro.paso.loPrimero"),
    tituloCorto: traducir("metodo.astro.paso.loPrimeroCorto"),
    ruta: () => "/metodo/astrologia/solascendenteluna",
  },
  { n: 3, titulo: traducir("metodo.astro.paso.arquetipos"), ruta: () => "/metodo/astrologia/cartaAstral" },
  { n: 4, titulo: traducir("metodo.astro.paso.puntosClave"), ruta: () => "/metodo/astrologia/lectura" },
  { n: 5, titulo: traducir("metodo.astro.paso.casas"), ruta: () => "/metodo/astrologia/casas" },
  { n: 6, titulo: traducir("metodo.astro.paso.aspectos"), ruta: () => "/metodo/astrologia/aspectos" },
  // Su carta entera en un PDF descargable: va justo después de haberla leído
  // toda y antes de la llamada, que es cuando ya tiene sentido llevársela.
  {
    n: 7,
    titulo: traducir("metodo.astro.paso.pdf"),
    tituloCorto: traducir("metodo.astro.paso.pdfCorto"),
    ruta: () => "/metodo/astrologia/pdf",
  },
  { n: 8, titulo: traducir("metodo.astro.paso.llamada"), ruta: () => "/metodo/astrologia/llamada" },
  { n: 9, titulo: traducir("metodo.astro.paso.cursos"), ruta: () => "/metodo/astrologia/cursos" },
];

/** Cuántos pasos tiene el recorrido. Constante: no depende del idioma. */
export const ASTROLOGIA_TOTAL = 9;
