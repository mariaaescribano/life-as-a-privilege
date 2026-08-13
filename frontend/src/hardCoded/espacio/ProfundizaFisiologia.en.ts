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
};
