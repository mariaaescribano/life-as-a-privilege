/* ══════════════════════════════════════════════════════════════
   MEDICINA CHINA FUERA DE EL MAPA — el texto en INGLÉS.

   Cubre la página de Mi Espacio (`TCMespacio`) y los tres test de
   autoconocimiento (`TCMTest1/2/3`): las preguntas, las
   interpretaciones y las descripciones de cada resultado.

   Regla de siempre: el español manda la ESTRUCTURA (cuántas
   secciones hay, en qué orden, cuántas preguntas tiene cada una y
   cuánto puntúa la escala) y de aquí sale SOLO el texto. Así el
   mismo test da el mismo resultado en los dos idiomas.

   ⚠️ Todo se empareja por el nombre ESPAÑOL del resultado
   («Deficiencia de Qi», «Madera»…): es lo que se guarda en la base
   de datos y en localStorage, y lo que empareja `tcmTheme` y los
   `RECS_*`. El nombre traducido es solo para PINTAR, y viaja aparte
   (`titulo`).

   ⚠️ Las preguntas van emparejadas POR POSICIÓN, porque la
   respuesta se guarda por índice. Si una sección inglesa no tiene
   exactamente tantas preguntas como la española, esa sección se lee
   entera en español (ver `useSeccionesTcm`), para no cruzar
   preguntas con respuestas.

   Lo que falte se lee en español, resultado por resultado.
══════════════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { useIdioma } from "../../../i18n";
import type { TCMInterpretacion, TCMSeccion } from "../components/TCMTestPage";
import type { Recs } from "./tcmRecommendations";

/** El texto de una sección de test: el rótulo, el dominio y las preguntas. */
export type SeccionTexto = { titulo: string; dominio?: string; preguntas: string[] };
/** El texto de una interpretación: el rótulo, su subtítulo y la descripción. */
export type InterpTexto = { titulo: string; subtitulo?: string; descripcion: string };

/* ─────────────────────────────────────────────────────────────
   Los nombres de los resultados, para PINTAR.
   Las claves (izquierda) son las que guarda la base de datos.
   Los cinco elementos se dicen igual que en `tcmElementosContenido.en.ts`:
   si allí cambian, aquí también.
───────────────────────────────────────────────────────────── */
export const NOMBRE_RESULTADO_EN: Record<string, string> = {
  // Constituciones (Test 1)
  "Equilibrado": "Balanced",
  "Deficiencia de Qi": "Qi Deficiency",
  "Deficiencia de Yang": "Yang Deficiency",
  "Deficiencia de Yin": "Yin Deficiency",
  "Flema-Humedad": "Phlegm-Dampness",
  "Calor-Humedad": "Damp-Heat",
  "Estancamiento de Qi": "Qi Stagnation",
  // Los cinco elementos (Test 2 y Test 3)
  "Madera": "Wood",
  "Fuego": "Fire",
  "Tierra": "Earth",
  "Metal": "Metal",
  "Agua": "Water",
};

/* ═════════════════════════════════════════════════════════════
   TEST 1 · «Conoce tu constitución»
═════════════════════════════════════════════════════════════ */
export const TEST1_SECCIONES_EN: Record<string, SeccionTexto> = {
  "Equilibrado": {
    titulo: "Balanced",
    preguntas: [
      "My energy stays steady all day long.",
      "I sleep well and wake up rested.",
      "My digestion is good and regular.",
      "I don't often have trouble with cold, heat, tiredness or extreme emotions.",
    ],
  },
  "Deficiencia de Qi": {
    titulo: "Qi Deficiency",
    preguntas: [
      "I tire easily, with physical or mental activity.",
      "My voice is quiet or weak.",
      "I catch colds often.",
      "I sweat without effort, even when it isn't hot.",
      "Pale face or tongue.",
    ],
  },
  "Deficiencia de Yang": {
    titulo: "Yang Deficiency",
    preguntas: [
      "My hands and feet feel cold, especially in winter.",
      "I tire easily, even at rest.",
      "My urine is clear and there is a lot of it.",
      "Swollen legs or eyelids in the morning.",
      "Pale, wet tongue.",
    ],
  },
  "Deficiencia de Yin": {
    titulo: "Yin Deficiency",
    preguntas: [
      "I feel hot inside, sweat at night, or my hands and feet are hot.",
      "Dry mouth or throat.",
      "Palpitations or insomnia.",
      "Red tongue with no coating, or with cracks.",
      "Unsteady feelings, anxiety or restlessness.",
    ],
  },
  "Flema-Humedad": {
    titulo: "Phlegm-Dampness",
    preguntas: [
      "I feel heavy or slow after eating.",
      "Too much mucus, frequent colds or congestion.",
      "Slow digestion, bloating or gas.",
      "Excess weight, or a tendency to hold on to fluid.",
      "Swollen tongue with a white, sticky coating.",
    ],
  },
  "Calor-Humedad": {
    titulo: "Damp-Heat",
    preguntas: [
      "I feel hot inside, with sweating or flushing.",
      "Digestive trouble with acid reflux or diarrhea.",
      "Acne, inflammation or frequent infections.",
      "Yellow urine, or a feeling of heat in the body.",
      "Yellow, wet or sticky tongue.",
    ],
  },
  "Estancamiento de Qi": {
    titulo: "Qi Stagnation",
    preguntas: [
      "I get tense, irritated or frustrated easily.",
      "Pain or pressure in the chest, the belly or the sides.",
      "Irregular digestion, gas or a feeling of fullness.",
      "Sudden mood swings.",
      "Irregular bowel movements.",
    ],
  },
};

