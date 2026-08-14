import type { Planta } from "./PlantasData";

/**
 * EL HERBARIO de Fitoterapia, en INGLÉS.
 *
 * Aquí va SOLO el texto, indexado por el `id` de la planta. El color, la foto,
 * el vídeo, el nombre científico y el propio `id` viven únicamente en
 * `PlantasData.ts`.
 *
 * Lo que falte se lee en español, planta a planta (ver `usePlantas`).
 *
 * Al traducir:
 *  · El nombre científico NO se traduce ni se toca: es el mismo en los dos
 *    idiomas y es lo que identifica la planta de verdad.
 *  · «Precauciones» → *Cautions* (glosario), «Datos curiosos» → *Fun facts*.
 *  · Los beneficios son una lista de frases cortas, casi telegráficas: en
 *    inglés se quedan igual de cortas, sin artículos de más.
 *  · «sistema inmunitario» → *immune system*; «microbiota» → *microbiota*,
 *    nunca *gut flora*.
 */
export type PlantaTexto = Pick<
  Planta, "nombre" | "uso" | "beneficios" | "formaDeUso"
> & Partial<Pick<Planta, "propiedades" | "datosCuriosos" | "precauciones">>;

export const PLANTAS_EN: Record<number, PlantaTexto> = {
  1: {
    nombre: "Parsley",
    uso: "A cleansing, diuretic plant that supports kidney function and strengthens the immune system.",
    beneficios: [
      "Supports how the kidneys work",
      "Helps clear out toxins",
      "Rich in vitamin C and vitamin K",
      "A powerful antioxidant",
      "Strengthens the immune system",
      "Protects against oxidative damage",
      "Supports circulation",
      "Supports cardiovascular health",
    ],
    formaDeUso: "Fresh in salads and dishes, as an infusion, or as an ingredient in green juices.",
    datosCuriosos: [
      "It's one of the most cleansing plants there is",
      "It's used both in cooking and in traditional remedies",
    ],
  },
  2: {
    nombre: "Chamomile",
    uso: "A digestive, calming, anti-inflammatory plant, ideal for digestive and nervous complaints.",
    beneficios: [
      "Supports digestion",
      "Anti-inflammatory and a muscle relaxant",
      "Eases digestive and menstrual pain",
      "Rich in antioxidants",
      "Helps wounds heal and soothes irritation",
      "Calms the nervous system",
      "Reduces stress",
      "Supports a good night's rest",
    ],
    formaDeUso: "As a daily infusion, in compresses for the skin, or as part of natural care.",
    datosCuriosos: [
      "It was used as an offering in ancient times",
      "It can be used daily because it acts so gently",
    ],
  },
  3: {
    nombre: "Oregano",
    uso: "A digestive, antimicrobial plant that supports the microbiota and cardiovascular health.",
    beneficios: [
      "A powerful antibacterial and antifungal",
      "Improves digestion",
      "Reduces gut inflammation",
      "Supports the balance of the microbiota",
      "Strengthens the immune system",
      "May lower LDL cholesterol",
      "Helps raise HDL",
      "Stimulates the metabolism",
    ],
    formaDeUso: "As a seasoning in meals or as an infusion.",
    datosCuriosos: [
      // OJO: el español dice «alegría de oro»; se traduce tal cual. La etimología
      // real del griego es «alegría del monte» (oros + ganos): si se corrige,
      // hay que corregir PRIMERO el español, que es la fuente.
      "Its name means “golden joy” in Greek",
      "It's rich in essential oils",
    ],
  },
  4: {
    nombre: "Thyme",
    uso: "An antibacterial, digestive plant that strengthens the immune system.",
    beneficios: [
      "A powerful natural antibacterial",
      "Inhibits candida",
      "May fight Helicobacter pylori",
      "Supports digestion",
      "Rich in antioxidants",
      "Strengthens the immune system",
      "Protects against oxidative stress",
      "Brings natural energy",
    ],
    formaDeUso: "As an infusion, as a seasoning, or in steam inhalations.",
    datosCuriosos: [
      "It's considered one of the most antibacterial plants there is",
      "It can stimulate you in a balanced way",
    ],
  },
  5: {
    nombre: "Bay laurel",
    uso: "A digestive, protective plant traditionally used for heavy meals.",
    beneficios: [
      "Improves digestion",
      "Reduces bloating",
      "Antimicrobial properties",
      "Antioxidant action",
      "Protects against bacteria",
      "Helps clear the airways",
    ],
    formaDeUso: "In stews, broths, or as an infusion.",
    datosCuriosos: [
      "A symbol of victory in ancient times",
      "Widely used in Mediterranean cooking",
    ],
  },
  6: {
    nombre: "Cinnamon",
    uso: "A spice that regulates blood sugar and stimulates circulation.",
    beneficios: [
      "Regulates blood sugar levels",
      "Improves insulin sensitivity",
      "Anti-inflammatory",
      "Antibacterial",
      "Stimulates circulation",
      "Lifts your mood",
    ],
    formaDeUso: "In infusions, desserts, smoothies, or sprinkled on top.",
    datosCuriosos: [
      "One of the oldest spices in the world",
      "Its aroma has a stimulating effect",
    ],
  },
  7: {
    nombre: "Ginger",
    uso: "A digestive, anti-inflammatory root that improves circulation.",
    beneficios: [
      "Improves digestion",
      "Eases a heavy stomach",
      "A powerful anti-inflammatory",
      "Useful for muscle pain",
      "Rich in antioxidants",
      "Strengthens the immune system",
      "Improves circulation",
      "Brings natural energy",
    ],
    formaDeUso: "As an infusion, grated into meals, or in smoothies.",
    datosCuriosos: [
      "Used in traditional medicine for thousands of years",
      "Very versatile in cooking and in natural health",
    ],
  },
  8: {
    nombre: "Turmeric",
    uso: "An anti-inflammatory, antioxidant spice that supports liver health.",
    beneficios: [
      "Powerful anti-inflammatory action",
      "Reduces chronic inflammation",
      "A natural antioxidant",
      "Supports liver health",
      "Supports detoxification",
      "Improves cognitive performance",
    ],
    formaDeUso: "In soups, stews, infusions, or combined with pepper.",
    datosCuriosos: [
      "It contains curcumin as its active compound",
      "One of the most studied spices there is",
    ],
  },
  9: {
    nombre: "Black pepper",
    uso: "A stimulating spice that fires up the metabolism and improves digestion.",
    beneficios: [
      "Fires up the metabolism",
      "Supports digestion",
      "Improves nutrient absorption",
      "Boosts cognitive capacity",
      "Rich in antioxidants",
      "Antimicrobial properties",
    ],
    formaDeUso: "As a daily seasoning, ideally freshly ground.",
    datosCuriosos: [
      "It improves the absorption of curcumin",
      "It was one of the most traded spices in history",
    ],
  },
};

/** Las plantas en el idioma que se le pase. Sin hook, para poder usarlo también
 *  dentro de un `useMemo`. El español manda el `id`, el color, la foto, el
 *  vídeo y el nombre científico. */
export function plantasTraducidas(ps: Planta[], idioma: "es" | "en"): Planta[] {
  if (idioma === "es") return ps;
  return ps.map((p) => {
    const en = PLANTAS_EN[p.id];
    return en ? { ...p, ...en } : p;
  });
}
