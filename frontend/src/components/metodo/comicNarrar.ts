import type { Vineta } from "./ComicViewer";

// Cómic de Psicología: «Narrar». Se intercala ENTRE Tus heridas
// (/metodo/psicologia/:id/heridas-lista) y Narra (.../regulacion): justo después
// de haber puesto nombre a las heridas y antes de empezar a contarlas, explica
// por qué narrar lo vivido cambia algo — aunque no cambie los hechos.
//
// El arco: la memoria no es una lista de hechos → poner palabras ordena → el
// silencio no elabora → la historia que nos contamos construye identidad →
// narrar necesita a alguien que escuche.
//
// OJO: este cómic NO forma parte de las «Ilustraciones» del material; vive solo
// en este paso del recorrido (igual que COMIC_ACE y COMIC_CREENCIAS).
//
// Imágenes: /viñetas/psicologia/narrar/narrar1.webp … narrar5.webp.
const P = "/viñetas/psicologia/narrar";

export const COMIC_NARRAR: Vineta[] = [
  {
    src: `${P}/narrar1.webp`,
    titulo: "",
    paragraphs: [
      "A lo largo de nuestra Vida vivimos experiencias que pueden ser difíciles de comprender. Algunas son agradables, otras dolorosas y otras son enterradas bajo el silencio.",
      "— «Sé lo que ocurrió… pero cuando intento explicarlo, no sé por dónde empezar.»",
      "Nuestra mente no almacena nuestras experiencias como una lista de hechos. Sino que recordamos fragmentos, las interpretamos según nuestro estado físico y mental, y les damos un significado nuevo cada vez.",
    ],
  },
  {
    src: `${P}/narrar2.webp`,
    titulo: "",
    paragraphs: [
      "Narrar una experiencia permite poner palabras a pensamientos y emociones que pueden resultar difíciles de identificar. Al construir un relato, podemos organizar acontecimientos que antes parecían desconectados.",
      "Por eso, hablar sobre nuestras experiencias puede ayudarnos a comprender mejor qué ocurrió, cómo nos afectó y qué significado tiene para nosotros.",
    ],
  },
  {
    src: `${P}/narrar3.webp`,
    titulo: "",
    paragraphs: [
      "Cuando una experiencia dolorosa permanece completamente silenciada, puede resultar más difícil elaborarla. El miedo, la vergüenza o la sensación de no ser comprendido pueden hacer que una persona prefiera no contar lo que ha vivido.",
      "— Hijo: «Si no hablo de ello, quizá deje de doler.»",
      "Pero callar nunca significa superar. En algunas situaciones, poder expresar lo vivido en un entorno seguro permite comenzar a procesarlo.",
    ],
  },
  {
    src: `${P}/narrar4.webp`,
    titulo: "",
    paragraphs: [
      "Las historias que contamos sobre nosotros mismos también participan en la construcción de nuestra identidad y, por extensión, de nuestra realidad. No somos únicamente aquello que nos ocurrió, sino también la manera en que interpretamos y narramos esas experiencias.",
      "Cambiar nuestra manera de comprender el pasado no significa cambiar los hechos. Significa poder encontrar nuevos significados y reconocer también nuestra capacidad de afrontar, aprender y cambiar.",
    ],
  },
  {
    src: `${P}/narrar5.webp`,
    titulo: "",
    paragraphs: [
      "Narrar necesita también de alguien que escuche. Sentirse escuchado y validado puede proporcionar un espacio de seguridad en el que una persona pueda expresar aquello que antes no podía decir.",
      "No puedes cambiar lo que ocurrió, pero puedes darle otro significado.",
      "La narración puede ser una herramienta importante para comprender las experiencias, las emociones y la identidad. No se trata simplemente de contar el pasado, sino de poder integrarlo dentro de nuestra propia historia con un sentido que nos permita evolucionar.",
      "Narrar no cambia lo que ocurrió. Pero puede cambiar la manera en que comprendemos lo ocurrido y el lugar que ocupa en nuestra historia.",
    ],
  },
];
