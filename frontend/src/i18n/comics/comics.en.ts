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
        "The defense system answers: «Get away, that's also the person who hurts you.»",
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

  // ── El cómic del Origen «según la ciencia» ───────────────────────────────
  // El hermano del de espiritualidad: la misma historia contada por el Big Bang.
  // Se lee en Fisiología y en la galería de Ilustraciones. 8 viñetas.
  // Ojo con las cifras: «13.800 millones» son *13.8 billion* en inglés.
  "origen-ciencia": [
    {
      paragraphs: [
        "About 13.8 billion years ago, the whole universe was concentrated in a tiny, extremely dense point.",
        "Then the Big Bang happened: space began to expand and the first particles were born.",
      ],
    },
    {
      paragraphs: [
        "Gravity gathered those particles together.",
        "That's how the first stars were born — factories where nuclear fusion joined particles to create new atoms, like carbon, oxygen or iron.",
      ],
    },
    {
      paragraphs: [
        "When those stars died, they released the atoms they had formed into space.",
        "New stars, planets and solar systems took shape out of that material.",
      ],
    },
    {
      paragraphs: [
        "Planets are born from atoms made by stars. One of those planets was the Earth.",
        "Over millions of years, it kept changing until it became a place able to hold Life.",
      ],
    },
    {
      paragraphs: [
        "Atoms combined into molecules.",
        "Some of them managed to organize into cells, and over millions of years those first cells gave rise to every living thing there is.",
      ],
    },
    {
      paragraphs: [
        "In nature, nothing is wasted.",
        "Atoms pass constantly from one being to another through cycles like those of water, carbon, nitrogen or oxygen.",
        "There's no such thing as what we call death — everything is transformed.",
      ],
    },
    {
      paragraphs: [
        "The atoms that make up your body were born inside stars.",
        "Before they were in you, they may have been part of a mountain, an ocean, an animal or a flower.",
        "Today they make you; tomorrow they may not.",
      ],
    },
    {
      paragraphs: [
        "We're not individuals made of stardust.",
        "We're the universe experiencing itself.",
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

  // ── «La Historia de la Astrología» ────────────────────────────────────────
  // Segunda intro de Astrología, justo después del Origen. Quince viñetas de
  // divulgación histórica: aquí manda la PRECISIÓN (fechas, nombres, títulos de
  // obras) y el hilo, que es uno solo de principio a fin. Los nombres propios
  // van en su forma inglesa asentada (Alexander the Great, Alfonso X of
  // Castile, Azarquiel → al-Zarqālī) y los títulos de obras en cursiva-nada:
  // se dejan tal cual (Tetrabiblos, Alfonsine Tables).
  "astrologia-historia": [
    {
      eyebrow: "Mesopotamia · 2000 BC",
      paragraphs: [
        "Astrology began with the constant observation of the sky.",
        "Priests recorded eclipses, planets and stars to try to understand the omens that affected the kingdom.",
        "They weren't looking for the future of individuals. They wanted to understand the fate of peoples.",
        "And they didn't just look: night after night, on clay tablets, they wrote down everything they saw for more than six hundred years without a break.",
        "It is the longest series of records humanity produced until modern times.",
        "With all that data in hand, they could begin to predict.",
      ],
    },
    {
      paragraphs: [
        "Astrology became a tool for kings.",
        "Before making an important decision, they consulted the astrologers of their court.",
        "The sky could warn of wars, famines or the death of the king.",
        "They weren't fortune tellers: they were officials of the state, and they sent their reports to the palace in writing.",
      ],
    },
    {
      eyebrow: "Babylon · 500 BC",
      paragraphs: [
        "To measure the movement of the planets more quickly and precisely, the Babylonians divided the sky into a circle of 360° and split it into 12 equal parts.",
        "That is how the Zodiac was born.",
        "Twelve stretches of 30 degrees, all the same size, which turned the sky into something you could calculate with numbers instead of only watching.",
      ],
    },
    {
      eyebrow: "331 BC · Alexandria",
      titulo: "Alexander the Great",
      paragraphs: [
        "Alexander conquered Babylon, but he didn't raze what he found there: he took it into his legacy.",
        "Those thousand-year-old archives began to be translated into Greek.",
        "In the city he founded in Egypt, Alexandria, two worlds that had walked apart came together: Babylonian calculation and Greek philosophy.",
        "Hellenistic Astrology was born, and from then on Astrology has also been a tool for understanding people.",
        "In the second century, Ptolemy gathered everything known so far into the Tetrabiblos: the dictionary of Astrology for more than 1,400 years.",
      ],
    },
    {
      paragraphs: [
        "Why did it happen in Greece, of all places? Because the Greeks had spent centuries looking for the meaning of existence.",
        "The Babylonians asked the sky what is going to happen.",
        "The Greeks asked what a human being is, what we are made of and why we act the way we do. On the temple at Delphi they wrote their purpose: «Know thyself».",
        "From then on, the sky stopped being a calendar and became the map of the person within the cosmos.",
        "They added a piece that didn't exist in Babylon: the twelve houses.",
        "The signs tell you HOW you are; the houses, WHERE — work, money, family, love, health, endings...",
        "And to work them out, the day isn't enough: you need the exact time and place.",
      ],
    },
    {
      paragraphs: [
        "Rome fell in love with Greece. It copied its philosophy, its art and its gods.",
        "Ares became Mars. Aphrodite, Venus. Zeus, Jupiter. Hermes, Mercury. Cronus, Saturn. Those are exactly the names you read in your chart today.",
        "The emperors trusted Astrology. But they also feared it.",
        "Searching the stars for the date an emperor would die could be treated as conspiracy.",
        "That is why astrologers were expelled from Rome more than once. The same man who kept astrologers at his court was the one who banned consulting them.",
        "Astrology belonged to the nobility alone.",
      ],
    },
    {
      eyebrow: "",
      paragraphs: [
        "To draw up a birth chart you need four things: the exact time of birth, tables with the positions of the planets, the ability to calculate and the ability to read.",
        "None of that was within reach of the vast majority. For ordinary people, the hour of birth wasn't written down; sometimes not even the day.",
        "So for centuries Astrology was, in practice, a palace service.",
      ],
    },
    {
      eyebrow: "Europe · 13th-16th centuries",
      titulo: "The court astrologer",
      paragraphs: [
        "In medieval Europe the astrologer was a post at court, like the physician or the treasurer. He was consulted to choose the day of a coronation, a wedding or a battle.",
        "No king did more for this knowledge than Alfonso X of Castile. In Toledo he set up a workshop where Christian, Muslim and Jewish scholars worked side by side, translating everything that arrived from the Arab world.",
        "Out of it came the Alfonsine Tables, used all over Europe to calculate the position of the planets for almost three hundred years. And he made one enormous decision: he ordered the translations into Castilian, not Latin. The language of the street, put to work for science.",
        "It wasn't only Castile: Charles V of France kept astrologers in his service and one of the great libraries of his time, and at the court of Richard II of England astrological manuscripts were copied and illuminated.",
        "The Catholic Monarchs consulted astrologers, and Philip II gathered astrological treatises at El Escorial and kept mathematicians in his service.",
      ],
    },
    {
      eyebrow: "Bologna · 1088",
      paragraphs: [
        "Astrology was taught at university. Not in secret. With a chair, a syllabus and exams.",
        "In 1088 Bologna, the first European university, was founded, and astronomy entered as what it was considered to be: a mathematical discipline.",
        "Astrology used those same calculations to interpret what influence the planets had on people and on what was about to happen.",
        "So they weren't two rival trades: the same scholar calculated the position of the planets in the morning and drew up a horoscope in the afternoon, with the same tables and the same mathematics.",
        "A great many of his students were medical students, because treating a patient without looking at the sky was considered negligence.",
      ],
    },
    {
      titulo: "Baghdad, Córdoba, Toledo",
      paragraphs: [
        "Where did those tables and those books come from? From a bridge Europe very nearly lost.",
        "During the Golden Age of Islam, Baghdad became the center of the world's knowledge: all of Greek learning was translated, preserved and improved upon.",
        "In al-Andalus, Córdoba came to hold a library of hundreds of thousands of volumes, and in Toledo the astronomer al-Zarqālī drew up tables that were used across Europe.",
        "When Toledo passed into Christian hands, those books began to be translated into Latin. Without that bridge, neither Ptolemy nor Aristotle would have come back to us...",
      ],
    },
    {
      eyebrow: "16th-17th centuries",
      titulo: "The Scientific Revolution",
      paragraphs: [
        "Astrology didn't fade out in the Renaissance: it lived its greatest golden age, and the border between science and astrology didn't exist yet.",
        "Kepler, the man who discovered that the planets move in ellipses, earned his living drawing up birth charts. For him, Astrology was the harmony of the cosmos within the human being.",
        "Galileo had to teach Astrology to medical students —it was a compulsory subject— and he cast birth charts on commission, charging for them, including his daughters'.",
        "And yet it was precisely these men who ended up leaving it outside. Not by decree: by method.",
        "Astronomy began to demand observation that measured and analyzed, a requirement Astrology could not meet.",
        "But Astrology carried on in popular culture, as tradition and as a divinatory practice.",
      ],
    },
    {
      eyebrow: "1930",
      paragraphs: [
        "Astrology came back when the first birth chart published in a newspaper appeared in 1930, on the birth of Princess Margaret of England, younger sister of the future Queen Elizabeth II.",
        "Readers were so taken with it that the paper began running an astrology column regularly.",
        "Its success made other papers copy the idea and, from then on, horoscopes and birth charts spread through the press all over the world.",
        "With one important detail: to fit into a newspaper, everything had to be cut down to twelve groups, one per Sun sign. That is where the horoscope as you know it was born.",
      ],
    },
    {
      eyebrow: "",
      paragraphs: [
        "Carl Gustav Jung saw Astrology as a map of the unconscious rather than a method for predicting the future.",
        "His theory of the collective unconscious holds that we all share universal archetypes —the Hero, the Sage, the Shadow— that turn up in myths, dreams and religions.",
        "Jung noticed that Astrology also organizes human experience through symbols, with the planets, signs and houses standing for different aspects of the psyche and of personal development.",
        "The birth chart doesn't determine your fate; it works as a symbolic map of your inner world and of the process of individuation, the path toward knowing and integrating yourself.",
      ],
    },
    {
      titulo: "Today",
      paragraphs: [
        "Four thousand years later we are still doing what those priests did: looking up and searching for meaning.",
        "Astronomy explores the universe.",
        "Astrology finds meaning in it.",
        "Both were born looking at the same sky.",
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // LOS CÓMICS INTERCALADOS DE PSICOLOGÍA
  //
  // Van en el orden del recorrido: ACE → línea de Vida → familia → herencia →
  // narrar → creencias → miedo → cómo te construiste → síntesis.
  //
  // LA VOZ ES LA MITAD DEL TRABAJO (ver el guion español de cada uno):
  //  · «nosotros» cuenta el hecho general y «tú» su historia. El cambio se hace
  //    AL PASAR DE VIÑETA, nunca dentro de una. En inglés, "we" y "you" igual.
  //  · Sin marca de género: donde el español dice «desconectada» (la madre), el
  //    inglés va con "they" — nada de "he/she", y nada de «estás listo».
  //  · Los diálogos guardan su forma: raya, quién habla y «comillas latinas».
  // ═══════════════════════════════════════════════════════════════════════════

  // ── «Los ACE» · entre el test de ACE y su resultado ───────────────────────
  "psicologia-ace": [
    {
      paragraphs: [
        "ACEs (Adverse Childhood Experiences) are potentially traumatic events or circumstances that happen before the age of 18.",
        "They include physical, emotional or sexual abuse; neglect; violence at home; living with a family member who has an addiction or a mental illness; or being separated from your caregivers.",
        "This isn't about one isolated event: these experiences can repeat, pile up and grow in impact over time.",
      ],
    },
    {
      paragraphs: [
        "When a child lives through intense, frequent or prolonged stress without the support of an adult who provides safety and emotional regulation, the stress response stays switched on. That can lead to what is known as toxic stress.",
        "Over time, that sustained activation can alter the development of the brain, affect the immune system and change the way the body responds to stress.",
      ],
    },
    {
      paragraphs: [
        "The higher the number of ACEs, the higher the likelihood of physical and mental health problems in adolescence and adulthood.",
        "They are associated with a greater risk of anxiety, depression, cardiovascular disease, diabetes, substance use and difficulties in relationships.",
        "ACEs raise the risk, but they don't determine a person's future.",
      ],
    },
    {
      paragraphs: [
        "The effects of ACEs can be reduced when there are safe relationships, emotional support, early intervention and protective communities.",
        "The past can't be changed, but many of the responses your body and your mind learned in order to survive those experiences can be transformed.",
        "Resilience doesn't mean forgetting what you lived through; it means building new tools, safe relationships and repairing experiences that let you keep growing.",
      ],
    },
  ],

  // ── «La desconexión» · entre el test DES-II y su resultado ────────────────
  // Cuatro viñetas: lo que nos sobrepasa, la disociación como separación, verlo
  // desde fuera y por qué queda registrado sin procesar. Voz en «nosotros», con
  // el «tú» apareciendo en la viñeta 2 igual que en el español.
  "psicologia-disociacion": [
    {
      paragraphs: [
        "When something happens that goes beyond our ability to cope, beyond our way of understanding what's going on, or beyond what we can bear, we may struggle to process and integrate everything we're living through.",
        "When an experience is bigger than the tools we have to face it, our mind may look for other ways to protect us.",
      ],
    },
    {
      paragraphs: [
        "That's when dissociation can appear.",
        "We can think of it as a kind of separation: one part of our experience stays connected to what's happening while another part moves away from it.",
        "It's as if one part of you were living the problem while another stepped back from it, so as not to feel all of its pain.",
      ],
    },
    {
      paragraphs: [
        "That's why we sometimes experience what's happening as if we were watching it from outside, as if it were happening to someone else.",
        "By putting distance between ourselves and what we're living, we can look at it without feeling it with the same intensity.",
        "The event has happened, but emotionally we've moved away from it.",
      ],
    },
    {
      paragraphs: [
        "This doesn't mean the event disappears. It happened, and it stays recorded in our memory — but at the time it may not have been possible to process it in an integrated way.",
        "When the pain is too great and we don't have the tools we'd need to face it, the mind can step back from the experience in order to protect us.",
        "It isn't that it didn't happen. It's that, in order to bear it, a part of our experience had to move away.",
      ],
    },
  ],

  // ── Antesala de la «Línea de Vida» ────────────────────────────────────────
  // Viñeta 1 en «nosotros»; las dos últimas, en «tú».
  "psicologia-linea-tiempo": [
    {
      paragraphs: [
        "The reality we live in grows out of our self-concept.",
        "And our self-concept grows out of how well we are able to tell the story of our own life.",
        "Past experiences shape our present and our future.",
        "We see the world —and act in it— from whatever we believe about ourselves.",
      ],
    },
    {
      paragraphs: [
        "To change your present, you first have to understand your past.",
        "You have to gather up the fragments of your memories in order to give them meaning.",
        "Only then can you begin to change, because what you want to transform today was once an adaptive pattern that helped you survive your circumstances.",
      ],
    },
    {
      paragraphs: [
        "If you're here, it's because you have the strength to build the tools that let you move through chaos and pain without losing yourself.",
        "You have the strength to start gathering those fragments and to understand the story that brought you here.",
        "Begin. But remember that you don't walk this alone.",
      ],
    },
  ],

  // ── «La familia» · entre la Línea de Vida y Tu familia ────────────────────
  "psicologia-familia": [
    {
      paragraphs: [
        "The family is one of the first social groups a person ever comes into contact with.",
        "From childhood, it's where we learn ways of communicating, expressing emotions, forming bonds and relating to other people.",
        "That is why family experiences can have a considerable influence on our emotional, social and psychological development.",
      ],
    },
    {
      paragraphs: [
        "— Teenager: «Things haven't been going well lately and I don't know how to feel.»",
        "— Family member: «You can talk to me. Let's try to find a solution together.»",
        "A family that offers support, listening and safety can help build greater self-esteem and a greater ability to face difficulties.",
        "Open communication makes it possible to express emotions and to resolve problems before they pile up.",
      ],
    },
    {
      paragraphs: [
        "But not every family handles its problems the same way.",
        "In some, conflicts are hidden, or talking about them is avoided to keep up an appearance of calm.",
        "Ignoring a problem doesn't make it disappear, though. When emotions and conflicts are constantly held down, they can build up and create tension, frustration and unease inside the home.",
        "— Teenager, thinking: «Everyone here knows something is going on, but nobody wants to talk about it.»",
      ],
    },
    {
      paragraphs: [
        "Frequent arguments, shouting, a lack of communication or a household living in tension can all create suffering, especially when those situations go on for a long time.",
        "— Teenager: «When they start arguing, I try to shut myself in my room.»",
        "Living constantly in an atmosphere of conflict can bring on feelings of insecurity, anxiety, sadness or helplessness.",
        "Children and teenagers can also learn these patterns of behavior and reproduce them later in their own relationships.",
        "Good families aren't the ones without conflicts; they're the ones that handle those conflicts and talk about them until they find a solution.",
      ],
    },
    {
      paragraphs: [
        "— Family member: «We need to talk about what's going on, even if it's hard.»",
        "— Teenager: «I'd rather we could say what we feel without shouting at each other.»",
        "A healthy family isn't one where problems never arise, but one that tries to face them through communication, respect and the search for solutions.",
        "When conflicts are hard to handle, asking for professional help can be a tool for improving communication and family relationships.",
      ],
    },
  ],

  // ── «Lo que se hereda» · entre Tu familia y el Genograma ──────────────────
  // Las cuatro primeras viñetas son la parte científica («nosotros» /
  // impersonal); la quinta, el cierre, va entera en «tú».
  "psicologia-herencia": [
    {
      paragraphs: [
        "For a long time it was thought that our genes determined practically everything about our traits and our health. Genetics, however, doesn't work in such a simple way.",
        "Epigenetics studies changes in how the activity of genes is regulated — changes that can happen in response to different factors, without altering the DNA sequence.",
        "The environment, our internal responses, stress, food or certain experiences can all influence gene expression.",
      ],
    },
    {
      paragraphs: [
        "Intensely stressful experiences can produce significant changes in the body. Prolonged stress can affect, among other systems, the mechanisms involved in the stress response.",
        "— «Even though the danger is over, my body keeps reacting as if it still had to protect itself.»",
        "Scientific research has looked into whether some of these experiences may be linked to epigenetic changes. And that has opened up a particularly complex question: can some of the effects associated with trauma end up influencing later generations?",
      ],
    },
    {
      paragraphs: [
        "This is where the idea of transgenerational trauma comes in.",
        "It is used to study how the consequences of traumatic experiences can appear or be passed on across generations.",
        "There are several possible mechanisms by which the traumas of our ancestors may live on in us.",
        "Some researchers study biological and epigenetic changes, while others point to the family transmission of behaviors, emotions, ways of parenting and stress responses.",
        "So talking about «inherited trauma» does not mean claiming that a traumatic memory is passed on directly through DNA.",
      ],
    },
    {
      paragraphs: [
        "Trauma can also be passed on psychologically and socially.",
        "Someone who has lived through traumatic experiences may develop particular ways of relating to their children — through fear, overprotection, emotional silence or difficulty trusting.",
        "— Mother: «I was taught that you don't talk about problems.»",
        "— Daughter: «So I never learned to talk about what I feel either.»",
        "This is how certain patterns can repeat from one generation to the next without any direct genetic transmission.",
      ],
    },
    {
      paragraphs: [
        "A family history doesn't determine your future, though. Understanding your family patterns, having support and working through traumatic experiences can help you change the way you respond to them.",
        "What happened in your family is part of your story, but it doesn't have to decide what your future looks like.",
      ],
    },
  ],

  // ── «Narrar» · entre Tus heridas y Narra ──────────────────────────────────
  // Las tres primeras viñetas en «nosotros»; las dos últimas, en «tú».
  "psicologia-narrar": [
    {
      paragraphs: [
        "Throughout our Life we live through experiences that can be hard to understand. Some are good ones, some are painful, and some get buried under silence.",
        "Our mind doesn't store our experiences as a list of facts.",
        "We tend to remember fragments, we read them through whatever physical and mental state we're in, and we give them a new meaning every time.",
      ],
    },
    {
      paragraphs: [
        "Telling an experience lets us put words to thoughts and emotions that can be hard to identify.",
        "By building a narrative, we can organize events that used to look disconnected from one another.",
        "That is why talking about our experiences can help us understand better what happened, how it affected us and what meaning it holds for us.",
      ],
    },
    {
      paragraphs: [
        "When a painful experience is kept completely silent, it is always harder to work through.",
        "Fear, shame or the sense of not being understood can make a person prefer not to tell what they have lived through.",
        "There's a belief that if you don't talk about it, it stops hurting.",
        "But staying silent is never the same as getting through it.",
        "Being able to voice what we've lived through in a safe setting is what lets us start processing it and take it in as part of our own history.",
      ],
    },
    {
      paragraphs: [
        "The stories you tell yourself about you also take part in building your identity and, by extension, your reality.",
        "You are not only what happened to you; you are also the way you interpret and tell those experiences.",
        "Changing the way you understand your past doesn't mean changing the facts. It means being able to find new meanings, and to recognize your own capacity to cope, to learn and to change.",
      ],
    },
    {
      paragraphs: [
        "Telling also needs someone who listens. Being heard and being believed gives you a safe space in which to say what you couldn't say before.",
        "You can't change what happened, but you can give it another meaning.",
        "Telling your story can be an important tool for understanding your experiences, your emotions and your identity.",
        "It isn't simply about recounting the past, but about being able to take it into your own story with a meaning that lets you grow.",
        "Telling doesn't change what happened. But it can change the way you understand it and the place it takes up inside you.",
      ],
    },
  ],

  // ── «Cómo nacen las creencias» · entre Huellas y Nudos ────────────────────
  "psicologia-creencias": [
    {
      paragraphs: [
        "Unresolved trauma doesn't disappear: it turns into a disconnection from yourself.",
        "To keep from feeling the pain, the person stops feeling almost everything. They no longer know what they need, or which emotion they're going through.",
      ],
    },
    {
      paragraphs: [
        "Nobody can connect with a child's needs if they've lost contact with their own.",
        "Emotional disconnection is passed on through parenting.",
        "They don't see, don't understand and don't respond to their child's emotional needs, because they live disconnected from their own.",
      ],
    },
    {
      paragraphs: [
        "A baby depends on someone else to make sense of what they feel.",
        "When that doesn't happen, the child doesn't conclude that their parents weren't able to care for them; they conclude that they don't deserve to be cared for, that there is something inherently wrong with them as a person.",
        "That is how deep beliefs are born: «I'm not enough.» «I don't deserve love.» «The world isn't safe.»",
      ],
    },
  ],

  // ── «El miedo» · entre Miedos y Atrévete ──────────────────────────────────
  // Las tres primeras viñetas en «nosotros»; la última, en «tú».
  "psicologia-miedo": [
    {
      paragraphs: [
        "Fear is a basic emotion that appears when we perceive a threat or a danger. Its main job is to protect us and get us ready to respond.",
        "The body switches on an alarm response: attention sharpens, the heart rate changes and the body gets ready to act.",
        "So feeling fear doesn't mean being weak. It's a human response, and a necessary one for our survival.",
      ],
    },
    {
      paragraphs: [
        "Not all of our fears show up in the face of physical danger, though. We can also feel fear about social situations, decisions, changes or experiences that could affect our self-esteem.",
        "— «I know that speaking in front of everyone isn't putting my life in danger… but I'm terrified.»",
        "Our brain responds to a physical threat and to a psychological threat in similar ways.",
        "Fear can appear whenever we feel that something important to us is at risk.",
      ],
    },
    {
      paragraphs: [
        "And here an important question comes up: what is behind our fears?",
        "— «I'm afraid of failing.»",
        "— Psychologist: «And what would failing mean to you?»",
        "— «That maybe I'm not capable of getting what I really want.»",
        "Sometimes, behind the fear we find something we value deeply.",
        "We're afraid because there's something we could lose, but also because there's something we want.",
      ],
    },
    {
      paragraphs: [
        "That is why behind your greatest fears you'll find your greatest treasures.",
        "Fear of rejection → because you need to be loved and accepted.",
        "Fear of failure → because you have goals that matter to you.",
        "Fear of loss → because there are people and bonds you value.",
        "Fear of change → because leaving the familiar means facing uncertainty.",
        "Maybe your fear is also showing you what really matters to you.",
      ],
    },
  ],

  // ── «Cómo te construiste» · antes de Compromiso ───────────────────────────
  // Este SÍ está además en la galería de Ilustraciones.
  "psicologia-compromiso": [
    {
      paragraphs: [
        "Between the ages of 0 and 6 is when the greatest number of neural connections are formed.",
        "Those are the years when your self-concept starts to be built: who you believe you are, how much you're worth and what place you take up in the world.",
        "Life is very hard on us from very early on.",
        "Your parents, just as happened to theirs, are rarely in tune with your needs, because they never learned to be in tune with their own.",
        "What you learn —and what you don't learn— in those years stays with you for the rest of your life.",
      ],
    },
    {
      paragraphs: [
        "When you're small, everything is immense. You don't understand any of it. You're afraid. You depend completely on the people who take care of you.",
        "You have no option but to adapt and try to please them.",
        "You learn which version of you keeps the bond with your parents alive. Pleasing, keeping quiet, being strong, not being any trouble, taking care of everyone else...",
        "That wasn't who you were. It was the way you learned to survive.",
      ],
    },
    {
      paragraphs: [
        "You grow up believing that this way of surviving is you.",
        "But it isn't. They are responses that once made sense and that today still steer your decisions without you noticing.",
        "That is why you repeat relationships, emotions and conflicts. Not because you want to, but because your brain is still running on the map it drew when it was a child.",
      ],
    },
    {
      paragraphs: [
        "The prefrontal cortex doesn't finish developing until around the age of 25.",
        "This is where, for the first time, you can start putting your head to what you have been feeling since childhood.",
        "You can't go back, but you can stop living out of the wounds of the child you were.",
        "You can start taking care of yourself the way your parents didn't know how to, and break the loop so the story stops repeating itself — and so that in the future, if you want to, you can build a family that is genuinely healthy.",
      ],
    },
  ],

  // ── «El problema nunca es el problema» · antes de la Síntesis ─────────────
  "psicologia-sintesis": [
    {
      paragraphs: [
        "We all believe the problem is the problem.",
        "If you smoke, the problem is tobacco.",
        "If you eat too much, or don't eat, the problem is food.",
        "If you blow up at your partner, the problem is anger.",
        "But no.",
        "That's only the part you can see.",
      ],
    },
    {
      paragraphs: [
        "What you call «the problem» is usually a symptom that you're still surviving through patterns you learned in childhood.",
        "Your anxiety, your rage, your need to control, to please or to shut yourself away... they're all attempts to manage a pain that, for a long time, couldn't be felt.",
        "A part of you is still asking to be seen.",
        "Not because it wants to manipulate anyone.",
        "Because it needs its pain, at last, to be legitimate.",
      ],
    },
    {
      paragraphs: [
        "You already understand where that demand comes from.",
        "You've already seen your wounds, your knots and your fears.",
        "Now it's your turn to take charge of yourself.",
        "This path isn't about stopping feeling. It's about stopping abandoning yourself.",
        "Now it's your turn to be the father, the mother, the safety, the nourishment and the love you once needed.",
        "Because loving also means accepting every part of you, even the parts that learned to survive.",
        "The symptom isn't the enemy. It's the last attempt of a part of you to be heard.",
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // AYURVEDA
  //
  // Los términos sánscritos van SIN diacríticos y en minúscula cuando son
  // comunes (dosha, guna, prana, pranayama); los nombres propios de cada
  // principio guardan su mayúscula y su grafía asentada en inglés: Purusha,
  // Prakriti, Vata, Pitta, Kapha, Sattva, Rajas, Tamas, Mahat, Buddhi,
  // Ahamkara, Tanmatras. Ni «ṣ» ni «ṛ»: no los dibuja la fuente de los PDF.
  //
  // Los tres cómics de doṣha son el MISMO arco (el don → su sombra → lo que
  // enseña el Ayurveda → el don en equilibrio) contado con tres personajes:
  // Vata es una chica, Pitta un chico y Kapha una mujer adulta. El inglés
  // mantiene el género de cada personaje —"she", "he", "she"— porque son
  // personas de una historia, no la voz de quien lee.
  // ═══════════════════════════════════════════════════════════════════════════

  // ── VATA · el viento ──────────────────────────────────────────────────────
  "ayurveda-vata": [
    {
      paragraphs: [
        "Some people don't choose their ideas: their ideas arrive on their own.",
        "She has always been like this. An ordinary conversation opens three new paths for her, and before she has finished the first one she's already imagining the next.",
        "She learns fast. She gets excited fast. She sees possibilities where other people only see a problem.",
        "That is Vata: Air and Ether moving inside someone.",
        "Wherever there is movement, Vata is at work.",
      ],
    },
    {
      paragraphs: [
        "But the wind doesn't know how to stop.",
        "— «I've got ten things started and not one of them finished. My mind won't be quiet, I don't sleep well, I eat when I happen to remember...»",
        "The same air that brings her the ideas also brings the scattering, the light sleep, the worry going round and round at four in the morning.",
        "And then the old thought turns up: maybe I'm the problem.",
        "She isn't. It's that the wind has been blowing far too long with nothing to hold it.",
      ],
    },
    {
      paragraphs: [
        "Ayurveda doesn't ask her to stop moving.",
        "You don't tie the wind down: you give it somewhere to blow.",
        "A routine. Warm food. A bedtime. A few minutes of quiet before the day starts.",
        "Small things, repeated. Nothing spectacular.",
        "Vata doesn't need to go faster. It needs roots.",
      ],
    },
    {
      paragraphs: [
        "Months later her mind is still quick. She hasn't lost a thing.",
        "But now the ideas land. She finishes what she starts. She rests without feeling she's wasting her time.",
        "Her imagination has turned into inspiration; her sensitivity, into intuition; and how easily she changes, into one of her greatest strengths.",
        "You don't need to lose your creativity. You need to give it roots.",
      ],
    },
  ],

  // ── PITTA · el fuego ──────────────────────────────────────────────────────
  "ayurveda-pitta": [
    {
      paragraphs: [
        "Some people need to understand how things work.",
        "He's one of them. He's good at deciding, at organizing, at spotting the mistake nobody else saw and fixing it. When something matters to him, he doesn't let go until it comes out right.",
        "People come looking for him when there's a hard decision to make.",
        "That is Pitta: Fire and Water transforming everything they touch.",
        "Wherever there is transformation, Pitta is at work.",
      ],
    },
    {
      paragraphs: [
        "But fire, when nobody tends it, stops warming and starts burning.",
        "— «It went well, yes. But it could have gone better.»",
        "He eats late, or doesn't eat. He gets irritated by anything that isn't moving. He struggles to switch off, to ask for help, to forgive himself a mistake he would have forgiven anyone else without thinking twice.",
        "And inside, the same sentence on repeat: I should be doing more.",
        "He isn't an angry person. He's a fire that has gone a long time without rest.",
      ],
    },
    {
      paragraphs: [
        "Ayurveda doesn't ask him to go out.",
        "A fire with no limits burns the forest down; the same fire, inside a ring of stones, gives light and warmth to everyone sitting around it.",
        "Eating at proper times. Stopping before he's empty. Choosing what's cool when everything is burning. Treating himself with the same compassion he gives everyone else.",
        "Pitta doesn't need to be more intense. It needs to learn to rest.",
      ],
    },
    {
      paragraphs: [
        "He's still demanding. He still wants things done well. He hasn't lost a thing.",
        "But he no longer mistakes his worth for what he achieves.",
        "His intelligence has turned into wisdom; his discipline, into an example; and his leadership, into a way of serving instead of a way of driving himself.",
        "You don't need to put out your fire. You need to learn to steer it.",
      ],
    },
  ],

  // ── KAPHA · la tierra ─────────────────────────────────────────────────────
  "ayurveda-kapha": [
    {
      paragraphs: [
        "Some people are the ones everyone turns to when the ground starts moving.",
        "She's one of them. She listens before she speaks. She doesn't get flustered. She's there when she says she'll be there, and that makes people breathe differently beside her.",
        "She cares, she holds, she stays. Her home is a place where people want to linger.",
        "That is Kapha: Water and Earth holding together everything Life has built.",
        "Wherever there is stability, nourishment and care, Kapha is at work.",
      ],
    },
    {
      paragraphs: [
        "But earth that goes too long without moving ends up weighing.",
        "«I know I have to make that change. I've known for two years, but...»",
        "She keeps what she no longer uses, holds up what no longer holds her, carries everyone else's load and puts off her own. She gets used to it, and takes that for being all right.",
      ],
    },
    {
      paragraphs: [
        "Ayurveda doesn't ask her to lose her calm.",
        "Trees grow, the seasons turn, rivers never stop flowing. And they are still themselves.",
        "Getting up a little earlier. Walking every day. Eating lighter. Doing one single thing differently this week. Letting go of something, however small.",
        "Kapha doesn't need to disappear. It needs to get moving again.",
      ],
    },
    {
      paragraphs: [
        "She's still calm. She's still the person others turn to. She hasn't lost a thing.",
        "But she no longer mistakes staying put for being safe.",
        "Her calm has turned into presence; her steadiness, into strength; and her way of caring has stopped being sacrifice and become a conscious way of loving.",
        "You don't need to lose your calm. You need to remember that Life also grows when it changes.",
      ],
    },
  ],

  // ── PRĀṆĀYĀMA · igual para los tres doṣhas ────────────────────────────────
  "ayurveda-pranayama": [
    {
      paragraphs: [
        "Prana is vital energy; ayama, to extend.",
        "Pranayama isn't «breathing deeply»: it's directing that energy.",
        "Breathing is the only automatic function you can also govern at will. That makes it the most direct door you have to your nervous system.",
      ],
    },
    {
      paragraphs: [
        "When you breathe in, your heart speeds up; when you breathe out, it slows down. If you're on edge, make the out-breath longer.",
        "Neuroscience has shown that lying down lowers the activity of the prefrontal cortex and makes it easier to fall asleep. So even if it feels uncomfortable at first, try to stay sitting up.",
      ],
    },
    {
      paragraphs: [
        "Never force it. If you run out of breath or feel dizzy, let go and come back to your normal breathing.",
        "If you're pregnant, or you have high blood pressure, glaucoma, epilepsy or a heart condition, keep away from the breath retentions and the fast breathing — but you can still do this practice.",
      ],
    },
  ],

  // ── ILUSTRACIONES DE HINDUISMO · los tres capítulos ───────────────────────
  // Los mismos textos hacen de galería (HinduismoIlustracionesModal) y de cómic
  // intercalado en el recorrido, así que una sola traducción sirve a los dos.
  "hinduismo-origen": [
    {
      paragraphs: [
        "The One expresses itself through two fundamental principles.",
        "Purusha, the masculine energy and pure consciousness.",
        "Prakriti, the feminine energy: primordial nature, the creative energy.",
      ],
    },
    {
      paragraphs: [
        "Prakriti is made of three qualities, or energies, called gunas: ",
        "Sattva (harmony and clarity), Rajas (action and movement) and Tamas (stability and inertia).",
      ],
    },
    {
      paragraphs: [
        "When Purusha meets Prakriti, the manifestation of the universe begins.",
        "The first manifestation is Mahat, or Buddhi: cosmic intelligence.",
        "Out of Mahat comes Ahamkara, the ego. Thanks to it the notion of «I» appears, which lets oneness experience and express itself as countless beings and objects.",
      ],
    },
    {
      paragraphs: [
        "Out of Ahamkara, when Sattva predominates, come Manas (the mind), the five senses of knowledge and the five organs of action.",
      ],
    },
    {
      paragraphs: [
        "Out of Ahamkara, when Tamas predominates, come the five Tanmatras, the subtle qualities: sound, touch, form, taste and smell.",
        "The five great elements will later emerge from them.",
      ],
    },
    {
      paragraphs: [
        "The five great elements are Ether, Air, Fire, Water and Earth.",
        "They make up all the matter in the universe.",
      ],
    },
    {
      paragraphs: [
        "The five elements combine to form the three doshas: Vata, Pitta and Kapha.",
      ],
    },
    {
      paragraphs: [
        "The interaction of the elements and the doshas gives rise to nature and to the human being, who reflects within themselves the very laws and qualities that govern the universe.",
      ],
    },
    {
      paragraphs: [
        "That is why the human being is considered a microcosm: a universe in miniature, holding the same principles that are present in the macrocosm.",
        "To understand ourselves is to understand the universe, and to understand the universe is to understand ourselves.",
      ],
    },
  ],

  "hinduismo-elementos": [
    {
      paragraphs: [
        "According to Ayurveda, everything that exists in the universe is made of Five Elements.",
        "And we are no exception.",
      ],
    },
    {
      paragraphs: [
        "Ether is space.",
        "It is what allows everything else to exist and to express itself.",
      ],
    },
    {
      paragraphs: [
        "Air is movement.",
        "Breath, thoughts and the constant change of Life.",
      ],
    },
    {
      paragraphs: [
        "Fire is transformation.",
        "It turns matter into energy, experiences into learning and ideas into action.",
      ],
    },
    {
      paragraphs: [
        "Water is union.",
        "Nourishment, sensitivity and the ability to adapt without losing our essence.",
      ],
    },
    {
      paragraphs: [
        "Earth is stability.",
        "It gives us structure, strength and the ability to build something that lasts.",
      ],
    },
  ],

  "hinduismo-doshas": [
    {
      paragraphs: [
        "According to Ayurveda, the Five Elements mix together to form the three doshas.",
        "In each person one dosha predominates over the others, and that shapes their constitution, their mindset and their health.",
      ],
    },
    {
      paragraphs: [
        "Vata is made of Air and Ether.",
        "It is the energy of movement, creativity and change.",
      ],
    },
    {
      paragraphs: [
        "Pitta is made of Fire and Water.",
        "It is the energy of transformation, intensity and action.",
      ],
    },
    {
      paragraphs: [
        "Kapha is made of Water and Earth.",
        "It is the energy of stability, nourishment and steadiness.",
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // FISIOLOGÍA
  //
  // Aquí el registro es científico y la precisión manda: cifras, unidades y
  // nombres de estructuras se copian tal cual. Dos cuidados de traducción:
  //  · «billón» español = trillion inglés, y «mil millones» = billion. Las
  //    cifras de células (37 billones, 330.000 millones) hay que CONVERTIRLAS,
  //    no traducirlas palabra por palabra.
  //  · el separador decimal cambia: 330.000 millones → 330 billion, 1.400 → 1,400.
  // ═══════════════════════════════════════════════════════════════════════════

  // ── «La Vida secreta de la célula» ────────────────────────────────────────
  "fisiologia-celula-viva": [
    {
      paragraphs: [
        "Every one of your cells is a small living city.",
        "Inside it, millions of processes are running in the service of your existence.",
      ],
    },
    {
      paragraphs: [
        "The cell membrane protects the city and carefully controls what may come in and what has to go out.",
      ],
    },
    {
      paragraphs: [
        "The nucleus holds the DNA: the great instruction book with all the information the cell needs in order to work.",
      ],
    },
    {
      paragraphs: [
        "The ribosomes read the DNA's instructions and build enzymes, the tools the cell works with.",
      ],
    },
    {
      paragraphs: [
        "Enzymes are the cell's workers. They speed up thousands of chemical reactions and make it possible for Life to happen.",
        "Without them, many of those reactions would take years, or even centuries, to occur.",
      ],
    },
    {
      paragraphs: [
        "All that activity needs energy.",
        "The enzymes in the mitochondria turn nutrients and oxygen into fuel, known scientifically as ATP.",
        "That energy is what lets the enzymes do their work — and thanks to it, our cells can rebuild themselves every day.",
      ],
    },
    {
      paragraphs: [
        "No single structure could keep the cell alive on its own.",
        "Only when they all work together does the thing we call Life appear.",
      ],
    },
    {
      paragraphs: [
        "Millions of reactions happen in a single cell every second. And your body is made of trillions of them.",
        "While you read these words, an entire universe is working in silence to keep you alive.",
      ],
    },
  ],

  // ── «De una célula a un órgano» ───────────────────────────────────────────
  "fisiologia-celulas-organos": [
    {
      paragraphs: [
        "Your Life begins as a single cell called a zygote, formed when the egg and the sperm come together.",
        "This cell holds all the genetic information needed to build a complete organism, and it will be the starting point of millions of cells to come.",
      ],
    },
    {
      paragraphs: [
        "The zygote goes through its first mitosis, dividing into two identical daughter cells.",
        "Both keep exactly the same genetic information and are still able to give rise to any tissue in the body.",
      ],
    },
    {
      paragraphs: [
        "The divisions carry on quickly: two cells become four, then eight, sixteen and many more.",
        "They form a compact structure called the morula, in which all the cells stay joined together.",
      ],
    },
    {
      paragraphs: [
        "The cells keep dividing and rearranging until they form the blastocyst, a structure with an inner cavity where you can already tell apart groups of cells that will take on different jobs during development.",
      ],
    },
    {
      paragraphs: [
        "As the embryo grows, the cells stop being alike.",
        "Through a process called cell differentiation, some become muscle cells, others neurons, epithelial cells or blood cells, among many other types.",
      ],
    },
    {
      paragraphs: [
        "The specialized cells gather with others of the same type and form tissues: organized structures in which they all work together on one same function.",
        "Each tissue will be an essential piece for building an organ.",
      ],
    },
    {
      paragraphs: [
        "Different tissues fit together precisely to form a working organ, such as the heart, the lung or the intestine.",
        "It may look like a single structure, but it is made of millions of cells all descended from that very first one.",
      ],
    },
  ],

  // ── «Cómo una estrella forma los átomos» ──────────────────────────────────
  "fisiologia-estrella-atomos": [
    {
      paragraphs: [
        "To make a star, the makers of the atoms...",
        "Gravity gathers vast clouds of hydrogen, called a nebula.",
        "Little by little, a star is being born.",
      ],
    },
    {
      paragraphs: [
        "Inside it the temperature is so extreme that hydrogen atoms are stripped of their electrons, leaving only protons: their nuclei.",
        "These protons collide and start to join together. Nuclear fusion has begun.",
        "The technical detail: hydrogen is made of one proton and one electron. In the core of a star, temperatures and pressures are so extreme that protons can fuse. In that process one of them turns into a neutron and a deuterium nucleus is formed. After several more reactions, the result is a helium nucleus, made of 2 protons and 2 neutrons. In more massive stars, fusion carries on producing heavier and heavier elements.",
      ],
    },
    {
      paragraphs: [
        "Nuclear fusion creates helium nuclei and releases energy — which is why stars shine.",
        "In time, the star fuses those nuclei and turns them into new elements, such as carbon and oxygen.",
      ],
    },
    {
      paragraphs: [
        "The most massive stars keep fusing elements and manufacture heavier and heavier atoms.",
      ],
    },
    {
      paragraphs: [
        "Eventually iron appears.",
        "From iron on, the star can no longer get energy out of fusion.",
      ],
    },
    {
      paragraphs: [
        "The star collapses and explodes.",
        "In that instant some of the heaviest elements in the universe are born, such as gold and uranium.",
      ],
    },
  ],

  // ── «La meditación y el cerebro» ──────────────────────────────────────────
  // Este SÍ lleva título en cada viñeta (es el único de Fisiología que los usa).
  "fisiologia-meditacion": [
    {
      titulo: "Breathing: the way into the brain",
      paragraphs: [
        "Most people believe they breathe through the nose, when in fact they use their mouth a good part of the time.",
        "Breathing through the nose matters because the air stimulates receptors that send information to the brain.",
        "The rhythm of your breath synchronizes the activity of millions of neurons across different brain regions, such as the hypothalamus, the hippocampus and the prefrontal cortex.",
        "That synchronization improves communication between the different areas of the brain, which helps attention, memory and emotional control.",
        "When we breathe slowly and consciously through the nose, we also activate the vagus nerve and the parasympathetic nervous system, the one in charge of lowering stress, slowing the heart rate and getting the body ready to rest and recover.",
      ],
    },
    {
      titulo: "The brain is listening to the body all the time",
      paragraphs: [
        "For a long time it was believed that the brain ran the body, but today we know the communication goes both ways.",
        "Every second, the heart, the lungs, the gut and the muscles send millions of signals to the brain. This process is called interoception, and it is how the brain knows how the body is doing.",
        "Meditation increases your ability to notice those bodily signals, which helps you spot stress, anxiety or tiredness sooner.",
        "The better the brain reads the information coming from the body, the better the decisions it makes and the easier it is to regulate emotions.",
      ],
    },
    {
      titulo: "Meditating physically changes the brain",
      paragraphs: [
        "The brain has an enormous capacity to change throughout your whole Life. This property is called neuroplasticity.",
        "Practicing meditation regularly strengthens the neural connections between areas involved in attention, memory, emotional regulation and self-control. It also makes the brain more efficient, since it needs less effort to hold concentration.",
        "Thanks to these changes, people who meditate regularly tend to get distracted less, recover their attention sooner when they lose it, and respond more thoughtfully to everyday problems.",
      ],
    },
    {
      titulo: "Emotions can be trained too",
      paragraphs: [
        "Meditation isn't about emptying your mind or getting rid of unpleasant emotions. Its aim is to learn to observe thoughts and emotions without reacting automatically.",
        "When fear, sadness or anger turn up, the brain gradually learns not to respond on impulse. Over time, communication improves between the brain regions involved in emotion and those in charge of reasoning and self-control.",
        "That is why people who practice meditation tend to handle stress better, recover sooner from difficult situations and keep a steadier emotional balance.",
      ],
    },
    {
      titulo: "Kindness also changes the brain",
      paragraphs: [
        "The way we speak to other people —and above all to ourselves— changes how our brain works.",
        "Constant self-criticism keeps the circuits linked to stress switched on and makes learning harder.",
        "Kindness, compassion and respect, on the other hand, create a biological setting that makes it easier for the brain to build new neural connections.",
        "Being kind doesn't mean ignoring your mistakes; it means correcting them without judging or punishing yourself.",
        "A brain that feels safe learns better, remembers more and is better able to adapt to change.",
      ],
    },
    {
      titulo: "Meditating is training your brain to live better",
      paragraphs: [
        "Meditation doesn't make problems disappear, but it changes the way the brain deals with them.",
        "Breathing through your nose, paying attention to your body, observing your thoughts without judging them and cultivating kindness all let the brain work in a more coordinated, more flexible way.",
        "With practice, stress goes down, resilience and concentration improve, emotional regulation increases and your capacity to learn grows stronger.",
        "Meditation is, in short, training for the brain: every session helps build new neural connections that support your physical, mental and emotional well-being.",
      ],
    },
  ],

  // ── «Te reconstruyes cada día» ────────────────────────────────────────────
  // Ojo con las cifras: «37 billones» son 37 trillion y «330.000 millones»,
  // 330 billion. Traducirlas literalmente las dejaría mil veces más bajas.
  "fisiologia-reconstruccion": [
    {
      paragraphs: [
        "Your body is made of roughly 37 trillion (37 × 10¹²) cells.",
        "Every day, around 330 billion of them die and are replaced by new ones.",
        "While you read these lines, millions of cells have already gone and millions are being born.",
        "You are never exactly the same body you were a few minutes ago.",
      ],
    },
    {
      paragraphs: [
        "Picture a city where every building is being repaired at the same time, but each one follows a different schedule.",
        "That is exactly what your body does.",
        "The gut renews much of its lining every 2-5 days. Skin takes about 3-4 weeks. Red blood cells live around 120 days. The liver can regenerate much of its tissue over months, and your skeleton is remodeled continuously, largely renewing itself over about 10 years.",
        "Many neurons in the cerebral cortex, however, can stay with you for practically your whole Life.",
        "There is no moment when your body stops rebuilding itself. All that changes is the pace at which each organ does it.",
      ],
    },
    {
      paragraphs: [
        "Every new cell needs raw material.",
        "Your body makes roughly 300 million new cells every minute. More than 5 million every second.",
        "But none of them appears out of nowhere.",
        "Each one is built out of the amino acids from the protein you eat, the fatty acids from your food, the vitamins and minerals you take in, the oxygen you breathe and the energy your mitochondria produce.",
        "At the same time, your hormones, your sleep, exercise and stress are sending instructions about how those cells should be built and how they should work.",
        "You aren't only feeding your body. You are continually telling it how to rebuild itself.",
      ],
    },
    {
      paragraphs: [
        "Your body doesn't tell a good day from a bad one.",
        "It records patterns.",
        "There is no single meal that makes you healthy.",
        "And no single night that destroys your health.",
        "But thousands of meals, thousands of nights and thousands of repeated decisions do end up changing the structure and the workings of your tissues.",
        "Biology is always listening to whatever you do over and over.",
      ],
    },
    {
      paragraphs: [
        "Your DNA stays practically the same.",
        "But the proteins you make, the cells you replace, the tissues you regenerate and the way your organs work depend, to a large extent, on the signals they get every day.",
        "Every decision is an instruction.",
        "Every habit is a building plan.",
        "The question isn't whether your body is going to change.",
        "The question is which direction you are rebuilding it in.",
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // NUTRICIÓN
  //
  // Mismo aviso que en Fisiología con las cifras: «billones» de microorganismos
  // son trillions, no billions. Y dos términos de la casa:
  //  · microbiota → microbiome, como en el resto del inglés de la web.
  //  · fibra (dietética) → fiber (EE. UU.), nunca fibre.
  // Los nombres de moléculas y hormonas se copian tal cual (ATP, GLP-1, PYY,
  // CCK, grelina → ghrelin, leptina → leptin).
  // ═══════════════════════════════════════════════════════════════════════════

  // ── «Las calorías no existen» · portada → Los nutrientes ──────────────────
  "nutricion-calorias": [
    {
      paragraphs: [
        "Calories don't exist physically. What really exists are the molecules that make up food, and what our cells can do with them.",
        "Calories are simply a way of measuring how much energy the body can get out of those molecules.",
      ],
    },
    {
      paragraphs: [
        "When we eat, our enzymes take food apart bit by bit until all its molecules are separated out: glucose, amino acids, fatty acids, vitamins, minerals...",
        "Those are the real «pieces» the body works with.",
      ],
    },
    {
      paragraphs: [
        "From there, each molecule can follow a different path.",
        "Glucose, for instance, is usually used to get energy through cellular respiration.",
        "Fatty acids can go into building cell membranes, making hormones, being stored as reserve or producing energy.",
        "Amino acids are used to make proteins: muscle, enzymes, antibodies.",
      ],
    },
    {
      paragraphs: [
        "When a cell gets energy out of glucose through cellular respiration, that energy is stored for the time being in a molecule called ATP (adenosine triphosphate).",
      ],
    },
    {
      paragraphs: [
        "Energy isn't a molecule, but ATP is the molecule that stores energy.",
        "It's kept until it's needed, and then carried to wherever that is.",
      ],
    },
    {
      paragraphs: [
        "When an enzyme, or any other piece of cellular machinery, has a job to do, it uses ATP.",
        "By releasing the energy stored in it, the cell can move a muscle, make a protein, send a nerve signal or carry out thousands of different processes — all thanks to enzymes.",
      ],
    },
    {
      paragraphs: [
        "That is why nutrition labels describe the molecules and materials a food contains: proteins, fats, carbohydrates, vitamins and minerals.",
      ],
    },
    {
      paragraphs: [
        "Calories, on the other hand, aren't an ingredient: they're a measure of how much energy cells can get out of that food. The more calories, the more ATP.",
      ],
    },
    {
      paragraphs: [
        "We don't eat calories. We eat molecules.",
        "Some of them turn into energy, and others turn, quite literally, into our own body.",
      ],
    },
  ],

  // ── «La microbiota» · Los nutrientes → Microbiota ─────────────────────────
  "nutricion-microbiota": [
    {
      paragraphs: [
        "Trillions of microorganisms live in your gut: bacteria, fungi, viruses and other microbes that make up your microbiome.",
        "They aren't intruders: they live alongside you and carry out essential jobs.",
        "In exchange for somewhere to live and the scraps of food you can't digest, they do work your body couldn't do on its own.",
      ],
    },
    {
      paragraphs: [
        "Their favorite food is dietary fiber. Since our gut doesn't have the enzymes to digest it, the microbiome ferments it instead.",
        "In that process it produces short-chain fatty acids (acetate, propionate, butyrate), which feed the cells of the gut and help regulate metabolism.",
        "Some microorganisms also produce vitamins, such as vitamin K and some of the B group, along with molecules that help keep the immune system in balance.",
      ],
    },
    {
      paragraphs: [
        "Some of the molecules the microbiome makes can travel through the blood or send signals along the vagus nerve.",
        "Thanks to that line of communication, the microbiome can influence how the brain works, your mood and your learning, through the making of serotonin.",
      ],
    },
    {
      paragraphs: [
        "Looking after your microbiome is looking after you — your body, your brain and your mental health.",
        "The wider the variety of plant foods you eat, the more diverse your microbiome tends to be, and that diversity goes hand in hand with better health.",
      ],
    },
  ],

  // ── «El hambre» · Microbiota → El hambre ──────────────────────────────────
  "nutricion-hambre": [
    {
      titulo: "The stomach finishes digesting",
      paragraphs: [
        "Several hours after your last meal, the stomach finishes emptying its contents into the small intestine.",
        "Most of the nutrients from that meal have already been absorbed, and the body enters the period between meals, known as the postabsorptive state.",
      ],
    },
    {
      titulo: "The gut's «self-cleaning» begins",
      paragraphs: [
        "When the stomach and the intestine stay empty for about 90–120 minutes, the Migrating Motor Complex (MMC) switches on.",
        "It is a series of strong, coordinated contractions that sweep along the digestive tract, pushing leftover food, bacteria and secretions toward the colon.",
        "This mechanism helps keep the gut clean and limits the overgrowth of bacteria in the small intestine.",
        "A curious detail: every time we eat, the MMC stops, and it starts again once the gut has been empty long enough.",
      ],
    },
    {
      titulo: "The hunger signal appears",
      paragraphs: [
        "While the digestive tract stays empty, production of ghrelin goes up — a hormone made mainly in the stomach.",
        "Ghrelin travels to the hypothalamus, where it switches on the neurons behind the sensation of hunger and pushes us to look for food.",
      ],
    },
    {
      titulo: "The body uses its glycogen",
      paragraphs: [
        "With no new nutrients coming in, the body first uses the glycogen stored in the liver, which keeps the concentration of glucose in the blood steady for several hours.",
        "The brain keeps getting glucose for as long as those stores last.",
      ],
    },
    {
      titulo: "Why do some people get a headache or feel weak?",
      paragraphs: [
        "During this period some people feel intense hunger, tiredness, difficulty concentrating, irritability or a headache.",
        "These sensations may come from adapting to the fast, from slight dips in glucose in sensitive people, from dehydration, or even from caffeine withdrawal in people who usually drink it.",
        "Important: not everyone gets these symptoms.",
      ],
    },
    {
      titulo: "The body starts using fat",
      paragraphs: [
        "As the fast goes on, insulin falls and more fatty acids are released from fat tissue.",
        "Many organs, muscle among them, start using that fat as fuel, saving the glucose for the tissues that need it most.",
      ],
    },
    {
      titulo: "If there is excess body fat",
      paragraphs: [
        "In people with overweight or obesity, the fat stores are larger.",
        "With an appropriate, supervised calorie deficit, the body can use part of those stores for energy.",
        "Over time this can help reduce body fat and improve measures such as insulin sensitivity, blood pressure and metabolic health.",
        "It's important to tell this apart from «going hungry»: the aim isn't to suffer intense hunger, but to keep an appropriate energy balance.",
      ],
    },
    {
      titulo: "Metabolic adaptation",
      paragraphs: [
        "After several hours without eating, the body gets progressively better at burning fat and, if the fast goes on, the liver starts producing small amounts of ketone bodies.",
        "Many people report that, once the first phase is over, hunger eases off, because the body is using its energy stores more efficiently.",
      ],
    },
    {
      titulo: "We eat again",
      paragraphs: [
        "When we eat, the stomach fills up again, the Migrating Motor Complex stops and digestion begins once more.",
        "Glucose and insulin rise, ghrelin falls, and the satiety hormones appear — GLP-1, PYY and cholecystokinin (CCK) — telling the brain we've had enough.",
      ],
    },
  ],

  // ── «El hambre: una mirada holística» · los 4 bloques de la página ────────
  // Se leen en dos sitios (la página y la galería de Ilustraciones), así que una
  // sola traducción sirve a los dos. Las negritas **…** las pinta la página: hay
  // que conservarlas donde estén en el español.
  "nutricion-hambre-holistica": [
    {
      titulo: "Your microbiome gets hungry too",
      paragraphs: [
        "When we feel hungry, we don't always eat only what our body needs. Our microbiome influences our cravings through the gut-brain axis, pushing us toward the foods that best feed whichever bacteria dominate our gut.",
        "So if our diet is built on sugar and ultra-processed food, those are the foods we'll tend to crave. When we bring in vegetables, fruit and fresh food consistently, the microbiome changes — and so do our cravings.",
        "Changing how you eat is hard at first because you aren't only changing a habit: you're also transforming the ecosystem that lives inside you.",
      ],
    },
    {
      titulo: "Hunger can also be emotional",
      paragraphs: [
        "Often we aren't physically hungry: there's an emotional emptiness we're trying to fill with food. Seen through an energetic lens, that emptiness relates to the third chakra, the solar plexus, associated with self-esteem, security and personal power.",
        "Psychology also explains that stress, anxiety, sadness or loneliness can lead us to eat in search of immediate relief. That relief, though, tends to be temporary, and the emptiness stays.",
        "Before eating, maybe the question is: **am I hungry for food, or for something I need to feel?**",
      ],
    },
    {
      titulo: "The body knows when to stop",
      paragraphs: [
        "Every time we eat, our body regulates hunger naturally. Fat cells release leptin, a hormone that tells the hypothalamus how much energy we have stored and when we've eaten enough.",
        "But if we spend a long time ignoring our satiety signals and eating past them, the brain can stop responding to that signal as well as it used to. This is known as **leptin resistance**, and it makes it harder to feel full.",
        "Learning to listen to real hunger is also a way of getting back your body's natural intelligence.",
      ],
    },
    {
      titulo: "We choose food according to how we feel",
      paragraphs: [
        "Eating isn't an entirely rational act. Our emotional state shapes the decisions we make, and each food produces a different response in the body.",
        "Fresh food supports a healthy microbiome, keeps glucose steady and helps hold a better physical and emotional balance. A diet high in ultra-processed food, on the other hand, promotes inflammation, blood sugar spikes and a greater sense of fatigue.",
        "Food doesn't only provide calories: it also sends information to our body. What we choose to eat ends up shaping how we think, how we feel and the energy we live with.",
      ],
    },
  ],

  // ── «Lo integral» · El hambre → Tu plato ──────────────────────────────────
  "nutricion-integral": [
    {
      titulo: "Nature made a complete food",
      paragraphs: [
        "Every part of the grain has a job: the bran protects, the germ nourishes and the endosperm provides energy.",
      ],
    },
    {
      titulo: "What refining takes away",
      paragraphs: [
        "To make white flour, industry separates out the bran and the germ. All it keeps is the endosperm, the part richest in starch.",
        "Along with the bran and the germ go much of the fiber, the vitamins, the minerals, the antioxidants and the healthy fats.",
      ],
    },
    {
      titulo: "White flour",
      paragraphs: [
        "The endosperm is milled into a very fine powder: white flour. It's easier to store and to work with, but nutritionally it is a far simpler food.",
        "Without the whole grain's fiber, the starch is digested much faster, pushing blood glucose up and leaving you less full.",
      ],
    },
    {
      titulo: "What we pulled apart",
      paragraphs: [
        "Nature put those three parts together for a reason.",
        "We pulled them apart... and then we try to win back their benefits by adding fiber and vitamins from somewhere else.",
      ],
    },
  ],

  // ── «La diabetes» · Calorías y macros → el test del azúcar ────────────────
  "nutricion-diabetes": [
    {
      paragraphs: [
        "When we eat, food is digested and part of its nutrients turns into glucose, one of the body's main sources of energy. Glucose passes into the bloodstream, so its concentration in the blood rises for a while.",
        "For that glucose to be usable, the pancreas releases insulin. Insulin works as a signal that lets the body's cells take glucose out of the blood and use it as energy.",
      ],
    },
    {
      paragraphs: [
        "In diabetes, this system for regulating glucose is disrupted. Depending on the type of diabetes, the body may produce very little insulin, none at all, or fail to respond to it properly.",
        "When insulin doesn't work as it should, glucose has more trouble passing from the blood into the cells. As a result, it starts building up in the bloodstream.",
      ],
    },
    {
      paragraphs: [
        "After eating, it is normal for blood glucose to rise. In someone with diabetes, however, a lack of insulin or resistance to its action can keep that glucose from being brought under control.",
        "This leads to hyperglycemia: blood glucose levels that are too high. Kept up over a long time, excess glucose can begin to affect different tissues and organs.",
      ],
    },
    {
      paragraphs: [
        "Diabetes isn't simply a matter of «high sugar». When glucose stays elevated for years, it can cause progressive damage to blood vessels and nerves, raising the risk of cardiovascular disease and affecting organs such as the kidneys and the eyes.",
        "That is why keeping blood glucose in check, following the prescribed treatment and holding on to healthy habits are essential to prevent or delay its complications. Diabetes can be managed, but it needs continuous follow-up.",
      ],
    },
  ],

  // ── «Los grandes ciclos de la naturaleza» ─────────────────────────────────
  // Primera lectura de «¿De dónde vienen los nutrientes?».
  "nutricion-ciclos": [
    {
      titulo: "The water cycle",
      paragraphs: [
        "The water cycle is the continuous process by which water circulates between the land surface, the atmosphere and the oceans.",
        "The Sun's energy makes water evaporate; it rises and forms clouds by condensation.",
        "The water then returns to the surface as rain or snow, soaking into the soil, feeding aquifers and rivers, until it finally reaches the sea, where the cycle begins again.",
        "This process regulates the climate and keeps water available for every living thing.",
      ],
    },
    {
      titulo: "The carbon cycle",
      paragraphs: [
        "The carbon cycle describes the continuous movement of carbon between the atmosphere, living beings, the oceans and the Earth's crust.",
        "Plants capture carbon dioxide through photosynthesis and build it into organic matter, which then passes to animals and microorganisms through food.",
        "Respiration, decomposition and combustion return carbon to the atmosphere, while part of it stays locked away for millions of years in rocks and fossil fuels.",
      ],
    },
    {
      titulo: "The oxygen cycle",
      paragraphs: [
        "The oxygen cycle is the continuous exchange of this element between the atmosphere, living beings and ecosystems.",
        "During photosynthesis, plants, algae and cyanobacteria release oxygen into the environment.",
        "Aerobic organisms use that oxygen in cellular respiration to obtain energy, producing carbon dioxide and water, which photosynthetic organisms use again — keeping the atmosphere in balance.",
      ],
    },
    {
      titulo: "The nitrogen cycle",
      paragraphs: [
        "The nitrogen cycle turns atmospheric nitrogen into forms that living beings can take in and use.",
        "Nitrogen-fixing bacteria convert nitrogen from the air into compounds plants can make use of, and those plants are then eaten by animals.",
        "When animals eat plants —or eat other animals that ate them— they get that nitrogen.",
        "That nitrogen ends up as part of amino acids, which are the components of proteins. And proteins build, among other things, muscle structures and a great many enzymes.",
        "After death, or once waste is excreted, other microorganisms recycle the nitrogen.",
        "Finally, part of it can go back to the atmosphere as N₂ through denitrification, closing the cycle.",
      ],
    },
    {
      titulo: "The phosphorus cycle",
      paragraphs: [
        "The phosphorus cycle describes how this element moves between rocks, soil, water and living organisms.",
        "Erosion releases phosphates from rocks; plants absorb them, and animals take them in through food.",
        "Once organisms decompose, phosphorus returns to the soil or to aquatic sediments, where it can stay for millions of years before geological processes bring it back into the cycle.",
      ],
    },
  ],

  // ── «¿De dónde vienen los nutrientes?» · las cinco lecturas del viaje ─────
  // De la roca al suelo, del suelo a la raíz, de la raíz a la hoja, de la hoja
  // al fruto, y la rama del animal. Es el texto más hablado de Nutrición: frases
  // cortas, tuteo y golpes de efecto al cerrar cada viñeta. El inglés tiene que
  // sonar igual de dicho en voz alta, no a libro de texto.
  "nutricion-origen-tierra": [
    {
      paragraphs: [
        "The calcium in your bones, the iron in your blood, the magnesium that fires up your enzymes… nobody manufactures any of those atoms. There is no living thing capable of creating an atom of iron.",
        "There is only one warehouse: rock. Every mineral in your body today was once inside a stone.",
        "So the first question in nutrition isn't what to eat. It's how an atom gets out of a rock and ends up inside one of your cells.",
      ],
    },
    {
      paragraphs: [
        "What we call soil isn't dead dust. It's a mixture of grains of rock, water, air, the remains of what was once alive… and a number of living things that is hard to picture.",
        "A single handful of healthy soil holds more microorganisms than there are people on the whole planet.",
        "They do the slow work: roots and the liquids they release wear the rock away, and bacteria and fungi break down the leaf litter and everything that dies until it's back to loose pieces. Soil is, quite literally, a digestion happening under your feet.",
      ],
    },
    {
      paragraphs: [
        "A root can't swallow a grain of sand. It can only absorb what is dissolved in the water of the soil and carries an electrical charge: ions.",
        "Nitrogen comes in as nitrate or ammonium, phosphorus as phosphate, and potassium, calcium, magnesium and iron as loose ions. Nothing else.",
        "And here water and its two poles turn up again, the same as you already saw: it surrounds the ions, pulls them off the rock and keeps them floating. Without water, the minerals in the soil are out of reach even though they're right there.",
      ],
    },
    {
      paragraphs: [
        "The tip of every root is covered in extremely fine hairs. They aren't decoration: they multiply the surface in contact with the water of the soil, exactly as the villi of your intestine multiply yours. The same solution to the same problem.",
        "And there's something more surprising. The soil almost always holds FEWER minerals than the inside of the root, so getting in means going against the current. The plant spends ATP pumping protons outward to create an electrical gradient, and uses that gradient to drag the ions in.",
        "Absorbing is never free. Not for a root, and not for you.",
      ],
    },
    {
      paragraphs: [
        "Almost every plant in the world makes a deal with fungi in the soil. The fungus enters the root and spreads its threads far beyond anywhere the root could reach: a network that multiplies its range.",
        "The fungus hands over water, phosphorus and other minerals that are hard to come by. The plant pays in glucose freshly made in its leaves. Neither of them could live nearly this well apart.",
        "And legumes go one step further: on their roots they form small nodules where bacteria live that can fix the nitrogen in the air. Atmospheric nitrogen is mostly there as N₂, a molecule plants can't use directly. These bacteria can turn it into nitrogen compounds the plant can take in and use.",
        "Thanks to that relationship, legumes can build up a substantial amount of nitrogen in their tissues and use it to make amino acids and proteins. And when the roots and what's left of the plant stay in the soil and break down, part of that nitrogen can become available to other organisms, helping keep the soil fertile.",
        "A plant depends on its microbes to feed itself. Exactly like you.",
      ],
    },
    {
      paragraphs: [
        "Living soil, with organic matter and its fungi and bacteria, hands over minerals; exhausted, compacted soil hands over less, and whatever grows on it comes out poorer.",
        "A plant can't put into its fruit what it never found below. And you can't absorb what the plant never managed to store.",
        "The iron carrying oxygen around your blood right now went through a rock, through the water of the soil, through a fungus and through a root before it reached you.",
      ],
    },
  ],

  "nutricion-origen-planta": [
    {
      paragraphs: [
        "A plant has a problem you don't have: what it needs is in two opposite places, and it can't move to go and get it.",
        "Down below, in the dark, are water and minerals. Up above, light and air. And all of it has to come together in the same place to make food.",
        "Everything you see in a plant —root, stem, leaves— is the answer to that problem. There isn't one decorative piece.",
      ],
    },
    {
      paragraphs: [
        "Inside, a plant is crossed from top to bottom by two channels running side by side. The xylem carries water and minerals up from the root to the furthest leaf: hollow tubes, cells that emptied out and died to leave the way clear. Wood is xylem.",
        "The phloem goes down, sharing out the glucose freshly made in the leaves to wherever it's needed — a growing root, a flower, a fruit filling out. This one is made of living cells. When you bite into the stalk of a chard leaf, you're chewing those pipes.",
        "A tree can carry water from its roots up to leaves tens of meters above, with no heart and no pump pushing it from below.",
        "How does it manage that?",
        "The key is in the leaves. When water reaches them, part of it evaporates into the atmosphere through tiny pores called stomata. That loss of water creates a kind of pull upward.",
        "But that pull is only possible because water molecules stay joined to one another. Thanks to cohesion, when a water molecule leaves the leaf it pulls on the ones behind it inside the vessels of the xylem. Those, in turn, pull on the next ones, forming an unbroken column of water that runs from the leaves down to the roots.",
        "That's how water can climb the whole tree. Evaporation in the leaves creates the pull, cohesion holds the column of water together, and the roots supply the water that joins the system.",
        "The Sun's energy provides the heat needed for the water to evaporate in the leaves, and it's that evaporation that drives the water upward.",
      ],
    },
    {
      paragraphs: [
        "Your cells have a soft border made of fat. Plant cells have that… and a rigid wall of cellulose outside it. That wall is the fiber you can't digest: it's what gives a stem its structure, and what arrives intact in your large intestine to feed your microbiome.",
        "Inside, most of the space is taken up by an enormous bag of water, the vacuole. Full, it pushes against the wall and the cell stands firm; empty, the cell shrivels. That is exactly what a lettuce is: crisp or limp. The freshness of a vegetable isn't a metaphor, it's water pressure.",
        "And the cells of the green parts also hold chloroplasts: the factories where photosynthesis happens.",
      ],
    },
    {
      paragraphs: [
        "The plant makes glucose in its leaves, but it doesn't leave it there: it sends it off to be stored. And depending on where it stores it, a different food appears.",
        "In roots and tubers it builds a pantry of starch for the winter or for sprouting —carrot, beetroot, potato, sweet potato— and that's why they're sweeter and denser. In seeds it keeps the most valuable things, because that's where the next generation goes: protein, fat and minerals. In leaves and stems there's hardly any store at all: water, fiber, vitamins and minerals, a lot of bulk and very few calories.",
        "That's why a potato and a spinach leaf are nothing alike, even though both are plants: you aren't eating the same part of the story.",
      ],
    },
  ],

  "nutricion-origen-hoja": [
    {
      paragraphs: [
        "If the plant is the house, the leaf is the factory. And its shape gives it away: flat, so light falls on the largest possible surface, and paper-thin, so light gets through every layer and air can come and go without delay.",
        "Outside it wears a waterproof layer of wax —which is why water beads off it— and under that a skin of transparent cells that lets light through without using it.",
        "In the middle is the layer that works: tall cells packed together like columns, crammed with chloroplasts. Below them, air spaces where the gases circulate. And running through all of it, the veins: xylem and phloem.",
        "Every leaf is a solar panel, a lung and a kitchen all at once. And out of what happens inside it comes, without exception, all the food on the planet.",
      ],
    },
    {
      paragraphs: [
        "On the underside of the leaf there are thousands of tiny mouths, each one made of two cells that can swell to open or empty to close. They're called stomata.",
        "And they face an impossible dilemma. Open, and the carbon dioxide needed to make food comes in… but water escapes. Closed, and the water is saved… but the raw material is cut off.",
        "The leaf spends its day deciding that. In strong heat it closes its stomata so as not to dry out, and while they're closed it almost stops growing: it can't eat and drink at the same time.",
        "It's the same kind of balance your body negotiates all day long. Nobody gets every condition at once.",
      ],
    },
    {
      paragraphs: [
        "Inside the cells of the leaf there are green sacs, the chloroplasts, full of chlorophyll: the molecule that catches light. It absorbs red and blue very well, and bounces green back — which is why leaves are usually green.",
        "With the energy it does catch, it does something extraordinary: it breaks water molecules apart to steal their electrons and their hydrogen.",
        "And splitting water leaves oxygen over, which the leaf releases into the air because it has no use for it. The oxygen you're breathing right now is a leaf's waste.",
      ],
    },
    {
      paragraphs: [
        "Now the leaf has energy from light and hydrogen from water. What it's missing is the skeleton: carbon. And it takes that from the air, from the carbon dioxide that came in through the stomata.",
        "With those three things —air, water and light— it assembles a molecule of glucose. There, at that exact point, is where a stone, a puddle and a ray of sunlight turn into food. It is the only way in: all the energy and all the carbon moving through the living world entered here.",
        "The plant then links those glucoses together and makes starch to store and cellulose to hold itself up, and with the minerals that came up the xylem it makes amino acids, fats and vitamins. Bread, oil, fruit, lentils. And the steak, the cheese and the egg too, because the animal ate plants.",
        "The glucose in your blood right now was carbon dioxide floating in the air a few months ago. The leaf is the door Life comes into the world through, and you are on the other side of that door.",
      ],
    },
  ],

  "nutricion-origen-fruta": [
    {
      paragraphs: [
        "Before spending energy on reproducing, a plant needs to know whether the moment has come. It reads the light, the temperature, the water and the nutrients around it. If the signals say conditions are right, it switches on a signal called florigen that travels from the leaves to the growing points. It's like a message running through the plant saying: «Now. It's time to flower».",
        "Then it all begins. The flower appears, pollen arrives, it joins the ovule and a seed starts to form: a whole new plant, in miniature. And around that small life, the plant starts building a box: walls, water, sugar, color and scent. That box is the fruit.",
        "Here's the part almost nobody tells you: the fruit wasn't made for you. It was made for the seed. That's why, while the seed is still forming, the fruit is usually green, hard, sour and, in some species, even bitter or toxic. It isn't a fault. It's protection. The plant doesn't want anyone eating its fruit too soon and destroying the seed. It's like a sign saying: «Not yet».",
      ],
    },
    {
      paragraphs: [
        "Once the seed is ready, the fruit sends out a signal: a gas called ethylene. And that gas changes the whole sign at once.",
        "The stored starch breaks down into sugars and sweetness appears. The acids drop. Enzymes dissolve the glue holding its cell walls together and the fruit softens. Dozens of scent molecules are made. And the color changes.",
        "All of that together is an advertisement: «eat me, take the seed far away and leave it somewhere else». The flavor you love so much is a home-delivery strategy.",
        "And since ethylene is a gas, it spreads: that's why one ripe banana speeds up the whole fruit bowl, and why the fridge slows ripening down.",
      ],
    },
    {
      paragraphs: [
        "The green is chlorophyll. As the fruit ripens it's destroyed, and then what was already underneath, hidden, comes into view.",
        "Orange and yellow are carotenoids: from one of them your body makes vitamin A, and two others gather right in your retina; the red of a tomato is another one from the family. Red, purple and blue are anthocyanins, the plant's sunscreen, and they shift shade with acidity — which is why red cabbage turns another color if you cook it with lemon. The white of garlic and onion hides sulfur compounds, and the strong green of cabbage and broccoli hides others that taste slightly bitter.",
        "Not one of those colors was invented with your health in mind. They're shields against the sun, warnings to animals, mild poisons against insects. But we've been eating them for millions of years and our cells have learned to make use of them, as you already saw with phytochemicals.",
        "We aren't the intended recipients. We're the ones who learned to read the message.",
      ],
    },
    {
      paragraphs: [
        "Now that sentence stops being a nice piece of advice. Each color is a different family of molecules, with a different job, and none of them does another one's work. A plate of a single color is a library with a single book.",
        "And you also understand why the moment of harvest matters. A fruit picked green so it survives the journey can turn red and soft on the outside, because ethylene does its part, but it's already cut off from the plant: nobody is still sending it sugar. Ripening on the branch and ripening in a truck are not the same thing, however alike they look from outside.",
        "What you eat is the end of a very long journey: a rock, a fungus, a root, a set of pipes, a leaf, a flower and a promise. And now that journey carries on inside you.",
      ],
    },
  ],

  "nutricion-origen-animal": [
    {
      paragraphs: [
        "Up to here everything came from a plant. But there are things on your plate that aren't plants: an egg, a steak, a cheese, a sardine. And none of those animals made anything from scratch: they ate plants, or they ate someone who ate plants. Always.",
        "An animal spends its life spending: it moves, it keeps itself warm, it breathes, it repairs itself. Almost all the energy it eats is burned on living, and only a small part stays stored in its body. That's why it takes a lot of plant to produce a little meat: every step of the chain loses most of what it received.",
        "It's the same reason there is far more grass than cows in the world, and far more cows than lions.",
      ],
    },
    {
      paragraphs: [
        "If all it did was lose, there'd be no point eating it. What happens is that it also transforms and concentrates.",
        "It arranges amino acids in a proportion very close to the one you need, and that's where «complete protein» comes from. It keeps iron inside a molecule your gut absorbs far better than the iron in plants. It stores vitamins in its liver and its fat. And it lengthens the short fats from the plant into the long ones your brain uses. Eating animal food is, in part, taking advantage of work already done.",
        "And there's one vitamin that breaks the pattern: B12. No plant makes it… but no animal makes it either. Bacteria make it: the animal carries them in its digestive tract or swallows them with soil, and stores the vitamin in its liver and its muscle. We get it from there.",
        "That's why it's the only one a fully plant-based diet needs to take separately. It isn't a shortcoming of plants: that work is done by microbes.",
      ],
    },
    {
      paragraphs: [
        "The sea has no leaves, and yet the story is exactly the same. Down there, microscopic algae float about doing photosynthesis just as leaves do: they're the planet's invisible leaves, and they produce a good part of the oxygen you breathe.",
        "They're the ones that make the long omega-3s. The small fish eats them, the big fish eats the small one, and with every bite they build up. So salmon doesn't invent its omega-3: it inherited it from an alga.",
        "And what we don't want gets concentrated the same way: mercury also climbs from link to link, which is why it builds up in big old fish and not in small ones.",
      ],
    },
    {
      paragraphs: [
        "An egg from a hen that has pecked at grass and insects doesn't carry the same fat as one from a hen fed only grain. Milk from a pasture-fed animal isn't the same as milk from an animal on feed either.",
        "It isn't magic or marketing: an animal can't put into its meat, its egg or its milk something that never came in through its mouth. What it ate ends up reaching you through it.",
        "And with this the whole journey closes. The cycles of the planet, the rock, the soil, the root, the pipes, the leaf, the flower and the fruit… and sometimes one more link, an animal that carried it before you did.",
        "Nothing about you was invented from scratch. It was all already here, going round and round, and now it's your turn.",
      ],
    },
  ],

  // ── Un cómic por GRUPO de nutrientes · /metodo/nutricion/nutrientes/:key ──
  // Las claves son las de la galería (`nutriente-<key>`), y el orden de viñetas
  // es el del Record de comicsNutrientes.ts.
  "nutriente-carbohidratos": [
    {
      paragraphs: [
        "We know vegetables and fruit are healthy. But why? Almost nobody has ever explained it to us.",
        "The answer, really, is in how our body gets its energy.",
        "Our cells need glucose to make ATP, the molecule they use to do their work.",
        "If there isn't enough glucose, our wise body can turn to fat for fuel. But that's another story, called ketosis...",
      ],
    },
    {
      paragraphs: [
        "We need glucose, yes. But we need it little by little. If it reaches the blood too fast, the body has to make a big effort to keep its balance.",
        "Ideally, the cells receive it gradually.",
        "And that is exactly what vegetables, fruit and legumes achieve: their structure makes digestion slower, so glucose is released bit by bit — just the way our body prefers it.",
      ],
    },
    {
      paragraphs: [
        "This is why we like sugar so much.",
        "It barely needs digesting, and its molecules reach the blood very fast, causing a glucose spike the body has to answer immediately.",
        "The problem isn't glucose. The problem is the speed at which it arrives.",
      ],
    },
    {
      paragraphs: [
        "So don't judge yourself. Your body is simply responding the way it has learned to over millions of years.",
        "But now that you understand how it works, you can choose foods that work in favor of your balance.",
      ],
    },
  ],

  "nutriente-grasas": [
    {
      paragraphs: [
        "For many years we were made to believe that all fat was bad. The reality is very different. Without fat you wouldn't exist, because neither your cells nor your hormones could exist.",
        "Fats aren't only there to store energy. They also build the membranes of every cell, take part in making hormones and help absorb essential vitamins. They are an indispensable building material.",
      ],
    },
    {
      paragraphs: [
        "There are different kinds of fat, and they aren't all alike. The difference is in the shape of their molecules. And that shape changes how our cells work.",
        "Unsaturated fats have a curved shape. That small bend is what lets cells communicate, and it keeps cell membranes flexible — just as a healthy cell needs.",
      ],
    },
    {
      paragraphs: [
        "Saturated fats are completely straight. They make membranes more rigid and, in excess, can make it harder for them to work with the same flexibility. Our body uses them, but a balance between different kinds of fat lets cells work better.",
        "Trans fats are especially harmful. Their structure disrupts the normal working of membranes and promotes processes linked to inflammation and to a rise in LDL cholesterol, increasing the risk of cardiovascular disease.",
      ],
    },
    {
      paragraphs: [
        "Fat isn't the enemy. What matters is choosing the fats our cells have spent millions of years working with.",
        "Because every membrane in your body is built, quite literally, out of the fat you eat.",
      ],
    },
  ],

  "nutriente-proteinas": [
    {
      paragraphs: [
        "When you eat protein, you aren't feeding your muscles directly.",
        "First your body has to take it completely apart.",
        "Only then can it decide what to do with each of the pieces.",
        "Digestive enzymes cut proteins down into much smaller molecules called amino acids. Those are the real bricks the body works with.",
      ],
    },
    {
      paragraphs: [
        "There are twenty main amino acids. Our body can make some of them. Others, the essential ones, we can only get through food.",
        "Once inside the cells, those amino acids no longer «belong» to the soy, the egg or the lentils.",
        "Now they're simply pieces available for building whatever the body needs.",
      ],
    },
    {
      paragraphs: [
        "Some cells will use them to make muscle. Others will make collagen for the skin. Others will produce antibodies, hormones or thousands of different proteins.",
        "And among all those proteins there are some that matter especially: enzymes.",
        "Enzymes are what make almost every chemical reaction in the body happen at the speed needed to keep us alive.",
      ],
    },
    {
      paragraphs: [
        "An enzyme doesn't provide energy. It isn't used up either. It simply brings the right molecules together and makes the reaction happen millions of times faster.",
        "Thanks to enzymes we can digest food, copy DNA, make ATP, repair tissue and carry out practically every function needed to live. Without them, Life would be too slow to exist.",
        "Every protein you eat ends up as amino acids. And out of those same amino acids your body makes muscle, skin, hormones, antibodies... and even the enzymes that keep all your cells running.",
        "Once again, what you eat ends up literally turning into you.",
      ],
    },
  ],

  "nutriente-vitaminas": [
    {
      paragraphs: [
        "If proteins are the bricks... and glucose provides the energy... then what are vitamins for? The answer is unexpected.",
        "Vitamins don't provide energy. They don't build muscle or membranes either. And yet, without them a great many cellular reactions simply couldn't happen.",
      ],
    },
    {
      paragraphs: [
        "Vitamins switch enzymes on. Without vitamins, enzymes would sit there switched off, «without Life».",
        "Even though we only need them in very small amounts... they take part in thousands of different processes: making energy, repairing tissue, producing DNA or protecting our cells.",
        "Our body is wise and reuses them over and over for as long as it can.",
      ],
    },
    {
      paragraphs: [
        "Each vitamin has a different job. Some help the immune system. Others are involved in vision, in bone, in blood or in the nervous system.",
        "On top of that, when free radicals appear —very unstable molecules, because they're missing an electron— they try to steal one from other molecules, setting off a chain reaction. Antioxidants can donate the electrons needed to neutralize them and stop that process.",
      ],
    },
    {
      paragraphs: [
        "That is why a varied diet matters so much. No single food holds every vitamin in the right amount. Our body needs many different pieces.",
        "Vitamins aren't the fuel. They aren't the bricks either. They're the small tools that keep the whole machinery of the body running.",
      ],
    },
  ],

  "nutriente-minerales": [
    {
      paragraphs: [
        "We've met carbohydrates, fats, proteins and vitamins. But one piece is still missing: minerals. And without them, Life wouldn't be possible either.",
        "Minerals are chemical elements. Our body can't make them. Every atom of calcium, iron or magnesium you have arrived one day through food or water.",
      ],
    },
    {
      paragraphs: [
        "Some minerals are part of the structure of our body. Calcium and phosphorus help build bones and teeth. They don't coat them. They are part of them.",
        "Other minerals let cells work. Sodium and potassium are what make it possible for neurons to transmit electrical impulses. Calcium is what lets muscles contract.",
      ],
    },
    {
      paragraphs: [
        "Iron has a very special job. It is part of hemoglobin, the protein that carries oxygen through the blood. Without iron, our cells couldn't get oxygen.",
        "Minerals such as magnesium and zinc help hundreds of enzymes do their work. Without them, many reactions in the body would be far slower, or simply wouldn't happen.",
      ],
    },
    {
      paragraphs: [
        "Minerals are what let your cells, your organs and, by extension, you, work at all. Minerals make Life possible.",
      ],
    },
  ],

  "nutriente-fibra": [
    {
      paragraphs: [
        "Fiber is a carbohydrate too. But there's one big difference: our enzymes can't break it down. That's why it reaches the large intestine almost intact.",
        "Not all fiber is the same. There are two broad types: soluble fiber and insoluble fiber. Both matter, but they do different jobs.",
      ],
    },
    {
      paragraphs: [
        "Soluble fiber mixes with water and forms a gel. That gel slows digestion down and lets glucose reach the blood little by little. Indirectly, it lowers cholesterol levels in the blood.",
        "Insoluble fiber doesn't form a gel. It adds bulk to the stool and helps it move through the gut. It helps keep bowel movements healthy.",
      ],
    },
    {
      paragraphs: [
        "But fiber has another, even more surprising job. Many of the bacteria in our gut can feed on it. We can't digest it. They can.",
        "As they ferment that fiber they produce small molecules called short-chain fatty acids. These molecules help keep the gut healthy and take part in regulating the immune system and metabolism.",
      ],
    },
    {
      paragraphs: [
        "Fiber is found mainly in fruit, vegetables, legumes, nuts and whole grains. The less processed a plant food is, the more fiber it tends to keep.",
        "Fiber doesn't give our body much energy. But it feeds our microbiome, regulates digestion and helps keep the body in balance. Sometimes what matters most isn't what you digest... but what feeds the other parts of you.",
      ],
    },
  ],

  "nutriente-colesterol": [
    {
      paragraphs: [
        "For years we've heard about «good» cholesterol and «bad» cholesterol. But there's an important detail here:",
        "Cholesterol is always the same molecule. What changes is who carries it.",
        "Cholesterol isn't an enemy. In fact, all your cells need it. It is part of cell membranes and it is essential for making hormones, vitamin D and bile acids.",
      ],
    },
    {
      paragraphs: [
        "Since cholesterol can't travel through the blood on its own, it needs transport. That transport is done by particles called lipoproteins.",
        "LDL carries cholesterol from the liver out to the tissues. That is a completely normal job. Cells need that cholesterol in order to work.",
      ],
    },
    {
      paragraphs: [
        "The trouble starts when there are too many LDL particles circulating. Some can get stuck in the wall of the arteries. Over time, that can set off an inflammatory response.",
        "The immune system tries to clear that cholesterol away. Macrophages swallow it up over and over. But if the build-up continues, they end up turning into foam cells and plaque starts to form.",
      ],
    },
    {
      paragraphs: [
        "HDL goes the other way. It picks up some of the leftover cholesterol from tissues and arteries and takes it back to the liver to be recycled or removed.",
        "That's why people usually call LDL «bad cholesterol» and HDL «good cholesterol». In reality neither of them is good or bad. Both are necessary. What matters is keeping the balance.",
        "Cholesterol isn't the problem. The problem appears when too many LDL particles get stuck in the artery wall and the body can't clear them out. Health depends on balance, not on getting rid of cholesterol.",
      ],
    },
  ],

  "nutriente-etanol": [
    {
      paragraphs: [
        "Ethanol, the alcohol in alcoholic drinks, isn't a nutrient. It doesn't build tissue. It doesn't make hormones. It doesn't help cells work better.",
        "When alcohol enters the blood, the body changes its priorities. The liver pushes many of its usual tasks into the background in order to start clearing it as soon as possible.",
      ],
    },
    {
      paragraphs: [
        "This happens because ethanol can damage our cells. So the body tries to turn it quickly into other molecules it can get rid of.",
        "The first product of that transformation is acetaldehyde. And here's the real problem: acetaldehyde is even more toxic than the alcohol itself.",
        "If acetaldehyde stays in the cells too long, it can damage proteins, membranes and DNA. That's why the liver tries to convert it quickly into a far less harmful molecule: acetate.",
      ],
    },
    {
      paragraphs: [
        "While the liver is busy clearing the alcohol, other jobs move into the background. Glucose production drops, for instance, and fat metabolism is disrupted.",
        "Alcohol also affects the brain. It changes the communication between neurons, altering judgment, coordination, memory and reaction time.",
        "On top of that, metabolizing alcohol generates more free radicals. If there are too many, they can cause oxidative stress and damage proteins, fats and DNA.",
        "Going deeper: GABA, the neurotransmitter in charge of relaxation, has its action increased, producing relaxation and a drop in brain activity. Glutamate, on the other hand, has its activity reduced, which affects memory and the ability to concentrate. Serotonin is disrupted too, which can alter mood, emotions and behavior, favoring changes such as disinhibition, impulsivity or emotional volatility.",
      ],
    },
    {
      paragraphs: [
        "Our body doesn't need alcohol in order to work.",
        "It isn't a building material. It can provide energy, but the body doesn't treat it as an essential nutrient, and its priority is to get rid of it rather than make use of it.",
        "What you do always leaves a trace.",
      ],
    },
  ],

  "nutriente-agua": [
    {
      paragraphs: [
        "Before what it's for, it's worth knowing what it is. Water is two hydrogens attached to an oxygen, but not in a straight line: they form a V. That bent shape changes everything.",
        "Oxygen pulls harder on the shared electrons and ends up slightly negative; the two hydrogens are left slightly positive. So every water molecule is a tiny magnet, with a plus pole and a minus pole.",
        "Everything water does inside you comes from that. From a bent molecule with two poles.",
      ],
    },
    {
      paragraphs: [
        "Because it's a magnet, water surrounds anything with a charge and pulls it apart. When you put salt in water, its negative pole sticks to the sodium and its positive pole to the chlorine, and it tears them away from each other. The salt doesn't disappear: it's left floating in separate pieces.",
        "That is what being a solvent means. And it's why everything your body needs to move around (salts, glucose, vitamins, hormones, waste) travels dissolved in water.",
        "With fats it's exactly the opposite: they have no poles, water can't get hold of them, and they huddle together to escape it. It looks like a flaw and it's a stroke of genius: that escape is what forms the membranes of all your cells. Every cell has a border made of fat precisely because water can't cross it whenever it likes.",
      ],
    },
    {
      paragraphs: [
        "About 60% of your body is water, and two out of every three liters are inside your cells. It isn't filler: it's where everything else lives.",
        "You have around 37 trillion cells, and each one is, on the inside, a drop of water with things dissolved in it.",
      ],
    },
    {
      paragraphs: [
        "Not one chemical reaction in your body happens dry. Enzymes, nutrients and ATP have to move and collide in order to meet, and that only happens floating in a liquid.",
        "But water isn't only the stage: it acts too. When your body splits a large molecule into pieces (a fat, a protein, ATP itself) it does it by putting a water molecule in the middle to break the bond. It's called hydrolysis, which literally means «breaking with water».",
        "And it works both ways: your mitochondria make water. The oxygen you breathe ends up turned into water at the end of the chain that produces your energy.",
      ],
    },
    {
      paragraphs: [
        "And what part does it play in the blood? An enormous one, because blood is water with things in it. More than half its volume is plasma, and plasma is 90% water.",
        "Here's the key nobody ever mentions: water is what gives blood its VOLUME, and that volume is what fills your vessels and holds up your blood pressure. When you get dehydrated there's less water in the plasma, the volume drops and the heart has to beat faster to keep delivering. Hence the dizziness when you stand up, the headache and the feeling that you can't cope with anything.",
        "Almost everything travels in that water: glucose, salts, hormones, amino acids, waste on its way to the kidney and CO₂ on its way back to the lungs. Oxygen is the exception, because it barely dissolves in water: for that you have red blood cells loaded with hemoglobin… which in turn float in the water of the plasma.",
        "And that water isn't shut inside the vessel. It moves in and out of the capillaries continuously to bathe the cells. It's the only way for what you eat to end up reaching a cell in your toe.",
      ],
    },
    {
      paragraphs: [
        "Water doesn't stay where you drink it: it moves on its own, and always toward wherever there are more salts. That movement is called osmosis, and it's the reason hydration isn't just a matter of drinking.",
        "Sodium is what calls the shots. If there's more salt on one side, water crosses over until the concentration evens out. That's how your body decides how much water stays in the blood, how much bathes the tissues and how much goes into the cells.",
        "Two everyday things follow from this. Eat very salty food and you hold on to water and swell, because water goes wherever that sodium goes. And if you drink liters of plain water after sweating heavily, you can dilute the sodium in your blood so much that water starts moving into your cells and they swell up. That's why rehydration drinks contain salt and a little sugar: it isn't marketing.",
        "The kidney keeps the accounts. When water is scarce, the brain releases a hormone (vasopressin) telling it to recover all it can — which is why urine comes out darker and more concentrated.",
      ],
    },
    {
      paragraphs: [
        "Water also keeps you at the right temperature, because it can take in a great deal of heat while barely changing temperature itself. And when cooling is needed, sweat evaporates and carries the heat away with it.",
        "It protects, too: it lubricates your joints, moistens your eyes, forms your saliva and surrounds your brain with a cushion of cerebrospinal fluid.",
        "You lose it all day long without noticing — breathing, sweating and in your urine — and it has to be replaced. Not only by drinking: a good part of it comes in fruit, vegetables, soups and the rest of your food.",
        "Water provides no calories, builds no muscle and makes no ATP. But without it, none of the rest happens. If the nutrients are the pieces, water is the stage, the transport and the messenger all at once.",
      ],
    },
  ],

  "nutriente-fitoquimicos": [
    {
      paragraphs: [
        "Plants can't run away from a predator. They can't hide from the sun either. Nor escape bacteria, fungi or insects. So they had to develop another strategy.",
        "To survive, plants make thousands of molecules called phytochemicals. Some protect them from solar radiation. Others repel insects or fight off microorganisms. They are the plant's defense system.",
      ],
    },
    {
      paragraphs: [
        "When we eat fruit and vegetables... we take in those phytochemicals too. They aren't vitamins. They aren't minerals. They're a completely different family of molecules.",
        "Many phytochemicals act as antioxidants. They help neutralize free radicals before they damage proteins, fats or DNA. In that way they help protect our cells.",
      ],
    },
    {
      paragraphs: [
        "Other phytochemicals don't act directly. Instead, they switch on genes that make our own cells produce more protective enzymes. It's like training the body to defend itself better.",
        "Each color usually points to a different family of phytochemicals. Red, orange, purple and deep green hide different molecules with different jobs.",
      ],
    },
    {
      paragraphs: [
        "That's why always eating the same fruit or the same vegetable isn't enough. The more different colors there are on your plate... the wider the variety of phytochemicals your cells will receive.",
        "Phytochemicals aren't essential for survival the way vitamins and minerals are. But we know more and more about how they help protect our cells and keep the body in balance. Nature has spent millions of years perfecting these molecules.",
        "Plants didn't make these molecules for us. They made them to survive. We simply learned to benefit from millions of years of evolution.",
      ],
    },
  ],

  "nutriente-edulcorantes": [
    {
      paragraphs: [
        "On your tongue you have a sweet receptor. And it isn't a sugar detector: it's a shape detector. If a molecule fits into it, your brain gets the word «sweet», whatever that molecule happens to be.",
        "Sweeteners are molecules that fit that lock far better than sugar does: between 200 and 20,000 times more strongly. But that's where the resemblance ends. They can't be burned, they give no energy and almost all of them leave the body exactly as they came in.",
        "They're a key that opens the sweet door with nothing behind it. And that's their appeal… and their whole problem.",
      ],
    },
    {
      paragraphs: [
        "For your body, sweetness was never a pleasure: it was a heads-up. For millions of years, sweet meant «energy is coming», and the body learned to get ready before it arrived.",
        "The moment something sweet touches your tongue, the brain gives orders in advance: more saliva, gastric juices and a small advance of insulin to receive the glucose that's about to come in. It's called the cephalic phase, and it is, literally, a prediction.",
        "With a sweetener the prediction fires just the same… and the glucose never turns up. The body has prepared itself for nothing. That's the deception, and it isn't of the palate: it's of the forecasting system.",
      ],
    },
    {
      paragraphs: [
        "The pleasure of sweetness is paid in two installments. The first is the taste, in your mouth. The second comes later and from below: sensors in the gut check that energy really has come in and tell the brain through the vagus nerve. That second message is what closes the circle and leaves you satisfied.",
        "A sweetener pays the first installment and not the second. Taste yes, energy no. The reward is left half done, and in many people that means going back to look for something sweet a while later.",
        "In animals this is very well established. In people it varies more: for some it takes the craving away and for others it sets it off. It's worth watching what happens to you.",
      ],
    },
    {
      paragraphs: [
        "And there's a second tongue nobody talks about: the gut has sweet receptors too. When they detect sweetness, it releases hormones (GLP-1, the satiety one, among them) and prepares more transporters to absorb glucose.",
        "So even though they carry no calories, sweeteners do send real metabolic signals. They're small and highly variable, but it's false that they «pass straight through without doing anything».",
        "One more piece is missing: the microbiome. Some sweeteners change its composition in some people, and it's precisely in those people that worse glucose handling has been seen. It doesn't happen to everyone: it's an individual response, and that explains why the studies contradict each other so much.",
      ],
    },
    {
      paragraphs: [
        "Let's get to the real question: are they that bad? The honest answer is an uncomfortable one, because they aren't poison but they aren't the solution either.",
        "In their favor there are solid, measurable things: they don't cause cavities, they don't raise glucose or insulin appreciably, and swapping a daily sugary soft drink for its sugar-free version removes an enormous amount of sugar at a stroke. For someone with diabetes, or coming from a very high intake, that is no small thing: it's a staircase down.",
        "And at the amounts usually consumed, no agency has found grounds to take them off the market.",
      ],
    },
    {
      paragraphs: [
        "Against them there are three things worth knowing. The first: in the long run they don't work for what people use them for. The World Health Organization reviewed the evidence in 2023 and recommended not using them for weight control, because no sustained benefit shows up and there is an association with a higher risk of type 2 diabetes and cardiovascular disease. An association, not a proven cause: part of it may simply be that the people who consume them most are the ones who already have a metabolic problem.",
        "The second: there are cases with open questions, such as the classification of aspartame in 2023, or the finding linking erythritol to platelets. Nothing conclusive, but enough not to build a whole lifetime of eating on top of them.",
        "The third is the one that matters most, and it doesn't show up in any test: they keep the bar for sweetness where it is. If everything you eat is intensely sweet, a piece of fruit tastes of nothing. And that threshold is what really decides what you feel like eating each day.",
        "So the aim isn't to change which sugar you use, it's to lower the bar bit by bit until you don't need either of them. Sweeteners can be a very useful intermediate step. The problem is settling down to live on that step.",
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // CÁBALA · el cómic del Origen (7 viñetas)
  //
  // Los términos hebreos NO se traducen ni se explican de más: Ein Sof, Or, Kli
  // (plural Kelim), Tzimtzum, Kav, Adam Kadmon, Atzilut, Beriah, Yetzirah,
  // Assiah, sefirot. Van en la misma grafía académica que el resto de Cábala
  // (ver GLOSARIO) y con su glosa al lado, como en español: «the Ein Sof, the
  // Infinite». «Árbol de la Vida» sí se traduce: Tree of Life.
  // ═══════════════════════════════════════════════════════════════════════════
  "cabala-intro": [
    {
      paragraphs: [
        "Before time, space or matter existed, there was only the Ein Sof, the Infinite.",
        "There was no separation between creator and creation. Everything was one single limitless reality, holding every potential of the universe in perfect balance.",
      ],
    },
    {
      paragraphs: [
        "Two fundamental principles were already present within the Ein Sof.",
        "The Or, the Infinite Light, the masculine energy, whose nature is to give, to expand and to share.",
        "And the Kli, the Vessel, the feminine energy, whose nature is to receive, to contain and to manifest that light.",
        "They weren't two separate beings, but two inseparable aspects of the same thing.",
      ],
    },
    {
      paragraphs: [
        "But while everything remained united within the Ein Sof, no independent creation could exist.",
        "And so the Tzimtzum took place: a symbolic contraction of the Infinite Light that created a space where creation could unfold and experience existence for itself.",
      ],
    },
    {
      paragraphs: [
        "After the Tzimtzum, a thin ray of light known as the Kav entered that space.",
        "The interaction between the Light (Or) and the vessels (Kelim) then began to give creation its shape.",
        "The first manifestation was Adam Kadmon, the primordial blueprint holding the complete design of everything that would come to exist.",
      ],
    },
    {
      paragraphs: [
        "From Adam Kadmon, creation descended through four levels of manifestation.",
        "Atzilut, the world of Emanation, where oneness with the Infinite is almost absolute.",
        "Beriah, the world of Creation, where the Infinite takes on distinct forms.",
        "Yetzirah, the world of Formation, where structures and souls appear.",
        "Assiah, the world of Action, where creation manifests as matter.",
        "In each world the Light expresses itself differently, growing denser and denser until it manifests the tangible universe.",
      ],
    },
    {
      paragraphs: [
        "All of creation is still an emanation of the Ein Sof.",
        "Just as a ray of sunlight is not separate from the Sun, every soul, every living being and every particle of the universe is an expression of the same Infinite Light.",
        "The Tree of Life, formed by the ten sefirot, describes the path by which that divine energy descends from the Infinite down to the material world.",
      ],
    },
    {
      paragraphs: [
        "The human being is an emanation of the One as well.",
        "Although we live in the material world and experience separation, our essence is still the same Light that emanated from the Ein Sof.",
        "That is why the purpose of the spiritual path is to remember who we are, and to raise our consciousness until we recognize our oneness with the Infinite once again.",
      ],
    },
  ],

  // ── Las 10 Sefirot · una ilustración por dimensión ────────────────────────
  // Mismo orden que CABALA_ILUSTRACIONES_KEYS: Keter, Chokhmah, Binah, Da'at,
  // Chesed, Gevurah, Tiferet, Netzach, Hod, Yesod, Malkhut. Los nombres no se
  // traducen; «Árbol de la Vida» sí (Tree of Life).
  "cabala-sefirot": [
    {
      paragraphs: [
        "Keter is the origin of all existence and stands for the divine will, infinite potential and the purpose that gives Life meaning.",
        "On a personal level, it invites you to discover the principles that guide your decisions and to live from coherence, beyond recognition or ego.",
      ],
    },
    {
      paragraphs: [
        "Chokhmah stands for the divine light, intuitive wisdom, inspiration and the spark of knowledge that appears before reasoning.",
        "It also stands for the ability to look at reality with openness, setting prejudice and interpretation aside to perceive things more clearly.",
      ],
    },
    {
      paragraphs: [
        "Binah turns intuition into understanding through analysis, structure, classification and reflection.",
        "In personal growth, it's about learning from experience, revisiting your beliefs and turning knowledge into practical wisdom that changes the way you act.",
      ],
    },
    {
      paragraphs: [
        "Da'at stands for the integration of knowledge and experience. It's the point where wisdom stops being an idea and becomes a way of living, joining mind, heart and action.",
        "It stands for the consciousness that connects every dimension of the Tree of Life and lets learning really transform the person.",
      ],
    },
    {
      paragraphs: [
        "Chesed stands for love, compassion and generosity.",
        "It invites us to share the best of ourselves from freedom and inner abundance, helping without expecting recognition and always respecting other people's autonomy and timing.",
      ],
    },
    {
      paragraphs: [
        "Gevurah stands for discipline, justice and the ability to set boundaries.",
        "It teaches you to protect what matters, to manage your energy responsibly and to find the balance between firmness and flexibility.",
      ],
    },
    {
      paragraphs: [
        "Tiferet sits at the center of the Tree of Life and stands for the harmony between love and rigor.",
        "It's the balance of the heart: acting with honesty, empathy and wisdom, integrating reason and emotion to respond to each situation in the best way.",
      ],
    },
    {
      paragraphs: [
        "Netzach stands for perseverance, determination and the ability to sustain effort over the long run.",
        "It reminds us that real growth doesn't depend on the initial intensity, but on steadiness and the ability to keep going even in the face of difficulty.",
      ],
    },
    {
      paragraphs: [
        "Hod stands for communication, humility and mental clarity.",
        "It complements Netzach by helping us express our ideas authentically, listen with openness and recognize that our vision is valuable, but not the only one possible.",
      ],
    },
    {
      paragraphs: [
        "Yesod is the bridge between the spiritual and the material world, where ideas become reality.",
        "On a personal level, it stands for building coherent habits and actions that turn the values we agree with into a consistent way of Life.",
      ],
    },
    {
      paragraphs: [
        "Malkhut stands for the physical world and the manifestation of all the energy of the Tree of Life.",
        "It's the ability to turn inner growth into concrete actions, building a reality that reflects our values, our purpose and the person we choose to be.",
      ],
    },
  ],

  // ── Los 22 Senderos · una ilustración por letra ───────────────────────────
  // Mismo orden que el recorrido: Aleph (11) → Tav (32). Las letras hebreas no
  // se traducen; los nombres largos de cada sendero viven en
  // `components/metodo/cabalaSenderos.en.ts`, que es su página.
  "cabala-senderos": [
    {
      paragraphs: [
        "Aleph stands for the first movement between purpose and wisdom.",
        "It teaches that a real purpose isn't about clinging to our ideas, but about letting reality and experience enrich or redefine them.",
        "It's the path of open-mindedness, flexibility and the ability to learn.",
      ],
    },
    {
      paragraphs: [
        "Beth stands for the step from purpose to understanding.",
        "It reminds us that great ideas need a structure to grow in, and that reflection turns inspiration into solid knowledge.",
        "It's the path of the pause, of learning and of inner building.",
      ],
    },
    {
      paragraphs: [
        "Gimel stands for the journey of purpose down to the heart.",
        "It teaches that values stop being mere ideas when they become a way of living.",
        "It's the path where coherence joins what we think, feel and do.",
      ],
    },
    {
      paragraphs: [
        "Daleth stands for the step from perception to understanding.",
        "It teaches that intuition opens a door, but only reflection lets you walk through it and discover a deeper reality.",
        "It's the path of the conscious decision.",
      ],
    },
    {
      paragraphs: [
        "He stands for the ability to let a truth transform the heart.",
        "Understanding an idea isn't enough; real change happens when it shifts the way we feel, decide and live.",
        "It's the path of emotional integration.",
      ],
    },
    {
      paragraphs: [
        "Vav stands for the bridge between understanding and generosity.",
        "It teaches that knowledge comes into its own when it turns into service and help for others.",
        "It's the path that joins wisdom with love in action.",
      ],
    },
    {
      paragraphs: [
        "Zayin stands for the step from knowledge to wisdom.",
        "It teaches you to tell the essential from the superficial and to turn learning into a way of living.",
        "It's the path of coherence, where decisions reflect what really matters.",
      ],
    },
    {
      paragraphs: [
        "Chet stands for the step from understanding to healthy boundaries.",
        "It teaches that understanding others doesn't mean giving yourself up, and that boundaries are a way of protecting what has value.",
        "Real maturity combines empathy with firmness.",
      ],
    },
    {
      paragraphs: [
        "Tet stands for the integration of generosity and firmness.",
        "It teaches that the wisest love knows when to help and when to let others grow on their own.",
        "Balance turns compassion into a conscious choice.",
      ],
    },
    {
      paragraphs: [
        "Yod stands for the power of small actions carried out with intention.",
        "It teaches that real compassion is about doing what genuinely helps the other person grow.",
      ],
    },
    {
      paragraphs: [
        "Kaf stands for the ability to hold what we value over time.",
        "It teaches that enthusiasm starts the road, but only steady commitment lets you build something lasting.",
      ],
    },
    {
      paragraphs: [
        "Lamed stands for the step from boundaries to balance.",
        "It teaches that real strength isn't born from control or rigidity, but from knowing how to combine firmness and compassion with serenity.",
      ],
    },
    {
      paragraphs: [
        "Mem stands for the ability to express our needs with clarity and respect.",
        "It teaches that communicating our boundaries strengthens relationships and keeps silence from turning into resentment.",
      ],
    },
    {
      paragraphs: [
        "Nun stands for the perseverance born of holding on to our values during and despite difficulty.",
      ],
    },
    {
      paragraphs: [
        "Samekh stands for building a coherent Life through steady habits.",
        "It teaches that values only settle when they show up in the small decisions we repeat each day.",
      ],
    },
    {
      paragraphs: [
        "Ayin stands for the ability to express to the world what we really are.",
        "It teaches that authenticity isn't only about knowing ourselves, but about having the courage to communicate our truth with respect.",
      ],
    },
    {
      paragraphs: [
        "Pe stands for the transforming power of the word.",
        "It teaches that authentically sharing what we've learned can inspire, create and help other people grow.",
      ],
    },
    {
      paragraphs: [
        "Tsadi stands for the turning of perseverance into habits.",
        "It teaches that real change doesn't depend on extraordinary effort, but on small actions repeated until they become part of our identity.",
      ],
    },
    {
      paragraphs: [
        "Qof stands for the step from perseverance to visible results.",
        "It teaches that every outer transformation is born from a long invisible process, and that trusting the road matters as much as reaching the goal.",
      ],
    },
    {
      paragraphs: [
        "Resh stands for the coherence and union between what we think, say and do.",
        "It teaches that expressing our values only makes sense when our everyday routine reflects what we say.",
      ],
    },
    {
      paragraphs: [
        "Shin stands for the moment when what we express stops being an idea and becomes a visible reality.",
        "It teaches that words and decisions only reach their real value when they translate into actions that transform our Life and our surroundings.",
      ],
    },
    {
      paragraphs: [
        "Tav stands for the last step of the journey: turning values, habits and learning into a stable way of living.",
        "It stands for the culmination of the inner process, where the person stops chasing an ideal identity and simply embodies it in everyday Life.",
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // MEDICINA CHINA
  //
  // Los términos técnicos NO se traducen y van con su mayúscula: Dao, Qi, Yin,
  // Yang, Taiji, Hundun, Jing, Shen, Hun, Po, Yi, Zhi, Xing. Los Cinco
  // Elementos, sí: Wood, Fire, Earth, Metal, Water — y con mayúscula, porque
  // son términos técnicos, no maderas ni fuegos cualesquiera (ver GLOSARIO).
  //
  // Los patrones de desequilibrio también van con mayúscula, como en español:
  // Heat, Cold, Dampness, Phlegm, Qi Stagnation, Deficiency. Y Sangre → Blood,
  // que en MTC es un concepto propio y no solo el líquido.
  //
  // La cita de Guan Zi es una cita: se traduce el sentido y se deja el autor.
  // ═══════════════════════════════════════════════════════════════════════════

  // ── El Origen según el taoísmo (intro de la disciplina) ───────────────────
  "tcm-origen": [
    {
      paragraphs: [
        "The Dao (Tao) is the supreme, indescribable principle from which all of reality arises.",
        "From the Dao emanates Qi, the primordial energy which, at first, exists in an undifferentiated state known as Hundun: the primordial chaos, where there is still no individual distinction.",
        "As that energy begins to order itself, Taiji (the Supreme Ultimate) appears, and from it the two complementary forces are born.",
      ],
    },
    {
      paragraphs: [
        "Yang is the masculine energy, the Qi of Heaven.",
        "Yin is the feminine energy, the Qi of Earth.",
        "The two are interdependent, and both are manifestations of the same thing.",
        "Out of their interaction come the Five Elements (Wood, Fire, Earth, Metal and Water), whose cycles of transformation give rise to «the ten thousand beings» — that is, to everything that exists in the universe.",
      ],
    },
    {
      paragraphs: [
        "Mountains, rivers, plants and animals are manifestations of Qi in constant transformation.",
        "«The human being is born of the essence of heaven and receives its form from the earth.» — Guan Zi",
      ],
    },
    {
      paragraphs: [
        "Essence (Jing) is the individualized manifestation of the primordial energy, of Qi.",
        "It is the portion of the Dao —the infinite essence— that condenses to give rise to the body, to sustain Life and to express the singularity of every being.",
      ],
    },
    {
      paragraphs: [
        "Out of Jing emerges Shen, the spirit that animates consciousness, emotion and thought.",
      ],
    },
    {
      paragraphs: [
        "Taoism teaches that the meaning of Life is to remember that we are a manifestation of the Dao.",
        "By cultivating Jing, balancing Qi and clarifying Shen, we stop fighting against the current of existence and learn to live with naturalness, harmony and fullness.",
      ],
    },
  ],

  // ── Los Cinco Elementos (capítulo de teoría) ──────────────────────────────
  "tcm-elementos": [
    {
      paragraphs: [
        "The Five Elements are the five forces that nature —and, by extension, the human being— is built upon.",
        "Our organs, our emotions and our vital processes all follow the movements of these five elements.",
      ],
    },
    {
      paragraphs: [
        "Earth is the ground everything is built on.",
        "It stands for our capacity to nourish ourselves and to transform, physically as much as emotionally",
        "When Earth is strong, we are able to take what Life gives us and turn it into roots, learning and nourishment.",
      ],
    },
    {
      paragraphs: [
        "Out of Earth's process of transformation comes Metal.",
        "It stands for clarity, for order, and for the ability to tell apart the pain that is ours from the pain that isn't.",
        "It helps us accept who we are and let go of whatever has already served its purpose, making room for the new.",
      ],
    },
    {
      paragraphs: [
        "When we learn to let go, Water appears. It is depth, introspection and the connection with our inner resources.",
        "It invites us to look inward, to find peace and to build the confidence we need in order to flow with the changes of Life.",
      ],
    },
    {
      paragraphs: [
        "Wood stands for growth, expansion and the ability to move forward. It is the force that turns our potential into action.",
        "In balance, it helps us build, create and develop whatever we have sown. When it gets blocked, frustration, rigidity or anger can appear.",
      ],
    },
    {
      paragraphs: [
        "Fire is the expression of Life in movement.",
        "It stands for joy, vitality, passion and the ability to connect with other people.",
        "It brings us enthusiasm, inspiration and the drive we need to share what we have created.",
      ],
    },
    {
      paragraphs: [
        "According to Traditional Chinese Medicine, health arises when these five movements are in balance, letting energy flow harmoniously through our body, our emotions and the way we live.",
      ],
    },
  ],

  // ── El Yin Yang ───────────────────────────────────────────────────────────
  "tcm-yin-yang": [
    {
      paragraphs: [
        "Yin and Yang are two opposite, complementary aspects of one and the same reality.",
        "Yang stands for activity, light and movement.",
        "Yin stands for rest, darkness and matter.",
      ],
    },
    {
      paragraphs: [
        "Nothing is entirely Yin or entirely Yang. Each one holds the seed of the other.",
        "Yang turns matter into energy. Yin turns energy into matter.",
        "Health and Life depend on the dynamic balance between Yin and Yang.",
      ],
    },
  ],

  // ── El Alma Humana · los cinco Shen y su órgano ───────────────────────────
  // Cada viñeta abre con «Shen (corazón)», «Hun (hígado)»…: es un rótulo, no una
  // frase, y se conserva igual — el nombre chino y su órgano entre paréntesis.
  "tcm-alma": [
    {
      paragraphs: [
        "For Traditional Chinese Medicine, the human being is a unity. Body, Qi and spirit form an inseparable whole.",
        "The body (Xing) is the form. Qi is the vital energy. Shen is the principle that gives Life, consciousness and presence.",
      ],
    },
    {
      paragraphs: [
        "Shen (heart)",
        "It is consciousness, mental clarity and the ability to relate to the world.",
      ],
    },
    {
      paragraphs: [
        "Hun (liver)",
        "It is the ethereal soul.",
        "It inspires dreams, creativity, imagination and the ability to project ourselves into the future.",
      ],
    },
    {
      paragraphs: [
        "Po (lungs)",
        "It is the corporeal soul.",
        "It governs instinct, physical sensation and the immediate response to Life.",
      ],
    },
    {
      paragraphs: [
        "Yi (spleen)",
        "It is intention.",
        "It allows us to think, learn, remember and concentrate.",
      ],
    },
    {
      paragraphs: [
        "Zhi (kidneys)",
        "It is will.",
        "It gives perseverance, determination and the strength to keep going.",
      ],
    },
    {
      paragraphs: [
        "Each aspect of the spirit resides in an organ.",
        "When the organs are in balance, so is the mind.",
        "Health isn't only the absence of disease. It is harmony between body, energy and spirit.",
      ],
    },
  ],

  // ── «Las enfermedades» · entre Los ciclos y el Diagnóstico ────────────────
  "tcm-enfermedades": [
    {
      paragraphs: [
        "In Traditional Chinese Medicine (TCM), illness isn't understood merely as an isolated symptom, but as the result of an imbalance in the circulation of Qi and in the harmony between Yin and Yang.",
        "The most common patterns are Heat, Cold, Dampness, Phlegm, Qi Stagnation and Deficiency.",
      ],
    },
    {
      paragraphs: [
        "The Heat pattern is marked by an excess of activity or energy that consumes the body's fluids.",
        "It usually shows up as fever, thirst, irritability, redness, inflammation or an intense sensation of heat. Treatment aims to disperse the heat and restore balance.",
      ],
    },
    {
      paragraphs: [
        "The Cold pattern slows the body's functions down and hinders the circulation of Qi and Blood.",
        "Its most usual signs are a cold body, cold hands and feet, pain that eases with warmth, and fatigue. The therapeutic aim is to warm the body and strengthen the Yang.",
      ],
    },
    {
      paragraphs: [
        "Dampness and Phlegm appear when the body's fluids aren't transformed properly.",
        "They produce a sense of heaviness, slow digestion, mucus, dizziness or difficulty concentrating. Treatment is directed at clearing the dampness, transforming the phlegm and encouraging the movement of Qi.",
      ],
    },
    {
      paragraphs: [
        "When Qi stops circulating freely, pain, tension, abdominal bloating, emotional swings or a feeling of oppression appear.",
        "Stress and long-held emotions are frequent causes of this pattern. Therapy seeks to restore the free circulation of Qi.",
      ],
    },
    {
      paragraphs: [
        "Deficiency of Qi, Yin or Yang reflects a decline in the body's functional capacity.",
        "It can show up as tiredness, weakness, dryness, a feeling of cold or a loss of vitality.",
        "In Traditional Chinese Medicine, treatment is always adapted to each person's particular pattern of imbalance, in order to bring the body back into harmony.",
      ],
    },
  ],

  // ── Los cinco elementos, uno a uno · paso 4 del recorrido de TCM ──────────
  // OJO: el cómic de cada elemento intercala PASOS DE TEST entre las viñetas
  // (`PasoComic`, en tcmElementosContenido.ts). Aquí solo van las VIÑETAS, en su
  // orden, y el merge las coloca saltándose los pasos de test — ver
  // `usePasosElemento` en components/metodo/tcmElementosEn.ts.
  //
  // Los órganos van con su nombre corriente en inglés (liver, gallbladder,
  // spleen…), pero Qi, Sangre (Blood), Esencia (Essence), Jing y Shen guardan la
  // mayúscula: en MTC son conceptos, no la víscera ni el líquido.
  "tcm-wu-xing": [
    {
      paragraphs: [
        "The Five Elements (Wu Xing) —Wood, Fire, Earth, Metal and Water— are one of the fundamental theoretical foundations of Traditional Chinese Medicine.",
        "They aren't literal «things», nor mere symbols: they describe dynamic processes of Life, and the way Qi transforms and expresses itself in nature and in the human being.",
      ],
    },
    {
      paragraphs: [
        "Every person embodies the movement of the five elements, and living in harmony with the Dao means letting those processes express themselves without obstruction.",
      ],
    },
    {
      paragraphs: [
        "An imbalance appears when an element becomes excessive (it overacts) or deficient (it performs below normal).",
        "The physicians of ancient China observed them through deep attention to the person: their posture, their expression, their voice, their pulse, their habits, their emotions and all those subtle details that reveal the state of the Qi.",
      ],
    },
    {
      paragraphs: [
        "Each element brings together a Zang organ (the main one), a Fu organ (its associated bowel), a tissue, a sense orifice, a body fluid, an emotion, a color, a flavor, a season, a type of voice and a characteristic movement.",
      ],
    },
  ],

  "tcm-madera": [
    {
      paragraphs: [
        "Wood stands for growth, rising, dispersal and flow. It is the energy of spring: everything that sprouts, expands and seeks to move freely belongs to Wood.",
        "It governs the liver, the gallbladder, the eyes and the tendons.",
      ],
    },
    {
      paragraphs: [
        "When Wood is in excess, energy rises out of control. It can show up as outbursts of anger, rage, impatience and irritability, along with a constant feeling of being blocked or in a hurry.",
        "Muscle tension in the neck, jaw and shoulders is common, as are red or bloodshot eyes and headaches that climb upward.",
      ],
    },
    {
      paragraphs: [
        "When Wood is deficient, the drive needed to move forward is missing. There can be a lack of initiative, difficulty finding a clear direction or making decisions. You lose heart easily, are afraid to act, and may show low motivation, shyness and indecision.",
        "Physically, tired eyes, blurred vision, weak tendons, cramps or tremors can appear.",
      ],
    },
    {
      paragraphs: [
        "To rebalance Wood, favor foods that support the liver and the free flow of Qi:",
        "Bitter greens such as dandelion, arugula or kale; sour foods such as lemon, vinegar or pickles; fresh herbs such as mint, basil and parsley; sprouts and green tea.",
      ],
    },
    {
      paragraphs: [
        "Wood needs movement, direction and expression: move in the morning (stretching, Qi Gong or martial arts), give shape to your creativity by planning or writing new projects, and practice healthy boundaries so frustration doesn't pile up.",
        "Rest at around 10:30 p.m., when its energy starts to wind down, and choose exercise that is dynamic but not aggressive, with continuous, flexible movement.",
      ],
    },
  ],

  "tcm-fuego": [
    {
      paragraphs: [
        "Fire stands for heat, for what burns, and for rising. In the body, Fire is the force that warms, drives and kindles consciousness, supporting vitality, communication and presence. It governs the heart, the small intestine and the complexion.",
        "Fire in balance is warm, expressive and charismatic. You relate to other people from a place of authenticity, enjoying healthy communication and intimacy. Physically it usually shows up as good rest, a steady heart rate and a general sense of vitality and presence.",
      ],
    },
    {
      paragraphs: [
        "When Fire is in excess, energy rises out of control. It can show up as restlessness, anxiety, panic or insomnia. Talking too much, laughing nervously or a constant need for stimulation and social contact are common.",
      ],
    },
    {
      paragraphs: [
        "Palpitations can also appear, along with a sensation of heat in the chest or the face, over-attachment, jealousy and intense or dramatic emotional reactions, with a tendency to over-socialize.",
      ],
    },
    {
      paragraphs: [
        "When Fire is deficient, the ability to connect with yourself and with others declines. There can be emotional flatness, difficulty expressing affection or forming deep bonds, along with a sense of loneliness or of not being understood.",
        "Physically, cold hands and feet are common, as are fatigue around the heart, forgetfulness, a lack of enthusiasm, a quiet voice and a tendency to avoid social interaction.",
      ],
    },
    {
      paragraphs: [
        "To rebalance Fire, favor hydrating foods such as cucumber, watermelon and lettuce; bitter foods such as romaine lettuce, cacao and quinoa.",
        "Red fruits such as cherries and hawthorn berries; and cooling infusions of chrysanthemum and hibiscus.",
      ],
    },
    {
      paragraphs: [
        "Fire needs connection, joy and a quiet mind. Rest before 11 p.m. and choose exercise that combines movement with enjoyment.",
        "Fire reveals itself in the way we relate to others, express what we feel and share our presence with them.",
      ],
    },
  ],

  "tcm-tierra": [
    {
      paragraphs: [
        "Earth stands for the capacity to generate, transform, sustain and receive.",
        "It is the center of the Five Elements: the energy that turns what we take in —food and fluids— into what sustains us: Qi and Blood.",
        "Everything that nourishes, gives stability and supports the body's balance belongs to Earth.",
        "Its key words are nourishment, stability and inner home.",
      ],
    },
    {
      paragraphs: [
        "When Earth is in excess, the wish to care turns into overprotection, to the point of smothering others, controlling them and abandoning yourself. A strong need for things not to change, for control and for security appears, along with rumination, stubbornness and difficulty letting go of old patterns.",
        "Physically, overeating, weight gain and a build-up of dampness or mucus are common.",
      ],
    },
    {
      paragraphs: [
        "When Earth is deficient, the capacity to nourish, transform and sustain declines: weak muscles, tiredness after eating, abdominal bloating, loose stools and intense sugar cravings.",
        "Emotionally, low self-esteem or the loss of your own center can appear; you tend to become a people-pleaser, absorbing other people's energy and needs and forgetting yourself.",
      ],
    },
    {
      paragraphs: [
        "To rebalance, at the table: Warm, cooked food: soups, purées and stews; complex carbohydrates: roots, squash and tubers; legumes and whole grains; sweet, warming spices: ginger and cinnamon; probiotics and fermented foods, if you tolerate them well.",
        "In your day to day: Routines that bring balance and security; caring for others without letting your own needs slide; eating mindfully, enjoying the moment; keeping your spaces tidy and clear. Rest: A wind-down routine in the late afternoon and evening, supporting physical and mental rest. Exercise: Walking, yoga, strength training, gardening or contact with the soil.",
      ],
    },
  ],

  "tcm-metal": [
    {
      paragraphs: [
        "Metal stands for the capacity to purify, to descend and to astringe. In the body, Metal governs the exchange with the outside: thanks to it we breathe, filter and let go, physically as much as emotionally. It governs the lung, the large intestine, the skin and the nose.",
        "Metal in balance is disciplined, organized and holds great moral clarity. You know how to set healthy boundaries, to put your Life in order and to let go of whatever has already served its purpose.",
      ],
    },
    {
      paragraphs: [
        "When Metal is in excess, the need for order can turn into perfectionism, rigidity and an overly critical attitude toward yourself and toward others. Very rigid habits often develop.",
      ],
    },
    {
      paragraphs: [
        "When Metal is deficient, a deep sadness appears, along with difficulty letting go of people, situations or experiences from the past. It can show up as a weakened immune system, shallow breathing, a lack of order and a sense of disorganization in everyday Life.",
      ],
    },
    {
      paragraphs: [
        "To rebalance Metal, favor white foods such as daikon, garlic and onion; radishes, pears and apples; foods that moisten the lung, such as honey or rice congee; mushrooms and seaweed; and warm infusions of ginger or licorice.",
      ],
    },
    {
      paragraphs: [
        "Metal needs to breathe, to order and to let go. Practice breathing exercises and Qi Gong to strengthen and expand the lung, and create rituals that bring meaning and make it easier to close chapters.",
        "Sleep in a deeply dark, silent room, which supports restorative rest and quiet breathing, and choose activities that improve posture, breathing and lung capacity. Learning to let go of people, experiences and stages in a healthy way protects the Qi of the lung and lets energy keep flowing.",
      ],
    },
  ],

  "tcm-agua": [
    {
      paragraphs: [
        "Water stands for the capacity to moisten, to descend, to cool and to store. It stands for essence, for inheritance and for the ground on which all physical, mental and spiritual growth is built. It governs the kidney (where the Essence is stored), the bladder, the bones and the hair.",
        "Water in balance brings inner stillness, a strong will and a deep sense of stability.",
      ],
    },
    {
      paragraphs: [
        "When Water is in excess, fear can become paralyzing, feeding avoidance, isolation and difficulty moving forward.",
      ],
    },
    {
      paragraphs: [
        "Fluid retention, swelling, a chronic feeling of cold and constant worry often appear.",
      ],
    },
    {
      paragraphs: [
        "When Water is deficient, the energy reserves begin to run dry. It can show up as premature aging, hair loss, weakness in the lower back and knees, and a deep exhaustion that never fully lifts with rest.",
      ],
    },
    {
      paragraphs: [
        "To nourish Water, favor black or bluish foods such as black beans, seaweed and blueberries; mineral-rich foods such as sesame and walnuts; bone broth; warming spices such as clove and garlic; and fish and shellfish.",
        "To protect it, keep away from too much salt, from settings that generate fear or continuous stress, from overwork, from dehydration and the draining of your reserves, from too much raw or cold food —especially in winter— and from too much caffeine, which depletes the Qi of the kidney.",
      ],
    },
    {
      paragraphs: [
        "Water needs rest, silence and a proper conservation of energy. Practice silence, meditation or any activity that supports inner calm, and favor steady effort over great bursts of willpower.",
        "Go to bed early in winter, which helps conserve the Essence (Jing), and choose activities that strengthen the body without draining its reserves.",
      ],
    },
  ],

  // ── Las diez leyes del Tao · paso 7 del recorrido ─────────────────────────
  // El `titulo` de cada viñeta es el NOMBRE de la ley, y la página lo lee de
  // aquí también (no solo el visor): si se cambia, cambia en los dos sitios.
  // El antetítulo (número · hanzi · pinyin) se genera y no se traduce.
  // Las citas del Tao Te King se traducen del español —que es la versión que
  // usa el curso—, no de una traducción inglesa ajena.
  "tcm-leyes-tao": [
    {
      titulo: "The way",
      paragraphs: [
        "The Tao is the deep order of nature: not a figure that commands, rewards or punishes, but the way Life moves.",
        "We aren't all made for the same rhythm. You are a small universe inside a far larger one, and your health depends, in part, on learning to recognize your own cycle.",
      ],
    },
    {
      titulo: "The opposites that need each other",
      paragraphs: [
        "Yin and Yang aren't enemies. They are two complementary movements that need each other for Life to take on a tangible form.",
        "Yang expresses heat, movement, expansion and activity. Yin expresses cold, stillness, turning inward and nourishment. Neither is absolute: there is Yang within Yin, and Yin within Yang.",
        "Chinese medicine watches these relationships constantly: heat and cold, excess and emptiness, activity and rest. Health isn't a matter of getting rid of one of the two, but of letting them regulate each other.",
        "In other words, we all inherently have a natural cycle, and we have to allow ourselves to listen to it and follow it. We shouldn't let stillness carry us away when we want to move, nor let overexertion carry us away when we need to rest.",
      ],
    },
    {
      titulo: "Not forcing",
      paragraphs: [
        "Wu Wei means accepting that processes take their own time, beyond our wishes and beyond what we know.",
        "A seed needs water, soil and time. If you pull at it to make it grow faster, you destroy it.",
      ],
    },
    {
      titulo: "Being what you are",
      paragraphs: [
        "Ziran means, literally, something that happens «by itself»: whatever follows its own nature.",
        "Health begins when we stop forcing ourselves to function as something we are not. The body has its own signals, rhythms and needs.",
      ],
    },
    {
      titulo: "The return",
      paragraphs: [
        "When something reaches its extreme, it begins to turn into its opposite.",
        "Expansion ends up giving way to contraction. Fullness opens room for emptiness. Extreme cold can end up generating heat.",
        "Nature moves in cycles, not in straight lines. That is why imbalance and illness often don't appear all of a sudden: they have been giving warning for a long time.",
      ],
    },
    {
      titulo: "Virtue",
      paragraphs: [
        "The quality of its own that appears when a being fully expresses its nature.",
        "A tree doesn't need to make an effort to be a tree. Water doesn't need to prove that it knows how to flow.",
        "Perhaps health isn't always a matter of adding something more, but of removing whatever keeps the body from doing what it already knows how to do.",
      ],
    },
    {
      titulo: "Simplicity",
      paragraphs: [
        "Pu is wood before it is carved: what still keeps its plainness and its possibilities.",
        "Sometimes we pile up so much —objects, rules, stimuli, obligations and ideas about how we ought to live— that we end up drifting away from the essential.",
        "Following the Tao can also be an exercise in taking away. Less noise. Less excess. More room to notice what we really need.",
        "Plainness isn't poverty: it's coming back to the essential.",
      ],
    },
    {
      titulo: "The emptiness that makes room",
      paragraphs: [
        "The most valuable part of a vessel isn't the clay, but the space left inside it.",
        "Emptiness isn't a useless absence. It is what allows something to be inhabited, used and transformed.",
        "The body and the mind need space too: between one activity and the next, between one meal and the following one, between effort and rest. When we fill every moment, we stop having room to recover, to digest, to take things in and simply to breathe.",
      ],
    },
    {
      titulo: "The energy that connects",
      paragraphs: [
        "Qi is the vital movement that runs through all things and relates them to one another.",
        "In the Chinese view, we are part of the world around us. We aren't individual beings, but an extension of the Tao.",
        "That is why taking care of yourself doesn't mean cutting yourself off from the world. It means understanding that we are part of it.",
        "Breathing, food, movement, rest and surroundings all take part together in the way our vitality circulates.",
      ],
    },
    {
      titulo: "Not fighting everything",
      paragraphs: [
        "Water doesn't need to confront the stone in order to transform it. It carries on its way, finds another direction and, in time, changes what looked impossible to move.",
        "Bu Zheng doesn't mean giving up. It means no longer wasting strength on fights that don't need to be fought.",
        "There is a different kind of strength in someone who doesn't need to prove their position all the time. Instead of competing with everything that comes along, they save their energy for what really matters.",
      ],
    },
  ],

  // ── «De dónde viene el Qigong» · la línea del tiempo ──────────────────────
  // Los títulos de obra y los nombres propios NO se traducen y guardan su
  // transcripción: Dao Yin Tu, Baopuzi, Liu Zi Jue, Ba Duan Jin, Yi Jin Jing,
  // Hua Tuo, Ge Hong, Tao Hongjing, Yue Fei, Liu Guizhen. Los hanzi se copian
  // tal cual. Las fechas van de antetítulo y las traduce el propio guion: «s. IV
  // a.C.» → «4th c. BC» (ver el mirror de las fechas en la página).
  "tcm-qigong-historia": [
    {
      eyebrow: "4th c. BC",
      titulo: "The jade inscription",
      paragraphs: [
        "A small twelve-sided jade pendant (行氣玉佩銘) describes how to bring the breath down to the belly, let it settle and send it back up.",
        "It is the oldest surviving text about guiding the Qi: the practice is older than the books that explain it.",
      ],
    },
    {
      eyebrow: "4th c. BC",
      titulo: "Zhuangzi has a little laugh",
      paragraphs: [
        "«They puff and they breathe, they exhale the old and take in the new; they hang like the bear and stretch like the bird, all in order to live long.» Zhuangzi tells it to make the point that longevity isn't the goal — and in passing he leaves us the first written description of the practice.",
      ],
    },
    {
      eyebrow: "168 BC",
      titulo: "The Dao Yin Tu of Mawangdui",
      paragraphs: [
        "In a sealed tomb in southern China a painted silk turned up with 44 figures —women and men, young and old— stretching, twisting and breathing, each one with its name beside it. It is the oldest proof: more than two thousand years ago this was already ordered, drawn and taught.",
      ],
    },
    {
      eyebrow: "2nd c. AD",
      titulo: "Hua Tuo and the five animals",
      paragraphs: [
        "The great surgeon of ancient China arranges the practice into five sets (五禽戲): tiger, deer, bear, monkey and bird. His line is still quoted: «a door that is used doesn't rot, and running water doesn't stagnate».",
      ],
    },
    {
      eyebrow: "4th c.",
      titulo: "Ge Hong writes it down",
      paragraphs: [
        "In the Baopuzi, the alchemist Ge Hong brings breathing, dao yin and meditation together as one single work of inner cultivation. From here on, every Taoist monastery and every medical lineage will keep a series of its own.",
      ],
    },
    {
      eyebrow: "6th c.",
      titulo: "The Six Sounds",
      paragraphs: [
        "Tao Hongjing collects the Liu Zi Jue (六字訣): six sounds made on the out-breath, one per organ —xu for the liver, he for the heart, hu for the spleen, si for the lung, chui for the kidney and xi for the Triple Burner—. Healing with the voice as you let the air go.",
      ],
    },
    {
      eyebrow: "12th c.",
      titulo: "The Eight Brocades",
      paragraphs: [
        "The Ba Duan Jin (八段錦) appears: eight movements that tradition attributes to general Yue Fei, to keep his soldiers healthy. They're called «brocades» because they are eight pieces of embroidered silk: short, valuable and passed from hand to hand. It is still the series you start with today.",
      ],
    },
    {
      eyebrow: "1624",
      titulo: "Changing the tendon",
      paragraphs: [
        "The Yi Jin Jing (易筋經) is published, linked to the Shaolin monastery: a more demanding series, built on sustained strength, meant to change the quality of tendon and bone. The martial branch of the same root.",
      ],
    },
    {
      eyebrow: "1950 · 2003",
      titulo: "The word «qigong» is a recent one",
      paragraphs: [
        "The name we use today became widespread in the 1950s, when the physician Liu Guizhen gathered the old practices under a single term at a sanatorium in the north. In 2003 China standardized four health qigong series —the Eight Brocades, the Five Animals, the Six Sounds and the Yi Jin Jing— and began studying them in clinical trials. The practice is ancient; the word is from the day before yesterday.",
      ],
    },
  ],

  // ── «El Dao Yin y el rostro femenino del Dao» ─────────────────────────────
  // Los antetítulos llevan hanzi y capítulo del Tao Te King: se copian tal cual.
  // Las tres últimas viñetas son citas del Tao Te King (cap. 25, 28 y 51).
  "tcm-dao-yin": [
    {
      eyebrow: "導引 · dǎo yǐn",
      paragraphs: [
        "Before the word «qigong» existed, this was called Dao Yin. 導 dǎo is to guide, to lead. 引 yǐn is to pull, to stretch, to draw toward you.",
        "Guiding the Qi and stretching the body: the name describes exactly what you are doing while you do it.",
      ],
    },
    {
      eyebrow: "168 BC",
      paragraphs: [
        "It is the name written on the silk of Mawangdui, beside each of those 44 figures stretching, twisting and breathing.",
        "Two thousand years later we are still doing the same thing under another name.",
      ],
    },
    {
      eyebrow: "引 is not 陰",
      paragraphs: [
        "The 引 of «stretching» is not the 陰 yīn of the feminine: they are two different characters and two different words.",
        "The feminine isn't in the name: it is at the very center of the whole of Taoism.",
      ],
    },
    {
      paragraphs: [
        "When Lao Tzu has to say what the Dao is, no figure of a father or a king comes to him. What comes to him is a mother, a valley, a womb, a hollow.",
        "What receives, what sustains, what gives Life without keeping anything for itself.",
      ],
    },
    {
      titulo: "It doesn't command: it nourishes",
      paragraphs: [
        "The Dao doesn't conquer: it yields, and that is why it prevails. It doesn't do: it lets things happen.",
        "That is the yin ground of this entire medicine, and of this practice too: in qigong nothing is forced. You open, you sustain and you let it pass through.",
      ],
    },
    {
      eyebrow: "Tao Te Ching, ch. 25 · 可以為天下母",
      paragraphs: [
        "«There is something that took form before heaven and earth. Silent, empty, alone and unchanging. It could be the mother of the world. I do not know its name; I call it Dao.»",
      ],
    },
    {
      eyebrow: "Tao Te Ching, ch. 28 · 知其雄，守其雌",
      paragraphs: [
        "«Know the masculine, keep to the feminine, and you will be the riverbed of the world.»",
      ],
    },
    {
      eyebrow: "Tao Te Ching, ch. 51 · 生而不有",
      paragraphs: [
        "«It gives birth to them and rears them; it makes them grow without possessing them; it works without leaning on the work; it guides them without dominating them.»",
      ],
    },
  ],

  // ── Los Brocados (Ba Duan Jin) · una viñeta por postura ───────────────────
  // Cada viñeta se COMPONE en el guion español: para qué sirve, los pasos
  // numerados y, al final, «repeticiones. clave». El inglés mantiene esa misma
  // estructura de párrafos —incluida la numeración de los pasos— para que las
  // dos versiones cuadren una a una. De momento hay cinco posturas escritas de
  // las ocho de la serie.
  "tcm-brocados": [
    {
      titulo: "Holding up the sky with both hands",
      paragraphs: [
        "To open from top to bottom and set in motion the axis that connects chest, abdomen and lower belly.",
        "1. Standing, feet hip-width apart. Interlace your fingers in front of your belly, palms facing up.",
        "2. Raise your hands up the midline to the chest, turn them over and push them toward the sky as you breathe in. Stretch without lifting your heels.",
        "3. Release your fingers and lower your arms out to the sides, as if stroking the air, as you breathe out.",
        "6 to 8 times. The stretch has to reach the sides of the ribs: if only the arms go up, the posture is doing nothing.",
      ],
    },
    {
      titulo: "Drawing the bow to one side and the other",
      paragraphs: [
        "To open the chest and widen the breath; it wakes up the strength of the waist.",
        "1. Open your legs a little wider than your shoulders and bend your knees, as if sitting on a high stool.",
        "2. Cross your arms in front of your chest. Stretch one out to the side with index finger and thumb open (the arrow) and pull the other back with a closed fist (the string), looking at the horizon.",
        "3. Come back to center as you breathe out and repeat to the other side.",
        "6 to 8 times per side. The gaze goes with the arrow, and the chest really opens: this is the posture that anyone with a short breath is most grateful for.",
      ],
    },
    {
      titulo: "Separating heaven and earth",
      paragraphs: [
        "To harmonize the center: the posture for heavy digestion and for meals that won't go down.",
        "1. Standing, hands in front of your belly, palms facing each other as if you were holding a ball.",
        "2. Raise one hand toward the sky, palm up and fingers turned inward, and push the other toward the floor, palm down. Breathe in as you open.",
        "3. Come back to center as you breathe out and change hands.",
        "6 to 8 times, alternating. The stretch crosses the side of the body on the diagonal: that is where the way opens for the spleen and the stomach.",
      ],
    },
    {
      titulo: "Looking back over your shoulder",
      paragraphs: [
        "To undo «the five fatigues and the seven injuries»: the old tiredness of the neck, the eyes and the spirits.",
        "1. Standing, arms loose at your sides, palms facing back.",
        "2. Breathing in, turn your head and torso to look over one shoulder, turning your palms outward as well. The turn is born in the chest, not in the neck.",
        "3. Come back to center as you breathe out and repeat to the other side.",
        "6 times per side. Turn only as far as you can go without pulling. The gaze reaches a little further than the neck, and half the posture is right there.",
      ],
    },
    {
      titulo: "Swinging the head and the hips",
      paragraphs: [
        "To bring down the fire of the heart: a hot head, a racing mind, insomnia, a flushed face.",
        "1. Legs apart and knees bent, hands resting on your thighs with your elbows turned out.",
        "2. Lean your trunk to one side and draw a slow arc with your head, forward and over to the other side, while your hips go the opposite way.",
        "3. Come back to center and repeat to the other side, slowly, without making yourself dizzy.",
        "6 times per side. The movement is slow and wide. If you get dizzy, make the arc shorter: the effect is in the slowness, not in the range.",
      ],
    },
  ],

  // ── Los Cinco Animales de Hua Tuo ─────────────────────────────────────────
  // El título de cada viñeta lleva el nombre chino de la serie delante
  // («五禽戲 Hua Tuo: El tigre»): se conserva igual, solo se traduce el animal.
  "tcm-cinco-animales": [
    {
      titulo: "五禽戲 Hua Tuo: The tiger",
      paragraphs: [
        "A slow swipe of the paw and a fixed stare. Strength that comes out of the tendons and the waist: it moves stagnant Qi and gives frustration a way out.",
      ],
    },
    {
      titulo: "五禽戲 Hua Tuo: The deer",
      paragraphs: [
        "A long neck and loose hips, turning like someone looking back without fear. It opens the lower back and warms the reserve.",
      ],
    },
    {
      titulo: "五禽戲 Hua Tuo: The bear",
      paragraphs: [
        "Weight rolling from one foot to the other, driven from the belly. It kneads the center from within: a digestive massage given with your own body.",
      ],
    },
    {
      titulo: "五禽戲 Hua Tuo: The monkey",
      paragraphs: [
        "Lightness, surprise, quick changes of gaze. It wakes up joy and pulls the mind out of its brooding.",
      ],
    },
    {
      titulo: "五禽戲 Hua Tuo: The crane",
      paragraphs: [
        "Wings that open very slowly, and balance on one leg. It widens the chest and lengthens the breath.",
      ],
    },
  ],

  // ── PROFUNDIZA de Fisiología · «Cómo se sintetiza un neurotransmisor» ────
  // Seis viñetas, sin título. Es el cómic «antes de empezar» del tema de los
  // Neurotransmisores. Tono de cuento corto: frases breves y en presente.
  "profundiza-neurotransmisores": [
    {
      paragraphs: [
        "It all starts on your plate.",
        "Many neurotransmitters are born from amino acids you get out of food: tryptophan, tyrosine…",
        "They're the bricks your brain will build its messengers with.",
      ],
    },
    {
      paragraphs: [
        "The amino acid travels to the neuron. Inside, enzymes transform it step by step, like a factory line.",
        "That's how tyrosine ends up turned into dopamine; tryptophan, into serotonin.",
      ],
    },
    {
      paragraphs: [
        "The freshly made neurotransmitter is stored in small bags: the vesicles.",
        "They wait, loaded, at the end of the neuron, ready to fire.",
      ],
    },
    {
      paragraphs: [
        "An electrical impulse arrives.",
        "The vesicles fuse with the membrane and release the neurotransmitter into the small space between two neurons: the synapse.",
      ],
    },
    {
      paragraphs: [
        "The neurotransmitter crosses over and fits into its receptor, like a key into its lock.",
        "That fit IS the message: the next neuron receives it and reacts.",
      ],
    },
    {
      paragraphs: [
        "Afterward, the message switches off.",
        "Part of the neurotransmitter is recycled back into the neuron (reuptake), the astrocytes clean it up or part of it is broken down.",
        "Everything is left clean for the next thought.",
      ],
    },
  ],

  // ── PROFUNDIZA de Fisiología · «¿Qué es realmente el cáncer?» ────────────
  // Seis viñetas, sin título: son las cajas de la rejilla del tema (el cómic ES
  // la página). Los títulos van vacíos en español y aquí no se inventan.
  //
  // ⚠️  TONO: mecanismo, nunca culpa. Se explica un proceso, no se reparte
  // responsabilidad; en inglés se mantiene igual de seco, sin suavizarlo.
  "profundiza-cancer": [
    {
      paragraphs: [
        "Every day, our body produces billions of cells. To do it, each cell has to copy some 3 billion bases of DNA.",
        "The copy is checked and repaired, but some errors stay. Most of them have no consequences.",
        "Cancer appears when a cell piles up alterations affecting genes that control proliferation, DNA repair and cell death.",
        "That's why cancer is usually a process of years or decades, not the result of a single mutation.",
      ],
    },
    {
      paragraphs: [
        "Oncogenes favor proliferation. Tumor suppressor genes hold it back.",
        "One of the most important is TP53, which produces the p53 protein (a very large enzyme). When it detects serious damage to the DNA, it can stop the cell dividing or switch on apoptosis.",
        "If these mechanisms fail, the cell can keep dividing despite piling up damage.",
        "On top of that, many tumor cells switch on telomerase, which maintains the telomeres and lets them extend how long they can go on dividing.",
      ],
    },
    {
      paragraphs: [
        "Mitochondria take part in producing energy and in processes such as apoptosis.",
        "In 1920, Otto Warburg observed that many tumor cells consume large amounts of glucose and produce lactate even when they have oxygen available: the Warburg effect.",
        "Warburg proposed that a defect in mitochondrial respiration could be the fundamental cause of cancer. That idea gave rise to the mitochondrial theory of cancer.",
        "Today we know it's more complex: many tumor cells keep functional mitochondria and combine mitochondrial respiration with a high rate of glycolysis, which produces lactate and can contribute to a more acidic environment. That way they obtain ATP and the building blocks they need to keep growing and dividing.",
      ],
    },
    {
      paragraphs: [
        "A growing tumor needs oxygen and nutrients.",
        "To get them it can release factors such as VEGF, which stimulate the growth of new blood vessels. This process is called angiogenesis.",
        "Tumor metabolism can change too. Some tumors consume a lot of glucose, a feature that PET scans make use of in order to locate certain tumor tissues.",
        "That's why changing your diet can help prevent cancer.",
      ],
    },
    {
      paragraphs: [
        "The immune system recognizes and clears out many abnormal cells before they ever manage to form a tumor.",
        "The tumor cells that survive can develop mechanisms to avoid that surveillance. Some, for instance, can inhibit the activity of certain T cells.",
        "Immunotherapy can block those inhibitory signals and let the immune system attack the tumor again.",
        "Not all cancers respond the same way: it depends on their genetic, molecular and immunological features.",
      ],
    },
    {
      paragraphs: [
        "Metastasis happens when tumor cells leave the original tumor, cross tissues, get into the circulation, survive the journey and manage to settle in another organ.",
        "Most of them fail, but a single cell can start a new tumor.",
        "That's why early detection matters so much.",
        "Treatment depends on the type of cancer and on its alterations: surgery, radiotherapy, chemotherapy, targeted treatments and immunotherapy.",
        "There is no single “cancer.” There are hundreds of different tumor diseases.",
        "In every case, understanding how a cell loses control is what makes it possible to develop better ways to prevent, detect and treat the disease.",
      ],
    },
  ],

  // ── Formas de cocinar · las veinte cocciones ─────────────────────────────
  // NO van aquí. Su inglés vive en `components/metodo/tcmCocinaContenido.en.ts`,
  // junto al resto de «Tu cocina diaria» (los gestos del día, el principio, lo
  // que conviene bajar y el día tipo), porque la página necesita todo eso y no
  // solo las viñetas. La galería de Ilustraciones las arma desde allí
  // (VINETAS_COCINA_EN, en TCMIlustracionesModal), así que este cómic no tiene
  // clave: tenerla aquí era el mismo texto escrito dos veces.

};
