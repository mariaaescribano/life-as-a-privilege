// ─────────────────────────────────────────────────────────────────────────
// QIGONG · el trabajo de la energía (paso 9 del recorrido de Medicina China)
//
// La Medicina China tiene cuatro ramas: la acupuntura, las plantas, la dietética
// y el movimiento. Esta página es la cuarta: lo único que no te hace nadie, lo
// que solo puedes hacer tú. Historia, el Dao Yin del que nace todo y las ocho
// posturas de los Ocho Brocados, que es la serie con la que se empieza.
//
// ✍️  EDITAR CONTENIDO: cambia los textos aquí. No cambies las `key` (son la
//     clave de React y el nombre del archivo de la foto).
// ─────────────────────────────────────────────────────────────────────────
import type { Elemento } from "./tcmRecorrido";
import type { Vineta } from "./ComicViewer";

/** Intro de la página (bajo el header). Dos líneas, no más: lo largo se lee en
 *  los cómics (la línea del tiempo y el Dao Yin). */
export const QIGONG_INTRO: string[] = [
  "Qi (氣) es la energía que circula por ti. Gong (功) es el trabajo constante. Qigong es eso: el trabajo de la energía, hecho con las manos y con la respiración.",
  "Es la única rama de esta medicina que no puede hacerte nadie. Esta la haces tú, de pie, diez minutos.",
];

/** Las tres regulaciones (三調): la base de cualquier práctica. */
export interface Regulacion {
  key: string;
  hanzi: string;
  pinyin: string;
  titulo: string;
  texto: string;
}

export const TRES_REGULACIONES: Regulacion[] = [
  {
    key: "cuerpo",
    hanzi: "調身",
    pinyin: "tiáo shēn",
    titulo: "Regular el cuerpo",
    texto: "Pies al ancho de las caderas, rodillas blandas, coxis abajo, coronilla arriba. Antes de mover nada, colócate.",
  },
  {
    key: "respiracion",
    hanzi: "調息",
    pinyin: "tiáo xī",
    titulo: "Regular la respiración",
    texto: "Por la nariz, al vientre, lenta y silenciosa. No la fuerces: acompáñala hasta que sea larga sola.",
  },
  {
    key: "mente",
    hanzi: "調心",
    pinyin: "tiáo xīn",
    titulo: "Regular la mente",
    texto: "La atención dentro del movimiento, no en la lista de la compra. Cuando las tres se funden, eso es la práctica (三調合一).",
  },
];

/** Qué es (y qué no es) el qigong. Tres frases; ni una más. */
export const QIGONG_QUE_ES: string[] = [
  "En China no es una moda: es la cuarta rama de su medicina, junto con la acupuntura, la farmacopea y la dietética. Se practica en los parques a las siete de la mañana.",
  "El movimiento es lento a propósito: la lentitud te obliga a sostener, y sostener es lo que mueve el Qi.",
  "No busca fuerza, busca circulación. No te añade nada: te desatasca.",
];

// ─────────────────────────────────────────────────────────────────────────
// DE DÓNDE VIENE · los hitos, en orden
//
// En la página solo se ve la LÍNEA DEL TIEMPO: la fecha y el titular de cada
// hito. El texto se lee en el cómic (HISTORIA_QIGONG_VINETAS), que se abre
// pinchando cualquier hito y arranca justo por ese.
// ─────────────────────────────────────────────────────────────────────────
export interface HitoQigong {
  key: string;
  fecha: string;
  titulo: string;
  texto: string;
}

