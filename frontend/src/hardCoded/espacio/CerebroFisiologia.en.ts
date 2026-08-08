import type { ParteCerebro, ZonaCerebro } from "./CerebroFisiologia";

/**
 * Las partes del cerebro, en INGLÉS.
 *
 * Aquí va SOLO el texto, emparejado por la `key` de cada parte. El orden, la
 * `zona`, el `color` y la `foto` viven únicamente en el fichero español: si se
 * duplicaran, bastaría mover una parte de zona en un idioma y no en el otro
 * para que la página se pintara distinta según el idioma.
 *
 * Lo que falte aquí se muestra en español, parte por parte (ver
 * `useCerebroFisiologia`).
 */
export type ParteCerebroTexto = Pick<ParteCerebro, "label" | "claves" | "descripcion">;

export const zonasCerebroEn: Record<ZonaCerebro, { titulo: string; entradilla: string }> = {
  corteza: {
    titulo: "The cortex",
    entradilla: "The outer layer, the newest one. This is where what you call “thinking” lives.",
  },
  centro: {
    titulo: "The deep center",
    entradilla: "Underneath the cortex. What you feel before you think it.",
  },
  base: {
    titulo: "The base",
    entradilla: "The oldest part. It beats, breathes and holds you up without asking permission.",
  },
};

