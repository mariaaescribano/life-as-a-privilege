import type { Vineta } from "./ComicViewer";

// Cómic de Psicología: antesala de la «Línea de Vida». Se intercala al pasar del
// resultado ACE (/metodo/psicologia/:id/ace-resultado) a la línea del tiempo
// (/metodo/psicologia/:id), ANTES de que cargue la timeline y su popup de edad.
// Se puede saltar.
//
// OJO: este cómic NO forma parte de las «Ilustraciones» del material; vive solo
// en este paso del recorrido.
//
// VOZ: la primera viñeta va en «nosotros» (el hecho general) y las dos últimas
// en «tú». Dentro de una misma viñeta NO se mezclan. Ojo también con el género:
// nada de «estás listo» / «no estás solo», que la mayoría de quien lee esto es
// mujer; las fórmulas van sin marca de género.
//
// Imágenes: /viñetas/psicologia/lineatiempo/lineatiempo1.png … lineatiempo3.png.
export const COMIC_LINEA_TIEMPO: Vineta[] = [
  {
    src: "/viñetas/psicologia/lineatiempo/lineatiempo1.webp",
    paragraphs: [
      "La realidad que vivimos es fruto de nuestro autoconcepto.",
      "Nuestro autoconcepto es fruto de cómo somos capaces de narrar nuestra propia biografía.",
      "Las experiencias pasadas moldean nuestro presente y nuestro futuro.",
      "Vemos el mundo y actuamos en él desde aquello que creemos sobre nosotros mismos.",
    ],
  },
  {
    src: "/viñetas/psicologia/lineatiempo/lineatiempo2.webp",
    paragraphs: [
      "Para cambiar tu presente, primero tienes que entender tu pasado.",
      "Hay que reunir las fragmentaciones de tus recuerdos para darles significado.",
      "Solo así puedes empezar a cambiar, porque aquello que hoy quieres transformar fueron, en su día, patrones adaptativos que te ayudaron a sobrevivir a tus circunstancias.",
    ],
  },
  {
    src: "/viñetas/psicologia/lineatiempo/lineatiempo3.webp",
    paragraphs: [
      "Si estás aquí es porque tienes la fuerza para desarrollar las herramientas que te permitan navegar entre el caos y el dolor sin perderte.",
      "Tienes la fuerza para empezar a reunir esas fragmentaciones y comprender la historia que te ha traído hasta aquí.",
      "Empieza. Pero recuerda que no caminas en soledad.",
    ],
  },
];