export const TEST1_INTERPRETACIONES_EN: Record<string, InterpTexto> = {
  "Equilibrado": {
    titulo: "Balanced",
    descripcion:
      "Your body is in good harmony. Keep your habits of Life and go on listening to your body regularly.",
  },
  "Deficiencia de Qi": {
    titulo: "Qi Deficiency",
    descripcion:
      "Your Qi (vital energy) is low. Rest more, eat warm and nourishing food, and don't push yourself, in body or mind.",
  },
  "Deficiencia de Yang": {
    titulo: "Yang Deficiency",
    descripcion:
      "Your Yang (your warming force) is weak. Dress warmly, favor warm food, and keep away from raw food, cold and damp.",
  },
  "Deficiencia de Yin": {
    titulo: "Yin Deficiency",
    descripcion:
      "Your Yin (your fluids and your inner cooling) is low. Rest, drink water, lower your stress and keep away from pungent food.",
  },
  "Flema-Humedad": {
    titulo: "Phlegm-Dampness",
    descripcion:
      "There is too much Dampness inside. Keep away from dairy and refined sugar, move every day, and eat light and warm.",
  },
  "Calor-Humedad": {
    titulo: "Damp-Heat",
    descripcion:
      "Heat and Dampness have built up. Keep away from fried food, alcohol and pungent dishes; eat cool and light, and lower your stress.",
  },
  "Estancamiento de Qi": {
    titulo: "Qi Stagnation",
    descripcion:
      "Your Qi is blocked. Move regularly, say what you feel, breathe consciously, and don't sit still all day.",
  },
};

/* ═════════════════════════════════════════════════════════════
   TEST 2 · «Tu elemento predominante» (terreno constitucional)
═════════════════════════════════════════════════════════════ */
export const TEST2_SECCIONES_EN: Record<string, SeccionTexto> = {
  "Madera": {
    titulo: "Wood",
    dominio: "Vital drive, direction, the ability to decide",
    preguntas: [
      "A natural pull toward leading or taking the initiative.",
      "A need to keep making progress and growing.",
      "A quick emotional reaction when something gets in the way.",
      "A competitive, goal-driven personality.",
      "I say what I think, directly.",
      "Energy that fires up quickly when something stirs it.",
      "Being passive for long makes me uncomfortable.",
      "Planning and picturing the future comes easily.",
    ],
  },
  "Fuego": {
    titulo: "Fire",
    dominio: "Emotional expression, bonding, vitality in relationships",
    preguntas: [
      "An expressive, talkative nature.",
      "A natural search for emotional connection.",
      "I get excited easily.",
      "Marked emotional sensitivity.",
      "A warm or charismatic presence with people.",
      "A need to share what goes on inside me.",
      "Intense feeling in my close bonds.",
      "Joy tends to be my dominant emotion.",
    ],
  },
  "Tierra": {
    titulo: "Earth",
    dominio: "Nourishment, support, stability",
    preguntas: [
      "A tendency to care for others, or to hold them up.",
      "I look for stability and routine.",
      "A reliable, steady personality.",
      "Well-developed empathy.",
      "I prefer harmonious surroundings.",
      "A practical sense when it comes to deciding.",
      "I can hold emotion, mine and other people's.",
      "A need for solid ground under my feet.",
    ],
  },
  "Metal": {
    titulo: "Metal",
    dominio: "Inner order, ethics, introspection",
    preguntas: [
      "I demand a lot of myself, with high standards.",
      "I value order and structure a great deal.",
      "A strong ethical sense.",
      "A tendency to keep my feelings to myself.",
      "Chaos makes me uncomfortable.",
      "I lean toward depth rather than surface.",
      "A need for clarity and definition.",
      "An introspective personality.",
    ],
  },
  "Agua": {
    titulo: "Water",
    dominio: "Will, depth, conserving energy",
    preguntas: [
      "A natural pull toward looking inward.",
      "I often need to be alone to recharge.",
      "An interest in deep or existential questions.",
      "I take my time before trusting.",
      "A strong sense of will about what matters.",
      "I prefer quiet surroundings.",
      "Intense energy inside, not much of it shown.",
      "Well-developed intuition.",
    ],
  },
};

