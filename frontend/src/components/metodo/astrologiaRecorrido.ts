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
import { AREAS_TOTAL, pasoDeArea, rutaArea, tituloArea } from "./astrologiaAreas";
import type { PasoRecorrido } from "./psicologiaRecorrido";

/** Los pasos del recorrido, con los títulos ya en el idioma activo. */
// «Lo primero de tu carta» (Sol · Luna · Ascendente) YA NO es un paso propio:
// vive dentro de la primera página, debajo del formulario de datos. Una sola
// página para dar los datos y leer lo primero de la carta; la intro (los
// cómics) vuelve a verse cada vez que se entra a ese paso 1.
export const astrologiaIndice = (): PasoRecorrido[] => [
  // 1 · la Historia: el cómic (y su reel) en UNA caja. A ella se llega al saltar el cómic de la
  //     historia espiritual, que sale en /metodo/astrologia al pulsar START.
  { n: 1, titulo: traducir("metodo.astro.paso.historia"), ruta: () => "/metodo/astrologia/historia" },
  // 2 · la Introducción que lo explica todo: signos, casas, planetas y aspectos.
  { n: 2, titulo: traducir("metodo.astro.paso.explicacion"), ruta: () => "/metodo/astrologia/explicacion" },
  // 3 · Tu Carta Astral: los datos de nacimiento y la carta con lo primero de ella. María entra siempre.
  { n: 3, titulo: traducir("metodo.astro.paso.introduccion"), ruta: () => "/metodo/astrologia/introduccion" },
  // 4 · Ascendente, Sol y Luna: lo que la mayoría conoce de la astrología.
  { n: 4, titulo: traducir("metodo.astro.paso.trio"), ruta: () => "/metodo/astrologia/trio" },
  // 5 · los puntos clave de SU carta, según María.
  { n: 5, titulo: traducir("metodo.astro.paso.puntosClave"), ruta: () => "/metodo/astrologia/lectura" },
  // 6-17 · las doce ÁREAS (una por casa): Área I «Mi nacimiento» … Área XII. Cada una, una página con su texto.
  ...Array.from({ length: AREAS_TOTAL }, (_, i) => ({ n: pasoDeArea(i + 1), titulo: tituloArea(i + 1), ruta: () => rutaArea(i + 1) })),
  // (Casas, Aspectos, Arquetipos y Apuntes: QUITADOS del camino por ahora, nov-2026; las páginas y rutas siguen en el código, comentadas en App.tsx.)
  // 18 · su carta entera en un PDF descargable.
  {
    n: 18,
    titulo: traducir("metodo.astro.paso.pdf"),
    tituloCorto: traducir("metodo.astro.paso.pdfCorto"),
    ruta: () => "/metodo/astrologia/pdf",
  },
  // 19 · la Síntesis: lo que María quiere que no olvide.
  { n: 19, titulo: traducir("metodo.astro.paso.sintesis"), ruta: () => "/metodo/astrologia/sintesis" },
  // 20
  { n: 20, titulo: traducir("metodo.astro.paso.cursos"), ruta: () => "/metodo/astrologia/cursos" },
];

/** Cuántos pasos tiene el recorrido. Constante: no depende del idioma.
 *  ⚠️ Si cambia, cambia también `metodo.total` en data/camino.ts. */
export const ASTROLOGIA_TOTAL = 20;
