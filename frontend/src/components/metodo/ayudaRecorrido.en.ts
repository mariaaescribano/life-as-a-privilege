// ─────────────────────────────────────────────────────────────────────────
// LA AYUDA DEL RECORRIDO DE PSICOLOGÍA, EN INGLÉS.
//
// Los tres popups (Ejemplo · Orientación · «¿Cómo se hace?») de cada página.
// Aquí va SOLO el texto: qué páginas existen, qué botón abre qué y de dónde
// sale el curso de acceso libre vive únicamente en `AyudaRecorrido.tsx`.
//
// Se pega encima al pintar, página a página: lo que falte aquí se lee en
// español y no se rompe nada. Por eso no importa este fichero desde el
// componente de datos (sería un círculo): es el componente el que lo pide.
//
// AL TRADUCIR:
//  · Es la voz de María explicando, no un manual: tú, contracciones, frases
//    cortas. «Escribe lo que surja», no «se recomienda escribir».
//  · Glosario: huella = mark · nudo = knot · herida = wound · relación =
//    connection · don = gift · línea de Vida = Life Line.
//  · Los rótulos de los botones (Ejemplo, Orientación) NO están aquí: son
//    `metodo.ayuda.*` del diccionario.
// ─────────────────────────────────────────────────────────────────────────
import { useIdioma } from "../../i18n";

/** Un popup: su título y sus párrafos. Mismo tipo que el español. */
type Seccion = { titulo: string; cuerpo: string[] };
type AyudaEn = Partial<{ ejemplo: Seccion; ayuda: Seccion; orientacion: Seccion }>;