export const TEST2_INTERPRETACIONES_EN: Record<string, InterpTexto> = {
  "Madera": {
    titulo: "Wood",
    descripcion:
      "Your constitutional ground is the Wood Element. Your nature leans toward drive, direction and initiative. The liver governs your ability to plan and to move forward. Watch tension and frustration when they build up: they are signs of imbalance.",
  },
  "Fuego": {
    titulo: "Fire",
    descripcion:
      "Your constitutional ground is the Fire Element. Your nature is expressive, relational and warm. The heart governs your emotional vitality and your connection with others. Watch intensity of feeling and overstimulation: they are signs of imbalance.",
  },
  "Tierra": {
    titulo: "Earth",
    descripcion:
      "Your constitutional ground is the Earth Element. Your nature leans toward support, stability and care. The spleen governs how you nourish and how you hold. Watch chewing on your thoughts and wearing yourself out caring for others: they are signs of imbalance.",
  },
  "Metal": {
    titulo: "Metal",
    descripcion:
      "Your constitutional ground is the Metal Element. Your nature is introspective, precise and ethical. The lung governs your sense of order and of limits. Watch rigidity and how hard it is for you to let go: they are signs of imbalance.",
  },
  "Agua": {
    titulo: "Water",
    descripcion:
      "Your constitutional ground is the Water Element. Your nature is deep, intuitive and reserved. The kidney governs your will and your baseline vital energy. Watch exhaustion and fear: they are signs of imbalance.",
  },
};

/* ═════════════════════════════════════════════════════════════
   TEST 3 · «Tu desequilibrio actual»
═════════════════════════════════════════════════════════════ */
export const TEST3_SECCIONES_EN: Record<string, SeccionTexto> = {
  "Madera": {
    titulo: "Wood",
    dominio: "Anger, stagnation, muscle tension",
    preguntas: [
      "Frequent irritability or frustration.",
      "Tension in the neck, the shoulders or the jaw.",
      "Headaches at the temples, or migraines.",
      "Sighing often.",
      "Digestion upset by stress.",
      "A feeling of being stuck in my projects.",
      "Waking up between 1 and 3 a.m.",
      "Abrupt mood swings.",
    ],
  },
  "Fuego": {
    titulo: "Fire",
    dominio: "An agitated Shen, inner Heat",
    preguntas: [
      "Insomnia or light sleep.",
      "Palpitations.",
      "Anxiety, or a racing mind at night.",
      "Feeling hot, or flushing in the face.",
      "Intense feelings that are hard to temper.",
      "Sweating without effort.",
      "Red tongue, or a red tip (if you can see it).",
      "Nervousness around people or in close relationships.",
    ],
  },
  "Tierra": {
    titulo: "Earth",
    dominio: "Qi deficiency, inner Dampness",
    preguntas: [
      "Heaviness in the body.",
      "A bloated belly after eating.",
      "Tiredness after eating.",
      "Chewing on the same thoughts too much.",
      "Cravings for sweets.",
      "Loose or pasty stools.",
      "Trouble concentrating.",
      "Feeling worn out by emotional overload.",
    ],
  },
  "Metal": {
    titulo: "Metal",
    dominio: "Sadness, disturbed breathing Qi",
    preguntas: [
      "Persistent melancholy.",
      "Trouble letting go of what already happened.",
      "Congestion, or a mild cough that keeps coming back.",
      "Dry skin.",
      "A mild tightness in the chest.",
      "A tendency to constipation.",
      "Deep sighs.",
      "Emotional stiffness when things change.",
    ],
  },
  "Agua": {
    titulo: "Water",
    dominio: "Jing or Qi deficiency",
    preguntas: [
      "Deep or chronic tiredness.",
      "Low back pain, or weak knees.",
      "Feeling cold often.",
      "Persistent fear or insecurity.",
      "Less motivation.",
      "Waking up unrefreshed.",
      "Passing water often, or at night.",
      "A tendency to shut myself away too much.",
    ],
  },
};

