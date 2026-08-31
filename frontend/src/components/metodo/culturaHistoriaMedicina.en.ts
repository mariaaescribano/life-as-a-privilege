// ─────────────────────────────────────────────────────────────────────────
// HISTORIA DE LA MEDICINA, EN INGLÉS · solo el texto.
//
// Emparejado por la `key` de la era y la `key` del momento con
// `culturaHistoriaMedicina.ts`. El orden, las claves y las fotos salen SIEMPRE
// del español; lo que falte aquí se lee en español (ver `culturaHistorias.en.ts`).
//
// CONVENIOS (los mismos en las seis Historias):
//   · «a. C.» → BC   ·  «d. C.» → AD   ·  «s. IV a. C.» → 4th c. BC
//   · La coma decimal pasa a punto y el punto de los miles a coma (20.000 →
//     20,000). El % va pegado al número, como en inglés.
//   · «Dato curioso:» → «Fun fact:»   ·  el segundo, «Fun fact II:».
//   · Los nombres y términos con su grafía inglesa de siempre (Avicenna,
//     Vesalius, Paracelsus, Semmelweis…), no una retraducción del español.
//   · Voz de María: segunda persona, contracciones naturales, frases cortas.
// ─────────────────────────────────────────────────────────────────────────
import type { HistoriaTexto } from "./culturaHistorias.en";

