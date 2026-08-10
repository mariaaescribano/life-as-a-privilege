// ─────────────────────────────────────────────────────────────────────────
// CUENTA LOS MACROS · datos del juego de /metodo/nutricion/macros
//
// Por cada alimento: su RACIÓN NORMAL (lo que de verdad se pone en el plato, no
// 100 g de aceite ni 100 g de lechuga) y los gramos de proteína, hidratos y
// grasa que lleva esa ración, más sus kcal.
//
// OJO con la diferencia respecto a AlimentosNutricion.ts: allí `macros` es el
// REPARTO en porcentaje (la manzana es 95 % hidratos), que sirve para explicar
// «de qué está hecho» pero NO para contar. Aquí van GRAMOS, que es lo que se
// suma y lo que se aprende a estimar.
//
// Los números son valores de tabla redondeados (BEDCA / USDA) y didácticos: dos
// manzanas nunca son iguales. Lo que se entrena es el ORDEN DE MAGNITUD —«un
// huevo son seis gramos de proteína, no veinte»—, no la cifra exacta.
//
// `sorpresa` es lo que se revela al comprobar: el porqué que hace que el dato se
// quede. Es el corazón didáctico del juego; sin ella esto sería un test.
// ─────────────────────────────────────────────────────────────────────────

const F = "/recorrido/nutricion/alimentos";

export type GrupoMacro =
  | "fruta" | "verdura" | "legumbre" | "proteina" | "cereal"
  | "grasa" | "frutos-secos" | "lacteo" | "otros";

export const GRUPOS_MACRO: Record<GrupoMacro, { label: string; color: string }> = {
  fruta:          { label: "Fruta",           color: "#d98a3d" },
  verdura:        { label: "Verdura",         color: "#4c8f52" },
  legumbre:       { label: "Legumbres",       color: "#a87b3c" },
  proteina:       { label: "Proteína animal", color: "#b1584f" },
  cereal:         { label: "Cereales",        color: "#c99a4e" },
  grasa:          { label: "Grasas",          color: "#7d9a3c" },
  "frutos-secos": { label: "Frutos secos",    color: "#8a6a42" },
  lacteo:         { label: "Lácteos",         color: "#6b8fa8" },
  otros:          { label: "Otros",           color: "#8a7f9a" },
};

export interface AlimentoMacros {
  key: string;
  nombre: string;
  grupo: GrupoMacro;
  emoji: string;
  foto: string;
  /** La ración de la que hablamos, escrita como se dice: «1 huevo (60 g)». */
  racion: string;
  /** Gramos de cada macro EN ESA RACIÓN. */
  proteina: number;
  hidratos: number;
  grasa: number;
  kcal: number;
  /** El porqué que se revela al comprobar. Lo que hace que el dato se recuerde. */
  sorpresa: string;
}

