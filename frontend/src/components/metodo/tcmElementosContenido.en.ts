import type { ContenidoElementoRico } from "./tcmElementosContenido";
import type { Elemento } from "./tcmRecorrido";

/**
 * El contenido rico de los cinco elementos (Wu Xing), en INGLÉS.
 *
 * Aquí va SOLO el texto, emparejado por la clave del elemento. El `id`, el
 * `hanzi`, las fotos, el orden y el mini-test viven únicamente en el fichero
 * español: si se duplicaran aquí, bastaría con tocar uno de los dos para que el
 * mismo elemento contara una cosa en un idioma y otra en el otro.
 *
 * Lo que falte en este mapa se muestra en español, elemento a elemento
 * (ver `useContenidoElemento` en tcmElementosEn.ts). Es la misma regla que ya
 * usan los órganos de Fisiología y los cómics.
 *
 * Al traducir:
 *  · Los términos de la tradición NO se traducen y van con mayúscula: Qi, Yin,
 *    Yang, Shen, Jing, Zang, Fu, Wei Qi, Dao, Su Wen, Cou Li, San Jiao.
 *  · Los cinco elementos van con mayúscula (Wood, Fire, Earth, Metal, Water):
 *    son un término técnico, no la madera de una mesa.
 *  · «la Sangre» y «la Esencia» de la MTC también: Blood, Essence. No son la
 *    sangre del análisis ni una esencia cualquiera.
 *  · «la Vida» con mayúscula intencionada se queda "Life".
 */
export type ElementoTexto = Pick<
  ContenidoElementoRico,
  | "nombre" | "intro" | "rige" | "funciones" | "equilibrio" | "exceso"
  | "deficiencia" | "cierre" | "equilibrar" | "desequilibrio" | "guia"
>;

