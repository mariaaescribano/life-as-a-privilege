// Las partes del CEREBRO, para /metodo/fisiologia/cerebro.
//
// Misma forma que SISTEMAS (SistemasFisiologia.ts): cada parte es una tarjeta
// con foto + nombre, y al pulsarla se abre la ficha común de Fisiología
// (FichaFisioModal) con las 3 claves y la explicación.
//
// A diferencia de los sistemas, aquí las partes van AGRUPADAS por zona: el
// cerebro se entiende mucho mejor de fuera hacia dentro (corteza → centro
// profundo → base) que como una lista de catorce nombres seguidos.
//
// Las fotos van en /public/recorrido/fisiologia/cerebro/<key>.png. Mientras no
// estén, la tarjeta enseña la inicial con el color de la parte (igual que
// hicieron los sistemas antes de tener sus ilustraciones).

/** Zonas en las que se agrupan las partes, en el orden en que se recorren. */
export type ZonaCerebro = "corteza" | "centro" | "base";

export type ParteCerebro = {
  key: string;
  label: string;
  /** Zona del cerebro a la que pertenece (agrupa la rejilla). */
  zona: ZonaCerebro;
  /** Color de acento de la parte. */
  color: string;
  /** Foto de la parte. */
  foto: string;
  /** Las 3 ideas clave, para captarlo en 3-5 segundos. */
  claves: string[];
  /** Qué es y qué hace, con el detalle que no cabe en las claves. */
  descripcion: string;
};

const FOTO = (k: string) => `/recorrido/fisiologia/cerebro/${k}.png`;

/** Título de cada zona, en el orden en que se pintan. */
export const ZONAS_CEREBRO: { zona: ZonaCerebro; titulo: string; entradilla: string }[] = [
  {
    zona: "corteza",
    titulo: "La corteza",
    entradilla: "La capa de fuera, la más nueva. Aquí vive lo que llamas «pensar».",
  },
  {
    zona: "centro",
    titulo: "El centro profundo",
    entradilla: "Debajo de la corteza. Lo que sientes antes de pensarlo.",
  },
  {
    zona: "base",
    titulo: "La base",
    entradilla: "Lo más antiguo. Late, respira y te sostiene sin pedirte permiso.",
  },
];

