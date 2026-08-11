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
/** @deprecated No traduce. Usa `useNombreDisciplinaEnMapa()` de
 *  `src/i18n/nombreDisciplina.ts`. Solo queda vivo para MapaSeArma. */
export const nombreEnMapa = (nom: string): string =>
  nom === "Hinduismo" ? "Ayurveda" : nom;

/** Las ocho disciplinas del recorrido, por su clave interna. */
export type DisciplinaClave =
  | "astrologia" | "psicologia" | "ayurveda" | "tcm"
  | "fisiologia" | "nutricion" | "cabala" | "cultura";

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

export const recorridoContenido: Record<DisciplinaClave, DisciplinaContenido> = {

  // ───────────────────────────────────────────────────────────
  // 1. ASTROLOGÍA
  // ───────────────────────────────────────────────────────────
  astrologia: {
    desc: "Tu carta natal como punto de partida. Entiéndete sin juzgarte antes de intentar cambiarte.",
    videoIntro: {
      titulo: "El mapa de las circunstancias que te han dado forma.",
      puntos: [
        "Una interpretación personal de tu carta, realizada por mí, no por una IA.",
        "Utiliza tu carta como una herramienta para comprender tu historia, tu forma de sentir y los patrones que se repiten en tu Vida.",
        "Descubre patrones, contradicciones y potenciales que quizá llevas años experimentando sin saber cómo interpretar.",
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
        "Descubre de dónde vienen los patrones que hoy se repiten en tu vida.",
        "Comprende cómo tu historia influye en tu forma de pensar, sentir y relacionarte.",
        "Mira tus heridas desde una nueva perspectiva y empieza a darles un nuevo significado.",
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
        "Descubre qué favorece tu equilibrio y aprende a adaptar tus hábitos, alimentación y rutinas a tu constitución.",
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
      titulo: "Aprende el lenguaje de tu cuerpo.",
      puntos: [
        "Descubre los cinco elementos y cómo se relacionan con tu cuerpo, tu forma de ser y tus ciclos naturales.",
        "Identifica qué elementos pueden estar pidiendo más atención y comprende cómo se manifiestan sus desequilibrios en ti.",
        "Aprende formas de recuperar el equilibrio y cuidar tu cuerpo y tu mente en el día a día desde la mirada de la Medicina China.",
      ],
    },
    modalDesc:
      "La medicina tradicional china lee el cuerpo a través de cinco elementos (madera, fuego, tierra, metal, agua) y los órganos que los gobiernan. No es metáfora poética: es un sistema de diagnóstico con miles de años de pruebas. Aquí identificamos qué elemento tienes en exceso o defecto y cómo se traduce eso en lo que te pasa.",
    contenido: [
      {
        titulo: "Los cinco elementos",
        items: [
          "Aprenderás a leer el cuerpo como un sistema en el que todo está conectado. Ningún síntoma aparece de forma aislada.",
        ],
      },
      {
        titulo: "Taoísmo aplicado",
        items: [
          "Descubrirás, a través de las leyes del taoísmo, cómo cultivar una mayor serenidad interior y dejar de reaccionar constantemente a lo que ocurre fuera de ti.",
        ],
      },
      {
        titulo: "Tu desequilibrio hoy",
        items: [
          "Identificarás qué sistema puede necesitar más atención en este momento y qué acciones concretas pueden ayudarte a recuperar el equilibrio.",
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
      titulo: "Comprende el complejo sistema celular que te forma.",
      puntos: [
        "Descubre las moléculas, células, órganos y sistemas que hacen posible que seas quien eres.",
        "Entiende qué ocurre dentro de ti a nivel celular y cómo trabajan juntos los sistemas que mantienen tu organismo en equilibrio.",
        "Aprende fisiología de forma sencilla y visual para comprender qué ocurre en tu cuerpo y tomar decisiones con criterio.",
      ],
    },
    modalDesc:
      "Hasta ahora hemos trabajado con conocimiento tradicional. Aquí cambia el registro: ciencia, evidencia, mecanismos celulares. No para anular lo anterior, para sostenerlo. Cuando entiendes qué hace tu hígado, por qué se inflama tu intestino o cómo se regula tu glucosa, las decisiones que tomas sobre tu cuerpo dejan de ser intuición.",
    contenido: [
      {
        titulo: "El cuerpo por dentro",
        items: [
          "Descubre qué ocurre dentro de ti, desde tus células hasta los órganos y sistemas que mantienen tu organismo en funcionamiento.",
        ],
      },
      {
        titulo: "Aprende de forma visual",
        items: [
          "Comprende conceptos complejos de fisiología a través de explicaciones claras, ilustraciones y ejemplos que hacen fácil entender cómo funciona tu cuerpo.",
        ],
      },
      {
        titulo: "Fisiología para ti",
        items: [
          "Conecta lo que aprendes con tu propio cuerpo y comprende mejor por qué ocurren procesos como la energía, la fatiga, la inflamación o la recuperación.",
        ],
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
        "Comprende qué moléculas contienen los alimentos y cómo las utiliza tu organismo.",
        "Descubre por qué tu microbiota influye mucho más allá de la digestión.",
        "Aprende a elegir tu alimentación con criterio, desmontar mitos y tomar decisiones por ti mismo.",
      ],
    },
    modalDesc:
      "La nutrición es el primer hábito que se ajusta cuando ya entiendes tu cuerpo. No es una dieta, no es una lista de prohibiciones: es saber qué pasa en tu organismo con cada alimento y decidir desde ahí.",
    contenido: [
      {
        titulo: "Macronutrientes y micronutrientes",
        items: [
          "Olvídate de pensar en «esto es sano y esto no». Comprenderás, de forma sencilla, qué moléculas componen los alimentos y qué función cumplen en tu organismo.",
        ],
      },
      {
        titulo: "Microbiota",
        items: [
          "Entenderás por qué la microbiota va mucho más allá de la digestión y cómo se relaciona con tu salud, tu energía y tu bienestar general.",
        ],
      },
      {
        titulo: "De dónde vienen los nutrientes",
        items: [
          "Ningún ser vivo fabrica un átomo. Seguirás el viaje completo: de la roca al suelo, del suelo a la raíz, de la raíz a la hoja y de la hoja al fruto que comes. Y entenderás por qué cada color de una verdura representa una familia distinta de moléculas.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "Adaptaremos el conocimiento a tu realidad. No te diré qué comer: resolveremos tus dudas sobre los alimentos, cómo funcionan y cómo aplicarlo a tu día a día. Si lo deseas, también podremos explorar la relación entre ciertos hábitos alimentarios y factores emocionales o experiencias personales.",
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
      titulo: "Descubre las dimensiones de tu alma.",
      puntos: [
        "Recorre el Árbol de la Vida y descubre sus diez Sefirot como un mapa para comprenderte.",
        "Explora tus conflictos internos, tus cualidades y tu potencial a través de la mirada de la Cábala.",
        "Lleva estos principios a tu vida cotidiana y conviértelos en herramientas para conocerte y transformarte.",
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
          "Aprenderás a desarrollar cualidades concretas que pueden transformar la manera en que te relacionas contigo mismo y con los demás.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "Un espacio para aterrizar estos principios en situaciones reales de tu vida y convertirlos en herramientas prácticas de transformación.",
        ],
        aviso: "Opcional. Se cobra aparte",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 8. CULTURA
  // ───────────────────────────────────────────────────────────
  cultura: {
    desc: "Has conocido siete maneras de interpretar la realidad. Ahora te toca construir la tuya.",



    videoIntro: {
      titulo: "Las grandes historias que dieron forma al mundo.",
      puntos: [
        "Descubre las historias de las civilizaciones que transformaron nuestra forma de entender el mundo y a nosotros mismos.",
        "Conoce a los pensadores que se hicieron algunas de las mismas preguntas que tú y descubre cómo intentaron responderlas.",
        "Recorre la historia universal a través de la ciencia, la filosofía, la religión y la cultura, y comprende cómo hemos llegado a pensar como pensamos hoy.",
      ],
    },
    modalDesc:
      "El último paso no es aprender otra cosa: es ordenar lo que ya sabes. Has pasado por siete formas distintas de entender al ser humano. Aquí construyes la tuya.",
    contenido: [
      {
        titulo: "Las historias que formaron la humanidad",
        items: [
          "Descubre las ideas, creencias, descubrimientos y acontecimientos que han dado forma al mundo que hoy habitas.",
        ],
      },
      {
        titulo: "Autores, líderes y pensadores",
        items: [
          "Conoce a las personas que cuestionaron lo establecido, cambiaron la forma de pensar de su tiempo y dejaron preguntas que todavía seguimos haciéndonos.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "Ahora que has recorrido tu mente, tu cuerpo, tu historia y las distintas formas de comprender al ser humano, detente a mirar quién estás siendo y quién quieres llegar a ser. Te acompaño a llevar todo lo aprendido a tu vida cotidiana.",
        ],
        aviso: "Opcional. Se cobra aparte.",
      },
    ],
  },
};