const AYUDA_EN: Record<string, AyudaEn> = {
  inicio: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "The Map takes you from your story to your patterns, and to where they come from.",
        "For example: you'll remember a year of your Life, mark what left a mark on you, name a knot like “fear of rejection” and find out where it was born.",
      ],
    },
    ayuda: {
      titulo: "How does it work?",
      cuerpo: [
        "Move through the stages in order, without rushing.",
        "Everything you write saves itself, and it's only for you.",
        "You can go back whenever you want.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "This isn't a test and there are no right answers.",
        "The idea is that you build your own connections.",
        "If you can, share the process with someone you trust.",
      ],
    },
  },
  problema: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "Write in your own words what weighs on you today.",
        "For example: “I find it hard to set limits and I end up worn out from pleasing everyone.”",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Write freely, without ordering or correcting it.",
        "You don't have to find the cause: just describe what you feel today.",
        "Press Save whenever you want.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "Naming the problem is already beginning to look at it.",
        "Don't look for the perfect word; look for the honest one.",
      ],
    },
  },
  necesidades: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "Each cell is a childhood need. Open it to see what a healthy caregiver would have done.",
        "In “Emotional safety”, for instance, you'd mark “I missed it” if as a child you felt alone with your fear or your sadness.",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Press the button in the middle of a cell to open it.",
        "Read the healthy response and mark how you lived it: I got it, sometimes, or I missed it.",
        "The cell changes color with what you mark. You can change your answer whenever you want.",
      ],
    },
  },
  ace: {
    ejemplo: {
      titulo: "What is this?",
      cuerpo: [
        "The ACE test measures the adverse experiences you lived at home before you turned 18: abuse, neglect and family dysfunction.",
        "It's 10 yes-or-no questions. Every “yes” adds a point (0 to 10). It isn't a grade or a judgment: it just puts a name to what you carried.",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Read each question and answer Yes or No honestly. You can change your answer whenever you want.",
        "Once you've answered all 10, your score and what it means will appear.",
        "Everything saves itself, and it's only for you.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "A high score isn't a sentence: it's a risk factor, not a destiny.",
        "This test isn't a diagnosis. If something stirs up too much, look for support: asking for help is taking care of yourself too.",
      ],
    },
  },
  des: {
    ejemplo: {
      titulo: "What is this?",
      cuerpo: [
        "The DES-II (Dissociative Experiences Scale, by Carlson and Putnam) gathers 28 everyday experiences of checking out: moments when your memory, your body or the world stops feeling entirely yours.",
        "For each one you mark what percentage of the time it happens to you, from 0 (never) to 100 (always). It isn't a grade and it isn't a diagnosis.",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Read each statement and mark the percentage of time it happens to you. You can change your answer whenever you want.",
        "Count only the moments when you are NOT under the effects of alcohol or other drugs.",
        "Don't overthink it: the first instinct is usually the most honest one. Everything saves itself.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "Checking out isn't madness or weakness: it's what the mind does when it can't run and can't fight. Almost everyone does it a little.",
        "If you recognize yourself too much while reading the questions and it frightens you, don't look at it alone: ask for a call and we'll look at it together.",
      ],
    },
  },
  "linea-de-Vida": {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "Rebuild your Life year by year, like the pages of a book.",
        "In “Year 8”, for instance: “We moved to another city. Making friends was hard. I felt alone.”",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Tap a year to open its page and answer whatever you remember.",
        "If you don't remember anything from a year, mark it as “no memories”.",
        "Walk through your whole Life, from the day you were born until today.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "You don't need to remember everything, or in order.",
        "Write whatever comes up; one small detail can open a door.",
      ],
    },
  },
  familia: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "You place your family and choose, for each one, the character or the animal that looks like them.",
        "For example: your father, a lion; your mother, a wolf and an angel; your sister, a hedgehog. There are no good or bad images: only the one that comes to you.",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Tap a “+” next to a photo to add someone: the generations before you above (parents, grandparents), your own generation to the sides (siblings, partner) and your children below.",
        "Their window opens: give them a name and a relationship (and a photo, if you want) and choose the character or the animal you associate with that person. You can pick up to two.",
        "Tap an image you already chose to remove it. Everything saves itself.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "Don't think about it too much: keep the first image that comes to you, even if you can't explain why.",
        "The image doesn't judge anyone: it says how you lived it.",
        "On the next page you'll have this same family, to write about each person.",
      ],
    },
  },
  genograma: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "Your family is right there: tap a person and write about them.",
        "On your mother's card, for instance: “We loved each other a lot, but I missed being listened to when I was having a hard time.”",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Tap a “+” next to a photo to add someone: the generations before you above (parents, grandparents), your own generation to the sides (siblings, partner) and your children below.",
        "Their card opens: add a photo, a name and a relationship, and write whatever you want about that person.",
        "Tap any photo to open its card again. Everything saves itself.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "Place whoever really shaped you, even if they're not blood family; and place whoever was missing, too.",
        "The tree doesn't have to be complete or tidy: it's your map, not an official document.",
        "If looking at someone hurts, write only what you can today. You can come back whenever you want.",
      ],
    },
  },
  huellas: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "Read your story again and mark with ◈ whatever left a mark on you.",
        "For example, you'd mark: “My grandmother's death” or “The day I passed the exam”.",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Press ◈ next to a memory to mark it.",
        "Press it again to unmark it.",
        "Turn the pages to walk through all your years.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "A mark isn't only what hurt: it's also what shaped you.",
        "Mark whatever still echoes, even if you don't know why.",
      ],
    },
  },
  nudos: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "A knot is a pattern or a conflict that's still with you today.",
        "For example: “Fear of rejection”, “Need for control”, “Not feeling like enough”.",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Write a knot and press Add.",
        "You can take inspiration from the suggested examples.",
        "Remove with the ✕ the ones that don't feel like yours.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "Don't look for perfect explanations.",
        "Just notice what you feel is present in your Life right now.",
      ],
    },
  },
  heridas: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "A wound joins an experience with the need it left uncovered and the belief that was born from there.",
        "Mark: “My parents argued a lot when I was little”.",
        "Uncovered need: “Emotional safety”.",
        "Knot: “Fear of conflict”.",
        "And you write: “I learned that when someone raises their voice something bad is about to happen; that's why I avoid arguing, even if I swallow what I feel.”",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Press “+ Add wound” to create one.",
        "Tap (or drag) the marks and the knots that feel connected: they join the active wound and light up in its color.",
        "Give it a title and describe what that experience left in you.",
      ],
    },
    orientacion: {
      titulo: "How do you do it?",
      cuerpo: [
        "Tap the marks, the knots and the uncovered needs that feel like part of the same wound: they light up in its color.",
        "Once you have it together, press “I've finished this wound”.",
        "Give it a name and press “Save wound”.",
        "The wound shows up below, in its own color. You'll see them all together on the “Your wounds” page.",
      ],
    },
  },
  integracion: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "Connect a knot with an archetype from your birth chart.",
        "For example: “Loneliness” + “Saturn in House 1” → “I learned early on to hold myself up.”",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Create a connection with “+ Add connection”.",
        "Tap (or drag) knots and archetypes to bring them together; the eye on each card opens its reading.",
        "Give it a title and write what you see.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "The platform doesn't interpret for you: you're the one who writes the understanding.",
        "Let the symbols talk to each other; don't look for quick answers.",
      ],
    },
  },
  mapa: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "Take one of your connections and turn it into a healthier truth.",
        "For example, from “My worth depends on doing it perfectly” to “My worth doesn't depend on doing it perfectly”.",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "For each connection, answer the four questions calmly.",
        "Recognize what the pattern was protecting, what it costs you, what you want to believe now and what you want to remember.",
        "Everything saves itself; press Save whenever you want.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "This isn't about analyzing the past any further, but about starting to write a new story.",
        "Be kind to yourself: that pattern protected you once. Today you can choose another truth.",
      ],
    },
  },
  regulacion: {
    ejemplo: {
      titulo: "What is this?",
      cuerpo: [
        "This isn't EMDR and it isn't therapy: it's a space to discharge and calm your nervous system.",
        "While the audio moves from one ear to the other, you write whatever you need to let go of, without ordering it.",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Put your headphones on and choose ONE single thing to work on today, not everything at once.",
        "Press play and write freely, whatever comes up.",
        "If at any point it gets too much, press “I need to stop”: the audio stops and we walk you back to the present.",
      ],
    },
    orientacion: {
      titulo: "Take care of yourself here",
      cuerpo: [
        "Go slowly, at your own pace. Stopping is moving forward too.",
        "Always finish with the closing, so you don't get up raw.",
        "If this stirs up a lot, look for professional support or book a call for company.",
      ],
    },
  },
  dones: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "A gift isn't what you learned with effort, but what comes naturally to you.",
        "To the question “What do people ask you to help them solve?” you might answer: “People always come to me to unload; I know how to listen without judging.”",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Answer the questions calmly; there are no right answers.",
        "Everything saves itself. You can leave it half done and come back.",
        "When you finish, move on to the mirror: there you'll see what you wrote and name your gifts.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "Don't hold back out of modesty: nobody else reads this.",
        "If a question is hard, think about what people thank you for.",
      ],
    },
  },
  "dones-espejo": {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "Reading your answers, you might recognize gifts like: “Listening”, “Intuition”, “Holding others up”.",
        "Next to them, the archetypes of your chart can confirm what you already see in yourself.",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Read your answers again and notice what repeats.",
        "Write down every gift you recognize and press Add.",
        "Remove with the ✕ the ones that don't feel entirely yours.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "Recognizing is easier than inventing: name what's already there.",
        "A gift can also be born from a wound. What broke you also gave you something.",
      ],
    },
  },
  miedos: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "A fear is something you're afraid will happen, and it shapes how you live today.",
        "For example: “Of ending up alone”, “Of not being enough”, “Of being abandoned”.",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Write a fear and press Add.",
        "You can take inspiration from the suggested examples.",
        "Remove with the ✕ the ones that don't feel like yours. On the next page you'll face them one by one.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "Don't soften them or justify them: write them exactly as they show up.",
        "Naming a fear already takes some of its strength away.",
      ],
    },
  },
  "miedos-preguntas": {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "Take one fear and look at it head on by answering the questions.",
        "With “Of failing”, for instance: what's the worst that would happen, how likely it really is, how you'd handle it and what you'd say to someone you love.",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Each fear is a box with several questions. Answer them calmly.",
        "There are no right answers: only your truth.",
        "Everything saves itself; you can leave it half done and come back.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "This isn't about beating the fear in one go, but about disarming it by looking at it calmly.",
        "Almost always, when we look at it head on, it stops being as big as it seemed.",
      ],
    },
  },
  compromiso: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "Put into words what you missed, and one concrete gesture to give it to yourself today.",
        "For example: “I needed someone to tell me it was okay to get things wrong” → “Today, when I fail, I'll talk to myself as gently as I'd talk to a friend.”",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Answer the two questions calmly: what you needed, and how to start giving it to yourself today.",
        "Don't look for grand resolutions: one small, real gesture is worth more.",
        "Everything saves itself; press Save whenever you want.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "The commitment isn't with the you of the past, but with the you of today.",
        "Choose something you can really keep: taking care of yourself is trained in small things.",
      ],
    },
  },
  brujula: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "Write a letter to your future self, for when you get stuck again.",
        "For example: “When you feel like you can't, remember you've crossed this before. Breathe, ask for help and take one single step.”",
      ],
    },
    ayuda: {
      titulo: "How do you do it?",
      cuerpo: [
        "Write in your own words what you'd like to remember in a hard moment.",
        "Speak to yourself with love, the way you'd speak to someone you care about.",
        "It saves itself; you'll be able to read it again whenever you need it.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "It isn't to judge yourself: it's to remind yourself of the path you already know.",
        "Write it from your calmest part, the one that knows this will pass too.",
      ],
    },
  },
  sintesis: {
    ejemplo: {
      titulo: "An example",
      cuerpo: [
        "Each row brings together a whole chain of your story.",
        "For example: “I'm not enough” → “Getting things wrong made me worth less” → “Virgo Ascendant” → “Perfectionism” → “My worth doesn't depend on doing it perfectly” → What I take with me: “Self-acceptance”.",
      ],
    },
    ayuda: {
      titulo: "How do you read it?",
      cuerpo: [
        "Look at your whole path, without rushing.",
        "For each connection, choose what you want to take with you.",
        "Say goodbye by writing the chapter you want to start living.",
      ],
    },
    orientacion: {
      titulo: "Guidance",
      cuerpo: [
        "There's no more analysis and no more wounds here: only understanding, integration and direction.",
        "This page is for contemplating what you're already able to see.",
      ],
    },
  },
};

