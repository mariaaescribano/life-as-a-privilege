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
      "Tu carta natal no predice tu futuro: describe cómo estás configurado. Qué partes tuyas tienen más peso, qué tensiones internas arrastras, qué te cuesta y qué te sale solo. Es el primer paso de «El Recorrido» porque sin saber de dónde partes, cualquier trabajo posterior va a ciegas.",
    contenido: [
      {
        titulo: "Lectura de tu carta natal",
        items: [
          "PDF completo con la lectura de tu carta. Es un mapa de cómo estás configurado, qué áreas de tu vida tienen más peso y qué tensiones internas arrastras.",
        ],
      },
      {
        titulo: "Los doce arquetipos",
        items: [
          "Material para entender tus arquetipos uno por uno. No para memorizarlos, para reconocerlos en ti. Cuando sabes qué arquetipo está actuando, dejas de pelearte contigo.",
        ],
      },
      {
        titulo: "Sesiones de lectura conjunta",
        items: [
          "5 sesiones para entender tu carta juntos. No para que te la explique yo, para que puedas leerla solo y poner palabras a lo que antes no las tenía.",
        ],
        aviso: "Se cobra aparte",
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
        titulo: "Mapa de Vida",
        items: [
          "Material guiado para poner tu vida en orden: lo que recuerdas, lo que te contaron, lo que se repite. No es un ejercicio de memoria, es ver tu historia desde fuera por primera vez.",
        ],
      },
      {
        titulo: "Cronología junto a tu carta",
        items: [
          "Cruzamos tu cronología con tu carta natal. Lo que se repite no es azar. Tiene origen, y se puede dejar de repetir.",
        ],
      },
      {
        titulo: "Psicoterapia Breve",
        items: [
          "16 a 20 sesiones aproximádamente. No es una sesión al mes para desahogarte: es desarrollo intenso y focalizado.",
        ],
        aviso: "Se cobra aparte",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 3. HINDUISMO (ayurveda)
  // ───────────────────────────────────────────────────────────
  ayurveda: {
    desc: "Cinco mil años leyendo al ser humano. Lo que el hinduismo descubrió sobre tu cuerpo, tu mente y tu lugar en la naturaleza.",
    modalDesc:
      "El ayurveda es la medicina tradicional india. No mira síntomas aislados: lee a la persona entera. Tu constitución (dosha) determina cómo piensas, cómo enfermas y qué te sienta bien comer. Entender tu dosha es entender por qué dos personas con la misma vida tienen problemas distintos.",
    contenido: [
      {
        titulo: "Cursos para entender el sistema",
        items: [
          "Más de cinco cursos grabados sobre la base del ayurveda: qué son los doshas, cómo se manifiestan. Acceso ilimitado.",
        ],
      },
      {
        titulo: "Tu dosha",
        items: [
          "Identificarás tu constitución dominante, qué desequilibrios desarrollas y a qué estás predispuesto por naturaleza.",
        ],
      },
      {
        titulo: "Material para el día a día",
        items: [
          "Fichas y guías para que el ayurveda no se quede en teoría. Material práctico y funcional para respetar tu naturaleza.",
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 4. MEDICINA CHINA (tcm)
  // ───────────────────────────────────────────────────────────
  tcm: {
    desc: "Una naturaleza. Un ser humano. Cinco elementos. Descubre su relación.",
    modalDesc:
      "La medicina tradicional china lee el cuerpo a través de cinco elementos (madera, fuego, tierra, metal, agua) y los órganos que los gobiernan. No es metáfora poética: es un sistema de diagnóstico con miles de años de pruebas. Aquí identificamos qué elemento tienes en exceso o defecto y cómo se traduce eso en lo que te pasa.",
    contenido: [
      {
        titulo: "Los cinco elementos",
        items: [
          "Cómo la medicina china lee el cuerpo a partir de cinco elementos y los cinco órganos que los gobiernan. Un sistema de diagnóstico con miles de años de pruebas.",
        ],
      },
      {
        titulo: "Taoísmo aplicado",
        items: [
          "La sabiduría del taoísmo es ancestral. Entiéndelo, vívelo, y deja de funcionar en piloto automático.",
        ],
      },
      {
        titulo: "Tu desequilibrio hoy",
        items: [
          "Identificamos qué elemento tienes en exceso o en defecto ahora mismo, y trabajamos con herramientas concretas: alimentación, plantas, hábitos, ejercicio.",
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 5. FISIOLOGÍA
  // ───────────────────────────────────────────────────────────
  fisiologia: {
    desc: "No tenemos un cuerpo. Somos un cuerpo.",
    modalDesc:
      "Hasta ahora hemos trabajado con conocimiento tradicional. Aquí cambia el registro: ciencia, evidencia, mecanismos celulares. No para anular lo anterior, para sostenerlo. Cuando entiendes qué hace tu hígado, por qué se inflama tu intestino o cómo se regula tu glucosa, las decisiones que tomas sobre tu cuerpo dejan de ser intuición.",
    contenido: [
      {
        titulo: "Curso sobre el cuerpo humano",
        items: [
          "Curso grabado de fisiología real: cómo funcionan los órganos, los sistemas, las hormonas. Ni simplificado al nivel de revista, ni complicado al nivel de facultad.",
        ],
      },
      {
        titulo: "Desequilibrios frecuentes",
        items: [
          "Estudio detallado de los más comunes: hígado graso, resistencia a la insulina, síndrome premenstrual, hipotiroidismo subclínico, fatiga adrenal. Qué son, por qué aparecen, qué los reactiva.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "1 o 2 sesiones para resolver dudas concretas sobre tu caso. Si te han dado un diagnóstico y no te han explicado nada, aquí lo desmontamos.",
        ],
        aviso: "Se cobra aparte",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 6. NUTRICIÓN
  // ───────────────────────────────────────────────────────────
  nutricion: {
    desc: "Conoce más para temer menos y elegir mejor.",
    modalDesc:
      "La nutrición es el primer hábito que se ajusta cuando ya entiendes tu cuerpo. No es una dieta, no es una lista de prohibiciones: es saber qué pasa en tu organismo con cada alimento y decidir desde ahí.",
    contenido: [
      {
        titulo: "Microbiota",
        items: [
          "Profundiza en la microbiota intestinal: qué la compone, qué la destruye, qué la repara. Por qué dos personas con la misma dieta tienen energía radicalmente distinta.",
        ],
      },
      {
        titulo: "Macro y micro nutrientes",
        items: [
          "Carbohidratos, proteínas, grasas, vitaminas y minerales. Qué hace cada uno, cuándo los necesitas, qué pasa cuando faltan o sobran.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "1 o 2 sesiones para ajustarlo a tu caso: tu dosha, tus desequilibrios, tus horarios, tu presupuesto.",
        ],
        aviso: "Se cobra aparte",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // 7. CÁBALA
  // ───────────────────────────────────────────────────────────
  cabala: {
    desc: "El mapa del alma, sus equilibrios y sus desequilibrios.",
    modalDesc:
      "Llegamos aquí después de un largo trabajo: ya conoces tu carta, tu historia, tu constitución, tu cuerpo, lo que comes. Ya estás preparado para descubrir el alma humana según El Árbol de la Vida y sus diez Sefirot.",
    contenido: [
      {
        titulo: "Filosofía de la cábala",
        items: [
          "Curso grabado sobre la base de la cábala. Qué es, de dónde viene y por qué no es lo que se ha vendido en los últimos años.",
        ],
      },
      {
        titulo: "Las Sefirot como herramientas",
        items: [
          "Las diez Sefirot del Árbol de la Vida. Cada una representa una cualidad concreta (juicio, misericordia, fundamento, victoria) que puedes trabajar en ti. No símbolos para contemplar, cualidades para desarrollar.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "1 o 2 sesiones para dudas sobre tu recorrido por el árbol, o sobre cómo aplicar Sefirot concretas a momentos de tu vida.",
        ],
         aviso: "Se cobra aparte",
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
          "Curso sobre la filosofía que da vida a este proyecto. No para que la copies, sino para inspirarte a que construyas la tuya.",
        ],
      },
      {
        titulo: "Autores importantes",
        items: [
          "Curso grabado de explicaciones de autores y obras concretas recomendadas.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "1 o 2 sesiones para hablar en profundidad de ti, tu camino y tu filosofía. Qué has aprendido, cómo has cambiado. Lo que has desarrollado es importante y aquí puedes compartirlo.",
        ],
        aviso: "Se cobra aparte",
      },
    ],
  },
};