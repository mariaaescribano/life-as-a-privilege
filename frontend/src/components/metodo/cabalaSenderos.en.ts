/**
 * Los 22 SENDEROS del Árbol de la Vida, en INGLÉS.
 *
 * Aquí va SOLO el texto. El `num`, el `orden`, la letra, el signo hebreo, el
 * `from`/`to` y —sobre todo— los límites de cada banda (`min`/`max`) viven
 * únicamente en `cabalaSenderos.ts`: si se duplicaran, el mismo test podría dar
 * una interpretación distinta según el idioma.
 *
 * De ahí que `test` sea un array de 5 cadenas y `interpretaciones` solo lleve
 * título y texto: se emparejan por POSICIÓN con las españolas. Un sendero que
 * falte aquí se lee entero en español (ver `useSendero` en cabalaEn.ts).
 *
 * Tampoco se traduce `ilustracion`: es el brief interno del dibujo, no se
 * muestra nunca.
 *
 * Al traducir:
 *  · Las letras hebreas y los nombres de las sefirot NO se traducen (Aleph,
 *    Beth…, Keter, Chokhmah, Gevurah, Malkhut…).
 *  · «la Vida» con mayúscula intencionada se queda "Life".
 *  · Las cuatro bandas se dicen SIEMPRE igual: de ahí el helper `bandas`.
 */

export interface SenderoTexto {
  palabraClave: string;
  titulo: string;
  significadoTradicional: string;
  traduccionPsicologica: string;
  pregunta: string;
  une: string[];
  testTitulo: string;
  /** Las 5 frases del test, en el MISMO orden que en español. */
  test: string[];
  /** Las 4 bandas, en el mismo orden: de menos a más resistencia. */
  interpretaciones: { titulo: string; texto: string }[];
  senales: string[];
  umbral?: string;
  integracion: string;
}

/** Los cuatro veredictos, iguales en los 22 senderos. */
const BANDAS = [
  "Flowing transition",
  "Slight resistance",
  "Significant resistance",
  "Priority learning",
] as const;

const bandas = (a: string, b: string, c: string, d: string) =>
  [a, b, c, d].map((texto, i) => ({ titulo: BANDAS[i], texto }));

const ALEPH: SenderoTexto = {
  palabraClave: "Openness",
  titulo: "From Purpose to Clarity",
  significadoTradicional:
    "Aleph (א) is the first letter of the Hebrew alphabet and stands for the primordial breath, Air and the origin of all movement. In the Sefer Yetzirah it represents the energy that comes before all creation: what has no form yet, but holds every possibility.\n\nOn the Tree of Life it joins Keter, the highest will or purpose, with Chokhmah, the first flash of wisdom. It's the moment when an intention starts becoming conscious.",
  traduccionPsicologica:
    "Every transformation begins with an intention, but a purpose only takes on real value when it changes the way we look at reality.\n\nThis path is the ability to let experience refine our ideas. It invites us to swap the need to be right for the wish to understand. Clarity isn't born from defending our beliefs, but from letting reality talk to them.",
  pregunta: "Am I able to let reality transform my ideals?",
  une: [
    "Having a purpose matters, but it can also become a limit if we read everything through our expectations. When we believe we already know the answer, we stop observing with real openness.",
    "This path is the step from the ideal to conscious perception. It teaches us that changing an idea when a greater truth appears doesn't mean losing our way; it means letting our purpose evolve.",
  ],
  testTitulo: "How do you react when reality challenges your ideas?",
  test: [
    "When reality contradicts my plans, I find it hard to accept.",
    "I tend to read events in a way that confirms what I already thought.",
    "When I find new information, I keep going without stopping to revisit my ideas.",
    "I find it hard to let go of an important conviction even when evidence questions it.",
    "Changing my mind makes me uncomfortable, even when I've learned something that justifies it.",
  ],
  interpretaciones: bandas(
    "You're able to revisit your ideas without feeling you're losing your identity. You let reality enrich your purpose.",
    "Sometimes your expectations shape the way you read the facts. There's room to develop a more open way of looking.",
    "You tend to protect your ideas rather than revisit them. Growth begins when you let reality take part in building your purpose.",
    "One of your main challenges is to stop looking for confirmation and start looking for understanding. Reality isn't here to destroy your purpose, but to make it more authentic.",
  ),
  senales: [
    "You look to confirm your own ideas before understanding other people's.",
    "You get frustrated when reality doesn't match your expectations.",
    "You're able to change your mind without feeling you've failed.",
  ],
  umbral: "You can change an important idea without feeling you're losing who you are.",
  integracion: "Reality isn't here to confirm my ideas; it's here to help me refine them.",
};

const BETH: SenderoTexto = {
  palabraClave: "Understanding",
  titulo: "From Purpose to Understanding",
  significadoTradicional:
    "Beth (ב), the second letter of the Hebrew alphabet, means «house». In the kabbalistic tradition it stands for the principle of containment, structure and receptivity. If Aleph is the initial impulse, Beth is the space where that impulse can develop and take shape.\n\nBy connecting Keter with Binah, this path is the step from primordial will toward structured understanding. It reminds us that an intention can only grow when it finds a frame that lets it organize itself, develop and become knowledge.",
  traduccionPsicologica:
    "This path is the ability to turn a purpose into a deep understanding of yourself and of reality. Having an ideal isn't enough; you need to stop, reflect and build a vision that gives meaning to your experiences.\n\nIt invites us to develop a mind able to learn before acting, understanding that big decisions need both inspiration and reflection.",
  pregunta: "Do you give yourself the time you need to understand before acting?",
  une: [
    "Every purpose needs a structure to hold it. Without reflection, good intentions can turn into passing impulses or rushed decisions.",
    "This path is the step from inspiration to understanding. It teaches us that growing isn't only about knowing where we want to go, but about building a solid base that lets us move with more awareness and depth.",
  ],
  testTitulo: "How do you turn your ideals into understanding?",
  test: [
    "I tend to act before I fully understand a situation.",
    "I find it hard to give time to reflecting on my experiences.",
    "I make important decisions without having understood every relevant aspect.",
    "I get impatient when a process needs time to be understood.",
    "Stopping to reflect before drawing conclusions feels like a burden.",
  ],
  interpretaciones: bandas(
    "You know how to turn your ideals into solid understanding before acting. Your purpose rests on reflection and not only on impulse.",
    "Sometimes you move too fast without giving enough time to understanding what you're living.",
    "There's a tendency to act from intention without building deep understanding. Your learning is to develop more patience to integrate experience.",
    "One of your main challenges is to stop before moving forward. Understanding doesn't delay the road; it gives it depth and direction.",
  ),
  senales: [
    "You make important decisions without having reflected enough.",
    "You confuse speed with clarity.",
    "You give time to understanding an experience before reacting to it.",
  ],
  integracion: "Every deep transformation needs a space to understand before acting.",
};

