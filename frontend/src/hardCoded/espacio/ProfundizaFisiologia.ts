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

// Clave donde guardamos los cómics «antes de empezar» ya leídos de Profundiza.
// Estructura: string[] (keys de tema cuyo cómic se ha abierto).
export const PROFUNDIZA_COMICS_KEY = "profundiza_comics_leidos";

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
  /** Zona del tema en la que se agrupa la ficha (solo si el tema tiene `zonas`). */
  zona?: string;
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
  /** Si el tema se recorre por ZONAS, cada una con su título y su entradilla; la
   *  rejilla se parte en tantos bloques como zonas (las fichas se reparten por
   *  su campo `zona`). Sin esto, todas las fichas van en una sola rejilla. */
  zonas?: { zona: string; titulo: string; entradilla: string }[];
  /** Frase de cierre, solo cuando ya se han leído TODAS las fichas del tema. */
  cierre?: string;
};

// Portada (foto de la tarjeta del hub) de cada tema, en la subcarpeta /portadas.
const PORTADA = (f: string) => `/recorrido/fisiologia/profundiza/portadas/${f}.webp`;
const NT = (k: string) => `/recorrido/fisiologia/profundiza/neurotransmisores/${k}.webp`;
// Foto de una ficha dentro de la subcarpeta de su tema (María las irá subiendo;
// mientras no existan, cada caja muestra la inicial del nombre).
const SUB = (tema: string, k: string) => `/recorrido/fisiologia/profundiza/${tema}/${k}.webp`;

