// ─────────────────────────────────────────────────────────────────────────
// HISTORIA DEL ARTE Y LA LITERATURA, EN INGLÉS · solo el texto.
//
// Emparejado por la `key` de la era y la `key` del momento con
// `culturaHistoriaArte.ts`. El orden, las claves y las fotos salen SIEMPRE
// del español; lo que falte aquí se lee en español (ver `culturaHistorias.en.ts`).
//
// CONVENIOS (los mismos en las seis Historias):
//   · «a. C.» → BC   ·  «d. C.» → AD   ·  «s. IV a. C.» → 4th c. BC
//   · La coma decimal pasa a punto y el punto de los miles a coma (30.000 →
//     30,000). El % va pegado al número, como en inglés.
//   · «Dato curioso:» → «Fun fact:»   ·  el segundo, «Fun fact II:».
//   · Los títulos de obra con su nombre inglés de siempre (Don Quixote, The
//     Divine Comedy, The Thinker…); los nombres propios sin retraducir.
//   · Voz de María: segunda persona, contracciones naturales, frases cortas.
// ─────────────────────────────────────────────────────────────────────────
import type { HistoriaTexto } from "./culturaHistorias.en";

export const HISTORIA_ARTE_EN: HistoriaTexto = {
  // ── Prólogo ────────────────────────────────────────────────────────────
  prologo: {
    titulo: "What is art?",
    anio: "Before the journey begins",
    momentos: {
      "que-es-arte": {
        titulo: "What is art?",
        fecha: "The need to create",
        cuerpo: [
          "Art is everything we make not in order to survive, but to express something: an emotion, an idea, a beauty, a question. A painting, a song, a cathedral or a poem are ways of saying what ordinary words sometimes can't reach.",
          "The astonishing thing is that art isn't useful in the practical sense, and even so no culture has been able to live without it. It seems to be a need as human as eating or sleeping.",
          "Through history, art has served to worship the gods, honour the dead, display power, tell stories or, simply, look for beauty.",
          "Looking at the art of an era is looking into its soul: seeing the world through the eyes of the people who lived then.",
        ],
        dato: "Fun fact: the word «art» comes from the Latin ars, which meant «skill» or «technique». For centuries, painting or sculpting was considered a trade, not so different from a craftsman's.",
      },
      "por-que-creamos": {
        titulo: "Why do we create?",
        fecha: "The most human impulse",
        cuerpo: [
          "We create for many reasons: to express what we feel, to make sense of what we don't understand, to leave a mark and so that something of us stays behind when we're gone.",
          "Art and literature let us share another person's inner world: feel what someone felt thousands of years ago or on the other side of the planet.",
          "They also help us understand ourselves. Seeing our emotions reflected in a story or a painting, we find we aren't alone in what we feel.",
          "Maybe that's why we create: to connect, to remember and to understand a little better who we are.",
        ],
      },
      "arte-y-palabra": {
        titulo: "Art and the word",
        fecha: "Image and literature",
        cuerpo: [
          "This journey covers two great arts that grew up together. One is the art of the image: painting, sculpture, architecture. The other is the art of the word: poetry, theatre, the novel.",
          "Literature is, quite simply, the art of telling and of moving people using language. With words you can build worlds, characters and feelings as alive as any painting.",
          "They often walked hand in hand: the same myths that inspired sculptures also gave rise to poems, and many masterpieces were born of joining image and story.",
          "That's why we tell them together: they're the two ways humanity has always tried to say what it carries inside.",
        ],
      },
    },
  },

  // ── El arte nace ───────────────────────────────────────────────────────
  "arte-nace": {
    titulo: "Art is born",
    anio: "Prehistory",
    momentos: {
      "cuevas-rupestres": {
        titulo: "The painted caves",
        fecha: "More than 30,000 years ago",
        cuerpo: [
          "In caves like Altamira, in Spain, or Lascaux, in France, our ancestors painted bison, horses and deer with a realism and a force that still move us today.",
          "They did it in deep, awkward corners, by torchlight, using natural pigments. They weren't simple drawings: they were probably part of rituals connected with hunting or with beliefs about nature.",
          "Those paintings show that even in prehistory human beings didn't only want to survive, but also to represent the world and leave a record of it.",
          "It was the first art in history, and it's still speaking to us thousands of years later.",
        ],
        dato: "Fun fact: the Altamira paintings are so perfect that when they were found, many experts didn't believe they were prehistoric. They thought it was impossible that people that ancient could paint that well.",
        extras: [
          {
            titulo: "How you painted a cave",
            cuerpo: [
              "It's worth knowing how they were made, because it completely changes the idea of «primitive people scribbling».",
              "THE COLOURS they manufactured: red and yellow ochres from iron-rich earth, black from charcoal or burnt bone, white from kaolin. They crushed them, sieved them and mixed them with water, animal fat, sap or even saliva so they'd grip the rock. In some caves the stone containers where they prepared the mix have been found, along with brushes of hair and moss.",
              "THE TECHNIQUES were several and sophisticated: painting with a finger, with brushes, with skin pads, engraving with a flint, scraping the wall so the lighter colour underneath shows through… and BLOWING. Many hands appear «stencilled» because they put a hand on the wall and blew pigment around it, with the mouth or through a bone tube. It's the spray-can technique, thirty thousand years ago.",
              "THE LIGHT is the detail that impresses most. Many of these paintings are hundreds of metres from the entrance, in galleries of absolute darkness, sometimes reached by crawling. They worked with stone lamps full of animal fat and a juniper wick, which give a minimal, trembling light. Those lamps have been found, and also the remains of scaffolding: there were holes cut into the wall to slot in beams so they could paint the high ceilings.",
              "AND THEY USED THE ROCK. This is the most artistic feature of all: they pick a bulge in the wall to be a bison's back, a crack for the line of the belly, a hollow for the dip of a flank. With the trembling light of a lamp moving about, the volume appears and the animal seems to breathe. They weren't decorating a flat surface: they were using the cave.",
              "THEY KNOW THEIR ANATOMY. They draw the exact position of hooves at a gallop, the change of coat with the season, the posture of an animal in rut, the moment a rhinoceros charges. It's the eye of someone who has spent a life watching animals because their life depends on it.",
              "AND WHO PAINTED? For a century it was taken for granted that they were male hunters. In the 2010s, by measuring the finger proportions of the stencilled hands — a technique borrowed from forensic medicine — several studies concluded that a significant share are women's, and there are many small hands belonging to adolescents and children. There are even children's footprints in the mud of some galleries.",
              "And one last thing that's hard to picture: in some caves they painted, repainted and painted over again for THOUSANDS of years. It wasn't a work, it was a custom kept up by generations who never met each other.",
            ],
            dato: "Fun fact: Altamira was found in 1879 by an eight-year-old girl, María Sanz de Sautuola, who was there with her father and was the only one who looked up and saw the bison on the ceiling. The scientific community accused her father of having faked them and he died without seeing the find recognized; the paintings were accepted as genuine twenty years later.",
          },
        ],
      },
      "primeras-esculturas": {
        titulo: "The first sculptures",
        fecha: "Prehistory",
        cuerpo: [
          "Alongside the paintings, our ancestors also created the first sculptures: small figures carved in stone, bone or ivory.",
          "Many represent female figures, known as Venuses, which probably stood for fertility and life. Others represented animals in enormous detail.",
          "They were objects you could hold in your hand, perhaps amulets or sacred symbols that went about with people.",
          "With them, humanity gave three-dimensional form to its beliefs and desires: art came off the wall so it could be touched.",
        ],
        dato: "Fun fact: the Venus of Willendorf, one of the most famous sculptures of prehistory, was carved some 25,000 years ago and fits in the palm of a hand.",
      },
      "relatos-orales": {
        titulo: "Before writing: the stories",
        fecha: "The spoken word",
        cuerpo: [
          "Long before writing was invented, human beings were already telling stories. Around the fire, the elders told myths about the origin of the world, the feats of heroes and legends of ancestors.",
          "Those stories were passed on from memory, generation to generation, and were often recited with rhythm, repetition and music to make them easier to remember.",
          "It was oral literature: humanity's first form of literature, even though it wasn't written down anywhere.",
          "When writing finally arrived, many of those ancient stories could at last be fixed forever. But their origin was in the voice.",
        ],
      },
    },
  },

  // ── Las primeras civilizaciones ────────────────────────────────────────
  "primeras-civilizaciones": {
    titulo: "The first civilizations",
    anio: "≈3000 – 500 BC",
    momentos: {
      "arte-egipcio": {
        titulo: "Egyptian art",
        fecha: "≈3000 – 30 BC",
        cuerpo: [
          "Egyptian art was after eternity. Its pyramids, temples and statues were built to last forever and to accompany the dead into the next life.",
          "It followed very strict rules: human figures were always painted the same way, with the head in profile and the body facing forward. They weren't after realism, but order and symbol.",
          "That's why Egyptian art barely changed for almost three thousand years: it represented a stable, sacred, ordered world.",
          "Every image, every hieroglyph and every statue had a religious meaning. Art and faith were one and the same thing.",
        ],
        dato: "Fun fact: the Egyptians filled tombs with paintings and objects because they believed they'd help the dead person in the life after death. Thanks to that, we know today how they lived.",
      },
      "escritura-nace": {
        titulo: "Writing is born",
        fecha: "≈3300 BC",
        cuerpo: [
          "Writing was invented in Mesopotamia and Egypt, one of the greatest milestones in human history. At first it served to keep accounts and record harvests or taxes.",
          "But its immense power was soon discovered: with writing, words stopped depending on memory. They could be kept, copied and travel to distant places and times.",
          "Laws, prayers, myths and stories could at last be fixed in writing and preserved forever.",
          "Writing made literature as we know it possible, and with it the birth of history, because from then on humanity could leave a record of itself.",
        ],
        dato: "Fun fact: Mesopotamia's first writing is called cuneiform, because it was made by pressing a wedge-shaped reed into tablets of damp clay.",
      },
      gilgamesh: {
        titulo: "The Epic of Gilgamesh",
        fecha: "≈2100 BC",
        cuerpo: [
          "The Epic of Gilgamesh, written in Mesopotamia more than four thousand years ago, is the oldest work of literature that survives. It tells of King Gilgamesh's adventures in search of immortality.",
          "In it appear themes that still move us today: friendship, the fear of death, the wish to transcend and the acceptance that we're mortal.",
          "It also includes an account of a great flood very like the one that would appear centuries later in the Bible, proof of how stories travel between cultures.",
          "That the first great work of literature is about the fear of dying tells us a great deal: from the very start, literature served to face the deepest questions.",
        ],
        dato: "Fun fact: the Epic of Gilgamesh was lost and forgotten for millennia, until the tablets were found in the 19th century and their writing was deciphered.",
      },
    },
  },

  // ── Grecia y Roma: la belleza y el ideal ───────────────────────────────
  "grecia-roma": {
    titulo: "Greece and Rome: beauty and the ideal",
    anio: "8th century BC – 5th century AD",
    momentos: {
      "escultura-griega": {
        titulo: "Greek sculpture",
        fecha: "5th – 4th centuries BC",
        cuerpo: [
          "Greek sculptors set out to represent the human body as perfectly as possible. They studied ideal proportions and created figures of astonishing harmony and balance.",
          "Their statues look about to move: tensed muscles, natural poses, serene faces. They weren't only copying reality, they were improving on it, showing human beings in their noblest version.",
          "For the Greeks, beauty was bound up with order, proportion and measure. They believed visible harmony reflected a deeper harmony of the universe.",
          "That ideal of beauty has inspired Western art for more than two thousand years.",
        ],
        dato: "Fun fact: many Greek statues we see white today were actually painted in vivid colours. Time wiped the paint away and left us only bare marble.",
      },
      "templos-arquitectura": {
        titulo: "Temples and harmony",
        fecha: "Classical architecture",
        cuerpo: [
          "The Greeks raised temples like the Parthenon in Athens, built with rules of proportion so carefully worked out that they still look perfect to us today.",
          "They invented the architectural orders, different styles of column and decoration that would shape Western architecture for centuries.",
          "They were after balance and serenity: buildings that conveyed order, harmony and grandeur without being crushing.",
          "Their influence is so enormous that many museums, parliaments and banks around the world still imitate, to this day, the shape of a Greek temple.",
        ],
      },
      homero: {
        titulo: "Homer",
        fecha: "≈8th century BC",
        cuerpo: [
          "Homer is credited with the two great epics of Greek antiquity: the Iliad, which tells of an episode in the Trojan War, and the Odyssey, the long, eventful journey home of the hero Odysseus.",
          "They're enormous poems, full of gods, heroes, battles and adventures, but also of very human feelings: honour, rage, homesickness and the longing to return.",
          "For centuries they were recited from memory before being written down. The Greeks considered them the basis of their culture and learned them from childhood.",
          "The Iliad and the Odyssey are among the most influential works in world literature, and they're still read and studied all over the world today.",
        ],
        dato: "Fun fact: we don't know for certain whether Homer really existed or whether he was a figure who gathered together the tales of many earlier poets.",
      },
      "teatro-griego": {
        titulo: "Greek theatre",
        fecha: "5th century BC",
        cuerpo: [
          "Theatre as we know it was born in Athens. Thousands of spectators gathered in great open-air tiers of seats to watch tragedies and comedies performed.",
          "The tragedies told stories of heroes facing their fate, their pain and impossible decisions. They set out to move the audience deeply and make them think about life.",
          "The comedies, by contrast, laughed at politics, at society and at human weaknesses.",
          "Greek theatre invented a form of art that's still very much alive: telling stories with actors on a stage to move and provoke the people gathered there.",
        ],
        dato: "Fun fact: in Greek theatre the actors wore masks to play different characters and emotions, and that way they could be seen even from the highest tiers.",
        extras: [
          {
            titulo: "What going to the theatre in Athens was like",
            cuerpo: [
              "It was nothing like going to the theatre today, and understanding that explains why those plays still work 2,500 years later.",
              "IT WAS A RELIGIOUS AND CIVIC FESTIVAL. The performances were part of the festivals in honour of Dionysus, once a year. The whole city stopped: business was suspended and even trials, and at one point poor citizens were paid so they could attend. The theatre of Dionysus holds some fourteen thousand people.",
              "IT WAS A COMPETITION. Three authors competed, and each presented three tragedies in a row plus a satyr play to let the tension out. A jury chosen by lot awarded the prize. You spent the whole day there, from dawn, eating what you'd brought from home.",
              "EVERYBODY KNEW THE ENDING. The stories were myths the audience knew by heart: Oedipus is going to kill his father, Antigone is going to die, Agamemnon is going to be murdered on his return from Troy. Nobody was going to find out what happens. They were going to see HOW it's told and what question it raises. It's the exact opposite of «no spoilers».",
              "THE ACTORS were two or three, all men, and they played every part by changing masks, the female ones included. The masks had an amplified mouth to project the voice, they wore thick-soled shoes to look bigger, and they performed in a circular space, the orchestra, with astonishing acoustics: at Epidaurus you can hear a coin drop in the centre from the back row.",
              "AND THERE WAS A CHORUS, which is the piece that seems strangest to us today and the most interesting: a group that sings and dances, commenting on the action, asking, warning, doubting. It's the voice of the city watching the drama. When you watch a film with a soundtrack telling you how to feel, you're watching a descendant of the Greek chorus.",
              "WHAT WAS AT STAKE THERE. The tragedies set up conflicts with no clean solution: Antigone has to choose between the law of the city and the duty to bury her brother, and both are just. Oedipus does everything he can to avoid his fate and precisely for that reason fulfils it. They aren't stories of goodies and baddies: they're machines for thinking through dilemmas in public. Aristotle called the effect catharsis: the emotional purge of seeing on stage, safely, what you most fear.",
              "AND COMEDY was extraordinarily free. Aristophanes mocked by name the politicians sitting in the front rows, the generals, the philosophers — there's a play of his that laughs at Socrates, alive and present in the city — and even the war in the middle of the war. In his play «Lysistrata», the women of Greece go on a sex strike to force peace. In 411 BC.",
              "The three great tragedians — Aeschylus, Sophocles and Euripides — wrote more than three hundred plays between them. Thirty-two have reached us. Everything else was lost.",
            ],
            dato: "Fun fact: almost all our vocabulary for performance comes from there. «Theatre» is «the place for seeing»; «drama» is simply «action»; «scene» was the hut where the actors changed; «protagonist» is «the first competitor»; «orchestra» was the space where the chorus danced; and «person», according to many, comes from the Latin name for the mask.",
          },
        ],
      },
      "arte-romano": {
        titulo: "The art of Rome",
        fecha: "3rd century BC – 5th century AD",
        cuerpo: [
          "Rome deeply admired Greek art and copied and imitated it across its empire. But it added its own things too: an enormous talent for engineering and a taste for realism.",
          "It built aqueducts, roads, amphitheatres like the Colosseum and buildings like the Pantheon, with technical advances such as the arch, the vault and concrete.",
          "In sculpture, the Romans made portraits so realistic that they showed people's wrinkles and flaws, going for likeness rather than the ideal.",
          "In literature, poets like Virgil gave Rome its great epic, the Aeneid, inspired by Homer. Rome spread all this culture across Europe, where it would put down roots forever.",
        ],
        dato: "Fun fact: many Greek masterpieces have been lost, and we only know them thanks to the copies the Romans made — they admired them so much that they reproduced them everywhere.",
      },
    },
  },

  // ── La Edad Media: fe y símbolo ────────────────────────────────────────
  "edad-media": {
    titulo: "The Middle Ages: faith and symbol",
    anio: "5th – 15th centuries",
    momentos: {
      "romanico-gotico": {
        titulo: "Cathedrals: Romanesque and Gothic",
        fecha: "11th – 15th centuries",
        cuerpo: [
          "The Middle Ages left us two great styles of religious art. The Romanesque, with churches of thick walls, rounded arches and a solid, serene air, like fortresses of faith.",
          "Then came the Gothic, with soaring cathedrals full of light, with enormous coloured windows and arches that seemed to stretch toward the sky.",
          "Those cathedrals sometimes took more than a hundred years to build and were the heart of the city. Everything in them was designed to lift the soul toward the divine.",
          "Medieval art wasn't trying to copy reality, but to convey the sacred and make the faithful feel the greatness of God.",
        ],
        dato: "Fun fact: the great Gothic windows worked like luminous comics: they told Bible stories in pictures so that a population that mostly couldn't read would understand them.",
      },
      "manuscritos-iluminados": {
        titulo: "Books made by hand",
        fecha: "The scriptorium",
        cuerpo: [
          "Before printing, every book was copied by hand, letter by letter. In the monasteries, monks spent months or years reproducing sacred texts and ancient works.",
          "Many of these manuscripts were decorated with beautiful illustrations and gilded letters: these are the illuminated manuscripts, genuine works of art.",
          "Thanks to that patient labour, many Greek and Roman texts were preserved that would otherwise have been lost forever.",
          "A book was then an extremely rare and extremely valuable object, within reach of very few. Reading was a privilege.",
        ],
        dato: "Fun fact: some manuscripts were so valuable that they were chained to library walls so that nobody could steal them.",
      },
      dante: {
        titulo: "Dante and the Divine Comedy",
        fecha: "1265 – 1321",
        cuerpo: [
          "The Italian poet Dante Alighieri wrote the Divine Comedy, one of the greatest poems in all literature. In it, Dante imagines a journey through hell, purgatory and paradise.",
          "Along the way he meets historical figures and reflects the entire worldview of his time: religion, morality, politics and love.",
          "The revolutionary part is that he didn't write it in Latin, the learned language, but in Italian, the language of the people. With that he brought great literature closer to ordinary people.",
          "The Divine Comedy is like a bridge: it closes the Middle Ages and already announces the spirit of the Renaissance that was about to arrive.",
        ],
        dato: "Fun fact: by writing in Italian rather than Latin, Dante helped turn his language into a literary one. That's why he's considered one of the fathers of modern Italian.",
      },
      "musica-escrita": {
        titulo: "Music learns to be written down",
        fecha: "9th–15th centuries",
        cuerpo: [
          "Music is the oldest art and the most fragile. Bone flutes have been found that are more than 40,000 years old, and we know that in Greece, in Egypt and in China music was central to worship, festivity and theatre. And yet practically none of it survives, for a simple reason: it couldn't be written down.",
          "The problem began to be solved in the monasteries, and for a very practical reason: the Church wanted the chant to sound THE SAME everywhere, and passing it on by ear produced a different version in every place. So they started putting marks above the text to remember whether the voice went up or down.",
          "Around the year 1030, an Italian monk called Guido of Arezzo made the decisive leap: he placed the notes on LINES, so that the height on the page indicated the pitch of the sound. With that, for the first time in history, you could correctly sing a melody you'd never heard. It's an invention comparable to writing, and with an equally huge consequence: music stopped depending on memory.",
          "He also named the notes, using the first syllables of a hymn: ut, re, mi, fa, sol, la (the «ut» was later changed to «do»). Every time someone sings the scale they're using an 11th-century monk's system.",
          "With notation came what was impossible without it: POLYPHONY. If you can write several lines at once, you can compose for several voices sounding together, fitted to each other, with rules about what combines with what. That's harmony, and it's the feature that sets Western music apart from almost every other tradition in the world, which tend to be more focused on melody and rhythm.",
          "And the first composers with names of their own appeared, no longer anonymous: Hildegard of Bingen, a 12th-century German abbess whose music is still being recorded today; Guillaume de Machaut, poet and musician of the 14th century; and the troubadours, who took song out of the church and sang in the vernacular about love, war and politics.",
        ],
        dato: "Fun fact: written music is also the reason we can «resurrect» sounds. Nobody has ever heard a medieval choir sing, and yet today those works are performed exactly as they were notated a thousand years ago. It's the only time machine that really works.",
      },
      "arte-islamico": {
        titulo: "Islamic art: the letter and geometry",
        fecha: "8th–15th centuries",
        cuerpo: [
          "In Islamic religious art neither God nor the prophets are depicted, to avoid any risk of idolatry. In many contexts depicting people and animals was avoided too. And that, which could have been a suffocating limitation, produced one of the most original and sophisticated artistic traditions in history.",
          "Unable to rely on the figure, they developed three languages to the extreme.",
          "CALLIGRAPHY. The written word became the major art. Since for a Muslim the Qur'an is the literal word of God, writing it well is a religious act, and the Arabic script — flexible, stretchable, joined up — lent itself to an infinite play of styles, from angular Kufic to strokes that seem to dance. There are calligraphies that form the silhouette of an animal or a ship out of nothing but words. The most respected artist wasn't the painter: it was the calligrapher.",
          "GEOMETRY. With ruler and compass they developed patterns that repeat and interlock leaving no gaps, with symmetries of astonishing complexity. And here's a detail that surprises anyone: in the Alhambra in Granada, all or almost all of the possible types of plane symmetry that modern mathematics described in the 19th century are represented in 14th-century tiles. Five centuries before the theory existed, those craftsmen had exhausted the possibilities by sheer craft.",
          "THE ARABESQUE. Interlaced plant forms that grow and branch with no visible end. The intention is explicit: to suggest the infinite, something that can't be shut inside a figure.",
          "And with those three elements they built spaces like the mosque of Córdoba, with its forest of columns and its red and white arches; the Alhambra, with its water courts, its muqarnas like stalactites and its walls that are literally written poems; or the Taj Mahal.",
          "Their influence in Europe was enormous and almost always invisible: tiles, worked plaster, coffered wooden ceilings, textiles, carpets, tapestries, glass, marquetry and a good deal of Spanish and Portuguese decoration come from there. The word «arabesque» says it all.",
        ],
        dato: "Fun fact: in the Alhambra, the phrase repeated most on its walls, hundreds of times, in plaster and in tile, is «only God is victor». It's the motto of the Nasrid kingdom turned into decoration: an entire palace coated in a single sentence.",
      },
      "arte-asiatico": {
        titulo: "China and Japan: emptiness and the brushstroke",
        fecha: "7th–19th centuries",
        cuerpo: [
          "While Europe filled its panels with figures right to the edge, in China and Japan an almost opposite idea was developing: that empty space isn't a gap to be filled but part of the work. Mist, air, untouched paper are what let a landscape breathe.",
          "CHINESE PAINTING, done with ink and brush on silk or paper, isn't out to copy a particular landscape but to catch its energy, its character. It's painted from memory and in one go, because ink allows no corrections: every stroke is final. And that's why painting, poetry and calligraphy are considered the same discipline there — «the three perfections» — and it's normal for a painting to carry a poem written inside it, with the lettering forming part of the composition.",
          "In JAPAN, alongside ink painting, an aesthetic idea developed that fascinates the whole world today: the beauty of the imperfect, the asymmetrical and what ages — what's called wabi-sabi. Out of it come the tea ceremony, with its irregular bowls and its meticulously measured gestures; gardens of raked sand; the art of mending broken pottery with gold instead of hiding the crack; and a tiny poetry, the haiku, of three lines and seventeen syllables, which explains nothing and only points at an instant.",
          "And in the 18th and 19th centuries came ukiyo-e, the Japanese woodblock print: cheap pictures made in their thousands for ordinary people, with actors, wrestlers, courtesans, landscapes and waves. The most famous in the world is Hokusai's «The Great Wave».",
          "AND HERE'S THE PART THAT CONNECTS THIS WHOLE JOURNEY. In the mid-19th century, those prints started arriving in Europe, sometimes literally as wrapping paper for porcelain. And they exploded in French painters' faces: they saw compositions cut off at the edges, very high viewpoints, flat colours with no shading, no classical perspective, scenes of everyday life with no solemnity at all. That is, they saw everything they were starting to want to do.",
          "Monet collected Japanese prints and painted his wife in a kimono; Van Gogh copied them and went so far as to say he wanted to «see with Japanese eyes»; Degas and Toulouse-Lautrec stole their framing. Without the Japanese print, Impressionism and European modern art would have been something else.",
        ],
        dato: "Fun fact: Hokusai published «The Great Wave» when he was over seventy, sometimes signed himself «the old man mad about drawing», and said that only from seventy-three had he really begun to understand the form of animals and plants. He changed his artistic name about thirty times over his life.",
      },
    },
  },

  // ── El Renacimiento: el ser humano en el centro ────────────────────────
  renacimiento: {
    titulo: "The Renaissance: human beings at the centre",
    anio: "15th – 16th centuries",
    momentos: {
      perspectiva: {
        titulo: "The discovery of perspective",
        fecha: "15th century",
        cuerpo: [
          "Throughout the Middle Ages, paintings looked flat: there was no sense of depth. In the Renaissance, artists discovered perspective, a technique for representing space as the eye sees it.",
          "Using mathematical rules, they learned to paint so that things looked smaller the further away they were, creating the illusion of depth on a flat picture.",
          "Suddenly, paintings became windows opening onto a three-dimensional, realistic world.",
          "Perspective joined art and science: to paint reality better, artists had to study mathematics, optics and geometry.",
        ],
        dato: "Fun fact: perspective was such an important discovery that it changed painting forever. It was like going from a flat drawing to an almost three-dimensional image.",
        extras: [
          {
            titulo: "How perspective works (and what it really changed)",
            cuerpo: [
              "The rule is simple and you can check it by looking out of the window right now: all the parallel lines running away from you — the edges of a street, railway tracks, the joins in the floor — seem to meet at a single point on the horizon. That point is the vanishing point.",
              "And there's a second rule: identical things look smaller the further away they are, and in an exact, calculable proportion. With those two, you can build on a flat surface the complete illusion of a space with depth, and place each figure in its spot at the size it should be.",
              "THE FIRST THING TO UNDERSTAND is that it isn't a decorative trick: it's geometry, and that's why it arrived exactly when it did. The man who demonstrated it was an architect, Brunelleschi, and the man who wrote it up as a method was another, Alberti. It was done with rulers, threads, grids and mathematics. Art started doing geometry homework.",
              "AND THERE'S A CONSEQUENCE THAT CHANGES EVERYTHING, and it's the reason this moment matters so much in the history of ideas: perspective requires choosing ONE point of view. That is: the picture is organized from the exact place where a person is standing and looking. Before, in medieval art, the size of the figures depended on their importance — an enormous Christ, a tiny donor, everything floating on a gold background with no real space. Afterward, size depends on the DISTANCE of each thing from one particular human eye.",
              "That's exactly what was happening in the philosophy, the science and the religion of that century: human beings place themselves at the centre and the world is ordered from their point of view. Perspective is humanism turned into a drawing technique.",
              "HOW THEY USED IT. With it you paint believable interiors, chequered floors receding into the distance, imaginary architecture to set the scenes in, and above all you can DIRECT the gaze: if the vanishing point falls right on a character's head, your eyes go there without your knowing why. In Leonardo's «Last Supper», every line of the ceiling and the walls converges on Christ's face.",
              "ITS TRICKS AND ITS GAMES. Since it's a calculation, it can be manipulated: there are pictures with the perspective deliberately forced to produce unease, and there's the game of anamorphosis, where a shape can only be recognized from an odd angle. The most famous case is Holbein's «The Ambassadors», with an elongated smear on the floor that, seen from the side, turns out to be a perfect skull.",
              "AND WHAT CAME AFTERWARD is just as interesting: four centuries later, modern painters set about breaking it on purpose. The Impressionists loosened it, Cézanne deformed it, Cubism blew it apart by showing an object from several viewpoints at once. It wasn't ignorance: it was a decision, and you can only break a rule that exists first.",
              "And you use it constantly today without knowing: the engine of any video game, any architectural render and any animated film calculates exactly what Brunelleschi was calculating with his threads, only sixty times a second.",
            ],
            dato: "Fun fact: to prove his method worked, Brunelleschi painted a panel showing the Florence baptistery as seen from the cathedral door, drilled a tiny hole in it and set up a mirror. Whoever looked through the hole saw the reflection of the painting and, on taking the mirror away, the real building: and you couldn't tell them apart. It was an experimental, almost scientific demonstration, done with a mirror and a panel.",
          },
        ],
      },
      leonardo: {
        titulo: "Leonardo da Vinci",
        fecha: "1452 – 1519",
        cuerpo: [
          "Leonardo da Vinci is the perfect symbol of the Renaissance genius. He was a painter, but also an inventor, an engineer, an anatomist and a student of nature.",
          "He painted works as famous as the Mona Lisa and The Last Supper, with a technique and an expressiveness that still fascinate the whole world.",
          "He filled thousands of notebooks with drawings and notes: studies of the human body, flying machines, engineering plans, observations of plants and water.",
          "For Leonardo, art and science were the same thing: two ways of observing and understanding the world with infinite curiosity.",
        ],
        dato: "Fun fact: the Mona Lisa is now the most famous painting in the world. Its mysterious smile still fascinates the millions of people who queue every year to see it.",
      },
      "miguel-angel": {
        titulo: "Michelangelo",
        fecha: "1475 – 1564",
        cuerpo: [
          "Michelangelo was one of the greatest artists of all time, brilliant in sculpture, in painting and in architecture alike.",
          "He carved works like the David, a marble figure over five metres tall that looks about to breathe, and painted the astonishing ceiling of the Sistine Chapel, covering it with biblical scenes.",
          "He worked with absolute intensity and dedication, seeking in every work the fullest expression of human strength and beauty.",
          "He said that sculpting consisted of «freeing» the figure already sleeping inside the block of marble, by removing what was left over.",
        ],
        dato: "Fun fact: Michelangelo painted the ceiling of the Sistine Chapel, hundreds of square metres of it, in about four years, working on his back and looking upward through endless days.",
      },
      "imprenta-libro": {
        titulo: "Printing and the book",
        fecha: "≈1450",
        cuerpo: [
          "Around 1450, Johannes Gutenberg invented movable-type printing in Europe. For the first time, books could be made quickly and in quantity, instead of being copied by hand one at a time.",
          "The effect was immense. Books became far cheaper and more plentiful, and knowledge stopped being reserved for a privileged few.",
          "More people learned to read, ideas travelled at a speed never seen before, and literature could reach an enormous audience.",
          "Printing transformed culture forever. Without it, neither modern science nor the great revolutions of ideas that came later make any sense.",
        ],
        dato: "Fun fact: the first great book Gutenberg printed was a Bible. Today, the few surviving copies are among the most valuable books in the world.",
      },
    },
  },

  // ── El Barroco: emoción y movimiento ───────────────────────────────────
  barroco: {
    titulo: "The Baroque: emotion and movement",
    anio: "17th century",
    momentos: {
      "caravaggio-barroco": {
        titulo: "The Baroque and light",
        fecha: "17th century",
        cuerpo: [
          "Baroque artists discovered the enormous dramatic power of light. Painters like Caravaggio lit their figures strongly against dark backgrounds, creating an intense contrast called chiaroscuro.",
          "Their scenes look like frozen instants of maximum emotion: dramatic gestures, movement, tension. The aim was to move the viewer and pull them inside the scene.",
          "The Baroque filled everything: churches, palaces and squares were covered in sculpture, painting and exuberant decoration.",
          "It was an art designed to impress and to move, to reach the heart before the head.",
        ],
        dato: "Fun fact: chiaroscuro, that strong contrast between light and shadow the Baroque invented, is still used today in cinema and photography to create scenes full of drama.",
      },
      velazquez: {
        titulo: "Velázquez",
        fecha: "1599 – 1660",
        cuerpo: [
          "Diego Velázquez, painter at the Spanish court, was one of the greatest geniuses of painting of all time. He commanded light, colour and realism like almost nobody else.",
          "His most famous work, Las Meninas, is a picture so ingenious that it still surprises today: it plays with mirrors, with gazes and with the point of view, and includes the painter himself painting.",
          "Velázquez portrayed kings and humble people alike with the same truth and dignity, catching life as it was.",
          "Centuries later, artists all over the world would still be studying his paintings to learn how to paint reality and light.",
        ],
        dato: "Fun fact: Las Meninas has fascinated other painters so much that later masters, Picasso among them, made their own versions of it.",
        extras: [
          {
            titulo: "Las Meninas, gaze by gaze",
            cuerpo: [
              "It's probably the most discussed painting in the history of art, and it deserves to be told slowly, because once you see the whole of it, it stops being «a picture of a little girl with her ladies» and becomes a puzzle.",
              "WHO'S THERE. In the centre, the Infanta Margarita, daughter of Philip IV, aged five. On either side, two maids of honour (the «meninas»), one offering her water in a little jug. On the right, two people with dwarfism who lived at court — Maribárbola, who looks straight out with enormous dignity, and Nicolasito, who's resting a foot on an enormous, half-asleep dog. Behind, in shadow, a lady and a chaperone talking. At the back, in a lit doorway, a man climbing some stairs and turning. And on the left, in front of a gigantic canvas of which we only see the back, Velázquez with his palette and brush.",
              "THE FIRST QUESTION: what is he painting? We can't see it. And that's where the game starts.",
              "THE MIRROR AT THE BACK. Among the dark pictures on the wall there's a rectangle that shines: it's a mirror, and in it appear the king and queen, Philip IV and Mariana of Austria. They're reflected, which means they're IN FRONT of the picture. In the exact place where you are.",
              "And out of that comes the most astonishing joke in Spanish painting: the viewer occupies the king and queen's place. Everyone — the Infanta, Maribárbola, the painter — is looking toward that point, which is to say, looking at you. When you walk into that room in the Prado and stand in front of it, you walk into the scene.",
              "THE THREE SPACES. Velázquez paints at once the hall where the scene takes place, the space outside the picture where the king and queen and you are, and the space at the back, with that open door and the light. It's a lesson in perspective and in air: you can measure the distance between the figures purely by how the light fades.",
              "HOW IT'S PAINTED. Get close and you'll see smudges: quick, loose, almost disordered brushstrokes; a lace cuff is four touches of white. Step back two metres and it all organizes itself. Velázquez paints what the eye SEES, not what the hand knows is there, and that — trusting the viewer's eye to complete it — is what Impressionism will do two hundred years later. Manet called him «the painter of painters» and said that after seeing him he felt like throwing his own pictures away.",
              "AND THERE'S ONE LAST LAYER, the personal one. Velázquez wears on his chest the red cross of the Order of Santiago, a noble honour that cost him years of paperwork and that was actually granted after the picture was finished: it was added later. Painting himself, life-size, inside the royal hall and in the same picture as his monarchs was a quiet way of claiming something that was far from settled in his day: that painting isn't a manual trade but a liberal art, and the painter not a craftsman but a gentleman.",
              "That's why Las Meninas is said to be a painting about the act of painting and the act of looking. It doesn't tell a mythological story or a biblical episode: it tells what's happening in the room, including whoever is looking.",
            ],
            dato: "Fun fact: the philosopher Michel Foucault opens one of his most important books with twenty pages devoted to this painting alone. And in 1957 Picasso painted fifty-eight different versions of it, one after another, like someone taking an engine apart piece by piece to understand how it works.",
          },
        ],
      },
      cervantes: {
        titulo: "Cervantes and Don Quixote",
        fecha: "1547 – 1616",
        cuerpo: [
          "The Spaniard Miguel de Cervantes wrote Don Quixote of La Mancha, considered the first modern novel and one of the most important works in world literature.",
          "It tells the story of a country gentleman who, from reading so many books of chivalry, loses his wits and takes to the roads believing himself a knight errant, accompanied by the plain-spoken Sancho Panza.",
          "It's a brilliant work mixing comedy and tenderness, madness and wisdom, laughing affectionately at human dreams and human weaknesses.",
          "Don Quixote and Sancho have become two of the most famous and best-loved characters in all literature.",
        ],
        dato: "Fun fact: Don Quixote is one of the most translated and most read books in history, second only to the Bible. It's read all over the world four centuries later.",
        extras: [
          {
            titulo: "Why Don Quixote is the first modern novel",
            cuerpo: [
              "That phrase gets repeated a lot and is almost never explained. There are five concrete reasons, and you can recognize every one of them in any novel or series you watch today.",
              "1. THE CHARACTERS CHANGE. Before, a hero in a book of chivalry was brave on page one and brave on the last: characters were fixed, like chess pieces. Not here. Over a thousand pages, Don Quixote becomes more lucid and sadder, and Sancho, who starts out a gullible, greedy farmhand, becomes wise and loyal. It's the first time two characters transform through rubbing against each other. That's a character arc, and today it's the basis of any screenplay.",
              "2. NOBODY IS ENTIRELY RIGHT. The book doesn't say whether Don Quixote is a madman to be laughed at or an idealist to be admired, and that's why it can be read as a savage comedy or as a devastating tragedy. That multiple point of view, with no narrator telling you who to love, is the mark of the modern novel.",
              "3. THEY TALK THE WAY PEOPLE TALK. Cervantes puts into the same book the speech of farmhands, innkeepers, convicts, dukes, priests and moriscos, with their proverbs, their swearing and their mistakes. Until then, learned literature didn't go down there.",
              "4. IT LAUGHS AT ITSELF. It's a book that knows it's a book. In the second part, the characters have READ the first part and comment on its errors; Don Quixote finds out an impostor is publishing a fake continuation — which had actually happened — and is furious; and the narrator pretends the story was written by an Arab historian and that he merely had it translated. Every metafictional game the 20th century thought it was inventing was already there in 1615.",
              "5. AND IT'S ABOUT SOMETHING VERY SERIOUS: what happens when someone decides to live according to what they've read. Don Quixote is a man who has consumed so much fiction that he confuses fiction with the world, and goes out on the road to behave as his fiction dictates. It's the first great book about the power of stories to shape whoever consumes them, and it's hard to think of a more current subject.",
              "THE STORY OF ITS AUTHOR adds another layer. Cervantes was a soldier, lost the use of a hand to a harquebus shot at the battle of Lepanto, spent five years a captive in Algiers after four failed escape attempts, came back to Spain with no reward, worked as a tax collector, ended up in prison over accounting trouble, failed as a playwright and published the first part of Don Quixote at fifty-seven, poor. He's the most important writer in the language and he died without money.",
              "And one last thing, for anyone who hasn't got round to it: you don't have to read it all in one go or start at the beginning with solemnity. It's written in episodes, it's far funnier than its reputation as a classic suggests, and its last page is among the most beautiful and saddest things ever written in Spanish.",
            ],
            dato: "Fun fact: Cervantes died in April 1616, at almost the same time as Shakespeare. For centuries it was said they'd died on the same day, 23 April, and that's where World Book Day comes from. They didn't actually coincide: England was still using the old calendar and Spain the new one, so there are ten days between the two dates. The two giants of European literature lived at the same time, never met, and even their deaths don't line up.",
          },
        ],
      },
      shakespeare: {
        titulo: "Shakespeare",
        fecha: "1564 – 1616",
        cuerpo: [
          "The Englishman William Shakespeare is probably the greatest playwright in history. He wrote tragedies, comedies and dramas that are still performed every day all over the world.",
          "Works like Romeo and Juliet, Hamlet or Macbeth explore the deepest human feelings: love, jealousy, ambition, doubt, revenge and death.",
          "He created characters so alive and complex that they seem like real people, and wrote with a richness of language that enriched English forever.",
          "Curiously, Shakespeare and Cervantes, the two giants of their age, died at almost the same time, in 1616.",
        ],
        dato: "Fun fact: it's reckoned that Shakespeare invented or popularized hundreds of words and expressions still used in English today.",
      },
    },
  },

  // ── Romanticismo y Realismo ────────────────────────────────────────────
  "siglos-xviii-xix": {
    titulo: "Romanticism and Realism",
    anio: "18th – 19th centuries",
    momentos: {
      "goya-romanticismo": {
        titulo: "Goya and Romanticism",
        fecha: "18th – 19th centuries",
        cuerpo: [
          "Romanticism put emotion, freedom and imagination first. Artists painted storms, grandiose landscapes, intense passions and also the darker sides of human beings.",
          "The Spaniard Francisco de Goya is a key figure. He started out painting pleasant scenes, but ended up portraying war, injustice and nightmares with harrowing force.",
          "His painting of the shootings of the people of Madrid shows the horror of war without dressing it up, denouncing the cruelty.",
          "With Romanticism, art became more personal: it was no longer only after beauty, but after expressing everything human beings feel, fear and pain included.",
        ],
        dato: "Fun fact: at the end of his life, Goya painted the so-called «black paintings» directly onto the walls of his house, dark, disturbing works he never meant to show anyone.",
      },
      "novela-xix": {
        titulo: "The great novel of the 19th century",
        fecha: "19th century",
        cuerpo: [
          "The 19th century was the golden age of the novel. Authors all over Europe wrote long stories portraying the society of their time in enormous detail.",
          "Writers like Charles Dickens in England denounced poverty and injustice; in Russia, Tolstoy and Dostoevsky explored the human soul with immense depth; in Spain, Benito Pérez Galdós shone.",
          "These novels told the lives of characters from every social class and made readers think about society, morality and life.",
          "The novel became the great popular art of the age: it was read everywhere and reached a huge number of people.",
        ],
        dato: "Fun fact: many famous 19th-century novels were published in instalments in the newspapers. People waited impatiently for the next one, the way we wait for the next episode of a series today.",
        extras: [
          {
            titulo: "The women who signed with a man's name",
            cuerpo: [
              "The 19th century is the century of the great novel, and also the century in which it became clearest that talent wasn't the problem: the problem was the signature.",
              "THE BRONTË SISTERS published their first works as Currer, Ellis and Acton Bell, three deliberately ambiguous male names. Charlotte explained afterward why: they knew a woman author was judged «with prejudice», with condescension if she wrote well and with cruelty if she wrote badly. Under those names they published «Jane Eyre» and «Wuthering Heights», two books that are on any list of the best in English literature today, and that at the time were considered too violent and too passionate to have been written by a woman.",
              "MARY ANN EVANS signed as GEORGE ELIOT and came to be considered the best English novelist of her century. She chose the pseudonym for two reasons: so her books wouldn't be read as «lady novels», and because she lived with a married man, which had expelled her from respectable social life.",
              "AMANTINE AUPIN signed as GEORGE SAND, dressed as a man so she could get into places women weren't allowed — including the cheap stalls of the theatres — and was one of the most widely read authors in France.",
              "JANE AUSTEN published her novels anonymously, «by a Lady», and never saw her name printed on any of her books in her lifetime.",
              "AND THERE WAS A MATERIAL REASON behind all of this, not just prejudice: for much of the century, a married woman couldn't sign contracts or manage her own money. Her royalties belonged to her husband.",
              "IN PAINTING it was worse, because it required access to training. European academies didn't admit women, or admitted them under a quota, and above all barred them from the life class with a nude model, which was the basis of learning the human body and therefore of the genres considered «major»: history painting, mythology, the biblical scene. Without that, they were condemned to the «minor» genres: the portrait, the still life, the flower piece.",
              "And even so they appeared. Artemisia Gentileschi, in the Baroque, painted biblical heroines with a force nobody had brought to them before and was the first woman admitted to the Academy of Florence; Sofonisba Anguissola was court painter to Philip II; Élisabeth Vigée Le Brun, portraitist to Marie Antoinette; Rosa Bonheur applied for official police permission to wear trousers so she could paint in slaughterhouses and cattle fairs; Berthe Morisot and Mary Cassatt were first-rank Impressionists whose paintings hung in the same exhibitions as Monet's; and Camille Claudel, an extraordinary sculptor, ended up confined in a psychiatric hospital for thirty years, with part of her work attributed to Rodin.",
              "In 1971, an art historian, Linda Nochlin, wrote an article with a provocative title: «Why have there been no great women artists?». And her answer wasn't to go hunting for forgotten geniuses, but to dismantle the question: when for centuries you're barred from the training, the studio, the commission, the journey, the signature and the money, the astonishing thing isn't that there are few; the astonishing thing is that there are any.",
            ],
            dato: "Fun fact: in 1985 a group of anonymous women artists started counting pictures in the great museums and published posters with the result: in the modern art section of the Metropolitan in New York, fewer than 5% of the works were by women… and 85% of the nudes were of women. Their question became famous: «Do women have to be naked to get into the museum?».",
          },
        ],
      },
      "musica-clasica": {
        titulo: "Bach, Mozart, Beethoven",
        fecha: "17th–19th centuries",
        cuerpo: [
          "For centuries, music almost always served some purpose: the mass, the dance, accompanying a text, brightening a dinner at court. Between the 17th and 19th centuries it became an art you listen to for its own sake, in silence and sitting down, and one credited with the power to express what words can't reach.",
          "BACH (1685–1750) was the great architect. He worked all his life as an employee: organist and choirmaster, obliged to deliver a new work every week for the church service, with twenty children to feed. His music is of astonishing mathematical complexity — several melodies sounding at once, chasing each other, turning upside down and fitting together without a single error — and at the same time it's capable of leaving you undone. In his day he was considered an old-fashioned craftsman; his work was almost completely forgotten for eighty years, until Mendelssohn rescued it in the 19th century.",
          "MOZART (1756–1791) was the prodigy and the fluency. He played and composed from the age of five, his father paraded him round the courts of Europe as an attraction, and by thirty he'd written hundreds of works in every genre. He wrote with an ease that still seems impossible and with a joy that misleads: his most luminous works usually have a sadness underneath. And he was one of the first to try to live by his music as a free professional, without depending on a nobleman. He died at thirty-five, with a commission half finished, and was buried in a common grave.",
          "BEETHOVEN (1770–1827) is the one who changed what music means. With him, a work stops being a service and becomes a personal declaration: his symphonies tell of a struggle, with defeat and victory. He wrote the «Eroica» thinking of the ideals of the French Revolution and furiously scratched out the dedication to Napoleon when Napoleon crowned himself emperor. And he did all of it GOING DEAF: he started losing his hearing in his twenties and composed his greatest works without being able to hear them, imagining them. At the premiere of his Ninth Symphony they had to turn him round to face the audience so he could see they were on their feet applauding.",
          "And OPERA was born, the greatest total-art operation there has ever been: music, singing, theatre, poetry, stage design, costume and dance all at once. From Monteverdi to Verdi, Wagner or Puccini, for three hundred years it was Europe's mass entertainment, with its stars, its scandals and its booing.",
          "What was gained from all of it is hard to overstate: humanity discovered that you can build with sound something as complex and as precise as a cathedral, and that it says things no language says.",
        ],
        dato: "Fun fact: on the golden record carried by the Voyager probes, with which humanity introduces itself to whoever might find it in millions of years, there are sounds of the Earth and twenty-seven pieces of music from all over the world. Bach appears three times, more than anyone else. An 18th-century church musician is now our interstellar calling card.",
      },
      fotografia: {
        titulo: "Photography changes art forever",
        fecha: "1826–1900",
        cuerpo: [
          "In 1826, a Frenchman called Niépce managed for the first time to fix an image taken from life: a view from his window that needed several hours of exposure. In 1839 the daguerreotype was presented, with astonishing detail, and within a few decades photography became fast, cheap and accessible: in 1888 the first Kodak was selling cameras to the public with the slogan «you press the button, we do the rest».",
          "And there painting lost one of its two jobs. For four centuries, much of a painter's work had consisted of fixing reality: portraying the family, documenting a battle, recording a landscape or a building. A machine started doing it better, faster and for far less money. A provincial portrait painter was literally left without clients in twenty years.",
          "The reaction was of two kinds, and both are fertile.",
          "FIRST: if copying is no longer the job, let's do what the machine CAN'T do. And that's where the whole of modern art starts. The Impressionists go out to paint outdoors, in changing light, after the impression of an instant rather than the detail; and the detail, precisely, they leave to the camera. Then Cézanne focuses on structure, Van Gogh on the emotion of colour, Munch on anguish, Matisse on pure colour, Cubism on showing several viewpoints at once, abstract expressionism on the gesture. No lens can do any of that.",
          "SECOND: photography itself becomes art. It stops being a document and starts choosing the framing, the light, the moment, the contrast, the crop. And because it reaches where the painter can't, it transforms journalism, science, family memory and politics: the first photographs of a war — the Crimean and the American Civil War — changed forever what the public knew about a battlefield.",
          "And there was a lovely scientific side effect: in 1878, to settle a bet about whether a galloping horse lifts all four hooves off the ground at once, Muybridge set up twelve cameras in a row and photographed the sequence. It does lift them. And when you run those photos one after another, quickly, the thing moved. Out of photography, cinema was born.",
        ],
        dato: "Fun fact: on seeing the first daguerreotypes, the painter Paul Delaroche is said to have exclaimed: «from today, painting is dead». He was completely wrong, and in a sense he was right: the painting he did died, and another was born in its place.",
      },
      impresionismo: {
        titulo: "Impressionism",
        fecha: "≈1870 – 1900",
        cuerpo: [
          "At the end of the 19th century, a group of painters in France got tired of the rules of traditional painting. They went out into the open air to paint light, colour and fleeting instants.",
          "Artists like Claude Monet used loose, vibrant brushstrokes to catch the impression of a moment: sunlight reflected on water, mist, a garden in spring.",
          "Close up, their paintings looked like smears of colour; from a distance, they came to life. They were painting not so much things as the sensation of seeing them.",
          "Impressionism was a small revolution: it opened the door for art to stop imitating reality and start exploring completely new ways of seeing the world.",
        ],
        dato: "Fun fact: the movement took its name from a Monet painting titled «Impression, Sunrise». At first it was a critics' jibe, but the artists adopted it with pride.",
      },
    },
  },

  // ── El arte se rompe: las vanguardias ──────────────────────────────────
  vanguardias: {
    titulo: "Art breaks apart: the avant-gardes",
    anio: "First half of the 20th century",
    momentos: {
      "picasso-cubismo": {
        titulo: "Picasso and Cubism",
        fecha: "1881 – 1973",
        cuerpo: [
          "The Spaniard Pablo Picasso was one of the most influential artists in history. Along with others, he invented Cubism, a completely new way of painting.",
          "Instead of representing things from a single viewpoint, he broke them down into geometric shapes and showed them from several angles at once, as though he were smashing reality and putting it back together.",
          "Picasso never stopped reinventing himself throughout his life, moving through many different styles. He also painted works of powerful protest, like Guernica, against the horror of war.",
          "With him and the avant-gardes, art was completely freed: it no longer had to look like reality to be valid.",
        ],
        dato: "Fun fact: Picasso was so prolific that he created tens of thousands of works over his lifetime, between paintings, drawings, sculptures and ceramics.",
        extras: [
          {
            titulo: "Where Cubism came from",
            cuerpo: [
              "Cubism didn't appear out of nowhere and it wasn't a whim to shock people. It was the sum of four things happening at the same time, and knowing them stops a Cubist painting looking like a caprice.",
              "1. PHOTOGRAPHY was already copying reality better than any hand. If painting didn't have to compete there, it was free to do something else: think about the act of looking.",
              "2. CÉZANNE. He was the acknowledged master of all of them. He spent his last years painting the same mountain over and over, discovering that a landscape can be built out of basic volumes — cylinders, spheres, cones — and planes of colour that organize themselves. Picasso said he was «the father of us all».",
              "3. AFRICAN MASKS AND IBERIAN ART. In 1907, Picasso visited the ethnographic museum in Paris and was struck dumb by the masks from Africa and Oceania. What he saw there was the exact opposite of the European tradition: they don't imitate a face, they SOLVE it. They simplify, exaggerate, geometrize, going for force rather than likeness. Alongside that were the pre-Roman Iberian sculptures that had just gone on show at the Louvre. Out of that mixture came «Les Demoiselles d'Avignon», the painting usually taken to date the start of modern art, with two faces literally turned into masks.",
              "And here's something rightly argued about today: those objects reached European museums by the colonial route, were shown as ethnographic curiosities rather than as art, and their makers — artists with names, trades and traditions — remain anonymous to us. Europe took an aesthetic revolution from cultures it granted no artistic merit whatsoever.",
              "4. THE TIMES. In those same years, Einstein was publishing relativity, moving photography was becoming cinema, human beings flew for the first time and Freud was arguing that we aren't masters of our own heads. Everyone was discovering at once that reality depends on the point of view. Cubism is that idea painted.",
              "AND NOW, WHAT A CUBIST PAINTING DOES. It takes an object and shows it from several angles AT THE SAME TIME: front and profile, front and back, inside and outside. It gives up the illusion of depth — back to a flat picture, like medieval art — because its subject is no longer «how something looks», but «how we know it», which is by adding up views and moments. When you spot a nose in profile inside a face seen from the front, it isn't that the painter can't draw: he's showing you two instants in the same place.",
              "It was developed simultaneously by Picasso and Braque, working so closely and in such dialogue that there are works from those years the experts themselves took a while to tell apart. Then came collage — sticking a piece of newspaper or oilcloth onto the picture, which is to say putting the real world inside the work — and sculpture made from found objects. Without all of that there'd be no abstract art, no graphic design, and none of a good deal of 20th-century advertising and aesthetics.",
            ],
            dato: "Fun fact: even his friends thought «Les Demoiselles d'Avignon» was an outrage. Matisse was angry, a critic said Picasso had gone mad, and Braque himself remarked it was as if someone were making us drink petrol to spit fire. Picasso kept it rolled up in his studio for nine years without exhibiting it.",
          },
        ],
      },
      "surrealismo-dali": {
        titulo: "Surrealism",
        fecha: "≈1920 – 1940",
        cuerpo: [
          "The Surrealists wanted to bring onto the canvas the world of dreams, of the unconscious and of the freest imagination, inspired by the new ideas about the mind.",
          "The Spaniard Salvador Dalí painted impossible images with astonishing realism: melting clocks, dreamlike landscapes, scenes that defy all logic.",
          "They set out to surprise, to unsettle and to free the mind from reason, showing that art could inhabit worlds that don't exist.",
          "Surrealism proved art didn't have to represent the real: it could invent new realities straight out of the imagination.",
        ],
        dato: "Fun fact: Dalí cultivated an image as extravagant as his art, with his unmistakable moustache and his provocative outbursts. He turned his own life into a surrealist work.",
      },
      "literatura-moderna": {
        titulo: "Literature transforms itself",
        fecha: "20th century",
        cuerpo: [
          "The literature of the 20th century broke its moulds too. Writers looked for new ways of telling, beyond the orderly story from beginning to end.",
          "Authors like Franz Kafka created anguished, absurd worlds that reflected the bewilderment of modern human beings; others, like James Joyce, tried to reproduce the very flow of thought.",
          "Poetry freed itself from the classical rules and looked for new images and rhythms to express a world changing at top speed.",
          "It was a literature that reflected a convulsive century, full of wars and transformations, and that dared to explore the deepest, strangest zones of the human mind.",
        ],
        dato: "Fun fact: from Kafka came the adjective «Kafkaesque», which we use to describe absurd, oppressive situations with no way out, like the ones in his stories.",
      },
      "bauhaus-diseno": {
        titulo: "Form and function",
        fecha: "1919–1933",
        cuerpo: [
          "Until the 20th century there was a very clear border: on one side, ART — pictures and sculptures to contemplate; on the other, OBJECTS — furniture, crockery, posters, houses — which were the business of craftsmen and factories. The great idea of this period was to erase that border.",
          "In 1919, in Germany, a school called the Bauhaus was founded with a revolutionary programme: gather painters, architects, sculptors, typographers, potters, carpenters and weavers in the same place, and design beautiful objects that could also be mass-produced and be cheap. Beauty shouldn't be a luxury for the rich.",
          "Its principle was that form comes out of function: strip away every ornament that serves no purpose and let the material and the use decide the appearance. Out of that comes the whole aesthetic that looks «normal» to us today: furniture with clean lines, steel tubing, buildings without mouldings, sans-serif type, exposed glass and concrete, appliances with no decoration.",
          "And out of it comes DESIGN as a profession too. Somebody whose job is to think about what a coffee pot, a poster, a fork, a typeface, a packet of biscuits or an app's screen should be like. Today you live surrounded by decisions made by those people: the switch you find in the dark, the airport sign you understand without knowing the language, the icon you know to tap without anyone explaining it.",
          "AND IT'S WORTH PUTTING THE OPPOSITE PATH ALONGSIDE, because it's from these same years and just as valid. In Barcelona, Antoni Gaudí did exactly the reverse: instead of the straight line and bareness, he went looking for his forms in nature — columns like tree trunks, ceilings like canopies, scales, bones, shells — and calculated them with extremely complicated geometry, hanging models from strings and weights to find the exact curve that holds up an arch. His buildings are on the world heritage list today and the Sagrada Família is still under construction more than a century later.",
          "Both of them, the Bauhaus and Gaudí, answer the same question of an age: what should the built world people live in be like? One answers «clean, useful and for everyone»; the other, «alive, organic and unique». The city you live in is, almost always, a mixture of the two answers.",
        ],
        dato: "Fun fact: the Bauhaus had a great many women students, more than usually gets told, and most of them were steered toward the weaving workshop, considered less important. One of them, Anni Albers, turned textiles into a major art and became the first textile designer to have a solo show at the Museum of Modern Art in New York.",
      },
    },
  },

  // ── El arte hoy y el futuro ────────────────────────────────────────────
  "arte-hoy": {
    titulo: "Art today and the future",
    anio: "20th – 21st centuries",
    momentos: {
      "arte-contemporaneo": {
        titulo: "Contemporary art",
        fecha: "20th – 21st centuries",
        cuerpo: [
          "In contemporary art, almost anything is possible. Some artists abandoned figures completely and painted only shapes and colours: that's abstract art.",
          "Others made art an idea or an experience: installations, everyday objects turned into works, live actions. What mattered was no longer the technique but the message or the question.",
          "Art became very free, but also harder to understand, and it sometimes provokes debate: is this art or isn't it?",
          "Maybe that argument is part of the point: contemporary art forces us to ask ourselves, once again, what art really is.",
        ],
        extras: [
          {
            titulo: "How to look at a work you don't understand",
            cuerpo: [
              "This is the most useful thing you can take away from this whole story, and it works in a museum, at an exhibition or in front of a painting you come across somewhere. The feeling of «I don't get this» doesn't mean you're ignorant: almost always it means you're missing a piece of context, and there's a way of going after it.",
              "1. LOOK BEFORE YOU JUDGE, and genuinely give it time. It's been measured that people spend an average of less than thirty seconds in front of a painting in a museum. Try three minutes with a single work and you'll find things appear that weren't there at the start.",
              "2. START WITH WHAT'S THERE, without interpreting: what shapes, what colours, what size, what it's made of, what caught your eye first and where your gaze goes next. Describing is the best way to start seeing.",
              "3. ASK ABOUT THE CONTEXT, which is the piece almost always missing: when is it from? What was happening in the world? What was it reacting against? An all-black painting can be a silly gesture or it can be the end of a hundred-year road; a urinal in a museum is absurd… until you know that in 1917 it was put there to ask who decides what gets into a museum. Almost all contemporary art is an answer to a question, and without the question it looks like a bad joke.",
              "4. ASK YOURSELF WHAT YOU FEEL, even if it's rejection. Boredom, discomfort or anger are information about the work and about you. Many works are made for exactly that.",
              "5. AND REMEMBER THE STORY of this very journey, because it's very relaxing: Impressionism was shown in a salon of rejects and the press mocked it; Van Gogh sold almost nothing in his lifetime; Les Demoiselles d'Avignon horrified his friends; the Sagrada Família was called «a madman's cathedral»; the premiere of Stravinsky's «The Rite of Spring» ended in shouting and fistfights in the hall. Almost everything that looks obviously beautiful to us today started out looking like an insult to somebody.",
              "6. YOU'RE ENTITLED NOT TO LIKE IT. Understanding doesn't oblige you to admire, and there are bad, opportunistic, empty works, in museums too. The difference between «I don't like it» and «this is a con» is having looked first.",
              "AND ONE LAST IDEA, the one holding this whole story up: there's no single definition of art that works for the caves of Altamira, a Gothic cathedral, an African mask, «Las Meninas» and a video projected on a wall. What joins them isn't beauty or technique, it's intention: somebody wanted to say something that wouldn't fit in a sentence, and to say it they made an object. Your job, as a viewer, is only to give it a chance to say it to you.",
            ],
            dato: "Fun fact: in 1961 an Italian artist, Piero Manzoni, canned his own excrement, put ninety tins on sale at the price of their weight in gold and titled them «Artist's Shit». It was a ferocious mockery of the art market and of the signature as a guarantee of value. Today those tins sell for hundreds of thousands of euros: the market ate the joke and proved him right.",
          },
        ],
      },
      "cine-nuevas-artes": {
        titulo: "Cinema and the new arts",
        fecha: "Since the 20th century",
        cuerpo: [
          "The 20th century brought completely new arts. Photography captured reality in an instant; cinema joined image, movement, music and story into a total spectacle.",
          "Cinema became the great popular art of our age, able to move millions of people at once and to tell stories as never before.",
          "Comics, animation and, later, video games joined in as new ways of narrating and creating.",
          "All these arts show that the need to tell stories hasn't disappeared: it has only found new ways of expressing itself.",
        ],
        dato: "Fun fact: when the first films were projected, more than a hundred years ago, some viewers were frightened at the sight of a train coming toward them on the screen.",
      },
      "arte-digital": {
        titulo: "Digital art and the future",
        fecha: "21st century",
        cuerpo: [
          "Computers have opened a new world for creation. Today there's digital art, electronic music, animations and designs that would be impossible with traditional techniques.",
          "The internet has let anyone share their creations with the whole world, with no need for galleries or publishers.",
          "And artificial intelligence programs have appeared that can generate images, texts and music, which raises fascinating questions: can a machine be creative? What does being an artist mean then?",
          "The future of art is still to be written, and it will probably be written with tools we're only just beginning to imagine.",
        ],
        extras: [
          {
            titulo: "Every time a new machine appeared, the same thing happened",
            cuerpo: [
              "The question of whether a machine can make art looks new and isn't: it has come round five or six times in this story, and always with the same script.",
              "WITH PRINTING it was said that printed books wouldn't have the soul of a manuscript, and that mass-producing them would degrade learning. There were book collectors who refused to have printed books in their libraries.",
              "WITH PHOTOGRAPHY it was proclaimed that painting had died and that this was a mechanical procedure with no art possible in it. It took decades to be admitted into museums, and today it's one of the great arts of the 20th century.",
              "WITH CINEMA it was said to be a fairground attraction for simple people, incapable of telling what a novel or a play tells.",
              "WITH THE RECORD it was feared that recorded music would kill the live musician, and with radio, that nobody would buy records.",
              "WITH SYNTHESIZERS and drum machines it was said that wasn't music because nobody was playing it. Whole genres came out of them.",
              "WITH THE COMPUTER the same was said of design, animation and digital photography.",
              "AND THE PATTERN always repeats: the new tool is first despised, then used to imitate the old one — the first photos looked like paintings, the first films looked like filmed theatre, the first video games looked like cartoons — and only when somebody discovers what THAT tool can do and no other can, a new art is born.",
              "NOW WITH AI there's a real difference worth not minimizing: the earlier machines were instruments that extended a person's hand, and these generate the result from a description, trained on millions of works made by artists who gave no permission and received nothing. That raises a problem of authorship and of fairness that cameras and synthesizers didn't raise, and that's in the courts right now.",
              "And there are genuinely open questions: whether the merit lies in the idea or in the execution; what happens to people who live by illustrating, dubbing or composing background music; how generated work gets labelled so it doesn't deceive; and whether something made without intention or experience can come to move you the way the work of someone who has lived what they're telling moves you.",
              "The only thing history makes clear is that the answer won't come from the debates, but from the works. As happened with photography and with cinema: we'll know what this is when somebody makes something with it that can't be made any other way.",
            ],
            dato: "Fun fact: in 1917 a Czech play premiered that was the first to use the word «robot», and its subject was exactly this: beings created by human beings who end up raising the question of what makes us different. The word comes from «robota», which in Czech means «forced labour».",
          },
        ],
      },
      "musica-grabada": {
        titulo: "The century when music could be kept",
        fecha: "1877 – today",
        cuerpo: [
          "Throughout history, listening to music required someone to play it in front of you. If you wanted to hear a symphony, you had to go where the orchestra was; if you wanted music at home, someone in the house had to be able to play. Music was an event, not an object.",
          "In 1877, Edison recorded his own voice on a cylinder and managed to play it back. It's one of the most astonishing inventions in history and it's almost never told as such: for the first time, a sound could outlive the moment it was made.",
          "And that changed everything, in a chain. You could listen to the world's best musicians at home. Global stars appeared, along with the commercial three-minute format — because that's what fitted on a record — and an enormous industry. And something almost never pointed out: music no longer had to be simple in order to be remembered, because it no longer depended on anyone's memory.",
          "IT SAVED WHOLE MUSICS. Thanks to recordings we have the rural blues of the Mississippi Delta, the flamenco of the early 20th century, fado, tango, the songs of indigenous peoples and thousands of oral traditions that were about to die with their last performers. There were people travelling the roads with extremely heavy equipment to record singers who had never left their village.",
          "AND IT CREATED NEW MUSICS that wouldn't have existed without the machine. Jazz is born from the mixture in New Orleans of African, European and Caribbean traditions, and spreads across the world thanks to the record and the radio. And out of the conversation between Black blues and the white music of the South come rock, soul, funk, reggae, hip hop and almost everything that sounds today.",
          "AND TODAY, with streaming, anyone with a connection has instant access to almost all the recorded music in history. It's a privilege no queen of any era ever had, and like every everyday privilege, it has stopped seeming astonishing to us. It has brought its problem too: musicians are paid minuscule amounts per play and, for the first time in a century, hardly anyone lives from selling their music.",
        ],
        dato: "Fun fact: the person who put the orchestra in the place where you hear it is probably a sound engineer whose name you don't know. And the CD format was set, according to the most-told version, at about seventy-four minutes because Beethoven's Ninth Symphony had to fit on it whole.",
      },
      "realismo-magico": {
        titulo: "Borges, García Márquez and the Boom",
        fecha: "1940–1980",
        cuerpo: [
          "In the middle of the 20th century something happened that hadn't been seen before: literature written in Spanish stopped looking to Europe and Europe started looking at it. The centre moved to Latin America.",
          "The first was JORGE LUIS BORGES, an Argentine librarian and nearly blind, who wrote extremely short stories of mathematical precision. His subjects are dizzying: infinite libraries containing every possible book, a map so detailed that it coincides with the territory, a man who can't forget anything, gardens of forking paths branching into every possible future. He never wrote a novel and even so he reorganized 20th-century literature; today he's cited in physics, in mathematics and in computing, because he described the internet, hypertext and parallel universes before they existed.",
          "Then came MAGICAL REALISM, and its idea is deeper than it looks: it isn't about putting fantasy into a realistic story, but about telling the extraordinary with the same naturalness you'd tell the everyday, because that's how life is lived in many places. When in «One Hundred Years of Solitude» a character rises into the sky while hanging out sheets, nobody in the village is surprised, and that's exactly the effect intended.",
          "GABRIEL GARCÍA MÁRQUEZ wrote that novel in eighteen months, selling the car and the household appliances to keep going, and said he began to know how to do it the day he understood he had to tell it with the straight face his grandmother used for telling impossible things. It's been translated into more than forty languages and has sold tens of millions of copies.",
          "And with them came the so-called BOOM: Cortázar, who wrote a novel that can be read in two different orders; Rulfo, who with a seventy-page book built a village of talking dead; Vargas Llosa, Carlos Fuentes, Onetti, Donoso; and, a little earlier or alongside, Neruda, Vallejo, Alejo Carpentier and Gabriela Mistral, the first Latin American to receive the Nobel Prize in Literature.",
          "And the women left outside the Boom's spotlight deserve naming, because they're read as much or more today: Elena Garro, Silvina Ocampo, Clarice Lispector, Rosario Castellanos, María Luisa Bombal. And the ones who came after: Isabel Allende, and today Mariana Enríquez, Samanta Schweblin or Fernanda Melchor.",
          "What matters about this chapter, to close the story, is what it proves: the centre of art isn't fixed anywhere. It was in Mesopotamia, in Athens, in Tang China, in Baghdad, in Florence, in Madrid, in Paris, in New York, and in the 20th century it spent a long season in Buenos Aires, in Mexico City and in a village on the Colombian Caribbean called Aracataca.",
        ],
        dato: "Fun fact: García Márquez finished «One Hundred Years of Solitude» without the money to post the whole manuscript to Buenos Aires. He sent half, and then his wife pawned what was left in the house so they could send the other half. And by mistake, the half he sent first was the SECOND one.",
      },
      "por-que-crea": {
        titulo: "Why we go on creating",
        cuerpo: [
          "After tens of thousands of years of creating, we've discovered something surprising.",
          "We've gone from painting bison in a cave to generating images with computers; from reciting myths beside the fire to telling stories on screens all over the world.",
          "The techniques, the styles and the materials have changed, but the deep impulse is always the same: to express what we feel, understand the world and leave a mark.",
          "Art and literature are the mirror every era has looked at itself in. Thanks to them we can feel what people who lived thousands of years ago felt.",
          "That's perhaps the greatest lesson of this journey: creating isn't a luxury, it's one of the deepest ways of being human.",
          "And that story hasn't ended. It carries on in every person who dares to sing, write, paint or imagine something new. In you too.",
        ],
      },
    },
  },
};
