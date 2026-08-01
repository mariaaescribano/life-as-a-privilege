/* ─────────────────────────────────────────────────────────────────────────────
 *  PREGUNTAS DEL ESTUDIO ESTADÍSTICO SOBRE ASTROLOGÍA
 *
 *  Este es EL fichero que se edita para cambiar el estudio. Todo lo demás
 *  (pantallas, guardado, estadísticas) se adapta solo a lo que haya aquí.
 *
 *  Cada arquetipo tiene DOS EJES, y cada eje sus doce posibilidades:
 *
 *      signos → Aries … Piscis   (dónde está el planeta en el zodíaco)
 *      casas  → 1 … 12           (en qué área de la vida cae)
 *
 *  A cada persona se le hacen solo las de SU carta: si tiene el Sol en Leo en la
 *  casa 3, ve las preguntas de «Sol en Leo» y las de «Sol en la casa 3». Por eso
 *  el porcentaje sale limpio: todo el que responde una pregunta comparte
 *  exactamente la misma posición.
 *
 *  Reglas:
 *   · Cada pregunta es de Sí o No. Nada de matices: el estudio mide proporción.
 *   · El `id` NO SE CAMBIA NUNCA una vez publicado el estudio: es la clave con
 *     la que se guardan las respuestas. Si cambias el `texto`, las respuestas
 *     anteriores siguen contando; si cambias el `id`, empiezan de cero. Para
 *     retirar una pregunta, bórrala (sus respuestas se quedan, pero ya no se
 *     pregunta). Para añadir una, ponle el siguiente número libre de ese signo.
 *   · El orden del array es el orden en que se preguntan, una a una.
 *   · Lo que no esté escrito, no se pregunta. Un arquetipo sin preguntas para el
 *     signo (o la casa) de esa persona sencillamente no le aparece: se pueden ir
 *     añadiendo planetas y ejes poco a poco sin tocar ninguna pantalla.
 *
 *  Los nombres de los signos se escriben EXACTAMENTE como los calcula la carta:
 *  Aries, Tauro, Géminis, Cáncer, Leo, Virgo, Libra, Escorpio, Sagitario,
 *  Capricornio, Acuario, Piscis. Las casas, como número: 1 … 12.
 * ───────────────────────────────────────────────────────────────────────────── */

import type { CuerpoKey } from "../components/metodo/astrologiaData";

export interface PreguntaEstudio {
  /** Clave estable con la que se guarda la respuesta. No se cambia. */
  id: string;
  /** Lo que lee quien participa. Se puede reescribir cuando se quiera. */
  texto: string;
}

/** Los dos ejes de cada arquetipo: en qué signo está y en qué casa cae. */
export type Eje = "signo" | "casa";

/** Preguntas indexadas por la posición: nombre del signo, o número de casa. */
export type PreguntasPorPosicion = Partial<Record<string, PreguntaEstudio[]>>;

export interface PreguntasArquetipo {
  signos?: PreguntasPorPosicion;
  casas?: PreguntasPorPosicion;
}

