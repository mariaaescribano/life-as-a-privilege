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

/** Intro de la página (bajo el header). */
export const QIGONG_INTRO: string[] = [
  "El Qi (氣) es la energía que circula por ti. Gong (功) es el trabajo constante, el oficio que solo se gana con horas. Qigong es exactamente eso: el trabajo de la energía, hecho con las manos y con la respiración.",
  "No es gimnasia y no es religión. Es la única rama de la Medicina China que no puede hacerte nadie: ni un acupuntor, ni una planta, ni un plato. Esta la haces tú, de pie, diez minutos.",
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
    texto: "La postura: pies al ancho de las caderas, rodillas blandas, coxis hacia abajo, coronilla hacia arriba, hombros sueltos. Antes de mover nada, colócate.",
  },
  {
    key: "respiracion",
    hanzi: "調息",
    pinyin: "tiáo xī",
    titulo: "Regular la respiración",
    texto: "Por la nariz, al vientre, lenta y silenciosa. No la fuerces: acompáñala hasta que sea larga sola. La respiración es el puente entre lo que puedes mandar y lo que no.",
  },
  {
    key: "mente",
    hanzi: "調心",
    pinyin: "tiáo xīn",
    titulo: "Regular la mente",
    texto: "La atención dentro del movimiento, no en la lista de la compra. Cuando las tres se funden y dejas de vigilarlas, eso es la práctica de verdad (三調合一).",
  },
];

/** Qué es (y qué no es) el qigong. */
export const QIGONG_QUE_ES: string[] = [
  "En China no es una disciplina alternativa ni una moda: es la cuarta rama de su medicina, junto con la acupuntura, la farmacopea y la dietética. Se enseña en los hospitales y se practica en los parques a las siete de la mañana, con la misma naturalidad con la que aquí se saca al perro.",
  "El movimiento es lento a propósito. La lentitud te obliga a sostener, y sostener es lo que mueve el Qi: si vas deprisa, la inercia hace el trabajo por ti y no entrenas nada. Por eso una serie de ocho posturas puede dejarte más caliente que una carrera.",
  "Y no busca fuerza, busca circulación. En Medicina China casi ningún síntoma viene de que falte energía: viene de que la energía no llega. El qigong no te añade nada; te desatasca.",
];

// ─────────────────────────────────────────────────────────────────────────
// DE DÓNDE VIENE · los hitos, en orden
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

