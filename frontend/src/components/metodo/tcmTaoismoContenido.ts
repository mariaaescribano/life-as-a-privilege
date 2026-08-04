// ─────────────────────────────────────────────────────────────────────────
// TAOÍSMO · las «leyes» del Tao (paso 7 del recorrido de Medicina China)
//
// La Medicina China no es una técnica suelta: nace de una forma de mirar el
// mundo. Este paso recoge esa mirada en forma de LEYES —no mandamientos, sino
// regularidades de la naturaleza— y baja cada una al cuerpo, que es donde la
// medicina las usa.
//
// ✍️  EDITAR CONTENIDO: cambia los textos aquí. No cambies las `key` (se usan
//     como clave de React y, si algún día se guarda lectura, en la BD).
// ─────────────────────────────────────────────────────────────────────────

export interface LeyTao {
  /** Clave estable (no cambiar tras publicar). */
  key: string;
  /** Nombre en castellano: «El camino», «La no acción»… */
  nombre: string;
  /** Nombre en pinyin: «Tao», «Wu Wei»… */
  pinyin: string;
  /** Carácter chino. */
  hanzi: string;
  /** Una línea: la ley resumida en una frase. */
  esencia: string;
  /** Explicación (cada elemento del array es un párrafo). */
  texto: string[];
  /** Cómo se traduce esta ley en el cuerpo (el puente con la medicina). */
  enTuCuerpo: string;
  /** Una práctica pequeña y concreta para llevarla al día a día. */
  practica: string;
}

/** Intro de la página (bajo el header). */
export const TAOISMO_INTRO: string[] = [
  "Antes que una medicina, el taoísmo es una forma de mirar. Lao-Tse no fundó una religión ni habló de un dios: describió el Tao, el «camino», el orden natural que rige todo lo que existe, desde el giro de las estaciones hasta el latido de tu corazón.",
  "De esa mirada nace todo lo que has recorrido hasta aquí: el Qi que nos une, el Yin y el Yang que se equilibran, los cinco elementos que se generan y se controlan. Por eso la Medicina China no «ataca» la enfermedad: devuelve a la persona a su camino.",
  "Estas no son leyes que haya que obedecer, sino regularidades de la naturaleza. Puedes ignorarlas, igual que puedes ignorar la gravedad: la diferencia la pagará tu cuerpo.",
];

/** Cita de cierre de la página. */
export const TAOISMO_CIERRE = {
  texto:
    "El taoísmo no te pide que seas mejor que ayer, sino que dejes de ir en contra de ti. La salud, desde esta mirada, no es un premio: es lo que ocurre solo cuando dejas de estorbarte.",
  cita: "«El hombre sigue a la tierra, la tierra sigue al cielo, el cielo sigue al Tao, y el Tao se sigue a sí mismo.»",
  autor: "— Lao-Tse, Tao Te King",
};

