import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Segundo cómic de intro de Astrología: «La Historia de la Astrología».
//
// Va DESPUÉS del cómic del Origen según la espiritualidad
// (ORIGEN_ESPIRITUALIDAD): van SEGUIDOS pero son cómics distintos. Al terminar
// (o pulsar el botón «Astrología →»), se entra al contenido de la disciplina.
//
// Las fotos se dejan en /viñetas/astrologia/historia (historia1.png … historia8.png
// + cierre.png para el panel final). El fecha/lugar va como antetítulo (eyebrow,
// en mayúsculas) y el nombre de la etapa como título.
// ─────────────────────────────────────────────────────────────────────────

export const HISTORIA_ASTROLOGIA: Vineta[] = [
  // 1 — El nacimiento
  {
    src: "/viñetas/astrologia/historia/historiaastrologia1.png",
    eyebrow: "Mesopotamia · 2000 a.C.",
    titulo: "",
    paragraphs: [
      "La Astrología empezó gracias a la observación constante del cielo.",
      "Los sacerdotes registraban eclipses, planetas y estrellas para intentar comprender los presagios que afectaban al reino.",
      "No buscaban conocer el futuro de las personas.",
      "Querían entender el destino de los pueblos.",
    ],
  },
  // 2 — Los astrólogos del rey
  {
    src: "/viñetas/astrologia/historia/historiaastrologia2.png",
    titulo: "",
    paragraphs: [
      "La Astrología se convirtió en una herramienta para los reyes.",
      "Antes de tomar decisiones importantes, consultaban a los astrólogos de su corte.",
      "Para ellos, el cielo podía advertir guerras, hambrunas o la muerte del rey.",
    ],
  },
  // 3 — El Zodiaco
  {
    src: "/viñetas/astrologia/historia/historiaastrologia3.png",
    eyebrow: "Babilonia · 500 a.C.",
    titulo: "",
    paragraphs: [
      "Para medir el movimiento de los planetas de forma más rápida y precisa, los babilonios dividieron el cielo en un círculo de 360° y lo separaron en 12 partes iguales.",
      "Así nació el Zodiaco.",
    ],
  },
  // 4 — Grecia
  {
    src: "/viñetas/astrologia/historia/historiaastrologia4.png",
    titulo: "Grecia",
    paragraphs: [
      "Las conquistas de Alejandro Magno llevaron el conocimiento de Babilonia hasta Grecia.",
      "Los griegos transformaron aquella astrología de presagios en una astrología centrada en las personas.",
      "Nacieron las cartas natales, las casas y la astrología helenística.",
      "Siglos después, Ptolomeo reunió todo ese conocimiento en el Tetrabiblos, el libro que dominaría la astrología durante más de 1.400 años.",
    ],
  },
  // 5 — Roma
  {
    src: "/viñetas/astrologia/historia/historiaastrologia5.png",
    titulo: "Roma",
    paragraphs: [
      "Los emperadores romanos confiaban en la astrología.",
      "Pero también la temían.",
      "Buscar en las estrellas cuándo moriría un emperador podía considerarse una conspiración.",
      "Por eso, en algunos momentos, las consultas astrológicas llegaron a prohibirse.",
    ],
  },
  // 6 — Bagdad y la Edad Media
  {
    src: "/viñetas/astrologia/historia/historiaastrologia6.png",
    titulo: "Bagdad y la Edad Media",
    paragraphs: [
      "Durante la Edad de Oro del Islam, Bagdad se convirtió en el nuevo centro del conocimiento.",
      "Los sabios musulmanes conservaron los textos griegos, los tradujeron, los mejoraron y los llevaron de nuevo a Europa.",
      "Gracias a ello, la astrología volvió a enseñarse en las universidades y fue consultada por reyes, papas y monarcas como los Reyes Católicos.",
    ],
  },
  // 7 — La Revolución Científica
  {
    src: "/viñetas/astrologia/historia/historiaastrologia7.png",
    titulo: "La Revolución Científica",
    paragraphs: [
      "Durante el Renacimiento, incluso reyes como los Reyes Católicos y muchos papas seguían consultando astrólogos.",
      "Pero con Copérnico, Galileo, Kepler y Newton nació una nueva forma de entender el universo.",
      "La astronomía empezó a explicar cómo funciona el cielo.",
      "La astrología siguió intentando interpretar qué significado tiene.",
      "Fue el comienzo de su separación.",
    ],
  },
  // 8 — Hoy
  {
    src: "/viñetas/astrologia/historia/historiaastrologia8.png",
    titulo: "Hoy",
    paragraphs: [
      "En 1930 nacieron los horóscopos por signos que conocemos hoy.",
      "La astronomía explora el universo.",
      "La astrología sigue buscando significado en él.",
      "Las dos nacieron mirando el mismo cielo.",
    ],
  },
  // Panel de cierre — la «frase final» (iba fuera de las viñetas). No hay imagen
  // propia, así que reutiliza la última (la de «Hoy», que une todas las épocas).
  // Si quieres una imagen dedicada, deja cierre.png y cambia este src; y si
  // prefieres mostrar la frase en otro sitio, quita esta última entrada.
  {
    src: "/viñetas/astrologia/historia/historiaastrologia8.png",
    paragraphs: [
      "Durante más de 4.000 años, cada civilización reinventó la astrología.",
      "Por eso su historia es también la historia de la humanidad mirando al cielo.",
    ],
  },
];
