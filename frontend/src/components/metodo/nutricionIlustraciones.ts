import type { Vineta } from "./ComicViewer";
import type { IlustracionEntry } from "./ilustracionesGaleria";
import { nutricionBg, nutricionTxt } from "../../GlobalVariables";
import { NUTRICION_INTRO } from "./comicNutricionIntro";
import { NUTRICION_CALORIAS } from "./comicNutricionCalorias";
import { NUTRICION_MICROBIOTA } from "./comicNutricionMicrobiota";
import { COMICS_NUTRIENTES } from "./comicsNutrientes";
import { NUTRIENTES } from "../../hardCoded/espacio/NutrientesNutricion";

// ─────────────────────────────────────────────────────────────────────────
// TODOS los cómics de Nutrición reunidos para la galería de «Ilustraciones»
// (se abre desde la Biblioteca de alimentos). Incluye el intro, las calorías,
// el cómic de CADA grupo de nutrientes (los de «Los nutrientes») y la
// microbiota. La portada de cada uno es su ÚLTIMA viñeta.
// ─────────────────────────────────────────────────────────────────────────

const NUTRI_BG_IMG = "/img/fondos/nutri.png";

// Construye una entrada de galería con el tema de Nutrición (acento claro +
// letra oscura, sin sombra) y la portada = última viñeta del cómic.
const entry = (id: string, titulo: string, vinetas: Vineta[]): IlustracionEntry => ({
  id,
  titulo,
  disciplina: "Nutrición",
  cover: vinetas.length ? vinetas[vinetas.length - 1].src : "",
  vinetas,
  themeColor: nutricionBg,
  textColor: nutricionTxt,
  cardColor: nutricionTxt,
  disciplinaBgImage: NUTRI_BG_IMG,
  disciplinaBgColor: nutricionBg,
  textShadow: "none",
});

export const NUTRICION_ILUSTRACIONES: IlustracionEntry[] = [
  entry("nutricion-intro", "Eres lo que absorbes", NUTRICION_INTRO),
  entry("nutricion-calorias", "Las calorías no existen", NUTRICION_CALORIAS),
  // Un cómic por cada grupo de nutrientes, en el orden de NUTRIENTES.
  ...NUTRIENTES
    .filter((n) => COMICS_NUTRIENTES[n.key]?.length)
    .map((n) => entry(`nutriente-${n.key}`, n.label, COMICS_NUTRIENTES[n.key])),
  entry("nutricion-microbiota", "La microbiota", NUTRICION_MICROBIOTA),
];
