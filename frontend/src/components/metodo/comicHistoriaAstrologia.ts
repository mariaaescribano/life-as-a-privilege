import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Segundo cómic de intro de Astrología: «La Historia de la Astrología».
//
// Va DESPUÉS del cómic del Origen según la espiritualidad
// (ORIGEN_ESPIRITUALIDAD): van SEGUIDOS pero son cómics distintos. Al terminar
// (o pulsar el botón «Astrología →»), se entra al contenido de la disciplina.
//
// CÓMO SE CUENTA: un solo hilo de principio a fin — el cielo empieza hablando
// de reinos, aprende a hablar de personas, se vuelve oficio de palacio, entra en
// las universidades, la ciencia se le separa y sobrevive como lenguaje. Frases
// cortas, una idea por párrafo y el porqué siempre delante del dato. Dos viñetas
// son PAUSAS (eyebrow «Una pausa»): se sale del hilo un momento para mirar quién
// tenía acceso al saber y quién no.
//
// SON QUINCE Y SE QUEDAN EN QUINCE. Si hay que contar algo más, se mete dentro
// de la viñeta que le toca; no se añaden viñetas nuevas.
//
// FOTOS · /viñetas/astrologia/historia/ · WebP (el PNG da 404: la ruta se arma
//   sola y lleva la extensión escrita).
//   Cada foto se llama como lo que cuenta, en el orden del cómic: mesopotamia,
//   astrologosdelrey, zodiaco, alejandro, grecia, roma, nobleza, cortes,
//   universidades, pausaqarawiyyin, alandalus, revolucioncientifica,
//   periodico1930, jung, hoy.
//   HECHAS LAS QUINCE (agosto de 2026). Si alguna se repinta, se sustituye el
//   WebP con el mismo nombre; mientras un nombre no exista, ComicViewer pinta
//   «Viñeta N próximamente» y el cómic va igual.
// ─────────────────────────────────────────────────────────────────────────

const F = (n: string) => `/viñetas/astrologia/historia/${n}.webp`;

