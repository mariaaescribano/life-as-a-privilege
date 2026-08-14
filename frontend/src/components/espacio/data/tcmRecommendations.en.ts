/* ══════════════════════════════════════════════════════════════
   RECOMENDACIONES TCM — en INGLÉS.

   Fichero paralelo de `tcmRecommendations.ts`: el español manda la
   ESTRUCTURA (qué resultados hay y en qué orden se pintan) y de aquí
   sale solo el texto.

   ⚠️ Las claves son los nombres ESPAÑOLES del resultado («Deficiencia
   de Qi», «Madera»…) porque son lo que guarda la base de datos
   (`metodo_tcm` / `tcm`) y lo que empareja `tcmTheme`. Traducirlas
   haría que la usuaria perdiera su resultado al cambiar de idioma.

   Lo que falte aquí se lee en español, resultado por resultado (ver
   `useRecs` en `tcmEspacioEn.ts`). No hace falta que las listas tengan
   el mismo número de líneas que el español: son listas sueltas, no van
   emparejadas por posición.

   Al traducir:
     · el pinyin y el nombre latino NO se tocan (Huang Qi, Astragalus…);
       lo que se traduce es la planta en castellano y el descriptor que
       va después del «·».
     · Qi, Yin, Yang, Shen, Wei Qi, Jing, Blood, Dampness, Heat, Phlegm
       y Cold van con mayúscula: son términos técnicos, no la sangre del
       análisis ni el calor del termómetro.
     · los órganos van en minúscula (liver, spleen, kidney…), como en
       español y como en el resto de los ficheros ingleses de MTC.
     · las horas, en formato de EE. UU. («before 11 p.m.»).
══════════════════════════════════════════════════════════════ */

import type { Recs } from "./tcmRecommendations";