const GIMEL: SenderoTexto = {
  palabraClave: "Integration",
  titulo: "From Purpose to Authenticity",
  significadoTradicional:
    "Gimel means \"camel\", the animal that crosses the desert carrying provisions between two distant places. In the kabbalistic tradition it stands for movement, sustenance and the ability to carry what's essential to where it's really needed. By joining Keter with Tiferet, this path is the descent of the higher will down to the heart. Having a high purpose isn't enough; that purpose has to feed your inner Life to become a transforming force. Gimel teaches that real purpose doesn't stay in the world of ideas: it reaches the heart and becomes a way of living.",
  traduccionPsicologica:
    "This path is the ability to let our deepest values stop being abstract ideals and become an authentic part of our identity. Many people know what they consider important, yet live disconnected from it. This path invites us to close that distance, letting purpose guide not only our decisions but also the way we feel, relate and stay present.",
  pregunta: "Does your purpose live only in your mind, or in your heart too?",
  une: [
    "Having a purpose doesn't guarantee living by it. We often know who we want to be, but our emotions, our fears or our wounds pull us away from that direction.",
    "This path is the moment when purpose stops being an inspiring idea and starts becoming a lived identity. Real change happens when what we believe is important also transforms the way we feel and relate to the world.",
  ],
  testTitulo: "How much is your purpose a part of who you are?",
  test: [
    "I often feel my actions don't reflect what I consider important.",
    "I find it hard to connect emotionally with the purpose I want to live.",
    "My decisions drift away from the values I consider essential.",
    "When difficulties come, I easily forget what gives my Life meaning.",
    "My purpose feels like a separate idea that doesn't guide the way I live.",
  ],
  interpretaciones: bandas(
    "Your purpose doesn't only guide your decisions; it's part of the person you are. There's a healthy connection between your values and your emotional Life.",
    "You know what matters to you, but you don't always manage to hold that connection when difficulties or intense emotions arrive.",
    "There's a distance between your ideals and the way you live. Your growth is to bring your purpose closer and closer to your everyday identity.",
    "One of your main challenges is to stop living purpose as a future goal and start experiencing it as a present way of being.",
  ),
  senales: [
    "Your decisions really reflect the values you say you have.",
    "You remember your purpose when difficult emotions appear.",
    "You act looking to be coherent with yourself rather than to meet outside expectations.",
  ],
  integracion: "My purpose stops being a goal when it becomes the way I choose to live each day.",
};

const DALETH: SenderoTexto = {
  palabraClave: "Trust",
  titulo: "From Clarity to Understanding",
  significadoTradicional:
    "Daleth (ד) means \"door\". In the kabbalistic tradition it stands for access, opening and the step between two states of consciousness. Every door offers a possibility, but walking through it takes a conscious decision.\n\nBy connecting Chokhmah with Binah, this path is the step from the flash of wisdom toward structured understanding. It teaches that intuition is only the beginning; it needs to be explored, questioned and integrated to become real knowledge.",
  traduccionPsicologica:
    "This path is the ability to turn a perception into understanding. Seeing something clearly doesn't mean understanding it deeply.\n\nIt reminds us that growing means pausing, questioning our first impressions and letting reflection complete what intuition has barely begun to reveal.",
  pregunta: "Do you stop to understand what you perceive, or react from the first impression?",
  une: [
    "Perceiving a reality and understanding it are different processes. Intuition can open a door, but only reflection lets you walk through it and discover what's on the other side.",
    "This path teaches us to swap automatic answers for a deeper understanding. Real wisdom appears when we stop reacting immediately and start exploring the meaning of what we live.",
  ],
  testTitulo: "How do you turn a perception into understanding?",
  test: [
    "I tend to draw conclusions before I fully understand a situation.",
    "I find it hard to listen to different perspectives once I've formed an opinion.",
    "I decide without having understood every aspect of the situation.",
    "I often react faster than I reflect.",
    "I find it hard to revisit my conclusions when new information appears.",
  ],
  interpretaciones: bandas(
    "You know how to turn your perceptions into deeper understanding. Reflection complements your intuition and helps you make conscious decisions.",
    "Sometimes you trust your first impressions too much. Giving more time to understanding will enrich the way you read reality.",
    "There's a tendency to react before understanding. Your growth is to develop the patience to explore a situation before drawing conclusions.",
    "One of your main challenges is to walk through the door of understanding. Intuition can show the way, but only reflection reveals its real meaning.",
  ),
  senales: [
    "You draw conclusions before asking questions.",
    "You listen in order to understand, or in order to confirm your opinion.",
    "You change perspective when you discover new information.",
  ],
  umbral: "You're able to swap the immediate reaction for a deeper understanding of reality.",
  integracion: "Intuition opens the door; understanding invites me to walk through it.",
};

const HE: SenderoTexto = {
  palabraClave: "Discernment",
  titulo: "From Clarity to Harmony",
  significadoTradicional:
    "He (ה) means \"window\" or \"revealed breath\". In the kabbalistic tradition it stands for opening to a new perspective and the ability to let the light in. It represents the revealing of what was hidden before.\n\nBy connecting Chokhmah with Tiferet, this path is the step from clear perception toward integration in the heart. It teaches that real wisdom isn't only about seeing clearly, but about letting that clarity transform the way we feel, live and relate.",
  traduccionPsicologica:
    "This path is the ability to let a new understanding change our inner world. We often grasp a truth with the mind and keep living as if we'd never discovered it.\n\nIt reminds us that growth happens when clarity stops being an idea and starts shaping our emotions, decisions and relationships.",
  pregunta: "Do you let what you discover really transform the way you live?",
  une: [
    "Understanding something doesn't guarantee that understanding will change our Life. We can discover an important truth and still keep reacting from the same old habits.",
    "This path is the moment when a new vision stops being only knowledge and starts becoming an inner experience. Only when a truth reaches the heart can it bring authentic transformation.",
  ],
  testTitulo: "How much do you let a new understanding transform your Life?",
  test: [
    "I understand my mistakes, but I keep reacting the same way.",
    "I find it hard to change habits, even when I know they no longer help me.",
    "When I learn something important, it stays in theory and I don't bring it into my Life.",
    "I often keep what I think separate from what I feel.",
    "Important experiences pass without transforming the way I live.",
  ],
  interpretaciones: bandas(
    "You let what you understand transform your inner world. There's a good connection between what you learn and the way you live.",
    "Sometimes you understand a situation but need more time to integrate it emotionally.",
    "There's a distance between what you know and what really changes in your Life. Your growth is to let what you learn also reach your heart.",
    "One of your main challenges is to turn knowledge into inner experience. Understanding is the first step; integrating that understanding is what produces change.",
  ),
  senales: [
    "You discover something important but carry on acting the same way.",
    "Your emotions go along with what you know, or seem to take a different road.",
    "You give an experience time to transform you before looking for the next one.",
  ],
  umbral: "What you understand starts showing up naturally in the way you feel, decide and relate.",
  integracion: "Real understanding transforms the heart first, and then Life.",
};

