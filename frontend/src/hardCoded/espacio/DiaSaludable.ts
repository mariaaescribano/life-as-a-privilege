// ─────────────────────────────────────────────────────────────────────────
// Datos de la actividad «Diseña tu día» (/metodo/nutricion/dia).
// El usuario reparte su objetivo de calorías (calculado en /calorias) entre las
// comidas del día y va colocando alimentos con RACIONES reales: cuántos gramos y,
// sobre todo, cómo medirlos A OJO (un puño, la palma de la mano, una cucharada…).
// El objetivo es consciencia: aprender CUÁNTO y CÓMO comer, no contar obsesivo.
//
// FUENTE ÚNICA de fotos/nombres: los alimentos son los mismos de «Alimentación
// molecular» (ALIMENTOS de AlimentosNutricion) — reutilizamos su foto/emoji/macros.
// Aquí solo añadimos lo que esa biblioteca no tiene: kcal/100 g, la ración
// aconsejada y la medida a ojo.
// ─────────────────────────────────────────────────────────────────────────

import { alimentoByKey, MACRO_COLOR, type Alimento } from "./AlimentosNutricion";

// Grupos con los que se construye una comida (tabs de la paleta de alimentos).
export type GrupoDia =
  | "verdura" | "fruta" | "cereal" | "proteina" | "grasa" | "lacteo" | "capricho";

export const GRUPOS_DIA: { key: GrupoDia; label: string; color: string }[] = [
  { key: "verdura",  label: "Verduras",  color: "#6fa86b" },
  { key: "fruta",    label: "Fruta",     color: "#d76a8e" },
  { key: "cereal",   label: "Cereales",  color: "#e0a92e" },
  { key: "proteina", label: "Proteína",  color: "#d75f5a" },
  { key: "grasa",    label: "Grasas",    color: "#c79a45" },
  { key: "lacteo",   label: "Lácteos",   color: "#6f9fd8" },
  { key: "capricho", label: "Caprichos", color: "#9a6a9a" },
];

export const grupoDiaColor = (g: GrupoDia): string =>
  GRUPOS_DIA.find((x) => x.key === g)?.color ?? "#888";

// Foto de fondo del área de selección según el grupo elegido. Las de los 5 grupos
// del plato existen en /recorrido/nutricion/portadas/plato<grupo>.png; lácteos y
// caprichos (que no son del plato de Harvard) caen al fondo general de Nutrición.
const FONDO_GRUPO: Record<GrupoDia, string> = {
  verdura:  "/recorrido/nutricion/portadas/platoverduras.png",
  fruta:    "/recorrido/nutricion/portadas/platofruta.png",
  cereal:   "/recorrido/nutricion/portadas/platocarbs.png",
  proteina: "/recorrido/nutricion/portadas/platoproteina.png",
  grasa:    "/recorrido/nutricion/portadas/platograsas.png",
  lacteo:   "/recorrido/nutricion/portadas/nutri.png",
  capricho: "/recorrido/nutricion/portadas/nutri.png",
};

export const grupoDiaFondo = (g: GrupoDia): string => FONDO_GRUPO[g];

export interface AlimentoDia {
  /** Clave en ALIMENTOS (para reutilizar foto/emoji/macros). */
  key: string;
  /** Grupo dentro de esta actividad (puede no coincidir con el de la biblioteca:
   *  p.ej. el queso es «lácteo» aquí y también aparece como proteína en el plato). */
  grupo: GrupoDia;
  /** Energía por 100 g del alimento tal y como se come (cocido/listo). */
  kcal100: number;
  /** Ración aconsejada (g) de una toma normal para un adulto. */
  porcionG: number;
  /** Cómo medir esa ración A OJO, sin báscula (el corazón de la actividad). */
  aOjo: string;
}

