import type { Nutriente, NutrienteTarjeta } from "./NutrientesNutricion";

/**
 * Los nutrientes de Nutrición (paso «Los nutrientes» del recorrido), en INGLÉS.
 *
 * Aquí va SOLO el texto. Las fotos, los colores, las siglas, el orden de los
 * grupos y el de las tarjetas viven únicamente en el fichero español: son lo que
 * decide qué se pinta y dónde, y duplicarlo aquí sería la forma más rápida de
 * que una molécula saliera con la foto o el color de otra.
 *
 * Las tarjetas van indexadas por su `key`, no en una lista: así se puede
 * traducir de una en una y el que quede sin traducir se lee en español en vez
 * de desaparecer (ver `useNutrientes`).
 *
 * Al traducir:
 *  · Es divulgación científica con voz cercana, no un prospecto. Segunda
 *    persona, contracciones y frases cortas, igual que en español.
 *  · Los nombres de moléculas, enzimas y rutas van en su forma inglesa estándar:
 *    glucose, fructose, arachidonic acid, glutathione, adenosine, LDL/HDL.
 *  · Las unidades y las cifras no se tocan, y los decimales españoles con coma
 *    pasan a punto («0,8 g» → «0.8 g»).
 */
export type TarjetaTexto = Pick<NutrienteTarjeta, "titulo" | "claves" | "parrafos" | "grupo">;

export type NutrienteTexto = Pick<
  Nutriente,
  "label" | "resumen" | "descripcion" | "tipos" | "queHacen" | "donde"
> & {
  /** Las tarjetas de este grupo, por su `key`. */
  tarjetas?: Record<string, TarjetaTexto>;
};

