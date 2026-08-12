// ─────────────────────────────────────────────────────────────────────────
// Los cómics de los cinco elementos, en el idioma activo.
//
// Por qué hace falta este puente: el cómic de un elemento NO es una lista de
// viñetas, es una lista de PASOS (`PasoComic`) donde algunos son mini-tests que
// puntúan el perfil. El diccionario inglés (`i18n/comics/comics.en.ts`) solo
// guarda prosa, así que aquí se saca la prosa de los pasos de viñeta, se traduce
// con el mismo mecanismo que el resto de los cómics y se vuelve a colocar en su
// sitio, dejando los pasos de test intactos.
//
// El español manda: el orden de los pasos, las fotos y los tests salen siempre
// de `tcmElementosContenido.ts`. Del inglés se toma solo el texto, viñeta a
// viñeta, y la que no esté traducida se queda en español.
// ─────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import { vinetasEn } from "../../i18n/comics";
import type { Vineta } from "./ComicViewer";
import { CONTENIDO_ELEMENTOS, type ContenidoElementoRico, type PasoComic } from "./tcmElementosContenido";
import { CONTENIDO_ELEMENTOS_EN } from "./tcmElementosContenido.en";
import { ELEMENTOS, ORDEN_ELEMENTOS, type Elemento } from "./tcmRecorrido";

/** Su entrada en `comics.en.ts`: `tcm-madera`, `tcm-fuego`… */
export const claveComicElemento = (el: Elemento): string => `tcm-${el}`;

/** Mezcla la prosa inglesa sobre los pasos españoles (fotos y tests intactos). */
export function pasosElementoEn(el: Elemento, pasos: PasoComic[]): PasoComic[] {
  const vinetasEs: Vineta[] = pasos
    .filter((p) => p.tipo === "vineta")
    .map((p) => ({ src: p.src, paragraphs: (p as Extract<PasoComic, { tipo: "vineta" }>).paragraphs }));
  const traducidas = vinetasEn(claveComicElemento(el), vinetasEs);
  let i = 0;
  return pasos.map((p) =>
    p.tipo === "vineta" ? { ...p, paragraphs: traducidas[i++]?.paragraphs ?? p.paragraphs } : p,
  );
}

/**
 * Los pasos del cómic de un elemento en el idioma activo.
 *
 * OJO: hay que llamarlo AL PINTAR (es un hook). Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export function usePasosElemento(el: Elemento, pasos: PasoComic[]): PasoComic[] {
  const { idioma } = useIdioma();
  return idioma === "en" ? pasosElementoEn(el, pasos) : pasos;
}

/**
 * El contenido rico de UN elemento (las siete secciones de su página) en el
 * idioma activo.
 *
 * Misma regla que el resto de la casa: la estructura la manda el español —el
 * `id`, el `hanzi` y las fotos salen siempre de `tcmElementosContenido.ts`— y
 * del inglés se toma solo el texto. Un elemento sin traducir se lee en español
 * en vez de desaparecer.
 *
 * OJO: es un hook, hay que llamarlo AL PINTAR. Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export function useContenidoElemento(el: Elemento | null): ContenidoElementoRico | null {
  const { idioma } = useIdioma();
  if (!el) return null;
  const es = CONTENIDO_ELEMENTOS[el];
  if (!es || idioma === "es") return es ?? null;
  const en = CONTENIDO_ELEMENTOS_EN[el];
  return en ? { ...es, ...en } : es;
}

/**
 * El NOMBRE de los cinco elementos en el idioma activo («Madera» / "Wood").
 *
 * Sale en las etiquetas de todas las estrellas (la de los elementos, las de los
 * dos ciclos, la del diagnóstico) y en las tarjetas de los patrones de la
 * lengua. Es un solo hook para que no haya cinco sitios donde traducir cinco
 * palabras; el nombre inglés lo pone el contenido rico del elemento, que ya lo
 * trae, y el que no esté traducido se lee en español.
 *
 * OJO: es un hook, hay que llamarlo AL PINTAR. Si el nombre se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export function useNombresElementos(): Record<Elemento, string> {
  const { idioma } = useIdioma();
  return useMemo(() => {
    const out = {} as Record<Elemento, string>;
    for (const el of ORDEN_ELEMENTOS) {
      out[el] = (idioma === "en" ? CONTENIDO_ELEMENTOS_EN[el]?.nombre : undefined) ?? ELEMENTOS[el].nombre;
    }
    return out;
  }, [idioma]);
}
