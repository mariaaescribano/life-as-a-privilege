import type { HitoHistoria, SubHito } from "./culturaHistoriaUniversal";

// ─────────────────────────────────────────────────────────────────────────
// HISTORIA DEL ARTE Y LA LITERATURA (Cultura). Tagline: «La necesidad humana de
// crear — cómo hemos contado quiénes somos, con imágenes y con palabras».
//
// Mismo modelo que las demás Historias: ETAPAS (con intro) → SUB-HITOS (cada uno
// con su cómic: pregunta-gancho + cuerpo + dato curioso, foto + texto a la
// derecha). Estructura del índice: Prólogo + 9 etapas (de las cuevas al arte
// digital). Se entrelazan las dos artes: la imagen (pintura, escultura,
// arquitectura) y la palabra (poesía, teatro, novela).
//
// No es solo historia: es un viaje sobre por qué el ser humano necesita crear.
// El arte y la literatura son el espejo en el que cada época se mira y nos cuenta
// qué le importaba, qué temía y qué soñaba.
//
// Fotos planas en /recorrido/cultura/historiaarte/<subKey>.png (el nombre del
// archivo = key del sub-hito). El texto se pinta con `separarFrases` (salto de
// línea tras cada punto).
//
// Momentos sin fecha (eyebrow "") = pasajes de síntesis/transición: el
// ComicViewer oculta el antetítulo cuando va vacío.
// ─────────────────────────────────────────────────────────────────────────

const foto = (_era: string, sub: string) =>
  `/recorrido/cultura/historiaarte/${sub}.png`;

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

