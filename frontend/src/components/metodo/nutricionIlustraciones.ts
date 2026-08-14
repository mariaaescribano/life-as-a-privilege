import type { Vineta } from "./ComicViewer";
import type { IlustracionEntry } from "./ilustracionesGaleria";
import { nutricionBg, nutricionTxt } from "../../GlobalVariables";
import { NUTRICION_INTRO } from "./comicNutricionIntro";
import { NUTRICION_CALORIAS } from "./comicNutricionCalorias";
import { NUTRICION_MICROBIOTA } from "./comicNutricionMicrobiota";
import { NUTRICION_INTEGRAL } from "./comicNutricionIntegral";
import { HAMBRE_HOLISTICA, sinNegrita } from "./hambreHolistica";
import { COMICS_NUTRIENTES } from "./comicsNutrientes";
import { ORIGEN_NUTRIENTES } from "./comicsOrigenNutrientes";
import { NUTRIENTES } from "../../hardCoded/espacio/NutrientesNutricion";

// ─────────────────────────────────────────────────────────────────────────
// TODOS los cómics de Nutrición reunidos para la galería de «Ilustraciones»
// (se abre desde la Biblioteca de alimentos). Incluye el intro, las calorías,
// el cómic de CADA grupo de nutrientes (los de «Los nutrientes») y la
// microbiota. La portada de cada uno es su ÚLTIMA viñeta.
// ─────────────────────────────────────────────────────────────────────────

const NUTRI_BG_IMG = "/img/fondos/nutri.webp";

// Construye una entrada de galería con el tema de Nutrición (acento claro +
// letra oscura, sin sombra) y la portada = última viñeta del cómic (o la que se
// pase a mano, p.ej. las lecturas de «¿De dónde vienen?», que llevan su portada
// elegida en comicsOrigenNutrientes).
const entry = (id: string, titulo: string, vinetas: Vineta[], cover?: string, comicKey?: string): IlustracionEntry => ({
  id,
  comicKey,
  titulo,
  disciplina: "Nutrición",
  cover: cover ?? (vinetas.length ? vinetas[vinetas.length - 1].src : ""),
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
  // OJO con la clave: el `id` es «nutricion-hambre», pero sus viñetas son las
  // de la LECTURA holística, no las del cómic de transición que se llama igual.
  // Sin `comicKey` el inglés le pondría el texto del otro cómic encima.
  entry("nutricion-hambre", "El hambre: una mirada holística", sinNegrita(HAMBRE_HOLISTICA),
        undefined, "nutricion-hambre-holistica"),
  entry("nutricion-integral", "Lo integral", NUTRICION_INTEGRAL),
  // Las cinco lecturas del último paso, «¿De dónde vienen los nutrientes?»: los
  // ciclos de la naturaleza (venía de Fisiología), el suelo y la raíz, la planta,
  // la hoja y el fruto con sus colores.
  ...ORIGEN_NUTRIENTES.map((l) => entry(`nutricion-origen-${l.key}`, l.titulo, l.vinetas, l.cover)),
];
