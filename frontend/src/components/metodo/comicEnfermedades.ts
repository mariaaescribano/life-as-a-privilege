import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Cómic de MEDICINA CHINA: «Las enfermedades». Seis viñetas. Se intercala
// ENTRE Los ciclos (/metodo/tcm/ciclos) y el Diagnóstico final
// (/metodo/tcm/diagnostico): ya ha visto cómo se generan y se controlan los
// cinco elementos, y aquí se cuenta qué pasa cuando esos ciclos se rompen —
// justo antes de que la página siguiente le dé su propio diagnóstico.
//
// OJO: este cómic NO está en las «Ilustraciones» de TCM (que son Origen, Yin
// Yang, Los Cinco Elementos y El Alma Humana); vive solo en este paso.
//
// SIN TÍTULOS: el guion venía con encabezados (Introducción, Calor, Frío…) que
// aquí NO se pintan; cada viñeta va solo con su texto, como los cómics de
// Psicología. El orden de las viñetas es el de los patrones: introducción,
// Calor, Frío, Humedad y Flema, Estancamiento de Qi y Deficiencia.
//
// Imágenes: /viñetas/tcm/enfermedades/enfermedades1.webp … enfermedades6.webp.
// ─────────────────────────────────────────────────────────────────────────

const P = "/viñetas/tcm/enfermedades";

export const VINETAS_ENFERMEDADES: Vineta[] = [
  {
    src: `${P}/enfermedades1.webp`,
    paragraphs: [
      "En Medicina Tradicional China (MTC), la enfermedad no se entiende únicamente como un síntoma aislado, sino como el resultado de un desequilibrio en la circulación del Qi y en la armonía entre Yin y Yang.",
      "Los patrones más frecuentes son el Calor, el Frío, la Humedad, la Flema, el Estancamiento de Qi y la Deficiencia.",
    ],
  },
  {
    src: `${P}/enfermedades2.webp`,
    paragraphs: [
      "El patrón de Calor se caracteriza por un exceso de actividad o energía que consume los líquidos corporales.",
      "Suele manifestarse con fiebre, sed, irritabilidad, enrojecimiento, inflamación o sensación intensa de calor. El tratamiento busca disipar el calor y restaurar el equilibrio.",
    ],
  },
  {
    src: `${P}/enfermedades3.webp`,
    paragraphs: [
      "El patrón de Frío ralentiza las funciones del organismo y dificulta la circulación del Qi y la Sangre.",
      "Sus manifestaciones más habituales son el frío corporal, las extremidades frías, el dolor que mejora con el calor y la fatiga. El objetivo terapéutico es calentar el organismo y fortalecer el Yang.",
    ],
  },
  {
    src: `${P}/enfermedades4.webp`,
    paragraphs: [
      "La Humedad y la Flema aparecen cuando los líquidos corporales no se transforman correctamente.",
      "Producen sensación de pesadez, digestiones lentas, mucosidad, mareo o dificultad para concentrarse. El tratamiento se orienta a eliminar la humedad, transformar la flema y favorecer el movimiento del Qi.",
    ],
  },
  {
    src: `${P}/enfermedades5.webp`,
    paragraphs: [
      "Cuando el Qi deja de circular con fluidez, aparecen dolor, tensión, distensión abdominal, cambios emocionales o sensación de opresión.",
      "El estrés y las emociones mantenidas son causas frecuentes de este patrón. La terapia busca restablecer la libre circulación del Qi.",
    ],
  },
  {
    src: `${P}/enfermedades6.webp`,
    paragraphs: [
      "La Deficiencia de Qi, Yin o Yang refleja una disminución de la capacidad funcional del organismo.",
      "Puede manifestarse como cansancio, debilidad, sequedad, sensación de frío o pérdida de vitalidad.",
      "En Medicina Tradicional China, el tratamiento siempre se adapta al patrón de desequilibrio de cada persona para recuperar la armonía del organismo.",
    ],
  },
];
