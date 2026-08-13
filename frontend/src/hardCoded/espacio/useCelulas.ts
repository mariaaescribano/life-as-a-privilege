import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import { celulas, type Celula } from "./CelulasCuerpoData";
import { CELULAS_EN } from "./CelulasCuerpoData.en";

/**
 * Las fichas de las células del cuerpo en el idioma activo.
 *
 * La estructura la manda SIEMPRE el español (orden, `id` y fotos); del inglés
 * solo se toma el texto, y célula a célula: la que no esté traducida se queda en
 * español en vez de desaparecer.
 *
 * OJO: hay que llamarlo AL PINTAR. Si el texto se resolviera al importar el
 * módulo, se quedaría congelado en el idioma con el que arrancó la página.
 */
export const celulaEn = (c: Celula): Celula => {
  const en = CELULAS_EN[c.id];
  return en ? { ...c, ...en } : c;
};

/** Todas las células, en el orden del fichero español y en el idioma activo. */
export const useCelulas = (): Celula[] => {
  const { idioma } = useIdioma();
  return useMemo(
    () => (idioma === "es" ? celulas : celulas.map(celulaEn)),
    [idioma],
  );
};
