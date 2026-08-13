/**
 * «Las células de tus órganos» (/metodo/fisiologia/todas-tus-celulas) — el
 * contenido de los dieciséis órganos, en INGLÉS.
 *
 * Aquí va SOLO el texto, emparejado por la `key` del órgano. El orden, las
 * fotos, los hotspots y qué células tiene cada órgano viven únicamente en
 * `MetodoFisiologiaTodasCelulas.tsx`: si se duplicaran, bastaría mover un punto
 * del cuerpo en un idioma y no en el otro para que la página se pintara distinta
 * según el idioma.
 *
 * Lo que falte aquí se muestra en español, órgano por órgano y curiosidad por
 * curiosidad (ver `useOrganosCelulas` en `todasCelulasEn.tsx`). Es la misma
 * regla que ya usan los órganos de la sonrisa, los temas de Profundiza y las
 * sefirot de Cábala.
 *
 * ⚠️ Las curiosidades y las fichas se emparejan POR POSICIÓN, porque no tienen
 * clave propia. Por eso:
 *   · la lista inglesa debe tener EXACTAMENTE tantas entradas como la española
 *     (si no cuadran, ese órgano se lee entero en español, para no cruzar
 *     textos);
 *   · para dejar una sin traducir se pone `null` en su sitio, no se borra;
 *   · si se añade una curiosidad en español, hay que añadir su hueco aquí.
 *
 * Al traducir:
 *   · `**negrita**` en vez de `<b>`, y un elemento del array por párrafo (en el
 *     español eran `<br /><br />`).
 *   · «la Vida» con mayúscula intencionada se queda "Life".
 *   · Medidas del cuerpo en unidades de EE. UU. (kilos → pounds); las
 *     cantidades científicas (litros filtrados, m² de alvéolos, porcentajes) se
 *     dejan como están, que es como se dicen en inglés.
 *   · Ojo con los «billones» españoles: son 10¹², o sea *trillion*.
 *   · La voz es la de María: segunda persona, contracciones naturales y frases
 *     cortas. Nada de inglés corporativo.
 */

/** Texto de una curiosidad (o de una ficha) en inglés. `null` = déjala en español. */
export type ConsejoTexto = {
  titular: string;
  claves?: string[];
  /** Un elemento por párrafo. Admite `**negrita**`. */
  texto: string[];
};

/** Una ficha con tarjeta propia: además del titular, el nombre corto del box. */
export type FichaTexto = ConsejoTexto & { nombre: string };

export type OrganoTexto = {
  /** Nombre del órgano (tarjeta, título de la ficha y frases con `{organo}`). */
  label?: string;
  /** Descripción junto a la foto grande. Un elemento por párrafo. */
  descripcion?: string[];
  /** Título de la fila de fichas propias del órgano. */
  fichasTitulo?: string;
  /** MISMO ORDEN Y MISMO NÚMERO que en español. */
  consejos?: (ConsejoTexto | null)[];
  fichas?: (FichaTexto | null)[];
};

