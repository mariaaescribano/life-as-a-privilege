import type { Vineta } from "./ComicViewer";
import { NUTRICION_CICLOS } from "./comicNutricionCiclos";

// ─────────────────────────────────────────────────────────────────────────
// «¿De dónde vienen los nutrientes?» — último paso del recorrido de NUTRICIÓN
// (/metodo/nutricion/origen). Todo el recorrido cuenta qué le pasa a la comida
// DENTRO de ti; este paso cuenta el viaje de ANTES: de la roca al suelo, del
// suelo a la raíz, de la raíz a la hoja y de la hoja al fruto que te comes.
//
// Son seis cómics: los cinco primeros van en orden de zoom (del planeta a la
// molécula de color) y el sexto abre la otra rama, la de los alimentos que
// pasaron antes por un animal:
//   1. Los grandes ciclos de la naturaleza  (comicNutricionCiclos.ts)
//   2. La tierra y la raíz
//   3. Una planta por dentro
//   4. Una hoja por dentro
//   5. La fruta, la verdura y sus colores
//   6. Cuando el nutriente pasa por un animal
//
// Los dos primeros se cuentan largos —son los que abren el viaje—; los cuatro
// últimos van en cuatro viñetas cada uno, que es lo que pide su historia.
//
// Imágenes: una carpeta por lectura dentro de /viñetas/nutricion/biologia/, con
// sus viñetas numeradas y la portada de la tarjeta sin número:
//   /viñetas/nutricion/biologia/<key>/<key><n>.webp  →  viñeta n
//   /viñetas/nutricion/biologia/<key>/<key>.webp     →  portada
// ─────────────────────────────────────────────────────────────────────────

const BIO = "/viñetas/nutricion/biologia";
const src = (key: string, i: number) => `${BIO}/${key}/${key}${i}.webp`;
/** Portada de la tarjeta: el archivo sin número de la carpeta de la lectura. */
const portada = (key: string) => `${BIO}/${key}/${key}.webp`;

