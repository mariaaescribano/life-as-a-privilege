import type {
  BandaPrediabetes, DesglosePunto, PreguntaPrediabetes, ResultadoPrediabetes, SenalAlerta,
} from "./PrediabetesNutricion";

/**
 * «¿Cómo va tu azúcar?» (test FINDRISC), en INGLÉS.
 *
 * Aquí va SOLO el texto. Los puntos, los cortes de cada banda, el color y las
 * `key`/`value` —que son lo que se guarda en `data.prediabetes`— viven
 * únicamente en `PrediabetesNutricion.ts`. Cambiar una `key` aquí no traduce
 * nada: rompe las respuestas guardadas.
 *
 * Lo que falte se lee en español (ver `usePrediabetes`).
 *
 * ⚠️ TONO — las mismas reglas del original, que NO se rompen al traducir:
 *  · NUNCA una etiqueta de peso («overweight», «obese»). El IMC puntúa por
 *    dentro y no se enseña.
 *  · El resultado separa lo que no se elige (edad, genética) de lo que sí está
 *    en tu mano. Nada de culpa por lo primero.
 *  · Cierre esperanzador: la prediabetes se revierte. Es un aviso, no una
 *    condena, y desde luego no un diagnóstico.
 *
 * Al traducir:
 *  · «prediabetes» → prediabetes; «glucosa en ayunas» → fasting glucose;
 *    «hemoglobina glicosilada (HbA1c)» → HbA1c; «resistencia a la insulina» →
 *    insulin resistance; «acantosis nigricans» no se traduce.
 *  · Los centímetros NO se pasan a pulgadas: son los cortes del FINDRISC.
 *  · «tu médica o médico» → *your doctor*: el inglés no lleva género y no se
 *    inventa un equivalente.
 *  · Los porcentajes con coma decimal pasan a punto; «3.000 personas» → *3,000*.
 */

// ── Cabecera ───────────────────────────────────────────────────────────────
export const PREDIABETES_INTRO_EN = {
  titulo: "How's your blood sugar?",
  subtitulo:
    "Prediabetes doesn't hurt, you can't feel it, and it can be turned around. Which is why it's worth looking at in time.",
  que: [
    "Before there's type 2 diabetes there's an in-between stage: blood glucose is higher than normal, but not yet high enough to be called diabetes. That's prediabetes, and it's estimated that more than one in ten adults has it without knowing.",
    "Here's what matters: at that stage the body can still go back. With changes to food and movement, most people with prediabetes get their numbers back to normal. It isn't an inevitable step on the way: it's an open window.",
    "What you're about to answer is FINDRISC, a risk questionnaire developed in Finland and validated in the Spanish population. It doesn't measure your blood sugar —that takes a blood test—: it estimates how likely you are to develop type 2 diabetes over the next ten years, so you know whether it's worth getting checked.",
    "Some questions are about your body. There's no good or bad number here, and you won't see a single label: they're just data the calculation needs. Answer calmly; nobody else reads this.",
  ],
  subtituloTurquesa: "Eight factors. Two minutes.",
};

// ── Las cinco preguntas ────────────────────────────────────────────────────
export type PreguntaTexto = Pick<PreguntaPrediabetes, "categoria" | "pregunta" | "apoyo"> & {
  /** Etiquetas de las opciones por su `value` (el `value` no se traduce). */
  opciones: Record<string, string>;
};

export const PREDIABETES_PREGUNTAS_EN: Record<string, PreguntaTexto> = {
  actividad: {
    categoria: "Movement",
    pregunta: "Do you move for at least 30 minutes a day?",
    apoyo:
      "Everything counts: walking, climbing stairs, work if you're on your feet, housework, sport. They don't have to be in one go.",
    opciones: {
      si: "Yes, most days",
      no: "No, or only the odd day",
    },
  },
  vegetales: {
    categoria: "Your plate",
    pregunta: "Do you eat vegetables or fruit every day?",
    apoyo: "Every day, a piece of fruit or 200 grams of vegetables.",
    opciones: {
      si: "Yes, every day",
      no: "Not every day",
    },
  },
  tension: {
    categoria: "Blood pressure",
    pregunta: "Do you take, or have you taken, medication for high blood pressure?",
    apoyo: "Only if a doctor prescribed it on an ongoing basis.",
    opciones: {
      no: "No",
      si: "Yes",
    },
  },
  glucosa: {
    categoria: "Past blood tests",
    pregunta: "Have you ever been told your blood sugar was high?",
    apoyo:
      "In a blood test, at a check-up, during a hospital stay or in pregnancy (gestational diabetes).",
    opciones: {
      no: "No, never",
      si: "Yes, at some point",
    },
  },
  familia: {
    categoria: "Your family",
    pregunta: "Is there diabetes in your family?",
    apoyo:
      "This one is not down to you at all: it's the part that's inherited. Knowing it only makes the calculation more accurate.",
    opciones: {
      no: "Not that I know of",
      segundo: "Yes: grandparents, aunts, uncles or first cousins",
      primero: "Yes: parents, siblings or children",
    },
  },
};