export const partesCerebroEn: Record<string, ParteCerebroTexto> = {
  corteza: {
    label: "Cerebral cortex",
    claves: ["The wrinkled outer layer", "Some 16 billion neurons", "Conscious life happens here"],
    descripcion:
      "It's the outer layer of the brain, only a few millimeters thick, and it's folded all over. Those folds aren't decoration: they're how evolution fit an enormous surface inside a small skull. Spread flat, it would cover a large napkin. Almost everything you recognize as “being you” happens here: language, decisions, imagination, recognizing a face. It splits into two hemispheres, and each hemisphere into four lobes.",
  },
  frontal: {
    label: "Frontal lobe",
    claves: ["Deciding, planning, holding back", "The last to mature (~25 years)", "Moves the body on purpose"],
    descripcion:
      "It sits right behind your forehead, and it's the one that decides. It plans, puts steps in order, holds your attention and —above all— puts on the brakes: it's the one that says “better not.” The prefrontal cortex is here, the part of the brain that takes longest to finish maturing, well past your twenties. That's why at fifteen you feel things just as intensely as at forty, but you stop yourself far worse. At its back sits the motor cortex, which orders every voluntary movement.",
  },
  parietal: {
    label: "Parietal lobe",
    claves: ["Takes in touch and pain", "Knows where your body is", "Orients you in space"],
    descripcion:
      "It takes in everything you touch, plus temperature, pressure and pain, and pulls it together into one sensation that makes sense. It's also the one that knows where your hand ends when your eyes are closed, the one that lets you judge the distance to a glass before you reach for it, and the one that orients you walking somewhere new. When you say someone “has a good sense of space,” this is what you're talking about.",
  },
  temporal: {
    label: "Temporal lobe",
    claves: ["Hears and understands language", "Recognizes faces and voices", "Holds memories and meanings"],
    descripcion:
      "It sits on the sides, level with your ears. It processes sound and turns it into something meaningful: you don't just hear noise, you understand a sentence or recognize a song from three notes. It also recognizes faces and voices, and holds much of what you know about the world. Inside, it connects to the hippocampus and the amygdala — which is why a smell or a melody hands you back a whole memory at once.",
  },
  occipital: {
    label: "Occipital lobe",
    claves: ["All vision runs through here", "It's at the back, not in your eyes", "It builds what you think you see"],
    descripcion:
      "It takes up the very back of the head. This is where seeing actually happens: your eyes only catch light, the image gets built here. And it's built in pieces —color on one side, movement on another, edges on another— until a full scene comes together. That it feels seamless and continuous is an enormous job you never notice. Which is why an injury here can leave your eyes perfect and still leave you unable to see.",
  },
  "cuerpo-calloso": {
    label: "Corpus callosum",
    claves: ["Joins the two hemispheres", "Some 200 million fibers", "Makes them work as one"],
    descripcion:
      "It's the bridge joining the left hemisphere to the right: a bundle of some two hundred million nerve fibers crossing from side to side. Thanks to it, both sides share what each one is doing and the brain works as a single thing instead of two. Being “left-brained or right-brained” is a myth: the whole point is that they're connected the entire time.",
  },
  talamo: {
    label: "Thalamus",
    claves: ["The switchboard of the senses", "Filters what reaches awareness", "Everything but smell passes through"],
    descripcion:
      "It sits in the center, and nearly all the information coming in through your senses passes through it before going up to the cortex. Smell is the one exception: it goes straight in, which is why smells arrive so raw and so glued to emotion. The thalamus doesn't just distribute, it filters: it decides what deserves to reach your awareness and what stays out. A second ago you weren't noticing your clothes against your skin — that's this.",
  },
  hipotalamo: {
    label: "Hypothalamus",
    claves: ["Hunger, thirst, sleep, temperature", "Commands the hormones", "The size of an almond"],
    descripcion:
      "It's tiny, and it governs the essentials: hunger, thirst, body temperature, sexual desire and the clock that decides when you get sleepy. It's the hinge between the nervous and hormonal systems, because the order to the pituitary starts here. When stress takes away your appetite, throws off your sleep or stops your period, this is what's happening: it isn't “all in your head,” it's a physical chain that starts right here.",
  },
  hipofisis: {
    label: "Pituitary gland",
    claves: ["The gland that gives orders", "Commands thyroid, ovaries, adrenals", "Weighs half a gram"],
    descripcion:
      "The size of a pea and hanging beneath the hypothalamus, it's the gland that gives orders to the rest. From here come the hormones that set the thyroid going, the ovaries and testes, the adrenals and growth. It was called “the master gland” for years, though it obeys too: the one in charge of it is the hypothalamus, just above.",
  },
  amigdala: {
    label: "Amygdala",
    claves: ["The fear alarm", "Reacts before you understand", "Flags what's worth remembering"],
    descripcion:
      "It's the one that spots danger, and it's fast: it reacts before you've worked out what's going on. That's why you jump at a noise and only afterward realize it was a door. It also puts an emotional tag on what you live through, and whatever is tagged with emotion gets remembered far better. Under sustained stress it turns hyperreactive and starts raising the alarm over things that aren't a threat.",
  },
  hipocampo: {
    label: "Hippocampus",
    claves: ["Turns experience into memory", "It's your map of space", "It grows new neurons"],
    descripcion:
      "It's shaped like a seahorse, which is where the name comes from. It's the one that writes things down properly: it takes what you've just lived and turns it into a memory that lasts, mostly while you sleep. It's also your map — memory for places lives here. And it's one of the very few areas of the adult brain where new neurons are born. The cortisol of chronic stress damages it; exercise and good sleep protect it.",
  },
  "ganglios-basales": {
    label: "Basal ganglia",
    claves: ["Automate what you repeat", "Habits live here", "They run on dopamine"],
    descripcion:
      "They're a group of deep nuclei in charge of everything you no longer need to think about. Learning to drive takes enormous effort; a year later you drive while holding a conversation. That shift from “effortful” to “automatic” happens here. Which makes them the home of habits too, the good and the bad, and they run on dopamine: when something goes well, they flag the sequence so it gets repeated.",
  },
  cerebelo: {
    label: "Cerebellum",
    claves: ["Balance and precision", "Half your neurons are here", "Tunes movement as it happens"],
    descripcion:
      "It sits low and at the back, and although it takes up a tenth of the brain it holds more than half of all your neurons. It doesn't decide the movement, it tunes it: it corrects the gesture while you're making it so it comes out smooth and lands where you meant. Standing upright, picking up a glass without knocking it over, writing by hand — all its work. It also takes part in learning sequences and in language, though for decades it was thought to be purely motor.",
  },
  tronco: {
    label: "Brainstem",
    claves: ["Breathing and heartbeat, unthought", "Regulates being awake", "Joins brain to spinal cord"],
    descripcion:
      "It's the stalk connecting the brain to the spinal cord, and the oldest part you have. It controls what you can't afford to forget: breathing, heartbeat, blood pressure, coughing, swallowing. It also regulates being awake or asleep. Every signal traveling up and down between body and brain passes through it, and that's where they cross sides — which is why the left hemisphere moves the right half of your body.",
  },
};

/** Frase de cierre de la página. */
export const fraseCerebroEn =
  "Three pounds of tissue that knows itself. That's the only thing standing between you and the world.";
