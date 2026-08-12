import type { Elemento } from "./tcmRecorrido";

/**
 * Las diez relaciones entre los cinco elementos, en INGLÉS.
 *
 * Aquí va SOLO la prosa de cada relación, indexada por el elemento de ORIGEN.
 * Qué genera a qué y qué controla a qué (CICLO_SHENG y CICLO_KE) vive únicamente
 * en `tcmRecorrido.ts`: duplicar aquí la rueda sería la forma más rápida de que
 * la Madera generara el Fuego en un idioma y otra cosa en el otro.
 *
 * Lo que falte se lee en español, relación a relación (ver `useSheng` / `useKe`).
 * Misma regla que los cinco elementos y que los cómics.
 *
 * Al traducir:
 *  · Los términos de la tradición NO se traducen y van con mayúscula: Qi, Yin,
 *    Yang, Sheng, Ke. Los cinco elementos también (Wood, Fire, Earth, Metal,
 *    Water): son un término técnico.
 *  · «la Sangre» de la MTC es "the Blood", con mayúscula: no es la sangre del
 *    análisis. Los órganos, en cambio, van en minúscula (the liver, the spleen)
 *    porque aquí se habla del órgano físico.
 *  · «la Vida» con mayúscula intencionada se queda "Life".
 */

/** «X genera Y» (Sheng), indexado por el elemento origen X. Un párrafo por
 *  elemento del array, en el mismo orden que el español. */
export const SHENG_EXPLICACION_EN: Record<Elemento, string[]> = {
  // Wood generates Fire (liver → heart)
  madera: [
    "Wood generates Fire, which tells us that the liver has an influence on the heart, and that inner expansion and growth generate love and passion.",
    "The liver is the great regulator of the blood: it can hold blood back so as not to overload the heart. The liver is in charge of managing lipids, glucose and cholesterol. We all know that too much cholesterol in the blood affects the heart sooner or later, so a well-regulated liver supports a healthy metabolism.",
    "The liver also creates the enzymes that let the blood do its job, and it makes plasma possible.",
    "If the liver is well regulated, the heart is protected and the blood is strong.",
  ],
  // Fire generates Earth (heart → spleen)
  fuego: [
    "Fire generates Earth. In our organs this means that the state of the heart affects the spleen; emotionally, that passion and love generate stability.",
    "The heart's job is to pump blood to the whole body; the spleen's job is to filter blood cells, making sure only the flexible, healthy ones go back into circulation.",
    "In Traditional Chinese Medicine, the spleen turns nutrients into Qi. That makes sense, because the spleen has been shown to use nutrients to make more blood.",
    "Tradition also says that the spleen keeps the blood inside the arteries and veins. Remember that the spleen is considered part of the immune system, so if it filters toxins out of the blood properly it will lower inflammation, the process in which blood leaves the arteries to enter the organs.",
    "In short, the heart and the blood it pumps have a direct influence on the work the spleen does to keep us in balance.",
  ],
  // Earth generates Metal (spleen → lung)
  tierra: [
    "Earth generates Metal. In our organs this has to do with the spleen influencing the lung; in our emotions, with transformation and nourishment generating inner peace.",
    "Both are important immune organs. The spleen filters the blood and protects us. The filtered blood reaches the lung again, where CO2 is exchanged for fresh oxygen so it can keep circulating.",
    "The spleen makes sure only healthy cells can go back into circulation, and that is essential for carrying oxygen. The spleen makes sure the blood is clean, which leaves fewer toxins and fewer hazards for the lungs, letting them deal with the toxins that come in with the breath instead of also having to handle the ones already in the body.",
    "A spleen that works properly has a direct influence on our lungs.",
  ],
  // Metal generates Water (lung → kidney)
  metal: [
    "Metal generates Water, which means that our inner peace generates wisdom and that our lungs have an influence on our kidneys.",
    "How is that possible? When Chinese Medicine speaks of the kidney, it isn't always speaking of the kidneys, but of the adrenal glands, those glands that sit on top of the kidneys producing hormones. That is why the breath is directly related to the release of cortisol.",
    "If we keep our breathing calm and quiet, the body will have no reason to get stressed and so no need to release cortisol, which keeps the inner balance.",
  ],
  // Water generates Wood (kidney → liver)
  agua: [
    "Water generates Wood, which means that the kidney has an influence on the liver, and that intuition and wisdom generate growth.",
    "The more cortisol we produce —and remember that this cortisol comes indirectly from the kidneys— the more the liver has to work, since it has more hormones to manage.",
    "If the kidney doesn't need to release stress hormones like adrenaline or cortisol and can simply get on with filtering the blood, the liver will be less overloaded and free to work efficiently.",
    "Remember too that the kidneys regulate the electrolytes in the blood and the blood pressure. That can affect our liver, because the liver is the great regulator of the blood and of the enzymes travelling in it.",
    "Kidneys that work properly leave the liver at peace, ready to do the job it has to do.",
  ],
};

/** «X controla Y» (Ke), indexado por el elemento origen X. */
export const KE_EXPLICACION_EN: Record<Elemento, string[]> = {
  // Wood controls Earth (liver → spleen)
  madera: [
    "Wood controls Earth, which means that the liver has an influence on the spleen, and that anger wears stability down.",
    "The liver detoxifies our blood, but when that detoxification isn't enough, the load of toxins the spleen has to deal with goes up. The spleen isn't built for that load, so it gets overloaded and, as a result, worn down.",
    "One of the ways of overloading the liver is with too much anger. Every time we're angry, we produce large amounts of cortisol in order to express that anger.",
    "So one of the ways of taking care of yourself is finding what you're angry about and being able to work with it, so that you don't have to hurt yourself.",
  ],
  // Earth controls Water (spleen → kidney)
  tierra: [
    "Earth controls Water, which means that the spleen controls the kidneys, and that worry brings fear.",
    "The spleen is in charge of detoxifying our blood, but if that isn't enough or it's overloaded, it directly affects our kidneys, which also filter the blood.",
  ],
  // Water controls Fire (kidney → heart)
  agua: [
    "Water controls Fire, so the kidneys control the heart, and fear causes mental over-agitation.",
    "The kidney regulates electrolytes, and those electrolytes regulate the contraction of the heart. So when that regulation isn't right, or the kidney is overloaded, irregular contractions can appear.",
    "Restless kidneys make for an arrhythmic heart.",
  ],
  // Fire controls Metal (heart → lung)
  fuego: [
    "Fire controls Metal, which means that the heart has an influence on the lungs, and that mental agitation can bring sadness, grief or attachment.",
    "How often the heart pumps blood affects how often the blood cells pick up oxygen in the lungs. So if a heart beats arrhythmically, lung function and the exchange of carbon dioxide for oxygen will be affected.",
    "The conclusion is that an arrhythmic heart will affect the oxygenation of every cell in the body.",
  ],
  // Metal controls Wood (lung → liver)
  metal: [
    "Metal controls Wood, which means that the lungs control the liver, and that too much grief will bring a lack of direction in Life, and anger.",
    "How fast and how we breathe affects our body immediately, through the nervous system.",
    "If we breathe irregularly or restlessly, that generates stress, which makes our liver work harder to manage all that cortisol and adrenaline. That expression of mental confusion feeds our physical decline back to us.",
    "A steady, sustained breath taken through the nose lets us remind our body that we're safe.",
  ],
};