const VAV: SenderoTexto = {
  palabraClave: "Union",
  titulo: "From Clarity to Generosity",
  significadoTradicional:
    "Vav (ו) means \"hook\", \"nail\" or \"union\". In the kabbalistic tradition it stands for what connects two realities and lets them stay joined. It's the symbol of the bond, of continuity, of the connection between heaven and earth.\n\nBy connecting Chokhmah with Chesed, this path is the step from wisdom toward the expression of love and generosity. It teaches that real understanding doesn't stay locked in the mind, but shows up in the way we treat others.",
  traduccionPsicologica:
    "This path is the ability to turn understanding into generosity. Understanding people isn't enough; the next step is to act from that understanding.\n\nIt reminds us that knowledge reaches its real value when it inspires empathy, service and a sincere willingness to add to other people's wellbeing.",
  pregunta: "Does your understanding of others turn into actions, or stay in your thoughts?",
  une: [
    "Understanding a situation or a person is valuable, but that understanding takes on a deeper meaning when it shapes the way we act. Wisdom comes into its own when it generates compassion and service.",
    "This path invites us to build a bridge between what we know and the way we relate to the world. Understanding without acting can turn into indifference; acting from understanding transforms our relationships.",
  ],
  testTitulo: "How do you turn your understanding into generous action?",
  test: [
    "Even though I understand other people's difficulties, I rarely do anything to help them.",
    "I tend to keep my knowledge or experience to myself instead of sharing it.",
    "When I see someone needs support, I let it pass even when helping is within my reach.",
    "I often think helping others isn't my responsibility.",
    "I find it hard to put my abilities at other people's service, even when I could add something valuable.",
  ],
  interpretaciones: bandas(
    "You're able to turn your understanding into concrete action. Your knowledge shows up naturally as empathy and generosity.",
    "You understand other people's needs, but you don't always take the step into action. There's room to express more often what you already know.",
    "You tend to keep understanding on the intellectual level. Your growth is to let that knowledge translate into small everyday gestures and actions.",
    "One of your main challenges is discovering that real wisdom doesn't end in understanding; it begins when that understanding improves other people's Lives.",
  ),
  senales: [
    "You understand a need but decide not to act, out of comfort or indifference.",
    "You share what you know when it can be useful to someone.",
    "Your actions reflect the empathy you say you feel.",
  ],
  umbral: "Understanding stops being only knowledge and naturally becomes a way of serving and caring for others.",
  integracion: "Wisdom comes into its own when it's expressed through generosity.",
};

const ZAYIN: SenderoTexto = {
  palabraClave: "Discernment",
  titulo: "From Understanding to Wisdom",
  significadoTradicional:
    "Zayin (ז) means \"sword\" or \"weapon\". In the kabbalistic tradition it stands for discernment, the ability to separate the essential from the superficial and to act clearly in the face of reality. It doesn't represent violence, but the faculty of telling precisely what deserves keeping from what should be left behind.\n\nBy connecting Binah with Tiferet, this path is the step from intellectual understanding toward the wisdom of the heart. It teaches that knowledge only comes into its own when it transforms the way we are.",
  traduccionPsicologica:
    "This path is the ability to turn knowledge into wisdom. Understanding an idea matters, but living by it takes discernment, coherence and maturity.\n\nIt reminds us that real wisdom isn't about collecting answers, but about knowing which ones deserve to be part of our Life.",
  pregunta: "Has what you understand really transformed the way you live?",
  une: [
    "Understanding something doesn't guarantee it becomes part of us. We often collect knowledge, advice or experiences that never end up changing the way we act.",
    "This path is the moment when knowledge stops being information and starts becoming wisdom. Only what transforms our decisions can be considered truly learned.",
  ],
  testTitulo: "How do you turn knowledge into wisdom?",
  test: [
    "I often know what the best decision would be, but I end up acting differently.",
    "I learn new things, but they rarely change my habits or the way I live.",
    "I stop applying what I consider important as soon as it takes effort.",
    "I find it easier to talk about what I know than to live by it.",
    "Important experiences rarely change the way I act.",
  ],
  interpretaciones: bandas(
    "You're able to turn knowledge into wisdom. What you learn shows up naturally in your decisions and in the way you live.",
    "You understand many things, but you don't always manage to integrate them fully into your everyday Life.",
    "There's a significant difference between what you know and what you practice. Your growth is to turn knowledge into lived experience.",
    "One of your main challenges is discovering that wisdom isn't measured by what you know, but by the way you choose to live each day.",
  ),
  senales: [
    "You give advice you don't follow yourself.",
    "You make decisions coherent with what you know matters.",
    "You tell the difference between collecting information and transforming the way you live.",
  ],
  umbral: "Knowledge stops being an idea and becomes a natural guide for your decisions and actions.",
  integracion: "Wisdom begins when what I understand becomes the way I choose to live.",
};

const CHET: SenderoTexto = {
  palabraClave: "Boundaries",
  titulo: "From Understanding to Boundaries",
  significadoTradicional:
    "Chet (ח) means \"fence\" or \"enclosure\". In the kabbalistic tradition it stands for protected space, the boundaries that let Life and order be preserved. It doesn't represent a barrier to isolate yourself, but a structure that protects what has value.\n\nBy connecting Binah with Gevurah, this path is the step from understanding toward discernment and discipline. It teaches that understanding a situation also means knowing how far to go, when to act and when to say \"no\".",
  traduccionPsicologica:
    "This path is the ability to turn understanding into healthy boundaries. Understanding a person or a situation doesn't mean accepting everything or giving up our needs.\n\nIt reminds us that real maturity is about combining empathy with firmness, setting boundaries that protect our wellbeing without ceasing to respect others.",
  pregunta: "Can you set boundaries without ceasing to understand others?",
  une: [
    "Understanding someone's reasons doesn't mean justifying any behavior. We often confuse empathy with permissiveness and end up sacrificing our wellbeing to avoid conflict.",
    "This path teaches us that setting boundaries doesn't contradict understanding; it completes it. Only when we know how to protect what matters to us can we relate from respect rather than from exhaustion or obligation.",
  ],
  testTitulo: "How do you turn understanding into healthy boundaries?",
  test: [
    "Even when I understand a situation is harming me, I find it hard to set boundaries.",
    "I tend to give in to avoid conflict, even when I don't agree.",
    "I find it hard to express my boundaries, even when I know it's necessary.",
    "I feel guilty when I put my own needs first.",
    "I experience setting boundaries as something that damages relationships.",
  ],
  interpretaciones: bandas(
    "You know how to combine understanding with healthy boundaries. You can care for others without ceasing to care for yourself.",
    "Sometimes you understand others so much that you forget to protect your own needs. There's room to strengthen your boundaries.",
    "You tend to confuse understanding with giving yourself up. Your growth is to discover that saying \"no\" can also be an act of respect and balance.",
    "One of your main challenges is to develop clear, healthy boundaries. Understanding doesn't mean allowing everything; it means acting with awareness, respect and responsibility.",
  ),
  senales: [
    "You say \"yes\" when you really want to say \"no\".",
    "You justify behavior that crosses your own boundaries.",
    "You express your needs clearly and respectfully.",
  ],
  umbral: "You understand that setting boundaries doesn't break relationships; it makes them healthier and more authentic.",
  integracion: "Understanding brings me closer to others; boundaries also let me respect myself.",
};

