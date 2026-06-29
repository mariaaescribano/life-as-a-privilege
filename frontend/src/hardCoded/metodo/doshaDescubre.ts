// Contenido de la página «Descubre quién eres» (paso posterior a la intro del
// dosha en el recorrido de Ayurveda). Una entrada por dosha. Texto con
// **negrita** y *cursiva* (mini-parser en la página). Vata completo; Pitta y
// Kapha se rellenarán con el mismo formato.

import type { DoshaKey } from "./doshaIntro";

export interface DoshaDescubre {
  /** Título grande (hero). */
  titulo: string;
  /** Párrafos de introducción del hero. */
  intro: string[];
  /** Bloque «Tu mente». */
  mente: { titulo: string; parrafos: string[] };
  /** Bloque «Tus dones». */
  dones: { titulo: string; intro: string; items: string[]; cierre: string };
  /** Bloque «Tus desafíos». */
  desafios: { titulo: string; intro: string[]; items: string[]; cierre: string[] };
  /** Bloque «¿Te reconoces?» (NO se guarda en BD). */
  reconoces: { titulo: string; intro: string; opciones: string[] };
  /** Bloque «Lo que el Ayurveda quiere que recuerdes». */
  recuerda: { titulo: string; parrafos: string[] };
  /** Reflexión final de texto libre (SÍ se guarda en BD). */
  reflexion: { titulo: string; pregunta: string; nota: string };
  /** Cierre (frases italic antes del botón «Continuar →»). */
  cierre: string[];
}

