import { useIdioma } from "../i18n";
import { recorridoContenido, type DisciplinaClave, type DisciplinaContenido } from "./recorridoContenido";
import { recorridoContenidoEn } from "./recorridoContenido.en";

/**
 * Contenido del recorrido en el idioma activo.
 *
 * OJO: hay que llamarlo AL PINTAR, no al cargar el módulo. Los arrays de
 * disciplinas (`modalidades`, `discs`…) se calculan una sola vez cuando se
 * importa el fichero, así que si el texto se metiera ahí se quedaría congelado
 * en el idioma con el que arrancó la página y no cambiaría al pulsar EN.
 */
export const useRecorridoContenido = (): Record<DisciplinaClave, DisciplinaContenido> => {
  const { idioma } = useIdioma();
  return idioma === "en" ? recorridoContenidoEn : recorridoContenido;
};
