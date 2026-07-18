import type { Vineta } from "./ComicViewer";

// Cómic del Origen de Cábala. Se muestra la PRIMERA vez que el usuario entra en
// la disciplina (tras pagar), igual que el resto de disciplinas, y termina con
// el botón «Leído». También se podrá reutilizar en la galería de Ilustraciones.
//
// Imágenes: /viñetas/cabala/intro/cabalacomic1.png … cabalacomic7.png
// (mientras no existan, el ComicViewer pinta un placeholder «próximamente»).
export const CABALA_INTRO: Vineta[] = [
  {
    src: "/viñetas/cabala/intro/cabalacomic1.png",
    paragraphs: [
      "Antes de que existiera el tiempo, el espacio o la materia, solo existía el Ein Sof, el Infinito.",
      "No había separación entre creador y creación. Todo era una única realidad ilimitada, donde existían en perfecto equilibrio todos los potenciales del universo.",
    ],
  },
  {
    src: "/viñetas/cabala/intro/cabalacomic2.png",
    paragraphs: [
      "Dentro del Ein Sof ya estaban presentes dos principios fundamentales.",
      "El Or, la Luz Infinita, cuya naturaleza es dar, expandirse y compartir.",
      "Y el Kli, la Vasija, cuya naturaleza es recibir, contener y manifestar esa luz.",
      "Ambos no eran seres distintos, sino dos aspectos inseparables del mismo Infinito.",
    ],
  },
  {
    src: "/viñetas/cabala/intro/cabalacomic3.png",
    paragraphs: [
      "Pero mientras todo permanecía unido dentro del Ein Sof, no podía existir una creación independiente.",
      "Por ello tuvo lugar el Tzimtzum: una contracción simbólica de la Luz Infinita que creó un espacio donde la creación pudiera desarrollarse y experimentar la existencia por sí misma.",
    ],
  },
  {
    src: "/viñetas/cabala/intro/cabalacomic4.png",
    paragraphs: [
      "Después del Tzimtzum, un fino rayo de luz, conocido como el Kav, penetró ese espacio.",
      "La interacción entre la Luz (Or) y las vasijas (Kelim) comenzó entonces a dar forma a la creación.",
      "La primera manifestación fue Adam Kadmon, el plano primordial que contiene el diseño completo de todo cuanto existiría.",
    ],
  },
  {
    src: "/viñetas/cabala/intro/cabalacomic5.png",
    paragraphs: [
      "Desde Adam Kadmon, la creación descendió a través de cuatro niveles de manifestación.",
      "Atzilut, el mundo de la Emanación, donde la unidad con el Infinito es casi absoluta.",
      "Beriah, el mundo de la Creación, donde el Infinito se manifiesta en distintas formas.",
      "Yetzirah, el mundo de la Formación, donde aparecen las estructuras y las almas.",
      "Assiah, el mundo de la Acción, donde la creación se manifiesta como materia.",
      "En cada mundo, la Luz se expresa de forma diferente, haciéndose cada vez más velada hasta llegar al universo físico.",
    ],
  },
  {
    src: "/viñetas/cabala/intro/cabalacomic6.png",
    paragraphs: [
      "Toda la creación sigue siendo una emanación del Ein Sof.",
      "Así como un rayo de sol no está separado del Sol, cada alma, cada ser vivo y cada partícula del universo son expresiones de la misma Luz Infinita.",
      "El Árbol de la Vida, formado por las diez sefirot, describe el camino por el que esa energía divina desciende desde el Infinito hasta el mundo material.",
    ],
  },
  {
    src: "/viñetas/cabala/intro/cabalacomic7.png",
    paragraphs: [
      "El ser humano también es una emanación del Uno.",
      "Aunque vivimos en el mundo material y experimentamos la separación, nuestra esencia sigue siendo la misma Luz que emanó del Ein Sof.",
      "Por eso, el propósito del camino espiritual es recordar quiénes somos y elevar nuestra conciencia hasta reconocer nuevamente nuestra unidad con el Infinito.",
    ],
  },
];
