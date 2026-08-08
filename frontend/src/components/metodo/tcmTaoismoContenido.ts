// ─────────────────────────────────────────────────────────────────────────
// TAOÍSMO · las «leyes» del Tao (paso 7 del recorrido de Medicina China)
//
// La Medicina China no es una técnica suelta: nace de una forma de mirar. Este
// paso recoge esa mirada en diez leyes —no mandamientos, sino regularidades de
// la naturaleza— y baja cada una al cuerpo, que es donde la medicina las usa.
//
// FORMATO: cortito a propósito. Una línea de esencia, un párrafo y una línea de
// cuerpo. Si algo no cabe en eso, es que sobra.
//
// ✍️  EDITAR CONTENIDO: cambia los textos aquí. No cambies las `key` (son la
//     clave de React y el nombre del archivo de la foto).
// ─────────────────────────────────────────────────────────────────────────

export interface LeyTao {
  /** Clave estable. Es también el nombre de su foto: /recorrido/tcm/taoismo/<key>.webp */
  key: string;
  /** Nombre en castellano. */
  nombre: string;
  /** Nombre en pinyin: «Tao», «Wu Wei»… */
  pinyin: string;
  /** Carácter chino. */
  hanzi: string;
  /** La ley en una frase. */
  esencia: string;
  /** Un párrafo. Uno solo. */
  texto: string;
  /** Cómo se traduce en el cuerpo: el puente con la medicina. Una línea. */
  enTuCuerpo: string;
}

/** Intro de la página (bajo el header). */
export const TAOISMO_INTRO: string[] = [
  "El taoísmo no es una religión: es una forma de mirar. Lao-Tse llamó Tao al «camino», el orden natural que rige todo lo que existe. De esa mirada nace lo que ya has recorrido: el Qi que nos une, el Yin y el Yang que se equilibran, los cinco elementos que se generan y se controlan.",
  "No son normas que haya que obedecer, sino cómo funciona la naturaleza. Puedes ignorarlas, igual que puedes ignorar la gravedad: la diferencia la paga tu cuerpo.",
];

/** Cierre de la página. */
export const TAOISMO_CIERRE = {
  texto:
    "El taoísmo no te pide ser mejor que ayer, sino dejar de ir en contra de ti. La salud, desde esta mirada, no es un premio: es lo que ocurre cuando dejas de estorbarte.",
  cita: "«El hombre sigue a la tierra, la tierra sigue al cielo, el cielo sigue al Tao, y el Tao se sigue a sí mismo.»",
  autor: "— Lao-Tse, Tao Te King",
};

/**
 * Ilustración de cada ley: CUADRADA (1:1) y en WebP (las sube en PNG y se pasan
 * con `node scripts/webp/convertir.mjs --lote=9`). Si el archivo no existe
 * todavía, la tarjeta enseña su carácter chino en grande: la página funciona
 * igual, sin huecos ni fotos rotas.
 */
export const FOTO_LEY = (key: string) => `/recorrido/tcm/taoismo/${key}.webp`;

