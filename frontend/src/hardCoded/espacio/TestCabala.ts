import type { SefiraKey } from "../../components/global/ArbolDeLaVida";

export interface TestOpcion {
  letra: "A" | "B" | "C" | "D";
  texto: string;
  puntos: number; // 3 = integrado, 2 = proceso, 1 = atención, 0 = bloqueado
}

export interface TestPregunta {
  id: string;
  pregunta: string;
  opciones: TestOpcion[];
}

export interface NivelResultado {
  etiqueta: string;
  rango: [number, number]; // [min, max] puntos
  mensaje: string;
  consejo: string;
}

export interface TestSefirot {
  sefiraKey: SefiraKey;
  nombre: string;
  subtitulo: string;
  introduccion: string;
  preguntas: TestPregunta[];
  niveles: [NivelResultado, NivelResultado, NivelResultado]; // [alto, medio, bajo]
}

export const testCabala: Record<SefiraKey, TestSefirot> = {

  // ══════════════════════════════════════════════
  //  1. KETHER — La Corona
  // ══════════════════════════════════════════════
  kether: {
    sefiraKey: "kether",
    nombre: "Kether",
    subtitulo: "La Corona · Propósito y Voluntad Divina",
    introduccion:
      "Kether es el primer destello de la existencia, la chispa primordial que precede a todo pensamiento y a toda forma. En el plano personal, habla de tu sentido de propósito, de tu conexión con algo mayor que tú y de la autenticidad que existe más allá de los roles que cumples.",
    preguntas: [
      {
        id: "kether_1",
        pregunta: "¿Sientes que hay un propósito detrás de lo que te ocurre en la vida?",
        opciones: [
          { letra: "A", texto: "Sí, vivo con una sensación clara de para qué estoy aquí", puntos: 3 },
          { letra: "B", texto: "A veces lo entreveo, pero se difumina en el día a día", puntos: 2 },
          { letra: "C", texto: "Busco ese propósito pero no lo encuentro todavía", puntos: 1 },
          { letra: "D", texto: "No lo sé, y esa incertidumbre me pesa profundamente", puntos: 0 },
        ],
      },
      {
        id: "kether_2",
        pregunta: "¿Cómo es tu relación con lo sagrado o con algo más grande que tú?",
        opciones: [
          { letra: "A", texto: "Me conecto con ello con regularidad; es parte de mi vida", puntos: 3 },
          { letra: "B", texto: "Siento algo, pero no sé muy bien cómo relacionarme con ello", puntos: 2 },
          { letra: "C", texto: "Lo busco, pero me resulta difícil de encontrar o de sentir", puntos: 1 },
          { letra: "D", texto: "No creo en ello o prefiero mantenerlo al margen", puntos: 0 },
        ],
      },
      {
        id: "kether_3",
        pregunta: "¿Hay algo en ti que sientes que es tuyo de verdad, más allá de los roles que cumples?",
        opciones: [
          { letra: "A", texto: "Sí, tengo una esencia que reconozco con claridad", puntos: 3 },
          { letra: "B", texto: "La intuyo, pero me cuesta distinguirla del ruido externo", puntos: 2 },
          { letra: "C", texto: "Me he identificado tanto con los roles que no sé quién soy sin ellos", puntos: 1 },
          { letra: "D", texto: "Prefiero no hacerme esa pregunta; me genera angustia", puntos: 0 },
        ],
      },
    ],
    niveles: [
      {
        etiqueta: "Corona activa",
        rango: [7, 9],
        mensaje: "Kether fluye con fuerza en ti. Tienes una conexión viva con tu propósito y con algo mayor que tú. Esa chispa primordial que eres se expresa de forma consciente en tu vida.",
        consejo: "Sigue nutriendo esa conexión. La práctica contemplativa —silencio, meditación, contemplación de la naturaleza— es el alimento de Kether.",
      },
      {
        etiqueta: "Buscando la corona",
        rango: [4, 6],
        mensaje: "Tienes destellos de conexión con Kether, pero hay momentos en que la cotidianidad los apaga. Tu propósito existe; a veces el ruido del mundo lo silencia.",
        consejo: "Dedica momentos de quietud a la pregunta: '¿Qué quiero realmente traer al mundo?' No busques la respuesta; deja que emerja.",
      },
      {
        etiqueta: "Kether te llama",
        rango: [0, 3],
        mensaje: "Kether te está invitando a conectar con algo más profundo que los roles y las obligaciones. No se trata de encontrar respuestas, sino de atreverse a hacer las preguntas.",
        consejo: "Keter nos recuerda que existe una voluntad mayor detrás de cada experiencia. Empieza preguntándote: '¿Qué haría si no tuviera miedo?' Esa respuesta es Kether.",
      },
    ],
  },

  // ══════════════════════════════════════════════
  //  2. CHOKMAH — La Sabiduría
  // ══════════════════════════════════════════════
  chokmah: {
    sefiraKey: "chokmah",
    nombre: "Chokmah",
    subtitulo: "La Sabiduría · Intuición e Impulso Creativo",
    introduccion:
      "Chokmah es el primer movimiento de la conciencia: el destello de la inspiración pura que precede al análisis. Habla de tu capacidad de confiar en tu intuición, de tu relación con la creatividad y de cómo das espacio a los proyectos que en ti quieren nacer.",
    preguntas: [
      {
        id: "chokmah_1",
        pregunta: "¿Confías en tu intuición y actúas en consecuencia?",
        opciones: [
          { letra: "A", texto: "Sí, la escucho y actúo en consecuencia con frecuencia", puntos: 3 },
          { letra: "B", texto: "La siento, pero luego la razón me convence de ignorarla", puntos: 2 },
          { letra: "C", texto: "No suelo distinguirla del miedo o del deseo", puntos: 1 },
          { letra: "D", texto: "Confío más en el análisis que en cualquier impulso interior", puntos: 0 },
        ],
      },
      {
        id: "chokmah_2",
        pregunta: "¿Qué ideas o proyectos llevas tiempo sintiendo que deberías comenzar y no comienzas?",
        opciones: [
          { letra: "A", texto: "Los tengo claros y estoy dando pasos, aunque lentos", puntos: 3 },
          { letra: "B", texto: "Los tengo claros pero el miedo o la duda me detiene", puntos: 2 },
          { letra: "C", texto: "Tengo la sensación de que algo quiere nacer, pero no sé qué es", puntos: 1 },
          { letra: "D", texto: "No siento ningún impulso creativo especial últimamente", puntos: 0 },
        ],
      },
      {
        id: "chokmah_3",
        pregunta: "¿De qué manera expresas tu impulso creativo en la vida cotidiana?",
        opciones: [
          { letra: "A", texto: "La expreso regularmente; crear es parte de cómo proceso el mundo", puntos: 3 },
          { letra: "B", texto: "La expreso a veces, pero me cuesta darle el espacio que merece", puntos: 2 },
          { letra: "C", texto: "La reprimo: no tengo tiempo, no soy creativo o no vale la pena", puntos: 1 },
          { letra: "D", texto: "Ni me lo he planteado; la creatividad no es algo que trabaje", puntos: 0 },
        ],
      },
    ],
    niveles: [
      {
        etiqueta: "Sabiduría activa",
        rango: [7, 9],
        mensaje: "Chokmah fluye con claridad en ti. Confías en tu intuición, das espacio a tus impulsos creativos y actúas desde la sabiduría instantánea que precede al análisis.",
        consejo: "Chokmah es el destello de sabiduría que precede al pensamiento. Tu primer impulso suele saber más de lo que crees. Sigue confiando en él.",
      },
      {
        etiqueta: "Sabiduría en proceso",
        rango: [4, 6],
        mensaje: "Tienes impulsos intuitivos y creativos, pero algo —el miedo, la duda, la razón— los filtra antes de que puedan expresarse. Hay más sabiduría en ti de la que actualmente dejas salir.",
        consejo: "Practica escuchar el primer impulso antes de analizarlo. Escríbelo. Actúa antes de pensar demasiado. La intuición se fortalece con el ejercicio.",
      },
      {
        etiqueta: "Chokmah te llama",
        rango: [0, 3],
        mensaje: "Chokmah te invita a reconectar con la dimensión espontánea de tu ser. La sabiduría no siempre llega con argumentos; a veces llega como un destello que hay que aprender a reconocer.",
        consejo: "Empieza por pequeñas decisiones: ¿qué pide mi primer impulso? No se trata de eliminar la razón, sino de escuchar también lo que sabe más profundo.",
      },
    ],
  },

  // ══════════════════════════════════════════════
  //  3. BINAH — El Entendimiento
  // ══════════════════════════════════════════════
  binah: {
    sefiraKey: "binah",
    nombre: "Binah",
    subtitulo: "El Entendimiento · Integración y Estructura",
    introduccion:
      "Binah es la gran madre que da forma a la sabiduría. Representa tu capacidad de integrar lo que aprendes y lo que vives, de dar estructura a la experiencia y de tolerar que las cosas maduren a su ritmo, sin necesitar resultados inmediatos.",
    preguntas: [
      {
        id: "binah_1",
        pregunta: "¿Puedes dar estructura a lo que aprendes? ¿Las experiencias te moldean realmente?",
        opciones: [
          { letra: "A", texto: "Aprendo, reflexiono e integro: las experiencias me transforman", puntos: 3 },
          { letra: "B", texto: "A veces integro, pero otras las experiencias pasan sin dejar huella real", puntos: 2 },
          { letra: "C", texto: "Acumulo información pero no la proceso ni la integro bien", puntos: 1 },
          { letra: "D", texto: "Voy tan rápido que rara vez me detengo a integrar nada", puntos: 0 },
        ],
      },
      {
        id: "binah_2",
        pregunta: "¿Puedes esperar que algo madure o necesitas resultados inmediatos?",
        opciones: [
          { letra: "A", texto: "Tengo paciencia genuina: entiendo que los procesos tienen su tiempo", puntos: 3 },
          { letra: "B", texto: "Soy paciente en general, pero la ansiedad puede más que yo a veces", puntos: 2 },
          { letra: "C", texto: "Me cuesta mucho esperar; necesito ver avances continuamente", puntos: 1 },
          { letra: "D", texto: "La impaciencia es uno de mis patrones más frecuentes", puntos: 0 },
        ],
      },
      {
        id: "binah_3",
        pregunta: "¿Hay algo que entiendes con la cabeza pero que aún no has integrado en tu vida?",
        opciones: [
          { letra: "A", texto: "No mucho: trato de vivir coherentemente lo que sé", puntos: 3 },
          { letra: "B", texto: "Sí, algunas cosas; trabajo conscientemente en ello", puntos: 2 },
          { letra: "C", texto: "Sí, bastante: hay una brecha importante entre lo que sé y lo que hago", puntos: 1 },
          { letra: "D", texto: "Esa brecha me genera conflicto; prefiero no pensar en ella", puntos: 0 },
        ],
      },
    ],
    niveles: [
      {
        etiqueta: "Entendimiento activo",
        rango: [7, 9],
        mensaje: "Binah opera con fluidez en ti. Integras lo que vives, tienes paciencia con los procesos y tu comprensión no se queda en la cabeza: baja a la vida.",
        consejo: "Sigue cultivando la reflexión periódica. Binah florece en el silencio, en el diario, en las conversaciones profundas que permiten ver lo aprendido desde fuera.",
      },
      {
        etiqueta: "Entendimiento en proceso",
        rango: [4, 6],
        mensaje: "Tienes capacidad de comprensión pero a veces la velocidad del día a día no te permite integrar lo que vives. Hay sabiduría acumulada en ti que aún no ha tomado forma.",
        consejo: "Crea pequeños rituales de reflexión: diez minutos al final del día para preguntarte qué aprendiste. Binah no pide horas; pide presencia.",
      },
      {
        etiqueta: "Binah te llama",
        rango: [0, 3],
        mensaje: "Binah te invita a parar. Cuando no somos capaces de aprender de nuestras experiencias, algo nos lo está impidiendo. Puede ser el ritmo, el miedo o la incomodidad de mirar hacia dentro.",
        consejo: "Empieza con una pregunta semanal: '¿Qué me ha enseñado esta semana?' No necesitas grandes respuestas; solo el hábito de preguntarte.",
      },
    ],
  },

  // ══════════════════════════════════════════════
  //  4. CHESED — La Misericordia
  // ══════════════════════════════════════════════
  chesed: {
    sefiraKey: "chesed",
    nombre: "Chesed",
    subtitulo: "La Misericordia · Generosidad y Amor Incondicional",
    introduccion:
      "Chesed es la fuerza expansiva del amor y la generosidad. Habla de tu capacidad de dar sin condiciones, de ser tan compasivo contigo mismo como con los demás, y de la posibilidad de recibir sin que ello te genere deuda o incomodidad.",
    preguntas: [
      {
        id: "chesed_1",
        pregunta: "¿Das con libertad o das esperando algo a cambio, aunque sea reconocimiento?",
        opciones: [
          { letra: "A", texto: "Doy desde la abundancia, sin expectativas reales", puntos: 3 },
          { letra: "B", texto: "Intento dar libremente, pero noto que a veces espero algo a cambio", puntos: 2 },
          { letra: "C", texto: "Me cuesta dar si no sé que habrá reciprocidad o valoración", puntos: 1 },
          { letra: "D", texto: "Suelo no darme cuenta de mis expectativas al dar; lo descubro después", puntos: 0 },
        ],
      },
      {
        id: "chesed_2",
        pregunta: "¿Eres tan generoso contigo mismo como lo eres con los demás?",
        opciones: [
          { letra: "A", texto: "Sí, me cuido con la misma atención y amor que cuido a otros", puntos: 3 },
          { letra: "B", texto: "Soy más generoso con los demás que conmigo mismo", puntos: 2 },
          { letra: "C", texto: "Me exijo mucho más de lo que le pediría a cualquier otra persona", puntos: 1 },
          { letra: "D", texto: "El autocuidado me parece egoísta o algo que no me merezco", puntos: 0 },
        ],
      },
      {
        id: "chesed_3",
        pregunta: "¿Puedes recibir con naturalidad? ¿Qué sientes cuando alguien te da algo?",
        opciones: [
          { letra: "A", texto: "Recibo con gratitud y naturalidad; me permite seguir el flujo", puntos: 3 },
          { letra: "B", texto: "Me cuesta un poco, pero puedo recibirlo con cierta gracia", puntos: 2 },
          { letra: "C", texto: "Me incomoda recibir: siento que debo devolver de inmediato", puntos: 1 },
          { letra: "D", texto: "Recibir me genera malestar, culpa o sensación de deuda", puntos: 0 },
        ],
      },
    ],
    niveles: [
      {
        etiqueta: "Misericordia activa",
        rango: [7, 9],
        mensaje: "Chesed fluye con generosidad en ti. Das desde la abundancia, te cuidas a ti mismo y puedes recibir sin que ello te genere conflicto. Eres un canal de amor que fluye en los dos sentidos.",
        consejo: "Chesed es la generosidad que fluye sin condiciones. Sigue observando si al dar sientes ligereza; esa ligereza es la señal de que Chesed opera en su forma más pura.",
      },
      {
        etiqueta: "Misericordia en proceso",
        rango: [4, 6],
        mensaje: "Tienes capacidad de dar y de cuidar, pero a veces el dar viene acompañado de expectativas sutiles, o te resulta más fácil dar que recibir. Hay una generosidad más libre esperando en ti.",
        consejo: "Observa esta semana cada vez que das. ¿Hay ligereza o hay expectativa? No para juzgarte, sino para reconocer el patrón. La consciencia ya es transformación.",
      },
      {
        etiqueta: "Chesed te llama",
        rango: [0, 3],
        mensaje: "Chesed te invita a explorar tu relación con la generosidad —tanto hacia fuera como hacia dentro. A veces bloqueamos el dar por miedo a perder, y bloqueamos el recibir por miedo a deber.",
        consejo: "Empieza por un gesto de generosidad hacia ti mismo esta semana. No esperes a merecerlo. Chesed no pone condiciones.",
      },
    ],
  },

  // ══════════════════════════════════════════════
  //  5. GEBURAH — La Severidad
  // ══════════════════════════════════════════════
  geburah: {
    sefiraKey: "geburah",
    nombre: "Geburah",
    subtitulo: "La Severidad · Límites, Poder y Discernimiento",
    introduccion:
      "Geburah es la fuerza disciplinada del poder y el juicio. No destruye por destruir: poda lo que agota para que pueda crecer lo que nutre. En el plano personal, habla de tu capacidad de poner límites, de soltar lo que ya no sirve y de ejercer el discernimiento sin exceso.",
    preguntas: [
      {
        id: "geburah_1",
        pregunta: "¿Qué necesitas eliminar de tu vida que sabes que ya no te sirve?",
        opciones: [
          { letra: "A", texto: "Tengo claridad sobre ello y estoy en proceso activo de soltarlo", puntos: 3 },
          { letra: "B", texto: "Lo sé, pero me cuesta actuar; el cambio me genera miedo o apego", puntos: 2 },
          { letra: "C", texto: "Lo intuyo pero no tengo el valor suficiente para hacer el corte", puntos: 1 },
          { letra: "D", texto: "Me aferro a lo conocido aunque me reste vitalidad o me cause daño", puntos: 0 },
        ],
      },
      {
        id: "geburah_2",
        pregunta: "¿Tienes dificultad para poner límites?",
        opciones: [
          { letra: "A", texto: "Pongo límites con claridad y sin culpa excesiva cuando es necesario", puntos: 3 },
          { letra: "B", texto: "Puedo ponerlos, pero me cuesta y a veces evito el conflicto que generan", puntos: 2 },
          { letra: "C", texto: "Me resulta muy difícil: temo herir, decepcionar o perder a las personas", puntos: 1 },
          { letra: "D", texto: "Mis límites son tan rígidos que me aíslan o alejan a quienes me rodean", puntos: 0 },
        ],
      },
      {
        id: "geburah_3",
        pregunta: "¿Dónde ejerces el juicio o la crítica de forma excesiva?",
        opciones: [
          { letra: "A", texto: "Tengo una capacidad de discernimiento sana, sin juicio desproporcionado", puntos: 3 },
          { letra: "B", texto: "A veces soy duro conmigo mismo, pero lo reconozco y lo trabajo", puntos: 2 },
          { letra: "C", texto: "La autoexigencia y la autocrítica son un patrón importante en mi vida", puntos: 1 },
          { letra: "D", texto: "Soy muy crítico con los demás; me cuesta la tolerancia ante el error ajeno", puntos: 0 },
        ],
      },
    ],
    niveles: [
      {
        etiqueta: "Severidad equilibrada",
        rango: [7, 9],
        mensaje: "Geburah opera con claridad en ti. Sabes soltar lo que ya no sirve, pones límites con valentía y tu juicio está al servicio del crecimiento, no de la destrucción.",
        consejo: "Gevurah no destruye por destruir. Poda lo que agota para que pueda crecer lo que nutre. Sigue ejerciendo ese discernimiento con conciencia.",
      },
      {
        etiqueta: "Geburah en proceso",
        rango: [4, 6],
        mensaje: "Tienes capacidad de juicio y de poner límites, pero a veces el miedo al conflicto o al abandono te detiene. Hay una valentía más completa esperando en ti.",
        consejo: "Un límite no es un muro; es una puerta con llave. Esta semana, identifica un lugar donde necesites poner uno y da el primer paso, aunque sea pequeño.",
      },
      {
        etiqueta: "Geburah te llama",
        rango: [0, 3],
        mensaje: "Geburah te invita a explorar tu relación con el poder, el límite y el soltar. Puede que estés cargando con demasiado —relaciones, hábitos, narrativas— que ya no te nutre.",
        consejo: "¿Qué necesitas eliminar de tu vida que sabes que ya no te sirve? Empieza por nombrarlo. Gevurah dice: 'No tengas miedo de podar. Lo que queda crece con más fuerza.'",
      },
    ],
  },

  // ══════════════════════════════════════════════
  //  6. TIPHARET — La Belleza
  // ══════════════════════════════════════════════
  tipharet: {
    sefiraKey: "tipharet",
    nombre: "Tiferet",
    subtitulo: "La Belleza · Armonía y Centro del Ser",
    introduccion:
      "Tiferet es el corazón del Árbol de la Vida y el centro del equilibrio entre todos los opuestos. Representa tu capacidad de mantenerte en el centro sin ser arrastrado por los extremos, la coherencia entre lo que piensas, sientes y haces, y tu conexión con lo que te produce belleza y significado.",
    preguntas: [
      {
        id: "tipharet_1",
        pregunta: "¿Hay armonía entre lo que piensas, lo que sientes y lo que haces en tu vida cotidiana?",
        opciones: [
          { letra: "A", texto: "Sí, generalmente hay coherencia entre los tres planos", puntos: 3 },
          { letra: "B", texto: "A veces; en situaciones de estrés pierdo esa coherencia con facilidad", puntos: 2 },
          { letra: "C", texto: "Pienso una cosa, siento otra y hago una tercera con frecuencia", puntos: 1 },
          { letra: "D", texto: "No me lo había planteado hasta ahora de esta manera", puntos: 0 },
        ],
      },
      {
        id: "tipharet_2",
        pregunta: "¿Con qué frecuencia vives momentos de belleza genuina o de significado real?",
        opciones: [
          { letra: "A", texto: "Lo tengo presente y lo busco activamente; es parte de mi cotidiano", puntos: 3 },
          { letra: "B", texto: "Lo reconozco cuando aparece, pero no lo busco de forma activa", puntos: 2 },
          { letra: "C", texto: "Raramente; la rutina me aleja de esa dimensión", puntos: 1 },
          { letra: "D", texto: "Me cuesta identificar qué me produce ese estado de plenitud", puntos: 0 },
        ],
      },
      {
        id: "tipharet_3",
        pregunta: "¿Eres capaz de mantenerte en el centro sin ser arrastrado por los extremos?",
        opciones: [
          { letra: "A", texto: "Generalmente mantengo el equilibrio incluso ante situaciones difíciles", puntos: 3 },
          { letra: "B", texto: "Puedo recuperar el centro, aunque me cueste tiempo y esfuerzo", puntos: 2 },
          { letra: "C", texto: "Los extremos me arrastran con facilidad: me apasiono o me deprimo", puntos: 1 },
          { letra: "D", texto: "Me pierdo en los extremos sin saber muy bien cómo volver", puntos: 0 },
        ],
      },
    ],
    niveles: [
      {
        etiqueta: "Belleza radiante",
        rango: [7, 9],
        mensaje: "Tiferet brilla con equilibrio en ti. Hay coherencia entre tu pensamiento, tu sentir y tu acción, y sabes encontrar el centro cuando los extremos tiran de ti.",
        consejo: "A veces pensamos una cosa, sentimos otra y hacemos una diferente. Tú has logrado acercar esos tres planos. Sigue nutriendo ese centro con belleza, silencio y presencia.",
      },
      {
        etiqueta: "Belleza en proceso",
        rango: [4, 6],
        mensaje: "Tu centro existe, pero hay momentos en que el estrés, los extremos o la rutina lo oscurecen. Tiferet no pide perfección; pide el deseo de volver.",
        consejo: "Identifica qué te devuelve al centro: ¿la naturaleza? ¿el movimiento? ¿el silencio? ¿la música? Hazlo accesible en tu día a día.",
      },
      {
        etiqueta: "Tiferet te llama",
        rango: [0, 3],
        mensaje: "Tiferet te invita a encontrar tu centro. Cuando hay mucha distancia entre lo que piensas, sientes y haces, la vida se vuelve fragmentada. La belleza es el lenguaje de lo integrado.",
        consejo: "Empieza por una pregunta simple al final de cada día: '¿He sido coherente hoy?' No para juzgarte, sino para comenzar a escuchar dónde está tu centro.",
      },
    ],
  },

  // ══════════════════════════════════════════════
  //  7. NETZACH — La Victoria
  // ══════════════════════════════════════════════
  netzach: {
    sefiraKey: "netzach",
    nombre: "Netzach",
    subtitulo: "La Victoria · Emociones, Deseo y Naturaleza",
    introduccion:
      "Netzach es la fuerza de los instintos, las emociones y la naturaleza. Representa tu relación con el mundo emocional: tu capacidad de sentir sin perderte en lo que sientes, de honrar tus deseos profundos y de tener espacio para el placer, el juego y la belleza sensorial.",
    preguntas: [
      {
        id: "netzach_1",
        pregunta: "¿Qué emociones te resultan más difíciles de sostener?",
        opciones: [
          { letra: "A", texto: "Puedo sostener mis emociones sin desbordamiento ni represión", puntos: 3 },
          { letra: "B", texto: "Algunas emociones me desbordan; otras las evito sistemáticamente", puntos: 2 },
          { letra: "C", texto: "Tiendo a reprimir las 'negativas': tristeza, rabia, miedo, vergüenza", puntos: 1 },
          { letra: "D", texto: "Las emociones me desbordan con frecuencia; vivo en los extremos", puntos: 0 },
        ],
      },
      {
        id: "netzach_2",
        pregunta: "¿Qué deseas profundamente, más allá de lo que crees que deberías desear?",
        opciones: [
          { letra: "A", texto: "Lo tengo claro y lo honro en mis elecciones de vida", puntos: 3 },
          { letra: "B", texto: "Lo intuyo, pero me da miedo reconocerlo o expresarlo", puntos: 2 },
          { letra: "C", texto: "Lo sé, pero me parece demasiado, imposible o egoísta pedirlo", puntos: 1 },
          { letra: "D", texto: "No estoy seguro de conocer mis deseos reales, separados del deber", puntos: 0 },
        ],
      },
      {
        id: "netzach_3",
        pregunta: "¿Tienes espacio real en tu vida para el placer, el juego y la belleza sensorial?",
        opciones: [
          { letra: "A", texto: "Sí, es parte fundamental de cómo nutro mi energía vital", puntos: 3 },
          { letra: "B", texto: "A veces, cuando lo permito; pero tiendo a posponerlo", puntos: 2 },
          { letra: "C", texto: "Casi no; lo considero secundario frente a las responsabilidades", puntos: 1 },
          { letra: "D", texto: "Me genera culpa disfrutar sin haber 'ganado' ese espacio antes", puntos: 0 },
        ],
      },
    ],
    niveles: [
      {
        etiqueta: "Victoria emocional",
        rango: [7, 9],
        mensaje: "Netzach fluye con vitalidad en ti. Tienes una relación honesta con tus emociones y tus deseos, y das espacio a la belleza y al placer como fuentes de energía, no como lujo.",
        consejo: "Netzach nos invita a sentir sin perdernos en lo que sentimos. Las emociones son mensajeras, no verdades absolutas. Sigue honrando ese canal.",
      },
      {
        etiqueta: "Netzach en proceso",
        rango: [4, 6],
        mensaje: "Tu mundo emocional está activo, pero hay emociones que te cuesta sostener y deseos que no te permites reconocer plenamente. Hay más vitalidad disponible de la que estás usando.",
        consejo: "Esta semana, elige una emoción que suelas evitar y simplemente obsérvala sin intentar cambiarla. Las emociones no piden solución; piden ser vistas.",
      },
      {
        etiqueta: "Netzach te llama",
        rango: [0, 3],
        mensaje: "Netzach te invita a reconectar con tu mundo emocional, con tus deseos profundos y con el placer de estar vivo. Cuando ignoramos estas fuerzas, se expresan de formas que no elegimos.",
        consejo: "Hazte esta pregunta: '¿Qué deseo realmente, más allá de lo que debo o debo querer?' No tienes que actuar sobre ello de inmediato; solo nómbralo con honestidad.",
      },
    ],
  },

  // ══════════════════════════════════════════════
  //  8. HOD — El Esplendor
  // ══════════════════════════════════════════════
  hod: {
    sefiraKey: "hod",
    nombre: "Hod",
    subtitulo: "El Esplendor · Comunicación y Poder del Lenguaje",
    introduccion:
      "Hod es la mente analítica y el lenguaje. Representa el poder de nombrar la realidad: lo que nombramos, lo reforzamos. Habla de la coherencia entre tus palabras y tus acciones, de cómo te comunicas cuando algo te duele, y de la historia que te cuentas sobre ti mismo.",
    preguntas: [
      {
        id: "hod_1",
        pregunta: "¿Hay coherencia entre lo que dices y lo que haces en tu vida?",
        opciones: [
          { letra: "A", texto: "Sí: mis palabras y mis acciones se alinean con bastante frecuencia", puntos: 3 },
          { letra: "B", texto: "Generalmente sí, aunque a veces prometo más de lo que cumplo", puntos: 2 },
          { letra: "C", texto: "A veces uso las palabras para aplazar decisiones o evitar la realidad", puntos: 1 },
          { letra: "D", texto: "Hay una brecha importante entre lo que digo que haré y lo que hago realmente", puntos: 0 },
        ],
      },
      {
        id: "hod_2",
        pregunta: "¿Cómo te comunicas cuando algo te duele o te incomoda?",
        opciones: [
          { letra: "A", texto: "Lo expreso con claridad y sin necesidad de herir ni exagerar", puntos: 3 },
          { letra: "B", texto: "Intento expresarlo, aunque no siempre encuentro las palabras justas", puntos: 2 },
          { letra: "C", texto: "Lo callo y lo proceso internamente; evito el conflicto que genera", puntos: 1 },
          { letra: "D", texto: "Cuando me duele, mi comunicación se vuelve reactiva o completamente cerrada", puntos: 0 },
        ],
      },
      {
        id: "hod_3",
        pregunta: "¿Qué historia te cuentas sobre ti mismo? ¿Te impulsa o te limita?",
        opciones: [
          { letra: "A", texto: "La narrativa que tengo sobre mí me da agencia y me impulsa a avanzar", puntos: 3 },
          { letra: "B", texto: "Tengo algunas creencias limitantes que reconozco y trabajo conscientemente", puntos: 2 },
          { letra: "C", texto: "La historia que me cuento me limita más de lo que me impulsa", puntos: 1 },
          { letra: "D", texto: "No me había planteado que me cuento una historia sobre mí mismo", puntos: 0 },
        ],
      },
    ],
    niveles: [
      {
        etiqueta: "Esplendor activo",
        rango: [7, 9],
        mensaje: "Hod opera con claridad en ti. Hay coherencia entre tus palabras y tus actos, te comunicas desde la honestidad y la historia que te cuentas sobre ti mismo te impulsa más de lo que te detiene.",
        consejo: "Hod es el poder del lenguaje. Lo que nombramos, lo reforzamos. Sigue siendo consciente de las palabras que usas sobre ti mismo y sobre el mundo.",
      },
      {
        etiqueta: "Hod en proceso",
        rango: [4, 6],
        mensaje: "Tienes capacidad comunicativa pero hay áreas donde la brecha entre palabras y hechos, o entre lo que sientes y lo que expresas, puede cerrarse más. El lenguaje que usas sobre ti mismo tiene más poder del que crees.",
        consejo: "Esta semana, observa qué palabras usas cuando hablas de ti mismo. ¿Son palabras de capacidad o de limitación? Cambia una frase limitante por una que refleje posibilidad.",
      },
      {
        etiqueta: "Hod te llama",
        rango: [0, 3],
        mensaje: "Hod te invita a examinar el lenguaje que usas contigo mismo y con los demás. Las palabras no solo describen la realidad: la construyen. ¿Qué realidad estás construyendo con las tuyas?",
        consejo: "Empieza por observar: ¿qué historia me cuento sobre mí mismo cuando algo sale mal? ¿Es una historia de aprendizaje o de condena? Hod dice: 'El primer paso es nombrar.'",
      },
    ],
  },

  // ══════════════════════════════════════════════
  //  9. YESOD — El Fundamento
  // ══════════════════════════════════════════════
  yesod: {
    sefiraKey: "yesod",
    nombre: "Yesod",
    subtitulo: "El Fundamento · Patrones, Inconsciente e Imagen de Uno Mismo",
    introduccion:
      "Yesod es el mundo de los sueños y el inconsciente. Representa los patrones que se repiten en tu vida, la imagen que tienes de ti mismo —heredada o construida— y el puente sutil entre lo que crees que eres y lo que realmente manifiestas.",
    preguntas: [
      {
        id: "yesod_1",
        pregunta: "¿Qué patrones se repiten en tu vida una y otra vez, aunque cambien los escenarios?",
        opciones: [
          { letra: "A", texto: "Los reconozco con claridad y trabajo activamente en ellos", puntos: 3 },
          { letra: "B", texto: "Los veo en retrospectiva, aunque en el momento me cuesta notarlos", puntos: 2 },
          { letra: "C", texto: "Los intuyo pero no acabo de entender de dónde vienen realmente", puntos: 1 },
          { letra: "D", texto: "No suelo conectar los eventos entre sí para ver patrones", puntos: 0 },
        ],
      },
      {
        id: "yesod_2",
        pregunta: "¿Qué imagen tienes de ti mismo que no te pertenece pero que has adoptado como real?",
        opciones: [
          { letra: "A", texto: "La tengo identificada y trabajo para desapegarme de ella", puntos: 3 },
          { letra: "B", texto: "Intuyo que hay creencias heredadas, pero no las he examinado bien", puntos: 2 },
          { letra: "C", texto: "Me cuesta distinguir quién soy de lo que me dijeron que soy", puntos: 1 },
          { letra: "D", texto: "No me lo había planteado de esa manera hasta ahora", puntos: 0 },
        ],
      },
      {
        id: "yesod_3",
        pregunta: "¿Cómo es tu relación con tu vida interior —sueños, imaginación, intuición?",
        opciones: [
          { letra: "A", texto: "Les presto atención: son una fuente valiosa de información sobre mí", puntos: 3 },
          { letra: "B", texto: "A veces, pero no tengo una práctica o atención verdaderamente consciente", puntos: 2 },
          { letra: "C", texto: "Los ignoro habitualmente; vivo muy orientado al mundo exterior", puntos: 1 },
          { letra: "D", texto: "Me generan inquietud o los descarto como irrelevantes", puntos: 0 },
        ],
      },
    ],
    niveles: [
      {
        etiqueta: "Fundamento consciente",
        rango: [7, 9],
        mensaje: "Yesod opera con lucidez en ti. Reconoces los patrones que configuran tu vida, has examinado la imagen que tienes de ti mismo y cultivas tu mundo interior como fuente de información.",
        consejo: "Lo que se repite no es mala suerte: es un patrón que pide ser visto. Tú ya lo has aprendido. Sigue trabajando con esa mirada hacia las capas más profundas.",
      },
      {
        etiqueta: "Yesod en proceso",
        rango: [4, 6],
        mensaje: "Tienes conciencia de algunos patrones y de tu mundo interior, pero hay capas que aún no has explorado. Hay más material inconsciente trabajando en ti del que actualmente tienes acceso.",
        consejo: "Presta atención esta semana a lo que sueñas, a lo que te irrita desproporcionadamente o a lo que te toca sin saber por qué. Yesod habla en esas frecuencias.",
      },
      {
        etiqueta: "Yesod te llama",
        rango: [0, 3],
        mensaje: "Yesod te invita a mirar lo que opera debajo de la superficie. Lo que se repite en tu vida no es coincidencia: es algo que quiere ser reconocido. El primer paso es la disposición a mirar.",
        consejo: "¿Qué patrones se repiten en tu vida una y otra vez, aunque cambien los escenarios o las personas? Escríbelo. No busques la causa todavía; solo nómbralo. Yesod trabaja desde ahí.",
      },
    ],
  },

  // ══════════════════════════════════════════════
  //  10. MALKUTH — El Reino
  // ══════════════════════════════════════════════
  malkuth: {
    sefiraKey: "malkuth",
    nombre: "Malkuth",
    subtitulo: "El Reino · Cuerpo, Tierra y Manifestación",
    introduccion:
      "Malkuth es el mundo material y la experiencia física. Lo espiritual se manifiesta aquí o no se manifiesta en ningún sitio. Habla de tu relación con tu cuerpo, con tu entorno físico y con lo que estás creando concretamente en tu vida.",
    preguntas: [
      {
        id: "malkuth_1",
        pregunta: "¿Cómo es tu relación con tu cuerpo? ¿Lo cuidas, lo escuchas?",
        opciones: [
          { letra: "A", texto: "Lo cuido con atención: lo escucho, lo alimento y lo muevo con conciencia", puntos: 3 },
          { letra: "B", texto: "A veces lo cuido; otras lo ignoro o lo llevo al límite sin darme cuenta", puntos: 2 },
          { letra: "C", texto: "Tiendo a ignorarlo a menos que enferme o me dé señales urgentes", puntos: 1 },
          { letra: "D", texto: "Tengo una relación conflictiva con mi cuerpo: lo critico, lo castigo o lo descuido", puntos: 0 },
        ],
      },
      {
        id: "malkuth_2",
        pregunta: "¿Tu entorno físico —tu casa, tu espacio, tu orden— refleja cómo te sientes por dentro?",
        opciones: [
          { letra: "A", texto: "Sí: mi entorno es un reflejo ordenado y cuidado de mi estado interior", puntos: 3 },
          { letra: "B", texto: "Más o menos; hay zonas de mi vida que cuido y otras que descuido", puntos: 2 },
          { letra: "C", texto: "Mi espacio refleja el caos o el agotamiento que a veces siento dentro", puntos: 1 },
          { letra: "D", texto: "No me había fijado en esa conexión entre espacio exterior e interior", puntos: 0 },
        ],
      },
      {
        id: "malkuth_3",
        pregunta: "¿Lo que se manifiesta en tu vida material es lo que realmente quieres crear?",
        opciones: [
          { letra: "A", texto: "Sí, hay coherencia entre lo que quiero y lo que estoy construyendo", puntos: 3 },
          { letra: "B", texto: "Hay partes que sí y partes que no; estoy en transición consciente", puntos: 2 },
          { letra: "C", texto: "Lo que se manifiesta no refleja lo que quiero; hay una brecha importante", puntos: 1 },
          { letra: "D", texto: "No me siento con agencia real sobre lo que se manifiesta en mi vida", puntos: 0 },
        ],
      },
    ],
    niveles: [
      {
        etiqueta: "Reino habitado",
        rango: [7, 9],
        mensaje: "Malkuth vive con plenitud en ti. Cuidas tu cuerpo, tu entorno refleja tu estado interior y hay coherencia entre lo que quieres y lo que manifiestas. Lo espiritual se hace visible en lo concreto.",
        consejo: "Malkhut es el cuerpo, la tierra, lo concreto. Lo espiritual se manifiesta aquí o no se manifiesta en ningún sitio. Sigue honrando ese puente entre lo invisible y lo tangible.",
      },
      {
        etiqueta: "Malkuth en proceso",
        rango: [4, 6],
        mensaje: "Tienes conciencia de tu dimensión material, pero hay áreas —el cuerpo, el espacio o la manifestación— donde la coherencia podría ser mayor. Lo que creas en el exterior refleja lo que vive en el interior.",
        consejo: "Esta semana, elige un pequeño acto de cuidado hacia tu cuerpo o tu espacio. No esperes a tener tiempo: Malkuth se nutre de gestos concretos, no de grandes planes.",
      },
      {
        etiqueta: "Malkuth te llama",
        rango: [0, 3],
        mensaje: "Malkuth te invita a volver a lo concreto: al cuerpo, al espacio, a lo que tocas y pisas. La espiritualidad sin tierra no se sostiene. Lo que ocurre en tu vida material es siempre un mensaje.",
        consejo: "¿Tu cuerpo, tu casa, tu vida cotidiana reflejan quién quieres ser? Empieza por lo más pequeño y más tangible. Un espacio ordenado, una comida preparada con cuidado, diez minutos de movimiento: eso es Malkuth.",
      },
    ],
  },
};