const TET: SenderoTexto = {
  palabraClave: "Balance",
  titulo: "From Generosity to Boundaries",
  significadoTradicional:
    "Tet (ט) stands for hidden good. In the kabbalistic tradition it represents the ability to find the balance behind what at first sight looks contradictory. It teaches that real kindness isn't always about giving more, but about acting wisely.\n\nBy connecting Chesed with Gevurah, this path is the integration of generosity and discipline. It reminds us that love needs boundaries to stay healthy, and that firmness can also be a form of compassion.",
  traduccionPsicologica:
    "This path is the ability to balance the wish to help with the need to protect our energy and respect other people's responsibility.\n\nIt invites us to discover that caring doesn't mean solving everyone else's problems, but offering support without losing our own balance.",
  pregunta: "Can you care for others without ceasing to care for yourself?",
  une: [
    "Giving is a natural expression of love, but when there are no boundaries, generosity can turn into exhaustion, dependence or frustration. Helping doesn't always mean doing more; sometimes it means letting the other person grow on their own.",
    "This path teaches that real compassion knows when to come close and when to give space. Balance appears when love stops being sacrifice and becomes a conscious choice.",
  ],
  testTitulo: "How do you balance generosity with boundaries?",
  test: [
    "I find it hard to say \"no\" when someone needs my help.",
    "I often take on problems that really belong to other people.",
    "When I help, I end up feeling I have to take responsibility for everything.",
    "I feel guilty when I put my own needs before other people's.",
    "Setting a boundary feels like ceasing to care for the other person.",
  ],
  interpretaciones: bandas(
    "You've learned to balance generosity with healthy boundaries. You know how to offer support without losing your wellbeing or taking on responsibilities that aren't yours.",
    "Sometimes you give more than you can sustain. Strengthening your boundaries will let you help in a healthier, more sustainable way.",
    "There's a tendency to confuse love with sacrifice. Your growth is to discover that caring for yourself is also part of caring for others.",
    "One of your main challenges is understanding that generosity without boundaries ends up weakening both the one who helps and the one who receives the help. Balance is the most mature expression of love.",
  ),
  senales: [
    "You help out of choice, or out of guilt.",
    "You solve problems other people could face on their own.",
    "You let yourself say \"no\" without feeling you're no longer a good person.",
  ],
  umbral: "You discover that setting boundaries doesn't reduce your ability to love; it makes it more conscious, free and sustainable.",
  integracion: "The wisest love isn't the one that gives most, but the one that knows when to give and when to let grow.",
};

const YOD: SenderoTexto = {
  palabraClave: "Conscious action",
  titulo: "From Generosity to Conscious Compassion",
  significadoTradicional:
    "Yod (י) means \"hand\". It's the smallest letter of the Hebrew alphabet, yet every other letter is born from it. In the kabbalistic tradition it stands for conscious action, the potential held in a gesture and the ability to transform reality through simple but meaningful acts.\n\nBy connecting Chesed with Tiferet, this path is the step from spontaneous generosity toward balanced compassion. It teaches that real love isn't only about giving, but about giving with wisdom and presence.",
  traduccionPsicologica:
    "This path is the ability to act from conscious love. Not all help produces wellbeing, and not every good intention brings a good result.\n\nIt invites us to develop a generosity guided by reflection, where each action answers what the other person really needs and not only our own wish to help.",
  pregunta: "Do you help from awareness, or from the urge to feel needed?",
  une: [
    "Generosity comes from the wish to contribute, but compassion takes understanding what the other person really needs. Sometimes the greatest act of love isn't doing more, but doing what fits.",
    "This path teaches us that helping also means listening, respecting the other person's timing and acting with balance. Real compassion doesn't look to feel useful; it looks to support growth.",
  ],
  testTitulo: "How do you turn generosity into conscious compassion?",
  test: [
    "I tend to help without asking myself whether that help is really what the other person needs.",
    "I find it hard to tell supporting someone apart from solving their problems.",
    "I help without stopping to understand what the other person really needs.",
    "I often offer help to feel useful or valued.",
    "When I walk alongside someone, I need to control how the situation ends.",
  ],
  interpretaciones: bandas(
    "Your generosity comes with understanding and balance. You know how to offer support while respecting each person's autonomy and process.",
    "Sometimes you help from impulse rather than from reflection. Taking a moment to understand the situation can make your support far more valuable.",
    "There's a tendency to confuse helping with taking charge. Your growth is to discover that being there doesn't always mean stepping in.",
    "One of your main challenges is to turn the need to help into conscious compassion. The most valuable help isn't always the one that does most, but the one that best answers what the other person needs.",
  ),
  senales: [
    "You offer help before asking what the other person really needs.",
    "You step in to ease your own discomfort, or to support the other person's growth.",
    "You're able to be there without controlling the process or the outcome.",
  ],
  umbral: "The way you help stops answering the urge to do more and starts answering the other person's real need.",
  integracion: "Compassion isn't doing everything for others, but offering what they really need in order to grow.",
};

const KAF: SenderoTexto = {
  palabraClave: "Perseverance",
  titulo: "From Generosity to Perseverance",
  significadoTradicional:
    "Kaf (כ) means \"palm of the hand\". In the kabbalistic tradition it stands for the ability to hold, contain and give shape to what we receive. It represents the potential that only develops through commitment and steady action.\n\nBy connecting Chesed with Netzach, this path is the step from the generous impulse toward perseverance. It teaches that good intentions only have lasting impact when they're kept over time.",
  traduccionPsicologica:
    "This path is the ability to turn the initial enthusiasm into commitment. Helping, loving or starting a project is relatively easy; the hard part is staying when tiredness, routine or difficulty arrive.\n\nIt reminds us that real generosity isn't measured by one isolated act, but by the ability to hold what we consider important even when it stops being easy.",
  pregunta: "Can you keep your commitment when motivation disappears?",
  une: [
    "Good intentions are born easily, but only perseverance turns them into reality. Many people start projects with enthusiasm and drop them when the first obstacles appear.",
    "This path is the step from impulse to commitment. It teaches us that what's worth building takes steadiness, even when the results aren't visible yet.",
  ],
  testTitulo: "How do you turn generosity into perseverance?",
  test: [
    "I start projects or commitments with enthusiasm, but I find it hard to keep them over time.",
    "When results are slow to arrive, I tend to lose motivation.",
    "When a commitment stops being exciting, I find it hard to keep it.",
    "I need to feel enthusiasm to carry on with something important.",
    "Building little by little feels like an uphill climb when progress is slow.",
  ],
  interpretaciones: bandas(
    "You've learned to turn motivation into commitment. Your steadiness doesn't depend only on enthusiasm, but on the importance you give to what you've chosen to build.",
    "Sometimes your perseverance depends too much on how you feel. Developing more steadiness will strengthen your projects and relationships.",
    "There's a tendency to give up when the initial motivation disappears. Your growth is to discover that discipline can hold what enthusiasm can't.",
    "One of your main challenges is to turn good intentions into sustained commitment. Perseverance isn't about always moving forward eagerly, but about carrying on because you know why you started.",
  ),
  senales: [
    "You drop a task because it has stopped being exciting.",
    "You make decisions based only on how you feel at that moment.",
    "You keep the commitments you've made to yourself even when no one is watching.",
  ],
  umbral: "Your decisions stop depending on motivation and start resting on your commitment to what you really value.",
  integracion: "Enthusiasm starts the road; perseverance turns it into reality.",
};

