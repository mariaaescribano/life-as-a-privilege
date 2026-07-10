// Contenido de la página «¿Qué te desequilibra?» del recorrido de Ayurveda
// (paso posterior a «Así funciona tu cuerpo»). Una entrada por dosha.
// Texto con **negrita** y *cursiva*. Vata completo; Pitta y Kapha se rellenarán.

import type { DoshaKey } from "./doshaIntro";

export interface DoshaDesequilibrio {
  titulo: string;
  intro: string[];
  /** Lista de casillas «Lo que aumenta X» (local, no se guarda). */
  aumenta: { titulo: string; opciones: string[] };
  /** Interpretación según cuántas casillas se marcan. */
  marcado: { titulo: string; rangos: { label: string; min: number; max: number; texto: string }[] };
  /** «Las primeras señales». */
  senales: { titulo: string; intro: string[]; items: string[]; cierre: string };
  /** «¿Cómo volver al equilibrio?». */
  equilibrio: { titulo: string; intro: string[]; items: string[]; cierre: string[] };
  /** Reflexión final (SÍ se guarda en BD). */
  reflexion: { titulo: string; pregunta: string; nota: string };
  cierre: string[];
}

export const DOSHA_DESEQUILIBRIO: Record<DoshaKey, DoshaDesequilibrio | null> = {
  vata: {
    titulo: "¿Qué te desequilibra?",
    intro: [
      "Ahora ya conoces mejor tu naturaleza.",
      "La siguiente pregunta es sencilla.",
      "**¿Qué hábitos o costumbres te desequilibran?**",
      "En Ayurveda no enfermamos de un día para otro.",
      "Primero aparecen pequeños cambios que, si se mantienen en el tiempo, terminan afectando al cuerpo y a la mente.",
      "En una persona Vata, estos suelen ser los desencadenantes más frecuentes.",
    ],
    aumenta: {
      titulo: "Lo que aumenta Vata",
      opciones: [
        "Dormir pocas horas.",
        "Saltarme comidas.",
        "Comer deprisa.",
        "Viajar constantemente.",
        "Tener demasiados estímulos (pantallas, ruido, redes sociales…).",
        "Vivir sin horarios.",
        "Estrés continuo.",
        "Preocupación o miedo.",
      ],
    },
    marcado: {
      titulo: "¿Cuántas has marcado?",
      rangos: [
        { label: "0-2", min: 0, max: 2, texto: "Probablemente estés cuidando bastante bien tu naturaleza." },
        { label: "3-5", min: 3, max: 5, texto: "Tu Vata puede estar empezando a desequilibrarse." },
        { label: "6 o más", min: 6, max: 999, texto: "Quizá tu cuerpo ya esté intentando pedirte un descanso." },
      ],
    },
    senales: {
      titulo: "Las primeras señales",
      intro: [
        "Cuando Vata aumenta, el cuerpo suele avisar mucho antes de que aparezca un problema importante.",
        "Es frecuente notar:",
      ],
      items: [
        "Mente acelerada.",
        "Dificultad para concentrarse.",
        "Ansiedad o nerviosismo.",
        "Digestiones irregulares.",
        "Estreñimiento.",
        "Piel seca.",
        "Sueño ligero.",
        "Sensación de agotamiento.",
      ],
      cierre: "*Escuchar estas señales a tiempo es una de las bases del Ayurveda.*",
    },
    equilibrio: {
      titulo: "¿Cómo volver al equilibrio?",
      intro: [
        "La buena noticia es que Vata también suele responder muy bien a pequeños cambios.",
        "Empieza por lo más sencillo.",
      ],
      items: [
        "Mantén horarios regulares.",
        "Come alimentos calientes y nutritivos.",
        "Prioriza el descanso.",
        "Reduce el exceso de actividad.",
        "Dedica unos minutos al silencio o a la respiración.",
        "Permítete ir un poco más despacio.",
      ],
      cierre: [
        "No hace falta cambiar toda tu vida.",
        "A veces, repetir un pequeño hábito cada día tiene más impacto que hacer un gran cambio durante una semana.",
      ],
    },
    reflexion: {
      titulo: "Reflexiona",
      pregunta: "¿Qué hábito crees que más está alimentando tu Vata en este momento?",
      nota: "Lo recuperaremos al final del mapa.",
    },
    cierre: [
      "*El equilibrio no aparece sin más, se construye con pequeñas decisiones repetidas cada día.*",
    ],
  },
  pitta: {
    titulo: "¿Qué te desequilibra?",
    intro: [
      "Ahora ya conoces mejor tu naturaleza.",
      "La siguiente pregunta es sencilla.",
      "**¿Qué hace que tu fuego se desborde?**",
      "En Ayurveda no enfermamos de un día para otro.",
      "Primero aparecen pequeños desequilibrios que, si se mantienen en el tiempo, terminan afectando al cuerpo y a la mente.",
      "En una persona Pitta, estos suelen ser los desencadenantes más frecuentes.",
    ],
    aumenta: {
      titulo: "Lo que aumenta Pitta",
      opciones: [
        "Saltarme comidas.",
        "Comer muy picante, muy salado o muy ácido.",
        "Trabajar sin descansar.",
        "Exigirme demasiado.",
        "Competir constantemente.",
        "Intentar controlarlo todo.",
        "Pasar muchas horas frente a pantallas.",
        "Vivir con estrés o presión continua.",
        "Exponerme demasiado al calor.",
      ],
    },
    marcado: {
      titulo: "¿Cuántas has marcado?",
      rangos: [
        { label: "0-2", min: 0, max: 2, texto: "Probablemente estés cuidando bastante bien tu naturaleza." },
        { label: "3-5", min: 3, max: 5, texto: "Tu Pitta puede estar empezando a desequilibrarse." },
        { label: "6 o más", min: 6, max: 999, texto: "Quizá tu cuerpo ya esté intentando bajar la intensidad por ti." },
      ],
    },
    senales: {
      titulo: "Las primeras señales",
      intro: [
        "Cuando Pitta aumenta, el cuerpo suele avisar mucho antes de desarrollar un problema importante.",
        "Es frecuente notar:",
      ],
      items: [
        "Irritabilidad.",
        "Impaciencia.",
        "Acidez o ardor de estómago.",
        "Inflamación.",
        "Sensación de calor.",
        "Brotes de acné o erupciones.",
        "Dificultad para desconectar.",
        "Exceso de autocrítica.",
      ],
      cierre: "*Escuchar estas señales a tiempo es una de las bases del Ayurveda.*",
    },
    equilibrio: {
      titulo: "¿Cómo volver al equilibrio?",
      intro: [
        "La buena noticia es que Pitta responde muy bien cuando aprende a bajar el ritmo.",
        "Empieza por lo más sencillo.",
      ],
      items: [
        "Elige alimentos frescos y ligeros.",
        "No te saltes las comidas.",
        "Reserva momentos de descanso durante el día.",
        "Haz ejercicio sin llevar tu cuerpo al límite.",
        "Busca contacto con la naturaleza y espacios tranquilos.",
        "Practica la compasión contigo mismo tanto como la practicas con los demás.",
      ],
      cierre: [
        "No necesitas rendir menos.",
        "Necesitas cuidar el fuego que hace posible todo lo que consigues.",
      ],
    },
    reflexion: {
      titulo: "Reflexiona",
      pregunta: "¿Qué hábito sientes que está alimentando más tu fuego en este momento?",
      nota: "Lo recuperaremos al final del mapa.",
    },
    cierre: [
      "*El fuego ilumina cuando está equilibrado, pero cuando nunca descansa, termina consumiéndose a sí mismo.*",
    ],
  },
  kapha: {
    titulo: "¿Qué te desequilibra?",
    intro: [
      "Ahora ya conoces mejor tu naturaleza.",
      "La siguiente pregunta es sencilla.",
      "**¿Qué hace que tu energía se estanque?**",
      "En Ayurveda no enfermamos de un día para otro.",
      "Primero aparecen pequeños desequilibrios que, si se mantienen en el tiempo, terminan afectando al cuerpo y a la mente.",
      "En una persona Kapha, estos suelen ser los desencadenantes más frecuentes.",
    ],
    aumenta: {
      titulo: "Lo que aumenta Kapha",
      opciones: [
        "Dormir demasiadas horas.",
        "Llevar una vida sedentaria.",
        "Comer por aburrimiento o ansiedad.",
        "Comer en exceso.",
        "Consumir muchos alimentos dulces o muy pesados.",
        "Mantener siempre la misma rutina.",
        "Evitar los cambios por comodidad.",
        "Guardarme las emociones sin expresarlas.",
        "Permanecer demasiado tiempo en mi zona de confort.",
      ],
    },
    marcado: {
      titulo: "¿Cuántas has marcado?",
      rangos: [
        { label: "0-2", min: 0, max: 2, texto: "Probablemente estés cuidando bastante bien tu naturaleza." },
        { label: "3-5", min: 3, max: 5, texto: "Tu Kapha puede estar empezando a desequilibrarse." },
        { label: "6 o más", min: 6, max: 999, texto: "Quizá haya llegado el momento de volver a poner tu vida en movimiento." },
      ],
    },
    senales: {
      titulo: "Las primeras señales",
      intro: [
        "Cuando Kapha aumenta, el cuerpo suele avisar mucho antes de desarrollar un problema importante.",
        "Es frecuente notar:",
      ],
      items: [
        "Pesadez.",
        "Falta de motivación.",
        "Somnolencia.",
        "Digestiones lentas.",
        "Sensación de hinchazón.",
        "Exceso de mucosidad.",
        "Dificultad para iniciar cambios.",
        "Apego a personas, objetos o situaciones.",
      ],
      cierre: "*Escuchar estas señales a tiempo es una de las bases del Ayurveda.*",
    },
    equilibrio: {
      titulo: "¿Cómo volver al equilibrio?",
      intro: [
        "La buena noticia es que Kapha responde muy bien cuando vuelve a ponerse en movimiento.",
        "Empieza por lo más sencillo.",
      ],
      items: [
        "Camina todos los días.",
        "Elige comidas más ligeras y evita comer sin hambre.",
        "Levántate un poco antes por la mañana.",
        "Introduce movimiento en tu rutina, aunque sean pocos minutos.",
        "Atrévete a hacer algo diferente cada semana.",
        "Recuerda que cambiar no significa perder lo que eres.",
      ],
      cierre: [
        "No necesitas transformar toda tu vida de un día para otro.",
        "Solo necesitas dar el primer paso.",
      ],
    },
    reflexion: {
      titulo: "Reflexiona",
      pregunta: "¿Qué pequeño cambio llevas tiempo queriendo hacer, pero sigues posponiendo?",
      nota: "Lo recuperaremos al final del mapa.",
    },
    cierre: [
      "*La naturaleza nunca permanece completamente quieta, cuando tú también vuelves a moverte, recuperas tu equilibrio.*",
    ],
  },
};
