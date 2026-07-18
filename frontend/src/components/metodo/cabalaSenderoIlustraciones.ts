import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Ilustraciones (cómic) de cada uno de los 22 senderos del Árbol de la Vida.
//
// Al pinchar un sendero en /metodo/cabala/senderos se abre su ilustración a
// pantalla completa (mismo visor que el resto). Cuando el usuario los ha visto
// TODOS, se desbloquea el botón para recorrerlos uno a uno.
//
// Clave = `num` del sendero (11-32, numeración cabalística).
// Textos definitivos (los 22: Aleph→Tav). Fotos PENDIENTES: mientras tanto se
// usa la imagen de fondo de la disciplina.
//   Sustituye `src` por /recorrido/cabala/senderos/<num>/<n>.png cuando estén.
// ─────────────────────────────────────────────────────────────────────────

const IMG = "/img/fondos/cabala.png"; // placeholder hasta que haya foto propia

const placeholder = (): Vineta[] => [
  {
    src: IMG,
    paragraphs: ["Ilustración próximamente."],
  },
];

// Resumen de cada sendero (solo el texto; el número = `num` cabalístico 11-32).
const TEXTOS: Record<number, string> = {
  11: "Aleph representa el primer movimiento entre el propósito y la sabiduría. Enseña que un verdadero propósito no consiste en aferrarse a nuestras ideas, sino en permitir que la realidad y las experiencias las enriquezcan o redefinan. Es el sendero de la apertura mental, la flexibilidad y la capacidad de aprender.",
  12: "Beth simboliza el paso del propósito a la comprensión. Recuerda que las grandes ideas necesitan una estructura donde crecer y que la reflexión convierte la inspiración en conocimiento sólido. Es el sendero de la pausa, el aprendizaje y la construcción interior.",
  13: "Gimel representa el viaje del propósito hacia el corazón. Enseña que los valores dejan de ser simples ideas cuando se convierten en una forma de vivir. Es el sendero donde la coherencia une lo que pensamos, sentimos y hacemos.",
  14: "Daleth simboliza el paso de la percepción a la comprensión. Enseña que la intuición abre una puerta, pero solo la reflexión permite atravesarla y descubrir una realidad más profunda. Es el sendero de la decisión consciente.",
  15: "He representa la capacidad de permitir que una verdad transforme el corazón. No basta con comprender una idea; el verdadero cambio ocurre cuando modifica nuestra manera de sentir, decidir y vivir. Es el sendero de la integración emocional.",
  16: "Vav simboliza el puente entre la comprensión y la generosidad. Enseña que el conocimiento alcanza su plenitud cuando se convierte en servicio y ayuda a los demás. Es el sendero que une la sabiduría con el amor en acción.",
  17: "Zayin representa el paso del conocimiento a la sabiduría. Enseña a distinguir lo esencial de lo superficial y a convertir el aprendizaje en una forma de vivir. Es el sendero de la coherencia, donde las decisiones reflejan aquello que realmente importa.",
  18: "Chet representa el paso de la comprensión a los límites saludables. Enseña que comprender a los demás no implica renunciar a uno mismo y que los límites son una forma de proteger aquello que tiene valor. La verdadera madurez combina empatía con firmeza.",
  19: "Tet simboliza la integración entre la generosidad y la firmeza. Enseña que el amor más sabio sabe cuándo ayudar y cuándo permitir que los demás crezcan por sí mismos. El equilibrio convierte la compasión en una elección consciente.",
  20: "Yod representa el poder de las pequeñas acciones realizadas con intención. Enseña que la verdadera compasión consiste en hacer aquello que realmente ayuda al otro a crecer.",
  21: "Kaf simboliza la capacidad de sostener aquello que valoramos a lo largo del tiempo. Enseña que el entusiasmo inicia el camino, pero solo el compromiso constante permite construir algo duradero.",
  22: "Lamed representa el paso de los límites al equilibrio. Enseña que la verdadera fortaleza no nace del control ni de la rigidez, sino de saber combinar firmeza y compasión con serenidad.",
  23: "Mem representa la capacidad de expresar nuestras necesidades con claridad y respeto. Enseña que comunicar nuestros límites fortalece las relaciones y evita que el silencio termine convirtiéndose en resentimiento.",
  24: "Nun simboliza la perseverancia que nace al mantener nuestros valores durante y a pesar de las dificultades.",
  25: "Samekh representa la construcción de una vida coherente mediante hábitos constantes. Enseña que los valores solo se consolidan cuando se reflejan en las pequeñas decisiones que repetimos cada día.",
  26: "Ayin representa la capacidad de expresar al mundo lo que realmente somos. Enseña que la autenticidad no consiste solo en conocernos, sino en tener el valor de comunicar nuestra verdad con respeto.",
  27: "Pe representa el poder transformador de la palabra. Enseña que compartir con autenticidad aquello que hemos aprendido puede inspirar, crear y ayudar al crecimiento de otras personas.",
  28: "Tsadi simboliza la transformación de la perseverancia en hábitos. Enseña que el cambio verdadero no depende del esfuerzo extraordinario, sino de pequeñas acciones repetidas hasta formar parte de nuestra identidad.",
  29: "Qof representa el paso de la perseverancia a los resultados visibles. Enseña que toda transformación exterior nace de un largo proceso invisible y que confiar en el camino es tan importante como alcanzar la meta.",
  30: "Resh representa la coherencia y unión entre lo que pensamos, decimos y hacemos. Enseña que expresar nuestros valores solo tiene sentido cuando nuestra rutina cotidiana refleja aquello que comunicamos.",
  31: "Shin representa el momento en que aquello que expresamos deja de ser una idea y se convierte en una realidad visible. Enseña que las palabras y las decisiones solo alcanzan su verdadero valor cuando se traducen en acciones que transforman nuestra vida y nuestro entorno.",
  32: "Tav representa el último paso del viaje: convertir los valores, hábitos y aprendizajes en una forma estable de vivir. Simboliza la culminación del proceso interior, donde la persona deja de perseguir una identidad ideal y simplemente la encarna en su vida cotidiana.",
};

export const CABALA_SENDERO_ILUSTRACIONES: Record<number, Vineta[]> = Object.fromEntries(
  Array.from({ length: 22 }, (_, i) => {
    const num = i + 11;
    const texto = TEXTOS[num];
    return [num, texto ? [{ src: IMG, paragraphs: [texto] }] : placeholder()];
  }),
);

export const ilustracionSendero = (num: number): Vineta[] =>
  CABALA_SENDERO_ILUSTRACIONES[num] ?? [];
