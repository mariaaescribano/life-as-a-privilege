import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// CÓMIC · «¿Qué es una carta astral?»
//
// El TERCER cómic de astrología, el que cierra la entrada a la disciplina.
// Antes esto era un visor incrustado en la página de los datos
// (TextoCartaExplicativo): se leía metido en un box de 418 px, compitiendo con
// el formulario. Ahora es un cómic como los demás —a pantalla completa, con su
// visor— y desemboca en «Lo primero de tu carta».
//
// Cuándo sale:
//   · Quien aún no ha dado sus datos → después de escribirlos y enviarlos.
//   · Quien ya los dio → seguido de los otros dos, al entrar.
//
// ✍️  EDITAR: cambia los textos aquí; las fotos, en /viñetas/astrologia/astro.
// ─────────────────────────────────────────────────────────────────────────

const MAPA1 = "/viñetas/astrologia/astro/mapa1.webp";
const MAPA11 = "/viñetas/astrologia/astro/mapa11.webp";
const MAPA2 = "/viñetas/astrologia/astro/mapa2.webp";
const MAPA3 = "/viñetas/astrologia/astro/mapa3.webp";
const MAPA4 = "/viñetas/astrologia/astro/mapa4.webp";

/** Las fotos del cómic, para precargarlas desde la página y que no aparezca a
 *  medio cargar (igual que se hace con el Origen y la Historia). */
export const CARTA_MAPA_IMGS = [MAPA1, MAPA11, MAPA2, MAPA3, MAPA4];

export const VINETAS_CARTA: Vineta[] = [
  {
    src: MAPA1,
    paragraphs: [
      "Tu carta astral te muestra dónde se encuentran tus mayores capacidades, tus dones, tus dificultades y cuál es el propósito de tu Vida.",
      "También revela tus heridas más profundas y dónde fueron creadas.",
    ],
  },
  {
    src: MAPA11,
    paragraphs: [
      "Es importante recordar que nada de lo que aparece en tu carta es bueno o malo, ni hay nada que juzgar en ti o en ninguna otra persona.",
      "Todo fue elegido por tu alma antes de nacer.",
      "Por extensión, también fueron elegidas las experiencias, las heridas y las personas que te lo harían.",
    ],
  },
  {
    src: MAPA2,
    paragraphs: [
      "En Astrología, las Casas muestran dónde ocurre, ocurrió o puede ocurrir una experiencia.",
      "Los Planetas indican qué energía, función o aprendizaje está implicado.",
    ],
  },
  {
    src: MAPA3,
    paragraphs: [
      "Los Signos revelan cómo se expresa esa energía y cuál es su cualidad.",
      "Los Aspectos muestran las relaciones entre las distintas energías de la carta: los impulsos, los bloqueos, los patrones repetitivos y los puntos donde conviene poner atención para desarrollar tu potencial y no perder de vista tus dones.",
    ],
  },
  {
    src: MAPA4,
    paragraphs: [
      "La carta astral es tu «manual de instrucciones» para comprenderte mejor, reconocer tus dones, sanar tus heridas y recorrer tu camino con mayor consciencia.",
    ],
  },
];
