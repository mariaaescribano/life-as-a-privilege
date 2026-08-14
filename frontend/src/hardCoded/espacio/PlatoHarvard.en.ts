import type { PlatoMacro } from "./PlatoHarvard";

/**
 * «Crea el plato de Harvard», en INGLÉS.
 *
 * Aquí van SOLO los rótulos de los cuatro sectores. Los alimentos NO se
 * traducen aquí: salen de la Biblioteca molecular (`AlimentosNutricion.en`),
 * que es la fuente única de sus nombres y sus fotos. La proporción del sector,
 * el color y la `key` —lo que se guarda como plato hecho— viven únicamente en
 * `PlatoHarvard.ts`.
 *
 * Al traducir:
 *  · `labelCorto` es la etiqueta DENTRO del sector del círculo: tiene que caber
 *    en una palabra. Si la traducción no cabe, se acorta, no se parte.
 *  · El plato es el de Harvard, un material real: los cuatro sectores llevan
 *    los nombres con los que se conoce en inglés (Vegetables, Fruits, Whole
 *    grains, Healthy protein).
 */
export type PlatoSectorTexto = Pick<PlatoMacro, "label" | "labelCorto" | "descripcion">;

export const PLATO_SECTORES_EN: Record<string, PlatoSectorTexto> = {
  verduras: {
    label: "Vegetables",
    labelCorto: "Vegetables",
    descripcion:
      "Fill a good part of the plate with vegetables of many colors. The more variety, the better.",
  },
  fruta: {
    label: "Fruit",
    labelCorto: "Fruit",
    descripcion:
      "Whole fruit, in season. It brings fiber, vitamins and the plant chemicals that protect you.",
  },
  cereales: {
    label: "Whole grains",
    labelCorto: "Grains",
    descripcion:
      "Whole grains like oats, rice or whole-grain bread: slow-release energy.",
  },
  proteina: {
    label: "Healthy protein",
    labelCorto: "Protein",
    descripcion:
      "Healthy protein: legumes, soy, egg, tofu or nuts. Skip the meat and fish, choose plant protein.",
  },
};

/** Los sectores del plato en el idioma que se le pase. Sin hook, para poder
 *  usarlo también dentro de un `useMemo`. El español manda la `key`, el color,
 *  la proporción y los alimentos. */
export function platoTraducido(macros: PlatoMacro[], idioma: "es" | "en"): PlatoMacro[] {
  if (idioma === "es") return macros;
  return macros.map((m) => {
    const en = PLATO_SECTORES_EN[m.key];
    return en ? { ...m, ...en } : m;
  });
}
