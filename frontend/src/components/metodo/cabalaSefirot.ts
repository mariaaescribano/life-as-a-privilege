import type { SefiraKey } from "../global/ArbolDeLaVida";

// Claves de las páginas del recorrido = las 10 sefirot del Árbol + Da'at (la
// sefirá oculta, que aquí tratamos como una dimensión más, numerada). Da'at no
// tiene nodo en el Árbol: se llega con las flechas (Binah → Da'at → Chesed).
export type CabalaPageKey = SefiraKey | "daat";

// ─────────────────────────────────────────────────────────────────────────
// Contenido del recorrido de CÁBALA: una página por sefirá (dimensión).
// El orden de las páginas del recorrido es: 1) Intro, 2) Árbol de la Vida,
// 3..12) las 10 sefirot por su `numero`. De ahí el pageLabel "3/12" para Kéter.
//
// Solo Kéter está redactada por completo; el resto son stubs con la estructura
// lista para rellenar (los boxes vacíos no se pintan). Este objeto ES el
// esqueleto común a todas las sefirot.
// ─────────────────────────────────────────────────────────────────────────

export interface BloqueLista {
  /** Frase introductoria del box (opcional). */
  intro?: string;
  items: string[];
  /** Sub-bloque opcional con su propio encabezado (p.ej. Guevurá: el desequilibrio
   *  por defecto y, aparte, "En el extremo opuesto, un exceso puede manifestarse…"). */
  extra?: { intro?: string; items: string[] };
}

// Box "Ejercicio" (opcional): actividad interactiva de dos columnas editables.
export interface EjercicioColumna {
  titulo: string;
  descripcion: string;
}
export interface Ejercicio {
  /** Subtítulo del ejercicio (p.ej. "Separar hechos e interpretaciones"). */
  titulo: string;
  /** Consigna inicial. */
  intro: string;
  /** Modo A — columnas editables (p.ej. Hechos / Interpretaciones). */
  columnas?: EjercicioColumna[];
  /** Modo B — lista de prompts, cada uno con su propio campo de respuesta. */
  prompts?: string[];
  /** Texto antes de los prompts (p.ej. "Escribe:"). */
  promptsIntro?: string;
  /** Texto antes de las preguntas de cierre (p.ej. "Al terminar, pregúntate:"). */
  cierreIntro?: string;
  cierrePreguntas?: string[];
  /** Frase(s) final(es) que explican para qué sirve el ejercicio. */
  footer?: string | string[];
}

// Nota con "asterisco" (*) opcional: un marcador clicable junto a la frase que
// abre un popup con contenido ampliado (p.ej. Tiferet → estudios sobre el corazón).
export interface NotaEstudios {
  titulo: string;
  parrafos: string[];
}

export interface SefiraContenido {
  key: CabalaPageKey;
  numero: number;       // 1-11, para el "1." del header
  titulo: string;       // "Keter"
  /** Frase que aparece bajo el header. */
  frase: string;
  /** Nota opcional: pinta un asterisco junto a la frase que abre un popup. */
  nota?: NotaEstudios;
  /** Párrafos del primer box (carrusel con flechas, sobre imagen de Cábala). */
  intro: string[];
  equilibrado: BloqueLista;
  desequilibrado: BloqueLista;
  preguntas: BloqueLista;
  /** Box "Ejercicio" interactivo (opcional). */
  ejercicio?: Ejercicio;
  autoevaluacion: BloqueLista;
  /** Párrafos del box "Clave de desarrollo". */
  clave: string[];
}

// Nº total de páginas del recorrido (Intro + Árbol + 10 sefirot + Da'at).
export const CABALA_TOTAL_PAGINAS = 13;

const stub = (key: CabalaPageKey, numero: number, titulo: string): SefiraContenido => ({
  key,
  numero,
  titulo,
  frase: "",
  intro: [],
  equilibrado: { items: [] },
  desequilibrado: { items: [] },
  preguntas: { items: [] },
  autoevaluacion: { items: [] },
  clave: [],
});

