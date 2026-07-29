// ─────────────────────────────────────────────────────────────────────────
// ÍNDICE DEL RECORRIDO · ASTROLOGÍA
//
// Orden canónico de las páginas del recorrido de astrología (los mismos números
// de paso que muestran sus cabeceras). Alimenta el botón «Índice» reutilizado de
// psicología (ver IndiceRecorrido / IndiceAstrologia). Las rutas son estáticas
// (astrología no usa `experienciaId`), por eso ignoran el argumento.
// ─────────────────────────────────────────────────────────────────────────
import type { PasoRecorrido } from "./psicologiaRecorrido";

// Nombre del paso 2 en un solo sitio: lo usan la cabecera de su página, el
// índice y los dos botones que llevan hasta ella (el «siguiente» de la intro y
// el «continuar» del cómic de los signos). En móvil se abrevia, que el largo no
// cabe de una línea en un botón.
export const PASO_CARTA_TITULO = "Lo primero de tu carta";
export const PASO_CARTA_TITULO_CORTO = "Lo primero";

export const ASTROLOGIA_INDICE: PasoRecorrido[] = [
  { n: 1, titulo: "Astrología",              ruta: () => "/metodo/astrologia" },
  // «Lo primero de tu carta» en vez de «Sol, Luna y Ascendente»: para quien
  // empieza, esos tres nombres todavía no significan nada, y lo que necesita
  // saber es que esta es la primera de las partes de su lectura. Los tres
  // nombres se explican dentro de la página, que es donde hacen falta.
  { n: 2, titulo: PASO_CARTA_TITULO, tituloCorto: PASO_CARTA_TITULO_CORTO,
    ruta: () => "/metodo/astrologia/solascendenteluna" },
  { n: 3, titulo: "Arquetipos",              ruta: () => "/metodo/astrologia/cartaAstral" },
  { n: 4, titulo: "Puntos clave",            ruta: () => "/metodo/astrologia/lectura" },
  { n: 5, titulo: "Casas",                   ruta: () => "/metodo/astrologia/casas" },
  { n: 6, titulo: "Aspectos",                ruta: () => "/metodo/astrologia/aspectos" },
  { n: 7, titulo: "Llamada",                 ruta: () => "/metodo/astrologia/llamada" },
  { n: 8, titulo: "Cursos",                  ruta: () => "/metodo/astrologia/cursos" },
];

export const ASTROLOGIA_TOTAL = ASTROLOGIA_INDICE.length;
