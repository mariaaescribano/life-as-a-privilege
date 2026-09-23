// ─────────────────────────────────────────────────────────────────────────────
// «EL TRAUMA EN TU CEREBRO» · el contenido de las cuatro zonas (paso 7)
//
// Va justo DESPUÉS de los dos tests (ACE, paso 3-4; desconexión, paso 5-6) y
// ANTES de la Línea de Vida. Ese sitio no es casual: la persona acaba de ver dos
// cifras suyas, y esta página le explica qué hacen por dentro esas experiencias. Así, cuando luego recorra su vida año a año, lo que se encuentre no lo
// leerá como fallos de carácter («soy exagerado», «no me acuerdo de nada»,
// «me quedo en blanco») sino como lo que es: un cerebro que hizo lo que tenía
// que hacer para que siguiera aquí.
//
// ⚠️ GÉNERO — el texto de esta página va en MASCULINO (cansado, activado,
// paralizado). Ni femenino ni género duplicado.
//
// ⚠️ HONESTIDAD — esto NO es una prueba de imagen ni un diagnóstico, y la página
// lo dice con todas las letras. Aquí NO se mide el cerebro de nadie ni se cruzan
// sus tests con sus zonas: no existe ninguna fórmula validada que convierta un
// ACE y un DES-II en «cuánto le pasa a tu amígdala», así que no se inventa una.
// Las cuatro zonas se explican igual para todo el mundo.
// ─────────────────────────────────────────────────────────────────────────────
export type ZonaKey = "alarma" | "biblioteca" | "razonador" | "freno";

/** Dónde viven las fotos de las cuatro zonas (una por `key`). */
export const CEREBRO_DIR = "/recorrido/psicologia/cerebro";

export interface ZonaCerebro {
  key: ZonaKey;
  /** Cómo se llama en el cuerpo. */
  nombre: string;
  /** Cómo se llama en esta página, que es lo que se recuerda. */
  apodo: string;
  color: string;
  /** La foto de esa zona del cerebro: es lo que abre el popup. */
  foto: string;
  /** Qué hace esta zona cuando nada la ha forzado. */
  paraQueSirve: string;
  /** Qué le hace vivir con miedo sostenido. */
  queLeHizo: string;
  /** Cómo se nota en un día cualquiera, años después. */
  comoSeNota: string[];
  /** Qué la devuelve a su sitio (y dónde se trabaja en este recorrido). */
  loQueLaCambia: string;
}

