import type { DoshaIntro, DoshaKey } from "./doshaIntro";

/**
 * «Introducción a tu doṣha», en INGLÉS.
 *
 * Emparejado por la clave del doṣha (`vata` / `pitta` / `kapha`), que es lo que
 * guarda la base de datos y no se traduce. El doṣha que no esté aquí se lee
 * entero en español (ver `useDoshaIntro`).
 *
 * Se conservan los `**negrita**` y `*cursiva*` EN LOS MISMOS SITIOS: el
 * mini-parser de la página es el mismo para los dos idiomas.
 *
 * Vocabulario: `Doṣha` y `Prakriti` se dicen igual en inglés (ver GLOSARIO);
 * «la Vida» con mayúscula a propósito se queda "Life".
 */
export const DOSHA_INTRO_EN: Partial<Record<DoshaKey, DoshaIntro>> = {
  vata: {
    intro: [
      "Before we go on, I want to tell you something important.",
      "**This is not a label.**",
      "It doesn't mean you'll always behave the same way, or that everything that happens to you can be explained by your Doṣha alone.",
      "Ayurveda understands that **we all have Vata, Pitta and Kapha**, but every person is born with a unique combination. That combination is called your **Prakriti**, and it's the way nature expresses itself in you.",
    ],
    principio: [
      "Vata governs movement.",
      "It's the wind that moves the leaves, the breath that comes into your lungs, the impulse that makes your heart beat and the thought that appears in your mind.",
      "*Wherever there is movement, Vata is at work.*",
      "If Vata is predominant in you, you've probably felt since you were little that your mind runs very fast. That imagining, creating, learning and getting excited about new ideas come easily to you. Maybe you've also felt that sometimes it's hard for you to rest, to keep a routine or to finish everything you start.",
      "None of that means there's something wrong with you.",
      "It simply means nature expresses itself in you in a particular way.",
    ],
    reconoces: {
      titulo: "Do you recognize yourself?",
      intro: "Check the sentences you identify with most.",
      opciones: [
        "My mind rarely stops.",
        "I get excited about new ideas easily.",
        "It's hard for me to keep a routine for long.",
        "Sometimes I feel like I'm living too fast.",
        "I adapt to change very quickly.",
        "I tend to forget to take care of myself when I'm busy.",
      ],
      cierre: [
        "The more sentences you've checked, the more likely it is that this map resonates with you.",
        "And if one of them doesn't fit, that's fine.",
        "**Ayurveda describes tendencies, not people.**",
        "Every human being is unique.",
      ],
    },
    descubriras: {
      titulo: "What you'll discover",
      intro: "Along this path you'll come to understand:",
      items: [
        { icon: "mente", texto: "**How a Vata person thinks.**" },
        { icon: "cuerpo", texto: "**Why your body works the way it works.**" },
        { icon: "habitos", texto: "**Which habits increase your nature and which balance it.**" },
        { icon: "alimentacion", texto: "**Which way of eating supports your well-being.**" },
        { icon: "equilibrio", texto: "**How to come back to balance when you feel yourself scattering.**" },
        { icon: "dones", texto: "**And you'll discover that many of the things you consider flaws today can turn into some of your greatest gifts.**" },
      ],
    },
    preguntaFinal: {
      titulo: "One last question before we begin…",
      pregunta: "If you could change one single thing about yourself right now, what would it be?",
      nota: "We'll save this answer. When you finish the map we'll come back to it.",
    },
    cierre: [
      "*You don't need to become someone else.*",
      "*You only need to understand how your nature works, so you can learn to live in balance with it.*",
      "Let's begin.",
    ],
  },
  pitta: {
    intro: [
      "Before we go on, I want to tell you something important.",
      "**This is not a label.**",
      "It doesn't mean you have to be competitive, a perfectionist, or live at full intensity all the time.",
      "Ayurveda understands that **we all have Vata, Pitta and Kapha**, but every person is born with a unique combination. That combination is called your **Prakriti**, and it's the way nature expresses itself in you.",
    ],
    principio: [
      "Pitta governs transformation.",
      "It's the fire that turns food into energy, ideas into decisions and intention into action.",
      "*Wherever there is transformation, Pitta is at work.*",
      "If Pitta is predominant in you, you've probably always felt a natural need to move forward, to improve and to do things well. Maybe you enjoy learning, solving problems or leading a situation. It's also possible that when things don't turn out the way you expected, frustration, impatience or self-criticism show up.",
      "None of that means there's something wrong with you.",
      "It means your nature holds a great inner fire.",
      "And as with any fire, when it's balanced it gives light; when it overflows, it burns.",
    ],
    reconoces: {
      titulo: "Do you recognize yourself?",
      intro: "Check the sentences you identify with most.",
      opciones: [
        "I like doing things well.",
        "It's hard for me to accept mistakes, especially my own.",
        "I get irritated when I feel something is unfair or inefficient.",
        "I take on responsibility easily.",
        "I demand more of myself than I demand of others.",
        "It's hard for me to switch off or stop thinking about my goals.",
      ],
      cierre: [
        "The more sentences you've checked, the more likely it is that this map resonates with you.",
        "And if one of them doesn't fit, that's fine.",
        "**Ayurveda describes tendencies, not people.**",
        "Every human being expresses their nature in a unique way.",
      ],
    },
    descubriras: {
      titulo: "What you'll discover",
      intro: "Along this path you'll come to understand:",
      items: [
        { icon: "mente", texto: "**How a Pitta person thinks.**" },
        { icon: "cuerpo", texto: "**Why your body works the way it works.**" },
        { icon: "habitos", texto: "**Which habits increase your inner fire and which balance it.**" },
        { icon: "alimentacion", texto: "**Which way of eating supports your well-being.**" },
        { icon: "equilibrio", texto: "**How to keep your gift for leading without tipping into demanding too much.**" },
        { icon: "dones", texto: "**And you'll discover that what can exhaust you today can also become one of your greatest strengths.**" },
      ],
    },
    preguntaFinal: {
      titulo: "One last question before we begin…",
      pregunta: "If you could turn down the intensity of one part of your Life, which one would it be?",
      nota: "We'll save this answer. When you finish the map we'll come back to it.",
    },
    cierre: [
      "*You don't need to put out your fire, you need to learn how to aim it.*",
      "Let's begin.",
    ],
  },
  kapha: {
    intro: [
      "Before we go on, I want to tell you something important.",
      "**This is not a label.**",
      "It doesn't mean you're slow, passive, or that change is hard for you.",
      "Ayurveda understands that **we all have Vata, Pitta and Kapha**, but every person is born with a unique combination. That combination is called your **Prakriti**, and it's the way nature expresses itself in you.",
    ],
    principio: [
      "Kapha governs stability.",
      "It's the earth that holds up a tree, the water that feeds a seed and the force that keeps together everything Life has built.",
      "*Wherever there is stability, nourishment and care, Kapha is at work.*",
      "If Kapha is predominant in you, you've probably always been a calm, patient, dependable person. Maybe others come to you when they need support or someone to listen to them. It's also possible that it's hard for you to close a chapter, to leave your comfort zone or to let go of what you've grown used to.",
      "None of that means there's something wrong with you.",
      "It means your nature is made to hold.",
      "And as with the earth, when it's balanced it makes Life grow; when it stays still for too long, it can turn heavy.",
    ],
    reconoces: {
      titulo: "Do you recognize yourself?",
      intro: "Check the sentences you identify with most.",
      opciones: [
        "It's hard for me to leave my comfort zone.",
        "I'm a patient, calm person.",
        "I get attached easily to people, places or memories.",
        "I prefer stability to constant change.",
        "I like taking care of others.",
        "Sometimes I put off changes I know I need to make.",
      ],
      cierre: [
        "The more sentences you've checked, the more likely it is that this map resonates with you.",
        "And if one of them doesn't fit, that's fine.",
        "**Ayurveda describes tendencies, not people.**",
        "Every human being expresses their nature in a unique way.",
      ],
    },
    descubriras: {
      titulo: "What you'll discover",
      intro: "Along this path you'll come to understand:",
      items: [
        { icon: "mente", texto: "**How a Kapha person thinks.**" },
        { icon: "cuerpo", texto: "**Why your body works the way it works.**" },
        { icon: "habitos", texto: "**Which habits increase your nature and which balance it.**" },
        { icon: "alimentacion", texto: "**Which way of eating supports your well-being.**" },
        { icon: "equilibrio", texto: "**How to keep your calm without falling into stagnation.**" },
        { icon: "dones", texto: "**And you'll discover that what can look like a limitation today is also one of your greatest strengths.**" },
      ],
    },
    preguntaFinal: {
      titulo: "One last question before we begin…",
      pregunta: "If you could let go of one single thing right now, what would it be?",
      nota: "We'll save this answer. When you finish the map we'll come back to it.",
    },
    cierre: [
      "*You don't need to lose your calm, you need to remember that Life also grows when it changes.*",
      "Let's begin.",
    ],
  },
};
