// ─────────────────────────────────────────────────────────────────────────────
// «EL TRAUMA EN TU CEREBRO» · contenido y lectura personalizada (paso 7)
//
// Va justo DESPUÉS de los dos tests (ACE, paso 3-4; desconexión, paso 5-6) y
// ANTES de la Línea de Vida. Ese sitio no es casual: la persona acaba de ver dos
// cifras suyas, y esta página le explica qué hicieron esas experiencias por
// dentro. Así, cuando luego recorra su vida año a año, lo que se encuentre no lo
// leerá como fallos de carácter («soy exagerada», «no me acuerdo de nada»,
// «me quedo en blanco») sino como lo que es: un cerebro que hizo lo que tenía
// que hacer para que ella siguiera aquí.
//
// ⚠️ HONESTIDAD — esto NO es una prueba de imagen ni un diagnóstico, y la página
// lo dice con todas las letras. Las barras no miden el cerebro de nadie: son SUS
// RESPUESTAS a los dos tests, ordenadas por la zona que la investigación asocia
// con cada tipo de señal. La fórmula de cada zona está escrita aquí abajo, a la
// vista, precisamente para no vender una precisión que no existe.
// ─────────────────────────────────────────────────────────────────────────────
import {
  aceScore,
  ACE_PREGUNTAS,
  desSubescalas,
  type LineaDeVidaData,
} from "./psicologiaRecorrido";

export type ZonaKey = "alarma" | "archivo" | "freno" | "cuerpo";

export interface ZonaCerebro {
  key: ZonaKey;
  /** Cómo se llama en el cuerpo. */
  nombre: string;
  /** Cómo se llama en esta página, que es lo que se recuerda. */
  apodo: string;
  color: string;
  /** Qué hace esta zona cuando nada la ha forzado. */
  paraQueSirve: string;
  /** Qué le hace vivir con miedo sostenido. */
  queLeHizo: string;
  /** Cómo se nota en un día cualquiera, años después. */
  comoSeNota: string[];
  /** Qué la devuelve a su sitio (y dónde se trabaja en este recorrido). */
  loQueLaCambia: string;
  /**
   * De dónde sale su barra, explicado en una línea para la propia persona.
   * Se PINTA en la página: quien mira una cifra sobre sí misma tiene derecho a
   * saber de dónde ha salido.
   */
  deDondeSale: string;
}

