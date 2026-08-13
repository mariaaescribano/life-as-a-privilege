// ─────────────────────────────────────────────────────────────────────────
// EL CONTENIDO DEL RECORRIDO DE PSICOLOGÍA, EN INGLÉS.
//
// Aquí va SOLO el texto. La estructura (las `key`, el orden, los colores, los
// mínimos y máximos de las bandas, las edades de las etapas) vive únicamente en
// `psicologiaRecorrido.ts`: si se duplicara, bastaría cambiar un umbral en un
// idioma y no en el otro para que el mismo test diera resultados distintos
// según el idioma.
//
// Lo que falte aquí se lee en español, pieza a pieza (ver los hooks del final).
// Se puede ir traduciendo página a página sin que nada se rompa.
//
// AL TRADUCIR:
//  · Es el texto más delicado del Mapa: habla de la infancia y de la herida de
//    quien lee. Segunda persona, contracciones naturales, frases cortas. Nunca
//    clínico ni de manual — «wounds», no "traumas"; «you», nunca "one".
//  · «la Vida» con mayúscula es intencionada en el español: se queda "Life".
//  · Las preguntas del ACE son las 10 originales del estudio CDC-Kaiser. En
//    inglés NO se retraducen del español: se vuelve a la redacción del
//    cuestionario original, que es la que la gente reconoce.
//  · Sin marca de género. El español usa «solo/a», «querido/a»; el inglés no lo
//    necesita y no se inventa un equivalente.
// ─────────────────────────────────────────────────────────────────────────

import { getIdioma, useIdioma } from "../../i18n";
import {
  ACE_BANDAS,
  ACE_CONSECUENCIAS,
  ACE_ESPERANZA,
  ACE_INTRO,
  ACE_PREGUNTAS,
  APRENDIZAJES_SUGERIDOS,
  DES_BANDAS,
  DES_ESPERANZA,
  DES_INTRO,
  DES_PREGUNTAS,
  DONES_INTRO,
  DONES_PREGUNTAS,
  ESTADOS_NECESIDAD,
  ETAPAS_VITALES,
  EXPERIENCIAS,
  FAMILIA,
  GENOGRAMA,
  GENOGRAMA_PREGUNTAS,
  HERIDAS_LISTA,
  INTEGRACION,
  MIEDOS,
  MIEDOS_ENFRENTAR_INTRO,
  MIEDOS_PREGUNTAS,
  NECESIDADES,
  NECESIDADES_INTRO,
  NUDOS,
  PREGUNTAS_GESTACION,
  REGULACION,
  aceBanda,
  desBanda,
  desSubescalas,
  experienciaById,
  preguntasDeAno,
  type AceBanda,
  type DesBanda,
  type EtapaVital,
  type ExperienciaPsicologia,
  type LineaDeVidaData,
  type Necesidad,
  type OpcionNecesidad,
  type Pregunta,
  type PreguntaAce,
  type PreguntaDes,
  type PreguntaDon,
  type PreguntaMiedo,
  type SubescalaDes,
} from "./psicologiaRecorrido";

// ── Tipos del texto: solo prosa, emparejada por la `key` del español ────────

/** Lo único que se traduce de una pregunta: su enunciado y sus apoyos. */
type PreguntaTexto = { pregunta?: string; apoyo?: string; placeholder?: string; ejemplos?: string[] };
type PorClave = Record<string, PreguntaTexto>;

// ═══════════════════════════════════════════════════════════════════════════
// LA EXPERIENCIA · «Línea de Vida»
// ═══════════════════════════════════════════════════════════════════════════

const EXPERIENCIA_EN: Record<
  string,
  { titulo?: string; subtitulo?: string; intro?: string; problemaInicial?: PreguntaTexto; preguntaEdad?: PreguntaTexto; preguntasPorAno?: PorClave }
> = {
  "linea-de-Vida": {
    titulo: "Life Line",
    subtitulo: "Your story, told by you",
    intro:
      "Before you can understand the mind, you have to remember the Life that shaped it. This first experience is for rebuilding your story: not as a questionnaire, but the way someone writes the first pages of their own book. Nobody else will read this. It's for you.",
    problemaInicial: {
      pregunta: "What's troubling you right now?",
      placeholder: "I'm here because…",
    },
    preguntaEdad: {
      pregunta: "How old are you?",
      apoyo: "With your age we'll draw your Life line, from the day you were born until today.",
      placeholder: "Your age",
    },
    preguntasPorAno: {
      recuerdas: { pregunta: "What do you remember about this year?" },
      importante: { pregunta: "Who or what mattered to you? Did something important happen? (an illness, a death, a friendship…)" },
      gustaba: { pregunta: "What did you love? How did you enjoy yourself?" },
      experiencias: { pregunta: "Do you remember any particular experience?" },
      sentias: { pregunta: "How were you feeling?" },
      cambio: { pregunta: "What changed?" },
      dejo: { pregunta: "What did this year leave in you?" },
      "algo-mas": { pregunta: "Anything else you'd like to add…" },
    },
  },
};

// ── La gestación (el nodo −1 de la línea) ──────────────────────────────────
// Aquí no se recuerda: se cuenta lo que se sabe o lo que se imagina.
const GESTACION_EN: PorClave = {
  deseado: { pregunta: "Were you a planned pregnancy, a wanted one, an unexpected one…? What have you been told?" },
  madre: { pregunta: "How did your mother go through the pregnancy? How was she, in spirits and in health?" },
  entorno: { pregunta: "What was going on around her? (your parents' relationship, the family, the moment they were living…)" },
  nacimiento: { pregunta: "What do you know about your birth? (how the delivery went, where, who was waiting for you…)" },
  recibimiento: { pregunta: "How were you welcomed into the world?" },
  "algo-mas": { pregunta: "Anything else you know or imagine about that time…" },
};

// ═══════════════════════════════════════════════════════════════════════════
// LA FAMILIA · «Tu familia» (paso 6) y «Genograma» (paso 7)
// ═══════════════════════════════════════════════════════════════════════════