export const PREGUNTAS_ESTUDIO: Partial<Record<CuerpoKey, PreguntasArquetipo>> = {
  /* ─────────────────────────── ASCENDENTE ─────────────────────────── */
  // El Ascendente no tiene casa: ES la cúspide de la casa 1. Solo eje de signo.
  ascendente: {
    signos: {
      Aries: [
        { id: "ascendente-aries-1", texto: "¿Sueles actuar rápidamente cuando quieres algo?" },
        { id: "ascendente-aries-2", texto: "¿Te cuesta terminar algunos proyectos que empiezas?" },
        { id: "ascendente-aries-3", texto: "¿Necesitas sentir que estás creando o iniciando cosas nuevas?" },
        { id: "ascendente-aries-4", texto: "¿El ejercicio físico mejora claramente tu estado de ánimo?" },
        { id: "ascendente-aries-5", texto: "¿Te aburre hacer siempre lo mismo?" },
      ],
      Tauro: [
        { id: "ascendente-tauro-1", texto: "¿Las rutinas te hacen sentir seguro?" },
        { id: "ascendente-tauro-2", texto: "¿Te cuesta cambiar hábitos que llevas mucho tiempo manteniendo?" },
        { id: "ascendente-tauro-3", texto: "¿Eres constante cuando te propones un objetivo?" },
        { id: "ascendente-tauro-4", texto: "¿Prefieres la estabilidad antes que asumir riesgos innecesarios?" },
        { id: "ascendente-tauro-5", texto: "¿Notas que tu bienestar depende mucho de cómo se encuentra tu cuerpo?" },
      ],
      "Géminis": [
        { id: "ascendente-geminis-1", texto: "¿Aprendes con facilidad temas nuevos?" },
        { id: "ascendente-geminis-2", texto: "¿Tu mente cambia rápidamente de un tema a otro?" },
        { id: "ascendente-geminis-3", texto: "¿Te gusta conversar sobre muchos temas diferentes?" },
        { id: "ascendente-geminis-4", texto: "¿Te cuesta profundizar antes de cambiar de interés?" },
        { id: "ascendente-geminis-5", texto: "¿Sueles pensar demasiado?" },
      ],
      "Cáncer": [
        { id: "ascendente-cancer-1", texto: "¿Las emociones de otras personas te afectan con facilidad?" },
        { id: "ascendente-cancer-2", texto: "¿Te cuesta mostrar tu vulnerabilidad?" },
        { id: "ascendente-cancer-3", texto: "¿Necesitas sentir seguridad emocional para estar bien?" },
        { id: "ascendente-cancer-4", texto: "¿Sueles cuidar de otras personas antes que de ti?" },
        { id: "ascendente-cancer-5", texto: "¿Hay situaciones del pasado que todavía te afectan?" },
      ],
      Leo: [
        { id: "ascendente-leo-1", texto: "¿Te gusta sentir que destacas?" },
        { id: "ascendente-leo-2", texto: "¿La opinión de los demás influye en cómo te valoras?" },
        { id: "ascendente-leo-3", texto: "¿Te consideras una persona creativa?" },
        { id: "ascendente-leo-4", texto: "¿Sueles asumir el liderazgo de forma natural?" },
        { id: "ascendente-leo-5", texto: "¿Te cuesta aceptar las críticas?" },
      ],
      Virgo: [
        { id: "ascendente-virgo-1", texto: "¿Sueles fijarte mucho en los detalles?" },
        { id: "ascendente-virgo-2", texto: "¿Eres muy exigente contigo mismo?" },
        { id: "ascendente-virgo-3", texto: "¿Te cuesta sentir que lo que haces es suficiente?" },
        { id: "ascendente-virgo-4", texto: "¿Te gusta mantener el orden en tu entorno?" },
        { id: "ascendente-virgo-5", texto: "¿Sueles juzgar con facilidad los errores, propios o ajenos?" },
      ],
      Libra: [
        { id: "ascendente-libra-1", texto: "¿Te resulta más fácil tomar decisiones cuando puedes hablarlas con otra persona?" },
        { id: "ascendente-libra-2", texto: "¿Evitas los conflictos siempre que puedes?" },
        { id: "ascendente-libra-3", texto: "¿Buscas armonía en tus relaciones?" },
        { id: "ascendente-libra-4", texto: "¿Te cuesta decidir entre varias opciones?" },
        { id: "ascendente-libra-5", texto: "¿La opinión de los demás influye mucho en tus decisiones?" },
      ],
      Escorpio: [
        { id: "ascendente-escorpio-1", texto: "¿Sueles fijarte antes en los aspectos ocultos o profundos de una situación que en lo evidente?" },
        { id: "ascendente-escorpio-2", texto: "¿Sueles mantener una apariencia tranquila aunque por dentro sientas emociones intensas?" },
        { id: "ascendente-escorpio-3", texto: "¿Has vivido cambios profundos que transformaron tu forma de ser?" },
        { id: "ascendente-escorpio-4", texto: "¿Sueles ocultar pensamientos o emociones a los demás?" },
        { id: "ascendente-escorpio-5", texto: "¿Necesitas sentir que tienes el control de las situaciones?" },
      ],
      Sagitario: [
        { id: "ascendente-sagitario-1", texto: "¿Piensas más en el futuro que en el presente?" },
        { id: "ascendente-sagitario-2", texto: "¿Cuando alcanzas una meta ya estás pensando en la siguiente?" },
        { id: "ascendente-sagitario-3", texto: "¿Sueles hablar para ordenar tus ideas?" },
        { id: "ascendente-sagitario-4", texto: "¿Te interesan la filosofía o las grandes preguntas sobre la vida?" },
        { id: "ascendente-sagitario-5", texto: "¿Tiendes a exagerar las cosas?" },
      ],
      Capricornio: [
        { id: "ascendente-capricornio-1", texto: "¿Te sientes cómodo asumiendo responsabilidades?" },
        { id: "ascendente-capricornio-2", texto: "¿Eres disciplinado con tus objetivos?" },
        { id: "ascendente-capricornio-3", texto: "¿Te cuesta mostrar tus emociones?" },
        { id: "ascendente-capricornio-4", texto: "¿Sueles exigirte mucho a ti mismo?" },
        { id: "ascendente-capricornio-5", texto: "¿Prefieres planificar antes que improvisar?" },
      ],
      Acuario: [
        { id: "ascendente-acuario-1", texto: "¿Sueles sentir que eres diferente a la mayoría?" },
        { id: "ascendente-acuario-2", texto: "¿Prefieres observar antes que participar?" },
        { id: "ascendente-acuario-3", texto: "¿Te interesan las ideas para mejorar la sociedad?" },
        { id: "ascendente-acuario-4", texto: "¿Te cuesta sentir que encajas completamente en los grupos?" },
        { id: "ascendente-acuario-5", texto: "¿Antepones tus ideales a la opinión de la mayoría?" },
      ],
      Piscis: [
        { id: "ascendente-piscis-1", texto: "¿Las emociones de otras personas influyen fácilmente en ti?" },
        { id: "ascendente-piscis-2", texto: "¿Te consideras una persona muy sensible?" },
        { id: "ascendente-piscis-3", texto: "¿Te cuesta poner límites?" },
        { id: "ascendente-piscis-4", texto: "¿Sueles dejarte llevar por tus emociones?" },
        { id: "ascendente-piscis-5", texto: "¿Te resulta fácil empatizar con el sufrimiento de otras personas?" },
      ],
    },
  },

  /* ─────────────────────────────── SOL ─────────────────────────────── */
  sol: {
    signos: {
      Aries: [
        { id: "sol-aries-1", texto: "¿Necesitas sentir que consigues las cosas por ti mismo?" },
        { id: "sol-aries-2", texto: "¿Te cuesta soportar la indecisión o el estancamiento?" },
        { id: "sol-aries-3", texto: "¿Sueles actuar rápidamente cuando deseas algo?" },
        { id: "sol-aries-4", texto: "¿Consideras el fracaso una oportunidad para aprender?" },
        { id: "sol-aries-5", texto: "¿Necesitas libertad e independencia para sentirte bien?" },
      ],
      Tauro: [
        { id: "sol-tauro-1", texto: "¿Necesitas estabilidad para sentirte seguro?" },
        { id: "sol-tauro-2", texto: "¿Te cuesta cambiar hábitos o situaciones aunque ya no te beneficien?" },
        { id: "sol-tauro-3", texto: "¿Eres una persona paciente y constante?" },
        { id: "sol-tauro-4", texto: "¿Disfrutas especialmente de los placeres del mundo físico (comida, naturaleza, belleza…)?" },
        { id: "sol-tauro-5", texto: "¿Las personas te consideran alguien fiable?" },
      ],
      "Géminis": [
        { id: "sol-geminis-1", texto: "¿Disfrutas aprendiendo temas nuevos constantemente?" },
        { id: "sol-geminis-2", texto: "¿Te gusta comunicar o explicar lo que sabes?" },
        { id: "sol-geminis-3", texto: "¿Te aburres con facilidad cuando un tema deja de estimularte?" },
        { id: "sol-geminis-4", texto: "¿Te adaptas fácilmente a situaciones nuevas?" },
        { id: "sol-geminis-5", texto: "¿Sueles analizar las cosas desde la razón más que desde la emoción?" },
      ],
      "Cáncer": [
        { id: "sol-cancer-1", texto: "¿Necesitas sentir seguridad emocional para estar bien?" },
        { id: "sol-cancer-2", texto: "¿Las emociones influyen mucho en tus decisiones?" },
        { id: "sol-cancer-3", texto: "¿Te consideras una persona muy familiar u hogareña?" },
        { id: "sol-cancer-4", texto: "¿Sueles cuidar de otras personas de forma natural?" },
        { id: "sol-cancer-5", texto: "¿Te afectan mucho los recuerdos o experiencias del pasado?" },
      ],
      Leo: [
        { id: "sol-leo-1", texto: "¿Te gusta expresar quién eres de forma visible?" },
        { id: "sol-leo-2", texto: "¿Te consideras una persona creativa?" },
        { id: "sol-leo-3", texto: "¿Sueles asumir el liderazgo de forma natural?" },
        { id: "sol-leo-4", texto: "¿Necesitas sentir que se reconoce tu esfuerzo?" },
        { id: "sol-leo-5", texto: "¿Te resulta fácil transmitir entusiasmo a los demás?" },
      ],
      Virgo: [
        { id: "sol-virgo-1", texto: "¿Sueles fijarte en detalles que otras personas pasan por alto?" },
        { id: "sol-virgo-2", texto: "¿Eres exigente contigo mismo?" },
        { id: "sol-virgo-3", texto: "¿Disfrutas organizando o mejorando procesos?" },
        { id: "sol-virgo-4", texto: "¿Te gusta que las cosas estén ordenadas?" },
        { id: "sol-virgo-5", texto: "¿Analizas mucho antes de tomar una decisión?" },
      ],
      Libra: [
        { id: "sol-libra-1", texto: "¿Buscas mantener la armonía en tus relaciones?" },
        { id: "sol-libra-2", texto: "¿Te cuesta tomar decisiones importantes?" },
        { id: "sol-libra-3", texto: "¿Sueles intentar comprender todos los puntos de vista antes de opinar?" },
        { id: "sol-libra-4", texto: "¿Disfrutas de la belleza, el arte o la estética?" },
        { id: "sol-libra-5", texto: "¿Prefieres evitar los conflictos siempre que es posible?" },
      ],
      Escorpio: [
        { id: "sol-escorpio-1", texto: "¿Sueles interesarte por lo que otras personas ocultan?" },
        { id: "sol-escorpio-2", texto: "¿Vives las relaciones con mucha intensidad?" },
        { id: "sol-escorpio-3", texto: "¿Te cuesta confiar plenamente en los demás?" },
        { id: "sol-escorpio-4", texto: "¿Has vivido transformaciones profundas que cambiaron tu forma de ser?" },
        { id: "sol-escorpio-5", texto: "¿Necesitas sentir que tienes el control de las situaciones?" },
      ],
      Sagitario: [
        { id: "sol-sagitario-1", texto: "¿Piensas más en el futuro que en el presente?" },
        { id: "sol-sagitario-2", texto: "¿Necesitas aprender o descubrir cosas nuevas constantemente?" },
        { id: "sol-sagitario-3", texto: "¿Sueles decir lo que piensas de forma directa?" },
        { id: "sol-sagitario-4", texto: "¿Te interesan la filosofía, la espiritualidad o las grandes preguntas de la vida?" },
        { id: "sol-sagitario-5", texto: "¿Los viajes o conocer culturas nuevas te hacen sentir especialmente vivo?" },
      ],
      Capricornio: [
        { id: "sol-capricornio-1", texto: "¿Te sientes cómodo asumiendo responsabilidades?" },
        { id: "sol-capricornio-2", texto: "¿Eres disciplinado con tus objetivos?" },
        { id: "sol-capricornio-3", texto: "¿Piensas mucho antes de actuar?" },
        { id: "sol-capricornio-4", texto: "¿Te cuesta mostrar tus emociones?" },
        { id: "sol-capricornio-5", texto: "¿Prefieres construir resultados a largo plazo antes que buscar recompensas inmediatas?" },
      ],
      Acuario: [
        { id: "sol-acuario-1", texto: "¿Sueles sentir que ves el mundo de forma diferente a la mayoría?" },
        { id: "sol-acuario-2", texto: "¿La libertad es una de tus prioridades?" },
        { id: "sol-acuario-3", texto: "¿Te interesa mejorar la sociedad o cuestionar lo establecido?" },
        { id: "sol-acuario-4", texto: "¿Prefieres trabajar en equipo cuando compartís un mismo ideal?" },
        { id: "sol-acuario-5", texto: "¿Sueles priorizar la lógica sobre las emociones?" },
      ],
      Piscis: [
        { id: "sol-piscis-1", texto: "¿Las emociones de otras personas te afectan con facilidad?" },
        { id: "sol-piscis-2", texto: "¿Te consideras una persona muy intuitiva?" },
        { id: "sol-piscis-3", texto: "¿Tienes una imaginación especialmente activa?" },
        { id: "sol-piscis-4", texto: "¿Te cuesta enfrentarte a los conflictos directamente?" },
        { id: "sol-piscis-5", texto: "¿Sientes una necesidad natural de ayudar o aliviar el sufrimiento de otras personas?" },
      ],
    },

    casas: {
      1: [
        { id: "sol-casa1-1", texto: "¿Necesitas sentir que haces las cosas a tu manera?" },
        { id: "sol-casa1-2", texto: "¿Te cuesta aceptar que otras personas decidan por ti?" },
        { id: "sol-casa1-3", texto: "¿Sientes que necesitas encontrar tu propio camino, aunque sea diferente al de tu familia?" },
        { id: "sol-casa1-4", texto: "¿Te resulta importante que te reconozcan por quien eres?" },
        { id: "sol-casa1-5", texto: "¿Te identificas mucho con tu aspecto físico o tu imagen?" },
      ],
      2: [
        { id: "sol-casa2-1", texto: "¿Sientes que tu seguridad depende mucho de tus recursos económicos?" },
        { id: "sol-casa2-2", texto: "¿Te cuesta valorar quién eres sin tener en cuenta lo que consigues?" },
        { id: "sol-casa2-3", texto: "¿Disfrutas construyendo estabilidad para ti y para quienes quieres?" },
        { id: "sol-casa2-4", texto: "¿Te gusta compartir lo que tienes con otras personas?" },
        { id: "sol-casa2-5", texto: "¿Te preocupa perder la estabilidad material?" },
      ],
      3: [
        { id: "sol-casa3-1", texto: "¿Necesitas aprender constantemente cosas nuevas?" },
        { id: "sol-casa3-2", texto: "¿Te gusta compartir lo que aprendes con otras personas?" },
        { id: "sol-casa3-3", texto: "¿Sientes que expresarte te ayuda a comprenderte mejor?" },
        { id: "sol-casa3-4", texto: "¿Te interesan muchos temas diferentes a la vez?" },
        { id: "sol-casa3-5", texto: "¿Necesitas sentir que los demás escuchan tus ideas?" },
      ],
      4: [
        { id: "sol-casa4-1", texto: "¿La familia ha influido profundamente en quién eres?" },
        { id: "sol-casa4-2", texto: "¿Sientes que todavía estás construyendo tu propio hogar interior?" },
        { id: "sol-casa4-3", texto: "¿Te cuesta diferenciar quién eres de lo que espera tu familia?" },
        { id: "sol-casa4-4", texto: "¿Necesitas sentirte seguro en tu hogar para estar bien?" },
        { id: "sol-casa4-5", texto: "¿El autoconocimiento ha sido una parte importante de tu vida?" },
      ],
      5: [
        { id: "sol-casa5-1", texto: "¿Necesitas expresar tu creatividad para sentirte vivo?" },
        { id: "sol-casa5-2", texto: "¿Te gusta sentirte reconocido por lo que haces?" },
        { id: "sol-casa5-3", texto: "¿Te cuesta pasar desapercibido?" },
        { id: "sol-casa5-4", texto: "¿El amor o el romance influyen mucho en tu autoestima?" },
        { id: "sol-casa5-5", texto: "¿Disfrutas especialmente creando o emprendiendo proyectos propios?" },
      ],
      6: [
        { id: "sol-casa6-1", texto: "¿Necesitas sentir que tu trabajo es útil para otras personas?" },
        { id: "sol-casa6-2", texto: "¿La rutina te ayuda a sentirte estable?" },
        { id: "sol-casa6-3", texto: "¿Te preocupas mucho por tu salud o tu bienestar físico?" },
        { id: "sol-casa6-4", texto: "¿Tiendes a exigirte mucho en el trabajo?" },
        { id: "sol-casa6-5", texto: "¿Disfrutas mejorando procesos o encontrando formas más eficientes de hacer las cosas?" },
      ],
      7: [
        { id: "sol-casa7-1", texto: "¿Las relaciones son una parte fundamental para descubrir quién eres?" },
        { id: "sol-casa7-2", texto: "¿Te cuesta tomar decisiones importantes sin tener en cuenta a otras personas?" },
        { id: "sol-casa7-3", texto: "¿Buscas mantener la armonía en tus relaciones?" },
        { id: "sol-casa7-4", texto: "¿Sientes que necesitas una pareja o una asociación importante para desarrollarte plenamente?" },
        { id: "sol-casa7-5", texto: "¿Te cuesta priorizar tus propias necesidades frente a las de los demás?" },
      ],
      8: [
        { id: "sol-casa8-1", texto: "¿Las crisis importantes han cambiado profundamente tu forma de ser?" },
        { id: "sol-casa8-2", texto: "¿Te interesan los aspectos ocultos o psicológicos de la vida?" },
        { id: "sol-casa8-3", texto: "¿Te resulta fácil profundizar en temas que otras personas evitan?" },
        { id: "sol-casa8-4", texto: "¿El control o la confianza son temas importantes en tus relaciones?" },
        { id: "sol-casa8-5", texto: "¿Sientes que las transformaciones forman parte esencial de tu vida?" },
      ],
      9: [
        { id: "sol-casa9-1", texto: "¿Necesitas encontrar un sentido profundo a lo que vives?" },
        { id: "sol-casa9-2", texto: "¿Los viajes o conocer otras culturas han cambiado tu forma de pensar?" },
        { id: "sol-casa9-3", texto: "¿Te interesa la filosofía, la espiritualidad o las grandes preguntas de la vida?" },
        { id: "sol-casa9-4", texto: "¿Disfrutas enseñando o compartiendo tu visión del mundo?" },
        { id: "sol-casa9-5", texto: "¿Sientes que necesitas construir tu propia filosofía de vida?" },
      ],
      10: [
        { id: "sol-casa10-1", texto: "¿Tu desarrollo profesional ocupa un lugar muy importante en tu vida?" },
        { id: "sol-casa10-2", texto: "¿Necesitas sentir que dejas una huella en el mundo?" },
        { id: "sol-casa10-3", texto: "¿Te resulta natural asumir responsabilidades o liderar proyectos?" },
        { id: "sol-casa10-4", texto: "¿Te motiva alcanzar reconocimiento por tu trabajo?" },
        { id: "sol-casa10-5", texto: "¿Sientes que tienes una vocación muy marcada?" },
      ],
      11: [
        { id: "sol-casa11-1", texto: "¿Te motiva formar parte de proyectos colectivos?" },
        { id: "sol-casa11-2", texto: "¿Sientes que puedes aportar algo para mejorar la sociedad?" },
        { id: "sol-casa11-3", texto: "¿Las amistades ocupan un lugar muy importante en tu vida?" },
        { id: "sol-casa11-4", texto: "¿Te gusta colaborar con personas que comparten tus ideales?" },
        { id: "sol-casa11-5", texto: "¿Te cuesta desarrollar tu individualidad cuando formas parte de un grupo?" },
      ],
      12: [
        { id: "sol-casa12-1", texto: "¿Necesitas momentos de soledad para sentirte bien?" },
        { id: "sol-casa12-2", texto: "¿Sientes que muchas veces trabajas mejor entre bastidores que siendo protagonista?" },
        { id: "sol-casa12-3", texto: "¿La espiritualidad o el autoconocimiento forman parte importante de tu vida?" },
        { id: "sol-casa12-4", texto: "¿Te cuesta comprender plenamente quién eres?" },
        { id: "sol-casa12-5", texto: "¿Sientes que ayudar a los demás da sentido a tu vida?" },
      ],
    },
  },

  /* ────────────────────────────── LUNA ────────────────────────────── */
  luna: {
    signos: {
      Aries: [
        { id: "luna-aries-1", texto: "¿Cuando tienes un problema, prefieres actuar inmediatamente antes que hablar de cómo te sientes?" },
        { id: "luna-aries-2", texto: "¿Te cuesta aceptar que otras personas te digan cómo deberías hacer las cosas?" },
        { id: "luna-aries-3", texto: "¿Necesitas sentir que eres independiente para estar emocionalmente tranquilo?" },
        { id: "luna-aries-4", texto: "¿Tus enfados suelen ser intensos pero duran poco tiempo?" },
        { id: "luna-aries-5", texto: "¿Te cuesta pedir ayuda incluso cuando la necesitas?" },
      ],
      Tauro: [
        { id: "luna-tauro-1", texto: "¿La estabilidad económica influye mucho en tu tranquilidad emocional?" },
        { id: "luna-tauro-2", texto: "¿El contacto físico es una de las formas principales en las que te sientes querido?" },
        { id: "luna-tauro-3", texto: "¿Te cuesta soltar relaciones, rutinas o situaciones que ya conoces?" },
        { id: "luna-tauro-4", texto: "¿Necesitas comodidad y bienestar físico para sentirte en paz?" },
        { id: "luna-tauro-5", texto: "¿Cuando te comprometes con alguien o con un proyecto, te cuesta abandonarlo?" },
      ],
      "Géminis": [
        { id: "luna-geminis-1", texto: "¿Necesitas hablar de lo que te pasa para comprenderlo?" },
        { id: "luna-geminis-2", texto: "¿Tiendes a pensar tus emociones más que a sentirlas?" },
        { id: "luna-geminis-3", texto: "¿Cuando estás mal emocionalmente, tu mente no deja de darle vueltas al problema?" },
        { id: "luna-geminis-4", texto: "¿Te cuesta concentrarte mucho tiempo en una sola cosa?" },
        { id: "luna-geminis-5", texto: "¿Necesitas variedad y cambios para sentirte emocionalmente estimulado?" },
      ],
      "Cáncer": [
        { id: "luna-cancer-1", texto: "¿Las emociones de otras personas afectan fácilmente a tu estado de ánimo?" },
        { id: "luna-cancer-2", texto: "¿Esperas que las personas cercanas entiendan cómo te sientes sin que tengas que decirlo?" },
        { id: "luna-cancer-3", texto: "¿Necesitas sentir que tienes un hogar o un lugar seguro donde refugiarte?" },
        { id: "luna-cancer-4", texto: "¿Te cuesta poner límites cuando alguien necesita ayuda?" },
        { id: "luna-cancer-5", texto: "¿Cuando te hacen daño, tiendes a encerrarte en ti mismo?" },
      ],
      Leo: [
        { id: "luna-leo-1", texto: "¿Necesitas sentirte valorado para sentirte querido?" },
        { id: "luna-leo-2", texto: "¿Cuando no recibes reconocimiento, sientes que algo dentro de ti se apaga?" },
        { id: "luna-leo-3", texto: "¿Expresas tus emociones de forma intensa y visible?" },
        { id: "luna-leo-4", texto: "¿Te cuesta aceptar críticas cuando has puesto ilusión en algo?" },
        { id: "luna-leo-5", texto: "¿Te nace proteger y fortalecer la autoestima de otras personas?" },
      ],
      Virgo: [
        { id: "luna-virgo-1", texto: "¿Demuestras cariño ayudando o siendo útil a los demás?" },
        { id: "luna-virgo-2", texto: "¿Te cuesta relajarte cuando sientes que algo está desordenado o fuera de control?" },
        { id: "luna-virgo-3", texto: "¿Analizas tus emociones antes de permitirte sentirlas?" },
        { id: "luna-virgo-4", texto: "¿Sientes que debes hacer las cosas muy bien para sentirte valioso?" },
        { id: "luna-virgo-5", texto: "¿Tiendes a preocuparte más por los pequeños detalles que por el conjunto?" },
      ],
      Libra: [
        { id: "luna-libra-1", texto: "¿Te cuesta decir «no» por miedo a generar conflicto?" },
        { id: "luna-libra-2", texto: "¿Necesitas sentir armonía en tus relaciones para estar emocionalmente bien?" },
        { id: "luna-libra-3", texto: "¿Sueles pensar mucho antes de tomar una decisión importante?" },
        { id: "luna-libra-4", texto: "¿Buscas con frecuencia la aprobación de las personas que quieres?" },
        { id: "luna-libra-5", texto: "¿Te afectan mucho las discusiones o los ambientes tensos?" },
      ],
      Escorpio: [
        { id: "luna-escorpio-1", texto: "¿Te cuesta mostrar tu vulnerabilidad hasta confiar plenamente en alguien?" },
        { id: "luna-escorpio-2", texto: "¿Pones a prueba a las personas antes de abrirte emocionalmente?" },
        { id: "luna-escorpio-3", texto: "¿Las experiencias difíciles han transformado profundamente tu forma de vivir?" },
        { id: "luna-escorpio-4", texto: "¿Sientes que vives las emociones con una intensidad poco común?" },
        { id: "luna-escorpio-5", texto: "¿Te atraen los temas relacionados con la psicología, el misterio o los procesos de transformación?" },
      ],
      Sagitario: [
        { id: "luna-sagitario-1", texto: "¿Necesitas sentir libertad para estar emocionalmente bien?" },
        { id: "luna-sagitario-2", texto: "¿Los viajes o las experiencias nuevas te ayudan a recuperar el ánimo?" },
        { id: "luna-sagitario-3", texto: "¿Sueles mantener el optimismo incluso cuando las cosas van mal?" },
        { id: "luna-sagitario-4", texto: "¿Necesitas encontrar un sentido o propósito a lo que vives?" },
        { id: "luna-sagitario-5", texto: "¿Te cuesta mantener el interés en proyectos largos cuando dejan de motivarte?" },
      ],
      Capricornio: [
        { id: "luna-capricornio-1", texto: "¿Sientes que tienes que ganarte el cariño mediante el esfuerzo o la responsabilidad?" },
        { id: "luna-capricornio-2", texto: "¿Te cuesta pedir apoyo emocional a otras personas?" },
        { id: "luna-capricornio-3", texto: "¿Sueles mostrar una imagen de fortaleza aunque por dentro estés mal?" },
        { id: "luna-capricornio-4", texto: "¿Te resulta difícil confiar emocionalmente en los demás?" },
        { id: "luna-capricornio-5", texto: "¿Asumes responsabilidades incluso cuando nadie te las pide?" },
      ],
      Acuario: [
        { id: "luna-acuario-1", texto: "¿Necesitas mucha libertad para sentirte emocionalmente seguro?" },
        { id: "luna-acuario-2", texto: "¿Sientes que las amistades son tan importantes como la familia?" },
        { id: "luna-acuario-3", texto: "¿Te cuesta depender emocionalmente de otras personas?" },
        { id: "luna-acuario-4", texto: "¿Te resulta más fácil comprender las ideas que las emociones?" },
        { id: "luna-acuario-5", texto: "¿Necesitas sentir que puedes ser diferente sin que te juzguen?" },
      ],
      Piscis: [
        { id: "luna-piscis-1", texto: "¿Te cuesta distinguir entre tus emociones y las de otras personas?" },
        { id: "luna-piscis-2", texto: "¿Absorbes fácilmente el ambiente emocional de los lugares donde estás?" },
        { id: "luna-piscis-3", texto: "¿Te cuesta poner límites cuando alguien necesita ayuda?" },
        { id: "luna-piscis-4", texto: "¿Tiendes a idealizar a las personas que quieres?" },
        { id: "luna-piscis-5", texto: "¿Cuando una situación te supera, prefieres evitarla antes que afrontarla?" },
      ],
    },
    casas: {
      1: [
        { id: "luna-casa1-1", texto: "¿Te cuesta dejar de buscar la aprobación de otras personas?" },
        { id: "luna-casa1-2", texto: "¿Tus cambios de ánimo influyen mucho en cómo te muestras al mundo?" },
        { id: "luna-casa1-3", texto: "¿Sueles cuidar de otras personas antes que de ti mismo?" },
        { id: "luna-casa1-4", texto: "¿Te resulta difícil separar lo que tú quieres de lo que esperan de ti?" },
        { id: "luna-casa1-5", texto: "¿Necesitas sentirte aceptado para estar emocionalmente tranquilo?" },
      ],
      2: [
        { id: "luna-casa2-1", texto: "¿La seguridad económica influye mucho en tu bienestar emocional?" },
        { id: "luna-casa2-2", texto: "¿Tiendes a buscar consuelo en la comida o en otros placeres físicos?" },
        { id: "luna-casa2-3", texto: "¿Te cuesta sentir que vales independientemente de lo que tienes?" },
        { id: "luna-casa2-4", texto: "¿Te resulta difícil desprenderte de objetos con valor emocional?" },
        { id: "luna-casa2-5", texto: "¿Los cambios económicos afectan mucho a tu estado de ánimo?" },
      ],
      3: [
        { id: "luna-casa3-1", texto: "¿Necesitas hablar de lo que sientes para entenderlo?" },
        { id: "luna-casa3-2", texto: "¿Tus emociones cambian con facilidad según el entorno?" },
        { id: "luna-casa3-3", texto: "¿Te cuesta concentrarte cuando estás emocionalmente alterado?" },
        { id: "luna-casa3-4", texto: "¿Necesitas aprender cosas nuevas para sentirte emocionalmente estimulado?" },
        { id: "luna-casa3-5", texto: "¿Sueles expresar tus emociones hablando más que sintiéndolas?" },
      ],
      4: [
        { id: "luna-casa4-1", texto: "¿Necesitas sentir que tienes un hogar donde refugiarte?" },
        { id: "luna-casa4-2", texto: "¿La familia sigue influyendo mucho en cómo te sientes?" },
        { id: "luna-casa4-3", texto: "¿Te cuesta expresar lo que sientes esperando que los demás lo adivinen?" },
        { id: "luna-casa4-4", texto: "¿Los recuerdos del pasado tienen mucho peso emocional para ti?" },
        { id: "luna-casa4-5", texto: "¿Necesitas sentir pertenencia para estar en paz?" },
      ],
      5: [
        { id: "luna-casa5-1", texto: "¿Necesitas sentirte querido y admirado para sentirte bien?" },
        { id: "luna-casa5-2", texto: "¿Te enamoras con facilidad?" },
        { id: "luna-casa5-3", texto: "¿Disfrutas expresando tus emociones de forma creativa?" },
        { id: "luna-casa5-4", texto: "¿Los hijos o los proyectos creativos ocupan un lugar importante en tu mundo emocional?" },
        { id: "luna-casa5-5", texto: "¿Te afecta especialmente sentir que pasas desapercibido?" },
      ],
      6: [
        { id: "luna-casa6-1", texto: "¿Tiendes a cuidar de otras personas antes que de ti mismo?" },
        { id: "luna-casa6-2", texto: "¿Cuando estás estresado, tu cuerpo suele resentirse?" },
        { id: "luna-casa6-3", texto: "¿La rutina te ayuda a sentirte emocionalmente estable?" },
        { id: "luna-casa6-4", texto: "¿Te cuesta descansar sin sentir que deberías estar haciendo algo útil?" },
        { id: "luna-casa6-5", texto: "¿Necesitas sentir que eres útil para sentirte querido?" },
      ],
      7: [
        { id: "luna-casa7-1", texto: "¿Te cuesta sentirte emocionalmente bien cuando no tienes pareja o un vínculo cercano?" },
        { id: "luna-casa7-2", texto: "¿Tiendes a adaptarte demasiado a las necesidades de la otra persona?" },
        { id: "luna-casa7-3", texto: "¿Buscas en la pareja la seguridad emocional que te falta?" },
        { id: "luna-casa7-4", texto: "¿Te cuesta mantener tu identidad dentro de una relación?" },
        { id: "luna-casa7-5", texto: "¿Las relaciones influyen mucho en tu estado de ánimo?" },
      ],
      8: [
        { id: "luna-casa8-1", texto: "¿Te cuesta distinguir entre tus emociones y las de otras personas?" },
        { id: "luna-casa8-2", texto: "¿Necesitas momentos de soledad para recuperar el equilibrio emocional?" },
        { id: "luna-casa8-3", texto: "¿Las experiencias difíciles han transformado profundamente tu forma de sentir?" },
        { id: "luna-casa8-4", texto: "¿Te atraen los temas relacionados con la psicología, la muerte o la transformación?" },
        { id: "luna-casa8-5", texto: "¿Sientes que tus emociones suelen ser más intensas que las de la mayoría?" },
      ],
      9: [
        { id: "luna-casa9-1", texto: "¿Los viajes o vivir experiencias nuevas alimentan tu bienestar emocional?" },
        { id: "luna-casa9-2", texto: "¿Necesitas encontrar un sentido profundo a lo que vives?" },
        { id: "luna-casa9-3", texto: "¿Te interesa la filosofía, la espiritualidad o la religión?" },
        { id: "luna-casa9-4", texto: "¿Te gusta compartir lo que has aprendido con otras personas?" },
        { id: "luna-casa9-5", texto: "¿Sientes que ampliar tu visión del mundo te hace sentir más pleno?" },
      ],
      10: [
        { id: "luna-casa10-1", texto: "¿Necesitas sentir que tu trabajo aporta algo a los demás?" },
        { id: "luna-casa10-2", texto: "¿El reconocimiento público influye mucho en tu bienestar emocional?" },
        { id: "luna-casa10-3", texto: "¿Te resulta difícil separar tu vida personal de tus responsabilidades?" },
        { id: "luna-casa10-4", texto: "¿Sueles refugiarte en el trabajo cuando algo te preocupa?" },
        { id: "luna-casa10-5", texto: "¿Sientes que cuidar de otras personas forma parte de tu vocación?" },
      ],
      11: [
        { id: "luna-casa11-1", texto: "¿Las amistades ocupan un lugar muy importante en tu vida?" },
        { id: "luna-casa11-2", texto: "¿Te gusta cuidar o proteger a las personas de tu grupo?" },
        { id: "luna-casa11-3", texto: "¿Necesitas sentir que perteneces a una comunidad?" },
        { id: "luna-casa11-4", texto: "¿Las opiniones de tus amigos influyen mucho en tus decisiones?" },
        { id: "luna-casa11-5", texto: "¿Disfrutas reuniendo personas y creando un ambiente acogedor?" },
      ],
      12: [
        { id: "luna-casa12-1", texto: "¿Te cuesta distinguir entre tus emociones y las del entorno?" },
        { id: "luna-casa12-2", texto: "¿Necesitas periodos de soledad para sentirte bien?" },
        { id: "luna-casa12-3", texto: "¿Tiendes a esconder lo que sientes?" },
        { id: "luna-casa12-4", texto: "¿Los sueños o la intuición tienen mucha importancia en tu vida?" },
        { id: "luna-casa12-5", texto: "¿Sientes que ayudas mejor a los demás desde un segundo plano?" },
      ],
    },
  },

  /* ──────────────────────────── MERCURIO ──────────────────────────── */
  mercurio: {
    signos: {
      Aries: [
        { id: "mercurio-aries-1", texto: "¿Sueles encontrar soluciones rápidamente cuando surge un problema?" },
        { id: "mercurio-aries-2", texto: "¿Hablas antes de haber pensado completamente lo que quieres decir?" },
        { id: "mercurio-aries-3", texto: "¿Te cuesta terminar proyectos que empiezas con mucho entusiasmo?" },
        { id: "mercurio-aries-4", texto: "¿Disfrutas los retos que exigen pensar rápido?" },
        { id: "mercurio-aries-5", texto: "¿Cambias de opinión con facilidad cuando aparece una idea nueva?" },
      ],
      Tauro: [
        { id: "mercurio-tauro-1", texto: "¿Necesitas comprobar las cosas por ti mismo antes de creerlas?" },
        { id: "mercurio-tauro-2", texto: "¿Te cuesta cambiar de opinión una vez has tomado una decisión?" },
        { id: "mercurio-tauro-3", texto: "¿Prefieres aprender mediante la experiencia antes que con la teoría?" },
        { id: "mercurio-tauro-4", texto: "¿Piensas de forma práctica antes que abstracta?" },
        { id: "mercurio-tauro-5", texto: "¿Sueles recordar con facilidad conversaciones o cosas que te han dicho?" },
      ],
      "Géminis": [
        { id: "mercurio-geminis-1", texto: "¿Necesitas aprender constantemente cosas nuevas para no aburrirte?" },
        { id: "mercurio-geminis-2", texto: "¿Saltas con facilidad de un tema a otro cuando algo deja de interesarte?" },
        { id: "mercurio-geminis-3", texto: "¿Disfrutas comunicando o explicando lo que sabes?" },
        { id: "mercurio-geminis-4", texto: "¿Te resulta fácil relacionar ideas muy diferentes entre sí?" },
        { id: "mercurio-geminis-5", texto: "¿Te cuesta mantener la concentración durante mucho tiempo en un mismo tema?" },
      ],
      "Cáncer": [
        { id: "mercurio-cancer-1", texto: "¿Tus emociones influyen mucho en tu forma de pensar?" },
        { id: "mercurio-cancer-2", texto: "¿Recuerdas con facilidad acontecimientos del pasado y de tu familia?" },
        { id: "mercurio-cancer-3", texto: "¿Te afectan especialmente las críticas o la opinión de los demás?" },
        { id: "mercurio-cancer-4", texto: "¿Te cuesta ser objetivo cuando un tema te toca emocionalmente?" },
        { id: "mercurio-cancer-5", texto: "¿Necesitas procesar emocionalmente una experiencia antes de poder pasar página?" },
      ],
      Leo: [
        { id: "mercurio-leo-1", texto: "¿Te gusta transmitir tus ideas de forma inspiradora?" },
        { id: "mercurio-leo-2", texto: "¿Sueles intentar convencer a los demás de tus ideas?" },
        { id: "mercurio-leo-3", texto: "¿Te motiva que se reconozca tu inteligencia o tu forma de comunicar?" },
        { id: "mercurio-leo-4", texto: "¿Tiendes a fijarte en la visión general más que en los pequeños detalles?" },
        { id: "mercurio-leo-5", texto: "¿Te resulta natural asumir el papel de portavoz o líder en un grupo?" },
      ],
      Virgo: [
        { id: "mercurio-virgo-1", texto: "¿Analizas los problemas con mucho detalle antes de actuar?" },
        { id: "mercurio-virgo-2", texto: "¿Te cuesta dar por terminado un trabajo porque siempre ves algo que mejorar?" },
        { id: "mercurio-virgo-3", texto: "¿Necesitas que las explicaciones sean claras y precisas?" },
        { id: "mercurio-virgo-4", texto: "¿Te resulta difícil disfrutar de conversaciones demasiado superficiales?" },
        { id: "mercurio-virgo-5", texto: "¿Tiendes a revisar varias veces tu trabajo antes de darlo por bueno?" },
      ],
      Libra: [
        { id: "mercurio-libra-1", texto: "¿Antes de opinar intentas comprender todos los puntos de vista?" },
        { id: "mercurio-libra-2", texto: "¿Te cuesta tomar decisiones por miedo a equivocarte?" },
        { id: "mercurio-libra-3", texto: "¿Evitas las discusiones cuando es posible?" },
        { id: "mercurio-libra-4", texto: "¿Necesitas dialogar con otras personas para aclarar tus ideas?" },
        { id: "mercurio-libra-5", texto: "¿Te preocupa ser justo incluso cuando eso complica una decisión?" },
      ],
      Escorpio: [
        { id: "mercurio-escorpio-1", texto: "¿Necesitas investigar a fondo antes de sacar conclusiones?" },
        { id: "mercurio-escorpio-2", texto: "¿Sueles percibir intenciones o motivaciones que otras personas no ven?" },
        { id: "mercurio-escorpio-3", texto: "¿Te cuesta cambiar de opinión cuando ya has formado una convicción?" },
        { id: "mercurio-escorpio-4", texto: "¿Prefieres las conversaciones profundas antes que las superficiales?" },
        { id: "mercurio-escorpio-5", texto: "¿Detectas con facilidad las contradicciones o debilidades en el razonamiento de otras personas?" },
      ],
      Sagitario: [
        { id: "mercurio-sagitario-1", texto: "¿Disfrutas aprendiendo ideas o conceptos nuevos de forma constante?" },
        { id: "mercurio-sagitario-2", texto: "¿Te interesan más las posibilidades futuras que el pasado?" },
        { id: "mercurio-sagitario-3", texto: "¿Te resulta fácil comprender conceptos abstractos?" },
        { id: "mercurio-sagitario-4", texto: "¿Te gusta enseñar o compartir lo que aprendes?" },
        { id: "mercurio-sagitario-5", texto: "¿Los viajes o conocer culturas diferentes amplían tu forma de pensar?" },
      ],
      Capricornio: [
        { id: "mercurio-capricornio-1", texto: "¿Piensas detenidamente antes de tomar una decisión importante?" },
        { id: "mercurio-capricornio-2", texto: "¿Te gusta planificar las cosas con antelación?" },
        { id: "mercurio-capricornio-3", texto: "¿Prefieres soluciones prácticas antes que ideas poco realistas?" },
        { id: "mercurio-capricornio-4", texto: "¿Una vez te propones un objetivo mental, perseveras hasta conseguirlo?" },
        { id: "mercurio-capricornio-5", texto: "¿Sueles pensar primero en los riesgos antes que en las oportunidades?" },
      ],
      Acuario: [
        { id: "mercurio-acuario-1", texto: "¿Sueles llegar a conclusiones diferentes a las de la mayoría?" },
        { id: "mercurio-acuario-2", texto: "¿Te interesan especialmente las ideas innovadoras o poco convencionales?" },
        { id: "mercurio-acuario-3", texto: "¿Aprendes con facilidad conceptos abstractos o complejos?" },
        { id: "mercurio-acuario-4", texto: "¿Necesitas libertad para desarrollar tus propias ideas?" },
        { id: "mercurio-acuario-5", texto: "¿Tiendes a analizar las situaciones desde la lógica más que desde la emoción?" },
      ],
      Piscis: [
        { id: "mercurio-piscis-1", texto: "¿Tu intuición influye tanto como la lógica en tu forma de pensar?" },
        { id: "mercurio-piscis-2", texto: "¿Te cuesta expresar exactamente todo lo que piensas?" },
        { id: "mercurio-piscis-3", texto: "¿Tu imaginación suele llevarte a crear escenarios o posibilidades nuevas?" },
        { id: "mercurio-piscis-4", texto: "¿Necesitas un ambiente tranquilo para pensar con claridad?" },
        { id: "mercurio-piscis-5", texto: "¿Te resulta difícil dar respuestas completamente cerradas cuando una situación tiene muchos matices?" },
      ],
    },
    casas: {
      1: [
        { id: "mercurio-casa1-1", texto: "¿Necesitas aprender constantemente para sentirte seguro?" },
        { id: "mercurio-casa1-2", texto: "¿Se te da bien encontrar soluciones a los problemas?" },
        { id: "mercurio-casa1-3", texto: "¿Sueles hablar antes de pensar del todo lo que vas a decir?" },
        { id: "mercurio-casa1-4", texto: "¿Te cuesta comprender el punto de vista de otras personas cuando piensas que tienes razón?" },
        { id: "mercurio-casa1-5", texto: "¿Te adaptas con facilidad a situaciones nuevas?" },
      ],
      2: [
        { id: "mercurio-casa2-1", texto: "¿Te interesa comprender cómo funcionan el dinero o los recursos?" },
        { id: "mercurio-casa2-2", texto: "¿Necesitas entender algo de forma práctica antes de confiar en ello?" },
        { id: "mercurio-casa2-3", texto: "¿Sueles tener muchas ideas para generar ingresos o recursos?" },
        { id: "mercurio-casa2-4", texto: "¿La seguridad económica influye en tu tranquilidad mental?" },
        { id: "mercurio-casa2-5", texto: "¿Prefieres aprender mediante la experiencia antes que solo con teoría?" },
      ],
      3: [
        { id: "mercurio-casa3-1", texto: "¿Disfrutas comunicando o conversando con personas diferentes?" },
        { id: "mercurio-casa3-2", texto: "¿Siempre tienes algo que decir en una conversación?" },
        { id: "mercurio-casa3-3", texto: "¿Necesitas movimiento y variedad para mantener tu interés?" },
        { id: "mercurio-casa3-4", texto: "¿Te resulta fácil defender tus ideas con argumentos?" },
        { id: "mercurio-casa3-5", texto: "¿Te cuesta profundizar en un solo tema durante mucho tiempo?" },
      ],
      4: [
        { id: "mercurio-casa4-1", texto: "¿Te interesa conocer la historia de tu familia o tus raíces?" },
        { id: "mercurio-casa4-2", texto: "¿Aprendes mejor cuando puedes reflexionar en tranquilidad?" },
        { id: "mercurio-casa4-3", texto: "¿Los cambios en el hogar han influido en tu forma de pensar?" },
        { id: "mercurio-casa4-4", texto: "¿Sueles pensar mucho en el pasado o en tu historia familiar?" },
        { id: "mercurio-casa4-5", texto: "¿Necesitas sentir estabilidad en casa para pensar con claridad?" },
      ],
      5: [
        { id: "mercurio-casa5-1", texto: "¿Disfrutas expresándote de forma creativa?" },
        { id: "mercurio-casa5-2", texto: "¿Te atraen especialmente las personas que estimulan tu mente?" },
        { id: "mercurio-casa5-3", texto: "¿Necesitas sentirte intelectualmente admirado?" },
        { id: "mercurio-casa5-4", texto: "¿Te gusta comunicar tus ideas mediante proyectos creativos?" },
        { id: "mercurio-casa5-5", texto: "¿Piensas con frecuencia en el amor o las relaciones?" },
      ],
      6: [
        { id: "mercurio-casa6-1", texto: "¿Se te da bien detectar cómo mejorar un proceso o resolver un problema práctico?" },
        { id: "mercurio-casa6-2", texto: "¿Necesitas mantener tu mente ocupada para sentirte bien?" },
        { id: "mercurio-casa6-3", texto: "¿El estrés mental termina afectando a tu cuerpo?" },
        { id: "mercurio-casa6-4", texto: "¿Disfrutas organizando y optimizando tareas?" },
        { id: "mercurio-casa6-5", texto: "¿Te cuesta dejar de pensar cuando tienes un problema pendiente?" },
      ],
      7: [
        { id: "mercurio-casa7-1", texto: "¿Necesitas conversar mucho con tu pareja para sentir conexión?" },
        { id: "mercurio-casa7-2", texto: "¿Te atraen personas inteligentes o mentalmente estimulantes?" },
        { id: "mercurio-casa7-3", texto: "¿Analizas mucho las relaciones antes de tomar decisiones?" },
        { id: "mercurio-casa7-4", texto: "¿Te interesa comprender cómo piensan otras personas?" },
        { id: "mercurio-casa7-5", texto: "¿Sientes que aprendes mucho a través de tus relaciones?" },
      ],
      8: [
        { id: "mercurio-casa8-1", texto: "¿Te atraen especialmente la psicología, el misterio o los temas ocultos?" },
        { id: "mercurio-casa8-2", texto: "¿Necesitas comprender las motivaciones profundas de las personas?" },
        { id: "mercurio-casa8-3", texto: "¿Sueles guardar para ti lo que realmente piensas o sientes?" },
        { id: "mercurio-casa8-4", texto: "¿Te cuesta dejar de pensar en un tema que te obsesiona?" },
        { id: "mercurio-casa8-5", texto: "¿Disfrutas investigando aquello que otras personas pasan por alto?" },
      ],
      9: [
        { id: "mercurio-casa9-1", texto: "¿Necesitas comprender el sentido profundo de las cosas?" },
        { id: "mercurio-casa9-2", texto: "¿Te interesan la filosofía, la espiritualidad o la religión?" },
        { id: "mercurio-casa9-3", texto: "¿Disfrutas enseñando o compartiendo conocimientos?" },
        { id: "mercurio-casa9-4", texto: "¿Los viajes o conocer otras culturas han ampliado tu forma de pensar?" },
        { id: "mercurio-casa9-5", texto: "¿Te resulta más importante comprender los principios generales que los pequeños detalles?" },
      ],
      10: [
        { id: "mercurio-casa10-1", texto: "¿Te gusta que se reconozca tu inteligencia o tus ideas?" },
        { id: "mercurio-casa10-2", texto: "¿Sueles cambiar de trabajo o asumir varios proyectos a la vez?" },
        { id: "mercurio-casa10-3", texto: "¿Necesitas sentir que tu conocimiento tiene utilidad pública?" },
        { id: "mercurio-casa10-4", texto: "¿Te interesa seguir aprendiendo a lo largo de toda tu vida profesional?" },
        { id: "mercurio-casa10-5", texto: "¿Buscas construir una reputación basada en tus capacidades intelectuales?" },
      ],
      11: [
        { id: "mercurio-casa11-1", texto: "¿Las conversaciones con tus amigos amplían tu forma de pensar?" },
        { id: "mercurio-casa11-2", texto: "¿Disfrutas participando en grupos donde se intercambian ideas?" },
        { id: "mercurio-casa11-3", texto: "¿Sueles analizar las situaciones desde la lógica antes que desde la emoción?" },
        { id: "mercurio-casa11-4", texto: "¿Te cuesta desconectar tu mente cuando estás solo?" },
        { id: "mercurio-casa11-5", texto: "¿Te atraen especialmente las personas originales o intelectualmente inquietas?" },
      ],
      12: [
        { id: "mercurio-casa12-1", texto: "¿Te cuesta expresar todo lo que realmente piensas?" },
        { id: "mercurio-casa12-2", texto: "¿Necesitas tiempo a solas para ordenar tus pensamientos?" },
        { id: "mercurio-casa12-3", texto: "¿Te interesan la psicología o el funcionamiento del inconsciente?" },
        { id: "mercurio-casa12-4", texto: "¿Sientes que tu mente puede jugarte malas pasadas cuando piensas demasiado?" },
        { id: "mercurio-casa12-5", texto: "¿La escritura o la reflexión te ayudan a comprenderte mejor?" },
      ],
    },
  },

  /* ───────────────────────────── VENUS ────────────────────────────── */
  venus: {
    signos: {
      Aries: [
        { id: "venus-aries-1", texto: "¿Necesitas sentir emoción y novedad para mantener vivo el interés en una relación?" },
        { id: "venus-aries-2", texto: "¿La libertad dentro de la pareja es imprescindible para ti?" },
        { id: "venus-aries-3", texto: "¿Sueles dar el primer paso cuando alguien te atrae?" },
        { id: "venus-aries-4", texto: "¿Te aburren las relaciones demasiado rutinarias o predecibles?" },
        { id: "venus-aries-5", texto: "¿Tiendes a actuar impulsivamente cuando te enamoras?" },
      ],
      Tauro: [
        { id: "venus-tauro-1", texto: "¿Necesitas estabilidad para entregarte emocionalmente?" },
        { id: "venus-tauro-2", texto: "¿El contacto físico es una de tus principales formas de expresar cariño?" },
        { id: "venus-tauro-3", texto: "¿Te cuesta dejar ir una relación cuando te has comprometido?" },
        { id: "venus-tauro-4", texto: "¿Prefieres relaciones que crezcan despacio antes que pasiones repentinas?" },
        { id: "venus-tauro-5", texto: "¿Los pequeños gestos de cariño valen más para ti que las grandes promesas?" },
      ],
      "Géminis": [
        { id: "venus-geminis-1", texto: "¿Necesitas conversar mucho con tu pareja para sentir conexión?" },
        { id: "venus-geminis-2", texto: "¿Te atraen las personas que estimulan tu mente?" },
        { id: "venus-geminis-3", texto: "¿Te aburres cuando una relación deja de sorprenderte intelectualmente?" },
        { id: "venus-geminis-4", texto: "¿Prefieres relaciones donde exista mucha libertad personal?" },
        { id: "venus-geminis-5", texto: "¿Sueles vivir el amor primero como una amistad?" },
      ],
      "Cáncer": [
        { id: "venus-cancer-1", texto: "¿Necesitas sentirte cuidado para poder abrirte emocionalmente?" },
        { id: "venus-cancer-2", texto: "¿La familia influye mucho en tus relaciones de pareja?" },
        { id: "venus-cancer-3", texto: "¿Te resulta fácil cuidar emocionalmente de la persona que amas?" },
        { id: "venus-cancer-4", texto: "¿Los cambios en la relación afectan mucho a tu estado de ánimo?" },
        { id: "venus-cancer-5", texto: "¿Cuando te sientes inseguro puedes volverte más protector o posesivo?" },
      ],
      Leo: [
        { id: "venus-leo-1", texto: "¿Necesitas sentirte admirado o valorado por tu pareja?" },
        { id: "venus-leo-2", texto: "¿Te gusta demostrar el amor de forma visible y generosa?" },
        { id: "venus-leo-3", texto: "¿Vives el amor con mucha intensidad y pasión?" },
        { id: "venus-leo-4", texto: "¿Te afecta especialmente sentirte ignorado por la persona que amas?" },
        { id: "venus-leo-5", texto: "¿Disfrutas compartiendo con orgullo a tu pareja o vuestra relación?" },
      ],
      Virgo: [
        { id: "venus-virgo-1", texto: "¿Sueles demostrar el amor ayudando o cuidando de forma práctica?" },
        { id: "venus-virgo-2", texto: "¿Te cuesta mostrar afecto hasta sentir plena confianza?" },
        { id: "venus-virgo-3", texto: "¿Analizas mucho si una relación realmente funciona?" },
        { id: "venus-virgo-4", texto: "¿Tiendes a fijarte en lo que podría mejorar en la relación?" },
        { id: "venus-virgo-5", texto: "¿Necesitas mantener cierta independencia incluso cuando estás enamorado?" },
      ],
      Libra: [
        { id: "venus-libra-1", texto: "¿La armonía es una prioridad en tus relaciones?" },
        { id: "venus-libra-2", texto: "¿Evitas los conflictos con tu pareja siempre que puedes?" },
        { id: "venus-libra-3", texto: "¿Te preocupa mucho gustar o resultar atractivo para los demás?" },
        { id: "venus-libra-4", texto: "¿Buscas una relación que sientas equilibrada y justa?" },
        { id: "venus-libra-5", texto: "¿Te cuesta priorizar tus necesidades cuando quieres mantener la paz?" },
      ],
      Escorpio: [
        { id: "venus-escorpio-1", texto: "¿Necesitas sentir una conexión emocional muy profunda para enamorarte?" },
        { id: "venus-escorpio-2", texto: "¿Te cuesta vivir relaciones superficiales?" },
        { id: "venus-escorpio-3", texto: "¿Vives el amor con mucha intensidad?" },
        { id: "venus-escorpio-4", texto: "¿Cuando amas, te entregas casi por completo?" },
        { id: "venus-escorpio-5", texto: "¿Los celos o la necesidad de control han aparecido alguna vez en tus relaciones?" },
      ],
      Sagitario: [
        { id: "venus-sagitario-1", texto: "¿Necesitas sentir libertad dentro de la relación?" },
        { id: "venus-sagitario-2", texto: "¿Te enamoras de personas que te inspiran a crecer?" },
        { id: "venus-sagitario-3", texto: "¿La honestidad es una condición imprescindible para amar?" },
        { id: "venus-sagitario-4", texto: "¿Te ilusiona compartir viajes o aventuras con tu pareja?" },
        { id: "venus-sagitario-5", texto: "¿Te cuesta permanecer en relaciones que sientes estancadas?" },
      ],
      Capricornio: [
        { id: "venus-capricornio-1", texto: "¿Necesitas sentir estabilidad antes de abrirte emocionalmente?" },
        { id: "venus-capricornio-2", texto: "¿Te cuesta mostrar tus sentimientos al principio de una relación?" },
        { id: "venus-capricornio-3", texto: "¿Prefieres relaciones serias antes que aventuras pasajeras?" },
        { id: "venus-capricornio-4", texto: "¿La confianza se gana lentamente para ti?" },
        { id: "venus-capricornio-5", texto: "¿La responsabilidad y la fiabilidad son cualidades esenciales en una pareja?" },
      ],
      Acuario: [
        { id: "venus-acuario-1", texto: "¿Necesitas mucha libertad dentro de tus relaciones?" },
        { id: "venus-acuario-2", texto: "¿Te atraen personas diferentes o poco convencionales?" },
        { id: "venus-acuario-3", texto: "¿La amistad es una parte fundamental del amor para ti?" },
        { id: "venus-acuario-4", texto: "¿Te cuesta sentirte cómodo con relaciones demasiado dependientes?" },
        { id: "venus-acuario-5", texto: "¿Valoras más que tu pareja respete tu individualidad que las demostraciones constantes de afecto?" },
      ],
      Piscis: [
        { id: "venus-piscis-1", texto: "¿Tiendes a idealizar a la persona de la que te enamoras?" },
        { id: "venus-piscis-2", texto: "¿Te resulta difícil poner límites cuando amas?" },
        { id: "venus-piscis-3", texto: "¿Sientes una fuerte necesidad de cuidar o salvar a quien quieres?" },
        { id: "venus-piscis-4", texto: "¿Las relaciones tienen para ti un componente muy espiritual o profundo?" },
        { id: "venus-piscis-5", texto: "¿Un pequeño gesto de rechazo puede afectarte durante mucho tiempo?" },
      ],
    },
    casas: {
      1: [
        { id: "venus-casa1-1", texto: "¿Necesitas sentirte atractivo o valorado para sentirte bien contigo mismo?" },
        { id: "venus-casa1-2", texto: "¿Te afecta mucho la opinión de los demás sobre ti?" },
        { id: "venus-casa1-3", texto: "¿Te resulta fácil crear vínculos con personas nuevas?" },
        { id: "venus-casa1-4", texto: "¿Tiendes a buscar aprobación cuando dudas de tu propio valor?" },
        { id: "venus-casa1-5", texto: "¿Te cuesta reconocer tu valor sin que otras personas te lo confirmen?" },
      ],
      2: [
        { id: "venus-casa2-1", texto: "¿La estabilidad económica influye mucho en tu sensación de bienestar?" },
        { id: "venus-casa2-2", texto: "¿Disfrutas especialmente de los placeres materiales o sensoriales?" },
        { id: "venus-casa2-3", texto: "¿Relacionas a veces tu valor personal con lo que tienes o consigues?" },
        { id: "venus-casa2-4", texto: "¿Se te da bien encontrar oportunidades para generar recursos?" },
        { id: "venus-casa2-5", texto: "¿Te cuesta disfrutar plenamente cuando sientes inseguridad económica?" },
      ],
      3: [
        { id: "venus-casa3-1", texto: "¿Te enamoran especialmente las personas con las que puedes conversar durante horas?" },
        { id: "venus-casa3-2", texto: "¿Utilizas las palabras para demostrar cariño o interés?" },
        { id: "venus-casa3-3", texto: "¿Te resulta fácil crear conexión a través de la conversación?" },
        { id: "venus-casa3-4", texto: "¿Los viajes cortos o las escapadas son importantes para tu bienestar?" },
        { id: "venus-casa3-5", texto: "¿Sueles evitar el conflicto utilizando la diplomacia?" },
      ],
      4: [
        { id: "venus-casa4-1", texto: "¿Necesitas sentir que tu hogar es un lugar bonito y armonioso?" },
        { id: "venus-casa4-2", texto: "¿La familia influye mucho en tu forma de vivir el amor?" },
        { id: "venus-casa4-3", texto: "¿Buscas seguridad emocional antes de abrirte a una relación?" },
        { id: "venus-casa4-4", texto: "¿Sientes que amor y hogar van unidos para ti?" },
        { id: "venus-casa4-5", texto: "¿Te interesa conocer tus raíces o la historia de tu familia?" },
      ],
      5: [
        { id: "venus-casa5-1", texto: "¿Te enamoras con facilidad del amor o del romance?" },
        { id: "venus-casa5-2", texto: "¿Necesitas expresar tu creatividad para sentirte realizado?" },
        { id: "venus-casa5-3", texto: "¿Disfrutas siendo el centro de atención en ambientes sociales?" },
        { id: "venus-casa5-4", texto: "¿Los hijos o los proyectos creativos ocupan un lugar importante en tu vida?" },
        { id: "venus-casa5-5", texto: "¿Te cuesta resistirte a relaciones intensas o apasionadas?" },
      ],
      6: [
        { id: "venus-casa6-1", texto: "¿Demuestras cariño ayudando de forma práctica a otras personas?" },
        { id: "venus-casa6-2", texto: "¿Necesitas sentir armonía en tu trabajo para estar bien?" },
        { id: "venus-casa6-3", texto: "¿Te cuesta recibir amor o cuidados de otras personas?" },
        { id: "venus-casa6-4", texto: "¿Tiendes a cuidar mucho de quienes quieres?" },
        { id: "venus-casa6-5", texto: "¿Las tensiones emocionales terminan afectando a tu salud?" },
      ],
      7: [
        { id: "venus-casa7-1", texto: "¿Sientes que las relaciones de pareja son fundamentales para tu felicidad?" },
        { id: "venus-casa7-2", texto: "¿Tiendes a idealizar a la persona de la que te enamoras?" },
        { id: "venus-casa7-3", texto: "¿Te decepcionas cuando una relación no cumple tus expectativas?" },
        { id: "venus-casa7-4", texto: "¿Te cuesta imaginar tu vida sin una relación importante?" },
        { id: "venus-casa7-5", texto: "¿Sientes que te conoces mejor a través de la pareja?" },
      ],
      8: [
        { id: "venus-casa8-1", texto: "¿Te atraen especialmente las relaciones intensas o emocionalmente profundas?" },
        { id: "venus-casa8-2", texto: "¿Te resulta difícil enamorarte de personas completamente disponibles?" },
        { id: "venus-casa8-3", texto: "¿Sientes una fuerte atracción por lo misterioso o lo oculto?" },
        { id: "venus-casa8-4", texto: "¿El amor te ha llevado a transformaciones profundas?" },
        { id: "venus-casa8-5", texto: "¿Con el tiempo has aprendido a depender menos emocionalmente de otras personas?" },
      ],
      9: [
        { id: "venus-casa9-1", texto: "¿Los viajes o conocer otras culturas enriquecen tu forma de amar?" },
        { id: "venus-casa9-2", texto: "¿Te atraen personas con una visión del mundo diferente a la tuya?" },
        { id: "venus-casa9-3", texto: "¿Buscas una relación que te ayude a crecer como persona?" },
        { id: "venus-casa9-4", texto: "¿Te interesa compartir creencias o filosofía con tu pareja?" },
        { id: "venus-casa9-5", texto: "¿Disfrutas enseñando o inspirando a otras personas?" },
      ],
      10: [
        { id: "venus-casa10-1", texto: "¿Te atraen personas con influencia, prestigio o autoridad?" },
        { id: "venus-casa10-2", texto: "¿Buscas reconocimiento por tu creatividad o tus talentos?" },
        { id: "venus-casa10-3", texto: "¿Te motiva desarrollar una profesión que disfrutes de verdad?" },
        { id: "venus-casa10-4", texto: "¿Sientes que tu imagen pública es importante para ti?" },
        { id: "venus-casa10-5", texto: "¿Te resulta importante que tu pareja admire lo que haces?" },
      ],
      11: [
        { id: "venus-casa11-1", texto: "¿Necesitas que tu pareja sea también una buena amistad?" },
        { id: "venus-casa11-2", texto: "¿Las amistades ocupan un lugar muy importante en tu vida?" },
        { id: "venus-casa11-3", texto: "¿Te afecta mucho sentirte aceptado por tu grupo?" },
        { id: "venus-casa11-4", texto: "¿Disfrutas participando en actividades sociales o culturales?" },
        { id: "venus-casa11-5", texto: "¿Te cuesta cerrar relaciones y mantener distancia con antiguas parejas?" },
      ],
      12: [
        { id: "venus-casa12-1", texto: "¿Tiendes a enamorarte de personas emocionalmente inaccesibles?" },
        { id: "venus-casa12-2", texto: "¿Necesitas momentos de soledad para conectar con lo que sientes?" },
        { id: "venus-casa12-3", texto: "¿Sientes una fuerte compasión hacia personas que sufren?" },
        { id: "venus-casa12-4", texto: "¿Te cuesta explicar exactamente por qué amas a alguien?" },
        { id: "venus-casa12-5", texto: "¿Idealizas el amor hasta el punto de que la realidad a veces te decepciona?" },
      ],
    },
  },

  /* ───────────────────────────── MARTE ────────────────────────────── */
  marte: {
    signos: {
      Aries: [
        { id: "marte-aries-1", texto: "¿Sueles actuar antes de pensar demasiado las consecuencias?" },
        { id: "marte-aries-2", texto: "¿Te cuesta seguir los consejos de otras personas?" },
        { id: "marte-aries-3", texto: "¿La rutina hace que pierdas rápidamente la motivación?" },
        { id: "marte-aries-4", texto: "¿Cuando te enfadas, lo expresas de forma intensa pero se te pasa rápido?" },
        { id: "marte-aries-5", texto: "¿Necesitas nuevos retos constantemente para mantenerte motivado?" },
      ],
      Tauro: [
        { id: "marte-tauro-1", texto: "¿Cuando empiezas un proyecto, rara vez lo dejas a medias?" },
        { id: "marte-tauro-2", texto: "¿Te cuesta cambiar de opinión una vez has tomado una decisión?" },
        { id: "marte-tauro-3", texto: "¿Solo reaccionas con fuerza cuando sientes que invaden tu espacio o lo que consideras tuyo?" },
        { id: "marte-tauro-4", texto: "¿Te cuesta olvidar una ofensa importante?" },
        { id: "marte-tauro-5", texto: "¿Prefieres avanzar despacio pero con seguridad antes que actuar impulsivamente?" },
      ],
      "Géminis": [
        { id: "marte-geminis-1", texto: "¿Necesitas estímulos mentales constantes para mantenerte motivado?" },
        { id: "marte-geminis-2", texto: "¿Te cuesta concentrarte en un solo proyecto durante mucho tiempo?" },
        { id: "marte-geminis-3", texto: "¿Disfrutas debatiendo o argumentando tus ideas?" },
        { id: "marte-geminis-4", texto: "¿Sueles hacer varias cosas al mismo tiempo?" },
        { id: "marte-geminis-5", texto: "¿Cuando te enfadas, utilizas más las palabras que la confrontación física?" },
      ],
      "Cáncer": [
        { id: "marte-cancer-1", texto: "¿Tiendes a guardar el enfado en lugar de expresarlo directamente?" },
        { id: "marte-cancer-2", texto: "¿Los conflictos familiares te afectan especialmente?" },
        { id: "marte-cancer-3", texto: "¿Cuando quieres algo, insistes una y otra vez hasta conseguirlo?" },
        { id: "marte-cancer-4", texto: "¿Proteges con intensidad a las personas que consideras tuyas?" },
        { id: "marte-cancer-5", texto: "¿Te cuesta expresar el enfado de forma directa?" },
      ],
      Leo: [
        { id: "marte-leo-1", texto: "¿Necesitas sentir que lideras o tomas la iniciativa?" },
        { id: "marte-leo-2", texto: "¿Te motivan los retos donde puedes demostrar de lo que eres capaz?" },
        { id: "marte-leo-3", texto: "¿Te frustras cuando sientes que no se reconoce tu esfuerzo?" },
        { id: "marte-leo-4", texto: "¿Te resulta natural animar o motivar a otras personas?" },
        { id: "marte-leo-5", texto: "¿Cuando deseas algo, vas a por ello con decisión?" },
      ],
      Virgo: [
        { id: "marte-virgo-1", texto: "¿Prefieres hacer las cosas correctamente antes que hacerlas rápido?" },
        { id: "marte-virgo-2", texto: "¿Te desespera ver que alguien trabaja de forma poco eficiente?" },
        { id: "marte-virgo-3", texto: "¿Te cuesta delegar porque piensas que tú lo harás mejor?" },
        { id: "marte-virgo-4", texto: "¿Sueles trabajar más de la cuenta antes que dejar una tarea a medias?" },
        { id: "marte-virgo-5", texto: "¿Te resulta difícil descansar cuando todavía quedan cosas por hacer?" },
      ],
      Libra: [
        { id: "marte-libra-1", texto: "¿Antes de actuar sueles valorar cómo afectará a los demás?" },
        { id: "marte-libra-2", texto: "¿Te cuesta diferenciar entre lo que tú quieres y lo que esperan de ti?" },
        { id: "marte-libra-3", texto: "¿Prefieres convencer antes que imponer?" },
        { id: "marte-libra-4", texto: "¿Evitas actuar impulsivamente cuando hay conflicto?" },
        { id: "marte-libra-5", texto: "¿Necesitas sentir que una decisión es justa antes de llevarla a cabo?" },
      ],
      Escorpio: [
        { id: "marte-escorpio-1", texto: "¿Prefieres esperar el momento adecuado antes que actuar impulsivamente?" },
        { id: "marte-escorpio-2", texto: "¿Cuando persigues un objetivo, rara vez abandonas hasta conseguirlo?" },
        { id: "marte-escorpio-3", texto: "¿Sueles percibir los puntos débiles o las motivaciones ocultas de otras personas?" },
        { id: "marte-escorpio-4", texto: "¿Te cuesta mostrar todas tus intenciones antes de actuar?" },
        { id: "marte-escorpio-5", texto: "¿Prefieres transformar un problema de raíz en lugar de poner soluciones temporales?" },
      ],
      Sagitario: [
        { id: "marte-sagitario-1", texto: "¿Necesitas sentir libertad para mantener la motivación?" },
        { id: "marte-sagitario-2", texto: "¿La aventura o los nuevos retos te llenan de energía?" },
        { id: "marte-sagitario-3", texto: "¿Te lanzas a nuevas experiencias aunque no tengas toda la información?" },
        { id: "marte-sagitario-4", texto: "¿Te cuesta permanecer mucho tiempo en situaciones rutinarias?" },
        { id: "marte-sagitario-5", texto: "¿El ejercicio al aire libre te motiva más que entrenar en espacios cerrados?" },
      ],
      Capricornio: [
        { id: "marte-capricornio-1", texto: "¿Planificas cuidadosamente antes de actuar?" },
        { id: "marte-capricornio-2", texto: "¿Eres capaz de mantener el esfuerzo durante mucho tiempo para alcanzar una meta?" },
        { id: "marte-capricornio-3", texto: "¿Te motivan especialmente los objetivos ambiciosos?" },
        { id: "marte-capricornio-4", texto: "¿Prefieres avanzar poco a poco antes que buscar resultados rápidos?" },
        { id: "marte-capricornio-5", texto: "¿Te cuesta abandonar un objetivo una vez te has comprometido con él?" },
      ],
      Acuario: [
        { id: "marte-acuario-1", texto: "¿Te motiva luchar por ideas o causas en las que crees?" },
        { id: "marte-acuario-2", texto: "¿Te cuesta aceptar normas que no tienen sentido para ti?" },
        { id: "marte-acuario-3", texto: "¿Prefieres hacer las cosas de una forma diferente a la habitual?" },
        { id: "marte-acuario-4", texto: "¿Necesitas independencia para desarrollar tus proyectos?" },
        { id: "marte-acuario-5", texto: "¿Te resulta más fácil implicarte en un proyecto colectivo que seguir órdenes sin cuestionarlas?" },
      ],
      Piscis: [
        { id: "marte-piscis-1", texto: "¿Te cuesta enfrentarte directamente a los conflictos?" },
        { id: "marte-piscis-2", texto: "¿Antes de actuar piensas mucho en cómo afectará a los demás?" },
        { id: "marte-piscis-3", texto: "¿Necesitas momentos de soledad para recuperar energía?" },
        { id: "marte-piscis-4", texto: "¿Te resulta difícil reconocer lo que realmente deseas?" },
        { id: "marte-piscis-5", texto: "¿Tiendes a reprimir el enfado en lugar de expresarlo?" },
      ],
    },
    casas: {
      1: [
        { id: "marte-casa1-1", texto: "¿Necesitas sentir que llevas las riendas de tu propia vida?" },
        { id: "marte-casa1-2", texto: "¿Te cuesta aceptar que otras personas interfieran en tus decisiones?" },
        { id: "marte-casa1-3", texto: "¿Cuando quieres algo, sueles actuar rápidamente para conseguirlo?" },
        { id: "marte-casa1-4", texto: "¿Tus enfados suelen ser intensos pero de corta duración?" },
        { id: "marte-casa1-5", texto: "¿Necesitas nuevos retos para sentirte motivado?" },
      ],
      2: [
        { id: "marte-casa2-1", texto: "¿La estabilidad económica influye mucho en tu sensación de poder personal?" },
        { id: "marte-casa2-2", texto: "¿Te cuesta controlar los gastos cuando deseas algo?" },
        { id: "marte-casa2-3", texto: "¿Sueles luchar con fuerza por proteger lo que consideras tuyo?" },
        { id: "marte-casa2-4", texto: "¿Cuando pierdes recursos importantes, sientes que puedes empezar de nuevo?" },
        { id: "marte-casa2-5", texto: "¿Los problemas económicos despiertan mucho enfado o frustración en ti?" },
      ],
      3: [
        { id: "marte-casa3-1", texto: "¿Cuando discutes, utilizas las palabras como principal herramienta?" },
        { id: "marte-casa3-2", texto: "¿Necesitas expresar lo que piensas para liberar tensión?" },
        { id: "marte-casa3-3", texto: "¿Disfrutas debatiendo incluso cuando no buscas convencer a la otra persona?" },
        { id: "marte-casa3-4", texto: "¿Te cuesta guardar silencio cuando no estás de acuerdo con algo?" },
        { id: "marte-casa3-5", texto: "¿Necesitas movimiento constante para sentirte bien?" },
      ],
      4: [
        { id: "marte-casa4-1", texto: "¿Los conflictos familiares han influido mucho en tu forma de ser?" },
        { id: "marte-casa4-2", texto: "¿Necesitabas independizarte de tu familia para sentirte libre?" },
        { id: "marte-casa4-3", texto: "¿Te cuesta expresar el enfado dentro del entorno familiar?" },
        { id: "marte-casa4-4", texto: "¿Sientes que todavía estás rompiendo patrones heredados de tu familia?" },
        { id: "marte-casa4-5", texto: "¿La vida en el hogar puede convertirse fácilmente en una fuente de tensión para ti?" },
      ],
      5: [
        { id: "marte-casa5-1", texto: "¿Necesitas expresar tu creatividad para sentirte vivo?" },
        { id: "marte-casa5-2", texto: "¿Te atraen especialmente los retos, los deportes o la competición?" },
        { id: "marte-casa5-3", texto: "¿Vives el amor con mucha intensidad y pasión?" },
        { id: "marte-casa5-4", texto: "¿Te cuesta resistirte a actuar impulsivamente cuando te ilusiona algo?" },
        { id: "marte-casa5-5", texto: "¿Buscas demostrar de lo que eres capaz mediante tus logros?" },
      ],
      6: [
        { id: "marte-casa6-1", texto: "¿Necesitas mantenerte ocupado para sentirte bien?" },
        { id: "marte-casa6-2", texto: "¿Te cuesta recibir órdenes de otras personas?" },
        { id: "marte-casa6-3", texto: "¿Tiendes a exigirte mucho en el trabajo?" },
        { id: "marte-casa6-4", texto: "¿El estrés termina afectando a tu cuerpo o a tu salud?" },
        { id: "marte-casa6-5", texto: "¿Disfrutas resolviendo problemas prácticos o mejorando procesos?" },
      ],
      7: [
        { id: "marte-casa7-1", texto: "¿Las relaciones de pareja despiertan tu lado más competitivo o impulsivo?" },
        { id: "marte-casa7-2", texto: "¿Te cuesta ceder cuando aparece un conflicto en la pareja?" },
        { id: "marte-casa7-3", texto: "¿Necesitas sentir que tu pareja reconoce tu esfuerzo?" },
        { id: "marte-casa7-4", texto: "¿Sientes que las personas importantes desafían constantemente tus límites?" },
        { id: "marte-casa7-5", texto: "¿Tiendes a expresar tu enfado con más facilidad hacia las personas que más quieres?" },
      ],
      8: [
        { id: "marte-casa8-1", texto: "¿Las crisis importantes sacan lo mejor o lo peor de ti?" },
        { id: "marte-casa8-2", texto: "¿Te atraen los temas relacionados con la psicología o la transformación?" },
        { id: "marte-casa8-3", texto: "¿Te cuesta confiar plenamente en otras personas?" },
        { id: "marte-casa8-4", texto: "¿Sientes que necesitas cortar de raíz aquello que ya no funciona?" },
        { id: "marte-casa8-5", texto: "¿Vives la sexualidad con mucha intensidad?" },
      ],
      9: [
        { id: "marte-casa9-1", texto: "¿Necesitas comprobar las cosas por ti mismo antes de creerlas?" },
        { id: "marte-casa9-2", texto: "¿Los viajes o las nuevas experiencias despiertan tu energía?" },
        { id: "marte-casa9-3", texto: "¿Te apasiona aprender sobre filosofía, espiritualidad o culturas diferentes?" },
        { id: "marte-casa9-4", texto: "¿Te cuesta aceptar creencias impuestas?" },
        { id: "marte-casa9-5", texto: "¿Sientes que necesitas ampliar constantemente tu visión del mundo?" },
      ],
      10: [
        { id: "marte-casa10-1", texto: "¿El éxito profesional ocupa un lugar muy importante en tu vida?" },
        { id: "marte-casa10-2", texto: "¿Te resulta natural asumir el liderazgo cuando hace falta?" },
        { id: "marte-casa10-3", texto: "¿Necesitas sentir que progresas constantemente en tu carrera?" },
        { id: "marte-casa10-4", texto: "¿Te cuesta aceptar figuras de autoridad cuando no las respetas?" },
        { id: "marte-casa10-5", texto: "¿Buscas dejar una huella importante mediante tu trabajo?" },
      ],
      11: [
        { id: "marte-casa11-1", texto: "¿Te gusta liderar proyectos en grupo?" },
        { id: "marte-casa11-2", texto: "¿Necesitas sentir que influyes en las personas que te rodean?" },
        { id: "marte-casa11-3", texto: "¿Te frustras cuando un grupo no avanza al ritmo que esperas?" },
        { id: "marte-casa11-4", texto: "¿Te motiva luchar por causas o ideales colectivos?" },
        { id: "marte-casa11-5", texto: "¿Te cuesta colaborar cuando no compartes el objetivo del grupo?" },
      ],
      12: [
        { id: "marte-casa12-1", texto: "¿Te cuesta expresar directamente el enfado?" },
        { id: "marte-casa12-2", texto: "¿Sientes que acumulas mucha tensión antes de reaccionar?" },
        { id: "marte-casa12-3", texto: "¿Necesitas momentos de soledad para liberar el estrés?" },
        { id: "marte-casa12-4", texto: "¿Tiendes a dirigir el enfado hacia ti mismo en lugar de expresarlo?" },
        { id: "marte-casa12-5", texto: "¿La actividad física te ayuda mucho a recuperar el equilibrio?" },
      ],
    },
  },

  /* ──────────────────────────── JÚPITER ───────────────────────────── */
  jupiter: {
    signos: {
      Aries: [
        { id: "jupiter-aries-1", texto: "¿Confías en que eres capaz de abrir tu propio camino?" },
        { id: "jupiter-aries-2", texto: "¿Te cuesta que otras personas te digan cómo debes actuar?" },
        { id: "jupiter-aries-3", texto: "¿Sueles lanzarte a nuevos proyectos con entusiasmo?" },
        { id: "jupiter-aries-4", texto: "¿Aprendes con facilidad de tus propios errores?" },
        { id: "jupiter-aries-5", texto: "¿Te cuesta decir «no» cuando aparecen nuevas oportunidades?" },
      ],
      Tauro: [
        { id: "jupiter-tauro-1", texto: "¿Sientes que la estabilidad económica te permite crecer como persona?" },
        { id: "jupiter-tauro-2", texto: "¿Disfrutas especialmente de los placeres sencillos de la vida?" },
        { id: "jupiter-tauro-3", texto: "¿Prefieres construir tu éxito poco a poco antes que buscar resultados rápidos?" },
        { id: "jupiter-tauro-4", texto: "¿Crees que la generosidad suele traer buenos resultados?" },
        { id: "jupiter-tauro-5", texto: "¿Te cuesta evitar los excesos cuando algo te gusta mucho?" },
      ],
      "Géminis": [
        { id: "jupiter-geminis-1", texto: "¿Disfrutas aprendiendo de las personas que te rodean?" },
        { id: "jupiter-geminis-2", texto: "¿Te resulta fácil comunicarte con personas de distintos entornos?" },
        { id: "jupiter-geminis-3", texto: "¿Sientes curiosidad por aprender idiomas o conocer otras culturas?" },
        { id: "jupiter-geminis-4", texto: "¿Prefieres descubrir el mundo poco a poco antes que buscar grandes aventuras?" },
        { id: "jupiter-geminis-5", texto: "¿Necesitas intercambiar ideas para seguir creciendo?" },
      ],
      "Cáncer": [
        { id: "jupiter-cancer-1", texto: "¿Sientes que tu familia o tus raíces dan sentido a tu vida?" },
        { id: "jupiter-cancer-2", texto: "¿Disfrutas acogiendo y cuidando de otras personas en tu hogar?" },
        { id: "jupiter-cancer-3", texto: "¿Necesitas seguridad emocional para desarrollarte plenamente?" },
        { id: "jupiter-cancer-4", texto: "¿Te resulta natural crear ambientes donde los demás se sienten cómodos?" },
        { id: "jupiter-cancer-5", texto: "¿Las relaciones familiares han marcado profundamente tu forma de entender la vida?" },
      ],
      Leo: [
        { id: "jupiter-leo-1", texto: "¿Te resulta natural inspirar o animar a otras personas?" },
        { id: "jupiter-leo-2", texto: "¿Sientes que tienes algo importante que aportar al mundo?" },
        { id: "jupiter-leo-3", texto: "¿Disfrutas viviendo con intensidad las experiencias positivas?" },
        { id: "jupiter-leo-4", texto: "¿Te motiva alcanzar metas que otras personas consideren importantes?" },
        { id: "jupiter-leo-5", texto: "¿Te gusta compartir con generosidad lo que tienes?" },
      ],
      Virgo: [
        { id: "jupiter-virgo-1", texto: "¿Sientes que tu crecimiento depende del trabajo bien hecho?" },
        { id: "jupiter-virgo-2", texto: "¿Tiendes a exigirte mucho para mejorar constantemente?" },
        { id: "jupiter-virgo-3", texto: "¿Te cuesta delegar responsabilidades?" },
        { id: "jupiter-virgo-4", texto: "¿Aplicas tus valores en tu trabajo o profesión?" },
        { id: "jupiter-virgo-5", texto: "¿Obtienes satisfacción ayudando de forma práctica a los demás?" },
      ],
      Libra: [
        { id: "jupiter-libra-1", texto: "¿Sientes que creces a través de tus relaciones de pareja o de colaboración?" },
        { id: "jupiter-libra-2", texto: "¿Te resulta natural aconsejar a otras personas?" },
        { id: "jupiter-libra-3", texto: "¿Buscas actuar siempre con justicia?" },
        { id: "jupiter-libra-4", texto: "¿Necesitas compartir tu vida con alguien para sentirte plenamente realizado?" },
        { id: "jupiter-libra-5", texto: "¿Te cuesta decir que no por intentar agradar a todo el mundo?" },
      ],
      Escorpio: [
        { id: "jupiter-escorpio-1", texto: "¿Las crisis importantes han dado más sentido a tu vida?" },
        { id: "jupiter-escorpio-2", texto: "¿Te interesan los temas relacionados con la psicología, el misterio o la transformación?" },
        { id: "jupiter-escorpio-3", texto: "¿Sueles detectar con facilidad lo que no funciona en una persona o situación?" },
        { id: "jupiter-escorpio-4", texto: "¿Crees que el crecimiento personal pasa por enfrentarse a la propia oscuridad?" },
        { id: "jupiter-escorpio-5", texto: "¿Te resulta natural acompañar a otras personas en momentos difíciles?" },
      ],
      Sagitario: [
        { id: "jupiter-sagitario-1", texto: "¿Necesitas encontrar un propósito profundo en lo que haces?" },
        { id: "jupiter-sagitario-2", texto: "¿Te interesan especialmente la filosofía, la espiritualidad o las grandes preguntas de la vida?" },
        { id: "jupiter-sagitario-3", texto: "¿Crees que todo lo que ocurre tiene un sentido?" },
        { id: "jupiter-sagitario-4", texto: "¿Los viajes o conocer otras culturas amplían tu forma de ver el mundo?" },
        { id: "jupiter-sagitario-5", texto: "¿La libertad es imprescindible para tu crecimiento personal?" },
      ],
      Capricornio: [
        { id: "jupiter-capricornio-1", texto: "¿Sientes que alcanzar metas importantes da sentido a tu vida?" },
        { id: "jupiter-capricornio-2", texto: "¿Te resulta natural asumir responsabilidades?" },
        { id: "jupiter-capricornio-3", texto: "¿Buscas construir una posición sólida en la sociedad?" },
        { id: "jupiter-capricornio-4", texto: "¿Valoras especialmente el esfuerzo y la disciplina?" },
        { id: "jupiter-capricornio-5", texto: "¿Prefieres el reconocimiento ganado con trabajo antes que la suerte?" },
      ],
      Acuario: [
        { id: "jupiter-acuario-1", texto: "¿Crees que el progreso de la sociedad es más importante que el beneficio individual?" },
        { id: "jupiter-acuario-2", texto: "¿Te atraen las ideas innovadoras o poco convencionales?" },
        { id: "jupiter-acuario-3", texto: "¿Sientes la necesidad de contribuir a mejorar el mundo?" },
        { id: "jupiter-acuario-4", texto: "¿Te cuesta aceptar normas que consideras obsoletas?" },
        { id: "jupiter-acuario-5", texto: "¿Tiendes a pensar más en el futuro que en el presente?" },
      ],
      Piscis: [
        { id: "jupiter-piscis-1", texto: "¿Necesitas sentir una conexión espiritual para encontrar sentido a la vida?" },
        { id: "jupiter-piscis-2", texto: "¿Tu intuición influye mucho en tus decisiones importantes?" },
        { id: "jupiter-piscis-3", texto: "¿Sientes una profunda compasión por quienes sufren?" },
        { id: "jupiter-piscis-4", texto: "¿Necesitas momentos de soledad o retiro para recuperar el equilibrio?" },
        { id: "jupiter-piscis-5", texto: "¿Buscas encontrar la magia o el significado oculto en la vida cotidiana?" },
      ],
    },
    casas: {
      1: [
        { id: "jupiter-casa1-1", texto: "¿Sueles afrontar la vida con optimismo?" },
        { id: "jupiter-casa1-2", texto: "¿Sientes que tu vida tiene un propósito importante?" },
        { id: "jupiter-casa1-3", texto: "¿Te resulta natural animar o inspirar a otras personas?" },
        { id: "jupiter-casa1-4", texto: "¿Necesitas sentir que estás creciendo constantemente como persona?" },
        { id: "jupiter-casa1-5", texto: "¿Te cuesta terminar lo que empiezas cuando pierde el entusiasmo?" },
      ],
      2: [
        { id: "jupiter-casa2-1", texto: "¿Se te da bien aprovechar los recursos que tienes?" },
        { id: "jupiter-casa2-2", texto: "¿La estabilidad económica aumenta tu sensación de bienestar?" },
        { id: "jupiter-casa2-3", texto: "¿Disfrutas compartiendo lo que tienes con otras personas?" },
        { id: "jupiter-casa2-4", texto: "¿Te cuesta controlar los gastos cuando algo te ilusiona?" },
        { id: "jupiter-casa2-5", texto: "¿Te resulta importante que el dinero tenga un propósito y no sea un fin en sí mismo?" },
      ],
      3: [
        { id: "jupiter-casa3-1", texto: "¿Necesitas aprender continuamente cosas nuevas?" },
        { id: "jupiter-casa3-2", texto: "¿Disfrutas compartiendo lo que sabes con otras personas?" },
        { id: "jupiter-casa3-3", texto: "¿Sueles generar muchas ideas nuevas?" },
        { id: "jupiter-casa3-4", texto: "¿Te cuesta resumir lo que quieres decir porque das demasiadas explicaciones?" },
        { id: "jupiter-casa3-5", texto: "¿Te interesa aprender idiomas o comunicarte con personas de otros entornos?" },
      ],
      4: [
        { id: "jupiter-casa4-1", texto: "¿Necesitas sentir que tu hogar es un lugar donde puedes crecer?" },
        { id: "jupiter-casa4-2", texto: "¿La familia ha influido positivamente en tu forma de entender la vida?" },
        { id: "jupiter-casa4-3", texto: "¿Te interesa crear un hogar amplio, acogedor o rodeado de naturaleza?" },
        { id: "jupiter-casa4-4", texto: "¿Sientes una fuerte conexión con tus raíces o antepasados?" },
        { id: "jupiter-casa4-5", texto: "¿Buscas más crecimiento personal que reconocimiento social?" },
      ],
      5: [
        { id: "jupiter-casa5-1", texto: "¿Necesitas expresar tu creatividad para sentirte pleno?" },
        { id: "jupiter-casa5-2", texto: "¿Disfrutas asumiendo nuevos retos o desafíos?" },
        { id: "jupiter-casa5-3", texto: "¿Te gusta hacer las cosas a lo grande?" },
        { id: "jupiter-casa5-4", texto: "¿Te cuesta mantener el interés en un hobby hasta dominarlo?" },
        { id: "jupiter-casa5-5", texto: "¿El amor y el romance ocupan un lugar importante en tu búsqueda de felicidad?" },
      ],
      6: [
        { id: "jupiter-casa6-1", texto: "¿Buscas encontrar un propósito en tu trabajo?" },
        { id: "jupiter-casa6-2", texto: "¿Disfrutas ayudando o siendo útil a otras personas?" },
        { id: "jupiter-casa6-3", texto: "¿Te cuesta encontrar equilibrio entre el trabajo y el descanso?" },
        { id: "jupiter-casa6-4", texto: "¿Tiendes a exigirte mucho en tu trabajo o en el cuidado de tu salud?" },
        { id: "jupiter-casa6-5", texto: "¿Cuidar de animales o de otras personas te resulta especialmente gratificante?" },
      ],
      7: [
        { id: "jupiter-casa7-1", texto: "¿Sueles creer que una relación puede ayudarte a crecer como persona?" },
        { id: "jupiter-casa7-2", texto: "¿Tiendes a idealizar las relaciones de pareja?" },
        { id: "jupiter-casa7-3", texto: "¿Aunque una relación termine, sigues creyendo en el amor?" },
        { id: "jupiter-casa7-4", texto: "¿Las asociaciones o colaboraciones suelen abrirte oportunidades importantes?" },
        { id: "jupiter-casa7-5", texto: "¿Necesitas sentir libertad dentro de una relación?" },
      ],
      8: [
        { id: "jupiter-casa8-1", texto: "¿Las crisis importantes te han ayudado a crecer como persona?" },
        { id: "jupiter-casa8-2", texto: "¿Te interesa comprender la psicología o los procesos de transformación?" },
        { id: "jupiter-casa8-3", texto: "¿Sueles mantener la esperanza incluso en momentos difíciles?" },
        { id: "jupiter-casa8-4", texto: "¿Te resulta fácil confiar en que las dificultades tienen un sentido?" },
        { id: "jupiter-casa8-5", texto: "¿Te interesa explorar los aspectos más profundos o misteriosos de la vida?" },
      ],
      9: [
        { id: "jupiter-casa9-1", texto: "¿Necesitas encontrar un sentido profundo a todo lo que vives?" },
        { id: "jupiter-casa9-2", texto: "¿Los viajes o los estudios han cambiado tu forma de entender la vida?" },
        { id: "jupiter-casa9-3", texto: "¿Te interesan especialmente la filosofía, la espiritualidad o la religión?" },
        { id: "jupiter-casa9-4", texto: "¿Disfrutas compartiendo tu visión del mundo con otras personas?" },
        { id: "jupiter-casa9-5", texto: "¿Intentas aplicar tus ideas a la vida cotidiana y no quedarte solo en la teoría?" },
      ],
      10: [
        { id: "jupiter-casa10-1", texto: "¿Buscas realizarte a través de tu profesión o vocación?" },
        { id: "jupiter-casa10-2", texto: "¿Te motiva asumir puestos de responsabilidad o liderazgo?" },
        { id: "jupiter-casa10-3", texto: "¿Necesitas sentir que tu trabajo tiene un impacto importante?" },
        { id: "jupiter-casa10-4", texto: "¿El reconocimiento profesional es importante para ti?" },
        { id: "jupiter-casa10-5", texto: "¿Las oportunidades laborales suelen aparecer cuando confías en ti mismo?" },
      ],
      11: [
        { id: "jupiter-casa11-1", texto: "¿Sientes que creces gracias a tus amistades o a los grupos de los que formas parte?" },
        { id: "jupiter-casa11-2", texto: "¿Te motivan los proyectos colectivos o con impacto social?" },
        { id: "jupiter-casa11-3", texto: "¿Disfrutas ayudando a otras personas a alcanzar sus objetivos?" },
        { id: "jupiter-casa11-4", texto: "¿Te ilusiona imaginar proyectos de futuro?" },
        { id: "jupiter-casa11-5", texto: "¿Te cuesta terminar proyectos porque empiezas otros nuevos con entusiasmo?" },
      ],
      12: [
        { id: "jupiter-casa12-1", texto: "¿Sientes que la soledad o la introspección te ayudan a crecer?" },
        { id: "jupiter-casa12-2", texto: "¿Confías en que incluso las dificultades tienen un propósito?" },
        { id: "jupiter-casa12-3", texto: "¿Tu intuición influye mucho en tus decisiones importantes?" },
        { id: "jupiter-casa12-4", texto: "¿Te resulta natural ayudar a personas que están pasando por momentos difíciles?" },
        { id: "jupiter-casa12-5", texto: "¿Sientes que conectar con tu mundo interior da sentido a tu vida?" },
      ],
    },
  },

  /* ──────────────────────────── SATURNO ───────────────────────────── */
  saturno: {
    signos: {
      Aries: [
        { id: "saturno-aries-1", texto: "¿Desde joven has sentido que debías valerte por ti mismo?" },
        { id: "saturno-aries-2", texto: "¿Te cuesta aceptar que otras personas dirijan tus decisiones?" },
        { id: "saturno-aries-3", texto: "¿Sientes que antes de actuar piensas demasiado por miedo a equivocarte?" },
        { id: "saturno-aries-4", texto: "¿Necesitas demostrar constantemente que eres capaz?" },
        { id: "saturno-aries-5", texto: "¿Te resulta difícil pedir ayuda cuando la necesitas?" },
      ],
      Tauro: [
        { id: "saturno-tauro-1", texto: "¿El miedo a perder estabilidad influye mucho en tus decisiones?" },
        { id: "saturno-tauro-2", texto: "¿Te cuesta asumir riesgos aunque veas oportunidades?" },
        { id: "saturno-tauro-3", texto: "¿Necesitas sentir que tienes recursos suficientes antes de relajarte?" },
        { id: "saturno-tauro-4", texto: "¿Te cuesta disfrutar plenamente sin pensar en las consecuencias?" },
        { id: "saturno-tauro-5", texto: "¿Te resulta difícil soltar aquello que te da seguridad?" },
      ],
      "Géminis": [
        { id: "saturno-geminis-1", texto: "¿Sientes que necesitas dominar un tema antes de sentirte seguro hablando de él?" },
        { id: "saturno-geminis-2", texto: "¿Tiendes a pensar demasiado antes de expresar tus ideas?" },
        { id: "saturno-geminis-3", texto: "¿Te exiges mucho intelectualmente?" },
        { id: "saturno-geminis-4", texto: "¿Te cuesta mostrar tus emociones porque prefieres analizarlas?" },
        { id: "saturno-geminis-5", texto: "¿El conocimiento te hace sentir más seguro que las relaciones?" },
      ],
      "Cáncer": [
        { id: "saturno-cancer-1", texto: "¿Te cuesta mostrar tu vulnerabilidad a otras personas?" },
        { id: "saturno-cancer-2", texto: "¿Has sentido que debías hacerte cargo emocionalmente de tu familia?" },
        { id: "saturno-cancer-3", texto: "¿Te cuesta pedir apoyo cuando lo necesitas?" },
        { id: "saturno-cancer-4", texto: "¿Buscas construir tu propia seguridad emocional sin depender de los demás?" },
        { id: "saturno-cancer-5", texto: "¿El miedo al abandono ha influido en tus relaciones?" },
      ],
      Leo: [
        { id: "saturno-leo-1", texto: "¿Sientes que necesitas demostrar tu valor para sentirte reconocido?" },
        { id: "saturno-leo-2", texto: "¿Te cuesta expresar espontáneamente quién eres?" },
        { id: "saturno-leo-3", texto: "¿Las críticas afectan mucho a tu autoestima?" },
        { id: "saturno-leo-4", texto: "¿Sueles exigirte más que la mayoría para sentir que eres suficiente?" },
        { id: "saturno-leo-5", texto: "¿Te cuesta disfrutar sin sentir que debes hacer algo útil?" },
      ],
      Virgo: [
        { id: "saturno-virgo-1", texto: "¿Te cuesta aceptar que algo esté suficientemente bien sin ser perfecto?" },
        { id: "saturno-virgo-2", texto: "¿Tiendes a asumir más responsabilidades de las que te corresponden?" },
        { id: "saturno-virgo-3", texto: "¿El orden y la organización te hacen sentir seguro?" },
        { id: "saturno-virgo-4", texto: "¿La autocrítica suele ser más fuerte que el reconocimiento hacia ti mismo?" },
        { id: "saturno-virgo-5", texto: "¿Te cuesta relajarte cuando quedan tareas pendientes?" },
      ],
      Libra: [
        { id: "saturno-libra-1", texto: "¿Te cuesta comprometerte plenamente hasta confiar por completo en la otra persona?" },
        { id: "saturno-libra-2", texto: "¿Analizas mucho una relación antes de implicarte?" },
        { id: "saturno-libra-3", texto: "¿Te preocupan especialmente la justicia y la equidad en tus relaciones?" },
        { id: "saturno-libra-4", texto: "¿Sueles proyectar tus inseguridades sobre la pareja o los demás?" },
        { id: "saturno-libra-5", texto: "¿Te cuesta confiar rápidamente en las personas?" },
      ],
      Escorpio: [
        { id: "saturno-escorpio-1", texto: "¿Te cuesta confiar plenamente en otras personas?" },
        { id: "saturno-escorpio-2", texto: "¿Sientes que reprimes emociones muy intensas?" },
        { id: "saturno-escorpio-3", texto: "¿Las experiencias difíciles te han obligado a fortalecerte emocionalmente?" },
        { id: "saturno-escorpio-4", texto: "¿Prefieres mantener el control antes que mostrar vulnerabilidad?" },
        { id: "saturno-escorpio-5", texto: "¿Te resulta difícil soltar el resentimiento o las heridas del pasado?" },
      ],
      Sagitario: [
        { id: "saturno-sagitario-1", texto: "¿Tiendes a cuestionar mucho tus propias creencias antes de aceptarlas?" },
        { id: "saturno-sagitario-2", texto: "¿Te exiges demostrar que eres válido mediante tus logros o estudios?" },
        { id: "saturno-sagitario-3", texto: "¿Te cuesta flexibilizar tus opiniones cuando estás convencido de algo?" },
        { id: "saturno-sagitario-4", texto: "¿Sientes una fuerte necesidad de encontrar un sentido profundo a la vida?" },
        { id: "saturno-sagitario-5", texto: "¿Te resulta difícil actuar sin tener antes una explicación o filosofía clara?" },
      ],
      Capricornio: [
        { id: "saturno-capricornio-1", texto: "¿Sientes que debes alcanzar metas importantes para sentir que vales?" },
        { id: "saturno-capricornio-2", texto: "¿Te cuesta descansar sin sentir que estás perdiendo el tiempo?" },
        { id: "saturno-capricornio-3", texto: "¿Asumes responsabilidades incluso cuando nadie te las pide?" },
        { id: "saturno-capricornio-4", texto: "¿Tiendes a exigirte más que a los demás?" },
        { id: "saturno-capricornio-5", texto: "¿Te cuesta mostrar debilidad ante otras personas?" },
      ],
      Acuario: [
        { id: "saturno-acuario-1", texto: "¿Sientes responsabilidad por intentar mejorar la sociedad o tu entorno?" },
        { id: "saturno-acuario-2", texto: "¿Te cuesta sentirte completamente integrado en los grupos?" },
        { id: "saturno-acuario-3", texto: "¿Te resulta difícil cambiar de opinión una vez has construido una visión del mundo?" },
        { id: "saturno-acuario-4", texto: "¿Prefieres mantener cierta distancia emocional con los demás?" },
        { id: "saturno-acuario-5", texto: "¿Sientes que muchas veces cargas con problemas que realmente no te corresponden?" },
      ],
      Piscis: [
        { id: "saturno-piscis-1", texto: "¿Sueles sentir una sensación de soledad difícil de explicar?" },
        { id: "saturno-piscis-2", texto: "¿Te cuesta comprender el origen de algunos de tus miedos o inseguridades?" },
        { id: "saturno-piscis-3", texto: "¿Necesitas momentos de aislamiento para recuperar el equilibrio?" },
        { id: "saturno-piscis-4", texto: "¿Tiendes a cargar con el sufrimiento de otras personas?" },
        { id: "saturno-piscis-5", texto: "¿Te cuesta dejar atrás errores o situaciones del pasado?" },
      ],
    },
    casas: {
      1: [
        { id: "saturno-casa1-1", texto: "¿Sientes que tuviste que madurar demasiado pronto?" },
        { id: "saturno-casa1-2", texto: "¿Te exiges más que la mayoría de las personas?" },
        { id: "saturno-casa1-3", texto: "¿Te cuesta mostrarte tal y como eres por miedo al juicio?" },
        { id: "saturno-casa1-4", texto: "¿Sueles sentir que debes demostrar constantemente tu valía?" },
        { id: "saturno-casa1-5", texto: "¿Te resulta difícil relajarte y simplemente disfrutar?" },
      ],
      2: [
        { id: "saturno-casa2-1", texto: "¿El miedo a la escasez influye mucho en tus decisiones?" },
        { id: "saturno-casa2-2", texto: "¿Te cuesta sentir que vales independientemente del dinero o los logros?" },
        { id: "saturno-casa2-3", texto: "¿Prefieres renunciar a un sueño antes que sentir inseguridad económica?" },
        { id: "saturno-casa2-4", texto: "¿Te cuesta disfrutar de lo que tienes sin preocuparte por perderlo?" },
        { id: "saturno-casa2-5", texto: "¿Sientes que la estabilidad económica depende principalmente de tu esfuerzo?" },
      ],
      3: [
        { id: "saturno-casa3-1", texto: "¿Te cuesta expresar lo que realmente piensas por miedo a ser malinterpretado?" },
        { id: "saturno-casa3-2", texto: "¿Sientes que pocas personas te comprenden de verdad?" },
        { id: "saturno-casa3-3", texto: "¿Piensas mucho antes de hablar?" },
        { id: "saturno-casa3-4", texto: "¿Te exiges ser muy preciso cuando explicas algo?" },
        { id: "saturno-casa3-5", texto: "¿Has sentido alguna vez que dudabas de tu propia inteligencia?" },
      ],
      4: [
        { id: "saturno-casa4-1", texto: "¿Te cuesta sentir que tienes un lugar donde realmente perteneces?" },
        { id: "saturno-casa4-2", texto: "¿Sientes que todavía estás construyendo tu seguridad emocional?" },
        { id: "saturno-casa4-3", texto: "¿La familia ha sido una fuente importante de responsabilidad o preocupación?" },
        { id: "saturno-casa4-4", texto: "¿Te resulta difícil descansar emocionalmente?" },
        { id: "saturno-casa4-5", texto: "¿Sientes que todavía estás aprendiendo a cuidar de tu niño interior?" },
      ],
      5: [
        { id: "saturno-casa5-1", texto: "¿Te cuesta mostrar tu creatividad sin miedo al juicio?" },
        { id: "saturno-casa5-2", texto: "¿Te resulta difícil divertirte sin sentir culpa?" },
        { id: "saturno-casa5-3", texto: "¿Te cuesta expresar tus sentimientos cuando alguien te gusta?" },
        { id: "saturno-casa5-4", texto: "¿Sientes que escondes una parte importante de quién eres?" },
        { id: "saturno-casa5-5", texto: "¿Necesitas sentir que todo está muy bien hecho antes de mostrarlo?" },
      ],
      6: [
        { id: "saturno-casa6-1", texto: "¿Te cuesta descansar hasta terminar todas tus responsabilidades?" },
        { id: "saturno-casa6-2", texto: "¿Sientes que debes ser útil para sentirte valioso?" },
        { id: "saturno-casa6-3", texto: "¿Tiendes a exigirte demasiado en el trabajo?" },
        { id: "saturno-casa6-4", texto: "¿El estrés suele terminar afectando a tu cuerpo?" },
        { id: "saturno-casa6-5", texto: "¿Te cuesta aceptar que algo está suficientemente bien sin ser perfecto?" },
      ],
      7: [
        { id: "saturno-casa7-1", texto: "¿Te cuesta confiar plenamente en una pareja?" },
        { id: "saturno-casa7-2", texto: "¿Tiendes a fijarte antes en los defectos que en las virtudes de la otra persona?" },
        { id: "saturno-casa7-3", texto: "¿Te resulta difícil sentirte completamente seguro dentro de una relación?" },
        { id: "saturno-casa7-4", texto: "¿Necesitas mucho tiempo para confiar en alguien?" },
        { id: "saturno-casa7-5", texto: "¿Sientes que primero debes aprender a estar bien solo antes de construir una relación estable?" },
      ],
      8: [
        { id: "saturno-casa8-1", texto: "¿Te cuesta mostrar tus emociones más profundas?" },
        { id: "saturno-casa8-2", texto: "¿Sientes que necesitas mantener el control para sentirte seguro?" },
        { id: "saturno-casa8-3", texto: "¿Te resulta difícil confiar plenamente en otras personas?" },
        { id: "saturno-casa8-4", texto: "¿Te cuesta hablar de temas que te hacen vulnerable?" },
        { id: "saturno-casa8-5", texto: "¿Las crisis importantes han sido una fuente de aprendizaje en tu vida?" },
      ],
      9: [
        { id: "saturno-casa9-1", texto: "¿Te cuesta confiar en la vida cuando no puedes controlar el resultado?" },
        { id: "saturno-casa9-2", texto: "¿Sueles cuestionar profundamente tus propias creencias?" },
        { id: "saturno-casa9-3", texto: "¿Te resulta difícil actuar sin tener todas las respuestas?" },
        { id: "saturno-casa9-4", texto: "¿Te cuesta permitirte cambiar de opinión sobre temas importantes?" },
        { id: "saturno-casa9-5", texto: "¿Sientes que todavía estás construyendo tu propia filosofía de vida?" },
      ],
      10: [
        { id: "saturno-casa10-1", texto: "¿El miedo al fracaso influye mucho en tus decisiones profesionales?" },
        { id: "saturno-casa10-2", texto: "¿Sientes que necesitas demostrar constantemente tu capacidad?" },
        { id: "saturno-casa10-3", texto: "¿Te afectan especialmente las críticas sobre tu trabajo?" },
        { id: "saturno-casa10-4", texto: "¿Te cuesta sentir que tus logros son suficientes?" },
        { id: "saturno-casa10-5", texto: "¿Buscas construir algo que deje una huella duradera?" },
      ],
      11: [
        { id: "saturno-casa11-1", texto: "¿Te cuesta confiar plenamente en un grupo de personas?" },
        { id: "saturno-casa11-2", texto: "¿Necesitas mucho tiempo para considerar a alguien un verdadero amigo?" },
        { id: "saturno-casa11-3", texto: "¿Sientes que perteneces a los grupos, pero sin terminar de encajar del todo?" },
        { id: "saturno-casa11-4", texto: "¿Te cuesta pedir ayuda incluso a personas cercanas?" },
        { id: "saturno-casa11-5", texto: "¿Buscas mantener tu independencia incluso dentro de un grupo?" },
      ],
      12: [
        { id: "saturno-casa12-1", texto: "¿Te cuesta soltar el control cuando una situación es incierta?" },
        { id: "saturno-casa12-2", texto: "¿Sientes que hay miedos cuyo origen no consigues explicar?" },
        { id: "saturno-casa12-3", texto: "¿Necesitas momentos de soledad para recuperar el equilibrio?" },
        { id: "saturno-casa12-4", texto: "¿Te cuesta confiar en aquello que no puedes controlar?" },
        { id: "saturno-casa12-5", texto: "¿Sientes que parte de tu aprendizaje consiste en aceptar la incertidumbre?" },
      ],
    },
  },

  /* ───────────────────────────── URANO ────────────────────────────── */
  urano: {
    signos: {
      Aries: [
        { id: "urano-aries-1", texto: "¿Necesitas hacer las cosas a tu manera aunque otros no estén de acuerdo?" },
        { id: "urano-aries-2", texto: "¿Te resulta natural empezar de nuevo cuando sientes que una etapa ha terminado?" },
        { id: "urano-aries-3", texto: "¿Te entusiasma ser de los primeros en probar ideas o proyectos nuevos?" },
        { id: "urano-aries-4", texto: "¿Te cuesta aceptar normas que limitan tu iniciativa?" },
        { id: "urano-aries-5", texto: "¿Prefieres liderar un cambio antes que adaptarte a él?" },
      ],
      Tauro: [
        { id: "urano-tauro-1", texto: "¿Te interesa encontrar nuevas formas de ganar dinero o crear recursos?" },
        { id: "urano-tauro-2", texto: "¿Sientes una conexión especial con la naturaleza o el mundo físico?" },
        { id: "urano-tauro-3", texto: "¿Te atraen especialmente la música, el arte o la belleza?" },
        { id: "urano-tauro-4", texto: "¿Aunque buscas estabilidad, aceptas que los cambios son inevitables?" },
        { id: "urano-tauro-5", texto: "¿Te cuesta cambiar de opinión cuando has decidido algo?" },
      ],
      "Géminis": [
        { id: "urano-geminis-1", texto: "¿Generas ideas nuevas con mucha facilidad?" },
        { id: "urano-geminis-2", texto: "¿Te cuesta mantener el interés en una sola idea durante mucho tiempo?" },
        { id: "urano-geminis-3", texto: "¿Sueles pensar de forma diferente a las personas de tu entorno?" },
        { id: "urano-geminis-4", texto: "¿Te interesan especialmente la comunicación, la enseñanza o la escritura?" },
        { id: "urano-geminis-5", texto: "¿Sientes que tu mente va más rápido que la de la mayoría?" },
      ],
      "Cáncer": [
        { id: "urano-cancer-1", texto: "¿Entiendes la familia de una forma diferente a la tradicional?" },
        { id: "urano-cancer-2", texto: "¿Necesitas mucha libertad dentro del hogar o la vida familiar?" },
        { id: "urano-cancer-3", texto: "¿Los cambios de vivienda o de entorno han sido importantes en tu vida?" },
        { id: "urano-cancer-4", texto: "¿Te resulta fácil tratar a tus padres como personas iguales a ti?" },
        { id: "urano-cancer-5", texto: "¿Tu intuición suele adelantarse a lo que va a ocurrir?" },
      ],
      Leo: [
        { id: "urano-leo-1", texto: "¿Necesitas sentir que eres diferente o especial?" },
        { id: "urano-leo-2", texto: "¿Te resulta difícil aceptar tradiciones solo porque «siempre fueron así»?" },
        { id: "urano-leo-3", texto: "¿Defiendes tus ideas con mucha convicción?" },
        { id: "urano-leo-4", texto: "¿Te gusta expresar tu creatividad de formas poco convencionales?" },
        { id: "urano-leo-5", texto: "¿Sientes que has roto con modelos tradicionales sobre el amor, los hijos o la familia?" },
      ],
      Virgo: [
        { id: "urano-virgo-1", texto: "¿Te gusta mejorar la forma en que se hacen las cosas?" },
        { id: "urano-virgo-2", texto: "¿Te interesan la tecnología, la salud o la innovación práctica?" },
        { id: "urano-virgo-3", texto: "¿Sueles buscar soluciones más eficientes que las habituales?" },
        { id: "urano-virgo-4", texto: "¿Te atraen la ecología o los productos naturales?" },
        { id: "urano-virgo-5", texto: "¿Analizas los cambios antes de ponerlos en práctica?" },
      ],
      Libra: [
        { id: "urano-libra-1", texto: "¿Crees que las relaciones deben dar mucha libertad a ambas personas?" },
        { id: "urano-libra-2", texto: "¿Valoras más la igualdad que seguir modelos tradicionales de pareja?" },
        { id: "urano-libra-3", texto: "¿Te interesan nuevas formas de entender las relaciones humanas?" },
        { id: "urano-libra-4", texto: "¿Sueles cuestionar las normas sociales sobre el amor o el matrimonio?" },
        { id: "urano-libra-5", texto: "¿Te atraen especialmente las personas originales o diferentes?" },
      ],
      Escorpio: [
        { id: "urano-escorpio-1", texto: "¿Te interesan la psicología, el misterio o los temas ocultos?" },
        { id: "urano-escorpio-2", texto: "¿Las grandes crisis han transformado profundamente tu vida?" },
        { id: "urano-escorpio-3", texto: "¿Te atraen los cambios intensos antes que las transformaciones graduales?" },
        { id: "urano-escorpio-4", texto: "¿Te resulta fácil hablar de temas que otras personas consideran tabú?" },
        { id: "urano-escorpio-5", texto: "¿Sientes curiosidad por comprender lo que normalmente permanece oculto?" },
      ],
      Sagitario: [
        { id: "urano-sagitario-1", texto: "¿Te cuesta aceptar creencias o dogmas sin cuestionarlos?" },
        { id: "urano-sagitario-2", texto: "¿Los viajes han cambiado tu forma de entender la vida?" },
        { id: "urano-sagitario-3", texto: "¿Te interesa combinar la ciencia con la espiritualidad o la filosofía?" },
        { id: "urano-sagitario-4", texto: "¿Necesitas libertad para construir tu propia visión del mundo?" },
        { id: "urano-sagitario-5", texto: "¿Te entusiasma explorar culturas o formas de pensar diferentes?" },
      ],
      Capricornio: [
        { id: "urano-capricornio-1", texto: "¿Te interesa transformar la forma en que funcionan las organizaciones o la sociedad?" },
        { id: "urano-capricornio-2", texto: "¿Sueles cuestionar la autoridad aunque respetes las normas?" },
        { id: "urano-capricornio-3", texto: "¿Crees que las tradiciones pueden mejorarse en lugar de eliminarse?" },
        { id: "urano-capricornio-4", texto: "¿Te atraen los proyectos con impacto a largo plazo?" },
        { id: "urano-capricornio-5", texto: "¿Te interesa especialmente cómo evoluciona la sociedad?" },
      ],
      Acuario: [
        { id: "urano-acuario-1", texto: "¿Te entusiasman las ideas que pueden mejorar el futuro?" },
        { id: "urano-acuario-2", texto: "¿Te resulta natural cuestionar casi todo lo establecido?" },
        { id: "urano-acuario-3", texto: "¿Disfrutas trabajando con personas que comparten ideales similares?" },
        { id: "urano-acuario-4", texto: "¿La innovación te motiva más que la estabilidad?" },
        { id: "urano-acuario-5", texto: "¿Sueles imaginar formas diferentes de hacer las cosas?" },
      ],
      Piscis: [
        { id: "urano-piscis-1", texto: "¿Sientes una fuerte conexión con tu intuición?" },
        { id: "urano-piscis-2", texto: "¿Te interesan la espiritualidad o los aspectos invisibles de la vida?" },
        { id: "urano-piscis-3", texto: "¿Intentas encontrar una explicación racional a experiencias intuitivas o espirituales?" },
        { id: "urano-piscis-4", texto: "¿Necesitas momentos de desconexión para recuperar el equilibrio?" },
        { id: "urano-piscis-5", texto: "¿Sientes que percibes cosas que otras personas no suelen notar?" },
      ],
    },
    casas: {
      1: [
        { id: "urano-casa1-1", texto: "¿Necesitas sentir que haces las cosas a tu manera?" },
        { id: "urano-casa1-2", texto: "¿Te cuesta seguir normas que no tienen sentido para ti?" },
        { id: "urano-casa1-3", texto: "¿Sueles cambiar de rumbo o reinventarte con frecuencia?" },
        { id: "urano-casa1-4", texto: "¿Prefieres liderar antes que seguir a otras personas?" },
        { id: "urano-casa1-5", texto: "¿Te aburres cuando tu vida se vuelve demasiado predecible?" },
      ],
      2: [
        { id: "urano-casa2-1", texto: "¿Prefieres un trabajo que te dé libertad antes que uno muy estable?" },
        { id: "urano-casa2-2", texto: "¿El dinero es más un medio para ser libre que un objetivo en sí mismo?" },
        { id: "urano-casa2-3", texto: "¿Tus ingresos han pasado por cambios importantes o inesperados?" },
        { id: "urano-casa2-4", texto: "¿Te cuesta seguir modelos tradicionales de éxito económico?" },
        { id: "urano-casa2-5", texto: "¿Te gusta encontrar formas originales de ganar dinero?" },
      ],
      3: [
        { id: "urano-casa3-1", texto: "¿Sueles cuestionar las ideas que la mayoría da por ciertas?" },
        { id: "urano-casa3-2", texto: "¿Aprendes mejor cuando investigas por tu cuenta?" },
        { id: "urano-casa3-3", texto: "¿Tu forma de pensar suele ser diferente a la de quienes te rodean?" },
        { id: "urano-casa3-4", texto: "¿Necesitas variedad y estímulos constantes para mantener el interés?" },
        { id: "urano-casa3-5", texto: "¿Se te ocurren soluciones originales a los problemas?" },
      ],
      4: [
        { id: "urano-casa4-1", texto: "¿Has sentido alguna vez que eras diferente al resto de tu familia?" },
        { id: "urano-casa4-2", texto: "¿Necesitas mucha libertad dentro de tu hogar?" },
        { id: "urano-casa4-3", texto: "¿Te cuesta permanecer mucho tiempo en el mismo lugar?" },
        { id: "urano-casa4-4", texto: "¿Buscas construir un estilo de vida diferente al de tu familia?" },
        { id: "urano-casa4-5", texto: "¿Sientes que todavía estás definiendo qué significa «hogar» para ti?" },
      ],
      5: [
        { id: "urano-casa5-1", texto: "¿Necesitas expresar tu creatividad de forma original?" },
        { id: "urano-casa5-2", texto: "¿Te aburren las relaciones demasiado rutinarias?" },
        { id: "urano-casa5-3", texto: "¿Tus intereses o aficiones cambian con frecuencia?" },
        { id: "urano-casa5-4", texto: "¿Te atraen personas poco convencionales?" },
        { id: "urano-casa5-5", texto: "¿Sientes que necesitas reinventarte constantemente?" },
      ],
      6: [
        { id: "urano-casa6-1", texto: "¿Te cuesta trabajar con horarios o normas demasiado rígidas?" },
        { id: "urano-casa6-2", texto: "¿Necesitas autonomía para rendir bien en tu trabajo?" },
        { id: "urano-casa6-3", texto: "¿Buscas continuamente formas de mejorar cómo haces las cosas?" },
        { id: "urano-casa6-4", texto: "¿El estrés suele afectar rápidamente a tu cuerpo?" },
        { id: "urano-casa6-5", texto: "¿Prefieres resolver los problemas de manera poco convencional?" },
      ],
      7: [
        { id: "urano-casa7-1", texto: "¿Necesitas mucho espacio personal dentro de una relación?" },
        { id: "urano-casa7-2", texto: "¿Te atraen personas diferentes o poco convencionales?" },
        { id: "urano-casa7-3", texto: "¿Te cuesta permanecer en relaciones donde sientes que pierdes libertad?" },
        { id: "urano-casa7-4", texto: "¿Sientes que una relación debe evolucionar constantemente para funcionar?" },
        { id: "urano-casa7-5", texto: "¿Necesitas sentir que puedes ser completamente tú mismo dentro de la pareja?" },
      ],
      8: [
        { id: "urano-casa8-1", texto: "¿Las grandes transformaciones de tu vida suelen ocurrir de forma inesperada?" },
        { id: "urano-casa8-2", texto: "¿Te interesan la psicología, la astrología o los temas ocultos?" },
        { id: "urano-casa8-3", texto: "¿Te atraen experiencias intensas que cambian tu forma de ver la vida?" },
        { id: "urano-casa8-4", texto: "¿Tu forma de vivir la intimidad es diferente a la de la mayoría?" },
        { id: "urano-casa8-5", texto: "¿Sientes que renaces varias veces a lo largo de tu vida?" },
      ],
      9: [
        { id: "urano-casa9-1", texto: "¿Necesitas construir tus propias creencias en lugar de aceptar las heredadas?" },
        { id: "urano-casa9-2", texto: "¿Los viajes han cambiado profundamente tu forma de pensar?" },
        { id: "urano-casa9-3", texto: "¿Te atraen las ideas innovadoras o poco convencionales?" },
        { id: "urano-casa9-4", texto: "¿Te cuesta aceptar dogmas o verdades absolutas?" },
        { id: "urano-casa9-5", texto: "¿Sientes que aprender cosas nuevas transforma tu vida?" },
      ],
      10: [
        { id: "urano-casa10-1", texto: "¿Necesitas que tu trabajo tenga un propósito además de generar ingresos?" },
        { id: "urano-casa10-2", texto: "¿Has cambiado varias veces de rumbo profesional?" },
        { id: "urano-casa10-3", texto: "¿Te cuesta trabajar en organizaciones cuyos valores no compartes?" },
        { id: "urano-casa10-4", texto: "¿Te motiva innovar o cambiar la forma de hacer las cosas?" },
        { id: "urano-casa10-5", texto: "¿Prefieres construir una carrera poco convencional antes que una muy segura?" },
      ],
      11: [
        { id: "urano-casa11-1", texto: "¿Las amistades han cambiado profundamente tu vida?" },
        { id: "urano-casa11-2", texto: "¿Necesitas formar parte de grupos que compartan tus ideales?" },
        { id: "urano-casa11-3", texto: "¿Te motivan las causas sociales o el cambio colectivo?" },
        { id: "urano-casa11-4", texto: "¿Tus objetivos de vida cambian con frecuencia?" },
        { id: "urano-casa11-5", texto: "¿Sientes que puedes aportar ideas nuevas a los grupos de los que formas parte?" },
      ],
      12: [
        { id: "urano-casa12-1", texto: "¿Confías mucho en tu intuición?" },
        { id: "urano-casa12-2", texto: "¿Necesitas pasar tiempo a solas para sentirte equilibrado?" },
        { id: "urano-casa12-3", texto: "¿Sientes que percibes cosas que otras personas no perciben?" },
        { id: "urano-casa12-4", texto: "¿Te interesan la espiritualidad o los temas relacionados con la conciencia?" },
        { id: "urano-casa12-5", texto: "¿Has vivido cambios internos muy profundos difíciles de explicar?" },
      ],
    },
  },

  /* ──────────────────────────── NEPTUNO ───────────────────────────── */
  neptuno: {
    signos: {
      Aries: [
        { id: "neptuno-aries-1", texto: "¿Sientes que tu vida tiene una misión o propósito especial?" },
        { id: "neptuno-aries-2", texto: "¿Te motivan las causas en las que puedes ayudar a otras personas?" },
        { id: "neptuno-aries-3", texto: "¿La imaginación suele impulsarte a actuar?" },
        { id: "neptuno-aries-4", texto: "¿Te implicas con intensidad cuando crees en una causa?" },
        { id: "neptuno-aries-5", texto: "¿Te resulta difícil permanecer indiferente ante el sufrimiento ajeno?" },
      ],
      Tauro: [
        { id: "neptuno-tauro-1", texto: "¿Buscas dar una aplicación práctica a tus ideales?" },
        { id: "neptuno-tauro-2", texto: "¿La belleza y la armonía son importantes en tu vida diaria?" },
        { id: "neptuno-tauro-3", texto: "¿Sientes una conexión especial con la naturaleza?" },
        { id: "neptuno-tauro-4", texto: "¿Tu intuición suele ayudarte a resolver problemas cotidianos?" },
        { id: "neptuno-tauro-5", texto: "¿Buscas estabilidad económica sin renunciar a tus valores?" },
      ],
      "Géminis": [
        { id: "neptuno-geminis-1", texto: "¿Tienes una imaginación especialmente activa?" },
        { id: "neptuno-geminis-2", texto: "¿Disfrutas escribiendo, comunicando o creando historias?" },
        { id: "neptuno-geminis-3", texto: "¿Te interesan temas esotéricos o espirituales desde un punto de vista intelectual?" },
        { id: "neptuno-geminis-4", texto: "¿La curiosidad te lleva constantemente a aprender cosas nuevas?" },
        { id: "neptuno-geminis-5", texto: "¿Te resulta fácil imaginar posibilidades que otras personas no ven?" },
      ],
      "Cáncer": [
        { id: "neptuno-cancer-1", texto: "¿La familia ocupa un lugar muy importante en tu mundo emocional?" },
        { id: "neptuno-cancer-2", texto: "¿Tiendes a proteger a las personas que quieres?" },
        { id: "neptuno-cancer-3", texto: "¿Idealizas los recuerdos del pasado o la infancia?" },
        { id: "neptuno-cancer-4", texto: "¿Tus emociones influyen mucho en cómo percibes la realidad?" },
        { id: "neptuno-cancer-5", texto: "¿Te cuesta separar lo que imaginas de lo que realmente ocurre?" },
      ],
      Leo: [
        { id: "neptuno-leo-1", texto: "¿Tiendes a idealizar a las personas de las que te enamoras?" },
        { id: "neptuno-leo-2", texto: "¿Te atraen especialmente el arte, la creatividad o la expresión artística?" },
        { id: "neptuno-leo-3", texto: "¿Te cuesta aceptar la autoridad cuando no la respetas?" },
        { id: "neptuno-leo-4", texto: "¿Tu imaginación influye mucho en tus relaciones?" },
        { id: "neptuno-leo-5", texto: "¿Necesitas expresar tu creatividad para sentirte realizado?" },
      ],
      Virgo: [
        { id: "neptuno-virgo-1", texto: "¿Sueles debatirte entre lo que sientes y lo que consideras lógico?" },
        { id: "neptuno-virgo-2", texto: "¿Necesitas que tus ideales tengan una aplicación práctica?" },
        { id: "neptuno-virgo-3", texto: "¿Te interesan especialmente la salud o el cuidado del cuerpo?" },
        { id: "neptuno-virgo-4", texto: "¿Te cuesta aceptar puntos de vista que consideras poco razonables?" },
        { id: "neptuno-virgo-5", texto: "¿Antes de abandonar una forma de hacer las cosas necesitas encontrar otra mejor?" },
      ],
      Libra: [
        { id: "neptuno-libra-1", texto: "¿Tiendes a idealizar a tu pareja o a las personas que amas?" },
        { id: "neptuno-libra-2", texto: "¿Buscas una relación que sientas casi perfecta?" },
        { id: "neptuno-libra-3", texto: "¿La paz y la justicia son ideales muy importantes para ti?" },
        { id: "neptuno-libra-4", texto: "¿Te cuesta aceptar las imperfecciones de una relación?" },
        { id: "neptuno-libra-5", texto: "¿Sientes que las relaciones tienen un fuerte componente espiritual o trascendente?" },
      ],
      Escorpio: [
        { id: "neptuno-escorpio-1", texto: "¿Te interesan los procesos de transformación psicológica o emocional?" },
        { id: "neptuno-escorpio-2", texto: "¿Sientes curiosidad por comprender el inconsciente o lo oculto?" },
        { id: "neptuno-escorpio-3", texto: "¿Las emociones intensas influyen profundamente en tu vida?" },
        { id: "neptuno-escorpio-4", texto: "¿Percibes con facilidad las dinámicas de poder entre las personas?" },
        { id: "neptuno-escorpio-5", texto: "¿Crees que el crecimiento personal implica atravesar etapas difíciles?" },
      ],
      Sagitario: [
        { id: "neptuno-sagitario-1", texto: "¿Buscas constantemente un conocimiento espiritual o filosófico más profundo?" },
        { id: "neptuno-sagitario-2", texto: "¿Sientes que existe una verdad más allá de lo que se puede ver?" },
        { id: "neptuno-sagitario-3", texto: "¿Te atraen los maestros, guías o personas que amplían tu visión del mundo?" },
        { id: "neptuno-sagitario-4", texto: "¿Te frustras cuando la realidad no coincide con tus ideales?" },
        { id: "neptuno-sagitario-5", texto: "¿Te preguntas con frecuencia cuál es el sentido de la vida?" },
      ],
      Capricornio: [
        { id: "neptuno-capricornio-1", texto: "¿Intentas convertir tus ideales en proyectos concretos?" },
        { id: "neptuno-capricornio-2", texto: "¿Sientes responsabilidad hacia las personas más vulnerables?" },
        { id: "neptuno-capricornio-3", texto: "¿Buscas que tus sueños tengan una utilidad práctica?" },
        { id: "neptuno-capricornio-4", texto: "¿Te resulta importante construir algo que perdure?" },
        { id: "neptuno-capricornio-5", texto: "¿Necesitas dar estructura a tus ideas antes de ponerlas en marcha?" },
      ],
      Acuario: [
        { id: "neptuno-acuario-1", texto: "¿Te entusiasman las ideas que pueden transformar el futuro?" },
        { id: "neptuno-acuario-2", texto: "¿Sueles comprender con facilidad conceptos muy abstractos?" },
        { id: "neptuno-acuario-3", texto: "¿Confías mucho en tu intuición cuando surge una idea nueva?" },
        { id: "neptuno-acuario-4", texto: "¿Disfrutas imaginando nuevas formas de vivir o de organizar la sociedad?" },
        { id: "neptuno-acuario-5", texto: "¿Te interesa unir la ciencia, la tecnología y la espiritualidad?" },
      ],
      Piscis: [
        { id: "neptuno-piscis-1", texto: "¿Sientes una conexión profunda con la espiritualidad o lo trascendente?" },
        { id: "neptuno-piscis-2", texto: "¿Te cuesta poner límites emocionales a otras personas?" },
        { id: "neptuno-piscis-3", texto: "¿La música, el arte o la creatividad son una forma importante de expresar lo que sientes?" },
        { id: "neptuno-piscis-4", texto: "¿La compasión influye mucho en tus decisiones?" },
        { id: "neptuno-piscis-5", texto: "¿Necesitas momentos de soledad o silencio para sentirte conectado contigo mismo?" },
      ],
    },
    casas: {
      1: [
        { id: "neptuno-casa1-1", texto: "¿Te adaptas con facilidad a la personalidad de las personas con las que estás?" },
        { id: "neptuno-casa1-2", texto: "¿Te cuesta saber quién eres realmente cuando estás con otras personas?" },
        { id: "neptuno-casa1-3", texto: "¿Sientes una gran facilidad para comprender cómo se sienten los demás?" },
        { id: "neptuno-casa1-4", texto: "¿Tiendes a sacrificar tus propias necesidades para agradar?" },
        { id: "neptuno-casa1-5", texto: "¿Necesitas momentos de soledad para recuperar tu identidad?" },
      ],
      2: [
        { id: "neptuno-casa2-1", texto: "¿Te cuesta valorar plenamente tus propios talentos?" },
        { id: "neptuno-casa2-2", texto: "¿Sientes que el dinero por sí solo no da sentido a tu vida?" },
        { id: "neptuno-casa2-3", texto: "¿Tus valores personales son más importantes que el éxito económico?" },
        { id: "neptuno-casa2-4", texto: "¿Te resulta difícil poner precio a tu trabajo o a tus capacidades?" },
        { id: "neptuno-casa2-5", texto: "¿Buscas que tus recursos tengan un propósito más profundo?" },
      ],
      3: [
        { id: "neptuno-casa3-1", texto: "¿Te resulta más fácil comprender ideas intuitivamente que analizarlas paso a paso?" },
        { id: "neptuno-casa3-2", texto: "¿Te cuesta mantener la concentración durante mucho tiempo?" },
        { id: "neptuno-casa3-3", texto: "¿Prefieres expresar lo que sientes mediante el arte o la creatividad?" },
        { id: "neptuno-casa3-4", texto: "¿Sueles captar el significado profundo de una conversación más que sus palabras exactas?" },
        { id: "neptuno-casa3-5", texto: "¿Tu imaginación influye mucho en tu forma de pensar?" },
      ],
      4: [
        { id: "neptuno-casa4-1", texto: "¿Sientes que todavía buscas un lugar donde sentirte verdaderamente en casa?" },
        { id: "neptuno-casa4-2", texto: "¿Tiendes a idealizar tu infancia o tu familia?" },
        { id: "neptuno-casa4-3", texto: "¿Te cuesta sentir que tienes raíces sólidas?" },
        { id: "neptuno-casa4-4", texto: "¿Necesitas un hogar tranquilo para sentirte bien?" },
        { id: "neptuno-casa4-5", texto: "¿Sientes una conexión especial con el mar, el agua o los lugares silenciosos?" },
      ],
      5: [
        { id: "neptuno-casa5-1", texto: "¿Necesitas expresar tu creatividad para sentirte realizado?" },
        { id: "neptuno-casa5-2", texto: "¿Tiendes a idealizar a las personas de las que te enamoras?" },
        { id: "neptuno-casa5-3", texto: "¿Te atraen especialmente la música, el cine, la fotografía o las artes?" },
        { id: "neptuno-casa5-4", texto: "¿Te cuesta diferenciar entre el amor real y el amor idealizado?" },
        { id: "neptuno-casa5-5", texto: "¿Sientes que tu creatividad aparece mejor cuando te dejas llevar por la inspiración?" },
      ],
      6: [
        { id: "neptuno-casa6-1", texto: "¿Te afecta emocionalmente el ambiente de tu trabajo?" },
        { id: "neptuno-casa6-2", texto: "¿Te resulta natural cuidar o ayudar a otras personas?" },
        { id: "neptuno-casa6-3", texto: "¿El estrés emocional suele reflejarse rápidamente en tu cuerpo?" },
        { id: "neptuno-casa6-4", texto: "¿Necesitas que tu trabajo tenga un sentido humano o espiritual?" },
        { id: "neptuno-casa6-5", texto: "¿Te cuesta mantener rutinas muy rígidas?" },
      ],
      7: [
        { id: "neptuno-casa7-1", texto: "¿Tiendes a idealizar a tu pareja al comienzo de una relación?" },
        { id: "neptuno-casa7-2", texto: "¿Te cuesta poner límites cuando quieres a alguien?" },
        { id: "neptuno-casa7-3", texto: "¿Sientes que das mucho más de lo que recibes en tus relaciones?" },
        { id: "neptuno-casa7-4", texto: "¿Te atraen personas que necesitan ayuda o apoyo?" },
        { id: "neptuno-casa7-5", texto: "¿Buscas una conexión espiritual además de emocional en la pareja?" },
      ],
      8: [
        { id: "neptuno-casa8-1", texto: "¿Sientes que la intimidad puede ser una experiencia profundamente transformadora?" },
        { id: "neptuno-casa8-2", texto: "¿Te interesan los temas relacionados con la espiritualidad, la muerte o el inconsciente?" },
        { id: "neptuno-casa8-3", texto: "¿Percibes fácilmente el sufrimiento emocional de otras personas?" },
        { id: "neptuno-casa8-4", texto: "¿Te cuesta separar la fantasía de la realidad en las relaciones íntimas?" },
        { id: "neptuno-casa8-5", texto: "¿Sientes que las experiencias difíciles te acercan a comprender mejor la vida?" },
      ],
      9: [
        { id: "neptuno-casa9-1", texto: "¿Buscas constantemente respuestas sobre el sentido de la vida?" },
        { id: "neptuno-casa9-2", texto: "¿Te atraen especialmente la espiritualidad o las filosofías profundas?" },
        { id: "neptuno-casa9-3", texto: "¿Te decepcionan con facilidad los maestros o las creencias que idealizas?" },
        { id: "neptuno-casa9-4", texto: "¿Los viajes tienen para ti un significado más espiritual que turístico?" },
        { id: "neptuno-casa9-5", texto: "¿Confías más en tu intuición que en los dogmas establecidos?" },
      ],
      10: [
        { id: "neptuno-casa10-1", texto: "¿Necesitas que tu trabajo tenga un propósito que vaya más allá del dinero?" },
        { id: "neptuno-casa10-2", texto: "¿Te cuesta decidir cuál es tu verdadera vocación?" },
        { id: "neptuno-casa10-3", texto: "¿Sientes que puedes inspirar o ayudar a otras personas mediante tu profesión?" },
        { id: "neptuno-casa10-4", texto: "¿Te incomoda competir por reconocimiento o poder?" },
        { id: "neptuno-casa10-5", texto: "¿Te gustaría que tu trabajo tuviera un impacto positivo en la sociedad?" },
      ],
      11: [
        { id: "neptuno-casa11-1", texto: "¿Te motivan los proyectos que buscan ayudar a otras personas?" },
        { id: "neptuno-casa11-2", texto: "¿Idealizas los grupos o las causas en las que participas?" },
        { id: "neptuno-casa11-3", texto: "¿Te decepcionas cuando las personas no están a la altura de tus ideales?" },
        { id: "neptuno-casa11-4", texto: "¿Te sientes especialmente conectado con personas sensibles o creativas?" },
        { id: "neptuno-casa11-5", texto: "¿Buscas amistades con las que compartir ideales profundos?" },
      ],
      12: [
        { id: "neptuno-casa12-1", texto: "¿Sientes que tu intuición es especialmente fuerte?" },
        { id: "neptuno-casa12-2", texto: "¿Necesitas momentos de retiro o soledad para sentirte bien?" },
        { id: "neptuno-casa12-3", texto: "¿Te cuesta distinguir entre tus emociones y las del entorno?" },
        { id: "neptuno-casa12-4", texto: "¿La espiritualidad o el mundo interior ocupan un lugar muy importante en tu vida?" },
        { id: "neptuno-casa12-5", texto: "¿Tiendes a refugiarte en la imaginación cuando la realidad te resulta difícil?" },
      ],
    },
  },

  /* ───────────────────────────── PLUTÓN ───────────────────────────── */
  // Plutón tarda entre 12 y 30 años en cambiar de signo: empieza en Cáncer
  // porque quien tiene Plutón en Géminis o antes nació hace más de un siglo.
  pluton: {
    signos: {
      "Cáncer": [
        { id: "pluton-cancer-1", texto: "¿Sientes una necesidad muy fuerte de proteger a las personas que consideras tuyas?" },
        { id: "pluton-cancer-2", texto: "¿Los conflictos familiares han marcado profundamente tu vida?" },
        { id: "pluton-cancer-3", texto: "¿Te cuesta romper con tradiciones familiares aunque quieras hacerlo?" },
        { id: "pluton-cancer-4", texto: "¿La seguridad emocional es una prioridad para ti?" },
        { id: "pluton-cancer-5", texto: "¿Tu intuición suele avisarte cuando algo no va bien?" },
      ],
      Leo: [
        { id: "pluton-leo-1", texto: "¿Sientes una fuerte necesidad de expresar tu creatividad?" },
        { id: "pluton-leo-2", texto: "¿Te atrae comprender cómo funciona el poder o la influencia personal?" },
        { id: "pluton-leo-3", texto: "¿Te gusta dejar una huella importante en lo que haces?" },
        { id: "pluton-leo-4", texto: "¿Sientes que tu identidad ha pasado por transformaciones profundas?" },
        { id: "pluton-leo-5", texto: "¿Te resulta difícil pasar desapercibido?" },
      ],
      Virgo: [
        { id: "pluton-virgo-1", texto: "¿Necesitas comprender todos los detalles antes de confiar en algo?" },
        { id: "pluton-virgo-2", texto: "¿El trabajo ocupa un lugar muy importante en tu vida?" },
        { id: "pluton-virgo-3", texto: "¿Tiendes a buscar el control a través del orden o la organización?" },
        { id: "pluton-virgo-4", texto: "¿Te cuesta comprometerte plenamente cuando sientes incertidumbre?" },
        { id: "pluton-virgo-5", texto: "¿Sueles analizar tanto las cosas que te cuesta pasar a la acción?" },
      ],
      Libra: [
        { id: "pluton-libra-1", texto: "¿Tus relaciones han transformado profundamente tu forma de ser?" },
        { id: "pluton-libra-2", texto: "¿Has vivido relaciones con fuertes luchas de poder?" },
        { id: "pluton-libra-3", texto: "¿Te cuesta mantener relaciones superficiales?" },
        { id: "pluton-libra-4", texto: "¿Sientes que una relación cambia por completo tu vida, para bien o para mal?" },
        { id: "pluton-libra-5", texto: "¿Crees que las relaciones deben construirse de una forma diferente a la que aprendiste en tu familia?" },
      ],
      Escorpio: [
        { id: "pluton-escorpio-1", texto: "¿Has vivido crisis que cambiaron radicalmente tu forma de entender la vida?" },
        { id: "pluton-escorpio-2", texto: "¿Te atraen los temas relacionados con el poder, la psicología o la transformación?" },
        { id: "pluton-escorpio-3", texto: "¿Sientes que necesitas llegar al fondo de las cosas para comprenderlas?" },
        { id: "pluton-escorpio-4", texto: "¿Te resulta fácil romper con etapas del pasado cuando ya han terminado?" },
        { id: "pluton-escorpio-5", texto: "¿Crees que las grandes transformaciones suelen nacer de las crisis?" },
      ],
      Sagitario: [
        { id: "pluton-sagitario-1", texto: "¿Necesitas sentir libertad para crecer como persona?" },
        { id: "pluton-sagitario-2", texto: "¿Te interesa transformar tu forma de entender la vida a través del conocimiento?" },
        { id: "pluton-sagitario-3", texto: "¿Sueles cuestionar las creencias que heredaste?" },
        { id: "pluton-sagitario-4", texto: "¿Los viajes o el contacto con otras culturas han cambiado profundamente tu visión del mundo?" },
        { id: "pluton-sagitario-5", texto: "¿Sientes que siempre existe una forma mejor de hacer las cosas?" },
      ],
      Capricornio: [
        { id: "pluton-capricornio-1", texto: "¿Te motiva transformar las estructuras o sistemas que no funcionan?" },
        { id: "pluton-capricornio-2", texto: "¿Sueles asumir responsabilidades importantes con naturalidad?" },
        { id: "pluton-capricornio-3", texto: "¿Te cuesta aceptar autoridades que no respetas?" },
        { id: "pluton-capricornio-4", texto: "¿Necesitas construir algo que tenga un impacto duradero?" },
        { id: "pluton-capricornio-5", texto: "¿Prefieres cambiar las normas antes que adaptarte a ellas?" },
      ],
      Acuario: [
        { id: "pluton-acuario-1", texto: "¿Sientes que la sociedad necesita cambios profundos?" },
        { id: "pluton-acuario-2", texto: "¿Te atraen las ideas que pueden transformar el futuro?" },
        { id: "pluton-acuario-3", texto: "¿Te cuesta aceptar estructuras de poder que consideras injustas?" },
        { id: "pluton-acuario-4", texto: "¿Crees que las personas deberían ser más libres e iguales?" },
        { id: "pluton-acuario-5", texto: "¿Te interesa participar en cambios que beneficien al conjunto de la sociedad?" },
      ],
      Piscis: [
        { id: "pluton-piscis-1", texto: "¿Sientes que la realidad tiene una dimensión que normalmente no se percibe?" },
        { id: "pluton-piscis-2", texto: "¿Te interesa comprender el significado profundo de la existencia?" },
        { id: "pluton-piscis-3", texto: "¿La espiritualidad influye en tu forma de entender la vida?" },
        { id: "pluton-piscis-4", texto: "¿Has vivido experiencias que cambiaron radicalmente tu percepción de la realidad?" },
        { id: "pluton-piscis-5", texto: "¿Sientes que necesitas aprender a distinguir entre la realidad y tus propias proyecciones?" },
      ],
    },
    casas: {
      1: [
        { id: "pluton-casa1-1", texto: "¿Sientes que has cambiado profundamente varias veces a lo largo de tu vida?" },
        { id: "pluton-casa1-2", texto: "¿Te cuesta mostrarte vulnerable ante los demás?" },
        { id: "pluton-casa1-3", texto: "¿Las personas suelen percibirte como alguien intenso?" },
        { id: "pluton-casa1-4", texto: "¿Necesitas sentir que tienes el control de tu vida?" },
        { id: "pluton-casa1-5", texto: "¿Las crisis personales te han hecho más fuerte?" },
      ],
      2: [
        { id: "pluton-casa2-1", texto: "¿Te cuesta sentir seguridad cuando tu situación económica cambia?" },
        { id: "pluton-casa2-2", texto: "¿Tiendes a aferrarte a aquello que valoras por miedo a perderlo?" },
        { id: "pluton-casa2-3", texto: "¿Has cambiado profundamente tu forma de entender el dinero o el éxito?" },
        { id: "pluton-casa2-4", texto: "¿Cuando quieres algo, te cuesta conformarte con menos?" },
        { id: "pluton-casa2-5", texto: "¿Sientes que tu verdadero valor va mucho más allá de lo material?" },
      ],
      3: [
        { id: "pluton-casa3-1", texto: "¿Te interesa comprender lo que hay detrás de las palabras o las apariencias?" },
        { id: "pluton-casa3-2", texto: "¿Tu mente tiende a dar muchas vueltas a los mismos temas?" },
        { id: "pluton-casa3-3", texto: "¿Las conversaciones profundas te interesan más que las superficiales?" },
        { id: "pluton-casa3-4", texto: "¿Tus palabras suelen tener un gran impacto en otras personas?" },
        { id: "pluton-casa3-5", texto: "¿Te cuesta dejar ir ideas o pensamientos que te afectan?" },
      ],
      4: [
        { id: "pluton-casa4-1", texto: "¿Sientes que has tenido que sanar heridas familiares importantes?" },
        { id: "pluton-casa4-2", texto: "¿Necesitas sentir que tu hogar es un lugar completamente seguro?" },
        { id: "pluton-casa4-3", texto: "¿Te cuesta soltar el pasado familiar?" },
        { id: "pluton-casa4-4", texto: "¿Las emociones intensas aparecen con facilidad dentro del entorno familiar?" },
        { id: "pluton-casa4-5", texto: "¿Sientes que estás transformando patrones heredados de tu familia?" },
      ],
      5: [
        { id: "pluton-casa5-1", texto: "¿Necesitas expresar tu creatividad de una forma muy personal?" },
        { id: "pluton-casa5-2", texto: "¿Te afectan especialmente las críticas sobre lo que creas?" },
        { id: "pluton-casa5-3", texto: "¿Buscas destacar por aquello que haces?" },
        { id: "pluton-casa5-4", texto: "¿Vives el amor o el romance con mucha intensidad?" },
        { id: "pluton-casa5-5", texto: "¿Has pasado por crisis que cambiaron tu forma de expresar quién eres?" },
      ],
      6: [
        { id: "pluton-casa6-1", texto: "¿Te exiges mucho a ti mismo en el trabajo?" },
        { id: "pluton-casa6-2", texto: "¿Te cuesta delegar porque piensas que tú lo harás mejor?" },
        { id: "pluton-casa6-3", texto: "¿Sientes necesidad de controlar cómo se hacen las cosas?" },
        { id: "pluton-casa6-4", texto: "¿El estrés suele terminar afectando a tu salud?" },
        { id: "pluton-casa6-5", texto: "¿Te interesa comprender la relación entre cuerpo y emociones?" },
      ],
      7: [
        { id: "pluton-casa7-1", texto: "¿Las relaciones importantes han cambiado profundamente tu vida?" },
        { id: "pluton-casa7-2", texto: "¿Te cuesta confiar completamente en una pareja?" },
        { id: "pluton-casa7-3", texto: "¿Temes ser traicionado o abandonado en las relaciones?" },
        { id: "pluton-casa7-4", texto: "¿Tus relaciones suelen vivirse con mucha intensidad emocional?" },
        { id: "pluton-casa7-5", texto: "¿Has aprendido a poner límites más sanos con el paso del tiempo?" },
      ],
      8: [
        { id: "pluton-casa8-1", texto: "¿Te interesan especialmente la psicología, la muerte o los procesos de transformación?" },
        { id: "pluton-casa8-2", texto: "¿Las crisis importantes te ayudan a descubrir una nueva versión de ti mismo?" },
        { id: "pluton-casa8-3", texto: "¿Sientes que la intimidad emocional transforma profundamente tu vida?" },
        { id: "pluton-casa8-4", texto: "¿Percibes con facilidad aquello que otras personas intentan ocultar?" },
        { id: "pluton-casa8-5", texto: "¿Has sentido alguna vez que renacías después de tocar fondo?" },
      ],
      9: [
        { id: "pluton-casa9-1", texto: "¿Has cambiado radicalmente tus creencias a lo largo de tu vida?" },
        { id: "pluton-casa9-2", texto: "¿Necesitas encontrar una verdad profunda por ti mismo?" },
        { id: "pluton-casa9-3", texto: "¿Te cuesta aceptar ideas en las que no crees plenamente?" },
        { id: "pluton-casa9-4", texto: "¿Los viajes o los estudios han transformado tu forma de ver la vida?" },
        { id: "pluton-casa9-5", texto: "¿Sientes que buscas respuestas más profundas que la mayoría?" },
      ],
      10: [
        { id: "pluton-casa10-1", texto: "¿Tu profesión ha pasado por cambios muy importantes?" },
        { id: "pluton-casa10-2", texto: "¿Te motiva ejercer influencia o liderazgo?" },
        { id: "pluton-casa10-3", texto: "¿Te cuesta aceptar figuras de autoridad cuando no las respetas?" },
        { id: "pluton-casa10-4", texto: "¿Sientes que tu trabajo debe dejar una huella importante?" },
        { id: "pluton-casa10-5", texto: "¿Has tenido que redefinir varias veces tu camino profesional?" },
      ],
      11: [
        { id: "pluton-casa11-1", texto: "¿Las amistades han provocado grandes cambios en tu vida?" },
        { id: "pluton-casa11-2", texto: "¿Te cuesta sentir que encajas completamente en los grupos?" },
        { id: "pluton-casa11-3", texto: "¿Buscas transformar el entorno del que formas parte?" },
        { id: "pluton-casa11-4", texto: "¿Has cambiado varias veces de grupo o círculo social?" },
        { id: "pluton-casa11-5", texto: "¿Prefieres tener pocas amistades pero muy profundas?" },
      ],
      12: [
        { id: "pluton-casa12-1", texto: "¿Sientes que luchas con miedos difíciles de explicar?" },
        { id: "pluton-casa12-2", texto: "¿Necesitas tiempo a solas para comprender lo que sientes?" },
        { id: "pluton-casa12-3", texto: "¿Las crisis internas han sido una parte importante de tu crecimiento?" },
        { id: "pluton-casa12-4", texto: "¿Te interesa explorar tu inconsciente o tu mundo interior?" },
        { id: "pluton-casa12-5", texto: "¿Sientes que cuanto mejor conoces tu sombra, más libre te vuelves?" },
      ],
    },
  },

  /* ───────────────────────────── LILITH ───────────────────────────── */
  lilith: {
    signos: {
      Aries: [
        { id: "lilith-aries-1", texto: "¿Te cuesta pedir ayuda porque prefieres resolverlo todo por ti mismo?" },
        { id: "lilith-aries-2", texto: "¿Sientes incomodidad cuando dependes emocional o materialmente de otra persona?" },
        { id: "lilith-aries-3", texto: "¿Con frecuencia antepones las necesidades de los demás aunque en realidad no te apetezca?" },
        { id: "lilith-aries-4", texto: "¿Te resulta difícil reconocer cuándo realmente deseas algo para ti?" },
        { id: "lilith-aries-5", texto: "¿Sientes que necesitas demostrar que puedes solo?" },
      ],
      Tauro: [
        { id: "lilith-tauro-1", texto: "¿Te cuesta reconocer o expresar lo que realmente deseas?" },
        { id: "lilith-tauro-2", texto: "¿Alguna vez has sentido vergüenza por tus deseos o placeres?" },
        { id: "lilith-tauro-3", texto: "¿Tiendes a mantener situaciones que no te hacen feliz por sensación de seguridad?" },
        { id: "lilith-tauro-4", texto: "¿Has vivido etapas en las que te das cuenta de que persigues objetivos que en realidad no deseas?" },
        { id: "lilith-tauro-5", texto: "¿Te resulta difícil disfrutar del presente mientras buscas estabilidad?" },
      ],
      "Géminis": [
        { id: "lilith-geminis-1", texto: "¿Te preocupa que otras personas puedan pensar que no eres suficientemente inteligente?" },
        { id: "lilith-geminis-2", texto: "¿Sientes una fuerte necesidad de que comprendan lo que quieres expresar?" },
        { id: "lilith-geminis-3", texto: "¿Te cuesta profundizar en una idea antes de pasar a la siguiente?" },
        { id: "lilith-geminis-4", texto: "¿Necesitas varios estímulos a la vez para mantener la concentración?" },
        { id: "lilith-geminis-5", texto: "¿Te refugias en ideas abstractas cuando sientes que no te entienden?" },
      ],
      "Cáncer": [
        { id: "lilith-cancer-1", texto: "¿Te cuesta mostrar tu vulnerabilidad incluso con personas de confianza?" },
        { id: "lilith-cancer-2", texto: "¿Sientes que, por mucho que des, nunca es suficiente?" },
        { id: "lilith-cancer-3", texto: "¿Te resulta difícil separar tus emociones de las de tu familia?" },
        { id: "lilith-cancer-4", texto: "¿Tiendes a refugiarte en el trabajo o las responsabilidades para evitar sentir?" },
        { id: "lilith-cancer-5", texto: "¿Te cuesta permitirte necesitar cuidado o apoyo emocional?" },
      ],
      Leo: [
        { id: "lilith-leo-1", texto: "¿Te cuesta mostrar quién eres por miedo a no ser aceptado?" },
        { id: "lilith-leo-2", texto: "¿Sientes que no has recibido el reconocimiento que necesitabas?" },
        { id: "lilith-leo-3", texto: "¿Te da miedo expresar plenamente tu creatividad?" },
        { id: "lilith-leo-4", texto: "¿A veces sientes que no mereces ser admirado o querido?" },
        { id: "lilith-leo-5", texto: "¿Te has sentido fuera de lugar incluso dentro de grupos con los que compartes ideales?" },
      ],
      Virgo: [
        { id: "lilith-virgo-1", texto: "¿Sientes que nunca haces las cosas lo suficientemente bien?" },
        { id: "lilith-virgo-2", texto: "¿El miedo a no hacerlo perfecto hace que retrases proyectos importantes?" },
        { id: "lilith-virgo-3", texto: "¿Tiendes a juzgarte con mucha dureza?" },
        { id: "lilith-virgo-4", texto: "¿Necesitas tener el control para sentirte tranquilo?" },
        { id: "lilith-virgo-5", texto: "¿Te cuesta aceptar el desorden o la incertidumbre?" },
      ],
      Libra: [
        { id: "lilith-libra-1", texto: "¿Te cuesta expresar lo que realmente necesitas en una relación?" },
        { id: "lilith-libra-2", texto: "¿Temes que, si muestras tus necesidades, la otra persona se aleje?" },
        { id: "lilith-libra-3", texto: "¿Sientes miedo a repetir la historia de pareja que vivieron tus padres?" },
        { id: "lilith-libra-4", texto: "¿Tiendes a convencerte de que no necesitas pareja aunque la desees?" },
        { id: "lilith-libra-5", texto: "¿Te resulta muy doloroso sentir que no eres escuchado?" },
      ],
      Escorpio: [
        { id: "lilith-escorpio-1", texto: "¿Te cuesta confiar plenamente en otras personas?" },
        { id: "lilith-escorpio-2", texto: "¿La frustración suele convertirse en enfado o ira con facilidad?" },
        { id: "lilith-escorpio-3", texto: "¿Sientes que hay experiencias de tu vida que todavía no has conseguido cerrar?" },
        { id: "lilith-escorpio-4", texto: "¿Te atrae descubrir tu propio poder interior?" },
        { id: "lilith-escorpio-5", texto: "¿Te cuesta compartir aquello que consideras más valioso o íntimo?" },
      ],
      Sagitario: [
        { id: "lilith-sagitario-1", texto: "¿Sientes que necesitas vivir de acuerdo con tu propia verdad?" },
        { id: "lilith-sagitario-2", texto: "¿Te cuesta mostrar quién eres realmente por miedo al juicio?" },
        { id: "lilith-sagitario-3", texto: "¿Te resulta difícil expresar lo que piensas cuando crees que no será aceptado?" },
        { id: "lilith-sagitario-4", texto: "¿Te incomodan las normas que limitan tu libertad?" },
        { id: "lilith-sagitario-5", texto: "¿Has sentido alguna vez que reprimías una parte importante de ti para encajar?" },
      ],
      Capricornio: [
        { id: "lilith-capricornio-1", texto: "¿Te cuesta pedir ayuda porque sientes que debes poder con todo?" },
        { id: "lilith-capricornio-2", texto: "¿Sientes que cuanto más te esfuerzas, más lejos parece estar lo que deseas?" },
        { id: "lilith-capricornio-3", texto: "¿Temes quedarte solo si alcanzas demasiado éxito?" },
        { id: "lilith-capricornio-4", texto: "¿Buscas reconocimiento afectivo más que reconocimiento profesional?" },
        { id: "lilith-capricornio-5", texto: "¿Te cuesta mostrar tus emociones mientras persigues tus objetivos?" },
      ],
      Acuario: [
        { id: "lilith-acuario-1", texto: "¿Te preocupa no encontrar un lugar donde sentir que perteneces?" },
        { id: "lilith-acuario-2", texto: "¿Alternas entre querer estar con la gente y querer aislarte?" },
        { id: "lilith-acuario-3", texto: "¿Te cuesta mostrar cuánto necesitas el afecto o la amistad?" },
        { id: "lilith-acuario-4", texto: "¿Sientes que debes aparentar seguridad aunque por dentro dudes de ti?" },
        { id: "lilith-acuario-5", texto: "¿Temes ser rechazado por mostrar quién eres realmente?" },
      ],
      Piscis: [
        { id: "lilith-piscis-1", texto: "¿Sientes que escondes una parte muy sensible de ti por miedo al juicio?" },
        { id: "lilith-piscis-2", texto: "¿Te cuesta confiar plenamente en tus dones o intuición?" },
        { id: "lilith-piscis-3", texto: "¿Temes decepcionar a las personas que quieres?" },
        { id: "lilith-piscis-4", texto: "¿Tiendes a perderte en pequeños detalles cuando algo te preocupa?" },
        { id: "lilith-piscis-5", texto: "¿Sientes que tu sensibilidad es mayor que la de la mayoría?" },
      ],
    },
    casas: {
      1: [
        { id: "lilith-casa1-1", texto: "¿Te cuesta mostrar quién eres realmente por miedo al juicio?" },
        { id: "lilith-casa1-2", texto: "¿Sientes que a veces ocultas tus verdaderos deseos para encajar?" },
        { id: "lilith-casa1-3", texto: "¿Te cuesta pedir ayuda aunque la necesites?" },
        { id: "lilith-casa1-4", texto: "¿Admiras a las personas que se muestran completamente auténticas?" },
        { id: "lilith-casa1-5", texto: "¿Necesitas sentir que puedes ser tú mismo sin dar explicaciones?" },
      ],
      2: [
        { id: "lilith-casa2-1", texto: "¿Te cuesta permitirte disfrutar plenamente de lo que consigues?" },
        { id: "lilith-casa2-2", texto: "¿Sientes culpa cuando inviertes dinero en ti mismo?" },
        { id: "lilith-casa2-3", texto: "¿Te resulta difícil reconocer tus propios talentos?" },
        { id: "lilith-casa2-4", texto: "¿Admiras a las personas que viven con abundancia y tranquilidad?" },
        { id: "lilith-casa2-5", texto: "¿Te cuesta creer que mereces una vida cómoda?" },
      ],
      3: [
        { id: "lilith-casa3-1", texto: "¿Te preocupa que los demás no comprendan lo que quieres expresar?" },
        { id: "lilith-casa3-2", texto: "¿Alguna vez has sentido que tu forma de pensar era infravalorada?" },
        { id: "lilith-casa3-3", texto: "¿Te cuesta expresar ciertas ideas por miedo a ser juzgado?" },
        { id: "lilith-casa3-4", texto: "¿Admiras a las personas que saben comunicar con claridad?" },
        { id: "lilith-casa3-5", texto: "¿Necesitas sentir que tu voz es escuchada?" },
      ],
      4: [
        { id: "lilith-casa4-1", texto: "¿Te cuesta sentir que perteneces plenamente a un lugar o una familia?" },
        { id: "lilith-casa4-2", texto: "¿Sientes que durante mucho tiempo dejaste tus necesidades en segundo plano?" },
        { id: "lilith-casa4-3", texto: "¿Te resulta difícil mostrar tu vulnerabilidad dentro de la familia?" },
        { id: "lilith-casa4-4", texto: "¿Admiras a las personas que parecen emocionalmente estables?" },
        { id: "lilith-casa4-5", texto: "¿Necesitas construir un hogar diferente al que conociste?" },
      ],
      5: [
        { id: "lilith-casa5-1", texto: "¿Te cuesta creer que puedes ser querido simplemente por ser tú?" },
        { id: "lilith-casa5-2", texto: "¿Buscas reconocimiento cuando muestras tu creatividad?" },
        { id: "lilith-casa5-3", texto: "¿Te preocupa demasiado la opinión de los demás sobre lo que haces?" },
        { id: "lilith-casa5-4", texto: "¿Te resulta difícil disfrutar sin sentir que debes demostrar algo?" },
        { id: "lilith-casa5-5", texto: "¿Necesitas aprender a divertirte sin sentir culpa?" },
      ],
      6: [
        { id: "lilith-casa6-1", texto: "¿Te exiges ser perfecto para sentir que eres suficiente?" },
        { id: "lilith-casa6-2", texto: "¿Te cuesta descansar sin sentir que deberías estar haciendo algo útil?" },
        { id: "lilith-casa6-3", texto: "¿Sientes que te juzgas con mucha dureza?" },
        { id: "lilith-casa6-4", texto: "¿Te preocupa mucho cometer errores?" },
        { id: "lilith-casa6-5", texto: "¿Admiras a las personas que viven con calma y sin tanta autoexigencia?" },
      ],
      7: [
        { id: "lilith-casa7-1", texto: "¿Te cuesta pedir a tu pareja lo que realmente necesitas?" },
        { id: "lilith-casa7-2", texto: "¿Temes depender emocionalmente de otra persona?" },
        { id: "lilith-casa7-3", texto: "¿Oscilas entre necesitar mucho a alguien y querer hacerlo todo solo?" },
        { id: "lilith-casa7-4", texto: "¿Buscas relaciones muy equilibradas, pero te decepcionas con facilidad?" },
        { id: "lilith-casa7-5", texto: "¿Te cuesta confiar plenamente en una relación?" },
      ],
      8: [
        { id: "lilith-casa8-1", texto: "¿Te cuesta mostrarte vulnerable ante otras personas?" },
        { id: "lilith-casa8-2", texto: "¿Sientes necesidad de controlar las situaciones para sentirte seguro?" },
        { id: "lilith-casa8-3", texto: "¿Las pérdidas o las crisis han cambiado profundamente tu forma de vivir?" },
        { id: "lilith-casa8-4", texto: "¿Te atraen los temas relacionados con la psicología o la transformación?" },
        { id: "lilith-casa8-5", texto: "¿Sientes que escondes una parte muy profunda de ti?" },
      ],
      9: [
        { id: "lilith-casa9-1", texto: "¿Te cuesta aceptar creencias que no has comprobado por ti mismo?" },
        { id: "lilith-casa9-2", texto: "¿Necesitas encontrar un sentido profundo a lo que vives?" },
        { id: "lilith-casa9-3", texto: "¿Te molestan especialmente las personas que hablan sin haber experimentado?" },
        { id: "lilith-casa9-4", texto: "¿Buscas desarrollar una filosofía de vida propia?" },
        { id: "lilith-casa9-5", texto: "¿Te cuesta actuar cuando sientes que no tienes todas las respuestas?" },
      ],
      10: [
        { id: "lilith-casa10-1", texto: "¿Te cuesta encontrar un lugar profesional donde sientas que encajas?" },
        { id: "lilith-casa10-2", texto: "¿Buscas que tu trabajo tenga un propósito auténtico?" },
        { id: "lilith-casa10-3", texto: "¿Te afecta especialmente sentir que no eres reconocido?" },
        { id: "lilith-casa10-4", texto: "¿Te resulta difícil saber cuál es realmente tu vocación?" },
        { id: "lilith-casa10-5", texto: "¿Sientes que tienes capacidad para liderar, aunque a veces la escondes?" },
      ],
      11: [
        { id: "lilith-casa11-1", texto: "¿Te cuesta sentir que perteneces plenamente a un grupo?" },
        { id: "lilith-casa11-2", texto: "¿Temes que mostrar quién eres haga que los demás te rechacen?" },
        { id: "lilith-casa11-3", texto: "¿Te preocupa demasiado la opinión de los demás?" },
        { id: "lilith-casa11-4", texto: "¿Sientes que tienes una visión diferente a la mayoría?" },
        { id: "lilith-casa11-5", texto: "¿Te gustaría aportar algo importante a la sociedad?" },
      ],
      12: [
        { id: "lilith-casa12-1", texto: "¿Te cuesta estar a solas con tus propios pensamientos?" },
        { id: "lilith-casa12-2", texto: "¿Sientes que ocultas partes importantes de ti mismo?" },
        { id: "lilith-casa12-3", texto: "¿Te resulta difícil confiar plenamente en la vida?" },
        { id: "lilith-casa12-4", texto: "¿La espiritualidad o el autoconocimiento ocupan un lugar importante en tu vida?" },
        { id: "lilith-casa12-5", texto: "¿Tiendes a refugiarte en la imaginación cuando la realidad te resulta difícil?" },
      ],
    },
  },

  /* ───────────────────────────── QUIRÓN ───────────────────────────── */
  quiron: {
    casas: {
      1: [
        { id: "quiron-casa1-1", texto: "¿Te cuesta mostrar quién eres realmente por miedo al rechazo?" },
        { id: "quiron-casa1-2", texto: "¿Sientes que debes demostrar constantemente tu valía?" },
        { id: "quiron-casa1-3", texto: "¿Te resulta difícil aceptar tu imagen o aspecto físico?" },
        { id: "quiron-casa1-4", texto: "¿Te cuesta iniciar proyectos por miedo a fracasar?" },
        { id: "quiron-casa1-5", texto: "¿Ayudar a personas que sufren te resulta algo muy natural?" },
      ],
      2: [
        { id: "quiron-casa2-1", texto: "¿Sientes que nunca tienes suficiente, aunque objetivamente estés bien?" },
        { id: "quiron-casa2-2", texto: "¿Te cuesta creer que mereces abundancia o prosperidad?" },
        { id: "quiron-casa2-3", texto: "¿Tu relación con el dinero suele generarte inseguridad?" },
        { id: "quiron-casa2-4", texto: "¿Te cuesta disfrutar plenamente de los placeres de la vida sin sentir culpa?" },
        { id: "quiron-casa2-5", texto: "¿Has sentido con frecuencia que no eres suficientemente valioso?" },
      ],
      3: [
        { id: "quiron-casa3-1", texto: "¿Te cuesta expresar lo que realmente piensas?" },
        { id: "quiron-casa3-2", texto: "¿Has sentido que los demás no te comprendían cuando intentabas comunicarte?" },
        { id: "quiron-casa3-3", texto: "¿Sueles explicar demasiado las cosas por miedo a no ser entendido?" },
        { id: "quiron-casa3-4", texto: "¿Has dudado de tu propia inteligencia o capacidad para aprender?" },
        { id: "quiron-casa3-5", texto: "¿Hay cosas importantes que nunca has contado porque te duelen demasiado?" },
      ],
      4: [
        { id: "quiron-casa4-1", texto: "¿Te cuesta sentir que realmente perteneces a un lugar o una familia?" },
        { id: "quiron-casa4-2", texto: "¿Te resulta difícil estar a solas contigo mismo durante mucho tiempo?" },
        { id: "quiron-casa4-3", texto: "¿Sueles mantenerte ocupado para evitar conectar con tu mundo interior?" },
        { id: "quiron-casa4-4", texto: "¿Has sentido que debías cuidar emocionalmente de otras personas antes que de ti?" },
        { id: "quiron-casa4-5", texto: "¿Te cuesta creer que mereces sentirte querido y protegido?" },
      ],
      5: [
        { id: "quiron-casa5-1", texto: "¿Te cuesta mostrar tu creatividad por miedo al juicio?" },
        { id: "quiron-casa5-2", texto: "¿Sientes vergüenza cuando eres el centro de atención?" },
        { id: "quiron-casa5-3", texto: "¿Te resulta difícil divertirte sin sentir culpa?" },
        { id: "quiron-casa5-4", texto: "¿Sientes que ocultas una parte importante de quien eres?" },
        { id: "quiron-casa5-5", texto: "¿Te nace especialmente ayudar a niños o personas vulnerables?" },
      ],
      6: [
        { id: "quiron-casa6-1", texto: "¿Sientes que hagas lo que hagas nunca es suficiente?" },
        { id: "quiron-casa6-2", texto: "¿La autocrítica forma parte habitual de tu forma de pensar?" },
        { id: "quiron-casa6-3", texto: "¿Te cuesta descansar sin sentir que deberías estar haciendo algo útil?" },
        { id: "quiron-casa6-4", texto: "¿Te preocupa mucho cometer errores?" },
        { id: "quiron-casa6-5", texto: "¿Te resulta natural cuidar o ayudar a otras personas?" },
      ],
      7: [
        { id: "quiron-casa7-1", texto: "¿Temes que las personas importantes terminen rechazándote o abandonándote?" },
        { id: "quiron-casa7-2", texto: "¿Te cuesta mantener relaciones equilibradas sin perderte en la otra persona?" },
        { id: "quiron-casa7-3", texto: "¿Sueles atraer parejas con heridas emocionales importantes?" },
        { id: "quiron-casa7-4", texto: "¿Tiendes a sabotear relaciones que estaban funcionando bien?" },
        { id: "quiron-casa7-5", texto: "¿Te resulta muy fácil comprender el dolor emocional de otras personas?" },
      ],
      8: [
        { id: "quiron-casa8-1", texto: "¿Te cuesta confiar plenamente en otra persona?" },
        { id: "quiron-casa8-2", texto: "¿El miedo a perder el control influye mucho en tus decisiones?" },
        { id: "quiron-casa8-3", texto: "¿Las experiencias más dolorosas de tu vida te han transformado profundamente?" },
        { id: "quiron-casa8-4", texto: "¿Te resulta difícil vivir la intimidad con total tranquilidad?" },
        { id: "quiron-casa8-5", texto: "¿Te interesan especialmente la psicología, la terapia o los procesos de transformación?" },
      ],
      9: [
        { id: "quiron-casa9-1", texto: "¿Has pasado por etapas de crisis respecto a tus creencias o al sentido de la vida?" },
        { id: "quiron-casa9-2", texto: "¿Te cuesta confiar plenamente en que la vida tiene un propósito?" },
        { id: "quiron-casa9-3", texto: "¿Sueles cuestionar las ideas o creencias que heredaste?" },
        { id: "quiron-casa9-4", texto: "¿Las experiencias de viaje o de estudio han cambiado profundamente tu forma de ver el mundo?" },
        { id: "quiron-casa9-5", texto: "¿Continúas buscando respuestas aunque a menudo acabes decepcionado?" },
      ],
      10: [
        { id: "quiron-casa10-1", texto: "¿Sientes que nunca logras el reconocimiento que mereces?" },
        { id: "quiron-casa10-2", texto: "¿Te cuesta creer que eres capaz de alcanzar tus metas?" },
        { id: "quiron-casa10-3", texto: "¿Has sentido que las expectativas de tu familia condicionaban tu camino?" },
        { id: "quiron-casa10-4", texto: "¿Tiendes a sabotear oportunidades importantes por inseguridad?" },
        { id: "quiron-casa10-5", texto: "¿Te nace ayudar a otras personas a descubrir su vocación o propósito?" },
      ],
      11: [
        { id: "quiron-casa11-1", texto: "¿Te has sentido diferente o fuera de lugar desde pequeño?" },
        { id: "quiron-casa11-2", texto: "¿Te cuesta sentir que perteneces a un grupo?" },
        { id: "quiron-casa11-3", texto: "¿El rechazo social ha dejado una huella importante en ti?" },
        { id: "quiron-casa11-4", texto: "¿Te duele especialmente el sufrimiento colectivo o las injusticias sociales?" },
        { id: "quiron-casa11-5", texto: "¿Prefieres estar solo antes que sentirte incomprendido?" },
      ],
      12: [
        { id: "quiron-casa12-1", texto: "¿Te cuesta comprender el origen de algunas de tus tristezas o miedos?" },
        { id: "quiron-casa12-2", texto: "¿Necesitas momentos de soledad para recuperar el equilibrio?" },
        { id: "quiron-casa12-3", texto: "¿Tiendes a cargar con problemas que no son realmente tuyos?" },
        { id: "quiron-casa12-4", texto: "¿Te cuesta soltar el control y confiar en la vida?" },
        { id: "quiron-casa12-5", texto: "¿Sientes que ayudar a otras personas forma parte de tu propósito?" },
      ],
    },
  },

  /* ─────────────────────────── NODO NORTE ─────────────────────────── */
  nodoNorte: {
    casas: {
      1: [
        { id: "nodoNorte-casa1-1", texto: "¿Te cuesta tomar decisiones sin buscar la aprobación de otras personas?" },
        { id: "nodoNorte-casa1-2", texto: "¿Sueles anteponer las necesidades de los demás a las tuyas?" },
        { id: "nodoNorte-casa1-3", texto: "¿Te resulta difícil saber qué quieres realmente para tu vida?" },
        { id: "nodoNorte-casa1-4", texto: "¿Te cuesta iniciar proyectos por tu cuenta?" },
        { id: "nodoNorte-casa1-5", texto: "¿Sientes que la vida te empuja a confiar más en ti mismo?" },
      ],
      2: [
        { id: "nodoNorte-casa2-1", texto: "¿Te cuesta sentirte seguro sin depender de otras personas o circunstancias?" },
        { id: "nodoNorte-casa2-2", texto: "¿Sientes que debes aprender a valorar más lo que ya tienes?" },
        { id: "nodoNorte-casa2-3", texto: "¿Te cuesta disfrutar del presente sin preocuparte por lo que falta?" },
        { id: "nodoNorte-casa2-4", texto: "¿Buscas construir una estabilidad económica por tus propios medios?" },
        { id: "nodoNorte-casa2-5", texto: "¿Sientes que la vida te invita a simplificar y dejar atrás el drama?" },
      ],
      3: [
        { id: "nodoNorte-casa3-1", texto: "¿Te esfuerzas por adaptar tu forma de comunicar según la persona que tienes delante?" },
        { id: "nodoNorte-casa3-2", texto: "¿Te cuesta escuchar sin sentir que ya conoces la respuesta?" },
        { id: "nodoNorte-casa3-3", texto: "¿Disfrutas compartiendo lo que aprendes con otras personas?" },
        { id: "nodoNorte-casa3-4", texto: "¿Sientes que la vida te pide expresar tu propia verdad?" },
        { id: "nodoNorte-casa3-5", texto: "¿Aprendes tanto enseñando como escuchando?" },
      ],
      4: [
        { id: "nodoNorte-casa4-1", texto: "¿Te cuesta dedicar tiempo a tu mundo emocional?" },
        { id: "nodoNorte-casa4-2", texto: "¿Sientes que necesitas construir un lugar donde sentirte realmente en casa?" },
        { id: "nodoNorte-casa4-3", texto: "¿Tiendes a cuidar de otras personas antes que de ti mismo?" },
        { id: "nodoNorte-casa4-4", texto: "¿Sientes que sanar tu historia familiar forma parte de tu camino?" },
        { id: "nodoNorte-casa4-5", texto: "¿La vida te empuja a conectar con tu niño interior?" },
      ],
      5: [
        { id: "nodoNorte-casa5-1", texto: "¿Te cuesta priorizar tus propios sueños por encima de las expectativas de los demás?" },
        { id: "nodoNorte-casa5-2", texto: "¿Sientes que has venido a desarrollar tu creatividad?" },
        { id: "nodoNorte-casa5-3", texto: "¿Tiendes a dejar proyectos creativos sin terminar?" },
        { id: "nodoNorte-casa5-4", texto: "¿Te cuesta mostrar lo que creas por miedo a que no sea perfecto?" },
        { id: "nodoNorte-casa5-5", texto: "¿Sientes que la vida te invita a seguir más tu corazón que al grupo?" },
      ],
      6: [
        { id: "nodoNorte-casa6-1", texto: "¿Te cuesta mantener hábitos que cuiden de tu cuerpo y tu salud?" },
        { id: "nodoNorte-casa6-2", texto: "¿Sientes que servir a otras personas da sentido a tu vida?" },
        { id: "nodoNorte-casa6-3", texto: "¿La vida te ha llevado a aprender a través de enfermedades o limitaciones?" },
        { id: "nodoNorte-casa6-4", texto: "¿Te cuesta encontrar equilibrio entre cuidar de los demás y cuidarte tú?" },
        { id: "nodoNorte-casa6-5", texto: "¿Sientes que desarrollar disciplina mejora tu bienestar?" },
      ],
      7: [
        { id: "nodoNorte-casa7-1", texto: "¿Te cuesta ceder cuando una relación requiere acuerdos?" },
        { id: "nodoNorte-casa7-2", texto: "¿Sientes que las relaciones son una parte importante de tu aprendizaje?" },
        { id: "nodoNorte-casa7-3", texto: "¿Te resulta difícil construir relaciones profundas y equilibradas?" },
        { id: "nodoNorte-casa7-4", texto: "¿Tiendes a priorizar tus propias necesidades antes que las de la pareja?" },
        { id: "nodoNorte-casa7-5", texto: "¿La vida te está enseñando a colaborar más con otras personas?" },
      ],
      8: [
        { id: "nodoNorte-casa8-1", texto: "¿Te cuesta confiar plenamente en otras personas?" },
        { id: "nodoNorte-casa8-2", texto: "¿Sientes que las crisis te obligan a transformarte?" },
        { id: "nodoNorte-casa8-3", texto: "¿La vida te invita a conocer mejor tus miedos y tu sombra?" },
        { id: "nodoNorte-casa8-4", texto: "¿Te resulta difícil pedir o aceptar ayuda de los demás?" },
        { id: "nodoNorte-casa8-5", texto: "¿Sientes que necesitas aprender a compartir más con otras personas?" },
      ],
      9: [
        { id: "nodoNorte-casa9-1", texto: "¿Sientes que necesitas encontrar tus propias creencias en lugar de aceptar las heredadas?" },
        { id: "nodoNorte-casa9-2", texto: "¿Los viajes o las experiencias nuevas han cambiado profundamente tu forma de pensar?" },
        { id: "nodoNorte-casa9-3", texto: "¿Prefieres aprender desde la experiencia antes que desde la teoría?" },
        { id: "nodoNorte-casa9-4", texto: "¿Sientes que la vida te invita a ampliar constantemente tu visión del mundo?" },
        { id: "nodoNorte-casa9-5", texto: "¿Buscas respuestas profundas sobre el sentido de la vida?" },
      ],
      10: [
        { id: "nodoNorte-casa10-1", texto: "¿Sientes que la vida te impulsa a desarrollar una vocación propia?" },
        { id: "nodoNorte-casa10-2", texto: "¿Te cuesta asumir plenamente tu autoridad o liderazgo?" },
        { id: "nodoNorte-casa10-3", texto: "¿Deseas dejar una aportación significativa en el mundo?" },
        { id: "nodoNorte-casa10-4", texto: "¿Sientes que tu desarrollo profesional forma parte de tu crecimiento personal?" },
        { id: "nodoNorte-casa10-5", texto: "¿Buscas liderar desde la responsabilidad más que desde el poder?" },
      ],
      11: [
        { id: "nodoNorte-casa11-1", texto: "¿Sientes que aportar algo al grupo o a la sociedad forma parte de tu camino?" },
        { id: "nodoNorte-casa11-2", texto: "¿Te cuesta dejar de buscar reconocimiento personal?" },
        { id: "nodoNorte-casa11-3", texto: "¿Disfrutas colaborando con personas que comparten tus ideales?" },
        { id: "nodoNorte-casa11-4", texto: "¿Sientes que la vida te invita a escuchar más a los demás?" },
        { id: "nodoNorte-casa11-5", texto: "¿Te resulta más importante ser auténtico que recibir aplausos?" },
      ],
      12: [
        { id: "nodoNorte-casa12-1", texto: "¿Sientes que desarrollar tu vida espiritual forma parte de tu camino?" },
        { id: "nodoNorte-casa12-2", texto: "¿Te cuesta aceptar que no todo puede controlarse?" },
        { id: "nodoNorte-casa12-3", texto: "¿Necesitas momentos de silencio o retiro para sentirte bien?" },
        { id: "nodoNorte-casa12-4", texto: "¿Sientes que la compasión es más importante que intentar resolver todos los problemas?" },
        { id: "nodoNorte-casa12-5", texto: "¿La vida te invita a confiar más y controlar menos?" },
      ],
    },
  },

  /* ──────────────────────────── NODO SUR ──────────────────────────── */
  nodoSur: {
    casas: {
      1: [
        { id: "nodoSur-casa1-1", texto: "¿Te cuesta tener en cuenta las necesidades de otras personas antes de tomar decisiones?" },
        { id: "nodoSur-casa1-2", texto: "¿Prefieres resolver los problemas por tu cuenta antes que colaborar?" },
        { id: "nodoSur-casa1-3", texto: "¿Te resulta difícil ceder el protagonismo?" },
        { id: "nodoSur-casa1-4", texto: "¿Sueles priorizar tu independencia por encima de las relaciones?" },
        { id: "nodoSur-casa1-5", texto: "¿Te cuesta pedir ayuda cuando la necesitas?" },
      ],
      2: [
        { id: "nodoSur-casa2-1", texto: "¿Te cuesta salir de situaciones que te dan seguridad aunque ya no te hagan feliz?" },
        { id: "nodoSur-casa2-2", texto: "¿La estabilidad económica influye mucho en tus decisiones?" },
        { id: "nodoSur-casa2-3", texto: "¿Te cuesta depender de otras personas?" },
        { id: "nodoSur-casa2-4", texto: "¿Prefieres controlar tus propios recursos antes que compartirlos?" },
        { id: "nodoSur-casa2-5", texto: "¿Evitas los cambios porque alteran tu sensación de seguridad?" },
      ],
      3: [
        { id: "nodoSur-casa3-1", texto: "¿Tu mente rara vez deja de pensar?" },
        { id: "nodoSur-casa3-2", texto: "¿Te cuesta profundizar en un tema antes de pasar al siguiente?" },
        { id: "nodoSur-casa3-3", texto: "¿Sueles repetir ideas aprendidas más que desarrollar las tuyas propias?" },
        { id: "nodoSur-casa3-4", texto: "¿Te resulta difícil permanecer en silencio o sin estímulos mentales?" },
        { id: "nodoSur-casa3-5", texto: "¿Tiendes a buscar información constantemente sin llegar a integrarla?" },
      ],
      4: [
        { id: "nodoSur-casa4-1", texto: "¿Te cuesta salir de la zona de confort que representa tu familia o tu hogar?" },
        { id: "nodoSur-casa4-2", texto: "¿Las decisiones familiares influyen mucho en tu vida?" },
        { id: "nodoSur-casa4-3", texto: "¿Sientes que el hogar es el único lugar donde realmente estás seguro?" },
        { id: "nodoSur-casa4-4", texto: "¿Te cuesta priorizar tu desarrollo personal frente a las necesidades de la familia?" },
        { id: "nodoSur-casa4-5", texto: "¿Te resulta difícil asumir riesgos que impliquen alejarte de lo conocido?" },
      ],
      5: [
        { id: "nodoSur-casa5-1", texto: "¿Necesitas sentirte especial o diferente para sentirte bien contigo mismo?" },
        { id: "nodoSur-casa5-2", texto: "¿Te cuesta aceptar que no siempre serás el centro de atención?" },
        { id: "nodoSur-casa5-3", texto: "¿Te resulta difícil recibir críticas sobre tus proyectos o creaciones?" },
        { id: "nodoSur-casa5-4", texto: "¿Tiendes a priorizar tu expresión personal antes que el trabajo en equipo?" },
        { id: "nodoSur-casa5-5", texto: "¿Te cuesta dejar espacio para que otras personas brillen?" },
      ],
      6: [
        { id: "nodoSur-casa6-1", texto: "¿Te cuesta descansar sin sentir que deberías estar haciendo algo útil?" },
        { id: "nodoSur-casa6-2", texto: "¿Tiendes a refugiarte en el trabajo o las obligaciones cuando algo te preocupa?" },
        { id: "nodoSur-casa6-3", texto: "¿Te resulta difícil confiar en aquello que no puedes explicar racionalmente?" },
        { id: "nodoSur-casa6-4", texto: "¿Prefieres resolver los problemas haciendo antes que sintiendo?" },
        { id: "nodoSur-casa6-5", texto: "¿Sientes que ayudar a los demás es una forma de evitar mirar tus propias necesidades?" },
      ],
      7: [
        { id: "nodoSur-casa7-1", texto: "¿Te cuesta tomar decisiones importantes sin consultar a otras personas?" },
        { id: "nodoSur-casa7-2", texto: "¿Te resulta incómodo estar solo durante largos periodos?" },
        { id: "nodoSur-casa7-3", texto: "¿Tiendes a adaptarte demasiado para no perder una relación?" },
        { id: "nodoSur-casa7-4", texto: "¿La opinión de tu pareja o de otras personas influye mucho en tus decisiones?" },
        { id: "nodoSur-casa7-5", texto: "¿Te cuesta priorizar tus propias necesidades en una relación?" },
      ],
      8: [
        { id: "nodoSur-casa8-1", texto: "¿Te cuesta confiar plenamente en tus propios recursos?" },
        { id: "nodoSur-casa8-2", texto: "¿Tiendes a depender emocional o económicamente de otras personas?" },
        { id: "nodoSur-casa8-3", texto: "¿Sientes que el drama aparece con frecuencia en tu vida?" },
        { id: "nodoSur-casa8-4", texto: "¿Te resulta difícil construir estabilidad por ti mismo?" },
        { id: "nodoSur-casa8-5", texto: "¿Te cuesta diferenciar entre lo que realmente necesitas y lo que simplemente deseas?" },
      ],
      9: [
        { id: "nodoSur-casa9-1", texto: "¿Te cuesta cuestionar creencias que consideras muy importantes?" },
        { id: "nodoSur-casa9-2", texto: "¿Necesitas sentir libertad para hacer las cosas a tu manera?" },
        { id: "nodoSur-casa9-3", texto: "¿Tiendes a buscar constantemente nuevas respuestas sin terminar de aplicar ninguna?" },
        { id: "nodoSur-casa9-4", texto: "¿Te cuesta aceptar puntos de vista muy diferentes al tuyo?" },
        { id: "nodoSur-casa9-5", texto: "¿Prefieres explorar nuevas ideas antes que ocuparte de los pequeños detalles cotidianos?" },
      ],
      10: [
        { id: "nodoSur-casa10-1", texto: "¿Buscas con frecuencia el reconocimiento por lo que haces?" },
        { id: "nodoSur-casa10-2", texto: "¿Te cuesta dejar de pensar en el trabajo o en tus objetivos?" },
        { id: "nodoSur-casa10-3", texto: "¿Sientes que tu valor depende de tus logros?" },
        { id: "nodoSur-casa10-4", texto: "¿Te resulta difícil desconectar de tus responsabilidades?" },
        { id: "nodoSur-casa10-5", texto: "¿Te cuesta aceptar una posición donde no tengas control o autoridad?" },
      ],
      11: [
        { id: "nodoSur-casa11-1", texto: "¿Te resulta más fácil seguir al grupo que mostrar tu verdadera individualidad?" },
        { id: "nodoSur-casa11-2", texto: "¿Necesitas sentir que perteneces a un grupo para sentirte bien?" },
        { id: "nodoSur-casa11-3", texto: "¿Tiendes a esconder partes de ti para encajar?" },
        { id: "nodoSur-casa11-4", texto: "¿Pasas mucho tiempo pensando en ideas o proyectos sin llevarlos a la práctica?" },
        { id: "nodoSur-casa11-5", texto: "¿Te cuesta priorizar tus propios deseos por encima de los del grupo?" },
      ],
      12: [
        { id: "nodoSur-casa12-1", texto: "¿Te cuesta desenvolverte en las responsabilidades del día a día?" },
        { id: "nodoSur-casa12-2", texto: "¿Tiendes a refugiarte en tu mundo interior cuando la realidad te resulta difícil?" },
        { id: "nodoSur-casa12-3", texto: "¿Te cuesta materializar tus ideas en acciones concretas?" },
        { id: "nodoSur-casa12-4", texto: "¿Prefieres la soledad antes que enfrentarte a ciertas situaciones del mundo?" },
        { id: "nodoSur-casa12-5", texto: "¿Sientes que conectar con la realidad práctica te exige un esfuerzo especial?" },
      ],
    },
  },

  /* ── El Ascendente no lleva casas: ES la cúspide de la casa 1.
        Los signos de Quirón y los Nodos no se escriben aquí: se derivan de sus
        casas, justo debajo. ── */
};

