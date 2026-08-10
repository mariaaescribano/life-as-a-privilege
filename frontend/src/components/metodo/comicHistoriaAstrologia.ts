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
      "No se limitaron a mirar, sino que escribieron noche tras noche, en tablillas de barro, durante más de seiscientos años seguidos todo lo que observaban.",
      "Es la serie de registros más larga que ha hecho la humanidad hasta la época moderna.",
      "Gracias a todos los datos, pudieron empezar a predecir.",
    ],
  },
  // 2 — Los astrólogos del rey
  {
    src: F("astrologosdelrey"),
    titulo: "",
    paragraphs: [
      "La Astrología se convirtió en una herramienta para los reyes.",
      "Antes de tomar decisiones importantes, consultaban a los astrólogos de su corte.",
      "El cielo podía advertir guerras, hambrunas o la muerte del rey.",
      "No eran adivinos: eran funcionarios del Estado que mandaban sus informes por escrito a palacio.",
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
      "Alejandro conquistó Babilonia pero no arrasó con lo que encontró, sino que lo incorporó en su legado.",
      "Aquellos archivos milenarios empezaron a traducirse al griego.",
      "En la ciudad que fundó en Egipto, Alejandría, se juntaron dos mundos que habían caminado separados: el cálculo babilonio y la filosofía griega.",
      "Nació la Astrología helenística, y desde entonces, la Astrología también es una herramienta para comprender a las personas.",
      "En el siglo II, Ptolomeo recopiló la información hasta el momento en el Tetrabiblos: el diccionario de la Astrología durante más de 1.400 años.",
    ],
  },
  // 5 — Grecia: el ser humano y las casas
  {
    src: F("grecia"),
    titulo: "",
    paragraphs: [
      "¿Por qué ocurrió justo en Grecia? Porque los griegos llevaban siglos buscando el sentido de la existencia.",
      "Los babilonios le preguntaban al cielo qué va a pasar.",
      "Los griegos preguntaban qué es el ser humano, de qué está hecho y por qué actúa como actúa. En el templo de Delfos escribieron su propósito: «Conócete a ti mismo».",
      "Desde ahí, el cielo dejó de ser un calendario para ser el mapa de la persona en el cosmos.",
      "Añadieron una pieza que en Babilonia no existía: las doce casas.",
      "Los signos cuentan CÓMO eres; las casas, DÓNDE — el trabajo, el dinero, la familia, el amor, la salud, los finales...",
      "Para calcularlas no basta el día: hacen falta la hora y el lugar exactos.",
    ],
  },
  // 6 — Roma: los dioses prestados y el miedo
  {
    src: F("roma"),
    titulo: "",
    paragraphs: [
      "Roma se enamoró de Grecia. Imitaron su filosofía, su arte y sus dioses.",
      "Ares pasó a llamarse Marte. Afrodita, Venus. Zeus, Júpiter. Hermes, Mercurio. Cronos, Saturno. Son exactamente los nombres que lees hoy en tu carta.",
      "Los emperadores confiaban en la Astrología. Pero también la temían.",
      "Buscar en las estrellas cuándo moriría un emperador podía considerarse una conspiración.",
      "Por eso, se expulsó a los astrólogos de Roma más de una vez. El mismo hombre que tenía astrólogos en su corte era el que prohibía consultarlos.",
      "La Astrología solo era para la nobleza.",
    ],
  },
  // 7 — Solo para unos pocos (+ pausa: el saber encerrado en palacio)
  {
    src: F("nobleza"),
    eyebrow: "",
    titulo: "",
    paragraphs: [
      "Para levantar una carta natal hacen falta cuatro cosas: la hora exacta del nacimiento, unas tablas con las posiciones de los planetas, saber calcular y saber leer.",
      "Nada de eso estaba al alcance de la inmensa mayoría. De la gente corriente no se anotaba la hora de nacer; a veces ni siquiera el día.",
      "Así que durante siglos la Astrología fue, en la práctica, un servicio de palacio.",
    ],
  },
  // 8 — Las cortes de Europa
  {
    src: F("cortes"),
    eyebrow: "Europa · Siglos XIII-XVI",
    titulo: "El astrólogo de la corte",
    paragraphs: [
      "En la Europa medieval el astrólogo era un cargo de la corte, como el médico o el tesorero. Se le consultaba para elegir el día de una coronación, de una boda o de una batalla.",
      "Ningún rey hizo tanto por este saber como Alfonso X de Castilla. Montó en Toledo un taller donde trabajaban juntos sabios cristianos, musulmanes y judíos traduciendo todo el conocimiento que llegaba del mundo árabe.",
      "De allí salieron las Tablas alfonsíes, usadas en toda Europa para calcular la posición de los planetas durante casi trescientos años. Y tomó una decisión enorme: mandó traducir al castellano, no al latín. La lengua de la calle sirviendo para la ciencia.",
      "No fue solo Castilla: Carlos V de Francia tuvo astrólogos a su servicio y una de las grandes bibliotecas de su tiempo, y en la corte de Ricardo II de Inglaterra se copiaron e ilustraron manuscritos astrológicos.",
      "Los Reyes Católicos consultaron astrólogos, y Felipe II reunió en El Escorial tratados de astrología y tuvo matemáticos a su servicio.",
    ],
  },
  // 9 — Las universidades
  {
    src: F("universidades"),
    eyebrow: "Bolonia · 1088",
    titulo: "",
    paragraphs: [
      "La Astrología se enseñaba en la universidad. No a escondidas. Con cátedra, temario y exámenes.",
      "En 1088 nace Bolonia, la primera universidad europea, y la astronomía entra como lo que se consideraba: una disciplina matemática.",
      "La Astrología usaba esos mismos cálculos para interpretar qué influencia tenían sobre las personas y sobre lo que iba a ocurrir.",
      "Por eso no eran dos oficios enfrentados: el mismo estudioso calculaba por la mañana la posición de los planetas y levantaba por la tarde un horóscopo, con las mismas tablas y la misma matemática.",
      "Gran parte de sus alumnos eran estudiantes de medicina, porque tratar a un enfermo sin mirar el cielo se consideraba negligencia.",
    ],
  },
  // 11 — Bagdad, Córdoba, Toledo
  {
    src: F("alandalus"),
    titulo: "Bagdad, Córdoba, Toledo",
    paragraphs: [
      "¿De dónde salían esas tablas y esos libros? De un puente que Europa estuvo a punto de perder.",
      "Durante la Edad de Oro del Islam, Bagdad se convirtió en el centro del conocimiento del mundo: se tradujo todo el saber griego, se conservó y se mejoró.",
      "En al-Ándalus, Córdoba llegó a tener una biblioteca de cientos de miles de volúmenes, y en Toledo el astrónomo Azarquiel elaboró unas tablas que se usaron en toda Europa.",
      "Cuando Toledo pasó a manos cristianas, aquellos libros empezaron a traducirse al latín. Sin ese puente no habría vuelto ni Ptolomeo, ni Aristóteles...",
    ],
  },
  // 12 — Los que la usaban fueron los que la separaron
  {
    src: F("revolucioncientifica"),
    eyebrow: "Siglos XVI-XVII",
    titulo: "La Revolución Científica",
    paragraphs: [
      "La Astrología no se apagó en el Renacimiento: vivió su mayor esplendor, y la frontera entre ciencia y astrología todavía no existía.",
      "Kepler, el hombre que descubrió que los planetas giran en elipses, se ganaba la vida haciendo cartas astrales. Para él, la Astrología era la armonía del cosmos en el ser humano.",
      "Galileo, tenía que enseñar Astrología a los estudiantes de medicina —era materia obligatoria— y levantó cartas natales por encargo, cobrando por ellas, incluidas las de sus hijas.",
      "Pero fueron precisamente ellos quienes acabaron dejándola fuera. No por decreto: por método.",
      "La Astronomía empezó a exigir observar midiendo y analizando, requisito que la Astrología no podía cumplir.",
      "Pero la Astrología siguió en la cultura popular, como tradición y como práctica adivinatoria.",
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
      "Carl Gustav Jung consideraba la Astrología un mapa del inconsciente más que un método para predecir el futuro.",
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
      "La Astronomía explora el universo.",
      "La Astrología encuentra significado en él.",
      "Las dos nacieron mirando el mismo cielo.",
    ],
  },
];
