import type { NutrienteTarjeta } from "./NutrientesNutricion";

/**
 * «Preguntas y mitos» de Nutrición, en INGLÉS.
 *
 * Aquí va SOLO el texto de cada mito, indexado por su `key`. La foto y el orden
 * viven únicamente en el fichero español, y la `key` es además lo que se guarda
 * como «leído»: duplicarla aquí sería la forma más rápida de que una tarjeta
 * perdiera su marquita al cambiar de idioma.
 *
 * Lo que falte se lee en español, mito a mito (ver `useMitosNutricion`).
 *
 * Al traducir:
 *  · Es una respuesta a una pregunta que alguien se ha hecho de verdad. El tono
 *    es directo y tranquilizador, sin sermón: se desmonta el miedo y se dice qué
 *    hacer. Igual en inglés.
 *  · El título ES la pregunta, y en inglés se queda como pregunta.
 *  · Las cifras no se tocan; los decimales con coma pasan a punto («1,2 g» →
 *    «1.2 g») y los miles españoles con punto, a coma («1.000» → «1,000»).
 */
export type MitoTexto = Pick<NutrienteTarjeta, "titulo" | "parrafos">;

export const MITOS_NUTRICION_EN: Record<string, MitoTexto> = {
  // ── Proteína y soja ─────────────────────────────────────────────────────
  "soja-cancer": {
    titulo: "Does soy cause cancer?",
    parrafos: [
      "Soy contains isoflavones, molecules called phytoestrogens because they resemble human estrogens. That's why they can bind to some of their receptors, though far, far more weakly.",
      "The fear was born of experiments in mice given enormous doses of isolated isoflavones, nowhere near what a plate of tofu or edamame provides. In people, studies don't find that eating soy regularly raises cancer risk.",
      "In breast cancer, in fact, the evidence points to a protective effect. Eating soy as food (tofu, tempeh, edamame, soy milk) in normal amounts is safe.",
    ],
  },
  "soja-hombres": {
    titulo: "Is soy bad for men?",
    parrafos: [
      "The myth says that, because it contains phytoestrogens, soy «feminizes» you or lowers testosterone. But remember: those molecules are very weak estrogens and our body regulates them.",
      "The analyses that pool many studies in men find no changes in testosterone or estrogen levels, and no effects on fertility, with normal soy intake.",
      "The few striking cases that circulate came from extreme and thoroughly unrealistic intakes. For the vast majority, soy is a perfectly healthy source of plant protein.",
    ],
  },
  "proteinas-exceso": {
    titulo: "Can you eat too much protein?",
    parrafos: [
      "Protein is essential for building and repairing tissue. The body has no specific protein store, so the amino acids it doesn't need for building proteins are used for energy, or can be turned into glucose or fat.",
      "The leftover nitrogen is cleared mainly as urea in your urine. In healthy people, eating between 1.2 and 2 g of protein per kilo of body weight a day is safe for most, and somewhat higher amounts are usually well tolerated too.",
      "More important than eating a lot of protein is keeping a balanced diet with enough fiber, fruit, vegetables and other nutrients.",
    ],
  },
  "proteina-rinones": {
    titulo: "Does protein damage your kidneys?",
    parrafos: [
      "This fear comes from a real fact badly applied: in people who already have kidney disease, cutting protein helps avoid overloading kidneys that are already damaged.",
      "In people with healthy kidneys it's a different story. Studies don't show that a high-protein diet causes kidney damage; the kidney simply works a little harder, like a muscle adapting to a load.",
      "If your kidneys are healthy, there's no reason to fear protein. If you have kidney disease, then yes, adjust the amount with your doctor. Context is everything.",
    ],
  },
  "proteina-vegetal": {
    titulo: "Is plant protein worse than animal protein?",
    parrafos: [
      "Animal protein usually has all the essential amino acids in good proportion, which is why it's called «complete». Many plant proteins are more limited in one of them, but that's easily solved.",
      "By combining legumes with grains (lentils with rice, chickpeas with bread) or simply varying across the day, you get all the amino acids you need. Soy, on top of that, is already a complete protein on its own.",
      "Plant protein comes with fiber, minerals and protective compounds, and without the cholesterol or the saturated fat of some animal sources. It isn't worse: it's different, and well worth eating.",
    ],
  },
  "carne-roja": {
    titulo: "Is eating red meat bad for you?",
    parrafos: [
      "It's worth separating two things. Unprocessed, farm-raised red meat (a steak, say) can be part of a healthy diet in moderation (2–3 times a week): it provides protein, iron and vitamin B12.",
      "Processed meat (cold cuts, sausages, bacon) is another story: eating it regularly is associated with more risk of certain cancers and of cardiovascular disease. That's where cutting back is worth it.",
      "The general recommendation is to keep red meat to a couple of servings a week, minimize the processed kind and give more weight to legumes, fish, poultry and plant protein. It isn't about banning: it's about balancing.",
    ],
  },
  colageno: {
    titulo: "Does collagen actually work?",
    parrafos: [
      "Collagen is the most abundant protein in the body and it gives structure to skin, tendons and joints. The idea of taking it to «fill in» those areas sounds logical, but the body doesn't use it that directly.",
      "When you take it, it's digested and broken into amino acids, just like any other protein. Your body then decides where and how to make its own collagen; it doesn't go straight to your skin.",
      "There are some studies suggesting mild improvements in skin hydration or joint discomfort with collagen peptide supplements, but the evidence is modest. A diet with enough protein and vitamin C does more for your collagen than any tub.",
    ],
  },

  // ── Azúcar y dulzor ─────────────────────────────────────────────────────
  "azucar-adictivo": {
    titulo: "Why does sugar «hook» you?",
    parrafos: [
      "Sugar switches on the brain's reward circuit by releasing dopamine, the same signal that pushes us to repeat what we like. It's a natural mechanism: fast energy was always valuable for survival.",
      "In ultra-processed food that effect goes through the roof, because they combine sugar, fat and salt in proportions that barely exist in nature and that are enormously appealing.",
      "Sugar also causes a glucose spike followed by a sharp drop. That «roller coaster» creates more hunger and more cravings soon afterward. It isn't a chemical addiction like a drug, but it is a powerful push to want more.",
    ],
  },
  "azucar-energia": {
    titulo: "Does sugar really give you energy?",
    parrafos: [
      "Yes and no. Glucose is the molecule our cells make ATP from most easily, so sugar does give energy very quickly.",
      "The problem is that the energy doesn't last: the glucose spike sets off insulin, glucose drops all at once, and we often end up more tired and hungrier than before.",
      "Steady, sustained energy comes from carbohydrates that arrive with fiber (oats, legumes, whole fruit), which are absorbed little by little. The famous «sugar rush» is brief and, largely, a myth.",
    ],
  },
  "azucar-moreno": {
    titulo: "Is brown sugar healthier than white?",
    parrafos: [
      "Brown sugar is basically white sugar with some molasses in it, which gives it the color and that touch of moisture. That molasses keeps traces of minerals, but in amounts so small they change nothing.",
      "In practice, your body processes both almost identically: the effect on blood glucose and the calories are practically the same.",
      "Swapping white for brown brings no real health benefit. If you want to watch your sugar, what helps is cutting the total amount, not changing its color.",
    ],
  },
  miel: {
    titulo: "Is honey better than sugar?",
    parrafos: [
      "Honey has an aura of being natural and healthy, and it's true that it provides small amounts of antioxidants and compounds with antimicrobial activity that sugar doesn't have.",
      "But underneath, it's still sugar: a mix of glucose and fructose that raises blood glucose and adds calories very close to those of table sugar.",
      "Using it in moderation for its flavor is fine, but it isn't permission to have more «because it's healthy». To your body, too much honey looks a lot like too much sugar.",
    ],
  },
  edulcorantes: {
    titulo: "Are sweeteners bad for you?",
    parrafos: [
      "Approved sweeteners (sucralose, aspartame or stevia, for instance) are among the most studied additives there are, and at ordinary intakes they're considered safe.",
      "Their big advantage is that they sweeten with hardly any calories and no glucose spikes, which can help someone who wants to cut sugar, especially in drinks.",
      "The nuance is that they keep your taste for very sweet things alive, and that some research is looking into their possible effect on the microbiota. They aren't a healthy food in themselves, but as an occasional replacement for sugar they're usually a reasonable option.",
    ],
  },

  // ── Carbohidratos, pan y fruta ──────────────────────────────────────────
  "carbohidratos-engordan": {
    titulo: "Do carbohydrates make you fat?",
    parrafos: [
      "No nutrient makes you fat on its own. You gain weight when, over time, you take in more energy than you spend, wherever those calories come from.",
      "Carbohydrates carry a bad name because the ones that dominate the modern diet are refined (sugar, pastries, soft drinks), easy to overeat and very quick to digest.",
      "But carbohydrates that come with fiber (legumes, oats, fruit, tubers, whole grains) fill you up, give steady energy and are part of the healthiest diets in the world. The problem isn't the whole group, it's the quality and the amount.",
    ],
  },
  "carbohidratos-noche": {
    titulo: "Should you avoid carbohydrates at night?",
    parrafos: [
      "The idea that «at night carbohydrates turn into fat» has no solid basis. The body doesn't carry a clock that decides to store fat past a certain hour.",
      "What counts is the total energy balance of the day, not the exact moment you eat your carbs. In fact, a dinner with some carbohydrate in it can help you rest.",
      "What is worth doing at night is not arriving at an enormous dinner because you ate too little during the day, and choosing lighter options. The hour matters far less than the whole.",
      "Go deeper: carbohydrates at dinner help the amino acid tryptophan reach the brain more easily, where it's turned into serotonin and then melatonin, which makes resting easier.",
    ],
  },
  "pan-engorda": {
    titulo: "Does bread make you fat?",
    parrafos: [
      "Bread is, above all, flour: a carbohydrate. Like any food, it adds calories, but it has no magical fattening power of its own.",
      "What usually adds the weight is what we put on it and how much we eat: butter, cold cuts, sauces… and big servings of very refined white bread, which barely fills you up and is easy to overeat.",
      "A good-quality wholemeal bread, in a reasonable serving, fits perfectly into a healthy diet.",
      "The difference is in the kind of bread and in how much, not in bread as an enemy.",
    ],
  },
  "fruta-azucar": {
    titulo: "Does fruit have too much sugar?",
    parrafos: [
      "Fruit does contain sugar (fructose), yes, but it comes wrapped in fiber, water, vitamins and antioxidants. That fiber makes the sugar absorb slowly, without the sharp spikes of added sugar.",
      "Which is why eating whole fruit is nothing like drinking a soft drink: the food's matrix completely changes how your body handles it.",
      "Unless you've been told otherwise for a specific medical reason, there's no cause to fear fruit. It's one of the foods with the best ratio between what it gives you and the calories it carries. Juice is a different matter, since the fiber is gone.",
    ],
  },
  "zumo-vs-fruta": {
    titulo: "Why isn't juice the same as fruit?",
    parrafos: [
      "Let's start with the numbers, which here explain almost everything. To fill a glass of fresh orange juice you need three or four oranges. That glass carries about 22 grams of sugar; the same glass full of cola carries about 26. The difference is far smaller than almost anyone imagines.",
      "But sugar isn't what changes most. Those three or four oranges contained between 8 and 10 grams of fiber —close to a third of everything you should have in a day— and there's practically none of it left in the glass: the fiber stayed behind in the juicer or the strainer. And with it went the brake.",
      "That's the key, because fructose is handled almost exclusively by the liver, and it does it in a peculiar way. When glucose arrives, the liver has a regulator that processes it more slowly if it's already got plenty. With fructose there is no such brake: the enzyme that takes it up, fructokinase, works flat out and can't stop itself. It phosphorylates all of it, as fast as it arrives.",
      "And that has a price. Every fructose molecule consumes one of ATP, the cell's energy currency, and leaves the phosphorus trapped. When a big rush arrives all at once, the liver cell's energy plummets for a few minutes. As it recovers, that breakdown generates uric acid as waste. On top of that, fructose's carbons enter the pathway below the point that's regulated, so they flow uncontrolled toward making fat: triglycerides, and fat that gets deposited in the liver itself.",
      "With whole fruit this doesn't happen. The fiber forms a kind of gel that releases the fructose little by little, and at those small, slow doses the gut itself handles most of it before it ever reaches the liver. Fruit delivers the same molecule, but drop by drop. Juice delivers it all at once.",
      "One nuance about vitamin C, because it's usually told backwards: juice does NOT lose its vitamin C, it keeps nearly all of it, and it isn't true that you have to drink it within two minutes «before the vitamins escape». That's a myth. What's actually going on is more awkward: a single orange already covers practically all the vitamin C you need in a day. So if you're drinking the juice for the vitamin C, the first orange already gave it to you; the other three only added sugar without fiber.",
      "Add time to it. Eating four oranges would take you a good while of peeling and chewing, and most likely you couldn't finish them. Juice is drunk in twenty seconds and doesn't fill you at all, because chewing and the fiber itself are part of the fullness signal. Which is why it's so easy to take in a glassful of fruit you'd never eat.",
      "It isn't just an impression: in a follow-up of more than 180,000 people over years, eating whole fruit was associated with less risk of type 2 diabetes, while drinking juice was associated with more. Swapping the juice for the whole piece was enough for the risk to fall.",
      "None of this makes juice poison. The odd juice does nobody any harm. But it's worth being clear: juice doesn't count as a serving of fruit, it shouldn't be the drink at every breakfast, and it doesn't replace the whole piece. Fruit has to be chewed.",
    ],
  },

  // ── Grasas ──────────────────────────────────────────────────────────────
  "grasa-engorda": {
    titulo: "Does eating fat make you fat?",
    parrafos: [
      "Fat is the nutrient with the most calories per gram, so in excess, like any food, it contributes to gaining weight. But the fat in your food doesn't turn directly into body fat.",
      "What makes you gain or lose weight is the total energy balance over time, not one nutrient in isolation.",
      "On top of that, healthy fats (olive oil, avocado, nuts, oily fish) are essential: they build your membranes, carry vitamins and are the basis of many hormones. Cutting them out entirely is neither necessary nor healthy.",
    ],
  },
  "grasa-saturada": {
    titulo: "Is saturated fat as bad as they say?",
    parrafos: [
      "For decades saturated fat was singled out as the great culprit behind heart disease. Today the picture is more nuanced: it matters, but it isn't the only factor and it doesn't act the same way in every food.",
      "The saturated fat in an ultra-processed product isn't the same as the one in a yogurt, a cheese or dark chocolate. The whole food (its «matrix») influences how it affects us.",
      "The sensible recommendation is still not to overdo it and to replace some of it with unsaturated fats (olive oil, nuts, fish). But the absolute villain of the past has given way to a more balanced view.",
    ],
  },
  "aceite-coco": {
    titulo: "Is coconut oil healthy?",
    parrafos: [
      "Coconut oil became popular as a «superfood», but it's one of the fats with the highest saturated content there is, above even butter.",
      "It does raise cholesterol, both the «bad» (LDL) and the «good» (HDL), and the evidence doesn't back the miraculous benefits it's credited with for weight loss or for the heart.",
      "As an occasional touch of flavor in cooking there's no harm in it, but it isn't a healthy substitute for extra virgin olive oil, which remains the best everyday fat there is.",
    ],
  },
  "mantequilla-aceite": {
    titulo: "Is butter worse than olive oil?",
    parrafos: [
      "Extra virgin olive oil is rich in monounsaturated fats and in antioxidants (polyphenols), and it's a pillar of the Mediterranean diet, which is associated with better cardiovascular health.",
      "Butter, on the other hand, is mainly saturated fat. It isn't poison, but as your everyday fat, olive oil beats it clearly.",
      "Using butter now and then for its flavor is perfectly fine; olive oil is the better choice for cooking and dressing day to day. It's a question of which one you use daily.",
    ],
  },
  "frutos-secos": {
    titulo: "Do nuts make you fat?",
    parrafos: [
      "Nuts are calorific because they have a lot of (healthy) fat, so logic says they ought to make you gain weight. But reality is more curious.",
      "They're very filling, some of their fat isn't fully absorbed because of their structure, and in studies eating them regularly isn't associated with gaining weight — it's associated with keeping it off better and with more cardiovascular health.",
      "The key is how you eat them: a handful raw or toasted, not fried or sugared or out of an enormous bag in front of the TV. Used well, they're an excellent snack.",
    ],
  },
  light: {
    titulo: "Do «light» foods help you lose weight?",
    parrafos: [
      "«Light» only means it has fewer calories, or less fat or sugar, than its normal version — not that it's a healthy food or low in calories in absolute terms.",
      "Sometimes, when the fat is taken out, sugar is added (or the other way around) to keep the taste, so the real difference can be small. And the psychological effect works against you: we tend to eat more «because it's light».",
      "Losing weight depends on your diet as a whole, not on a label.",
      "Often the normal version in a smaller amount, or simply an unprocessed food, is a better option than its «light» equivalent.",
    ],
  },

  // ── Huevo y colesterol ──────────────────────────────────────────────────
  "huevos-colesterol": {
    titulo: "Do eggs raise your cholesterol?",
    parrafos: [
      "Eggs contain cholesterol, but the cholesterol we eat influences the cholesterol in our blood far less than was once thought. Our liver makes most of it and adjusts its production according to what arrives from our food.",
      "For most people, eating eggs normally doesn't raise cardiovascular risk. What raises «bad» cholesterol (LDL) most is too much trans and saturated fat.",
      "There is a minority of people who respond more to dietary cholesterol, but even there the overall context of the diet weighs far more than the egg itself.",
    ],
  },
  "huevos-dia": {
    titulo: "How many eggs a day can you eat?",
    parrafos: [
      "For years eggs were limited because of their cholesterol, but today we know that dietary cholesterol has little influence on blood cholesterol in most people.",
      "For healthy people, eating one or even two eggs a day fits into a balanced diet without any problem. The egg is, in fact, one of the most complete and nutritious sources of protein there is.",
      "The nuance is in the whole: a boiled egg isn't the same as a fried one with bacon every day. People with certain conditions should adjust the amount with their doctor, but the rigid limit of the past no longer holds.",
    ],
  },
  "colesterol-dieta": {
    titulo: "Does the cholesterol in food raise the cholesterol in your blood?",
    parrafos: [
      "It seems like common sense: if I eat cholesterol, my cholesterol goes up. But the body is smarter than that. Your liver makes most of your cholesterol and lowers its production when more arrives from food.",
      "The numbers make it clear. Your body produces between 800 and 1,000 milligrams of cholesterol a day on its own, while a normal diet provides about 300. Which is to say: most of the cholesterol inside you isn't something you ate, it's something you made. And that makes sense, because you need it for the membranes of every one of your cells, for your sex hormones, for cortisol, for vitamin D and for bile salts.",
      "The first brake is a thermostat. The enzyme that runs the factory is called HMG-CoA reductase —exactly the one statins block— and the liver regulates it according to what arrives: eat more cholesterol and it makes less; eat less and it makes more. Which is why cutting cholesterol out of your diet rarely lowers the blood test as much as you'd expect: the body compensates.",
      "The second brake is in the gut. You don't absorb everything you eat: on average, about half. Cholesterol has to come in through a specific door (a protein called NPC1L1) and, on top of that, there are pumps in the intestinal wall that send back some of what already got in. Two filters before anything reaches the blood.",
      "That's also the explanation for why this isn't the same for everyone. How well that door works, how well those pumps work, and which type of apolipoprotein E you inherited all vary from person to person. It's estimated that around one in four or five people is a «hyper-responder»: in them, dietary cholesterol does noticeably raise blood cholesterol. The only way to know which group you're in is a blood test.",
      "So where did the fear come from? From some rabbits. In 1913, a Russian researcher fed rabbits egg yolk and filled their arteries with plaque. The problem is that a rabbit is a herbivore: in nature it never eats cholesterol at all and has no way of getting rid of it. It was the worst possible model for studying an omnivore, but that experiment shaped a century of recommendations.",
      "Which is why the guidelines have changed. The famous 300-milligram-a-day limit was dropped from the US recommendations in 2015, and European bodies have gone the same way. Not because dietary cholesterol is irrelevant, but because counting milligrams didn't predict well who was going to have a problem.",
      "And here comes the important warning, because this myth has flipped over and now a lot of people conclude that the cholesterol in food doesn't matter at all. That isn't it. What happens is that most cholesterol-rich foods come with saturated fat in the same mouthful —cold cuts, fatty meat, butter, aged cheese, pastries— and it's that saturated fat that does raise your LDL. The mechanism is different: it makes the liver reduce its LDL receptors, so the particles spend longer circling around in your blood instead of being taken out.",
      "Eggs and shellfish are the exception that proves it: they carry cholesterol but very little saturated fat. Which is why they've been rehabilitated, while the butter and cold cuts group hasn't. It wasn't the cholesterol: it was the company it kept.",
      "There are people for whom this does matter a great deal, and that's worth saying. Anyone with familial hypercholesterolemia —an inherited fault in the LDL receptors that affects around 1 in 250 people and is enormously underdiagnosed— doesn't regulate any of this well. Nor does anyone with type 2 diabetes or who has already had a cardiovascular event. If there are early heart attacks in your family, or very high cholesterol from a young age, mention it to your doctor.",
      "What raises «bad» cholesterol (LDL) most is too much saturated fat and, above all, the trans fats in ultra-processed food. That's where the focus is really worth putting.",
      "And if what you want is to lower it, this is what actually works: soluble fiber (oats, barley, legumes), which traps bile salts and forces the liver to spend cholesterol making more; swapping saturated fat for unsaturated rather than simply cutting fat; plant sterols, which compete for that same door in the gut and can lower LDL by around 10%; and losing abdominal fat and moving. None of that involves counting the milligrams of cholesterol on your plate.",
    ],
  },

  // ── Sal, sueño y «detox» ────────────────────────────────────────────────
  "sal-hipertension": {
    titulo: "Does salt cause high blood pressure in everyone?",
    parrafos: [
      "Too much salt is associated with higher blood pressure in the population at large, which is why the recommendation not to overdo it is sensible for almost everyone.",
      "But salt sensitivity varies from person to person: some people notice their blood pressure climb sharply when they eat salt, and others barely notice it at all. We don't all respond the same way.",
      "The real problem usually isn't the salt shaker at home, but the salt hidden in ultra-processed food, cold cuts and ready meals, which provides most of the sodium in the diet. That's where the room for improvement is.",
    ],
  },
  "sal-agua": {
    titulo: "Is salt in your water a good idea?",
    parrafos: [
      "There's a trend for adding a pinch of salt to your water to «hydrate better». It makes some sense in very specific contexts: intense, prolonged exercise, a lot of heat and heavy sweating.",
      "In those cases, replacing sodium along with water helps keep your fluid balance. It's the basis of athletes' isotonic drinks.",
      "But for ordinary life, with a diet that usually has plenty of salt already, adding salt to your water brings no benefit and can add unnecessary sodium. Day to day, plain water is perfect.",
    ],
  },
  "sueno-comer": {
    titulo: "Why do I get sleepy after eating?",
    parrafos: [
      "After a meal, the body puts resources into digestion and releases insulin. That insulin makes it easier for an amino acid called tryptophan to enter the brain, where it's turned into serotonin and melatonin, molecules that invite rest.",
      "If the meal is large and rich in sugar or refined flour, the glucose spike and drop sharpen that dip in energy.",
      "To all of this you add your circadian rhythm: in the early afternoon there's a natural sleepiness, whatever you eat. Lighter, more balanced meals help you notice it less.",
    ],
  },
  detox: {
    titulo: "Do «detox» juices clean out your body?",
    parrafos: [
      "Your body already has an extremely powerful detoxification system: your liver and kidneys work non-stop to transform and clear out what it doesn't need. No juice does that job for them.",
      "Many «detox» drinks are, on top of that, fruit juice without its fiber, so they deliver a big load of fast-absorbing sugar — the exact opposite of what they're after.",
      "What really helps your liver and kidneys is drinking water, eating whole fruit and vegetables, sleeping well and going easy on alcohol. There are no miracle shortcuts.",
    ],
  },
  "alimentos-detox": {
    titulo: "Are there foods that detoxify your body?",
    parrafos: [
      "No food «detoxifies» in the sense the marketing sells. The ones doing that job are your liver, your kidneys, your lungs and your gut, with no need for miracle help.",
      "What is true is that some foods support those organs working well: fruit and vegetables, fiber, water and lightly processed food all make their job easier.",
      "So the best «detox» isn't a product or a special smoothie, it's eating well consistently, moving, sleeping and drinking water. The body does the rest by itself.",
    ],
  },
  "agua-limon": {
    titulo: "Does lemon water on an empty stomach have benefits?",
    parrafos: [
      "Lemon water on an empty stomach has been sold as a remedy for losing weight, «alkalizing» or detoxifying your body. None of those promises has serious scientific backing.",
      "What is real is simpler: you hydrate at the start of the day and get a little vitamin C. And if it helps you drink more water or start your morning with a habit, all the better.",
      "It doesn't change the pH of your blood (the body regulates that with great precision) and it doesn't melt fat. It's a pleasant, harmless habit, but with no special powers.",
    ],
  },
  "agua-comidas": {
    titulo: "Is it bad to drink water with meals?",
    parrafos: [
      "People say water «dilutes your gastric juices» and ruins digestion. In reality, the stomach regulates its acidity perfectly well and drinking water doesn't stop it.",
      "Drinking during meals is entirely normal, and for many people it even helps: it makes swallowing easier, adds fullness and goes along with the fiber.",
      "Only someone who feels heaviness or reflux with a lot of liquid might prefer to drink less at the table. But as a general rule, drinking water while you eat is nothing to worry about.",
    ],
  },
  masticar: {
    titulo: "Does chewing more help you lose weight?",
    parrafos: [
      "Chewing slowly doesn't burn calories in itself, but it does influence how much we eat. Fullness signals take a few minutes to reach the brain.",
      "By eating more slowly and chewing well, you give those signals time to appear, and you usually end up satisfied with less, enjoying the food more along the way.",
      "It also helps digestion, because the food arrives at your stomach better broken down. It isn't a magic weight-loss formula, but eating calmly is a real ally of your appetite and your wellbeing.",
    ],
  },
  probioticos: {
    titulo: "Do probiotics work?",
    parrafos: [
      "Probiotics are live microorganisms that, in sufficient quantity, can bring benefits.",
      "The evidence is strongest in specific situations, such as antibiotic-associated diarrhea or certain digestive problems.",
      "The important nuance is that they aren't all the same: the effects depend on the specific strain and the dose, so not just any product will do for any goal.",
      "For looking after your microbiota day to day, your diet as a whole usually matters more: plenty of fiber, fermented foods (yogurt, kefir, sauerkraut) and a wide variety of plants. Probiotics in a capsule are useful in specific cases, not a daily must.",
    ],
  },

  // ── Peso, horarios y calorías ───────────────────────────────────────────
  "cenar-tarde": {
    titulo: "Does eating dinner late make you gain weight?",
    parrafos: [
      "For years this was answered with «the hour doesn't matter, what counts is the calories». That's an oversimplification: the hour does matter, because your body doesn't handle the same meal the same way at noon and at midnight.",
      "You have an internal clock, your circadian rhythm, that starts preparing your body for sleep long before you go to bed. As night falls you start secreting melatonin, and it turns out the beta cells of the pancreas —the ones that make insulin— have receptors for it. When melatonin binds to those receptors, it holds back insulin release.",
      "The result is that, at night, insulin sensitivity and glucose tolerance drop. The same dinner, eaten late, leaves more glucose in your blood and for longer than if you'd eaten it early. The body handles nutrients worse precisely when it's getting ready to rest, not to digest.",
      "Now, an equally important nuance: that doesn't make the hour the main cause of gaining weight. The factor that weighs most is still the total energy of the day. Eating late modulates how you handle that meal; it doesn't replace the overall balance.",
      "And on top of that comes the usual: someone who eats very late tends to arrive hungrier, serve themselves bigger portions, snack afterwards and sleep worse. That pushes in the same direction too.",
      "In practice: try to eat dinner two or three hours before going to bed, and don't make dinner the biggest meal of the day. Not because of a magic effect on the scale, but because you're making things easy for your metabolism at the moment it has them hardest.",
    ],
  },
  "calorias-iguales": {
    titulo: "Are all calories the same?",
    parrafos: [
      "In terms of pure energy, a calorie is a calorie. For long-term weight balance, the total amount of energy is what weighs most.",
      "But not all calories behave the same way in the body: 100 calories of soft drink and 100 of legumes fill you up, digest and affect your hormones in very different ways.",
      "The ones from foods rich in fiber and protein fill you more and help you eat less without effort; the ones from ultra-processed food invite you to keep eating. So calories count, but the quality of those calories changes the game a great deal.",
    ],
  },
  "efecto-rebote": {
    titulo: "Why do I put the weight back on after a diet?",
    parrafos: [
      "The famous «rebound effect» has a biological explanation. When you lose a lot of weight, the body defends itself: energy expenditure drops and hunger hormones rise, as if trying to get back to its previous weight.",
      "And if the diet was very restrictive and temporary, when it ends the old habits come back, and with that «thrifty» body the weight returns, sometimes with interest.",
      "Which is why sustainable, gradual changes work better than extreme diets: instead of a short war, it's about building habits you can keep for Life.",
    ],
  },
  "fruta-noche": {
    titulo: "Does fruit at night make you fat?",
    parrafos: [
      "Fruit doesn't change its calories or its sugar according to the hour. The body doesn't handle it differently at night than in the morning.",
      "What makes you gain weight, if anything, is the total balance of the day, not a piece of fruit late on. In fact, it's a far better dessert or evening snack than something sweet.",
      "Only someone with very sensitive digestion might prefer lighter fruits at night, but as a general rule, fruit in the evening is a good choice, not a mistake.",
    ],
  },
  "fruta-antes-comidas": {
    titulo: "Is it better to eat fruit before meals?",
    parrafos: [
      "There's a belief that fruit «rots» in your stomach if you eat it for dessert, and that you have to have it before. It's a myth: your digestive system mixes and processes everything without any trouble.",
      "There is one practical nuance: eating fruit before or at the start of a meal can increase fullness and help you eat a little less of the rest, thanks to its fiber and its volume.",
      "But for dessert it's perfectly healthy too. What matters is that you eat fruit; the exact moment is secondary and you can choose it according to what sits best with you.",
    ],
  },

  // ── Verdura, ecológico y bebidas ────────────────────────────────────────
  "verduras-congeladas": {
    titulo: "Are frozen vegetables less healthy?",
    parrafos: [
      "Frozen vegetables are usually harvested at their peak and frozen straight away, which «locks in» a good share of their vitamins right when they're at their best.",
      "Curiously, a fresh vegetable that spends days in transport and in the fridge can lose more nutrients than a frozen one. In many cases, frozen wins on nutrition.",
      "They're convenient, they keep for a long time, they avoid waste and they hold their nutritional value. Far from being a second-rate option, they're an excellent way to eat more vegetables without complicating your life.",
    ],
  },
  "verduras-cocinar": {
    titulo: "Do vegetables lose nutrients when you cook them?",
    parrafos: [
      "Cooking can indeed reduce some nutrients, especially the vitamins sensitive to heat and water, like vitamin C, particularly if you boil them a long time and throw the water away.",
      "But it has advantages too: heat breaks down the plant walls and makes other compounds more available. The lycopene in tomatoes or the carotenoids in carrots are better used cooked.",
      "The best strategy is to vary: eat vegetables raw and cooked, favor gentle methods (steaming, a short sauté, the microwave) and don't boil them to death. What really matters is eating vegetables, in whatever form.",
    ],
  },
  ecologicos: {
    titulo: "Is organic food more nutritious?",
    parrafos: [
      "The nutritional difference between an organic food and a conventional one is, in general, small. An organic apple and a conventional one are very similar in vitamins and minerals.",
      "Where there are differences is elsewhere: organic food usually has fewer residues of synthetic pesticides, and a different environmental and animal welfare footprint.",
      "Buying organic can be a valid choice for the environment or out of personal preference, but it isn't essential for eating well. Eating more fruit and vegetables, organic or not, matters far more for your health.",
    ],
  },
  "cafe-malo": {
    titulo: "Is coffee bad for you?",
    parrafos: [
      "Coffee has gone from suspect to well regarded.",
      "In moderate amounts, drinking it is even associated with some benefits and with lower risk of several diseases.",
      "It provides antioxidants and, of course, caffeine, which improves alertness. In healthy people, a reasonable intake doesn't harm the heart or general health.",
      "The nuances are individual: anyone sensitive to caffeine may notice jitters, palpitations or poor sleep, and pregnancy calls for moderation. And watch out for the «dessert» coffee loaded with sugar and cream, which is a very different thing.",
    ],
  },
  "cafe-cantidad": {
    titulo: "How much coffee is too much?",
    parrafos: [
      "For most healthy adults, up to around 400 mg of caffeine a day (roughly 3–4 cups of coffee) is considered a safe intake.",
      "Going beyond that can cause jitters, a racing heart, insomnia or digestive discomfort, especially in sensitive people or if you drink it late in the day.",
      "Tolerance is very personal, and you have to count caffeine from other sources too (tea, cola drinks, energy drinks, chocolate). In pregnancy, the recommendation drops to around 200 mg. The key is to listen to your body.",
    ],
  },
  "bebidas-energeticas": {
    titulo: "Do energy drinks really give you energy?",
    parrafos: [
      "What you feel with an energy drink is, above all, the effect of caffeine and sugar: more alertness and a quick push. But that isn't real energy, it's a temporary sensation.",
      "Real energy (the calories your cells use) comes from food. These drinks give a brief hit often followed by a crash, and they add a lot of sugar.",
      "They also mix high doses of caffeine with other stimulants, which can cause jitters, palpitations or sleep problems, and they're especially inadvisable for minors and mixed with alcohol.",
    ],
  },
  "alcohol-calorias": {
    titulo: "Does alcohol have calories?",
    parrafos: [
      "Yes, and quite a few. Alcohol provides 7 calories per gram, almost as many as fat and more than sugar or protein. And they're «empty calories»: energy with no nutrients.",
      "On top of that, the body makes metabolizing alcohol a priority because it treats it as a toxin, and meanwhile it parks fat burning. Which is why frequent alcohol makes losing weight harder.",
      "To those calories you add the ones from whatever usually comes with it: soft drinks, juices, snacks… Cutting back on alcohol is one of the simplest levers there is for trimming calories and gaining health.",
    ],
  },
  cerveza: {
    titulo: "Does beer make you fat?",
    parrafos: [
      "Beer has calories, mostly from its alcohol rather than from its carbohydrates.",
      "The classic «beer belly» has to do with that extra load of liquid calories and with the snacking that usually goes with beer, rather than with any magical effect on your abdomen.",
      "In moderation it's no disaster, but as an everyday drink it can indeed contribute to gaining weight. The alcohol-free version cuts a good share of the calories and can be a reasonable alternative.",
    ],
  },
  "dos-litros-agua": {
    titulo: "Do you need to drink two liters of water a day?",
    parrafos: [
      "The famous «two liters» is a rough guide, not an exact rule. Your needs change with your size, the climate, your physical activity and what you eat.",
      "On top of that, some of your water comes from food (fruit, vegetables, soups) and from other drinks, not only from the water you sip. The total is higher than it looks.",
      "The best guide is your own body: drink when you're thirsty and watch the color of your urine (pale is a good sign). There's no need to obsess over hitting a particular number every day.",
    ],
  },

  // ── «Toxinas», gluten y conservación ────────────────────────────────────
  toxinas: {
    titulo: "Does the body build up toxins?",
    parrafos: [
      "The word «toxins» gets used very loosely in marketing, almost always without saying which ones. In a healthy person, the body doesn't go around accumulating poisons that need special cleanses.",
      "Your liver, kidneys, lungs and gut continuously transform and clear out waste products and substances you don't need. It's a very effective system that runs on its own.",
      "What really helps them is the usual: eating well, drinking water, sleeping, moving and not overdoing alcohol or tobacco. There are no «detox cures» that do that job better than your own organs.",
    ],
  },
  "grasa-toxinas": {
    titulo: "Does fat store toxins?",
    parrafos: [
      "There's an important nuance here compared with the previous answer. Your body doesn't accumulate generic «toxins» that need miracle cleanses, but there is a specific group of substances that do get stored in fat: fat-soluble pollutants.",
      "They're compounds that don't dissolve in water, so the kidney can't clear them out in your urine. Finding no way out, they dissolve in the only thing they're at home in: fat tissue. There they can stay for years. We're talking about residues of old pesticides, PCBs or dioxins, which reach us mostly through animal fat.",
      "And now what almost nobody tells you: their staying there is, in fact, a way of protecting you. Stored in fat they're out of circulation and far from your organs. Adipose tissue works as a safety warehouse.",
      "That explains something curious: when weight is lost very fast, some of those compounds are released back into the blood and their levels rise temporarily. It isn't a reason not to lose weight —the benefits of losing weight are enormously greater— but it's one more argument for doing it gradually and steadily, not with crash diets.",
      "What helps is the boring usual: variety in your diet, plenty of fiber (which helps them leave through the bile instead of being reabsorbed), going easy on animal fat and losing weight little by little. No green juice does any of this.",
    ],
  },
  "sin-gluten": {
    titulo: "Are «gluten-free» foods healthier?",
    parrafos: [
      "Gluten-free foods are essential for anyone with celiac disease or gluten sensitivity, because for them gluten really is a health problem.",
      "But for everyone else, «gluten-free» doesn't mean healthier. Many processed gluten-free products carry more sugar, fat or additives to make up for the texture, and they're usually more expensive.",
      "Cutting out gluten with no medical need brings no benefit and can reduce how many whole grains and how much fiber you eat. If you aren't celiac or sensitive, there's no reason to avoid it.",
    ],
  },
  celiaquia: {
    titulo: "How do you recognize celiac disease?",
    parrafos: [
      "First, what it is: celiac disease isn't an allergy or an intolerance. It's an autoimmune disease. Gluten makes the immune system attack your own gut and gradually destroy the villi that absorb nutrients. So it isn't about food «not agreeing with you»: it's about real damage to tissue.",
      "It affects roughly 1% of the population, one in every hundred people. But the figure that matters is another one: it's estimated that around 75% of cases are undiagnosed. Most celiac people don't know they are, and the delay to diagnosis has been estimated at more than five years in adults.",
      "It's underdiagnosed because of two very widespread wrong ideas. The first, that it's a children's disease: it can appear at any age, and today many diagnoses come after forty. The second, that a celiac person is thin: you can have celiac disease at a normal weight or overweight.",
      "The digestive symptoms are the well-known ones —diarrhea or constipation, bloating, abdominal pain, gas, nausea— but in adults they're often mild, or don't appear at all. What gets overlooked most are the signs from outside the gut: iron-deficiency anemia that doesn't improve with iron (the classic clue), persistent tiredness, recurring mouth ulcers, joint pain, early osteoporosis, migraines, tingling in hands and feet, recurrent miscarriage or fertility problems, and unexplained high liver enzymes. On the skin it can cause a rash with intense itching and little blisters (dermatitis herpetiformis). In children, poor growth, delayed puberty or irritability.",
      "There's a practical warning that can save you years: if you suspect it, do NOT cut out gluten before getting tested. The blood tests and the biopsy are based on the reaction to gluten, so taking it out beforehand gives false negatives and forces you to eat it again for weeks before you can be diagnosed. First you consult and get tested; then you take it out.",
      "And if you have a first-degree relative with celiac disease, your own probability is around 10%: it's worth mentioning to your doctor even if you feel fine.",
    ],
  },
  microondas: {
    titulo: "Does the microwave destroy nutrients?",
    parrafos: [
      "The microwave heats food by making its water molecules vibrate; it doesn't emit dangerous radiation or «wreck» your food. It's a way of cooking like any other.",
      "In fact, it usually preserves nutrients well: it cooks fast, with little or no water, and that combination avoids many of the vitamin losses that do happen when you boil something for a long time.",
      "Like any method, excessive heating can reduce some sensitive vitamins, but the microwave is among the gentlest options for nutrients. It's safe and practical.",
      "Go deeper: the microwave is a safe appliance that uses non-ionizing radiation (kinds of energy that don't have the strength to knock electrons off atoms — it does NOT create free radicals), heats by making water vibrate and doesn't make food radioactive. It works with waves that move the molecules in your food without harming your health.",
    ],
  },
  recalentar: {
    titulo: "Is it bad to reheat food?",
    parrafos: [
      "Reheating food is perfectly safe if it's done properly. The key is in how it's kept: cool leftovers quickly, store them in the fridge and reheat them thoroughly, piping hot.",
      "The real risk isn't the reheating itself, it's leaving food out at room temperature for hours, where bacteria multiply. That's where problems can appear.",
      "Some specific foods (badly stored rice, for instance) need more care, and it isn't a good idea to reheat the same thing over and over. But in general, using up leftovers with good hygiene is nothing to worry about.",
    ],
  },
  "pasta-fuera": {
    titulo: "Is it a problem to leave pasta out of the fridge?",
    parrafos: [
      "Yes, and it's one of the few things in this section where the risk is serious. Leaving cooked pasta in the pot, covered on the counter or «somewhere cool» until the next day isn't an innocent habit.",
      "The culprit is a bacterium called Bacillus cereus, very common in soil and therefore in grains. Here's the problem: boiling the pasta kills the bacterium, but not its spores, which survive boiling water perfectly well. While the pasta is hot nothing happens; as soon as it cools to room temperature, those spores wake up, multiply and start making a toxin.",
      "And that toxin is the real problem, because it resists heat. You can reheat the pasta until it steams, sauté it in a pan or put it in the oven: you'll kill the bacteria, but the toxin will still be intact. Reheating well doesn't fix bad storage.",
      "This isn't theory. There's a case documented in the medical literature of a twenty-year-old who died after eating spaghetti that had been out of the fridge for five days and that he'd reheated before dinner. It's an extreme and very rare case, but it explains why this is taken seriously.",
      "The rule is simple: as soon as the pasta stops being hot, into the fridge. No more than two hours out (only one if the kitchen is warm) and eat it within a couple of days. If you've left it out overnight, don't reheat it: throw it away.",
    ],
  },
  "arroz-fuera": {
    titulo: "And rice? Can it stay out?",
    parrafos: [
      "Even less than pasta. Rice is the classic example of this problem, to the point that in English it's called «fried rice syndrome»: most of the described outbreaks came from cooked rice that had spent the night out and been fried up the next day.",
      "The reason is the same as with pasta —Bacillus cereus spores survive cooking and its toxin resists reheating— but rice makes it worse because of how it cools: a full, dense, moist pot takes a very long time to come down in temperature, and it holds the heat right in the band where bacteria multiply best. It can spend hours in the danger zone without your noticing.",
      "So the trick isn't only to put it in the fridge, it's to cool it fast: spread it on a tray or in a wide, shallow container as soon as you finish eating, instead of leaving it packed down in the pot. The more surface, the sooner it cools.",
      "Then: into the fridge within the hour, in a closed container, and eat it within 24 hours. Reheat it once only and piping hot, never lukewarm. And if you're going to freeze it, do that as soon as possible too, not the next day.",
      "That said, there's no need to live in fear: millions of people eat leftover rice every day without any problem. It's enough not to leave it out for hours and not to trust that a good reheating fixes everything, because it doesn't.",
    ],
  },

  // ── Sabor, ritmo y saciedad ─────────────────────────────────────────────
  "picante-metabolismo": {
    titulo: "Does spicy food speed up your metabolism?",
    parrafos: [
      "Spicy food contains capsaicin, a compound that does produce a small rise in energy expenditure and can slightly reduce appetite in the short term.",
      "The problem is the size of it: that effect is so small that it doesn't make you lose weight on its own. You aren't going to burn fat noticeably by adding chili to your food.",
      "The good thing about spice is something else: it gives a lot of flavor for very few calories, which helps you enjoy healthy dishes and use less salt or sauce. As an ally of flavor, yes; as a fat burner, no.",
    ],
  },
  "comer-rapido": {
    titulo: "Does eating fast make you fat?",
    parrafos: [
      "Eating quickly doesn't make you fat through speed itself, but it does influence how much you end up eating. Fullness signals take a few minutes to reach the brain.",
      "If you eat very fast, you finish your plate before your body has told you it's full, and you usually eat more than you need almost without noticing.",
      "Studies associate eating fast with a greater tendency to be overweight. Slowing down, chewing and pausing helps you eat the right amount and enjoy it more. Speed matters mostly through your appetite.",
    ],
  },
  "chocolate-negro": {
    titulo: "Is dark chocolate really healthy?",
    parrafos: [
      "Dark chocolate with a high cacao percentage provides flavonoids, antioxidants associated with some cardiovascular benefits, as well as minerals like magnesium.",
      "But it's still a calorific food with fat in it, so «healthy» isn't permission to eat it without limit. The key is the amount, and choosing one with plenty of cacao and little sugar.",
      "A couple of squares of dark chocolate (70% or more) can fit nicely into a balanced diet. Milk or white chocolate, on the other hand, is mostly sugar and fat: there the healthy aura disappears.",
    ],
  },
  canela: {
    titulo: "Does cinnamon help control blood sugar?",
    parrafos: [
      "Some studies suggest cinnamon might have a mild effect on blood glucose, but the results are mixed and not very consistent from one piece of research to another.",
      "In no case does it replace medication or diabetes treatment. Relying on cinnamon to control your blood sugar would be a mistake with serious consequences.",
      "As a spice it's wonderful: it gives sweetness and aroma without sugar, which helps you sweeten things more healthily. Enjoy it for its flavor, not as if it were a medicine.",
    ],
  },
  "fruta-engorda": {
    titulo: "Does fruit make you fat?",
    parrafos: [
      "Fruit has fructose, but it also has fiber, water and plenty of nutrients, and it provides relatively few calories for how filling it is. It's one of the foods that satisfies best per calorie.",
      "In studies, eating fruit is associated with better weight control, not with gaining weight. Its fiber slows down the absorption of sugar and helps you eat less of other things.",
      "Unless you've been told otherwise for a very specific medical reason, there's no cause to limit fruit for fear of gaining weight. The sugar «danger» is in added sugar and in juice, not in a whole apple or banana.",
    ],
  },
  "comer-poco-muchas-veces": {
    titulo: "Is it better to eat little and often?",
    parrafos: [
      "For years people said that eating many small meals «speeds up your metabolism». Today we know that the number of meals barely changes the calories you spend in a day.",
      "What really counts is the total energy and the quality of what you eat, not whether you split it into three sittings or five. There's no single formula that's best for everyone.",
      "The ideal is whatever works for you: some people find that eating several times keeps them from snacking; others feel more satisfied with fewer, fuller meals.",
      "Choose the pattern you can keep to and that sits well with you.",
    ],
  },
  "alimentos-sacian": {
    titulo: "Which foods actually fill you up most?",
    parrafos: [
      "Not all foods fill you the same for the same calories. The most filling ones combine protein, fiber, water and volume, because they fill the stomach and send fullness signals to the brain.",
      "Which is why legumes, eggs, fish, vegetables, whole fruit, oats or boiled potatoes are so filling: they give a lot of «bulk» for relatively few calories.",
      "At the opposite end are ultra-processed foods: a lot of energy in very little volume, easy to eat without stopping, and barely filling.",
      "Choosing foods that genuinely fill you up is one of the keys to eating well without going hungry.",
    ],
  },
};

/** Los mitos en el idioma que se le pase. Sin hook, para poder usarlo también
 *  dentro de un `useMemo` o fuera de un componente. El español manda el orden,
 *  la `key` (que es lo que se guarda como leído) y la foto. */
export function mitosTraducidos(mitos: NutrienteTarjeta[], idioma: "es" | "en"): NutrienteTarjeta[] {
  if (idioma === "es") return mitos;
  return mitos.map((m) => {
    const en = MITOS_NUTRICION_EN[m.key];
    return en ? { ...m, ...en } : m;
  });
}