/* ─── CONSTITUCIONES (Test 1) ─────────────────────────────── */
export const RECS_CONSTITUCIONES_EN: Record<string, Recs> = {
  "Equilibrado": {
    infusiones: [
      "Green tea (Camellia sinensis) · energizing, antioxidant and balancing",
      "Chrysanthemum (Ju Hua) · now and then, in hot spells or when your eyes are strained",
      "Rosehip · natural vitamin C, balancing",
    ],
    hierbas: [
      "Huang Qi (Astragalus) · preventive upkeep of the Wei Qi",
      "Shan Yao (Dioscorea opposita) · tonifies spleen and kidney, a gentle adaptogen",
      "Gou Qi Zi (Lycium / goji) · nourishes liver and kidney, antioxidant",
    ],
    estiloDeVida: [
      "Regular sleep: in bed before 11 p.m., up with the sun",
      "Moderate exercise: walking, tai chi or swimming, 30 min a day",
      "Gratitude and warm feeling: it nourishes the Shen (the Soul)",
    ],
    nutricion: [
      "The 5 flavors in balance · sour, bitter, sweet, pungent and salty in harmony",
      "Food in season · local and fresh, following each season",
      "Vegetables, protein and healthy fats on every plate",
      "Whole grains · rice, barley, quinoa",
      "Moderation in everything · no excess and no restriction, listen to your body",
    ],
  },

  "Deficiencia de Qi": {
    infusiones: [
      "Dang Shen (Codonopsis) + Da Zao (red date) · a daily tonic for the Center",
      "Huang Qi (Astragalus) · simmered 15 min, strengthens your defenses",
      "Fresh ginger (Sheng Jiang) · warms and tonifies the spleen-stomach",
    ],
    hierbas: [
      "Ren Shen (Panax ginseng) · the main Qi tonic, the base of Si Jun Zi Tang",
      "Bai Zhu (Atractylodes macrocephala) · strengthens the spleen, clears obstruction",
      "Gan Cao (Glycyrrhiza uralensis) · harmonizes and tonifies gently",
    ],
    estiloDeVida: [
      "Don't push yourself, in body or mind, for too long; take your rest seriously",
      "Gentle Qi Gong and Tai Chi: movement that builds Qi instead of spending it",
      "Warm, cooked meals at regular times; never skip breakfast",
    ],
    nutricion: [
      "Complete protein · egg, tofu, soybeans, chicken, fish",
      "Rice, millet, warm oats · grains that nourish and strengthen the spleen",
      "Red date (Da Zao) and goji · naturally sweet tonics for the Center",
      "Stay away from: raw and cold food, iced drinks and refined sugar",
    ],
  },

  "Deficiencia de Yang": {
    infusiones: [
      "Gui Zhi (cinnamon stick) + Gan Jiang (dried ginger) · warms the Interior",
      "Astragalus + cinnamon stick · tonifies Yang and shores up your defenses against Cold",
      "Walnut (He Tao Ren) simmered with dates · nourishes kidney Yang and warms",
    ],
    hierbas: [
      "Rou Gui (Cinnamomum cassia) · warms the Yang of the kidney",
      "Du Zhong (Eucommia ulmoides) · tonifies kidney Yang and strengthens the tendons",
      "Ba Ji Tian (Morinda officinalis) · tonifies the Yang of the kidney",
    ],
    estiloDeVida: [
      "Keep outside Cold away: cold baths, air conditioning blowing on you, too few clothes",
      "Gentle exercise with a light sweat, at sunrise or sunset",
      "Sleep warmly dressed; keep your feet and your lower back warm",
    ],
    nutricion: [
      "Complete protein · egg, tofu, soybeans, chicken, fish",
      "Cinnamon, dried ginger, clove, chives · spices that warm you from the Interior",
      "Walnuts, chestnuts, sunflower seeds · they nourish the Yang of the kidney",
      "Stay away from: cucumber, watermelon, yogurt, cold smoothies, and too much dairy or raw food",
    ],
  },

  "Deficiencia de Yin": {
    infusiones: [
      "Gou Qi Zi (Lycium) + Ju Hua (chrysanthemum) · nourishes the liver, cools the eyes",
      "Mai Men Dong (Ophiopogon) · moistens lung and stomach, the Yin of the fluids",
      "Bai He (Lilium brownii) · settles the Shen and nourishes the Yin of lung and heart",
    ],
    hierbas: [
      "Shu Di Huang (prepared Rehmannia) · nourishes the Yin and the Blood",
      "Tian Men Dong (Asparagus cochinchinensis) · deep Yin of lung and kidney",
      "Bai Shao (Paeonia lactiflora) · nourishes liver Blood, relaxing",
    ],
    estiloDeVida: [
      "Sleep before 11 p.m.; the Yin rebuilds itself in deep sleep",
      "Keep away from alcohol, strong pungent food and anything very dry or smoked",
      "Meditation, yoga and activities that don't overheat you",
      "Water: over 2 L a day, warm or hot with a pinch of salt; never cold",
    ],
    nutricion: [
      "Complete protein · egg, tofu, soybeans, chicken, fish",
      "Black sesame, tofu, egg yolk · they nourish the Yin and the Blood",
      "Pear, mulberry, grape, melon · they cool and moisten your inner fluids",
      "Stay away from: alcohol, strong pungent food, smoked dishes and anything very dry or toasted",
    ],
  },

  "Flema-Humedad": {
    infusiones: [
      "Yi Yi Ren (Coix / Chinese barley) · drains Dampness, simmered 20 min",
      "Chen Pi (tangerine peel) + Ban Xia · dissolves Phlegm",
      "Cinnamon + dried ginger · wakes up the spleen and dries inner Dampness",
    ],
    hierbas: [
      "Fu Ling (Poria cocos) · drains Dampness, tonifies the spleen, settles the mind",
      "Cang Zhu (Atractylodes lancea) · dries Dampness more strongly than Bai Zhu",
      "Chen Pi (Citrus reticulata) · moves spleen Qi, dissolves Phlegm",
      "Yi Yi Ren (Coix lacryma-jobi) · clears Dampness through the urine",
    ],
    estiloDeVida: [
      "Active exercise every day: walking, swimming, cycling (30 min at least)",
      "Dry, airy rooms; keep away from basements, damp and wet clothes",
      "Warm, regular, moderate meals; no snacking in between",
      "Chew slowly: 20–25 chews per mouthful",
    ],
    nutricion: [
      "Pearl barley, rye, radish · they dry the Dampness of the spleen-stomach",
      "Garlic, leek, mustard, onion · they warm and drain inner Phlegm",
      "Radish, turnip, celery · they move and dry Dampness gently",
      "Cut out: dairy, refined sugar, alcohol, fried food and white flour",
    ],
  },

  "Calor-Humedad": {
    infusiones: [
      "Pu Gong Ying (dandelion) · drains Damp-Heat from the liver and the skin",
      "He Ye (lotus leaf) + Ju Hua (chrysanthemum) · cools the inside, hydrates",
      "Yin Chen Hao (Artemisia capillaris) · Damp-Heat of liver and gallbladder",
    ],
    hierbas: [
      "Huang Lian (Coptis chinensis) · clears intense Heat, dries Dampness",
      "Long Dan Cao (Gentiana scabra) · Damp-Heat in liver and gallbladder",
      "Yin Chen Hao (Artemisia capillaris) · the classic for liver and gallbladder trouble",
      "Yi Yi Ren (Coix) · clears Dampness, mildly warming",
    ],
    estiloDeVida: [
      "A cool, light diet: green vegetables, grains, complete protein",
      "Handling stress: meditation, belly breathing, time in nature",
      "Moderate exercise with a sweat: active yoga, a morning swim",
    ],
    nutricion: [
      "Mung bean, lotus · the classic coolers of Chinese medicine, they drain Damp-Heat",
      "Cucumber, celery, amaranth · they cool the Interior and drain Dampness",
      "Green tea, fresh fruit in season · refreshing without making more Dampness",
      "Cut out: alcohol, fried food, pungent dishes, fatty meat and refined sugar",
    ],
  },

  "Estancamiento de Qi": {
    infusiones: [
      "Mei Gui Hua (dried red rose) · moves liver Qi, eases emotional tension",
      "Bo He (mint) + Chen Pi (tangerine peel) · unblocks and refreshes",
      "Mo Li Hua (jasmine) · harmonizes liver and stomach, softens the feelings",
    ],
    hierbas: [
      "Chai Hu (Bupleurum chinense) · moves liver Qi",
      "Xiang Fu (Cyperus rotundus) · the master regulator of stagnant Qi",
      "Yu Jin (Curcuma aromatica) · moves Qi and Blood, drains liver Heat",
      "Bai Shao (Paeonia lactiflora) · nourishes liver Blood, softens the temper",
    ],
    estiloDeVida: [
      "Regular aerobic exercise: running, dancing, swimming (30 min a day at least)",
      "Let feelings out: writing, an honest conversation, art, music",
      "Conscious breathing and pranayama that opens up the chest",
      "In bed before 11 p.m.; the liver rebuilds itself from 11 p.m. to 3 a.m.",
    ],
    nutricion: [
      "Leek, onion, fennel, garlic · they move the stagnant Qi of the liver",
      "Radish, turnip, orange · they wake up digestion and free the Qi",
      "Dried rose, saffron · seasonings that move the Qi and the Blood",
      "Cut back on: alcohol, fat, sugar; eat slowly and chew well",
    ],
  },
};