export const HISTORIA_ASTROLOGIA: Vineta[] = [
  // 1 — El nacimiento y el registro
  {
    src: F("mesopotamia"),
    eyebrow: "Mesopotamia · 2000 a.C.",
    titulo: "",
    paragraphs: [
      "La Astrología empezó gracias a la observación constante del cielo.",
      "Los sacerdotes registraban eclipses, planetas y estrellas para intentar comprender los presagios que afectaban al reino.",
      "No buscaban conocer el futuro de las personas. Querían entender el destino de los pueblos.",
      "Y aquí está lo que lo cambió todo: no se limitaron a mirar, lo escribieron. Noche tras noche, en tablillas de barro, durante más de seiscientos años seguidos.",
      "Es la serie de observaciones más larga que ha hecho la humanidad hasta la época moderna. Con tantos siglos de datos dejaron de solo mirar y empezaron a predecir: sabían cuándo habría un eclipse antes de que ocurriera.",
    ],
  },
  // 2 — Los astrólogos del rey
  {
    src: F("astrologosdelrey"),
    titulo: "",
    paragraphs: [
      "La Astrología se convirtió en una herramienta para los reyes.",
      "Antes de tomar decisiones importantes, consultaban a los astrólogos de su corte.",
      "Para ellos, el cielo podía advertir guerras, hambrunas o la muerte del rey.",
      "No eran adivinos de feria: eran funcionarios del Estado que mandaban sus informes por escrito a palacio.",
    ],
  },
  // 3 — El Zodiaco
  {
    src: F("zodiaco"),
    eyebrow: "Babilonia · 500 a.C.",
    titulo: "",
    paragraphs: [
      "Para medir el movimiento de los planetas de forma más rápida y precisa, los babilonios dividieron el cielo en un círculo de 360° y lo separaron en 12 partes iguales.",
      "Así nació el Zodiaco.",
      "Doce tramos de 30 grados, todos del mismo tamaño, que convirtieron el cielo en algo que se podía calcular con números en lugar de solo mirar.",
    ],
  },
  // 4 — Alejandro y la Astrología helenística
  {
    src: F("alejandro"),
    eyebrow: "331 a.C. · Alejandría",
    titulo: "Alejandro Magno",
    paragraphs: [
      "Alejandro conquistó Babilonia y no arrasó con lo que encontró: se lo llevó.",
      "Aquellos archivos milenarios empezaron a traducirse al griego, y en la ciudad que fundó en Egipto, Alejandría, se juntaron dos mundos que habían caminado separados: el cálculo babilonio y la filosofía griega.",
      "De esa mezcla salió la Astrología helenística, y con ella el giro más importante de esta historia.",
      "Por primera vez alguien levantó el mapa del cielo del instante exacto en que había nacido UNA persona. El cielo dejó de hablar de reinos y empezó a hablar de vidas.",
      "En el siglo II, Ptolomeo lo reunió todo en el Tetrabiblos: el libro que dominaría la Astrología durante más de 1.400 años.",
    ],
  },
  // 5 — Grecia: el ser humano y las casas
  {
    src: F("grecia"),
    titulo: "Grecia",
    paragraphs: [
      "¿Y por qué ocurrió justo ahí? Porque los griegos llevaban siglos haciéndose otra pregunta.",
      "Los babilonios le preguntaban al cielo qué va a pasar. Los griegos preguntaban qué es el ser humano, de qué está hecho, por qué actúa como actúa. En el templo de Delfos tenían grabada su obsesión: «Conócete a ti mismo».",
      "Con esa costumbre, el cielo se convirtió en otra cosa: dejó de ser un calendario de avisos para ser un retrato del carácter.",
      "Y añadieron una pieza que en Babilonia no existía: las doce casas. Los signos cuentan CÓMO eres; las casas, DÓNDE se nota — el trabajo, el dinero, la familia, el amor, la salud, los finales.",
      "Para calcularlas ya no basta el día: hacen falta la hora y el lugar exactos. De ahí sale el Ascendente, el grado que asomaba por el horizonte al nacer y que cambia cada dos horas. Por eso dos personas del mismo signo pueden tener cartas que no se parecen en nada.",
    ],
  },
  // 6 — Roma: los dioses prestados y el miedo
  {
    src: F("roma"),
    titulo: "Roma",
    paragraphs: [
      "Roma conquistó Grecia con las armas, y Grecia conquistó a Roma con todo lo demás: su filosofía, su arte y sus dioses, a los que los romanos cambiaron el nombre y se quedaron.",
      "Ares pasó a llamarse Marte. Afrodita, Venus. Zeus, Júpiter. Hermes, Mercurio. Crono, Saturno. Son exactamente los nombres que lees hoy en tu carta: etiqueta romana y carácter griego.",
      "Los emperadores confiaban en la Astrología. Pero también la temían.",
      "Buscar en las estrellas cuándo moriría un emperador podía considerarse una conspiración: si alguien sabía la fecha, alguien podía organizarse para adelantarla.",
      "Por eso se expulsó a los astrólogos de Roma más de una vez, y preguntar por la salud del emperador llegó a castigarse con la muerte. El mismo hombre que tenía astrólogo de cabecera era el que prohibía consultarlos.",
    ],
  },
  // 7 — Solo para unos pocos (+ pausa: el saber encerrado en palacio)
  {
    src: F("nobleza"),
    eyebrow: "Una pausa",
    titulo: "Solo para unos pocos",
    paragraphs: [
      "Para levantar una carta natal hacen falta cuatro cosas: la hora exacta del nacimiento, unas tablas con las posiciones de los planetas, saber calcular y saber leer.",
      "Nada de eso estaba al alcance de la inmensa mayoría. De la gente corriente no se anotaba la hora de nacer; a veces ni siquiera el día.",
      "Así que durante siglos la Astrología fue, en la práctica, un servicio de palacio.",
      "Y fíjate en que no es la primera vez que te encuentras esto: el qigong se practicó durante siglos dentro de palacio y en los monasterios, reservado a la corte y a los monjes, sin estar a disposición de la población.",
      "Casi todo el conocimiento que hoy nos parece de todos empezó siendo de unos pocos. Que puedas leer esto es el final de una historia muy larga de gente a la que no se le dejó.",
    ],
  },
  // 8 — Las cortes de Europa
  {
    src: F("cortes"),
    eyebrow: "Europa · Siglos XIII-XVI",
    titulo: "El astrólogo de la corte",
    paragraphs: [
      "En la Europa medieval el astrólogo no era un personaje pintoresco: era un cargo de la corte, como el médico o el tesorero. Se le consultaba para elegir el día de una coronación, de una boda o de una batalla.",
      "Ningún rey hizo tanto por este saber como Alfonso X de Castilla. Montó en Toledo un taller donde trabajaban juntos sabios cristianos, musulmanes y judíos traduciendo todo el conocimiento astronómico y astrológico que llegaba del mundo árabe.",
      "De allí salieron las Tablas alfonsíes, usadas en toda Europa para calcular la posición de los planetas durante casi trescientos años. Y tomó una decisión enorme: mandó traducir al castellano, no al latín. La lengua de la calle sirviendo para la ciencia.",
      "No fue solo Castilla: Carlos V de Francia tuvo astrólogos a su servicio y una de las grandes bibliotecas de su tiempo, y en la corte de Ricardo II de Inglaterra se copiaron e ilustraron manuscritos astrológicos.",
      "Los Reyes Católicos consultaron astrólogos, y Felipe II reunió en El Escorial tratados de astrología y tuvo matemáticos a su servicio. Aunque en su época empezó a marcarse una línea: la Iglesia permitía la astrología del calendario, las cosechas y la medicina, y condenó la que pretendía adivinar el destino de una persona.",
    ],
  },
  // 9 — Las universidades
  {
    src: F("universidades"),
    eyebrow: "Bolonia · 1088",
    titulo: "En las universidades",
    paragraphs: [
      "Conviene decirlo claro, porque hoy suena raro: la Astrología se enseñaba en la universidad. No a escondidas. Con cátedra, temario y exámenes.",
      "En 1088 nace Bolonia, la primera universidad europea, y la astronomía entra como lo que se consideraba: una disciplina matemática, la de calcular con exactitud dónde va a estar cada planeta.",
      "La Astrología usaba esos mismos cálculos para interpretar qué influencia tenían sobre las personas y sobre lo que iba a ocurrir.",
      "Por eso no eran dos oficios enfrentados: el mismo estudioso calculaba por la mañana la posición de los planetas y levantaba por la tarde un horóscopo, con las mismas tablas y la misma matemática.",
      "Y buena parte de sus alumnos eran estudiantes de medicina, porque tratar a un enfermo sin mirar el cielo se consideraba una temeridad.",
    ],
  },
  // 10 — PAUSA · al-Qarawiyyin
  {
    src: F("pausaqarawiyyin"),
    eyebrow: "Una pausa",
    titulo: "La universidad más antigua del mundo",
    paragraphs: [
      "Cuando decimos «universidad» pensamos siempre en Bolonia, en París o en Oxford.",
      "La institución de educación superior más antigua del mundo en funcionamiento continuo no está en Europa: está en Fez, en Marruecos, y se llama al-Qarawiyyin.",
      "Se fundó en el año 859 y la fundó una mujer musulmana, Fátima al-Fihri, que gastó en ella la herencia de su padre.",
      "Lo reconoce la UNESCO. Doscientos treinta años antes que Bolonia, y sigue abierta hoy.",
      "Allí se enseñaba derecho y Corán, sí, pero también matemáticas, medicina y astronomía. Exactamente el saber que estamos siguiendo.",
    ],
  },
  // 11 — Bagdad, Córdoba, Toledo
  {
    src: F("alandalus"),
    titulo: "Bagdad, Córdoba, Toledo",
    paragraphs: [
      "¿Y de dónde salían esas tablas y esos libros? De un puente que Europa estuvo a punto de perder.",
      "Durante la Edad de Oro del Islam, Bagdad se convirtió en el centro del conocimiento del mundo: se tradujo todo el saber griego, se conservó y se mejoró.",
      "En al-Ándalus, Córdoba llegó a tener una biblioteca de cientos de miles de volúmenes, y en Toledo el astrónomo Azarquiel elaboró unas tablas que se usaron en toda Europa.",
      "Cuando Toledo pasó a manos cristianas, aquellos libros empezaron a traducirse al latín. Sin ese puente no habría vuelto ni Ptolomeo, ni Aristóteles, ni la mitad de lo que vino después.",
    ],
  },
  // 12 — Los que la usaban fueron los que la separaron
  {
    src: F("revolucioncientifica"),
    eyebrow: "Siglos XVI-XVII",
    titulo: "La Revolución Científica",
    paragraphs: [
      "La Astrología no se apagó en el Renacimiento: vivió su mayor esplendor, y la frontera entre ciencia y astrología todavía no existía.",
      "Kepler, el hombre que descubrió que los planetas giran en elipses, se ganaba la vida haciendo cartas astrales. Despreciaba los horóscopos simplones, pero escribió que la Astrología es la hija loca de la Astronomía y que, sin lo que gana la hija, la madre se moriría de hambre.",
      "Galileo, catedrático de matemáticas en Padua, tenía que enseñar Astrología a los estudiantes de medicina —era materia obligatoria— y levantó cartas natales por encargo, cobrando por ellas, incluidas las de sus hijas.",
      "Y fueron precisamente ellos quienes acabaron dejándola fuera. No por decreto: por método. La Astronomía empezó a exigir observar midiendo, expresarlo en matemáticas y formular leyes que cualquiera pudiera comprobar… y que pudieran fallar. Esa última es la que la Astrología no podía cumplir: sus aciertos se contaban y sus fallos se explicaban.",
      "Newton lo remató con una sola idea. La gravedad explicaba a la vez por qué cae una manzana y por qué la Luna no se va, y por primera vez se pudo predecir el cielo sin necesidad de que significara nada. El cielo dejó de ser un mensaje y pasó a ser un mecanismo.",
      "La Astrología salió de la ciencia. No salió de la vida de la gente: siguió en los almanaques, en el campo y en la cultura popular, como tradición y como práctica adivinatoria.",
    ],
  },
  // 13 — La primera carta astral en un periódico
  {
    src: F("periodico1930"),
    eyebrow: "1930",
    titulo: "",
    paragraphs: [
      "La Astrología resurgió cuando la primera carta astral publicada en un periódico apareció en 1930 con motivo del nacimiento de la princesa Margarita de Inglaterra, hermana menor de la futura reina Isabel II.",
      "El gran interés que despertó entre los lectores llevó al periódico a publicar una sección astrológica de forma regular.",
      "Su éxito hizo que otros diarios copiaran la idea y, desde entonces, los horóscopos y las cartas astrales se popularizaron en la prensa de todo el mundo.",
      "Con un detalle importante: para que cupiera en un periódico había que reducirlo todo a doce grupos, uno por signo solar. Ahí nació el horóscopo tal y como lo conoces.",
    ],
  },
  // 14 — Jung y el lenguaje simbólico
  {
    src: F("jung"),
    eyebrow: "",
    titulo: "",
    paragraphs: [
      "Carl Gustav Jung consideraba la Astrología un lenguaje simbólico más que un método para predecir el futuro.",
      "Su teoría del inconsciente colectivo sostiene que todos compartimos arquetipos universales —como el Héroe, el Sabio o la Sombra— que aparecen en mitos, sueños y religiones.",
      "Jung observó que la Astrología también organiza la experiencia humana mediante símbolos, donde los planetas, signos y casas representan distintos aspectos de la psique y del desarrollo personal.",
      "La carta natal no determina el destino, sino que actúa como un mapa simbólico del mundo interior y del proceso de individuación, el camino hacia el conocimiento e integración de uno mismo.",
    ],
  },
  // 15 — Hoy
  {
    src: F("hoy"),
    titulo: "Hoy",
    paragraphs: [
      "Cuatro mil años después seguimos haciendo lo mismo que aquellos sacerdotes: mirar arriba y buscar sentido.",
      "La astronomía explora el universo.",
      "La astrología sigue buscando significado en él.",
      "Las dos nacieron mirando el mismo cielo.",
    ],
  },
];
