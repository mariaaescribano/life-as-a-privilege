// ─────────────────────────────────────────────────────────────────────────
// HISTORIA DE LAS RELIGIONES, EN INGLÉS · solo el texto.
//
// Emparejado por la `key` de la era y la `key` del momento con
// `culturaHistoriaReligiones.ts`. El orden, las claves y las fotos salen SIEMPRE
// del español; lo que falte aquí se lee en español (ver `culturaHistorias.en.ts`).
// ─────────────────────────────────────────────────────────────────────────
import type { HistoriaTexto } from "./culturaHistorias.en";

export const HISTORIA_RELIGIONES_EN: HistoriaTexto = {
  // ── Cuando la naturaleza era sagrada ───────────────────────────────────
  "naturaleza-sagrada": {
    titulo: "When nature was sacred",
    anio: "Prehistory",
    momentos: {
      neolitica: {
        titulo: "The Neolithic Revolution",
        fecha: "≈10,000 BC",
        cuerpo: [
          "Everything changed when some groups discovered they could sow the plants they used to gather and raise the animals they used to hunt. Once they stopped moving, along came villages, granaries, land ownership and inheritance.",
          "And here's the religious key: if a farmer produces more food than his family needs, other people can devote themselves to something else. That's how the first specialized trades are born, among them a decisive one: the people in charge of worship. For the first time in history there were people working full time at dealing with the sacred.",
          "The change also transformed the questions. The hunter depended on the luck of the day; the farmer depends on the cycle: on the rain coming at the right moment, on the seed germinating, on the harvest not being lost. Their religion turned into calendar, offering and repeated ritual, obsessed with the fertility of the earth, with the sun, with the rain and with the seasons.",
          "And it added a brand-new idea: burying the dead in the very soil the food springs from, watching the seed be buried and reborn, and starting to think of death as a cycle and not as an end. Almost every later agrarian religion has some god who dies and rises again.",
        ],
        dato: "Fun fact: this change was so important that many historians consider it the greatest revolution in human history, even above the Industrial Revolution.",
        extras: [
          {
            titulo: "The first temples come BEFORE farming",
            cuerpo: [
              "For decades the logical order was taken for granted: first farming, then villages, then the surplus, then temples. In 1994, the excavation of Göbekli Tepe, in southeastern Turkey, turned that sequence around.",
              "There, around 9500 BC — more than six thousand years before Stonehenge and the pyramids — someone raised circular enclosures with T-shaped stone pillars up to five meters tall and weighing several tons, carved with reliefs of foxes, boars, snakes, scorpions, vultures and human arms.",
              "The astonishing part is who did it: hunter-gatherers. There was no farming, no pottery, no metal, no domestic animals and no city around it. It's reckoned that hundreds of coordinated people were needed, fed for weeks, and the site turns up the remains of enormous quantities of game and of beer made from wild grain: feasts.",
              "That lets you invert the hypothesis, and it's one of the most provocative ideas in archaeology today: maybe we didn't settle down and then build sanctuaries, but rather the need to gather periodically at a sacred place and to feed that crowd was one of the pushes that led to domesticating wheat. Which is to say: perhaps we gathered first to believe and only afterward learned to farm.",
              "At Çatalhöyük, also in Turkey, a few millennia later, religion was already inside the houses: bull skulls set into the walls, paintings of vultures and hunts, figures of a woman seated between two big cats and, under the floors of the homes, the family's dead — the skull sometimes retrieved, coated in plaster and painted, so as to keep it present.",
            ],
            dato: "Fun fact: in those houses people literally lived with their ancestors: they slept on top of them. The idea that the dead go on being part of the household, so often repeated afterward in China, Africa, Rome or Mexico, is older than writing.",
          },
          {
            titulo: "Stones that face the sun",
            cuerpo: [
              "Between 5000 and 2000 BC, all across Atlantic Europe, thousands of dolmens, standing stones and great collective stone tombs appear. They're the continent's first monumental architecture and they're religious.",
              "Many are aligned with a precision that can't be coincidence. At Newgrange, in Ireland (around 3200 BC), a nineteen-meter passage leads to an inner chamber that stays dark all year… except for a few minutes at dawn on the winter solstice, when a beam of sunlight comes in through an opening and lights the whole of it.",
              "That means two things. First: those communities watched the sky rigorously across generations, took aim and passed the knowledge on; astronomy and religion are born together and will take millennia to separate. And second: they were capable of organizing enormous collective work with no kings, no writing and no cities — purely by agreement and shared belief.",
              "The shortest day of the year, when the sun seems to die and then starts climbing again, has been the sacred moment par excellence across almost the whole northern hemisphere. Many December festivals — the Roman Saturnalia, the birth of the Unconquered Sun, the Norse Yule and, later on, Christmas — were placed there for the same reason: it's the point where the light wins.",
            ],
            dato: "Fun fact: to see the solstice light inside Newgrange there's a public lottery today that tens of thousands of people enter every year, for a handful of places. Five thousand years later, we still want to be there on that day.",
          },
        ],
      },
      gea: {
        titulo: "Gaia and the «magical women»",
        fecha: "Prehistory",
        cuerpo: [
          "Among the oldest works of art humanity has, there are some two hundred female figurines carved in stone, bone or ivory, scattered from France to Siberia. We call them «Paleolithic Venuses», and some of them are more than 30,000 years old.",
          "Almost all of them share the same features: broad bodies, breasts and belly emphasized, and by contrast face, hands and feet barely suggested. They weren't meant to be portraits of anyone: they represented something.",
          "The most likely reason is the most elemental. In a world where half the children died before growing up and where childbirth killed a great many women, the capacity to give life was the greatest mystery and the greatest power imaginable. That a body could create another body, and feed it afterward, was literally the difference between a group carrying on and disappearing.",
          "Thousands of years later, the Greeks called Gaia the mother Earth everything is born from, the Romans Tellus, the Andeans Pachamama, the Hindus Bhūmi. There's no direct line between those figurines and these goddesses, but there is an intuition that reappears all over the planet: the earth that produces food is thought of as a mother.",
          "And it's worth saying what can NOT be claimed: there's no evidence that a universal religion of the Goddess existed, or widespread matriarchal societies, as has sometimes been popularized. We know they sculpted women's bodies with enormous care; what exactly they believed, we don't know.",
        ],
        dato: "Fun fact: the Venus of Willendorf, some 25,000 years old and eleven centimeters tall, still carries traces of red ochre: it was painted. And the oldest one known, from Hohle Fels (Germany), is between 35,000 and 40,000 years old: older than the paintings at Altamira.",
      },
      animismo: {
        titulo: "Animism",
        fecha: "From Prehistory on",
        cuerpo: [
          "The first communities didn't think only people had a soul. For them, the mountain, the river, the tree, the animal and the storm had will, intention and the capacity to answer. We call that way of seeing the world animism, from anima, «breath» or «soul».",
          "It wasn't naivety: it was a very effective way of ordering how you live alongside the surroundings your life depends on. If the river is someone, you can't poison it. If the forest is someone, you can't empty it. If the animal you hunt is someone, you have to ask its permission, thank it and not kill more than you need.",
          "That's where practices come from that repeat among peoples with no contact whatsoever: asking the hunted animal's forgiveness, putting the first fish back in the water, not felling certain trees, leaving part of the harvest ungathered, banning hunting at certain times of year — which is, precisely, a closed season.",
          "Aboriginal Australians, with the oldest living culture we know of, understand their territory as a network of sung paths: every feature of the landscape is part of a story that has to be remembered and recited. The map, the law, the genealogy and the religion are all one thing.",
          "And it has come back through an unexpected door: the legal one. In 2017, New Zealand recognized the Whanganui river as a legal person with rights of its own, at the request of the Māori people, and since then rights have been declared for rivers, lakes and forests in Ecuador, Colombia, India, Bangladesh and Spain (the Mar Menor). The oldest idea in the world — that nature is someone and not something — is finding its way into the legal codes of the 21st century.",
        ],
        dato: "Fun fact: the word «animism» was put into circulation by a British anthropologist in 1871 to describe what he considered the most primitive form of religion. The term is still used today, but that hierarchy has been abandoned: it isn't «phase one» religion, it's another way of understanding what counts as a person.",
      },
      chamanes: {
        titulo: "Shamans",
        fecha: "Prehistory",
        cuerpo: [
          "As soon as a community believes there are invisible forces deciding the hunt, the rain and illness, a practical need appears: someone has to negotiate with them. That specialist is the shaman, and it's probably the first religious job in history.",
          "The work was very concrete and very broad: healing the sick, finding the cause of a misfortune, locating game, asking for rain, accompanying the dead, settling disputes, remembering the myths and passing on the knowledge of plants and animals. They were doctor, psychologist, judge, historian and priest all at once.",
          "The method was to enter a trance, and for that they used techniques that turn up surprisingly similar on different continents: the drum with a monotonous rhythm, prolonged dancing, fasting, cold, isolation, smoke and, in some cultures, psychoactive plants.",
          "The logic of the journey repeats too: the shaman leaves the body, goes up or down into another world, meets spirits, negotiates with them, recovers something that had been lost — often the sick person's «soul» — and comes back to tell it. That structure of going and returning is at the base of thousands of later stories, including the descents into the underworld of classical mythology.",
          "And there's one striking feature: hardly anyone ever chose the post. In a great many cultures the shaman is someone marked by a prior crisis — a serious illness, a seizure, an accident, visions, a lightning strike — someone who has been close to dying and has come back. The authority came precisely from having crossed over and returned.",
          "Their effectiveness wasn't only symbolic. They handled real knowledge of medicinal plants and of bones, and the ritual itself had an effect: today we know that expectation, being accompanied and having a sense of meaning measurably reduce pain and anxiety. Those rituals were working with the placebo effect three thousand generations before anyone gave it a name.",
        ],
        dato: "Fun fact: the word comes from šaman, from the Evenki language of Siberia, and means roughly «the one who knows». And it wasn't a men's job: at Bad Dürrenberg (Germany) the grave of a woman from some 9,000 years ago was excavated, buried with extraordinary ritual goods, and in Israel another from 12,000 years ago, surrounded by tortoise shells, an eagle's wing and a cow's tail.",
      },
    },
  },

  // ── Cuando nacieron las civilizaciones… y sus dioses ───────────────────
  "civilizaciones-dioses": {
    titulo: "When the civilizations were born… and their gods",
    anio: "≈4000–1000 BC",
    momentos: {
      ur: {
        titulo: "Ur and the first cities",
        fecha: "≈3800–3000 BC",
        cuerpo: [
          "In a village of fifty people everyone knows everyone, and that's enough to stop anyone stealing: the social control is the neighbor. In a city of fifty thousand, it isn't. You need laws, judges, punishments… and a shared belief that convinces thousands of strangers they're part of the same thing.",
          "That's where the temple appears. In Ur, in Uruk, in Eridu, the biggest, most expensive and most visible building in the city wasn't the palace: it was the ziggurat, an artificial mountain of brick raised on a plain with no mountains, so the god would have somewhere to come down to.",
          "And it wasn't only a place of worship: it was the central economic institution. The temple owned enormous stretches of land and herds, employed thousands of people, stored the grain, lent out seed, set weights and measures and kept the accounts. In fact, writing was invented there, to record the deliveries to the temple.",
          "The god of each city was also an identity. Losing a war meant your god had lost, and the victor could carry off the statue of the defeated god as the greatest of all spoils: it was abducting the city's soul.",
        ],
        dato: "Fun fact: according to biblical tradition, Abraham was born in Ur before setting out on the journey that would give rise to the people of Israel. Which is to say: tradition has the first monotheism come out of precisely the world capital of urban polytheism.",
      },
      mesopotamia: {
        titulo: "Mesopotamian religion",
        fecha: "≈3500–500 BC",
        cuerpo: [
          "The Mesopotamians had a perfectly clear answer, and it isn't a flattering one: they created us to work in their place. Their creation story says the gods were worn out from digging canals and farming, so they shaped the human being out of clay to do the work and bring them food in the form of offerings.",
          "That idea explains their whole religion. Worship wasn't a relationship of love, it was a maintenance contract: the priests washed, dressed, perfumed and fed the god's statue every day, literally, with two meals; and the god, in exchange, protected the city, sent rain and won the wars.",
          "Their pantheon was enormous and ordered like a royal court: Anu, the sky; Enlil, the wind and the decisions; Enki, fresh water and cunning; Inanna or Ishtar, love and war at once; Marduk, the god of Babylon, who in the poem Enuma Elish defeats the goddess of primordial chaos and builds the world out of her body.",
          "They also invented something that's still with us: the obsession with reading the future. Since the gods decided and didn't always give warning, they developed a science of interpreting signs — the liver of sacrificed sheep, the flight of birds, dreams, eclipses — and, above all, the movement of the stars. Astrology was born in Mesopotamia, and the signs of the zodiac in today's magazines are Babylonian.",
          "Their idea of the afterlife, on the other hand, was bleak: a place underground, dark and dusty, the same for the king and for the farmer, with no reward and no punishment. That's why their literature is so modern in one respect: the Epic of Gilgamesh tells the story of a man who, when his friend dies, throws himself into the search for immortality, doesn't find it, and has to learn to live knowing he's going to die.",
        ],
        dato: "Fun fact: the Epic of Gilgamesh contains a flood story astonishingly like the Bible's: a man warned by a god, an enormous boat, the animals, water covering everything and a bird sent out to look for land. When a young researcher at the British Museum deciphered that tablet in 1872, he was so struck by it that, according to his colleagues, he started running around the room.",
        extras: [
          {
            titulo: "Everything still alive from that religion",
            cuerpo: [
              "Mesopotamia disappeared, but many of its pieces stayed in circulation, and some of them are in your everyday life:",
              "THE ZODIAC. The division of the sky into twelve constellations along the sun's path is Babylonian, as are the names of most of the signs. We also inherited their habit of counting in base 60: the 60 minutes, the 60 seconds, the 360 degrees of a circle.",
              "THE WEEK AND THE DAY OF REST. The custom of marking certain days as dangerous or unfit for work, tied to the phases of the moon, appears in Mesopotamia and lies at the remote origin of the week and of the periodic day of rest.",
              "THE FLOOD. The biblical version with Noah takes up a story already written down a thousand years earlier in the region, in several versions. And it isn't plagiarism in the modern sense: the peoples of one region shared and rewrote each other's stories, the way films get remade today.",
              "PARADISE AND THE TOWER. Eden with its four rivers points to the landscape between the Tigris and the Euphrates, and the Tower of Babel is, almost certainly, the memory of a Babylonian ziggurat — probably the great temple of Marduk. Even the name fits: Babel is Babylon.",
              "AND SOMETHING MORE IMPORTANT THAN ALL OF THAT: the idea that the law comes from the divine and therefore binds the king too. When Hammurabi had himself carved receiving the laws from the sun god, he was inventing an argument that Moses, the prophets, the popes and modern constitutions would all use afterward: that there's a justice above whoever is in charge.",
            ],
            dato: "Fun fact: the Mesopotamians wrote letters to their personal gods to complain when things went badly, in a tone anyone would recognize today: «I've made you offerings, I've been faithful to you, why have you abandoned me?». It's the same lament that will later appear in the Psalms and in the book of Job.",
          },
        ],
      },
      egipto: {
        titulo: "Egyptian religion",
        fecha: "≈3100–30 BC",
        cuerpo: [
          "While Mesopotamia worried about the power of its cities and expected nothing from the afterlife, Egypt built the religion most focused on death in all of antiquity. And it did so, curiously, out of love for life: they wanted it to go on.",
          "They believed a person was made of several parts: the body, the ka (the life force, which needs to go on being fed), the ba (something like the soul, which can move about) and the name, which had to go on being spoken. If all those pieces were preserved, you went on existing.",
          "And that's also where the most interesting part comes from: the judgment. The dead person appeared before Osiris and declared they had done no evil — I have not stolen, I have not lied, I have not killed, I have not made anyone cry, I have not diverted the water from my neighbor's canal. Their heart was weighed on a scale against the feather of Maat, truth and the rightful order of the world. Anubis watched the balance, Thoth recorded the result and, if the heart weighed more than the truth, a monster ate it: that was the only final death.",
          "This is an enormous novelty in the history of religions. For the first time, what decides your eternal fate isn't the sacrifices you've paid for or your social position, but how you've behaved toward other people. Religion connects with morality.",
          "The pharaoh was the piece that held it all together: Horus alive, son of the sun, charged not with being good but with keeping Maat in place so the universe wouldn't come apart. When he died he became Osiris and his son became Horus. That story held up a state for three millennia.",
        ],
        dato: "Fun fact: the Book of the Dead wasn't a sacred book like the Bible but a practical manual: a collection of formulas for getting past each test along the way, bought ready-made, with the scribe filling the dead person's name into the gaps. Even the afterlife had its forms.",
        extras: [
          {
            titulo: "How an Egyptian god was treated",
            cuerpo: [
              "An Egyptian temple wasn't a church: there was no congregation and there were no sermons. It was the god's HOUSE, and it ran like the house of a great lord.",
              "At the very back, in the darkest and smallest room, lived the god's statue. Every morning the priests broke the seal on the door, woke it with hymns, washed it, dressed it in clean linen, made it up, perfumed it and served it food and drink. At dusk the process was repeated in reverse and the door was sealed again.",
              "The people weren't allowed in. Their religion was lived outside: in the great processions, in which the statue came out in a barque carried on shoulders and went through the city several times a year. That was the moment to come close, to see the god from a distance… and to consult it.",
              "Because there was a system of oracles that has come down to us documented: people asked yes-or-no questions — «did the neighbors to the north steal my ox?» — and the movement of the barque as it passed was interpreted. Records survive of court cases settled that way. The god was, in practice, a court of appeal.",
              "And at home other things were worshipped: the ancestors, household gods who protected childbirth and sleep, amulets. The official religion belonged to the pharaoh and the clergy; the people's religion was far closer and far more practical.",
            ],
            dato: "Fun fact: the sacred animals weren't worshipped in themselves, but as manifestations of a god. Even so, the business went a long way: cemeteries have been found with hundreds of thousands of mummified cats, ibises, crocodiles and falcons, and there was a whole industry breeding animals to be sold as offerings.",
          },
        ],
      },
      akhenaton: {
        titulo: "Akhenaten and Nefertiti",
        fecha: "≈1350 BC",
        cuerpo: [
          "Egypt had spent one thousand seven hundred years with hundreds of gods and an extremely rich clergy, above all that of Amun at Thebes, which had piled up land, gold and enormous political influence. Then a pharaoh came to the throne who decided to erase all of it.",
          "Akhenaten proclaimed that only Aten existed, the solar disc, and that its light — not a statue, not an animal, not a myth — was the only manifestation of the divine. He closed the temples of the other gods, cut off their income, had the name of Amun chiseled off the monuments and even, in some inscriptions, removed the plural word «gods».",
          "His reform had one revolutionary feature: in his religion there were no myths, no images of the god in human or animal form, and no afterlife full of tests. Only the sun that gives life to everything that exists, and a single intermediary for speaking to it: the pharaoh himself. That last part is the political key: by removing gods, he was removing priests and concentrating all religious power in his own person.",
          "He changed the art too, and unmistakably: elongated bodies, rounded bellies, family scenes in which the pharaoh and the queen appear playing with their daughters or kissing — unthinkable in the earlier rigidity.",
          "It failed completely. His reform left thousands of people without work and without income, canceled the popular festivals that structured the year and replaced the people's familiar gods with an abstraction only the king could deal with. On his death, his successor — a child called Tutankhamun, who changed his own name to include Amun — restored the old cults, the new city was abandoned and the pharaohs who followed erased Akhenaten's name from the king lists, as if he had never existed.",
          "And even so, it's thanks to that forgetting that we have him: his dismantled monuments were reused as filling in other buildings, where they were preserved intact, and his abandoned city was never reoccupied, so it's the site that tells us best how life was lived in ancient Egypt.",
        ],
        dato: "Fun fact: the Great Hymn to Aten, which he had carved in the tombs at Amarna, describes a god who creates life among all peoples and feeds every creature, and its structure and its images resemble Psalm 104 of the Bible so closely that the two have been studied together for a century. Freud went as far as to speculate that Moses's monotheism came from here; most historians don't accept it, but the coincidence is still astonishing.",
      },
    },
  },

  // ── Los dioses cuentan historias ───────────────────────────────────────
  "dioses-historias": {
    titulo: "The gods tell stories",
    anio: "≈2000 BC–AD 500",
    momentos: {
      "mitologia-griega": {
        titulo: "Greek mythology",
        fecha: "≈1200–146 BC",
        cuerpo: [
          "The Greek gods are scandalously human: Zeus is unfaithful and a liar, Hera is vengeful, Ares enjoys blood, Aphrodite causes disasters out of jealousy. They aren't moral models, and that baffles anyone coming from the monotheistic religions.",
          "But they had a precise function: to explain the world as it is, not as it ought to be. If life is unfair, if the innocent suffer, if the good lose and the mediocre win, a single, perfectly good god becomes hard to explain. A handful of powerful, partial gods squabbling among themselves, on the other hand, describes the experience of being alive rather well.",
          "That's why their mythology is a gigantic collection of human cases. Prometheus steals fire to give it to humankind and is punished forever: it's the story of progress and of its price. Pandora opens the box and every evil comes out, with hope left inside. Icarus flies too close to the sun. Narcissus falls in love with his own reflection. Sisyphus pushes a stone that always rolls back down. None of that is a fairy tale: they're ways of naming ambition, guilt, desire, vanity, absurd labor.",
          "Their practical religion, moreover, was nothing like ours. There was no sacred book, no dogma, no creed to accept, no professional clergy and no obligation to believe anything in particular. What there was was public ritual: processions, festivals, games and sacrifices — which were in fact communal barbecues, with the inedible parts burned for the gods and the meat shared out among the people, many of whom only tasted it on those occasions.",
          "And their underlying idea is magnificently harsh: above the gods is fate, and not even Zeus can change it. In Greek tragedy the hero doesn't fall for being wicked, but through a miscalculation, through excess of pride or simply because it was his turn. That's the Greek contribution to the history of religious ideas: looking straight at the fact that there are no guarantees.",
        ],
        dato: "Fun fact: the Olympic Games were a religious ceremony in honor of Zeus. While they were on, a sacred truce was declared that let the athletes and the spectators travel through territories at war, and they ran for almost twelve centuries, until a Christian emperor banned them at the end of the 4th century.",
        extras: [
          {
            titulo: "The mysteries and the oracle: what they really did take seriously",
            cuerpo: [
              "Alongside the city's official religion there were two institutions that touched what people actually cared about: what happens when you die and what to do with your life.",
              "THE MYSTERIES OF ELEUSIS. Every year, thousands of people walked in procession from Athens to the sanctuary at Eleusis to be initiated into a secret rite centered on the myth of Demeter and her daughter Persephone, carried off by the god of the dead and returned to the earth for part of the year: the myth of the seed that goes down and springs up again.",
              "What happened inside is forbidden to tell, and here comes the astonishing part: nobody told. The secret held for almost two thousand years, with death for anyone who revealed it, and today we only know there was fasting, a ritual drink, darkness, something that was shown and an experience that changed whoever lived it. Writers like Pindar or Cicero, people not given to exaggeration, wrote that afterward they stopped fearing death.",
              "THE ORACLE AT DELPHI. It was the most influential consulting room of the ancient world. Whole cities asked before founding a colony, declaring a war or changing their laws, and private citizens asked about their marriage or their business. The answer came from the Pythia, a priestess who entered a trance seated over a crack in the ground.",
              "Her answers were famously ambiguous, and that was part of the system: King Croesus was told that if he crossed the river he would destroy a great empire, and he destroyed his own. The Athenians, facing the Persian invasion, were promised salvation by «a wall of wood», and Themistocles convinced the assembly that it meant the ships. The oracle didn't foretell: it forced you to interpret, and the responsibility for the decision stayed yours.",
              "In the temple two lines were carved that sum up half of Greek philosophy: «know thyself» and «nothing in excess».",
              "AND THERE WAS ANOTHER CURRENT, a minority one but decisive: Orphism, which taught that the soul is immortal, that it's trapped in the body, that it's reincarnated and that it can be purified by a life of discipline. Those ideas passed to Pythagoras, from there to Plato, and from Plato to Christianity. The Western idea of an immortal soul separate from the body comes, in good part, from those groups.",
            ],
            dato: "Fun fact: in the 20th century it was discovered that the rock beneath the temple at Delphi has faults through which hydrocarbon gases can escape, among them ethylene, capable of producing altered states of consciousness. The chemical explanation takes nothing away from the institution: for a thousand years, half of Greece made its important decisions there.",
          },
        ],
      },
      "religion-romana": {
        titulo: "Roman religion",
        fecha: "≈753 BC–AD 476",
        cuerpo: [
          "For a Roman, religion wasn't about believing or feeling: it was about doing things correctly. The rites had to be carried out with the exact words, in the exact order and on the exact date. If a priest got a single syllable wrong, the whole ceremony was repeated from the beginning.",
          "The logic was contractual, and they summed it up like this: I give so that you give. I offer a sacrifice, I keep my side, and I expect the god to keep his. Vows were even written down with conditions: if we win this battle, I'll build you a temple.",
          "That's why their religion was so bound up with the state. Religious offices were public offices, held by politicians: the pontifex maximus was the supreme priest and, at the same time, a position of power held by Caesar and then by every emperor. Before a vote, a battle or an assembly the augurs were consulted, who read the flight of birds, or the haruspices, who read the entrails of sacrificed animals. If the signs were bad, it was postponed, and that was used politically without the slightest embarrassment.",
          "And they were extraordinarily tolerant of other people's gods, out of pure pragmatism: when they conquered a city, they invited its gods to change sides and gave them a temple in Rome. The more gods on your side, the better.",
          "But that tolerance had a very clear limit: public order and loyalty. They banned the cults they considered dangerous — the Bacchanalia, the Druids — and they persecuted Jews and Christians not for their beliefs but because they refused to take part in the common worship, which in their eyes was disloyalty to the city.",
        ],
        dato: "Fun fact: the names of the planets — Mercury, Venus, Mars, Jupiter, Saturn, Neptune — and of several days of the week in the Romance languages come straight from their gods. Every time you say «Tuesday» in Spanish («martes») you're naming the god of war.",
        extras: [
          {
            titulo: "The Vestals, the Saturnalia and other inheritances",
            cuerpo: [
              "THE VESTALS. Six priestesses, chosen as girls from the best families, whose only duty was to keep alight the sacred fire of the goddess Vesta, which stood for the very continuity of Rome. They served thirty years in compulsory chastity.",
              "In compensation they had privileges no other Roman woman had: they could own and manage property of their own, make a will, testify without swearing an oath, move about the city in a carriage and be escorted by a lictor. Their word could pardon a condemned man who crossed their path.",
              "And the punishment, if the fire went out or if they broke the vow, matched what was believed to be at stake: flogging, or being buried alive in an underground chamber, so as not to spill the blood of a consecrated woman. It lasted more than a thousand years, until the emperor Theodosius put out that fire in the year 394.",
              "THE SATURNALIA. In December, around the solstice, Rome celebrated several days of festival in honor of Saturn during which work stopped, houses were decorated with green branches, gifts were exchanged, people ate and drank to excess… and the roles were reversed: slaves sat at the table and were served by their masters, and a mock «king» was chosen who gave absurd orders.",
              "It isn't that Christmas «is» the Saturnalia, but when Christianity fixed the birth of Jesus on 25 December — a date that appears nowhere in the Gospels — it chose precisely the day the empire celebrated the birth of the Unconquered Sun, in the middle of the festive season. The structure of a winter festival, with gifts, lights and food, was kept.",
              "And one structural inheritance: the Catholic Church inherited the empire's administrative map (dioceses were Roman territorial divisions), its language, its law, its calendar of festivals and even the title of its supreme priest, pontifex maximus, which still appears today in the inscriptions of the Vatican.",
            ],
            dato: "Fun fact: the Romans had a custom called evocatio: before storming a city, they formally invited its gods to leave it and promised to worship them in Rome. Winning a war included signing up the enemy's god.",
          },
        ],
      },
      "grecia-conquista-roma": {
        titulo: "Greece conquers Rome… without armies",
        fecha: "2nd–1st c. BC",
        cuerpo: [
          "When Rome conquered Greece, many thought Greek culture would disappear. Exactly the opposite happened.",
          "The Romans were well aware of being the better engineers, soldiers and administrators, and the worse at almost everything else. They admired Greek philosophy, theater, sculpture, medicine and literature without any embarrassment, so instead of destroying them they imported them wholesale.",
          "They did the same with the gods: they identified their own with the Greek ones and adopted their myths. Zeus became Jupiter, Poseidon Neptune, Ares Mars, Aphrodite Venus, Hera Juno. The stories we know today as «classical mythology» are to a large extent Roman versions of Greek ones, and the book that has passed those myths to the West more than any other is the Metamorphoses, written in Latin by Ovid.",
          "And there was a far-reaching religious consequence: they also imported Greek philosophy, and with it Stoicism and Epicureanism, which offered educated Romans something their ritual religion didn't give — an answer about how to live, how to die and what virtue is. When the official religion ran out of capacity to console, people were already looking somewhere else: in philosophy, in the eastern cults of Isis or of Mithras… and, soon after, in Christianity.",
          "The poet Horace summed it up in a line that became famous: «Captive Greece took captive her savage conqueror.»",
        ],
        dato: "Fun fact: the Gospels were written in Greek, not in Latin or in Aramaic. The language of the defeated people had become the common tongue of the eastern Mediterranean, and that's why Christianity spread in Greek for its first few centuries.",
      },
      "mitologia-hindu": {
        titulo: "Hindu mythology",
        fecha: "From antiquity",
        cuerpo: [
          "That a single universe should contain three hundred million gods and be, at the same time, one is what most baffles anyone coming from a religion with a single God, and the Hindu answer is elegant: all those gods are forms, masks, aspects of one single ultimate reality called Brahman, which has no form and no name and is too vast to be thought about directly.",
          "The three main functions are represented by the Trimurti: Brahma creates, Vishnu preserves and Shiva destroys. And pay attention to that last one, because it's one of the most powerful ideas in Hinduism: destruction isn't evil, it's the condition for something new to be able to exist. Shiva is pictured dancing inside a circle of fire, and that dance is the rhythm of the universe.",
          "Vishnu, when the world gets too disordered, comes down in the form of an avatar. His best-loved incarnations are Rama, the just king of the Ramayana, and Krishna. There's also Ganesha, the elephant-headed god who removes obstacles and is prayed to before starting anything; Hanuman, the faithful and brave monkey; Lakshmi, abundance; Saraswati, knowledge and music; and Durga or Kali, the feminine energy that destroys demons, fearsome and protective at once.",
          "Their two great epics are the collective memory of India: the Ramayana and the Mahabharata, which at some hundred thousand verses is several times longer than the Iliad and the Odyssey combined. They aren't only religious stories: they're the source of the ethics, the theater, the dance, the cinema and the cartoons of 1.2 billion people.",
          "And there's one underlying difference from the Abrahamic religions: here time isn't a line that starts at a creation and ends at a judgment, but an immense cycle that repeats. The universe is born, lasts, dissolves and is born again, over and over.",
        ],
        dato: "Fun fact: the word «avatar», which we now use for the little figure that stands in for us online, is Sanskrit and means «descent»: the god who comes down and takes a body. Every time you pick an avatar you're using, without knowing it, a Hindu theological term.",
        extras: [
          {
            titulo: "A time measured in billions of years",
            cuerpo: [
              "Almost every ancient religion works with short spans: a few thousand years since creation. India did something different and surprising: it counted on astronomical scales.",
              "According to its texts, the universe passes through four successive ages that steadily degrade, and the four together make a cycle that repeats. A thousand of those cycles make one «day of Brahma», which lasts 4.32 billion years. And then comes a night just as long, in which everything dissolves, and after that another day.",
              "Stop on that figure for a second: 4.32 billion years. Science today puts the age of the Earth at some 4.54 billion years and that of the universe at some 13.8 billion. It's the only ancient cosmology that moves in the same order of magnitude as modern astronomy. Nobody was measuring anything; they simply chose to think big.",
              "That cyclical time changes the meaning of everything. If the universe repeats infinitely, salvation can't consist of reaching a good ending, because there is no ending. Liberation (moksha) consists of GETTING OUT of the cycle, not of winning it.",
              "And it explains the attitude to death: if the soul is born again, dying isn't the absolute disaster it is for a religion with only one life; the disaster is learning nothing and having to start over. Hence the importance of karma, which isn't a divine punishment but an impersonal law, like gravity: every action has consequences, and those consequences shape your next life.",
              "The part India itself has had to fight is another one: the caste system, a hereditary social order justified for centuries with religious arguments, which left the untouchables at the bottom. It's banned by the Constitution of 1950 — drafted by Ambedkar, a jurist born into an oppressed caste who ended up converting to Buddhism along with hundreds of thousands of followers — but it still weighs socially.",
            ],
            dato: "Fun fact: in the temple at Chidambaram, in southern India, the statue of Shiva dancing (Nataraja) represents the creation and destruction of the universe in a single gesture. There's a copy of that figure at the entrance to CERN, the great particle physics laboratory in Geneva, given by India: the physicists saw in that dance a metaphor for what happens in their accelerators.",
          },
        ],
      },
      "mitologia-china": {
        titulo: "Chinese mythology",
        fecha: "Antiquity",
        cuerpo: [
          "Chinese mythology is populated with gods, dragons, immortals and founding heroes. One of its stories tells that the giant Pangu separated heaven from earth on waking out of chaos, and that when he died his body became the mountains, the rivers, the wind and the stars. Another tells that the goddess Nüwa shaped human beings out of yellow clay and repaired the sky when it broke.",
          "But the most influential religious idea in China isn't a god: it's Heaven (Tian), understood as an impersonal moral order. And out of it comes a devastating political concept: the Mandate of Heaven.",
          "It works like this: the emperor rules because Heaven has entrusted it to him, but that trust is CONDITIONAL. If he rules badly, if there's hunger, corruption, floods or disorder, it means Heaven has withdrawn the mandate… and then rebelling against him isn't treason, it's carrying out the will of Heaven.",
          "That's exactly the opposite of the European divine right, which made the king untouchable. In China, the official religion contained within itself the legitimate argument for overthrowing a ruler, and it was used every time a dynasty fell, for two thousand years.",
          "The second piece is ancestor worship, which is still alive. The family's dead don't leave: they go on needing attention and go on influencing the fortunes of the living. Hence the tablets with their names at home, the offerings of food, the burned paper and the annual festival of cleaning the graves. That makes the family, and not the temple, the religious center.",
          "And the third is the most practical: in China you don't choose a religion, you accumulate them. One and the same person can honor their ancestors as Confucianism requires, ask a Taoist deity for health, light incense in a Buddhist temple and consult the calendar to choose the day for a wedding, without seeing any contradiction. Each tradition covers different ground.",
        ],
        dato: "Fun fact: while in Europe the dragon is a monster to be killed, in China it's a benevolent being associated with water, rain and good fortune, and it's still one of the national symbols. The same imaginary animal, two opposite meanings, depending on what your harvest depends on: the livestock the dragon eats or the rain the dragon brings.",
      },
      sintoismo: {
        titulo: "Shinto",
        fecha: "From Japanese antiquity",
        cuerpo: [
          "In Japan, that line isn't a joke: it describes common practice. The baby is presented at a Shinto shrine, many weddings are held with Christian trappings and funerals are usually Buddhist. To understand it you have to stop thinking of a religion as an exclusive membership.",
          "Shinto — «the way of the kami» — is the original religion of Japan, and it has no founder, no dogma, no book of commandments and no promise of salvation. What it has is the kami: sacred presences that dwell in mountains, waterfalls, trees, rocks, animals, ancestors and also in outstanding people. They're said to number eight million, a figure that simply means «countless».",
          "Its central concern isn't sin but PURITY. What keeps you from the kami isn't having been bad in a moral sense, but being contaminated: by death, blood, illness, dirt. That's why the basic religious gesture is washing: on entering a shrine you rinse your hands and mouth, make offerings, ring a bell, clap twice to alert the kami and ask for something concrete: passing an exam, a pregnancy, good business.",
          "A shrine announces itself with a torii, that gateway of two columns marking the border between the everyday and the sacred. You don't have to believe anything to walk under it; you have to do it with respect.",
          "Its history has a dark side too. From 1868 the Japanese state made Shinto the official religion and used it to prop up the cult of the emperor as a descendant of the sun goddess, Amaterasu, and to feed the militarist nationalism that led to the Second World War. In 1946, after the defeat, the emperor publicly renounced his divine character and the state was separated from the shrine.",
        ],
        dato: "Fun fact: Japan's most revered shrine, at Ise, is rebuilt entirely every twenty years on an adjoining plot, using the same techniques, and then the previous one is taken down. It has been done since the 7th century: the building is thirteen hundred years old and not one of its parts is more than twenty. It's an idea of eternity completely different from that of European stone.",
      },
      "religiones-africanas": {
        titulo: "Traditional African religions",
        fecha: "From antiquity",
        cuerpo: [
          "Talking about «African religion» is like talking about «European religion»: on a continent with more than two thousand peoples and languages there were thousands of different traditions. But many share a recognizable architecture, and it's worth understanding because it explains things happening today on the other side of the Atlantic.",
          "First: almost all of them have a supreme creator God, single and distant — Olodumare among the Yoruba, Nyame among the Akan, Amma among the Dogon — of whom there are usually no images and no temples, because he doesn't concern himself with the day-to-day.",
          "Second: between that God and people there's a multitude of intermediaries who do concern themselves. Among the Yoruba they're called orishas and each one has a character, colors, foods, drums and a domain: Shango, thunder and justice; Yemoja, the sea and motherhood; Oshun, love, the river and sweetness; Ogun, iron and work.",
          "Third, and this is the most important feature: the ancestors go on being part of the community. They aren't «somewhere else»: they're close, they're spoken to, consulted, fed, and they can help or make trouble. A bad patch in the family can be read as a neglected ancestor, and the solution is a ritual of repair. Being born, marrying and dying are the moments when the community of the living and that of the dead touch.",
          "Fourth: the religion isn't read, it's done. It's passed on by oral tradition, and its language is the drum, the song, the dance, the mask and ritual possession, in which a spirit «mounts» an initiate and speaks through their mouth. And it has a very sophisticated system of divination, Ifá, with a body of verses the priest must memorize and which UNESCO has recognized as heritage of humanity.",
          "And fifth, something that gets forgotten: Africa isn't only a receiver of religions. Ethiopia has been Christian since the 4th century, almost as long as Rome; North Africa gave us Augustine of Hippo; there were thousand-year-old Jewish communities; and Islam came in across the Sahara from the 8th century on, with cities like Timbuktu turned into university centers with libraries of thousands of manuscripts.",
        ],
        dato: "Fun fact: it's reckoned that some hundred million people practice traditional African religions today, and a great many more combine them with Christianity or Islam without considering it a contradiction.",
        extras: [
          {
            titulo: "The gods who crossed the Atlantic in hiding",
            cuerpo: [
              "Between the 16th and 19th centuries, more than eleven million Africans were enslaved and taken to the Americas. They were forbidden their language, their name and their religion, and were baptized by force. What they did with that is one of the most extraordinary stories of cultural resistance there is.",
              "Instead of giving up their gods, they HID them behind the Catholic saints. If you're forced to pray to Saint Barbara, whose attribute is lightning, you can go on praying to Shango, the lord of thunder. If you're forced to venerate Our Lady of Regla, dressed in blue and patron of sailors, you can go on honoring Yemoja, lady of the sea. If the saint is Saint Lazarus, covered in sores, behind him stands Babalú Ayé, the one who deals in disease.",
              "That's how new religions were born, neither African nor European but American: santería or Regla de Ocha in Cuba, candomblé and umbanda in Brazil, vodou in Haiti, palo, shango in Trinidad. All of them with drums, initiations, offerings of food, ritual possession and a calendar that mapped onto the Catholic one.",
              "And they had real political consequences. The Haitian revolution, the only insurrection of enslaved people that succeeded and founded a state, began according to tradition with a vodou ceremony at Bois Caïman in 1791. Religion was what made it possible to gather, to swear an oath and to sustain the rebellion.",
              "Their cultural influence is immense and it's in things you hear every day. Rumba, son, jazz, samba, blues, salsa and a good part of the popular music of the 20th century come from rhythms and call-and-response structures that arrived with those cults. The drums weren't folklore: they were liturgy, and in many places they were banned for precisely that reason.",
              "For centuries they were persecuted and caricatured — the cinema turned vodou into a horror film with dolls and pins, which has almost nothing to do with the real practice — and only in recent decades have they come to be recognized and studied. In Brazil and Cuba they have millions of practitioners, and in Nigeria and Benin links with the traditions of origin have been recovered.",
            ],
            dato: "Fun fact: there are African words in your everyday vocabulary that arrived by this route: «banjo», «bongo», «conga», «marimba», «mambo», «yam», «gumbo», «okra», «jazz» and, according to many linguists, «tango» and «samba». The language kept what the law forbade.",
          },
        ],
      },
      "america-precolombina": {
        titulo: "The religions of pre-Columbian America",
        fecha: "Before 1492",
        cuerpo: [
          "The American civilizations developed highly elaborate religions, with monumental temples, specialized priesthoods, precision astronomy and ritual calendars. And they shared one underlying intuition: the cosmos isn't stable. It has to be actively held up, with human work, or it falls.",
          "The MAYA took that idea into the realm of calculation. They ran a 260-day ritual calendar and a 365-day solar one at the same time, combining into cycles of 52 years, plus a «long count» able to date events thousands of years apart. Their interest wasn't abstract: every day had its charge, its god and its kind of luck, and the king needed to know which was the right moment for a war, a wedding or a coronation. Their sacred book, the Popol Vuh, tells how the gods failed twice at creating humans — from clay and from wood — until they managed it with corn, the food everything depended on.",
          "The AZTECS had the most extreme version of that idea. They believed they were living in the fifth sun, after the four previous worlds had been destroyed, and that this one would end too. The sun moved each day because it was fighting a battle, and to have strength it needed the most precious liquid there is: blood. Hence the self-sacrifices (piercing the tongue or the ears was common practice, kings included) and the human sacrifices, almost always of prisoners taken in combat. It wasn't gratuitous cruelty: it was, in their logic, maintenance of the universe. And it was also political terror over the subject peoples, which is why they allied themselves with Cortés.",
          "The INCAS organized religion as a state. Inti, the sun, was their principal god and the emperor his son; Pachamama, the earth; Viracocha, the creator. Dead emperors were mummified and went on having a house, servants, lands and a voice in decisions: they were literally consulted. And they made offerings on the highest mountains, including sacrifices of chosen and honored children — the capacocha — whose bodies have been found frozen above 6,000 meters.",
          "All these religions were systematically attacked after the conquest: the codices were burned — of the Maya books only four survived — temples were pulled down and churches were built on top, often with the same stones.",
          "And even so they didn't disappear. They fell back and mixed in. The Virgin of Guadalupe appears on the hill of Tepeyac, a place of earlier worship; the Day of the Dead joins the Catholic feast with the Mesoamerican relationship to the departed; in the Andes the payment to Pachamama is still made before sowing or building. What couldn't be banned was camouflaged.",
        ],
        dato: "Fun fact: the Maya calculated the length of the solar year and the cycles of Venus to within minutes, all of it without optical instruments and with a base-20 numbering system that included zero, a concept Europe took centuries longer to adopt.",
      },
    },
  },

  // ── La gran revolución espiritual ──────────────────────────────────────
  "revolucion-espiritual": {
    titulo: "The great spiritual revolution",
    anio: "≈2000–200 BC",
    momentos: {
      abraham: {
        titulo: "Abraham",
        fecha: "≈19th–18th c. BC (by tradition)",
        cuerpo: [
          "Until then, gods belonged to a place: the god of this city, of the river, of the mountain. If you moved, you changed gods, because each one's power ended where its territory ended.",
          "Biblical tradition tells that Abraham left Ur, the great Mesopotamian city, and set out for a land he didn't know because a God spoke to him. What's revolutionary isn't the journey: it's that this God travels with him. A God who isn't tied to a place is, necessarily, a God of everywhere.",
          "The second novelty is the kind of relationship. It isn't a maintenance contract — I feed you, you protect me — but a COVENANT: a mutual promise, with trust and with moral demands on both sides. God promises descendants and land; Abraham promises faithfulness. It's the first time the divine appears as someone you can make a pact with and, above all, someone you can argue with: in the episode of Sodom, Abraham haggles with God over the number of righteous people needed to save the city.",
          "The harshest story is the sacrifice of his son. God asks for it, Abraham obeys, and at the last moment an angel stops him and a ram appears. It has been read a thousand ways — a test of obedience, a test of faith, a moral scandal — but there's one very powerful historical reading: in a world where human sacrifice existed as religious practice, that story marks its definitive prohibition. From then on an animal is offered, never a child.",
          "There's no archaeological evidence for Abraham; he's a figure of tradition, and his dating is disputed. But his importance is measurable: he's the common reference point of Judaism, Christianity and Islam, and that's why we call all three «Abrahamic religions». Between them they account today for more than half of humanity.",
          "In Islam, moreover, the thread continues through another son: Ishmael, born of Hagar. According to Islamic tradition, Abraham and Ishmael raised the Kaaba at Mecca, and the sacrifice remembered at the Feast of the Sacrifice is this same episode.",
        ],
        dato: "Fun fact: the tomb tradition attributes to Abraham, at Hebron, is today both synagogue and mosque, divided and guarded. The figure all three religions recognize as a common father also marks one of the most disputed places on the planet.",
      },
      moises: {
        titulo: "Moses",
        fecha: "≈13th c. BC (by tradition)",
        cuerpo: [
          "The story of Exodus is, above all else, a story of liberation: a people enslaved in Egypt leaves it led by Moses, crosses the sea and spends forty years in the desert before reaching their land. That structure — oppression, departure, crossing, promise — has become the liberation story par excellence of Western culture, used by everyone from African American slaves in their songs to the civil rights movements.",
          "The central moment isn't the escape but what happens on Mount Sinai: the giving of the Law. That's where the people go from being a group of fugitives to being a community with rules, and where religion takes a decisive leap: it's no longer about performing the correct rites, it's about behaving a certain way toward other people.",
          "Something unique also happens in the episode of the bush that burns without being consumed. Moses asks the name of the god speaking to him — because in that world knowing a god's name meant being able to summon it — and gets an answer that isn't a name: «I am who I am». That God refuses to be defined, and his written name (the four letters of the Tetragrammaton) will end up unpronounceable: Jews read «the Lord» or «the Name» in its place.",
          "Historically, there's no archaeological trace of a mass departure from Egypt or of forty years in Sinai, and most researchers think the story was composed centuries later out of various traditions. That takes not a gram away from its influence: it's probably the most quoted political text in history.",
        ],
        dato: "Fun fact: the horns Michelangelo carved on his famous Moses come from a translation error. The Hebrew said that his face «radiated» as he came down from the mountain, and a very similar word means «horn». The Latin version chose wrong, and that's how it entered European art for centuries.",
        extras: [
          {
            titulo: "The Ten Commandments and the invention of rest",
            cuerpo: [
              "They're worth looking at closely, because their structure says a great deal. The first ones regulate the relationship with God: one God only, no images, not using his name in vain, and keeping the Sabbath. The rest regulate the relationship between people: honor your parents, don't kill, don't commit adultery, don't steal, don't bear false witness and don't covet your neighbor's goods or his wife.",
              "Which is to say: half the divine law doesn't talk about God, it talks about your neighbors. That's where the novelty is. In the ancient religions, offending a god meant neglecting his worship; here, offending God is mistreating a person.",
              "The most socially revolutionary one is the Sabbath, and you have to read it whole to see it: it commands rest one day in seven, and it specifies that the rest extends to your children, your servants, your slaves, the foreigners living with you and even your working animals.",
              "Think of it in context: in the 13th century BC, nobody rested by right. Whoever had to work worked, every day, and leisure was a privilege of the elites. Here appears for the first time the idea that rest is a religious obligation that also protects the person with no power to ask for it. It's the remote ancestor of the weekend.",
              "And there's something else that doesn't usually get pointed out: the later prophets — Amos, Isaiah, Micah, Jeremiah — used that law to attack the kings and the priests of their own people. They said God cares less about sacrifices than about justice, that an impeccable worship with the poor exploited is an offense, and that religion without ethics is worth nothing. That is perhaps the most influential contribution of the whole of ancient Judaism, and it's what Jesus, Christian social teaching and a good part of the modern language of rights will all drink from afterward.",
            ],
            dato: "Fun fact: in Hebrew, the commandment is usually translated «thou shalt not kill», but the verb used refers specifically to murder, not to any killing. That nuance has produced two thousand five hundred years of legal and theological argument about war, the death penalty and self-defense.",
          },
        ],
      },
      zoroastro: {
        titulo: "Zoroaster and Zoroastrianism",
        fecha: "≈1200–1000 BC (date disputed)",
        cuerpo: [
          "Why evil exists if the world was made by someone good is a logical trap for any religion with a single, all-powerful, good God, and in ancient Persia a prophet named Zoroaster gave the cleanest answer ever given: evil doesn't come from God, it comes from an opposing principle, and the whole universe is the battlefield between the two.",
          "On one side, Ahura Mazda, the «Wise Lord», creator of light, life and true order. On the other, Angra Mainyu, the spirit of destruction and the lie. And in the middle, each human being, with one decisive capacity: choosing. You aren't predestined; you join a side with every thought, every word and every action. His formula, which is also his ethical summary, is exactly that: good thoughts, good words, good deeds.",
          "Zoroastrianism introduced, or developed for the first time in full, a package of ideas that seem obvious to us today and weren't before him: the judgment of each person after death; a heaven and a hell according to their behavior; good spiritual beings who help (something very like angels) and ones who harm (demons); a savior who will come at the end of time; a final battle; the resurrection of the dead; and a happy ending in which evil is defeated and the world is made new.",
          "And that's where its historical importance lies. When the Jewish people were exiled in Babylon and then under the rule of the Persian Empire — a good two centuries of contact — many of those ideas appear or develop in their later texts. From there they passed to Christianity and to Islam. Which is to say: a good part of what half of humanity believes today about heaven, hell, angels, the devil, the last judgment and the messiah has a Persian ancestor.",
        ],
        dato: "Fun fact: the «Wise Men» who appear in the Gospel following a star were magi, that is, Zoroastrian priests and Persian astrologers — which is where our word «magic» comes from. And the singer Freddie Mercury was born into a Parsi Zoroastrian family: at his funeral the prayers were in Avestan, the liturgical language of Zoroaster.",
      },
      judaismo: {
        titulo: "Judaism",
        fecha: "≈13th–6th c. BC",
        cuerpo: [
          "Judaism was the first monotheism to take hold and endure, and its core fits into one line recited twice a day: hear, the Lord is our God, the Lord is one.",
          "Its original features are four. One God, creator of everything and without an image. A covenant with a people, which means responsibility and not privilege. A law that regulates the whole of life, from justice to food. And an insistence hammered home through the prophets that what God cares about is how you treat the orphan, the widow and the foreigner.",
          "And then came the test. In 586 BC Babylon destroyed Jerusalem, razed the Temple and deported the people's elite. For any ancient religion, that was the end: the god had lost, the city and the temple were gone, and the logical thing was to adopt the victor's gods, as every defeated people in history did.",
          "They did the opposite, and that's where the religion transformed. Instead of concluding their God was weak, they concluded he was universal — the God of all peoples, including the ones who had beaten them — and that the defeat was a consequence of their own faults. And instead of needing a temple, they invented a form of religion that can be practiced anywhere in the world: gathering to read, discuss and pray. That's the synagogue, and it's probably the most influential religious innovation of antiquity: the model the church and the mosque later come out of.",
          "With the permission of the Persian king Cyrus they returned and rebuilt the Temple, and in AD 70 Rome destroyed it again, this time for good. With no temple, no sacrifices and no country, Judaism reorganized itself entirely around the study and the debate of the text. The priest was replaced by the rabbi, who isn't an intermediary with God: he's a teacher.",
          "They have never been many — today some fifteen million, less than 0.2% of humanity — and their influence is hard to overstate: out of their beliefs came Christianity and Islam, that is, the religion of more than half the planet.",
        ],
        dato: "Fun fact: Shabbat, the weekly rest, has been kept continuously for some three thousand years, through empires, exiles, ghettos and wars. It's probably the oldest living custom in the world.",
        extras: [
          {
            titulo: "The Talmud: a religion that argues with itself",
            cuerpo: [
              "After the year 70, with the Temple destroyed, the rabbis devoted themselves to something extraordinary: writing down the argument. First they collected the oral legal discussions (the Mishnah, around the year 200) and then the centuries of commentary on those discussions (the Gemara). Together they make the Talmud, a work of thousands of pages.",
              "The extraordinary part is its form. Open a page and you'll see the ancient text in the center and, all around it, in columns and different typefaces, the commentaries of rabbis from different centuries and countries, arguing with each other and with you. It's a fifteen-hundred-year conversation printed on the same sheet.",
              "And this is the most striking thing: when an argument is settled, the opinion that LOST isn't erased. It's kept alongside the one that won, with its name and its reasoning. The tradition keeps the disagreement in writing, because tomorrow that reasoning might turn out to be useful.",
              "It's also studied in pairs — a practice called chavruta: two people read, question each other and argue back out loud for hours. The normal way of approaching the sacred isn't listening in silence, it's arguing. There's a famous passage in which a voice from heaven tries to settle a legal dispute and the rabbis overrule it, saying that the Torah has already been given to human beings and that the interpretation is now theirs.",
              "Out of that came a culture of argument, critical reading and compulsory education (you had to be able to read in order to study) that many historians connect with the enormous later presence of Jews in science, law, medicine, literature and psychoanalysis, far above their share of the population.",
            ],
            dato: "Fun fact: there's a tradition of study in which the whole Talmud is read at a rate of one page a day. It takes about seven and a half years, and on finishing it's celebrated publicly and started again from the beginning.",
          },
          {
            titulo: "Two thousand years of diaspora, and one date: 1948",
            cuerpo: [
              "After the destruction of the Temple and the revolts against Rome, most of the Jewish people were scattered across the Mediterranean, the Near East, Europe and, later, the Americas. That dispersal is called the diaspora, and out of it came two great cultural branches: the Sephardim (from Sefarad, Spain) and the Ashkenazim (from central and eastern Europe), each with its own accent, cooking and music.",
              "Their European history alternates between coexistence and catastrophe. There were brilliant centuries: in al-Andalus and in the Christian kingdoms, Jewish doctors, translators, poets, philosophers and royal advisers were central to the transmission of knowledge. And there was systematic persecution: bans on owning land and on practicing trades (which pushed them into finance and commerce, and was then used as a stereotype against them), ghettos, compulsory badges on clothing, absurd accusations — poisoning wells, killing children in rituals — massacres during the Black Death and the crusades, expulsions: from England in 1290, from France, and from Spain in 1492.",
              "That road led to the Holocaust: the systematic murder of some six million Jews between 1941 and 1945, two thirds of the Jewish population of Europe. Communities with a thousand years of history disappeared entirely. The world Jewish population, which stood at around 16.6 million in 1939, still hasn't returned to that level.",
              "In 1948, after decades of Zionist movement and immigration to Palestine, and with the UN approving a partition plan, the State of Israel was proclaimed. For the Jewish people it was the return to the land spoken of in every prayer for two millennia. For the Palestinian Arab population it meant war, the displacement of hundreds of thousands of people and a conflict still open today, with enormous suffering on both sides.",
              "And there's a religious part worth pointing out: within Judaism itself there are very different branches — Orthodox, Conservative, Reform, secular — that argue among themselves about almost everything, including the religious meaning of that state. There's no central authority to settle it: they remain, as in the Talmud, a tradition that argues.",
            ],
            dato: "Fun fact: in 1492 the Jews expelled from Spain took the Spanish of the time with them, and their descendants preserved it for centuries in Thessaloniki, Istanbul or Sarajevo. That language, Judeo-Spanish or Ladino, is still spoken, and it sounds much like the Spanish spoken when Columbus set sail.",
          },
        ],
      },
      hinduismo: {
        titulo: "Hinduism",
        fecha: "≈1500–500 BC",
        cuerpo: [
          "Hinduism is the oldest of the great living religions and the hardest to define, because it doesn't fit the box. It had no founder, no date of birth, no single obligatory book and no central authority to decide what counts as heresy. It's more an enormous family of traditions that grew up together over three thousand years.",
          "Its oldest texts are the Vedas, hymns passed on ORALLY with astonishing precision — memorized syllable by syllable, with recitation rules designed to catch any error — for centuries before they were written down. And on top of them are the Upanishads, where the question changes direction: no longer «what sacrifice must be offered», but «what am I».",
          "The Upanishads' answer is one of the boldest ideas in the history of thought: the ultimate depth of yourself (atman) and the ultimate depth of the universe (Brahman) are the same. You don't have to go looking for the divine outside; you have to realize it.",
          "Out of that come its four key concepts. Karma: every action has consequences, and not as anyone's punishment but as a law. Samsara: the cycle of births and deaths those consequences tie you to. Dharma: each person's own duty according to their situation, their stage of life and their role. And moksha: liberation from that cycle, which is the final goal.",
          "And since there's no dogma, it offers several valid paths at once, which is quite unique: the path of knowledge (study and discernment), the path of devotion (love of a personal god, which is the path of the vast majority), the path of selfless action (doing your duty without attaching yourself to the result) and the path of physical and mental discipline, which is yoga.",
        ],
        dato: "Fun fact: the word «Hindu» wasn't coined by Hindus. It comes from what the Persians called the people living on the other side of the river Indus, and the term «Hinduism» was popularized by the British in the 19th century to group under one administrative label a religious reality far more varied than that.",
      },
      krishna: {
        titulo: "Krishna and the Bhagavad Gita",
        fecha: "≈1200–500 BC (development of Hinduism)",
        cuerpo: [
          "The Bhagavad Gita, one of the most read texts in India, opens at the worst imaginable moment. Prince Arjuna is in his chariot, between two armies about to clash, and he breaks down: on the opposing side are his cousins, his teachers and his friends. He drops his bow and says he'd rather die than fight.",
          "His charioteer is Krishna, who turns out to be a divine incarnation, and what follows is eighteen chapters of conversation in the middle of a battlefield.",
          "Krishna's answer has several layers, and the central one is this: act because it's your duty, not for what you're going to get. The mistake isn't in acting, it's in acting driven by the result — fear of failure, hunger for reward, applause, guilt — because the result is never entirely in your hands. Do what falls to you, do it as well as you can and let go of the outcome.",
          "It's a text that has been read in opposite ways, and that's what makes it so interesting: Gandhi considered it his daily guide and read it as an allegory of the inner struggle and a support for nonviolence; others have read it as a justification of the warrior's duty. One book, two contrary readings, two thousand years of argument.",
          "And Krishna is also, in popular devotion, the most loved and most human god: the mischievous child who steals butter, the herdsman who plays the flute and enchants the milkmaids, the friend. The relationship with him isn't one of fear, it's one of affection.",
        ],
        dato: "Fun fact: when he witnessed the first nuclear explosion in history, in 1945, the physicist Robert Oppenheimer said a verse from the Bhagavad Gita came into his head, one in which Krishna shows himself in his cosmic form: «I am become death, the destroyer of worlds». He had studied Sanskrit in order to read it in the original.",
      },
      buda: {
        titulo: "The Buddha",
        fecha: "≈6th c. BC",
        cuerpo: [
          "Siddhartha Gautama was the son of a nobleman in northern India and grew up, according to tradition, shielded from anything unpleasant. One day he left the palace and saw for the first time an old man, a sick man and a corpse. It broke his life open: he understood that nothing he owned would save him from that.",
          "Meditating under a tree he reached what he called the awakening, and from then on he was called the Buddha, «the awakened one». He didn't claim to be a god, or a messenger, or a prophet: he said he had understood something, and that anyone could understand it. That makes him a rare case among the founders of religions.",
          "His diagnosis is the Four Noble Truths, and it's laid out exactly like a medical consultation: there is suffering; suffering has a cause; if the cause is removed, it ceases; and there is a treatment.",
          "The cause he pointed to is thirst: the constant wish for things to be other than they are, and the attachment to their staying when everything changes. And the treatment is the Noble Eightfold Path, which combines ethics (do no harm, don't lie, don't steal, earn your living honestly), attention and meditation. Nothing has to be believed on faith: it has to be checked in your own experience.",
          "His other revolution was social. He taught anyone — of any caste, including women and people considered impure — in the language of the people and not in the Sanskrit of the priests, and he organized a monastic community that lived on daily alms and therefore couldn't accumulate anything. In a rigidly hierarchical India, that was subversive.",
          "And there's one idea of his that's especially difficult and especially powerful: there is no fixed «self». What we call our identity is a process, a river of sensations, thoughts and habits that changes continuously. A good part of suffering, he said, comes from defending something that isn't there.",
        ],
        dato: "Fun fact: his last words, according to the texts, are an awkward instruction for any religion: don't rely on me, be your own lamp. And for the first few centuries nobody dared depict him in human form: in the ancient sculptures he appears only as a tree, a wheel, an empty throne or a pair of footprints.",
        extras: [
          {
            titulo: "The other answers India gave",
            cuerpo: [
              "The 6th century BC was in India an explosion of schools arguing in public, and there were far more varied answers than usually get told. Two are worth knowing.",
              "JAINISM. Its teacher, Mahavira, was a contemporary of the Buddha and took a single idea to its limit: ahimsa, harming no living being. Jain monks carry a little broom to sweep the ground before stepping on it, cover their mouths so as not to swallow insects, filter their water, don't eat after dusk and don't farm, because plowing kills creatures in the soil. It isn't a religion of gods: it's a discipline of absolute nonviolence and detachment.",
              "And it contributed one lovely philosophical idea: truth has many sides and no single position takes it all in. They illustrated it with the parable of the blind men and the elephant: one touches the trunk and says it's a snake, another the leg and says it's a tree, another the ear and says it's a fan. None of them is lying, and none of them is entirely right. It's one of the best lessons on fanaticism any religion has ever given.",
              "THE MATERIALISTS. And there was the opposite too. The Charvaka school held that only what can be perceived exists, that there's no soul, no reincarnation, no karma and no other world, that the rituals are a business run by the priests and that the sensible thing is to live this one life well. It's an explicit, argued atheism, in the 6th century BC, and the striking part is that its texts survive almost only because the other schools quoted them in order to refute them: India recorded even the positions it rejected.",
              "That's the context in which the Buddha has to be understood: not an isolated prophet, but one of the participants in the most intense philosophical debate of antiquity.",
            ],
            dato: "Fun fact: in India's Jain animal hospitals, injured cows, birds and dogs are cared for, some of them permanently disabled, with no productive purpose whatsoever. They've existed for centuries: they're probably the first charitable veterinary clinics in the world.",
          },
        ],
      },
      budismo: {
        titulo: "Buddhism",
        fecha: "From the 6th c. BC",
        cuerpo: [
          "At the start it was a small community of mendicant monks in the Ganges valley. What took it out of India was a political decision: in the 3rd century BC, the emperor Ashoka, after an atrocious war, embraced Buddhism and sent missions to Sri Lanka, Central Asia and Southeast Asia. Without him, it would probably be a vanished local school today.",
          "As it spread, it transformed, and hence its three great branches. Theravada, «the teaching of the elders», kept the model closest to the original and predominates in Sri Lanka, Thailand, Myanmar, Laos and Cambodia: the ideal is the monk who reaches liberation through his own effort. Mahayana, in China, Korea, Japan and Vietnam, introduced a moving figure: the bodhisattva, someone who can enter nirvana and refuses to until every being can enter with them; there compassion becomes the center, and buddhas and figures who can be prayed to appear. And Vajrayana, in Tibet and Mongolia, added rituals, mantras, mandalas and a structure of teachers recognized as reincarnations, the Dalai Lama among them.",
          "Its relationship with China, Korea and Japan is an extraordinary case of adaptation: arriving in a Confucian and Taoist world, it eliminated nothing, it coupled itself on. Out of the mixture with Taoism came Chinese chan, which in Japan was called zen, with its seated meditation, its distrust of words and its enormous influence on calligraphy, gardens, archery, tea and pottery.",
          "What makes it different from other religions is that it has no creator god, no permanent soul and no revealed commandments. It's more a method than a creed: a set of practices for stopping the automatic reactions and seeing things as they are.",
          "And the uncomfortable part has to be said too, because Buddhism tends to be idealized in the West: having been born without a god who orders killing hasn't stopped violence being justified in its name. There have been warrior monks in Japan, Buddhist nationalism in Sri Lanka and a brutal persecution of the Rohingya minority in Myanmar egged on by monks. No tradition is vaccinated against the political use of hatred.",
        ],
        dato: "Fun fact: the meditation technique now prescribed in hospitals and taught in companies — mindfulness — is a deliberately secular adaptation of Buddhist attention meditation, designed in the late 1970s for patients with chronic pain. It's probably the clearest case of a 2,500-year-old religious practice turned into clinical treatment.",
      },
    },
  },

  // ── La búsqueda de la sabiduría ────────────────────────────────────────
  "busqueda-sabiduria": {
    titulo: "The search for wisdom",
    anio: "Classical China",
    momentos: {
      confucio: {
        titulo: "Confucius",
        fecha: "≈551–479 BC",
        cuerpo: [
          "Confucius lived in a China broken up into kingdoms at endless war, with corrupt nobles and ruined peasants. His diagnosis was extraordinary for such a moment: the problem isn't a shortage of laws or armies, it's a shortage of character.",
          "His central idea is that social order rests on the conduct of particular people, and that it's learned from example and from the top down. A ruler who punishes a great deal gets fear; a ruler who behaves well gets other people wanting to be like him. He said governing by force is like trying to hold water in your hands.",
          "His key concepts are four. Ren, translated as humanity or benevolence: the capacity to put yourself in someone else's place. Li: the rites, the manners, the forms — which to him weren't trivia but the daily training of respect. Xiao: filial piety, respect for parents and elders, which was the model for every other relationship. And junzi: the exemplary person, who is one not by birth but by conduct — and this is revolutionary: it turned nobility into something you deserve, not something you inherit.",
          "And he formulated, some five hundred years before the Gospel, his own version of the golden rule, in the negative: don't do to others what you wouldn't want done to you.",
          "And he died convinced he had failed: he spent his life looking for a ruler who would apply his ideas and none took him seriously for long. His teachings were collected by his disciples after his death, in the Analects, a book of short conversations. In time they became the basis of the education, the administration and the morality of China, Korea, Japan and Vietnam for more than two thousand years.",
        ],
        dato: "Fun fact: for thirteen centuries, becoming an official of the Chinese Empire meant passing punishing examinations based on the Confucian classics, open in theory to any man. It was the first system in the world to select its rulers by examination and not by family, and it lasted until 1905.",
      },
      confucianismo: {
        titulo: "Confucianism",
        fecha: "From the 5th c. BC",
        cuerpo: [
          "Confucianism is a case that forces you to stretch the word «religion». It has no creator god, no revelation, no promise of salvation and no clergy. And yet it has temples, rites, a canon of sacred texts, a complete morality and a central relationship with the ancestors.",
          "Its core is the idea that society works if each person does well what falls to them in each of their relationships: son to father, younger brother to elder, wife to husband, subject to ruler, friend to friend. And note that the obligation runs both ways: the son owes respect, but the father owes care; the subject owes loyalty, but the ruler owes justice. If the one above fails, he loses his moral authority.",
          "We also owe it a decisive obsession: education. For Confucianism, anyone can improve by studying, and studying is a moral duty, not a luxury. That explains the prestige of the teacher, of the examination and of schoolwork across all of East Asia to this day.",
          "Its questionable side is the other face of the same thing: a strongly marked hierarchy, a heavy subordination of women in its traditional formulation and a tendency to value harmony above dissent, which has served to justify authoritarianism.",
          "Its recent history is a good example of the fact that religious ideas are never still: it was furiously attacked during China's Cultural Revolution in the 1960s, when temples were destroyed and scholars persecuted, and in recent decades the Chinese state itself has rehabilitated it and uses it as a cultural emblem around the world.",
        ],
        dato: "Fun fact: the documented lineage of Confucius's family is probably the longest family tree in the world: it has been recorded for some 2,500 years and gathers more than two million identified descendants.",
      },
      laotse: {
        titulo: "Lao Tzu",
        fecha: "≈6th–4th c. BC (traditionally)",
        cuerpo: [
          "While Confucius was proposing order, education and rites, tradition attributes to Lao Tzu the opposite idea: the universe already works on its own, and a good part of our suffering comes from forcing it.",
          "His book, the Tao Te Ching, has eighty-one extremely short chapters and some five thousand characters — it fits in a handful of pages — and it's written in deliberately elusive language, full of paradoxes: the one who knows doesn't speak, the soft defeats the hard, the emptiness is what makes a cup useful.",
          "His favorite image is water. Water doesn't fight, it gives way, it goes around the obstacle, it seeks the lowest point… and it ends up going through the rock. For Lao Tzu, that's the true form of strength, and the human error is confusing strength with rigidity.",
          "Out of that comes his most famous and most misunderstood concept: wu wei, «non-action». It doesn't mean doing nothing or resigning yourself: it means acting without forcing, at the right moment and with the minimum effort needed, like the good rider who doesn't fight the horse or the good carpenter who cuts along the grain. Anyone who has learned to swim, to drive or to play an instrument recognizes that difference between fighting something and letting it flow.",
          "Applied to government, it was almost anarchist: the best ruler is the one who intervenes least, and the best-governed people are the ones who barely notice they're being governed. Exactly the opposite of the Confucian program.",
        ],
        dato: "Fun fact: some historians doubt that Lao Tzu existed as a particular person; it may be the name under which the sayings of several sages were gathered. And even so, the Tao Te Ching is, after the Bible, one of the most translated books in history: into English alone it has more than two hundred and fifty different versions.",
      },
      taoismo: {
        titulo: "Taoism",
        fecha: "From the 4th c. BC",
        cuerpo: [
          "Taoism teaches that everything follows a natural principle called the Tao, «the way», which can't be defined in words — the book itself opens by warning that the Tao that can be named is no longer the Tao — and which you have to learn to go along with rather than against.",
          "Its symbol is extremely well known and almost always misunderstood: yin and yang aren't good and evil. They're two complementary forces — darkness and light, cold and heat, stillness and movement, receptivity and drive — that need each other, that turn into one another and that each carry a dot of the other inside. Illness, in this logic, isn't the presence of evil: it's an imbalance.",
          "That idea is the basis of traditional Chinese medicine, of tai chi, of qigong, of feng shui and of the concept of qi, the energy that circulates. A whole culture of the body and of space came out of here.",
          "Over the centuries, philosophical Taoism also became an organized religion, with temples, monks, gods, exorcisms, scriptures and one characteristic obsession: longevity. Its practitioners sought to lengthen life — and some, to reach immortality — through diets, breathing, exercises, meditation and alchemy.",
          "That search had an enormous and absurd historical consequence: while mixing minerals in search of the elixir of eternal life, some Taoist alchemists hit on a combination of saltpeter, sulfur and charcoal that exploded. They had invented gunpowder. The substance that was going to change war across the whole planet came out of the search for not dying.",
          "And their other great text deserves a mention. Zhuangzi, the second Taoist master, wrote that one night he dreamed he was a butterfly and that on waking he didn't know whether he was a man who had dreamed of being a butterfly or a butterfly now dreaming of being a man. It's probably the best philosophical question ever asked in four lines.",
        ],
        dato: "Fun fact: several Chinese emperors died poisoned by the immortality elixirs their alchemists prepared for them, made with mercury and other metals. Seeking to live forever, they poisoned themselves.",
      },
    },
  },

  // ── Un Dios para toda la humanidad ─────────────────────────────────────
  "un-dios-humanidad": {
    titulo: "One God for all humanity",
    anio: "1st–7th centuries",
    momentos: {
      "jesus-nazaret": {
        titulo: "Jesus of Nazareth",
        fecha: "≈4 BC–AD 30",
        cuerpo: [
          "Jesus preached for about three years in a tiny territory, wrote nothing and never left his region. And his message was baffling in every direction.",
          "He spoke of a God who was a father, close and merciful, not an implacable judge. He put forgiveness above revenge — to the point of asking people to love their enemy, something with no clear precedent. And he placed at the center precisely those who counted for nothing socially: the sick, lepers, the poor, prostitutes, tax collectors, foreigners, Samaritans, women. He ate with them, and that was the greater scandal, because sharing a table meant accepting people as equals.",
          "And he relativized ritual rules in the name of compassion — healing on the Sabbath, touching an unclean person — which set him against the religious authorities of his own people. The decisive clash came when he entered Jerusalem at Passover, with the city packed, and threw the money changers out of the Temple. That attacked both the business and the authority of the most powerful institution in Judea.",
          "He was arrested, handed over to Pontius Pilate and crucified, the punishment Rome reserved for slaves and rebels. And there, in principle, it all ended: one more man put to death in a distant province.",
          "What changed history was what came next. That small, terrified group began announcing that he had risen, and that conviction made them unstoppable: people with no power, no money and no education started preaching all across the Mediterranean, many of them until it killed them.",
        ],
        dato: "Fun fact: Pontius Pilate was doubted for centuries until, in 1961, a stone was found at Caesarea with his name and title carved on it. And his existence, along with the execution of Jesus, is also mentioned by non-Christian sources of the period, such as the Roman historian Tacitus and the Jewish one Flavius Josephus.",
      },
      "pablo-tarso": {
        titulo: "Paul of Tarsus",
        fecha: "≈AD 5–67",
        cuerpo: [
          "When Jesus died, his followers were one more Jewish group. They prayed at the Temple, kept the law and argued about whether the movement should stay inside Judaism. If nothing had changed, it would probably have ended up as one more minority current, gone by the 2nd century.",
          "Paul was an educated Pharisee from Tarsus, a Roman citizen, and he took an active part in persecuting the first Christians. On the road to Damascus he had an experience he interpreted as an encounter with the risen Jesus, and he went from persecutor to propagandist.",
          "His contribution wasn't preaching more, it was taking a strategic decision that changed everything. At the meeting we call the Council of Jerusalem, around the year 50, it was argued whether non-Jews wanting to join had to be circumcised and keep the dietary rules. Paul argued they didn't. And he won.",
          "And he set about exporting it. He covered some fifteen thousand kilometers on three great journeys, founding communities in Ephesus, Corinth, Philippi, Thessalonica, Galatia and Rome, working as an artisan to pay his way, and with a résumé he lists himself: shipwrecks, floggings, stonings, prisons and hunger.",
          "He also wrote, and this is key: his letters to those communities are the oldest Christian texts in existence, earlier than the Gospels. In one of them he left a line of astonishing radicalism for the 1st century: there is no longer Jew nor Greek, slave nor free, male nor female.",
          "He was executed in Rome, probably during Nero's persecution. And his theological influence is so great that there's a centuries-old argument about how much of Christianity comes from Jesus and how much comes from him.",
        ],
        dato: "Fun fact: some letters traditionally attributed to Paul probably aren't his but by later disciples, and it's precisely in several of those that the most restrictive passages about women and about the obedience of slaves appear. Telling apart what he wrote from what was written in his name has had enormous consequences in debates that are still open today.",
      },
      cristianismo: {
        titulo: "Christianity",
        fecha: "From the 1st century",
        cuerpo: [
          "For three centuries, Christians were a suspect minority. Rome tolerated any god on one condition: taking part in the public cult of the emperor, which was the political glue of the empire. They refused, and that refusal was read as disloyalty.",
          "The persecutions were atrocious but intermittent: local outbreaks across decades and two great imperial campaigns, Decius's in 250 and Diocletian's in 303, with temples pulled down, books burned and mass executions. The test for saving yourself was minimal — burning a little incense before the emperor's image — and that's what makes it so striking that many preferred to die.",
          "And in spite of everything they grew, for very concrete reasons: they accepted anyone regardless of class, sex or origin; they cared for their sick, their widows and their orphans, which in ancient cities — where people died alone — was a real support network; they buried their dead; they promised a life afterward that was the same for everyone; and they traveled making use of the empire's roads, harbors and common Greek.",
          "In 313, Constantine changed strategy and legalized Christianity; in 380, Theodosius made it the official religion. In seventy years it went from being underground to holding power, and that brought two things at once: an immense capacity for organization and for preserving culture… and the temptation to use force, now in the other direction.",
          "What came afterward is half the history of Europe: the councils that fixed the doctrine, monasticism, the preservation of the ancient books in the monasteries, the cathedrals, the universities, the hospitals, the mendicant orders and the missions. And also the Inquisition, the crusades, the witch hunts and the religious justification of conquest.",
        ],
        dato: "Fun fact: the cross, which was a Roman instrument of torture, took centuries to be used as a symbol: for the first Christians it was too recent and too humiliating, the way wearing an electric chair around your neck would be today. At first they used a fish, an anchor or a shepherd with a lamb.",
        extras: [
          {
            titulo: "The monasteries: the network that saved Europe",
            cuerpo: [
              "When the Western Roman Empire came apart, in the 5th century, the schools, the archives, the administration and a good part of the book trade went with it. What was left, and saved the furniture, were the monasteries.",
              "The movement had begun as a flight: men and women who withdrew into the deserts of Egypt and Syria to pray in solitude. Then it got organized, and in the 6th century Benedict of Nursia wrote a rule that became the European model, summed up in two words: pray and work.",
              "That rule included one decisive detail: it required reading. And to read you need books, so every monastery had a copying workshop where the monks reproduced by hand not only the Bible but also Virgil, Cicero, treatises on farming, on medicine and on grammar. Most of the Latin literature we still have exists because someone copied it in those workshops, sometimes without fully understanding it.",
              "And they did far more. They drained marshes, cleared and farmed land, raised livestock, improved wine and beer, milled with water, cared for the sick, took in travelers, fed the poor at the gate and taught the local children to read. Many European towns and cities were born around an abbey.",
              "There were women at the head too. Abbesses governed whole communities with lands and rents, and some were intellectual figures of the first order: Hildegard of Bingen, in the 12th century, wrote on theology, medicine and botany, composed music that's still recorded and kept up a correspondence with popes and emperors. For centuries, convents were the only place where a woman could study, write, lead and not marry.",
              "Without setting out to, that network of houses of prayer worked as the educational, health, agricultural and publishing system of Europe for six hundred years.",
            ],
            dato: "Fun fact: some medieval manuscripts carry notes in the margin written by the copyists themselves, and they're wonderfully human: they complain about the cold, the bad light, the ink, their backache or the cat having walked across the page. There's one that signs off: «thank God, it'll be dark soon».",
          },
          {
            titulo: "Nicaea, the creed and the council of the 20th century",
            cuerpo: [
              "A religion with no central authority and with communities scattered across half the world has an inevitable problem: each one interprets in its own way. The Christian solution was the councils, assemblies of bishops who decided what is doctrine and what is error.",
              "The first great one was Nicaea, in 325, convened and presided over by the emperor Constantine, who was no theologian but needed an empire without disputes. The matter under discussion was whether Jesus was of the same nature as God or a creature of his, superior to everything but created, as a priest named Arius held.",
              "The difference between the two positions came down to one Greek letter between two words, and it divided the empire for decades, with bishops exiled, riots in the streets and whole towns lining up with one side. Out of the council came the creed still recited in churches.",
              "And there was one, sixteen hundred years later, that changed the daily life of a billion people: the Second Vatican Council (1962–1965). It authorized celebrating Mass in each country's own language instead of Latin and with the priest facing the people; it expressly recognized religious freedom as a right; it opened dialogue with other denominations; and it declared that the Jewish people cannot be accused of the death of Jesus, closing an accusation that had fed persecution for centuries.",
              "That council is a good reminder of something that runs through this whole history: religions aren't frozen blocks. They change, argue, correct themselves and sometimes take things back, and those changes are decided in particular meetings, with names, dates and votes.",
            ],
            dato: "Fun fact: our word «symbol» also comes from those first councils. The creed was called symbolon in Greek: a password, the sign by which the Christians of one community recognized those of another as their own.",
          },
        ],
      },
      "mahoma-islam": {
        titulo: "Muhammad and Islam",
        fecha: "610–632",
        cuerpo: [
          "At the beginning of the 7th century, Arabia was a mosaic of tribes fighting over water, livestock and honor, with blood feuds that lasted generations. Mecca was a city of merchants and a sanctuary with dozens of idols, which also made it a good pilgrimage business.",
          "Around the age of forty, in a cave on Mount Hira where he withdrew to meditate, he had the experience that changed everything: he says he received the command to recite. He went home terrified, afraid he was ill, and it was his wife Khadija — a widowed merchant, fifteen years his senior and his former employer — who calmed him and became the first believer.",
          "His message was simple and explosive: there is only one God, all human beings are equal before Him, you must give of what's yours to the poor, the orphans and the widows, and there will be a judgment. In Mecca that attacked the idols, the business they generated and the tribal order all at once.",
          "He was persecuted, his clan was boycotted and his followers were mistreated, until in 622 he emigrated with his community to Medina. That emigration, the Hijra, marks year 1 of the Islamic calendar, and it's significant that Islam doesn't start counting from the prophet's birth or from the revelation, but from the moment the community is born.",
          "In Medina he was preacher, judge, lawmaker and military leader. He drew up a pact binding emigrants, Medinans and Jewish tribes into one community; he waged wars against Mecca; and in 630 he entered it with practically no bloodshed, destroyed the idols of the Kaaba and pardoned almost all his enemies.",
          "He died in 632 having turned a set of rival tribes into a community with one faith, one law and a shared project. A century later, his successors governed from India to Spain.",
        ],
        dato: "Fun fact: in his last sermon he left a line still quoted across the Muslim world: all humanity comes from Adam and Eve, and no Arab is superior to a non-Arab, nor a white man to a black man. His first muezzin, the voice that called to prayer, was Bilal, a freed Abyssinian slave.",
        extras: [
          {
            titulo: "The five pillars and the Quran",
            cuerpo: [
              "Islam is a religion with no clergy, no sacraments and no intermediaries: any believer addresses God directly. What it has is a very well defined practice, summed up in five obligations.",
              "THE PROFESSION OF FAITH (shahada). It's enough to declare sincerely that there is no god but God and that Muhammad is his messenger. That's all it takes to be a Muslim: no baptism, no initiation, no authority to authorize it.",
              "PRAYER (salat). Five times a day, at moments set by the position of the sun, facing Mecca. Five daily pauses that structure the whole day and are performed the same way in Jakarta, in Cairo or in Detroit.",
              "ALMSGIVING (zakat). It isn't voluntary charity, it's an obligation: around 2.5% of accumulated wealth each year, going to the poor, the indebted, travelers and the needy. It is, in effect, a redistributive religious tax.",
              "THE FAST OF RAMADAN. A whole month without eating, drinking, smoking or having sexual relations from dawn to sunset, with exemptions for the sick, pregnant women, children and travelers. Its declared purpose is double: discipline, and experiencing in your own body what hunger is.",
              "THE PILGRIMAGE (hajj). Once in a lifetime, whoever can, goes to Mecca. Everyone dresses in the same seamless white cloth, with no sign of wealth or origin, and performs the same rites. It's the largest annual gathering of human beings on the planet: some two million people over a few days.",
              "AND THE QURAN. It isn't exactly the equivalent of the Bible: for a Muslim it's the literal word of God, dictated in Arabic, not the telling of a sacred history written by human authors. Several consequences follow: it's memorized (there are millions of people who know the whole of it), it's recited aloud with a very carefully tended musicality, and a translation is considered an aid, never the Quran itself.",
              "Alongside the Quran is the sunna, the example of the prophet's life gathered in the hadith, and out of the combination of the two came sharia, a body of law with several schools of interpretation that disagree with each other; it isn't a single, uniform code, and its application varies enormously from one country to another.",
            ],
            dato: "Fun fact: only around 20% of the world's Muslims are Arabs. The country with the most Muslims is Indonesia, and there are more in India or in Pakistan than in the whole of the Near East.",
          },
          {
            titulo: "The Sufis: the way of love",
            cuerpo: [
              "Within Islam there's a current that surprises a lot of people: Sufism, its mystical dimension. It isn't a separate branch like the Sunnis and the Shias, but a way of living the religion that runs through both.",
              "Its starting point is that keeping the law isn't enough: what's sought is a direct experience of God, here and now, and the road to that is love and letting go of your own ego.",
              "Its methods are distinctive: the rhythmic repetition of the names of God, music, poetry and, in some brotherhoods, dance. Turkey's famous whirling dervishes spin on the spot with one hand toward the sky and the other toward the earth, in a choreography that stands for receiving and passing on.",
              "And it produced an extraordinary literature. Rumi, a 13th-century Persian poet, wrote thousands of verses about divine and human love; Al-Ghazali reconciled philosophy and faith; Ibn Arabi, from al-Andalus, wrote that his heart had become capable of every form: monastery, temple, synagogue and Kaaba.",
              "Sufism was also the great engine of Islam's expansion in West Africa, India, Anatolia and Indonesia, far more than the armies were: it arrived with teachers, poems, hospitals and music, and it coupled itself onto the local devotions.",
              "And today it's also a target. Fundamentalist movements consider it a deviation — for its veneration of saints and tombs, for the music, for the participation of women — and they have attacked and destroyed Sufi shrines in Mali, Pakistan, Libya and Egypt. The most tolerant and poetic version of Islam is one of the most persecuted by the most rigid.",
            ],
            dato: "Fun fact: Rumi, a 13th-century Muslim mystic, has for years been one of the best-selling poets in the United States. Millions of people read and quote his verses about love without knowing they're reading Islamic theology.",
          },
        ],
      },
    },
  },

  // ── Cuando una fe se divide ────────────────────────────────────────────
  "fe-se-divide": {
    titulo: "When a faith divides",
    anio: "632–1517",
    momentos: {
      "sunies-chiies": {
        titulo: "Sunnis and Shias",
        fecha: "From 632",
        cuerpo: [
          "When Muhammad died in the year 632 he left a united community and an enormous unresolved problem: he hadn't said clearly who should lead it.",
          "One group held that the new leader should be chosen from among the most capable and respected believers, and chose Abu Bakr, his friend and father-in-law. From that position came the Sunnis, who today are between 85 and 90% of Muslims; their name comes from sunna, the tradition of the prophet.",
          "Another group held that the leadership should stay in his family and backed Ali, his cousin, son-in-law and one of his first followers. That's where the Shias come from: shiat Ali means «the party of Ali».",
          "Ali did become caliph years later and was murdered. And then came the event that turned a political dispute into a deep religious identity: in the year 680, at Karbala, his son Husayn, the prophet's grandson, faced an immensely larger army with a handful of companions and was massacred along with almost all his family.",
          "That episode is, for Shiism, what the crucifixion is for Christianity: the suffering of the innocent turned into the emotional center of the faith. Every year, at Ashura, millions of people commemorate it with processions, sacred theater, public weeping and, in some places, self-flagellation.",
          "In time, the differences became structural. The Shias developed a hierarchy of religious leaders with authority to interpret — the imams and, today, the ayatollahs — whereas Sunni Islam has no hierarchical clergy, only scholars and jurists. The Shias also believe that the twelfth imam didn't die but is hidden and will return.",
          "And today the division weighs on world politics: Iran has been the great Shia power since Persia converted in the 16th century, Saudi Arabia leads the Sunni bloc, and many Near Eastern conflicts are explained as much by that geopolitical rivalry as by religion.",
          "It's important to state the obvious, because it gets forgotten: they share the same Quran, the same God, the same prophet, the same five pillars and they pray facing the same place. And the great terrorist groups that have come out of extremist Sunni interpretations are rejected and condemned by the vast majority of the world's Sunni Muslims.",
        ],
        dato: "Fun fact: Sufism, the mystical current, runs through both branches and has for centuries been a bridge between them. Many saints and poets are venerated by Sunnis and Shias alike.",
      },
      "gran-cisma": {
        titulo: "The Great Schism",
        fecha: "1054",
        cuerpo: [
          "The churches of Rome and of Constantinople had been drifting apart for centuries without meaning to. It wasn't a divorce, it was a drift.",
          "They spoke different languages — Latin in the West, Greek in the East — which meant they argued about the same texts without quite understanding each other. They lived in opposite political worlds: in the East there was a powerful emperor and the Church was part of the state; in the West the empire had disappeared and the pope had filled that vacuum, politically as well.",
          "And they had two underlying arguments. One theological: the West had added an expression to the creed — the Filioque — without consulting the East, and for the Easterners that meant tampering with a text agreed in council. And one about power: the pope claimed authority over the whole Church; the patriarch of Constantinople considered him, at most, the first among equals.",
          "In 1054, in the middle of a negotiation that went from bad to worse, the pope's envoys and the patriarch excommunicated each other. At the time it looked like one more diplomatic incident.",
          "What made the break final was something later and shameful: in 1204, the Western crusaders on their way to the Holy Land sacked Constantinople for three days, desecrated Hagia Sophia and carried off its relics and its works of art. After that, reconciliation became emotionally impossible.",
          "Since then there have been two great branches: the Catholic Church, with the pope as supreme authority, and the Orthodox Churches, some fifteen independent national churches that share faith and liturgy and don't recognize the pope's authority. They number some 220 million people, above all in Russia, Greece, the Balkans, Ukraine, Romania, Georgia, Ethiopia and the Near East.",
        ],
        dato: "Fun fact: those excommunications were technically in force for 911 years. They were lifted in 1965, when Pope Paul VI and Patriarch Athenagoras jointly annulled them and embraced in public.",
        extras: [
          {
            titulo: "Images: the war that defined Christian art",
            cuerpo: [
              "There's a religious fight that doesn't usually get told and that explains why Eastern and Western Christian art are so different: iconoclasm.",
              "The problem was serious. The Bible forbids making images and worshipping them, and yet the churches had filled up with figures of Christ, of Mary and of the saints. Was that an aid to devotion or idolatry in disguise?",
              "In the year 726 the Byzantine emperor decided it was idolatry and ordered them destroyed. For more than a century, on and off, mosaics were chipped away, panels were burned and those who defended them — many of them monks — were persecuted, tortured and mutilated. It was a cultural civil war.",
              "The defenders of images finally won in the year 843, with a fine theological argument: if God himself became a man and had a particular face, then that face can be painted; denying it would be denying that he truly took flesh.",
              "Out of that comes the Orthodox icon as we know it, with its strict rules: it isn't a decorative picture or a realistic portrait, it's a sacred «window», painted following fixed models, with no perspective and no shadows, unsigned, and you pray in front of it and kiss it. Freestanding sculpture, by contrast, almost disappears in the East, while in the West it flourishes all the way to Michelangelo and the Baroque carvings.",
              "And the debate wasn't closed for good. It came back with enormous violence in the 16th century, when the most radical Protestants went into the churches of the Netherlands, Switzerland and Scotland and destroyed images, altarpieces and stained glass by the thousand. That's why a Calvinist church is bare and a Catholic one from the same period is full of gold: it isn't a matter of taste, it's a twelve-hundred-year theological argument.",
              "In Islam the same question was settled another way: no figures, and with calligraphy and geometry turned into the religious art par excellence.",
            ],
            dato: "Fun fact: the original iconoclast was an emperor, and the word has ended up meaning the opposite of what it was: today we call someone an «iconoclast» when they break with established conventions. It started out as the name for someone who smashed pictures on the orders of those in power.",
          },
        ],
      },
      "reforma-protestante": {
        titulo: "The Protestant Reformation",
        fecha: "1517",
        cuerpo: [
          "In 1517, a German friar and professor of theology, Martin Luther, made public 95 theses for debate. The immediate motive was scandalous: indulgences were being sold — documents that promised to reduce the punishment for sins — to fund the building of St Peter's in the Vatican, with preachers who went so far as to claim that the moment the coin rang in the chest a soul left purgatory.",
          "Luther wasn't trying to found a church; he was trying to argue. But his theses were printed, translated and circulating across Germany within weeks. It was the first viral phenomenon in history, and without the printing press — invented barely seventy years earlier — it would have ended like earlier protests: on a bonfire and in silence.",
          "His three central ideas dismantled the system. Salvation is received by faith and isn't bought with works or with money. The only authority is the Bible, not tradition and not the pope. And every believer is their own priest, meaning they need no intermediaries to address God.",
          "To make that possible he did something decisive: he translated the Bible into German, so that anyone could read it. And there lies the Reformation's most lasting cultural effect: if each person has to read the Scriptures for themselves, everyone has to be taught to read. Protestant countries reached far higher literacy rates for centuries, including among women.",
          "It spread so fast because it fitted very earthly interests: the German princes gained independence from the emperor and the pope — and along the way kept the Church's lands — and the commercial cities looked kindly on a religion less ritual and more centered on work and individual conscience.",
          "The result was a permanent fracture: Lutherans; Calvinists, who organized Geneva as an extremely severe religious republic; Anglicans, when Henry VIII broke with Rome over a matter of divorce and declared himself head of the Church of England; and radical groups like the Anabaptists, persecuted by every side.",
        ],
        dato: "Fun fact: the story of Luther hammering the theses onto the church door in Wittenberg may be a later legend. What is on record is that he sent them by letter to his archbishop. The people who turned it into a movement were the printers.",
        extras: [
          {
            titulo: "The price of division: wars, witches and — in the end — tolerance",
            cuerpo: [
              "What came after 1517 was a century and a half of religious violence, and it's worth telling because out of it, through sheer exhaustion, comes one of the most valuable ideas we have.",
              "THE WARS. Peasant wars in Germany; civil wars in France, with the St Bartholomew's Day massacre in 1572, in which thousands of Protestants were killed in Paris within a few days; the revolt of the Netherlands; the English civil war. And above all the Thirty Years' War (1618–1648), which laid Germany waste and cost some regions a third of their population. It started out religious and ended up a power struggle between states, with Catholic France fighting on the Protestant side out of political convenience.",
              "THE WITCHES. In those same centuries, and above all between 1560 and 1630, some forty or fifty thousand people accused of witchcraft were executed in Europe, the great majority of them women — many poor, widowed, elderly or simply inconvenient to their neighbors. And here's an uncomfortable fact: it wasn't only a matter of the Catholic Inquisition — in fact, the Spanish Inquisition was relatively skeptical about witchcraft accusations — the greatest waves happened in civil courts and in regions with strong competition between Catholics and Protestants. The witch hunt was far more intense in fractured Europe than in homogeneous Europe.",
              "THE WAY OUT. The Peace of Westphalia, in 1648, didn't settle who was right: it gave up on settling it. It was accepted that there were territories of one confession and of the other, that the neighbor wasn't going to be converted by force and that states should deal with each other regardless of faith. Two things are born from that: the modern sovereign state and the principle that religion can't be grounds for war between nations.",
              "A century later, the Enlightenment turned that practical truce into a principle: freedom of conscience. And in 1948 it ended up written down as a human right: everyone has the right to freedom of thought, conscience and religion, and to change religion or to have none.",
              "It's one of those lessons history teaches the hard way: religious tolerance in Europe didn't arrive because someone turned good, it arrived when it became clear that the alternative was killing each other for generations without convincing anyone.",
            ],
            dato: "Fun fact: the sociologist Max Weber was struck by the fact that Protestant areas industrialized earlier, and he explained it by an ethic of work, saving and a professional calling understood as service to God. His thesis is still argued about, but it gave its name to the popular idea of the «Protestant work ethic».",
          },
        ],
      },
      sijismo: {
        titulo: "Sikhism",
        fecha: "From 1499",
        cuerpo: [
          "In the Punjab, in northern India, Hinduism, with its castes and its rituals, lived alongside Islam, which had been governing the region for centuries, at the end of the 15th century. A man named Nanak came out of there with one line that sums it all up: there is no Hindu and no Muslim, there are only human beings.",
          "His teaching took from and rejected both sides. It accepted one God, without form and without image, present in everything. It rejected the caste system, the idols, extreme fasting, obligatory pilgrimages, a professional clergy and the idea that a ritual can stand in for conduct.",
          "And his morality is astonishingly concrete and hardly mystical at all: work honestly, remember God and share what you have. You don't have to withdraw from the world or give up your family: you have to be decent inside ordinary life.",
          "Nanak was followed by nine more gurus, and the tenth did something unheard of: he declared there would be no eleventh human guru and that the eternal teacher of the Sikhs would be the BOOK. The Guru Granth Sahib has been treated ever since as a living person — it's fanned, put to bed, woken up — and the most remarkable thing is its content: it includes poems by Hindu and Muslim authors alongside those of the Sikh gurus. It's probably the only sacred scripture in the world that deliberately incorporates voices from other religions.",
          "Its most impressive institution is the langar: every Sikh temple has a communal kitchen where free food is served to anyone, with no questions about religion, caste or circumstances, and everyone sits on the floor at the same level. In a country with castes, eating together seated as equals was a political statement. The Golden Temple at Amritsar serves on the order of a hundred thousand free meals a day, every day.",
          "Its history has a great deal of blood in it: two gurus were executed by the Mughal emperors, and one of them, Tegh Bahadur, died defending the right of HINDUS to practice their religion, not his own. In 1699 the community of the initiated was founded, with its five symbols — among them uncut hair under the turban and a small dagger — and the commitment to defend the oppressed of any faith.",
          "Today they number between twenty-five and thirty million people, the fifth organized religion in the world, and their most recognizable trait is still service: when there's a disaster in India or in any country with a Sikh community, their field kitchens tend to be among the first to arrive.",
        ],
        dato: "Fun fact: after the 9/11 attacks, many Sikhs in the United States and Europe were assaulted because their turbans and beards were confused with the image of Islamist terrorism. Members of a religion founded precisely to get past the division between religions were attacked because of a confusion between religions.",
      },
    },
  },

  // ── Un mundo, muchas creencias ─────────────────────────────────────────
  "mundo-muchas-creencias": {
    titulo: "One world, many beliefs",
    anio: "16th century – today",
    momentos: {
      "expansion-religiones": {
        titulo: "The spread of the great religions",
        fecha: "16th–21st centuries",
        cuerpo: [
          "From the end of the 15th century on, with the great ocean voyages, religions stopped being tied to their region of origin. And the way they traveled determined what happened next.",
          "CHRISTIANITY traveled with the empires. In the Americas, Africa and Oceania, evangelization was almost always part of the conquest or of colonization: mass baptisms, destruction of local temples and images, bans on rituals. And at the same time it produced things that contradict each other: schools, hospitals, the first written grammar of dozens of indigenous languages — the missionaries who studied them in order to preach are today the main source of knowledge about those languages — and also the voices that denounced the exploitation from the inside, like Bartolomé de las Casas.",
          "ISLAM traveled above all with trade and with Sufi teachers, and that explains a surprising fact: the two countries with the most Muslims in the world — Indonesia and India — were never conquered by Arab armies. It arrived with merchants, marriages and brotherhoods, and that's why it mixed so much with local customs.",
          "BUDDHISM had already been spreading across Asia for centuries and, from the 19th century on, entered the West by an unexpected route: books. Philosophers, orientalists and then Japanese and Tibetan teachers introduced it in Europe and the United States as a philosophy and as a meditation practice more than as a religion.",
          "HINDUISM moved with people: first with the workers taken by the British Empire to the Caribbean, East Africa and Fiji, and then with the skilled emigration of the 20th century to the United Kingdom, the United States and Canada.",
          "And everywhere the same thing happened that had always happened: mixing. Hardly any religion completely replaced the previous one; it layered on top. Old festivals with a new name, saints who take the place of local deities, calendars that fit into each other. It's what anthropologists call syncretism, and it isn't an anomaly: it's the normal way religions have moved throughout history.",
        ],
        dato: "Fun fact: there are more Christians in Africa today than in Europe, and the country with the most evangelical Protestants in the world after the United States is Brazil. The religious map of the planet has turned over within a century.",
      },
      "mundo-conectado": {
        titulo: "A connected world",
        fecha: "20th–21st centuries",
        cuerpo: [
          "For almost the whole of history, a person's religion was decided by where they were born. Today, for the first time, an enormous part of humanity can compare, choose, mix or reject. And that changes everything.",
          "The first engine was migration: in the 20th century, tens of millions of people moved continent, and their beliefs went with them. Today there are mosques in London, Hindu temples in Toronto, Buddhist monasteries in California and synagogues in Buenos Aires, and in any large city all of that lives alongside neighbors who believe in nothing.",
          "The second has been the internet, with two opposite and simultaneous effects. On one hand, access to religious knowledge that not even specialists had thirty years ago: translated sacred texts, classes, communities at a distance, guided prayer and meditation, broadcast ceremonies. On the other, the possibility of shutting yourself into a bubble where only one version is heard, and the appearance of preachers with millions of followers and no institution controlling them.",
          "The way of believing has changed too, not only the way of stopping. A great many people build their own combination: meditation of Buddhist origin, Hindu yoga, their family's Christmas, a bit of astrology, ideas from several traditions. Sociologists call it «à la carte» religiosity, and it's now one of the most widespread forms of spirituality in the West.",
          "And something has happened that many people didn't expect. In the 20th century it was almost taken for granted that modernity would make religion disappear. It hasn't: it has transformed, and in many places it has gained strength precisely as a political IDENTITY. Hindu nationalism in India, political evangelicalism in the Americas, Islamism, the Russian Orthodox Church aligned with the Kremlin or national Catholicism are phenomena of the 21st century, not leftovers from the past.",
        ],
        dato: "Fun fact: in 1893 the first World's Parliament of Religions was held in Chicago, and it was the first time in history that representatives of Hinduism, Buddhism, Jainism, Islam, Judaism and several Christian churches sat on the same platform to explain themselves in front of an audience. Until then, each religion had almost always talked about the others without them in the room.",
      },
      secularizacion: {
        titulo: "The religious world today",
        fecha: "20th–21st centuries",
        cuerpo: [
          "If we sort humanity today by belief, the map comes out roughly like this: some 2.4 billion Christians (around 31%), some 1.9 billion Muslims (25%), some 1.2 billion people with no religious affiliation (16%), some 1.2 billion Hindus (15%), some 500 million Buddhists (7%), several hundred million practitioners of folk and traditional religions, and some 15 million Jews.",
          "And it's worth being precise about what that unaffiliated group is, because they aren't all militant atheists. It includes atheists, agnostics, people who believe in something undefined, and a great many people who have simply stopped practicing and stopped identifying with their family's religion without ever having taken a formal decision.",
          "Why has it happened? Several mutually reinforcing causes are pointed to. Science has gradually occupied the explanatory ground that used to be religious: nobody prays today to find out why it rains. The state has taken on functions the Church used to perform: school, hospital, registering births, help for the needy. Urbanization broke the social control of the small village, where not going to Mass got noticed. And there's a very consistent correlation that's highly revealing: the more materially secure a country is — health care, pensions, employment, low infant mortality — the less religious its population. Where life is more fragile, religion is stronger.",
          "But it's best not to confuse Europe with the world. Secularization is intense in western Europe, Japan, Korea, Canada, Australia and among the urban classes of many countries; and at the same time the planet as a whole is becoming MORE religious, simply through demography: the most believing populations are the ones growing fastest. Projections suggest that by mid-century there will be more Muslims than ever, more Christians than ever and a percentage of «no religion» that has stalled or is falling — not because people are believing again, but because they're having fewer children.",
          "And something else has appeared: spirituality without religion. Meditation, mindfulness, yoga, retreats, ayahuasca, astrology, self-knowledge, therapies that talk about meaning and purpose. Many of those practices come straight out of religious traditions and are used today without their framework of belief. The need hasn't disappeared; it has moved.",
          "And there's still unfinished business: religious freedom. Article 18 of the Universal Declaration of Human Rights recognizes the right to believe, to change religion and to have none. In a significant part of the world, exercising that right — converting, ceasing to believe, criticizing the majority religion — still costs people their job, their freedom or their life.",
        ],
        dato: "Fun fact: in several countries, «no religion» is now the largest box among the under-thirties, while in others youth religiosity is growing. It's probably the first moment in history in which two parts of the world are going in opposite religious directions at the same time.",
      },
      viaje: {
        titulo: "A journey of thousands of years",
        cuerpo: [
          "Tens of thousands of years ago, a small group of hunters watched a storm and thought some spirit lived in the sky. They knew nothing of science or of writing, but they were already asking questions that are still with us today.",
          "In time came the villages, the first cities and the temples. Gods with names of their own were born, and priests, deified kings and great mythologies. Later came prophets and sages who began asking about good, evil, suffering and the meaning of life. Religions appeared that united whole peoples and others that aspired to bring their message to all humanity.",
          "The religions changed, split, influenced each other and traveled all over the planet. Some disappeared; others still gather billions of people. And all of them, looking back, have done two things at once: they have consoled, organized, healed, taught people to read, built hospitals and held people up in their worst moment… and they have served to justify wars, burnings, castes, conquests and silences.",
          "And there's something this journey makes clear: none of these traditions came out of nothing. All of them inherited, borrowed, argued with their neighbors and transformed. The Mesopotamian flood is in the Bible, the Egyptian judgment anticipates the judgment of the soul, the Persian heaven and hell are in three religions, Greek philosophy gives shape to Christian theology, and the mindfulness in your phone app comes from a monk in the Ganges valley.",
          "Beyond their differences, all of them were born of the same profoundly human impulse: the need to understand the world, not to be alone in it and to find a meaning in it.",
          "Perhaps that's the greatest lesson of this journey. The answers have been very different, but the questions are still the same:",
          "Where do we come from?",
          "Why does the world exist?",
          "What happens after death?",
          "How should we live?",
          "And although every religion has answered in a different way, the search for those answers goes on keeping humanity company right up to the present day. That includes anyone who believes in none of them: the questions don't leave with the faith.",
        ],
      },
    },
  },
};