// ── La cintura ─────────────────────────────────────────────────────────────
export const CINTURA_AYUDA_EN = {
  titulo: "How to measure",
  pasos: [
    "Standing, relaxed, without holding your stomach in. Breathe out normally.",
    "Run the tape above your navel, halfway between your lowest rib and your hip bone.",
    "Tape horizontal and resting on you, not pulled tight. Write down the centimeters.",
  ],
  porQue:
    "We ask about your waist and not just your weight because what's linked to insulin resistance isn't weighing more or less, it's the fat that builds up around your organs. Two people at the same weight can be at very different risk.",
};

// ── Los factores del desglose (los tres corporales y los dos consejos) ─────
// Indexados por la `key` del factor. Los cinco restantes son las preguntas: su
// etiqueta es la `categoria` y sale de PREDIABETES_PREGUNTAS_EN.
export const DESGLOSE_EN: Record<string, string> = {
  edad: "Your age",
  imc: "Your build",
  cintura: "Your waist",
};

export const CONSEJOS_EN: Record<string, string> = {
  imc: "It doesn't take a transformation: in the studies, losing 5% to 7% of your weight already cuts the risk in half.",
  cintura: "Belly fat is one of the first things you lose when you move your body regularly, even if the scale takes a while to shift.",
  actividad: "Walking 30 minutes a day is the single most evidence-backed thing there is for this. No gym required.",
  vegetales: "The fiber in vegetables and fruit cushions the rises in glucose. Starting your meal with the vegetables already changes the curve.",
};

// ── Las bandas de riesgo ───────────────────────────────────────────────────
export type BandaTexto = Pick<BandaPrediabetes, "etiqueta" | "titulo" | "riesgo" | "texto" | "paso">;

/** Indexadas por el `min` de la banda: es lo único estable que no es texto. */
export const PREDIABETES_BANDAS_EN: Record<number, BandaTexto> = {
  0: {
    etiqueta: "Under 7",
    titulo: "Low risk",
    riesgo: "About 1 in 100 people with this score develop diabetes within 10 years.",
    texto:
      "For now your sugar metabolism looks like it's doing fine. That's not a free pass forever —risk goes up with age, and that happens to everyone— but there's nothing urgent for you today.",
    paso: "Keep doing what you're doing and take this test again every few years, or if something big changes in your life.",
  },
  7: {
    etiqueta: "7 to 11",
    titulo: "Slightly elevated risk",
    riesgo: "About 1 in 25 people with this score develop diabetes within 10 years.",
    texto:
      "Something is adding up, but you're a long way from the worry zone. It's the most common score, and it's exactly the moment when small changes pay off most, because there's nothing to fix yet.",
    paso: "Look below at what's adding up and pick a single change. One you keep is worth more than five that last two weeks.",
  },
  12: {
    etiqueta: "12 to 14",
    titulo: "Moderate risk",
    riesgo: "About 1 in 6 people with this score develop diabetes within 10 years.",
    texto:
      "Here it's worth doing something, and worth doing it now: this is exactly the band where changing habits has the most proven effect. It isn't bad news; it's information arriving in time.",
    paso: "Ask at your doctor's office for a blood test with fasting glucose or HbA1c. It's an ordinary blood test.",
  },
  15: {
    etiqueta: "15 to 20",
    titulo: "High risk",
    riesgo: "About 1 in 3 people with this score develop diabetes within 10 years.",
    texto:
      "The score is high and the honest thing is to tell you straight. It's also honest to tell you the other part: in the landmark study on this, people in your situation who changed how they ate and started moving cut their risk by 58%. More than any pill.",
    paso: "Talk to your doctor and ask them to check your glucose. Take this score along if you like: it's a test they know.",
  },
  21: {
    etiqueta: "Over 20",
    titulo: "Very high risk",
    riesgo: "About 1 in 2 people with this score develop diabetes within 10 years.",
    texto:
      "This score calls for a medical appointment, without dramatizing it and without putting it off. A high score doesn't mean you have diabetes: it means several factors are adding up at once and it's worth knowing where you really stand, with a test.",
    paso: "Book an appointment at your doctor's office and tell them. It's a simple blood test, and knowing the real number is what hands you back control.",
  },
};

// ── Señales de alerta ──────────────────────────────────────────────────────
export const SENALES_INTRO_EN = {
  titulo: "Signs not to let slide",
  aviso:
    "Before the list, the most important thing: prediabetes almost never causes symptoms. You can carry it for years without feeling a thing. That's why a risk test exists, and why you shouldn't wait until you feel unwell.",
  texto:
    "These signs show up when glucose has already been high for a while. None of them on its own means you have diabetes —almost all of them have far more common explanations— but if you recognize several at once, and especially if they've been with you for weeks, get a blood test. It isn't scaremongering: it's the cheap, sensible thing to do.",
};

export type SenalTexto = Pick<SenalAlerta, "titulo" | "texto">;