// ─────────────────────────────────────────────────────────────────────────
// DAO YIN · y el rostro femenino del Dao
// ─────────────────────────────────────────────────────────────────────────
export const DAO_YIN = {
  hanzi: "導引",
  pinyin: "dǎo yǐn",
  parrafos: [
    "Antes de que existiera la palabra «qigong», esto se llamaba Dao Yin. 導 dǎo es guiar, conducir. 引 yǐn es tirar, estirar, atraer hacia ti. Guiar el Qi y estirar el cuerpo: el nombre describe exactamente lo que haces mientras lo haces.",
    "Es el nombre que está escrito en la tela de Mawangdui, junto a cada una de aquellas 44 figuras. Dos mil años después seguimos haciendo lo mismo con otro nombre.",
    "Y aquí hay que decir una cosa con cariño: el 引 de «estirar» no es el 陰 yīn de lo femenino. Son dos caracteres distintos y dos palabras distintas. Pero la intuición no va desencaminada, porque lo femenino no está en el nombre: está en el centro mismo de todo el taoísmo.",
  ],
  /** Lo femenino del Dao, con las fuentes en la mano. */
  femenino: [
    "Cuando Lao-Tse tiene que decir qué es el Dao, no le sale una figura de padre ni de rey. Le sale una madre, un valle, un útero, una hondonada: lo que recibe, lo que sostiene, lo que da vida sin quedarse con nada.",
    "El Dao no manda: nutre. No conquista: cede y por eso vence. No hace: deja que ocurra. Ese es el fondo yin de esta medicina entera, y también el fondo de esta práctica: en el qigong no se fuerza nada. Se abre, se sostiene y se deja pasar.",
  ],
  citas: [
    {
      texto: "«El espíritu del valle no muere. Se le llama la hembra misteriosa. La puerta de la hembra misteriosa es la raíz del cielo y de la tierra.»",
      fuente: "Tao Te King, cap. 6 · 谷神不死，是謂玄牝",
    },
    {
      texto: "«Hay algo que se formó antes que el cielo y la tierra. Silencioso, vacío, solo e inmutable. Podría ser la madre del mundo. No sé su nombre; lo llamo Dao.»",
      fuente: "Tao Te King, cap. 25 · 可以為天下母",
    },
    {
      texto: "«Conoce lo masculino, mantente en lo femenino, y serás el cauce del mundo.»",
      fuente: "Tao Te King, cap. 28 · 知其雄，守其雌",
    },
    {
      texto: "«Los da a luz y los cría; los hace crecer sin poseerlos; obra sin apoyarse en ello; los guía sin dominarlos.»",
      fuente: "Tao Te King, cap. 51 · 生而不有",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// LAS OCHO POSTURAS · Ba Duan Jin (八段錦), los Ocho Brocados
// El orden importa: se hacen del uno al ocho, seguidos, y el ocho cierra.
// ─────────────────────────────────────────────────────────────────────────
export interface Postura {
  /** Clave estable. Es también el nombre de su foto: /recorrido/tcm/qigong/<key>.webp */
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
  {
    key: "brocado-6-tocar-los-pies",
    nombre: "Bajar por la espalda hasta los pies",
    hanzi: "兩手攀足固腎腰",
    pinyin: "liǎng shǒu pān zú gù shèn yāo",
    organo: "Riñón y zona lumbar",
    elemento: "agua",
    para: "Fortalecer lumbares y rodillas y calentar la reserva: la postura del cansancio de fondo.",
    pasos: [
      "De pie, sube los brazos por delante hasta el cielo e inspira.",
      "Lleva las manos a la lumbar y desciende por la espalda y las piernas, espirando, hasta donde llegues con las rodillas casi rectas pero no bloqueadas.",
      "Sube enrollando la columna vértebra a vértebra, con la cabeza la última.",
    ],
    repeticiones: "6 a 8 veces",
    clave: "No busques tocar el suelo: busca calor en las lumbares. Frota los riñones con las palmas al subir y notarás de qué va esto.",
  },
  {
    key: "brocado-7-punos-y-mirada",
    nombre: "Cerrar los puños con mirada de fuego",
    hanzi: "攢拳怒目增氣力",
    pinyin: "zǎn quán nù mù zēng qì lì",
    organo: "Hígado, tendones y ojos",
    elemento: "madera",
    para: "Sacar la fuerza y la rabia guardada: la postura de la frustración que no encuentra salida.",
    pasos: [
      "Postura de jinete: piernas abiertas, rodillas flexionadas, puños a la altura de la cintura con los nudillos hacia abajo.",
      "Lanza un puño hacia delante espirando, abre la mano, gírala y ciérrala como si agarraras algo, con los ojos muy abiertos.",
      "Recoge el puño a la cintura tirando con fuerza, e inspira. Repite con el otro brazo.",
    ],
    repeticiones: "6 a 8 veces por brazo",
    clave: "Es el único brocado con fuerza y con «mala cara» a propósito: la Madera necesita salir. Si te dan ganas de gruñir, gruñe.",
  },
  {
    key: "brocado-8-siete-rebotes",
    nombre: "Siete rebotes sobre los talones",
    hanzi: "背後七顛百病消",
    pinyin: "bèi hòu qī diān bǎi bìng xiāo",
    organo: "Columna y todo el cuerpo",
    elemento: "agua",
    para: "Cerrar la serie: asentar lo movido y sacudir lo que sobra. «Cien dolencias desaparecen.»",
    pasos: [
      "De pie, pies juntos, brazos sueltos, coronilla hacia arriba.",
      "Levanta los talones inspirando y quédate ahí un instante, alto y estirado.",
      "Déjalos caer de golpe espirando: una pequeña vibración recorre la columna hasta la cabeza.",
    ],
    repeticiones: "7 veces (ni una más, dice la tradición)",
    clave: "Termina con las palmas sobre el ombligo, un minuto en silencio: es donde se guarda lo que acabas de mover.",
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

/** Cómo practicar: las reglas de la casa. */
export const COMO_PRACTICAR: string[] = [
  "Mejor por la mañana temprano y, si puedes, al aire libre y mirando al este. Si no puedes, en el salón y a la hora que sea: la que se hace es la buena.",
  "Diez minutos cada día valen más que una hora el domingo. El Qi responde a la constancia, no a la intensidad.",
  "Respira siempre por la nariz, al vientre, y deja la punta de la lengua tocando el paladar: cierra el circuito y hace que salgan más saliva y más calma.",
  "Las rodillas nunca bloqueadas y nada debe doler. Si algo tira, reduce el recorrido: en qigong el rango pequeño y sostenido gana al grande y forzado.",
  "No practiques con el estómago muy lleno ni con hambre de verdad, ni justo después de una emoción fuerte: espera a que baje.",
  "Termina siempre igual: palmas sobre el ombligo (una encima de la otra), respirando, un minuto. Es el gesto de guardar lo que has movido.",
];

/**
 * Foto de cada postura: CUADRADA (1:1) y en WebP, en
 * `/public/recorrido/tcm/qigong/<key>.webp`. Mientras no exista, la tarjeta
 * enseña su carácter chino en grande: la página funciona igual, sin huecos ni
 * fotos rotas.
 */
export const FOTO_POSTURA = (key: string) => `/recorrido/tcm/qigong/${key}.webp`;

/** Nota al pie. */
export const QIGONG_NOTA =
  "El qigong es una práctica de salud, no un tratamiento: acompaña, no sustituye. Si estás embarazada, tienes hipertensión no controlada, una hernia, vértigos o una lesión reciente, adapta las posturas con alguien que sepa antes de hacerlas por tu cuenta.";
