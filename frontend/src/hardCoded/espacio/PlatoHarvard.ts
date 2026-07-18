// ── Datos de la actividad «Crea el plato de Harvard» (recorrido de Nutrición).
// El plato es un círculo dividido en sectores; cada sector es un macro/grupo.
// Al pulsar un sector se muestran sus alimentos, que se arrastran sobre el plato.
//
// Fotos: se reutilizan las de la Biblioteca de alimentos, en
// /recorrido/nutricion/alimentos/<archivo>.png. Los alimentos que aún no tienen
// foto muestran el emoji como marcador temporal (se irán añadiendo).

export interface PlatoAlimento {
  key: string;
  label: string;
  /** Emoji temporal hasta subir la foto. */
  emoji: string;
  /** Foto redonda del alimento (pendiente). Si existe, sustituye al emoji. */
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

export const PLATO_MACROS: PlatoMacro[] = [
  {
    key: "verduras",
    label: "Verduras y hortalizas",
    labelCorto: "Verduras",
    color: "#6fa86b",
    proporcion: 35,
    descripcion:
      "Llena buena parte del plato de verduras y hortalizas de muchos colores. Cuanta más variedad, mejor.",
    alimentos: [
      { key: "brocoli", label: "Brócoli", emoji: "🥦", foto: "/recorrido/nutricion/alimentos/brocoli.png" },
      { key: "espinacas", label: "Espinacas", emoji: "🥬" },
      { key: "zanahoria", label: "Zanahoria", emoji: "🥕" },
      { key: "tomate", label: "Tomate", emoji: "🍅" },
      { key: "pimiento", label: "Pimiento", emoji: "🫑" },
      { key: "calabacin", label: "Calabacín", emoji: "🥒" },
    ],
  },
  {
    key: "fruta",
    label: "Fruta",
    labelCorto: "Fruta",
    color: "#d76a8e",
    proporcion: 15,
    descripcion:
      "Fruta entera y de temporada. Aporta fibra, vitaminas y fitoquímicos que te protegen.",
    alimentos: [
      { key: "manzana", label: "Manzana", emoji: "🍎", foto: "/recorrido/nutricion/alimentos/manzana.png" },
      { key: "platano", label: "Plátano", emoji: "🍌", foto: "/recorrido/nutricion/alimentos/platano.png" },
      { key: "fresas", label: "Fresas", emoji: "🍓" },
      { key: "naranja", label: "Naranja", emoji: "🍊", foto: "/recorrido/nutricion/alimentos/naranja.png" },
      { key: "uvas", label: "Uvas", emoji: "🍇" },
      { key: "arandanos", label: "Arándanos", emoji: "🫐" },
    ],
  },
  {
    key: "cereales",
    label: "Cereales integrales",
    labelCorto: "Cereales",
    color: "#e0a92e",
    proporcion: 25,
    descripcion:
      "Cereales integrales como la avena, el arroz o el pan integral: energía de liberación lenta.",
    alimentos: [
      { key: "avena", label: "Avena", emoji: "🌾" },
      { key: "arroz-integral", label: "Arroz integral", emoji: "🍚", foto: "/recorrido/nutricion/alimentos/arroces.png" },
      { key: "pan-integral", label: "Pan integral", emoji: "🍞", foto: "/recorrido/nutricion/alimentos/pan.png" },
      { key: "pasta-integral", label: "Pasta integral", emoji: "🍝", foto: "/recorrido/nutricion/alimentos/pasta.png" },
      { key: "maiz", label: "Maíz", emoji: "🌽" },
    ],
  },
  {
    key: "proteina",
    label: "Proteína saludable",
    labelCorto: "Proteína",
    color: "#d75f5a",
    proporcion: 25,
    descripcion:
      "Proteína saludable: legumbres, pescado, huevo o aves. Cuanto menos procesada, mejor.",
    alimentos: [
      { key: "huevo", label: "Huevo", emoji: "🥚", foto: "/recorrido/nutricion/alimentos/huevo.png" },
      { key: "pescado", label: "Pescado", emoji: "🐟", foto: "/recorrido/nutricion/alimentos/atun.png" },
      { key: "pollo", label: "Pollo", emoji: "🍗", foto: "/recorrido/nutricion/alimentos/pollo.png" },
      { key: "legumbres", label: "Legumbres", emoji: "🫘", foto: "/recorrido/nutricion/alimentos/garbanzos.png" },
      { key: "frutos-secos", label: "Frutos secos", emoji: "🥜", foto: "/recorrido/nutricion/alimentos/frutossecos.png" },
      { key: "marisco", label: "Marisco", emoji: "🦐" },
    ],
  },
];

// Alimentos «trampa» (ultraprocesados) que NO forman parte del plato de Harvard.
// Se muestran aparte para que el usuario aprenda a dejarlos fuera del plato.
export const PLATO_FUERA: PlatoAlimento[] = [
  { key: "refresco", label: "Refresco", emoji: "🥤" },
  { key: "bolleria", label: "Bollería", emoji: "🧁" },
  { key: "patatas-fritas", label: "Patatas fritas", emoji: "🍟" },
  { key: "pizza", label: "Pizza", emoji: "🍕" },
];

export const platoMacroByKey = (key: string): PlatoMacro | undefined =>
  PLATO_MACROS.find((m) => m.key === key);
