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
    src: "/viñetas/fisiologia/celulacomic/celula1.webp",
    paragraphs: [
      "Cada una de tus células es una pequeña ciudad viva.",
      "En su interior, millones de procesos ocurren al servicio de tu existencia.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulacomic/celula2.webp",
    titulo: "",
    paragraphs: [
      "La membrana celular protege la ciudad y controla cuidadosamente qué puede entrar y qué debe salir.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulacomic/celula3.webp",
    titulo: "",
    paragraphs: [
      "En el núcleo se guarda el ADN: el gran libro de instrucciones que contiene toda la información necesaria para que la célula funcione.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulacomic/celula4.webp",
    titulo: "",
    paragraphs: [
      "Los ribosomas leen las instrucciones del ADN y construyen enzimas, las herramientas que permiten trabajar a la célula.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulacomic/celula5.webp",
    titulo: "",
    paragraphs: [
      "Las enzimas son las trabajadoras de la célula. Aceleran miles de reacciones químicas y hacen posible que la Vida ocurra.",
      "Sin ellas, muchas reacciones tardarían años o incluso siglos en producirse.",
    ],
  },
  {
    src: "/viñetas/fisiologia/celulacomic/celula6.webp",
    titulo: "",
    paragraphs: [
      "Toda esa actividad necesita energía.",
      "Las enzimas de las mitocondrias transforman los nutrientes y el oxígeno en el combustible, científicamente llamado ATP.",
      "Esta energía permite que las enzimas hagan su misión y gracias a eso, nuestras células pueden reconstruirse cada día."
    ],
  },
  {
    src: "/viñetas/fisiologia/celulacomic/celula7.webp",
    titulo: "",
    paragraphs: [
      "Ninguna estructura podría mantener viva la célula por sí sola.",
      "Solo cuando todas trabajan juntas aparece aquello que llamamos Vida.",
    ],
  },
  {
    // Zoom-out final: reutiliza la PRIMERA foto del cómic (celula1.png) para
    // cerrar el círculo volviendo a la imagen de apertura.
    src: "/viñetas/fisiologia/celulacomic/celula1.webp",
    paragraphs: [
      "En una sola célula ocurren millones de reacciones cada segundo. Y tu cuerpo está formado por billones de ellas.",
      "Mientras lees estas palabras, un universo entero trabaja en silencio para mantenerte con Vida.",
    ],
  },
];