const wood: ElementoTexto = {
  nombre: "Wood",
  intro: [
    "Wood stands for growth, rising, spreading and flow.",
    "It is the energy of spring: everything that sprouts, expands and looks to move freely belongs to Wood.",
    "Its keywords are growth, direction and renewal.",
    "When Wood is in balance, everything circulates without obstacles, letting the Qi flow harmoniously and Life follow its natural course.",
  ],
  rige: [
    { clave: "Zang organ (Yin)", valor: "the liver" },
    { clave: "Fu organ (Yang)", valor: "the gallbladder, connected inwardly and outwardly with the liver" },
    { clave: "Tissue", valor: "the tendons" },
    { clave: "Outer sign", valor: "the nails, whose shine and strength reflect the state of the liver" },
    { clave: "Sense opening", valor: "the eyes, with a special connection to the liver" },
    { clave: "Body fluid", valor: "tears" },
    { clave: "Emotion", valor: "anger and frustration; in balance, assertiveness and the ability to set limits" },
    { clave: "Color", valor: "blue-green" },
    { clave: "Flavor", valor: "sour" },
    { clave: "Season", valor: "spring" },
    { clave: "Voice", valor: "shouting, or an explosive voice" },
    { clave: "Movement", valor: "expansion outward, like a tree growing" },
  ],
  funciones: [
    {
      titulo: "It governs the free flow of Qi",
      texto:
        "The liver keeps the movements of the Qi in balance: when it is in harmony, the Qi circulates smoothly, Qi and Blood stay balanced and the body's functions work normally. A liver with flowing Qi also makes for a flowing emotional mind, and it influences the circulation of Blood and fluids, the secretion of bile, the rising of the pure and the descending of the turbid from the spleen, and menstruation and spermiation.",
    },
    {
      titulo: "It stores the Blood",
      texto:
        "The liver acts as a reservoir of Blood. During activity, it sends Blood out to the periphery to nourish the tissues and allow movement. In rest, emotional calm or cold, the periphery needs less Blood and the surplus returns to the liver to be stored.",
    },
    {
      titulo: "It governs the tendons",
      texto:
        "The Su Wen states: «The liver governs the tendons.» The Qi and Blood of the liver nourish the tendons, giving them strength, flexibility and the capacity for movement. A long-standing liver disease can bring on tendon disorders, and a lasting problem in the tendons can also end up affecting the liver.",
    },
  ],
  equilibrio: [
    "Wood in balance is visionary, brave and flexible, good at planning and at adapting to change.",
    "The Qi flows freely, allowing harmonious movement both physically and emotionally. There is a healthy ambition, able to drive growth without having to impose itself or act out of aggression.",
  ],
  exceso: [
    "When Wood is in excess, the energy rises out of control. It can show up as outbursts of anger, rage, impatience and irritability, with a constant feeling of being blocked or in a hurry.",
    "Muscle tension in the neck, jaw and shoulders is common, along with red or bloodshot eyes and headaches that climb upward. The voice can turn loud, domineering or explosive, with controlling behavior and over-competitiveness.",
  ],
  deficiencia: [
    "When Wood is deficient, the drive to move forward is missing. There can be a lack of initiative, difficulty finding a clear direction or making decisions. You get discouraged easily, are afraid to act, and may show low motivation, shyness and indecision.",
    "Physically there can be tired eyes, blurred vision, weak tendons, cramps or tremors. Vision can be affected both literally and figuratively, making it hard to picture yourself in the future.",
  ],
  equilibrar: [
    "The sour flavor, tied to the blue-green color, is astringent and can hold back sweating. In Chinese medicine it is used with judgment, to consolidate and preserve the body's fluids.",
    "Wood needs movement: it thrives on regular physical activity and on handling anger and frustration consciously, and it suffers under sustained emotional repression, which blocks its natural movement.",
    "The eyes and the tendons are Wood's main thermometer: trouble with your sight, tension in the tendons or a loss of flexibility tell you how the liver is doing.",
    "When looking at the face, a blue-green tint in certain areas can point to a liver disorder or an imbalance in Wood.",
  ],
  desequilibrio: [
    "When liver Qi loses its ability to flow, stagnation appears: distension, fullness or pain in the chest, the sides below the ribs, the breasts, the lower belly or the external genitals.",
    "If the liver doesn't promote the free flow of Qi, it affects the circulation of Blood and fluids, the secretion of bile, digestion (the rising of the pure and the descending of the turbid from the spleen), menstruation and spermiation.",
    "A sour taste in the mouth usually points to hyperactivity of liver Fire, especially when it invades the stomach: the built-up heat rises toward the mouth and produces that sour feeling.",
  ],
  guia: {
    nutricion: [
      "Bitter greens: dandelion, arugula or kale",
      "Sour foods: lemon, vinegar or pickles",
      "Fresh herbs: mint, basil and parsley",
      "Sprouts",
      "Green tea",
    ],
    estiloDeVida: [
      "Movement in the morning: stretching, Qi Gong or martial arts",
      "Creative expression: planning, writing, giving shape to new projects",
      "Healthy limits, so frustration and resentment don't pile up",
    ],
    descanso: "Around 10:30 p.m., when the energy of Wood starts to unwind and recover.",
    ejercicio: ["Dynamic but not aggressive activity, with continuous, flexible movement, like the growth of spring"],
    terapia: ["Vision maps", "Coaching", "Walks among trees or out in nature"],
    afirmacion: "I move forward with flexibility.",
  },
};