// ─────────────────────────────────────────────────────────────────────────
// LAS DIEZ LEYES
// ─────────────────────────────────────────────────────────────────────────
export const LEYES_TAO: LeyTao[] = [
  {
    key: "tao",
    nombre: "El camino",
    pinyin: "Tao",
    hanzi: "道",
    esencia: "Todo sigue un orden natural. Tú también tienes el tuyo.",
    texto:
      "El Tao no es un dios ni premia ni castiga: es la ley por la que la semilla brota en primavera y la hoja cae en otoño. Eres un pequeño universo dentro del grande, y tu camino no es el de nadie más.",
    enTuCuerpo: "Cada órgano tiene su hora y su estación. Vivir a contrarritmo se acaba pagando.",
  },
  {
    key: "yin-yang",
    nombre: "Los opuestos que se necesitan",
    pinyin: "Yin Yang",
    hanzi: "陰陽",
    esencia: "Nada existe sin su contrario: no luchan, se sostienen.",
    texto:
      "El Yang es movimiento, calor y actividad; el Yin, reposo, frío y nutrición. Son la inspiración y la espiración de una misma respiración, y dentro de cada uno hay una semilla del otro.",
    enTuCuerpo: "Toda la medicina china lee en esta clave: calor o frío, exceso o vacío.",
  },
  {
    key: "wu-wei",
    nombre: "La no acción",
    pinyin: "Wu Wei",
    hanzi: "無為",
    esencia: "No es no hacer: es no forzar.",
    texto:
      "El que riega y espera practica Wu Wei; el que tira de la planta para que crezca antes, la mata. Casi todo nuestro agotamiento nace de tirar de plantas.",
    enTuCuerpo: "Forzar es cortisol: carga al hígado y gasta la reserva del riñón.",
  },
  {
    key: "ziran",
    nombre: "Así por sí mismo",
    pinyin: "Ziran",
    hanzi: "自然",
    esencia: "Cada ser tiene su naturaleza; la salud es dejarla ser.",
    texto:
      "Es lo que ocurre cuando nada interfiere: el agua baja, el fuego sube, el niño duerme cuando tiene sueño. Buena parte de lo que nos duele viene de vivir con el horario, el cuerpo y el deseo de otro.",
    enTuCuerpo: "A un cuerpo friolero no se le exige frío; a una digestión delicada, crudos.",
  },
  {
    key: "fan",
    nombre: "El retorno",
    pinyin: "Fan",
    hanzi: "反",
    esencia: "Todo lo que llega a su extremo se convierte en su contrario.",
    texto:
      "Lo que crece decrece, lo que se llena se vacía, el calor extremo acaba en frío. Y también al revés: si estás en el punto más bajo, esa misma ley dice que el movimiento ya está girando.",
    enTuCuerpo: "El agotamiento no viene de un golpe: viene de sostener un exceso demasiado tiempo.",
  },
  {
    key: "de",
    nombre: "La virtud",
    pinyin: "De",
    hanzi: "德",
    esencia: "Lo que cada ser da cuando está en su sitio.",
    texto:
      "La virtud del árbol es dar sombra; la del agua, bajar y nutrir. No hay que fabricarla a base de esfuerzo: basta con quitar lo que la tapa.",
    enTuCuerpo: "Un órgano sano no necesita que le pidan que funcione. Aquí la virtud es fisiología.",
  },
  {
    key: "pu",
    nombre: "La simplicidad",
    pinyin: "Pu",
    hanzi: "樸",
    esencia: "La madera sin tallar sirve para todo.",
    texto:
      "Cuanto más añadimos —cosas, normas, ideas sobre quién deberíamos ser—, menos disponibles estamos. Para aprender se suma cada día; para seguir el Tao se quita cada día.",
    enTuCuerpo: "La comida más curativa es la más simple: un congee, un caldo, una verdura al vapor.",
  },
  {
    key: "xu",
    nombre: "El vacío útil",
    pinyin: "Xu",
    hanzi: "虛",
    esencia: "Lo que sirve de una vasija es el hueco.",
    texto:
      "La rueda gira por el vacío del eje y la casa se habita por el espacio que no está ocupado. Llenar cada hueco del día no te hace más productiva: te hace menos habitable.",
    enTuCuerpo: "El cuerpo se repara en las pausas: el hígado de noche, la digestión entre comidas.",
  },
  {
    key: "qi",
    nombre: "Todo está conectado",
    pinyin: "Qi",
    hanzi: "氣",
    esencia: "Lo que haces contigo, lo haces con todo.",
    texto:
      "El Qi es la energía que da vida y movimiento a la materia, y nos une con el aire, la comida, las estaciones y la gente con la que vivimos. Cuidarte no es egoísmo: es higiene compartida.",
    enTuCuerpo: "El Qi entra por dos puertas, la respiración y la comida. Un mismo depósito.",
  },
  {
    key: "bu-zheng",
    nombre: "No competir",
    pinyin: "Bu Zheng",
    hanzi: "不爭",
    esencia: "El agua vence a la piedra porque no lucha.",
    texto:
      "No competir no es rendirse: es dejar de gastar la fuerza en pelear posiciones y ponerla en avanzar. Quien no compite, decía Lao-Tse, no tiene rivales.",
    enTuCuerpo: "Competir sin tregua es Madera en exceso: mandíbula, hombros y un hígado cargado.",
  },
];

export const TAOISMO_TOTAL = LEYES_TAO.length;
