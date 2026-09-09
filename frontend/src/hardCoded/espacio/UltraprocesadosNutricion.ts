import type { NutrienteTarjeta } from "./NutrientesNutricion";

// ── Página «Los ultraprocesados» del recorrido de Nutrición ──────────────────
// Va entre «El hambre» y el plato de Harvard: después de entender por qué no
// puedes parar de comer, esto es lo que estás comiendo.
//
// EL CRITERIO DE ESTA PÁGINA: no es una lista de venenos. Casi todo lo que hay
// aquí está autorizado a las dosis que se usan, y montarlo como «los tóxicos de
// la E» la dejaría en el mismo cajón que los mitos que se desmontan en el paso
// de «Preguntas y mitos». Por eso las tarjetas van AGRUPADAS POR LO SÓLIDO QUE
// ES EL DATO (el campo `grupo`), diciendo en cada una qué se sabe y qué no. Es
// lo que la hace creíble, y lo que ningún documental de sobremesa hace.
//
// Fotos: /recorrido/nutricion/ultraprocesados/<key>.webp — PENDIENTES de subir.
// Mientras no existan, la tarjeta enseña la inicial del título (FotoBox lo
// resuelve solo con su `onError`, no hay que tocar nada al ir subiéndolas).

// Clave en metodo_nutricion.data con las fichas ya leídas (string[] de keys).
export const ULTRAPROCESADOS_LEIDOS_KEY = "ultraprocesados_leidos";

const foto = (key: string) => `/recorrido/nutricion/ultraprocesados/${key}.webp`;

// Los tres niveles de certeza. Se citan desde la página para pintar el
// encabezado de cada bloque, y desde aquí como `grupo` de cada tarjeta.
export const NIVEL_SOLIDO = "Lo que sabemos con certeza";
export const NIVEL_EMERGENTE = "Lo que la ciencia está viendo ahora";
export const NIVEL_NO_ADITIVO = "Lo que no pone en la etiqueta";