// ── 2. La tierra y la raíz ───────────────────────────────────────────────
export const NUTRICION_TIERRA: Vineta[] = [
  {
    src: src("tierra", 1),
    titulo: "Todo empieza en una piedra",
    paragraphs: [
      "El calcio de tus huesos, el hierro de tu sangre, el magnesio que enciende tus enzimas… ninguno de esos átomos los fabrica nadie. No hay ningún ser vivo capaz de crear un átomo de hierro.",
      "Solo existe un almacén: la roca. Todos los minerales que hay hoy en tu cuerpo estuvieron algún día dentro de una piedra.",
      "Así que la primera pregunta de la nutrición no es qué comer. Es cómo sale un átomo de una roca y acaba dentro de una célula tuya.",
    ],
  },
  {
    src: src("tierra", 2),
    titulo: "El suelo está vivo",
    paragraphs: [
      "Lo que llamamos tierra no es polvo muerto. Es una mezcla de granitos de roca, agua, aire, restos de lo que estuvo vivo… y una cantidad de seres vivos difícil de imaginar.",
      "En un solo puñado de suelo sano hay más microorganismos que personas en el planeta entero.",
      "Ellos hacen el trabajo lento: las raíces y los líquidos que sueltan van desgastando la roca, y las bacterias y los hongos deshacen la hojarasca y todo lo que muere hasta devolverlo a piezas sueltas. El suelo es, literalmente, una digestión que ocurre bajo tus pies.",
    ],
  },
  {
    src: src("tierra", 3),
    titulo: "La planta no come tierra: bebe",
    paragraphs: [
      "Una raíz no puede tragar un grano de arena. Solo puede absorber lo que está disuelto en el agua del suelo y con carga eléctrica: iones.",
      "El nitrógeno entra como nitrato o amonio, el fósforo como fosfato, y el potasio, el calcio, el magnesio o el hierro como iones sueltos. Nada más.",
      "Aquí reaparece el agua con sus dos polos, la misma que ya viste: rodea a los iones, los arranca de la roca y los mantiene flotando. Sin agua, los minerales del suelo son inalcanzables aunque estén ahí.",
    ],
  },
  {
    src: src("tierra", 4),
    titulo: "Absorber cuesta energía",
    paragraphs: [
      "La punta de cada raíz está cubierta de pelillos finísimos. No son adorno: multiplican la superficie de contacto con el agua del suelo, igual que las vellosidades de tu intestino multiplican la tuya. La misma solución al mismo problema.",
      "Y hay algo más sorprendente. En el suelo casi siempre hay MENOS minerales que dentro de la raíz, así que entrar es ir contracorriente. La planta gasta ATP en bombear protones hacia fuera y crear un desnivel eléctrico que le sirve para arrastrar los iones hacia dentro.",
      "Absorber nunca es gratis. Ni para una raíz ni para ti.",
    ],
  },
  {
    src: src("tierra", 5),
    titulo: "La planta también tiene microbiota",
    paragraphs: [
      "Casi todas las plantas del mundo hacen un trato con hongos del suelo. El hongo entra en la raíz y extiende sus hilos muchísimo más lejos de lo que la raíz podría llegar: es una red que le multiplica el alcance.",
      "El hongo le entrega agua, fósforo y otros minerales difíciles de conseguir. La planta le paga con azúcar recién fabricado en las hojas. Ninguno de los dos podría vivir así de bien por separado.",
      "Y las legumbres van un paso más allá: alojan bacterias en unos bultitos de sus raíces que saben partir el nitrógeno del aire, algo que la planta no puede hacer sola. Por eso las legumbres son tan ricas en proteína y dejan la tierra mejor de lo que la encontraron.",
      "La planta depende de sus microbios para nutrirse. Exactamente igual que tú.",
    ],
  },
  {
    src: src("tierra", 6),
    titulo: "Por eso el suelo se nota en el plato",
    paragraphs: [
      "Un suelo vivo, con materia orgánica y con sus hongos y bacterias, entrega minerales; un suelo agotado y compacto entrega menos, y lo que crece encima viene más pobre.",
      "La planta no puede poner en la fruta lo que no encontró abajo. Y tú no puedes absorber lo que la planta no llegó a guardar.",
      "El hierro que ahora mismo transporta el oxígeno por tu sangre pasó por una roca, por el agua del suelo, por un hongo y por una raíz antes de llegar a ti. Toda la cadena tenía que funcionar.",
    ],
  },
];