export const TEST3_INTERPRETACIONES_EN: Record<string, InterpTexto> = {
  "Madera": {
    titulo: "Wood",
    subtitulo: "Liver stagnation",
    descripcion:
      "The predominant pattern is Wood disharmony. Your liver Qi is stagnant, or rising. Put physical movement first, along with letting your feelings out and ways of handling stress. Keep away from working without rest, and from very fatty or pungent food.",
  },
  "Fuego": {
    titulo: "Fire",
    subtitulo: "An agitated Shen",
    descripcion:
      "The predominant pattern is Fire disharmony. Your Shen (mind-spirit) shows signs of agitation or Heat. Put the quality of your night's rest first, along with meditation and cooling food. Keep away from too much stimulation, and from intense feelings with no room to settle.",
  },
  "Tierra": {
    titulo: "Earth",
    subtitulo: "Spleen Qi deficiency",
    descripcion:
      "The predominant pattern is Earth disharmony. Your spleen Qi is weakened, and tends toward inner Dampness. Put warm, regular meals first, along with chewing slowly and chewing less on your thoughts. Keep away from raw food, too much dairy, and eating fast or anxiously.",
  },
  "Metal": {
    titulo: "Metal",
    subtitulo: "Lung Qi deficiency",
    descripcion:
      "The predominant pattern is Metal disharmony. Your lung Qi shows signs of weakness, or of feeling held in. Put conscious breathing first, along with saying the sadness out loud and time in nature. Keep away from looking inward without acting, and from closed, dry rooms.",
  },
  "Agua": {
    titulo: "Water",
    subtitulo: "Kidney deficiency",
    descripcion:
      "The predominant pattern is Water disharmony. Your Jing, or your kidney Qi, shows signs of exhaustion. Put deep rest first, along with tonifying food (seeds, legumes, seaweed) and less chronic stress. Keep away from staying up late, and from cold on your lower back.",
  },
};

/* ═════════════════════════════════════════════════════════════
   Mi Espacio · las descripciones de cada resultado guardado.
   Dicen casi lo mismo que las interpretaciones de los test, pero
   no exactamente: se traducen por separado, como en español.
═════════════════════════════════════════════════════════════ */
export const DESC_CONSTITUCION_EN: Record<string, string> = {
  "Equilibrado":
    "Your body is in harmony. Keep your habits of Life and go on listening to your body regularly.",
  "Deficiencia de Qi":
    "Your Qi (vital energy) is low. Rest more, eat warm and nourishing food, and don't push yourself, in body or mind.",
  "Deficiencia de Yang":
    "Your Yang is weak. Dress warmly, favor warm food, and keep away from raw food, cold and damp.",
  "Deficiencia de Yin":
    "Your Yin (how well you are hydrated and nourished) is low, or isn't quite right. Take rest that really rests you, and lower your stress.",
  "Flema-Humedad":
    "There is too much Dampness inside. Keep away from dairy and refined sugar, move every day, and eat light and warm.",
  "Calor-Humedad":
    "Heat and Dampness have built up. Keep away from fried food, alcohol and pungent dishes; eat cool and light, and lower your stress.",
  "Estancamiento de Qi":
    "Your Qi is blocked. Move regularly, say what you feel, breathe consciously, and don't sit still all day.",
};

export const DESC_ELEMENTO_EN: Record<string, string> = {
  "Madera": TEST2_INTERPRETACIONES_EN["Madera"]!.descripcion,
  "Fuego": TEST2_INTERPRETACIONES_EN["Fuego"]!.descripcion,
  "Tierra": TEST2_INTERPRETACIONES_EN["Tierra"]!.descripcion,
  "Metal": TEST2_INTERPRETACIONES_EN["Metal"]!.descripcion,
  "Agua": TEST2_INTERPRETACIONES_EN["Agua"]!.descripcion,
};

