import type { Vineta } from "../../components/metodo/ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// LOS CHAKRAS · penúltima parada del mapa de Ayurveda
// (/metodo/ayurveda/dosha/:dosha/chakras).
//
// Los chakras NO dependen del doṣha: son los mismos para Vata, Pitta y Kapha.
// La ruta cuelga de `/dosha/:dosha/` solo por herencia (igual que Prāṇāyāma y
// Cursos), para que el Índice sepa construir los enlaces.
//
// CADA CHAKRA SE CUENTA EN CÓMIC. No hay página por chakra: al pulsar su caja
// se abre su cómic a pantalla completa (ChakraComicModal), con su foto y su
// texto, y al terminarlo la caja se queda con la marquita de leído.
//
// El mapa se pinta con la persona a la izquierda y, a la derecha, la corona
// arriba del todo y los otros seis en tres filas de dos. Por eso el orden de
// `CHAKRAS_ORDEN` es DE ARRIBA ABAJO (corona → raíz): es el orden en el que se
// leen las cajas, no el número clásico del chakra (ese vive en `n`).
//
// LOS SIETE TEXTOS SON LOS DEFINITIVOS (de la autora), y todos llevan el mismo
// compás, así que las viñetas siempre parten por el mismo sitio:
//   · viñeta 1 — qué representa y qué pregunta (y de dónde viene el anterior)
//   · viñeta 2 — su desequilibrio
//   · viñeta 3 — el matiz, la invitación y sus preguntas
// El visor pinta TEXTO PLANO: no entiende **negritas**, así que el énfasis del
// original se sostiene con el corte de párrafo, que es lo que da el aire.
//
// Los nombres van en sánscrito académico (Mūlādhāra, Svādhiṣṭhāna…), como el
// resto de la casa; las claves en minúscula sin diacríticos son las de la BD y
// las de las fotos, y no se tocan.
//
// FOTOS · todas en /viñetas/hinduismo/chakras, numeradas por el número CLÁSICO
// del chakra (1 = raíz … 7 = corona), que es el campo `n`:
//   · botones/<n>.webp     el mandala recortado, la foto pequeña de su caja
//   · unoporuno/<n>.webp   la persona con ese chakra encendido: preside sus
//                          tres viñetas (hay una foto por chakra, no por
//                          viñeta; la escena se queda y el texto avanza)
//   · unoporuno/fotopantalla.webp   la persona con los siete, la del mapa
//   · comic/<i>.webp       las cuatro viñetas del cómic de entrada
//                          (en comicChakras.ts)
// ─────────────────────────────────────────────────────────────────────────

export type ChakraKey =
  | "sahasrara" | "ajna" | "vishuddha" | "anahata"
  | "manipura" | "svadhisthana" | "muladhara";

export interface Chakra {
  key: ChakraKey;
  /** Número clásico, de abajo arriba: 1 = raíz … 7 = corona. */
  n: number;
  /** Nombre en sánscrito académico (el que se ve grande). */
  nombre: string;
  /** Su nombre de siempre en castellano. */
  castellano: string;
  /** Color propio del chakra: el acento de su caja y de su cómic. */
  color: string;
  /** Una línea, la que va bajo el nombre en la caja del mapa. */
  frase: string;
  /** Sus tres señas: salen como claves rápidas en la primera viñeta. */
  claves: string[];
  /** Su cómic: el texto del chakra, viñeta a viñeta. */
  vinetas: Vineta[];
}

const FOTOS = "/viñetas/hinduismo/chakras";

/** El mandala del chakra: la foto pequeña y centrada de su caja en el mapa. */
export const chakraFoto = (k: ChakraKey): string => `${FOTOS}/botones/${CHAKRAS[k].n}.webp`;

/** La persona con ese chakra encendido. Es UNA por chakra, la misma en sus
 *  tres viñetas: la escena se queda quieta y lo que avanza es el texto. */
const foto = (n: number): string => `${FOTOS}/unoporuno/${n}.webp`;

