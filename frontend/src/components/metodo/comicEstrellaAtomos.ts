import type { Vineta } from "./ComicViewer";

// Cómic-recompensa de Fisiología: «Cómo una estrella forma los átomos».
// Se abre desde la pantalla de éxito de /metodo/fisiologia/atomos, DESPUÉS de que
// el usuario haya construido él mismo un átomo de hidrógeno (así el cómic
// recontextualiza lo que acaba de hacer). Reutiliza el ComicViewer.
//
// Imágenes: /viñetas/fisiologia/estrellas/star1.png … star6.png
// (mientras no existan, el ComicViewer pinta un placeholder «próximamente»).
export const ESTRELLA_ATOMOS: Vineta[] = [
  {
    // Viñeta de apertura: el marco («eres parte de la naturaleza») antes de
    // contar CÓMO se forjan los átomos. (Ilustración pendiente: hasta que exista
    // este archivo, el ComicViewer pinta un placeholder «próximamente».)
    src: "/viñetas/fisiologia/estrellas/star0.png",
    paragraphs: [
      "Eres parte de la naturaleza.",
      "Los átomos que te construyen, la naturaleza los va formando y reciclando.",
    ],
  },
  {
    src: "/viñetas/fisiologia/estrellas/star1.png",
    paragraphs: [
      "Para crear una estrella, las creadoras de los átomos...",
      "La gravedad reúne enormes nubes de hidrógeno, llamadas nebulosa.",
      "Poco a poco va naciendo una estrella.",
    ],
  },
  {
    src: "/viñetas/fisiologia/estrellas/star2.png",
    paragraphs: [
      "En su interior, la temperatura es tan extrema que los átomos de hidrógeno se separan de sus electrones, dejando solo sus núcleos (protones).",
      "Estos protones chocan y comienzan a unirse. Ha empezado la fusión nuclear.",
    ],
  },
  {
    src: "/viñetas/fisiologia/estrellas/star3.png",
    paragraphs: [
      "La fusión nuclear crea núcleos de helio y libera energía —por eso las estrellas brillan.",
      "Con el tiempo, la estrella fusiona esos núcleos y los transforma en nuevos elementos, como el carbono y el oxígeno.",
    ],
  },
  {
    src: "/viñetas/fisiologia/estrellas/star4.png",
    paragraphs: [
      "Las estrellas más masivas siguen fusionando elementos y fabrican átomos cada vez más pesados.",
    ],
  },
  {
    src: "/viñetas/fisiologia/estrellas/star5.png",
    paragraphs: [
      "Finalmente aparece el hierro.",
      "A partir de él, la estrella ya no puede obtener energía mediante la fusión.",
    ],
  },
  {
    src: "/viñetas/fisiologia/estrellas/star6.png",
    paragraphs: [
      "La estrella colapsa y explota.",
      "En ese instante nacen algunos de los elementos más pesados del universo, como el oro o el uranio.",
    ],
  },
];
