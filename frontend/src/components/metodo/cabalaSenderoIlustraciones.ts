import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Ilustraciones (cómic) de cada uno de los 22 senderos del Árbol de la Vida.
//
// Al pinchar un sendero en /metodo/cabala/senderos se abre su ilustración a
// pantalla completa (mismo visor que el resto). Cuando el usuario los ha visto
// TODOS, se desbloquea el botón para recorrerlos uno a uno.
//
// Clave = `num` del sendero (11-32, numeración cabalística).
// Textos definitivos (los 22: Aleph→Tav).
// Fotos en /recorrido/cabala/senderos/<letra>.png (nombre de la letra hebrea).
// Los 22 senderos (Aleph→Tav) ya tienen ilustración.
// ─────────────────────────────────────────────────────────────────────────

const IMG = "/img/fondos/cabala.webp"; // placeholder por si faltara alguna foto

// Foto de cada sendero por su letra hebrea (archivo en /recorrido/cabala/senderos/).
const FOTOS: Record<number, string> = {
  11: "aleph",
  12: "beth",
  13: "gimel",
  14: "daleth",
  15: "he",
  16: "vav",
  17: "zayin",
  18: "chet",
  19: "tet",
  20: "yod",
  21: "kaf",
  22: "lamed",
  23: "mem",
  24: "nun",
  25: "samekh",
  26: "ayin",
  27: "pe",
  28: "tsadi",
  29: "qof",
  30: "resh",
  31: "shin",
  32: "tav",
};

const fotoSendero = (num: number): string =>
  FOTOS[num] ? `/recorrido/cabala/senderos/${FOTOS[num]}.webp` : IMG;

const placeholder = (): Vineta[] => [
  {
    src: IMG,
    paragraphs: ["Ilustración próximamente."],
  },
];

// Resumen de cada sendero (solo el texto; el número = `num` cabalístico 11-32).
const TEXTOS: Record<number, string> = {
  11: "Aleph representa el primer movimiento entre el propósito y la sabiduría.\n\nEnseña que un verdadero propósito no consiste en aferrarse a nuestras ideas, sino en permitir que la realidad y las experiencias las enriquezcan o redefinan.\n\nEs el sendero de la apertura mental, la flexibilidad y la capacidad de aprender.",
  12: "Beth simboliza el paso del propósito a la comprensión.\n\nRecuerda que las grandes ideas necesitan una estructura donde crecer y que la reflexión convierte la inspiración en conocimiento sólido.\n\nEs el sendero de la pausa, el aprendizaje y la construcción interior.",
  13: "Gimel representa el viaje del propósito hacia el corazón.\n\nEnseña que los valores dejan de ser simples ideas cuando se convierten en una forma de vivir.\n\nEs el sendero donde la coherencia une lo que pensamos, sentimos y hacemos.",
  14: "Daleth simboliza el paso de la percepción a la comprensión.\n\nEnseña que la intuición abre una puerta, pero solo la reflexión permite atravesarla y descubrir una realidad más profunda.\n\nEs el sendero de la decisión consciente.",
  15: "He representa la capacidad de permitir que una verdad transforme el corazón.\n\nNo basta con comprender una idea; el verdadero cambio ocurre cuando modifica nuestra manera de sentir, decidir y vivir.\n\nEs el sendero de la integración emocional.",
  16: "Vav simboliza el puente entre la comprensión y la generosidad.\n\nEnseña que el conocimiento alcanza su plenitud cuando se convierte en servicio y ayuda a los demás.\n\nEs el sendero que une la sabiduría con el amor en acción.",
  17: "Zayin representa el paso del conocimiento a la sabiduría.\n\nEnseña a distinguir lo esencial de lo superficial y a convertir el aprendizaje en una forma de vivir.\n\nEs el sendero de la coherencia, donde las decisiones reflejan aquello que realmente importa.",
  18: "Chet representa el paso de la comprensión a los límites saludables.\n\nEnseña que comprender a los demás no implica renunciar a uno mismo y que los límites son una forma de proteger aquello que tiene valor.\n\nLa verdadera madurez combina empatía con firmeza.",
  19: "Tet simboliza la integración entre la generosidad y la firmeza.\n\nEnseña que el amor más sabio sabe cuándo ayudar y cuándo permitir que los demás crezcan por sí mismos.\n\nEl equilibrio convierte la compasión en una elección consciente.",
  20: "Yod representa el poder de las pequeñas acciones realizadas con intención.\n\nEnseña que la verdadera compasión consiste en hacer aquello que realmente ayuda al otro a crecer.",
  21: "Kaf simboliza la capacidad de sostener aquello que valoramos a lo largo del tiempo.\n\nEnseña que el entusiasmo inicia el camino, pero solo el compromiso constante permite construir algo duradero.",
  22: "Lamed representa el paso de los límites al equilibrio.\n\nEnseña que la verdadera fortaleza no nace del control ni de la rigidez, sino de saber combinar firmeza y compasión con serenidad.",
  23: "Mem representa la capacidad de expresar nuestras necesidades con claridad y respeto.\n\nEnseña que comunicar nuestros límites fortalece las relaciones y evita que el silencio termine convirtiéndose en resentimiento.",
  24: "Nun simboliza la perseverancia que nace al mantener nuestros valores durante y a pesar de las dificultades.",
  25: "Samekh representa la construcción de una Vida coherente mediante hábitos constantes.\n\nEnseña que los valores solo se consolidan cuando se reflejan en las pequeñas decisiones que repetimos cada día.",
  26: "Ayin representa la capacidad de expresar al mundo lo que realmente somos.\n\nEnseña que la autenticidad no consiste solo en conocernos, sino en tener el valor de comunicar nuestra verdad con respeto.",
  27: "Pe representa el poder transformador de la palabra.\n\nEnseña que compartir con autenticidad aquello que hemos aprendido puede inspirar, crear y ayudar al crecimiento de otras personas.",
  28: "Tsadi simboliza la transformación de la perseverancia en hábitos.\n\nEnseña que el cambio verdadero no depende del esfuerzo extraordinario, sino de pequeñas acciones repetidas hasta formar parte de nuestra identidad.",
  29: "Qof representa el paso de la perseverancia a los resultados visibles.\n\nEnseña que toda transformación exterior nace de un largo proceso invisible y que confiar en el camino es tan importante como alcanzar la meta.",
  30: "Resh representa la coherencia y unión entre lo que pensamos, decimos y hacemos.\n\nEnseña que expresar nuestros valores solo tiene sentido cuando nuestra rutina cotidiana refleja aquello que comunicamos.",
  31: "Shin representa el momento en que aquello que expresamos deja de ser una idea y se convierte en una realidad visible.\n\nEnseña que las palabras y las decisiones solo alcanzan su verdadero valor cuando se traducen en acciones que transforman nuestra Vida y nuestro entorno.",
  32: "Tav representa el último paso del viaje: convertir los valores, hábitos y aprendizajes en una forma estable de vivir.\n\nSimboliza la culminación del proceso interior, donde la persona deja de perseguir una identidad ideal y simplemente la encarna en su Vida cotidiana.",
};

