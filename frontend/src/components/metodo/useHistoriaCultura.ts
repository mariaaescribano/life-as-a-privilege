import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import { getHistoria, type HistoriaDef } from "./culturaHistorias";
import { historiaTraducida } from "./culturaHistorias.en";

/**
 * Una Historia de Cultura (sus eras y sus momentos) en el idioma activo.
 *
 * Es lo que leen la línea del tiempo de la Historia y la página de una era. El
 * español manda en todo lo que no es texto —orden, `key` y fotos—; del inglés
 * sale solo el texto, y lo que aún no esté traducido se lee en español (ver
 * `culturaHistorias.en.ts`).
 *
 * OJO: es un hook, hay que llamarlo AL PINTAR. Si la Historia se resolviera al
 * importar el módulo se quedaría congelada en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export const useHistoriaCultura = (key: string | undefined): HistoriaDef | undefined => {
  const { idioma } = useIdioma();
  return useMemo(() => historiaTraducida(getHistoria(key), key, idioma), [key, idioma]);
};
