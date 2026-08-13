import type { CabalaPageKey, SefiraContenido } from "./cabalaSefirot";

/**
 * El contenido de las once dimensiones (sefirot) del recorrido de CÁBALA, en
 * INGLÉS.
 *
 * Aquí va SOLO el texto, emparejado por la clave de la sefirá. El `key`, el
 * `numero`, el orden y las fotos viven únicamente en `cabalaSefirot.ts`: si se
 * duplicaran, bastaría con tocar uno de los dos ficheros para que la misma
 * dimensión ocupara un sitio distinto según el idioma.
 *
 * Lo que falte en este mapa se muestra en español, sefirá a sefirá (ver
 * `useSefira` en cabalaEn.ts). Es la misma regla que ya usan los órganos de
 * Fisiología y los elementos de Medicina China.
 *
 * Al traducir:
 *  · Los nombres de las sefirot NO se traducen (Keter, Chokhmah, Binah, Da'at,
 *    Chesed, Gevurah, Tiferet, Netzach, Hod, Yesod, Malkhut): salen del fichero
 *    español, que es el que los define.
 *  · «la Vida» con mayúscula intencionada se queda "Life"; «Sefirot» es
 *    invariable en plural y su singular es *Sefirah*.
 *  · La voz es la de María: segunda persona, contracciones naturales y frases
 *    cortas. Nada de inglés corporativo.
 */
export type SefiraTexto = Pick<
  SefiraContenido,
  | "frase" | "nota" | "intro" | "equilibrado" | "desequilibrado" | "preguntas"
  | "ejercicio" | "autoevaluacion" | "clave"
>;

/** Se repite en las once dimensiones: la consigna de la autoevaluación. */
const VALORA = "Rate each statement from 1 (never) to 10 (always):";

const KETER: SefiraTexto = {
  frase: "Who do you want to become, and from which truth do you want to live?",
  intro: [
    "Keter stands for the ability to live guided by a purpose that goes beyond the ego's immediate desires.",
    "It isn't about choosing a profession, reaching a goal or building an identity. It's about discovering the principle you want to live from.",
    "Without a clear orientation, even talent, discipline or knowledge can end up serving goals that bring no real fulfillment.",
  ],
  equilibrado: {
    intro: "Someone with a strong Keter usually:",
    items: [
      "Is clear about the principles that guide their Life.",
      "Keeps their decisions coherent even when they're hard.",
      "Doesn't need to prove their worth over and over.",
      "Tolerates uncertainty better, because they know where they're walking.",
      "Feels a sense of meaning in what they do.",
      "Puts what matters before what's urgent.",
    ],
  },
  desequilibrado: {
    intro: "When this dimension loses strength, it's common to see:",
    items: [
      "A constant need for recognition.",
      "Living in comparison with others.",
      "Feeling it's never enough.",
      "Changing course often in search of satisfaction.",
      "Chasing achievements that, once reached, leave you empty.",
      "Building an identity based on image rather than essence.",
    ],
  },
  preguntas: {
    items: [
      "Which principles are non-negotiable for me?",
      "Which recent decisions really reflect those principles?",
      "How much of my effort is looking for recognition?",
      "What would I do if I stopped worrying about other people's opinions?",
      "What kind of person do I want to be, beyond what I achieve?",
      "Which activities make me feel deeply aligned with myself?",
      "Which part of my Life today isn't serving what I consider essential?",
    ],
  },
  autoevaluacion: {
    intro: VALORA,
    items: [
      "I'm clear about which principles guide my Life.",
      "My decisions reflect those principles.",
      "I don't need to prove my worth over and over.",
      "I find meaning in what I do.",
      "My purpose guides my daily priorities.",
    ],
  },
  clave: [
    "Keter isn't strengthened by doing more, but by remembering, again and again, why you do what you do.",
    "Every time a decision comes from coherence instead of the need for validation, this dimension grows stronger. It isn't about reaching an ideal version of yourself, but about returning, over and over, to what you recognize as true and essential.",
  ],
};

