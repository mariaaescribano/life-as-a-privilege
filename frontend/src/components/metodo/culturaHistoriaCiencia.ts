import type { HitoHistoria, SubHito } from "./culturaHistoriaUniversal";
import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// HISTORIA DE LA CIENCIA (Cultura). Tagline: «Cómo la humanidad aprendió a
// saber — de mirar el cielo con miedo a comprender el universo».
//
// Mismo modelo que las demás Historias: ETAPAS → SUB-HITOS (cada uno
// con su cómic: cuerpo + dato curioso, foto + texto a la
// derecha). Estructura del índice: Prólogo + 9 etapas (de la Prehistoria a la
// era de la información).
//
// No es solo historia: es un viaje sobre cómo se conoce. La ciencia no es un
// montón de datos, sino una forma de preguntar, comprobar y —sobre todo— aceptar
// que podemos estar equivocados. Cada etapa muestra una manera nueva de mirar la
// realidad.
//
// Fotos planas en /recorrido/cultura/historiaciencia/<subKey>.webp (el nombre del
// archivo = key del sub-hito; la carpeta aún no existe, así que de momento todos
// los círculos pintan su marcador). El texto se pinta con `separarFrases` (salto
// de línea tras cada punto).
//
// CÓMO SE CUENTA (igual que en las demás Historias): que se ENTIENDA, no que se
// cuente. Cada momento es cuerpo (qué problema había y cómo se resolvió) →
// «Dato curioso» (opcional: solo si de verdad hay algo curioso que contar), y
// cuando el tema da para más (cómo se mide
// la Tierra con una sombra, las pruebas de la evolución, por qué la cuántica es
// tan rara, las mujeres borradas de la ciencia…) se le añaden páginas
// «Profundiza» con el parámetro `extras`: viñetas EXTRA del mismo momento, no
// círculos nuevos de la línea del tiempo.
//
// Momentos sin fecha (eyebrow "") = pasajes de síntesis/transición (p. ej. «El
// saber no se pierde», «La ciencia no termina»): el ComicViewer oculta el
// antetítulo cuando va vacío.
// ─────────────────────────────────────────────────────────────────────────

const foto = (_era: string, sub: string) =>
  `/recorrido/cultura/historiaciencia/${sub}.webp`;

/** Página «Profundiza» de un momento: una viñeta más, con la misma foto. */
interface Profundiza {
  titulo: string;
  cuerpo: string[];
  /** Uno o dos datos curiosos (ver `Datos`). */
  dato?: Datos;
}

/** Los datos curiosos de un momento: uno («Dato curioso: …»), dos (el segundo
 *  escrito como «Dato curioso II: …») o ninguno. */
type Datos = string | string[];

const enLista = (x?: Datos) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const esProfundiza = (x: unknown): x is Profundiza[] =>
  Array.isArray(x) && typeof x[0] === "object";

// Sub-hito con su cómic: viñeta principal (`pregunta` gancho + `cuerpo` + hasta
// dos datos curiosos, OPCIONALES) y, opcionalmente, páginas «Profundiza» detrás.
// Si el momento no tiene ningún dato curioso pero sí «Profundiza», se pasan los
// extras directamente en su lugar (sin `undefined` de relleno).
const hito = (
  era: string, key: string, titulo: string, fecha: string,
  pregunta: string, cuerpo: string[],
  datosOExtras?: Datos | Profundiza[], masExtras?: Profundiza[],
): SubHito => {
  const datos = esProfundiza(datosOExtras) ? [] : enLista(datosOExtras);
  const extras = esProfundiza(datosOExtras) ? datosOExtras : masExtras;
  const src = foto(era, key);
  const paragraphs: string[] = [];
  if (pregunta) paragraphs.push(pregunta);
  paragraphs.push(...cuerpo, ...datos);
  const vinetas: Vineta[] = [{ src, eyebrow: fecha, titulo, paragraphs }];
  (extras ?? []).forEach((e) => {
    vinetas.push({
      src,
      eyebrow: "Profundiza",
      titulo: e.titulo,
      paragraphs: [...e.cuerpo, ...enLista(e.dato)],
    });
  });
  return { key, titulo, foto: src, vinetas };
};

