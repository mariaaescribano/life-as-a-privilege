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
  /** Las cajas del tema. Vacío = apartado en construcción. */
  fichas: Ficha[];
};

const FOTO = (k: string) => `/recorrido/fisiologia/profundiza/${k}.png`;
const NT = (k: string) => `/recorrido/fisiologia/profundiza/neurotransmisores/${k}.png`;
// Foto de una ficha dentro de la subcarpeta de su tema (María las irá subiendo;
// mientras no existan, cada caja muestra la inicial del nombre).
const SUB = (tema: string, k: string) => `/recorrido/fisiologia/profundiza/${tema}/${k}.png`;

// ── Cómic «Cómo se sintetiza un neurotransmisor» ───────────────────────────
// Imágenes: /viñetas/fisiologia/neurotransmisores/nt1.png … nt6.png
// (mientras no existan, el ComicViewer pinta un placeholder «próximamente»).
const NEUROTRANSMISORES_SINTESIS: Vineta[] = [
  {
    src: "/viñetas/fisiologia/neurotransmisores/nt1.png",
    eyebrow: "La materia prima",
    paragraphs: [
      "Todo empieza en tu plato.",
      "Muchos neurotransmisores nacen de aminoácidos que sacas de la comida: el triptófano, la tirosina…",
      "Son los ladrillos con los que tu cerebro fabricará sus mensajeros.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurotransmisores/nt2.png",
    eyebrow: "La cadena de montaje",
    paragraphs: [
      "El aminoácido viaja hasta la neurona. Dentro, unas enzimas lo transforman paso a paso, como en una fábrica.",
      "Así la tirosina acaba convertida en dopamina; el triptófano, en serotonina.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurotransmisores/nt3.png",
    eyebrow: "Guardados y listos",
    paragraphs: [
      "El neurotransmisor recién fabricado se guarda en pequeñas bolsas: las vesículas.",
      "Esperan cargadas en el extremo de la neurona, listas para disparar.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurotransmisores/nt4.png",
    eyebrow: "La chispa",
    paragraphs: [
      "Llega un impulso eléctrico.",
      "Las vesículas se fusionan con la membrana y liberan el neurotransmisor al pequeño espacio entre dos neuronas: la sinapsis.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurotransmisores/nt5.png",
    eyebrow: "El mensaje",
    paragraphs: [
      "El neurotransmisor cruza y encaja en su receptor, como una llave en su cerradura.",
      "Ese encaje ES el mensaje: la neurona siguiente lo recibe y reacciona.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurotransmisores/nt6.png",
    eyebrow: "Apagar y reciclar",
    paragraphs: [
      "Después, el mensaje se apaga.",
      "Parte del neurotransmisor se recicla de vuelta a la neurona (recaptación) y parte se degrada.",
      "Todo queda limpio para el siguiente pensamiento.",
    ],
  },
];

// ── Las fichas de Neurotransmisores ────────────────────────────────────────
const NEUROTRANSMISORES: Ficha[] = [
  {
    key: "dopamina", nombre: "Dopamina", color: "#f2c86b", foto: NT("dopamina"),
    eyebrow: "Motivación y recompensa",
    explicacion: [
      "Es el neurotransmisor del «quiero eso». No es el del placer, sino el que te motiva para conseguirlo.",
      "Impulsa la motivación, el deseo, el aprendizaje por recompensa y la sensación de anticipación cuando persigues algo que te importa.",
      "Cuándo la notas: esa chispa de ganas al empezar un proyecto, el subidón al pensar en lograr una meta o el impulso que sientes al mirar las notificaciones del móvil.",
    ],
  },
  {
    key: "serotonina", nombre: "Serotonina", color: "#9fe6b8", foto: NT("serotonina"),
    eyebrow: "Ánimo y calma",
    explicacion: [
      "Gran parte de la serotonina del organismo se produce en el intestino gracias a las células intestinales, influenciadas por la microbiota y por los alimentos que comemos. En el cerebro regula el estado de ánimo, la calma y la sensación de bienestar. También participa en el sueño, el apetito y la digestión.",
      "Cuándo la notas: esa paz serena tras un paseo matutino, sentirte a gusto contigo mismo, dormir bien o la sensación de bienestar después de comer saludablemente.",
    ],
  },
  {
    key: "gaba", nombre: "GABA", color: "#a7d9f2", foto: NT("gaba"),
    eyebrow: "El freno",
    explicacion: [
      "Cuando estás muy estresado, para evitar un desbordamiento, algunas neuronas liberan GABA, el principal freno del cerebro. Reduce la actividad de otras neuronas para que todo no se dispare a la vez.",
      "Cuándo lo notas: cuando por fin te relajas, bajas revoluciones y la mente deja de correr. Poco GABA suele asociarse con ansiedad, tensión o dificultad para desconectar.",
      "Como curiosidad: actúa abriendo canales por los que entra cloro en la neurona, haciendo mucho más difícil que vuelva a activarse.",
    ],
  },
  {
    key: "glutamato", nombre: "Glutamato", color: "#f28b8b", foto: NT("glutamato"),
    eyebrow: "El acelerador",
    explicacion: [
      "El opuesto del GABA: es el principal neurotransmisor excitador del cerebro. Activa las neuronas y es clave para el aprendizaje, la memoria y la plasticidad cerebral.",
      "Cuándo lo notas: cuando estás despierto, atento y aprendiendo algo nuevo. El equilibrio entre glutamato (acelerador) y GABA (freno) mantiene tu cerebro afinado.",
    ],
  },
  {
    key: "acetilcolina", nombre: "Acetilcolina", color: "#c9a7ff", foto: NT("acetilcolina"),
    eyebrow: "Músculo y memoria",
    explicacion: [
      "Une el cerebro con los músculos: cada vez que mueves un dedo, es la acetilcolina la que transmite la orden desde la neurona al músculo y desencadena la liberación del calcio necesario para que la fibra muscular se contraiga. Además, es esencial para la atención, el aprendizaje y la memoria.",
      "Cuándo la notas: en cada movimiento voluntario y cuando estás concentrado y con la mente despierta.",
    ],
  },
  {
    key: "noradrenalina", nombre: "Noradrenalina", color: "#f2b48f", foto: NT("noradrenalina"),
    eyebrow: "Alerta y foco",
    explicacion: [
      "Te pone en modo alerta: aumenta la atención, la energía y la capacidad de reaccionar ante el estrés. Es prima de la adrenalina, pero actúa principalmente como neurotransmisor dentro del cerebro.",
      "Cuándo la notas: ante un susto o un reto, cuando el corazón se acelera y de repente lo ves todo más nítido y enfocado.",
    ],
  },
  {
    key: "endorfinas", nombre: "Endorfinas", color: "#e6a7d9", foto: NT("endorfinas"),
    eyebrow: "Alivio y euforia",
    explicacion: [
      "Son los analgésicos naturales del cuerpo: reducen el dolor y producen una sensación de alivio y bienestar. También se liberan durante el ejercicio intenso, la risa, el contacto social e incluso en situaciones de estrés para ayudarnos a soportarlo.",
      "Cuándo las notas: el «subidón del corredor» tras el ejercicio, una carcajada o ese bienestar cálido después de un buen esfuerzo.",
    ],
  },
  {
    key: "oxitocina", nombre: "Oxitocina", color: "#b8d98f", foto: NT("oxitocina"),
    eyebrow: "Vínculo y confianza",
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
    key: "insulina", nombre: "Insulina", color: "#9fe6b8", foto: SUB("hormonas", "insulina"),
    eyebrow: "Páncreas · baja el azúcar",
    explicacion: [
      "La fabrica el páncreas cuando sube la glucosa en sangre, por ejemplo después de comer. Es la llave que abre las células para que la glucosa entre y se use como energía o se guarde.",
      "Cuándo importa: si las células dejan de responderle bien (resistencia a la insulina), la glucosa se queda en la sangre y aparece, con el tiempo, la diabetes tipo 2.",
    ],
  },
  {
    key: "glucagon", nombre: "Glucagón", color: "#f2c86b", foto: SUB("hormonas", "glucagon"),
    eyebrow: "Páncreas · sube el azúcar",
    explicacion: [
      "Es la contraparte de la insulina. Cuando la glucosa baja (ayuno, ejercicio), el páncreas libera glucagón para que el hígado suelte glucosa guardada y mantenga estable el nivel en sangre.",
      "Juntas, insulina y glucagón mantienen tu azúcar en un margen estrecho, subiéndolo o bajándolo según haga falta.",
    ],
  },
  {
    key: "cortisol", nombre: "Cortisol", color: "#f2b48f", foto: SUB("hormonas", "cortisol"),
    eyebrow: "Suprarrenal · el estrés",
    explicacion: [
      "Las glándulas suprarrenales lo liberan ante el estrés y también siguiendo un ritmo diario: sube por la mañana para despertarte y baja por la noche. Moviliza energía y te pone en alerta.",
      "Cuándo importa: útil en momentos puntuales, pero mantenerlo alto durante meses (estrés crónico, dormir mal) desgasta el cuerpo, sube el azúcar y baja las defensas.",
    ],
  },
  {
    key: "adrenalina", nombre: "Adrenalina", color: "#f28b8b", foto: SUB("hormonas", "adrenalina"),
    eyebrow: "Suprarrenal · la reacción inmediata",
    explicacion: [
      "Es la hormona del «lucha o huye». Ante un peligro, en segundos acelera el corazón, dilata las pupilas y libera energía para reaccionar.",
      "Cuándo la notas: ese vuelco cuando te asustas o el corazón a mil antes de hablar en público.",
    ],
  },
  {
    key: "tiroideas", nombre: "Hormonas tiroideas", color: "#a7d9f2", foto: SUB("hormonas", "tiroideas"),
    eyebrow: "Tiroides · el acelerador",
    explicacion: [
      "Las hormonas tiroideas (T3 y T4) marcan la velocidad a la que funcionan tus células: el gasto de energía, la temperatura y el ritmo del corazón.",
      "Cuándo importa: demasiadas aceleran todo (nerviosismo, pérdida de peso); pocas lo frenan todo (cansancio, frío, lentitud).",
    ],
  },
  {
    key: "testosterona", nombre: "Testosterona", color: "#e6c07f", foto: SUB("hormonas", "testosterona"),
    eyebrow: "Gónadas · fuerza y desarrollo",
    explicacion: [
      "Presente en ambos sexos, aunque más alta en hombres. Interviene en el desarrollo muscular y óseo, el deseo sexual, la energía y el ánimo.",
      "Se produce sobre todo en los testículos y, en menor cantidad, en ovarios y glándulas suprarrenales.",
    ],
  },
  {
    key: "estrogenos", nombre: "Estrógenos", color: "#e6a7d9", foto: SUB("hormonas", "estrogenos"),
    eyebrow: "Gónadas · el ciclo y mucho más",
    explicacion: [
      "Principales hormonas sexuales femeninas. Regulan el ciclo menstrual y la fertilidad, pero también protegen los huesos, el corazón y el cerebro.",
      "Cuándo importa: su caída en la menopausia explica muchos cambios, desde los huesos hasta el estado de ánimo.",
    ],
  },
  {
    key: "progesterona", nombre: "Progesterona", color: "#e0b7e0", foto: SUB("hormonas", "progesterona"),
    eyebrow: "Gónadas · calma y embarazo",
    explicacion: [
      "Es la otra gran hormona sexual femenina. Prepara el útero para un posible embarazo y lo sostiene si ocurre; sube en la segunda mitad del ciclo menstrual.",
      "También tiene un efecto calmante sobre el cerebro. Sus vaivenes explican parte de los cambios de ánimo y sueño a lo largo del ciclo.",
    ],
  },
  {
    key: "melatonina", nombre: "Melatonina", color: "#c9a7ff", foto: SUB("hormonas", "melatonina"),
    eyebrow: "Pineal · el sueño",
    explicacion: [
      "La glándula pineal la libera cuando cae la luz: es la señal de que llega la noche y toca dormir. Sincroniza tu reloj interno con el día y la noche.",
      "Cuándo importa: la luz de las pantallas por la noche frena su producción y te cuesta más dormir.",
    ],
  },
  {
    key: "crecimiento", nombre: "Hormona del crecimiento", color: "#9ab6f0", foto: SUB("hormonas", "crecimiento"),
    eyebrow: "Hipófisis · reparar y crecer",
    explicacion: [
      "La hipófisis la libera sobre todo durante el sueño profundo y el ejercicio. Estimula el crecimiento en la infancia y, de adulto, la reparación de tejidos y músculo.",
      "Cuándo importa: dormir bien es, literalmente, cuando más te reparas.",
    ],
  },
];

// ── Metabolismo (de la comida a la energía) ──────────────────────────────────
const METABOLISMO: Ficha[] = [
  {
    key: "atp", nombre: "ATP", color: "#f2c86b", foto: SUB("metabolismo", "atp"),
    eyebrow: "La moneda de energía",
    explicacion: [
      "El ATP es la moneda energética de la célula: la energía de los alimentos se convierte en ATP, y las células lo gastan para todo (moverse, fabricar, bombear).",
      "Fabricas y gastas casi tu peso corporal en ATP cada día; apenas se almacena, se produce al momento según lo necesitas.",
    ],
  },
  {
    key: "glucolisis", nombre: "Glucólisis", color: "#e6a7d9", foto: SUB("metabolismo", "glucolisis"),
    eyebrow: "La vía rápida",
    explicacion: [
      "Es el primer paso: en el citoplasma, la glucosa se parte en dos y se obtiene algo de ATP rápido, sin necesidad de oxígeno.",
      "Es la energía exprés: la que usas en un esfuerzo corto e intenso, como un sprint.",
    ],
  },
  {
    key: "mitocondria", nombre: "Respiración celular", color: "#f28b8b", foto: SUB("metabolismo", "mitocondria"),
    eyebrow: "La central de energía",
    explicacion: [
      "En la mitocondria, y con oxígeno, se extrae casi toda la energía de los nutrientes en la cadena respiratoria. Es la parte lenta pero muchísimo más rentable.",
      "Por eso el oxígeno es vital: sin él, las células solo pueden usar la vía rápida y sacan muy poca energía.",
    ],
  },
  {
    key: "glucogeno", nombre: "Glucógeno", color: "#9fe6b8", foto: SUB("metabolismo", "glucogeno"),
    eyebrow: "La despensa rápida",
    explicacion: [
      "El cuerpo guarda glucosa en forma de glucógeno en el hígado y los músculos. Es la reserva a la que recurre entre comidas o durante el ejercicio.",
      "El del hígado mantiene estable el azúcar en sangre; el del músculo es combustible para ese propio músculo.",
    ],
  },
  {
    key: "grasa-cetosis", nombre: "Grasa y cetosis", color: "#e6c07f", foto: SUB("metabolismo", "grasa-cetosis"),
    eyebrow: "La reserva a largo plazo",
    explicacion: [
      "Cuando sobra energía, se guarda como grasa: la reserva más grande y duradera del cuerpo. En ayuno prolongado, el hígado transforma grasa en cuerpos cetónicos, un combustible alternativo para el cerebro.",
      "Por eso puedes aguantar mucho tiempo sin comer: tu cuerpo cambia de combustible.",
    ],
  },
  {
    key: "anabolismo", nombre: "Construir y romper", color: "#a7d9f2", foto: SUB("metabolismo", "anabolismo"),
    eyebrow: "Anabolismo y catabolismo",
    explicacion: [
      "El metabolismo tiene dos caras: el catabolismo rompe moléculas para sacar energía, y el anabolismo usa energía para construir (músculo, tejidos, reservas).",
      "Tu cuerpo alterna entre ambos según comas o ayunes, descanses o te esfuerces.",
    ],
  },
  {
    key: "basal", nombre: "Metabolismo basal", color: "#c9a7ff", foto: SUB("metabolismo", "basal"),
    eyebrow: "El gasto en reposo",
    explicacion: [
      "Es la energía que gastas solo por estar vivo: respirar, latir, mantener la temperatura. Suele ser la mayor parte de lo que gastas al día.",
      "Depende sobre todo de tu masa muscular, la edad y la genética; por eso tener músculo ayuda a gastar más incluso en reposo.",
    ],
  },
];

// ── Expresión génica y epigenética ───────────────────────────────────────────
const EPIGENETICA: Ficha[] = [
  {
    key: "metilacion", nombre: "Metilación del ADN", color: "#a7d9f2", foto: SUB("epigenetica", "metilacion"),
    eyebrow: "El interruptor de apagado",
    explicacion: [
      "Añadir pequeñas marcas químicas (grupos metilo) sobre el ADN suele silenciar un gen: sigue ahí, pero no se lee.",
      "Así una célula del hígado y una neurona, con el mismo ADN, apagan y encienden genes distintos y acaban siendo tan diferentes.",
    ],
  },
  {
    key: "histonas", nombre: "Histonas", color: "#9ab6f0", foto: SUB("epigenetica", "histonas"),
    eyebrow: "Empaquetar para esconder o mostrar",
    explicacion: [
      "El ADN se enrolla en proteínas llamadas histonas. Si se enrolla apretado, el gen queda escondido; si se afloja, queda accesible para leerse.",
      "Modificar las histonas es otra forma de decidir qué partes del manual están a mano y cuáles guardadas.",
    ],
  },
  {
    key: "factores", nombre: "Factores de transcripción", color: "#9fe6b8", foto: SUB("epigenetica", "factores"),
    eyebrow: "Quién decide qué se lee",
    explicacion: [
      "Son proteínas que se pegan al ADN y activan o frenan la lectura de genes concretos, como interruptores que responden a señales de dentro y de fuera.",
      "Gracias a ellos la célula ajusta en tiempo real qué proteínas fabrica según lo que necesita.",
    ],
  },
  {
    key: "ambiente", nombre: "El ambiente enciende genes", color: "#f2c86b", foto: SUB("epigenetica", "ambiente"),
    eyebrow: "Tu vida deja huella",
    explicacion: [
      "La alimentación, el ejercicio, el estrés, el sueño o el tabaco pueden cambiar estas marcas epigenéticas y, con ellas, qué genes se expresan.",
      "No cambian tu ADN, pero sí cómo se usa: tus hábitos hablan con tus genes cada día.",
    ],
  },
  {
    key: "herencia", nombre: "Herencia epigenética", color: "#e6a7d9", foto: SUB("epigenetica", "herencia"),
    eyebrow: "A veces se hereda",
    explicacion: [
      "Algunas marcas epigenéticas pueden pasar de una generación a otra, de modo que las experiencias de los padres podrían influir un poco en los hijos.",
      "Es un campo joven y apasionante: sugiere que el entorno deja una huella que va más allá de una sola vida.",
    ],
  },
];

// ── Detoxificación del hígado ────────────────────────────────────────────────
const DETOXIFICACION: Ficha[] = [
  {
    key: "fase-1", nombre: "Fase I · transformar", color: "#f2c86b", foto: SUB("detoxificacion", "fase-1"),
    eyebrow: "Abrir el paquete",
    explicacion: [
      "Unas enzimas del hígado (el grupo citocromo P450) modifican las sustancias tóxicas para hacerlas más manejables. A veces, de paso, las vuelven momentáneamente más reactivas.",
      "Es como abrir el paquete: prepara la toxina para el siguiente paso.",
    ],
  },
  {
    key: "fase-2", nombre: "Fase II · neutralizar", color: "#9fe6b8", foto: SUB("detoxificacion", "fase-2"),
    eyebrow: "Hacerlas inofensivas",
    explicacion: [
      "El hígado une esas sustancias a otras moléculas (conjugación) para volverlas solubles en agua e inofensivas.",
      "Necesita materias primas que vienen de la dieta (aminoácidos, antioxidantes); por eso comer bien apoya este proceso.",
    ],
  },
  {
    key: "fase-3", nombre: "Fase III · eliminar", color: "#a7d9f2", foto: SUB("detoxificacion", "fase-3"),
    eyebrow: "Sacarlas fuera",
    explicacion: [
      "Ya neutralizadas, las sustancias se expulsan: por la orina (riñón) o por la bilis hacia el intestino y las heces.",
      "La fibra ayuda a arrastrarlas fuera y evita que se reabsorban.",
    ],
  },
  {
    key: "glutation", nombre: "Glutatión", color: "#c9a7ff", foto: SUB("detoxificacion", "glutation"),
    eyebrow: "El antioxidante maestro",
    explicacion: [
      "Es la molécula estrella de la desintoxicación y la defensa antioxidante del hígado: neutraliza tóxicos y radicales libres.",
      "El cuerpo lo fabrica, pero se gasta con el alcohol, los tóxicos y el estrés oxidativo.",
    ],
  },
  {
    key: "mito-detox", nombre: "Los «detox» de moda", color: "#f2b48f", foto: SUB("detoxificacion", "mito-detox"),
    eyebrow: "Lo que de verdad ayuda",
    explicacion: [
      "Tu hígado y tus riñones ya te desintoxican cada segundo, mejor que cualquier zumo o producto «detox».",
      "Lo que sí ayuda es no sobrecargarlos: menos alcohol y ultraprocesados, y más agua, fibra, sueño y verduras.",
    ],
  },
];

// ── Estrés oxidativo y antioxidantes ─────────────────────────────────────────
const ESTRES_OXIDATIVO: Ficha[] = [
  {
    key: "radicales", nombre: "Radicales libres", color: "#f28b8b", foto: SUB("estres-oxidativo", "radicales"),
    eyebrow: "Moléculas inestables (ROS)",
    explicacion: [
      "Son moléculas inestables que se generan al producir energía o al recibir radiación (el sol). Les falta un electrón y lo «roban» a otras moléculas, dañándolas.",
      "No todos son malos: en pequeña cantidad sirven de señal y defensa. El problema es el exceso.",
    ],
  },
  {
    key: "dano", nombre: "El daño oxidativo", color: "#f2b48f", foto: SUB("estres-oxidativo", "dano"),
    eyebrow: "Cuando se acumula",
    explicacion: [
      "En exceso, los radicales libres dañan el ADN, las grasas de las membranas y las proteínas. Ese desgaste, sumado con los años, acelera el envejecimiento.",
      "Se relaciona con arrugas, arterias más rígidas y varias enfermedades crónicas.",
    ],
  },
  {
    key: "antioxidantes-propios", nombre: "Tu ejército interno", color: "#9fe6b8", foto: SUB("estres-oxidativo", "antioxidantes-propios"),
    eyebrow: "Antioxidantes propios",
    explicacion: [
      "El cuerpo fabrica sus propios antioxidantes (glutatión, superóxido dismutasa, catalasa) que neutralizan los radicales antes de que hagan daño.",
      "Es tu primera y principal defensa; la dieta solo complementa.",
    ],
  },
  {
    key: "antioxidantes-dieta", nombre: "Los de la comida", color: "#a7d9f2", foto: SUB("estres-oxidativo", "antioxidantes-dieta"),
    eyebrow: "Antioxidantes de la dieta",
    explicacion: [
      "Vitamina C, vitamina E y los polifenoles de frutas, verduras, té o aceite de oliva ayudan a frenar el daño oxidativo.",
      "Mejor de alimentos reales que en pastillas: en dosis altas, los suplementos antioxidantes no siempre ayudan e incluso pueden estorbar.",
    ],
  },
  {
    key: "hormesis", nombre: "Hormesis", color: "#f2c86b", foto: SUB("estres-oxidativo", "hormesis"),
    eyebrow: "Un poco de estrés te fortalece",
    explicacion: [
      "El ejercicio genera radicales libres… y aun así es sano: ese pequeño estrés entrena a tus defensas antioxidantes para ser más fuertes.",
      "Es la hormesis: dosis pequeñas de un reto te hacen más resistente.",
    ],
  },
];

// ── Sistema inmunitario ──────────────────────────────────────────────────────
const INMUNITARIO: Ficha[] = [
  {
    key: "innata", nombre: "Inmunidad innata", color: "#f2c86b", foto: SUB("inmunitario", "innata"),
    eyebrow: "Primera línea",
    explicacion: [
      "Es la defensa rápida y general: la piel, las mucosas y células como los macrófagos y neutrófilos que atacan a cualquier intruso en cuestión de minutos.",
      "No distingue al enemigo con precisión, pero gana tiempo mientras se prepara la respuesta específica.",
    ],
  },
  {
    key: "adaptativa", nombre: "Inmunidad adaptativa", color: "#9ab6f0", foto: SUB("inmunitario", "adaptativa"),
    eyebrow: "Defensa a medida",
    explicacion: [
      "Los linfocitos B y T aprenden a reconocer un patógeno concreto: los B fabrican anticuerpos y los T destruyen las células infectadas.",
      "Tarda unos días la primera vez, pero es precisa y deja memoria.",
    ],
  },
  {
    key: "inflamacion", nombre: "La inflamación", color: "#f28b8b", foto: SUB("inmunitario", "inflamacion"),
    eyebrow: "La señal de alarma",
    explicacion: [
      "La zona se enrojece, se hincha y duele porque llegan sangre y células de defensa para reparar y combatir.",
      "Útil y necesaria a corto plazo; dañina si se vuelve crónica, pues se asocia a muchas enfermedades.",
    ],
  },
  {
    key: "memoria", nombre: "Memoria y vacunas", color: "#9fe6b8", foto: SUB("inmunitario", "memoria"),
    eyebrow: "Aprender del pasado",
    explicacion: [
      "Tras vencer a un patógeno, el cuerpo guarda células de memoria: la próxima vez responde en horas. En eso se basan las vacunas.",
      "Una vacuna enseña al sistema inmunitario sin que tengas que pasar la enfermedad.",
    ],
  },
  {
    key: "autoinmunidad", nombre: "Autoinmunidad", color: "#c9a7ff", foto: SUB("inmunitario", "autoinmunidad"),
    eyebrow: "Cuando se confunde",
    explicacion: [
      "A veces el sistema inmunitario ataca por error a células propias: eso es la autoinmunidad (como en la diabetes tipo 1 o la tiroiditis).",
      "Distinguir lo propio de lo ajeno es uno de sus mayores retos.",
    ],
  },
  {
    key: "fiebre", nombre: "La fiebre", color: "#f2b48f", foto: SUB("inmunitario", "fiebre"),
    eyebrow: "Un arma, no un fallo",
    explicacion: [
      "Subir la temperatura no es un error: dificulta la vida a muchos microbios y acelera tus defensas.",
      "Por eso la fiebre moderada suele ser una aliada, no una enemiga.",
    ],
  },
];

// ── Envejecimiento celular ───────────────────────────────────────────────────
const ENVEJECIMIENTO: Ficha[] = [
  {
    key: "telomeros", nombre: "Telómeros", color: "#a7d9f2", foto: SUB("envejecimiento", "telomeros"),
    eyebrow: "El reloj de las divisiones",
    explicacion: [
      "Son los extremos protectores de los cromosomas. Cada vez que una célula se divide, se acortan un poco.",
      "Cuando se hacen demasiado cortos, la célula deja de dividirse: es uno de los relojes del envejecimiento.",
    ],
  },
  {
    key: "senescencia", nombre: "Senescencia", color: "#c9a7ff", foto: SUB("envejecimiento", "senescencia"),
    eyebrow: "Células «zombie»",
    explicacion: [
      "Algunas células dañadas ni mueren ni se dividen: se «jubilan» (senescencia) pero siguen ahí, liberando señales inflamatorias.",
      "Acumuladas con los años, ensucian el tejido y aceleran el envejecimiento de su alrededor.",
    ],
  },
  {
    key: "mitocondrias", nombre: "Motores que se desgastan", color: "#f28b8b", foto: SUB("envejecimiento", "mitocondrias"),
    eyebrow: "Mitocondrias cansadas",
    explicacion: [
      "Con la edad, las mitocondrias funcionan peor y generan más radicales libres, lo que a su vez las daña más: un círculo vicioso.",
      "Menos energía celular es una de las razones del cansancio y la pérdida de función con los años.",
    ],
  },
  {
    key: "inflammaging", nombre: "Inflamación de fondo", color: "#f2b48f", foto: SUB("envejecimiento", "inflammaging"),
    eyebrow: "«Inflammaging»",
    explicacion: [
      "El envejecimiento se acompaña de una inflamación crónica de bajo grado, silenciosa, que va deteriorando los tejidos.",
      "Se relaciona con muchas de las enfermedades propias de la edad.",
    ],
  },
  {
    key: "autofagia", nombre: "Autofagia", color: "#9fe6b8", foto: SUB("envejecimiento", "autofagia"),
    eyebrow: "El reciclaje que te cuida",
    explicacion: [
      "Es el sistema de reciclaje de la célula: elimina piezas viejas o dañadas y reutiliza sus materiales.",
      "El ejercicio y el ayuno la estimulan; mantenerla activa ayuda a envejecer mejor.",
    ],
  },
];

// ── Apoptosis y necrosis ─────────────────────────────────────────────────────
const APOPTOSIS: Ficha[] = [
  {
    key: "apoptosis", nombre: "Apoptosis", color: "#9fe6b8", foto: SUB("apoptosis", "apoptosis"),
    eyebrow: "Morir con orden",
    explicacion: [
      "Es la muerte celular programada: la célula se desmonta de forma limpia y ordenada, y sus restos se reciclan sin dañar a las vecinas.",
      "Es una muerte útil y silenciosa, planificada por el propio cuerpo.",
    ],
  },
  {
    key: "necrosis", nombre: "Necrosis", color: "#f28b8b", foto: SUB("apoptosis", "necrosis"),
    eyebrow: "Morir de golpe",
    explicacion: [
      "Es la muerte por lesión (un golpe, falta de oxígeno, una toxina): la célula se rompe de forma descontrolada y su contenido se derrama.",
      "Eso provoca inflamación alrededor, a diferencia de la apoptosis.",
    ],
  },
  {
    key: "util", nombre: "Por qué es necesaria", color: "#a7d9f2", foto: SUB("apoptosis", "util"),
    eyebrow: "Una muerte que da vida",
    explicacion: [
      "La apoptosis esculpe el cuerpo (por ejemplo, separa los dedos en el embrión) y elimina células viejas, dañadas o peligrosas.",
      "Cada día mueren así miles de millones de células tuyas, y no lo notas.",
    ],
  },
  {
    key: "cancer", nombre: "Cuando falla: el cáncer", color: "#c9a7ff", foto: SUB("apoptosis", "cancer"),
    eyebrow: "Células que no obedecen",
    explicacion: [
      "Si una célula dañada esquiva la apoptosis, puede seguir dividiéndose sin control: ese es uno de los orígenes del cáncer.",
      "Muchos tratamientos buscan, precisamente, reactivar la orden de morir en esas células.",
    ],
  },
];

// ── Regeneración (cerrar una herida, paso a paso) ─────────────────────────────
const REGENERACION: Ficha[] = [
  {
    key: "hemostasia", nombre: "1 · Detener la sangre", color: "#f28b8b", foto: SUB("regeneracion", "hemostasia"),
    eyebrow: "Hemostasia",
    explicacion: [
      "En segundos, las plaquetas forman un tapón y se activa la coagulación para cerrar la herida y frenar la hemorragia.",
      "Es el primer parche de emergencia.",
    ],
  },
  {
    key: "inflamacion", nombre: "2 · Limpiar", color: "#f2b48f", foto: SUB("regeneracion", "inflamacion"),
    eyebrow: "Inflamación",
    explicacion: [
      "Llegan células de defensa que eliminan microbios y restos de tejido dañado. La zona se enrojece e hincha: es normal y necesario.",
      "Deja el terreno limpio para reconstruir.",
    ],
  },
  {
    key: "proliferacion", nombre: "3 · Reconstruir", color: "#9fe6b8", foto: SUB("regeneracion", "proliferacion"),
    eyebrow: "Proliferación",
    explicacion: [
      "Los fibroblastos fabrican colágeno, crecen nuevos vasos sanguíneos y las células de la piel cubren la herida.",
      "Se forma tejido nuevo, todavía frágil.",
    ],
  },
  {
    key: "remodelacion", nombre: "4 · Rematar", color: "#a7d9f2", foto: SUB("regeneracion", "remodelacion"),
    eyebrow: "Remodelación",
    explicacion: [
      "Durante semanas o meses, el tejido nuevo se reorganiza y gana fuerza; a veces queda una cicatriz.",
      "La cicatriz es resistente, aunque nunca idéntica al tejido original.",
    ],
  },
  {
    key: "celulas-madre", nombre: "Las células madre", color: "#c9a7ff", foto: SUB("regeneracion", "celulas-madre"),
    eyebrow: "Las que lo hacen posible",
    explicacion: [
      "Son células «en blanco» que pueden convertirse en distintos tipos y reemplazar a las que se pierden. Renuevan piel, sangre o intestino constantemente.",
      "Algunos órganos (como el corazón o el cerebro) tienen muy pocas, y por eso se reparan peor.",
    ],
  },
];

// ── Homeostasis (el equilibrio interno) ──────────────────────────────────────
const HOMEOSTASIS: Ficha[] = [
  {
    key: "retroalimentacion", nombre: "Retroalimentación", color: "#9ab6f0", foto: SUB("homeostasis", "retroalimentacion"),
    eyebrow: "El mecanismo",
    explicacion: [
      "Casi todo se regula por retroalimentación negativa: cuando algo se desvía, el cuerpo pone en marcha lo contrario para devolverlo a su sitio, como un termostato.",
      "Es el principio que mantiene estables la temperatura, el azúcar, el agua y muchas cosas más.",
    ],
  },
  {
    key: "temperatura", nombre: "Temperatura", color: "#f2b48f", foto: SUB("homeostasis", "temperatura"),
    eyebrow: "Siempre unos 37 °C",
    explicacion: [
      "Si tienes calor, sudas y dilatas los vasos; si tienes frío, tiritas y los cierras.",
      "Mantener la temperatura estable permite que tus enzimas funcionen bien.",
    ],
  },
  {
    key: "glucosa", nombre: "Azúcar en sangre", color: "#9fe6b8", foto: SUB("homeostasis", "glucosa"),
    eyebrow: "Ni mucho ni poco",
    explicacion: [
      "Insulina y glucagón suben o bajan la glucosa para mantenerla en un margen estrecho, comas o ayunes.",
      "Cuando esta regulación falla durante años aparece la diabetes.",
    ],
  },
  {
    key: "agua-sales", nombre: "Agua y sales", color: "#a7d9f2", foto: SUB("homeostasis", "agua-sales"),
    eyebrow: "El equilibrio interno",
    explicacion: [
      "Los riñones y varias hormonas ajustan cuánta agua y sales conservas o eliminas, según bebas, sudes o comas.",
      "De ello dependen la presión arterial y el correcto funcionamiento de tus células.",
    ],
  },
  {
    key: "ph", nombre: "El pH de la sangre", color: "#c9a7ff", foto: SUB("homeostasis", "ph"),
    eyebrow: "Un margen muy estrecho",
    explicacion: [
      "La sangre se mantiene en un pH muy estable (alrededor de 7,4). Los pulmones y los riñones lo corrigen sin descanso.",
      "Pequeñas desviaciones son peligrosas; por eso este equilibrio es de los más vigilados.",
    ],
  },
];

// ── Nervio vago ──────────────────────────────────────────────────────────────
const NERVIO_VAGO: Ficha[] = [
  {
    key: "que-es", nombre: "El cable más largo", color: "#b8d98f", foto: SUB("nervio-vago", "que-es"),
    eyebrow: "Qué es",
    explicacion: [
      "El nervio vago es el más largo del sistema nervioso autónomo: sale del cerebro y llega al corazón, los pulmones y casi todo el aparato digestivo.",
      "Es la principal vía de comunicación entre el cerebro y los órganos internos.",
    ],
  },
  {
    key: "parasimpatico", nombre: "El modo «calma»", color: "#9fe6b8", foto: SUB("nervio-vago", "parasimpatico"),
    eyebrow: "Reposo y digestión",
    explicacion: [
      "Es la cara principal del sistema parasimpático, el de «reposo y digestión»: frena el corazón, favorece la digestión y te relaja.",
      "Es el contrapeso del estrés: cuando se activa, el cuerpo se recupera.",
    ],
  },
  {
    key: "intestino-cerebro", nombre: "Eje intestino-cerebro", color: "#a7d9f2", foto: SUB("nervio-vago", "intestino-cerebro"),
    eyebrow: "Dos cerebros hablando",
    explicacion: [
      "Gran parte de la información que sube del intestino al cerebro viaja por el vago, incluidas señales de la microbiota.",
      "Por eso el intestino influye en el ánimo, y las emociones se notan en el estómago.",
    ],
  },
  {
    key: "tono", nombre: "El tono vagal", color: "#c9a7ff", foto: SUB("nervio-vago", "tono"),
    eyebrow: "Se puede entrenar",
    explicacion: [
      "Un buen «tono vagal» significa que recuperas la calma con facilidad tras el estrés. Se entrena: respiración lenta, exhalar largo, exponerse al frío, cantar.",
      "Cuidarlo mejora la gestión del estrés y el descanso.",
    ],
  },
  {
    key: "corazon", nombre: "El freno del corazón", color: "#f2b48f", foto: SUB("nervio-vago", "corazon"),
    eyebrow: "Variabilidad cardíaca",
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
    foto: FOTO("neurotransmisores"),
    grupo: "Química interna",
    intro: "Pequeñas moléculas que llevan un mensaje de una neurona a otra.",
    comicIntro: NEUROTRANSMISORES_SINTESIS,
    fichas: NEUROTRANSMISORES,
  },
  {
    key: "hormonas",
    label: "Hormonas",
    resumen: "Mensajeros que viajan por la sangre.",
    color: "#e6a7d9",
    foto: FOTO("hormonas"),
    grupo: "Química interna",
    intro: "Si los neurotransmisores hablan al oído, las hormonas gritan por megafonía: viajan por la sangre a todo el cuerpo. Aquí las veremos por el órgano que las secreta.",
    comicIntro: [], // «Cómo se sintetiza una hormona» — pendiente
    pista: "Pulsa cada hormona para leer qué hace en tu cuerpo.",
    fichas: HORMONAS,
  },
  {
    key: "metabolismo",
    label: "Metabolismo",
    resumen: "De lo que comes a la energía.",
    color: "#f2c86b",
    foto: FOTO("metabolismo"),
    grupo: "Química interna",
    intro: "El conjunto de reacciones que convierten la comida en energía (ATP) y en materiales para construirte.",
    pista: "Pulsa cada pieza para ver cómo conviertes la comida en energía.",
    fichas: METABOLISMO,
  },

  // ── Bloque 2 · El código y la limpieza ──
  {
    key: "epigenetica",
    label: "Expresión génica y epigenética",
    resumen: "Mismo ADN, células distintas.",
    color: "#a7d9f2",
    foto: FOTO("epigenetica"),
    grupo: "El código y la limpieza",
    intro: "Una neurona y un hepatocito tienen el MISMO ADN, pero funciones opuestas. ¿Cómo? Encendiendo y apagando genes distintos.",
    pista: "Pulsa cada caja para ver cómo se encienden y apagan tus genes.",
    fichas: EPIGENETICA,
  },
  {
    key: "detoxificacion",
    label: "Detoxificación del hígado",
    resumen: "Cómo limpia tu cuerpo lo que no sirve.",
    color: "#f2b48f",
    foto: FOTO("detoxificacion"),
    grupo: "El código y la limpieza",
    intro: "Tu hígado desactiva medicamentos, alcohol y toxinas en dos fases y los prepara para eliminarlos.",
    pista: "Pulsa cada fase para ver cómo limpia tu hígado.",
    fichas: DETOXIFICACION,
  },
  {
    key: "estres-oxidativo",
    label: "Estrés oxidativo y antioxidantes",
    resumen: "Radicales libres y cómo te defiendes.",
    color: "#f28b8b",
    foto: FOTO("estres-oxidativo"),
    grupo: "El código y la limpieza",
    intro: "Cuando te da el sol o generas energía, aparecen radicales libres que dañan las células. Tu cuerpo tiene su propio ejército antioxidante.",
    pista: "Pulsa cada caja para entender el desgaste y cómo te defiendes.",
    fichas: ESTRES_OXIDATIVO,
  },

  // ── Bloque 3 · Vida y muerte celular ──
  {
    key: "inmunitario",
    label: "Sistema inmunitario",
    resumen: "El baile entre las células.",
    color: "#9fe6b8",
    foto: FOTO("inmunitario"),
    grupo: "Vida y muerte celular",
    intro: "Cuando entra un patógeno, tus defensas responden por oleadas, coordinándose como en una coreografía.",
    pista: "Pulsa cada caja para ver cómo te defiende tu cuerpo.",
    fichas: INMUNITARIO,
  },
  {
    key: "envejecimiento",
    label: "Envejecimiento celular",
    resumen: "Telómeros, senescencia y desgaste.",
    color: "#e8e0cf",
    foto: FOTO("envejecimiento"),
    grupo: "Vida y muerte celular",
    intro: "Por qué las células envejecen: el reloj de los telómeros, las células que se «jubilan» y el desgaste oxidativo.",
    pista: "Pulsa cada caja para ver por qué envejecemos.",
    fichas: ENVEJECIMIENTO,
  },
  {
    key: "apoptosis",
    label: "Apoptosis y necrosis",
    resumen: "Las dos formas de morir de una célula.",
    color: "#c9a7ff",
    foto: FOTO("apoptosis"),
    grupo: "Vida y muerte celular",
    intro: "Una célula puede apagarse de forma ordenada y programada (apoptosis) o morir de golpe por una lesión (necrosis). No es lo mismo.",
    pista: "Pulsa cada caja para entender cómo mueren tus células.",
    fichas: APOPTOSIS,
  },
  {
    key: "regeneracion",
    label: "Regeneración",
    resumen: "Cuando te haces una herida.",
    color: "#f2b48f",
    foto: FOTO("regeneracion"),
    grupo: "Vida y muerte celular",
    intro: "Cómo tu cuerpo cierra una herida, paso a paso, hasta dejar apenas una cicatriz.",
    pista: "Pulsa cada paso para ver cómo cierras una herida.",
    fichas: REGENERACION,
  },
  {
    key: "homeostasis",
    label: "Homeostasis",
    resumen: "El cuerpo siempre buscando el equilibrio.",
    color: "#8fd0e6",
    foto: FOTO("homeostasis"),
    grupo: "Vida y muerte celular",
    intro: "Cómo tu cuerpo mantiene constantes la temperatura, la glucosa, el pH y la presión, pase lo que pase fuera.",
    pista: "Pulsa cada caja para ver cómo tu cuerpo se mantiene en equilibrio.",
    fichas: HOMEOSTASIS,
  },
  {
    key: "nervio-vago",
    label: "Nervio vago",
    resumen: "El cable que te calma.",
    color: "#b8d98f",
    foto: FOTO("nervio-vago"),
    grupo: "Vida y muerte celular",
    intro: "El nervio más largo del sistema nervioso autónomo: conecta el cerebro con el corazón, los pulmones y el intestino, y es la llave de la calma.",
    pista: "Pulsa cada caja para conocer el nervio de la calma.",
    fichas: NERVIO_VAGO,
  },
];

export function temaByKey(key: string): TemaProfundiza | undefined {
  return TEMAS_PROFUNDIZA.find((t) => t.key === key);
}