const LAMED: SenderoTexto = {
  palabraClave: "Balance",
  titulo: "From Boundaries to Balance",
  significadoTradicional:
    "Lamed (ל) means \"to learn\" or \"to teach\". It's the only Hebrew letter that rises above the others, standing for the aspiration toward a higher level of understanding. In the kabbalistic tradition it represents continuous learning and the ability to turn discipline into wisdom.\n\nBy connecting Gevurah with Tiferet, this path is the step from firmness toward balance. It teaches that boundaries reach their real purpose when they stop being a reaction and become a conscious expression of our values.",
  traduccionPsicologica:
    "This path is the ability to balance firmness with compassion. Knowing how to set boundaries matters, and so does doing it from serenity and not from fear, rigidity or anger.\n\nIt reminds us that maturity is about finding a point where protecting yourself and respecting others can live together without clashing.",
  pregunta: "Do your boundaries come from calm, or from the need to control?",
  une: [
    "Boundaries are necessary, but when they turn too rigid they can push others away. In the same way, compassion without boundaries can lead us to exhaustion or to losing our identity.",
    "This path teaches us that balance isn't about choosing between firmness and kindness, but about learning when each one is needed. Real strength knows how to protect without hardening.",
  ],
  testTitulo: "How do you turn boundaries into balance?",
  test: [
    "When I set boundaries, I tend to do it abruptly or impulsively.",
    "I find it hard to find a middle point between giving in and being too rigid.",
    "When I express a boundary, I find it hard to do it with respect and serenity.",
    "When someone doesn't act as I expect, I tend to harden my position.",
    "I find it hard to understand the other person and hold my boundaries at the same time.",
  ],
  interpretaciones: bandas(
    "You've learned to combine firmness and understanding. Your boundaries protect your values without damaging your relationships.",
    "Sometimes you swing between being too flexible and too rigid. There's room to develop a steadier balance.",
    "You tend to use boundaries as a way of protecting yourself from conflict or discomfort. Your growth is to discover a calmer, more conscious firmness.",
    "One of your main challenges is understanding that real strength doesn't need to impose itself. The healthiest boundaries come from balance, not from control.",
  ),
  senales: [
    "You react harshly when someone crosses a boundary.",
    "You avoid conflict until you end up exploding.",
    "You aren't able to stay calm while you express what you need.",
  ],
  umbral: "Your boundaries stop being a defensive reaction and become a calm expression of who you are and what you value.",
  integracion: "Real strength isn't about hardening, but about keeping your balance even when you need to say 'no'.",
};

const MEM: SenderoTexto = {
  palabraClave: "Expression",
  titulo: "From Boundaries to Expression",
  significadoTradicional:
    "Mem (מ) means \"water\". In the kabbalistic tradition it stands for depth, reflection and the ability to adapt without losing your own essence. Water finds its way without needing to impose itself, showing that real strength can be expressed with serenity.\n\nBy connecting Gevurah with Hod, this path is the step from discipline and boundaries toward conscious communication. It teaches that firmness reaches its greatest value when it can be expressed with clarity, humility and respect.",
  traduccionPsicologica:
    "This path is the ability to communicate our boundaries in a healthy way. Setting boundaries isn't only about saying \"no\", but about expressing our needs clearly, respectfully and at the right time.\n\nIt reminds us that authentic communication doesn't look to impose or to avoid conflict, but to create mutual understanding.",
  pregunta: "Do you express your boundaries clearly, or wait for the discomfort to speak for you?",
  une: [
    "A boundary that isn't communicated can hardly be respected. In the same way, a boundary expressed from anger or resentment usually creates more distance than understanding.",
    "This path teaches us that communication is the bridge between what we need and the way we relate to others. Expressing a boundary calmly strengthens both self-respect and the quality of our relationships.",
  ],
  testTitulo: "How do you express your boundaries?",
  test: [
    "I tend to keep quiet about what bothers me until I end up exploding.",
    "I find it hard to express my needs out of fear of creating conflict.",
    "I find it hard to communicate my boundaries clearly and respectfully.",
    "When I set a boundary, I tend to do it from anger or frustration.",
    "I let the discomfort build up before expressing what I need.",
  ],
  interpretaciones: bandas(
    "You know how to express your boundaries with serenity and clarity. Your communication supports mutual respect and avoids unnecessary conflict.",
    "Sometimes you put off important conversations or wait too long to express what you need. Speaking earlier will strengthen your relationships.",
    "There's a tendency to hold the discomfort in, or to voice it once it's already too intense. Your growth is to express your needs before they turn into frustration.",
    "One of your main challenges is discovering that communicating a boundary isn't creating a conflict, but giving others the chance to respect it. Clarity prevents many of the problems that silence ends up feeding.",
  ),
  senales: [
    "You wait too long before expressing what makes you uncomfortable.",
    "You trust others to guess what you need without saying it.",
    "You communicate your boundaries calmly, or only when you can't take any more.",
  ],
  umbral: "You're able to express your needs with clarity, respect and serenity, without waiting for the discomfort to decide for you.",
  integracion: "Boundaries protect my values; communication gives them the chance to be understood.",
};