const fire: ElementoTexto = {
  nombre: "Fire",
  intro: [
    "Fire stands for warmth, for what burns, and for rising.",
    "It is the energy of summer: expansive, bright and ascending, climbing like a flame.",
    "In the body, Fire is the force that warms, drives and lights up consciousness, feeding vitality, communication and presence.",
    "Its keywords are expression, connection and spirit.",
  ],
  rige: [
    { clave: "Zang organ (Yin)", valor: "the heart, the «monarch organ», which governs the Shen (the mind) and coordinates the rest of the organs" },
    { clave: "Fu organ (Yang)", valor: "the small intestine" },
    { clave: "Tissue", valor: "the blood vessels" },
    { clave: "Outer sign", valor: "the complexion, whose color and glow reflect the state of the heart" },
    { clave: "Sense opening", valor: "the tongue, tied to speech, expression and the state of the Shen" },
    { clave: "Body fluid", valor: "sweat" },
    { clave: "Emotion", valor: "joy and, in excess, mania; in balance, presence and serenity" },
    { clave: "Color", valor: "red" },
    { clave: "Flavor", valor: "bitter" },
    { clave: "Season", valor: "summer" },
    { clave: "Voice", valor: "laughter, or an over-excited voice" },
    { clave: "Movement", valor: "rising, like the flame of a fire" },
  ],
  funciones: [
    {
      titulo: "It controls the Blood and the blood vessels",
      texto:
        "The heart pushes the Blood so it circulates through the whole body, reaching every tissue and organ. The Blood travels through the vessels thanks to that steady push, nourishing and moistening every part of the body so it can work normally.",
    },
    {
      titulo: "It rules the spirit (Shen)",
      texto:
        "The heart houses and governs the Shen: the spirit, consciousness, the mind, and the activities of thought, memory, emotion and mental clarity. That is why it is the «monarch organ», the one that directs the body physically, mentally and emotionally.",
    },
  ],
  equilibrio: [
    "Fire in balance is warm, expressive and charismatic. You relate to others from a place of authenticity, enjoying healthy communication and intimacy.",
    "Physically there is usually good rest, a steady heart rhythm and a general sense of vitality and presence.",
  ],
  exceso: [
    "When Fire is in excess, the energy rises out of control: restlessness, anxiety, panic or insomnia. Talking too much, nervous laughter or a constant need for stimulation and social contact are common.",
    "There can also be palpitations, heat in the chest or the face, over-attachment, jealousy and intense or dramatic reactions, with a tendency to over-socialize.",
  ],
  deficiencia: [
    "When Fire is deficient, the ability to connect with yourself and with others drops: flattened emotions, difficulty showing affection or bonding, a feeling of loneliness or of not being understood.",
    "Physically, cold hands and feet, fatigue, forgetfulness, a lack of enthusiasm, a quiet voice, poor circulation and the feeling of not being heard are all common.",
  ],
  cierre: "Fire shows itself in the way we relate to others, express what we feel and share our presence with them.",
  equilibrar: [
    "The bitter flavor, tied to the color red, clears heat. In Chinese medicine it is the flavor that helps bring down an excess of Fire.",
    "The Shen lives in the heart, so mental and emotional rest is essential. Over-stimulation, too much activity, stress or too little rest all agitate the Shen.",
    "The complexion and the tongue are the windows of the heart: a very red face or an altered tongue tell you how Fire is doing.",
    "Joy is its emotion: in balance it nourishes the Shen; turned into euphoria or over-excitement, it scatters the Qi and weakens the heart.",
  ],
  desequilibrio: [
    "A bitter taste in the mouth usually points to a relative exuberance of heart Fire (an excess of heat).",
    "If the heart doesn't rule the Shen: difficulty concentrating, mental restlessness, confusion or emotional imbalance.",
    "If it doesn't pump the Blood strongly, it doesn't nourish or moisten the tissues: poor circulation, weakness or fatigue.",
    "The complexion reflects the heart: an excessively red face can signal an excess of Fire.",
  ],
  guia: {
    nutricion: [
      "Hydrating foods: cucumber, watermelon and lettuce",
      "Bitter foods: romaine lettuce, cacao and quinoa",
      "Red fruits: cherries and hawthorn berries",
      "Cooling infusions: chrysanthemum and hibiscus",
    ],
    estiloDeVida: [
      "Put intimacy and genuine friendships first",
      "Meditation or other ways of calming and cooling the mind",
      "Let shared time be joyful and not draining",
    ],
    descanso: "Before 11 p.m., so the heart can rest and the Shen stays steady.",
    ejercicio: ["Dancing", "Gentle cardio", "Strength training", "Movement out of joy, not out of duty"],
    terapia: ["Laughter", "Singing", "Shared rituals that build connection"],
    afirmacion: "My joy is serene.",
  },
};

