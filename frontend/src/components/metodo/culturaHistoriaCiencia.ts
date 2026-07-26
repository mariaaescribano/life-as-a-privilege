import type { HitoHistoria, SubHito } from "./culturaHistoriaUniversal";

// ─────────────────────────────────────────────────────────────────────────
// HISTORIA DE LA CIENCIA (Cultura). Tagline: «Cómo la humanidad aprendió a
// saber — de mirar el cielo con miedo a comprender el universo».
//
// Mismo modelo que las demás Historias: ETAPAS (con intro) → SUB-HITOS (cada uno
// con su cómic: pregunta-gancho + cuerpo + dato curioso, foto + texto a la
// derecha). Estructura del índice: Prólogo + 9 etapas (de la Prehistoria a la
// era de la información).
//
// No es solo historia: es un viaje sobre cómo se conoce. La ciencia no es un
// montón de datos, sino una forma de preguntar, comprobar y —sobre todo— aceptar
// que podemos estar equivocados. Cada etapa muestra una manera nueva de mirar la
// realidad.
//
// Fotos planas en /recorrido/cultura/historiaciencia/<subKey>.png (el nombre del
// archivo = key del sub-hito). El texto se pinta con `separarFrases` (salto de
// línea tras cada punto).
//
// Momentos sin fecha (eyebrow "") = pasajes de síntesis/transición (p. ej. «El
// saber no se pierde», «La ciencia no termina»): el ComicViewer oculta el
// antetítulo cuando va vacío.
// ─────────────────────────────────────────────────────────────────────────

const foto = (_era: string, sub: string) =>
  `/recorrido/cultura/historiaciencia/${sub}.png`;

// Sub-hito con su cómic (una viñeta). `pregunta` opcional (gancho, va primero) y
// `dato` opcional (curiosidad, va al final). El `cuerpo` son los párrafos.
const hito = (
  era: string, key: string, titulo: string, fecha: string,
  pregunta: string, cuerpo: string[], dato?: string,
): SubHito => {
  const paragraphs: string[] = [];
  if (pregunta) paragraphs.push(pregunta);
  paragraphs.push(...cuerpo);
  if (dato) paragraphs.push(dato);
  return {
    key, titulo, foto: foto(era, key),
    vinetas: [{ src: foto(era, key), eyebrow: fecha, titulo, paragraphs }],
  };
};

