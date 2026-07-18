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
// Fotos PENDIENTES: mientras tanto se usa la imagen de fondo de la disciplina.
//   Sustituye `src` por /recorrido/cabala/ilustraciones/<key>/<n>.png cuando estén.
// ─────────────────────────────────────────────────────────────────────────

const IMG = "/img/fondos/cabala.png"; // placeholder hasta que haya foto propia

export const CABALA_ILUSTRACIONES: Record<CabalaPageKey, Vineta[]> = {
  kether: [
    {
      src: IMG,
      paragraphs: [
        "Keter es el origen de toda la existencia y representa la voluntad divina, el potencial infinito y el propósito que da sentido a la Vida.",
        "En el plano personal, invita a descubrir los principios que guían nuestras decisiones y a vivir desde la coherencia, más allá del reconocimiento o del ego.",
      ],
    },
  ],
  chokmah: [
    {
      src: IMG,
      paragraphs: [
        "Chokhmah simboliza la luz divina, la sabiduría intuitiva, la inspiración y la chispa de conocimiento que surge antes del razonamiento.",
        "También representa la capacidad de observar la realidad con apertura, dejando de lado prejuicios e interpretaciones para percibir las cosas con mayor claridad.",
      ],
    },
  ],
  binah: [
    {
      src: IMG,
      paragraphs: [
        "Binah transforma la intuición en comprensión mediante el análisis, la estructura, la clasificación y la reflexión.",
        "En el crecimiento personal, consiste en aprender de la experiencia, revisar nuestras creencias y convertir el conocimiento en sabiduría práctica que transforme nuestra forma de actuar.",
      ],
    },
  ],
  daat: [
    {
      src: IMG,
      paragraphs: [
        "Da'at representa la integración entre el conocimiento y la experiencia. Es el punto donde la sabiduría deja de ser una idea para convertirse en una forma de vivir, uniendo mente, corazón y acción.",
        "Simboliza la conciencia que conecta todas las dimensiones del Árbol de la Vida y permite que el aprendizaje transforme realmente a la persona.",
      ],
    },
  ],
  chesed: [
    {
      src: IMG,
      paragraphs: [
        "Chesed representa el amor, la compasión y la generosidad.",
        "Nos invita a compartir lo mejor de nosotros desde la libertad y la abundancia interior, ayudando sin esperar reconocimiento y respetando siempre la autonomía y los tiempos de los demás.",
      ],
    },
  ],
  geburah: [
    {
      src: IMG,
      paragraphs: [
        "Gevurah simboliza la disciplina, la justicia y la capacidad de establecer límites.",
        "Enseña a proteger aquello que es importante, administrar la energía con responsabilidad y encontrar el equilibrio entre la firmeza y la flexibilidad.",
      ],
    },
  ],
  tipharet: [
    {
      src: IMG,
      paragraphs: [
        "Tiferet ocupa el centro del Árbol de la Vida y representa la armonía entre el amor y el rigor.",
        "Es el equilibrio del corazón: actuar con honestidad, empatía y sabiduría, integrando razón y emoción para responder de la mejor manera a cada situación.",
      ],
    },
  ],
  netzach: [
    {
      src: IMG,
      paragraphs: [
        "Netzach simboliza la perseverancia, la determinación y la capacidad de sostener el esfuerzo a largo plazo.",
        "Nos recuerda que el verdadero crecimiento no depende de la intensidad inicial, sino de la constancia y la capacidad de seguir avanzando incluso ante las dificultades.",
      ],
    },
  ],
  hod: [
    {
      src: IMG,
      paragraphs: [
        "Hod representa la comunicación, la humildad y la claridad mental. Complementa a Netzach ayudándonos a expresar nuestras ideas con autenticidad, escuchar con apertura y reconocer que nuestra visión es valiosa, pero no la única posible.",
      ],
    },
  ],
  yesod: [
    {
      src: IMG,
      paragraphs: [
        "Yesod es el puente entre el mundo espiritual y el material, donde las ideas se convierten en realidad.",
        "En el ámbito personal, simboliza la construcción de hábitos y acciones coherentes que transforman los valores con los que estamos de acuerdo en una forma de Vida consistente.",
      ],
    },
  ],
  malkuth: [
    {
      src: IMG,
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