const GENOGRAMA_EN = {
  titulo: "Genogram",
  intro:
    "Here's your whole family. Tap each person and write what you know and what you feel about them: what they gave you, what you missed, and what you think they were carrying. You can keep adding anyone who's missing.",
  yo: "You",
  // Los parentescos van por POSICIÓN, en el mismo orden que el español: son
  // sugerencias pulsables, no claves de guardado.
  parentescos: [
    "Mother", "Father", "Sister", "Brother",
    "Maternal grandmother", "Maternal grandfather", "Paternal grandmother", "Paternal grandfather",
    "Partner", "Daughter", "Son", "Aunt", "Uncle", "Cousin (f)", "Cousin (m)",
    "Stepmother", "Stepfather", "Whoever raised me",
  ],
};

const FAMILIA_EN = {
  titulo: "Your family",
  intro:
    "Start with yourself, in the center, and place your family around you: above, the ones who came before you; to the sides, the ones who grew up with you. Then choose, for each of them, the character or the animal they look like: sometimes an image says what we don't know how to name.",
  eligeTitulo: "Who do they look like?",
  eligeApoyo:
    "Choose the character or the animal you associate with this person. You can pick up to two. Don't think about it too much: go with the first one that comes to you.",
};

const GENOGRAMA_PREGUNTAS_EN: PorClave = {
  quien: { pregunta: "Who are they, or who were they, to you?", placeholder: "They're my…" },
  relacion: { pregunta: "What is (or what was) your relationship like?", placeholder: "With them I feel…" },
  recuerdo: { pregunta: "What's the first memory of this person that comes to you?", placeholder: "I remember…" },
  aprendi: { pregunta: "What did you learn from them, for better or worse?", placeholder: "I learned that…" },
  falto: { pregunta: "What did they give you, and what did you miss from them?", placeholder: "They gave me… and I missed…" },
  cargaba: { pregunta: "What do you think this person was carrying? (their own story, their own wounds)", placeholder: "I think they were carrying…" },
  parecido: { pregunta: "How are you like them, and how do you not want to be like them?", placeholder: "I'm like them in…" },
  pendiente: { pregunta: "Is there something you'd like to say to them and never did?", placeholder: "I'd like to tell them…" },
  "algo-mas": { pregunta: "Anything else you'd like to say about them…" },
};

// ═══════════════════════════════════════════════════════════════════════════
// «Los Nudos», «Tus heridas» y «La Integración»
// ═══════════════════════════════════════════════════════════════════════════

const NUDOS_EN = {
  titulo: "Knots",
  apoyo:
    "A knot isn't always rational, and it doesn't have to be. It can be a fear, a wound, a belief, a conflict that keeps repeating or a difficulty that seems to have been with you for years. Don't look for perfect explanations. Just notice what you feel is present in your Life today.",
  pregunta: "Which knots are running your Life and keeping you from moving forward?",
  ejemplos: [
    "Fear of abandonment",
    "Needing approval",
    "Finding it hard to trust",
    "Perfectionism",
    "Too much control",
    "Fear of rejection",
    "Feeling not enough",
    "Finding it hard to set limits",
    "Emotional dependence",
    "Fear of conflict",
  ],
};

const HERIDAS_LISTA_EN = {
  titulo: "Your wounds",
  frase:
    "These are the wounds that have marked your story. Now you can start healing them, until they turn into scars.",
};

const INTEGRACION_EN = {
  titulo: "Integration",
  principal: [
    "You've walked through your story.",
    "You've identified the experiences that left a mark.",
    "You've begun to recognize the knots that are still present in your Life.",
    "Now it's time to put the pieces together.",
  ],
  secundario: [
    "Sometimes we see our experiences one by one. But when we look at the whole story, connections start to appear that went unnoticed before.",
    "In this session we'll explore together the relationship between your personal story, your psychological patterns and the archetypes present in your birth chart.",
  ],
  exploraremos: [
    "The knots that show up in your Life today.",
    "The experiences that helped form them.",
    "The way those patterns keep repeating now.",
    "The psychological mechanisms keeping them active.",
    "The astrological archetypes related to those processes.",
    "The evolutionary purpose they may be pointing to.",
    "Possible paths of integration and transformation.",
  ],
  cierre: [
    "It isn't only about understanding what happened to you.",
    "It's about understanding who you were forced to become because of those experiences.",
    "And discovering who you could become when those knots start to come undone.",
  ],
  boton: "Book an Integration Session",
};

/** «Síntesis del Camino» — las esencias sugeridas, POR POSICIÓN. */
const APRENDIZAJES_EN = [
  "Self-acceptance",
  "Trust",
  "Authenticity",
  "Courage",
  "Self-love",
  "Freedom",
  "Presence",
  "Patience",
];

// ═══════════════════════════════════════════════════════════════════════════
// «Las Necesidades del Niño»
// ═══════════════════════════════════════════════════════════════════════════

const NECESIDADES_INTRO_EN = {
  titulo: "Needs that went unmet",
  subtitulo:
    "What did you need and not receive? Each cell is one need. When one of them goes unmet, it can hurt so much that it seems to wipe out the ones that were met.",
  texto:
    "You've already remembered your story and named your knots. Stop now at what a child needs in order to grow up well: open each need and, without judging anyone, mark how you lived it. There are no right answers: only your truth.",
};

