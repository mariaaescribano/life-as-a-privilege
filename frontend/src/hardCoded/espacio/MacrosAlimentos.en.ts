import type { AlimentoMacros, GrupoMacro, Tino } from "./MacrosAlimentos";

/**
 * «Cuenta los macros» (el juego de /metodo/nutricion/macros), en INGLÉS.
 *
 * Aquí va SOLO el texto: el nombre del alimento, cómo se dice su ración y los
 * rótulos del juego. Los gramos, las kcal, el color, la foto y la `key` viven
 * únicamente en `MacrosAlimentos.ts`.
 *
 * Lo que falte se lee en español, alimento a alimento (ver `useMacrosJuego`).
 *
 * `sorpresa` NO se traduce: ese texto no se pinta en ninguna parte (ver la
 * cabecera del fichero español). Si algún día vuelve a la página, hay que
 * traducirlo entonces.
 *
 * Al traducir:
 *  · La ración es el corazón del juego: se dice como se dice en la cocina —«1
 *    medium (180 g)», «1 handful (30 g)», «2 slices (60 g)»—. Los gramos y los
 *    mililitros NO se pasan a onzas: son los números que se estiman y con los
 *    que se puntúa.
 *  · Los decimales con coma pasan a punto.
 *  · «cocido/cocida» → *cooked*, y va SIEMPRE: media página de la lección
 *    depende de que se distinga de *dry/raw*.
 */

// ── Los grupos (las pestañas de color) ─────────────────────────────────────
export const GRUPOS_MACRO_EN: Record<GrupoMacro, string> = {
  fruta: "Fruit",
  verdura: "Vegetables",
  legumbre: "Legumes",
  proteina: "Animal protein",
  cereal: "Grains",
  grasa: "Fats",
  "frutos-secos": "Nuts",
  lacteo: "Dairy",
  otros: "Others",
};

// ── Los alimentos: su nombre y su ración ───────────────────────────────────
export type AlimentoMacrosTexto = Pick<AlimentoMacros, "nombre" | "racion">;

export const ALIMENTOS_MACROS_EN: Record<string, AlimentoMacrosTexto> = {
  // Fruta
  manzana: { nombre: "Apple", racion: "1 medium (180 g)" },
  platano: { nombre: "Banana", racion: "1 medium (120 g)" },
  naranja: { nombre: "Orange", racion: "1 medium (150 g)" },
  zumo: { nombre: "Orange juice", racion: "1 glass (250 ml)" },

  // Verdura
  brocoli: { nombre: "Broccoli", racion: "1 plate (200 g)" },
  espinaca: { nombre: "Spinach", racion: "1 plate, cooked (200 g)" },
  zanahoria: { nombre: "Carrot", racion: "2 medium (150 g)" },
  tomate: { nombre: "Tomato", racion: "1 large (180 g)" },
  pimiento: { nombre: "Red pepper", racion: "1 medium (150 g)" },
  calabacin: { nombre: "Zucchini", racion: "1 medium (200 g)" },
  cebolla: { nombre: "Onion", racion: "1 medium (150 g)" },
  berenjena: { nombre: "Eggplant", racion: "1/2 medium (150 g)" },
  esparragos: { nombre: "Asparagus", racion: "6 spears (150 g)" },
  batata: { nombre: "Sweet potato", racion: "1 medium, roasted (200 g)" },

  // Legumbres
  garbanzos: { nombre: "Chickpeas", racion: "1 plate, cooked (200 g)" },
  lentejas: { nombre: "Lentils", racion: "1 plate, cooked (200 g)" },
  soja: { nombre: "Soybeans", racion: "1 cup, cooked (100 g)" },
  tofuseitan: { nombre: "Tofu", racion: "1 block (150 g)" },

  // Proteína animal
  pollo: { nombre: "Chicken", racion: "1 breast fillet (150 g)" },
  vaca: { nombre: "Beef", racion: "1 steak (150 g)" },
  cerdo: { nombre: "Pork", racion: "1 chop (150 g)" },
  huevo: { nombre: "Egg", racion: "1 egg (60 g)" },
  atun: { nombre: "Tuna", racion: "1 can in water (80 g)" },
  salmon: { nombre: "Salmon", racion: "1 fillet (150 g)" },
  gambas: { nombre: "Shrimp", racion: "8-10 shrimp (100 g)" },

  // Cereales
  pasta: { nombre: "Whole-wheat pasta", racion: "1 plate, cooked (200 g)" },
  arroces: { nombre: "Brown rice", racion: "1 plate, cooked (200 g)" },
  pan: { nombre: "Bread", racion: "2 slices (60 g)" },
  avena: { nombre: "Oats", racion: "1 bowl (60 g dry)" },

  // Grasas
  aguacate: { nombre: "Avocado", racion: "1/2 avocado (100 g)" },
  aceite: { nombre: "Olive oil", racion: "1 tablespoon (10 g)" },
  aceitesvegetales: { nombre: "Sunflower oil", racion: "1 tablespoon (10 g)" },

  // Frutos secos
  nueces: { nombre: "Walnuts", racion: "1 handful (30 g)" },
  cacahuete: { nombre: "Peanuts", racion: "1 handful (30 g)" },
  frutossecos: { nombre: "Mixed nuts", racion: "1 handful (30 g)" },
  almendras: { nombre: "Almonds", racion: "1 handful (30 g)" },
  anacardo: { nombre: "Cashews", racion: "1 handful (30 g)" },

  // Lácteos
  queso: { nombre: "Aged cheese", racion: "2 slices (30 g)" },
  leche: { nombre: "Whole milk", racion: "1 glass (250 ml)" },
  quesofresco: { nombre: "Fresh cheese", racion: "1 serving (100 g)" },
  yogurgriego: { nombre: "Greek yogurt", racion: "1 pot (125 g)" },

  // Otros
  choco: { nombre: "85% dark chocolate", racion: "2 squares (20 g)" },
  miel: { nombre: "Honey", racion: "1 tablespoon (20 g)" },
  cafe: { nombre: "Black coffee", racion: "1 cup (60 ml)" },
  tes: { nombre: "Tea", racion: "1 cup (250 ml)" },
  procesados: { nombre: "Cookies", racion: "3 cookies (30 g)" },
  oreo: { nombre: "Oreo", racion: "4 cookies (44 g)" },
  nutella: { nombre: "Nutella", racion: "2 tablespoons (30 g)" },
  cola: { nombre: "Cola drink", racion: "1 can (330 ml)" },
  cervezavino: { nombre: "Beer", racion: "1 small glass (250 ml)" },
};

// ── El tino de cada macro ──────────────────────────────────────────────────
// «Clavado» es acertar de lleno; «cerca», rondarlo. No son notas: no hay
// puntos en este juego.
export const TINO_EN: Record<Tino, string> = {
  clavado: "Spot on",
  cerca: "Close",
  lejos: "Way off",
};

// ── Cierre de la partida ───────────────────────────────────────────────────
export const CIERRE_PARTIDA_EN = {
  titulo: "Ten foods looked at",
  texto: "You learn it by playing again: the second round is always a jump, and the ones you get wrong are exactly the ones that stick.",
};

/** Los alimentos del juego en el idioma que se le pase. El español manda la
 *  `key`, el grupo, la foto y todos los gramos. */
export function alimentosMacrosTraducidos(
  alimentos: AlimentoMacros[],
  idioma: "es" | "en",
): AlimentoMacros[] {
  if (idioma === "es") return alimentos;
  return alimentos.map((a) => {
    const en = ALIMENTOS_MACROS_EN[a.key];
    return en ? { ...a, ...en } : a;
  });
}
