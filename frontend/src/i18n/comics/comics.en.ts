import type { ComicEn } from ".";

// ─────────────────────────────────────────────────────────────────────────
// LOS CÓMICS, EN INGLÉS
//
// Un cómic por clave, sus viñetas EN EL MISMO ORDEN que el español. Lo que no
// esté aquí se sigue leyendo en español (ver `vinetasEn`): traducir a medias es
// preferible a que a alguien le falte una viñeta.
//
// Al traducir:
//  · El tono importa tanto como el contenido. Estos textos se leen despacio y
//    en segunda persona; en inglés tienen que sonar igual de cercanos, no a
//    manual. «tu cuerpo» es "your body", nunca "the body".
//  · Los nombres propios y los términos de cada tradición NO se traducen:
//    Yang / Purusha / Or, Yin / Prakriti / Kli, doṣha, Qi, sefirá, Tao.
//  · «el Mapa» (el recorrido de la casa) es "the Map", con mayúscula: es el
//    nombre del producto, no un mapa cualquiera.
//  · «la Vida», cuando va con mayúscula a propósito, se queda "Life".
// ─────────────────────────────────────────────────────────────────────────

export const COMICS_EN: Record<string, ComicEn> = {
  // ── Intro de PSICOLOGÍA · «el sufrimiento» ────────────────────────────────
  // Ocho viñetas. Es el texto más delicado de la casa: habla de la herida de
  // infancia de quien lee. En inglés tiene que sonar igual de compasivo y NO
  // clínico — «wounds», no "traumas"; «you», nunca "one".
  "psicologia-intro": [
    {
      paragraphs: [
        "Long before you were born, there was already a story.",
        "The wounds, the stories, the love, the resentment, the fears and the way your parents treated themselves and each other were already shaping how you would see reality.",
      ],
    },
    {
      paragraphs: [
        "Your story began to take shape inside that world.",
        "Somewhere between the Love they were able to give you… and the pain they never learned to heal.",
      ],
    },
    {
      paragraphs: [
        "Your brain develops by adapting to whoever takes care of you.",
        "Many of the connections that today run the way you feel, think and relate to others were formed when you still couldn't understand — or put into words — what you were living through.",
      ],
    },
    {
      paragraphs: [
        "As a child you would have done anything to keep the love of the people caring for you.",
        "You wanted your parents to be happy; what you didn't know is that it was never in your hands.",
        "If they hurt you, you thought the problem was in you, that there was something wrong with you and that was why they treated you that way.",
      ],
    },
    {
      paragraphs: [
        "And so an impossible conflict appeared, one you are still carrying today.",
        "The attachment system says: «Come closer, that's the person who protects you.»",
        "The defence system answers: «Get away, that's also the person who hurts you.»",
        "To resolve that contradiction, many children reach a devastating conclusion: «I am the problem.»",
      ],
    },
    {
      paragraphs: [
        "As the years pass, many experiences wake up those same wounds. Without noticing, you return again and again to the pain of your childhood and to the emptiness that formed inside you.",
      ],
    },
    {
      paragraphs: [
        "That is how many people live: believing they are not enough, blaming themselves, repeating strategies that once helped them survive and today keep them trapped.",
        "«If the people who were supposed to love me couldn't do it, it means I don't deserve love. Who could ever love me?»",
      ],
    },
    {
      paragraphs: [
        "But today you can start down another path.",
        "Your parents, your grandparents and your ancestors were also unloved children in their own story. They gave you what they were able to give.",
        "Understanding doesn't mean excusing; it means stopping carrying a weight that was never your fault.",
        "Look at them with compassion.",
        "And look at yourself — treat yourself with the same Love you always needed. You deserve it.",
      ],
    },
  ],

  // ── Intro de NUTRICIÓN · «te reconstruyes con lo que comes» ────────────────
  "nutricion-intro": [
    {
      paragraphs: [
        "Everything that is alive is made of atoms, molecules and cells.",
        "The universe invests a certain number of particles in order to experience itself as something supposedly separate.",
        "When that form comes apart, the particles are reused to go on creating Life.",
      ],
    },
    {
      paragraphs: [
        "Every living being has one thing in common: if we want to keep existing, we have to turn molecules from the outside into part of ourselves.",
        "In other words, we have to eat.",
      ],
    },
    {
      paragraphs: [
        "When we eat, thousands of enzymes go to work for us, breaking food down into smaller and smaller molecules.",
        "Then your body absorbs them, carries them around and uses them to build new cells, repair tissue and keep going.",
      ],
    },
    {
      paragraphs: [
        "It is a cycle we cannot escape.",
        "Every day we destroy a part of ourselves, and every day we build it back.",
      ],
    },
    {
      paragraphs: [
        "But not all foods bring the same molecules.",
        "For millions of years, nature was our only source of food.",
        "Today, though, we can eat products whose molecular make-up is foreign to our bodies.",
        "So now there is something to watch out for: what should be rebuilding you can also break you down.",
      ],
    },
    {
      paragraphs: [
        "This discipline invites you to stop thinking in terms of what you like and what you don't.",
        "It invites you to look at food rationally, and to understand which molecules it holds, how they act inside you and why they shape your health.",
        "If you really knew what happens inside your body every time you eat, would you still choose the same?",
        "Find out why you like what you like. And find out how, quite literally, you rebuild yourself with every bite.",
      ],
    },
  ],

  // ── El cómic del Origen «según la espiritualidad» ─────────────────────────
  // El más leído de la casa: se abre al entrar en cualquier disciplina y es
  // también la intro de Astrología. 14 viñetas.
  "origen-espiritualidad": [
    {
      paragraphs: [
        "In the beginning there was the infinite.",
        "Light and shadow, the feminine and the masculine, all of it fused into one. All were One, One was all.",
      ],
    },
    {
      paragraphs: [
        "One day, the infinite wanted to know what it feels like to receive Love.",
        "And to feel it, it had to become two.",
      ],
    },
    {
      paragraphs: [
        "So the vessel that holds and the light that gives were born.",
        "Yang, Purusha, Or: the bearer and giver of light.",
        "Yin, Prakriti, Kli: the energy that receives, contains and transforms in order to create.",
      ],
    },
    {
      paragraphs: [
        "But the infinite wanted more. It wanted to experience itself from every point of view it could possibly imagine.",
        "And within that limit it had set for itself, it began to push outwards.",
      ],
    },
    {
      paragraphs: [
        "It burst. The first expansion.",
        "Science calls it the Big Bang, and dates it 13.8 billion years ago.",
      ],
    },
    {
      paragraphs: [
        "In those first minutes, that energy turned into matter. And that matter gave rise to billions upon billions of particles.",
        "Seen through a spiritual lens, that separation was the first great pain.",
        "Every one of our wounds is a reminder of it.",
        "Rejection: «There must be something wrong with me, that's why I was cast out.»",
        "Abandonment: «I'm not enough, that's why everyone leaves.»",
        "And yet, in spite of the pain, the One wanted to experience Love and to find itself.",
      ],
    },
    {
      paragraphs: [
        "Matter went looking for itself. It gathered into stars.",
        "Inside them, pulled together by gravity, the heavy elements were born: carbon, oxygen, iron… everything that exists today.",
      ],
    },
    {
      paragraphs: [
        "The stars died, and out of their dust came the planets, nature and us.",
        "The iron in your blood was once inside a star. That is not a metaphor.",
      ],
    },
    {
      paragraphs: [
        "That stardust came together to form planets. Ours found the perfect place.",
        "Throughout history, different cultures have named different elements.",
        "And yet they all agree on one thing: earth, water, fire, air and energy come together to create Life.",
      ],
    },
    {
      paragraphs: [
        "At some point, matter began to copy itself, to duplicate and to expand.",
        "That is what we are: stardust on loan. An investment made by the Universe.",
        "The molecules in every cell that let you call yourself «I» have existed for more than 13.8 billion years.",
      ],
    },
    {
      paragraphs: [
        "Everything you see is a different expression of God. You are part of the divine — you have simply forgotten.",
        "Kabbalah calls it the exile of the spark: the light that forgot where it came from.",
      ],
    },
    {
      paragraphs: [
        "You are not here by chance, nor as a punishment. You have not been abandoned or cast out.",
        "You are here to remember that you are an expression of God and that you are made of Love.",
        "To remember it, you will walk through hard and painful circumstances. That is part of the path.",
        "The purpose is to understand that pain shows you where your wounds are, so that you can begin to heal them.",
      ],
    },
    {
      paragraphs: [
        "At the exact instant you were born, the sky held a configuration that will never happen again.",
        "That is your birth chart. It tells you where you act from and what you act for. It is your way back Home.",
      ],
    },
    {
      paragraphs: [
        "The Map will walk with you through the eight disciplines that help you understand yourself and remember the meaning of your Life.",
        "You will be given tools for your path — a path you have to walk with your own courage and your own strength.",
        "No one will do for you what you can do for yourself.",
      ],
    },
  ],
};
