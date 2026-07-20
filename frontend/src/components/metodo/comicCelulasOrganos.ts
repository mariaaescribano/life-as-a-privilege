import type { Vineta } from "./ComicViewer";

// Cómic de Fisiología: «De una célula a un órgano». Se intercala ANTES de entrar
// a «Todas tus células» (/metodo/fisiologia/todas-tus-celulas): cuenta cómo desde
// el cigoto, por divisiones y diferenciación, las células se agrupan en tejidos y
// estos en órganos. Sin títulos: cada viñeta va solo con su explicación, y cada
// frase se pinta como su propio bloque (texto aireado).
//
// Imágenes: /viñetas/fisiologia/cigoto/cigoto1.png … cigoto7.png (una por
// viñeta). Mientras no existan, el ComicViewer muestra su loader/fallback.
export const CELULAS_ORGANOS: Vineta[] = [
  {
    src: "/viñetas/fisiologia/cigoto/cigoto1.png",
    paragraphs: [
      "Todo comienza con una única célula llamada cigoto, formada tras la unión del óvulo y el espermatozoide.",
      "Esta célula contiene toda la información genética necesaria para construir un organismo completo y será el punto de partida de millones de futuras células.",
    ],
  },
  {
    src: "/viñetas/fisiologia/cigoto/cigoto2.png",
    paragraphs: [
      "El cigoto realiza su primera mitosis, dividiéndose en dos células hijas idénticas.",
      "Ambas conservan exactamente la misma información genética y continúan siendo capaces de originar cualquier tejido del organismo.",
    ],
  },
  {
    src: "/viñetas/fisiologia/cigoto/cigoto3.png",
    paragraphs: [
      "Las divisiones continúan rápidamente: dos células se convierten en cuatro, luego en ocho, dieciséis y muchas más.",
      "Se forma una estructura compacta denominada mórula, donde todas las células permanecen unidas.",
    ],
  },
  {
    src: "/viñetas/fisiologia/cigoto/cigoto4.png",
    paragraphs: [
      "Las células siguen dividiéndose y reorganizándose hasta formar el blastocisto, una estructura con una cavidad interna donde ya empiezan a distinguirse grupos celulares que tendrán funciones diferentes durante el desarrollo.",
    ],
  },
  {
    src: "/viñetas/fisiologia/cigoto/cigoto5.png",
    paragraphs: [
      "A medida que el embrión crece, las células dejan de ser iguales.",
      "Mediante un proceso llamado diferenciación celular, algunas se transforman en células musculares, otras en neuronas, células epiteliales o células sanguíneas, entre muchos otros tipos.",
    ],
  },
  {
    src: "/viñetas/fisiologia/cigoto/cigoto6.png",
    paragraphs: [
      "Las células especializadas se agrupan con otras del mismo tipo y forman tejidos, estructuras organizadas donde todas colaboran realizando una misma función.",
      "Cada tejido será una pieza fundamental para construir un órgano.",
    ],
  },
  {
    src: "/viñetas/fisiologia/cigoto/cigoto7.png",
    paragraphs: [
      "Diferentes tejidos se integran de forma precisa para formar un órgano funcional, como el corazón, el pulmón o el intestino.",
      "Aunque parezca una única estructura, está compuesto por millones de células descendientes de aquella primera célula inicial.",
    ],
  },
];
