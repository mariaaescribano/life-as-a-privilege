// ── Datos de la Página 1 del recorrido de Nutrición: los 6 grupos de nutrientes.
// Cada uno con sus tipos, qué hacen en el cuerpo y dónde encontrarlo.

export interface NutrienteTipo {
  nombre: string;
  desc: string;
}

export interface Nutriente {
  key: string;
  label: string;
  emoji: string;
  color: string;
  resumen: string;
  tipos: NutrienteTipo[];
  queHacen: string[];
  donde: string[];
}

export const NUTRIENTES: Nutriente[] = [
  {
    key: "carbohidratos",
    label: "Carbohidratos",
    emoji: "🌾",
    color: "#e0a92e",
    resumen: "Tu principal fuente de energía.",
    tipos: [
      { nombre: "Simples (azúcares)", desc: "Glucosa, fructosa, sacarosa. Energía rápida, pico y bajada." },
      { nombre: "Complejos (almidón)", desc: "Cadenas largas de glucosa. Energía lenta y sostenida." },
    ],
    queHacen: [
      "Son el combustible preferido del cuerpo: se rompen en glucosa.",
      "La glucosa alimenta sobre todo al cerebro y a los músculos.",
      "El exceso se guarda como glucógeno (hígado y músculo) o como grasa.",
    ],
    donde: ["Avena", "Arroz y pan integral", "Legumbres", "Fruta", "Patata y boniato"],
  },
  {
    key: "grasas",
    label: "Grasas",
    emoji: "🥑",
    color: "#e58a3c",
    resumen: "Energía densa y ladrillos de tus membranas.",
    tipos: [
      { nombre: "Insaturadas", desc: "Mono y poliinsaturadas (omega-3, omega-6). Las más beneficiosas." },
      { nombre: "Saturadas", desc: "En carnes y lácteos. Con moderación." },
      { nombre: "Trans", desc: "Industriales (ultraprocesados). Las que conviene evitar." },
    ],
    queHacen: [
      "Reserva de energía más concentrada que tiene el cuerpo.",
      "Forman las membranas de todas tus células.",
      "Transportan las vitaminas A, D, E y K, y son base de muchas hormonas.",
    ],
    donde: ["Aceite de oliva", "Aguacate", "Frutos secos y semillas", "Pescado azul", "Huevo"],
  },
  {
    key: "proteinas",
    label: "Proteínas",
    emoji: "🥚",
    color: "#d75f5a",
    resumen: "El material con el que te reconstruyes.",
    tipos: [
      { nombre: "Completas", desc: "De origen animal: aportan todos los aminoácidos esenciales." },
      { nombre: "Incompletas", desc: "De origen vegetal: se combinan (legumbre + cereal) para completarlas." },
    ],
    queHacen: [
      "Se descomponen en aminoácidos, los ladrillos del cuerpo.",
      "Construyen y reparan músculo, piel, pelo y órganos.",
      "Forman enzimas, anticuerpos y muchas hormonas.",
    ],
    donde: ["Huevo", "Pescado y carne", "Lácteos", "Legumbres y tofu", "Frutos secos"],
  },
  {
    key: "vitaminas",
    label: "Vitaminas",
    emoji: "🍊",
    color: "#e8b52e",
    resumen: "Reguladoras: sin ellas nada funciona.",
    tipos: [
      { nombre: "Hidrosolubles", desc: "Vitamina C y grupo B. No se almacenan: hay que reponerlas a diario." },
      { nombre: "Liposolubles", desc: "A, D, E y K. Se guardan en la grasa del cuerpo." },
    ],
    queHacen: [
      "No dan energía, pero permiten que las reacciones del cuerpo ocurran.",
      "Intervienen en la visión, las defensas, la coagulación y la energía celular.",
      "La vitamina D se fabrica en la piel con la luz del sol.",
    ],
    donde: ["Fruta y verdura", "Verduras de hoja verde", "Huevo e hígado", "Sol (vitamina D)", "Cereales integrales"],
  },
  {
    key: "minerales",
    label: "Minerales",
    emoji: "🧂",
    color: "#6f93b8",
    resumen: "Estructura, transporte y equilibrio.",
    tipos: [
      { nombre: "Macrominerales", desc: "Calcio, fósforo, magnesio, potasio, sodio. En cantidades mayores." },
      { nombre: "Oligoelementos", desc: "Hierro, zinc, yodo, selenio. En cantidades diminutas, pero esenciales." },
    ],
    queHacen: [
      "Dan estructura a huesos y dientes (calcio, fósforo).",
      "El hierro transporta el oxígeno en la sangre.",
      "Permiten el impulso nervioso, la contracción muscular y el equilibrio de líquidos.",
    ],
    donde: ["Lácteos", "Verduras de hoja", "Legumbres", "Marisco y pescado", "Frutos secos"],
  },
  {
    key: "fibra",
    label: "Fibra",
    emoji: "🥬",
    color: "#6fa86b",
    resumen: "No se absorbe, pero lo ordena todo.",
    tipos: [
      { nombre: "Soluble", desc: "Forma un gel: regula el azúcar y el colesterol, y alimenta a la microbiota." },
      { nombre: "Insoluble", desc: "Da volumen y acelera el tránsito intestinal." },
    ],
    queHacen: [
      "No se digiere ni se absorbe como el resto de nutrientes.",
      "Regula la digestión y prolonga la sensación de saciedad.",
      "Es el alimento de las bacterias buenas de tu intestino.",
    ],
    donde: ["Verduras", "Fruta con piel", "Legumbres", "Avena", "Cereales integrales"],
  },
];
