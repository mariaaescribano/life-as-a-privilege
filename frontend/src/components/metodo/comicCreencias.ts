import type { Vineta } from "./ComicViewer";

// Cómic de Psicología: «Cómo nacen las creencias». Se intercala ENTRE Huellas
// (/metodo/psicologia/:id/huellas) y Nudos (.../nudos): es la bisagra que
// explica cómo una experiencia que dejó huella acaba convertida en una creencia
// profunda sobre uno mismo — justo lo que la página de Nudos pide nombrar.
//
// El arco: trauma no resuelto → desconexión emocional → se transmite en la
// crianza → el niño concluye que el problema es él → nacen las creencias.
//
// OJO: este cómic NO forma parte de las «Ilustraciones» del material; vive solo
// en este paso del recorrido (igual que COMIC_ACE).
//
// Imágenes: /viñetas/psicologia/creencias/creencias1.png … creencias3.png.
const P = "/viñetas/psicologia/creencias";

export const COMIC_CREENCIAS: Vineta[] = [
  {
    src: `${P}/creencias1.webp`,
    titulo: "",
    paragraphs: [
      "Un trauma no resuelto no desaparece: se convierte en una desconexión con uno mismo.",
      "Para no sentir el dolor, la persona deja de sentir casi todo. Ya no sabe qué necesita ni qué emoción está viviendo.",
    ],
  },
  {
    src: `${P}/creencias2.webp`,
    titulo: "",
    paragraphs: [
      "Nadie puede conectar con las necesidades de un hijo si ha perdido el contacto con las propias.",
      "La desconexión emocional se transmite en la crianza.",
      "No ve, no comprende y no responde a las necesidades emocionales de su hijo porque vive desconectada de las suyas.",
    ],
  },
  {
    src: `${P}/creencias3.webp`,
    titulo: "",
    paragraphs: [
      "El bebé depende de que alguien dé sentido a lo que siente.",
      "Cuando eso no ocurre, no concluye que sus padres no pudieron cuidarlo; concluye que él no merece ser cuidado, que hay algo inherentemente mal en él como persona.",
      "Así nacen creencias profundas: «No soy suficiente.» «No merezco amor.» «El mundo no es seguro.»",
    ],
  },
];