export const TODAS_CELULAS_EN: Record<string, OrganoTexto> = {
  cerebro: {
    label: "Brain",
    descripcion: [
      "It's the command center of your whole body. From here you think, feel, remember and control every movement and almost every function, most of the time without even noticing. It weighs a little over two pounds, and it burns close to a fifth of all your energy.",
    ],
    consejos: [
      {
        titular: "Sleeping makes you smarter.",
        claves: ["The brain cleans itself as you sleep", "It consolidates memories", "It reinforces what you learned"],
        texto: [
          "While you sleep, the brain doesn't rest: it takes the chance to clean. The astrocytes make a deeper cleaning of the brain tissue possible, and the microglia patrol the place, clearing out cell debris, watching for possible threats and helping to keep the connections in good shape. On top of that, sleep is when memories are consolidated and the day's learning is reinforced, thanks to neuroplasticity, which happens on a bigger or smaller scale in every single moment of our Life.",
        ],
      },
      {
        titular: "Stress makes your brain see threats where there are none.",
        claves: ["Chronic stress keeps you on alert", "It sees threats where there are none", "It drains energy and focus"],
        texto: [
          "Stress is useful when the danger is real. The problem shows up when it never goes away. If the brain spends weeks or months on alert, it starts reading ordinary situations as if they were a threat. It's like having a fire alarm that goes off at the slightest thing: it eats up energy, it makes concentrating hard and it makes enjoying the present much harder.",
        ],
      },
      {
        titular: "Moving your body trains your brain too.",
        claves: ["Exercise waters the brain", "It builds new connections", "It improves memory and mood"],
        texto: [
          "Every time you exercise, the flow of blood reaching your brain goes up. With it come more oxygen and nutrients, but also molecules that help neurons survive and new connections form. That's why exercise doesn't only strengthen muscles: it also improves memory, attention and mood.",
        ],
      },
      {
        titular: "Every new thing you learn physically changes your brain.",
        claves: ["Learning rewires connections", "Every experience changes it", "It never stops being shaped"],
        texto: [
          "Learning isn't a matter of “storing information”. Every experience strengthens some connections between neurons and weakens others. The brain that starts reading a book isn't the same brain that finishes it. Yours is changing constantly in response to what you do.",
        ],
      },
      {
        titular: "What you repeat becomes who you are.",
        claves: ["Repetition creates habits", "Connections become efficient", "You learn what you practice most"],
        texto: [
          "The brain is trying to save energy. When you repeat an action over and over, the connections that control it get faster and more efficient. That's how habits are born. It makes no difference whether they're good or bad: the brain learns whatever you practice most. Every repetition leaves a small mark on the wiring.",
        ],
      },
    ],
  },

  pulmones: {
    label: "Lungs",
    descripcion: [
      "They're the place where your blood meets the air. With every breath they capture the oxygen your cells need and push out the carbon dioxide they have left over. They work without a break, some 20,000 times a day, almost always without you having to think about it.",
    ],
    consejos: [
      {
        titular: "Your lungs have a cleaning army.",
        claves: ["Cilia that push the mucus", "They trap dust and bacteria", "They clean before the lungs"],
        texto: [
          "The airways are covered in millions of cilia, microscopic little “hairs” that push mucus up toward the throat. Dust, bacteria and other particles get trapped in that mucus before they ever reach the lungs. When you blow your nose or clear that mucus out, you're getting rid of a lot of those intruders too.",
        ],
      },
      {
        titular: "Smoking switches off the cleaning system.",
        claves: ["Smoke paralyzes the cilia", "The immune system turns sluggish", "It damages the alveoli"],
        texto: [
          "Tobacco smoke paralyzes the cilia and forces the lungs to pile up more mucus and more dirt. It also damages the alveoli, where the oxygen exchange happens. That's why smokers usually cough more: the body is trying to cough out what it can no longer clean efficiently.",
        ],
      },
      {
        titular: "Smoking confuses your immune system.",
        claves: ["Thousands of irritants per drag", "Immunity always on alert", "Weaker defense against infections"],
        texto: [
          "Every drag fills the lungs with thousands of irritating substances. The immune system stays permanently on alert, like an alarm that never stops ringing. Over time it responds worse to infections and is less efficient at clearing out the cells that could turn into a cancer.",
        ],
      },
      {
        titular: "Every walk strengthens your lungs.",
        claves: ["It strengthens the breathing muscles", "It improves oxygen exchange", "Every breath works better"],
        texto: [
          "The lungs aren't a muscle, but they can work far more efficiently. Exercise strengthens the diaphragm and the breathing muscles, improves oxygen exchange and makes every breath more effective.",
        ],
      },
      {
        titular: "Every alveolus counts.",
        claves: ["500 million alveoli", "The surface of a tennis court", "Caring for them is caring for your breath"],
        texto: [
          "Your lungs hold around 500 million alveoli. They're so small we can barely see them, but together they add up to a gas-exchange surface about the size of a tennis court. Taking care of them means taking care of every breath you'll take for the rest of your Life.",
        ],
      },
    ],
  },

  corazon: {
    label: "Heart",
    descripcion: [
      "It's a tireless pump, more or less the size of your fist. It beats some 100,000 times a day to push blood through your whole body and carry oxygen and nutrients to every corner. It hasn't rested for a second since before you were born.",
    ],
    consejos: [
      {
        titular: "Your heart learns to train too.",
        claves: ["The heart is a muscle", "Exercise makes it efficient", "It beats less at rest"],
        texto: [
          "The heart is a muscle. Every time you exercise it has to pump more blood to carry oxygen around the body. Over time it becomes more efficient: it can move the same amount of blood with less effort, and it can even beat fewer times per minute when you're at rest.",
        ],
      },
      {
        titular: "High blood pressure wears your arteries down in silence.",
        claves: ["High pressure injures arteries", "Repairing them forms plaque", "It raises the risk of a heart attack"],
        texto: [
          "Blood presses against the walls of your arteries with every beat. If that pressure is too high for years, it keeps producing small cracks or injuries in their inner layer. The body tries to repair them to keep the artery intact. But since the damage happens over and over, cholesterol and inflammatory cells can get trapped in the artery wall during those repairs. In time the body covers them with scar tissue, forming plaques that stick out into the vessel, narrowing the arteries and making it harder for blood to get through. That raises the risk of a heart attack or a stroke.",
        ],
      },
      {
        titular: "Your heart needs sleep too.",
        claves: ["Sleep lowers pulse and pressure", "The heart gets a rest", "Too little sleep overloads it"],
        texto: [
          "While you sleep, your heart rate and your blood pressure both come down, and that lets the heart work with less effort. Sleeping too little keeps the body in a state of constant alert, forcing the heart to work more hours at a higher intensity.",
        ],
      },
      {
        titular: "Every cigarette ages your arteries.",
        claves: ["Tobacco damages the endothelium", "Arteries lose their protection", "Cholesterol and inflammation build up"],
        texto: [
          "Tobacco doesn't only affect the lungs. Its substances damage the endothelium, the thin layer of cells that lines the inside of your arteries. When that barrier loses its protective power, cholesterol and inflammation find it much easier to pile up there.",
        ],
      },
      {
        titular: "Your heart is only asking for one thing: that you move.",
        claves: ["It evolved for movement", "Sitting still hurts it", "Every step is an investment"],
        texto: [
          "Our heart evolved for a body that walked, ran and carried weight every day. Spending many hours sitting down cuts circulation, encourages high blood pressure and forces the heart to adapt to a way of Life it was never designed for. Every walk, every flight of stairs and every minute of physical activity is a direct investment in its health.",
        ],
      },
    ],
  },

  estomago: {
    label: "Stomach",
    descripcion: [
      "It's where digestion really begins. It holds your food, mixes it and bathes it in an acid so powerful it breaks down almost everything you eat, while a shield of mucus protects its own walls so it doesn't digest itself.",
    ],
    consejos: [
      {
        titular: "Stress leaves your stomach with fewer defenses.",
        claves: ["It disturbs the brain-stomach link", "It lowers the mucosa's protection", "It raises the risk of ulcers"],
        texto: [
          "Prolonged stress disturbs the communication between the brain and the stomach. It changes acid production, reduces some of the mucosa's protective mechanisms and makes repairing it harder. And if there's also a Helicobacter pylori infection, or you take anti-inflammatories often, the risk of gastritis (inflammation or swelling of the inner wall of the stomach) and ulcers (an open sore in the lining of the stomach or the first part of the small intestine) goes up.",
        ],
      },
      {
        titular: "Your stomach makes one of the strongest acids in your body.",
        claves: ["Extremely powerful hydrochloric acid", "It breaks down food and microbes", "Mucus protects its walls"],
        texto: [
          "The hydrochloric acid in your stomach is so powerful it can break down many foods and wipe out most of the microorganisms we swallow. Even so, the stomach doesn't digest itself, because it's protected by a thick layer of mucus and bicarbonate that works like a shield.",
        ],
      },
      {
        titular: "Eating too fast makes your stomach work worse.",
        claves: ["Rushing means swallowing air", "Bigger pieces arrive", "More heaviness and reflux"],
        texto: [
          "When you eat in a hurry, you swallow more air, you chew less and your stomach gets bigger pieces of food. That forces it to produce more acid and work for longer, which encourages heaviness, reflux and slower digestion.",
        ],
      },
      {
        titular: "Alcohol breaks your stomach's shield.",
        claves: ["It irritates the gastric mucosa", "It weakens the mucus layer", "Acid then inflames and injures"],
        texto: [
          "Alcohol irritates the gastric mucosa and weakens the layer of mucus that protects it. The more often you drink, the easier it is for acid to reach the cells of the stomach and cause inflammation or small injuries.",
        ],
      },
      {
        titular: "Stress gets digested too.",
        claves: ["The brain slows digestion down", "It speaks through the vagus nerve", "Nerves: nausea and a knot"],
        texto: [
          "When you're stressed, the brain puts survival ahead of digestion. It sends that order down to the stomach through the vagus nerve. The stomach changes the way it moves, changes its acid production and talks to the nervous system constantly. That's why nerves can cause nausea, pain or the feeling of having a “knot in your stomach”.",
        ],
      },
    ],
  },

  higado: {
    label: "Liver",
    descripcion: [
      "It's your body's great chemical factory. It filters the blood, transforms nutrients, makes proteins and bile, stores energy and neutralizes toxic substances. It does hundreds of different jobs at once and, on top of that, it can regenerate itself.",
    ],
    consejos: [
      {
        titular: "Your liver works even when you're resting.",
        claves: ["It doesn't stop, even in sleep", "It regulates glucose and makes bile", "A factory that never closes"],
        texto: [
          "While you sleep, the liver doesn't stop. It keeps regulating blood glucose, making proteins, producing bile and transforming substances so the body can use them or get rid of them. It's a factory that never closes, not even while you sleep.",
        ],
      },
      {
        titular: "Every drink changes your liver's priorities.",
        claves: ["Alcohol is toxic", "It drops everything to clear it", "Its normal work suffers"],
        texto: [
          "Alcohol is a molecule that's toxic to our cells. When it reaches the liver, the liver pushes part of its usual work into the background to clear the alcohol as soon as possible. If you drink often, jobs like fat metabolism, glucose regulation or protein production end up suffering for it.",
        ],
      },
      {
        titular: "Sugar can get “stuck” in your liver.",
        claves: ["The excess turns into fat", "Fatty liver can appear", "Even without drinking alcohol"],
        texto: [
          "When you take in more energy than your body needs, especially as sugars and highly processed foods, the liver turns part of that excess into fat. If it piles up for years, fatty liver disease can appear — a condition that's getting more and more common even in people who don't drink alcohol and, in some cases, in people at a normal weight too.",
        ],
      },
      {
        titular: "Your liver can grow back… but it isn't invincible.",
        claves: ["It regenerates like few organs do", "It recovers lost tissue", "Repeated damage scars it"],
        texto: [
          "It's one of the few organs with a real capacity to regenerate. It can recover part of the tissue it loses after an injury. But if the damage repeats for years, scars take the place of healthy cells and that regeneration stops being enough.",
        ],
      },
      {
        titular: "Cholesterol isn't your enemy.",
        claves: ["Cholesterol is essential", "The liver makes and regulates it", "The risk: years at high levels"],
        texto: [
          "Cholesterol is an essential molecule. All your cells need it to hold their membranes together and to make hormones like testosterone, estrogens or cortisol. The liver produces a large part of the cholesterol you need and regulates how much to make, reuse or clear out. The problem isn't cholesterol itself: it's keeping the lipoproteins that carry it high for years, something a poor diet, sitting still and other factors all encourage.",
        ],
      },
      {
        titular: "Bile is your body's detergent.",
        claves: ["Fat and water don't mix", "Bile breaks the droplets up", "It makes absorbing fat easier"],
        texto: [
          "Fats don't mix with water, the same way oil doesn't mix with the water in your sink. To solve that, the liver makes bile, a liquid that breaks the big droplets of fat into much smaller ones so the intestine can digest and absorb them easily. It's better for the fats you eat to be unsaturated, because that gives your bile a better structure (remember that bile is made with fatty acids from your own diet).",
        ],
      },
      {
        titular: "Fats help empty the gallbladder.",
        claves: ["Fats empty the gallbladder", "They release the stored bile", "Too little fat encourages stones"],
        texto: [
          "Every time you eat food that's rich in fat, the gallbladder contracts and releases the bile it had stored. If you spend a long time on extremely low-fat diets or long fasts, bile sits there for longer and the risk of forming gallstones goes up.",
        ],
      },
      {
        titular: "Your fiber feeds your liver too.",
        claves: ["Fiber traps part of the bile", "It leaves in the stool", "Making more spends cholesterol"],
        texto: [
          "Most bile is recycled over and over. But soluble fiber can trap part of it in the intestine and help clear it out in the stool. To make new bile, the liver has to use cholesterol, and that helps bring blood levels down as time goes by.",
        ],
      },
      {
        titular: "Not all cholesterol does the same job.",
        claves: ["LDL carries it to the tissues", "HDL brings it back to the liver", "Low LDL protects your arteries"],
        texto: [
          "The liver packs cholesterol and triglycerides into particles called lipoproteins. LDL carries them from the liver out to the tissues, while HDL picks up part of the leftover cholesterol and brings it back to the liver to be recycled or cleared. Keeping LDL low and HDL healthy lowers the risk of cholesterol piling up in your arteries.",
        ],
      },
      {
        titular: "Your liver decides what to do with your energy.",
        claves: ["It gets the nutrients from the gut", "It stores glucose as glycogen", "The excess it turns to fat"],
        texto: [
          "After you eat, the liver receives almost every nutrient the intestine absorbs. If you need energy, it hands it out. If there's glucose left over, it stores it as glycogen. And if there's still more left over, it turns it into triglycerides, which travel through the blood to be stored mainly in fat tissue.",
        ],
      },
      {
        titular: "Your liver also makes the proteins in your blood.",
        claves: ["It makes the blood's proteins", "They let it carry and clot", "If it fails, they run short"],
        texto: [
          "Many of the proteins that carry hormones, hold the volume of your blood or let it clot properly are produced in the liver. When it stops working well, it isn't only toxins that pile up: the manufacturing of components that are essential for the whole body fails too.",
        ],
      },
      {
        titular: "Without a liver, many vitamins wouldn't be much use.",
        claves: ["It stores vitamins and minerals", "It releases them when needed", "A strategic warehouse"],
        texto: [
          "The liver stores vitamins like A, D, B₁₂ and K, along with minerals like iron and copper. It works as a strategic warehouse that releases these nutrients when the body needs them, so we don't depend only on what we eat each day.",
        ],
      },
    ],
  },

  pancreas: {
    label: "Pancreas",
    descripcion: [
      "It's a discreet organ with two trades. It regulates the sugar in your blood through hormones like insulin and glucagon and, at the same time, it makes the powerful enzymes that digest much of what you eat.",
    ],
    consejos: [
      {
        titular: "Your pancreas knows how much sugar is in your blood.",
        claves: ["It measures blood glucose", "It goes up: it releases insulin", "It goes down: it releases glucagon"],
        texto: [
          "Every time you eat, the pancreas keeps measuring how much glucose is circulating in your blood. If it climbs too high, it releases insulin so your cells can use it or store it. If it drops, it releases glucagon so the liver puts glucose back out.",
        ],
      },
      {
        titular: "Diabetes can leave you blind.",
        claves: ["Glucose high for too long", "It damages nerves, eyes and kidneys", "That's why it can blind you"],
        texto: [
          "In type 1 diabetes, the immune system destroys the cells that produce insulin. In type 2, the body's cells stop responding properly to that hormone. In both cases glucose stays in the blood for too long, making the arteries stick to one another, making it harder for blood and nutrients to reach the nerves, the eyes and the kidneys, wearing them down and making them lose their function over time.",
        ],
      },
      {
        titular: "Your pancreas also makes your digestive enzymes.",
        claves: ["It releases enzymes at every meal", "They digest fats and proteins", "Without them, nothing is absorbed"],
        texto: [
          "Every meal makes the pancreas release enzymes that can digest proteins, fats and carbohydrates. Without them, a large part of your nutrients would pass straight through the intestine without ever being absorbed.",
        ],
      },
      {
        titular: "Too much sugar forces your pancreas to work harder.",
        claves: ["More sugar, more insulin", "A constant effort for years", "The beta cells wear out"],
        texto: [
          "When you often take in large amounts of sugar and calories, the body needs to produce more and more insulin to keep blood glucose steady. Over years, that constant effort can make the beta cells lose part of their capacity to work properly.",
        ],
      },
      {
        titular: "Alcohol can inflame the pancreas too.",
        claves: ["Its enzymes are very powerful", "Alcohol activates them early", "It can cause pancreatitis"],
        texto: [
          "The pancreas makes very powerful enzymes that normally stay inactive until they reach the intestine. Alcohol raises the risk of those enzymes switching on too early and starting to damage the pancreas itself, causing pancreatitis.",
        ],
      },
      {
        titular: "The pancreas works in silence.",
        claves: ["It usually goes unnoticed", "It regulates glucose and digestion", "It gets sick without warning"],
        texto: [
          "Unlike the stomach or the intestine, the pancreas usually goes unnoticed. And yet it regulates blood glucose and produces most of your digestive enzymes. When it gets sick, it can affect practically the whole body before it gives any clear symptom.",
        ],
      },
    ],
  },

  rinones: {
    label: "Kidneys",
    descripcion: [
      "They're your body's filters. Every day they clean all of your blood many times over, clear out what's left over as urine and decide, with real precision, how much water and salt to keep. They also regulate your blood pressure and help make blood.",
    ],
    consejos: [
      {
        titular: "Your kidneys clean all of your blood… over and over.",
        claves: ["They filter 180 liters a day", "Almost all of it is recovered", "They only clear what's left over"],
        texto: [
          "Every day, your kidneys filter around 180 liters of fluid. It sounds absurd, but almost all of it is recovered. They only clear out what the body doesn't need: waste substances, extra water or salts.",
        ],
      },
      {
        titular: "Drinking more water doesn't always clean your kidneys better.",
        claves: ["They save or clear water", "Drinking extra doesn't clean better", "The excess adds nothing"],
        texto: [
          "Your kidneys are experts at saving water when it's needed and clearing it out when there's too much. Drinking enough matters, but drinking to excess doesn't make them “cleaner”. In fact, forcing them to clear out huge amounts of water all the time doesn't bring any benefit either.",
        ],
      },
      {
        titular: "Your kidneys also control your blood pressure.",
        claves: ["They release renin if pressure drops", "They regulate blood pressure", "Too much of it strains the heart"],
        texto: [
          "When they sense that little blood is arriving, or that the pressure is low, they release a hormone called renin. From it, a system switches on that helps raise blood pressure so every organ keeps getting enough blood. If that mechanism stays switched on for a long time, the heart has to pump harder and ends up thickening its walls to adapt, which raises the risk of cardiovascular disease.",
        ],
      },
      {
        titular: "A lot of salt forces your kidneys to work harder.",
        claves: ["Sodium holds water in", "It raises the volume of blood", "It encourages high blood pressure"],
        texto: [
          "Sodium is essential for Life, but too much of it makes the body hold on to more water. That raises the volume of your blood and forces your kidneys and your heart to work for years under a heavier load, which encourages high blood pressure.",
        ],
      },
      {
        titular: "Your kidneys make hormones too.",
        claves: ["They produce erythropoietin", "It stimulates red blood cells", "They activate vitamin D"],
        texto: [
          "They don't only produce urine. They make erythropoietin, a hormone that stimulates the production of red blood cells in the bone marrow, and they activate vitamin D, which is essential for absorbing calcium and keeping your bones strong.",
        ],
      },
      {
        titular: "Some medicines can damage them too.",
        claves: ["They need a constant blood flow", "Anti-inflammatories reduce it", "Risky if you overuse them"],
        texto: [
          "The kidneys need a constant flow of blood to filter properly. Anti-inflammatories like ibuprofen or naproxen block molecules called prostaglandins, which help keep the kidney's blood vessels open. If you take them often, especially if you're dehydrated or you have kidney disease, less blood can reach the kidney and the risk of injury goes up.",
        ],
      },
      {
        titular: "Too much sugar wears your kidneys down too.",
        claves: ["Glucose goes through the filters", "Years of high levels overload them", "Diabetes damages the kidneys"],
        texto: [
          "Every molecule of glucose circulating in your blood passes through the kidney's filters over and over. When glucose stays high for years, those filters work harder than normal trying to recover it and keep it from being lost in the urine. That overload ends up damaging them little by little, letting proteins start to leak out and reducing their capacity to filter blood. That's why diabetes is one of the main causes of kidney failure.",
        ],
      },
      {
        titular: "Your kidneys decide what stays… and what goes.",
        claves: ["They filter almost everything first", "Then they take back what's useful", "Recycling at its most efficient"],
        texto: [
          "The kidneys don't make urine by simply filtering blood. First they filter almost everything, and then they take back the water, the glucose, the amino acids and many of the minerals the body still needs. Only at the end do they clear out what's really left over. They're one of the most efficient recycling systems in the body.",
        ],
      },
      {
        titular: "Urine is a window into your health.",
        claves: ["Color and amount tell you things", "Dark: drink more water", "Blood or foam: get it checked"],
        texto: [
          "The color, the amount and how often you pee say a lot about how your body is working. Very dark urine usually means you need more water. Blood, persistent foam or lasting changes in how much you pee can be signs that something isn't working well in your kidneys, and it's worth talking to a health professional about it.",
        ],
      },
    ],
  },

  intestino: {
    label: "Intestine",
    descripcion: [
      "It's where your body decides what gets in and what doesn't. It absorbs nutrients through an enormous surface and houses trillions of bacteria that help you digest, protect you and even talk to your brain.",
    ],
    consejos: [
      {
        titular: "Your small intestine decides what gets into your body.",
        claves: ["It absorbs the nutrients", "It blocks what's dangerous", "The largest surface in your body"],
        texto: [
          "Everything you eat reaches the small intestine, but not everything makes it through. Its cells absorb the nutrients you need and block many potentially dangerous substances. It's the largest exchange surface in the whole body.",
        ],
      },
      {
        titular: "You aren't what you eat… you're what you absorb.",
        claves: ["What matters is what you absorb", "Unabsorbed is no use at all", "It can affect your whole body"],
        texto: [
          "You can eat the best diet in the world, but if your intestine doesn't absorb the nutrients properly, your cells won't be able to use them. That's why diseases like celiac disease or Crohn's disease can affect the whole body.",
        ],
      },
      {
        titular: "Fat needs help getting in.",
        claves: ["Fat doesn't mix with water", "Bile splits it into droplets", "Enzymes finish the job"],
        texto: [
          "Unlike sugar or amino acids, fats can't be absorbed easily, because they don't mix with water. That's why bile splits them into small droplets and pancreatic enzymes finish digesting them before the intestine can take them in.",
        ],
      },
      {
        titular: "Your intestine renews itself constantly.",
        claves: ["Its cells live only a few days", "They're renewed nonstop", "A barrier that stays young"],
        texto: [
          "The cells lining the intestine live only a few days. Then they're replaced by new ones, to keep a healthy barrier that can absorb nutrients without letting dangerous microorganisms through. That's why people say fasting is so healthy, but it depends on your way of Life. If you're someone very sedentary, then yes, you'll benefit from it.",
        ],
      },
      {
        titular: "Your immune system checks every bite.",
        claves: ["Every meal brings the unknown", "It decides what's a threat", "Much of your immunity lives here"],
        texto: [
          "Every meal introduces thousands of new molecules into your body. The intestine has to decide which ones are harmless and which ones are a threat. A large part of the immune system works in the gut to keep that balance.",
        ],
      },
      {
        titular: "Fiber feeds the ones who take care of you.",
        claves: ["Bacteria ferment the fiber", "They nourish the gut's cells", "They lower inflammation"],
        texto: [
          "We can't digest fiber, but the bacteria in the colon can. Fermenting it, they produce molecules that feed the cells of the intestine, lower inflammation and help keep a healthy microbiota.",
        ],
      },
      {
        titular: "Not all bacteria are bad.",
        claves: ["Trillions of good bacteria", "They make vitamins", "They hold the dangerous ones back"],
        texto: [
          "Trillions of microorganisms live in your colon. Many of them make vitamins, keep dangerous bacteria from growing and work alongside your immune system. Without them, staying healthy would be much harder.",
        ],
      },
      {
        titular: "The colon recycles water too.",
        claves: ["It takes water back from the gut", "Too much: constipation", "Too little: diarrhea"],
        texto: [
          "When the intestinal contents reach the colon they still hold a lot of water. Its main job is to take that water back before forming the stool. If it absorbs too much, you get constipation; if it absorbs too little, diarrhea.",
        ],
      },
      {
        titular: "Your microbiota changes with every meal.",
        claves: ["They eat what you eat", "Fiber makes it more diverse", "Little fiber makes it poorer"],
        texto: [
          "Your gut bacteria feed on what you eat. A diet rich in fruit, vegetables, legumes and whole grains encourages a more diverse microbiota. A diet low in fiber, on the other hand, makes that ecosystem lose richness and stability.",
        ],
      },
      {
        titular: "Your second brain lives in your gut.",
        claves: ["Hundreds of millions of its own neurons", "It talks to the brain", "Emotions and gut are connected"],
        texto: [
          "The intestine holds hundreds of millions of neurons that control much of digestion without having to check with the brain all the time. On top of that, both organs are talking constantly through the vagus nerve, hormones and molecules produced by the microbiota. That's why emotions can affect your gut… and your gut also shapes how you feel.",
        ],
      },
    ],
  },

  tiroides: {
    label: "Thyroid",
    descripcion: [
      "It's a small butterfly-shaped gland in your neck. It sets the pace everything in your body runs at: the energy you burn, your temperature, your pulse… like an accelerator that works in silence.",
    ],
    consejos: [
      {
        titular: "Your thyroid decides how fast your body runs.",
        claves: ["The body's accelerator", "It regulates energy and temperature", "It sets the heart's pace"],
        texto: [
          "Thyroid hormones work like the body's “accelerator”. They regulate how much energy your cells burn, your body temperature, the rhythm of your heart and even the speed at which many organs work.",
        ],
      },
      {
        titular: "Without iodine, your metabolism runs slower.",
        claves: ["Iodine is essential", "The body can't make it", "Iodized salt and fish"],
        texto: [
          "Iodine is an essential piece for producing thyroid hormones. Since the body can't make it, it has to come from your food. That's why using iodized salt or eating fish and shellfish regularly helps keep a healthy thyroid.",
        ],
      },
      {
        titular: "The thyroid talks to the brain constantly.",
        claves: ["The brain controls it with TSH", "It asks for more or less hormone", "A very precise balance"],
        texto: [
          "The brain controls the thyroid through a hormone called TSH. If it senses there aren't enough thyroid hormones, it orders more; if there are too many, it turns the signal down. It's a very precise control system that keeps your metabolism in balance.",
        ],
      },
      {
        titular: "Too fast… or too slow.",
        claves: ["Too much hormone: everything speeds up", "Too little: fatigue and cold", "Two opposite extremes"],
        texto: [
          "When the thyroid produces too much hormone, the whole body speeds up: your pulse climbs, you feel jumpy and you lose weight easily. When it produces too little, the opposite happens: fatigue, feeling cold, constipation and trouble concentrating.",
        ],
      },
      {
        titular: "It isn't always the thyroid's fault.",
        claves: ["Many symptoms, a thousand causes", "Sleep, stress or anemia", "Confirm it before blaming it"],
        texto: [
          "Fatigue, hair loss or weight gain can have many different causes. Those symptoms do show up in some thyroid conditions, but they can also come from lack of sleep, stress, anemia, a poor diet or plenty of other problems. That's why it matters to confirm the diagnosis before deciding the thyroid is the one to blame.",
        ],
      },
    ],
  },

  piel: {
    label: "Skin",
    descripcion: [
      "It's your largest organ and your first border with the world. It protects you from knocks, microbes and the sun, regulates your temperature and lets you feel touch. It renews itself nonstop and repairs itself when it gets damaged.",
    ],
    consejos: [
      {
        titular: "Your skin is the largest organ in your body.",
        claves: ["Almost 20 square feet", "Your first barrier", "It stops microbes and knocks"],
        texto: [
          "Your skin can cover close to 20 square feet and makes up around 15% of your body weight. It's the first barrier protecting you against knocks, microorganisms, chemicals and water loss.",
        ],
      },
      {
        titular: "The sun ages your skin… even when you don't burn.",
        claves: ["UV damages DNA without burning", "The damage adds up over the years", "It creates free radicals"],
        texto: [
          "Ultraviolet radiation goes through the skin and damages the DNA of its cells. Even if no burn shows up, that damage keeps adding up over the years and encourages wrinkles, dark spots and skin cancer.",
          "On top of that, some photons of ultraviolet radiation carry so much energy that they alter the molecules in your cells and encourage the formation of free radicals (ROS). These molecules are very unstable and “steal” electrons from others to stabilize themselves, setting off a chain reaction that speeds up aging and cell damage.",
        ],
      },
      {
        titular: "Getting a tan is an alarm signal too.",
        claves: ["A tan isn't health", "It's a defense against sun damage", "Melanin isn't enough"],
        texto: [
          "A tan doesn't mean your skin is healthier. It's the melanocytes' response to detecting damage from ultraviolet radiation. They make melanin to try to absorb part of that radiation and protect the cells' DNA, but that protection is never complete.",
        ],
      },
      {
        titular: "Sunlight isn't enough to make vitamin D.",
        claves: ["The sun only starts it", "Liver and kidney activate it", "Hard to get from the sun alone"],
        texto: [
          "Ultraviolet radiation starts the production of vitamin D in your skin, but that molecule is still inactive. It then has to travel to the liver, where it goes through a first transformation, and finally to the kidney, where it's fully activated. Only then can it help absorb calcium and keep your bones and muscles strong. That's why liver conditions, like advanced fatty liver disease, or kidney conditions can also lower your vitamin D levels.",
        ],
      },
      {
        titular: "Your skin has its own immune system too.",
        claves: ["Immune cells inside the skin", "They spot microbes on arrival", "The first line of defense"],
        texto: [
          "Among the cells of your skin live immune cells that detect bacteria, viruses and other microorganisms before they get into the body. Most infections never make it any further, thanks to this first line of defense.",
        ],
      },
      {
        titular: "Your wounds repair themselves better than you imagine.",
        claves: ["Platelets close it in minutes", "Fibrin weaves the net", "Collagen rebuilds"],
        texto: [
          "When you cut yourself, platelets close the wound within minutes, building a barrier using a bunch of unlucky red blood cells that happened to be passing by. Then immune cells arrive to prevent infection and, finally, fibroblasts make collagen to rebuild the tissue. A simple wound sets millions of cells to work at the same time with a single goal: protecting you.",
          "And how is that plug built? In five linked steps:",
          "**1. Activation.** The moment the wound happens, platelets switch on: they change shape, from a smooth disc to a spiky sphere, and they turn very sticky.",
          "**2. The chemical call.** Those platelets release substances that switch on the “coagulation cascade” in the blood: a reaction where each step sets off the next one.",
          "**3. Making the glue.** The cascade turns a liquid, soluble protein traveling in the blood, **fibrinogen**, into solid, insoluble threads of **fibrin**.",
          "**4. The capture net.** Those fibrin threads cross over one another above the platelets and form a tightly bound three-dimensional mesh.",
          "**5. The trapping.** Red blood cells, which were simply floating past in the bloodstream, crash into that mesh and get caught in the net. They're the ones giving the plug its volume and mechanical strength: the clot.",
        ],
      },
      {
        titular: "Your skin has an ecosystem too.",
        claves: ["Millions of microbes live on it", "Most of them are helpful", "They hold the dangerous ones back"],
        texto: [
          "Millions of bacteria, fungi and other microorganisms live on it, forming the skin microbiota. Most of them are helpful: they take up space, make it harder for dangerous microbes to grow and work with your immune system to keep your skin healthy.",
        ],
      },
    ],
  },

  musculo: {
    label: "Muscle",
    descripcion: [
      "It's what lets you move, stand up and even breathe. It contracts and relaxes thousands of times a day, burns a lot of energy and gets stronger the more you use it. If you abandon it, your body starts taking it apart.",
    ],
    fichasTitulo: "The pieces of the contraction",
    fichas: [
      {
        nombre: "Actin · the rail",
        titular: "Actin is the rail that gets pulled.",
        claves: ["The thin filament", "It comes with the latch on", "Calcium opens it"],
        texto: [
          "Actin is the **thin** filament. It forms by linking thousands of globular molecules into a double helix, like two strings of pearls twisted around each other, and it's anchored at both ends to the walls of each unit of the muscle.",
          "The interesting part is that it comes with the **latch on**. Wound along the actin there's a long protein, tropomyosin, covering exactly the points where myosin would have to grab on. While it's there, no contraction is possible, no matter how much energy is left over.",
          "The key is **calcium**. When the nerve's order arrives, the fiber releases calcium from its internal stores; the calcium binds to another protein attached to tropomyosin and shifts it out of the way. The rail is clear and myosin can hook on.",
          "Actin isn't exclusive to muscle: it's in all your cells, giving them shape and letting them move and divide. In muscle it's simply arranged with millimetric precision.",
        ],
      },
      {
        nombre: "Myosin · the motor",
        titular: "Myosin is the motor that rows.",
        claves: ["The thick filament", "Heads that grab and pull", "Every pull spends ATP"],
        texto: [
          "Myosin is the **thick** filament, and it's a real machine: every molecule has a long tail and two moving **heads** that stick out toward the actin, like oars along the sides of a boat.",
          "The cycle is always the same, and it repeats a huge number of times per second: the head grabs the actin, **pulls** it and shifts it a little, lets go, repositions and starts again. It's called the cross-bridge cycle, and it's literally what's happening inside you every time you move a finger.",
          "Every pull **spends one molecule of ATP**. That's why muscle is by far the biggest consumer of energy when it works, and why exercise warms you up: a good part of that spending leaves as heat.",
          "And here's a detail that surprises people: **letting go costs energy too**. Without ATP, the heads stay hooked onto the actin and the muscle locks up. That's what happens in rigor mortis, when there's no ATP left to spend.",
        ],
      },
      {
        nombre: "The sarcomere",
        titular: "The sarcomere: the unit that shortens.",
        claves: ["The piece that repeats", "Nothing shrinks: they slide", "Millions of them at once"],
        texto: [
          "Actin and myosin aren't loose: they're arranged in a piece that repeats millions of times along every fiber, the **sarcomere**. It's the smallest unit of contraction and what gives muscle its striped look under the microscope.",
          "Here's the idea that's hardest to believe: when you contract, **no filament shrinks**. Actin and myosin measure exactly the same before and after. All that happens is that they **slide** over one another, so the ends of the sarcomere come closer together and the piece ends up shorter. It's called the sliding filament theory.",
          "Each sarcomere shortens by a tiny amount. But when millions of them, lined up along thousands of fibers, do it at the same time and in a coordinated way, what you feel is a muscle pulling.",
          "A muscle, then, isn't a block of meat: it's an extremely orderly formation of tiny motors rowing in the same direction.",
        ],
      },
      {
        nombre: "Titin · the spring",
        titular: "Titin is the spring that brings you back into place.",
        claves: ["The largest protein in your body", "It returns the fiber to its shape", "It works as a ruler and a sensor"],
        texto: [
          "It's the **largest protein in the human body** by a long way, and its full name has so many letters it takes hours to pronounce. A single molecule of titin runs across half a sarcomere from end to end, joining the edge to the myosin filament.",
          "It works like a **spring**. When you stretch the muscle, titin unfolds and stores tension; when you let go, it gathers up and returns the fiber to its length. That elasticity is part of why a movement that starts with a stretch comes out more powerful, and why muscle doesn't fall apart when it's stretched.",
          "It also works as a **ruler and a sensor**: it keeps myosin centered where it belongs and tells the cell how much tension it's holding, one of the signals that set the building of new muscle in motion when you train.",
        ],
      },
      {
        nombre: "Myostatin · the brake",
        titular: "Myostatin is the muscle's brake.",
        claves: ["It limits how much muscle you grow", "The muscle makes it itself", "Training lowers its signal"],
        texto: [
          "If the body could make muscle without limit, it would… and it would go bankrupt, because keeping muscle is horribly expensive in energy. Myostatin is the brake that prevents it: a protein the muscle itself produces and releases to say “that's enough, don't grow any more”.",
          "It brakes in two ways: it switches off the routes that order new protein to be made, and it keeps the **satellite cells** in check, the ones that fuse into the fiber to repair it and make it bigger. With myostatin high, you train and the muscle barely responds.",
          "Strength training **lowers its signal** for a few hours, and that's part of why a muscle that's worked grows. With age, long periods of rest and chronic inflammation, on the other hand, the signal goes up and holding on to mass gets harder.",
          "There are animals with a mutation that leaves myostatin out of action — Belgian Blue cattle, or some mice nicknamed “Schwarzenegger mice” — and they develop an enormous musculature. A few cases have been described in people too.",
        ],
      },
    ],
    consejos: [
      {
        titular: "Your muscles: either you use them… or your body breaks them down.",
        claves: ["A huge consumer of energy", "They take up glucose when you move", "Sitting still takes them apart"],
        texto: [
          "Muscles are one of the biggest consumers of energy in the body. When you exercise, they can take glucose from the blood with far less dependence on insulin, and they also use fats and ketone bodies as fuel. But keeping muscle costs a lot of energy. If you spend weeks without using it, the body starts taking it apart to reuse its proteins in other tissues. Sitting still literally makes your body “eat” your muscle.",
        ],
      },
      {
        titular: "If you don't use them, your body stops maintaining them.",
        claves: ["Keeping them costs energy", "Unused, they shrink", "Strength is lost fast"],
        texto: [
          "Muscle is very expensive to maintain. If you spend weeks without using it, the body reads that as no longer needing it and starts reducing its size to save energy. That's why we lose strength so fast after an injury, a hospital stay or long stretches of inactivity.",
        ],
      },
      {
        titular: "Strength protects your bones too.",
        claves: ["Muscle pulls on bone", "It prompts bone to reinforce itself", "It prevents osteoporosis"],
        texto: [
          "Every time a muscle contracts, it pulls on the bone it's attached to. That small effort prompts your bones to make more bone tissue and become more resistant. Strength training doesn't only build muscle: it also helps prevent osteoporosis.",
        ],
      },
      {
        titular: "Movement feeds your joints.",
        claves: ["Cartilage has no vessels", "Movement nourishes it", "Stillness dries it out"],
        texto: [
          "Cartilage has no blood vessels. It gets its oxygen and nutrients from the synovial fluid, which moves in and out of it every time a joint moves, as if it were a sponge. Staying still for a long time reduces that exchange, while moderate movement helps keep cartilage healthy and lubricated.",
        ],
      },
      {
        titular: "Your muscles help your heart too.",
        claves: ["They push blood back to the heart", "The “second heart”", "Sitting swells your legs"],
        texto: [
          "When you walk or move your legs, your muscles squeeze the veins and push blood back toward the heart. That's why they're known as the “second heart”. Spending many hours sitting down makes that return harder and encourages swollen legs.",
        ],
      },
      {
        titular: "Sleep builds muscle too.",
        claves: ["Muscle repairs itself in sleep", "Repair hormones rise", "Satellite cells fix the fibers"],
        texto: [
          "Most muscle repair happens while you sleep. During sleep, the release of hormones like growth hormone and testosterone goes up, while cortisol comes down. At the same time, satellite cells repair the small injuries exercise produced and help the muscle become stronger. Training without resting limits those adaptations.",
        ],
      },
      {
        titular: "Your muscles talk to the rest of your body too.",
        claves: ["They release myokines when you move", "They travel through the blood", "They benefit your whole body"],
        texto: [
          "When you exercise, your muscles release molecules called myokines. These travel through your blood and help improve how your brain, your immune system, your liver and your fat tissue work. That's why exercise lowers inflammation, improves memory, helps control glucose and protects far more than just your muscles.",
        ],
      },
    ],
  },

  huesos: {
    label: "Bones",
    descripcion: [
      "They're much more than a frame. They're alive: they break down and rebuild themselves every day, they hold your body up, protect your organs, keep your calcium and, inside them, they make your blood.",
    ],
    consejos: [
      {
        titular: "Your bones are alive.",
        claves: ["They renew themselves every day", "Continuous remodeling", "They repair before they break"],
        texto: [
          "Bones aren't rigid, inert structures. Every day they break down small damaged areas and build new bone. Thanks to that continuous remodeling they can adapt to the loads they take and repair small faults before they turn into fractures.",
        ],
      },
      {
        titular: "Exercise tells your bones to get stronger.",
        claves: ["Load prompts them", "They make more bone", "It prevents osteoporosis"],
        texto: [
          "Every jump, every walk and every weight you lift puts a small tension on the bone. In response, your bone cells get the message to make more bone tissue. That's why strength training and moderate impact help prevent osteoporosis.",
        ],
      },
      {
        titular: "Without vitamin D, calcium isn't much use.",
        claves: ["No vitamin D, no calcium absorbed", "Better from food or a supplement", "Hard to get from the sun"],
        texto: [
          "You can eat plenty of calcium, but if you don't have enough vitamin D you'll absorb far less of it in your intestine. It's recommended to get vitamin D from food or from supplements; getting it from the sun is genuinely difficult, because it takes three separate activations.",
        ],
      },
      {
        titular: "Your bones are your calcium savings.",
        claves: ["Bone keeps the calcium", "If it's short, it lends it to the blood", "In the long run it weakens"],
        texto: [
          "Calcium is essential for your muscles, your nerves and your heart to work. If your blood needs more calcium and doesn't get it from food, the body takes it out of your bones. Over years, that process can weaken them if it isn't properly replaced.",
        ],
      },
      {
        titular: "Osteoporosis starts long before the first fracture.",
        claves: ["They weaken with no symptoms", "The fracture warns you late", "Prevent it from a young age"],
        texto: [
          "Bones can lose density for years without producing a single symptom. By the time the first fracture appears, the disease has usually been developing for a long time. Some studies claim it begins at menopause. Eating well and doing strength training from a young age is the best way to prevent it.",
        ],
      },
      {
        titular: "It's never too late to strengthen your bones.",
        claves: ["Peak mass around 30", "They respond your whole Life", "Moving today is investing"],
        texto: [
          "Although we reach our peak bone mass around the age of 30, bones keep responding to exercise for our whole Life. Moving today is still an investment in the skeleton you'll have in a few hours, or tomorrow (literally).",
        ],
      },
    ],
  },

  sangre: {
    label: "Blood",
    descripcion: [
      "It's a liquid organ connecting your whole body. It carries oxygen, nutrients and hormones, takes waste away and brings your army of defenses wherever it's needed. It's the network that makes everything work as a single system.",
    ],
    consejos: [
      {
        titular: "Your blood is a liquid organ.",
        claves: ["It carries oxygen and nutrients", "It brings defenses and hormones", "It connects your whole body"],
        texto: [
          "Blood doesn't only carry oxygen. It carries nutrients, hormones and immune cells, and it picks up the waste your organs produce. It's the network connecting every part of your body and letting them work as a single system.",
        ],
      },
      {
        titular: "Your red blood cells live only four months.",
        claves: ["They carry oxygen with hemoglobin", "They can't repair themselves", "Renewed every ~120 days"],
        texto: [
          "Erythrocytes carry oxygen thanks to a protein called hemoglobin. Since they have no nucleus, they can't repair themselves as they age. After about 120 days they're retired by the spleen and the liver and replaced by new ones made in the bone marrow.",
        ],
      },
      {
        titular: "Your bones hide a blood factory.",
        claves: ["Bone marrow makes blood", "Red cells, white cells and platelets", "It works your whole Life"],
        texto: [
          "In childhood, almost every bone holds red bone marrow, the tissue that makes blood cells. With age, part of that marrow turns into yellow marrow, rich in fat. Even so, the red marrow that stays in the pelvis, the vertebrae, the ribs or the sternum keeps producing red blood cells, white blood cells and platelets for your whole Life.",
        ],
      },
      {
        titular: "Your platelets aren't cells: they're pieces of another cell.",
        claves: ["They're born from a megakaryocyte", "Blood flow tears their tips off", "Up to 3,000 from a single cell"],
        texto: [
          "In the bone marrow lives an enormous cell, the **megakaryocyte**, which reached that size by copying its DNA over and over without ever dividing. To make platelets it doesn't divide the way any other cell would: it extends very long, branching projections called **proplatelets**, something like tentacles, and slips their tips inside the blood vessels of the marrow itself.",
          "And then it lets the current do the work. The flow of blood keeps breaking and shedding the tips of those tentacles, and every fragment that comes loose into the circulation is a platelet. A single megakaryocyte can produce between 1,000 and 3,000 of them before it runs out of material and disappears.",
          "That's why platelets have no nucleus: they aren't whole cells, but pieces of a cell that's no longer there. And that's why, just like red blood cells, they can't repair themselves: they live 7 to 10 days and have to be replaced continuously.",
        ],
      },
      {
        titular: "Iron doesn't give you energy… it lets you make it.",
        claves: ["Iron builds the hemoglobin", "It carries the oxygen", "Without it comes fatigue"],
        texto: [
          "Plenty of people believe iron “gives you energy”. What it actually does, above all, is form part of hemoglobin, the molecule that carries oxygen. Without enough iron, less oxygen reaches your cells and they produce less energy, and that's where the tiredness comes from.",
        ],
      },
      {
        titular: "Your immune system never sleeps.",
        claves: ["White blood cells patrol", "They look for viruses and bacteria", "They defend you unnoticed"],
        texto: [
          "Millions of white blood cells patrol your blood and tissues constantly, looking for viruses, bacteria or damaged cells. Most of the time they clear those threats out without you ever realizing they were there.",
        ],
      },
      {
        titular: "Inflammation can be a problem too.",
        claves: ["It's there to repair and defend", "Chronic, it damages the organs", "It encourages serious disease"],
        texto: [
          "Inflammation is an essential tool for repairing tissue and fighting infection. But if it stays switched on for months or years, it starts damaging the organs themselves and encourages diseases like diabetes, atherosclerosis or some kinds of cancer.",
        ],
      },
      {
        titular: "Your blood delivers the messages too.",
        claves: ["Hormones travel in the blood", "Only the receiver reads them", "They coordinate distant organs"],
        texto: [
          "Hormones travel through your blood like letters with a very specific address. When they reach an organ, only the cells with the right “mailbox”, called a receptor, can read the message and respond. That's how organs very far from each other coordinate.",
        ],
      },
      {
        titular: "Blood isn't always red.",
        claves: ["Oxygen changes its shade", "Arterial bright, venous dark", "It's never blue"],
        texto: [
          "Red blood cells contain hemoglobin, an iron-rich protein that changes color slightly depending on whether it's carrying oxygen or not. That's why arterial blood is a brighter red and venous blood a darker one. Even though veins look blue under the skin, the blood running through them is still red.",
        ],
      },
      {
        titular: "Donating blood switches the factory on.",
        claves: ["Donating alerts the kidneys", "The marrow makes more", "You recover in weeks"],
        texto: [
          "After a donation, the body senses it has lost part of its blood and the kidneys produce more erythropoietin, a hormone that stimulates the bone marrow to make new red blood cells. Within a few weeks, your blood volume and the cells you lost are back. A single donation can help save several Lives.",
        ],
      },
    ],
  },

  conectivo: {
    label: "Connective tissue (collagen)",
    descripcion: [
      "It's your body's glue and its structure. Collagen gives shape and strength to your skin, your tendons, your bones and your vessels, while its cells make and repair that scaffolding for your whole Life.",
    ],
    fichasTitulo: "The seven types of collagen",
    fichas: [
      {
        nombre: "Type I · the cable",
        titular: "Type I collagen: the cable that takes the pull.",
        claves: ["Nine out of ten fibers", "Skin, bone and tendon", "The one you lose with age"],
        texto: [
          "It's the majority by a long way: around **90%** of all the collagen you have. Its molecules gather into thick fibers lined up in parallel, the ideal shape for taking traction without stretching. It's in the dermis of your skin, in your tendons, in your ligaments, in the cornea and in bone, where it shares the work with mineral: the collagen brings the flexibility and the calcium the hardness.",
          "That partnership makes a lot of sense when it fails. In **osteogenesis imperfecta**, the “brittle bone” disease, the gene for type I collagen comes out faulty, and without its mesh the mineral behaves like chalk: bones break at nothing.",
          "It's also the one you keep losing over the years, and the one the sun destroys faster than you can replace it. When someone talks about “losing collagen” in their skin, this is the one they mean.",
        ],
      },
      {
        nombre: "Type II · the cushion",
        titular: "Type II collagen: the cushion in your joints.",
        claves: ["The cartilage one", "It holds water and absorbs shock", "It wears out in osteoarthritis"],
        texto: [
          "It's the collagen of **cartilage**. Here the fibers are thinner and cross over one another, forming a mesh that's disorderly on purpose and traps molecules capable of holding enormous amounts of water. And that water is what absorbs the shock: when you put your foot down, the cartilage compresses and releases water; when you lift it, it takes the water back in. It's a hydraulic cushion.",
          "You have it in the cartilage of your joints, in the discs between your vertebrae and in the vitreous humor of your eye.",
          "Its weak point is that cartilage has no blood vessels, so it repairs terribly. That's why the wear of this type II, which is what we call **osteoarthritis**, is so hard to reverse, and why gentle, frequent movement is the best thing you can do for it: it's the only thing that pumps fluid in and out and keeps it fed.",
        ],
      },
      {
        nombre: "Type III · the scaffold",
        titular: "Type III collagen: the temporary scaffold of wounds.",
        claves: ["The first one in a wound", "Thin, elastic fibers", "Later swapped for type I"],
        texto: [
          "It's thinner and more elastic than type I, and it shows up where tissue has to give and come back: the wall of your blood vessels, the intestine, the uterus, the lung.",
          "But its starring role is repair. When you get a wound, fibroblasts make type III first, quickly and with no finishing, to close the gap as soon as possible. Over the following weeks and months that temporary scaffold is gradually replaced by type I, stronger and better organized.",
          "That handover explains two things you can see with the naked eye: why a recent scar is pink and fragile and an old one is white and tough, and why none of them ever becomes normal skin. In repair, the fibers end up lined up in the direction of the tension, not crisscrossed as they are in healthy skin. Stronger in one direction, poorer in every other.",
        ],
      },
      {
        nombre: "Type IV · the sheet",
        titular: "Type IV collagen: this one doesn't make ropes, it makes sheets.",
        claves: ["It doesn't form fibers, it forms nets", "It builds the basement membrane", "It's the kidney's filter"],
        texto: [
          "It's the odd one in the family: it doesn't assemble into fibers, but into a **flat net**, like gauze. That's what builds the **basement membrane**, the extremely thin sheet every epithelium in your body rests on: the one separating the epidermis from the dermis, the one wrapping each muscle fiber, the one holding up the lining of your vessels.",
          "And being a mesh, it works as a strainer. In the kidney, type IV collagen is part of the filter deciding what stays in the blood and what passes into the urine. When that mesh gets damaged, proteins start leaking into the urine, which is one of the first warnings of a kidney in trouble and something a lab test can show long before you feel any symptom.",
        ],
      },
      {
        nombre: "Type V · the director",
        titular: "Type V collagen: the one that directs the others.",
        claves: ["There's very little of it", "It sets how thick fibers get", "Without it, everything goes lax"],
        texto: [
          "There's very little of it, but without it the rest doesn't assemble properly. Type V sits **in the center** of the type I fibers and works as the mold they assemble around: it decides how many molecules join and how thick the final fiber will be. A site manager rather than a brick.",
          "It's in the cornea, the placenta, the tendons and the skin.",
          "When it fails, the tissue ends up too lax, because the fibers come out uneven. That's what happens in the classic form of **Ehlers-Danlos syndrome**: very elastic, thin skin, joints that slip out of place easily and wide scars that never quite close well.",
        ],
      },
      {
        nombre: "Type VI · the filler",
        titular: "Type VI collagen: the one that fills the gaps.",
        claves: ["It fills between fiber and fiber", "It anchors cells to the matrix", "It fails in some myopathies"],
        texto: [
          "It makes neither ropes nor sheets: it forms extremely fine microfibrils, looking like a beaded necklace, that **fill the space** between the big fibers and hold them in place. It's the filler material of the building site.",
          "And it does something just as important: it **hooks cells to the matrix** around them. Without that anchoring, a cell doesn't know where it is and doesn't get the mechanical signals from its surroundings. You have it all over your body, especially in muscle, skin and cartilage.",
          "When it fails, you see it right in the muscle, because every muscle fiber needs to be well attached to what wraps it: that's what happens in **Bethlem myopathy** and in Ullrich congenital muscular dystrophy, with muscle weakness and joints that are stiff and lax at the same time. It's the best example that connective tissue isn't “around” your organs: it's part of how they work.",
        ],
      },
      {
        nombre: "Type VII · the staples",
        titular: "Type VII collagen: your skin's staples.",
        claves: ["It anchors epidermis to dermis", "It gives no strength, it holds", "Without it, skin peels away"],
        texto: [
          "It forms short, hook-shaped fibrils that cross the basement membrane and stitch the epidermis to the dermis. They add no strength and no volume: they just **hold** one layer to the other, like staples.",
          "You understand how important they are when they're missing. In **epidermolysis bullosa**, a genetic disease affecting this collagen, the skin separates at the slightest rub and fills with blisters; the people who have it are sometimes called “butterfly children”, because their skin is that fragile.",
          "It's the best reminder that in connective tissue not everything is strength. A good part of the job is simply keeping some layers stuck to others.",
        ],
      },
    ],
    consejos: [
      {
        titular: "Collagen is your body's glue.",
        claves: ["The most abundant protein", "It forms skin, tendons and vessels", "Without it, everything falls apart"],
        texto: [
          "Collagen is the most abundant protein in your body. It forms the structure of your skin, your tendons, your ligaments, your bones, your blood vessels and even many of your organs. Without it, your body would literally fall apart.",
          "And there isn't just one: around **twenty-eight types** of collagen are known, though five or six do practically all the work. Each one assembles in a different way, and that's why each one is good for different things: some make ropes, others meshes and others only staples. You have the seven main ones in the cards above.",
        ],
      },
      {
        titular: "Collagen peptides wake your fibroblasts up.",
        claves: ["It's digested into small peptides", "They alert the fibroblasts", "Your body makes more"],
        texto: [
          "When you digest collagen, part of it breaks into small peptides that can reach your blood. Some of those peptides act as a signal for fibroblasts, prompting them to make more collagen… as long as they have the nutrients they need, vitamin C above all. The collagen you eat doesn't go straight to your skin: it helps your own body produce more.",
        ],
      },
      {
        titular: "Vitamin C is essential for making collagen.",
        claves: ["Fibroblasts need it", "Without it, fragile tissue", "Its lack causes scurvy"],
        texto: [
          "Fibroblasts need vitamin C to bind collagen fibers together properly. Without it, connective tissue loses strength and wounds heal worse. In fact scurvy, a disease caused by a lack of vitamin C, causes bleeding gums, wounds that won't heal and very fragile connective tissue.",
        ],
      },
      {
        titular: "Sugar ages collagen too.",
        claves: ["Sugar sticks to collagen", "It stiffens it (glycation)", "It ages skin and arteries"],
        texto: [
          "When glucose stays high for a long time, it can bind to collagen, forming links that make the fibers stiffer and less elastic. That process, called glycation, contributes to the aging of your skin, your arteries and many other tissues.",
        ],
      },
      {
        titular: "Your fibroblasts work your whole Life.",
        claves: ["Collagen is renewed", "They make new fibers", "Slow, steady work"],
        texto: [
          "Collagen doesn't last forever. Fibroblasts continuously make new fibers while other cells clear out the old or damaged ones. It's a slow process, but a steady one, and it's what keeps your tissues strong.",
        ],
      },
      {
        titular: "Exercise strengthens your connective tissue too.",
        claves: ["Tendons respond to effort", "Stronger fibers", "Long rest weakens it"],
        texto: [
          "Tendons, ligaments and other collagen structures respond to effort just like muscles do. When you train progressively, your fibroblasts produce stronger, better organized fibers. Prolonged total rest does exactly the opposite: connective tissue loses strength.",
        ],
      },
      {
        titular: "Sleep rebuilds collagen too.",
        claves: ["Sleep lowers cortisol", "Repair hormone goes up", "Fibroblasts rebuild"],
        texto: [
          "While you sleep, your body switches from a state of activity to one of repair. Stress-related hormones like cortisol come down, the release of growth hormone goes up and repair processes switch on in many tissues. That's when fibroblasts take the chance to synthesize part of the new collagen your skin, your tendons and your ligaments will need to recover from the day's wear.",
        ],
      },
      {
        titular: "The Sun breaks collagen too.",
        claves: ["UV switches on cutting enzymes", "It destroys more than you replace", "It causes wrinkles and sagging"],
        texto: [
          "Ultraviolet radiation doesn't only damage the DNA of your skin cells. It also switches on enzymes called metalloproteinases, whose job is to cut damaged collagen fibers. The problem shows up when sun exposure is excessive: collagen is destroyed faster than fibroblasts can replace it. That imbalance is one of the main causes of wrinkles and of skin losing its firmness.",
        ],
      },
    ],
  },

  grasa: {
    label: "Fat tissue",
    descripcion: [
      "It isn't just an energy reserve: it's an active organ. It protects you, insulates you from the cold and makes hormones that talk to your brain about hunger and about how much energy you have stored. Well looked after, it's a great ally.",
    ],
    consejos: [
      {
        titular: "Fat is supposed to be an ally.",
        claves: ["It stores energy", "It protects and insulates", "It makes leptin, it talks to the brain"],
        texto: [
          "Fat tissue stores energy for when the body needs it. It also protects your organs, helps hold your body temperature and makes hormones like leptin, which tells the hypothalamus how much energy you already have stored and helps regulate appetite. From that information, the brain adjusts your metabolism, your energy expenditure and even part of your immune response. Without fat, we simply couldn't live.",
        ],
      },
      {
        titular: "Your fat cells talk to your brain too.",
        claves: ["Leptin reports the reserves", "It helps control appetite", "Too much of it fools the brain"],
        texto: [
          "Adipocytes produce a hormone called leptin, which tells the brain how much energy the body has stored. When that system works well, it helps control appetite. But years of excess fat can make the brain stop responding properly to that signal, something known as leptin resistance. The result is that we keep feeling hungry even with energy reserves to spare.",
        ],
      },
      {
        titular: "Not all fat is the same.",
        claves: ["White stores, brown burns", "Brown produces heat", "Cold and exercise boost it"],
        texto: [
          "White fat stores energy for the future. Brown fat does exactly the opposite: it burns that energy to produce heat. Newborns have a lot of brown fat to hold their temperature, though adults keep small amounts too. On top of that, certain habits can make part of your white fat take on characteristics similar to brown fat, a process called “browning”. Those cells develop more mitochondria, the cell's little power plants. Why would a cell make more mitochondria? Because it needs to produce more energy. Cold exposure and physical exercise encourage this process and increase the body's capacity to generate heat and burn energy.",
        ],
      },
      {
        titular: "Losing weight doesn't get rid of your fat cells.",
        claves: ["Adipocytes don't disappear", "They only empty and shrink", "They refill easily"],
        texto: [
          "When you lose weight, adipocytes don't usually disappear: they simply empty out and shrink. If you go back to taking in more energy than you need, those same cells will fill up again easily.",
        ],
      },
      {
        titular: "Too much food breaks cells.",
        claves: ["Adipocytes that suffocate and die", "Macrophages surround them and inflame", "That's where insulin resistance is born"],
        texto: [
          "When fat tissue piles up far more fat than it can store in a healthy way, adipocytes swell so much that the blood vessels no longer reach all of them: some stop getting enough oxygen and end up dying. What happens from there is decided by the **macrophages**, the immune cells that clear the debris.",
          "**1. They come to clean.** The adipocyte that has died spills its droplet of fat and its debris into the tissue. Macrophages arrive to clear it and surround it several at a time, in a ring; under the microscope they look like small crowns around the dead cell.",
          "**2. They change character.** A macrophage can behave in two ways: in repair mode, which calms the tissue, or in alarm mode, which inflames it. Swallowing that much fat and cell debris switches them to alarm mode and they start releasing inflammatory signals, the **cytokines**.",
          "**3. Those signals garble insulin's message.** Inside the cell, cytokines interfere with the order insulin brings: insulin arrives and knocks at the door, but the message gets lost on the way. That's the origin of **insulin resistance** in that tissue.",
          "**4. A loop builds up.** Inflamed fat tissue stores fat worse, so it releases more fatty acids into the blood. Those fatty acids reach the liver and the muscle, which also turn resistant to insulin, and the body responds by making even more insulin and storing more fat. The problem feeding itself.",
          "**5. It doesn't stay in the fat.** Kept up for years, that drip of cytokines circulates in your blood and leaves the whole body in a low but constant state of inflammation: the ground where type 2 diabetes and cardiovascular disease grow.",
          "One clarification, because this often gets mixed up: macrophages are also the stars of arterial plaque, but that happens **somewhere else**, in the artery wall, and with other macrophages, not with these ones moving house. You have that story told in the box about visceral fat.",
          "And the good news: none of this is a point of no return. As you lose fat, adipocytes stop suffocating, fewer macrophages are recruited and the ones that stay go back, little by little, to repair mode. Inflammation comes down and insulin sensitivity improves.",
        ],
      },
      {
        titular: "Exercising changes your fat too.",
        claves: ["Myokines “brown” the fat", "The tissue burns more energy", "It releases fat as fuel"],
        texto: [
          "When you exercise, your muscles release molecules called myokines that encourage part of your white fat to take on characteristics similar to brown fat. That process makes fat tissue burn more energy and improves your metabolism. On top of that, during prolonged exercise the triglycerides stored in your fat tissue are broken down into fatty acids, which serve as fuel for your muscles and other organs. The liver can also turn part of those fatty acids into ketone bodies, especially during long fasts or very long-duration exercise.",
        ],
      },
      {
        titular: "Sleeping too little encourages gaining fat too.",
        claves: ["It disturbs hunger and fullness", "It increases appetite", "Resting protects your weight"],
        texto: [
          "Sleeping less than you need disturbs hormones like leptin and ghrelin, increasing appetite and making it harder to feel full. On top of that, tiredness lowers your energy expenditure and pushes you toward more calorie-dense foods. That's why resting well also helps you keep a healthy weight.",
        ],
      },
      {
        titular: "The problem isn't the fat… it's where it piles up.",
        claves: ["Subcutaneous is less harmful", "Visceral inflames", "Its location matters"],
        texto: [
          "The fat sitting under your skin is usually far less harmful than the fat wrapping organs like the liver, the pancreas or the intestine. Not all fat has the same impact on health: **where it is matters as much as how much there is**, and over the years an excess of visceral fat raises the risk of type 2 diabetes, high blood pressure, cardiovascular disease and even some kinds of cancer.",
          "A home clue that beats the scale: your waist measurement, and above all the ratio between waist and height. Keeping your waist under half your height is a more reliable risk indicator than your weight, because it speaks precisely about the fat you can't see.",
          "In the next two boxes you have each one separately: what subcutaneous fat does, and why visceral fat is a problem of a different nature.",
        ],
      },
      {
        titular: "Subcutaneous fat is your reserve, and it's the sensible one.",
        claves: ["Right under the skin", "The body's biggest energy store", "It insulates, cushions and protects"],
        texto: [
          "It's the fat immediately under your skin, the one you can pinch, and it's **the body's biggest energy store**: arms, legs, buttocks, hips and the surface of the abdomen. It insulates you from the cold, cushions knocks and keeps the energy you have left over in an orderly way.",
          "Its least obvious virtue is that, by storing fat, it protects you. As long as there's room in there, the fatty acids left over end up locked inside the adipocyte and not in your liver, your muscle or your pancreas, which is where they really get in the way. It's the right place.",
          "People with **lipodystrophy**, who can't form this fat, are extremely thin and still develop fatty liver disease and severe diabetes: having nowhere to store it is worse than having it.",
        ],
      },
      {
        titular: "Visceral fat is another thing entirely: it lives among your organs.",
        claves: ["It wraps liver and intestines", "It drains straight to the liver", "It inflames your whole body"],
        texto: [
          "It's inside the abdomen, wrapping the liver and the intestine. You can't pinch it and you barely see it in the mirror, and that's part of the problem: you can have little subcutaneous fat and a lot of visceral fat.",
          "Two things make it different. It drains through the **portal vein**, so everything it releases — fatty acids and inflammatory signals — reaches the liver first, concentrated and undiluted. And it has far more immune cells per gram, so when it saturates and its adipocytes suffocate and die, the alarm is much louder: it **recruits monocytes** from the blood that turn into inflammatory macrophages (**M1**) and that, instead of repairing, release cytokines calling in more macrophages. The immune system stays switched on around the clock.",
          "And those cytokines escape the abdomen: they irritate the **endothelium**, the inner wall of your arteries, cholesterol slips in and oxidizes there, and the artery's own macrophages swallow it until they saturate and turn into **foam cells**. That's where **atherosclerotic plaque** begins.",
          "Visceral fat isn't a weight problem, it's an inflammation problem. And inflammation doesn't stay where it's born.",
        ],
      },
    ],
  },

  lengua: {
    label: "Tongue",
    descripcion: [
      "It's an agile muscular organ, covered in papillae that house your taste buds. Inside them, specialized cells detect the five tastes — sweet, salty, sour, bitter and umami — and send the signal to your brain. Besides tasting, the tongue mixes and pushes food so you can swallow it, and it's essential for speaking.",
    ],
    consejos: [
      {
        titular: "Scrape your tongue: a traditional Ayurvedic practice.",
        claves: ["It clears bacteria and debris", "It improves your breath", "Best right after waking"],
        texto: [
          "Scraping your tongue once a day helps clear out bacteria, food debris and dead cells that build up on its surface, especially when you wake up. That simple routine can improve your breath and contribute to better oral hygiene. Current scientific evidence suggests its benefits come mainly from removing the tongue coating and the microorganisms that gather there.",
        ],
      },
      {
        titular: "Tongues have unique prints.",
        claves: ["A pattern as unique as a fingerprint", "Possible biometric identification", "Unique in every person"],
        texto: [
          "Just like fingerprints, every tongue has its own exclusive pattern of lines and grooves that tells it apart from any other. That has caught the interest of scientists, who have researched its possible use as a method of biometric identification. It isn't used routinely yet, but it shows just how surprising and unique this part of our body is.",
        ],
      },
      {
        titular: "The tongue is a very powerful set of muscles.",
        claves: ["Not one muscle, eight", "Speaking, swallowing and chewing", "Flexible and tough"],
        texto: [
          "Plenty of people think the tongue is a single muscle, but it's actually made of eight muscles working in a coordinated way. Thanks to them we can speak, chew, swallow and even breathe properly. Its great flexibility and toughness make it one of the most important parts of the body for everyday activities.",
        ],
      },
      {
        titular: "The tongue can detect five main tastes.",
        claves: ["Five basic tastes", "The whole tongue detects them", "Smell completes the flavor"],
        texto: [
          "The taste buds on your tongue let you recognize sweet, salty, sour, bitter and umami. For a long time it was believed each taste was perceived in a specific zone, but today we know almost the whole tongue can detect all of them. Smell also plays a key role in fully enjoying the flavor of food.",
        ],
      },
      {
        titular: "The tongue regenerates constantly.",
        claves: ["It renews its cells nonstop", "It heals very fast", "It protects the taste buds"],
        texto: [
          "The surface of your tongue renews its cells continuously, which lets small wounds or irritations heal quickly. That regeneration helps keep your taste buds healthy and protects your mouth against bacteria and other outside agents. Good oral hygiene is essential to keep your tongue in good shape.",
        ],
      },
      {
        titular: "The tongue is essential for communicating.",
        claves: ["It forms almost every sound", "It works with lips and teeth", "It makes speaking possible"],
        texto: [
          "Speaking would be practically impossible without the tongue, since it takes part in forming most of the sounds of language. It works together with your lips, your teeth and your palate to articulate words clearly. Thanks to how precisely and quickly it moves, we can express ideas and emotions and communicate with other people every day.",
        ],
      },
    ],
  },

  bazo: {
    label: "Spleen",
    descripcion: [
      "It's the great filter of your blood. In its red pulp, macrophages retire old or damaged red blood cells and recycle their iron; in its white pulp it watches your blood for infections, like a lymph node plugged straight into the bloodstream. It also keeps a reserve of defensive cells ready to act.",
    ],
    consejos: [
      {
        titular: "The spleen is the largest organ of the lymphatic system.",
        claves: ["The largest lymphatic organ", "Under the left ribs", "It filters and defends"],
        texto: [
          "Plenty of people barely know where it is, but the spleen is the largest organ of the lymphatic system. It sits in the upper left part of your abdomen, just under the ribs. Its main job is helping the immune system fight infection and filtering the blood. It also takes part in producing and storing some of the body's defensive cells.",
        ],
      },
      {
        titular: "It works as a natural blood filter.",
        claves: ["It retires old red blood cells", "It recycles the iron", "It watches for microbes"],
        texto: [
          "The spleen constantly checks your blood to clear out aged or damaged red blood cells and recycle components like iron. Part of the immune system lives in it, going over the bloodstream looking for bacteria, viruses and other microorganisms. Through that process, it helps keep your blood in good shape and strengthens your body's defenses against possible infections.",
        ],
      },
      {
        titular: "It can store a reserve of blood.",
        claves: ["It keeps a blood reserve", "It releases it in emergencies", "A backup tank"],
        texto: [
          "One of the spleen's less known jobs is acting as a small blood tank. In certain situations, like a significant bleed or intense physical effort, it can release part of that reserve to help the body. This capacity is far more developed in some animals, but it exists in human beings too.",
        ],
      },
      {
        titular: "You can live without a spleen.",
        claves: ["Other organs cover for it", "You can live without it", "More risk of infection"],
        texto: [
          "Although the spleen does very important jobs, it's possible to live without it. When it has to be removed because of an injury or a disease, other organs, like the liver and the lymph nodes, take on part of its work. People without a spleen do have a higher risk of certain infections, though, so they usually need specific vaccines and some extra precautions.",
        ],
      },
      {
        titular: "The spleen changes size depending on what the body needs.",
        claves: ["It grows when it works harder", "Around 5 inches normally", "Its size varies"],
        texto: [
          "The spleen isn't always the same size. It can grow temporarily during some infections, blood diseases or liver problems, since it works harder to filter blood and switch on the immune response. Under normal conditions it measures around 5 inches, but its size can vary with age, body build and each person's state of health.",
        ],
      },
    ],
  },

  vesicula: {
    label: "Gallbladder",
    descripcion: [
      "It's a small pouch sitting under your liver that keeps and concentrates bile between meals. When you eat fat, it contracts and releases that bile into your intestine to help digest it and absorb fat-soluble vitamins. It works as a team with your liver and your pancreas inside the digestive system.",
    ],
    consejos: [
      {
        titular: "The gallbladder is a small bile warehouse.",
        claves: ["It keeps and concentrates bile", "It sits under the liver", "It lets it go when you eat fat"],
        texto: [
          "Small as it is, the gallbladder does a very important job in digestion. It sits under the liver and its main task is to store and concentrate the bile the liver produces. When we eat, especially fats, it releases that bile into the intestine to make digesting and absorbing nutrients easier.",
        ],
      },
      {
        titular: "Bile helps digest fats.",
        claves: ["It doesn't make bile, it stores it", "It breaks fats up", "It helps absorb vitamins"],
        texto: [
          "The gallbladder doesn't produce bile: it keeps it until the body needs it. Bile works as a natural detergent that breaks fats down into smaller particles, letting digestive enzymes process them more easily. Thanks to that process, the body can absorb essential vitamins like A, D, E and K.",
        ],
      },
      {
        titular: "You can live without a gallbladder.",
        claves: ["It isn't indispensable", "The liver keeps making bile", "Sometimes the diet is adjusted"],
        texto: [
          "The gallbladder makes digestion easier, but it isn't an organ you need to live. If it has to be removed because of stones or inflammation, the liver keeps producing bile, which passes straight into the intestine. Most people can live a normal Life after the surgery, though some need to adjust their food for a while.",
        ],
      },
      {
        titular: "Gallstones are very common.",
        claves: ["Cholesterol forms “stones”", "Many with no symptoms", "Others, pain or surgery"],
        texto: [
          "One of the most common gallbladder conditions is gallstones, also known as “stones”. They form when some components of bile, like cholesterol, harden and build small deposits. Many people never have any symptoms, but in other cases they can cause intense pain, inflammation or the need for surgery.",
        ],
      },
      {
        titular: "The gallbladder contracts every time you eat fat.",
        claves: ["CCK orders the contraction", "It pushes bile out when you eat", "It works better with unsaturated fat"],
        texto: [
          "Every time we eat food rich in fat, the intestine releases a hormone called cholecystokinin. That hormone sends the signal for the gallbladder to contract and push out the bile it stored. It's an automatic process that happens several times a day and is essential for digesting fats efficiently. It has been shown to contract better when that fat is unsaturated, proof that the body responds better to the molecules that bring it the most benefit.",
        ],
      },
    ],
  },
};