export const DESC_DESEQUILIBRIO_EN: Record<string, string> = {
  "Madera": TEST3_INTERPRETACIONES_EN["Madera"]!.descripcion,
  "Fuego": TEST3_INTERPRETACIONES_EN["Fuego"]!.descripcion,
  "Tierra": TEST3_INTERPRETACIONES_EN["Tierra"]!.descripcion,
  "Metal": TEST3_INTERPRETACIONES_EN["Metal"]!.descripcion,
  // El de Mi Espacio no lleva los ejemplos entre paréntesis.
  "Agua":
    "The predominant pattern is Water disharmony. Your Jing, or your kidney Qi, shows signs of exhaustion. Put deep rest first, along with tonifying food and less chronic stress. Keep away from staying up late, and from cold on your lower back.",
};

/* ═════════════════════════════════════════════════════════════
   LOS HOOKS. Hay que llamarlos AL PINTAR: si el texto se resolviera
   al importar el módulo se quedaría congelado en el idioma con el
   que arrancó la web y no cambiaría al pulsar EN.
═════════════════════════════════════════════════════════════ */

/** El nombre del resultado tal y como se muestra («Madera» → «Wood»). */
export function useNombreResultado(): (nombre: string) => string {
  const { idioma } = useIdioma();
  return (nombre: string) =>
    (idioma === "en" ? NOMBRE_RESULTADO_EN[nombre] : undefined) ?? nombre;
}

/**
 * Las secciones del test con el texto inglés encima. `nombre` no se toca
 * (es lo que se guarda); el rótulo viaja en `titulo`.
 *
 * Si el número de preguntas no cuadra, esa sección se queda entera en
 * español: mejor leerla en español que emparejar mal pregunta y respuesta.
 */
export function useSeccionesTcm(
  secciones: TCMSeccion[],
  en: Record<string, SeccionTexto>,
): TCMSeccion[] {
  const { idioma } = useIdioma();
  return useMemo(() => {
    if (idioma !== "en") return secciones;
    return secciones.map((sec) => {
      const t = en[sec.nombre];
      if (!t) return sec;
      const preguntas =
        t.preguntas.length === sec.preguntas.length ? t.preguntas : sec.preguntas;
      return { ...sec, titulo: t.titulo, dominio: t.dominio ?? sec.dominio, preguntas };
    });
  }, [idioma, secciones, en]);
}

/** Las interpretaciones con el texto inglés encima (mismo criterio). */
export function useInterpretacionesTcm(
  interpretaciones: TCMInterpretacion[],
  en: Record<string, InterpTexto>,
): TCMInterpretacion[] {
  const { idioma } = useIdioma();
  return useMemo(() => {
    if (idioma !== "en") return interpretaciones;
    return interpretaciones.map((interp) => {
      const t = en[interp.nombre];
      if (!t) return interp;
      return {
        ...interp,
        titulo: t.titulo,
        subtitulo: t.subtitulo ?? interp.subtitulo,
        descripcion: t.descripcion,
      };
    });
  }, [idioma, interpretaciones, en]);
}

/**
 * Las recomendaciones (infusiones, hierbas, estilo de vida, nutrición) en el
 * idioma activo. El resultado que no esté traducido se lee en español.
 */
export function useRecsTcm(
  recs: Record<string, Recs>,
  en: Record<string, Recs>,
): Record<string, Recs> {
  const { idioma } = useIdioma();
  return useMemo(() => {
    if (idioma !== "en") return recs;
    const out: Record<string, Recs> = {};
    for (const clave of Object.keys(recs)) out[clave] = en[clave] ?? recs[clave]!;
    return out;
  }, [idioma, recs, en]);
}

/** Las descripciones de Mi Espacio en el idioma activo (misma regla). */
export function useDescripcionesTcm(
  desc: Record<string, string>,
  en: Record<string, string>,
): Record<string, string> {
  const { idioma } = useIdioma();
  return useMemo(() => {
    if (idioma !== "en") return desc;
    const out: Record<string, string> = {};
    for (const clave of Object.keys(desc)) out[clave] = en[clave] ?? desc[clave]!;
    return out;
  }, [idioma, desc, en]);
}