const KETER: SefiraContenido = {
  key: "kether",
  numero: 1,
  titulo: "Keter",
  frase: "¿En quién quieres convertirte y desde qué verdad quieres vivir?",
  intro: [
    "Kéter representa la capacidad de vivir orientado por un propósito que trasciende los deseos inmediatos del ego.",
    "No se trata de elegir una profesión, alcanzar una meta o construir una identidad. Se trata de descubrir el principio desde el cual quieres vivir.",
    "Sin una orientación clara, incluso el talento, la disciplina o el conocimiento pueden ponerse al servicio de objetivos que no generan verdadera plenitud.",
  ],
  equilibrado: {
    intro: "Una persona con un Kéter fuerte suele:",
    items: [
      "Tiene claridad sobre los principios que guían su vida.",
      "Sus decisiones mantienen coherencia incluso cuando son difíciles.",
      "No necesita demostrar constantemente su valor.",
      "Tolera mejor la incertidumbre porque sabe hacia dónde camina.",
      "Experimenta un sentido de significado en lo que hace.",
      "Prioriza lo importante sobre lo urgente.",
    ],
  },
  desequilibrado: {
    intro: "Cuando esta dimensión pierde fuerza, es común observar:",
    items: [
      "Necesidad constante de reconocimiento.",
      "Vivir comparándose con otros.",
      "Sentir que nunca es suficiente.",
      "Cambiar frecuentemente de rumbo buscando satisfacción.",
      "Perseguir logros que, una vez alcanzados, dejan vacío.",
      "Construir una identidad basada en la imagen más que en la esencia.",
    ],
  },
  preguntas: {
    items: [
      "¿Qué principios son innegociables para mí?",
      "¿Qué decisiones recientes reflejan realmente esos principios?",
      "¿Cuánto de mi esfuerzo busca reconocimiento?",
      "¿Qué haría si dejara de preocuparme por la opinión de los demás?",
      "¿Qué tipo de persona quiero ser más allá de lo que logro?",
      "¿Qué actividades me hacen sentir profundamente alineado conmigo mismo?",
      "¿Qué parte de mi vida hoy no está al servicio de lo que considero esencial?",
    ],
  },
  autoevaluacion: {
    intro: "Valora cada afirmación del 1 (nunca) al 10 (siempre):",
    items: [
      "Tengo claro qué principios orientan mi vida.",
      "Mis decisiones reflejan esos principios.",
      "No necesito demostrar constantemente mi valor.",
      "Encuentro sentido en lo que hago.",
      "Mi propósito guía mis prioridades diarias.",
    ],
  },
  clave: [
    "Kéter no se fortalece haciendo más, sino recordando constantemente por qué haces lo que haces.",
    "Cada vez que una decisión nace de la coherencia en lugar de la necesidad de validación, esta dimensión se fortalece. No consiste en alcanzar una versión ideal de uno mismo, sino en volver, una y otra vez, a aquello que reconoces como verdadero y esencial.",
  ],
};

