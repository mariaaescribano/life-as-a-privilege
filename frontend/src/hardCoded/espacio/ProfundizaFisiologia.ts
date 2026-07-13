// ─────────────────────────────────────────────────────────────────────────
// NIVEL «PROFUNDIZA» de Fisiología (/metodo/fisiologia/profundiza).
// Contenido avanzado, todo abierto desde el principio. Cada TEMA es una página
// (plantilla MetodoFisiologiaTema): un cómic opcional «antes de empezar» + una
// rejilla de FICHAS (cajas) que, al pulsarlas, abren un modal con su explicación
// (mismo patrón que los Sistemas).
//
// María rellena aquí el texto/viñetas; el código no cambia por tema nuevo.
// Los temas con `fichas: []` se muestran como «en construcción».
// ─────────────────────────────────────────────────────────────────────────
import type { Vineta } from "../../components/metodo/ComicViewer";

// Una caja del tema: al pulsarla se abre el modal con su explicación.
export type Ficha = {
  key: string;
  nombre: string;
  /** Acento propio de la ficha (por defecto hereda el color del tema). */
  color?: string;
  /** Imagen opcional; si falta, se pinta la inicial del nombre. */
  foto?: string;
  /** Antetítulo pequeño en mayúsculas sobre el nombre (p.ej. «Motivación»). */
  eyebrow?: string;
  /** Explicación que aparece al abrir la ficha (uno o varios párrafos). */
  explicacion: string[];
};

export type TemaProfundiza = {
  /** Segmento de ruta: /metodo/fisiologia/profundiza/:key */
  key: string;
  label: string;
  /** Frase corta bajo el título en la tarjeta del hub. */
  resumen: string;
  /** Color de acento del tema. */
  color: string;
  /** Foto de la tarjeta del hub (pendiente; fallback a inicial). */
  foto: string;
  /** Bloque del hub donde se agrupa el tema. */
  grupo: string;
  /** Frase introductoria de la página del tema (bajo el header). */
  intro?: string;
  /** Pista de acción sobre la rejilla (por defecto «Pulsa cada caja…»). */
  pista?: string;
  /** Cómic que se ofrece «antes de empezar» (opcional). */
  comicIntro?: Vineta[];
  /** Las cajas del tema. Vacío = apartado en construcción. */
  fichas: Ficha[];
};

const FOTO = (k: string) => `/recorrido/fisiologia/profundiza/${k}.png`;
const NT = (k: string) => `/recorrido/fisiologia/profundiza/neurotransmisores/${k}.png`;

