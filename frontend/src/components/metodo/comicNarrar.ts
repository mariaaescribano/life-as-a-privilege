import type { Vineta } from "./ComicViewer";

// Cómic de Psicología: «Narrar». Se intercala ENTRE Tus heridas
// (/metodo/psicologia/:id/heridas-lista) y Narra (.../regulacion): justo después
// de haber puesto nombre a las heridas y antes de empezar a contarlas, explica
// por qué narrar lo vivido cambia algo — aunque no cambie los hechos.
//
// El arco: la memoria no es una lista de hechos → poner palabras ordena → el
// silencio no elabora → la historia que te cuentas construye identidad →
// narrar necesita a alguien que escuche.
//
// VOZ: las tres primeras viñetas van en «nosotros» (el hecho general, que da
// distancia) y las dos últimas en «tú» (su historia, que es lo que la página
// siguiente le pide escribir). Dentro de una misma viñeta NO se mezclan: el
// cambio de persona se hace al pasar de viñeta, nunca en la última frase.
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
      "Nuestra mente no almacena nuestras experiencias como una lista de hechos.",
      "Solemos recordar fragmentos, las interpretamos según nuestro estado físico y mental, y les damos un significado nuevo cada vez.",
    ],
  },
  {
    src: `${P}/narrar2.webp`,
    titulo: "",
    paragraphs: [
      "Narrar una experiencia permite poner palabras a pensamientos y emociones que pueden resultar difíciles de identificar.",
      "Al construir un relato, podemos organizar acontecimientos que antes parecían desconectados.",
      "Por eso, hablar sobre nuestras experiencias puede ayudarnos a comprender mejor qué ocurrió, cómo nos afectó y qué significado tiene para nosotros.",
    ],
  },
  {
    src: `${P}/narrar3.webp`,
    titulo: "",
    paragraphs: [
      "Cuando una experiencia dolorosa permanece completamente silenciada, siempre resulta más difícil elaborarla.",
      "El miedo, la vergüenza o la sensación de no ser comprendido pueden hacer que una persona prefiera no contar lo que ha vivido.",
      "Se cree que si no se habla de ello, entonces deja de doler.",
      "Pero callar nunca significa superar.",
      "Poder expresar lo vivido en un entorno seguro permite comenzar a procesar lo ocurrido y a integrarlo como parte de nuestra historia.",
    ],
  },
  {
    src: `${P}/narrar4.webp`,
    titulo: "",
    paragraphs: [
      "Las historias que te cuentas sobre ti también participan en la construcción de tu identidad y, por extensión, de tu realidad.",
      "No eres únicamente aquello que te ocurrió, sino también la manera en que interpretas y narras esas experiencias.",
      "Cambiar tu manera de comprender el pasado no significa cambiar los hechos, significa poder encontrar nuevos significados y reconocer también tu capacidad de afrontar, aprender y cambiar.",
    ],
  },
  {
    src: `${P}/narrar5.webp`,
    titulo: "",
    paragraphs: [
      "Narrar necesita también de alguien que escuche. Que te escuchen y te validen te da un espacio seguro en el que poder decir aquello que antes no podías decir.",
      "No puedes cambiar lo que ocurrió, pero puedes darle otro significado.",
      "Narrar puede ser una herramienta importante para comprender tus experiencias, tus emociones y tu identidad.",
      "No se trata simplemente de contar el pasado, sino de poder integrarlo dentro de tu propia historia con un sentido que te permita evolucionar.",
      "Narrar no cambia lo que ocurrió. Pero puede cambiar la manera en que lo comprendes y el lugar que ocupa en ti.",
    ],
  },
];
