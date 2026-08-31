// ─────────────────────────────────────────────────────────────────────────
// HISTORIA DE LA CIENCIA, EN INGLÉS · solo el texto.
//
// Emparejado por la `key` de la era y la `key` del momento con
// `culturaHistoriaCiencia.ts`. El orden, las claves y las fotos salen SIEMPRE
// del español; lo que falte aquí se lee en español (ver `culturaHistorias.en.ts`).
//
// CONVENIOS (los mismos en las seis Historias):
//   · «a. C.» → BC   ·  «d. C.» → AD   ·  «s. IV a. C.» → 4th c. BC
//   · La coma decimal pasa a punto y el punto de los miles a coma (40.075 →
//     40,075). El % va pegado al número, como en inglés.
//   · «Dato curioso:» → «Fun fact:»   ·  el segundo, «Fun fact II:».
//   · Los nombres y términos con su grafía inglesa de siempre (Alhazen,
//     Avicenna, Copernicus, Lavoisier…), no una retraducción del español.
//   · Voz de María: segunda persona, contracciones naturales, frases cortas.
// ─────────────────────────────────────────────────────────────────────────
import type { HistoriaTexto } from "./culturaHistorias.en";

export const HISTORIA_CIENCIA_EN: HistoriaTexto = {
  // ── Prólogo ────────────────────────────────────────────────────────────
  prologo: {
    titulo: "What is science?",
    anio: "Before the journey begins",
    momentos: {
      "que-es-ciencia": {
        titulo: "What is science?",
        fecha: "The great tool",
        cuerpo: [
          "Science isn't a list of truths, it's a method for looking for them. Its starting point is curiosity: looking at the world and wondering why things happen the way they do.",
          "What makes it special is that it doesn't settle for an explanation just because it's beautiful or old. It demands that you check it. A scientific idea has to be testable and, if reality contradicts it, it has to be dropped.",
          "That's why science moves forward. It isn't trying to be right forever, it's trying to get closer and closer to the truth by correcting its own mistakes.",
          "Understanding the world stopped being the business of gods and priests and became something anyone, with method and honesty, could attempt.",
        ],
        dato: "Fun fact: the word «science» comes from the Latin scientia, which simply means «knowledge». But not just any knowledge: the kind you can check.",
      },
      "como-se-sabe": {
        titulo: "The method: ask and check",
        fecha: "How anything gets known",
        cuerpo: [
          "When somebody claims something is true, how can we know whether it is?",
          "The heart of science is the scientific method, an orderly way of looking for truth. First you observe something, then you propose an explanation (a hypothesis), then you design an experiment and finally you check the result.",
          "The essential part is that anyone can repeat that experiment and get the same thing. Truth stops depending on who says it and starts depending on the evidence.",
          "Thanks to this method, an ordinary person can correct the greatest authority in the world, as long as reality is on their side.",
          "It's such a powerful tool that it has transformed human life more in four centuries than in the hundred thousand years before.",
        ],
      },
      "ciencia-se-corrige": {
        titulo: "The science that corrects itself",
        fecha: "Doubt as the engine",
        cuerpo: [
          "A lot of people think science is weak because it «changes its mind». That's actually its greatest strength: it's the only kind of knowledge that corrects itself.",
          "No scientific theory is considered final. It's the best explanation we have until evidence turns up that improves on it or replaces it. Doubt isn't a fault, it's the engine.",
          "That's why science progresses while other kinds of knowledge stall, repeating what the ancients said. It isn't afraid to admit it was wrong.",
          "Learning science is also learning an attitude to life: looking with curiosity, doubting honestly and changing your mind when the evidence demands it.",
        ],
        dato: "Fun fact: scientists value an experiment that refutes a theory just as much as one that confirms it. Finding out we were wrong is progress too.",
      },
    },
  },

  // ── Antes de la ciencia ────────────────────────────────────────────────
  "antes-ciencia": {
    titulo: "Before science",
    anio: "Prehistory – antiquity",
    momentos: {
      "fuego-herramientas": {
        titulo: "Fire and tools",
        fecha: "Prehistory",
        cuerpo: [
          "Long before writing, our ancestors managed something decisive: controlling fire. With it they could cook, keep warm, protect themselves and stretch the day beyond the light of the sun.",
          "They also learned to knap stone, to make spears, needles and axes, and later to work metals. Every tool was the fruit of observing, trying and improving over generations.",
          "They didn't call it science or technology, but they were already doing the essential thing: transforming nature using what they'd learned from it.",
          "In those patient gestures beats the same impulse that millions of years later would drive the great scientists: understanding the world in order to live better in it.",
        ],
        dato: "Fun fact: cooking food made it possible to get far more energy out of it. Some researchers think that was key to our brains being able to grow so much.",
      },
    },
  },

  // ── Grecia: la razón mira la naturaleza ────────────────────────────────
  "grecia-ciencia": {
    titulo: "Greece: reason looks at nature",
    anio: "6th – 3rd centuries BC",
    momentos: {
      "tales-presocraticos": {
        titulo: "Thales and the pre-Socratics",
        fecha: "≈6th century BC",
        cuerpo: [
          "Thales of Miletus is usually considered the first scientist and philosopher of the West. His great merit wasn't being right, it was changing the question: instead of «which god did it?», he asked «what natural cause produces it?».",
          "He and other thinkers, the pre-Socratics, went looking for the element everything might be made of: water, air, fire. One of them, Democritus, imagined matter was made of tiny indivisible particles, atoms.",
          "They were wrong on the details, but they were the first to trust that the universe follows understandable rules.",
          "With them, explaining the world stopped being a job for priests and became an adventure open to human reason.",
        ],
        dato: "Fun fact: the word «atom» comes from Greek and means «that can't be cut». More than two thousand years later, science recovered Democritus's intuition.",
      },
      "pitagoras-numeros": {
        titulo: "Pythagoras and numbers",
        fecha: "≈570–495 BC",
        cuerpo: [
          "Pythagoras and his followers discovered that behind music, geometry and the movement of the stars there were exact numerical proportions.",
          "From that they drew a dazzling idea: that the order of the universe could be expressed with mathematics. The cosmos wasn't chaos, it was measurable harmony.",
          "That intuition would become one of the foundations of all science: nature is better described with numbers than with words.",
          "Centuries later, Galileo would say the book of nature is written in the language of mathematics. The Pythagoreans sensed it first.",
        ],
        dato: "Fun fact: the Pythagoreans discovered that musical notes that sound good together follow very simple mathematical proportions. Science and beauty shook hands.",
      },
      "aristoteles-ciencia": {
        titulo: "Aristotle",
        fecha: "384–322 BC",
        cuerpo: [
          "Aristotle was antiquity's great observer. He took an interest in practically everything: animals, plants, motion, the sky, logic and politics.",
          "He argued that knowledge had to start with careful observation of reality, and he classified hundreds of living things in detail that still amazes today. That's why many consider him the first great naturalist.",
          "He also got important things wrong, like believing heavy objects fall faster than light ones, a mistake that would take almost two thousand years to correct.",
          "His enormous prestige pushed science forward, but it also held it back: for centuries he was respected so much that hardly anyone dared check whether he was right.",
        ],
        dato: "Fun fact: throughout the Middle Ages Aristotle was called simply «the Philosopher», as though no greater one could exist.",
      },
      euclides: {
        titulo: "Euclid",
        fecha: "≈300 BC",
        cuerpo: [
          "Euclid, in the city of Alexandria, gathered and ordered all the geometry of his time into a work called the Elements.",
          "His genius was the method: he started from a few self-evident truths and, from them, proved hundreds of theorems step by step, leaving nothing to chance.",
          "He taught humanity to reason rigorously, chaining secure conclusions together. That way of thinking would inspire not just mathematicians but the whole of science.",
          "The Elements were studied for more than two thousand years. Few books have educated the minds of so many generations.",
        ],
        dato: "Fun fact: Euclid's Elements is said to be, after the Bible, one of the most edited and most studied books in all of history.",
      },
      arquimedes: {
        titulo: "Archimedes",
        fecha: "≈287–212 BC",
        cuerpo: [
          "Archimedes was antiquity's greatest scientific genius: mathematician, physicist and engineer. He discovered fundamental laws about levers, floating bodies and volumes.",
          "He worked out why bodies float and calculated areas and volumes with methods that anticipated modern mathematics. He also invented ingenious machines for war and for irrigation.",
          "Legend says he solved a problem while taking a bath and ran naked through the street shouting «Eureka!» («I've found it!»).",
          "He combined theory and practice like nobody else: he thought big and he built things too. He was, in many senses, the first great physicist in history.",
        ],
        dato: "Fun fact: Archimedes is said to have declared, «Give me a place to stand and I will move the world», to explain the power of the lever.",
      },
      eratostenes: {
        titulo: "Eratosthenes measures the Earth",
        fecha: "≈240 BC",
        cuerpo: [
          "Eratosthenes, the librarian of Alexandria, did something incredible: he calculated the size of the Earth using only the shadow of a stick, a bit of geometry and a lot of intelligence.",
          "He knew that on one particular day the sun fell completely vertical in a southern city while in Alexandria it cast a shadow. By measuring that angle and the distance between the two cities, he deduced the circumference of the planet.",
          "His result was astonishingly close to the real value — more than two thousand two hundred years ago and without leaving a library!",
          "It was one of the most elegant demonstrations in history that reason and measurement can reach what looks impossible.",
        ],
        dato: "Fun fact: thanks to calculations like Eratosthenes's, educated people in antiquity already knew the Earth was round. The «flat world» idea is a later myth.",
        extras: [
          {
            titulo: "How to measure a planet with a shadow",
            cuerpo: [
              "This calculation is worth understanding in full, because it's the best example in this whole story of what thinking scientifically means: one tiny observation, an idea and a bit of geometry, and out of it comes the size of the world.",
              "WHAT HE KNEW. He'd been told that in Syene (today's Aswan, in southern Egypt), at noon on the summer solstice, the sun fell so vertically that there was no shadow: you could see the bottom of the wells fully lit and a column cast nothing at all.",
              "WHAT HE MEASURED. On that same day and at that same hour, in Alexandria — a good way further north — an obelisk DID cast a shadow. He measured the angle between the obelisk and the tip of its shadow and got, in our units, a little over 7 degrees.",
              "THE IDEA. If the Earth were flat, the sun would fall at the same angle in both cities and both would have the same shadow. That one has a shadow and the other doesn't means the surface is curved. And since the sun is so far away that its rays arrive practically parallel, that 7-degree angle isn't the sun's: it's the angle of the curvature itself between the two cities.",
              "THE ARITHMETIC. 7 degrees is roughly a fiftieth of a full circle (7 x 50 = 350, close to 360). So the distance between Syene and Alexandria had to be, more or less, a fiftieth of the way around the world.",
              "THE LAST FIGURE. He still needed that distance, and here's the most human detail of the story: it was supplied by the «bematists», men whose job was to walk counting their own paces to measure routes. It came to about 5,000 stadia.",
              "THE RESULT. 5,000 stadia x 50 = 250,000 stadia for the Earth's circumference. Depending on exactly how long his stadium was — there are several versions, which is why you can't be categorical — the error would be somewhere between 1% and 16% off the real 40,075 km. With a shadow, an angle, some men counting paces and an idea.",
              "AND AN ENORMOUS HISTORICAL CONSEQUENCE. That figure sat there, stored away, for centuries. And when Columbus argued he could reach Asia by sailing west, he used figures for the size of the Earth much SMALLER than Eratosthenes's, because they suited him — they made the voyage look short. The experts telling him he was wrong were right: if there hadn't been a continent in the way, his expedition would have died of thirst. A librarian from the 3rd century BC knew the size of the world better than the man who crossed it seventeen hundred years later.",
            ],
            dato: "Fun fact: Eratosthenes also calculated the tilt of the Earth's axis, compiled a star catalogue, drew up a calendar with leap years, drew one of the first world maps with meridians and parallels, and invented a method for finding prime numbers that's still taught in schools: the sieve of Eratosthenes.",
          },
        ],
      },
    },
  },

  // ── La ciencia viaja por el mundo ──────────────────────────────────────
  "ciencia-mundo": {
    titulo: "Science travels the world",
    anio: "8th – 15th centuries",
    momentos: {
      "cero-india": {
        titulo: "Zero and numbers",
        fecha: "India, ≈5th–7th century",
        cuerpo: [
          "The number system we use today was born in India, with ten digits and, above all, with something revolutionary: zero as a number.",
          "It may seem obvious, but it wasn't. Zero made it possible to write any quantity, however enormous, and to calculate with an ease that was impossible with Roman numerals.",
          "This system travelled to the Islamic world and from there to Europe, where it became known as «Arabic numerals», although its origin was in India.",
          "Without zero there'd be no modern mathematics, no physics and no computers. All of today's technology rests, at bottom, on that idea of «nothing».",
        ],
        dato: "Fun fact: computers today run on nothing but zeros and ones. That Indian invention of zero is, literally, inside every device you use.",
      },
      "al-juarismi": {
        titulo: "Al-Khwarizmi and algebra",
        fecha: "≈780–850",
        cuerpo: [
          "Al-Khwarizmi was a scholar at the House of Wisdom in Baghdad, the great scientific centre of his day. He wrote a treatise that gave its name to a whole branch of mathematics: algebra.",
          "Algebra lets you solve problems using symbols and unknowns instead of specific numbers. It's an extremely powerful tool for describing relationships and solving equations.",
          "His works, translated into Latin, taught Europe to calculate with Indian numerals and to handle algebra.",
          "His influence was so great that his own name, in its Latinized form, gave rise to a word we use every day in computing and mathematics.",
        ],
        dato: "Fun fact: the word «algorithm» comes from Al-Khwarizmi's name. Every time a computer runs an algorithm, it unknowingly honours that scholar from Baghdad.",
      },
      alhacen: {
        titulo: "Alhazen and optics",
        fecha: "965–1040",
        cuerpo: [
          "Alhazen (Ibn al-Haytham) studied light and vision with unprecedented precision. He showed that we see because light bounces off objects and enters our eyes, and not the other way round, as was believed.",
          "But his greatest contribution was the method: he insisted that no idea should be accepted without checking it through careful, repeatable experiments.",
          "That's why many historians consider him one of the first champions of the scientific method, centuries before the European Scientific Revolution.",
          "With him, science took a decisive step: reasoning well isn't enough, you have to put ideas to the test against reality.",
        ],
        dato: "Fun fact: Alhazen wrote that anyone seeking truth should distrust even the great authorities and check everything for themselves. It's almost a definition of modern science.",
      },
      "china-inventos": {
        titulo: "China's great inventions",
        fecha: "2nd century BC – 15th century",
        cuerpo: [
          "While Europe was living through the Middle Ages, China was developing inventions that would transform the entire world: paper, printing, gunpowder and the compass.",
          "Paper and printing made it possible to store and spread knowledge; the compass made the great sea voyages possible; and gunpowder changed warfare forever.",
          "The Chinese also excelled in astronomy, medicine, hydraulic engineering and mathematics, centuries ahead in many fields.",
          "These inventions travelled westward little by little and set off enormous changes there. Science and technology were never the property of a single people.",
        ],
        dato: "Fun fact: paper, printing, gunpowder and the compass are considered the four Chinese inventions that were decisive for the birth of the modern world.",
      },
      "saber-no-se-pierde": {
        titulo: "Knowledge doesn't get lost",
        cuerpo: [
          "For centuries, knowledge passed from hand to hand and from language to language: from Greek to Arabic, from Arabic to Latin, from Latin into every language of Europe.",
          "Each civilization added something: the Greeks, reason; India, zero; the Islamic world, algebra and the experiment; China, technique.",
          "When all that accumulated learning finally came back to Europe, it met the printing press, new universities and a renewed curiosity.",
          "The greatest revolution in human thought was about to catch light.",
        ],
      },
    },
  },

  // ── La Revolución Científica ───────────────────────────────────────────
  "revolucion-cientifica": {
    titulo: "The Scientific Revolution",
    anio: "16th – 17th centuries",
    momentos: {
      copernico: {
        titulo: "Copernicus",
        fecha: "1473–1543",
        cuerpo: [
          "For more than a thousand years it had been believed that the Earth sat motionless at the centre of the universe and that everything turned around it. It seemed obvious: the sun «rises» and «sets» every day.",
          "Nicolaus Copernicus dared to propose the opposite: it's the Earth that goes around the sun, along with the other planets. His model explained the movements in the sky far better.",
          "The idea was so revolutionary that Copernicus waited almost until his death to publish it, fearing the backlash.",
          "With him the old picture of the cosmos began to wobble, and humanity took its first step down from the centre of the universe.",
        ],
        dato: "Fun fact: when we say something caused a «Copernican turn», we mean precisely this kind of change: an idea that completely overturns what was believed.",
      },
      galileo: {
        titulo: "Galileo Galilei",
        fecha: "1564–1642",
        cuerpo: [
          "Galileo was one of the first to use a telescope to observe the sky, and what he saw changed history: mountains on the Moon, moons orbiting Jupiter, thousands of new stars.",
          "All of it confirmed that the heavens weren't perfect and unchanging, and supported Copernicus's idea that the Earth wasn't the centre of everything.",
          "But his greatest contribution was the method: Galileo ran experiments and measured. He proved, against Aristotle, that all bodies fall at the same rate when there's no air to slow them.",
          "For maintaining that the Earth moved, he was tried and forced to recant. Even so, his way of joining observation, experiment and mathematics made him the father of modern physics.",
        ],
        dato: "Fun fact: legend says that after being forced to deny the Earth moved, Galileo muttered: «And yet it moves».",
      },
      kepler: {
        titulo: "Kepler",
        fecha: "1571–1630",
        cuerpo: [
          "It was believed that the heavenly bodies had to move in perfect circles, because the circle was considered the noblest shape. Johannes Kepler discovered it wasn't so.",
          "Studying thousands of very precise observations over years, he found that the planets go around the sun following ellipses, not circles, and that they move faster when they're closer to the sun.",
          "He boiled the movement of the planets down to a few exact mathematical laws, something never seen before.",
          "His work showed that the sky obeys precise rules we can discover, and it laid the ground for Newton's great synthesis.",
        ],
        dato: "Fun fact: Kepler took years to accept his own conclusions, because he found it hard to give up the beauty of the circle. Reality weighed more than habit.",
      },
      "nace-metodo": {
        titulo: "The scientific method is born",
        fecha: "Bacon and Descartes",
        cuerpo: [
          "Two thinkers gave shape to the new way of seeking truth. Francis Bacon argued that knowledge has to be born of observation and experiment, gathering data before drawing conclusions.",
          "René Descartes, by contrast, insisted on the power of reason and on doubting everything that wasn't absolutely certain. He proposed analysing every problem by breaking it into simpler parts.",
          "Together, their ideas gave science its great tool: observe, propose hypotheses, experiment and reason in order, without trusting mere authority.",
          "From then on, a claim was no longer worth anything because of who said it, but because of the evidence holding it up.",
        ],
        dato: "Fun fact: Descartes's line «I think, therefore I am» was a search for one absolutely secure certainty on which to rebuild all knowledge from scratch.",
        extras: [
          {
            titulo: "The rules of the game (and today's cheats)",
            cuerpo: [
              "The scientific method isn't a list of steps you recite at school: it's a set of defences against ourselves, because human beings are extremely good at finding what we already want to find. Here are the pieces, and each one is there for a reason.",
              "1. A HYPOTHESIS THAT CAN FAIL. If an idea is compatible with any possible result, it can't be tested and so it isn't science. The key question in the face of any claim is: what would have to happen for you to admit you're wrong?",
              "2. A COMPARISON GROUP. Without one you know nothing, because a lot of things get better on their own, change with the season or come from a thousand factors at once.",
              "3. MEASURE, don't be impressed. Numbers, units, margins of error. «A lot» and «a little» aren't data.",
              "4. CONTROL FOR CHANCE. With few cases, any result could be a coincidence. Separating signal from noise is what statistics is for.",
              "5. OTHERS HAVE TO BE ABLE TO REPEAT IT. A result that only works in the hands of whoever found it is worthless. That's why the full method has to be published, not just the conclusion.",
              "6. PEER REVIEW. Before publication, a piece of work is examined by independent researchers who try to find flaws in it. It was born with the first scientific journal in history, in 1665, and it's an imperfect but enormously useful filter.",
              "AND NOW WHAT THEY DON'T TELL YOU AT SCHOOL: THIS FAILS TOO, and science itself has spent twenty years studying its own failures, which is the best proof that it works.",
              "THE REPLICATION CRISIS. When famous experiments in psychology, medicine and economics have been repeated over the last decade, a significant share haven't produced the same result. It usually isn't fraud: it's a mix of small samples, analyses twisted until something turns up, and a hunger to publish.",
              "PUBLICATION BIAS. For decades, studies with positive results were published far more than ones that found nothing. That deforms reality: a treatment can look effective purely because the failed trials stayed in a drawer.",
              "«FISHING» FOR RESULTS. If you measure twenty things and only publish the one that came out pretty, you're almost certainly publishing a coincidence. The solution adopted is elegant: publicly registering what you're going to measure BEFORE running the experiment.",
              "MONEY. Whoever pays for a study influences what gets studied and what gets published. It's been documented in the tobacco, sugar, fossil fuel and pharmaceutical industries. Hence today's obligation to declare who funds each piece of work.",
              "AND HOW TO PROTECT YOURSELF, which is the practical part: distrust a single study, especially a spectacular one that makes headlines; look for reviews that pool MANY studies; ask what it was compared with, how many people took part and who paid; and remember that two things happening together don't prove one causes the other.",
              "Science isn't reliable because scientists are more honest than everyone else: it's reliable because it's the only system of knowledge that has organized itself to catch its own mistakes.",
            ],
            dato: "Fun fact: the motto of the Royal Society, chosen in 1660, is «nullius in verba»: «on no one's word». That is, nobody here is believed because of who they are. It's still the most subversive sentence in the history of knowledge.",
          },
        ],
      },
      newton: {
        titulo: "Isaac Newton",
        fecha: "1643–1727",
        cuerpo: [
          "Isaac Newton pulled off one of the greatest feats in the history of thought: uniting the heavens and the Earth under the same laws.",
          "He understood that the force making an apple fall to the ground is the same one keeping the Moon going round the Earth and the planets going round the sun: gravity.",
          "He formulated the laws of motion and the law of universal gravitation, which describe mathematically how almost everything we see moves. And to do it, he invented new mathematics.",
          "With Newton the Scientific Revolution reached its peak. For the first time, the universe appeared as a great ordered mechanism that human reason could understand.",
        ],
        dato: "Fun fact: Newton said that if he had seen further it was «by standing on the shoulders of giants», acknowledging everyone who had investigated before him.",
        extras: [
          {
            titulo: "From the apple to the Moon: the whole argument",
            cuerpo: [
              "He told the apple story himself in old age, and it probably never landed on his head. What he said is more interesting: that on seeing an apple fall he wondered why the apple falls and the Moon doesn't.",
              "And his answer was that the Moon IS falling too. It's just moving sideways fast enough that, as it falls, the Earth curves away beneath it and it never gets there. It's falling around us forever.",
              "The image he used explains it completely: imagine a cannon on top of a very high mountain. Fire it weakly and the ball arcs and lands nearby. Fire it harder and it lands further off. Fire it hard enough and the ball falls at exactly the rate at which the Earth's surface curves away from it… and it never lands at all. That's an orbit. And it's literally what satellites, the Space Station and the Moon are doing.",
              "With that idea he unified in one stroke two worlds that had been separate for two thousand years: the heavens, believed eternal, perfect and ruled by laws of their own, and the Earth, where things fall and wear out. Newton showed that the same force and the same formula govern both. There aren't two physics: there's one.",
              "HIS THREE LAWS, in plain language: a thing carries on as it is — still, or moving the same — until something pushes it (that's why you lurch forward when the bus brakes); the push a thing receives equals its mass times how much it accelerates (that's why moving a wardrobe is harder than moving a chair); and when you push something, that something pushes you back with the same force (that's why a rocket moves, not by pressing against the air, but by throwing gas out behind it).",
              "AND GRAVITY: any two bodies attract each other with a force that depends on their masses and falls off with the square of the distance. The same equation works for an apple, for a satellite, for the Moon and for Jupiter.",
              "WHAT THAT CHANGED. For the first time you could CALCULATE the sky. His equations predicted tides, eclipses and, most spectacularly, the return of a comet: Halley worked out when it would come back, and back it came right on time, with both of them long dead. And in 1846 a new planet, Neptune, was found by pointing the telescope at the exact spot where the sums said something had to be tugging on Uranus's orbit. Predicting a planet with a pencil is perhaps the greatest coup in the history of science.",
              "TO DO IT, he had to invent the mathematics he needed and that didn't exist: calculus, with derivatives and integrals, at the same time as Leibniz was developing it on his own, with a very long and bitter fight between the two over who got there first.",
              "AND EVEN SO, it wasn't the last word. Two hundred years later, Einstein showed that gravity isn't a force that pulls but the curvature of space and time, and that Newton's formulas break down when speeds are enormous or gravity very intense. He didn't throw them out: he left them as an outstandingly good approximation for everything that happens at human scale. The trip to the Moon was calculated with Newton's equations.",
              "AND THAT'S THE LESSON about method, perhaps the most important in this whole journey: in science, «superseded» doesn't mean «false». It means we now also know where it stops working.",
            ],
            dato: "Fun fact: he was an extremely odd character. He devoted more pages to alchemy and to trying to date the biblical prophecies than to physics, never married, kept up ferocious feuds and, when put in charge of England's Royal Mint, threw himself enthusiastically into chasing counterfeiters all the way to the gallows.",
          },
        ],
      },
    },
  },

  // ── La Ilustración: ordenar el mundo ───────────────────────────────────
  "ilustracion-ciencia": {
    titulo: "The Enlightenment: putting the world in order",
    anio: "18th century",
    momentos: {
      linneo: {
        titulo: "Linnaeus classifies life",
        fecha: "1707–1778",
        cuerpo: [
          "The naturalist Carl Linnaeus set out to order all known life. He created a system for classifying plants and animals into groups, from the most general to the most specific.",
          "He also invented a simple way of naming each species with two Latin words, a system so practical that we still use it all over the world today.",
          "Thanks to him, scientists in any country could understand each other when talking about the same living thing, with no confusion.",
          "Bringing order and a common language was an essential step: without classifying life it would have been impossible to study it and, later on, to understand evolution.",
        ],
        dato: "Fun fact: our own species got its scientific name from Linnaeus: Homo sapiens, meaning «wise man».",
      },
      lavoisier: {
        titulo: "Lavoisier and modern chemistry",
        fecha: "1743–1794",
        cuerpo: [
          "Before Lavoisier, chemistry was almost magic, the heir of alchemy. He turned it into an exact science, based on measuring precisely.",
          "He showed that in a chemical reaction nothing is created and nothing destroyed: matter is only transformed. That's the law of conservation of mass, one of the pillars of chemistry.",
          "He identified and named elements such as oxygen and explained what really happens when something burns.",
          "He brought order and a balance scale where before there were recipes and mystery. That's why he's considered the father of modern chemistry.",
        ],
        dato: "Fun fact: Lavoisier died on the guillotine during the French Revolution. A judge is said to have declared that «the Republic has no need of scholars». Science lost one of its great geniuses.",
      },
      "franklin-electricidad": {
        titulo: "Franklin and electricity",
        fecha: "1706–1790",
        cuerpo: [
          "Electricity looked like a capricious mystery until it started being studied with method. Benjamin Franklin showed, with daring experiments, that lightning is electricity.",
          "According to the famous story, he flew a kite during a storm to check it, an experiment as dangerous as it was revealing.",
          "From that idea he invented the lightning rod, which protects buildings by carrying the lightning safely into the ground.",
          "It was a perfect example of the Enlightenment spirit: understanding a feared natural phenomenon and putting it at the service of humanity.",
        ],
        dato: "Fun fact: electricity, barely a laboratory curiosity in the 18th century, would a century later become the force that lit and moved the entire world.",
      },
      "academias-enciclopedia": {
        titulo: "Academies and encyclopedias",
        fecha: "Knowledge shared",
        cuerpo: [
          "In the 18th century, science became a collective undertaking. Academies and scientific societies appeared where scholars shared their discoveries, argued about them and published them.",
          "The idea of gathering all human knowledge into great works was born too. The French Encyclopédie set out to order and spread the learning of its time so that it could reach anyone.",
          "Sharing results and letting others check and improve them became an essential part of the scientific method.",
          "Science grasped something decisive: knowledge grows far faster when it's shared than when it's kept secret.",
        ],
      },
    },
  },

  // ── El siglo XIX: energía, vida y materia ──────────────────────────────
  "siglo-xix": {
    titulo: "The 19th century: energy, life and matter",
    anio: "19th century",
    momentos: {
      "edad-de-la-tierra": {
        titulo: "The Earth has an age",
        fecha: "1788–1956",
        cuerpo: [
          "Before it could accept evolution, science had to solve a prior problem: TIME. In Europe people took as good a calculation made in the 17th century from the genealogies in the Bible, according to which the world had been created around 4004 BC. With six thousand years of history, no mountain can form slowly and no species can turn into another.",
          "The first to break that ceiling was a Scottish doctor and farmer, James Hutton. Watching cliffs and layers of rock, he noticed something elementary: the processes we see today — rain eroding, the river carrying sediment, the sediment compressing and turning into rock — are extremely slow, and if they're the same ones that have always been at work, then inconceivable amounts of time are needed.",
          "Charles Lyell turned that intuition into a science with rules, and his book was precisely what Darwin took with him to read on the Beagle voyage. Without geology's deep time, natural selection couldn't have worked: they're two ideas that hold each other up.",
          "But a number was still missing. In the 19th century an attempt was made to calculate it from how long a ball of molten rock takes to cool, and the physicist Kelvin gave a maximum of a few tens of millions of years, far too few for what geology and biology needed. The argument was bitter for decades.",
          "The tie-breaker came with radioactivity. Once it was discovered that certain elements turn into others at a constant, perfectly measurable rate, rock could be used as a clock: by counting how much of the original element is left and how much of its product, you get the time elapsed. In 1956, measuring a meteorite, the age of the Earth was set at about 4,550 million years, a figure that still stands.",
          "And there's the lesson about method: two sciences that looked like they had nothing to do with each other — the physics of the atom and the history of rocks — together solved a problem neither could close on its own.",
        ],
        dato: "Fun fact: to get a sense of the scale, if the Earth's 4,550 million years were a single year, life would appear in February, complex animals in mid-November, the dinosaurs would go extinct on 26 December, our species would appear at half past eleven at night on 31 December and the whole of written history would take up the last twenty seconds.",
      },
      "teoria-celular": {
        titulo: "Everything is made of cells",
        fecha: "1665–1858",
        cuerpo: [
          "In 1665, Robert Hooke pointed his microscope at a thin sheet of cork and saw it was divided into tiny compartments, like the cells of a honeycomb or the cells of a monastery. So he called them «cells». What he was seeing were the empty walls of dead cells, but the name stuck.",
          "At almost the same time, a Dutch cloth merchant, Antoni van Leeuwenhoek, who ground tiny lenses of astonishing quality, looked at a drop of pond water… and discovered it was full of living things moving about. He called them «animalcules». He also looked at his own saliva, the plaque on his teeth, semen and blood, and found life everywhere. Nobody had any idea a whole world existed below the reach of the eye.",
          "FIRST: all living things are made of cells. A bacterium is a single one; you have around thirty trillion.",
          "SECOND: the cell is the functional unit of life. There's nothing smaller that's alive, and everything a body does — move, digest, think, defend itself — is what its cells do.",
          "THIRD, the one Rudolf Virchow added and the most important: every cell comes from another cell. Nothing living appears out of nothing, and that dealt the decisive blow to the idea of spontaneous generation, which Pasteur finished off with his experiments.",
          "The consequences were immense. Illness stopped being an imbalance of humours and became something that happens in cells: an infection is a foreign cell invading; cancer is one of your own cells multiplying out of control; a wound heals because cells divide. And it explained reproduction: a whole human being starts out as a single cell that divides again and again.",
          "And it put us in our place: since cell theory, the difference between a bacterium in a pond and a person is one of organization and number, not of nature. We're made of the same stuff.",
        ],
        dato: "Fun fact: Leeuwenhoek never revealed his technique for making lenses, and his microscopes reached magnifications nobody matched for more than a century. He was a merchant with no university education who didn't know Latin, the language of science in his day: he wrote up his discoveries in Dutch, in letters, and they elected him a member of the Royal Society of London anyway.",
      },
      darwin: {
        titulo: "Darwin and evolution",
        fecha: "1809–1882",
        cuerpo: [
          "Charles Darwin travelled the world observing the astonishing variety of life. Little by little he reached a revolutionary idea: all species come from common ancestors and change over enormous stretches of time.",
          "The engine of that change is natural selection: the beings best adapted to their environment survive and leave more offspring, passing on their characteristics.",
          "So, with no need for a prior plan, nature goes on shaping ever better adapted forms of life. It's one of the most powerful ideas in all of science.",
          "Evolution joined every living thing, ourselves included, into one and the same gigantic tree of life.",
        ],
        dato: "Fun fact: Darwin held back publication of his theory for more than twenty years, aware of how much it was going to stir up. He only made up his mind when another naturalist, Alfred Russel Wallace, wrote to him from Indonesia describing exactly the same idea.",
        extras: [
          {
            titulo: "The evidence for evolution, one piece at a time",
            cuerpo: [
              "When Darwin published, he had observations and an argument, but he was missing evidence for several key pieces. A hundred and sixty years later, the evidence comes from fields that didn't exist in his day, and it all points to the same place. Here are five.",
              "1. FOSSILS. They always turn up in the expected order: first simple organisms, then fish, then amphibians, then reptiles, then mammals and birds. A mammal has never been found in a layer earlier than the first fish, and ONE would be enough to bring the theory down. And the links Darwin missed have been found: Tiktaalik, a fish with wrists and elbows able to prop itself up; Archaeopteryx, with feathers and teeth; and a beautiful series of ancient whales with ever smaller legs, down to today's, which still carry pelvic bones inside with no function at all.",
              "2. ANATOMY. A whale's flipper, a bat's wing, a horse's leg and your hand have the same bones, in the same order, with the same nerve connections: humerus, radius, ulna, wrist, fingers. If each species had been designed separately, there'd be no reason to reuse the same scheme for such different uses. And there are botched jobs that only heredity explains: the nerve running from the brain to the larynx goes all the way down to the chest, loops around an artery and comes back up. In a person that's a detour of a few centimetres; in a giraffe, more than four metres of extra cable.",
              "3. THE EMBRYO. The embryos of a fish, a chicken, a pig and a person are astonishingly alike in their earliest stages, gill arches and tail included. They differentiate later, because evolution works by modifying what was already there, not by starting from scratch.",
              "4. DNA, the evidence Darwin could never have imagined and the most compelling. Every living thing uses the same genetic code and the same four letters. And the degree of genetic similarity matches the family tree already deduced from bones and fossils: we share around 98.8% of our DNA with the chimpanzee, less with the mouse, far less with a yeast — and we still share genes with yeast. It's a tree reconstructed twice, by two independent methods, and it comes out the same.",
              "5. THE EVOLUTION YOU CAN SEE TODAY. It isn't a thing of the remote past: it's observed live. Bacteria becoming resistant to antibiotics in a hospital, the flu virus changing every year and forcing the vaccine to be redesigned, the Galápagos finches whose beaks change in average size within a few years depending on the droughts — measured over four decades by two biologists, generation by generation — insects becoming immune to a pesticide. Every time you hear about resistance, you're hearing about natural selection.",
              "AND THREE MISUNDERSTANDINGS ARE WORTH CLEARING UP.",
              "It doesn't say humans come from monkeys: it says today's monkeys and we have a common ancestor, the way two cousins have a grandparent and neither comes from the other. It doesn't say «the strongest» survives, but whoever fits best into their particular environment, which is often the smallest, the most inconspicuous or the one that cooperates best. And it has no direction and no goal: we aren't heading «toward» anywhere, and bacteria, which have been here 3,500 million years, are the greatest evolutionary success on the planet.",
            ],
            dato: "Fun fact: Darwin spent eight years studying barnacles and published four volumes about them, and further years breeding pigeons and studying worms. His last book was about earthworms. Biology's most ambitious theory was built by someone obsessed with the small and the boring.",
          },
        ],
      },
      mendel: {
        titulo: "Mendel and heredity",
        fecha: "1822–1884",
        cuerpo: [
          "Gregor Mendel, a monk with a passion for nature, grew and crossed thousands of pea plants in his monastery garden, noting everything down patiently.",
          "He discovered that traits are inherited following precise mathematical rules, thanks to «units» that pass from parents to offspring. Today we call them genes.",
          "His work, published in a modest journal, went almost unnoticed in his lifetime. Decades later it was rediscovered and became the basis of genetics.",
          "Mendel showed that even something as complex as heredity hides clear laws, waiting for whoever observes carefully.",
        ],
        dato: "Fun fact: Mendel was ahead of his time. His discovery had to wait for the world to be ready to understand it.",
      },
      maxwell: {
        titulo: "Maxwell and electromagnetism",
        fecha: "1831–1879",
        cuerpo: [
          "James Clerk Maxwell managed to unite in a single theory two forces that looked separate: electricity and magnetism. He showed they're two faces of one phenomenon, electromagnetism.",
          "His equations predicted something astonishing: that there were electromagnetic waves travelling through space, and that light itself was one of them.",
          "Out of that theory would come radio, television, radar, the mobile phone and almost all of today's communications technology.",
          "It was one of science's great «unifications»: discovering that two different things are, at bottom, the same.",
        ],
        dato: "Fun fact: thanks to Maxwell's equations we understand that visible light, radio waves and X-rays are all the same phenomenon, just at different energies.",
      },
      mendeleyev: {
        titulo: "Mendeleev and the periodic table",
        fecha: "1834–1907",
        cuerpo: [
          "Dmitri Mendeleev ordered all the known chemical elements according to their properties and created the periodic table, one of the most useful maps in science.",
          "The most impressive part is that his table had gaps: Mendeleev predicted that there were elements not yet discovered and described what they'd be like.",
          "Years later, those elements turned up, exactly as he'd announced. A theory that predicts the unknown is a powerful theory.",
          "The periodic table shows that all the matter in the universe is made of a limited number of elements, combined in infinite ways.",
        ],
        dato: "Fun fact: the story goes that Mendeleev worked out the structure of the periodic table after turning it over and over in his mind, rather like someone solving an enormous jigsaw.",
      },
      termodinamica: {
        titulo: "Energy and thermodynamics",
        fecha: "Discovering energy",
        cuerpo: [
          "In the 19th century, driven by the steam engines of the Industrial Revolution, scientists grasped a profound idea: everything that happens involves transformations of energy.",
          "They discovered that energy is neither created nor destroyed, it only changes form: from heat to movement, from movement to electricity. It's one of the firmest laws in physics.",
          "They also understood that in every transformation some energy disperses as heat and can no longer be fully used. The universe tends, little by little, toward disorder.",
          "These laws, thermodynamics, explain everything from a car engine to why we age or why time seems to run in only one direction.",
        ],
        dato: "Fun fact: thermodynamics was born studying how to improve steam engines, but it ended up explaining the fate of the entire universe.",
      },
    },
  },

  // ── La revolución de la física ─────────────────────────────────────────
  "fisica-moderna": {
    titulo: "The revolution in physics",
    anio: "First half of the 20th century",
    momentos: {
      curie: {
        titulo: "Marie Curie and radioactivity",
        fecha: "1867–1934",
        cuerpo: [
          "Marie Curie discovered that certain materials give off a mysterious radiation all by themselves: radioactivity. That revealed that an immense energy was hiding inside the atom.",
          "Together with her husband she discovered new elements, such as radium and polonium, working in gruelling conditions and with very scarce means.",
          "She was the first person to win two Nobel Prizes, in two different sciences, at a time when women were barely allowed to do research at all.",
          "Her findings opened the door to understanding the inside of the atom and to uses as important as treating cancer with radiation.",
        ],
        dato: "Fun fact: Marie Curie handled radioactive materials without knowing the dangers. Her notebooks are still so radioactive that they're kept in special boxes.",
        extras: [
          {
            titulo: "The women who were there and barely appear",
            cuerpo: [
              "Marie Curie is the exception we all know, and precisely for that reason it's worth telling the rule. These women were present at decisive moments in this story, and their names fell out of the account.",
              "HYPATIA (4th–5th century), mathematician and astronomer of Alexandria, taught geometry and astronomy and wrote commentaries on the great mathematical texts of her day. She was lynched in the street in a political and religious conflict.",
              "ÉMILIE DU CHÂTELET (18th century) translated Newton's «Principia» into French and added a commentary of her own that corrected and developed his physics. Her version is still the reference translation in French, two hundred and seventy years later. And she contributed an important correction about the relationship between energy and speed that anticipates what would later be called kinetic energy. She died in childbirth, at forty-two, with the work just finished.",
              "CAROLINE HERSCHEL (18th–19th century) discovered eight comets and several nebulae, catalogued stars and was the first woman to be paid a salary for doing science in Britain.",
              "ADA LOVELACE (1815–1852) wrote, for a calculating machine that was never built, what's considered the first program in history, and — this is the important part — she was the first person to realize that a machine like that wouldn't only be good for operating on numbers, but for manipulating any kind of symbol: music, text, images. She predicted computing a century before it existed.",
              "THE HARVARD «COMPUTERS» (late 19th century) were a team of women hired to classify photographic plates of stars for a miserable wage. One of them, Henrietta Leavitt, discovered the relationship that lets us measure the distance to galaxies: without that finding it wouldn't have been possible to discover that the universe is expanding. Another, Annie Jump Cannon, classified some 350,000 stars by hand and created the classification system used today.",
              "LISE MEITNER (1878–1968) was the one who explained nuclear fission theoretically — that is, why a uranium nucleus splits. The Nobel went to her colleague Otto Hahn alone. And something has to be added in her favour: she refused to take part in the atomic bomb project.",
              "EMMY NOETHER (1882–1935) proved a theorem relating the symmetries of nature to the conservation laws of energy and momentum. It's one of the deepest results in theoretical physics, and Einstein described her as the most important woman in the history of mathematics. She worked for years with no salary and no post, because the university didn't admit women as teachers.",
              "CHIEN-SHIUNG WU (1912–1997) designed and carried out the experiment that showed nature is NOT symmetrical in a certain kind of decay, knocking down a principle that had been taken as certain. The Nobel went to the two theorists who had proposed the idea; she, who proved it, was left out.",
              "JOCELYN BELL (b. 1943) detected, as a doctoral student, some extremely regular periodic signals coming from space: they were pulsars, spinning neutron stars. The 1974 Nobel went to her thesis supervisor.",
              "And ROSALIND FRANKLIN, whose story is told further on in this same journey.",
              "This even has a name of its own in the history of science: the MATILDA EFFECT, the tendency to credit a woman researcher's work to a male colleague. And it isn't only a thing of the past: it's still being measured today in article authorship, patents and prizes.",
              "The consequence isn't only one of justice. It's that for centuries humanity has done its research with half a workforce, and that also explains some gaps in what we know: for instance, that many clinical trials and crash-test models were done for decades with male bodies only.",
            ],
            dato: "Fun fact: Marie Curie couldn't study in her native Poland, where the university didn't admit women, and attended clandestine classes in private flats. In 1911, while the French press was attacking her over her private life, she received her second Nobel. And her daughter Irène won another years later: the first time a scientific Nobel passed from mother to daughter.",
          },
        ],
      },
      einstein: {
        titulo: "Einstein and relativity",
        fecha: "1879–1955",
        cuerpo: [
          "Albert Einstein transformed our idea of the universe. He showed that time and space aren't fixed: they can stretch and shrink depending on how we move or on gravity.",
          "He also discovered that mass and energy are the same thing, summed up in the most famous formula in science: energy equals mass times the speed of light squared.",
          "His theory of gravity described that force as a curvature of space and time itself, caused by objects with mass.",
          "His ideas, checked again and again, changed our view of the cosmos forever and today are essential even for the GPS in your phone to work.",
        ],
        dato: "Fun fact: near a very massive object, time passes a little more slowly. It isn't science fiction: it's been measured with real clocks.",
        extras: [
          {
            titulo: "Relativity, explained without equations",
            cuerpo: [
              "It all comes out of two very simple statements, and out of taking them seriously all the way.",
              "FIRST: the laws of physics are the same for anyone moving at constant speed. If you're on a train with no windows and no bumps, there's no experiment you can do inside to find out whether you're moving or standing still. Galileo already sensed this.",
              "SECOND, the explosive one: light is always measured at the same speed, no matter how you move or how the source moves. And this is extremely strange. If you're driving at 100 and overtake someone doing 90, you see them fall behind at 10. With light it doesn't work like that: if you chase a beam of light at half the speed of light, you still measure it moving away from you at the same old speed.",
              "IF YOU ACCEPT BOTH, something has to give. And what gives is what nobody suspected: time and space. Since speed is distance divided by time, for the speed of light to come out the same every time, distance and time have to change depending on who's measuring.",
              "CONSEQUENCE 1: TIME DILATES. A moving clock runs slower than a stationary one, and the faster it goes the slower it runs. It isn't an illusion or a fault in the clock: it's time. It's been confirmed with atomic clocks on planes and with particles in accelerators, which «live» longer than they should when they're moving very fast.",
              "CONSEQUENCE 2: THERE'S NO UNIVERSAL «NOW». Two events that are simultaneous for you may not be for someone moving relative to you. The shared present of the whole universe, which seemed obvious, doesn't exist.",
              "CONSEQUENCE 3: E = mc². Mass is extremely concentrated energy, and that c² is a gigantic number: a few grams of matter hold the energy of an enormous explosion. That's where the sun's energy comes from, and nuclear power stations, and the atomic bomb.",
              "AND TEN YEARS LATER, GRAVITY. Einstein noticed something else elementary: if you're in free fall you don't feel your weight; and if you're in an accelerating spacecraft, you feel exactly what you'd feel on a planet. Gravity and acceleration are indistinguishable. From that he concluded that gravity isn't a force pulling on things, but the CURVATURE of space and time around objects with mass. The Earth doesn't fall toward the sun because the sun pulls it on an invisible string: it follows the straightest possible path in a deformed space.",
              "THE EVIDENCE that made him world-famous: if space is curved, starlight passing near the sun must be deflected by an exact, calculable amount. You can only look during an eclipse. In 1919 two British expeditions measured it — four years after a war against Germany, testing a German's theory — and the deflection was there. The newspapers ran headlines saying Newton's ideas had been superseded, and Einstein became the first scientific celebrity in history.",
              "AND WHERE YOU USE IT. The GPS in your phone runs on satellite clocks, and those clocks gain about 38 microseconds a day compared with ones on the surface because of the two combined effects: they're moving fast (which slows them) and they're further from the Earth's mass (which speeds them up). If it weren't corrected, your position would drift by about ten kilometres a day. Every time you use the map, you're using both relativities at once.",
              "AND THERE ARE MORE PREDICTIONS THAT HAVE COME TRUE since: black holes, whose first image was obtained in 2019; and gravitational waves, ripples in spacetime produced when two black holes collide, detected for the first time in 2015, a hundred years after he announced them.",
            ],
            dato: "Fun fact: the Nobel wasn't given to him for relativity, which was too controversial, but for explaining the photoelectric effect, a paper from that same year of 1905 which is also one of the founding pieces of quantum physics… the theory he never quite came to agree with.",
          },
        ],
      },
      cuantica: {
        titulo: "The quantum world",
        fecha: "Planck, Bohr, Heisenberg",
        cuerpo: [
          "Studying the inside of atoms, physicists discovered a world that defies common sense: the quantum world. There, energy comes in small packets and particles behave like waves too.",
          "Pioneers like Max Planck, Niels Bohr and Werner Heisenberg realized that at that tiny scale you can't predict with certainty what a particle will do, only calculate probabilities.",
          "It's extremely strange physics, but it works with astonishing precision and has been checked thousands of times.",
          "Without quantum physics there'd be no computers, no mobile phones, no lasers and none of a good deal of the technology we use every day.",
        ],
        dato: "Fun fact: quantum physics is so counterintuitive that Einstein himself never fully accepted it, despite having helped found it.",
        extras: [
          {
            titulo: "Why it's so strange (and why it works anyway)",
            cuerpo: [
              "Quantum physics has a reputation for being incomprehensible, and it's partly deserved: nobody has any intuition for the world of the very small, because our brains were made for stones and animals. But its oddities can be told.",
              "1. EVERYTHING COMES IN PACKETS. The word «quantum» means «minimum amount». Energy can't be given in just any quantity, only in multiples of a very small packet, like money, which doesn't let you pay half a penny. Planck discovered it under duress, almost with distaste, because it was the only way the sums for heat and light would work out.",
              "2. A THING CAN BEHAVE AS A WAVE AND AS A PARTICLE. The key experiment is the double slit, and it's easy to picture: if you fire particles one at a time at a wall with two slits, you'd expect to see two bands behind. What appears is a pattern of many bands, typical of waves crossing each other. That is: each particle, on its own, goes through both slits at once and interferes with itself. And the most disconcerting part: if you put a detector there to find out which of the two it goes through, the pattern disappears and the two bands come back. Looking changes the result.",
              "3. YOU CAN'T KNOW EVERYTHING AT ONCE. Heisenberg's uncertainty principle says that the better you know a particle's position, the worse you know its speed, and vice versa. And it isn't a problem with instruments: it's a property of nature.",
              "4. WHAT THERE IS ARE PROBABILITIES. Quantum physics doesn't say «the electron is here», it says «there's this much probability of finding it here». Physics stops predicting with certainty and starts predicting distributions. That's what Einstein found unbearable, hence his line: «God does not play dice». The experiments have proved the others right.",
              "5. ENTANGLEMENT, the biggest oddity of all. Two particles can be linked in such a way that measuring one instantly determines the other, however far away it is. It can't be used to send messages faster than light, but it's real: it's been confirmed in ever finer experiments, and the 2022 Nobel Prize in Physics was awarded precisely for those confirmations.",
              "AND NOW THE IMPORTANT PART: IT WORKS. Measured by the precision of its predictions, it's the most successful theory in the history of science, and it's inside almost everything you use.",
              "The transistor, and therefore every chip, every computer and your phone. The laser, and with it barcode scanners, fibre optics, eye surgery and disc players. The LEDs in your bulbs. Solar panels. The MRI scanner at the hospital. The electron microscope. The atomic clock that gives GPS the time. The whole of chemistry — the bonds between atoms are quantum — and with it computer-designed medicines. And now quantum computers, which are taking their first steps.",
              "THE MORAL, which is one of the best in this journey: you can know how to use something with astonishing precision without ever quite understanding what it means. There are several interpretations of quantum theory and physicists are still arguing about them a century later. Meanwhile, the predictions come true to twelve decimal places. Science doesn't demand that you understand the bottom of things in order to move forward; it demands that the sums work and that anyone can check them.",
            ],
            dato: "Fun fact: quantum physics also explains why the sun shines. According to classical physics, hydrogen nuclei wouldn't have enough energy to fuse; they manage it thanks to a quantum phenomenon called tunnelling, which lets them pass through a barrier they couldn't jump. You're alive because of a quantum oddity.",
          },
        ],
      },
      "atomo-energia": {
        titulo: "The atom: power and danger",
        fecha: "The power of the atom",
        cuerpo: [
          "On understanding the inside of the atom, scientists discovered that an immense amount of energy could be released by splitting or joining its nuclei.",
          "That energy had two opposite faces. On one side, nuclear power stations, capable of producing enormous amounts of electricity. On the other, the atomic bomb, the most destructive weapon ever created.",
          "In 1945, two atomic bombs flattened entire cities and showed the world the terrible power science had put in human hands.",
          "It was a warning that still echoes: knowledge gives power, but it doesn't say how to use it. That decision, moral and human, is still ours.",
        ],
        dato: "Fun fact: many of the scientists who helped create the atomic bomb spent the rest of their lives warning against the danger of nuclear weapons.",
      },
      "big-bang": {
        titulo: "The universe has a history",
        fecha: "1929–1965",
        cuerpo: [
          "The first blow came from a simple question: what exactly are those nebulous smudges in the sky? In 1924, by measuring their distance, Edwin Hubble showed that some weren't inside our galaxy at all, but were WHOLE GALAXIES, with billions of stars, at inconceivable distances. In a single observation, the known universe multiplied thousands of times over.",
          "And to measure those distances he used the method Henrietta Leavitt had discovered at Harvard, classifying photographic plates for a pittance.",
          "The second blow came in 1929: analysing the light from those galaxies, Hubble found that almost all of them are moving away from us, and that the further away they are, the faster they recede. The conclusion is inescapable and doesn't mean we're at the centre of anything: it means the WHOLE of space is expanding, like dots drawn on a balloon being inflated, all moving apart from each other.",
          "And if it's further apart today, it was closer together yesterday. Rewinding, everything must have been concentrated in an extremely dense, extremely hot initial state. That's what we call the Big Bang, a name coined as a joke, dismissively, by an astronomer who didn't believe it. The idea had been proposed in 1927 by a Belgian physicist and priest, Georges Lemaître, and it's worth saying so for what it teaches: the theory of the origin of the universe was formulated by a priest and rejected by an atheist, exactly the opposite of what you'd assume.",
          "AND HERE COMES THE PART THAT TURNS AN IDEA INTO SCIENCE. The theory predicted that, if that had happened, there should be an ember left over: a very faint, very cold radiation arriving equally from every direction in the sky. In 1965, two engineers testing a communications antenna ran into a background noise they couldn't get rid of. They cleaned the antenna, evicted the pigeons nesting inside, and the noise was still there. They weren't looking for it: they'd found the echo of the origin of the universe.",
          "With that, the Big Bang stopped being speculation and became the standard model. Today the age of the universe is calculated at about 13,800 million years, and there's a third independent confirmation: the proportion of hydrogen and helium observed in the cosmos is exactly what the model predicts.",
          "One much-repeated misunderstanding is worth clearing up: the Big Bang wasn't an explosion at a point in space, it was the expansion of space itself. There's no place where it happened, because it happened everywhere.",
          "And enormous open questions remain, which is the best proof that this is alive: we don't know what dark matter or dark energy are, which together seem to be 95% of the contents of the universe, nor why the expansion is accelerating, nor what there was «before» — a question that may mean nothing if time began there.",
        ],
        dato: "Fun fact: part of that echo of the origin used to leak into old televisions. A small percentage of the grey snow that appeared when you tuned to an empty channel was cosmic background radiation: for decades, anyone could see a little of the newborn universe in their living room.",
      },
      "explorar-cosmos": {
        titulo: "Going out for a closer look",
        fecha: "Since 1957",
        cuerpo: [
          "Throughout history, astronomy meant looking up from the ground. In 1957, with the launch of Sputnik, it also started to mean GOING.",
          "THE PROBES. We've landed on the Moon, on Mars, on Venus, on Titan and on a comet; probes have been sent to every planet in the solar system. The two Voyagers, launched in 1977, are still working and have already left the sun's zone of influence: they're the most distant human objects in existence. And the robots roving Mars have confirmed something that could only be suspected from Earth: there was once liquid water there.",
          "THE SPACE TELESCOPES. Outside the atmosphere you can see without the distortion of air and pick up radiation that doesn't reach us down here. Hubble photographed galaxies billions of light years away, and its famous «deep field» — a photo of a patch of apparently empty sky that turned out to be full of thousands of galaxies — changed how we saw our place in things. And the James Webb telescope, with its six-and-a-half-metre golden mirror, sees in infrared and is observing galaxies that formed just a few hundred million years after the Big Bang.",
          "THE EXOPLANETS, which is probably the biggest conceptual change. Until 1995 there was no evidence at all that planets existed around other stars: it was a reasonable assumption and nothing more. Today more than five thousand have been confirmed, we know how to measure their size, their orbit and in some cases their atmosphere, and it's estimated that most stars have planets. The question of whether there's life elsewhere has gone from philosophy to a research programme with instruments and a timetable.",
          "AND THERE'S A RETURN EFFECT almost nobody foresaw: looking outward, we learned to look at ourselves. Satellites measured for the first time the hole in the ozone layer, deforestation, melting ice, currents and global temperature. The best information we have about our own house comes from devices that left it.",
          "And the most influential image of the entire space programme wasn't of another world but of ours: the Earth seen from far away, small, blue and with no borders drawn on it.",
        ],
        dato: "Fun fact: in 1990, at the astronomer Carl Sagan's request, the Voyager 1 probe turned its cameras and photographed the Earth from six billion kilometres away. It appears as a dot less than a pixel across inside a beam of scattered light. That photo is called «a pale blue dot», and inside it fit, without exception, every war and every person who has ever existed.",
      },
      "tectonica-placas": {
        titulo: "The continents move",
        fecha: "1912–1968",
        cuerpo: [
          "In 1912, a German meteorologist called Alfred Wegener put forward an idea his colleagues found ridiculous: the continents move, and in the past they were all joined into one.",
          "His arguments were good and very visual. The coasts of Africa and South America fit together like two pieces of a jigsaw. There are identical fossils of land plants and animals on both sides of the Atlantic, and no reptile swims across an ocean. There are mountain ranges that start on one continent and carry on, with the same rocks and the same age, on another. And there are marks of ancient glaciers in India, in Africa and in Australia — that is, in areas that are tropical today — which only make sense if they were all together and near the pole.",
          "He was missing one thing only, and it was decisive: he couldn't explain the MECHANISM. What force moves a continent? His proposals were weak and the geophysicists calculated that none of it could work. He was rejected for almost fifty years, ridiculed for not being a geologist, and died on an expedition in Greenland in 1930 without having convinced anyone.",
          "The answer came after the Second World War and, curiously, out of military technology: the sonar and magnetometers developed to hunt submarines made it possible to map the ocean floor for the first time. And what turned up down there was another planet: a mountain range thousands of kilometres long running down the middle of the Atlantic, and trenches eleven kilometres deep.",
          "The decisive finding was magnetic. The Earth's magnetic field flips every so often, and volcanic rock, as it cools, gets «recorded» with the orientation of that moment. On measuring the ocean floor, a pattern of symmetrical bands appeared on both sides of the central range, like the rings of a tree: new rock in the middle, progressively older as you move away.",
          "There's only one way to explain that: new material comes up continuously along the central range, the ocean floor spreads out to the sides, and in other places it sinks beneath another plate. The continents don't sail across the sea: they ride on plates of crust that move a few centimetres a year, driven by the planet's internal heat.",
          "By around 1968 plate tectonics was accepted, and it unified in one stroke things that had seemed unrelated: why earthquakes and volcanoes occur in exactly the same strips on the map, why mountains grow — the Himalayas rise because India keeps pushing against Asia — how oceans open and close, and why life evolved separately on some continents and not others.",
        ],
        dato: "Fun fact: they're moving right now, while you read this, at a rate similar to the growth of your fingernails: a few centimetres a year. And in a few tens of millions of years the Mediterranean will be gone, because Africa keeps moving up toward Europe.",
      },
    },
  },

  // ── Descifrar la vida ──────────────────────────────────────────────────
  "descifrar-vida": {
    titulo: "Deciphering life",
    anio: "20th century",
    momentos: {
      adn: {
        titulo: "DNA: the molecule of life",
        fecha: "1953",
        cuerpo: [
          "In 1953 the structure of DNA was discovered — the molecule that holds the instructions for building and running every living thing, from a bacterium to a human being.",
          "It's shaped like a double helix, a twisted ladder. Its rungs form a code that can be copied with enormous fidelity every time a cell divides.",
          "That discovery explained in one stroke how the heredity Mendel had talked about is passed on: genes are written in DNA.",
          "It was one of the great milestones in history: at last we could read, letter by letter, life's instruction manual.",
        ],
        dato: "Fun fact: if you stretched out all the DNA in a single human cell, it would be about two metres long. And you're carrying trillions of cells inside you.",
      },
      "rosalind-franklin": {
        titulo: "Rosalind Franklin",
        fecha: "1920–1958",
        cuerpo: [
          "The discovery of DNA's shape wouldn't have been possible without Rosalind Franklin, a brilliant scientist and expert in photographing molecules with X-rays.",
          "It was her famous image, known as «Photograph 51», that revealed DNA's double-helix shape with decisive clarity.",
          "For a long time her role stayed in the shadows, while others took almost all the credit. She died young, without ever seeing her contribution fully valued.",
          "Her story is a reminder that science is made by many people, and that throughout history the achievements of many women were silenced or ignored.",
        ],
        dato: "Fun fact: Rosalind Franklin's «Photograph 51» is now considered one of the most important images in the history of science.",
      },
      "editar-vida": {
        titulo: "Reading and editing life",
        fecha: "From the genome to today",
        cuerpo: [
          "After discovering DNA, science set out to read the whole thing. At the start of the 21st century the complete human genome was decoded, all the instructions of our species.",
          "Later came tools able not only to read genes but to edit them, precisely correcting small errors in DNA.",
          "This opens enormous possibilities: curing hereditary diseases, creating better treatments and understanding life better.",
          "But it also raises difficult questions: how far should we modify life? Science gives us immense power, and with it, a great responsibility.",
        ],
        dato: "Fun fact: reading the first complete human genome took years of work and an enormous fortune. Today it can be done in a short time and for a tiny fraction of that price.",
      },
    },
  },

  // ── La era de la información y el futuro ───────────────────────────────
  "era-informacion": {
    titulo: "The information age and the future",
    anio: "20th – 21st centuries",
    momentos: {
      turing: {
        titulo: "Alan Turing and the computer",
        fecha: "1912–1954",
        cuerpo: [
          "Before computers existed, Alan Turing imagined a machine able to follow instructions to solve any problem that could be described with rules. That was the idea behind every computer we have today.",
          "During the Second World War he helped decipher the enemy's secret messages with calculating machines, shortening the war and saving countless lives.",
          "He also asked something we're still debating: could a machine come to think like a human being?",
          "He's considered one of the fathers of computing. His way of thinking gave rise to the digital world we live in today.",
        ],
        dato: "Fun fact: Turing was treated unjustly and cruelly in his day because of his sexual orientation. Decades later, his country apologized officially, and today he's honoured as a hero.",
        extras: [
          {
            titulo: "The machine that can be any machine",
            cuerpo: [
              "Turing's idea is from 1936, nine years before the first computer existed, and it's one of the most abstract and most consequential in history. It's worth understanding, because it explains the device you're reading this on.",
              "He asked what exactly «to calculate» means. And he described an imaginary, ridiculously simple machine: an infinite tape divided into squares, a head that can read a symbol, erase it, write another and move one square left or right, and a table of rules along the lines of «if you're in this state and read this symbol, write this and move there».",
              "With that, he argued, you can do ANY calculation a human being could do by following a procedure. And then he took the decisive step: if the rules can be written on the tape itself as data, then there exists a machine able to imitate all the others. That's the universal machine.",
              "There, in a mathematics paper, the concept of SOFTWARE is invented. A computer isn't a device for one task: it's a device you give the instructions for the task to. The same object is a calculator, a typewriter, a mixing desk, a telephone, a map or a games console depending on the program you put in it. Everything else — the phone, the laptop, the server — are technical variations on that idea.",
              "And in the same paper he also proved a LIMIT, and this is the part usually forgotten: there are problems no machine will ever be able to solve, however powerful. He proved there can be no program able to determine, for any program and any data, whether it will finish or go round forever. Computing was born with its own impossibility theorem built in.",
              "THE WAR. At Bletchley Park, Turing and his team took on Enigma, the machine the German army used to encrypt its messages and whose keys changed every day. He designed electromechanical machines that tested configurations at speed, ruling out the impossible ones, and developed statistical methods to exploit the enemy's slips: repeated greetings, predictable weather reports. Some ten thousand people worked there, more than two thirds of them women, and it's reckoned their work shortened the war by years and saved millions of lives. It was all classified for decades: the people who did it couldn't tell anyone, not even their own families.",
              "THE TEST. In 1950 he raised the question «can a machine think?» and, instead of arguing about definitions, proposed turning it into something checkable: if in a written conversation you can't tell whether there's a person or a machine on the other side, on what grounds do you deny it the ability to think? Seventy years on, that question has stopped being a parlour game.",
              "AND THE ENDING, which has to be told. In 1952 he was convicted for his homosexuality, then a crime in the United Kingdom. He was given a choice between prison and hormone treatment with oestrogen, a chemical castration with devastating physical and psychological effects. He lost his security clearance and his access to secret work. He died in 1954, at forty-one, of cyanide poisoning; it's considered a suicide. The British government apologized officially in 2009 and the Queen granted him a posthumous pardon in 2013. In 2017 a law was passed extending that pardon to tens of thousands of men convicted of the same thing, and it's known as the «Turing law».",
              "The man who broke the code that helped win the war was destroyed by his own country for what he was.",
            ],
            dato: "Fun fact: computing's most important prize, the discipline's equivalent of the Nobel, is called the Turing Award. And in the United Kingdom his face has been on the fifty-pound note since 2021.",
          },
        ],
      },
      internet: {
        titulo: "The network that connected the world",
        fecha: "Since 1969",
        cuerpo: [
          "At the end of the 20th century, computers started connecting to each other to form a worldwide network: the internet. For the first time, information could travel in seconds from one end of the planet to the other.",
          "With the web, anyone could reach an amount of knowledge that previously wouldn't have fitted in the world's greatest libraries.",
          "The internet transformed the way we work, learn, communicate and relate to each other, with enormous advantages and new problems too.",
          "The Enlightenment dream of sharing knowledge with the whole of humanity came true on a scale no encyclopedist could ever have imagined.",
        ],
        dato: "Fun fact: much of the technology of the internet was born from collaboration between scientists who wanted to share their data and discoveries more easily.",
      },
      "inteligencia-artificial": {
        titulo: "Artificial intelligence",
        fecha: "21st century",
        cuerpo: [
          "Artificial intelligence means programs able to learn from enormous amounts of data, instead of only following fixed instructions.",
          "Today they can recognize images, translate languages, drive vehicles, help discover medicines or hold a conversation. They learn from examples, a bit like people do.",
          "It's an extremely powerful tool that's already transforming science, work and everyday life at great speed.",
          "And it brings big questions with it: how do we use it well? What decisions can we hand over to it? How do we make sure it benefits everyone? Answering those will be one of the great challenges of your generation.",
        ],
        extras: [
          {
            titulo: "How a machine learns",
            cuerpo: [
              "It's worth understanding the mechanism, even roughly, because it changes a lot about how you use these tools and how far you trust them.",
              "THE DIFFERENCE FROM AN ORDINARY PROGRAM. A classic program is instructions written by a person: «if the user clicks here, do this». For recognizing a cat in a photo, that approach fails: nobody knows how to write the exact rules for «cat». So the strategy was changed: instead of giving it the rules, you give it MILLIONS OF EXAMPLES and the machine adjusts its own parameters until it gets things right. That's machine learning.",
              "HOW IT ADJUSTS. Inside there's a network with layers of connected units, very loosely inspired by neurons. Each connection has a number, a «weight». At first they're random, so the system gets things wrong. Then you measure how wrong it was and nudge all the weights slightly in the direction that reduces the error. Repeat billions of times. There's no understanding and no intention: there's a gigantic statistical adjustment.",
              "LANGUAGE MODELS, the ones that have made AI famous, do something apparently humble: predict the most plausible continuation of a text, word by word, after processing enormous amounts of text written by people. The astonishing thing is that doing that at that scale, capabilities emerge that nobody programmed: summarizing, translating, reasoning approximately, writing code.",
              "AND THAT'S WHERE ITS TWO FACES COME FROM. Since it isn't consulting a database of truths but generating the most plausible thing, it can state something false with complete confidence — these are called hallucinations — and it can't tell by itself the difference between what it knows and what it's making up. So any important fact that comes out of an AI has to be verified against a source.",
              "BIASES. It learns from what we give it. If the texts and images it's trained on carry prejudices, it reproduces them and sometimes amplifies them. There are documented cases of recruitment systems that penalized women, of facial recognition that failed far more often with darker-skinned faces, and of judicial risk algorithms with unequal results by race. Whenever someone says an algorithm is «objective», you should always ask what data it learned from and who chose it.",
              "WHAT IT HAS ALREADY ACHIEVED IN SCIENCE, which is enormous and less well known than the chatbots: predicting the three-dimensional shape of proteins — a problem that had been open for fifty years and is key to designing medicines — helping to discover new antibiotics, detecting tumours in medical images, controlling the plasma in a fusion reactor, improving weather forecasting and classifying millions of astronomical images.",
              "AND THE OPEN QUESTIONS, which aren't technical but ours: what happens to the jobs that consist of tasks the machine does faster; whose work these systems were trained on; how you tell what's true when fabricating a fake voice or video is free; what decisions we should never delegate — a verdict, a dismissal, a gunshot; and who controls a technology whose development is concentrated in a handful of companies.",
              "And a final idea that ties into this whole journey. This is the first technology that automates COGNITIVE tasks — that is, the very thing we've spent all of history defining ourselves by. The printing press multiplied our capacity to spread ideas and the steam engine our strength. This one touches something else. And as with the other two, the ending isn't written: it isn't a natural phenomenon happening to us, it's a set of decisions being made right now.",
            ],
            dato: "Fun fact: the mechanism behind almost all of today's generative AI systems was described in a 2017 paper barely eight pages long, titled «Attention is all you need». Eight pages and one idea, published openly so anyone could use them.",
          },
        ],
      },
      "ciencia-del-clima": {
        titulo: "The science that warns us: the climate",
        fecha: "1856 – today",
        cuerpo: [
          "In 1856, the American scientist Eunice Foote ran a simple experiment with two glass cylinders in the sun, one with ordinary air and one with carbon dioxide, and found that the second got hotter and took longer to cool. She wrote that an atmosphere with more of that gas would give the Earth a higher temperature. Her paper was read out at a conference — read by a man, because she wasn't allowed to speak — and forgotten for a century and a half.",
          "A few years later, John Tyndall measured precisely which gases trap heat and which don't, and explained the mechanism: sunlight passes through the atmosphere, warms the ground, and the ground returns that heat as infrared radiation which some gases — water vapour, carbon dioxide, methane — absorb and re-emit. Without that natural greenhouse effect, the Earth would be a frozen ball; the problem isn't that it exists, it's changing its intensity.",
          "In 1896, the Swede Svante Arrhenius calculated by hand how much the temperature would rise if the atmosphere's carbon dioxide doubled. He got a figure astonishingly close to the one today's supercomputers give. And the curious part is that he thought it was good news: he reckoned a warmer climate would help harvests in northern Europe.",
          "The decisive evidence began in 1958, when Charles Keeling installed a measuring device on top of the Mauna Loa volcano in Hawaii, far from any city, and set about measuring the concentration of carbon dioxide day after day. The graph that came out of it, still being updated, is one of the most important in the history of science: a line rising without a pause, with small annual sawteeth — the breathing of the northern hemisphere's forests, which absorb in summer and release in winter.",
          "From about 280 parts per million before industrialization we've gone to more than 420. And we know that carbon comes from burning fossil fuels and not from a volcano or the sea, because carbon atoms of fossil origin have a different isotopic signature: it's like a fingerprint.",
          "What holds all this up isn't a single study, it's the agreement of many independent sources: thermometers all over the planet since the 19th century, ocean buoys, satellites, glacier retreat measured against photographs from a century ago, sea level rise, plant flowering dates, and air bubbles trapped in the ice of Greenland and Antarctica that let us reconstruct the atmosphere of hundreds of thousands of years ago.",
          "And there's one occasion when this science worked exemplarily, and it's worth remembering, because it shows it can be done. In the seventies it was discovered that certain gases used in aerosols and fridges were destroying the ozone layer; satellites confirmed the hole over Antarctica; and in 1987 a treaty was signed banning those gases worldwide. The ozone layer is recovering. It was science, warning, agreement and solution.",
          "That's the role science has ended up having in this story: as well as explaining the world, warning us. What gets done with the warning is no longer a scientific question: it's a political and moral decision, and therefore everybody's.",
        ],
        dato: "Fun fact: Eunice Foote published her experiment three years before Tyndall, and her name was recovered in 2011 thanks to the research of a geologist digging through old conference records. For 155 years, the first person to link carbon dioxide with the warming of the planet appeared in no book at all.",
      },
      "ciencia-no-termina": {
        titulo: "Science doesn't end",
        cuerpo: [
          "After thousands of years trying to understand the world, we've discovered something surprising.",
          "We've gone from looking at the sky in fear to measuring the universe; from believing the Earth was the centre of everything to understanding that we're a small planet going round an ordinary star.",
          "Every civilization, every era, added a piece: numbers, method, reason, the experiment, honest doubt.",
          "And yet, the more we know, the more new questions appear. We don't know what most of the universe is, how life arose or exactly how our own minds work.",
          "That's perhaps the greatest lesson of this journey: science isn't a pile of closed answers, it's a way of going on asking, with humility and courage.",
          "Knowledge doesn't end in a book or in an era. It carries on in every curious person who dares to ask «why?». In you too.",
        ],
      },
    },
  },
};