/* ─────────────────── Quirón y los Nodos: un solo texto ───────────────────
 *
 *  En estos tres arquetipos la pregunta de la casa vale igual para su signo
 *  equivalente, siguiendo la correspondencia natural del zodíaco:
 *
 *      casa 1 ↔ Aries · casa 2 ↔ Tauro · casa 3 ↔ Géminis · … · casa 12 ↔ Piscis
 *
 *  Así que sus preguntas de signo NO se escriben a mano: se derivan de las de
 *  casa. Se edita en un solo sitio (`casas`) y el eje de signo se actualiza solo.
 *  El id sí cambia —`quiron-casa1-1` para la casa, `quiron-aries-1` para el
 *  signo— porque son dos grupos estadísticos distintos y cada uno guarda su
 *  propio recuento. */

const SIGNO_DE_CASA = [
  "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo",
  "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis",
];

/** Trozo del id que identifica a cada signo (sin tildes). */
const SLUG_SIGNO: Record<string, string> = {
  Aries: "aries", Tauro: "tauro", "Géminis": "geminis", "Cáncer": "cancer",
  Leo: "leo", Virgo: "virgo", Libra: "libra", Escorpio: "escorpio",
  Sagitario: "sagitario", Capricornio: "capricornio", Acuario: "acuario", Piscis: "piscis",
};