const earth: ElementoTexto = {
  nombre: "Earth",
  intro: [
    "Earth stands for the capacity to generate, transform, hold and receive.",
    "It is the center of the Five Elements, the energy that turns what we take in —food and drink— into what holds us up: Qi and Blood.",
    "Everything that nourishes, brings stability and keeps the body in balance belongs to Earth.",
    "Its keywords are nourishment, stability and inner home.",
  ],
  rige: [
    { clave: "Zang organ (Yin)", valor: "the spleen, the body's «granary», which transforms food and generates Qi and Blood" },
    { clave: "Fu organ (Yang)", valor: "the stomach" },
    { clave: "Tissue", valor: "the muscles" },
    { clave: "Outer sign", valor: "the lips, whose look reflects the state of the spleen" },
    { clave: "Sense opening", valor: "the mouth" },
    { clave: "Body fluid", valor: "thin saliva (drool)" },
    { clave: "Emotion", valor: "worry and rumination; in balance, trust and the capacity to hold others" },
    { clave: "Color", valor: "yellow" },
    { clave: "Flavor", valor: "sweet" },
    { clave: "Season", valor: "late summer, and the transitions between seasons" },
    { clave: "Voice", valor: "singing, or a melodious tone" },
    { clave: "Movement", valor: "centering and transforming" },
  ],
  funciones: [
    {
      titulo: "It governs transport and transformation",
      texto:
        "The spleen transforms and transports the nutrients from food and drink, turning them into Qi and Blood, and it regulates fluid metabolism. With strong spleen Qi, dampness, phlegm and fluid retention don't build up; when it weakens, internal dampness, phlegm and retention appear.",
    },
    {
      titulo: "It raises the pure",
      texto:
        "It lifts the nutrients drawn from food and drink up toward the heart, the lungs, the head and the eyes, where they are turned into Qi and Blood to sustain every function of the body.",
    },
    {
      titulo: "It controls the circulation of the Blood",
      texto:
        "It keeps the Blood inside the vessels, so it doesn't leak out. If this function weakens, it can lead to hemorrhage, bruising or spontaneous bleeding.",
    },
  ],
  equilibrio: [
    "Earth in balance is affectionate, responsible and keeps its feet on the ground. It gives off stability and knows how to take care of itself and of others without losing its center.",
    "Physically there is usually strong digestion, good immunity, steady energy and practical, organized thinking.",
  ],
  exceso: [
    "When Earth is in excess, the wish to care for others turns into overprotection, to the point of smothering them, controlling them and abandoning yourself. A strong need for things not to change, for control and for safety appears, along with rumination, stubbornness and difficulty letting go of old patterns.",
    "Physically, overeating, weight gain and a build-up of dampness or mucus are common.",
  ],
  deficiencia: [
    "When Earth is deficient, the ability to nourish, transform and hold drops: weak muscles, tiredness after eating, abdominal bloating, loose stools and intense sugar cravings.",
    "Emotionally there can be low self-esteem or a loss of your own center; you tend to be a people-pleaser, soaking up other people's energy and needs and forgetting about yourself.",
  ],
  cierre: "Earth shows our capacity to receive nourishment — not only from food, but also from affection, care and everything Life offers us.",
  equilibrar: [
    "The sweet flavor, tied to the color yellow, supplements Qi and Yin. We're talking about the natural, moderate sweetness of food, not an excess of sugar, which weakens the spleen and feeds dampness.",
    "Dampness is the spleen's main enemy: it helps to go easy on dairy, sugar, refined flour and fried food, and to make it easy for nutrients and fluids to be transformed properly.",
    "Earth loves regularity: steady mealtimes, eating calmly and healthy digestive habits all strengthen spleen Qi.",
    "Its emotion is worry: constant rumination weakens spleen Qi, affecting digestion and emotional balance. The lips reflect the spleen: good color and shine mean a healthy spleen.",
  ],
  desequilibrio: [
    "With spleen Qi weakened and its transport failing, the body doesn't move fluids well: internal dampness, phlegm and retention.",
    "A sweet or greasy taste in the mouth usually points to dampness obstructing the spleen, which sends turbid Qi upward.",
    "If its job of holding the Blood in weakens: bleeding, bruising or hemorrhage.",
    "If the spleen doesn't raise the pure, the nutrients don't reach the heart, the lungs, the head and the eyes, which stop being nourished.",
  ],
  guia: {
    nutricion: [
      "Warm, cooked food: soups, purées and stews",
      "Complex carbohydrates: roots, squash and tubers",
      "Legumes and whole grains",
      "Sweet, warming spices: ginger and cinnamon",
      "Probiotics and fermented food, if you tolerate them well",
    ],
    evitar: [
      "Eating anxiously or in a rush",
      "Too much raw salad, especially cold",
      "Cold or iced drinks",
      "Too many sweets, snacks and dairy (they feed dampness)",
    ],
    estiloDeVida: [
      "Routines that bring balance and safety",
      "Caring for others without neglecting your own needs",
      "Eating mindfully, enjoying the moment",
      "Keeping your spaces tidy and clear",
    ],
    descanso: "A wind-down routine in the late afternoon and evening, so body and mind can rest.",
    ejercicio: ["Walking", "Yoga", "Strength training", "Gardening, or contact with the soil"],
    terapia: ["Massage", "A supportive community where you feel accompanied and held"],
    afirmacion: "I am held, and I nourish myself.",
  },
};

