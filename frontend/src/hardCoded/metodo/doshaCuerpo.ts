// Contenido de la página «Así funciona tu cuerpo» (paso posterior a «Descubre
// quién eres» en el recorrido de Ayurveda). Una entrada por dosha. Texto con
// **negrita** y *cursiva*. Vata completo; Pitta y Kapha se rellenarán igual.

import type { DoshaKey } from "./doshaIntro";

export interface DoshaCuerpo {
  titulo: string;
  intro: string[];
  /** Secciones con título + párrafos (Tu energía, Tu digestión, Tu descanso…). */
  secciones: { titulo: string; parrafos: string[] }[];
  /** Sección «Tu cuerpo»: lista de características. */
  cuerpo: { titulo: string; intro: string; items: string[]; cierre: string };
  /** «¿Te reconoces?» (NO se guarda en BD). */
  reconoces: { titulo: string; intro: string; opciones: string[] };
  /** «Lo que el Ayurveda quiere que recuerdes». */
  recuerda: { titulo: string; parrafos: string[] };
  /** Reflexión final (SÍ se guarda en BD). */
  reflexion: { titulo: string; pregunta: string; nota: string };
  cierre: string[];
}

export const DOSHA_CUERPO: Record<DoshaKey, DoshaCuerpo | null> = {
  vata: {
    titulo: "Así funciona tu cuerpo",
    intro: [
      "Ahora que comprendes un poco mejor tu forma de ser, es el momento de entender tu cuerpo.",
      "En Ayurveda, el cuerpo y la mente no funcionan por separado.",
      "Tu constitución también influye en cómo digieres, cómo duermes, cómo respondes al estrés y en la energía que tienes a lo largo del día.",
      "Si Vata predomina en ti, es probable que muchas de las siguientes características te resulten familiares.",
    ],
    secciones: [
      {
        titulo: "Tu energía",
        parrafos: [
          "Tu energía no suele ser constante.",
          "Hay días en los que sientes que podrías hacerlo todo.",
          "Y otros en los que necesitas ir más despacio, sin saber muy bien por qué.",
          "No significa que tengas menos energía que otras personas.",
          "Simplemente, **tu energía funciona por impulsos**.",
          "Cuando algo te ilusiona puedes sentirte incansable, pero si no respetas tus límites es fácil que termines agotando tus reservas.",
          "*Tu cuerpo necesita alternar movimiento rápido y lento.*",
        ],
      },
      {
        titulo: "Tu digestión",
        parrafos: [
          "La digestión de Vata suele ser variable.",
          "Un día puedes tener mucha hambre y al siguiente casi ninguna.",
          "También es frecuente que el estrés, las prisas o los cambios de rutina afecten rápidamente a tu sistema digestivo, aumentando Vata.",
          "Cuando esto ocurre, pueden aparecer gases, hinchazón, digestiones irregulares o estreñimiento.",
          "Por eso, para una persona Vata, **cómo come suele ser casi tan importante como qué come.**",
        ],
      },
      {
        titulo: "Tu descanso",
        parrafos: [
          "Dormir no siempre significa descansar.",
          "Las personas Vata suelen tener un sueño ligero y, cuando están preocupadas o sobreestimuladas, pueden tardar en conciliar el sueño o despertarse varias veces durante la noche.",
          "Una mente que no se detiene durante el día tampoco suele hacerlo fácilmente cuando llega la noche.",
        ],
      },
    ],
    cuerpo: {
      titulo: "Tu cuerpo",
      intro: "Si Vata predomina en ti, probablemente también te reconozcas en varias de estas características:",
      items: [
        "Sueles tener las manos y los pies fríos.",
        "Tiendes a tener la piel más seca.",
        "Pierdes peso con facilidad.",
        "Tu cuerpo suele ser ligero y delgado.",
        "El frío y el viento te afectan más que a otras personas.",
      ],
      cierre: "Todo ello refleja la naturaleza de Vata: **fría, seca, ligera y móvil.**",
    },
    reconoces: {
      titulo: "¿Te reconoces?",
      intro: "Marca las frases con las que más te identifiques.",
      opciones: [
        "Tengo épocas con muchísima energía y otras en las que me siento agotado.",
        "Mi digestión cambia con facilidad.",
        "El estrés afecta rápidamente a mi estómago.",
        "Me cuesta dormir cuando tengo muchas cosas en la cabeza.",
        "Suelo tener las manos o los pies fríos.",
        "Mi piel tiende a ser seca.",
        "Necesito más descanso del que a veces me permito.",
      ],
    },
    recuerda: {
      titulo: "Lo que el Ayurveda quiere que recuerdes",
      parrafos: [
        "Tu cuerpo no está luchando contra ti.",
        "Está intentando adaptarse continuamente a tu naturaleza.",
        "Cuanto más escuches sus señales, antes podrás recuperar el equilibrio.",
        "Porque Vata rara vez avisa de golpe.",
        "Primero susurra.",
        "Después habla.",
        "Y solo cuando no lo escuchamos, empieza a gritar.",
      ],
    },
    reflexion: {
      titulo: "Reflexiona",
      pregunta: "¿Qué señal de tu cuerpo llevas tiempo ignorando?",
      nota: "La recuperaremos al final del mapa.",
    },
    cierre: [
      "*Escuchar tu cuerpo es el primer paso para aprender a cuidarlo.*",
    ],
  },
  pitta: {
    titulo: "Así funciona tu cuerpo",
    intro: [
      "Ahora que comprendes un poco mejor tu forma de ser, es el momento de entender tu cuerpo.",
      "En Ayurveda, el cuerpo y la mente no funcionan por separado.",
      "Tu constitución también influye en cómo digieres, cómo duermes, cómo respondes al estrés o incluso en la energía que tienes a lo largo del día.",
      "Si Pitta predomina en ti, es probable que muchas de las siguientes características te resulten familiares.",
    ],
    secciones: [
      {
        titulo: "Tu energía",
        parrafos: [
          "Tu energía suele ser constante.",
          "Cuando tienes un objetivo, eres capaz de mantener el foco durante horas y trabajar con una intensidad que otras personas admiran.",
          "La disciplina y la perseverancia forman parte de tu naturaleza.",
          "Sin embargo, esa misma intensidad también puede hacer que olvides descansar, que te exijas demasiado o que continúes incluso cuando tu cuerpo ya está pidiendo una pausa.",
          "*Tu cuerpo necesita alternar acción y descanso.*",
        ],
      },
      {
        titulo: "Tu digestión",
        parrafos: [
          "La digestión de Pitta suele ser fuerte.",
          "Es habitual sentir hambre a horas regulares y notar que el cuerpo funciona mejor cuando mantiene una rutina de comidas.",
          "Saltarte una comida o retrasarla demasiado puede hacer que aparezcan irritabilidad, acidez o una sensación de malestar.",
          "Cuando Pitta aumenta pueden aparecer digestiones demasiado intensas, ardor, reflujo o exceso de calor.",
          "Por eso, para una persona Pitta, **respetar el hambre y evitar los excesos es fundamental.**",
        ],
      },
      {
        titulo: "Tu descanso",
        parrafos: [
          "Las personas Pitta suelen dormir profundamente.",
          "Sin embargo, cuando atraviesan épocas de mucho trabajo, responsabilidad o presión, les cuesta desconectar mentalmente antes de dormir.",
          "Es frecuente acostarse pensando en lo que queda por hacer o despertarse con la mente ya preparada para comenzar el día.",
        ],
      },
    ],
    cuerpo: {
      titulo: "Tu cuerpo",
      intro: "Si Pitta predomina en ti, probablemente también te reconozcas en varias de estas características:",
      items: [
        "Sueles tener las manos y los pies calientes.",
        "Toleras peor el calor que el frío.",
        "Tu cuerpo suele tener una alta temperatura sin necesidad de mucha ropa.",
        "Tu piel puede ser sensible o enrojecerse con facilidad.",
        "Tiendes a tener una musculatura definida.",
        "El hambre aparece con bastante regularidad.",
      ],
      cierre: "Todo ello refleja la naturaleza de Pitta: **caliente, intensa, ligera y transformadora.**",
    },
    reconoces: {
      titulo: "¿Te reconoces?",
      intro: "Marca las frases con las que más te identifiques.",
      opciones: [
        "Necesito comer a horas regulares.",
        "Me irrito con facilidad cuando tengo hambre.",
        "Me cuesta descansar cuando tengo mucho trabajo.",
        "Suelo sentir bastante calor.",
        "Mi piel es sensible o se enrojece fácilmente.",
        "Me exijo incluso cuando estoy cansado.",
        "Me cuesta bajar el ritmo cuando tengo un objetivo.",
      ],
    },
    recuerda: {
      titulo: "Lo que el Ayurveda quiere que recuerdes",
      parrafos: [
        "Tu cuerpo no está intentando frenarte.",
        "Está intentando protegerte.",
        "El fuego necesita combustible.",
        "Pero también necesita momentos para disminuir su intensidad.",
        "Si alimentas constantemente una llama sin darle descanso, terminará consumiendo todo lo que encuentre.",
        "Lo mismo ocurre con Pitta.",
      ],
    },
    reflexion: {
      titulo: "Reflexiona",
      pregunta: "¿En qué momento notas que tu cuerpo te pide bajar el ritmo, pero tu mente decide seguir?",
      nota: "La recuperaremos al final del mapa.",
    },
    cierre: [
      "*Escuchar tu cuerpo también es una forma de inteligencia.*",
    ],
  },
  kapha: {
    titulo: "Así funciona tu cuerpo",
    intro: [
      "Ahora que comprendes un poco mejor tu forma de ser, es el momento de entender tu cuerpo.",
      "En Ayurveda, el cuerpo y la mente no funcionan por separado.",
      "Tu constitución también influye en cómo digieres, cómo duermes, cómo respondes al estrés o incluso en la energía que tienes a lo largo del día.",
      "Si Kapha predomina en ti, es probable que muchas de las siguientes características te resulten familiares.",
    ],
    secciones: [
      {
        titulo: "Tu energía",
        parrafos: [
          "Tu energía suele ser estable.",
          "No necesitas vivir con prisas para hacer las cosas bien. Sueles avanzar de forma constante y mantener el esfuerzo durante mucho tiempo.",
          "La paciencia y la resistencia forman parte de tu naturaleza.",
          "Sin embargo, cuando pierdes la motivación o permaneces demasiado tiempo en la misma rutina, esa estabilidad puede convertirse en pesadez, apatía o falta de impulso.",
          "*Tu cuerpo necesita alternar estabilidad y movimiento.*",
        ],
      },
      {
        titulo: "Tu digestión",
        parrafos: [
          "La digestión de Kapha suele ser lenta.",
          "Es habitual sentirse mejor con comidas ligeras y evitar comer por costumbre o por aburrimiento.",
          "Cuando Kapha aumenta pueden aparecer digestiones pesadas, sensación de plenitud, lentitud o dificultad para sentir hambre real.",
          "Por eso, para una persona Kapha, **comer solo cuando existe hambre y evitar los excesos suele ser una de las mejores formas de mantener el equilibrio.**",
        ],
      },
      {
        titulo: "Tu descanso",
        parrafos: [
          "Las personas Kapha suelen dormir profundamente y descansar con facilidad.",
          "Sin embargo, cuando Kapha aumenta, también puede aparecer una necesidad excesiva de dormir, dificultad para levantarse por las mañanas o sensación de cansancio incluso después de haber descansado muchas horas.",
          "A veces, el cuerpo no necesita más sueño.",
          "Necesita más movimiento.",
        ],
      },
    ],
    cuerpo: {
      titulo: "Tu cuerpo",
      intro: "Si Kapha predomina en ti, probablemente también te reconozcas en varias de estas características:",
      items: [
        "Sueles tener una constitución fuerte y estable.",
        "Ganas peso con facilidad.",
        "Tu piel suele ser suave e hidratada.",
        "Tienes buena resistencia física.",
        "Toleras mejor el frío que el calor húmedo.",
      ],
      cierre: "Todo ello refleja la naturaleza de Kapha: **pesada, estable, fría, húmeda y nutritiva.**",
    },
    reconoces: {
      titulo: "¿Te reconoces?",
      intro: "Marca las frases con las que más te identifiques.",
      opciones: [
        "Me cuesta ponerme en marcha por las mañanas.",
        "Tengo mucha resistencia cuando empiezo algo.",
        "Como a veces sin tener hambre real.",
        "Me cuesta cambiar rutinas que ya conozco.",
        "Puedo dormir muchas horas y seguir sintiéndome cansado.",
        "Gano peso con facilidad.",
        "Cuando encuentro una rutina, me resulta fácil mantenerla.",
      ],
    },
    recuerda: {
      titulo: "Lo que el Ayurveda quiere que recuerdes",
      parrafos: [
        "Tu cuerpo no necesita que luches contra él.",
        "Necesita que lo pongas en movimiento.",
        "La estabilidad es uno de tus mayores dones.",
        "Pero cuando deja de existir movimiento, incluso la tierra más fértil termina endureciéndose.",
        "Moverte no significa perder la calma.",
        "Significa permitir que la Vida siga fluyendo.",
      ],
    },
    reflexion: {
      titulo: "Reflexiona",
      pregunta: "¿Qué pequeño cambio llevas tiempo queriendo hacer, pero sigues posponiendo?",
      nota: "La recuperaremos al final del mapa.",
    },
    cierre: [
      "*Escuchar tu cuerpo también significa darle el movimiento que necesita.*",
    ],
  },
};