const CHOKHMAH: SefiraContenido = {
  key: "chokmah",
  numero: 2,
  titulo: "Chokhmah",
  frase: "¿Soy capaz de ver la realidad tal como es?",
  intro: [
    "Jojmá es la capacidad de percibir la realidad con claridad, antes de que nuestras creencias, emociones o experiencias pasadas la transformen en una interpretación.",
    "Cultivar Jojmá implica aprender a detener el impulso de reaccionar automáticamente para observar con apertura, curiosidad y honestidad.",
    "Es una habilidad que permite responder a la vida desde la comprensión, en lugar de hacerlo desde el miedo, la costumbre o las heridas del pasado.",
  ],
  equilibrado: {
    intro: "Una persona con una buena capacidad de percepción suele:",
    items: [
      "Observa los hechos antes de sacar conclusiones.",
      "Escucha con apertura diferentes perspectivas.",
      "Reconoce cuándo una emoción está influyendo en su interpretación.",
      "Tolera la incertidumbre sin apresurarse a encontrar respuestas.",
      "Aprende de las experiencias en lugar de reaccionar impulsivamente.",
      "Es capaz de cambiar de opinión cuando aparecen nuevos elementos.",
    ],
  },
  desequilibrado: {
    intro: "Cuando esta dimensión está poco desarrollada es frecuente:",
    items: [
      "Sacar conclusiones precipitadas.",
      "Asumir intenciones sin verificarlas.",
      "Reaccionar desde experiencias pasadas más que desde la situación presente.",
      "Justificar automáticamente las propias creencias.",
      "Interpretar los hechos desde el miedo, el orgullo o la inseguridad.",
      "Tener dificultad para reconocer otros puntos de vista.",
    ],
  },
  preguntas: {
    items: [
      "¿Qué hechos objetivos describen esta situación?",
      "¿Qué parte de mi reacción proviene de experiencias pasadas?",
      "¿Qué estoy dando por hecho sin tener evidencia?",
      "¿Qué otra explicación podría existir?",
      "¿Qué emoción está influyendo en mi manera de ver esta situación?",
      "¿Qué aprendería si dejara de defender mi primera interpretación?",
      "¿Estoy respondiendo a la realidad o a una historia que mi mente ha construido?",
    ],
  },
  ejercicio: {
    titulo: "Separar hechos e interpretaciones",
    intro: "Piensa en una situación reciente que haya generado una emoción intensa.",
    columnas: [
      {
        titulo: "Hechos",
        descripcion: "Escribe únicamente aquello que cualquier persona presente podría haber observado.",
      },
      {
        titulo: "Interpretaciones",
        descripcion: "Anota todo lo que asumiste, imaginaste o concluiste sobre esa situación.",
      },
    ],
    cierreIntro: "Al terminar, pregúntate:",
    cierrePreguntas: [
      "¿Cuánto de mi malestar proviene de los hechos?",
      "¿Cuánto proviene de la historia que construí?",
      "¿Qué cambia si observo nuevamente la situación desde los hechos?",
    ],
    footer: "Este ejercicio desarrolla la capacidad de distinguir entre percepción e interpretación, fortaleciendo una mirada más consciente.",
  },
  autoevaluacion: {
    intro: "Valora cada afirmación del 1 (nunca) al 10 (siempre):",
    items: [
      "Antes de reaccionar, procuro observar los hechos.",
      "Soy capaz de distinguir entre lo que ocurrió y lo que interpreto.",
      "Reconozco cuándo mis emociones afectan mi percepción.",
      "Escucho otras perspectivas con apertura.",
      "Estoy dispuesto a revisar mis conclusiones cuando aparece nueva información.",
    ],
  },
  clave: [
    "Cada vez que haces una pausa antes de reaccionar, cuestionas tus primeras conclusiones o permites que los hechos hablen antes que tus suposiciones, fortaleces esta dimensión.",
    "Desarrollar Jojmá es aprender a mirar el mundo con menos filtros y más presencia. Desde esa claridad, las decisiones dejan de estar guiadas por el impulso y comienzan a apoyarse en una comprensión más profunda y consciente de la realidad.",
  ],
};

