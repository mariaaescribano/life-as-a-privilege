import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Cómic de intro de PSICOLOGÍA (se muestra la 1ª vez que se entra al recorrido).
// Imágenes en public/viñetas/psicologia/sufrimiento (sufrimiento1.png … sufrimiento8.png).
// ─────────────────────────────────────────────────────────────────────────

const P = "/viñetas/psicologia/sufrimiento";

export const INTRO_PSICOLOGIA: Vineta[] = [
  {
    src: `${P}/sufrimiento1.webp`,
    paragraphs: [
      "Mucho antes de nacer, ya existía una historia.",
      "Las heridas, las historias, el amor, el rencor, los miedos y la forma en que tus padres se trataban a sí mismos y entre ellos, ya empezaban a influir en tu percepción de la realidad.",
    ],
  },
  {
    src: `${P}/sufrimiento2.webp`,
    paragraphs: [
      "Tu historia comenzó a construirse dentro de ese entorno.",
      "Entre el Amor que pudieron ofrecerte... y el dolor que nunca aprendieron a sanar.",
    ],
  },
  {
    src: `${P}/sufrimiento3.webp`,
    paragraphs: [
      "Tu cerebro se desarrolla adaptándose a quienes te cuidan.",
      "Muchas de las conexiones que hoy dirigen tu forma de sentir, pensar y relacionarte nacieron cuando aún no podías comprender ni recordar con palabras lo que vivías.",
    ],
  },
  {
    src: `${P}/sufrimiento4.webp`,
    paragraphs: [
      "De niño harías cualquier cosa por conservar el amor de quienes te cuidaban.",
      "Deseabas que tus padres fuesen felices, lo que no sabías es que nunca estuvo en tu mano.",
      "Si te hacían daño, pensabas que el problema estaba en ti, que había algo malo en ti y por eso te trataban de esa manera.",
    ],
  },
  {
    src: `${P}/sufrimiento5.webp`,
    paragraphs: [
      "Entonces apareció un conflicto imposible con el que cargas a día de hoy.",
      "El sistema de apego dice: «Acércate, ahí está quien te protege.»",
      "El sistema de defensa responde: «Aléjate, ahí también está quien te hace daño.»",
      "Para resolver esa contradicción, muchos niños llegan a una conclusión devastadora: «El problema soy yo.»",
    ],
  },
  {
    src: `${P}/sufrimiento6.webp`,
    paragraphs: [
      "Con los años, muchas experiencias despiertan las mismas heridas. Sin darte cuenta, vuelves una y otra vez al dolor de tu infancia y al vacío que se formó dentro de ti.",
    ],
  },
  {
    src: `${P}/sufrimiento7.webp`,
    paragraphs: [
      "Así viven muchas personas: creyendo que no son suficientes, culpándose y repitiendo estrategias que un día les ayudaron a sobrevivir, pero que hoy las mantienen atrapadas.",
      "«Si quienes debían quererme no pudieron hacerlo, significa que no soy merecedor de amor. ¿Quién podría quererme?»",
    ],
  },
  {
    src: `${P}/sufrimiento8.webp`,
    paragraphs: [
      "Pero hoy puedes empezar otro camino.",
      "Tus padres, tus abuelos y tus ancestros también fueron hijos no queridos en su propia historia. Te dieron lo que te pudieron dar.",
      "Comprender no significa justificar; significa dejar de seguir cargando con un peso que nunca fue culpa tuya.",
      "Míralos con compasión.",
      "Mírate y trátate con el mismo Amor que siempre necesitaste. Te lo mereces.",
    ],
  },
];