export const ALIMENTOS_MACROS: AlimentoMacros[] = [
  // ── Fruta ────────────────────────────────────────────────────────────────
  {
    key: "manzana", nombre: "Manzana", grupo: "fruta", emoji: "🍎", foto: `${F}/manzana.webp`,
    racion: "1 mediana (180 g)", proteina: 0.5, hidratos: 25, grasa: 0.3, kcal: 95,
    sorpresa: "Casi todo hidratos, y aun así su azúcar entra despacio: los 4 g de fibra y el agua lo frenan. La fruta entera no es «azúcar»: es azúcar con freno de mano.",
  },
  {
    key: "platano", nombre: "Plátano", grupo: "fruta", emoji: "🍌", foto: `${F}/platano.webp`,
    racion: "1 mediano (120 g)", proteina: 1.3, hidratos: 27, grasa: 0.4, kcal: 105,
    sorpresa: "El plátano tiene fama de «engordar» y son 105 kcal: menos que un puñado de nueces. Lo que cambia es cuándo lo comes y qué desplaza.",
  },
  {
    key: "naranja", nombre: "Naranja", grupo: "fruta", emoji: "🍊", foto: `${F}/naranja.webp`,
    racion: "1 mediana (150 g)", proteina: 1.2, hidratos: 15, grasa: 0.2, kcal: 70,
    sorpresa: "Una sola naranja cubre toda tu vitamina C del día. Y fíjate en el número de hidratos: la mitad que una manzana.",
  },
  {
    key: "zumo", nombre: "Zumo de naranja", grupo: "fruta", emoji: "🧃", foto: `${F}/zumo.webp`,
    racion: "1 vaso (250 ml)", proteina: 1.7, hidratos: 26, grasa: 0.5, kcal: 112,
    sorpresa: "Aquí está la trampa del juego: son tres naranjas exprimidas, casi el doble de hidratos que una… y sin la fibra que las frenaba. El mismo azúcar, sin freno y en dos tragos.",
  },

  // ── Verdura ──────────────────────────────────────────────────────────────
  {
    key: "brocoli", nombre: "Brócoli", grupo: "verdura", emoji: "🥦", foto: `${F}/brocoli.webp`,
    racion: "1 plato (200 g)", proteina: 5.6, hidratos: 14, grasa: 0.7, kcal: 68,
    sorpresa: "Casi 6 g de proteína por 68 kcal: el brócoli tiene más proteína por caloría que muchas carnes. No basta para cubrirte el día, pero suma más de lo que nadie cree.",
  },
  {
    key: "espinaca", nombre: "Espinacas", grupo: "verdura", emoji: "🥬", foto: `${F}/espinaca.webp`,
    racion: "1 plato cocido (200 g)", proteina: 5.8, hidratos: 7, grasa: 0.8, kcal: 46,
    sorpresa: "Un plato entero por 46 kcal. Este es el alimento que mejor enseña que «volumen» y «calorías» son cosas distintas: llena el plato sin llenar la cuenta.",
  },
  {
    key: "zanahoria", nombre: "Zanahoria", grupo: "verdura", emoji: "🥕", foto: `${F}/zanahoria.webp`,
    racion: "2 medianas (150 g)", proteina: 1.4, hidratos: 14, grasa: 0.3, kcal: 61,
    sorpresa: "La verdura más dulce del plato, y aun así los mismos hidratos que media manzana. Su vitamina A se absorbe mucho mejor si la acompañas de una grasa.",
  },
  {
    key: "tomate", nombre: "Tomate", grupo: "verdura", emoji: "🍅", foto: `${F}/tomate.webp`,
    racion: "1 grande (180 g)", proteina: 1.6, hidratos: 7, grasa: 0.4, kcal: 32,
    sorpresa: "El 94 % es agua. Su licopeno, en cambio, se multiplica al cocinarlo: el tomate frito casero protege más que el crudo.",
  },
  {
    key: "pimiento", nombre: "Pimiento rojo", grupo: "verdura", emoji: "🫑", foto: `${F}/pimiento.webp`,
    racion: "1 mediano (150 g)", proteina: 1.5, hidratos: 9, grasa: 0.5, kcal: 47,
    sorpresa: "Tiene el triple de vitamina C que una naranja, y casi nadie lo sabe porque no es ácido. Los macros son casi nada: es un alimento de micronutrientes.",
  },
  {
    key: "calabacin", nombre: "Calabacín", grupo: "verdura", emoji: "🥒", foto: `${F}/calabacin.webp`,
    racion: "1 mediano (200 g)", proteina: 2.4, hidratos: 6, grasa: 0.6, kcal: 34,
    sorpresa: "34 kcal por un calabacín entero. Por eso funciona tan bien como «relleno» del plato cuando quieres comer lo mismo de volumen con la mitad de energía.",
  },
  {
    key: "cebolla", nombre: "Cebolla", grupo: "verdura", emoji: "🧅", foto: `${F}/cebolla.webp`,
    racion: "1 mediana (150 g)", proteina: 1.7, hidratos: 14, grasa: 0.2, kcal: 60,
    sorpresa: "Más hidratos de los que parece, porque buena parte son fructanos: fibra que tú no digieres pero tu microbiota se come. Alimentas a tus bacterias, no a ti.",
  },
  {
    key: "berenjena", nombre: "Berenjena", grupo: "verdura", emoji: "🍆", foto: `${F}/berenjena.webp`,
    racion: "1/2 mediana (150 g)", proteina: 1.5, hidratos: 9, grasa: 0.3, kcal: 38,
    sorpresa: "0,3 g de grasa… hasta que la fríes. La berenjena es una esponja: frita puede multiplicar por veinte su grasa. El alimento no cambia; la cocina, sí.",
  },
  {
    key: "esparragos", nombre: "Espárragos", grupo: "verdura", emoji: "🌿", foto: `${F}/esparragos.webp`,
    racion: "6 unidades (150 g)", proteina: 3.3, hidratos: 6, grasa: 0.2, kcal: 30,
    sorpresa: "Tres gramos de proteína en una guarnición de 30 kcal. Y su folato es de los más altos del reino vegetal.",
  },

  // ── Legumbres ────────────────────────────────────────────────────────────
  {
    key: "garbanzos", nombre: "Garbanzos", grupo: "legumbre", emoji: "🫘", foto: `${F}/garbanzos.webp`,
    racion: "1 plato cocidos (200 g)", proteina: 18, hidratos: 54, grasa: 5, kcal: 328,
    sorpresa: "El alimento más completo del juego: 18 g de proteína Y 54 de hidratos. Por eso un plato de legumbres es comida entera y no necesita carne al lado.",
  },
  {
    key: "soja", nombre: "Soja", grupo: "legumbre", emoji: "🫛", foto: `${F}/soja.webp`,
    racion: "1 taza cocida (100 g)", proteina: 17, hidratos: 8, grasa: 9, kcal: 173,
    sorpresa: "La única legumbre con proteína completa: tiene los nueve aminoácidos esenciales, como la carne. Y fíjate en la grasa, altísima para ser legumbre.",
  },

  // ── Proteína animal ──────────────────────────────────────────────────────
  {
    key: "pollo", nombre: "Pollo", grupo: "proteina", emoji: "🍗", foto: `${F}/pollo.webp`,
    racion: "1 filete de pechuga (150 g)", proteina: 46, hidratos: 0, grasa: 5, kcal: 240,
    sorpresa: "Cero hidratos: la carne no tiene. Un solo filete es casi la mitad de la proteína que necesitas en todo el día.",
  },
  {
    key: "vaca", nombre: "Carne de vaca", grupo: "proteina", emoji: "🥩", foto: `${F}/vaca.webp`,
    racion: "1 filete (150 g)", proteina: 39, hidratos: 0, grasa: 15, kcal: 290,
    sorpresa: "Casi la misma proteína que el pollo con el triple de grasa, y buena parte saturada. A cambio trae el hierro más fácil de absorber que existe y B12.",
  },
  {
    key: "cerdo", nombre: "Cerdo", grupo: "proteina", emoji: "🥓", foto: `${F}/cerdo.webp`,
    racion: "1 chuleta (150 g)", proteina: 39, hidratos: 0, grasa: 20, kcal: 340,
    sorpresa: "En el cerdo el corte lo cambia todo: un lomo se parece al pollo y una panceta duplica esta grasa. «Cerdo» no es un dato, es una familia.",
  },
  {
    key: "huevo", nombre: "Huevo", grupo: "proteina", emoji: "🥚", foto: `${F}/huevo.webp`,
    racion: "1 unidad (60 g)", proteina: 6.3, hidratos: 0.4, grasa: 5.3, kcal: 78,
    sorpresa: "Solo 6 g: casi todo el mundo dice el doble. Es la proteína de mejor calidad que existe —el patrón con el que se miden las demás—, pero hacen falta tres huevos para igualar un filete pequeño.",
  },
  {
    key: "atun", nombre: "Atún", grupo: "proteina", emoji: "🐟", foto: `${F}/atun.webp`,
    racion: "1 lata al natural (80 g)", proteina: 21, hidratos: 0, grasa: 1, kcal: 95,
    sorpresa: "21 g de proteína por 95 kcal: la ratio más eficiente del juego. Al natural, claro; en aceite la lata suma unos 10 g de grasa más.",
  },

  // ── Cereales ─────────────────────────────────────────────────────────────
  {
    key: "pasta", nombre: "Pasta integral", grupo: "cereal", emoji: "🍝", foto: `${F}/pasta.webp`,
    racion: "1 plato cocida (200 g)", proteina: 10, hidratos: 46, grasa: 1.6, kcal: 250,
    sorpresa: "Cuidado con el dato: 200 g son COCIDOS. En seco serían 70 g, y los mismos 46 g de hidratos. Casi todos los errores al contar vienen de confundir crudo con cocido.",
  },
  {
    key: "arroces", nombre: "Arroz integral", grupo: "cereal", emoji: "🍚", foto: `${F}/arroces.webp`,
    racion: "1 plato cocido (200 g)", proteina: 5.2, hidratos: 46, grasa: 1.8, kcal: 220,
    sorpresa: "Los mismos hidratos que la pasta con la mitad de proteína. Y un truco real: enfriarlo convierte parte de su almidón en almidón resistente, que se porta como fibra.",
  },
  {
    key: "pan", nombre: "Pan", grupo: "cereal", emoji: "🍞", foto: `${F}/pan.webp`,
    racion: "2 rebanadas (60 g)", proteina: 5, hidratos: 30, grasa: 1.2, kcal: 160,
    sorpresa: "Dos rebanadas ya son 30 g de hidratos, lo mismo que un plato de arroz a la mitad. El pan cuenta mucho más de lo que parece porque nunca se pesa.",
  },

  // ── Grasas ───────────────────────────────────────────────────────────────
  {
    key: "aguacate", nombre: "Aguacate", grupo: "grasa", emoji: "🥑", foto: `${F}/aguacate.webp`,
    racion: "1/2 unidad (100 g)", proteina: 2, hidratos: 9, grasa: 15, kcal: 160,
    sorpresa: "La única fruta que es sobre todo grasa. De esos 9 g de hidratos, 7 son fibra: por eso llena tanto para lo poco que sube el azúcar.",
  },
  {
    key: "aceite", nombre: "Aceite de oliva", grupo: "grasa", emoji: "🫒", foto: `${F}/aceite.webp`,
    racion: "1 cucharada (10 g)", proteina: 0, hidratos: 0, grasa: 10, kcal: 90,
    sorpresa: "Grasa pura: 100 %. Es el alimento más denso del juego y el que más se subestima, porque cae en el plato sin que nadie lo cuente. Tres cucharadas son 270 kcal invisibles.",
  },
  {
    key: "aceitesvegetales", nombre: "Aceite de girasol", grupo: "grasa", emoji: "🌻", foto: `${F}/aceitesvegetales.webp`,
    racion: "1 cucharada (10 g)", proteina: 0, hidratos: 0, grasa: 10, kcal: 90,
    sorpresa: "Idéntico al de oliva en macros y en calorías: los mismos 10 g. Lo que cambia no se ve aquí, sino en el TIPO de grasa y en su resistencia al calor.",
  },

  // ── Frutos secos ─────────────────────────────────────────────────────────
  {
    key: "nueces", nombre: "Nueces", grupo: "frutos-secos", emoji: "🌰", foto: `${F}/nueces.webp`,
    racion: "1 puñado (30 g)", proteina: 4.5, hidratos: 4, grasa: 20, kcal: 200,
    sorpresa: "Un puñado tiene más calorías que un plátano y más grasa que una cucharada de aceite. Son grasas buenas, pero «bueno» no significa «gratis».",
  },
  {
    key: "cacahuete", nombre: "Cacahuetes", grupo: "frutos-secos", emoji: "🥜", foto: `${F}/cacahuete.webp`,
    racion: "1 puñado (30 g)", proteina: 7.7, hidratos: 5, grasa: 15, kcal: 170,
    sorpresa: "Casi 8 g de proteína, el doble que las nueces: y es que no es un fruto seco, es una legumbre disfrazada.",
  },
  {
    key: "frutossecos", nombre: "Mezcla de frutos secos", grupo: "frutos-secos", emoji: "🥣", foto: `${F}/frutossecos.webp`,
    racion: "1 puñado (30 g)", proteina: 5, hidratos: 6, grasa: 16, kcal: 180,
    sorpresa: "El puñado es la medida honesta: 30 g. El problema nunca es el fruto seco, es el bol grande, del que salen tres o cuatro puñados sin darte cuenta.",
  },

  // ── Lácteos ──────────────────────────────────────────────────────────────
  {
    key: "queso", nombre: "Queso curado", grupo: "lacteo", emoji: "🧀", foto: `${F}/queso.webp`,
    racion: "2 lonchas (30 g)", proteina: 7.5, hidratos: 0.4, grasa: 10, kcal: 120,
    sorpresa: "Dos lonchas llevan más proteína que un huevo… y el doble de grasa. El queso curado es leche a la que le han quitado el agua: todo queda concentrado.",
  },
  {
    key: "leche", nombre: "Leche entera", grupo: "lacteo", emoji: "🥛", foto: `${F}/leche.webp`,
    racion: "1 vaso (250 ml)", proteina: 8, hidratos: 12, grasa: 8, kcal: 160,
    sorpresa: "El único alimento del juego con los tres macros repartidos casi por igual. Tiene sentido: está diseñado para alimentar a una cría entera.",
  },

  // ── Otros ────────────────────────────────────────────────────────────────
  {
    key: "choco", nombre: "Chocolate negro 85 %", grupo: "otros", emoji: "🍫", foto: `${F}/choco.webp`,
    racion: "2 onzas (20 g)", proteina: 2, hidratos: 3, grasa: 9, kcal: 110,
    sorpresa: "El chocolate muy negro es sobre todo GRASA, no azúcar: solo 3 g de hidratos. Con un 50 % de cacao esos 3 se convertirían en 10.",
  },
  {
    key: "miel", nombre: "Miel", grupo: "otros", emoji: "🍯", foto: `${F}/miel.webp`,
    racion: "1 cucharada (20 g)", proteina: 0, hidratos: 16, grasa: 0, kcal: 61,
    sorpresa: "Natural, artesana, de la abeja de tu pueblo: y sigue siendo azúcar. 16 g de hidratos en una cucharada, casi lo mismo que el azúcar de mesa.",
  },
  {
    key: "cafe", nombre: "Café solo", grupo: "otros", emoji: "☕", foto: `${F}/cafe.webp`,
    racion: "1 taza (60 ml)", proteina: 0.3, hidratos: 0, grasa: 0, kcal: 2,
    sorpresa: "Cero. El café no tiene macros: lo que cuenta es lo que le echas dentro. Dos azucarillos y un chorro de leche lo convierten en 60 kcal.",
  },
  {
    key: "tes", nombre: "Té", grupo: "otros", emoji: "🍵", foto: `${F}/tes.webp`,
    racion: "1 taza (250 ml)", proteina: 0, hidratos: 0, grasa: 0, kcal: 2,
    sorpresa: "Tampoco tiene nada, y aun así no es agua: sus polifenoles sí hacen cosas dentro de ti. Que un alimento no tenga macros no significa que no cuente.",
  },
  {
    key: "procesados", nombre: "Galletas", grupo: "otros", emoji: "🍪", foto: `${F}/procesados.webp`,
    racion: "3 galletas (30 g)", proteina: 2, hidratos: 20, grasa: 6, kcal: 140,
    sorpresa: "Tres galletas: 140 kcal, casi lo mismo que un plátano y medio. La diferencia no está en el número, está en que estas no llenan y el plátano sí.",
  },
];