export const CHAKRAS: Record<ChakraKey, Chakra> = {
  // ── 7 · CORONA ──────────────────────────────────────────────────────────
  sahasrara: {
    key: "sahasrara",
    n: 7,
    nombre: "Sahasrāra",
    castellano: "Chakra corona",
    // Su punto en el cómic de entrada es BLANCO (⚪). El blanco puro
    // desaparecería sobre la acuarela clara de las cajas, así que aquí es el
    // lila luminoso más pálido que todavía se ve: lee como luz, no como color.
    color: "#b9a8d9",
    frase: "La búsqueda de sentido",
    claves: ["Está en la coronilla", "Su elemento: la consciencia", "Su mantra: el silencio (Oṃ)"],
    vinetas: [
      {
        src: foto(7),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Sahasrāra representa la consciencia, la conexión, la trascendencia y la búsqueda de sentido.",
          "Es el punto más elevado del recorrido: después de explorar el cuerpo, las emociones, la voluntad, el amor, la expresión y la percepción, aparece una pregunta diferente: ¿qué significa todo esto?",
          "Buscamos comprender nuestra relación con algo más grande que nosotros mismos.",
        ],
      },
      {
        src: foto(7),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Su desequilibrio puede aparecer cuando nos desconectamos de la realidad buscando respuestas exclusivamente abstractas, o cuando sentimos vacío porque nuestra vida carece de significado.",
        ],
      },
      {
        src: foto(7),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Sahasrāra no representa necesariamente una respuesta definitiva, sino la capacidad de abrirnos a las preguntas que trascienden al ego.",
          "Nos invita a preguntarnos:",
          "¿Qué sentido tiene para mí estar aquí? ¿Puedo sentirme parte de algo más grande sin dejar de estar presente en mi propia vida?",
        ],
      },
    ],
  },

  // ── 6 · TERCER OJO ──────────────────────────────────────────────────────
  ajna: {
    key: "ajna",
    n: 6,
    nombre: "Ājñā",
    castellano: "Chakra del tercer ojo",
    // Violeta, como su punto en el cómic de entrada (🟣).
    color: "#7c5cbf",
    frase: "Ver más allá de tus reacciones",
    claves: ["Está entre las cejas", "Su elemento: la luz", "Su mantra: Oṃ"],
    vinetas: [
      {
        src: foto(6),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Ājñā representa la percepción, la intuición, la comprensión y la capacidad de observar más allá de lo evidente.",
          "Después de aprender a sentir y expresar lo que ocurre dentro de nosotros, aparece la posibilidad de observarlo con cierta distancia.",
          "Ya no se trata solo de qué siento, sino de comprender por qué lo siento, qué pensamientos están detrás y qué historias estoy construyendo sobre lo que me ocurre.",
        ],
      },
      {
        src: foto(6),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Su desequilibrio puede aparecer cuando confundimos nuestras interpretaciones con la realidad, quedamos atrapados en nuestros pensamientos o rechazamos aquello que no encaja con nuestra visión.",
        ],
      },
      {
        src: foto(6),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Desarrollar esta mirada implica aprender a cuestionar nuestras propias percepciones sin dejar de confiar en nuestra intuición.",
          "Ājñā nos invita a preguntarnos:",
          "¿Estoy viendo lo que realmente ocurre o lo que mi mente espera encontrar? ¿Puedo observar mis pensamientos sin convertirme en ellos?",
        ],
      },
    ],
  },

  // ── 5 · GARGANTA ────────────────────────────────────────────────────────
  vishuddha: {
    key: "vishuddha",
    n: 5,
    nombre: "Viśuddha",
    castellano: "Chakra de la garganta",
    color: "#2f7fa8",
    frase: "Decir quién soy y qué necesito",
    claves: ["Está en la garganta", "Su elemento: el éter", "Su mantra: Haṃ"],
    vinetas: [
      {
        src: foto(5),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Viśuddha representa la expresión, la comunicación, la verdad y la capacidad de dar voz a aquello que somos y sentimos.",
          "Después de aprender a sentir y conectar con el otro, aparece una nueva necesidad: expresarnos de manera auténtica.",
          "No se trata únicamente de hablar, sino de poder reconocer lo que pensamos y sentimos y encontrar la forma de comunicarlo sin traicionarnos.",
        ],
      },
      {
        src: foto(5),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Su desequilibrio puede aparecer cuando callamos por miedo al rechazo, escondemos nuestras necesidades o, al contrario, utilizamos la palabra para imponer o herir.",
        ],
      },
      {
        src: foto(5),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Expresarnos con autenticidad también implica escuchar y asumir que nuestra verdad no tiene por qué ser la única.",
          "Viśuddha nos invita a preguntarnos:",
          "¿Estoy diciendo lo que realmente siento? ¿Tengo miedo de mostrar quién soy cuando sé que los demás podrían no aceptarlo?",
        ],
      },
    ],
  },

  // ── 4 · CORAZÓN ─────────────────────────────────────────────────────────
  anahata: {
    key: "anahata",
    n: 4,
    nombre: "Anāhata",
    castellano: "Chakra del corazón",
    color: "#3a8a5c",
    frase: "Amar, conectar, perdonar",
    claves: ["Está en el centro del pecho", "Su elemento: el aire", "Su mantra: Yaṃ"],
    vinetas: [
      {
        src: foto(4),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Anāhata representa el amor, la conexión, la compasión, la aceptación y la capacidad de relacionarnos desde un lugar más allá del ego.",
          "Es el punto de transición del recorrido: después de construir seguridad, sentir y desarrollar nuestra voluntad, aparece la posibilidad de abrirnos al otro.",
          "Amar implica permitirnos ser vulnerables, pero también aprender a dar y recibir sin dejar de ser nosotros mismos.",
        ],
      },
      {
        src: foto(4),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Su desequilibrio puede aparecer como cerrarnos para no ser heridos, depender del afecto ajeno o confundir amor con sacrificio y pérdida de límites.",
        ],
      },
      {
        src: foto(4),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Abrir el corazón no significa decir que sí a todo ni dejar de protegernos; significa poder conectar sin abandonarnos.",
          "Anāhata nos invita a preguntarnos:",
          "¿Puedo amar sin poseer, recibir sin sentir que debo hacer algo y cuidar al otro sin dejar de cuidarme a mí?",
        ],
      },
    ],
  },

  // ── 3 · PLEXO SOLAR ─────────────────────────────────────────────────────
  manipura: {
    key: "manipura",
    n: 3,
    nombre: "Maṇipūra",
    castellano: "Chakra del plexo solar",
    color: "#d1a92b",
    frase: "Y entonces nace la voluntad",
    claves: ["Está en la boca del estómago", "Su elemento: el fuego", "Su mantra: Raṃ"],
    vinetas: [
      {
        src: foto(3),
        eyebrow:"",
        titulo: "",
        paragraphs: [
          "Maṇipūra representa la voluntad, la identidad, el poder personal, la autoestima y la capacidad de actuar.",
          "Si Mūlādhāra pregunta «¿estoy a salvo?» y Svādhiṣṭhāna «¿me permito sentir?», Maṇipūra pregunta: «¿quién soy y qué hago con mi Vida?».",
          "Es el impulso de pasar de experimentar el mundo a tomar decisiones, establecer límites y construir nuestra propia dirección.",
        ],
      },
      {
        src: foto(3),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Su desequilibrio puede aparecer como falta de confianza, dependencia de la aprobación externa o, en el extremo contrario, como necesidad de control, perfeccionismo y deseo de dominar.",
        ],
      },
      {
        src: foto(3),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "El verdadero poder personal no consiste en controlar todo lo que ocurre, sino en reconocer que no podemos elegir siempre lo que nos sucede, pero sí podemos trabajar en cómo respondemos.",
          "Maṇipūra nos invita a preguntarnos:",
          "¿Estoy viviendo desde mi propia voluntad o desde lo que los demás esperan de mí?",
        ],
      },
    ],
  },

  // ── 2 · SACRO ───────────────────────────────────────────────────────────
  svadhisthana: {
    key: "svadhisthana",
    n: 2,
    nombre: "Svādhiṣṭhāna",
    castellano: "Chakra sacro",
    color: "#d1743a",
    frase: "El deseo de sentir",
    claves: ["Está bajo el ombligo", "Su elemento: el agua", "Su mantra: Vaṃ"],
    vinetas: [
      {
        src: foto(2),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Svādhiṣṭhāna representa el deseo, el placer, las emociones, la creatividad y nuestra capacidad de relacionarnos con lo que sentimos.",
          "Si Mūlādhāra nos pregunta si estamos a salvo, Svādhiṣṭhāna nos pregunta si nos permitimos vivir: sentir placer, disfrutar, desear, crear y dejarnos transformar por nuestras experiencias.",
          "Aquí aparece una parte más fluida de nosotros, capaz de adaptarse y experimentar sin necesitar tenerlo todo bajo control.",
        ],
      },
      {
        src: foto(2),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Su desequilibrio puede aparecer tanto en la represión de lo que sentimos como en la búsqueda constante de estímulos para llenar un vacío.",
          "A veces aprendemos a desconfiar del placer, de nuestro cuerpo o de nuestras emociones porque sentimos que son demasiado intensas o difíciles de controlar.",
        ],
      },
      {
        src: foto(2),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Svādhiṣṭhāna nos invita a recuperar una relación más libre con nuestra sensibilidad y preguntarnos:",
          "¿Me permito sentir lo que siento? ¿Puedo disfrutar sin culpa y desear sin perderme en aquello que deseo?",
        ],
      },
    ],
  },

  // ── 1 · RAÍZ ────────────────────────────────────────────────────────────
  muladhara: {
    key: "muladhara",
    n: 1,
    nombre: "Mūlādhāra",
    castellano: "Chakra raíz",
    color: "#b23a2e",
    frase: "Necesito sentirme seguro",
    claves: ["Está en la base de la columna", "Su elemento: la tierra", "Su mantra: Laṃ"],
    vinetas: [
      {
        src: foto(1),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Mūlādhāra, «soporte de la raíz», representa el fundamento de nuestra existencia: seguridad, supervivencia, cuerpo, hogar y pertenencia.",
          "Es la necesidad de sentir que tenemos un lugar en el mundo y que podemos confiar, al menos lo suficiente, en nuestro entorno para bajar la guardia.",
        ],
      },
      {
        src: foto(1),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "También conecta con nuestras primeras experiencias: aquello que vivimos en la infancia puede influir en cómo buscamos seguridad, afecto y estabilidad en la vida adulta.",
          "Su desequilibrio aparece cuando el miedo a perder nuestra seguridad nos hace aferrarnos al control, a lo conocido o incluso a relaciones y situaciones que ya no nos hacen bien.",
        ],
      },
      {
        src: foto(1),
        eyebrow: "",
        titulo: "",
        paragraphs: [
          "Pero estar enraizado no significa que nada cambie; significa tener un lugar interno desde el que poder atravesar el cambio.",
          "Mūlādhāra nos invita a preguntarnos:",
          "¿Me siento seguro siendo quien soy? ¿Puedo confiar en la vida y en mi capacidad para sostenerme cuando las cosas cambian?",
        ],
      },
    ],
  },
};