export const ULTRAPROCESADOS: NutrienteTarjeta[] = [
  // ── Evidencia sólida ──────────────────────────────────────────────────────
  {
    key: "grasas-trans",
    titulo: "Grasas parcialmente hidrogenadas",
    grupo: NIVEL_SOLIDO,
    foto: foto("grasas-trans"),
    claves: [
      "Suben el colesterol malo y bajan el bueno a la vez",
      "La OMS pidió eliminarlas de la alimentación mundial",
      "En Europa están limitadas por ley desde 2021",
    ],
    parrafos: [
      "De todo lo que ha llegado a llevar un ultraprocesado, esto es lo más parecido a un tóxico de verdad. Se fabricaban inyectando hidrógeno a un aceite líquido para volverlo sólido y untable, y de paso hacerlo casi eterno en el estante.",
      "Lo que las hace únicas es que empeoran las dos caras del colesterol a la vez: suben el LDL y bajan el HDL. Ningún otro nutriente conocido hace eso. No hay una cantidad «segura» por debajo de la cual dejen de importar.",
      "Esta es también la mejor noticia de toda la página: se supo, se demostró y se actuó. La OMS pidió su eliminación mundial y la Unión Europea las limitó por ley en 2021. En la etiqueta aparecían como «grasa vegetal parcialmente hidrogenada»; si lo lees, suelta el paquete.",
    ],
  },
  {
    key: "nitritos",
    titulo: "Nitritos y nitratos (E249–E252)",
    grupo: NIVEL_SOLIDO,
    foto: foto("nitritos"),
    claves: [
      "Mantienen roja la carne procesada y frenan el botulismo",
      "Con el calor y la digestión pueden formar nitrosaminas",
      "La carne procesada es grupo 1 de la IARC",
    ],
    parrafos: [
      "Son los que mantienen rosado el jamón cocido, el bacon o las salchichas en vez de dejarlos girar a un gris pardo. No están ahí por capricho: también son la barrera contra el botulismo, que es una razón muy seria.",
      "El problema es que, con el calor fuerte y en el propio estómago, pueden transformarse en nitrosaminas, compuestos que sí dañan el ADN. Por eso la IARC clasificó la carne procesada en el grupo 1.",
      "Y aquí conviene un matiz que casi nadie hace, porque de él salen los titulares tramposos: el grupo 1 mide lo SEGUROS que estamos de que algo causa cáncer, no lo mucho que lo causa. El tabaco también está en el grupo 1, y no son comparables en magnitud. Lo que dice ese grupo es «esto ya no se discute», no «esto es igual de grave».",
    ],
  },
  {
    key: "colorantes-azoicos",
    titulo: "Colorantes azoicos (E102, E110, E122, E124, E129)",
    grupo: NIVEL_SOLIDO,
    foto: foto("colorantes-azoicos"),
    claves: [
      "Dan el amarillo, el rojo y el naranja de chuches y refrescos",
      "Se asociaron a hiperactividad infantil en el estudio de Southampton",
      "Llevan la advertencia impresa por ley en el envase",
    ],
    parrafos: [
      "Son el amarillo de las chuches, el rojo de los refrescos, el naranja de los aperitivos. La tartrazina (E102), el amarillo ocaso (E110), el azorrubina (E122), el rojo cochinilla (E124) y el rojo allura (E129).",
      "En 2007, un estudio de la Universidad de Southampton encontró que ciertas mezclas de estos colorantes con benzoato sódico aumentaban la hiperactividad y bajaban la atención en niños. No fue una observación de pasada: fue un ensayo con niños de la población general.",
      "Lo que pasó después es lo que hace de este el ejemplo más útil de toda la página. La Unión Europea no los prohibió, pero obligó a imprimir en el envase «puede afectar negativamente a la actividad y la atención de los niños». Esa frase está hoy, en letra pequeña, en productos que hay en cualquier supermercado. Búscala la próxima vez: es la única vez que un alimento te avisa de sí mismo.",
    ],
  },
  {
    key: "dioxido-titanio",
    titulo: "Dióxido de titanio (E171)",
    grupo: NIVEL_SOLIDO,
    foto: foto("dioxido-titanio"),
    claves: [
      "El blanco brillante de chicles, golosinas y salsas",
      "La EFSA dejó de considerarlo seguro en 2021",
      "Prohibido en alimentos en la UE desde 2022",
    ],
    parrafos: [
      "Es el blanco puro y brillante: el de los chicles, el recubrimiento de algunas golosinas, ciertas salsas y bollería. No aporta absolutamente nada de sabor ni de conservación. Está ahí para que el producto se vea más blanco.",
      "Se usó durante décadas sin sobresaltos hasta que se pudo mirar de cerca su fracción de nanopartículas. En 2021 la EFSA concluyó que ya no podía descartarse su genotoxicidad —su capacidad de dañar el material genético— y que, por tanto, no podía seguir considerándose seguro como aditivo alimentario.",
      "La Unión Europea lo prohibió en alimentos en 2022. Vale la pena quedarse con esta historia entera, porque responde sola a la objeción de siempre: «si estuviera autorizado, sería seguro». Estuvo autorizado décadas. Autorizado significa «no hemos encontrado un problema todavía», que no es lo mismo que «no lo hay».",
    ],
  },

  // ── Evidencia emergente ───────────────────────────────────────────────────
  {
    key: "emulgentes",
    titulo: "Emulgentes (E433, E466)",
    grupo: NIVEL_EMERGENTE,
    foto: foto("emulgentes"),
    claves: [
      "Mantienen unidos el agua y el aceite: cremosidad sin nata",
      "En animales erosionan la capa de moco del intestino",
      "El primer ensayo en personas ya vio cambios en la microbiota",
    ],
    parrafos: [
      "El polisorbato 80 (E433) y la carboximetilcelulosa (E466) hacen que el agua y el aceite no se separen. Son los que dan cremosidad a un helado sin nata y textura a una salsa sin huevo. Están en muchísimos más productos de los que te imaginas.",
      "Tu intestino está forrado por una capa de moco que mantiene a las bacterias a distancia de la pared. Es una frontera, y funciona porque nadie la cruza. En animales, estos emulgentes adelgazan esa capa: las bacterias se acercan más de lo debido, y aparece inflamación de bajo grado y alteración de la microbiota.",
      "En personas todavía hay poco, pero ya hay algo: un ensayo controlado de Chassaing y su equipo (2022) dio carboximetilcelulosa a voluntarios sanos y encontró cambios en su microbiota y en los metabolitos que produce. Es un estudio pequeño y hace falta mucho más. Pero fíjate en lo que estás leyendo: un detergente suave, comido a diario, sobre la frontera que acabas de conocer en el paso anterior.",
    ],
  },
  {
    key: "edulcorantes",
    titulo: "Edulcorantes sin calorías",
    grupo: NIVEL_EMERGENTE,
    foto: foto("edulcorantes"),
    claves: [
      "La OMS desaconseja usarlos para controlar el peso",
      "El eritritol se ha asociado a más riesgo de trombosis",
      "No son veneno, pero tampoco salen gratis",
    ],
    parrafos: [
      "Sacarina, aspartamo, sucralosa, acesulfamo K, eritritol. La promesa es preciosa: el dulce sin la factura. Y por eso conviene mirarla despacio, porque en biología casi nada sale gratis.",
      "En 2023 la OMS revisó todo lo publicado y acabó recomendando NO usarlos para controlar el peso: a largo plazo no se ve el beneficio que prometían, y sí señales de asociación con diabetes tipo 2 y enfermedad cardiovascular. Ese mismo año, el equipo de Hazen publicó que niveles altos de eritritol se asociaban a más eventos trombóticos.",
      "Nada de esto los convierte en veneno, y cambiar un refresco azucarado por uno light sigue siendo mejor que no cambiar nada. Pero el mensaje honesto no es «son seguros» ni «son tóxicos»: es que mantienen viva la costumbre del dulce constante, que es justo lo que querías desmontar.",
    ],
  },
  {
    key: "fosfatos",
    titulo: "Fosfatos añadidos (E338–E452)",
    grupo: NIVEL_EMERGENTE,
    foto: foto("fosfatos"),
    claves: [
      "Retienen agua y dan textura a embutidos y quesos fundidos",
      "El fósforo de aditivo se absorbe casi entero; el natural, no",
      "En cantidades altas se asocian a daño vascular y renal",
    ],
    parrafos: [
      "Retienen agua, dan textura y evitan que un queso fundido se corte. Están en embutidos, precocinados, refrescos de cola y quesos de untar. En la etiqueta pasan desapercibidos: son números, no palabras.",
      "Aquí hay un detalle que casi nadie sabe y que lo cambia todo. El fósforo de los alimentos de verdad —legumbres, frutos secos, cereales— se absorbe a medias, porque viene atrapado en su matriz. El de los aditivos viene libre, y se absorbe casi al cien por cien. Comiendo lo mismo «en fósforo» sobre el papel, entra el doble.",
      "En personas con los riñones sanos el cuerpo lo regula. Pero un exceso mantenido se asocia a calcificación de las arterias y a peor función renal, y quien ya tiene un riñón tocado no puede compensarlo. Es el ejemplo perfecto de por qué la etiqueta nutricional no basta: dice cuánto, nunca en qué forma.",
    ],
  },

  // ── No es un aditivo: no lo verás en la lista de ingredientes ─────────────
  {
    key: "acrilamida",
    titulo: "Acrilamida",
    grupo: NIVEL_NO_ADITIVO,
    foto: foto("acrilamida"),
    claves: [
      "No se añade: se forma al tostar almidón por encima de 120°C",
      "Patatas fritas, cereales tostados, bollería muy dorada, café",
      "Grupo 2A: probablemente cancerígena",
    ],
    parrafos: [
      "Esta no la añade nadie. Nace sola cuando un alimento rico en almidón se calienta en seco por encima de unos 120 grados: al freír, al hornear, al tostar. Patatas fritas, cereales de desayuno, cortezas muy doradas, café torrefacto.",
      "La IARC la clasifica en el grupo 2A, probablemente cancerígena en humanos. Cuanto más oscuro y más crujiente el dorado, más hay: el color tostado y la acrilamida se fabrican en la misma reacción.",
      "Se cuenta aquí justo por eso: para que veas que leer la etiqueta no es suficiente. Hay cosas que no entran por la lista de ingredientes, sino por lo que se le hizo a la comida. Y esta tiene remedio doméstico: dorado rubio en vez de tostado oscuro, y las patatas guardadas fuera de la nevera, porque el frío les sube los azúcares que luego alimentan la reacción.",
    ],
  },
  {
    key: "bpa-ftalatos",
    titulo: "BPA y ftalatos (del envase)",
    grupo: NIVEL_NO_ADITIVO,
    foto: foto("bpa-ftalatos"),
    claves: [
      "Vienen del plástico y del revestimiento de las latas",
      "Son disruptores endocrinos: imitan a tus hormonas",
      "La EFSA bajó drásticamente la ingesta tolerable de BPA en 2023",
    ],
    parrafos: [
      "El bisfenol A y los ftalatos no son ingredientes de nada. Están en el plástico de los envases, en el revestimiento interior de las latas, en las cintas de las máquinas que procesan la comida. Y migran al alimento, sobre todo con el calor y con la grasa.",
      "Se llaman disruptores endocrinos porque se parecen lo suficiente a tus hormonas como para ocupar sus receptores. Eso significa que no se comportan como un tóxico clásico: no hace falta una dosis alta, importa el momento de la vida en que llegan, y muy poca cantidad puede bastar.",
      "En 2023 la EFSA reevaluó el BPA y rebajó su ingesta diaria tolerable de forma drástica, hasta situarla muy por debajo de lo que muchas personas ya reciben. Lo que puedes hacer con esto es concreto: no calentar comida en plástico, menos conserva en lata, y vidrio siempre que se pueda.",
    ],
  },
];

