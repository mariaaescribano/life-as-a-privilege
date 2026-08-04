/* ─────────────────────────────────────────────────────────────────────────────
 *  TEXTOS DEL RECORRIDO — modal de cada disciplina en /elMetodo
 *  Edita libremente este archivo: títulos, frases, items, avisos.
 *  La estructura visual (colores, iconos) está en ElMetodo.tsx.
 * ───────────────────────────────────────────────────────────────────────────── */

export type ContenidoSeccion = {
  titulo: string;
  items: string[];
  aviso?: string;
};

/** Texto introductorio del box de al lado del mandala (/elMetodo): un título
 *  y una lista de puntos con ✓. Debajo va un botón que abre el vídeo. */
export type VideoIntro = {
  titulo: string;
  puntos: string[];
  /** Texto del botón (por defecto "Muestra"). */
  boton?: string;
};

/** Nombre a mostrar en El Mapa (/elMetodo). Internamente Ayurveda se llama
 *  "Hinduismo" (ayurvedaNom, usado para rutas y claves de fondo/estilos), pero
 *  en El Mapa se muestra como "Ayurveda". El resto se muestra igual. */
export const nombreEnMapa = (nom: string): string =>
  nom === "Hinduismo" ? "Ayurveda" : nom;

export type DisciplinaContenido = {
  /** Frase introductoria en cursiva dentro del modal (1 línea) */
  desc: string;
  /** Descripción larga del modal (actualmente no se muestra, queda en backup) */
  modalDesc: string;
  /** 3 cajas dentro del modal */
  contenido: ContenidoSeccion[];
  /** Texto del box de al lado del mandala (título + puntos con ✓). */
  videoIntro: VideoIntro;
};

export const recorridoContenido: Record<
  "astrologia" | "psicologia" | "ayurveda" | "tcm" | "fisiologia" | "nutricion" | "cabala" | "cultura",
  DisciplinaContenido
