// Contenido de las páginas de «Introducción a tu dosha» del recorrido de Ayurveda.
// Una entrada por dosha. El texto admite **negrita** y *cursiva* (se renderiza
// con un mini-parser en MetodoAyurvedaDoshaIntro). Vata está completo; Pitta y
// Kapha se rellenarán con el mismo formato cuando se defina su texto.

export type DoshaKey = "vata" | "pitta" | "kapha";

export interface DoshaIntro {
  emoji: string;
  /** Párrafos de bienvenida (hero). */
  intro: string[];
  /** Bloque «Antes de seguir…» con casillas de expectativas. */
  expectativas: { titulo: string; pregunta: string; opciones: string[]; nota: string };
  /** Bloque del principio del dosha (texto descriptivo). */
  principio: string[];
  /** Bloque «¿Te reconoces?» con casillas de frases. */
  reconoces: { titulo: string; intro: string; opciones: string[]; cierre: string[] };
  /** Bloque «Lo que descubrirás». */
  descubriras: { titulo: string; intro: string; items: { emoji: string; texto: string }[] };
  /** Pregunta final de texto libre (se guarda). */
  preguntaFinal: { titulo: string; pregunta: string; nota: string };
  /** Cierre. */
  cierre: string[];
}

export const DOSHA_INTRO: Record<DoshaKey, DoshaIntro | null> = {
  vata: {
    emoji: "🍃",
    intro: [
      "Si has llegado hasta aquí, es porque el test indica que **Vata** es el dosha que más predomina en ti.",
      "Antes de continuar, quiero decirte algo importante.",
      "**Esto no es una etiqueta.**",
      "No significa que siempre vayas a comportarte igual, ni que todo lo que te ocurre pueda explicarse únicamente por tu dosha.",
      "El Ayurveda entiende que **todos tenemos Vata, Pitta y Kapha**, pero cada persona nace con una combinación única. Esa combinación recibe el nombre de **Prakṛti**, y es la forma en que la naturaleza se expresa en ti.",
    ],
    expectativas: {
      titulo: "🌿 Antes de seguir…",
      pregunta: "¿Qué esperas encontrar en este recorrido?",
      opciones: [
        "Entender mejor mi personalidad.",
        "Comprender por qué me siento así.",
        "Aprender a cuidar mejor mi cuerpo.",
        "Mejorar mi alimentación.",
        "Sentirme más en paz conmigo.",
        "Solo tengo curiosidad.",
      ],
      nota: "No hay respuestas correctas. Este camino será diferente para cada persona.",
    },
    principio: [
      "Vata es el principio del movimiento.",
      "Es el viento que mueve las hojas, la respiración que entra en tus pulmones, el impulso que hace latir tu corazón y el pensamiento que aparece en tu mente.",
      "*Donde hay movimiento, está actuando Vata.*",
      "Si Vata predomina en ti, es probable que desde pequeño hayas sentido que tu mente funciona muy deprisa. Que tengas facilidad para imaginar, crear, aprender y entusiasmarte con nuevas ideas. Quizá también hayas sentido que a veces te cuesta descansar, mantener una rutina o terminar todo lo que empiezas.",
      "Nada de eso significa que haya algo mal en ti.",
      "Simplemente significa que la naturaleza se expresa en ti de una forma determinada.",
    ],
    reconoces: {
      titulo: "🍃 ¿Te reconoces?",
      intro: "Marca las frases con las que más te identificas.",
      opciones: [
        "Mi mente rara vez se detiene.",
        "Me emociono fácilmente con nuevas ideas.",
        "Me cuesta mantener una rutina durante mucho tiempo.",
        "A veces siento que vivo demasiado deprisa.",
        "Me adapto muy rápido a los cambios.",
        "Suelo olvidarme de cuidar de mí cuando estoy ocupado.",
      ],
      cierre: [
        "Cuantas más frases hayas marcado, más probable es que este recorrido resuene contigo.",
        "Y si alguna no encaja, no pasa nada.",
        "**El Ayurveda describe tendencias, no personas.**",
        "Cada ser humano es único.",
      ],
    },
    descubriras: {
      titulo: "Lo que descubrirás",
      intro: "A lo largo de este camino comprenderás:",
      items: [
        { emoji: "🌱", texto: "**Cómo piensa una persona Vata.**" },
        { emoji: "🫀", texto: "**Por qué tu cuerpo funciona como funciona.**" },
        { emoji: "🌬️", texto: "**Qué hábitos aumentan o equilibran tu naturaleza.**" },
        { emoji: "🥣", texto: "**Qué alimentación favorece tu bienestar.**" },
        { emoji: "🧘", texto: "**Cómo recuperar el equilibrio cuando sientes que te estás dispersando.**" },
        { emoji: "✨", texto: "**Y descubrirás que muchas de las cosas que hoy consideras defectos pueden convertirse en algunos de tus mayores dones.**" },
      ],
    },
    preguntaFinal: {
      titulo: "💭 Una última pregunta antes de empezar…",
      pregunta: "Si pudieras cambiar una sola cosa de ti en este momento, ¿cuál sería?",
      nota: "Guardaremos esta respuesta. Cuando termines el recorrido volveremos a ella.",
    },
    cierre: [
      "*No necesitas convertirte en otra persona.*",
      "*Solo necesitas comprender cómo funciona tu naturaleza para aprender a vivir en equilibrio con ella.*",
      "Comencemos.",
    ],
  },
  pitta: {
    emoji: "🔥",
    intro: [
      "Si has llegado hasta aquí, es porque el test indica que **Pitta** es el dosha que más predomina en ti.",
      "Antes de continuar, quiero decirte algo importante.",
      "**Esto no es una etiqueta.**",
      "No significa que tengas que ser competitivo, perfeccionista o vivir siempre con intensidad.",
      "El Ayurveda entiende que **todos tenemos Vata, Pitta y Kapha**, pero cada persona nace con una combinación única. Esa combinación recibe el nombre de **Prakṛti**, y es la forma en que la naturaleza se expresa en ti.",
    ],
    expectativas: {
      titulo: "🔥 Antes de seguir…",
      pregunta: "¿Qué esperas encontrar en este recorrido?",
      opciones: [
        "Entender mejor por qué soy como soy.",
        "Aprender a cuidar mejor mi cuerpo.",
        "Sentirme más tranquilo y en paz.",
        "Comprender por qué a veces me exijo tanto.",
        "Mejorar mi alimentación y mis hábitos.",
        "Solo tengo curiosidad.",
      ],
      nota: "No hay respuestas correctas. Cada persona llega hasta aquí por un motivo diferente.",
    },
    principio: [
      "Pitta es el principio de la transformación.",
      "Es el fuego que convierte los alimentos en energía, las ideas en decisiones y la intención en acción.",
      "*Donde hay transformación, está actuando Pitta.*",
      "Si Pitta predomina en ti, es probable que desde siempre hayas sentido una necesidad natural de avanzar, mejorar y hacer las cosas bien. Quizá disfrutes aprendiendo, resolviendo problemas o liderando situaciones. También es posible que, cuando las cosas no salen como esperabas, aparezcan la frustración, la impaciencia o la autocrítica.",
      "Nada de eso significa que haya algo mal en ti.",
      "Significa que tu naturaleza posee un gran fuego interior.",
      "Y como ocurre con cualquier fuego, cuando está equilibrado ilumina; cuando se desborda, quema.",
    ],
    reconoces: {
      titulo: "🔥 ¿Te reconoces?",
      intro: "Marca las frases con las que más te identificas.",
      opciones: [
        "Me gusta hacer las cosas bien.",
        "Me cuesta aceptar los errores, especialmente los míos.",
        "Me irrito cuando siento que algo es injusto o ineficiente.",
        "Suelo asumir responsabilidades con facilidad.",
        "Me exijo más de lo que exijo a los demás.",
        "Me cuesta desconectar o dejar de pensar en mis objetivos.",
      ],
      cierre: [
        "Cuantas más frases hayas marcado, más probable es que este recorrido resuene contigo.",
        "Y si alguna no encaja, no pasa nada.",
        "**El Ayurveda describe tendencias, no personas.**",
        "Cada ser humano expresa su naturaleza de una forma única.",
      ],
    },
    descubriras: {
      titulo: "Lo que descubrirás",
      intro: "A lo largo de este camino comprenderás:",
      items: [
        { emoji: "🧠", texto: "**Cómo piensa una persona Pitta.**" },
        { emoji: "🫀", texto: "**Por qué tu cuerpo funciona como funciona.**" },
        { emoji: "🔥", texto: "**Qué hábitos aumentan o equilibran tu fuego interior.**" },
        { emoji: "🥣", texto: "**Qué alimentación favorece tu bienestar.**" },
        { emoji: "🌿", texto: "**Cómo mantener tu capacidad de liderazgo sin caer en el exceso de exigencia.**" },
        { emoji: "✨", texto: "**Y descubrirás que aquello que hoy puede agotarte también puede convertirse en una de tus mayores fortalezas.**" },
      ],
    },
    preguntaFinal: {
      titulo: "💭 Una última pregunta antes de empezar…",
      pregunta: "Si pudieras bajar un poco la intensidad de una parte de tu vida, ¿cuál sería?",
      nota: "Guardaremos esta respuesta. Cuando termines el recorrido volveremos a ella.",
    },
    cierre: [
      "*No necesitas apagar tu fuego.*",
      "*Solo necesitas aprender a dirigirlo.*",
      "Comencemos.",
    ],
  },
  kapha: {
    emoji: "🌿",
    intro: [
      "Si has llegado hasta aquí, es porque el test indica que **Kapha** es el dosha que más predomina en ti.",
      "Antes de continuar, quiero decirte algo importante.",
      "**Esto no es una etiqueta.**",
      "No significa que seas lento, pasivo o que te cueste cambiar.",
      "El Ayurveda entiende que **todos tenemos Vata, Pitta y Kapha**, pero cada persona nace con una combinación única. Esa combinación recibe el nombre de **Prakṛti**, y es la forma en que la naturaleza se expresa en ti.",
    ],
    expectativas: {
      titulo: "🌿 Antes de seguir…",
      pregunta: "¿Qué esperas encontrar en este recorrido?",
      opciones: [
        "Comprender mejor mi forma de ser.",
        "Recuperar energía y motivación.",
        "Aprender a cuidarme mejor.",
        "Entender por qué me cuesta cambiar algunas cosas.",
        "Mejorar mi alimentación y mis hábitos.",
        "Solo tengo curiosidad.",
      ],
      nota: "No hay respuestas correctas. Cada persona llega hasta aquí por un motivo diferente.",
    },
    principio: [
      "Kapha es el principio de la estabilidad.",
      "Es la tierra que sostiene un árbol, el agua que nutre una semilla y la fuerza que mantiene unido todo aquello que la vida ha construido.",
      "*Donde hay estabilidad, nutrición y cuidado, está actuando Kapha.*",
      "Si Kapha predomina en ti, es probable que siempre hayas sido una persona tranquila, paciente y de confianza. Quizá los demás acudan a ti cuando necesitan apoyo o alguien que les escuche. También es posible que te cueste cerrar etapas, salir de tu zona de confort o dejar atrás aquello a lo que te has acostumbrado.",
      "Nada de eso significa que haya algo mal en ti.",
      "Significa que tu naturaleza está hecha para sostener.",
      "Y como ocurre con la tierra, cuando está equilibrada hace crecer la vida; cuando permanece inmóvil demasiado tiempo, puede volverse pesada.",
    ],
    reconoces: {
      titulo: "🌱 ¿Te reconoces?",
      intro: "Marca las frases con las que más te identificas.",
      opciones: [
        "Me cuesta salir de mi zona de confort.",
        "Soy una persona paciente y tranquila.",
        "Me apego fácilmente a personas, lugares o recuerdos.",
        "Prefiero la estabilidad antes que los cambios constantes.",
        "Me gusta cuidar de los demás.",
        "A veces pospongo cambios que sé que necesito hacer.",
      ],
      cierre: [
        "Cuantas más frases hayas marcado, más probable es que este recorrido resuene contigo.",
        "Y si alguna no encaja, no pasa nada.",
        "**El Ayurveda describe tendencias, no personas.**",
        "Cada ser humano expresa su naturaleza de una forma única.",
      ],
    },
    descubriras: {
      titulo: "Lo que descubrirás",
      intro: "A lo largo de este camino comprenderás:",
      items: [
        { emoji: "💚", texto: "**Cómo piensa una persona Kapha.**" },
        { emoji: "🫀", texto: "**Por qué tu cuerpo funciona como funciona.**" },
        { emoji: "🌱", texto: "**Qué hábitos aumentan o equilibran tu naturaleza.**" },
        { emoji: "🥣", texto: "**Qué alimentación favorece tu bienestar.**" },
        { emoji: "🏃", texto: "**Cómo mantener tu calma sin caer en el estancamiento.**" },
        { emoji: "✨", texto: "**Y descubrirás que aquello que hoy puede parecer una limitación también es una de tus mayores fortalezas.**" },
      ],
    },
    preguntaFinal: {
      titulo: "💭 Una última pregunta antes de empezar…",
      pregunta: "Si pudieras soltar una sola cosa en este momento, ¿qué sería?",
      nota: "Guardaremos esta respuesta. Cuando termines el recorrido volveremos a ella.",
    },
    cierre: [
      "*No necesitas perder tu calma.*",
      "*Solo necesitas recordar que la vida también crece cuando cambia.*",
      "Comencemos.",
    ],
  },
};
