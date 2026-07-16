// ─────────────────────────────────────────────────────────────────────────
// BIBLIOTECA DE ALIMENTOS de Nutrición (/metodo/nutricion/alimentos).
// Eliges un alimento y lo ves «desmontarse» en las moléculas que lo forman.
// Cada molécula lleva una FUNCIÓN (lo que hace en tu cuerpo), reforzando la tesis
// de la disciplina: ningún alimento es bueno o malo, pero sus moléculas sí.
//
// Cómo ampliar: añade moléculas a MOLECULAS y alimentos a ALIMENTOS. Las
// moléculas se comparten entre alimentos (una misma clave se reutiliza), lo que
// además deja listo el enlace bidireccional alimento ↔ molécula.
// ─────────────────────────────────────────────────────────────────────────

// ── Función de una molécula en el cuerpo (etiqueta de color) ────────────────
export type FuncionMolecula = "constructora" | "combustible" | "protectora" | "danina";

export const FUNCIONES: Record<FuncionMolecula, { label: string; color: string }> = {
  constructora: { label: "Constructora", color: "#3f8f6b" },      // verde · te construye
  combustible:  { label: "Combustible",  color: "#e0902e" },      // ámbar · te da energía
  protectora:   { label: "Protectora",   color: "#4a90c2" },      // azul · te protege
  danina:       { label: "Dañina en exceso", color: "#c0504d" },  // rojo · en exceso, te daña
};

// ── Grupo (tipo) de la molécula, para agrupar las tarjetas en el detalle ────
export type GrupoMolecula =
  | "proteina" | "grasa" | "carbohidrato" | "vitamina" | "mineral" | "fitoquimico" | "otro";

export const GRUPO_MOLECULA_LABEL: Record<GrupoMolecula, string> = {
  proteina: "Proteínas",
  grasa: "Grasas",
  carbohidrato: "Carbohidratos",
  vitamina: "Vitaminas",
  mineral: "Minerales",
  fitoquimico: "Protectores vegetales",
  otro: "Otros",
};
// Orden en el que se muestran los grupos de moléculas en el detalle.
export const ORDEN_GRUPOS_MOLECULA: GrupoMolecula[] = [
  "carbohidrato", "proteina", "grasa", "vitamina", "mineral", "fitoquimico", "otro",
];

export interface Molecula {
  key: string;
  nombre: string;
  grupo: GrupoMolecula;
  funcion: FuncionMolecula;
  /** Qué hace en el cuerpo (se muestra al tocar la molécula). */
  queHace: string;
}

