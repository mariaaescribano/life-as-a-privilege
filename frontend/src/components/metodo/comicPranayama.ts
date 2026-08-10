import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Cómic de PRĀṆĀYĀMA. Tres viñetas. Sale al entrar en la página de Prāṇāyāma
// (/metodo/ayurveda/dosha/:dosha/pranayama), ANTES de ver la práctica.
//
// Es IMPARCIAL a propósito: la teoría y los cuidados son los mismos para los
// tres doṣhas, así que este cómic se muestra igual se entre por Vata, por
// Pitta o por Kapha (color ayurvedaTxt, no el del doṣha). Lo único que cambia
// de un doṣha a otro es la práctica, y esa vive en la página, no aquí.
//
// Aquí es donde se cuenta TODO lo que antes eran dos boxes de texto en la
// página (el hero y «Antes de empezar»): la página quedó para practicar.
//
// El arco: qué es prāṇāyāma → cómo se practica → dónde está el límite.
//
// Imágenes: /viñetas/hinduismo/pranayama/pranayama1.webp … pranayama3.webp.
// Mientras no existan, el visor pinta «Viñeta N próximamente» y el texto se
// lee igual.
// ─────────────────────────────────────────────────────────────────────────

const P = "/viñetas/hinduismo/pranayama";

export const COMIC_PRANAYAMA: Vineta[] = [
  {
    // Viñeta 1: alguien sentado de perfil, el aire entrando como un hilo de
    // luz por la nariz y bajando hasta el vientre.
    src: `${P}/pranayama1.webp`,
    eyebrow: "",
    titulo: "",
    paragraphs: [
      "Prāṇa es la energía vital; āyāma, extender.",
      "Prāṇāyāma no es «respirar hondo»: es dirigir esa energía.",
      "Respirar es la única función automática que también puedes gobernar a voluntad. Por eso es la puerta más directa que tienes al sistema nervioso.",
    ],
  },
  {
    // Viñeta 2: la postura. Sentada, espalda larga, primera luz de la mañana,
    // la casa todavía en silencio.
    src: `${P}/pranayama2.webp`,
    titulo: "",
    paragraphs: [
      "Al inhalar el corazón se acelera; al exhalar, se frena. Si estás nervioso, alarga la exhalación.",
      "La neurociencia ha demostrado que tumbarte reduce la activación de la corteza prefrontal y facilita que te quedes dormido. Por eso, aunque al principio pueda resultar incómodo, intenta mantenerte sentado.",
    ],
  },
  {
    // Viñeta 3: el límite. La misma persona soltando la técnica y volviendo a
    // su respiración normal, sin dramatismo: parar también es practicar.
    src: `${P}/pranayama3.webp`,
    paragraphs: [
      "Sin forzar nunca. Si te falta el aire o te mareas, sueltas y vuelves a tu respiración normal.",
      "Si estás embarazada, tienes la tensión alta, glaucoma, epilepsia o un problema cardíaco, evita las retenciones y las respiraciones rápidas, pero puedes hacer esta práctica.",
    ],
  },
];