export const HISTORIA_CIENCIA_HITOS: HitoHistoria[] = [
  // ───────────────────────────────────────────────────────────────────────
  // PRÓLOGO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "prologo",
    titulo: "¿Qué es la ciencia?",
    anio: "Antes de empezar el viaje",
    intro:
      "Antes de recorrer los grandes descubrimientos, conviene detenerse en una pregunta sencilla y enorme a la vez: ¿qué es realmente la ciencia? Solemos imaginarla como un montón de datos difíciles, fórmulas y aparatos. Pero la ciencia no es eso. Es, sobre todo, una forma de hacer preguntas y de comprobar las respuestas; una manera de distinguir lo que creemos de lo que podemos demostrar. Durante casi toda la historia, la humanidad explicó el mundo mediante mitos y autoridades a las que nadie se atrevía a discutir. La ciencia nació el día en que alguien decidió que la naturaleza podía interrogarse directamente, y que ninguna idea, por respetada que fuera, estaba por encima de las pruebas. Este recorrido no trata de memorizar descubrimientos, sino de entender algo mucho más valioso: cómo aprendió a pensar la humanidad.",
    subhitos: [
      hito("prologo", "que-es-ciencia", "¿Qué es la ciencia?", "La gran herramienta",
        "¿Sabrías explicar con tus propias palabras qué es la ciencia?",
        [
          "La ciencia no es una lista de verdades, sino un método para buscarlas. Su punto de partida es la curiosidad: mirar el mundo y preguntarse por qué las cosas ocurren como ocurren.",
          "Lo que la hace especial es que no se conforma con una explicación bonita o antigua. Exige comprobarla. Una idea científica tiene que poder ponerse a prueba y, si la realidad la contradice, hay que abandonarla.",
          "Por eso la ciencia avanza. No pretende tener razón para siempre, sino acercarse cada vez más a la verdad, corrigiendo sus propios errores.",
          "Comprender el mundo dejó de ser cosa de dioses y sacerdotes para convertirse en algo que cualquier persona, con método y honestidad, podía intentar.",
        ],
        "Dato curioso: la palabra «ciencia» viene del latín scientia, que significa simplemente «conocimiento». Pero no cualquier conocimiento: el que se puede comprobar."),
      hito("prologo", "como-se-sabe", "El método: preguntar y comprobar", "Cómo se sabe algo",
        "Cuando alguien afirma que algo es verdad, ¿cómo podemos saber si lo es?",
        [
          "El corazón de la ciencia es el método científico, una forma ordenada de buscar la verdad. Primero se observa algo, luego se propone una explicación (una hipótesis), después se diseña un experimento y por fin se comprueba el resultado.",
          "Lo esencial es que cualquiera pueda repetir ese experimento y obtener lo mismo. La verdad deja de depender de quién lo dice y pasa a depender de las pruebas.",
          "Gracias a este método, una persona humilde puede corregir a la mayor autoridad del mundo, siempre que tenga la realidad de su parte.",
          "Es una herramienta tan poderosa que ha transformado la vida humana más en cuatro siglos que en los cien mil años anteriores.",
        ]),
      hito("prologo", "ciencia-se-corrige", "La ciencia que se corrige", "La duda como motor",
        "¿Y si equivocarse fuera parte de acertar?",
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
    intro:
      "La ciencia no apareció de repente. Durante decenas de miles de años, los seres humanos observaron el mundo con muchísima atención, aunque todavía no supieran explicarlo. Aprendieron a dominar el fuego, a fabricar herramientas, a distinguir plantas útiles de venenosas y a leer el cielo para saber cuándo sembrar o cuándo llegarían las lluvias. No tenían método científico, pero sí una curiosidad incansable y una capacidad asombrosa para acumular conocimiento y transmitirlo. Aquellos saberes prácticos, mezclados con mitos y creencias, fueron el terreno del que un día brotaría la ciencia.",
    subhitos: [
      hito("antes-ciencia", "fuego-herramientas", "El fuego y las herramientas", "Prehistoria",
        "¿Cuál fue el primer gran «invento» de la humanidad?",
        [
          "Mucho antes de la escritura, nuestros antepasados lograron algo decisivo: controlar el fuego. Con él pudieron cocinar, calentarse, protegerse y alargar el día más allá de la luz del sol.",
          "También aprendieron a tallar la piedra, fabricar lanzas, agujas y hachas, y más tarde a trabajar los metales. Cada herramienta era el fruto de observar, probar y mejorar durante generaciones.",
          "No lo llamaban ciencia ni tecnología, pero ya hacían lo esencial: transformar la naturaleza usando lo que habían aprendido de ella.",
          "En aquellos gestos pacientes late el mismo impulso que millones de años después movería a los grandes científicos: entender el mundo para vivir mejor en él.",
        ],
        "Dato curioso: cocinar los alimentos permitió aprovechar mucha más energía de la comida. Algunos investigadores creen que fue clave para que nuestro cerebro pudiera crecer tanto."),
      hito("antes-ciencia", "contar-medir", "Contar y medir", "El nacimiento de los números",
        "¿Y si toda la ciencia hubiera empezado por contar ovejas?",
        [
          "A medida que aparecieron la agricultura y el comercio, hizo falta contar: cuántos animales, cuántos sacos de grano, cuántos días hasta la cosecha. Así nacieron los números.",
          "Las primeras civilizaciones desarrollaron sistemas para calcular, medir terrenos y repartir cosechas. La geometría surgió, literalmente, de medir la tierra tras las crecidas de los ríos.",
          "Las matemáticas se convirtieron en el idioma con el que la humanidad empezaría a describir el mundo con precisión, mucho más allá de lo que las palabras podían.",
          "Sin ese lenguaje de números y figuras, la ciencia que vendría después habría sido sencillamente imposible.",
        ]),
      hito("antes-ciencia", "leer-el-cielo", "Leer el cielo", "Astronomía antigua",
        "¿Por qué los pueblos antiguos miraban tanto las estrellas?",
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
    intro:
      "En Grecia ocurrió algo que cambiaría la historia del pensamiento: por primera vez, un grupo de personas intentó explicar la naturaleza sin recurrir a los dioses, usando solo la observación y la razón. Se preguntaron de qué estaba hecho el mundo, cómo se movían los astros y por qué las cosas caían al suelo. No siempre acertaron, pero inventaron algo más valioso que cualquier respuesta: la costumbre de buscar causas naturales y de demostrar las ideas con argumentos. De aquellos griegos nacieron las matemáticas como las conocemos, la física, la biología y la astronomía. Fue la infancia de la ciencia.",
    subhitos: [
      hito("grecia-ciencia", "tales-presocraticos", "Tales y los presocráticos", "≈siglo VI a. C.",
        "¿Y si el mundo pudiera explicarse sin dioses?",
        [
          "Tales de Mileto suele considerarse el primer científico y filósofo de Occidente. Su gran mérito no fue acertar, sino cambiar la pregunta: en lugar de «¿qué dios lo hizo?», preguntó «¿qué causa natural lo produce?».",
          "Él y otros pensadores, los presocráticos, buscaron el elemento del que estaría hecho todo: el agua, el aire, el fuego. Uno de ellos, Demócrito, imaginó que la materia estaba formada por partículas diminutas e indivisibles, los átomos.",
          "Se equivocaban en los detalles, pero fueron los primeros en confiar en que el universo sigue reglas comprensibles.",
          "Con ellos, explicar el mundo dejó de ser tarea de sacerdotes y pasó a ser una aventura abierta a la razón humana.",
        ],
        "Dato curioso: la palabra «átomo» viene del griego y significa «que no se puede cortar». Más de dos mil años después, la ciencia recuperó esa intuición de Demócrito."),
      hito("grecia-ciencia", "pitagoras-numeros", "Pitágoras y los números", "≈570-495 a. C.",
        "¿Y si el universo estuviera escrito en números?",
        [
          "Pitágoras y sus seguidores descubrieron que detrás de la música, la geometría y el movimiento de los astros había proporciones numéricas exactas.",
          "De ahí sacaron una idea deslumbrante: que el orden del universo podía expresarse con matemáticas. El cosmos no era caos, sino armonía medible.",
          "Aquella intuición se convertiría en uno de los cimientos de toda la ciencia: la naturaleza se describe mejor con números que con palabras.",
          "Siglos después, Galileo diría que el libro de la naturaleza está escrito en lenguaje matemático. Los pitagóricos lo presintieron los primeros.",
        ],
        "Dato curioso: los pitagóricos descubrieron que las notas musicales que suenan bien juntas siguen proporciones matemáticas muy simples. Ciencia y belleza se dieron la mano."),
      hito("grecia-ciencia", "aristoteles-ciencia", "Aristóteles", "384-322 a. C.",
        "¿Puede una sola persona intentar estudiarlo todo?",
        [
          "Aristóteles fue el gran observador de la Antigüedad. Se interesó por prácticamente todo: los animales, las plantas, el movimiento, el cielo, la lógica y la política.",
          "Defendía que el conocimiento debía empezar observando cuidadosamente la realidad, y clasificó cientos de seres vivos con un detalle que asombra todavía hoy. Por eso muchos lo consideran el primer gran naturalista.",
          "También se equivocó en cosas importantes, como creer que los objetos pesados caen más deprisa que los ligeros, un error que tardaría casi dos mil años en corregirse.",
          "Su enorme prestigio impulsó la ciencia, pero también la frenó: durante siglos se le respetó tanto que casi nadie se atrevía a comprobar si tenía razón.",
        ],
        "Dato curioso: durante toda la Edad Media a Aristóteles se le llamaba simplemente «el Filósofo», como si no pudiera existir otro mayor."),
      hito("grecia-ciencia", "euclides", "Euclides", "≈300 a. C.",
        "¿Se puede demostrar algo de forma que sea imposible discutirlo?",
        [
          "Euclides, en la ciudad de Alejandría, reunió y ordenó toda la geometría de su tiempo en una obra llamada los Elementos.",
          "Su genialidad fue el método: partió de unas pocas verdades evidentes y, a partir de ellas, demostró paso a paso cientos de teoremas, sin dejar nada al azar.",
          "Enseñó a la humanidad a razonar de forma rigurosa, encadenando conclusiones seguras. Ese modo de pensar inspiraría no solo a los matemáticos, sino a toda la ciencia.",
          "Los Elementos se estudiaron durante más de dos mil años. Pocos libros han educado la mente de tantas generaciones.",
        ],
        "Dato curioso: se dice que los Elementos de Euclides es, después de la Biblia, uno de los libros más editados y estudiados de toda la historia."),
      hito("grecia-ciencia", "arquimedes", "Arquímedes", "≈287-212 a. C.",
        "¿Cuánto se puede descubrir con solo pensar en la bañera?",
        [
          "Arquímedes fue el mayor genio científico de la Antigüedad: matemático, físico e ingeniero. Descubrió leyes fundamentales sobre las palancas, los flotadores y los volúmenes.",
          "Comprendió por qué flotan los cuerpos y calculó áreas y volúmenes con métodos que anticipaban las matemáticas modernas. También inventó ingeniosas máquinas de guerra y de riego.",
          "La leyenda cuenta que resolvió un problema mientras se bañaba y salió corriendo desnudo por la calle gritando «¡Eureka!» («¡Lo encontré!»).",
          "Unía como nadie la teoría y la práctica: pensaba a lo grande y, además, construía. Fue, en muchos sentidos, el primer gran físico de la historia.",
        ],
        "Dato curioso: se cuenta que Arquímedes afirmó: «Dadme un punto de apoyo y moveré el mundo», para explicar la fuerza de la palanca."),
      hito("grecia-ciencia", "eratostenes", "Eratóstenes mide la Tierra", "≈240 a. C.",
        "¿Se puede medir el tamaño del planeta sin salir de él?",
        [
          "Eratóstenes, bibliotecario de Alejandría, hizo algo increíble: calcular el tamaño de la Tierra usando solo la sombra de un palo, un poco de geometría y mucha inteligencia.",
          "Sabía que, un mismo día, el Sol caía totalmente vertical en una ciudad del sur mientras que en Alejandría proyectaba una sombra. Midiendo ese ángulo y la distancia entre ambas ciudades, dedujo la circunferencia del planeta.",
          "Su resultado fue asombrosamente cercano al valor real, ¡hace más de dos mil doscientos años y sin salir de una biblioteca!",
          "Fue una de las demostraciones más elegantes de la historia de que la razón y la medida pueden alcanzar lo que parece imposible.",
        ],
        "Dato curioso: gracias a cálculos como el de Eratóstenes, las personas cultas de la Antigüedad ya sabían que la Tierra era redonda. La idea del «mundo plano» es un mito posterior."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 3 — LA CIENCIA VIAJA POR EL MUNDO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "ciencia-mundo",
    titulo: "La ciencia viaja por el mundo",
    anio: "Siglos VIII – XV",
    intro:
      "Cuando el Imperio romano se derrumbó, gran parte del saber griego habría podido perderse para siempre. No ocurrió, y en buena medida se lo debemos a otras civilizaciones. En el mundo islámico, sabios de Bagdad a Córdoba tradujeron, conservaron y ampliaron el conocimiento griego, y crearon disciplinas nuevas como el álgebra. En la India se inventó una forma de contar que lo cambiaría todo, incluido el número cero. Y en China surgieron inventos que transformarían el planeta. Durante estos siglos, la ciencia no vivió en un solo lugar: viajó, se mezcló y creció, esperando el momento de regresar con fuerza a Europa.",
    subhitos: [
      hito("ciencia-mundo", "cero-india", "El cero y los números", "India, ≈siglo V-VII",
        "¿Cómo puede «nada» ser uno de los mayores inventos de la historia?",
        [
          "En la India nació el sistema de números que usamos hoy, con diez cifras y, sobre todo, con algo revolucionario: el cero como número.",
          "Puede parecer obvio, pero no lo era. El cero permitió escribir cualquier cantidad, por enorme que fuera, y hacer cálculos con una facilidad imposible con los números romanos.",
          "Este sistema viajó al mundo islámico y desde allí a Europa, donde se conoció como «números arábigos», aunque su origen estaba en la India.",
          "Sin el cero no existirían las matemáticas modernas, ni la física, ni los ordenadores. Toda la tecnología actual descansa, en el fondo, sobre esa idea de la «nada».",
        ],
        "Dato curioso: hoy los ordenadores funcionan solo con ceros y unos. Aquel invento indio del cero está, literalmente, dentro de cada aparato que usas."),
      hito("ciencia-mundo", "al-juarismi", "Al-Juarismi y el álgebra", "≈780-850",
        "¿De dónde vienen las «x» de las matemáticas?",
        [
          "Al-Juarismi fue un sabio de la Casa de la Sabiduría de Bagdad, el gran centro científico de su época. Escribió un tratado que dio nombre a una rama entera de las matemáticas: el álgebra.",
          "El álgebra permite resolver problemas usando símbolos e incógnitas, en lugar de números concretos. Es una herramienta poderosísima para describir relaciones y resolver ecuaciones.",
          "Sus obras, traducidas al latín, enseñaron a Europa a calcular con los números indios y a manejar el álgebra.",
          "Su influencia fue tan grande que su propio nombre, latinizado, dio origen a una palabra que usamos cada día en informática y matemáticas.",
        ],
        "Dato curioso: la palabra «algoritmo» procede del nombre de Al-Juarismi. Cada vez que un ordenador ejecuta un algoritmo, honra sin saberlo a aquel sabio de Bagdad."),
      hito("ciencia-mundo", "alhacen", "Alhacén y la óptica", "965-1040",
        "¿Quién fue el primero en pensar como un científico moderno?",
        [
          "Alhacén (Ibn al-Haytham) estudió la luz y la visión con una precisión sin precedentes. Demostró que vemos porque la luz rebota en los objetos y entra en nuestros ojos, y no al revés, como se creía.",
          "Pero su mayor aportación fue el método: insistía en que ninguna idea debía aceptarse sin comprobarla mediante experimentos cuidadosos y repetibles.",
          "Por eso muchos historiadores lo consideran uno de los primeros defensores del método científico, siglos antes de la Revolución Científica europea.",
          "Con él, la ciencia dio un paso decisivo: no basta con razonar bien, hay que poner las ideas a prueba frente a la realidad.",
        ],
        "Dato curioso: Alhacén escribió que quien busca la verdad debe desconfiar incluso de los grandes sabios y comprobarlo todo por sí mismo. Es casi una definición de la ciencia moderna."),
      hito("ciencia-mundo", "china-inventos", "Los grandes inventos de China", "Siglos II a. C. – XV",
        "¿Y si los inventos que cambiaron Europa vinieran de mucho más lejos?",
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
    intro:
      "Entre los siglos XVI y XVII, en apenas unas generaciones, cambió por completo la forma de entender el universo y de buscar la verdad. Se dejó de aceptar lo que decían los libros antiguos y se empezó a observar, medir y experimentar. La Tierra dejó de ser el centro del cosmos, los objetos empezaron a caer según leyes matemáticas y el cielo se llenó de mundos nuevos vistos por primera vez a través de un telescopio. Fue la Revolución Científica: el momento en que nació la ciencia moderna. Nunca la humanidad había cambiado tan deprisa su imagen del mundo.",
    subhitos: [
      hito("revolucion-cientifica", "copernico", "Copérnico", "1473-1543",
        "¿Y si no fuéramos el centro de todo?",
        [
          "Durante más de mil años se había creído que la Tierra estaba inmóvil en el centro del universo y que todo giraba a su alrededor. Parecía evidente: el Sol «sale» y «se pone» cada día.",
          "Nicolás Copérnico se atrevió a proponer lo contrario: es la Tierra la que gira alrededor del Sol, junto con los demás planetas. Su modelo explicaba mucho mejor los movimientos del cielo.",
          "La idea era tan revolucionaria que Copérnico esperó casi hasta su muerte para publicarla, temiendo el rechazo.",
          "Con él empezó a tambalearse la vieja imagen del cosmos, y la humanidad dio el primer paso para bajarse del centro del universo.",
        ],
        "Dato curioso: cuando decimos que algo produjo un «giro copernicano», nos referimos precisamente a este cambio: una idea que da la vuelta por completo a lo que se creía."),
      hito("revolucion-cientifica", "galileo", "Galileo Galilei", "1564-1642",
        "¿Qué pasa cuando apuntas un telescopio al cielo por primera vez?",
        [
          "Galileo fue uno de los primeros en usar el telescopio para observar el cielo, y lo que vio cambió la historia: montañas en la Luna, lunas girando alrededor de Júpiter, miles de estrellas nuevas.",
          "Todo aquello confirmaba que el cielo no era perfecto e inmutable, y apoyaba la idea de Copérnico de que la Tierra no era el centro de todo.",
          "Pero su mayor aportación fue el método: Galileo hacía experimentos y medía. Demostró, contra Aristóteles, que todos los cuerpos caen igual de rápido si no hay aire que los frene.",
          "Por defender que la Tierra se movía, fue juzgado y obligado a retractarse. Aun así, su forma de unir la observación, el experimento y las matemáticas lo convirtió en el padre de la física moderna.",
        ],
        "Dato curioso: cuenta la leyenda que, tras ser obligado a negar que la Tierra se movía, Galileo murmuró: «Y sin embargo, se mueve»."),
      hito("revolucion-cientifica", "kepler", "Kepler", "1571-1630",
        "¿Y si los planetas no se movieran en círculos perfectos?",
        [
          "Se creía que los astros debían moverse en círculos perfectos, porque el círculo se consideraba la figura más noble. Johannes Kepler descubrió que no era así.",
          "Estudiando durante años miles de observaciones muy precisas, comprobó que los planetas giran alrededor del Sol siguiendo elipses, no círculos, y que se mueven más deprisa cuando están más cerca del Sol.",
          "Resumió el movimiento de los planetas en unas pocas leyes matemáticas exactas, algo nunca visto.",
          "Su trabajo demostró que el cielo obedece a reglas precisas que podemos descubrir, y preparó el terreno para la gran síntesis de Newton.",
        ],
        "Dato curioso: Kepler tardó años en aceptar sus propias conclusiones, porque le costaba renunciar a la belleza del círculo. La realidad pesó más que la costumbre."),
      hito("revolucion-cientifica", "nace-metodo", "Nace el método científico", "Bacon y Descartes",
        "¿Cómo asegurarse de no engañarse a uno mismo?",
        [
          "Dos pensadores dieron forma a la nueva manera de buscar la verdad. Francis Bacon defendió que el conocimiento debe nacer de la observación y del experimento, reuniendo datos antes de sacar conclusiones.",
          "René Descartes, en cambio, insistió en la fuerza de la razón y en dudar de todo lo que no fuera absolutamente seguro. Propuso analizar cada problema dividiéndolo en partes más simples.",
          "Juntas, sus ideas dieron a la ciencia su gran herramienta: observar, plantear hipótesis, experimentar y razonar con orden, sin fiarse de la mera autoridad.",
          "A partir de entonces, una afirmación ya no valía por quién la decía, sino por las pruebas que la sostenían.",
        ],
        "Dato curioso: la frase de Descartes «pienso, luego existo» buscaba una única certeza absolutamente segura sobre la que reconstruir, desde cero, todo el conocimiento."),
      hito("revolucion-cientifica", "newton", "Isaac Newton", "1643-1727",
        "¿Y si la misma fuerza que hace caer una manzana moviera los planetas?",
        [
          "Isaac Newton logró una de las mayores hazañas de la historia del pensamiento: unir el cielo y la Tierra bajo unas mismas leyes.",
          "Comprendió que la fuerza que hace caer una manzana al suelo es la misma que mantiene a la Luna girando alrededor de la Tierra y a los planetas alrededor del Sol: la gravedad.",
          "Formuló las leyes del movimiento y la ley de la gravitación universal, que describen con matemáticas cómo se mueve casi todo lo que vemos. Además inventó, para lograrlo, nuevas matemáticas.",
          "Con Newton culminó la Revolución Científica. El universo apareció, por primera vez, como un gran mecanismo ordenado que la razón humana podía comprender.",
        ],
        "Dato curioso: Newton dijo que si había visto más lejos era «porque me subí a hombros de gigantes», reconociendo a todos los que investigaron antes que él."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 5 — LA ILUSTRACIÓN
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "ilustracion-ciencia",
    titulo: "La Ilustración: ordenar el mundo",
    anio: "Siglo XVIII",
    intro:
      "Tras la Revolución Científica, el siglo XVIII confió como nunca en la razón. Fue el Siglo de las Luces: se pensaba que, con conocimiento y método, la humanidad podía comprender el mundo y mejorar la vida. La ciencia se organizó, se llenó de academias y sociedades, y empezó a clasificarlo y medirlo todo. Nacieron la química moderna y la biología ordenada, se domó la electricidad y se soñó con reunir todo el saber humano en grandes enciclopedias. La ciencia dejaba de ser cosa de genios aislados para convertirse en una tarea común y compartida.",
    subhitos: [
      hito("ilustracion-ciencia", "linneo", "Linneo clasifica la vida", "1707-1778",
        "¿Cómo poner orden en millones de seres vivos?",
        [
          "El naturalista Carlos Linneo se propuso ordenar toda la vida conocida. Creó un sistema para clasificar plantas y animales en grupos, del más general al más concreto.",
          "Inventó además una forma sencilla de nombrar cada especie con dos palabras en latín, un sistema tan práctico que seguimos usándolo hoy en todo el mundo.",
          "Gracias a él, los científicos de cualquier país podían entenderse al hablar de un mismo ser vivo, sin confusiones.",
          "Poner orden y un lenguaje común fue un paso esencial: sin clasificar la vida, habría sido imposible estudiarla y, más tarde, comprender la evolución.",
        ],
        "Dato curioso: nuestra propia especie recibió de Linneo su nombre científico: Homo sapiens, que significa «hombre sabio»."),
      hito("ilustracion-ciencia", "lavoisier", "Lavoisier y la química moderna", "1743-1794",
        "¿Adónde va la materia cuando algo se quema?",
        [
          "Antes de Lavoisier, la química era casi magia, heredera de la alquimia. Él la convirtió en una ciencia exacta, basada en medir con precisión.",
          "Demostró que en una reacción química nada se crea ni se destruye: la materia solo se transforma. Es la ley de conservación de la masa, uno de los pilares de la química.",
          "Identificó y dio nombre a elementos como el oxígeno y explicó qué ocurre realmente cuando algo arde.",
          "Puso orden y balanza donde antes había recetas y misterio. Por eso se le considera el padre de la química moderna.",
        ],
        "Dato curioso: Lavoisier murió en la guillotina durante la Revolución Francesa. Un juez llegó a decir que «la República no necesita sabios». La ciencia perdió a uno de sus grandes genios."),
      hito("ilustracion-ciencia", "franklin-electricidad", "Franklin y la electricidad", "1706-1790",
        "¿Es posible atrapar un rayo?",
        [
          "La electricidad parecía un misterio caprichoso hasta que empezó a estudiarse con método. Benjamin Franklin demostró, con experimentos audaces, que el rayo es electricidad.",
          "Según la famosa historia, hizo volar una cometa durante una tormenta para comprobarlo, un experimento tan peligroso como revelador.",
          "A partir de esa idea inventó el pararrayos, que protege los edificios conduciendo el rayo hasta el suelo sin daño.",
          "Fue un ejemplo perfecto del espíritu de la Ilustración: entender un fenómeno temido de la naturaleza y ponerlo al servicio de la humanidad.",
        ],
        "Dato curioso: la electricidad, apenas una curiosidad de laboratorio en el siglo XVIII, se convertiría un siglo después en la fuerza que iluminaría y movería el mundo entero."),
      hito("ilustracion-ciencia", "academias-enciclopedia", "Academias y enciclopedias", "El saber compartido",
        "¿Y si el conocimiento perteneciera a todos?",
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
    intro:
      "El siglo XIX fue una explosión de grandes ideas que aún hoy sostienen la ciencia. Se comprendió que todos los seres vivos están emparentados y cambian con el tiempo, se descubrieron las reglas ocultas de la herencia, se unieron la electricidad y el magnetismo en una sola teoría, se ordenaron todos los elementos de la materia en una tabla y se entendió qué es la energía y cómo se transforma. Fue también el siglo de la Revolución Industrial, en el que la ciencia y la técnica empezaron a cambiar la vida cotidiana a una velocidad nunca vista.",
    subhitos: [
      hito("siglo-xix", "darwin", "Darwin y la evolución", "1809-1882",
        "¿De dónde vienen todos los seres vivos?",
        [
          "Charles Darwin viajó por el mundo observando la asombrosa variedad de la vida. Poco a poco llegó a una idea revolucionaria: todas las especies proceden de antepasados comunes y cambian a lo largo de enormes periodos de tiempo.",
          "El motor de ese cambio es la selección natural: los seres mejor adaptados a su entorno sobreviven y dejan más descendencia, transmitiendo sus características.",
          "Así, sin necesidad de un plan previo, la naturaleza va moldeando formas de vida cada vez más adaptadas. Es una de las ideas más poderosas de toda la ciencia.",
          "La evolución unió a todos los seres vivos, incluidos nosotros, en un mismo y gigantesco árbol de la vida.",
        ],
        "Dato curioso: Darwin retrasó más de veinte años la publicación de su teoría, consciente de lo mucho que iba a remover. Solo se decidió cuando otro naturalista llegó a la misma idea."),
      hito("siglo-xix", "mendel", "Mendel y la herencia", "1822-1884",
        "¿Por qué nos parecemos a nuestros padres?",
        [
          "Gregor Mendel, un monje apasionado por la naturaleza, cultivó y cruzó miles de plantas de guisantes en el huerto de su monasterio, anotándolo todo con paciencia.",
          "Descubrió que los rasgos se heredan siguiendo reglas matemáticas precisas, gracias a «unidades» que pasan de padres a hijos. Hoy las llamamos genes.",
          "Su trabajo, publicado en una revista modesta, pasó casi inadvertido en vida. Décadas después se redescubrió y se convirtió en la base de la genética.",
          "Mendel demostró que incluso algo tan complejo como la herencia esconde leyes claras, esperando a quien las observe con cuidado.",
        ],
        "Dato curioso: Mendel fue un adelantado a su tiempo. Su descubrimiento tuvo que esperar a que el mundo estuviera preparado para entenderlo."),
      hito("siglo-xix", "maxwell", "Maxwell y el electromagnetismo", "1831-1879",
        "¿Y si la luz, la electricidad y el magnetismo fueran lo mismo?",
        [
          "James Clerk Maxwell logró unir en una sola teoría dos fuerzas que parecían distintas: la electricidad y el magnetismo. Demostró que son dos caras de un mismo fenómeno, el electromagnetismo.",
          "Sus ecuaciones predijeron algo asombroso: que existían ondas electromagnéticas viajando por el espacio, y que la propia luz era una de ellas.",
          "De aquella teoría nacerían la radio, la televisión, el radar, el móvil y casi toda la tecnología de comunicaciones actual.",
          "Fue una de las grandes «unificaciones» de la ciencia: descubrir que dos cosas diferentes son, en el fondo, la misma.",
        ],
        "Dato curioso: gracias a las ecuaciones de Maxwell entendemos que la luz visible, las ondas de radio y los rayos X son todos el mismo fenómeno, solo que con distinta energía."),
      hito("siglo-xix", "mendeleyev", "Mendeléyev y la tabla periódica", "1834-1907",
        "¿Se pueden ordenar todos los ladrillos del universo?",
        [
          "Dmitri Mendeléyev ordenó todos los elementos químicos conocidos según sus propiedades y creó la tabla periódica, uno de los mapas más útiles de la ciencia.",
          "Lo más impresionante es que su tabla tenía huecos: Mendeléyev predijo que existían elementos aún no descubiertos y describió cómo serían.",
          "Años después, esos elementos aparecieron, tal como los había anunciado. Una teoría que predice lo desconocido es una teoría poderosa.",
          "La tabla periódica muestra que toda la materia del universo está hecha de un número limitado de elementos, combinados de infinitas maneras.",
        ],
        "Dato curioso: se cuenta que Mendeléyev concibió la estructura de la tabla periódica tras darle muchas vueltas, casi como quien resuelve un enorme rompecabezas."),
      hito("siglo-xix", "termodinamica", "La energía y la termodinámica", "Descubrir la energía",
        "¿Qué tienen en común el calor, el movimiento y la vida?",
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
    intro:
      "A comienzos del siglo XX, justo cuando parecía que la física ya lo tenía casi todo resuelto, el mundo se puso patas arriba. Se descubrió que el tiempo y el espacio no son absolutos, que la materia y la energía son intercambiables y que, en lo más pequeño, la naturaleza se comporta de formas asombrosas e incluso desconcertantes. La imagen ordenada y predecible del universo de Newton dio paso a otra mucho más extraña y fascinante. Fue la mayor revolución en física desde Newton, y de ella salieron tanto maravillas tecnológicas como el arma más terrible jamás creada.",
    subhitos: [
      hito("fisica-moderna", "curie", "Marie Curie y la radiactividad", "1867-1934",
        "¿Y si algunos átomos brillaran con una energía oculta?",
        [
          "Marie Curie descubrió que ciertos materiales emiten por sí solos una radiación misteriosa: la radiactividad. Aquello reveló que dentro del átomo se escondía una energía inmensa.",
          "Junto a su marido descubrió nuevos elementos, como el radio y el polonio, trabajando en condiciones durísimas y con medios muy escasos.",
          "Fue la primera persona en ganar dos premios Nobel, en dos ciencias distintas, en una época en la que a las mujeres apenas se les permitía investigar.",
          "Sus hallazgos abrieron la puerta a comprender el interior del átomo y a usos tan importantes como el tratamiento del cáncer con radiación.",
        ],
        "Dato curioso: Marie Curie manipuló materiales radiactivos sin conocer sus peligros. Sus cuadernos siguen siendo tan radiactivos que se guardan en cajas especiales."),
      hito("fisica-moderna", "einstein", "Einstein y la relatividad", "1879-1955",
        "¿Y si el tiempo no pasara igual para todos?",
        [
          "Albert Einstein transformó nuestra idea del universo. Demostró que el tiempo y el espacio no son fijos: pueden estirarse y encogerse según cómo nos movamos o según la gravedad.",
          "Descubrió también que la masa y la energía son la misma cosa, resumido en la fórmula más famosa de la ciencia: la energía es igual a la masa por la velocidad de la luz al cuadrado.",
          "Su teoría de la gravedad describió esta fuerza como una curvatura del propio espacio y el tiempo provocada por los objetos con masa.",
          "Sus ideas, comprobadas una y otra vez, cambiaron para siempre nuestra visión del cosmos y hoy son esenciales incluso para que funcione el GPS de tu móvil.",
        ],
        "Dato curioso: cerca de un objeto muy masivo, el tiempo pasa un poquito más despacio. No es ciencia ficción: se ha medido con relojes reales."),
      hito("fisica-moderna", "cuantica", "El mundo cuántico", "Planck, Bohr, Heisenberg",
        "¿Y si en lo más pequeño la naturaleza rompiera todas las reglas?",
        [
          "Al estudiar el interior de los átomos, los físicos descubrieron un mundo que desafía el sentido común: el mundo cuántico. Allí, la energía viene en pequeños paquetes y las partículas se comportan también como ondas.",
          "Pioneros como Max Planck, Niels Bohr y Werner Heisenberg comprendieron que, en esa escala diminuta, no se puede predecir con certeza lo que hará una partícula, solo calcular probabilidades.",
          "Es una física extrañísima, pero funciona con una precisión asombrosa y ha sido comprobada miles de veces.",
          "Sin la física cuántica no existirían los ordenadores, los móviles, los láseres ni buena parte de la tecnología que usamos cada día.",
        ],
        "Dato curioso: la física cuántica es tan contraria a la intuición que el propio Einstein nunca llegó a aceptarla del todo, pese a haber ayudado a fundarla."),
      hito("fisica-moderna", "atomo-energia", "El átomo: poder y peligro", "El poder del átomo",
        "¿Qué ocurre cuando la ciencia libera una fuerza que no puede controlar?",
        [
          "Al comprender el interior del átomo, los científicos descubrieron que podía liberarse una cantidad de energía inmensa rompiendo o uniendo sus núcleos.",
          "Esa energía tuvo dos caras opuestas. Por un lado, las centrales nucleares, capaces de producir enormes cantidades de electricidad. Por otro, la bomba atómica, el arma más destructiva jamás creada.",
          "En 1945, dos bombas atómicas arrasaron ciudades enteras y mostraron al mundo el terrible poder que la ciencia había puesto en manos humanas.",
          "Fue un aviso que aún resuena: el conocimiento da poder, pero no dice cómo usarlo. Esa decisión, moral y humana, sigue siendo nuestra.",
        ],
        "Dato curioso: muchos de los científicos que ayudaron a crear la bomba atómica dedicaron después su vida a advertir contra el peligro de las armas nucleares."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 8 — DESCIFRAR LA VIDA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "descifrar-vida",
    titulo: "Descifrar la vida",
    anio: "Siglo XX",
    intro:
      "Si el siglo XX empezó revolucionando la física, lo terminó revolucionando la biología. Los científicos descubrieron la molécula que guarda las instrucciones de todos los seres vivos, el ADN, y aprendieron a leer su lenguaje. Por primera vez, la humanidad podía asomarse al código secreto de la vida: entender cómo se transmite, cómo se copia y cómo, a veces, se equivoca. De aquellos hallazgos nacería la biología moderna, capaz hoy no solo de leer ese código, sino incluso de corregirlo.",
    subhitos: [
      hito("descifrar-vida", "adn", "El ADN: la molécula de la vida", "1953",
        "¿Dónde se guardan las instrucciones para construir un ser vivo?",
        [
          "En 1953 se descubrió la estructura del ADN, la molécula que contiene las instrucciones para formar y hacer funcionar a todos los seres vivos, desde una bacteria hasta un ser humano.",
          "Tiene forma de doble hélice, como una escalera retorcida. Sus escalones forman un código que se puede copiar con enorme fidelidad cada vez que una célula se divide.",
          "Ese descubrimiento explicó de golpe cómo se transmite la herencia de la que hablaba Mendel: los genes están escritos en el ADN.",
          "Fue uno de los mayores hitos de la historia: por fin podíamos leer, letra a letra, el manual de instrucciones de la vida.",
        ],
        "Dato curioso: si estirásemos todo el ADN de una sola célula humana, mediría cerca de dos metros. Y llevas billones de células dentro de ti."),
      hito("descifrar-vida", "rosalind-franklin", "Rosalind Franklin", "1920-1958",
        "¿Cuántos descubrimientos ocultan un nombre olvidado?",
        [
          "El descubrimiento de la forma del ADN no habría sido posible sin Rosalind Franklin, una científica brillante experta en fotografiar moléculas con rayos X.",
          "Fue su famosa imagen, conocida como «Fotografía 51», la que reveló la forma de doble hélice del ADN con una claridad decisiva.",
          "Durante mucho tiempo su papel quedó en la sombra, mientras otros recibían casi todo el reconocimiento. Murió joven, sin llegar a ver del todo valorada su aportación.",
          "Su historia recuerda que la ciencia la hacen muchas personas, y que a lo largo de la historia el mérito de muchas mujeres fue silenciado o ignorado.",
        ],
        "Dato curioso: hoy la «Fotografía 51» de Rosalind Franklin se considera una de las imágenes más importantes de la historia de la ciencia."),
      hito("descifrar-vida", "editar-vida", "Leer y editar la vida", "Del genoma a hoy",
        "¿Y si pudiéramos corregir los errores escritos en nuestros genes?",
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
    intro:
      "En la segunda mitad del siglo XX, la ciencia dio a luz una nueva revolución: la de la información. Nacieron los ordenadores, máquinas capaces de calcular y procesar datos a una velocidad imposible para cualquier ser humano. Después llegó internet, que conectó al mundo entero, y más tarde la inteligencia artificial, capaz de aprender por sí misma. En pocas décadas, la información se convirtió en el gran motor de nuestra época. Y así llegamos hasta hoy, con la ciencia avanzando más rápido que nunca y con la misma pregunta de siempre por delante: ¿qué haremos con todo lo que sabemos?",
    subhitos: [
      hito("era-informacion", "turing", "Alan Turing y el ordenador", "1912-1954",
        "¿Puede una máquina pensar?",
        [
          "Alan Turing imaginó, antes de que existieran los ordenadores, una máquina capaz de seguir instrucciones para resolver cualquier problema que pudiera describirse con reglas. Fue la idea que está detrás de todos los ordenadores actuales.",
          "Durante la Segunda Guerra Mundial, ayudó a descifrar los mensajes secretos del enemigo con máquinas de cálculo, acortando la guerra y salvando incontables vidas.",
          "También se preguntó algo que aún debatimos: ¿podría una máquina llegar a pensar como un ser humano?",
          "Está considerado uno de los padres de la informática. Su forma de pensar dio origen al mundo digital en el que hoy vivimos.",
        ],
        "Dato curioso: Turing fue tratado de forma injusta y cruel en su época por su orientación sexual. Décadas después, su país le pidió perdón oficialmente y hoy se le honra como un héroe."),
      hito("era-informacion", "internet", "La red que conectó el mundo", "Desde 1969",
        "¿Qué ocurre cuando todos los ordenadores del mundo pueden hablar entre sí?",
        [
          "A finales del siglo XX, los ordenadores empezaron a conectarse entre sí formando una red mundial: internet. Por primera vez, la información podía viajar en segundos de un extremo a otro del planeta.",
          "Con la web, cualquier persona pudo acceder a una cantidad de conocimiento que antes no cabía en las mayores bibliotecas del mundo.",
          "Internet transformó la forma de trabajar, aprender, comunicarnos y relacionarnos, con enormes ventajas y también nuevos problemas.",
          "El sueño ilustrado de compartir el saber con toda la humanidad se hizo realidad a una escala que ningún enciclopedista habría imaginado jamás.",
        ],
        "Dato curioso: gran parte de la tecnología de internet nació de la colaboración entre científicos que querían compartir sus datos y descubrimientos más fácilmente."),
      hito("era-informacion", "inteligencia-artificial", "La inteligencia artificial", "Siglo XXI",
        "¿Y si las máquinas pudieran aprender solas?",
        [
          "La inteligencia artificial son programas capaces de aprender a partir de enormes cantidades de datos, en lugar de seguir solo instrucciones fijas.",
          "Hoy pueden reconocer imágenes, traducir idiomas, conducir vehículos, ayudar a descubrir medicinas o mantener una conversación. Aprenden a base de ejemplos, un poco como aprendemos las personas.",
          "Es una herramienta poderosísima que ya está transformando la ciencia, el trabajo y la vida cotidiana a gran velocidad.",
          "Y trae consigo grandes preguntas: ¿cómo usarla bien?, ¿qué decisiones podemos dejarle?, ¿cómo asegurarnos de que beneficie a todos? Responderlas será uno de los grandes retos de tu generación.",
        ]),
      hito("era-informacion", "ciencia-no-termina", "La ciencia no termina", "",
        "Después de miles de años buscando entender el mundo, descubrimos algo sorprendente.",
        [
          "Hemos pasado de mirar el cielo con miedo a medir el universo; de creer que la Tierra era el centro de todo a comprender que somos un pequeño planeta girando alrededor de una estrella corriente.",
          "Cada civilización, cada época, añadió una pieza: los números, el método, la razón, el experimento, la duda honesta.",
          "Y sin embargo, cuanto más sabemos, más preguntas nuevas aparecen. No sabemos qué es la mayor parte del universo, cómo surgió la vida ni cómo funciona del todo nuestra propia mente.",
          "Esa es quizá la mayor lección de este viaje: la ciencia no es un montón de respuestas cerradas, sino una forma de seguir preguntando con humildad y valentía.",
          "El conocimiento no termina en un libro ni en una época. Continúa en cada persona curiosa que se atreve a preguntar «¿por qué?». También en ti.",
        ]),
    ],
  },
];