/* ─── ELEMENTOS (Test 2) ──────────────────────────────────── */
export const RECS_ELEMENTOS_EN: Record<string, Recs> = {
  "Madera": {
    infusiones: [
      "Mei Gui Hua (rose) + Bo He (mint) · moves and refreshes liver Qi",
      "Ju Hua (chrysanthemum) · cools liver Heat, sharpens the eyes",
      "Pu Gong Ying (dandelion) · drains liver and gallbladder",
    ],
    hierbas: [
      "Chai Hu (Bupleurum) · the herb of the Wood Element, it moves the liver",
      "Bai Shao (Paeonia) · nourishes liver Blood, softens the tension",
      "Chuan Lian Zi (Melia toosendan) · moves Qi and eases pain in the ribs",
      "Mu Gua (Chaenomeles speciosa) · relaxes tendons and muscles, Wood",
    ],
    estiloDeVida: [
      "Your season: spring — go over your habits and renew them in March and April",
      "Aerobic exercise: run, swim or dance to free the stagnant Qi",
      "Creative work: design, music, writing, expressive dance",
      "In bed before 11 p.m.; the liver works from 11 p.m. to 3 a.m.",
      "Work on anger and frustration with tools you choose consciously",
    ],
    nutricion: [
      "Mildly sour flavor · lemon, umeboshi vinegar, fermented plum",
      "Bitter greens · spinach, parsley, basil, fresh sprouts",
      "Chicken liver (now and then) · it nourishes the liver itself",
      "Stay away from: too much alcohol, fried food, very fatty dishes and artificial acids",
    ],
  },

  "Fuego": {
    infusiones: [
      "Lian Zi Xin (lotus heart) · clears heart Heat, settles the Shen",
      "Suan Zao Ren (Ziziphus), simmered · nourishes the heart, helps you sleep",
      "Dan Shen (Salvia miltiorrhiza), a mild tincture · gets the Blood moving",
    ],
    hierbas: [
      "Suan Zao Ren (Ziziphus jujuba) · the classic tonic of the heart and the Shen",
      "Yuan Zhi (Polygala tenuifolia) · connects heart and kidney, settles the mind",
      "He Huan Pi (Albizia julibrissin) · eases low mood, anxiety and sorrow",
      "Bai Zi Ren (biota seed) · nourishes the heart, settles an agitated Shen",
    ],
    estiloDeVida: [
      "Your season: summer — watch out for too much heat and too much stimulation",
      "Meditate daily, and use whatever settles your feelings on purpose",
      "Less screen time, especially after 6 p.m.",
      "Balanced social life; don't run on emotional intensity with no rest",
    ],
    nutricion: [
      "Bitter flavor · pure cacao, endive, chicory, arugula, red tea (pu-erh)",
      "Red and orange · cherry, pomegranate, tomato, bell pepper, wild berries",
      "Quinoa, oats · light grains that nourish the heart and the Blood",
      "Go easy on: caffeine, strong pungent food and too many stimulants or alcohol",
    ],
  },

  "Tierra": {
    infusiones: [
      "Sheng Jiang (fresh ginger) + Da Zao (date) · warms the Center",
      "Sha Ren (green cardamom) · wakes up the spleen-stomach, settles gas",
      "Dang Shen (Codonopsis) · a gentle tonic for spleen Qi without overheating",
    ],
    hierbas: [
      "Bai Zhu (Atractylodes macrocephala) · strengthens spleen and stomach",
      "Fu Ling (Poria cocos) · drains Dampness, settles the mind and the Shen",
      "Mu Xiang (Saussurea lappa) · regulates spleen Qi, eases bloating",
      "Shan Zha (Crataegus) · helps digestion, gets the Blood moving",
    ],
    estiloDeVida: [
      "Your season: late summer (August–September), the turn of the year",
      "Meals at the same times every day; never skip breakfast",
      "Chew 20–30 times per mouthful; eat with no screens and no rush",
      "A 15-min walk after eating: it gets the spleen Qi going",
      "Chew less on your thoughts: meditation, journaling, nature",
    ],
    nutricion: [
      "Naturally sweet flavor · pumpkin, sweet potato, carrot, corn, honey",
      "Warm, cooked food · soups, stews, purées, stewed fruit",
      "Mild ferments · miso, kefir, sauerkraut — they wake up the spleen",
      "Stay away from: raw food, too much dairy, refined sugar and eating in a hurry",
    ],
  },

  "Metal": {
    infusiones: [
      "Jie Geng (Platycodon grandiflorus) · opens the lung, expectorant",
      "Pear + honey · moistens the lung, soothes a dry cough",
      "Mai Men Dong (Ophiopogon) · nourishes the Yin of lung and stomach",
    ],
    hierbas: [
      "Huang Qi (Astragalus) · strengthens the Wei Qi (your defenses), a lung tonic",
      "Bai He (Lilium brownii) · nourishes lung Yin, settles the Shen in grief",
      "Bai Mu Er (Tremella fuciformis) · moistens the lung and dry skin",
      "Bei Sha Shen (Glehnia littoralis) · Yin of lung and stomach, dryness",
    ],
    estiloDeVida: [
      "Your season: fall — build up your immune defenses and your skin",
      "Deep breathing every day: pranayama, breathing qigong, 10 min",
      "Time in nature and clean air; open the windows every day",
      "Let yourself grieve, and say the sadness out loud instead of holding it in",
    ],
    nutricion: [
      "Mildly pungent flavor · garlic, onion, leek, ginger in moderation",
      "White and creamy · pear, almonds, mushrooms, rice, cooked turnip",
      "Pure honey · it moistens the lung and soothes a dry cough",
      "Stay away from: tobacco, dry rooms, very pungent or very sour food",
    ],
  },

  "Agua": {
    infusiones: [
      "Gou Qi Zi (Lycium / goji) · nourishes the Yin of kidney and liver",
      "Wu Wei Zi (Schisandra chinensis) · astringent, it holds on to the Jing",
      "Hei Zhi Ma (black sesame), toasted, in oat milk · nourishes the kidney",
    ],
    hierbas: [
      "Shu Di Huang (prepared Rehmannia) · nourishes kidney Yin and Jing",
      "Du Zhong (Eucommia ulmoides) · tonifies kidney Yang and the tendons",
      "Nu Zhen Zi (Ligustrum lucidum) · Yin of kidney and liver, eyes and tinnitus",
      "He Shou Wu (Polygonum multiflorum) · nourishes Jing and Blood, longevity",
    ],
    estiloDeVida: [
      "Your season: winter — hold on to your vital energy (Jing)",
      "Deep rest: in bed before 10:30 p.m.",
      "Moxibustion on KD 1 (Yong Quan), Ren 4 (Guan Yuan), Du 4 (Ming Men)",
      "Don't stay up too late and don't take on heavy emotional work",
      "Less salt, and less very cold or raw food in winter",
    ],
    nutricion: [
      "Salty flavor in moderation · seaweed, miso, oily fish, shellfish",
      "Black and dark · black beans, black sesame, blueberries, mulberry",
      "Walnuts, chia seeds, chestnuts · they nourish the kidney and the Jing",
      "Go easy on: salt, coffee, alcohol and very cold or raw food",
    ],
  },
};

