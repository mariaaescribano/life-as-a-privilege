import type {
  Alimento, FuncionMolecula, GrupoAlimento, GrupoMolecula, Molecula,
} from "./AlimentosNutricion";

/**
 * BIBLIOTECA DE ALIMENTOS de Nutrición, en INGLÉS.
 *
 * Aquí va SOLO el texto, indexado por la `key` del español. La estructura —el
 * orden, la foto, el grupo, los macros, los porcentajes y qué moléculas lleva
 * cada alimento— vive únicamente en `AlimentosNutricion.ts`, y la `key` es
 * además lo que se guarda en la BD (el plato, «Diseña tu día», lo leído):
 * duplicarla aquí sería la forma más rápida de romperlo todo al cambiar de
 * idioma.
 *
 * Lo que falte se lee en español, alimento a alimento (ver `useAlimentos`).
 *
 * Al traducir:
 *  · La tesis de la disciplina: ningún alimento es bueno ni malo, sus moléculas
 *    sí. El tono es directo, sin sermón y sin miedo.
 *  · Los nombres de moléculas van con la grafía química inglesa de siempre
 *    («almidón» → starch, «grasa monoinsaturada» → monounsaturated fat).
 *  · Las cifras no se tocan; los decimales con coma pasan a punto.
 *  · Los ultraprocesados son marcas: Nutella, Oreo. No se traducen.
 *  · Glosario: fibra → fiber, microbiota → microbiota (nunca «gut flora»),
 *    fitoquímicos → «Plant protectors» en el rótulo del grupo.
 */

// ── Etiquetas de las funciones (el color de la molécula) ────────────────────
export const FUNCIONES_EN: Record<FuncionMolecula, string> = {
  constructora: "Builder",
  combustible: "Fuel",
  protectora: "Protector",
  danina: "Harmful in excess",
};

// ── Rótulos de los grupos de moléculas (los del detalle del alimento) ───────
export const GRUPO_MOLECULA_LABEL_EN: Record<GrupoMolecula, string> = {
  proteina: "Proteins",
  grasa: "Fats",
  carbohidrato: "Carbohydrates",
  vitamina: "Vitamins",
  mineral: "Minerals",
  fitoquimico: "Plant protectors",
  otro: "Others",
};

// ── Rótulos de las pestañas del hub ────────────────────────────────────────
export const GRUPOS_ALIMENTOS_EN: Record<GrupoAlimento, string> = {
  fruta: "Fruit",
  verdura: "Vegetables",
  legumbre: "Legumes",
  proteina: "Animal protein",
  "proteina-vegetal": "Plant protein",
  cereal: "Grains",
  grasa: "Fats",
  "frutos-secos": "Nuts",
  lacteo: "Dairy",
  otros: "Others",
  ultraprocesado: "Ultra-processed",
};

// ── La barra de macros («de qué está hecho») ───────────────────────────────
export const MACRO_LABEL_EN = {
  carbohidrato: "Carbohydrate",
  proteina: "Protein",
  grasa: "Fat",
} as const;

// ── Las moléculas ──────────────────────────────────────────────────────────
export type MoleculaTexto = Pick<Molecula, "nombre" | "queHace">;