// ── 3. Una planta por dentro ─────────────────────────────────────────────
export const NUTRICION_PLANTA: Vineta[] = [
  {
    src: src("planta", 1),
    titulo: "Un ser vivo partido en dos mundos",
    paragraphs: [
      "Una planta tiene un problema que tú no tienes: lo que necesita está en dos sitios opuestos y no puede moverse para ir a buscarlo.",
      "Abajo, en la oscuridad, están el agua y los minerales. Arriba, la luz y el aire. Y hay que juntarlo todo en el mismo sitio para poder fabricar comida.",
      "Todo lo que ves en una planta —raíz, tallo, hojas— es la solución a ese problema. No hay ni una pieza decorativa.",
    ],
  },
  {
    src: src("planta", 2),
    titulo: "Dos tuberías que van al revés",
    paragraphs: [
      "Por dentro, una planta está atravesada de arriba abajo por dos conducciones pegadas la una a la otra. El xilema sube el agua y los minerales desde la raíz hasta la última hoja: son tubos huecos, células que se vaciaron y murieron para dejar el paso libre. La madera es xilema.",
      "El floema baja y reparte el azúcar recién fabricado en las hojas hacia donde haga falta —una raíz que crece, una flor, un fruto que se está llenando—. Este sí está hecho de células vivas. Cuando le das un mordisco al tallo de una acelga, estás masticando esas tuberías.",
      "Y un árbol levanta agua decenas de metros todos los días sin tener corazón ni bomba. No empuja desde abajo: tira desde arriba. La hoja pierde agua por evaporación, y como las moléculas de agua se agarran unas a otras por sus polos, al escaparse una arrastra a la de detrás.",
      "El resultado es un hilo de agua continuo desde la hoja hasta el pelillo de la raíz. La planta no bombea: la mueve el Sol.",
    ],
  },
  {
    src: src("planta", 3),
    titulo: "La célula vegetal, por dentro",
    paragraphs: [
      "Tus células tienen una frontera blanda de grasa. Las de las plantas tienen eso… y por fuera una pared rígida de celulosa. Esa pared es la fibra que tú no puedes digerir: es lo que da estructura a un tallo y lo que llega intacto a tu intestino grueso para alimentar a tu microbiota.",
      "Dentro, la mayor parte del espacio lo ocupa una bolsa enorme de agua, la vacuola. Llena, empuja contra la pared y la célula queda firme; vacía, la célula se arruga. Eso es exactamente una lechuga: crujiente o lacia. La frescura de una verdura no es una metáfora, es presión de agua.",
      "Y en las células de las partes verdes hay además cloroplastos: las fábricas donde ocurre la fotosíntesis.",
    ],
  },
  {
    src: src("planta", 4),
    titulo: "Cada parte guarda una cosa distinta",
    paragraphs: [
      "La planta fabrica azúcar en las hojas, pero no lo deja ahí: lo manda a guardar. Y según dónde lo guarde, aparece un alimento distinto.",
      "En raíces y tubérculos hace despensa de almidón para el invierno o para brotar —zanahoria, remolacha, patata, boniato—, y por eso son más dulces y más densas. En las semillas guarda lo más valioso, porque ahí va la siguiente generación: proteína, grasa y minerales. En hojas y tallos apenas hay reserva: agua, fibra, vitaminas y minerales, mucho volumen y muy pocas calorías.",
      "Por eso una patata y una espinaca no se parecen en nada, aunque las dos sean plantas: no estás comiendo la misma parte de la historia.",
      "Y mires donde mires —una lenteja, un aguacate, un grano de trigo—, siempre es la misma arquitectura. Tampoco hay atajo con la carne, el huevo o la leche, porque el animal comió planta. Toda la comida del mundo pasa primero por aquí.",
    ],
  },
];

// ── 4. Una hoja por dentro ───────────────────────────────────────────────
export const NUTRICION_HOJA: Vineta[] = [
  {
    src: src("hoja", 1),
    titulo: "La fábrica",
    paragraphs: [
      "Si la planta es la casa, la hoja es la fábrica. Y su forma lo delata: plana para que la luz caiga sobre la mayor superficie posible, y finísima para que la luz atraviese todas sus capas y el aire pueda entrar y salir sin tardar.",
      "Por fuera lleva una capa de cera impermeable —lo que hace que el agua resbale en una hoja de col— y debajo una piel de células transparentes que deja pasar la luz sin usarla. En el medio está la capa que trabaja: células altas y apretadas como columnas, atiborradas de cloroplastos. Más abajo, huecos de aire por donde circulan los gases. Y atravesándolo todo, los nervios: el xilema y el floema.",
      "Cada hoja es a la vez un panel solar, un pulmón y una cocina. Y de lo que ocurre aquí dentro sale, sin excepción, toda la comida del planeta.",
    ],
  },
  {
    src: src("hoja", 2),
    titulo: "El dilema de las bocas",
    paragraphs: [
      "En la cara de abajo de la hoja hay miles de boquitas diminutas, cada una formada por dos células que pueden hincharse para abrirse o vaciarse para cerrarse. Se llaman estomas.",
      "Y tienen un dilema imposible. Si se abren, entra el dióxido de carbono que hace falta para fabricar comida… pero se escapa el agua. Si se cierran, se ahorra el agua… pero se corta la materia prima.",
      "La hoja se pasa el día decidiendo eso. Con calor fuerte cierra los estomas para no deshidratarse, y mientras están cerrados casi deja de crecer: no puede comer y beber a la vez.",
      "Es la misma clase de equilibrio que negocia tu cuerpo a cada rato. Nadie tiene todas las condiciones a la vez.",
    ],
  },
  {
    src: src("hoja", 3),
    titulo: "El verde que ves es la luz que sobra",
    paragraphs: [
      "Dentro de las células de la hoja hay unos sacos verdes, los cloroplastos, llenos de clorofila, la molécula que atrapa la luz. Absorbe muy bien la roja y la azul, y en cambio rebota la verde: el verde que tú ves es, exactamente, la parte de la luz que la hoja NO quiso quedarse.",
      "Con la energía que sí atrapa hace algo brutal: rompe moléculas de agua para robarles los electrones y el hidrógeno.",
      "Y al partir el agua sobra oxígeno, que la hoja suelta al aire porque no lo necesita. El oxígeno que respiras ahora mismo es el desecho de una hoja.",
    ],
  },
  {
    src: src("hoja", 4),
    titulo: "El instante en que nace la comida",
    paragraphs: [
      "Ahora la hoja tiene energía de la luz e hidrógeno del agua. Le falta el esqueleto: el carbono. Y lo coge del aire, del dióxido de carbono que entró por los estomas.",
      "Con esas tres cosas —aire, agua y luz— monta una molécula de glucosa. Ahí, en ese punto exacto, es donde una piedra, un charco y un rayo de sol se convierten en comida. Es la única puerta de entrada: toda la energía y todo el carbono que circulan por el mundo vivo entraron por aquí.",
      "Después la planta encadena esas glucosas y hace almidón para guardar y celulosa para sostenerse, y con los minerales que subieron por el xilema fabrica aminoácidos, grasas y vitaminas. El pan, el aceite, la fruta, la lenteja. Y también el filete, el queso y el huevo, porque el animal comió planta.",
      "La glucosa que tienes ahora mismo en la sangre era dióxido de carbono flotando en el aire hace unos meses. La hoja es la puerta por la que la Vida entra en el mundo, y tú estás al otro lado de esa puerta.",
    ],
  },
];

