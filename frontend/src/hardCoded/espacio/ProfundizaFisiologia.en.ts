import type { Ficha } from "./ProfundizaFisiologia";

/**
 * Los temas de PROFUNDIZA, en INGLÉS.
 *
 * Aquí va SOLO el texto, emparejado por la `key` del tema y la `key` de cada
 * ficha. El orden, el `color`, la `foto` y la `zona` viven únicamente en el
 * fichero español: si se duplicaran, bastaría mover una ficha de zona en un
 * idioma y no en el otro para que la página se pintara distinta según el idioma.
 *
 * Lo que falte aquí se muestra en español, ficha por ficha (ver
 * `useTemaProfundiza`). Por eso se puede ir traduciendo tema a tema sin que
 * nada se rompa por el camino.
 */
export type FichaTexto = Pick<Ficha, "nombre" | "eyebrow" | "claves" | "explicacion">;

export type TemaTexto = {
  label?: string;
  resumen?: string;
  intro?: string;
  pista?: string;
  cierre?: string;
  /** Título y entradilla de cada zona, por su clave de zona. */
  zonas?: Record<string, { titulo: string; entradilla: string }>;
  /** Texto de cada ficha, por su clave. */
  fichas?: Record<string, FichaTexto>;
};

export const temasProfundizaEn: Record<string, TemaTexto> = {
  cerebro: {
    label: "The brain",
    resumen: "Three pounds that decide who you are.",
    intro:
      "Three pounds that decide who you are. You go through it from the outside in: first the cortex, then the limbic system and finally the reptilian brain.",
    cierre:
      "Three pounds of tissue that knows itself. That's the only thing standing between you and the world.",
    zonas: {
      corteza: {
        titulo: "The cortex",
        entradilla: "Thinking, reasoning, narrative, language and decisions.",
      },
      centro: {
        titulo: "The limbic system",
        entradilla: "Emotion, memory (conscious and unconscious) and perception.",
      },
      base: {
        titulo: "The reptilian brain",
        entradilla: "Automatic functions and survival.",
      },
    },
    fichas: {
      corteza: {
        nombre: "Cerebral cortex",
        eyebrow: "The small space where the conscious appears",
        claves: [
          "The outer layer, wrinkled",
          "Some 16 billion neurons",
          "Only a small part of what happens reaches awareness",
        ],
        explicacion: [
          "It's the outer layer of the brain, only a few millimeters thick, and it's covered in folds. They aren't decoration: they're what fits an enormous surface inside a small skull. Spread flat, it would take up roughly the same as a large napkin.",
          "Signals from all over the brain come together here, and many of the things we experience consciously are built here: what we see, hear, think, remember or feel.",
          "But most of what the brain does never reaches awareness. It processes information constantly without you noticing: it regulates the body, recognizes patterns, prepares movements, filters stimuli and makes decisions.",
          "And even when something does reach awareness, chances are you won't be aware of it either. Attention picks out a small part and the rest stays outside. Even what we call “conscious thought” is full of noise: memories, emotions, associations and impulses that surface along with the circumstances.",
          "Awareness, in other words, is not everything your brain does.",
        ],
      },
      frontal: {
        nombre: "Frontal lobe",
        eyebrow: "Planning, deciding, holding back",
        claves: ["Plans and makes decisions", "Holds back impulses", "Controls voluntary movement"],
        explicacion: [
          "It sits just behind your forehead and takes part in planning, deciding, holding attention and holding back impulses: it's one of the parts that lets you think “I want to, but better not.”",
          "At its front is the prefrontal cortex, which finishes maturing later than other regions, at around twenty-five.",
          "That's why adolescence is so intense: the system that drives you and goes after rewards runs ahead of the one that helps rein it in.",
          "At its back is the motor cortex, which sends out the orders for voluntary movement.",
        ],
      },
      parietal: {
        nombre: "Parietal lobe",
        eyebrow: "The map of your body",
        claves: ["Receives touch and pain", "Knows where your body is", "Orients you in space"],
        explicacion: [
          "It receives information from the skin: touch, pressure, temperature and pain. It puts it together and turns it into a sensation that makes sense.",
          "It also builds the map of your body. It lets you know where your hand is even with your eyes closed, and work out where a glass is before you reach for it.",
          "It helps you orient yourself in space: where you are, where things are and how to get to them.",
        ],
      },
      temporal: {
        nombre: "Temporal lobe",
        eyebrow: "Hearing, recognizing, remembering",
        claves: ["Hears and understands language", "Recognizes faces and voices", "Takes part in memory"],
        explicacion: [
          "It sits on the sides of the brain, level with your ears. It processes sounds and gives them meaning: you don't just hear sounds, you understand a sentence or recognize a song.",
          "It also takes part in recognizing faces and voices, and in storing knowledge and memories.",
          "Inside, it connects with the hippocampus and the amygdala. That's why a smell, a voice or a song can bring up a memory loaded with emotion.",
        ],
      },
      occipital: {
        nombre: "Occipital lobe",
        eyebrow: "Where what you see is built",
        claves: ["Processes visual information", "It's at the back of your head", "Builds the image you see"],
        explicacion: [
          "It's at the back of the brain, at the nape. The eyes catch the light, but this is where the brain starts building what we see.",
          "It processes things like color, edges and movement separately, and then puts them together into a scene.",
          "Which is why your eyes can be perfectly healthy and you can still lose part of your vision if this area is damaged.",
        ],
      },
      "cuerpo-calloso": {
        nombre: "Corpus callosum",
        eyebrow: "The bridge between the two brains",
        claves: ["Joins the two hemispheres", "Millions of nerve fibers", "Makes them share information"],
        explicacion: [
          "It's an enormous bridge of nerve fibers connecting the left hemisphere to the right.",
          "Thanks to it, the two sides exchange information constantly and can work together.",
          "That's why the idea that we're “left-brained” or “right-brained” is misleading. The brain works precisely because its two sides are connected.",
        ],
      },
      talamo: {
        nombre: "Thalamus",
        eyebrow: "The switchboard of the senses",
        claves: [
          "Receives almost all sensory information",
          "Filters it before it reaches the cortex",
          "Smell is the great exception",
        ],
        explicacion: [
          "It sits at the center of the brain and receives almost all the information arriving from the senses before sending it up to the cortex.",
          "It doesn't just pass it on: it filters it too. You can't pay attention to everything happening in your body and around you at the same time.",
          "That's why right now you probably aren't noticing your clothes against your skin, even though the information is reaching your brain.",
          "Smell is different: its first connections don't pass through the thalamus, which helps explain why smells can feel so direct and so emotional.",
        ],
      },
      hipotalamo: {
        nombre: "Hypothalamus",
        eyebrow: "The one that keeps the body in balance",
        claves: ["Hunger, thirst, sleep and temperature", "Controls many hormones", "It's tiny"],
        explicacion: [
          "It's very small, but it controls the basics: hunger, thirst, temperature, sleep and sexual response.",
          "It also connects the nervous system with the hormonal one. It does that mainly through the pituitary gland, which it signals in order to control other glands.",
          "That's why something that looks “mental” can end up reaching the body: stress can change your appetite, your sleep or even your menstrual cycle.",
        ],
      },
      hipofisis: {
        nombre: "Pituitary gland",
        eyebrow: "Hormonal command center",
        claves: ["Controls other glands", "It depends on the hypothalamus", "Weighs about half a gram"],
        explicacion: [
          "It's a tiny gland, the size of a pea, sitting just below the hypothalamus.",
          "It releases hormones that control other glands and functions: thyroid, adrenals, ovaries, testes and growth.",
          "For years it was called “the master gland.” But it doesn't rule alone: the hypothalamus, right above it, directs a good part of what it does.",
        ],
      },
      amigdala: {
        nombre: "Amygdala",
        eyebrow: "The emotional alarm",
        claves: [
          "Detects possible threats",
          "It can react before you understand",
          "Gives memories their emotional weight",
        ],
        explicacion: [
          "The amygdala helps detect threats and gets the body ready to react. It can do it very fast, before you've understood what's going on.",
          "That's why you can jump at a noise and only afterward find out it was a door.",
          "It also gives emotional weight to what we live through. Whatever happens with a lot of fear, joy or surprise tends to stick better.",
          "When the alarm system is too switched on, it can go off even at things that aren't really dangerous.",
        ],
      },
      hipocampo: {
        nombre: "Hippocampus",
        eyebrow: "The one that turns experience into memory",
        claves: ["Forms new memories", "Helps you find your way", "It's sensitive to stress"],
        explicacion: [
          "It's shaped like a seahorse, which is where its name comes from. It's essential for forming new memories and for remembering where and when things happened.",
          "It also takes part in spatial memory: it helps build the map of the places we know.",
          "It's one of the few areas of the adult brain where neurogenesis has been observed. It's also especially sensitive to prolonged stress.",
        ],
      },
      "ganglios-basales": {
        nombre: "Basal ganglia",
        eyebrow: "The autopilot",
        claves: ["Automate movements and habits", "Make what you repeat easier", "They run on dopamine"],
        explicacion: [
          "They're groups of deep nuclei that help turn repeated actions into habits.",
          "Learning to drive takes a lot of attention. After hundreds of hours, many of the movements come out almost by themselves. The basal ganglia are part of what makes that shift possible.",
          "They also take part in motivation and in reward learning, and dopamine is one of their main signals.",
        ],
      },
      cerebelo: {
        nombre: "Cerebellum",
        eyebrow: "The one that fine-tunes your movements",
        claves: [
          "Balance and precision",
          "More than half the brain's neurons",
          "Corrects movement as it happens",
        ],
        explicacion: [
          "It sits low and at the back of the brain. It's small, but it holds more than half of its neurons.",
          "It doesn't decide which movement you want to make: it fine-tunes it. It compares what you're trying to do with what's actually happening and corrects the movement as you go.",
          "Thanks to it you can keep your balance, pick up a glass without knocking it over or write precisely.",
          "It also takes part in learning movements and in other functions, such as language.",
        ],
      },
      tronco: {
        nombre: "Brainstem",
        eyebrow: "What keeps the body running",
        claves: [
          "Controls automatic vital functions",
          "Regulates how alert you are",
          "Joins the brain to the spinal cord",
        ],
        explicacion: [
          "It's the part connecting the brain to the spinal cord. It controls the functions you can't stop doing: breathing, keeping your heart beating, regulating blood pressure, swallowing and coughing.",
          "It also takes part in how alert you are and in the sleep-wake cycle.",
          "The signals coming up from the body and the orders going down from the brain all pass through it. Some of those pathways cross over here, which is why each hemisphere mainly controls the opposite side of the body.",
        ],
      },
    },
  },

  // ── Músculos ──────────────────────────────────────────────────────────────
  // El tema va de fuera hacia dentro, como una muñeca rusa: músculo → sarcómero
  // → las dos proteínas que se deslizan → la instalación del calcio → el muelle.
  // La miostatina va al final: ya no es el mecanismo, es el freno.
  //
  // Al traducir:
  //  · Los nombres de las piezas son los de siempre en anatomía: sarcomere,
  //    myofibril, fascicle, Z line, actin, myosin, tropomyosin, troponin,
  //    T-tubules, sarcoplasmic reticulum, titin, myostatin.
  //  · El español dice «El músculo», «El sarcómero» con artículo; en inglés los
  //    títulos de ficha van igual («The muscle», «The sarcomere») para que la
  //    tarjeta se lea como en español.
  musculo: {
    label: "Muscles",
    resumen: "How they contract and what holds them back.",
    cierre:
      "Moving a finger is this: an electrical order running down a set of tunnels, a calcium store swinging open, a bolt sliding back and billions of heads rowing at once. And you do it without thinking about it.",
    fichas: {
      musculo: {
        nombre: "The muscle",
        eyebrow: "From flesh to molecule",
        claves: ["A bundle of fibers", "Each fiber is ONE cell", "Inside, filaments lined up"],
        explicacion: [
          "A muscle is made of muscle fibers gathered into bundles called fascicles. The fibers lie in parallel, like the threads of a rope.",
          "Each fiber is ONE cell. It can be several centimeters long, hold hundreds of nuclei and be packed with mitochondria, because moving takes a lot of energy.",
          "Inside each fiber there are hundreds of myofibrils. And each myofibril is made of millions of sarcomeres lined up one after another. The sarcomeres are the pieces that actually shorten, and they're what produces the stripes we see under the microscope.",
          "Strength shows up when billions of fibers work together. The more fibers a muscle can bring in, the more force it can produce.",
        ],
      },
      sarcomero: {
        nombre: "The sarcomere",
        eyebrow: "The piece that shortens",
        claves: ["The smallest unit of muscle", "It runs from Z line to Z line", "It slides, it doesn't shrink"],
        explicacion: [
          "The sarcomere is the basic unit of muscle. It runs from one Z line to the next. A single fiber can hold millions of them lined up.",
          "Inside there are two kinds of filament: actin and myosin. Actin is anchored to the Z lines and myosin takes up the center.",
          "When the muscle contracts, the filaments don't shorten. They slide over one another and the Z lines come closer together. That's why the sarcomere ends up shorter.",
          "Millions of sarcomeres shortening at the same time produce muscle contraction.",
          "A muscle doesn't have the same strength in every position either. Stretched too far, actin and myosin barely touch. Shortened too much, they get in each other's way. There's a length in between where they can produce the most force.",
        ],
      },
      actina: {
        nombre: "Actin",
        eyebrow: "The thin filament (and its bolt)",
        claves: [
          "Two braided rows of beads",
          "Tropomyosin covers the binding sites",
          "Troponin waits for calcium",
        ],
        explicacion: [
          "Actin is the thin filament. It's made of two rows of molecules coiled around each other, and it's anchored to the Z line.",
          "Myosin needs to grab hold of actin in order to pull. But at rest it can't, because tropomyosin is covering the binding sites.",
          "Troponin is attached to tropomyosin and it's the one that detects calcium. When calcium arrives, troponin changes shape and moves tropomyosin out of the way.",
          "The binding sites are left free and myosin can grab hold of actin.",
          "So a muscle at rest isn't “switched off”: it's locked. Calcium is the key that opens the system.",
          "And actin doesn't only exist in muscle. It's also part of the internal skeleton of almost every cell we have.",
        ],
      },
      miosina: {
        nombre: "Myosin",
        eyebrow: "The motor that rows",
        claves: ["Two heads that pull", "Each pull uses ATP", "Letting go needs ATP too"],
        explicacion: [
          "Myosin is the muscle's motor. It has a tail and two heads. Hundreds of molecules pack together to form the thick filament.",
          "The heads grab hold of actin, pull it a few nanometers, let go and grab hold again a little further along. They repeat the movement over and over, like rowers.",
          "They don't all pull at once: while some are pulling, others are letting go. That's what makes the force continuous.",
          "Each cycle lasts milliseconds and uses up ATP. ATP is also needed to let go. Without ATP, myosin stays stuck to actin and the muscle turns rigid: that's part of what happens in rigor mortis.",
          "There are different kinds of myosin, faster and slower. That's part of why there are fast and slow muscle fibers.",
        ],
      },
      tubulos: {
        nombre: "T-tubules and calcium",
        eyebrow: "From the order to the movement",
        claves: [
          "The signal reaches the center",
          "The reticulum stores the calcium",
          "Putting it back uses ATP",
        ],
        explicacion: [
          "A neuron gives the order and releases acetylcholine onto the muscle. That sets off an electrical signal that travels along the fiber's membrane.",
          "But the fiber is thick. The signal needs to reach the center too. That's what the T-tubules are for: folds of the membrane that carry the signal inward.",
          "Waiting in there is the sarcoplasmic reticulum, which stores calcium.",
          "When the electrical signal arrives, the reticulum releases calcium. The calcium binds to troponin, moves tropomyosin and leaves actin free. Then myosin can start pulling.",
          "To relax, the muscle has to clear the calcium away. Pumps carry it back into the reticulum, and they spend ATP doing it.",
          "So contracting and relaxing are both active: each one needs energy.",
        ],
      },
      titina: {
        nombre: "Titin",
        eyebrow: "The spring that puts it back",
        claves: [
          "One of the largest proteins in the body",
          "A molecular spring",
          "It gives energy back on release",
        ],
        explicacion: [
          "Titin is an enormous protein running from the Z line to the center of the sarcomere. It helps keep myosin where it belongs.",
          "It also works as a spring. When the sarcomere is stretched, titin stretches with it and stores part of that energy. When the stretch stops, it helps bring it back into position.",
          "It also pushes back against the stretch, and it's part of the tension you feel when you stretch a muscle.",
          "Titin has around 30,000 amino acids, which makes it one of the largest proteins in the human body.",
          "And it isn't only a spring: it also works as a tension sensor. When it stretches, it can set off signals that help the muscle adapt.",
        ],
      },
      miostatina: {
        nombre: "Myostatin",
        eyebrow: "The muscle's brake",
        claves: [
          "It limits how much muscle you can build",
          "The muscle itself produces it",
          "It puts a brake on growth",
        ],
        explicacion: [
          "Myostatin is a protein the muscle itself produces, and it works as a brake on growth.",
          "It binds to receptors and switches on signals that cut down the making of new muscle protein. It also acts on the satellite cells, the ones that help repair and adapt the fibers.",
          "When there's little myostatin, or it doesn't work properly, muscle can grow far beyond what's normal. It happens in some animals, such as Belgian Blue cattle, and in very rare cases in people.",
          "That's why myostatin is being studied as a possible treatment for diseases that eat away at muscle.",
          "The catch is that more muscle doesn't necessarily mean more strength.",
          "You can carry a large volume of muscle fiber and still have little relative strength. That happens when the muscle is big, but the nervous system doesn't activate those fibers efficiently.",
        ],
      },
    },
  },

  // ── Neurotransmisores ─────────────────────────────────────────────────────
  // «Cuándo la notas» abre casi todas las fichas: es la parte que baja la
  // molécula a la experiencia de quien lee. En inglés se mantiene igual de
  // concreta («When you notice it:»), nunca «One may experience…».
  neurotransmisores: {
    label: "Neurotransmitters",
    resumen: "Your brain's messengers.",
    intro: "Small molecules that carry a message from one neuron to the next.",
    fichas: {
      dopamina: {
        nombre: "Dopamine",
        eyebrow: "Motivation and reward",
        claves: ["The “I want” neurotransmitter", "It motivates, it doesn't give pleasure", "The spark of wanting, and reward"],
        explicacion: [
          "It's the “I want that” neurotransmitter. It isn't the one for pleasure, it's the one that pushes you to go get it.",
          "It drives motivation, desire, reward learning and that feeling of anticipation when you're chasing something that matters to you.",
          "When you notice it: that spark of eagerness when you start a project, the rush of picturing yourself reaching a goal, or the pull you feel when you check your phone notifications.",
        ],
      },
      serotonina: {
        nombre: "Serotonin",
        eyebrow: "Mood and calm",
        claves: ["It's mostly born in the gut", "Regulates mood and calm", "Also sleep and appetite"],
        explicacion: [
          "A large part of the body's serotonin is produced in the gut by the intestinal cells, influenced by the microbiota and by the food we eat. In the brain it regulates mood, calm and the sense of well-being. It also takes part in sleep, appetite and digestion.",
          "When you notice it: that quiet peace after a morning walk, feeling at ease with yourself, sleeping well, or how you feel after eating well.",
        ],
      },
      gaba: {
        nombre: "GABA",
        eyebrow: "The brake",
        claves: ["The brain's brake", "It calms neural activity", "Too little: anxiety and tension"],
        explicacion: [
          "When you're very stressed, some neurons release GABA — the brain's main brake — to keep things from overflowing. It lowers the activity of other neurons so that everything doesn't fire at once.",
          "When you notice it: when you finally relax, drop your revs and your mind stops racing. Low GABA tends to go with anxiety, tension or trouble switching off.",
          "A curious detail: it works by opening channels that let chloride into the neuron, making it much harder for it to fire again.",
        ],
      },
      glutamato: {
        nombre: "Glutamate",
        eyebrow: "The accelerator",
        claves: ["The brain's accelerator", "Key for learning and remembering", "It balances out with GABA"],
        explicacion: [
          "The opposite of GABA: it's the brain's main excitatory neurotransmitter. It switches neurons on and it's key for learning, memory and brain plasticity.",
          "When you notice it: when you're awake, alert and learning something new. The balance between glutamate (accelerator) and GABA (brake) keeps your brain in tune.",
        ],
      },
      acetilcolina: {
        nombre: "Acetylcholine",
        eyebrow: "Muscle and memory",
        claves: ["It orders the muscles to move", "Two receptors: nicotinic and muscarinic", "Key for attention and memory"],
        explicacion: [
          "It joins the brain to the muscles: every time you move a finger, it's acetylcholine that carries the order from the neuron to the muscle and triggers the release of the calcium the fiber needs in order to contract. It's also essential for attention, learning and memory.",
          "One molecule, two different locks: what happens isn't decided by acetylcholine, it's decided by the receptor it fits into. And there are two families, named after the substances that imitate them: nicotine from tobacco and muscarine from the Amanita muscaria mushroom.",
          "Nicotinic receptors: they're channels. When acetylcholine fits in, the receptor swings open like a door and sodium comes in, so the cell fires within milliseconds. They're the ones at the neuromuscular junction (which is why voluntary movement is instant), and they're also spread through the brain, where they take part in attention and in the reward circuit. They're the ones nicotine occupies, passing itself off as acetylcholine.",
          "Muscarinic receptors: they aren't channels but G protein-coupled receptors. When acetylcholine fits in, nothing opens: a cascade of messengers starts up inside the cell. It's slower (tenths of a second) but longer-lasting, and instead of giving a sharp order it sets the background tone of the organ. They're the ones of the parasympathetic system (they slow the heart, start digestion, contract the pupil, switch the glands on) and the ones in the brain involved in memory and learning.",
          "Why the difference matters: almost everything that touches acetylcholine is selective for one of the two families. The muscle relaxants used in the operating room block the nicotinic ones and leave the muscle without its order; atropine blocks the muscarinic ones, which is why it dilates the pupil and speeds up the heart. In Alzheimer's, where cholinergic neurons are lost, the drugs don't add acetylcholine: they slow down the enzyme that destroys it (acetylcholinesterase) so the little that's left lasts longer in the synapse.",
          "When you notice it: in every voluntary movement, and when you're focused and your mind is sharp.",
        ],
      },
      noradrenalina: {
        nombre: "Noradrenaline",
        eyebrow: "Alertness and focus",
        claves: ["It puts you on alert", "It raises attention and energy", "Adrenaline's cousin"],
        explicacion: [
          "It puts you in alert mode: it raises attention, energy and your ability to react to stress. It's adrenaline's cousin, but it acts mainly as a neurotransmitter inside the brain.",
          "When you notice it: facing a scare or a challenge, when your heart speeds up and suddenly you see everything sharper and more focused.",
        ],
      },
      endorfinas: {
        nombre: "Endorphins",
        eyebrow: "Relief and euphoria",
        claves: ["The body's natural painkillers", "Relief and well-being", "They rise with exercise and laughter"],
        explicacion: [
          "They're the body's natural painkillers: they reduce pain and produce a feeling of relief and well-being. They're also released during intense exercise, laughter, physical contact and even in stressful situations, to help us bear them.",
          "When you notice them: the “runner's high” after exercise, a burst of laughter, or that warm well-being after a good effort.",
        ],
      },
      oxitocina: {
        nombre: "Oxytocin",
        eyebrow: "Bonding and trust",
        claves: ["The attachment hormone", "It strengthens trust and bonds", "Present in hugs and in birth"],
        explicacion: [
          "They call it “the attachment hormone.” It also acts as a brain messenger and strengthens trust, affection and the bonds with other people. It helps us feel safe and it encourages social relationships.",
          "When you notice it: in a long hug, stroking your pet or feeling close to someone you trust.",
          "A curious detail: it also takes part in regulating metabolism and it seems to improve insulin sensitivity. It's released in large amounts during birth and breastfeeding, strengthening the bond between mother and baby.",
        ],
      },
    },
  },

  // ── Hormonas ──────────────────────────────────────────────────────────────
  // Cada ficha sigue el mismo guion: qué hace → «Cómo se fabrica» → «Su
  // receptor» → «Cuándo importa». Esos rótulos son los que dan ritmo al texto,
  // así que en inglés se repiten igual de literales: "How it's made:", "Its
  // receptor:", "When it matters:", "When you notice it:".
  //
  // Nomenclatura: adrenaline / noradrenaline (no epinephrine), coherente con
  // adrenal gland y adrenergic receptors, que sí se dicen así.
  hormonas: {
    label: "Hormones",
    resumen: "Messengers that travel through the blood.",
    intro: "Your organs talk to each other through hormones; that's why everything in your body is connected.",
    fichas: {
      insulina: {
        nombre: "Insulin",
        eyebrow: "Pancreas · lowers blood sugar",
        claves: ["It lowers blood sugar", "It gets glucose into the cells", "If it fails, type 2 diabetes"],
        explicacion: [
          "The pancreas makes it when blood glucose goes up, for example after eating. It's the key that opens the cells so glucose can get in and be used as energy or stored.",
          "How it's made: in the beta cells of the pancreatic islets. First a long and still useless version is built, proinsulin, and then a piece of the middle is trimmed off, the C-peptide. What's left is two chains stitched together by sulfur bridges: insulin. It's kept packed in granules along with zinc, ready to leave as soon as glucose enters the beta cell. The trimmed-off piece goes into the blood in the same amount, and that's why C-peptide is measured in a blood test to find out whether a pancreas is still making insulin of its own.",
          "Its receptor: the insulin receptor, anchored in the membrane of almost all your cells and very abundant in muscle, fat and liver. When insulin lands on it, the receptor switches on from the inside and sets off a cascade of signals whose most visible effect is bringing the glucose transporters (GLUT4) up to the surface — the doors glucose actually goes through. Without that order, the doors stay tucked away inside the cell.",
          "When it matters: if the cells stop responding to it properly (insulin resistance), glucose stays in the blood and, with time, type 2 diabetes appears. And usually it isn't that insulin is missing, it's that the message gets lost along the way, after the receptor.",
        ],
      },
      glucagon: {
        nombre: "Glucagon",
        eyebrow: "Pancreas · raises blood sugar",
        claves: ["It raises blood sugar", "The liver lets go of glucose", "Insulin's counterpart"],
        explicacion: [
          "It's insulin's counterpart. When glucose drops (fasting, exercise), the pancreas releases glucagon so the liver lets go of stored glucose and keeps the level in the blood steady.",
          "How it's made: in the alpha cells of those same pancreatic islets, next door to the ones making insulin. A large protein is built, proglucagon, and it's trimmed down to a small peptide of 29 pieces. The curious part is that the intestine makes that very same proglucagon, but cuts it in a different place, and out comes GLP-1, the satiety hormone behind the drugs used today for obesity. The same raw material, two different pairs of scissors and almost opposite effects.",
          "Its receptor: the glucagon receptor, in the membrane and above all on the cells of the liver. When it's switched on, a second messenger rises inside the cell, cyclic AMP, and it turns on the enzymes in charge of taking stored glycogen apart and making new glucose. It's the order to “open the pantry.”",
          "Together, insulin and glucagon keep your blood sugar within a narrow margin, raising it or lowering it as needed.",
        ],
      },
      cortisol: {
        nombre: "Cortisol",
        eyebrow: "Adrenal · stress",
        claves: ["The stress hormone", "Up in the morning, down at night", "Chronic, it wears the body down"],
        explicacion: [
          "The adrenal glands release it in the face of stress and also along a daily rhythm: it goes up in the morning to wake you and comes down at night. It mobilizes energy and puts you on alert.",
          "How it's made: from cholesterol, in the cortex of the adrenal glands and on orders from the pituitary, which sends a signal called ACTH. Cholesterol goes into the mitochondrion, becomes pregnenolone and from there, enzyme after enzyme, cortisol. Being a steroid hormone, it can't be stored ready-made: it's built the moment it's needed, and that's why it takes a few minutes to show up while adrenaline is already at work.",
          "Its receptor: the glucocorticoid receptor, which isn't in the membrane but inside the cell. Cortisol is fat-soluble, so it crosses the membrane without asking permission, binds to its receptor inside, and the pair goes into the nucleus, where it switches hundreds of genes on and off. That explains its character: it takes longer to be felt and it lasts far longer than adrenaline. Pharmacy corticosteroids, like prednisone, act on that same receptor, and that's why their effects look so much like sustained stress.",
          "When it matters: useful in short bursts, but keeping it high for months (chronic stress, sleeping badly) wears the body down, raises blood sugar and lowers your defenses.",
        ],
      },
      adrenalina: {
        nombre: "Adrenaline",
        eyebrow: "Adrenal · the immediate reaction",
        claves: ["The “fight or flight” hormone", "It speeds up the heart instantly", "It releases energy to react"],
        explicacion: [
          "It's the “fight or flight” hormone. Facing danger, in seconds it speeds up the heart, widens the pupils and releases energy to react.",
          "How it's made: in the medulla of the adrenal gland, its innermost part, out of an amino acid that comes from food, tyrosine. The chain is the same one as in the brain: tyrosine, then dopamine, then noradrenaline and finally adrenaline. The last step needs cortisol to work, and from that comes a lovely piece of design: the medulla that makes adrenaline is wrapped in the cortex that makes cortisol, bathed in it. Unlike cortisol, adrenaline is stored ready-made in vesicles, and that's why it can be out in a second as soon as the sympathetic nerve gives the order.",
          "Its receptors: the adrenergic receptors, spread all over the body in two families, alpha and beta. That's the trick behind one single molecule doing different things in each place: the beta-1 receptors of the heart make it beat harder and faster; the beta-2 ones in the bronchi and in the vessels of the muscle open them up, and that's why asthma inhalers imitate adrenaline; the alpha-1 ones close the vessels of the skin and the gut, which is the pallor of a fright. The drugs called beta-blockers cover the heart's beta-1 receptors so adrenaline can't speed it up.",
          "When you notice it: that lurch when you get a scare, or your heart pounding before speaking in public.",
        ],
      },
      tiroideas: {
        nombre: "Thyroid hormones",
        eyebrow: "Thyroid · the accelerator",
        claves: ["They set the body's speed", "Energy, temperature and pulse", "The accelerator of metabolism"],
        explicacion: [
          "The thyroid hormones (T3 and T4) set the speed at which your cells work: how much energy you spend, your temperature and the rhythm of your heart.",
          "How they're made: they're the only hormones that need a mineral from the diet, iodine, and the only ones stored outside the cell. The thyroid cells make an enormous protein, thyroglobulin, and pour it into sacs called follicles. There an enzyme hooks iodine onto that protein and joins the pieces two by two. When hormone is needed, the cell takes back a piece of thyroglobulin and trims it. The number in the name says how many iodine atoms it carries: four in T4, three in T3.",
          "The detail almost nobody tells you: of everything the gland releases, around 90% is T4… and T4 barely acts on its own. It's the reserve. The one that actually gives the order is T3, and it's the tissues themselves (above all the liver, the kidney and the muscle) that strip an iodine atom off T4 to make T3 exactly where and when they need it, with enzymes that require selenium. Seen that way, the thyroid doesn't send the final order: it sends the raw material, and each tissue decides how much active hormone gets made.",
          "Its receptor: it's inside the nucleus of the cell, waiting stuck to the DNA even before the hormone arrives. When T3 comes in and binds to it, that receptor switches on the genes that raise the pace of everything: more mitochondria, more energy burned, more heat, a stronger heart, a gut that moves more. T4 fits into it far worse, and that is exactly why it has to be converted first.",
          "The thermostat: the hypothalamus releases TRH, the pituitary answers with TSH and TSH asks the thyroid to produce; when there's enough hormone, the thyroid itself puts the brakes on the brain. That's why in a blood test TSH reads the other way round from what it looks like: high TSH usually means a slow thyroid, and low TSH, an accelerated one. And another practical detail: in the blood almost all the hormone travels stuck to carrier proteins, and like that it does nothing; only the free fraction counts, and that's why tests measure free T4 and not the total.",
          "When it matters: too much speeds everything up (jitteriness, weight loss, insomnia, fast pulse); too little slows everything down (tiredness, feeling cold, dry skin, constipation, mental slowness). And there's an in-between situation that's perfectly normal: in long fasts, very restrictive diets or during an illness, the body lowers T3 on purpose in order to spend less. It isn't that the thyroid has broken, it's the body going into saving mode.",
        ],
      },
      testosterona: {
        nombre: "Testosterone",
        eyebrow: "Gonads · strength and development",
        claves: ["Present in both sexes", "Muscle, bone and desire", "Mostly in the testicles"],
        explicacion: [
          "Present in both sexes, though higher in men. It takes part in muscle and bone development, sexual desire, energy and mood.",
          "It's produced mainly in the testicles and, in smaller amounts, in the ovaries and the adrenal glands.",
          "How it's made: also from cholesterol, in the Leydig cells of the testicle and on orders from the pituitary, which sends the LH signal. And it doesn't end there, because afterward it keeps transforming depending on the tissue: in the skin and in the hair follicle an enzyme turns it into DHT, a considerably more potent version, and in fat tissue another enzyme, aromatase, turns it into estradiol. Which means estrogen is made out of testosterone.",
          "Its receptor: the androgen receptor, inside the cell, the same type as cortisol's. The hormone crosses the membrane, binds to it, and the pair travels to the nucleus to switch genes on. DHT grabs that receptor far more tightly than testosterone, and that's why it's behind a good part of the effects on skin, beard and hair.",
        ],
      },
      estrogenos: {
        nombre: "Estrogens",
        eyebrow: "Gonads · the cycle and much more",
        claves: ["The main female sex hormones", "They regulate the cycle", "They protect bone and heart"],
        explicacion: [
          "The main female sex hormones. They regulate the menstrual cycle and fertility, but they also protect the bones, the heart and the brain.",
          "How they're made: in the ovary, and not from scratch. The ovary starts from androgens — that is, from testosterone — and an enzyme called aromatase turns them into estradiol, the main estrogen. The order comes from the pituitary with the FSH signal. That same aromatase is also in fat tissue, in bone and in the brain, and that's why, when the ovary switches off at menopause, body fat keeps making a small amount.",
          "Its receptors: there are two, alpha and beta, and they sit inside the nucleus of the cell. What's striking is where they turn up: besides the uterus and the breast, there are estrogen receptors in bone, in the blood vessels, in the brain, in the skin and in the liver. Their being in so many places is exactly why their fall at menopause isn't felt only in the cycle, but in the bones, sleep, memory, skin and cardiovascular risk.",
          "When it matters: their fall at menopause explains many changes, from the bones to your mood.",
        ],
      },
      progesterona: {
        nombre: "Progesterone",
        eyebrow: "Gonads · calm and pregnancy",
        claves: ["It prepares the uterus", "It sustains pregnancy", "It has a calming effect"],
        explicacion: [
          "It's the other great female sex hormone. It prepares the uterus for a possible pregnancy and sustains it if one happens; it rises in the second half of the menstrual cycle.",
          "It also has a calming effect on the brain. Its swings explain part of the changes in mood and sleep across the cycle.",
          "How it's made: it's produced by the corpus luteum, which is what's left of the follicle after ovulation, and if there's a pregnancy the placenta takes over. It's also the first step of every steroid: cholesterol becomes pregnenolone and pregnenolone becomes progesterone, and out of it come cortisol, testosterone and the estrogens. It is, literally, the mother of the rest.",
          "Its receptor: the progesterone receptor, in the nucleus, with an elegant detail: it's the estrogens that make the cell build it. That is, the first half of the cycle prepares the ground so the second half can work. And in the brain something separate happens: progesterone is turned into another molecule, allopregnanolone, which acts on the GABA receptor, the great brake of the nervous system and the same target anti-anxiety drugs act on. Hence its calming effect, and hence why its sharp fall in the days before your period is felt so much in mood and sleep.",
        ],
      },
      melatonina: {
        nombre: "Melatonin",
        eyebrow: "Pineal · sleep",
        claves: ["Darkness releases it", "The signal to sleep", "Screens hold it back"],
        explicacion: [
          "The pineal gland releases it when the light fades: it's the signal that night is coming and it's time to sleep. It syncs your internal clock with day and night.",
          "How it's made: in the pineal gland and out of the tryptophan from food, along a chain that may ring a bell: tryptophan, then serotonin and finally melatonin. Yes, melatonin is a reworked serotonin. The enzyme that takes the decisive step only works in the dark: the light coming in through the eye reaches the brain's central clock, and the clock orders it to stop. There's nothing magical about screens, they simply switch that enzyme off.",
          "Its receptors: they're called MT1 and MT2, they sit in the membrane and they're concentrated in the brain's central clock (the suprachiasmatic nucleus) and in the retina. MT1 lowers how alert you are and MT2 adjusts the time on that clock. This clears up a very common confusion: melatonin isn't a sleeping pill that knocks you out, it's a notice saying “it's night.” That's why it helps more with putting your schedule back in place, as in jet lag or night shifts, than with sleeping more deeply.",
          "When it matters: screen light at night holds back its production and makes it harder for you to fall asleep.",
        ],
      },
      crecimiento: {
        nombre: "Growth hormone",
        eyebrow: "Pituitary · repair and grow",
        claves: ["It's released in deep sleep", "It makes children grow", "It repairs you as an adult"],
        explicacion: [
          "The pituitary releases it above all during deep sleep and exercise. It drives growth in childhood and, in adults, the repair of tissue and muscle.",
          "How it's made: it's a protein, not a steroid, so the pituitary makes it and keeps it ready in granules, set to go. And it doesn't drip out steadily: it comes in pulses, pushed by a signal from the hypothalamus (GHRH) and held back by another one (somatostatin). The biggest pulse of the day happens in the first hours of deep sleep, and intense exercise and fasting also set it off.",
          "Its receptor: the GH receptor, in the membrane and very abundant in the liver. And here's the interesting part: a large part of its effect isn't its own doing. On switching that receptor on, the liver makes and releases another hormone, IGF-1, and it's IGF-1 that actually acts on the growth cartilage, the muscle and the bone. That's why, when you want to know how much growth hormone there is, IGF-1 is what's measured: GH comes out in pulses and a one-off test says almost nothing, while IGF-1 stays steady.",
          "When it matters: sleeping well is, literally, when you repair yourself most.",
        ],
      },
    },
  },

  // ── La menstruación ───────────────────────────────────────────────────────
  // Es el tema más técnico del bloque y el español lo escribe en registro de
  // manual (tercera persona, sin tuteo). Se respeta: aquí NO se fuerza el «you».
  // Los números del título («1.», «2.»…) se mantienen: ordenan la rejilla.
  menstruacion: {
    label: "Menstruation",
    resumen: "The cycle, phase by phase.",
    intro: "From the moment there's enough energy until the endometrium sheds: the hormonal journey of the menstrual cycle, step by step.",
    fichas: {
      leptina: {
        nombre: "1. Leptin: the axis switches on",
        eyebrow: "The starting point",
        claves: ["There are enough energy reserves", "Leptin tells the hypothalamus", "GnRH is released"],
        explicacion: [
          "When the body's energy reserves are sufficient, fat tissue produces adequate levels of leptin. This hormone informs the hypothalamus that the body has enough energy to start up reproductive function.",
          "As a result, the pulsed release of GnRH is switched on.",
        ],
      },
      hipofisis: {
        nombre: "2. Pituitary: FSH and LH",
        eyebrow: "The gonadotropins",
        claves: ["GnRH stimulates the pituitary", "It releases FSH and LH", "They travel through the blood to the ovary"],
        explicacion: [
          "GnRH stimulates the anterior pituitary to release the gonadotropins FSH and LH, hormones that will travel through the blood to the ovary to start follicular development.",
        ],
      },
      foliculo: {
        nombre: "3. The follicle matures",
        eyebrow: "In the ovary",
        claves: ["FSH makes the follicles grow", "One becomes dominant", "It produces more and more estrogen"],
        explicacion: [
          "FSH stimulates the growth of the ovarian follicles. One of them becomes the dominant follicle and starts producing increasing amounts of estrogen.",
        ],
      },
      ovulacion: {
        nombre: "4. Ovulation",
        eyebrow: "The LH surge",
        claves: ["A sharp rise in LH", "It breaks the dominant follicle open", "It releases the oocyte into the tube"],
        explicacion: [
          "The sharp rise in LH breaks the dominant follicle open and releases the oocyte into the fallopian tube, a process known as ovulation.",
        ],
      },
      "cuerpo-luteo": {
        nombre: "5. Corpus luteum and endometrium",
        eyebrow: "Preparing the ground",
        claves: ["The broken follicle becomes the corpus luteum", "It secretes progesterone", "It thickens the endometrium"],
        explicacion: [
          "After ovulation, the broken follicle turns into the corpus luteum, which secretes mainly progesterone.",
          "This hormone prepares the endometrium for a possible implantation, increasing its thickness, its blood supply and its secretory activity.",
        ],
      },
      menstruacion: {
        nombre: "6. Menstruation",
        eyebrow: "If there's no fertilization",
        claves: ["The corpus luteum breaks down", "Progesterone and estrogen fall", "The endometrium sheds"],
        explicacion: [
          "If fertilization doesn't happen, the corpus luteum breaks down and the production of progesterone and estrogen drops.",
          "As a result, the endometrium loses its hormonal support and sheds, and menstruation begins.",
        ],
      },
    },
  },

  // ── Metabolismo ───────────────────────────────────────────────────────────
  // La respiración celular, paso a paso. Nombres de siempre en bioquímica:
  // glycolysis, pyruvate, acetyl-CoA, Krebs cycle, electron transport chain,
  // ATP synthase. Los números del título ordenan la rejilla y se mantienen.
  metabolismo: {
    label: "Metabolism",
    resumen: "From what you eat to energy.",
    intro: "Cellular respiration: how your cells turn food (mostly glucose) into ATP, the energy that keeps you running.",
    fichas: {
      "que-es": {
        nombre: "What it is",
        claves: ["It turns food into ATP", "The cell's energy", "It happens in the mitochondria"],
        explicacion: [
          "Cellular respiration is the process by which cells transform the nutrients in food (mainly glucose) into ATP, the molecule that provides the energy the body needs to work.",
          "This process happens mainly in the mitochondria, known as the “power plants” of the cell.",
        ],
      },
      glucolisis: {
        nombre: "1. Glycolysis",
        claves: ["It splits glucose into pyruvate", "It gives 2 ATP and NADH", "It doesn't need oxygen"],
        explicacion: [
          "Cellular respiration begins in the cytoplasm, outside the mitochondrion. When we eat carbohydrates, digestion breaks them down into glucose molecules (remember that carbohydrates are chains of glucose joined together, and digestion pulls them apart). During glycolysis, one molecule of glucose (6 carbons) is split into two smaller molecules called pyruvate (3 carbons each).",
          "This process yields 2 ATP (immediate energy) and 2 NADH, molecules that store electrons in order to produce more energy later on.",
          "Glycolysis doesn't need oxygen, which is why it can happen even when we're exercising hard.",
        ],
      },
      "piruvato-acetil-coa": {
        nombre: "2. From pyruvate to acetyl-CoA",
        claves: ["Pyruvate enters the mitochondrion", "It becomes acetyl-CoA", "It releases the CO₂ you breathe out"],
        explicacion: [
          "The two pyruvates enter the mitochondrion. There they are turned into a molecule called acetyl-CoA, releasing carbon dioxide (CO₂), which we later push out when we breathe.",
          "More NADH is produced as well, and it will be used to make ATP further on. This stage connects glycolysis with the Krebs cycle.",
        ],
      },
      "ciclo-krebs": {
        nombre: "3. Krebs cycle",
        claves: ["It charges up NADH and FADH₂", "Batteries full of electrons", "It releases more CO₂"],
        explicacion: [
          "Acetyl-CoA enters a series of chemical reactions known as the Krebs cycle. Not much energy is produced directly here, but a great many carrier molecules are: NADH and FADH₂.",
          "These molecules work like small batteries charged with electrons. During this stage CO₂ is also released, and we get rid of it when we breathe out.",
        ],
      },
      "cadena-electrones": {
        nombre: "4. Electron transport chain",
        claves: ["This is where almost all the energy is made", "The electrons pump protons", "Like water behind a dam"],
        explicacion: [
          "This is the stage where almost all the energy is generated. NADH and FADH₂ hand their electrons over to a chain of proteins sitting in the inner membrane of the mitochondrion.",
          "As the electrons move along this chain they release energy, and that energy pumps protons (H⁺) to one side of the membrane. That creates a difference in concentration, as if water were being stored behind a dam.",
        ],
      },
      "atp-sintasa": {
        nombre: "5. ATP synthase",
        claves: ["The protons make it spin", "It makes most of the ATP", "Like a hydroelectric turbine"],
        explicacion: [
          "The protons want to go back to the other side of the membrane, and the only way through is a protein called ATP synthase. As the protons pass, ATP synthase spins and uses that energy to make ATP.",
          "It's much like a hydroelectric plant: the stored water is the protons, the turbine is ATP synthase and the electricity produced would be the ATP.",
          "This stage yields roughly 28-32 ATP, far more than the earlier ones.",
        ],
      },
      oxigeno: {
        nombre: "6. What oxygen does",
        claves: ["It doesn't produce energy directly", "It picks up the final electrons", "Without it, the cell dies"],
        explicacion: [
          "Oxygen doesn't produce energy directly. Its job is to receive the electrons at the end of the transport chain. When it accepts those electrons and joins protons, it forms water (H₂O).",
          "Without oxygen the chain stops, not enough ATP is made and the cell ends up dying. That's why breathing is essential in order to produce energy.",
        ],
      },
    },
  },

  // ── Cetosis ───────────────────────────────────────────────────────────────
  cetosis: {
    label: "Ketosis",
    resumen: "When the body runs on fat.",
    intro: "The ketogenic diet: when glucose runs short, the body makes ketone bodies out of fat and uses them as fuel.",
    fichas: {
      "baja-glucosa": {
        nombre: "1. Glucose and insulin drop",
        eyebrow: "The starting point",
        claves: ["Fasting, exercise or few carbohydrates", "Insulin falls, glucagon rises", "The body starts drawing on its reserves"],
        explicacion: [
          "Ketosis begins when glucose becomes less available, generally through prolonged fasting, intense exercise or a diet very low in carbohydrates.",
          "As a result, insulin levels come down and glucagon levels go up, which favors the use of the body's energy reserves.",
        ],
      },
      lipolisis: {
        nombre: "2. Lipolysis in fat tissue",
        eyebrow: "In the adipose tissue",
        claves: ["Low insulin breaks the fats down", "The adipocytes release fatty acids", "They go into the blood with glycerol"],
        explicacion: [
          "The drop in insulin switches on the breakdown of the triglycerides stored in fat tissue.",
          "The adipocytes release free fatty acids and glycerol into the bloodstream.",
        ],
      },
      "beta-oxidacion": {
        nombre: "3. β-oxidation in the liver",
        eyebrow: "In the mitochondria",
        claves: ["The fatty acids reach the liver", "They're broken down by β-oxidation", "They generate a lot of acetyl-CoA"],
        explicacion: [
          "The fatty acids reach the liver, where they are broken down by β-oxidation inside the mitochondria.",
          "This process generates large amounts of acetyl-CoA, a molecule needed for cellular respiration.",
        ],
      },
      cetogenesis: {
        nombre: "4. Ketone bodies",
        eyebrow: "Ketogenesis",
        claves: ["Acetyl-CoA piles up", "The liver turns it into ketone bodies", "Acetoacetate, β-hydroxybutyrate and acetone"],
        explicacion: [
          "When acetyl-CoA piles up, the liver turns it into ketone bodies: acetoacetate, β-hydroxybutyrate and acetone.",
          "This process is called ketogenesis.",
        ],
      },
      transporte: {
        nombre: "5. They travel through the blood",
        eyebrow: "The transport",
        claves: ["The ketone bodies leave the liver", "They circulate in the blood", "They reach every organ"],
        explicacion: [
          "The ketone bodies leave the liver and circulate in the blood to different organs, where they can be used as an alternative source of energy.",
        ],
      },
      utilizacion: {
        nombre: "6. They become energy",
        eyebrow: "The final destination",
        claves: ["Brain, heart and muscle take them up", "They go back to being acetyl-CoA", "They produce ATP in the Krebs cycle"],
        explicacion: [
          "The tissues, especially the brain, the heart and skeletal muscle, take up the ketone bodies and turn them back into acetyl-CoA in order to produce ATP through the Krebs cycle.",
          "That's how they supply energy when glucose is scarce.",
        ],
      },
    },
  },

  // ── Expresión génica y epigenética ────────────────────────────────────────
  // «la Vida» con mayúscula es intencionada en el español y se queda "Life".
  epigenetica: {
    label: "Gene expression and epigenetics",
    resumen: "Same DNA, different cells.",
    intro: "A neuron and a liver cell have the SAME DNA, but opposite jobs. How? By switching different genes on and off.",
    fichas: {
      metilacion: {
        nombre: "DNA methylation",
        eyebrow: "The off switch",
        claves: ["Marks that silence genes", "The gene is still there, but isn't read", "It's what makes cells different"],
        explicacion: [
          "Adding small chemical marks (methyl groups) onto the DNA usually silences a gene: it's still there, but it isn't read.",
          "That's how a liver cell and a neuron, with the same DNA, switch different genes off and on and end up so different from each other.",
        ],
      },
      histonas: {
        nombre: "Histones",
        eyebrow: "Packing things away or putting them on show",
        claves: ["DNA winds around them", "Wound tight it hides, loose it shows", "They decide which genes get read"],
        explicacion: [
          "DNA winds around proteins called histones. If it winds tight, the gene stays hidden; if it loosens, the gene becomes available to be read.",
          "Modifying the histones is another way of deciding which parts of the manual are within reach and which are put away.",
        ],
      },
      factores: {
        nombre: "Transcription factors",
        eyebrow: "Who decides what gets read",
        claves: ["The genes' switches", "They start or stop the reading", "They answer to signals"],
        explicacion: [
          "They're proteins that stick to the DNA and start or stop the reading of particular genes, like switches that answer to signals from inside and outside.",
          "Thanks to them the cell adjusts in real time which proteins it makes, according to what it needs.",
        ],
      },
      ambiente: {
        nombre: "The environment switches genes on",
        eyebrow: "Your Life leaves a mark",
        claves: ["Your habits mark your genes", "They don't change your DNA", "They change how it's used"],
        explicacion: [
          "Food, exercise, stress, sleep or tobacco can change these epigenetic marks and, with them, which genes get expressed.",
          "They don't change your DNA, but they do change how it's used: your habits talk to your genes every single day.",
        ],
      },
      herencia: {
        nombre: "Epigenetic inheritance",
        eyebrow: "Sometimes it's passed on",
        claves: ["Some marks are inherited", "The parents' Life has an influence", "A young and fascinating field"],
        explicacion: [
          "Some epigenetic marks can pass from one generation to the next, so that a parent's experiences could have an influence on their children.",
          "It's a young and fascinating field: it suggests that the environment leaves a mark that reaches beyond a single Life.",
        ],
      },
    },
  },

  // ── Detoxificación del hígado ─────────────────────────────────────────────
  // Ojo con la ficha del glutatión: los rótulos en versales del español
  // («PRIMER TRABAJO · …») son parte del ritmo del texto y se mantienen en
  // versales en inglés. Los pasos numerados «1. La entrega» también.
  detoxificacion: {
    label: "Liver detoxification",
    resumen: "How your body clears out what it can't use.",
    intro: "Your liver deactivates medicines, alcohol and toxins in two phases and gets them ready to be cleared out.",
    fichas: {
      "fase-1": {
        nombre: "Phase I · transform",
        eyebrow: "Opening the package",
        claves: ["Enzymes that transform the toxin", "They make it manageable", "“Opening the package”"],
        explicacion: [
          "A group of liver enzymes (the cytochrome P450 family) modify toxic substances to make them more manageable. Sometimes, along the way, they make them briefly more reactive.",
          "It's like opening the package: it gets the toxin ready for the next step.",
        ],
      },
      "fase-2": {
        nombre: "Phase II · neutralize",
        eyebrow: "Making them harmless",
        claves: ["It neutralizes them", "It makes them water-soluble", "It needs good nutrients"],
        explicacion: [
          "The liver joins those substances to other molecules (conjugation) to make them water-soluble and harmless.",
          "It needs raw materials that come from the diet (amino acids, antioxidants); that's why eating well supports this process.",
        ],
      },
      "fase-3": {
        nombre: "Phase III · clear out",
        eyebrow: "Getting them out",
        claves: ["It pushes the toxins out", "Through urine or bile", "Fiber helps carry them out"],
        explicacion: [
          "Once neutralized, the substances are pushed out: through the urine (kidney) or through the bile into the intestine and the stool.",
          "Fiber helps sweep them out and keeps them from being reabsorbed.",
        ],
      },
      glutation: {
        nombre: "Glutathione",
        eyebrow: "The master antioxidant",
        claves: ["It gives up its electron and gets recycled", "It hooks onto toxins to clear them out", "It recharges vitamins C and E"],
        explicacion: [
          "It's the star molecule of the liver's detoxification and antioxidant defense. The body makes it itself and it does two very different jobs: neutralizing free radicals, and hooking onto toxins so they can be cleared out.",
          "FIRST JOB · the antioxidant sacrifice. Free radicals are unstable molecules missing an electron, and they steal one wherever they can: from DNA, from proteins, from the fats in the membranes. That's where glutathione comes in.",
          "1. The handover. Glutathione in its active form (GSH) has a sulfur atom carrying a hydrogen, what's called a thiol group. It willingly hands that hydrogen, with its electron, over to the free radical.",
          "2. The neutralization. With the help of an enzyme, glutathione peroxidase, the radical is stabilized and left harmless: it ends up turned into water or into an alcohol.",
          "3. The recycling. Having given up its electron, glutathione is left oxidized and joins another spent glutathione to form a pair (GSSG). Then another enzyme, glutathione reductase, spends cellular energy (NADPH) to recharge it and send it back into battle. Almost nothing is thrown away: the same molecule is used over and over.",
          "SECOND JOB · conjugation, detoxification proper. In the liver, glutathione takes on medicines directly (paracetamol is the classic example), along with alcohol, heavy metals and other toxins.",
          "1. The hook. An enzyme called glutathione S-transferase physically sticks glutathione onto the toxin.",
          "2. Making it soluble. Most toxins are fatty, and the body has no way of clearing fat out through the urine. Stuck to glutathione, they become water-soluble.",
          "3. The exit. Now soluble, they can leave through the kidney with the urine or through the bile into the intestine. This is exactly the Phase II you saw earlier: glutathione is one of its main molecules.",
          "And on top of that it's the team's official recharger: when vitamin C and vitamin E wear themselves out defending you, glutathione hands them electrons and puts them back in service. That's why it's called the master antioxidant, not only for what it neutralizes itself, but because it keeps the others standing.",
          "When it matters: the body makes it, but the reserves run down with alcohol, tobacco, toxins, infections and sustained oxidative stress. The damage starts to pile up right when glutathione falls short. In fact, in a paracetamol overdose the antidote used in hospital (N-acetylcysteine) works precisely by giving the liver the raw material to make it again.",
        ],
      },
      "mito-detox": {
        nombre: "The “detox” fad",
        eyebrow: "What actually helps",
        claves: ["You already detox yourself", "Better than any “detox”", "Less alcohol, more water and fiber"],
        explicacion: [
          "Your liver and your kidneys are already detoxing you every second, better than any juice or “detox” product.",
          "What does help is not overloading them: less alcohol and fewer ultra-processed foods, and more water, fiber, sleep and vegetables.",
        ],
      },
    },
  },

  // ── Estrés oxidativo y antioxidantes ──────────────────────────────────────
  "estres-oxidativo": {
    label: "Oxidative stress and antioxidants",
    resumen: "Free radicals, and how you defend yourself.",
    intro: "When the sun hits you or you make energy, free radicals appear and damage your cells. Your body has an antioxidant army of its own.",
    fichas: {
      radicales: {
        nombre: "Free radicals",
        eyebrow: "Unstable molecules (ROS)",
        claves: ["Unstable molecules (ROS)", "They steal electrons and cause damage", "It's the excess that's the problem"],
        explicacion: [
          "They're unstable molecules produced when you make energy or when you take in radiation (the sun). They're missing an electron and they “steal” it from other molecules, damaging them.",
          "Not all of them are bad: in small amounts they work as a signal and as a defense. The problem is the excess.",
        ],
      },
      dano: {
        nombre: "Oxidative damage",
        eyebrow: "When it piles up",
        claves: ["It damages DNA, fats and proteins", "It speeds up aging", "Wrinkles and stiff arteries"],
        explicacion: [
          "In excess, free radicals damage DNA, the fats in the membranes and proteins. That wear and tear, adding up over the years, speeds up aging.",
          "It's linked to wrinkles, stiffer arteries and several chronic diseases.",
        ],
      },
      "antioxidantes-propios": {
        nombre: "Your inner army",
        eyebrow: "Your own antioxidants",
        claves: ["Your body makes its own", "Your first line of defense", "Diet only tops it up"],
        explicacion: [
          "The body makes its own antioxidants (glutathione, superoxide dismutase, catalase) that neutralize radicals before they can do damage.",
          "That's your first and main defense; diet only tops it up.",
        ],
      },
      "antioxidantes-dieta": {
        nombre: "The ones from food",
        eyebrow: "Antioxidants in the diet",
        claves: ["Vitamin C, E and polyphenols", "They hold back oxidative damage", "Food beats pills"],
        explicacion: [
          "Vitamin C, vitamin E and the polyphenols in fruit, vegetables, tea or olive oil help hold back oxidative damage.",
          "Better from real food than from pills: in high doses, antioxidant supplements don't always help and can even get in the way.",
        ],
      },
      hormesis: {
        nombre: "Hormesis",
        eyebrow: "A little stress makes you stronger",
        claves: ["A little stress makes you stronger", "Exercise trains your defenses", "Small challenges make you resilient"],
        explicacion: [
          "Exercise generates free radicals… and it's still healthy: that small dose of stress trains your antioxidant defenses to be stronger.",
          "That's hormesis: small doses of a challenge make you more resilient.",
        ],
      },
    },
  },

  // ── Sistema inmunitario ───────────────────────────────────────────────────
  // Los números del nombre («1. Macrófagos») ordenan la coreografía de la
  // rejilla y se mantienen. Términos: cytokines, antigen, phagocytose, NETs,
  // helper / cytotoxic T cells, opsonization.
  inmunitario: {
    label: "Immune system",
    resumen: "The dance between the cells.",
    intro: "When a pathogen gets in, your defenses answer in waves, coordinating like a piece of choreography.",
    fichas: {
      macrofagos: {
        nombre: "1. Macrophages",
        claves: ["They swallow microbes and debris", "They raise the alarm with antigens", "The calm guardians of the tissue"],
        explicacion: [
          "Macrophages are large immune cells that live in almost every tissue of the body.",
          "Their main job is to phagocytose — that is, to surround and swallow bacteria, viruses, dead cells and other debris in order to destroy them. Inside the macrophage there are compartments full of enzymes that break all that material down, turn it into other molecules and can reuse some of them or present them to other cells.",
          "But macrophages don't only clean up. After destroying the invader, they place small fragments of the microorganism (antigens) on their surface to let the rest of the immune system know which enemy they've run into.",
          "They also release chemical substances called cytokines, which draw in other defensive cells and help start inflammation.",
          "They're our calmest guardians and, when an infection isn't too serious, they often bring it under control on their own without having to call in large numbers of neutrophils, since neutrophils tend to do more damage to the tissue when the response is very intense.",
        ],
      },
      neutrofilos: {
        nombre: "2. Neutrophils",
        eyebrow: "The rapid response soldiers",
        claves: ["First on the scene, and the most numerous", "Almost suicidal soldiers", "They make up the pus"],
        explicacion: [
          "Neutrophils are the most abundant white blood cells in the blood and they reach the site of an infection very fast.",
          "They're almost suicidal soldiers whose mission is to destroy microorganisms as soon as possible. To do it they can phagocytose bacteria, release antimicrobial substances or throw out their own DNA to form nets called NETs (neutrophil extracellular traps), which catch pathogens and help clear them out — killing themselves in the process, but being lethally efficient.",
          "Effective as they are, they don't live long. Once their job is done they usually die so as not to cause unnecessary damage and, together with bacteria and cellular debris, they make up part of the pus or the mucus that shows up in some infections. The greener the mucus, the more dead neutrophils it usually holds.",
        ],
      },
      dendriticas: {
        nombre: "3. Dendritic cells",
        eyebrow: "The immune system's messengers",
        claves: ["The body's scouts", "They present the pathogen", "The bridge to specific defense"],
        explicacion: [
          "Dendritic cells are the “scouts” that travel all over our body looking for whatever isn't part of us. If they find it, they take a sample and present it to the T cells.",
          "They patrol tissues like the skin and the mucous membranes constantly, searching for microorganisms. When they find one, they capture fragments of the pathogen and travel to the lymph nodes.",
          "There they present those fragments to the T cells. Thanks to that presentation, the T cells can recognize exactly which microorganism has invaded the body and start a far more specific response.",
          "That's why dendritic cells are the bridge between innate and adaptive immunity.",
        ],
      },
      "linfocitos-t": {
        nombre: "4. T cells",
        eyebrow: "The coordinators and the eliminators",
        claves: ["They spot the enemy and coordinate the defense", "Each one has a unique receptor", "They “graduate” in the thymus"],
        explicacion: [
          "T cells are able to work out which microorganism is attacking, thanks to the samples the dendritic cells present to them, and to switch on the right immune response.",
          "T cells are born building a random receptor out of the genes we carry. That's why millions of different T cells are born and why we say we can recognize practically any bacterium or virus. But being able to recognize them doesn't mean we're already immune to them.",
          "To be allowed to stay in the immune system, T cells have to pass the terrible tests of the thymus, where “teacher” cells make sure they don't recognize anything that's part of the body itself as an enemy, heading off possible autoimmune diseases. Because of that, only around 2% of the T cells born manage to pass.",
        ],
      },
      "linfocitos-t-colaboradores": {
        nombre: "5. Helper T cells",
        claves: ["They coordinate the immune response", "They switch the other defenses on", "Without them, everything falls apart"],
        explicacion: [
          "These act as the coordinators of the whole immune response.",
          "When they recognize an antigen presented by a dendritic cell, they release cytokines that switch on the macrophages (ordering them to attack and boosting their ability to do it), the B cells whose receptor recognizes that same antigen and, if need be, the cytotoxic T cells, which are genuinely aggressive.",
          "Without them, the immune response would be far less effective.",
        ],
      },
      "linfocitos-t-citotoxicos": {
        nombre: "6. Cytotoxic T cells",
        claves: ["They kill infected cells", "They trigger their apoptosis", "Precise with healthy tissue"],
        explicacion: [
          "Their job is to destroy the body's own cells when they're infected by viruses or have turned cancerous. They do it point-blank: they punch through the membrane of the infected cell and trigger its programmed death (apoptosis).",
          "That way they get rid of the problem without doing too much damage to the neighboring tissue.",
        ],
      },
      "linfocitos-b": {
        nombre: "7. B cells",
        eyebrow: "The antibody factories",
        claves: ["They make antibodies", "One antigen each", "They create memory: vaccines"],
        explicacion: [
          "B cells also belong to adaptive immunity.",
          "Each B cell recognizes a single type of antigen. When it finds its own and gets help from a helper T cell, it starts multiplying.",
          "It then turns into a plasma cell, whose mission is to make enormous amounts of antibodies.",
          "Some B cells become memory cells, able to respond far faster if the same microorganism gets into the body again. That memory is the basis of how vaccines work.",
        ],
      },
      "natural-killers": {
        nombre: "8. Natural killers (NK)",
        claves: ["They kill without warning", "They hunt for infected cells", "They stop cancer early"],
        explicacion: [
          "These are cells able to kill without needing any specific activation beforehand.",
          "They look for cells showing signs of being infected or of having turned cancerous, wipe them out and carry on with their mission. Thanks to them, many cancerous cells are cleared out before they ever manage to form a tumor.",
        ],
      },
      inflamacion: {
        nombre: "9. Inflammation",
        claves: ["A defense against damage or infection", "The vessels let the defenses through", "It reddens, warms and hurts"],
        explicacion: [
          "Inflammation is a defense mechanism that shows up when there's an infection or an injury.",
          "Macrophages and other cells release substances such as cytokines, and others release mediators such as histamine, which produce several changes: the blood vessels widen, blood flow increases and the vessels become more permeable, letting the cells of the immune system reach the affected area.",
          "As a result the classic signs of inflammation appear: redness, heat, swelling, pain and, sometimes, a temporary loss of function.",
          "Uncomfortable as it is, inflammation is an essential tool for getting rid of whatever caused the problem and starting the repair of the tissue.",
        ],
      },
      anticuerpos: {
        nombre: "10. Antibodies",
        eyebrow: "The precision weapons",
        claves: ["Precision proteins", "One key per lock", "They neutralize and tag the invader"],
        explicacion: [
          "Antibodies, also called immunoglobulins, are proteins produced by the plasma cells, which come from the B cells.",
          "Each antibody recognizes one very specific antigen, as if it were a key designed for a single lock.",
          "When they bind to the microorganism they can neutralize viruses and toxins, keeping them from infecting cells or having their effect, and tag bacteria so that macrophages and neutrophils can phagocytose them more easily (opsonization).",
          "Thanks to antibodies, the immune system can attack the invader very specifically without affecting the rest of the body.",
        ],
      },
    },
  },

  // ── Envejecimiento celular ────────────────────────────────────────────────
  // «Inflammaging» no se traduce: es el término tal cual, y en inglés se queda
  // sin comillas porque allí no es un préstamo.
  envejecimiento: {
    label: "Cellular aging",
    resumen: "Telomeres, senescence and wear.",
    intro: "Why cells age: the clock of the telomeres, the cells that “retire” and oxidative wear.",
    fichas: {
      telomeros: {
        nombre: "Telomeres",
        eyebrow: "The clock of cell divisions",
        claves: ["They protect the chromosomes", "They shorten with each division", "One of aging's clocks"],
        explicacion: [
          "They're the protective ends of the chromosomes. Every time a cell divides, they get a little shorter.",
          "When they get too short, the cell stops dividing: it's one of the clocks of aging.",
        ],
      },
      senescencia: {
        nombre: "Senescence",
        eyebrow: "“Zombie” cells",
        claves: ["“Zombie” cells", "They neither die nor divide", "They inflame their surroundings"],
        explicacion: [
          "Some damaged cells neither die nor divide: they “retire” (senescence) but they're still there, releasing inflammatory signals.",
          "Piling up over the years, they clutter the tissue and speed up the aging of everything around them.",
        ],
      },
      mitocondrias: {
        nombre: "Engines that wear out",
        eyebrow: "Tired mitochondria",
        claves: ["With age they perform worse", "They generate more radicals", "Less energy, more tiredness"],
        explicacion: [
          "With age, the mitochondria work worse and generate more free radicals, which in turn damages them further: a vicious circle.",
          "Less cellular energy is one of the reasons for the tiredness and the loss of function that come with the years.",
        ],
      },
      inflammaging: {
        nombre: "Background inflammation",
        eyebrow: "Inflammaging",
        claves: ["Chronic, silent inflammation", "It wears the tissues down", "Tied to the diseases of age"],
        explicacion: [
          "Aging comes with a chronic, low-grade, silent inflammation that gradually wears the tissues down.",
          "It's linked to many of the diseases that come with age.",
        ],
      },
      autofagia: {
        nombre: "Autophagy",
        eyebrow: "The recycling that takes care of you",
        claves: ["The cell's recycling", "It clears out damaged parts", "Exercise and fasting switch it on"],
        explicacion: [
          "It's the cell's recycling system: it clears out old or damaged parts and reuses their materials.",
          "Exercise and fasting stimulate it; keeping it active helps you age better.",
        ],
      },
      fotoenvejecimiento: {
        nombre: "Photoaging",
        eyebrow: "How deep each ray reaches",
        claves: ["Each ray reaches a different layer", "UVB burns, UVA wrinkles", "It goes through clouds and glass"],
        explicacion: [
          "Sunlight isn't one single thing: it's a mix of radiations, and each one gets into the skin to a different depth. That explains why some burn you and others, without your noticing, wrinkle you.",
          "UVB · it stays up top, in the epidermis. It's the one that burns and the one that reddens. Its energy is so high that it damages the DNA of the cells directly, and that's why it's the main cause of skin cancer. It's also the one that starts vitamin D production.",
          "UVA · it goes through the epidermis and reaches the dermis, right where the fibroblasts and the collagen live. It doesn't burn, so it gives you no warning, but it generates free radicals that break the collagen and elastin fibers. It's what causes wrinkles, sagging and dark spots. It makes up most of the ultraviolet radiation that reaches us and, unlike UVB, it goes through clouds and through the glass of a window or a car.",
          "Visible light and infrared · they reach deeper still, down to the hypodermis. Infrared is the heat you feel, and it also generates free radicals. Visible light, especially blue light, can activate the melanocytes and worsen dark spots such as melasma, particularly in darker skin.",
          "Why this belongs in aging: on top of the internal clocks you've seen in the other cards, the skin picks up an extra layer of aging that depends only on how much sun it has taken. It's called photoaging and it explains most of what we recognize as an aged face. The proof is on your own body: compare the skin of your face with the skin on the inner side of your arm. They are exactly the same age.",
          "When it matters: that's why sunscreen is, by a long way, the best anti-aging cream there is. And since UVA goes through clouds and glass, the damage doesn't depend on the weather being hot or on your being at the beach: a cloudy winter day next to the window counts too.",
        ],
      },
    },
  },

  // ── Apoptosis y necrosis ──────────────────────────────────────────────────
  apoptosis: {
    label: "Apoptosis and necrosis",
    resumen: "The two ways a cell can die.",
    intro: "A cell can shut down in an orderly, programmed way (apoptosis) or die all at once from an injury (necrosis). They aren't the same thing.",
    fichas: {
      apoptosis: {
        nombre: "Apoptosis",
        eyebrow: "Dying in good order",
        claves: ["Programmed cell death", "Clean and orderly", "Its remains get recycled"],
        explicacion: [
          "It's programmed cell death: the cell takes itself apart cleanly and in good order, and its remains are recycled without harming the neighbors.",
          "It's a useful, quiet death, planned by the body itself.",
        ],
      },
      necrosis: {
        nombre: "Necrosis",
        eyebrow: "Dying all at once",
        claves: ["Death from injury", "The cell bursts open", "It causes inflammation"],
        explicacion: [
          "It's death from injury (a blow, a lack of oxygen, a toxin): the cell breaks open in an uncontrolled way and its contents spill out.",
          "That causes inflammation around it, unlike apoptosis.",
        ],
      },
      util: {
        nombre: "Why it's necessary",
        eyebrow: "A death that gives Life",
        claves: ["It sculpts the body", "It clears out dangerous cells", "Billions of them a day"],
        explicacion: [
          "Apoptosis sculpts the body (it's what separates the fingers in the embryo, for instance) and clears out old, damaged or dangerous cells.",
          "Every day billions of your cells die this way, and you don't notice a thing.",
        ],
      },
      cancer: {
        nombre: "When it fails: cancer",
        eyebrow: "Cells that don't obey",
        claves: ["If it dodges death…", "It divides out of control", "One of the origins of cancer"],
        explicacion: [
          "If a damaged cell dodges apoptosis, it can keep dividing out of control: that's one of the origins of cancer.",
          "Many treatments aim at precisely that — switching the order to die back on in those cells.",
        ],
      },
    },
  },

  // ── Regeneración ──────────────────────────────────────────────────────────
  regeneracion: {
    label: "Regeneration",
    resumen: "When you get a wound.",
    intro: "How your body closes a wound, step by step, until barely a scar is left.",
    fichas: {
      hemostasia: {
        nombre: "1 · Stop the bleeding",
        eyebrow: "Hemostasis",
        claves: ["The platelets form a plug", "Clotting is switched on", "The first emergency patch"],
        explicacion: [
          "Within seconds, the platelets form a plug and clotting is switched on to close the wound and stop the bleeding.",
          "It's the first emergency patch.",
        ],
      },
      inflamacion: {
        nombre: "2 · Clean up",
        eyebrow: "Inflammation",
        claves: ["The defenses arrive to clean up", "It reddens and swells", "It leaves the ground ready"],
        explicacion: [
          "Defensive cells arrive and clear out microbes and bits of damaged tissue. The area reddens and swells: that's normal and necessary.",
          "It leaves the ground clean, ready to rebuild.",
        ],
      },
      proliferacion: {
        nombre: "3 · Rebuild",
        eyebrow: "Proliferation",
        claves: ["The fibroblasts make collagen", "New vessels grow", "New tissue, still fragile"],
        explicacion: [
          "The fibroblasts make collagen, new blood vessels grow and the skin cells cover the wound.",
          "New tissue forms, still fragile.",
        ],
      },
      remodelacion: {
        nombre: "4 · Finish it off",
        eyebrow: "Remodeling",
        claves: ["The tissue reorganizes", "It gains strength over time", "Sometimes a scar is left"],
        explicacion: [
          "Over weeks or months, the new tissue reorganizes itself and gains strength; sometimes a scar is left.",
          "The scar is tough, though never identical to the original tissue.",
        ],
      },
      "celulas-madre": {
        nombre: "Stem cells",
        eyebrow: "The ones that make it possible",
        claves: ["“Blank” cells", "They replace what gets lost", "Heart and brain have very few"],
        explicacion: [
          "They're “blank” cells that can turn into different types and replace the ones that get lost. They renew skin, blood or intestine constantly.",
          "Some organs (like the heart or the brain) have very few, and that's why they repair themselves worse.",
        ],
      },
    },
  },

  // ── Homeostasis ───────────────────────────────────────────────────────────
  // Unidades: el español da 37 °C y pH 7,4. En inglés la coma decimal pasa a
  // punto (7.4) y la temperatura se deja en Celsius, como el resto de la casa.
  homeostasis: {
    label: "Homeostasis",
    resumen: "The body always looking for balance.",
    intro: "How your body keeps temperature, glucose, pH and blood pressure constant, whatever is happening outside.",
    fichas: {
      temperatura: {
        nombre: "Temperature",
        eyebrow: "Always around 37 °C",
        claves: ["Always around 37 °C", "Sweating or shivering adjusts it", "So the enzymes can work"],
        explicacion: [
          "If you're hot, you sweat and your vessels widen; if you're cold, you shiver and they close.",
          "Keeping your temperature steady is what lets your enzymes work properly.",
        ],
      },
      glucosa: {
        nombre: "Blood sugar",
        eyebrow: "Not too much, not too little",
        claves: ["Insulin and glucagon regulate it", "Not too much, not too little", "If it fails for years, diabetes"],
        explicacion: [
          "Insulin and glucagon raise or lower glucose to keep it within a narrow margin, whether you eat or fast.",
          "When that regulation fails for years, diabetes appears.",
        ],
      },
      "agua-sales": {
        nombre: "Water and salts",
        eyebrow: "The internal balance",
        claves: ["The kidneys adjust water and salt", "Depending on what you drink or sweat", "Your blood pressure depends on it"],
        explicacion: [
          "The kidneys and several hormones adjust how much water and salt you keep or clear out, depending on how much you drink, sweat or eat.",
          "Your blood pressure and the proper working of your cells depend on it.",
        ],
      },
      ph: {
        nombre: "The pH of your blood",
        eyebrow: "A very narrow margin",
        claves: ["pH held steady at 7.4", "Lungs and kidneys correct it", "A very narrow margin"],
        explicacion: [
          "Blood is kept at a very steady pH (around 7.4). The lungs and the kidneys correct it without a pause.",
          "Small deviations are dangerous; that's why this is one of the most closely watched balances of all.",
        ],
      },
    },
  },

  // ── Nervio vago ───────────────────────────────────────────────────────────
  "nervio-vago": {
    label: "Vagus nerve",
    resumen: "The cable that calms you.",
    intro: "The longest nerve of the autonomic nervous system: it connects the brain with the heart, the lungs and the gut, and it's the key to calm.",
    fichas: {
      "que-es": {
        nombre: "The longest cable",
        eyebrow: "What it is",
        claves: ["The longest nerve", "It connects brain and organs", "From the heart to the gut"],
        explicacion: [
          "The vagus nerve is the longest of the autonomic nervous system: it leaves the brain and reaches the heart, the lungs and almost the whole digestive tract.",
          "It's the main line of communication between the brain and the internal organs.",
        ],
      },
      parasimpatico: {
        nombre: "The “calm” mode",
        eyebrow: "Rest and digest",
        claves: ["The “rest and digest” mode", "It slows the heart and relaxes you", "The counterweight to stress"],
        explicacion: [
          "It's the main face of the parasympathetic system, the “rest and digest” one: it slows the heart, favors digestion and relaxes you.",
          "It's the counterweight to stress: when it switches on, the body recovers.",
        ],
      },
      "intestino-cerebro": {
        nombre: "Gut-brain axis",
        eyebrow: "Two brains talking",
        claves: ["The gut speaks through the vagus", "It carries signals from the microbiota", "It has a say in your mood"],
        explicacion: [
          "A large part of the information going up from the gut to the brain travels along the vagus, including signals from the microbiota.",
          "That's why the gut has a say in your mood, and why emotions are felt in your stomach.",
        ],
      },
      tono: {
        nombre: "Vagal tone",
        eyebrow: "It can be trained",
        claves: ["Getting your calm back quickly", "It's trained: breathe, cold, sing", "Better stress and better rest"],
        explicacion: [
          "Good “vagal tone” means you get your calm back easily after stress. It can be trained: slow breathing, long exhales, cold exposure, singing.",
          "Looking after it improves how you handle stress and how you rest.",
        ],
      },
      corazon: {
        nombre: "The heart's brake",
        eyebrow: "Heart rate variability",
        claves: ["It slows the heart at rest", "It sets your heart rate variability", "More variability, better health"],
        explicacion: [
          "The vagus sets the heart's baseline rhythm: it slows it down at rest. The variability of your heart rate reflects how well it's working.",
          "Higher variability is usually a sign of good health and good recovery.",
        ],
      },
    },
  },

  // ── Sistema nervioso entérico ─────────────────────────────────────────────
  // Los plexos van con su nombre clásico y el epónimo entre paréntesis, igual
  // que en español: Myenteric plexus (Auerbach), Submucosal plexus (Meissner).
  "sistema-enterico": {
    label: "Enteric nervous system",
    resumen: "The gut's “second brain.”",
    intro: "A network of millions of neurons in the walls of the digestive tract that runs digestion almost on its own.",
    fichas: {
      "que-es": {
        nombre: "The “second brain”",
        eyebrow: "What it is",
        claves: ["Millions of neurons in the gut", "It can work without the brain", "It coordinates the whole of digestion"],
        explicacion: [
          "The enteric nervous system (ENS) is a network of millions of neurons sitting in the walls of the digestive tract.",
          "It's known as the “second brain” because it can control many digestive functions without a direct order from the brain or the spinal cord.",
          "Its main job is to coordinate digestion, the movement of food, the secretion of digestive substances and the blood flow through the intestine.",
        ],
      },
      "plexo-mienterico": {
        nombre: "Myenteric plexus (Auerbach)",
        eyebrow: "The one that moves things",
        claves: ["It controls the muscle of the tract", "It regulates the contractions", "It produces peristalsis"],
        explicacion: [
          "It's the main nerve network in charge of controlling the movement of the muscles of the digestive tract.",
          "It regulates the contractions that push food along, through the process known as peristalsis.",
        ],
      },
      "plexo-submucoso": {
        nombre: "Submucosal plexus (Meissner)",
        eyebrow: "The one that secretes and absorbs",
        claves: ["Closer to the mucosa", "It controls secretion and absorption", "It regulates local blood flow"],
        explicacion: [
          "This plexus sits closer to the intestinal mucosa.",
          "It controls the secretion of enzymes, water and mucus, and it also regulates the absorption of nutrients and the local blood flow.",
        ],
      },
      "neuronas-sensitivas": {
        nombre: "Sensory neurons",
        eyebrow: "The ones that detect",
        claves: ["They detect what's going on inside", "Pressure, stretch, chemistry", "They alert the enteric system"],
        explicacion: [
          "They detect the changes inside the intestine, such as the presence of food, pressure, stretching or the chemical make-up of the digestive contents.",
          "They send that information on so the enteric nervous system can respond appropriately.",
        ],
      },
      interneuronas: {
        nombre: "Interneurons",
        eyebrow: "The ones that connect",
        claves: ["They connect the neurons of the ENS", "They integrate the sensory information", "They coordinate the response"],
        explicacion: [
          "The interneurons connect the different neurons of the enteric nervous system.",
          "They integrate the sensory information and coordinate the right response between the sensory and the motor neurons.",
        ],
      },
      "neuronas-motoras": {
        nombre: "Motor neurons",
        eyebrow: "The ones that give the order",
        claves: ["They give the final order", "To muscles and glands", "They cause contraction and secretion"],
        explicacion: [
          "They carry the final orders out to the muscles and the glands of the digestive tract.",
          "Thanks to them, the intestinal contractions happen and the secretions digestion needs are released.",
        ],
      },
    },
  },

  // ── El cáncer ─────────────────────────────────────────────────────────────
  // Este tema no tiene fichas: su contenido ES el cómic, que se traduce en
  // `COMICS_EN` bajo la clave "profundiza-cancer". Aquí van solo los rótulos.
  //
  // El tono del español es mecanismo, nunca culpa. En inglés igual: se explica
  // un proceso, no se reparte responsabilidad.
  cancer: {
    label: "Cancer",
    resumen: "A cell of yours that stops obeying.",
    intro: "It doesn't arrive from outside: it's a cell of yours that has been piling up faults until it stopped doing what the tissue asks of it.",
  },
};
