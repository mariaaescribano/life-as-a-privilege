// Contenido de la página «Tu alimentación y tu estilo de vida» del recorrido de
// Ayurveda (paso posterior a «¿Qué te desequilibra?»). Una entrada por dosha.
// Texto con **negrita** y *cursiva*. Vata completo; Pitta y Kapha se rellenarán.

import type { DoshaKey } from "./doshaIntro";

export interface DoshaCuidarte {
  // ── Parte 1 · Alimentación ──
  alimTitulo: string;
  alimIntro: string[];
  sabores: { titulo: string; intro: string[]; favorables: string[]; moderarIntro: string; moderar: string[] };
  alimentosBuenos: { titulo: string; items: string[] };
  alimentosAumentan: { titulo: string; items: string[] };
  comoComes: { titulo: string; intro: string[]; items: string[]; cierre: string };
  diaEjemplo: { titulo: string; comidas: { momento: string; texto: string[] }[] };
  alimCierre: string[];
  // ── Parte 2 · Estilo de vida ──
  estiloTitulo: string;
  estiloIntro: string[];
  secciones: { titulo: string; parrafos: string[]; items?: string[]; cierre?: string }[];
  abhyanga: { titulo: string; parrafos: string[] };
  recuerda: { titulo: string; parrafos: string[] };
  // Reflexión (SE GUARDA). El bloque «Mi compromiso» (selección única) es opcional.
  reflexion: {
    titulo: string;
    pregunta: string;
    nota: string;
    compromisoTitulo?: string;
    compromisoIntro?: string;
    compromisos?: string[];
  };
  cierre: string[];
}

