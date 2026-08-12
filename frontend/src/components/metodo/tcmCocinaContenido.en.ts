import type { CocinaElemento } from "./tcmCocinaContenido";
import type { Elemento } from "./tcmRecorrido";

/**
 * «Tu cocina diaria» (paso 8 del recorrido de Medicina China), en INGLÉS.
 *
 * Aquí va SOLO el texto, emparejado por la clave del elemento. Las `key` de cada
 * cocción, el orden y las fotos viven únicamente en el fichero español: el orden
 * ES la foto (`FOTO_COCINA` va por posición), así que duplicarlo aquí sería la
 * forma más rápida de que una cocción saliera con la ilustración de otra.
 *
 * Lo que falte se muestra en español, elemento a elemento (ver `useCocina`).
 *
 * Al traducir:
 *  · Los nombres de los alimentos chinos se quedan como se conocen fuera:
 *    daikon, kombu, tremella, goji, azuki, congee, shiitake.
 *  · «cocción» es *cooking method* cuando es la técnica y *cooking* cuando es el
 *    acto; los títulos de las tarjetas van cortos, que caben en una línea.
 *  · Los sabores son los mismos cinco de siempre: sour, bitter, sweet, pungent,
 *    salty (ver el glosario).
 */
export type CocinaTexto = CocinaElemento;

