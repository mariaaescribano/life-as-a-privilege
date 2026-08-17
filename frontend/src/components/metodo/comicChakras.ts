import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Cómic de LOS CHAKRAS. Cuatro viñetas. Sale al entrar en el mapa de los
// chakras (/metodo/ayurveda/dosha/:dosha/chakras), ANTES de ver a la persona
// con sus siete puntos.
//
// Es IMPARCIAL: los chakras son los mismos para Vata, Pitta y Kapha, así que
// va en el color de Ayurveda (ayurvedaTxt) y no en el del doṣha. No persiste:
// se cierra con la X o con «Los chakras →» y volverá a salir la próxima vez.
//
// El arco: qué son (el mapa) → los tres de abajo, el «yo» (raíz, sacro, plexo)
// → los tres de en medio y arriba, el «nosotros» (corazón, garganta, tercer
// ojo) → la corona y el sentido.
//
// El visor pinta el texto PLANO: no entiende **negritas** ni encabezados, y
// cada párrafo es un bloque con su aire. Por eso cada chakra va en un bloque,
// con su punto de color delante —el punto es lo único que lo distingue de un
// vistazo, y es el mismo color que su caja en el mapa—.
//
// Imágenes: /viñetas/hinduismo/chakras/comic/1.webp … 4.webp.
// ─────────────────────────────────────────────────────────────────────────

const P = "/viñetas/hinduismo/chakras/comic";

export const COMIC_CHAKRAS: Vineta[] = [
  {
    // Viñeta 1: el cuerpo de perfil y los siete puntos alineados a lo largo de
    // la columna, como un mapa antiguo de la India.
    src: `${P}/1.webp`,
    eyebrow: "",
    titulo: "",
    paragraphs: [
      "Desde hace miles de años, distintas tradiciones de la India han descrito el cuerpo como algo más que materia.",
      "Los chakras son representados como centros de energía y consciencia situados a lo largo de la columna.",
      "Pero también pueden entenderse como un mapa simbólico de nuestra experiencia humana: desde la necesidad de sobrevivir hasta la búsqueda de sentido.",
    ],
  },
  {
    // Viñeta 2: los tres de abajo. El «yo»: sobrevivir, sentir, querer.
    src: `${P}/2.webp`,
    eyebrow: "",
    titulo: "",
    paragraphs: [
      "🔴 Raíz — Mūlādhāra. Necesito sentirme seguro. ¿Tengo un lugar en el mundo? ¿Puedo confiar en la vida?",
      "🟠 Sacro — Svādhiṣṭhāna. Después aparece el deseo de sentir. ¿Me permito disfrutar, crear, desear y experimentar mis emociones?",
      "🟡 Plexo solar — Maṇipūra. Y entonces nace la voluntad. ¿Quién soy? ¿Qué quiero? ¿Soy capaz de tomar las riendas de mi vida?",
    ],
  },
  {
    // Viñeta 3: aquí el recorrido cambia de dirección. Ya no es solo «yo».
    src: `${P}/3.webp`,
    eyebrow: "",
    titulo: "",
    paragraphs: [
      "🟢 Corazón — Anāhata. El recorrido cambia: ya no se trata solamente de yo. Aparece la capacidad de amar, conectar, perdonar y abrirnos al otro.",
      "🔵 Garganta — Viśuddha. Pero conectar también implica expresarnos. ¿Tengo el valor de decir quién soy y aquello que necesito?",
      "🟣 Tercer ojo — Ājñā. Y cuando aprendemos a observarnos, comenzamos a ver más allá de nuestras reacciones. ¿Puedo comprender lo que ocurre dentro de mí sin dejarme arrastrar por ello?",
    ],
  },
  {
    // Viñeta 4: la corona y el mapa entero de un vistazo.
    src: `${P}/4.webp`,
    eyebrow: "",
    titulo: "",
    paragraphs: [
      "⚪ Corona — Sahasrāra. El último chakra representa la consciencia, la conexión y la búsqueda de algo que trasciende al individuo.",
      "No se trata de llegar a un lugar.",
      "Se trata de comprender quién eres, de dónde vienes, qué te mueve y qué sentido quieres darle a tu existencia.",
      "Los chakras pueden entenderse así como un mapa: del cuerpo a las emociones, a la voluntad, al amor, a la expresión, a la consciencia, al sentido.",
      "Un recorrido hacia dentro para aprender a vivir hacia fuera.",
    ],
  },
];
