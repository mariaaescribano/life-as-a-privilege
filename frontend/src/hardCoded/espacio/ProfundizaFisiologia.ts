// ─────────────────────────────────────────────────────────────────────────
// NIVEL «PROFUNDIZA» de Fisiología (/metodo/fisiologia/profundiza).
// Contenido avanzado, todo abierto desde el principio. Cada TEMA es una página
// (plantilla MetodoFisiologiaTema): un cómic opcional «antes de empezar» + una
// rejilla de FICHAS (cajas) que, al pulsarlas, abren un modal con su explicación
// (mismo patrón que los Sistemas).
//
// María rellena aquí el texto/viñetas; el código no cambia por tema nuevo.
// Los temas con `fichas: []` se muestran como «en construcción».
// ─────────────────────────────────────────────────────────────────────────
import type { Vineta } from "../../components/metodo/ComicViewer";

// Clave en metodo_fisiologia.data donde guardamos las fichas ya leídas de
// Profundiza. Estructura: { [temaKey]: string[] } (keys de fichas leídas).
export const PROFUNDIZA_LEIDAS_KEY = "profundiza_leidas";

// Una caja del tema: al pulsarla se abre el modal con su explicación.
export type Ficha = {
  key: string;
  nombre: string;
  /** Acento propio de la ficha (por defecto hereda el color del tema). */
  color?: string;
  /** Imagen opcional; si falta, se pinta la inicial del nombre. */
  foto?: string;
  /** Antetítulo pequeño en mayúsculas sobre el nombre (p.ej. «Motivación»). */
  eyebrow?: string;
  /** Las 3 ideas clave de la ficha (resumen de la explicación). Se muestran en
   *  cajas blancas bajo el título, para captarla en 3-5 s. */
  claves?: string[];
  /** Explicación que aparece al abrir la ficha (uno o varios párrafos). */
  explicacion: string[];
};

export type TemaProfundiza = {
  /** Segmento de ruta: /metodo/fisiologia/profundiza/:key */
  key: string;
  label: string;
  /** Frase corta bajo el título en la tarjeta del hub. */
  resumen: string;
  /** Color de acento del tema. */
  color: string;
  /** Foto de la tarjeta del hub (pendiente; fallback a inicial). */
  foto: string;
  /** Bloque del hub donde se agrupa el tema. */
  grupo: string;
  /** Frase introductoria de la página del tema (bajo el header). */
  intro?: string;
  /** Pista de acción sobre la rejilla (por defecto «Pulsa cada caja…»). */
  pista?: string;
  /** Cómic que se ofrece «antes de empezar» (opcional). */
  comicIntro?: Vineta[];
  /** Si true, cada ficha se pinta con SU color propio (borde + brillo). Por
   *  defecto las fichas van sobrias (borde quitado, brillo blanco). */
  fichasColoreadas?: boolean;
  /** Las cajas del tema. Vacío = apartado en construcción. */
  fichas: Ficha[];
};

// Portada (foto de la tarjeta del hub) de cada tema, en la subcarpeta /portadas.
const PORTADA = (f: string) => `/recorrido/fisiologia/profundiza/portadas/${f}.png`;
const NT = (k: string) => `/recorrido/fisiologia/profundiza/neurotransmisores/${k}.png`;
// Foto de una ficha dentro de la subcarpeta de su tema (María las irá subiendo;
// mientras no existan, cada caja muestra la inicial del nombre).
const SUB = (tema: string, k: string) => `/recorrido/fisiologia/profundiza/${tema}/${k}.png`;

