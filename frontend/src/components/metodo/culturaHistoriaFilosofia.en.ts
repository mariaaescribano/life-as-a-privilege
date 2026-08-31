// ─────────────────────────────────────────────────────────────────────────
// HISTORIA DE LA FILOSOFÍA, EN INGLÉS · solo el texto.
//
// Emparejado por la `key` de la era y la `key` del momento con
// `culturaHistoriaFilosofia.ts`. El orden, las claves y las fotos salen SIEMPRE
// del español; lo que falte aquí se lee en español (ver `culturaHistorias.en.ts`).
//
// CONVENIOS (los mismos en las seis Historias):
//   · «a. C.» → BC   ·  «d. C.» → AD   ·  «s. IV a. C.» → 4th c. BC
//   · La coma decimal pasa a punto y el punto de los miles a coma (2.500 → 2,500).
//   · «Dato curioso:» → «Fun fact:»   ·  el segundo, «Fun fact II:».
//   · Los nombres y términos con su grafía inglesa de siempre (Lao Tzu, Tao Te
//     Ching, Zhuangzi, Averroes…), no una retraducción del español.
//   · Voz de María: segunda persona, contracciones naturales, frases cortas.
// ─────────────────────────────────────────────────────────────────────────
import type { HistoriaTexto } from "./culturaHistorias.en";