export const HISTORIA_CIENCIA_HITOS: HitoHistoria[] = [
  // ───────────────────────────────────────────────────────────────────────
  // PRÓLOGO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "prologo",
    titulo: "¿Qué es la ciencia?",
    anio: "Antes de empezar el viaje",
    subhitos: [
      hito("prologo", "que-es-ciencia", "¿Qué es la ciencia?", "La gran herramienta",
        "",
        [
          "La ciencia no es una lista de verdades, sino un método para buscarlas. Su punto de partida es la curiosidad: mirar el mundo y preguntarse por qué las cosas ocurren como ocurren.",
          "Lo que la hace especial es que no se conforma con una explicación bonita o antigua. Exige comprobarla. Una idea científica tiene que poder ponerse a prueba y, si la realidad la contradice, hay que abandonarla.",
          "Por eso la ciencia avanza. No pretende tener razón para siempre, sino acercarse cada vez más a la verdad, corrigiendo sus propios errores.",
          "Comprender el mundo dejó de ser cosa de dioses y sacerdotes para convertirse en algo que cualquier persona, con método y honestidad, podía intentar.",
        ],
        "Dato curioso: la palabra «ciencia» viene del latín scientia, que significa simplemente «conocimiento». Pero no cualquier conocimiento: el que se puede comprobar."),
      hito("prologo", "como-se-sabe", "El método: preguntar y comprobar", "Cómo se sabe algo",
        "",
        [
          "Cuando alguien afirma que algo es verdad, ¿cómo podemos saber si lo es?",
          "El corazón de la ciencia es el método científico, una forma ordenada de buscar la verdad. Primero se observa algo, luego se propone una explicación (una hipótesis), después se diseña un experimento y por fin se comprueba el resultado.",
          "Lo esencial es que cualquiera pueda repetir ese experimento y obtener lo mismo. La verdad deja de depender de quién lo dice y pasa a depender de las pruebas.",
          "Gracias a este método, una persona humilde puede corregir a la mayor autoridad del mundo, siempre que tenga la realidad de su parte.",
          "Es una herramienta tan poderosa que ha transformado la vida humana más en cuatro siglos que en los cien mil años anteriores.",
        ]),
      hito("prologo", "ciencia-se-corrige", "La ciencia que se corrige", "La duda como motor",
        "",
        [
          "Muchas personas creen que la ciencia es débil porque «cambia de opinión». En realidad, ahí está su mayor fuerza: es el único saber que se corrige a sí mismo.",
          "Ninguna teoría científica se considera definitiva. Es la mejor explicación que tenemos hasta que aparezca una prueba que la mejore o la sustituya. La duda no es un fallo, es el motor.",
          "Por eso la ciencia progresa mientras otros saberes se estancan repitiendo lo que dijeron los antiguos. No teme reconocer que estaba equivocada.",
          "Aprender ciencia es también aprender una actitud ante la vida: mirar con curiosidad, dudar con honestidad y cambiar de idea cuando las pruebas lo exigen.",
        ],
        "Dato curioso: los científicos valoran tanto un experimento que refuta una teoría como uno que la confirma. Descubrir que estábamos equivocados también es avanzar."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 1 — ANTES DE LA CIENCIA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "antes-ciencia",
    titulo: "Antes de la ciencia",
    anio: "Prehistoria – Antigüedad",
    subhitos: [
      hito("antes-ciencia", "fuego-herramientas", "El fuego y las herramientas", "Prehistoria",
        "",
        [
          "Mucho antes de la escritura, nuestros antepasados lograron algo decisivo: controlar el fuego. Con él pudieron cocinar, calentarse, protegerse y alargar el día más allá de la luz del sol.",
          "También aprendieron a tallar la piedra, fabricar lanzas, agujas y hachas, y más tarde a trabajar los metales. Cada herramienta era el fruto de observar, probar y mejorar durante generaciones.",
          "No lo llamaban ciencia ni tecnología, pero ya hacían lo esencial: transformar la naturaleza usando lo que habían aprendido de ella.",
          "En aquellos gestos pacientes late el mismo impulso que millones de años después movería a los grandes científicos: entender el mundo para vivir mejor en él.",
        ],
        "Dato curioso: cocinar los alimentos permitió aprovechar mucha más energía de la comida. Algunos investigadores creen que fue clave para que nuestro cerebro pudiera crecer tanto."),
      hito("antes-ciencia", "contar-medir", "Contar y medir", "El nacimiento de los números",
        "",
        [
          "A medida que aparecieron la agricultura y el comercio, hizo falta contar: cuántos animales, cuántos sacos de grano, cuántos días hasta la cosecha. Así nacieron los números.",
          "Las primeras civilizaciones desarrollaron sistemas para calcular, medir terrenos y repartir cosechas. La geometría surgió, literalmente, de medir la tierra tras las crecidas de los ríos.",
          "Las matemáticas se convirtieron en el idioma con el que la humanidad empezaría a describir el mundo con precisión, mucho más allá de lo que las palabras podían.",
          "Sin ese lenguaje de números y figuras, la ciencia que vendría después habría sido sencillamente imposible.",
        ]),
      hito("antes-ciencia", "leer-el-cielo", "Leer el cielo", "Astronomía antigua",
        "",
        [
          "El cielo era el primer gran reloj y el primer gran calendario. Observando el Sol, la Luna y las estrellas, los pueblos antiguos aprendieron a prever las estaciones, las crecidas de los ríos y el momento de sembrar.",
          "Los babilonios registraron durante siglos los movimientos de los astros con una precisión asombrosa, y los egipcios orientaron sus templos y pirámides siguiendo el cielo.",
          "Aún mezclaban la observación con la astrología y la religión, pero acumularon datos tan cuidadosos que siglos después servirían de base a la verdadera astronomía.",
          "Mirar el cielo fue, quizá, el primer laboratorio de la humanidad: no se podía tocar, pero sí observar, anotar y buscar regularidades.",
        ],
        "Dato curioso: los babilonios ya sabían predecir eclipses observando los ciclos del cielo, miles de años antes de comprender por qué se producían."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 2 — GRECIA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "grecia-ciencia",
    titulo: "Grecia: la razón mira la naturaleza",
    anio: "Siglos VI – III a. C.",
    subhitos: [
      hito("grecia-ciencia", "tales-presocraticos", "Tales y los presocráticos", "≈siglo VI a. C.",
        "",
        [
          "Tales de Mileto suele considerarse el primer científico y filósofo de Occidente. Su gran mérito no fue acertar, sino cambiar la pregunta: en lugar de «¿qué dios lo hizo?», preguntó «¿qué causa natural lo produce?».",
          "Él y otros pensadores, los presocráticos, buscaron el elemento del que estaría hecho todo: el agua, el aire, el fuego. Uno de ellos, Demócrito, imaginó que la materia estaba formada por partículas diminutas e indivisibles, los átomos.",
          "Se equivocaban en los detalles, pero fueron los primeros en confiar en que el universo sigue reglas comprensibles.",
          "Con ellos, explicar el mundo dejó de ser tarea de sacerdotes y pasó a ser una aventura abierta a la razón humana.",
        ],
        "Dato curioso: la palabra «átomo» viene del griego y significa «que no se puede cortar». Más de dos mil años después, la ciencia recuperó esa intuición de Demócrito."),
      hito("grecia-ciencia", "pitagoras-numeros", "Pitágoras y los números", "≈570-495 a. C.",
        "",
        [
          "Pitágoras y sus seguidores descubrieron que detrás de la música, la geometría y el movimiento de los astros había proporciones numéricas exactas.",
          "De ahí sacaron una idea deslumbrante: que el orden del universo podía expresarse con matemáticas. El cosmos no era caos, sino armonía medible.",
          "Aquella intuición se convertiría en uno de los cimientos de toda la ciencia: la naturaleza se describe mejor con números que con palabras.",
          "Siglos después, Galileo diría que el libro de la naturaleza está escrito en lenguaje matemático. Los pitagóricos lo presintieron los primeros.",
        ],
        "Dato curioso: los pitagóricos descubrieron que las notas musicales que suenan bien juntas siguen proporciones matemáticas muy simples. Ciencia y belleza se dieron la mano."),
      hito("grecia-ciencia", "aristoteles-ciencia", "Aristóteles", "384-322 a. C.",
        "",
        [
          "Aristóteles fue el gran observador de la Antigüedad. Se interesó por prácticamente todo: los animales, las plantas, el movimiento, el cielo, la lógica y la política.",
          "Defendía que el conocimiento debía empezar observando cuidadosamente la realidad, y clasificó cientos de seres vivos con un detalle que asombra todavía hoy. Por eso muchos lo consideran el primer gran naturalista.",
          "También se equivocó en cosas importantes, como creer que los objetos pesados caen más deprisa que los ligeros, un error que tardaría casi dos mil años en corregirse.",
          "Su enorme prestigio impulsó la ciencia, pero también la frenó: durante siglos se le respetó tanto que casi nadie se atrevía a comprobar si tenía razón.",
        ],
        "Dato curioso: durante toda la Edad Media a Aristóteles se le llamaba simplemente «el Filósofo», como si no pudiera existir otro mayor."),
      hito("grecia-ciencia", "euclides", "Euclides", "≈300 a. C.",
        "",
        [
          "Euclides, en la ciudad de Alejandría, reunió y ordenó toda la geometría de su tiempo en una obra llamada los Elementos.",
          "Su genialidad fue el método: partió de unas pocas verdades evidentes y, a partir de ellas, demostró paso a paso cientos de teoremas, sin dejar nada al azar.",
          "Enseñó a la humanidad a razonar de forma rigurosa, encadenando conclusiones seguras. Ese modo de pensar inspiraría no solo a los matemáticos, sino a toda la ciencia.",
          "Los Elementos se estudiaron durante más de dos mil años. Pocos libros han educado la mente de tantas generaciones.",
        ],
        "Dato curioso: se dice que los Elementos de Euclides es, después de la Biblia, uno de los libros más editados y estudiados de toda la historia."),
      hito("grecia-ciencia", "arquimedes", "Arquímedes", "≈287-212 a. C.",
        "",
        [
          "Arquímedes fue el mayor genio científico de la Antigüedad: matemático, físico e ingeniero. Descubrió leyes fundamentales sobre las palancas, los flotadores y los volúmenes.",
          "Comprendió por qué flotan los cuerpos y calculó áreas y volúmenes con métodos que anticipaban las matemáticas modernas. También inventó ingeniosas máquinas de guerra y de riego.",
          "La leyenda cuenta que resolvió un problema mientras se bañaba y salió corriendo desnudo por la calle gritando «¡Eureka!» («¡Lo encontré!»).",
          "Unía como nadie la teoría y la práctica: pensaba a lo grande y, además, construía. Fue, en muchos sentidos, el primer gran físico de la historia.",
        ],
        "Dato curioso: se cuenta que Arquímedes afirmó: «Dadme un punto de apoyo y moveré el mundo», para explicar la fuerza de la palanca."),
      hito("grecia-ciencia", "eratostenes", "Eratóstenes mide la Tierra", "≈240 a. C.",
        "",
        [
          "Eratóstenes, bibliotecario de Alejandría, hizo algo increíble: calcular el tamaño de la Tierra usando solo la sombra de un palo, un poco de geometría y mucha inteligencia.",
          "Sabía que, un mismo día, el Sol caía totalmente vertical en una ciudad del sur mientras que en Alejandría proyectaba una sombra. Midiendo ese ángulo y la distancia entre ambas ciudades, dedujo la circunferencia del planeta.",
          "Su resultado fue asombrosamente cercano al valor real, ¡hace más de dos mil doscientos años y sin salir de una biblioteca!",
          "Fue una de las demostraciones más elegantes de la historia de que la razón y la medida pueden alcanzar lo que parece imposible.",
        ],
        "Dato curioso: gracias a cálculos como el de Eratóstenes, las personas cultas de la Antigüedad ya sabían que la Tierra era redonda. La idea del «mundo plano» es un mito posterior.",
        [
          {
            titulo: "Cómo se mide un planeta con una sombra",
            cuerpo: [
              "Este cálculo merece entenderse entero, porque es el mejor ejemplo de toda esta historia de lo que significa pensar científicamente: una observación mínima, una idea y un poco de geometría, y de ahí sale el tamaño del mundo.",
              "LO QUE SABÍA. Le habían contado que en Siena (la actual Asuán, en el sur de Egipto), el día del solsticio de verano al mediodía, el sol caía tan vertical que no había sombra: se podía ver el fondo de los pozos iluminado por completo y una columna no proyectaba nada.",
              "LO QUE MIDIÓ. Ese mismo día y a esa misma hora, en Alejandría —bastante más al norte—, un obelisco SÍ daba sombra. Midió el ángulo entre el obelisco y el extremo de su sombra y le salió, en nuestras unidades, algo más de 7 grados.",
              "LA IDEA. Si la Tierra fuera plana, el sol caería con el mismo ángulo en las dos ciudades y las dos tendrían la misma sombra. Que una tenga y la otra no significa que la superficie está curvada. Y como el Sol está tan lejos que sus rayos llegan prácticamente paralelos, ese ángulo de 7 grados no es del sol: es el ángulo de la propia curvatura entre las dos ciudades.",
              "LA REGLA DE TRES. 7 grados son aproximadamente la cincuentava parte de una circunferencia completa (7 x 50 = 350, casi 360). Así que la distancia entre Siena y Alejandría tenía que ser, más o menos, la cincuentava parte de la vuelta al mundo.",
              "EL ÚLTIMO DATO. Le faltaba saber esa distancia, y aquí está el detalle más humano de la historia: se la proporcionaron los «bematistas», hombres cuyo oficio era caminar contando sus propios pasos para medir rutas. Salían unos 5.000 estadios.",
              "EL RESULTADO. 5.000 estadios x 50 = 250.000 estadios de circunferencia terrestre. Según cuánto midiera exactamente su estadio —hay varias versiones, y por eso no se puede ser tajante—, el error estaría entre un 1 % y un 16 % respecto a los 40.075 km reales. Con una sombra, un ángulo, unos hombres contando pasos y una idea.",
              "Y UNA CONSECUENCIA HISTÓRICA ENORME. Ese dato quedó ahí, guardado, durante siglos. Y cuando Colón defendió que podía llegar a Asia navegando al oeste, usó unas cifras de tamaño terrestre mucho MENORES que las de Eratóstenes, porque le convenían para que el viaje pareciera corto. Los expertos que le decían que estaba equivocado tenían razón: si no hubiera habido un continente en medio, su expedición habría muerto de sed. Un bibliotecario del siglo III a. C. sabía el tamaño del mundo mejor que el hombre que lo cruzó mil setecientos años después.",
            ],
            dato: "Dato curioso: Eratóstenes calculó además la inclinación del eje terrestre, hizo un catálogo de estrellas, elaboró un calendario con años bisiestos, dibujó uno de los primeros mapas del mundo con meridianos y paralelos e inventó un método para encontrar números primos que todavía se enseña en las escuelas: la criba de Eratóstenes.",
          },
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 3 — LA CIENCIA VIAJA POR EL MUNDO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "ciencia-mundo",
    titulo: "La ciencia viaja por el mundo",
    anio: "Siglos VIII – XV",
    subhitos: [
      hito("ciencia-mundo", "cero-india", "El cero y los números", "India, ≈siglo V-VII",
        "",
        [
          "En la India nació el sistema de números que usamos hoy, con diez cifras y, sobre todo, con algo revolucionario: el cero como número.",
          "Puede parecer obvio, pero no lo era. El cero permitió escribir cualquier cantidad, por enorme que fuera, y hacer cálculos con una facilidad imposible con los números romanos.",
          "Este sistema viajó al mundo islámico y desde allí a Europa, donde se conoció como «números arábigos», aunque su origen estaba en la India.",
          "Sin el cero no existirían las matemáticas modernas, ni la física, ni los ordenadores. Toda la tecnología actual descansa, en el fondo, sobre esa idea de la «nada».",
        ],
        "Dato curioso: hoy los ordenadores funcionan solo con ceros y unos. Aquel invento indio del cero está, literalmente, dentro de cada aparato que usas."),
      hito("ciencia-mundo", "al-juarismi", "Al-Juarismi y el álgebra", "≈780-850",
        "",
        [
          "Al-Juarismi fue un sabio de la Casa de la Sabiduría de Bagdad, el gran centro científico de su época. Escribió un tratado que dio nombre a una rama entera de las matemáticas: el álgebra.",
          "El álgebra permite resolver problemas usando símbolos e incógnitas, en lugar de números concretos. Es una herramienta poderosísima para describir relaciones y resolver ecuaciones.",
          "Sus obras, traducidas al latín, enseñaron a Europa a calcular con los números indios y a manejar el álgebra.",
          "Su influencia fue tan grande que su propio nombre, latinizado, dio origen a una palabra que usamos cada día en informática y matemáticas.",
        ],
        "Dato curioso: la palabra «algoritmo» procede del nombre de Al-Juarismi. Cada vez que un ordenador ejecuta un algoritmo, honra sin saberlo a aquel sabio de Bagdad."),
      hito("ciencia-mundo", "alhacen", "Alhacén y la óptica", "965-1040",
        "",
        [
          "Alhacén (Ibn al-Haytham) estudió la luz y la visión con una precisión sin precedentes. Demostró que vemos porque la luz rebota en los objetos y entra en nuestros ojos, y no al revés, como se creía.",
          "Pero su mayor aportación fue el método: insistía en que ninguna idea debía aceptarse sin comprobarla mediante experimentos cuidadosos y repetibles.",
          "Por eso muchos historiadores lo consideran uno de los primeros defensores del método científico, siglos antes de la Revolución Científica europea.",
          "Con él, la ciencia dio un paso decisivo: no basta con razonar bien, hay que poner las ideas a prueba frente a la realidad.",
        ],
        "Dato curioso: Alhacén escribió que quien busca la verdad debe desconfiar incluso de los grandes sabios y comprobarlo todo por sí mismo. Es casi una definición de la ciencia moderna."),
      hito("ciencia-mundo", "china-inventos", "Los grandes inventos de China", "Siglos II a. C. – XV",
        "",
        [
          "Mientras Europa vivía la Edad Media, China desarrollaba inventos que transformarían el mundo entero: el papel, la imprenta, la pólvora y la brújula.",
          "El papel y la imprenta permitieron guardar y difundir el conocimiento; la brújula hizo posibles los grandes viajes por mar; y la pólvora cambió para siempre la guerra.",
          "Los chinos también destacaron en astronomía, medicina, ingeniería hidráulica y matemáticas, con siglos de adelanto en muchos campos.",
          "Estos inventos viajaron poco a poco hacia Occidente y allí encendieron cambios enormes. La ciencia y la técnica nunca fueron patrimonio de un solo pueblo.",
        ],
        "Dato curioso: se considera que el papel, la imprenta, la pólvora y la brújula fueron cuatro inventos chinos decisivos para el nacimiento del mundo moderno."),
      hito("ciencia-mundo", "saber-no-se-pierde", "El saber no se pierde", "",
        "",
        [
          "Durante siglos, el conocimiento pasó de mano en mano y de lengua en lengua: del griego al árabe, del árabe al latín, del latín a todas las lenguas de Europa.",
          "Cada civilización añadió algo: los griegos, la razón; la India, el cero; el mundo islámico, el álgebra y el experimento; China, la técnica.",
          "Cuando por fin todo ese saber acumulado regresó a Europa, se juntó con la imprenta, con nuevas universidades y con una curiosidad renovada.",
          "Estaba a punto de encenderse la mayor revolución del pensamiento humano.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 4 — LA REVOLUCIÓN CIENTÍFICA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "revolucion-cientifica",
    titulo: "La Revolución Científica",
    anio: "Siglos XVI – XVII",
    subhitos: [
      hito("revolucion-cientifica", "copernico", "Copérnico", "1473-1543",
        "",
        [
          "Durante más de mil años se había creído que la Tierra estaba inmóvil en el centro del universo y que todo giraba a su alrededor. Parecía evidente: el Sol «sale» y «se pone» cada día.",
          "Nicolás Copérnico se atrevió a proponer lo contrario: es la Tierra la que gira alrededor del Sol, junto con los demás planetas. Su modelo explicaba mucho mejor los movimientos del cielo.",
          "La idea era tan revolucionaria que Copérnico esperó casi hasta su muerte para publicarla, temiendo el rechazo.",
          "Con él empezó a tambalearse la vieja imagen del cosmos, y la humanidad dio el primer paso para bajarse del centro del universo.",
        ],
        "Dato curioso: cuando decimos que algo produjo un «giro copernicano», nos referimos precisamente a este cambio: una idea que da la vuelta por completo a lo que se creía."),
      hito("revolucion-cientifica", "galileo", "Galileo Galilei", "1564-1642",
        "",
        [
          "Galileo fue uno de los primeros en usar el telescopio para observar el cielo, y lo que vio cambió la historia: montañas en la Luna, lunas girando alrededor de Júpiter, miles de estrellas nuevas.",
          "Todo aquello confirmaba que el cielo no era perfecto e inmutable, y apoyaba la idea de Copérnico de que la Tierra no era el centro de todo.",
          "Pero su mayor aportación fue el método: Galileo hacía experimentos y medía. Demostró, contra Aristóteles, que todos los cuerpos caen igual de rápido si no hay aire que los frene.",
          "Por defender que la Tierra se movía, fue juzgado y obligado a retractarse. Aun así, su forma de unir la observación, el experimento y las matemáticas lo convirtió en el padre de la física moderna.",
        ],
        "Dato curioso: cuenta la leyenda que, tras ser obligado a negar que la Tierra se movía, Galileo murmuró: «Y sin embargo, se mueve»."),
      hito("revolucion-cientifica", "kepler", "Kepler", "1571-1630",
        "",
        [
          "Se creía que los astros debían moverse en círculos perfectos, porque el círculo se consideraba la figura más noble. Johannes Kepler descubrió que no era así.",
          "Estudiando durante años miles de observaciones muy precisas, comprobó que los planetas giran alrededor del Sol siguiendo elipses, no círculos, y que se mueven más deprisa cuando están más cerca del Sol.",
          "Resumió el movimiento de los planetas en unas pocas leyes matemáticas exactas, algo nunca visto.",
          "Su trabajo demostró que el cielo obedece a reglas precisas que podemos descubrir, y preparó el terreno para la gran síntesis de Newton.",
        ],
        "Dato curioso: Kepler tardó años en aceptar sus propias conclusiones, porque le costaba renunciar a la belleza del círculo. La realidad pesó más que la costumbre."),
      hito("revolucion-cientifica", "nace-metodo", "Nace el método científico", "Bacon y Descartes",
        "",
        [
          "Dos pensadores dieron forma a la nueva manera de buscar la verdad. Francis Bacon defendió que el conocimiento debe nacer de la observación y del experimento, reuniendo datos antes de sacar conclusiones.",
          "René Descartes, en cambio, insistió en la fuerza de la razón y en dudar de todo lo que no fuera absolutamente seguro. Propuso analizar cada problema dividiéndolo en partes más simples.",
          "Juntas, sus ideas dieron a la ciencia su gran herramienta: observar, plantear hipótesis, experimentar y razonar con orden, sin fiarse de la mera autoridad.",
          "A partir de entonces, una afirmación ya no valía por quién la decía, sino por las pruebas que la sostenían.",
        ],
        "Dato curioso: la frase de Descartes «pienso, luego existo» buscaba una única certeza absolutamente segura sobre la que reconstruir, desde cero, todo el conocimiento.",
        [
          {
            titulo: "Las reglas del juego (y las trampas de hoy)",
            cuerpo: [
              "El método científico no es una lista de pasos que se recita en el colegio: es un conjunto de defensas contra nosotros mismos, porque los seres humanos somos buenísimos encontrando lo que ya queremos encontrar. Estas son las piezas, y cada una está ahí por un motivo.",
              "1. UNA HIPÓTESIS QUE PUEDA FALLAR. Si una idea es compatible con cualquier resultado posible, no se puede comprobar y por tanto no es ciencia. La pregunta clave ante cualquier afirmación es: ¿qué tendría que ocurrir para que admitieras que te equivocas?",
              "2. UN GRUPO DE COMPARACIÓN. Sin él no se sabe nada, porque muchas cosas mejoran solas, cambian con la estación o se deben a mil factores a la vez.",
              "3. MEDIR, no impresionarse. Números, unidades, márgenes de error. «Mucho» y «poco» no son datos.",
              "4. CONTROLAR EL AZAR. Con pocos casos, cualquier resultado puede ser casualidad. De separar la señal del ruido se ocupa la estadística.",
              "5. QUE OTROS PUEDAN REPETIRLO. Un resultado que solo funciona en las manos de quien lo descubrió no vale. Por eso hay que publicar el método completo, no solo la conclusión.",
              "6. LA REVISIÓN POR PARES. Antes de publicarse, un trabajo lo examinan investigadores independientes que intentan encontrarle fallos. Nació con la primera revista científica de la historia, en 1665, y es un filtro imperfecto pero enormemente útil.",
              "Y AHORA LO QUE NO SE CUENTA EN LOS COLEGIOS: ESTO TAMBIÉN FALLA, y la propia ciencia lleva veinte años estudiando sus fallos, que es la mejor prueba de que funciona.",
              "LA CRISIS DE REPLICACIÓN. Cuando en la última década se han intentado repetir experimentos famosos de psicología, medicina y economía, una parte importante no ha dado el mismo resultado. No suele ser fraude: es una mezcla de muestras pequeñas, análisis retorcidos hasta que sale algo y ganas de publicar.",
              "EL SESGO DE PUBLICACIÓN. Durante décadas, los estudios con resultados positivos se publicaban mucho más que los que no encontraban nada. Eso deforma la realidad: un tratamiento puede parecer eficaz solo porque los ensayos fallidos se quedaron en un cajón.",
              "EL «PESCAR» RESULTADOS. Si mides veinte cosas y solo publicas la que salió bonita, casi seguro que estás publicando una casualidad. La solución que se ha adoptado es elegante: registrar públicamente qué se va a medir ANTES de hacer el experimento.",
              "EL DINERO. Quien paga un estudio influye en lo que se estudia y en lo que se publica. Se ha documentado en la industria del tabaco, del azúcar, de los combustibles fósiles y de los medicamentos. De ahí la obligación actual de declarar quién financia cada trabajo.",
              "Y CÓMO PROTEGERTE TÚ, que es lo práctico: desconfía de un solo estudio, sobre todo si es espectacular y aparece en titulares; mira si hay revisiones que reúnan MUCHOS estudios; pregunta con qué se comparó, a cuánta gente y quién lo pagó; y recuerda que dos cosas que ocurren juntas no demuestran que una cause la otra.",
              "La ciencia no es fiable porque los científicos sean más honrados que el resto: es fiable porque es el único sistema de conocimiento que se ha organizado para pillarse a sí mismo en los errores.",
            ],
            dato: "Dato curioso: el lema de la Royal Society, elegido en 1660, es «nullius in verba»: «en palabras de nadie». Es decir, aquí no se cree a nadie por quién es. Sigue siendo la frase más subversiva de la historia del conocimiento.",
          },
        ]),
      hito("revolucion-cientifica", "newton", "Isaac Newton", "1643-1727",
        "",
        [
          "Isaac Newton logró una de las mayores hazañas de la historia del pensamiento: unir el cielo y la Tierra bajo unas mismas leyes.",
          "Comprendió que la fuerza que hace caer una manzana al suelo es la misma que mantiene a la Luna girando alrededor de la Tierra y a los planetas alrededor del Sol: la gravedad.",
          "Formuló las leyes del movimiento y la ley de la gravitación universal, que describen con matemáticas cómo se mueve casi todo lo que vemos. Además inventó, para lograrlo, nuevas matemáticas.",
          "Con Newton culminó la Revolución Científica. El universo apareció, por primera vez, como un gran mecanismo ordenado que la razón humana podía comprender.",
        ],
        "Dato curioso: Newton dijo que si había visto más lejos era «porque me subí a hombros de gigantes», reconociendo a todos los que investigaron antes que él.",
        [
          {
            titulo: "De la manzana a la Luna: el razonamiento entero",
            cuerpo: [
              "La historia de la manzana la contó él mismo de mayor, y probablemente no le cayó en la cabeza. Lo que dijo es más interesante: que al ver caer una manzana se preguntó por qué la manzana cae y la Luna no.",
              "Y su respuesta fue que la Luna TAMBIÉN está cayendo. Solo que se mueve de lado lo bastante rápido para que, mientras cae, la Tierra se le curve por debajo y nunca llegue a tocarla. Está cayendo eternamente alrededor de nosotros.",
              "La imagen que él usó lo explica del todo: imagina un cañón en la cima de una montaña muy alta. Si disparas flojo, la bala describe un arco y cae cerca. Si disparas más fuerte, cae más lejos. Si disparas lo bastante fuerte, la bala cae exactamente al mismo ritmo al que la superficie de la Tierra se aleja de ella… y ya no aterriza nunca. Eso es una órbita. Y es literalmente lo que hacen los satélites, la Estación Espacial y la Luna.",
              "Con esa idea unificó de un golpe dos mundos que llevaban dos mil años separados: el cielo, que se creía eterno, perfecto y regido por leyes propias, y la Tierra, donde las cosas caen y se desgastan. Newton demostró que la misma fuerza y la misma fórmula gobiernan las dos. No hay dos físicas: hay una.",
              "SUS TRES LEYES, en lenguaje llano: una cosa sigue como está —quieta o moviéndose igual— hasta que algo la empuje (por eso te vas hacia delante cuando frena el autobús); el empujón que recibe una cosa es igual a su masa por lo que se acelera (por eso mover un armario cuesta más que mover una silla); y cuando empujas algo, ese algo te empuja a ti con la misma fuerza (por eso un cohete avanza, no porque se apoye en el aire, sino porque expulsa gas hacia atrás).",
              "Y LA GRAVEDAD: dos cuerpos cualesquiera se atraen con una fuerza que depende de sus masas y que disminuye con el cuadrado de la distancia. La misma ecuación sirve para una manzana, para un satélite, para la Luna y para Júpiter.",
              "LO QUE ESO CAMBIÓ. Por primera vez se podía CALCULAR el cielo. Con sus ecuaciones se predijeron mareas, eclipses y, en el caso más espectacular, el regreso de un cometa: Halley calculó cuándo volvería y volvió cuando tocaba, con los dos ya muertos. Y en 1846 se encontró un planeta nuevo, Neptuno, apuntando el telescopio al lugar exacto donde las cuentas decían que tenía que estar algo tirando de la órbita de Urano. Predecir un planeta con un lápiz es, quizá, el mayor golpe de efecto de la historia de la ciencia.",
              "PARA HACERLO, tuvo que inventar la matemática que necesitaba y no existía: el cálculo, con derivadas e integrales, al mismo tiempo que Leibniz lo desarrollaba por su cuenta, con una larguísima y amarga pelea entre ambos sobre quién fue primero.",
              "Y AUN ASÍ, no era la última palabra. Doscientos años después, Einstein mostró que la gravedad no es una fuerza que tira, sino la curvatura del espacio y el tiempo, y que las fórmulas de Newton fallan cuando las velocidades son enormes o la gravedad muy intensa. No lo tiró a la basura: lo dejó como una aproximación excelentísima para todo lo que ocurre a escala humana. Con las ecuaciones de Newton se calculó el viaje a la Luna.",
              "Y ESA ES LA LECCIÓN de método, quizá la más importante de este recorrido: en ciencia, «superado» no significa «falso». Significa que ahora se sabe también dónde deja de funcionar.",
            ],
            dato: "Dato curioso: fue un personaje extrañísimo. Dedicó más páginas a la alquimia y a intentar fechar las profecías bíblicas que a la física, nunca se casó, mantuvo enemistades feroces y, cuando lo pusieron al frente de la Casa de la Moneda inglesa, se dedicó con entusiasmo a perseguir falsificadores hasta el patíbulo.",
          },
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 5 — LA ILUSTRACIÓN
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "ilustracion-ciencia",
    titulo: "La Ilustración: ordenar el mundo",
    anio: "Siglo XVIII",
    subhitos: [
      hito("ilustracion-ciencia", "linneo", "Linneo clasifica la vida", "1707-1778",
        "",
        [
          "El naturalista Carlos Linneo se propuso ordenar toda la vida conocida. Creó un sistema para clasificar plantas y animales en grupos, del más general al más concreto.",
          "Inventó además una forma sencilla de nombrar cada especie con dos palabras en latín, un sistema tan práctico que seguimos usándolo hoy en todo el mundo.",
          "Gracias a él, los científicos de cualquier país podían entenderse al hablar de un mismo ser vivo, sin confusiones.",
          "Poner orden y un lenguaje común fue un paso esencial: sin clasificar la vida, habría sido imposible estudiarla y, más tarde, comprender la evolución.",
        ],
        "Dato curioso: nuestra propia especie recibió de Linneo su nombre científico: Homo sapiens, que significa «hombre sabio»."),
      hito("ilustracion-ciencia", "lavoisier", "Lavoisier y la química moderna", "1743-1794",
        "",
        [
          "Antes de Lavoisier, la química era casi magia, heredera de la alquimia. Él la convirtió en una ciencia exacta, basada en medir con precisión.",
          "Demostró que en una reacción química nada se crea ni se destruye: la materia solo se transforma. Es la ley de conservación de la masa, uno de los pilares de la química.",
          "Identificó y dio nombre a elementos como el oxígeno y explicó qué ocurre realmente cuando algo arde.",
          "Puso orden y balanza donde antes había recetas y misterio. Por eso se le considera el padre de la química moderna.",
        ],
        "Dato curioso: Lavoisier murió en la guillotina durante la Revolución Francesa. Un juez llegó a decir que «la República no necesita sabios». La ciencia perdió a uno de sus grandes genios."),
      hito("ilustracion-ciencia", "franklin-electricidad", "Franklin y la electricidad", "1706-1790",
        "",
        [
          "La electricidad parecía un misterio caprichoso hasta que empezó a estudiarse con método. Benjamin Franklin demostró, con experimentos audaces, que el rayo es electricidad.",
          "Según la famosa historia, hizo volar una cometa durante una tormenta para comprobarlo, un experimento tan peligroso como revelador.",
          "A partir de esa idea inventó el pararrayos, que protege los edificios conduciendo el rayo hasta el suelo sin daño.",
          "Fue un ejemplo perfecto del espíritu de la Ilustración: entender un fenómeno temido de la naturaleza y ponerlo al servicio de la humanidad.",
        ],
        "Dato curioso: la electricidad, apenas una curiosidad de laboratorio en el siglo XVIII, se convertiría un siglo después en la fuerza que iluminaría y movería el mundo entero."),
      hito("ilustracion-ciencia", "academias-enciclopedia", "Academias y enciclopedias", "El saber compartido",
        "",
        [
          "En el siglo XVIII, la ciencia se volvió una tarea colectiva. Surgieron academias y sociedades científicas donde los estudiosos compartían sus descubrimientos, los discutían y los publicaban.",
          "Nació también la idea de reunir todo el conocimiento humano en grandes obras. La Enciclopedia francesa quiso ordenar y difundir los saberes de su tiempo para que llegaran a cualquiera.",
          "Compartir los resultados y permitir que otros los comprobaran y mejoraran se convirtió en parte esencial del método científico.",
          "La ciencia entendió algo decisivo: el conocimiento crece mucho más rápido cuando se comparte que cuando se guarda en secreto.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 6 — EL SIGLO XIX
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "siglo-xix",
    titulo: "El siglo XIX: energía, vida y materia",
    anio: "Siglo XIX",
    subhitos: [
      hito("siglo-xix", "edad-de-la-tierra", "La Tierra tiene una edad", "1788-1956",
        "",
        [
          "Antes de poder aceptar la evolución, la ciencia tenía que resolver un problema previo: el TIEMPO. En Europa se daba por bueno un cálculo hecho en el siglo XVII a partir de las genealogías de la Biblia, según el cual el mundo se había creado hacia el 4004 antes de Cristo. Con seis mil años de historia, ninguna montaña puede formarse despacio y ninguna especie puede transformarse en otra.",
          "El primero en romper ese techo fue un médico y agricultor escocés, James Hutton. Observando acantilados y capas de roca se dio cuenta de algo elemental: los procesos que vemos hoy —la lluvia que erosiona, el río que arrastra sedimentos, el sedimento que se comprime y se convierte en roca— son lentísimos, y si son los mismos que han actuado siempre, hacen falta cantidades de tiempo inconcebibles.",
          "Charles Lyell convirtió esa intuición en una ciencia con reglas, y su libro fue precisamente lo que Darwin se llevó a leer en su viaje en el Beagle. Sin el tiempo profundo de la geología, la selección natural no habría podido funcionar: son dos ideas que se sostienen la una a la otra.",
          "Pero seguía faltando un número. En el siglo XIX se intentó calcular por cuánto tarda en enfriarse una bola de roca fundida, y el físico Kelvin dio como máximo unas decenas de millones de años, muy pocos para lo que la geología y la biología necesitaban. La discusión fue enconada durante décadas.",
          "El desempate llegó con la radiactividad. Al descubrirse que ciertos elementos se transforman en otros a un ritmo constante y perfectamente medible, se pudo usar la roca como un reloj: contando cuánto queda del elemento original y cuánto de su producto, sale el tiempo transcurrido. En 1956, midiendo un meteorito, se estableció la edad de la Tierra en unos 4.550 millones de años, cifra que sigue vigente.",
          "Y ahí está la lección de método: dos ciencias que parecían no tener nada que ver —la física del átomo y la historia de las rocas— resolvieron juntas un problema que ninguna podía cerrar por su cuenta.",
        ],
        "Dato curioso: para hacerse una idea de la escala, si los 4.550 millones de años de la Tierra fueran un solo año, la vida aparecería en febrero, los animales complejos a mediados de noviembre, los dinosaurios se extinguirían el 26 de diciembre, nuestra especie aparecería a las once y media de la noche del 31 de diciembre y toda la historia escrita ocuparía los últimos veinte segundos."),
      hito("siglo-xix", "teoria-celular", "Todo está hecho de células", "1665-1858",
        "",
        [
          "En 1665, Robert Hooke apuntó su microscopio a una fina lámina de corcho y vio que estaba dividido en compartimentos diminutos, como las celdillas de un panal o como las celdas de un monasterio. Por eso las llamó «células». Lo que estaba viendo eran las paredes vacías de células muertas, pero el nombre se quedó.",
          "Casi al mismo tiempo, un comerciante de telas holandés, Antoni van Leeuwenhoek, que pulía lentes minúsculas de una calidad asombrosa, miró una gota de agua de un estanque… y descubrió que estaba llena de seres vivos moviéndose. Los llamó «animálculos». Miró también su propia saliva, el sarro de sus dientes, el semen y la sangre, y encontró vida en todas partes. Nadie tenía ni idea de que existiera un mundo entero por debajo del alcance del ojo.",
          "PRIMERA: todos los seres vivos estamos hechos de células. Una bacteria es una sola; tú tienes en torno a treinta billones.",
          "SEGUNDA: la célula es la unidad funcional de la vida. No hay nada más pequeño que esté vivo, y todo lo que hace un cuerpo —moverse, digerir, pensar, defenderse— es lo que hacen sus células.",
          "TERCERA, la que añadió Rudolf Virchow y la más importante: toda célula procede de otra célula. Nada vivo aparece de la nada, y de ahí salió el golpe definitivo a la idea de la generación espontánea, que Pasteur remató con sus experimentos.",
          "Las consecuencias fueron inmensas. La enfermedad dejó de ser un desequilibrio de humores para convertirse en algo que ocurre en las células: la infección es una célula extraña que invade; el cáncer es una célula propia que se multiplica sin control; una herida cura porque las células se dividen. Y explicó la reproducción: un ser humano entero empieza siendo una sola célula que se divide una y otra vez.",
          "Y nos colocó en nuestro sitio: desde la teoría celular, la diferencia entre una bacteria de un estanque y una persona es de organización y de número, no de naturaleza. Estamos hechos de lo mismo.",
        ],
        "Dato curioso: Leeuwenhoek nunca reveló su técnica para fabricar lentes, y sus microscopios llegaban a aumentos que nadie logró igualar en más de un siglo. Era un comerciante sin estudios universitarios que no sabía latín, la lengua de la ciencia de su época: escribía sus descubrimientos en holandés, en cartas, y aun así lo eligieron miembro de la Royal Society de Londres."),
      hito("siglo-xix", "darwin", "Darwin y la evolución", "1809-1882",
        "",
        [
          "Charles Darwin viajó por el mundo observando la asombrosa variedad de la vida. Poco a poco llegó a una idea revolucionaria: todas las especies proceden de antepasados comunes y cambian a lo largo de enormes periodos de tiempo.",
          "El motor de ese cambio es la selección natural: los seres mejor adaptados a su entorno sobreviven y dejan más descendencia, transmitiendo sus características.",
          "Así, sin necesidad de un plan previo, la naturaleza va moldeando formas de vida cada vez más adaptadas. Es una de las ideas más poderosas de toda la ciencia.",
          "La evolución unió a todos los seres vivos, incluidos nosotros, en un mismo y gigantesco árbol de la vida.",
        ],
        "Dato curioso: Darwin retrasó más de veinte años la publicación de su teoría, consciente de lo mucho que iba a remover. Solo se decidió cuando otro naturalista, Alfred Russel Wallace, le escribió desde Indonesia contándole exactamente la misma idea.",
        [
          {
            titulo: "Las pruebas de la evolución, una por una",
            cuerpo: [
              "Cuando Darwin publicó, tenía observaciones y un razonamiento, pero le faltaban pruebas de varias piezas clave. Ciento sesenta años después, las pruebas llegan de campos que en su época no existían, y todas apuntan al mismo sitio. Van cinco.",
              "1. LOS FÓSILES. Aparecen siempre en el orden esperado: primero organismos simples, luego peces, luego anfibios, luego reptiles, luego mamíferos y aves. Nunca se ha encontrado un mamífero en una capa anterior a los primeros peces, y bastaría UNO para tumbar la teoría. Y se han encontrado los eslabones que Darwin echaba de menos: Tiktaalik, un pez con muñecas y codos capaz de apoyarse; Archaeopteryx, con plumas y dientes; y una serie preciosa de ballenas antiguas con patas cada vez más pequeñas, hasta las actuales, que todavía conservan huesos de pelvis por dentro y sin función.",
              "2. LA ANATOMÍA. La aleta de una ballena, el ala de un murciélago, la pata de un caballo y tu mano tienen los mismos huesos, en el mismo orden, con las mismas conexiones nerviosas: húmero, radio, cúbito, muñeca, dedos. Si cada especie hubiera sido diseñada por separado, no habría ningún motivo para reutilizar el mismo esquema en usos tan distintos. Y hay chapuzas que solo se explican por herencia: el nervio que va del cerebro a la laringe baja hasta el pecho, rodea una arteria y vuelve a subir. En una persona son unos centímetros de rodeo; en una jirafa, más de cuatro metros de cable de más.",
              "3. EL EMBRIÓN. Los embriones de un pez, una gallina, un cerdo y una persona son asombrosamente parecidos en sus primeras fases, con arcos branquiales y cola incluidos. Se van diferenciando después, porque la evolución trabaja modificando lo que ya había, no empezando de cero.",
              "4. EL ADN, la prueba que Darwin nunca pudo imaginar y la más contundente. Todos los seres vivos usamos el mismo código genético y las mismas cuatro letras. Y el grado de parecido genético coincide con el parentesco que ya se había deducido por los huesos y los fósiles: compartimos alrededor del 98,8 % del ADN con el chimpancé, menos con el ratón, muchísimo menos con una levadura, y aun así compartimos genes con la levadura. Es un árbol reconstruido dos veces, por dos métodos independientes, y sale el mismo.",
              "5. LA EVOLUCIÓN QUE SE VE HOY. No es cosa del pasado remoto: se observa en directo. Las bacterias que se vuelven resistentes a los antibióticos en un hospital, el virus de la gripe que cambia cada año y obliga a rediseñar la vacuna, los pinzones de las Galápagos cuyos picos cambian de tamaño medio en pocos años según las sequías —medido durante cuatro décadas por dos biólogos, generación a generación—, los insectos que se hacen inmunes a un pesticida. Cada vez que oyes hablar de resistencias, estás oyendo hablar de selección natural.",
              "Y CONVIENE DESHACER TRES MALENTENDIDOS.",
              "No dice que el hombre venga del mono: dice que los monos actuales y nosotros tenemos un antepasado común, como dos primos tienen un abuelo y ninguno viene del otro. No dice que sobreviva «el más fuerte», sino el que mejor encaja en su entorno concreto, que muchas veces es el más pequeño, el más discreto o el que mejor coopera. Y no tiene una dirección ni una meta: no vamos «hacia» ninguna parte, y las bacterias, que llevan aquí 3.500 millones de años, son el mayor éxito evolutivo del planeta.",
            ],
            dato: "Dato curioso: Darwin se pasó ocho años estudiando percebes y publicó cuatro volúmenes sobre ellos, y otros años criando palomas y estudiando lombrices. Su último libro fue sobre gusanos de tierra. La teoría más ambiciosa de la biología la construyó alguien obsesionado con lo pequeño y lo aburrido.",
          },
        ]),
      hito("siglo-xix", "mendel", "Mendel y la herencia", "1822-1884",
        "",
        [
          "Gregor Mendel, un monje apasionado por la naturaleza, cultivó y cruzó miles de plantas de guisantes en el huerto de su monasterio, anotándolo todo con paciencia.",
          "Descubrió que los rasgos se heredan siguiendo reglas matemáticas precisas, gracias a «unidades» que pasan de padres a hijos. Hoy las llamamos genes.",
          "Su trabajo, publicado en una revista modesta, pasó casi inadvertido en vida. Décadas después se redescubrió y se convirtió en la base de la genética.",
          "Mendel demostró que incluso algo tan complejo como la herencia esconde leyes claras, esperando a quien las observe con cuidado.",
        ],
        "Dato curioso: Mendel fue un adelantado a su tiempo. Su descubrimiento tuvo que esperar a que el mundo estuviera preparado para entenderlo."),
      hito("siglo-xix", "maxwell", "Maxwell y el electromagnetismo", "1831-1879",
        "",
        [
          "James Clerk Maxwell logró unir en una sola teoría dos fuerzas que parecían distintas: la electricidad y el magnetismo. Demostró que son dos caras de un mismo fenómeno, el electromagnetismo.",
          "Sus ecuaciones predijeron algo asombroso: que existían ondas electromagnéticas viajando por el espacio, y que la propia luz era una de ellas.",
          "De aquella teoría nacerían la radio, la televisión, el radar, el móvil y casi toda la tecnología de comunicaciones actual.",
          "Fue una de las grandes «unificaciones» de la ciencia: descubrir que dos cosas diferentes son, en el fondo, la misma.",
        ],
        "Dato curioso: gracias a las ecuaciones de Maxwell entendemos que la luz visible, las ondas de radio y los rayos X son todos el mismo fenómeno, solo que con distinta energía."),
      hito("siglo-xix", "mendeleyev", "Mendeléyev y la tabla periódica", "1834-1907",
        "",
        [
          "Dmitri Mendeléyev ordenó todos los elementos químicos conocidos según sus propiedades y creó la tabla periódica, uno de los mapas más útiles de la ciencia.",
          "Lo más impresionante es que su tabla tenía huecos: Mendeléyev predijo que existían elementos aún no descubiertos y describió cómo serían.",
          "Años después, esos elementos aparecieron, tal como los había anunciado. Una teoría que predice lo desconocido es una teoría poderosa.",
          "La tabla periódica muestra que toda la materia del universo está hecha de un número limitado de elementos, combinados de infinitas maneras.",
        ],
        "Dato curioso: se cuenta que Mendeléyev concibió la estructura de la tabla periódica tras darle muchas vueltas, casi como quien resuelve un enorme rompecabezas."),
      hito("siglo-xix", "termodinamica", "La energía y la termodinámica", "Descubrir la energía",
        "",
        [
          "En el siglo XIX, impulsados por las máquinas de vapor de la Revolución Industrial, los científicos comprendieron una idea profunda: todo lo que ocurre implica transformaciones de energía.",
          "Descubrieron que la energía no se crea ni se destruye, solo cambia de forma: de calor a movimiento, de movimiento a electricidad. Es una de las leyes más firmes de la física.",
          "También entendieron que, en cada transformación, algo de energía se dispersa como calor y ya no puede aprovecharse del todo. El universo tiende, poco a poco, al desorden.",
          "Estas leyes, la termodinámica, explican desde el motor de un coche hasta por qué envejecemos o por qué el tiempo parece avanzar siempre en una dirección.",
        ],
        "Dato curioso: la termodinámica nació estudiando cómo mejorar las máquinas de vapor, pero acabó explicando el destino del universo entero."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 7 — LA REVOLUCIÓN DE LA FÍSICA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "fisica-moderna",
    titulo: "La revolución de la física",
    anio: "Primera mitad del siglo XX",
    subhitos: [
      hito("fisica-moderna", "curie", "Marie Curie y la radiactividad", "1867-1934",
        "",
        [
          "Marie Curie descubrió que ciertos materiales emiten por sí solos una radiación misteriosa: la radiactividad. Aquello reveló que dentro del átomo se escondía una energía inmensa.",
          "Junto a su marido descubrió nuevos elementos, como el radio y el polonio, trabajando en condiciones durísimas y con medios muy escasos.",
          "Fue la primera persona en ganar dos premios Nobel, en dos ciencias distintas, en una época en la que a las mujeres apenas se les permitía investigar.",
          "Sus hallazgos abrieron la puerta a comprender el interior del átomo y a usos tan importantes como el tratamiento del cáncer con radiación.",
        ],
        "Dato curioso: Marie Curie manipuló materiales radiactivos sin conocer sus peligros. Sus cuadernos siguen siendo tan radiactivos que se guardan en cajas especiales.",
        [
          {
            titulo: "Las que estuvieron y casi no aparecen",
            cuerpo: [
              "Marie Curie es la excepción que conocemos todos, y precisamente por eso conviene contar la regla. Estas mujeres estuvieron en momentos decisivos de esta historia, y sus nombres se cayeron del relato.",
              "HIPATIA (siglo IV-V), matemática y astrónoma de Alejandría, enseñó geometría y astronomía y comentó los grandes textos matemáticos de su época. Murió linchada en la calle en un conflicto político y religioso.",
              "ÉMILIE DU CHÂTELET (siglo XVIII) tradujo los «Principia» de Newton al francés y le añadió un comentario propio que corregía y desarrollaba su física. Su versión es todavía hoy la traducción de referencia en francés, doscientos setenta años después. Y aportó una corrección importante sobre la relación entre energía y velocidad que anticipa lo que luego se llamaría energía cinética. Murió en el parto, a los cuarenta y dos años, con la obra recién terminada.",
              "CAROLINE HERSCHEL (siglo XVIII-XIX) descubrió ocho cometas y varias nebulosas, catalogó estrellas y fue la primera mujer que recibió un salario por hacer ciencia en Gran Bretaña.",
              "ADA LOVELACE (1815-1852) escribió, sobre una máquina de calcular que nunca llegó a construirse, lo que se considera el primer programa de la historia, y —esto es lo importante— fue la primera persona en darse cuenta de que una máquina así no serviría solo para operar con números, sino para manipular cualquier tipo de símbolo: música, texto, imágenes. Predijo la informática un siglo antes de que existiera.",
              "LAS «COMPUTADORAS» DE HARVARD (finales del XIX) fueron un equipo de mujeres contratadas para clasificar placas fotográficas de estrellas por un sueldo miserable. Una de ellas, Henrietta Leavitt, descubrió la relación que permite medir la distancia a las galaxias: sin ese hallazgo no se podría haber descubierto que el universo se expande. Otra, Annie Jump Cannon, clasificó a mano unas 350.000 estrellas y creó el sistema de clasificación que se usa hoy.",
              "LISE MEITNER (1878-1968) fue quien explicó teóricamente la fisión nuclear, es decir, por qué un núcleo de uranio se parte. El Nobel se lo dieron solo a su colega Otto Hahn. Y hay que añadir algo a su favor: se negó a participar en el proyecto de la bomba atómica.",
              "EMMY NOETHER (1882-1935) demostró un teorema que relaciona las simetrías de la naturaleza con las leyes de conservación de la energía y del momento. Es uno de los resultados más profundos de la física teórica, y Einstein la describió como la mujer más importante de la historia de las matemáticas. Trabajó años sin sueldo y sin plaza, porque la universidad no admitía profesoras.",
              "CHIEN-SHIUNG WU (1912-1997) diseñó y ejecutó el experimento que demostró que la naturaleza NO es simétrica en cierto tipo de desintegraciones, tirando por tierra un principio que se daba por seguro. El Nobel fue para los dos teóricos que habían propuesto la idea; ella, que la comprobó, se quedó fuera.",
              "JOCELYN BELL (n. 1943) detectó, siendo doctoranda, unas señales periódicas regularísimas procedentes del espacio: eran los púlsares, estrellas de neutrones girando. El Nobel de 1974 fue para su director de tesis.",
              "Y ROSALIND FRANKLIN, cuya historia se cuenta más adelante en este mismo recorrido.",
              "Esto tiene incluso un nombre propio en la historia de la ciencia: EFECTO MATILDA, la tendencia a atribuir el mérito de una investigadora a un colega varón. Y no es solo cosa del pasado: sigue midiéndose hoy en firmas de artículos, patentes y premios.",
              "La consecuencia no es solo de justicia. Es que durante siglos la humanidad ha investigado con media plantilla, y eso también explica algunos huecos de lo que sabemos: por ejemplo, que muchos ensayos clínicos y modelos de accidentes se hicieran durante décadas solo con cuerpos masculinos.",
            ],
            dato: "Dato curioso: Marie Curie no pudo estudiar en su Polonia natal, donde la universidad no admitía mujeres, y asistió a clases clandestinas en pisos particulares. En 1911, mientras la prensa francesa la atacaba por su vida privada, recibió su segundo Nobel. Y su hija Irène ganó otro años después: la primera vez que un premio Nobel científico pasó de madre a hija.",
          },
        ]),
      hito("fisica-moderna", "einstein", "Einstein y la relatividad", "1879-1955",
        "",
        [
          "Albert Einstein transformó nuestra idea del universo. Demostró que el tiempo y el espacio no son fijos: pueden estirarse y encogerse según cómo nos movamos o según la gravedad.",
          "Descubrió también que la masa y la energía son la misma cosa, resumido en la fórmula más famosa de la ciencia: la energía es igual a la masa por la velocidad de la luz al cuadrado.",
          "Su teoría de la gravedad describió esta fuerza como una curvatura del propio espacio y el tiempo provocada por los objetos con masa.",
          "Sus ideas, comprobadas una y otra vez, cambiaron para siempre nuestra visión del cosmos y hoy son esenciales incluso para que funcione el GPS de tu móvil.",
        ],
        "Dato curioso: cerca de un objeto muy masivo, el tiempo pasa un poquito más despacio. No es ciencia ficción: se ha medido con relojes reales.",
        [
          {
            titulo: "La relatividad, explicada sin ecuaciones",
            cuerpo: [
              "Todo sale de dos afirmaciones muy simples, y de tomárselas en serio hasta el final.",
              "PRIMERA: las leyes de la física son las mismas para cualquiera que se mueva a velocidad constante. Si vas en un tren sin ventanas y sin baches, no hay ningún experimento que puedas hacer dentro para saber si te mueves o estás quieto. Esto ya lo intuía Galileo.",
              "SEGUNDA, la explosiva: la luz siempre se mide a la misma velocidad, da igual cómo te muevas tú o cómo se mueva la fuente. Y esto es rarísimo. Si vas en coche a 100 y adelantas a otro que va a 90, lo ves alejarse a 10. Con la luz no funciona así: si persigues un rayo de luz a media velocidad de la luz, sigues midiendo que se aleja a la misma velocidad de siempre.",
              "SI ACEPTAS LAS DOS, algo tiene que ceder. Y lo que cede es lo que nadie sospechaba: el tiempo y el espacio. Como la velocidad es distancia dividida por tiempo, para que la velocidad de la luz salga siempre igual, la distancia y el tiempo tienen que cambiar según quién mida.",
              "CONSECUENCIA 1: EL TIEMPO SE DILATA. Un reloj en movimiento va más lento que uno quieto, y cuanto más rápido, más lento. No es una ilusión ni un defecto del reloj: es el tiempo. Se ha comprobado con relojes atómicos en aviones y con partículas en aceleradores, que «viven» más tiempo del que les corresponde cuando van muy rápido.",
              "CONSECUENCIA 2: NO HAY UN «AHORA» UNIVERSAL. Dos sucesos que para ti son simultáneos pueden no serlo para alguien que se mueve respecto a ti. El presente compartido de todo el universo, que parecía obvio, no existe.",
              "CONSECUENCIA 3: E = mc². La masa es energía concentradísima, y ese c² es un número gigantesco: en unos gramos de materia hay la energía de una explosión enorme. De ahí sale la energía del Sol, la de las centrales nucleares y la de la bomba atómica.",
              "Y DIEZ AÑOS DESPUÉS, LA GRAVEDAD. Einstein se dio cuenta de otra cosa elemental: si estás en caída libre, no sientes tu peso; y si estás en una nave acelerando, sientes exactamente lo mismo que sentirías en un planeta. Gravedad y aceleración son indistinguibles. De ahí concluyó que la gravedad no es una fuerza que tire de las cosas, sino la CURVATURA del espacio y del tiempo alrededor de los objetos con masa. La Tierra no cae hacia el Sol porque este la atraiga con una cuerda invisible: sigue el camino más recto posible en un espacio deformado.",
              "LA PRUEBA que lo hizo famoso en todo el mundo: si el espacio está curvado, la luz de las estrellas que pasa cerca del Sol debe desviarse una cantidad exacta, calculable. Solo se puede mirar durante un eclipse. En 1919 dos expediciones británicas lo midieron —cuatro años después de una guerra contra Alemania, midiendo la teoría de un alemán— y la desviación estaba ahí. Los periódicos titularon que las ideas de Newton habían sido superadas, y Einstein se convirtió en la primera celebridad científica de la historia.",
              "Y DÓNDE LO USAS TÚ. El GPS de tu móvil funciona con relojes de satélites, y esos relojes se adelantan unos 38 microsegundos al día respecto a los de la superficie por los dos efectos combinados: van rápido (retrasa) y están más lejos de la masa terrestre (adelanta). Si no se corrigiera, tu posición se desviaría unos diez kilómetros al día. Cada vez que usas el mapa, estás usando las dos relatividades a la vez.",
              "Y HAY MÁS PREDICCIONES QUE SE HAN CUMPLIDO después: los agujeros negros, cuya primera imagen se obtuvo en 2019; y las ondas gravitacionales, arrugas del espacio-tiempo producidas al chocar dos agujeros negros, detectadas por primera vez en 2015, cien años después de que él las anunciara.",
            ],
            dato: "Dato curioso: el Nobel no se lo dieron por la relatividad, que era demasiado polémica, sino por explicar el efecto fotoeléctrico, un trabajo del mismo año 1905 que además es una de las piezas fundadoras de la física cuántica… la teoría con la que él nunca acabó de estar de acuerdo.",
          },
        ]),
      hito("fisica-moderna", "cuantica", "El mundo cuántico", "Planck, Bohr, Heisenberg",
        "",
        [
          "Al estudiar el interior de los átomos, los físicos descubrieron un mundo que desafía el sentido común: el mundo cuántico. Allí, la energía viene en pequeños paquetes y las partículas se comportan también como ondas.",
          "Pioneros como Max Planck, Niels Bohr y Werner Heisenberg comprendieron que, en esa escala diminuta, no se puede predecir con certeza lo que hará una partícula, solo calcular probabilidades.",
          "Es una física extrañísima, pero funciona con una precisión asombrosa y ha sido comprobada miles de veces.",
          "Sin la física cuántica no existirían los ordenadores, los móviles, los láseres ni buena parte de la tecnología que usamos cada día.",
        ],
        "Dato curioso: la física cuántica es tan contraria a la intuición que el propio Einstein nunca llegó a aceptarla del todo, pese a haber ayudado a fundarla.",
        [
          {
            titulo: "Por qué es tan raro (y por qué funciona igual)",
            cuerpo: [
              "La cuántica tiene mala fama de incomprensible, y en parte es merecida: nadie tiene intuición para el mundo de lo diminuto, porque nuestro cerebro se hizo para piedras y animales. Pero sus rarezas se pueden contar.",
              "1. TODO VIENE A PAQUETES. La palabra «cuanto» significa «cantidad mínima». La energía no se puede dar en cualquier cantidad, sino en múltiplos de un paquete pequeñísimo, como el dinero, que no permite pagar media unidad del céntimo. Planck lo descubrió a la fuerza, casi con disgusto, porque era la única manera de que las cuentas del calor y la luz cuadraran.",
              "2. UNA COSA PUEDE COMPORTARSE COMO ONDA Y COMO PARTÍCULA. El experimento clave es el de la doble rendija, y es fácil de imaginar: si lanzas partículas de una en una contra una pared con dos ranuras, esperarías ver dos franjas detrás. Lo que aparece es un patrón de muchas franjas, típico de las ondas que se cruzan. Es decir: cada partícula, ella sola, atraviesa las dos ranuras a la vez e interfiere consigo misma. Y lo más desconcertante: si pones un detector para averiguar por cuál de las dos pasa, el patrón desaparece y vuelven las dos franjas. Mirar cambia el resultado.",
              "3. NO SE PUEDE SABER TODO A LA VEZ. El principio de incertidumbre de Heisenberg dice que cuanto mejor conoces la posición de una partícula, peor conoces su velocidad, y al contrario. Y no es un problema de instrumentos: es una propiedad de la naturaleza.",
              "4. LO QUE HAY SON PROBABILIDADES. La cuántica no dice «el electrón está aquí», dice «hay tanta probabilidad de encontrarlo aquí». La física deja de predecir con certeza y empieza a predecir distribuciones. Eso es lo que a Einstein le resultó insoportable, y de ahí su frase: «Dios no juega a los dados». Los experimentos han dado la razón a los otros.",
              "5. EL ENTRELAZAMIENTO, la rareza mayor. Dos partículas pueden quedar ligadas de tal modo que, al medir una, la otra queda determinada al instante, por lejos que esté. No sirve para enviar mensajes más rápido que la luz, pero es real: se ha comprobado en experimentos cada vez más finos, y el Nobel de Física de 2022 se dio precisamente por esas comprobaciones.",
              "Y AHORA LO IMPORTANTE: FUNCIONA. Es, medida en precisión de sus predicciones, la teoría más exitosa de la historia de la ciencia, y está dentro de casi todo lo que usas.",
              "El transistor, y por tanto todos los chips, los ordenadores y tu móvil. El láser, y con él los lectores de códigos, la fibra óptica, la cirugía ocular y los reproductores de disco. Los LED de tus bombillas. Los paneles solares. La resonancia magnética del hospital. El microscopio electrónico. El reloj atómico que da la hora al GPS. La química entera —los enlaces entre átomos son cuánticos—, y con ella los medicamentos diseñados por ordenador. Y ahora los ordenadores cuánticos, que están en sus primeros pasos.",
              "LA MORALEJA, que es una de las mejores de este recorrido: se puede saber usar algo con precisión asombrosa sin acabar de entender qué significa. Hay varias interpretaciones de la cuántica y los físicos siguen discutiéndolas cien años después. Mientras tanto, las predicciones se cumplen con doce decimales. La ciencia no exige comprender el fondo para poder avanzar; exige que las cuentas salgan y que cualquiera pueda comprobarlas.",
            ],
            dato: "Dato curioso: la cuántica también explica por qué brilla el Sol. Según la física clásica, los núcleos de hidrógeno no tendrían energía suficiente para fusionarse; lo consiguen gracias a un fenómeno cuántico llamado efecto túnel, que les permite atravesar una barrera que no podrían saltar. Estás vivo por una rareza cuántica.",
          },
        ]),
      hito("fisica-moderna", "atomo-energia", "El átomo: poder y peligro", "El poder del átomo",
        "",
        [
          "Al comprender el interior del átomo, los científicos descubrieron que podía liberarse una cantidad de energía inmensa rompiendo o uniendo sus núcleos.",
          "Esa energía tuvo dos caras opuestas. Por un lado, las centrales nucleares, capaces de producir enormes cantidades de electricidad. Por otro, la bomba atómica, el arma más destructiva jamás creada.",
          "En 1945, dos bombas atómicas arrasaron ciudades enteras y mostraron al mundo el terrible poder que la ciencia había puesto en manos humanas.",
          "Fue un aviso que aún resuena: el conocimiento da poder, pero no dice cómo usarlo. Esa decisión, moral y humana, sigue siendo nuestra.",
        ],
        "Dato curioso: muchos de los científicos que ayudaron a crear la bomba atómica dedicaron después su vida a advertir contra el peligro de las armas nucleares."),
      hito("fisica-moderna", "big-bang", "El universo tiene una historia", "1929-1965",
        "",
        [
          "El primer golpe lo dio una pregunta sencilla: ¿qué son exactamente esas manchas nebulosas del cielo? En 1924, midiendo su distancia, Edwin Hubble demostró que algunas no estaban dentro de nuestra galaxia, sino que eran GALAXIAS ENTERAS, con miles de millones de estrellas, a distancias inconcebibles. En una sola observación, el universo conocido se multiplicó por miles.",
          "Y para medir esas distancias usó el método que había descubierto Henrietta Leavitt en Harvard, clasificando placas fotográficas por un sueldo de miseria.",
          "El segundo golpe llegó en 1929: analizando la luz de esas galaxias, Hubble comprobó que casi todas se alejan de nosotros, y que cuanto más lejos están, más rápido se alejan. La conclusión es inevitable y no significa que estemos en el centro de nada: significa que el espacio ENTERO se está expandiendo, como los puntos dibujados en un globo que se infla, que se separan todos entre sí.",
          "Y si hoy está más separado, ayer estaba más junto. Rebobinando, todo tuvo que estar concentrado en un estado inicial densísimo y calentísimo. Eso es lo que llamamos Big Bang, un nombre puesto en broma y con desprecio por un astrónomo que no se lo creía. La idea la había propuesto en 1927 un físico y sacerdote belga, Georges Lemaître, y conviene decirlo por lo que enseña: la teoría del origen del universo la formuló un cura y la rechazaba un ateo, exactamente al contrario de lo que cabría suponer.",
          "Y AQUÍ VIENE LA PARTE QUE CONVIERTE UNA IDEA EN CIENCIA. La teoría predecía que, si aquello ocurrió, debía quedar un rescoldo: una radiación muy débil y muy fría llegando desde todas las direcciones del cielo por igual. En 1965, dos ingenieros que estaban probando una antena de comunicaciones se encontraron con un ruido de fondo que no podían eliminar. Limpiaron la antena, echaron a las palomas que anidaban dentro, y el ruido seguía. No lo buscaban: habían encontrado el eco del origen del universo.",
          "Con eso, el Big Bang dejó de ser una especulación y pasó a ser el modelo estándar. Hoy la edad del universo se calcula en unos 13.800 millones de años, y hay una tercera confirmación independiente: la proporción de hidrógeno y helio que se observa en el cosmos es exactamente la que predice el modelo.",
          "Conviene aclarar un malentendido muy repetido: el Big Bang no fue una explosión en un punto del espacio, sino la expansión del espacio mismo. No hay un sitio donde ocurrió, porque ocurrió en todos.",
          "Y quedan preguntas abiertas y enormes, que es la mejor prueba de que esto está vivo: no sabemos qué es la materia oscura ni la energía oscura, que juntas parecen ser el 95 % del contenido del universo, ni por qué la expansión se está acelerando, ni qué había «antes» —una pregunta que quizá no signifique nada si el tiempo empezó ahí—.",
        ],
        "Dato curioso: parte de ese eco del origen se colaba en los televisores antiguos. Un pequeño porcentaje de la nieve gris que aparecía al sintonizar un canal vacío era radiación de fondo cósmico: durante décadas, cualquiera pudo ver en su salón un poquito del universo recién nacido."),
      hito("fisica-moderna", "explorar-cosmos", "Salir a mirar de cerca", "Desde 1957",
        "",
        [
          "Durante toda la historia, la astronomía consistió en mirar hacia arriba desde el suelo. En 1957, con el lanzamiento del Sputnik, empezó a consistir también en IR.",
          "LAS SONDAS. Se ha aterrizado en la Luna, en Marte, en Venus, en Titán y en un cometa; se han enviado sondas a todos los planetas del sistema solar. Las dos Voyager, lanzadas en 1977, siguen funcionando y ya han salido de la zona de influencia del Sol: son los objetos humanos más lejanos que existen. Y los robots que recorren Marte han confirmado algo que desde la Tierra solo se sospechaba: allí hubo agua líquida.",
          "LOS TELESCOPIOS ESPACIALES. Fuera de la atmósfera se ve sin la distorsión del aire y se pueden captar radiaciones que aquí no llegan. El Hubble fotografió galaxias a miles de millones de años luz y su famoso «campo profundo» —una foto de un trozo de cielo aparentemente vacío que resultó estar lleno de miles de galaxias— cambió la percepción que teníamos de nuestro sitio. Y el telescopio James Webb, con su espejo dorado de seis metros y medio, ve en infrarrojo y está observando galaxias formadas apenas unos cientos de millones de años después del Big Bang.",
          "LOS EXOPLANETAS, que es probablemente el cambio conceptual mayor. Hasta 1995 no había ninguna prueba de que existieran planetas alrededor de otras estrellas: era una suposición razonable y nada más. Hoy se han confirmado más de cinco mil, se sabe medir su tamaño, su órbita y en algunos casos su atmósfera, y se estima que la mayoría de las estrellas tienen planetas. La pregunta de si hay vida en otro sitio ha pasado de ser filosofía a ser un programa de investigación con instrumentos y calendario.",
          "Y HAY UN EFECTO DE VUELTA que casi nadie previó: mirando hacia fuera aprendimos a mirarnos. Los satélites midieron por primera vez el agujero de la capa de ozono, la deforestación, el deshielo, las corrientes y la temperatura global. La mejor información que tenemos sobre nuestra propia casa nos la dan aparatos que salieron de ella.",
          "Y la imagen más influyente de todo el programa espacial no fue de otro mundo, sino del nuestro: la Tierra vista desde lejos, pequeña, azul y sin ninguna frontera dibujada.",
        ],
        "Dato curioso: en 1990, a petición del astrónomo Carl Sagan, la sonda Voyager 1 giró sus cámaras y fotografió la Tierra desde seis mil millones de kilómetros. Se ve como un punto de menos de un píxel dentro de un rayo de luz dispersa. Esa foto se llama «un punto azul pálido», y en ella caben, sin excepción, todas las guerras y todas las personas que han existido."),
      hito("fisica-moderna", "tectonica-placas", "Los continentes se mueven", "1912-1968",
        "",
        [
          "En 1912, un meteorólogo alemán llamado Alfred Wegener planteó una idea que a sus colegas les pareció ridícula: los continentes se mueven, y en el pasado estuvieron todos unidos en uno solo.",
          "Sus argumentos eran buenos y muy visuales. Las costas de África y Sudamérica encajan como dos piezas de un puzle. Hay fósiles idénticos de plantas y animales terrestres a los dos lados del Atlántico, y ningún reptil cruza un océano a nado. Hay cordilleras que empiezan en un continente y continúan, con las mismas rocas y la misma edad, en otro. Y hay marcas de glaciares antiguos en la India, en África y en Australia, es decir, en zonas hoy tropicales, que solo tienen sentido si todas estuvieron juntas y cerca del polo.",
          "Le faltaba una sola cosa, y era decisiva: no podía explicar el MECANISMO. ¿Qué fuerza mueve un continente? Sus propuestas eran flojas y los geofísicos calcularon que nada de eso podía funcionar. Fue rechazado durante casi cincuenta años, ridiculizado por no ser geólogo, y murió en una expedición en Groenlandia en 1930 sin haber convencido a nadie.",
          "La respuesta llegó después de la Segunda Guerra Mundial y, curiosamente, desde la tecnología militar: los sonares y los magnetómetros desarrollados para cazar submarinos permitieron cartografiar por primera vez el fondo del océano. Y lo que apareció allí abajo era otro planeta: una cordillera de miles de kilómetros recorriendo el centro del Atlántico, y fosas de once kilómetros de profundidad.",
          "El hallazgo definitivo fue magnético. El campo magnético de la Tierra se invierte cada cierto tiempo, y la roca volcánica, al enfriarse, queda «grabada» con la orientación del momento. Al medir el fondo oceánico apareció un patrón de bandas simétricas a los dos lados de la cordillera central, como los anillos de un árbol: roca nueva en el centro, cada vez más antigua a medida que se aleja.",
          "Eso solo se puede explicar de una manera: por la cordillera central sale material nuevo continuamente, el suelo oceánico se va separando hacia los lados y en otras zonas se hunde bajo otra placa. Los continentes no navegan sobre el mar: van montados en placas de corteza que se mueven unos centímetros al año, empujadas por el calor interno del planeta.",
          "Hacia 1968 la teoría de la tectónica de placas estaba aceptada, y unificó de golpe cosas que parecían no tener relación: por qué hay terremotos y volcanes exactamente en las mismas franjas del mapa, por qué crecen las montañas —el Himalaya se levanta porque la India sigue empujando contra Asia—, cómo se abren y se cierran los océanos y por qué la vida evolucionó separada en unos continentes y no en otros.",
        ],
        "Dato curioso: se mueven ahora mismo, mientras lees esto, a un ritmo parecido al que te crecen las uñas: unos centímetros al año. Y en unas decenas de millones de años el Mediterráneo habrá desaparecido, porque África sigue subiendo hacia Europa."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 8 — DESCIFRAR LA VIDA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "descifrar-vida",
    titulo: "Descifrar la vida",
    anio: "Siglo XX",
    subhitos: [
      hito("descifrar-vida", "adn", "El ADN: la molécula de la vida", "1953",
        "",
        [
          "En 1953 se descubrió la estructura del ADN, la molécula que contiene las instrucciones para formar y hacer funcionar a todos los seres vivos, desde una bacteria hasta un ser humano.",
          "Tiene forma de doble hélice, como una escalera retorcida. Sus escalones forman un código que se puede copiar con enorme fidelidad cada vez que una célula se divide.",
          "Ese descubrimiento explicó de golpe cómo se transmite la herencia de la que hablaba Mendel: los genes están escritos en el ADN.",
          "Fue uno de los mayores hitos de la historia: por fin podíamos leer, letra a letra, el manual de instrucciones de la vida.",
        ],
        "Dato curioso: si estirásemos todo el ADN de una sola célula humana, mediría cerca de dos metros. Y llevas billones de células dentro de ti."),
      hito("descifrar-vida", "rosalind-franklin", "Rosalind Franklin", "1920-1958",
        "",
        [
          "El descubrimiento de la forma del ADN no habría sido posible sin Rosalind Franklin, una científica brillante experta en fotografiar moléculas con rayos X.",
          "Fue su famosa imagen, conocida como «Fotografía 51», la que reveló la forma de doble hélice del ADN con una claridad decisiva.",
          "Durante mucho tiempo su papel quedó en la sombra, mientras otros recibían casi todo el reconocimiento. Murió joven, sin llegar a ver del todo valorada su aportación.",
          "Su historia recuerda que la ciencia la hacen muchas personas, y que a lo largo de la historia el mérito de muchas mujeres fue silenciado o ignorado.",
        ],
        "Dato curioso: hoy la «Fotografía 51» de Rosalind Franklin se considera una de las imágenes más importantes de la historia de la ciencia."),
      hito("descifrar-vida", "editar-vida", "Leer y editar la vida", "Del genoma a hoy",
        "",
        [
          "Tras descubrir el ADN, la ciencia se propuso leerlo entero. A comienzos del siglo XXI se logró descifrar el genoma humano completo, todas las instrucciones de nuestra especie.",
          "Más tarde llegaron herramientas capaces no solo de leer los genes, sino de editarlos, corrigiendo con precisión pequeños errores en el ADN.",
          "Esto abre posibilidades enormes: curar enfermedades hereditarias, crear mejores tratamientos y entender mejor la vida.",
          "Pero también plantea preguntas difíciles: ¿hasta dónde debemos modificar la vida? La ciencia nos da un poder inmenso, y con él, una gran responsabilidad.",
        ],
        "Dato curioso: leer el primer genoma humano completo costó años de trabajo y una enorme fortuna. Hoy puede hacerse en poco tiempo y por una fracción mínima de aquel precio."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 9 — LA ERA DE LA INFORMACIÓN Y EL FUTURO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "era-informacion",
    titulo: "La era de la información y el futuro",
    anio: "Siglos XX – XXI",
    subhitos: [
      hito("era-informacion", "turing", "Alan Turing y el ordenador", "1912-1954",
        "",
        [
          "Alan Turing imaginó, antes de que existieran los ordenadores, una máquina capaz de seguir instrucciones para resolver cualquier problema que pudiera describirse con reglas. Fue la idea que está detrás de todos los ordenadores actuales.",
          "Durante la Segunda Guerra Mundial, ayudó a descifrar los mensajes secretos del enemigo con máquinas de cálculo, acortando la guerra y salvando incontables vidas.",
          "También se preguntó algo que aún debatimos: ¿podría una máquina llegar a pensar como un ser humano?",
          "Está considerado uno de los padres de la informática. Su forma de pensar dio origen al mundo digital en el que hoy vivimos.",
        ],
        "Dato curioso: Turing fue tratado de forma injusta y cruel en su época por su orientación sexual. Décadas después, su país le pidió perdón oficialmente y hoy se le honra como un héroe.",
        [
          {
            titulo: "La máquina que puede ser cualquier máquina",
            cuerpo: [
              "La idea de Turing es de 1936, nueve años antes de que existiera el primer ordenador, y es una de las más abstractas y más consecuentes de la historia. Merece entenderse, porque explica el aparato con el que estás leyendo esto.",
              "Se preguntó qué significa exactamente «calcular». Y describió una máquina imaginaria y ridículamente simple: una cinta infinita dividida en casillas, un cabezal que puede leer un símbolo, borrarlo, escribir otro y moverse una casilla a izquierda o derecha, y una tabla de reglas del tipo «si estás en este estado y lees este símbolo, escribe esto y muévete allí».",
              "Con eso, sostuvo, se puede hacer CUALQUIER cálculo que un ser humano pueda hacer siguiendo un procedimiento. Y luego dio el paso decisivo: si las reglas se pueden escribir en la propia cinta como datos, entonces existe una máquina capaz de imitar a todas las demás. Es la máquina universal.",
              "Ahí está inventado, en un artículo de matemáticas, el concepto de SOFTWARE. Un ordenador no es un aparato para una tarea: es un aparato al que le das las instrucciones de la tarea. El mismo objeto es una calculadora, una máquina de escribir, una mesa de mezclas, un teléfono, un mapa o una consola según el programa que le pongas. Todo lo demás —el móvil, el portátil, el servidor— son variaciones técnicas de esa idea.",
              "Y en el mismo artículo demostró también un LÍMITE, y esto es lo que suele olvidarse: hay problemas que ninguna máquina podrá resolver nunca, por potente que sea. Probó que no puede existir un programa capaz de determinar, para cualquier programa y cualquier dato, si acabará o se quedará dando vueltas para siempre. La informática nació con su propio teorema de imposibilidad incorporado.",
              "LA GUERRA. En Bletchley Park, Turing y su equipo se enfrentaron a Enigma, la máquina con la que el ejército alemán cifraba sus mensajes y cuyas claves cambiaban cada día. Diseñó máquinas electromecánicas que probaban configuraciones a gran velocidad descartando las imposibles, y desarrolló métodos estadísticos para aprovechar los descuidos del enemigo: saludos repetidos, partes meteorológicos previsibles. Allí trabajaron unas diez mil personas, de las cuales más de dos terceras partes eran mujeres, y se estima que su trabajo acortó la guerra en años y salvó millones de vidas. Todo estuvo clasificado durante décadas: los que lo hicieron no pudieron contarlo, ni en sus propias familias.",
              "EL TEST. En 1950 planteó la pregunta «¿puede pensar una máquina?» y, en lugar de discutir definiciones, propuso convertirla en algo comprobable: si en una conversación escrita no puedes distinguir si al otro lado hay una persona o una máquina, ¿con qué criterio le niegas la capacidad de pensar? Setenta años después, esa pregunta ha dejado de ser un juego de salón.",
              "Y EL FINAL, que hay que contar. En 1952 fue condenado por su homosexualidad, entonces delito en el Reino Unido. Le dieron a elegir entre la cárcel y un tratamiento hormonal con estrógenos, una castración química con efectos físicos y psicológicos devastadores. Perdió su acreditación de seguridad y su acceso al trabajo secreto. Murió en 1954, con cuarenta y un años, por envenenamiento con cianuro; se considera un suicidio. El gobierno británico se disculpó oficialmente en 2009 y la reina le concedió un perdón póstumo en 2013. En 2017 se aprobó una ley que extiende ese perdón a decenas de miles de hombres condenados por lo mismo, y se conoce como «ley Turing».",
              "El hombre que descifró el código que ayudó a ganar la guerra fue destruido por su propio país por lo que era.",
            ],
            dato: "Dato curioso: el premio más importante de la informática, el equivalente al Nobel de la disciplina, se llama Premio Turing. Y en el Reino Unido su cara está en el billete de cincuenta libras desde 2021.",
          },
        ]),
      hito("era-informacion", "internet", "La red que conectó el mundo", "Desde 1969",
        "",
        [
          "A finales del siglo XX, los ordenadores empezaron a conectarse entre sí formando una red mundial: internet. Por primera vez, la información podía viajar en segundos de un extremo a otro del planeta.",
          "Con la web, cualquier persona pudo acceder a una cantidad de conocimiento que antes no cabía en las mayores bibliotecas del mundo.",
          "Internet transformó la forma de trabajar, aprender, comunicarnos y relacionarnos, con enormes ventajas y también nuevos problemas.",
          "El sueño ilustrado de compartir el saber con toda la humanidad se hizo realidad a una escala que ningún enciclopedista habría imaginado jamás.",
        ],
        "Dato curioso: gran parte de la tecnología de internet nació de la colaboración entre científicos que querían compartir sus datos y descubrimientos más fácilmente."),
      hito("era-informacion", "inteligencia-artificial", "La inteligencia artificial", "Siglo XXI",
        "",
        [
          "La inteligencia artificial son programas capaces de aprender a partir de enormes cantidades de datos, en lugar de seguir solo instrucciones fijas.",
          "Hoy pueden reconocer imágenes, traducir idiomas, conducir vehículos, ayudar a descubrir medicinas o mantener una conversación. Aprenden a base de ejemplos, un poco como aprendemos las personas.",
          "Es una herramienta poderosísima que ya está transformando la ciencia, el trabajo y la vida cotidiana a gran velocidad.",
          "Y trae consigo grandes preguntas: ¿cómo usarla bien?, ¿qué decisiones podemos dejarle?, ¿cómo asegurarnos de que beneficie a todos? Responderlas será uno de los grandes retos de tu generación.",
        ],
        [
          {
            titulo: "Cómo aprende una máquina",
            cuerpo: [
              "Conviene entender el mecanismo, aunque sea por encima, porque cambia mucho la manera de usar estas herramientas y de fiarse de ellas.",
              "LA DIFERENCIA CON UN PROGRAMA NORMAL. Un programa clásico son instrucciones escritas por una persona: «si el usuario pulsa aquí, haz esto». Para reconocer un gato en una foto, ese enfoque falla: nadie sabe escribir las reglas exactas de «gato». Así que se cambió la estrategia: en lugar de darle las reglas, se le dan MILLONES DE EJEMPLOS y la máquina ajusta sus propios parámetros hasta acertar. Eso es aprendizaje automático.",
              "CÓMO SE AJUSTA. Dentro hay una red con capas de unidades conectadas, inspirada muy libremente en las neuronas. Cada conexión tiene un número, un «peso». Al principio están al azar, así que el sistema falla. Entonces se mide cuánto se ha equivocado y se corrigen ligeramente todos los pesos en la dirección que reduce el error. Se repite miles de millones de veces. No hay comprensión ni intención: hay un ajuste estadístico gigantesco.",
              "LOS MODELOS DE LENGUAJE, que son los que han hecho famosa la IA, hacen algo aparentemente humilde: predecir la continuación más plausible de un texto, palabra a palabra, después de haber procesado cantidades enormes de texto escrito por personas. Lo asombroso es que al hacer eso a esa escala emergen capacidades que nadie programó: resumir, traducir, razonar de forma aproximada, escribir código.",
              "Y DE AHÍ SALEN SUS DOS CARAS. Como no consulta una base de datos de verdades, sino que genera lo más plausible, puede afirmar con total seguridad algo falso —se le llaman alucinaciones—, y no distingue por sí mismo entre lo que sabe y lo que se está inventando. Por eso, todo dato importante que salga de una IA hay que verificarlo en una fuente.",
              "LOS SESGOS. Aprende de lo que le damos. Si los textos y las imágenes con los que se entrena arrastran prejuicios, los reproduce y a veces los amplifica. Hay casos documentados de sistemas de selección de personal que penalizaban a las mujeres, de reconocimiento facial que fallaba muchísimo más con caras de piel oscura, y de algoritmos de riesgo judicial con resultados desiguales por raza. Cuando se dice que un algoritmo es «objetivo» hay que preguntar siempre con qué datos aprendió y quién los eligió.",
              "LO QUE YA HA CONSEGUIDO EN CIENCIA, que es enorme y menos conocido que los chats: predecir la forma tridimensional de las proteínas —un problema que llevaba cincuenta años abierto y que es clave para diseñar medicamentos—, ayudar a descubrir antibióticos nuevos, detectar tumores en imágenes médicas, controlar el plasma de un reactor de fusión, mejorar la previsión meteorológica y clasificar millones de imágenes astronómicas.",
              "Y LAS PREGUNTAS ABIERTAS, que no son técnicas sino nuestras: qué pasa con los empleos que consisten en tareas que la máquina hace más rápido; de quién es el trabajo con el que se han entrenado estos sistemas; cómo se distingue lo verdadero cuando fabricar una voz o un vídeo falso es gratis; qué decisiones no debemos delegar nunca —una sentencia, un despido, un disparo—; y quién controla una tecnología cuyo desarrollo está concentrado en un puñado de empresas.",
              "Y una idea final que enlaza con todo este recorrido. Esta es la primera tecnología que automatiza tareas COGNITIVAS, es decir, aquello con lo que llevamos toda la historia definiéndonos. La imprenta multiplicó nuestra capacidad de difundir ideas y la máquina de vapor nuestra fuerza. Esta toca otra cosa. Y como pasó con las otras dos, el desenlace no está escrito: no es un fenómeno natural que nos ocurre, sino un conjunto de decisiones que se están tomando ahora.",
            ],
            dato: "Dato curioso: el mecanismo en el que se basan casi todos los sistemas actuales de IA generativa se describió en un artículo científico de 2017 de apenas ocho páginas, titulado «Attention is all you need» —«la atención es todo lo que necesitas»—. Ocho páginas y una idea, publicadas en abierto para que cualquiera pudiera usarlas.",
          },
        ]),
      hito("era-informacion", "ciencia-del-clima", "La ciencia que avisa: el clima", "1856-hoy",
        "",
        [
          "En 1856, la científica estadounidense Eunice Foote hizo un experimento sencillo con dos cilindros de cristal al sol, uno con aire normal y otro con dióxido de carbono, y comprobó que el segundo se calentaba más y tardaba más en enfriarse. Escribió que una atmósfera con más de ese gas daría a la Tierra una temperatura más alta. Su trabajo se leyó en un congreso —lo leyó un hombre, porque a ella no le dejaban hablar— y se olvidó durante siglo y medio.",
          "Pocos años después, John Tyndall midió con precisión qué gases atrapan el calor y cuáles no, y explicó el mecanismo: la luz del sol atraviesa la atmósfera, calienta el suelo, y el suelo devuelve ese calor en forma de radiación infrarroja que algunos gases —vapor de agua, dióxido de carbono, metano— absorben y reemiten. Sin ese efecto invernadero natural, la Tierra sería una bola helada; el problema no es que exista, es cambiar su intensidad.",
          "En 1896, el sueco Svante Arrhenius calculó a mano cuánto subiría la temperatura si se duplicara el dióxido de carbono de la atmósfera. Le salió una cifra asombrosamente cercana a la que dan hoy los superordenadores. Y lo curioso es que a él le parecía una buena noticia: pensaba que un clima más cálido favorecería las cosechas del norte de Europa.",
          "La prueba definitiva empezó en 1958, cuando Charles Keeling instaló un medidor en la cima del volcán Mauna Loa, en Hawái, lejos de cualquier ciudad, y se puso a medir la concentración de dióxido de carbono un día tras otro. La gráfica que salió de ahí, que sigue actualizándose, es una de las más importantes de la historia de la ciencia: una línea que sube sin parar, con pequeños dientes de sierra anuales —la respiración de los bosques del hemisferio norte, que absorben en verano y sueltan en invierno—.",
          "De unas 280 partes por millón antes de la industrialización se ha pasado de más de 420. Y sabemos que ese carbono viene de quemar combustibles fósiles y no de un volcán o del mar, porque los átomos de carbono de origen fósil tienen una firma isotópica distinta: es como una huella dactilar.",
          "Lo que sostiene todo esto no es un solo estudio, es la coincidencia de muchas fuentes independientes: termómetros de todo el planeta desde el siglo XIX, boyas oceánicas, satélites, retroceso de glaciares medidos con fotografías de hace un siglo, subida del nivel del mar, fechas de floración de las plantas, y burbujas de aire atrapadas en el hielo de Groenlandia y la Antártida que permiten reconstruir la atmósfera de hace cientos de miles de años.",
          "Y hay una vez en que esta ciencia funcionó ejemplarmente y conviene recordarla, porque demuestra que se puede. En los años setenta se descubrió que unos gases usados en aerosoles y neveras estaban destruyendo la capa de ozono; los satélites confirmaron el agujero sobre la Antártida; y en 1987 se firmó un tratado que prohibió esos gases en todo el mundo. La capa de ozono se está recuperando. Fue ciencia, aviso, acuerdo y solución.",
          "Ese es el papel que la ciencia ha acabado teniendo en esta historia: además de explicar el mundo, avisar. Lo que se hace con el aviso ya no es una cuestión científica: es una decisión política y moral, y por tanto de todos.",
        ],
        "Dato curioso: Eunice Foote publicó su experimento tres años antes que Tyndall, y su nombre se recuperó en 2011 gracias a la investigación de un geólogo que rebuscaba en actas antiguas. Durante 155 años, la primera persona que relacionó el dióxido de carbono con el calentamiento del planeta no figuró en ningún libro."),
      hito("era-informacion", "ciencia-no-termina", "La ciencia no termina", "",
        "",
        [
          "Después de miles de años buscando entender el mundo, descubrimos algo sorprendente.",
          "Hemos pasado de mirar el cielo con miedo a medir el universo; de creer que la Tierra era el centro de todo a comprender que somos un pequeño planeta girando alrededor de una estrella corriente.",
          "Cada civilización, cada época, añadió una pieza: los números, el método, la razón, el experimento, la duda honesta.",
          "Y sin embargo, cuanto más sabemos, más preguntas nuevas aparecen. No sabemos qué es la mayor parte del universo, cómo surgió la vida ni cómo funciona del todo nuestra propia mente.",
          "Esa es quizá la mayor lección de este viaje: la ciencia no es un montón de respuestas cerradas, sino una forma de seguir preguntando con humildad y valentía.",
          "El conocimiento no termina en un libro ni en una época. Continúa en cada persona curiosa que se atreve a preguntar «¿por qué?». También en ti.",
        ]),
    ],
  },
];