export const HISTORIA_QIGONG: HitoQigong[] = [
  {
    key: "jade",
    fecha: "s. IV a.C.",
    titulo: "La inscripción del jade",
    texto: "Un pequeño colgante de jade de doce caras (行氣玉佩銘) describe cómo hacer bajar la respiración hasta el vientre, dejarla asentarse y devolverla arriba. Es el texto más antiguo que se conserva sobre conducir el Qi: la práctica es anterior a los libros que la explican.",
  },
  {
    key: "zhuangzi",
    fecha: "s. IV a.C.",
    titulo: "Zhuangzi se ríe un poco",
    texto: "«Soplan y respiran, exhalan lo viejo y toman lo nuevo; se cuelgan como el oso y se estiran como el pájaro, todo por vivir mucho.» Zhuangzi lo cuenta para decir que la longevidad no es el fin, pero de paso nos deja la primera descripción escrita de la práctica.",
  },
  {
    key: "mawangdui",
    fecha: "168 a.C.",
    titulo: "El Dao Yin Tu de Mawangdui",
    texto: "En una tumba sellada del sur de China apareció una tela pintada con 44 figuras —mujeres y hombres, jóvenes y viejos— estirándose, girando y respirando, cada una con su nombre al lado. Es la prueba más antigua: hace más de dos mil años esto ya estaba ordenado, dibujado y enseñado.",
  },
  {
    key: "huatuo",
    fecha: "s. II d.C.",
    titulo: "Hua Tuo y los cinco animales",
    texto: "El gran cirujano de la antigüedad china ordena la práctica en cinco juegos (五禽戲): tigre, ciervo, oso, mono y ave. Su frase se sigue citando: «una puerta que se usa no se pudre, y el agua que corre no se estanca».",
  },
  {
    key: "gehong",
    fecha: "s. IV",
    titulo: "Ge Hong lo pone por escrito",
    texto: "En el Baopuzi, el alquimista Ge Hong reúne respiración, dao yin y meditación como un mismo trabajo de cultivo interno. A partir de aquí, cada monasterio taoísta y cada linaje médico irá guardando su propia serie.",
  },
  {
    key: "liuzijue",
    fecha: "s. VI",
    titulo: "Los Seis Sonidos",
    texto: "Tao Hongjing recoge el Liu Zi Jue (六字訣): seis sonidos espirados, uno por órgano —xu para el hígado, he para el corazón, hu para el bazo, si para el pulmón, chui para el riñón y xi para el Triple Calentador—. Curar con la voz al soltar el aire.",
  },
  {
    key: "baduanjin",
    fecha: "s. XII",
    titulo: "Los Ocho Brocados",
    texto: "Aparece el Ba Duan Jin (八段錦), ocho movimientos que la tradición atribuye al general Yue Fei para mantener sanos a sus soldados. Se llaman «brocados» porque son ocho piezas de seda bordada: cortas, valiosas y que se pasan de mano en mano. Es la serie con la que se empieza, todavía hoy.",
  },
  {
    key: "yijinjing",
    fecha: "1624",
    titulo: "El cambio del tendón",
    texto: "Se publica el Yi Jin Jing (易筋經), ligado al monasterio de Shaolin: una serie más exigente, de fuerza sostenida, pensada para cambiar la calidad del tendón y del hueso. La rama marcial de la misma raíz.",
  },
  {
    key: "moderno",
    fecha: "1950 · 2003",
    titulo: "La palabra «qigong» es reciente",
    texto: "El nombre que usamos hoy se populariza en los años cincuenta, cuando el médico Liu Guizhen agrupa las prácticas antiguas bajo un término único en un sanatorio del norte. En 2003 China estandariza cuatro series de qigong para la salud —los Ocho Brocados, los Cinco Animales, los Seis Sonidos y el Yi Jin Jing— y las estudia en ensayos clínicos. Lo antiguo es la práctica; la palabra es de anteayer.",
  },
];

/** Foto de cada hito de la línea del tiempo (viñeta del cómic de la historia).
 *  CUADRADA y en WebP, en `/public/recorrido/tcm/qigong/historia/<key>.webp`.
 *  Mientras no exista, el visor avisa de que esa viñeta está por llegar. */
export const FOTO_HITO = (key: string) => `/recorrido/tcm/qigong/historia/${key}.webp`;

/** El cómic de «De dónde viene»: un hito por viñeta, en orden. La fecha va de
 *  antetítulo, así la línea del tiempo se sigue leyendo dentro del cómic. */
export const HISTORIA_QIGONG_VINETAS: Vineta[] = HISTORIA_QIGONG.map((h) => ({
  src: FOTO_HITO(h.key),
  eyebrow: h.fecha,
  titulo: h.titulo,
  paragraphs: [h.texto],
}));

// ─────────────────────────────────────────────────────────────────────────
// DAO YIN · y el rostro femenino del Dao
//
// Todo esto se lee en su propio cómic (DAO_YIN_VINETAS). En la página solo
// queda el nombre en chino y una línea: es el corazón de la página, pero no
// tiene por qué ser un muro de texto.
// ─────────────────────────────────────────────────────────────────────────
export const DAO_YIN = {
  hanzi: "導引",
  pinyin: "dǎo yǐn",
  /** La línea que se lee en la página (el resto, en el cómic). */
  resumen: "Guiar el Qi y estirar el cuerpo. Es el nombre que esto tuvo durante dos mil años… y la puerta al rostro femenino del Dao.",
};