export const MOLECULAS_EN: Record<string, MoleculaTexto> = {
  // Carbohidratos
  glucosa: { nombre: "Glucose", queHace: "Simple sugar: the direct fuel for your cells, above all the brain and the muscles." },
  fructosa: { nombre: "Fructose", queHace: "The sugar in fruit; the liver handles it. With fiber alongside it's gentle; on its own and in excess, it overloads it." },
  sacarosa: { nombre: "Sucrose", queHace: "Table sugar (glucose + fructose). Quick energy, with a spike and a crash." },
  lactosa: { nombre: "Lactose", queHace: "The sugar in milk (glucose + galactose). Some people stop digesting it as adults." },
  almidon: { nombre: "Starch", queHace: "Long chains of glucose: slower, steadier energy than sugar." },
  fibrasoluble: { nombre: "Soluble fiber", queHace: "It dissolves into a gel: it slows down sugar absorption, fills you up and feeds your microbiota." },
  fibrainsoluble: { nombre: "Insoluble fiber", queHace: "It doesn't dissolve: it gives bulk to your stool and helps the gut move regularly." },
  pectina: { nombre: "Pectin", queHace: "A soluble fiber from fruit: it forms a gel, fills you up and feeds your bacteria." },
  "azucar-anadido": { nombre: "Added sugar", queHace: "Free sugar added to ultra-processed foods: glucose spikes with barely any nutrients or fiber." },
  // Proteínas
  proteina: { nombre: "Protein", queHace: "Chains of amino acids: the material you rebuild muscle, enzymes and defenses with." },
  "aminoacidos-esenciales": { nombre: "Essential amino acids", queHace: "The bricks your body can't make and you have to eat; without them you can't rebuild yourself." },
  // Grasas
  omega3: { nombre: "Omega-3", queHace: "An anti-inflammatory unsaturated fat; it looks after your brain and your heart." },
  "grasa-monoinsaturada": { nombre: "Monounsaturated fat", queHace: "A stable, heart-healthy fat, like the one in olive oil and avocado." },
  "grasa-saturada": { nombre: "Saturated fat", queHace: "A source of energy and structure; in excess it can raise the cholesterol that builds up in your arteries." },
  "grasa-trans": { nombre: "Trans fat", queHace: "An artificial fat in many ultra-processed foods; it damages your arteries. The less, the better." },
  colesterol: { nombre: "Cholesterol", queHace: "Material for membranes and for hormones; your body makes most of it itself." },
  // Vitaminas
  "vitamina-c": { nombre: "Vitamin C", queHace: "An antioxidant; needed to make collagen and for your defenses." },
  "vitamina-a": { nombre: "Vitamin A", queHace: "Key for eyesight, skin and the immune system." },
  "vitamina-e": { nombre: "Vitamin E", queHace: "An antioxidant that protects the fats in your membranes from oxidative damage." },
  "vitamina-b12": { nombre: "Vitamin B12", queHace: "Essential for making blood and for your nerves; mostly in animal foods." },
  "vitamina-d": { nombre: "Vitamin D", queHace: "It regulates calcium and bone; it actually acts like a hormone." },
  folato: { nombre: "Folate (B9)", queHace: "Needed to make DNA and new cells; plentiful in leafy greens." },
  // Minerales
  hierro: { nombre: "Iron", queHace: "It forms the hemoglobin that carries oxygen; without it, tiredness shows up." },
  calcio: { nombre: "Calcium", queHace: "It builds bones and teeth; it also moves muscles and nerves." },
  potasio: { nombre: "Potassium", queHace: "It balances sodium and helps regulate blood pressure." },
  magnesio: { nombre: "Magnesium", queHace: "It takes part in hundreds of reactions: energy, muscle and rest." },
  zinc: { nombre: "Zinc", queHace: "It repairs tissue, closes wounds and holds up your defenses; plentiful in nuts and shellfish." },
  yodo: { nombre: "Iodine", queHace: "The thyroid needs it to make its hormones, the ones that set the rate at which you burn." },
  selenio: { nombre: "Selenium", queHace: "An antioxidant in mineral form: it protects your cells and helps the thyroid." },
  fosfato: { nombre: "Phosphates", queHace: "They come from the phosphoric acid in cola drinks: in excess they compete with the calcium in your bones." },
  // Fitoquímicos
  quercetina: { nombre: "Quercetin", queHace: "An antioxidant, anti-inflammatory polyphenol from fruit and vegetables." },
  polifenoles: { nombre: "Polyphenols", queHace: "A family of plant antioxidants that protect your cells from wear and tear." },
  teobromina: { nombre: "Theobromine", queHace: "The gentle stimulant in cacao, caffeine's cousin; it's an antioxidant too." },
  carotenoides: { nombre: "Carotenoids", queHace: "The orange pigment in sweet potato or carrot; your body turns it into vitamin A." },
  isoflavonas: { nombre: "Isoflavones", queHace: "The phytoestrogens in soy: they look like your estrogens but they're far, far milder." },
  // Otros
  cafeina: { nombre: "Caffeine", queHace: "The stimulant in coffee: it improves alertness and brings antioxidants. In excess, jitters and insomnia." },
  etanol: { nombre: "Ethanol", queHace: "The alcohol in drinks. It's not a carb, or a fat, or a protein: it's a molecule apart that gives 7 kcal per gram and that your liver has to take apart before anything else." },
  agua: { nombre: "Water", queHace: "The medium where everything happens; fresh foods are, above all, water." },
};

// ── Los alimentos ──────────────────────────────────────────────────────────
export type AlimentoTexto = Pick<Alimento, "nombre" | "resumen"> & { descripcion?: string };