/** El box de «Ejemplo». Los nudos y los miedos NO están aquí: sus ejemplos
 *  salen de `psicologiaRecorrido.en.ts`, que es donde vive esa lista. */
const EJEMPLOS_EN: Record<string, {
  titulo?: string;
  subtitulo?: string;
  ejemplos?: string[];
  triadas?: { huella: string; necesidad: string; nudo: string; herida: string }[];
  relaciones?: { herida: string; arquetipo: string; relacionTitulo: string; comprension?: string }[];
}> = {
  problema: {
    titulo: "Examples of problems",
    ejemplos: [
      "I find it hard to set limits and I end up worn out from pleasing everyone.",
      "Whatever I do, I feel like I'm never enough.",
      "I find it hard to trust; I always expect to be let down sooner or later.",
      "I need everything under control and I live on edge.",
      "I avoid conflict and swallow what I really feel.",
      "I find it hard to be alone and I'm constantly looking for approval.",
      "I put off what matters and then punish myself for not moving.",
    ],
  },
  huellas: {
    titulo: "Examples of marks",
    ejemplos: [
      "My grandmother's death",
      "The day I passed the exam",
      "Moving to another city",
      "My first heartbreak",
      "When my sister was born",
      "My parents' divorce",
      "A summer at my grandparents' house",
      "The day I felt free",
    ],
  },
  nudos: { titulo: "Examples of knots" },
  miedos: { titulo: "Examples of fears" },
  dones: {
    titulo: "Examples of gifts",
    subtitulo: "(not to copy: just so you recognize your own)",
    ejemplos: [
      "Really listening",
      "Calming people down",
      "Seeing ways out where others see walls",
      "Intuition",
      "Making things with my hands",
      "Bringing order to chaos",
      "Making people laugh",
      "Teaching patiently",
      "Holding others up when it's hard",
      "Imagining and creating",
      "Leading without imposing",
      "Taking care of the details",
    ],
  },
  integracion: {
    titulo: "An example of a connection",
    subtitulo: "(a simple example, just to give you an idea)",
    relaciones: [
      {
        herida: "Holding back my emotions",
        arquetipo: "Saturn in Cancer",
        relacionTitulo: "Emotional repression, from never being allowed it back then",
      },
    ],
  },
  heridas: {
    titulo: "Examples of wounds",
    triadas: [
      {
        huella: "My parents argued a lot when I was little.",
        necesidad: "Emotional safety.",
        nudo: "Fear of conflict.",
        herida: "I learned that when someone raises their voice something bad is about to happen; that's why I avoid arguing, even if I swallow what I feel.",
      },
      {
        huella: "My parents criticized my mistakes a lot.",
        necesidad: "Emotional validation.",
        nudo: "Perfectionism.",
        herida: "I learned that getting things wrong made me worth less.",
      },
    ],
  },
};

const useEn = (): boolean => useIdioma().idioma !== "es";

/** Los tres popups de esta página en inglés, o `null` si toca español. Lo que
 *  falte (una página sin traducir, un popup suelto) se queda en español. */
export const useAyudaEn = (pagina: string): AyudaEn | null => {
  const en = useEn();
  return en ? AYUDA_EN[pagina] ?? null : null;
};

/** El texto inglés del box de «Ejemplo» de esta página, para pegarlo encima. */
export const useEjemplosBoxEn = (pagina: string): (typeof EJEMPLOS_EN)[string] | null => {
  const en = useEn();
  return en ? EJEMPLOS_EN[pagina] ?? null : null;
};