const CHOKHMAH: SefiraTexto = {
  frase: "Am I able to see reality as it is?",
  intro: [
    "Chokhmah is the ability to perceive reality clearly, before our beliefs, emotions or past experiences turn it into an interpretation.",
    "Cultivating Chokhmah means learning to stop the impulse to react automatically, so you can observe with openness, curiosity and honesty.",
    "It's a skill that lets you respond to Life from understanding, instead of from fear, habit or old wounds.",
  ],
  equilibrado: {
    intro: "Someone with a good capacity for perception usually:",
    items: [
      "Looks at the facts before drawing conclusions.",
      "Listens to different perspectives with openness.",
      "Recognizes when an emotion is shaping their interpretation.",
      "Tolerates uncertainty without rushing to find answers.",
      "Learns from experience instead of reacting impulsively.",
      "Is able to change their mind when new elements appear.",
    ],
  },
  desequilibrado: {
    intro: "When this dimension is underdeveloped, it's common to:",
    items: [
      "Jump to conclusions.",
      "Assume intentions without checking them.",
      "React from past experiences rather than the present situation.",
      "Justify your own beliefs automatically.",
      "Read the facts through fear, pride or insecurity.",
      "Struggle to acknowledge other points of view.",
    ],
  },
  preguntas: {
    items: [
      "Which objective facts describe this situation?",
      "Which part of my reaction comes from past experiences?",
      "What am I taking for granted without evidence?",
      "What other explanation could there be?",
      "Which emotion is shaping the way I see this situation?",
      "What would I learn if I stopped defending my first interpretation?",
      "Am I responding to reality, or to a story my mind has built?",
    ],
  },
  ejercicio: {
    titulo: "Telling facts and interpretations apart",
    intro: "Think of a recent situation that stirred an intense emotion.",
    columnas: [
      {
        titulo: "Facts",
        descripcion: "Write down only what anyone present could have observed.",
      },
      {
        titulo: "Interpretations",
        descripcion: "Note everything you assumed, imagined or concluded about that situation.",
      },
    ],
    cierreIntro: "When you're done, ask yourself:",
    cierrePreguntas: [
      "How much of my discomfort comes from the facts?",
      "How much comes from the story I built?",
      "What changes if I look at the situation again from the facts?",
    ],
    footer: "This exercise builds the ability to tell perception from interpretation, and with it a more conscious way of looking.",
  },
  autoevaluacion: {
    intro: VALORA,
    items: [
      "Before reacting, I try to look at the facts.",
      "I can tell what happened apart from what I interpret.",
      "I recognize when my emotions are affecting my perception.",
      "I listen to other perspectives with openness.",
      "I'm willing to revisit my conclusions when new information appears.",
    ],
  },
  clave: [
    "Every time you pause before reacting, question your first conclusions or let the facts speak before your assumptions do, you strengthen this dimension.",
    "Developing Chokhmah is learning to look at the world with fewer filters and more presence. From that clarity, decisions stop being driven by impulse and start resting on a deeper, more conscious understanding of reality.",
  ],
};

const BINAH: SefiraTexto = {
  frase: "How do I take that truth in and let it structure the way I see the world?",
  intro: [
    "Binah is the ability to turn an experience into deep understanding.",
    "We all read reality through mental models built by our history, our education and our experiences. Those models help us make sense of what we live, but they can also become invisible limits when we stop questioning them.",
    "Developing this dimension means moving from collecting information to turning experience into wisdom. It means learning from what we live, instead of repeating it unconsciously.",
    "Understanding doesn't mean justifying everything that happens; it means giving it a place inside our story so it stops governing us from the unconscious.",
  ],
  equilibrado: {
    intro: "Someone with a good capacity for integration:",
    items: [
      "Learns from their experiences, even the hard ones.",
      "Recognizes the patterns that repeat in their Life.",
      "Is willing to revisit their beliefs when new information appears.",
      "Tolerates complexity without reaching for simplistic answers.",
      "Understands that they can change the way they interpret their story.",
      "Turns mistakes into chances to learn.",
    ],
  },
  desequilibrado: {
    intro: "When this dimension is underdeveloped, it's common to:",
    items: [
      "Repeat the same conflicts without understanding where they come from.",
      "Cling to beliefs that no longer reflect reality.",
      "Overanalyze without producing real change.",
      "Always blame external or internal factors without integrating what happened.",
      "Live conditioned by past experiences that were never processed.",
      "Look for explanations for everything without letting experience transform the way you live.",
    ],
  },
  preguntas: {
    items: [
      "Which pattern has repeated several times in my Life?",
      "Which learning from that experience haven't I integrated yet?",
      "Which belief about myself or others might need revisiting?",
      "Which interpretation do I keep because it feels familiar, even though it no longer helps me?",
      "What is this situation teaching me about myself?",
      "What new understanding could open up a different way of acting?",
    ],
  },
  ejercicio: {
    titulo: "Finding the pattern",
    intro: "Think of a situation that has repeated at different moments of your Life.",
    promptsIntro: "Write:",
    prompts: [
      "What happened?",
      "What did I feel?",
      "How did I react?",
      "What meaning did I give it at the time?",
      "Which pattern do I find when I compare it with similar experiences?",
      "What new understanding can I integrate today?",
    ],
    footer: "The point isn't to find someone to blame, but to find the learning that lets you break the cycle.",
  },
  autoevaluacion: {
    intro: VALORA,
    items: [
      "I reflect on my experiences in order to learn from them.",
      "I spot patterns that repeat in my Life.",
      "I'm willing to question my own beliefs.",
      "I turn mistakes into chances to grow.",
      "My experiences widen the way I understand the world.",
    ],
  },
  clave: [
    "Developing Binah is building a more flexible, wider, more conscious mind. A mind able to integrate the truth without getting caught in the interpretations of the past, letting every experience add to a deeper understanding of who you are and how you choose to live.",
  ],
};