// ── 5. La fruta, la verdura y sus colores ────────────────────────────────
export const NUTRICION_FRUTA: Vineta[] = [
  {
    src: src("fruta", 1),
    titulo: "Una flor es una promesa",
    paragraphs: [
      "Todo fruto empieza siendo una flor. Llega el polen, se une al óvulo y ahí nace una semilla: una planta nueva, entera, en miniatura. Y entonces la planta empieza a construir una caja alrededor: paredes, agua, azúcar, color, olor.",
      "Esa caja es el fruto. Y aquí está lo que casi nunca se cuenta: el fruto no se hizo para ti. Se hizo para la semilla.",
      "Por eso, mientras la semilla se forma, el fruto es verde, duro, ácido y a veces amargo o incluso tóxico. No es un fallo: si alguien se lo comiera ahora, la semilla no serviría para nada. Así que se camufla entre las hojas y se hace desagradable a propósito. Es un cartel de «todavía no».",
    ],
  },
  {
    src: src("fruta", 2),
    titulo: "Madurar es una orden química",
    paragraphs: [
      "Cuando la semilla ya está lista, el fruto lanza una señal: un gas llamado etileno. Y ese gas cambia el cartel entero de golpe.",
      "El almidón guardado se rompe en azúcares y aparece el dulce. Los ácidos bajan. Unas enzimas deshacen el pegamento que unía las paredes de sus células y el fruto se ablanda. Se fabrican decenas de moléculas olorosas. Y el color cambia.",
      "Todo eso junto es un anuncio: «cómeme, llévate la semilla lejos y déjala en otro sitio». El sabor que tanto te gusta es una estrategia de reparto a domicilio.",
      "Y como el etileno es un gas, se contagia: por eso un plátano maduro acelera a toda la frutera, y por eso la nevera frena la maduración.",
    ],
  },
  {
    src: src("fruta", 3),
    titulo: "Los colores son moléculas con oficio",
    paragraphs: [
      "El verde es la clorofila. Al madurar se destruye, y entonces se ve lo que ya estaba debajo, escondido.",
      "El naranja y el amarillo son carotenoides: de uno de ellos tu cuerpo fabrica vitamina A y otros dos se acumulan justo en tu retina; el rojo del tomate es otro de la familia. El rojo, el morado y el azul son antocianinas, la pantalla solar de la planta, y cambian de tono según la acidez: por eso la lombarda se vuelve de otro color si la cueces con limón. El blanco del ajo y de la cebolla esconde compuestos de azufre, y el verde fuerte de la col y el brócoli, otros que amargan un poco.",
      "Ninguno de esos colores se inventó pensando en tu salud. Son escudos contra el sol, avisos para los animales, venenos suaves contra los insectos. Pero llevamos millones de años comiéndolos y nuestras células han aprendido a aprovecharlos, como ya viste con los fitoquímicos.",
      "No somos los destinatarios. Somos los que aprendimos a leer el mensaje.",
    ],
  },
  {
    src: src("fruta", 4),
    titulo: "Por eso se dice «come de muchos colores»",
    paragraphs: [
      "Ahora esa frase deja de ser un consejo bonito. Cada color es una familia distinta de moléculas, con un trabajo distinto, y ninguna hace el trabajo de la otra. Un plato de un solo color es una biblioteca con un solo libro.",
      "Y también entiendes por qué importa cuándo se recoge. Un fruto arrancado verde para que aguante el viaje puede ponerse rojo y blando por fuera, porque el etileno hace su parte, pero ya está desconectado de la planta: nadie le sigue mandando azúcar. Madurar en la rama y madurar en un camión no es lo mismo, aunque por fuera se parezcan.",
      "Lo que comes es el final de un viaje larguísimo: una roca, un hongo, una raíz, una tubería, una hoja, una flor y una promesa. Y ahora ese viaje sigue dentro de ti.",
    ],
  },
];

