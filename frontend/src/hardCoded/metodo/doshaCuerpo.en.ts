import type { DoshaKey } from "./doshaIntro";
import type { DoshaCuerpo } from "./doshaCuerpo";

/**
 * «Así funciona tu cuerpo», en INGLÉS.
 *
 * Emparejado por la clave del doṣha, que no se traduce. El doṣha que no esté
 * aquí se lee entero en español (ver `useDoshaCuerpo`), y las secciones van en
 * el MISMO orden que el español: la página las pinta una detrás de otra.
 *
 * Ojo con los síntomas: se dicen con la palabra de siempre en inglés (gas,
 * bloating, heartburn, acid reflux), sin subirlos de tono ni volverlos clínicos.
 */
export const DOSHA_CUERPO_EN: Partial<Record<DoshaKey, DoshaCuerpo>> = {
  vata: {
    titulo: "This is how your body works",
    intro: [
      "Now that you understand your way of being a little better, it's time to understand your body.",
      "In Ayurveda, body and mind don't work separately.",
      "Your constitution also shapes how you digest, how you sleep, how you respond to stress and how much energy you have through the day.",
      "If Vata is predominant in you, many of the traits below will probably feel familiar.",
    ],
    secciones: [
      {
        titulo: "Your energy",
        parrafos: [
          "Your energy isn't usually steady.",
          "There are days when you feel you could do everything.",
          "And others when you need to go slower, without quite knowing why.",
          "It doesn't mean you have less energy than other people.",
          "It's simply that **your energy works in bursts**.",
          "When something excites you, you can feel tireless — but if you don't respect your limits, it's easy to end up burning through your reserves.",
          "*Your body needs to alternate fast movement and slow.*",
        ],
      },
      {
        titulo: "Your digestion",
        parrafos: [
          "Vata's digestion is usually variable.",
          "One day you can be very hungry and the next day hardly at all.",
          "It's also common for stress, rushing or a change of routine to affect your digestive system quickly, increasing Vata.",
          "When that happens, gas, bloating, irregular digestion or constipation can show up.",
          "That's why, for a Vata person, **how you eat is usually almost as important as what you eat.**",
        ],
      },
      {
        titulo: "Your rest",
        parrafos: [
          "Sleeping doesn't always mean resting.",
          "Vata people usually sleep lightly and, when they're worried or overstimulated, they can take a long time to fall asleep or wake up several times during the night.",
          "A mind that doesn't stop during the day doesn't usually stop easily when night comes either.",
        ],
      },
    ],
    cuerpo: {
      titulo: "Your body",
      intro: "If Vata is predominant in you, you'll probably also recognize yourself in several of these traits:",
      items: [
        "Your hands and feet are usually cold.",
        "Your skin tends to be on the dry side.",
        "You lose weight easily.",
        "Your body is usually light and slender.",
        "Cold and wind affect you more than they affect other people.",
      ],
      cierre: "All of it reflects the nature of Vata: **cold, dry, light and mobile.**",
    },
    reconoces: {
      titulo: "Do you recognize yourself?",
      intro: "Check the sentences you identify with most.",
      opciones: [
        "I go through stretches with masses of energy and others where I feel worn out.",
        "My digestion changes easily.",
        "Stress hits my stomach quickly.",
        "It's hard for me to sleep when I have a lot on my mind.",
        "My hands or feet are usually cold.",
        "My skin tends to be dry.",
        "I need more rest than I sometimes allow myself.",
      ],
    },
    recuerda: {
      titulo: "What Ayurveda wants you to remember",
      parrafos: [
        "Your body isn't fighting against you.",
        "It's constantly trying to adapt to your nature.",
        "The more you listen to its signals, the sooner you can come back to balance.",
        "Because Vata rarely warns you all at once.",
        "First it whispers.",
        "Then it speaks.",
        "And only when we don't listen does it start to shout.",
      ],
    },
    reflexion: {
      titulo: "Reflect",
      pregunta: "Which signal from your body have you been ignoring for a while?",
      nota: "We'll come back to it at the end of the map.",
    },
    cierre: [
      "*Listening to your body is the first step toward learning how to take care of it.*",
    ],
  },
  pitta: {
    titulo: "This is how your body works",
    intro: [
      "Now that you understand your way of being a little better, it's time to understand your body.",
      "In Ayurveda, body and mind don't work separately.",
      "Your constitution also shapes how you digest, how you sleep, how you respond to stress, and even how much energy you have through the day.",
      "If Pitta is predominant in you, many of the traits below will probably feel familiar.",
    ],
    secciones: [
      {
        titulo: "Your energy",
        parrafos: [
          "Your energy is usually steady.",
          "When you have a goal, you can hold your focus for hours and work with an intensity other people admire.",
          "Discipline and perseverance are part of your nature.",
          "That same intensity, though, can also make you forget to rest, demand too much of yourself, or keep going even when your body is already asking for a pause.",
          "*Your body needs to alternate action and rest.*",
        ],
      },
      {
        titulo: "Your digestion",
        parrafos: [
          "Pitta's digestion is usually strong.",
          "It's common to feel hungry at regular hours and to notice that your body works better when it keeps to a rhythm of meals.",
          "Skipping a meal or pushing it back too far can bring irritability, heartburn or a feeling of being unwell.",
          "When Pitta increases, digestion can become too intense, and burning, acid reflux or too much heat can show up.",
          "That's why, for a Pitta person, **honoring your hunger and staying away from excess is essential.**",
        ],
      },
      {
        titulo: "Your rest",
        parrafos: [
          "Pitta people usually sleep deeply.",
          "But when they go through stretches of heavy work, responsibility or pressure, it's hard for them to switch off mentally before sleeping.",
          "It's common to go to bed thinking about what's left to do, or to wake up with your mind already set to start the day.",
        ],
      },
    ],
    cuerpo: {
      titulo: "Your body",
      intro: "If Pitta is predominant in you, you'll probably also recognize yourself in several of these traits:",
      items: [
        "Your hands and feet are usually warm.",
        "You handle heat worse than cold.",
        "Your body usually runs warm without needing much clothing.",
        "Your skin can be sensitive, or redden easily.",
        "You tend to have defined muscle.",
        "Hunger shows up fairly regularly.",
      ],
      cierre: "All of it reflects the nature of Pitta: **hot, intense, light and transformative.**",
    },
    reconoces: {
      titulo: "Do you recognize yourself?",
      intro: "Check the sentences you identify with most.",
      opciones: [
        "I need to eat at regular hours.",
        "I get irritated easily when I'm hungry.",
        "It's hard for me to rest when I have a lot of work.",
        "I usually feel quite warm.",
        "My skin is sensitive or reddens easily.",
        "I push myself even when I'm tired.",
        "It's hard for me to slow down when I have a goal.",
      ],
    },
    recuerda: {
      titulo: "What Ayurveda wants you to remember",
      parrafos: [
        "Your body isn't trying to hold you back.",
        "It's trying to protect you.",
        "Fire needs fuel.",
        "But it also needs moments to burn lower.",
        "If you keep feeding a flame without ever letting it rest, it ends up consuming everything it finds.",
        "The same is true of Pitta.",
      ],
    },
    reflexion: {
      titulo: "Reflect",
      pregunta: "When do you notice your body asking you to slow down, while your mind decides to keep going?",
      nota: "We'll come back to it at the end of the map.",
    },
    cierre: [
      "*Listening to your body is a form of intelligence too.*",
    ],
  },
  kapha: {
    titulo: "This is how your body works",
    intro: [
      "Now that you understand your way of being a little better, it's time to understand your body.",
      "In Ayurveda, body and mind don't work separately.",
      "Your constitution also shapes how you digest, how you sleep, how you respond to stress, and even how much energy you have through the day.",
      "If Kapha is predominant in you, many of the traits below will probably feel familiar.",
    ],
    secciones: [
      {
        titulo: "Your energy",
        parrafos: [
          "Your energy is usually stable.",
          "You don't need to rush to do things well. You tend to move forward steadily and to keep up the effort for a long time.",
          "Patience and endurance are part of your nature.",
          "But when you lose your motivation, or stay too long inside the same routine, that stability can turn into heaviness, apathy or a lack of drive.",
          "*Your body needs to alternate stability and movement.*",
        ],
      },
      {
        titulo: "Your digestion",
        parrafos: [
          "Kapha's digestion is usually slow.",
          "It's common to feel better with light meals, and to be better off not eating out of habit or boredom.",
          "When Kapha increases, digestion can turn heavy, and a feeling of fullness, sluggishness or trouble feeling real hunger can show up.",
          "That's why, for a Kapha person, **eating only when there's real hunger and staying away from excess is usually one of the best ways to keep your balance.**",
        ],
      },
      {
        titulo: "Your rest",
        parrafos: [
          "Kapha people usually sleep deeply and rest easily.",
          "But when Kapha increases, an excessive need to sleep can also show up, along with trouble getting up in the morning, or a feeling of tiredness even after many hours of rest.",
          "Sometimes the body doesn't need more sleep.",
          "It needs more movement.",
        ],
      },
    ],
    cuerpo: {
      titulo: "Your body",
      intro: "If Kapha is predominant in you, you'll probably also recognize yourself in several of these traits:",
      items: [
        "Your build is usually strong and steady.",
        "You gain weight easily.",
        "Your skin is usually soft and well hydrated.",
        "You have good physical endurance.",
        "You handle cold better than damp heat.",
      ],
      cierre: "All of it reflects the nature of Kapha: **heavy, stable, cold, moist and nourishing.**",
    },
    reconoces: {
      titulo: "Do you recognize yourself?",
      intro: "Check the sentences you identify with most.",
      opciones: [
        "It's hard for me to get going in the morning.",
        "I have a lot of staying power once I start something.",
        "I sometimes eat without being really hungry.",
        "It's hard for me to change routines I already know.",
        "I can sleep for many hours and still feel tired.",
        "I gain weight easily.",
        "Once I find a routine, keeping it is easy for me.",
      ],
    },
    recuerda: {
      titulo: "What Ayurveda wants you to remember",
      parrafos: [
        "Your body doesn't need you to fight it.",
        "It needs you to set it in motion.",
        "Stability is one of your greatest gifts.",
        "But when movement stops, even the most fertile earth ends up hardening.",
        "Moving doesn't mean losing your calm.",
        "It means letting Life keep flowing.",
      ],
    },
    reflexion: {
      titulo: "Reflect",
      pregunta: "Which small change have you been wanting to make for a while, and keep putting off?",
      nota: "We'll come back to it at the end of the map.",
    },
    cierre: [
      "*Listening to your body also means giving it the movement it needs.*",
    ],
  },
};
