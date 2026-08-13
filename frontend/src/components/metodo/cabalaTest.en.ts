import type { CabalaPageKey } from "./cabalaSefirot";

/**
 * La «Escala de Equilibrio de las Sefirot», en INGLÉS.
 *
 * Aquí va SOLO el texto. El `tipo` de cada pregunta (déficit / equilibrio /
 * exceso), su ORDEN y la puntuación viven únicamente en `cabalaTest.ts`: si se
 * duplicaran, bastaría con tocar uno de los dos ficheros para que el mismo test
 * diera un diagnóstico distinto según el idioma.
 *
 * De ahí que las preguntas sean un array de 5 cadenas y no objetos: se emparejan
 * por POSICIÓN con las españolas (2 déficit, 1 equilibrio, 2 exceso). Una
 * dimensión que falte aquí se lee en español, dimensión a dimensión
 * (ver `useTestCabala` en cabalaEn.ts).
 *
 * Al traducir: los nombres de las sefirot no se traducen (Keter, Chokhmah,
 * Gevurah, Malkhut…) y «la Vida» con mayúscula intencionada se queda "Life".
 */
export interface DimensionTestTexto {
  /** Tema de la dimensión («Propósito» → "Purpose"). */
  etiqueta: string;
  /** Las 5 frases, en el MISMO orden que en español. */
  preguntas: string[];
}

export const CABALA_TEST_EN: Partial<Record<CabalaPageKey, DimensionTestTexto>> = {
  kether: {
    etiqueta: "Purpose",
    preguntas: [
      "I feel my Life lacks a clear direction.",
      "I change goals often because I lose motivation.",
      "I make important decisions with my deepest values in mind.",
      "I find it hard to enjoy activities I don't consider useful to my purpose.",
      "I feel I need to fulfill an extraordinary mission for my Life to have meaning.",
    ],
  },
  chokmah: {
    etiqueta: "Clarity",
    preguntas: [
      "I tend to draw conclusions before I know all the facts.",
      "My emotions weigh too heavily on how I interpret what happens.",
      "Before reacting, I try to tell the facts apart from my interpretations.",
      "I trust my intuition so much that sometimes I don't check the information.",
      "I find it hard to accept that my first impression might be wrong.",
    ],
  },
  binah: {
    etiqueta: "Understanding",
    preguntas: [
      "I repeat similar situations without understanding why.",
      "I rarely reflect on what I can learn from my experiences.",
      "I usually turn my experiences into useful learning.",
      "I analyze situations so much that I find it hard to act.",
      "I need to understand everything before making a decision.",
    ],
  },
  daat: {
    etiqueta: "Coherence",
    preguntas: [
      "I know what I should do, but often I don't do it.",
      "I easily drop habits I consider important.",
      "My actions are usually aligned with my values.",
      "I find it hard to accept it when I discover I need to change an important belief.",
      "I'm very hard on myself when I don't act coherently.",
    ],
  },
  chesed: {
    etiqueta: "Generosity",
    preguntas: [
      "I'd rather not get too involved in other people's problems.",
      "I find it hard to offer help if I'm not asked.",
      "I enjoy helping while also respecting my own limits.",
      "I feel guilty when I can't help.",
      "I often give more than I can really sustain.",
    ],
  },
  geburah: {
    etiqueta: "Boundaries",
    preguntas: [
      "I find it hard to say «no».",
      "I take on responsibilities to avoid letting others down.",
      "I can set boundaries with respect and firmness.",
      "It bothers me when people don't do things the way I think is right.",
      "I find it hard to delegate because I'd rather stay in control.",
    ],
  },
  tipharet: {
    etiqueta: "Balance",
    preguntas: [
      "I swing easily from one emotional extreme to the other.",
      "I find it hard to listen before reacting.",
      "I usually balance my needs with other people's.",
      "I avoid difficult decisions to keep the peace.",
      "I spend too much time trying to make sure everyone is fine.",
    ],
  },
  netzach: {
    etiqueta: "Perseverance",
    preguntas: [
      "I drop projects when difficulties show up.",
      "If I don't see quick results I lose motivation.",
      "I keep my commitments even when the enthusiasm fades.",
      "I find it hard to drop projects even when they no longer make sense.",
      "I feel that resting is wasting time.",
    ],
  },
  hod: {
    etiqueta: "Expression",
    preguntas: [
      "I find it hard to express what I really think or feel.",
      "I tend to keep quiet to avoid conflict.",
      "I express my ideas clearly and respectfully.",
      "I need others to understand or accept my point of view.",
      "I get frustrated when I feel misunderstood.",
    ],
  },
  yesod: {
    etiqueta: "Coherence in practice",
    preguntas: [
      "I find it hard to keep habits going steadily.",
      "My routine changes constantly, with no clear structure.",
      "My habits reflect what I consider important.",
      "It makes me uncomfortable to change my routines even when circumstances call for it.",
      "I feel bad when I can't follow my plan exactly.",
    ],
  },
  malkuth: {
    etiqueta: "Manifestation",
    preguntas: [
      "I feel my Life doesn't really reflect who I am.",
      "I wait for circumstances to change before acting.",
      "The way I live reflects my most important values.",
      "I measure my personal worth by what I achieve or produce.",
      "I find it hard to enjoy the present because I'm always thinking about the next goal.",
    ],
  },
};

/**
 * La escala 1-5 de los tests de sendero, en el mismo orden que `ESCALA`.
 *
 * Solo las etiquetas: el `valor` (1..5) lo pone el fichero español.
 */
export const ESCALA_EN: string[] = ["Never", "Rarely", "Sometimes", "Often", "Always"];