> = {

  // ───────────────────────────────────────────────────────────
  // 1. ASTROLOGÍA
  // ───────────────────────────────────────────────────────────
  astrologia: {
    desc: "Tu carta natal como punto de partida. Entiéndete sin juzgarte antes de intentar cambiarte.",
    videoIntro: {
      titulo: "Un recorrido guiado para comprender tu carta natal y conocerte con mayor profundidad.",
      puntos: [
        "Una interpretación personal de tu carta, realizada por mí, no por una IA.",
        "Explicaciones claras, paso a paso, para entender cada parte de tu carta.",
        "Descubre cómo se relacionan tu personalidad, tus fortalezas y tus desafíos.",
        "Aprende a utilizar tu carta como una herramienta de autoconocimiento para toda tu Vida.",
      ],
    },
    modalDesc:
      "Tu carta natal no predice tu futuro: describe cómo estás configurado. Qué partes tuyas tienen más peso, qué tensiones internas arrastras, qué te cuesta y qué te sale solo. Es el primer paso de El Mapa porque sin saber de dónde partes, cualquier trabajo posterior va a ciegas.",
    contenido: [
      {
        titulo: "Conócete sin juicios",
        items: [
          "Comprende qué fuerzas mueven tu personalidad, qué conflictos internos se repiten y por qué vuelves una y otra vez a los mismos patrones. Todo ello a través de una lectura que interpreto personalmente.",
        ],
      },
      {
        titulo: "Las partes de ti",
        items: [
          "Cada área de tu carta representa una parte diferente de ti. Aprenderás a reconocer cuál está tomando el control en cada momento para actuar con más conciencia, en lugar de reaccionar automáticamente.",
        ],
      },
      {
        titulo: "Acompañamiento personal: No estás solo",
        items: [
          "Si quieres profundizar, puedes agendar sesiones conmigo para lo que necesites. Comprenderás mejor tu carta y aprenderás a utilizarla como una herramienta de autoconocimiento para toda tu Vida.",
        ],
        aviso: "Opcional. Se cobra aparte",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 2. PSICOLOGÍA (neuropsicología)
  // ───────────────────────────────────────────────────────────
  psicologia: {
    desc: "Tu carta dice cómo estás configurado. Tu historia cómo y para qué. Aquí los unimos.",
    videoIntro: {
      titulo: "Comprende cómo tu historia ha dado forma a la persona que eres hoy.",
      puntos: [
        "Un recorrido guiado para comprender tu historia desde una nueva perspectiva y favorecer un cambio real.",
        "Descubre cómo se formaron los patrones que hoy influyen en tu Vida.",
        "Identifica las heridas emocionales que condicionan tu forma de pensar, sentir y relacionarte.",
        "Integra tu historia con mayor claridad para avanzar de forma consciente.",
      ],
    },
    modalDesc:
      "La astrología te muestra el cómo. La psicología te muestra dónde y de qué manera. Cruzamos tu carta natal con tu historia personal para entender qué mecanismos desarrollaste para sobrevivir, cuáles te sirvieron en su momento y cuáles hoy te limitan. Lo que ahora te molesta de ti fue antes una forma de protegerte.",
    contenido: [
      {
        titulo: "Recuerda tu historia",
        items: [
          "Verás tu historia desde una perspectiva diferente. Lo que antes parecía una colección de acontecimientos aislados empieza a revelar conexiones y significado.",
        ],
      },
      {
        titulo: "Cómo se formaron los patrones que hoy te acompañan",
        items: [
          "Descubrirás cómo determinados acontecimientos activaron patrones que ya estaban presentes en ti.",
        ],
      },
      {
        titulo: "El cambio empieza con el compromiso",
        items: [
          "Comprender tus heridas es solo el primer paso. El verdadero cambio ocurre cuando aceptas el dolor y aprendes a darle un nuevo sentido, día tras día.",
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 3. HINDUISMO (ayurveda)
  // ───────────────────────────────────────────────────────────
  ayurveda: {
    desc: "No todos necesitamos lo mismo. Descubre tu constitución única y aprende a cuidar tu cuerpo y tu mente de acuerdo con tu naturaleza.",
    videoIntro: {
      titulo: "Descubre tu constitución única y aprende a cuidar tu cuerpo y tu mente de acuerdo con tu naturaleza.",
      puntos: [
        "Descubre cuál es tu Doṣha predominante y qué revela sobre ti.",
        "Comprende las tendencias naturales de tu cuerpo y de tu mente.",
        "Identifica qué favorece tu equilibrio y qué tiende a desequilibrarte.",
        "Aprende hábitos, alimentación y rutinas adaptados a tu constitución.",
      ],
    },
    modalDesc:
      "El ayurveda es la medicina tradicional india. No mira síntomas aislados: lee a la persona entera. Tu constitución (Doṣha) determina cómo piensas, cómo enfermas y qué te sienta bien comer. Entender tu Doṣha es entender por qué dos personas con la misma Vida tienen problemas distintos.",
    contenido: [
      {
        titulo: "Los Doṣhas",
        items: [
          "Vata, Pitta y Kapha son las tres energías que describe el Ayurveda. Todos tenemos las tres, pero en proporciones diferentes. Comprender ese equilibrio es el primer paso para entender tus necesidades.",
        ],
      },
      {
        titulo: "Tu Doṣha",
        items: [
          "Descubre cuál es tu constitución predominante, cuáles son tus fortalezas naturales y qué desequilibrios tienden a aparecer cuando te alejas de tu equilibrio.",
        ],
      },
      {
        titulo: "Que no quede en teoría",
        items: [
          "El conocimiento solo tiene valor cuando transforma tu día a día. Aprenderás qué alimentos, rutinas y hábitos favorecen tu equilibrio para empezar a cuidarte de una forma que tenga sentido para ti.",
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 4. MEDICINA CHINA (tcm)
  // ───────────────────────────────────────────────────────────
  tcm: {
    desc: "Los órganos están interconectados. Todo desequilibrio deja huellas. Tu cuerpo habla antes de enfermar. Aprende su lenguaje.",
    videoIntro: {
      titulo: "Aprende el lenguaje de tu cuerpo",
      puntos: [
        "Descubre los cinco elementos y cómo tus órganos siguen sus ciclos naturales.",
        "Identifica qué elemento u órgano puede necesitar más atención en este momento.",
        "Comprende el origen de muchos de tus desequilibrios.",
        "Recupera mayor equilibrio con acciones concretas y fáciles de aplicar.",
      ],
    },
    modalDesc:
      "La medicina tradicional china lee el cuerpo a través de cinco elementos (madera, fuego, tierra, metal, agua) y los órganos que los gobiernan. No es metáfora poética: es un sistema de diagnóstico con miles de años de pruebas. Aquí identificamos qué elemento tienes en exceso o defecto y cómo se traduce eso en lo que te pasa.",
    contenido: [
      {
        titulo: "Los cinco elementos",
        items: [
          "Aprenderás a leer el cuerpo como un sistema donde todo está conectado. Ningún síntoma aparece aislado.",
        ],
      },
      {
        titulo: "Taoísmo aplicado",
        items: [
          "Descubrirás cómo recuperar equilibrio sin vivir reaccionando constantemente a lo que ocurre fuera de ti.",
        ],
      },
      {
        titulo: "Tu desequilibrio hoy",
        items: [
          "Identificaremos qué sistema necesita más atención ahora mismo y qué acciones concretas pueden ayudarte a recuperar estabilidad.",
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 5. FISIOLOGÍA
  // ───────────────────────────────────────────────────────────
  fisiologia: {
    desc: "No tenemos un cuerpo. Somos un cuerpo. Entiéndete.",
    videoIntro: {
      titulo: "Entiende de qué estás hecho",
      puntos: [
        "Comprende las moléculas que forman tu cuerpo.",
        "Descubre qué ocurre dentro de ti a nivel celular.",
        "Entiende cómo funcionan tus órganos y las células que los componen.",
        "Deja de creer lo que te dice cualquiera. Entiende cómo funciona tu cuerpo y decide por ti mismo.",
      ],
    },
    modalDesc:
      "Hasta ahora hemos trabajado con conocimiento tradicional. Aquí cambia el registro: ciencia, evidencia, mecanismos celulares. No para anular lo anterior, para sostenerlo. Cuando entiendes qué hace tu hígado, por qué se inflama tu intestino o cómo se regula tu glucosa, las decisiones que tomas sobre tu cuerpo dejan de ser intuición.",
    contenido: [
      {
        titulo: "Curso sobre el cuerpo humano",
        items: [
          "Entenderás qué ocurre realmente en ti cuando tienes energía, inflamación, fatiga o enfermedad. Eres tu cuerpo, deja de ser un misterio.",
        ],
      },
      {
        titulo: "Desequilibrios frecuentes",
        items: [
          "Aprenderás a reconocer los mecanismos detrás de muchos de los problemas que afectan a millones de personas hoy.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "Un espacio para traducir la teoría a tu situación concreta y comprender mejor lo que ocurre en tu propio organismo.",
        ],
        aviso: "Opcional. Se cobra aparte",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 6. NUTRICIÓN
  // ───────────────────────────────────────────────────────────
  nutricion: {
    desc: "Entiende cómo los alimentos que eliges cada día te reconstruyen.",
    videoIntro: {
      titulo: "Descubre cómo los alimentos que eliges cada día reconstruyen tu cuerpo.",
      puntos: [
        "Comprende por qué tu microbiota influye mucho más allá de la digestión.",
        "Entiende qué moléculas contienen los alimentos y por qué algunos benefician más a tu organismo que otros.",
        "Compréndete más allá de tus gustos y antojos.",
        "Diseña tu alimentación con criterio, desmonta los mitos y elige por ti mismo desde el conocimiento.",
      ],
    },
    modalDesc:
      "La nutrición es el primer hábito que se ajusta cuando ya entiendes tu cuerpo. No es una dieta, no es una lista de prohibiciones: es saber qué pasa en tu organismo con cada alimento y decidir desde ahí.",
    contenido: [
      {
        titulo: "Macronutrientes y micronutrientes",
        items: [
          "Déjate de pensar en «esto es sano y esto no». Comprenderás, de forma sencilla, qué moléculas componen los alimentos y qué función cumplen en tu organismo.",
        ],
      },
      {
        titulo: "Microbiota",
        items: [
          "Entenderás por qué la microbiota va mucho más allá de la digestión y cómo se relaciona con tu salud, energía y bienestar general.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "Adaptaremos el conocimiento a tu realidad. No te diré qué comer; resolveremos tus dudas sobre los alimentos, cómo funcionan y cómo aplicarlo a tu día a día. Si lo deseas, también podremos explorar la relación entre ciertos hábitos alimentarios y factores emocionales o experiencias personales.",
        ],
        aviso: "Opcional. Se cobra aparte.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 7. CÁBALA
  // ───────────────────────────────────────────────────────────
  cabala: {
    desc: "Descubre las dimensiones que viven en tu alma y por extensión en ti. Entiende tus equilibrios y desequilibrios.",
    videoIntro: {
      titulo: "Descubre las dimensiones de tu alma",
      puntos: [
        "Recorre el Árbol de la Vida y sus diez Sefirot.",
        "Comprende tus conflictos internos y tu potencial.",
        "Trabaja cualidades concretas que te transforman.",
        "Aterriza estos principios en tu cotidianidad.",
      ],
    },
    modalDesc:
      "Llegamos aquí después de un largo trabajo: ya conoces tu carta, tu historia, tu constitución y tu cuerpo. Ya estás preparado para descubrir el alma humana según el misticismo judío -que no tiene nada que ver a la religiñon judía de hoy..",
    contenido: [
      {
        titulo: "Filosofía de la Cábala",
        items: [
          "Descubrirás una forma de comprender al ser humano, sus conflictos internos y su potencial de desarrollo.",
        ],
      },
      {
        titulo: "Las Sefirot como herramientas",
        items: [
          "Aprenderás a desarrollar cualidades concretas que transforman la manera en que te relacionas contigo mismo y con los demás.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "Un espacio para aterrizar estos principios en situaciones reales de tu Vida y convertirlos en algo práctico.",
        ],
         aviso: "Opcional. Se cobra aparte",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 8. CULTURA
  // ───────────────────────────────────────────────────────────
  cultura: {
    desc: "Has aprendido siete sistemas de pensamiento. Es hora de construir el tuyo.",
    videoIntro: {
      titulo: "Construye tu propia visión del mundo",
      puntos: [
        "Conoce el pasado para comprender el presente: las grandes ideas y las grandes historias de la humanidad.",
        "Descubre a los pensadores que se hicieron las mismas preguntas que tú.",
        "Reflexiona por ti mismo. Tu punto de vista importa. ¿Qué piensas realmente?",
        "Mira quién fuiste, comprende quién eres y decide en quién quieres convertirte.",
      ],
    },
    modalDesc:
      "El último paso no es aprender otra cosa: es ordenar lo que ya sabes. Has pasado por siete formas distintas de entender al ser humano. Aquí construyes la tuya.",
    contenido: [
      {
        titulo: "Filosofía de Life as a Privilege",
        items: [
          "Después de recorrer siete disciplinas distintas, llega el momento de integrarlas en una visión propia del mundo y de ti mismo.",
        ],
      },
      {
        titulo: "Autores importantes",
        items: [
          "Conocerás ideas y autores que han dedicado su Vida a responder las mismas preguntas que el ser humano lleva siglos haciéndose.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "Reflexionaremos sobre quién eras al empezar este mapa, qué has comprendido y quién te estás convirtiendo después de atravesarlo.",
        ],
        aviso: "Opcional. Se cobra aparte",
      },
    ],
  },
};