/* ─── DESEQUILIBRIOS (Test 3) ─────────────────────────────── */
export const RECS_DESEQUILIBRIOS_EN: Record<string, Recs> = {
  "Madera": {
    infusiones: [
      "Mei Gui Hua (rose) + Bo He · unblocks liver Qi gently",
      "Chen Pi (tangerine peel) · moves the Qi, eases tension in the ribs",
      "Ju Hua (chrysanthemum) · cools liver Heat that is rising",
    ],
    hierbas: [
      "Chai Hu (Bupleurum) + Bai Shao · the classic base of Xiao Yao San",
      "Xiang Fu (Cyperus rotundus) · the master regulator of stagnant Qi",
      "Yu Jin (Curcuma aromatica) · moves Qi and Blood, drains liver Heat",
      "Chuan Xiong (Ligusticum chuanxiong) · moves Blood and Qi actively",
    ],
    estiloDeVida: [
      "Hard aerobic exercise: running, swimming, cycling (30–45 min a day)",
      "Dance or martial arts, to let the tension out of your body",
      "An emotions journal: name the anger and the frustration, and say them",
      "In bed before 11 p.m.; the liver works from 11 p.m. to 3 a.m.",
    ],
    nutricion: [
      "Mildly sour flavor · lemon, plum, rosehip, umeboshi vinegar",
      "Bitter greens · thistle, endive, dandelion, escarole",
      "Turmeric, saffron · seasonings that move the Qi and the Blood of the liver",
      "Stay away from: alcohol, saturated fat, fried food, processed or pungent dishes",
    ],
  },

  "Fuego": {
    infusiones: [
      "Lian Zi Xin (lotus heart) · clears heart Heat, settles the Shen",
      "Suan Zao Ren (Ziziphus) · nourishes the heart, mildly sedating, better sleep",
      "Passionflower + linden (the Western version) · settles the nervous system",
    ],
    hierbas: [
      "Suan Zao Ren (Ziziphus jujuba) · the Suan Zao Ren Tang formula, for insomnia",
      "Bai Zi Ren (Platycladus orientalis) · nourishes the heart, settles the Shen",
      "Yuan Zhi (Polygala tenuifolia) · connects heart and kidney, settles the mind",
      "Dan Shen (Salvia miltiorrhiza) · gets the Blood moving, cools the heart",
    ],
    estiloDeVida: [
      "No screens for an hour before bed; in bed before 10:30 p.m.",
      "Yin meditation or Yoga Nidra before lying down",
      "The 4-7-8 breath, to bring the sympathetic system down",
      "No caffeine after 1 p.m., and no pungent food or alcohol at night",
    ],
    nutricion: [
      "Cooling bitter flavor · pure cacao, lettuce, chicory, rose petals",
      "Cooling food · cucumber, melon, tofu, duck, celery, sprouts",
      "Lotus seeds, mild fruit in season · they cool the Heat of the heart",
      "Stay away from: caffeine, alcohol, pungent food and sugar in the afternoon and evening",
    ],
  },

  "Tierra": {
    infusiones: [
      "Sheng Jiang (ginger) + Da Zao (date) · warms the spleen and the Center",
      "Yi Yi Ren (Coix), simmered · drains the inner Dampness of the spleen",
      "Dang Shen (Codonopsis) · a gentle tonic for spleen Qi without too much heat",
    ],
    hierbas: [
      "Ren Shen (Panax ginseng) · tonifies Yuan Qi and spleen, the base of Si Jun Zi Tang",
      "Bai Zhu (Atractylodes macrocephala) · dries Dampness, strengthens the spleen",
      "Fu Ling (Poria cocos) · drains inner Dampness, nourishes the heart",
      "Gan Cao (Glycyrrhiza uralensis) · harmonizes the Center and softens formulas",
    ],
    estiloDeVida: [
      "Warm meals at fixed times; no late dinners, nothing cold or raw",
      "Chew slowly: 20–30 chews per mouthful",
      "Tai Chi or Qi Gong: it moves the spleen Qi without spending it",
      "Worry less, and stop chewing the same thought over and over",
    ],
    nutricion: [
      "Warm grains · rice, millet, cooked oats, pearl barley",
      "Cooked roots · carrot, sweet potato, turnip, parsnip, beet",
      "Red date + cooked ginger · they tonify the Center and the spleen directly",
      "Cut out: raw food, cold smoothies, dairy, sugar and eating in a hurry",
    ],
  },

  "Metal": {
    infusiones: [
      "Huang Qi (Astragalus) · builds up the Wei Qi and the lung from the inside",
      "Pear + Bai He (lily), simmered · moistens the lung, soothes a dry cough",
      "Jie Geng (Platycodon) · opens the lung, a mild expectorant",
    ],
    hierbas: [
      "Huang Qi (Astragalus membranaceus) · tonifies the Wei Qi and the defensive Qi",
      "Bai He (Lilium brownii) · lung Yin, the sadness of the lung, settles the Shen",
      "Mai Men Dong (Ophiopogon japonicus) · moistens the lining of the lung",
      "Dong Chong Xia Cao (Cordyceps sinensis) · tonifies lung and kidney",
    ],
    estiloDeVida: [
      "Breathing exercises: pranayama, qigong, 10 min every morning",
      "Walks in open country: oxygen, and contact with the world outside",
      "A humidifier at home if the air is very dry or the heating is on",
      "Let the sadness and the grief be said, instead of holding them in",
    ],
    nutricion: [
      "Pear cooked with honey · it moistens the lung and soothes the cough",
      "Almonds, flax seeds · they nourish the lining of the lung and the skin",
      "Mild cooked garlic and onion · they clear the lung and build the Wei Qi",
      "Stay away from: tobacco, dry rooms, very cold, very pungent or sour food",
    ],
  },

  "Agua": {
    infusiones: [
      "Wu Wei Zi (Schisandra) · holds on to the Jing, a deep adaptogen",
      "Gou Qi Zi (goji) + black sesame · nourishes the Yin and the Jing of the kidney",
      "He Tao Ren (walnut) simmered with honey · warms the Yang of the kidney",
    ],
    hierbas: [
      "Shu Di Huang (prepared Rehmannia) · kidney Jing, Liu Wei Di Huang Wan",
      "He Shou Wu (Polygonum multiflorum) · nourishes the Jing and the Blood, longevity",
      "Rou Cong Rong (Cistanche tubulosa) · kidney Yang, vitality and will",
      "Du Zhong (Eucommia ulmoides) · kidney Yang and lower back, strengthens the bones",
    ],
    estiloDeVida: [
      "Moxibustion on Ren 4 (Guan Yuan), KD 3 (Tai Xi) and Du 4 (Ming Men)",
      "Sleep before 10 p.m.; the kidney recovers from 10 p.m. to 2 a.m.",
      "Keep your lower back warm; no cold and no draft on your back",
      "Less sex while you are deeply worn out",
      "Grounding meditation: conscious breathing low in the belly",
    ],
    nutricion: [
      "Black sesame, black beans · they nourish the Jing and the Yin of the kidney",
      "Walnuts, chestnuts, sunflower seeds · they warm and settle the Yang of the kidney",
      "Long-simmered bone broth (4–8 h) · it draws out minerals that feed the Jing and the bones",
      "Go easy on: salt, coffee, alcohol and very cold or raw food",
    ],
  },
};
