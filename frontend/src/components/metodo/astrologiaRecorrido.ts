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
// «Lo primero de tu carta» (Sol · Luna · Ascendente) YA NO es un paso propio:
// vive dentro de la primera página, debajo del formulario de datos. Una sola
// página para dar los datos y leer lo primero de la carta; la intro (los
// cómics) vuelve a verse cada vez que se entra a ese paso 1.
export const astrologiaIndice = (): PasoRecorrido[] => [
  // 1 · la Introducción con la carta (a ella se llega al saltar el cómic de la
  //     historia espiritual, que sale en /metodo/astrologia al pulsar START).
  { n: 1, titulo: traducir("metodo.astro.paso.introduccion"), ruta: () => "/metodo/astrologia/introduccion" },
  // 2 · la Historia: el cómic (y su reel) en UNA caja.
  { n: 2, titulo: traducir("metodo.astro.paso.historia"), ruta: () => "/metodo/astrologia/historia" },
  // 3 · la Introducción que lo explica todo: signos, casas, planetas y aspectos.
  { n: 3, titulo: traducir("metodo.astro.paso.explicacion"), ruta: () => "/metodo/astrologia/explicacion" },
  // 4 · Ascendente, Sol y Luna: lo que la mayoría conoce de la astrología.
  { n: 4, titulo: traducir("metodo.astro.paso.trio"), ruta: () => "/metodo/astrologia/trio" },
  // 5 · los puntos clave de SU carta, según María.
  { n: 5, titulo: traducir("metodo.astro.paso.puntosClave"), ruta: () => "/metodo/astrologia/lectura" },
  // 6 · Arquetipos: cada planeta en su signo y en su casa, en cajas.
  { n: 6, titulo: traducir("metodo.astro.paso.arquetipos"), ruta: () => "/metodo/astrologia/cartaAstral" },
  // 7-8 · los pasos de siempre, PROVISIONALES hasta que se rehaga el resto.
  { n: 7, titulo: traducir("metodo.astro.paso.casas"), ruta: () => "/metodo/astrologia/casas" },
  { n: 8, titulo: traducir("metodo.astro.paso.aspectos"), ruta: () => "/metodo/astrologia/aspectos" },
  // 9 · su carta entera en un PDF descargable.
  {
    n: 9,
    titulo: traducir("metodo.astro.paso.pdf"),
    tituloCorto: traducir("metodo.astro.paso.pdfCorto"),
    ruta: () => "/metodo/astrologia/pdf",
  },
  // 10 · los apuntes personales: signos, casas, planetas y aspectos a elegir.
  { n: 10, titulo: traducir("metodo.astro.paso.apuntes"), ruta: () => "/metodo/astrologia/apuntes" },
  // 11 · la Síntesis: lo que María quiere que no olvide.
  { n: 11, titulo: traducir("metodo.astro.paso.sintesis"), ruta: () => "/metodo/astrologia/sintesis" },
  // 12
  { n: 12, titulo: traducir("metodo.astro.paso.cursos"), ruta: () => "/metodo/astrologia/cursos" },
];

/** Cuántos pasos tiene el recorrido. Constante: no depende del idioma.
 *  ⚠️ Si cambia, cambia también `metodo.total` en data/camino.ts. */
export const ASTROLOGIA_TOTAL = 12;
