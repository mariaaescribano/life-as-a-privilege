import type { DoshaKey } from "./doshaIntro";
import type { PracticaPranayama, PRANAYAMA_REFLEXION, PRANAYAMA_CIERRE } from "./pranayama";

/**
 * PRĀṆĀYĀMA, en INGLÉS.
 *
 * Emparejado por la clave del doṣha, que no se traduce. Lo que no esté aquí se
 * lee en español (ver `usePranayama`).
 *
 * OJO con las `fases`: el `tipo` y los `segundos` son los que mueven el círculo
 * del guía y NO se tocan; del inglés se toma solo el `texto`. Igual con
 * `ciclos`. Los nombres sánscritos ya no salen en la página (están en el
 * cómic): aquí solo hay el resumen de 3-4 líneas, el cuidado y las preguntas.
 */
export const PRANAYAMA_PRACTICA_EN: Partial<Record<DoshaKey, PracticaPranayama>> = {
  vata: {
    resumen: [
      "You're going to breathe alternating your nostrils: the air comes in through one and goes out through the other.",
      "Close the right one with your thumb and the left one with your ring finger, and keep switching.",
      "Vata is fast and scattered: what suits it isn't silence, it's a rhythm to hold on to.",
      "Follow the circle: it tells you when the air comes in and when it goes out.",
    ],
    precaucion: "If you're very congested, do it in your mind only: picture the air coming in through one nostril and out through the other.",
    ciclos: 6,
    fases: [
      { tipo: "inhala",  texto: "Inhale through the left nostril", segundos: 4 },
      { tipo: "reten",   texto: "Hold, gently",                   segundos: 2 },
      { tipo: "exhala",  texto: "Exhale through the right",        segundos: 6 },
      { tipo: "inhala",  texto: "Inhale through the right nostril", segundos: 4 },
      { tipo: "reten",   texto: "Hold, gently",                    segundos: 2 },
      { tipo: "exhala",  texto: "Exhale through the left",         segundos: 6 },
    ],
    foto: "",
    preguntas: [
      "At what point did you notice your mind wandering off? Where did it go?",
      "What settled more by the end: your body, your head, or neither of the two?",
    ],
  },
  pitta: {
    resumen: [
      "You're going to inhale through your mouth, with your tongue rolled into a little channel, and exhale through your nose.",
      "If you can't roll it, press your teeth together and smile: it works just the same.",
      "Pitta is heat, and this is one of the very few breaths that really do cool you down.",
      "Follow the circle: it tells you when the air comes in and when it goes out.",
    ],
    precaucion: "Don't do it when you're cold, when you have a cold, or with a cough: it really does cool you down. In winter, swap it for slow breathing through your nose.",
    ciclos: 8,
    fases: [
      { tipo: "inhala", texto: "Inhale through your rolled tongue", segundos: 4 },
      { tipo: "reten",  texto: "Hold, without clenching",          segundos: 2 },
      { tipo: "exhala", texto: "Exhale through your nose, long",   segundos: 6 },
    ],
    foto: "",
    preguntas: [
      "Where was the heat before you started: your head, your chest, your stomach, your jaw?",
      "Which was harder, the coolness of the inhale or letting go of control on the exhale?",
    ],
  },
  kapha: {
    resumen: [
      "You're going to breathe fast through your nose, strongly, moving your belly like a bellows.",
      "It's the abdomen doing the work, not the shoulders: if they start rising, slow down.",
      "Kapha is heavy and slow, and this moves it, warms it and clears it.",
      "After each round you come back to your normal breath: that's where the interesting part happens.",
    ],
    precaucion: "Don't do it while pregnant, with high blood pressure, with heart problems, glaucoma, epilepsy, or during your period. If you get dizzy, stop: you were going too fast.",
    ciclos: 3,
    fases: [
      { tipo: "rapida",    texto: "Bellows: breathe fast through your nose", segundos: 15 },
      { tipo: "descanso",  texto: "Let go. Breathe normally and notice",     segundos: 20 },
    ],
    foto: "",
    preguntas: [
      "What felt like more of a drag: starting, or starting the second round?",
      "How was your body in the rest, once there was nothing left to do?",
    ],
  },
};

/** Lo imparcial de después, en inglés: solo el título del box de preguntas. */
export const PRANAYAMA_REFLEXION_EN: typeof PRANAYAMA_REFLEXION = {
  titulo: "After breathing",
};

export const PRANAYAMA_CIERRE_EN: typeof PRANAYAMA_CIERRE = [
  "Start with five minutes. Tomorrow, another five.",
  "*What you're training isn't your breath: it's your ability to come back.*",
];
