import type { Vineta } from "./ComicViewer";
import type { CabalaPageKey } from "./cabalaSefirot";

// ─────────────────────────────────────────────────────────────────────────
// Ilustraciones (cómic) de cada sefirá del Árbol de la Vida.
//
// Al pinchar una sefirá en el Árbol se abre su ilustración a pantalla completa
// (mismo visor que el resto de disciplinas). El header muestra SIEMPRE
// «Ilustraciones» (el nombre de la sefirá va como antetítulo).
//
// Textos definitivos con los nombres tradicionales (Keter, Chokhmah, Binah,
// Chesed, Gevurah, Tiferet, Netzach, Hod, Yesod, Malkhut).
// Fotos en /recorrido/cabala/sefirot/<sefira>.png (nombres en castellano:
// keter, jojma, bina, daat, jesed, guevura, tiferet, netsaj, hod, yesod, malkhut).
// Las 11 dimensiones (incl. Da'at) ya tienen ilustración.
// ─────────────────────────────────────────────────────────────────────────

export const CABALA_ILUSTRACIONES: Record<CabalaPageKey, Vineta[]> = {
  kether: [
    {
      src: "/recorrido/cabala/sefirot/keter.webp",
      paragraphs: [
        "Keter es el origen de toda la existencia y representa la voluntad divina, el potencial infinito y el propósito que da sentido a la Vida.",
        "En el plano personal, invita a descubrir los principios que guían nuestras decisiones y a vivir desde la coherencia, más allá del reconocimiento o del ego.",
      ],
    },
  ],
  chokmah: [
    {
      src: "/recorrido/cabala/sefirot/jojma.webp",
      paragraphs: [
        "Chokhmah simboliza la luz divina, la sabiduría intuitiva, la inspiración y la chispa de conocimiento que surge antes del razonamiento.",
        "También representa la capacidad de observar la realidad con apertura, dejando de lado prejuicios e interpretaciones para percibir las cosas con mayor claridad.",
      ],
    },
  ],
  binah: [
    {
      src: "/recorrido/cabala/sefirot/bina.webp",
      paragraphs: [
        "Binah transforma la intuición en comprensión mediante el análisis, la estructura, la clasificación y la reflexión.",
        "En el crecimiento personal, consiste en aprender de la experiencia, revisar nuestras creencias y convertir el conocimiento en sabiduría práctica que transforme nuestra forma de actuar.",
      ],
    },
  ],
  daat: [
    {
      src: "/recorrido/cabala/sefirot/daat.webp",
      paragraphs: [
        "Da'at representa la integración entre el conocimiento y la experiencia. Es el punto donde la sabiduría deja de ser una idea para convertirse en una forma de vivir, uniendo mente, corazón y acción.",
        "Simboliza la conciencia que conecta todas las dimensiones del Árbol de la Vida y permite que el aprendizaje transforme realmente a la persona.",
      ],
    },
  ],
  chesed: [
    {
      src: "/recorrido/cabala/sefirot/jesed.webp",
      paragraphs: [
        "Chesed representa el amor, la compasión y la generosidad.",
        "Nos invita a compartir lo mejor de nosotros desde la libertad y la abundancia interior, ayudando sin esperar reconocimiento y respetando siempre la autonomía y los tiempos de los demás.",
      ],
    },
  ],
  geburah: [
    {
      src: "/recorrido/cabala/sefirot/guevura.webp",
      paragraphs: [
        "Gevurah simboliza la disciplina, la justicia y la capacidad de establecer límites.",
        "Enseña a proteger aquello que es importante, administrar la energía con responsabilidad y encontrar el equilibrio entre la firmeza y la flexibilidad.",
      ],
    },
  ],
  tipharet: [
    {
      src: "/recorrido/cabala/sefirot/tiferet.webp",
      paragraphs: [
        "Tiferet ocupa el centro del Árbol de la Vida y representa la armonía entre el amor y el rigor.",
        "Es el equilibrio del corazón: actuar con honestidad, empatía y sabiduría, integrando razón y emoción para responder de la mejor manera a cada situación.",
      ],
    },
  ],
  netzach: [
    {
      src: "/recorrido/cabala/sefirot/netsaj.webp",
      paragraphs: [
        "Netzach simboliza la perseverancia, la determinación y la capacidad de sostener el esfuerzo a largo plazo.",
        "Nos recuerda que el verdadero crecimiento no depende de la intensidad inicial, sino de la constancia y la capacidad de seguir avanzando incluso ante las dificultades.",
      ],
    },
  ],
  hod: [
    {
      src: "/recorrido/cabala/sefirot/hod.webp",
      paragraphs: [
        "Hod representa la comunicación, la humildad y la claridad mental.",
        "Complementa a Netzach ayudándonos a expresar nuestras ideas con autenticidad, escuchar con apertura y reconocer que nuestra visión es valiosa, pero no la única posible.",
      ],
    },
  ],
  yesod: [
    {
      src: "/recorrido/cabala/sefirot/yesod.webp",
      paragraphs: [
        "Yesod es el puente entre el mundo espiritual y el material, donde las ideas se convierten en realidad.",
        "En el ámbito personal, simboliza la construcción de hábitos y acciones coherentes que transforman los valores con los que estamos de acuerdo en una forma de Vida consistente.",
      ],
    },
  ],
  malkuth: [
    {
      src: "/recorrido/cabala/sefirot/malkhut.webp",
      paragraphs: [
        "Malkhut representa el mundo físico y la manifestación de toda la energía del Árbol de la Vida.",
        "Es la capacidad de convertir el crecimiento interior en acciones concretas, construyendo una realidad que refleje nuestros valores, nuestro propósito y la persona que elegimos ser.",
      ],
    },
  ],
};