// Orden del recorrido = por `numero`. Kéter (1) primero.
const BINAH: SefiraContenido = {
  key: "binah",
  numero: 3,
  titulo: "Binah",
  frase: "¿Cómo incorporo esa verdad para estructurar mi forma de ver el mundo?",
  intro: [
    "Biná es la capacidad de transformar una experiencia en comprensión profunda.",
    "Todos interpretamos la realidad a través de modelos mentales construidos por nuestra historia, nuestra educación y nuestras experiencias. Estos modelos nos ayudan a dar sentido a lo que vivimos, pero también pueden convertirse en límites invisibles cuando dejamos de cuestionarlos.",
    "Desarrollar esta dimensión implica dejar de acumular información y comenzar a convertir la experiencia en sabiduría. Significa aprender de lo que vivimos, en lugar de repetirlo inconscientemente.",
    "Comprender no significa justificar todo lo que ocurre, sino darle un lugar dentro de nuestra historia para que deje de gobernarnos desde el inconsciente.",
  ],
  equilibrado: {
    intro: "Una persona con una buena capacidad de integración:",
    items: [
      "Aprende de sus experiencias, incluso de las difíciles.",
      "Reconoce los patrones que se repiten en su vida.",
      "Está dispuesta a revisar sus creencias cuando descubre nueva información.",
      "Tolera la complejidad sin buscar respuestas simplistas.",
      "Comprende que puede cambiar la forma en que interpreta su historia.",
      "Convierte los errores en oportunidades de aprendizaje.",
    ],
  },
  desequilibrado: {
    intro: "Cuando esta dimensión está poco desarrollada es frecuente:",
    items: [
      "Repetir los mismos conflictos sin comprender su origen.",
      "Aferrarse a creencias que ya no reflejan la realidad.",
      "Sobreanalizar sin generar cambios reales.",
      "Culpar siempre a factores externos o internos sin integrar lo ocurrido.",
      "Vivir condicionado por experiencias pasadas que nunca fueron procesadas.",
      "Buscar explicaciones para todo sin permitir que la experiencia transforme la manera de vivir.",
    ],
  },
  preguntas: {
    items: [
      "¿Qué patrón se ha repetido varias veces en mi vida?",
      "¿Qué aprendizaje aún no he integrado de esa experiencia?",
      "¿Qué creencia sobre mí o sobre los demás podría necesitar ser revisada?",
      "¿Qué interpretación sigo manteniendo porque me resulta familiar, aunque ya no me ayude?",
      "¿Qué me está enseñando esta situación sobre mí mismo?",
      "¿Qué nueva comprensión podría abrir una forma diferente de actuar?",
    ],
  },
  ejercicio: {
    titulo: "Descubriendo el patrón",
    intro: "Piensa en una situación que se haya repetido en diferentes momentos de tu vida.",
    promptsIntro: "Escribe:",
    prompts: [
      "¿Qué ocurrió?",
      "¿Qué sentí?",
      "¿Cómo reaccioné?",
      "¿Qué significado le di en ese momento?",
      "¿Qué patrón encuentro al compararlo con experiencias similares?",
      "¿Qué comprensión nueva puedo integrar hoy?",
    ],
    footer: "El objetivo no es encontrar culpables, sino descubrir el aprendizaje que permita romper el ciclo.",
  },
  autoevaluacion: {
    intro: "Valora cada afirmación del 1 (nunca) al 10 (siempre):",
    items: [
      "Reflexiono sobre mis experiencias para aprender de ellas.",
      "Identifico patrones que se repiten en mi vida.",
      "Estoy dispuesto a cuestionar mis propias creencias.",
      "Transformo los errores en oportunidades de crecimiento.",
      "Mis experiencias amplían mi manera de comprender el mundo.",
    ],
  },
  clave: [
    "Desarrollar Biná es construir una mente más flexible, amplia y consciente. Una mente capaz de integrar la verdad sin quedar atrapada en las interpretaciones del pasado, permitiendo que cada experiencia contribuya a una comprensión más profunda de quién eres y de cómo eliges vivir.",
  ],
};

