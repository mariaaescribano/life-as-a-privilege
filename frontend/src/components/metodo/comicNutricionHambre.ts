import type { Vineta } from "./ComicViewer";

// Cómic de transición «El hambre»: ¿qué ocurre en tu cuerpo cuando pasan horas
// sin comer? Va ENTRE la Microbiota (/metodo/nutricion/microbiota) y la página
// de El hambre (/metodo/nutricion/hambre): se abre al pulsar «El hambre →» y
// termina navegando allí.
//
// Imágenes: /viñetas/nutricion/hambre/hambre1.png … hambre9.png (PENDIENTES).
export const NUTRICION_HAMBRE: Vineta[] = [
  {
    src: "/viñetas/nutricion/hambre/hambre1.webp",
    titulo: "El estómago termina la digestión",
    paragraphs: [
      "Después de varias horas desde la última comida, el estómago termina de vaciar su contenido hacia el intestino delgado.",
      "Los nutrientes procedentes de esa comida ya han sido absorbidos en gran parte y el organismo entra en el periodo entre comidas, conocido como estado posabsortivo.",
    ],
  },
  {
    src: "/viñetas/nutricion/hambre/hambre2.webp",
    titulo: "Empieza la «autolimpieza» del intestino",
    paragraphs: [
      "Cuando el estómago y el intestino permanecen vacíos durante aproximadamente 90–120 minutos, se activa el Complejo Motor Migratorio (CMM).",
      "Consiste en una serie de potentes contracciones coordinadas que recorren el tubo digestivo, empujando restos de alimentos, bacterias y secreciones hacia el colon.",
      "Este mecanismo ayuda a mantener el intestino limpio y limita el crecimiento excesivo de bacterias en el intestino delgado.",
      "Curiosidad: cada vez que comemos, el CMM se detiene y vuelve a empezar cuando el intestino permanece vacío el tiempo suficiente.",
    ],
  },
  {
    src: "/viñetas/nutricion/hambre/hambre3.webp",
    titulo: "Aparece la señal de hambre",
    paragraphs: [
      "Mientras el aparato digestivo permanece vacío, aumenta la producción de grelina, una hormona sintetizada principalmente en el estómago.",
      "La grelina viaja hasta el hipotálamo, donde activa las neuronas responsables de la sensación de hambre y favorece la búsqueda de alimento.",
    ],
  },
  {
    src: "/viñetas/nutricion/hambre/hambre4.webp",
    titulo: "El cuerpo utiliza el glucógeno",
    paragraphs: [
      "Como ya no llegan nutrientes nuevos, el organismo utiliza primero las reservas de glucógeno hepático, que permiten mantener estable la concentración de glucosa en sangre durante varias horas.",
      "El cerebro continúa recibiendo glucosa mientras estas reservas están disponibles.",
    ],
  },
  {
    src: "/viñetas/nutricion/hambre/hambre5.webp",
    titulo: "¿Por qué algunas personas sienten dolor de cabeza o debilidad?",
    paragraphs: [
      "Durante este periodo algunas personas experimentan hambre intensa, cansancio, dificultad para concentrarse, irritabilidad o dolor de cabeza.",
      "Estas sensaciones pueden deberse a la adaptación al ayuno, a ligeras disminuciones de glucosa en personas sensibles, a la deshidratación o incluso a la retirada de cafeína si se consumía habitualmente.",
      "Importante: no todas las personas presentan estos síntomas.",
    ],
  },
  {
    src: "/viñetas/nutricion/hambre/hambre6.webp",
    titulo: "El cuerpo empieza a utilizar la grasa",
    paragraphs: [
      "Cuando el ayuno continúa, disminuye la insulina y aumenta la liberación de ácidos grasos desde el tejido adiposo.",
      "Muchos órganos, como el músculo, comienzan a utilizar esa grasa como combustible, reservando la glucosa para aquellos tejidos que más la necesitan.",
    ],
  },
  {
    src: "/viñetas/nutricion/hambre/hambre7.webp",
    titulo: "Si existe exceso de grasa corporal",
    paragraphs: [
      "En personas con sobrepeso u obesidad, las reservas de grasa son mayores.",
      "Si existe un déficit calórico adecuado y supervisado, el organismo puede utilizar parte de esas reservas para obtener energía.",
      "Con el tiempo esto puede favorecer la reducción de grasa corporal y mejorar parámetros como la sensibilidad a la insulina, la presión arterial y la salud metabólica.",
      "Es importante diferenciar esto de «pasar hambre»: el objetivo no es sufrir hambre intensa, sino mantener un balance energético adecuado.",
    ],
  },
  {
    src: "/viñetas/nutricion/hambre/hambre8.webp",
    titulo: "Adaptación metabólica",
    paragraphs: [
      "Tras varias horas sin comer, el organismo mejora progresivamente su capacidad para oxidar grasas y, si el ayuno se prolonga, el hígado comienza a producir pequeñas cantidades de cuerpos cetónicos.",
      "Muchas personas refieren que, una vez superada la fase inicial, la sensación de hambre disminuye porque el organismo utiliza con mayor eficacia sus reservas energéticas.",
    ],
  },
  {
    src: "/viñetas/nutricion/hambre/hambre9.webp",
    titulo: "Volvemos a comer",
    paragraphs: [
      "Cuando ingerimos alimentos, el estómago vuelve a llenarse, el Complejo Motor Migratorio se detiene y comienza nuevamente la digestión.",
      "Aumentan la glucosa y la insulina, disminuye la grelina y aparecen hormonas de la saciedad, como GLP-1, PYY y colecistoquinina (CCK), que informan al cerebro de que ya hemos comido suficiente.",
    ],
  },
];