// Diccionario de moléculas, reutilizadas por muchos alimentos.
export const MOLECULAS: Record<string, Molecula> = {
  // Carbohidratos
  glucosa:        { key: "glucosa", nombre: "Glucosa", grupo: "carbohidrato", funcion: "combustible", queHace: "Azúcar simple: el combustible directo de tus células, sobre todo el cerebro y los músculos." },
  fructosa:       { key: "fructosa", nombre: "Fructosa", grupo: "carbohidrato", funcion: "combustible", queHace: "El azúcar de la fruta; lo procesa el hígado. Acompañado de fibra es amable; aislado y en exceso, lo sobrecarga." },
  sacarosa:       { key: "sacarosa", nombre: "Sacarosa", grupo: "carbohidrato", funcion: "combustible", queHace: "El azúcar de mesa (glucosa + fructosa). Energía rápida, con pico y bajada." },
  lactosa:        { key: "lactosa", nombre: "Lactosa", grupo: "carbohidrato", funcion: "combustible", queHace: "El azúcar de la leche (glucosa + galactosa). Algunas personas dejan de digerirla de adultas." },
  almidon:        { key: "almidon", nombre: "Almidón", grupo: "carbohidrato", funcion: "combustible", queHace: "Cadenas largas de glucosa: energía más lenta y sostenida que el azúcar." },
  fibra:          { key: "fibra", nombre: "Fibra", grupo: "carbohidrato", funcion: "protectora", queHace: "No la digieres tú, sino tu microbiota. Ralentiza la absorción del azúcar y cuida el intestino." },
  pectina:        { key: "pectina", nombre: "Pectina", grupo: "carbohidrato", funcion: "protectora", queHace: "Una fibra soluble de la fruta: forma gel, sacia y alimenta a tus bacterias." },
  "azucar-anadido": { key: "azucar-anadido", nombre: "Azúcar añadido", grupo: "carbohidrato", funcion: "danina", queHace: "Azúcar libre añadido a los ultraprocesados: picos de glucosa sin apenas nutrientes ni fibra." },
  // Proteínas
  proteina:       { key: "proteina", nombre: "Proteína", grupo: "proteina", funcion: "constructora", queHace: "Cadenas de aminoácidos: el material con el que reconstruyes músculo, enzimas y defensas." },
  "aminoacidos-esenciales": { key: "aminoacidos-esenciales", nombre: "Aminoácidos esenciales", grupo: "proteina", funcion: "constructora", queHace: "Los ladrillos que tu cuerpo no sabe fabricar y debes comer; sin ellos no puedes reconstruirte." },
  // Grasas
  omega3:         { key: "omega3", nombre: "Omega-3", grupo: "grasa", funcion: "protectora", queHace: "Grasa insaturada antiinflamatoria; cuida el cerebro y el corazón." },
  "grasa-monoinsaturada": { key: "grasa-monoinsaturada", nombre: "Grasa monoinsaturada", grupo: "grasa", funcion: "protectora", queHace: "Grasa estable y cardiosaludable, como la del aceite de oliva y el aguacate." },
  "grasa-saturada": { key: "grasa-saturada", nombre: "Grasa saturada", grupo: "grasa", funcion: "combustible", queHace: "Fuente de energía y estructura; en exceso puede subir el colesterol que se acumula en las arterias." },
  "grasa-trans":  { key: "grasa-trans", nombre: "Grasa trans", grupo: "grasa", funcion: "danina", queHace: "Grasa artificial de muchos ultraprocesados; daña las arterias. Cuanta menos, mejor." },
  colesterol:     { key: "colesterol", nombre: "Colesterol", grupo: "grasa", funcion: "constructora", queHace: "Material para las membranas y para hormonas; tu cuerpo fabrica la mayor parte." },
  // Vitaminas
  "vitamina-c":   { key: "vitamina-c", nombre: "Vitamina C", grupo: "vitamina", funcion: "protectora", queHace: "Antioxidante; necesaria para fabricar colágeno y para tus defensas." },
  "vitamina-a":   { key: "vitamina-a", nombre: "Vitamina A", grupo: "vitamina", funcion: "protectora", queHace: "Clave para la vista, la piel y el sistema inmune." },
  "vitamina-e":   { key: "vitamina-e", nombre: "Vitamina E", grupo: "vitamina", funcion: "protectora", queHace: "Antioxidante que protege las grasas de tus membranas del daño oxidativo." },
  "vitamina-b12": { key: "vitamina-b12", nombre: "Vitamina B12", grupo: "vitamina", funcion: "constructora", queHace: "Imprescindible para fabricar sangre y para los nervios; sobre todo en alimentos animales." },
  "vitamina-d":   { key: "vitamina-d", nombre: "Vitamina D", grupo: "vitamina", funcion: "constructora", queHace: "Regula el calcio y el hueso; en realidad actúa como una hormona." },
  folato:         { key: "folato", nombre: "Folato (B9)", grupo: "vitamina", funcion: "constructora", queHace: "Necesario para fabricar ADN y células nuevas; abunda en las hojas verdes." },
  // Minerales
  hierro:         { key: "hierro", nombre: "Hierro", grupo: "mineral", funcion: "constructora", queHace: "Forma la hemoglobina que transporta el oxígeno; sin él, aparece el cansancio." },
  calcio:         { key: "calcio", nombre: "Calcio", grupo: "mineral", funcion: "constructora", queHace: "Construye huesos y dientes; también mueve músculos y nervios." },
  potasio:        { key: "potasio", nombre: "Potasio", grupo: "mineral", funcion: "protectora", queHace: "Equilibra el sodio y ayuda a regular la tensión arterial." },
  magnesio:       { key: "magnesio", nombre: "Magnesio", grupo: "mineral", funcion: "protectora", queHace: "Participa en cientos de reacciones: energía, músculo y descanso." },
  // Fitoquímicos
  quercetina:     { key: "quercetina", nombre: "Quercetina", grupo: "fitoquimico", funcion: "protectora", queHace: "Un polifenol antioxidante y antiinflamatorio de frutas y verduras." },
  polifenoles:    { key: "polifenoles", nombre: "Polifenoles", grupo: "fitoquimico", funcion: "protectora", queHace: "Familia de antioxidantes vegetales que protegen tus células del desgaste." },
  teobromina:     { key: "teobromina", nombre: "Teobromina", grupo: "fitoquimico", funcion: "protectora", queHace: "El estimulante suave del cacao, primo de la cafeína; también es antioxidante." },
  // Otros
  cafeina:        { key: "cafeina", nombre: "Cafeína", grupo: "otro", funcion: "protectora", queHace: "Estimulante del café: mejora el estado de alerta y aporta antioxidantes. En exceso, nerviosismo e insomnio." },
  agua:           { key: "agua", nombre: "Agua", grupo: "otro", funcion: "protectora", queHace: "El medio donde ocurre todo; los alimentos frescos son, sobre todo, agua." },
};

