// ─────────────────────────────────────────────────────────────────────────
// TEXTOS de los arquetipos, en INGLÉS.
//
// Espejo de astrologiaTextos.ts. El español manda: de él salen las claves, el
// orden y qué celdas existen. Aquí va SOLO la prosa, celda a celda, y lo que
// falte se muestra en español (ver getTextoSigno / getTextoCasa).
//
// CLAVES: los signos se indexan por su nombre ESPAÑOL («Géminis»), porque es lo
// que guarda la carta del usuario y lo que dibuja el icono. No se traducen.
//
// CÓMO AÑADIR UNA TRADUCCIÓN
//   1. Copia la celda del fichero español y traduce solo el texto.
//   2. Traduce a la vez su resumen en astrologiaResumenes.en.ts: el popup pinta
//      los dos juntos, separados por una raya.
//
// Ojo con Quirón y los Nodos: en el fichero español el mismo texto vale para el
// signo y para la casa (Casa 1 = Aries … Casa 12 = Piscis). Aquí se respeta con
// las constantes compartidas de abajo, para no traducir dos veces lo mismo.
//
// PENDIENTE: quedan por traducir los textos largos de los planetas. El recorrido
// funciona igual mientras tanto (cae al español celda a celda), y el resumen de
// cada arquetipo ya sale en inglés.
// ─────────────────────────────────────────────────────────────────────────
import type { CuerpoKey } from "./astrologiaData";

/** Los doce signos en el orden canónico, para mapear «Casa N = Signo N». */
const SIGNOS = [
  "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo",
  "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis",
] as const;

/** Convierte un mapa por número (1-12) en un mapa por nombre de signo. */
const porSigno = (m: Record<number, string>): Record<string, string> =>
  Object.fromEntries(Object.entries(m).map(([n, texto]) => [SIGNOS[Number(n) - 1]!, texto]));

/**
 * Textos de Quirón — el mismo texto vale para el signo y para la casa.
 * Se referencian desde TEXTOS_SIGNO_EN y TEXTOS_CASA_EN, igual que en español.
 */
const QUIRON_TEXTS_EN: Record<number, string> = {};

/** Textos del Nodo Norte — Casa N = Signo N. */
const NODO_NORTE_TEXTS_EN: Record<number, string> = {};

/** Textos del Nodo Sur — Casa N = Signo N. */
const NODO_SUR_TEXTS_EN: Record<number, string> = {};