const DAAT: SefiraContenido = {
  key: "daat",
  numero: 4,
  titulo: "Da'at",
  frase: "¿Cómo hago para no olvidarme de la verdad cuando la emoción toma el control?",
  intro: [
    "Conocer una verdad no garantiza que podamos vivirla. Da'at representa el puente entre comprender algo y actuar desde esa comprensión, especialmente cuando aparecen el estrés, el miedo, la frustración o la presión.",
    "Una persona con esta dimensión desarrollada no actúa correctamente porque nunca se equivoque, sino porque logra recordar quién quiere ser justo en los momentos en que sería más fácil actuar por impulso.",
    "Cada vez que olvidamos nuestros valores frente a una emoción intensa, reforzamos antiguos patrones. Cada vez que recordamos actuar desde la conciencia, fortalecemos nuevas formas de vivir.",
  ],
  equilibrado: {
    intro: "Una persona con un Da'at fortalecido:",
    items: [
      "Actúa de acuerdo con sus valores incluso en situaciones difíciles.",
      "Mantiene la presencia cuando aparecen emociones intensas.",
      "Aprende de sus errores sin volver a repetirlos constantemente.",
      "Es coherente entre lo que piensa, siente y hace.",
      "Convierte los aprendizajes en hábitos estables.",
      "Recupera rápidamente su centro después de una dificultad.",
    ],
  },
  desequilibrado: {
    intro: "Cuando esta dimensión necesita fortalecerse es frecuente:",
    items: [
      "Saber qué hacer, pero actuar de otra manera.",
      "Repetir patrones que ya se habían identificado.",
      "Perder claridad cuando aparecen emociones intensas.",
      "Abandonar fácilmente hábitos importantes.",
      "Sentir que siempre se vuelve al mismo punto.",
      "Experimentar una brecha constante entre intención y comportamiento.",
    ],
  },
  preguntas: {
    items: [
      "¿Qué verdad importante conozco, pero aún no vivo con constancia?",
      "¿En qué situaciones suelo olvidar mis valores?",
      "¿Qué emoción hace que pierda conexión conmigo mismo?",
      "¿Qué patrón sigo repitiendo a pesar de haberlo comprendido?",
      "¿Qué pequeño compromiso podría sostener incluso en los días difíciles?",
      "¿Qué necesito recordar cuando actúo en piloto automático?",
    ],
  },
  ejercicio: {
    titulo: "Recordar antes de reaccionar",
    intro: "Piensa en una situación en la que habitualmente reaccionas de forma impulsiva.",
    promptsIntro: "Escribe:",
    prompts: [
      "¿Qué suele ocurrir?",
      "¿Qué emoción aparece primero?",
      "¿Qué sé que sería una respuesta más alineada con mis valores?",
      "¿Qué me hace olvidar esa respuesta en el momento?",
      "¿Qué recordatorio concreto podría ayudarme a actuar de otra manera?",
    ],
    footer: [
      "Durante la próxima semana, utiliza ese recordatorio antes de enfrentar una situación similar. Al finalizar cada día, reflexiona sobre si lograste mantenerte conectado con la persona que deseas ser.",
      "El objetivo no es hacerlo perfecto, sino entrenar la capacidad de recordar conscientemente.",
    ],
  },
  autoevaluacion: {
    intro: "Valora cada afirmación del 1 (nunca) al 10 (siempre):",
    items: [
      "Actúo de acuerdo con mis valores incluso bajo presión.",
      "Mantengo presentes mis aprendizajes cuando enfrento dificultades.",
      "Transformo mis conocimientos en hábitos concretos.",
      "Identifico rápidamente cuando estoy actuando en piloto automático.",
      "Recupero la coherencia después de cometer un error.",
    ],
  },
  clave: [
    "La coherencia no consiste en actuar perfectamente, sino en volver una y otra vez a aquello que reconoces como verdadero.",
    "Desarrollar Da'at es construir un puente sólido entre el conocimiento y la acción. Es permitir que las verdades que has descubierto dejen de ser ideas inspiradoras y se conviertan en la forma natural en que eliges vivir. Es ahí donde el aprendizaje deja de ser información y se transforma en sabiduría vivida.",
  ],
};

