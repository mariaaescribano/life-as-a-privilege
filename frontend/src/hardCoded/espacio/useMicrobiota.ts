import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import { MICROBIOTA_BACTERIAS, MICROBIOTA_TARJETAS } from "./MicrobiotaNutricion";
import { microbiotaTraducida } from "./MicrobiotaNutricion.en";
import type { NutrienteTarjeta } from "./NutrientesNutricion";

/**
 * Las tarjetas de «Microbiota» en el idioma activo.
 *
 * El español manda: el orden, el color, la foto y la `key` —que es lo que se
 * guarda como leído— salen siempre de `MicrobiotaNutricion.ts`. Del inglés se
 * toma solo el texto, tarjeta a tarjeta: la que no esté traducida se lee en
 * español en vez de desaparecer.
 *
 * OJO: son hooks, hay que llamarlos AL PINTAR. Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export const useMicrobiotaBacterias = (): NutrienteTarjeta[] => {
  const { idioma } = useIdioma();
  return useMemo(() => microbiotaTraducida(MICROBIOTA_BACTERIAS, idioma), [idioma]);
};

/** Las moléculas que fabrican (propionato, acetato, butirato). */
export const useMicrobiotaTarjetas = (): NutrienteTarjeta[] => {
  const { idioma } = useIdioma();
  return useMemo(() => microbiotaTraducida(MICROBIOTA_TARJETAS, idioma), [idioma]);
};
