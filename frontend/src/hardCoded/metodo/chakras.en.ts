// ─────────────────────────────────────────────────────────────────────────
// LOS CHAKRAS · EN
//
// El español manda: qué chakras hay, en qué orden y con qué claves lo dice
// `chakras.ts`. Aquí solo se traduce el TEXTO, chakra a chakra. El que no esté
// traducido se lee entero en español en vez de quedarse en blanco (mismo
// criterio que el resto del recorrido de Ayurveda).
//
// Para traducir uno, se copia su objeto de `chakras.ts` y se traducen su
// `frase`, sus `claves` y el texto de sus viñetas; lo que no es texto (key, n,
// color, los `src` de las fotos) se copia igual.
// ─────────────────────────────────────────────────────────────────────────
import type { Chakra, ChakraKey } from "./chakras";

export const CHAKRAS_EN: Partial<Record<ChakraKey, Chakra>> = {
  // Todavía sin traducir: se leen en español.
};

/** Lo que se lee arriba del mapa, sobre el turquesa. */
export const CHAKRAS_INTRO_EN =
  "The chakras are points of energy where our body connects most intensely with the energy that gives us Life. Our soul is connected to our whole body, but there are points where we can feel it more. Those points are the chakras.";
