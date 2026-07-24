import type { Vineta } from "./ComicViewer";

// Cómic de Psicología: «Cómo te construiste». Recorre las etapas del desarrollo
// (0-6 · 6-12 · 12-25 · +25) para explicar cómo se forma el autoconcepto, cómo
// lo que fueron patrones de supervivencia se confunden con la personalidad, y
// cómo a partir de los ~25 empieza el verdadero trabajo de romper el bucle.
//
// Se intercala tras el popup de felicitación de «Integración», ANTES de entrar a
// «Compromiso» (/metodo/psicologia/:id/compromiso). Este cómic SÍ aparece además
// en la galería de Ilustraciones.
//
// Imágenes: /viñetas/psicologia/compromiso/compromiso1.png … compromiso4.png.
export const COMIC_COMPROMISO: Vineta[] = [
  {
    src: "/viñetas/psicologia/compromiso/compromiso1.png",
    eyebrow: "",
    titulo: "",
    paragraphs: [
      "Entre los 0 y los 6 años es cuando más conexiones neuronales se forman. En esos años empieza a construirse tu autoconcepto: quién crees que eres, cuánto vales y qué lugar ocupas en el mundo.",
      "La Vida es muy dura desde muy jóvenes. Tus padres, igual que les ocurrió a los suyos, rara vez están en sintonía con tus necesidades porque tampoco aprendieron a estar en sintonía con las suyas.",
      "Lo que aprendes —y lo que no aprendes— en esos años te acompaña el resto de tu Vida.",
    ],
  },
  {
    src: "/viñetas/psicologia/compromiso/compromiso2.png",
    eyebrow: "",
    titulo: "",
    paragraphs: [
      "De pequeño todo es inmenso. No entiendes nada. Tienes miedo. Dependes completamente de quienes te cuidan.",
      "No tienes otra opción que adaptarte y tratar de complacerles.",
      "Aprendes qué versión de ti mantiene el vínculo con tus padres. Complacer, callar, hacerse fuerte, no molestar, cuidar de los demás...",
      "No era quién eras. Era la forma en la que aprendiste a sobrevivir.",
    ],
  },
  {
    src: "/viñetas/psicologia/compromiso/compromiso3.png",
    eyebrow: "",
    titulo: "",
    paragraphs: [
      "Crecemos creyendo que esa forma de sobrevivir somos nosotros.",
      "«Yo soy así.»",
      "Pero no. Son respuestas que un día tuvieron sentido y que hoy siguen dirigiendo tus decisiones sin que seas consciente.",
      "Por eso repites relaciones, emociones y conflictos. No porque quieras, sino porque tu cerebro sigue funcionando con el mapa que construyó cuando era un niño.",
    ],
  },
  {
    src: "/viñetas/psicologia/compromiso/compromiso4.png",
    eyebrow: "",
    titulo: "",
    paragraphs: [
      "La corteza prefrontal no termina de desarrollarse hasta aproximadamente los 25 años.",
      "Es aquí donde, por primera vez, puedes empezar a ponerle cabeza a aquello que llevas sintiendo desde tu infancia.",
      "Ya no puedes volver atrás, pero sí puedes dejar de seguir viviendo desde las heridas del niño que fuiste.",
      "Puedes empezar a cuidarte como tus padres no supieron hacerlo y romper el bucle para que la historia no siga repitiéndose y en el futuro, si lo deseas, poder crear una familia realmente sana.",
    ],
  },
];