export const ALIMENTOS_EN: Record<string, AlimentoTexto> = {
  // ── Fruta ──
  manzana: {
    nombre: "Apple", resumen: "Sugars with fiber and antioxidants.",
    descripcion: "An apple is mostly water and sugars, but wrapped in fiber (a good part of it in the skin) and in antioxidants. That fiber makes its sugar absorb slowly, without the spikes of a juice. [DRAFT: fix this text]",
  },
  platano: { nombre: "Banana", resumen: "Energy and potassium." },
  naranja: { nombre: "Orange", resumen: "Vitamin C and fiber, with the pulp intact." },
  "zumo-naranja": { nombre: "Orange juice", resumen: "The same fruit without fiber: free sugar arriving all at once." },

  // ── Verdura ──
  brocoli: { nombre: "Broccoli", resumen: "Fiber, vitamin C and protectors." },
  espinaca: { nombre: "Spinach", resumen: "A leafy green with iron, folate and antioxidants." },
  zanahoria: { nombre: "Carrot", resumen: "Sweet and loaded with vitamin A." },
  tomate: { nombre: "Tomato", resumen: "Water, vitamin C and antioxidants." },
  pimiento: { nombre: "Red pepper", resumen: "A vitamin C record-holder, and plenty of color." },
  calabacin: { nombre: "Zucchini", resumen: "Mild and very light, almost all water." },
  cebolla: { nombre: "Onion", resumen: "Flavor and quercetin, a powerful antioxidant." },
  berenjena: { nombre: "Eggplant", resumen: "Fiber and polyphenols in its purple skin." },
  esparragos: { nombre: "Asparagus", resumen: "Rich in folate and fiber." },
  batata: {
    nombre: "Sweet potato", resumen: "Sweet starch with a huge amount of vitamin A.",
    descripcion: "Sweet potato is the vegetable that most resembles a grain: almost all starch. What sets it apart from a potato is the orange —carotenoids by the bucketload, which your body turns into vitamin A— and its fiber, which makes that starch come in more slowly than its sweetness promises.",
  },

  // ── Legumbres ──
  soja: { nombre: "Soybeans", resumen: "Complete plant protein." },
  garbanzos: { nombre: "Chickpeas", resumen: "Plant protein with fiber and iron." },
  lentejas: {
    nombre: "Lentils", resumen: "Protein and iron with almost no fat.",
    descripcion: "The leanest legume: protein and starch with barely any fat. Its iron is the plant kind and it's harder to absorb than the iron in meat, so a squeeze of lemon or a tomato on the side —vitamin C— multiplies what you actually take in.",
  },

  // ── Proteína vegetal ──
  "tofu-seitan": {
    nombre: "Tofu and seitan", resumen: "Concentrated plant protein: pressed soy and gluten.",
    descripcion: "Two different things used the same way. Tofu is soy curdled and pressed: complete protein, calcium and good fat. Seitan is pure wheat gluten: even more protein, but incomplete —it's short on lysine— so it asks for a legume on the side to round it out.",
  },

  // ── Proteína animal ──
  pollo: { nombre: "Chicken", resumen: "Lean protein." },
  vaca: { nombre: "Beef", resumen: "Protein, iron and B12; more saturated fat." },
  cerdo: { nombre: "Pork", resumen: "Protein with more or less fat depending on the cut." },
  huevo: { nombre: "Egg", resumen: "The benchmark complete protein." },
  atun: { nombre: "Tuna", resumen: "Lean protein and omega-3." },
  salmon: {
    nombre: "Salmon", resumen: "The fish with the most omega-3 and vitamin D.",
    descripcion: "An oily fish, and that's exactly where its value is: that fat is omega-3, the one your brain and your arteries need and you can't make yourself. It's also one of the very few foods that bring real vitamin D, the one almost everyone is low on from not seeing the sun.",
  },
  gambas: {
    nombre: "Shrimp", resumen: "Almost pure protein; its cholesterol isn't the problem.",
    descripcion: "Almost pure protein: no carbs and barely any fat. They carry a reputation for being high in cholesterol, and that's true, but the cholesterol you eat barely moves the cholesterol in your blood —what moves it is saturated fat, and there's none here—. What they do bring, and few people mention, is iodine, selenium and zinc.",
  },

  // ── Cereales ──
  "pasta-integral": { nombre: "Whole-wheat pasta", resumen: "Whole wheat: fiber and slow-release energy." },
  "arroz-integral": { nombre: "Brown rice", resumen: "It keeps the bran: more fiber and minerals." },
  pan: { nombre: "Bread", resumen: "It depends a lot on whether it's whole grain or white." },
  avena: {
    nombre: "Oats", resumen: "The whole grain by definition: its fiber slows sugar down.",
    descripcion: "Oats are eaten whole, with the bran still on: that's why you never have to ask whether they're whole grain. Their soluble fiber —beta-glucans— forms a gel in the gut that slows down sugar absorption and carries off part of your cholesterol. They're also the grain with the most protein.",
  },

  // ── Grasas ──
  aguacate: { nombre: "Avocado", resumen: "Good fat and fiber." },
  "aceite-oliva": { nombre: "Olive oil", resumen: "Heart-healthy fat (extra virgin)." },

  // ── Frutos secos ──
  nueces: { nombre: "Walnuts", resumen: "Good fat and plant omega-3." },
  cacahuetes: { nombre: "Peanuts", resumen: "Technically a legume; protein and fat." },
  almendras: {
    nombre: "Almonds", resumen: "Vitamin E, and the nut with the most calcium.",
    descripcion: "Monounsaturated fat, the same family as olive oil's, and the highest amount of vitamin E in the whole group: the antioxidant that protects fats, precisely. It's also the nut with the most calcium, which is what makes it the most sensible plant milk.",
  },
  anacardos: {
    nombre: "Cashews", resumen: "The nut with the most carbs and the least fiber.",
    descripcion: "The mildest and the sweetest of the group, and not by chance: almost a third is carbs —twice an almond— and its fiber is the lowest. It's still a nut loaded with good fat, iron, magnesium and zinc, but it's the one that most resembles a snack.",
  },

  // ── Lácteos ──
  queso: { nombre: "Cheese", resumen: "Protein and calcium, with saturated fat." },
  "queso-fresco": {
    nombre: "Fresh cheese", resumen: "The same cheese undrained: lots of water, half the fat.",
    descripcion: "An aged cheese is milk with the water taken out; fresh cheese is the step before, which is why more than half of it is still water. Weight for weight it has half the fat and salt of an aged cheese, and quite a bit less calcium, precisely because it's less concentrated.",
  },
  "yogur-griego": {
    nombre: "Greek yogurt", resumen: "In Spain it's almost always cream: more fat than protein.",
    descripcion: "Careful with the name. Real Greek yogurt is strained —the whey is taken out— and comes out with twice the protein. The «Greek-style» sold here is almost always regular yogurt with cream added: same creaminess, but three times the fat and the same protein as a plain yogurt. Read the label: if it says «cream», it's the second one.",
  },

  // ── Otros ──
  "chocolate-negro": { nombre: "Dark chocolate", resumen: "The purer it is, the more cacao and the less sugar." },
  cafe: { nombre: "Coffee", resumen: "Almost only water, caffeine and antioxidants." },
  miel: { nombre: "Honey", resumen: "Natural, yes, but it's still sugar." },
  "cerveza-vino": {
    nombre: "Beer and wine", resumen: "Their energy isn't a macro: it's alcohol.",
    descripcion: "Here the macro bar misleads you, and that's exactly why it's worth looking at. The few carbs you see are almost everything beer has of food; wine not even that. The real energy comes from ETHANOL, which is not a carb or a fat or a protein: it's a fourth molecule that gives 7 kcal per gram —almost as much as fat— and that your liver drops everything else to take apart first.",
  },

  // ── Ultraprocesados ──
  nutella: { nombre: "Nutella", resumen: "Mostly sugar and fat; not much hazelnut." },
  oreo: { nombre: "Oreo", resumen: "Empty energy: sugar, refined flour and fat." },
  cola: {
    nombre: "Cola drink", resumen: "Water with sugar, caffeine and acid: nothing else.",
    descripcion: "The most honest ultra-processed food in the catalog, because it doesn't pretend: no protein, no fat, no fiber, not a single vitamin. Just water, liquid sugar that arrives all at once, caffeine so you fancy another one, and the phosphoric acid that gives it that edge —and that in excess competes with your bones for calcium—.",
  },
};

/** Los alimentos en el idioma que se le pase. Sin hook, para poder usarlo
 *  también dentro de un `useMemo` o fuera de un componente. El español manda la
 *  `key`, la foto, el grupo, los macros y las moléculas. */
export function alimentosTraducidos(alimentos: Alimento[], idioma: "es" | "en"): Alimento[] {
  if (idioma === "es") return alimentos;
  return alimentos.map((a) => {
    const en = ALIMENTOS_EN[a.key];
    return en ? { ...a, ...en } : a;
  });
}

/** Una molécula suelta en el idioma que se le pase (la `key`, el grupo, la
 *  función y la foto salen siempre del español). */
export function moleculaTraducida(m: Molecula, idioma: "es" | "en"): Molecula {
  if (idioma === "es") return m;
  const en = MOLECULAS_EN[m.key];
  return en ? { ...m, ...en } : m;
}
