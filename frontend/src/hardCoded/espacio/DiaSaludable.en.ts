import type { AlimentoDia, ComidaDia, GrupoDia } from "./DiaSaludable";

/**
 * «Diseña tu día» de Nutrición, en INGLÉS.
 *
 * Aquí va SOLO el texto. Las kcal, los gramos de la ración, el reparto de
 * porcentajes, el grupo y la `key` —que es lo que se guarda en la BD con el día
 * que la persona ha montado— viven únicamente en `DiaSaludable.ts`.
 *
 * Lo que falte se lee en español, alimento a alimento (ver `useDiaSaludable`).
 *
 * Al traducir:
 *  · El «a ojo» es el corazón de la actividad: son medidas con el cuerpo, no
 *    con la báscula. «un puño» → *a fist*, «la palma de tu mano» → *your palm*,
 *    «una cucharada sopera» → *a tablespoon*, «una cucharadita» → *a teaspoon*,
 *    «tu mano ahuecada» → *your cupped hand*. Se dicen igual siempre.
 *  · Los gramos NO se pasan a onzas: son los números de la ración y los que
 *    entran en la cuenta de calorías.
 *  · Las comidas del día son las españolas (cinco, con merienda). Se traducen
 *    por lo que son, no se cambian por el horario anglosajón.
 */

// ── Las pestañas de la paleta de alimentos ─────────────────────────────────
export const GRUPOS_DIA_EN: Record<GrupoDia, string> = {
  verdura: "Vegetables",
  fruta: "Fruit",
  cereal: "Grains",
  proteina: "Protein",
  grasa: "Fats",
  lacteo: "Dairy",
  capricho: "Treats",
};

// ── El «a ojo» de cada alimento, por su `key` ──────────────────────────────
export const A_OJO_EN: Record<string, string> = {
  // Verduras
  brocoli: "two fists of florets",
  espinaca: "both hands full of leaves (they shrink right down when cooked)",
  zanahoria: "one large carrot or two small ones",
  tomate: "one large tomato or two medium",
  pimiento: "one whole pepper",
  calabacin: "half a zucchini",
  cebolla: "half an onion",
  berenjena: "half an eggplant",
  esparragos: "a bunch of five or six",
  // Fruta
  manzana: "one piece, the size of your fist",
  platano: "one medium piece",
  naranja: "one piece, the size of your fist",
  // Cereales
  "arroz-integral": "a closed fist, already cooked",
  "arroz-blanco": "a closed fist, already cooked",
  pan: "two slices as thick as a finger",
  // Proteína
  pollo: "your palm, without the fingers",
  atun: "your palm",
  huevo: "two eggs",
  garbanzos: "a fist, already cooked",
  soja: "a fist of edamame or a block of tofu",
  vaca: "your palm, without the fingers",
  // Grasas
  aguacate: "half an avocado",
  "aceite-oliva": "one tablespoon",
  nueces: "what fits in your cupped hand",
  cacahuetes: "a small handful",
  // Lácteos
  queso: "two fingers, like a matchbox",
  // Caprichos
  "chocolate-negro": "two squares",
  miel: "one teaspoon",
  "zumo-naranja": "one glass (the whole fruit is better)",
  nutella: "one level tablespoon",
  oreo: "two cookies",
};

// ── Las comidas del día ────────────────────────────────────────────────────
export const COMIDAS_EN: Record<string, string> = {
  desayuno: "Breakfast",
  "media-manana": "Mid-morning",
  comida: "Lunch",
  merienda: "Afternoon snack",
  cena: "Dinner",
};

/** Los alimentos del día en el idioma que se le pase. El español manda la
 *  `key`, el grupo, las kcal y los gramos. */
export function alimentosDiaTraducidos(
  alimentos: AlimentoDia[],
  idioma: "es" | "en",
): AlimentoDia[] {
  if (idioma === "es") return alimentos;
  return alimentos.map((a) => {
    const aOjo = A_OJO_EN[a.key];
    return aOjo ? { ...a, aOjo } : a;
  });
}

/** El reparto de comidas en el idioma que se le pase (la `key` y el % son del
 *  español: la `key` es lo que se guarda con el día montado). */
export function comidasTraducidas(comidas: ComidaDia[], idioma: "es" | "en"): ComidaDia[] {
  if (idioma === "es") return comidas;
  return comidas.map((c) => {
    const label = COMIDAS_EN[c.key];
    return label ? { ...c, label } : c;
  });
}
