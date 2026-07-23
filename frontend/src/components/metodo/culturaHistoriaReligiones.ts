import type { HitoHistoria, SubHito } from "./culturaHistoriaUniversal";

// ─────────────────────────────────────────────────────────────────────────
// HISTORIA DE LAS RELIGIONES (Cultura). Mismo modelo de dos niveles que la
// Historia Universal: ETAPAS (con texto de intro) → SUB-HITOS (cada uno con su
// cómic: pregunta-gancho + cuerpo + dato curioso, foto + texto a la derecha).
// Fotos en /recorrido/cultura/historiareligion/<archivo>.png (carpeta plana).
// El nombre de archivo NO coincide con la clave del sub-hito: se traduce con
// el mapa FOTOS de abajo (clave del sub-hito → nombre corto del .png). Si una
// clave no está en el mapa, se usa la propia clave como nombre de archivo.
// El texto se pinta con `separarFrases` (salto de línea tras cada punto).
//
// NOTA: falta la etapa IV (la usuaria la irá pasando). El orden es el de los
// números romanos: I, II, III, [IV], V, VI…
// ─────────────────────────────────────────────────────────────────────────

// clave del sub-hito → nombre del archivo .png en la carpeta plana.
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
  // VIII · Un mundo, muchas creencias
  "expansion-religiones": "expansion",
  "mundo-conectado": "conectado",
  viaje: "viaje",
};

