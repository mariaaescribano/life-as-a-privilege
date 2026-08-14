import type { Vineta } from "./ComicViewer";

// Cómic de NUTRICIÓN: «Los grandes ciclos de la naturaleza». Nació en Fisiología
// (como zoom-OUT al terminar de construir el organismo), pero su sitio es el
// paso «¿De dónde vienen los nutrientes?» de Nutrición: es la PRIMERA lectura de
// ese paso, la que explica que los átomos que comes son prestados y vuelven a
// los ciclos. Por eso el archivo, las fotos y la entrada de galería son de
// Nutrición.
//
// Imágenes: /viñetas/nutricion/biologia/ciclos/agua.png, carbono.png, oxigeno.png,
// nitrogeno.png, fosforo.png (una por viñeta). Mientras no existan, el
// ComicViewer muestra su loader/fallback.
export const NUTRICION_CICLOS: Vineta[] = [
  {
    src: "/viñetas/nutricion/biologia/ciclos/agua.webp",
    titulo: "Ciclo del agua",
    paragraphs: [
      "El ciclo del agua es el proceso continuo mediante el cual el agua circula entre la superficie terrestre, la atmósfera y los océanos.",
      "La energía del Sol provoca la evaporación del agua, que asciende y forma nubes por condensación.",
      "Posteriormente, el agua regresa a la superficie en forma de lluvia o nieve, infiltrándose en el suelo, alimentando acuíferos y ríos, hasta volver finalmente al mar, donde el ciclo comienza de nuevo.",
      "Este proceso regula el clima y garantiza la disponibilidad de agua para todos los seres vivos.",
    ],
  },
  {
    src: "/viñetas/nutricion/biologia/ciclos/carbono.webp",
    titulo: "Ciclo del carbono",
    paragraphs: [
      "El ciclo del carbono describe el movimiento continuo del carbono entre la atmósfera, los seres vivos, los océanos y la corteza terrestre.",
      "Las plantas capturan dióxido de carbono mediante la fotosíntesis y lo incorporan a la materia orgánica, que posteriormente pasa a animales y microorganismos a través de la alimentación.",
      "La respiración, la descomposición y la combustión devuelven el carbono a la atmósfera, mientras que una parte queda almacenada durante millones de años en rocas y combustibles fósiles.",
    ],
  },
  {
    src: "/viñetas/nutricion/biologia/ciclos/oxigeno.webp",
    titulo: "Ciclo del oxígeno",
    paragraphs: [
      "El ciclo del oxígeno consiste en el intercambio continuo de este elemento entre la atmósfera, los seres vivos y los ecosistemas.",
      "Durante la fotosíntesis, las plantas, algas y cianobacterias liberan oxígeno al ambiente.",
      "Los organismos aerobios utilizan este oxígeno en la respiración celular para obtener energía, produciendo dióxido de carbono y agua, que vuelven a ser utilizados por los organismos fotosintéticos, manteniendo el equilibrio atmosférico.",
    ],
  },
  {
    src: "/viñetas/nutricion/biologia/ciclos/nitrogeno.webp",
    titulo: "Ciclo del nitrógeno",
    paragraphs: [
    "El ciclo del nitrógeno permite transformar el nitrógeno atmosférico en formas que pueden ser incorporadas y utilizadas por los seres vivos.",
    "Las bacterias fijadoras convierten el nitrógeno del aire en compuestos que pueden ser aprovechados por las plantas, que posteriormente son consumidas por los animales.",
    "Cuando los animales comen plantas —o comen otros animales que las han consumido— obtienen ese nitrógeno.",
    "Ese nitrógeno acaba formando parte de aminoácidos, que son componentes de las proteínas. Y las proteínas forman, entre otras cosas, estructuras musculares y numerosas enzimas.",
    "Tras la muerte o la eliminación de desechos, otros microorganismos reciclan el nitrógeno.", "Finalmente, parte de él puede volver a la atmósfera en forma de N₂ mediante la desnitrificación, cerrando el ciclo.",
    ],
  },
  {
    src: "/viñetas/nutricion/biologia/ciclos/fosforo.webp",
    titulo: "Ciclo del fósforo",
    paragraphs: [
      "El ciclo del fósforo describe el movimiento de este elemento entre las rocas, el suelo, el agua y los organismos vivos.",
      "La erosión libera fosfatos de las rocas, que son absorbidos por las plantas e incorporados posteriormente a los animales mediante la alimentación.",
      "Tras la descomposición de los organismos, el fósforo regresa al suelo o a los sedimentos acuáticos, donde puede permanecer durante millones de años antes de volver a incorporarse al ciclo mediante procesos geológicos.",
    ],
  },
];
