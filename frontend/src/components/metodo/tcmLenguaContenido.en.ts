import type {
  DimensionLengua, LenguaDim, PatronInfo, PatronLengua, ZonaLengua,
} from "./tcmLenguaContenido";

/**
 * «Tu lengua» (el diagnóstico de la lengua), en INGLÉS.
 *
 * Aquí va SOLO el texto. Las `key` (de dimensión y de opción), las fotos, el
 * orden, qué variante es la sana y a qué patrones apunta cada una viven
 * únicamente en el fichero español: las `key` son lo que se guarda en
 * `metodo_tcm.data.observarte`, y duplicar los `patrones` aquí sería la forma
 * más rápida de que la misma lengua diera una lectura distinta según el idioma.
 *
 * Lo que falte se lee en español, capa a capa y patrón a patrón (ver
 * `useLenguaDimensiones` / `usePatronesLengua`). Es la misma regla que ya usan
 * los cinco elementos y los cómics.
 *
 * Al traducir:
 *  · Los términos de la MTC van con mayúscula y no se traducen: Qi, Yin, Yang.
 *    «la Sangre», «la Esencia», «los Fluidos Corporales» y «el Calor / Frío /
 *    Humedad / Flema / Viento Interno» son términos técnicos, no la sangre del
 *    análisis ni el frío de la calle: Blood, Essence, Body Fluids, Heat, Cold,
 *    Dampness, Phlegm, Internal Wind.
 *  · «saburra» es *coating* (la capa de la lengua), nunca *fur*.
 *  · «deficiencia de Yin» → *Yin deficiency*; «Calor por Vacío» → *Empty Heat*;
 *    «Calor Pleno» → *Full Heat*; «estasis de Sangre» → *Blood stasis*.
 *  · El nombre de cada variante es una etiqueta corta de tarjeta: adjetivo
 *    solo, sin artículo («Pale», «Swollen», «Cracked»).
 */

/** Lo único que se traduce de una capa: su rótulo y su línea de qué refleja. */
export type DimensionTexto = Pick<DimensionLengua, "titulo" | "subtitulo">;

/** Lo único que se traduce de una variante: su nombre y su lectura. */
export interface OpcionTexto { nombre: string; lectura: string; }

export const LENGUA_DIM_EN: Record<LenguaDim, DimensionTexto> = {
  color: {
    titulo: "The color of the body",
    subtitulo: "This is the most important layer. It reflects the Blood, the Yin–Yang balance and the patterns of Heat and Cold.",
  },
  forma: {
    titulo: "The shape",
    subtitulo: "It speaks of Fullness (Excess) or Deficiency (Emptiness). What it means always depends on the color.",
  },
  movimiento: {
    titulo: "The movement",
    subtitulo: "How the tongue moves as you stick it out. It points toward deficiencies or toward Internal Wind.",
  },
  puntos: {
    titulo: "Spots and veins",
    subtitulo: "The fine details: altered papillae on the surface, and the veins underneath the tongue.",
  },
  saburra: {
    titulo: "The coating",
    subtitulo: "The layer covering the tongue. It reflects the Qi of the stomach and the presence of pathogenic factors.",
  },
  humedad: {
    titulo: "The moisture",
    subtitulo: "It reflects the Body Fluids and the Yin–Yang balance. Healthy is a light, even moisture.",
  },
};

