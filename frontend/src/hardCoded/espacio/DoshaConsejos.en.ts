import type { DoshaRecs } from "./DoshaConsejos";

/**
 * Los consejos de cada doṣha, en INGLÉS.
 *
 * Emparejados por la clave del doṣha (`vata` / `pitta` / `kapha`), que es lo
 * que guarda la base de datos y no se traduce. El doṣha que no esté aquí se lee
 * entero en español (ver `useDoshaConsejos`).
 *
 * Los nombres sánscritos de las hierbas y de las prácticas (Ashwagandha,
 * Triphala, Abhyanga, Garshana, Trikatu…) no se traducen: se dicen igual en
 * inglés. Sí se traduce lo que va después del «·».
 */
export const DOSHA_CONSEJOS_EN: Record<string, DoshaRecs> = {
  vata: {
    descripcion:
      "Vata is the principle of movement: air and ether. It governs breathing, circulation and the nervous system. In balance it brings creativity, enthusiasm and lightness. Out of balance it brings anxiety, insomnia and dryness.",
    alimentacion: [
      "Warm, cooked, unctuous food · soups, stews, purées",
      "Sweet, sour and salty flavors · they balance the dryness and the cold",
      "Healthy fats · ghee, sesame oil, avocado",
      "Warm grains · basmati rice, cooked oats, wheat",
      "Warming spices · ginger, cinnamon, cumin, cardamom",
      "Warm spiced milk before bed",
    ],
    estiloDeVida: [
      "A steady daily routine · to bed and up at the same time",
      "A massage with warm sesame oil (Abhyanga) before your shower",
      "Gentle, restorative yoga · keep away from very hard exercise",
      "Meditate daily, to settle a scattered mind",
      "Keep your body warm · stay out of drafts and cold",
      "Enough rest · Vata needs more hours of sleep than the other doshas",
    ],
    hierbas: [
      "Ashwagandha · an adaptogen that settles the nervous system and nourishes Vata",
      "Shatavari · tonifies and nourishes the tissues, moistens inner dryness",
      "Triphala · regulates digestion and clears toxins gently",
      "Ginger · lights the digestive fire and warms you inside",
      "Valerian · eases anxiety and helps you sleep deeply",
    ],
    evitar: [
      "Raw, cold, dry food · cold salads, crackers, too many nuts",
      "Too much caffeine · it overstimulates Vata's nervous system",
      "Long fasts · they unsettle Vata's energy",
      "Too much travel and too many changes of routine · they make you more scattered",
      "Too much bitter, pungent and astringent flavor",
    ],
  },
  pitta: {
    descripcion:
      "Pitta is the principle of transformation: fire and water. It governs digestion, metabolism and intelligence. In balance it brings clarity, determination and courage. Out of balance it brings irritability, inflammation and acid reflux.",
    alimentacion: [
      "Fresh food in season · salads, fruit, raw vegetables",
      "Sweet, bitter and astringent flavors · they cool the excess fire",
      "Cooling grains · basmati rice, barley, wheat",
      "Fresh dairy · milk, ghee, fresh cheese (in moderation)",
      "Mild spices · cilantro, fennel, turmeric, mint",
      "Coconut water and fresh natural juices",
    ],
    estiloDeVida: [
      "Keep out of direct sun in the middle of the day",
      "Moderate exercise in the cool hours · swimming, yoga, walking",
      "Meditate, to grow patience and let go of control",
      "Time in nature · gardens, woods, water",
      "A massage with coconut oil · it cools and calms the skin",
      "Don't skip meals · Pitta needs to eat on time",
    ],
    hierbas: [
      "Amalaki (Amla) · cooling, antioxidant, it tonifies without warming",
      "Brahmi · cools the mind, sharpens concentration without agitation",
      "Shatavari · nourishes and cools, the reproductive system especially",
      "Neem · purifies the blood and the skin, cools excess Pitta",
      "Aloe vera (juice) · cools the digestive tract and eases acid reflux",
    ],
    evitar: [
      "Pungent, sour and fermented food · chili, vinegar, alcohol",
      "Too much salt, and fried or very oily food",
      "Caffeine and stimulants · they make Pitta's irritability worse",
      "Long spells in the heat or in strong sun",
      "Too much competition and asking far too much of yourself",
    ],
  },
  kapha: {
    descripcion:
      "Kapha is the principle of structure: earth and water. It governs stability, lubrication and immunity. In balance it brings calm, strength and loyalty. Out of balance it brings lethargy, fluid retention and attachment.",
    alimentacion: [
      "Light, warm, dry food · steamed vegetables, legumes",
      "Pungent, bitter and astringent flavors · they wake up the metabolism",
      "Stimulating spices · ginger, black pepper, turmeric, mustard",
      "Raw honey (a small amount) · the only sweet that lowers Kapha",
      "Light grains · millet, barley, corn, buckwheat",
      "Leafy greens, brassicas and radishes",
    ],
    estiloDeVida: [
      "Vigorous exercise every day · running, swimming, cycling, dancing",
      "Get up early · before 6 a.m., so the heaviness doesn't settle in",
      "Don't nap during the day · it makes Kapha's lethargy worse",
      "A dry massage (Garshana) with a silk glove before your shower",
      "Variety and novelty · break the routine so nothing stagnates",
      "Sauna or steam baths · they help clear toxins and heaviness",
    ],
    hierbas: [
      "Trikatu (ginger + black pepper + long pepper) · lights the digestive fire",
      "Guggulu · helps fat metabolism and lifts the heaviness",
      "Tulsi (holy basil) · clears the airways and clears the mind",
      "Punarnava · a natural diuretic, it lowers fluid retention",
      "Triphala · cleans and tonifies the digestive system",
    ],
    evitar: [
      "Heavy, cold, oily food · fried dishes, dairy, sweets",
      "Too much wheat, rice and refined sugar",
      "Sleeping too much and sitting still · they make Kapha worse directly",
      "Damp, cold rooms with no ventilation",
      "Eating out of boredom, or for emotional comfort",
    ],
  },
};
