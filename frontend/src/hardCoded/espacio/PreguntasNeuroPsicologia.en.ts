/**
 * Las preguntas de Psicología de Mi Espacio, en INGLÉS.
 *
 * El español manda: qué bloques hay, en qué orden, su icono y el `idPregunta`
 * —que es con lo que se guarda la respuesta de la usuaria— salen únicamente de
 * `PreguntasNeuroPsicologia.ts`. De aquí sale solo el texto.
 *
 * Los bloques se emparejan por su TÍTULO español y las preguntas por su
 * `idPregunta`, así que se puede añadir o mover una pregunta en español sin que
 * el inglés se descoloque: lo que falte se lee en español, pregunta a pregunta.
 *
 * Voz: la misma que en los cómics de psicología — «tú» directo, sin marca de
 * género (en inglés se resuelve solo) y sin suavizar la pregunta.
 */

/** El título de cada uno de los siete bloques. */
export const BLOQUES_NEURO_EN: Record<string, string> = {
  "1. Tu madre": "1. Your mother",
  "2. Tu familia": "2. Your family",
  "3. Tu infancia": "3. Your childhood",
  "4. Tu adolescencia": "4. Your teenage years",
  "5. Tus parejas": "5. Your relationships",
  "6. Tus amigos": "6. Your friends",
  "7. Tu adultez": "7. Your adult life",
};