const foto = (_era: string, sub: string) =>
  `/recorrido/cultura/historiareligion/${FOTOS[sub] ?? sub}.png`;

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
          "Durante la mayor parte de la Prehistoria, los seres humanos vivían como cazadores y recolectores. Se desplazaban constantemente siguiendo a los animales y recogiendo frutos silvestres, por lo que apenas podían acumular posesiones o construir asentamientos permanentes.",
          "Todo cambió cuando algunos grupos descubrieron que podían cultivar plantas y domesticar animales. Gracias a la agricultura comenzaron a establecerse en un mismo lugar, levantando las primeras aldeas. Al producir más alimentos de los que necesitaban para sobrevivir, aparecieron especialistas que ya no tenían que dedicarse únicamente a conseguir comida: artesanos, comerciantes, gobernantes… y también sacerdotes.",
          "La Revolución Neolítica fue mucho más que un cambio económico. Sentó las bases para el nacimiento de las ciudades, los templos y las primeras religiones organizadas. Sin agricultura probablemente nunca habrían existido las grandes civilizaciones.",
        ],
        "Dato curioso: este cambio fue tan importante que muchos historiadores lo consideran la mayor revolución de la historia humana, incluso por encima de la Revolución Industrial."),
      hito("naturaleza-sagrada", "gea", "Gea y las «mujeres mágicas»", "Prehistoria",
        "¿Quién daba vida al mundo?",
        [
          "Los primeros seres humanos dependían completamente de la naturaleza para sobrevivir. La lluvia, los animales o las cosechas podían significar la vida o la muerte, por lo que era natural atribuirles un carácter sagrado. En muchos yacimientos arqueológicos se han encontrado pequeñas figuras femeninas, conocidas como Venus paleolíticas, que probablemente representaban la fertilidad o la capacidad de dar vida.",
          "Miles de años después, los griegos llamarían Gea a la diosa que personificaba la Tierra. Aunque no existe una relación directa entre aquellas estatuillas y la diosa griega, ambas reflejan una idea muy antigua y compartida por muchos pueblos: la Tierra como una gran madre de la que nace toda la vida.",
        ],
        "Dato curioso: la más famosa de estas figuras es la Venus de Willendorf, esculpida hace unos 25.000 años."),
      hito("naturaleza-sagrada", "animismo", "Animismo", "Desde la Prehistoria",
        "¿Y si todo tuviera un espíritu?",
        [
          "Las primeras comunidades no creían que solo las personas tuvieran alma. Pensaban que montañas, ríos, árboles, animales e incluso tormentas poseían una fuerza espiritual propia. Esta forma de entender el mundo se conoce como animismo y todavía está presente en numerosas culturas indígenas de África, América, Asia y Oceanía.",
          "Para nuestros antepasados, la naturaleza no era un escenario donde vivir, sino un conjunto de seres con los que era necesario mantener una relación de respeto y equilibrio. Cazar un animal, cruzar un río o talar un árbol podía requerir rituales para pedir permiso a los espíritus.",
        ]),
      hito("naturaleza-sagrada", "chamanes", "Chamanes", "Prehistoria",
        "Si existen espíritus… ¿quién puede hablar con ellos?",
        [
          "Con el paso del tiempo surgieron personas consideradas capaces de comunicarse con el mundo espiritual. Eran los chamanes, figuras que combinaban el papel de curandero, consejero, guía religioso y, en ocasiones, líder de la comunidad.",
          "Mediante rituales, tambores, cantos, danzas o estados de trance intentaban curar enfermedades, pedir lluvias, favorecer la caza o interpretar los mensajes de los espíritus. Aunque sus creencias variaban de un pueblo a otro, representan los primeros especialistas religiosos conocidos de la historia.",
        ],
        "Dato curioso: el chamanismo sigue practicándose hoy en algunas regiones de Siberia, Mongolia, América y la Amazonia."),
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
        "¿Qué ocurre cuando miles de personas empiezan a vivir juntas?",
        [
          "La agricultura permitió que las aldeas crecieran hasta convertirse en las primeras ciudades de la historia. Una de las más importantes fue Ur, situada en la antigua Mesopotamia, entre los ríos Tigris y Éufrates. Allí aparecieron enormes templos, mercados, murallas y una compleja organización social.",
          "Las ciudades necesitaban normas, gobernantes y también una religión común que uniera a toda la población. Los sacerdotes adquirieron un enorme poder porque se creía que eran los intermediarios entre los dioses y los hombres. A partir de este momento, religión y política comenzaron a caminar de la mano.",
        ],
        "Dato curioso: según la tradición bíblica, Abraham nació en la ciudad de Ur antes de iniciar el viaje que daría origen al pueblo de Israel."),
      hito("civilizaciones-dioses", "mesopotamia", "Religión mesopotámica", "≈3500-500 a. C.",
        "¿Quién protegía a las primeras ciudades del mundo?",
        [
          "Los habitantes de Mesopotamia creían que cada ciudad estaba bajo la protección de una divinidad. Dioses como Anu, señor del cielo; Enlil, dios del viento; o Ishtar, diosa del amor y la guerra, formaban parte de un amplio panteón que explicaba todos los aspectos de la vida.",
          "En el centro de cada ciudad se levantaban enormes templos escalonados llamados zigurats, donde los sacerdotes realizaban sacrificios y ceremonias para obtener el favor de los dioses. Las inundaciones, las sequías o las derrotas en la guerra se interpretaban como señales de que los dioses estaban satisfechos… o enfadados.",
          "La religión estaba tan unida al poder que los reyes gobernaban convencidos de haber sido elegidos por los dioses para mantener el orden en la Tierra.",
        ],
        "Dato curioso: la Epopeya de Gilgamesh, escrita en Mesopotamia hace más de cuatro mil años, contiene uno de los relatos de un gran diluvio más antiguos que se conocen, muy parecido al que siglos después aparecería en la Biblia."),
      hito("civilizaciones-dioses", "egipto", "Religión egipcia", "≈3100-30 a. C.",
        "¿Qué ocurre después de la muerte?",
        [
          "Mientras Mesopotamia se preocupaba por el poder de sus ciudades, los egipcios desarrollaron una religión profundamente centrada en la vida después de la muerte. Creían que el alma continuaba existiendo y debía superar un juicio en el que el dios Osiris pesaba el corazón del difunto para decidir su destino.",
          "Por ello momificaban los cuerpos, construían tumbas monumentales y enterraban a los fallecidos con objetos que pudieran necesitar en el más allá. Sus dioses representaban fuerzas de la naturaleza y aspectos esenciales de la vida, como Ra, dios del Sol; Isis, protectora de la maternidad; Horus, asociado a la realeza; o el propio Osiris.",
          "El faraón no era simplemente un rey: era considerado un intermediario entre los dioses y los hombres, e incluso una divinidad viviente cuya misión era mantener el equilibrio del universo, conocido por los egipcios como Maat.",
        ],
        "Dato curioso: el Libro de los Muertos era una colección de oraciones y consejos que muchos egipcios colocaban en las tumbas para ayudar al difunto a superar el juicio de Osiris."),
      hito("civilizaciones-dioses", "akhenaton", "Akhenatón y Nefertiti", "≈1350 a. C.",
        "¿Y si todos esos dioses fueran en realidad uno solo?",
        [
          "Durante siglos, Egipto había adorado a decenas de dioses, pero el faraón Akhenatón intentó cambiar por completo esa tradición. Junto a su esposa, la reina Nefertiti, impulsó el culto casi exclusivo a Atón, representado por el disco solar, reduciendo la importancia del resto de divinidades.",
          "Para lograrlo cerró numerosos templos dedicados a otros dioses, trasladó la capital a una nueva ciudad llamada Ajetatón y trató de transformar la religión egipcia desde el propio poder. Nunca antes un gobernante había intentado una reforma religiosa tan profunda.",
          "Sin embargo, tras su muerte todo cambió. Los sacerdotes recuperaron su influencia, los antiguos dioses volvieron a ser venerados y el nombre de Akhenatón fue borrado de muchos monumentos, como si nunca hubiera existido.",
          "Aunque su reforma fracasó, muchos historiadores consideran que fue uno de los primeros intentos conocidos de concentrar el culto en un único dios.",
        ],
        "Dato curioso: el famoso busto de Nefertiti, descubierto en 1912, está considerado una de las esculturas más bellas y reconocibles del mundo."),
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
        "¿Y si los dioses fueran como nosotros… pero inmortales?",
        [
          "Los antiguos griegos imaginaron un mundo gobernado por dioses que vivían en el monte Olimpo. Aunque poseían poderes extraordinarios, tenían emociones muy humanas: podían enamorarse, enfadarse, sentir envidia o actuar impulsivamente.",
          "Zeus gobernaba el cielo y era el rey de los dioses; Poseidón dominaba el mar; Hades reinaba sobre el mundo de los muertos; mientras que diosas como Atenea, Afrodita o Artemisa representaban la sabiduría, el amor o la naturaleza.",
          "Los mitos griegos no pretendían ser simples cuentos. Explicaban por qué existían las estaciones, de dónde procedía el fuego, por qué los seres humanos sufrían o qué significaba actuar con valentía o justicia. También enseñaban que incluso los dioses debían enfrentarse al destino.",
        ],
        "Dato curioso: los Juegos Olímpicos nacieron como una celebración religiosa en honor a Zeus y reunían a atletas de toda Grecia cada cuatro años."),
      hito("dioses-historias", "religion-romana", "Religión romana", "≈753 a. C.-476 d. C.",
        "¿Qué ocurre cuando un imperio adopta la religión de otro pueblo?",
        [
          "Al principio, los romanos tenían sus propias divinidades, relacionadas sobre todo con la agricultura, la familia y la protección de la ciudad. Sin embargo, a medida que Roma conquistó el mundo griego quedó profundamente impresionada por su cultura.",
          "En lugar de sustituir los dioses griegos, los romanos los identificaron con los suyos y adaptaron sus historias. Así, Zeus pasó a llamarse Júpiter, Poseidón se convirtió en Neptuno, Ares en Marte y Afrodita en Venus.",
          "La religión romana estaba muy unida al Estado. Los sacrificios públicos, las fiestas religiosas y el culto al emperador ayudaban a mantener la unidad del inmenso Imperio. Con el paso de los siglos, sin embargo, el cristianismo terminaría sustituyendo a la antigua religión romana.",
        ],
        "Dato curioso: los nombres de muchos planetas del Sistema Solar —Mercurio, Venus, Marte, Júpiter, Saturno o Neptuno— proceden directamente de los dioses romanos."),
      hito("dioses-historias", "grecia-conquista-roma", "Grecia conquista a Roma… sin ejércitos", "Siglos II-I a. C.",
        "¿Puede una civilización conquistar a otra sin ganar una sola batalla?",
        [
          "Cuando Roma conquistó Grecia, muchos pensaron que la cultura griega desaparecería. Ocurrió exactamente lo contrario.",
          "Los romanos admiraban profundamente la filosofía, el teatro, la escultura, la arquitectura y la literatura griegas. En lugar de destruirlas, las adoptaron y las difundieron por todo su imperio. También hicieron suyos a los dioses griegos, cambiándoles el nombre y adaptando algunos aspectos de sus mitos.",
          "Por eso hoy hablamos de Júpiter y Zeus, Venus y Afrodita o Marte y Ares como si fueran dioses distintos, cuando en realidad representan casi las mismas divinidades en dos culturas diferentes.",
          "El poeta romano Horacio resumió esta situación con una frase que se hizo célebre: «Grecia conquistada conquistó a su feroz vencedor.»",
          "Pocas veces en la historia una civilización derrotada militarmente ha ejercido una influencia cultural tan profunda sobre sus conquistadores.",
        ]),
      hito("dioses-historias", "mitologia-hindu", "La mitología hindú", "Desde la Antigüedad",
        "¿Cómo puede un solo universo contener tantos dioses?",
        [
          "A diferencia de muchas religiones, el hinduismo desarrolló una mitología inmensa y llena de relatos simbólicos. Sus principales dioses representan diferentes aspectos de una misma realidad divina.",
          "Brahma es el creador del universo, Vishnú el encargado de conservarlo y Shiva simboliza la destrucción, entendida no como el final de todo, sino como el paso necesario para que pueda surgir una nueva creación. Juntos forman la Trimurti, la tríada más importante del hinduismo.",
          "Según la tradición, Vishnú desciende al mundo cuando es necesario restaurar el equilibrio mediante diferentes avatares, siendo Rama y Krishna los más conocidos. También destacan divinidades como Ganesha, el dios con cabeza de elefante asociado a la sabiduría y la buena fortuna.",
          "Más que personajes independientes, estos dioses representan distintas maneras de comprender una misma realidad espiritual.",
        ],
        "Dato curioso: la palabra avatar, tan utilizada hoy en Internet y los videojuegos, procede del sánscrito y significa precisamente «encarnación» o «descenso» de un dios a la Tierra."),
      hito("dioses-historias", "mitologia-china", "La mitología china", "Antigüedad",
        "¿Cómo comenzó el universo?",
        [
          "Mucho antes del confucianismo y del taoísmo, los antiguos chinos desarrollaron una rica mitología poblada por dioses, héroes, dragones y espíritus.",
          "Uno de sus relatos más conocidos cuenta que el gigante Pangu separó el cielo y la tierra al despertar del caos primordial. Tras su muerte, su cuerpo dio origen a las montañas, los ríos, el viento y las estrellas. Otra historia narra cómo la diosa Nüwa creó a los seres humanos y reparó el cielo después de una gran catástrofe.",
          "También ocupaban un lugar importante el Emperador de Jade, considerado el soberano celestial, y los dragones, que en China simbolizan la sabiduría, la lluvia, la prosperidad y la buena fortuna, muy lejos de la imagen de monstruos destructores que aparece en muchas leyendas europeas.",
        ],
        "Dato curioso: mientras en Europa el dragón suele representar el mal, en China sigue siendo uno de los símbolos nacionales más respetados y admirados."),
      hito("dioses-historias", "religiones-africanas", "Religiones tradicionales africanas", "Desde la Antigüedad",
        "¿Y si los antepasados siguieran formando parte de nuestra vida?",
        [
          "Antes de la llegada del cristianismo y del islam, África ya albergaba una enorme diversidad de religiones tradicionales. Aunque variaban mucho entre unas regiones y otras, muchas compartían la creencia en un dios supremo acompañado por numerosos espíritus y divinidades menores.",
          "El culto a los antepasados ocupaba un lugar central. Se pensaba que las personas fallecidas seguían protegiendo a su familia y podían influir en la vida cotidiana. La música, la danza, los rituales y la tradición oral eran esenciales para transmitir estas creencias de generación en generación.",
          "Aún hoy muchas de estas tradiciones continúan vivas o conviven con el cristianismo y el islam en distintos países africanos.",
        ]),
      hito("dioses-historias", "america-precolombina", "Las religiones de la América precolombina", "Antes de 1492",
        "¿Cómo mantener el equilibrio entre los dioses y el mundo?",
        [
          "Mucho antes de la llegada de los europeos, civilizaciones como los mayas, los aztecas y los incas desarrollaron complejas religiones politeístas.",
          "Sus dioses estaban relacionados con el Sol, la Luna, la lluvia, el maíz, la guerra o la fertilidad, y se creía que el equilibrio del universo dependía de mantener una buena relación con ellos mediante ceremonias y ofrendas. Por ello construyeron impresionantes templos y pirámides que todavía hoy siguen siendo algunos de los monumentos más espectaculares del continente americano.",
          "Aunque estas religiones desaparecieron en gran parte tras la conquista europea, muchas de sus tradiciones y símbolos continúan formando parte de la cultura de América.",
        ],
        "Dato curioso: el calendario desarrollado por los mayas fue tan preciso que durante mucho tiempo se consideró uno de los más avanzados del mundo antiguo."),
    ],
  },
  {
    key: "revolucion-espiritual",
    titulo: "La gran revolución espiritual",
    anio: "≈2000-200 a. C.",
    intro:
      "La Era Axial. La religión dejó de explicar únicamente la naturaleza y comenzó a responder las grandes preguntas de la vida. Entre aproximadamente los siglos VIII y II a. C. ocurrió algo extraordinario. En distintos lugares del mundo, y casi al mismo tiempo, aparecieron pensadores, profetas y maestros que comenzaron a hacerse preguntas muy diferentes a las de las antiguas civilizaciones. Hasta entonces, la religión se había preocupado sobre todo por mantener contentos a los dioses para garantizar buenas cosechas, victorias militares o la prosperidad de las ciudades. Pero ahora surgían cuestiones mucho más profundas: ¿qué es el bien?, ¿por qué existe el sufrimiento?, ¿qué ocurre después de la muerte?, ¿cómo debemos vivir? El filósofo alemán Karl Jaspers llamó a este periodo la Era Axial, porque muchas de las ideas religiosas y filosóficas que aún hoy siguen presentes nacieron durante estos siglos.",
    subhitos: [
      hito("revolucion-espiritual", "abraham", "Abraham", "≈Siglo XIX-XVIII a. C. (según la tradición)",
        "¿Y si existiera un único Dios?",
        [
          "Durante miles de años, casi todos los pueblos habían adorado a numerosos dioses relacionados con la naturaleza o con cada ciudad. Según la tradición bíblica, Abraham rompió con esa forma de entender el mundo al confiar únicamente en un solo Dios.",
          "Dios le pidió abandonar su hogar, la ciudad de Ur, y emprender un viaje hacia una tierra desconocida, prometiéndole que de sus descendientes nacería un gran pueblo. Lo verdaderamente revolucionario no fue el viaje, sino la idea de establecer una alianza personal con un único Dios que guiaba la historia de la humanidad.",
          "Por ello, Abraham es considerado el padre espiritual del judaísmo y también una figura fundamental para el cristianismo y el islam. Las tres religiones son conocidas como religiones abrahámicas.",
        ],
        "Dato curioso: Abraham es una de las pocas figuras religiosas veneradas por judíos, cristianos y musulmanes."),
      hito("revolucion-espiritual", "moises", "Moisés", "≈Siglo XIII a. C. (según la tradición)",
        "¿Cómo debe vivir un pueblo?",
        [
          "Generaciones después de Abraham, la tradición cuenta que el pueblo hebreo vivía esclavizado en Egipto hasta que Moisés lo condujo hacia la libertad. Durante ese viaje, en el monte Sinaí, recibió de Dios los Diez Mandamientos, un conjunto de leyes destinadas a guiar la vida del pueblo de Israel.",
          "Más que un simple líder político, Moisés representa el nacimiento de una comunidad unida por una misma ley y por una alianza con un único Dios. A partir de ese momento, la religión dejó de consistir únicamente en realizar sacrificios y comenzó a establecer normas sobre cómo debía comportarse una sociedad.",
          "Los Diez Mandamientos influirían posteriormente en el cristianismo y el islam, convirtiéndose en uno de los códigos morales más conocidos de la historia.",
        ]),
      hito("revolucion-espiritual", "zoroastro", "Zoroastro y el zoroastrismo", "≈1200-1000 a. C. (fecha discutida)",
        "¿Por qué existe el mal?",
        [
          "En la antigua Persia, el profeta Zoroastro enseñó que el universo era el escenario de una lucha constante entre el bien, representado por Ahura Mazda, y el mal, representado por Angra Mainyu.",
          "Cada persona debía elegir libremente entre ambos mediante sus pensamientos, palabras y acciones. Al final de los tiempos tendría lugar un juicio en el que cada ser humano respondería por su comportamiento.",
          "Ideas como el cielo, el infierno, los ángeles, el juicio final o la llegada de un salvador aparecen claramente desarrolladas en el zoroastrismo y, siglos después, influirían profundamente en el judaísmo, el cristianismo y el islam.",
          "Aunque hoy cuenta con pocos seguidores, muchos historiadores consideran que el zoroastrismo ha sido una de las religiones más influyentes de toda la historia.",
        ],
        "Dato curioso: algunos especialistas consideran a Zoroastro el primer gran pensador en presentar el bien y el mal como una elección moral de cada persona."),
      hito("revolucion-espiritual", "judaismo", "Judaísmo", "≈Siglo XIII-VI a. C.",
        "¿Qué significa ser el pueblo de un único Dios?",
        [
          "El judaísmo fue la primera gran religión monoteísta que logró consolidarse y mantenerse a lo largo del tiempo. Enseña que existe un único Dios creador del universo, que estableció una alianza con el pueblo de Israel y le entregó una ley para guiar su vida.",
          "A diferencia de muchas religiones antiguas, el judaísmo puso un enorme énfasis en la justicia, la responsabilidad moral y el cumplimiento de los mandamientos. Su libro sagrado es la Torá, que forma parte de lo que los cristianos conocen como Antiguo Testamento.",
          "Aunque el número de judíos nunca fue muy elevado en comparación con otras religiones, su influencia ha sido inmensa, ya que tanto el cristianismo como el islam nacieron a partir de sus creencias.",
        ]),
      hito("revolucion-espiritual", "hinduismo", "Hinduismo", "≈1500-500 a. C.",
        "¿Por qué seguimos naciendo una y otra vez?",
        [
          "A diferencia de la mayoría de religiones, el hinduismo no fue fundado por una sola persona, sino que surgió lentamente a partir de las tradiciones de la India durante muchos siglos.",
          "Enseña que el alma renace continuamente en un ciclo llamado reencarnación, determinado por el karma, es decir, las consecuencias de nuestras acciones. El objetivo último no es alcanzar un paraíso, sino liberarse de ese ciclo y unirse a la realidad suprema, conocida como Brahman.",
          "Su enorme riqueza de textos, dioses y escuelas filosóficas convierte al hinduismo en una de las tradiciones religiosas más complejas y antiguas del mundo.",
        ]),
      hito("revolucion-espiritual", "krishna", "Krishna", "≈1200-500 a. C. (desarrollo del hinduismo)",
        "¿Cómo debemos actuar ante las dificultades de la vida?",
        [
          "Entre las numerosas divinidades del hinduismo, Krishna ocupa un lugar muy especial. En el Bhagavad Gita, uno de los textos sagrados más importantes de la India, enseña al príncipe Arjuna que una persona debe cumplir con su deber sin dejarse dominar por el miedo, el egoísmo o el deseo de obtener recompensas.",
          "Para Krishna, actuar correctamente es más importante que controlar el resultado de nuestras acciones. Sus enseñanzas sobre el deber, la devoción y la serenidad han inspirado durante siglos a millones de personas.",
        ],
        "Dato curioso: el Bhagavad Gita es considerado por muchos uno de los libros espirituales más influyentes jamás escritos."),
      hito("revolucion-espiritual", "buda", "Buda", "≈Siglo VI a. C.",
        "¿Por qué sufrimos?",
        [
          "El príncipe Siddhartha Gautama abandonó su vida de riqueza al descubrir que el sufrimiento formaba parte inevitable de la existencia humana. Tras años de búsqueda y meditación alcanzó la iluminación y pasó a ser conocido como Buda, «el Iluminado».",
          "Enseñó que el sufrimiento nace del apego y del deseo constante de que las cosas sean diferentes de como son. En lugar de buscar la felicidad en las riquezas o en el poder, propuso un camino basado en la comprensión, la meditación y el equilibrio interior.",
          "Su mensaje se extendió desde la India hasta gran parte de Asia y sigue siendo una de las enseñanzas espirituales más influyentes del mundo.",
        ]),
      hito("revolucion-espiritual", "budismo", "Budismo", "Desde el siglo VI a. C.",
        "",
        [
          "El budismo nació de las enseñanzas de Buda, pero con el tiempo dio lugar a distintas escuelas y formas de práctica. A diferencia de muchas religiones, no gira en torno a un dios creador, sino al desarrollo personal y a la superación del sufrimiento mediante la sabiduría, la conducta ética y la meditación.",
          "Hoy es una de las grandes religiones del mundo y ha influido profundamente en la filosofía, la psicología y las prácticas de meditación modernas.",
        ]),
    ],
  },
  {
    key: "busqueda-sabiduria",
    titulo: "La búsqueda de la sabiduría",
    anio: "China clásica",
    intro:
      "Algunos pensadores dejaron de preguntarse quién creó el mundo y comenzaron a preguntarse cómo debía vivir el ser humano. Mientras en Persia, la India y Oriente Próximo surgían religiones centradas en Dios, la salvación o la reencarnación, en China aparecieron maestros que dirigieron su atención hacia una cuestión diferente: ¿cómo construir una vida buena y una sociedad en armonía? Más que preocuparse por el origen del universo o el destino después de la muerte, estos pensadores buscaban enseñar a las personas cómo comportarse con los demás, cómo gobernar con justicia o cómo vivir en equilibrio con la naturaleza. De esta forma nacieron dos de las corrientes filosóficas y espirituales más influyentes de Asia: el confucianismo y el taoísmo.",
    subhitos: [
      hito("busqueda-sabiduria", "confucio", "Confucio", "≈551-479 a. C.",
        "¿Qué hace que una sociedad funcione?",
        [
          "Confucio vivió en una época de guerras e inestabilidad política en China. Observó cómo los gobernantes luchaban entre sí y cómo la corrupción debilitaba a los Estados. Convencido de que el problema no era la falta de leyes, sino la falta de virtud, comenzó a enseñar una forma diferente de entender la sociedad.",
          "Para Confucio, un buen gobernante debía dar ejemplo con su comportamiento y no gobernar únicamente mediante castigos. También defendía el respeto hacia los padres, la educación, la honestidad y la responsabilidad de cada persona dentro de la familia y de la comunidad.",
          "Aunque nunca pretendió fundar una religión, sus enseñanzas fueron tan influyentes que durante más de dos mil años guiaron la educación y la administración de China.",
        ],
        "Dato curioso: durante siglos, para convertirse en funcionario del Imperio chino era necesario superar difíciles exámenes basados en las enseñanzas de Confucio."),
      hito("busqueda-sabiduria", "confucianismo", "Confucianismo", "Desde el siglo V a. C.",
        "",
        [
          "El confucianismo es una tradición ética y filosófica basada en las enseñanzas de Confucio. Su objetivo no es explicar el origen del universo ni prometer una vida después de la muerte, sino ayudar a construir una sociedad estable y justa.",
          "Valores como el respeto, la honestidad, la responsabilidad, la educación y la armonía familiar ocupan un lugar central. Por ello, muchos historiadores consideran que el confucianismo ha influido en la cultura china tanto como cualquier religión.",
          "Todavía hoy sus ideas siguen presentes en países como China, Corea, Japón o Vietnam.",
        ]),
      hito("busqueda-sabiduria", "laotse", "Lao Tse", "≈Siglo VI-IV a. C. (tradicionalmente)",
        "¿Y si el problema fuera intentar controlar demasiado la vida?",
        [
          "Mientras Confucio buscaba el orden mediante normas y educación, la tradición atribuye a Lao Tse una idea completamente distinta. Según él, el universo ya posee un orden natural y el ser humano sufre cuando intenta imponerse sobre él.",
          "Lao Tse enseñó que la verdadera sabiduría consiste en vivir con sencillez, dejar de luchar contra el curso natural de las cosas y aprender a actuar sin forzar la realidad. Su pensamiento quedó recogido en el Tao Te Ching, uno de los libros más influyentes de la filosofía oriental.",
        ],
        "Dato curioso: algunos historiadores dudan incluso de que Lao Tse fuera una persona real. Es posible que represente la figura simbólica de varios sabios cuyos pensamientos fueron reunidos en una sola obra."),
      hito("busqueda-sabiduria", "taoismo", "Taoísmo", "Desde el siglo IV a. C.",
        "",
        [
          "El taoísmo enseña que todo el universo sigue un principio natural llamado Tao, que puede traducirse como «el camino». En lugar de intentar dominar el mundo, el ser humano debe aprender a vivir en armonía con él.",
          "Uno de sus conceptos más importantes es el wu wei, que significa actuar sin forzar las cosas, dejando que cada situación siga su curso natural cuando es posible. El equilibrio entre fuerzas opuestas queda representado por el famoso símbolo del yin y el yang, donde la luz y la oscuridad, lo masculino y lo femenino, o la actividad y el descanso no se enfrentan, sino que se complementan.",
          "Más que una religión basada en normas estrictas, el taoísmo propone una forma de vivir basada en la sencillez, el equilibrio y el respeto por la naturaleza.",
        ],
        "Dato curioso: aunque mucha gente cree que el yin y el yang representan el bien y el mal, en realidad simbolizan dos fuerzas complementarias que existen juntas y necesitan mantenerse en equilibrio."),
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
        "¿Puede Dios amar por igual a todas las personas?",
        [
          "Jesús nació en una provincia del Imperio romano llamada Judea, en el seno de una familia judía. Recorrió pueblos y ciudades predicando un mensaje centrado en el amor al prójimo, el perdón, la compasión y la esperanza. Enseñaba que el Reino de Dios estaba abierto a todos, incluidos los pobres, los enfermos y quienes eran rechazados por la sociedad.",
          "Su creciente popularidad despertó recelos entre algunos líderes religiosos y también entre las autoridades romanas. Finalmente fue condenado a morir crucificado, una de las penas más duras reservadas para los enemigos del Imperio.",
          "Sus seguidores afirmaron que tres días después resucitó y que era el Mesías anunciado por las Escrituras. Esa convicción dio origen al cristianismo.",
        ],
        "Dato curioso: aunque hoy el cristianismo es la religión con más seguidores del mundo, durante sus primeros siglos fue un pequeño movimiento perseguido dentro del Imperio romano."),
      hito("un-dios-humanidad", "pablo-tarso", "Pablo de Tarso", "≈5-67 d. C.",
        "¿Y si el mensaje de Jesús fuera para toda la humanidad?",
        [
          "Tras la muerte de Jesús, la mayoría de sus seguidores seguían siendo judíos y pensaban que el nuevo movimiento debía permanecer dentro del judaísmo.",
          "Todo cambió con Pablo de Tarso. Después de una experiencia que interpretó como un encuentro con Jesús resucitado, comenzó a recorrer miles de kilómetros por el Mediterráneo anunciando el cristianismo a personas que no eran judías.",
          "Fundó comunidades en numerosas ciudades del Imperio romano y escribió cartas que hoy forman parte del Nuevo Testamento. Gracias a él, el cristianismo dejó de ser un pequeño movimiento local para convertirse en una religión abierta a todos los pueblos.",
          "Muchos historiadores consideran que, sin Pablo, el cristianismo probablemente habría permanecido como una corriente minoritaria dentro del judaísmo.",
        ],
        "Dato curioso: Pablo recorrió más de 15.000 kilómetros, una distancia extraordinaria para la época."),
      hito("un-dios-humanidad", "cristianismo", "Cristianismo", "Desde el siglo I",
        "",
        [
          "El cristianismo nació de las enseñanzas de Jesús y de la convicción de sus seguidores de que era el Hijo de Dios y había resucitado tras su muerte.",
          "Durante los tres primeros siglos fue perseguido por varios emperadores romanos, ya que los cristianos se negaban a rendir culto al emperador o a los dioses tradicionales. Sin embargo, todo cambió en el año 313, cuando el emperador Constantino permitió practicar libremente el cristianismo mediante el Edicto de Milán.",
          "Décadas después, el emperador Teodosio I lo convirtió en la religión oficial del Imperio romano. En apenas unos siglos, una pequeña comunidad perseguida pasó a convertirse en la religión dominante de Europa.",
        ],
        "Dato curioso: la cruz, que originalmente era un instrumento de ejecución romano, terminó convirtiéndose en el símbolo más reconocido del cristianismo."),
      hito("un-dios-humanidad", "mahoma-islam", "Mahoma y el islam", "610-632",
        "¿Cómo unir a un pueblo dividido?",
        [
          "A comienzos del siglo VII, la península arábiga estaba formada por numerosas tribus enfrentadas entre sí, cada una con sus propias tradiciones y divinidades.",
          "Según la tradición islámica, Mahoma comenzó a recibir revelaciones de Dios —Alá en árabe— a través del ángel Gabriel. Esas revelaciones quedarían recogidas más tarde en el Corán, el libro sagrado del islam.",
          "Mahoma predicó que existía un único Dios y que todos los creyentes formaban parte de una misma comunidad. Su mensaje logró unir a gran parte de las tribus árabes y, tras su muerte, el islam se expandió con enorme rapidez desde la península ibérica hasta la India.",
          "Además de ser una religión, el mundo islámico se convirtió en uno de los grandes centros del conocimiento. Durante siglos destacó en matemáticas, medicina, astronomía, filosofía y arquitectura, conservando y ampliando muchos conocimientos de las civilizaciones griega y romana.",
        ],
        "Dato curioso: mientras gran parte de Europa atravesaba la Alta Edad Media, ciudades como Bagdad o Córdoba figuraban entre los mayores centros científicos y culturales del mundo."),
    ],
  },
  {
    key: "fe-se-divide",
    titulo: "Cuando una fe se divide",
    anio: "632-1517",
    intro:
      "Ninguna religión permanece igual para siempre. A medida que las grandes religiones crecían y se extendían por nuevos territorios, comenzaron a surgir diferencias sobre cómo debían interpretarse sus enseñanzas y quién tenía autoridad para dirigir a los creyentes. En muchas ocasiones, estas discusiones no fueron solo religiosas. También estuvieron influidas por la política, la cultura y el poder. El resultado fue el nacimiento de nuevas ramas que, aunque compartían un mismo origen, siguieron caminos distintos. Estas divisiones siguen siendo importantes hoy y ayudan a entender muchos acontecimientos de la historia y del mundo actual.",
    subhitos: [
      hito("fe-se-divide", "sunies-chiies", "Suníes y chiíes", "Desde 632",
        "¿Quién debía suceder a Mahoma?",
        [
          "Cuando Mahoma murió en el año 632, dejó una comunidad unida, pero no había indicado claramente quién debía dirigirla después de él.",
          "Un grupo defendía que el nuevo líder debía ser elegido entre los creyentes más preparados. Así nació la rama suní, que hoy representa alrededor del 85-90 % de los musulmanes.",
          "Otro grupo sostenía que el liderazgo debía permanecer dentro de la familia del profeta y apoyó a Alí, primo y yerno de Mahoma. De esa postura nació la rama chií.",
          "Con el paso de los siglos, ambas comunidades desarrollaron algunas diferencias en sus tradiciones religiosas y, sobre todo, en su organización política. En distintos momentos de la historia, esta división ha provocado enfrentamientos y ha influido profundamente en la política de Oriente Próximo.",
          "En la época contemporánea, la mayoría de los grandes grupos yihadistas, como Al Qaeda o Estado Islámico, surgieron de interpretaciones extremistas del islam suní. Sin embargo, es importante distinguir entre estos grupos y la inmensa mayoría de los musulmanes suníes, que rechazan el terrorismo y condenan la violencia.",
        ],
        "Dato curioso: aunque suelen aparecer unidos en las noticias, suníes y chiíes comparten el mismo Corán, creen en un único Dios y reconocen a Mahoma como el último profeta."),
      hito("fe-se-divide", "gran-cisma", "El Gran Cisma", "1054",
        "¿Puede una misma Iglesia acabar convirtiéndose en dos?",
        [
          "Durante los primeros siglos del cristianismo existía una sola Iglesia, pero poco a poco comenzaron a aparecer diferencias entre Oriente y Occidente.",
          "En el Imperio bizantino se hablaba principalmente griego, mientras que en Europa occidental predominaba el latín. También existían diferencias en algunos rituales y, sobre todo, una cuestión que parecía imposible de resolver: ¿quién debía tener la máxima autoridad sobre todos los cristianos?",
          "El obispo de Roma, conocido como el papa, defendía que era el sucesor de san Pedro y debía dirigir a toda la Iglesia. En cambio, el patriarca de Constantinopla consideraba que ninguna sede debía imponerse sobre las demás.",
          "En el año 1054, ambas autoridades se excomulgaron mutuamente, haciendo oficial una separación que llevaba siglos gestándose.",
          "Desde entonces existen dos grandes ramas del cristianismo:",
          "La Iglesia Católica, con el papa como máxima autoridad.",
          "La Iglesia Ortodoxa, formada por varias iglesias independientes que comparten la misma fe, pero no reconocen la autoridad del papa.",
        ],
        "Dato curioso: aunque el Gran Cisma ocurrió hace casi mil años, la Iglesia Católica y la Iglesia Ortodoxa mantienen hoy relaciones mucho más cercanas que durante gran parte de su historia."),
      hito("fe-se-divide", "reforma-protestante", "La Reforma Protestante", "1517",
        "¿Y si la Iglesia necesitara reformarse?",
        [
          "A comienzos del siglo XVI, muchos cristianos criticaban algunos abusos dentro de la Iglesia católica. Uno de los más polémicos era la venta de indulgencias, documentos que prometían reducir el castigo por los pecados a cambio de dinero.",
          "El monje alemán Martín Lutero consideró que estas prácticas se alejaban del mensaje original del cristianismo. En 1517 publicó sus famosas 95 tesis, criticando diversos aspectos de la Iglesia.",
          "Lo que comenzó como una propuesta de reforma terminó provocando una ruptura definitiva. Surgieron nuevas iglesias protestantes, como la luterana, la calvinista y, poco después, la anglicana en Inglaterra.",
          "Desde entonces, el cristianismo dejó de estar unido bajo una única autoridad y pasó a estar formado por distintas confesiones que comparten la figura de Jesús, pero mantienen diferencias en su organización y en algunas de sus creencias.",
          "La invención de la imprenta pocos años antes permitió que las ideas de Lutero se difundieran rápidamente por Europa, algo que habría sido casi imposible en siglos anteriores.",
        ],
        "Dato curioso: Lutero tradujo la Biblia al alemán para que cualquier persona pudiera leerla sin depender del latín, contribuyendo además a unificar el idioma alemán moderno."),
    ],
  },
  {
    key: "mundo-muchas-creencias",
    titulo: "Un mundo, muchas creencias",
    anio: "Siglos XVI-Actualidad",
    intro:
      "Por primera vez en la historia, las grandes religiones comenzaron a convivir. Durante la mayor parte de la historia, las religiones permanecieron ligadas a un territorio concreto. El hinduismo se desarrolló principalmente en la India, el budismo en Asia, el cristianismo en Europa y el islam en Oriente Próximo y el norte de África. Sin embargo, a partir del siglo XV el mundo empezó a cambiar rápidamente. Los grandes viajes oceánicos, el comercio internacional, las conquistas y, más tarde, las migraciones hicieron que personas de culturas y religiones muy diferentes comenzaran a convivir. Por primera vez, las creencias dejaron de pertenecer a un único pueblo y pasaron a formar parte de una humanidad cada vez más conectada.",
    subhitos: [
      hito("mundo-muchas-creencias", "expansion-religiones", "La expansión de las grandes religiones", "Siglos XVI-XXI",
        "¿Qué ocurre cuando las religiones viajan por el mundo?",
        [
          "Los viajes iniciados por portugueses y españoles a finales del siglo XV conectaron continentes que habían permanecido separados durante miles de años. Junto con los exploradores también viajaron comerciantes, misioneros y peregrinos, llevando consigo sus creencias.",
          "El cristianismo se extendió por gran parte de América, África y Oceanía gracias a la colonización europea y a la labor de los misioneros.",
          "El islam continuó expandiéndose por África, Asia y el sudeste asiático mediante el comercio y la predicación, convirtiéndose en una de las religiones más extendidas del planeta.",
          "El budismo llegó a nuevos países de Asia y, siglos después, despertó un gran interés en Europa y América gracias a filósofos, viajeros y maestros orientales.",
          "El hinduismo, aunque permaneció concentrado principalmente en la India, comenzó a difundirse por otros continentes a través de las migraciones de millones de personas.",
          "Por primera vez, las grandes religiones dejaron de tener fronteras claramente definidas.",
        ],
        "Dato curioso: hoy existen iglesias cristianas en Corea del Sur, mezquitas en Londres, templos hindúes en Canadá y monasterios budistas en California, algo impensable hace apenas unos siglos."),
      hito("mundo-muchas-creencias", "mundo-conectado", "Un mundo conectado", "Siglos XX-XXI",
        "¿Qué ocurre cuando personas de todas las religiones viven en la misma ciudad?",
        [
          "Durante el siglo XX, las migraciones internacionales y la globalización transformaron profundamente el mapa religioso del planeta.",
          "Hoy es habitual encontrar iglesias, mezquitas, sinagogas, templos budistas, templos hindúes e incluso personas que no siguen ninguna religión compartiendo un mismo barrio.",
          "Internet ha permitido además que cualquier persona pueda conocer creencias diferentes sin necesidad de viajar, favoreciendo el diálogo entre culturas, pero también dando lugar a nuevos debates sobre identidad, tradición y convivencia.",
          "Nunca antes en la historia tantas personas con creencias distintas habían vivido tan cerca unas de otras.",
        ],
        "Dato curioso: algunas de las ciudades con mayor diversidad religiosa del mundo son Londres, Nueva York, Singapur y Toronto."),
      hito("mundo-muchas-creencias", "viaje", "Un viaje de miles de años", "",
        "",
        [
          "Hace decenas de miles de años, un pequeño grupo de cazadores observaba una tormenta y pensaba que algún espíritu habitaba en el cielo. No conocían la ciencia ni la escritura, pero ya se hacían preguntas que siguen acompañándonos hoy.",
          "Con el tiempo llegaron las aldeas, las primeras ciudades y los templos. Nacieron dioses con nombre propio, sacerdotes, reyes divinizados y grandes mitologías. Más tarde aparecieron profetas y sabios que comenzaron a preguntarse por el bien, el mal, el sufrimiento y el sentido de la vida. Surgieron religiones que unieron a pueblos enteros y otras que aspiraban a llevar su mensaje a toda la humanidad.",
          "Las religiones cambiaron, se dividieron, se influyeron mutuamente y viajaron por todo el planeta. Algunas desaparecieron; otras siguen reuniendo a millones de creyentes. Todas, de una manera u otra, forman parte de la historia de nuestra civilización.",
          "Más allá de las diferencias entre unas y otras, todas nacieron del mismo impulso profundamente humano: la necesidad de comprender el mundo y encontrar un sentido a nuestra existencia.",
          "Quizá esa sea la mayor enseñanza de este viaje. Las respuestas han sido muy distintas, pero las preguntas siguen siendo las mismas:",
          "¿De dónde venimos?",
          "¿Por qué existe el mundo?",
          "¿Qué ocurre después de la muerte?",
          "¿Cómo debemos vivir?",
          "Y, aunque cada religión haya respondido de una manera diferente, la búsqueda de esas respuestas continúa acompañando a la humanidad hasta nuestros días.",
        ]),
    ],
  },
];
