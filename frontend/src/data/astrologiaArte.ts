/**
 * «Astrología en el arte» (página de Astrología, último apartado): cuatro piezas, cada una con una o dos imágenes
 * y su pie (nombre · lugar y época). Se pasan con las flechas. Las fotos están en `/public/img/astrologia/arte/`.
 * Los pies en inglés son traducción provisional.
 */
export type PiezaArte = {
  /** Nombre de la obra o del lugar (en negrita). */
  nombre: { es: string; en: string };
  /** El resto del pie (tras « · »). */
  detalle: { es: string; en: string };
  fotos: string[];
};

const F = (n: string) => `/img/astrologia/arte/${n}.webp`;

export const ARTE_ASTROLOGIA: PiezaArte[] = [
  {
    nombre: { es: "Zodiaco de Dendera", en: "Dendera Zodiac" },
    detalle: { es: "Egipto, siglo I a. C.", en: "Egypt, 1st century BC" },
    fotos: [F("dendera-papiro"), F("dendera-relieve")],
  },
  {
    nombre: { es: "Mosaico de Beit Alpha", en: "Beit Alpha Mosaic" },
    detalle: { es: "siglo VI", en: "6th century" },
    fotos: [F("beit-alpha-circulo"), F("beit-alpha-suelo")],
  },
  {
    nombre: { es: "El hombre zodiacal, Las muy ricas horas del duque de Berry", en: "The Zodiac Man, Les Très Riches Heures du duc de Berry" },
    detalle: { es: "siglo XV", en: "15th century" },
    fotos: [F("hombre-zodiacal")],
  },
  {
    nombre: { es: "Harmonia Macrocosmica, Andreas Cellarius", en: "Harmonia Macrocosmica, Andreas Cellarius" },
    detalle: { es: "1660", en: "1660" },
    fotos: [F("cellarius-hemisferio"), F("cellarius-planisferio")],
  },
];