const DAAT: SefiraTexto = {
  frase: "How do I keep from forgetting the truth when emotion takes over?",
  intro: [
    "Knowing a truth doesn't guarantee we can live it. Da'at is the bridge between understanding something and acting from that understanding, especially when stress, fear, frustration or pressure show up.",
    "Someone with this dimension developed doesn't act well because they never get it wrong, but because they manage to remember who they want to be right in the moments when acting on impulse would be easier.",
    "Every time we forget our values in the face of an intense emotion, we reinforce old patterns. Every time we remember to act from awareness, we strengthen new ways of living.",
  ],
  equilibrado: {
    intro: "Someone with a strengthened Da'at:",
    items: [
      "Acts according to their values even in hard situations.",
      "Stays present when intense emotions arrive.",
      "Learns from their mistakes without repeating them endlessly.",
      "Is coherent between what they think, feel and do.",
      "Turns what they learn into stable habits.",
      "Comes back to their center quickly after a difficulty.",
    ],
  },
  desequilibrado: {
    intro: "When this dimension needs strengthening, it's common to:",
    items: [
      "Know what to do and do something else.",
      "Repeat patterns you had already identified.",
      "Lose clarity when intense emotions appear.",
      "Drop important habits easily.",
      "Feel you always end up back at the same point.",
      "Live with a constant gap between intention and behavior.",
    ],
  },
  preguntas: {
    items: [
      "Which important truth do I know but still don't live consistently?",
      "In which situations do I tend to forget my values?",
      "Which emotion makes me lose connection with myself?",
      "Which pattern do I keep repeating even though I've understood it?",
      "Which small commitment could I hold even on hard days?",
      "What do I need to remember when I'm on autopilot?",
    ],
  },
  ejercicio: {
    titulo: "Remembering before reacting",
    intro: "Think of a situation where you usually react impulsively.",
    promptsIntro: "Write:",
    prompts: [
      "What usually happens?",
      "Which emotion shows up first?",
      "What do I know would be a response more aligned with my values?",
      "What makes me forget that response in the moment?",
      "Which concrete reminder could help me act differently?",
    ],
    footer: [
      "Over the next week, use that reminder before facing a similar situation. At the end of each day, reflect on whether you managed to stay connected to the person you want to be.",
      "The goal isn't to do it perfectly, but to train the ability to remember consciously.",
    ],
  },
  autoevaluacion: {
    intro: VALORA,
    items: [
      "I act according to my values even under pressure.",
      "I keep what I've learned present when I face difficulties.",
      "I turn what I know into concrete habits.",
      "I quickly notice when I'm acting on autopilot.",
      "I recover my coherence after making a mistake.",
    ],
  },
  clave: [
    "Coherence isn't about acting perfectly, but about returning again and again to what you recognize as true.",
    "Developing Da'at is building a solid bridge between knowledge and action. It's letting the truths you've discovered stop being inspiring ideas and become the natural way you choose to live. That's where learning stops being information and turns into lived wisdom.",
  ],
};

