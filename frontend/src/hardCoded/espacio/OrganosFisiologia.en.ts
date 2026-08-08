import type { Organo } from "./OrganosFisiologia";

/**
 * Los ocho órganos de Fisiología · Mi Espacio, en INGLÉS.
 *
 * Aquí va SOLO el texto, emparejado por el `id` del órgano. El `umbral` (las
 * respuestas «Sí» que hacen falta para dar desequilibrio), el orden y los
 * propios `id` viven únicamente en el fichero español: si se duplicaran aquí,
 * bastaría cambiar un umbral en un idioma y no en el otro para que el mismo test
 * diera resultados distintos según el idioma.
 *
 * Lo que falte en este mapa se muestra en español, órgano por órgano
 * (ver `useOrganosFisiologia`).
 */
export type OrganoTexto = Pick<Organo, "nombre" | "descripcionCorta" | "preguntas" | "resultado">;

export const organosFisiologiaEn: Record<string, OrganoTexto> = {
  cerebro: {
    nombre: "Brain",
    descripcionCorta: "Command center of the nervous system",
    preguntas: [
      "Do you find it hard to concentrate, or does your mind often feel foggy?",
      "Do you get recurring headaches?",
      "Is your sleep poor or not enough?",
      "Do you feel anxious or stressed chronically?",
      "Do you have episodes of frequent forgetfulness or mental confusion?",
    ],
    resultado: {
      titulo: "Your brain is asking for more calm and nourishment",
      descripcion: "Brain fog, insomnia and chronic stress are signs that your nervous system is being pushed too hard. It needs rest, adaptogens and natural anti-inflammatories.",
      plantas: [
        { nombre: "Ashwagandha", uso: "An adaptogen that lowers cortisol and sharpens concentration. As powder or a capsule in the morning." },
        { nombre: "Ginkgo biloba", uso: "Improves blood flow to the brain and memory. As an infusion or a capsule on an empty stomach." },
        { nombre: "Rosemary", uso: "Stimulates circulation in the brain. Smell the fresh plant or use it as an infusion." },
        { nombre: "Passionflower", uso: "Calms the nervous system and improves sleep. As an infusion before bed." },
        { nombre: "Turmeric with black pepper", uso: "Anti-inflammatory for the brain. Add it to your food every day to protect your neurons." },
      ],
    },
  },
  corazon: {
    nombre: "Heart",
    descripcionCorta: "The engine that drives blood through your whole body",
    preguntas: [
      "Do you often feel palpitations or an irregular heartbeat?",
      "Do you get tired from efforts that never used to tire you?",
      "Do you feel pressure in your chest, or short of breath?",
      "Are your hands and feet usually cold?",
      "Do you live with chronically high levels of stress or anxiety?",
    ],
    resultado: {
      titulo: "Your heart needs more calm and circulatory support",
      descripcion: "Palpitations, fatigue and chronic stress are signs that your cardiovascular system is under pressure. Small natural changes can make a big difference here.",
      plantas: [
        { nombre: "Hawthorn", uso: "Tones the heart and steadies its rhythm. As an infusion twice a day." },
        { nombre: "Raw garlic", uso: "Lowers blood pressure and improves circulation. One clove on an empty stomach or with meals." },
        { nombre: "Ginger", uso: "Improves circulation and lowers inflammation in the vessels. Grated into an infusion or into your food." },
        { nombre: "Pure cacao", uso: "Rich in flavonoids that protect the heart. One spoonful in hot water, no sugar." },
        { nombre: "Pumpkin seeds", uso: "Rich in magnesium: they steady the heart rhythm and relax the muscles. A handful a day." },
      ],
    },
  },
  pulmones: {
    nombre: "Lungs",
    descripcionCorta: "They trade oxygen for carbon dioxide",
    preguntas: [
      "Do you cough often without having a cold?",
      "Do you find it hard to breathe deeply?",
      "Do you have recurring or chronic mucus?",
      "Does your chest feel heavy or tight?",
      "Are you regularly exposed to polluted air, dust or smoke?",
    ],
    resultado: {
      titulo: "Your lungs need clearing out and some support",
      descripcion: "A chronic cough, mucus and difficulty breathing mean your airways are inflamed or congested. Expectorant and anti-inflammatory plants are your allies here.",
      plantas: [
        { nombre: "Thyme", uso: "Expectorant and a respiratory antiseptic. As an infusion 3 times a day with honey." },
        { nombre: "Oregano", uso: "A natural antimicrobial. Diluted oregano oil, or an infusion of the dried herb." },
        { nombre: "Ginger with lemon", uso: "Anti-inflammatory and loosens mucus. As a hot infusion with lemon and honey every morning." },
        { nombre: "Eucalyptus", uso: "A powerful decongestant. Inhale the steam from hot water with eucalyptus leaves." },
        { nombre: "Licorice", uso: "Soothes the cough and protects the lining of your airways. A mild infusion, in moderation." },
      ],
    },
  },
  higado: {
    nombre: "Liver",
    descripcionCorta: "The great purifier and manager of nutrients",
    preguntas: [
      "Do you often feel tired, even after sleeping well?",
      "Is your skin dull, yellowish or blotchy?",
      "Do you feel heaviness or discomfort on the right side of your abdomen?",
      "Do you get heavy digestion, gas or frequent bloating?",
      "Do you regularly have alcohol, medication or heavily processed food?",
    ],
    resultado: {
      titulo: "Your liver is overloaded",
      descripcion: "The liver filters everything that comes into your body. Fatigue, dull skin and slow digestion are signs that it needs help to clear itself out and regenerate.",
      plantas: [
        { nombre: "Milk thistle", uso: "The liver-protecting plant, above all others. As an infusion or a capsule on an empty stomach each morning." },
        { nombre: "Dandelion", uso: "Stimulates bile production and helps the liver clear itself. As an infusion before meals." },
        { nombre: "Turmeric", uso: "Anti-inflammatory, and helps the liver regenerate. In your food with black pepper, which boosts how much you absorb." },
        { nombre: "Lemon on an empty stomach", uso: "Wakes up the liver and the gallbladder. The juice of half a lemon in warm water every morning." },
        { nombre: "Artichoke", uso: "Protects and regenerates liver tissue. As an infusion of the leaves, or simply eaten." },
      ],
    },
  },
  estomago: {
    nombre: "Stomach",
    descripcionCorta: "It breaks food down into its simplest forms",
    preguntas: [
      "Do you often get burning or acid reflux?",
      "Do you feel nauseous or heavy after eating?",
      "Does your stomach usually swell up after meals?",
      "Do you have episodes of reflux?",
      "Do you eat under stress, very fast, or at irregular times?",
    ],
    resultado: {
      titulo: "Your stomach needs calm and digestive support",
      descripcion: "Burning, acidity and heaviness after eating point to inflammation of the stomach lining. Digestive, soothing plants can bring back the balance and protect that lining.",
      plantas: [
        { nombre: "Chamomile", uso: "Anti-inflammatory and soothing for the stomach lining. As an infusion after every meal." },
        { nombre: "Ginger", uso: "Gets digestion going and settles nausea. Grated into an infusion or into your food." },
        { nombre: "Aloe vera", uso: "Heals and soothes the stomach lining. Pure gel (1–2 spoonfuls) on an empty stomach." },
        { nombre: "Deglycyrrhizinated licorice (DGL)", uso: "Protects the stomach lining from acid. In capsules before meals." },
        { nombre: "Flaxseed", uso: "Forms a protective layer over the irritated lining. A spoonful in cold water on an empty stomach." },
      ],
    },
  },
  intestinos: {
    nombre: "Intestines",
    descripcionCorta: "Your second brain, and home to your microbiome",
    preguntas: [
      "Do you often get constipation or diarrhea?",
      "Do you feel bloated and gassy after eating?",
      "Is your digestion slow, or do you feel unwell after meals?",
      "Do you notice your mood getting worse when your digestion is off?",
      "Do you eat little fiber, or a lot of ultra-processed food?",
    ],
    resultado: {
      titulo: "Your microbiome needs rebalancing",
      descripcion: "Your intestines are your second brain. Bloating, constipation and mood swings are signs that your microbiome is out of balance and your gut transit needs support.",
      plantas: [
        { nombre: "Fennel", uso: "Cuts down gas and calms intestinal spasms. As an infusion after meals." },
        { nombre: "Psyllium", uso: "Regulates gut transit in both directions. A spoonful in plenty of water before eating." },
        { nombre: "Peppermint", uso: "Relaxes the intestinal muscle and reduces gas. As an infusion between meals." },
        { nombre: "Ginger", uso: "Gets the gut moving and calms inflammation of its lining." },
        { nombre: "Sauerkraut or kefir", uso: "Natural probiotics that restore your gut microbiome. Small amounts, daily." },
      ],
    },
  },
  rinones: {
    nombre: "Kidneys",
    descripcionCorta: "They filter your blood and balance your water",
    preguntas: [
      "Do you get discomfort low in your back (not from muscle)?",
      "Do you urinate little, with difficulty, or with a strong smell?",
      "Do you retain fluid (swollen legs, ankles or face)?",
      "Do you drink less than 1.5 liters of water a day?",
      "Is your diet high in salt, animal protein or processed food?",
    ],
    resultado: {
      titulo: "Your kidneys need more water and cleaning out",
      descripcion: "Your kidneys filter your blood non-stop. Fluid retention, low back discomfort and concentrated urine mean they need more hydration and some cleansing plants.",
      plantas: [
        { nombre: "Horsetail", uso: "A diuretic that helps the kidneys clear out. As an infusion 2–3 times a day between meals." },
        { nombre: "Dandelion", uso: "A natural diuretic that doesn't deplete your potassium. As an infusion, or the fresh leaves in a salad." },
        { nombre: "Fresh parsley", uso: "A powerful kidney cleanser. As an infusion of the fresh herb on an empty stomach, in moderation." },
        { nombre: "Orthosiphon (Java tea)", uso: "A mild diuretic that cleanses the urinary tract. As an infusion on an empty stomach." },
        { nombre: "Water with lemon and cucumber", uso: "Hydrating, alkalizing and cleansing. At least 2 liters a day, always." },
      ],
    },
  },
  bazo: {
    nombre: "Spleen",
    descripcionCorta: "Guardian of your blood and your immune system",
    preguntas: [
      "Do you get sick often (colds, recurring infections)?",
      "Do you feel tired especially after eating?",
      "Do you have anemia or low iron?",
      "Do you feel heaviness or discomfort on the left side of your abdomen?",
      "Do you get frequent energy crashes or sugar spikes?",
    ],
    resultado: {
      titulo: "Your spleen and your immunity need backup",
      descripcion: "The spleen is the guardian of your blood and your immune system. Fatigue after eating, recurring infections and anemia are signs that it needs support.",
      plantas: [
        { nombre: "Echinacea", uso: "Stimulates the immune system. In capsules or as an infusion at the first symptoms, or preventively in autumn." },
        { nombre: "Astragalus", uso: "An adaptogen that strengthens immunity over the long run. In capsules in the morning." },
        { nombre: "Elderberries", uso: "Antiviral and immune-boosting. As a syrup or an infusion, especially in the cold season." },
        { nombre: "Turmeric with black pepper", uso: "Anti-inflammatory, and cleansing for the blood. In your food, daily." },
        { nombre: "Nettle", uso: "Rich in iron your body can actually use — ideal for anemia. As an infusion on an empty stomach for several weeks." },
      ],
    },
  },
};