export const COCINA_ELEMENTO_EN: Partial<Record<Elemento, CocinaTexto>> = {
  // ── WOOD · liver and gallbladder ─────────────────────────────────────────
  madera: {
    sabor: "Sour",
    principio:
      "Wood asks for green, light and slightly sour: whatever helps the liver move the Qi and let go of tension. Short cooking, steamed or quickly stir-fried, especially in spring.",
    cadaDia: [
      "A handful of leafy greens with your meal, sautéed for two or three minutes: they should come out bright and still firm.",
      "Something sour, but small: a few drops of lemon, a spoonful of sauerkraut, a pickle on the side of the plate.",
      "Fresh herbs or sprouts on top of what you're already cooking: that's the energy that rises.",
      "Eat dinner early and light. The liver takes care of itself between one and three in the morning, and it doesn't want an open digestion.",
      "Warm water when you wake up (with lemon if it agrees with you): never cold on an empty stomach.",
    ],
    cocciones: [
      {
        key: "madera-salteado",
        nombre: "A short, lively stir-fry",
        como: "Very hot pan, a thread of oil, aromatics for 30 seconds and the greens for 2–3 minutes, stirring.",
        porque: "Short cooking keeps the rising quality of the greens: boiled for a long time, they lose it.",
      },
      {
        key: "madera-escaldado",
        nombre: "Blanching (30–60 seconds)",
        como: "Boiling water, greens in, straight back out, and dressed cold with lemon and sesame.",
        porque: "It takes off the rawness without overcooking: digestible and still crunchy.",
      },
      {
        key: "madera-vapor",
        nombre: "A short steam",
        como: "Vegetables whole or in large pieces, 4–6 minutes, without drowning them in water.",
        porque: "It cooks without putting the food out: the gentlest thing there is for a tense liver.",
      },
      {
        key: "madera-infusion",
        nombre: "A covered infusion, without boiling",
        como: "Very hot water, but not quite boiling, over flowers and berries; covered for 5 minutes.",
        porque: "Flowers lose their volatile oil if they boil: keeping the lid on is part of the recipe.",
      },
    ],
    baja: ["Alcohol", "Fried food and heavy sauces", "Late dinners", "Eating in a rush or angry", "Too much coffee"],
    dia: [
      { momento: "On waking", texto: "Warm water with a few drops of lemon, before anything else." },
      { momento: "Lunch", texto: "A light grain + quickly sautéed greens, and something small and sour on the side." },
      { momento: "Mid-afternoon", texto: "A chrysanthemum and goji infusion, looking somewhere other than a screen." },
      { momento: "Dinner", texto: "Early and light: a clear celery and shiitake soup, or brothy rice with mint." },
    ],
  },

  // ── FIRE · heart and small intestine ─────────────────────────────────────
  fuego: {
    sabor: "Bitter",
    principio:
      "Fire calms down with what is bitter and slightly cooling: whatever brings down the heat of the heart and gives sleep back. Not too much spice, no alcohol, and light dinners.",
    cadaDia: [
      "A bitter note once a day, and only a little: a few leaves of escarole or endive before the main course.",
      "Something red every day: apple, pomegranate, cherry, blueberries, beetroot, azuki beans.",
      "Swap the second coffee for a chrysanthemum and mint infusion.",
      "A light, early dinner: the heart needs digestion to be finished by the time you go to bed.",
      "Eat sitting down, slowly, and in company when you can: Fire is also fed by the table.",
    ],
    cocciones: [
      {
        key: "fuego-hervido",
        nombre: "Short boiling and clear broths",
        como: "Water, vegetables and not much time; drink the broth warm, not scalding.",
        porque: "It nourishes without adding heat: the opposite of the grill and the oven.",
      },
      {
        key: "fuego-dulce-lento",
        nombre: "A sweet soup on low heat",
        como: "Lotus, lily and red date for 40 minutes on very low heat; sweeten when you turn it off, barely at all.",
        porque: "Gentle sweetness and long cooking is what settles the heart in the late afternoon and evening.",
      },
      {
        key: "fuego-escaldado",
        nombre: "Blanch and dress",
        como: "Bitter leaves for 20 seconds in boiling water, dressed with olive oil and lemon.",
        porque: "It softens the bitterness just enough so it doesn't cool you too much.",
      },
      {
        key: "fuego-infusion",
        nombre: "A covered, warm infusion",
        como: "Chrysanthemum and mint for 5 minutes with the lid on; drink it warm and unsweetened.",
        porque: "Warm, not iced: iced drinks shut digestion down and the heat bounces back.",
      },
    ],
    baja: ["Alcohol", "Strong spice", "Barbecue and heavily charred food", "Coffee in the afternoon", "Late dinners", "Screens while you eat"],
    dia: [
      { momento: "Before eating", texto: "A few dressed bitter leaves: they open the appetite and send energy down." },
      { momento: "Lunch", texto: "A grain + something red: pomegranate, beetroot, azuki, cherries." },
      { momento: "Mid-afternoon", texto: "A chrysanthemum and mint infusion instead of the second coffee." },
      { momento: "Evening", texto: "A sweet lotus and lily broth, or wheat and date, two hours before sleeping." },
    ],
  },

  // ── EARTH · spleen and stomach ───────────────────────────────────────────
  tierra: {
    sabor: "Sweet",
    principio:
      "Earth is nourished by what is naturally sweet, warm and cooked: grains, roots and squash. The spleen hates cold and raw food; anything that goes in warm saves it work.",
    cadaDia: [
      "A warm, cooked breakfast, always. It's the single change that does the most for a weak digestion.",
      "One cooked grain a day, best as a loose porridge (congee): millet, rice, oats.",
      "Get your sweetness from food: squash, sweet potato, carrot, chestnut, dates. Not from sugar.",
      "Chew until the mouthful is almost liquid, and get up from the table 70–80% full.",
      "No cold drinks with your meal: warm water, broth, or nothing.",
    ],
    cocciones: [
      {
        key: "tierra-congee",
        nombre: "Congee (a long porridge)",
        como: "One part grain to ten parts water, covered and on the lowest heat for 40–60 minutes.",
        porque: "The grain arrives half digested: the spleen hardly has to work at all.",
      },
      {
        key: "tierra-guiso",
        nombre: "A slow stew in a pot",
        como: "Root vegetables, legumes and spices covered with water, on low heat; salt at the end.",
        porque: "Moist heat and time: the most nourishing way there is to eat for the center.",
      },
      {
        key: "tierra-vapor",
        nombre: "Steaming",
        como: "Sweet potato, squash or carrot whole, 20 minutes, with a little sesame on top.",
        porque: "It concentrates the food's own sweetness without adding fat.",
      },
      {
        key: "tierra-tostado",
        nombre: "Toasting the grain before cooking it",
        como: "Millet or rice dry in the pot, on low heat, until they smell toasted; then the water.",
        porque: "A trick from Chinese cooking: toasting warms the dish and makes it even easier to digest.",
      },
    ],
    baja: ["Sugar and pastries", "Cold dairy", "Too much raw salad", "Iced drinks", "Snacking between meals", "Eating standing up"],
    dia: [
      { momento: "Breakfast", texto: "Millet and squash congee, hot. Nothing cold when you get up." },
      { momento: "Lunch", texto: "Root vegetables + a cooked grain + a pinch of ginger. Chew more than you think you need to." },
      { momento: "Afternoon snack", texto: "Steamed sweet potato with sesame, if the craving for something sweet turns up." },
      { momento: "Dinner", texto: "A light stew, early, and a ten-minute walk afterward." },
    ],
  },

  // ── METAL · lung and large intestine ─────────────────────────────────────
  metal: {
    sabor: "Pungent",
    principio:
      "Metal asks for white, juicy and slightly pungent: whatever moistens the lung and opens the breath. In autumn, when the dryness bites, sweet and moist is medicine.",
    cadaDia: [
      "Something white and juicy every day: pear, daikon radish, cauliflower, white fungus, mushrooms, cashews.",
      "A mild pungency that opens the chest: ginger, leek, onion, radish. To open, not to burn.",
      "One steamed dish: steam is moisture that comes in through the plate and through your face.",
      "Gentle fiber for the large intestine: cooked apple, soaked flaxseed, oats.",
      "Drink warm and in sips through the day; the lung hates dryness.",
    ],
    cocciones: [
      {
        key: "metal-vapor",
        nombre: "Steamed",
        como: "Pear or vegetables in a bowl that catches the juice, 20–30 minutes with the lid on.",
        porque: "Steaming is the moist cooking method par excellence: exactly what the lung needs.",
      },
      {
        key: "metal-gelatinosa",
        nombre: "Long cooking until it gels",
        como: "Tremella soaked and cooked for 45–60 minutes, until the soup thickens by itself.",
        porque: "That gelatinous texture is what moistens you from the inside in a dry autumn.",
      },
      {
        key: "metal-caldo-vapor",
        nombre: "A steaming broth (and breathing it in)",
        como: "Daikon, leek and ginger for 20 minutes; bring your face to the bowl before the first sip.",
        porque: "The steam comes in through your nose and opens the chest before the broth even gets there.",
      },
      {
        key: "metal-compota",
        nombre: "Cooked fruit and compotes",
        como: "Apple or pear with a little water and cinnamon, on low heat, until they fall apart.",
        porque: "Cooked fruit hydrates and settles the gut without the chill of raw fruit.",
      },
    ],
    baja: ["Fried food", "Dairy if there's a lot of mucus", "Sugar", "Cold raw food in autumn", "Tobacco and very dry air"],
    dia: [
      { momento: "Breakfast", texto: "Almond or oat porridge with cooked pear." },
      { momento: "Lunch", texto: "Something steamed and a mild pungency (ginger, leek) to open the chest." },
      { momento: "Mid-afternoon", texto: "Steamed pear with honey, or thyme with honey stirred in off the heat." },
      { momento: "Dinner", texto: "Daikon and ginger broth, breathing in the steam before the first sip." },
    ],
  },

  // ── WATER · kidney and bladder ───────────────────────────────────────────
  agua: {
    sabor: "Salty",
    principio:
      "Water is refilled by what is dark, mineral-rich and long-cooked: broths, black beans, seeds and nuts. In winter, slow cooking and warmth over the lower back.",
    cadaDia: [
      "Something black or dark every day: black sesame, black beans, black rice, seaweed, blackberries.",
      "One long cooking a day in winter: a broth, a stew or a slow pot. Time is the ingredient.",
      "A handful of nuts and seeds: walnuts, chestnuts, sesame, pumpkin seeds.",
      "Good salt, and just enough: sea salt or seaweed. Too much salt drains the very thing it means to feed.",
      "Nothing iced, nothing with ice in it. And warmth over your lower back while you eat and while you work.",
    ],
    cocciones: [
      {
        key: "agua-caldo-largo",
        nombre: "A long broth (3–4 hours)",
        como: "Bones, seaweed and roots on the lowest heat, skimming off the foam; salt at the end.",
        porque: "What simmers for hours refills the reserve: it's deep food, not everyday food.",
      },
      {
        key: "agua-legumbre-kombu",
        nombre: "Legumes with kombu",
        como: "Soak overnight, fresh water, a piece of seaweed and ginger; salt only at the end.",
        porque: "Salting early toughens the skin of the legume; the seaweed softens it and adds minerals.",
      },
      {
        key: "agua-tostado-molido",
        nombre: "Toast and grind",
        como: "Black sesame, walnuts and rice dry-toasted, ground and cooked with water until it thickens.",
        porque: "Toasting warms, and grinding makes usable what the body wouldn't break down on its own.",
      },
      {
        key: "agua-estofado",
        nombre: "A stew with warming spices",
        como: "Roots and legumes with ginger, cinnamon and fennel, covered and on very low heat.",
        porque: "Moist, sustained heat: what winter and a cold lower back are asking for.",
      },
    ],
    baja: ["Raw and iced food in winter", "Too much salt and ultra-processed food", "Coffee that pulls on the reserve", "Alcohol", "Going to bed late"],
    dia: [
      { momento: "Breakfast", texto: "A hot black sesame and walnut cream." },
      { momento: "Lunch", texto: "A long stew: dark legumes with kombu, salt only at the end." },
      { momento: "Mid-afternoon", texto: "A handful of walnuts and chestnuts; a goji and ginger infusion." },
      { momento: "Dinner", texto: "A really hot broth, early, and warmth over your lower back until you sleep." },
    ],
  },
};

/** Nota general de la página (al pie), en inglés. */
export const COCINA_NOTA_EN =
  "Chinese dietetics doesn't count calories: it chooses food for what it does in you —its flavor, its temperature and the organ it enters— and the cooking method for how it transforms it. Don't change everything at once: start with one ingredient and one way of cooking.";
