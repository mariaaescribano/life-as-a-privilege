// ─────────────────────────────────────────────────────────────────────────
// «Tu cocina diaria» en el idioma activo.
//
// El español manda: el orden de las cocciones —que es el que elige la foto—,
// las `key` y el elemento salen siempre de `tcmCocinaContenido.ts`. Del inglés
// se toma solo el texto, y elemento a elemento: el que no esté traducido se lee
// en español en vez de desaparecer. Misma regla que los órganos de Fisiología y
// que los cómics.
// ─────────────────────────────────────────────────────────────────────────

import { useIdioma } from "../../i18n";
import { COCINA_NOTA, cocinaDe, type CocinaElemento } from "./tcmCocinaContenido";
import { COCINA_ELEMENTO_EN, COCINA_NOTA_EN } from "./tcmCocinaContenido.en";
import type { Elemento } from "./tcmRecorrido";

/**
 * La cocina de un elemento en el idioma activo.
 *
 * OJO: es un hook, hay que llamarlo AL PINTAR. Si se resolviera al importar el
 * módulo se quedaría congelado en el idioma con el que arrancó la página.
 */
export function useCocina(el: Elemento): CocinaElemento {
  const { idioma } = useIdioma();
  const es = cocinaDe(el);
  if (idioma === "es") return es;
  return COCINA_ELEMENTO_EN[el] ?? es;
}

/** La nota al pie de la página, en el idioma activo. */
export function useCocinaNota(): string {
  const { idioma } = useIdioma();
  return idioma === "es" ? COCINA_NOTA : COCINA_NOTA_EN;
}