// ── Cómic «Cómo se sintetiza un neurotransmisor» ───────────────────────────
// Imágenes: /viñetas/fisiologia/neurocomic/neurocomic1.png … neurocomic6.png
// Sin encabezados (eyebrow): las viñetas van solo con su texto.
const NEUROTRANSMISORES_SINTESIS: Vineta[] = [
  {
    src: "/viñetas/fisiologia/neurocomic/neurocomic1.png",
    paragraphs: [
      "Todo empieza en tu plato.",
      "Muchos neurotransmisores nacen de aminoácidos que sacas de la comida: el triptófano, la tirosina…",
      "Son los ladrillos con los que tu cerebro fabricará sus mensajeros.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurocomic/neurocomic2.png",
    paragraphs: [
      "El aminoácido viaja hasta la neurona. Dentro, unas enzimas lo transforman paso a paso, como en una fábrica.",
      "Así la tirosina acaba convertida en dopamina; el triptófano, en serotonina.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurocomic/neurocomic3.png",
    paragraphs: [
      "El neurotransmisor recién fabricado se guarda en pequeñas bolsas: las vesículas.",
      "Esperan cargadas en el extremo de la neurona, listas para disparar.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurocomic/neurocomic4.png",
    paragraphs: [
      "Llega un impulso eléctrico.",
      "Las vesículas se fusionan con la membrana y liberan el neurotransmisor al pequeño espacio entre dos neuronas: la sinapsis.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurocomic/neurocomic5.png",
    paragraphs: [
      "El neurotransmisor cruza y encaja en su receptor, como una llave en su cerradura.",
      "Ese encaje ES el mensaje: la neurona siguiente lo recibe y reacciona.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurocomic/neurocomic6.png",
    paragraphs: [
      "Después, el mensaje se apaga.",
      "Parte del neurotransmisor se recicla de vuelta a la neurona (recaptación), los asctrocitos lo limpian o parte se degrada.",
      "Todo queda limpio para el siguiente pensamiento.",
    ],
  },
];

// ── Las fichas de Neurotransmisores ────────────────────────────────────────
const NEUROTRANSMISORES: Ficha[] = [
  {
    key: "dopamina", nombre: "Dopamina", color: "#f2994a", foto: NT("dopamina"),
    eyebrow: "Motivación y recompensa",
    claves: ["El neurotransmisor del «quiero»", "Motiva, no da placer", "Chispa de ganas y recompensa"],
    explicacion: [
      "Es el neurotransmisor del «quiero eso». No es el del placer, sino el que te motiva para conseguirlo.",
      "Impulsa la motivación, el deseo, el aprendizaje por recompensa y la sensación de anticipación cuando persigues algo que te importa.",
      "Cuándo la notas: esa chispa de ganas al empezar un proyecto, el subidón al pensar en lograr una meta o el impulso que sientes al mirar las notificaciones del móvil.",
    ],
  },
  {
    key: "serotonina", nombre: "Serotonina", color: "#f2d24b", foto: NT("serotonina"),
    eyebrow: "Ánimo y calma",
    claves: ["Nace sobre todo en el intestino", "Regula ánimo y calma", "También sueño y apetito"],
    explicacion: [
      "Gran parte de la serotonina del organismo se produce en el intestino gracias a las células intestinales, influenciadas por la microbiota y por los alimentos que comemos. En el cerebro regula el estado de ánimo, la calma y la sensación de bienestar. También participa en el sueño, el apetito y la digestión.",
      "Cuándo la notas: esa paz serena tras un paseo matutino, sentirte a gusto contigo mismo, dormir bien o la sensación de bienestar después de comer saludablemente.",
    ],
  },
  {
    key: "gaba", nombre: "GABA", color: "#5d6ae0", foto: NT("gaba"),
    eyebrow: "El freno",
    claves: ["El freno del cerebro", "Calma la actividad neuronal", "Poco: ansiedad y tensión"],
    explicacion: [
      "Cuando estás muy estresado, para evitar un desbordamiento, algunas neuronas liberan GABA, el principal freno del cerebro. Reduce la actividad de otras neuronas para que todo no se dispare a la vez.",
      "Cuándo lo notas: cuando por fin te relajas, bajas revoluciones y la mente deja de correr. Poco GABA suele asociarse con ansiedad, tensión o dificultad para desconectar.",
      "Como curiosidad: actúa abriendo canales por los que entra cloro en la neurona, haciendo mucho más difícil que vuelva a activarse.",
    ],
  },
  {
    key: "glutamato", nombre: "Glutamato", color: "#6cb8f2", foto: NT("glutamato"),
    eyebrow: "El acelerador",
    claves: ["El acelerador del cerebro", "Clave para aprender y recordar", "Se equilibra con el GABA"],
    explicacion: [
      "El opuesto del GABA: es el principal neurotransmisor excitador del cerebro. Activa las neuronas y es clave para el aprendizaje, la memoria y la plasticidad cerebral.",
      "Cuándo lo notas: cuando estás despierto, atento y aprendiendo algo nuevo. El equilibrio entre glutamato (acelerador) y GABA (freno) mantiene tu cerebro afinado.",
    ],
  },
  {
    key: "acetilcolina", nombre: "Acetilcolina", color: "#6bd39a", foto: NT("acetilcolina"),
    eyebrow: "Músculo y memoria",
    claves: ["Ordena mover los músculos", "Une cerebro y cuerpo", "Clave para atención y memoria"],
    explicacion: [
      "Une el cerebro con los músculos: cada vez que mueves un dedo, es la acetilcolina la que transmite la orden desde la neurona al músculo y desencadena la liberación del calcio necesario para que la fibra muscular se contraiga. Además, es esencial para la atención, el aprendizaje y la memoria.",
      "Cuándo la notas: en cada movimiento voluntario y cuando estás concentrado y con la mente despierta.",
    ],
  },
  {
    key: "noradrenalina", nombre: "Noradrenalina", color: "#e85c52", foto: NT("noradrenalina"),
    eyebrow: "Alerta y foco",
    claves: ["Te pone en alerta", "Aumenta atención y energía", "Prima de la adrenalina"],
    explicacion: [
      "Te pone en modo alerta: aumenta la atención, la energía y la capacidad de reaccionar ante el estrés. Es prima de la adrenalina, pero actúa principalmente como neurotransmisor dentro del cerebro.",
      "Cuándo la notas: ante un susto o un reto, cuando el corazón se acelera y de repente lo ves todo más nítido y enfocado.",
    ],
  },
  {
    key: "endorfinas", nombre: "Endorfinas", color: "#f6bd82", foto: NT("endorfinas"),
    eyebrow: "Alivio y euforia",
    claves: ["Analgésicos naturales", "Alivio y bienestar", "Suben con ejercicio y risa"],
    explicacion: [
      "Son los analgésicos naturales del cuerpo: reducen el dolor y producen una sensación de alivio y bienestar. También se liberan durante el ejercicio intenso, la risa, el contacto social e incluso en situaciones de estrés para ayudarnos a soportarlo.",
      "Cuándo las notas: el «subidón del corredor» tras el ejercicio, una carcajada o ese bienestar cálido después de un buen esfuerzo.",
    ],
  },
  {
    key: "oxitocina", nombre: "Oxitocina", color: "#ec86c1", foto: NT("oxitocina"),
    eyebrow: "Vínculo y confianza",
    claves: ["La hormona del apego", "Refuerza confianza y vínculos", "Presente en abrazos y parto"],
    explicacion: [
      "La llaman «la hormona del apego». Actúa también como mensajero cerebral y refuerza la confianza, el cariño y los vínculos con los demás. Nos ayuda a sentirnos seguros y favorece las relaciones sociales.",
      "Cuándo la notas: en un abrazo largo, al acariciar a tu mascota o al sentirte cerca de alguien de quien te fías.",
      "Como curiosidad: también participa en la regulación del metabolismo y parece mejorar la sensibilidad a la insulina. Además, se libera en grandes cantidades durante el parto y la lactancia, fortaleciendo el vínculo entre la madre y el bebé.",
    ],
  },
];

// ── Hormonas (por la glándula que las secreta) ───────────────────────────────
const HORMONAS: Ficha[] = [
  {
    key: "insulina", nombre: "Insulina", color: "#f4a9cb", foto: SUB("hormonas", "insulina"),
    eyebrow: "Páncreas · baja el azúcar",
    claves: ["Baja el azúcar en sangre", "Mete la glucosa en las células", "Si falla, diabetes tipo 2"],
    explicacion: [
      "La fabrica el páncreas cuando sube la glucosa en sangre, por ejemplo después de comer. Es la llave que abre las células para que la glucosa entre y se use como energía o se guarde.",
      "Cuándo importa: si las células dejan de responderle bien (resistencia a la insulina), la glucosa se queda en la sangre y aparece, con el tiempo, la diabetes tipo 2.",
    ],
  },
  {
    key: "glucagon", nombre: "Glucagón", color: "#9b6ee0", foto: SUB("hormonas", "glucagon"),
    eyebrow: "Páncreas · sube el azúcar",
    claves: ["Sube el azúcar en sangre", "El hígado suelta glucosa", "Compañera de la insulina"],
    explicacion: [
      "Es la contraparte de la insulina. Cuando la glucosa baja (ayuno, ejercicio), el páncreas libera glucagón para que el hígado suelte glucosa guardada y mantenga estable el nivel en sangre.",
      "Juntas, insulina y glucagón mantienen tu azúcar en un margen estrecho, subiéndolo o bajándolo según haga falta.",
    ],
  },
  {
    key: "cortisol", nombre: "Cortisol", color: "#6bd39a", foto: SUB("hormonas", "cortisol"),
    eyebrow: "Suprarrenal · el estrés",
    claves: ["La hormona del estrés", "Sube de mañana, baja de noche", "Crónico, desgasta el cuerpo"],
    explicacion: [
      "Las glándulas suprarrenales lo liberan ante el estrés y también siguiendo un ritmo diario: sube por la mañana para despertarte y baja por la noche. Moviliza energía y te pone en alerta.",
      "Cuándo importa: útil en momentos puntuales, pero mantenerlo alto durante meses (estrés crónico, dormir mal) desgasta el cuerpo, sube el azúcar y baja las defensas.",
    ],
  },
  {
    key: "adrenalina", nombre: "Adrenalina", color: "#f6bd82", foto: SUB("hormonas", "adrenalina"),
    eyebrow: "Suprarrenal · la reacción inmediata",
    claves: ["La hormona del «lucha o huye»", "Acelera el corazón al instante", "Libera energía para reaccionar"],
    explicacion: [
      "Es la hormona del «lucha o huye». Ante un peligro, en segundos acelera el corazón, dilata las pupilas y libera energía para reaccionar.",
      "Cuándo la notas: ese vuelco cuando te asustas o el corazón a mil antes de hablar en público.",
    ],
  },
  {
    key: "tiroideas", nombre: "Hormonas tiroideas", color: "#ec86c1", foto: SUB("hormonas", "tiroideas"),
    eyebrow: "Tiroides · el acelerador",
    claves: ["Marcan la velocidad del cuerpo", "Energía, temperatura y pulso", "El acelerador del metabolismo"],
    explicacion: [
      "Las hormonas tiroideas (T3 y T4) marcan la velocidad a la que funcionan tus células: el gasto de energía, la temperatura y el ritmo del corazón.",
      "Cuándo importa: demasiadas aceleran todo (nerviosismo, pérdida de peso); pocas lo frenan todo (cansancio, frío, lentitud).",
    ],
  },
  {
    key: "testosterona", nombre: "Testosterona", color: "#5d8ae0", foto: SUB("hormonas", "testosterona"),
    eyebrow: "Gónadas · fuerza y desarrollo",
    claves: ["Presente en ambos sexos", "Músculo, hueso y deseo", "Sobre todo en los testículos"],
    explicacion: [
      "Presente en ambos sexos, aunque más alta en hombres. Interviene en el desarrollo muscular y óseo, el deseo sexual, la energía y el ánimo.",
      "Se produce sobre todo en los testículos y, en menor cantidad, en ovarios y glándulas suprarrenales.",
    ],
  },
  {
    key: "estrogenos", nombre: "Estrógenos", color: "#e86fb0", foto: SUB("hormonas", "estrogenos"),
    eyebrow: "Gónadas · el ciclo y mucho más",
    claves: ["Hormonas sexuales femeninas", "Regulan el ciclo", "Protegen hueso y corazón"],
    explicacion: [
      "Principales hormonas sexuales femeninas. Regulan el ciclo menstrual y la fertilidad, pero también protegen los huesos, el corazón y el cerebro.",
      "Cuándo importa: su caída en la menopausia explica muchos cambios, desde los huesos hasta el estado de ánimo.",
    ],
  },
  {
    key: "progesterona", nombre: "Progesterona", color: "#c9a7ff", foto: SUB("hormonas", "progesterona"),
    eyebrow: "Gónadas · calma y embarazo",
    claves: ["Prepara el útero", "Sostiene el embarazo", "Tiene efecto calmante"],
    explicacion: [
      "Es la otra gran hormona sexual femenina. Prepara el útero para un posible embarazo y lo sostiene si ocurre; sube en la segunda mitad del ciclo menstrual.",
      "También tiene un efecto calmante sobre el cerebro. Sus vaivenes explican parte de los cambios de ánimo y sueño a lo largo del ciclo.",
    ],
  },
  {
    key: "melatonina", nombre: "Melatonina", color: "#6a4bc0", foto: SUB("hormonas", "melatonina"),
    eyebrow: "Pineal · el sueño",
    claves: ["La libera la oscuridad", "La señal de dormir", "Las pantallas la frenan"],
    explicacion: [
      "La glándula pineal la libera cuando cae la luz: es la señal de que llega la noche y toca dormir. Sincroniza tu reloj interno con el día y la noche.",
      "Cuándo importa: la luz de las pantallas por la noche frena su producción y te cuesta más dormir.",
    ],
  },
  {
    key: "crecimiento", nombre: "Hormona del crecimiento", color: "#6fd6db", foto: SUB("hormonas", "crecimiento"),
    eyebrow: "Hipófisis · reparar y crecer",
    claves: ["Se libera al dormir profundo", "Hace crecer de niños", "Repara de adultos"],
    explicacion: [
      "La hipófisis la libera sobre todo durante el sueño profundo y el ejercicio. Estimula el crecimiento en la infancia y, de adulto, la reparación de tejidos y músculo.",
      "Cuándo importa: dormir bien es, literalmente, cuando más te reparas.",
    ],
  },
];

// ── Metabolismo · la respiración celular (de la comida al ATP), paso a paso ──
const METABOLISMO: Ficha[] = [
  {
    key: "que-es", nombre: "Qué es", color: "#f2c86b", foto: SUB("metabolismo", "metabolismo1"),
    claves: ["Convierte comida en ATP", "La energía de la célula", "Ocurre en las mitocondrias"],
    explicacion: [
      "La respiración celular es el proceso mediante el cual las células transforman los nutrientes de los alimentos (principalmente la glucosa) en ATP, la molécula que proporciona energía para que el organismo pueda funcionar.",
      "Este proceso ocurre principalmente en las mitocondrias, conocidas como las «centrales energéticas» de la célula.",
    ],
  },
  {
    key: "glucolisis", nombre: "1. Glucólisis", color: "#e6a7d9", foto: SUB("metabolismo", "metabolismo2"),
    claves: ["Parte la glucosa en piruvato", "Da 2 ATP y NADH", "No necesita oxígeno"],
    explicacion: [
      "La respiración celular comienza en el citoplasma, fuera de la mitocondria. Cuando comemos carbohidratos, estos se convierten en glucosa, una molécula rica en energía. Durante la glucólisis, una molécula de glucosa (6 carbonos) se divide en dos moléculas más pequeñas llamadas piruvato (3 carbonos cada una).",
      "En este proceso se obtienen 2 ATP (energía inmediata) y 2 NADH, unas moléculas que almacenan electrones para producir más energía después.",
      "La glucólisis no necesita oxígeno, por eso puede ocurrir incluso cuando hacemos ejercicio intenso.",
    ],
  },
  {
    key: "piruvato-acetil-coa", nombre: "2. Del piruvato a acetil-CoA", color: "#f2b48f", foto: SUB("metabolismo", "metabolismo3"),
    claves: ["El piruvato entra a la mitocondria", "Se vuelve acetil-CoA", "Libera el CO₂ que exhalas"],
    explicacion: [
      "Los dos piruvatos entran en la mitocondria. Allí se transforman en una molécula llamada acetil-CoA, liberando dióxido de carbono (CO₂), que posteriormente expulsamos al respirar.",
      "También se produce más NADH, que servirá para fabricar ATP más adelante. Esta etapa conecta la glucólisis con el ciclo de Krebs.",
    ],
  },
  {
    key: "ciclo-krebs", nombre: "3. Ciclo de Krebs", color: "#f28b8b", foto: SUB("metabolismo", "metabolismo4"),
    claves: ["Carga NADH y FADH₂", "Baterías de electrones", "Libera más CO₂"],
    explicacion: [
      "El acetil-CoA entra en una serie de reacciones químicas conocidas como ciclo de Krebs. Aquí no se produce mucha energía directamente, pero sí una gran cantidad de moléculas transportadoras: NADH y FADH₂.",
      "Estas moléculas funcionan como pequeñas baterías cargadas de electrones. Durante esta etapa también se libera CO₂, que eliminamos al exhalar.",
    ],
  },
  {
    key: "cadena-electrones", nombre: "4. Cadena de transporte de electrones", color: "#9fe6b8", foto: SUB("metabolismo", "metabolismo5"),
    claves: ["Aquí se genera casi toda la energía", "Los electrones bombean protones", "Como agua tras una presa"],
    explicacion: [
      "Esta es la fase donde se genera casi toda la energía. Los NADH y FADH₂ entregan sus electrones a una cadena de proteínas situada en la membrana interna de la mitocondria.",
      "Cuando los electrones avanzan por esta cadena liberan energía, y esa energía bombea protones (H⁺) hacia un lado de la membrana. Se crea así una diferencia de concentración, como si se almacenara agua detrás de una presa.",
    ],
  },
  {
    key: "atp-sintasa", nombre: "5. ATP sintasa", color: "#a7d9f2", foto: SUB("metabolismo", "metabolismo6"),
    claves: ["Los protones la hacen girar", "Fabrica la mayoría del ATP", "Como una turbina hidroeléctrica"],
    explicacion: [
      "Los protones quieren volver al otro lado de la membrana, y solo pueden hacerlo atravesando una proteína llamada ATP sintasa. Al pasar los protones, la ATP sintasa gira y utiliza esa energía para fabricar ATP.",
      "Es parecido a una central hidroeléctrica: el agua acumulada representa los protones, la turbina representa la ATP sintasa y la electricidad producida sería el ATP.",
      "En esta etapa se producen aproximadamente 28-32 ATP, mucho más que en las etapas anteriores.",
    ],
  },
  {
    key: "oxigeno", nombre: "6. El papel del oxígeno", color: "#c9a7ff", foto: SUB("metabolismo", "metabolismo7"),
    claves: ["No produce energía directa", "Recoge los electrones finales", "Sin él, la célula muere"],
    explicacion: [
      "El oxígeno no produce energía directamente. Su función es recibir los electrones al final de la cadena de transporte. Cuando acepta esos electrones y se une a protones, forma agua (H₂O).",
      "Sin oxígeno, la cadena se detiene, no se genera ATP suficiente y la célula acaba muriendo. Por eso respirar es imprescindible para producir energía.",
    ],
  },
];

// ── Expresión génica y epigenética ───────────────────────────────────────────
const EPIGENETICA: Ficha[] = [
  {
    key: "metilacion", nombre: "Metilación del ADN", color: "#a7d9f2", foto: SUB("epigenetica", "epigenetica1"),
    eyebrow: "El interruptor de apagado",
    claves: ["Marcas que silencian genes", "El gen sigue, pero no se lee", "Diferencia a las células"],
    explicacion: [
      "Añadir pequeñas marcas químicas (grupos metilo) sobre el ADN suele silenciar un gen: sigue ahí, pero no se lee.",
      "Así una célula del hígado y una neurona, con el mismo ADN, apagan y encienden genes distintos y acaban siendo tan diferentes.",
    ],
  },
  {
    key: "histonas", nombre: "Histonas", color: "#9ab6f0", foto: SUB("epigenetica", "epigenetica2"),
    eyebrow: "Empaquetar para esconder o mostrar",
    claves: ["El ADN se enrolla en ellas", "Apretado esconde, flojo muestra", "Deciden qué genes se leen"],
    explicacion: [
      "El ADN se enrolla en proteínas llamadas histonas. Si se enrolla apretado, el gen queda escondido; si se afloja, queda accesible para leerse.",
      "Modificar las histonas es otra forma de decidir qué partes del manual están a mano y cuáles guardadas.",
    ],
  },
  {
    key: "factores", nombre: "Factores de transcripción", color: "#9fe6b8", foto: SUB("epigenetica", "epigenetica3"),
    eyebrow: "Quién decide qué se lee",
    claves: ["Interruptores de los genes", "Activan o frenan la lectura", "Responden a las señales"],
    explicacion: [
      "Son proteínas que se pegan al ADN y activan o frenan la lectura de genes concretos, como interruptores que responden a señales de dentro y de fuera.",
      "Gracias a ellos la célula ajusta en tiempo real qué proteínas fabrica según lo que necesita.",
    ],
  },
  {
    key: "ambiente", nombre: "El ambiente enciende genes", color: "#f2c86b", foto: SUB("epigenetica", "epigenetica4"),
    eyebrow: "Tu vida deja huella",
    claves: ["Tus hábitos marcan los genes", "No cambian el ADN", "Cambian cómo se usa"],
    explicacion: [
      "La alimentación, el ejercicio, el estrés, el sueño o el tabaco pueden cambiar estas marcas epigenéticas y, con ellas, qué genes se expresan.",
      "No cambian tu ADN, pero sí cómo se usa: tus hábitos hablan con tus genes cada día.",
    ],
  },
  {
    key: "herencia", nombre: "Herencia epigenética", color: "#e6a7d9", foto: SUB("epigenetica", "epigenetica5"),
    eyebrow: "A veces se hereda",
    claves: ["Algunas marcas se heredan", "La vida de los padres influye", "Un campo joven y apasionante"],
    explicacion: [
      "Algunas marcas epigenéticas pueden pasar de una generación a otra, de modo que las experiencias de los padres podrían influir un poco en los hijos.",
      "Es un campo joven y apasionante: sugiere que el entorno deja una huella que va más allá de una sola vida.",
    ],
  },
];

// ── Detoxificación del hígado ────────────────────────────────────────────────
const DETOXIFICACION: Ficha[] = [
  {
    key: "fase-1", nombre: "Fase I · transformar", color: "#f2c86b", foto: SUB("higado", "higado1"),
    eyebrow: "Abrir el paquete",
    claves: ["Enzimas que transforman el tóxico", "Lo hacen manejable", "«Abrir el paquete»"],
    explicacion: [
      "Unas enzimas del hígado (el grupo citocromo P450) modifican las sustancias tóxicas para hacerlas más manejables. A veces, de paso, las vuelven momentáneamente más reactivas.",
      "Es como abrir el paquete: prepara la toxina para el siguiente paso.",
    ],
  },
  {
    key: "fase-2", nombre: "Fase II · neutralizar", color: "#9fe6b8", foto: SUB("higado", "higado2"),
    eyebrow: "Hacerlas inofensivas",
    claves: ["Lo neutraliza", "Lo vuelve soluble en agua", "Necesita buenos nutrientes"],
    explicacion: [
      "El hígado une esas sustancias a otras moléculas (conjugación) para volverlas solubles en agua e inofensivas.",
      "Necesita materias primas que vienen de la dieta (aminoácidos, antioxidantes); por eso comer bien apoya este proceso.",
    ],
  },
  {
    key: "fase-3", nombre: "Fase III · eliminar", color: "#a7d9f2", foto: SUB("higado", "higado3"),
    eyebrow: "Sacarlas fuera",
    claves: ["Expulsa los tóxicos", "Por la orina o la bilis", "La fibra ayuda a sacarlos"],
    explicacion: [
      "Ya neutralizadas, las sustancias se expulsan: por la orina (riñón) o por la bilis hacia el intestino y las heces.",
      "La fibra ayuda a arrastrarlas fuera y evita que se reabsorban.",
    ],
  },
  {
    key: "glutation", nombre: "Glutatión", color: "#c9a7ff", foto: SUB("higado", "higado4"),
    eyebrow: "El antioxidante maestro",
    claves: ["El antioxidante maestro", "Neutraliza tóxicos y radicales", "Se gasta con el alcohol"],
    explicacion: [
      "Es la molécula estrella de la desintoxicación y la defensa antioxidante del hígado: neutraliza tóxicos y radicales libres.",
      "El cuerpo lo fabrica, pero se gasta con el alcohol, los tóxicos y el estrés oxidativo.",
    ],
  },
  {
    key: "mito-detox", nombre: "Los «detox» de moda", color: "#f2b48f", foto: SUB("higado", "higado5"),
    eyebrow: "Lo que de verdad ayuda",
    claves: ["Ya te desintoxicas solo", "Mejor que cualquier «detox»", "Menos alcohol, más agua y fibra"],
    explicacion: [
      "Tu hígado y tus riñones ya te desintoxican cada segundo, mejor que cualquier zumo o producto «detox».",
      "Lo que sí ayuda es no sobrecargarlos: menos alcohol y ultraprocesados, y más agua, fibra, sueño y verduras.",
    ],
  },
];

// ── Estrés oxidativo y antioxidantes ─────────────────────────────────────────
const ESTRES_OXIDATIVO: Ficha[] = [
  {
    key: "radicales", nombre: "Radicales libres", color: "#f28b8b", foto: SUB("estres", "estres1"),
    eyebrow: "Moléculas inestables (ROS)",
    claves: ["Moléculas inestables (ROS)", "Roban electrones y dañan", "En exceso son el problema"],
    explicacion: [
      "Son moléculas inestables que se generan al producir energía o al recibir radiación (el sol). Les falta un electrón y lo «roban» a otras moléculas, dañándolas.",
      "No todos son malos: en pequeña cantidad sirven de señal y defensa. El problema es el exceso.",
    ],
  },
  {
    key: "dano", nombre: "El daño oxidativo", color: "#f2b48f", foto: SUB("estres", "estres2"),
    eyebrow: "Cuando se acumula",
    claves: ["Dañan ADN, grasas y proteínas", "Aceleran el envejecimiento", "Arrugas y arterias rígidas"],
    explicacion: [
      "En exceso, los radicales libres dañan el ADN, las grasas de las membranas y las proteínas. Ese desgaste, sumado con los años, acelera el envejecimiento.",
      "Se relaciona con arrugas, arterias más rígidas y varias enfermedades crónicas.",
    ],
  },
  {
    key: "antioxidantes-propios", nombre: "Tu ejército interno", color: "#9fe6b8", foto: SUB("estres", "estres3"),
    eyebrow: "Antioxidantes propios",
    claves: ["Tu cuerpo fabrica los suyos", "Tu primera defensa", "La dieta solo complementa"],
    explicacion: [
      "El cuerpo fabrica sus propios antioxidantes (glutatión, superóxido dismutasa, catalasa) que neutralizan los radicales antes de que hagan daño.",
      "Es tu primera y principal defensa; la dieta solo complementa.",
    ],
  },
  {
    key: "antioxidantes-dieta", nombre: "Los de la comida", color: "#a7d9f2", foto: SUB("estres", "estres4"),
    eyebrow: "Antioxidantes de la dieta",
    claves: ["Vitamina C, E y polifenoles", "Frenan el daño oxidativo", "Mejor comida que pastillas"],
    explicacion: [
      "Vitamina C, vitamina E y los polifenoles de frutas, verduras, té o aceite de oliva ayudan a frenar el daño oxidativo.",
      "Mejor de alimentos reales que en pastillas: en dosis altas, los suplementos antioxidantes no siempre ayudan e incluso pueden estorbar.",
    ],
  },
  {
    key: "hormesis", nombre: "Hormesis", color: "#f2c86b", foto: SUB("estres", "estres5"),
    eyebrow: "Un poco de estrés te fortalece",
    claves: ["Un poco de estrés fortalece", "El ejercicio entrena tus defensas", "Pequeños retos te hacen resistente"],
    explicacion: [
      "El ejercicio genera radicales libres… y aun así es sano: ese pequeño estrés entrena a tus defensas antioxidantes para ser más fuertes.",
      "Es la hormesis: dosis pequeñas de un reto te hacen más resistente.",
    ],
  },
];

// ── Sistema inmunitario ──────────────────────────────────────────────────────
const INMUNITARIO: Ficha[] = [
  {
    key: "macrofagos", nombre: "1. Macrófagos", color: "#f2c86b", foto: SUB("inmunitario", "macrofagos"),
    claves: ["Engullen microbios y restos", "Avisan con antígenos", "Guardianes serenos del tejido"],
    explicacion: [
      "Los macrófagos son grandes células del sistema inmunitario que viven en casi todos los tejidos del cuerpo.",
      "Su principal función es fagocitar, es decir, rodear y engullir bacterias, virus, células muertas y otros restos para destruirlos. Dentro del macrófago existen compartimentos llenos de enzimas que degradan todo ese material, lo convierten en otras moléculas y pueden reutilizar parte de ellas o presentarlas a otras células.",
      "Pero los macrófagos no solo limpian. Después de destruir al invasor, colocan pequeños fragmentos del microorganismo (antígenos) en su superficie para avisar al resto del sistema inmunitario de qué enemigo han encontrado.",
      "Además, liberan sustancias químicas llamadas citocinas, que atraen a otras células defensivas y ayudan a iniciar la inflamación.",
      "Son nuestros guardianes más serenos y, cuando hay una infección no muy grave, muchas veces la controlan ellos solos sin necesidad de reclutar grandes cantidades de neutrófilos, ya que estos tienden a causar más daño a los tejidos cuando la respuesta es muy intensa.",
    ],
  },
  {
    key: "neutrofilos", nombre: "2. Neutrófilos", color: "#f2b48f", foto: SUB("inmunitario", "neutrofilos"),
    eyebrow: "Los soldados de respuesta rápida",
    claves: ["Primeros y más abundantes", "Soldados casi suicidas", "Forman el pus"],
    explicacion: [
      "Los neutrófilos son los glóbulos blancos más abundantes de la sangre y llegan muy rápidamente al lugar de una infección.",
      "Son soldados casi suicidas, cuya misión es destruir microorganismos lo antes posible. Para ello pueden fagocitar bacterias, liberar sustancias antimicrobianas o expulsar su ADN formando unas redes llamadas NETs (trampas extracelulares de neutrófilos), que atrapan y ayudan a eliminar los patógenos, suicidándose en el proceso pero siendo letalmente eficientes.",
      "Aunque son muy eficaces, viven poco tiempo. Tras cumplir su función suelen morir para no causar daños innecesarios y, junto con bacterias y restos celulares, forman parte del pus o del moco que aparece en algunas infecciones. Cuanto más verdoso sea el moco, más neutrófilos muertos suele contener.",
    ],
  },
  {
    key: "dendriticas", nombre: "3. Células dendríticas", color: "#9fe6b8", foto: SUB("inmunitario", "dendriticas"),
    eyebrow: "Las mensajeras del sistema inmunitario",
    claves: ["Exploradoras del cuerpo", "Presentan al patógeno", "Puente hacia la defensa específica"],
    explicacion: [
      "Las células dendríticas son los «scouts» que recorren todo nuestro cuerpo en busca de lo que no forma parte de nosotros. Si lo encuentran, cogen una muestra y se la presentan a los linfocitos T.",
      "Patrullan constantemente tejidos como la piel y las mucosas buscando microorganismos. Cuando encuentran uno, capturan fragmentos del patógeno y viajan hasta los ganglios linfáticos.",
      "Allí presentan esos fragmentos a los linfocitos T. Gracias a esta presentación, los linfocitos T pueden reconocer exactamente qué microorganismo ha invadido el organismo y comenzar una respuesta mucho más específica.",
      "Por eso las células dendríticas son el puente entre la inmunidad innata y la adaptativa.",
    ],
  },
  {
    key: "linfocitos-t", nombre: "4. Linfocitos T", color: "#9ab6f0", foto: SUB("inmunitario", "linfocitos-t"),
    eyebrow: "Los coordinadores y eliminadores",
    claves: ["Detectan y coordinan la defensa", "Un receptor único cada uno", "Se «gradúan» en el timo"],
    explicacion: [
      "Los linfocitos T son capaces de detectar qué microorganismo está atacando gracias a las muestras que les presentan las células dendríticas, y de activar la respuesta inmunitaria adecuada.",
      "Los linfocitos T nacen creando un receptor aleatorio a partir de los genes que tenemos. Por eso nacen millones de linfocitos T diferentes y se dice que podemos reconocer prácticamente cualquier bacteria o virus. Pero tener la capacidad de reconocerlos no quiere decir que ya seamos inmunes frente a ellos.",
      "Para poder permanecer en el sistema inmunitario, las células T tienen que pasar las terribles pruebas del timo, donde hay células «profesoras» que se aseguran de que no reconozcan como enemigo a lo que forma parte del propio cuerpo, evitando así posibles enfermedades autoinmunes. Debido a esto, solo aproximadamente el 2 % de las células T que nacen consiguen aprobar.",
    ],
  },
  {
    key: "linfocitos-t-colaboradores", nombre: "5. Linfocitos T colaboradores", color: "#8fd0e6", foto: SUB("inmunitario", "linfocitos-t-colaboradores"),
    claves: ["Coordinan la respuesta inmune", "Activan a las demás defensas", "Sin ellos, todo falla"],
    explicacion: [
      "Estos actúan como coordinadores de toda la respuesta inmunitaria.",
      "Cuando reconocen un antígeno presentado por una célula dendrítica, liberan citocinas que activan a los macrófagos (les ordenan atacar y aumentan su capacidad para hacerlo), a los linfocitos B cuyo receptor reconoce el mismo antígeno y, si hace falta, a los linfocitos T citotóxicos, que son realmente agresivos.",
      "Sin ellos, la respuesta inmunitaria sería mucho menos eficaz.",
    ],
  },
  {
    key: "linfocitos-t-citotoxicos", nombre: "6. Linfocitos T citotóxicos", color: "#a7d9f2", foto: SUB("inmunitario", "linfocitos-t-citotoxicos"),
    claves: ["Matan células infectadas", "Inducen su apoptosis", "Precisos con el tejido sano"],
    explicacion: [
      "Su función es destruir células del propio organismo que estén infectadas por virus o que se hayan vuelto cancerosas. Lo hacen de sopetón: perforan la membrana de la célula infectada e inducen su muerte programada (apoptosis).",
      "De esta manera eliminan el problema sin dañar excesivamente los tejidos vecinos.",
    ],
  },
  {
    key: "linfocitos-b", nombre: "7. Linfocitos B", color: "#c9a7ff", foto: SUB("inmunitario", "linfocitos-b"),
    eyebrow: "Los fabricantes de anticuerpos",
    claves: ["Fabrican anticuerpos", "Cada uno, un antígeno", "Crean memoria: las vacunas"],
    explicacion: [
      "Los linfocitos B también pertenecen a la inmunidad adaptativa.",
      "Cada linfocito B reconoce un único tipo de antígeno. Cuando encuentra el suyo y recibe ayuda de un linfocito T colaborador, comienza a multiplicarse.",
      "Después se transforma en una célula plasmática, cuya misión es fabricar enormes cantidades de anticuerpos.",
      "Algunos linfocitos B se convierten en células de memoria, capaces de responder mucho más rápido si el mismo microorganismo vuelve a entrar en el cuerpo. Esta memoria es la base del funcionamiento de las vacunas.",
    ],
  },
  {
    key: "natural-killers", nombre: "8. Natural killers (NK)", color: "#e6a7d9", foto: SUB("inmunitario", "natural-killers"),
    claves: ["Matan sin aviso previo", "Buscan células infectadas", "Frenan el cáncer temprano"],
    explicacion: [
      "Son células capaces de matar sin necesidad de una activación específica previa.",
      "Buscan células que presentan signos de estar infectadas o de haberse vuelto cancerosas, las aniquilan y continúan con su misión. Gracias a ello, muchas células cancerosas son eliminadas antes de que lleguen a formar un tumor.",
    ],
  },
  {
    key: "inflamacion", nombre: "9. Inflamación", color: "#f28b8b", foto: SUB("inmunitario", "inflamacion"),
    claves: ["Defensa ante daño o infección", "Los vasos dejan pasar defensas", "Enrojece, calienta y duele"],
    explicacion: [
      "La inflamación es un mecanismo de defensa que aparece cuando existe una infección o una lesión.",
      "Los macrófagos y otras células liberan sustancias como las citocinas, y otras liberan mediadores como la histamina, que producen varios cambios: los vasos sanguíneos se dilatan, aumenta el flujo de sangre y los vasos se vuelven más permeables, permitiendo que las células del sistema inmunitario lleguen al lugar afectado.",
      "Como consecuencia aparecen los signos clásicos de la inflamación: enrojecimiento, calor, hinchazón, dolor y, a veces, pérdida temporal de la función.",
      "Aunque resulte molesta, la inflamación es una herramienta fundamental para eliminar el agente causante y comenzar la reparación del tejido.",
    ],
  },
  {
    key: "anticuerpos", nombre: "10. Anticuerpos", color: "#f2994a", foto: SUB("inmunitario", "anticuerpos"),
    eyebrow: "Las armas de precisión",
    claves: ["Proteínas de precisión", "Una llave por cerradura", "Neutralizan y marcan al invasor"],
    explicacion: [
      "Los anticuerpos, también llamados inmunoglobulinas, son proteínas producidas por las células plasmáticas, que derivan de los linfocitos B.",
      "Cada anticuerpo reconoce un antígeno muy concreto, como si fuera una llave diseñada para una única cerradura.",
      "Cuando se unen al microorganismo pueden neutralizar virus y toxinas, impidiendo que infecten las células o ejerzan su efecto, y marcar bacterias para que los macrófagos y neutrófilos las fagociten con mayor facilidad (opsonización).",
      "Gracias a los anticuerpos, el sistema inmunitario puede atacar de forma muy específica al invasor sin afectar al resto del organismo.",
    ],
  },
];

// ── Envejecimiento celular ───────────────────────────────────────────────────
const ENVEJECIMIENTO: Ficha[] = [
  {
    key: "telomeros", nombre: "Telómeros", color: "#a7d9f2", foto: SUB("envejecimiento", "envejecimiento1"),
    eyebrow: "El reloj de las divisiones",
    claves: ["Protegen los cromosomas", "Se acortan al dividirse", "Un reloj del envejecimiento"],
    explicacion: [
      "Son los extremos protectores de los cromosomas. Cada vez que una célula se divide, se acortan un poco.",
      "Cuando se hacen demasiado cortos, la célula deja de dividirse: es uno de los relojes del envejecimiento.",
    ],
  },
  {
    key: "senescencia", nombre: "Senescencia", color: "#c9a7ff", foto: SUB("envejecimiento", "envejecimiento2"),
    eyebrow: "Células «zombie»",
    claves: ["Células «zombie»", "Ni mueren ni se dividen", "Inflaman su entorno"],
    explicacion: [
      "Algunas células dañadas ni mueren ni se dividen: se «jubilan» (senescencia) pero siguen ahí, liberando señales inflamatorias.",
      "Acumuladas con los años, ensucian el tejido y aceleran el envejecimiento de su alrededor.",
    ],
  },
  {
    key: "mitocondrias", nombre: "Motores que se desgastan", color: "#f28b8b", foto: SUB("envejecimiento", "envejecimiento3"),
    eyebrow: "Mitocondrias cansadas",
    claves: ["Con la edad rinden menos", "Generan más radicales", "Menos energía, más cansancio"],
    explicacion: [
      "Con la edad, las mitocondrias funcionan peor y generan más radicales libres, lo que a su vez las daña más: un círculo vicioso.",
      "Menos energía celular es una de las razones del cansancio y la pérdida de función con los años.",
    ],
  },
  {
    key: "inflammaging", nombre: "Inflamación de fondo", color: "#f2b48f", foto: SUB("envejecimiento", "envejecimiento4"),
    eyebrow: "«Inflammaging»",
    claves: ["Inflamación crónica y silenciosa", "Desgasta los tejidos", "Ligada a las enfermedades de la edad"],
    explicacion: [
      "El envejecimiento se acompaña de una inflamación crónica de bajo grado, silenciosa, que va deteriorando los tejidos.",
      "Se relaciona con muchas de las enfermedades propias de la edad.",
    ],
  },
  {
    key: "autofagia", nombre: "Autofagia", color: "#9fe6b8", foto: SUB("envejecimiento", "envejecimiento5"),
    eyebrow: "El reciclaje que te cuida",
    claves: ["El reciclaje de la célula", "Limpia piezas dañadas", "Ejercicio y ayuno la activan"],
    explicacion: [
      "Es el sistema de reciclaje de la célula: elimina piezas viejas o dañadas y reutiliza sus materiales.",
      "El ejercicio y el ayuno la estimulan; mantenerla activa ayuda a envejecer mejor.",
    ],
  },
];

// ── Apoptosis y necrosis ─────────────────────────────────────────────────────
const APOPTOSIS: Ficha[] = [
  {
    key: "apoptosis", nombre: "Apoptosis", color: "#9fe6b8", foto: SUB("apoptosis", "apoptosis1"),
    eyebrow: "Morir con orden",
    claves: ["Muerte celular programada", "Limpia y ordenada", "Sus restos se reciclan"],
    explicacion: [
      "Es la muerte celular programada: la célula se desmonta de forma limpia y ordenada, y sus restos se reciclan sin dañar a las vecinas.",
      "Es una muerte útil y silenciosa, planificada por el propio cuerpo.",
    ],
  },
  {
    key: "necrosis", nombre: "Necrosis", color: "#f28b8b", foto: SUB("apoptosis", "apoptosis2"),
    eyebrow: "Morir de golpe",
    claves: ["Muerte por lesión", "La célula se rompe de golpe", "Provoca inflamación"],
    explicacion: [
      "Es la muerte por lesión (un golpe, falta de oxígeno, una toxina): la célula se rompe de forma descontrolada y su contenido se derrama.",
      "Eso provoca inflamación alrededor, a diferencia de la apoptosis.",
    ],
  },
  {
    key: "util", nombre: "Por qué es necesaria", color: "#a7d9f2", foto: SUB("apoptosis", "apoptosis3"),
    eyebrow: "Una muerte que da vida",
    claves: ["Esculpe el cuerpo", "Elimina células peligrosas", "Miles de millones al día"],
    explicacion: [
      "La apoptosis esculpe el cuerpo (por ejemplo, separa los dedos en el embrión) y elimina células viejas, dañadas o peligrosas.",
      "Cada día mueren así miles de millones de células tuyas, y no lo notas.",
    ],
  },
  {
    key: "cancer", nombre: "Cuando falla: el cáncer", color: "#c9a7ff", foto: SUB("apoptosis", "apoptosis4"),
    eyebrow: "Células que no obedecen",
    claves: ["Si esquiva la muerte…", "Se divide sin control", "Uno de los orígenes del cáncer"],
    explicacion: [
      "Si una célula dañada esquiva la apoptosis, puede seguir dividiéndose sin control: ese es uno de los orígenes del cáncer.",
      "Muchos tratamientos buscan, precisamente, reactivar la orden de morir en esas células.",
    ],
  },
];

// ── Regeneración (cerrar una herida, paso a paso) ─────────────────────────────
const REGENERACION: Ficha[] = [
  {
    key: "hemostasia", nombre: "1 · Detener la sangre", color: "#f28b8b", foto: SUB("regeneracion", "regeneracion1"),
    eyebrow: "Hemostasia",
    claves: ["Las plaquetas forman un tapón", "Se activa la coagulación", "El primer parche de emergencia"],
    explicacion: [
      "En segundos, las plaquetas forman un tapón y se activa la coagulación para cerrar la herida y frenar la hemorragia.",
      "Es el primer parche de emergencia.",
    ],
  },
  {
    key: "inflamacion", nombre: "2 · Limpiar", color: "#f2b48f", foto: SUB("regeneracion", "regeneracion2"),
    eyebrow: "Inflamación",
    claves: ["Llegan las defensas a limpiar", "Enrojece e hincha", "Deja el terreno listo"],
    explicacion: [
      "Llegan células de defensa que eliminan microbios y restos de tejido dañado. La zona se enrojece e hincha: es normal y necesario.",
      "Deja el terreno limpio para reconstruir.",
    ],
  },
  {
    key: "proliferacion", nombre: "3 · Reconstruir", color: "#9fe6b8", foto: SUB("regeneracion", "regeneracion3"),
    eyebrow: "Proliferación",
    claves: ["Los fibroblastos hacen colágeno", "Crecen nuevos vasos", "Tejido nuevo, aún frágil"],
    explicacion: [
      "Los fibroblastos fabrican colágeno, crecen nuevos vasos sanguíneos y las células de la piel cubren la herida.",
      "Se forma tejido nuevo, todavía frágil.",
    ],
  },
  {
    key: "remodelacion", nombre: "4 · Rematar", color: "#a7d9f2", foto: SUB("regeneracion", "regeneracion4"),
    eyebrow: "Remodelación",
    claves: ["El tejido se reorganiza", "Gana fuerza con el tiempo", "A veces queda cicatriz"],
    explicacion: [
      "Durante semanas o meses, el tejido nuevo se reorganiza y gana fuerza; a veces queda una cicatriz.",
      "La cicatriz es resistente, aunque nunca idéntica al tejido original.",
    ],
  },
  {
    key: "celulas-madre", nombre: "Las células madre", color: "#c9a7ff", foto: SUB("regeneracion", "regeneracion5"),
    eyebrow: "Las que lo hacen posible",
    claves: ["Células «en blanco»", "Reemplazan lo que se pierde", "Corazón y cerebro tienen pocas"],
    explicacion: [
      "Son células «en blanco» que pueden convertirse en distintos tipos y reemplazar a las que se pierden. Renuevan piel, sangre o intestino constantemente.",
      "Algunos órganos (como el corazón o el cerebro) tienen muy pocas, y por eso se reparan peor.",
    ],
  },
];

// ── Homeostasis (el equilibrio interno) ──────────────────────────────────────
const HOMEOSTASIS: Ficha[] = [
  {
    key: "temperatura", nombre: "Temperatura", color: "#f2b48f", foto: SUB("homeostasis", "homeostasis1"),
    eyebrow: "Siempre unos 37 °C",
    claves: ["Siempre unos 37 °C", "Sudar o tiritar la ajusta", "Para que las enzimas trabajen"],
    explicacion: [
      "Si tienes calor, sudas y dilatas los vasos; si tienes frío, tiritas y los cierras.",
      "Mantener la temperatura estable permite que tus enzimas funcionen bien.",
    ],
  },
  {
    key: "glucosa", nombre: "Azúcar en sangre", color: "#9fe6b8", foto: SUB("homeostasis", "homeostasis2"),
    eyebrow: "Ni mucho ni poco",
    claves: ["Insulina y glucagón la regulan", "Ni mucha ni poca", "Si falla años, diabetes"],
    explicacion: [
      "Insulina y glucagón suben o bajan la glucosa para mantenerla en un margen estrecho, comas o ayunes.",
      "Cuando esta regulación falla durante años aparece la diabetes.",
    ],
  },
  {
    key: "agua-sales", nombre: "Agua y sales", color: "#a7d9f2", foto: SUB("homeostasis", "homeostasis3"),
    eyebrow: "El equilibrio interno",
    claves: ["Los riñones ajustan agua y sal", "Según bebas o sudes", "De ello depende la tensión"],
    explicacion: [
      "Los riñones y varias hormonas ajustan cuánta agua y sales conservas o eliminas, según bebas, sudes o comas.",
      "De ello dependen la presión arterial y el correcto funcionamiento de tus células.",
    ],
  },
  {
    key: "ph", nombre: "El pH de la sangre", color: "#c9a7ff", foto: SUB("homeostasis", "homeostasis4"),
    eyebrow: "Un margen muy estrecho",
    claves: ["pH estable en 7,4", "Pulmones y riñones lo corrigen", "Un margen muy estrecho"],
    explicacion: [
      "La sangre se mantiene en un pH muy estable (alrededor de 7,4). Los pulmones y los riñones lo corrigen sin descanso.",
      "Pequeñas desviaciones son peligrosas; por eso este equilibrio es de los más vigilados.",
    ],
  },
];

// ── Nervio vago ──────────────────────────────────────────────────────────────
const NERVIO_VAGO: Ficha[] = [
  {
    key: "que-es", nombre: "El cable más largo", color: "#b8d98f", foto: SUB("nerviovago", "nerviovago1"),
    eyebrow: "Qué es",
    claves: ["El nervio más largo", "Conecta cerebro y órganos", "Del corazón al intestino"],
    explicacion: [
      "El nervio vago es el más largo del sistema nervioso autónomo: sale del cerebro y llega al corazón, los pulmones y casi todo el aparato digestivo.",
      "Es la principal vía de comunicación entre el cerebro y los órganos internos.",
    ],
  },
  {
    key: "parasimpatico", nombre: "El modo «calma»", color: "#9fe6b8", foto: SUB("nerviovago", "nerviovago2"),
    eyebrow: "Reposo y digestión",
    claves: ["El modo «reposo y digestión»", "Frena el corazón y relaja", "Contrapeso del estrés"],
    explicacion: [
      "Es la cara principal del sistema parasimpático, el de «reposo y digestión»: frena el corazón, favorece la digestión y te relaja.",
      "Es el contrapeso del estrés: cuando se activa, el cuerpo se recupera.",
    ],
  },
  {
    key: "intestino-cerebro", nombre: "Eje intestino-cerebro", color: "#a7d9f2", foto: SUB("nerviovago", "nerviovago3"),
    eyebrow: "Dos cerebros hablando",
    claves: ["El intestino habla por el vago", "Lleva señales de la microbiota", "Influye en tu ánimo"],
    explicacion: [
      "Gran parte de la información que sube del intestino al cerebro viaja por el vago, incluidas señales de la microbiota.",
      "Por eso el intestino influye en el ánimo, y las emociones se notan en el estómago.",
    ],
  },
  {
    key: "tono", nombre: "El tono vagal", color: "#c9a7ff", foto: SUB("nerviovago", "nerviovago4"),
    eyebrow: "Se puede entrenar",
    claves: ["Recuperar la calma rápido", "Se entrena: respira, frío, canta", "Mejora estrés y descanso"],
    explicacion: [
      "Un buen «tono vagal» significa que recuperas la calma con facilidad tras el estrés. Se entrena: respiración lenta, exhalar largo, exponerse al frío, cantar.",
      "Cuidarlo mejora la gestión del estrés y el descanso.",
    ],
  },
  {
    key: "corazon", nombre: "El freno del corazón", color: "#f2b48f", foto: SUB("nerviovago", "nerviovago5"),
    eyebrow: "Variabilidad cardíaca",
    claves: ["Frena el corazón en reposo", "Marca la variabilidad cardíaca", "Más variabilidad, mejor salud"],
    explicacion: [
      "El vago marca el ritmo de base del corazón: lo frena en reposo. La variabilidad de tu frecuencia cardíaca refleja lo bien que funciona.",
      "Una mayor variabilidad suele ser señal de buena salud y buena recuperación.",
    ],
  },
];

// ═════════════════════════════════════════════════════════════════════════
// Los temas de PROFUNDIZA, agrupados en 3 bloques para el hub.
// Neurotransmisores lleva cómic de intro; el resto ya tienen sus fichas con un
// primer texto de desarrollo (María los revisará para darles profundidad).
// ═════════════════════════════════════════════════════════════════════════
export const GRUPOS_PROFUNDIZA = [
  "Química interna",
  "El código y la limpieza",
  "Vida y muerte celular",
] as const;

export const TEMAS_PROFUNDIZA: TemaProfundiza[] = [
  // ── Bloque 1 · Química interna ──
  {
    key: "neurotransmisores",
    label: "Neurotransmisores",
    resumen: "Los mensajeros de tu cerebro.",
    color: "#c9a7ff",
    foto: PORTADA("portadaneurotransmisores"),
    grupo: "Química interna",
    intro: "Pequeñas moléculas que llevan un mensaje de una neurona a otra.",
    comicIntro: NEUROTRANSMISORES_SINTESIS,
    fichasColoreadas: true,
    fichas: NEUROTRANSMISORES,
  },
  {
    key: "hormonas",
    label: "Hormonas",
    resumen: "Mensajeros que viajan por la sangre.",
    color: "#e6a7d9",
    foto: PORTADA("portadahormonas"),
    grupo: "Química interna",
    intro: "Tus órganos se comunican a través de las hormonas; por eso, todo en tu cuerpo está conectado.",
    comicIntro: [], // «Cómo se sintetiza una hormona» — pendiente
    pista: "Pulsa cada hormona para leer qué hace en tu cuerpo.",
    fichasColoreadas: true,
    fichas: HORMONAS,
  },
  {
    key: "metabolismo",
    label: "Metabolismo",
    resumen: "De lo que comes a la energía.",
    color: "#f2c86b",
    foto: PORTADA("metabolismoportada"),
    grupo: "Química interna",
    intro: "La respiración celular: cómo tus células convierten la comida (sobre todo la glucosa) en ATP, la energía que te mantiene en marcha.",
    pista: "",
    fichas: METABOLISMO,
  },

  // ── Bloque 2 · El código y la limpieza ──
  {
    key: "epigenetica",
    label: "Expresión génica y epigenética",
    resumen: "Mismo ADN, células distintas.",
    color: "#a7d9f2",
    foto: PORTADA("epigeneticaportada"),
    grupo: "El código y la limpieza",
    intro: "Una neurona y un hepatocito tienen el MISMO ADN, pero funciones opuestas. ¿Cómo? Encendiendo y apagando genes distintos.",
    pista: "",
    fichas: EPIGENETICA,
  },
  {
    key: "detoxificacion",
    label: "Detoxificación del hígado",
    resumen: "Cómo limpia tu cuerpo lo que no sirve.",
    color: "#f2b48f",
    foto: PORTADA("detoxificacionportada"),
    grupo: "El código y la limpieza",
    intro: "Tu hígado desactiva medicamentos, alcohol y toxinas en dos fases y los prepara para eliminarlos.",
    pista:"",
    fichas: DETOXIFICACION,
  },
  {
    key: "estres-oxidativo",
    label: "Estrés oxidativo y antioxidantes",
    resumen: "Radicales libres y cómo te defiendes.",
    color: "#f28b8b",
    foto: PORTADA("estresportada"),
    grupo: "El código y la limpieza",
    intro: "Cuando te da el sol o generas energía, aparecen radicales libres que dañan las células. Tu cuerpo tiene su propio ejército antioxidante.",
    pista: "",
    fichas: ESTRES_OXIDATIVO,
  },

  // ── Bloque 3 · Vida y muerte celular ──
  {
    key: "inmunitario",
    label: "Sistema inmunitario",
    resumen: "El baile entre las células.",
    color: "#9fe6b8",
    foto: PORTADA("inmunitarioportada"),
    grupo: "Vida y muerte celular",
    intro: "Cuando entra un patógeno, tus defensas responden por oleadas, coordinándose como en una coreografía.",
    pista: "",
    fichas: INMUNITARIO,
  },
  {
    key: "envejecimiento",
    label: "Envejecimiento celular",
    resumen: "Telómeros, senescencia y desgaste.",
    color: "#e8e0cf",
    foto: PORTADA("envejecimiento"),
    grupo: "Vida y muerte celular",
    intro: "Por qué las células envejecen: el reloj de los telómeros, las células que se «jubilan» y el desgaste oxidativo.",
    pista: "",
    fichas: ENVEJECIMIENTO,
  },
  {
    key: "apoptosis",
    label: "Apoptosis y necrosis",
    resumen: "Las dos formas de morir de una célula.",
    color: "#c9a7ff",
    foto: PORTADA("apoptosis"),
    grupo: "Vida y muerte celular",
    intro: "Una célula puede apagarse de forma ordenada y programada (apoptosis) o morir de golpe por una lesión (necrosis). No es lo mismo.",
    pista: "",
    fichas: APOPTOSIS,
  },
  {
    key: "regeneracion",
    label: "Regeneración",
    resumen: "Cuando te haces una herida.",
    color: "#f2b48f",
    foto: PORTADA("regeneracion"),
    grupo: "Vida y muerte celular",
    intro: "Cómo tu cuerpo cierra una herida, paso a paso, hasta dejar apenas una cicatriz.",
    pista: "",
    fichas: REGENERACION,
  },
  {
    key: "homeostasis",
    label: "Homeostasis",
    resumen: "El cuerpo siempre buscando el equilibrio.",
    color: "#8fd0e6",
    foto: PORTADA("homeostasis"),
    grupo: "Vida y muerte celular",
    intro: "Cómo tu cuerpo mantiene constantes la temperatura, la glucosa, el pH y la presión, pase lo que pase fuera.",
    pista: "",
    fichas: HOMEOSTASIS,
  },
  {
    key: "nervio-vago",
    label: "Nervio vago",
    resumen: "El cable que te calma.",
    color: "#b8d98f",
    foto: PORTADA("nerviovago"),
    grupo: "Vida y muerte celular",
    intro: "El nervio más largo del sistema nervioso autónomo: conecta el cerebro con el corazón, los pulmones y el intestino, y es la llave de la calma.",
    pista: "",
    fichas: NERVIO_VAGO,
  },
];

export function temaByKey(key: string): TemaProfundiza | undefined {
  return TEMAS_PROFUNDIZA.find((t) => t.key === key);
}