function signosDesdeCasas(casas: PreguntasPorPosicion): PreguntasPorPosicion {
  const out: PreguntasPorPosicion = {};
  for (let casa = 1; casa <= 12; casa++) {
    const lista = casas[String(casa)];
    if (!lista?.length) continue;
    const signo = SIGNO_DE_CASA[casa - 1];
    out[signo] = lista.map((p) => ({
      ...p,
      id: p.id.replace(`-casa${casa}-`, `-${SLUG_SIGNO[signo]}-`),
    }));
  }
  return out;
}

for (const key of ["quiron", "nodoNorte", "nodoSur"] as const) {
  const arquetipo = PREGUNTAS_ESTUDIO[key];
  if (arquetipo?.casas) arquetipo.signos = signosDesdeCasas(arquetipo.casas);
}

/**
 * Las preguntas de un arquetipo para UNA posición concreta de esa persona:
 * su signo ("Leo") o su casa (5). Lo que no esté escrito devuelve lista vacía.
 */
export function preguntasDe(
  planeta: CuerpoKey,
  eje: Eje,
  posicion: string | number | undefined | null,
): PreguntaEstudio[] {
  if (posicion === undefined || posicion === null || posicion === "") return [];
  const arquetipo = PREGUNTAS_ESTUDIO[planeta];
  const mapa = eje === "signo" ? arquetipo?.signos : arquetipo?.casas;
  return mapa?.[String(posicion)] ?? [];
}

/** ¿Este arquetipo tiene alguna pregunta escrita? (para la portada) */
export function tienePreguntas(planeta: CuerpoKey): boolean {
  const a = PREGUNTAS_ESTUDIO[planeta];
  if (!a) return false;
  const listas = [...Object.values(a.signos ?? {}), ...Object.values(a.casas ?? {})];
  return listas.some((lista) => (lista?.length ?? 0) > 0);
}

/** Texto de una pregunta por su id (la pantalla de resultados solo guarda ids). */
export function textoPregunta(preguntaId: string): string {
  for (const arquetipo of Object.values(PREGUNTAS_ESTUDIO)) {
    for (const mapa of [arquetipo?.signos, arquetipo?.casas]) {
      for (const lista of Object.values(mapa ?? {})) {
        const p = lista?.find((q) => q.id === preguntaId);
        if (p) return p.texto;
      }
    }
  }
  return preguntaId;
}
