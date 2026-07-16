import type { Vineta } from "./ComicViewer";

// Cómic de transición «La microbiota». Va ENTRE la pantalla de Los nutrientes
// (/metodo/nutricion/nutrientes) y el apartado de la Microbiota
// (/metodo/nutricion/microbiota): se abre al pulsar «Microbiota →» y termina
// navegando a la microbiota.
//
// Imágenes: /viñetas/nutricion/microbiota/microbiota1.png … (PENDIENTES).
// TEXTO PROVISIONAL — la usuaria pasará el definitivo.
export const NUTRICION_MICROBIOTA: Vineta[] = [
  {
    src: "/viñetas/nutricion/microbiota/microbiota1.png",
    paragraphs: [
      "En tu intestino viven billones de microorganismos: bacterias, hongos, virus y otros microbios que forman tu microbiota. No son intrusos: conviven contigo y cumplen funciones esenciales.",
      "A cambio de un lugar donde vivir y de los restos de alimento que no puedes digerir, realizan tareas que tu cuerpo no podría hacer por sí solo.",
    ],
  },
  {
    src: "/viñetas/nutricion/microbiota/microbiota2.png",
    paragraphs: [
      "Su alimento favorito es la fibra dietética. Como nuestro intestino no tiene las enzimas necesarias para digerirla, la microbiota la fermenta.",
      "Durante ese proceso produce ácidos grasos de cadena corta, que alimentan a las células del intestino y ayudan a regular el metabolismo.",
      "Algunos microorganismos también producen vitaminas, como la K y algunas del grupo B, y moléculas que ayudan a mantener un sistema inmunitario equilibrado.",
    ],
  },
  {
    src: "/viñetas/nutricion/microbiota/microbiota3.png",
    paragraphs: [
      "Algunas moléculas fabricadas por la microbiota pueden viajar por la sangre o enviar señales a través del nervio vago.",
      "Gracias a esta comunicación, la microbiota puede influir en el funcionamiento del cerebro, el estado de ánimo y el aprendizaje.",
    ],
  },
  {
    src: "/viñetas/nutricion/microbiota/microbiota4.png",
    paragraphs: [
      "Cuidar tu microbiota es cuidar de ti. Cuanta mayor variedad de alimentos vegetales consumes, más diversa suele ser tu microbiota, y esa diversidad se asocia con una mejor salud.",
      "Ahora vamos a descubrir tres de las moléculas que produce y cómo ayudan a tu organismo.",
    ],
  },
];