/** El texto de cada variante, por dimensión y por la `key` de la opción. */
export const LENGUA_OPCIONES_EN: Record<LenguaDim, Record<string, OpcionTexto>> = {
  // ── EL COLOR DEL CUERPO ───────────────────────────────────────────────────
  color: {
    normal: {
      nombre: "Pink",
      lectura: "An even pale red (pink): this is the physiological color. The Blood nourishes well and Yin and Yang are in balance.",
    },
    palida: {
      nombre: "Pale",
      lectura: "Deficiency of Blood (not enough of it arriving to nourish the tongue) or of Yang (no warmth to move it along). If it is also very wet, it points to Yang deficiency of the kidney.",
    },
    roja: {
      nombre: "Red",
      lectura: "Heat. If it still has a coating, it is Full Heat (from excess); with no coating, it is Empty Heat, which comes from a Yin deficiency.",
    },
    "roja-oscura": {
      nombre: "Dark red",
      lectura: "A more intense Heat: a serious excess of Heat, or a Heat from Yin deficiency that is already well advanced. Fire is a drier, more intense degree of Heat.",
    },
    purpura: {
      nombre: "Purple",
      lectura: "Blood stasis: circulation is blocked. It is usually a chronic process. The shade can be very subtle; the stronger it is, the greater the stagnation.",
    },
    "azul-purpura": {
      nombre: "Bluish purple",
      lectura: "Stagnation caused by Cold: the Blood and the Qi slow down for lack of warmth.",
    },
  },

  // ── LA FORMA ──────────────────────────────────────────────────────────────
  forma: {
    normal: {
      nombre: "Well proportioned",
      lectura: "Neither thin nor swollen, with no cracks or marks: good substance and Qi that circulates well.",
    },
    fina: {
      nombre: "Thin",
      lectura: "A lack of substance: Blood deficiency (if it is pale) or Yin deficiency (if it is peeled). The thinner it is, the more serious.",
    },
    hinchada: {
      nombre: "Swollen",
      lectura: "A build-up of Dampness or Phlegm. Even though it may start from a Qi deficiency of the spleen, the swelling itself is a pattern of excess.",
    },
    marcas: {
      nombre: "With teeth marks",
      lectura: "Qi deficiency of the spleen. It usually comes with a pale tongue and a thin white coating.",
    },
    agrietada: {
      nombre: "Cracked",
      lectura: "In general, Yin deficiency. Where the crack is tells you more: a central crack running to the tip is associated with the heart (a tendency toward stress); cracks on the sides, with the lungs.",
    },
  },

  // ── EL MOVIMIENTO ─────────────────────────────────────────────────────────
  movimiento: {
    normal: {
      nombre: "Steady",
      lectura: "The tongue comes out firm and centered, with no trembling and no deviation.",
    },
    temblorosa: {
      nombre: "Trembling",
      lectura: "A quick tremor of small amplitude: spleen deficiency and, in older people, possible Internal Wind.",
    },
    desviada: {
      nombre: "Deviated",
      lectura: "It falls away from the midline: this always indicates Internal Wind. Common after a stroke; in a healthy person, a warning sign worth having looked at.",
    },
    rigida: {
      nombre: "Stiff",
      lectura: "Hard to move: associated with Internal Wind; it can be seen in stroke or other significant neurological conditions.",
    },
  },

  // ── PUNTOS Y VENAS ────────────────────────────────────────────────────────
  puntos: {
    normal: {
      nombre: "No spots or marked veins",
      lectura: "An even surface and sublingual veins that are barely visible, neither dilated nor dark: this is normal.",
    },
    "puntos-rojos": {
      nombre: "Red spots",
      lectura: "Reddened papillae standing out from the surface: these always indicate Heat. Where they are points to the organ (in the chest area, for instance, toxic Heat in the lung or the breast).",
    },
    vesiculas: {
      nombre: "White vesicles",
      lectura: "Papillae standing out with a white color: these usually indicate Dampness.",
    },
    venas: {
      nombre: "Purple sublingual veins",
      lectura: "Dark or dilated veins under the tongue: Blood stasis in an early stage. It can show up before the rest of the tongue turns purple.",
    },
  },

  // ── LA SABURRA ────────────────────────────────────────────────────────────
  saburra: {
    normal: {
      nombre: "Thin and white",
      lectura: "Thin, white, rooted and letting the body of the tongue show through: this is normal. The Qi of the stomach is strong.",
    },
    "blanca-gruesa": {
      nombre: "Thick and white",
      lectura: "The presence of Cold (or an external process). The thickness tells you a pathogenic factor has accumulated.",
    },
    amarilla: {
      nombre: "Yellow",
      lectura: "Heat. If it is thick and dry, Heat from excess; if it is thin or almost absent, Heat from Yin deficiency.",
    },
    grasosa: {
      nombre: "Greasy or sticky",
      lectura: "Dampness or Phlegm. If it is also slimy or slippery, it points to Damp-Heat.",
    },
    seca: {
      nombre: "Dry",
      lectura: "Heat that has damaged the Body Fluids, or a serious state of dryness.",
    },
    "gris-negra": {
      nombre: "Gray or black",
      lectura: "A deep or severe pattern. Dry, it is associated with extreme Heat; wet or sticky, with internal Cold.",
    },
    pelada: {
      nombre: "Peeled or absent",
      lectura: "A tongue with no coating (or one that has lost its root) indicates deficiency of Qi and/or Yin of the stomach.",
    },
  },

  // ── LA HUMEDAD ────────────────────────────────────────────────────────────
  humedad: {
    normal: {
      nombre: "Lightly moist",
      lectura: "A light, even moisture, neither dry nor wet: the Body Fluids are sufficient and well distributed.",
    },
    seca: {
      nombre: "Dry",
      lectura: "Heat or Yin deficiency: the Fluids have gone down and no longer keep the normal moisture.",
    },
    "muy-humeda": {
      nombre: "Very wet",
      lectura: "Cold or Yang deficiency: the body isn't transforming or moving the fluids well and they build up.",
    },
    lacada: {
      nombre: "Glossy or «lacquered»",
      lectura: "Smooth and shiny as if varnished: a collapse of Yin, a deep exhaustion of the fluids. A sign of real importance.",
    },
  },
};

