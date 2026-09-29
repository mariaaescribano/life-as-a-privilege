export const web = {
  // ── 404 ────────────────────────────────────────────────────────────────
  "web.404.titulo": "This page doesn't exist",
  "web.404.texto":
    "The link may be misspelled, or the page may have moved. Go back to the start and follow the path from there.",
  "web.404.inicio": "Go to the start",
  "web.404.recorrido": "See The Map",

  // ── Legal pages ────────────────────────────────────────────────────────
  // The body of the legal texts is NOT translated (see the notice below):
  // they are binding documents that cite Spanish law (LSSI, RGPD, TRLGDCU).
  "legal.ultimaActualizacion": "Last updated: {fecha}",
  "legal.soloEspanol":
    "The legal texts on this site are available only in Spanish, which is their valid version.",

  // ── Materials (/materiales) ────────────────────────────────────────────
  "materiales.subtitulo": "Content created and curated by María",
  "materiales.ilustraciones": "Illustrations",
  "materiales.libros": "Books",
  "materiales.programas": "Programs",

  // ── Programs (/programas) ──────────────────────────────────────────────
  // Each program is a slide (or several) plus its podcast: the same thing,
  // seen and heard. They're numbered within their discipline.
  "programas.subtitulo": "Each idea, in a slide and in its podcast",
  "programas.vacio": "No programs published yet. Come back soon.",
  "programas.numero": "Program {n}",
  "programas.cuenta": "{n} programs",
  "programas.cuentaUno": "1 program",
  "programas.diapositiva": "Slide {n} of {total}",
  "programas.podcast": "The podcast",
  "programas.verDiapositivas": "See the slides",
  "programas.escucharPodcast": "Listen to the podcast",
  "programas.enPreparacion": "In preparation: neither the slides nor the podcast are here yet.",
  "programas.sinPodcast": "The podcast for this program isn't published yet.",
  "programas.sinDiapositivas": "The slides for this program aren't published yet.",
  "programas.volver": "All programs",
  "programas.anterior": "Previous",
  "programas.siguiente": "Next",
  "programas.noExiste": "This program doesn't exist",

  // ── Discipline landing (/disciplina/:disciplina) ───────────────────────
  // The three doors, the same for all eight disciplines.
  "portada.ilustraciones": "Illustrations",
  "portada.cursos": "Courses",
  "portada.recorrido": "The Map",
  "portada.recorridoPack": "The pack",

  // ── Videos (/videos) ───────────────────────────────────────────────────
  "videos.subtitulo": "",
  "videos.vacio": "No videos published yet. Come back soon.",
  "videos.fuera": "This video can't be watched in here.",
  "videos.abrirEn": "Open on {red}",

  // ── Creator card (CreadoraCard) ────────────────────────────────────────
  "creadora.accion": "Meet the creator",
  // «Ingeniera informática» is the degree: translate it as the title, not the
  // job («software engineer» would say something else about her).
  "creadora.bio":
    "Computer engineer. I rebuilt the path so many of us walk: a map where psychology, biology, and traditional knowledge combine instead of fighting each other. Now they're allies in the service of your growth.",

  // ── Subscribe box (SubscribeBox) ───────────────────────────────────────
  "suscribir.titulo": "Don't miss a thing.",
  "suscribir.texto": "When I publish new content, you'll be the first to know.",
  "suscribir.placeholder": "Your email",
  "suscribir.boton": "Subscribe",
  "suscribir.ok": "Registered successfully",
  "suscribir.gracias": "Thank you for wanting to learn",
  "suscribir.invalido": "Enter a valid email",
  "suscribir.error": "It couldn't be sent. Try again in a moment.",
  "suscribir.baja": "You can unsubscribe whenever you want",

  // ── Basic data-protection information (art. 13 GDPR) ───────────────────
  // Goes under every form that collects data; the details, in /privacidad.
  "privacidad.infoRegistro":
    "By signing up you confirm that you're 18 or older and accept the terms of use. María Escribano processes your data to manage your account and your journey; it isn't shared with anyone except the providers that keep the site running. You can access, correct, or delete your data (and also delete your account from your profile). More in the",
  "privacidad.infoOpinion":
    "Your name and your review will be published on this page; the email is optional, is never published, and is only used to be able to reply to you. If you want to take it down, write to mariaa.escribano.arce@gmail.com. More in the",
  "privacidad.enlace": "privacy policy",

  // ── Health consent (PuertaConsentimientoSalud) ─────────────────────────
  "consentimiento.titulo": "Before you continue",
  "consentimiento.texto":
    "Along the journey you're going to write things about yourself, and some of them may reveal information about your physical or emotional health. The law requires you to give your express permission before they can be stored. You only need to do it once.",
  "consentimiento.casilla":
    "I expressly consent to the storage of the texts and answers I write inside the journey, including those that reveal information about my physical or emotional health, and I authorize María Escribano to read them for the sole purpose of accompanying me and preparing my personalized readings.",
  "consentimiento.nota":
    "They aren't shared with anyone else or used for anything else. You can withdraw this permission whenever you want from Contact, and delete your account with everything you've written from your profile.",
  "consentimiento.boton": "Give my permission",
  "consentimiento.volver": "Not now",
  "consentimiento.error": "It couldn't be saved. Try again in a moment.",

  // ── Cookie banner (the bar at the bottom, not the legal page) ──────────
  "cookies.aviso":
    "We use cookies so the site works and to keep you logged in. We'd also like to use Google Analytics cookies to improve the site, but **only if you allow it**.",
  "cookies.masInfo": "More information",
  "cookies.rechazar": "Decline",
  "cookies.aceptar": "Accept",

  // ── Error screen (ErrorBoundary) ───────────────────────────────────────
  "error.titulo": "Something went sideways for a moment",
  "error.texto": "Don't worry: your data is saved. Reload the page to continue.",
  "error.recargar": "Reload",

  // ── Booking a call (BookCallModal, AgendarLlamada, BotonCompania) ──────
  "llamada.agenda": "Let's talk",
  "llamada.reserva": "Book your call",
  "llamada.gratis": "20 minutes, no cost · mainland Spain time",
  "llamada.elegirDia": "Pick a day",
  "llamada.elegirHora": "Pick a time",
  "llamada.cambiarDia": "← Change day",
  "llamada.tusDatos": "Your details",
  "llamada.nombre": "Your name",
  "llamada.email": "Your email",
  "llamada.tema": "What would you like to talk about? (optional)",
  "llamada.pagoSeguro": "Secure card payment through Stripe.",
  "llamada.confirmada": "Booking confirmed!",
  "llamada.reservada": "Call booked!",
  "llamada.confirmandoPago": "Confirming your payment…",
  "llamada.confirmandoTexto": "One moment, we're confirming your booking.",
  "llamada.reservarOtra": "Book another",
  "llamada.continuarPago": "Continue to payment →",
  "llamada.pago": "Payment",
  "llamada.fecha": "Date",
  "llamada.hora": "Time",
  "llamada.total": "Total",
  "llamada.cambiarHora": "← Change time",
  "llamada.volver": "← Back",
  "llamada.entendido": "Got it",
  "llamada.queEsEsto": "What's this?",
  "llamada.acompanar": "Book your call →",
  "llamada.acompanarTexto":
    "You can walk this stretch with me. Book a call — you don't have to do it all on your own.",
  // Booking and payment errors (previously hard-coded in the components).
  "llamada.error.horarioOcupadoPago":
    "That time slot got booked while the payment was processing. Write to me and I'll move your call or refund you.",
  "llamada.error.pagoIncompleto": "The payment didn't go through. You can try again.",
  "llamada.error.confirmar": "The booking couldn't be confirmed. Write to me and we'll sort it out.",
  "llamada.error.pagoCancelado": "You canceled the payment. Your call hasn't been booked.",
  "llamada.error.iniciarPago": "The payment couldn't be started. Try again.",
  "llamada.error.horarioOcupado": "That time slot was just booked. Please pick another.",
  "llamada.error.generico": "Something went wrong. Please try again.",

  // ── Exit modal (ExitIntentSubscribeModal) ──────────────────────────────
  "salida.titulo": "Before you go...",
  "salida.texto": "Subscribe and get an email when there's content.",
  "salida.noGracias": "No, thanks",

  // ── Account needed (LoginRequiredModal) ────────────────────────────────
  "login.necesaria": "Create an account or log in",
  "login.entrar": "Log in →",

  // ── My notes (MiniDiario) ──────────────────────────────────────────────
  "diario.titulo": "My notes",
  "diario.abrir": "Open my notes",
  "diario.borrarNota": "Delete note",
  "diario.volverEscribir": "← Back to writing",
  "diario.escribir": "What do you want to write?",
  "diario.verNotas": "← See my notes",
  "diario.vacio": "You haven't written any notes yet.",

  // ── Products banner ────────────────────────────────────────────────────
  "productos.titulo": "Natural Products",
  "productos.lema": "Take care of yourself with natural ingredients and the Love of mother earth.",
  "productos.texto":
    "Discover all the products made with natural ingredients and Love. Take care of yourself with the tools mother earth has given us.",
  "productos.verMas": "See more →",

  // ── Buying access (SubscribeModal) ─────────────────────────────────────
  "acceso.email":
    "Enter the email you want to use to access the courses. Then we'll take you to the secure payment and, once it's confirmed, you'll receive your access code by email.",
  "acceso.apuntarme": "I want to sign up",
  "acceso.preparando": "Preparing…",
  "acceso.continuarPago": "Continue to payment",
  "acceso.recibidos": "Details received",
  "acceso.irPago": "Go to payment →",
  "acceso.pack": "Full pack",
  "acceso.incluye": "1-year access to courses and materials · consultations separate",
  "acceso.pagarTexto":
    "Press the button to complete the **{precio}** payment in Stripe. Once it's confirmed, you'll receive your access code by email.",

  // ── Waitlist (WaitlistModal) ───────────────────────────────────────────
  "espera.texto":
    "It's currently under development. Leave your email to be among the first to know.",
  "espera.gracias": "Thank you!",
  "espera.aviso": "I'll let you know as soon as The Map is available.",

  // ── Odds and ends ──────────────────────────────────────────────────────
  "foto.etiqueta": "Enlarge",
  "foto.ampliar": "Click to see it larger",
  "experiencias.titulo": "Real experiences",
  "experiencias.cierre": "If they found answers here, so can you.",
  "experiencias.verMas": "See more experiences →",
  "libros.descargarPdf": "Download PDF",
  "libros.condiciones": "purchase terms",
};