/** Foto de cada viñeta del cómic del Dao Yin: CUADRADA y en WebP, en
 *  `/public/recorrido/tcm/qigong/daoyin/<key>.webp`. */
export const FOTO_DAOYIN = (key: string) => `/recorrido/tcm/qigong/daoyin/${key}.webp`;

export const DAO_YIN_VINETAS: Vineta[] = [
  {
    src: FOTO_DAOYIN("nombre"),
    eyebrow: "導引 · dǎo yǐn",
    titulo: "Antes se llamaba Dao Yin",
    paragraphs: [
      "Antes de que existiera la palabra «qigong», esto se llamaba Dao Yin. 導 dǎo es guiar, conducir. 引 yǐn es tirar, estirar, atraer hacia ti.",
      "Guiar el Qi y estirar el cuerpo: el nombre describe exactamente lo que haces mientras lo haces.",
    ],
  },
  {
    src: FOTO_DAOYIN("mawangdui"),
    eyebrow: "168 a.C.",
    titulo: "Escrito en la tela",
    paragraphs: [
      "Es el nombre que está escrito en la tela de Mawangdui, junto a cada una de aquellas 44 figuras que se estiran, giran y respiran.",
      "Dos mil años después seguimos haciendo lo mismo con otro nombre.",
    ],
  },
  {
    src: FOTO_DAOYIN("yin"),
    eyebrow: "引 no es 陰",
    titulo: "Una cosa, con cariño",
    paragraphs: [
      "El 引 de «estirar» no es el 陰 yīn de lo femenino: son dos caracteres distintos y dos palabras distintas.",
      "Pero la intuición no va desencaminada. Lo femenino no está en el nombre: está en el centro mismo de todo el taoísmo.",
    ],
  },
  {
    src: FOTO_DAOYIN("madre"),
    eyebrow: "El rostro femenino del Dao",
    titulo: "A Lao-Tse le sale una madre",
    paragraphs: [
      "Cuando Lao-Tse tiene que decir qué es el Dao, no le sale una figura de padre ni de rey. Le sale una madre, un valle, un útero, una hondonada.",
      "Lo que recibe, lo que sostiene, lo que da vida sin quedarse con nada.",
    ],
  },
  {
    src: FOTO_DAOYIN("no-fuerza"),
    eyebrow: "El rostro femenino del Dao",
    titulo: "No manda: nutre",
    paragraphs: [
      "El Dao no conquista: cede, y por eso vence. No hace: deja que ocurra.",
      "Ese es el fondo yin de esta medicina entera, y también el de esta práctica: en el qigong no se fuerza nada. Se abre, se sostiene y se deja pasar.",
    ],
  },
  {
    src: FOTO_DAOYIN("cita-6"),
    eyebrow: "Tao Te King, cap. 6 · 谷神不死，是謂玄牝",
    paragraphs: [
      "«El espíritu del valle no muere. Se le llama la hembra misteriosa. La puerta de la hembra misteriosa es la raíz del cielo y de la tierra.»",
    ],
  },
  {
    src: FOTO_DAOYIN("cita-25"),
    eyebrow: "Tao Te King, cap. 25 · 可以為天下母",
    paragraphs: [
      "«Hay algo que se formó antes que el cielo y la tierra. Silencioso, vacío, solo e inmutable. Podría ser la madre del mundo. No sé su nombre; lo llamo Dao.»",
    ],
  },
  {
    src: FOTO_DAOYIN("cita-28"),
    eyebrow: "Tao Te King, cap. 28 · 知其雄，守其雌",
    paragraphs: [
      "«Conoce lo masculino, mantente en lo femenino, y serás el cauce del mundo.»",
    ],
  },
  {
    src: FOTO_DAOYIN("cita-51"),
    eyebrow: "Tao Te King, cap. 51 · 生而不有",
    paragraphs: [
      "«Los da a luz y los cría; los hace crecer sin poseerlos; obra sin apoyarse en ello; los guía sin dominarlos.»",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// LAS OCHO POSTURAS · Ba Duan Jin (八段錦), los Ocho Brocados
// El orden importa: se hacen del uno al ocho, seguidos, y el ocho cierra.
// ─────────────────────────────────────────────────────────────────────────
export interface Postura {
  /** Clave estable de React (la ilustración va por posición, no por esta clave). */
  key: string;
  /** Nombre en castellano. */
  nombre: string;
  /** El verso chino original (así se nombran los brocados). */
  hanzi: string;
  pinyin: string;
  /** Órgano o sistema al que va dirigida. */
  organo: string;
  /** Elemento con el que se corresponde (colorea la tarjeta). */
  elemento: Elemento;
  /** Para qué sirve, en una línea. */
  para: string;
  /** Cómo se hace. Tres pasos, no más. */
  pasos: string[];
  /** Cuántas veces. */
  repeticiones: string;
  /** El detalle que lo cambia todo (o el aviso). */
  clave: string;
}

export const BROCADOS: Postura[] = [
  {
    key: "brocado-1-sostener-cielo",
    nombre: "Sostener el cielo con las manos",
    hanzi: "雙手托天理三焦",
    pinyin: "shuāng shǒu tuō tiān lǐ sān jiāo",
    organo: "Triple Calentador (San Jiao)",
    elemento: "fuego",
    para: "Abrir de arriba abajo y poner en marcha el eje que comunica pecho, abdomen y bajo vientre.",
    pasos: [
      "De pie, pies al ancho de las caderas. Entrelaza los dedos delante del vientre, palmas hacia arriba.",
      "Sube las manos por la línea media hasta el pecho, gíralas y empújalas hacia el cielo mientras inspiras. Estira sin despegar los talones.",
      "Suelta los dedos y baja los brazos por los lados, como si acariciaras el aire, mientras espiras.",
    ],
    repeticiones: "6 a 8 veces",
    clave: "El estiramiento es largo, no brusco: sube el pecho y baja el coxis a la vez, o la lumbar se lleva el esfuerzo.",
  },
  {
    key: "brocado-2-tensar-arco",
    nombre: "Tensar el arco a un lado y al otro",
    hanzi: "左右開弓似射鵰",
    pinyin: "zuǒ yòu kāi gōng sì shè diāo",
    organo: "Pulmón y cintura",
    elemento: "metal",
    para: "Abrir el pecho y ensanchar la respiración; despierta la fuerza de la cintura.",
    pasos: [
      "Abre las piernas algo más del ancho de los hombros y flexiona las rodillas, como si te sentaras en un taburete alto.",
      "Cruza los brazos delante del pecho. Estira uno al lado con el índice y el pulgar abiertos (la flecha) y tira del otro con el puño cerrado (la cuerda), mirando al horizonte.",
      "Vuelve al centro espirando y repite hacia el otro lado.",
    ],
    repeticiones: "6 a 8 veces por lado",
    clave: "La mirada va con la flecha, y el pecho se abre de verdad: es la postura que más agradece quien respira corto.",
  },
  {
    key: "brocado-3-separar-cielo-tierra",
    nombre: "Separar el cielo y la tierra",
    hanzi: "調理脾胃須單舉",
    pinyin: "tiáo lǐ pí wèi xū dān jǔ",
    organo: "Bazo y estómago",
    elemento: "tierra",
    para: "Armonizar el centro: la postura de la digestión pesada y de las comidas que no bajan.",
    pasos: [
      "De pie, con las manos delante del vientre, palmas enfrentadas como si sostuvieras una bola.",
      "Sube una mano hacia el cielo con la palma hacia arriba y los dedos hacia dentro, y empuja la otra hacia el suelo con la palma hacia abajo. Inspira al abrir.",
      "Vuelve al centro espirando y cambia de mano.",
    ],
    repeticiones: "6 a 8 veces alternando",
    clave: "El estiramiento cruza el costado en diagonal: ahí es donde se abre el paso al bazo y al estómago.",
  },
  {
    key: "brocado-4-mirar-atras",
    nombre: "Mirar atrás por encima del hombro",
    hanzi: "五勞七傷往後瞧",
    pinyin: "wǔ láo qī shāng wǎng hòu qiáo",
    organo: "Corazón, cuello y ojos",
    elemento: "fuego",
    para: "Deshacer «las cinco fatigas y los siete daños»: el cansancio viejo del cuello, la vista y el ánimo.",
    pasos: [
      "De pie, brazos sueltos a los lados, palmas hacia atrás.",
      "Inspirando, gira la cabeza y el torso para mirar por encima de un hombro, girando también las palmas hacia fuera. El giro nace del pecho, no del cuello.",
      "Vuelve al centro espirando y repite hacia el otro lado.",
    ],
    repeticiones: "6 veces por lado",
    clave: "Gira solo hasta donde llegues sin tirón. La mirada llega un poco más lejos que el cuello, y ahí está media postura.",
  },
  {
    key: "brocado-5-cabeza-y-cadera",
    nombre: "Balancear la cabeza y la cadera",
    hanzi: "搖頭擺尾去心火",
    pinyin: "yáo tóu bǎi wěi qù xīn huǒ",
    organo: "Corazón (y riñón)",
    elemento: "fuego",
    para: "Bajar el fuego del corazón: cabeza caliente, mente acelerada, insomnio, cara roja.",
    pasos: [
      "Piernas separadas y rodillas flexionadas, manos apoyadas en los muslos con los codos hacia fuera.",
      "Inclina el tronco hacia un lado y dibuja un arco lento con la cabeza hacia delante y hacia el otro lado, mientras la cadera va al contrario.",
      "Vuelve al centro y repite hacia el otro lado, despacio, sin marear.",
    ],
    repeticiones: "6 veces por lado",
    clave: "El movimiento es lento y ancho. Si te mareas, hazlo con recorrido corto: el efecto está en la lentitud, no en la amplitud.",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// LOS CINCO ANIMALES · Wu Qin Xi (五禽戲), la serie de Hua Tuo
// Un animal por elemento: la puerta más directa entre el qigong y tu mapa.
// ─────────────────────────────────────────────────────────────────────────
export interface Animal {
  key: string;
  animal: string;
  hanzi: string;
  elemento: Elemento;
  organo: string;
  texto: string;
}

export const CINCO_ANIMALES: Animal[] = [
  {
    key: "tigre",
    animal: "El tigre",
    hanzi: "虎",
    elemento: "madera",
    organo: "Hígado",
    texto: "Zarpazo lento y mirada fija. Fuerza que sale de los tendones y de la cintura: mueve el Qi estancado y da salida a la frustración.",
  },
  {
    key: "ciervo",
    animal: "El ciervo",
    hanzi: "鹿",
    elemento: "agua",
    organo: "Riñón",
    texto: "Cuello largo y cadera suelta, girando como quien mira atrás sin miedo. Abre las lumbares y calienta la reserva.",
  },
  {
    key: "oso",
    animal: "El oso",
    hanzi: "熊",
    elemento: "tierra",
    organo: "Bazo y estómago",
    texto: "Peso que rueda de un pie al otro desde el vientre. Amasa el centro por dentro: es un masaje digestivo hecho con el propio cuerpo.",
  },
  {
    key: "mono",
    animal: "El mono",
    hanzi: "猴",
    elemento: "fuego",
    organo: "Corazón",
    texto: "Ligereza, sorpresa, cambios rápidos de mirada. Despierta la alegría y saca a la mente de la rumia.",
  },
  {
    key: "grulla",
    animal: "La grulla",
    hanzi: "鶴",
    elemento: "metal",
    organo: "Pulmón",
    texto: "Alas que se abren muy despacio y equilibrio sobre una pierna. Ensancha el pecho y alarga la respiración.",
  },
];

/**
 * Ilustración de cada postura: CUADRADA (1:1) y en WebP, numerada por su
 * POSICIÓN en la serie, tal y como llegan: `/public/recorrido/tcm/qigong/1.webp`
 * … `8.webp` (los cómics viven en sus subcarpetas `historia/` y `daoyin/`).
 *
 * O sea: el ORDEN de `BROCADOS` manda. Si reordenas la serie, cambias también
 * la ilustración. Mientras un número no exista, esa tarjeta se queda solo con el
 * texto: ni hueco ni foto rota.
 */
export const FOTO_POSTURA = (indice: number) => `/recorrido/tcm/qigong/${indice + 1}.webp`;

/** Nota al pie. */
export const QIGONG_NOTA =
  "El qigong es una práctica de salud, no un tratamiento: acompaña, no sustituye. Si estás embarazada, tienes hipertensión no controlada, una hernia, vértigos o una lesión reciente, adapta las posturas con alguien que sepa antes de hacerlas por tu cuenta.";