const CHESED: SefiraTexto = {
  frase: "How do I share what I am with others?",
  intro: [
    "Chesed isn't simply «giving». It's the ability to generate Life in others from a sense of inner abundance, without turning love into a strategy for being accepted.",
    "Chesed is the ability to offer the best of yourself out of freedom, not out of need. We understand that sharing can add to someone else's wellbeing, without expecting that act to define our personal worth.",
    "Chesed reminds us that helping isn't about doing more for others, but about offering what can truly nourish them, respecting their timing, their decisions and their own limits.",
  ],
  equilibrado: {
    intro: "Someone with a developed Chesed:",
    items: [
      "Shares generously without expecting recognition.",
      "Listens before offering help.",
      "Enjoys contributing to other people's growth.",
      "Gives out of freedom, not obligation.",
      "Respects the autonomy of the people around them.",
      "Celebrates other people's success without feeling threatened.",
    ],
  },
  desequilibrado: {
    intro: "When this dimension needs strengthening, it's common to:",
    items: [
      "Feel you always give more than you receive.",
      "Try to be indispensable to others.",
      "Help even when no one asked.",
      "Struggle to accept a «no».",
      "Confuse sacrifice with love.",
      "Feel resentment when your effort isn't recognized.",
      "Neglect your own needs by constantly putting other people's first.",
    ],
  },
  preguntas: {
    items: [
      "Where do I usually offer my help from?",
      "What do I expect, even if I don't say it, when I do something for someone?",
      "Is it harder for me to receive than to give?",
      "Do I respect the other person's freedom to accept or refuse what I offer?",
      "When do I confuse love with sacrifice?",
      "What would giving look like if I didn't need to prove my worth?",
    ],
  },
  ejercicio: {
    titulo: "Looking at the way I give",
    intro: "Think of a recent situation where you helped someone.",
    promptsIntro: "Write:",
    prompts: [
      "What did I offer?",
      "Why did I decide to do it?",
      "Did the other person need it, or did I feel the need to help?",
      "How did I feel if my help wasn't recognized or accepted?",
      "What would have changed if I had given without expecting any outcome?",
    ],
    footer: [
      "Now find an opportunity in the coming week for an act of generosity that's completely anonymous, or where there's no chance of being recognized.",
      "Afterward, notice how it felt to give without expecting anything back.",
    ],
  },
  autoevaluacion: {
    intro: VALORA,
    items: [
      "I enjoy helping without expecting recognition.",
      "I respect other people's limits and needs.",
      "I can say «yes» out of freedom and not out of guilt.",
      "I don't need to feel indispensable to value what I contribute.",
      "My generosity comes from a conscious choice, not from an emotional need.",
    ],
  },
  clave: [
    "Developing Chesed is learning that love isn't measured by how much you give, but by the quality of the presence you give with. When generosity comes from inner abundance, it stops being an exchange and becomes a natural expression of who you are.",
  ],
};

const GEVURAH: SefiraTexto = {
  frase: "What do I need to protect?",
  intro: [
    "Gevurah is the ability to protect what gives your Life meaning and balance.",
    "Saying «no» isn't rejecting other people; it's affirming what we consider important. Every time we say «yes» to something, we're also saying «no» to something else.",
    "Gevurah helps us act with discernment. It lets us recognize when an opportunity brings us closer to our purpose and when it takes us away from it, when a relationship nourishes us and when it wears us down.",
  ],
  equilibrado: {
    intro: "Someone with a developed Gevurah:",
    items: [
      "Sets clear boundaries with respect.",
      "Can say «no» without feeling guilty.",
      "Acts according to their values even when it's uncomfortable.",
      "Manages their time and energy consciously.",
      "Tells responsibility apart from overload.",
      "Keeps discipline without falling into rigidity.",
    ],
  },
  desequilibrado: {
    intro: "When this dimension needs strengthening, it's common to:",
    items: [
      "Accept commitments out of fear of disappointing someone.",
      "Feel responsible for other people's emotions.",
      "Constantly postpone your own needs.",
      "Struggle to keep personal habits or commitments.",
      "Swing between pleasing everyone and reacting harshly once you hit your limit.",
      "Confuse setting boundaries with being selfish.",
    ],
    extra: {
      intro: "At the opposite extreme, too much Gevurah can show up as:",
      items: [
        "Rigidity.",
        "Perfectionism.",
        "Excessive control.",
        "Difficulty trusting or delegating.",
        "Constant judgment of yourself or others.",
      ],
    },
  },
  preguntas: {
    items: [
      "What do I need to protect in order to live more coherently?",
      "Which «yes» am I giving that I'd really like to turn into a «no»?",
      "What stops me from setting that boundary?",
      "Do I confuse caring for others with abandoning myself?",
      "Which areas of my Life need more discipline, and which need more flexibility?",
      "Which people or situations use up energy I need for what I consider essential?",
    ],
  },
  ejercicio: {
    titulo: "The boundary inventory",
    intro: "For one week, notice every time you accept something you don't really want to do.",
    promptsIntro: "At the end of the day, answer:",
    prompts: [
      "What did I accept?",
      "Why did I say yes?",
      "What was I afraid would happen if I said no?",
      "What did that decision cost me?",
      "How could I express that same boundary with respect and clarity?",
    ],
    footer: [
      "Then pick one small boundary you can communicate during the week.",
      "Don't try to do it perfectly. The goal is to experience that setting boundaries can strengthen a relationship, not destroy it.",
    ],
  },
  autoevaluacion: {
    intro: VALORA,
    items: [
      "I express my boundaries clearly and respectfully.",
      "I can say «no» without excessive guilt.",
      "I protect my time and energy for what I consider important.",
      "I keep habits and commitments that reflect my values.",
      "I tell helping apart from taking on responsibilities that aren't mine.",
    ],
  },
  clave: [
    "Every time you say «no» to what pulls you away from your values, you're saying «yes» to the Life you want to build. Real strength isn't about withstanding everything, but about wisely protecting what makes it possible to live with integrity.",
  ],
};