// ── Grupos de alimentos (pestañas del hub) ──────────────────────────────────
export type GrupoAlimento =
  | "fruta" | "verdura" | "legumbre" | "proteina" | "cereal"
  | "grasa" | "frutos-secos" | "lacteo" | "otros" | "ultraprocesado";

export const GRUPOS_ALIMENTOS: { key: GrupoAlimento; label: string }[] = [
  { key: "fruta", label: "Fruta" },
  { key: "verdura", label: "Verdura" },
  { key: "legumbre", label: "Legumbres" },
  { key: "proteina", label: "Proteína animal" },
  { key: "cereal", label: "Cereales" },
  { key: "grasa", label: "Grasas" },
  { key: "frutos-secos", label: "Frutos secos" },
  { key: "lacteo", label: "Lácteos" },
  { key: "otros", label: "Otros" },
  { key: "ultraprocesado", label: "Ultraprocesados" },
];

// Colores y etiquetas de la barra de macros («de qué está hecho»).
export const MACRO_COLOR = { carbohidrato: "#6f9fd8", proteina: "#c0705f", grasa: "#e0b23e" } as const;
export const MACRO_LABEL = { carbohidrato: "Carbohidrato", proteina: "Proteína", grasa: "Grasa" } as const;

export interface Alimento {
  key: string;
  nombre: string;
  grupo: GrupoAlimento;
  /** Emoji provisional (mientras no haya foto). */
  emoji?: string;
  /** Foto del alimento (opcional). */
  foto?: string;
  /** Frase corta para la tarjeta y el detalle. */
  resumen: string;
  /** Reparto aproximado de macros (%). No tiene que ser exacto: es didáctico. */
  macros: { carbohidrato: number; proteina: number; grasa: number };
  /** Moléculas que lo componen (claves de MOLECULAS). */
  moleculas: string[];
}