export const PARTES_CEREBRO: ParteCerebro[] = [
  // ── LA CORTEZA ────────────────────────────────────────────────────────────
  {
    key: "corteza",
    label: "Corteza cerebral",
    zona: "corteza",
    color: "#c9a7ff",
    foto: FOTO("corteza"),
    claves: ["La capa de fuera, arrugada", "Unos 16.000 millones de neuronas", "Lo consciente ocurre aquí"],
    descripcion:
      "Es la capa exterior del cerebro, de apenas unos milímetros de grosor, y está toda plegada. Esos pliegues no son adorno: son la forma que encontró la evolución de meter una superficie enorme dentro de un cráneo pequeño. Si la extendieras, ocuparía como una servilleta grande. Aquí ocurre casi todo lo que reconoces como «ser tú»: el lenguaje, las decisiones, la imaginación, el reconocer una cara. Se divide en dos hemisferios y cada hemisferio en cuatro lóbulos.",
  },
  {
    key: "frontal",
    label: "Lóbulo frontal",
    zona: "corteza",
    color: "#b79cff",
    foto: FOTO("frontal"),
    claves: ["Decidir, planificar, frenar", "El último en madurar (~25 años)", "Mueve el cuerpo voluntariamente"],
    descripcion:
      "Está justo detrás de la frente y es el que decide. Planifica, ordena los pasos, sostiene la atención y —sobre todo— frena: es el que dice «esto mejor no». Ahí está la corteza prefrontal, la parte del cerebro que más tarda en terminar de madurar, hasta pasados los veinte. Por eso a los quince años se siente igual de intenso que a los cuarenta, pero se frena mucho peor. En su parte de atrás está la corteza motora, que ordena cada movimiento voluntario.",
  },
  {
    key: "parietal",
    label: "Lóbulo parietal",
    zona: "corteza",
    color: "#9fb8f2",
    foto: FOTO("parietal"),
    claves: ["Recibe el tacto y el dolor", "Sabe dónde está tu cuerpo", "Orienta en el espacio"],
    descripcion:
      "Recibe todo lo que tocas, la temperatura, la presión y el dolor, y lo junta en una sola sensación con sentido. Es también el que sabe dónde termina tu mano cuando cierras los ojos, el que te deja calcular la distancia hasta el vaso antes de cogerlo y el que te orienta cuando andas por un sitio nuevo. Cuando dices que alguien «es muy espacial», estás hablando de esto.",
  },
  {
    key: "temporal",
    label: "Lóbulo temporal",
    zona: "corteza",
    color: "#8fd0e6",
    foto: FOTO("temporal"),
    claves: ["Oye y entiende el lenguaje", "Reconoce caras y voces", "Guarda recuerdos y significados"],
    descripcion:
      "Está a los lados, a la altura de las orejas. Procesa el sonido y lo convierte en algo con significado: no solo oyes ruido, entiendes una frase o reconoces una canción por tres notas. También es el que reconoce caras y voces, y donde se guarda buena parte de lo que sabes del mundo. Por dentro conecta con el hipocampo y la amígdala, y por eso un olor o una melodía te devuelven un recuerdo entero de golpe.",
  },
  {
    key: "occipital",
    label: "Lóbulo occipital",
    zona: "corteza",
    color: "#7fc9c2",
    foto: FOTO("occipital"),
    claves: ["Toda la visión pasa por aquí", "Está en la nuca, no en los ojos", "Construye lo que crees ver"],
    descripcion:
      "Ocupa la parte de atrás del todo, en la nuca. Es donde se ve de verdad: los ojos solo captan luz, la imagen se construye aquí. Y se construye por partes —color por un lado, movimiento por otro, bordes por otro— hasta montar una escena completa. Que la sientas continua y sin costuras es un trabajo enorme que no notas nunca. Por eso una lesión aquí puede dejar los ojos perfectos y aun así no ver.",
  },
  {
    key: "cuerpo-calloso",
    label: "Cuerpo calloso",
    zona: "corteza",
    color: "#e8e0cf",
    foto: FOTO("cuerpo-calloso"),
    claves: ["Une los dos hemisferios", "Unos 200 millones de fibras", "Hace que trabajen como uno"],
    descripcion:
      "Es el puente que une el hemisferio izquierdo con el derecho: un haz de unos doscientos millones de fibras nerviosas que cruzan de lado a lado. Gracias a él los dos lados comparten lo que cada uno hace y el cerebro funciona como una sola cosa en vez de como dos. Lo de «ser de hemisferio izquierdo o derecho» es un mito: la gracia está justo en que están conectados todo el rato.",
  },

  // ── EL CENTRO PROFUNDO ────────────────────────────────────────────────────
  {
    key: "talamo",
    label: "Tálamo",
    zona: "centro",
    color: "#a7d9f2",
    foto: FOTO("talamo"),
    claves: ["La centralita de los sentidos", "Filtra lo que llega a la conciencia", "Todo pasa por aquí menos el olfato"],
    descripcion:
      "Está en el centro, y por él pasa casi toda la información que entra por los sentidos antes de subir a la corteza. El olfato es la única excepción: va directo, y por eso los olores llegan tan crudos y tan pegados a la emoción. El tálamo no solo reparte, también filtra: decide qué merece llegar a tu conciencia y qué se queda fuera. Ahora mismo no notabas la ropa sobre la piel; eso es él.",
  },
  {
    key: "hipotalamo",
    label: "Hipotálamo",
    zona: "centro",
    color: "#e6a7d9",
    foto: FOTO("hipotalamo"),
    claves: ["Hambre, sed, sueño, temperatura", "Manda sobre las hormonas", "Del tamaño de una almendra"],
    descripcion:
      "Es pequeñísimo y gobierna lo esencial: el hambre, la sed, la temperatura del cuerpo, el deseo sexual y el reloj que decide cuándo tienes sueño. Es la bisagra entre el sistema nervioso y el hormonal, porque desde aquí se da la orden a la hipófisis. Cuando el estrés te quita el hambre, te desajusta el sueño o te corta la regla, esto es lo que está pasando: no es «cosa de la cabeza», es una cadena física que empieza aquí.",
  },
  {
    key: "hipofisis",
    label: "Hipófisis",
    zona: "centro",
    color: "#f2b48f",
    foto: FOTO("hipofisis"),
    claves: ["La glándula que manda", "Ordena a tiroides, ovarios, suprarrenales", "Pesa medio gramo"],
    descripcion:
      "Del tamaño de un guisante y colgando bajo el hipotálamo, es la glándula que da órdenes a las demás. Desde aquí salen las hormonas que ponen en marcha la tiroides, los ovarios y los testículos, las suprarrenales y el crecimiento. Se la llamó «la glándula maestra» durante años, aunque en realidad ella también obedece: quien le manda es el hipotálamo, justo encima.",
  },
  {
    key: "amigdala",
    label: "Amígdala",
    zona: "centro",
    color: "#f28b8b",
    foto: FOTO("amigdala"),
    claves: ["La alarma del miedo", "Reacciona antes de que entiendas", "Marca lo que hay que recordar"],
    descripcion:
      "Es la que detecta el peligro, y lo hace deprisa: reacciona antes de que hayas entendido qué pasa. Por eso das un salto con un ruido y solo después te das cuenta de que era una puerta. También es la que pone etiqueta emocional a lo que vives, y lo que va marcado con emoción se recuerda mucho mejor. Con estrés sostenido se vuelve hiperreactiva y empieza a dar la alarma con cosas que no lo son.",
  },
  {
    key: "hipocampo",
    label: "Hipocampo",
    zona: "centro",
    color: "#9fe6b8",
    foto: FOTO("hipocampo"),
    claves: ["Convierte lo vivido en recuerdo", "Es el mapa del espacio", "Fabrica neuronas nuevas"],
    descripcion:
      "Tiene forma de caballito de mar, de ahí el nombre. Es el que pasa a limpio: coge lo que acabas de vivir y lo convierte en un recuerdo que dura, sobre todo mientras duermes. También es tu mapa: la memoria de los sitios vive aquí. Y es una de las poquísimas zonas del cerebro adulto donde nacen neuronas nuevas. El cortisol del estrés crónico lo daña, y el ejercicio y el buen sueño lo protegen.",
  },
  {
    key: "ganglios-basales",
    label: "Ganglios basales",
    zona: "centro",
    color: "#f2c86b",
    foto: FOTO("ganglios-basales"),
    claves: ["Automatizan lo que repites", "Aquí viven los hábitos", "Trabajan con dopamina"],
    descripcion:
      "Son un grupo de núcleos profundos que se encargan de lo que ya no necesitas pensar. Aprender a conducir cuesta un esfuerzo enorme; un año después conduces mientras hablas. Ese paso de «esforzado» a «automático» ocurre aquí. Por eso son también la casa de los hábitos, los buenos y los malos, y funcionan con dopamina: cuando algo sale bien, marcan la secuencia para repetirla.",
  },

  // ── LA BASE ───────────────────────────────────────────────────────────────
  {
    key: "cerebelo",
    label: "Cerebelo",
    zona: "base",
    color: "#b8d98f",
    foto: FOTO("cerebelo"),
    claves: ["Equilibrio y precisión", "La mitad de tus neuronas están aquí", "Afina el movimiento sobre la marcha"],
    descripcion:
      "Está detrás y abajo, y aunque ocupa una décima parte del cerebro contiene más de la mitad de todas tus neuronas. No decide el movimiento, lo afina: corrige el gesto mientras lo haces para que salga suave y en su sitio. Mantenerte de pie, coger un vaso sin tirarlo o escribir a mano son suyos. También participa en aprender secuencias y en el lenguaje, aunque durante décadas se creyó que solo era motor.",
  },
  {
    key: "tronco",
    label: "Tronco encefálico",
    zona: "base",
    color: "#e3a6a6",
    foto: FOTO("tronco"),
    claves: ["Respirar y latir sin pensarlo", "Regula el estar despierto", "Une el cerebro con la médula"],
    descripcion:
      "Es el tallo que conecta el cerebro con la médula espinal, y lo más antiguo que tienes. Aquí se controla lo que no puedes permitirte olvidar: la respiración, los latidos, la tensión, la tos, el tragar. También regula el estar despierto o dormido. Por él pasan todas las señales que suben y bajan entre el cuerpo y el cerebro, y ahí es donde se cruzan de lado: por eso el hemisferio izquierdo mueve la mitad derecha del cuerpo.",
  },
];

/** Frase de cierre de la página, cuando ya se han leído todas las partes. */
export const FRASE_CEREBRO =
  "Kilo y medio de tejido que se conoce a sí mismo. Eso es lo único que hay entre tú y el mundo.";