const NUN: SenderoTexto = {
  palabraClave: "Resilience",
  titulo: "From Balance to Perseverance",
  significadoTradicional:
    "Nun (נ) means \"fish\". In the kabbalistic tradition it stands for the continuity of Life, the ability to move forward even in deep waters and resilience in the face of change. It represents constant movement and the quiet strength that lets us keep growing despite difficulty.\n\nBy connecting Tiferet with Netzach, this path is the step from inner balance toward perseverance. It teaches that harmony isn't proven when everything goes well, but when we're able to hold our center in the middle of challenges.",
  traduccionPsicologica:
    "This path is the ability to hold our values and our balance when obstacles appear. It's easy to act serenely when circumstances are kind; real growth begins when we decide to keep our course even in hard moments.\n\nIt reminds us that perseverance is born from inner balance, not from stubbornness.",
  pregunta: "Do you keep your values when Life stops being easy?",
  une: [
    "Finding balance is an important achievement, but keeping it when pressure, tiredness or frustration arrive is a much bigger challenge. Many people lose their center quickly when circumstances change.",
    "This path teaches us that real perseverance isn't about holding on out of pride, but about carrying on without losing what defines us. Staying faithful to our values is the deepest form of steadiness.",
  ],
  testTitulo: "How do you keep your balance in the face of difficulty?",
  test: [
    "When things get complicated, I easily drop what I consider important.",
    "Stress or frustration make me act very differently from how I really want to be.",
    "In hard moments I find it difficult to hold on to my principles.",
    "When obstacles appear, I tend to lose motivation quickly.",
    "Difficulties weaken my commitment to what I consider valuable.",
  ],
  interpretaciones: bandas(
    "You've developed a perseverance based on balance. Difficulties don't change who you are or what you consider important.",
    "Sometimes problems affect your steadiness more than you'd like. Strengthening your inner balance will help you keep your course.",
    "There's a tendency to lose your center when obstacles appear. Your growth is to learn to hold your values even in moments of uncertainty.",
    "One of your main challenges is discovering that perseverance doesn't depend on everything going well, but on the ability to stay faithful to what really matters.",
  ),
  senales: [
    "Your decisions change when difficulty or pressure appears.",
    "You drop commitments because of the tiredness of the moment.",
    "You don't remember your values before reacting to a problem.",
  ],
  umbral: "Circumstances stop determining who you are, because your values become the real engine of your decisions.",
  integracion: "Perseverance isn't about withstanding everything, but about staying faithful to what gives my road meaning.",
};

const SAMEKH: SenderoTexto = {
  palabraClave: "Coherence",
  titulo: "From Balance to Coherence",
  significadoTradicional:
    "Samekh (ס) means \"support\". In the kabbalistic tradition it stands for what holds a structure firm and lets it stay stable over time. It represents the foundation on which something can grow without losing its balance.\n\nBy connecting Tiferet with Yesod, this path is the step from inner balance toward building a solid base. It teaches that values and harmony only settle when they translate into consistent habits and actions.",
  traduccionPsicologica:
    "This path is the ability to turn inner balance into a stable way of living. Feeling centered is valuable, but that balance needs to show up in our routines, decisions and everyday commitments.\n\nIt reminds us that coherence isn't born from a moment of inspiration, but from the small actions we repeat each day.",
  pregunta: "Do your habits reflect the balance you want to live?",
  une: [
    "Finding inner balance is an important step, but keeping it takes a solid base. Without coherent habits, even the best intentions end up weakening over time.",
    "This path teaches us that stability doesn't depend on how we feel at a given moment, but on the decisions we repeat steadily. Coherence turns values into a way of living.",
  ],
  testTitulo: "How do you turn your balance into a coherent Life?",
  test: [
    "I find it hard to keep habits aligned with the values I consider important.",
    "My decisions change easily depending on my mood.",
    "My daily actions drift away from what I believe in.",
    "I often put off what I know does me good.",
    "If no one holds me to them, I let my personal commitments drop.",
  ],
  interpretaciones: bandas(
    "You've managed to turn your values into a stable way of living. Your habits strengthen the balance you've built.",
    "Sometimes there's a gap between what you consider important and what you do each day. Small sustained changes can strengthen your coherence.",
    "Your inner balance doesn't yet show up consistently in your habits and decisions. Your growth is to build a firmer base to hold what you value.",
    "One of your main challenges is discovering that a coherent Life isn't built out of great isolated decisions, but out of small actions repeated every day.",
  ),
  senales: [
    "Your habits really reflect your values.",
    "You keep the commitments you make to yourself.",
    "You make decisions from your principles, or from the impulse of the moment.",
  ],
  umbral: "Your values stop being only an intention and start showing up steadily in the way you choose to live.",
  integracion: "Coherence isn't proven in the great decisions, but in the small acts I repeat each day.",
};

const AYIN: SenderoTexto = {
  palabraClave: "Authenticity",
  titulo: "From Balance to Expression",
  significadoTradicional:
    "Ayin (ע) means \"eye\". In the kabbalistic tradition it stands for inner vision, deep perception and the ability to see beyond appearances. It isn't limited to observing the outer world; it represents the conscious gaze that lets us discover the meaning of our experiences.\n\nBy connecting Tiferet with Hod, this path is the step from inner harmony toward conscious expression. It teaches that the truth living in the heart needs to be communicated in order to transform our relationships and our reality.",
  traduccionPsicologica:
    "This path is the ability to authentically express what we feel and believe. Knowing ourselves isn't enough; we also need to learn to communicate our truth with clarity, humility and respect.\n\nIt reminds us that an authentic Life isn't only about feeling inner coherence, but about letting that coherence also show up in the way we speak, listen and relate.",
  pregunta: "Do you express what you really are, or adjust your voice to be accepted?",
  une: [
    "Finding inner balance is only part of the road. Many people know who they are, but find it hard to show it out of fear of rejection, conflict or not being understood.",
    "This path teaches us that authenticity comes into its own when it finds a voice. Expressing our truth respectfully strengthens both our identity and the quality of our relationships.",
  ],
  testTitulo: "How do you express your truth?",
  test: [
    "I tend to keep quiet about what I really think to avoid conflict.",
    "I adjust the way I am so others will accept me.",
    "I keep my opinions to myself when I know they might not go down well.",
    "I find it hard to show how I really feel.",
    "I feel the way I communicate doesn't reflect who I really am.",
  ],
  interpretaciones: bandas(
    "There's a good coherence between what you feel and the way you express it. Your communication strengthens your authenticity.",
    "Sometimes you hide part of who you are to avoid unsettling or disappointing others. Expressing yourself more naturally will strengthen your relationships.",
    "There's a gap between your inner world and the way you communicate. Your growth is to develop a more authentic, confident voice.",
    "One of your main challenges is discovering that expressing your truth respectfully doesn't put your relationships at risk; it lets them be more honest and deeper.",
  ),
  senales: [
    "You stay silent when you really need to express something important.",
    "You change your opinion to get approval.",
    "You communicate from authenticity, or from fear of how others will react.",
  ],
  umbral: "The way you express yourself naturally reflects who you are, with no need to hide or to impose.",
  integracion: "My voice is stronger when it comes from authenticity and not from the need to be accepted.",
};