/** La pregunta y su consejo, por `idPregunta`. */
export const PREGUNTAS_NEURO_EN: Record<string, { pregunta: string; consejo?: string }> = {
  // ── 1. Tu madre ──────────────────────────────────────────────────────────
  npmn1: {
    pregunta:
      "What bond do you see between your mother and you? Are you comfortable with your part in it?",
  },
  npmn2: {
    pregunta: "What bothers or angers you most about your mother?",
    consejo:
      "What bothers us most gives us the chance to know exactly how we do NOT want to live.",
  },
  npmn3: {
    pregunta:
      "What do you think you may have inherited from her that isn't yours to carry now?",
    consejo:
      "Anything inherited can be let go of, once we have learned what it came to teach us.",
  },
  npmn4: {
    pregunta:
      "What was your mother's pregnancy like? Did anything hard happen? Did she have support? Did she feel alone, frustrated…?",
  },
  npmn5: {
    pregunta:
      "Do you see yourself as not enough? When does that voice speak, and what exactly does it say? What do you get out of letting it?",
  },
  npmn6: {
    pregunta:
      "Does your mother live as though she were not enough? Does she love and value herself every day of her Life? If she doesn't, how does she destroy herself?",
  },

  // ── 2. Tu familia ────────────────────────────────────────────────────────
  npf1: {
    pregunta:
      "What were your attachment figures like? Could you count on them? Give an example, and say how you think it affected you, or affects you still.",
  },
  npf2: {
    pregunta:
      "What do you think your parents expected of you? Have you delivered it? What do you expect of your parents? Have they delivered it?",
  },
  npf3: { pregunta: "What role were you given, or did you take on, that was never yours?" },
  npf4: {
    pregunta:
      "Could feelings be spoken about in your family? Were you allowed to be sad? Were you allowed to be happy?",
  },
  npf5: {
    pregunta:
      "Were your attachment figures unhappy? Did you feel, or do you still feel, that you can do something to change it? And if you managed it, do you really believe they wouldn't find another way to make themselves unhappy?",
  },
  npf6: {
    pregunta:
      "Did your attachment figure of feminine energy (your mother) make you feel lovable and beautiful? If she didn't, what is stopping you from making yourself feel that way?",
    consejo: "We stay in suffering so we can belong, and so we can complain.",
  },
  npf7: {
    pregunta:
      "Was your attachment figure of masculine energy (your father) able to put a floor under your feet so you could walk your own path? Did he remind you that the world is whatever you want it to be?",
  },
  npf8: {
    pregunta:
      "Did your attachment figure of masculine energy (your father) pass on to you that you have a right to exist, that you are worth something, and that you are equal to Life?",
  },
  npf9: {
    pregunta:
      "What is the most beautiful thing your parents have done for you? What good moments were there?",
    consejo:
      "Don't forget all the good they have done for you. Don't lose yourself reliving the bad moments — learn from them.",
  },

  // ── 3. Tu infancia ───────────────────────────────────────────────────────
  npi1: {
    pregunta:
      "Were your parents able to make your needs legitimate? Needs like asking, running, smiling, crying, playing…",
    consejo:
      "A child has to be allowed to feel, to be kept company, and to be helped to put words to what happens.",
  },
  npi2: { pregunta: "Which of your needs do you believe isn't worth making legitimate?" },
  npi3: {
    pregunta:
      "What was your childhood like? Write what feels most important, or absolutely everything you want to.",
  },
  npi4: { pregunta: "What are your earliest memories?" },
  npi5: {
    pregunta:
      "Can you recognize your inner child? Can you tell them they have a right to exist, and that the only loyalty they owe is to themselves?",
    consejo: "Most children bury their Love under their parents' frustration.",
  },
  npi6: {
    pregunta:
      "What did you change about the way you behaved, believing it would make your parents happier?",
  },
  npi7: {
    pregunta:
      "What sentence is carved into you that isn't yours? When does it show up? In what situation?",
    consejo: "Listen closely to the tone it uses: that voice is not yours.",
  },
  npi8: {
    pregunta:
      "Do you excuse your mistakes by insulting yourself? Do you call yourself dumb, stupid…?",
  },

  // ── 4. Tu adolescencia ───────────────────────────────────────────────────
  npa1: { pregunta: "How do you remember your teenage years?" },
  npa2: { pregunta: "What supposed disorder were you diagnosed with as a teenager?" },
  npa3: {
    pregunta: "What did your parents complain about? How did that shape the way you behaved?",
  },
  npa4: { pregunta: "What do you regret?" },
  npa5: { pregunta: "What hurt you most?" },

  // ── 5. Tus parejas ───────────────────────────────────────────────────────
  npp1: {
    pregunta:
      "Have your relationships been good ones? Are your memories mostly good or mostly bad?",
  },
  npp2: { pregunta: "Can you see anything you learned in the relationships you've had?" },
  npp3: {
    pregunta:
      "Have you held on to resentment or attachment? Could you see the hidden reason for it?",
  },
  npp4: {
    pregunta:
      "What is the worst thing you have allowed someone to do to you? Can you see what you got out of allowing it? What did you find out about yourself?",
  },
  npp5: {
    pregunta: "What is a partner, to you? What are they for?",
    consejo:
      "If you look for someone to pull you out of the monotony you built for yourself, and you find that they can't, you are going to blame them for your unhappiness.",
  },

  // ── 6. Tus amigos ────────────────────────────────────────────────────────
  npla1: {
    pregunta: "Are you a sociable person? What for? What do you find in your friends, or in people?",
  },
  npla2: {
    pregunta: "What bothers you most about your friends? And about people in general?",
    consejo: "What bothers us about someone else says more about us than about them.",
  },
  npla3: {
    pregunta:
      "Can you do things on your own, or do you need people cheering you on? What power are you handing them?",
  },
  npla4: {
    pregunta:
      "Do you complain when you're with your friends? How do you feel afterward? Does it really solve anything?",
  },
  npla5: {
    pregunta:
      "Do you look for recognition from outside, or can you validate everything you do yourself?",
  },

  // ── 7. Tu adultez ────────────────────────────────────────────────────────
  npta1: {
    pregunta:
      "How did your adult life begin? Did you have support, did your parents help, did you move in with a partner…?",
  },
  npta2: {
    pregunta:
      "Do you value and respect yourself every day of your Life? If you don't, do you really expect anyone else to?",
  },
  npta3: {
    pregunta:
      "Do you value your wisdom and your experience? Do you use what you have learned to make your Life better, day after day?",
  },
  npta4: { pregunta: "Are you tired of your Life? Are you tired of yourself?" },
  npta5: {
    pregunta:
      "Do you look for recognition from outside, or can you validate everything you do yourself? Why isn't your own validation enough?",
  },
  npta6: {
    pregunta:
      "Are you worn out even when it looks like you haven't done much? Do you complain about growing old?",
  },
  npta7: {
    pregunta:
      "What patterns repeat in you every day? Do you really want them in your Life? If you don't, what is stopping you from taking them out — what are you afraid of?",
  },
  npta8: {
    pregunta:
      "Can you meditate — that is, can you be with yourself for more than 10 minutes without hurting yourself?",
  },
  npta9: {
    pregunta:
      "Is there anything in your Life you would like to forget? Can you remember what you did yesterday? And the day before?",
    consejo:
      "We live very disconnected from the present. So before you sleep, go back over everything you did during the day.",
  },
  npta10: {
    pregunta: "Do you see the passing of time as decline?",
    consejo:
      "Every stage of Life has its challenges. The question that matters is: can you be the best version of yourself right now?",
  },
};
