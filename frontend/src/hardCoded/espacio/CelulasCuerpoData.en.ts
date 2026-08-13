import type { Celula } from "./CelulasCuerpoData";

/**
 * Las fichas de las células del cuerpo, en INGLÉS.
 *
 * Aquí va SOLO el texto, emparejado por el `id` de la célula. El orden, el `id`
 * y la `foto` viven únicamente en el fichero español: si se duplicaran, bastaría
 * cambiar una foto en un idioma y no en el otro para que la misma célula se
 * viera distinta según el idioma.
 *
 * Lo que falte en este mapa se muestra en español, célula a célula (ver
 * `useCelulas`). Es la misma regla que ya usan los órganos de la sonrisa, los
 * temas de Profundiza y las sefirot de Cábala.
 *
 * Al traducir:
 *  · «la Vida» con mayúscula intencionada se queda "Life".
 *  · Los nombres de las células son los términos de siempre en inglés
 *    (*Kupffer cells*, *Paneth cells*, *goblet cells*…), no una traducción
 *    literal del español.
 *  · Ojo con los «billones» españoles: son 10¹², o sea *trillion*.
 *  · La voz es la de María: segunda persona, contracciones naturales y frases
 *    cortas. Nada de inglés corporativo.
 */
export type CelulaTexto = Pick<Celula, "nombre" | "descripcion" | "cuidados" | "claves">;