const CHESED: SefiraContenido = {
  key: "chesed",
  numero: 5,
  titulo: "Chesed",
  frase: "¿Cómo comparto lo que soy con los demás?",
  intro: [
    "Jesed no es simplemente «dar». Es la capacidad de generar vida en otros desde una sensación de abundancia interior, sin convertir el amor en una estrategia para obtener aceptación.",
    "Jesed es la capacidad de ofrecer lo mejor de uno mismo desde la libertad, no desde la necesidad. Comprendemos que compartir puede contribuir al bienestar de otros, sin esperar que ese acto defina nuestro valor personal.",
    "Jesed nos recuerda que ayudar no consiste en hacer más por los demás, sino en ofrecer aquello que realmente puede nutrirlos, respetando sus tiempos, sus decisiones y sus propios límites.",
  ],
  equilibrado: {
    intro: "Una persona con un Jesed desarrollado:",
    items: [
      "Comparte con generosidad sin esperar reconocimiento.",
      "Escucha antes de ofrecer ayuda.",
      "Disfruta contribuir al crecimiento de otras personas.",
      "Da desde la libertad y no desde la obligación.",
      "Respeta la autonomía de quienes la rodean.",
      "Celebra el éxito de otros sin sentir amenaza.",
    ],
  },
  desequilibrado: {
    intro: "Cuando esta dimensión necesita fortalecerse es frecuente:",
    items: [
      "Sentir que siempre se da más de lo que se recibe.",
      "Buscar ser indispensable para los demás.",
      "Ayudar incluso cuando nadie lo ha pedido.",
      "Tener dificultad para aceptar un «no».",
      "Confundir sacrificio con amor.",
      "Experimentar resentimiento cuando el esfuerzo no es reconocido.",
      "Descuidar las propias necesidades por priorizar constantemente las ajenas.",
    ],
  },
  preguntas: {
    items: [
      "¿Desde qué lugar suelo ofrecer mi ayuda?",
      "¿Qué espero, aunque no lo diga, cuando hago algo por otra persona?",
      "¿Me cuesta recibir tanto como dar?",
      "¿Respeto la libertad del otro para aceptar o rechazar lo que ofrezco?",
      "¿En qué momentos confundo amor con sacrificio?",
      "¿Cómo sería dar si no necesitara demostrar mi valor?",
    ],
  },
  ejercicio: {
    titulo: "Revisando mi forma de dar",
    intro: "Piensa en una situación reciente en la que ayudaste a alguien.",
    promptsIntro: "Escribe:",
    prompts: [
      "¿Qué ofrecí?",
      "¿Por qué decidí hacerlo?",
      "¿La otra persona lo necesitaba o yo sentía la necesidad de ayudar?",
      "¿Cómo me sentí si mi ayuda no fue reconocida o aceptada?",
      "¿Qué habría cambiado si hubiera dado sin esperar ningún resultado?",
    ],
    footer: [
      "Ahora identifica una oportunidad durante la próxima semana para realizar un acto de generosidad completamente anónimo o sin posibilidad de recibir reconocimiento.",
      "Al finalizar, observa cómo te sentiste al dar sin esperar nada a cambio.",
    ],
  },
  autoevaluacion: {
    intro: "Valora cada afirmación del 1 (nunca) al 10 (siempre):",
    items: [
      "Disfruto ayudar sin esperar reconocimiento.",
      "Respeto los límites y necesidades de los demás.",
      "Puedo decir «sí» desde la libertad y no desde la culpa.",
      "No necesito sentirme indispensable para valorar mi contribución.",
      "Mi generosidad nace de una elección consciente y no de una necesidad emocional.",
    ],
  },
  clave: [
    "Desarrollar Jesed es aprender que el amor no se mide por cuánto das, sino por la calidad de la presencia con la que das. Cuando la generosidad nace de la abundancia interior, deja de ser un intercambio y se convierte en una expresión natural de quién eres.",
  ],
};