export const ZONAS: ZonaCerebro[] = [
  {
    key: "alarma",
    nombre: "La amígdala",
    apodo: "la alarma",
    color: "#c5613e",
    paraQueSirve:
      "Es el detector de humos. Antes de que te dé tiempo a pensar, decide si lo que tienes delante es peligroso y te prepara para huir, pelear o quedarte quieta. Trabaja en milésimas de segundo, y por eso te salva la vida cruzando una calle.",
    queLeHizo:
      "Cuando el peligro no es un coche que pasa sino algo que se repite en casa durante años, la alarma aprende a saltar antes y a bajar la voz después. Se vuelve más rápida y más sensible: prefiere equivocarse mil veces avisando de más que fallar una vez avisando de menos. No es un defecto. Es un cerebro que decidió que era mejor vivir en guardia que ser sorprendido otra vez.",
    comoSeNota: [
      "Te sobresaltas con un portazo, un tono de voz o un mensaje sin responder.",
      "Notas el peligro en el cuerpo (pecho, estómago, mandíbula) antes de saber qué ha pasado.",
      "Alguien te dice «no es para tanto» y tú ya estás en tanto.",
      "Te cuesta relajarte del todo incluso cuando objetivamente no pasa nada.",
    ],
    loQueLaCambia:
      "La alarma no se apaga discutiendo con ella: se calma por el cuerpo y por la compañía. Respiración lenta, ritmo, una voz tranquila al lado. Es lo que trabajarás en «Aprende a narrar tu historia» y lo que sostiene cualquier vínculo seguro.",
    deDondeSale:
      "De tu puntuación del test ACE: cuanta más adversidad sostenida, más entrenada quedó la alarma.",
  },
  {
    key: "archivo",
    nombre: "El hipocampo",
    apodo: "el archivo",
    color: "#a8452f",
    paraQueSirve:
      "Es quien archiva los recuerdos con su fecha y su lugar: pone el «esto pasó, fue entonces, ya terminó». Gracias a él, recordar algo duro es distinto de volver a vivirlo.",
    queLeHizo:
      "Con la alarma sonando muy alto y muy seguido, el archivo trabaja peor: las hormonas del estrés sostenido lo entorpecen. Entonces hay escenas que se guardan sin etiqueta — sin fecha, sin final. Por eso ciertos recuerdos no se recuerdan: se REVIVEN, en presente, como si estuvieran pasando. Y por eso hay temporadas enteras que faltan.",
    comoSeNota: [
      "Huecos: años o épocas de los que apenas tienes imágenes.",
      "Un olor, una canción o un tono de voz te meten de golpe en otra escena.",
      "Recuerdas lo que sentiste con todo detalle, pero no el orden de lo que pasó.",
      "Te cuentan algo que viviste y no te suena que fueras tú.",
    ],
    loQueLaCambia:
      "El archivo se ordena contando: poner la historia en palabras, con su antes y su después, es literalmente lo que le pone fecha a lo que no la tenía. Es lo que haces en la Línea de Vida y en tus Huellas — no es un ejercicio de memoria, es un trabajo de archivo.",
    deDondeSale:
      "De tus lagunas de memoria en el test de desconexión, junto con tu puntuación ACE.",
  },
  {
    key: "freno",
    nombre: "La corteza prefrontal",
    apodo: "quien piensa",
    color: "#caa23c",
    paraQueSirve:
      "Es la parte que razona, que pone palabras, que mira las consecuencias y decide con calma. La que sabe que puedes esperar, elegir y responder en vez de reaccionar.",
    queLeHizo:
      "Cuando la alarma suena, esta zona se queda sin línea: el cuerpo entiende que no es momento de pensar, sino de sobrevivir. Si eso pasa a diario y durante años —y sobre todo si pasó mientras el cerebro aún se estaba montando—, la conexión entre las dos se entrena al revés: mucha alarma, poco freno. Por eso «ya sé que no tiene sentido, pero no puedo evitarlo» es una descripción exacta de lo que ocurre, no una excusa.",
    comoSeNota: [
      "Te quedas en blanco justo cuando más necesitas las palabras.",
      "Sabes perfectamente lo que deberías hacer y aun así haces lo contrario.",
      "Después, ya en calma, ves clarísimo lo que tendrías que haber dicho.",
      "Te cuesta concentrarte o decidir cuando estás activada.",
    ],
    loQueLaCambia:
      "Se recupera calmando primero el cuerpo y pensando después — nunca al revés. Y se entrena cada vez que nombras lo que te pasa en lugar de actuarlo: ponerle nombre a una emoción ya es esta zona haciendo su trabajo.",
    deDondeSale:
      "De tu puntuación ACE junto con lo que marcaste en «estar fuera de ti».",
  },
  {
    key: "cuerpo",
    nombre: "El tronco y el nervio vago",
    apodo: "el freno de emergencia",
    color: "#7a8f5a",
    paraQueSirve:
      "Es la parte más antigua: la que regula la respiración, el latido, la digestión. La que decide, sin preguntarte, si este momento es seguro y puedes descansar.",
    queLeHizo:
      "Cuando no se puede huir ni pelear —y de pequeña casi nunca se puede—, queda una última salida: desconectar. El cuerpo baja el volumen de todo, y una se va. Es el freno de emergencia, y funciona: por eso sigues aquí. El precio es que ese freno se queda fácil de accionar, y años después se dispara solo en una discusión, en una consulta médica o en mitad de una conversación importante.",
    comoSeNota: [
      "Te ves desde fuera, como si la escena le estuviera pasando a otra.",
      "El cuerpo se te queda lejos: no sientes hambre, cansancio o dolor hasta que es mucho.",
      "Te quedas paralizada cuando querrías reaccionar.",
      "Vuelves «a ti» un rato después sin saber muy bien qué ha pasado en medio.",
    ],
    loQueLaCambia:
      "Esta zona no entiende de razones: entiende de señales de seguridad. Respiración larga al soltar el aire, pies en el suelo, frío o calor, movimiento, una voz conocida. Volver al cuerpo poco a poco es el camino de vuelta, y por eso el recorrido insiste tanto en él.",
    deDondeSale:
      "De lo que marcaste en «estar fuera de ti» y en «irte con la mente».",
  },
];

export const zonaPorKey = (key: ZonaKey): ZonaCerebro =>
  ZONAS.find((z) => z.key === key) ?? ZONAS[0];

/**
 * Lo que dicen SUS respuestas sobre cada zona, de 0 a 100.
 *
 * Las mezclas están a la vista y son deliberadamente simples. No hay ninguna
 * fórmula validada que convierta un ACE y un DES-II en «cuánto le pasa a tu
 * amígdala»: lo que hay es investigación que asocia la adversidad sostenida con
 * una alarma más reactiva, las lagunas de memoria con el hipocampo, y las
 * experiencias de estar fuera de sí con la respuesta de desconexión. Esto ordena
 * sus respuestas según eso, y la página lo dice claramente.
 */