export const SENALES_ALERTA_EN: Record<string, SenalTexto> = {
  sed: {
    titulo: "Thirst that won't go away",
    texto: "Drinking far more than usual and still having a dry mouth. It usually comes with the next one.",
  },
  orina: {
    titulo: "Peeing a lot, at night too",
    texto: "Getting up once or several times to pee when you didn't before. That's how the body gets rid of the sugar it doesn't need.",
  },
  cansancio: {
    titulo: "A tiredness that sleep doesn't fix",
    texto: "Deep exhaustion, with no clear cause, that doesn't improve with rest or with the weekend.",
  },
  hambre: {
    titulo: "Constant hunger",
    texto: "Getting hungry again soon after eating, with heavy energy crashes or sleepiness after meals.",
  },
  vision: {
    titulo: "Blurry vision now and then",
    texto: "Your sight clouds over and clears up for no obvious reason, sometimes for days.",
  },
  heridas: {
    titulo: "Wounds that are slow to close",
    texto: "Cuts, grazes or sores that heal far more slowly than they used to.",
  },
  infecciones: {
    titulo: "Infections that keep coming back",
    texto: "Thrush, urinary tract infections or gum infections that return again and again.",
  },
  hormigueo: {
    titulo: "Tingling in your hands or feet",
    texto: "Pins and needles, numbness or loss of feeling, above all in your feet and at night.",
  },
  acantosis: {
    titulo: "Dark patches in the folds of your skin",
    texto:
      "Areas of darker, velvety skin on your neck, armpits or groin. It's called acanthosis nigricans and it's one of the most specific signs of insulin resistance.",
  },
  peso: {
    titulo: "Losing weight without trying",
    texto: "Dropping weight without having changed anything about what you eat or how you move. This one is worth asking about soon.",
  },
};

// ── Cierre ─────────────────────────────────────────────────────────────────
export const PREDIABETES_ESPERANZA_EN = {
  titulo: "This can be turned around",
  texto: [
    "Prediabetes is one of the few things in health that genuinely reverses, and without medication. You're not managing a decline: you're closing a door that's still open.",
    "The Diabetes Prevention Program followed more than 3,000 people at high risk for three years. The ones who changed their food and their activity cut their risk by 58%, almost twice what the drug it was compared against managed. In people over 60, the reduction was 71%.",
    "And it took nothing heroic: losing 5% to 7% of your weight and walking 150 minutes a week. Half an hour, five days. That was it.",
  ],
  aviso:
    "This is a risk estimate for educational purposes, not a diagnosis. Prediabetes is only confirmed or ruled out with a blood test (fasting glucose or HbA1c). If any of this has worried you, bring it up with your doctor: it's exactly the conversation they're there for.",
};

/** Las preguntas en el idioma que se le pase. El español manda el orden, la
 *  `key`, el `value` de cada opción y los puntos. */
export function preguntasPrediabetesTraducidas(
  preguntas: PreguntaPrediabetes[],
  idioma: "es" | "en",
): PreguntaPrediabetes[] {
  if (idioma === "es") return preguntas;
  return preguntas.map((p) => {
    const en = PREDIABETES_PREGUNTAS_EN[p.key];
    if (!en) return p;
    return {
      ...p,
      categoria: en.categoria,
      pregunta: en.pregunta,
      apoyo: en.apoyo ?? p.apoyo,
      opciones: p.opciones.map((o) => ({ ...o, label: en.opciones[o.value] ?? o.label })),
    };
  });
}

/** Las señales de alerta en el idioma que se le pase (el orden y la `key`, del
 *  español). */
export function senalesTraducidas(senales: SenalAlerta[], idioma: "es" | "en"): SenalAlerta[] {
  if (idioma === "es") return senales;
  return senales.map((s) => {
    const en = SENALES_ALERTA_EN[s.key];
    return en ? { ...s, ...en } : s;
  });
}

/** Una banda de riesgo en el idioma que se le pase (los cortes y el color, del
 *  español). */
export function bandaTraducida(banda: BandaPrediabetes, idioma: "es" | "en"): BandaPrediabetes {
  if (idioma === "es") return banda;
  const en = PREDIABETES_BANDAS_EN[banda.min];
  return en ? { ...banda, ...en } : banda;
}

/** Un factor del desglose en el idioma que se le pase. La etiqueta sale de
 *  DESGLOSE_EN (los tres corporales) o de la `categoria` de la pregunta; el
 *  consejo, de CONSEJOS_EN. Los puntos y `modificable` no se tocan. */
function desglosePuntoTraducido(d: DesglosePunto, idioma: "es" | "en"): DesglosePunto {
  if (idioma === "es") return d;
  const etiqueta = DESGLOSE_EN[d.key] ?? PREDIABETES_PREGUNTAS_EN[d.key]?.categoria ?? d.etiqueta;
  const consejo = d.consejo ? CONSEJOS_EN[d.key] ?? d.consejo : undefined;
  return { ...d, etiqueta, consejo };
}

/** El resultado del test en el idioma que se le pase (la puntuación es la
 *  misma: aquí solo se traduce lo que se lee). */
export function resultadoTraducido(
  r: ResultadoPrediabetes,
  idioma: "es" | "en",
): ResultadoPrediabetes {
  if (idioma === "es") return r;
  return { ...r, desglose: r.desglose.map((d) => desglosePuntoTraducido(d, idioma)) };
}