export const CABALA_SENDERO_ILUSTRACIONES: Record<number, Vineta[]> = Object.fromEntries(
  Array.from({ length: 22 }, (_, i) => {
    const num = i + 11;
    const texto = TEXTOS[num];
    return [num, texto ? [{ src: fotoSendero(num), paragraphs: texto.split("\n\n") }] : placeholder()];
  }),
);

export const ilustracionSendero = (num: number): Vineta[] =>
  CABALA_SENDERO_ILUSTRACIONES[num] ?? [];

// Numeración cabalística en orden (11..32).
export const CABALA_SENDERO_NUMS: number[] = Array.from({ length: 22 }, (_, i) => i + 11);

// Secuencia completa de viñetas (los 22 senderos en orden) para el visor: al
// abrir la ilustración de un sendero se puede pasar al siguiente con las flechas,
// sin salir y entrar. `CABALA_SENDERO_VINETA_NUMS` mantiene, en paralelo, a qué
// sendero pertenece cada viñeta (para marcarlo como visto al verlo).
export const CABALA_SENDERO_VINETAS: Vineta[] = CABALA_SENDERO_NUMS.flatMap(
  (n) => ilustracionSendero(n),
);
export const CABALA_SENDERO_VINETA_NUMS: number[] = CABALA_SENDERO_NUMS.flatMap(
  (n) => ilustracionSendero(n).map(() => n),
);

/** Foto que representa al sendero: la de su ilustración. Se pinta en la cabecera
 *  de su página (/metodo/cabala/sendero/…), no solo en el visor. */
export const fotoSenderoIlustracion = (num: number): string | undefined =>
  CABALA_SENDERO_ILUSTRACIONES[num]?.[0]?.src;

/** Índice del sendero dentro de la secuencia completa de viñetas, para abrir el
 *  visor justo por su ilustración (y poder seguir con las flechas). */
export const indiceIlustracionSendero = (num: number): number =>
  Math.max(0, CABALA_SENDERO_VINETA_NUMS.indexOf(num));