export const ZONAS: ZonaCerebro[] = [
  {
    key: "alarma",
    nombre: "La amígdala",
    apodo: "La alarma",
    color: "#c5613e",
    foto: `${CEREBRO_DIR}/alarma.webp`,
    paraQueSirve:
      "Es tu detector de peligros. Antes de que te dé tiempo a razonar, mira el pasado para decidir si lo que tienes delante es peligroso y te prepara para huir, pelear o quedarte quieto. Trabaja en milésimas de segundo, y por eso a veces puedes no entender por qué se activa.",
    queLeHizo:
      "El problema suele ser que prefiere equivocarse mil veces avisando de más que fallar una vez avisando de menos. No es un defecto. Es un cerebro que decidió que era mejor vivir en guardia que ser sorprendido otra vez, lo que te lleva a vivir en estrés constante.",
    comoSeNota: [
      "Te sobresaltas con un portazo, un tono de voz o un mensaje sin responder.",
      "Notas el peligro en el cuerpo (pecho, estómago, mandíbula) antes de saber qué ha pasado.",
      "Alguien te dice «no es para tanto» y tú ya estás en tanto.",
      "Te cuesta relajarte del todo incluso cuando objetivamente no pasa nada.",
    ],
    loQueLaCambia:
      "Para «reprogramarte» y entender que ya no hay peligro, debes de practicar la respiración lenta y consciente. Recuérdate a diario que ahora estás a salvo.",
  },
  {
    key: "biblioteca",
    nombre: "El hipocampo",
    apodo: "La biblioteca",
    color: "#a8452f",
    foto: `${CEREBRO_DIR}/biblioteca.webp`,
    paraQueSirve:
      "Es la biblioteca de tu vida: coloca cada recuerdo en su estante, con su fecha y su lugar, y le pone la etiqueta de «esto pasó, fue entonces, ya terminó». Gracias a ella, recordar algo duro es distinto de volver a vivirlo.",
    queLeHizo:
      "Con la alarma sonando muy alto y muy seguido, la biblioteca no da abasto: las hormonas del estrés sostenido la entorpecen. Entonces hay escenas que se quedan sin colocar — sin fecha, sin estante, sin final. Por eso ciertos recuerdos no se recuerdan: se REVIVEN, en presente, como si estuvieran pasando. Y por eso hay temporadas enteras que faltan.",
    comoSeNota: [
      "Huecos: años o épocas de los que apenas tienes imágenes.",
      "Un olor, una canción o un tono de voz te meten de golpe en otra escena.",
      "Recuerdas lo que sentiste con todo detalle, pero no el orden de lo que pasó.",
      "Te cuentan algo que viviste y no te suena que fueras tú.",
    ],
    loQueLaCambia:
      "La biblioteca se ordena contando: poner la historia en palabras, con su antes y su después, es literalmente lo que coloca en su estante lo que llevaba años tirado por el suelo. Es lo que haces en la Línea de Vida y en tus Huellas — no es un ejercicio de memoria, es trabajo de biblioteca.",
  },
  {
    key: "razonador",
    nombre: "La corteza prefrontal",
    apodo: "El razonador",
    color: "#caa23c",
    foto: `${CEREBRO_DIR}/razonador.webp`,
    paraQueSirve:
      "Es la parte que razona, que pone palabras, que mira las consecuencias y decide con calma. La que sabe que puedes esperar, elegir y responder en vez de reaccionar.",
    queLeHizo:
      "Cuando la alarma suena, el razonador se queda sin línea: el cuerpo entiende que no es momento de pensar, sino de sobrevivir. Si eso pasa a diario y durante años —y sobre todo si pasó mientras el cerebro aún se estaba montando—, la conexión entre los dos se entrena al revés: cuanto más grita la alarma, menos voz le queda al razonador. Por eso «ya sé que no tiene sentido, pero no puedo evitarlo» es una descripción exacta de lo que ocurre, no una excusa.",
    comoSeNota: [
      "Te quedas en blanco justo cuando más necesitas las palabras.",
      "Sabes perfectamente lo que deberías hacer y aun así haces lo contrario.",
      "Después, ya en calma, ves clarísimo lo que tendrías que haber dicho.",
      "Te cuesta concentrarte o decidir cuando estás activado.",
    ],
    loQueLaCambia:
      "Se recupera calmando primero el cuerpo y pensando después — nunca al revés. Y se entrena cada vez que nombras lo que te pasa en lugar de actuarlo: ponerle nombre a una emoción ya es esta zona haciendo su trabajo.",
  },
  {
    key: "freno",
    nombre: "El tronco y el nervio vago",
    apodo: "El freno",
    color: "#7a8f5a",
    foto: `${CEREBRO_DIR}/freno.webp`,
    paraQueSirve:
      "Es la parte más antigua: la que regula la respiración, el latido, la digestión. La que decide, sin preguntarte, si este momento es seguro y puedes descansar.",
    queLeHizo:
      "Cuando no se puede huir ni pelear —y de pequeño casi nunca se puede—, queda una última salida: desconectar. El cuerpo baja el volumen de todo, y uno se va. Ese es el freno, y funciona: por eso sigues aquí. El precio es que se queda fácil de pisar, y años después se dispara solo en una discusión, en una consulta médica o en mitad de una conversación importante.",
    comoSeNota: [
      "Te ves desde fuera, como si la escena le estuviera pasando a otro.",
      "El cuerpo se te queda lejos: no sientes hambre, cansancio o dolor hasta que es mucho.",
      "Te quedas paralizado cuando querrías reaccionar.",
      "Vuelves «a ti» un rato después sin saber muy bien qué ha pasado en medio.",
    ],
    loQueLaCambia:
      "Esta zona no entiende de razones: entiende de señales de seguridad. Respiración larga al soltar el aire, pies en el suelo, frío o calor, movimiento, una voz conocida. Volver al cuerpo poco a poco es el camino de vuelta, y por eso el recorrido insiste tanto en él.",
  },
];

export const zonaPorKey = (key: ZonaKey): ZonaCerebro =>
  ZONAS.find((z) => z.key === key) ?? ZONAS[0];

/** Lo que se lee bajo el dibujo, antes de tocar ninguna zona. */
export const CEREBRO_INTRO = [
  "Lo que viviste no se guardó como se guarda un recuerdo cualquiera. Se guardó como se guarda una lección de supervivencia: en el cuerpo, deprisa y sin palabras.",
  "Por eso hay cosas que no se arreglan entendiéndolas. No están en la parte que entiende.",
];

/** El cierre. Es imprescindible: nadie se queda mirando su propia herida sin salida. */
export const CEREBRO_ESPERANZA = {
  titulo: "Lo que se aprendió con miedo se puede reaprender con seguridad",
  texto: [
    "Nada de esto es un daño permanente ni una avería. Es aprendizaje: tu cerebro se configuró así porque así era como podías seguir vivo, y lo hizo bien.",
    "Y lo que se aprende se puede reaprender. El cerebro sigue cambiando toda la vida — y lo que más lo cambia no es entenderlo, sino vivir lo contrario: repetir, muchas veces, la experiencia de estar a salvo con alguien.",
    "Eso es exactamente lo que vas a hacer a partir de aquí: recordar con orden, ponerle palabras a lo que no las tuvo y aprender a calmarte por el cuerpo. No es hablar de tu herida: es enseñarle a tu cerebro que ya no estás allí.",
  ],
};

/** El aviso que sostiene toda la página. Se pinta tal cual, no en letra pequeña. */
export const CEREBRO_AVISO =
  "Esto no es una prueba de imagen ni un diagnóstico. Nadie te ha mirado el cerebro: lo que lees aquí es lo que la investigación ha visto en muchas personas que vivieron algo parecido, no una medida tuya. Sirve para entenderte, no para etiquetarte.";
