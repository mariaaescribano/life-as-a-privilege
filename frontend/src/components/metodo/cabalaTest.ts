import type { CabalaPageKey } from "./cabalaSefirot";

// ─────────────────────────────────────────────────────────────────────────
// "Escala de Equilibrio de las Sefirot"
// Cada dimensión tiene 5 preguntas, SIEMPRE en este orden:
//   [0] déficit · [1] déficit · [2] equilibrio · [3] exceso · [4] exceso
// La persona responde del 1 (Nunca) al 5 (Siempre).
//
// Puntuación por dimensión:
//   · Déficit  = P1 + P2  (2-10)   → poco desarrollada
//   · Exceso   = P4 + P5  (2-10)   → sobreexpresada
//   · P3       = modulador de integración (1-5)
//
// Filosofía: ninguna sefirá es "buena" o "mala"; cada energía puede estar
// poco desarrollada, integrada o sobreexpresada.
// ─────────────────────────────────────────────────────────────────────────

export type TestTipo = "deficit" | "equilibrio" | "exceso";

export interface TestPregunta {
  texto: string;
  tipo: TestTipo;
}

export interface DimensionTest {
  key: CabalaPageKey;
  /** Tema de la dimensión (p.ej. "Propósito"). */
  etiqueta: string;
  /** 5 preguntas en orden fijo: 2 déficit, 1 equilibrio, 2 exceso. */
  preguntas: TestPregunta[];
}

export const NUM_PREGUNTAS = 5;

// Escala 1-5 (index 0 → valor 1).
export const ESCALA: { valor: number; label: string }[] = [
  { valor: 1, label: "Nunca" },
  { valor: 2, label: "Rara vez" },
  { valor: 3, label: "A veces" },
  { valor: 4, label: "Frecuentemente" },
  { valor: 5, label: "Siempre" },
];

const d = (texto: string): TestPregunta => ({ texto, tipo: "deficit" });
const e = (texto: string): TestPregunta => ({ texto, tipo: "equilibrio" });
const x = (texto: string): TestPregunta => ({ texto, tipo: "exceso" });

export const CABALA_TEST: Record<CabalaPageKey, DimensionTest> = {
  kether: {
    key: "kether",
    etiqueta: "Propósito",
    preguntas: [
      d("Siento que mi vida carece de una dirección clara."),
      d("Cambio con frecuencia de objetivos porque pierdo la motivación."),
      e("Las decisiones importantes las tomo teniendo presentes mis valores más profundos."),
      x("Me cuesta disfrutar actividades que no considero útiles para mi propósito."),
      x("Siento que necesito cumplir una misión extraordinaria para que mi vida tenga sentido."),
    ],
  },
  chokmah: {
    key: "chokmah",
    etiqueta: "Claridad",
    preguntas: [
      d("Suelo sacar conclusiones antes de conocer todos los hechos."),
      d("Mis emociones influyen demasiado en cómo interpreto lo que ocurre."),
      e("Antes de reaccionar intento distinguir los hechos de mis interpretaciones."),
      x("Confío tanto en mi intuición que a veces no verifico la información."),
      x("Me cuesta aceptar que mi primera percepción pueda estar equivocada."),
    ],
  },
  binah: {
    key: "binah",
    etiqueta: "Comprensión",
    preguntas: [
      d("Repito situaciones similares sin entender por qué."),
      d("Rara vez reflexiono sobre lo que puedo aprender de mis experiencias."),
      e("Suelo convertir mis experiencias en aprendizajes útiles."),
      x("Analizo tanto las situaciones que me cuesta actuar."),
      x("Necesito comprender todo antes de tomar una decisión."),
    ],
  },
  daat: {
    key: "daat",
    etiqueta: "Coherencia",
    preguntas: [
      d("Sé lo que debería hacer, pero muchas veces no lo hago."),
      d("Abandono fácilmente hábitos que considero importantes."),
      e("Mis acciones suelen estar alineadas con mis valores."),
      x("Me resulta difícil aceptar cuando descubro que debo cambiar una creencia importante."),
      x("Soy muy duro conmigo cuando no actúo de forma coherente."),
    ],
  },
  chesed: {
    key: "chesed",
    etiqueta: "Generosidad",
    preguntas: [
      d("Prefiero no involucrarme demasiado en los problemas de otras personas."),
      d("Me cuesta ofrecer ayuda si no me la piden."),
      e("Disfruto ayudar respetando también mis propios límites."),
      x("Me siento culpable cuando no puedo ayudar."),
      x("Con frecuencia doy más de lo que realmente puedo sostener."),
    ],
  },
  geburah: {
    key: "geburah",
    etiqueta: "Límites",
    preguntas: [
      d("Me cuesta decir «no»."),
      d("Acepto responsabilidades para evitar decepcionar a otros."),
      e("Soy capaz de poner límites con respeto y firmeza."),
      x("Me molesta cuando las personas no hacen las cosas como considero correcto."),
      x("Me cuesta delegar porque prefiero mantener el control."),
    ],
  },
  tipharet: {
    key: "tipharet",
    etiqueta: "Equilibrio",
    preguntas: [
      d("Paso fácilmente de un extremo emocional a otro."),
      d("Me cuesta escuchar antes de reaccionar."),
      e("Suelo equilibrar mis necesidades con las de los demás."),
      x("Evito tomar decisiones difíciles para mantener la armonía."),
      x("Dedico demasiado tiempo intentando que todos estén bien."),
    ],
  },
  netzach: {
    key: "netzach",
    etiqueta: "Perseverancia",
    preguntas: [
      d("Abandono proyectos cuando aparecen dificultades."),
      d("Si no veo resultados rápidos pierdo la motivación."),
      e("Mantengo mis compromisos incluso cuando disminuye el entusiasmo."),
      x("Me cuesta abandonar proyectos aunque ya no tengan sentido."),
      x("Siento que descansar es perder el tiempo."),
    ],
  },
  hod: {
    key: "hod",
    etiqueta: "Expresión",
    preguntas: [
      d("Me cuesta expresar lo que realmente pienso o siento."),
      d("Suelo guardar silencio para evitar conflictos."),
      e("Expreso mis ideas con claridad y respeto."),
      x("Necesito que los demás comprendan o acepten mi punto de vista."),
      x("Me frustro cuando siento que no me entienden."),
    ],
  },
  yesod: {
    key: "yesod",
    etiqueta: "Coherencia práctica",
    preguntas: [
      d("Me cuesta mantener hábitos de forma constante."),
      d("Mi rutina cambia continuamente sin una estructura clara."),
      e("Mis hábitos reflejan aquello que considero importante."),
      x("Me incomoda cambiar mis rutinas aunque las circunstancias lo requieran."),
      x("Me siento mal cuando no puedo seguir mi planificación exactamente."),
    ],
  },
  malkuth: {
    key: "malkuth",
    etiqueta: "Manifestación",
    preguntas: [
      d("Siento que mi vida no refleja realmente quién soy."),
      d("Espero que las circunstancias cambien antes de actuar."),
      e("Mi forma de vivir refleja mis valores más importantes."),
      x("Mido mi valor personal por lo que consigo o produzco."),
      x("Me cuesta disfrutar el presente porque siempre estoy pensando en el siguiente objetivo."),
    ],
  },
};