// ── Cómic «Cómo se sintetiza un neurotransmisor» ───────────────────────────
// Imágenes: /viñetas/fisiologia/neurocomic/neurocomic1.png … neurocomic6.png
// Sin encabezados (eyebrow): las viñetas van solo con su texto.
const NEUROTRANSMISORES_SINTESIS: Vineta[] = [
  {
    src: "/viñetas/fisiologia/neurocomic/neurocomic1.webp",
    paragraphs: [
      "Todo empieza en tu plato.",
      "Muchos neurotransmisores nacen de aminoácidos que sacas de la comida: el triptófano, la tirosina…",
      "Son los ladrillos con los que tu cerebro fabricará sus mensajeros.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurocomic/neurocomic2.webp",
    paragraphs: [
      "El aminoácido viaja hasta la neurona. Dentro, unas enzimas lo transforman paso a paso, como en una fábrica.",
      "Así la tirosina acaba convertida en dopamina; el triptófano, en serotonina.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurocomic/neurocomic3.webp",
    paragraphs: [
      "El neurotransmisor recién fabricado se guarda en pequeñas bolsas: las vesículas.",
      "Esperan cargadas en el extremo de la neurona, listas para disparar.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurocomic/neurocomic4.webp",
    paragraphs: [
      "Llega un impulso eléctrico.",
      "Las vesículas se fusionan con la membrana y liberan el neurotransmisor al pequeño espacio entre dos neuronas: la sinapsis.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurocomic/neurocomic5.webp",
    paragraphs: [
      "El neurotransmisor cruza y encaja en su receptor, como una llave en su cerradura.",
      "Ese encaje ES el mensaje: la neurona siguiente lo recibe y reacciona.",
    ],
  },
  {
    src: "/viñetas/fisiologia/neurocomic/neurocomic6.webp",
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
    claves: ["Ordena mover los músculos", "Dos receptores: nicotínico y muscarínico", "Clave para atención y memoria"],
    explicacion: [
      "Une el cerebro con los músculos: cada vez que mueves un dedo, es la acetilcolina la que transmite la orden desde la neurona al músculo y desencadena la liberación del calcio necesario para que la fibra muscular se contraiga. Además, es esencial para la atención, el aprendizaje y la memoria.",
      "Una misma molécula, dos cerraduras distintas: lo que ocurre no lo decide la acetilcolina, lo decide el receptor en el que encaja. Y hay dos familias, bautizadas por las sustancias que las imitan: la nicotina del tabaco y la muscarina de la seta Amanita muscaria.",
      "Receptores nicotínicos: son canales. Cuando la acetilcolina encaja, el receptor se abre como una puerta y entra sodio, así que la célula se activa en milisegundos. Son los de la unión neuromuscular (por eso el movimiento voluntario es instantáneo) y también están repartidos por el cerebro, donde participan en la atención y en el circuito de recompensa. Son los que ocupa la nicotina, haciéndose pasar por acetilcolina.",
      "Receptores muscarínicos: no son canales, sino receptores acoplados a proteína G. Al encajar la acetilcolina no se abre nada: se pone en marcha una cascada de mensajeros dentro de la célula. Es más lento (décimas de segundo) pero más duradero, y en vez de dar una orden seca modula el tono de fondo del órgano. Son los del sistema parasimpático (bajan el ritmo del corazón, ponen en marcha la digestión, contraen la pupila, activan las glándulas) y los del cerebro implicados en memoria y aprendizaje.",
      "Por qué importa la diferencia: casi todo lo que toca la acetilcolina es selectivo de una de las dos familias. Los relajantes musculares de quirófano bloquean los nicotínicos y dejan el músculo sin la orden; la atropina bloquea los muscarínicos, y por eso dilata la pupila y acelera el corazón. En el Alzheimer, donde se pierden neuronas colinérgicas, los fármacos no añaden acetilcolina: frenan la enzima que la destruye (la acetilcolinesterasa) para que la poca que queda dure más en la sinapsis.",
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
      "Cómo se fabrica: en las células beta de los islotes del páncreas. Primero se hace una versión larga y todavía inútil, la proinsulina, y luego se le recorta un trozo del medio, el péptido C. Lo que queda son dos cadenas cosidas por puentes de azufre: la insulina. Se guarda empaquetada en gránulos junto con zinc, lista para salir en cuanto la glucosa entra en la célula beta. El trozo recortado sale a la sangre en la misma cantidad, y por eso el péptido C se mide en un análisis para saber si un páncreas sigue fabricando insulina propia.",
      "Su receptor: el receptor de insulina, anclado en la membrana de casi todas tus células y muy abundante en músculo, grasa e hígado. Cuando la insulina se posa en él, el receptor se enciende por dentro y desata una cascada de señales cuyo efecto más visible es sacar a la superficie los transportadores de glucosa (GLUT4), que son las puertas por las que la glucosa entra de verdad. Sin esa orden, las puertas se quedan guardadas dentro de la célula.",
      "Cuándo importa: si las células dejan de responderle bien (resistencia a la insulina), la glucosa se queda en la sangre y aparece, con el tiempo, la diabetes tipo 2. Y lo habitual no es que falte insulina, sino que el mensaje se pierda por el camino, después del receptor.",
    ],
  },
  {
    key: "glucagon", nombre: "Glucagón", color: "#9b6ee0", foto: SUB("hormonas", "glucagon"),
    eyebrow: "Páncreas · sube el azúcar",
    claves: ["Sube el azúcar en sangre", "El hígado suelta glucosa", "Compañera de la insulina"],
    explicacion: [
      "Es la contraparte de la insulina. Cuando la glucosa baja (ayuno, ejercicio), el páncreas libera glucagón para que el hígado suelte glucosa guardada y mantenga estable el nivel en sangre.",
      "Cómo se fabrica: en las células alfa de los mismos islotes del páncreas, vecinas de las que hacen insulina. Se fabrica una proteína grande, el proglucagón, y se recorta hasta dejar un péptido pequeño de 29 piezas. Lo curioso es que el intestino fabrica ese mismo proglucagón, pero lo recorta por otro sitio, y de ahí sale el GLP-1, la hormona de la saciedad en la que se basan los fármacos que hoy se usan para la obesidad. La misma materia prima, dos tijeras distintas y efectos casi opuestos.",
      "Su receptor: el receptor de glucagón, en la membrana y sobre todo en las células del hígado. Al activarse sube dentro de la célula un segundo mensajero, el AMP cíclico, que enciende las enzimas encargadas de desmontar el glucógeno guardado y de fabricar glucosa nueva. Es la orden de «abrid la despensa».",
      "Juntas, insulina y glucagón mantienen tu azúcar en un margen estrecho, subiéndolo o bajándolo según haga falta.",
    ],
  },
  {
    key: "cortisol", nombre: "Cortisol", color: "#6bd39a", foto: SUB("hormonas", "cortisol"),
    eyebrow: "Suprarrenal · el estrés",
    claves: ["La hormona del estrés", "Sube de mañana, baja de noche", "Crónico, desgasta el cuerpo"],
    explicacion: [
      "Las glándulas suprarrenales lo liberan ante el estrés y también siguiendo un ritmo diario: sube por la mañana para despertarte y baja por la noche. Moviliza energía y te pone en alerta.",
      "Cómo se fabrica: a partir de colesterol, en la corteza de las glándulas suprarrenales y por orden de la hipófisis, que manda una señal llamada ACTH. El colesterol entra en la mitocondria, se convierte en pregnenolona y de ahí, enzima tras enzima, en cortisol. Al ser una hormona esteroidea no se puede almacenar hecha: se fabrica en el momento en que hace falta, y por eso tarda unos minutos en aparecer mientras la adrenalina ya está actuando.",
      "Su receptor: el receptor de glucocorticoides, que no está en la membrana sino dentro de la célula. El cortisol es liposoluble, así que atraviesa la membrana sin pedir permiso, se une a su receptor en el interior y el conjunto entra en el núcleo, donde enciende y apaga cientos de genes. Eso explica su carácter: tarda más en notarse y dura mucho más que la adrenalina. Los corticoides de farmacia, como la prednisona, actúan sobre ese mismo receptor, y de ahí que sus efectos se parezcan tanto a los de un estrés sostenido.",
      "Cuándo importa: útil en momentos puntuales, pero mantenerlo alto durante meses (estrés crónico, dormir mal) desgasta el cuerpo, sube el azúcar y baja las defensas.",
    ],
  },
  {
    key: "adrenalina", nombre: "Adrenalina", color: "#f6bd82", foto: SUB("hormonas", "adrenalina"),
    eyebrow: "Suprarrenal · la reacción inmediata",
    claves: ["La hormona del «lucha o huye»", "Acelera el corazón al instante", "Libera energía para reaccionar"],
    explicacion: [
      "Es la hormona del «lucha o huye». Ante un peligro, en segundos acelera el corazón, dilata las pupilas y libera energía para reaccionar.",
      "Cómo se fabrica: en la médula de la glándula suprarrenal, su parte más interna, a partir de un aminoácido que viene de la comida, la tirosina. La cadena es la misma que en el cerebro: tirosina, luego dopamina, luego noradrenalina y por último adrenalina. El paso final necesita cortisol para funcionar, y de ahí un detalle de diseño precioso: la médula que fabrica adrenalina está envuelta por la corteza que fabrica cortisol, bañada en él. A diferencia del cortisol, la adrenalina sí se guarda ya hecha en vesículas, y por eso puede salir en un segundo en cuanto el nervio simpático da la orden.",
      "Sus receptores: los receptores adrenérgicos, repartidos por todo el cuerpo en dos familias, alfa y beta. Ahí está el truco de que una sola molécula haga cosas distintas en cada sitio: los beta-1 del corazón lo hacen latir más fuerte y más rápido; los beta-2 de los bronquios y de los vasos del músculo los abren, y por eso los inhaladores del asma imitan a la adrenalina; los alfa-1 cierran los vasos de la piel y del intestino, que es la palidez del susto. Los fármacos llamados betabloqueantes tapan los beta-1 del corazón para que la adrenalina no pueda acelerarlo.",
      "Cuándo la notas: ese vuelco cuando te asustas o el corazón a mil antes de hablar en público.",
    ],
  },
  {
    key: "tiroideas", nombre: "Hormonas tiroideas", color: "#ec86c1", foto: SUB("hormonas", "tiroideas"),
    eyebrow: "Tiroides · el acelerador",
    claves: ["Marcan la velocidad del cuerpo", "Energía, temperatura y pulso", "El acelerador del metabolismo"],
    explicacion: [
      "Las hormonas tiroideas (T3 y T4) marcan la velocidad a la que funcionan tus células: el gasto de energía, la temperatura y el ritmo del corazón.",
      "Cómo se fabrican: son las únicas hormonas que necesitan un mineral de la dieta, el yodo, y las únicas que se almacenan fuera de la célula. Las células de la tiroides fabrican una proteína enorme, la tiroglobulina, y la vuelcan dentro de unos sacos llamados folículos. Allí una enzima va enganchando yodo a esa proteína y uniendo las piezas de dos en dos. Cuando hace falta hormona, la célula recupera un trozo de tiroglobulina y lo recorta. El número del nombre dice cuántos átomos de yodo lleva: cuatro en la T4, tres en la T3.",
      "El detalle que casi nunca se cuenta: de todo lo que suelta la glándula, alrededor del 90 % es T4… y la T4 apenas actúa por sí sola. Es la reserva. La que de verdad da la orden es la T3, y son los propios tejidos (sobre todo el hígado, el riñón y el músculo) los que le quitan un átomo de yodo a la T4 para fabricar T3 justo donde y cuando la necesitan, con unas enzimas que requieren selenio. Visto así, la tiroides no manda la orden final: manda la materia prima, y cada tejido decide cuánta hormona activa se fabrica.",
      "Su receptor: está dentro del núcleo de la célula, esperando pegado al ADN incluso antes de que llegue la hormona. Cuando la T3 entra y se le une, ese receptor enciende los genes que suben el ritmo de todo: más mitocondrias, más consumo de energía, más calor, un corazón más fuerte, un intestino que se mueve más. La T4 encaja mucho peor en él, y esa es exactamente la razón de que haga falta convertirla antes.",
      "El termostato: el hipotálamo suelta TRH, la hipófisis responde con TSH y la TSH pide a la tiroides que produzca; cuando ya hay hormona suficiente, ella misma frena al cerebro. Por eso en una analítica la TSH se lee del revés de lo que parece: TSH alta suele significar tiroides lenta, y TSH baja, tiroides acelerada. Y otro detalle práctico: en la sangre casi toda la hormona viaja pegada a proteínas transportadoras, y así no hace nada; solo cuenta la fracción que va libre, y de ahí que los análisis midan T4 libre y no el total.",
      "Cuándo importa: demasiadas aceleran todo (nerviosismo, pérdida de peso, insomnio, pulso rápido); pocas lo frenan todo (cansancio, frío, piel seca, estreñimiento, lentitud mental). Y existe una situación intermedia que es normal: en ayunos largos, dietas muy restrictivas o durante una enfermedad, el cuerpo baja la T3 a propósito para gastar menos. No es que la tiroides se haya roto, es el cuerpo poniéndose en modo ahorro.",
    ],
  },
  {
    key: "testosterona", nombre: "Testosterona", color: "#5d8ae0", foto: SUB("hormonas", "testosterona"),
    eyebrow: "Gónadas · fuerza y desarrollo",
    claves: ["Presente en ambos sexos", "Músculo, hueso y deseo", "Sobre todo en los testículos"],
    explicacion: [
      "Presente en ambos sexos, aunque más alta en hombres. Interviene en el desarrollo muscular y óseo, el deseo sexual, la energía y el ánimo.",
      "Se produce sobre todo en los testículos y, en menor cantidad, en ovarios y glándulas suprarrenales.",
      "Cómo se fabrica: también a partir de colesterol, en las células de Leydig del testículo y por orden de la hipófisis, que envía la señal LH. Y no acaba ahí, porque después sigue transformándose según el tejido: en la piel y en el folículo del pelo una enzima la convierte en DHT, una versión bastante más potente, y en el tejido graso otra enzima, la aromatasa, la convierte en estradiol. Es decir, el estrógeno se fabrica a partir de la testosterona.",
      "Su receptor: el receptor de andrógenos, dentro de la célula, del mismo tipo que el del cortisol. La hormona atraviesa la membrana, se une a él y el conjunto viaja al núcleo a encender genes. La DHT se agarra a ese receptor con mucha más fuerza que la testosterona, y por eso es la responsable de buena parte de los efectos sobre la piel, la barba y el pelo.",
    ],
  },
  {
    key: "estrogenos", nombre: "Estrógenos", color: "#e86fb0", foto: SUB("hormonas", "estrogenos"),
    eyebrow: "Gónadas · el ciclo y mucho más",
    claves: ["Hormonas sexuales femeninas", "Regulan el ciclo", "Protegen hueso y corazón"],
    explicacion: [
      "Principales hormonas sexuales femeninas. Regulan el ciclo menstrual y la fertilidad, pero también protegen los huesos, el corazón y el cerebro.",
      "Cómo se fabrican: en el ovario, y no desde cero. El ovario parte de andrógenos, es decir de testosterona, y una enzima llamada aromatasa los transforma en estradiol, el estrógeno principal. La orden la da la hipófisis con la señal FSH. Esa misma aromatasa está también en el tejido graso, en el hueso y en el cerebro, y por eso, cuando el ovario se apaga en la menopausia, la grasa corporal sigue fabricando una pequeña cantidad.",
      "Sus receptores: son dos, alfa y beta, y están dentro del núcleo de la célula. Lo llamativo es dónde aparecen: además del útero y el pecho, hay receptores de estrógenos en el hueso, en los vasos sanguíneos, en el cerebro, en la piel y en el hígado. Que estén en tantos sitios es exactamente la razón de que su caída en la menopausia no se note solo en el ciclo, sino en los huesos, el sueño, la memoria, la piel y el riesgo cardiovascular.",
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
      "Cómo se fabrica: la produce el cuerpo lúteo, que es lo que queda del folículo después de ovular, y si hay embarazo toma el relevo la placenta. Es además el primer escalón de todos los esteroides: el colesterol se convierte en pregnenolona y esta en progesterona, y de ella salen después el cortisol, la testosterona y los estrógenos. Es, literalmente, la madre de las demás.",
      "Su receptor: el receptor de progesterona, en el núcleo, con un detalle elegante: son los estrógenos los que hacen que la célula lo fabrique. Es decir, la primera mitad del ciclo prepara el terreno para que la segunda pueda funcionar. Y en el cerebro ocurre algo aparte: la progesterona se transforma en otra molécula, la alopregnanolona, que actúa sobre el receptor GABA, el gran freno del sistema nervioso y la misma diana donde actúan los ansiolíticos. De ahí su efecto calmante, y de ahí que su caída brusca en los días previos a la regla se note tanto en el ánimo y en el sueño.",
    ],
  },
  {
    key: "melatonina", nombre: "Melatonina", color: "#6a4bc0", foto: SUB("hormonas", "melatonina"),
    eyebrow: "Pineal · el sueño",
    claves: ["La libera la oscuridad", "La señal de dormir", "Las pantallas la frenan"],
    explicacion: [
      "La glándula pineal la libera cuando cae la luz: es la señal de que llega la noche y toca dormir. Sincroniza tu reloj interno con el día y la noche.",
      "Cómo se fabrica: en la glándula pineal y a partir del triptófano de la comida, en una cadena que quizá te suene: triptófano, después serotonina y por último melatonina. Sí, la melatonina es una serotonina retocada. La enzima que da el paso decisivo solo trabaja a oscuras: la luz que entra por el ojo llega al reloj central del cerebro y este le ordena parar. No hay nada mágico en las pantallas, simplemente apagan esa enzima.",
      "Sus receptores: se llaman MT1 y MT2, están en la membrana y se concentran en el reloj central del cerebro (el núcleo supraquiasmático) y en la retina. El MT1 baja el nivel de alerta y el MT2 ajusta la hora de ese reloj. Esto aclara una confusión muy común: la melatonina no es un somnífero que te tumba, es un aviso de «es de noche». Por eso ayuda más a recolocar el horario, como en el jet lag o los turnos de noche, que a dormir más profundo.",
      "Cuándo importa: la luz de las pantallas por la noche frena su producción y te cuesta más dormir.",
    ],
  },
  {
    key: "crecimiento", nombre: "Hormona del crecimiento", color: "#6fd6db", foto: SUB("hormonas", "crecimiento"),
    eyebrow: "Hipófisis · reparar y crecer",
    claves: ["Se libera al dormir profundo", "Hace crecer de niños", "Repara de adultos"],
    explicacion: [
      "La hipófisis la libera sobre todo durante el sueño profundo y el ejercicio. Estimula el crecimiento en la infancia y, de adulto, la reparación de tejidos y músculo.",
      "Cómo se fabrica: es una proteína, no un esteroide, así que la hipófisis la fabrica y la guarda hecha en gránulos, lista para salir. Y no gotea de forma constante: sale a pulsos, empujada por una señal del hipotálamo (la GHRH) y frenada por otra (la somatostatina). El pulso más grande del día ocurre en las primeras horas de sueño profundo, y el ejercicio intenso y el ayuno también la disparan.",
      "Su receptor: el receptor de GH, en la membrana y muy abundante en el hígado. Y aquí está lo interesante: gran parte de su efecto no lo hace ella. Al activar ese receptor, el hígado fabrica y suelta otra hormona, el IGF-1, y es el IGF-1 el que actúa de verdad sobre el cartílago de crecimiento, el músculo y el hueso. Por eso, cuando se quiere saber cuánta hormona del crecimiento hay, se mide el IGF-1: la GH sale a pulsos y un análisis puntual no dice casi nada, mientras que el IGF-1 se mantiene estable.",
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
      "La respiración celular comienza en el citoplasma, fuera de la mitocondria. Cuando comemos carbohidratos, a través del proceso de la digestión, se descomponerá en moléculas de glucosa (recordemos que los carbohidratos son cadenas de glucosa unidas, la digestión las separa). Durante la glucólisis, una molécula de glucosa (6 carbonos) se divide en dos moléculas más pequeñas llamadas piruvato (3 carbonos cada una).",
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
    eyebrow: "Tu Vida deja huella",
    claves: ["Tus hábitos marcan los genes", "No cambian el ADN", "Cambian cómo se usa"],
    explicacion: [
      "La alimentación, el ejercicio, el estrés, el sueño o el tabaco pueden cambiar estas marcas epigenéticas y, con ellas, qué genes se expresan.",
      "No cambian tu ADN, pero sí cómo se usa: tus hábitos hablan con tus genes cada día.",
    ],
  },
  {
    key: "herencia", nombre: "Herencia epigenética", color: "#e6a7d9", foto: SUB("epigenetica", "epigenetica5"),
    eyebrow: "A veces se hereda",
    claves: ["Algunas marcas se heredan", "La Vida de los padres influye", "Un campo joven y apasionante"],
    explicacion: [
      "Algunas marcas epigenéticas pueden pasar de una generación a otra, de modo que las experiencias de los padres podrían influir en los hijos.",
      "Es un campo joven y apasionante: sugiere que el entorno deja una huella que va más allá de una sola Vida.",
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
    claves: ["Cede su electrón y se recicla", "Engancha los tóxicos para sacarlos", "Recarga las vitaminas C y E"],
    explicacion: [
      "Es la molécula estrella de la desintoxicación y la defensa antioxidante del hígado. El cuerpo la fabrica él mismo y hace dos trabajos muy distintos: neutralizar radicales libres y engancharse a los tóxicos para poder expulsarlos.",
      "PRIMER TRABAJO · el sacrificio antioxidante. Los radicales libres son moléculas inestables a las que les falta un electrón, y lo roban de donde pueden: del ADN, de las proteínas, de las grasas de las membranas. Ahí entra el glutatión.",
      "1. La entrega. El glutatión en su forma activa (GSH) tiene un átomo de azufre con un hidrógeno, lo que se llama un grupo tiol. Le entrega voluntariamente ese hidrógeno con su electrón al radical libre.",
      "2. La neutralización. Con la ayuda de una enzima, la glutatión peroxidasa, el radical se estabiliza y queda inofensivo: acaba convertido en agua o en un alcohol.",
      "3. El reciclaje. Al ceder su electrón, el glutatión queda oxidado y se une a otro glutatión gastado formando una pareja (GSSG). Entonces otra enzima, la glutatión reductasa, gasta energía celular (NADPH) para recargarlo y devolverlo a la batalla. Casi nada se tira: la misma molécula vuelve a usarse una y otra vez.",
      "SEGUNDO TRABAJO · la conjugación, la desintoxicación propiamente dicha. En el hígado, el glutatión se enfrenta de forma directa a medicamentos (el paracetamol es el ejemplo clásico), al alcohol, a los metales pesados y a otros tóxicos.",
      "1. El gancho. Una enzima llamada glutatión S-transferasa pega el glutatión físicamente a la toxina.",
      "2. Volverla soluble. La mayoría de los tóxicos son grasos, y el cuerpo no sabe eliminar la grasa por la orina. Al quedar pegados al glutatión pasan a ser solubles en agua.",
      "3. La expulsión. Ya solubles, pueden salir por el riñón con la orina o por la bilis hacia el intestino. Esto es exactamente la Fase II que has visto antes: el glutatión es una de sus moléculas principales.",
      "Y además es el recargador oficial del equipo: cuando la vitamina C y la vitamina E se agotan defendiéndote, el glutatión les cede electrones y las deja otra vez operativas. Por eso se le llama el antioxidante maestro, no solo por lo que neutraliza él, sino porque mantiene en pie a los demás.",
      "Cuándo importa: el cuerpo lo fabrica, pero las reservas se agotan con el alcohol, el tabaco, los tóxicos, las infecciones y el estrés oxidativo sostenido. El daño empieza a acumularse justo cuando el glutatión se queda corto. De hecho, en una intoxicación por paracetamol el antídoto que se usa en el hospital (N-acetilcisteína) sirve precisamente para dar al hígado la materia prima con la que volver a fabricarlo.",
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
    key: "dendriticas", nombre: "3. Células dendríticas", color: "#9fe6b8", foto: SUB("inmunitario", "dendritica"),
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
    key: "linfocitos-t", nombre: "4. Linfocitos T", color: "#9ab6f0", foto: SUB("inmunitario", "tcell"),
    eyebrow: "Los coordinadores y eliminadores",
    claves: ["Detectan y coordinan la defensa", "Un receptor único cada uno", "Se «gradúan» en el timo"],
    explicacion: [
      "Los linfocitos T son capaces de detectar qué microorganismo está atacando gracias a las muestras que les presentan las células dendríticas, y de activar la respuesta inmunitaria adecuada.",
      "Los linfocitos T nacen creando un receptor aleatorio a partir de los genes que tenemos. Por eso nacen millones de linfocitos T diferentes y se dice que podemos reconocer prácticamente cualquier bacteria o virus. Pero tener la capacidad de reconocerlos no quiere decir que ya seamos inmunes frente a ellos.",
      "Para poder permanecer en el sistema inmunitario, las células T tienen que pasar las terribles pruebas del timo, donde hay células «profesoras» que se aseguran de que no reconozcan como enemigo a lo que forma parte del propio cuerpo, evitando así posibles enfermedades autoinmunes. Debido a esto, solo aproximadamente el 2 % de las células T que nacen consiguen aprobar.",
    ],
  },
  {
    key: "linfocitos-t-colaboradores", nombre: "5. Linfocitos T colaboradores", color: "#8fd0e6", foto: SUB("inmunitario", "colaborador"),
    claves: ["Coordinan la respuesta inmune", "Activan a las demás defensas", "Sin ellos, todo falla"],
    explicacion: [
      "Estos actúan como coordinadores de toda la respuesta inmunitaria.",
      "Cuando reconocen un antígeno presentado por una célula dendrítica, liberan citocinas que activan a los macrófagos (les ordenan atacar y aumentan su capacidad para hacerlo), a los linfocitos B cuyo receptor reconoce el mismo antígeno y, si hace falta, a los linfocitos T citotóxicos, que son realmente agresivos.",
      "Sin ellos, la respuesta inmunitaria sería mucho menos eficaz.",
    ],
  },
  {
    key: "linfocitos-t-citotoxicos", nombre: "6. Linfocitos T citotóxicos", color: "#a7d9f2", foto: SUB("inmunitario", "citotoxic"),
    claves: ["Matan células infectadas", "Inducen su apoptosis", "Precisos con el tejido sano"],
    explicacion: [
      "Su función es destruir células del propio organismo que estén infectadas por virus o que se hayan vuelto cancerosas. Lo hacen de sopetón: perforan la membrana de la célula infectada e inducen su muerte programada (apoptosis).",
      "De esta manera eliminan el problema sin dañar excesivamente los tejidos vecinos.",
    ],
  },
  {
    key: "linfocitos-b", nombre: "7. Linfocitos B", color: "#c9a7ff", foto: SUB("inmunitario", "bcell"),
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
    key: "natural-killers", nombre: "8. Natural killers (NK)", color: "#e6a7d9", foto: SUB("inmunitario", "killercells"),
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
  {
    key: "fotoenvejecimiento", nombre: "Fotoenvejecimiento", color: "#f2c86b", foto: SUB("envejecimiento", "envejecimiento6"),
    eyebrow: "Hasta dónde llega cada rayo",
    claves: ["Cada rayo llega a una capa", "El UVB quema, el UVA arruga", "Atraviesa nubes y cristales"],
    explicacion: [
      "La luz del sol no es una sola cosa: es una mezcla de radiaciones, y cada una penetra en la piel a una profundidad distinta. Eso explica por qué unas queman y otras, sin que te enteres, te arrugan.",
      "UVB · se queda arriba, en la epidermis. Es la que quema y la que enrojece. Su energía es tan alta que daña el ADN de las células directamente, y por eso es la principal responsable del cáncer de piel. También es la que inicia la producción de vitamina D.",
      "UVA · atraviesa la epidermis y llega hasta la dermis, justo donde viven los fibroblastos y el colágeno. No quema, así que no avisa de nada, pero genera radicales libres que rompen las fibras de colágeno y elastina. Es la causante de las arrugas, la flacidez y las manchas. Supone la mayor parte de la radiación ultravioleta que nos llega y, a diferencia del UVB, atraviesa las nubes y el cristal de una ventana o de un coche.",
      "Luz visible e infrarrojo · llegan todavía más profundo, hasta la hipodermis. El infrarrojo es el calor que notas y también genera radicales libres. La luz visible, sobre todo la azul, puede activar a los melanocitos y empeorar manchas como el melasma, especialmente en pieles morenas.",
      "Por qué esto está en el envejecimiento: además de los relojes internos que has visto en las otras cajas, la piel acumula un envejecimiento añadido que depende solo de la cantidad de sol recibida. Se llama fotoenvejecimiento y explica la mayor parte de lo que reconocemos como una cara envejecida. La prueba está en tu propio cuerpo: compara la piel de tu cara con la de la cara interna de tu brazo. Tienen exactamente la misma edad.",
      "Cuándo importa: por eso el protector solar es, con diferencia, la mejor crema antiedad que existe. Y como el UVA atraviesa nubes y cristales, el daño no depende de que haga calor ni de estar en la playa: un día nublado de invierno junto a la ventana también cuenta.",
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
    eyebrow: "Una muerte que da Vida",
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

// ── Sistema nervioso entérico (el «segundo cerebro») ─────────────────────────
const SISTEMA_ENTERICO: Ficha[] = [
  {
    key: "que-es", nombre: "El «segundo cerebro»", color: "#9fe6b8", foto: SUB("nerviosoenterico","enterico1"),
    eyebrow: "Qué es",
    claves: ["Millones de neuronas en el intestino", "Puede funcionar sin el cerebro", "Coordina toda la digestión"],
    explicacion: [
      "El Sistema Nervioso Entérico (SNE) es una red de millones de neuronas situada en las paredes del tubo digestivo.",
      "Se le conoce como el «segundo cerebro» porque puede controlar muchas funciones digestivas sin orden directa del cerebro ni de la médula espinal.",
      "Su principal función es coordinar la digestión, el movimiento de los alimentos, la secreción de sustancias digestivas y el flujo sanguíneo intestinal.",
    ],
  },
  {
    key: "plexo-mienterico", nombre: "Plexo mientérico (Auerbach)", color: "#f2b48f", foto: SUB("nerviosoenterico","enterico2"),
    eyebrow: "El que mueve",
    claves: ["Controla el músculo del tubo", "Regula las contracciones", "Genera el peristaltismo"],
    explicacion: [
      "Es la principal red nerviosa encargada de controlar el movimiento de los músculos del tubo digestivo.",
      "Regula las contracciones que permiten que los alimentos avancen mediante el proceso conocido como peristaltismo.",
    ],
  },
  {
    key: "plexo-submucoso", nombre: "Plexo submucoso (Meissner)", color: "#a7d9f2", foto: SUB("nerviosoenterico","enterico3"),
    eyebrow: "El que secreta y absorbe",
    claves: ["Más cerca de la mucosa", "Controla secreción y absorción", "Regula el flujo sanguíneo local"],
    explicacion: [
      "Este plexo se encuentra más cerca de la mucosa intestinal.",
      "Controla la secreción de enzimas, agua y moco, además de regular la absorción de nutrientes y el flujo sanguíneo local.",
    ],
  },
  {
    key: "neuronas-sensitivas", nombre: "Neuronas sensitivas", color: "#f2c86b", foto: SUB("nerviosoenterico","enterico4"),
    eyebrow: "Las que detectan",
    claves: ["Detectan lo que pasa dentro", "Presión, distensión, química", "Avisan al sistema entérico"],
    explicacion: [
      "Detectan los cambios dentro del intestino, como la presencia de alimentos, la presión, la distensión o la composición química del contenido digestivo.",
      "Envían esta información para que el sistema nervioso entérico responda adecuadamente.",
    ],
  },
  {
    key: "interneuronas", nombre: "Interneuronas", color: "#c9a7ff", foto: SUB("nerviosoenterico","enterico5"),
    eyebrow: "Las que conectan",
    claves: ["Conectan las neuronas del SNE", "Integran la información sensorial", "Coordinan la respuesta"],
    explicacion: [
      "Las interneuronas conectan las distintas neuronas del sistema nervioso entérico.",
      "Integran la información sensorial y coordinan la respuesta adecuada entre las neuronas sensitivas y las motoras.",
    ],
  },
  {
    key: "neuronas-motoras", nombre: "Neuronas motoras", color: "#f28b8b", foto: SUB("nerviosoenterico","enterico6"),
    eyebrow: "Las que ordenan",
    claves: ["Dan la orden final", "A músculos y glándulas", "Provocan contracción y secreción"],
    explicacion: [
      "Transmiten las órdenes finales hacia los músculos y las glándulas del aparato digestivo.",
      "Gracias a ellas se producen las contracciones intestinales y la liberación de secreciones necesarias para la digestión.",
    ],
  },
];

// ── La menstruación (el ciclo, fase a fase) ──────────────────────────────────
const MENSTRUACION: Ficha[] = [
  {
    key: "leptina", nombre: "1. Leptina: se activa el eje", color: "#6fd6db", foto: SUB("regla", "regla1"),
    eyebrow: "El punto de partida",
    claves: ["Hay reservas de energía suficientes", "La leptina avisa al hipotálamo", "Se libera GnRH"],
    explicacion: [
      "Cuando las reservas energéticas del organismo son suficientes, el tejido adiposo produce niveles adecuados de leptina. Esta hormona informa al hipotálamo de que el organismo dispone de energía suficiente para iniciar la función reproductiva.",
      "Como consecuencia, se activa la liberación pulsátil de GnRH.",
    ],
  },
  {
    key: "hipofisis", nombre: "2. Hipófisis: FSH y LH", color: "#f2d24b", foto: SUB("regla", "regla2"),
    eyebrow: "Las gonadotropinas",
    claves: ["La GnRH estimula la hipófisis", "Libera FSH y LH", "Viajan por la sangre al ovario"],
    explicacion: [
      "La GnRH estimula la hipófisis anterior para liberar las gonadotropinas FSH y LH, hormonas que viajarán por la sangre hasta el ovario para iniciar el desarrollo folicular.",
    ],
  },
  {
    key: "foliculo", nombre: "3. Madura el folículo", color: "#6bd39a", foto: SUB("regla", "regla3"),
    eyebrow: "En el ovario",
    claves: ["La FSH hace crecer los folículos", "Uno se vuelve dominante", "Produce cada vez más estrógenos"],
    explicacion: [
      "La FSH estimula el crecimiento de los folículos ováricos. Uno de ellos se convierte en el folículo dominante y comienza a producir cantidades crecientes de estrógenos.",
    ],
  },
  {
    key: "ovulacion", nombre: "4. Ovulación", color: "#f2994a", foto: SUB("regla", "regla4"),
    eyebrow: "El pico de LH",
    claves: ["Un aumento brusco de LH", "Rompe el folículo dominante", "Libera el ovocito a la trompa"],
    explicacion: [
      "El aumento brusco de LH provoca la rotura del folículo dominante y la liberación del ovocito hacia la trompa uterina, proceso conocido como ovulación.",
    ],
  },
  {
    key: "cuerpo-luteo", nombre: "5. Cuerpo lúteo y endometrio", color: "#e0a869", foto: SUB("regla", "regla5"),
    eyebrow: "Preparar el terreno",
    claves: ["El folículo roto se vuelve cuerpo lúteo", "Secreta progesterona", "Engrosa el endometrio"],
    explicacion: [
      "Tras la ovulación, el folículo roto se transforma en el cuerpo lúteo, que secreta principalmente progesterona.",
      "Esta hormona prepara el endometrio para una posible implantación, aumentando su grosor, vascularización y actividad secretora.",
    ],
  },
  {
    key: "menstruacion", nombre: "6. La menstruación", color: "#d64550", foto: SUB("regla", "regla6"),
    eyebrow: "Si no hay fecundación",
    claves: ["El cuerpo lúteo degenera", "Caen progesterona y estrógenos", "El endometrio se desprende"],
    explicacion: [
      "Si no se produce la fecundación, el cuerpo lúteo degenera y disminuye la producción de progesterona y estrógenos.",
      "Como consecuencia, el endometrio pierde su soporte hormonal y se desprende, iniciándose la menstruación.",
    ],
  },
];

// ── Cetosis (la dieta cetogénica, paso a paso) ───────────────────────────────
const CETOSIS: Ficha[] = [
  {
    key: "baja-glucosa", nombre: "1. Baja la glucosa y la insulina", color: "#6fd6db", foto: SUB("cetosis", "cetosis1"),
    eyebrow: "El punto de partida",
    claves: ["Ayuno, ejercicio o pocos carbohidratos", "Baja la insulina, sube el glucagón", "Empieza a tirar de reservas"],
    explicacion: [
      "La cetosis comienza cuando disminuye la disponibilidad de glucosa, generalmente por ayuno prolongado, ejercicio intenso o una dieta muy baja en carbohidratos.",
      "Como consecuencia, descienden los niveles de insulina y aumentan los de glucagón, favoreciendo el uso de las reservas energéticas.",
    ],
  },
  {
    key: "lipolisis", nombre: "2. Lipólisis en la grasa", color: "#f2d24b", foto: SUB("cetosis", "cetosis2"),
    eyebrow: "En el tejido adiposo",
    claves: ["La poca insulina rompe las grasas", "Los adipocitos sueltan ácidos grasos", "Salen a la sangre con glicerol"],
    explicacion: [
      "La disminución de insulina activa la degradación de los triglicéridos almacenados en el tejido adiposo.",
      "Los adipocitos liberan ácidos grasos libres y glicerol hacia la circulación sanguínea.",
    ],
  },
  {
    key: "beta-oxidacion", nombre: "3. β-oxidación en el hígado", color: "#6bd39a", foto: SUB("cetosis", "cetosis3"),
    eyebrow: "En las mitocondrias",
    claves: ["Los ácidos grasos llegan al hígado", "Se degradan por β-oxidación", "Generan mucho acetil-CoA"],
    explicacion: [
      "Los ácidos grasos llegan al hígado, donde son degradados mediante β-oxidación en las mitocondrias.",
      "Este proceso genera grandes cantidades de acetil-CoA, una molécula necesaria para la respiración celular.",
    ],
  },
  {
    key: "cetogenesis", nombre: "4. Cuerpos cetónicos", color: "#f2994a", foto: SUB("cetosis", "cetosis4"),
    eyebrow: "La cetogénesis",
    claves: ["El acetil-CoA se acumula", "El hígado lo vuelve cuerpos cetónicos", "Acetoacetato, β-hidroxibutirato y acetona"],
    explicacion: [
      "Cuando el acetil-CoA se acumula, el hígado lo transforma en cuerpos cetónicos: acetoacetato, β-hidroxibutirato y acetona.",
      "Este proceso recibe el nombre de cetogénesis.",
    ],
  },
  {
    key: "transporte", nombre: "5. Viajan por la sangre", color: "#5ec8db", foto: SUB("cetosis", "cetosis5"),
    eyebrow: "El transporte",
    claves: ["Los cuerpos cetónicos salen del hígado", "Circulan por la sangre", "Llegan a todos los órganos"],
    explicacion: [
      "Los cuerpos cetónicos salen del hígado y circulan por la sangre hasta diferentes órganos, donde pueden utilizarse como fuente alternativa de energía.",
    ],
  },
  {
    key: "utilizacion", nombre: "6. Se convierten en energía", color: "#d64550", foto: SUB("cetosis", "cetosis6"),
    eyebrow: "El destino final",
    claves: ["Cerebro, corazón y músculo los captan", "Vuelven a acetil-CoA", "Producen ATP en el ciclo de Krebs"],
    explicacion: [
      "Los tejidos, especialmente el cerebro, el corazón y el músculo esquelético, captan los cuerpos cetónicos y los convierten nuevamente en acetil-CoA para producir ATP mediante el ciclo de Krebs.",
      "Así proporcionan energía cuando la glucosa es escasa.",
    ],
  },
];

// ── Músculo · cómo se contrae y quién le pone el freno ───────────────────────
const MUSCULO: Ficha[] = [
  {
    key: "actina-miosina", nombre: "Actina y miosina", color: "#e07a5f", foto: SUB("musculo", "actinamiosina"),
    eyebrow: "Así se contrae un músculo",
    claves: ["Dos filamentos que se deslizan", "El calcio da la señal", "Cada tirón gasta ATP"],
    explicacion: [
      "Dentro de cada fibra muscular hay dos tipos de filamentos colocados de forma milimétrica: la actina, fina, y la miosina, más gruesa y con unas «cabezas» que sobresalen. Contraer un músculo es, literalmente, hacer que unos se deslicen sobre los otros.",
      "1. La orden. La neurona libera acetilcolina en la unión neuromuscular y eso genera un impulso eléctrico que recorre la fibra entera.",
      "2. El calcio. Ese impulso hace que los almacenes internos de la fibra suelten calcio. Es la señal que lo desencadena todo.",
      "3. Se despeja el carril. En reposo, los puntos de anclaje de la actina están tapados por unas proteínas que hacen de cerrojo. El calcio las aparta y deja el sitio libre.",
      "4. El remo. Las cabezas de miosina se agarran a la actina y tiran de ella, se sueltan, se recolocan y vuelven a tirar, gastando ATP en cada tirón. Muchísimas veces por segundo, como miles de remeros a la vez.",
      "5. El acortamiento. Los filamentos se han deslizado unos sobre otros y cada pequeña unidad de la fibra, el sarcómero, queda más corta. Millones de sarcómeros acortándose al mismo tiempo es lo que notas como un músculo contrayéndose.",
      "Y una cosa que sorprende: relajarse también cuesta energía. Hace falta ATP para volver a guardar el calcio y que las cabezas de miosina se suelten. Por eso, cuando ya no queda ATP, el músculo se queda agarrado y rígido: es lo que ocurre en el rigor mortis.",
    ],
  },
  {
    key: "miostatina", nombre: "Miostatina", color: "#b5806b", foto: SUB("musculo", "miostatina"),
    eyebrow: "El freno del músculo",
    claves: ["Limita cuánto músculo creces", "La fabrica el propio músculo", "Entrenar baja su señal"],
    explicacion: [
      "Si el cuerpo pudiera fabricar músculo sin límite, lo haría… y se arruinaría, porque mantenerlo es carísimo en energía. La miostatina es el freno que lo evita: una proteína que el propio músculo produce y libera para decirle «hasta aquí, no crezcas más».",
      "Cómo frena: se une a receptores de la fibra muscular y apaga las rutas que ordenan fabricar proteína nueva. Al mismo tiempo, mantiene a raya a las células satélite, las que se fusionan a la fibra para repararla y hacerla más grande. Con la miostatina alta, entrenas y el músculo apenas responde.",
      "Cuándo importa: el entrenamiento de fuerza reduce su señal durante unas horas, y esa es parte del motivo por el que un músculo trabajado crece. Con la edad, el reposo prolongado y la inflamación crónica, en cambio, la señal sube y cuesta más mantener masa muscular.",
      "Como curiosidad: existen animales con una mutación que deja la miostatina sin funcionar, como el ganado Blue Belgian o unos ratones apodados «ratones Schwarzenegger», y desarrollan una musculatura enorme. Se han descrito también algunos casos en personas. Es un blanco muy investigado para tratar enfermedades que consumen el músculo, aunque los fármacos probados hasta ahora dan bastante músculo y poca fuerza real.",
    ],
  },
];

// ── Las partes del CEREBRO ─────────────────────────────────────────────────
// Este tema no va como una lista de catorce nombres seguidos: se recorre por
// ZONAS, de fuera hacia dentro (corteza → centro profundo → base), que es como
// se entiende. Por eso lleva `zonas` y cada ficha declara la suya.
const ZONAS_CEREBRO = [
  {
    zona: "corteza",
    titulo: "La corteza",
    entradilla: "Pensamiento, raciocinio, narración, lenguaje y decisiones.",
  },
  {
    zona: "centro",
    titulo: "Sistema límbico y tálamo",
    entradilla: "Emociones, memoria (consciente e inconsciente) y percepción.",
  },
  {
    zona: "base",
    titulo: "Cerebro reptiliano",
    entradilla: "Funciones automáticas y supervivencia.",
  },
];

const CEREBRO: Ficha[] = [
  // ── La corteza ──
  {
    key: "corteza", nombre: "Corteza cerebral", zona: "corteza", color: "#c9a7ff", foto: SUB("cerebro", "corteza"),
    claves: ["La capa de fuera, arrugada", "Unos 16.000 millones de neuronas", "Lo consciente ocurre aquí"],
    explicacion: [
      "Es la capa exterior del cerebro, de apenas unos milímetros de grosor, y está toda plegada. Esos pliegues no son adorno: son la forma que encontró la evolución de meter una superficie enorme dentro de un cráneo pequeño. Si la extendieras, ocuparía como una servilleta grande.",
      "Aquí ocurre casi todo lo que reconoces como «ser tú»: el lenguaje, las decisiones, la imaginación, el reconocer una cara. Se divide en dos hemisferios y cada hemisferio en cuatro lóbulos.",
    ],
  },
  {
    key: "frontal", nombre: "Lóbulo frontal", zona: "corteza", color: "#b79cff", foto: SUB("cerebro", "frontal"),
    claves: ["Decidir, planificar, frenar", "El último en madurar (~25 años)", "Mueve el cuerpo voluntariamente"],
    explicacion: [
      "Está justo detrás de la frente y es el que decide. Planifica, ordena los pasos, sostiene la atención y —sobre todo— frena: es el que dice «esto mejor no».",
      "Ahí está la corteza prefrontal, la parte del cerebro que más tarda en terminar de madurar, hasta pasados los veinte. Por eso a los quince años se siente igual de intenso que a los cuarenta, pero se frena mucho peor. En su parte de atrás está la corteza motora, que ordena cada movimiento voluntario.",
    ],
  },
  {
    key: "parietal", nombre: "Lóbulo parietal", zona: "corteza", color: "#9fb8f2", foto: SUB("cerebro", "parietal"),
    claves: ["Recibe el tacto y el dolor", "Sabe dónde está tu cuerpo", "Orienta en el espacio"],
    explicacion: [
      "Recibe todo lo que tocas, la temperatura, la presión y el dolor, y lo junta en una sola sensación con sentido.",
      "Es también el que sabe dónde termina tu mano cuando cierras los ojos, el que te deja calcular la distancia hasta el vaso antes de cogerlo y el que te orienta cuando andas por un sitio nuevo. Cuando dices que alguien «es muy espacial», estás hablando de esto.",
    ],
  },
  {
    key: "temporal", nombre: "Lóbulo temporal", zona: "corteza", color: "#8fd0e6", foto: SUB("cerebro", "temporal"),
    claves: ["Oye y entiende el lenguaje", "Reconoce caras y voces", "Guarda recuerdos y significados"],
    explicacion: [
      "Está a los lados, a la altura de las orejas. Procesa el sonido y lo convierte en algo con significado: no solo oyes ruido, entiendes una frase o reconoces una canción por tres notas.",
      "También es el que reconoce caras y voces, y donde se guarda buena parte de lo que sabes del mundo. Por dentro conecta con el hipocampo y la amígdala, y por eso un olor o una melodía te devuelven un recuerdo entero de golpe.",
    ],
  },
  {
    key: "occipital", nombre: "Lóbulo occipital", zona: "corteza", color: "#7fc9c2", foto: SUB("cerebro", "occipital"),
    claves: ["Toda la visión pasa por aquí", "Está en la nuca, no en los ojos", "Construye lo que crees ver"],
    explicacion: [
      "Ocupa la parte de atrás del todo, en la nuca. Es donde se ve de verdad: los ojos solo captan luz, la imagen se construye aquí.",
      "Y se construye por partes —color por un lado, movimiento por otro, bordes por otro— hasta montar una escena completa. Que la sientas continua y sin costuras es un trabajo enorme que no notas nunca. Por eso una lesión aquí puede dejar los ojos perfectos y aun así no ver.",
    ],
  },
  {
    key: "cuerpo-calloso", nombre: "Cuerpo calloso", zona: "corteza", color: "#e8e0cf", foto: SUB("cerebro", "cuerpo-calloso"),
    claves: ["Une los dos hemisferios", "Unos 200 millones de fibras", "Hace que trabajen como uno"],
    explicacion: [
      "Es el puente que une el hemisferio izquierdo con el derecho: un haz de unos doscientos millones de fibras nerviosas que cruzan de lado a lado.",
      "Gracias a él los dos lados comparten lo que cada uno hace y el cerebro funciona como una sola cosa en vez de como dos. Lo de «ser de hemisferio izquierdo o derecho» es un mito: la gracia está justo en que están conectados todo el rato.",
    ],
  },

  // ── El centro profundo ──
  {
    key: "talamo", nombre: "Tálamo", zona: "centro", color: "#a7d9f2", foto: SUB("cerebro", "talamo"),
    claves: ["La centralita de los sentidos", "Filtra lo que llega a la conciencia", "Todo pasa por aquí menos el olfato"],
    explicacion: [
      "Está en el centro, y por él pasa casi toda la información que entra por los sentidos antes de subir a la corteza. El olfato es la única excepción: va directo, y por eso los olores llegan tan crudos y tan pegados a la emoción.",
      "El tálamo no solo reparte, también filtra: decide qué merece llegar a tu conciencia y qué se queda fuera. Ahora mismo no notabas la ropa sobre la piel; eso es él.",
    ],
  },
  {
    key: "hipotalamo", nombre: "Hipotálamo", zona: "centro", color: "#e6a7d9", foto: SUB("cerebro", "hipotalamo"),
    claves: ["Hambre, sed, sueño, temperatura", "Manda sobre las hormonas", "Del tamaño de una almendra"],
    explicacion: [
      "Es pequeñísimo y gobierna lo esencial: el hambre, la sed, la temperatura del cuerpo, el deseo sexual y el reloj que decide cuándo tienes sueño.",
      "Es la bisagra entre el sistema nervioso y el hormonal, porque desde aquí se da la orden a la hipófisis. Cuando el estrés te quita el hambre, te desajusta el sueño o te corta la regla, esto es lo que está pasando: no es «cosa de la cabeza», es una cadena física que empieza aquí.",
    ],
  },
  {
    key: "hipofisis", nombre: "Hipófisis", zona: "centro", color: "#f2b48f", foto: SUB("cerebro", "hipofisis"),
    claves: ["La glándula que manda", "Ordena a tiroides, ovarios, suprarrenales", "Pesa medio gramo"],
    explicacion: [
      "Del tamaño de un guisante y colgando bajo el hipotálamo, es la glándula que da órdenes a las demás. Desde aquí salen las hormonas que ponen en marcha la tiroides, los ovarios y los testículos, las suprarrenales y el crecimiento.",
      "Se la llamó «la glándula maestra» durante años, aunque en realidad ella también obedece: quien le manda es el hipotálamo, justo encima.",
    ],
  },
  {
    key: "amigdala", nombre: "Amígdala", zona: "centro", color: "#f28b8b", foto: SUB("cerebro", "amigdala"),
    claves: ["La alarma del miedo", "Reacciona antes de que entiendas", "Marca lo que hay que recordar"],
    explicacion: [
      "Es la que detecta el peligro, y lo hace deprisa: reacciona antes de que hayas entendido qué pasa. Por eso das un salto con un ruido y solo después te das cuenta de que era una puerta.",
      "También es la que pone etiqueta emocional a lo que vives, y lo que va marcado con emoción se recuerda mucho mejor. Con estrés sostenido se vuelve hiperreactiva y empieza a dar la alarma con cosas que no lo son.",
    ],
  },
  {
    key: "hipocampo", nombre: "Hipocampo", zona: "centro", color: "#9fe6b8", foto: SUB("cerebro", "hipocampo"),
    claves: ["Convierte lo vivido en recuerdo", "Es el mapa del espacio", "Fabrica neuronas nuevas"],
    explicacion: [
      "Tiene forma de caballito de mar, de ahí el nombre. Es el que pasa a limpio: coge lo que acabas de vivir y lo convierte en un recuerdo que dura, sobre todo mientras duermes.",
      "También es tu mapa: la memoria de los sitios vive aquí. Y es una de las poquísimas zonas del cerebro adulto donde nacen neuronas nuevas. El cortisol del estrés crónico lo daña, y el ejercicio y el buen sueño lo protegen.",
    ],
  },
  {
    key: "ganglios-basales", nombre: "Ganglios basales", zona: "centro", color: "#f2c86b", foto: SUB("cerebro", "ganglios-basales"),
    claves: ["Automatizan lo que repites", "Aquí viven los hábitos", "Trabajan con dopamina"],
    explicacion: [
      "Son un grupo de núcleos profundos que se encargan de lo que ya no necesitas pensar. Aprender a conducir cuesta un esfuerzo enorme; un año después conduces mientras hablas. Ese paso de «esforzado» a «automático» ocurre aquí.",
      "Por eso son también la casa de los hábitos, los buenos y los malos, y funcionan con dopamina: cuando algo sale bien, marcan la secuencia para repetirla.",
    ],
  },

  // ── La base ──
  {
    key: "cerebelo", nombre: "Cerebelo", zona: "base", color: "#b8d98f", foto: SUB("cerebro", "cerebelo"),
    claves: ["Equilibrio y precisión", "La mitad de tus neuronas están aquí", "Afina el movimiento sobre la marcha"],
    explicacion: [
      "Está detrás y abajo, y aunque ocupa una décima parte del cerebro contiene más de la mitad de todas tus neuronas. No decide el movimiento, lo afina: corrige el gesto mientras lo haces para que salga suave y en su sitio.",
      "Mantenerte de pie, coger un vaso sin tirarlo o escribir a mano son suyos. También participa en aprender secuencias y en el lenguaje, aunque durante décadas se creyó que solo era motor.",
    ],
  },
  {
    key: "tronco", nombre: "Tronco encefálico", zona: "base", color: "#e3a6a6", foto: SUB("cerebro", "tronco"),
    claves: ["Respirar y latir sin pensarlo", "Regula el estar despierto", "Une el cerebro con la médula"],
    explicacion: [
      "Es el tallo que conecta el cerebro con la médula espinal, y lo más antiguo que tienes. Aquí se controla lo que no puedes permitirte olvidar: la respiración, los latidos, la tensión, la tos, el tragar. También regula el estar despierto o dormido.",
      "Por él pasan todas las señales que suben y bajan entre el cuerpo y el cerebro, y ahí es donde se cruzan de lado: por eso el hemisferio izquierdo mueve la mitad derecha del cuerpo.",
    ],
  },
];

// ═════════════════════════════════════════════════════════════════════════
// Los temas de PROFUNDIZA, agrupados en 3 bloques para el hub.
// Neurotransmisores lleva cómic de intro; el resto ya tienen sus fichas con un
// primer texto de desarrollo (María los revisará para darles profundidad).
// ═════════════════════════════════════════════════════════════════════════
export const GRUPOS_PROFUNDIZA = [
  "El sistema nervioso",
  "Química interna",
  "El código y la limpieza",
  "Vida y muerte celular",
] as const;

export const TEMAS_PROFUNDIZA: TemaProfundiza[] = [
  // ── Bloque 0 · El sistema nervioso ──
  {
    key: "cerebro",
    label: "El cerebro",
    resumen: "",
    color: "#c9a7ff",
    foto: PORTADA("cerebro"),
    grupo: "El sistema nervioso",
    intro: "",
    pista: "",
    fichasColoreadas: true,
    zonas: ZONAS_CEREBRO,
    fichas: CEREBRO,
    cierre: "",
  },

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
    pista: "",
    fichasColoreadas: true,
    fichas: HORMONAS,
  },
  {
    key: "menstruacion",
    label: "La menstruación",
    resumen: "El ciclo, fase a fase.",
    color: "#e86fb0",
    foto: PORTADA("menstruacion"),
    grupo: "Química interna",
    intro: "Desde que hay energía suficiente hasta que el endometrio se desprende: el recorrido hormonal del ciclo menstrual, paso a paso.",
    pista: "",
    fichas: MENSTRUACION,
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
  {
    key: "cetosis",
    label: "Cetosis",
    resumen: "Cuando el cuerpo tira de la grasa.",
    color: "#f2994a",
    foto: PORTADA("cetosis"),
    grupo: "Química interna",
    intro: "La dieta cetogénica: cuando falta la glucosa, el cuerpo fabrica cuerpos cetónicos a partir de la grasa y los usa como combustible.",
    pista: "",
    fichas: CETOSIS,
  },
  {
    key: "musculo",
    label: "Músculos",
    resumen: "Cómo se contraen y qué los frena.",
    color: "#e07a5f",
    foto: PORTADA("musculoportada"),
    grupo: "Química interna",
    intro: "Qué ocurre exactamente dentro de una fibra muscular cuando te mueves, y por qué tu propio cuerpo le pone un freno al crecimiento.",
    pista: "",
    fichas: MUSCULO,
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
  {
    key: "sistema-enterico",
    label: "Sistema nervioso entérico",
    resumen: "El «segundo cerebro» del intestino.",
    color: "#9fe6b8",
    foto: PORTADA("sistemaenterico"),
    grupo: "Vida y muerte celular",
    intro: "Una red de millones de neuronas en las paredes del tubo digestivo que dirige la digestión casi por su cuenta.",
    pista: "",
    fichas: SISTEMA_ENTERICO,
  },
];

export function temaByKey(key: string): TemaProfundiza | undefined {
  return TEMAS_PROFUNDIZA.find((t) => t.key === key);
}