/** Textos por (planeta, signo). Clave del signo: su nombre en español. */
export const TEXTOS_SIGNO_EN: Partial<Record<CuerpoKey, Partial<Record<string, string>>>> = {
  ascendente: {
    Aries: `Independent, strong, impulsive.

How do you try to impose yourself? Can you channel your aggression, or does it drag you along?

Your approach to Life is direct and energetic. Learn to use that force to build and to commit, not only to start. You need to express your creativity, and if you don't, you get frustrated. Give yourself permission to create alone: you don't need an audience for what you make to have value.

Careful with leaving things half-done (I know you). Learn to find the new inside the everyday; there's always something to discover.

Don't forget physical movement — it suits you to invest and transform all that energy.`,

    Tauro: `A body that tends to feel heavy. Aerobic exercise gives you back your lightness, physically and inside.

You're hardworking, steady, systematic. You look for structure in everything you do and you have a method for reaching every goal.

Write down the systems you tend to keep going over time, the ones that make you feel safe. Look at whether you really want to keep them or you'd like to change something. Remember that you get attached to routines and patterns from the past even long after they stopped serving you. So write them down. Keep them in sight. And swap them, little by little, for habits that do take care of you.

You also get attached to what you produce. Learn to let go of the result. What matters isn't what you achieve, but the path and the strength you grow while walking it.

If you lose the connection with your body, it tends to remind you: extra weight, money problems, fractures, even unwanted pregnancies. Listen to your body's whispers before they turn into screams.`,

    Géminis: `A youthful look. You seem sure of yourself, but inside there are more nerves than you let on. Tension, mental hurry, noise. You need to meditate, get out of your head and come down into your body.

Your curiosity is enormous and you take in information at a frightening speed. Careful with getting lost in gossip, empty conversations or an endless scroll that only leaves you more scattered.

Make a list of what you actually want to commit to and go deep on. If you only move without integrating, your emptiness and frustration grow.

Don't forget to come down to your heart. You need to develop empathy and compassion, toward yourself and toward other people — not only mental understanding.`,

    Cáncer: `A rounded figure, sweet, almost childlike features. You tend to be shy, but ask yourself honestly: do you give yourself the worth you deserve?

Sometimes shyness is a shell, so nobody comes close and nobody hurts you. But that shell sits right on top of your heart, and all it manages to do is freeze the pain inside. It doesn't protect; it isolates.

You're sensitive and vulnerable. You perceive other people's emotions as if they were yours. How do you feel when that happens?

Write every time you need to get out what isn't yours, or what's been done to you. Write what you need in order to feel emotionally and materially connected. Make it conscious: that way you'll know what you're asking of other people (and of Life), and you can start giving it to yourself. Write the situations from the past that still weigh on you, so you can release them. You don't need to carry that.

Part of your path is nourishing other people and walking with them as they become themselves. But if you don't nourish yourself first, all you hand out is lack dressed up as care. Write how you're going to start nourishing yourself, and when. Put it on the calendar and commit, so the laziness doesn't win.`,

    Leo: `You draw eyes. You have beautiful hair (yes, you know).

Generous, idealistic, ambitious, creative, romantic, with a confidence you can spot from across the room. But ask yourself: how do you try to dominate other people? Is it worth it? What do you get out of it?

You don't need subordinates to be a leader. Real leadership is creating a space where other people get to be themselves. You have the power to give others permission to open their hearts — use it well.

You long to be loved and, above all, to feel worthy. But however much you're validated, you'll stay thirsty, because the validation you're looking for is your own.

Write down the ways you ask for validation outside, and replace them with how you can give it to yourself. You don't need the social recognition you chase so hard. Your fear of looking ridiculous is born from your own judgments; nobody judges you as harshly as you do. You don't need to get angry or inflate your ego to be important. You already are.`,

    Virgo: `You look younger than you are. There's something nervous in the way you move, as if you were always keeping an eye on something.

You tend to feel inadequate, and that shapes you: you never quite see yourself as enough. You may be carrying wounds from past experiences that still sting. You need to keep what actually nourishes you and let the rest go.

Make a list of what matters to you.

You're critical and judging. You chase a perfection you know deep down is impossible, and that leads you into an exhausting inner reproach. The details, by the way, aren't as important as you think.

What things do you judge in other people? Everything you judge out there is something you judge in yourself. Heal it inside and you'll stop seeing it outside.

Practical and efficient, you can get obsessive about order and cleanliness. But remember: Life isn't measured.`,

    Libra: `Harmonious features, delicate skin, symmetrical proportions. Nature took its time with you.

You feel better surrounded by people or in a partnership: other people work as a mirror where you get to know yourself.

What have other people taught you about yourself?

You're diplomatic, sweet, able to see things through reason when everyone else loses their nerve. But careful with letting other people decide for you. Your voice counts too. Count on yourself.

Don't lose yourself looking for the ideal Life: there's a real risk of spending your Life designing it, chasing perfection and harmony, instead of living it. Do what you can every day with what you have. Now is the only real thing.

Make a list of things you'd like to happen each day, just for today (repeat it every morning), and carry them out.`,

    Escorpio: `You have an obvious sexual magnetism. You know it and, sometimes, it makes you uncomfortable.

You hide a part of yourself and only show what you like, or what you want to look like. You'd rather observe and analyze, because you can see the dark, deep side.

What have you perceived over the course of your Life?

On the outside you look calm, but inside there's huge activity, versions of you transforming continuously. You don't like it to show, because you need to give the impression of being in control at all times.

You look for power to hold up your path, and you often ask other people for it. That can lead you to narcissism, or to relationships where power becomes currency. Remember: your real power is already inside you. You don't have to negotiate for it.

Sex matters in your Life, and it may have been painful ground until you discovered what was underneath the surface.

Write the structures from the past you've destroyed, and what you replaced them with.
Write the structures you'd like to destroy now, and what you'd change them for. Remember you have the power to do it.

You're blessed to light up the dark, so don't hide your own darkness: it's one more tool.

Write it all down — the strangest, most macabre, most unpresentable thing you think. Nothing here is up for judgment.`,

    Sagitario: `An athletic body, tall. And, though it may not look like it, you can be afraid of Life; it's hard for you to believe it could be beautiful.

At your best, there are no limits for you, or they aren't where other people put them. You're philosophical and you can use that mind to find values that help you live better.

Careful with talking too much. It's usually because you're trying to sort your ideas out loud.

Write down the scattered ideas circling your head. Give them a shape.

When you reach a goal, it only works as a springboard to the next one. Write down here every goal you'd like to reach in this Life (and pay attention: it isn't "have a child", it's "build a family"). Go through them one by one and describe how you can get a little closer each day. Whatever it is, the seed for the tree is already inside you.

Careful with exaggerating, because sometimes it pushes you backwards. Careful with not committing because you want to take on everything.

Be honest with yourself. Write down your current situation. Don't escape into the future on false optimism.`,

    Capricornio: `Skin with a muted tone, a bony build. Future-oriented.

You usually try to please a father figure you perceive as strict. Who are those figures in your Life?

Since childhood, and later in adolescence, you've felt inadequate. Why? How could you start turning that around? What are you keeping it for?

You're disciplined, responsible, practical and sometimes cold. Stop holding yourself back so much. Learn some flexibility: rigidity isn't strength, it's fear in good clothes.

Write down the ways you hold yourself back. To let go, first you have to see yourself.

Don't try to dodge your responsibilities; deep down you feel better when you meet them.

You work hard and you're able to bring order into chaos.`,

    Acuario: `Bony, angular, with harmonious features and long fingers.

Your role is the observer without judgment. You need to take a step back and look from outside, instead of putting yourself in the middle of the activity.

It's hard for you to find your place and your recognition inside big groups; you never quite fit, and you don't entirely want to either.

You place a lot of hope in a better future, and that leads you into an idealism that sometimes drifts from the possible: your visions of equality and fraternity need to land in order to be useful.

Living with you isn't always easy: you can be stubborn, irrational and fairly self-centered, even when your ideals are honest and fraternal.

Your work is learning discipline, patience and careful observation. That's the real compass that lets you move between the practical and your highest ideals without losing your north.`,

    Piscis: `A tendency to easy tears. A body that changes with its surroundings (pay attention to this, it affects you more than you think). Delicate teeth, soft features. There's something vulnerable and seductive at once in how you look.

Hypersensitive, dreamy, compassionate and mystical, you tend to be impractical. Your challenge is learning to handle your emotions instead of letting them drag you like a tide.

You need to discover an identity of your own without forgetting you're part of something much bigger.

You absorb emotions and energies that aren't yours. Learning to tell them apart (and to let go of what isn't yours) is essential on your path.

That confusion can push you into three typical roles: victim, savior or aggressor. You may want to save other people, or wait for other people to save you. Careful with escaping through substances, or with letting yourself be shaped too much by outside influence.

Learn not to sacrifice yourself for other people, and to set boundaries so nobody takes advantage of you.`,
  },
  sol: {
    Aries: `**In shadow:** You may have had strict, emotionally castrating parents or teachers, or you may feel blocked, unable to change anything or leave a mark. The worst thing that can happen to you is doubting your own power and your own capacity.

You can turn dominant, competitive, low on empathy and with serious difficulty handling your emotions. You come across as arrogant, irritable, intolerant, impulsive, violent, combative and reckless. You escape into the future through compulsive conquests, pushed by the fear of leaving no mark on the world. In relationships you get bored fast, because you need to keep conquering.

You can be overbearing, self-centered, unstable, impatient and inconsistent, with sudden emotional reactions and little reflection behind them. You reject rules, limits and prohibitions, and you feel trapped when you're controlled.

**In light:** Open to learning, with confidence, independence, ambition, generosity, courage and a conquering attitude that isn't toxic. You're a starter: dynamic, fast, enthusiastic, impulsive and brave.

You're frank and direct. You say what you think without violence, and you're loyal to your "brothers in arms". You don't like being given things: you need to feel you conquered it yourself.

You need freedom, open air and physical movement, and you tend to identify with children. You can't stand indecision or stagnation. You're individualistic and autonomous: you need space and independence to bloom.

You understand failure as learning. You live in the present, uninterested in the past, sidestepping the weight of the collective unconscious and of transgenerational patterns.

You have enormous vitality and a colossal life force. You barely stop, you barely tire, and a deep force pushes you. What you need is to be left alone to move at your own pace.

**At high frequency:** Brave, and able to recognize what you really want as an individual, beyond what the blind loyalties you've internalized impose on you. You have the capacity to move into action to chase what you want, while knowing how to weigh the consequences. And you understand that, even when you want something, you shouldn't take it or chase it if it isn't legitimately yours.`,

    Tauro: `**In shadow:** You've lost control over how energy materializes. You put your security in the material and the fixed (money, possessions, a partner, a job), because you need reality to be stable and lasting in order to feel safe. When Life demands that you change, you lose perspective and you're overwhelmed.

You're jealous to absurd extremes, convinced other people's care and affection belong to you. Behind that jealousy there's a deep emotional lack.

You're stubborn and rigid. You rarely question yourself, and you cling to points of view that are outdated or downright archaic. It's hard for you to recognize when it's time to change, and you can stay trapped in toxic situations for years.

You can turn insatiable, obstinate, slow, possessive, greedy, materialistic, gluttonous, ungrateful, lazy and obsessed with money, property and sensory stimulation (food, sex, pleasure, "more"). You tend to develop addictions to having, eating and consuming.

You have to accept loss, to understand that every ending is only a transition.

**In light:** Patient, resilient, steady, slow but tenacious, conservative, homeloving, aware, calm, practical, artistic, reliable, hardworking, loyal and emotionally lasting.

You build material and financial security, not only for yourself but to share it with other people. You enjoy the physical world (food, touch, beauty, sensual pleasure) and you know how to help other people enjoy Life.

You're solid ground: steady, protective and deeply reliable. You rarely get angry, but when you do it's serious. Like the bull. Better to step aside.

You need to validate yourself independently of what you own.`,

    Géminis: `**In shadow:** Neurotic, superficial, judgmental and a master at justifying yourself while losing sight of the truth. Irresponsible. When things don't go your way, you tense up and you sink.

Your nerves keep you from reaching physical or intellectual calm, and in an emergency you can lose it, though in the end you almost always find a way out.

You can be changeable, dual, scattered, hyperactive, nervous, cunning, scheming, inconsistent, too talkative and emotionally insensitive.

You mature in Sagittarius, looking for a truth that doesn't always fit in your analytical mind, and learning to go deep instead of fluttering.

**In light:** Depth, sociability, an outward orientation, a love of learning, culture, curiosity, adaptability, expressiveness, verbal and literary talent, intelligence (you learn fast and get bored just as fast), rationality, objectivity, mental clarity, detachment and a strong need to communicate.

You're a good teacher and communicator, and you usually have many friends. In love you look for fraternity and intellectual connection.

You have to learn and study while connected to your heart, your feelings and your emotions, instead of living only in your head and its noise.`,

    Cáncer: `**In shadow:** Attachment keeps you from evolving. You give when you have nothing to give, because you need to feel indispensable. There's a deep terror of loneliness and of endings. You carry intense attachment, deep fears and obsessions.

You're moody and very vulnerable: your emotional state rises and falls like the tides, and you tend to get lost in impractical fantasies. You lean toward fearfulness, even though you don't like it to show. When you're low, you're capable of dragging whoever's beside you down with you.

You're easily hurt and easily influenced: touchy, withdrawn, negative, capricious, fantasizing to the point of confusing reality and desire, manipulative, lazy, self-centered, self-pitying, emotionally volatile, routine-bound, overprotective and very concerned with what other people think.

You mature when you understand nothing is a punishment and you dare to leave your shell (your home, your roots) in order to create your own.

**In light:** Family-minded, maternal, imaginative and receptive. Your goal is emotional security: you need a home. Shy but tenacious, intuitive, homeloving, sensitive, introspective, emotional, empathic, traditional, imaginative, and with a memory that makes people envious.

You need to develop emotional mastery: being able to hold yourself up and to hold other people up without attachment, without manipulation and without depending on other people or on a family in order to exist.`,

    Leo: `**In shadow:** When you feel mediocre or insignificant, or when you can't manage to find yourself, you can turn into pure ego or sink into depression, looking for attention and validation outside with real desperation.

You can turn vain, irritable, tyrannical, dramatic, exaggerated, childish, arrogant, pretentious and cruel, with a deep fear of looking ridiculous. You need a "court" of admirers, and you get depressed when you aren't shining, or when you've gone too far through one excess or another.

You're impatient, demanding and dependent on other people's recognition instead of your own. You don't like being directed, but you do like being flattered. It's common for you to be carrying the absence of a father figure — that is, a figure who shows you it's safe to "go out and hunt" and come back in one piece, that there's ground under your feet, that you can fall and get back up.

You have to learn to be, simply for the pleasure of being, without needing anyone to clap.

**In light:** A leader — expansive, energetic, strong-willed, idealistic, proud, ambitious, noble, sincere, creative, romantic, generous, optimistic, and with a self-confidence you can spot from across the room. You're organized and you know how to organize, hardworking, sharp at spotting where the opportunity or the business is, and you're overflowing with vitality. You light up whoever's near you.

You need to love (sometimes with a certain stage drama), you enjoy expressing emotions and feelings, and you're especially good with children. You usually have many friends and a natural presence that draws people in effortlessly.`,

    Virgo: `**In shadow:** You reject your own inner chaos instead of accepting that you don't control the world. Your curiosity can take you into your own inner "hells". When things don't go your way, neurotic crisis mode kicks in: you start cleaning, tidying, or trying to fix and manage other people's Lives, in an attempt to keep your own chaos in check.

You have to work on detaching from your mother; without that, your evolution stays blocked.

You deal with an inner duality and a double standard you don't always admit, and you mature in Pisces by realizing you control absolutely nothing.

You can turn critical, stingy, obsessive, melancholy, self-centered, pedantic, skeptical, careless, bad-tempered, hypochondriac, meddling and self-pitying, afraid of illness, poverty and old age. You can get obsessive about punctuality, numbers and details, lose perspective, close yourself off from enjoyment and manipulate other people.

**In light:** Analytical, responsible, introspective, hardworking, methodical, scientific, demanding, clean and perfectionist at work and in material matters.

You're capable of constructive criticism, orderly, practical, attentive to detail, a great conversationalist and a sharp observer who retains and analyzes everything happening around you.

You have to understand that everything has its own order, even when you can't see it at first glance, and stop judging when things don't match your expectations.`,

    Libra: `**In shadow:** You lack the objectivity to hold the balance in your relationships and you get tangled in your own emotions. You cling to how you think society and relationships ought to work, and you end up trapped in your own judgments. Like every air Sign, you handle emotional pain badly.

You may need to be surrounded by people constantly and to depend on outside relationships to validate you. You turn inconstant, apathetic, complaining, indecisive, indolent, excessively self-critical, easy to persuade and very fond of the path of least resistance.

You're hypersensitive to aesthetics, you overthink everything and you live in constant uncertainty. You can feel dependent, impatient, lazy ("someone else will do it"), cowardly and anxious in the face of any decision. Social status can weigh on you more than you admit.

**In light:** Diplomatic, sociable and able to keep many relationships in harmony. Peaceful, cooperative, fair and outward-oriented.

You're harmonious, seductive, persuasive, delicate, kind, prudent and artistic. You can see more than one point of view and you enjoy the art of seducing and connecting.

You have to grow harmony within duality without needing another person and without becoming dependent.`,

    Escorpio: `Scorpio has three levels, and it's worth knowing which one you're on:

1) **The Gray Lizard:** neurotic, obsessive, morbid worry.
2) **The Scorpion:** you wound for the pleasure of wounding, sometimes as an experiment. Remember that the scorpion kills itself after it stings.
3) **The Eagle:** you rise above the limitations and observe without getting caught.

**In shadow:** You get hooked on abandonment, betrayal, humiliation or painful endings, and you hide in a shell out of which jealousy and the need for control are born. You can turn deeply neurotic and addicted to toxic relationships.

The first step is recognizing that you have a problem and accepting your own vulnerability.

You're able to see into the human mind and detect other people's weak points almost effortlessly, which tempts you to use that power in unhealthy ways. You despise weakness in yourself and in other people, you look for revenge and you can be genuinely cruel, sometimes with barely a few words, though you usually prefer to take your time.

You get trapped in power and control, in secrets, jealousy, exclusivity and emotional intensity.

You mature when you lean on your strengths and recognize them as values. When you grow, you become a great "finisher" of what no longer belongs, of what's rotten. You free yourself by letting go.

**In light:** Penetrating, introspective, capable of deep merging, with a real curiosity (nothing superficial), mysticism, awareness, passion, power, vulnerability and an enormous capacity for regeneration.

You're loyal, you don't fear death, you're deeply focused, determined, shrewd and persistent. Your iron will, your courage and your self-confidence let you reach your goals and hold authority with integrity.

**In negative:** Vengeful, envious, self-destructive, destructively critical, temperamental, too private, arrogant, violent, sarcastic, obsessive, secretive, manipulative (because you know other people's secrets), cruel, jealous, tyrannical, exclusionary, intolerant, obsessed with power and control, with an excessive vulnerability that can lead you into depression.

You have to recognize Life's processes and endings without attachment, seeing them as natural phases to learn from.`,

    Sagitario: `**In shadow:** You cling to a single truth and you close yourself off from continuing the search, because you're afraid of finding the lie behind it. You can also turn your revelations into rigid dogma.

**In negative:** Exaggerated, too talkative, excessive, blunt, impatient, aggressive, pragmatic at the wrong moment, restless, diffuse, rebellious, reckless, morally flexible, impulsive, disconnected from the ground (always projected into the future) and low on empathy.

You have to remember that what matters is the journey toward the promised land, not the destination. You disconnect easily from the present moment and from practical reality.

You mature by finding your inner fire and developing humility and compassion. You have to understand that, for you, stopping the search feels like dying, and that sometimes the "demons" hide in the details that bore you so much.

**In light:** Extroverted, adaptable, vital, enthusiastic, optimistic, ethical, wise, prophetic, frank, philosophical, brave, passionate, freedom-loving, understanding, generous, fair, independent and expansive.

You're a traveler by nature. You enjoy Life across the whole spectrum: cheerful, extroverted, idealistic, exploring, restless and always in motion. The fire Signs are Signs of mission, and you live yours as something almost divine.

You have to know there's a deep meaning in all things, even when it can't be fully perceived, and let your actions flow from that awareness.`,

    Capricornio: `**In shadow:** You build inner and outer walls to feel safe, and you turn paranoid about control. One of your worst fears is feeling small and unrespected in front of a larger structure (a company, the State, authority).

You can turn rigid, fearful and obsessed with security, status and control. You mature when you learn that the only limits that truly matter are the ones you choose consciously, not the ones imposed on you from outside. You have to discover your own worth and become your own father.

**In light:** Ambitious, serious, responsible and not at all impulsive. You think twice before acting (sometimes three times). Life can feel uphill (which is why you carry so many fears), but if you keep at it, you get there in the end.

You're self-disciplined, practical, methodical, persevering, austere, prudent, efficient and hardworking. You reason well and you keep a cool head.

Private and loyal, with a strong sense of dignity. You don't like drawing attention. You respect laws and rules, and you take responsibility very seriously.

You fear dependence in old age, but not aging or the passing of time itself. Your health can give you trouble mostly in childhood and youth, and when you're young you tend to look older than you are.

**In negative:** Self-centered, domineering, too conservative, cruel, fatalistic, touchy, pessimistic, resentful, isolated, stubborn, repressed, long-suffering, rigid, cold, distant, fearful and obsessed with status and material security; you look for recognition, but you're short on spontaneity and joy.

You have to embody responsibility as a deep virtue, leaving a positive mark on the world that lasts beyond your Life.`,

    Acuario: `**In shadow:** You see emotions as dangerous, because they threaten your mental framework and your view of the world. Your ethical and moral systems are very rigid, and they leave little room for empathy or spontaneity. You disconnect from biological cycles and emotional rhythms.

You mature by developing intimacy without fear. For that, you have to truly know and accept yourself, and enjoy your own essence.

You enjoy possessions, but you aren't greedy. You work better with people, especially with those chasing universal ideals. You integrate information and people with an ease that goes beyond simply having a good memory.

**In negative:** Hard to truly know. Temperamental, cold, rebellious, dismissive of established systems, eccentric, radical, shy but unpredictable, with abrupt or unexpected reactions.

You can be dogmatic, utopian, anxious, frustrated by the world's suffering, nervous, stubborn, rigid and convinced you understand everything. You have deep convictions rather than fixed principles, and you can seem perverse or obstinate while defending them.

**In light:** Eccentric, decisive, intolerant of hypocrisy and set on living in a more refined, more equal world. Original and creative, you want to reach and share a higher, almost cosmic awareness.

Independent, resourceful, tolerant, a creator ("creating the new"), logical, intellectual, fraternal, friendly, loyal and altruistic. You can seem cold or unfeeling, because it's easier for you to love many people than to connect deeply with one.

You have a remarkable capacity for integrating people and ideas, and you do better in collaborative settings oriented toward universal ideals.

You have to develop the awareness that we're all connected to everything and everyone, without losing your own individuality: you have to know who you are and what your purpose is inside that web.`,

    Piscis: `**In shadow:** You escape because you don't know how to handle what you perceive; you end up internalizing all of it and drowning in pain that isn't yours. You can swing between savior, victim and executioner.

**In negative:** Too talkative, melancholy, easily influenced, dishonest, prone to addiction, obsessive, pessimistic, depressive, emotionally repressed, escapist, shy, impractical, misunderstood, naive, irrational, fragile, unreal and reluctant to face difficulty or make decisions.

Your tendency to run from reality or to hide behind rose-colored glasses doesn't serve you. Difficulty is hard for you, you avoid confrontation and you'd rather withdraw than fight.

You mature when you stop wanting things to be some other way, learn to flow, and understand that healing the world's pain isn't in your hands (but healing yourself is — and you understand that this is your part in saving the world). To find peace, you have to "swim against the current" instead of always taking the easiest path.

**In light:** Dreamy, tolerant, kind, compassionate, creative, spiritual and mystical. Often impractical and too trusting, you're capable of achieving enormous things without making any noise.

You're sweet, charming, charitable, intuitive, hospitable, generous, introspective, artistic and imaginative in the way you perceive. You take other people past conventional reality, toward the invisible. You adapt easily and you have a sixth sense for what other people want (hence your nose for trends or fashion).

You have faith, and you need other people to have faith in you.

You bring the intangible into the tangible, sometimes through art, but always in a creative, singular way.`,
  },
  luna: {
    Aries: `Competition with your mother. You experience your mother as an enemy: aggressive, reactive, emotionally intense, giving a lot of orders or behaving aggressively. If you're a woman, you were forced to compete against her; if you're a man, you fear your mother and women in general.

You have a strong need for action, movement, novelty and change; routine bores you deeply. You develop through experience and through new situations, and you feel safe when you're moving, taking the initiative and acting.

"I depend on myself so nobody tells me what to do." You want to do things your way and you don't tolerate other people's interference, not even when the advice is right.

You need to be seen and to catch attention. Your sensory impressions are very fast, and you act on them in the moment, without reflecting. Your emotional explosions are sudden, intense and brief: strong tantrums that burn out fast and are dropped just as fast. You blow up, you let go, you move on.

Behind that aggressive appearance there's a deep insecurity. You look emotionally isolated, you rarely ask for help and you'd rather lean entirely on yourself. Your way of protecting yourself is through action: in an accident you don't cry, you act, you step in and you save other people.

You tend to dominate rather than to be openly aggressive; emotionally, you try to dominate other people and you take their reactions very much to heart. Closeness and emotional intimacy can register as aggression. Physical contact, hugs for example, may be unpleasant or feel invasive.

You don't easily accept authority, rules or advice. Details aren't your thing, you're not methodical and you're short on perseverance.

You do better in energetic, active work that calls for movement and initiative, rather than routine or precision. You have a strong drive to break away from the family environment. You move a lot in your sleep and you may enjoy spicy food.

**Afflicted:** excessive impulsiveness, a bad temper and acting without thinking about the consequences.

**In women:** a tendency to dominate your partner. **In men:** a tendency to look for a dominant partner.

**Transgenerational:** lines of women who had to take on all the responsibility and do everything alone because the men were absent.`,

    Tauro: `You have a very strong attachment to your mother. She gave you good food, good clothes and material comfort. The bond is intense, but not necessarily emotionally happy or healthy.

You need connection with the earth, nourishment and the present moment. You experience love through bodily satisfaction: food equals security, money equals affection, and material and emotional security get confused. Physical contact is essential. You feel safe when your body is satisfied; food and money give you a sense of security and wellbeing.

Under stress, insecurity or danger, you may overeat or, sometimes, stop eating altogether. Your focus is very much on the material and you want the best quality in everything. You need to build a solid financial base to hold up your emotional security, and sooner or later you discover that real security comes from within.

Art, beauty, physical contact, attachment, loyalty and faithfulness are core values for you. You're affectionate, sentimental, shy, proud and often jealous. You're firm in your ideals and desires, and you need to satisfy your physical appetites. Your senses, especially touch and taste, are highly developed; you usually have a pleasant or powerful voice, and you may tend toward a fairly sturdy body.

You take experiences in slowly but steadily. Once you commit to a relationship or a project, you don't abandon it until it's finished. You like finishing things, and you don't start anything new until you've closed the previous one, though you often need an outside push to get going. With maturity, you can be very good at creating material security and nourishing environments for yourself and for other people, and at teaching how to do it.

You build lasting relationships and you value stability. Your awareness of Life's cycles can show up, in shadow, as inertia or laziness.

**Afflicted:** excessive stubbornness and resistance to change; attachment to beliefs, traditions or family patterns; intolerance, conventionality, pride, jealousy, laziness, comfort-seeking and greed. You may pile up savings excessively and turn too austere.

**In women:** you look for a partner who brings you security and stability. **In men:** you tend to attract loyal partners who support and push your ambitions.

**Transgenerational:** family lines marked by having lost money in the past, which leads to a tendency to hoard or over-save.`,

    Géminis: `Emotional emptiness and a missing bond with your mother. The mother is an intelligent, busy, versatile woman who is emotionally not very available. That's why, unconsciously, you can end up looking for the mother figure in a sister, a friend or another close relationship. It's common for a grandmother or an older sister to have had to take on the maternal role.

Your mind governs you more than your heart. You prioritize understanding intellectually what's happening to you, but you don't stop to really feel the emotional pain. You experience emotions as a weakness. Often you don't know whether you're thinking your emotions or actually feeling them, and you tend to move away from emotion through thought.

You take reality apart (separating the emotion from the experience) in order to feel safe. You have to learn to observe your emotions without denying them, escaping them or intellectualizing them. What you hear or read can have a strong emotional impact on you, even if you don't consciously admit it. You have an enormous need to communicate, to express and to understand what's happening to you. When you don't express yourself, you sabotage yourself through food. Your eating tends to revolve around fast or junk food, especially when you're sad, stressed or emotionally blocked.

Versatile, agile, observant, quick-witted and good with words. You can talk nonstop, sometimes to the point of irritating the other person, and you're very nervous and restless. You usually do several things at once and you rarely concentrate on just one. That same versatility can leave projects half-finished.

You prefer variety to depth and you tend to look for an immediate, momentary intimacy rather than long-term emotional bonds. Faithfulness can be hard for you. You're private about personal things, emotionally cool and a touch superficial in how you express emotion.

Short trips, changes of address and constant movement are frequent. You're not especially intuitive, but you're very good at forming a quick first impression and putting it into words. You enjoy classifying, analyzing and observing other people. You do well in communication work, handicrafts and artisan trades. You have good manual skill and a sharp sense of smell.

**Afflicted:** scatteredness, nerves, emotional coolness, a tendency to gossip, superficiality and mental restlessness.

**In women:** little interest in domestic or caretaking roles; superficiality in emotional matters. **In men:** you look for an intellectual woman able to adapt on every level.

**Transgenerational:** a family line marked by difficulties with education, interrupted studies or a lack of formal schooling.`,

    Cáncer: `You have a very strong attachment to your mother, though that bond isn't necessarily healthy or positive. You experience her as a figure who nourishes you through manipulation, often putting herself above everyone else and passing you messages like: "Nobody will ever love you the way I do." That leaves you emotionally dependent and confused.

The way you work emotionally is highly maternal and feminine. You have an intense wish to become a parent and to create your own home and family, which you experience as your main shelter and your source of security. Your love for home and family is strong, and your relationships tend to be more romantic than passionate. You're deeply empathic and very emotionally tuned to other people.

You genuinely try to understand and care for what other people feel, but you have to learn not to stay "possessed" by their emotions. You tend to mix your own emotions with what you pick up in them, absorbing their negative vibrations, which leads you to overwhelm and unhappiness.

You expect other people to sense what you feel, because you sense what they feel. When that doesn't happen, you feel invisible, unloved and frustrated. You climb into your shell as a way of protecting yourself.

Extremely sensitive and impressionable, you're strongly affected by outside changes and emotional environments. Overprotective, controlling and hypersensitive, you can over-nourish other people while neglecting your own emotional needs. You have to learn to set boundaries and to take responsibility for your own emotions instead of projecting them onto other people.

When you feel emotionally bad, especially in relation to your mother, you can sabotage yourself with food, overeating or stopping eating. Financial security matters to you, and you can't stand waste.

You usually act calmly and cautiously, hiding what you really feel. Your impressions are precise and accurate, but you don't always act on them. Your mind is reflective, with emotional reactions that are slow, uncertain or hard to predict. You're drawn to cooking, art and creative expression. You have a tendency to obsession and to resentment when your emotional needs aren't met. You may perceive the world as a hostile place. You have to stop looking for a mother figure in other people, and avoid isolating yourself, because that leaves you open to being taken advantage of. When that happens, the resentment piles up.

**In women:** emotionally vulnerable, but dominant inside the home. **In men:** you tend to look for a mother figure instead of an equal partner; you can be hypersensitive.

**Transgenerational:** family lines marked by mothers who were absent, lost or gone through abandonment or death.`,

    Leo: `A dominant mother who presents herself as a queen and who teaches you that you're a king or queen too, that you deserve special treatment and that you can look down on anyone who doesn't treat you that way.

In childhood, you may have centered your emotional world on a creative, brilliant relative who loved you and made you feel unique; that figure usually stays idealized. You tend to be the grandparents' favorite.

You confuse affection with admiration: if you don't feel admired, you don't feel loved, and if the admiration disappears, you leave. You have a clear leaning toward drama, toward theatrical emotional expression and toward an inflated sense of importance. You need constant validation to feel emotionally nourished and special, ideally from someone you deeply admire. When the world doesn't give you that admiration, you withdraw and go live in fantasy.

Brilliant, confident and charismatic, but prone to sabotaging yourself while you wait for outside recognition. You tend to idealize other people and you can live in someone's shadow. You're confident and firm, mostly interested in what affects you directly, and you don't tolerate interference or criticism once you've decided your course.

You feel and act straight from the heart, not from the mind. Your emotional Life is closely tied to your ego, and you often lack emotional objectivity. You judge people fast and you know how to put everyone in their place. Your temperament is fiery, self-centered, noble and passionate.

Sexual magnetism, a gift for leadership, ambition and a strong need to "love and be loved". When something interests you, you're in very fast. Everything you learn passes through the filter of your emotions. You're hard to convince, and it's hard for you to give ground.

You have to consciously learn to love and admire yourself. Only then do you discover real love. Developing an authentic self-love is essential.

This Moon can be very good for raising children and for helping other people build their self-esteem. There can also be a strong affinity with animals and with caring for them.

**In women:** passionate, with a strong need for recognition and admiration. **In men:** romantic and playful, or arrogant and domineering; you're drawn to women who are brilliant, talented, socially visible and tasteful.

**Transgenerational:** women in the family line who abandoned their own Life path or personal calling in order to become mothers.`,

    Virgo: `You were born into a family marked either by excessive order or by excessive chaos. From childhood you grow up taking responsibility for what happens around you, often believing you'll only be loved if you're useful and you take charge. That's why you're left without a carefree childhood, and you may not know how to enjoy Life spontaneously.

You experience restraint and restriction, and you usually perceive your mother as emotionally distant, too critical or not very emotional, with strict rules around order and cleanliness. The way you love is through service, and you impose direction in relationships because you believe you know what's best. Love, for you, is practical and functional: giving concrete help, useful gifts, being of use. To feel loved, you need other people to notice your efforts and to say so out loud.

You're rational and analytical, you study and analyze impressions in detail, usually with a good memory. You tend to overvalue your own processes and insights and to undervalue other people's emotional experiences. You only appreciate knowledge if it has a practical application. You tend to rationalize your emotions, creating an inner distance from what you feel, and you can come across as emotionally anxious or careful.

You're conservative, hardworking, practical, detail-oriented and perfectionist. Your meticulous focus on small details can make you lose the big picture and build a small, controllable world around you. Short trips and varied friendships are common, though you rarely show real curiosity about other people's Lives.

You tend toward low sexual expression. You're modest, shy and unassuming, but excellent at organizing chaos and putting your surroundings in order. In time, you have to learn to serve yourself, not only everyone else.

You're prone to somatizing when you ignore your own needs or the present moment, with possible digestive, nervous or eating disorders. You have a strong interest in health, alternative care, hygiene and nutrition.

**Afflicted:** neurotic worry over insignificant details, functional rather than emotional intimacy, a lack of self-confidence, an excessive focus on being useful instead of actually loving, and a perfectionism that misses what matters in Life.

**In women:** a lack of confidence, emotional coolness. **In men:** you look for an independent partner who neither demands nor gives affection excessively.

**Transgenerational:** family lines marked by taking charge of sick or dependent relatives.`,

    Libra: `Your mother made you love people you didn't actually love, giving more weight to social appearances than to authentic feeling. As a child you were made to interact with visitors or relatives, learning manners and social etiquette at the cost of spontaneous, carefree play.

You value femininity, harmony and delicacy. You can't stand shouting, aggression or anything that feels "out of place" to you. If you rebel, you may do it by dressing badly or provocatively as an outlet.

You're very social and you need to communicate. Accommodating, diplomatic and dependent, you lean on other people's recognition to define yourself. You consider marriage important, even if love isn't the central thing. Your home is beautiful, aesthetically cared for and full of social activity. You rarely act alone, and you're nourished through connection with other people.

You're very sensitive to other people's reactions and attitudes, especially those of the people who matter to you. You tend to experience emotions through your mind, over-analyzing what you feel instead of simply feeling it. You have to learn to trust yourself, to say no, not to depend so much on other people and to stop over-analyzing your emotions.

You're kind, charming, popular and tolerant. You value balance and harmony, and relationships that lack harmony can affect your health. You look for approval in order to feel safe, and you usually please people with courtesy and elegance.

**In women:** elegant, an excellent host, fond of beautiful settings and clothes, giving a lot of importance to marriage. **In men:** you look for partners who are elegant, attractive, sociable, fun and intelligent.

**Transgenerational:** families where manners and appearances were prioritized over love; marriages of convenience rather than of affection.`,

    Escorpio: `Your mother is toxic, excessively possessive, controlling, suffocating, dramatic or too idealized by you. Your mother carries unresolved grief, losses or trauma that were never processed before she had you. You usually have a strong awareness of, and fear around, death and endings.

Your mother can "swallow you whole": love feels like losing yourself. That's why you may avoid intimacy, afraid that emotional closeness will hurt you or let you hurt other people. You live cyclical losses and deep transformations, and you often test people to see how much vulnerability you can safely show.

You're intense, passionate, sexual and highly perceptive, able to see past appearances and detect what the other person is hiding. When you commit, it's total: there's no middle ground. You have an excellent ability to walk other people through trauma, grief and difficult emotional processes.

What nourishes you is closely tied to transformation, death, endings and deep emotional experiences. You're also nourished by deep conversations, esoteric subjects and the exploration of the unknown. If you don't work on this Moon, you can let yourself be emotionally "devoured" by other people rather than feel abandonment.

You have to learn forgiveness, compassion and the capacity to sacrifice for causes worth it. You have a deep, intense personality, defensive and private, prone to jealousy and to silences. You tend to exercise control over your children and to experience intensity in intimate relationships.

**Afflicted:** sexual excess, perversion, emotional obsessions, resentment, manipulation, subtle control and a tendency toward revenge. You spot other people's weaknesses easily and you can exploit them if you aren't healed.

**In women:** a leaning toward sexual promiscuity, emotional torment and family conflict. **In men:** you're drawn to women who are sensual, docile but subtly dominant, able to sense your feelings — since you tend to be quiet and private yourself.

**Transgenerational:** family lines marked by hidden histories, sexual or power abuse, secrets, and sometimes occult or esoteric practices.`,

    Sagitario: `You grow up in an emotionally unreliable environment. Your mother lives her own Life (distant but generous) and teaches you to relax, to "go with the flow" and not to worry too much about the future. In childhood you usually have a steady supply of what you need, which gives you trust in Life. You're someone raised in an open, exploring family, often with exposure to travel or foreign influences.

You're sociable, independent and energetic, with a strong need for freedom. You're nourished by traveling, by living adventures and by helping other people find meaning in their Lives. You're a natural host, teacher and healer, and you create spaces that give other people purpose. You're inquisitive, prophetic and clear in your perception, but you can lack follow-through on projects and, sometimes, speak impulsively.

Optimism is central for you, though it can be unrealistic. You aim at high goals, but sometimes you lack a practical base, and that leads you to disappointment or depression when the limitations show up. Your toxic optimism can keep you from fully processing your emotions. You're spontaneous, reckless and highly independent. Strong psychic tendencies may be present.

**Afflicted:** naive optimism, narrow-mindedness, moral superiority, recklessness and difficulty saving. Emotional or financial irresponsibility can appear when you ignore the lessons about limits.

**In women:** excessively independent, "no strings attached", sometimes detached from family or domestic responsibilities. **In men:** late marriages, multiple romances or infidelities.

**Transgenerational:** nomadic, migrant or exploring families; lines that include healers, teachers and guides.`,

    Capricornio: `You were born into a family where the mother is emotionally distant and demanding. From before you were born you're taught to minimize your needs, believing love and approval are earned with effort and achievement. Your mother's affection gets equated with recognition for what you've accomplished, rather than with genuine emotional support. Emotional space feels inhospitable, and feelings tend to be gray and austere: you learn not to ask for anything.

You spend a good part of your Life looking for your mother's recognition. You tend to create structures that make other people feel safe, often from a place of dependence, hoping to receive love in return. You have to learn to grow tenderness, to give and receive freely and to enjoy Life without always waiting for validation.

You're hypersensitive, though not openly emotional. You can seem cold, critical or reserved. Trusting takes you time, and you tend to take things personally. Making friends is hard, and sometimes you communicate better with older people or with authority figures. Your criticism reflects the value you place on the other person, and you're very sensitive to rejection, often over-justifying yourself.

Depressive tendencies can show up as pessimism, melancholy, stinginess and excessive seriousness. You prioritize material stability over spiritual values, and you're very careful with money. You're responsible, hardworking and devoted, with perseverance and practical skill in whatever you get involved in.

**Afflicted:** chronic depression, a sense of loneliness, chasing power or prestige at any price, difficulty trusting your own worth, emotional austerity and hypersensitivity to criticism.

**In women:** a tendency to melancholy and to feeling unloved. **In men:** you look for women who support your ambitions, keep a comfortable home and manage finances well.

**Transgenerational:** families with a legacy of emotional abandonment or sacrifice, particularly solitary women who lived Lives of renunciation and responsibility. A strong parental influence is common, with ancestors who worked hard, often alone, with little recognition and little affection.`,

    Acuario: `You grew up in an emotionally unreliable environment; your mother is a child-mother who forced you to become the caretaker. Your mother is unpredictable: you can't count on her presence, her absence or her emotional state. Affection is inconsistent, and that leaves you unable to fully trust it or accept it, with your emotional needs unmet.

You learn early that everyone is replaceable. Emotional security gets detached from biological bonds, and you're always braced for loss. You may use social connections to fill an inner emptiness, but friendship tends to matter more to you than family. Freedom becomes your only form of security. You have to consciously develop self-sufficiency and work on healthy endings and goodbyes.

You grow up with a wide perception and an open mind, often learning to navigate uncertainty with practicality and idealism. You're original, inventive, imaginative and creative, and you usually prefer unconventional paths. Your sensory impressions are fast and accurate, which lets you anticipate situations in advance.

Loyal and honest, you need personal space and autonomy, but you value meaningful friendships. You can struggle with intimate relationships and not easily understand other people's emotional needs. If you lack goals or purpose, you can wander in search of something undefined.

**Afflicted:** rebelliousness, avoidant attachment, a fear that relationships will compromise your freedom, excessive detachment, eccentricity, inconstancy and emotional coolness.

**In women:** very detached, mind-oriented and disconnected from your emotions. **In men:** equally detached; you're drawn to liberated, independent women.

**Transgenerational:** families marked by exile, abandonment or mental instability; ancestors who were emotionally unavailable or socially marginalized.`,

    Piscis: `You grew up feeling emotionally flooded, often alone, with nobody asking what you actually need. Your mother may be toxic, overprotective or idealized, creating an atmosphere of suffocating love that doesn't let you be yourself. You can end up either idealizing her or resenting her.

Highly emotional and sensitive, you have to learn to set boundaries around your mother's fears and to tell nostalgia or collective emotional baggage apart from your own real needs. You often don't know who you are and you may imitate other people unconsciously. Dissociation and emotional rationalization are common in you, and you rarely know how to ask for what you need: you lean on other people anticipating it.

Vulnerable, sensitive and hyper-compassionate, you're prone to depression and self-pity. Getting what you want can distress you, because of how intensely you experience emotion. You have to develop common sense, self-nourishment and self-support: essentially, learning to be your own mother.

You're psychically sensitive, prone to discouragement, and you can lose contact with reality. You're compassionate by nature, kind and forgiving, but your hyper-vulnerability can create difficulties in relationships. You need harmonious, protective, loving environments to feel emotionally safe.

**Afflicted:** oversleeping, substance use, self-deception, melancholy, dependence, a victim mindset, neurosis and obsessive thoughts. Depending on the aspects, this Moon can give you deep psychic vision or lead you into total illusion and emotional confusion.

**In women:** magnetically attractive; badly handled emotions can show up as health problems; late marriage. **In men:** you look for an idealized wife, devoted, affectionate and understanding; important for your personal Life, but not necessarily for your career or social influence.

**Transgenerational:** ancestors who were absent, missing or emotionally unavailable; this Moon reflects a synthesis of the feminine energy inside the family.`,
  },
  quiron: porSigno(QUIRON_TEXTS_EN),
  nodoNorte: porSigno(NODO_NORTE_TEXTS_EN),
  nodoSur: porSigno(NODO_SUR_TEXTS_EN),
};

/** Textos por (planeta, casa). */
export const TEXTOS_CASA_EN: Partial<Record<CuerpoKey, Partial<Record<number, string>>>> = {
  quiron: QUIRON_TEXTS_EN,
  nodoNorte: NODO_NORTE_TEXTS_EN,
  nodoSur: NODO_SUR_TEXTS_EN,
};
