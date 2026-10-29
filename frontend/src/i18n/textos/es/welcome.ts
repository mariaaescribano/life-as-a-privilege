/**
 * Portada (/) — Welcome.tsx.
 *
 * Aquí viven las frases de las 8 disciplinas que antes estaban en
 * `data/welcomeDisciplinas.ts`: el lema de la tarjeta (`lema`) y el texto del
 * modal que se abre al pincharla (`desc`). Se editan libremente; al tocar una
 * frase, acuérdate de tocar también su versión inglesa en `../en/welcome.ts`.
 */
export const welcome = {
  // El titular de la portada es el nombre de la casa y sale de `header.marca`
  // (ahí también se lee el rótulo del header): un solo sitio donde cambiarlo.
  "welcome.subtitulo": "Ciencia, psicología y tradición para descubrir nuevas perspectivas desde las que comprenderte.",
  // ── Cabecera de la portada (frase + formulario + foto) ──
  "welcome.hero.frase": "Descubre nuevas perspectivas de ti a través de una mirada multidisciplinar",
  "welcome.hero.gratis": "Introducción gratuita",
  "welcome.hero.foto": "Te asesoro en mente, cuerpo y tradición para construir una visión integrada de ti.",
  "welcome.hero.nombre": "Tu nombre",
  // Las tres ideas de fondo (segunda sección, WelcomePilares)
  "welcome.pilar.1.titulo": "Autoconocimiento",
  "welcome.pilar.1.texto": "Explora tu propia historia, identifica tus patrones y comprende cómo determinadas formas de pensar o actuar pudieron tener sentido en el pasado pero ya no son útiles en el presente.",
  "welcome.pilar.2.titulo": "Autoaceptación",
  "welcome.pilar.2.texto": "Aprende a observarte desde perspectivas diferentes, sin reducir la propia identidad a una etiqueta, un defecto o una dificultad.",
  "welcome.pilar.3.titulo": "Automejora",
  "welcome.pilar.3.texto": "No te justifiques con lo que parece negativo. Úsalo para saber dónde poner el foco y mejorar tu calidad de vida, mejorando cada día como ser humano.",
  "welcome.explorar": "Explorar",
  "welcome.explorarDisciplina": "Explorar disciplina",
  "welcome.modal.cuenta": "Crea una cuenta o inicia sesión",
  "welcome.modal.iniciarSesion": "Iniciar sesión →",

  // ── Lemas de las tarjetas ──────────────────────────────────────────────
  "welcome.lema.astrologia": "La manifestación de tu esencia.",
  "welcome.lema.psicologia": "Comprende tu historia y su influencia.",
  "welcome.lema.hinduismo": "Explora tu constitución personal.",
  "welcome.lema.medicinaChina": "Reconecta con tu equilibrio.",
  "welcome.lema.fisiologia": "Conoce tu cuerpo para cuidarte.",
  "welcome.lema.nutricion": "Descubre cómo el alimento se hace tu cuerpo.",
  "welcome.lema.cabala": "La estructura del alma humana.",
  "welcome.lema.cultura": "Valora tu realidad aprendiendo filosofía e historia.",

  // ── Descripción del modal de cada disciplina ───────────────────────────
  "welcome.desc.astrologia":
    "Los arquetipos que actúan en cada área de tu Vida. Entiende cómo funcionan en ti y deja de pelearte contigo.",
  "welcome.desc.psicologia":
    "El porqué de tus hábitos, tus enfados y tus repeticiones. No para justificarlos: para dejar de necesitarlos.",
  "welcome.desc.hinduismo":
    "Cinco mil años leyendo al ser humano como parte de la naturaleza, puesto que no es algo separado de ella.",
  "welcome.desc.medicinaChina":
    "Cinco elementos. Una naturaleza. Un ser humano. Un sistema de 3000 años para entender el origen de tus desequilibrios.",
  "welcome.desc.fisiologia":
    "No tenemos un cuerpo. Somos un cuerpo. Entiende cómo funcionas.",
  "welcome.desc.nutricion":
    "Qué hace cada alimento dentro de ti. Cómo te reconstruyes con tu alimentación. Conoce más para temer menos y elegir mejor.",
  "welcome.desc.cabala":
    "El mapa del alma humana. Diez Sefirot para entender qué te equilibra y qué te desequilibra.",
  "welcome.desc.cultura":
    "Historia y filosofía cronológicamente.",
  /** Las cuatro cajas de la portada (tercer apartado). */
  "welcome.cuatro.cuerpo": "Cuerpo",
  "welcome.cuatro.mente": "Mente",
  "welcome.cuatro.tradicion": "Tradición",
  "welcome.cuatro.cultura": "Cultura",
  /** Los botones grandes de la portada. */
  "welcome.boton.asesoria": "Quiero una asesoría",
  "welcome.boton.premium": "Quiero el contenido premium",
} as const;
