import { useIdioma } from "../../i18n";
import { organosFisiologia, type Organo } from "./OrganosFisiologia";
import { organosFisiologiaEn } from "./OrganosFisiologia.en";

/**
 * Los órganos de Fisiología · Mi Espacio en el idioma activo.
 *
 * La estructura la manda SIEMPRE el español (orden, `id` y `umbral`); del inglés
 * solo se toma el texto, y órgano a órgano: el que no esté traducido se queda en
 * español en vez de desaparecer.
 *
 * OJO: hay que llamarlo AL PINTAR. Si el texto se resolviera al importar el
 * módulo, se quedaría congelado en el idioma con el que arrancó la página.
 */
export const useOrganosFisiologia = (): Organo[] => {
  const { idioma } = useIdioma();
  if (idioma === "es") return organosFisiologia;
  return organosFisiologia.map((o) => {
    const en = organosFisiologiaEn[o.id];
    return en ? { ...o, ...en } : o;
  });
};