const metal: ElementoTexto = {
  nombre: "Metal",
  intro: [
    "Metal stands for the capacity to purify, to descend and to draw in.",
    "It is the energy of autumn: it gathers, cleans, puts in order and lets you release what no longer serves.",
    "In the body, Metal governs the exchange with the outside: we breathe, we filter and we let go, physically and emotionally.",
    "Its keywords are structure, limits and letting go.",
  ],
  rige: [
    { clave: "Zang organ (Yin)", valor: "the lung" },
    { clave: "Fu organ (Yang)", valor: "the large intestine" },
    { clave: "Tissue", valor: "the skin and body hair" },
    { clave: "Sense opening", valor: "the nose" },
    { clave: "Body fluid", valor: "nasal mucus" },
    { clave: "Emotion", valor: "grief and sadness; in balance, acceptance and the ability to let go" },
    { clave: "Color", valor: "white" },
    { clave: "Flavor", valor: "pungent" },
    { clave: "Season", valor: "autumn" },
    { clave: "Voice", valor: "weeping, or sighing" },
    { clave: "Movement", valor: "contraction and refinement" },
  ],
  funciones: [
    {
      titulo: "It regulates and manages the body",
      texto:
        "The lung is in charge of regulating and managing a great many of the body's functions, keeping the organism in balance and the Qi circulating properly.",
    },
    {
      titulo: "It descends and purifies",
      texto:
        "It draws in the fresh air of nature, disperses air, fluids and the essence coming from the spleen downward, and clears the airways. Rising-and-dispersing and descending-and-purifying are inseparable: they are the two sides of normal breathing.",
    },
    {
      titulo: "It relates to the skin and body hair",
      texto:
        "It distributes the essential Qi that nourishes the skin and spreads the Wei Qi (defensive Qi), protecting the surface of the body. External pathogens usually invade through the skin, affecting the lung first. Skin and muscles form a continuous network (Cou Li), the body's first line of defense.",
    },
    {
      titulo: "The nose is its opening",
      texto:
        "The nose is the gateway through which the Qi of breathing comes in and goes out. It governs the sense of smell, takes part in the voice, and is the lung's sense opening.",
    },
  ],
  equilibrio: [
    "Metal in balance is disciplined, organized and morally clear. It knows how to set healthy limits, put its Life in order and let go of what has already served its purpose.",
    "Physically there is usually deep breathing, good lung capacity and a strong immune system.",
  ],
  exceso: [
    "When Metal is in excess, the need for order turns into perfectionism, rigidity and an overly critical attitude toward yourself and others. Very rigid habits appear, along with difficulty adapting and intolerance of whatever escapes your control.",
    "Physically there can be skin problems, constipation, chronic nasal congestion and a tendency to come across as cold or distant.",
  ],
  deficiencia: [
    "When Metal is deficient, a deep sadness appears, along with difficulty letting go of people, situations or experiences. A weakened immune system, shallow breathing and a feeling of disorganization.",
    "There can also be little self-love, too much influence from your surroundings and neglect of your own limits. Physically, problems with the skin and the sinuses.",
  ],
  cierre: "Metal teaches us the value of balance: too much rigidity ends up breaking what it was trying to protect, while a total lack of structure leaves Life without direction or meaning.",
  equilibrar: [
    "The pungent flavor, tied to the color white, promotes the circulation of Qi and Blood. It is the flavor that opens, mobilizes and gets the energy moving.",
    "The skin is the first line of defense and the main way in for pathogens heading toward the lung: keeping it healthy strengthens Metal and the Wei Qi.",
    "The lung's descending and purifying function is a pillar of Metal: taking care of your breathing and keeping the airways clear helps the Qi be exchanged.",
    "Grief and sadness are its emotions: learning to let go in a healthy way protects lung Qi and keeps the energy from stagnating.",
  ],
  desequilibrio: [
    "A pungent taste in the mouth can point to a Metal or lung disorder, though it isn't common in clinical practice.",
    "If the lung doesn't spread the Wei Qi to the skin, the body loses its protection and external pathogens get in more easily. If descending and purifying fail, breathing problems appear.",
    "An imbalance in Metal shows up in the skin, the body hair and the nose. A marked pallor, whitish in tone, can signal weakness of the lung or of Metal.",
  ],
  guia: {
    nutricion: [
      "White foods: daikon, garlic and onion",
      "Radishes, pears and apples",
      "Foods that moisten the lung: honey or rice congee",
      "Mushrooms and seaweed",
      "Warm ginger or licorice infusions",
    ],
    estiloDeVida: [
      "Breathing exercises and Qi Gong to expand the lung",
      "Practices of release: writing, tidying up or clearing spaces",
      "Rituals that bring meaning and help you close chapters",
    ],
    descanso: "Sleep in a deeply dark, quiet room, so your breathing can settle.",
    ejercicio: ["Pilates", "Postural work", "Strength training", "Hiking at a good pace"],
    terapia: ["Working through grief", "Conscious breathing practices"],
    afirmacion: "I let go of the past and breathe in new Life.",
  },
};