// ── Cómo leer una etiqueta ──────────────────────────────────────────────────
// Lo único accionable de la página, y por eso va ARRIBA, antes de las fichas:
// si alguien se marcha después de leer tres líneas, que se lleve estas.
export interface SenalEtiqueta {
  titulo: string;
  texto: string;
}

export const SENALES_ETIQUETA: SenalEtiqueta[] = [
  {
    titulo: "Cuenta los ingredientes",
    texto: "Cinco o menos, y todos con nombre de comida, casi siempre es comida. Una lista de veinte que no cabe en la cara del envase, casi nunca.",
  },
  {
    titulo: "Mira quién va primero",
    texto: "Los ingredientes van de más a menos. Si el azúcar, la harina refinada o el aceite aparecen en los tres primeros puestos, ya sabes de qué está hecho de verdad.",
  },
  {
    titulo: "Busca el azúcar disfrazado",
    texto: "Jarabe de glucosa y fructosa, dextrosa, maltodextrina, jugo de caña evaporado, concentrado de zumo de manzana. Repartido en cinco nombres distintos, ninguno aparece el primero.",
  },
  {
    titulo: "Lee la advertencia",
    texto: "«Puede afectar negativamente a la actividad y la atención de los niños». Está impresa por ley en los productos con colorantes azoicos, y es la única vez que un alimento te avisa de sí mismo.",
  },
];