// Los alimentos disponibles para diseñar el día. kcal/100 g y raciones son
// orientativos (valores medios de tablas de composición); a ojo son reglas
// prácticas de educación alimentaria (puño, palma, cuenco de la mano…).
export const ALIMENTOS_DIA: AlimentoDia[] = [
  // ── Verduras (base del plato: sin miedo, llena) ──
  { key: "brocoli",       grupo: "verdura",  kcal100: 34,  porcionG: 150, aOjo: "dos puños de ramilletes" },

  // ── Fruta (una pieza = una ración) ──
  { key: "manzana",       grupo: "fruta",    kcal100: 52,  porcionG: 150, aOjo: "una pieza, del tamaño de tu puño" },
  { key: "platano",       grupo: "fruta",    kcal100: 89,  porcionG: 120, aOjo: "una pieza mediana" },
  { key: "naranja",       grupo: "fruta",    kcal100: 47,  porcionG: 150, aOjo: "una pieza, del tamaño de tu puño" },

  // ── Cereales (ya cocidos / listos para comer) ──
  { key: "arroz-integral", grupo: "cereal",  kcal100: 112, porcionG: 125, aOjo: "un puño cerrado, ya cocido" },
  { key: "arroz-blanco",   grupo: "cereal",  kcal100: 130, porcionG: 125, aOjo: "un puño cerrado, ya cocido" },
  { key: "pan",            grupo: "cereal",  kcal100: 260, porcionG: 50,  aOjo: "dos rebanadas del grosor de un dedo" },

  // ── Proteína (una ración ≈ la palma de tu mano) ──
  { key: "pollo",         grupo: "proteina", kcal100: 165, porcionG: 120, aOjo: "la palma de tu mano, sin los dedos" },
  { key: "atun",          grupo: "proteina", kcal100: 130, porcionG: 100, aOjo: "la palma de tu mano" },
  { key: "huevo",         grupo: "proteina", kcal100: 155, porcionG: 100, aOjo: "dos huevos" },
  { key: "garbanzos",     grupo: "proteina", kcal100: 130, porcionG: 150, aOjo: "un puño, ya cocidos" },
  { key: "soja",          grupo: "proteina", kcal100: 125, porcionG: 100, aOjo: "un puño de edamame o un taco de tofu" },
  { key: "vaca",          grupo: "proteina", kcal100: 250, porcionG: 120, aOjo: "la palma de tu mano, sin los dedos" },

  // ── Grasas saludables (una pizca hace mucha energía) ──
  { key: "aguacate",      grupo: "grasa",    kcal100: 160, porcionG: 75,  aOjo: "medio aguacate" },
  { key: "aceite-oliva",  grupo: "grasa",    kcal100: 884, porcionG: 10,  aOjo: "una cucharada sopera" },
  { key: "nueces",        grupo: "grasa",    kcal100: 654, porcionG: 30,  aOjo: "lo que cabe en tu mano ahuecada" },
  { key: "cacahuetes",    grupo: "grasa",    kcal100: 567, porcionG: 30,  aOjo: "un puñado pequeño" },

  // ── Lácteos ──
  { key: "queso",         grupo: "lacteo",   kcal100: 350, porcionG: 30,  aOjo: "dos dedos, como una caja de cerillas" },

  // ── Caprichos (con conciencia: poco y de vez en cuando) ──
  { key: "chocolate-negro", grupo: "capricho", kcal100: 560, porcionG: 20, aOjo: "dos onzas" },
  { key: "miel",            grupo: "capricho", kcal100: 304, porcionG: 15, aOjo: "una cucharadita" },
  { key: "zumo-naranja",    grupo: "capricho", kcal100: 45,  porcionG: 200, aOjo: "un vaso (mejor la fruta entera)" },
  { key: "nutella",         grupo: "capricho", kcal100: 530, porcionG: 20, aOjo: "una cucharada rasa" },
  { key: "oreo",            grupo: "capricho", kcal100: 480, porcionG: 22, aOjo: "dos galletas" },
];

export const alimentoDiaByKey = (k: string): AlimentoDia | undefined =>
  ALIMENTOS_DIA.find((a) => a.key === k);

// Foto/emoji/nombre/macros vienen de la biblioteca molecular (fuente única).
export const infoAlimento = (k: string): Alimento | undefined => alimentoByKey(k);

// ── Reparto científico de las calorías del día según cuántas comidas se hagan.
// Porcentajes orientativos y equilibrados (comida y desayuno cargan más energía;
// cena algo más ligera). Cada `key` es única y da el orden real del día.
export interface ComidaDia {
  key: string;
  label: string;
  /** % del objetivo diario de calorías. */
  pct: number;
}

export const REPARTO_COMIDAS: Record<number, ComidaDia[]> = {
  3: [
    { key: "desayuno", label: "Desayuno", pct: 30 },
    { key: "comida",   label: "Comida",   pct: 40 },
    { key: "cena",     label: "Cena",     pct: 30 },
  ],
  4: [
    { key: "desayuno", label: "Desayuno", pct: 25 },
    { key: "comida",   label: "Comida",   pct: 35 },
    { key: "merienda", label: "Merienda", pct: 15 },
    { key: "cena",     label: "Cena",     pct: 25 },
  ],
  5: [
    { key: "desayuno",     label: "Desayuno",     pct: 25 },
    { key: "media-manana", label: "Media mañana", pct: 10 },
    { key: "comida",       label: "Comida",       pct: 30 },
    { key: "merienda",     label: "Merienda",     pct: 10 },
    { key: "cena",         label: "Cena",         pct: 25 },
  ],
};

export const NUM_COMIDAS_OPCIONES = [3, 4, 5] as const;

// Reexport para que la página no tenga que importar de dos sitios.
export { MACRO_COLOR };