export const CELULAS_EN: Record<string, CelulaTexto> = {
  // ── Cerebro ──
  neuronas: {
    nombre: "Neurons",
    claves: ["They carry electrical impulses", "They talk with neurotransmitters", "They hold thought and memory"],
    descripcion:
      "When a neuron fires, an electrical current is generated in which sodium comes in and potassium goes out, letting the electrical impulse travel through the cell. And that's how a thought is made. Neurons talk to each other through neurotransmitters, building the living network of everything we feel, think and remember.",
    cuidados:
      "Take care of them with good sleep (during deep sleep the brain cleans itself and processes information better), exercise (they love movement; it encourages neuroplasticity) and by avoiding too much alcohol (it interferes with communication between neurons and can damage them in the long run).",
  },
  astrocitos: {
    nombre: "Astrocytes",
    claves: ["They feed the neurons", "They keep the blood-brain barrier", "They clean up neurotransmitters"],
    descripcion:
      "They hold up and protect the brain's ecosystem. They help keep the barrier between the blood and the brain, they feed the neurons and they clean up neurotransmitters once they've been used, so communication can start over in balance.",
    cuidados:
      "Help them with salted water (it matters that the chemistry stays in balance) and deep sleep (it helps them clean more thoroughly).",
  },
  microglia: {
    nombre: "Microglia",
    claves: ["The brain's immune watch", "They spot debris and threats", "They clean and recycle the place"],
    descripcion:
      "The brain's immune guardians. They can detect when there's something that doesn't belong in the brain's ecosystem — cell debris, damaged proteins or possible threats — and they engulf it to clean and recycle the neurons' surroundings.",
    cuidados:
      "Lower inflammation with rest (because they can clean while you sleep), stress management (cortisol can push them to overreact and do their job badly) and an anti-inflammatory diet (the brain is very sensitive to the signals coming up from the colon through the vagus nerve).",
  },
  oligodendrocitos: {
    nombre: "Oligodendrocytes",
    claves: ["They produce myelin", "They speed up nerve signals", "They help you learn and adapt"],
    descripcion:
      "Cells in charge of producing myelin, a layer that wraps the axons of neurons and hugely speeds up how information travels between them. They're essential for coordination, thinking, learning and practically every brain function. They also take part in the brain's capacity to adapt and reorganize itself.",
    cuidados:
      "Support their work with healthy fats (omega-3), vitamin B12 and good metabolic health.",
  },
  ependimarias: {
    nombre: "Ependymal cells",
    claves: ["They produce cerebrospinal fluid", "They feed and protect the brain", "They keep the surroundings in balance"],
    descripcion:
      "They produce and move the cerebrospinal fluid, the liquid that protects, feeds and lets nutrients and cells move around the brain's ecosystem. Because of that, they keep the balance of the place where neurons and glia live.",
    cuidados: "To take care of them (to take care of you), don't forget to drink water.",
  },
  "endotelial-cerebral": {
    nombre: "Brain endothelial cell",
    claves: ["They form the blood-brain barrier", "They decide what enters the brain", "They protect the neurons"],
    descripcion:
      "They line the blood vessels of the brain and form the blood-brain barrier: an extraordinarily selective border that decides what gets into nerve tissue and what doesn't. Joined to each other very tightly, they protect neurons from toxins, pathogens and sudden changes in the blood, while letting oxygen and essential nutrients through.",
    cuidados:
      "They benefit from exercise, keeping blood pressure in check and an anti-inflammatory diet that looks after your vessels.",
  },
  pericito: {
    nombre: "Pericyte",
    claves: ["They hug the capillaries", "They regulate blood flow", "Keepers of the microcirculation"],
    descripcion:
      "They hug the smallest capillaries, wrapping them from the outside. They regulate blood flow by adjusting the diameter of the capillary and they take part in keeping the blood-brain barrier and in repairing vessels. They're the silent keepers of the microcirculation.",
    cuidados:
      "They're looked after with good vascular health: exercise, steady blood sugar and no tobacco.",
  },
  "celula-madre-neural": {
    nombre: "Neural stem cell",
    claves: ["They generate new neurons", "Neurogenesis for Life", "They support learning and memory"],
    descripcion:
      "They're the cells that can generate new neurons and glial cells. Although much of the brain is formed before birth, in some areas they keep producing neurons for your whole Life (neurogenesis), taking part in learning and memory.",
    cuidados:
      "Encourage neurogenesis with exercise, continuous learning, good sleep and stress management.",
  },

  // ── Hígado ──
  hepatocitos: {
    nombre: "Hepatocytes",
    claves: ["They detoxify the body", "They turn nutrients into energy", "They make bile and proteins"],
    descripcion:
      "Fundamental. Everything we breathe, eat or drink passes through them one way or another. They detoxify potentially harmful substances and turn nutrients into usable energy. They metabolize glucose and, depending on your movement and your energy expenditure, they decide whether to turn it into ATP (immediate energy), store it as glycogen or turn it into fat for the reserve. They also make many essential proteins and enzymes out of the amino acids in your diet. They manage fats and cholesterol, which are fundamental for building cell membranes and hormones. And they produce bile, which is essential for digesting and properly absorbing fats and fat-soluble vitamins. Without enough bile, fats are absorbed poorly and you can get digestive problems, vitamin deficiencies and pale or greasy stools.",
    cuidados:
      "Take care of them by avoiding alcohol (because it adds an enormous toxic load to the detoxification system), keeping a diet rich in fiber and avoiding sugars and ultra-processed fats.",
  },
  kupffer: {
    nombre: "Kupffer cells",
    claves: ["The liver's immunity", "They filter blood from the gut", "They clear bacteria and toxins"],
    descripcion:
      "The liver's immune cells. They filter the blood arriving from the intestine and clear out bacteria, toxins and cell debris before they circulate through the rest of the body. They're a kind of silent sentinel between digestion and the immune system.",
    cuidados:
      "They benefit from good gut health and anti-inflammatory foods like turmeric and ginger.",
  },
  estrelladas: {
    nombre: "Stellate cells",
    claves: ["They store vitamin A", "They repair liver tissue", "In excess, they create fibrosis"],
    descripcion:
      "They store vitamin A and take part in repairing liver tissue when there's damage. When the liver is injured chronically, they can be activated too much and produce fibrosis, forming scars in the liver.",
    cuidados:
      "Protect them by avoiding liver damage, which happens with drinking alcohol, metabolic inflammation and too much fat piling up in the liver.",
  },

  // ── Páncreas ──
  "celulas-beta": {
    nombre: "Beta cells",
    claves: ["They produce insulin", "They let you use glucose", "They regulate blood sugar"],
    descripcion:
      "They produce insulin, the hormone that lets cells take in glucose and use it as energy. When there's too much visceral fat, many cells stop responding well to insulin (insulin resistance), so the pancreas tries to make up for it by producing more and more. Over time, that excess encourages inflammation, vascular damage and arteries that are stiffer and “stickier”, raising metabolic and cardiovascular risk.",
    cuidados:
      "Take care of them by avoiding constant sugar spikes and too many ultra-processed foods, and by keeping regular physical movement.",
  },
  "celulas-alfa": {
    nombre: "Alpha cells",
    claves: ["They produce glucagon", "They switch on when sugar drops", "They mobilize the energy reserves"],
    descripcion:
      "They produce glucagon, the hormone released when blood glucose is low. Glucagon tells the body to mobilize its stored reserves, especially glycogen and fat, to turn them into usable energy. That's why, when you don't eat for a while, the body starts using part of the energy stored in your fat tissue.",
    cuidados:
      "They hold their balance better with steady eating, good rest and proper insulin sensitivity.",
  },
  "celulas-delta": {
    nombre: "Delta cells",
    claves: ["They produce somatostatin", "A smart hormonal brake", "They balance insulin and glucagon"],
    descripcion:
      "They produce somatostatin, a regulating hormone that works as a “smart brake”, helping to balance the release of insulin, glucagon and other digestive hormones so the system doesn't run out of control.",
    cuidados:
      "They benefit from good general metabolic health, which means it matters that you stop eating when you're full.",
  },
  "celulas-acinares": {
    nombre: "Acinar cells",
    claves: ["They produce digestive enzymes", "They digest fats and proteins", "They break carbohydrates down"],
    descripcion:
      "They produce enzymes like amylase, lipase and proteases to digest carbohydrates, fats and proteins.",
  },
  "celulas-ductales": {
    nombre: "Ductal cells",
    claves: ["They produce bicarbonate", "They neutralize stomach acid", "They make digestion easier"],
    descripcion:
      "They produce bicarbonate to neutralize the acid coming from the stomach and make digestion easier.",
  },
  "celulas-pp": {
    nombre: "PP cells (gamma)",
    claves: ["They produce pancreatic polypeptide", "They coordinate digestive activity", "They help control appetite"],
    descripcion:
      "They produce pancreatic polypeptide, a hormone that helps coordinate digestive activity, regulating the secretion of pancreatic enzymes and the work of the gallbladder. It also seems to take part in controlling appetite.",
    cuidados: "They benefit from regular eating habits (having set mealtimes).",
  },

  // ── Piel ──
  queratinocitos: {
    nombre: "Keratinocytes",
    claves: ["They form the skin's barrier", "They protect you from the outside world", "They renew themselves nonstop"],
    descripcion:
      "Your skin is made of many layers of keratinocytes, cells born in the deepest layers that slowly climb toward the surface. The first ones are stem cells that divide constantly to generate new generations of keratinocytes, building a living barrier that protects the inside of your body from the outside world. As they climb, they flatten, fill with keratin and bind more and more tightly to each other, forming a flexible, tough wall. When they complete their cycle, they die, they shed and they turn into dust.",
    cuidados:
      "Protect them with good hydration, proper nutrition and by avoiding too much sun or constant assaults on your skin.",
  },
  melanocitos: {
    nombre: "Melanocytes",
    claves: ["They produce melanin", "They give skin its color", "They protect DNA from the sun"],
    descripcion:
      "They produce melanin, the pigment that gives skin its color and helps absorb part of the ultraviolet radiation to protect the cells' DNA. When they get too much solar radiation, they step up their activity as a defense mechanism.",
    cuidados:
      "Use sunscreen and avoid excessive sun exposure to prevent damage and overstimulating the cells.",
  },
  langerhans: {
    nombre: "Langerhans cells",
    claves: ["The skin's sentinels", "They spot microbes and damage", "They switch on the skin's defense"],
    descripcion:
      "They detect microorganisms, foreign substances and signals of damage, switching on defensive responses to protect the skin barrier.",
    cuidados:
      "Look after your skin barrier by avoiding harsh irritants, chronic inflammation and too many products that disturb your natural balance.",
  },
  merkel: {
    nombre: "Merkel cell",
    claves: ["Touch receptors", "They detect gentle pressure", "They sense fine textures"],
    descripcion:
      "They're touch receptors sitting in the deep layers of your skin, especially in very sensitive areas like your fingertips. They detect gentle pressure and the fine detail of textures, connecting your skin to your nervous system.",
    cuidados:
      "They stay healthy by looking after your skin and your nervous system: good nutrition, hydration and rest.",
  },

  // ── Intestino ──
  enterocitos: {
    nombre: "Enterocytes",
    claves: ["They absorb the nutrients", "The intestine's border", "They block harmful substances"],
    descripcion:
      "They're the cells lining the intestine, and they absorb the nutrients from everything we eat. They work as a smart border: they let vitamins, minerals, amino acids, fats and glucose through into the blood, and they try to block potentially harmful substances from getting into circulation. They're one of the most important interfaces between the outside world and the inside of your body.",
    cuidados:
      "Take care of them with fiber, quality nutrients and by avoiding too many ultra-processed foods and gut inflammation.",
  },
  caliciformes: {
    nombre: "Goblet cells",
    claves: ["They produce the gut's mucus", "A shield against bacteria", "They prevent inflammation"],
    descripcion:
      "They produce the mucus that coats and protects the intestine. That mucous layer works as a living shield that keeps most gut bacteria at a safe distance from the enterocytes, helping to prevent inflammation and stop unwanted substances from passing into the blood.",
    cuidados: "They benefit from good hydration, fiber and a balanced microbiota.",
  },
  paneth: {
    nombre: "Paneth cells",
    claves: ["The gut's guardians", "They release antimicrobials", "They balance the microbiota"],
    descripcion:
      "They're the guardians of the intestine. They release antimicrobial substances that help control harmful bacteria and keep the gut ecosystem in balance, right next to the intestinal stem cells.",
    cuidados:
      "Support their work with a healthy microbiota (eat kimchi, bifidus, miso, sauerkraut), enough sleep and low chronic inflammation.",
  },
  enteroendocrinas: {
    nombre: "Enteroendocrine cells",
    claves: ["They sense the nutrients", "They produce digestive hormones", "A gut-brain bridge"],
    descripcion:
      "They're cells that can “feel” the nutrients arriving in the intestine and respond by producing digestive hormones that regulate hunger, fullness and gut movement. They're a kind of chemical bridge between the intestine and the brain.",
    cuidados:
      "They find their balance with regular eating, steady circadian rhythms and good metabolic health.",
  },
  "celula-madre-intestinal": {
    nombre: "Intestinal stem cell",
    claves: ["They renew the intestine", "They divide without rest", "They keep the border young"],
    descripcion:
      "They live at the bottom of the intestinal crypts and divide without rest to completely renew the lining of the intestine every few days. Thanks to them, the gut's border stays young and working.",
    cuidados: "They benefit from a healthy microbiota, fiber and low gut inflammation.",
  },

  // ── Estómago ──
  parietal: {
    nombre: "Parietal cell",
    claves: ["They produce gastric acid", "They break food down", "They let you absorb B12"],
    descripcion:
      "They produce the hydrochloric acid in your stomach, which helps break food down and clear out microorganisms. They also make intrinsic factor, which is essential for absorbing vitamin B12 further along in the intestine.",
    cuidados:
      "Look after them with regular mealtimes, stress management and by not overusing antacids you don't need.",
  },
  principal: {
    nombre: "Chief cell",
    claves: ["They secrete pepsinogen", "It's activated as pepsin", "They start digesting proteins"],
    descripcion:
      "They secrete pepsinogen, which on contact with stomach acid turns into pepsin, the enzyme that starts digesting the proteins in your food.",
    cuidados: "They benefit from eating calmly and chewing well to make digestion easier.",
  },
  "mucosa-gastrica": {
    nombre: "Gastric mucous cell",
    claves: ["They produce protective mucus", "A shield against acid", "They protect the stomach wall"],
    descripcion:
      "They produce a layer of mucus and bicarbonate that coats the stomach and protects it from its own acid. Without that shield, the acid would damage the gastric wall.",
    cuidados:
      "Protect them by avoiding too much alcohol, tobacco and anti-inflammatories, which weaken the protective layer.",
  },
  "enteroendocrinas-gastricas": {
    nombre: "Gastric enteroendocrine cell",
    claves: ["They sense what reaches the stomach", "They produce gastrin", "They regulate acid secretion"],
    descripcion:
      "They “feel” what arrives in the stomach and respond by producing hormones like gastrin, which regulates acid secretion and coordinates digestive activity with the rest of the body.",
    cuidados: "They find their balance with regular eating and steady mealtimes.",
  },

  // ── Músculo ──
  miocitos: {
    nombre: "Muscle fiber (myocytes)",
    claves: ["They contract the muscle", "They make movement possible", "They use calcium to switch on"],
    descripcion:
      "They're the cells in charge of muscle contraction, which is what makes the body's movement possible. They're made of very fine filaments of actin and myosin, arranged in a highly ordered way, and they use calcium as the key signal to switch the contraction on. When a nerve signal arrives, acetylcholine is released at the neuromuscular junction; that generates an electrical impulse which triggers the release of calcium inside the muscle fiber. That calcium lets actin and myosin interact, producing the contraction.",
    cuidados:
      "Take care of them with regular exercise, enough protein and proper rest to support their repair and adaptation.",
  },
  cardiomiocitos: {
    nombre: "Cardiomyocytes",
    claves: ["The heart's muscle", "They beat automatically", "They keep the circulation going"],
    descripcion:
      "They're the muscle cells of the heart, responsible for its rhythmic, continuous contractions that keep blood circulating. They work in a coordinated, automatic way, generating the beat that holds Life up.",
    cuidados:
      "They're strengthened by cardiovascular exercise and good stress regulation (meditate).",
  },
  "musculares-lisas": {
    nombre: "Smooth muscle cells",
    claves: ["They move the internal organs", "Involuntary contraction", "They regulate flow and tone"],
    descripcion:
      "They control the involuntary contraction of internal organs like the intestine, the blood vessels and other visceral structures. They regulate the flow, the movement and the tone of those systems continuously and automatically.",
    cuidados:
      "They benefit from good circulation, regular physical activity and a general balance of the autonomic nervous system.",
  },
  satelite: {
    nombre: "Satellite cell",
    claves: ["The muscle's stem cells", "They repair the fibers", "They make muscle grow"],
    descripcion:
      "They're the stem cells of muscle. They rest alongside the muscle fibers and, when the muscle is damaged or put under effort, they switch on to repair it and make it grow. They're the reason muscle gets stronger with training.",
    cuidados: "They're switched on by strength training, enough protein and good rest.",
  },

  // ── Hueso ──
  osteoblastos: {
    nombre: "Osteoblasts",
    claves: ["They build new bone", "They make the bone matrix", "They mineralize the skeleton"],
    descripcion:
      "They're the cells in charge of forming bone. They synthesize the bone matrix and make mineralization possible, building new tissue continuously. Their activity is shaped by hormones like estrogens, testosterone, cortisol and vitamin D (which actually acts as a hormone regulating calcium metabolism).",
    cuidados:
      "They're stimulated by vitamin D, enough calcium in your diet and impact or resistance exercise.",
  },
  osteoclastos: {
    nombre: "Osteoclasts",
    claves: ["They break old bone down", "They let bone be renewed", "They release calcium if needed"],
    descripcion:
      "They're the cells responsible for bone resorption, that is, breaking old bone down so osteoblasts can build new bone. That process is essential and keeps a healthy skeleton. But when there's chronic stress or hormonal imbalance, breakdown can outpace formation. And if blood calcium is low, the body can turn to bone as a reserve to keep it steady, which raises osteoclast activity.",
    cuidados:
      "Their balance depends on exercise, good hormonal health and proper levels of essential nutrients (calcium should stay in the normal range under medical supervision, avoiding unnecessary supplements).",
  },
  osteocitos: {
    nombre: "Osteocytes",
    claves: ["The bone's sensors", "They detect pressure and load", "They adapt bone to effort"],
    descripcion:
      "They're mature bone cells derived from osteoblasts. They live inside the bone matrix and form a communication network through tiny canals, acting as mechanical sensors that detect pressure and load on the bone, allowing it to adapt to heavy loads.",
    cuidados:
      "Regular exercise, especially loading or impact exercise, improves their signaling and keeps bone strong and functional.",
  },
  condrocito: {
    nombre: "Chondrocyte",
    claves: ["The cartilage cells", "They cushion the joints", "They repair with difficulty"],
    descripcion:
      "They're the cells of cartilage. They make and maintain the flexible, tough matrix that covers your joints and cushions the rubbing between bones. Cartilage is fed slowly and with little blood, so it repairs with difficulty.",
    cuidados:
      "They benefit from gentle, regular movement, a healthy weight and well-hydrated joints.",
  },

  // ── Sangre e inmunidad ──
  eritrocitos: {
    nombre: "Erythrocytes",
    claves: ["They carry oxygen", "Packed with hemoglobin", "They let you produce energy"],
    descripcion:
      "They carry oxygen from the lungs to every cell in your body, making cellular respiration and the production of energy (ATP) possible. They have no nucleus and they're packed with hemoglobin, a protein that binds oxygen thanks to the iron atom sitting at the center of its heme group; it has four heme groups, so it can carry four atoms of oxygen. Vitamin B12 is essential for them to form properly in the bone marrow.",
    cuidados:
      "They benefit from enough iron, vitamin B12 and good general metabolic health.",
  },
  plaquetas: {
    nombre: "Platelets",
    claves: ["Fragments of a megakaryocyte", "They plug a wound", "They switch on coagulation"],
    descripcion:
      "They aren't whole cells, but cell fragments: that's why they have no nucleus. They're born from a giant cell living in the bone marrow, the megakaryocyte, which extends very long, branching projections called proplatelets — like tentacles — and slips their tips inside the blood vessels of the marrow itself. The flow of blood keeps breaking and shedding those tips, and every fragment released into the circulation is a platelet. A single megakaryocyte can produce between 1,000 and 3,000 of them before it runs out and disappears. Once in the blood, they watch over the integrity of your vessels: when there's a wound they rush in, gather together and form an initial plug that stops the bleeding, then switch on the coagulation cascade to seal the injury. Since they have no nucleus they can't repair themselves either, so they live 7 to 10 days and are replaced without a break.",
    cuidados: "They benefit from good hydration, vitamin K and a balanced diet.",
  },
  neutrofilos: {
    nombre: "Neutrophils",
    claves: ["First on the scene of an infection", "They engulf microorganisms", "Soldiers that sacrifice themselves"],
    descripcion:
      "They're cells of the innate immune system, the first to arrive when there's an infection. They engulf and destroy microorganisms. Suicide soldiers, they usually sacrifice themselves to contain the threat.",
    cuidados: "Support them with good rest, proper nutrition and a balanced immune system.",
  },
  eosinofilos: {
    nombre: "Eosinophils",
    claves: ["They defend against parasites", "They take part in allergies", "They destroy big threats"],
    descripcion:
      "They're immune cells specialized in defending against parasites and in taking part in allergic reactions. They release powerful substances that destroy big threats that can't be engulfed.",
    cuidados:
      "They find their balance with a healthy immune system and by avoiding chronic allergic inflammation.",
  },
  basofilos: {
    nombre: "Basophils",
    claves: ["They release histamine", "They set inflammation off", "They call in other defenses"],
    descripcion:
      "They're immune cells that release histamine and other substances which set off the inflammatory and allergic response. They help draw other defensive cells toward the area where there's a threat.",
    cuidados:
      "They benefit from a well-regulated immune system and from avoiding unnecessary allergic triggers.",
  },
  monocitos: {
    nombre: "Monocytes",
    claves: ["The immune system's mobile reserve", "They migrate into the tissues", "They become macrophages"],
    descripcion:
      "They circulate in your blood as the immune system's mobile reserve. When they detect an infection or damage, they migrate into the tissues and turn into macrophages or dendritic cells, engulfing threats and switching on the immune response.",
    cuidados: "Support them with good rest, proper nutrition and an anti-inflammatory diet.",
  },
  macrofagos: {
    nombre: "Macrophages",
    claves: ["They engulf bacteria and debris", "They recycle dead cells", "They prevent inflammation in the tissue"],
    descripcion:
      "They're immune cells that engulf bacteria, cell debris and damaged cells. They also play an essential recycling role, clearing out cells that have entered programmed death (apoptosis) before they cause inflammation or damage in the tissue.",
    cuidados:
      "They benefit from an anti-inflammatory diet rich in fruit, vegetables and omega-3.",
  },
  "linfocitos-b": {
    nombre: "B lymphocytes",
    claves: ["They produce antibodies", "They recognize antigens", "They mark pathogens for clearing"],
    descripcion:
      "They're cells of the adaptive immune system in charge of producing antibodies. When they detect a specific antigen (with help from other immune cells), they switch on and generate antibodies that bind to pathogens, marking them to be cleared.",
    cuidados:
      "They're helped by controlled exposure to different illnesses, good nutrition and a well-regulated immune system.",
  },
  "linfocitos-t": {
    nombre: "T lymphocytes",
    claves: ["They coordinate the immune response", "They recognize antigens", "They destroy infected cells"],
    descripcion:
      "They're key cells of the adaptive immune system. Dendritic cells present them with fragments of antigens, and T lymphocytes recognize whether they fit their specific receptor. If there's a match, they switch on and coordinate the immune response, helping to activate B lymphocytes or destroying infected cells. How fluid and functional their membranes are depends in part on the presence of unsaturated fats, which help cells communicate.",
    cuidados:
      "Support them with deep sleep (which is when they act the most), stress management and good nutritional balance (unsaturated fats and essential amino acids).",
  },
  dendriticas: {
    nombre: "Dendritic cells",
    claves: ["The immune system's sentinels", "They capture the pathogen", "They switch T lymphocytes on"],
    descripcion:
      "They're the sentinel cells of the immune system. They detect foreign molecules, capture samples of the pathogen and present them to T lymphocytes in the lymphoid organs, starting the adaptive immune response.",
    cuidados:
      "Their work is very much shaped by gut health and the balance of the microbiota.",
  },

  // ── Pulmón ──
  "neumocitos-1": {
    nombre: "Type I pneumocytes",
    claves: ["They form the alveolar wall", "They allow gas exchange", "They let oxygen through"],
    descripcion:
      "They're the cells forming most of the surface of the lung's alveoli, and they allow gas exchange. Through their extremely thin membrane, oxygen passes from the air in your lungs into your red blood cells to be carried. And in the same exchange, carbon dioxide leaves the blood to be pushed out.",
    cuidados:
      "Look after them with clean air, avoiding tobacco and exposure to pollutants.",
  },
  "neumocitos-2": {
    nombre: "Type II pneumocytes",
    claves: ["They produce surfactant", "They keep the alveolus from collapsing", "They repair the lung"],
    descripcion:
      "They produce lung surfactant, a substance that lowers the surface tension inside the alveoli, keeping them from collapsing as you breathe and making it easier for them to expand even with big changes in air volume. They also take part in repairing lung tissue when there's damage.",
    cuidados: "They're helped by good respiratory health and exercise.",
  },
  "macrofagos-alveolares": {
    nombre: "Alveolar macrophages",
    claves: ["The lung's defense", "They clear dust and microbes", "They clean the air coming in"],
    descripcion:
      "They're the lung's defensive cells. They clear out particles, dust, microorganisms and toxins entering the respiratory system with every breath. When they're overloaded, as happens with tobacco smoke, their cleaning capacity drops and the risk of lung damage and inflammation goes up.",
    cuidados:
      "They're protected by avoiding smoke and pollution and by keeping a clean environment to breathe.",
  },
  "celula-ciliada": {
    nombre: "Ciliated cell",
    claves: ["Covered in cilia", "They sweep mucus upward", "They keep your lungs clean"],
    descripcion:
      "They line the airways and are covered in cilia, tiny “little hairs” that move in a coordinated way like a wheat field in the wind. With that movement they sweep upward the mucus loaded with dust, particles and microbes so it can be cleared out, keeping your lungs clean.",
    cuidados:
      "Protect them by avoiding tobacco smoke (which paralyzes the cilia) and by breathing clean, well-humidified air.",
  },
  "celula-club": {
    nombre: "Club (Clara) cell",
    claves: ["They detoxify the air you breathe in", "They defend against inflammation", "They regenerate the epithelium"],
    descripcion:
      "They live in the small airways. They secrete protective substances that help detoxify the air you breathe in, they defend against inflammation and they take part in regenerating the respiratory epithelium when it's damaged.",
    cuidados:
      "They benefit from a clean environment to breathe and from avoiding pollutants and smoke.",
  },

  // ── Corazón ──
  marcapasos: {
    nombre: "Pacemaker cell (sinus node)",
    claves: ["They set the heart's rhythm", "They generate the beat's impulse", "They coordinate the contraction"],
    descripcion:
      "They're the cells that set the heart's rhythm. They spontaneously generate the electrical impulse that starts every beat, and they do it without needing any order from outside. That impulse spreads through the whole heart and coordinates the contraction, holding up the pulse of Life.",
    cuidados:
      "They find their balance with good cardiovascular fitness, rest and nervous system regulation (breathe, meditate).",
  },
  purkinje: {
    nombre: "Purkinje cell",
    claves: ["Fast electrical conduction", "They carry the impulse to the ventricles", "Strong, coordinated pumping"],
    descripcion:
      "They form a fast conduction network that carries the electrical impulse to the walls of the heart's ventricles. Thanks to them, the contraction of the heart muscle is coordinated and powerful, letting blood be pumped forcefully with every beat.",
    cuidados:
      "They depend on a healthy heart: exercise, good electrolyte balance and stress management.",
  },

  // ── Riñón ──
  podocitos: {
    nombre: "Podocytes",
    claves: ["They filter blood in the kidney", "They let waste through", "They hold useful proteins back"],
    descripcion:
      "They're specialized cells forming part of the filtration barrier of the kidney's glomerulus. They regulate which substances can pass from the blood into the initial filtrate of urine, letting waste through and holding back important proteins and cells.",
    cuidados:
      "They're looked after with good hydration and by avoiding chronic excess salt and metabolic damage.",
  },
  "celulas-tubulares": {
    nombre: "Tubular cells",
    claves: ["They reabsorb water and salts", "They recover useful nutrients", "They keep your internal balance"],
    descripcion:
      "They form the kidney's tubules and are responsible for reabsorbing water, salts and useful nutrients from the urine filtrate back into the blood, as well as secreting certain waste substances. They're key for keeping the body's internal balance.",
    cuidados:
      "They benefit from constant hydration, good blood pressure and electrolyte balance.",
  },
  "tubulo-proximal": {
    nombre: "Proximal tubule cell",
    claves: ["First to work on the filtrate", "They recover water and glucose", "They return what's useful to the blood"],
    descripcion:
      "They're the first to work on the filtrate coming out of the glomerulus. They recover most of the water, the glucose, the amino acids and the useful salts, returning them to the blood so they aren't lost in the urine.",
    cuidados:
      "They're looked after with good hydration, steady blood sugar and by avoiding high blood pressure.",
  },
  "asa-henle": {
    nombre: "Loop of Henle cell",
    claves: ["They concentrate the urine", "They save water", "They balance your fluids"],
    descripcion:
      "They create a gradient of salt concentration inside the kidney that makes it possible to concentrate urine and save water when the body needs it. They're key for keeping fluid balance.",
    cuidados: "They benefit from constant hydration and moderate salt intake.",
  },
  "tubulo-distal": {
    nombre: "Distal tubule cell",
    claves: ["Fine-tuning of the filtrate", "They regulate salt, water and potassium", "They fine-tune blood pressure"],
    descripcion:
      "They do the fine-tuning of the filtrate: under the control of hormones like aldosterone, they decide how much salt and water to reabsorb and how much potassium to clear out, fine-tuning your internal balance and your blood pressure.",
    cuidados:
      "Support them with electrolyte balance, hydration and good hormonal regulation.",
  },

  // ── Tejido conectivo y grasa ──
  fibroblastos: {
    nombre: "Fibroblasts",
    claves: ["They produce collagen", "They give structure and elasticity", "They repair the tissues"],
    descripcion:
      "They're the cells in charge of producing and organizing the extracellular matrix, especially collagen, which brings structure, strength and elasticity to tissues like skin, tendons, ligaments, blood vessels, cartilage and other connective organs. They also take part in repairing tissue when there's damage.",
    cuidados:
      "They're helped by vitamin C, enough protein, collagen peptides (which nudge them into making more collagen themselves) and a way of Life that lowers chronic inflammation.",
  },
  mastocito: {
    nombre: "Mast cell",
    claves: ["The tissue's sentinels", "They store histamine", "The stars of allergies"],
    descripcion:
      "They're the sentinels of connective tissue. They store histamine and other substances they release in the face of a threat or an allergen, setting off inflammation and drawing in other immune cells. They're the stars of allergic reactions.",
    cuidados:
      "They find their balance by avoiding allergic triggers and keeping chronic inflammation low.",
  },
  "adipocitos-blancos": {
    nombre: "White adipocytes",
    claves: ["They store energy", "They release leptin", "They report the reserves to the brain"],
    descripcion:
      "They're the cells that store energy as triglycerides, and they work as an active endocrine organ. They release leptin, a hormone that tells the brain about the state of your energy reserves and about fullness.",
    cuidados:
      "They find their balance with calorie balance (listen to your body, you'll know when you're full), regular physical activity and good metabolic sensitivity.",
  },
  "adipocitos-marrones": {
    nombre: "Brown adipocytes",
    claves: ["They burn fat as fuel", "They generate heat", "They hold your temperature"],
    descripcion:
      "They store energy as triglycerides, though less of it than white adipocytes. They have plenty of mitochondria, which lets them use fat as fuel and generate heat (thermogenesis). They're essential for holding body temperature and they let some mammals survive hibernation.",
    cuidados:
      "Take care of them with regular cold exposure (like cold showers or baths), frequent physical activity and good rest.",
  },
  endoteliales: {
    nombre: "Endothelial cells",
    claves: ["They line the blood vessels", "They regulate flow and clotting", "Key for the heart"],
    descripcion:
      "They line the inside of your blood vessels, forming a dynamic barrier between the blood and the tissues. They regulate blood flow, clotting, inflammation and the exchange of substances, and they're essential for cardiovascular health.",
    cuidados:
      "They benefit enormously from cardiovascular exercise, good food and low LDL and cortisol levels.",
  },

  // ── Tiroides ──
  tirocito: {
    nombre: "Thyrocyte",
    claves: ["They produce thyroid hormones", "They regulate metabolism", "They use iodine to make them"],
    descripcion:
      "They're the main cells of the thyroid. They produce thyroid hormones (T3 and T4) out of iodine, hormones that regulate the metabolism of your whole body: the speed at which we burn energy, your temperature, your heart rate and even your mood.",
    cuidados:
      "They benefit from a proper supply of iodine and selenium, and from a good balance with stress.",
  },
  "celula-c": {
    nombre: "C cell (parafollicular)",
    claves: ["They produce calcitonin", "They lower blood calcium", "They deposit it in bone"],
    descripcion:
      "They produce calcitonin, a hormone that helps bring blood calcium down when it's too high, encouraging it to be deposited in bone. They take part in the body's delicate calcium balance.",
    cuidados: "Support them with good bone health and balanced calcium and vitamin D levels.",
  },

  // ── Lengua (gusto) ──
  "gustativa-tipo2": {
    nombre: "Taste cell (type II)",
    claves: ["They detect sweet, bitter and umami", "They recognize the molecules of taste", "They alert the taste nerve"],
    descripcion:
      "They're the receptors for sweet, bitter and umami. Their membrane carries G protein-coupled receptors that recognize the molecules of taste; when they switch on, they release ATP as a messenger to alert the fibers of the taste nerve, which carry the signal to the brain. They live inside the taste buds, packed together like the segments of an orange.",
    cuidados:
      "Take care of them by avoiding tobacco and too much very hot or irritating food, keeping good oral hygiene and a proper supply of zinc, which helps preserve your sense of taste.",
  },
  "gustativa-tipo3": {
    nombre: "Sour taste cell (type III)",
    claves: ["They detect sour taste", "They form synapses with the nerve", "They fine-tune the perception of taste"],
    descripcion:
      "They're the receptors for sour taste and the only ones in the taste bud that form classic synapses with nerve fibers, releasing serotonin and other neurotransmitters. They also integrate the signals from their neighboring cells, fine-tuning the final perception of taste.",
    cuidados:
      "They're protected by going easy on very acidic food and drink, which over time can irritate the mucosa, and by looking after your general oral health.",
  },
  "soporte-gusto": {
    nombre: "Support cell (type I)",
    claves: ["The glia of taste", "They hold the receptors up", "They clean up after every signal"],
    descripcion:
      "They're the glia of taste: they hold up and wrap the receptor cells, they keep the chemical balance around them and they clean up neurotransmitters after every signal, just as astrocytes do with neurons. They're also thought to take part in detecting salty taste. They're called type I receptor cells too, and that same name comes back in another corner of the body with a completely different role: the glomus cells of the carotid, which you have right on the card next door.",
    cuidados:
      "They benefit from good hydration and a healthy oral mucosa, without constant irritants.",
  },
  "glomica-tipo1": {
    nombre: "Glomus cell (type I)",
    claves: ["The oxygen sensors", "In the carotid, not the tongue", "They make you pant at altitude"],
    descripcion:
      "They share a name with the type I cells of taste, but they live somewhere else and they have another trade: they're in the carotid body, a nodule the size of a grain of rice sitting in your neck, where the carotid forks, bathed by the blood going up to your brain. They're the body's oxygen sensors. When blood oxygen drops, they close some channels in their membrane, switch on and release neurotransmitters that excite the nerve running to the brainstem; within seconds, it orders you to breathe faster and deeper and speeds your heart up. It's what makes you pant when you climb to high altitude. The naming, curiously, is crossed over: in the taste bud, the type I is the support cell, while in the carotid body the type I is the star and the support ones are the type II. And here's a detail that reveals how they work: they measure the oxygen dissolved in the plasma, not the oxygen carried by red blood cells. That's why, in carbon monoxide poisoning, these cells notice nothing at all and the person doesn't feel short of breath.",
    cuidados:
      "You can't look after them directly, but you can give them a break: don't smoke, and treat sleep apnea, because repeated drops in oxygen through the night keep them overexcited and that contributes to high blood pressure.",
  },
  "basal-gusto": {
    nombre: "Basal cell (taste stem cell)",
    claves: ["The stem cell of taste", "They renew taste every week", "They bring taste back after a burn"],
    descripcion:
      "They're the stem cells of the taste buds. They divide without rest to replace the taste cells, which are completely renewed every one or two weeks. Thanks to them you get your sense of taste back after burning your tongue with something hot.",
    cuidados:
      "Support their renewal with good nutrition (protein and zinc), and by avoiding tobacco and repeated assaults on your tongue.",
  },

  // ── Bazo ──
  "macrofago-esplenico": {
    nombre: "Splenic macrophage (red pulp)",
    claves: ["They filter blood in the spleen", "They retire old red blood cells", "They recycle the iron"],
    descripcion:
      "They live in the red pulp of the spleen, the great filter of the blood. They recognize old or damaged red blood cells — the ones that can no longer squeeze through the spleen's narrow channels — and engulf them, recycling their iron to make new hemoglobin. They also clear bacteria and debris from the blood running past them.",
    cuidados:
      "They benefit from good general health and proper iron levels; the spleen works better with balanced blood and a balanced immune system.",
  },
  "pulpa-blanca": {
    nombre: "White pulp lymphocytes",
    claves: ["The spleen's immune barracks", "They watch the blood", "They make antibodies"],
    descripcion:
      "In the white pulp of the spleen, B and T lymphocytes organize themselves around the arteries, watching the blood for microorganisms. When they detect a threat traveling in the bloodstream, they switch on the immune response and make antibodies. It's the defensive barracks plugged straight into the blood.",
    cuidados: "Support them with good rest, proper nutrition and a balanced immune system.",
  },

  // ── Vesícula biliar ──
  "colangiocito-vesicula": {
    nombre: "Epithelial cell (cholangiocyte)",
    claves: ["They line the gallbladder", "They concentrate the bile", "They absorb water and salts"],
    descripcion:
      "They line the inside of the gallbladder. Their job is to concentrate the bile arriving from the liver: they absorb water and salts from the bile and return them to the blood, so the bile gets far more concentrated while it's kept between meals. They're covered in microvilli to absorb better.",
    cuidados:
      "They benefit from regular meals that empty the gallbladder and keep the bile from sitting still, good hydration and healthy fats.",
  },
  "muscular-vesicula": {
    nombre: "Smooth muscle cell (gallbladder)",
    claves: ["The gallbladder's muscle", "They respond to CCK", "They squeeze the bile out when you eat"],
    descripcion:
      "They form the muscular layer of the gallbladder wall. When you eat — fat above all — the intestine releases the hormone cholecystokinin (CCK), which orders these cells to contract and squeeze the gallbladder to push the bile into the intestine, where it will help digest fats.",
    cuidados:
      "They stay active with regular meals and healthy fats; very long fasts or very low-fat diets mean the gallbladder barely empties.",
  },
};
