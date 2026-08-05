import type { HitoHistoria, SubHito } from "./culturaHistoriaUniversal";
import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// HISTORIA DE LAS RELIGIONES (Cultura). Mismo modelo de dos niveles que la
// Historia Universal: ETAPAS (con texto de intro) → SUB-HITOS (cada uno con su
// cómic: pregunta-gancho + cuerpo + dato curioso, foto + texto a la derecha).
// Fotos en /recorrido/cultura/historiareligion/<archivo>.webp (carpeta plana).
// El nombre de archivo NO coincide con la clave del sub-hito: se traduce con
// el mapa FOTOS de abajo (clave del sub-hito → nombre corto del .webp). Si una
// clave no está en el mapa, se usa la propia clave como nombre de archivo.
// El texto se pinta con `separarFrases` (salto de línea tras cada punto).
//
// CÓMO SE CUENTA (importante al añadir contenido): no se trata de contar qué
// creía cada pueblo, sino de que se ENTIENDA por qué lo creía y qué problema
// humano estaba resolviendo. Por eso cada momento sigue el esquema:
//     pregunta gancho  →  cuerpo (qué pasó y POR QUÉ)  →  «Dato curioso: …»
// y, cuando el tema da para más (los mandamientos de verdad, el Talmud, los
// cinco pilares, los sacrificios aztecas, la caza de brujas…), se le añaden
// páginas «Profundiza» con el parámetro `extras`: viñetas EXTRA del mismo
// momento (misma foto), no círculos nuevos de la línea del tiempo.
// ─────────────────────────────────────────────────────────────────────────

// clave del sub-hito → nombre del archivo .webp en la carpeta plana.
const FOTOS: Record<string, string> = {
  // I · Cuando la naturaleza era sagrada
  neolitica: "neolitica",
  gea: "gea",
  animismo: "animismo",
  chamanes: "chamanes",
  // II · Cuando nacieron las civilizaciones… y sus dioses
  ur: "ur",
  mesopotamia: "mesopotamia",
  egipto: "egipto",
  akhenaton: "akhenaton",
  // III · Los dioses cuentan historias
  "mitologia-griega": "griega",
  "religion-romana": "romana",
  "grecia-conquista-roma": "conquista",
  "mitologia-hindu": "hindu",
  "mitologia-china": "china",
  sintoismo: "sintoismo",          // FALTA la foto (se pinta el marcador)
  "religiones-africanas": "africa",
  "america-precolombina": "america",
  // IV · La gran revolución espiritual
  abraham: "abraham",
  moises: "moises",
  zoroastro: "zoroastro",
  judaismo: "judaismo",
  hinduismo: "hinduismo",
  krishna: "krishna",
  buda: "buda",
  budismo: "budismo",
  // V · La búsqueda de la sabiduría
  confucio: "confucio",
  confucianismo: "confucianismo",
  laotse: "laotse",
  taoismo: "taoismo",
  // VI · Un Dios para toda la humanidad
  "jesus-nazaret": "jesus",
  "pablo-tarso": "pablo",
  cristianismo: "cristianismo",
  "mahoma-islam": "mahoma",
  // VII · Cuando una fe se divide
  "sunies-chiies": "sunies",
  "gran-cisma": "cisma",
  "reforma-protestante": "reforma",
  sijismo: "sijismo",              // FALTA la foto (se pinta el marcador)
  // VIII · Un mundo, muchas creencias
  "expansion-religiones": "expansion",
  "mundo-conectado": "conectado",
  secularizacion: "secularizacion", // FALTA la foto (se pinta el marcador)
  viaje: "viaje",
};

const foto = (_era: string, sub: string) =>
  `/recorrido/cultura/historiareligion/${FOTOS[sub] ?? sub}.webp`;

/** Página «Profundiza» de un momento: una viñeta más, con la misma foto. */
interface Profundiza {
  titulo: string;
  cuerpo: string[];
  dato?: string;
}

// Sub-hito con su cómic: viñeta principal (`pregunta` gancho + `cuerpo` +
// `dato` curioso) y, opcionalmente, páginas «Profundiza» detrás.
const hito = (
  era: string, key: string, titulo: string, fecha: string,
  pregunta: string, cuerpo: string[], dato?: string, extras?: Profundiza[],
): SubHito => {
  const src = foto(era, key);
  const paragraphs: string[] = [];
  if (pregunta) paragraphs.push(pregunta);
  paragraphs.push(...cuerpo);
  if (dato) paragraphs.push(dato);
  const vinetas: Vineta[] = [{ src, eyebrow: fecha, titulo, paragraphs }];
  (extras ?? []).forEach((e) => {
    vinetas.push({
      src,
      eyebrow: "Profundiza",
      titulo: e.titulo,
      paragraphs: e.dato ? [...e.cuerpo, e.dato] : e.cuerpo,
    });
  });
  return { key, titulo, foto: src, vinetas };
};

