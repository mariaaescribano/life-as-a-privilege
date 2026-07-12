import type { Vineta } from "./ComicViewer";

// Cómic de Fisiología: «La Vida secreta de la célula». Va ENTRE la pantalla de
// Estructuras celulares y la de «Crea la célula»: se abre al terminar de montar
// las cuatro estructuras y, al acabarlo, lleva a construir la célula. También
// aparece en la galería de Ilustraciones.
//
// Imágenes: /viñetas/fisiologia/celulaviva/celula1.png … celula8.png
// (mientras no existan, el ComicViewer pinta un placeholder «próximamente»).
export const CELULA_VIVA: Vineta[] = [
  {
    src: "/viñetas/fisiologia/celulaviva/celula1.png",
    paragraphs: [
      "Cada una de tus células es una pequeña ciudad viva. En su interior, millones de procesos ocurren al servicio de tu existencia.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulaviva/celula2.png",
    titulo: "La membrana",
    paragraphs: [
      "La membrana celular protege la ciudad y controla cuidadosamente qué puede entrar y qué debe salir.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulaviva/celula3.png",
    titulo: "El núcleo",
    paragraphs: [
      "En el núcleo se guarda el ADN: el gran libro de instrucciones que contiene toda la información necesaria para que la célula funcione.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulaviva/celula4.png",
    titulo: "Los ribosomas",
    paragraphs: [
      "Los ribosomas leen las instrucciones del ADN y construyen proteínas, las herramientas que permiten trabajar a la célula.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulaviva/celula5.png",
    titulo: "Las enzimas",
    paragraphs: [
      "Las enzimas son las trabajadoras de la célula. Aceleran miles de reacciones químicas y hacen posible que la vida ocurra.",
      "Sin ellas, muchas reacciones tardarían años o incluso siglos en producirse.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulaviva/celula6.png",
    titulo: "La mitocondria",
    paragraphs: [
      "Toda esa actividad necesita energía. Las mitocondrias transforman los nutrientes y el oxígeno en el combustible, científicamente llamado ATP, que alimenta toda la ciudad.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulaviva/celula7.png",
    titulo: "Todo funciona junto",
    paragraphs: [
      "Ninguna estructura podría mantener viva la célula por sí sola. Solo cuando todas trabajan juntas aparece aquello que llamamos vida.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulaviva/celula8.png",
    paragraphs: [
      "En una sola célula ocurren millones de reacciones cada segundo. Y tu cuerpo está formado por billones de ellas.",
      "Mientras lees estas palabras, un universo entero trabaja en silencio para mantenerte con vida.",
    ],
  },
];
