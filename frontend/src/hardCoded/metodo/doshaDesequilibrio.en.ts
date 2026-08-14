import type { DoshaKey } from "./doshaIntro";
import type { DoshaDesequilibrio } from "./doshaDesequilibrio";

/**
 * «¿Qué te desequilibra?», en INGLÉS.
 *
 * Emparejado por la clave del doṣha, que no se traduce. El doṣha que no esté
 * aquí se lee entero en español (ver `useDoshaDesequilibrio`).
 *
 * OJO con `marcado.rangos`: el `min` y el `max` cuentan casillas y NO se tocan;
 * del inglés se toman solo el `label` y el `texto`. Las casillas de `aumenta`
 * van en el MISMO orden, porque lo que se cuenta es su posición.
 */
export const DOSHA_DESEQUILIBRIO_EN: Partial<Record<DoshaKey, DoshaDesequilibrio>> = {
  vata: {
    titulo: "What throws you off balance?",
    intro: [
      "By now you know your nature better.",
      "The next question is simple.",
      "**Which habits or routines throw you off balance?**",
      "In Ayurveda we don't get sick overnight.",
      "First come small changes that, if they stay long enough, end up affecting body and mind.",
      "In a Vata person, these are usually the most common triggers.",
    ],
    aumenta: {
      titulo: "What increases Vata",
      opciones: [
        "Sleeping too few hours.",
        "Skipping meals.",
        "Eating fast.",
        "Traveling constantly.",
        "Too much stimulation (screens, noise, social media…).",
        "Living without set hours.",
        "Constant stress.",
        "Worry or fear.",
      ],
    },
    marcado: {
      titulo: "How many did you check?",
      rangos: [
        { label: "0-2", min: 0, max: 2, texto: "You're probably taking pretty good care of your nature." },
        { label: "3-5", min: 3, max: 5, texto: "Your Vata may be starting to go out of balance." },
        { label: "6 or more", min: 6, max: 999, texto: "Your body may already be trying to ask you for a rest." },
      ],
    },
    senales: {
      titulo: "The first signals",
      intro: [
        "When Vata increases, the body usually warns you long before a real problem shows up.",
        "It's common to notice:",
      ],
      items: [
        "A racing mind.",
        "Trouble concentrating.",
        "Anxiety or restlessness.",
        "Irregular digestion.",
        "Constipation.",
        "Dry skin.",
        "Light sleep.",
        "A worn-out feeling.",
      ],
      cierre: "*Listening to these signals in time is one of the foundations of Ayurveda.*",
    },
    equilibrio: {
      titulo: "How do you come back to balance?",
      intro: [
        "The good news is that Vata also tends to respond very well to small changes.",
        "Start with the simplest thing.",
      ],
      items: [
        "Keep regular hours.",
        "Eat warm, nourishing food.",
        "Make rest a priority.",
        "Cut back on too much activity.",
        "Give a few minutes to silence or to your breath.",
        "Allow yourself to go a little slower.",
      ],
      cierre: [
        "You don't need to change your whole Life.",
        "Sometimes repeating one small habit every day has more impact than making a big change for a week.",
      ],
    },
    reflexion: {
      titulo: "Reflect",
      pregunta: "Which habit do you think is feeding your Vata most right now?",
      nota: "We'll come back to it at the end of the map.",
    },
    cierre: [
      "*Balance doesn't just appear; it's built out of small decisions repeated every day.*",
    ],
  },
  pitta: {
    titulo: "What throws you off balance?",
    intro: [
      "By now you know your nature better.",
      "The next question is simple.",
      "**What makes your fire overflow?**",
      "In Ayurveda we don't get sick overnight.",
      "First come small imbalances that, if they stay long enough, end up affecting body and mind.",
      "In a Pitta person, these are usually the most common triggers.",
    ],
    aumenta: {
      titulo: "What increases Pitta",
      opciones: [
        "Skipping meals.",
        "Eating very spicy, very salty or very sour food.",
        "Working without resting.",
        "Demanding too much of myself.",
        "Competing constantly.",
        "Trying to control everything.",
        "Spending many hours in front of screens.",
        "Living with constant stress or pressure.",
        "Too much time in the heat.",
      ],
    },
    marcado: {
      titulo: "How many did you check?",
      rangos: [
        { label: "0-2", min: 0, max: 2, texto: "You're probably taking pretty good care of your nature." },
        { label: "3-5", min: 3, max: 5, texto: "Your Pitta may be starting to go out of balance." },
        { label: "6 or more", min: 6, max: 999, texto: "Your body may already be trying to turn the intensity down for you." },
      ],
    },
    senales: {
      titulo: "The first signals",
      intro: [
        "When Pitta increases, the body usually warns you long before a real problem develops.",
        "It's common to notice:",
      ],
      items: [
        "Irritability.",
        "Impatience.",
        "Heartburn or a burning stomach.",
        "Inflammation.",
        "A feeling of heat.",
        "Breakouts or rashes.",
        "Trouble switching off.",
        "Too much self-criticism.",
      ],
      cierre: "*Listening to these signals in time is one of the foundations of Ayurveda.*",
    },
    equilibrio: {
      titulo: "How do you come back to balance?",
      intro: [
        "The good news is that Pitta responds very well once it learns to slow down.",
        "Start with the simplest thing.",
      ],
      items: [
        "Choose fresh, light food.",
        "Don't skip meals.",
        "Set aside moments of rest during the day.",
        "Exercise without pushing your body to its limit.",
        "Look for time in nature and for quiet places.",
        "Practice compassion with yourself as much as you practice it with others.",
      ],
      cierre: [
        "You don't need to perform less.",
        "You need to take care of the fire that makes everything you achieve possible.",
      ],
    },
    reflexion: {
      titulo: "Reflect",
      pregunta: "Which habit do you feel is feeding your fire most right now?",
      nota: "We'll come back to it at the end of the map.",
    },
    cierre: [
      "*Fire gives light when it's balanced, but when it never rests, it ends up consuming itself.*",
    ],
  },
  kapha: {
    titulo: "What throws you off balance?",
    intro: [
      "By now you know your nature better.",
      "The next question is simple.",
      "**What makes your energy stagnate?**",
      "In Ayurveda we don't get sick overnight.",
      "First come small imbalances that, if they stay long enough, end up affecting body and mind.",
      "In a Kapha person, these are usually the most common triggers.",
    ],
    aumenta: {
      titulo: "What increases Kapha",
      opciones: [
        "Sleeping too many hours.",
        "Living a sedentary Life.",
        "Eating out of boredom or anxiety.",
        "Eating too much.",
        "Eating a lot of sweet or very heavy food.",
        "Always keeping to the same routine.",
        "Avoiding change for the sake of comfort.",
        "Keeping my emotions in without expressing them.",
        "Staying too long in my comfort zone.",
      ],
    },
    marcado: {
      titulo: "How many did you check?",
      rangos: [
        { label: "0-2", min: 0, max: 2, texto: "You're probably taking pretty good care of your nature." },
        { label: "3-5", min: 3, max: 5, texto: "Your Kapha may be starting to go out of balance." },
        { label: "6 or more", min: 6, max: 999, texto: "It may be time to set your Life in motion again." },
      ],
    },
    senales: {
      titulo: "The first signals",
      intro: [
        "When Kapha increases, the body usually warns you long before a real problem develops.",
        "It's common to notice:",
      ],
      items: [
        "Heaviness.",
        "A lack of motivation.",
        "Drowsiness.",
        "Slow digestion.",
        "A bloated feeling.",
        "Too much mucus.",
        "Trouble starting anything new.",
        "Attachment to people, objects or situations.",
      ],
      cierre: "*Listening to these signals in time is one of the foundations of Ayurveda.*",
    },
    equilibrio: {
      titulo: "How do you come back to balance?",
      intro: [
        "The good news is that Kapha responds very well once it sets itself in motion again.",
        "Start with the simplest thing.",
      ],
      items: [
        "Walk every day.",
        "Choose lighter meals and don't eat without hunger.",
        "Get up a little earlier in the morning.",
        "Bring movement into your routine, even if it's only a few minutes.",
        "Dare to do something different every week.",
        "Remember that changing doesn't mean losing who you are.",
      ],
      cierre: [
        "You don't need to transform your whole Life overnight.",
        "You only need to take the first step.",
      ],
    },
    reflexion: {
      titulo: "Reflect",
      pregunta: "Which small change have you been wanting to make for a while, and keep putting off?",
      nota: "We'll come back to it at the end of the map.",
    },
    cierre: [
      "*Nature never stays completely still; when you start moving again, you get your balance back.*",
    ],
  },
};