export const HISTORIA_RELIGIONES_HITOS: HitoHistoria[] = [
  {
    key: "naturaleza-sagrada",
    titulo: "Cuando la naturaleza era sagrada",
    anio: "Prehistoria",
    intro:
      "Antes de los templos y los dioses, la naturaleza era el gran misterio. Durante cientos de miles de años, los seres humanos no conocían la ciencia, la escritura ni las grandes civilizaciones. Cada tormenta, cada eclipse, cada nacimiento o cada muerte eran acontecimientos difíciles de comprender. La naturaleza decidía si una tribu sobrevivía o desaparecía, por lo que era lógico pensar que detrás de ella existían fuerzas invisibles con voluntad propia. En esta primera etapa todavía no existían religiones organizadas ni templos. En su lugar, nuestros antepasados desarrollaron creencias muy sencillas basadas en la observación del mundo que los rodeaba. Los bosques, los ríos, las montañas y los animales no eran simples elementos del paisaje: eran seres sagrados con los que había que convivir y a los que era necesario respetar. Con el tiempo aparecieron personas consideradas capaces de comunicarse con esos espíritus, realizar rituales o interpretar las señales de la naturaleza. Sin saberlo, estaban dando origen a las primeras formas de espiritualidad de la historia.",
    subhitos: [
      hito("naturaleza-sagrada", "neolitica", "La Revolución Neolítica", "≈10.000 a. C.",
        "¿Qué ocurrió cuando el ser humano dejó de seguir a la naturaleza y empezó a transformarla?",
        [
          "Durante la mayor parte de la Prehistoria vivimos como cazadores y recolectores, moviéndonos detrás de los animales y de los frutos de temporada. Se poseía lo que se podía cargar y no había forma de acumular nada, ni riqueza ni templos.",
          "Todo cambió cuando algunos grupos descubrieron que podían sembrar las plantas que antes recogían y criar los animales que antes cazaban. Al quedarse quietos aparecieron las aldeas, los graneros, la propiedad de la tierra y la herencia.",
          "Y aquí está la clave religiosa: si un agricultor produce más comida de la que su familia necesita, otras personas pueden dedicarse a otra cosa. Nacen así los primeros oficios especializados, entre ellos uno decisivo: el de las personas encargadas del culto. Por primera vez en la historia hubo gente que se dedicaba a tiempo completo a tratar con lo sagrado.",
          "El cambio también transformó las preguntas. El cazador dependía del azar del día; el agricultor depende del ciclo: de que llueva en su momento, de que la semilla germine, de que la cosecha no se pierda. Su religión se volvió calendario, ofrenda y ritual repetido, obsesionada con la fertilidad de la tierra, con el sol, con la lluvia y con las estaciones.",
          "Y añadió una idea nuevísima: enterrar a los muertos en el suelo del que brota la comida, mirar cómo la semilla se entierra y renace, y empezar a pensar la muerte como un ciclo y no como un final. Casi todas las religiones agrarias posteriores tienen algún dios que muere y resucita.",
        ],
        "Dato curioso: este cambio fue tan importante que muchos historiadores lo consideran la mayor revolución de la historia humana, incluso por encima de la Revolución Industrial.",
        [
          {
            titulo: "Los primeros templos son ANTERIORES a la agricultura",
            cuerpo: [
              "Durante décadas se dio por hecho el orden lógico: primero la agricultura, luego las aldeas, luego el excedente, luego los templos. En 1994, la excavación de Göbekli Tepe, en el sureste de Turquía, dio la vuelta a esa secuencia.",
              "Allí, hacia el 9500 a. C. —más de seis mil años antes de Stonehenge y de las pirámides—, alguien levantó recintos circulares con pilares de piedra en forma de T de hasta cinco metros y varias toneladas, tallados con relieves de zorros, jabalíes, serpientes, escorpiones, buitres y brazos humanos.",
              "Lo asombroso es quién lo hizo: cazadores-recolectores. No había agricultura, ni cerámica, ni metal, ni animales domésticos, ni una ciudad alrededor. Se calcula que hacían falta cientos de personas coordinadas, alimentadas durante semanas, y en el yacimiento aparecen restos de enormes cantidades de caza y de cerveza de cereal silvestre: banquetes.",
              "Eso permite invertir la hipótesis, y es una de las ideas más provocadoras de la arqueología actual: puede que no nos volviéramos sedentarios y luego construyéramos santuarios, sino que la necesidad de reunirnos periódicamente en un lugar sagrado y de alimentar a esa multitud fuera uno de los empujones que llevaron a domesticar el trigo. Es decir, quizá primero nos reunimos a creer y después aprendimos a cultivar.",
              "Y hay un detalle desconcertante: cada cierto tiempo enterraban deliberadamente los recintos con tierra y escombro y construían otros encima. No los abandonaron: los sepultaron.",
              "En Çatalhöyük, también en Turquía, unos milenios después, la religión ya estaba dentro de las casas: cráneos de toro incrustados en las paredes, pinturas de buitres y de cacerías, figuras de una mujer sentada entre dos felinos y, bajo el suelo de las viviendas, los muertos de la familia, con el cráneo a veces recuperado, recubierto de yeso y pintado, para seguir teniéndolo presente.",
            ],
            dato: "Dato curioso: en aquellas casas se convivía literalmente con los antepasados: se dormía encima de ellos. La idea de que los muertos siguen formando parte de la casa, tan repetida después en China, África, Roma o México, es más antigua que la escritura.",
          },
          {
            titulo: "Piedras que miran al sol",
            cuerpo: [
              "Entre el 5000 y el 2000 a. C., por toda Europa atlántica, aparecen miles de dólmenes, menhires y grandes tumbas colectivas de piedra. Son las primeras arquitecturas monumentales del continente y son religiosas.",
              "Muchas están orientadas con una precisión que no puede ser casualidad. En Newgrange, en Irlanda (hacia el 3200 a. C.), un corredor de diecinueve metros conduce a una cámara interior que permanece a oscuras todo el año… salvo unos minutos en el amanecer del solsticio de invierno, cuando un rayo de sol entra por una abertura y la ilumina entera.",
              "En Stonehenge, el eje del monumento apunta al amanecer del solsticio de verano y al atardecer del de invierno. Sus piedras azules más pequeñas se trajeron desde Gales, a más de 200 kilómetros.",
              "Eso significa dos cosas. Primera: aquellas comunidades observaban el cielo con rigor durante generaciones, apuntaban y transmitían el conocimiento; astronomía y religión nacen juntas y tardarán milenios en separarse. Y segunda: eran capaces de organizar un trabajo colectivo enorme sin reyes, sin escritura y sin ciudades, solo por acuerdo y creencia compartida.",
              "El día más corto del año, cuando el sol parece morir y luego vuelve a subir, ha sido el momento sagrado por excelencia en casi todo el hemisferio norte. Muchas fiestas de diciembre —la Saturnalia romana, el nacimiento del Sol Invicto, el Yule nórdico y, más tarde, la Navidad— se colocaron ahí por el mismo motivo: es el punto en que la luz gana.",
            ],
            dato: "Dato curioso: para ver la iluminación del solsticio dentro de Newgrange se celebra hoy un sorteo público al que se presentan decenas de miles de personas cada año, para unas pocas plazas. Cinco mil años después, seguimos queriendo estar ahí ese día.",
          },
        ]),
      hito("naturaleza-sagrada", "gea", "Gea y las «mujeres mágicas»", "Prehistoria",
        "¿Por qué las primeras figuras sagradas que esculpimos fueron cuerpos de mujer?",
        [
          "Entre las obras de arte más antiguas de la humanidad hay unas doscientas figuritas femeninas talladas en piedra, hueso o marfil, repartidas desde Francia hasta Siberia. Las llamamos «Venus paleolíticas», y algunas tienen más de 30.000 años.",
          "Casi todas comparten rasgos: cuerpos amplios, pechos y vientre marcados, y en cambio cara, manos y pies apenas insinuados. No pretendían ser retratos de nadie: representaban algo.",
          "El motivo más probable es el más elemental. En un mundo donde la mitad de los niños moría antes de crecer y donde el parto mataba a muchísimas mujeres, la capacidad de dar vida era el mayor misterio y el mayor poder imaginable. Que un cuerpo pudiera crear otro cuerpo, y alimentarlo después, era literalmente la diferencia entre que un grupo continuara o desapareciera.",
          "Se han propuesto otras explicaciones, y probablemente convivieron varias: amuletos para el embarazo y el parto, símbolos de abundancia en tiempos de escasez, objetos de aprendizaje para jóvenes, o incluso autorretratos hechos por mujeres mirándose el propio cuerpo desde arriba, lo que explicaría las proporciones.",
          "Miles de años más tarde, los griegos llamaron Gea a la Tierra madre de la que todo nace, los romanos Tellus, los andinos Pachamama, los hindúes Bhūmi. No hay una línea directa entre aquellas figuritas y estas diosas, pero sí una intuición que reaparece por todo el planeta: la tierra que produce alimento se piensa como madre.",
          "Y conviene decir lo que NO se puede afirmar: no hay pruebas de que existiera una religión universal de la Diosa ni sociedades matriarcales generalizadas, como se ha popularizado a veces. Sabemos que esculpieron cuerpos de mujer con enorme cuidado; lo que exactamente creían, no lo sabemos.",
        ],
        "Dato curioso: la Venus de Willendorf, de hace unos 25.000 años y once centímetros de alto, conserva restos de ocre rojo: estuvo pintada. Y la más antigua conocida, la de Hohle Fels (Alemania), tiene entre 35.000 y 40.000 años: es más vieja que las pinturas de Altamira."),
      hito("naturaleza-sagrada", "animismo", "Animismo", "Desde la Prehistoria",
        "¿Y si el mundo entero estuviera vivo y pudiera ofenderse?",
        [
          "Las primeras comunidades no pensaban que solo las personas tuvieran alma. Para ellas, la montaña, el río, el árbol, el animal y la tormenta tenían voluntad, intención y capacidad de responder. A esa forma de mirar el mundo la llamamos animismo, de anima, «aliento» o «alma».",
          "No era ingenuidad: era una manera muy eficaz de ordenar la convivencia con el entorno del que dependía la vida. Si el río es alguien, no puedes envenenarlo. Si el bosque es alguien, no puedes vaciarlo. Si el animal que cazas es alguien, tienes que pedirle permiso, agradecérselo y no matar más de lo necesario.",
          "De ahí vienen prácticas que se repiten en pueblos sin ningún contacto entre sí: pedir perdón al animal cazado, devolver al agua el primer pez, no talar ciertos árboles, dejar una parte de la cosecha sin recoger, prohibir la caza en determinadas épocas —que es, exactamente, una veda—.",
          "El animismo no es una religión concreta ni una etapa superada: es una manera de relacionarse con lo vivo que sigue presente hoy en cientos de pueblos indígenas de la Amazonia, África, Siberia, Australia, Japón o América del Norte, muchas veces mezclada con el cristianismo o el islam.",
          "Los aborígenes australianos, con la cultura viva más antigua conocida, entienden el territorio como una red de caminos cantados: cada accidente del paisaje forma parte de un relato que hay que recordar y recitar. El mapa, la ley, la genealogía y la religión son la misma cosa.",
          "Y ha vuelto por una puerta inesperada: la jurídica. En 2017, Nueva Zelanda reconoció al río Whanganui como persona jurídica con derechos propios, a petición del pueblo maorí, y desde entonces se han declarado derechos de ríos, lagos y bosques en Ecuador, Colombia, India, Bangladés y España (el Mar Menor). La idea más antigua del mundo —que la naturaleza es alguien y no algo— está entrando en los códigos legales del siglo XXI.",
        ],
        "Dato curioso: la palabra «animismo» la puso en circulación un antropólogo británico en 1871 para describir lo que consideraba la forma más primitiva de religión. Hoy el término se sigue usando, pero aquella jerarquía se ha abandonado: no es religión «de primera fase», es otra forma de entender qué cuenta como persona."),
      hito("naturaleza-sagrada", "chamanes", "Chamanes", "Prehistoria",
        "Si existen espíritus… ¿quién puede hablar con ellos, y por qué esa persona?",
        [
          "En cuanto una comunidad cree que hay fuerzas invisibles que deciden la caza, la lluvia y la enfermedad, aparece una necesidad práctica: alguien tiene que negociar con ellas. Ese especialista es el chamán, y es probablemente el primer oficio religioso de la historia.",
          "Su trabajo era muy concreto y muy amplio: curar enfermos, encontrar la causa de una desgracia, localizar la caza, pedir lluvia, acompañar a los muertos, resolver conflictos, recordar los mitos y transmitir el saber sobre plantas y animales. Era a la vez médico, psicólogo, juez, historiador y sacerdote.",
          "El método era entrar en trance, y para eso se usaban técnicas que aparecen sorprendentemente parecidas en continentes distintos: el tambor con un ritmo monótono, la danza prolongada, el ayuno, el frío, el aislamiento, el humo y, en algunas culturas, plantas psicoactivas.",
          "La lógica de su viaje también se repite: el chamán deja su cuerpo, sube o baja a otro mundo, se encuentra con espíritus, negocia con ellos, recupera algo que se había perdido —muchas veces «el alma» del enfermo— y regresa a contarlo. Esa estructura de viaje y regreso está en la base de miles de relatos posteriores, incluidos los descensos al infierno de la mitología clásica.",
          "Y hay un rasgo llamativo: casi nunca se elegía el puesto. En muchísimas culturas el chamán es alguien marcado por una crisis previa —una enfermedad grave, un ataque, un accidente, visiones, un rayo—, alguien que ha estado cerca de morir y ha vuelto. La autoridad venía justamente de haber cruzado y regresado.",
          "Su eficacia no era solo simbólica. Manejaban un conocimiento real de plantas medicinales y de huesos, y el ritual mismo tenía efecto: hoy sabemos que la expectativa, el acompañamiento y el sentido reducen de forma medible el dolor y la ansiedad. Aquellos rituales trabajaban con el efecto placebo tres mil generaciones antes de que se le pusiera nombre.",
        ],
        "Dato curioso: la palabra viene de šaman, de la lengua evenki de Siberia, y significa aproximadamente «el que sabe». Y no era un oficio de hombres: en Bad Dürrenberg (Alemania) se excavó la tumba de una mujer de hace unos 9.000 años enterrada con un ajuar ritual extraordinario, y en Israel otra de hace 12.000 años rodeada de caparazones de tortuga, un ala de águila y una cola de vaca."),
    ],
  },
  {
    key: "civilizaciones-dioses",
    titulo: "Cuando nacieron las civilizaciones… y sus dioses",
    anio: "≈4000-1000 a. C.",
    intro:
      "Las primeras ciudades cambiaron para siempre la forma de creer. Durante miles de años, las pequeñas aldeas fueron creciendo hasta convertirse en auténticas ciudades. Allí donde antes solo había familias o tribus, ahora vivían miles de personas que necesitaban leyes, gobernantes y una forma de mantener unida a la sociedad. La religión también cambió. Los espíritus de los bosques y las montañas fueron sustituidos por dioses con nombre, templos, sacerdotes y ceremonias. Los gobernantes afirmaban gobernar por voluntad divina y las ciudades competían no solo por el poder, sino también por la protección de sus propios dioses. Por primera vez, la religión dejó de ser únicamente una forma de explicar la naturaleza para convertirse también en una herramienta de organización política y social.",
    subhitos: [
      hito("civilizaciones-dioses", "ur", "Ur y las primeras ciudades", "≈3800-3000 a. C.",
        "¿Qué le pasa a la religión cuando dejas de conocer a todos tus vecinos?",
        [
          "En una aldea de cincuenta personas todo el mundo se conoce, y eso basta para que nadie robe: el control social es el vecino. En una ciudad de cincuenta mil, no. Hacen falta leyes, jueces, castigos… y una creencia compartida que convenza a miles de desconocidos de que forman parte de lo mismo.",
          "Ahí aparece el templo. En Ur, en Uruk, en Eridú, el edificio más grande, más caro y más visible de la ciudad no era el palacio: era el zigurat, una montaña artificial de ladrillo levantada en una llanura sin montañas, para que el dios tuviera dónde bajar.",
          "Y no era solo un lugar de culto: era la institución económica central. El templo poseía enormes extensiones de tierra y de ganado, empleaba a miles de personas, almacenaba el grano, prestaba semilla, fijaba pesos y medidas y llevaba la contabilidad. De hecho, la escritura se inventó ahí, para anotar las entregas al templo.",
          "Eso creó algo nuevo en la historia: una clase sacerdotal profesional, con formación, archivos, calendario propio y un poder que no dependía de la fuerza física. Y creó también la fórmula política que se repetiría durante cinco mil años: el gobernante manda porque los dioses lo han elegido, y el sacerdote confirma que es cierto.",
          "El dios de cada ciudad era, además, una identidad. Perder una guerra significaba que tu dios había perdido, y el vencedor podía llevarse la estatua del dios derrotado como el mayor de los botines: era secuestrar el alma de la ciudad.",
        ],
        "Dato curioso: según la tradición bíblica, Abraham nació en Ur antes de emprender el viaje que daría origen al pueblo de Israel. Es decir: la tradición hace salir al primer monoteísmo justamente de la capital mundial del politeísmo urbano."),
      hito("civilizaciones-dioses", "mesopotamia", "Religión mesopotámica", "≈3500-500 a. C.",
        "¿Para qué crearon los dioses a los seres humanos?",
        [
          "Los mesopotámicos tenían una respuesta clarísima, y no es halagadora: nos crearon para trabajar en su lugar. Su relato de la creación cuenta que los dioses estaban agotados de excavar canales y de cultivar, así que modelaron al ser humano con barro para que hiciera el trabajo y les llevara la comida en forma de ofrendas.",
          "Esa idea explica toda su religión. El culto no era una relación de amor, era un contrato de mantenimiento: los sacerdotes lavaban, vestían, perfumaban y alimentaban la estatua del dios cada día, literalmente, con dos comidas; y el dios, a cambio, protegía la ciudad, mandaba lluvia y ganaba las guerras.",
          "Su panteón era enorme y ordenado como una corte: Anu, el cielo; Enlil, el viento y las decisiones; Enki, el agua dulce y la astucia; Inanna o Ishtar, el amor y la guerra a la vez; Marduk, el dios de Babilonia, que en el poema Enuma Elish derrota a la diosa del caos primordial y construye el mundo con su cuerpo.",
          "También inventaron algo que nos acompaña todavía: la obsesión por leer el futuro. Como los dioses decidían y no siempre avisaban, desarrollaron una ciencia de la interpretación de señales —el hígado de las ovejas sacrificadas, el vuelo de los pájaros, los sueños, los eclipses— y, sobre todo, el movimiento de los astros. La astrología nació en Mesopotamia, y los signos del zodiaco que hoy salen en las revistas son babilonios.",
          "Su idea del más allá, en cambio, era desoladora: un lugar bajo tierra, oscuro y polvoriento, igual para el rey y para el campesino, sin premio ni castigo. Por eso su literatura es tan moderna en un punto: el Poema de Gilgamesh cuenta la historia de un hombre que, al morir su amigo, se lanza a buscar la inmortalidad, no la encuentra y tiene que aprender a vivir sabiendo que va a morir.",
        ],
        "Dato curioso: la Epopeya de Gilgamesh contiene un relato del diluvio asombrosamente parecido al de la Biblia: un hombre avisado por un dios, un barco enorme, los animales, el agua que lo cubre todo y un pájaro enviado a buscar tierra. Cuando en 1872 un joven investigador del Museo Británico descifró esa tablilla, se quedó tan impresionado que, según sus compañeros, empezó a correr por la sala.",
        [
          {
            titulo: "Todo lo que sigue vivo de aquella religión",
            cuerpo: [
              "Mesopotamia desapareció, pero muchas de sus piezas se quedaron en circulación, y algunas están en tu vida cotidiana:",
              "EL ZODIACO. La división del cielo en doce constelaciones a lo largo del recorrido del sol es babilónica, igual que los nombres de la mayoría de los signos. También heredamos su manía de contar en base 60: las 60 horas, los 60 minutos, los 360 grados del círculo.",
              "LA SEMANA Y EL DESCANSO. La costumbre de marcar ciertos días como peligrosos o impropios para el trabajo, ligada a las fases de la luna, aparece en Mesopotamia y está en el origen remoto de la semana y del descanso periódico.",
              "EL DILUVIO. La versión bíblica de Noé recoge un relato que ya estaba escrito mil años antes en la zona, en varias versiones. Y no es plagio en el sentido moderno: los pueblos de una misma región compartían y reescribían sus relatos, como hoy se reescriben las películas.",
              "EL PARAÍSO Y LA TORRE. El Edén con sus cuatro ríos remite al paisaje entre el Tigris y el Éufrates, y la Torre de Babel es, con casi total seguridad, el recuerdo de un zigurat babilónico, probablemente el gran templo de Marduk. Hasta el nombre encaja: Babel es Babilonia.",
              "LA ASTROLOGÍA Y LA ADIVINACIÓN. La idea de que el cielo influye en el destino personal, los horóscopos, la interpretación de sueños y buena parte del vocabulario de la suerte vienen de allí, pasando por Grecia y por el mundo islámico.",
              "LOS DEMONIOS Y LOS AMULETOS. La creencia en seres invisibles que causan enfermedades, y el uso de amuletos y fórmulas para alejarlos, está documentada en cientos de tablillas. Su demonio Pazuzu, el del viento y las pestes, se hizo famoso en el siglo XX porque una película de terror lo convirtió en el espíritu de «El exorcista».",
              "Y ALGO MÁS IMPORTANTE QUE TODO ESO: la idea de que la ley viene de lo divino y por tanto obliga también al rey. Cuando Hammurabi se hizo grabar recibiendo las leyes del dios del sol, estaba inventando un argumento que después usarían Moisés, los profetas, los papas y las constituciones: que hay una justicia por encima de quien manda.",
            ],
            dato: "Dato curioso: los mesopotámicos escribían cartas a sus dioses personales para quejarse cuando les iba mal, con un tono que hoy reconocería cualquiera: «te he hecho ofrendas, te he sido fiel, ¿por qué me has abandonado?». Es el mismo lamento que aparecerá luego en los Salmos y en el libro de Job.",
          },
        ]),
      hito("civilizaciones-dioses", "egipto", "Religión egipcia", "≈3100-30 a. C.",
        "¿Qué ocurre después de la muerte? Egipto dedicó tres mil años a responder.",
        [
          "Mientras Mesopotamia se preocupaba por el poder de sus ciudades y no esperaba nada del más allá, Egipto construyó la religión más centrada en la muerte de toda la Antigüedad. Y lo hizo, curiosamente, por amor a la vida: querían que continuara.",
          "Creían que la persona estaba formada por varias partes: el cuerpo, el ka (la fuerza vital, que necesita seguir recibiendo alimento), el ba (algo parecido al alma, que puede moverse) y el nombre, que había que seguir pronunciando. Si todas esas piezas se conservaban, se seguía existiendo.",
          "De ahí la momificación, un procedimiento de unos setenta días que retiraba los órganos, deshidrataba el cuerpo con sal y lo vendaba con amuletos entre las capas. El corazón se dejaba dentro, porque era la sede de la conciencia y hacía falta para el juicio; el cerebro se descartaba porque no le veían utilidad.",
          "Y de ahí también la parte más interesante: el juicio. El difunto se presentaba ante Osiris y declaraba no haber hecho el mal —no he robado, no he mentido, no he matado, no he hecho llorar a nadie, no he desviado el agua del canal de mi vecino—. Su corazón se pesaba en una balanza contra la pluma de Maat, la verdad y el orden justo del mundo. Anubis vigilaba el fiel, Thot anotaba el resultado y, si el corazón pesaba más que la verdad, un monstruo se lo comía: eso era la única muerte definitiva.",
          "Esto es una novedad enorme en la historia de las religiones. Por primera vez, lo que decide tu destino eterno no son los sacrificios que has pagado ni tu posición social, sino cómo te has comportado con los demás. La religión se conecta con la moral.",
          "El faraón era la pieza que unía todo: Horus vivo, hijo del sol, encargado no de ser bueno sino de mantener a Maat en su sitio para que el universo no se descompusiera. Cuando moría se convertía en Osiris y su hijo pasaba a ser Horus. Ese relato sostuvo un Estado durante tres milenios.",
        ],
        "Dato curioso: el Libro de los Muertos no era un libro sagrado como la Biblia, sino un manual práctico: una colección de fórmulas para superar cada prueba del camino, que se compraba hecho y donde el escriba rellenaba el nombre del difunto en los huecos. Hasta el más allá tenía formularios.",
        [
          {
            titulo: "Cómo se trataba a un dios egipcio",
            cuerpo: [
              "Un templo egipcio no era una iglesia: no había asamblea de fieles ni sermones. Era la CASA del dios, y funcionaba como la casa de un gran señor.",
              "En el fondo, en la sala más oscura y pequeña, vivía la estatua del dios. Cada mañana los sacerdotes rompían el sello de la puerta, la despertaban con himnos, la lavaban, la vestían con lino limpio, la maquillaban, la perfumaban y le servían comida y bebida. Al atardecer se repetía el proceso a la inversa y se volvía a sellar la puerta.",
              "La comida ofrecida no se tiraba: después de que el dios «tomara su esencia», se repartía entre el personal del templo. Miles de personas vivían literalmente de eso.",
              "Al pueblo no se le dejaba entrar. Su religión se vivía fuera: en las grandes procesiones, en las que la estatua salía en una barca portada a hombros y recorría la ciudad varias veces al año. Ese era el momento de acercarse, ver al dios de lejos… y consultarle.",
              "Porque existía un sistema de oráculos que nos ha llegado documentado: la gente hacía preguntas de sí o no —«¿me han robado el buey los vecinos del norte?»— y se interpretaba el movimiento de la barca al pasar. Se conservan actas de juicios resueltos así. El dios era, en la práctica, un tribunal de apelación.",
              "Y en casa se rendía culto a otras cosas: a los antepasados, a dioses domésticos protectores del parto y del sueño, a amuletos. La religión oficial era del faraón y del clero; la religión de la gente era mucho más cercana y práctica.",
              "El clero era además una carrera con turnos: muchos sacerdotes servían por periodos y el resto del tiempo hacían su vida normal, y en los grandes templos hubo también sacerdotisas, músicas y cantoras con cargos propios.",
            ],
            dato: "Dato curioso: los animales sagrados no eran adorados en sí mismos, sino como manifestaciones de un dios. Aun así, el asunto llegó lejos: se han encontrado cementerios con cientos de miles de gatos, ibis, cocodrilos y halcones momificados, y existía toda una industria de cría de animales para venderlos como ofrenda.",
          },
        ]),
      hito("civilizaciones-dioses", "akhenaton", "Akhenatón y Nefertiti", "≈1350 a. C.",
        "¿Y si todos esos dioses fueran en realidad uno solo? El primer intento de la historia.",
        [
          "Egipto llevaba mil setecientos años con cientos de dioses y un clero riquísimo, sobre todo el de Amón en Tebas, que había acumulado tierras, oro y una influencia política enorme. Entonces subió al trono un faraón que decidió borrarlo todo.",
          "Akhenatón proclamó que solo existía Atón, el disco solar, y que su luz —no una estatua, no un animal, no un mito— era la única manifestación de lo divino. Cerró los templos de los demás dioses, cortó sus ingresos, mandó picar el nombre de Amón de los monumentos e incluso, en algunas inscripciones, eliminó la palabra «dioses» en plural.",
          "Y para empezar de cero, construyó una capital nueva en un lugar virgen del desierto, Ajetatón, «el horizonte de Atón», donde se instaló con su esposa Nefertiti y sus hijas.",
          "Su reforma tenía un rasgo revolucionario: en su religión no había mitos, no había imágenes del dios con forma humana o animal, y no había un más allá lleno de pruebas. Solo el sol que da vida a todo lo que existe, y un intermediario único para hablar con él: el propio faraón. Eso último es la clave política: quitando dioses, quitaba sacerdotes y concentraba todo el poder religioso en su persona.",
          "También cambió el arte, y de forma inconfundible: cuerpos alargados, vientres redondos, escenas familiares en las que el faraón y la reina aparecen jugando con sus hijas o besándose, algo impensable en la rigidez anterior.",
          "Fracasó por completo. Su reforma dejó sin trabajo y sin ingresos a miles de personas, canceló las fiestas populares que estructuraban el año y sustituyó los dioses cercanos de la gente por una abstracción que solo el rey podía tratar. A su muerte, su sucesor —un niño llamado Tutankamón, que cambió su nombre para incluir a Amón— restauró los cultos antiguos, se abandonó la ciudad nueva y los faraones siguientes borraron el nombre de Akhenatón de las listas de reyes, como si nunca hubiera existido.",
          "Y aun así, gracias a ese olvido lo tenemos: sus monumentos desmontados se reutilizaron como relleno de otras construcciones, donde se conservaron intactos, y su ciudad abandonada no fue reocupada, así que es el yacimiento que mejor nos cuenta cómo se vivía en el Egipto antiguo.",
        ],
        "Dato curioso: el Gran Himno a Atón, que se hizo grabar en las tumbas de Amarna, describe a un dios que crea la vida en todos los pueblos y da de comer a cada criatura, y su estructura y sus imágenes se parecen tanto al Salmo 104 de la Biblia que se estudian juntos desde hace un siglo. Freud llegó a especular con que el monoteísmo de Moisés venía de aquí; la mayoría de los historiadores no lo acepta, pero la coincidencia sigue siendo asombrosa."),
    ],
  },
  {
    key: "dioses-historias",
    titulo: "Los dioses cuentan historias",
    anio: "≈2000 a. C.-500 d. C.",
    intro:
      "Los dioses dejaron de ser fuerzas invisibles para parecerse a los propios seres humanos. Mientras en Oriente surgían religiones preocupadas por la moral, la salvación o el equilibrio interior, las antiguas civilizaciones de Grecia y Roma desarrollaron una forma muy distinta de entender lo divino. Sus dioses no eran perfectos ni estaban alejados del mundo. Amaban, sentían celos, discutían, se enamoraban, se vengaban y cometían errores igual que cualquier persona. A través de sus aventuras, los griegos y los romanos intentaban explicar el origen del universo, los fenómenos naturales y, sobre todo, la compleja naturaleza humana. Sus mitos han inspirado durante más de dos mil años la literatura, la pintura, la escultura, el teatro y el cine, convirtiéndose en algunas de las historias más famosas jamás contadas.",
    subhitos: [
      hito("dioses-historias", "mitologia-griega", "Mitología griega", "≈1200-146 a. C.",
        "¿Por qué unos dioses que mienten, engañan y se vengan resultaron tan útiles?",
        [
          "Los dioses griegos son escandalosamente humanos: Zeus es infiel y mentiroso, Hera es vengativa, Ares disfruta con la sangre, Afrodita provoca desastres por celos. No son modelos morales, y eso desconcierta a quien viene de las religiones monoteístas.",
          "Pero tenían una función precisa: explicar el mundo tal como es, no como debería ser. Si la vida es injusta, si el inocente sufre, si el bueno pierde y el mediocre triunfa, un dios único y perfectamente bueno se vuelve difícil de explicar. En cambio, un puñado de dioses poderosos, parciales y peleados entre sí describe bastante bien la experiencia de estar vivo.",
          "Por eso su mitología es una gigantesca colección de casos humanos. Prometeo roba el fuego para dárselo a los hombres y es castigado eternamente: es la historia del progreso y de su precio. Pandora abre la caja y salen todos los males, quedando dentro la esperanza. Ícaro se acerca demasiado al sol. Narciso se enamora de su reflejo. Sísifo empuja una piedra que siempre vuelve a caer. Todo eso no son cuentos: son formas de nombrar la ambición, la culpa, el deseo, la vanidad, el trabajo absurdo.",
          "Su religión práctica, además, no se parecía nada a la nuestra. No había libro sagrado, ni dogma, ni credo que aceptar, ni clero profesional, ni obligación de creer nada en particular. Lo que había era ritual público: procesiones, fiestas, juegos y sacrificios, que eran en realidad barbacoas comunitarias —se quemaba para los dioses la parte no comestible y el pueblo se repartía la carne, que muchos solo probaban en esas ocasiones—.",
          "Lo importante era participar. Se podía dudar de los mitos —los filósofos lo hacían abiertamente— pero no negarse a los ritos de la ciudad: eso era impiedad, y podía costar la vida, como le costó a Sócrates.",
          "Y su idea de fondo es de una dureza magnífica: por encima de los dioses está el destino, y ni Zeus puede cambiarlo. En la tragedia griega el héroe no cae por ser malo, sino por un error de cálculo, por exceso de orgullo o simplemente porque le tocaba. Esa es la aportación griega a la historia de las ideas religiosas: mirar de frente que no hay garantías.",
        ],
        "Dato curioso: los Juegos Olímpicos eran una ceremonia religiosa en honor a Zeus. Durante su celebración se declaraba una tregua sagrada que permitía a los atletas y a los espectadores viajar por territorios en guerra, y funcionaron durante casi doce siglos, hasta que un emperador cristiano los prohibió a finales del siglo IV.",
        [
          {
            titulo: "Los misterios y el oráculo: lo que sí se tomaban muy en serio",
            cuerpo: [
              "Junto a la religión oficial de la ciudad existían dos instituciones que tocaban lo que a la gente le importaba de verdad: qué pasa al morir y qué debo hacer con mi vida.",
              "LOS MISTERIOS DE ELEUSIS. Cada año, miles de personas caminaban en procesión desde Atenas hasta el santuario de Eleusis para ser iniciadas en un rito secreto centrado en el mito de Deméter y su hija Perséfone, raptada por el dios de los muertos y devuelta a la tierra durante media parte del año: el mito de la semilla que baja y vuelve a brotar.",
              "Lo que ocurría dentro está prohibido contarlo, y aquí viene lo asombroso: nadie lo contó. El secreto se mantuvo durante casi dos mil años, con pena de muerte para quien lo revelara, y hoy solo sabemos que había ayuno, una bebida ritual, oscuridad, algo que se mostraba y una experiencia que cambiaba a quien la vivía. Autores como Píndaro o Cicerón, gente poco dada a exagerar, escribieron que después de aquello dejaban de temer a la muerte.",
              "Y era una institución sorprendentemente abierta: podían iniciarse hombres y mujeres, ciudadanos y extranjeros, libres y esclavos. En una sociedad tan jerárquica, ese detalle es enorme.",
              "EL ORÁCULO DE DELFOS. Era el consultorio más influyente del mundo antiguo. Ciudades enteras preguntaban antes de fundar una colonia, declarar una guerra o cambiar sus leyes, y particulares preguntaban por su matrimonio o su negocio. Respondía la Pitia, una sacerdotisa que entraba en trance sentada sobre una grieta del suelo.",
              "Sus respuestas eran célebremente ambiguas, y eso era parte del sistema: al rey Creso le dijeron que si cruzaba el río destruiría un gran imperio, y destruyó el suyo. A los atenienses, ante la invasión persa, les prometió la salvación de «un muro de madera», y Temístocles convenció a la asamblea de que se refería a los barcos. El oráculo no adivinaba: obligaba a interpretar, y la responsabilidad de la decisión seguía siendo tuya.",
              "En el templo había dos frases grabadas que resumen media filosofía griega: «conócete a ti mismo» y «nada en exceso».",
              "Y HUBO OTRA CORRIENTE, minoritaria pero decisiva: el orfismo, que enseñaba que el alma es inmortal, que está atrapada en el cuerpo, que se reencarna y que se puede purificar con una vida de disciplina. Esas ideas pasaron a Pitágoras, de ahí a Platón, y de Platón al cristianismo. La idea occidental del alma inmortal separada del cuerpo viene, en buena parte, de aquellos grupos.",
            ],
            dato: "Dato curioso: en el siglo XX se descubrió que la roca bajo el templo de Delfos tiene fallas por las que pueden escapar gases de hidrocarburos, entre ellos etileno, capaz de producir estados alterados de conciencia. La explicación química no quita mérito a la institución: durante mil años, media Grecia tomó sus decisiones importantes allí.",
          },
        ]),
      hito("dioses-historias", "religion-romana", "Religión romana", "≈753 a. C.-476 d. C.",
        "¿Y si la religión no fuera cuestión de fe, sino de cumplir el procedimiento exacto?",
        [
          "Para un romano, la religión no consistía en creer ni en sentir: consistía en hacer las cosas bien. Los ritos tenían que ejecutarse con las palabras exactas, en el orden exacto y en la fecha exacta. Si un sacerdote se equivocaba en una sílaba, la ceremonia entera se repetía desde el principio.",
          "La lógica era contractual, y ellos la resumían así: doy para que des. Ofrezco un sacrificio, cumplo mi parte, y espero que el dios cumpla la suya. Se llegaban a hacer votos por escrito con condiciones: si ganamos esta batalla, te construiré un templo.",
          "Por eso su religión estaba tan pegada al Estado. Los cargos religiosos eran cargos públicos, ocupados por políticos: el pontifex maximus era el sacerdote supremo y, a la vez, una posición de poder que ocuparon César y luego todos los emperadores. Antes de una votación, de una batalla o de una asamblea se consultaba a los augures, que interpretaban el vuelo de las aves, o a los harúspices, que leían las entrañas de los animales sacrificados. Si las señales eran malas, se aplazaba, y eso se usó políticamente sin ningún disimulo.",
          "En casa había otra religión, más íntima y probablemente más sentida: los lares y penates, los espíritus protectores del hogar, con su pequeño altar, y el culto a los antepasados de la familia, cuyas máscaras se guardaban y se sacaban en los funerales. El padre de familia era el sacerdote de su propia casa.",
          "Y eran extraordinariamente tolerantes con los dioses ajenos, por puro pragmatismo: cuando conquistaban una ciudad, invitaban a sus dioses a cambiar de bando y les daban templo en Roma. Cuantos más dioses de tu parte, mejor.",
          "Pero esa tolerancia tenía un límite muy claro: el orden público y la lealtad. Prohibieron los cultos que consideraban peligrosos —las bacanales, los druidas—, y persiguieron a judíos y cristianos no por sus creencias, sino porque se negaban a participar en el culto común, lo que a sus ojos era deslealtad hacia la ciudad.",
        ],
        "Dato curioso: los nombres de los planetas —Mercurio, Venus, Marte, Júpiter, Saturno, Neptuno— y de varios días de la semana en las lenguas latinas vienen directamente de sus dioses. Cada vez que dices «martes» estás nombrando al dios de la guerra.",
        [
          {
            titulo: "Las vestales, las Saturnales y otras herencias",
            cuerpo: [
              "LAS VESTALES. Seis sacerdotisas, elegidas de niñas entre las mejores familias, cuya única obligación era mantener encendido el fuego sagrado de la diosa Vesta, que representaba la continuidad misma de Roma. Servían treinta años en castidad obligatoria.",
              "En compensación tenían privilegios que ninguna otra mujer romana tenía: podían poseer y gestionar su propio patrimonio, hacer testamento, testificar sin jurar, moverse por la ciudad en carruaje y ser acompañadas por un lictor. Su palabra podía indultar a un condenado que se cruzara con ellas.",
              "Y el castigo, si el fuego se apagaba o si rompían el voto, era acorde con lo que se creía en juego: azotes, o ser enterrada viva en una cámara subterránea, para no derramar la sangre de una consagrada. Duró más de mil años, hasta que el emperador Teodosio apagó ese fuego en el año 394.",
              "LAS SATURNALES. En diciembre, alrededor del solsticio, Roma celebraba varios días de fiesta en honor a Saturno en los que se paraba el trabajo, se decoraban las casas con ramas verdes, se intercambiaban regalos, se comía y bebía en exceso… y se invertían los papeles: los esclavos se sentaban a la mesa y eran servidos por sus amos, y se elegía un «rey» de burlas que daba órdenes absurdas.",
              "No es que la Navidad «sea» las Saturnales, pero cuando el cristianismo fijó el nacimiento de Jesús el 25 de diciembre —una fecha que no aparece en los Evangelios— eligió justo el día en que el imperio celebraba el nacimiento del Sol Invicto, en plena temporada festiva. La estructura de fiesta de invierno, con regalos, luces y comida, se conservó.",
              "OTRAS HERENCIAS. El vocabulario: «religión» viene probablemente de religare, atar, o de relegere, releer con escrúpulo; «superstición» era para ellos el exceso de temor a lo divino, frente a la religio, que era el cumplimiento correcto; «pontífice» significa literalmente «constructor de puentes»; «candidato», «censo», «tribu», «augurio», «inaugurar» y «desastre» (mala estrella) son todos suyos.",
              "Y una herencia estructural: la Iglesia católica heredó el mapa administrativo del imperio (las diócesis eran divisiones territoriales romanas), su lengua, su derecho, su calendario de fiestas y hasta el título de su sacerdote supremo, pontifex maximus, que sigue apareciendo hoy en las inscripciones del Vaticano.",
            ],
            dato: "Dato curioso: los romanos tenían una costumbre llamada evocatio: antes de asaltar una ciudad, invitaban formalmente a sus dioses a abandonarla y prometían adorarlos en Roma. Ganar una guerra incluía fichar al dios del rival.",
          },
        ]),
      hito("dioses-historias", "grecia-conquista-roma", "Grecia conquista a Roma… sin ejércitos", "Siglos II-I a. C.",
        "¿Puede una civilización conquistar a otra sin ganar una sola batalla?",
        [
          "Cuando Roma conquistó Grecia, muchos pensaron que la cultura griega desaparecería. Ocurrió exactamente lo contrario.",
          "Los romanos eran conscientes de ser mejores ingenieros, soldados y administradores, y de ser peores en casi todo lo demás. Admiraban sin disimulo la filosofía, el teatro, la escultura, la medicina y la literatura griegas, así que en lugar de destruirlas las importaron en masa.",
          "El proceso fue muy material: se trajeron estatuas griegas como botín y se copiaron a miles (la mayor parte de las esculturas «griegas» que hoy vemos en los museos son copias romanas); se compraron esclavos griegos cultos como preceptores de los hijos de la élite; se aprendió griego como segunda lengua obligatoria; y los jóvenes ricos iban a estudiar a Atenas o a Rodas, como hoy se va a hacer un máster al extranjero.",
          "Con los dioses hicieron lo mismo: identificaron a los suyos con los griegos y adoptaron sus mitos. Zeus pasó a ser Júpiter, Poseidón Neptuno, Ares Marte, Afrodita Venus, Hera Juno. Los relatos que hoy conocemos como «mitología clásica» son en buena medida versiones romanas de historias griegas, y el libro que más ha transmitido esos mitos a Occidente es «Las metamorfosis», escrito en latín por Ovidio.",
          "Y hubo una consecuencia religiosa de largo alcance: también importaron la filosofía griega, y con ella el estoicismo y el epicureísmo, que ofrecían a los romanos cultos algo que su religión ritual no daba —una respuesta sobre cómo vivir, cómo morir y qué es la virtud—. Cuando la religión oficial se quedó sin capacidad de consolar, la gente ya estaba buscando en otro sitio: en la filosofía, en los cultos orientales de Isis o de Mitra… y, poco después, en el cristianismo.",
          "El poeta Horacio lo resumió en una frase que se hizo célebre: «Grecia conquistada conquistó a su feroz vencedor.»",
        ],
        "Dato curioso: los Evangelios se escribieron en griego, no en latín ni en arameo. La lengua del pueblo derrotado se había convertido en el idioma común del Mediterráneo oriental, y por eso el cristianismo se difundió en griego durante sus primeros siglos."),
      hito("dioses-historias", "mitologia-hindu", "La mitología hindú", "Desde la Antigüedad",
        "¿Cómo puede un solo universo contener trescientos millones de dioses y ser, a la vez, uno?",
        [
          "Esta es la pregunta que más desconcierta a quien viene de una religión de un solo Dios, y la respuesta hindú es elegante: todos esos dioses son formas, máscaras, aspectos de una única realidad última llamada Brahman, que no tiene forma ni nombre y que es demasiado grande para pensarla directamente.",
          "Por eso puedes rezar a Ganesha, a Shiva o a la Diosa sin contradicción, igual que puedes mirar el mar desde distintas playas. Un dicho védico muy citado lo dice así: la verdad es una, los sabios la llaman de muchas maneras.",
          "Las tres funciones principales las representa la Trimurti: Brahma crea, Vishnú conserva y Shiva destruye. Y ojo con esto último, porque es una de las ideas más potentes del hinduismo: la destrucción no es el mal, es la condición para que algo nuevo pueda existir. Shiva se representa bailando dentro de un círculo de fuego, y ese baile es el ritmo del universo.",
          "Vishnú, cuando el mundo se desordena demasiado, baja en forma de avatar. Sus encarnaciones más queridas son Rama, el rey justo del Ramayana, y Krishna. También aparecen Ganesha, el dios con cabeza de elefante que quita los obstáculos y al que se reza antes de empezar cualquier cosa; Hanuman, el mono fiel y valiente; Lakshmi, la abundancia; Saraswati, el conocimiento y la música; y Durga o Kali, la energía femenina que destruye demonios, temible y protectora a la vez.",
          "Sus dos grandes epopeyas son la memoria colectiva de la India: el Ramayana y el Mahabharata, que con unos cien mil versos es varias veces más largo que la Ilíada y la Odisea juntas. No son solo relatos religiosos: son la fuente de la ética, el teatro, la danza, el cine y los dibujos animados de mil doscientos millones de personas.",
          "Y hay una diferencia de fondo con las religiones abrahámicas: aquí el tiempo no es una línea que empieza en una creación y acaba en un juicio, sino un ciclo inmenso que se repite. El universo nace, dura, se disuelve y vuelve a nacer, una y otra vez.",
        ],
        "Dato curioso: la palabra «avatar», que hoy usamos para el muñeco que nos representa en internet, es sánscrita y significa «descenso»: el dios que baja y toma cuerpo. Cada vez que eliges un avatar estás usando, sin saberlo, un término teológico hindú.",
        [
          {
            titulo: "Un tiempo de miles de millones de años",
            cuerpo: [
              "Casi todas las religiones antiguas manejan tiempos cortos: unos cuantos miles de años desde la creación. La India hizo algo distinto y sorprendente: contó en escalas astronómicas.",
              "Según sus textos, el universo pasa por cuatro edades sucesivas que van degradándose, y el conjunto de las cuatro forma un ciclo que se repite. Mil de esos ciclos forman un «día de Brahma», que dura 4.320 millones de años. Y luego viene una noche igual de larga, en la que todo se disuelve, y después otro día.",
              "Detente un segundo en esa cifra: 4.320 millones de años. La ciencia calcula hoy la edad de la Tierra en unos 4.540 millones de años y la del universo en unos 13.800 millones. Es la única cosmología antigua que se mueve en el mismo orden de magnitud que la astronomía moderna. Nadie estaba midiendo nada; simplemente eligieron pensar en grande.",
              "Ese tiempo cíclico cambia el sentido de todo. Si el universo se repite infinitamente, la salvación no puede consistir en llegar a un buen final, porque no hay final. La liberación (moksha) consiste en SALIR del ciclo, no en ganarlo.",
              "Y explica la actitud ante la muerte: si el alma vuelve a nacer, morir no es el desastre absoluto que es para una religión de una sola vida; el desastre es no aprender nada y tener que volver a empezar. De ahí la importancia del karma, que no es un castigo divino sino una ley impersonal, como la gravedad: toda acción tiene consecuencias, y esas consecuencias configuran tu próxima vida.",
              "También explica algo cultural: la enorme tolerancia hindú hacia la diversidad religiosa. Si hay tiempo infinito y caminos infinitos, es razonable pensar que otras religiones son otras sendas hacia lo mismo. Gandhi lo formuló así, y de esa idea hizo una herramienta política.",
              "La parte que la propia India ha tenido que combatir es otra: el sistema de castas, un orden social hereditario justificado durante siglos con argumentos religiosos, que dejaba abajo a los intocables. Está prohibido por la Constitución de 1950 —redactada por Ambedkar, un jurista nacido en una casta oprimida que acabó convirtiéndose al budismo con cientos de miles de seguidores—, pero sigue pesando socialmente.",
            ],
            dato: "Dato curioso: en el templo de Chidambaram, en el sur de la India, la estatua de Shiva bailando (Nataraja) representa la creación y la destrucción del universo en un solo gesto. Hay una copia de esa figura en la entrada del CERN, el gran laboratorio de física de partículas de Ginebra, regalada por la India: los físicos vieron en ese baile una metáfora de lo que ocurre en sus aceleradores.",
          },
        ]),
      hito("dioses-historias", "mitologia-china", "La mitología china", "Antigüedad",
        "¿Y si el cielo pudiera despedir a un emperador?",
        [
          "La mitología china está poblada de dioses, dragones, inmortales y héroes fundadores. Uno de sus relatos cuenta que el gigante Pangu separó el cielo de la tierra al despertar del caos, y que al morir su cuerpo se convirtió en las montañas, los ríos, el viento y las estrellas. Otro cuenta que la diosa Nüwa modeló a los seres humanos con barro amarillo y reparó el cielo cuando se rompió.",
          "Pero la idea religiosa más influyente de China no es un dios: es el Cielo (Tian), entendido como un orden moral impersonal. Y de ahí sale un concepto político demoledor: el Mandato del Cielo.",
          "Funciona así: el emperador gobierna porque el Cielo se lo ha encargado, pero ese encargo es CONDICIONAL. Si gobierna mal, si hay hambre, corrupción, inundaciones o desórdenes, significa que el Cielo le ha retirado el mandato… y entonces rebelarse contra él no es traición, es cumplir la voluntad celestial.",
          "Eso es exactamente lo contrario del derecho divino europeo, que hacía intocable al rey. En China, la religión oficial contenía en su interior el argumento legítimo para derrocar a un gobernante, y se usó cada vez que cayó una dinastía, durante dos mil años.",
          "La segunda pieza es el culto a los antepasados, que sigue vivo. Los muertos de la familia no se van: siguen necesitando atención y siguen influyendo en la fortuna de los vivos. De ahí las tablillas con sus nombres en casa, las ofrendas de comida, el papel quemado y la fiesta anual de limpiar las tumbas. Eso convierte a la familia, y no al templo, en el centro religioso.",
          "Y la tercera es la más práctica: en China no se elige religión, se acumulan. Una misma persona puede honrar a sus antepasados como manda el confucianismo, pedir salud a una divinidad taoísta, encender incienso en un templo budista y consultar el calendario para elegir el día de una boda, sin ver ninguna contradicción. Cada tradición cubre un terreno distinto.",
        ],
        "Dato curioso: mientras en Europa el dragón es un monstruo que hay que matar, en China es un ser benéfico asociado al agua, la lluvia y la fortuna, y sigue siendo uno de los símbolos nacionales. Un mismo animal imaginario, dos significados opuestos, según de qué dependa tu cosecha: del ganado que el dragón se come o de la lluvia que el dragón trae."),
      hito("dioses-historias", "sintoismo", "Sintoísmo", "Desde la Antigüedad japonesa",
        "¿Cómo se puede ser sintoísta al nacer, cristiano al casarse y budista al morir?",
        [
          "En Japón, esa frase no es un chiste: describe una práctica habitual. El bebé se presenta en un santuario sintoísta, muchas bodas se celebran con estética cristiana y los funerales suelen ser budistas. Para entenderlo hay que dejar de pensar que una religión es una pertenencia exclusiva.",
          "El sintoísmo —«el camino de los kami»— es la religión originaria de Japón, y no tiene fundador, ni dogma, ni libro con mandamientos, ni promesa de salvación. Lo que tiene son los kami: presencias sagradas que habitan en montañas, cascadas, árboles, rocas, animales, antepasados y también en personas destacadas. Se dice que son ocho millones, cifra que significa simplemente «incontables».",
          "Su preocupación central no es el pecado, sino la PUREZA. Lo que aleja de los kami no es haber sido malo en un sentido moral, sino estar contaminado: por la muerte, la sangre, la enfermedad, la suciedad. Por eso el gesto religioso básico es lavarse: al entrar en un santuario se enjuagan las manos y la boca, se hacen ofrendas, se toca una campana, se aplaude dos veces para avisar al kami y se pide algo concreto: aprobar un examen, un embarazo, un buen negocio.",
          "El santuario se anuncia con un torii, ese pórtico de dos columnas que marca la frontera entre lo cotidiano y lo sagrado. No hay que creer nada para pasar por debajo; hay que hacerlo con respeto.",
          "Y explica bastante bien cierta sensibilidad japonesa: el cuidado extremo de la limpieza, la atención a los detalles del entorno, el aprecio por lo transitorio —los cerezos en flor, que valen precisamente porque duran una semana— y la idea de que un objeto muy bien hecho o un lugar muy antiguo tienen algo sagrado.",
          "Su historia también tiene una parte oscura. Desde 1868 el Estado japonés convirtió el sintoísmo en religión oficial y lo usó para sostener el culto al emperador como descendiente de la diosa del sol, Amaterasu, y para alimentar el nacionalismo militarista que llevó a la Segunda Guerra Mundial. En 1946, tras la derrota, el emperador renunció públicamente a su carácter divino y el Estado se separó del santuario.",
        ],
        "Dato curioso: el santuario más venerado de Japón, el de Ise, se reconstruye íntegramente cada veinte años en un terreno contiguo, con las mismas técnicas, y luego se desmonta el anterior. Lleva haciéndose desde el siglo VII: el edificio tiene mil trescientos años de antigüedad y ninguna de sus piezas tiene más de veinte. Es una idea de eternidad completamente distinta a la de la piedra europea."),
      hito("dioses-historias", "religiones-africanas", "Religiones tradicionales africanas", "Desde la Antigüedad",
        "¿Y si tus abuelos siguieran siendo miembros de la familia, con voz y voto?",
        [
          "Hablar de «la religión africana» es como hablar de «la religión europea»: en un continente con más de dos mil pueblos y lenguas hubo miles de tradiciones distintas. Pero muchas comparten una arquitectura reconocible, y merece la pena entenderla porque explica cosas que hoy pasan al otro lado del Atlántico.",
          "Primero: casi todas tienen un Dios supremo creador, único y lejano —Olodumare entre los yoruba, Nyame entre los akan, Amma entre los dogones—, del que no suele haber imágenes ni templos, porque no se ocupa del día a día.",
          "Segundo: entre ese Dios y las personas hay una multitud de intermediarios que sí se ocupan. Entre los yoruba se llaman orishas y cada uno tiene su carácter, sus colores, sus comidas, sus tambores y su terreno: Shangó, el trueno y la justicia; Yemayá, el mar y la maternidad; Oshún, el amor, el río y la dulzura; Ogún, el hierro y el trabajo.",
          "Tercero, y es el rasgo más importante: los antepasados siguen formando parte de la comunidad. No están «en otro sitio»: están cerca, se les habla, se les consulta, se les alimenta y pueden ayudar o incomodar. Un mal momento en la familia puede interpretarse como un antepasado desatendido, y la solución es un ritual de reparación. Nacer, casarse y morir son los momentos en que la comunidad de los vivos y la de los muertos se tocan.",
          "Cuarto: la religión no se lee, se hace. Se transmite por tradición oral, y su lenguaje es el tambor, el canto, la danza, la máscara y la posesión ritual, en la que un espíritu «monta» a un iniciado y habla por su boca. Y tiene un sistema de adivinación muy sofisticado, el Ifá, con un corpus de versos que el sacerdote debe memorizar y que la UNESCO ha reconocido como patrimonio de la humanidad.",
          "Y quinto, algo que se olvida: África no es solo receptora de religiones. Etiopía es cristiana desde el siglo IV, casi tan antigua como Roma; el norte de África dio a Agustín de Hipona; hubo comunidades judías milenarias; y el islam entró por el Sáhara desde el siglo VIII, con ciudades como Tombuctú convertidas en centros universitarios con bibliotecas de miles de manuscritos.",
        ],
        "Dato curioso: se calcula que unos cien millones de personas practican hoy religiones tradicionales africanas, y muchísimas más las combinan con el cristianismo o el islam sin considerarlo una contradicción.",
        [
          {
            titulo: "Los dioses que cruzaron el Atlántico escondidos",
            cuerpo: [
              "Entre los siglos XVI y XIX, más de once millones de africanos fueron esclavizados y llevados a América. Se les prohibió su lengua, su nombre y su religión, y se les bautizó por la fuerza. Lo que hicieron con eso es una de las historias de resistencia cultural más extraordinarias que existen.",
              "En lugar de renunciar a sus dioses, los ESCONDIERON detrás de los santos católicos. Si te obligan a rezar a santa Bárbara, cuyo atributo es el rayo, puedes seguir rezando a Shangó, el dueño del trueno. Si te obligan a venerar a la Virgen de Regla, vestida de azul y patrona de los marineros, puedes seguir honrando a Yemayá, dueña del mar. Si el santo es san Lázaro, el llagado, detrás está Babalú Ayé, el de las enfermedades.",
              "Así nacieron religiones nuevas, ni africanas ni europeas, sino americanas: la santería o regla de ocha en Cuba, el candomblé y la umbanda en Brasil, el vudú en Haití, el palo, el shangó en Trinidad. Todas con tambores, iniciaciones, ofrendas de comida, posesión ritual y un calendario que encajaba con el católico.",
              "Y tuvieron consecuencias políticas reales. La revolución haitiana, la única insurrección de esclavizados que triunfó y fundó un Estado, empezó según la tradición con una ceremonia vudú en Bois Caïman en 1791. La religión fue lo que permitió reunirse, jurar y sostener la rebelión.",
              "Su influencia cultural es inmensa y está en cosas que escuchas todos los días. La rumba, el son, el jazz, la samba, el blues, la salsa y buena parte de la música popular del siglo XX vienen de ritmos y estructuras de canto-respuesta que llegaron con esos cultos. Los tambores no eran folclore: eran liturgia, y en muchos lugares se prohibieron precisamente por eso.",
              "Durante siglos se persiguieron y se caricaturizaron —el cine convirtió el vudú en una película de terror con muñecos y alfileres, que no tiene casi nada que ver con la práctica real—, y solo en las últimas décadas han pasado a estar reconocidos y estudiados. En Brasil y Cuba tienen millones de practicantes, y en Nigeria y Benín se han recuperado vínculos con las tradiciones de origen.",
            ],
            dato: "Dato curioso: hay palabras africanas en tu vocabulario cotidiano que llegaron por esta vía: «bemba», «bongó», «conga», «marimba», «mambo», «ñame», «quilombo», «cachimba» y, según muchos lingüistas, «tango» y «samba». La lengua conservó lo que la ley prohibía.",
          },
        ]),
      hito("dioses-historias", "america-precolombina", "Las religiones de la América precolombina", "Antes de 1492",
        "¿Qué pasa si crees que el universo se detiene si dejas de alimentarlo?",
        [
          "Las civilizaciones americanas desarrollaron religiones muy elaboradas, con templos monumentales, sacerdocios especializados, astronomía de precisión y calendarios rituales. Y compartían una intuición de fondo: el cosmos no es estable. Hay que sostenerlo activamente, con trabajo humano, o se cae.",
          "Los MAYAS llevaron esa idea al terreno del cálculo. Manejaban a la vez un calendario ritual de 260 días y otro solar de 365, que se combinaban en ciclos de 52 años, más una «cuenta larga» capaz de fechar acontecimientos a miles de años de distancia. Su interés no era abstracto: cada día tenía su carga, su dios y su tipo de suerte, y el rey necesitaba saber cuál era el momento correcto para una guerra, una boda o una coronación. Su libro sagrado, el Popol Vuh, cuenta cómo los dioses fracasaron dos veces al crear a los humanos —de barro y de madera— hasta lograrlo con maíz, el alimento del que dependía todo.",
          "Los AZTECAS tenían la versión más extrema de esa idea. Creían vivir en el quinto sol, después de que los cuatro mundos anteriores se hubieran destruido, y que este también acabaría. El sol se movía cada día porque libraba una batalla, y para tener fuerza necesitaba el líquido más precioso que existe: la sangre. De ahí los autosacrificios (perforarse la lengua o las orejas era práctica común y también de los reyes) y los sacrificios humanos, casi siempre de prisioneros capturados en combate. No era crueldad gratuita: era, en su lógica, mantenimiento del universo. Y era también terror político sobre los pueblos sometidos, que por eso se aliaron con Cortés.",
          "Los INCAS organizaron la religión como un Estado. Inti, el sol, era su dios principal y el emperador su hijo; Pachamama, la tierra; Viracocha, el creador. Los emperadores muertos se momificaban y seguían teniendo casa, servidumbre, tierras y voz en las decisiones: literalmente, se les consultaba. Y hacían ofrendas en las montañas más altas, incluidos sacrificios de niños elegidos y honrados —la capacocha—, cuyos cuerpos se han encontrado congelados a más de 6.000 metros.",
          "Todas estas religiones fueron atacadas sistemáticamente tras la conquista: se quemaron los códices —de los libros mayas solo sobrevivieron cuatro—, se derribaron templos y se construyeron iglesias encima, muchas veces con las mismas piedras.",
          "Y aun así no desaparecieron. Se replegaron y se mezclaron. La Virgen de Guadalupe aparece en el cerro de Tepeyac, un lugar de culto anterior; el Día de Muertos une la fiesta católica con la relación mesoamericana con los difuntos; en los Andes se sigue haciendo el pago a la Pachamama antes de sembrar o de construir. Lo que no se pudo prohibir, se camufló.",
        ],
        "Dato curioso: los mayas calcularon la duración del año solar y los ciclos de Venus con una precisión de minutos, y todo ello sin instrumentos ópticos y con un sistema de numeración vigesimal que incluía el cero, un concepto que Europa tardó siglos más en adoptar."),
    ],
  },
  {
    key: "revolucion-espiritual",
    titulo: "La gran revolución espiritual",
    anio: "≈2000-200 a. C.",
    intro:
      "La Era Axial. La religión dejó de explicar únicamente la naturaleza y comenzó a responder las grandes preguntas de la vida. Entre aproximadamente los siglos VIII y II a. C. ocurrió algo extraordinario. En distintos lugares del mundo, y casi al mismo tiempo, aparecieron pensadores, profetas y maestros que comenzaron a hacerse preguntas muy diferentes a las de las antiguas civilizaciones. Hasta entonces, la religión se había preocupado sobre todo por mantener contentos a los dioses para garantizar buenas cosechas, victorias militares o la prosperidad de las ciudades. Pero ahora surgían cuestiones mucho más profundas: ¿qué es el bien?, ¿por qué existe el sufrimiento?, ¿qué ocurre después de la muerte?, ¿cómo debemos vivir? El filósofo alemán Karl Jaspers llamó a este periodo la Era Axial, porque muchas de las ideas religiosas y filosóficas que aún hoy siguen presentes nacieron durante estos siglos. Y lo más desconcertante es que ocurrió a la vez en Grecia, Israel, Persia, la India y China, en lugares que apenas se conocían entre sí.",
    subhitos: [
      hito("revolucion-espiritual", "abraham", "Abraham", "≈Siglo XIX-XVIII a. C. (según la tradición)",
        "¿Y si en lugar de tener muchos dioses tuvieras una relación personal con uno solo?",
        [
          "Hasta entonces, los dioses eran de un sitio: el dios de esta ciudad, el del río, el de la montaña. Si te mudabas, cambiabas de dioses, porque el poder de cada uno terminaba donde terminaba su territorio.",
          "La tradición bíblica cuenta que Abraham salió de Ur, la gran ciudad mesopotámica, y se puso en camino hacia una tierra que no conocía porque un Dios le habló. Lo revolucionario no es el viaje: es que ese Dios viaja con él. Un Dios que no está atado a un lugar es, necesariamente, un Dios de todas partes.",
          "La segunda novedad es el tipo de relación. No es un contrato de mantenimiento —yo te alimento, tú me proteges—, sino una ALIANZA: una promesa mutua, con confianza y con exigencias morales por las dos partes. Dios promete descendencia y tierra; Abraham promete fidelidad. Es la primera vez que lo divino aparece como alguien con quien se puede pactar y, sobre todo, con quien se puede discutir: en el episodio de Sodoma, Abraham regatea con Dios el número de justos necesario para salvar la ciudad.",
          "El relato más duro es el del sacrificio de su hijo. Dios se lo pide, Abraham obedece y en el último momento un ángel lo detiene y aparece un carnero. Se ha leído de mil maneras —prueba de obediencia, prueba de fe, escándalo moral—, pero hay una lectura histórica muy potente: en un mundo donde el sacrificio humano existía como práctica religiosa, ese relato marca su prohibición definitiva. A partir de ahí se ofrece un animal, nunca un hijo.",
          "No hay pruebas arqueológicas de Abraham; es una figura de tradición, y su datación es discutida. Pero su importancia es medible: es la referencia común del judaísmo, el cristianismo y el islam, y por eso llamamos «religiones abrahámicas» a las tres. Entre ellas suman hoy más de la mitad de la humanidad.",
          "En el islam, además, el hilo continúa por otro hijo: Ismael, nacido de Agar. Según la tradición islámica, Abraham e Ismael levantaron la Kaaba de La Meca, y el sacrificio recordado en la fiesta del Cordero es este mismo episodio.",
        ],
        "Dato curioso: la tumba que la tradición atribuye a Abraham, en Hebrón, es hoy a la vez sinagoga y mezquita, dividida y vigilada. El personaje que las tres religiones reconocen como padre común señala también uno de los lugares más disputados del planeta."),
      hito("revolucion-espiritual", "moises", "Moisés", "≈Siglo XIII a. C. (según la tradición)",
        "¿Cómo se convierte un grupo de esclavos en un pueblo con leyes?",
        [
          "El relato del Éxodo es, antes que nada, una historia de liberación: un pueblo esclavizado en Egipto sale de allí guiado por Moisés, cruza el mar y pasa cuarenta años en el desierto antes de llegar a su tierra. Esa estructura —opresión, salida, travesía, promesa— se ha convertido en el relato de liberación por excelencia de la cultura occidental, y lo han usado desde los esclavos afroamericanos en sus cánticos hasta los movimientos de derechos civiles.",
          "El momento central no es la huida, sino lo que ocurre en el monte Sinaí: la entrega de la Ley. Es ahí donde el pueblo pasa de ser un grupo de fugitivos a ser una comunidad con normas, y donde la religión da un salto decisivo: ya no se trata de hacer los ritos correctos, se trata de comportarse de una determinada manera con los demás.",
          "También ocurre algo único en el episodio de la zarza que arde sin consumirse. Moisés pregunta el nombre del dios que le habla —porque en aquel mundo conocer el nombre de un dios era poder invocarlo— y recibe una respuesta que no es un nombre: «Yo soy el que soy». Ese Dios se niega a ser definido, y su nombre escrito (las cuatro letras del tetragrámaton) acabará siendo impronunciable: los judíos leen en su lugar «el Señor» o «el Nombre».",
          "Y hay una prohibición asociada que cambió la historia del arte y del pensamiento: no hacer imágenes. Un dios sin estatua no se puede tocar, ni transportar, ni robar, ni ver: solo se puede escuchar y leer. Esa es la razón profunda por la que el judaísmo se convirtió en una religión del texto, del estudio y de la discusión, y por la que el islam desarrolló la caligrafía y la geometría en lugar de la escultura.",
          "Históricamente, no hay rastro arqueológico de una salida masiva de Egipto ni de cuarenta años en el Sinaí, y la mayoría de los investigadores piensa que el relato se compuso siglos más tarde a partir de tradiciones diversas. Eso no le quita ni un gramo de influencia: es probablemente el texto político más citado de la historia.",
        ],
        "Dato curioso: los cuernos con los que Miguel Ángel esculpió a su famoso Moisés vienen de un error de traducción. El hebreo decía que su rostro «irradiaba» al bajar del monte, y una palabra muy parecida significa «cuerno». La versión latina eligió mal, y así entró en el arte europeo durante siglos.",
        [
          {
            titulo: "Los Diez Mandamientos y la invención del descanso",
            cuerpo: [
              "Merece la pena mirarlos de cerca, porque su estructura dice mucho. Los primeros regulan la relación con Dios: un solo Dios, sin imágenes, sin usar su nombre en vano, y guardar el sábado. Los siguientes regulan la relación entre personas: honrar a los padres, no matar, no cometer adulterio, no robar, no dar falso testimonio y no desear los bienes ni la mujer del prójimo.",
              "Es decir: la mitad de la ley divina no habla de Dios, habla de tus vecinos. Ahí está la novedad. En las religiones antiguas ofender a un dios era descuidar su culto; aquí, ofender a Dios es maltratar a una persona.",
              "El más revolucionario socialmente es el del sábado, y hay que leerlo entero para verlo: manda descansar un día de cada siete, y especifica que ese descanso alcanza a tus hijos, a tus criados, a tus esclavos, a los extranjeros que viven contigo y hasta a tus animales de trabajo.",
              "Piénsalo en su contexto: en el siglo XIII a. C., nadie descansaba por derecho. Trabajaba quien tenía que trabajar, todos los días, y el ocio era un privilegio de las élites. Aquí aparece por primera vez la idea de que el descanso es una obligación religiosa que protege también al que no tiene ningún poder para pedirlo. Es el antepasado remoto del fin de semana.",
              "El resto de la Torá contiene 613 preceptos, y no todos son de culto: hay leyes de protección al pobre y al extranjero («no oprimirás al forastero, porque forasteros fuisteis en Egipto»), la obligación de dejar sin recoger parte de la cosecha para que los pobres puedan comerla, la prohibición de cobrar intereses a un compatriota pobre, la liberación de los esclavos hebreos al séptimo año, la condonación de deudas y hasta un año en el que la tierra debía descansar sin cultivar.",
              "Y hay algo más que no se suele señalar: los profetas posteriores —Amós, Isaías, Miqueas, Jeremías— usaron esa ley para atacar a los reyes y a los sacerdotes de su propio pueblo. Dijeron que a Dios le importan menos los sacrificios que la justicia, que un culto impecable con los pobres explotados es una ofensa, y que la religión sin ética no vale nada. Esa es, quizá, la aportación más influyente de todo el judaísmo antiguo, y de ella beberán después Jesús, la doctrina social cristiana y buena parte del lenguaje moderno de los derechos.",
            ],
            dato: "Dato curioso: en hebreo, el mandamiento suele traducirse como «no matarás», pero el verbo empleado se refiere específicamente al asesinato, no a cualquier muerte. Ese matiz ha dado dos mil quinientos años de discusión jurídica y teológica sobre la guerra, la pena de muerte y la defensa propia.",
          },
        ]),
      hito("revolucion-espiritual", "zoroastro", "Zoroastro y el zoroastrismo", "≈1200-1000 a. C. (fecha discutida)",
        "¿Por qué existe el mal si el mundo lo hizo alguien bueno?",
        [
          "Esta pregunta es una trampa lógica para cualquier religión de un solo Dios omnipotente y bueno, y en la antigua Persia un profeta llamado Zoroastro dio la respuesta más limpia que se ha dado nunca: el mal no viene de Dios, viene de un principio opuesto, y el universo entero es el campo de batalla entre los dos.",
          "De un lado, Ahura Mazda, el «Señor Sabio», creador de la luz, la vida y el orden verdadero. Del otro, Angra Mainyu, el espíritu de la destrucción y la mentira. Y en el medio, cada ser humano, con una capacidad decisiva: elegir. No estás predestinado; te sumas a un bando con cada pensamiento, cada palabra y cada acción. Su fórmula, que es también su resumen ético, es exactamente esa: buenos pensamientos, buenas palabras, buenas obras.",
          "El zoroastrismo introdujo, o desarrolló por primera vez de forma completa, un paquete de ideas que hoy nos parecen obvias y que antes de él no lo eran: el juicio de cada persona después de morir; un cielo y un infierno según su comportamiento; los seres espirituales buenos que ayudan (algo muy parecido a los ángeles) y los que dañan (los demonios); un salvador que vendrá al final de los tiempos; una batalla definitiva; la resurrección de los muertos; y un final feliz en el que el mal es derrotado y el mundo queda renovado.",
          "Y ahí está su importancia histórica. Cuando el pueblo judío estuvo exiliado en Babilonia y luego bajo el dominio del Imperio persa —dos siglos largos de contacto—, muchas de esas ideas aparecen o se desarrollan en sus textos más tardíos. De ahí pasaron al cristianismo y al islam. Es decir: buena parte de lo que media humanidad cree hoy sobre el cielo, el infierno, los ángeles, el diablo, el juicio final y el mesías tiene un antepasado persa.",
          "Su culto giraba en torno al fuego, que consideraban el símbolo más puro de la verdad, y por eso los llamaron erróneamente «adoradores del fuego»: no lo adoraban, se orientaban hacia él como nosotros hacia una cruz o una alquibla. Y su respeto por la pureza de los elementos les llevó a no enterrar ni quemar a sus muertos, para no contaminar la tierra ni el fuego: los depositaban en «torres del silencio» al aire libre.",
          "Hoy quedan apenas entre cien y doscientos mil zoroastrianos, la mayoría los parsis de la India, descendientes de quienes huyeron de Persia tras la conquista islámica. Es uno de los casos más llamativos de la historia: una religión con poquísimos fieles y una influencia gigantesca.",
        ],
        "Dato curioso: los «Reyes Magos» que aparecen en el Evangelio siguiendo una estrella eran magos, es decir, sacerdotes zoroastrianos y astrólogos persas —de ahí viene nuestra palabra «magia»—. Y el cantante Freddie Mercury nació en una familia parsi zoroastriana: en su funeral se rezó en avéstico, la lengua litúrgica de Zoroastro."),
      hito("revolucion-espiritual", "judaismo", "Judaísmo", "≈Siglo XIII-VI a. C.",
        "¿Cómo sobrevive una religión durante 2.000 años sin templo, sin tierra y sin poder?",
        [
          "El judaísmo fue el primer monoteísmo que se consolidó y se mantuvo, y su núcleo cabe en una frase que se reza dos veces al día: escucha, el Señor es nuestro Dios, el Señor es uno.",
          "Sus rasgos originales son cuatro. Un solo Dios, creador de todo y sin imagen. Una alianza con un pueblo, que implica responsabilidad y no privilegio. Una ley que regula la vida entera, desde la justicia hasta la comida. Y una insistencia machacona, a través de los profetas, en que a Dios le importa cómo tratas al huérfano, a la viuda y al extranjero.",
          "Y luego vino la prueba. En el año 586 a. C. Babilonia destruyó Jerusalén, arrasó el Templo y deportó a la élite del pueblo. Para cualquier religión antigua, eso era el final: el dios había perdido, la ciudad y el templo se habían acabado, y lo lógico era adoptar los dioses del vencedor, como hicieron todos los pueblos derrotados de la historia.",
          "Hicieron lo contrario, y ahí se transformó la religión. En lugar de concluir que su Dios era débil, concluyeron que era universal —el Dios de todos los pueblos, incluidos los que los habían vencido— y que la derrota era consecuencia de sus propias faltas. Y en lugar de necesitar un templo, inventaron una forma de religión que se puede practicar en cualquier lugar del mundo: reunirse a leer, comentar y rezar. Eso es la sinagoga, y es probablemente la innovación religiosa más influyente de la Antigüedad: el modelo del que salen luego la iglesia y la mezquita.",
          "Con el permiso del rey persa Ciro volvieron y reconstruyeron el Templo, y en el año 70 d. C. Roma lo destruyó otra vez, esta vez definitivamente. Sin templo, sin sacrificios y sin país, el judaísmo se reorganizó por completo alrededor del estudio y del debate del texto. El sacerdote fue sustituido por el rabino, que no es un intermediario con Dios: es un maestro.",
          "Nunca han sido muchos —hoy son unos quince millones, menos del 0,2 % de la humanidad—, y su influencia es difícil de exagerar: de sus creencias nacieron el cristianismo y el islam, es decir, la religión de más de la mitad del planeta.",
        ],
        "Dato curioso: el shabat, el descanso semanal, se ha cumplido de forma continuada durante unos tres mil años, en imperios, exilios, guetos y guerras. Es probablemente la costumbre viva más antigua del mundo.",
        [
          {
            titulo: "El Talmud: una religión que discute consigo misma",
            cuerpo: [
              "Después del año 70, con el Templo destruido, los rabinos se dedicaron a algo insólito: escribir el debate. Primero recopilaron las discusiones legales orales (la Mishná, hacia el año 200) y después los siglos de comentarios sobre esas discusiones (la Guemará). El conjunto es el Talmud, y es una obra de miles de páginas.",
              "Lo extraordinario es su forma. Abre una página y verás el texto antiguo en el centro y, alrededor, en columnas y letras distintas, los comentarios de rabinos de siglos y países diferentes, discutiendo entre ellos y contigo. Es una conversación de mil quinientos años impresa en la misma hoja.",
              "Y esto es lo más llamativo: cuando una discusión se resuelve, la opinión que PERDIÓ no se borra. Se conserva junto a la que ganó, con nombre y argumentos. La tradición mantiene el desacuerdo por escrito, porque quizá mañana ese razonamiento sirva.",
              "Se estudia además en parejas —una práctica llamada javruta—: dos personas leen, se preguntan y se rebaten en voz alta durante horas. La forma normal de acercarse a lo sagrado no es escuchar en silencio, es discutir. Hay un famoso pasaje en el que una voz del cielo intenta zanjar una disputa legal y los rabinos la desestiman diciendo que la Torá ya se dio a los seres humanos y ahora la interpretación les corresponde a ellos.",
              "De ahí salió una cultura de argumentación, lectura crítica y educación obligatoria (había que saber leer para poder estudiar) que muchos historiadores relacionan con la enorme presencia posterior de judíos en la ciencia, el derecho, la medicina, la literatura y el psicoanálisis, muy por encima de su proporción demográfica.",
            ],
            dato: "Dato curioso: hay una tradición de estudio en la que se lee el Talmud entero a razón de una página por día. Se tarda unos siete años y medio, y al terminar se celebra en público y se empieza otra vez desde el principio.",
          },
          {
            titulo: "Dos mil años de diáspora, y una fecha: 1948",
            cuerpo: [
              "Tras la destrucción del Templo y las revueltas contra Roma, la mayoría del pueblo judío quedó dispersa por el Mediterráneo, Oriente Próximo, Europa y, más tarde, América. Esa dispersión se llama diáspora, y de ella salieron dos grandes ramas culturales: los sefardíes (de Sefarad, España) y los asquenazíes (de Europa central y oriental), cada una con su acento, su cocina y su música.",
              "Su historia europea es una alternancia de convivencia y catástrofe. Hubo siglos brillantes: en al-Ándalus y en los reinos cristianos, médicos, traductores, poetas, filósofos y consejeros reales judíos fueron centrales en la transmisión del saber. Y hubo persecución sistemática: prohibición de poseer tierras y de ejercer oficios (lo que los empujó a las finanzas y al comercio, y luego se usó como estereotipo contra ellos), guetos, distintivos obligatorios en la ropa, acusaciones absurdas —envenenar pozos, matar niños en rituales—, matanzas durante la peste negra y las cruzadas, expulsiones: de Inglaterra en 1290, de Francia, y de España en 1492.",
              "En el siglo XIX, con la Ilustración, muchas comunidades se integraron en la vida civil europea y florecieron; y justo entonces apareció una forma nueva de odio que ya no era religiosa sino racial, el antisemitismo moderno, con teorías pseudocientíficas y falsificaciones célebres.",
              "Ese camino desembocó en el Holocausto: el asesinato sistemático de unos seis millones de judíos entre 1941 y 1945, dos tercios de la población judía europea. Comunidades con mil años de historia desaparecieron enteras. La cifra mundial de judíos, que rondaba los 16,6 millones en 1939, todavía no ha vuelto a ese nivel.",
              "En 1948, tras décadas de movimiento sionista y de inmigración a Palestina, y con la ONU aprobando un plan de partición, se proclamó el Estado de Israel. Para el pueblo judío fue el regreso a la tierra de la que se hablaba en cada rezo desde hacía dos milenios. Para la población árabe palestina supuso la guerra, el desplazamiento de cientos de miles de personas y un conflicto que sigue abierto hoy, con enorme sufrimiento por ambas partes.",
              "Y hay una parte religiosa que merece señalarse: dentro del propio judaísmo hay ramas muy distintas —ortodoxos, conservadores, reformistas, seculares— que discuten entre sí sobre casi todo, incluido el significado religioso de ese Estado. No hay una autoridad central que zanje: siguen siendo, como en el Talmud, una tradición que discute.",
            ],
            dato: "Dato curioso: en 1492 los judíos expulsados de España se llevaron el castellano de la época, y sus descendientes lo conservaron durante siglos en Salónica, Estambul o Sarajevo. Ese idioma, el judeoespañol o ladino, todavía se habla, y suena parecido al español que se hablaba cuando Colón zarpó.",
          },
        ]),
      hito("revolucion-espiritual", "hinduismo", "Hinduismo", "≈1500-500 a. C.",
        "¿Puede existir una religión sin fundador, sin dogma y sin nadie que diga qué hay que creer?",
        [
          "El hinduismo es la más antigua de las grandes religiones vivas y la más difícil de definir, porque no encaja en la casilla. No tuvo fundador, ni fecha de nacimiento, ni un solo libro obligatorio, ni una autoridad central que decida qué es herejía. Es más bien una familia enorme de tradiciones que crecieron juntas durante tres mil años.",
          "Sus textos más antiguos son los Vedas, himnos que se transmitieron ORALMENTE con una precisión asombrosa —memorizados sílaba a sílaba, con reglas de recitación diseñadas para detectar cualquier error— durante siglos antes de escribirse. Y sobre ellos están las Upanishads, donde la pregunta cambia de dirección: ya no «qué sacrificio hay que ofrecer», sino «qué soy yo».",
          "La respuesta de las Upanishads es una de las ideas más audaces de la historia del pensamiento: el fondo último de ti mismo (atman) y el fondo último del universo (Brahman) son lo mismo. No hay que ir a buscar lo divino fuera; hay que darse cuenta.",
          "De ahí salen sus cuatro conceptos clave. El karma: toda acción tiene consecuencias, y no como castigo de nadie, sino como ley. El samsara: el ciclo de nacimientos y muertes al que esas consecuencias te atan. El dharma: el deber propio de cada uno según su situación, su etapa de la vida y su papel. Y el moksha: la liberación de ese ciclo, que es la meta final.",
          "Y como no hay dogma, ofrece varios caminos válidos a la vez, algo bastante único: el del conocimiento (estudio y discernimiento), el de la devoción (amor a un dios personal, que es el camino de la inmensa mayoría), el de la acción desinteresada (cumplir tu deber sin apegarte al resultado) y el de la disciplina física y mental, que es el yoga.",
          "Hoy lo practican unos mil doscientos millones de personas y ha exportado al mundo entero cosas que ya usamos sin pensar en su origen: el yoga, la meditación, la palabra karma, el vegetarianismo ético y la idea de no violencia que Gandhi convirtió en una herramienta política capaz de echar a un imperio.",
        ],
        "Dato curioso: la palabra «hindú» no la inventaron los hindúes. Viene de cómo llamaban los persas a la gente que vivía al otro lado del río Indo, y el término «hinduismo» lo popularizaron los británicos en el siglo XIX para agrupar bajo una sola etiqueta administrativa una realidad religiosa muchísimo más variada."),
      hito("revolucion-espiritual", "krishna", "Krishna y el Bhagavad Gita", "≈1200-500 a. C. (desarrollo del hinduismo)",
        "¿Qué haces cuando cumplir con tu deber te obliga a algo terrible?",
        [
          "El Bhagavad Gita, uno de los textos más leídos de la India, arranca en el peor momento imaginable. El príncipe Arjuna está en su carro, en medio de dos ejércitos a punto de chocar, y se derrumba: en el bando contrario están sus primos, sus maestros y sus amigos. Suelta el arco y dice que prefiere morir antes que combatir.",
          "Su auriga es Krishna, que resulta ser una encarnación divina, y lo que sigue son dieciocho capítulos de conversación en pleno campo de batalla.",
          "La respuesta de Krishna tiene varias capas, y la central es esta: actúa porque es tu deber, no por lo que vas a obtener. El error no está en actuar, está en actuar movido por el resultado —el miedo al fracaso, el ansia de premio, el aplauso, la culpa—, porque el resultado nunca está del todo en tus manos. Haz lo que te corresponde, hazlo lo mejor posible y suelta el desenlace.",
          "La segunda capa es que hay muchos caminos hacia lo mismo: el conocimiento, la devoción, la acción desinteresada y la disciplina interior. Krishna no exige un rito ni una casta: dice que cualquiera que se dirija a él con sincero corazón llega, y eso incluye explícitamente a personas de cualquier origen social. En su contexto, eso era una declaración de igualdad espiritual.",
          "Es un texto que se ha leído de maneras opuestas, y por eso es tan interesante: Gandhi lo consideraba su guía diaria y lo interpretó como una alegoría de la lucha interior y un apoyo a la no violencia; otros lo han leído como una justificación del deber guerrero. Un mismo libro, dos lecturas contrarias, dos mil años de discusión.",
          "Y Krishna es además, en la devoción popular, el dios más querido y más humano: el niño travieso que roba mantequilla, el pastor que toca la flauta y enamora a las pastoras, el amigo. La relación con él no es de temor, es de cariño.",
        ],
        "Dato curioso: cuando presenció la primera explosión nuclear de la historia, en 1945, el físico Robert Oppenheimer dijo que le vino a la cabeza un verso del Bhagavad Gita en el que Krishna se muestra en su forma cósmica: «me he convertido en la muerte, destructora de mundos». Había estudiado sánscrito para poder leerlo en el original."),
      hito("revolucion-espiritual", "buda", "Buda", "≈Siglo VI a. C.",
        "¿Se puede acabar con el sufrimiento sin necesidad de ningún dios?",
        [
          "Siddhartha Gautama era hijo de un noble del norte de la India y creció, según la tradición, protegido de todo lo desagradable. Un día salió del palacio y vio por primera vez a un anciano, a un enfermo y a un cadáver. Aquello le rompió la vida: entendió que nada de lo que tenía lo salvaría de eso.",
          "Lo dejó todo y probó el camino opuesto: años de ascetismo extremo, ayunos hasta casi morir. Tampoco funcionó, y de ahí sacó su primera conclusión importante: ni el placer ni el castigo del cuerpo liberan. Existe un camino medio.",
          "Meditando bajo un árbol alcanzó lo que llamó el despertar, y desde entonces se le llamó Buda, «el despierto». No dijo ser un dios, ni un enviado, ni un profeta: dijo haber comprendido algo, y que cualquiera podía comprenderlo. Eso lo convierte en un caso raro entre los fundadores de religiones.",
          "Su diagnóstico son las Cuatro Nobles Verdades, y está planteado exactamente como una consulta médica: hay sufrimiento; el sufrimiento tiene una causa; si se elimina la causa, cesa; y existe un tratamiento.",
          "La causa que señaló es la sed: el deseo constante de que las cosas sean distintas de como son, y el apego a que permanezcan cuando todo cambia. Y el tratamiento es el Óctuple Sendero, que combina ética (no dañar, no mentir, no robar, medios de vida honestos), atención y meditación. No hay que creer nada por fe: hay que comprobarlo en la propia experiencia.",
          "Su otra revolución fue social. Enseñó a cualquiera —de cualquier casta, incluidas mujeres y personas consideradas impuras—, en la lengua del pueblo y no en el sánscrito de los sacerdotes, y organizó una comunidad monástica que dependía de la limosna diaria y por tanto no podía acumular. En una India rígidamente jerarquizada, aquello era subversivo.",
          "Y hay una idea suya especialmente difícil y especialmente potente: no existe un «yo» fijo. Lo que llamamos nuestra identidad es un proceso, un río de sensaciones, pensamientos y hábitos que cambia continuamente. Buena parte del sufrimiento, decía, viene de defender algo que no está ahí.",
        ],
        "Dato curioso: sus últimas palabras, según los textos, son un encargo incómodo para cualquier religión: no dependáis de mí, sed vuestra propia lámpara. Y durante los primeros siglos nadie se atrevió a representarlo con forma humana: en las esculturas antiguas aparece solo como un árbol, una rueda, un trono vacío o unas huellas.",
        [
          {
            titulo: "Las otras respuestas que dio la India",
            cuerpo: [
              "El siglo VI a. C. fue en la India una explosión de escuelas que discutían en público, y hubo respuestas mucho más variadas de lo que se suele contar. Dos merecen conocerse.",
              "EL JAINISMO. Su maestro, Mahavira, fue contemporáneo de Buda y llevó una sola idea hasta el extremo: ahimsa, no dañar a ningún ser vivo. Los monjes jainistas llevan una escobilla para barrer el suelo antes de pisar, se cubren la boca para no tragar insectos, filtran el agua, no comen después del anochecer y no ejercen la agricultura, porque arar mata seres del suelo. No es una religión de dioses: es una disciplina de no violencia absoluta y de desapego.",
              "Y aportó una idea filosófica preciosa: la verdad tiene muchos lados y ninguna posición individual la abarca. Lo ilustraron con la parábola de los ciegos y el elefante: uno toca la trompa y dice que es una serpiente, otro la pata y dice que es un árbol, otro la oreja y dice que es un abanico. Ninguno miente, y ninguno tiene razón del todo. Es una de las mejores lecciones sobre el fanatismo que ha dado ninguna religión.",
              "Hoy son solo unos cuatro o cinco millones de personas, casi todos en la India, y su influencia es desproporcionada: Gandhi creció rodeado de jainistas en Gujarat, y de ahí sacó la no violencia que después usó contra el Imperio británico y que inspiró a Martin Luther King.",
              "LOS MATERIALISTAS. Y hubo también lo contrario. La escuela charvaka sostenía que solo existe lo que se puede percibir, que no hay alma, ni reencarnación, ni karma, ni otro mundo, que los rituales son un negocio de los sacerdotes y que lo sensato es vivir bien esta única vida. Es un ateísmo explícito y argumentado, en el siglo VI a. C., y lo llamativo es que sus textos se conservan casi solo porque las otras escuelas los citaban para refutarlos: la India registró incluso las posiciones que rechazaba.",
              "Ese es el contexto en el que hay que entender a Buda: no un profeta aislado, sino uno de los participantes en el debate filosófico más intenso de la Antigüedad.",
            ],
            dato: "Dato curioso: en los hospitales jainistas para animales de la India se atiende a vacas, pájaros y perros heridos, algunos incapacitados de por vida, sin ninguna finalidad productiva. Existen desde hace siglos: son probablemente las primeras clínicas veterinarias de beneficencia del mundo.",
          },
        ]),
      hito("revolucion-espiritual", "budismo", "Budismo", "Desde el siglo VI a. C.",
        "¿Cómo se convierte la enseñanza de un hombre en la religión de media Asia?",
        [
          "Al principio fue una comunidad pequeña de monjes mendicantes en el valle del Ganges. Lo que la sacó de la India fue una decisión política: en el siglo III a. C., el emperador Ashoka, después de una guerra atroz, abrazó el budismo y envió misiones a Sri Lanka, Asia Central y el sudeste asiático. Sin él, probablemente sería hoy una escuela local desaparecida.",
          "Al extenderse, se transformó, y de ahí sus tres grandes ramas. El Theravada, «la enseñanza de los antiguos», conservó el modelo más cercano al original y predomina en Sri Lanka, Tailandia, Birmania, Laos y Camboya: el ideal es el monje que alcanza la liberación por su propio esfuerzo. El Mahayana, en China, Corea, Japón y Vietnam, introdujo una figura conmovedora: el bodhisattva, alguien que puede entrar en el nirvana y renuncia a hacerlo hasta que todos los seres puedan entrar con él; ahí la compasión pasa a ser el centro, y aparecen budas y figuras a las que se puede rezar. Y el Vajrayana, en el Tíbet y Mongolia, añadió rituales, mantras, mandalas y una estructura de maestros reconocidos como reencarnaciones, entre ellos el Dalái Lama.",
          "Su relación con China, Corea y Japón es un caso extraordinario de adaptación: al llegar a un mundo confuciano y taoísta, no eliminó nada, se acopló. De la mezcla con el taoísmo salió el chan chino, que en Japón se llamó zen, con su meditación sentada, su desconfianza de las palabras y su influencia enorme en la caligrafía, el jardín, el arco, el té y la cerámica.",
          "Lo que lo hace distinto de otras religiones es que no tiene dios creador, ni alma permanente, ni mandamientos revelados. Es más un método que un credo: un conjunto de prácticas para dejar de reaccionar automáticamente y ver las cosas como son.",
          "Hoy son unos quinientos millones de personas. Y hay una paradoja: apenas queda budismo en la India, donde nació; se fue reabsorbiendo en el hinduismo, que llegó a incluir a Buda como un avatar de Vishnú.",
          "Y hay que decir también lo incómodo, porque el budismo suele idealizarse en Occidente: haber nacido sin un dios que ordene matar no ha impedido que en su nombre se haya justificado violencia. Ha habido monjes guerreros en Japón, nacionalismo budista en Sri Lanka y una persecución brutal contra la minoría rohinyá en Birmania alentada por monjes. Ninguna tradición está vacunada contra el uso político del odio.",
        ],
        "Dato curioso: la técnica de meditación que hoy se receta en hospitales y se enseña en empresas —el mindfulness— es una adaptación deliberadamente laica de la meditación budista de atención plena, diseñada a finales de los años setenta para pacientes con dolor crónico. Es probablemente el caso más claro de una práctica religiosa de 2.500 años convertida en tratamiento clínico."),
    ],
  },
  {
    key: "busqueda-sabiduria",
    titulo: "La búsqueda de la sabiduría",
    anio: "China clásica",
    intro:
      "Algunos pensadores dejaron de preguntarse quién creó el mundo y comenzaron a preguntarse cómo debía vivir el ser humano. Mientras en Persia, la India y Oriente Próximo surgían religiones centradas en Dios, la salvación o la reencarnación, en China aparecieron maestros que dirigieron su atención hacia una cuestión diferente: ¿cómo construir una vida buena y una sociedad en armonía? Más que preocuparse por el origen del universo o el destino después de la muerte, estos pensadores buscaban enseñar a las personas cómo comportarse con los demás, cómo gobernar con justicia o cómo vivir en equilibrio con la naturaleza. De esta forma nacieron dos de las corrientes filosóficas y espirituales más influyentes de Asia: el confucianismo y el taoísmo. Y conviene entender algo desde el principio: en China no se elige una de las dos. Se practican a la vez, junto al budismo y al culto a los antepasados, porque cada una responde a una pregunta distinta.",
    subhitos: [
      hito("busqueda-sabiduria", "confucio", "Confucio", "≈551-479 a. C.",
        "¿Se puede arreglar una sociedad rota sin más leyes ni más castigos?",
        [
          "Confucio vivió en una China desmembrada en reinos que se hacían la guerra sin parar, con nobles corruptos y campesinos arruinados. Su diagnóstico fue insólito para un momento así: el problema no es que falten leyes ni ejércitos, es que falta carácter.",
          "Su idea central es que el orden social se sostiene sobre la conducta de las personas concretas, y que se aprende desde el ejemplo y desde arriba. Un gobernante que castiga mucho consigue miedo; un gobernante que se comporta bien consigue que los demás quieran parecérsele. Decía que gobernar por la fuerza es como intentar sujetar el agua con las manos.",
          "Sus conceptos clave son cuatro. El ren, que se traduce como humanidad o benevolencia: la capacidad de ponerse en el lugar del otro. El li: los ritos, los modales, las formas —que a él no le parecían tonterías, sino el entrenamiento diario del respeto—. El xiao: la piedad filial, el respeto a los padres y a los mayores, que era el modelo de todas las demás relaciones. Y el junzi: la persona ejemplar, que no lo es por nacimiento sino por conducta, y esto es revolucionario: convirtió la nobleza en algo que se merece, no que se hereda.",
          "Y formuló, unos quinientos años antes del Evangelio, su propia versión de la regla de oro, en negativo: no hagas a los demás lo que no querrías que te hicieran a ti.",
          "Nunca pretendió fundar una religión. Preguntado por los espíritus y por lo que hay después de la muerte, respondió que todavía no sabía bastante sobre esta vida como para opinar de la otra. Su interés estaba entero en el aquí: la familia, el trabajo, el gobierno, la educación.",
          "Y murió convencido de haber fracasado: se pasó la vida buscando un gobernante que aplicara sus ideas y ninguno lo tomó en serio de forma duradera. Sus enseñanzas las recopilaron sus discípulos después de su muerte, en las Analectas, un libro de conversaciones breves. Con el tiempo se convirtieron en la base de la educación, la administración y la moral de China, Corea, Japón y Vietnam durante más de dos mil años.",
        ],
        "Dato curioso: durante trece siglos, para ser funcionario del Imperio chino había que aprobar unos exámenes durísimos basados en los clásicos confucianos, abiertos en teoría a cualquier varón. Fue el primer sistema del mundo que seleccionaba a sus gobernantes por examen y no por familia, y se mantuvo hasta 1905."),
      hito("busqueda-sabiduria", "confucianismo", "Confucianismo", "Desde el siglo V a. C.",
        "¿Es religión algo que no habla de dioses ni promete otra vida?",
        [
          "El confucianismo es un caso que obliga a estirar la palabra «religión». No tiene dios creador, ni revelación, ni promesa de salvación, ni clero. Y sin embargo tiene templos, ritos, un canon de textos sagrados, una moral completa y una relación central con los antepasados.",
          "Su núcleo es la idea de que la sociedad funciona si cada persona cumple bien lo que le corresponde en cada una de sus relaciones: hijo con padre, hermano menor con mayor, esposa con marido, súbdito con gobernante, amigo con amigo. Y ojo, porque la obligación es de ida y vuelta: el hijo debe respeto, pero el padre debe cuidado; el súbdito debe lealtad, pero el gobernante debe justicia. Si el de arriba incumple, pierde la autoridad moral.",
          "Su rito principal es el culto a los antepasados, que no es adoración de dioses sino continuidad de la familia: se les recuerda, se les ofrece comida, se limpian sus tumbas una vez al año. La consecuencia práctica es que la unidad religiosa básica de China no es la congregación, es el linaje.",
          "Le debemos también una obsesión decisiva: la educación. Para el confucianismo, cualquiera puede mejorar estudiando, y estudiar es un deber moral, no un lujo. Eso explica el prestigio del maestro, del examen y del esfuerzo escolar en toda Asia oriental hasta el día de hoy.",
          "Su parte discutible es la otra cara de lo mismo: una jerarquía muy marcada, una fuerte subordinación de la mujer en su formulación tradicional y una tendencia a valorar la armonía por encima de la disidencia, que ha servido para justificar autoritarismos.",
          "Su historia reciente es un buen ejemplo de que las ideas religiosas nunca están quietas: fue atacado con furia durante la Revolución Cultural china de los años sesenta, cuando se destruyeron templos y se persiguió a los estudiosos, y en las últimas décadas el propio Estado chino lo ha rehabilitado y lo usa como emblema cultural en el mundo.",
        ],
        "Dato curioso: el linaje documentado de la familia de Confucio es probablemente el árbol genealógico más largo del mundo: se sigue registrando desde hace unos 2.500 años y reúne a más de dos millones de descendientes identificados."),
      hito("busqueda-sabiduria", "laotse", "Lao Tse", "≈Siglo VI-IV a. C. (tradicionalmente)",
        "¿Y si el problema fuera precisamente intentar controlarlo todo?",
        [
          "Mientras Confucio proponía orden, educación y ritos, la tradición atribuye a Lao Tse la idea contraria: el universo ya funciona por su cuenta, y buena parte de nuestro sufrimiento viene de forzarlo.",
          "Su libro, el Tao Te Ching, tiene ochenta y un capítulos brevísimos y unos cinco mil caracteres —cabe en un puñado de páginas— y está escrito en un lenguaje deliberadamente esquivo, lleno de paradojas: el que sabe no habla, el blando vence al duro, el vacío es lo que hace útil una taza.",
          "Su imagen favorita es el agua. El agua no lucha, cede, rodea el obstáculo, busca el punto más bajo… y termina atravesando la roca. Para Lao Tse, esa es la forma verdadera de la fuerza, y el error humano es confundir fuerza con rigidez.",
          "De ahí sale su concepto más famoso y más malinterpretado: wu wei, «no acción». No significa no hacer nada ni resignarse: significa actuar sin forzar, en el momento oportuno y con el mínimo esfuerzo necesario, como el buen jinete que no pelea con el caballo o el buen carpintero que corta siguiendo la fibra de la madera. Cualquiera que haya aprendido a nadar, a conducir o a tocar un instrumento reconoce esa diferencia entre pelearse con algo y dejar que fluya.",
          "Aplicado al gobierno, era casi anarquista: el mejor gobernante es el que interviene menos, y el pueblo mejor gobernado es el que apenas nota que lo gobiernan. Justo lo contrario del programa confuciano.",
          "La leyenda de su vida encaja con su filosofía: era archivero de la corte, se hartó de la corrupción, se marchó a lomos de un búfalo hacia el oeste y, al llegar al último paso de montaña, el guardián le pidió que dejara escrito su pensamiento antes de desaparecer. Escribió el libro y se fue. Nadie volvió a verlo.",
        ],
        "Dato curioso: algunos historiadores dudan de que Lao Tse existiera como persona concreta; puede ser el nombre bajo el que se reunieron los dichos de varios sabios. Y aun así, el Tao Te Ching es, después de la Biblia, uno de los libros más traducidos de la historia: solo al inglés tiene más de doscientas cincuenta versiones distintas."),
      hito("busqueda-sabiduria", "taoismo", "Taoísmo", "Desde el siglo IV a. C.",
        "¿Cómo se convierte una filosofía de la serenidad en una religión de inmortales y alquimia?",
        [
          "El taoísmo enseña que todo sigue un principio natural llamado Tao, «el camino», que no se puede definir con palabras —el propio libro empieza avisando de que el Tao que se puede nombrar ya no es el Tao— y con el que hay que aprender a ir a favor y no en contra.",
          "Su símbolo es conocidísimo y casi siempre mal entendido: el yin y el yang no son el bien y el mal. Son dos fuerzas complementarias —oscuridad y luz, frío y calor, quietud y movimiento, receptividad y empuje— que se necesitan mutuamente, que se convierten una en otra y que llevan cada una un punto de la otra dentro. La enfermedad, en esta lógica, no es la presencia del mal: es un desequilibrio.",
          "Esa idea es la base de la medicina tradicional china, del tai chi, del qigong, del feng shui y del concepto de qi, la energía que circula. Toda una cultura del cuerpo y del espacio salió de aquí.",
          "Con los siglos, el taoísmo filosófico se convirtió también en una religión organizada, con templos, monjes, dioses, exorcismos, escrituras y una obsesión característica: la longevidad. Sus practicantes buscaron alargar la vida —y algunos, alcanzar la inmortalidad— con dietas, respiración, ejercicios, meditación y alquimia.",
          "Esa búsqueda tuvo una consecuencia histórica enorme y absurda: mientras mezclaban minerales buscando el elixir de la vida eterna, unos alquimistas taoístas dieron con una combinación de salitre, azufre y carbón que explotaba. Habían inventado la pólvora. La sustancia que iba a cambiar la guerra en todo el planeta salió de la búsqueda de no morir.",
          "Y su otro gran texto merece una mención. Zhuangzi, el segundo maestro taoísta, escribió que una noche soñó que era una mariposa y que al despertar no sabía si era un hombre que había soñado ser mariposa o una mariposa que ahora soñaba ser un hombre. Es probablemente la mejor pregunta filosófica jamás formulada en cuatro líneas.",
        ],
        "Dato curioso: varios emperadores chinos murieron intoxicados por los elixires de inmortalidad que les preparaban sus alquimistas, a base de mercurio y otros metales. Buscando vivir para siempre, se envenenaron."),
    ],
  },
  {
    key: "un-dios-humanidad",
    titulo: "Un Dios para toda la humanidad",
    anio: "Siglos I-VII",
    intro:
      "Del judaísmo nacieron religiones destinadas a extenderse por todo el mundo. Durante siglos, el judaísmo había sido la religión de un pueblo concreto: el pueblo de Israel. Sin embargo, en los primeros siglos de nuestra era aparecieron dos nuevas religiones que afirmaban que el mensaje de Dios estaba destinado a toda la humanidad. Primero fue el cristianismo, nacido alrededor de la figura de Jesús de Nazaret. Seis siglos más tarde surgiría el islam de la mano de Mahoma. Aunque cada religión siguió su propio camino, las tres comparten un mismo origen y reconocen a figuras como Abraham y Moisés. Por eso reciben el nombre de religiones abrahámicas. Hoy reúnen a más de la mitad de la población mundial.",
    subhitos: [
      hito("un-dios-humanidad", "jesus-nazaret", "Jesús de Nazaret", "≈4 a. C.-30 d. C.",
        "¿Qué predicaba exactamente un hombre al que ejecutaron por ello?",
        [
          "Para entender a Jesús hay que entender su mundo. Judea era una provincia ocupada por Roma, con una presión fiscal aplastante y una expectativa religiosa a flor de piel: mucha gente esperaba a un Mesías, un enviado que expulsara a los romanos y restaurara el reino. Y había varios grupos discutiendo cómo ser fiel a Dios en esas condiciones: los fariseos, centrados en cumplir la ley en la vida diaria; los saduceos, la aristocracia del Templo; los esenios, que se habían retirado al desierto a esperar el final; y los zelotes, partidarios de la lucha armada.",
          "Jesús predicó unos tres años en un territorio pequeñísimo, no escribió nada y no salió de su región. Y su mensaje desconcertaba en todas direcciones.",
          "Hablaba de un Dios padre, cercano y misericordioso, no de un juez implacable. Ponía el perdón por encima de la venganza —hasta el punto de pedir amar al enemigo, algo que no tiene precedentes claros—. Y colocaba en el centro precisamente a quienes no contaban socialmente: enfermos, leprosos, pobres, prostitutas, recaudadores de impuestos, extranjeros, samaritanos, mujeres. Comía con ellos, y eso era el escándalo mayor, porque compartir mesa significaba aceptar como iguales.",
          "Enseñaba con parábolas, historias cortas de la vida del campo y del pueblo que obligan a pensar en lugar de dar la lección hecha: el hijo que se va y vuelve, el extranjero que ayuda al herido al que los religiosos han pasado de largo, la oveja perdida, el grano de mostaza.",
          "Y relativizaba normas rituales en nombre de la compasión —curar en sábado, tocar a un impuro—, lo que lo enfrentó con las autoridades religiosas de su propio pueblo. El choque decisivo llegó cuando entró en Jerusalén en la fiesta de Pascua, con la ciudad llena, y expulsó a los cambistas del Templo. Aquello atacaba a la vez el negocio y la autoridad de la institución más poderosa de Judea.",
          "Fue detenido, entregado a Poncio Pilato y crucificado, el castigo que Roma reservaba a esclavos y sediciosos. Y ahí, en principio, terminaba todo: un ajusticiado más en una provincia lejana.",
          "Lo que cambió la historia fue lo siguiente. Aquel grupo pequeño y aterrorizado empezó a anunciar que había resucitado, y esa convicción los volvió imparables: gente sin poder, sin dinero y sin formación se puso a predicar por todo el Mediterráneo, muchos hasta morir por ello.",
        ],
        "Dato curioso: de Poncio Pilato se dudó durante siglos hasta que en 1961 se encontró en Cesarea una piedra con su nombre y su cargo grabados. Y su existencia, junto con la ejecución de Jesús, la mencionan también fuentes no cristianas de la época, como el historiador romano Tácito y el judío Flavio Josefo."),
      hito("un-dios-humanidad", "pablo-tarso", "Pablo de Tarso", "≈5-67 d. C.",
        "¿Habría existido el cristianismo sin la decisión de un hombre que empezó persiguiéndolo?",
        [
          "Al morir Jesús, sus seguidores eran un grupo judío más. Rezaban en el Templo, cumplían la ley y discutían si aquel movimiento debía seguir dentro del judaísmo. Si nada hubiera cambiado, probablemente habría acabado como una corriente minoritaria más, desaparecida en el siglo II.",
          "Pablo era un fariseo culto de Tarso, ciudadano romano, y participó activamente en la persecución de los primeros cristianos. Camino de Damasco tuvo una experiencia que interpretó como un encuentro con Jesús resucitado, y pasó de perseguidor a propagandista.",
          "Su aportación no fue predicar más, fue tomar una decisión estratégica que lo cambió todo. En la reunión que llamamos concilio de Jerusalén, hacia el año 50, se discutió si los no judíos que quisieran entrar debían circuncidarse y cumplir las normas alimentarias. Pablo defendió que no. Y ganó.",
          "Piensa en lo que significa. Con esa decisión, cualquier persona del imperio —griego, romano, sirio, egipcio— podía incorporarse sin cambiar de cultura, sin someterse a una operación en la edad adulta y sin dejar de comer lo que comía su familia. El cristianismo dejó de ser una variante del judaísmo y se convirtió en una religión universal exportable.",
          "Y se puso a exportarla. Recorrió unos quince mil kilómetros en tres grandes viajes, fundando comunidades en Éfeso, Corinto, Filipos, Tesalónica, Galacia y Roma, trabajando de artesano para pagarse el camino, y con un currículo que él mismo enumera: naufragios, azotes, apedreamientos, cárceles y hambre.",
          "Además escribió, y esto es clave: sus cartas a esas comunidades son los textos cristianos más antiguos que existen, anteriores a los Evangelios. En una de ellas dejó una frase de un radicalismo asombroso para el siglo I: ya no hay judío ni griego, ni esclavo ni libre, ni hombre ni mujer.",
          "Fue ejecutado en Roma, probablemente durante la persecución de Nerón. Y su influencia teológica es tan grande que hay una discusión de siglos sobre cuánto del cristianismo viene de Jesús y cuánto viene de él.",
        ],
        "Dato curioso: algunas cartas atribuidas tradicionalmente a Pablo probablemente no son suyas, sino de discípulos posteriores, y justamente en varias de ellas están los pasajes más restrictivos sobre las mujeres y sobre la obediencia de los esclavos. Distinguir qué escribió él y qué se escribió en su nombre ha tenido consecuencias enormes en debates que siguen abiertos hoy."),
      hito("un-dios-humanidad", "cristianismo", "Cristianismo", "Desde el siglo I",
        "¿Cómo pasa un grupo perseguido a gobernar la religión del imperio que lo perseguía?",
        [
          "Durante tres siglos, los cristianos fueron una minoría sospechosa. Roma toleraba cualquier dios con una condición: participar en el culto público al emperador, que era el pegamento político del imperio. Ellos se negaban, y esa negativa se leyó como deslealtad.",
          "Se les acusaba además de cosas que hoy resultan casi cómicas: de ateos, porque no tenían estatuas ni templos; de incestuosos, porque se llamaban «hermanos» entre esposos; de caníbales, por lo que decían comer en sus reuniones; y de provocar la ira de los dioses, es decir, de ser culpables de cada sequía y cada epidemia.",
          "Las persecuciones fueron atroces pero intermitentes: estallidos locales durante décadas y dos grandes campañas imperiales, la de Decio en el 250 y la de Diocleciano en el 303, con templos derribados, libros quemados y ejecuciones en masa. La prueba para salvarse era mínima —quemar un poco de incienso ante la imagen del emperador—, y eso es lo que hace tan llamativo que muchos prefirieran morir.",
          "Y a pesar de todo crecieron, por razones muy concretas: aceptaban a cualquiera sin distinción de clase, sexo u origen; cuidaban de sus enfermos, viudas y huérfanos, lo que en las ciudades antiguas —donde la gente moría sola— era una red de apoyo real; enterraban a sus muertos; prometían una vida después igual para todos; y viajaban aprovechando las calzadas, los puertos y el griego común del imperio.",
          "En 313, Constantino cambió de estrategia y legalizó el cristianismo; en 380, Teodosio lo convirtió en religión oficial. En setenta años se pasó de la clandestinidad al poder, y eso trajo dos cosas a la vez: una capacidad de organización y de conservación cultural inmensa… y la tentación de usar la fuerza, ahora en el otro sentido.",
          "Lo que vino después es media historia de Europa: los concilios que fijaron la doctrina, el monacato, la conservación de los libros antiguos en los monasterios, las catedrales, las universidades, los hospitales, las órdenes mendicantes y las misiones. Y también la Inquisición, las cruzadas, la caza de brujas y la justificación religiosa de la conquista.",
          "Hoy son unos 2.400 millones de personas, la religión más numerosa del mundo, dividida en tres grandes ramas: católicos, protestantes y ortodoxos. Y su centro de gravedad se está moviendo: mientras Europa se seculariza, el cristianismo crece con fuerza en África y Asia.",
        ],
        "Dato curioso: la cruz, que era un instrumento de tortura romano, tardó siglos en usarse como símbolo: para los primeros cristianos era demasiado reciente y demasiado humillante, como sería hoy llevar colgada una silla eléctrica. Al principio usaban un pez, una ancla o un pastor con un cordero.",
        [
          {
            titulo: "Los monasterios: la red que salvó a Europa",
            cuerpo: [
              "Cuando el Imperio romano de Occidente se deshizo, en el siglo V, desaparecieron con él las escuelas, los archivos, la administración y buena parte del comercio del libro. Lo que quedó, y salvó los muebles, fueron los monasterios.",
              "El movimiento había empezado como una huida: hombres y mujeres que se retiraban al desierto de Egipto y de Siria a rezar en soledad. Después se organizó, y en el siglo VI Benito de Nursia escribió una regla que se convirtió en el modelo europeo, resumida en dos palabras: reza y trabaja.",
              "Esa regla incluía un detalle decisivo: obligaba a leer. Y para leer hay que tener libros, así que en cada monasterio había un taller de copia donde los monjes reproducían a mano no solo la Biblia, sino también a Virgilio, a Cicerón, tratados de agricultura, de medicina y de gramática. La mayor parte de la literatura latina que conservamos hoy existe porque alguien la copió en esos talleres, a veces sin entenderla del todo.",
              "Y hacían mucho más. Desecaron pantanos, talaron y cultivaron tierras, criaron ganado, mejoraron el vino y la cerveza, molieron con agua, atendieron enfermos, acogieron viajeros, alimentaron a pobres en la puerta y enseñaron a leer a los niños de los alrededores. Muchos pueblos y ciudades europeas nacieron alrededor de una abadía.",
              "También hubo mujeres al frente. Las abadesas gobernaban comunidades enteras con tierras y rentas, y algunas fueron figuras intelectuales de primer orden: Hildegarda de Bingen, en el siglo XII, escribió sobre teología, medicina y botánica, compuso música que todavía se graba y mantuvo correspondencia con papas y emperadores. Los conventos fueron durante siglos el único lugar donde una mujer podía estudiar, escribir, dirigir y no casarse.",
              "Su versión oriental fue igual de importante: los monasterios bizantinos y del Sinaí conservaron los manuscritos griegos, y los irlandeses, que nunca habían sido romanos, salieron a reevangelizar el continente llevando sus libros y sus escuelas.",
              "Sin proponérselo, aquella red de casas de oración funcionó como el sistema educativo, sanitario, agrícola y editorial de Europa durante seiscientos años.",
            ],
            dato: "Dato curioso: en algunos manuscritos medievales aparecen notas al margen escritas por los propios copistas, y son maravillosamente humanas: se quejan del frío, de la mala luz, de la tinta, del dolor de espalda o de que el gato ha pisado la página. Hay uno que remata: «gracias a Dios, pronto será de noche».",
          },
          {
            titulo: "Nicea, el credo y el concilio del siglo XX",
            cuerpo: [
              "Una religión sin autoridad central y con comunidades repartidas por medio mundo tiene un problema inevitable: cada una interpreta a su manera. La solución cristiana fueron los concilios, asambleas de obispos que decidían qué es doctrina y qué es error.",
              "El primero grande fue el de Nicea, en 325, convocado y presidido por el emperador Constantino, que no era teólogo pero necesitaba un imperio sin disputas. El asunto en discusión era si Jesús era de la misma naturaleza que Dios o una criatura suya, superior a todo pero creada, como sostenía un sacerdote llamado Arrio.",
              "La diferencia entre las dos posturas se jugaba en una letra griega de diferencia entre dos palabras, y aquello dividió al imperio durante décadas, con obispos desterrados, disturbios en las calles y pueblos enteros alineados con un bando. Del concilio salió el credo que todavía se recita en las iglesias.",
              "Después vinieron muchos más: se fijó el canon del Nuevo Testamento (los cuatro Evangelios que conocemos, y fuera decenas de textos apócrifos), la doble naturaleza de Cristo, el papel de María, la fecha de la Pascua.",
              "Y hubo uno, mil seiscientos años más tarde, que cambió la vida cotidiana de mil millones de personas: el Concilio Vaticano II (1962-1965). Autorizó celebrar la misa en la lengua de cada país en lugar del latín y con el sacerdote de cara a la gente; reconoció expresamente la libertad religiosa como un derecho; abrió el diálogo con otras confesiones; y declaró que no se puede acusar al pueblo judío de la muerte de Jesús, cerrando una acusación que había alimentado persecuciones durante siglos.",
              "Ese concilio es un buen recordatorio de algo que atraviesa toda esta historia: las religiones no son bloques congelados. Cambian, discuten, se corrigen y a veces se desdicen, y esos cambios se deciden en reuniones concretas, con nombres, fechas y votaciones.",
            ],
            dato: "Dato curioso: de aquellos primeros concilios sale también nuestra palabra «símbolo». El credo se llamaba en griego symbolon: una contraseña, la señal por la que los cristianos de una comunidad reconocían a los de otra como suyos.",
          },
        ]),
      hito("un-dios-humanidad", "mahoma-islam", "Mahoma y el islam", "610-632",
        "¿Cómo se unifica en veinte años una península de tribus enfrentadas?",
        [
          "A comienzos del siglo VII, Arabia era un mosaico de tribus que se peleaban por el agua, el ganado y el honor, con venganzas de sangre que duraban generaciones. La Meca era una ciudad de comerciantes y un santuario con decenas de ídolos, lo que la convertía también en un buen negocio de peregrinación.",
          "Mahoma nació allí hacia el 570. Huérfano de padre antes de nacer y de madre a los seis años, criado por su abuelo y su tío, trabajó como pastor y luego en el comercio de caravanas, con tal reputación de honradez que lo llamaban «el fiable».",
          "Hacia los cuarenta años, en una cueva del monte Hira donde se retiraba a meditar, tuvo la experiencia que lo cambió todo: dice haber recibido la orden de recitar. Volvió a casa aterrorizado, temiendo estar enfermo, y fue su esposa Jadiya —comerciante viuda, quince años mayor y su antigua jefa— quien lo tranquilizó y se convirtió en la primera creyente.",
          "Su mensaje era simple y explosivo: hay un solo Dios, todos los seres humanos son iguales ante Él, hay que dar de lo tuyo a los pobres, los huérfanos y las viudas, y habrá un juicio. En La Meca eso atacaba a la vez los ídolos, el negocio que generaban y el orden tribal.",
          "Lo persiguieron, boicotearon a su clan y maltrataron a sus seguidores, hasta que en 622 emigró con su comunidad a Medina. Esa emigración, la Hégira, marca el año 1 del calendario islámico, y es significativo que el islam no empiece a contar desde el nacimiento del profeta ni desde la revelación, sino desde el momento en que nace la comunidad.",
          "En Medina fue predicador, juez, legislador y jefe militar. Redactó un pacto que unía a emigrados, medineses y tribus judías en una misma comunidad; libró guerras contra La Meca; y en el 630 entró en ella prácticamente sin sangre, destruyó los ídolos de la Kaaba y perdonó a casi todos sus enemigos.",
          "Murió en 632 habiendo convertido a un conjunto de tribus rivales en una comunidad con una fe, una ley y un proyecto común. Un siglo después, sus sucesores gobernaban de la India a España.",
        ],
        "Dato curioso: en su último sermón dejó una frase que se sigue citando en todo el mundo musulmán: toda la humanidad viene de Adán y Eva, y ni un árabe es superior a un no árabe ni un blanco a un negro. Su primer almuédano, la voz que llamaba a la oración, fue Bilal, un esclavo abisinio liberado.",
        [
          {
            titulo: "Los cinco pilares y el Corán",
            cuerpo: [
              "El islam es una religión sin clero, sin sacramentos y sin intermediarios: cualquier creyente se dirige directamente a Dios. Lo que tiene es una práctica muy definida, resumida en cinco obligaciones.",
              "LA PROFESIÓN DE FE (shahada). Basta declarar con sinceridad que no hay más dios que Dios y que Mahoma es su mensajero. Es lo único que hace falta para ser musulmán: no hay bautismo, ni iniciación, ni autoridad que lo autorice.",
              "LA ORACIÓN (salat). Cinco veces al día, en momentos marcados por la posición del sol, orientándose hacia La Meca. Cinco pausas diarias que estructuran el día entero y que se hacen igual en Yakarta, en El Cairo o en Detroit.",
              "LA LIMOSNA (zakat). No es caridad voluntaria, es una obligación: en torno al 2,5 % de los bienes acumulados cada año, destinado a pobres, endeudados, viajeros y necesitados. Es, de hecho, un impuesto religioso redistributivo.",
              "EL AYUNO DE RAMADÁN. Un mes entero sin comer, beber, fumar ni mantener relaciones desde el alba hasta la puesta de sol, con exenciones para enfermos, embarazadas, niños y viajeros. Su sentido declarado es doble: disciplina y experimentar en el propio cuerpo lo que es el hambre.",
              "LA PEREGRINACIÓN (hach). Una vez en la vida, quien pueda, va a La Meca. Todos se visten con las mismas telas blancas sin costuras, sin señales de riqueza ni de origen, y hacen los mismos ritos. Es la mayor reunión anual de seres humanos del planeta: unos dos millones de personas en unos pocos días.",
              "Y EL CORÁN. No es exactamente el equivalente de la Biblia: para un musulmán es la palabra literal de Dios, dictada en árabe, no la narración de una historia sagrada escrita por autores humanos. De ahí varias consecuencias: se memoriza (hay millones de personas que lo saben entero), se recita en voz alta con una musicalidad muy cuidada, y una traducción se considera una ayuda, nunca el Corán mismo.",
              "De la prohibición de representar a Dios y a los profetas salió además una de las tradiciones artísticas más originales del mundo: como no se podía pintar figuras en el ámbito religioso, se desarrollaron la caligrafía, la geometría y los patrones infinitos que decoran la Alhambra o la mezquita de Córdoba. La letra se convirtió en arte.",
              "Junto al Corán está la sunna, el ejemplo de la vida del profeta recogido en los hadices, y de la combinación de ambos se elaboró la sharía, un cuerpo de derecho con varias escuelas de interpretación que discrepan entre sí; no es un código único ni uniforme, y su aplicación varía enormemente de un país a otro.",
            ],
            dato: "Dato curioso: solo alrededor del 20 % de los musulmanes del mundo son árabes. El país con más musulmanes es Indonesia, y hay más en la India o en Pakistán que en todo Oriente Próximo.",
          },
          {
            titulo: "Los sufíes: la vía del amor",
            cuerpo: [
              "Dentro del islam hay una corriente que a mucha gente le sorprende: el sufismo, su dimensión mística. No es una rama separada como los suníes y los chiíes, sino una forma de vivir la religión que atraviesa las dos.",
              "Su punto de partida es que cumplir la ley no es suficiente: lo que se busca es una experiencia directa de Dios, aquí y ahora, y el camino para eso es el amor y el desprendimiento del propio ego.",
              "Sus métodos son característicos: la repetición rítmica de los nombres de Dios, la música, la poesía y, en algunas cofradías, la danza. Los famosos derviches giróvagos de Turquía giran sobre sí mismos con una mano hacia el cielo y otra hacia la tierra, en una coreografía que representa recibir y transmitir.",
              "Y produjo una literatura extraordinaria. Rumi, un poeta persa del siglo XIII, escribió miles de versos sobre el amor divino y humano; Al-Ghazali reconcilió filosofía y fe; Ibn Arabi, andalusí, escribió que su corazón se había vuelto capaz de todas las formas: monasterio, templo, sinagoga y Kaaba.",
              "El sufismo fue además el gran motor de expansión del islam en África occidental, la India, Anatolia e Indonesia, mucho más que los ejércitos: llegaba con maestros, poemas, hospitales y música, y se acoplaba a las devociones locales.",
              "Y hoy es también un objetivo. Los movimientos fundamentalistas lo consideran una desviación —por su veneración de santos y tumbas, por la música, por la participación de mujeres— y han atacado y destruido santuarios sufíes en Malí, Pakistán, Libia y Egipto. La versión más tolerante y poética del islam es una de las más perseguidas por la más rígida.",
            ],
            dato: "Dato curioso: Rumi, un místico musulmán del siglo XIII, ha sido durante años uno de los poetas más vendidos en Estados Unidos. Millones de personas leen y citan sus versos sobre el amor sin saber que están leyendo teología islámica.",
          },
        ]),
    ],
  },
  {
    key: "fe-se-divide",
    titulo: "Cuando una fe se divide",
    anio: "632-1517",
    intro:
      "Ninguna religión permanece igual para siempre. A medida que las grandes religiones crecían y se extendían por nuevos territorios, comenzaron a surgir diferencias sobre cómo debían interpretarse sus enseñanzas y quién tenía autoridad para dirigir a los creyentes. En muchas ocasiones, estas discusiones no fueron solo religiosas: también estuvieron influidas por la política, la cultura, la lengua y el dinero. El resultado fue el nacimiento de nuevas ramas que, aunque compartían un mismo origen, siguieron caminos distintos. Y conviene fijarse en un patrón que se repite en las tres divisiones de esta etapa: casi ninguna empezó por un debate teológico. Empezaron por una pregunta mucho más terrenal —quién manda— y la teología llegó después a justificar la separación.",
    subhitos: [
      hito("fe-se-divide", "sunies-chiies", "Suníes y chiíes", "Desde 632",
        "¿Quién debía suceder a Mahoma? De esa pregunta salieron catorce siglos de división.",
        [
          "Cuando Mahoma murió en el año 632 dejó una comunidad unida y un problema enorme sin resolver: no había dicho con claridad quién debía dirigirla.",
          "Un grupo sostuvo que el nuevo líder debía elegirse entre los creyentes más capaces y respetados, y eligió a Abu Bakr, su amigo y suegro. De esa postura nacieron los suníes, que hoy son entre el 85 y el 90 % de los musulmanes; su nombre viene de sunna, la tradición del profeta.",
          "Otro grupo sostuvo que el liderazgo debía permanecer en su familia y apoyó a Alí, primo, yerno y uno de sus primeros seguidores. De ahí vienen los chiíes: shiat Alí significa «el partido de Alí».",
          "Alí llegó a ser califa años después y fue asesinado. Y entonces ocurrió el acontecimiento que convirtió una disputa política en una identidad religiosa profunda: en el año 680, en Kerbala, su hijo Husein, nieto del profeta, se enfrentó con un puñado de acompañantes a un ejército inmensamente superior y fue masacrado con casi toda su familia.",
          "Ese episodio es, para el chiismo, lo que la crucifixión es para el cristianismo: el sufrimiento del inocente convertido en el centro emocional de la fe. Cada año, en la Ashura, millones de personas lo conmemoran con procesiones, teatro sagrado, llanto público y, en algunos lugares, autoflagelación.",
          "Con el tiempo, las diferencias se hicieron estructurales. Los chiíes desarrollaron una jerarquía de líderes religiosos con autoridad para interpretar —los imanes y, hoy, los ayatolás—, mientras que el suní no tiene clero jerárquico, sino sabios y juristas. Los chiíes creen además que el duodécimo imán no murió, sino que está oculto y volverá.",
          "Y hoy la división pesa sobre la política mundial: Irán es la gran potencia chií desde que Persia se convirtió en el siglo XVI, Arabia Saudí lidera el bloque suní, y muchos conflictos de Oriente Próximo se explican tanto por esa rivalidad geopolítica como por la religión.",
          "Es importante decir lo obvio, porque se olvida: comparten el mismo Corán, el mismo Dios, el mismo profeta, los mismos cinco pilares y rezan hacia el mismo sitio. Y los grandes grupos terroristas surgidos de interpretaciones extremistas suníes son rechazados y condenados por la inmensa mayoría de los musulmanes suníes del mundo.",
        ],
        "Dato curioso: el sufismo, la corriente mística, atraviesa las dos ramas y ha sido durante siglos un puente entre ellas. Muchos santos y poetas son venerados a la vez por suníes y chiíes."),
      hito("fe-se-divide", "gran-cisma", "El Gran Cisma", "1054",
        "¿Puede una misma Iglesia acabar convirtiéndose en dos sin que nadie lo decida del todo?",
        [
          "Las iglesias de Roma y de Constantinopla llevaban siglos separándose sin proponérselo. No fue un divorcio, fue una deriva.",
          "Hablaban idiomas distintos —latín en Occidente, griego en Oriente—, lo que hacía que discutieran los mismos textos sin entenderse bien. Vivían en mundos políticos opuestos: en Oriente había un emperador poderoso y la Iglesia formaba parte del Estado; en Occidente el imperio había desaparecido y el papa había ocupado ese vacío, también políticamente.",
          "Y tenían dos discusiones de fondo. Una teológica: Occidente había añadido al credo una expresión —el Filioque— sin consultar a Oriente, y para los orientales eso era manipular un texto acordado en concilio. Y otra de poder: el papa reclamaba autoridad sobre toda la Iglesia; el patriarca de Constantinopla lo consideraba, como mucho, el primero entre iguales.",
          "Se sumaban diferencias que a nosotros parecen pequeñas y entonces no lo eran: si los sacerdotes podían casarse (en Oriente sí), si el pan de la eucaristía llevaba levadura, cómo se hacía la señal de la cruz, cómo se calculaba la Pascua.",
          "En 1054, en medio de una negociación que fue de mal en peor, los enviados del papa y el patriarca se excomulgaron mutuamente. En su momento pareció un incidente diplomático más.",
          "Lo que hizo la ruptura definitiva fue algo posterior y bochornoso: en 1204, los cruzados occidentales que iban a Tierra Santa saquearon Constantinopla durante tres días, profanaron Santa Sofía y se llevaron sus reliquias y sus obras de arte. Después de eso, la reconciliación se volvió emocionalmente imposible.",
          "Desde entonces hay dos grandes ramas: la Iglesia católica, con el papa como máxima autoridad, y las Iglesias ortodoxas, unas quince iglesias nacionales independientes que comparten fe y liturgia y no reconocen la autoridad del papa. Son unos 220 millones de personas, sobre todo en Rusia, Grecia, los Balcanes, Ucrania, Rumanía, Georgia, Etiopía y Oriente Próximo.",
        ],
        "Dato curioso: aquellas excomuniones estuvieron técnicamente en vigor 911 años. Se levantaron en 1965, cuando el papa Pablo VI y el patriarca Atenágoras las anularon conjuntamente y se abrazaron en público.",
        [
          {
            titulo: "Las imágenes: la guerra que definió el arte cristiano",
            cuerpo: [
              "Hay una pelea religiosa que no se suele contar y que explica por qué el arte cristiano oriental y occidental son tan distintos: la iconoclasia.",
              "El problema era serio. La Biblia prohíbe hacer imágenes y adorarlas, y sin embargo las iglesias se habían llenado de figuras de Cristo, de María y de los santos. ¿Eso era ayuda a la devoción o idolatría disfrazada?",
              "En el año 726 el emperador bizantino decidió que era idolatría y ordenó destruirlas. Durante más de un siglo, con interrupciones, se picaron mosaicos, se quemaron tablas y se persiguió, torturó y mutiló a quienes las defendían, muchos de ellos monjes. Fue una guerra civil cultural.",
              "Los defensores de las imágenes ganaron finalmente en el año 843, con un argumento teológico fino: si Dios mismo se hizo hombre y tuvo un rostro concreto, ese rostro se puede pintar; negarlo sería negar que se encarnó de verdad.",
              "De ahí sale el icono ortodoxo tal como lo conocemos, con sus reglas estrictas: no es un cuadro decorativo ni un retrato realista, es una «ventana» sagrada, se pinta siguiendo modelos fijos, sin perspectiva ni sombras, sin firma del autor, y se reza delante de él y se besa. En cambio, la escultura de bulto casi desaparece en Oriente, mientras que en Occidente florece hasta llegar a Miguel Ángel y a las tallas barrocas.",
              "Y el debate no se cerró para siempre. Volvió con enorme violencia en el siglo XVI, cuando los protestantes más radicales entraron en las iglesias de los Países Bajos, Suiza y Escocia y destruyeron imágenes, retablos y vidrieras por miles. Por eso un templo calvinista está desnudo y uno católico de la misma época está lleno de oro: no es cuestión de gusto, es una discusión teológica de mil doscientos años.",
              "En el islam la misma pregunta se resolvió de otra manera: sin figuras, y con la caligrafía y la geometría convertidas en el arte religioso por excelencia.",
            ],
            dato: "Dato curioso: el iconoclasta original era un emperador, y la palabra ha acabado significando lo contrario de lo que era: hoy llamamos «iconoclasta» a quien rompe convenciones establecidas. Empezó siendo el nombre de quien rompía cuadros por orden del poder.",
          },
        ]),
      hito("fe-se-divide", "reforma-protestante", "La Reforma Protestante", "1517",
        "¿Cómo puede un documento académico partir en dos la religión de Europa?",
        [
          "En 1517, un fraile y profesor de teología alemán, Martín Lutero, hizo públicas 95 tesis para debatir. El motivo inmediato era escandaloso: se vendían indulgencias —documentos que prometían reducir el castigo por los pecados— para financiar la construcción de San Pedro del Vaticano, con predicadores que llegaban a asegurar que en cuanto la moneda sonaba en el cofre un alma salía del purgatorio.",
          "Lutero no pretendía fundar una iglesia; pretendía discutir. Pero sus tesis se imprimieron, se tradujeron y circularon por toda Alemania en semanas. Fue el primer fenómeno viral de la historia, y sin la imprenta —inventada apenas setenta años antes— habría acabado como otras protestas anteriores: en una hoguera y en silencio.",
          "Sus tres ideas centrales desmontaban el sistema. La salvación se recibe por la fe y no se compra con obras ni con dinero. La única autoridad es la Biblia, no la tradición ni el papa. Y todo creyente es sacerdote de sí mismo, es decir: no necesita intermediarios para dirigirse a Dios.",
          "Para que eso fuera posible hizo algo decisivo: tradujo la Biblia al alemán, para que cualquiera pudiera leerla. Y ahí está el efecto cultural más duradero de la Reforma: si cada persona debe leer las Escrituras por sí misma, hay que enseñar a leer a todo el mundo. Los países protestantes alcanzaron tasas de alfabetización muy superiores durante siglos, incluida la de las mujeres.",
          "Se extendió tan rápido porque encajaba con intereses muy terrenales: los príncipes alemanes ganaban independencia frente al emperador y al papa —y de paso se quedaban con las tierras de la Iglesia—, y las ciudades comerciales veían con buenos ojos una religión menos ritual y más centrada en el trabajo y en la conciencia individual.",
          "El resultado fue una fractura permanente: luteranos; calvinistas, que organizaron Ginebra como una república religiosa severísima; anglicanos, cuando Enrique VIII se separó de Roma por un asunto de divorcio y se declaró cabeza de la Iglesia de Inglaterra; y grupos radicales como los anabaptistas, perseguidos por todos los bandos.",
          "Y la Iglesia católica respondió con el Concilio de Trento: prohibió la venta de indulgencias, obligó a los obispos a residir en sus diócesis, creó los seminarios para formar a los curas, fundó los jesuitas y montó las misiones y la enseñanza. Se reformó de verdad, y a la vez reforzó la Inquisición y publicó el Índice de libros prohibidos.",
        ],
        "Dato curioso: la historia de Lutero clavando las tesis a martillazos en la puerta de la iglesia de Wittenberg puede ser una leyenda posterior. Lo que sí consta es que las envió por carta a su arzobispo. Quienes convirtieron aquello en un movimiento fueron los impresores.",
        [
          {
            titulo: "El precio de la división: guerras, brujas y —al final— tolerancia",
            cuerpo: [
              "Lo que vino después de 1517 fue siglo y medio de violencia religiosa, y merece contarse porque de ahí sale, por agotamiento, una de las ideas más valiosas que tenemos.",
              "LAS GUERRAS. Guerras campesinas en Alemania; guerras civiles en Francia, con la matanza de San Bartolomé en 1572, en la que miles de protestantes fueron asesinados en París en pocos días; la sublevación de los Países Bajos; la guerra civil inglesa. Y sobre todo la Guerra de los Treinta Años (1618-1648), que arrasó Alemania y le costó, en algunas regiones, un tercio de su población. Empezó siendo religiosa y terminó siendo una lucha de poder entre Estados, con la católica Francia peleando del lado protestante por conveniencia política.",
              "LAS BRUJAS. En los mismos siglos, y sobre todo entre 1560 y 1630, se ejecutó en Europa a unas cuarenta o cincuenta mil personas acusadas de brujería, la gran mayoría mujeres, muchas de ellas pobres, viudas, ancianas o simplemente incómodas para su vecindario. Y aquí hay un dato incómodo: no fue solo cosa de la Inquisición católica —de hecho, la Inquisición española fue relativamente escéptica con las acusaciones de brujería—, sino que las mayores oleadas se dieron en tribunales civiles y en regiones con fuerte competencia entre católicos y protestantes. La caza de brujas fue mucho más intensa en la Europa fracturada que en la Europa homogénea.",
              "Y hubo un elemento tecnológico: el «Malleus Maleficarum», el manual para detectar y juzgar brujas, fue uno de los grandes éxitos editoriales de los primeros tiempos de la imprenta. La misma máquina que difundió la Biblia en lengua vulgar difundió el manual de la caza.",
              "LA SALIDA. La Paz de Westfalia, en 1648, no resolvió quién tenía razón: renunció a resolverlo. Se aceptó que había territorios de una confesión y de otra, que no se iba a convertir al vecino por la fuerza y que los Estados debían tratar entre sí al margen de la fe. De ahí nacen dos cosas: el Estado soberano moderno y el principio de que la religión no puede ser motivo de guerra entre naciones.",
              "Un siglo más tarde, la Ilustración convirtió esa tregua práctica en un principio: la libertad de conciencia. Y en 1948 acabó escrito como derecho humano: toda persona tiene derecho a la libertad de pensamiento, de conciencia y de religión, y a cambiar de religión o a no tener ninguna.",
              "Es una de esas lecciones que la historia enseña por la vía dura: la tolerancia religiosa en Europa no llegó porque alguien se volviera bueno, llegó cuando se comprobó que la alternativa era matarse durante generaciones sin convencer a nadie.",
            ],
            dato: "Dato curioso: al sociólogo Max Weber le llamó la atención que las zonas protestantes se industrializaran antes, y lo explicó por una ética del trabajo, el ahorro y la vocación profesional entendida como servicio a Dios. Su tesis se sigue discutiendo, pero dio nombre a la idea popular de «ética protestante del trabajo».",
          },
        ]),
      hito("fe-se-divide", "sijismo", "El sijismo", "Desde 1499",
        "¿Se puede fundar una religión nueva justo en la frontera entre dos religiones enfrentadas?",
        [
          "En el Punyab, al norte de la India, convivían a finales del siglo XV el hinduismo, con sus castas y sus rituales, y el islam, que llevaba siglos gobernando la región. Un hombre llamado Nanak salió de allí con una frase que lo resume todo: no hay hindú ni musulmán, solo hay seres humanos.",
          "Su enseñanza tomaba y rechazaba de los dos lados. Aceptaba un solo Dios, sin forma y sin imagen, presente en todo. Rechazaba el sistema de castas, los ídolos, los ayunos extremos, las peregrinaciones obligatorias, el clero profesional y la idea de que un ritual pueda sustituir a la conducta.",
          "Y su moral es asombrosamente concreta y poco mística: trabaja honradamente, recuerda a Dios y comparte lo que tienes. No hay que retirarse del mundo ni renunciar a la familia: hay que ser decente dentro de la vida normal.",
          "A Nanak siguieron nueve gurús más, y el décimo hizo algo insólito: declaró que no habría un undécimo gurú humano y que el maestro eterno de los sijes sería el LIBRO. El Guru Granth Sahib se trata desde entonces como una persona viva —se le abanica, se le acuesta, se lo despierta—, y lo más notable es su contenido: incluye poemas de autores hindúes y musulmanes junto a los de los gurús sijes. Es probablemente la única escritura sagrada del mundo que incorpora deliberadamente voces de otras religiones.",
          "Su institución más impresionante es el langar: cada templo sij tiene una cocina comunitaria donde se sirve comida gratis a cualquiera, sin preguntar religión, casta ni situación, y todos se sientan en el suelo al mismo nivel. En un país con castas, comer juntos sentados igual era una declaración política. El Templo Dorado de Amritsar sirve del orden de cien mil comidas gratuitas al día, todos los días.",
          "Su historia tiene mucha sangre: dos gurús fueron ejecutados por los emperadores mogoles, y uno de ellos, Teg Bahadur, murió defendiendo el derecho de los HINDÚES a practicar su religión, no la suya. En 1699 se fundó la comunidad de los iniciados, con sus cinco símbolos —entre ellos el pelo sin cortar bajo el turbante y un pequeño puñal— y el compromiso de defender a los oprimidos de cualquier fe.",
          "Hoy son entre veinticinco y treinta millones de personas, la quinta religión organizada del mundo, y su rasgo más reconocible sigue siendo el servicio: cuando hay una catástrofe en la India o en cualquier país donde haya comunidad sij, sus cocinas de campaña suelen estar entre las primeras en llegar.",
        ],
        "Dato curioso: tras los atentados del 11-S, muchos sijes de Estados Unidos y Europa sufrieron agresiones porque sus turbantes y barbas se confundieron con la imagen del terrorismo islamista. Miembros de una religión fundada precisamente para superar la división entre religiones fueron atacados por una confusión entre religiones."),
    ],
  },
  {
    key: "mundo-muchas-creencias",
    titulo: "Un mundo, muchas creencias",
    anio: "Siglos XVI-Actualidad",
    intro:
      "Por primera vez en la historia, las grandes religiones comenzaron a convivir. Durante la mayor parte del pasado, las religiones permanecieron ligadas a un territorio concreto: el hinduismo en la India, el budismo en Asia, el cristianismo en Europa, el islam en Oriente Próximo y el norte de África. Sin embargo, a partir del siglo XV el mundo empezó a cambiar rápidamente. Los grandes viajes oceánicos, el comercio internacional, las conquistas y, más tarde, las migraciones y la digitalización hicieron que personas de culturas y religiones muy diferentes comenzaran a convivir. Hoy, además, ha aparecido en el mapa algo nuevo: cientos de millones de personas que no se identifican con ninguna religión. Esta última etapa es la de la convivencia, la mezcla y también la de una pregunta que la humanidad nunca se había hecho a esta escala: ¿se puede vivir sin religión?",
    subhitos: [
      hito("mundo-muchas-creencias", "expansion-religiones", "La expansión de las grandes religiones", "Siglos XVI-XXI",
        "¿Qué ocurre cuando una religión llega a un lugar que ya tenía la suya?",
        [
          "A partir de finales del siglo XV, con los grandes viajes oceánicos, las religiones dejaron de estar ligadas a su región de origen. Y el modo en que viajaron determinó lo que pasó después.",
          "EL CRISTIANISMO viajó con los imperios. En América, África y Oceanía la evangelización fue casi siempre parte de la conquista o de la colonización: bautismos masivos, destrucción de templos e imágenes locales, prohibición de rituales. Y a la vez produjo cosas contrarias entre sí: escuelas, hospitales, la primera gramática escrita de decenas de lenguas indígenas —los misioneros que las estudiaron para predicar son hoy la principal fuente de conocimiento de esas lenguas— y también las voces que denunciaron la explotación desde dentro, como Bartolomé de las Casas.",
          "EL ISLAM viajó sobre todo con el comercio y con maestros sufíes, y eso explica un dato que sorprende: los dos países con más musulmanes del mundo —Indonesia y la India— nunca fueron conquistados por ejércitos árabes. Llegó con mercaderes, matrimonios y cofradías, y por eso se mezcló mucho con las costumbres locales.",
          "EL BUDISMO ya llevaba siglos expandiéndose por Asia y, a partir del siglo XIX, entró en Occidente por una vía inesperada: los libros. Filósofos, orientalistas y luego maestros japoneses y tibetanos lo introdujeron en Europa y Estados Unidos como filosofía y como práctica de meditación más que como religión.",
          "EL HINDUISMO se movió con las personas: primero con los trabajadores llevados por el Imperio británico al Caribe, África oriental y Fiyi, y después con la emigración cualificada del siglo XX a Reino Unido, Estados Unidos y Canadá.",
          "Y por todas partes ocurrió lo mismo que ya había ocurrido siempre: la mezcla. Casi ninguna religión sustituyó por completo a la anterior; se superpuso. Fiestas antiguas con nombre nuevo, santos que ocupan el lugar de divinidades locales, calendarios que encajan unos con otros. Es lo que los antropólogos llaman sincretismo, y no es una anomalía: es el modo normal en que las religiones se han movido durante toda la historia.",
        ],
        "Dato curioso: hoy hay más cristianos en África que en Europa, y el país con más protestantes evangélicos del mundo después de Estados Unidos es Brasil. El mapa religioso del planeta se ha dado la vuelta en un siglo."),
      hito("mundo-muchas-creencias", "mundo-conectado", "Un mundo conectado", "Siglos XX-XXI",
        "¿Qué cambia cuando puedes conocer todas las religiones sin salir de tu casa?",
        [
          "Durante casi toda la historia, la religión de una persona la decidía el lugar donde nacía. Hoy, por primera vez, una parte enorme de la humanidad puede comparar, elegir, mezclar o rechazar. Y eso lo cambia todo.",
          "El primer motor fueron las migraciones: en el siglo XX, decenas de millones de personas se trasladaron de continente, y con ellas sus creencias. Hoy hay mezquitas en Londres, templos hindúes en Toronto, monasterios budistas en California y sinagogas en Buenos Aires, y en cualquier ciudad grande convive todo eso con vecinos que no creen en nada.",
          "El segundo ha sido internet, con dos efectos opuestos y simultáneos. Por un lado, un acceso al conocimiento religioso que ni los especialistas tenían hace treinta años: textos sagrados traducidos, clases, comunidades a distancia, oración y meditación guiadas, retransmisión de ceremonias. Por otro, la posibilidad de encerrarse en una burbuja donde solo se escucha una versión, y la aparición de predicadores con millones de seguidores y ninguna institución que los controle.",
          "También ha cambiado la forma de creer, y no solo la de dejar de hacerlo. Mucha gente construye su propia combinación: meditación de origen budista, yoga hindú, la Navidad de su familia, algo de astrología, ideas de varias tradiciones. Los sociólogos lo llaman religiosidad «a la carta», y es hoy una de las formas más extendidas de espiritualidad en Occidente.",
          "Y ha ocurrido algo que muchos no esperaban. En el siglo XX se daba casi por hecho que la modernidad haría desaparecer la religión. No ha pasado: se ha transformado, y en muchos lugares ha ganado fuerza precisamente como IDENTIDAD política. El nacionalismo hindú en la India, el evangelismo político en América, el islamismo, la Iglesia ortodoxa rusa alineada con el Kremlin o el nacionalcatolicismo son fenómenos del siglo XXI, no restos del pasado.",
          "El resultado es un mundo con las dos cosas a la vez: más diálogo interreligioso que nunca —hay encuentros, declaraciones conjuntas y colaboración en ayuda humanitaria— y una parte del planeta donde la religión es el marcador de quién es de los nuestros y quién no.",
        ],
        "Dato curioso: en 1893 se celebró en Chicago el primer Parlamento Mundial de las Religiones, y fue la primera vez en la historia que representantes de hinduismo, budismo, jainismo, islam, judaísmo y varias iglesias cristianas se sentaron en un mismo estrado a explicarse ante el público. Hasta entonces, cada religión había hablado casi siempre de las otras sin ellas delante."),
      hito("mundo-muchas-creencias", "secularizacion", "El mundo religioso hoy", "Siglos XX-XXI",
        "¿Y si la novedad más grande de nuestra época fuera la gente que no cree en nada?",
        [
          "Si repartimos hoy a la humanidad por creencias, el mapa queda aproximadamente así: unos 2.400 millones de cristianos (en torno al 31 %), unos 1.900 millones de musulmanes (25 %), unos 1.200 millones de personas sin afiliación religiosa (16 %), unos 1.200 millones de hindúes (15 %), unos 500 millones de budistas (7 %), varios cientos de millones de practicantes de religiones populares y tradicionales, y unos 15 millones de judíos.",
          "Fíjate en el tercer grupo, porque es históricamente nuevo: si los «sin religión» fueran una religión, serían la tercera del mundo. Nunca antes había existido nada parecido a esa escala.",
          "Y hay que precisar qué es ese grupo, porque no son todos ateos militantes. Ahí caben ateos, agnósticos, personas que creen en algo indefinido, y muchísima gente que simplemente ha dejado de practicar y de identificarse con la religión de su familia sin haber tomado nunca una decisión formal.",
          "¿Por qué ha pasado? Se apuntan varias causas que se refuerzan entre sí. La ciencia ha ido ocupando el terreno explicativo que antes era religioso: hoy no se reza para saber por qué llueve. El Estado ha asumido funciones que hacía la Iglesia: escuela, hospital, registro de nacimientos, ayuda al necesitado. La urbanización rompió el control social del pueblo pequeño, donde no ir a misa se notaba. Y hay una correlación muy consistente que resulta muy reveladora: cuanto más seguro es materialmente un país —sanidad, pensiones, empleo, baja mortalidad infantil—, menos religiosa es su población. Donde la vida es más frágil, la religión es más fuerte.",
          "Pero conviene no confundir Europa con el mundo. La secularización es intensa en Europa occidental, Japón, Corea, Canadá, Australia y en las clases urbanas de muchos países; y a la vez el planeta se está volviendo, en conjunto, MÁS religioso, simplemente por demografía: las poblaciones más creyentes son las que más crecen. Las proyecciones apuntan a que a mediados de siglo habrá más musulmanes que nunca, más cristianos que nunca y un porcentaje de «sin religión» estancado o a la baja, no porque la gente vuelva a creer, sino porque tiene menos hijos.",
          "Y ha aparecido otra cosa: espiritualidad sin religión. Meditación, mindfulness, yoga, retiros, ayahuasca, astrología, autoconocimiento, terapias que hablan de sentido y de propósito. Muchas de esas prácticas vienen directamente de tradiciones religiosas y se usan hoy sin su marco de creencias. La necesidad no ha desaparecido; ha cambiado de sitio.",
          "Y sigue habiendo una asignatura pendiente: la libertad religiosa. El artículo 18 de la Declaración Universal de los Derechos Humanos reconoce el derecho a creer, a cambiar de religión y a no tener ninguna. En una parte importante del mundo, ejercer ese derecho —convertirse, dejar de creer, criticar la religión mayoritaria— sigue costando el trabajo, la libertad o la vida.",
        ],
        "Dato curioso: en varios países, la casilla «sin religión» es hoy la más numerosa entre los menores de treinta años, mientras en otros la religiosidad juvenil crece. Es probablemente el primer momento de la historia en que dos partes del mundo van en direcciones religiosas opuestas a la vez."),
      hito("mundo-muchas-creencias", "viaje", "Un viaje de miles de años", "",
        "",
        [
          "Hace decenas de miles de años, un pequeño grupo de cazadores observaba una tormenta y pensaba que algún espíritu habitaba en el cielo. No conocían la ciencia ni la escritura, pero ya se hacían preguntas que siguen acompañándonos hoy.",
          "Con el tiempo llegaron las aldeas, las primeras ciudades y los templos. Nacieron dioses con nombre propio, sacerdotes, reyes divinizados y grandes mitologías. Más tarde aparecieron profetas y sabios que comenzaron a preguntarse por el bien, el mal, el sufrimiento y el sentido de la vida. Surgieron religiones que unieron a pueblos enteros y otras que aspiraban a llevar su mensaje a toda la humanidad.",
          "Las religiones cambiaron, se dividieron, se influyeron mutuamente y viajaron por todo el planeta. Algunas desaparecieron; otras siguen reuniendo a miles de millones de personas. Y todas, mirando hacia atrás, han hecho dos cosas al mismo tiempo: han consolado, organizado, curado, alfabetizado, construido hospitales y sostenido a gente en su peor momento… y han servido para justificar guerras, hogueras, castas, conquistas y silencios.",
          "Eso no es una contradicción de las religiones: es una característica de todo lo que los seres humanos hacemos en grande. La misma capacidad de creer juntos que permite levantar una catedral o alimentar a cien mil personas al día permite convencer a una multitud de que el vecino merece morir.",
          "Y hay algo que este recorrido deja claro: ninguna de estas tradiciones nació de la nada. Todas heredaron, tomaron prestado, discutieron con sus vecinas y se transformaron. El diluvio mesopotámico está en la Biblia, el juicio egipcio anticipa el juicio del alma, el cielo y el infierno persas están en tres religiones, la filosofía griega da forma a la teología cristiana, y el mindfulness de tu aplicación de móvil viene de un monje del valle del Ganges.",
          "Más allá de sus diferencias, todas nacieron del mismo impulso profundamente humano: la necesidad de comprender el mundo, de no estar solo en él y de encontrarle un sentido.",
          "Quizá esa sea la mayor enseñanza de este viaje. Las respuestas han sido muy distintas, pero las preguntas siguen siendo las mismas:",
          "¿De dónde venimos?",
          "¿Por qué existe el mundo?",
          "¿Qué ocurre después de la muerte?",
          "¿Cómo debemos vivir?",
          "Y, aunque cada religión haya respondido de una manera diferente, la búsqueda de esas respuestas continúa acompañando a la humanidad hasta nuestros días. También a quien no cree en ninguna: las preguntas no se van con la fe.",
        ]),
    ],
  },
];

// Portada de cada era (círculo de la línea del tiempo principal): vive en la
// subcarpeta eras/, con el nombre = clave de la era. Mientras no exista el
// archivo, el círculo muestra su marcador (onError de LineaTiempoCultura).
HISTORIA_RELIGIONES_HITOS.forEach((era) => {
  era.foto = `/recorrido/cultura/historiareligion/eras/${era.key}.webp`;
});
