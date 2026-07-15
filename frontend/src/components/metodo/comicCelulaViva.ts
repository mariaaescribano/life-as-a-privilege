import type { Vineta } from "./ComicViewer";

// Cómic de Fisiología: «La Vida secreta de la célula». Va ENTRE la pantalla de
// Estructuras celulares y la de «Crea la célula»: se abre al terminar de montar
// las cuatro estructuras y, al acabarlo, lleva a construir la célula. También
// aparece en la galería de Ilustraciones.
//
// Imágenes: /viñetas/fisiologia/celulacomic/celula1.png … celula7.png (ya están,
// una por viñeta 1-7). La 8ª (el zoom-out final) reutiliza celula1.png para
// cerrar el círculo volviendo a la imagen de apertura.
export const CELULA_VIVA: Vineta[] = [
  {
    src: "/viñetas/fisiologia/celulacomic/celula1.png",
    paragraphs: [
      "Cada una de tus células es una pequeña ciudad viva.",
      "En su interior, millones de procesos ocurren al servicio de tu existencia.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulacomic/celula2.png",
    titulo: "La membrana",
    paragraphs: [
      "La membrana celular protege la ciudad y controla cuidadosamente qué puede entrar y qué debe salir.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulacomic/celula3.png",
    titulo: "El núcleo",
    paragraphs: [
      "En el núcleo se guarda el ADN: el gran libro de instrucciones que contiene toda la información necesaria para que la célula funcione.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulacomic/celula4.png",
    titulo: "Los ribosomas",
    paragraphs: [
      "Los ribosomas leen las instrucciones del ADN y construyen enzimas, las herramientas que permiten trabajar a la célula.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulacomic/celula5.png",
    titulo: "Las enzimas",
    paragraphs: [
      "Las enzimas son las trabajadoras de la célula. Aceleran miles de reacciones químicas y hacen posible que la vida ocurra.",
      "Sin ellas, muchas reacciones tardarían años o incluso siglos en producirse.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulacomic/celula6.png",
    titulo: "La mitocondria",
    paragraphs: [
      "Toda esa actividad necesita energía. Las mitocondrias transforman los nutrientes y el oxígeno en el combustible, científicamente llamado ATP, que alimenta todas las partes de la célula.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulacomic/celula7.png",
    titulo: "Todo funciona junto",
    paragraphs: [
      "Ninguna estructura podría mantener viva la célula por sí sola. Solo cuando todas trabajan juntas aparece aquello que llamamos Vida.",
    ],
  },
  {
    // Zoom-out final: reutiliza la PRIMERA foto del cómic (celula1.png) para
    // cerrar el círculo volviendo a la imagen de apertura.
    src: "/viñetas/fisiologia/celulacomic/celula1.png",
    paragraphs: [
      "En una sola célula ocurren millones de reacciones cada segundo. Y tu cuerpo está formado por billones de ellas.",
      "Mientras lees estas palabras, un universo entero trabaja en silencio para mantenerte con Vida.",
    ],
  },
];
