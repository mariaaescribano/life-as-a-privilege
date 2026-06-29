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
  /** Caja interactiva (local): comidas de hoy que te desequilibran pero te encantan. */
  desequilibran?: { titulo: string; intro: string; opciones: string[] };
  /** Caja interactiva (local): alimentos que te equilibran y puedes tomar hoy. */
  equilibran?: { titulo: string; intro: string; opciones: string[] };
  /** Pautas por momento del día (recomendaciones del constructor «Crea tu día»),
   *  por dosha y sin hora fija. `comida: true` → al elegirla se activan los alimentos. */
  rutina?: { momento: string; actividad: string; comida?: boolean }[];
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
        "Vata es **frío, seco y ligero**, por eso le encantan los alimentos que cumplen estas características.",
        "Pero encuentra equilibrio con sabores que aportan justo lo contrario.",
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
        "Sopas, cremas y guisos de verduras.",
        "Infusiones calientes de jengibre suave, canela, hinojo o manzanilla.",
      ],
    },
    alimentosAumentan: {
      titulo: "Lo que suele aumentar Vata",
      items: [
        "Bebidas muy frías.",
        "Exceso de ensaladas y alimentos crudos.",
        "Comida seca, arenosa o muy procesada.",
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
      cierre: "Tu sistema digestivo funciona mejor cuando siente seguridad y estabilidad.",
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
    alimCierre: ["*No busques la perfección, busca la constancia.*"],
    desequilibran: {
      titulo: "¿Qué alimentos te encantan pero te desequilibran?",
      intro: "Marca lo que suelas comer. No es para culparte, sino para tomar conciencia: estos alimentos, fríos, secos o muy estimulantes, tienden a aumentar Vata.",
      opciones: [
        "Una ensalada grande o muchas verduras crudas.",
        "Fruta fría recién sacada de la nevera.",
        "Café.",
        "Bebidas energéticas.",
        "Refrescos con gas o bebidas muy frías.",
        "Helado.",
        "Palomitas, tortitas de arroz o snacks secos y crujientes.",
        "Pan tostado, galletas o crackers.",
        "Frutos secos sin remojar.",
        "Legumbres secas poco cocinadas (garbanzos, alubias).",
        "Té negro o té verde en exceso.",
        "Alcohol.",
        "Comida muy seca o muy procesada.",
        "Exceso de especias amargas o muy picantes.",
        "Infusiones heladas o muy amargas (cola de caballo, diente de león).",
        "He comido con prisa, de pie o mientras hacía otra cosa.",
      ],
    },
    equilibran: {
      titulo: "Alimentos que te equilibran y que puedes tomar hoy mismo",
      intro: "Marca los que tengas a mano o puedas incorporar hoy. Calientes, nutritivos y fáciles de digerir: justo lo que Vata necesita.",
      opciones: [
        "Arroz basmati caliente.",
        "Avena cocida con canela.",
        "Quinoa templada.",
        "Sopas, cremas y guisos calientes.",
        "Verduras cocinadas (calabaza, boniato, zanahoria, calabacín, remolacha).",
        "Lentejas o dhal bien cocinados.",
        "Ghee.",
        "Aceite de oliva.",
        "Aguacate.",
        "Almendras o nueces remojadas.",
        "Plátano maduro.",
        "Compota de manzana.",
        "Dátiles o higos.",
        "Leche templada con especias (si la toleras).",
        "Especia: jengibre.",
        "Especia: canela.",
        "Especia: comino.",
        "Especia: cardamomo.",
        "Especia: hinojo.",
        "Especia: nuez moscada.",
        "Infusión de jengibre.",
        "Infusión de canela.",
        "Infusión de hinojo.",
        "Infusión de regaliz.",
        "Infusión de manzanilla.",
      ],
    },
    rutina: [
      { momento: "Despertar", actividad: "Respira lentamente unos minutos antes de empezar el día." },
      { momento: "Ejercicio", actividad: "Yoga o fuerza." },
      { momento: "Desayuno", actividad: "Abundante y caliente.", comida: true },
      { momento: "Comida", actividad: "Tu comida principal del día: caliente, cocinada y nutritiva.", comida: true },
      { momento: "Antes de dormir", actividad: "Aceite, infusión y silencio." },
    ],

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
          "Es hacerlo de forma constante y consciente.",
          "Las mejores opciones suelen ser:",
        ],
        items: ["Ejercicio de fuerza.", "Yoga.", "Natación.", "Bailar consciente."],
        cierre: "Evita entrenar hasta el agotamiento todos los días.",
      },
      {
        titulo: "Haz del descanso una prioridad",
        parrafos: [
          "Tu sistema nervioso necesita recuperarse.",
          "Dormir bien no es un lujo.",
          "Es una necesidad.",
          "Intenta acostarte y levantarte a una hora similar cada día. Reduce las pantallas durante la última hora del día.",
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
      "*El equilibrio no nace de hacer grandes cambios, nace de repetir pequeños hábitos con amor y paciencia.*",
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
        "Frutas dulces como uvas, cerezas, melón, manzana, pera o mango.",
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
    desequilibran: {
      titulo: "¿Has comido hoy algo que te desequilibra… aunque te encante?",
      intro: "Marca lo que hayas tomado hoy. No es para culparte, sino para tomar conciencia: estos alimentos, calientes, picantes, ácidos o muy estimulantes, tienden a aumentar Pitta.",
      opciones: [
        "Comida muy picante (guindilla, chile).",
        "Fritos o comidas muy grasas.",
        "Mucho tomate o salsas ácidas.",
        "Vinagre o exceso de cítricos.",
        "Mucha sal.",
        "Encurtidos o fermentados.",
        "Quesos curados.",
        "Carnes rojas o embutidos.",
        "Ajo o cebolla cruda en exceso.",
        "Café.",
        "Bebidas energéticas.",
        "Alcohol.",
        "Chocolate.",
        "Salsas picantes.",
        "Exceso de especias muy calientes (pimienta negra, guindilla, mostaza).",
        "Infusiones muy estimulantes (té negro, jengibre fuerte).",
        "He comido con prisa o bajo estrés.",
      ],
    },
    equilibran: {
      titulo: "Alimentos que te equilibran y que puedes tomar hoy mismo",
      intro: "Marca los que tengas a mano o puedas incorporar hoy. Frescos, ligeros y refrescantes: justo lo que calma el fuego de Pitta.",
      opciones: [
        "Pepino.",
        "Calabacín.",
        "Espárragos.",
        "Brócoli y hojas verdes.",
        "Frutas dulces (melón, pera, uvas, mango).",
        "Coco o agua de coco.",
        "Arroz basmati.",
        "Cebada o avena.",
        "Aguacate.",
        "Ghee (en poca cantidad).",
        "Cilantro fresco.",
        "Yogur suave o lácteos frescos (si los toleras).",
        "Especia: cilantro.",
        "Especia: hinojo.",
        "Especia: cardamomo.",
        "Especia: comino.",
        "Especia: cúrcuma.",
        "Especia: menta.",
        "Infusión de menta.",
        "Infusión de manzanilla.",
        "Infusión de regaliz.",
        "Infusión de rosa.",
        "Infusión de hinojo.",
      ],
    },
    rutina: [
      { momento: "Despertar", actividad: "Medita para evitar comenzar el día con prisas." },
      { momento: "Ejercicio", actividad: "Natación o paseo." },
      { momento: "Desayuno", actividad: "Fresco y equilibrado.", comida: true },
      { momento: "Comida", actividad: "Tu comida más fuerte, a su hora y sin prisas.", comida: true },
      { momento: "Antes de dormir", actividad: "Leer o meditar." },
    ],

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
        items: ["Ejercicio de fuerza.", "Velocidad (correr, bicicleta, nadar...)", "Yoga.", "Senderismo."],
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
      compromisoTitulo: "Mi compromiso",
      compromisoIntro: "Elige solo uno para esta semana.",
      compromisos: [
        "Hacer una pausa real a mediodía.",
        "Terminar de trabajar a una hora fija.",
        "Comer sin pantallas.",
        "Moverme sin competir ni exigirme.",
        "Dedicar 10 minutos a no hacer nada.",
        "Acostarme un poco antes.",
      ],
    },
    cierre: [
      "*El equilibrio no consiste en hacer menos, consiste en aprender cuándo es el momento de parar.*",
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
        "Carnes de todo tipo.",
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
        { momento: "Cena", texto: ["Crema de verduras o verduras al vapor con tofu.", "Una cena ligera facilita el descanso y evita la sensación de pesadez."] },
      ],
    },
    alimCierre: ["*No comas por costumbre.*", "*Come porque tu cuerpo realmente lo necesita.*"],
    desequilibran: {
      titulo: "¿Has comido hoy algo que te desequilibra… aunque te encante?",
      intro: "Marca lo que hayas tomado hoy. No es para culparte, sino para tomar conciencia: estos alimentos, pesados, dulces, grasos o muy fríos, tienden a aumentar Kapha.",
      opciones: [
        "Dulces, bollería o postres.",
        "Helado.",
        "Quesos o exceso de lácteos.",
        "Fritos o comidas muy grasas.",
        "Pan y harinas refinadas.",
        "Bebidas azucaradas.",
        "Alimentos muy fríos o de la nevera.",
        "Carnes grasas.",
        "Frutos secos en exceso.",
        "Plátano o aguacate en exceso.",
        "He comido en exceso, aunque fuera sano.",
        "He picado entre horas sin hambre real.",
        "Exceso de sal.",
        "Infusiones muy dulces o con mucha leche.",
        "He comido por aburrimiento o por ansiedad.",
      ],
    },
    equilibran: {
      titulo: "Alimentos que te equilibran y que puedes tomar hoy mismo",
      intro: "Marca los que tengas a mano o puedas incorporar hoy. Ligeros, cálidos y estimulantes: justo lo que pone a Kapha en movimiento.",
      opciones: [
        "Verduras de hoja verde.",
        "Brócoli, coliflor, col o alcachofa.",
        "Espárragos.",
        "Legumbres (lentejas, garbanzos, judías).",
        "Cereales ligeros (cebada, mijo, quinoa).",
        "Frutas ligeras (manzana, pera, granada, frutos rojos).",
        "Verduras al vapor o salteadas.",
        "Sopas ligeras y especiadas.",
        "Miel cruda (con moderación).",
        "Especia: jengibre.",
        "Especia: pimienta negra.",
        "Especia: cúrcuma.",
        "Especia: mostaza.",
        "Especia: canela.",
        "Especia: comino.",
        "Especia: clavo.",
        "Infusión de jengibre.",
        "Infusión de canela.",
        "Infusión de jengibre con limón.",
        "Té de especias (chai sin azúcar).",
      ],
    },
    rutina: [
      { momento: "Despertar", actividad: "Levántate inmediatamente y activa tu cuerpo." },
      { momento: "Ejercicio", actividad: "Carrera o HIIT." },
      { momento: "Desayuno", actividad: "Ligero, o incluso omitirlo si no hay hambre.", comida: true },
      { momento: "Comida", actividad: "Ligera y especiada; que sea la principal del día.", comida: true },
      { momento: "Antes de dormir", actividad: "Evita el sofá y acuéstate temprano." },
    ],

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
          "La Ayurveda tradicional te recomienda ejercicio intenso antes de desayunar, pero está bien si lo haces más tarde siempre y cuando sea antes de las 8 de la tarde.",
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
      compromisoTitulo: "Mi compromiso",
      compromisoIntro: "Elige solo uno para esta semana.",
      compromisos: [
        "Caminar cada día.",
        "Levantarme en cuanto suene el despertador.",
        "Hacer ejercicio al menos tres días.",
        "Probar algo nuevo esta semana.",
        "Cenar más ligero y temprano.",
        "Evitar picar entre horas.",
      ],
    },
    cierre: [
      "*No hace falta cambiar toda tu vida, solo hace falta dar el primer paso.*",
    ],
  },
};