const PE: SenderoTexto = {
  palabraClave: "The word",
  titulo: "From Perseverance to Expression",
  significadoTradicional:
    "Pe (פ) means \"mouth\". In the kabbalistic tradition it stands for the power of the word, communication and the ability to shape reality through what we express. The word doesn't only carry thoughts; it also creates, inspires and transforms.\n\nBy connecting Netzach with Hod, this path is the step from perseverance toward conscious communication. It teaches that sustained effort reaches a new level when we're able to share what we've learned and express clearly what gives our road meaning.",
  traduccionPsicologica:
    "This path is the ability to authentically communicate what we've built through experience. Perseverance transforms us inside, but sharing that learning can also transform the people around us.\n\nIt reminds us that expressing our experience honestly strengthens both our growth and our relationships.",
  pregunta: "Do you share what you've learned, or keep your experience only for yourself?",
  une: [
    "Steadiness helps us grow, but that growth takes on new value when we can put it into words. We often live through important learning that we never end up expressing, losing the chance to understand it better or to inspire others.",
    "This path teaches us that communicating isn't about talking more, but about sharing what really deserves to be said. Experience finds new meaning when it can become a source of shared learning.",
  ],
  testTitulo: "How do you turn perseverance into communication?",
  test: [
    "I find it hard to express what I've learned through my experiences.",
    "I'd rather keep my ideas or learning to myself than share them.",
    "I keep quiet about my experiences even when I think they could be valuable to others.",
    "Even when I have something important to say, I usually keep it to myself out of insecurity.",
    "I find it hard to put my learning into words, even though I know it would help me understand it.",
  ],
  interpretaciones: bandas(
    "You know how to express clearly what you've learned. Your communication comes from experience and adds to your growth as much as to other people's.",
    "Sometimes you hesitate before sharing what you know or have lived. Trusting your experience more will enrich the way you communicate.",
    "There's a tendency to keep valuable learning to yourself. Your growth is to discover that sharing your experience is also part of learning.",
    "One of your main challenges is to find your own voice. What you've built with effort can become a source of inspiration and growth once you decide to express it.",
  ),
  senales: [
    "You stay silent when your experience could help someone.",
    "You play down what you've learned by thinking it \"isn't enough\".",
    "You share what you've learned from authenticity and not from the need to impress.",
  ],
  umbral: "Your experience stops being only personal growth and starts becoming a source of value for others.",
  integracion: "When I authentically share what Life has taught me, my learning also starts growing in others.",
};

const TSADI: SenderoTexto = {
  palabraClave: "Habits",
  titulo: "From Perseverance to Habits",
  significadoTradicional:
    "Tsadi (צ) means \"righteous\" or \"uprightness\". In the kabbalistic tradition it represents the person who lives according to their principles, standing firm even when no one is watching. It stands for the coherence between inner convictions and the way we act.\n\nBy connecting Netzach with Yesod, this path is the step from perseverance toward settling a stable base. It teaches that steadiness only transforms Life when it becomes habits that hold our values.",
  traduccionPsicologica:
    "This path is the ability to turn effort into a way of living. Persevering isn't only about withstanding difficulty, but about creating routines that make it possible to move forward without constantly depending on motivation.\n\nIt reminds us that real transformation happens when what used to take effort starts becoming part of our identity.",
  pregunta: "Do your habits hold up the person you want to become?",
  une: [
    "Perseverance lets us move forward, but it's habits that settle that progress. Many people have the will to change, yet without building a daily structure they end up going back to their old patterns.",
    "This path teaches us that growth doesn't depend on extraordinary efforts, but on repeating small coherent actions until they become a natural way of living.",
  ],
  testTitulo: "How do you turn perseverance into habits?",
  test: [
    "I find it hard to keep habits going for a long time.",
    "I depend on motivation to do what I consider important.",
    "I haven't built routines that support my goals and my values.",
    "When I break a habit, I find it hard to pick it up again.",
    "My small daily actions look little like the person I want to become.",
  ],
  interpretaciones: bandas(
    "You've managed to turn perseverance into consistent habits. Your routines hold your values and make your growth easier.",
    "There's steadiness, but it still depends too much on motivation or circumstances. Settling small habits will strengthen your stability.",
    "You tend to trust one-off effort more than building habits. Your growth is to develop a structure that holds your goals.",
    "One of your main challenges is discovering that discipline isn't born from constant sacrifice, but from building habits that make it easier to live by your values.",
  ),
  senales: [
    "You wait to feel motivated before acting.",
    "Your habits really reflect your priorities.",
    "You pick a routine back up after breaking it, instead of dropping it altogether.",
  ],
  umbral: "Your habits stop depending on motivation and start becoming a natural expression of who you are.",
  integracion: "I'm not what I do now and then; I become what I practice every day.",
};

const QOF: SenderoTexto = {
  palabraClave: "Manifestation",
  titulo: "From Perseverance to Manifestation",
  significadoTradicional:
    "Qof (ק) means \"nape\", \"the back of the head\" or what stays hidden from view. In the kabbalistic tradition it stands for the step between the inner and the outer, reminding us that every visible transformation is born first from an inner process.\n\nBy connecting Netzach with Malkhut, this path is the step from perseverance toward manifestation. It teaches that steadiness ends up leaving a visible mark, and that every reality we build begins long before it can be seen.",
  traduccionPsicologica:
    "This path is the ability to turn sustained effort into real results. We often expect immediate change and forget that the deepest transformations are the fruit of small actions repeated over a long time.\n\nIt reminds us that manifestation doesn't happen by chance; it's the natural consequence of a perseverance held with intention.",
  pregunta: "Do you trust the process, or only value results once they're visible?",
  une: [
    "Perseverance can look invisible for a long time. Yet every small effort builds a reality that will end up showing itself, even if we can't see it right away.",
    "This path teaches us to value the process as much as the result. What looks like a small step today can become, over time, the change that transforms your whole Life.",
  ],
  testTitulo: "How do you turn perseverance into results?",
  test: [
    "I drop a project when I don't see results quickly.",
    "I find it hard to trust processes whose benefits take time to appear.",
    "When progress is slow, I stop moving forward.",
    "I need visible results to keep my commitment.",
    "I expect big transformations to arrive without time or steadiness.",
  ],
  interpretaciones: bandas(
    "You understand that results are a consequence of the process. Your perseverance doesn't depend only on immediate rewards.",
    "Sometimes the lack of visible results lowers your motivation. Learning to trust the process will strengthen your ability to build lasting change.",
    "There's a tendency to measure success only by what's already visible. Your growth is to recognize the value of the small steps that don't yet show their full potential.",
    "One of your main challenges is understanding that reality is built before it shows itself. Perseverance produces results, even if they stay hidden for a while.",
  ),
  senales: [
    "You drop a process only because the results are slow to arrive.",
    "You recognize the small steps you're managing to take.",
    "You trust the value of steadiness even when no one else sees your progress.",
  ],
  umbral: "You stop working only for the results and learn to trust the transforming value of the process.",
  integracion: "Everything I build in silence today will be the reality I get to look at tomorrow.",
};

