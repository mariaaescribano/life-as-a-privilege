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
// El camino (nov-2026): EMPEZAR → Bienvenida → Historia → Explicación → Tu Carta Astral → las doce Áreas → PDF → Despedida → Cursos.
// «Lo primero de tu carta» (Sol · Luna · Ascendente) vive dentro de «Tu Carta Astral», debajo del formulario de datos.
export const astrologiaIndice = (): PasoRecorrido[] => [
  // 1 · la Bienvenida que María escribe para ESA persona (editor de su carta). Sin texto, la página salta a la Historia.
  { n: 1, titulo: traducir("metodo.astro.paso.bienvenida"), ruta: () => "/metodo/astrologia/bienvenida" },
  // 2 · la Historia: el cómic (y su reel) en UNA caja.
  { n: 2, titulo: traducir("metodo.astro.paso.historia"), ruta: () => "/metodo/astrologia/historia" },
  // 3 · la Introducción que lo explica todo: signos, casas, planetas y aspectos.
  { n: 3, titulo: traducir("metodo.astro.paso.explicacion"), ruta: () => "/metodo/astrologia/explicacion" },
  // 4 · Tu Carta Astral: los datos de nacimiento y la carta con lo primero de ella. María entra siempre.
  { n: 4, titulo: traducir("metodo.astro.paso.introduccion"), ruta: () => "/metodo/astrologia/introduccion" },
  // 5-16 · las doce ÁREAS (una por casa): Área I «Mi nacimiento» … Área XII. Cada una, una página con su texto.
  ...Array.from({ length: AREAS_TOTAL }, (_, i) => ({ n: pasoDeArea(i + 1), titulo: tituloArea(i + 1), ruta: () => rutaArea(i + 1) })),
  // (Ascendente-Sol-Luna, Puntos clave, Casas, Aspectos, Arquetipos y Apuntes: FUERA del camino; las páginas siguen en el código.)
  // 17 · su carta entera en un PDF descargable.
  {
    n: 17,
    titulo: traducir("metodo.astro.paso.pdf"),
    tituloCorto: traducir("metodo.astro.paso.pdfCorto"),
    ruta: () => "/metodo/astrologia/pdf",
  },
  // 18 · la Despedida (la página que antes se llamaba Síntesis; mismo texto del editor).
  { n: 18, titulo: traducir("metodo.astro.paso.sintesis"), ruta: () => "/metodo/astrologia/sintesis" },
  // 19
  { n: 19, titulo: traducir("metodo.astro.paso.cursos"), ruta: () => "/metodo/astrologia/cursos" },
];

/** Cuántos pasos tiene el recorrido. Constante: no depende del idioma.
 *  ⚠️ Si cambia, cambia también `metodo.total` en data/camino.ts. */
export const ASTROLOGIA_TOTAL = 19;
