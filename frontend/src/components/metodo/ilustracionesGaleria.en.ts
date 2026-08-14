import { traducir, useIdioma, type ClaveTexto, type Idioma } from "../../i18n";
import type { IlustracionEntry } from "./ilustracionesGaleria";

// ─────────────────────────────────────────────────────────────────────────
// LOS TÍTULOS DE LA GALERÍA DE ILUSTRACIONES, EN INGLÉS.
//
// Solo el rótulo de la tarjeta: las viñetas de dentro ya se traducen por su
// cuenta (cada cómic, con su clave en `i18n/comics/comics.en.ts`).
//
// Por qué un mapa por `id` y no un campo más en cada entrada: `ILUSTRACIONES` se
// calcula AL IMPORTAR el módulo, así que un texto ya resuelto se quedaría
// congelado en el idioma con el que arrancó la página. Y por qué no tocar el
// campo `disciplina`: además de pintarse, es la CLAVE con la que cada
// presentación (/d/…) filtra sus series (`ilustracionesLabel`). Si se tradujera
// en el propio array, las presentaciones se quedarían sin ilustraciones en
// inglés. Aquí se traduce solo al pintar.
//
// Un `id` que no esté en el mapa se queda con su título español: media galería
// traducida es mejor que una tarjeta en blanco.
// ─────────────────────────────────────────────────────────────────────────

export const TITULO_ILUSTRACION_EN: Record<string, string> = {
  // ── El Origen ──
  "origen-ciencia": "The Origin · according to Science",
  "origen-espiritualidad": "The Origin · according to Spirituality",
  "origen-hinduismo": "The Origin · according to Hinduism",
  "origen-taoismo": "The Origin · according to Taoism",
  "origen-cabala": "The Origin · according to Kabbalah",

  // ── Fisiología ──
  "fisio-estrella": "The Star",
  "fisio-celula": "The secret Life of the cell",
  "fisio-cigoto": "From one cell to an organ",

  // ── Astrología ──
  "astro-historia": "The history of Astrology",
  "astro-signos": "The Signs",
  "astro-casas": "The Houses",
  "astro-planetas": "The Planets",

  // ── Ayurveda / Hinduismo ──
  "hindu-elementos": "The Elements",
  // Doṣha se queda con su transliteración, igual que en el resto de la casa.
  "hindu-doshas": "The Doṣhas",

  // ── Psicología ──
  "psicologia-intro": "Where suffering comes from",
  "psicologia-etapas": "How you were built",
  // Los cuatro cómics del recorrido (no salen en la galería, pero sí en /d/psicologia).
  "psico-creencias": "How beliefs are born",
  "psico-ace": "ACEs",
  "psico-linea": "The Life Line",
  "psico-sintesis": "The problem is never the problem",

  // ── Nutrición ──
  "nutricion-intro": "You are what you absorb",
  "nutricion-calorias": "Calories don't exist",
  "nutricion-carbohidratos": "Carbohydrates",
  "nutricion-vitaminas": "Vitamins",
  "nutricion-minerales": "Minerals",
  "nutricion-agua": "Water",
  "nutricion-microbiota": "The microbiota",
  "nutricion-hambre": "Hunger: a holistic look",
  "nutricion-integral": "Whole foods",
  "nutricion-origen-ciclos": "The great cycles of nature",
  "nutricion-origen-tierra": "The soil and the root",
  "nutricion-origen-planta": "Inside a plant",
  "nutricion-origen-hoja": "Inside a leaf",
  "nutricion-origen-fruta": "Fruit, vegetables and their colors",
  "nutricion-origen-animal": "When the nutrient passes through an animal",
  // Los doce grupos de «Los nutrientes». Su título en la galería sale del
  // `label` del grupo (NUTRIENTES), que se lee al importar el módulo y por eso
  // llega siempre en español: se traduce aquí, por el `id` de la entrada.
  "nutriente-carbohidratos": "Carbohydrates",
  "nutriente-grasas": "Fats",
  "nutriente-proteinas": "Proteins",
  "nutriente-vitaminas": "Vitamins",
  "nutriente-minerales": "Minerals",
  "nutriente-fibra": "Fiber",
  "nutriente-colesterol": "Cholesterol",
  "nutriente-etanol": "Ethanol",
  "nutriente-agua": "Water",
  "nutriente-fitoquimicos": "Phytochemicals",
  "nutriente-edulcorantes": "Sweeteners",
  "nutriente-drogas": "Drugs",

  // ── Cábala ──
  "cabala-sefirot": "The ten dimensions of the soul",
  "cabala-senderos": "The 22 paths",

  // ── Medicina China ──
  "tcm-yinyang": "Yin and Yang",
  "tcm-elementos": "The Five Elements",
  "tcm-alma": "The Human Soul",
};

/** La etiqueta de disciplina de la tarjeta → su clave de texto. La etiqueta
 *  española es además la clave de filtrado de las presentaciones, así que no se
 *  toca en el array: se traduce aquí, solo para pintarla. */
const CLAVE_DISCIPLINA: Record<string, ClaveTexto> = {
  "Astrología": "disciplina.astrologia",
  "Psicología": "disciplina.psicologia",
  "Ayurveda": "disciplina.ayurveda",
  "Medicina China": "disciplina.medicinaChina",
  "Fisiología": "disciplina.fisiologia",
  "Nutrición": "disciplina.nutricion",
  "Cultura": "disciplina.cultura",
  "Cábala": "disciplina.cabala",
};

/** Una entrada con su título y su disciplina en el idioma que se le pase. Sin
 *  hook, para poder usarla dentro de un `.map` (la presentación de Astrología
 *  pinta sus cómics con otra tarjeta). */
export function ilustracionTraducida(entry: IlustracionEntry, idioma: Idioma): IlustracionEntry {
  if (idioma === "es") return entry;
  const clave = CLAVE_DISCIPLINA[entry.disciplina];
  return {
    ...entry,
    titulo: TITULO_ILUSTRACION_EN[entry.id] ?? entry.titulo,
    disciplina: clave ? traducir(clave, undefined, idioma) : entry.disciplina,
  };
}

/**
 * Una entrada de la galería en el idioma activo.
 *
 * OJO: es un hook, hay que llamarlo AL PINTAR (lo hace `IlustracionCard`, que es
 * por donde pasan casi todas: la galería pública y siete presentaciones).
 */
export function useIlustracionTraducida(entry: IlustracionEntry): IlustracionEntry {
  const { idioma } = useIdioma();
  return ilustracionTraducida(entry, idioma);
}
