import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Cómic de intro de PSICOLOGÍA (se muestra la 1ª vez que se entra al recorrido).
// Imágenes en public/viñetas/sufrimiento (sufrimiento1.png … sufrimiento8.png).
// ─────────────────────────────────────────────────────────────────────────

const P = "/viñetas/sufrimiento";

export const INTRO_PSICOLOGIA: Vineta[] = [
  {
    src: `${P}/sufrimiento1.png`,
    paragraphs: [
      "Mucho antes de nacer, ya existía una historia. Las heridas, el Amor, los miedos y la forma en que tus padres se trataban a sí mismos y entre ellos, ya empezaban a influir en tu percepción del mundo.",
    ],
  },
  {
    src: `${P}/sufrimiento2.png`,
    paragraphs: [
      "Tu historia comenzó a construirse dentro de ese entorno.",
      "Entre el Amor que pudieron ofrecerte... y el dolor que nunca aprendieron a sanar.",
    ],
  },
  {
    src: `${P}/sufrimiento3.png`,
    paragraphs: [
      "Nuestro cerebro se desarrolla adaptándose a quienes nos cuidan. Muchas de las conexiones que hoy dirigen nuestra forma de sentir, pensar y relacionarnos nacieron cuando aún no podíamos comprender ni recordar con palabras lo que vivíamos.",
    ],
  },
  {
    src: `${P}/sufrimiento4.png`,
    paragraphs: [
      "De niños haríamos cualquier cosa por conservar el amor de quienes nos cuidaban. Deseábamos que nuestros padres fuesen felices.",
      "Si nos hicieron daño, era más seguro pensar que el problema estaba en nosotros que aceptar que quienes debían protegernos también podían herirnos.",
    ],
  },
  {
    src: `${P}/sufrimiento5.png`,
    paragraphs: [
      "Entonces apareció un conflicto imposible con el que cargamos a día de hoy.",
      "El sistema de apego dice: «Acércate, ahí está quien te protege.»",
      "El sistema de defensa responde: «Aléjate, ahí también está quien te hace daño.»",
      "Para resolver esa contradicción, muchos niños llegan a una conclusión devastadora: «El problema debo ser yo.»",
    ],
  },
  {
    src: `${P}/sufrimiento6.png`,
    paragraphs: [
      "Con los años, muchas experiencias despiertan las mismas heridas. Sin darnos cuenta, volvemos una y otra vez al dolor de nuestra infancia y al vacío que se formó dentro de nosotros.",
    ],
  },
  {
    src: `${P}/sufrimiento7.png`,
    paragraphs: [
      "Así viven muchas personas: creyendo que no son suficientes, culpándose y repitiendo estrategias que un día les ayudaron a sobrevivir, pero que hoy las mantienen atrapadas.",
      "Si quienes debían quererme no pudieron hacerlo, significa que no soy merecedor de Amor. ¿Quién podría quererme?",
    ],
  },
  {
    src: `${P}/sufrimiento8.png`,
    paragraphs: [
      "Pero hoy puedes empezar otro camino. Tus padres también fueron hijos no queridos en su propia historia. Te dieron lo que te pudieron dar.",
      "Comprender no significa justificar. Significa dejar de seguir cargando con un peso que nunca fue solo tuyo. Míralos con compasión.",
      "Mírate y trátate con el mismo Amor que siempre necesitaste. Te lo mereces.",
    ],
  },
];