// Alimentos elegidos por María. Composición molecular = primera pasada (afinar).
export const ALIMENTOS: Alimento[] = [
  // ── Fruta ──
  { key: "manzana", nombre: "Manzana", grupo: "fruta", emoji: "🍎", resumen: "Azúcares con fibra y antioxidantes.",
    macros: { carbohidrato: 95, proteina: 2, grasa: 3 },
    moleculas: ["fructosa", "glucosa", "pectina", "fibra", "vitamina-c", "quercetina", "agua"] },
  { key: "platano", nombre: "Plátano", grupo: "fruta", emoji: "🍌", resumen: "Energía y potasio.",
    macros: { carbohidrato: 93, proteina: 4, grasa: 3 },
    moleculas: ["glucosa", "fructosa", "almidon", "fibra", "potasio", "vitamina-c", "agua"] },
  { key: "naranja", nombre: "Naranja", grupo: "fruta", emoji: "🍊", resumen: "Vitamina C y fibra, con su pulpa entera.",
    macros: { carbohidrato: 92, proteina: 5, grasa: 3 },
    moleculas: ["fructosa", "glucosa", "sacarosa", "fibra", "pectina", "vitamina-c", "folato", "potasio", "polifenoles", "agua"] },
  { key: "zumo-naranja", nombre: "Zumo de naranja", grupo: "fruta", emoji: "🧃", resumen: "La misma fruta sin fibra: azúcar libre que llega de golpe.",
    macros: { carbohidrato: 95, proteina: 3, grasa: 2 },
    moleculas: ["fructosa", "glucosa", "sacarosa", "vitamina-c", "folato", "potasio", "agua"] },

  // ── Verdura ──
  { key: "brocoli", nombre: "Brócoli", grupo: "verdura", emoji: "🥦", resumen: "Fibra, vitamina C y protectores.",
    macros: { carbohidrato: 55, proteina: 35, grasa: 10 },
    moleculas: ["fibra", "vitamina-c", "folato", "potasio", "polifenoles", "agua"] },

  // ── Legumbres ──
  { key: "soja", nombre: "Soja", grupo: "legumbre", emoji: "🫛", resumen: "Proteína vegetal completa.",
    macros: { carbohidrato: 30, proteina: 40, grasa: 30 },
    moleculas: ["proteina", "aminoacidos-esenciales", "fibra", "grasa-monoinsaturada", "hierro", "calcio", "folato"] },
  { key: "garbanzos", nombre: "Garbanzos", grupo: "legumbre", emoji: "🫘", resumen: "Proteína vegetal con fibra y hierro.",
    macros: { carbohidrato: 60, proteina: 25, grasa: 15 },
    moleculas: ["proteina", "almidon", "fibra", "hierro", "folato", "magnesio"] },

  // ── Proteína animal ──
  { key: "pollo", nombre: "Pollo", grupo: "proteina", emoji: "🍗", resumen: "Proteína magra.",
    macros: { carbohidrato: 0, proteina: 75, grasa: 25 },
    moleculas: ["proteina", "aminoacidos-esenciales", "vitamina-b12"] },
  { key: "vaca", nombre: "Carne de vaca", grupo: "proteina", emoji: "🥩", resumen: "Proteína, hierro y B12; más grasa saturada.",
    macros: { carbohidrato: 0, proteina: 55, grasa: 45 },
    moleculas: ["proteina", "aminoacidos-esenciales", "grasa-saturada", "hierro", "vitamina-b12"] },
  { key: "cerdo", nombre: "Cerdo", grupo: "proteina", emoji: "🥓", resumen: "Proteína con más o menos grasa según el corte.",
    macros: { carbohidrato: 0, proteina: 50, grasa: 50 },
    moleculas: ["proteina", "aminoacidos-esenciales", "grasa-saturada", "vitamina-b12"] },
  { key: "huevo", nombre: "Huevo", grupo: "proteina", emoji: "🥚", resumen: "La proteína completa de referencia.",
    macros: { carbohidrato: 3, proteina: 34, grasa: 63 },
    moleculas: ["proteina", "aminoacidos-esenciales", "grasa-saturada", "colesterol", "vitamina-b12", "vitamina-d"] },
  { key: "atun", nombre: "Atún", grupo: "proteina", emoji: "🐟", resumen: "Proteína magra y omega-3.",
    macros: { carbohidrato: 0, proteina: 78, grasa: 22 },
    moleculas: ["proteina", "aminoacidos-esenciales", "omega3", "vitamina-d", "vitamina-b12"] },

  // ── Cereales ──
  { key: "arroz-blanco", nombre: "Arroz blanco", grupo: "cereal", emoji: "🍚", resumen: "Energía rápida: se le quitó el salvado.",
    macros: { carbohidrato: 89, proteina: 8, grasa: 3 },
    moleculas: ["almidon", "glucosa", "proteina"] },
  { key: "arroz-integral", nombre: "Arroz integral", grupo: "cereal", emoji: "🍚", resumen: "Conserva el salvado: más fibra y minerales.",
    macros: { carbohidrato: 82, proteina: 9, grasa: 9 },
    moleculas: ["almidon", "fibra", "proteina", "magnesio"] },
  { key: "pan", nombre: "Pan", grupo: "cereal", emoji: "🍞", resumen: "Depende mucho de si es integral o blanco.",
    macros: { carbohidrato: 75, proteina: 13, grasa: 12 },
    moleculas: ["almidon", "proteina", "fibra"] },

  // ── Grasas ──
  { key: "aguacate", nombre: "Aguacate", grupo: "grasa", emoji: "🥑", resumen: "Grasa buena y fibra.",
    macros: { carbohidrato: 18, proteina: 5, grasa: 77 },
    moleculas: ["grasa-monoinsaturada", "fibra", "potasio", "vitamina-e", "magnesio"] },
  { key: "aceite-oliva", nombre: "Aceite de oliva", grupo: "grasa", emoji: "🫒", resumen: "Grasa cardiosaludable (virgen extra).",
    macros: { carbohidrato: 0, proteina: 0, grasa: 100 },
    moleculas: ["grasa-monoinsaturada", "polifenoles", "vitamina-e"] },

  // ── Frutos secos ──
  { key: "nueces", nombre: "Nueces", grupo: "frutos-secos", emoji: "🌰", resumen: "Grasa buena y omega-3 vegetal.",
    macros: { carbohidrato: 14, proteina: 15, grasa: 71 },
    moleculas: ["omega3", "grasa-monoinsaturada", "proteina", "fibra", "magnesio", "polifenoles"] },
  { key: "cacahuetes", nombre: "Cacahuetes", grupo: "frutos-secos", emoji: "🥜", resumen: "Técnicamente una legumbre; proteína y grasa.",
    macros: { carbohidrato: 16, proteina: 24, grasa: 60 },
    moleculas: ["proteina", "grasa-monoinsaturada", "fibra", "magnesio", "folato"] },

  // ── Lácteos ──
  { key: "queso", nombre: "Queso", grupo: "lacteo", emoji: "🧀", resumen: "Proteína y calcio, con grasa saturada.",
    macros: { carbohidrato: 5, proteina: 35, grasa: 60 },
    moleculas: ["proteina", "calcio", "grasa-saturada", "vitamina-b12"] },

  // ── Otros ──
  { key: "chocolate-negro", nombre: "Chocolate negro", grupo: "otros", emoji: "🍫", resumen: "Cuanto más puro, más cacao y menos azúcar.",
    macros: { carbohidrato: 45, proteina: 8, grasa: 47 },
    moleculas: ["teobromina", "polifenoles", "grasa-saturada", "fibra", "hierro", "magnesio"] },
  { key: "cafe", nombre: "Café", grupo: "otros", emoji: "☕", resumen: "Casi solo agua, cafeína y antioxidantes.",
    macros: { carbohidrato: 0, proteina: 0, grasa: 0 },
    moleculas: ["cafeina", "polifenoles", "agua"] },
  { key: "miel", nombre: "Miel", grupo: "otros", emoji: "🍯", resumen: "Natural, sí, pero sigue siendo azúcar.",
    macros: { carbohidrato: 100, proteina: 0, grasa: 0 },
    moleculas: ["fructosa", "glucosa", "sacarosa", "polifenoles", "agua"] },

  // ── Ultraprocesados ──
  { key: "nutella", nombre: "Nutella", grupo: "ultraprocesado", emoji: "🍫", resumen: "Sobre todo azúcar y grasa; poca avellana.",
    macros: { carbohidrato: 57, proteina: 6, grasa: 37 },
    moleculas: ["azucar-anadido", "sacarosa", "grasa-saturada", "grasa-monoinsaturada"] },
  { key: "oreo", nombre: "Oreo", grupo: "ultraprocesado", emoji: "🍪", resumen: "Energía vacía: azúcar, harina refinada y grasa.",
    macros: { carbohidrato: 63, proteina: 4, grasa: 33 },
    moleculas: ["azucar-anadido", "sacarosa", "almidon", "grasa-saturada"] },
];

export const alimentoByKey = (k: string): Alimento | undefined => ALIMENTOS.find((a) => a.key === k);
