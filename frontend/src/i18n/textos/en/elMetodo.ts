/**
 * The Map (/elMetodo) — the sales page.
 *
 * Mirror of `es/elMetodo.ts`, which is the source of truth: when a line changes
 * there, it has to be retranslated here. What each discipline says (its line,
 * the video bullets, the «What's included» boxes) lives in
 * `data/recorridoContenido.en.ts`, not here.
 */
export const elMetodo = {
  "elMetodo.titulo": "THE MAP",
  /** The house name is a proper noun: it's already in English in the Spanish
   *  file too (see `header.marca` and src/i18n/GLOSARIO.md). */
  "elMetodo.subtitulo": "by 'Life as a Privilege'",
  "elMetodo.lema": "Eight disciplines. One order. One purpose: to understand yourself.",
  "elMetodo.intro":
    "These aren't eight independent courses.\nIt's a guided exploration of yourself through eight different perspectives, to find the root of your patterns and understand yourself.",
  "elMetodo.porDentro": "You don't study eight disciplines.\nYou discover yourself from eight perspectives.",
  /** Right under the title: tells you the mandala is clickable. */
  "elMetodo.porDentroPista": "Click each circle to discover it",
  "elMetodo.cadaDisciplina": "Pick whatever order you want. I suggest this one:",
  /** Header of the boxes on the discipline card (DisciplinaFicha). */
  "elMetodo.queIncluye": "What's included",

  // ── Each discipline's video box (DisciplinaVideoBox) ───────────────────
  "elMetodo.saberMas": "Learn more",
  "elMetodo.muestra": "Preview",
  "elMetodo.videoProximamente": "Video coming soon",

  // ── What you get ───────────────────────────────────────────────────────
  "elMetodo.queObtienes": "What do you get when you access The Map?",
  "elMetodo.obtienes.1": "A personalized reading of your birth chart, done by me.",
  "elMetodo.obtienes.2": "A guided journey, with a coherent, concrete order.",
  "elMetodo.obtienes.3": "Reading materials, illustrations and step-by-step explanations.",
  "elMetodo.obtienes.4": "Practical exercises to integrate what you learn into your everyday life.",
  "elMetodo.obtienes.5": "Access for 1 year. The PDFs will be yours forever.",
  "elMetodo.obtienes.6": "Buy by discipline. Move at your own pace, with no subscriptions and no commitments.",
  "elMetodo.obtienes.7": "The option of calls to clear up questions or go deeper into your process.",
  "elMetodo.obtienes.8": "Access to all the courses and illustrations.",

  // ── 1. Hero ────────────────────────────────────────────────────────────
  // The first thing a stranger reads. The headline does NOT name the product:
  // it names what's happening to whoever lands here. The brand sits above, small.
  "elMetodo.hero.marca": "THE MAP · by 'Life as a Privilege'",
  /** The headline lead-in, in two beats: the first in regular type and the
   *  second in italics (it's the one that drops the big question below).
   *  Two keys because they're painted with different styles. */
  "elMetodo.hero.tituloAntes": "To change,",
  "elMetodo.hero.tituloPide": "ask yourself",
  "elMetodo.hero.titulo": "What happened to you?",
  "elMetodo.hero.sub":
    "Science and tradition to understand your mind, your history and your body.",
  // No longer goes to checkout: it opens the «find your discipline» TEST.
  "elMetodo.hero.cta": "Initial test",
  // Under the button, the hero's only fine print: takes the fear out of
  // clicking (no subscription behind it, nothing to cancel later).
  "elMetodo.hero.ctaPie": "From €30 · No subscription · No commitment",
  /** The button next to the start one. It no longer goes to the community: it
   *  goes to MY WhatsApp. On the first screen there's not enough trust yet to
   *  join a group of strangers, but there is enough to ask one thing; the
   *  community is offered further down, in «Where do I start?». */
  "elMetodo.hero.escribeme": "Talk to me",
  /** The button next to «Start for €30», in «Where do I start?». */
  "elMetodo.hero.comunidad": "Join the community",
  /** Pre-written message when the chat opens from the hero: so they don't have
   *  to think how to begin, which is exactly where people drop off. */
  "elMetodo.hero.escribemeTexto": "Hi María! I'm writing from Life as a Privilege.",

  // ── 2. The mirror ──────────────────────────────────────────────────────
  // Four lines so the reader recognizes themselves before we explain anything.
  // They build up, and the fourth turns the whole question around.
  "elMetodo.espejo.1": "You know something's going on with you, but not why.",
  "elMetodo.espejo.2": "People tell you you should cheer up, relax and be happy.",
  "elMetodo.espejo.3": "So you've tried going out, distracting yourself, having fun, laughing… but the next day, you're back in the same place.",
  "elMetodo.espejo.4": "The question isn't what's wrong with you, but what happened to you.",
  "elMetodo.espejo.cierre":
    "The Map doesn't give you one more technique.\nIt walks with you to **discover your mind, your history, your wounds and your body**.",

  // Under the mandala that comes right before the origin comic: the one at the
  // center of the eight disciplines.
  "elMetodo.mandalaTu": "You",

  // ── 3. The line that says what this is ─────────────────────────────────
  // Two standalone lines, one under the other, both centered: the first says
  // what this is NOT and the second what it is. Separate keys (not one \n) so
  // neither inherits the other's indent.
  "elMetodo.mecanismo.clave": "**You don't study the discipline — you study yourself with it.**",
  "elMetodo.mecanismo.clave2": "",

  // ── 7. The proof (the eight videos) ────────────────────────────────────
  // Right before the price: up to here the page promises, here it shows.
  "elMetodo.pruebas.titulo": "The Map from the inside",
  "elMetodo.pruebas.sub":
    "The eight disciplines from the inside, just as you'll see them. Tap any one to watch it.",

  // ── 8. Price ───────────────────────────────────────────────────────────
  "elMetodo.precio.titulo": "What it costs, no mystery",
  "elMetodo.precio.una.nombre": "One discipline",
  /** The three-beat line under the price. {precio} comes from
   *  pagoDisciplinaLink: the figure is NEVER written by hand here. */
  "elMetodo.precio.una.destacado": "{precio} · One complete discipline · No subscription",
  "elMetodo.precio.una.desc":
    "The entire journey of that discipline, with its illustrations, its exercises and what you take away from it.",
  // Not called «The whole Map»: it's not a pack paid in one go, it's the eight
  // bought one by one. The name and the written math make that clear.
  "elMetodo.precio.mapa.nombre": "All eight disciplines",
  "elMetodo.precio.mapa.destacado": "{num} disciplines · {precio} each · {total} in total",
  "elMetodo.precio.mapa.desc": "There's no single payment. You buy them whenever you want.",
  // The page's CLOSING block (the two twin cards at the end).
  "elMetodo.precio.cierre.titulo": "Start whenever you want",
  "elMetodo.precio.cierre1.nombre": "Single discipline",
  "elMetodo.precio.cierre1.importe": "€30",
  "elMetodo.precio.cierre1.desc": "Full access to one discipline.",
  "elMetodo.precio.cierre2.nombre": "One-on-one session",
  "elMetodo.precio.cierre2.importe": "€15 / hour",
  "elMetodo.precio.cierre2.desc": "Optional support.",
  /** Button repeated after the price and after «Where do I start?». */
  "elMetodo.empezarPor": "Start for {precio}",

  // ── 10. Where do I start? ──────────────────────────────────────────────
  "elMetodo.empiezo.titulo": "Where do I start?",
  "elMetodo.empiezo.intro":
    "There's no required order, but there is a recommended one.",
  "elMetodo.empiezo.a.titulo": "If you don't know where to start",
  "elMetodo.empiezo.a.texto":
    "Start with Psychology or Astrology. Understand yourself before your body, your soul or History.",
  "elMetodo.empiezo.b.titulo": "If you want to understand your history",
  "elMetodo.empiezo.b.texto":
    "Start with Psychology. You rebuild your history, where your patterns come from and why you keep holding onto them.",
  "elMetodo.empiezo.c.titulo": "If the body is your thing",
  "elMetodo.empiezo.c.texto":
    "Start with Physiology or Nutrition. Expand what's already familiar to you and end up understanding the rest.",

  // ── 12. Questions ──────────────────────────────────────────────────────
  // The first one is deliberately the uncomfortable one: mixing astrology with
  // cellular physiology is THE objection to this site, and it gets answered
  // head-on.
  "elMetodo.faq.titulo": "What people usually ask",
  "elMetodo.faq.1.p": "Is this esoteric? Do I have to believe in astrology?",
  "elMetodo.faq.1.r":
    "I'm not asking you to believe. The birth chart is a symbolic map of the circumstances that have helped shape your inner world. You don't need to believe; just be willing to look from another perspective. Give yourself the chance to explore it. You might find more in it than you expected.",
  "elMetodo.faq.2.p": "How much time do I need?",
  "elMetodo.faq.2.r":
    "As much as you want. There are no live classes and no set dates: you move step by step and what you've done stays saved. Some people finish a discipline in a weekend, and some take two months.",
  "elMetodo.faq.3.p": "Do I need a background in anything?",
  "elMetodo.faq.3.r":
    "None. Everything starts from zero and is illustrated. If something needs a prior concept, that concept gets explained first.",
  "elMetodo.faq.4.p": "Is it a subscription?",
  "elMetodo.faq.4.r":
    "No. You pay once per discipline and that's it. There's no monthly fee and no auto-renewal, and creating your account costs nothing and doesn't ask for a card.",
  "elMetodo.faq.5.p": "Can I do just one discipline?",
  "elMetodo.faq.5.r":
    "Yes. Each one is a complete journey in itself. The whole Map gives you the full picture, but you can walk just one and get everything out of it.",
  "elMetodo.faq.6.p": "Do I have to do them in order?",
  "elMetodo.faq.6.r":
    "No. The order of The Map is the recommended one, not an obligation: you can open whichever one you want, whenever you want.",
  "elMetodo.faq.7.p": "Will I be alone in this?",
  "elMetodo.faq.7.r":
    "No. I read your chart by hand and I'm on the other side for whatever you need. The first 20-minute call is free, and you can ask for more whenever you want.",
  "elMetodo.faq.8.p": "Does it work if I'm already in therapy?",
  "elMetodo.faq.8.r":
    "Yes, and it usually goes along with it very well. This doesn't replace treatment and doesn't try to: it's an exploration of yourself that gives you material and words to understand yourself as a whole, not in pieces.",
  "elMetodo.faq.9.p": "Are the drawings made with generative AI?",
  "elMetodo.faq.9.r":
    "Yes. The intention behind the drawings is to give you context and let you immerse yourself in the explanation. If you want art, I wholeheartedly recommend you go to museums.",

  // ── 13. Sticky bar (mobile) ────────────────────────────────────────────
  "elMetodo.barra.desde": "From {precio}",
  "elMetodo.barra.cta": "Start",
  /** The short version of «sinTarjeta»: the full line doesn't fit in the bar. */
  "elMetodo.sinTarjeta.corto": "No card to sign up",

  // ── Calls to action ────────────────────────────────────────────────────
  "elMetodo.acceder": "Access The Map",
  /** Under the big button: takes the fear out of clicking (signing up doesn't charge). */
  "elMetodo.sinTarjeta": "You don't need a credit card to create your account",
  "elMetodo.agendar": "Book a free call (20 min)",
  "elMetodo.dudas": "I have questions",
  "elMetodo.dudas.asunto": "Question — Life as a Privilege",
  "elMetodo.dudas.placeholder": "Write your question here...",

  // ── Floating buttons + free call popup ─────────────────────────────────
  // The popup opens on its own: 20 s after landing and, once closed, again at 70 s.
  /** The floating button for the «which discipline do I start with?» test. */
  "elMetodo.test.boton": "Initial test",

  // ── The «find your discipline» test (TestDisciplina) ────────────────────
  // The questions and answers live with their scores in TestDisciplina.tsx
  // (type Texto {es,en}); this is only the popup's carpentry.
  /** The twin of «Start for €30» (CtaEmpezar). */
  "elMetodo.test.botonEmpezar": "Test before you start",
  "elMetodo.test.titulo": "Find your discipline",
  "elMetodo.test.sub": "8 questions · 2 minutes · free",
  "elMetodo.test.ver": "See my discipline",
  "elMetodo.test.faltan": "{n} unanswered",
  "elMetodo.test.resultado": "Your discipline to start with",
  "elMetodo.test.verDisciplina": "View discipline",
  "elMetodo.test.cerrar": "Close the test",
  /** Its sibling. «Message» and not «Write to me»: it names the channel, and
   *  the glyph next to it already says the channel is WhatsApp. */
  "elMetodo.llamada.botonMensaje": "Message",
  // The title goes on TWO lines: the «at no cost» drops below, smaller and in
  // italics. That's why it's two keys and not one with a line break: each line
  // has its own typography, and in English the words don't split the same way.
  "elMetodo.llamada.titulo": "Let's talk",
  "elMetodo.llamada.tituloSufijo": "at no cost",
  "elMetodo.llamada.texto": "Tell me what you're looking for and we'll see where to start.",
  "elMetodo.llamada.remate": "",
  "elMetodo.llamada.whatsapp": "Message me on WhatsApp",
  /** Pre-written message when the chat opens: so they don't have to think how
   *  to begin, which is exactly where people drop off. */
  "elMetodo.llamada.whatsappTexto": "Hi María! I'm writing from Life as a Privilege.",
  "elMetodo.llamada.cta": "Book a call",
  "elMetodo.llamada.cerrar": "Close",

  // ── The origin comic (ComicPorQueExiste) ───────────────────────────────
  // Only the navigation labels (screen readers read them). The eleven panels
  // are translated in `components/metodo/comicElMapa.en.ts`.
  "elMetodo.comic.anterior": "Previous panel",
  "elMetodo.comic.siguiente": "Next panel",
  "elMetodo.comic.irA": "Go to panel: {titulo}",
};