export const HISTORIA_ARTE_HITOS: HitoHistoria[] = [
  // ───────────────────────────────────────────────────────────────────────
  // PRÓLOGO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "prologo",
    titulo: "¿Qué es el arte?",
    anio: "Antes de empezar el viaje",
    intro:
      "Antes de recorrer los grandes cuadros, esculturas y libros de la historia, conviene detenerse en una pregunta sencilla y enorme: ¿por qué el ser humano crea? Ningún otro ser vivo pinta, esculpe, canta o escribe historias solo por el placer de expresarse. Nosotros lo hacemos desde hace decenas de miles de años. Antes incluso de inventar la escritura, ya pintábamos animales en las paredes de las cuevas y contábamos relatos alrededor del fuego. El arte y la literatura no sirven para sobrevivir, y sin embargo ninguna cultura ha vivido sin ellos. Son la forma en que cada época se mira a sí misma y nos cuenta qué le importaba, qué temía y qué soñaba. Este recorrido no trata de memorizar nombres y fechas, sino de entender algo más íntimo: cómo la humanidad ha intentado, una y otra vez, decir quién es.",
    subhitos: [
      hito("prologo", "que-es-arte", "¿Qué es el arte?", "La necesidad de crear",
        "¿Sabrías explicar por qué a los seres humanos nos emociona una imagen o una historia?",
        [
          "El arte es todo lo que creamos no para sobrevivir, sino para expresar algo: una emoción, una idea, una belleza, una pregunta. Un cuadro, una canción, una catedral o un poema son formas de decir lo que a veces las palabras corrientes no alcanzan.",
          "Lo asombroso es que el arte no es útil en el sentido práctico, y aun así ninguna cultura ha podido vivir sin él. Parece una necesidad tan humana como comer o dormir.",
          "A lo largo de la historia, el arte ha servido para adorar a los dioses, honrar a los muertos, mostrar el poder, contar historias o, simplemente, buscar la belleza.",
          "Mirar el arte de una época es asomarse a su alma: ver el mundo con los ojos de quienes vivieron entonces.",
        ],
        "Dato curioso: la palabra «arte» viene del latín ars, que significaba «habilidad» o «técnica». Durante siglos, pintar o esculpir se consideró un oficio, no muy distinto del de un artesano."),
      hito("prologo", "por-que-creamos", "¿Por qué creamos?", "El impulso más humano",
        "¿Y si crear fuera una forma de no estar solos ni de olvidar?",
        [
          "Creamos por muchas razones: para expresar lo que sentimos, para dar sentido a lo que no entendemos, para dejar huella y para que algo de nosotros permanezca cuando ya no estemos.",
          "El arte y la literatura nos permiten compartir el mundo interior de otra persona: sentir lo que sintió alguien que vivió hace miles de años o al otro lado del planeta.",
          "También nos ayudan a comprendernos. Al ver reflejadas nuestras emociones en una historia o un cuadro, descubrimos que no estamos solos en lo que sentimos.",
          "Quizá por eso creamos: para conectar, para recordar y para entender un poco mejor quiénes somos.",
        ]),
      hito("prologo", "arte-y-palabra", "El arte y la palabra", "Imagen y literatura",
        "¿Se puede crear belleza solo con palabras?",
        [
          "Este viaje recorre dos grandes artes que crecieron juntas. Una es el arte de la imagen: la pintura, la escultura, la arquitectura. La otra es el arte de la palabra: la poesía, el teatro, la novela.",
          "La literatura es, sencillamente, el arte de contar y de emocionar usando el lenguaje. Con palabras se pueden construir mundos, personajes y sentimientos tan vivos como cualquier cuadro.",
          "A menudo caminaron de la mano: los mismos mitos que inspiraron esculturas también dieron lugar a poemas, y muchas obras maestras nacieron de unir imagen y relato.",
          "Por eso las contamos juntas: son las dos formas en que la humanidad ha intentado siempre decir lo que lleva dentro.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 1 — EL ARTE NACE
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "arte-nace",
    titulo: "El arte nace",
    anio: "Prehistoria",
    intro:
      "El arte es mucho más antiguo que las ciudades, la escritura o la ciencia. Hace decenas de miles de años, cuando nuestros antepasados aún vivían de la caza y la recolección, ya se adentraban en cuevas oscuras para pintar animales en las paredes, tallaban pequeñas figuras y se adornaban el cuerpo. También, mucho antes de saber escribir, contaban historias en voz alta que pasaban de padres a hijos. Aquellos primeros gestos creativos demuestran algo profundo: la necesidad de crear y de contar es tan vieja como la propia humanidad.",
    subhitos: [
      hito("arte-nace", "cuevas-rupestres", "Las cuevas pintadas", "Hace más de 30.000 años",
        "¿Por qué alguien se arriesgaría a pintar en lo más profundo de una cueva oscura?",
        [
          "En cuevas como Altamira, en España, o Lascaux, en Francia, nuestros antepasados pintaron bisontes, caballos y ciervos con un realismo y una fuerza que todavía hoy nos emocionan.",
          "Lo hacían en rincones profundos y difíciles, a la luz de antorchas, usando pigmentos naturales. No eran simples dibujos: probablemente formaban parte de rituales relacionados con la caza o con creencias sobre la naturaleza.",
          "Aquellas pinturas demuestran que, ya en la Prehistoria, el ser humano no solo quería sobrevivir, sino también representar el mundo y dejar constancia de él.",
          "Fue el primer arte de la historia, y sigue hablándonos miles de años después.",
        ],
        "Dato curioso: las pinturas de Altamira son tan perfectas que, cuando se descubrieron, muchos expertos no creyeron que fueran prehistóricas. Pensaban que era imposible que gente tan antigua pintara tan bien."),
      hito("arte-nace", "primeras-esculturas", "Las primeras esculturas", "Prehistoria",
        "¿Qué fue lo primero que talló la humanidad?",
        [
          "Junto a las pinturas, nuestros antepasados crearon también las primeras esculturas: pequeñas figuras talladas en piedra, hueso o marfil.",
          "Muchas representan figuras femeninas, conocidas como Venus, que probablemente simbolizaban la fertilidad y la vida. Otras representaban animales con enorme detalle.",
          "Eran objetos que se podían sostener en la mano, quizá amuletos o símbolos sagrados que acompañaban a las personas.",
          "Con ellas, la humanidad daba forma tridimensional a sus creencias y deseos: el arte salía de la pared para poder tocarse.",
        ],
        "Dato curioso: la Venus de Willendorf, una de las esculturas más famosas de la Prehistoria, fue tallada hace unos 25.000 años y cabe en la palma de una mano."),
      hito("arte-nace", "relatos-orales", "Antes de escribir: los relatos", "La palabra hablada",
        "¿Existía la literatura antes de que existiera la escritura?",
        [
          "Mucho antes de inventar la escritura, los seres humanos ya contaban historias. Alrededor del fuego, los mayores narraban mitos sobre el origen del mundo, hazañas de héroes y leyendas de antepasados.",
          "Aquellos relatos se transmitían de memoria, de generación en generación, y se recitaban muchas veces con ritmo, repeticiones y música para recordarlos mejor.",
          "Era la literatura oral: la primera forma de literatura de la humanidad, aunque no estuviera escrita en ninguna parte.",
          "Cuando por fin llegó la escritura, muchas de esas historias antiquísimas pudieron por fin fijarse para siempre. Pero su origen estaba en la voz.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 2 — LAS PRIMERAS CIVILIZACIONES
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "primeras-civilizaciones",
    titulo: "Las primeras civilizaciones",
    anio: "≈3000 – 500 a. C.",
    intro:
      "Con las primeras grandes ciudades llegaron el arte monumental y la palabra escrita. En Egipto y Mesopotamia, el arte dejó de caber en una cueva y se volvió gigantesco: pirámides, templos y estatuas colosales al servicio de los dioses y de los reyes. Y ocurrió algo que cambiaría la historia para siempre: la invención de la escritura. Por primera vez, las palabras podían guardarse, viajar y sobrevivir a quien las decía. Así nació la literatura escrita, y con ella el primer gran relato conservado de la humanidad.",
    subhitos: [
      hito("primeras-civilizaciones", "arte-egipcio", "El arte egipcio", "≈3000 – 30 a. C.",
        "¿Por qué el arte egipcio se mantuvo casi igual durante tres mil años?",
        [
          "El arte egipcio buscaba la eternidad. Sus pirámides, templos y estatuas se construían para durar para siempre y para acompañar a los muertos en la otra vida.",
          "Seguía reglas muy estrictas: las figuras humanas se pintaban siempre de la misma manera, con la cabeza de perfil y el cuerpo de frente. No buscaban el realismo, sino el orden y el símbolo.",
          "Por eso el arte egipcio apenas cambió durante casi tres mil años: representaba un mundo estable, sagrado y ordenado.",
          "Cada imagen, cada jeroglífico y cada estatua tenía un sentido religioso. El arte y la fe eran una sola cosa.",
        ],
        "Dato curioso: los egipcios llenaban las tumbas de pinturas y objetos porque creían que ayudarían al difunto en su vida después de la muerte. Gracias a ello sabemos hoy cómo vivían."),
      hito("primeras-civilizaciones", "escritura-nace", "Nace la escritura", "≈3300 a. C.",
        "¿Qué cambia cuando las palabras se pueden guardar?",
        [
          "En Mesopotamia y Egipto se inventó la escritura, uno de los mayores hitos de la historia humana. Al principio servía para llevar cuentas y registrar cosechas o impuestos.",
          "Pero pronto se descubrió su poder inmenso: con la escritura, las palabras dejaban de depender de la memoria. Podían guardarse, copiarse y viajar a lugares y épocas lejanas.",
          "Las leyes, las oraciones, los mitos y las historias pudieron por fin fijarse por escrito y conservarse para siempre.",
          "La escritura hizo posible la literatura tal como la conocemos, y con ella el nacimiento de la historia, porque a partir de entonces la humanidad pudo dejar constancia de sí misma.",
        ],
        "Dato curioso: la primera escritura de Mesopotamia se llama cuneiforme, porque se hacía clavando una caña con forma de cuña sobre tablillas de barro húmedo."),
      hito("primeras-civilizaciones", "gilgamesh", "La Epopeya de Gilgamesh", "≈2100 a. C.",
        "¿Cuál es la historia más antigua que se conserva escrita?",
        [
          "La Epopeya de Gilgamesh, escrita en Mesopotamia hace más de cuatro mil años, es la obra literaria más antigua que se conserva. Cuenta las aventuras del rey Gilgamesh en busca de la inmortalidad.",
          "En ella aparecen temas que siguen conmoviéndonos hoy: la amistad, el miedo a la muerte, el deseo de trascender y la aceptación de que somos mortales.",
          "También incluye un relato de un gran diluvio muy parecido al que siglos después aparecería en la Biblia, prueba de cómo las historias viajan entre culturas.",
          "Que la primera gran obra literaria hable del miedo a morir nos dice mucho: desde el principio, la literatura sirvió para enfrentarnos a las preguntas más profundas.",
        ],
        "Dato curioso: la Epopeya de Gilgamesh estuvo perdida y olvidada durante milenios, hasta que en el siglo XIX se descubrieron las tablillas y se logró descifrar su escritura."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 3 — GRECIA Y ROMA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "grecia-roma",
    titulo: "Grecia y Roma: la belleza y el ideal",
    anio: "Siglos VIII a. C. – V d. C.",
    intro:
      "En Grecia, el ser humano se colocó en el centro del arte. Sus escultores buscaron la belleza perfecta del cuerpo humano, sus arquitectos crearon templos de una armonía que aún hoy imitamos, y nacieron dos géneros literarios inmensos: la epopeya y el teatro. Roma heredó todo ese legado, lo difundió por su gigantesco imperio y le añadió su genio para la ingeniería y el retrato realista. El arte y la literatura grecolatinos han sido, durante más de dos mil años, la gran referencia de la cultura occidental.",
    subhitos: [
      hito("grecia-roma", "escultura-griega", "La escultura griega", "Siglos V – IV a. C.",
        "¿Y si la belleza pudiera medirse con números?",
        [
          "Los escultores griegos buscaron representar el cuerpo humano de la forma más perfecta posible. Estudiaron las proporciones ideales y crearon figuras de una armonía y un equilibrio asombrosos.",
          "Sus estatuas parecen a punto de moverse: músculos tensos, posturas naturales, rostros serenos. Buscaban no solo copiar la realidad, sino mejorarla, mostrando al ser humano en su versión más noble.",
          "Para los griegos, la belleza estaba ligada al orden, la proporción y la medida. Creían que la armonía visible reflejaba una armonía más profunda del universo.",
          "Aquel ideal de belleza ha inspirado el arte occidental durante más de dos mil años.",
        ],
        "Dato curioso: muchas estatuas griegas que hoy vemos blancas estaban en realidad pintadas con colores vivos. El tiempo borró la pintura y nos dejó solo el mármol desnudo."),
      hito("grecia-roma", "templos-arquitectura", "Templos y armonía", "La arquitectura clásica",
        "¿Por qué seguimos construyendo edificios que imitan a los griegos?",
        [
          "Los griegos levantaron templos como el Partenón de Atenas, construidos con reglas de proporción tan cuidadas que aún hoy nos parecen perfectos.",
          "Inventaron los órdenes arquitectónicos, distintos estilos de columnas y decoración que darían forma a la arquitectura de Occidente durante siglos.",
          "Buscaban el equilibrio y la serenidad: edificios que transmitieran orden, armonía y grandeza sin resultar aplastantes.",
          "Su influencia es tan enorme que muchos museos, parlamentos y bancos de todo el mundo siguen imitando, todavía hoy, la forma de un templo griego.",
        ]),
      hito("grecia-roma", "homero", "Homero", "≈siglo VIII a. C.",
        "¿Puede un poema unir a todo un pueblo?",
        [
          "A Homero se le atribuyen las dos grandes epopeyas de la Antigüedad griega: la Ilíada, que narra un episodio de la guerra de Troya, y la Odisea, el largo y accidentado regreso a casa del héroe Ulises.",
          "Son poemas enormes, llenos de dioses, héroes, batallas y aventuras, pero también de sentimientos muy humanos: el honor, la ira, la nostalgia del hogar y el deseo de volver.",
          "Durante siglos se recitaron de memoria antes de ponerse por escrito. Los griegos los consideraban la base de su cultura y los aprendían desde niños.",
          "La Ilíada y la Odisea están entre las obras más influyentes de la literatura universal, y todavía hoy se leen y se estudian en todo el mundo.",
        ],
        "Dato curioso: no sabemos con certeza si Homero existió realmente o si fue una figura que reunió los relatos de muchos poetas anteriores."),
      hito("grecia-roma", "teatro-griego", "El teatro griego", "Siglo V a. C.",
        "¿Y si mirar una historia en un escenario pudiera cambiarte por dentro?",
        [
          "En Atenas nació el teatro tal como lo conocemos. Miles de espectadores se reunían en grandes graderíos al aire libre para ver representar tragedias y comedias.",
          "Las tragedias contaban historias de héroes enfrentados a su destino, al dolor y a decisiones imposibles. Buscaban conmover profundamente al público y hacerle reflexionar sobre la vida.",
          "Las comedias, en cambio, se reían de la política, de la sociedad y de las debilidades humanas.",
          "El teatro griego inventó una forma de arte que sigue vivísima: contar historias con actores sobre un escenario para emocionar y hacer pensar a la gente reunida.",
        ],
        "Dato curioso: en el teatro griego los actores llevaban máscaras para representar distintos personajes y emociones, y así podían verse incluso desde las gradas más altas."),
      hito("grecia-roma", "arte-romano", "El arte de Roma", "Siglos III a. C. – V d. C.",
        "¿Qué añade Roma a la belleza griega?",
        [
          "Roma admiró profundamente el arte griego y lo copió e imitó por todo su imperio. Pero también aportó lo suyo: un enorme talento para la ingeniería y un gusto por el realismo.",
          "Construyó acueductos, calzadas, anfiteatros como el Coliseo y edificios como el Panteón, con avances técnicos como el arco, la bóveda y el hormigón.",
          "En la escultura, los romanos hacían retratos tan realistas que mostraban las arrugas y los defectos de las personas, buscando el parecido antes que el ideal.",
          "En literatura, poetas como Virgilio dieron a Roma su gran epopeya, la Eneida, inspirada en Homero. Roma difundió toda esta cultura por Europa, donde echaría raíces para siempre.",
        ],
        "Dato curioso: muchas obras maestras griegas se han perdido, y solo las conocemos gracias a las copias que hicieron los romanos, que las admiraban tanto que las reprodujeron por todas partes."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 4 — LA EDAD MEDIA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "edad-media",
    titulo: "La Edad Media: fe y símbolo",
    anio: "Siglos V – XV",
    intro:
      "Durante la Edad Media, el arte y la literatura giraron sobre todo en torno a la religión. En una Europa profundamente cristiana, casi todo el arte se hacía para honrar a Dios: catedrales que se elevaban hacia el cielo, imágenes que enseñaban la fe a un pueblo que no sabía leer y libros copiados a mano con enorme paciencia en los monasterios. No se buscaba el realismo, sino el símbolo y lo sagrado. Y hacia el final del periodo, un poeta escribiría una obra tan inmensa que marcaría el paso hacia una nueva era.",
    subhitos: [
      hito("edad-media", "romanico-gotico", "Catedrales: románico y gótico", "Siglos XI – XV",
        "¿Cómo se construye un edificio para hacer sentir la presencia de Dios?",
        [
          "La Edad Media nos dejó dos grandes estilos de arte religioso. El románico, con iglesias de muros gruesos, arcos redondeados y aire sólido y sereno, como fortalezas de la fe.",
          "Después llegó el gótico, con catedrales altísimas, llenas de luz, con enormes vidrieras de colores y arcos que parecían estirarse hacia el cielo.",
          "Aquellas catedrales tardaban a veces más de cien años en construirse y eran el corazón de la ciudad. Todo en ellas buscaba elevar el alma hacia lo divino.",
          "El arte medieval no pretendía copiar la realidad, sino transmitir lo sagrado y hacer sentir al fiel la grandeza de Dios.",
        ],
        "Dato curioso: las grandes vidrieras góticas funcionaban como cómics luminosos: contaban historias de la Biblia con imágenes para que las entendiera un pueblo que en su mayoría no sabía leer."),
      hito("edad-media", "manuscritos-iluminados", "Los libros hechos a mano", "El scriptorium",
        "¿Cuánto se tarda en escribir un libro entero a mano?",
        [
          "Antes de la imprenta, cada libro se copiaba a mano, letra a letra. En los monasterios, los monjes dedicaban meses o años a reproducir textos sagrados y obras antiguas.",
          "Muchos de estos manuscritos se decoraban con bellísimas ilustraciones y letras doradas: son los llamados manuscritos iluminados, auténticas obras de arte.",
          "Gracias a esta labor paciente se conservaron muchos textos griegos y romanos que, de otro modo, se habrían perdido para siempre.",
          "El libro era entonces un objeto rarísimo y valiosísimo, al alcance de muy pocos. Leer era un privilegio.",
        ],
        "Dato curioso: algunos manuscritos eran tan valiosos que se encadenaban a los muros de las bibliotecas para que nadie pudiera robarlos."),
      hito("edad-media", "dante", "Dante y la Divina Comedia", "1265 – 1321",
        "¿Puede un poema recorrer el infierno, el purgatorio y el paraíso?",
        [
          "El poeta italiano Dante Alighieri escribió la Divina Comedia, uno de los mayores poemas de toda la literatura. En él, Dante imagina un viaje por el infierno, el purgatorio y el paraíso.",
          "A lo largo del camino se encuentra con personajes históricos y refleja toda la visión del mundo de su época: la religión, la moral, la política y el amor.",
          "Lo revolucionario es que no lo escribió en latín, la lengua culta, sino en italiano, la lengua del pueblo. Con ello acercó la gran literatura a la gente corriente.",
          "La Divina Comedia es como un puente: cierra la Edad Media y anuncia ya el espíritu del Renacimiento que estaba a punto de llegar.",
        ],
        "Dato curioso: al escribir en italiano y no en latín, Dante ayudó a convertir su lengua en un idioma literario. Por eso se le considera uno de los padres del italiano moderno."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 5 — EL RENACIMIENTO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "renacimiento",
    titulo: "El Renacimiento: el ser humano en el centro",
    anio: "Siglos XV – XVI",
    intro:
      "En el Renacimiento, el arte vivió una explosión sin igual. Los artistas volvieron la mirada a Grecia y Roma, redescubrieron la belleza del cuerpo humano y colocaron de nuevo al ser humano en el centro de todo. Aprendieron a representar el mundo con un realismo asombroso gracias a la perspectiva, estudiaron la anatomía y la naturaleza, y crearon algunas de las obras más admiradas de la historia. Fue una época de genios totales, capaces de pintar, esculpir, inventar y pensar. Y, gracias a la imprenta, la literatura pudo por fin llegar a muchísima más gente.",
    subhitos: [
      hito("renacimiento", "perspectiva", "El descubrimiento de la perspectiva", "Siglo XV",
        "¿Cómo se mete la profundidad del mundo en una superficie plana?",
        [
          "Durante toda la Edad Media, las pinturas parecían planas: no había sensación de profundidad. En el Renacimiento, los artistas descubrieron la perspectiva, una técnica para representar el espacio tal como lo ve el ojo.",
          "Usando reglas matemáticas, aprendieron a pintar de forma que las cosas parecieran más pequeñas cuanto más lejos estaban, creando la ilusión de profundidad en un cuadro plano.",
          "De pronto, las pinturas se convirtieron en ventanas abiertas a un mundo tridimensional y realista.",
          "La perspectiva unió el arte y la ciencia: para pintar mejor la realidad, los artistas tuvieron que estudiar matemáticas, óptica y geometría.",
        ],
        "Dato curioso: la perspectiva fue un descubrimiento tan importante que cambió para siempre la pintura. Fue como pasar del dibujo plano a una imagen casi en tres dimensiones."),
      hito("renacimiento", "leonardo", "Leonardo da Vinci", "1452 – 1519",
        "¿Puede una sola persona ser pintor, científico e inventor a la vez?",
        [
          "Leonardo da Vinci es el símbolo perfecto del genio renacentista. Fue pintor, pero también inventor, ingeniero, anatomista y estudioso de la naturaleza.",
          "Pintó obras tan famosas como la Mona Lisa y La última cena, con una técnica y una expresividad que aún hoy fascinan al mundo entero.",
          "Llenó miles de cuadernos con dibujos y anotaciones: estudios del cuerpo humano, máquinas voladoras, planos de ingeniería, observaciones de plantas y agua.",
          "Para Leonardo, el arte y la ciencia eran lo mismo: dos formas de observar y comprender el mundo con curiosidad infinita.",
        ],
        "Dato curioso: la Mona Lisa es hoy el cuadro más famoso del mundo. Su misteriosa sonrisa sigue fascinando a millones de personas que hacen cola cada año para verla."),
      hito("renacimiento", "miguel-angel", "Miguel Ángel", "1475 – 1564",
        "¿Cómo se saca una figura viva de un bloque de mármol?",
        [
          "Miguel Ángel fue uno de los mayores artistas de todos los tiempos, genial tanto en la escultura como en la pintura y la arquitectura.",
          "Esculpió obras como el David, una figura de mármol de más de cinco metros que parece a punto de respirar, y pintó el impresionante techo de la Capilla Sixtina, cubriéndolo de escenas bíblicas.",
          "Trabajaba con una intensidad y una entrega absolutas, buscando en cada obra la máxima expresión de la fuerza y la belleza del ser humano.",
          "Decía que esculpir consistía en «liberar» la figura que ya estaba dormida dentro del bloque de mármol, quitando lo que sobraba.",
        ],
        "Dato curioso: Miguel Ángel pintó el techo de la Capilla Sixtina, de cientos de metros cuadrados, en unos cuatro años, trabajando tumbado y mirando hacia arriba durante jornadas interminables."),
      hito("renacimiento", "imprenta-libro", "La imprenta y el libro", "≈1450",
        "¿Qué ocurre cuando de pronto los libros pueden fabricarse por miles?",
        [
          "Hacia 1450, Johannes Gutenberg inventó en Europa la imprenta de tipos móviles. Por primera vez, los libros podían fabricarse rápido y en gran cantidad, en lugar de copiarse a mano uno a uno.",
          "El efecto fue inmenso. Los libros se volvieron mucho más baratos y abundantes, y el saber dejó de estar reservado a unos pocos privilegiados.",
          "Más gente aprendió a leer, las ideas viajaron a una velocidad nunca vista y la literatura pudo llegar a un público enorme.",
          "La imprenta transformó para siempre la cultura. Sin ella, no se entienden ni la ciencia moderna, ni las grandes revoluciones de ideas que vendrían después.",
        ],
        "Dato curioso: el primer gran libro impreso por Gutenberg fue una Biblia. Hoy, los pocos ejemplares que se conservan están entre los libros más valiosos del mundo."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 6 — EL BARROCO Y EL SIGLO DE ORO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "barroco",
    titulo: "El Barroco: emoción y movimiento",
    anio: "Siglo XVII",
    intro:
      "Si el Renacimiento buscaba el equilibrio y la serenidad, el Barroco buscó lo contrario: la emoción, el movimiento y el impacto. El arte se volvió teatral, lleno de luces y sombras intensas, de gestos dramáticos y escenas cargadas de sentimiento, para conmover al espectador. Fue también una época dorada para la literatura: en apenas unos años vivieron dos de los mayores escritores de todos los tiempos, que crearon obras y personajes que siguen entre nosotros cuatro siglos después.",
    subhitos: [
      hito("barroco", "caravaggio-barroco", "El Barroco y la luz", "Siglo XVII",
        "¿Y si la luz y la sombra pudieran contar una historia por sí solas?",
        [
          "Los artistas barrocos descubrieron el enorme poder dramático de la luz. Pintores como Caravaggio iluminaban con fuerza a sus personajes sobre fondos oscuros, creando un intenso contraste llamado claroscuro.",
          "Sus escenas parecen instantes congelados de máxima emoción: gestos dramáticos, movimiento, tensión. El objetivo era conmover al espectador y llevarlo dentro de la escena.",
          "El Barroco lo llenaba todo: iglesias, palacios y plazas se cubrieron de esculturas, pinturas y decoración exuberante.",
          "Fue un arte pensado para impresionar y emocionar, para tocar el corazón antes que la razón.",
        ],
        "Dato curioso: el claroscuro, ese fuerte contraste entre luz y sombra que inventó el Barroco, sigue usándose hoy en el cine y la fotografía para crear escenas llenas de dramatismo."),
      hito("barroco", "velazquez", "Velázquez", "1599 – 1660",
        "¿Puede un cuadro meterte dentro de la escena?",
        [
          "Diego Velázquez, pintor de la corte española, fue uno de los mayores genios de la pintura de todos los tiempos. Dominaba la luz, el color y el realismo como casi nadie.",
          "Su obra más famosa, Las Meninas, es un cuadro tan ingenioso que aún hoy sorprende: juega con los espejos, las miradas y el punto de vista, e incluye al propio pintor pintando.",
          "Velázquez retrataba tanto a reyes como a gente humilde con la misma verdad y dignidad, captando la vida tal como era.",
          "Siglos después, artistas de todo el mundo seguirían estudiando sus cuadros para aprender a pintar la realidad y la luz.",
        ],
        "Dato curioso: Las Meninas ha fascinado tanto a otros pintores que grandes artistas posteriores, como Picasso, hicieron sus propias versiones del cuadro."),
      hito("barroco", "cervantes", "Cervantes y el Quijote", "1547 – 1616",
        "¿Cuál fue la primera novela moderna de la historia?",
        [
          "El español Miguel de Cervantes escribió Don Quijote de la Mancha, considerada la primera novela moderna y una de las obras más importantes de la literatura universal.",
          "Cuenta la historia de un hidalgo que, de tanto leer libros de caballerías, pierde el juicio y se lanza a los caminos creyéndose un caballero andante, acompañado por el sencillo Sancho Panza.",
          "Es una obra genial que mezcla la comedia y la ternura, la locura y la sabiduría, y que se ríe con cariño de los sueños y las debilidades humanas.",
          "Don Quijote y Sancho se han convertido en dos de los personajes más famosos y queridos de toda la literatura.",
        ],
        "Dato curioso: Don Quijote es uno de los libros más traducidos y leídos de la historia, solo por detrás de la Biblia. Se lee en todo el mundo cuatro siglos después."),
      hito("barroco", "shakespeare", "Shakespeare", "1564 – 1616",
        "¿Puede un autor de hace cuatro siglos entender el corazón humano mejor que nadie?",
        [
          "El inglés William Shakespeare es probablemente el mayor autor de teatro de la historia. Escribió tragedias, comedias y dramas que aún se representan cada día en todo el mundo.",
          "Obras como Romeo y Julieta, Hamlet o Macbeth exploran los sentimientos humanos más profundos: el amor, los celos, la ambición, la duda, la venganza y la muerte.",
          "Creó personajes tan vivos y complejos que parecen personas reales, y escribió con una riqueza de lenguaje que enriqueció el idioma inglés para siempre.",
          "Curiosamente, Shakespeare y Cervantes, los dos gigantes de su época, murieron casi al mismo tiempo, en 1616.",
        ],
        "Dato curioso: se calcula que Shakespeare inventó o popularizó cientos de palabras y expresiones que todavía se usan hoy en inglés."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 7 — ROMANTICISMO Y REALISMO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "siglos-xviii-xix",
    titulo: "Romanticismo y Realismo",
    anio: "Siglos XVIII – XIX",
    intro:
      "En los siglos XVIII y XIX, el arte y la literatura se volvieron más personales y más libres. Frente a las reglas estrictas, el Romanticismo defendió la emoción, la imaginación, la naturaleza salvaje y la rebeldía del individuo. Después, el Realismo quiso retratar la vida tal como era, incluyendo la de la gente humilde y los problemas de la sociedad. Fue el gran siglo de la novela, que se convirtió en el espejo de toda una época, y también el momento en que la pintura empezó a atreverse a romper sus propias reglas.",
    subhitos: [
      hito("siglos-xviii-xix", "goya-romanticismo", "Goya y el Romanticismo", "Siglos XVIII – XIX",
        "¿Puede el arte mostrar también el horror y no solo la belleza?",
        [
          "El Romanticismo puso por delante la emoción, la libertad y la imaginación. Los artistas pintaron tormentas, paisajes grandiosos, pasiones intensas y también los lados oscuros del ser humano.",
          "El español Francisco de Goya es una figura clave. Empezó pintando escenas amables, pero acabó retratando la guerra, la injusticia y las pesadillas con una fuerza estremecedora.",
          "Su cuadro sobre los fusilamientos del pueblo de Madrid muestra el horror de la guerra sin adornarlo, denunciando la crueldad.",
          "Con el Romanticismo, el arte se volvió más personal: ya no buscaba solo la belleza, sino expresar todo lo que siente el ser humano, incluido el miedo y el dolor.",
        ],
        "Dato curioso: al final de su vida, Goya pintó las llamadas «pinturas negras» directamente en las paredes de su casa, obras oscuras y perturbadoras que no pensaba mostrar a nadie."),
      hito("siglos-xviii-xix", "novela-xix", "La gran novela del siglo XIX", "Siglo XIX",
        "¿Y si un libro pudiera retratar toda una sociedad?",
        [
          "El siglo XIX fue la edad de oro de la novela. Autores de toda Europa escribieron largas historias que retrataban la sociedad de su tiempo con enorme detalle.",
          "Escritores como Charles Dickens en Inglaterra denunciaron la pobreza y la injusticia; en Rusia, Tolstói y Dostoyevski exploraron el alma humana con una profundidad inmensa; en España brilló Benito Pérez Galdós.",
          "Estas novelas contaban las vidas de personajes de todas las clases sociales y hacían pensar al lector sobre la sociedad, la moral y la vida.",
          "La novela se convirtió en el gran arte popular de la época: se leía en todas partes y llegaba a muchísima gente.",
        ],
        "Dato curioso: muchas novelas famosas del siglo XIX se publicaban por capítulos en los periódicos. La gente esperaba con impaciencia la siguiente entrega, como hoy esperamos el próximo episodio de una serie."),
      hito("siglos-xviii-xix", "impresionismo", "El Impresionismo", "≈1870 – 1900",
        "¿Y si el arte dejara de copiar la realidad para pintar cómo la vemos?",
        [
          "A finales del siglo XIX, un grupo de pintores en Francia se cansó de las reglas de la pintura tradicional. Salieron al aire libre a pintar la luz, el color y los instantes fugaces.",
          "Artistas como Claude Monet daban pinceladas sueltas y vibrantes para captar la impresión de un momento: el reflejo del sol en el agua, la niebla, un jardín en primavera.",
          "De cerca, sus cuadros parecían manchas de color; de lejos, cobraban vida. Buscaban pintar no tanto las cosas, sino la sensación de verlas.",
          "El Impresionismo fue una pequeña revolución: abrió la puerta a que el arte dejara de imitar la realidad y empezara a explorar formas totalmente nuevas de ver el mundo.",
        ],
        "Dato curioso: el movimiento tomó su nombre de un cuadro de Monet titulado «Impresión, sol naciente». Al principio era una burla de los críticos, pero los artistas la adoptaron con orgullo."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 8 — LAS VANGUARDIAS
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "vanguardias",
    titulo: "El arte se rompe: las vanguardias",
    anio: "Primera mitad del siglo XX",
    intro:
      "En el siglo XX, el arte estalló en mil direcciones. Con la invención de la fotografía, ya no hacía falta que la pintura copiara la realidad: una máquina lo hacía mejor. Así que los artistas se lanzaron a explorar lo que ninguna cámara podía captar: las emociones, los sueños, las ideas, la pura forma y el color. Rompieron todas las reglas que habían durado siglos. La literatura también se transformó, buscando nuevas maneras de contar el mundo interior y de reflejar un siglo lleno de guerras, cambios y preguntas. Fueron las vanguardias: la mayor revolución artística de la historia.",
    subhitos: [
      hito("vanguardias", "picasso-cubismo", "Picasso y el cubismo", "1881 – 1973",
        "¿Y si pudieras pintar un rostro desde varios lados a la vez?",
        [
          "El español Pablo Picasso fue uno de los artistas más influyentes de la historia. Junto a otros, inventó el cubismo, una forma totalmente nueva de pintar.",
          "En lugar de representar las cosas desde un solo punto de vista, las descomponía en formas geométricas y las mostraba desde varios ángulos a la vez, como si rompiera la realidad y la recompusiera.",
          "Picasso no dejó de reinventarse durante toda su vida, pasando por muchos estilos distintos. Pintó también obras de fuerte denuncia, como el Guernica, contra el horror de la guerra.",
          "Con él y las vanguardias, el arte se liberó por completo: ya no tenía que parecerse a la realidad para ser válido.",
        ],
        "Dato curioso: Picasso fue tan prolífico que creó decenas de miles de obras a lo largo de su vida, entre cuadros, dibujos, esculturas y cerámicas."),
      hito("vanguardias", "surrealismo-dali", "El surrealismo", "≈1920 – 1940",
        "¿Puede el arte pintar los sueños?",
        [
          "Los surrealistas quisieron llevar al lienzo el mundo de los sueños, el inconsciente y la imaginación más libre, inspirados por las nuevas ideas sobre la mente.",
          "El español Salvador Dalí pintó imágenes imposibles con un realismo asombroso: relojes que se derriten, paisajes oníricos, escenas que desafían toda lógica.",
          "Buscaban sorprender, inquietar y liberar la mente de la razón, mostrando que el arte podía habitar mundos que no existen.",
          "El surrealismo demostró que el arte no tenía por qué representar lo real: podía inventar realidades nuevas salidas directamente de la imaginación.",
        ],
        "Dato curioso: Dalí cultivó una imagen tan extravagante como su arte, con su inconfundible bigote y sus salidas provocadoras. Convirtió su propia vida en una obra surrealista."),
      hito("vanguardias", "literatura-moderna", "La literatura se transforma", "Siglo XX",
        "¿Y si una novela intentara meterse dentro de la mente de un personaje?",
        [
          "La literatura del siglo XX también rompió sus moldes. Los escritores buscaron nuevas formas de contar, más allá de la historia ordenada de principio a fin.",
          "Autores como Franz Kafka crearon mundos angustiosos y absurdos que reflejaban el desconcierto del ser humano moderno; otros, como James Joyce, intentaron reproducir el fluir mismo de los pensamientos.",
          "La poesía se liberó de las reglas clásicas y buscó nuevas imágenes y ritmos para expresar un mundo que cambiaba a toda velocidad.",
          "Fue una literatura que reflejaba un siglo convulso, lleno de guerras y transformaciones, y que se atrevía a explorar las zonas más profundas y extrañas de la mente humana.",
        ],
        "Dato curioso: de Kafka nació el adjetivo «kafkiano», que usamos para describir situaciones absurdas, angustiosas y sin salida, como las de sus relatos."),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // ETAPA 9 — EL ARTE HOY Y EL FUTURO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "arte-hoy",
    titulo: "El arte hoy y el futuro",
    anio: "Siglos XX – XXI",
    intro:
      "En el último siglo, el arte se ha vuelto más libre y más diverso que nunca. Ya no hay un solo estilo ni unas reglas fijas: hay mil formas de crear. Aparecieron artes completamente nuevas, como el cine, la fotografía y el cómic, capaces de contar historias a millones de personas. Y la tecnología abrió puertas que ningún artista del pasado habría imaginado, hasta llegar al arte digital y a las máquinas que crean imágenes. En medio de tanto cambio, sigue viva la misma pregunta del principio: ¿por qué necesitamos crear?",
    subhitos: [
      hito("arte-hoy", "arte-contemporaneo", "El arte contemporáneo", "Siglo XX – XXI",
        "¿Puede ser arte algo que no se parece a nada?",
        [
          "En el arte contemporáneo, casi todo es posible. Algunos artistas abandonaron por completo las figuras y pintaron solo formas y colores: es el arte abstracto.",
          "Otros hicieron del arte una idea o una experiencia: instalaciones, objetos cotidianos convertidos en obras, acciones en directo. Lo importante ya no era la técnica, sino el mensaje o la pregunta.",
          "El arte se volvió muy libre, pero también más difícil de entender, y a veces genera debate: ¿esto es arte o no lo es?",
          "Quizá esa discusión sea parte de su sentido: el arte contemporáneo nos obliga a preguntarnos, una vez más, qué es realmente el arte.",
        ]),
      hito("arte-hoy", "cine-nuevas-artes", "El cine y las nuevas artes", "Desde el siglo XX",
        "¿Cuál es el gran arte que nació en el siglo XX?",
        [
          "El siglo XX trajo artes completamente nuevas. La fotografía capturó la realidad en un instante; el cine unió imagen, movimiento, música e historia en un espectáculo total.",
          "El cine se convirtió en el gran arte popular de nuestra época, capaz de emocionar a millones de personas a la vez y de contar historias como nunca antes.",
          "También el cómic, la animación y, más tarde, los videojuegos, se sumaron como formas nuevas de narrar y crear.",
          "Todas estas artes demuestran que la necesidad de contar historias no ha desaparecido: solo ha encontrado formas nuevas de expresarse.",
        ],
        "Dato curioso: cuando se proyectaron las primeras películas, hace más de cien años, algunos espectadores se asustaron al ver un tren avanzar hacia ellos en la pantalla."),
      hito("arte-hoy", "arte-digital", "El arte digital y el futuro", "Siglo XXI",
        "¿Y si una máquina pudiera crear una obra de arte?",
        [
          "Los ordenadores han abierto un mundo nuevo para la creación. Hoy se crea arte digital, música electrónica, animaciones y diseños que serían imposibles con las técnicas tradicionales.",
          "Internet ha permitido que cualquier persona comparta sus creaciones con todo el mundo, sin necesidad de galerías ni editoriales.",
          "Y han aparecido programas de inteligencia artificial capaces de generar imágenes, textos y música, lo que plantea preguntas apasionantes: ¿puede una máquina ser creativa?, ¿qué significa entonces ser artista?",
          "El futuro del arte está por escribir, y probablemente lo escribirán herramientas que hoy apenas empezamos a imaginar.",
        ]),
      hito("arte-hoy", "por-que-crea", "Por qué seguimos creando", "",
        "Después de decenas de miles de años creando, descubrimos algo sorprendente.",
        [
          "Hemos pasado de pintar bisontes en una cueva a generar imágenes con ordenadores; de recitar mitos junto al fuego a contar historias en pantallas de todo el mundo.",
          "Han cambiado las técnicas, los estilos y los materiales, pero el impulso profundo es siempre el mismo: expresar lo que sentimos, comprender el mundo y dejar huella.",
          "El arte y la literatura son el espejo en el que cada época se ha mirado. Gracias a ellos podemos sentir lo que sintieron personas que vivieron hace miles de años.",
          "Esa es quizá la mayor lección de este viaje: crear no es un lujo, sino una de las formas más hondas de ser humanos.",
          "Y esa historia no ha terminado. Continúa en cada persona que se atreve a cantar, escribir, pintar o imaginar algo nuevo. También en ti.",
        ]),
    ],
  },
];