export const DOSHA_DESCUBRE: Record<DoshaKey, DoshaDescubre | null> = {
  vata: {
    titulo: "Descubre quién eres",
    intro: [
      "Antes de aprender qué comer o qué hábitos te ayudan, hay algo mucho más importante.",
      "Comprender tu naturaleza.",
      "Una persona Vata no vive la vida igual que una persona Pitta o Kapha. Percibe el mundo de una manera diferente, piensa diferente y responde de forma diferente a las mismas situaciones.",
      "Eso no significa que una forma sea mejor que otra.",
      "Simplemente significa que **la naturaleza se expresa de maneras distintas en cada persona.**",
    ],
    mente: {
      titulo: "Tu mente",
      parrafos: [
        "Tu mente es muy rápida.",
        "Las ideas aparecen con facilidad y suelen conectar unas con otras de forma casi automática. Tienes facilidad para aprender, imaginar, crear y encontrar soluciones originales.",
        "Tu creatividad es uno de tus mayores dones.",
        "Pero esa misma rapidez también puede hacer que te resulte difícil desconectar, mantener el foco durante mucho tiempo o terminar todo lo que empiezas.",
        "*Tu mente no necesita ir más deprisa.*",
        "*Necesita encontrar calma.*",
      ],
    },
    dones: {
      titulo: "Tus dones",
      intro: "Las personas Vata suelen destacar por:",
      items: ["Creatividad.", "Intuición.", "Sensibilidad.", "Entusiasmo.", "Adaptabilidad.", "Curiosidad."],
      cierre: "Cuando algo despierta tu interés, eres capaz de aprender muy deprisa y ver posibilidades donde otros solo ven problemas.",
    },
    desafios: {
      titulo: "Tus desafíos",
      intro: ["Todo don tiene una sombra.", "En Vata suele aparecer como:"],
      items: ["Dispersión.", "Inconstancia.", "Miedo.", "Ansiedad.", "Dificultad para mantener rutinas.", "Tendencia a sobrepensar."],
      cierre: ["No porque seas débil.", "Sino porque el viento siempre está en movimiento."],
    },
    reconoces: {
      titulo: "¿Te reconoces?",
      intro: "Marca aquellas frases con las que más te identifiques.",
      opciones: [
        "Mi cabeza rara vez deja de pensar.",
        "Empiezo proyectos con mucha ilusión.",
        "Me cuesta mantener una rutina durante mucho tiempo.",
        "Me entusiasmo fácilmente con cosas nuevas.",
        "A veces siento que vivo demasiado deprisa.",
        "Me adapto muy bien a los cambios.",
        "Me cuesta parar sin sentir que debería estar haciendo algo.",
      ],
    },
    recuerda: {
      titulo: "Lo que el Ayurveda quiere que recuerdes",
      parrafos: [
        "Las personas Vata suelen intentar cambiar una parte de sí mismas.",
        "Quieren dejar de ser tan sensibles.",
        "Quieren dejar de pensar tanto.",
        "Quieren ser más organizadas.",
        "Pero el objetivo nunca ha sido ese.",
        "**No necesitas dejar de pensar.**",
        "**Necesitas aprender a no vivir en tu mente.**",
        "Cuando Vata encuentra estabilidad, su imaginación se convierte en inspiración, su sensibilidad en intuición y su capacidad de adaptación en una de las mayores fortalezas que una persona puede desarrollar.",
      ],
    },
    reflexion: {
      titulo: "Reflexiona",
      pregunta: "¿Qué parte de esta descripción ha hecho que te sientas más identificado?",
      nota: "Guardaremos esta respuesta para recuperarla al final del recorrido.",
    },
    cierre: [
      "*No necesitas perder tu creatividad, necesitas darle raíces.*",
    ],
  },
  pitta: {
    titulo: "Descubre quién eres",
    intro: [
      "Antes de aprender qué comer o qué hábitos te ayudan, hay algo mucho más importante.",
      "Comprender tu naturaleza.",
      "Una persona Pitta no vive la vida igual que una persona Vata o Kapha. Tiende a buscar dirección, propósito y resultados. Le gusta entender cómo funcionan las cosas y mejorar aquello que toca.",
      "Eso no significa que una forma de ser sea mejor que otra.",
      "Simplemente significa que **la naturaleza se expresa de maneras distintas en cada persona.**",
    ],
    mente: {
      titulo: "Tu mente",
      parrafos: [
        "Tu mente busca claridad.",
        "Te gusta comprender, analizar y resolver.",
        "Cuando tienes un objetivo, eres capaz de mantener el foco durante mucho tiempo y trabajar con disciplina hasta conseguirlo. Sueles detectar rápidamente los errores y ver cómo mejorar las cosas.",
        "Ese es uno de tus mayores dones.",
        "Pero el mismo fuego que te ayuda a avanzar también puede hacer que seas demasiado exigente contigo mismo, que te cueste descansar o que sientas frustración cuando las cosas no salen como esperabas.",
        "*Tu fuego no necesita ser más intenso.*",
        "*Necesita aprender a descansar.*",
      ],
    },
    dones: {
      titulo: "Tus dones",
      intro: "Las personas Pitta suelen destacar por:",
      items: ["Inteligencia.", "Capacidad de organización.", "Liderazgo.", "Disciplina.", "Valentía.", "Claridad mental.", "Capacidad para tomar decisiones."],
      cierre: "Cuando encuentras un propósito, eres capaz de inspirar a otros y convertir las ideas en acciones.",
    },
    desafios: {
      titulo: "Tus desafíos",
      intro: ["Todo don tiene una sombra.", "En Pitta suele aparecer como:"],
      items: ["Autoexigencia.", "Perfeccionismo.", "Impaciencia.", "Necesidad de controlar.", "Frustración.", "Irritabilidad.", "Dificultad para desconectar."],
      cierre: ["No porque seas una persona enfadada.", "Sino porque el fuego siempre quiere seguir avanzando."],
    },
    reconoces: {
      titulo: "¿Te reconoces?",
      intro: "Marca aquellas frases con las que más te identifiques.",
      opciones: [
        "Me gusta hacer las cosas bien.",
        "Me cuesta aceptar mis propios errores.",
        "Cuando tengo un objetivo, me obsesiono hasta conseguirlo.",
        "Me irrita la injusticia o la falta de compromiso.",
        "Me cuesta desconectar del trabajo o de mis responsabilidades.",
        "A menudo siento que debería estar haciendo más.",
        "Me resulta difícil pedir ayuda.",
      ],
    },
    recuerda: {
      titulo: "Lo que el Ayurveda quiere que recuerdes",
      parrafos: [
        "Las personas Pitta suelen pensar que siempre necesitan hacer un poco más.",
        "Ser mejores.",
        "Trabajar más.",
        "Corregir más.",
        "Controlar más.",
        "Pero la verdadera fuerza no nace del esfuerzo constante.",
        "Nace del equilibrio.",
        "**No necesitas demostrar continuamente lo que vales.**",
        "**Tu valor no depende de todo lo que consigues.**",
        "Cuando Pitta encuentra calma, su inteligencia se convierte en sabiduría, su disciplina en inspiración y su liderazgo en una forma de servir a los demás, no de exigirse constantemente.",
      ],
    },
    reflexion: {
      titulo: "Reflexiona",
      pregunta: "¿En qué aspecto de tu vida sientes que te exiges más de lo que te gustaría?",
      nota: "Guardaremos esta respuesta para recuperarla al final del recorrido.",
    },
    cierre: [
      "*No necesitas apagar tu fuego, necesitas aprender a dirigirlo.*",
    ],
  },
  kapha: {
    titulo: "Descubre quién eres",
    intro: [
      "Antes de aprender qué comer o qué hábitos te ayudan, hay algo mucho más importante.",
      "Comprender tu naturaleza.",
      "Una persona Kapha no vive la vida igual que una persona Vata o Pitta. Tiende a buscar estabilidad, seguridad y armonía. Disfruta construyendo relaciones profundas, cuidando de los demás y creando un entorno donde las personas se sientan bien.",
      "Eso no significa que una forma de ser sea mejor que otra.",
      "Simplemente significa que **la naturaleza se expresa de maneras distintas en cada persona.**",
    ],
    mente: {
      titulo: "Tu mente",
      parrafos: [
        "Tu mente busca tranquilidad.",
        "No necesitas vivir deprisa para sentir que avanzas.",
        "Sueles pensar antes de actuar, escuchar antes de hablar y observar antes de decidir. Tienes una enorme capacidad para sostener a los demás, mantener la calma cuando todo se mueve y permanecer firme cuando otros pierden el equilibrio.",
        "Ese es uno de tus mayores dones.",
        "Pero esa misma estabilidad también puede hacer que te aferres demasiado a lo conocido, que postergues decisiones importantes o que te cueste salir de situaciones que ya no te hacen bien.",
        "*Tu calma no necesita desaparecer.*",
        "*Necesita aprender a ponerse en movimiento.*",
      ],
    },
    dones: {
      titulo: "Tus dones",
      intro: "Las personas Kapha suelen destacar por:",
      items: ["Paciencia.", "Lealtad.", "Compasión.", "Constancia.", "Generosidad.", "Capacidad para escuchar.", "Estabilidad emocional."],
      cierre: "Cuando alguien necesita apoyo, confianza o serenidad, es muy probable que piense en una persona como tú.",
    },
    desafios: {
      titulo: "Tus desafíos",
      intro: ["Todo don tiene una sombra.", "En Kapha suele aparecer como:"],
      items: ["Apego.", "Resistencia al cambio.", "Comodidad excesiva.", "Procrastinación.", "Falta de motivación.", "Dificultad para soltar.", "Tendencia a cargar con demasiado."],
      cierre: ["No porque seas una persona perezosa.", "Sino porque la tierra siempre busca permanecer estable."],
    },
    reconoces: {
      titulo: "¿Te reconoces?",
      intro: "Marca aquellas frases con las que más te identifiques.",
      opciones: [
        "Me cuesta salir de mi zona de confort.",
        "Me apego fácilmente a personas, lugares o recuerdos.",
        "Prefiero la estabilidad antes que los cambios constantes.",
        "Suelo cuidar de los demás antes que de mí.",
        "Cuando tomo una decisión, me mantengo firme.",
        "Me cuesta cerrar etapas de mi vida.",
        "A veces dejo pasar oportunidades porque espero «el momento perfecto».",
      ],
    },
    recuerda: {
      titulo: "Lo que el Ayurveda quiere que recuerdes",
      parrafos: [
        "Las personas Kapha suelen creer que cambiar significa perder seguridad.",
        "Pero la naturaleza nos enseña justo lo contrario.",
        "Los árboles crecen.",
        "Las estaciones cambian.",
        "Los ríos nunca dejan de fluir.",
        "Y, aun así, siguen siendo ellos mismos.",
        "**No necesitas dejar de ser una persona tranquila.**",
        "**Necesitas confiar en que también puedes crecer sin perder tu esencia.**",
        "Cuando Kapha encuentra equilibrio, su calma se convierte en presencia, su constancia en fortaleza y su capacidad de cuidar deja de ser sacrificio para convertirse en una forma consciente de amar.",
      ],
    },
    reflexion: {
      titulo: "Reflexiona",
      pregunta: "¿Qué hay en tu vida que sientes que ha llegado el momento de soltar o transformar?",
      nota: "Guardaremos esta respuesta para recuperarla al final del recorrido.",
    },
    cierre: [
      "*No necesitas perder tu calma, necesitas recordar que la vida también crece cuando cambia.*",
    ],
  },
};
