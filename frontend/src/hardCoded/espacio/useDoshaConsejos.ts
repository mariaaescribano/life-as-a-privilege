import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import { DOSHA_CONSEJOS, type DoshaRecs } from "./DoshaConsejos";
import { DOSHA_CONSEJOS_EN } from "./DoshaConsejos.en";

/**
 * Los consejos de los doṣhas en el idioma activo.
 *
 * El español manda: las claves (`vata`, `pitta`, `kapha`) y qué categorías
 * tiene cada doṣha salen de `DoshaConsejos.ts`. Del inglés se toma el texto,
 * doṣha a doṣha: el que no esté traducido se lee en español.
 *
 * OJO: es un hook, hay que llamarlo AL PINTAR.
 */
export const useDoshaConsejos = (): Record<string, DoshaRecs> => {
  const { idioma } = useIdioma();
  return useMemo(() => {
    if (idioma !== "en") return DOSHA_CONSEJOS;
    const out: Record<string, DoshaRecs> = {};
    for (const clave of Object.keys(DOSHA_CONSEJOS)) {
      out[clave] = DOSHA_CONSEJOS_EN[clave] ?? DOSHA_CONSEJOS[clave]!;
    }
    return out;
  }, [idioma]);
};