const NECESIDADES_EN: Record<string, { necesidad?: string; respuesta?: string }> = {
  "seguridad-fisica": { necesidad: "Physical safety", respuesta: "They keep the child out of danger, they supervise, and they cover food, hygiene, rest and health." },
  "seguridad-emocional": { necesidad: "Emotional safety", respuesta: "They comfort the child in fear, sadness or frustration. They make them feel they aren't alone." },
  "apego-vinculo": { necesidad: "Attachment and bonding", respuesta: "They show affection with words and with touch, they're emotionally available and they stay close." },
  "amado-valorado": { necesidad: "Feeling loved and valued", respuesta: "They express unconditional affection and recognize the child's worth as a person." },
  "atencion-presencia": { necesidad: "Attention and presence", respuesta: "They listen actively, they give one-on-one time and they show genuine interest." },
  "comprension-emocional": { necesidad: "Emotional understanding", respuesta: "They help the child identify and name emotions without making fun of them." },
  "validacion-emocional": { necesidad: "Emotional validation", respuesta: "They accept the child's emotions even while correcting inappropriate behavior." },
  "estructura-limites": { necesidad: "Structure and limits", respuesta: "They set rules that are clear, consistent and predictable." },
  "orientacion-ensenanza": { necesidad: "Guidance and teaching", respuesta: "They explain consequences, teach skills and set an example." },
  autonomia: { necesidad: "Autonomy", respuesta: "They let the child make age-appropriate decisions and they encourage initiative." },
  "competencia-autoestima": { necesidad: "Competence and self-esteem", respuesta: "They recognize effort and make room for experiences of success and learning." },
  "juego-exploracion": { necesidad: "Play and exploration", respuesta: "They make room for playing, discovering and trying things out." },
  participacion: { necesidad: "Participation", respuesta: "They listen to the child's opinion and take it into account in age-appropriate decisions." },
  "proteccion-violencia": { necesidad: "Protection from violence", respuesta: "They avoid humiliation, threats and physical or psychological aggression." },
  "estabilidad-predictibilidad": { necesidad: "Stability and predictability", respuesta: "They keep routines and respond in a reasonably consistent way." },
  "apoyo-dificultades": { necesidad: "Support in hard times", respuesta: "They help when the child fails, makes a mistake or runs into trouble." },
  "pertenencia-familiar": { necesidad: "Belonging in the family", respuesta: "They help the child feel like an important member of the family." },
  "desarrollo-social": { necesidad: "Social development", respuesta: "They teach empathy, cooperation and the skills for relating to others." },
};

/** Las tres respuestas, POR `value` (el value NO se traduce: se guarda). */
const ESTADOS_NECESIDAD_EN: Record<string, { label?: string; descripcion?: string }> = {
  recibida: { label: "I got it", descripcion: "I felt this need was met." },
  "a-veces": { label: "Sometimes", descripcion: "Sometimes yes, sometimes no." },
  falto: { label: "I missed it", descripcion: "I felt it was missing." },
};

// ═══════════════════════════════════════════════════════════════════════════
// «Las Huellas» · las etapas de la Vida
// ═══════════════════════════════════════════════════════════════════════════

const ETAPAS_EN: Record<string, string> = {
  "primera-infancia": "Early childhood",
  infancia: "Childhood",
  adolescencia: "Adolescence",
  juventud: "Youth",
  "adultez-temprana": "Early adulthood",
  adultez: "Adulthood",
};

// ═══════════════════════════════════════════════════════════════════════════
// «Dones»
// ═══════════════════════════════════════════════════════════════════════════

const DONES_INTRO_EN = {
  titulo: "Your gifts",
  preguntas:
    "A gift isn't what you learned the hard way: it's what comes naturally to you, the thing other people value in you even when you don't think much of it. Don't look for the perfect answer. Answer slowly, honestly. Nobody else will read this.",
  espejo:
    "Connect what you remembered about yourself with your archetypes. That's how you'll find your strengths. Don't forget what you already are and everything you're already capable of.",
};

const DONES_PREGUNTAS_EN: PorClave = {
  "don-actividad-horas": { pregunta: "What could you do for hours without getting bored?" },
  "don-problemas-ayuda": { pregunta: "What kinds of problems do people usually ask you to help solve?" },
  "don-nino-facil": { pregunta: "What came easily to you as a child or a teenager, even without much effort?" },
  "don-en-tu-elemento": { pregunta: "When do you feel you're “in your element”?" },
  "don-elogios": { pregunta: "What compliments do you get most often?" },
  "don-aprendes-rapido": { pregunta: "What do you learn faster than most people?" },
  "don-curiosidad": { pregunta: "What subjects keep making you curious, again and again?" },
  "don-sin-dinero": { pregunta: "If money weren't a problem, how would you spend your days?" },
  "don-energia": { pregunta: "Which situations fill you with energy, and which ones drain it?" },
  "don-proposito": { pregunta: "What cause or purpose moves you deeply?" },
  "don-habilidades-dificil": { pregunta: "What skills have you developed thanks to hard experiences?" },
  "don-compania": { pregunta: "What kind of people most enjoy your company, and why?" },
  "don-facil-para-ti": { pregunta: "What do you do that looks easy for you, but others find complicated?" },
  "don-mas-orgulloso": { pregunta: "What's the moment in your Life you've felt proudest of yourself?" },
  "don-huella-mundo": { pregunta: "If you could leave a mark on the world, what would you like people to remember about you?" },
};

// ═══════════════════════════════════════════════════════════════════════════
// «Miedos» · nombrarlos y enfrentarlos
// ═══════════════════════════════════════════════════════════════════════════

const MIEDOS_EN = {
  titulo: "Fears",
  pregunta: "What are your deepest fears?",
  apoyo:
    "A fear isn't always rational, and it doesn't have to be. Write what actually frightens you, exactly as it comes, without justifying it or softening it. Nobody else is going to read it.",
  ejemplos: [
    "Being left alone",
    "Not being enough",
    "Failing",
    "Being abandoned",
    "Something happening to someone I love",
    "Rejection",
    "Losing control",
    "Illness",
    "Not being loved as I am",
    "Never finding my place",
  ],
};

const MIEDOS_ENFRENTAR_INTRO_EN = {
  titulo: "Face your fears",
  intro: "Behind our fears are our greatest gifts",
};

