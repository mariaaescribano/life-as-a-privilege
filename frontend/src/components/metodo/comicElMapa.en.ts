// ─────────────────────────────────────────────────────────────────────────
// Cómic «¿Por qué existe Life as a Privilege?» — VERSIÓN INGLESA
//
// Espejo del guion español (comicElMapa.ts): las MISMAS once viñetas y en el
// MISMO orden. De aquí se toma solo la prosa (el rótulo y las frases); las
// fotos, el orden y la disciplina que coloca cada viñeta salen siempre del
// español, que es el que manda.
//
// Una entrada `null` deja esa viñeta en español: traducir a medias es mejor que
// dejar un hueco. Es la misma regla de los cómics del recorrido
// (src/i18n/comics/index.ts).
//
// Voz: primera persona, alguien que se está descubriendo. En inglés tiene que
// sonar igual de cercano —frases cortas, contracciones naturales—, nunca a
// folleto. «Life as a Privilege» no se traduce. Ver src/i18n/GLOSARIO.md.
// ─────────────────────────────────────────────────────────────────────────

import { useIdioma } from "../../i18n";
import { COMIC_POR_QUE_EXISTE, type VinetaMapa } from "./comicElMapa";

/** Lo único que se traduce de una viñeta: su rótulo y sus frases. */
type VinetaMapaEn = { titulo: string; lineas: string[] };

const COMIC_POR_QUE_EXISTE_EN: (VinetaMapaEn | null)[] = [
  {
    titulo: "The beginning",
    lineas: [
      "I don't understand what's happening to me.",
      "I think I need help.",
    ],
  },
  {
    titulo: "Astrology",
    lineas: [
      "What if many of my patterns had been there all along?",
      "I'm starting to see myself with different eyes.",
    ],
  },
  {
    titulo: "Psychology",
    lineas: [
      "Now I understand a lot of things about my history.",
      "But I feel there's still a piece missing.",
    ],
  },
  {
    titulo: "Ayurveda",
    lineas: [
      "Maybe balance isn't about doing what everyone else does.",
      "Maybe it's about understanding my own nature.",
    ],
  },
  {
    titulo: "Traditional Chinese Medicine",
    lineas: [
      "Emotions, body and energy aren't separate things.",
      "I'm starting to see how some of my emotions and habits were throwing me off balance.",
    ],
  },
  {
    titulo: "Physiology",
    lineas: [
      "I never imagined how extraordinary my body was.",
      "Understanding how it works is also a way of understanding myself.",
    ],
  },
  {
    titulo: "Nutrition",
    lineas: [
      "My body is built out of the molecules of the food I choose.",
      "The better I eat, the better I'll feel and the better I'll think.",
    ],
  },
  {
    titulo: "Kabbalah",
    lineas: [
      "Once I understood my mind and my body...",
      "I began to wonder whether it's true that we have a soul.",
    ],
  },
  {
    titulo: "Culture and History",
    lineas: [
      "Understanding the history of humanity helps me understand the world I live in.",
      "Now I can appreciate my own reality more.",
    ],
  },
  {
    titulo: "The discovery",
    lineas: [
      "I understood that every one of them holds a fragment of the same truth.",
    ],
  },
  {
    titulo: "Life as a Privilege",
    lineas: [
      "For centuries we have gathered knowledge about the human being.",
      "That knowledge has stayed scattered across disciplines that rarely speak to one another.",
      "Life as a Privilege was born to rebuild that map and put it at the service of growth.",
    ],
  },
];

/** Mezcla la prosa inglesa sobre las viñetas españolas (fotos y orden intactos). */
export function vinetasElMapaEn(es: VinetaMapa[]): VinetaMapa[] {
  return es.map((v, i) => {
    const en = COMIC_POR_QUE_EXISTE_EN[i];
    return en ? { ...v, titulo: en.titulo, lineas: en.lineas } : v;
  });
}

/**
 * Las once viñetas en el idioma activo.
 *
 * OJO: hay que llamarlo AL PINTAR (es un hook). Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export function useComicElMapa(): VinetaMapa[] {
  const { idioma } = useIdioma();
  return idioma === "en"
    ? vinetasElMapaEn(COMIC_POR_QUE_EXISTE)
    : COMIC_POR_QUE_EXISTE;
}
