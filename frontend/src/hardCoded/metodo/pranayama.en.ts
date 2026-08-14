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
 * `ciclos`. Los nombres sánscritos (Nāḍī Śodhana, Śītalī, Śītkārī, Bhastrikā,
 * Viṣṇu mudrā) se quedan tal cual, con sus diacríticos: son el nombre de la
 * técnica, no una palabra a traducir.
 */
export const PRANAYAMA_PRACTICA_EN: Partial<Record<DoshaKey, PracticaPranayama>> = {
  vata: {
    nombre: "Nāḍī Śodhana",
    traduccion: "Alternate nostril breathing — «cleansing the channels»",
    porQue: "Vata is mobile, fast and irregular. Alternating the nostrils **imposes a rhythm**: it gives a scattered mind something simple and regular to hold on to.",
    pasos: [
      "Long spine, shoulders loose.",
      "Right hand in **Viṣṇu mudrā**: your thumb closes the right nostril and your ring finger the left.",
      "Close the right and **inhale through the left**. Close both for an instant.",
      "Release the right and **exhale through the right**, long.",
      "Inhale through the right, hold, and exhale through the left. **That's one cycle.**",
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
    escrito: [
      "Vata doesn't settle by force, it settles by rhythm. What you've just given your mind isn't silence: it's a beat to come back to whenever it scatters.",
      "That's why this practice works better at the same hour as yesterday than for a long stretch on one single day.",
    ],
    preguntas: [
      "At what point did you notice your mind wandering off? Where did it go?",
      "What settled more by the end: your body, your head, or neither of the two?",
    ],
  },
  pitta: {
    nombre: "Śītalī",
    traduccion: "Cooling breath — «the one that cools»",
    porQue: "Pitta is fire: hot and sharp. Śītalī is one of the very few techniques that **really cool you down** — the air comes in over a moist tongue and arrives tempered.",
    pasos: [
      "Long spine, jaw loose.",
      "Stick your tongue out a little and **roll it into a small channel**. If you can't (it's genetic), press your teeth together and smile: that's *Śītkārī* and it works just as well.",
      "**Inhale through your tongue**, as if you were sipping the air. You'll feel the coolness.",
      "Bring your tongue in, close your mouth and hold for an instant.",
      "**Exhale through your nose**, slowly. That's one cycle.",
    ],
    precaucion: "Don't do it when you're cold, when you have a cold, or with a cough: it really does cool you down. In winter, swap it for slow diaphragmatic breathing.",
    ciclos: 8,
    fases: [
      { tipo: "inhala", texto: "Inhale through your rolled tongue", segundos: 4 },
      { tipo: "reten",  texto: "Hold, without clenching",          segundos: 2 },
      { tipo: "exhala", texto: "Exhale through your nose, long",   segundos: 6 },
    ],
    foto: "",
    escrito: [
      "Pitta doesn't need to understand better: it needs to bring the temperature down. You've just done something that can't be done by effort, and that's exactly the point.",
      "If you caught yourself wanting to do it well, that hurry for a good grade is Pitta too.",
    ],
    preguntas: [
      "Where was the heat before you started: your head, your chest, your stomach, your jaw?",
      "Which was harder, the coolness of the inhale or letting go of control on the exhale?",
    ],
  },
  kapha: {
    nombre: "Bhastrikā",
    traduccion: "Bellows breath — «the one that lights the fire»",
    porQue: "Kapha is heavy and slow. Bhastrikā is a bellows: it **moves, warms and clears**. The only one of the three that raises your energy instead of lowering it.",
    pasos: [
      "Straight spine, hands on your knees.",
      "Inhale and exhale through your nose **strongly and at the same pace**, one breath a second, moving your belly like a bellows.",
      "It's the abdomen, not the shoulders: if they start rising, slow down.",
      "When the round ends, **come back to your normal breath** and stay still. That's where the interesting part happens.",
    ],
    precaucion: "Don't do it while pregnant, with high blood pressure, with heart problems, glaucoma, epilepsy, or during your period. If you get dizzy, stop: you were going too fast.",
    ciclos: 3,
    fases: [
      { tipo: "rapida",    texto: "Bellows: breathe fast through your nose", segundos: 15 },
      { tipo: "descanso",  texto: "Let go. Breathe normally and notice",     segundos: 20 },
    ],
    foto: "",
    escrito: [
      "Kapha doesn't start because it's convinced, it starts because it moves. The interesting part of Bhastrikā isn't the bellows: it's the silence afterwards, when the body is still lit up and no longer doing anything.",
      "That's where you notice the heaviness was never you.",
    ],
    preguntas: [
      "What felt like more of a drag: starting, or starting the second round?",
      "How was your body in the rest, once there was nothing left to do?",
    ],
  },
};

/** Lo imparcial de después, en inglés. Las opciones van en el MISMO orden. */
export const PRANAYAMA_REFLEXION_EN: typeof PRANAYAMA_REFLEXION = {
  titulo: "After breathing",
  compromisoTitulo: "Your moment",
  compromisoIntro: "The practice that actually happens is the one with a fixed slot. Choose yours:",
  compromisos: [
    "Right after waking up, before I pick up my phone",
    "Mid-morning, to break the inertia",
    "Before lunch, so I come to the table whole",
    "When I finish work, to close the day",
    "Before sleep, in bed",
  ],
};

export const PRANAYAMA_CIERRE_EN: typeof PRANAYAMA_CIERRE = [
  "Start with five minutes. Tomorrow, another five.",
  "*What you're training isn't your breath: it's your ability to come back.*",
];