const RESH: SenderoTexto = {
  palabraClave: "Coherence",
  titulo: "From Expression to Coherence",
  significadoTradicional:
    "Resh (ר) means \"head\". In the kabbalistic tradition it stands for consciousness, direction and the ability to orient your own Life. It represents the moment when ideas stop being isolated thoughts and organize themselves into a structure that makes sense.\n\nBy connecting Hod with Yesod, this path is the step from expression toward settling a firm base. It teaches that communicating our ideas isn't enough; they have to become a consistent way of living.",
  traduccionPsicologica:
    "This path is the ability to turn what we express into coherent habits and behavior. Talking about our values, projects or learning has little impact if our everyday Life doesn't reflect them.\n\nIt reminds us that credibility is born when there's coherence between our words and our actions.",
  pregunta: "Does the way you live confirm what you say you believe?",
  une: [
    "Expressing an idea can inspire, but only actions turn it into reality. We often talk about the changes we want to make without ever bringing them into our daily Life.",
    "This path teaches us that coherence begins when we stop defining ourselves by what we say and start defining ourselves by what we practice steadily.",
  ],
  testTitulo: "How do you turn your words into a way of living?",
  test: [
    "I often say something matters to me and then act differently.",
    "I find it easier to talk about my goals than to work on them.",
    "My actions don't reflect what I tell others.",
    "I promise changes I then find hard to keep.",
    "I notice a distance between what I think, what I say and what I do.",
  ],
  interpretaciones: bandas(
    "There's a good coherence between your words and your actions. What you communicate shows up naturally in the way you choose to live.",
    "Sometimes your intentions and your actions don't move at the same pace. Strengthening small daily commitments will increase your coherence.",
    "There's a significant difference between what you express and the way you act. Your growth is to turn your words into concrete habits.",
    "One of your main challenges is discovering that real transformation doesn't happen when you talk about change, but when you start living it steadily.",
  ),
  senales: [
    "Your actions back up what you say is important.",
    "You make promises you then don't keep, especially to yourself.",
    "You make small daily decisions aligned with the values you express.",
  ],
  umbral: "Your actions speak as clearly as your words, and both reflect the person you've chosen to be.",
  integracion: "Coherence begins when my Life naturally expresses what my words announce.",
};

const SHIN: SenderoTexto = {
  palabraClave: "Transformation",
  titulo: "From Expression to Manifestation",
  significadoTradicional:
    "Shin (ש) means \"tooth\" and is linked to transforming fire. In the kabbalistic tradition it stands for the energy that purifies, transforms and drives change. It doesn't destroy for the sake of destroying; it turns the potential into a new reality.\n\nBy connecting Hod with Malkhut, this path is the step from conscious expression toward manifestation in the world. It teaches that what we cultivate inside ends up showing in our outer reality.",
  traduccionPsicologica:
    "This path is the ability to turn a coherent Life into visible results. When our thoughts, emotions, habits and actions are aligned, reality starts reflecting that transformation.\n\nIt reminds us that authentic change isn't about appearing to be someone different, but about letting our Life naturally express who we already are.",
  pregunta: "Does the Life you've built really reflect the person you're becoming?",
  une: [
    "Every transformation begins inside, but it comes into its own when it becomes visible in our decisions, our relationships and the way we live. Good habits aren't enough if they don't end up creating a coherent reality.",
    "This path teaches us that manifestation isn't a matter of luck, but the consequence of an identity built with steadiness. Our outer reality ends up being the reflection of what we repeat each day.",
  ],
  testTitulo: "How do you turn your coherence into a visible reality?",
  test: [
    "I feel the Life I lead doesn't reflect the person I want to be.",
    "My habits and decisions don't always produce the results I want.",
    "I don't see the link between my daily actions and the results I get.",
    "I expect my Life to change without steadily changing my behavior.",
    "I feel my reality looks less and less like my values and my decisions.",
  ],
  interpretaciones: bandas(
    "There's a strong coherence between who you are and the reality you're building. Your actions produce results aligned with your values.",
    "You've started a process of transformation, though there are still areas where your results don't fully reflect your effort.",
    "There's a gap between the person you want to be and the reality you're building. Your growth is to look at which habits need strengthening.",
    "One of your main challenges is understanding that reality changes when the way we live each day changes. Manifestation begins long before the results appear.",
  ),
  senales: [
    "Your daily decisions build the Life you really want.",
    "You expect different results without changing your habits.",
    "You recognize how your small actions are shaping your reality.",
  ],
  umbral: "The Life you've built becomes a natural reflection of your values, your habits and the person you've chosen to be.",
  integracion: "The reality I live today is the reflection of the decisions I chose to hold each day.",
};

const TAV: SenderoTexto = {
  palabraClave: "Manifestation",
  titulo: "From Understanding to Manifestation",
  significadoTradicional:
    "Tav (ת) is the last letter of the Hebrew alphabet and means \"mark\", \"seal\" or \"signature\". In the kabbalistic tradition it stands for the culmination of a process, the materializing of what's been learned and the mark we leave in the world. It represents the moment when a truth stops being a possibility and becomes a reality.\n\nBy connecting Yesod with Malkhut, this path is the step from inner foundations toward concrete manifestation. It teaches that knowledge only reaches its purpose when it translates into actions that transform reality.",
  traduccionPsicologica:
    "This path is the ability to turn our ideas, learning and values into a visible way of living. Understanding who we want to be isn't enough; real growth happens when our decisions leave a coherent mark on our Life and on the world around us.\n\nIt reminds us that every action is a signature that reveals our values, far more than our words or our intentions.",
  pregunta: "Does the mark you leave really reflect what you say you value?",
  une: [
    "Understanding a truth has little impact if it never shows up in our decisions. Many people collect knowledge for years, yet their Life barely changes because that knowledge never becomes action.",
    "This path is the culmination of the journey. It invites us to stop measuring our growth by what we know and start measuring it by the mark we leave in the world through our actions.",
  ],
  testTitulo: "How do you turn your learning into a reality?",
  test: [
    "I often know what I should do, but I don't put it into practice.",
    "My actions don't always reflect the values I consider important.",
    "My daily decisions drift away from what I've learned.",
    "I find it easier to learn than to change my behavior.",
    "I feel the way I live reflects less and less who I am.",
  ],
  interpretaciones: bandas(
    "You've managed to integrate what you've learned into your everyday Life. Your actions naturally reflect your values and leave a coherent mark.",
    "You understand the road you want to follow, though there are still areas where your actions don't fully reflect that understanding.",
    "There's a distance between what you know and the way you live. Your growth is to turn knowledge into concrete, sustained decisions.",
    "One of your main challenges is discovering that real learning doesn't end when you understand an idea, but when that idea transforms the way you live and the mark you leave in the world.",
  ),
  senales: [
    "Your decisions really reflect what you've learned.",
    "You act according to your values even when no one is watching.",
    "The mark you leave in your relationships and projects matches the person you want to be.",
  ],
  umbral: "Your Life becomes the natural expression of everything you've learned along the road.",
  integracion: "My greatest learning isn't what I know, but the mark I leave with the way I choose to live.",
};

export const CABALA_SENDEROS_EN: Record<number, SenderoTexto> = {
  11: ALEPH,
  12: BETH,
  13: GIMEL,
  14: DALETH,
  15: HE,
  16: VAV,
  17: ZAYIN,
  18: CHET,
  19: TET,
  20: YOD,
  21: KAF,
  22: LAMED,
  23: MEM,
  24: NUN,
  25: SAMEKH,
  26: AYIN,
  27: PE,
  28: TSADI,
  29: QOF,
  30: RESH,
  31: SHIN,
  32: TAV,
};
