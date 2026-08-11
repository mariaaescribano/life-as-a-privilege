/**
 * Presentaciones de disciplina (/d/:disciplina) — las páginas del QR del cartel.
 *
 * `{disciplina}` se sustituye por el nombre ya traducido. Los `**…**` salen en
 * negrita (ver `TextoRico`): se dejan dentro de la frase para poder mover el
 * énfasis al sitio que le toque en cada idioma.
 *
 * OJO: las cajas de «Qué incluye» de cada página NO están aquí. Salen de
 * `recorridoContenido`, el mismo sitio del que bebe /elMetodo, para no tener
 * dos copias del mismo párrafo que se acaban desincronizando.
 */
export const presentacion = {
  // ── Cierre común a las nueve ───────────────────────────────────────────
  "presentacion.empiezaPor": "Empieza por {disciplina}",
  "presentacion.soloUna":
    "Puedes recorrer **solo {disciplina}**. Es un recorrido completo en sí mismo, con sus ilustraciones, sus ejercicios y su acompañamiento, y no hay ningún orden obligatorio: se empieza por donde tenga sentido para ti.",
  "presentacion.ochoMiradas":
    "Pero {disciplina} es una de las **ocho miradas** de El Mapa. Cada una explica una parte del ser humano —tu carácter, tu historia, tu cuerpo, tu alimentación, tu alma, tus ideas— y el propósito de recorrerlas es uno solo: **entenderte del todo**. Ninguna disciplina sola contesta la pregunta; juntas son un camino.",
  /** Barra ancha que abre «Empieza por aquí», encima de la caja. Va en
   *  versales, así que cuanto más corta, mejor. */
  "presentacion.empezar": "Empezar",
  "presentacion.crearCuenta": "Crear mi cuenta",
  "presentacion.llamada": "Llamada de 20 min sin coste",
  "presentacion.verOcho": "Ver las ocho disciplinas",
  "presentacion.verCurso": "Ver el curso",

  // ── Títulos de sección compartidos ─────────────────────────────────────
  "presentacion.sec.deQueTrata": "De qué trata",
  "presentacion.sec.queVasAComprender": "Qué vas a comprender",
  "presentacion.sec.miralo": "Míralo con tus ojos",
  "presentacion.sec.loQueHayDentro": "Lo que hay dentro",
  "presentacion.sec.ilustraciones": "Ilustraciones de {disciplina}",
  "presentacion.sec.laCreadora": "La creadora",
  "presentacion.sec.empiezaPorAqui": "Empieza por aquí",

  // ── El mapa que se va armando (MapaSeArma) ─────────────────────────────
  "presentacion.mapa.ochoMiradasPie": "Las ocho miradas, sobre la misma persona.",
  "presentacion.mapa.vacio": "Tu mapa empieza vacío.",
  /** Pie de la última casilla de una rejilla recortada: «+3 · más dentro». */
  "presentacion.masDentro": "más dentro",

  // ── Astrología ─────────────────────────────────────────────────────────
  "presentacion.astro.cartaMuestra": "Carta de muestra",

  // ── Ayurveda ───────────────────────────────────────────────────────────
  "presentacion.ayurveda.tresDoshas": "Los tres Doṣhas",
  "presentacion.ayurveda.prakriti":
    "Todos tenemos los tres. Lo que cambia es la proporción, y esa proporción única es tu **Prakṛti**: la forma en que la naturaleza se expresa en ti.",
  "presentacion.ayurveda.cualPredomina": "Dentro descubrirás cuál predomina en ti.",

  // ── Cábala ─────────────────────────────────────────────────────────────
  "presentacion.cabala.arbol": "El Árbol de la Vida",
  // YA NO SE PINTA: iba encima del Árbol, dentro de su caja, y lo descentraba.
  // Se deja escrito por si vuelve (en /d/cabala, bloque 3).
  "presentacion.cabala.arbolTexto":
    "Diez dimensiones y una más oculta —Da'at— unidas por veintidós senderos. No es un adorno: es un mapa del alma humana con más de mil años de estudio. **Pulsa cualquiera y la lees.**",

  // ── Cultura ────────────────────────────────────────────────────────────
  "presentacion.cultura.seisHistorias": "Las seis Historias",
  "presentacion.cultura.lineasTiempo": "Sus líneas del tiempo",
  "presentacion.cultura.lineasTexto":
    "Cada Historia se recorre por su línea del tiempo, era por era. Estas son, solo para que las veas.",

  // ── Fisiología ─────────────────────────────────────────────────────────
  "presentacion.fisio.sistemas": "Los sistemas",
  "presentacion.fisio.sistemasTexto":
    "Varios órganos que colaboran forman un sistema. Pulsa cualquiera y lo lees entero, igual que lo harás dentro del recorrido.",
  "presentacion.fisio.dentro": "Dentro los conocerás todos…",
  "presentacion.fisio.deQueEstasHecho": "De qué estás hecho",
  "presentacion.fisio.celulasTexto":
    "Tu cuerpo no es una idea: son células trabajando ahora mismo, cada una con su oficio. Dentro hay {n} tipos con su ficha. Aquí van ocho.",

  // ── Nutrición ──────────────────────────────────────────────────────────
  "presentacion.nutri.nutrientes": "Los nutrientes",
  "presentacion.nutri.nutrientesTexto":
    "Estas son las moléculas que componen lo que comes: pulsa cualquiera y lee qué hace de verdad dentro de ti.",
  "presentacion.nutri.mitoOVerdad": "Mito o verdad",
  // Pies del mosaico de muestra de /d/nutricion (seis acuarelas).
  "presentacion.nutri.microbiota": "Microbiota",
  "presentacion.nutri.agua": "Agua",
  "presentacion.nutri.fibra": "Fibra",
  "presentacion.nutri.fitoquimicos": "Fitoquímicos",
  "presentacion.nutri.deDondeViene": "De dónde viene",
  "presentacion.nutri.deLaFlorAlFruto": "De la flor al fruto",
  "presentacion.nutri.elHambre": "El hambre",
  "presentacion.nutri.dentro": "Dentro conocerás los secretos de la nutrición…",

  // ── Psicología ─────────────────────────────────────────────────────────
  "presentacion.psico.psicoterapiaBreve": "Basado en la Psicoterapia Breve",
  "presentacion.psico.comicsTexto": "Algunos de los cómics que acompañan el recorrido. Pulsa para leer.",
  "presentacion.psico.cursos": "Cursos de {disciplina}",
  "presentacion.psico.cursosPreparando":
    "Los cursos se están preparando. Entra a verlos con el enlace de abajo.",
  "presentacion.psico.verTodos": "Ver todos los cursos",
  "presentacion.psico.dentro": "Descubre mucho más dentro…",

  // ── Medicina China ─────────────────────────────────────────────────────
  "presentacion.tcm.cincoElementos": "Los Cinco Elementos",
  "presentacion.tcm.elementosTexto":
    "Ningún síntoma aparece aislado: aparece en un sistema.",
  "presentacion.tcm.comoSeRelacionan": "Cómo se relacionan",
  // Los nombres en pinyin (Sheng, Ke) y los hanzi no se traducen.
  "presentacion.tcm.cicloSheng": "Ciclo generador",
  "presentacion.tcm.cicloShengSub": "Cada elemento alimenta al siguiente",
  "presentacion.tcm.cicloKe": "Ciclo de control",
  "presentacion.tcm.cicloKeSub": "Cada elemento pone límite a otro",
  "presentacion.tcm.flechasTexto":
    "Pulsa cualquier flecha y verás qué hace un elemento sobre el siguiente.",
} as const;
