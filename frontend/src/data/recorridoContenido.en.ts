/* ─────────────────────────────────────────────────────────────────────────────
 *  RECORRIDO — VERSIÓN INGLESA de recorridoContenido.ts
 *
 *  Espejo exacto del fichero español: MISMAS claves, MISMA forma. TypeScript lo
 *  obliga (`DisciplinaContenido`), así que si añades un punto o una caja en
 *  español, aquí salta el compilador hasta que lo traduzcas.
 *
 *  Terminología: ver src/i18n/GLOSARIO.md.
 *  Ojo: aquí «dosha» va en minúscula y sin diacríticos — es la grafía asentada
 *  en inglés, y además el «ṣ» no lo dibujan ni la fuente de los PDF.
 * ───────────────────────────────────────────────────────────────────────────── */

import type { DisciplinaContenido, DisciplinaClave } from "./recorridoContenido";

export const recorridoContenidoEn: Record<DisciplinaClave, DisciplinaContenido> = {

  // ───────────────────────────────────────────────────────────
  // 1. ASTROLOGY
  // ───────────────────────────────────────────────────────────
  astrologia: {
    desc: "Your birth chart as a starting point. Understand yourself without judgment before you try to change yourself.",
    videoIntro: {
      titulo: "Understand the map of the circumstances that shaped you.",
      puntos: [
        "A personal reading of your chart, written by me, not by an AI.",
        "Understand your chart step by step, with no prior knowledge needed.",
        "Discover how your personality, your strengths and your challenges connect.",
      ],
    },
    modalDesc:
      "Your birth chart doesn't predict your future: it describes how you are put together. Which parts of you carry the most weight, which inner tensions you drag around, what costs you effort and what comes naturally. It is the first step of The Map because, without knowing where you start from, everything that follows is done blind.",
    contenido: [
      {
        titulo: "Know yourself without judgment",
        items: [
          "Understand which forces drive your personality, which inner conflicts keep repeating and why you come back again and again to the same patterns — all through a reading I interpret personally.",
        ],
      },
      {
        titulo: "The parts of you",
        items: [
          "Each area of your chart stands for a different part of you. You will learn to recognize which one is taking over at any given moment, so you can act with awareness instead of reacting on autopilot.",
        ],
      },
      {
        titulo: "Personal support: you are not on your own",
        items: [
          "If you want to go deeper, you can book sessions with me for whatever you need. You will understand your chart better and learn to use it as a tool for self-knowledge for the rest of your Life.",
        ],
        aviso: "Optional. Charged separately",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 2. PSYCHOLOGY
  // ───────────────────────────────────────────────────────────
  psicologia: {
    desc: "Your chart tells you how you are put together. Your history tells you how and what for. Here we bring the two together.",
    videoIntro: {
      titulo: "Understand how your history shaped the person you are today.",
      puntos: [
        "Discover where the patterns that repeat in your life today come from.",
        "Understand how your history shapes the way you think, feel and relate to others.",
        "Look at your wounds from a new perspective and begin to give them a new meaning.",
      ],
    },
    modalDesc:
      "Astrology shows you the how. Psychology shows you the where and in what way. We cross your birth chart with your personal history to understand which mechanisms you developed in order to survive, which ones served you at the time and which ones hold you back today. What bothers you about yourself now was once a way of protecting yourself.",
    contenido: [
      {
        titulo: "Remember your history",
        items: [
          "You will see your history from a different angle. What looked like a collection of isolated events starts to reveal connections and meaning.",
        ],
      },
      {
        titulo: "How the patterns you carry today were formed",
        items: [
          "You will discover how certain events switched on patterns that were already in you.",
        ],
      },
      {
        titulo: "Change begins with commitment",
        items: [
          "Understanding your wounds is only the first step. Real change happens when you accept the pain and learn to give it new meaning, day after day.",
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 3. HINDUISM (ayurveda)
  // ───────────────────────────────────────────────────────────
  ayurveda: {
    desc: "We don't all need the same things. Discover your unique constitution and learn to care for your body and your mind in line with your own nature.",
    videoIntro: {
      titulo: "Discover your own constitution and learn to care for your body and mind according to your nature.",
      puntos: [
        "Discover which doṣha is dominant in you and what it says about you.",
        "Understand the natural tendencies of your body and your mind.",
        "Learn what keeps you in balance and adapt your habits, food and routines to your constitution.",
      ],
    },
    modalDesc:
      "Ayurveda is the traditional medicine of India. It doesn't look at isolated symptoms: it reads the whole person. Your constitution (dosha) shapes how you think, how you fall ill and which foods agree with you. Understanding your dosha is understanding why two people living the same Life end up with different problems.",
    contenido: [
      {
        titulo: "The doshas",
        items: [
          "Vata, Pitta and Kapha are the three energies Ayurveda describes. We all have all three, but in different proportions. Understanding that balance is the first step towards understanding what you need.",
        ],
      },
      {
        titulo: "Your dosha",
        items: [
          "Discover which constitution is dominant in you, what your natural strengths are and which imbalances tend to appear when you drift away from your balance.",
        ],
      },
      {
        titulo: "Don't let it stay theory",
        items: [
          "Knowledge is only worth something when it changes your day to day. You will learn which foods, routines and habits support your balance, so you can start taking care of yourself in a way that makes sense for you.",
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 4. CHINESE MEDICINE (tcm)
  // ───────────────────────────────────────────────────────────
  tcm: {
    desc: "Your organs are interconnected. Every imbalance leaves a trace. Your body speaks before it falls ill. Learn its language.",
    videoIntro: {
      titulo: "Learn the language of your body.",
      puntos: [
        "Discover the five elements and how they relate to your body and its natural cycles.",
        "Spot which element in you may need more attention and what could be behind your imbalances.",
        "Learn concrete ways to restore balance the Taoist way and care for your body, your mind and your wholeness day to day.",
      ],
    },
    modalDesc:
      "Traditional Chinese Medicine reads the body through five elements (wood, fire, earth, metal, water) and the organs that govern them. This is not a poetic metaphor: it is a diagnostic system with thousands of years of evidence behind it. Here we identify which element you have in excess or in deficiency, and how that shows up in what is happening to you.",
    contenido: [
      {
        titulo: "The Five Elements",
        items: [
          "You will learn to read the body as a system where everything is connected. No symptom ever appears on its own.",
        ],
      },
      {
        titulo: "Taoism, applied",
        items: [
          "You will discover how to recover your balance without living in constant reaction to whatever happens around you.",
        ],
      },
      {
        titulo: "Your imbalance today",
        items: [
          "We will identify which system needs the most attention right now, and which concrete steps can help you regain your stability.",
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 5. PHYSIOLOGY
  // ───────────────────────────────────────────────────────────
  fisiologia: {
    desc: "We don't have a body. We are a body. Understand yourself.",
    videoIntro: {
      titulo: "Understand the intricate cellular system that makes you.",
      puntos: [
        "Discover the molecules, cells, organs and systems that build your body.",
        "Understand what happens inside you at cell level and how your body works.",
        "Learn physiology the fun way, to understand your body and make informed decisions.",
      ],
    },
    modalDesc:
      "So far we have worked with traditional knowledge. Here the register changes: science, evidence, cellular mechanisms. Not to cancel out what came before, but to hold it up. Once you understand what your liver does, why your gut becomes inflamed or how your blood sugar is regulated, the decisions you make about your body stop being guesswork.",
    contenido: [
      {
        titulo: "You are your body — stop being a mystery to yourself",
        items: [
          "You will understand what is really going on inside you when you have energy, inflammation, fatigue or illness. You are your body: stop being a mystery to yourself.",
        ],
      },
      {
        titulo: "Common imbalances",
        items: [
          "You will learn to recognize the mechanisms behind many of the problems affecting millions of people today.",
        ],
      },
      {
        titulo: "One-to-one sessions",
        items: [
          "A space to translate the theory into your own situation and better understand what is happening in your own body.",
        ],
        aviso: "Optional. Charged separately",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 6. NUTRITION
  // ───────────────────────────────────────────────────────────
  nutricion: {
    desc: "Understand how the food you choose every day rebuilds you.",
    videoIntro: {
      titulo: "Discover how the food you choose every day rebuilds your body.",
      puntos: [
        "Understand which molecules food contains and how your body uses them.",
        "Discover why your microbiota matters far beyond digestion.",
        "Learn to choose your food with judgement, take myths apart and decide for yourself.",
      ],
    },
    modalDesc:
      "Nutrition is the first habit to adjust once you understand your body. It is not a diet and it is not a list of bans: it is knowing what happens inside you with each food, and deciding from there.",
    contenido: [
      {
        titulo: "Macronutrients and micronutrients",
        items: [
          "Stop thinking in terms of «this is healthy and this isn't». You will understand, in plain terms, which molecules make up food and what they do in your body.",
        ],
      },
      {
        titulo: "The microbiome",
        items: [
          "You will understand why the microbiome reaches far beyond digestion, and how it relates to your health, your energy and your general well-being.",
        ],
      },
      {
        titulo: "Where nutrients come from",
        items: [
          "No living thing makes an atom: you will follow the whole journey, from rock to soil, from soil to root, from root to leaf, and from the leaf to the fruit you eat. And you will understand why every colour in a vegetable is a different family of molecules.",
        ],
      },
      {
        titulo: "One-to-one sessions",
        items: [
          "We will adapt the knowledge to your reality. I won't tell you what to eat; we will work through your questions about food, how it works and how to apply it day to day. If you like, we can also explore the link between certain eating habits and emotional factors or personal experiences.",
        ],
        aviso: "Optional. Charged separately.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 7. KABBALAH
  // ───────────────────────────────────────────────────────────
  cabala: {
    desc: "Discover the dimensions that live in your soul, and so in you. Understand your balances and your imbalances.",
    videoIntro: {
      titulo: "Discover the dimensions of your soul.",
      puntos: [
        "Walk the Tree of Life and discover its ten Sefirot.",
        "Understand your inner conflicts, your qualities and your potential.",
        "Bring these principles into your everyday life and turn them into tools for change.",
      ],
    },
    modalDesc:
      "We reach this point after a long stretch of work: you already know your chart, your history, your constitution and your body. You are ready now to discover the human soul as Jewish mysticism sees it — which has nothing to do with the Jewish religion as it is practiced today.",
    contenido: [
      {
        titulo: "The philosophy of Kabbalah",
        items: [
          "You will discover a way of understanding the human being, their inner conflicts and their potential to grow.",
        ],
      },
      {
        titulo: "The Sefirot as tools",
        items: [
          "You will learn to develop specific qualities that change the way you relate to yourself and to others.",
        ],
      },
      {
        titulo: "One-to-one sessions",
        items: [
          "A space to bring these principles down into real situations in your Life and turn them into something practical.",
        ],
        aviso: "Optional. Charged separately",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 8. CULTURE
  // ───────────────────────────────────────────────────────────
  cultura: {
    desc: "You have met seven ways of interpreting reality. Now it is your turn to build your own.",
    videoIntro: {
      titulo: "The great stories that shaped the world.",
      puntos: [
        "Discover the stories of the civilisations that changed the way we understand life.",
        "Meet the thinkers who asked the same questions you do, and discover their answers.",
        "Travel through world history via science, philosophy, religion and culture.",
      ],
    },
    modalDesc:
      "The last step is not learning one more thing: it is putting in order what you already know. You have been through seven different ways of understanding the human being. Here you build your own.",
    contenido: [
      {
        titulo: "The stories that made humanity.",
        items: [
          "Don't forget the past. Discover it and carry it with you, to value your present and stop living on autopilot.",
        ],
      },
      {
        titulo: "Authors, leaders and kings who mattered",
        items: [
          "You will get to know stories, ideas, reigns and authors that changed humanity.",
        ],
      },
      {
        titulo: "One-to-one sessions",
        items: [
          "Now that you know your mind, your body and your history, reflect on who you are becoming and how you want to live. I will help you bring everything you have learned down into your everyday Life.",
        ],
        aviso: "Optional. Charged separately",
      },
    ],
  },
};