export const HISTORIA_FILOSOFIA_EN: HistoriaTexto = {
  // ── Antes de la filosofía ──────────────────────────────────────────────
  "antes-filosofia": {
    titulo: "Before philosophy",
    anio: "Up to the 6th century BC",
    momentos: {
      "mito-logos": {
        titulo: "From myth to logos",
        fecha: "≈6th century BC",
        cuerpo: [
          "For thousands of years, nearly every civilization had explained the world through myths. If there was a storm, it was because a god was angry. If the sun came up every morning, it was because some divinity was guiding it across the sky. Natural events depended on the will of the gods.",
          "In the Greek cities of Asia Minor, though, a completely new idea started to appear. Some thinkers stopped asking which god caused a phenomenon and began asking what natural cause produced it.",
          "That was a genuine intellectual revolution.",
          "For the first time, somebody was trying to understand the universe without falling back on religion. Instead of accepting the traditional explanations, they observed nature, argued with each other and looked for rational arguments.",
          "The logos had been born — a Greek word you can translate as reason, explanation or rational thought.",
          "Many historians consider this moment the birth not only of philosophy, but of science too.",
        ],
        dato: "Fun fact: the word logic comes precisely from logos, because both share the idea of reasoning by following arguments instead of relying purely on tradition or authority.",
      },
      "egipto-mesopotamia": {
        titulo: "Egypt and Mesopotamia",
        fecha: "Millennia before philosophy",
        cuerpo: [
          "Long before the Greek philosophers appeared, the civilizations of Egypt and Mesopotamia had already developed astonishing knowledge of mathematics, astronomy, medicine and political organization.",
          "Priests watched the sky to predict the flooding of the Nile or to draw up calendars, while scribes and scholars gathered knowledge about geometry, farming and law. All of that learning, though, was tightly bound up with religion and with the authority of the rulers.",
          "Philosophy would be born when some thinkers decided to separate knowledge from religious tradition and ask whether things could be explained by reason.",
        ],
      },
      "vedas-upanishads": {
        titulo: "The Vedas and the Upanishads",
        fecha: "≈1500–500 BC",
        cuerpo: [
          "While philosophy was starting to develop in Greece, texts were appearing in India that raised deeply philosophical questions about existence.",
          "The Vedas collected ancient hymns and religious teachings, but it was the Upanishads that introduced questions still being reflected on today: what is the soul? What relation is there between the individual and the universe? What does it mean to reach true freedom?",
          "Many of the ideas that would later make up Hinduism were born in these texts, which mix religion and philosophy in a way that's hard to pull apart.",
        ],
        dato: "Fun fact: the Upanishads were written several centuries before Plato and were already discussing questions about consciousness, identity and reality that are still debated in contemporary philosophy.",
      },
      "sabios-china": {
        titulo: "China's first sages",
        fecha: "≈6th century BC",
        cuerpo: [
          "While the Greek philosophers were trying to discover what the cosmos was made of, in China some thinkers were turning their attention to everyday life and to human relationships.",
          "An intellectual tradition began to grow there in search of harmony, balance and good government. Very soon figures like Confucius and Lao Tzu would appear, and their teachings would shape hundreds of millions of people for more than two thousand years.",
          "Their way of thinking was different from the Greek one, but it was chasing the same goal: understanding human beings and their place in the world a little better.",
        ],
      },
      "por-que-nacio": {
        titulo: "Why was philosophy born?",
        fecha: "≈6th century BC",
        cuerpo: [
          "For thousands of years human beings had made do with the explanations myths gave them. So why, around the 6th century BC, did some people start looking for answers through reason?",
          "It was no accident that it happened in the Greek cities. Very particular conditions came together there. Trade brought peoples with wildly different gods and customs into contact, which made you suspect that no single version of the world was the only true one.",
          "On top of that, the Greeks had no all-powerful priestly caste imposing a single explanation. Any citizen could argue, ask questions and put forward ideas of their own in the public square.",
          "The alphabet, simple and within everyone's reach, made it possible to write arguments down and compare them. And part of the population had free time to devote to thinking.",
          "So, little by little, curiosity stopped settling for «the gods willed it so» and started asking «why?». Philosophy had been born.",
        ],
        dato: "Fun fact: the word philosophy literally means «love of wisdom». Tradition has it that Pythagoras used it first, because he said he wasn't a wise man, just someone who loved and sought wisdom.",
      },
    },
  },

  // ── Los primeros sabios ────────────────────────────────────────────────
  "primeros-sabios": {
    titulo: "The first sages",
    anio: "≈1200–500 BC",
    momentos: {
      zoroastro: {
        titulo: "Zoroaster",
        fecha: "≈1200–1000 BC (date disputed)",
        cuerpo: [
          "In ancient Persia, a priest called Zarathustra — Zoroaster to the Greeks — asked one of the hardest questions there is, and gave it an answer of admirable logical cleanness: evil doesn't come from the divine, it comes from an opposing principle, and the whole universe is the stage of that struggle.",
          "On one side Ahura Mazda, the Wise Lord: light, truth and order. Facing him, the spirit of destruction and of the lie. And in the middle, every person with one decisive capacity: to CHOOSE.",
          "That's his philosophical contribution. Before him, human beings were the object of the gods' decisions; with him they become moral agents with freedom and responsibility. His formula sums it up: good thoughts, good words, good deeds. No ritual can stand in for those three things.",
          "His idea of time was new too. Against the cyclical time of almost every ancient culture, he proposed a history with a direction and an ending: there will be a judgement, good will win and the world will be made new. It's the first appearance of the idea of progress toward an outcome, and the whole later Western tradition drinks from it, including the modern notion that history is going somewhere.",
          "You can trace the consequences. When the Jewish people were under Persian rule, individual judgement, angels, the devil, resurrection and the end of time appear or develop in their texts; from there they pass into Christianity and Islam. Half of humanity thinks today with categories first formulated on that Iranian plateau.",
          "His philosophical core is in a set of hymns, the Gathas, attributed directly to him and passed on orally for centuries.",
        ],
        dato: "Fun fact: Nietzsche picked precisely his name for the character in «Thus Spoke Zarathustra», because he wanted the first man to split the world into good and evil to be the one announcing the end of that split.",
      },
      confucio: {
        titulo: "Confucius",
        fecha: "≈551–479 BC",
        cuerpo: [
          "Confucius lived in a China broken into kingdoms at endless war with each other, with corrupt nobles and ruined peasants. His diagnosis was unusual for a moment like that: the problem isn't a shortage of laws or armies, it's a shortage of character.",
          "His central claim is that social order isn't imposed from above, it's caught like a cold. A ruler who punishes a lot gets fear and cheating; a ruler who behaves well gets everyone else wanting to be like him. Governing by virtue, he said, is like the pole star: it stays still and all the others turn around it.",
          "He has four key concepts and they're worth understanding. Ren, humanity or benevolence: the ability to put yourself in someone else's place. Li, rites and manners, which he didn't think were trivia but the daily training of respect — greet people properly a thousand times and you end up genuinely respecting them. Xiao, respect for parents and elders, which was the model for every other relationship. And junzi, the exemplary person, who isn't exemplary by birth but by conduct.",
          "That last point is the most revolutionary: he turned nobility into something you earn rather than inherit. In an aristocratic society, saying that an educated, decent peasant was nobler than an unworthy prince was subversive.",
          "And five centuries before the Gospel, he came up with his own version of the golden rule, in the negative: don't do to others what you wouldn't want done to you.",
          "He died convinced he'd failed: he spent his life looking for a ruler who would apply his ideas and none of them did for long. His disciples collected his teachings in the Analects, a book of extremely brief conversations. In time they became the basis of education and administration in China, Korea, Japan and Vietnam for more than two thousand years.",
        ],
        dato: "Fun fact: for thirteen centuries, becoming an official of the Chinese Empire meant passing brutal exams on the Confucian classics, open in theory to any man. It was the world's first system that chose its governors by examination rather than by family, and it lasted until 1905.",
      },
      confucianismo: {
        titulo: "Confucianism",
        fecha: "From the 5th century BC",
        cuerpo: [
          "Confucianism is a case that forces you to stretch the categories: no creator god, no revelation, no promise of salvation, no clergy. And yet it has temples, rites, a canon of texts and a complete morality. More than anything, it's a practical philosophy turned into a culture.",
          "Its core is that society works if each person does well what falls to them in each of their relationships: son to father, younger brother to elder, subject to ruler, friend to friend. And the obligation runs both ways: the son owes respect, but the father owes care; the subject owes loyalty, but the ruler owes justice. If the one above fails, he loses his moral authority — and that's the argument that legitimized a great many rebellions in China.",
          "Its great philosophical bet is education. For Confucianism, human nature can be improved and study is a moral duty, not a luxury or an ornament. Hence the prestige of the teacher, the exam and school effort across the whole of East Asia to this day.",
          "And its great internal argument is a beauty: two centuries later, Mencius held that people are born good and that all you have to do is cultivate that seed, while Xunzi held that they're born selfish and that only education and rules civilize them. It's exactly the debate Rousseau and Hobbes will have in Europe two thousand years later.",
          "Its questionable side is the other face of the same thing: a very marked hierarchy, a strong subordination of women in its traditional formulation, and a tendency to value harmony above dissent that has served to justify authoritarian rule.",
          "Its recent history proves ideas are never still: it was furiously attacked during China's Cultural Revolution, with temples destroyed and scholars persecuted, and over the last few decades the Chinese state itself has rehabilitated it and exports it as a cultural emblem.",
        ],
        dato: "Fun fact: the documented family tree of Confucius's family is probably the longest in the world: it's been recorded for some 2,500 years and gathers more than two million identified descendants.",
      },
      laotse: {
        titulo: "Lao Tzu",
        fecha: "≈6th–4th century BC (traditionally)",
        cuerpo: [
          "While Confucius was proposing order, education and rites, tradition credits Lao Tzu with the opposite idea: the universe already works on its own, and a good part of our suffering comes from forcing it.",
          "His book, the Tao Te Ching, has eighty-one very short chapters and about five thousand characters, and it's deliberately written in an elusive way, full of paradoxes: the one who knows doesn't speak; the soft defeats the hard; it's the emptiness that makes a cup useful.",
          "His favourite image is water. Water doesn't fight, it yields, it goes around the obstacle, it looks for the lowest point… and it ends up cutting through rock. For him, that's the true shape of strength, and the human mistake is confusing strength with rigidity.",
          "From there comes his most famous and most misunderstood concept: wu wei, «non-action». It doesn't mean folding your arms: it means acting without forcing, at the right moment and with the minimum effort needed, like the good rider who doesn't fight the horse or the carpenter who cuts along the grain of the wood. Anyone who has learned to swim or to play an instrument recognizes the difference between fighting something and letting it flow.",
          "Applied to government it was almost anarchist: the best ruler is the one who intervenes least, and the best-governed people are the ones who barely notice they're being governed. Precisely the opposite of the Confucian programme.",
          "The legend of his life fits his philosophy: he was a court archivist, got sick of the corruption, headed west on the back of a buffalo and, on reaching the last mountain pass, was asked by the guard to write his thought down before disappearing. He wrote the book and left. Nobody ever saw him again.",
        ],
        dato: "Fun fact: some historians doubt Lao Tzu existed as a specific person; it may be the name under which the sayings of several sages were gathered. And even so, the Tao Te Ching is, after the Bible, one of the most translated books in history: into English alone it has more than two hundred and fifty versions.",
      },
      taoismo: {
        titulo: "Taoism",
        fecha: "From the 4th century BC",
        cuerpo: [
          "Taoism teaches that everything follows a natural principle called the Tao, «the way», and its opening line is already a first-rate philosophical warning: the Tao that can be named is no longer the Tao. Which is to say, there are realities that language deforms when it tries to pin them down. Twenty-five centuries later, that same idea will resurface in Wittgenstein and in the philosophy of language.",
          "Its symbol is famous and almost always misunderstood: yin and yang aren't good and evil. They're two complementary forces — darkness and light, cold and heat, stillness and movement — that need each other, that turn into each other and that each carry a dot of the other inside. In this logic, illness isn't the presence of evil: it's an imbalance.",
          "Out of that idea come traditional Chinese medicine, tai chi, qigong, the concept of qi and a whole culture of the body and of space.",
          "Its second master, Zhuangzi, is one of the world's great philosophers and he writes with humour, which is extremely rare in philosophy. He tells how one night he dreamed he was a butterfly and that on waking he didn't know whether he was a man who had dreamed he was a butterfly or a butterfly now dreaming it was a man. In four lines he laid out the problem of the criterion of reality that Descartes would develop two thousand years later.",
          "Over the centuries, philosophical Taoism also turned into an organized religion, with temples, gods and a characteristic obsession with longevity, pursued through diets, breathing, exercises and alchemy.",
          "And that search had an absurd, enormous historical consequence: while mixing minerals in search of the elixir of eternal life, some Taoist alchemists hit on a combination of saltpetre, sulphur and charcoal that exploded. They had invented gunpowder. The substance that would change warfare across the whole planet came out of the search for not dying.",
        ],
        dato: "Fun fact: several Chinese emperors died poisoned by the immortality elixirs their alchemists prepared for them, made with mercury. Looking to live forever, they poisoned themselves.",
      },
      buda: {
        titulo: "The Buddha",
        fecha: "≈6th century BC",
        cuerpo: [
          "Siddhartha Gautama was the son of a nobleman in northern India and grew up, according to tradition, shielded from anything unpleasant. One day he left the palace and saw for the first time an old man, a sick man and a corpse. It broke his life open: he understood that nothing he had would save him from that.",
          "Meditating under a tree he reached what he called the awakening, and from then on he was the Buddha, «the awakened one». He didn't claim to be a god, or an envoy, or a prophet: he said he had understood something, and that anyone could check it for themselves. Philosophically, that makes him a very rare case among the founders of traditions.",
          "His account is the Four Noble Truths, and it's built exactly like a medical consultation: there is suffering; the suffering has a cause; if you remove the cause, it stops; and there is a treatment.",
          "The cause he pointed to is thirst: the constant craving for things to be other than they are, and the clinging to their staying put when everything changes. And the treatment is the Eightfold Path, which combines ethics, attention and meditation, without demanding that you believe anything on faith.",
          "His hardest and most powerful idea is that there's no fixed «self». What we call our identity is a process, a river of sensations, thoughts and habits that changes without stopping. A good part of suffering, he said, comes from defending something that isn't there. It's the exact opposite of Plato's immortal, unchanging soul, and one of the two great answers humanity has given to the question of what we are.",
          "And his other revolution was social: he taught anyone, of any caste, including women and people considered impure, and in the language of the people rather than the Sanskrit of the priests.",
        ],
        dato: "Fun fact: his last words, according to the texts, are an uncomfortable instruction for any school: don't depend on me, be your own lamp.",
      },
      "budismo-filosofia": {
        titulo: "Buddhism as philosophy",
        fecha: "From the 6th century BC",
        cuerpo: [
          "Whether Buddhism is a religion or a philosophy of mind has been argued about in the West for decades, and the honest answer is that it depends which Buddhism you look at. It has temples, monks, rites and popular devotion, like a religion; and at the same time it has an analysis of the mind, a theory of knowledge and an ethics you can study without believing anything, like a philosophy.",
          "Its strictly philosophical side is extremely sophisticated. It holds three claims about reality: everything is impermanent (nothing that exists stays the same); nothing has an independent essence (everything exists in relation to other things and through causes); and suffering is born of treating what changes as though it were fixed.",
          "Out of that comes an analysis of the self that Western philosophy didn't reach until the 18th century: when you go looking for «your self» all you find are sensations, perceptions, memories and impulses following one another. It's exactly what David Hume will say on examining his own mind and finding nothing but «a bundle of perceptions». Hume never read the Buddha, but he arrived at the same place.",
          "Its other contribution is one of method: it proposes trained introspection as a form of knowledge. Instead of reasoning about the mind from outside, observing your own mind systematically over years. The West ignored it for centuries and today studies it with scanners: there are hundreds of studies on what meditation does to the brain, and the Dalai Lama has spent decades organizing meetings with neuroscientists.",
          "And the most visible result of that crossing is in the clinic: the mindfulness prescribed today for chronic pain, anxiety and the prevention of depressive relapse is a deliberately secular adaptation of Buddhist attention meditation, designed in the late seventies.",
          "That's its place in this story: a tradition that, with no god and no dogma, asked 2,500 years ago the questions psychology and philosophy of mind are answering now.",
        ],
        dato: "Fun fact: Schopenhauer, the first European philosopher to read translated Buddhist texts, was so struck that he kept a statue of the Buddha on his desk beside a bust of Kant. He said he'd reached very similar conclusions on his own without knowing them.",
      },
    },
  },

  // ── Grecia descubre la razón ───────────────────────────────────────────
  "grecia-razon": {
    titulo: "Greece discovers reason",
    anio: "6th–5th centuries BC",
    momentos: {
      "tales-mileto": {
        titulo: "Thales of Miletus",
        fecha: "≈624–546 BC",
        cuerpo: [
          "Thales is usually considered the first philosopher of the West. His great merit wasn't getting his answers right, it was changing the way the questions were asked.",
          "Observing nature, he came to the conclusion that water was the principle of everything. He'd seen that living things need water to live, that rain makes plants grow and that water can turn into ice or steam. He thought perhaps the whole of reality came from that element.",
          "Today we know he was wrong, but that's almost beside the point. What really mattered was that he tried to explain the universe through a natural cause and not through a myth.",
          "As well as a philosopher, Thales was a mathematician and an astronomer. Tradition says he even predicted a solar eclipse, something that deeply impressed his contemporaries.",
        ],
        dato: "Fun fact: Aristotle said philosophy began with Thales because he was the first to look for a rational principle to explain the universe.",
      },
      anaximandro: {
        titulo: "Anaximander",
        fecha: "≈610–546 BC",
        cuerpo: [
          "A pupil of Thales, Anaximander thought water couldn't explain everything. If water is wet, how could it give rise to fire, which is dry?",
          "So he proposed a much more abstract idea: the origin of everything was the apeiron, an infinite, eternal, undefined substance out of which all things were born and to which they all returned.",
          "It was an extraordinarily modern idea, because he was no longer looking for a visible substance but for a universal principle.",
          "He also drew one of the first known maps of the world and argued that the Earth floated freely in space, resting on nothing at all.",
        ],
        dato: "Fun fact: some consider Anaximander the first scientist in history for trying to explain natural phenomena without resorting to supernatural causes.",
      },
      anaximenes: {
        titulo: "Anaximenes",
        fecha: "≈586–526 BC",
        cuerpo: [
          "Anaximenes went back to looking for a specific element as the origin of the universe, and he chose air.",
          "His argument wasn't arbitrary: air is invisible but it's everywhere, it moves by itself, it's what we breathe — that is, it seems to be life itself — and, above all, you can watch it change state. That last point is the important one.",
          "He thought that by condensing, air turned into cloud, then water, then earth and stone; and that by expanding and heating it turned into fire. Today we know it doesn't work like that, but look at what he's doing: he's proposing a MECHANISM — condensation and rarefaction — to explain how a single substance can give rise to such different things.",
          "That's an enormous step beyond Thales. It's not enough to say what the principle of everything is: you have to explain how it transforms. It's the first time anyone tries to answer the «how» and not just the «what».",
          "And there's something almost moving about his method: he leaned on experiences anyone could check. He said that if you blow with your mouth wide open the air comes out warm, and that if you blow with your lips pursed it comes out cold. His physics was wrong; his attitude — look, test, explain — is the attitude of science.",
        ],
        dato: "Fun fact: the first three philosophers in history — Thales, Anaximander and Anaximenes — were all from the same city, Miletus, and they were teacher and pupils. Philosophy wasn't born from a lone genius: it was born from a conversation between neighbours that lasted two generations.",
      },
      pitagoras: {
        titulo: "Pythagoras",
        fecha: "≈570–495 BC",
        cuerpo: [
          "Pythagoras is known for the famous theorem that bears his name, but he was far more than a mathematician.",
          "He believed the essence of the universe wasn't material elements but mathematics. He noticed that music, geometry and the movement of the stars all followed numerical proportions, and concluded that the whole cosmos was governed by numbers.",
          "For him, understanding mathematics was drawing closer to the order of the universe.",
          "His school also argued for the immortality of the soul and for reincarnation, showing how in antiquity philosophy, mathematics and religion were still deeply bound together.",
        ],
        dato: "Fun fact: the Pythagoreans discovered that pleasant musical notes follow very precise mathematical proportions.",
      },
      heraclito: {
        titulo: "Heraclitus",
        fecha: "≈540–480 BC",
        cuerpo: [
          "Heraclitus observed that everything is constantly changing. Rivers flow, the seasons follow one another, people age and nothing stays still.",
          "That's why he said: «No one can bathe twice in the same river».",
          "Not because the river disappears, but because both the water and the person have already changed.",
          "For Heraclitus, change was the fundamental law of the universe. Reality wasn't something fixed, but a continuous flow.",
        ],
        dato: "Fun fact: the idea that everything is in constant change still shapes physics, biology and many modern philosophical currents today.",
      },
      parmenides: {
        titulo: "Parmenides",
        fecha: "≈515–450 BC",
        cuerpo: [
          "Parmenides argued exactly the opposite of Heraclitus.",
          "If something changes, he said, it stops being what it was. But nothing can arise out of nothing. Therefore true being must be eternal, single and unchanging.",
          "According to him, our senses deceive us into believing the world is constantly changing. Only reason can show us authentic reality.",
          "And with that he did something that marked philosophy forever: he separated two paths of knowledge. The path of the senses, which shows us a varied, changing world, and the path of reason, which tells us what MUST be by pure logic. And he decided that when the two contradict each other, reason wins.",
          "He was also the first to reason the way we reason in mathematics today: not describing what he saw, but deducing step by step from a principle. His principle was simple and devastating: what is, is; what is not, is not. And from that he concluded that being can't come out of non-being, so nothing can begin to exist or cease to exist.",
          "For centuries, philosophers tried to resolve this enormous contradiction: is Heraclitus right that everything changes? Or is Parmenides right that change is an illusion?",
          "A large part of later philosophy will try to answer precisely that question.",
        ],
        dato: "Fun fact: he wrote his philosophy in verse, in a poem where a goddess shows him the path of truth. The coldest, most logical thought of antiquity was handed down in the form of an epic poem.",
        extras: [
          {
            titulo: "The great argument: does everything change or does nothing change?",
            cuerpo: [
              "It's worth stopping here, because this clash is the engine of almost all later Western philosophy and it isn't an abstract argument at all.",
              "HERACLITUS says: look around. Nothing stays. The river, your body, this city, your opinions. The only stable thing is the law of change itself. What's real is the process.",
              "PARMENIDES answers: if something really changes, then something that didn't exist starts to exist. And nothing comes out of nothing. Therefore the change you see is appearance; what really is has to be eternal and can't move.",
              "To defend him, his pupil Zeno invented some paradoxes that are extremely famous and that took two thousand years to resolve. The best known: Achilles can't catch a tortoise that has a head start, because by the time he reaches where the tortoise was, the tortoise will have moved on a little, and so on infinitely. Since the reasoning seems flawless and the fact is obvious, Zeno's conclusion was that movement is an illusion. Today we know the way out lies in how infinite series add up, and those paradoxes pushed the development of calculus and of the modern idea of a limit.",
              "So how did they get out of the deadlock? With attempts at synthesis. Empedocles proposed four elements that are neither born nor die and only combine. Democritus proposed eternal atoms — Parmenides was right about those — moving in the void and recombining — Heraclitus was right about what we see. And Plato split reality in two: a world of eternal, unchanging Ideas (Parmenides) and a sensible world in permanent flux (Heraclitus).",
              "Notice Plato's move, because half of the West comes out of it: if what's true is what doesn't change, then the eternal is worth more than the temporal, the soul more than the body, the idea more than the thing. That hierarchy passed into Christianity and organized European thought for two millennia.",
              "And today science has returned a mixed verdict, which would have interested both of them: there are conservation laws saying matter and energy are neither created nor destroyed — that's Parmenides — and a description of the universe as an expanding process, with particles that transform and systems that organize and come apart — that's Heraclitus.",
              "And it's still alive in very personal things. When you wonder whether you're the same person you were twenty years ago, when a company changes and argues about whether it's still the same company, or when someone with dementia stops recognizing themselves, you're in the middle of this 2,500-year-old argument.",
            ],
            dato: "Fun fact: Heraclitus wrote so obscurely and so disdainfully that they nicknamed him «the Obscure», and the story goes that he withdrew to live in the mountains eating grasses out of contempt for his fellow citizens. Parmenides, on the other hand, was a respected lawgiver of his city. The two most opposed philosophers in history were opposites in how they lived, too.",
          },
        ],
      },
      empedocles: {
        titulo: "Empedocles",
        fecha: "≈494–434 BC",
        cuerpo: [
          "Empedocles proposed a middle solution. The universe wasn't made of a single element, but of four: earth, water, air and fire.",
          "These elements never disappear; they simply mix and separate thanks to two forces he called Love and Strife.",
          "Although today we know matter doesn't work like that, his theory of the four elements would dominate Western science for almost two thousand years.",
        ],
      },
      democrito: {
        titulo: "Democritus",
        fecha: "≈460–370 BC",
        cuerpo: [
          "Democritus imagined that if we divided any object again and again, we'd end up reaching particles so small they could no longer be broken.",
          "He called them atoms, a word that in Greek means precisely «indivisible».",
          "His model was astonishingly complete: eternal, indestructible atoms of different shapes and sizes, moving in the void, hooking together and coming apart. Everything that exists — a stone, a tree, you — is a temporary combination of those pieces, and when something is destroyed nothing disappears: the combination just comes undone. Sweetness, bitterness, colour and smell wouldn't be in things, but in how those shapes affect our senses.",
          "And here's the truly radical part: his universe needs no purpose and no god. Everything happens through the mechanical collision of particles, with no plan and no end in view. It's the first completely materialist explanation of reality, and that's why it was fought so hard: Plato, who loathed him, doesn't mention him once in his entire work, and not one of his books has survived, only quotations in other people.",
          "He applied that logic to human beings too: he thought the soul was made of especially fine, mobile atoms, and that it therefore also came apart at death. Hence his ethics, which was serene and very unsolemn: if there's no reward or punishment afterward, the goal is to live in good spirits, without useless fears and without excess. They called him «the philosopher who laughs».",
          "He had no microscopes or experiments to prove it, but his intuition was extraordinary. More than two thousand years later, when chemistry started weighing reactions and confirming that elements combine in fixed proportions, science recovered his idea and even his word.",
        ],
        dato: "Fun fact: although today's atoms can in fact be split, Democritus was the first to imagine that all matter was made of tiny particles.",
      },
    },
  },

  // ── El hombre en el centro ─────────────────────────────────────────────
  "hombre-centro": {
    titulo: "Human beings at the centre",
    anio: "5th–4th centuries BC",
    momentos: {
      sofistas: {
        titulo: "The sophists",
        fecha: "≈5th century BC",
        cuerpo: [
          "The sophists were Greece's first great professional teachers. They travelled from city to city teaching oratory, politics and argument in exchange for money.",
          "In a democracy like the Athenian one, speaking well was a fundamental skill. A good speech could convince an assembly, win a trial or reach power.",
          "Many sophists argued that truth depended on each person and each situation. The most famous of them, Protagoras, summed the idea up in a line that's still being debated today: «Man is the measure of all things».",
          "For some philosophers, this meant there was no universal truth, only different, equally valid points of view.",
          "Others, like Socrates, thought that idea was very dangerous.",
        ],
        dato: "Fun fact: although the sophists had a bad name for centuries because of Plato's criticisms, many historians today consider them excellent educators who contributed enormously to the development of Athenian democracy.",
      },
      socrates: {
        titulo: "Socrates",
        fecha: "470–399 BC",
        cuerpo: [
          "Socrates never wrote a single book. Everything we know about him comes mainly from his pupil Plato.",
          "Instead of giving answers, Socrates asked questions. A lot of questions.",
          "He believed most people claimed to know things they'd never actually thought about deeply. So he walked the streets of Athens talking with politicians, craftsmen, poets and young men, asking them questions until they uncovered the contradictions in their own ideas.",
          "That method is known today as the Socratic method.",
          "His aim wasn't to humiliate anyone, but to teach that recognizing your own ignorance is the first step toward knowledge.",
          "His most famous line sums that attitude up perfectly: «I only know that I know nothing».",
          "His way of questioning the authorities and traditional beliefs ended up earning him plenty of enemies. In 399 BC he was accused of corrupting the young and of not respecting the gods of Athens.",
          "He was sentenced to death. He could have escaped. He chose not to.",
          "He accepted the sentence and died drinking a cup of hemlock, because he believed a citizen should respect the laws even when they harmed him personally.",
        ],
        dato: "Fun fact: Socrates's death marked Plato deeply, and he would devote much of his life to trying to build a society where an injustice like that couldn't happen again.",
        extras: [
          {
            titulo: "How his method really worked",
            cuerpo: [
              "The Socratic method isn't «asking questions» in general: it's a technique with steps, and it's still used in law schools, in therapy and in good teaching.",
              "STEP 1. Someone confidently claims something. «I know perfectly well what courage is».",
              "STEP 2. Socrates asks for a definition, not an example. Not «name me someone brave», but «tell me what all courageous acts have in common».",
              "STEP 3. The other person gives a definition. «Courage is never retreating in battle».",
              "STEP 4. Socrates looks for a case that breaks it. «And the general who fakes a retreat to draw the enemy in and then wins? Isn't he brave?». The definition collapses.",
              "STEP 5. Another one is tried, and another. And many of Plato's dialogues end with NO answer: the conversation finishes by acknowledging that neither of them knew what they thought they knew. That isn't a failure, it's the point. The Greeks called it aporia, the moment of finding yourself with no way out, and without going through it you don't start really thinking.",
              "Socrates called this «midwifery»: he said he taught nothing, he only helped the other person give birth to what they already carried inside. Hence the name maieutics, which comes from the Greek word for midwife. His mother, according to tradition, was a midwife.",
              "He also said he was like a gadfly: an irritating fly nipping at a big, lazy horse — Athens — to keep it from falling asleep. He knew perfectly well he was being a nuisance.",
              "Behind it lies a moral idea, and it's the most disputed of all his: he believed nobody does wrong knowingly. If someone acts badly, it's because they're mistaken about what's good for them. So for Socrates, knowing well and living well are the same thing, and ignorance isn't an intellectual defect but an ethical problem.",
              "The method, incidentally, is incompatible with almost every system of power, and that's why his story ends the way it does.",
            ],
            dato: "Fun fact: when the oracle at Delphi said no one was wiser than he was, Socrates was baffled and set about interrogating the experts of Athens to disprove it. His conclusion was that the oracle was right by the tiniest of margins: the others didn't know and thought they did; he didn't know, and he knew it.",
          },
          {
            titulo: "The trial: why they killed a man for asking questions",
            cuerpo: [
              "In 399 BC, a court of some five hundred Athenian citizens tried Socrates, who was seventy, on two charges: not respecting the city's gods and introducing new divinities, and corrupting the young.",
              "The context explains a lot. Athens had just lost a devastating twenty-seven-year war against Sparta, had suffered an epidemic, a dictatorship of the Thirty Tyrants and two coups. It was humiliated, impoverished and looking for someone to blame. And several of Socrates's best-known pupils had been leading figures in that disaster: one betrayed the city and defected to Sparta, and another was one of the bloodiest of the tyrants. Socrates had done none of that, but he was «the teacher of those people».",
              "And there was an underlying, unwritten charge too: for decades he'd been showing in public that the most respected politicians, generals and poets couldn't justify what they said. That leaves a lot of accumulated resentment.",
              "At the trial he didn't do what was expected. Custom was to beg for mercy, bring the family in weeping, appeal to services rendered. He gave a speech saying he was doing the city a favour, that if they let him carry on he'd carry on exactly the same, and that «an unexamined life is not worth living». He was found guilty by a narrow margin.",
              "Then came the second vote, on the penalty. Athenian law let the convicted man propose an alternative, and offering exile or a reasonable fine was enough to save yourself. Socrates proposed, half joking, that the city ought to keep him for life the way it kept Olympic champions, and only afterward offered a small fine. The court, offended, voted for death by a far wider margin than the guilty verdict.",
              "His friends arranged his escape and would have paid for it without blinking. He refused, and his reasoning is the heart of the matter: he'd spent seventy years accepting the laws of Athens and benefiting from them, so breaking them when they harmed him would be exactly the inconsistency he criticized in everyone else. He also distinguished between the laws, which he thought just, and the particular sentence, which he thought mistaken.",
              "He drank the hemlock surrounded by his pupils, talking with them to the end. Plato, who wasn't there because of illness, wrote that scene, and with it created the first martyr in the history of thought: someone who dies not for his faith, but for his way of reasoning.",
              "And he left the West a question that still isn't settled: should you obey an unjust law? Socrates said yes and accepted death; Gandhi, Thoreau and Martin Luther King said no and accepted prison. All four were arguing about the same thing.",
            ],
            dato: "Fun fact: four years after executing him, Athens itself had second thoughts. According to some ancient sources, his accusers were condemned and a statue was raised to him. The city that killed him for asking too many questions ended up putting him on a pedestal.",
          },
        ],
      },
      platon: {
        titulo: "Plato",
        fecha: "427–347 BC",
        cuerpo: [
          "The execution of Socrates convinced Plato that the majority could be wrong. If Athens had condemned the wisest man he knew, perhaps democracy wasn't enough to guarantee justice.",
          "Plato then imagined that the world we perceive with our senses is only an imperfect copy of a far more perfect reality: the World of Ideas.",
          "According to him, when we see a tree, a horse or a person, we're looking at imperfect versions of an eternal, perfect Idea.",
          "To explain this theory he wrote one of the most famous stories in the whole history of philosophy: the Myth of the Cave.",
          "In it he describes prisoners who have lived chained since birth, looking only at the shadows cast on a wall. Since they've never seen anything else, they believe those shadows are the whole of reality. Only when one of them manages to get out of the cave does he discover the true world.",
          "For Plato, philosophers are precisely the ones who manage to leave the cave and understand authentic reality. That's why he argued that ideal rulers should be philosophers.",
        ],
        dato: "Fun fact: Plato founded the Academy of Athens, considered the first great institution devoted to teaching philosophy. It stayed open for almost nine hundred years, until the emperor Justinian closed it in the year 529.",
        extras: [
          {
            titulo: "The myth of the cave, explained",
            cuerpo: [
              "It's philosophy's most famous image and it's almost always told by halves. Here it is whole, because every piece means something.",
              "THE SCENE. Prisoners have been chained since childhood at the bottom of a cave, with their backs to the entrance, unable to turn their heads. Behind them there's a low wall, and behind that a fire. Between the fire and the wall, people pass carrying figures of objects and animals, whose shadows are cast on the wall the prisoners are watching. They also hear echoes of their voices, which seem to come from the shadows.",
              "FIRST KEY POINT: for those prisoners, the shadows are NOT an illusion they can recognize as such. They're the whole of reality. They have names for each shadow, they argue about them, they make predictions and they get them right. They have their own science of shadows. Nobody is deceived in the sense of feeling deceived: they're perfectly convinced.",
              "THE RELEASE. One of them is untied and forced to stand. And the first thing that happens is that he suffers: his legs hurt, the firelight hurts his eyes and what he sees at first seems LESS real than the shadows he was used to. Plato insists on this: getting out of error is painful and disorienting, and the first effect of truth is that it looks false.",
              "THE CLIMB. He's dragged out of the cave. At first he can only look at night, then at reflections in water, then at things themselves, and finally, after a while, at the sun. The sun is the Idea of the Good: the thing that makes it possible for everything else to be visible and understandable.",
              "THE RETURN, which is the part almost nobody tells and the most important. The one who has seen the light has an obligation to go back down and tell the others. And going down, two things happen to him: he arrives dazzled, so in the gloom he sees WORSE than those who never left and makes a fool of himself; and when he tells them that what they're looking at are shadows, they don't believe him, they laugh and — Plato says this in so many words — if they could, they'd kill him.",
              "And there's the punch: Plato is writing the death of Socrates. The cave is Athens, and the one who goes down to tell them is his executed teacher.",
              "WHAT EACH THING MEANS. The chains: habit, an education taken on without examination, prejudice. The shadows: the opinions we accept because everyone repeats them. The fire: apparent explanations. Getting out: education, which for Plato isn't stuffing facts into a head but turning the gaze somewhere else. And the outside world: intelligible reality, what's grasped by reason and not by the senses.",
              "And that's why it's a myth so resistant to time: it works just as well for talking about propaganda, information bubbles, advertising, a cult, a dysfunctional family or social media, where there's also a very effective science of shadows.",
            ],
            dato: "Fun fact: the myth appears in «The Republic», in a passage where Plato tells it in the voice of Socrates. The scene is doubly sad: it's the executed man explaining why they were going to execute him.",
          },
          {
            titulo: "The Republic: the just city and its uncomfortable side",
            cuerpo: [
              "«The Republic» isn't a book about politics, even though it looks like one. It starts with a personal question — why should I be just if I can come out ahead by being unjust? — and to answer it Plato builds an imaginary city, because he thinks the same pieces that are in a soul show up better at large scale.",
              "His answer is that there are three parts to the soul: the rational, which thinks; the spirited, which gets angry and wants honour; and the appetitive, which wants to eat, to own, to enjoy. A person is in good shape when reason governs, with spirit as its ally and the desires kept in order. When another part is in charge, life falls apart.",
              "And the city has the same structure: the philosopher-rulers, who know; the guardians, who defend; and the producers, who work and trade. Each group does its own job, and that's his definition of justice: each part performing its function without invading anyone else's.",
              "It has proposals that in the 4th century BC were enormously daring. Rulers can't own private property or wealth, so that they don't govern out of self-interest. They have to go through an extremely long curriculum — mathematics, geometry, astronomy, dialectic — and not take power until they're fifty. And women can be guardians and rulers on equal terms, with the same education and even the same physical training, something no Greek of his day had suggested.",
              "And it has others that horrify us today, and they have to be said: strict censorship of the poetry and music you're allowed to hear, selective births, collective rearing of the guardians' children, noble lies told by the state to keep everyone together, and a radical distrust of democracy, which he considered government by persuasion and whim, the step before tyranny.",
              "The 20th century read that programme with horror: Karl Popper accused it outright of being the first blueprint for a totalitarian society. Others answer that Plato never meant that city to be built, that it's a model for thinking about the soul and that he himself calls it «a city in words».",
              "Either way, here's his reality check: he tried three times to advise the tyrants of Syracuse in order to put his ideas into practice, failed spectacularly, and on one of those trips ended up, according to tradition, sold as a slave and ransomed by a friend. The philosopher who wanted philosophers governing found out first-hand what real politics is.",
            ],
            dato: "Fun fact: the word «academy» comes from the name of the place where he founded his school, a grove dedicated to a hero called Academus. And over its entrance, according to tradition, there was an inscription: «let no one enter here who doesn't know geometry».",
          },
        ],
      },
      aristoteles: {
        titulo: "Aristotle",
        fecha: "384–322 BC",
        cuerpo: [
          "Aristotle studied for twenty years at Plato's Academy, but ended up disagreeing with his teacher.",
          "While Plato was searching for perfect Ideas, Aristotle thought knowledge had to begin with careful observation of nature.",
          "He investigated practically every field imaginable: biology, zoology, logic, ethics, politics, physics, astronomy, rhetoric and poetry. That's why many consider him the first great scientist in history.",
          "He was also the tutor of a young prince called Alexander the Great, who years later would conquer one of the largest empires of antiquity and spread Greek culture across much of the known world.",
          "In ethics he defended the famous theory of the golden mean. Virtue, he said, is usually found between two extremes. Courage, for instance, lies between cowardice and recklessness. Generosity sits between miserliness and extravagance.",
          "His influence was so enormous that for almost two thousand years his works were studied as the highest authority in philosophy and science.",
        ],
        dato: "Fun fact: during the Middle Ages many Europeans knew Aristotle simply as «The Philosopher», because it was thought no other thinker had explained the world with such depth.",
        extras: [
          {
            titulo: "The tools he left us",
            cuerpo: [
              "Aristotle isn't just a philosopher with ideas: he's the man who built the instruments the West has thought with ever since. Four of them are still in daily use.",
              "1. LOGIC. He was the first to realize you can study the FORM of an argument independently of its content. His invention is the syllogism: all men are mortal; Socrates is a man; therefore Socrates is mortal. What matters is that the validity doesn't depend on our talking about Socrates: any argument with that structure works, and any argument with the wrong structure fails even if its conclusion happens to be true. With that he created the first tool in history for spotting crooked reasoning, and nothing genuinely new was added to it until the 19th century.",
              "2. THE FOUR CAUSES. To explain something, he said, you have to answer four different questions, and confusing them produces absurd arguments. What it's made of (material cause: the wood of the table). What form or structure it has (formal: the table design). Who or what produced it (efficient: the carpenter). And what it's for or what it tends toward (final: eating, writing). Modern science was built precisely by dropping the fourth from nature — a stone doesn't fall «in order to» reach the ground — but we go on using it without noticing every time we ask «and what's this for?».",
              "3. CLASSIFICATION. He was the first great biologist: he described and ordered hundreds of species, dissected animals, studied embryos by opening hen's eggs on successive days to watch how a heart develops, and noticed that dolphins bear live young and suckle them, so they couldn't be fish. Nobody took him seriously on that until the 18th century. His way of grouping by genus and species is the direct ancestor of biological classification.",
              "4. THE MEAN, which isn't lukewarmness. His ethics doesn't hand out rules: it says virtue is a point of balance that depends on the person and the situation, and that it's learned by HABIT, the way you learn an instrument. You don't become brave by reading about bravery, but by doing brave things until you're good at it. Out of that comes a very modern idea: character can be trained.",
              "And his ultimate goal has a name of its own: eudaimonia, usually translated as happiness but closer to «a flourishing life». It isn't a pleasant mood, it's a whole life well lived, with friendships, activity, virtue and a certain amount of material luck. It's the most influential Greek answer to the question of what all this is for, and today it's quoted constantly again in positive psychology.",
            ],
            dato: "Fun fact: practically everything he wrote for publication has been lost, and the ancients said it was extremely elegant. What we have are his lecture notes, dense and difficult: we've built two thousand years of thought on a teacher's notes.",
          },
        ],
      },
      "legado-tres-gigantes": {
        titulo: "The legacy of three giants",
        cuerpo: [
          "Rarely in history have three people had so much influence on the way humanity thinks.",
          "Socrates taught us to question everything through dialogue.",
          "Plato imagined a world governed by ideas and reason.",
          "Aristotle argued that knowledge begins with observing reality.",
          "For more than two thousand years, practically every philosopher has been in conversation with, arguing against, or trying to improve on the ideas of one of them.",
          "Even today, when we debate justice, education, science or politics, we're still using questions they formulated almost two and a half thousand years ago.",
        ],
      },
    },
  },

  // ── Cómo vivir una buena vida ──────────────────────────────────────────
  "buena-vida": {
    titulo: "How to live a good life",
    anio: "The Hellenistic world and Rome",
    momentos: {
      "diogenes-cinismo": {
        titulo: "Diogenes and Cynicism",
        fecha: "≈412–323 BC",
        cuerpo: [
          "Diogenes of Sinope was probably the most outlandish philosopher of antiquity.",
          "He thought society made people unhappy because it filled them with unnecessary desires: wealth, fame, power, luxury, recognition. To prove it he decided to live with the bare minimum.",
          "Tradition says he lived in a huge clay jar — often called a «barrel» — and owned so little that, on seeing a child drink water with his hands, he threw away his only bowl, saying: «That child lives with fewer things than I do».",
          "For Diogenes, true freedom meant not depending on anything that could be lost.",
          "His provocative attitude made the powerful uncomfortable. The most famous anecdote has Alexander the Great going to visit him and asking whether he could grant him any wish. Diogenes simply answered: «Yes. Move aside, you're blocking my sun».",
          "With that line he wanted to show that even the most powerful man in the world had nothing to offer that he actually needed.",
        ],
        dato: "Fun fact: the word «cynic» comes from the Greek kynikos, meaning «like a dog», because the followers of this school argued for a simple life well away from social conventions.",
      },
      "epicuro-epicureismo": {
        titulo: "Epicurus and Epicureanism",
        fecha: "341–270 BC",
        cuerpo: [
          "Today a lot of people use the word «epicurean» to describe someone who enjoys the finer pleasures. Epicurus, though, taught almost exactly the opposite.",
          "For him, happiness didn't consist in eating a lot, piling up riches or chasing constant luxury. All of that generated new desires and, with them, new worries.",
          "Real happiness was living serenely, surrounded by good friends, enjoying small things and avoiding unnecessary fears.",
          "He also argued that we shouldn't fear death. His argument was surprisingly simple: «While we exist, death isn't here. When death comes, we no longer exist».",
          "So worrying about it constantly made no sense.",
          "Epicurus founded a school known as the Garden, where men and women studied together — very unusual at the time.",
        ],
        dato: "Fun fact: Epicurus considered friendship one of the greatest pleasures a human being could experience.",
      },
      "zenon-estoicismo": {
        titulo: "Zeno and Stoicism",
        fecha: "≈334–262 BC",
        cuerpo: [
          "Zeno of Citium noticed that a large part of human suffering is born of trying to control things that depend on chance: health, wealth, other people's opinions, events in the world.",
          "So he taught an idea that's still remarkably current: we have to distinguish between what depends on us… and what doesn't.",
          "We can't control an illness, a storm or other people's behaviour. We can control our decisions, our actions and our attitude toward problems.",
          "For the Stoics, true freedom consists in governing yourself.",
          "Centuries later, emperors like Marcus Aurelius, slaves like Epictetus and politicians like Seneca would develop this philosophy into one of the most influential in history.",
          "Today Stoicism is having an enormous revival, and many of its ideas are used even in modern psychology.",
        ],
        dato: "Fun fact: Marcus Aurelius wrote one of Stoicism's most famous books, the Meditations, while running the Roman Empire and fighting military campaigns. He didn't write it to publish: they're notes to himself, which is why he repeats himself so much. It's the private diary of the most powerful man in the world trying not to become insufferable.",
        extras: [
          {
            titulo: "The Stoic handbook, in five ideas",
            cuerpo: [
              "Stoicism is probably the most practical ancient philosophy there is, and it can be boiled down to a few concrete tools.",
              "1. THE DICHOTOMY OF CONTROL. It's the basis of everything. There are things that depend on you — your judgements, your decisions, your intentions, your effort — and things that don't — your health, your reputation, the past, the economy, what other people do and think. Avoidable suffering is born of investing emotional energy in the second column. Epictetus opens his handbook with it: tell the two apart, and you'll be free.",
              "2. IT ISN'T THINGS, IT'S JUDGEMENTS. «We aren't disturbed by events, but by the opinions we have about events». The same layoff, the same illness or the same criticism produces completely different reactions in two people, so a good part of the distress lies in the interpretation — and that can be changed. That principle is, literally, the foundation of modern cognitive therapy: Albert Ellis and Aaron Beck, who created it in the fifties and sixties, cite Epictetus by name.",
              "3. THE PREMEDITATION OF EVILS. Spending a while calmly imagining what could go wrong — losing your job, an illness, someone's death — so it doesn't catch you unarmed and so you stop taking what you have for granted. It isn't pessimism: it's training. Seneca even advised living a few days on the bare minimum, going cold or eating badly on purpose, to check that you can.",
              "4. THE VIEW FROM ABOVE. Marcus Aurelius made himself look at his own problem from very far off: the extent of the empire, the centuries that have passed, the ones to come, the sheer number of people who lived obsessed with matters nobody remembers today. It's a perspective technique for deflating what feels urgent.",
              "5. MEMENTO MORI. Remembering you're going to die, not to distress yourself, but to stop putting things off. «Act as if this were the last thing you do in your life», writes Marcus Aurelius. And Seneca devoted a whole treatise to showing that we aren't given too little life: we waste it.",
              "And one idea that sounds very strange today: the Stoics held that external things — money, health, success — are «preferred indifferents». It's perfectly fine to have them and you should work for them, but your good life can't DEPEND on them, because then you've put it in the hands of chance.",
              "Their three great figures say a lot about the philosophy's social reach: Epictetus was born a slave and was lame from an owner's mistreatment; Seneca was an extremely rich politician, much criticized for his inconsistency; and Marcus Aurelius was emperor. The same philosophy worked at all three ends of the scale.",
              "And it's worth marking its limit, because it's sometimes sold today as a performance technique: the Stoics weren't proposing that you put up with anything without protest. Their central virtue was justice, they held that all human beings are citizens of a single community — hence the word «cosmopolitan» — and Seneca wrote in favour of treating slaves humanely in an empire that ran on them. Serenity wasn't for resigning yourself: it was so you could act without fear deciding for you.",
            ],
            dato: "Fun fact: Epictetus wrote nothing. His teachings were taken down by a student, just as happened with Socrates, the Buddha, Confucius and Jesus. An enormous part of humanity's thought exists because somebody took notes.",
          },
        ],
      },
      "pirron-escepticismo": {
        titulo: "Pyrrho and scepticism",
        fecha: "≈360–270 BC",
        cuerpo: [
          "Pyrrho went with Alexander the Great on some of his journeys and encountered very different cultures. That made him realize that equally intelligent people defended completely opposite ideas.",
          "So he began to wonder: how do we know our beliefs are really true?",
          "His answer was radical. He said many arguments arise because people believe they're completely certain about things they can't actually prove.",
          "So he proposed suspending judgement when there wasn't enough evidence, and humbly accepting the limits of knowledge.",
          "The aim wasn't to live doubting everything out of despair, but to reach tranquillity by avoiding pointless arguments.",
        ],
        dato: "Fun fact: modern science partly shares this attitude: a theory is never considered absolutely final, only the best available explanation until new evidence turns up.",
      },
    },
  },

  // ── Del mundo de las ideas al mundo de Dios ────────────────────────────
  "ideas-a-dios": {
    titulo: "From the world of Ideas to the world of God",
    anio: "3rd–5th centuries AD",
    momentos: {
      plotino: {
        titulo: "Plotinus",
        fecha: "204–270 AD",
        cuerpo: [
          "Plotinus was born in Egypt under the Roman Empire, but developed his thought in Rome. He deeply admired Plato, though he believed his ideas could go further still.",
          "According to Plotinus, above the universe, above the gods and even above thought there was an absolutely perfect reality he simply called: the One.",
          "The One wasn't a god in human shape or a person. It was the source of all existence. Everything that exists comes from it, just as light comes from the sun.",
          "The closer something is to the One, the more perfect it is. The further away it moves, the more imperfect it becomes.",
          "The goal of life was to return spiritually toward that unity through contemplation, philosophy and inner knowledge.",
          "For Plotinus, knowing was also a way of drawing closer to the divine.",
        ],
        dato: "Fun fact: Plotinus was so humble he never wanted his portrait painted. He said it was quite enough to be lumbered with a body without leaving behind an image of it as well.",
      },
      neoplatonismo: {
        titulo: "Neoplatonism",
        fecha: "3rd–6th centuries",
        cuerpo: [
          "Plotinus's ideas gave rise to Neoplatonism, a philosophical current that picked up Plato's teachings but gave them a deeply spiritual meaning.",
          "The Neoplatonists believed the material world was only an imperfect reflection of a higher reality. The human soul came from that perfect world and had to strive to return to it through virtue, contemplation and knowledge.",
          "This current had an enormous influence because it offered a bridge between Greek philosophy and the new monotheistic religions growing inside the Roman Empire.",
          "Many concepts we associate today with medieval Christianity — the idea that the soul ascends toward God, or that there's a spiritual reality above the material one — were developed philosophically by the Neoplatonists.",
        ],
        dato: "Fun fact: Neoplatonism influenced not only Christianity but Jewish and Muslim philosophers throughout the Middle Ages.",
      },
      "filosofia-teologia": {
        titulo: "Philosophy opens the door to theology",
        cuerpo: [
          "While Plotinus was developing his ideas, Christianity was starting to spread rapidly across the Roman Empire.",
          "Many Christians were suspicious of Greek philosophy, considering it a pagan creation.",
          "Others thought exactly the opposite. They believed reason could help you understand faith better.",
          "One of them would be a brilliant young man called Augustine of Hippo. Before converting to Christianity he had studied Plato and, above all, Plotinus.",
          "Thanks to Neoplatonism he found a way to join Greek philosophy to the Christian message. For more than a thousand years, that union would shape European thought.",
        ],
      },
      "puente-dos-mundos": {
        titulo: "A bridge between two worlds",
        cuerpo: [
          "Neoplatonism is one of the most important moments in the whole history of philosophy.",
          "Without it, it would be very hard to understand why philosophy survived the fall of the Roman Empire.",
          "Plato's questions didn't disappear. They simply changed setting.",
          "Now they were no longer asking only: what is truth? But also: can reason bring us closer to God?",
          "That question would dominate practically the whole of the Middle Ages.",
        ],
      },
    },
  },

  // ── Cuando la razón busca a Dios ───────────────────────────────────────
  "razon-busca-dios": {
    titulo: "When reason goes looking for God",
    anio: "The Middle Ages",
    momentos: {
      "san-agustin": {
        titulo: "Saint Augustine",
        fecha: "354–430",
        cuerpo: [
          "Before converting to Christianity, Augustine looked for answers in various philosophical currents. For years he read Plato and, especially, Plotinus. That reading convinced him that truth shouldn't be sought only in the outside world, but inside yourself as well.",
          "After his conversion he wrote some of the most important works of Christian philosophy, like the Confessions and The City of God.",
          "Augustine argued that reason was a valuable tool, but that it needed faith to reach truth fully.",
          "His famous line sums the idea up: «Understand so that you may believe; believe so that you may understand».",
          "He also reflected on time, asking how the past could exist if it's no longer here, or the future if it hasn't arrived yet. His ideas about consciousness and time are still studied today.",
        ],
        dato: "Fun fact: the Confessions are considered one of the first autobiographies in history.",
      },
      avicena: {
        titulo: "Avicenna",
        fecha: "980–1037",
        cuerpo: [
          "While Europe was going through the early Middle Ages, the Islamic world was living a genuine golden age of knowledge.",
          "One of its greatest geniuses was Avicenna (Ibn Sina), a doctor, scientist and philosopher.",
          "He studied Aristotle deeply and developed arguments to prove God's existence rationally. According to him, everything that exists has a cause, but that chain can't stretch back infinitely. There must be a Necessary Being, one that depends on nothing to exist and is the origin of everything else.",
          "As well as a philosopher, Avicenna wrote one of the most important medical treatises of the Middle Ages, used in European universities for centuries.",
        ],
        dato: "Fun fact: Avicenna is said to have written more than two hundred works before he turned forty.",
      },
      averroes: {
        titulo: "Averroes",
        fecha: "1126–1198",
        cuerpo: [
          "Born in Córdoba during the height of Al-Andalus, Averroes devoted much of his life to studying and commenting on the works of Aristotle.",
          "He believed there could only be one truth. If philosophy and religion seemed to contradict each other, it was because human beings had misinterpreted one of the two.",
          "He argued that intellectually prepared people should use reason to understand the Scriptures, while most people could approach them through simpler interpretations.",
          "Thanks to his commentaries, a large part of Aristotle's work became known again in Western Europe, decisively shaping universities like Paris, Bologna and Oxford.",
        ],
        dato: "Fun fact: for centuries, in many European universities Averroes was known simply as «The Commentator», because of the sheer quality of his explanations of Aristotle.",
        extras: [
          {
            titulo: "The route of the books: how Aristotle got back to Europe",
            cuerpo: [
              "Here's a story that's almost never told and that explains why later European philosophy exists at all. For about six hundred years, Western Europe almost completely lost Aristotle's work. Nobody burned it: people simply stopped knowing Greek.",
              "The way back was very long and went through four languages. First, in Syria, Christian monks translated Aristotle from Greek into Syriac. Then, in 9th-century Baghdad, the House of Wisdom translated him from Syriac and Greek into ARABIC, under a state programme that paid translators and bought manuscripts all over the Mediterranean. There he was studied, commented on and argued about for three centuries by Al-Farabi, Avicenna and Averroes.",
              "And from Arabic he came back into Latin, mainly through two doors: Norman Sicily and, above all, TOLEDO. After 1085, with the city in Castilian hands and its population mixed, a translation workshop formed there that ran for more than a century. They worked in teams, in a chain: a Jew or a Mozarab who knew Arabic translated aloud into Castilian Romance, and a Latin cleric wrote down in Latin what he heard.",
              "That's how the complete Aristotle entered Europe, along with Euclid, Ptolemy, Galen, Hippocrates, algebra, trigonometry, Alhazen's optics, Avicenna's medicine, the numerals we use today and zero.",
              "And it set off an enormous intellectual crisis. Suddenly, 13th-century European universities had in front of them a complete system of the world, coherent, rational… and pagan, which on several points contradicted Christian doctrine: Aristotle held, for instance, that the universe is eternal and uncreated. In 1210 and 1277, teaching some of his theses was banned in Paris.",
              "That's exactly the problem Thomas Aquinas set out to solve: not rejecting Aristotle and not rejecting faith, but showing that they fit together. Without the Toledo translations there's no scholasticism, and without scholasticism there's no European university as we know it.",
              "And there's a lovely irony in all of it: Averroes was far more influential among Christians and Jews than in the Islamic world, where his current lost ground. His commentaries were read for centuries in Paris, Bologna and Oxford, and Dante put him in the Divine Comedy alongside Aristotle and Avicenna, in the limbo of the virtuous sages.",
            ],
            dato: "Fun fact: Toledo's most prolific translator, Gerard of Cremona, was an Italian who arrived looking for a single book — Ptolemy's great astronomical treatise — and stayed there the rest of his life translating some seventy works. He came for one and left with a library.",
          },
        ],
      },
      maimonides: {
        titulo: "Maimonides",
        fecha: "1138–1204",
        cuerpo: [
          "A contemporary of Averroes and also born in Córdoba, Maimonides was one of Judaism's greatest thinkers.",
          "He tried to show that Greek philosophy and Jewish tradition weren't enemies but complementary.",
          "In his Guide for the Perplexed he explained how many apparent contradictions between reason and the Bible could be resolved through a deeper interpretation of the sacred texts.",
          "His influence was enormous in Jewish, Christian and Islamic thought alike.",
        ],
        dato: "Fun fact: Maimonides was also a highly regarded physician and even treated the sultan Saladin.",
      },
      "santo-tomas-aquino": {
        titulo: "Saint Thomas Aquinas",
        fecha: "1225–1274",
        cuerpo: [
          "Thomas Aquinas is probably the most important philosopher of the whole Middle Ages.",
          "Thanks to the translations coming from the Islamic world, he was able to study Aristotle's works in depth, and he became convinced that reason and faith weren't enemies.",
          "His most famous work, the Summa Theologica, sets out to answer practically every great question about God, human beings, morality and knowledge.",
          "Among his contributions the famous Five Ways stand out: five philosophical arguments with which he tried to prove God's existence rationally. They're still debated today, and they deeply marked the history of philosophy.",
          "For Aquinas, reason could discover many truths on its own, but there were others — like the Trinity or the Incarnation — that could only be known through revelation.",
        ],
        dato: "Fun fact: medieval universities studied Aquinas's works for centuries, and they're still fundamental in Catholic philosophy today.",
        extras: [
          {
            titulo: "The five ways, and why they're still argued about",
            cuerpo: [
              "His five arguments don't try to prove the God of the Bible in all his detail, only that there has to be «something» with certain characteristics. They go like this, in plain terms:",
              "1. MOTION. Everything that moves has been moved by something else. Going back along the chain, it can't be infinite, so there must be a first mover that moves without being moved.",
              "2. CAUSE. Nothing causes itself. Every cause has a prior cause, and by the same reasoning there must be a first cause.",
              "3. THE POSSIBLE AND THE NECESSARY. Everything we see might not have existed: it's born and it dies. But if EVERYTHING were like that, at some point there would have been nothing, and nothing comes out of nothing. Something must exist necessarily.",
              "4. DEGREES. We talk about things being more or less good, more or less true, more or less perfect. Comparing in degrees requires a maximum reference point.",
              "5. ORDER. Beings without intelligence — a seed, an eye, an orbit — act regularly and toward an end. Whatever lacks intelligence and still tends in an orderly way toward something must have been directed by an intelligence.",
              "Notice what he's doing, because that's the important part for this story: these are arguments that don't quote the Bible or ask for faith. They're built with Aristotelian logic and addressed to someone who doesn't believe. Aquinas agrees to play by his opponent's rules, and that changed the relationship between faith and reason in the West.",
              "The objections came soon and are just as well known. Hume answered that causality is a habit of our minds and not a law of the universe, so the chain of causes proves nothing. Kant held that reason can't get that far without falling into contradictions, and that God's existence is neither provable nor refutable, only postulable from morality. Darwin dismantled the fifth way by explaining the apparent order of living things with no need for a designer.",
              "And even so they're still alive, because the underlying question — why is there something rather than nothing — hasn't been answered by anyone yet. There are present-day versions of the third way argued over by professional philosophers, believers and atheists, in academic journals this century.",
              "The most valuable thing about Aquinas isn't really whether he was right. It's the rule of the game he set and the West kept: if you want to maintain something, you have to argue for it and answer the objections. His Summa Theologica is written exactly like that, and that's its most admirable feature: every question begins by laying out, as forcefully as possible, the arguments AGAINST his own position, before answering them.",
            ],
            dato: "Fun fact: near the end of his life he had an experience he never explained, and he stopped writing. To anyone who asked him to carry on with the Summa he replied that everything he'd written seemed to him like straw. He died months later, at forty-nine, leaving his greatest work unfinished.",
          },
        ],
      },
      escolastica: {
        titulo: "Scholasticism",
        fecha: "11th–15th centuries",
        cuerpo: [
          "Scholasticism wasn't a philosopher but a way of teaching and debating that dominated the medieval universities.",
          "Teachers would pose a question, analyse the arguments for and against, and finally propose a reasoned answer.",
          "This method helped develop logical thinking and rational debate long before the birth of modern science.",
          "The first European universities — Paris, Bologna, Oxford — became genuine laboratories of ideas where thousands of students argued about philosophy, law, medicine and theology.",
        ],
        dato: "Fun fact: many of the debating techniques used in universities today have their origin in medieval scholasticism.",
      },
    },
  },

  // ── Humanistas, alquimistas y el despertar de la ciencia ───────────────
  "humanistas-alquimistas": {
    titulo: "Humanists, alchemists and the awakening of science",
    anio: "The Renaissance",
    momentos: {
      humanismo: {
        titulo: "Humanism",
        fecha: "14th–16th centuries",
        cuerpo: [
          "The humanists deeply admired the classical culture of Greece and Rome. They believed that building a better world meant going back to reading Plato, Aristotle, Cicero and other ancient authors directly.",
          "But they didn't want to copy the past. They wanted to learn from it.",
          "Humanism put human beings at the centre of education, arguing that every person could develop their capacities through study, reading and critical thinking.",
          "Against a purely religious view of the world, the humanists revived an interest in history, literature, the classical languages and the sciences.",
          "It was the intellectual spirit of the Renaissance.",
        ],
        dato: "Fun fact: Leonardo da Vinci's famous Vitruvian Man symbolizes precisely that new confidence in human capacities.",
      },
      "nicolas-cusa": {
        titulo: "Nicholas of Cusa",
        fecha: "1401–1464",
        cuerpo: [
          "Nicholas of Cusa was one of the thinkers who marked the step from the Middle Ages to the Renaissance.",
          "He argued that God was infinite and that human intelligence could never understand him completely.",
          "That's why he spoke of «learned ignorance».",
          "It didn't mean giving up on knowledge. It meant recognizing that the more we learn, the more aware we become of everything we still don't know.",
          "Many consider that this attitude opened the way to modern science.",
        ],
        dato: "Fun fact: Nicholas of Cusa went as far as imagining a universe with no absolute centre, partly anticipating ideas that would appear decades later with Copernicus.",
      },
      "hermetismo-alquimia": {
        titulo: "Hermeticism and alchemy",
        fecha: "15th–17th centuries",
        cuerpo: [
          "During the Renaissance, not everyone pursued knowledge through experiments or reasoning.",
          "Many thinkers believed the universe hid mysteries accessible only to those who knew how to read its symbols.",
          "So an enormous interest arose in Hermeticism, a tradition inspired by ancient texts attributed to Hermes Trismegistus, a legendary figure combining features of the Egyptian god Thoth and the Greek god Hermes.",
          "The alchemists weren't only trying to turn lead into gold. They were also trying to understand the hidden forces of nature and to bring about a spiritual transformation of the human being.",
          "Although many of their theories were wrong, their experiments helped develop techniques that would later prove useful for the birth of chemistry.",
        ],
        dato: "Fun fact: the famous Philosopher's Stone didn't only stand for making gold. For many alchemists it represented spiritual perfection.",
      },
      paracelso: {
        titulo: "Paracelsus",
        fecha: "1493–1541",
        cuerpo: [
          "Paracelsus was a doctor, an alchemist and a philosopher.",
          "He harshly criticized doctors who repeated the ancient teachings without checking whether they actually worked.",
          "He argued that knowledge had to be based on direct observation of nature and of patients.",
          "Although he still mixed science, alchemy and mysticism, he helped shift medicine toward a far more experimental approach.",
          "That's why many consider him one of the forerunners of modern medicine.",
        ],
        dato: "Fun fact: Paracelsus popularized a line that's still fundamental in pharmacology: «the dose makes the poison». That is, any substance can be helpful or harmful depending on the amount.",
      },
      rosacruces: {
        titulo: "The Rosicrucians",
        fecha: "From the 17th century",
        cuerpo: [
          "At the start of the 17th century, some mysterious manifestos appeared talking about a supposed secret brotherhood called the Rosy Cross.",
          "According to those texts, its members held ancient knowledge of philosophy, science, religion and alchemy meant to improve humanity.",
          "It isn't clear whether the order really existed or whether it was a literary creation.",
          "Its influence was enormous all the same, and for centuries it fed countless legends about secret societies, hidden wisdom and forbidden knowledge.",
        ],
        dato: "Fun fact: Rosicrucian organizations still exist today, though they're very different from the ones described in those first legends.",
      },
      templarios: {
        titulo: "The Templars and the myth of hidden knowledge",
        fecha: "12th century – today",
        cuerpo: [
          "The Knights Templar were a military order created during the Crusades to protect pilgrims travelling to the Holy Land.",
          "Over time they accumulated great wealth and political power, until King Philip IV of France ordered them persecuted in 1307.",
          "Centuries later, legends began to appear claiming the Templars had found the Holy Grail, ancient secret manuscripts or alchemical knowledge.",
          "There's no historical evidence confirming any of those stories.",
          "Those legends did, however, inspire countless novels, films and esoteric societies, turning the Templars into one of the great myths of Western culture.",
        ],
        dato: "Fun fact: many of the stories we associate with the Templars today were invented several centuries after they disappeared.",
      },
      maquiavelo: {
        titulo: "Niccolò Machiavelli",
        fecha: "1469–1527",
        cuerpo: [
          "While many philosophers were imagining what an ideal ruler should be like, Machiavelli decided to study how rulers actually behaved.",
          "In The Prince he analysed politics as it is, not as he'd have liked it to be.",
          "He argued that a ruler had to do whatever was necessary to preserve the state, even when that meant making morally difficult decisions.",
          "He wasn't saying cruelty was good. He was saying politics runs on different rules from individual morality.",
          "That's why he's usually considered the founder of modern political science.",
        ],
        dato: "Fun fact: the phrase «the end justifies the means» is usually credited to Machiavelli, though it never appears in those words anywhere in The Prince.",
      },
      "mundo-empezaba-de-nuevo": {
        titulo: "A world starting over",
        cuerpo: [
          "The Renaissance profoundly changed the way people thought.",
          "Philosophers started reading the classics directly. Scientists started observing nature. Artists studied the human body. Explorers were finding new continents.",
          "Everything seemed to suggest that knowledge could move forward without depending on authority alone.",
          "The great revolution was about to begin.",
        ],
      },
    },
  },

  // ── La revolución del pensamiento ──────────────────────────────────────
  "revolucion-pensamiento": {
    titulo: "The revolution in thought",
    anio: "17th–18th centuries",
    momentos: {
      "francis-bacon": {
        titulo: "Francis Bacon",
        fecha: "1561–1626",
        cuerpo: [
          "Francis Bacon was harshly critical of people who built theories without observing reality.",
          "For him, knowledge had to be based on experience, observation and experiment.",
          "He proposed a method that consisted of gathering data, comparing it and drawing general conclusions. Today we call it the inductive method, and it's one of the pillars of modern science.",
          "Bacon also warned that our minds are full of prejudices that distort reality. He called them «idols», because they act like false beliefs that stop us thinking clearly.",
        ],
        dato: "Fun fact: Bacon is considered one of the fathers of the modern scientific method, even though he himself carried out very few experiments.",
      },
      "galileo-galilei": {
        titulo: "Galileo Galilei",
        fecha: "1564–1642",
        cuerpo: [
          "Galileo pointed a telescope at the sky and found mountains on the Moon, spots on the sun and moons orbiting Jupiter.",
          "Those observations showed the universe wasn't quite as Aristotle had described it. They also supported Copernicus's theory that the Earth goes around the sun.",
          "The Church considered these ideas dangerous and Galileo was tried by the Inquisition. Although he ended up under house arrest, his work changed the relationship between science and philosophy forever.",
          "Galileo argued for a revolutionary idea: nature has to be read by observing it, not just by consulting ancient books.",
        ],
        dato: "Fun fact: the famous line «Eppur si muove» («And yet it moves») was probably never spoken by Galileo, though it became the symbol of scientific freedom.",
      },
      descartes: {
        titulo: "René Descartes",
        fecha: "1596–1650",
        cuerpo: [
          "Descartes decided to do something no philosopher had attempted so radically: to doubt absolutely everything.",
          "What if our senses deceive us? What if everything we think we know is false? What if we're even dreaming?",
          "After questioning everything he found a single certainty. While he was doubting, he was thinking. And if he was thinking, he existed.",
          "That's how one of the most famous lines in the whole history of philosophy was born: «I think, therefore I am» (Cogito, ergo sum).",
          "From that certainty he tried to rebuild all knowledge through reason. That's why he's considered the father of modern rationalism.",
        ],
        dato: "Fun fact: Descartes was also a brilliant mathematician and created the Cartesian coordinate system we still use today.",
        extras: [
          {
            titulo: "The doubt, step by step",
            cuerpo: [
              "His method wasn't doubting for the fun of it: it was a controlled demolition to see what was left standing. And he did it in stages, each more radical than the last.",
              "FIRST STAGE: the senses deceive. An oar looks broken in the water, a distant tower looks round and is square, the same water feels hot or cold depending on the hand. If they deceive me sometimes, I can't rely on them as a secure basis for anything.",
              "SECOND STAGE: dreaming. Right now I think I'm awake, but when I dream I think so too, and in full detail. There's no infallible sign that lets me tell one state from the other. So I can't even be sure I have a body or that this room exists.",
              "THIRD STAGE, the most radical: what if some immensely cunning, deceiving power were manipulating my mind so that two and two seem to be four without being so? Descartes called it the «evil genius», and with that hypothesis even mathematics falls.",
              "And there he finds the floor. However much they deceive me, to be deceived I have to BE. If I doubt, I think; if I think, I exist. It isn't a deduction about the world, it's the one thing that can't be false while I'm thinking it. «I think, therefore I am».",
              "And out of that comes his problem, which is still open: if the only certain thing is that I exist as something that thinks, how do I get out of my own head? How do I prove that the world, other people and my body exist? Descartes tried to get out by leaning on God, and hardly anyone afterward was convinced by that step.",
              "His other legacy is a problem we're still dragging along: he split reality into two distinct substances, the mind that thinks and the body that takes up space. That let science study the body as a machine — an enormous advance for medicine — and left an unresolved question: if they're different things, how do they communicate? How does a decision manage to move an arm? It's the «mind–body problem», and it's still the central matter in philosophy of mind and neuroscience today.",
            ],
            dato: "Fun fact: that evil-genius hypothesis is exactly the plot of «The Matrix», and also the modern version of the problem: «what if I were a brain wired to a simulator?». Four centuries on, we don't have a better answer than his.",
          },
        ],
      },
      pascal: {
        titulo: "Blaise Pascal",
        fecha: "1623–1662",
        cuerpo: [
          "Pascal was an extraordinary case: at sixteen he was writing treatises on geometry, at nineteen he built one of the first mechanical calculating machines to help his father with tax work, and with Fermat he founded probability theory. He also proved experimentally that the vacuum and atmospheric pressure exist, against the whole physics of his day.",
          "His claim is that reason is a magnificent and limited tool. It works for geometry and for physics, but it doesn't reach what really decides a life: whether it's worth living, who to love, what to do with the fear of dying. For that, he said, there's another route to knowledge, and he put it in the most quoted line of his work: the heart has reasons that reason doesn't understand.",
          "His portrait of the human being is the most uncomfortable of the 17th century. He describes someone enormously great and enormously wretched at the same time: able to comprehend the universe and to be tormented by something trivial. And he points at our favourite defence mechanism, which he called divertissement, «distraction»: we can't bear staying still with ourselves, so we fill up with noise, work, games and urgent business so as not to think. He wrote that all human unhappiness comes from not knowing how to sit quietly in a room.",
          "And he left the image that sums up his idea of us: we're a reed, the weakest thing in nature, but a reed that thinks. The universe can crush us without noticing; we, as we're crushed, know what's happening. That's where our whole dignity lies.",
          "His notes for a book he never finished were published after his death under the title «Pensées», and there you find his famous wager: faced with a question reason can't settle, he argues that betting on God's existence is the most rational decision in terms of risk and reward. It's debatable as theology and fascinating as intellectual history: it's the first argument ever to apply probability theory to a life decision.",
        ],
        dato: "Fun fact: he died at thirty-nine, having been in terrible health all his life. And in his last years he set up in Paris the first urban public transport service in history, with horse-drawn carriages on a fixed route at a fixed price. The Pascal programming language and the unit of pressure both carry his name.",
      },
      spinoza: {
        titulo: "Baruch Spinoza",
        fecha: "1632–1677",
        cuerpo: [
          "Spinoza was one of the bravest philosophers of his time. Born into a Jewish community in Amsterdam, his ideas turned out to be so revolutionary that he was expelled from it by an extraordinarily severe excommunication.",
          "While most people imagined God as a being separate from the world, Spinoza argued something completely different. For him, God and Nature are one and the same reality.",
          "He put it in a line that became famous: «Deus sive Natura» («God, or what amounts to the same thing, Nature»).",
          "According to Spinoza, everything that exists is part of a single infinite reality. Nothing happens by chance. Everything follows the laws of nature.",
          "So he also thought human beings have less freedom than they believe. Many of our decisions are shaped by causes we don't know about. The better we understand those causes, though, the freer we become.",
          "He also defended freedom of thought and religious tolerance at a time when such ideas could cost you your life. Centuries later, Albert Einstein admitted that the God he believed in was precisely Spinoza's God.",
        ],
        dato: "Fun fact: Spinoza turned down a prestigious university professorship to keep his intellectual independence. He preferred living modestly grinding lenses to giving up his freedom to think.",
      },
      hobbes: {
        titulo: "Thomas Hobbes",
        fecha: "1588–1679",
        cuerpo: [
          "Hobbes imagined an extreme situation: a world with no governments, no judges, no police, no rules.",
          "He thought that in that natural state, people would end up turning on each other to survive. He described it as «the war of all against all».",
          "To avoid that chaos, human beings agree to hand over part of their freedom to a strong state that guarantees order. That idea gave rise to the modern theory of the social contract.",
        ],
        dato: "Fun fact: Hobbes called the state Leviathan, taking the name of a gigantic sea monster mentioned in the Bible.",
      },
      locke: {
        titulo: "John Locke",
        fecha: "1632–1704",
        cuerpo: [
          "Locke disagreed with Hobbes. He believed people have rights no ruler can take away from them. Chief among them were life, liberty and property.",
          "According to Locke, governments exist to protect those rights, not to grant them. If a ruler violates them, the people have the right to replace him. These ideas would deeply shape the independence of the United States and the French Revolution.",
          "He also argued that the human mind at birth is a blank slate. We don't come into the world with innate knowledge: we learn through experience.",
        ],
        dato: "Fun fact: many of the ideas present in today's democracies come straight from Locke.",
      },
      leibniz: {
        titulo: "Gottfried Leibniz",
        fecha: "1646–1716",
        cuerpo: [
          "Leibniz was a mathematician, a scientist, a diplomat and a philosopher.",
          "He thought that God, being perfect, had created the best universe it was possible to create. Evil exists, but that evil is part of a wider balance we still can't grasp.",
          "He also imagined that the whole of reality is made of spiritual entities called monads, small units of existence that constitute everything there is.",
          "He was also one of the inventors of infinitesimal calculus, at the same time as Newton.",
        ],
        dato: "Fun fact: Leibniz dreamed of creating a universal language based on logic that would let disagreements be settled by calculation. Many consider that idea an anticipation of modern computing.",
      },
      montesquieu: {
        titulo: "Montesquieu",
        fecha: "1689–1755",
        cuerpo: [
          "Montesquieu was a French nobleman and the president of a court, and he spent twenty years on an enormous book, «The Spirit of the Laws», with a very practical question behind it: why do some peoples live in freedom and others under despotism?",
          "His starting point is an observation about human nature, not about politics: anyone who has power tends to abuse it, and goes on abusing it until they meet a limit. Not because rulers are bad people, but because unchecked power always behaves that way.",
          "Hence his conclusion, which is one of the most useful ideas ever formulated: if power can't be abolished, it has to be DIVIDED, so that each part has an interest in checking the others. Legislative, which makes the laws; executive, which applies them; and judicial, which judges. Separate, in different hands, and watching each other.",
          "The important thing is to see that it isn't a moral ideal, it's a mechanism. It trusts nobody's virtue: it builds the system so that one person's ambition runs into another's. He put it like this: it must be so, by the arrangement of things, that power checks power.",
          "And earlier he'd published a brilliant, sly book: the «Persian Letters», in which two Persian travellers describe Paris in bafflement, which let him mock the court, the clergy and French customs while pretending it was a foreigner saying it. It was an enormous success and a very effective way of dodging the censors.",
          "His influence is measurable: the separation of powers is in the United States Constitution of 1787, in the French Declaration of 1789 and today in virtually every constitution in the world. When people say a country «is degrading its democracy», they're almost always describing exactly what he warned about: someone gathering the three powers back into a single hand.",
        ],
        dato: "Fun fact: the drafters of the American Constitution quoted him more than any other European author. An 18th-century French magistrate, writing about Rome and about Persia, designed the skeleton of the state almost everyone lives in today.",
      },
      voltaire: {
        titulo: "Voltaire",
        fecha: "1694–1778",
        cuerpo: [
          "Voltaire was the most famous, most read and most feared intellectual of his century, and not because of a philosophical system — he had none — but because of something else: he turned writing into a weapon against particular injustices.",
          "His two obsessions were freedom of expression and tolerance. And he didn't defend them in the abstract: he got involved in real court cases. The most famous is that of Jean Calas, a Protestant merchant tortured and executed in Toulouse in 1762, accused without evidence of killing his son to stop him converting to Catholicism. Voltaire investigated, published, mobilized half of Europe and three years later got the sentence overturned and the family's name restored. It's probably the first public-opinion campaign in modern history.",
          "Against fanaticism he wrote a slogan he repeated for twenty years: «crush the infamous thing», meaning religious and institutional intolerance, not faith. He believed in God, but not in churches.",
          "His most-read book today is «Candide», a short, hilarious novel in which an optimistic young man travels the world collecting absurd misfortunes — earthquakes, wars, inquisitions, slavery — in order to dismantle Leibniz's idea that we live in the best of all possible worlds. Its closing conclusion is deliberately modest: we must cultivate our own garden — that is, stop justifying the world's evil and start fixing the patch of it in front of you.",
          "And it's worth being honest about him, because he was no saint: he wrote contemptuous pages about other peoples and about Jews, invested in questionable businesses and could be cruel to his rivals. The Enlightenment proclaimed universal rights that even its own authors didn't fully apply, and that gap is an important part of this story.",
        ],
        dato: "Fun fact: the line «I disapprove of what you say, but I will defend to the death your right to say it» isn't his: a biographer wrote it in 1906 summing up his attitude. It's a curious case: Voltaire's most famous quotation isn't by Voltaire, but it describes him rather well.",
      },
      rousseau: {
        titulo: "Jean-Jacques Rousseau",
        fecha: "1712–1778",
        cuerpo: [
          "Rousseau was the black sheep of the Enlightenment. While his contemporaries were celebrating progress, reason and civilization, he wrote that human beings are born good and that it's society that corrupts them.",
          "His argument is sophisticated, not a naive hymn to the noble savage. He holds that in an original state, with no property and no comparison, there was neither vice nor virtue: there were simple needs and natural compassion. What appears with social life is THE GAZE OF OTHERS — vanity, envy, prestige, the urge to seem — and, above all, inequality: the day someone fenced off a piece of land and said «this is mine», and found people simple enough to believe him, the trouble began.",
          "But his conclusion isn't to go back to the forest, and this is what almost everyone misreads. His conclusion is that a legitimate society has to be built. And his answer is in «The Social Contract», which opens with one of the most famous lines in political philosophy: man is born free, and everywhere he is in chains.",
          "His solution is that laws can't come from a king or an elite: they have to come from the «general will», that is, from citizens themselves deliberating about the common good. Obeying a law you helped make isn't submission, it's being free. That's where the modern idea of popular sovereignty is born — the one behind every «national sovereignty resides in the people» in today's constitutions.",
          "And he also wrote «Emile», a book on education that changed how children are raised in the West: he argued that a child isn't a defective adult to be stuffed with facts, but someone with their own stages, who learns by playing, moving, touching and getting things wrong, and who should be allowed to mature. Almost all modern pedagogy starts there.",
          "His uncomfortable side is enormous and has to be said: the man who wrote the best treatise on education of his century abandoned his five children to a foundling hospital. He confessed it himself in his «Confessions», a book where he paints himself with his squalor included, and which inaugurates modern autobiography as we understand it.",
        ],
        dato: "Fun fact: here are the three answers of the social contract, side by side, and it's still today's political argument. Hobbes: since we're dangerous, we need a strong power to guarantee order. Locke: since we have prior rights, power exists to protect them and can be removed. Rousseau: since freedom is obeying what you yourself have decided, power has to be the people. Almost any current debate about security, rights and participation is a version of that argument.",
      },
      "david-hume": {
        titulo: "David Hume",
        fecha: "1711–1776",
        cuerpo: [
          "Hume took empiricism to its ultimate consequences. He said all knowledge comes from experience.",
          "But he raised an enormous problem. We see the sun come up every morning. Can we prove it will come up tomorrow? No. All we know is that it always has.",
          "Our confidence in the future is based on habit, not on absolute certainty. That problem, known as the problem of induction, is still one of the great debates in philosophy of science.",
          "Hume also questioned many traditional ideas about religion, the soul and causality. His scepticism would deeply shake a young German philosopher called Immanuel Kant.",
        ],
        dato: "Fun fact: Kant admitted it was precisely reading Hume that woke him from his «dogmatic slumber».",
      },
    },
  },

  // ── ¿Qué podemos conocer? ──────────────────────────────────────────────
  "que-conocer": {
    titulo: "What can we know?",
    anio: "18th century",
    momentos: {
      "immanuel-kant": {
        titulo: "Immanuel Kant",
        fecha: "1724–1804",
        cuerpo: [
          "Kant lived his whole life in the Prussian city of Königsberg and kept an existence so orderly that his neighbours were said to set their clocks by his afternoon walk.",
          "Behind that routine, though, hid one of the most revolutionary minds in history.",
          "Kant admired the rationalists, but he also recognized the force of Hume's criticisms. So he asked a different question.",
          "Until then every philosopher had been asking: what is the world like? Kant swapped it for a much deeper one: how does the mind that tries to know the world actually work?",
          "His answer transformed philosophy.",
        ],
      },
      "revolucion-copernicana-kant": {
        titulo: "Kant's Copernican revolution",
        cuerpo: [
          "Kant compared his theory to Copernicus's.",
          "Before Copernicus, it was thought that the sun went around the Earth. Copernicus changed the point of view completely.",
          "Kant did something similar. Until then it was thought that our minds had to fit themselves to the world. He proposed the exact opposite.",
          "The world, as we know it, is also organized by the way our minds work. We don't know reality exactly as it is. We know it as our brains are able to grasp it.",
          "That's why he called his theory a genuine «Copernican revolution» in philosophy.",
        ],
        dato: "Fun fact: many scientists today consider that this idea anticipated questions psychology and neuroscience now study about how we build our perception of reality.",
      },
      "razon-y-experiencia": {
        titulo: "Reason and experience",
        cuerpo: [
          "Kant summed up his whole philosophy in a very famous line: «All our knowledge begins with experience, but it doesn't all come from experience».",
          "When we're born we know nothing. We need to experience the world. But experience on its own would be chaos.",
          "Our minds automatically organize everything we perceive through concepts like space, time and causality.",
          "So for Kant, knowing consists of a constant collaboration between our senses and our reason.",
        ],
      },
      "etica-del-deber": {
        titulo: "The ethics of duty",
        cuerpo: [
          "Kant didn't only transform the theory of knowledge. He revolutionized ethics too.",
          "For Kant, an action isn't moral because it produces good results. It's moral when we do what's right out of duty.",
          "His most famous principle is called the categorical imperative. One of its formulations says: «Act only according to a rule that you could want to become a universal law».",
          "In other words, before acting, ask yourself: what would happen if everyone did the same? If the answer destroys life together, that action probably isn't moral.",
        ],
      },
      "dignidad-humana": {
        titulo: "Human dignity",
        cuerpo: [
          "Another of Kant's great contributions was the claim that people must never be treated merely as a means to an end.",
          "Every human being has a dignity of their own.",
          "That means nobody should be used, manipulated or sacrificed simply because they're useful to others.",
          "This idea has hugely influenced human rights, political philosophy and many modern constitutions.",
          "With Kant, a stage of philosophy came to an end. After him the question would no longer be only: what can we know?",
          "New ones would appear as well: how does the mind build reality? Are we really free? Does history have a meaning? What makes human beings different?",
          "Practically every great philosopher of the 19th and 20th centuries will be in conversation with Kant, whether to carry his thought on… or to argue with it.",
        ],
        dato: "Fun fact: a good part of the Universal Declaration of Human Rights reflects principles that directly recall Kant's ethics.",
      },
    },
  },

  // ── El siglo de las grandes ideas ──────────────────────────────────────
  "grandes-ideas": {
    titulo: "The century of the great ideas",
    anio: "19th century",
    momentos: {
      hegel: {
        titulo: "Georg Wilhelm Friedrich Hegel",
        fecha: "1770–1831",
        cuerpo: [
          "Until then many people thought history was simply a succession of wars, kings and events. Hegel proposed something completely different.",
          "According to him, history has a direction. Humanity moves little by little toward greater freedom.",
          "But that advance is never simple. Every idea generates another that contradicts it. Out of that conflict a new way of thinking is born. And the process repeats.",
          "Although Hegel never used exactly the words thesis, antithesis and synthesis, that phrase sums up fairly well how he understood the evolution of ideas.",
          "For him, conflicts weren't accidents. They were the engine of progress. His vision would hugely influence later philosophers, especially Karl Marx.",
        ],
        dato: "Fun fact: Hegel said he had seen «the spirit of history on horseback» when he watched Napoleon ride victorious into a German city.",
      },
      schopenhauer: {
        titulo: "Arthur Schopenhauer",
        fecha: "1788–1860",
        cuerpo: [
          "Schopenhauer was one of the most pessimistic philosophers in history.",
          "Where Hegel saw constant progress, he saw something very different. People continually want new things. When they get them, they soon feel dissatisfied again.",
          "For Schopenhauer, life is driven by an irrational force he called the will. That will constantly pushes us to want more, and that's precisely why we never reach complete happiness.",
          "Curiously, he found inspiration in the philosophies of India, especially Buddhism, which also spoke of desire as the origin of suffering.",
        ],
        dato: "Fun fact: Schopenhauer was one of the first European philosophers to study Hindu and Buddhist texts seriously.",
      },
      kierkegaard: {
        titulo: "Søren Kierkegaard",
        fecha: "1813–1855",
        cuerpo: [
          "Kierkegaard thought philosophy was forgetting something very important: each individual person.",
          "While other philosophers talked about humanity in general, he asked how a particular individual lives their doubts, their fears and their decisions.",
          "He argued that nobody can live for us. Each person has to choose who they want to be, even if that produces anguish. Because choosing means giving up other paths.",
          "That's why he's usually considered the father of existentialism, a current that would flower a century later with Sartre and Camus.",
        ],
        dato: "Fun fact: many of his works were published under pseudonyms because he wanted readers to think about the ideas without focusing on the figure of the author.",
      },
      mill: {
        titulo: "John Stuart Mill",
        fecha: "1806–1873",
        cuerpo: [
          "Mill argued that every person should be free to live as they wish, as long as they don't harm others. That idea, known as the harm principle, is still one of the foundations of modern liberalism.",
          "He was also one of the first philosophers to defend equality between men and women publicly.",
          "At a time when hardly anyone questioned that inequality, he wrote The Subjection of Women. In it he denounced as an enormous injustice the barring of women from study, from voting and from politics.",
        ],
        dato: "Fun fact: Mill was a member of the British Parliament and one of the first to argue there for women's right to vote.",
      },
      marx: {
        titulo: "Karl Marx",
        fecha: "1818–1883",
        cuerpo: [
          "Marx deeply admired Hegel, but thought he was wrong about something fundamental. It isn't ideas that change the world. It's material conditions: the economy, work, the way a society produces wealth.",
          "According to Marx, the whole of history can be understood as a struggle between social groups with opposing interests. In the 19th century those groups were mainly the bourgeoisie, who owned the factories, and the proletariat, made up of the workers.",
          "He believed capitalism would end up generating enormous inequality and that workers would eventually organize to transform society.",
          "His ideas inspired revolutions, political parties and governments throughout the 20th century.",
        ],
        dato: "Fun fact: probably no philosopher has influenced world politics as much as Karl Marx.",
        extras: [
          {
            titulo: "His three ideas, without the slogans",
            cuerpo: [
              "Marx is quoted constantly and read very little, and his central concepts are actually quite concrete. Here are three, with the simplest possible example.",
              "1. SURPLUS VALUE, which is his economic analysis. Imagine you work eight hours and that in the first four you've already produced the value equivalent to your wage. What you produce in the other four is value kept by whoever hired you. Marx called that surplus value, and held that it's the source of profit: not an illegal theft, but the normal working of the system, because what's bought on the market isn't your finished work, it's your available time. From there he deduced that the relationship between whoever puts up the capital and whoever puts in the hours is structurally in conflict, however decent both people are.",
              "2. ALIENATION, which is his human analysis and perhaps the most current. Work ought to be one of the ways a person expresses themselves and recognizes themselves in what they do. In the factory the opposite happens: you don't choose what gets produced, you don't control the pace, you do a tiny fragment of the process, the product isn't yours and the result feels alien. You work in order to live outside work, and work, which is most of your waking life, turns into something you endure. Marx called that disconnection alienation, and described four faces of it: from the product, from the activity, from other people and from yourself.",
              "3. HISTORICAL MATERIALISM, which is his method. It holds that to understand an era you shouldn't start with its ideas, but with how it produces what it needs to live: who owns the land, the machine, the capital, the technology. Laws, religion, morality and art don't float free — they rest on that base and usually justify the existing order. That approach — looking at the material interests behind an idea — is a common tool today in history, sociology and journalism, whether or not you're a Marxist.",
              "And his diagnosis of capitalism included descriptions that read today with a certain astonishment: that it tends to concentrate in few hands, that it needs to grow and spread across the whole planet, that it flattens traditional ways of life, that it produces cyclical crises and that it turns anything into a commodity. He wrote that in it «all that is solid melts into air».",
              "His central prediction, on the other hand, failed: he thought the working class of the industrialized countries would get poorer beyond remedy until they brought the system down. What happened was different: trade unions, universal suffrage, the eight-hour day, public health and education, pensions. Capitalism showed a capacity for reform he hadn't foreseen, partly because of pressure from the movements his own work inspired.",
              "And the other side has to be said just as plainly: the regimes that declared themselves Marxist in the 20th century produced one-party dictatorships, famines, labour camps and tens of millions of deaths. How much of that is in his work and how much in the people who used it is argued about — Marx died in 1883 and wrote very little about how the future society should be organized — but any honest reading has to hold both things: the power of his analysis and the historical result of his name.",
            ],
            dato: "Fun fact: he lived in poverty, lost three children to illnesses linked to destitution, and was able to write «Capital» because he was kept financially by his friend Friedrich Engels… who was the son of a textile factory owner. The analysis of capitalism was funded by family capitalism.",
          },
        ],
      },
      darwin: {
        titulo: "Charles Darwin",
        fecha: "1809–1882",
        cuerpo: [
          "Darwin wasn't a philosopher. He was a naturalist. And yet few people have changed philosophy so much.",
          "Until then many cultures thought human beings had been created in a special way and occupied a unique place in nature.",
          "In 1859 Darwin published On the Origin of Species. His theory of evolution by natural selection proposed that every species, humans included, shared common ancestors and had evolved over millions of years.",
          "The idea set off an enormous debate. It didn't only transform biology. It also forced philosophy to rethink fundamental questions: what makes us human? Are we still the centre of creation? How does evolution fit with religious belief?",
          "Even today those questions are still up for debate.",
        ],
        dato: "Fun fact: Darwin took more than twenty years to publish his theory because he was well aware of the enormous controversy it could cause.",
      },
      nietzsche: {
        titulo: "Friedrich Nietzsche",
        fecha: "1844–1900",
        cuerpo: [
          "At the end of the 19th century, Europe was changing fast. Science was advancing. Industrialization was transforming society. More and more people were no longer explaining the world through religion alone.",
          "That's when Nietzsche wrote one of the most famous lines in all of history: «God is dead».",
          "He didn't mean God had existed and had just died. He meant something far deeper. For centuries, European culture had built its morality, its politics and its way of understanding the world around Christianity. Now that foundation was starting to disappear.",
          "And Nietzsche issued a warning. If we stop believing in the old values, what will we replace them with?",
          "He also harshly criticized blind obedience, conformity and resignation. He argued that each person had to build their own values and dare to live fully.",
          "He represented this idea through the concept of the overman (Übermensch), someone able to create their own meaning of life instead of merely following inherited rules.",
          "Although his writings were manipulated decades later by Nazism, that reading contradicts many of Nietzsche's own ideas — and he died before that movement was born.",
        ],
        dato: "Fun fact: «God is dead» is probably the best-known philosophical line in the world, but very few people know what it actually means.",
        extras: [
          {
            titulo: "«God is dead» isn't what it looks like",
            cuerpo: [
              "The line is usually read as an atheist celebration, and it isn't. Nietzsche puts it in the mouth of a character who announces it as a CATASTROPHE, and adds: «we have killed him». And then he asks, terrified: who will wipe this blood off us now, what water could purify us, where are we falling if we've unchained the Earth from its sun?",
              "What he's saying isn't that God doesn't exist. He's saying something historical: that European culture has stopped really believing, even though it keeps the forms, and that it hasn't yet realized the consequences. And the consequences are enormous, because our whole morality, our idea of truth, of dignity, of justice and of meaning rested on that foundation.",
              "Hence his great question, which is the question of the entire 20th century: if there's no external guarantor any more, where do values come from? His name for the danger is NIHILISM, the moment you discover that nothing is worth anything. Nietzsche isn't proposing it: he's announcing it as the illness on the way, and he sets out to find the way through.",
              "His way through is three ideas, and none of them means what people say it does.",
              "THE WILL TO POWER isn't a craving to boss other people about. It's the drive of everything alive to grow, unfold and assert itself. Applied to a person, it's the capacity to become what you could become instead of settling.",
              "THE OVERMAN isn't a superior race or a tyrant. It's someone able to create their own values and hold to them without needing anyone to guarantee them: the one who no longer obeys out of fear of punishment or hope of reward. Nietzsche describes three stages: the camel, which carries what it's told to; the lion, which rebels and says no; and the child, which plays and creates anew.",
              "THE ETERNAL RETURN is a brutal thought experiment: imagine you had to live your life exactly as it is, with the same pains and the same mistakes, infinitely many times. Would it crush you, or would you say «again»? It's his measure of a life well lived, and he called it amor fati: loving what has happened to you, the bad included.",
              "And the disaster has to be told too. Nietzsche went mad in 1889 — according to the famous scene, with his arms around the neck of a horse being whipped in Turin — and spent his last eleven years without lucidity, cared for first by his mother and then by his sister Elisabeth. She was antisemitic and nationalist, the opposite of everything he'd argued for — he'd broken with Wagner and with his own brother-in-law precisely over that, and wrote that he wanted antisemites shot. Elisabeth kept his unpublished manuscripts, set up an archive, cut, mixed and published as she saw fit, and ended up receiving Hitler at her house and handing him her brother's walking stick.",
              "So the philosopher who despised nationalism, the state, the mass and antisemitism ended up turned into an emblem of Nazism. Rehabilitating his original texts took decades of philological work, and even today it has to be said every time he's quoted: that wasn't an interpretation, it was a forgery.",
            ],
            dato: "Fun fact: he wrote almost everything in short, separate sentences, partly out of style and partly out of necessity: he had migraines and eye problems so severe he could barely read or write for long. His most dazzling books are made of notes taken in the stretches when the pain let him.",
          },
        ],
      },
    },
  },

  // ── Descubriendo la mente humana ───────────────────────────────────────
  "mente-humana": {
    titulo: "Discovering the human mind",
    anio: "20th century",
    momentos: {
      freud: {
        titulo: "Sigmund Freud",
        fecha: "1856–1939",
        cuerpo: [
          "Freud wasn't a philosopher but a doctor, and yet his influence on how we understand human beings was enormous.",
          "He proposed that beneath the conscious part of our mind there's something much bigger and hidden: the unconscious.",
          "According to him, many of our desires, fears and memories end up buried there and, without our noticing, they guide our behaviour, our dreams and even our slips.",
          "The idea was unsettling. If much of what we do springs from impulses we don't control, how free and rational are we really?",
          "Although many of his theories have since been revised or superseded, Freud changed the way we look at the human mind forever.",
        ],
        dato: "Fun fact: Freud called his method psychoanalysis, based on talking and on interpreting dreams, and words as everyday now as «repression» or «subconscious» come from it.",
      },
      husserl: {
        titulo: "Edmund Husserl",
        fecha: "1859–1938",
        cuerpo: [
          "Husserl wanted to give philosophy the rigour of a science, but starting from something very concrete: lived experience.",
          "He proposed a method called phenomenology, which consisted of describing as precisely as possible how things appear to us in consciousness, setting theories and prejudices aside for a moment.",
          "Instead of asking whether the external world exists, he focused on how we experience it: how we perceive a colour, remember a face or feel time passing.",
          "His method influenced almost every great philosopher of the 20th century, starting with his own pupil, Martin Heidegger.",
        ],
        dato: "Fun fact: phenomenology didn't only transform philosophy; it also left its mark on psychology, sociology and even on technology designed «from the user's experience».",
      },
      heidegger: {
        titulo: "Martin Heidegger",
        fecha: "1889–1976",
        cuerpo: [
          "Heidegger thought philosophy had forgotten its most important question: what does it mean to be?",
          "He realized that human beings are the only ones who ask about their own existence. Unlike a stone or an animal, we know we're alive… and that we're going to die.",
          "Precisely because of that, he said, living authentically means accepting that our time is limited and deciding what to do with it, instead of letting ourselves be dragged along by routine and by what you're «supposed» to do.",
          "His work, difficult and profound, hugely influenced later existentialism.",
        ],
        dato: "Fun fact: Heidegger invented a great many new words because he believed ordinary language wasn't enough to express his ideas about existence.",
      },
      sartre: {
        titulo: "Jean-Paul Sartre",
        fecha: "1905–1980",
        cuerpo: [
          "Sartre was the great figure of existentialism. His central idea can be summed up in one line: «existence precedes essence».",
          "He meant that human beings aren't born with a purpose already written. First we exist, and then, through our decisions, we build who we are.",
          "That makes us radically free, but also entirely responsible. We can't blame the gods, fate or our nature: we are what we choose to be.",
          "Sartre said we're «condemned to be free», because even not choosing is already a choice.",
        ],
        dato: "Fun fact: Sartre turned down the Nobel Prize in Literature in 1964 because he didn't want any institution conditioning his independence as a writer.",
        extras: [
          {
            titulo: "«Condemned to be free» and bad faith",
            cuerpo: [
              "His central idea comes down to a formula: existence precedes essence. A knife is manufactured with its purpose already decided — cutting — so its essence comes before its existence. With people it's the other way round: first we're here, and only afterward, through what we do, do we build what we are. There's no prior plan, no fixed human nature and no instruction manual.",
              "Out of that comes his harshest line: we're «condemned to be free». Condemned, because we didn't choose it and can't hand it back: even not deciding is a decision, and staying still is also acting. And if there's nobody guaranteeing values, every choice of ours is creating them, and we're responsible for it with no excuses. That produces what he called anguish, which isn't fear of anything in particular: it's the vertigo of realizing it's down to you.",
              "And here comes his most useful concept for everyday life: BAD FAITH. It's the manoeuvre by which we lie to ourselves so as not to carry that freedom. It consists of treating yourself as though you were a thing with a fixed essence: «that's just how I am», «I can't change», «it's my character», «I've got no choice», «I'm only following orders», «I have my role».",
              "His famous example is the waiter who acts exaggeratedly like a waiter: gestures a little too precise, voice a little too attentive, as though he were playing the character so as not to have to be a person who has chosen to be there and could leave. We all have versions of that.",
              "His claim is deliberately uncomfortable: almost everything we call «I have no choice» is really «I don't want to bear the cost of choosing». And his critics rightly pointed out his limit: someone poor, ill or imprisoned doesn't have the same room to move as a Parisian professor, and over the years Sartre did qualify the weight of social circumstances.",
              "And that's why his philosophy fits into literature: he developed it in novels and plays more than in treatises. In his play «No Exit», three people shut up forever in a room discover there are no torturers and no fire: they torment each other with their gaze and their judgement. Hence the line everyone quotes: hell is other people.",
              "And this has to be said too: the same man who made responsibility the centre of his philosophy spent years defending regimes that were murdering their own people, and took far too long to admit it. It's a good reminder that consistency between what you think and what you do is the hardest part of philosophy.",
            ],
            dato: "Fun fact: in 1945 he gave a lecture titled «Existentialism Is a Humanism» to answer his critics, and so many people turned up that there were fainting fits and no way in. It's probably the only time in history a philosophy talk caused a crowd crush.",
          },
        ],
      },
      "simone-de-beauvoir": {
        titulo: "Simone de Beauvoir",
        fecha: "1908–1986",
        cuerpo: [
          "Sartre's intellectual companion, Simone de Beauvoir took existentialism into new territory: the condition of women.",
          "In The Second Sex she analysed how, throughout history, society had always defined woman in relation to man, as though she were «the other».",
          "Her most famous line sums up her thought: «One is not born, but rather becomes, a woman». By it she meant that many of the roles considered «feminine» aren't natural but learned and imposed by culture.",
          "Her work became one of the foundations of modern feminism.",
        ],
        dato: "Fun fact: The Second Sex caused such a scandal on publication in 1949 that it ended up on lists of banned books.",
        extras: [
          {
            titulo: "«One is not born a woman: one becomes one»",
            cuerpo: [
              "It's the most quoted line in 20th-century philosophy on this subject, and it's worth understanding exactly what it claims, because it's usually misread.",
              "It doesn't say the body doesn't exist. It says that from the biological fact of being born with a particular body you can't automatically deduce a character, a calling, a set of capacities or a destiny. All of that — being sweet, caring for others, being liked, not standing out, not taking up space — is learned, and it's taught from earliest childhood through toys, stories, praise, corrections and different expectations. That is: it distinguishes sex from what society builds on top of it, which is the distinction still being worked with today.",
              "Her other key concept is «the Other». Beauvoir observes that in the whole cultural tradition man has been taken as the default human being — the subject, the normal, the universal — and woman has been defined as what deviates from that norm, as secondary and relative to him. Hence the title: the «second» sex isn't second in order, it's the one always defined from the other.",
              "And she shows it with a method that was new: she doesn't argue in the abstract, she works through biology, history, mythology, psychoanalysis, literature and dozens of testimonies from real women about childhood, adolescence, marriage, motherhood, old age and prostitution. Almost a thousand pages.",
              "Her material analysis is devastating and very concrete: as long as a woman has no money of her own, no work of her own and no control over her body, her freedom is theoretical. That's why she insisted on economic independence and on the right to decide about motherhood, things that in 1949 weren't remotely secured: in France women had only just won the vote in 1944 and needed their husband's permission to open a bank account until 1965.",
              "It's also the most consistent application of existentialism. If existence precedes essence, then there's no «feminine essence» to live up to, and the freedom Sartre talked about is a situated freedom, conditioned by education, law, money and other people's gaze. Many consider her book the best existentialist work ever written, better than his.",
              "Her influence was direct: the feminism of the sixties and seventies organized itself largely from there, and she took an active part, signed manifestos for abortion rights and accompanied court cases.",
              "And her life was another form of argument: she didn't marry, didn't have children, lived by writing and kept an open, agreed relationship with Sartre for fifty years — something that scandalized people and has also been examined critically, because that relationship had its imbalances and some questionable episodes with young students.",
            ],
            dato: "Fun fact: she got the second-best mark in France in the qualifying exam to teach philosophy, the country's toughest. First was Sartre, and it was his second attempt; it was her first, and she was twenty-one, the youngest person who had ever passed it.",
          },
        ],
      },
      "albert-camus": {
        titulo: "Albert Camus",
        fecha: "1913–1960",
        cuerpo: [
          "Camus faced an uncomfortable question: if the universe has no obvious meaning, is life worth living?",
          "He called that contradiction between our need for meaning and a world that doesn't offer any the absurd.",
          "But his answer wasn't pessimistic. He proposed rebelling against the absurd by living intensely, enjoying and creating, precisely because life doesn't come with an instruction manual.",
          "He explained it with the myth of Sisyphus, the figure condemned to push a rock up a mountain forever. Camus imagined that, in spite of everything, we could imagine Sisyphus happy.",
        ],
        dato: "Fun fact: Camus received the Nobel Prize in Literature at just 44 and died shortly afterward in a car crash, with a train ticket in his pocket that he never got to use.",
        extras: [
          {
            titulo: "Sisyphus, or why it's worth going on",
            cuerpo: [
              "Camus opens his most famous essay with a line that doesn't beat about the bush: there is only one truly serious philosophical problem, suicide. That is, the question of whether life is worth living. Everything else — how many dimensions the universe has, how language works — comes afterward.",
              "His starting point is what he calls the ABSURD, and it's worth getting right, because it doesn't mean life is ridiculous. The absurd is a mismatch between two things: on one side, our need for things to have meaning, order and justice; on the other, a universe that doesn't answer that demand. Neither part is absurd on its own: the absurd is the collision.",
              "And he says there are three possible ways out, and he rules two of them out.",
              "He rules out suicide, because it removes one of the terms of the problem instead of facing it. And he rules out what he calls the «leap»: adopting a faith, an ideology or a system that assures you there is a guaranteed meaning, because that's stopping looking at what you were looking at. He called it «philosophical suicide», and he said it with respect but without softening it.",
              "His third path is rebellion: holding both things at once. Living without guarantees and going on loving, acting and creating anyway. And that's where his image comes in.",
              "SISYPHUS is the mythological figure condemned by the gods to push an enormous stone to the top of a mountain, so that at the last moment the stone rolls back down and he has to start again, forever. It's the perfect punishment because it's useless work with no hope in it.",
              "Camus fixes on one particular moment: the stretch when Sisyphus walks back down the slope, after the stone has fallen, to fetch it again. That's the conscious moment, when he knows perfectly well what's waiting for him and walks anyway. And he finishes with the line that made the essay famous: we must imagine Sisyphus happy. His stone is his, the mountain is his, and a fate with no hope in it stops being a punishment the moment he takes it on without lying to himself.",
              "And his second great idea is moral, not metaphysical. In «The Rebel» he argues that you can't deduce from the absurd that everything is permitted, and there he broke publicly with Sartre: he refused to justify political violence and present-day victims in the name of a better future. His formula, against the ideologies that accepted any price, was clear: nothing justifies turning a person into a means.",
              "And there's a biography behind it that explains the tone: he was born very poor in Algeria, his father died in the First World War when he was one, his mother was illiterate and deaf, he had tuberculosis from a young age — he lived with the possibility of dying his whole life — he played in goal at football, and he got to university thanks to a primary-school teacher who fought for him. On receiving the Nobel, the first letter he wrote was to that teacher.",
            ],
            dato: "Fun fact: his novel «The Plague», about a city sealed off by an epidemic, sold out again in bookshops across half the world in 2020. Its conclusion — that in a catastrophe the only decent thing is to do your job well and look after other people, without heroics — read differently after that spring.",
          },
        ],
      },
      "hannah-arendt": {
        titulo: "Hannah Arendt",
        fecha: "1906–1975",
        cuerpo: [
          "Arendt lived through the horror of the 20th century at first hand. A German Jew, she had to flee Nazism and devoted her life to understanding how such cruelty had been possible.",
          "Covering the trial of a senior Nazi official, she expected to meet a monster. Instead she saw an ordinary man who simply «followed orders» without stopping to think.",
          "That's where her most famous idea was born: the banality of evil. The most terrible evil, she said, isn't always committed by wicked beings, but by people who stop thinking and stop questioning what they're doing.",
          "So she argued that thinking for yourself and taking part in public life are ways of protecting freedom.",
        ],
        dato: "Fun fact: the phrase «the banality of evil» set off an enormous debate and is still used today to analyse how great injustices get committed.",
        extras: [
          {
            titulo: "The banality of evil: what she actually saw at that trial",
            cuerpo: [
              "In 1961, Hannah Arendt went to Jerusalem as a correspondent to cover the trial of Adolf Eichmann, the Nazi official who had organized the logistics of deporting millions of Jews to the extermination camps.",
              "She expected to meet a monster. What she saw, sitting in a glass booth, was a mediocre, balding man with prostate trouble, who spoke in administrative jargon, garbled his own clichés, was proud of his professional efficiency and of having carried out orders, and didn't seem to hate anyone in particular. He wasn't an ideological fanatic or a sadist: he was a bureaucrat who wanted a promotion.",
              "Her conclusion is what cost her a storm of criticism: the most extreme evil of the 20th century wasn't committed mainly by psychopaths, but by normal people who stopped thinking. And by «thinking» she meant something very precise: the ability to imagine how your act looks from the other person's point of view, and to keep up an inner dialogue with yourself in which you have to answer for what you do.",
              "Eichmann, she said, had replaced that with regulations, promotions, technical language — «transfer», «special treatment», «final solution» — and with obedience as a virtue. He never asked what was at the end of the trains he organized, because his job was for the trains to leave on time.",
              "The misunderstanding that chased Arendt for years is twofold, and it's worth clearing up. «Banal» doesn't mean the crime was small: it means its PERPETRATORS could be people with nothing exceptional about them. And her claim exonerates nobody: on the contrary, she holds that not thinking is a form of responsibility, and she expressly supported his conviction.",
              "She also drew ferocious attacks for the section where she analysed, harshly and perhaps unfairly, the role of some Jewish councils forced to collaborate in running the ghettos. She lost friends and was accused of everything. The book is still argued over, and historians have qualified her portrait: there are documents showing an Eichmann more antisemitic and more aware than the one she perceived in that courtroom.",
              "Her analysis connected with her great earlier work, «The Origins of Totalitarianism», where she describes how these regimes first destroy public life and the possibility of arguing, then the bonds between people until they're left isolated and, finally, the very notion of a checkable fact, replacing it with a manufactured reality where nobody knows what's true any more and it no longer matters.",
              "And that's why she's quoted so much now: she described the process by which a society can stop telling true from false and accept anything, and she described the machinery that lets thousands of decent people take part in something atrocious without feeling responsible for any of it. Each one was only doing «their bit».",
            ],
            dato: "Fun fact: a few years later, the psychologist Stanley Milgram ran his famous experiment in which ordinary volunteers administered electric shocks to a stranger because a figure of authority told them to carry on. Milgram cited the Eichmann trial expressly as his inspiration: philosophy had raised the question and the laboratory went to test it.",
          },
        ],
      },
      "ortega-y-gasset": {
        titulo: "José Ortega y Gasset",
        fecha: "1883–1955",
        cuerpo: [
          "Ortega y Gasset was the most influential Spanish philosopher of the 20th century, and he managed to bring philosophy to a wide public in clear, elegant language.",
          "His best-known idea comes down to one line: «I am I and my circumstance».",
          "By it he meant that we can't understand ourselves in isolation from the world around us: our era, our culture and our situation are part of what we are. But at the same time, we have the task of deciding what to do with that circumstance.",
          "He also reflected on mass society and on the dangers of giving up thinking for yourself.",
        ],
        dato: "Fun fact: Ortega argued that «life is what we do and what happens to us», and that living consists of constantly deciding what we're going to be in the next instant.",
      },
    },
  },

  // ── Pensar el futuro ───────────────────────────────────────────────────
  "pensar-futuro": {
    titulo: "Thinking about the future",
    anio: "20th–21st centuries",
    momentos: {
      popper: {
        titulo: "Karl Popper",
        fecha: "1902–1994",
        cuerpo: [
          "Popper asked a key question: what makes a scientific theory different from one that isn't?",
          "His answer was surprising. A theory is scientific not because it can be proved, but because it can be refuted; that is, because there's some experiment capable of showing it's false.",
          "He called this idea falsifiability. According to Popper, science advances by proposing bold theories and then trying to knock them down. The ones that survive every attempt are the ones we provisionally accept.",
          "So in science no theory is an absolute, final truth: it's always open to correction.",
        ],
        dato: "Fun fact: Popper was also a firm defender of democracy; in The Open Society and Its Enemies he criticized totalitarian regimes and the philosophies that believed they possessed absolute truth.",
        extras: [
          {
            titulo: "Falsification: telling science from what only looks like it",
            cuerpo: [
              "Popper asked the question by looking around him in 1920s Vienna, where four theories coexisted that all presented themselves as scientific: Einstein's relativity, Marxism, Freud's psychoanalysis and Adler's psychology. All of them explained a great many things. Why did one of them strike him as different?",
              "His answer was this: the difference isn't in how much a theory explains, but in whether it RISKS anything. A theory is scientific if it says in advance what observation would prove it false.",
              "The contrast he used is very clear. Einstein predicted that gravity would bend starlight by an exact, measurable amount; if the bending didn't show up at the 1919 eclipse, his theory was dead. It was measured, it showed up, and the theory survived a test that could have killed it. With the other three, on the other hand, any behaviour could be explained — and so could its opposite: if a man saves a drowning child, that's sublimation; if he pushes him into the water, that's repression. Explaining everything and never being able to fail isn't a virtue: it's the warning sign.",
              "Out of that comes an enormous change of perspective on how knowledge works. We don't accumulate proven truths: we eliminate errors. A thousand white swans don't prove all swans are white; a single black swan proves they aren't. So a scientist's job isn't to look for confirmations — you can always find those — but to try to knock down your own hypothesis with the harshest experiment you can think of.",
              "Hence his view of progress: every theory is provisional, even the best one. What we call knowledge is the set of conjectures that have withstood attempts to refute them so far. His formula was «conjectures and refutations».",
              "With that criterion you can separate science from pseudoscience without being an expert: ask what specific result would make the person talking to you admit they were wrong. If there isn't one, you're not looking at a scientific theory, whether you agree with it or not.",
              "And the most interesting part is that he applied exactly the same thing to politics, and there's his other great idea. A system is an «open society» if it allows decisions to be criticized and CORRECTED without violence. That's why he said the important question isn't «who should govern?» — Plato's question — but «how can we organize ourselves so we can get rid of a bad government without bloodshed?». Democracy, for Popper, isn't the rule of the best: it's the only system with a built-in correction mechanism.",
              "His limit was pointed out by his own most brilliant student and by other critics: in practice, a failed experiment almost never kills a theory outright; it gets adjusted, argued over, explained away. That's what Thomas Kuhn studied, and he comes next in this story.",
            ],
            dato: "Fun fact: science keeps a practical version of his criterion today: publicly registering what you're going to measure BEFORE running the experiment, so you can't decide afterward which result «counted». It's falsification turned into paperwork.",
          },
        ],
      },
      kuhn: {
        titulo: "Thomas Kuhn",
        fecha: "1922–1996",
        cuerpo: [
          "Until Kuhn, many people thought science progressed by accumulating discoveries slowly and steadily.",
          "Kuhn proposed something different. For long stretches, scientists work inside a single framework of ideas he called a paradigm.",
          "But when that framework piles up too many problems it can't solve, a scientific revolution happens: the old paradigm collapses and a new one takes its place, as happened when Newton's physics gave way to Einstein's.",
          "With Kuhn we understood that science has a history of its own too, with crises, ruptures and great changes of mindset.",
        ],
        dato: "Fun fact: thanks to Kuhn, the word «paradigm» moved out of philosophy and is used today in almost every field to talk about a major shift in perspective.",
      },
      foucault: {
        titulo: "Michel Foucault",
        fecha: "1926–1984",
        cuerpo: [
          "Foucault studied something almost nobody had considered: how power doesn't only forbid, it also shapes the way we think and live.",
          "He investigated the history of prisons, hospitals, madness and sexuality, and showed that many ideas we take as natural — normal and abnormal, healthy and sick — change with every era.",
          "According to him, in every historical moment there's a form of knowledge that decides what counts as true and what gets excluded.",
          "His work invites us to look critically at the institutions and rules we accept without questioning.",
        ],
        dato: "Fun fact: Foucault is one of the most cited authors in all the social sciences anywhere in the world.",
        extras: [
          {
            titulo: "Power isn't only at the top: it's in the details",
            cuerpo: [
              "Foucault's contribution is a change of gaze. We're used to imagining power as something that sits in one place — the king, the state, the boss — and comes down in the form of a prohibition. He argued that modern power works differently: it's distributed, it runs through the institutions we consider neutral, and it acts less by forbidding than by PRODUCING behaviours, habits, bodies and forms of normality.",
              "His method was historical: he set about reading archives, case files, regulations and manuals to reconstruct how our institutions changed. And he found a pattern.",
              "He studied MADNESS and showed how, in a few centuries, people who used to live awkwardly integrated into their village came to be shut away, classified and treated as ill, and how the definition of what counts as madness shifted according to what each era found unacceptable.",
              "He studied THE PRISON and told a decisive change: punishment used to fall on the convict's body in public — torture, the scaffold; from the 19th century on it shifted to shutting him in, watching him, measuring him, logging his conduct and correcting him. Punishment stopped being a spectacle of pain and became a programme for reforming a person's insides.",
              "His most famous image is there: the panopticon, a real prison design conceived by Bentham in which the cells surround a central tower from which a guard can see them all without being seen. The important detail is that nobody needs to be in the tower: it's enough that the prisoner CAN'T KNOW. Knowing he may be watched, he watches himself. Foucault used it as a model for how the school, the barracks, the hospital, the factory and the office work: timetables, exams, record cards, appraisals, files.",
              "And he studied SEXUALITY to dismantle a cliché: the Victorian era is said to have repressed it with silence, and he showed the opposite — that it was talked about more than ever, but in consulting rooms, confessionals, medical treatises and reports — turning it into a matter to be classified, diagnosed and confessed.",
              "Hence his most quoted claim: knowledge and power go together. Whoever has the authority to define the normal, the healthy, the correct and the deviant holds enormous power, even without giving a single order. And the disciplines that study people don't only describe: they help manufacture the categories we then understand ourselves with.",
              "It's impossible to read him today without thinking of phones, cameras, algorithms, user ratings, productivity tracking and social media, where on top of everything we watch ourselves voluntarily and expose ourselves for the pleasure of it. He died in 1984, without seeing any of it, and he described the mechanism.",
              "His critics fault him on two things, with reason: that if power is everywhere it becomes hard to point at anyone responsible or propose alternatives, and that his historical reconstructions are sometimes more brilliant than accurate. Even so, his vocabulary is in every social science.",
            ],
            dato: "Fun fact: he wasn't only an armchair theorist. He founded a group to give prisoners a voice, interviewed inmates and took part in protests about their living conditions. The man who wrote the great book about prison also spent his time trying to change real prisons.",
          },
        ],
      },
      "john-rawls": {
        titulo: "John Rawls",
        fecha: "1921–2002",
        cuerpo: [
          "Rawls brought political philosophy back to the centre of the debate with a very old question: what is a just society?",
          "To answer it he proposed a thought experiment. Imagine you had to design the rules of society without knowing what place you'll occupy in it: whether you'll be rich or poor, healthy or ill, a man or a woman.",
          "He called that situation the veil of ignorance. If we don't know what we're going to get, we'll tend to create rules that are fair for everyone, not just for a privileged few.",
          "With this idea he argued that inequalities are only acceptable if they also benefit the worst off.",
        ],
        dato: "Fun fact: his book A Theory of Justice, published in 1971, revived interest in political philosophy all over the world.",
        extras: [
          {
            titulo: "The veil of ignorance: try it yourself",
            cuerpo: [
              "Rawls invented the most useful thought experiment political philosophy has produced, and it works because it neutralizes what ruins any argument about justice: that everyone defends, without noticing, what suits them from where they're standing.",
              "THE TEST. Imagine you have to decide the rules of the society you're going to live in — taxes, healthcare, education, inheritance, rights, punishments — but you don't yet know what place you'll occupy in it. You don't know whether you'll be born rich or poor, in the capital or in a village, healthy or with a serious illness, a man or a woman, with a talent for business or with none, into a family that reads to you as a child or one that doesn't. You don't know which country either, or which century.",
              "From there, what rules would you choose?",
              "Rawls's answer is that nobody would gamble big, because the one dealing is also playing: you'd tend to secure a decent floor for any possible position, the worst included, because it could be yours. And from that he draws his two principles of justice.",
              "FIRST: the same basic liberties for everyone, and non-negotiable. Expression, conscience, the vote, personal property, guarantees before the law. They can't be trimmed in exchange for economic advantages.",
              "SECOND: inequalities are accepted, but on two conditions. That positions and opportunities are genuinely open to all — it isn't enough that applying is legal, it has to be possible — and that the inequality serves to improve the situation of those who are WORST off. That last one is his famous «difference principle»: some people earning far more is only justified if it makes those at the bottom better off than they'd be in a flatter society.",
              "Notice his underlying idea, which is the most powerful part: almost everything that determines your life — your family, your country, your health, your talent, your era — you neither chose nor earned. It's a lottery. And a just society is one that doesn't let the lottery of birth decide the rest.",
              "His critics answered from both sides, and both objections are serious. The libertarians, led by Nozick, said that redistributing what someone has legitimately earned is taking from them without their consent, and that justice has to look at how things were acquired, not at how they end up spread. The communitarians said that the individual with no identity, no culture and no ties who decides behind the veil doesn't exist: nobody chooses their values from nowhere. And Amartya Sen and Martha Nussbaum added that handing out resources isn't enough: you have to look at what each person can actually do with them, because the same money doesn't buy the same freedom for someone with a severe disability.",
              "And the best thing about the tool is that you can use it without being a philosopher. Apply it to any current debate — healthcare, inheritance, housing, immigration, sharing out the climate crisis between generations — and ask yourself what you'd argue for if you didn't know which side you'd land on.",
            ],
            dato: "Fun fact: Rawls was a soldier in the Pacific during the Second World War and was in Japan shortly after the bombing of Hiroshima. That, and the racism he'd seen in the army, lie behind a whole life spent asking how the sharing out of burdens between people can be justified.",
          },
        ],
      },
      "peter-singer": {
        titulo: "Peter Singer",
        fecha: "b. 1946",
        cuerpo: [
          "Singer is one of the most influential — and most controversial — living philosophers.",
          "He argues that when it comes to deciding what's right, what matters is the capacity to suffer. And since animals suffer too, he holds that taking them into account is a question of justice, not of sentimentality.",
          "His ideas drove the animal rights movement and the debate about how we treat other species.",
          "He also holds that if we can prevent great suffering at a small cost to ourselves, we have a moral duty to do it, which has led him to argue for helping the poorest people on the planet.",
        ],
        dato: "Fun fact: Singer popularized «effective altruism», a movement that tries to help as many people as possible using reason and evidence.",
      },
      "byung-chul-han": {
        titulo: "Byung-Chul Han",
        fecha: "b. 1959",
        cuerpo: [
          "Born in South Korea and based in Germany, Byung-Chul Han is one of the most widely read philosophers of the 21st century.",
          "He holds that we've moved from a society that forbade us things to one that demands we perform at maximum constantly.",
          "Nobody forces us from outside any more: we exploit ourselves while believing we're free, always available, always productive. He calls that «the burnout society».",
          "His philosophy helps make sense of things as current as stress, hyperconnection, social media and emotional exhaustion.",
        ],
        dato: "Fun fact: Han makes the case for boredom, contemplation and rest as forms of resistance against a world that never stops.",
      },
      "etica-ia": {
        titulo: "The ethics of Artificial Intelligence",
        fecha: "21st century",
        cuerpo: [
          "For the first time in history, we've created machines capable of learning, deciding and generating texts, images or diagnoses.",
          "That raises entirely new philosophical questions. If a self-driving car has a crash, whose fault is it? If an algorithm decides who gets a loan or a job, how do we stop it being unfair?",
          "Philosophy helps us think these problems through: what values we want machines to respect, how to protect privacy and who should be answerable for their mistakes.",
          "These are questions that no longer belong to the future, but to the present.",
        ],
        dato: "Fun fact: many technology companies now employ philosophers and ethicists to decide how their artificial intelligence systems should behave.",
      },
      transhumanismo: {
        titulo: "Transhumanism",
        fecha: "21st century",
        cuerpo: [
          "Transhumanism is a current that argues for using science and technology to go beyond the limits of the human body and mind.",
          "Its supporters imagine a future in which we could cure every illness, increase our intelligence or even extend life enormously.",
          "But those possibilities raise big doubts. Would we still be human? Would those enhancements be within everyone's reach or only a few people's? Who decides what «improving» means?",
          "So philosophy finds itself facing one of its oldest questions — what is a human being — in a completely new setting.",
        ],
        dato: "Fun fact: some scientists believe the first people who will live past 120 have already been born; others think it's just a technological illusion.",
      },
      "puede-pensar-maquina": {
        titulo: "Can a machine think?",
        fecha: "20th–21st centuries",
        cuerpo: [
          "Whether a machine could ever be conscious is a question that has been with computing since its birth. The mathematician Alan Turing proposed a test: if in conversation with a machine we couldn't tell it apart from a human being, we'd have to admit it «thinks».",
          "But many philosophers disagree. Imitating thought is one thing; genuinely understanding, or being conscious, is quite another.",
          "Does a machine feel anything when it answers, or does it just repeat patterns without understanding a thing? We still don't have an answer.",
          "It's perhaps one of the most fascinating questions philosophy and science share today.",
        ],
        dato: "Fun fact: the famous «Turing test» was proposed in 1950, long before today's computers existed.",
      },
      "busqueda-no-termina": {
        titulo: "The search doesn't end",
        cuerpo: [
          "We've travelled more than two and a half thousand years of questions.",
          "From the first thinkers who looked at nature in search of explanations, to the people asking today about artificial intelligence, they've all shared one impulse: to understand the world and to understand ourselves.",
          "Philosophy has never claimed to give final answers. Its real strength is in teaching us to think better, to doubt, to ask and not to settle for the first thing we're told.",
          "And as long as there are human beings capable of wonder and of asking «why?», the search for wisdom will stay alive.",
        ],
        dato: "Fun fact: the word «philosophy» still means today what it meant 2,500 years ago: love of wisdom. Maybe that's why it will never go out of fashion.",
      },
    },
  },
};