const water: ElementoTexto = {
  nombre: "Water",
  intro: [
    "Water stands for the capacity to moisten, to descend, to cool and to store.",
    "It is the energy of winter: the deep reserve, what is kept safe so that Life can carry on and start again when the time comes.",
    "In the body, Water is the root of the organism. It stands for the Essence, for what is inherited, and for the ground on which all physical, mental and spiritual growth is built.",
    "Its keywords are reserves, restoration and inner power.",
  ],
  rige: [
    { clave: "Zang organ (Yin)", valor: "the kidney, the «congenital foundation», which stores the Essence (Jing)" },
    { clave: "Fu organ (Yang)", valor: "the urinary bladder" },
    { clave: "Tissue", valor: "the bones, and the production of marrow" },
    { clave: "Outer sign", valor: "the hair, whose state reflects the strength of the Essence and of the kidney" },
    { clave: "Sense opening", valor: "the ears, and the two lower openings" },
    { clave: "Body fluid", valor: "thick saliva" },
    { clave: "Emotion", valor: "fear and terror; in balance, wisdom and will" },
    { clave: "Color", valor: "black, or a very dark blue, visible under the eyes" },
    { clave: "Flavor", valor: "salty" },
    { clave: "Season", valor: "winter" },
    { clave: "Voice", valor: "a whisper" },
    { clave: "Movement", valor: "storing, and sinking downward" },
  ],
  funciones: [
    {
      titulo: "It stores the Essence (Jing)",
      texto:
        "The kidney receives, keeps and protects the Essence. It has two parts: the prenatal Essence, inherited from your parents and the basis of embryonic development, and the postnatal Essence, drawn after birth from food, water and the energy refined by the organs.",
    },
    {
      titulo: "It governs growth, development and reproduction",
      texto:
        "The Essence of the kidney is the engine behind every stage of Life: growth, development, maturing, fertility, reproduction and the natural process of aging.",
    },
    {
      titulo: "It governs water metabolism",
      texto:
        "The Qi of the kidney takes part in the whole of water metabolism, driving and coordinating the work of the organs involved in regulating the body's fluids.",
    },
    {
      titulo: "It receives the Qi",
      texto:
        "Although the lung controls breathing, the kidney receives the pure Qi you inhale and holds it deep down, allowing breathing to be deep, even and soft. When it doesn't receive it well, the breath turns shallow.",
    },
    {
      titulo: "It governs the bones and the marrow",
      texto:
        "It provides the basis for the strength of the skeleton and the production of marrow. It opens into the ears, which is why hearing reflects the strength of the kidney and of the Essence.",
    },
  ],
  equilibrio: [
    "Water in balance brings inner stillness, a strong will and a deep steadiness. There are solid reserves of energy, with the capacity to recover and to stay calm under pressure.",
    "It usually develops a marked intuition and the confidence to face whatever Life brings.",
  ],
  exceso: [
    "When Water is in excess, fear can become paralyzing, feeding avoidance, isolation and difficulty moving forward. Fluid retention, swelling, chronic cold and a constant worry about survival are common.",
    "There can also be great mistrust, resistance to change and a need to control your surroundings.",
  ],
  deficiencia: [
    "When Water is deficient, the energy reserves run dry: low libido, early aging, hair loss, weakness in the lower back and knees, and a deep exhaustion that rest doesn't fix.",
    "Emotionally, anxiety, insecurity, hypervigilance and the feeling of always living on the edge are common, with a risk of burnout and of the bones growing weak.",
  ],
  cierre: "Water stands for our roots and for the Essence (Jing). When those reserves run out, the whole body loses its ability to hold itself up, the same way a tree dries out when its roots stop feeding it.",
  equilibrar: [
    "The salty flavor, tied to the color black, softens hard masses. It should be used in moderation: too much salt ends up weakening the very kidney it was meant to feed.",
    "Water is the great energy reserve: deep rest, respecting your recovery rhythms and avoiding chronic exhaustion all preserve the Essence (Jing).",
    "The bones, the ears and the hair are the indicators of the state of Water and of the kidney.",
    "Fear is its emotion: intense or drawn out, it consumes kidney Qi; facing it calmly and building inner safety protects its energy.",
  ],
  desequilibrio: [
    "A salty taste in the mouth usually points to kidney deficiency: with the Yang weakened, cold water rises toward the mouth.",
    "If the kidney fails to receive the Qi, breathing loses its depth, its evenness and its steadiness.",
    "If it doesn't regulate water metabolism: fluid retention, urinary problems and disorders of the bladder and the lower openings.",
    "An imbalance in Water shows up as weak bones, hearing problems and brittle hair. A dark tint around the eyes can point to a kidney disorder.",
  ],
  guia: {
    nutricion: [
      "Black or bluish foods: black beans, seaweed and blueberries",
      "Mineral-rich foods: sesame and walnuts",
      "Bone broth",
      "Warming spices: clove and garlic",
      "Fish and shellfish",
    ],
    evitar: [
      "Too much salt",
      "Settings that keep you in fear or under constant stress",
      "Overwork, dehydration and running your reserves down",
      "Too much raw or cold food, especially in winter, and too much caffeine",
    ],
    estiloDeVida: [
      "Rest deeply through the winter, respecting its rhythm",
      "Practice silence, meditation or inner calm",
      "Choose steady effort over big pushes, so your reserves last",
    ],
    descanso: "Go to bed early during the winter, so the Essence (Jing) is conserved.",
    ejercicio: ["Tai Chi", "Slow, conscious strength training"],
    terapia: ["Relationships that build trust and safety", "Trauma integration and inner work"],
    afirmacion: "Wisdom is born of stillness.",
  },
};

export const CONTENIDO_ELEMENTOS_EN: Partial<Record<Elemento, ElementoTexto>> = {
  madera: wood, fuego: fire, tierra: earth, metal, agua: water,
};