/** Las cinco zonas del mapa de la lengua, por su `key`. */
export type ZonaTexto = Pick<ZonaLengua, "zona" | "organos">;

export const LENGUA_ZONAS_EN: Record<string, ZonaTexto> = {
  punta: { zona: "The tip", organos: "heart and lung" },
  centro: { zona: "The center", organos: "spleen and stomach" },
  lados: { zona: "The sides", organos: "liver and gallbladder" },
  raiz: { zona: "The root (the back)", organos: "kidney, bladder and intestines" },
  pecho: { zona: "The chest area (between tip and center)", organos: "lung, heart and breast (in women)" },
};

/** Los ocho patrones a los que apunta una lengua, y cómo reequilibrarlos. */
export type PatronTexto = Pick<PatronInfo, "nombre" | "senal" | "comoEquilibrar">;

export const PATRONES_EN: Record<PatronLengua, PatronTexto> = {
  calor: {
    nombre: "Heat",
    senal: "There is heat in the body (an excess of Yang, or a lack of Yin that no longer holds it back).",
    comoEquilibrar: [
      "Cooling, slightly bitter foods: cucumber, celery, leafy greens, pure cacao.",
      "Go easy on spicy food, alcohol, coffee and fried food, which raise the heat.",
      "Protect your sleep and cut down on overstimulation (screens at night).",
    ],
  },
  frio: {
    nombre: "Cold",
    senal: "There is internal cold: the energy isn't warming or moving the fluids well.",
    comoEquilibrar: [
      "Warm, cooked meals: soups, stews, root vegetables.",
      "Warming spices: ginger, cinnamon and clove.",
      "Avoid raw food and cold drinks; keep your lower back and your feet warm.",
    ],
  },
  "def-yin": {
    nombre: "Yin deficiency",
    senal: "The fluids that cool and nourish (Yin) are missing; the body dries out and heats up from the inside.",
    comoEquilibrar: [
      "Real rest and an early bedtime: Yin is replenished in stillness.",
      "Foods that nourish the Yin: broths, black sesame, seeds, seaweed, pear.",
      "Cut down on stimulants and on chronic overexertion, which drain the reserves.",
    ],
  },
  "def-yang": {
    nombre: "Yang deficiency",
    senal: "Warmth and drive (Yang) are missing: it's hard to warm up and hard to move the fluids.",
    comoEquilibrar: [
      "Warm, cooked foods; avoid raw food and cold.",
      "Ginger, cinnamon and bone broth to nourish the Yang.",
      "Look after your rest and keep your lower back warm.",
    ],
  },
  "def-qi": {
    nombre: "Qi deficiency of the spleen",
    senal: "The spleen is weak and isn't turning food into energy well.",
    comoEquilibrar: [
      "Regular, warm, unhurried meals; chew well.",
      "Cut down on sugar, raw food and dairy, which weaken the spleen.",
      "Try not to ruminate too much; give your routines some stability.",
    ],
  },
  "def-sangre": {
    nombre: "Blood deficiency",
    senal: "There isn't enough Blood to nourish; the body loses its color and its support.",
    comoEquilibrar: [
      "Foods that nourish the Blood: beetroot, dark leafy greens, legumes, dates.",
      "Sleep before midnight (the Blood is regenerated in the liver between 1 and 3 a.m.).",
      "Don't wear your eyes out or push yourself when your energy is low.",
    ],
  },
  humedad: {
    nombre: "Dampness / Phlegm",
    senal: "Fluids and mucus build up because the body isn't moving them well.",
    comoEquilibrar: [
      "Cut down on dairy, sugar, refined flour and fried food.",
      "Foods that dry the dampness: legumes, barley, pumpkin, ginger.",
      "Move every day: dampness stagnates when you sit still.",
    ],
  },
  estasis: {
    nombre: "Blood stasis",
    senal: "The Blood circulates with difficulty; it usually comes from a long-standing stagnation.",
    comoEquilibrar: [
      "Move and stretch daily to get the Blood and the Qi going.",
      "Spices that move the Blood: turmeric and ginger.",
      "Express and let go of frustration instead of holding on to it.",
    ],
  },
};