// ─────────────────────────────────────────────────────────────────────────
// LAS LEYES
// ─────────────────────────────────────────────────────────────────────────
export const LEYES_TAO: LeyTao[] = [
  {
    key: "tao",
    nombre: "El camino",
    pinyin: "Tao",
    hanzi: "道",
    esencia: "Todo lo que existe sigue un orden natural; tú también tienes el tuyo.",
    texto: [
      "El Tao es el orden que sostiene la realidad: no es un dios, no premia ni castiga, no se puede nombrar del todo. Es la ley por la que la semilla germina en primavera y la hoja cae en otoño, sin que nadie se lo ordene.",
      "El ser humano es un microcosmos dentro del macrocosmos: las mismas leyes que mueven las estaciones mueven tu sangre, tu sueño y tu digestión. Por eso enfermar no es un accidente, sino la señal de que te has salido de tu camino.",
      "Y hay un matiz importante: el Tao de cada persona es distinto. Tu equilibrio no es el de tu madre ni el de tu vecina; parte de la salud consiste en dejar de perseguir un equilibrio prestado.",
    ],
    enTuCuerpo:
      "Cada órgano tiene su hora, su estación y su ritmo. Cuando vives contra ese ritmo —comiendo de madrugada, durmiendo de día, forzando en invierno— el cuerpo protesta antes de enfermar.",
    practica:
      "Elige un solo ritmo natural que estés forzando (la hora de dormir, la de comer) y devuélvelo a su sitio durante una semana.",
  },
  {
    key: "yin-yang",
    nombre: "Los opuestos que se necesitan",
    pinyin: "Yin Yang",
    hanzi: "陰陽",
    esencia: "Nada existe sin su contrario: no son enemigos, son las dos caras de lo mismo.",
    texto: [
      "El Yang es actividad, movimiento, calor, expansión. El Yin es reposo, nutrición, frío, estructura. No luchan entre sí: se generan mutuamente, como la inspiración y la espiración de una misma respiración.",
      "Dentro de cada Yin hay una semilla de Yang, y al revés. Por eso el punto más alto del verano ya contiene el inicio del otoño, y la noche más larga es la que empieza a devolvernos la luz.",
      "La salud no es tener mucho Yang ni mucho Yin: es que ambos se sostengan. La enfermedad aparece cuando uno crece de más o el otro se agota.",
    ],
    enTuCuerpo:
      "Todo lo que la medicina china observa se lee en esta clave: calor o frío, exceso o deficiencia, agitación o agotamiento. Tu lengua, tu pulso y tu sueño hablan siempre de este equilibrio.",
    practica:
      "Mira tu día: ¿cuánto Yang (pantallas, prisa, ruido, esfuerzo) y cuánto Yin (silencio, calor, comida cocinada, descanso)? Añade lo que falte antes de quitar lo que sobra.",
  },
  {
    key: "wu-wei",
    nombre: "La no acción",
    pinyin: "Wu Wei",
    hanzi: "無為",
    esencia: "No es no hacer: es no forzar. Actuar cuando toca y con el mínimo esfuerzo necesario.",
    texto: [
      "Wu Wei suele traducirse mal como «no hacer nada». En realidad significa actuar sin violentar el curso natural de las cosas: como el que rema a favor de la corriente en vez de contra ella.",
      "El agricultor que riega y espera practica Wu Wei; el que tira de la planta para que crezca antes, la mata. Casi todo nuestro agotamiento nace de tirar de plantas.",
      "Forzar da resultados rápidos y caros. No forzar da resultados lentos y sostenibles. La medicina china siempre elige lo segundo.",
    ],
    enTuCuerpo:
      "Forzar es cortisol: exigirte sin descanso sobrecarga al hígado y agota la reserva del riñón. Cuando dejas de empujar, el cuerpo recupera energía para reconstruirse en vez de para defenderse.",
    practica:
      "Identifica una cosa que estés forzando esta semana y suéltala tres días. Observa si el mundo se cae o simplemente sigue su curso.",
  },
  {
    key: "ziran",
    nombre: "Lo que es así por sí mismo",
    pinyin: "Ziran",
    hanzi: "自然",
    esencia: "Cada ser tiene una naturaleza propia; la salud es dejarla ser, no corregirla.",
    texto: [
      "Ziran se traduce como «naturaleza» o «espontaneidad», pero literalmente significa «así por sí mismo». Es lo que ocurre cuando nada interfiere: el agua baja, el fuego sube, el niño duerme cuando tiene sueño.",
      "Aplicado a ti: tienes una constitución, unos ritmos y unos límites que no elegiste. Puedes cuidarlos o pelearte con ellos, pero no cambiarlos por los de otra persona.",
      "Gran parte del sufrimiento moderno viene de vivir según un modelo ajeno: el horario de otro, el cuerpo de otro, el deseo de otro.",
    ],
    enTuCuerpo:
      "Un cuerpo friolero al que se le exige vivir en frío se agota; un cuerpo de digestión delicada al que se le exigen crudos se hincha. Escucharte no es debilidad: es medicina preventiva.",
    practica:
      "Nombra una exigencia que te hayas puesto por comparación con otra persona. Escríbela y pregúntate: ¿es mía o la he copiado?",
  },
  {
    key: "fan",
    nombre: "El retorno",
    pinyin: "Fan",
    hanzi: "反",
    esencia: "Todo lo que llega a su extremo se convierte en su contrario.",
    texto: [
      "El movimiento propio del Tao es volver. Lo que crece acaba decreciendo; lo que se llena acaba vaciándose; el calor extremo genera frío y la euforia extrema, vacío.",
      "Por eso el taoísmo desconfía de los extremos: no por moralismo, sino porque el extremo se paga solo. Quien lo da todo un mes, lo pierde todo al siguiente.",
      "También es una buena noticia: si estás en el punto más bajo, esa misma ley te dice que el movimiento ya está girando.",
    ],
    enTuCuerpo:
      "El agotamiento crónico casi nunca viene de un golpe: viene de sostener un exceso demasiado tiempo. Y la recuperación, cuando respetas el retorno, es igual de silenciosa que lo fue el desgaste.",
    practica:
      "Busca en tu vida un péndulo que se te haya ido a un extremo (trabajo, comida, sueño, redes) y devuélvelo un poco hacia el centro, sin saltar al extremo contrario.",
  },
  {
    key: "de",
    nombre: "La virtud del Tao",
    pinyin: "De",
    hanzi: "德",
    esencia: "El Tao es el camino; el De es lo que cada ser es capaz de dar cuando lo sigue.",
    texto: [
      "El De no es «ser buena persona» en el sentido moral. Es la fuerza propia de cada ser cuando está alineado con su naturaleza: la del árbol es dar sombra; la del agua, bajar y nutrir.",
      "Cuando una persona vive según su Tao, su De se manifiesta solo: aparecen la claridad, la generosidad y la calma, sin tener que fabricarlas.",
      "Por eso el taoísmo no propone esforzarse en ser virtuoso, sino quitar los obstáculos que impiden que la virtud salga.",
    ],
    enTuCuerpo:
      "Un órgano sano no necesita que le pidan que funcione: lo hace. Cuando el hígado fluye hay decisión, cuando el corazón está sereno hay alegría. La virtud, aquí, es fisiológica.",
    practica:
      "Piensa en algo que te salga con naturalidad y que hayas dejado de hacer por falta de tiempo. Devuélvelo a tu semana: eso es tu De.",
  },
  {
    key: "pu",
    nombre: "La simplicidad",
    pinyin: "Pu",
    hanzi: "樸",
    esencia: "El bloque de madera sin tallar: lo que aún no ha sido complicado sirve para todo.",
    texto: [
      "Pu es el trozo de madera antes de convertirse en mueble: no es nada en concreto, y por eso puede ser cualquier cosa. Es el símbolo taoísta de la mente sin adornos y de la vida sin exceso de artificio.",
      "Cuanto más añadimos —normas, objetos, ideas sobre quiénes deberíamos ser—, menos disponibles estamos. La sabiduría taoísta consiste más en quitar que en poner.",
      "«Para aprender se añade cada día; para seguir el Tao se quita cada día».",
    ],
    enTuCuerpo:
      "La comida más curativa de la medicina china es la más simple: un congee de arroz, un caldo, una verdura al vapor. Un aparato digestivo cansado necesita menos, no más.",
    practica:
      "Haz una comida completamente simple: un solo cereal cocinado, caliente y sin prisa. Observa cómo te sienta.",
  },
  {
    key: "xu",
    nombre: "El vacío útil",
    pinyin: "Xu",
    hanzi: "虛",
    esencia: "Lo que sirve de una vasija es el hueco; lo que sirve de una casa son sus ventanas.",
    texto: [
      "El taoísmo insiste en que lo vacío no es lo inútil: la rueda funciona por el hueco del eje, la habitación se habita por el espacio que no está ocupado.",
      "En una vida, el vacío son las pausas: el rato sin plan, el silencio, el aburrimiento. Sin ellos, todo lo demás deja de tener sitio.",
      "Llenar cada hueco no te hace más productivo, te hace menos habitable.",
    ],
    enTuCuerpo:
      "El cuerpo se repara en el vacío: el hígado se regenera de noche, la digestión necesita horas sin comida, el corazón necesita pausas entre latidos. El descanso no es la ausencia de salud: es su condición.",
    practica:
      "Deja un hueco vacío de verdad en tu día: quince minutos sin pantalla, sin música y sin tarea. No para meditar: para no hacer nada.",
  },
  {
    key: "qi",
    nombre: "Todo está conectado",
    pinyin: "Qi",
    hanzi: "氣",
    esencia: "Una misma energía anima la naturaleza y a ti: lo que haces contigo, lo haces con todo.",
    texto: [
      "El Qi es la energía vital que da vida y movimiento a la materia. No es una metáfora poética: es el nombre que el taoísmo da a la capacidad de un sistema de moverse, transformar y sostenerse.",
      "Estamos interconectados a través del Qi: con la comida que tomamos, con el aire que respiramos, con las estaciones y con las personas con las que vivimos.",
      "De ahí una consecuencia ética muy concreta: lo que haces contigo mismo, lo haces con todo y con todos. Cuidarte no es egoísmo, es higiene colectiva.",
    ],
    enTuCuerpo:
      "El Qi se recibe de dos fuentes: el cielo (la respiración, el pulmón) y la tierra (la comida, el bazo). Respirar mal o comer mal no son dos problemas distintos: son el mismo depósito.",
    practica:
      "Come una comida al día mirando lo que comes, sin pantallas, y respira tres veces largas antes del primer bocado.",
  },
  {
    key: "bu-zheng",
    nombre: "No competir",
    pinyin: "Bu Zheng",
    hanzi: "不爭",
    esencia: "El agua es lo más blando y vence a lo más duro, porque no lucha.",
    texto: [
      "«Nada hay más blando que el agua, y sin embargo nada la supera venciendo lo duro». El agua no discute con la piedra: la rodea, y con el tiempo la moldea.",
      "No competir no es rendirse ni dejarse pisar: es dejar de gastar la energía en pelear por posiciones y ponerla en avanzar. Quien no compite, decía Lao-Tse, no tiene rivales.",
      "El taoísmo desconfía de la dureza en todas sus formas: el cuerpo rígido, la mente rígida y la opinión rígida se rompen antes.",
    ],
    enTuCuerpo:
      "La competición sostenida es Madera en exceso: mandíbula apretada, hombros duros, hígado sobrecargado. La flexibilidad de los tendones y la de la actitud son, en esta medicina, la misma cosa.",
    practica:
      "Elige una discusión que no vayas a ganar y suéltala hoy. Fíjate dónde se te afloja el cuerpo al hacerlo.",
  },
];

export const TAOISMO_TOTAL = LEYES_TAO.length;