const MIEDOS_PREGUNTAS_EN: PorClave = {
  concreta: {
    pregunta: "What exactly are you afraid will happen?",
    apoyo: "Give it a concrete name, not an abstract one.",
    placeholder: "What I'm really afraid of is…",
    ejemplos: [
      "That someone I love gets ill",
      "That I'll be left alone",
      "That they'll stop loving me",
      "That I won't get there in time",
    ],
  },
  peor: {
    pregunta: "If it came true, what's the worst that could happen?",
    placeholder: "The worst would be…",
    ejemplos: [
      "That I couldn't bear it",
      "That I'd fall apart and never get up",
      "That I'd be left with no one",
      "That nothing would make sense again",
    ],
  },
  probabilidad: {
    pregunta: "How likely do you really think it is to happen?",
    apoyo: "From 0 to 100%. Be honest with yourself, not with your fear.",
    placeholder: "I think…",
    ejemplos: ["Very low, under 10%", "About 30%", "About 50%", "High, over 70%"],
  },
  cambio: {
    pregunta: "If it happened, how would your Life really change?",
    placeholder: "My Life would change in that…",
    ejemplos: [
      "It would hurt, but I'd still be me",
      "I'd have to start over",
      "It would change for a while and then I'd adapt",
      "Less than my fear tells me",
    ],
  },
  afrontar: {
    pregunta: "How would you face it? What strengths, people or resources would you count on?",
    placeholder: "I could lean on…",
    ejemplos: [
      "My family",
      "My friends",
      "Asking a professional for help",
      "Everything I've already come through",
    ],
  },
  compasion: {
    pregunta: "What would you say to someone you love if they had this same fear?",
    apoyo: "Talk to yourself with that same kindness.",
    placeholder: "I'd tell them…",
    ejemplos: [
      "That they're not alone",
      "That their fear makes sense",
      "That they can handle this",
      "That I'd be right beside them",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// «ACE» · Adverse Childhood Experiences
//
// Las 10 preguntas vuelven a la redacción del cuestionario original (Felitti &
// Anda, 1998). No se retraducen del español: es el texto que la gente reconoce,
// y su sentido clínico depende de cómo está escrito.
// ═══════════════════════════════════════════════════════════════════════════

const ACE_INTRO_EN = {
  titulo: "Adverse childhood experiences",
  subtitulo: "The ACE test",
  que: [
    "«ACE» stands for Adverse Childhood Experiences. It comes out of one of the largest health studies ever carried out (CDC-Kaiser, more than 17,000 people), which found something as simple as it is revealing: what we live through as children leaves a real mark on our health and on our adult Life.",
    "The test is 10 yes-or-no questions about what happened in your home before you turned 18: abuse, neglect and household dysfunction. Each «yes» adds a point, from 0 to 10. It doesn't measure who you are or what you're worth: it only puts a name to what you carried.",
    "Answer calmly and honestly. Nobody else will see it. And remember one thing before you start: a high score isn't a sentence — it's precisely the starting point of this map.",
  ],
  subtituloTurquesa: "Before you turned 18, did any of these happen in your home?",
};

const ACE_PREGUNTAS_EN: Record<string, { categoria?: string; pregunta?: string; apoyo?: string }> = {
  "ace-1-maltrato-emocional": {
    categoria: "Emotional abuse",
    pregunta: "Did a parent or another adult in the household often swear at you, insult you, put you down, or act in a way that made you afraid you might be physically hurt?",
  },
  "ace-2-maltrato-fisico": {
    categoria: "Physical abuse",
    pregunta: "Did a parent or another adult in the household often push, grab, slap or hit you hard enough to leave marks or injure you?",
  },
  "ace-3-abuso-sexual": {
    categoria: "Sexual abuse",
    pregunta: "Did an adult, or anyone at least 5 years older than you, ever touch you in a sexual way, or try to have or actually have sexual contact with you?",
  },
  "ace-4-abandono-emocional": {
    categoria: "Emotional neglect",
    pregunta: "Did you often feel that no one in your family loved you or thought you were important, or that your family didn't look out for or support each other?",
  },
  "ace-5-abandono-fisico": {
    categoria: "Physical neglect",
    pregunta: "Did you often feel that you didn't have enough to eat, that you were dirty or without proper clothes, or that there was no one to protect you?",
    apoyo: "It also counts if your parents were too affected (by alcohol, drugs or illness) to take care of you or take you to the doctor.",
  },
  "ace-6-separacion": {
    categoria: "Separation or divorce",
    pregunta: "Were your parents ever separated or divorced?",
  },
  "ace-7-violencia-hogar": {
    categoria: "Violence in the home",
    pregunta: "Did you see your mother (or the woman who raised you) being pushed, grabbed, slapped or hit, or being threatened?",
  },
  "ace-8-adicciones": {
    categoria: "Addiction in the home",
    pregunta: "Did you live with anyone who had a problem with alcohol or who used drugs?",
  },
  "ace-9-enfermedad-mental": {
    categoria: "Mental health in the home",
    pregunta: "Did you live with anyone who was depressed or had another mental illness, or who tried to take their own Life?",
  },
  "ace-10-carcel": {
    categoria: "Prison in the home",
    pregunta: "Did a member of your household ever go to prison?",
  },
};

/** Las tres bandas, POR ETIQUETA (el `min`/`max` no se duplica nunca). */
const ACE_BANDAS_EN: Record<string, { titulo?: string; texto?: string }> = {
  "0": {
    titulo: "No adverse experiences recorded",
    texto:
      "According to the test, your childhood was relatively free of these particular adversities. That's a valuable foundation. Even so, no Life is free of wounds: this map is still for you, because pain doesn't always fit into ten questions.",
  },
  "1–3": {
    titulo: "Moderate adversity",
    texto:
      "You lived through some adverse experiences. That's the most common result: most people add up a few. With support and personal work — like the work you're doing here — their effect can be tended to, understood and healed.",
  },
  "4+": {
    titulo: "High adversity",
    texto:
      "You carried several adverse experiences, almost certainly more weight than you deserved. Studies link a score of 4 or higher with a greater risk to physical and emotional health. But hear this clearly: it's a risk, not a destiny. Recognizing it, the way you're doing now, is the first step toward integrating the experience into your story so it stops affecting your health.",
  },
};

const ACE_CONSECUENCIAS_EN = {
  titulo: "What do we know about these experiences?",
  intro:
    "The ACE study found a «dose-response» relationship: the more adverse experiences, the higher the risk of difficulties later on. Important: these are probabilities across large groups of people, not a prediction about you.",
};

const ACE_ESPERANZA_EN = {
  titulo: "Your story doesn't end in a number",
  texto: [
    "The brain and the body have an enormous capacity to heal. What was learned in adversity can also be relearned in safety.",
    "The single most protective factor, according to the science itself, is a simple one: safe relationships and emotional support. One trusting bond can change everything.",
    "This map — remembering, understanding, integrating — is exactly that work. You aren't looking at your wound in order to stay in it, but in order to transform it.",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// «DES-II» · Dissociative Experiences Scale
//
// Las 28 preguntas vuelven a la redacción del cuestionario original (Carlson &
// Putnam). No se retraducen del español: es el texto validado, y en inglés es
// justamente el que existe de partida.
// ═══════════════════════════════════════════════════════════════════════════

const DES_INTRO_EN = {
  titulo: "Checking out",
  subtitulo: "The DES-II test",
  que: [
    "The DES-II (Dissociative Experiences Scale) was created by Eve Bernstein Carlson and Frank Putnam. It's 28 questions about everyday experiences of disconnection: moments when your memory, your body or the world stops feeling entirely yours.",
    "For each one you mark what percentage of the time it happens to you, from 0 (never) to 100 (always). Only count the times when you are NOT under the influence of alcohol or other drugs.",
    "There are no good or bad answers, and this isn't a diagnosis. Don't think about it too much: your first instinct is usually the most honest one. Nobody else will see it.",
  ],
  subtituloTurquesa: "How much of the time does this happen to you? Mark a percentage for each one.",
  nunca: "never",
  siempre: "always",
  credito:
    "Dissociative Experiences Scale (DES-II), by Eve Bernstein Carlson and Frank W. Putnam.",
};

const DES_PREGUNTAS_EN: Record<string, { categoria?: string; pregunta?: string; apoyo?: string }> = {
  "des-1-conducir": {
    categoria: "The blank journey",
    pregunta: "Some people have the experience of driving or riding in a car or a bus and suddenly realizing that they don't remember what has happened during all or part of the trip.",
  },
  "des-2-escuchar": {
    categoria: "What you didn't hear",
    pregunta: "Some people find that sometimes they are listening to someone talk and they suddenly realize that they did not hear part or all of what was said.",
  },
  "des-3-lugar": {
    categoria: "Turning up somewhere",
    pregunta: "Some people have the experience of finding themselves in a place and having no idea how they got there.",
  },
  "des-4-ropa": {
    categoria: "Clothes you don't remember",
    pregunta: "Some people have the experience of finding themselves dressed in clothes that they don't remember putting on.",
  },
  "des-5-cosas": {
    categoria: "Things you didn't buy",
    pregunta: "Some people have the experience of finding new things among their belongings that they do not remember buying.",
  },
  "des-6-desconocidos": {
    categoria: "People who say they know you",
    pregunta: "Some people sometimes find that they are approached by people they do not know, who call them by another name or insist that they have met them before.",
  },
  "des-7-junto-a-si": {
    categoria: "Watching yourself",
    pregunta: "Some people sometimes have the experience of feeling as though they are standing next to themselves, or watching themselves do something, as if they were looking at another person.",
  },
  "des-8-no-reconocer": {
    categoria: "Not recognizing your own people",
    pregunta: "Some people are told that they sometimes do not recognize friends or family members.",
  },
  "des-9-acontecimientos": {
    categoria: "Big days with no memory",
    pregunta: "Some people find that they have no memory for some important events in their lives (for example, a wedding or a graduation).",
  },
  "des-10-mentir": {
    categoria: "Being accused of lying",
    pregunta: "Some people have the experience of being accused of lying when they do not think that they have lied.",
  },
  "des-11-espejo": {
    categoria: "The mirror",
    pregunta: "Some people have the experience of looking in a mirror and not recognizing themselves.",
  },
  "des-12-irreal": {
    categoria: "An unreal world",
    pregunta: "Some people have the experience of feeling that other people, objects and the world around them are not real.",
  },
  "des-13-cuerpo": {
    categoria: "A body that isn't yours",
    pregunta: "Some people have the experience of feeling that their body does not belong to them.",
  },
  "des-14-revivir": {
    categoria: "Reliving the past",
    pregunta: "Some people have the experience of sometimes remembering a past event so vividly that they feel as if they were reliving that event.",
  },
  "des-15-sonado": {
    categoria: "Did it happen, or did I dream it?",
    pregunta: "Some people have the experience of not being sure whether things that they remember happening really did happen, or whether they just dreamed them.",
  },
  "des-16-lugar-extrano": {
    categoria: "The familiar turned strange",
    pregunta: "Some people have the experience of being in a familiar place but finding it strange and unfamiliar.",
  },
  "des-17-television": {
    categoria: "Lost in a story",
    pregunta: "Some people find that when they are watching television or a movie they become so absorbed in the story that they are unaware of other events happening around them.",
  },
  "des-18-fantasia": {
    categoria: "A daydream that feels real",
    pregunta: "Some people find that they become so involved in a fantasy or a daydream that it feels as though it were really happening to them.",
  },
  "des-19-dolor": {
    categoria: "Ignoring pain",
    pregunta: "Some people find that they sometimes are able to ignore pain.",
  },
  "des-20-vacio": {
    categoria: "Staring into space",
    pregunta: "Some people find that they sometimes sit staring off into space, thinking of nothing, and are not aware of the passage of time.",
  },
  "des-21-hablarse": {
    categoria: "Talking out loud to yourself",
    pregunta: "Some people sometimes find that when they are alone they talk out loud to themselves.",
  },
  "des-22-otra-persona": {
    categoria: "Someone else depending on where",
    pregunta: "Some people find that in one situation they may act so differently compared with another situation that they feel almost as if they were two different people.",
  },
  "des-23-facilidad": {
    categoria: "Startling ease",
    pregunta: "Some people sometimes find that in certain situations they are able to do things with amazing ease and spontaneity that would usually be difficult for them (for example, sports, work, social situations).",
  },
  "des-24-hecho-pensado": {
    categoria: "Did I do it, or think it?",
    pregunta: "Some people sometimes find that they cannot remember whether they have done something or have just thought about doing it (for example, whether they have mailed a letter or only thought about mailing it).",
  },
  "des-25-evidencias": {
    categoria: "Evidence of what you don't remember",
    pregunta: "Some people find evidence that they have done things that they do not remember doing.",
  },
  "des-26-escritos": {
    categoria: "Writing you don't remember",
    pregunta: "Some people sometimes find writings, drawings or notes among their belongings that they must have done but cannot remember doing.",
  },
  "des-27-voces": {
    categoria: "Voices inside",
    pregunta: "Some people find that they sometimes hear voices inside their head that tell them to do things, or that comment on the things they are doing.",
  },
  "des-28-neblina": {
    categoria: "The world through a fog",
    pregunta: "Some people have the experience of feeling as though they are looking at the world through a fog, so that people and objects appear far away or unclear.",
  },
};

/** Las cuatro bandas, POR ETIQUETA (el `min`/`max` no se duplica nunca). */
const DES_BANDAS_EN: Record<string, { titulo?: string; texto?: string }> = {
  "0–9": {
    titulo: "You rarely check out",
    texto:
      "Your memory and your body are with you almost all of the time. That's a good foundation for what's coming: you'll be able to remember and to feel at once, which is exactly what this map asks of you.",
  },
  "10–19": {
    titulo: "You check out now and then",
    texto:
      "This is the most common result: nearly everyone leaves a little. It's worth learning to notice when it happens to you, because it almost always means something is weighing on you more than you're admitting.",
  },
  "20–29": {
    titulo: "You check out quite a lot",
    texto:
      "This isn't a diagnosis, but it is a signal worth taking seriously: your system probably learned to leave when something hurt too much, and it may still be doing it today when there's no need. Go slowly through the pages ahead, and stop whenever you need to.",
  },
  "30+": {
    titulo: "You check out a great deal",
    texto:
      "Your score is high. In the research, 30 or above is taken as a reason to look at this with a professional — a reason to look at it with someone, not a diagnosis and not a label. If that's you, this map isn't one to walk alone: ask for a call and we'll do it together, at your pace.",
  },
};

/** Las tres caras de la desconexión, POR `key`. */
const DES_SUBESCALAS_EN: Record<string, { titulo?: string; descripcion?: string }> = {
  amnesia: {
    titulo: "Gaps in memory",
    descripcion:
      "Pieces of time that aren't there: journeys, conversations, things you did and don't remember doing.",
  },
  despersonalizacion: {
    titulo: "Being outside yourself",
    descripcion:
      "Watching yourself from outside, not recognizing your own face, feeling your body isn't yours or the world isn't real.",
  },
  absorcion: {
    titulo: "Leaving with your mind",
    descripcion:
      "Getting lost in a story or a memory until you lose track of what's around you. It's the most common of the three, and the most harmless.",
  },
};

const DES_ESPERANZA_EN = {
  titulo: "Leaving is what saved you",
  texto: [
    "Checking out isn't a flaw or an oddity: it's what an intelligent nervous system does when it can neither run nor fight. If you couldn't leave the room as a child, you left yourself instead. And it worked.",
    "The trouble is that the mechanism doesn't tell one era from another: it still fires today — in an argument, at the doctor's, in the middle of an ordinary conversation — when there's no need for it anymore.",
    "And it can be relearned, though not through your head: through your body. Your feet on the floor, your breath, the temperature of the water, the voice of someone who's with you. Presence is trained. Every time you stay a little longer, you come a little further home.",
  ],
  avisoNarra: {
    titulo: "Before this exercise",
    texto: [
      "Your dissociation test came out high. That doesn't stop you from doing anything, but it changes the order of things: first you learn to come back to your body, and only then do you stir up the memory.",
      "If you notice yourself leaving, your body going far away or the world turning strange, stop the audio and do the closing. That isn't giving up: it's exactly what you're supposed to do.",
      "And if you can, don't do this part alone.",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// «Narra» · regulación y escritura de descarga
// ═══════════════════════════════════════════════════════════════════════════

const REGULACION_EN = {
  titulo: "Tell it",
  intro:
    "Putting what you lived into words helps you make sense of it and fit it into your story. That's how wounds can turn into scars. If you'd like to go deeper into this process, we suggest you book a call.",
  preparacion: {
    titulo: "Before you start",
    pasos: [
      "Find a quiet place where nobody will interrupt you.",
      "Put your headphones on: the sound will move from one ear to the other.",
      "Choose ONE single thing to work on today. You don't need to cover everything: one is enough.",
      "Remember: you can stop at any moment. You're in charge.",
    ],
  },
  placeholder: "Write whatever you remember…",
  botonParar: "I need to stop",
  cierre: {
    titulo: "Let's come back to the present",
    intro: "Before you go, take a moment to come back to your body and to the here and now.",
    respiracion: "Breathe deeply three times, slowly. Breathe in… hold… let go.",
    grounding: [
      "5 things you can see around you",
      "4 things you can touch",
      "3 sounds you can hear",
      "2 smells you can notice",
      "1 good thing about you",
    ],
    frase: "That's it. What came, came. You're safe and you're here.",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// LOS HOOKS · el español manda la estructura, del inglés solo el texto.
//
// OJO: hay que llamarlos AL PINTAR. Si el texto se resolviera al importar el
// módulo se quedaría congelado en el idioma con el que arrancó la página.
// ═══════════════════════════════════════════════════════════════════════════

/** Mezcla el texto inglés sobre una lista de preguntas, emparejando por `key`. */
const preguntasEn = <T extends Pregunta>(es: T[], en: PorClave): T[] =>
  es.map((p) => (en[p.key] ? { ...p, ...en[p.key] } : p));

/** ¿Está la página en inglés? Un solo sitio donde preguntarlo. */
const useEn = (): boolean => useIdioma().idioma !== "es";

export const useExperiencias = (): ExperienciaPsicologia[] => {
  const en = useEn();
  if (!en) return EXPERIENCIAS;
  return EXPERIENCIAS.map((e) => {
    const t = EXPERIENCIA_EN[e.id];
    if (!t) return e;
    return {
      ...e,
      titulo: t.titulo ?? e.titulo,
      subtitulo: t.subtitulo ?? e.subtitulo,
      intro: t.intro ?? e.intro,
      problemaInicial: { ...e.problemaInicial, ...(t.problemaInicial ?? {}) },
      preguntaEdad: { ...e.preguntaEdad, ...(t.preguntaEdad ?? {}) },
      preguntasPorAno: preguntasEn(e.preguntasPorAno, t.preguntasPorAno ?? {}),
    };
  });
};

/** La experiencia `id` en el idioma activo (el equivalente de `experienciaById`). */
export const useExperiencia = (id: string): ExperienciaPsicologia | undefined => {
  const todas = useExperiencias();
  return todas.find((e) => e.id === id) ?? experienciaById(id);
};

/** Las preguntas del nodo de la gestación (−1). No cuelgan de la experiencia:
 *  son una lista suelta, y por eso necesitan su propio hook. */
export const usePreguntasGestacion = (): Pregunta[] => {
  const en = useEn();
  return en ? preguntasEn(PREGUNTAS_GESTACION, GESTACION_EN) : PREGUNTAS_GESTACION;
};

/** Las preguntas de la página de un año. Si `exp` viene de `useExperiencia`, sus
 *  preguntas por año ya están traducidas; aquí solo se resuelve la gestación. */
export const usePreguntasDeAno = (exp: ExperienciaPsicologia, edadAno: number): Pregunta[] => {
  const gestacion = usePreguntasGestacion();
  return preguntasDeAno(exp, edadAno) === PREGUNTAS_GESTACION ? gestacion : exp.preguntasPorAno;
};

export const useGenograma = (): typeof GENOGRAMA => {
  const en = useEn();
  return en ? { ...GENOGRAMA, ...GENOGRAMA_EN } : GENOGRAMA;
};

export const useFamilia = (): typeof FAMILIA => {
  const en = useEn();
  return en ? { ...FAMILIA, ...FAMILIA_EN } : FAMILIA;
};

export const useGenogramaPreguntas = (): Pregunta[] => {
  const en = useEn();
  return en ? preguntasEn(GENOGRAMA_PREGUNTAS, GENOGRAMA_PREGUNTAS_EN) : GENOGRAMA_PREGUNTAS;
};

export const useNudos = (): typeof NUDOS => {
  const en = useEn();
  return en ? { ...NUDOS, ...NUDOS_EN } : NUDOS;
};

export const useHeridasLista = (): typeof HERIDAS_LISTA => {
  const en = useEn();
  return en ? { ...HERIDAS_LISTA, ...HERIDAS_LISTA_EN } : HERIDAS_LISTA;
};

export const useIntegracion = (): typeof INTEGRACION => {
  const en = useEn();
  return en ? { ...INTEGRACION, ...INTEGRACION_EN } : INTEGRACION;
};

export const useAprendizajesSugeridos = (): string[] => {
  const en = useEn();
  return en ? APRENDIZAJES_EN : APRENDIZAJES_SUGERIDOS;
};

export const useNecesidadesIntro = (): typeof NECESIDADES_INTRO => {
  const en = useEn();
  return en ? { ...NECESIDADES_INTRO, ...NECESIDADES_INTRO_EN } : NECESIDADES_INTRO;
};

/** OJO: la etiqueta `necesidad` se GUARDA dentro de cada herida cuando la
 *  persona la arrastra (`RelacionHuellaNudo.necesidades` es una foto del texto).
 *  Una herida compuesta en español conserva sus etiquetas en español aunque se
 *  cambie el idioma: no se pierde nada, pero se mezcla. La `key` sí es estable,
 *  y es la que decide qué necesidades salen (nunca la etiqueta). */
export const useNecesidades = (): Necesidad[] => {
  const en = useEn();
  return en ? NECESIDADES.map((n) => ({ ...n, ...(NECESIDADES_EN[n.key] ?? {}) })) : NECESIDADES;
};

export const useEstadosNecesidad = (): OpcionNecesidad[] => {
  const en = useEn();
  return en ? ESTADOS_NECESIDAD.map((o) => ({ ...o, ...(ESTADOS_NECESIDAD_EN[o.value] ?? {}) })) : ESTADOS_NECESIDAD;
};

export const useEtapasVitales = (): EtapaVital[] => {
  const en = useEn();
  return en ? ETAPAS_VITALES.map((e) => ({ ...e, nombre: ETAPAS_EN[e.id] ?? e.nombre })) : ETAPAS_VITALES;
};

export const useDonesIntro = (): typeof DONES_INTRO => {
  const en = useEn();
  return en ? { ...DONES_INTRO, ...DONES_INTRO_EN } : DONES_INTRO;
};

export const useDonesPreguntas = (): PreguntaDon[] => {
  const en = useEn();
  return en ? DONES_PREGUNTAS.map((p) => ({ ...p, ...(DONES_PREGUNTAS_EN[p.key] ?? {}) })) : DONES_PREGUNTAS;
};

export const useMiedos = (): typeof MIEDOS => {
  const en = useEn();
  return en ? { ...MIEDOS, ...MIEDOS_EN } : MIEDOS;
};

export const useMiedosEnfrentarIntro = (): typeof MIEDOS_ENFRENTAR_INTRO => {
  const en = useEn();
  return en ? { ...MIEDOS_ENFRENTAR_INTRO, ...MIEDOS_ENFRENTAR_INTRO_EN } : MIEDOS_ENFRENTAR_INTRO;
};

export const useMiedosPreguntas = (): PreguntaMiedo[] => {
  const en = useEn();
  return en ? preguntasEn(MIEDOS_PREGUNTAS, MIEDOS_PREGUNTAS_EN) : MIEDOS_PREGUNTAS;
};

export const useAceIntro = (): typeof ACE_INTRO => {
  const en = useEn();
  return en ? { ...ACE_INTRO, ...ACE_INTRO_EN } : ACE_INTRO;
};

export const useAcePreguntas = (): PreguntaAce[] => {
  const en = useEn();
  return en ? ACE_PREGUNTAS.map((p) => ({ ...p, ...(ACE_PREGUNTAS_EN[p.key] ?? {}) })) : ACE_PREGUNTAS;
};

/** La banda de una puntuación, ya traducida. El `min`/`max` los sigue poniendo
 *  el español: la misma puntuación cae en la misma banda en los dos idiomas. */
export const useAceBanda = (score: number): AceBanda => {
  const en = useEn();
  const b = aceBanda(score);
  return en ? { ...b, ...(ACE_BANDAS_EN[b.etiqueta] ?? {}) } : b;
};

export const useAceBandas = (): AceBanda[] => {
  const en = useEn();
  return en ? ACE_BANDAS.map((b) => ({ ...b, ...(ACE_BANDAS_EN[b.etiqueta] ?? {}) })) : ACE_BANDAS;
};

export const useAceConsecuencias = (): typeof ACE_CONSECUENCIAS => {
  const en = useEn();
  return en ? { ...ACE_CONSECUENCIAS, ...ACE_CONSECUENCIAS_EN } : ACE_CONSECUENCIAS;
};

export const useAceEsperanza = (): typeof ACE_ESPERANZA => {
  const en = useEn();
  return en ? { ...ACE_ESPERANZA, ...ACE_ESPERANZA_EN } : ACE_ESPERANZA;
};

export const useDesIntro = (): typeof DES_INTRO => {
  const en = useEn();
  return en ? { ...DES_INTRO, ...DES_INTRO_EN } : DES_INTRO;
};

export const useDesPreguntas = (): PreguntaDes[] => {
  const en = useEn();
  return en ? DES_PREGUNTAS.map((p) => ({ ...p, ...(DES_PREGUNTAS_EN[p.key] ?? {}) })) : DES_PREGUNTAS;
};

/** La banda de una puntuación, ya traducida. Los umbrales los sigue poniendo el
 *  español: la misma puntuación cae en la misma banda en los dos idiomas. */
export const useDesBanda = (score: number): DesBanda => {
  const en = useEn();
  const b = desBanda(score);
  return en ? { ...b, ...(DES_BANDAS_EN[b.etiqueta] ?? {}) } : b;
};

export const useDesBandas = (): DesBanda[] => {
  const en = useEn();
  return en ? DES_BANDAS.map((b) => ({ ...b, ...(DES_BANDAS_EN[b.etiqueta] ?? {}) })) : DES_BANDAS;
};

/** Las tres caras de la desconexión con su puntuación. El reparto de ítems y las
 *  cuentas viven solo en el español; de aquí sale únicamente el rótulo. */
export const useDesSubescalas = (
  data: LineaDeVidaData,
): { sub: SubescalaDes; score: number }[] => {
  const en = useEn();
  const lista = desSubescalas(data);
  return en
    ? lista.map((s) => ({ ...s, sub: { ...s.sub, ...(DES_SUBESCALAS_EN[s.sub.key] ?? {}) } }))
    : lista;
};

export const useDesEsperanza = (): typeof DES_ESPERANZA => {
  const en = useEn();
  return en ? { ...DES_ESPERANZA, ...DES_ESPERANZA_EN } : DES_ESPERANZA;
};

export const useRegulacion = (): typeof REGULACION => {
  const en = useEn();
  return en ? { ...REGULACION, ...REGULACION_EN } : REGULACION;
};

// ─────────────────────────────────────────────────────────────────────────
// LO MISMO, PERO FUERA DE REACT
//
// Los generadores de PDF no son componentes: no pueden llamar a un hook. Leen
// el idioma del espejo de módulo (`getIdioma()`) en vez del contexto. Mismo
// texto y mismas mezclas que los hooks de arriba, para que el cuaderno diga
// exactamente lo que la pantalla decía.
// ─────────────────────────────────────────────────────────────────────────

const esEn = (): boolean => getIdioma() !== "es";

/** La experiencia `id` traducida (el `experienciaById` de fuera de React). */
export const experienciaTraducida = (id: string): ExperienciaPsicologia | undefined => {
  const e = experienciaById(id);
  if (!e || !esEn()) return e;
  const t = EXPERIENCIA_EN[e.id];
  if (!t) return e;
  return {
    ...e,
    titulo: t.titulo ?? e.titulo,
    subtitulo: t.subtitulo ?? e.subtitulo,
    intro: t.intro ?? e.intro,
    problemaInicial: { ...e.problemaInicial, ...(t.problemaInicial ?? {}) },
    preguntaEdad: { ...e.preguntaEdad, ...(t.preguntaEdad ?? {}) },
    preguntasPorAno: preguntasEn(e.preguntasPorAno, t.preguntasPorAno ?? {}),
  };
};

/** Las preguntas de un año (o las de la gestación, si `edadAno` es −1). */
export const preguntasDeAnoTraducidas = (exp: ExperienciaPsicologia, edadAno: number): Pregunta[] => {
  const esGestacion = preguntasDeAno(exp, edadAno) === PREGUNTAS_GESTACION;
  if (!esEn()) return preguntasDeAno(exp, edadAno);
  return esGestacion ? preguntasEn(PREGUNTAS_GESTACION, GESTACION_EN) : exp.preguntasPorAno;
};

export const etapasVitalesTraducidas = (): EtapaVital[] =>
  esEn() ? ETAPAS_VITALES.map((e) => ({ ...e, nombre: ETAPAS_EN[e.id] ?? e.nombre })) : ETAPAS_VITALES;

export const miedosPreguntasTraducidas = (): PreguntaMiedo[] =>
  esEn() ? preguntasEn(MIEDOS_PREGUNTAS, MIEDOS_PREGUNTAS_EN) : MIEDOS_PREGUNTAS;

/** La banda de una puntuación ACE. El `min`/`max` los sigue poniendo el
 *  español: la misma puntuación cae en la misma banda en los dos idiomas. */
export const aceBandaTraducida = (score: number): AceBanda => {
  const b = aceBanda(score);
  return esEn() ? { ...b, ...(ACE_BANDAS_EN[b.etiqueta] ?? {}) } : b;
};