export const ilustracionSefira = (key: CabalaPageKey): Vineta[] =>
  CABALA_ILUSTRACIONES[key] ?? [];

// Todas las claves ilustradas, en orden. Sirve para el «gate»: el recorrido se
// desbloquea cuando el usuario ha leído TODAS estas ilustraciones.
export const CABALA_ILUSTRACIONES_KEYS: CabalaPageKey[] = [
  "kether", "chokmah", "binah", "daat", "chesed", "geburah",
  "tipharet", "netzach", "hod", "yesod", "malkuth",
];

// Secuencia completa de viñetas (todas las sefirot en orden) para el visor. Al
// abrir la ilustración de una sefirá se puede avanzar de dimensión en dimensión
// con las flechas. `CABALA_ILUSTRACIONES_VINETA_KEYS` mantiene, en paralelo, a
// qué sefirá pertenece cada viñeta (para marcarla como leída al verla).
export const CABALA_ILUSTRACIONES_VINETAS: Vineta[] = CABALA_ILUSTRACIONES_KEYS.flatMap(
  (k) => ilustracionSefira(k),
);
export const CABALA_ILUSTRACIONES_VINETA_KEYS: CabalaPageKey[] = CABALA_ILUSTRACIONES_KEYS.flatMap(
  (k) => ilustracionSefira(k).map(() => k),
);

/** Foto que representa a la sefirá: la de su ilustración. Es la que se pinta
 *  dentro de la página de la dimensión (/metodo/cabala/sefira/…), no solo en el
 *  visor a pantalla completa. */
export const fotoSefira = (key: CabalaPageKey): string | undefined =>
  CABALA_ILUSTRACIONES[key]?.[0]?.src;

/** Índice de la sefirá dentro de la secuencia completa de viñetas, para abrir el
 *  visor justo por su ilustración (y poder seguir con las flechas). */
export const indiceIlustracionSefira = (key: CabalaPageKey): number =>
  Math.max(0, CABALA_ILUSTRACIONES_VINETA_KEYS.indexOf(key));