const GEVURAH: SefiraContenido = {
  key: "geburah",
  numero: 6,
  titulo: "Gevurah",
  frase: "¿Qué necesito proteger?",
  intro: [
    "Guevurá es la capacidad de proteger aquello que da sentido y equilibrio a tu vida.",
    "Decir «no» no es rechazar a los demás; es afirmar aquello que consideramos importante. Cada vez que decimos «sí» a algo, también estamos diciendo «no» a otra cosa.",
    "Guevurá nos ayuda a actuar con discernimiento. Nos permite reconocer cuándo una oportunidad nos acerca a nuestro propósito y cuándo nos aleja de él, cuándo una relación nos nutre y cuándo nos desgasta.",
  ],
  equilibrado: {
    intro: "Una persona con una Guevurá desarrollada:",
    items: [
      "Establece límites claros con respeto.",
      "Puede decir «no» sin sentirse culpable.",
      "Actúa de acuerdo con sus valores incluso cuando resulta incómodo.",
      "Administra su tiempo y energía de forma consciente.",
      "Diferencia entre responsabilidad y sobrecarga.",
      "Mantiene disciplina sin caer en la rigidez.",
    ],
  },
  desequilibrado: {
    intro: "Cuando esta dimensión necesita fortalecerse es frecuente:",
    items: [
      "Aceptar compromisos por miedo a decepcionar.",
      "Sentirse responsable de las emociones de los demás.",
      "Posponer constantemente las propias necesidades.",
      "Tener dificultad para mantener hábitos o compromisos personales.",
      "Oscilar entre complacer a todos y reaccionar con dureza cuando se alcanza el límite.",
      "Confundir poner límites con ser egoísta.",
    ],
    extra: {
      intro: "En el extremo opuesto, un exceso de Guevurá puede manifestarse como:",
      items: [
        "Rigidez.",
        "Perfeccionismo.",
        "Exceso de control.",
        "Dificultad para confiar o delegar.",
        "Juicio constante hacia uno mismo o hacia los demás.",
      ],
    },
  },
  preguntas: {
    items: [
      "¿Qué necesito proteger para vivir con mayor coherencia?",
      "¿Qué «sí» estoy dando que en realidad quisiera transformar en un «no»?",
      "¿Qué me impide establecer ese límite?",
      "¿Confundo el cuidado de los demás con el abandono de mí mismo?",
      "¿En qué áreas de mi vida necesito más disciplina y en cuáles más flexibilidad?",
      "¿Qué personas o situaciones consumen una energía que necesito para aquello que considero esencial?",
    ],
  },
  ejercicio: {
    titulo: "El inventario de límites",
    intro: "Durante una semana, observa todas las ocasiones en las que aceptas algo que realmente no deseas hacer.",
    promptsIntro: "Al final del día, responde:",
    prompts: [
      "¿Qué acepté?",
      "¿Por qué dije que sí?",
      "¿Qué temía que ocurriera si decía que no?",
      "¿Qué costo tuvo esa decisión para mí?",
      "¿Cómo podría expresar ese mismo límite con respeto y claridad?",
    ],
    footer: [
      "Luego identifica un límite pequeño que puedas comunicar durante la semana.",
      "No busques hacerlo de manera perfecta. El objetivo es experimentar que poner límites puede fortalecer una relación, no destruirla.",
    ],
  },
  autoevaluacion: {
    intro: "Valora cada afirmación del 1 (nunca) al 10 (siempre):",
    items: [
      "Expreso mis límites con claridad y respeto.",
      "Puedo decir «no» sin sentir culpa excesiva.",
      "Protejo mi tiempo y energía para aquello que considero importante.",
      "Mantengo hábitos y compromisos que reflejan mis valores.",
      "Diferencio entre ayudar y asumir responsabilidades que no me corresponden.",
    ],
  },
  clave: [
    "Cada vez que dices «no» a aquello que te aleja de tus valores, estás diciendo «sí» a la vida que deseas construir. La verdadera fortaleza no consiste en resistirlo todo, sino en proteger con sabiduría aquello que hace posible vivir con integridad.",
  ],
};