// ── Cómic «Cómo se sintetiza un neurotransmisor» ───────────────────────────
// Imágenes: /viñetas/fisiologia/neurotransmisores/nt1.png … nt6.png
// (mientras no existan, el ComicViewer pinta un placeholder «próximamente»).
const NEUROTRANSMISORES_SINTESIS: Vineta[] = [
  {
    src: "/viñetas/fisiologia/neurotransmisores/nt1.png",
    eyebrow: "La materia prima",
    paragraphs: [
      "Todo empieza en tu plato.",
      "Muchos neurotransmisores nacen de aminoácidos que sacas de la comida: el triptófano, la tirosina…",
      "Son los ladrillos con los que tu cerebro fabricará sus mensajeros.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurotransmisores/nt2.png",
    eyebrow: "La cadena de montaje",
    paragraphs: [
      "El aminoácido viaja hasta la neurona. Dentro, unas enzimas lo transforman paso a paso, como en una fábrica.",
      "Así la tirosina acaba convertida en dopamina; el triptófano, en serotonina.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurotransmisores/nt3.png",
    eyebrow: "Guardados y listos",
    paragraphs: [
      "El neurotransmisor recién fabricado se guarda en pequeñas bolsas: las vesículas.",
      "Esperan cargadas en el extremo de la neurona, listas para disparar.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurotransmisores/nt4.png",
    eyebrow: "La chispa",
    paragraphs: [
      "Llega un impulso eléctrico.",
      "Las vesículas se fusionan con la membrana y liberan el neurotransmisor al pequeño espacio entre dos neuronas: la sinapsis.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurotransmisores/nt5.png",
    eyebrow: "El mensaje",
    paragraphs: [
      "El neurotransmisor cruza y encaja en su receptor, como una llave en su cerradura.",
      "Ese encaje ES el mensaje: la neurona siguiente lo recibe y reacciona.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurotransmisores/nt6.png",
    eyebrow: "Apagar y reciclar",
    paragraphs: [
      "Después, el mensaje se apaga.",
      "Parte del neurotransmisor se recicla de vuelta a la neurona (recaptación) y parte se degrada.",
      "Todo queda limpio para el siguiente pensamiento.",
    ],
  },
];

// ── Las fichas de Neurotransmisores ────────────────────────────────────────
const NEUROTRANSMISORES: Ficha[] = [
  {
    key: "dopamina", nombre: "Dopamina", color: "#f2c86b", foto: NT("dopamina"),
    eyebrow: "Motivación y recompensa",
    explicacion: [
      "Es el neurotransmisor del «quiero eso». Impulsa la motivación, el deseo y la sensación de recompensa cuando consigues algo que te importa.",
      "Cuándo lo notas: esa chispa de ganas al empezar un proyecto, el subidón al lograr una meta o el tirón de las notificaciones del móvil.",
    ],
  },
  {
    key: "serotonina", nombre: "Serotonina", color: "#9fe6b8", foto: NT("serotonina"),
    eyebrow: "Ánimo y calma",
    explicacion: [
      "Regula el estado de ánimo, la calma y la sensación de bienestar tranquilo. También influye en el sueño y en la digestión (buena parte se fabrica en el intestino).",
      "Cuándo la notas: esa paz serena tras un paseo al sol, sentirte a gusto contigo mismo, dormir bien.",
    ],
  },
  {
    key: "gaba", nombre: "GABA", color: "#a7d9f2", foto: NT("gaba"),
    eyebrow: "El freno",
    explicacion: [
      "Es el principal freno del cerebro: calma la actividad de las neuronas para que todo no se dispare a la vez.",
      "Cuándo lo notas: cuando por fin te relajas, bajas revoluciones y la mente deja de correr. Poco GABA se siente como ansiedad y tensión.",
    ],
  },
  {
    key: "glutamato", nombre: "Glutamato", color: "#f28b8b", foto: NT("glutamato"),
    eyebrow: "El acelerador",
    explicacion: [
      "El opuesto del GABA: es el principal excitador. Activa las neuronas y es clave para el aprendizaje y la memoria.",
      "Cuándo lo notas: cuando estás despierto, atento y aprendiendo algo nuevo. El equilibrio entre glutamato (acelerador) y GABA (freno) mantiene tu cerebro afinado.",
    ],
  },
  {
    key: "acetilcolina", nombre: "Acetilcolina", color: "#c9a7ff", foto: NT("acetilcolina"),
    eyebrow: "Músculo y memoria",
    explicacion: [
      "Une el cerebro con los músculos: cada vez que mueves un dedo, es la acetilcolina la que da la orden. Además es esencial para la atención y la memoria.",
      "Cuándo la notas: en cada movimiento voluntario, y cuando estás concentrado y con la mente despierta.",
    ],
  },
  {
    key: "noradrenalina", nombre: "Noradrenalina", color: "#f2b48f", foto: NT("noradrenalina"),
    eyebrow: "Alerta y foco",
    explicacion: [
      "Te pone en modo alerta: sube la atención, la energía y la respuesta al estrés. Es prima de la adrenalina, pero actúa dentro del cerebro.",
      "Cuándo la notas: ante un susto o un reto, cuando el corazón se acelera y de repente lo ves todo más nítido y enfocado.",
    ],
  },
  {
    key: "endorfinas", nombre: "Endorfinas", color: "#e6a7d9", foto: NT("endorfinas"),
    eyebrow: "Alivio y euforia",
    explicacion: [
      "Son los analgésicos naturales del cuerpo: reducen el dolor y producen una sensación de euforia y alivio.",
      "Cuándo las notas: el «subidón del corredor» tras el ejercicio, la risa, o ese bienestar cálido después de un buen esfuerzo.",
    ],
  },
  {
    key: "oxitocina", nombre: "Oxitocina", color: "#b8d98f", foto: NT("oxitocina"),
    eyebrow: "Vínculo y confianza",
    explicacion: [
      "La llaman «la hormona del apego». Actúa también como mensajero cerebral y refuerza la confianza, el cariño y los vínculos con los demás.",
      "Cuándo la notas: en un abrazo largo, al acariciar a tu mascota, al sentirte cerca de alguien de quien te fías.",
    ],
  },
];

// ═════════════════════════════════════════════════════════════════════════
// Los 12 temas de PROFUNDIZA, agrupados en 3 bloques para el hub.
// Solo Neurotransmisores está completo; el resto son stubs (fichas: []) que se
// mostrarán como «en construcción» hasta que María pase el contenido.
// ═════════════════════════════════════════════════════════════════════════
export const GRUPOS_PROFUNDIZA = [
  "Química interna",
  "El código y la limpieza",
  "Vida y muerte celular",
] as const;

export const TEMAS_PROFUNDIZA: TemaProfundiza[] = [
  // ── Bloque 1 · Química interna ──
  {
    key: "neurotransmisores",
    label: "Neurotransmisores",
    resumen: "Los mensajeros de tu cerebro.",
    color: "#c9a7ff",
    foto: FOTO("neurotransmisores"),
    grupo: "Química interna",
    intro: "Pequeñas moléculas que llevan un mensaje de una neurona a otra. Antes de conocerlos, mira cómo tu cuerpo los fabrica.",
    comicIntro: NEUROTRANSMISORES_SINTESIS,
    fichas: NEUROTRANSMISORES,
  },
  {
    key: "hormonas",
    label: "Hormonas",
    resumen: "Mensajeros que viajan por la sangre.",
    color: "#e6a7d9",
    foto: FOTO("hormonas"),
    grupo: "Química interna",
    intro: "Si los neurotransmisores hablan al oído, las hormonas gritan por megafonía: viajan por la sangre a todo el cuerpo. Aquí las veremos por el órgano que las secreta.",
    comicIntro: [], // «Cómo se sintetiza una hormona» — pendiente
    fichas: [], // en construcción: se agruparán por glándula (hipófisis, tiroides, suprarrenal, páncreas, gónadas, pineal)
  },
  {
    key: "metabolismo",
    label: "Metabolismo",
    resumen: "De lo que comes a la energía.",
    color: "#f2c86b",
    foto: FOTO("metabolismo"),
    grupo: "Química interna",
    intro: "El conjunto de reacciones que convierten la comida en energía (ATP) y en materiales para construirte.",
    fichas: [],
  },

  // ── Bloque 2 · El código y la limpieza ──
  {
    key: "epigenetica",
    label: "Expresión génica y epigenética",
    resumen: "Mismo ADN, células distintas.",
    color: "#a7d9f2",
    foto: FOTO("epigenetica"),
    grupo: "El código y la limpieza",
    intro: "Una neurona y un hepatocito tienen el MISMO ADN, pero funciones opuestas. ¿Cómo? Encendiendo y apagando genes distintos.",
    fichas: [],
  },
  {
    key: "detoxificacion",
    label: "Detoxificación del hígado",
    resumen: "Cómo limpia tu cuerpo lo que no sirve.",
    color: "#f2b48f",
    foto: FOTO("detoxificacion"),
    grupo: "El código y la limpieza",
    intro: "Tu hígado desactiva medicamentos, alcohol y toxinas en dos fases y los prepara para eliminarlos.",
    fichas: [],
  },
  {
    key: "estres-oxidativo",
    label: "Estrés oxidativo y antioxidantes",
    resumen: "Radicales libres y cómo te defiendes.",
    color: "#f28b8b",
    foto: FOTO("estres-oxidativo"),
    grupo: "El código y la limpieza",
    intro: "Cuando te da el sol o generas energía, aparecen radicales libres que dañan las células. Tu cuerpo tiene su propio ejército antioxidante.",
    fichas: [],
  },

  // ── Bloque 3 · Vida y muerte celular ──
  {
    key: "inmunitario",
    label: "Sistema inmunitario",
    resumen: "El baile entre las células.",
    color: "#9fe6b8",
    foto: FOTO("inmunitario"),
    grupo: "Vida y muerte celular",
    intro: "Cuando entra un patógeno, tus defensas responden por oleadas, coordinándose como en una coreografía.",
    fichas: [],
  },
  {
    key: "envejecimiento",
    label: "Envejecimiento celular",
    resumen: "Telómeros, senescencia y desgaste.",
    color: "#e8e0cf",
    foto: FOTO("envejecimiento"),
    grupo: "Vida y muerte celular",
    intro: "Por qué las células envejecen: el reloj de los telómeros, las células que se «jubilan» y el desgaste oxidativo.",
    fichas: [],
  },
  {
    key: "apoptosis",
    label: "Apoptosis y necrosis",
    resumen: "Las dos formas de morir de una célula.",
    color: "#c9a7ff",
    foto: FOTO("apoptosis"),
    grupo: "Vida y muerte celular",
    intro: "Una célula puede apagarse de forma ordenada y programada (apoptosis) o morir de golpe por una lesión (necrosis). No es lo mismo.",
    fichas: [],
  },
  {
    key: "regeneracion",
    label: "Regeneración",
    resumen: "Cuando te haces una herida.",
    color: "#f2b48f",
    foto: FOTO("regeneracion"),
    grupo: "Vida y muerte celular",
    intro: "Cómo tu cuerpo cierra una herida, paso a paso, hasta dejar apenas una cicatriz.",
    fichas: [],
  },
  {
    key: "homeostasis",
    label: "Homeostasis",
    resumen: "El cuerpo siempre buscando el equilibrio.",
    color: "#8fd0e6",
    foto: FOTO("homeostasis"),
    grupo: "Vida y muerte celular",
    intro: "Cómo tu cuerpo mantiene constantes la temperatura, la glucosa, el pH y la presión, pase lo que pase fuera.",
    fichas: [],
  },
  {
    key: "nervio-vago",
    label: "Nervio vago",
    resumen: "El cable que te calma.",
    color: "#b8d98f",
    foto: FOTO("nervio-vago"),
    grupo: "Vida y muerte celular",
    intro: "El nervio más largo del sistema nervioso autónomo: conecta el cerebro con el corazón, los pulmones y el intestino, y es la llave de la calma.",
    fichas: [],
  },
];

export function temaByKey(key: string): TemaProfundiza | undefined {
  return TEMAS_PROFUNDIZA.find((t) => t.key === key);
}
