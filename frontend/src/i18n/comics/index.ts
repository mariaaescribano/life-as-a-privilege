import { useIdioma } from "..";
import type { Vineta } from "../../components/metodo/ComicViewer";
import { COMICS_EN } from "./comics.en";

// ─────────────────────────────────────────────────────────────────────────
// LOS CÓMICS EN INGLÉS
//
// El español manda SIEMPRE: de él salen el orden de las viñetas, las fotos
// (`src`), las claves rápidas y todo lo que no es prosa. Del inglés se toma solo
// el TEXTO, y viñeta a viñeta: la que no esté traducida se queda en español en
// vez de desaparecer. Es la misma regla que ya usan los órganos de Fisiología
// (useOrganosFisiologia) y el resto de datos largos de la casa.
//
// Por qué un diccionario suelto y no un `comicX.en.ts` por cómic: hay más de
// treinta cómics y cada uno se importa desde su modal. Con un único mapa
// indexado por clave, traducir uno nuevo es añadir una entrada aquí y cambiar
// UNA línea en su modal (la que llama a `useComic`). Nada más.
//
// CÓMO TRADUCIR UN CÓMIC
//   1. Añade su entrada a COMICS_EN (comics.en.ts) con el mismo número de
//      viñetas y en el mismo orden.
//   2. En su modal, sustituye `vinetas={LO_QUE_SEA}` por
//      `vinetas={useComic("su-clave", LO_QUE_SEA)}`.
//
// Ojo: hay que llamarlo AL PINTAR (es un hook). Si el texto se resolviera al
// importar el módulo, se quedaría congelado en el idioma con el que arrancó la
// página y no cambiaría al pulsar el selector de idioma.
// ─────────────────────────────────────────────────────────────────────────

/** Lo único que se traduce de una viñeta: su prosa. */
export interface VinetaEn {
  titulo?: string;
  eyebrow?: string;
  paragraphs?: string[];
  claves?: string[];
}

/** Un cómic traducido: sus viñetas EN EL MISMO ORDEN que el español. Una
 *  entrada `null` deja esa viñeta en español (útil para traducir a medias). */
export type ComicEn = (VinetaEn | null)[];

/** Mezcla el texto inglés sobre las viñetas españolas. Sin hook, para poder
 *  usarlo también fuera de un componente (la galería de Ilustraciones). */
export function vinetasEn(clave: string, es: Vineta[]): Vineta[] {
  const en = COMICS_EN[clave];
  if (!en) return es;
  return es.map((v, i) => {
    const t = en[i];
    if (!t) return v;
    return {
      ...v,
      ...(t.titulo != null ? { titulo: t.titulo } : {}),
      ...(t.eyebrow != null ? { eyebrow: t.eyebrow } : {}),
      ...(t.paragraphs ? { paragraphs: t.paragraphs } : {}),
      ...(t.claves ? { claves: t.claves } : {}),
    };
  });
}

/** Las viñetas de un cómic en el idioma activo. */
export function useComic(clave: string, es: Vineta[]): Vineta[] {
  const { idioma } = useIdioma();
  return idioma === "es" ? es : vinetasEn(clave, es);
}

/** Para saber qué cómics están traducidos (lo usa el aviso de pendientes). */
export function comicTraducido(clave: string): boolean {
  return !!COMICS_EN[clave];
}