const TIFERET: SefiraContenido = {
  key: "tipharet",
  numero: 7,
  titulo: "Tiferet",
  frase: "Equilibrio y Sabiduría del Corazón",
  nota: {
    titulo: "El corazón, el «rey» del cuerpo",
    parrafos: [
      "En muchas tradiciones, y también en la investigación contemporánea, el corazón se describe como algo más que una bomba: un órgano que participa en cómo sentimos, decidimos y nos regulamos.",
      "Diversos estudios sugieren que el corazón posee su propia red de neuronas —a veces llamada «cerebro del corazón»— capaz de enviar al cerebro más señales de las que recibe, influyendo en la atención, la emoción y la toma de decisiones.",
      "Además, genera el campo electromagnético más intenso del cuerpo, y su ritmo refleja nuestro estado interno: cuando el corazón entra en coherencia, el resto del sistema tiende a ordenarse a su alrededor. Por eso se dice que «es el rey».",
    ],
  },
  intro: [
    "Tiferet es la capacidad de encontrar equilibrio entre las distintas fuerzas que habitan en nosotros.",
    "A lo largo de la vida convivimos con impulsos que parecen opuestos: queremos cuidar de los demás, pero también necesitamos cuidarnos. El equilibrio no consiste en eliminar una parte de nosotros, sino en aprender cuándo y cómo darle espacio.",
    "Tiferet representa ese lugar interno desde el que dejamos de actuar por impulso y comenzamos a responder con conciencia y de la manera más adecuada para cada situación.",
    "La madurez emocional nace cuando dejamos de preguntarnos «¿quién tiene razón?» y empezamos a preguntarnos «¿qué necesita esta situación de mí?».",
  ],
  equilibrado: {
    intro: "Una persona con un Tiferet desarrollado:",
    items: [
      "Actúa con firmeza sin perder la empatía.",
      "Expresa lo que siente con honestidad y respeto.",
      "Escucha antes de reaccionar.",
      "Puede reconocer tanto sus fortalezas como sus vulnerabilidades.",
      "Toma decisiones considerando tanto sus necesidades como las de los demás.",
      "Recupera el equilibrio después de momentos difíciles.",
      "Mantiene coherencia entre lo que piensa, siente y expresa.",
    ],
  },
  desequilibrado: {
    intro: "Cuando esta dimensión necesita fortalecerse es frecuente:",
    items: [
      "Oscilar constantemente entre dos extremos.",
      "Pasar de la complacencia a la rigidez.",
      "Reaccionar impulsivamente ante el conflicto.",
      "Reprimir las emociones hasta explotar.",
      "Confundir compasión con sacrificio.",
      "Defender las propias ideas sin escuchar otras perspectivas.",
      "Perder el contacto con las propias necesidades mientras se intenta satisfacer las de los demás.",
    ],
  },
  preguntas: {
    items: [
      "¿En qué área de mi vida tiendo a moverme entre extremos?",
      "¿Qué parte de mí suele dominar cuando enfrento un conflicto?",
      "¿Qué emoción me cuesta más sostener sin reaccionar?",
      "¿Estoy actuando desde el equilibrio o desde una reacción automática?",
      "¿Cómo puedo cuidar de mí sin dejar de cuidar a los demás?",
      "¿Qué necesita esta situación para generar mayor armonía?",
    ],
  },
  ejercicio: {
    titulo: "Volver al centro",
    intro: "Recuerda una conversación o situación reciente en la que reaccionaste de forma impulsiva.",
    promptsIntro: "Escribe:",
    prompts: [
      "¿Qué ocurrió?",
      "¿Qué sentía en ese momento?",
      "¿Qué necesitaba yo?",
      "¿Qué necesitaba la otra persona?",
      "¿Qué respuesta di?",
      "Si hubiera actuado desde mi mejor versión, ¿qué habría hecho diferente?",
    ],
    footer: [
      "No se trata de juzgar lo ocurrido, sino de descubrir cómo habría respondido tu centro interior en lugar de tu reacción automática.",
      "Durante la próxima semana, antes de responder en una conversación difícil, haz una pausa y pregúntate: ¿qué respuesta expresa al mismo tiempo honestidad y compasión?",
    ],
  },
  autoevaluacion: {
    intro: "Valora cada afirmación del 1 (nunca) al 10 (siempre):",
    items: [
      "Expreso mis opiniones con honestidad y respeto.",
      "Puedo equilibrar mis necesidades con las de los demás.",
      "Mantengo la calma cuando aparecen emociones intensas.",
      "Escucho antes de reaccionar.",
      "Recupero mi equilibrio después de un conflicto.",
      "Actúo desde mis valores más que desde mis impulsos.",
    ],
  },
  clave: [
    "El equilibrio no consiste en permanecer siempre en el centro, sino en aprender a regresar a él.",
    "Desarrollar Tiferet es cultivar un corazón capaz de integrar los opuestos. Es descubrir que la verdadera fortaleza no nace de imponerse ni de ceder constantemente, sino de responder con autenticidad, sensibilidad y discernimiento. Desde ese lugar, nuestras decisiones dejan de ser una reacción a las circunstancias y se convierten en una expresión de quienes elegimos ser.",
  ],
};

export const CABALA_SEFIROT: SefiraContenido[] = [
  KETER,
  CHOKHMAH,
  BINAH,
  DAAT,
  CHESED,
  GEVURAH,
  TIFERET,
  stub("netzach", 8, "Nétsaj"),
  stub("hod", 9, "Hod"),
  stub("yesod", 10, "Yesod"),
  stub("malkuth", 11, "Maljut"),
];

export const cabalaSefirotMap = Object.fromEntries(
  CABALA_SEFIROT.map((s) => [s.key, s]),
) as Record<CabalaPageKey, SefiraContenido>;

/** Todas las sefirot en orden, para navegación prev/next. */
export const CABALA_SEFIROT_ORDEN: CabalaPageKey[] = CABALA_SEFIROT.map((s) => s.key);