const TIFERET: SefiraTexto = {
  frase: "Balance and the Wisdom of the Heart",
  nota: {
    titulo: "The heart, the body's «king»",
    parrafos: [
      "Many traditions place in the heart the center from which the person is ordered. Neurocardiology doesn't say exactly that, but it has found something close: the heart is far more involved in mental life than we used to assume.",
      "For a start, it has its own nervous system. The intracardiac ganglia hold some 40,000 neurons that adjust the beat locally, without waiting for orders from the brain; hence the talk of the «little brain of the heart». A transplanted heart, disconnected from the body's nerves, keeps beating and regulating itself.",
      "And the conversation runs mostly bottom-up: most of the fibers of the vagus nerve are afferent, that is, they climb from the body to the brain. That cardiac information reaches areas involved in emotion and attention, to the point that the exact instant of the cardiac cycle in which a stimulus appears changes how we perceive it: a fearful face shown just as the heart contracts is judged as more intense. That listening to the body is called interoception.",
      "It's also the organ with the strongest electrical signal: the electrocardiogram is measured in millivolts, about a thousand times more than the waves of the electroencephalogram. Its magnetic field does leave the body, yes, but it's so weak that specialized instruments (magnetocardiography) are needed to catch it a few centimeters away; what you read out there about fields detected meters away or between two people has not been demonstrated.",
      "What is well established is heart rate variability: the tiny difference in time between one beat and the next. A healthy heart doesn't run like a metronome. That variability rises in states of calm and good regulation, and drops with sustained stress, pain or exhaustion. And it can be trained: breathing slowly, around six breaths a minute, raises it within minutes.",
      "That's the honest sense in which we can call it «king»: it doesn't rule over the rest of the body, but its rhythm is at once the best mirror of your inner state and one of the few levers you can move at will to change it.",
    ],
  },
  intro: [
    "Tiferet is the ability to find balance between the different forces that live in us.",
    "Through Life we live alongside impulses that seem opposite: we want to care for others, and we also need to care for ourselves. Balance isn't about removing a part of us, but about learning when and how to give it room.",
    "Tiferet stands for that inner place from which we stop acting on impulse and start responding with awareness, in the way each situation calls for.",
    "Emotional maturity is born when we stop asking «who's right?» and start asking «what does this situation need from me?».",
  ],
  equilibrado: {
    intro: "Someone with a developed Tiferet:",
    items: [
      "Acts firmly without losing empathy.",
      "Expresses what they feel with honesty and respect.",
      "Listens before reacting.",
      "Can acknowledge both their strengths and their vulnerabilities.",
      "Makes decisions considering their own needs as well as other people's.",
      "Recovers their balance after hard moments.",
      "Keeps coherence between what they think, feel and express.",
    ],
  },
  desequilibrado: {
    intro: "When this dimension needs strengthening, it's common to:",
    items: [
      "Swing constantly between two extremes.",
      "Go from pleasing everyone to rigidity.",
      "React impulsively when conflict appears.",
      "Hold emotions in until you explode.",
      "Confuse compassion with sacrifice.",
      "Defend your own ideas without listening to other perspectives.",
      "Lose touch with your own needs while trying to meet other people's.",
    ],
  },
  preguntas: {
    items: [
      "In which area of my Life do I tend to move between extremes?",
      "Which part of me usually takes over when I face conflict?",
      "Which emotion is hardest for me to hold without reacting?",
      "Am I acting from balance or from an automatic reaction?",
      "How can I care for myself without stopping caring for others?",
      "What does this situation need in order to bring more harmony?",
    ],
  },
  ejercicio: {
    titulo: "Coming back to the center",
    intro: "Remember a recent conversation or situation where you reacted impulsively.",
    promptsIntro: "Write:",
    prompts: [
      "What happened?",
      "What was I feeling at the time?",
      "What did I need?",
      "What did the other person need?",
      "What response did I give?",
      "If I had acted from my best version, what would I have done differently?",
    ],
    footer: [
      "This isn't about judging what happened, but about discovering how your inner center would have answered instead of your automatic reaction.",
      "Over the next week, before answering in a difficult conversation, pause and ask yourself: which response expresses honesty and compassion at the same time?",
    ],
  },
  autoevaluacion: {
    intro: VALORA,
    items: [
      "I express my opinions with honesty and respect.",
      "I can balance my needs with other people's.",
      "I stay calm when intense emotions appear.",
      "I listen before reacting.",
      "I recover my balance after a conflict.",
      "I act from my values rather than from my impulses.",
    ],
  },
  clave: [
    "Balance isn't about always staying in the center, but about learning to return to it.",
    "Developing Tiferet is cultivating a heart able to integrate opposites. It's discovering that real strength doesn't come from imposing yourself or from constantly giving in, but from responding with authenticity, sensitivity and discernment. From that place, our decisions stop being a reaction to circumstances and become an expression of who we choose to be.",
  ],
};

