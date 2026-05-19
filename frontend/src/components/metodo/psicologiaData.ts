export type EtapaKey =
  | "infancia"
  | "ninez"
  | "adolescencia"
  | "juventud"
  | "adultezTemprana"
  | "adultez"
  | "madurez";

export interface Etapa {
  key: EtapaKey;
  label: string;
  rango: string;
  edadMin: number;  // edad mínima para que esta etapa aparezca
  preguntas: string[];
  intro?: string;   // texto introductorio breve
}

// Preguntas iniciales — afina las que quieras
export const ETAPAS: Etapa[] = [
  {
    key: "infancia",
    label: "Infancia",
    rango: "0 — 6 años",
    edadMin: 0,
    intro: "Los primeros años forman el suelo emocional sobre el que después construirás todo lo demás.",
    preguntas: [
      "¿Cuál es el primer recuerdo que conservas? Descríbelo con todos los detalles que puedas.",
      "¿Cómo describirías el ambiente emocional de tu casa en esta etapa?",
      "¿Quiénes eran tus principales figuras de cuidado y cómo te tratabas con cada una?",
      "¿Qué sentías de forma recurrente: seguridad, miedo, soledad, alegría…?",
      "¿Hay algún momento (positivo o doloroso) que recuerdes con especial intensidad?",
    ],
  },
  {
    key: "ninez",
    label: "Niñez",
    rango: "7 — 12 años",
    edadMin: 7,
    intro: "Empieza a aparecer el mundo más allá de la familia: el cole, las amistades, los primeros juicios.",
    preguntas: [
      "¿Cómo era tu día a día (colegio, amistades, hobbies)?",
      "¿Tenías un lugar (físico o mental) donde te refugiabas?",
      "¿Te sentías visto y comprendido por los adultos? ¿Por quién sí, por quién no?",
      "¿Qué cambió en tu familia durante esta etapa?",
      "¿Qué te apasionaba? ¿Qué te frustraba?",
    ],
  },
  {
    key: "adolescencia",
    label: "Adolescencia",
    rango: "13 — 18 años",
    edadMin: 13,
    intro: "La etapa del torbellino: identidad, cuerpo, deseos, rupturas y descubrimientos.",
    preguntas: [
      "¿Cómo viviste los cambios físicos y emocionales de la pubertad?",
      "¿Hubo un primer amor o desengaño que te marcase?",
      "¿Qué tipo de amistades te rodeaban y qué buscabas en ellas?",
      "¿Tuviste conflictos importantes con tu familia o tu entorno?",
      "¿Qué decisiones tomaste en esta etapa que aún hoy te marcan?",
    ],
  },
  {
    key: "juventud",
    label: "Juventud",
    rango: "19 — 25 años",
    edadMin: 19,
    intro: "La salida al mundo: primeras libertades, primeras responsabilidades, primeras pérdidas elegidas.",
    preguntas: [
      "¿Qué empezaste a explorar fuera del nido familiar?",
      "¿Cómo viviste tu primer trabajo, primera vivienda o primer viaje sola/o?",
      "¿Qué relaciones significativas (amistades, parejas, mentores) hubo en esta etapa?",
      "¿Atravesaste alguna crisis de identidad o de propósito?",
      "¿Recuerdas un momento de gran libertad o, al contrario, de gran soledad?",
    ],
  },
  {
    key: "adultezTemprana",
    label: "Adultez temprana",
    rango: "26 — 35 años",
    edadMin: 26,
    intro: "La consolidación: lo que te toma, lo que sueltas, lo que se asienta y lo que se rompe.",
    preguntas: [
      "¿Qué responsabilidades asumiste en esta etapa?",
      "¿Hubo grandes decisiones (mudanzas, pareja estable, profesión, hijos)?",
      "¿Sigues conectado con tu esencia o sientes que te has perdido en algún punto?",
      "¿Has vivido pérdidas significativas? ¿Cómo las atravesaste?",
      "¿Qué se te ha hecho consciente sobre ti misma/o que antes no veías?",
    ],
  },
  {
    key: "adultez",
    label: "Adultez",
    rango: "36 — 50 años",
    edadMin: 36,
    intro: "Empiezan a verse los patrones: lo que repites sin querer y lo que sí quieres transformar.",
    preguntas: [
      "¿Qué papel ocupas hoy en tu familia y en tu sociedad?",
      "¿Qué patrones reconoces que llevas repitiendo desde hace años?",
      "¿Hay alguna área de tu vida (cuerpo, vínculos, trabajo) donde ya no quieres seguir igual?",
      "¿Qué te ha sorprendido de ti misma/o en esta etapa?",
      "¿Qué herencia familiar llevas (sana o no) y qué quieres hacer con ella?",
    ],
  },
  {
    key: "madurez",
    label: "Madurez",
    rango: "51 años en adelante",
    edadMin: 51,
    intro: "El momento de soltar, de soltarte y de transmitir.",
    preguntas: [
      "¿Qué legado quieres dejar a quienes te rodean?",
      "¿Qué cosas sientes que aún te quedan por resolver contigo misma/o?",
      "¿Qué has aprendido a soltar con los años?",
      "¿Cómo te llevas hoy con tu cuerpo y con tu propia mortalidad?",
      "¿Cuál sería tu mensaje para esa persona joven que fuiste?",
    ],
  },
];

export const etapaByKey = (key: string): Etapa | undefined =>
  ETAPAS.find((e) => e.key === key);

// Calcula la edad de un usuario dado su YYYY-MM-DD
export function calcularEdad(fechaNacimiento?: string | null): number | null {
  if (!fechaNacimiento) return null;
  const nac = new Date(fechaNacimiento);
  if (isNaN(nac.getTime())) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

// Filtra las etapas según la edad del usuario (solo las que ha vivido)
export function etapasParaEdad(edad: number | null): Etapa[] {
  if (edad == null) return ETAPAS; // si no sabemos su edad, las mostramos todas
  return ETAPAS.filter((e) => edad >= e.edadMin);
}