export const DOSHA_CUIDARTE: Record<DoshaKey, DoshaCuidarte | null> = {
  vata: {
    alimTitulo: "Tu alimentación ideal",
    alimIntro: [
      "Ahora ya sabes que Vata necesita estabilidad.",
      "La alimentación es una de las formas más sencillas de proporcionársela.",
      "No se trata de hacer una dieta perfecta.",
      "Se trata de elegir alimentos que aporten calor, nutrición y regularidad.",
    ],
    sabores: {
      titulo: "Los sabores que más te equilibran",
      intro: [
        "Vata es **frío, seco y ligero**.",
        "Por eso encuentra equilibrio con sabores que aportan justo lo contrario.",
      ],
      favorables: ["Dulce.", "Ácido.", "Salado."],
      moderarIntro: "Los sabores que conviene consumir con más moderación son:",
      moderar: ["Picante.", "Amargo.", "Astringente."],
    },
    alimentosBuenos: {
      titulo: "Los alimentos que suelen sentarte mejor",
      items: [
        "Cereales calientes como arroz basmati, avena o quinoa.",
        "Llevar una dieta vegetariana.",
        "Verduras cocinadas: calabaza, boniato, zanahoria, calabacín, remolacha…",
        "Grasas saludables como ghee, aceite de oliva o aguacate.",
        "Frutos secos y semillas (especialmente remojados).",
        "Frutas maduras y dulces.",
        "Lácteos templados si los toleras.",
        "Sopas, cremas y guisos.",
        "Infusiones calientes de jengibre suave, canela, hinojo o regaliz.",
      ],
    },
    alimentosAumentan: {
      titulo: "Lo que suele aumentar Vata",
      items: [
        "Bebidas muy frías.",
        "Exceso de ensaladas y alimentos crudos.",
        "Comida seca o muy procesada.",
        "Exceso de café y estimulantes.",
        "Comer deprisa o mientras haces otras cosas.",
        "Saltarte comidas.",
      ],
    },
    comoComes: {
      titulo: "Más importante que lo que comes es cómo comes",
      intro: ["Para Vata, la rutina también alimenta.", "Intenta:"],
      items: [
        "Comer sentado.",
        "Comer sin prisas.",
        "Mantener horarios parecidos cada día.",
        "Masticar despacio.",
        "Evitar el móvil o la televisión mientras comes.",
      ],
      cierre: "Tu sistema digestivo funciona mejor cuando siente seguridad.",
    },
    diaEjemplo: {
      titulo: "Un día de ejemplo",
      comidas: [
        { momento: "Desayuno", texto: ["Gachas de avena con canela, manzana cocida, nueces y una infusión caliente."] },
        { momento: "Media mañana", texto: ["Un puñado de almendras o una fruta madura."] },
        { momento: "Comida", texto: ["Arroz basmati con verduras salteadas y lentejas o dhal.", "Aliñado con aceite de oliva o ghee."] },
        { momento: "Merienda", texto: ["Infusión caliente y una crema de frutos secos con fruta."] },
        { momento: "Cena", texto: ["Crema de calabaza o verduras con quinoa y un poco de ghee.", "Una cena ligera, caliente y fácil de digerir."] },
      ],
    },
    alimCierre: ["*No busques la perfección.*", "*Busca la constancia.*"],

    estiloTitulo: "Tu estilo de vida ideal",
    estiloIntro: [
      "La alimentación ayuda.",
      "Pero para una persona Vata, **la rutina es medicina**.",
      "Cada pequeño hábito que aporta estabilidad ayuda a calmar el sistema nervioso.",
    ],
    secciones: [
      {
        titulo: "Empieza el día sin prisas",
        parrafos: [
          "Levántate con tiempo suficiente para no empezar el día corriendo.",
          "Unos minutos de silencio, respiración o estiramientos pueden cambiar completamente cómo te sentirás durante el resto del día.",
        ],
      },
      {
        titulo: "Muévete, pero sin agotarte",
        parrafos: [
          "El ejercicio es muy beneficioso para Vata.",
          "Lo importante no es hacer mucho.",
          "Es hacerlo de forma constante.",
          "Las mejores opciones suelen ser:",
        ],
        items: ["Caminar.", "Yoga.", "Bicicleta tranquila.", "Natación suave.", "Bailar."],
        cierre: "Evita entrenar hasta el agotamiento todos los días.",
      },
      {
        titulo: "Haz del descanso una prioridad",
        parrafos: [
          "Tu sistema nervioso necesita recuperarse.",
          "Dormir bien no es un lujo.",
          "Es una necesidad.",
          "Intenta acostarte a una hora similar cada noche y reduce las pantallas durante la última hora del día.",
        ],
      },
      {
        titulo: "Regálate momentos de calma",
        parrafos: ["No necesitas estar siempre haciendo cosas."],
        items: ["Leer.", "Meditar.", "Respirar.", "Escuchar música.", "Dar un paseo.", "Estar en la naturaleza."],
        cierre: "Todo aquello que reduce el ruido exterior ayuda a que también disminuya el ruido interior.",
      },
    ],
    abhyanga: {
      titulo: "Un pequeño hábito que puede cambiar tu día",
      parrafos: [
        "En Ayurveda existe una práctica llamada **Abhyanga**, un automasaje con aceite templado que tradicionalmente se realiza **antes de la ducha**.",
        "El masaje ayuda a nutrir la piel, relajar el sistema nervioso, mejorar la circulación y transmitir al cuerpo una sensación de seguridad y calma. Después, una ducha templada elimina el exceso de aceite sin retirar completamente sus beneficios.",
        "Para una persona **Vata**, es uno de los hábitos más recomendados, especialmente en épocas de estrés, frío o sequedad.",
        "*No hace falta hacerlo todos los días. Una o dos veces por semana ya puede marcar una diferencia.*",
      ],
    },
    recuerda: {
      titulo: "Lo que el Ayurveda quiere que recuerdes",
      parrafos: [
        "Vata no necesita una vida perfecta.",
        "Necesita una vida predecible.",
        "Cuanto más estable sea tu rutina, más espacio tendrá tu creatividad para expresarse sin convertirse en ansiedad.",
      ],
    },
    reflexion: {
      titulo: "Reflexiona",
      pregunta: "¿Qué único hábito podrías empezar esta misma semana que te acerque un poco más al equilibrio?",
      nota: "Lo recuperaremos al final del recorrido.",
      compromisoTitulo: "Mi compromiso",
      compromisoIntro: "Elige solo uno para esta semana.",
      compromisos: [
        "Comer a la misma hora.",
        "Dormir antes.",
        "Hacer 10 minutos de respiración.",
        "Caminar cada día.",
        "Desayunar caliente.",
        "Apagar el móvil mientras como.",
      ],
    },
    cierre: [
      "*El equilibrio no nace de hacer grandes cambios.*",
      "*Nace de repetir pequeños hábitos con amor y paciencia.*",
    ],
  },
  pitta: {
    alimTitulo: "Tu alimentación ideal",
    alimIntro: [
      "Ahora ya sabes que Pitta necesita equilibrio.",
      "La alimentación es una de las formas más sencillas de mantener su fuego en armonía.",
      "No se trata de comer menos.",
      "Se trata de elegir alimentos que refresquen, nutran y eviten el exceso de calor.",
    ],
    sabores: {
      titulo: "Los sabores que más te equilibran",
      intro: [
        "Pitta es **caliente, intenso y ligeramente aceitoso**.",
        "Por eso encuentra equilibrio con sabores que aportan frescor y ligereza.",
      ],
      favorables: ["Dulce.", "Amargo.", "Astringente."],
      moderarIntro: "Los sabores que conviene consumir con más moderación son:",
      moderar: ["Picante.", "Ácido.", "Salado."],
    },
    alimentosBuenos: {
      titulo: "Los alimentos que suelen sentarte mejor",
      items: [
        "Llevar una dieta principalmente vegetariana.",
        "Verduras frescas como pepino, calabacín, espárragos, brócoli o hojas verdes.",
        "Frutas dulces como uvas, cerezas, melón, pera o mango.",
        "Cereales como arroz basmati, cebada o avena.",
        "Coco, aguacate y pequeñas cantidades de ghee.",
        "Especias suaves como cilantro, hinojo, cardamomo, comino o cúrcuma.",
        "Infusiones de menta, manzanilla o regaliz.",
      ],
    },
    alimentosAumentan: {
      titulo: "Lo que suele aumentar Pitta",
      items: [
        "Comidas muy picantes.",
        "Exceso de alimentos ácidos.",
        "Mucha sal.",
        "Fritos y comidas muy grasas.",
        "Alcohol.",
        "Exceso de café y estimulantes.",
        "Comer con prisas o bajo estrés.",
        "Saltarte comidas.",
      ],
    },
    comoComes: {
      titulo: "Más importante que lo que comes es cómo comes",
      intro: ["Para Pitta, el hambre suele ser muy intensa.", "Por eso es importante respetarla sin llegar a los extremos.", "Intenta:"],
      items: [
        "Comer a horarios regulares.",
        "Sentarte a comer con calma.",
        "Evitar trabajar o mirar el móvil mientras comes.",
        "Disfrutar de la comida sin prisas.",
        "Escuchar cuándo estás realmente saciado.",
      ],
      cierre: "Tu digestión funciona mejor cuando el cuerpo no siente presión.",
    },
    diaEjemplo: {
      titulo: "Un día de ejemplo",
      comidas: [
        { momento: "Desayuno", texto: ["Porridge de avena con pera, semillas y una infusión de menta."] },
        { momento: "Media mañana", texto: ["Fruta fresca o un puñado de semillas."] },
        { momento: "Comida", texto: ["Arroz basmati con verduras al vapor, lentejas y cilantro fresco."] },
        { momento: "Merienda", texto: ["Yogur natural (si lo toleras) o fruta dulce."] },
        { momento: "Cena", texto: ["Crema de calabacín con quinoa y verduras salteadas.", "Una cena ligera y fácil de digerir."] },
      ],
    },
    alimCierre: ["*No alimentes solo tu hambre.*", "*Alimenta también tu equilibrio.*"],

    estiloTitulo: "Tu estilo de vida ideal",
    estiloIntro: [
      "La alimentación ayuda.",
      "Pero para una persona Pitta, **el descanso también es medicina**.",
      "Tu naturaleza tiene una enorme capacidad para hacer, crear y conseguir objetivos.",
      "Por eso necesita aprender cuándo parar.",
    ],
    secciones: [
      {
        titulo: "Empieza el día con calma",
        parrafos: [
          "No hace falta empezar el día respondiendo mensajes o pensando en todo lo que tienes que hacer.",
          "Dedica unos minutos a respirar, estirarte o simplemente disfrutar del silencio antes de comenzar.",
        ],
      },
      {
        titulo: "Muévete, pero sin competir",
        parrafos: ["El ejercicio es muy beneficioso para Pitta.", "Lo importante no es entrenar más.", "Es disfrutar del movimiento.", "Las mejores opciones suelen ser:"],
        items: ["Caminar.", "Natación.", "Bicicleta.", "Yoga.", "Senderismo."],
        cierre: "Evita convertir cada entrenamiento en una competición.",
      },
      {
        titulo: "Haz del descanso una prioridad",
        parrafos: [
          "Dormir bien ayuda a que tu cuerpo y tu mente recuperen el equilibrio.",
          "Intenta terminar el trabajo con tiempo suficiente para que tu mente pueda desconectar antes de acostarte.",
          "No todo tiene que resolverse hoy.",
        ],
      },
      {
        titulo: "Regálate momentos donde no tengas que demostrar nada",
        parrafos: [],
        items: ["Leer.", "Pasear.", "Estar en la naturaleza.", "Escuchar música.", "Meditar.", "Compartir tiempo con personas que te transmitan calma."],
        cierre: "Recuerda que tu valor no depende de tu productividad.",
      },
    ],
    abhyanga: {
      titulo: "Un pequeño hábito que puede cambiar tu día",
      parrafos: [
        "Para una persona **Pitta**, uno de los hábitos más beneficiosos es reservar cada día unos minutos para hacer algo sin ningún objetivo.",
        "Un paseo tranquilo.",
        "Respirar.",
        "Observar la naturaleza.",
        "Sentarte al sol de la mañana.",
        "No para conseguir algo.",
        "Simplemente para estar presente.",
        "Ese pequeño descanso ayuda a que el fuego deje de consumir energía innecesariamente.",
      ],
    },
    recuerda: {
      titulo: "Lo que el Ayurveda quiere que recuerdes",
      parrafos: [
        "Pitta no necesita demostrar constantemente de lo que es capaz.",
        "Necesita recordar que incluso el fuego más brillante necesita momentos para bajar su intensidad.",
        "Cuando aprendes a descansar, tu energía deja de agotarte y empieza a sostenerte.",
      ],
    },
    reflexion: {
      titulo: "Reflexiona",
      pregunta: "¿Qué pequeño hábito podrías incorporar esta semana para bajar un poco el ritmo sin dejar de cuidar de ti?",
      nota: "Lo recuperaremos al final del recorrido.",
    },
    cierre: [
      "*El equilibrio no consiste en hacer menos.*",
      "*Consiste en aprender cuándo es el momento de parar.*",
    ],
  },
  kapha: {
    alimTitulo: "Tu alimentación ideal",
    alimIntro: [
      "Ahora ya sabes que Kapha necesita movimiento y ligereza.",
      "La alimentación es una de las formas más eficaces de estimular su energía y evitar la sensación de pesadez.",
      "No se trata de comer menos.",
      "Se trata de elegir alimentos que despierten el metabolismo y aporten vitalidad.",
    ],
    sabores: {
      titulo: "Los sabores que más te equilibran",
      intro: [
        "Kapha es **frío, pesado, húmedo y estable**.",
        "Por eso encuentra equilibrio con sabores que aportan calor, ligereza y estimulación.",
      ],
      favorables: ["Picante.", "Amargo.", "Astringente."],
      moderarIntro: "Los sabores que conviene consumir con más moderación son:",
      moderar: ["Dulce.", "Ácido.", "Salado."],
    },
    alimentosBuenos: {
      titulo: "Los alimentos que suelen sentarte mejor",
      items: [
        "Llevar una dieta principalmente vegetariana.",
        "Verduras de todo tipo, especialmente hojas verdes, brócoli, coliflor, espárragos, alcachofas o col.",
        "Frutas ligeras como manzana, granada, frutos rojos o pera.",
        "Cereales ligeros como cebada, mijo o quinoa.",
        "Legumbres como lentejas, garbanzos o judías.",
        "Especias estimulantes como jengibre, cúrcuma, pimienta negra, mostaza, canela o comino.",
        "Infusiones de jengibre, canela o té de especias.",
      ],
    },
    alimentosAumentan: {
      titulo: "Lo que suele aumentar Kapha",
      items: [
        "Exceso de alimentos dulces.",
        "Harinas refinadas y bollería.",
        "Exceso de lácteos y quesos.",
        "Comidas muy grasas o fritas.",
        "Bebidas muy azucaradas.",
        "Helados y alimentos muy fríos.",
        "Comer en exceso, aunque sean alimentos saludables.",
        "Picar continuamente entre horas.",
      ],
    },
    comoComes: {
      titulo: "Más importante que lo que comes es cómo comes",
      intro: ["Para Kapha es importante comer cuando existe hambre real.", "Intenta:"],
      items: [
        "Comer solo cuando tengas apetito.",
        "Evitar repetir por costumbre.",
        "Comer despacio y con atención.",
        "Dejar varias horas entre comidas para favorecer la digestión.",
        "Evitar comer por aburrimiento, estrés o necesidad emocional.",
      ],
      cierre: "Tu digestión funciona mejor cuando el cuerpo tiene tiempo para completar cada proceso.",
    },
    diaEjemplo: {
      titulo: "Un día de ejemplo",
      comidas: [
        { momento: "Desayuno", texto: ["Infusión de jengibre y canela con fruta o, si no tienes hambre, simplemente la infusión."] },
        { momento: "Media mañana", texto: ["Solo si aparece hambre real."] },
        { momento: "Comida", texto: ["Quinoa con verduras salteadas, garbanzos y especias."] },
        { momento: "Merienda", texto: ["Una pieza de fruta o una infusión."] },
        { momento: "Cena", texto: ["Crema de verduras o verduras al vapor con lentejas.", "Una cena ligera facilita el descanso y evita la sensación de pesadez."] },
      ],
    },
    alimCierre: ["*No comas por costumbre.*", "*Come porque tu cuerpo realmente lo necesita.*"],

    estiloTitulo: "Tu estilo de vida ideal",
    estiloIntro: [
      "La alimentación ayuda.",
      "Pero para una persona Kapha, **el movimiento es medicina**.",
      "Cada pequeño cambio rompe la inercia y devuelve energía al cuerpo.",
    ],
    secciones: [
      {
        titulo: "Empieza el día con energía",
        parrafos: [
          "Levántate en cuanto suene el despertador y evita permanecer mucho tiempo en la cama.",
          "Comenzar el día con movimiento ayuda a activar tanto el cuerpo como la mente.",
        ],
      },
      {
        titulo: "Muévete todos los días",
        parrafos: ["El ejercicio es uno de los mejores aliados de Kapha.", "Las actividades más recomendables suelen ser:"],
        items: ["Correr.", "Bicicleta.", "Senderismo.", "Entrenamiento de fuerza.", "Bailar.", "Deportes dinámicos."],
        cierre: "No hace falta entrenar durante horas. La clave es mantener la constancia.",
      },
      {
        titulo: "Evita el exceso de comodidad",
        parrafos: [
          "Kapha encuentra bienestar en la estabilidad, pero demasiada comodidad puede transformarse en estancamiento.",
          "Busca pequeños cambios que mantengan tu energía en movimiento.",
        ],
        items: ["Prueba una ruta nueva.", "Aprende algo diferente.", "Conoce personas nuevas.", "Sal de tu zona de confort con frecuencia."],
      },
      {
        titulo: "Rodéate de estímulos que te inspiren",
        parrafos: ["La motivación también se cultiva."],
        items: ["Escucha música.", "Pasa tiempo con personas que te transmitan entusiasmo.", "Haz planes que te ilusionen.", "Permítete descubrir cosas nuevas."],
        cierre: "Cada experiencia diferente despierta tu energía.",
      },
    ],
    abhyanga: {
      titulo: "Un pequeño hábito que puede cambiar tu día",
      parrafos: [
        "Para una persona **Kapha**, uno de los hábitos más beneficiosos es comenzar la mañana con unos minutos de movimiento.",
        "Puede ser caminar, hacer estiramientos, practicar yoga dinámico o simplemente bailar tu canción favorita.",
        "Lo importante no es la intensidad.",
        "Es recordarle a tu cuerpo que cada día comienza con acción.",
      ],
    },
    recuerda: {
      titulo: "Lo que el Ayurveda quiere que recuerdes",
      parrafos: [
        "Kapha no necesita convertirse en alguien diferente.",
        "Necesita confiar en que moverse no significa perder estabilidad.",
        "Al contrario.",
        "Cada pequeño paso mantiene viva la energía que ya existe dentro de ti.",
      ],
    },
    reflexion: {
      titulo: "Reflexiona",
      pregunta: "¿Qué pequeño hábito podrías empezar esta semana para llenar tu vida de un poco más de movimiento?",
      nota: "Lo recuperaremos al final del recorrido.",
    },
    cierre: [
      "*No hace falta cambiar toda tu vida.*",
      "*Solo hace falta dar el primer paso.*",
    ],
  },
};