// ── 6. Cuando el nutriente pasa por un animal ────────────────────────────
export const NUTRICION_ANIMAL: Vineta[] = [
  {
    src: src("animal", 1),
    titulo: "Falta una rama del viaje",
    paragraphs: [
      "Hasta aquí todo salía de una planta. Pero en tu plato hay cosas que no son plantas: un huevo, un filete, un queso, una sardina. Y ninguno de esos animales ha fabricado nada de cero: comieron plantas, o se comieron a alguien que comió plantas. Siempre.",
      "Un animal se pasa la vida gastando: se mueve, se mantiene caliente, respira, se repara. Casi toda la energía que come la quema en vivir, y solo una parte pequeña queda guardada en su cuerpo. Por eso hace falta mucha planta para producir poca carne: cada escalón de la cadena pierde la mayor parte de lo que recibió.",
      "Es la misma razón por la que en el mundo hay muchísima más hierba que vacas, y muchas más vacas que leones.",
    ],
  },
  {
    src: src("animal", 2),
    titulo: "Pero el animal también hace trabajo",
    paragraphs: [
      "Si solo perdiera, no tendría sentido comerlo. Lo que pasa es que además transforma y concentra.",
      "Ordena los aminoácidos en una proporción muy parecida a la que necesitas tú, y de ahí viene eso de «proteína completa». Guarda el hierro dentro de una molécula que tu intestino absorbe mucho mejor que el de las plantas. Acumula vitaminas en su hígado y en su grasa. Y alarga las grasas cortas del vegetal hasta las largas que usa tu cerebro. Comer animal es, en parte, aprovechar un trabajo ya hecho.",
      "Y hay una vitamina que rompe el esquema: la B12. No la fabrica ninguna planta… pero tampoco ningún animal. La fabrican bacterias: el animal las lleva en su tubo digestivo o las traga con la tierra, y va guardando la vitamina en su hígado y en su músculo. Nosotros la sacamos de ahí.",
      "Por eso es la única que una alimentación totalmente vegetal necesita tomar aparte. No es un defecto de las plantas: ese trabajo lo hacen microbios y hay que ir a buscarlo donde esté. Otra vez lo mismo que viste con tu microbiota y con las raíces.",
    ],
  },
  {
    src: src("animal", 3),
    titulo: "En el mar pasa igual, pero empieza en un alga",
    paragraphs: [
      "El mar no tiene hojas, y aun así tiene la misma historia. Ahí abajo hay algas microscópicas flotando que hacen fotosíntesis exactamente igual: son las hojas invisibles del planeta, y producen buena parte del oxígeno que respiras.",
      "Ellas son las que fabrican los omega-3 largos. El pez pequeño se las come, el pez grande se come al pequeño, y con cada mordisco se van acumulando. Así que el salmón no inventa su omega-3: lo heredó de un alga.",
      "Y por el mismo camino se concentra lo que no queremos: el mercurio también sube de eslabón en eslabón, y por eso se acumula en los peces grandes y viejos y no en los pequeños.",
    ],
  },
  {
    src: src("animal", 4),
    titulo: "El animal solo puede darte lo que comió",
    paragraphs: [
      "Un huevo de gallina que ha picoteado hierba y bichos no lleva la misma grasa que uno de gallina alimentada solo con grano. La leche de un animal de pasto tampoco es igual que la de uno de pienso.",
      "No es magia ni marketing: el animal no puede poner en su carne, en su huevo o en su leche algo que no le llegó por la boca. Lo que él comió termina llegándote a ti a través de él.",
      "Y con esto se cierra el viaje entero. Los ciclos del planeta, la roca, el suelo, la raíz, las tuberías, la hoja, la flor y el fruto… y a veces un eslabón más, un animal que lo llevó puesto antes que tú.",
      "Nada de lo que eres se ha inventado de cero. Todo estaba ya aquí, dando vueltas, y ahora te toca a ti.",
    ],
  },
];

