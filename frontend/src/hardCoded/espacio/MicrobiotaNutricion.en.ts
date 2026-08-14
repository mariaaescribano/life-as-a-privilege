import type { NutrienteTarjeta } from "./NutrientesNutricion";

/**
 * Apartado «Microbiota» de Nutrición, en INGLÉS.
 *
 * Aquí va SOLO el texto, indexado por la `key` de cada tarjeta. La foto, el
 * color de acento y el orden viven únicamente en el fichero español, y la `key`
 * es además lo que se guarda como «leído»: duplicarla aquí sería la forma más
 * rápida de que una tarjeta perdiera su marquita al cambiar de idioma.
 *
 * Lo que falte se lee en español, tarjeta a tarjeta (ver `useMicrobiota`).
 *
 * Al traducir:
 *  · Los nombres científicos NO se traducen ni se abrevian: van tal cual y en
 *    cursiva conceptual («Bifidobacterium longum»), igual que en español.
 *  · «ácidos grasos de cadena corta» → «short-chain fatty acids», siempre
 *    entero, sin siglas: en español tampoco se usa «AGCC».
 *  · «intestino» → «gut» cuando es el ecosistema y «intestinal» → «gut» o
 *    «intestinal» según suene; «pared intestinal» → «gut wall».
 */
export type MicrobiotaTexto = Pick<NutrienteTarjeta, "titulo" | "parrafos">;

export const MICROBIOTA_EN: Record<string, MicrobiotaTexto> = {
  // ── Las bacterias ───────────────────────────────────────────────────────
  bifidobacterium: {
    titulo: "Bifidobacterium longum",
    parrafos: [
      "It's one of the most abundant beneficial bacteria in the human gut, especially during childhood.",
      "It helps digest certain carbohydrates, produces short-chain fatty acids and helps maintain the gut barrier and the balance of the immune system.",
    ],
  },
  lactobacillus: {
    titulo: "Lactobacillus rhamnosus",
    parrafos: [
      "It produces lactic acid, which helps keep the gut environment healthy and makes it harder for pathogens to grow.",
      "It also takes part in regulating the immune response, and it's one of the most studied probiotics.",
    ],
  },
  akkermansia: {
    titulo: "Akkermansia muciniphila",
    parrafos: [
      "It lives attached to the mucus layer of the gut and takes part in renewing it.",
      "Its presence is associated with better metabolic health and a more intact gut barrier.",
    ],
  },
  faecalibacterium: {
    titulo: "Faecalibacterium prausnitzii",
    parrafos: [
      "It's one of the main producers of butyrate in the colon.",
      "That fatty acid is an important source of energy for the cells of the gut and has anti-inflammatory properties, which is why it's considered a marker of a healthy microbiota.",
    ],
  },
  bacteroides: {
    titulo: "Bacteroides thetaiotaomicron",
    parrafos: [
      "It's one of the most abundant gut bacteria in adults.",
      "It has an extraordinary ability to break down complex polysaccharides from the diet, making nutrients easier to obtain and working alongside human metabolism.",
    ],
  },
  ecoli: {
    titulo: "Escherichia coli (commensal)",
    parrafos: [
      "Although some strains can cause disease, most of the ones that are part of the gut microbiota are harmless and even beneficial.",
      "They take part in making vitamin K, they compete with pathogens (they take up all the space and consume the nutrients in the gut before the 'bad guys' do) and they help keep the gut ecosystem in balance.",
    ],
  },

  // ── Las moléculas que fabrican ──────────────────────────────────────────
  propionato: {
    titulo: "Propionate",
    parrafos: [
      "It's another of the short-chain fatty acids that bacteria make by fermenting fiber.",
      "It travels to the liver, where it takes part in regulating glucose production and cholesterol metabolism.",
      "It also helps make fullness last longer, which shapes your appetite.",
    ],
  },
  acetato: {
    titulo: "Acetate",
    parrafos: [
      "It's one of the short-chain fatty acids that bacteria make by fermenting fiber.",
      "It's absorbed and travels in the blood, where it's turned into acetyl-CoA, the key molecule that starts cellular respiration in the mitochondria.",
    ],
  },
  butirato: {
    titulo: "Butyrate",
    parrafos: [
      "It's the short-chain fatty acid the cells of the colon prefer: it's their main food.",
      "It helps keep the gut wall healthy and sealed, and it takes part in regulating inflammation and the immune system.",
    ],
  },
};

/** Las tarjetas de microbiota en el idioma que se le pase. Sin hook, para poder
 *  usarlo también dentro de un `useMemo` o fuera de un componente. El español
 *  manda el orden, la `key` (que es lo que se guarda como leído), el color y la
 *  foto. */
export function microbiotaTraducida(
  tarjetas: NutrienteTarjeta[],
  idioma: "es" | "en",
): NutrienteTarjeta[] {
  if (idioma === "es") return tarjetas;
  return tarjetas.map((t) => {
    const en = MICROBIOTA_EN[t.key];
    return en ? { ...t, ...en } : t;
  });
}
