/* ─────────────────────────────────────────────────────────────────────────────

 *  TEXTOS DE LAS DISCIPLINAS EN WELCOME — modal que se abre al pinchar

 *  una de las 8 cajitas de disciplinas en la página de inicio (/).

 *  Edita libremente la frase de cada disciplina.

 *  La parte visual (color, icono, nombre) se queda en Welcome.tsx.

 * ───────────────────────────────────────────────────────────────────────────── */

export type WelcomeDisciplinaContenido = {

  /** Texto que aparece bajo el nombre dentro del modal de la disciplina */

  desc: string;

};

export const welcomeDisciplinas: Record<

  "astrologia" | "psicologia" | "ayurveda" | "tcm" | "fisiologia" | "nutricion" | "cabala" | "cultura",

  WelcomeDisciplinaContenido

> = {

  // 1. ASTROLOGÍA

  astrologia: {

    desc: "Los arquetipos que actúan en cada área de tu Vida. Entiende cómo funcionan en ti y deja de pelearte contigo.",

  },

  // 2. PSICOLOGÍA (neuropsicología)

  psicologia: {

    desc: "El porqué de tus hábitos, tus enfados y tus repeticiones. No para justificarlos: para dejar de necesitarlos.",

  },

  // 3. HINDUISMO (ayurveda)

  ayurveda: {

    desc: "Cinco mil años leyendo al ser humano como parte de la naturaleza, puesto que no es algo separado de ella.",

  },

  // 4. MEDICINA CHINA (tcm)

  tcm: {

    desc: "Cinco elementos. Una naturaleza. Un ser humano. Un sistema de 3000 años para entender el origen de tus desequilibrios.",

  },

  // 5. FISIOLOGÍA

  fisiologia: {

    desc: "No tenemos un cuerpo. Somos un cuerpo. Entiende cómo funcionas.",

  },

  // 6. NUTRICIÓN

  nutricion: {

    desc: "Qué hace cada alimento dentro de ti. Cómo te reconstruyes con tu alimentación. Conoce más para temer menos y elegir mejor.",

  },

  // 7. CÁBALA

  cabala: {

    desc: "El mapa del alma humana. Diez Sefirot para entender qué te equilibra y qué te desequilibra.",

  },

  // 8. CULTURA

  cultura: {

    desc: "Las grandes filosofías que marcaron un antes y un después en la historia de la humanidad. Entiéndelas y crea la tuya propia.",

  },

};