const NETZACH: SefiraTexto = {
  frase: "Am I able to hold that road over time?",
  intro: [
    "Netzach is the ability to stay committed to what we consider important, even when the road gets hard.",
    "This dimension isn't about moving forward without rest or ignoring difficulties. It's about developing the strength to keep walking without losing sight of what gives the effort meaning.",
    "Instead of asking «why is this so hard?», we start asking «what can I learn while I keep going?».",
  ],
  equilibrado: {
    intro: "Someone with a developed Netzach:",
    items: [
      "Stays committed to their long-term goals.",
      "Tolerates frustration without giving up easily.",
      "Learns from mistakes instead of getting discouraged.",
      "Adjusts their strategy when needed without losing the purpose.",
      "Keeps motivation by staying connected to the meaning of what they do.",
      "Recognizes that progress is usually gradual.",
    ],
  },
  desequilibrado: {
    intro: "When this dimension needs strengthening, it's common to:",
    items: [
      "Drop projects at the first difficulty.",
      "Depend on motivation alone in order to act.",
      "Constantly postpone whatever takes effort.",
      "Change direction every time an obstacle appears.",
      "Confuse a temporary difficulty with a personal inability.",
      "Lose confidence when results are slow to arrive.",
    ],
    extra: {
      intro: "At the opposite extreme, too much Netzach can show up as:",
      items: [
        "Insisting on a road that no longer makes sense.",
        "Not recognizing when it's time to rest or change strategy.",
        "Confusing perseverance with stubbornness.",
        "Measuring your personal worth only by performance.",
      ],
    },
  },
  preguntas: {
    items: [
      "Which important project did I abandon too soon?",
      "What usually makes me give up: fear, tiredness or the lack of immediate results?",
      "Which goal still matters to me even though I'm moving slowly?",
      "How do I react when something doesn't turn out as I expected?",
      "Do I need to be more persevering or more flexible?",
      "What reminds me why I started this road?",
    ],
  },
  ejercicio: {
    titulo: "The commitment line",
    intro: "Think of a personal goal you've kept for a while, or one you gave up on.",
    promptsIntro: "Write:",
    prompts: [
      "What made me start?",
      "When did the first difficulty appear?",
      "What did I think at that moment?",
      "What did I do next?",
      "If I picked that road up again today, what would I do differently?",
    ],
    footer: [
      "Then pick a small but meaningful commitment you can hold for the next seven days.",
      "Don't choose anything extraordinary. The goal is to prove to yourself that steadiness is built with repeated actions, not with heroic efforts.",
      "At the end of the week, reflect on how your confidence changed by keeping that commitment.",
    ],
  },
  autoevaluacion: {
    intro: VALORA,
    items: [
      "I keep my commitments even when motivation drops.",
      "I learn from obstacles instead of giving up.",
      "I'm patient with processes that take time.",
      "I adjust my strategy without abandoning my values.",
      "I trust that small sustained steps create big changes.",
      "I can tell resting apart from quitting.",
    ],
  },
  clave: [
    "Developing Netzach is understanding that transformation doesn't depend on how intensely you begin, but on how faithfully you stay. Greatness usually isn't built in extraordinary moments, but in the sum of everyday decisions that, one after another, keep alive the road toward what really matters.",
  ],
};