// ── Puntuación ────────────────────────────────────────────────────────────
// Se puntúa por CERCANÍA, no por exactitud: nadie sabe que un huevo tiene 6,3 g
// de proteína, y no es lo que se quiere enseñar. Lo que cuenta es acertar el
// orden de magnitud, así que la tolerancia es proporcional al dato… con un
// mínimo de 2 g, porque si no los alimentos con cifras pequeñas (el aceite, el
// café) serían imposibles y los grandes, regalados.

export type Tino = "clavado" | "cerca" | "lejos";

export const TINO: Record<Tino, { label: string; puntos: number; color: string }> = {
  clavado: { label: "Clavado",  puntos: 100, color: "#2f8f5b" },
  cerca:   { label: "Cerca",    puntos: 50,  color: "#d69a2d" },
  lejos:   { label: "Lejos",    puntos: 0,   color: "#b1584f" },
};

/** Margen que se acepta como «clavado» para un valor real. */
export const margen = (real: number): number => Math.max(2, real * 0.2);

export function tinoDe(estimado: number, real: number): Tino {
  const error = Math.abs(estimado - real);
  const m = margen(real);
  if (error <= m) return "clavado";
  if (error <= m * 2.5) return "cerca";
  return "lejos";
}

/** Los tres tinos de una ronda y sus puntos (máximo 300). */
export function puntuarRonda(
  a: AlimentoMacros,
  est: { proteina: number; hidratos: number; grasa: number },
): { tinos: Record<"proteina" | "hidratos" | "grasa", Tino>; puntos: number } {
  const tinos = {
    proteina: tinoDe(est.proteina, a.proteina),
    hidratos: tinoDe(est.hidratos, a.hidratos),
    grasa: tinoDe(est.grasa, a.grasa),
  };
  const puntos = TINO[tinos.proteina].puntos + TINO[tinos.hidratos].puntos + TINO[tinos.grasa].puntos;
  return { tinos, puntos };
}

