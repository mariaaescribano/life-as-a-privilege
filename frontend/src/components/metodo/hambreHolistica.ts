import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// «El hambre: una mirada holística». Los 4 bloques del apartado del recorrido
// de Nutrición: cada uno con su foto (recorrido/nutricion/hambre/N.png), su
// título y sus párrafos. Se usa DOS veces con los mismos datos:
//   · En la página /metodo/nutricion/hambre → 4 boxes (foto izq + texto der).
//   · En «Ilustraciones» de Nutrición → un cómic más (ComicViewer).
// Las negritas van con **…** (las pinta la página; en el cómic se limpian).
// ─────────────────────────────────────────────────────────────────────────

/** Quita las marcas de negrita de unas viñetas. El visor de cómic no interpreta
 *  `**…**`, así que sin esto los asteriscos se leerían crudos. Vive aquí, junto a
 *  la convención que documenta la cabecera, para no tener una copia por página. */
export const sinNegrita = (vinetas: Vineta[]): Vineta[] =>
  vinetas.map((v) => ({ ...v, paragraphs: v.paragraphs.map((p) => p.replace(/\*\*/g, "")) }));

const BASE = "/recorrido/nutricion/hambre";

export const HAMBRE_HOLISTICA: Vineta[] = [
  {
    src: `${BASE}/hambre1.webp`,
    titulo: "La microbiota también tiene hambre",
    paragraphs: [
      "Cuando sentimos hambre, no siempre comemos solo lo que nuestro cuerpo necesita. Nuestra microbiota influye en nuestros antojos a través del eje intestino-cerebro, favoreciendo los alimentos con los que mejor se alimentan las bacterias que predominan en nuestro intestino.",
      "Por eso, si nuestra dieta está basada en azúcar y ultraprocesados, será más fácil que nos apetezcan esos alimentos. En cambio, cuando incorporamos verduras, frutas y alimentos frescos de forma constante, la microbiota cambia y también cambian nuestros deseos.",
      "Al principio cuesta modificar la alimentación porque no solo cambias un hábito: también estás transformando el ecosistema que vive dentro de ti.",
    ],
  },
  {
    src: `${BASE}/hambre2.webp`,
    titulo: "El hambre también puede ser emocional",
    paragraphs: [
      "Muchas veces no tenemos hambre física, sino un vacío emocional que intentamos llenar con comida. Desde una visión energética, este vacío se relaciona con el tercer chakra, el plexo solar, asociado a la autoestima, la seguridad y el poder personal.",
      "La psicología también explica que el estrés, la ansiedad, la tristeza o la soledad pueden llevarnos a comer buscando un alivio inmediato. Sin embargo, ese alivio suele ser temporal y el vacío permanece.",
      "Antes de comer, quizá la pregunta sea: **¿tengo hambre de comida o de algo que estoy necesitando sentir?**",
    ],
  },
  {
    src: `${BASE}/hambre3.webp`,
    titulo: "El cuerpo sabe cuándo parar",
    paragraphs: [
      "Cada vez que comemos, nuestro cuerpo regula el hambre de forma natural. Las células de grasa liberan leptina, una hormona que informa al hipotálamo de cuánta energía tenemos almacenada y cuándo ya hemos comido suficiente.",
      "Pero si durante mucho tiempo ignoramos nuestras señales de saciedad y comemos en exceso, el cerebro puede dejar de responder igual de bien a esa señal. Es lo que se conoce como **resistencia a la leptina**, y hace más difícil sentir que ya estamos saciados.",
      "Aprender a escuchar el hambre real también es una forma de recuperar la inteligencia natural de nuestro cuerpo.",
    ],
  },
  {
    src: `${BASE}/hambre4.webp`,
    titulo: "Elegimos la comida según cómo nos sentimos",
    paragraphs: [
      "Comer no es un acto completamente racional. Nuestro estado emocional influye en las decisiones que tomamos, y cada alimento genera una respuesta distinta en nuestro organismo.",
      "Los alimentos frescos favorecen una microbiota saludable, estabilizan la glucosa y ayudan a mantener un mejor equilibrio físico y emocional. En cambio, una dieta rica en ultraprocesados favorece la inflamación, los picos de azúcar y una mayor sensación de fatiga.",
      "En definitiva, los alimentos no solo aportan calorías: también envían información a nuestro cuerpo. Lo que elegimos comer acaba influyendo en cómo pensamos, cómo sentimos y en la energía con la que vivimos.",
    ],
  },
];

// Frase de cierre, que va directamente sobre el fondo turquesa (sin box).
export const HAMBRE_CIERRE =
  "Lo has visto tú mismo; te reconstruyes con lo que comes, ¿cómo eliges hoy reconstruirte?";
