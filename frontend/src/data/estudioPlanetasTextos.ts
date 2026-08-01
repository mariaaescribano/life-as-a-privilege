/* ─────────────────────────────────────────────────────────────────────────────
 *  QUÉ ES CADA ARQUETIPO — popup de la portada del estudio
 *
 *  En la portada se ven los mismos boxes que luego usará quien participe para
 *  responder. Aquí todavía no hay carta, así que al pinchar uno no salen
 *  preguntas: sale una explicación breve de ese arquetipo, para que se entienda
 *  qué se va a medir en él.
 *
 *  Edita libremente. `titulo` es la frase corta que resume el arquetipo (sale
 *  también bajo el nombre en el box) y `parrafos` el texto del popup.
 * ───────────────────────────────────────────────────────────────────────────── */

import type { CuerpoKey } from "../components/metodo/astrologiaData";

export interface TextoPlaneta {
  /** Frase de una línea. Se ve en el box y bajo el nombre en el popup. */
  titulo: string;
  parrafos: string[];
}

export const TEXTOS_PLANETAS: Record<CuerpoKey, TextoPlaneta> = {
  ascendente: {
    titulo: "Cómo entras en el mundo",
    parrafos: [
      "El Ascendente es el signo que asomaba por el horizonte en el momento exacto de tu nacimiento. Por eso la hora importa tanto: cambia cada dos horas aproximadamente.",
      "Es la puerta por la que sales al mundo: la primera impresión que das, cómo afrontas lo nuevo, el gesto automático con el que te presentas antes de que a nadie le dé tiempo a conocerte.",
      "Casi nunca coincide con cómo te ves tú por dentro. Ahí está lo interesante de medirlo.",
    ],
  },

  sol: {
    titulo: "Quién eres cuando eres tú",
    parrafos: [
      "El Sol es el centro de la carta: tu identidad, tu voluntad, aquello que te hace sentir vivo cuando lo estás haciendo.",
      "No es lo que haces para agradar ni lo que se espera de ti: es lo que brilla cuando dejas de actuar. El signo donde cae describe la forma que toma esa luz.",
      "Es el arquetipo que la mayoría conoce («soy de Leo»), y el que más se malinterpreta.",
    ],
  },

  luna: {
    titulo: "Lo que sientes antes de pensarlo",
    parrafos: [
      "La Luna es tu mundo emocional: cómo reaccionas cuando algo te toca, qué necesitas para sentirte a salvo y dónde te refugias cuando duele.",
      "Es la parte más antigua de ti, la que aprendiste de niño antes de tener palabras. Se activa sola, sin permiso.",
      "Su signo describe el tipo de cuidado que necesitas y el que sabes dar.",
    ],
  },

  mercurio: {
    titulo: "Cómo piensas y cómo lo cuentas",
    parrafos: [
      "Mercurio es la mente: la velocidad a la que piensas, cómo ordenas las ideas, qué te resulta fácil aprender y cómo lo comunicas.",
      "También es el ruido mental: las conversaciones que repasas, lo que te callas y lo que se te escapa.",
      "Su signo dice si piensas en imágenes o en argumentos, si vas al grano o das mil vueltas.",
    ],
  },

  venus: {
    titulo: "Qué amas y cómo lo amas",
    parrafos: [
      "Venus es el vínculo y el disfrute: cómo quieres, qué te atrae, qué te parece bello y qué necesitas recibir para sentirte querido.",
      "También es tu relación con el placer y con lo que valoras (incluido el dinero y lo material).",
      "Su signo describe tu forma de acercarte a otro y lo que te enamora sin que puedas evitarlo.",
    ],
  },

  marte: {
    titulo: "Cómo peleas y cómo empiezas",
    parrafos: [
      "Marte es la acción: el impulso, el deseo, la manera en que vas a por lo que quieres y cómo reaccionas cuando algo se te pone delante.",
      "Es también tu enfado: si explota rápido, si se enquista, si se te da la vuelta.",
      "Su signo dice de qué manera te defiendes y qué es lo que te pone en marcha de verdad.",
    ],
  },

  jupiter: {
    titulo: "Dónde te expandes y en qué confías",
    parrafos: [
      "Júpiter es el crecimiento: la fe, el sentido, las ganas de más. Dónde te vienen las oportunidades y dónde te crees capaz de todo.",
      "También es el exceso: la promesa que haces sin medirla, el sí dicho demasiado pronto.",
      "Su signo describe qué te hace sentir que la vida tiene un para qué.",
    ],
  },

  saturno: {
    titulo: "Dónde te exiges y dónde te frenas",
    parrafos: [
      "Saturno es el límite, la estructura y el tiempo. La parte de ti que se toma las cosas en serio, aguanta y construye despacio.",
      "También es el miedo a no dar la talla, la autoexigencia, la sensación de que no basta con lo que haces.",
      "Su signo dice dónde madura tarde y dónde acabas siendo tu propia autoridad.",
    ],
  },

  urano: {
    titulo: "Lo que rompe contigo",
    parrafos: [
      "Urano es el cambio brusco: lo que se sale de la norma, lo que te hace distinto y lo que un día decides romper de golpe.",
      "Es la libertad y también la inquietud: la incapacidad de aguantar lo que ya no tiene sentido.",
      "Su signo señala dónde no toleras que te digan cómo tienes que ser.",
    ],
  },

  neptuno: {
    titulo: "Dónde se te borran los límites",
    parrafos: [
      "Neptuno disuelve. Es la sensibilidad, la imaginación, la espiritualidad y la compasión: la parte de ti que se funde con lo que tiene delante.",
      "Y también la niebla: idealizar, confundirse, escapar, absorber el dolor de otros como si fuera tuyo.",
      "Su signo describe dónde no distingues bien lo que es tuyo de lo que no lo es.",
    ],
  },

  pluton: {
    titulo: "Lo que muere y renace en ti",
    parrafos: [
      "Plutón es la transformación profunda: las crisis que te parten en dos y la fuerza con la que sales del otro lado.",
      "Es el poder, el control, lo escondido, lo que no se dice. Lo que te obsesiona y lo que te regenera.",
      "Su signo describe qué zona de tu vida no te deja quedarte igual.",
    ],
  },

  quiron: {
    titulo: "Tu herida y tu don",
    parrafos: [
      "Quirón es el «sanador herido»: el punto donde te duele algo que no termina de cerrar y que, precisamente por eso, sabes acompañar en otros.",
      "No se cura del todo. Se convierte en oficio, en escucha, en la cosa que se te da bien sostener.",
      "Su signo describe la forma de esa herida y del don que sale de ella.",
    ],
  },

  lilith: {
    titulo: "Lo que escondes por miedo al rechazo",
    parrafos: [
      "Lilith es la parte de ti que no se somete: el deseo sin permiso, la rabia legítima, lo que aprendiste a tapar porque incomodaba.",
      "Cuando se niega, se vuelve sombra. Cuando se reconoce, se vuelve autenticidad.",
      "Su signo describe qué parte de ti te enseñaron a esconder.",
    ],
  },

  nodoNorte: {
    titulo: "Hacia dónde te toca crecer",
    parrafos: [
      "El Nodo Norte es la dirección: aquello que todavía no dominas y que, sin embargo, es justo lo que has venido a aprender.",
      "Da vértigo por definición. Lo reconoces porque te llama y te asusta a partes iguales.",
      "Su signo describe el camino que te cuesta, y que a la vez te ordena la vida.",
    ],
  },

  nodoSur: {
    titulo: "Lo que ya sabes de sobra",
    parrafos: [
      "El Nodo Sur es lo que traes aprendido: aquello que se te da bien casi sin esfuerzo y a lo que vuelves cuando la vida aprieta.",
      "Es cómodo, y por eso es una trampa: repetirlo te mantiene a salvo y quieto.",
      "Su signo describe el refugio al que te retiras.",
    ],
  },
};