/** Rondas de una partida. Diez: suficiente para aprender, corto para repetir. */
export const RONDAS = 10;

/** Tope de cada regulador. Generoso a propósito: si el máximo fuera justo el
 *  valor más alto del juego, la posición del dedo delataría la respuesta. */
export const TOPES = { proteina: 50, hidratos: 70, grasa: 40 } as const;

/** Clave de metodo_nutricion.data donde vive el récord. */
export const MACROS_CAMPO = "macros_juego";

export interface MacrosJuegoData {
  /** Mejor puntuación de una partida completa. */
  mejor?: number;
  /** Partidas terminadas. */
  partidas?: number;
}

/** Baraja una copia del array (Fisher-Yates). */
export function barajar<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Mensaje final según la puntuación (máximo RONDAS × 300). */
export function veredicto(puntos: number): { titulo: string; texto: string } {
  const max = RONDAS * 300;
  const pct = puntos / max;
  if (pct >= 0.85) return {
    titulo: "Tienes el ojo hecho",
    texto: "Ya no necesitas pesar nada: mirar un plato y saber lo que lleva es exactamente la habilidad que querías.",
  };
  if (pct >= 0.6) return {
    titulo: "Vas muy bien",
    texto: "Aciertas el orden de magnitud casi siempre. Repite otra vez fijándote en los que falles: se aprenden por sorpresa, no por repetición.",
  };
  if (pct >= 0.35) return {
    titulo: "Ya estás calculando",
    texto: "Estás empezando a distinguir lo que pesa de lo que abulta. Vuelve a jugar: la segunda vuelta siempre da un salto.",
  };
  return {
    titulo: "Nadie acierta a la primera",
    texto: "Y es justo la gracia: si esto fuera intuitivo, no haría falta aprenderlo. Vuelve a intentarlo y verás cuánto cambia.",
  };
}
