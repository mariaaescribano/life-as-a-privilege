import type { Vineta } from "./ComicViewer";

// Cómic de Psicología: «La desconexión». Se intercala ENTRE el test DES-II
// (/metodo/psicologia/:id/des) y su resultado (.../des-resultado): explica qué es
// la disociación, cómo se vive y por qué aparece cuando el dolor es demasiado.
//
// Va DESPUÉS de responder a propósito: si se explicara antes, la persona
// respondería a la idea de disociación en vez de a su experiencia (o se
// alarmaría). Es la misma decisión que en el cómic de los ACE.
//
// OJO: este cómic NO forma parte de las «Ilustraciones» del material; vive solo
// en este paso del recorrido.
//
// 🖼️  Las cuatro acuarelas, en /public/viñetas/psicologia/disociacion/ (lote 39
//     de scripts/webp: 1000 px, calidad 88 por los hilos dorados finos):
//     disociacion1.webp · sobrepasada: encogida en el suelo y, alrededor, todo
//         lo vivido a la vez (caras, un reloj, retratos por el suelo).
//     disociacion2.webp · la separación: el cuerpo sentado abajo y la parte
//         luminosa que se eleva y se aleja, unida todavía por hilos.
//     disociacion3.webp · verse desde fuera: la figura grande de espaldas
//         mirando a la pequeña que sigue viviendo la escena.
//     disociacion4.webp · queda registrado: la niña con su osito dentro de una
//         esfera de luz, intacta y aparte, y las piezas de puzle sin encajar.
//
// ⚠️  Si se cambia alguna foto, mantener el emparejamiento: cada viñeta se
//     entiende con la suya (la 2 es la separación, la 3 el mirarse desde fuera).
export const COMIC_DISOCIACION: Vineta[] = [
  {
    src: "/viñetas/psicologia/disociacion/disociacion1.webp",
    titulo: "",
    paragraphs: [
      "Cuando ocurre un evento que sobrepasa nuestra capacidad de afrontamiento, nuestra forma de entender lo que está sucediendo o nuestra tolerancia, podemos tener dificultades para procesar e integrar todo lo que estamos viviendo.",
      "Cuando una experiencia supera las herramientas que tenemos para afrontarla, nuestra mente puede buscar diferentes formas de protegernos.",
    ],
  },
  {
    src: "/viñetas/psicologia/disociacion/disociacion2.webp",
    titulo: "",
    paragraphs: [
      "Es entonces cuando puede aparecer la disociación.",
      "Podemos entenderla como una especie de separación: una parte de nuestra experiencia permanece conectada con lo que está ocurriendo mientras otra toma distancia.",
      "Es como si una parte de ti estuviera viviendo el problema mientras otra se alejara de él para no experimentar todo su dolor.",
    ],
  },
  {
    src: "/viñetas/psicologia/disociacion/disociacion3.webp",
    titulo: "",
    paragraphs: [
      "Por eso, en ocasiones, podemos experimentar lo que está ocurriendo como si lo estuviéramos viendo desde fuera, como si le estuviera pasando a otra persona.",
      "Al tomar distancia de nosotros mismos y de lo que estamos viviendo, podemos observarlo sin sentirlo con la misma intensidad.",
      "El acontecimiento ha ocurrido, pero emocionalmente nos hemos alejado de él.",
    ],
  },
  {
    src: "/viñetas/psicologia/disociacion/disociacion4.webp",
    titulo: "",
    paragraphs: [
      "Esto no significa que el acontecimiento desaparezca. Ha ocurrido y queda registrado en nuestra memoria, pero en ese momento puede no haber sido posible procesarlo de una manera integrada.",
      "Cuando el dolor es demasiado grande y no tenemos las herramientas necesarias para enfrentarnos a él, la mente puede distanciarse de la experiencia para protegernos.",
      "No es que no haya sucedido. Es que, para poder soportarlo, una parte de nuestra experiencia tuvo que alejarse.",
    ],
  },
];
