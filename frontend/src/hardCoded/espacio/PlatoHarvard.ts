// ── Datos de la actividad «Crea el plato de Harvard» (recorrido de Nutrición).
// El plato es un círculo dividido en sectores; cada sector es un macro/grupo.
// Al pulsar un sector se muestran sus alimentos, que se arrastran sobre el plato.
//
// FUENTE ÚNICA: los alimentos del plato SON los mismos de «Alimentación
// molecular» (ALIMENTOS de AlimentosNutricion). Cada grupo de la biblioteca cae
// en un sector del plato según GRUPOS_POR_SECTOR; los grupos sin sitio en el
// plato (grasas, otros, ultraprocesados) no se dibujan (quedan fuera del plato).

import { ALIMENTOS, type Alimento, type GrupoAlimento } from "./AlimentosNutricion";

export interface PlatoAlimento {
  key: string;
  label: string;
  /** Emoji temporal hasta subir la foto. */
  emoji: string;
  /** Foto redonda del alimento. Si existe, sustituye al emoji. */
  foto?: string;
}

export interface PlatoMacro {
  key: string;
  label: string;
  /** Nombre corto para la etiqueta dentro del sector del plato. */
  labelCorto: string;
  color: string;
  /** Peso relativo del sector en el plato (proporción del círculo). */
  proporcion: number;
  descripcion: string;
  alimentos: PlatoAlimento[];
}

// Un alimento de la biblioteca molecular → alimento del plato (misma foto/emoji).
const toPlato = (a: Alimento): PlatoAlimento => ({
  key: a.key,
  label: a.nombre,
  emoji: a.emoji ?? "🍽️",
  foto: a.foto,
});

// Qué grupo(s) de la biblioteca molecular caen en cada sector del plato.
const GRUPOS_POR_SECTOR: Record<string, GrupoAlimento[]> = {
  verduras: ["verdura"],
  fruta: ["fruta"],
  cereales: ["cereal"],
  proteina: ["proteina", "legumbre", "frutos-secos", "lacteo"],
};

// Alimentos que, aun siendo de un grupo saludable, NO van en el plato (trampas
// que la biblioteca usa como contraste, p.ej. el zumo: fruta sin fibra).
const FUERA_DEL_PLATO = new Set<string>(["zumo-naranja"]);

const alimentosDeSector = (sectorKey: string): PlatoAlimento[] =>
  ALIMENTOS
    .filter((a) => (GRUPOS_POR_SECTOR[sectorKey] ?? []).includes(a.grupo) && !FUERA_DEL_PLATO.has(a.key))
    .map(toPlato);

// Metadatos de los 4 sectores (los alimentos se rellenan desde ALIMENTOS).
const SECTORES_META: Omit<PlatoMacro, "alimentos">[] = [
  {
    key: "verduras",
    label: "Verduras y hortalizas",
    labelCorto: "Verduras",
    color: "#8fb877",
    proporcion: 35,
    descripcion:
      "Llena buena parte del plato de verduras y hortalizas de muchos colores. Cuanta más variedad, mejor.",
  },
  {
    key: "fruta",
    label: "Fruta",
    labelCorto: "Fruta",
    color: "#d76a8e",
    proporcion: 15,
    descripcion:
      "Fruta entera y de temporada. Aporta fibra, vitaminas y fitoquímicos que te protegen.",
  },
  {
    key: "cereales",
    label: "Cereales integrales",
    labelCorto: "Cereales",
    color: "#c9a86a",
    proporcion: 25,
    descripcion:
      "Cereales integrales como la avena, el arroz o el pan integral: energía de liberación lenta.",
  },
  {
    key: "proteina",
    label: "Proteína saludable",
    labelCorto: "Proteína",
    color: "#ffffff",
    proporcion: 25,
    descripcion:
      "Proteína saludable: legumbres, soja, huevo, tofu o frutos secos. Evita carnes y pescados, elige proteína vegetal.",
  },
];

export const PLATO_MACROS: PlatoMacro[] = SECTORES_META.map((s) => ({
  ...s,
  alimentos: alimentosDeSector(s.key),
}));

// Alimentos «trampa» que NO forman parte del plato de Harvard (ultraprocesados
// + el zumo). Mismos alimentos de la biblioteca molecular.
export const PLATO_FUERA: PlatoAlimento[] = ALIMENTOS
  .filter((a) => a.grupo === "ultraprocesado" || FUERA_DEL_PLATO.has(a.key))
  .map(toPlato);

export const platoMacroByKey = (key: string): PlatoMacro | undefined =>
  PLATO_MACROS.find((m) => m.key === key);
