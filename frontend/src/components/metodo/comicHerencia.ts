import type { Vineta } from "./ComicViewer";

// Cómic de Psicología: «Lo que se hereda». Se intercala ENTRE Tu familia
// (/metodo/psicologia/:id/familia) y el Genograma (.../genograma): justo antes
// de escribir la ficha de cada persona del mapa, explica por qué ese mapa
// importa — epigenética, trauma intergeneracional y patrones que se repiten
// sin que haya una transmisión genética directa.
//
// El arco: los genes no lo explican todo → el impacto del trauma → qué
// significa (y qué no) «trauma heredado» → el ciclo familiar → romper el ciclo.
//
// OJO: este cómic NO forma parte de las «Ilustraciones» del material; vive solo
// en este paso del recorrido (igual que COMIC_ACE y COMIC_CREENCIAS).
//
// Imágenes: /viñetas/psicologia/herencia/herencia1.webp … herencia5.webp.
const P = "/viñetas/psicologia/herencia";

export const COMIC_HERENCIA: Vineta[] = [
  {
    src: `${P}/herencia1.webp`,
    titulo: "",
    paragraphs: [
      "Durante mucho tiempo se pensó que nuestros genes determinaban prácticamente todo lo relacionado con nuestras características y nuestra salud. Sin embargo, la genética no funciona de manera tan sencilla.",
      "La epigenética estudia cambios en la regulación de la actividad de los genes que pueden producirse en respuesta a diferentes factores, sin cambiar la secuencia del ADN.",
      "El ambiente, tus respuestas internas, el estrés, la alimentación o determinadas experiencias pueden influir en la expresión génica.",
    ],
  },
  {
    src: `${P}/herencia2.webp`,
    titulo: "",
    paragraphs: [
      "Las experiencias intensamente estresantes pueden producir cambios importantes en el organismo. El estrés prolongado puede afectar, entre otros sistemas, a los mecanismos relacionados con la respuesta al estrés.",
      "— «Aunque haya pasado el peligro, mi cuerpo sigue reaccionando como si tuviera que protegerse.»",
      "La investigación científica ha estudiado si algunas de estas experiencias pueden estar relacionadas con cambios epigenéticos. Esto ha abierto una pregunta especialmente compleja: ¿pueden algunos efectos asociados al trauma llegar a influir en generaciones posteriores?",
    ],
  },
  {
    src: `${P}/herencia3.webp`,
    titulo: "",
    paragraphs: [
      "Aquí aparece el concepto de trauma intergeneracional. Se utiliza para estudiar cómo las consecuencias de experiencias traumáticas pueden aparecer o transmitirse entre generaciones.",
      "— Hija: «Pero yo nunca viví aquello que vivieron mis familiares. ¿Cómo podría afectarme?»",
      "Existen diferentes mecanismos posibles. Algunos investigadores estudian cambios biológicos y epigenéticos, mientras que otros destacan la transmisión familiar de comportamientos, emociones, formas de crianza y respuestas al estrés.",
      "Por eso, hablar de «trauma heredado» no significa afirmar que un recuerdo traumático se transmite directamente a través del ADN.",
    ],
  },
  {
    src: `${P}/herencia4.webp`,
    titulo: "",
    paragraphs: [
      "El trauma también puede transmitirse de manera psicológica y social. Una persona que ha vivido experiencias traumáticas puede desarrollar determinadas formas de relacionarse con sus hijos, por ejemplo, mediante miedo, sobreprotección, silencio emocional o dificultad para confiar.",
      "— Madre: «A mí me enseñaron que de los problemas no se habla.»",
      "— Hija: «Entonces yo tampoco aprendí a hablar de lo que siento.»",
      "De esta manera, ciertos patrones pueden repetirse de una generación a otra sin que exista necesariamente una transmisión genética directa.",
    ],
  },
  {
    src: `${P}/herencia5.webp`,
    titulo: "",
    paragraphs: [
      "Sin embargo, una historia familiar no determina nuestro futuro. Comprender los patrones familiares, recibir apoyo y trabajar las experiencias traumáticas puede ayudar a modificar la manera en que respondemos ante ellas.",
      "— «Lo que ocurrió en mi familia forma parte de mi historia, pero no tiene por qué decidir cómo será mi futuro.»",
    ],
  },
];
