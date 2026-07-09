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

export type DisciplinaContenido = {
  /** Frase introductoria en cursiva dentro del modal (1 línea) */
  desc: string;
  /** Descripción larga del modal (actualmente no se muestra, queda en backup) */
  modalDesc: string;
  /** 3 cajas dentro del modal */
  contenido: ContenidoSeccion[];
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
    modalDesc:
      "Tu carta natal no predice tu futuro: describe cómo estás configurado. Qué partes tuyas tienen más peso, qué tensiones internas arrastras, qué te cuesta y qué te sale solo. Es el primer paso de El Recorrido porque sin saber de dónde partes, cualquier trabajo posterior va a ciegas.",
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
    modalDesc:
      "El ayurveda es la medicina tradicional india. No mira síntomas aislados: lee a la persona entera. Tu constitución (dosha) determina cómo piensas, cómo enfermas y qué te sienta bien comer. Entender tu dosha es entender por qué dos personas con la misma vida tienen problemas distintos.",
    contenido: [
      {
        titulo: "Los doshas",
        items: [
          "Vata, Pitta y Kapha son las tres energías que describe el Ayurveda. Todos tenemos las tres, pero en proporciones diferentes. Comprender ese equilibrio es el primer paso para entender tus necesidades.",
        ],
      },
      {
        titulo: "Tu dosha",
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
    desc: "Entiende cómo los alimentos que eliges cada día te construyen.",
    modalDesc:
      "La nutrición es el primer hábito que se ajusta cuando ya entiendes tu cuerpo. No es una dieta, no es una lista de prohibiciones: es saber qué pasa en tu organismo con cada alimento y decidir desde ahí.",
    contenido: [
      {
        titulo: "Microbiota",
        items: [
          "Comprenderás por qué tu intestino influye en mucho más que la digestión: energía, estado de ánimo, claridad mental y salud.",
        ],
      },
      {
        titulo: "Macro y micro nutrientes",
        items: [
          "Aprenderás qué necesita realmente tu cuerpo y cómo identificar carencias o excesos antes de que generen problemas.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "Adaptaremos el conocimiento a tu realidad: tu constitución, tus horarios, tus necesidades y tu estilo de vida.",
        ],
        aviso: "Opcional. Se cobra aparte",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 7. CÁBALA
  // ───────────────────────────────────────────────────────────
  cabala: {
    desc: "Descubre las dimensiones que viven en ti solo por tener un alma. Entiende tus equilibrios y desequilibrios.",
    modalDesc:
      "Llegamos aquí después de un largo trabajo: ya conoces tu carta, tu historia, tu constitución, tu cuerpo, lo que comes. Ya estás preparado para descubrir el alma humana según El Árbol de la Vida y sus diez Sefirot.",
    contenido: [
      {
        titulo: "Filosofía de la cábala",
        items: [
          "Descubrirás una forma distinta de comprender al ser humano, sus conflictos internos y su potencial de desarrollo.",
        ],
      },
      {
        titulo: "Las Sefirot como herramientas",
        items: [
          "Aprenderás a trabajar cualidades concretas que transforman la manera en que te relacionas contigo mismo y con los demás.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "Un espacio para aterrizar estos principios en situaciones reales de tu vida y convertirlos en algo práctico.",
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
          "Conocerás ideas y autores que han dedicado su vida a responder las mismas preguntas que el ser humano lleva siglos haciéndose.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "Reflexionaremos sobre quién eras al empezar este recorrido, qué has comprendido y quién te estás convirtiendo después de atravesarlo.",
        ],
        aviso: "Opcional. Se cobra aparte",
      },
    ],
  },
};