// ── Puntuación ──────────────────────────────────────────────────────────
export type Tendencia = "bajo" | "moderado" | "alto";
export type Integracion = "fuerte" | "parcial" | "fragil";

/** ¿Están las 5 respuestas contestadas (1-5)? */
export function testCompleto(respuestas?: number[]): boolean {
  return Array.isArray(respuestas) && respuestas.length === NUM_PREGUNTAS && respuestas.every((v) => v >= 1 && v <= 5);
}

/** Déficit = P1 + P2 (2-10). */
export function puntuacionDeficit(r: number[]): number {
  return (r[0] ?? 0) + (r[1] ?? 0);
}

/** Exceso = P4 + P5 (2-10). */
export function puntuacionExceso(r: number[]): number {
  return (r[3] ?? 0) + (r[4] ?? 0);
}

/** Modulador de integración = P3 (1-5). */
export function puntuacionEquilibrio(r: number[]): number {
  return r[2] ?? 0;
}

/** Nivel de una tendencia (déficit/exceso), sobre la suma 2-10. */
export function nivelTendencia(score: number): Tendencia {
  if (score >= 8) return "alto";
  if (score >= 5) return "moderado";
  return "bajo";
}

/** Fuerza de la integración a partir de P3. */
export function nivelIntegracion(q3: number): Integracion {
  if (q3 >= 4) return "fuerte";
  if (q3 === 3) return "parcial";
  return "fragil";
}

// Etiquetas de crecimiento (no juzgan: invitan a desarrollar).
export const LABEL_DEFICIT = "Energía poco desarrollada";
export const LABEL_EQUILIBRIO = "Energía integrada";
export const LABEL_EXCESO = "Energía sobreexpresada";

export const TENDENCIA_LABEL: Record<Tendencia, string> = {
  bajo: "bajo",
  moderado: "moderado",
  alto: "alto",
};

export const INTEGRACION_LABEL: Record<Integracion, string> = {
  fuerte: "Integración fuerte",
  parcial: "Integración parcial",
  fragil: "Integración frágil",
};

export const INTEGRACION_TEXTO: Record<Integracion, string> = {
  fuerte: "Tienes recursos para autorregular esta dimensión, aunque presente cierta tendencia al déficit o al exceso.",
  parcial: "Equilibrio parcial: conviene observar en qué contextos aparecen los extremos.",
  fragil: "El equilibrio es frágil, por lo que las tendencias detectadas probablemente afectan de forma más clara a tu vida cotidiana.",
};