const HOD: SefiraTexto = {
  frase: "Can I express what I've learned authentically?",
  intro: [
    "Hod is the ability to express who you are and what you've learned in a way that's authentic, clear and respectful.",
    "Expressing doesn't mean talking more. It means finding the words, gestures and actions that faithfully reflect our inner experience.",
    "Humility isn't about thinking less of yourself. It's about recognizing that your perspective is valuable, but it isn't the only one possible.",
  ],
  equilibrado: {
    intro: "Someone with a developed Hod:",
    items: [
      "Expresses their ideas clearly and respectfully.",
      "Listens actively before answering.",
      "Shares their experience without needing to impose it.",
      "Accepts that other people may think differently.",
      "Admits when they don't know something.",
      "Communicates coherently between what they feel, think and say.",
      "Tolerates misunderstandings without getting defensive.",
    ],
  },
  desequilibrado: {
    intro: "When this dimension needs strengthening, it's common to:",
    items: [
      "Constantly look for approval when you communicate.",
      "Speak in order to show knowledge or superiority.",
      "Stay quiet out of fear of being judged.",
      "Get frustrated when others don't understand your point of view.",
      "Over-justify your own decisions.",
      "Use communication to control, manipulate or avoid vulnerability.",
    ],
    extra: {
      intro: "At the opposite extreme, misunderstood humility can show up as:",
      items: [
        "Constantly minimizing your own abilities.",
        "Avoiding sharing valuable ideas out of insecurity.",
        "Giving up your own voice to avoid conflict.",
        "Doubting your own experience even when it's valuable.",
      ],
    },
  },
  preguntas: {
    items: [
      "Do I feel free to express what I really think and feel?",
      "What am I after when I speak: to understand, to be understood, or to be right?",
      "How do I react when someone doesn't share my opinion?",
      "Are there conversations I keep avoiding out of fear of judgment or conflict?",
      "Do I listen in order to understand, or in order to answer?",
      "Which part of my communication reflects authenticity, and which reflects a need for approval?",
    ],
  },
  ejercicio: {
    titulo: "Listening before answering",
    intro: "During an important conversation this week, set out to pause before answering.",
    promptsIntro: "While the other person speaks, notice:",
    prompts: [
      "What am I feeling?",
      "Which impulse shows up: to defend myself, to convince, to justify, or to listen?",
      "What does this conversation really need?",
    ],
    footer: [
      "Before answering, first say something that shows you've understood the other person's point of view. Then express your own perspective with phrases like: «From my experience…», «What I'm seeing is…», «I could be wrong, but…».",
      "Afterward, reflect: how did the conversation change when I put understanding before convincing?",
    ],
  },
  autoevaluacion: {
    intro: VALORA,
    items: [
      "I express my ideas clearly and authentically.",
      "I listen with openness before answering.",
      "I don't need to convince others to feel my opinion has worth.",
      "I can admit when I'm wrong or don't have an answer.",
      "I communicate my emotions without aggression or avoidance.",
      "I respect differences without feeling my identity threatened.",
    ],
  },
  clave: [
    "Every time you listen with real attention, express an idea honestly or accept a difference without needing to impose yourself, you strengthen this dimension.",
  ],
};

const YESOD: SefiraTexto = {
  frase: "How do I turn that truth into a consistent reality?",
  intro: [
    "Yesod is the building of the foundation. It's where repeated decisions become identity.",
    "We don't build our identity out of great isolated decisions. We build it through small repeated acts that, over time, become habits.",
    "Every habit strengthens a version of ourselves. Yesod invites us to look not at what we say we value, but at what we practice every day.",
  ],
  equilibrado: {
    intro: "Someone with a developed Yesod:",
    items: [
      "Keeps habits that are coherent with their values.",
      "Lives in harmony between what they think, feel and do.",
      "Keeps the commitments they make to themselves.",
      "Organizes their energy sustainably.",
      "Builds routines that support their wellbeing.",
      "Inspires trust, because their actions are consistent.",
    ],
  },
  desequilibrado: {
    intro: "When this dimension needs strengthening, it's common to:",
    items: [
      "Have plenty of good intentions but little steadiness.",
      "Start projects that rarely hold.",
      "Act differently from your own values.",
      "Live reacting to circumstances instead of acting with intention.",
      "Feel your Life is disorganized or without a clear structure.",
      "Depend on motivation to keep important habits going.",
    ],
  },
  preguntas: {
    items: [
      "Do my habits really reflect what I consider important?",
      "Which action do I repeat every day that strengthens the person I want to be?",
      "Which habit is building a version of me I no longer want?",
      "Which commitment to myself do I break most often?",
      "Which small practice would have the biggest impact if I kept it for a year?",
      "What does my calendar say about my real priorities?",
    ],
  },
  ejercicio: {
    titulo: "Coherence audit",
    intro: "For three days, keep a record of how you use your time.",
    promptsIntro: "At the end of each day, answer:",
    prompts: [
      "Which activities took most of my energy?",
      "Which ones were aligned with my values?",
      "Which ones were simply reactions to circumstances?",
      "Which habit did I strengthen today?",
      "Which habit weakened the person I want to become?",
    ],
    footer: [
      "Finally, choose one single small habit that represents one of your main values. Commit to keeping it for the next two weeks.",
      "Don't look for big changes. Look to prove to yourself that you can trust you.",
    ],
  },
  autoevaluacion: {
    intro: VALORA,
    items: [
      "My actions reflect my values.",
      "I keep habits that strengthen the person I want to be.",
      "I keep the commitments I make to myself.",
      "I organize my time according to my priorities.",
      "I'm consistent even when motivation drops.",
      "My daily Life reflects what I consider important.",
    ],
  },
  clave: [
    "Identity isn't built out of exceptional decisions, but out of repeated ones. Developing Yesod is learning that coherence isn't a perfect state, but an everyday practice. Because what you do consistently ends up defining who you are far more than what you simply wish to be.",
  ],
};

