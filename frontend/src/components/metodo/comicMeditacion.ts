import type { Vineta } from "./ComicViewer";

// Cómic de Fisiología: «La meditación y el cerebro». Se intercala al salir de
// Niveles, justo ANTES de «La sonrisa interior»: primero se entiende qué le pasa
// al cerebro cuando respiras, te escuchas y te tratas bien; después se practica.
//
// Imágenes (pendientes): /viñetas/fisiologia/meditacion/1.png … 6.png (una por
// viñeta). Mientras no existan, el ComicViewer muestra su loader/fallback.
const PRE = "/viñetas/fisiologia/meditacion";

export const MEDITACION_CEREBRO: Vineta[] = [
  {
    src: `${PRE}/1.webp`,
    titulo: "La respiración: la puerta de entrada al cerebro",
    paragraphs: [
      "La mayoría de las personas cree que respira por la nariz, pero en realidad utiliza la boca gran parte del tiempo.",
      "Respirar por la nariz es importante porque el aire estimula receptores que envían información al cerebro.",
      "El ritmo respiratorio sincroniza la actividad de millones de neuronas en diferentes regiones cerebrales, como el hipotálamo, el hipocampo y la corteza prefrontal.",
      "Esa sincronización mejora la comunicación entre las distintas áreas del cerebro, favoreciendo la atención, la memoria y el control emocional.",
      "Cuando respiramos lenta y conscientemente por la nariz, también activamos el nervio vago y el sistema nervioso parasimpático, encargado de disminuir el estrés, reducir la frecuencia cardíaca y preparar al organismo para el descanso y la recuperación.",
    ],
  },
  {
    src: `${PRE}/2.webp`,
    titulo: "El cerebro escucha constantemente al cuerpo",
    paragraphs: [
      "Durante mucho tiempo se creyó que el cerebro dirigía al cuerpo, pero hoy sabemos que la comunicación funciona en ambas direcciones.",
      "Cada segundo, el corazón, los pulmones, el intestino y los músculos envían millones de señales al cerebro. Este proceso recibe el nombre de interocepción y permite al cerebro saber cómo se encuentra el organismo.",
      "La meditación aumenta la capacidad de percibir esas señales corporales, lo que ayuda a identificar antes el estrés, la ansiedad o el cansancio.",
      "Cuanto mejor interpreta el cerebro la información procedente del cuerpo, mejores decisiones toma y más fácil resulta regular las emociones.",
    ],
  },
  {
    src: `${PRE}/3.webp`,
    titulo: "Meditar cambia físicamente el cerebro",
    paragraphs: [
      "El cerebro tiene una enorme capacidad para cambiar a lo largo de toda la Vida. Esta propiedad se llama neuroplasticidad.",
      "La práctica continuada de la meditación fortalece las conexiones neuronales entre áreas relacionadas con la atención, la memoria, la regulación emocional y el autocontrol. Además, hace que el cerebro sea más eficiente, ya que necesita menos esfuerzo para mantener la concentración.",
      "Gracias a estos cambios, las personas que meditan con regularidad suelen distraerse menos, recuperar antes la atención cuando la pierden y responder de forma más reflexiva ante los problemas cotidianos.",
    ],
  },
  {
    src: `${PRE}/4.webp`,
    titulo: "Las emociones también se entrenan",
    paragraphs: [
      "La meditación no consiste en dejar la mente en blanco ni en eliminar las emociones negativas. Su objetivo es aprender a observar pensamientos y emociones sin reaccionar automáticamente.",
      "Cuando aparece el miedo, la tristeza o la ira, el cerebro aprende poco a poco a no responder de forma impulsiva. Con el tiempo mejora la comunicación entre las regiones cerebrales implicadas en las emociones y las encargadas del razonamiento y el autocontrol.",
      "Por eso las personas que practican meditación suelen gestionar mejor el estrés, recuperarse antes de las situaciones difíciles y mantener una mayor estabilidad emocional.",
    ],
  },
  {
    src: `${PRE}/5.webp`,
    titulo: "La amabilidad también modifica el cerebro",
    paragraphs: [
      "La forma en la que hablamos a los demás y, sobre todo, a nosotros mismos, cambia nuestro funcionamiento cerebral.",
      "La autocrítica constante mantiene activados los circuitos relacionados con el estrés y dificulta el aprendizaje.",
      "En cambio, la amabilidad, la compasión y el respeto generan un entorno biológico más favorable para que el cerebro establezca nuevas conexiones neuronales.",
      "Ser amable no significa ignorar los errores, sino corregirlos sin autojuicio ni castigo.",
      "Un cerebro que se siente seguro aprende mejor, recuerda más y tiene mayor capacidad para adaptarse a los cambios.",
    ],
  },
  {
    src: `${PRE}/6.webp`,
    titulo: "Meditar es entrenar el cerebro para vivir mejor",
    paragraphs: [
      "La meditación no hace desaparecer los problemas, pero cambia la forma en que el cerebro los afronta.",
      "Respirar por la nariz, prestar atención al cuerpo, observar los pensamientos sin juzgarlos y cultivar la amabilidad permiten que el cerebro funcione de manera más coordinada y flexible.",
      "Con la práctica disminuye el estrés, mejora la resiliencia y la concentración, aumenta la regulación emocional y se fortalece la capacidad de aprender.",
      "En definitiva, la meditación es un entrenamiento para el cerebro: cada sesión ayuda a construir nuevas conexiones neuronales que favorecen el bienestar físico, mental y emocional.",
    ],
  },
];
