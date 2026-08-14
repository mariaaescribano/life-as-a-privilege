import type { DoshaKey } from "./doshaIntro";
import type { DoshaDescubre } from "./doshaDescubre";

/**
 * «Tu tendencia mental», en INGLÉS.
 *
 * Emparejado por la clave del doṣha (`vata` / `pitta` / `kapha`), que no se
 * traduce. El doṣha que no esté aquí se lee entero en español (ver
 * `useDoshaDescubre`).
 *
 * Los `**negrita**` y `*cursiva*` van en los MISMOS sitios que en español, y
 * las listas de dones y desafíos mantienen el punto final: son frases sueltas,
 * como en el original.
 */
export const DOSHA_DESCUBRE_EN: Partial<Record<DoshaKey, DoshaDescubre>> = {
  vata: {
    titulo: "How your mind leans",
    intro: [
      "Before learning what to eat or which habits help you, there's something far more important.",
      "Understanding your nature.",
      "A Vata person doesn't live Life the way a Pitta or a Kapha person does. They perceive the world differently, think differently and respond differently to the same situations.",
      "That doesn't mean one way is better than another.",
      "It simply means that **nature expresses itself differently in every person.**",
    ],
    mente: {
      titulo: "Your mind",
      parrafos: [
        "Your mind is fast. Very fast.",
        "Ideas come easily and tend to connect to one another almost automatically. Learning, imagining, creating and finding original solutions come easily to you.",
        "Your creativity is one of your greatest gifts.",
        "But that same speed can also make it hard for you to switch off, to hold your focus for long, or to finish everything you start.",
        "*Your mind doesn't need to go faster.*",
        "*It needs to find calm.*",
      ],
    },
    dones: {
      titulo: "Your gifts",
      intro: "Vata people usually stand out for:",
      items: ["Creativity.", "Intuition.", "Sensitivity.", "Enthusiasm.", "Adaptability.", "Curiosity."],
      cierre: "When something sparks your interest, you can learn very fast and see possibilities where others only see problems.",
    },
    desafios: {
      titulo: "Your challenges",
      intro: ["Every gift has a shadow.", "In Vata it usually shows up as:"],
      items: ["Scatteredness.", "Inconsistency.", "Fear.", "Anxiety.", "Trouble keeping routines.", "A tendency to overthink."],
      cierre: ["Not because you're weak.", "But because the wind is always moving."],
    },
    reconoces: {
      titulo: "Do you recognize yourself?",
      intro: "Check the sentences you identify with most.",
      opciones: [
        "My head rarely stops thinking.",
        "I start projects full of excitement.",
        "It's hard for me to keep a routine for long.",
        "I get enthusiastic about new things easily.",
        "Sometimes I feel like I'm living too fast.",
        "I adapt to change very well.",
        "It's hard for me to stop without feeling I should be doing something.",
      ],
    },
    recuerda: {
      titulo: "What Ayurveda wants you to remember",
      parrafos: [
        "Vata people usually try to change some part of themselves.",
        "They want to stop being so sensitive.",
        "They want to stop thinking so much.",
        "They want to be more organized.",
        "But that was never the goal.",
        "**You don't need to stop thinking.**",
        "**You need to learn not to live inside your mind.**",
        "When Vata finds stability, its imagination turns into inspiration, its sensitivity into intuition, and its ability to adapt into one of the greatest strengths a person can develop.",
      ],
    },
    reflexion: {
      titulo: "Reflect",
      pregunta: "Which part of this description made you feel most seen?",
      nota: "We'll save this answer to come back to it at the end of the map.",
    },
    cierre: [
      "*You don't need to lose your creativity, you need to give it roots.*",
    ],
  },
  pitta: {
    titulo: "How your mind leans",
    intro: [
      "Before learning what to eat or which habits help you, there's something far more important.",
      "Understanding your nature.",
      "A Pitta person doesn't live Life the way a Vata or a Kapha person does. They tend to look for direction, purpose and results. They like to understand how things work and to improve whatever they touch.",
      "That doesn't mean one way of being is better than another.",
      "It simply means that **nature expresses itself differently in every person.**",
    ],
    mente: {
      titulo: "Your mind",
      parrafos: [
        "Your mind looks for clarity.",
        "You like to understand, analyze and solve.",
        "When you have a goal, you can hold your focus for a long time and work with discipline until you reach it. You usually spot mistakes quickly and see how things could be better.",
        "That's one of your greatest gifts.",
        "But the same fire that helps you move forward can also make you too demanding with yourself, make it hard for you to rest, or bring frustration when things don't turn out the way you expected.",
        "*Your fire doesn't need to burn hotter.*",
        "*It needs to learn to rest.*",
      ],
    },
    dones: {
      titulo: "Your gifts",
      intro: "Pitta people usually stand out for:",
      items: ["Intelligence.", "A gift for organizing.", "Leadership.", "Discipline.", "Courage.", "Mental clarity.", "A gift for making decisions."],
      cierre: "When you find a purpose, you can inspire others and turn ideas into action.",
    },
    desafios: {
      titulo: "Your challenges",
      intro: ["Every gift has a shadow.", "In Pitta it usually shows up as:"],
      items: ["Demanding too much of yourself.", "Perfectionism.", "Impatience.", "A need to control.", "Frustration.", "Irritability.", "Trouble switching off."],
      cierre: ["Not because you're an angry person.", "But because fire always wants to keep moving forward."],
    },
    reconoces: {
      titulo: "Do you recognize yourself?",
      intro: "Check the sentences you identify with most.",
      opciones: [
        "I like doing things well.",
        "It's hard for me to accept my own mistakes.",
        "When I have a goal, I obsess over it until I reach it.",
        "Unfairness or a lack of commitment irritates me.",
        "It's hard for me to switch off from work or from my responsibilities.",
        "I often feel I should be doing more.",
        "It's hard for me to ask for help.",
      ],
    },
    recuerda: {
      titulo: "What Ayurveda wants you to remember",
      parrafos: [
        "Pitta people usually think they always need to do a little more.",
        "Be better.",
        "Work more.",
        "Correct more.",
        "Control more.",
        "But real strength isn't born from constant effort.",
        "It's born from balance.",
        "**You don't need to keep proving your worth.**",
        "**Your worth doesn't depend on everything you achieve.**",
        "When Pitta finds calm, its intelligence turns into wisdom, its discipline into inspiration, and its leadership into a way of serving others rather than a way of demanding more of itself.",
      ],
    },
    reflexion: {
      titulo: "Reflect",
      pregunta: "In which part of your Life do you feel you demand more of yourself than you'd like?",
      nota: "We'll save this answer to come back to it at the end of the map.",
    },
    cierre: [
      "*You don't need to put out your fire, you need to learn how to aim it.*",
    ],
  },
  kapha: {
    titulo: "How your mind leans",
    intro: [
      "Before learning what to eat or which habits help you, there's something far more important.",
      "Understanding your nature.",
      "A Kapha person doesn't live Life the way a Vata or a Pitta person does. They tend to look for stability, safety and harmony. They enjoy building deep relationships, taking care of others and creating a space where people feel good.",
      "That doesn't mean one way of being is better than another.",
      "It simply means that **nature expresses itself differently in every person.**",
    ],
    mente: {
      titulo: "Your mind",
      parrafos: [
        "Your mind looks for quiet.",
        "You don't need to live fast to feel you're moving forward.",
        "You usually think before you act, listen before you speak and watch before you decide. You have an enormous capacity to hold others up, to stay calm when everything is moving and to stand firm when others lose their balance.",
        "That's one of your greatest gifts.",
        "But that same stability can also make you hold on too tightly to what you know, put off important decisions, or find it hard to walk away from situations that no longer do you any good.",
        "*Your calm doesn't need to disappear.*",
        "*It needs to learn to set itself in motion.*",
      ],
    },
    dones: {
      titulo: "Your gifts",
      intro: "Kapha people usually stand out for:",
      items: ["Patience.", "Loyalty.", "Compassion.", "Steadiness.", "Generosity.", "A gift for listening.", "Emotional stability."],
      cierre: "When someone needs support, trust or serenity, they're very likely to think of a person like you.",
    },
    desafios: {
      titulo: "Your challenges",
      intro: ["Every gift has a shadow.", "In Kapha it usually shows up as:"],
      items: ["Attachment.", "Resistance to change.", "Too much comfort.", "Procrastination.", "A lack of motivation.", "Trouble letting go.", "A tendency to carry too much."],
      cierre: ["Not because you're lazy.", "But because the earth always seeks to stay steady."],
    },
    reconoces: {
      titulo: "Do you recognize yourself?",
      intro: "Check the sentences you identify with most.",
      opciones: [
        "It's hard for me to leave my comfort zone.",
        "I get attached easily to people, places or memories.",
        "I prefer stability to constant change.",
        "I tend to take care of others before myself.",
        "Once I make a decision, I stand by it.",
        "It's hard for me to close chapters of my Life.",
        "Sometimes I let opportunities pass because I'm waiting for «the perfect moment».",
      ],
    },
    recuerda: {
      titulo: "What Ayurveda wants you to remember",
      parrafos: [
        "Kapha people usually believe that changing means losing their safety.",
        "But nature teaches us exactly the opposite.",
        "Trees grow.",
        "The seasons change.",
        "Rivers never stop flowing.",
        "And even so, they're still themselves.",
        "**You don't need to stop being a calm person.**",
        "**You need to trust that you can also grow without losing your essence.**",
        "When Kapha finds balance, its calm turns into presence, its steadiness into strength, and its way of caring stops being sacrifice and becomes a conscious way of loving.",
      ],
    },
    reflexion: {
      titulo: "Reflect",
      pregunta: "What is there in your Life that you feel it's time to let go of, or to transform?",
      nota: "We'll save this answer to come back to it at the end of the map.",
    },
    cierre: [
      "*You don't need to lose your calm, you need to remember that Life also grows when it changes.*",
    ],
  },
};
