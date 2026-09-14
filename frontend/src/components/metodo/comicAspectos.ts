import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// LOS ASPECTOS · el mini cómic que se lee ANTES de ver los aspectos propios.
//
// Va intercalado entre «Casas» y «Aspectos»: el botón «Aspectos →» de la
// página de las casas lo abre, y al terminar (o al pulsar «Aspectos») se entra
// a la página. Mismo patrón que el cómic de las casas, que se intercala entre
// «Puntos clave» y «Casas».
//
// POR QUÉ AQUÍ: la página de Aspectos enseña los aspectos de SU carta, planeta
// a planeta. Sin saber qué es una cuadratura o un trígono, esa lista no dice
// nada. Aquí se aprende el idioma; allí se lee la frase.
//
// SON SEIS Y SE QUEDAN EN SEIS: una por aspecto, en el orden en que se
// entienden (los dos que fusionan y enfrentan, el que tensa, los dos que
// fluyen y el que desajusta). El semisextil no tiene viñeta a propósito.
//
// FOTOS · /viñetas/astrologia/aspectos/ · WebP (el PNG da 404: la ruta lleva la
//   extensión escrita). Cada foto se llama como su aspecto: conjuncion,
//   oposicion, cuadratura, trigono, sextil, quincuncio.
//
// EL GRADO va en el antetítulo y el nombre en el título. Los glifos (☌ ☍ □ △
//   ⚹ ⚻) NO se escriben aquí: el visor pinta el texto con la fuente de la
//   página y esos caracteres se le escapan; en la página de Aspectos sí salen,
//   dibujados con <Glifo>, que pide las fuentes de símbolos a mano.
// ─────────────────────────────────────────────────────────────────────────

const F = (n: string) => `/viñetas/astrologia/aspectos/${n}.webp`;

export const VINETAS_ASPECTOS: Vineta[] = [
  {
    src: F("conjuncion"),
    eyebrow: "0°",
    titulo: "Conjunción",
    paragraphs: [
      "Dos energías se fusionan y funcionan como una sola: cuesta distinguir dónde termina una y empieza la otra.",
      "Puede ser una unión armónica o generar conflicto interno.",
      "La clave es aprender a escuchar las necesidades de cada planeta y hacer que dialoguen.",
      "El planeta más lento suele tener mayor peso.",
      "Stellium: tres o más planetas en conjunción, creando una energía especialmente concentrada.",
    ],
  },
  {
    src: F("oposicion"),
    eyebrow: "180°",
    titulo: "Oposición",
    paragraphs: [
      "Dos energías se enfrentan y podemos identificarnos con una mientras proyectamos la otra en los demás.",
      "Esto puede hacernos oscilar entre comportamientos muy diferentes.",
      "También podemos reprimir una energía y atraer personas o situaciones que la representen.",
      "La clave es dejar de tomar partido: «recuerda al otro planeta».",
      "Integrar ambos polos devuelve el equilibrio y aumenta la conciencia.",
    ],
  },
  {
    src: F("cuadratura"),
    eyebrow: "90°",
    titulo: "Cuadratura",
    paragraphs: [
      "Es el aspecto de mayor tensión y conflicto, pero también uno de los mayores motores de crecimiento.",
      "Las dos energías quieren actuar al mismo tiempo, pero chocan y se bloquean.",
      "Puede generar miedo, frustración, rabia, agotamiento y sensación de sabotaje interno.",
      "La tensión nos obliga a actuar, comprender y evolucionar.",
      "Cuando ambas energías empiezan a colaborar, el conflicto se transforma en creatividad y talento.",
    ],
  },
  {
    src: F("trigono"),
    eyebrow: "120°",
    titulo: "Trígono",
    paragraphs: [
      "Representa talentos y capacidades que fluyen con naturalidad.",
      "Las energías planetarias se entienden y se potencian mutuamente.",
      "Favorece la creatividad, el placer y la facilidad para hacer las cosas.",
      "Pero tanta comodidad puede llevar a la pasividad o a dar los talentos por sentados.",
      "El reto es despertar ese potencial y utilizarlo conscientemente.",
    ],
  },
  {
    src: F("sextil"),
    eyebrow: "60°",
    titulo: "Sextil",
    paragraphs: [
      "Es una energía de cooperación y facilidad, similar al trígono, pero necesita ser activada conscientemente.",
      "Los planetas se ayudan entre sí y facilitan el intercambio de información.",
      "Favorece la comunicación, el aprendizaje y la expresión.",
      "También señala oportunidades que aparecen cuando tomamos la iniciativa.",
      "La puerta está abierta, pero tenemos que decidir atravesarla.",
    ],
  },
  {
    src: F("quincuncio"),
    eyebrow: "150°",
    titulo: "Quincuncio",
    paragraphs: [
      "Genera una sensación de incomodidad, desajuste o falta de perspectiva.",
      "No suele ser tan intenso como una cuadratura: tomar conciencia ya ayuda a aliviarlo.",
      "Exige reajustes constantes entre dos energías que no terminan de encajar.",
      "Puede sentirse de forma cíclica, como si algo necesitara reorganizarse una y otra vez.",
      "La clave es adaptarse, reajustar y encontrar una nueva manera de funcionar.",
    ],
  },
];