// ── Las lecturas del paso, en orden ──────────────────────────────────────
export interface LecturaOrigen {
  /** Clave estable: es la que se guarda como «leída» y la del id de galería. */
  key: string;
  titulo: string;
  /** Frase corta bajo el título en la tarjeta del paso. */
  resumen: string;
  /** Portada de la tarjeta (una de sus viñetas). */
  cover: string;
  /** Emoji de reserva mientras no exista la portada. */
  emoji: string;
  vinetas: Vineta[];
}

export const ORIGEN_NUTRIENTES: LecturaOrigen[] = [
  {
    key: "ciclos",
    titulo: "Los grandes ciclos de la naturaleza",
    resumen: "El agua, el carbono, el oxígeno, el nitrógeno y el fósforo dando vueltas: tus átomos son prestados.",
    cover: "/viñetas/nutricion/biologia/ciclos/carbono.webp",
    emoji: "🌍",
    vinetas: NUTRICION_CICLOS,
  },
  {
    key: "tierra",
    titulo: "La tierra y la raíz",
    resumen: "Cómo sale un mineral de una roca, se disuelve en el suelo y entra en una planta.",
    cover: portada("tierra"),
    emoji: "🌱",
    vinetas: NUTRICION_TIERRA,
  },
  {
    key: "planta",
    titulo: "Una planta por dentro",
    resumen: "Dos tuberías, una pared de fibra y una despensa. Y sube el agua sin tener corazón.",
    cover: portada("planta"),
    emoji: "🌿",
    vinetas: NUTRICION_PLANTA,
  },
  {
    key: "hoja",
    titulo: "Una hoja por dentro",
    resumen: "La fábrica: aire, agua y luz entran; salen comida y el oxígeno que respiras.",
    cover: portada("hoja"),
    emoji: "🍃",
    vinetas: NUTRICION_HOJA,
  },
  {
    key: "fruta",
    titulo: "La fruta, la verdura y sus colores",
    resumen: "De la flor al fruto, la orden de madurar y qué hace cada color.",
    cover: portada("fruta"),
    emoji: "🍓",
    vinetas: NUTRICION_FRUTA,
  },
  {
    key: "animal",
    titulo: "Cuando el nutriente pasa por un animal",
    resumen: "La otra rama: la cadena, lo que el animal concentra, la B12 y el omega-3 que era de un alga.",
    cover: portada("animal"),
    emoji: "🥚",
    vinetas: NUTRICION_ANIMAL,
  },
];

/** Campo de `metodo_nutricion.data` donde se guardan las lecturas ya leídas. */
export const ORIGEN_LEIDOS_KEY = "origen_leidos";
