import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import { MITOS_NUTRICION } from "./MitosNutricion";
import { mitosTraducidos } from "./MitosNutricion.en";
import type { NutrienteTarjeta } from "./NutrientesNutricion";

/**
 * «Preguntas y mitos» en el idioma activo.
 *
 * El español manda: el orden, la foto y la `key` —que es lo que se guarda como
 * leído— salen siempre de `MitosNutricion.ts`. Del inglés se toma solo el texto,
 * mito a mito: el que no esté traducido se lee en español en vez de desaparecer.
 *
 * OJO: es un hook, hay que llamarlo AL PINTAR. Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export const useMitosNutricion = (): NutrienteTarjeta[] => {
  const { idioma } = useIdioma();
  return useMemo(() => mitosTraducidos(MITOS_NUTRICION, idioma), [idioma]);
};