/** Orden DEL MAPA: como se leen las cajas, de la corona a la raíz. */
export const CHAKRAS_ORDEN: ChakraKey[] = [
  "sahasrara", "ajna", "vishuddha", "anahata",
  "manipura", "svadhisthana", "muladhara",
];

/** La lista, ya ordenada de arriba abajo. */
export const CHAKRAS_LISTA: Chakra[] = CHAKRAS_ORDEN.map((k) => CHAKRAS[k]);

/** La persona con sus siete puntos, a la izquierda del mapa. */
export const CHAKRAS_PERSONA = `${FOTOS}/unoporuno/fotopantalla.webp`;

/** Lo que se lee arriba del mapa, sobre el turquesa. */
export const CHAKRAS_INTRO =
  "Los chakras son puntos de energía que conectan más intensamente a nuestro cuerpo con la energía que nos da Vida. Nuestra alma está conectada con todo nuestro cuerpo, pero en ciertos puntos la podemos sentir más. Esos puntos son los chakras.";

export const esChakra = (k: unknown): k is ChakraKey =>
  typeof k === "string" && k in CHAKRAS;

/** El siguiente de la lista (hacia abajo), o null si es el último. */
export const chakraSiguiente = (k: ChakraKey): Chakra | null => {
  const i = CHAKRAS_ORDEN.indexOf(k);
  return i >= 0 && i < CHAKRAS_ORDEN.length - 1 ? CHAKRAS[CHAKRAS_ORDEN[i + 1]] : null;
};

/** El anterior de la lista (hacia arriba), o null si es el primero. */
export const chakraAnterior = (k: ChakraKey): Chakra | null => {
  const i = CHAKRAS_ORDEN.indexOf(k);
  return i > 0 ? CHAKRAS[CHAKRAS_ORDEN[i - 1]] : null;
};