const MALKHUT: SefiraTexto = {
  frase: "What reality am I creating with the person I am right now?",
  intro: [
    "Malkhut is the ability to turn your inner world into a visible reality. It's the coherence between who you are and the Life you build.",
    "Manifesting doesn't mean controlling everything that happens. It means taking responsibility for the part of reality that does depend on you.",
    "Many people wait for change to happen before they start living differently. But transformation begins when we act as the person we want to become, even before we feel completely ready.",
  ],
  equilibrado: {
    intro: "Someone with a developed Malkhut:",
    items: [
      "Lives according to their values naturally.",
      "Takes responsibility for their decisions and their consequences.",
      "May well unsettle the people who have settled into suffering.",
      "Keeps coherence between their inner world and their everyday Life.",
      "Adapts to change without losing their essence.",
      "Receives both challenges and opportunities with presence and responsibility.",
      "Builds a Life that reflects what they consider important.",
    ],
  },
  desequilibrado: {
    intro: "When this dimension needs strengthening, it's common to:",
    items: [
      "Feel your Life doesn't reflect your potential.",
      "Constantly blame external factors for your situation.",
      "Live with a sense of disconnection between what you think and what you do.",
      "Be clear about the road and not take the steps.",
      "Wait for circumstances to change before acting.",
      "Feel that Life happens «by accident» instead of building it consciously.",
    ],
  },
  preguntas: {
    items: [
      "If someone watched my Life for a week, what would they say really matters to me?",
      "Which parts of my Life clearly reflect my values?",
      "Which areas still don't express the person I want to be?",
      "What impact am I having on the people around me?",
      "Which concrete decision would bring my reality closer to my purpose?",
      "Am I waiting to feel ready, or actively building the Life I want?",
    ],
  },
  ejercicio: {
    titulo: "My Life as a mirror",
    intro: "Imagine a stranger watches your Life for the next thirty days. They can't hear your thoughts, only see your actions.",
    promptsIntro: "Then answer:",
    prompts: [
      "What would they conclude about my priorities?",
      "Which values would they identify in the way I live?",
      "Which habits would confirm who I am?",
      "Which parts of my Life would send a different message from the one I really want to express?",
    ],
    cierreIntro: "Finally, write: «The reality I want to build over the next week is…». And finish the sentence with concrete actions, not wishes. If you manage to keep it, stretch it to a month and then to a year. For example:",
    cierrePreguntas: [
      "Giving quality time to my family every week.",
      "Keeping a steady self-care routine.",
      "Creating room for continuous learning.",
      "Taking an active part in a project that contributes to my community.",
    ],
    footer: ["Choose one action and start today."],
  },
  autoevaluacion: {
    intro: VALORA,
    items: [
      "My Life reflects the values I consider important.",
      "I take responsibility for my decisions and their consequences.",
      "My actions create the impact I want to have on others.",
      "I live coherently between what I think, feel and do.",
      "I actively build the reality I want instead of waiting for it to change on its own.",
      "The way I live expresses the person I choose to be.",
    ],
  },
  clave: [
    "Developing Malkhut is understanding that your Life is the visible expression of your inner world. It isn't about reaching a perfect version of yourself, but about closing, little by little, the distance between what you know, what you value and the way you choose to live.",
    "In the end, the real map of self-knowledge doesn't finish with a deeper understanding of yourself. It finishes when that understanding becomes presence, action and a Life that authentically reflects what you've discovered about who you are.",
  ],
};

export const CABALA_SEFIROT_EN: Partial<Record<CabalaPageKey, SefiraTexto>> = {
  kether: KETER,
  chokmah: CHOKHMAH,
  binah: BINAH,
  daat: DAAT,
  chesed: CHESED,
  geburah: GEVURAH,
  tipharet: TIFERET,
  netzach: NETZACH,
  hod: HOD,
  yesod: YESOD,
  malkuth: MALKHUT,
};