export function lecturaCerebro(data: LineaDeVidaData): Record<ZonaKey, number> {
  const ace = (aceScore(data) / ACE_PREGUNTAS.length) * 100;
  const subs = desSubescalas(data);
  const de = (key: string): number => subs.find((s) => s.sub.key === key)?.score ?? 0;
  const amnesia = de("amnesia");
  const fuera = de("despersonalizacion");
  const mente = de("absorcion");

  const limita = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

  return {
    alarma: limita(ace * 0.75 + fuera * 0.25),
    archivo: limita(amnesia * 0.6 + ace * 0.4),
    freno: limita(ace * 0.6 + fuera * 0.4),
    cuerpo: limita(fuera * 0.6 + mente * 0.4),
  };
}

/** Las tres bandas con las que se lee una barra, sin cifras clínicas. */
export interface BandaZona {
  etiqueta: string;
  /** Frase en segunda persona para esa zona y esa banda. */
  frase: string;
}

export function bandaDe(valor: number, zona: ZonaKey): BandaZona {
  const suave: Record<ZonaKey, string> = {
    alarma: "Tu alarma no parece vivir disparada. Eso es una buena base.",
    archivo: "Tu memoria parece tener su hilo: recuerdas con orden y con fecha.",
    freno: "Sueles poder pensar aunque estés incómoda. No es poca cosa.",
    cuerpo: "Tu cuerpo no necesita irse a menudo: se queda contigo.",
  };
  const media: Record<ZonaKey, string> = {
    alarma: "Tu alarma salta antes de la cuenta en algunas situaciones. No estás exagerando: está afinada.",
    archivo: "Hay partes de tu historia peor archivadas que otras. Ponerles fecha es justo lo que viene ahora.",
    freno: "Cuando te activas, te cuesta pensar con claridad. Vuelve después, y vuelve entera.",
    cuerpo: "Te vas un poco en algunos momentos. Es un recurso, no un fallo.",
  };
  const marcada: Record<ZonaKey, string> = {
    alarma: "Tu alarma lleva mucho tiempo encendida. Que estés cansada tiene todo el sentido.",
    archivo: "Tu historia tiene huecos y escenas sin final. No es que no te esfuerces: es que no se archivaron bien.",
    freno: "Cuando la alarma suena, te quedas sin palabras. Eso es fisiología, no falta de voluntad.",
    cuerpo: "Irte fue tu manera de sobrevivir, y el cuerpo la aprendió bien. La vuelta se hace despacio y acompañada.",
  };

  if (valor < 25) return { etiqueta: "Suave", frase: suave[zona] };
  if (valor < 55) return { etiqueta: "Media", frase: media[zona] };
  return { etiqueta: "Marcada", frase: marcada[zona] };
}

/** Lo que se lee bajo el dibujo, antes de tocar ninguna zona. */
export const CEREBRO_INTRO = [
  "Lo que viviste no se guardó como se guarda un recuerdo cualquiera. Se guardó como se guarda una lección de supervivencia: en el cuerpo, deprisa y sin palabras.",
  "Por eso hay cosas que no se arreglan entendiéndolas. No están en la parte que entiende.",
];

/** El cierre. Es imprescindible: nadie se queda mirando su propia herida sin salida. */
export const CEREBRO_ESPERANZA = {
  titulo: "Lo que se aprendió con miedo se puede reaprender con seguridad",
  texto: [
    "Nada de esto es un daño permanente ni una avería. Es aprendizaje: tu cerebro se configuró así porque así era como podías seguir viva, y lo hizo bien.",
    "Y lo que se aprende se puede reaprender. El cerebro sigue cambiando toda la vida — y lo que más lo cambia no es entenderlo, sino vivir lo contrario: repetir, muchas veces, la experiencia de estar a salvo con alguien.",
    "Eso es exactamente lo que vas a hacer a partir de aquí: recordar con orden, ponerle palabras a lo que no las tuvo y aprender a calmarte por el cuerpo. No es hablar de tu herida: es enseñarle a tu cerebro que ya no estás allí.",
  ],
};

/** El aviso que sostiene toda la página. Se pinta tal cual, no en letra pequeña. */
export const CEREBRO_AVISO =
  "Esto no es una prueba de imagen ni un diagnóstico. Nadie te ha mirado el cerebro: lo que ves son tus propias respuestas a los dos tests, ordenadas según lo que la investigación asocia con cada zona. Sirve para entenderte, no para etiquetarte.";