export const HISTORIA_MEDICINA_EN: HistoriaTexto = {
  // ── Prólogo ────────────────────────────────────────────────────────────
  prologo: {
    titulo: "What does being ill mean?",
    anio: "Before we talk about cultures",
    momentos: {
      "que-es-enfermedad": {
        titulo: "What is an illness?",
        fecha: "The question we've always asked",
        cuerpo: [
          "Explaining in your own words what being ill means looks easy, and it isn't. For centuries it was thought that illness was something that entered the body from outside: a spirit, a bad air, a divine punishment.",
          "Today we understand it differently. An illness is a disturbance in how the body or the mind works that breaks the balance we call health. Sometimes it's caused by a microbe, sometimes by an organ that fails, sometimes by our own habits and sometimes by emotions.",
          "The interesting part is that health isn't simply «not being ill». It's a state of dynamic balance: the body constantly adapts to cold, to effort, to hunger or to stress, and as long as it manages to get back to its centre, we stay healthy.",
          "Falling ill, at bottom, is losing that capacity to return to balance.",
        ],
        dato: "Fun fact: the World Health Organization defines health not as the absence of disease, but as a complete state of physical, mental and social wellbeing. A definition many ancient civilizations would have shared.",
      },
      "cuatro-tipos": {
        titulo: "The four kinds of illness",
        fecha: "A compass for understanding them",
        cuerpo: [
          "Not all illnesses are the same, and telling them apart helps enormously in understanding medicine. We can group almost everything into four broad kinds.",
          "Passing symptoms: mild, brief complaints, like a headache or a cold. The body usually sorts them out on its own.",
          "Acute illnesses: they appear suddenly, they're clear-cut and they can normally be cured, like an infection or appendicitis.",
          "Chronic illnesses: they settle in for years or for good, like diabetes or high blood pressure. They aren't always curable, but they can be controlled.",
          "And fatal illnesses: the ones that put life at risk and that have been, throughout history, medicine's great enemy.",
          "Almost the whole story you're about to travel through is, really, the story of how humanity learned to face each one of these four kinds.",
        ],
      },
      "tres-formas-curar": {
        titulo: "The three ways of healing",
        fecha: "The whole map",
        cuerpo: [
          "When someone gets better, what exactly was it that healed them?",
          "Throughout history, however different they may look, every medicine in the world has healed using only three broad paths.",
          "Physical healing: acting directly on the body. Setting a bone, stitching a wound, operating, applying heat or cold, massaging, moving. It's the medicine of the hands.",
          "Chemical healing: introducing a substance that changes what happens inside the body. A plant, a mineral, an antibiotic, a vaccine. It's the medicine of remedies.",
          "Psychological healing: acting on the mind, the emotions and the beliefs of the person who's ill. Confidence, hope, meaning, the relationship with whoever is healing you. It's the invisible medicine, and perhaps the oldest of all.",
          "The fascinating part is that no great culture used only one. And the most advanced medicine of today is rediscovering that all three together heal better than any of them alone.",
        ],
        dato: "Fun fact: for a long time science dismissed psychological healing as mere «suggestion». Today we know the placebo effect is so real that it has to be measured in every medical trial so it isn't mistaken for the drug's effect.",
      },
      "que-haces-tu": {
        titulo: "What do you do when you fall ill?",
        cuerpo: [
          "Before going on, stop a moment and look at yourself.",
          "When you notice something isn't right — a pain, a tiredness that won't go, a worry that won't let you sleep — what's the first thing you do?",
          "Do you look for a pill? Do you rest and wait? Do you change what you eat? Do you tell someone you trust? Do you ignore the signal and carry on?",
          "There's no right answer. But the way you respond says a lot about what kind of medicine you're carrying inside, almost without knowing it.",
          "Keep that answer. Over this journey you're going to discover that the shaman, Egypt, India, China, Greece and modern medicine each did, in their own way, exactly what you do when you fall ill. Only they turned it into wisdom.",
          "This isn't just a history course. It's a journey toward learning to look after yourself better.",
        ],
      },
    },
  },

  // ── El chamán ──────────────────────────────────────────────────────────
  chaman: {
    titulo: "The shaman",
    anio: "Prehistory",
    momentos: {
      "primeros-sanadores": {
        titulo: "The first healers",
        fecha: "More than 20,000 years ago",
        cuerpo: [
          "Long before cities, writing and science, every human culture had a similar figure: the shaman, the healer, the medicine man or woman. Someone who took care of the sick.",
          "They didn't separate body from spirit. For them, falling ill meant having lost your balance with the invisible world, so healing consisted of restoring that balance through rituals, songs, plants and ceremonies.",
          "However much pure superstition it may look to us, those healers built up astonishing knowledge about medicinal plants, learned through centuries of trial and error. Many of their remedies contained active compounds modern pharmacy still uses.",
          "And they did something we now know is real medicine: accompanying the sick person and giving them an explanation and a hope.",
        ],
        dato: "Fun fact: prehistoric skulls have been found with holes made on purpose — so-called trepanation — and with signs of having healed over. Which means the patient survived skull surgery thousands of years ago.",
      },
      "ritual-esperanza": {
        titulo: "Ritual and hope",
        fecha: "The first medicine",
        cuerpo: [
          "The shaman didn't just hand over a plant: they gave a ritual. They lit a fire, sang, called on forces, laid on hands. All of it created an intense experience loaded with meaning.",
          "Today we understand why it worked. The ritual turned the sick person's fear into hope, and hope changes what happens in the body: it relaxes, it reduces pain and it activates the defences.",
          "The sick person stopped feeling alone in front of something incomprehensible. Someone with authority and confidence was telling them: «I know what's happening to you and I know how to help». That message, on its own, already heals a part of it.",
          "Humanity's first great medicine wasn't a drug. It was getting a person to believe they could get better.",
        ],
      },
      placebo: {
        titulo: "The power of the mind: the placebo",
        fecha: "An eternal discovery",
        cuerpo: [
          "There's a phenomenon so real that modern science has to measure it in every one of its experiments: the placebo effect. When a person trusts that a treatment is going to work, their body genuinely improves, even if the treatment has no active ingredient at all.",
          "It isn't imagination or trickery: the brain releases substances that calm pain, reduce inflammation and lift mood. Belief turns into chemistry.",
          "The shaman, knowing nothing about neurons, commanded this power better than anyone. Their entire ritual was designed to maximize the sick person's confidence.",
          "That's why their medicine, so often dismissed as magic, contained a truth we're still using today: the mind is a pharmacy.",
        ],
        dato: "Fun fact: there's also the opposite, the nocebo effect: if someone believes something is going to harm them, they can come to feel real symptoms. The mind heals, but it can also make you ill.",
        extras: [
          {
            titulo: "How the placebo works (and what it can't do)",
            cuerpo: [
              "The placebo is the strongest evidence we have that mind and body aren't two separate things, and it's worth understanding properly, because it gets used as an excuse for two opposite mistakes: dismissing it («it's just suggestion») or exaggerating it («the mind cures everything»).",
              "WHAT ACTUALLY HAPPENS. It isn't imagination. When someone expects relief, the brain sets off measurable responses: it releases its own opioids and dopamine, changes the activity of the areas that process pain and alters heart rate and stress hormones. It's been seen on scanners, and it can be blocked: if someone who's responding to a placebo is given a drug that cancels internal opioids, the relief disappears. Which means there was a real chemical reaction.",
              "WHAT MAKES IT STRONGER. And here this part of the story shakes hands with the shaman's, because the ingredients are exactly the same: the ritual — that there's a procedure, a span of time, a gesture — the confidence of whoever is treating you, the attention devoted to you, an explanation that makes sense of what's happening, expectation and hope. A treatment given calmly and well explained works BETTER than the same treatment given in a hurry and without looking you in the face. That's been measured.",
              "THE ODD PART. It works even when the patient KNOWS it's a placebo, if the mechanism is explained to them: they're called open-label placebos and there are trials with good results in chronic pain and irritable bowel. And the packaging counts: big capsules work better than small ones, injections better than pills and branded ones better than an identical generic.",
              "ITS LIMITS, which are the important part. The placebo acts on SYMPTOMS — pain, nausea, fatigue, anxiety, insomnia, malaise — and not on the underlying disease. It doesn't shrink a tumour, it doesn't lower a diabetic's blood sugar, it doesn't close a fracture and it doesn't kill a bacterium. It can make someone with asthma say they're breathing better while their measured lung function is exactly as bad: they feel better and they're just as ill. And there's the real danger, and it's the most important argument in this whole journey: believing that feeling better is enough can lead someone to abandon the treatment they actually need.",
              "THE NOCEBO explains a lot of everyday things: reading the list of side effects increases the chance of noticing them, an alarmist comment from a professional can make a pain worse and a catastrophizing explanation can turn a complaint chronic. That's why doctors are now trained in how to deliver news: words are part of the treatment, and they can also be part of the harm.",
              "AND THE PRACTICAL CONCLUSION, which is the oldest and the most modern lesson at once: the placebo effect isn't a rival to medicine, it's a component of ALL medicine. The right pill given by someone who listens to you, explains things and stays with you is worth more than the same pill handed over without a glance. Shamans had been using it for twenty thousand years; science has taken a while to learn how to measure it.",
            ],
            dato: "Fun fact: clinical trials exist precisely because of this. Since every treatment drags its placebo effect along with it, the only way to know whether a drug really works is to compare it with a group receiving a copy with no active ingredient. The placebo is at once a healing phenomenon and the tool we use to avoid fooling ourselves.",
          },
        ],
      },
      "comunidad-vinculo": {
        titulo: "Community and the bond",
        fecha: "The healer and the patient",
        cuerpo: [
          "In ancient peoples, the sick person didn't get better alone in a room. They got better surrounded by their community, which took part in the ritual, kept them company and held them up.",
          "That support had a powerful effect. Feeling loved, accompanied and part of a group reduces stress and strengthens the body's capacity to recover. Loneliness, by contrast, makes you ill.",
          "And at the centre was the relationship between healer and patient: a relationship of absolute trust. The sick person handed themselves over to someone who looked at them, listened to them and took care of the whole of them.",
          "Thousands of years later, the studies confirm the same thing: the quality of the relationship between doctor and patient directly influences the results of treatment.",
        ],
      },
      "chaman-aplicalo": {
        titulo: "Apply it to your life",
        cuerpo: [
          "The shaman teaches you the power of the mind.",
          "Where they were wrong: they believed illness came from spirits and punishments, not from natural causes. They had no way of telling which remedies actually worked.",
          "What still holds: that hope, confidence, being accompanied and having meaning are a real part of healing. Not an ornament, but an active ingredient.",
          "Your exercise: next time you feel unwell, notice your mental state. Are you talking to yourself with fear and catastrophe, or with calm and confidence? That inner voice is your own shaman. Learn to get it playing on your side.",
          "Surround yourself with your «community» too: don't go through the hard things alone. Asking for help isn't weakness, it's ancient medicine.",
        ],
      },
    },
  },

  // ── Egipto: observar la naturaleza ─────────────────────────────────────
  egipto: {
    titulo: "Egypt: observing nature",
    anio: "≈3000–500 BC",
    momentos: {
      imhotep: {
        titulo: "Imhotep",
        fecha: "≈2650 BC",
        cuerpo: [
          "Imhotep was an architect, a priest and a doctor in the pharaoh's service. He designed one of the first pyramids, but he went down in history above all for his fame as a healer.",
          "He's considered one of the first doctors in history with a name of his own. He treated illnesses by observing symptoms and applying remedies, mixing practical knowledge with religion.",
          "His prestige was so enormous that centuries after his death the Egyptians turned him into a god of medicine. A human being raised to divinity for his ability to heal.",
          "With Imhotep a new idea appears: the doctor as a respected, wise figure, admired by society.",
        ],
        dato: "Fun fact: the Greeks, centuries later, identified Imhotep with their own god of medicine, Asclepius. Two cultures agreed on making the art of healing divine.",
      },
      "papiros-medicos": {
        titulo: "The medical papyri",
        fecha: "≈1600 BC",
        cuerpo: [
          "The Egyptians left the first medical treatises in history, written on papyrus. In them they described illnesses, symptoms and treatments with surprising order.",
          "The most famous, the Edwin Smith papyrus, describes cases of wounds and fractures one by one: what's observed, what diagnosis fits and whether there's a treatment, or whether it's better not to intervene.",
          "For the first time, medical knowledge stopped depending on one healer's memory and became something that could be stored, copied, taught and corrected.",
          "Writing medicine down was as important as practising it: it let each generation start where the previous one left off, instead of beginning from scratch.",
        ],
        dato: "Fun fact: in some cases, the Edwin Smith papyrus concludes with an astonishingly modern phrase: «an ailment not to be treated». That is, they already recognized medicine's limits and the honesty of doing no harm.",
      },
      "higiene-dieta": {
        titulo: "Hygiene and diet",
        fecha: "Everyday care",
        cuerpo: [
          "The Egyptians gave enormous importance to cleanliness. They washed often, looked after their water, paid attention to food and observed the body in detail.",
          "They understood, intuitively, that many illnesses had to do with daily life: what you eat, what you drink, cleanliness, rest.",
          "That everyday care — what we'd call prevention today — is one of their great lessons. They didn't wait until they were ill: they tried not to fall ill.",
          "They were one of the first peoples to grasp that health is built every day, and not only repaired once it's broken.",
        ],
      },
      especializacion: {
        titulo: "The first specialists",
        fecha: "Doctors by organ",
        cuerpo: [
          "Egypt came to have specialized doctors. There were those who dealt with the eyes, others with the belly, others with the teeth.",
          "The Greek historian Herodotus, on visiting Egypt, was impressed: he reported that each doctor devoted himself to a single illness, so that the country was «full of doctors».",
          "That specialization, more than three thousand years ago, anticipates the way medicine works today, with ophthalmologists, cardiologists or dentists.",
          "They recognized something profound: the human body is so complex that it's best looked at in parts… although, as we'll see, one day it will have to be looked at whole again.",
        ],
      },
      "egipto-aplicalo": {
        titulo: "Apply it to your life",
        cuerpo: [
          "Egypt teaches you the power of observation.",
          "Where they were wrong: they still mixed medicine with magic spells, and many of their remedies were ineffective or harmful.",
          "What still holds: observing attentively, writing down what happens, preventing through hygiene and diet, and looking after yourself every day before falling ill.",
          "Your exercise: start observing your body the way the Egyptians observed nature. How do you sleep? How's your digestion? What gives you energy and what takes it away?",
          "For a week, note down how you feel each day. You'll see patterns you'd never noticed. Knowing yourself is the first diagnosis.",
        ],
      },
    },
  },

  // ── India: el equilibrio ───────────────────────────────────────────────
  india: {
    titulo: "India: balance",
    anio: "≈1500 BC onward",
    momentos: {
      charaka: {
        titulo: "Charaka",
        fecha: "≈2nd century BC",
        cuerpo: [
          "Charaka is one of the great figures of Ayurveda. His treatise, the Charaka Samhita, is one of the most important medical texts of ancient India.",
          "He put the emphasis on prevention, diet, lifestyle and balance. For him, a good doctor wasn't only one who cured, but one who helped you not fall ill.",
          "He described hundreds of illnesses, medicinal plants and treatments, with a view of the body as a system constantly seeking balance.",
          "He also reflected on the doctor's ethics and on the importance of mind and emotions in health, long before the West did.",
        ],
      },
      sushruta: {
        titulo: "Sushruta",
        fecha: "≈6th century BC",
        cuerpo: [
          "Sushruta is considered one of the fathers of surgery. His treatise describes more than three hundred operations and dozens of surgical instruments.",
          "He performed procedures astonishing for his time: removing stones, treating fractures and even reconstructive surgery of the nose, a pioneering technique still talked about in the history of medicine.",
          "He insisted on practice: students learned to cut and stitch on fruit, vegetables and models before touching a patient.",
          "His work shows that physical healing — the medicine of the hands — reached an extraordinary level in India.",
        ],
        dato: "Fun fact: the nose reconstruction technique Sushruta described inspired European surgeons centuries later. He's considered a forerunner of plastic surgery.",
      },
      doshas: {
        titulo: "The doshas and your constitution",
        fecha: "The heart of Ayurveda",
        cuerpo: [
          "Ayurveda starts from a brilliant idea: we aren't all the same. Every person has a constitution of their own, their prakriti, made up of the combination of three energies or doshas: Vata, Pitta and Kapha.",
          "Vata relates to movement; Pitta to transformation and fire; Kapha to structure and calm. We all have all three, but in different proportions, and that shapes our body, our character and our tendencies to fall ill.",
          "Health, according to Ayurveda, is keeping your particular balance. Illness is when that balance breaks.",
          "That's why treatment is personalized: the food, the exercise and the pace of life that heal one person can throw another off balance.",
        ],
        dato: "Fun fact: this very ancient idea is remarkably close to what we now call personalized medicine, which sets out to adapt treatment to each patient's unique characteristics.",
      },
      "cinco-elementos-yoga": {
        titulo: "Five elements and yoga",
        fecha: "Body, mind and surroundings",
        cuerpo: [
          "Ayurveda holds that everything — the body and nature — is made of five elements: earth, water, fire, air and space. The doshas arise from the combination of those elements.",
          "This connects human beings with their surroundings: the seasons, food, the climate and the rhythms of nature all influence our inner balance.",
          "Alongside medicine, India developed yoga: a system for caring for body and mind at once through movement, breathing and attention.",
          "Body, mind and surroundings weren't separate worlds but one and the same fabric. Caring for one was caring for all three.",
        ],
      },
      "india-aplicalo": {
        titulo: "Apply it to your life",
        cuerpo: [
          "India teaches you the power of balance.",
          "Where it was wrong: some of its explanations of the body don't match modern biology, and not all its remedies work.",
          "What still holds: that every person is different, that health is balance and that body, mind and surroundings form a whole. Preventing by living well weighs more than curing.",
          "Your exercise: ask yourself what your constitution seems to be. Are you more restless and changeable (Vata), more intense and hot (Pitta), or calmer and steadier (Kapha)?",
          "Not to label yourself, but to know yourself. What throws you in particular off balance? What brings you back to your centre? That's where your personal medicine is.",
        ],
      },
    },
  },

  // ── China: la energía ──────────────────────────────────────────────────
  china: {
    titulo: "China: energy",
    anio: "≈2000 BC onward",
    momentos: {
      "huangdi-neijing": {
        titulo: "The Huangdi Neijing",
        fecha: "≈3rd–2nd century BC",
        cuerpo: [
          "The Huangdi Neijing, or «Yellow Emperor's Inner Classic», is the founding text of traditional Chinese medicine. It's written as a dialogue between the emperor and his physician.",
          "In it are explained the great ideas of this medicine: Qi, Yin-Yang, the five elements and the circulation of energy through the body.",
          "What's notable is its emphasis: the best doctor isn't the one who cures advanced disease, but the one who prevents it before it appears. Curing once it's declared, it said, is like digging a well when you're already thirsty.",
          "This book guided Chinese medicine for more than two millennia and is still studied today.",
        ],
      },
      "qi-yinyang": {
        titulo: "Qi and Yin-Yang",
        fecha: "Energy and its opposites",
        cuerpo: [
          "For Chinese medicine, everything alive is animated by Qi, a vital energy circulating through the body. When Qi flows freely and in the right amount, there's health; when it's blocked or weakened, illness appears.",
          "That flow is governed by two opposite, complementary forces: Yin and Yang. Cold and heat, rest and activity, dark and bright. Neither is good or bad; health lies in their balance.",
          "Falling ill meant having too much of one and too little of the other. Healing meant restoring the proportion.",
          "It's a different way of thinking about the body: not as isolated organs, but as a dynamic balance of forces.",
        ],
        dato: "Fun fact: the famous Yin-Yang symbol has a dot of the opposite colour in each half. It means that inside each force lives the seed of its opposite: nothing is pure or absolute.",
      },
      "meridianos-acupuntura": {
        titulo: "Meridians and acupuncture",
        fecha: "The medicine of needles",
        cuerpo: [
          "Chinese medicine described a network of channels called meridians through which Qi circulates. Along them are specific points where you can act on that energy.",
          "Acupuncture consists of inserting very fine needles at those points to unblock, strengthen or rebalance the flow. Alongside it they used plants, massage, diet and breathing and movement exercises.",
          "Although the meridians don't match what Western anatomy sees, acupuncture produces real effects that are studied scientifically today, especially in pain relief.",
          "It was an extraordinarily sophisticated medicine, with thousands of years of clinical observation behind it.",
        ],
        dato: "Fun fact: acupuncture is now one of the most widespread traditional medicines on the planet and is practised, alongside modern medicine, in hospitals all over the world.",
      },
      "cinco-elementos-chinos": {
        titulo: "The five elements",
        fecha: "Everything is connected",
        cuerpo: [
          "Chinese medicine organizes the world into five elements: wood, fire, earth, metal and water. Each is associated with an organ, a season, an emotion, a flavour and a colour.",
          "These elements aren't isolated: they feed and control each other in a constant cycle. An imbalance in one has repercussions in the others.",
          "So a sustained emotion — like anger or fear — could affect an organ, and a weak organ could alter your mood. Body and emotions were inseparable.",
          "It's a deeply ecological view of the human being: nothing happens on its own, everything is in relation.",
        ],
      },
      "china-aplicalo": {
        titulo: "Apply it to your life",
        cuerpo: [
          "China teaches you that it isn't all structure: there's rhythm too.",
          "Where it was wrong: its model of energy and meridians doesn't describe real anatomy, and many of its explanations don't survive scientific testing.",
          "What still holds: looking at the body as a connected whole, preventing rather than curing, and understanding that emotions, rest and activity have their own rhythm and balance.",
          "Your exercise: watch your rhythms. Do you respect the balance between activity (Yang) and rest (Yin), or do you live permanently at speed? Do you listen when your body asks you to stop?",
          "Health, the Chinese said, isn't in maximum effort but in balanced flow. Go looking for yours.",
        ],
      },
    },
  },

  // ── Grecia: nace la medicina racional ──────────────────────────────────
  grecia: {
    titulo: "Greece: rational medicine is born",
    anio: "≈5th century BC",
    momentos: {
      hipocrates: {
        titulo: "Hippocrates",
        fecha: "≈460–370 BC",
        cuerpo: [
          "Hippocrates is considered the father of Western medicine. His great contribution was radical: stating that illnesses have natural causes, not supernatural ones.",
          "Until then, even epilepsy was called «the sacred disease». Hippocrates said there was nothing divine about it: it was an illness like any other, with causes in the body.",
          "He taught people to observe the patient closely: their symptoms, their progress, their surroundings. And to trust the body's own capacity to heal, helping it along with diet, rest and healthy habits.",
          "He also placed the doctor at the centre of a moral responsibility, summed up in a principle that's still alive: first, do no harm.",
        ],
        dato: "Fun fact: the Hippocratic oath, which commits the doctor to act for the patient's good, still shapes medical ethics more than two thousand years later.",
      },
      "cuatro-humores": {
        titulo: "The theory of the four humours",
        fecha: "The model that lasted centuries",
        cuerpo: [
          "The Greeks thought the body contained four humours or fluids: blood, phlegm, yellow bile and black bile. Health was their balance; illness, their disarray.",
          "Each humour was associated with an element, a season and a temperament. That's where words we still use come from: sanguine, phlegmatic, choleric, melancholic.",
          "Treatment aimed to rebalance the humours through diet, exercise or, sometimes, practices like bloodletting.",
          "The theory was wrong, but it had an enormous virtue: it looked for a natural explanation and an internal balance, not the will of the gods. It would dominate Western medicine for almost two thousand years.",
        ],
        extras: [
          {
            titulo: "Why a false theory lasted two thousand years",
            cuerpo: [
              "This is one of the most useful questions in the whole journey, because it isn't only about the past: it's about how we get things wrong.",
              "FIRST, because it explained EVERYTHING. Any symptom could be read as an excess or shortage of one of the four humours, and any turn the patient took confirmed the diagnosis. A theory that fits any possible result looks very powerful and is actually the worst symptom an idea can have: it can't be checked and it can't be refuted.",
              "SECOND, because it was coherent and elegant. Four humours, four elements, four seasons, four ages of life, four temperaments. Everything fitted with everything, and that intellectual beauty is enormously persuasive. The history of science is full of beautiful false theories.",
              "THIRD, authority. Galen systematized it so well that for centuries medicine consisted of commenting on Galen. Arguing with him wasn't a scientific debate, it was disrespect, and anyone who tried risked their career — which is exactly what happened to Vesalius and to Harvey centuries later.",
              "FOURTH, and this is the key point: NOBODY COUNTED. There was no habit of comparing two groups of patients, one treated and one not, and seeing what happened. With no comparison and no numbers, the doctor had only his memories, and memory is a treacherous instrument: you remember the cases that recovered and explain away the ones who died («he was very weak», «she came too late», «it was his time»). Looked at that way, any treatment seems to work.",
              "AND NOW THE HARSH PART: BLOODLETTING. Out of that theory came the most practised treatment in the history of Western medicine. If illness was an excess of blood, it had to be let out, and it was done for more than two thousand years, with lancets or with leeches, for fever, headache, pneumonia, madness, a difficult pregnancy and almost anything else.",
              "In most cases it was useless, and in many, fatal, because it weakened precisely the person who most needed their strength. The most famous case is George Washington's: in 1799, with a throat infection, his doctors drew about two and a half litres of blood from him in a few hours. He died that same night.",
              "And the lesson it leaves isn't that those doctors were stupid or cruel: they were intelligent, careful and convinced they were helping. What failed was the METHOD, not the intention. That's why the next chapter of this story — the scientific method and the comparative trial — is the most important of all: it didn't bring a new remedy, it brought a way of knowing whether a remedy works.",
              "And a warning for today: the theory of the humours also had its version of «therapies that work because they've been used for centuries». A treatment's antiquity says nothing about whether it's effective; it only says people have believed in it for a long time.",
            ],
            dato: "Fun fact: not all of it was false. What survives from that tradition intact is the best of it: the idea that health is a dynamic balance, the importance of diet, sleep, exercise and environment, and the habit of observing the whole patient. Even the emotional vocabulary we use — being phlegmatic, being in a bad humour, being bilious, being melancholy — comes from there.",
          },
        ],
      },
      "observacion-clinica": {
        titulo: "Clinical observation",
        fecha: "Look at the sick person, not just the disease",
        cuerpo: [
          "The Hippocratic school developed something essential: clinical observation. Doctors carefully noted down how each patient progressed day by day.",
          "They learned to recognize the signs of an illness, to foresee its course and to tell serious cases from mild ones. That attentive follow-up is the basis of medicine to this day.",
          "They also grasped the power of the body's healing nature: very often, the best medicine was helping the organism recover by itself, without getting in the way.",
          "The doctor stopped being a magician and became a patient, honest observer of reality.",
        ],
      },
      "herofilo-erasistrato": {
        titulo: "Herophilus and Erasistratus",
        fecha: "≈3rd century BC",
        cuerpo: [
          "In the city of Alexandria, in Greek Egypt, something exceptional happened: for a time, studying the inside of the human body was permitted. Herophilus and Erasistratus worked there, antiquity's great anatomists.",
          "Herophilus studied the brain and identified it — not the heart — as the centre of thought and of the nerves. He distinguished nerves from tendons and described the eye, the liver and the digestive system in unprecedented detail.",
          "Erasistratus investigated the heart and the blood vessels, and came remarkably close to understanding how blood circulated, almost two thousand years before it was fully proved.",
          "They were the summit of ancient anatomy. Afterward, dissecting human bodies was banned again for centuries, and that valuable knowledge stayed almost frozen until the Renaissance.",
        ],
        dato: "Fun fact: the famous Library of Alexandria didn't only store books: a community of scholars flourished around it that made the city the greatest scientific centre of the ancient world.",
      },
      "grecia-aplicalo": {
        titulo: "Apply it to your life",
        cuerpo: [
          "Greece teaches you the power of reason.",
          "Where they were wrong: the theory of the humours was false, and some treatments, like bloodletting, did more harm than good for centuries.",
          "What still holds: looking for natural causes, observing honestly, trusting the body's capacity to heal and being guided by an ethics that puts the patient first.",
          "Your exercise: ask yourself which habits build your health. The Greeks knew that diet, exercise, sleep and moderation healed more than almost any remedy.",
          "Pick just one habit you know does you good and that you neglect. Start there. Reason isn't much use unless it turns into action.",
        ],
      },
    },
  },

  // ── Galeno y Roma: ordenar el cuerpo ───────────────────────────────────
  "galeno-roma": {
    titulo: "Galen and Rome: putting the body in order",
    anio: "≈2nd century AD",
    momentos: {
      galeno: {
        titulo: "Galen",
        fecha: "≈129–216 AD",
        cuerpo: [
          "Galen was doctor to gladiators and to emperors. Treating wounds from the arena he learned a great deal about the human body, and he devoted his life to studying it and writing about it.",
          "He gathered and ordered all the medical knowledge of his time into a gigantic system covering anatomy, physiology and treatment. It was monumental work.",
          "He studied movement, the nerves and the function of many organs, and showed by experiment, for instance, that arteries carry blood and not air, as was believed.",
          "His authority was so overwhelming that for centuries questioning him was considered almost heresy.",
        ],
      },
      "anatomia-organos": {
        titulo: "Anatomy and the function of organs",
        fecha: "Understanding the machine",
        cuerpo: [
          "Galen wanted to know how organs work, not just what they look like. He asked what each part of the body was for, a very modern approach.",
          "But he had an enormous problem: in his day dissecting human corpses was forbidden. So he mainly studied animals — monkeys and pigs — and carried his conclusions over to human beings.",
          "That led him to some notable successes, but also to important mistakes, because the human body isn't identical to an animal's.",
          "Even so, his idea of studying the function of each organ set the course for all later physiology.",
        ],
      },
      "roma-salud-publica": {
        titulo: "Rome and public health",
        fecha: "Curing a whole people",
        cuerpo: [
          "Rome stood out less for its theories than for its enormous practical capacity. It built aqueducts to bring clean water, sewers to take waste away and public baths everywhere.",
          "Those works saved more lives than many treatments, because they prevented disease on a large scale. It was an early form of public health.",
          "The Romans also created military hospitals to care for their soldiers, forerunners of the hospitals we know today.",
          "They grasped something we sometimes forget: a person's health depends to a great extent on the conditions they live in.",
        ],
        dato: "Fun fact: it's reckoned that the clean water of the aqueducts and Roman sanitation did more for the population's health than all the remedies of the age put together.",
      },
      "error-1500-anios": {
        titulo: "The mistake that lasted 1,500 years",
        cuerpo: [
          "Even geniuses can be wrong for centuries.",
          "Galen's system was so complete and so respected that for almost fifteen hundred years hardly anyone dared correct it. It was studied as absolute truth.",
          "The problem is that it contained errors, mainly from having studied animals instead of humans. And since nobody questioned it, those errors were repeated generation after generation.",
          "Here appears one of the great lessons in the history of medicine: when an authority becomes untouchable, knowledge stops moving forward.",
          "Progress would only return when someone finally dared to look at the body with their own eyes instead of repeating what the books said.",
          "Your exercise: ask yourself how many things you take as true only because «that's what's always been said». Questioning, respectfully and with evidence, is also a way of looking after your health.",
        ],
      },
    },
  },

  // ── El mundo islámico ──────────────────────────────────────────────────
  islam: {
    titulo: "The Islamic world",
    anio: "≈8th–13th centuries",
    momentos: {
      avicena: {
        titulo: "Avicenna",
        fecha: "980–1037",
        cuerpo: [
          "Avicenna (Ibn Sina) was a doctor, a scientist and a philosopher, one of the greatest geniuses in history. He wrote the Canon of Medicine, an enormous work gathering and ordering all the medical knowledge of his time.",
          "The Canon was so clear and complete that it became the textbook of the universities, Islamic and European alike, for more than six hundred years.",
          "In it he described hundreds of illnesses and treatments, insisted on clinical observation and grasped the importance of diet, exercise and emotions in health.",
          "He even sensed that some illnesses could be transmitted through water or air, anticipating the idea of contagion by centuries.",
        ],
        dato: "Fun fact: Avicenna's Canon was still in use in some European medical faculties into the 17th century. Few books have taught so many generations of doctors.",
      },
      rhazes: {
        titulo: "Rhazes",
        fecha: "≈865–925",
        cuerpo: [
          "Rhazes (Al-Razi) was a brilliant and very observant doctor. His greatest achievement was describing precisely illnesses that until then were confused with each other.",
          "He was the first to distinguish smallpox clearly from measles, describing their symptoms in astonishing detail. That kind of careful observation is the basis of diagnosis.",
          "He argued that a doctor should rely on experience and facts, not only on the authority of ancient books. If observation contradicted a master, you should trust the observation.",
          "He also wrote about the importance of the relationship with the patient and of never losing hope of recovery.",
        ],
      },
      abulcasis: {
        titulo: "Abulcasis",
        fecha: "936–1013",
        cuerpo: [
          "Abulcasis (Al-Zahrawi) lived in Córdoba and is considered the greatest surgeon of the medieval world. He devoted his life to turning surgery into a serious, careful discipline that could be taught.",
          "He wrote an enormous medical encyclopedia whose last part, devoted to surgery, included drawings of more than two hundred surgical instruments, many invented or improved by him. It was the first illustrated treatise on surgery in history.",
          "He described how to cauterize wounds, remove stones, treat fractures and close wounds with sutures, and insisted on knowing anatomy well and treating the patient gently.",
          "His work was translated into Latin and studied in European universities for more than five hundred years, making him the great master of Western surgery.",
        ],
        dato: "Fun fact: some of the instruments Abulcasis drew more than a thousand years ago — forceps, scalpels, clamps — look astonishingly like the ones still used in operating theatres today.",
      },
      maimonides: {
        titulo: "Maimonides",
        fecha: "1138–1204",
        cuerpo: [
          "Maimonides was born in Córdoba, at the height of Al-Andalus's golden age. A Jewish philosopher, doctor and scholar, he had to flee persecution and ended up practising as a doctor at the court of Egypt, in the circle of Sultan Saladin.",
          "He wrote several medical treatises that were studied for centuries. In them he insisted, long before almost anyone else, on prevention: a moderate diet, exercise, rest and balance as the basis of health.",
          "He also understood that body and mind are inseparable. He advised looking after the sick person's spirits, avoiding excessive passions and seeking serenity, because emotions directly affect the health of the body.",
          "So he joined the best science of his time to a deep humanity and a demanding ethics toward the sick. He's one of the few figures admired at once by doctors, philosophers and believers of three religions.",
        ],
        dato: "Fun fact: a «physician's prayer» asking for humility, prudence and love for the sick is attributed to Maimonides. Even if he didn't write it, it sums up the spirit of his medicine perfectly.",
      },
      averroes: {
        titulo: "Averroes",
        fecha: "1126–1198",
        cuerpo: [
          "Averroes (Ibn Rushd) was born in Córdoba, the same city as Maimonides, during the height of Al-Andalus. Today he's remembered mainly as a philosopher — the great commentator on Aristotle — but he was also a distinguished doctor.",
          "He wrote a general medical treatise, the Kulliyat («Generalities»), which set out to order all the medicine of his time into a clear, reasoned system, and which was translated and studied in Europe for centuries.",
          "He argued that medicine and philosophy needed each other: understanding the body required understanding nature, and healing well required reasoning well. For him, observing and thinking were inseparable.",
          "His enormous intellectual influence helped Greek learning, carefully commented on, return to the European universities and revive curiosity about the human body.",
        ],
        dato: "Fun fact: in medieval Europe Averroes was called simply «the Commentator», because of the quality of his explanations of Aristotle. His medicine travelled attached to his philosophy.",
      },
      hospitales: {
        titulo: "The first hospitals",
        fecha: "The bimaristan",
        cuerpo: [
          "The Islamic world created the bimaristans, advanced hospitals that treated the sick regardless of their religion, their origin or their money.",
          "They were surprisingly modern institutions: they had wards separated by illness, doctors on duty, a pharmacy, a library and spaces for teaching future doctors.",
          "Some included wards devoted to mental health, treating patients with dignity at a time when elsewhere they were abandoned.",
          "It was the birth of the hospital as we understand it today: a place of care, teaching and research all at once.",
        ],
        dato: "Fun fact: in some bimaristans, when a patient recovered and had no means, they were given a sum of money so they could convalesce without having to go straight back to work.",
      },
      "metodo-humanismo": {
        titulo: "Clinical method and humanism",
        fecha: "A doctor treats people",
        cuerpo: [
          "Islamic doctors developed a rigorous clinical method: observe the symptoms, question the patient, follow the progress and record the results. Many kept case histories.",
          "But alongside the rigour they cultivated a deep humanity. They insisted on treating the sick person with compassion, listening to them and respecting them as a person.",
          "They understood that mood, trust and the way you're treated influence recovery, joining Greek reason to care for the whole human being.",
          "From them comes one of the most valuable lessons in the whole history of medicine: you never treat an illness in the abstract, you always treat a particular person.",
        ],
      },
      "islam-aplicalo": {
        titulo: "Apply it to your life",
        cuerpo: [
          "The Islamic world teaches you the power of clinical compassion.",
          "Where they were wrong: they still leaned on the theory of the humours and on many ineffective remedies inherited from antiquity.",
          "What still holds: the rigour of observing and recording, the idea of the hospital as a place of care for everyone, and humane, compassionate treatment of the sick.",
          "Your exercise: when you care for someone who's suffering — or when you look after yourself — remember that behind a symptom there's always a person with fear, a history and emotions.",
          "Listening, staying with someone and treating them with dignity isn't an extra: it's part of the cure. Practise it with whoever is near you.",
        ],
      },
    },
  },

  // ── Renacimiento: mirar dentro ─────────────────────────────────────────
  renacimiento: {
    titulo: "The Renaissance: looking inside",
    anio: "16th–17th centuries",
    momentos: {
      paracelso: {
        titulo: "Paracelsus",
        fecha: "1493–1541",
        cuerpo: [
          "Paracelsus was a rebellious, nonconformist doctor. He went so far as to burn the books of Galen and Avicenna in public to make clear that medicine couldn't go on living by repeating the ancients.",
          "He argued for learning from direct observation, from nature and from experience with the sick. He travelled tirelessly, gathering knowledge from doctors, surgeons and even folk healers.",
          "He pioneered the use of chemical and mineral substances as remedies, opening the way to modern pharmacology. He still mixed science, alchemy and mysticism, but he pushed medicine toward the experimental.",
          "His most famous idea is still the basis of pharmacology: any substance can heal or poison depending on the amount.",
        ],
        dato: "Fun fact: Paracelsus's line «the dose makes the poison» means that even water can be harmful in excess, and that even a poison can be medicine at the right dose.",
      },
      vesalio: {
        titulo: "Vesalius",
        fecha: "1514–1564",
        cuerpo: [
          "Andreas Vesalius did something hardly anyone had dared to do: dissect human bodies with his own hands and draw what he actually saw.",
          "He discovered that Galen had been wrong on many points, because he'd studied animals. Vesalius corrected those errors on the basis of direct observation of the human body.",
          "In 1543 he published a treatise on anatomy with extraordinarily precise and beautiful illustrations that revolutionized the study of the body.",
          "His message was clear: trust what you observe, even when it contradicts the greatest authorities of the past.",
        ],
        dato: "Fun fact: Vesalius's work was published the same year as Copernicus's on the movement of the Earth. 1543 is usually considered the year the scientific revolution began.",
      },
      harvey: {
        titulo: "William Harvey",
        fecha: "1578–1657",
        cuerpo: [
          "Following Galen, it was believed that the liver manufactured blood continuously and that the body used it up. Harvey showed that was impossible.",
          "He measured how much blood the heart pumps and calculated that if it were used up, the body would have to produce impossible quantities every hour. The only explanation was that the same blood circulated round and round.",
          "So he discovered the circulation of the blood: the heart is a pump driving blood round a closed circuit through the arteries and veins.",
          "It was a triumph of the scientific method: observe, measure, reason and prove, instead of repeating what the ancients said.",
        ],
      },
      "hooke-microscopio": {
        titulo: "Hooke and the microscope",
        fecha: "1665",
        cuerpo: [
          "The microscope opened a completely new world. Robert Hooke pointed one at a piece of cork and saw it was made of small cavities, which he called cells.",
          "It was the first time anyone had seen the basic unit of life, though he still didn't fully grasp its importance.",
          "The instrument showed that reality was far richer and more complex than the senses could take in on their own.",
          "Medicine began to sense that the body's great secrets lay in the very small, in an invisible world still to be explored.",
        ],
      },
      leeuwenhoek: {
        titulo: "Leeuwenhoek",
        fecha: "1632–1723",
        cuerpo: [
          "Antonie van Leeuwenhoek made lenses of astonishing quality. With them he looked at a drop of water and was stunned: it was full of tiny beings moving about.",
          "He called them «animalcules». He had discovered microorganisms: bacteria and other invisible beings that live everywhere, including inside us.",
          "At the time nobody imagined that those minuscule beings could cause disease. That link would take almost two centuries to establish.",
          "But the discovery was a decisive seed: for the first time, humanity was looking at the future protagonists of one of medicine's greatest revolutions.",
        ],
        dato: "Fun fact: Leeuwenhoek wasn't a doctor or a scientist by trade, but a cloth merchant. His passion for lenses made him, without his meaning it, the discoverer of the microscopic world.",
      },
      "renacimiento-aplicalo": {
        titulo: "Apply it to your life",
        cuerpo: [
          "The Renaissance teaches you to move from believing to looking.",
          "Where they were wrong: they still didn't understand the role of cells or microbes, and many treatments remained useless.",
          "What still holds: the attitude of checking for yourself, measuring, observing reality and not taking anything as true just because an authority says so.",
          "Your exercise: apply that gaze to your own health. Instead of believing what «people say» suits you, observe what happens to you when you sleep well, when you eat a certain way, when you move.",
          "Become the Vesalius of your own body: look inside, honestly and without prejudice.",
        ],
      },
    },
  },

  // ── La revolución científica ───────────────────────────────────────────
  "revolucion-cientifica": {
    titulo: "The scientific revolution",
    anio: "17th–18th centuries",
    momentos: {
      bacon: {
        titulo: "Francis Bacon",
        fecha: "1561–1626",
        cuerpo: [
          "Francis Bacon criticized people who built great theories without observing reality. For him, true knowledge had to be born of experience and experiment.",
          "He proposed gathering a lot of data, comparing it and drawing general conclusions from it, checking them again and again. It's what we now call the inductive method.",
          "He insisted on something essential: you have to distrust your own preconceived ideas, because we tend to see what we want to see.",
          "His way of thinking laid the foundations of experimental science, including the medicine that learns by observing and testing.",
        ],
      },
      descartes: {
        titulo: "René Descartes",
        fecha: "1596–1650",
        cuerpo: [
          "Descartes was looking for an absolutely secure basis for knowledge. He decided to doubt everything that could be false, until he found something indubitable.",
          "He reached one certainty: however much I doubt everything, I can't doubt that I'm thinking. «I think, therefore I am».",
          "He applied an influential idea to science: understanding the body as a kind of machine working by laws that can be studied and understood.",
          "That view helped enormously in studying the body methodically, though, as we'll see, it carried a risk: forgetting that a human being is far more than a machine.",
        ],
        dato: "Fun fact: the idea of the body as a machine drove scientific medicine, but it also separated body from mind for centuries, a division today's medicine is trying to put back together.",
      },
      "metodo-cientifico": {
        titulo: "The scientific method",
        fecha: "The great tool",
        cuerpo: [
          "The great achievement of this era was the scientific method: an orderly way of looking for truth. You observe a phenomenon, propose a hypothesis, design an experiment and check the result.",
          "The essential part is that anyone can repeat the experiment and see whether they get the same thing. Truth stops depending on a person's authority and starts depending on evidence.",
          "For medicine, this was revolutionary. At last there'd be a way of knowing whether a treatment really heals or only seems to by chance or by suggestion.",
          "On this method would be built, in time, the evidence-based medicine that saves millions of lives today.",
        ],
        extras: [
          {
            titulo: "The clinical trial: the invention that separates what heals from what doesn't",
            cuerpo: [
              "This is probably the most important invention in the history of medicine, and it isn't a device or a drug: it's a way of comparing.",
              "THE FIRST ONE. In 1747, the Scottish naval doctor James Lind was facing scurvy, which killed more sailors than combat and storms put together. He took twelve patients in similar condition, split them into six pairs and gave each pair a different treatment: cider, vinegar, sea water, an elixir, a spice paste… and to two of them, oranges and lemons. The citrus pair recovered in less than a week. It was one of the first comparative trials in history, with groups, the same conditions and a measured result.",
              "And watch what happened next, because it's very instructive: the British Navy took about forty years to apply it systematically. Having the evidence isn't enough; you have to convince an institution.",
              "HOW IT'S DONE TODAY, and it's worth knowing because it's what lies behind every medicine you take:",
              "1. TWO GROUPS. One gets the treatment and one gets a placebo or the best available treatment. Without a comparison group you know nothing, because a great many complaints get better on their own and because simply being cared for improves symptoms.",
              "2. AT RANDOM. Who goes into each group is decided by lot. This matters more than it seems: if the doctor chose, they'd tend — without meaning to — to put the patients with the best prognosis into the new treatment group. Chance spreads out evenly everything we don't know about.",
              "3. BLINDED. The patient doesn't know what they were given, and in a double-blind trial neither does whoever assesses them. Because expectations change what you feel and also what you observe: a convinced doctor reads their patient's improvement more optimistically.",
              "4. ENOUGH PEOPLE. With ten patients any result could be a coincidence; you need hundreds or thousands to tell a real effect from a fluke. That's what statistics is for.",
              "5. PUBLISH EVERYTHING, bad results included, and say BEFORE starting what's going to be measured, so the target can't be moved when the numbers don't come out as hoped.",
              "THE FINAL LEAP came in the seventies and nineties, with what was called evidence-based medicine: instead of relying on each doctor's personal experience, gather ALL the trials done on a question, weigh their quality and draw a combined conclusion. That's how it was discovered that treatments used for decades were useless, and that other very cheap ones saved a great many lives.",
              "AND IT'S A TOOL YOU CAN USE YOURSELF. Faced with any treatment, therapy or supplement, three questions clear up almost everything: has it been compared with a group that wasn't taking it? Has it been checked by people independent of whoever sells it? And what specific result would make the person recommending it admit it doesn't work? If there's no answer to any of them, you aren't looking at evidence: you're looking at a belief.",
            ],
            dato: "Fun fact: the biggest problem today isn't a shortage of trials, it's publication bias. For years, studies with positive results were published far more than negative ones, so a drug could look effective purely because the failed trials stayed in a drawer. Today registering trials before they start is compulsory, precisely so they can't disappear.",
          },
        ],
      },
      sesgos: {
        titulo: "Biases: how we fool ourselves",
        fecha: "The invisible enemy",
        cuerpo: [
          "The thinkers of this era discovered an uncomfortable problem: our minds deceive us constantly. We see patterns that aren't there, we remember the hits and forget the misses, and we easily believe what we want to believe.",
          "These errors of thinking are called biases. Because of them, for centuries completely useless remedies were believed to work: people got better on their own and credited the remedy.",
          "The scientific method was born, in part, to protect us from ourselves, forcing us to check instead of assume.",
          "Recognizing that we can be wrong was, paradoxically, one of the great advances of human intelligence.",
        ],
        dato: "Fun fact: that's why the best medical studies today are «double-blind»: neither the patient nor the doctor knows who's getting the real treatment and who a fake one, so that expectations don't distort the result.",
      },
      "revolucion-aplicalo": {
        titulo: "Apply it to your life",
        cuerpo: [
          "The scientific revolution teaches you not to fool yourself.",
          "Where it was wrong: the view of the body as a pure machine left emotions and the mind aside for a long time.",
          "What still holds: checking before believing, distrusting easy conclusions and knowing that our minds tend to deceive us.",
          "Your exercise: ask yourself how many things you believe about your health that you've never actually tested on yourself. Does that habit really suit you, or do you just assume it does?",
          "Test, observe and draw your own honest conclusions. Being a little scientific with yourself is one of the best ways of taking care of yourself.",
        ],
      },
    },
  },

  // ── Los microbios cambian el mundo ─────────────────────────────────────
  microbios: {
    titulo: "Microbes change the world",
    anio: "18th–19th centuries",
    momentos: {
      jenner: {
        titulo: "Edward Jenner",
        fecha: "1749–1823",
        cuerpo: [
          "In the 18th century, smallpox killed and disfigured millions of people. Jenner noticed something curious: milkmaids who'd had cowpox, which is far milder, didn't come down with human smallpox.",
          "He dared to test a bold idea: he inoculated a boy with material from cowpox and then confirmed that he was protected against human smallpox.",
          "He had invented the vaccine, the first way of training the body to defend itself against a disease before suffering it.",
          "It was the beginning of one of the most powerful tools in the history of medicine.",
        ],
        dato: "Fun fact: the word «vaccine» comes precisely from the Latin for cow, in memory of that cowpox. Thanks to vaccination, smallpox is today the only human disease completely eradicated from the planet.",
        extras: [
          {
            titulo: "How a vaccine works, and how a disease was erased",
            cuerpo: [
              "HOW IT WORKS. Your immune system learns. When a microbe gets in, it takes days to identify it and manufacture the right defences, and in that time the illness may have done you enormous harm. A vaccine hands it the homework already done: it shows it a piece of the microbe, or a weakened version, or just its instructions, so it makes the defences and — this is the important part — keeps the memory. If the real microbe ever arrives, the response that used to take ten days takes hours.",
              "WHAT IT ISN'T. It isn't «giving you the disease». It doesn't replace your defences: it trains them. And it doesn't only protect the person who gets it.",
              "HERD IMMUNITY. A microbe needs to find susceptible people to keep circulating. When a high proportion of the population is vaccinated, the chains of transmission break and the people who can't be vaccinated are protected too: babies too small for it, people with damaged immune systems, anyone undergoing cancer treatment. That's why getting vaccinated is at once a personal decision and a contribution to everyone else.",
              "HOW SMALLPOX WAS ERASED. It's the greatest public health campaign in history and it deserves telling. Smallpox killed about a third of those infected, left many survivors blind and scarred, and is reckoned to have taken some 300 million people in the 20th century: more than all that century's wars put together.",
              "In 1967 the World Health Organization launched a worldwide campaign, and the strategy was as clever as the invention. They realized they didn't need to vaccinate the whole planet: it was enough to detect each outbreak and vaccinate in a ring around it, cutting off the virus's path. There was a financial reward for reporting a case, and teams of vaccinators went house to house through villages in India, Ethiopia and Bangladesh.",
              "The last natural case was in Somalia in 1977, a hospital cook called Ali Maow Maalin, who survived. In 1980 it was declared eradicated. It's the only human disease we've made disappear from the world, and the virus exists today only in two maximum-security laboratories.",
              "And a warning the history itself teaches: when a vaccine works very well, the disease disappears from view, people stop being afraid of it and start being afraid of the vaccine instead. It's the paradox of success, and it explains the measles outbreaks reappearing today in countries where it was already under control.",
            ],
            dato: "Fun fact: the idea wasn't entirely new. In China and India variolation — deliberately inoculating a small dose of human smallpox — had been practised for centuries, and in Europe it was introduced in 1721 by Lady Mary Montagu, who had seen it in Istanbul and tried it on her own children. It was effective and dangerous; Jenner's contribution was finding a safe version.",
          },
        ],
      },
      semmelweis: {
        titulo: "Ignaz Semmelweis",
        fecha: "1818–1865",
        cuerpo: [
          "At the general hospital in Vienna, around 1846, there were two maternity wards. In one, doctors and medical students attended the births; in the other, midwives. And something was happening that everyone knew and nobody explained: in the doctors' ward around 10% of the women died of puerperal fever, and in some months as many as 18%; in the midwives' ward, about 2%.",
          "Semmelweis, a young Hungarian doctor, became obsessed with that difference and ruled out explanations one by one: overcrowding, the climate, diet, the birthing position, even fear. Nothing fitted.",
          "The clue came from a tragedy: a friend of his, a professor of forensic medicine, cut himself with a scalpel during an autopsy and died with exactly the same symptoms as the women in labour. And then he saw it: the doctors and students came straight from doing autopsies, wiped their hands on a cloth and went in to examine the women. The midwives didn't do autopsies.",
          "He concluded that hands were carrying «cadaverous particles» — he knew nothing about bacteria, Pasteur was twenty years away — and imposed a rule: wash your hands with a chlorinated lime solution before every examination. Mortality in his ward fell from 18% to under 2% in a few months.",
          "He had the data, he had the result, and he was rejected. His superiors took offence: what he was saying, at bottom, was that doctors were killing their patients with their own hands. And in 1847 there was no theory to explain WHY it worked, so it was dismissed as a fad. His post wasn't renewed, he had to go back to Hungary, he published late and badly, and his letters grew more and more furious and desperate.",
          "He ended up committed to an asylum, where he died at 47 within two weeks, of an infection caused by beatings from the guards. He died, with atrocious irony, of the very thing he'd spent his life trying to prevent.",
        ],
        dato: "Fun fact: the «Semmelweis reflex» is now the name for the tendency to reject automatically any evidence that contradicts what you believe or forces you to change your behaviour. And his measure is still, according to the WHO, the most effective and cheapest intervention for preventing infections in a hospital: washing your hands.",
      },
      "john-snow": {
        titulo: "John Snow and the cholera map",
        fecha: "1854",
        cuerpo: [
          "In the summer of 1854, a cholera outbreak killed more than 600 people in a few weeks in the Soho district of London. The official explanation was «miasma»: a corrupt, foul-smelling air believed to be responsible for epidemics.",
          "John Snow, a doctor and anaesthetist, suspected the culprit was the WATER, and he had no way of proving it with a microscope. So he did something new: he went house to house, noted down every death and drew it on a map of the district.",
          "The map spoke for itself: the deaths clustered around one particular public water source, the Broad Street pump. And the exceptions proved the rule, which is the most elegant part of his work. Workers at a nearby brewery barely fell ill: they drank beer, not water from the pump. In a workhouse with hundreds of people there were almost no cases: it had its own well. And one woman died in a distant neighbourhood with no contact with Soho — it turned out she liked the taste of that water and had it brought to her.",
          "With the map in hand he convinced the authorities to remove the pump handle. The outbreak died out. It was later confirmed that a cesspit holding the stools of a sick baby was leaking a few metres from the water well.",
          "What matters isn't only that he was right: it's the METHOD. Snow invented modern epidemiology, that is, the science of finding the cause of a disease by studying how it's distributed across a population, with data, maps and comparisons. You can act against an epidemic before you know the culprit.",
          "And out of it came what has probably saved more lives than any drug: the decision to keep drinking water separate from waste water. Sewerage and water treatment have prevented more deaths than any medicine invented since.",
        ],
        dato: "Fun fact: his dot maps are the direct ancestor of the contagion maps we were all looking at in 2020. And in London, on the site of the Broad Street pump, there's a replica today with no handle, in memory of the day a doctor stopped an epidemic by taking the handle off a tap.",
      },
      nightingale: {
        titulo: "Florence Nightingale",
        fecha: "1820–1910",
        cuerpo: [
          "Florence Nightingale came from a well-off British family and insisted, against her family's opposition, on devoting herself to caring for the sick: at the time, nursing wasn't a respectable profession, it was done by women with no training and it was badly paid and worse regarded.",
          "In 1854 she was sent with a group of nurses to the British military hospital at Scutari, in the Crimean War. What she found was an administrative slaughterhouse: soldiers lying on the floor among rats, with no clean water, no working latrines, wounds bandaged with reused rags, blankets in short supply and rotten food. Far more soldiers were dying of typhus, cholera and dysentery than of battle wounds.",
          "She did two things. The first, the obvious and exhausting one: organize. Cleaning, ventilation, laundry, latrines, a kitchen, water, separated beds, care in shifts and a constant presence — hence the nickname that made her famous, «the lady with the lamp», from her night rounds. The hospital's mortality fell dramatically.",
          "The second is what makes her a decisive figure in the history of medicine: SHE WROTE EVERYTHING DOWN. She collected figures on admissions, causes of death and dates, and on returning to London she presented them to the government in charts she designed herself — the famous «polar area diagrams», still reproduced today — so that any politician could see at a glance that most of the deaths were preventable and infectious in origin.",
          "And in 1860 she founded the first modern school of nursing, with formal training, examinations and professional ethics. She turned care into a profession with knowledge of its own, rather than an improvised domestic task.",
          "Her underlying idea is the one running through this whole story: care isn't medicine's ornament, it's a part of medicine. Cleanliness, rest, food, air, company and attention are treatment.",
        ],
        dato: "Fun fact: she was the first woman admitted to the Royal Statistical Society. She spent much of her last decades ill and confined to her house, and from there, writing reports and letters, went on reforming an empire's health service.",
      },
      pasteur: {
        titulo: "Louis Pasteur",
        fecha: "1822–1895",
        cuerpo: [
          "Pasteur showed that many processes, like fermentation and decay, are caused by living microorganisms, not by something arising out of nothing.",
          "From that he deduced germ theory: microbes are responsible for many infectious diseases. A radical change of mindset.",
          "He discovered that heating liquids destroyed those microbes, a technique that now bears his name: pasteurization, which still protects milk and other foods.",
          "He also developed new vaccines, among them the one for rabies, saving lives and confirming the power of the idea.",
        ],
      },
      koch: {
        titulo: "Robert Koch",
        fecha: "1843–1910",
        cuerpo: [
          "Koch turned germ theory into precise science. He developed methods for isolating and culturing bacteria and identifying exactly which one causes each disease.",
          "He discovered the microbe responsible for tuberculosis, one of the great killers of the age, and the one for cholera as well.",
          "He set out clear rules for proving that a particular germ is the cause of a particular disease, a method still in use.",
          "Thanks to him, medicine could start putting names to its invisible enemies.",
        ],
      },
      "higiene-esterilizacion": {
        titulo: "Hygiene and sterilization",
        fecha: "Saving lives with soap",
        cuerpo: [
          "Before microbes were known about, surgeons operated with dirty hands and instruments, and a great many patients died of infection after the operation.",
          "When it was understood that germs caused those infections, everything changed. People started washing their hands, sterilizing instruments and disinfecting wounds.",
          "The doctor Ignaz Semmelweis had already shown, even earlier, that washing your hands drastically reduced the deaths of mothers in childbirth, though at the time nobody believed him.",
          "Those very simple measures saved and go on saving countless lives. Sometimes the greatest advance isn't a complex device but cleanliness.",
        ],
        dato: "Fun fact: Semmelweis was rejected and ridiculed by his colleagues for arguing for hand-washing. He died unrecognized; today he's honoured as a pioneer ahead of his time.",
      },
      "microbios-aplicalo": {
        titulo: "Apply it to your life",
        cuerpo: [
          "Microbes teach you that health also depends on invisible enemies.",
          "Where they were wrong: at first, the enthusiasm for microbes led people to think every illness came from outside, forgetting the role of the body itself and of lifestyle.",
          "What still holds: hygiene, vaccination and prevention. Avoiding illness is still better than curing it.",
          "Your exercise: value the simple gestures that protect you: washing your hands, looking after what you eat, sleeping well to strengthen your defences, getting vaccinated when it's due.",
          "Prevention isn't glamorous, but it's one of the most powerful medicines there is. And it's in your hands, literally.",
        ],
      },
    },
  },

  // ── La medicina moderna ────────────────────────────────────────────────
  "medicina-moderna": {
    titulo: "Modern medicine",
    anio: "19th–20th centuries",
    momentos: {
      anestesia: {
        titulo: "Anaesthesia",
        fecha: "1846",
        cuerpo: [
          "This is the part of the history of medicine that's hardest to read, and it has to be told to understand the rest. Until the middle of the 19th century, all surgery was done with the patient awake.",
          "The only resource was speed. Famous surgeons were famous for being fast: amputations were timed and some did them in under thirty seconds. The patient was held down with straps or by several men, given alcohol, opium if there was any, a piece of leather to bite on, and operated on while they screamed. Many died of the shock itself, and quite a few preferred to die of the illness than go into the operating theatre.",
          "That limited the whole of medicine: you couldn't operate inside the abdomen, or the chest, or the skull, because those need time and precision, and neither was possible with a conscious, terrified person.",
          "On 16 October 1846, at Massachusetts General Hospital, a dentist called William Morton administered ether to a patient in front of a room full of sceptical doctors, and the surgeon removed a tumour from his neck without him moving or crying out. When it was over, the surgeon turned to the audience and said: «Gentlemen, this is no humbug». The news went round the world in months.",
          "In Scotland, the obstetrician James Simpson tried chloroform and introduced it into childbirth. There was moral resistance: it was argued that the pain of labour was natural and even that it was prescribed in the Bible. The argument was settled in 1853 very practically, when Queen Victoria asked for chloroform for the birth of her eighth child. If it was good enough for the queen, it was good enough for everyone.",
          "Anaesthesia didn't cure a single disease, and yet it changed medicine more than almost any drug: it made modern surgery possible. With anaesthesia and, shortly afterward, asepsis, a body could at last be opened calmly.",
        ],
        dato: "Fun fact: today's anaesthetists constantly monitor something nobody sees: the exact depth of unconsciousness, breathing, blood pressure and pain. It's said to be the only specialty in which success means the patient remembering absolutely nothing of the most dangerous hours of their life.",
      },
      "rayos-x": {
        titulo: "X-rays and seeing inside",
        fecha: "1895",
        cuerpo: [
          "Throughout history, doctors had access only to the surface: look, listen, palpate, smell, ask. What was happening inside a living body was invisible, and the only way to know for certain was to open it… or wait for the autopsy.",
          "In November 1895, the German physicist Wilhelm Röntgen was experimenting with discharge tubes and noticed that a nearby screen glowed even when the tube was covered with black card. There was an unknown radiation passing through opaque materials. He called them «X-rays» precisely because he didn't know what they were.",
          "The first radiograph in history was his wife Anna Bertha's hand, with her wedding ring. On seeing her own bones she said: «I have seen my death».",
          "It spread at dizzying speed: within a few months X-rays were being taken in hospitals all over the world, and within a year they were being used to locate bullets and fractures. It's probably the fastest medical application of a physics discovery in history. Röntgen refused to patent it so that it would be available to everyone.",
          "And from there came everything else: the electrocardiogram to see the heart's rhythm, ultrasound — which uses sound waves, no radiation, and made it possible to see a baby before birth for the first time — computed tomography, which reconstructs the body in slices, and magnetic resonance imaging, which distinguishes soft tissue without using radiation.",
          "The underlying change is enormous: diagnosis stops depending only on the doctor's eye and experience and starts leaning on images that can be stored, compared, measured and shown to someone else. And it brought its own risk, learned the hard way: the pioneers of radiology suffered burns, amputations and cancers from exposing themselves without protection, and today every test involving radiation is done with the minimum dose and only when it adds something.",
        ],
        dato: "Fun fact: in the early years, X-rays were a fairground attraction: there were machines at fairs and shows to see the bones of your hand, and even shoe shops with devices to «check» how your foot fitted inside the shoe. They were still in shops into the 1950s.",
      },
      insulina: {
        titulo: "Insulin and hormones",
        fecha: "1921–1922",
        cuerpo: [
          "Before 1922, a diagnosis of type 1 diabetes in a child was a short-term death sentence. The only treatment was a starvation diet that extended life by a few months. Hospitals had wards of children in comas waiting to die.",
          "In Toronto, a young surgeon called Frederick Banting, with a student, Charles Best, and the support of John Macleod's laboratory and the biochemist James Collip, managed to extract from the pancreas the substance that regulates blood sugar and purify it enough to inject.",
          "The scene of that first trial is one of the most striking in medicine: they went into a ward of children in diabetic comas, with their families present, and gave injections one by one. Before they'd finished with the last one, the first were waking up.",
          "And there was an ethical decision worth remembering: they sold the patent to the University of Toronto for a symbolic dollar, so that nobody could speculate with it. Banting said insulin didn't belong to him, it belonged to the world. That the price of insulin is a scandal in some countries today is one of the bitterest ironies in the history of medicine.",
          "What matters for this story is the CONCEPT it opened up: there are substances manufactured in one organ that travel through the blood and give orders to other organs — hormones — and if the body stops producing one, it can be replaced from outside.",
          "Out of that came half the medicine of the 20th century: treating hypothyroidism with thyroid hormone, cortisone for inflammation, sex hormones, the contraceptive pill — which changed women's lives more than almost any other drug — fertility treatments, growth hormone and today's drugs for obesity and type 2 diabetes.",
        ],
        dato: "Fun fact: insulin was also the first human protein manufactured by genetic engineering, in 1978: the human gene was put into a bacterium so it would produce it. Until then it was extracted from the pancreases of pigs and cows, and tonnes of pancreas were needed to treat one patient for a year.",
      },
      fleming: {
        titulo: "Alexander Fleming",
        fecha: "1881–1955",
        cuerpo: [
          "In 1928, Fleming left some plates of bacteria uncovered before going on holiday. On coming back, he found that a mould had contaminated one of them and that the bacteria around it had died.",
          "That mould was producing a substance that killed bacteria: penicillin, the first antibiotic.",
          "Antibiotics transformed medicine. Illnesses that had been a death sentence — a pneumonia, an infected wound — became curable with a few doses.",
          "Antibiotics are reckoned to have saved hundreds of millions of lives. Rarely have chance and attentive observation given humanity so much.",
        ],
        dato: "Fun fact: today the overuse of antibiotics is creating resistant bacteria. A reminder that even medicine's greatest triumphs have to be used wisely.",
        extras: [
          {
            titulo: "What you need to know about antibiotics",
            cuerpo: [
              "FIRST: it wasn't only Fleming. He observed the phenomenon in 1928 and couldn't isolate the substance in useful quantities, so the matter sat still for almost ten years. It was rescued at Oxford, already in the middle of the Second World War, by Howard Florey, Ernst Chain and their team, who managed to purify it and prove it cured fatal infections. And since England was being bombed, industrial production was set up in the United States, in time for the Normandy landings. It's a perfect example of modern medicine being made by teams, not lone geniuses.",
              "SECOND: what really changed. Before antibiotics, an infected scratch, a pneumonia, an appendicitis, an ear infection or an infection after giving birth could kill anyone, at any age and in good health. And there's something almost never said: antibiotics are what make the rest of modern medicine possible. Without being able to control infection there'd be no complex surgery, no transplants, no intensive care, no chemotherapy, no prosthetics and no safe childbirth.",
              "THIRD, and this is the important part now: BACTERIA EVOLVE. Every time an antibiotic is used, the susceptible bacteria die and the ones that happened to resist survive. Those multiply and pass on their resistance, even between different species. It isn't that «the body gets used to it»: it's that the population of bacteria changes. It's evolution by natural selection, happening in real time inside your own body.",
              "Fleming warned about it in his Nobel speech in 1945, and his warning has come true: resistant bacteria are now credited with more than a million deaths a year worldwide, and there are infections for which very few options are left. And meanwhile few genuinely new antibiotics have been developed, because they're bad business: you take them for ten days, they're supposed to be used as little as possible and they sell cheap.",
              "WHAT CAN BE DONE, concretely: don't take them for viruses — flu, a cold, most sore throats and most bronchitis are viral and the antibiotic does absolutely nothing except harm; don't stop the course halfway because you feel better; don't reuse leftovers from another time; don't give yours to anyone; and know that the world's biggest consumption of antibiotics isn't in people but in intensive livestock farming, where they're used to fatten animals and prevent disease on crowded farms.",
              "And an idea that ties into the rest of this journey: for decades bacteria were thought of only as enemies. Today we know we carry trillions of microorganisms — the microbiota — that take part in digestion, in the immune system and probably in mood, and that an antibiotic flattens them too. Medicine has moved from wanting to sterilize the body to trying to look after its ecosystem.",
            ],
            dato: "Fun fact: when penicillin was extremely scarce and expensive, military hospitals recovered it from treated patients' urine to purify and reuse it. Not a drop could be wasted.",
          },
        ],
      },
      "cannon-homeostasis": {
        titulo: "Cannon and homeostasis",
        fecha: "The inner balance",
        cuerpo: [
          "Walter Cannon described one of the most important ideas in physiology: homeostasis, the body's capacity to keep its internal environment stable.",
          "Whether it's cold or hot, whether you eat or fast, whether you run or rest, your temperature, your blood sugar and your balance stay within limits thanks to constant adjustments.",
          "Health is, to a large extent, that capacity always to return to balance. Falling ill is when the body can no longer get back to it.",
          "Curiously, this modern idea is very close to what Ayurveda and Chinese medicine sensed thousands of years earlier: health is dynamic balance.",
        ],
      },
      "osler-hospital": {
        titulo: "Osler and the modern hospital",
        fecha: "Learning beside the patient",
        cuerpo: [
          "William Osler transformed the way doctors are trained. He took students out of the lecture hall and brought them to the patient's bedside, where they had to observe, examine and learn from real cases.",
          "He helped organize the modern hospital: a place where people are treated, research is done and teaching happens all at once, with specialists and teamwork.",
          "He insisted that a doctor mustn't lose sight of the person behind the disease, for all the technical advances.",
          "His famous advice sums up a whole philosophy: it's more important to know what sort of patient has a disease than what sort of disease a patient has.",
        ],
      },
      "especializacion-moderna": {
        titulo: "Specialization",
        fecha: "Knowing a lot about a little",
        cuerpo: [
          "The explosion of knowledge in the 20th century forced doctors to specialize. Cardiologists, neurologists, oncologists and surgeons for every part of the body appeared.",
          "That specialization allowed enormous advances: each doctor could master their field in depth and offer very precise treatments.",
          "But it brought a risk too: looking so hard at one part that you lose sight of the whole person. The patient could become «a heart», «a liver» or «a case».",
          "Out of that tension would come medicine's latest great question: how to put all the pieces back together and see the whole human being again.",
        ],
      },
      "adn-genetica": {
        titulo: "DNA and genetics",
        fecha: "1953–2003",
        cuerpo: [
          "In 1953, in Cambridge, the structure of DNA was described: two strands coiled into a double helix, with four chemical letters that always pair the same way. That shape explained two enormous mysteries at once: how a living thing's information is stored and how it's copied every time a cell divides.",
          "The discovery was signed by James Watson and Francis Crick, and there's a debt here that has to be named: the image that made solving the structure possible, the famous «photo 51», had been obtained by Rosalind Franklin with X-ray diffraction, and was shown to them without her permission. She died of ovarian cancer at thirty-seven, four years before the Nobel, and couldn't share it.",
          "What that double helix opened up was a new way of understanding disease. There are conditions caused by a single faulty gene — cystic fibrosis, haemophilia, sickle cell anaemia, Huntington's — and for the first time it was possible to know exactly what fails and where. And there are a great many others, the most common ones, where genetics only sets up a predisposition that's switched on or not depending on how you live: that's what epigenetics studies, and it's one of the best pieces of news in medicine today, because it means inheriting a risk isn't inheriting a destiny.",
          "And one finding with enormous social consequences: any two people on the planet share around 99.9% of their DNA, and there's more genetic variation within any population than between different populations. Human «races» have no biological basis.",
          "It already shows in the clinic: diagnosis of rare diseases that used to take years to identify, cancer treatments aimed at a tumour's particular mutation, pharmacogenetics to know which drug and what dose each person tolerates, and prenatal screening.",
          "And since 2012, with the CRISPR tool, editing DNA has become relatively simple and cheap. There are already approved therapies curing blood diseases by correcting the patient's own cells. And there appears the limit humanity is still deciding on: modifying the cells of a sick person is medicine; modifying embryos means changing every generation that follows. In 2018, a Chinese researcher did it and was condemned internationally and criminally.",
        ],
        dato: "Fun fact: sequencing the first human genome cost some 2,700 million dollars and thirteen years of work. Today it's done in a day for a few hundred dollars. No technology, computing included, has dropped in price that fast.",
      },
      "etica-medica": {
        titulo: "Medical ethics",
        fecha: "Since 1947",
        cuerpo: [
          "For almost all of history, a doctor could do something for your own good without asking you. The relationship between doctor and patient was paternalistic: the doctor knew, decided and sometimes didn't even tell you the diagnosis «so as not to distress you». And in the 20th century it was seen where that can lead when power and a hurry to do research are added.",
          "The experiments of the Nazi doctors in the concentration camps — freezing, pressure, inoculating diseases, mutilations, on people who couldn't refuse — were tried at Nuremberg in 1947. Out of that trial came the first code in history on research involving people, and its point number one is as simple as it is revolutionary: the voluntary consent of the subject is absolutely essential.",
          "And it wasn't only Nazism. In the United States, between 1932 and 1972, the Tuskegee study followed hundreds of Black men with syphilis for forty years WITHOUT treating them, in order to observe the natural course of the disease, even after penicillin existed. Their diagnosis was hidden from them. The scandal, when it came out, changed American legislation and left in the affected communities a distrust of the health system still felt today.",
          "There were quiet, everyday abuses too. In 1951, a woman called Henrietta Lacks had a sample of her tumour taken without being told or asked; her cells turned out to be able to multiply indefinitely in the laboratory and have been used since in tens of thousands of studies — the polio vaccine, in vitro fertilization, cancer and HPV research. Her family didn't know for twenty years and lived without health insurance while vials of her cells were sold all over the world.",
          "Out of all that were born the rules that protect anyone walking into a consulting room or a study today, and they're worth knowing because they're YOUR rights: informed consent, that is, having it explained to you in a language you understand what's going to be done, what the alternatives are and what the risks are, and being able to say no; the ethics committees that review every piece of research before it starts; the right to your medical records; confidentiality; the right to a second opinion; and the right to decide about the end of your life, with an advance directive.",
          "The four principles taught in medical schools today are easy to remember: do no harm, seek the patient's benefit, respect their autonomy and be fair in sharing out resources. And they often conflict with each other, and that's where the real argument begins.",
        ],
        dato: "Fun fact: the Hippocratic oath is 2,400 years old and is still the profession's moral reference. But its ancient version says nothing about informing the patient or asking their opinion: that idea — that the sick person is the one who decides about their own body — is the 20th century's most important ethical contribution to medicine.",
      },
      "pandemias-arn": {
        titulo: "Pandemics and RNA vaccines",
        fecha: "2020–2023",
        cuerpo: [
          "When in March 2020 the World Health Organization declared the COVID-19 pandemic, it was taken for granted that a vaccine would take five or ten years: that was the historical record. The first one was being administered in December of that same year.",
          "How that was possible is a lesson in how science actually works, and there are four factors.",
          "ONE: decades of prior work that had looked like it was going nowhere. Messenger RNA technology had been researched for thirty years, with scarce funding and many rejections; the biochemist Katalin Karikó spent years failing to get grants and was demoted at her university for persisting with that line. In 2023 she received the Nobel. When the emergency arrived, the tool was already half built.",
          "TWO: information shared immediately. The virus's genome was sequenced and published online in January 2020, available to any laboratory in the world. With that sequence, designing the RNA vaccine took days: that's why these vaccines are said to be designed on a computer.",
          "THREE: public money at risk and in quantity, which made it possible to manufacture millions of doses BEFORE knowing whether they worked, and to overlap trial phases that normally run one after another. The safety checks weren't cut: what was cut was the waiting time between procedures and the manufacturing time.",
          "FOUR: volunteers. Tens of thousands of people signed up for the trials within a few weeks.",
          "AND HOW THEY WORK, briefly: instead of injecting a weakened virus, you inject the instructions for making a single piece of it — the spike protein — wrapped in a bubble of fat. Your cells read those instructions, make the piece, the immune system recognizes it as foreign and learns to defend against it. The RNA degrades within hours and doesn't enter the nucleus or modify your DNA.",
          "The pandemic left other, less technical lessons. That the most effective measures at the start were the old ones — distance, ventilation, isolation, hygiene, exactly what was learned with Snow and Semmelweis. That inequality decides who falls ill: locking down in a flat with a terrace wasn't the same as in a forty-square-metre one, nor was having a job you could do from home. That rich countries vaccinated first while Africa waited more than a year. And that trust is a health resource: where it was lost, no measure worked well.",
        ],
        dato: "Fun fact: almost all the experts agree on something uncomfortable: it won't be the last. With today's population density, intensive livestock farming, deforestation and air travel, there will be more pandemics, and what will decide the outcome is early surveillance, manufacturing capacity and — above all — social trust.",
      },
      "moderna-aplicalo": {
        titulo: "Apply it to your life",
        cuerpo: [
          "We heal better than ever… but do we understand human beings any better?",
          "Where it was wrong: by focusing so hard on the disease and on the technique, modern medicine sometimes forgot the person, their emotions and their way of living.",
          "What still holds: the immense power of science to heal, homeostasis as the key to health and rigorous training beside the patient.",
          "Your exercise: make the most of the best of modern medicine without giving up on looking at yourself whole. Medicines and specialists are enormously valuable, but you're more than the sum of your organs.",
          "When you look for help, look also for someone who sees you as a person, not just as a diagnosis. And do the same for yourself.",
        ],
      },
    },
  },

  // ── La psiquiatría: curar la mente ─────────────────────────────────────
  psiquiatria: {
    titulo: "Psychiatry: healing the mind",
    anio: "19th–20th centuries",
    momentos: {
      "locura-historia": {
        titulo: "Madness, from possession to illness",
        fecha: "For almost all of history",
        cuerpo: [
          "For almost all of history, mental illness was the great misunderstood thing. It was seen as a divine punishment, a possession by spirits or a shame to be hidden.",
          "People suffering mental disorders were feared, pushed aside and often shut away in terrible conditions, in chains and with no treatment or care at all.",
          "One simple but revolutionary idea was missing: that the mind, like the body, can also fall ill, and that whoever suffers it is a sick person who deserves help, not a guilty one who deserves punishment.",
          "Recognizing that — that mental suffering is an illness and not a moral defect — was psychiatry's first great step.",
        ],
        dato: "Fun fact: for centuries there were places where people paid an entrance fee to look at mental patients locked up, as though they were a spectacle. It's hard to imagine how badly their suffering was misread.",
      },
      pinel: {
        titulo: "Philippe Pinel",
        fecha: "1745–1826",
        cuerpo: [
          "Philippe Pinel was a French doctor who, at the end of the 18th century, did something that scandalized his age: he ordered the chains taken off the mental patients in the hospitals of Paris.",
          "He argued for treating them humanely, talking with them, observing them and caring for them, instead of punishing or abandoning them. It was called «moral treatment».",
          "He started classifying the different mental disorders and studying them as illnesses, with their causes and their course, just as medicine did with the rest of the body.",
          "That's why he's considered one of the fathers of psychiatry: he made madness an object of medicine and the mental patient a patient with a right to be cared for.",
        ],
        dato: "Fun fact: the gesture of Pinel freeing patients from their chains has been painted many times as a symbol of the birth of a more humane medicine.",
      },
      freud: {
        titulo: "Sigmund Freud",
        fecha: "1856–1939",
        cuerpo: [
          "Sigmund Freud, a Viennese neurologist, proposed an idea that would change the understanding of the mind forever: much of what we feel and do is born in a hidden zone of ourselves, the unconscious.",
          "According to him, experiences, desires and conflicts we've forgotten or repressed go on influencing us and can cause suffering. He created psychoanalysis to bring them to light by talking.",
          "His method consisted of listening to the patient for hours: their memories, their dreams, what they said without noticing. For the first time, words became a treatment.",
          "Many of his specific theories have been superseded or disputed, but his great intuition is still alive: talking about what hurts and understanding your own story can heal.",
        ],
        dato: "Fun fact: psychoanalysis was called «the talking cure». It was the ancestor of all the psychotherapies that help millions of people today.",
      },
      psicofarmacos: {
        titulo: "The birth of psychiatric drugs",
        fecha: "Since 1950",
        cuerpo: [
          "In the middle of the 20th century one of medicine's quietest and most important revolutions happened: it was discovered that certain chemical substances could genuinely relieve mental disorders.",
          "In 1952, in Paris, chlorpromazine — the first antipsychotic — showed it could calm the delusions and agitation of patients who until then had seemed lost. Shortly afterward came lithium, able to stabilize mood, and the first antidepressants.",
          "The effect was extraordinary. Many psychiatric hospitals, effectively warehouses of hopeless patients, started to empty: at last there were treatments that let many people live outside confinement again.",
          "Psychopharmacology was born. Something profound was confirmed: the mind has a chemical basis in the brain, and acting on that chemistry can help restore a lost balance.",
        ],
        dato: "Fun fact: many of those first psychiatric drugs were discovered almost by chance, when drugs meant for something else were noticed to change patients' mood or behaviour.",
        extras: [
          {
            titulo: "What was done before the pill",
            cuerpo: [
              "To understand why the arrival of psychiatric drugs was a liberation, you have to know what came before. And it's the harshest page in the history of medicine.",
              "CONFINEMENT. The great asylums of the 19th century and the first half of the 20th held tens of thousands of people for life, with no possible treatment, in overcrowded conditions, with chains, isolation cells and straitjackets. In many cases the mentally ill weren't separated from beggars, epileptics, unmarried mothers, alcoholics or simply people who were inconvenient to their families.",
              "THE SHOCK «TREATMENTS». Faced with helplessness, everything was tried: ice-cold showers, spinning chairs until the patient vomited, prolonged isolation, comas induced with insulin, malaria given on purpose to produce a fever. Almost none of it had ever been compared with a control group: it was applied because it seemed something sometimes changed.",
              "THE LOBOTOMY is the most scandalous case. It consisted of destroying the connections in the front of the brain, and in its most widespread version it was done by pushing a pick in above the eye, without an operating theatre and in a few minutes. It was performed on tens of thousands of people, many of them women committed for «nervousness» or inappropriate behaviour, and it left patients apathetic, infantilized and irreversibly damaged. Its promoter received the Nobel Prize in Medicine in 1949. It's the most uncomfortable possible reminder that a prize, a reputation or a professional consensus are not evidence of effectiveness.",
              "ELECTROSHOCK deserves an honest qualification, because it's the opposite example. It was used brutally and abusively — without anaesthesia, without consent, as a punishment — and its image was marked by that and by the cinema. But the technique itself, done today with general anaesthesia, muscle relaxants and informed consent, is a legitimate and sometimes life-saving treatment in extremely severe depressions that respond to nothing and in high suicide risk. The same tool can be torture or medicine depending on how, why and with whose permission it's used.",
              "WHAT CHANGED WITH THE DRUGS. With chlorpromazine and lithium, thousands of people could leave hospital and live at home. In the sixties and seventies the great asylums started closing across half the world. But that process had its own failure, and it has to be told: in many countries the hospitals were closed without building the community care network that was supposed to replace them, and some of those patients ended up on the street or in prison. It's a problem still unresolved.",
              "AND WHAT WE KNOW TODAY, with the humility that's due: psychiatric drugs genuinely help a great many people and they aren't sweets; the simple explanation that depression is «a lack of serotonin» is out of date and the mechanism is far more complex; for most conditions, what works best is the combination of drug and psychotherapy, not either alone; and stigma is still part of the illness.",
              "That's the thread of this chapter: it took two thousand years to accept that the mind can fall ill like the body, and it's still hard to treat it as naturally as we treat a thyroid.",
            ],
            dato: "Fun fact: lithium, still one of the most effective treatments there is for bipolar disorder, is a simple chemical element, not a molecule designed in a laboratory. One of psychiatry's best medicines is, literally, a metal from the periodic table.",
          },
        ],
      },
      "psiquiatria-aplicalo": {
        titulo: "Apply it to your life",
        cuerpo: [
          "Psychiatry teaches you that the mind needs looking after too.",
          "Where it went wrong: it sometimes fell into extremes, from the confinement and brutal treatments of the past to the more modern risk of medicating everything and forgetting the person behind it.",
          "What still holds: that mental suffering is real, that it isn't a shame or a weakness, and that it can be treated — with words, with support and, when needed, with medication.",
          "Your exercise: treat your mental health with the same respect as your physical health. Asking a professional for help when your mind hurts is as sensible as going to the doctor about a wound.",
          "And remember the three ways of healing from the start of the journey: very often what heals the mind best is a combination of all three — looking after the body, adjusting the chemistry and talking about what hurts.",
        ],
      },
    },
  },

  // ── La medicina integrativa ────────────────────────────────────────────
  integrativa: {
    titulo: "Integrative medicine",
    anio: "20th–21st centuries",
    momentos: {
      "que-es-integrativa": {
        titulo: "What is integrative medicine?",
        fecha: "The reunion",
        cuerpo: [
          "Integrative medicine starts from a simple, powerful idea: treat the whole person, not just their illness. Body, mind, emotions, habits and surroundings form a whole.",
          "It isn't opposed to scientific medicine: it uses it as its base. But it adds tools science had set aside, like nutrition, physical activity, stress management and the quality of the relationship between doctor and patient.",
          "Its criterion is always evidence: it takes in whatever is shown to work and discards what isn't, wherever it comes from.",
          "It is, in a way, the synthesis of this whole journey: Greek reason, Egyptian observation, Indian balance, Chinese flow and modern rigour, working together.",
        ],
        extras: [
          {
            titulo: "How to tell what works from what's being sold to you",
            cuerpo: [
              "This is the most delicate point of the whole journey and it deserves saying plainly, because under the label «integrative», «natural» or «holistic» the best of today's medicine lives alongside businesses that prey on sick people.",
              "WHAT HAS SOLID EVIDENCE and is already part of the best medicine: physical exercise — which, measured by results, is one of the most powerful treatments there is for mood, the heart, diabetes, osteoarthritis, sleep and chronic pain; diet and weight; getting enough sleep; stopping smoking; stress management and mindfulness techniques for chronic pain and anxiety; physiotherapy; psychological support; support groups; a relationship of trust with whoever treats you; and rehabilitation in any chronic illness.",
              "WHAT HAS PARTIAL OR WEAK EVIDENCE: many medicinal plants — some work, some interact dangerously with medicines and for most the safe dose isn't known; acupuncture for certain kinds of pain (where studies show a real but small effect, heavily dependent on context and ritual); and a good part of supplements, which in a well-fed person almost never add anything.",
              "WHAT HAS NO EVIDENCE AT ALL, said without hedging: products promising to cure cancer, «clear out toxins», boost the immune system in some general way or replace an effective treatment. And the risk here isn't only money: there are documented deaths of people who abandoned a chemotherapy with real chances of cure in order to follow a promise.",
              "WARNING SIGNS, and they're quite reliable: it promises to cure many different things at once; it uses words like «energy», «toxins» or «quantum» without defining them; it says science «doesn't want you to know»; it rests only on testimonials and not on results; it asks you to stop your treatment; it charges up front for a long package; and it admits no result that could show it's wrong.",
              "QUESTIONS YOU CAN ALWAYS ASK, of any professional and about any therapy: has this been compared with a group that didn't receive it? What specific benefit has been measured, and how big? What risks and interactions does it have? Can it be combined with my current treatment? And what would happen if I did nothing?",
              "AND THE GOLDEN RULE, which sums up two thousand years of this story: what helps is ADDED, not substituted. Integrative medicine properly understood doesn't mean swapping science for tradition, it means giving up nothing that works: the right drug, and also exercise, food, sleep, company and a person who listens to you.",
              "Because modern medicine's mistake was never healing too well. It was forgetting, along the way, that whoever is ill is a whole person.",
            ],
            dato: "Fun fact: there's one treatment that appears in almost every modern clinical guideline, has no side effects, is free and was ignored by none of the cultures in this journey: movement. Hippocrates already prescribes it, Ayurveda and Chinese medicine prescribe it, and today's research confirms it as one of the most effective interventions we have.",
          },
        ],
      },
      "pilares-integrativa": {
        titulo: "The pillars of care",
        fecha: "Nutrition, mind and lifestyle",
        cuerpo: [
          "Integrative medicine pays particular attention to what builds health day by day: food, sleep, movement, relationships and how you handle stress.",
          "Nutrition is understood as an everyday medicine: what you eat affects your energy, your mood and your risk of falling ill.",
          "Psychology is recognized as an essential part: emotions, stress and a sense of meaning affect the body directly, just as the shaman already sensed.",
          "And knowledge like herbal medicine — the use of medicinal plants — is recovered, always assessed with scientific criteria.",
          "All of it is personalized: the best care is the kind adapted to your constitution, your history and your life, as Ayurveda taught.",
        ],
      },
      "andrew-weil": {
        titulo: "Andrew Weil",
        fecha: "1942–",
        cuerpo: [
          "Andrew Weil, a doctor trained at one of the world's most prestigious universities, is one of the great drivers of modern integrative medicine.",
          "He argues for combining the advances of scientific medicine with nutrition, relaxation, exercise and the body's own healing power.",
          "He insists on something that runs through this whole story: the organism has an enormous capacity to heal itself, and a good part of medicine consists of creating the conditions for it to do so.",
          "His work helped hospitals and universities take care of the whole person seriously, rigorously and without giving up on evidence.",
        ],
      },
      "avicena-steiner": {
        titulo: "Inspirations and qualifications",
        fecha: "Avicenna and Steiner",
        cuerpo: [
          "Integrative medicine also looks back for inspiration. Avicenna, a thousand years earlier, was already treating the patient as a whole, joining body, diet, emotions and surroundings: a historical forerunner of this view.",
          "There are also currents like anthroposophic medicine, proposed by Rudolf Steiner, which sets out to bring spiritual aspects into the care of the sick.",
          "It's important to be clear: anthroposophy is a philosophical-medical current, not evidence-based medicine. It offers a way of looking at the person, but it doesn't replace scientifically proven treatments.",
          "Serious integrative medicine always distinguishes what has scientific backing from what belongs to the realm of belief, and puts the patient's safety above everything.",
        ],
        dato: "Fun fact: many hospitals and universities today have integrative medicine centres where researchers use scientific methods to study which complementary practices actually work and which don't.",
      },
      "mensaje-final": {
        titulo: "Final message",
        cuerpo: [
          "After 20,000 years of searching for health, we've discovered something surprising.",
          "Medicine isn't only about getting rid of illnesses.",
          "It's about learning to live in a way that favours health.",
          "Each civilization has handed you a lens for knowing yourself: the shaman taught you the power of the mind; Egypt, observation; India, balance; China, flow; Greece, reason; the Islamic world, clinical compassion; the Renaissance, evidence; and modern medicine, the integration of all of it.",
          "At the start we asked you what you do when you fall ill. Now you know that, without knowing it, you were carrying twenty thousand years of wisdom inside you.",
          "Your final exercise, for the rest of your life: look after yourself as a whole person. Listen to your mind, observe your body, look for your balance, respect your rhythm, demand evidence and treat yourself with compassion.",
          "That's the real ending of this journey: not learning history, but learning to live in good health.",
        ],
      },
    },
  },
};
