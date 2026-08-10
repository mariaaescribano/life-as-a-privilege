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
// `sorpresa` YA NO SE PINTA: la caja blanca con el porqué se quitó de la página
// (era un texto largo por alimento, y la página se quería juego y nada más). Los
// textos se quedan aquí escritos por si algún día vuelven a algún sitio; no los
// borres al añadir alimentos nuevos, pero tampoco hace falta escribirlos.
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
  /** El porqué del dato. NO se muestra (ver la cabecera del archivo). */
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
  {
    key: "batata", nombre: "Batata", grupo: "verdura", emoji: "🍠", foto: `${F}/batata.webp`,
    racion: "1 mediana asada (200 g)", proteina: 3, hidratos: 40, grasa: 0.2, kcal: 180,
    sorpresa: "Aquí es donde se rompe la idea de «verdura = poco»: una batata lleva casi los mismos hidratos que un plato de arroz. Es la verdura que cuenta como guarnición de cereal, no como acompañamiento libre.",
  },

  // ── Legumbres ────────────────────────────────────────────────────────────
  {
    key: "garbanzos", nombre: "Garbanzos", grupo: "legumbre", emoji: "🫘", foto: `${F}/garbanzos.webp`,
    racion: "1 plato cocidos (200 g)", proteina: 18, hidratos: 54, grasa: 5, kcal: 328,
    sorpresa: "El alimento más completo del juego: 18 g de proteína Y 54 de hidratos. Por eso un plato de legumbres es comida entera y no necesita carne al lado.",
  },
  {
    key: "lentejas", nombre: "Lentejas", grupo: "legumbre", emoji: "🍲", foto: `${F}/lentejas.webp`,
    racion: "1 plato cocidas (200 g)", proteina: 18, hidratos: 40, grasa: 0.8, kcal: 230,
    sorpresa: "La misma proteína que los garbanzos con 100 kcal menos: la diferencia está en la grasa, que aquí es casi cero. Si un plato de lentejas «engorda», es del chorizo, no de la lenteja.",
  },
  {
    key: "soja", nombre: "Soja", grupo: "legumbre", emoji: "🫛", foto: `${F}/soja.webp`,
    racion: "1 taza cocida (100 g)", proteina: 17, hidratos: 8, grasa: 9, kcal: 173,
    sorpresa: "La única legumbre con proteína completa: tiene los nueve aminoácidos esenciales, como la carne. Y fíjate en la grasa, altísima para ser legumbre.",
  },
  {
    key: "tofuseitan", nombre: "Tofu", grupo: "legumbre", emoji: "🥢", foto: `${F}/tofuseitan.webp`,
    racion: "1 bloque (150 g)", proteina: 12, hidratos: 3, grasa: 7, kcal: 130,
    sorpresa: "Menos proteína de la que casi todo el mundo dice: un bloque entero de tofu son dos huevos. El seitán, en cambio, dobla esta cifra —25 g— porque es gluten puro, aunque su proteína está incompleta y necesita una legumbre al lado.",
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
  {
    key: "salmon", nombre: "Salmón", grupo: "proteina", emoji: "🍣", foto: `${F}/salmon.webp`,
    racion: "1 lomo (150 g)", proteina: 31, hidratos: 0, grasa: 20, kcal: 310,
    sorpresa: "Tanta grasa como un filete de cerdo, y aquí es justo lo que buscas: son omega-3. El mismo número puede ser lo mejor o lo peor de un alimento según de qué grasa hablemos; por eso contar solo gramos no basta.",
  },
  {
    key: "gambas", nombre: "Gambas", grupo: "proteina", emoji: "🦐", foto: `${F}/gambas.webp`,
    racion: "8-10 unidades (100 g)", proteina: 20, hidratos: 0, grasa: 1, kcal: 95,
    sorpresa: "Proteína casi pura por 95 kcal. Cargan con la fama del colesterol —lo tienen, sí—, pero el colesterol que comes casi no mueve el de tu sangre: lo mueve la grasa saturada, y aquí no hay.",
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
  {
    key: "avena", nombre: "Avena", grupo: "cereal", emoji: "🥣", foto: `${F}/avena.webp`,
    racion: "1 bol (60 g en seco)", proteina: 8, hidratos: 36, grasa: 4, kcal: 230,
    sorpresa: "Ojo al dato: 60 g en SECO, que en el bol parecen poquísimos y se convierten en un desayuno entero. Y 8 g de proteína: es el cereal que más tiene, casi tanto como dos claras.",
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
  {
    key: "almendras", nombre: "Almendras", grupo: "frutos-secos", emoji: "🌰", foto: `${F}/almendras.webp`,
    racion: "1 puñado (30 g)", proteina: 6.4, hidratos: 6, grasa: 15, kcal: 175,
    sorpresa: "Un puñado de almendras tiene la proteína de un huevo. Y son el fruto seco con más calcio y más vitamina E: el antioxidante que protege precisamente a las grasas que traen.",
  },
  {
    key: "anacardo", nombre: "Anacardos", grupo: "frutos-secos", emoji: "🥜", foto: `${F}/anacardo.webp`,
    racion: "1 puñado (30 g)", proteina: 5.4, hidratos: 9, grasa: 13, kcal: 165,
    sorpresa: "El único fruto seco con hidratos de verdad: el doble que la almendra, y con la fibra más baja del grupo. Por eso está más dulce y por eso es el más fácil de seguir comiendo.",
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
  {
    key: "quesofresco", nombre: "Queso fresco", grupo: "lacteo", emoji: "🧀", foto: `${F}/quesofresco.webp`,
    racion: "1 porción (100 g)", proteina: 11, hidratos: 3, grasa: 11, kcal: 155,
    sorpresa: "Cien gramos de queso fresco tienen la misma grasa que treinta de curado: más de la mitad de lo que te comes es agua. Por eso «fresco» sí significa más ligero… pero por ración, no por peso.",
  },
  {
    key: "yogurgriego", nombre: "Yogur griego", grupo: "lacteo", emoji: "🥄", foto: `${F}/yogurgriego.webp`,
    racion: "1 unidad (125 g)", proteina: 5, hidratos: 5, grasa: 12, kcal: 155,
    sorpresa: "Aquí está la trampa del nombre: el griego de verdad es yogur COLADO y tiene el doble de proteína. El que se vende en España casi siempre es yogur con nata añadida —misma proteína que uno natural y tres veces la grasa—. Si la etiqueta dice «nata», es este.",
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
  {
    key: "oreo", nombre: "Oreo", grupo: "otros", emoji: "🍪", foto: `${F}/oreo.webp`,
    racion: "4 galletas (44 g)", proteina: 1.9, hidratos: 30, grasa: 8.5, kcal: 210,
    sorpresa: "Cuatro galletas y casi nada de proteína: 2 g. Son harina refinada, azúcar y grasa —y la crema blanca del medio es azúcar y grasa otra vez, sin una gota de leche—.",
  },
  {
    key: "nutella", nombre: "Nutella", grupo: "otros", emoji: "🍫", foto: `${F}/nutella.webp`,
    racion: "2 cucharadas (30 g)", proteina: 1.9, hidratos: 17, grasa: 9, kcal: 160,
    sorpresa: "Más de la mitad del bote es azúcar y casi un tercio es aceite: la avellana no llega al 13 % y el cacao ronda el 7 %. Dos cucharadas en una tostada suman más que la tostada.",
  },
  {
    key: "cola", nombre: "Refresco de cola", grupo: "otros", emoji: "🥤", foto: `${F}/cola.webp`,
    racion: "1 lata (330 ml)", proteina: 0, hidratos: 35, grasa: 0, kcal: 140,
    sorpresa: "Una lata son nueve terrones de azúcar, y aquí no hay fibra, ni grasa, ni proteína que frenen nada: llega entero y de golpe. Las mismas calorías que tres galletas, bebidas en dos minutos y sin quitar el hambre.",
  },
  {
    key: "cervezavino", nombre: "Cerveza", grupo: "otros", emoji: "🍺", foto: `${F}/cervezavino.webp`,
    racion: "1 caña (250 ml)", proteina: 1, hidratos: 9, grasa: 0, kcal: 108,
    sorpresa: "Haz la cuenta y no sale: 9 g de hidratos son 36 kcal, pero la caña tiene 108. Las que faltan las pone el ETANOL, que no es ninguno de los tres macros y da 7 kcal por gramo, casi como la grasa. Una copa de vino es lo mismo con menos hidratos aún: 125 kcal casi todas de alcohol.",
  },
];

// ── Tino ──────────────────────────────────────────────────────────────────
// Se valora por CERCANÍA, no por exactitud: nadie sabe que un huevo tiene 6,3 g
// de proteína, y no es lo que se quiere enseñar. Lo que cuenta es acertar el
// orden de magnitud, así que la tolerancia es proporcional al dato… con un
// mínimo de 2 g, porque si no los alimentos con cifras pequeñas (el aceite, el
// café) serían imposibles y los grandes, regalados.
//
// Sin PUNTOS: el juego decía «clavado / cerca / lejos» en cada macro y además
// sumaba puntos, racha y récord. Los puntos se quitaron —convertían en examen lo
// que es un ojímetro— y queda solo el tino de cada macro y la ronda en la que
// vas.

export type Tino = "clavado" | "cerca" | "lejos";

export const TINO: Record<Tino, { label: string; color: string }> = {
  clavado: { label: "Clavado",  color: "#2f8f5b" },
  cerca:   { label: "Cerca",    color: "#d69a2d" },
  lejos:   { label: "Lejos",    color: "#b1584f" },
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

/** El tino de los tres macros de una ronda. */
export function tinosDeRonda(
  a: AlimentoMacros,
  est: { proteina: number; hidratos: number; grasa: number },
): Record<"proteina" | "hidratos" | "grasa", Tino> {
  return {
    proteina: tinoDe(est.proteina, a.proteina),
    hidratos: tinoDe(est.hidratos, a.hidratos),
    grasa: tinoDe(est.grasa, a.grasa),
  };
}

/** Rondas de una partida. Diez: suficiente para aprender, corto para repetir. */
export const RONDAS = 10;

/** Tope de cada regulador. Generoso a propósito: si el máximo fuera justo el
 *  valor más alto del juego, la posición del dedo delataría la respuesta. */
export const TOPES = { proteina: 50, hidratos: 70, grasa: 40 } as const;

// El juego NO guarda nada en metodo_nutricion.data: aquí vivían la clave del
// récord (`macros_juego`) y su tipo, y se fueron con los puntos. Es un juego para
// volver, no un examen que aprobar ni una nota que quede.

/** Baraja una copia del array (Fisher-Yates). */
export function barajar<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Cierre de la partida. Uno solo y siempre el mismo: sin puntos no hay nota que
 *  dar, y lo único que se quiere decir al acabar es «vuelve a jugar». */
export const CIERRE_PARTIDA = {
  titulo: "Diez alimentos mirados",
  texto: "Se aprende jugando otra vez: la segunda vuelta siempre da un salto, y los que fallas son justo los que se te quedan.",
};