export const NUTRIENTES_EN: Record<string, NutrienteTexto> = {
  // ── CARBOHIDRATOS ───────────────────────────────────────────────────────
  carbohidratos: {
    label: "Carbohydrates",
    resumen: "Your main source of energy.",
    descripcion: [
      "Carbohydrates are the body's main source of energy.",
      "During digestion, enzymes break them down into simple molecules, mostly glucose. That's what lets your cells get energy through cellular respiration.",
      "When you eat more than you need, the surplus is stored as glycogen or turned into triglycerides, which are then stored in your white fat cells.",
    ],
    tipos: [
      { nombre: "Simple (sugars)", desc: "Glucose, fructose, sucrose. Fast energy, a spike and a crash." },
      { nombre: "Complex (starch)", desc: "Long chains of glucose. Slow, steady energy." },
    ],
    queHacen: [
      "They're the body's preferred fuel: they break down into glucose.",
      "Glucose feeds your brain and your muscles above all.",
      "The surplus is stored as glycogen (liver and muscle) or as fat.",
    ],
    donde: ["Oats", "Whole grain rice and bread", "Legumes", "Fruit", "Potato and sweet potato"],
    tarjetas: {
      glucosa: {
        titulo: "Glucose",
        claves: [
          "Your cells' favorite fuel",
          "When it rises in your blood, insulin says: store it",
          "If the tanks are full, the liver turns it into fat",
        ],
        parrafos: [
          "It's the molecule our cells use most often to make ATP, which is energy.",
          "When we eat it, it passes into the blood and insulin is released — the hormone that tells your cells to take the glucose in and use it. If there is more glucose than the body needs and the glycogen stores are full, the liver turns that glucose into triglycerides and stores them in fat, to keep it in reserve.",
        ],
      },
      fructosa: {
        titulo: "Fructose",
        claves: [
          "The sugar of fruit and honey",
          "The liver handles it, not your cells",
          "With fiber it's gentle; in juice it all arrives at once",
        ],
        parrafos: [
          "It's the molecule that characterizes fruit and honey.",
          "Unlike glucose, most fructose is processed in the liver first.",
          "When you eat it inside a piece of fruit, the fiber makes it absorb slowly.",
          " But when you take in a lot of it without fiber (in a soft drink or a juice, say), the liver gets a very fast load that encourages fat production, burns through its reserves and throws the metabolism off.",
          "Go deeper: when you take in a lot of fructose without fiber, the liver processes it through a route of its own called fructolysis, which skips the control «traffic light» that regulates glycolysis (the normal pathway for glucose). Coming in past that tollbooth with no metabolic brakes, fructose floods the organ all at once, instantly draining its cellular energy reserves (ATP). Unable to slow the process down, the liver has no choice but to divert all that surplus carbon into de novo lipogenesis, turning it straight into fat. That saturates the liver cells and causes fatty liver, raises blood triglycerides and generates uric acid, which sets off cellular inflammation and insulin resistance.",
        ],
      },
      galactosa: {
        titulo: "Galactose",
        claves: [
          "It's half of lactose, the sugar in milk",
          "Lactase splits it; without lactase, gas and bloating",
          "Once inside, it's turned into glucose",
        ],
        parrafos: [
          "Galactose is part of lactose, the carbohydrate molecule found in milk.",
          "To absorb it, we first have to break lactose apart using an enzyme called lactase, which splits it into glucose and galactose.",
          "People who are lactose intolerant make very little lactase, so the lactose reaches the intestine undigested and causes symptoms like gas, bloating or diarrhea.",
          "Once absorbed, galactose is usually turned into glucose so the body can use it.",
        ],
      },
    },
  },

  // ── GRASAS ──────────────────────────────────────────────────────────────
  grasas: {
    label: "Fats",
    resumen: "Dense energy, and the bricks of your membranes.",
    descripcion: [
      "Fats are part of the membrane of every one of your cells. They also carry vitamins A, D, E and K, and they're the basis for making many hormones.",
      "They aren't all the same: unsaturated fats are the ones that do most for your health, saturated fats are worth going easy on, and trans fats are worth avoiding.",
    ],
    tipos: [
      { nombre: "Unsaturated", desc: "Mono- and polyunsaturated (omega-3, omega-6). The most beneficial ones." },
      { nombre: "Saturated", desc: "In meat and dairy. In moderation." },
      { nombre: "Trans", desc: "Industrial (ultra-processed food). The ones to avoid." },
    ],
    queHacen: [
      "The most concentrated energy reserve the body has.",
      "They build the membranes of every one of your cells.",
      "They carry vitamins A, D, E and K, and are the basis of many hormones.",
    ],
    donde: ["Olive oil", "Avocado", "Nuts and seeds", "Oily fish", "Eggs"],
    tarjetas: {
      insaturadas: {
        titulo: "Unsaturated fats",
        claves: [
          "Olive oil, nuts, avocado and oily fish",
          "Their kink is what keeps your membranes flexible",
          "They're the ones you evolved with: the most efficient",
        ],
        parrafos: [
          "These are the fats you'll find most often in foods like olive oil, nuts, seeds, avocado and oily fish.",
          "Their structure has one or more kinks in it, which help keep cell membranes flexible and let cells work normally.",
          "They're the most efficient fats for our cells, and the ones we've evolved with over millions of years.",
        ],
      },
      saturadas: {
        titulo: "Saturated fats",
        claves: [
          "Mostly in meat, dairy and coconut oil",
          "They're straight: they pack together and stiffen the membrane",
          "Your body uses them, but too many weigh on the heart",
        ],
        parrafos: [
          "You'll find them mainly in animal products, like meat or dairy, though also in some plant foods such as coconut oil.",
          "Their molecules are straight and can pack together more easily, which makes cell membranes stiffer and less efficient.",
          "Our body uses them too, but eating a lot of them over time can contribute to cardiovascular problems, especially when they crowd out unsaturated fats.",
        ],
      },
      trans: {
        titulo: "Trans fats",
        claves: [
          "Born in a factory: half-hydrogenated oil",
          "They raise LDL cholesterol and lower HDL at the same time",
          "There is no recommended amount: ideally zero",
        ],
        parrafos: [
          "Most of the trans fats in our food are created during industrial processes that modify vegetable oils to make them more stable. In other words, that molecular shape barely exists in nature: it was made in a laboratory.",
          "To understand what «trans» means you have to look at the molecule. In a natural unsaturated fat, the double bond leaves both hydrogens on the same side, and that forces the chain to bend: that's the famous kink, the «cis» shape. In a trans fat the hydrogens end up on opposite sides and the chain stays straight. That's the whole change, and it's enormous: a molecule that behaves like a rigid saturated fat even though it's technically still unsaturated.",
          "How do you get there? Partial hydrogenation. You take a cheap liquid vegetable oil and inject hydrogen into it under pressure, with a metal catalyst and heat. If the process ran to completion, the oil would end up fully saturated; by stopping halfway, some of the double bonds that survive flip from cis to trans. The result was exactly what the industry wanted: a fat that's solid and creamy at room temperature, that doesn't go rancid, that stands up to being fried in over and over, and that adds months to a product's shelf life.",
          "There's a historical irony in it: for decades, hydrogenated margarines were sold as the modern, healthy alternative to butter and animal fat. They turned out to be worse than what they came to replace.",
          "The damage starts at the membrane. Your cells build their membranes out of whatever fats reach them, and they can't tell the difference: because trans molecules are straight, they get placed where the unsaturated ones should go. But a membrane that ought to be fluid turns rigid, and with it the receptors, channels and enzymes embedded in it stop working properly. The material is faulty, but the building goes up anyway.",
          "In the blood they do something no other fat does: they raise LDL cholesterol and, at the same time, lower HDL. Saturated fat raises LDL but also raises HDL a little; trans fats make both sides worse at once, which leaves them with the worst profile of any fat we know. They also raise lipoprotein(a), promote inflammation and damage the endothelium, the layer that lines your arteries on the inside.",
          "And all of that at tiny doses. The World Health Organization recommends they stay under 1% of your daily energy: about 2 grams a day. The big analyses estimate that every 2% of your energy coming from trans fats is associated with something like a 20–25% higher risk of coronary heart disease. Very little of it for so much effect.",
          "An honest nuance: natural trans fats do exist, in small amounts, in the meat and milk of ruminants, because the bacteria in their stomach make them. At the doses we eat them, they don't seem to have the same effect as industrial ones. The problem is the factory version.",
          "The good news is that this has been regulated. Denmark was the first to limit them, in 2003, and since April 2021 no food in the whole European Union can carry more than 2 grams of industrial trans fat per 100 grams of fat. In Europe the problem today is far smaller than it was fifteen years ago.",
          "Even so, it's worth knowing how to read a label, because European labelling does NOT require declaring how much trans fat a product contains: you won't find it in the nutrition table. Where it does show up is in the ingredient list. Look for the words «partially hydrogenated»: that's where they are. Careful — if it only says «hydrogenated», without the «partially», that fat is fully saturated and isn't trans. Be especially suspicious of industrial pastries, hard margarines, filled cookies, coatings, ready meals and products imported from outside the EU.",
          "Remember that they serve no known beneficial purpose and should be kept to a minimum. There is no recommended amount of trans fat, because they aren't needed for anything: it's the one component of your diet where the ideal is, quite simply, zero.",
        ],
      },
    },
  },

  // ── PROTEÍNAS ───────────────────────────────────────────────────────────
  proteinas: {
    label: "Proteins",
    resumen: "The material you rebuild yourself with.",
    descripcion: [
      "Proteins are the material your body builds and repairs tissue with.",
      "During digestion they're broken down into amino acids, the bricks the body uses to make muscle, skin, enzymes, antibodies and many hormones.",
    ],
    tipos: [
      { nombre: "Complete", desc: "From animals: they provide every essential amino acid." },
      { nombre: "Incomplete", desc: "From plants: you combine them (legume + grain) to complete them." },
    ],
    queHacen: [
      "They break down into amino acids, the body's bricks.",
      "They build and repair muscle, skin, hair and organs.",
      "They form enzymes, antibodies and many hormones.",
    ],
    donde: ["Eggs", "Fish and meat", "Dairy", "Legumes and tofu", "Nuts"],
    tarjetas: {
      esenciales: {
        titulo: "Essential amino acids",
        claves: [
          "Your body doesn't know how to make them",
          "You have to eat them, no way around it",
          "With them you make muscle, enzymes, hormones and defenses",
        ],
        parrafos: [
          "These are the amino acids our body can't make, or can't make in large enough amounts, and yet needs. That's why we have to get them from what we eat.",
          "They're essential for making muscle, enzymes, hormones, antibodies and thousands of different proteins.",
        ],
      },
      "no-esenciales": {
        titulo: "Non-essential amino acids",
        claves: [
          "These ones you do make yourself, out of other molecules",
          "You don't need to go looking for them in food",
          "Just as important: they build and repair tissue",
        ],
        parrafos: [
          "Our body can make these amino acids out of other molecules, so it isn't essential to get them directly from food.",
          "Even so, they're just as important, since they take part in building and repairing every tissue there is.",
        ],
      },
      "condicionalmente-esenciales": {
        titulo: "Conditionally essential amino acids",
        claves: [
          "Normally you make them yourself",
          "In growth, illness or injury you can't keep up",
          "At those times they have to come from food",
        ],
        parrafos: [
          "Normally our body can produce them, but in certain situations —growth, an illness, an infection or a serious injury— demand rises so much that we need to get more of them from what we eat.",
        ],
      },
    },
  },

  // ── VITAMINAS ───────────────────────────────────────────────────────────
  vitaminas: {
    label: "Vitamins",
    resumen: "Regulators: without them nothing works.",
    descripcion: [
      "Vitamins don't give you energy, but without them nothing works properly. They're what lets the body's chemical reactions happen, from sight to your defenses to the clotting of your blood.",
      "The water-soluble ones (the B group and vitamin C) have to be topped up regularly through food, while the fat-soluble ones (A, D, E and K) can be stored in body fat.",
    ],
    tipos: [
      { nombre: "Water-soluble", desc: "Vitamin C and the B group. They aren't stored: they need topping up daily." },
      { nombre: "Fat-soluble", desc: "A, D, E and K. They're kept in the body's fat." },
    ],
    queHacen: [
      "They don't give energy, but they let the body's reactions happen.",
      "They take part in sight, in your defenses, in clotting and in cellular energy.",
      "Vitamin D is made in your skin, out of sunlight.",
    ],
    donde: ["Fruit and vegetables", "Leafy greens", "Eggs and liver", "Sunlight (vitamin D)", "Whole grains"],
    tarjetas: {
      a: {
        titulo: "Vitamin A (Retinol)",
        claves: [
          "Without it you couldn't see",
          "It forms rhodopsin, the pigment in your retina",
          "It renews your skin and tunes your immune response",
        ],
        parrafos: [
          "Without vitamin A we wouldn't be able to see.",
          "Vitamin A is turned into retinal, a molecule that's part of rhodopsin — the pigment in the retina that lets us see.",
          "It's essential for the immune system to develop, and for its response not to be excessive.",
          "Vitamin A regulates which genes get switched on in epithelial cells. Thanks to that, your skin cells renew themselves properly (protecting you effectively) and your mucous membranes produce the right amount of mucus.",
        ],
      },
      b1: {
        titulo: "Vitamin B1 (Thiamine)",
        claves: [
          "It switches on the enzymes that draw energy out of sugar",
          "Without it, the cell struggles to use glucose",
          "Brain, nerves and muscle all depend on it",
        ],
        parrafos: [
          "It activates the enzymes that turn carbohydrates into energy, and it's essential for the brain, the nerves and the muscles to work. Without it, cells would have a very hard time getting energy out of glucose.",
        ],
      },
      b2: {
        titulo: "Vitamin B2 (Riboflavin)",
        claves: [
          "It moves the electrons of cellular respiration",
          "Which is to say: making energy",
          "It looks after skin, eyes and mucous membranes, and slows oxidation",
        ],
        parrafos: [
          "It takes part in a great many metabolic reactions tied to producing energy — to be exact, it's turned into activators for the enzymes that carry electrons during cellular respiration.",
          "It also helps keep the skin, the eyes and the mucous membranes in good shape, and helps protect cells from oxidative stress.",
        ],
      },
      b3: {
        titulo: "Vitamin B3 (Niacin)",
        claves: [
          "It becomes NAD⁺ and NADP⁺, the electron carriers",
          "That NAD is what broken DNA gets repaired with",
          "It holds up the nervous system and the skin barrier",
        ],
        parrafos: [
          "It's needed to make the molecules that let us get energy out of food.",
          "That is, it's turned into NAD⁺ and NADP⁺, molecules that carry electrons between enzymes across hundreds of metabolic reactions.",
          "It also takes part in DNA repair (spotting when DNA is broken, switching on the repair system and using NAD as the 'fuel' to fix the broken genes), in the normal working of the nervous system (helping turn food into the energy the brain needs, protecting neurons from oxidative stress — it activates glutathione, the main antioxidant — and making neurotransmitters) and in the skin (keeping its moisture barrier up by producing ceramides — natural lipids (fats) that make up most of the skin's protective barrier —, lowering inflammation and preventing the cell damage caused by the sun's ultraviolet rays).",
        ],
      },
      b5: {
        titulo: "Vitamin B5 (Pantothenic acid)",
        claves: [
          "It forms coenzyme A",
          "Without it, no fat gets made and none gets burned",
          "It's also needed for cholesterol and hormones",
        ],
        parrafos: [
          "It's part of coenzyme A (CoA), a molecule enzymes can't do without if they're going to build and break down fats, produce energy and synthesize cholesterol and hormones.",
        ],
      },
      b6: {
        titulo: "Vitamin B6 (Pyridoxine)",
        claves: [
          "It's in charge of the work with amino acids",
          "It makes neurotransmitters, hemoglobin and antibodies",
          "Key for the nervous system and for your defenses",
        ],
        parrafos: [
          "It activates the enzymes involved in transforming amino acids and in making neurotransmitters, hemoglobin (the protein in red blood cells that carries oxygen) and antibodies.",
          "Because of that, it's fundamental for the nervous system and the immune system.",
        ],
      },
      b7: {
        titulo: "Vitamin B7 (Biotin)",
        claves: [
          "It's the coenzyme of the carboxylases",
          "With them you make glucose and fatty acids",
          "Hence its reputation for skin, hair and nails",
        ],
        parrafos: [
          "It works as the coenzyme of the carboxylases, a group of enzymes that let you make glucose, synthesize fatty acids and use certain amino acids for energy. That's why it takes part in keeping skin, hair and nails in good shape.",
        ],
      },
      b9: {
        titulo: "Vitamin B9 (Folic acid or Folate)",
        claves: [
          "It hands out the carbons that DNA is built with",
          "Without it, cells can't divide properly",
          "In pregnancy, essential for the baby's nervous system",
        ],
        parrafos: [
          "It activates the enzyme that carries the small carbon fragments needed to make DNA and RNA. Without it, cells wouldn't be able to divide properly.",
          "During pregnancy it's especially important, because it takes part in the baby's nervous system developing properly. Without this vitamin, the baby could die.",
          "Folate gets trapped because its conversion into the storage form is irreversible, and vitamin B12 is the only one that can take off the chemical group blocking it and return it to its active state: folic acid (a supplement) or folate (from food) → trapped form → vitamin B12 → active folate.",
        ],
      },
      b12: {
        titulo: "Vitamin B12 (Cobalamin)",
        claves: [
          "It frees the folate that gets trapped",
          "Without it there are no red blood cells and no healthy myelin",
          "Only microorganisms make it: animal food or a supplement",
        ],
        parrafos: [
          "Vitamin B12 works as an essential coenzyme that activates methionine synthase, an enzyme that frees the trapped folate and so allows the DNA synthesis needed to produce red blood cells; and it also activates methylmalonyl-CoA mutase, the enzyme that processes fats, preventing the build-up of toxic compounds that destroy the protective myelin sheath around your neurons.",
          "Only certain microorganisms produce it, so you get it mostly from animal foods or from fortified ones.",
        ],
      },
      c: {
        titulo: "Vitamin C (Ascorbic acid)",
        claves: [
          "An antioxidant: it donates electrons and settles free radicals",
          "Without it, collagen doesn't hold its shape",
          "It makes plant iron absorbable",
        ],
        parrafos: [
          "It acts as an antioxidant, and donates electrons to the enzymes that build collagen, letting its fibers be stabilized. It improves the absorption of plant iron by keeping it in a form that's easier to take in.",
          "It contributes to the immune system working normally — that is, it helps stimulate the production and function of immune cells, as well as acting as an antioxidant that protects those cells from damage.",
        ],
      },
      d: {
        titulo: "Vitamin D (Calciferol)",
        claves: [
          "It opens the door to calcium and phosphorus",
          "Bones and teeth, but also muscle and your defenses",
          "You make it with sunlight, though it's hard: it's usually supplemented",
        ],
        parrafos: [
          "It makes the absorption of calcium and phosphorus possible, helping keep bones and teeth strong.",
          "It also takes part in the working of the immune system and the muscles. Our body can make it thanks to sunlight, but it's very hard to make, so taking it as a supplement is recommended.",
        ],
      },
      e: {
        titulo: "Vitamin E (Tocopherol)",
        claves: [
          "The great antioxidant of your membranes",
          "It slips inside them and stops free radicals",
          "It protects your cells' fat before it can be damaged",
        ],
        parrafos: [
          "It's one of the body's main antioxidants.",
          "It protects cell membranes because it becomes part of them and donates electrons to settle free radicals before they can damage the lipids the membrane is made of.",
        ],
      },
      k: {
        titulo: "Vitamin K (Phylloquinone and Menaquinones)",
        claves: [
          "Without it, blood doesn't clot",
          "It decides where the calcium in bone goes",
          "Some of it is made by the bacteria in your gut",
        ],
        parrafos: [
          "It's essential for blood to clot properly when we get a wound. It also takes part in keeping bones healthy, by regulating how calcium is used.",
          "Some vitamin K can also be produced by certain bacteria in our gut microbiota.",
        ],
      },
    },
  },

  // ── MINERALES ───────────────────────────────────────────────────────────
  minerales: {
    label: "Minerals",
    resumen: "Structure, transport and balance.",
    descripcion: [
      "Minerals give structure, carry substances around and keep the body in balance. Many of them act as cofactors, helping enzymes work properly.",
      "They build bones and teeth, they make the nerve impulse and muscle contraction possible, and iron carries the oxygen in your blood.",
    ],
    tipos: [
      { nombre: "Macrominerals", desc: "Calcium, phosphorus, magnesium, potassium, sodium. In larger amounts." },
      { nombre: "Trace elements", desc: "Iron, zinc, iodine, selenium. In tiny amounts, but essential." },
    ],
    queHacen: [
      "They give structure to bones and teeth (calcium, phosphorus).",
      "Iron carries the oxygen in your blood.",
      "They make the nerve impulse, muscle contraction and fluid balance possible.",
    ],
    donde: ["Dairy", "Leafy greens", "Legumes", "Shellfish and fish", "Nuts"],
    tarjetas: {
      sodio: {
        titulo: "Sodium (Na⁺)",
        grupo: "⚡ Electrolytes",
        claves: [
          "The main electrolyte OUTSIDE the cell",
          "It rules the body's water and the nerve impulse",
          "It holds water in your vessels: that's why it raises blood pressure",
        ],
        parrafos: [
          "It's the main electrolyte outside your cells.",
          "It regulates how much water the body holds and lets your nerves carry electrical impulses.",
          "Sodium raises blood pressure because it holds water and so increases the volume of the blood: the plasma follows the sodium, staying inside the blood vessels instead of going into the cells.",
          "Go deeper: the sodium-potassium pump (Na⁺/K⁺-ATPase) uses ATP to push sodium out of the cell and bring potassium in, creating what's needed for nerve impulses, muscle contraction and the transport of many molecules, such as glucose or certain amino acids.",
        ],
      },
      potasio: {
        titulo: "Potassium (K⁺)",
        grupo: "⚡ Electrolytes",
        claves: [
          "The main electrolyte INSIDE the cell",
          "It leaves and comes back with every nerve impulse",
          "Nerves, muscle and heart coordinate thanks to it",
        ],
        parrafos: [
          "It's the main electrolyte inside your cells.",
          "Thanks to the difference created by the sodium-potassium pump, potassium can leave the cell for a moment during a nerve impulse and then go back to where it started.",
          "That movement is what lets neurons, muscles and the heart send electrical signals in a coordinated way.",
        ],
      },
      calcio: {
        titulo: "Calcium (Ca²⁺)",
        grupo: "⚡ Electrolytes",
        claves: [
          "Bone and tooth, but also a chemical signal",
          "It's what muscles contract with and what neurons talk with",
          "Without it, blood doesn't clot",
        ],
        parrafos: [
          "As well as being part of bones and teeth, calcium acts as a chemical signal inside your cells.",
          "It's what lets muscles contract, what lets neurons release neurotransmitters and what lets blood clot properly.",
        ],
      },
      magnesio: {
        titulo: "Magnesium (Mg²⁺)",
        grupo: "⚡ Electrolytes",
        claves: [
          "ATP almost never travels alone: it travels holding magnesium",
          "Without it, your enzymes don't know how to use that energy",
          "It switches on hundreds of reactions: DNA, RNA and proteins",
        ],
        parrafos: [
          "ATP almost never exists free inside cells. It's normally bound to a magnesium ion, forming Mg-ATP, which is the form most enzymes need.",
          "Without magnesium, many of them couldn't use the energy stored in ATP, and the cell would be far less efficient.",
          "It's also needed to activate hundreds of enzymes involved in synthesizing DNA, RNA and proteins, as well as in cellular respiration and energy production.",
        ],
      },
      cloruro: {
        titulo: "Chloride (Cl⁻)",
        grupo: "⚡ Electrolytes",
        claves: [
          "It travels with sodium and keeps the electrical balance",
          "It's what water moves between tissues with",
          "And it's what the stomach makes its hydrochloric acid with",
        ],
        parrafos: [
          "It's present in most of the fluid surrounding your cells, and it travels with sodium to keep the electrical balance and the movement of water between different tissues.",
          "It also plays an essential role in the stomach: the cells of the gastric lining combine chloride with protons (H⁺) to form hydrochloric acid (HCl), which is essential for denaturing the proteins in food, activating the enzyme pepsin and destroying many of the microorganisms we swallow.",
        ],
      },
      fosfato: {
        titulo: "Phosphate (PO₄³⁻)",
        grupo: "⚡ Electrolytes",
        claves: [
          "It's in ATP, in DNA and in your membranes",
          "It's where chemical energy is kept",
          "Placed on an enzyme, it switches it on or off",
        ],
        parrafos: [
          "Phosphate is one of the most important components of Life.",
          "It's part of ATP, where it stores chemical energy; of DNA and RNA, where it joins the nucleotides into their structure; and of the phospholipids that build cell membranes.",
          "On top of that, enzymes change their role or mission completely if you add a phosphate to them. That's why it's also thought of as a molecular switch.",
          "It manages that thanks to 'zinc fingers', structures that dock straight onto DNA to switch its reading on or off, and thanks to its ability to act as a conductor in our defenses, regulating the maturing of T lymphocytes and holding back excessive inflammation.",
        ],
      },
      hierro: {
        titulo: "Iron (Fe)",
        grupo: "🧱 Minerals",
        claves: [
          "It's the one that grabs the oxygen inside hemoglobin",
          "It carries it from the lung to the furthest tissue",
          "It also works inside your mitochondria",
        ],
        parrafos: [
          "It's an essential component of the hemoglobin in red blood cells and of the myoglobin in muscle.",
          "It's what lets oxygen be carried from the lungs to the tissues, and it takes part in producing energy inside the mitochondria.",
          "It's also part of a great many enzymes involved in cellular respiration and in DNA synthesis.",
        ],
      },
      zinc: {
        titulo: "Zinc (Zn)",
        grupo: "🧱 Minerals",
        claves: [
          "A cofactor for more than 300 enzymes",
          "DNA, cell division and wound healing",
          "It holds up the immune system",
        ],
        parrafos: [
          "It works as a cofactor in more than 300 enzymes involved in synthesizing DNA and proteins, in cell division, in wound healing and in the metabolism of nutrients.",
          "It's also fundamental for the immune system to work properly, and it helps regulate the expression of a great many genes.",
        ],
      },
      cobre: {
        titulo: "Copper (Cu)",
        grupo: "🧱 Minerals",
        claves: [
          "Energy, connective tissue and antioxidant defense",
          "Without it, iron isn't put to good use",
          "Which is why it touches oxygen transport too",
        ],
        parrafos: [
          "Copper takes part in enzymes involved in producing energy, forming connective tissue and protecting against oxidative stress.",
          "It's also needed for iron metabolism and for hemoglobin synthesis, so it contributes indirectly to carrying oxygen.",
        ],
      },
      yodo: {
        titulo: "Iodine (I)",
        grupo: "🧱 Minerals",
        claves: [
          "Without iodine there are no thyroid hormones",
          "They're what sets the pace of your metabolism",
          "And the development of the nervous system",
        ],
        parrafos: [
          "Iodine is essential for making the thyroid hormones (T₃ and T₄).",
          "Those hormones regulate metabolism, growth, the development of the nervous system and how much energy your cells use.",
        ],
      },
      selenio: {
        titulo: "Selenium (Se)",
        grupo: "🧱 Minerals",
        claves: [
          "It's part of several antioxidant enzymes",
          "It protects against free radical damage",
          "The thyroid and your defenses depend on it",
        ],
        parrafos: [
          "It's part of several antioxidant enzymes that protect cells from the damage caused by free radicals.",
          "It also takes part in the working of the thyroid gland and contributes to the immune system working properly.",
        ],
      },
      manganeso: {
        titulo: "Manganese (Mn)",
        grupo: "🧱 Minerals",
        claves: [
          "A cofactor for the metabolism of all three nutrients",
          "It takes part in forming bone",
          "And in the cell's antioxidant defense",
        ],
        parrafos: [
          "It acts as a cofactor for various enzymes involved in the metabolism of carbohydrates, proteins and fats.",
          "It also takes part in forming bone and in the cell's antioxidant mechanisms.",
        ],
      },
    },
  },

  // ── FIBRA ───────────────────────────────────────────────────────────────
  fibra: {
    label: "Fiber",
    resumen: "It isn't absorbed, but it puts everything in order.",
    descripcion: [
      "Fiber is barely digested or absorbed the way the other nutrients are, and yet it plays a fundamental role in the body's overall health. It regulates digestion, keeps you feeling full for longer and feeds the beneficial bacteria in your gut.",
      "Soluble fiber forms a gel that helps regulate blood sugar and cholesterol, while insoluble fiber adds bulk to your stools and speeds up transit through the gut.",
    ],
    tipos: [
      { nombre: "Soluble", desc: "It forms a gel: it regulates sugar and cholesterol, and feeds the microbiota." },
      { nombre: "Insoluble", desc: "It adds bulk and speeds up transit through the gut." },
    ],
    queHacen: [
      "It isn't digested or absorbed the way the other nutrients are.",
      "It regulates digestion and keeps you feeling full for longer.",
      "It's the food of the good bacteria in your gut.",
    ],
    donde: ["Vegetables", "Fruit with the skin on", "Legumes", "Oats", "Whole grains"],
    tarjetas: {
      soluble: {
        titulo: "Soluble fiber",
        claves: [
          "It dissolves in water and forms a gel",
          "It slows the rise in glucose and helps bring cholesterol down",
          "Oats, legumes, apples and chia seeds",
        ],
        parrafos: [
          "It dissolves in water and forms a gel inside your gut. That gel slows digestion down, makes glucose reach your blood more slowly and helps lower cholesterol levels.",
          "You'll find it in foods like oats, legumes, apples or chia seeds.",
        ],
      },
      insoluble: {
        titulo: "Insoluble fiber",
        claves: [
          "It doesn't dissolve: it goes through almost as it came",
          "It adds bulk and gets the gut moving",
          "Whole grains, vegetables, nuts and fruit skin",
        ],
        parrafos: [
          "It doesn't dissolve in water and barely changes during digestion. It increases the bulk of what's in your gut and helps it move along, keeping transit healthy.",
          "You'll find it above all in whole grains, vegetables, nuts and the skin of many fruits.",
        ],
      },
      fermentable: {
        titulo: "Fermentable fiber",
        claves: [
          "It's your bacteria's food",
          "Out of it come butyrate, propionate and acetate",
          "They look after the gut wall and settle inflammation",
        ],
        parrafos: [
          "Some fibers can be fermented by the bacteria in the large intestine. As they do, they produce short-chain fatty acids like butyrate, propionate and acetate, which help keep the gut wall healthy and take part in regulating metabolism and the immune system.",
        ],
      },
    },
  },

  // ── COLESTEROL ──────────────────────────────────────────────────────────
  colesterol: {
    label: "Cholesterol",
    resumen: "Neither good nor bad: essential raw material.",
    descripcion: [
      "Cholesterol is essential for the body. It's part of the membrane of every one of your cells and it's the basis for making hormones, vitamin D and bile salts.",
      "The liver produces most of the cholesterol you need. What matters isn't only how much cholesterol there is, but also how it travels through the blood, inside the HDL and LDL lipoproteins.",
    ],
    tipos: [
      { nombre: "HDL", desc: "Half protein: dense. It picks up leftover cholesterol and takes it back to the liver." },
      { nombre: "LDL", desc: "Half cholesterol: light. It delivers it to your cells, and in excess it stays in the arteries." },
    ],
    queHacen: [
      "It's part of the membrane of every one of your cells, and gives them firmness.",
      "It's the raw material hormones, vitamin D and bile salts are made from.",
      "The body makes most of it in the liver; only some of it comes from food.",
    ],
    donde: ["Eggs", "Organ meats", "Shellfish", "Full-fat dairy", "Fatty meats"],
    tarjetas: {
      colesterol: {
        titulo: "Cholesterol",
        claves: [
          "It's the mortar in the membrane of every one of your cells",
          "Raw material for hormones, vitamin D and bile salts",
          "Your liver makes almost all of it, not your food",
        ],
        parrafos: [
          "Cholesterol is a fatty molecule (a lipid) that's part of the membrane of every one of your cells, giving them firmness and flexibility at the same time — it's like the mortar of the cell membrane.",
          "It's the raw material the body makes hormones from (estrogens, testosterone or cortisol), and it also makes vitamin D and the bile salts that help you digest fats.",
          "Most of your cholesterol is made by your own liver; only a small part comes from food. That's why it's neither good nor bad: it's essential. The problem isn't cholesterol itself, but how it travels through the blood.",
          "Because it's a fat, it doesn't dissolve in blood (which is water). To get around, it travels packed inside particles called lipoproteins: the two main ones are LDL and HDL.",
          "Picture each lipoprotein as a little ball: on the inside, the load of fat; on the outside, a shell of proteins that acts as wrapping and as a label. They all carry both things; what changes between them is the proportion.",
          "And that's where their names come from — nothing to do with «good» and «bad». Fat floats and protein weighs. A particle with a lot of fat and little protein is light: low density, LDL (Low Density Lipoprotein). One with a lot of protein and little fat is heavy: high density, HDL (High Density Lipoprotein). They're called that, literally, because they were discovered by separating them by weight in a centrifuge.",
          "In round numbers: in an LDL, around half its weight is cholesterol and only a quarter is protein. In an HDL it's exactly the other way around — around half is protein and cholesterol is the small part. Same cargo, opposite proportions.",
        ],
      },
      hdl: {
        titulo: "HDL",
        claves: [
          "The truck that COLLECTS: it takes the surplus back to the liver",
          "Half its weight is protein: that's why it's dense",
          "It goes up because you're doing things right; raising it isn't enough",
        ],
        parrafos: [
          "HDL (high-density lipoprotein) is the particle that makes the return trip: it picks up leftover cholesterol from your tissues and from the walls of your arteries and takes it back to the liver to be recycled or removed.",
          "What it carries inside: it's the densest one because it's the one with the MOST protein, around half its weight. Its main protein is called apoA-I. Cholesterol is the small part in it, around a fifth. Lots of packaging and little cargo: that's why it's heavy and why it's «high density».",
          "It makes sense if you think about its job. HDL leaves the liver almost empty, like a truck heading out to collect, and fills up along the way with the cholesterol it takes out of the tissues. It starts as almost pure protein and gradually loads up.",
          "That's why it's colloquially called «good cholesterol»: it helps clear the surplus and keep the arteries clean.",
          "High HDL levels are associated with better cardiovascular health. Physical exercise and healthy fats (olive oil, oily fish, tofu, nuts) help raise it.",
          "One nuance worth knowing: when drugs that raise HDL have been tested, heart attacks didn't go down. That suggests high HDL is above all the sign of a metabolism that's working well, rather than the cause of that good health. It goes up because you're doing things right; raising it isn't enough.",
        ],
      },
      ldl: {
        titulo: "LDL",
        claves: [
          "The truck that DELIVERS cholesterol to your cells",
          "Half its weight is cholesterol: that's why it's light",
          "The problem is having many of them for a long time",
        ],
        parrafos: [
          "LDL (low-density lipoprotein) is the particle that delivers cholesterol from the liver to the cells that need it.",
          "What it carries inside: it's the one that carries the MOST cholesterol, around half its weight, and only about a quarter is protein. Being so loaded with fat and carrying so little packaging, it doesn't weigh much: that's why it's «low density». It carries a single large protein, apoB-100, which works as a delivery label: it's the one cells recognize to hook it and take its cargo.",
          "Notice the symmetry with HDL: LDL leaves the liver full and goes around delivering, while HDL leaves empty and goes around collecting. One is the delivery truck and the other the collection truck. And since cholesterol weighs less than protein, the one loaded with cholesterol is precisely the light one.",
          "It's colloquially called «bad cholesterol», but it does a job that needs doing: without it, your cells wouldn't get the cholesterol they build their membranes and your hormones with. The problem appears when there are too many LDL particles circulating for too long: they end up slipping into the artery wall, oxidizing there and attracting immune cells that swallow them and get stuck, forming the plaque that gradually narrows the vessel (atherosclerosis).",
          "Hence an important idea: what counts most isn't only how much cholesterol they carry, but how many particles there are. Since each LDL carries exactly one apoB-100, measuring apoB means counting particles, and it usually reflects risk better than LDL cholesterol on its own. If it shows up in your blood work, now you know what it's counting.",
          "That's why it's worth keeping LDL at reasonable levels, above all by avoiding excess trans fats, tobacco and being overweight.",
        ],
      },
    },
  },

  // ── ETANOL ──────────────────────────────────────────────────────────────
  etanol: {
    label: "Ethanol",
    resumen: "Alcohol: empty energy the body puts first.",
    descripcion: [
      "Ethanol is the alcohol found in alcoholic drinks. It provides 7 kcal per gram, but it has no vitamins or minerals, so it's considered a source of «empty calories». More than that, the body treats it as a potentially toxic substance and metabolizes it in the liver ahead of other nutrients.",
    ],
    tipos: [
      { nombre: "Ethanol", desc: "The only alcohol we drink. It's formed by fermenting sugars." },
      { nombre: "Methanol and others", desc: "Toxic: not fit to drink." },
    ],
    queHacen: [
      "It provides 7 kcal per gram, but no vitamins or minerals: «empty calories».",
      "The body treats it as a toxin and processes it in the liver before anything else.",
      "While it's clearing it, fat burning stops and the liver is overloaded.",
    ],
    donde: ["Wine", "Beer", "Liquor and spirits", "Alcoholic ferments"],
    tarjetas: {
      etanol: {
        titulo: "Ethanol (CH₃CH₂OH)",
        claves: [
          "7 kcal per gram and not one single nutrient",
          "The liver treats it as a toxin and clears it first",
          "Even cleared fast, it always leaves some damage behind",
        ],
        parrafos: [
          "It's the molecule found in alcoholic drinks.",
          "It provides energy (7 kcal per gram, almost as much as fat — which is to say alcohol is very calorific), but it isn't an essential nutrient and it takes no part in building tissue.",
          "When it reaches the liver, the body makes clearing it the priority, because it can be toxic to cells. What's more, even when it's cleared quickly, it always causes some collateral damage. What we do isn't free.",
        ],
      },
      acetaldehido: {
        titulo: "Acetaldehyde (CH₃CHO)",
        claves: [
          "The first thing alcohol is turned into",
          "More reactive and more toxic than ethanol itself",
          "If it lingers, it damages proteins, membranes and DNA",
        ],
        parrafos: [
          "It's the first molecule formed when the liver metabolizes ethanol.",
          "It's far more reactive and toxic than the alcohol itself, and it can damage proteins, membranes and DNA if it stays in your cells too long. That's why the body tries to transform it quickly.",
        ],
      },
      acetato: {
        titulo: "Acetate (CH₃COO⁻)",
        claves: [
          "The end of the alcohol route",
          "By now it's barely toxic: it's used for energy or removed",
          "Getting here as fast as possible is the liver's priority",
        ],
        parrafos: [
          "It's the end product of alcohol metabolism. It's a far less toxic molecule that can be used to produce energy or simply removed.",
          "Turning acetaldehyde into acetate is one of the liver's main goals after you drink alcohol.",
        ],
      },
    },
  },

  // ── AGUA ────────────────────────────────────────────────────────────────
  agua: {
    label: "Water",
    resumen: "The medium where all of Life happens.",
    descripcion: [
      "Water is an asymmetrical molecule: two hydrogens joined to an oxygen, forming a V. Because the oxygen pulls harder on the electrons, one end ends up with a negative charge and the other positive, so every molecule works like a tiny magnet. Everything else comes out of that asymmetry: it's why water surrounds salts and sugars and keeps them dissolved and moving, and why it can't hold on to fats, which flee from it and in doing so form the membranes of your cells.",
      "In the body it does three jobs at once: it's the medium where every chemical reaction happens (and it takes part in many of them), it's the transport system, because blood is water with things in it, and it's the temperature regulator. It also lubricates your joints and eyes and cushions your brain.",
      "And it gives volume: the water in your plasma is what fills your vessels and holds up your blood pressure. How it's shared out between the blood, the tissues and the inside of your cells is decided by sodium, because water always moves toward wherever there's more salt. Which is why hydrating isn't only drinking, it's drinking with salts.",
    ],
    tipos: [
      { nombre: "Intracellular water", desc: "Inside your cells: around two thirds of the total." },
      { nombre: "Plasma water", desc: "The water that fills your vessels and gives volume to your blood." },
      { nombre: "Interstitial water", desc: "The water that bathes your cells from outside, between one and the next." },
    ],
    queHacen: [
      "It's the medium of every chemical reaction, and it takes part in many of them.",
      "It gives volume to your blood and carries everything that travels dissolved.",
      "It regulates temperature, lubricates and cushions.",
    ],
    donde: ["Water", "Fruit and vegetables", "Broths and soups", "Infusions", "Dairy"],
  },

  // ── FITOQUÍMICOS ────────────────────────────────────────────────────────
  fitoquimicos: {
    label: "Phytochemicals",
    resumen: "The plant's defense, working for you.",
    descripcion: [
      "Phytochemicals are natural compounds plants produce to protect themselves, and that turn out to be good for our health too. Many act as antioxidants that neutralize free radicals, while others switch on the body's own defense mechanisms. Every color of fruit and vegetable hides a different family of phytochemicals. Which is why eating a varied diet, rich in plants, brings you a wider range of these beneficial compounds.",
    ],
    tipos: [
      { nombre: "Flavonoids", desc: "The antioxidant pigments of fruit, vegetables and tea." },
      { nombre: "Carotenoids", desc: "The orange and red pigments (carrot, tomato)." },
      { nombre: "Glucosinolates", desc: "From the brassicas (broccoli): they switch on protective enzymes." },
    ],
    queHacen: [
      "Many act as antioxidants and neutralize free radicals.",
      "Others switch on genes that make your own protective enzymes.",
      "Every color hides a different family with different jobs.",
    ],
    donde: ["Colorful fruit", "Vegetables", "Legumes", "Nuts", "Spices (turmeric)"],
    tarjetas: {
      antocianinas: {
        titulo: "Anthocyanins",
        claves: [
          "The purple and red of blueberries, blackberries and red cabbage",
          "They donate electrons to free radicals",
          "They relax your vessels: they raise nitric oxide",
        ],
        parrafos: [
          "They're the pigments that give the deep purple, blue and red color to foods like blueberries, blackberries, cherries or red cabbage.",
          "In plants they help protect against ultraviolet radiation and environmental stress.",
          "In our body they act as antioxidants — that is, they donate electrons to free radicals (molecules out looking for electrons) before those can damage proteins, fats or DNA.",
          "They can also improve the function of the endothelium, the layer that lines the inside of your blood vessels, which is good for cardiovascular health. They manage it by stimulating an enzyme that raises the availability of nitric oxide, a gas that relaxes and widens blood vessels.",
        ],
      },
      carotenoides: {
        titulo: "Carotenoids",
        claves: [
          "The yellow, orange and red of the vegetable garden",
          "Beta-carotene is turned into vitamin A",
          "Lutein and zeaxanthin settle into your retina",
        ],
        parrafos: [
          "They're the yellow, orange and red pigments found in carrots, squash, tomatoes, peppers and many fruits.",
          "In plants they capture part of the energy of light and protect them from too much solar radiation.",
          "Some, like beta-carotene, can be turned into vitamin A. Others, like lutein and zeaxanthin, build up in the retina, where they help filter blue light and protect the photoreceptor cells from oxidative damage.",
        ],
      },
      flavonoides: {
        titulo: "Flavonoids",
        claves: [
          "The largest family: fruit, cacao, tea and onion",
          "Antioxidants, but regulators above all",
          "They touch inflammation, clotting and your arteries",
        ],
        parrafos: [
          "They make up one of the largest families of phytochemicals, and you'll find them in fruit, vegetables, onion, cacao, tea and citrus.",
          "Many of these molecules act as antioxidants, but they also regulate the activity of enzymes and proteins involved in inflammation, clotting and the function of blood vessels.",
          "Some even encourage the production of nitric oxide, helping the arteries relax.",
          "Go deeper: flavonoids can do this because they inhibit the enzymes that make prostaglandins, which regulate contraction and pain; they hold back the signals that set off the formation of clots; and they encourage the production of nitric oxide, which relaxes the arteries, by activating the enzyme in charge of making it.",
        ],
      },
      glucosinolatos: {
        titulo: "Glucosinolates",
        claves: [
          "From broccoli, cabbage and cauliflower",
          "Cut or chew them and sulforaphane appears",
          "They switch on YOUR antioxidant and detox enzymes",
        ],
        parrafos: [
          "They're the compounds that characterize broccoli, cabbage, cauliflower and Brussels sprouts.",
          "While the plant stays intact they barely react, but when you cut it or chew it they come into contact with an enzyme that turns them into molecules like sulforaphane.",
          "Those raise the production of our own cells' antioxidant and detoxifying enzymes.",
        ],
      },
      polifenoles: {
        titulo: "Polyphenols",
        claves: [
          "A huge family: olive oil, cacao, coffee, grapes and tea",
          "More than antioxidants, they're messengers",
          "They change which genes get switched on and which don't",
        ],
        parrafos: [
          "Polyphenols are a huge family that takes in thousands of phytochemicals, including many flavonoids.",
          "You'll find them in extra virgin olive oil, cacao, coffee, grapes, tea and a great many fruits.",
          "Rather than acting directly as antioxidants, many work as signalling molecules that change the expression of genes tied to inflammation, metabolism and protection against oxidative stress.",
        ],
      },
      fitoesteroles: {
        titulo: "Phytosterols",
        claves: [
          "They look a great deal like cholesterol",
          "They take its place in the gut's transporter",
          "The result: LDL cholesterol goes down",
        ],
        parrafos: [
          "They're plant molecules with a structure very much like that of cholesterol.",
          "During digestion they compete with it for the same transporters in the gut, which lowers the amount of cholesterol we manage to absorb.",
          "As a result, the liver takes more cholesterol out of the blood to make up for that loss, which helps bring LDL cholesterol levels down.",
        ],
      },
      terpenos: {
        titulo: "Terpenes",
        claves: [
          "The aroma of herbs, spices and citrus",
          "In the plant they attract pollinators or defend it",
          "Limonene, menthol and pinene: antioxidant and anti-inflammatory",
        ],
        parrafos: [
          "They're an enormous family of aromatic molecules found in herbs, spices, citrus and many medicinal plants.",
          "In nature they serve to attract pollinators, repel insects or fend off microorganisms.",
          "Some, like limonene, menthol or pinene, also show antioxidant, anti-inflammatory and antimicrobial properties for us.",
        ],
      },
      licopeno: {
        titulo: "Lycopene",
        claves: [
          "The deep red of tomato, watermelon and grapefruit",
          "It neutralizes singlet oxygen, which is very damaging",
          "It's studied for its cardiovascular role",
        ],
        parrafos: [
          "Lycopene is a carotenoid responsible for the deep red color of tomatoes, watermelon and pink grapefruit.",
          "It stands out for its ability to neutralize singlet oxygen, a highly reactive form of oxygen that can damage cell membranes and DNA.",
          "Various studies link it to better cardiovascular health and to the protection of certain tissues, such as the prostate, though its exact role is still being researched.",
        ],
      },
      isoflavonas: {
        titulo: "Isoflavones",
        claves: [
          "The flavonoids of soy, tofu and tempeh",
          "They look like estrogens, but far weaker",
          "Depending on the tissue, they activate or block the receptor",
        ],
        parrafos: [
          "They're flavonoids found mainly in soy, tofu, tempeh and other soy products.",
          "Their structure resembles that of human estrogens, so they can bind to some of their receptors, though far less strongly.",
          "Depending on the tissue, they can partly activate or partly block those receptors, which is why they're studied for their possible role in bone and cardiovascular health, and in easing some symptoms of menopause.",
        ],
      },
    },
  },

  // ── EDULCORANTES ────────────────────────────────────────────────────────
  edulcorantes: {
    label: "Sweeteners",
    resumen: "Sweetness without sugar: what it does to your brain.",
    descripcion: [
      "Sweeteners aren't a nutrient: they're molecules that fit into your sweet receptor without being a fuel. Your tongue reads them as sugar, your metabolism can't use them, and almost all of them leave the body the way they came in. That's where their zero calories come from: there's nothing magic about it, they're simply molecules you don't know how to digest.",
      "Their potency is enormous. Saccharin is about 300 times sweeter than sugar, sucralose about 600, and some are over 20,000 times sweeter. Which is why the amount you're carrying in a «zero» soft drink is minuscule, and why table sweeteners come mixed with a filler: on their own they'd be impossible to dose.",
      "What's interesting isn't what they give you, but what they throw off. Sweetness, to your body, isn't a flavor: it's an announcement that energy is coming. When the announcement arrives and the energy doesn't, the body responds to that contradiction — and that's where the whole argument about them lives.",
    ],
    tipos: [
      { nombre: "Artificial high-intensity", desc: "Aspartame, sucralose, saccharin, acesulfame K. Synthetic and hugely potent." },
      { nombre: "Plant high-intensity", desc: "Stevia and monk fruit. Natural, but just as intense." },
      { nombre: "Sugar alcohols", desc: "Erythritol, xylitol, sorbitol, maltitol. Mild sweetness and a laxative effect." },
    ],
    queHacen: [
      "They switch on your sweet receptor without providing any usable energy.",
      "They set off a prediction of glucose that then doesn't come true.",
      "They don't cause cavities or raise your blood sugar, but they keep the sweet habit alive.",
    ],
    donde: ["«Zero» soft drinks", "0% yogurts and desserts", "«Sugar-free» gum", "Protein powder", "Light sauces and cookies"],
    tarjetas: {
      aspartamo: {
        titulo: "Aspartame",
        claves: [
          "The one in «light» soft drinks: 200 times sweeter",
          "The only one that is digested: it's two amino acids",
          "«Possibly carcinogenic», on limited evidence",
        ],
        parrafos: [
          "It's the sweetener in classic «light» soft drinks, and it's about 200 times sweeter than sugar.",
          "It's the only one that does get digested: it's made of two amino acids (aspartic acid and phenylalanine) plus a little methanol, and the gut splits it into those pieces, which already exist in ordinary food. So technically it does have calories, but it's used in such small amounts that they don't count.",
          "Because of that phenylalanine it carries a warning on the label: people with phenylketonuria, a genetic condition that stops them processing it, need to avoid it.",
          "In 2023 the World Health Organization classified it as «possibly carcinogenic» on limited evidence, and at the same time left the acceptable daily intake untouched. Translated: the signal is weak and ordinary consumption is still considered acceptable, but it isn't a product to lean on.",
        ],
      },
      sucralosa: {
        titulo: "Sucralose",
        claves: [
          "It's sugar with three pieces swapped for chlorine",
          "600 times sweeter, and now indigestible",
          "It survives the oven; its effect on the microbiota is being studied",
        ],
        parrafos: [
          "It's made from sugar, by replacing three of its pieces with chlorine. That small change makes it about 600 times sweeter and, above all, indigestible: your enzymes no longer recognize it.",
          "Most of it crosses the gut without being absorbed and leaves in your stools, which makes it very stable — including under heat — and that's why it's the usual one in «sugar-free» baked goods.",
          "It's one of the most studied for its possible effect on the microbiota, with results that vary a great deal from one person to another.",
        ],
      },
      estevia: {
        titulo: "Stevia",
        claves: [
          "It isn't the leaf: it's its steviol glycosides",
          "Coming from a plant doesn't change what matters",
          "It leaves a bitter aftertaste: it almost always comes with erythritol",
        ],
        parrafos: [
          "What gets used isn't the leaf, but some molecules extracted from it, the steviol glycosides, about 300 times sweeter than sugar.",
          "Coming from a plant doesn't change what matters: it's still intense sweetness with no energy behind it, and your brain can't tell where it came from. The bacteria in your gut strip off the sugars hanging from it, and the rest is absorbed, passes through the liver and leaves in your urine.",
          "Its weak point is the taste: it leaves a bitter or metallic aftertaste, which is why it almost always comes mixed with erythritol.",
        ],
      },
      eritritol: {
        titulo: "Erythritol",
        claves: [
          "A sugar alcohol: 70% as sweet as sugar",
          "It's absorbed and leaves in your urine: gentler than its siblings",
          "In 2023 it was linked to more cardiovascular events",
        ],
        parrafos: [
          "It's a sugar alcohol: neither a sugar nor a high-intensity sweetener, but something in between. It's 70% as sweet as sugar, so it's used by the spoonful rather than by the drop, and it leaves a cool feeling in your mouth.",
          "Unlike its siblings, it's absorbed in the small intestine and leaves almost untouched in your urine, so it sits better and barely ferments. Your own body, in fact, makes small amounts of it out of glucose.",
          "In 2023 a paper was published that linked high blood levels of erythritol to more platelet aggregation and more cardiovascular events. It's a finding still to be confirmed and not a conviction, but it's the reason it's stopped being treated as the harmless sweetener by default.",
        ],
      },
      xilitol: {
        titulo: "Xylitol",
        claves: [
          "Sweetness almost identical to sugar's",
          "The bacteria in your mouth can't ferment it: no cavities",
          "Careful: it's very toxic to dogs",
        ],
        parrafos: [
          "Another sugar alcohol, with a sweetness almost identical to sugar's. It's the one in «sugar-free» gum and toothpaste, and there it has a real advantage: the bacteria in your mouth can't ferment it, so it doesn't cause cavities and even makes them harder to form.",
          "It's only partly absorbed, so a good share of it reaches the colon, where the microbiota ferments it. Hence the gas, the bloating and the laxative effect if you overdo it.",
          "An important warning almost nobody knows: it's very toxic to dogs, even in small doses. A piece of gum forgotten in a bag can be a serious problem.",
        ],
      },
    },
  },

  // ── DROGAS ──────────────────────────────────────────────────────────────
  drogas: {
    label: "Drugs",
    resumen: "Molecules that don't feed you: they occupy locks.",
    descripcion: [
      "This isn't a nutrient. A nutrient comes in, is broken down and becomes you: membrane, enzyme, energy. A drug comes in, sits down in a lock you already had, leaves a message your body never asked for, and goes. Nothing of it stays behind as part of you.",
      "Hardly any of them invent anything new, and that's the fascinating part: they work because they resemble something of yours. Nicotine fits into your acetylcholine receptors; THC into those of your own cannabinoids; caffeine into those of your adenosine; ibuprofen blocks one of your enzymes. They're fake keys for genuine locks. That's why they work so well, and why they throw so much off.",
      "And that's the key to why they wear you down little by little. Your cell isn't passive: when a message arrives too strongly and too often, it defends itself by changing its machinery. It pulls receptors back, or makes more of them, or adjusts the enzyme that clears them. That's tolerance: the same dose no longer does the same thing. And it's also withdrawal, because the system is now calibrated to work WITH the substance, and without it, it's left off balance. On top of that comes the silent bill: the liver spending its detox machinery and its antioxidants on every dose, and oxidative stress and inflammation piling up in tissues that don't hurt.",
      "None of this is a moral judgement, and some of these molecules are excellent medicines. But it's worth understanding what happens inside us when they come in.",
    ],
    tipos: [
      { nombre: "Anti-inflammatories and painkillers", desc: "Ibuprofen, paracetamol. They block enzymes of yours." },
      { nombre: "Cannabinoids", desc: "THC: it occupies the receptors of your own endocannabinoids." },
      { nombre: "Nicotine (smoke and aerosol)", desc: "Tobacco and vapes: the same key, a different vehicle." },
      { nombre: "Everyday stimulants", desc: "Caffeine: it doesn't give you energy, it covers up your sleepiness." },
    ],
    queHacen: [
      "They occupy receptors and enzymes of your own: fake keys for real locks.",
      "The cell recalibrates (tolerance) and without the substance it's left off balance.",
      "Your liver, your kidneys and your antioxidants pay the bill for every dose.",
    ],
    donde: ["Over-the-counter pharmacy", "Tobacco and vapes", "Cannabis", "Coffee, tea and energy drinks", "Alcohol (see Ethanol)"],
    tarjetas: {
      ibuprofeno: {
        titulo: "Ibuprofen",
        claves: [
          "It cures nothing: it switches off the warning",
          "It blocks COX, and with it pain, fever and swelling",
          "It also takes away your stomach's shield and your kidney's blood flow",
        ],
        parrafos: [
          "Ibuprofen cures nothing: it switches off a warning. And to understand what it does you have to start with a beautiful detail: the molecule you make pain with comes out of your own cell membrane.",
          "When a tissue is damaged, a fatty acid is released from the membrane: arachidonic acid. Two enzymes called COX (cyclooxygenase 1 and 2) turn it into prostaglandins, which are local messengers with extremely short lives. Some sensitize the nerve endings, and then what didn't hurt before does hurt (there's your pain); others turn up the thermostat in the hypothalamus (there's the fever); others widen the vessels and let fluid out (there are the swelling and the redness).",
          "Ibuprofen slips into the slot where COX grabs arachidonic acid and blocks it. With no COX there are no prostaglandins, and with no prostaglandins there's no pain, no fever and no swelling. Notice what has NOT happened: the damage is still exactly where it was. All you've done is silence the messenger that was telling you about it.",
          "And here comes the price. COX-2 is the one that fires up when there's inflammation, but COX-1 is switched on all day doing maintenance work nobody sees. It makes the prostaglandin that keeps up the layer of mucus and bicarbonate protecting your stomach from its own acid, the one that keeps blood flowing inside the kidney when there's little water, and the one platelets use to clot. Ibuprofen doesn't tell them apart: it blocks both.",
          "In the stomach, that means a lining with no shield. Gastritis, erosions and ulcers appear, and the dangerous part is that often they give little or no warning: the very drug that's stripping the lining is the one switching off the pain that would have alerted you. It's taken with food not because that «protects» you, but because part of the damage is by direct contact; the rest arrives through the blood and happens anyway.",
          "In the kidney, those prostaglandins are what keep open the arterioles that bring blood to the filter. If you're dehydrated, you've sweated a lot in a long race, or you take certain blood pressure medicines, your kidney depends on them not to be left without flow. Taking them away right then is the classic setup for acute kidney failure from anti-inflammatories, and it's one of the reasons «preventive» ibuprofen before a marathon isn't a good idea.",
          "With repeated use over years, the bill adds up in quiet ways: sodium and water retention (blood pressure climbs a few points and the drugs meant to bring it down work less well), a gradual loss of kidney function, and in the small intestine an increase in the permeability of the barrier that the microbiota notices. At high, sustained doses it's also associated with more cardiovascular risk.",
          "None of this makes it an enemy: it's a splendid medicine and sometimes an indispensable one. What's worth looking at squarely is the daily «just in case», the box in your bag, the ibuprofen taken every afternoon for months. Pain that comes back again and again is a question that needs answering, not a signal that needs switching off.",
        ],
      },
      paracetamol: {
        titulo: "Paracetamol",
        claves: [
          "It takes away pain and fever, but barely brings inflammation down",
          "It acts in the brain, not in the inflamed tissue",
          "You pay for it in the liver: every dose spends glutathione",
        ],
        parrafos: [
          "It resembles ibuprofen in what you feel and resembles it in nothing at all on the inside. Paracetamol takes away pain and brings fever down, but it's barely anti-inflammatory: it acts mostly in the central nervous system, not in the inflamed tissue. In fact, its exact mechanism is still debated; it's credited with inhibiting COX inside the brain, and with a metabolite of its own (AM404) that acts on pain receptors and on the cannabinoid system. That's why it doesn't leave your stomach or your kidney unprotected the way an anti-inflammatory does.",
          "Its story is somewhere else: in the liver. And it's the best example there is that toxicity doesn't depend on the molecule you take, but on what your body turns it into.",
          "Most paracetamol gets «labelled» so it can be cleared out: the liver sticks a molecule onto it (a glucuronide or a sulfate) that makes it soluble, and out it goes in your urine, no more to it. But a small fraction, around 5–10%, is picked up by another enzyme, CYP2E1, which oxidizes it into NAPQI: an extremely reactive metabolite capable of sticking to the cell's proteins and wrecking them.",
          "You have a fire extinguisher for that. Glutathione, the master antioxidant of your cells, neutralizes NAPQI as soon as it appears. At a normal dose, the extinguisher has plenty to spare and you notice nothing. The problem is that glutathione is a limited tank, and there are three ways to run out of it: taking too much, having CYP2E1 running fast (chronic alcohol induces it, so it makes MORE NAPQI than usual), or arriving with the tank already low (prolonged fasting, undernourishment, illness). When glutathione runs out, NAPQI is left free and starts killing liver cells.",
          "Which is why paracetamol is, in many countries, the leading cause of acute liver failure from medicines. And almost never on purpose: the gap between the useful dose and the dangerous one is narrower than people think, and the doses add up without your noticing, because many cold remedies and combination painkillers already have it inside. Two «different things» from the pharmacy can be the same drug twice.",
          "The detail I most like telling: the antidote in the emergency room is N-acetylcysteine, which is raw material for making glutathione. You don't attack the drug, you refill the cell's extinguisher. And even though a normal dose does you no harm at all, understanding this changes how you look at it: every gram is paid for in antioxidant currency, the very same currency your liver defends itself with against everything else life brings.",
        ],
      },
      marihuana: {
        titulo: "Marijuana (THC)",
        claves: [
          "You already make cannabinoids: they're your volume knob",
          "THC turns it down across your WHOLE brain, for hours",
          "The neuron defends itself by removing receptors: tolerance",
        ],
        parrafos: [
          "To understand marijuana you have to start with something almost nobody knows: you already make cannabinoids. They're called anandamide and 2-AG, and they're the brain's fine-tuning system. They work the opposite way round to a normal neurotransmitter: they're made by the neuron that RECEIVES the message and travel backwards, to the one sending it, to say «turn the volume down». They're the intensity knob, and with it you regulate appetite, pain, anxiety, sleep, memory, and even which memories get filed away and which get let go.",
          "That system has three rules: it's made on the spot (there's no warehouse), it acts only in the exact synapse that needs it, and it's destroyed in seconds. Precise, local and brief.",
          "THC fits into the same receptor, CB1, and breaks all three rules at once. It isn't made by a particular neuron: it arrives through the blood and floods the whole brain at the same time. It isn't local: it turns the volume down everywhere, including where nobody asked for it. And it doesn't switch off in seconds: it stays for hours. It isn't a volume knob, it's a finger resting on the button.",
          "Everything you feel comes out of the map of where CB1 is, and it isn't scattered at random. There's a lot of it in the hippocampus, the factory of new memory: hence how hard it is to hold on to what just happened. There's a lot in the prefrontal cortex, which plans and holds back impulses: hence the disinhibition and the difficulty keeping a thread. There's a lot in the cerebellum and the basal ganglia, which coordinate movement: hence the clumsiness and the long reaction time, which is what makes driving dangerous. And there's some in the hypothalamus, where the system regulates hunger: hence the sudden appetite, which on top of that works by activating the very neurons that normally say «you've eaten enough».",
          "And now the slow wearing down. On receiving that outsized message over and over, the neuron protects itself by removing CB1 receptors from its surface. It's a physical, measurable change: brain imaging studies show the drop in habitual users. Two consequences. The first, tolerance: you need more for the same effect. The second, and more important, is that now your own system has fewer places to fit into, and that system was the one regulating your baseline appetite, sleep and anxiety. Which is why, on stopping, you get irritability, insomnia, vivid dreams, no appetite and a diffuse malaise: it isn't «weakness», it's a system out of calibration looking for its setting. The good news is that the receptors recover within a few weeks of abstinence.",
          "There's a time when this weighs far more: the developing brain. The maturing of the prefrontal cortex and the pruning of surplus connections go on past your twenties, and the endocannabinoid system is one of the signals guiding that work. Disturbing it while it's still being built isn't the same as disturbing it once it's finished: heavy, early use is associated with worse verbal memory and attention, and with a higher risk of psychosis in people who are predisposed. And the dose matters more than ever, because today's cannabis concentrates several times more THC than it did a few decades ago: the «same old» plant isn't the same plant.",
          "Two details that get overlooked. One: smoked, it's smoke. Combustion means tars, carbon monoxide, bronchial irritation and a chronic cough, regardless of the plant being natural; lungs can't tell where smoke came from. And two: THC is so fat-soluble that it's stored in fat tissue and released slowly over days or weeks. Which is why it's detected long afterwards, and why the body takes a while to get all the way back to where it was.",
        ],
      },
      tabaco: {
        titulo: "Tobacco",
        claves: [
          "Nicotine is what hooks you; smoke is what kills you",
          "Your brain makes MORE receptors: what you feel is the craving",
          "Almost everything improves when you stop, and sooner than you'd think",
        ],
        parrafos: [
          "There are two different things in a cigarette, and confusing them is the mistake that keeps the habit alive: nicotine is what hooks you, and smoke is what kills you. Nicotine, on its own, isn't what causes cancer. Cancer is brought by the more than seventy carcinogens travelling in the smoke. Nicotine is only the reason you keep breathing that smoke twenty times a day.",
          "Nicotine fits into the nicotinic acetylcholine receptors, the same ones your body uses to move a muscle and to hold your attention (you'll see them in Physiology). When you inhale it, it reaches the brain in about ten seconds and makes the reward circuit release dopamine. Fast, intense and repeated hundreds of times a day: there is no more efficient way of burning a lesson into a brain. It isn't weak character, it's the law of reinforcement working perfectly.",
          "And the cell responds in exactly the opposite way to what you'd expect: it makes MORE receptors. With nicotine always occupying them, the brain raises the number to keep its balance. When the levels drop, all those extra receptors are left empty, and that gap is exactly what you feel as craving. There's the trap: the morning cigarette isn't a pleasure, it just puts out eight hours of sleep's worth of withdrawal. You smoke to get back to the normal of someone who doesn't smoke.",
          "Of the smoke, the first thing to act is carbon monoxide. It sticks to hemoglobin between 200 and 250 times better than oxygen does, so a percentage of your red blood cells stop carrying oxygen and spend the day ferrying monoxide around. Your whole body breathes a little worse: muscles perform less, skin is fed less well, wounds close more slowly.",
          "Then there's the endothelium, the one-cell-thick layer lining the inside of every artery you have. Smoke punishes it directly: free radicals, less available nitric oxide (the molecule the artery relaxes with), more platelets sticking. The result: stiffer arteries, more plaque, more tendency to form clots. Hence the heart attack, the stroke, the legs that hurt when you walk, and erectile dysfunction, which is often the first warning of a general vascular problem.",
          "In the lung, the damage starts with the cleaning. Your airways are carpeted with cilia, tiny hairs that sweep the mucus upward along with everything caught in it. Smoke paralyzes them and then destroys them, so the mucus stays put: hence the cough and hence the repeated infections. Deeper in, smoke tips the balance between the enzymes that break tissue down and the ones that protect it, and the alveoli, those little sacs where oxygen comes in, gradually rupture. That's COPD, and unlike almost everything else, it doesn't come back: a lost alveolus is gone.",
          "And in the DNA, the slowest and quietest part. Carcinogens like benzopyrene and nitrosamines don't damage it directly: your own liver, trying to clear them out, turns them into reactive molecules that stick to DNA and form adducts. Your repair systems fix the vast majority. But every drag is another roll of the dice, and it only takes one error landing in the wrong gene and surviving. Which is why lung cancer isn't a matter of bad luck or of justice, but of probability piled up over years.",
          "Then there's a quiet wearing down that gets talked about less: smoke burns through vitamin C and antioxidants at a huge rate, switches on the enzymes that break down the collagen in your skin (hence the fine wrinkles and that very characteristic skin aging), worsens bone density, brings menopause forward, makes healing after any surgery harder and increases insulin resistance. There isn't a single system in the body left out of it.",
          "And that's precisely why the ending is worth it: almost everything improves when you stop, and sooner than you'd think. The monoxide clears in hours. Taste and smell come back in days. The cilia regenerate over weeks and months (that cough that appears when you quit is the lung finally cleaning itself). Cardiovascular risk falls by close to half in the first year, and cancer risk keeps dropping for decades. The body holds no grudge: as soon as you stop giving it reasons, it gets to work repairing.",
        ],
      },
      vaper: {
        titulo: "Vape",
        claves: [
          "No combustion: less bad than tobacco, which isn't harmless",
          "Nicotine salts take away the cough, which was the brake",
          "Heated, the liquid leaves behind carbonyls and metals",
        ],
        parrafos: [
          "There's no combustion here, and that's the real difference: a coil heats a liquid (propylene glycol, vegetable glycerin, nicotine and flavorings) and turns it into an aerosol. With no fire there's no tar and hardly any carbon monoxide, so for someone who smokes and switches over completely to vaping, it's less bad. The problem is the leap that was made with that sentence: «less bad than the worst thing» was sold as «harmless», and those aren't the same.",
          "Let's start with nicotine, because vaping changed its engineering. Nicotine salts (nicotine with an acid, usually benzoic) make possible a smooth vapor that doesn't scratch your throat even at very high concentrations. The cough was the cigarette's natural brake; take it away and you inhale more nicotine, more often and for longer, without the ritual that marked an end. A disposable can hold the nicotine equivalent of a whole pack or more, and it goes in your pocket for odd puffs all day long. The consequence is a dependence that settles in faster and harder, especially in teenagers, in a brain where nicotine remodels the attention and reward circuits that are still being built.",
          "And the aerosol isn't water vapor either. Propylene glycol and glycerin are harmless in a syrup, but heated on a coil they break down into carbonyls: formaldehyde, acetaldehyde, acrolein. They're airway irritants and some are classified as carcinogens. The amount isn't fixed: it rises with the device's power and shoots up when the wick is dry (the «dry hit», that burnt taste). To that you add metals the aerosol itself strips off the coil and the solder: nickel, chromium, tin, lead. None of that was on the liquid's label.",
          "Inside the cell, what the studies on bronchial epithelium show is consistent with that: oxidative stress, an inflammatory response, disturbed beating of the cilia (that lung-sweeping broom again) and a weaker defense against viruses and bacteria. In the vascular system, arterial stiffness and endothelial dysfunction have been measured after a single vaping session. Less damage than smoke, yes; zero, no.",
          "The flavorings, which seem like the most innocent detail, are among the least studied. Diacetyl, which gives that buttery, sweet taste, was linked to bronchiolitis obliterans (an irreversible scarring of the finest bronchioles) in popcorn factory workers who breathed it in. Cinnamaldehyde and menthol disturb the function of cilia and of the macrophages that patrol the alveolus. The point is simple: a molecule can be perfectly safe eaten and behave completely differently heated to 250 degrees and inhaled. Those are two different questions and only one of them has been answered.",
          "It's worth remembering 2019, when hundreds of cases of severe acute lung injury appeared — so-called EVALI — mostly from vitamin E acetate used as a thickener in illegal THC cartridges. Vitamin E is an excellent antioxidant. Inhaled, it was an oil coating the alveolus. It's the best available lesson in what happens when you inhale substances whose behavior in the lung nobody had studied.",
          "The honest summary has two parts that don't contradict each other. As a tool for quitting smoking, with support and with an end date, it has evidence behind it and it's preferable to tobacco. As a starting product, it's a very effective dependence device that uses the lung as a testing ground, and one that nobody can say what will be seen from at thirty years, for the simplest reason of all: thirty years haven't gone by yet.",
        ],
      },
      cafeina: {
        titulo: "Caffeine",
        claves: [
          "It doesn't give you energy: it covers up the tiredness you already have",
          "It occupies the adenosine receptor without switching it on",
          "A coffee at five keeps half its dose at midnight",
        ],
        parrafos: [
          "Caffeine doesn't give you energy. It's important to get this right, because it completely changes your relationship with coffee: it provides not one calorie and not one watt. All it does is cover up the tiredness you already had.",
          "While you're awake, every time your cells spend ATP (their energy currency) a residue is left behind: adenosine. It builds up hour after hour and sticks to its receptors in the brain, where it works as a perfectly clear message: «you've been spending for many hours now, start slowing down». That rising tide of adenosine is one of the two things that make you sleepy at night.",
          "Caffeine resembles adenosine so closely that it fits into its receptor, but it doesn't switch it on: it only occupies it. It's a plug. The adenosine is still there, still rising, still warning you, and the message doesn't get through. You aren't less tired: you're just as tired without being able to hear it.",
          "And when that brake is taken off, several things happen at once. The dopamine and noradrenaline systems, which adenosine had been keeping in check, go up a notch: in comes the focus, the mood, a bit of blood pressure and that slight tremor if you've overdone it. The vessels in your brain also narrow a little, which is why caffeine helps with some migraines and turns up in various painkillers, and also why your head hurts when you quit all at once and those vessels widen again.",
          "The adaptation arrives in under two weeks and it's textbook: if its receptors are always plugged, the cell makes more adenosine receptors. Now you need more caffeine to plug the same warnings and, above all, without caffeine there are more free receptors than usual for an adenosine that keeps piling up just the same. Translated: coffee no longer lifts you above your baseline, it only brings you back to it. That's the exact moment when someone starts saying «I'm not a person without my coffee». It isn't an exaggeration: it's a system that now only works in balance with the substance.",
          "Then there's the clock, which is where the real damage is done. Caffeine's half-life is about four to six hours, and it varies a lot: the contraceptive pill and pregnancy lengthen it considerably, and tobacco shortens it (which is why someone who quits smoking and keeps their usual coffees suddenly finds themselves way over on caffeine). With a six-hour half-life, a coffee at five in the afternoon still has half its dose in your blood at midnight. You can fall asleep perfectly well and still get less deep sleep, which is the sleep that repairs. And that closes the circle: you sleep worse, you wake up more tired, you need more coffee.",
          "And the debt doesn't disappear: the adenosine you've been plugging for hours is still piled up, waiting. When the caffeine goes, the whole message comes through at once. That's the mid-afternoon crash.",
          "On amounts, the usual reference for a healthy adult is around 400 mg a day, roughly three or four coffees, and considerably less in pregnancy. Energy drinks are a chapter of their own: high doses mixed with sugar, drunk fast and often by teenagers, is a different scenario from a cup of coffee.",
          "One fair nuance to finish with: coffee itself, as a drink, has polyphenols and its associations with health are rather favorable. The problem isn't the bean. It's using it to cover up a sleep debt that, sooner or later, has to be paid by sleeping.",
        ],
      },
    },
  },
};

/**
 * Los nutrientes en el idioma activo.
 *
 * El español manda: el orden de los grupos y de las tarjetas, las fotos, los
 * colores, las siglas y los números salen siempre del fichero español. Del
 * inglés se toma solo el texto, grupo a grupo y tarjeta a tarjeta: lo que no
 * esté traducido se lee en español en vez de desaparecer.
 *
 * No es un hook: se llama con el idioma que toque, para poder usarlo también en
 * el `useMemo` de una página o fuera de un componente.
 */
export function nutrientesTraducidos(nutrientes: Nutriente[], idioma: "es" | "en"): Nutriente[] {
  if (idioma === "es") return nutrientes;
  return nutrientes.map((n) => {
    const en = NUTRIENTES_EN[n.key];
    if (!en) return n;
    const { tarjetas: tarjetasEn, ...texto } = en;
    return {
      ...n,
      ...texto,
      tarjetas: n.tarjetas?.map((t) => {
        const tEn = tarjetasEn?.[t.key];
        return tEn ? { ...t, ...tEn } : t;
      }),
    };
  });
}

