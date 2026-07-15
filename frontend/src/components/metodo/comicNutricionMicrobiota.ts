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
      "En tu intestino viven billones de microorganismos: bacterias, hongos y otros microbios que forman tu microbiota. No son intrusos: son parte de ti.",
      "A cambio de un lugar donde vivir y del alimento que tú no puedes digerir, hacen por ti cosas que tu cuerpo no sabe hacer solo.",
    ],
  },
  {
    src: "/viñetas/nutricion/microbiota/microbiota2.png",
    paragraphs: [
      "Su alimento favorito es la fibra que tú no puedes digerir. Al fermentarla, fabrican pequeñas moléculas que alimentan a tus propias células y regulan tu metabolismo.",
      "También producen vitaminas y moléculas que dialogan con tu sistema inmunitario e incluso con tu cerebro.",
    ],
  },
  {
    src: "/viñetas/nutricion/microbiota/microbiota3.png",
    paragraphs: [
      "Cuidar tu microbiota es cuidar de ti: cuanta más variedad de alimentos vegetales comes, más diversa y sana se vuelve.",
      "Vamos a conocer tres de las moléculas que produce y lo que hacen por ti.",
    ],
  },
];
