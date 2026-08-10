import type { Vineta } from "./ComicViewer";

// Cómic de Psicología: «El problema nunca es el problema». Se intercala antes de
// la Síntesis (/metodo/psicologia/:id/sintesis): el problema visible es solo un
// síntoma de patrones de supervivencia aprendidos en la infancia; el cierre
// invita a hacerse cargo de uno mismo. Se puede saltar.
//
// OJO: este cómic vive solo en este paso del recorrido (no está en la galería
// de Ilustraciones).
//
// Imágenes: /viñetas/psicologia/sintesis/sintesis1.webp … sintesis3.webp.
export const COMIC_SINTESIS: Vineta[] = [
  {
    src: "/viñetas/psicologia/sintesis/sintesis1.webp",
    titulo: "",
    paragraphs: [
      "Todos creemos que el problema es el problema.",
      "Si fumas, el problema es el tabaco.",
      "Si comes demasiado o no comes, el problema es la comida.",
      "Si explotas con tu pareja, el problema es la ira.",
      "Pero no.",
      "Eso es solo la parte que puedes ver.",
    ],
  },
  {
    src: "/viñetas/psicologia/sintesis/sintesis2.webp",
    titulo: "",
    paragraphs: [
      "Lo que llamas «problema» suele ser un síntoma de que sigues sobreviviendo desde patrones que aprendiste en la infancia.",
      "Tu ansiedad, tu rabia, tu necesidad de controlar, de agradar o de aislarte... son intentos de gestionar un dolor que, durante mucho tiempo, no pudo sentirse.",
      "Una parte de ti sigue pidiendo ser vista.",
      "No porque quiera manipular.",
      "Porque necesita que su dolor, por fin, sea legítimo.",
    ],
  },
  {
    src: "/viñetas/psicologia/sintesis/sintesis3.webp",
    titulo: "",
    paragraphs: [
      "Ya entiendes de dónde nace esa reivindicación.",
      "Ya viste tus heridas, tus nudos y tus miedos.",
      "Ahora te toca hacerte cargo de ti.",
      "Este camino no consiste en dejar de sentir, sino en dejar de abandonarte.",
      "Ahora te toca ser el padre, la madre, la seguridad, la nutrición y el amor que un día necesitaste.",
      "Porque amar también es aceptar todas las partes de ti, incluso aquellas que aprendieron a sobrevivir.",
      "El síntoma no es el enemigo. Es el último intento de una parte de ti por ser escuchada.",
    ],
  },
];
