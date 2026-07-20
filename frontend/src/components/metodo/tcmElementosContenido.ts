// ─────────────────────────────────────────────────────────────────────────
// CONTENIDO RICO DE LOS 5 ELEMENTOS (Wu Xing) · paso 4 del recorrido de TCM
//
// Cada elemento tiene las mismas 7 secciones, así que UNA plantilla de página
// (MetodoTcmElemento.tsx) las renderiza todas. Editar contenido = editar aquí.
//
// El texto es la voz del curso de Medicina China. La puntuación/mini-test de
// cada elemento vive en tcmRecorrido.ts (ELEMENTOS[el].miniTest).
// ─────────────────────────────────────────────────────────────────────────
import { testsDeElemento, type Elemento } from "./tcmRecorrido";

export interface ParRige { clave: string; valor: string; }
export interface FuncionElemento { titulo: string; texto: string; }

export interface GuiaPractica {
  nutricion: string[];
  evitar?: string[];
  estiloDeVida: string[];
  descanso: string;
  ejercicio: string[];
  terapia: string[];
  afirmacion: string;
}

export interface ContenidoElementoRico {
  id: Elemento;
  nombre: string;
  hanzi: string;
  /** X.1 · introducción (qué representa, estación, palabras clave). */
  intro: string[];
  /** X.2 · qué rige (pares clave/valor). */
  rige: ParRige[];
  /** X.3 · funciones fisiológicas del órgano Zang. */
  funciones: FuncionElemento[];
  /** X.4 · la manifestación. */
  equilibrio: string[];
  exceso: string[];
  deficiencia: string[];
  cierre?: string;
  /** X.5 · cómo equilibrarlo. */
  equilibrar: string[];
  /** X.6 · manifestaciones del desequilibrio. */
  desequilibrio: string[];
  /** X.7 · guía práctica. */
  guia: GuiaPractica;
}

// Módulo 1 · introducción a los Cinco Elementos (Wu Xing). Es la intro de la
// estrella (paso 4), presentada como un cómic de 4 viñetas (foto + texto).
// Fuente: material del curso de Medicina China.
export interface VinetaIntro { src: string; texto: string; }
export const COMIC_INTRO_ELEMENTOS: VinetaIntro[] = [
  {
    src: "/recorrido/tcm/elementos/elementos1.png",
    texto:
      "Los Cinco Elementos (Wu Xing) —Madera, Fuego, Tierra, Metal y Agua— constituyen una de las bases teóricas fundamentales de la Medicina Tradicional China. No son «cosas» literales ni meros símbolos: describen procesos dinámicos de la vida y la manera en que el Qi se transforma y se expresa en la naturaleza y en el ser humano.",
  },
  {
    src: "/recorrido/tcm/elementos/elementos2.png",
    texto:
      "Cada persona encarna el movimiento de los cinco elementos, y vivir en armonía con el Dao significa permitir que esos procesos se expresen sin obstrucción.",
  },
  {
    src: "/recorrido/tcm/elementos/elementos3.png",
    texto:
      "Un desequilibrio aparece cuando un elemento se vuelve excesivo (sobreactúa) o deficiente (rinde por debajo de lo normal). Los médicos de la antigua China los observaban mediante una atención profunda a la persona: su postura, su expresión, su voz, su pulso, sus hábitos, sus emociones y todos aquellos detalles sutiles que revelan el estado del Qi.",
  },
  {
    src: "/recorrido/tcm/elementos/elementos4.png",
    texto:
      "Cada elemento agrupa un órgano Zang (principal), un órgano Fu (víscera asociada), un tejido, un orificio sensorial, un líquido corporal, una emoción, un color, un sabor, una estación, un tipo de voz y un movimiento característico.",
  },
];

const madera: ContenidoElementoRico = {
  id: "madera",
  nombre: "Madera",
  hanzi: "木",
  intro: [
    "La Madera representa el crecimiento, el ascenso, la dispersión y la fluidez.",
    "Es la energía de la primavera: todo lo que brota, se expande y busca moverse con libertad pertenece a la Madera.",
    "Sus palabras clave son crecimiento, dirección y renovación.",
    "Cuando la Madera está en equilibrio, todo circula sin obstáculos, permitiendo que el Qi fluya de forma armoniosa y que la Vida siga su curso natural.",
  ],
  rige: [
    { clave: "Órgano Zang (Yin)", valor: "el Hígado" },
    { clave: "Órgano Fu (Yang)", valor: "la Vesícula Biliar, conectada interior y exteriormente con el Hígado" },
    { clave: "Tejido", valor: "los tendones" },
    { clave: "Manifestación externa", valor: "las uñas, cuyo brillo y fortaleza reflejan el estado del Hígado" },
    { clave: "Orificio sensorial", valor: "los ojos, con una conexión especial con el Hígado" },
    { clave: "Líquido corporal", valor: "la lágrima" },
    { clave: "Emoción", valor: "la ira y la frustración; en equilibrio, asertividad y capacidad de poner límites" },
    { clave: "Color", valor: "azul verdoso" },
    { clave: "Sabor", valor: "ácido" },
    { clave: "Estación", valor: "primavera" },
    { clave: "Voz", valor: "grito o voz explosiva" },
    { clave: "Movimiento", valor: "expansión hacia afuera, como el crecimiento de un árbol" },
  ],
  funciones: [
    {
      titulo: "Gobierna el libre flujo del Qi",
      texto:
        "El Hígado mantiene el equilibrio entre los movimientos del Qi: cuando está en armonía, el Qi circula con suavidad, el Qi y la Sangre permanecen equilibrados y las actividades fisiológicas funcionan con normalidad. Un Hígado con un Qi fluido favorece además una mente emocional fluida, e influye en la circulación de la Sangre y los líquidos, la secreción de bilis, el ascenso de lo puro y el descenso de lo turbio del Bazo, y en la menstruación y la espermiación.",
    },
    {
      titulo: "Almacena la Sangre",
      texto:
        "El Hígado actúa como reservorio de Sangre. En actividad, distribuye la Sangre hacia la periferia para nutrir los tejidos y permitir el movimiento. En reposo, calma emocional o frío, la necesidad de Sangre en la periferia disminuye y el excedente regresa al Hígado para ser almacenado.",
    },
    {
      titulo: "Gobierna los tendones",
      texto:
        "El Su Wen afirma: «El Hígado gobierna los tendones». El Qi y la Sangre del Hígado nutren los tendones, aportándoles fuerza, flexibilidad y capacidad de movimiento. Una enfermedad prolongada del Hígado puede provocar trastornos tendinosos, y una alteración mantenida en los tendones también puede terminar afectando al Hígado.",
    },
  ],
  equilibrio: [
    "Una Madera en equilibrio es visionaria, valiente y flexible, con buena capacidad de planificación y de adaptación a los cambios.",
    "El Qi fluye con libertad, permitiendo un movimiento armonioso físico y emocional. Existe una ambición sana, capaz de impulsar el crecimiento sin necesidad de imponerse o actuar desde la agresividad.",
  ],
  exceso: [
    "Cuando la Madera está en exceso, la energía asciende de forma descontrolada. Puede manifestarse como arrebatos de ira, rabia, impaciencia e irritabilidad, con una constante sensación de bloqueo o de prisa.",
    "Es frecuente la tensión muscular en cuello, mandíbula y hombros, los ojos rojos o inyectados y los dolores de cabeza ascendentes. La voz puede volverse fuerte, dominante o explosiva, con conductas controladoras y sobrecompetitividad.",
  ],
  deficiencia: [
    "Cuando la Madera está deficiente, falta el impulso necesario para avanzar. Puede aparecer falta de iniciativa, dificultad para encontrar una dirección clara o para tomar decisiones. La persona se desanima con facilidad, teme actuar y puede mostrar baja motivación, timidez e indecisión.",
    "A nivel físico pueden aparecer ojos cansados, visión borrosa, tendones débiles, calambres o temblores. La visión puede verse afectada literal y metafóricamente, dificultando proyectarse hacia el futuro.",
  ],
  equilibrar: [
    "El sabor ácido, asociado al color azul verdoso, posee una acción astringente y la capacidad de inhibir la sudoración. En MTC se usa con criterio para consolidar y preservar los fluidos del organismo.",
    "La Madera necesita movimiento: favorece el movimiento físico regular, la gestión consciente de la ira y la frustración, y evita la represión emocional sostenida, que bloquea su movimiento natural.",
    "Los ojos y los tendones son el principal termómetro de la Madera: molestias visuales, tensión tendinosa o pérdida de flexibilidad informan del estado del Hígado.",
    "En la observación del rostro, un tinte azul verdoso en ciertas zonas puede indicar una alteración del Hígado o un desequilibrio de la Madera.",
  ],
  desequilibrio: [
    "Cuando el Qi del Hígado pierde su capacidad de fluir, aparece un estancamiento: distensión, plenitud o dolor en el pecho, la región hipocondríaca, las mamas, el bajo vientre o los genitales externos.",
    "Si el Hígado no promueve el libre flujo del Qi, se afectan la circulación de Sangre y líquidos, la secreción de bilis, la digestión (ascenso de lo puro y descenso de lo turbio del Bazo), la menstruación y la espermiación.",
    "Un sabor ácido en la boca suele indicar hiperactividad del Fuego del Hígado, sobre todo cuando invade el Estómago: el calor acumulado asciende hacia la boca y produce esa sensación ácida.",
  ],
  guia: {
    nutricion: [
      "Verduras amargas: diente de león, rúcula o kale",
      "Alimentos ácidos: limón, vinagre o encurtidos",
      "Hierbas frescas: menta, albahaca y perejil",
      "Germinados",
      "Té verde",
    ],
    estiloDeVida: [
      "Movimiento por la mañana: estiramientos, Qi Gong o artes marciales",
      "Expresión creativa: planificar, escribir, dar forma a nuevos proyectos",
      "Límites sanos, evitando acumular frustración o resentimiento",
    ],
    descanso: "Alrededor de las 22:30, cuando la energía de la Madera comienza a relajarse y recuperarse.",
    ejercicio: ["Actividad dinámica pero no agresiva, con movimiento continuo y flexible, como el crecimiento de la primavera"],
    terapia: ["Mapas de visión", "Coaching", "Caminatas entre árboles o en plena naturaleza"],
    afirmacion: "Avanzo con flexibilidad.",
  },
};

const fuego: ContenidoElementoRico = {
  id: "fuego",
  nombre: "Fuego",
  hanzi: "火",
  intro: [
    "El Fuego representa el calor, lo ardiente y el ascenso.",
    "Es la energía del verano: expansiva, luminosa y ascendente, que se eleva como una llama.",
    "En el cuerpo, el Fuego es la fuerza que calienta, impulsa y enciende la conciencia, favoreciendo la vitalidad, la comunicación y la presencia.",
    "Sus palabras clave son expresión, conexión y espíritu.",
  ],
  rige: [
    { clave: "Órgano Zang (Yin)", valor: "el Corazón, el «órgano monarca», que gobierna el Shen (la mente) y coordina el resto de órganos" },
    { clave: "Órgano Fu (Yang)", valor: "el Intestino Delgado" },
    { clave: "Tejido", valor: "los vasos sanguíneos" },
    { clave: "Manifestación externa", valor: "la tez, cuyo color y brillo reflejan el estado del Corazón" },
    { clave: "Orificio sensorial", valor: "la lengua, ligada al habla, la expresión y el estado del Shen" },
    { clave: "Líquido corporal", valor: "el sudor" },
    { clave: "Emoción", valor: "la alegría y, en exceso, la manía; en equilibrio, presencia y serenidad" },
    { clave: "Color", valor: "rojo" },
    { clave: "Sabor", valor: "amargo" },
    { clave: "Estación", valor: "verano" },
    { clave: "Voz", valor: "la risa o una voz sobreexcitada" },
    { clave: "Movimiento", valor: "ascenso, como la llama de un fuego" },
  ],
  funciones: [
    {
      titulo: "Controla la Sangre y los vasos sanguíneos",
      texto:
        "El Corazón impulsa la Sangre para que circule por todo el organismo, llegando a cada tejido y órgano. La Sangre circula por los vasos gracias a su impulso constante, nutriendo y humedeciendo todas las partes del cuerpo para que funcionen con normalidad.",
    },
    {
      titulo: "Domina el espíritu (Shen)",
      texto:
        "El Corazón alberga y gobierna el Shen: el espíritu, la conciencia, la mente y las actividades de pensamiento, memoria, emociones y claridad mental. Por eso es el «órgano monarca», que dirige el organismo en el plano físico, mental y emocional.",
    },
  ],
  equilibrio: [
    "Un Fuego en equilibrio es cálido, expresivo y carismático. La persona se relaciona desde la autenticidad, disfrutando de una comunicación y una intimidad sanas.",
    "A nivel físico suele haber buen descanso, un ritmo cardíaco estable y una sensación general de vitalidad y presencia.",
  ],
  exceso: [
    "Cuando el Fuego está en exceso, la energía asciende de forma descontrolada: inquietud, ansiedad, pánico o insomnio. Es frecuente hablar en exceso, reír de forma nerviosa o una necesidad constante de estimulación y contacto social.",
    "También pueden aparecer palpitaciones, calor en el pecho o la cara, sobreapego, celos y reacciones intensas o dramáticas, con tendencia a la sobre-socialización.",
  ],
  deficiencia: [
    "Cuando el Fuego está deficiente, disminuye la capacidad de conectar con uno mismo y con los demás: aplanamiento emocional, dificultad para expresar afecto o vincularse, sensación de soledad o de no ser comprendido.",
    "A nivel físico son frecuentes las manos y pies fríos, la fatiga, los olvidos, la falta de entusiasmo, una voz baja, la mala circulación y la sensación de no ser escuchado.",
  ],
  cierre: "El Fuego se revela en la forma en que nos relacionamos, expresamos lo que sentimos y compartimos nuestra presencia con los demás.",
  equilibrar: [
    "El sabor amargo, asociado al color rojo, elimina el calor. En MTC es el sabor que ayuda a disminuir el exceso de Fuego.",
    "El Shen habita en el Corazón, así que el descanso mental y emocional es esencial. La sobreestimulación, el exceso de actividad, el estrés o la falta de descanso agitan el Shen.",
    "La tez y la lengua son las ventanas del Corazón: un rostro muy rojo o una lengua alterada informan del estado del Fuego.",
    "La alegría es su emoción: equilibrada, nutre el Shen; convertida en euforia o sobreexcitación, dispersa el Qi y debilita el Corazón.",
  ],
  desequilibrio: [
    "Un sabor amargo en la boca suele indicar una exuberancia relativa del Fuego del Corazón (exceso de calor).",
    "Si el Corazón no domina el Shen: dificultad para concentrarse, inquietud mental, confusión o desequilibrio emocional.",
    "Si no bombea la Sangre con fuerza, no nutre ni humedece los tejidos: mala circulación, debilidad o fatiga.",
    "La tez refleja el Corazón: un enrojecimiento excesivo del rostro puede señalar exceso de Fuego.",
  ],
  guia: {
    nutricion: [
      "Alimentos hidratantes: pepino, sandía y lechuga",
      "Alimentos amargos: lechuga romana, cacao y quinoa",
      "Frutos rojos: cerezas y bayas de espino blanco",
      "Infusiones refrescantes: crisantemo e hibisco",
    ],
    estiloDeVida: [
      "Priorizar la intimidad y las amistades auténticas",
      "Meditación u otras técnicas para calmar y enfriar la mente",
      "Que el tiempo compartido sea alegre y no agotador",
    ],
    descanso: "Antes de las 23:00, favoreciendo el descanso del Corazón y la estabilidad del Shen.",
    ejercicio: ["Baile", "Cardio suave", "Ejercicio de fuerza", "Movimiento desde la alegría, no desde la exigencia"],
    terapia: ["La risa", "El canto", "Rituales compartidos que fomenten la conexión"],
    afirmacion: "Mi alegría es serena.",
  },
};

const tierra: ContenidoElementoRico = {
  id: "tierra",
  nombre: "Tierra",
  hanzi: "土",
  intro: [
    "La Tierra representa la capacidad de generar, transformar, sostener y recibir.",
    "Es el centro de los Cinco Elementos, la energía que transforma lo que recibimos —alimentos y líquidos— en lo que nos sostiene: el Qi y la Sangre.",
    "Todo lo que nutre, aporta estabilidad y favorece el equilibrio del organismo pertenece a la Tierra.",
    "Sus palabras clave son nutrición, estabilidad y hogar interior.",
  ],
  rige: [
    { clave: "Órgano Zang (Yin)", valor: "el Bazo, el «granero del cuerpo», que transforma los alimentos y genera Qi y Sangre" },
    { clave: "Órgano Fu (Yang)", valor: "el Estómago" },
    { clave: "Tejido", valor: "los músculos" },
    { clave: "Manifestación externa", valor: "los labios, cuyo aspecto refleja el estado del Bazo" },
    { clave: "Orificio sensorial", valor: "la boca" },
    { clave: "Líquido corporal", valor: "la saliva fluida (baba)" },
    { clave: "Emoción", valor: "la preocupación y la rumiación; en equilibrio, confianza y capacidad de sostén" },
    { clave: "Color", valor: "amarillo" },
    { clave: "Sabor", valor: "dulce" },
    { clave: "Estación", valor: "final del verano y transiciones entre estaciones" },
    { clave: "Voz", valor: "el canto o un tono melodioso" },
    { clave: "Movimiento", valor: "centrar y transformar" },
  ],
  funciones: [
    {
      titulo: "Gobierna el transporte y la transformación",
      texto:
        "El Bazo transforma y transporta los nutrientes de alimentos y líquidos, convirtiéndolos en Qi y Sangre, y regula el metabolismo de los líquidos. Con un Qi de Bazo fuerte se evita la acumulación de humedad, flema o retención de líquidos; debilitado, aparecen humedad interna, flema y retención.",
    },
    {
      titulo: "Asciende lo puro",
      texto:
        "Eleva los nutrientes obtenidos de alimentos y bebidas hacia el Corazón, los Pulmones, la cabeza y los ojos, donde se transforman en Qi y Sangre para sostener todas las funciones del organismo.",
    },
    {
      titulo: "Controla la circulación de la Sangre",
      texto:
        "Mantiene la Sangre dentro de los vasos, evitando que se extravase. Si esta función se debilita, puede favorecer hemorragias, hematomas o sangrados espontáneos.",
    },
  ],
  equilibrio: [
    "Una Tierra en equilibrio es afectuosa, responsable y mantiene los pies en la tierra. Transmite estabilidad y sabe cuidar de sí misma y de los demás sin perder su centro.",
    "A nivel físico suele haber una digestión fuerte, buena inmunidad, energía estable y un pensamiento práctico y organizado.",
  ],
  exceso: [
    "Cuando la Tierra está en exceso, el deseo de cuidar se convierte en sobreprotección, llegando a asfixiar, controlar a los demás y abandonarse a uno mismo. Aparece una fuerte necesidad de no cambiar, control y seguridad, con rumiación, terquedad y dificultad para soltar patrones del pasado.",
    "A nivel físico son frecuentes el exceso de comida, el aumento de peso y la acumulación de humedad o mucosidad.",
  ],
  deficiencia: [
    "Cuando la Tierra está deficiente, disminuye la capacidad de nutrir, transformar y sostener: músculos débiles, fatiga después de comer, hinchazón abdominal, heces blandas y antojo intenso de dulce.",
    "A nivel emocional puede aparecer falta de autoestima o pérdida del propio centro; la persona tiende a ser complaciente, absorbiendo la energía y las necesidades de los demás y olvidándose de sí misma.",
  ],
  cierre: "La Tierra revela nuestra capacidad para recibir nutrición, no solo de los alimentos, sino también del afecto, el cuidado y todo lo que la vida nos ofrece.",
  equilibrar: [
    "El sabor dulce, asociado al color amarillo, suplementa el Qi y el Yin. Hablamos del dulce natural y moderado de los alimentos, no del azúcar en exceso, que debilita el Bazo y favorece la humedad.",
    "La humedad es el principal enemigo del Bazo: conviene moderar lácteos, azúcares, harinas refinadas y fritos, y facilitar la correcta transformación de nutrientes y líquidos.",
    "La Tierra ama la regularidad: horarios estables de comidas, comer con calma y hábitos digestivos saludables fortalecen el Qi del Bazo.",
    "Su emoción es la preocupación: la rumiación constante debilita el Qi del Bazo, afectando digestión y equilibrio emocional. Los labios reflejan el Bazo: con buen color y brillo indican un Bazo sano.",
  ],
  desequilibrio: [
    "Con el Qi del Bazo debilitado y su transporte fallido, el organismo no moviliza bien los líquidos: humedad interna, flema y retención.",
    "Un sabor dulce o grasiento en la boca suele indicar obstrucción de humedad en el Bazo, que hace ascender el Qi turbio.",
    "Si se debilita su función de contener la Sangre: sangrados, hematomas o hemorragias.",
    "Si el Bazo no asciende lo puro, los nutrientes no llegan al Corazón, los Pulmones, la cabeza y los ojos, que dejan de nutrirse.",
  ],
  guia: {
    nutricion: [
      "Alimentos calientes y cocidos: sopas, cremas y guisos",
      "Carbohidratos complejos: raíces, calabaza y tubérculos",
      "Legumbres y cereales integrales",
      "Especias dulces y templadas: jengibre y canela",
      "Probióticos y fermentados, si se toleran bien",
    ],
    evitar: [
      "Comer con ansiedad o de forma apresurada",
      "Exceso de ensaladas crudas, sobre todo en frío",
      "Bebidas frías o con hielo",
      "Exceso de dulces, snacks y lácteos (favorecen la humedad)",
    ],
    estiloDeVida: [
      "Rutinas que aporten equilibrio y seguridad",
      "Cuidar de los demás sin dejar de atender las propias necesidades",
      "Comer con atención plena, disfrutando del momento",
      "Mantener los espacios ordenados y despejados",
    ],
    descanso: "Una rutina de desconexión durante la media tarde-noche, favoreciendo el descanso físico y mental.",
    ejercicio: ["Caminar", "Yoga", "Ejercicio de fuerza", "Jardinería o contacto con la tierra"],
    terapia: ["Masaje", "Una comunidad de apoyo donde sentirse acompañado y sostenido"],
    afirmacion: "Estoy sostenido y me nutro a mí mismo.",
  },
};

const metal: ContenidoElementoRico = {
  id: "metal",
  nombre: "Metal",
  hanzi: "金",
  intro: [
    "El Metal representa la capacidad de purificar, descender y astringir.",
    "Es la energía del otoño: recoge, limpia, ordena y permite soltar aquello que ya no sirve.",
    "En el cuerpo, el Metal gobierna el intercambio con el exterior: respiramos, filtramos y dejamos ir, tanto física como emocionalmente.",
    "Sus palabras clave son estructura, límites y desapego.",
  ],
  rige: [
    { clave: "Órgano Zang (Yin)", valor: "el Pulmón" },
    { clave: "Órgano Fu (Yang)", valor: "el Intestino Grueso" },
    { clave: "Tejido", valor: "la piel y el vello corporal" },
    { clave: "Orificio sensorial", valor: "la nariz" },
    { clave: "Líquido corporal", valor: "la mucosidad nasal" },
    { clave: "Emoción", valor: "el duelo y la tristeza; en equilibrio, aceptación y capacidad de dejar ir" },
    { clave: "Color", valor: "blanco" },
    { clave: "Sabor", valor: "picante" },
    { clave: "Estación", valor: "otoño" },
    { clave: "Voz", valor: "el llanto o el suspiro" },
    { clave: "Movimiento", valor: "contracción y refinamiento" },
  ],
  funciones: [
    {
      titulo: "Regula y gestiona el organismo",
      texto:
        "El Pulmón está a cargo de la regulación y gestión de numerosas funciones fisiológicas, contribuyendo al equilibrio del organismo y a la correcta circulación del Qi.",
    },
    {
      titulo: "Desciende y purifica",
      texto:
        "Inhala el aire fresco de la naturaleza, dispersa hacia abajo el aire, los líquidos y la esencia procedente del Bazo, y purifica las vías respiratorias. El ascenso-dispersión y el descenso-purificación son inseparables: las dos caras de la respiración normal.",
    },
    {
      titulo: "Se relaciona con la piel y el vello",
      texto:
        "Distribuye el Qi esencial para nutrir la piel y dispersa el Wei Qi (Qi defensivo) protegiendo la superficie del cuerpo. Los patógenos externos suelen invadir por la piel, afectando primero al Pulmón. Piel y músculos forman una red continua (Cou Li), la primera barrera de defensa del organismo.",
    },
    {
      titulo: "La nariz es su orificio",
      texto:
        "La nariz es el portal por el que entra y sale el Qi de la respiración. Gobierna el olfato, participa en la vocalización y es el orificio sensorial del Pulmón.",
    },
  ],
  equilibrio: [
    "Un Metal en equilibrio es disciplinado, organizado y con gran claridad moral. Sabe establecer límites sanos, ordenar su vida y soltar aquello que ya cumplió su función.",
    "A nivel físico suele haber una respiración profunda, buena capacidad pulmonar y un sistema inmunitario fuerte.",
  ],
  exceso: [
    "Cuando el Metal está en exceso, la necesidad de orden se vuelve perfeccionismo, rigidez y una actitud excesivamente crítica hacia uno mismo y los demás. Aparecen hábitos muy rígidos, dificultad para adaptarse e intolerancia a lo que escapa del control.",
    "A nivel físico pueden aparecer problemas de piel, estreñimiento, congestión nasal crónica y tendencia a mostrarse frío o distante.",
  ],
  deficiencia: [
    "Cuando el Metal está deficiente, aparece una profunda tristeza y dificultad para dejar ir personas, situaciones o experiencias. Sistema inmunitario debilitado, respiración superficial y sensación de desorganización.",
    "También puede haber poco amor propio, excesiva influencia del entorno y descuido de los propios límites. A nivel físico, problemas de piel y de los senos paranasales.",
  ],
  cierre: "El Metal nos enseña el valor del equilibrio: una rigidez excesiva termina por romper lo que intenta proteger, mientras que la ausencia de estructura hace que la vida pierda dirección y sentido.",
  equilibrar: [
    "El sabor picante, asociado al color blanco, promueve la circulación del Qi y la Sangre. Es el sabor que abre, moviliza y favorece la circulación de la energía.",
    "La piel es la primera barrera defensiva y la principal puerta de entrada de patógenos hacia el Pulmón: mantenerla sana fortalece el Metal y el Wei Qi.",
    "La función de descenso y purificación del Pulmón es un pilar del Metal: cuidar la respiración y mantener las vías despejadas favorece el intercambio del Qi.",
    "El duelo y la tristeza son sus emociones: aprender a soltar de forma saludable protege el Qi del Pulmón y evita que la energía se estanque.",
  ],
  desequilibrio: [
    "Un sabor picante en la boca puede indicar un trastorno del Metal o del Pulmón, aunque es poco habitual en la práctica clínica.",
    "Si el Pulmón no dispersa el Wei Qi hacia la piel, el organismo pierde protección y los patógenos externos penetran con más facilidad. Si falla el descenso y la purificación, aparecen alteraciones respiratorias.",
    "El desequilibrio del Metal se manifiesta en la piel, el vello y la nariz. Una palidez marcada, de tono blanquecino, puede señalar debilidad del Pulmón o del Metal.",
  ],
  guia: {
    nutricion: [
      "Alimentos blancos: daikon, ajo y cebolla",
      "Rábanos, peras y manzanas",
      "Alimentos que humedecen el Pulmón: miel o congee de arroz",
      "Setas y algas",
      "Infusiones tibias de jengibre o regaliz",
    ],
    estiloDeVida: [
      "Ejercicios de respiración y Qi Gong para expandir el Pulmón",
      "Prácticas de liberación: escribir, ordenar o despejar espacios",
      "Rituales que aporten significado y faciliten el cierre de etapas",
    ],
    descanso: "Dormir en una habitación profundamente oscura y silenciosa, favoreciendo una respiración tranquila.",
    ejercicio: ["Pilates", "Trabajo postural", "Ejercicio de fuerza", "Senderismo a buen ritmo"],
    terapia: ["Procesamiento del duelo", "Prácticas de respiración consciente"],
    afirmacion: "Suelto el pasado y respiro vida nueva.",
  },
};

const agua: ContenidoElementoRico = {
  id: "agua",
  nombre: "Agua",
  hanzi: "水",
  intro: [
    "El Agua representa la capacidad de humedecer, descender, enfriar y almacenar.",
    "Es la energía del invierno: la reserva profunda, aquello que se conserva para que la vida pueda continuar y renovarse cuando llegue el momento.",
    "En el cuerpo, el Agua es la raíz del organismo. Representa la esencia, la herencia y la base sobre la que se desarrolla todo crecimiento físico, mental y espiritual.",
    "Sus palabras clave son reservas, restauración y poder interior.",
  ],
  rige: [
    { clave: "Órgano Zang (Yin)", valor: "el Riñón, el «fundamento congénito», que almacena la Esencia (Jing)" },
    { clave: "Órgano Fu (Yang)", valor: "la Vejiga Urinaria" },
    { clave: "Tejido", valor: "los huesos y la producción de médula" },
    { clave: "Manifestación externa", valor: "el cabello, cuyo estado refleja la fortaleza de la Esencia y del Riñón" },
    { clave: "Orificio sensorial", valor: "los oídos y los dos orificios inferiores" },
    { clave: "Líquido corporal", valor: "la saliva densa" },
    { clave: "Emoción", valor: "el miedo y el terror; en equilibrio, sabiduría y voluntad" },
    { clave: "Color", valor: "negro, o azul muy oscuro, visible bajo los ojos" },
    { clave: "Sabor", valor: "salado" },
    { clave: "Estación", valor: "invierno" },
    { clave: "Voz", valor: "el susurro" },
    { clave: "Movimiento", valor: "almacenar y descender hacia abajo" },
  ],
  funciones: [
    {
      titulo: "Almacena la Esencia (Jing)",
      texto:
        "El Riñón recibe, guarda y protege la Esencia. La forman dos componentes: la Esencia prenatal, heredada de los padres y base del desarrollo embrionario, y la Esencia postnatal, obtenida tras el nacimiento de los alimentos, el agua y la energía refinada por las vísceras.",
    },
    {
      titulo: "Gobierna el crecimiento, el desarrollo y la reproducción",
      texto:
        "La Esencia del Riñón es el motor de todas las etapas de la vida: el crecimiento, el desarrollo, la maduración, la fertilidad, la reproducción y el proceso natural de envejecimiento.",
    },
    {
      titulo: "Gobierna el metabolismo del agua",
      texto:
        "El Qi del Riñón participa en todo el metabolismo hídrico, impulsando y coordinando el trabajo de los órganos implicados en la regulación de los líquidos corporales.",
    },
    {
      titulo: "Recibe el Qi",
      texto:
        "Aunque el Pulmón controla la respiración, el Riñón recibe el Qi puro inhalado y lo mantiene en profundidad, permitiendo una respiración profunda, uniforme y suave. Cuando no lo recibe bien, la respiración se vuelve superficial.",
    },
    {
      titulo: "Gobierna los huesos y la médula",
      texto:
        "Proporciona la base para la fortaleza del sistema óseo y la producción de médula. Abre su orificio en los oídos, por lo que la audición refleja la fortaleza del Riñón y de la Esencia.",
    },
  ],
  equilibrio: [
    "Un Agua en equilibrio aporta quietud interior, una voluntad fuerte y una profunda estabilidad. La persona dispone de reservas de energía sólidas, con capacidad de recuperación y calma bajo presión.",
    "Suele desarrollar una marcada intuición y confianza para afrontar los desafíos de la vida.",
  ],
  exceso: [
    "Cuando el Agua está en exceso, el miedo puede llegar a ser paralizante, favoreciendo la evitación, el aislamiento y la dificultad para avanzar. Es frecuente la retención de líquidos, la hinchazón, el frío crónico y una preocupación constante por la supervivencia.",
    "También puede existir una gran desconfianza, resistencia al cambio y necesidad de controlar el entorno.",
  ],
  deficiencia: [
    "Cuando el Agua está deficiente, las reservas de energía se agotan: libido baja, envejecimiento precoz, caída del cabello, debilidad en la zona lumbar y las rodillas, y un agotamiento profundo que no mejora con el descanso.",
    "A nivel emocional son frecuentes la ansiedad, la inseguridad, la hipervigilancia y la sensación de vivir siempre al límite, con riesgo de burnout y debilitamiento de los huesos.",
  ],
  cierre: "El Agua representa nuestras raíces y la Esencia (Jing). Cuando estas reservas se agotan, todo el organismo pierde su capacidad de sostenerse, igual que un árbol se seca cuando sus raíces dejan de nutrirlo.",
  equilibrar: [
    "El sabor salado, asociado al color negro, ablanda las masas duras. Debe consumirse con moderación: el exceso de sal termina debilitando precisamente al Riñón.",
    "El Agua es la gran reserva energética: un descanso profundo, respetar los ritmos de recuperación y evitar el agotamiento crónico preservan la Esencia (Jing).",
    "Los huesos, los oídos y el cabello son indicadores del estado del Agua y del Riñón.",
    "El miedo es su emoción: intenso o prolongado, consume el Qi del Riñón; afrontarlo con serenidad y cultivar seguridad interior protege su energía.",
  ],
  desequilibrio: [
    "Un sabor salado en la boca suele indicar deficiencia del Riñón: con el Yang debilitado, el agua fría asciende hacia la boca.",
    "Si el Riñón falla en recibir el Qi, la respiración pierde profundidad, uniformidad y estabilidad.",
    "Si no regula el metabolismo hídrico: retención de líquidos, problemas urinarios y alteraciones de la Vejiga y los orificios inferiores.",
    "El desequilibrio del Agua se manifiesta en debilidad ósea, problemas de audición y cabello frágil. Un tinte oscuro alrededor de los ojos puede indicar alteración del Riñón.",
  ],
  guia: {
    nutricion: [
      "Alimentos negros o azulados: frijol negro, algas y arándanos",
      "Ricos en minerales: sésamo y nueces",
      "Caldo de huesos",
      "Especias calientes: clavo y ajo",
      "Pescado y marisco",
    ],
    evitar: [
      "El exceso de sal",
      "Ambientes que generen miedo o estrés continuado",
      "El exceso de trabajo, la deshidratación y el agotamiento de reservas",
      "El exceso de crudos o fríos, sobre todo en invierno, y el abuso de cafeína",
    ],
    estiloDeVida: [
      "Descansar profundamente durante el invierno, respetando su ritmo",
      "Practicar el silencio, la meditación o la calma interior",
      "Priorizar el esfuerzo constante frente a los grandes impulsos, preservando las reservas",
    ],
    descanso: "Acostarse temprano durante el invierno, favoreciendo la conservación de la Esencia (Jing).",
    ejercicio: ["Tai Chi", "Entrenamiento de fuerza lento y consciente"],
    terapia: ["Relaciones que fomenten la confianza y la seguridad", "Integración del trauma y trabajo del mundo interno"],
    afirmacion: "La sabiduría nace de la quietud.",
  },
};

export const CONTENIDO_ELEMENTOS: Record<Elemento, ContenidoElementoRico> = {
  madera, fuego, tierra, metal, agua,
};

// Fotos artísticas de cada elemento (/public/recorrido/tcm/fondos). Se usan como
// fondo de las viñetas del cómic de cada elemento. Madera = verde.png.
export const FOTO_ELEMENTO: Record<Elemento, string> = {
  madera: "/recorrido/tcm/fondos/verde.png",
  fuego: "/recorrido/tcm/fondos/fuego.png",
  tierra: "/recorrido/tcm/fondos/tierra.png",
  metal: "/recorrido/tcm/fondos/metal.png",
  agua: "/recorrido/tcm/fondos/agua.png",
};

// Iconos circulares de cada elemento (/public/recorrido/tcm/icons). Van dentro de
// los círculos del radar (MetodoTcmMapa) y de la estrella (MetodoTcmElementos).
export const ICONO_ELEMENTO: Record<Elemento, string> = {
  madera: "/recorrido/tcm/icons/madera.png",
  fuego: "/recorrido/tcm/icons/fuego.png",
  tierra: "/recorrido/tcm/icons/tierra.png",
  metal: "/recorrido/tcm/icons/metal.png",
  agua: "/recorrido/tcm/icons/agua.png",
};

// Ilustración de cada elemento (mismas que el modal de Ilustraciones). Se muestra
// junto al texto en cada momento del recorrido, como ancla visual del elemento.
export const IMAGEN_ELEMENTO: Record<Elemento, string> = {
  madera: "/viñetas/tcm/elementos/madera.png",
  fuego: "/viñetas/tcm/elementos/fuegotcm.png",
  tierra: "/viñetas/tcm/elementos/tierratcm.png",
  metal: "/viñetas/tcm/elementos/metaltcm.png",
  agua: "/viñetas/tcm/elementos/aguatcm.png",
};

export const tieneContenido = (el: Elemento): boolean => !!CONTENIDO_ELEMENTOS[el];

// ─────────────────────────────────────────────────────────────────────────
// CÓMIC de cada elemento (se abre al pinchar el elemento en la estrella).
//
// Es una secuencia de PASOS. La mayoría son viñetas (foto + texto), pero uno
// —a mitad del recorrido del elemento— es un mini-TEST: sus preguntas viven en
// ELEMENTOS[el].miniTest (tcmRecorrido.ts) y su resultado se SUMA a la
// puntuación agregada del recorrido (puntuaciones()), acercándonos al perfil
// final. No se puede pasar del paso de test sin responderlo.
//
// El objetivo del recorrido es reconocer los DESEQUILIBRIOS de cada elemento:
// por eso el arco es intro → exceso → deficiencia → test → cómo reequilibrar.
// ─────────────────────────────────────────────────────────────────────────
export interface PasoVineta { tipo: "vineta"; src: string; paragraphs: string[]; }
/** Paso de test. `testKey` indica QUÉ test de balance pinta (cada elemento tiene
 *  2 → 2 pasos de test). En los cómics se deja un ÚNICO marcador de test
 *  (sin testKey); `expandirTests` lo sustituye por un paso por cada test del
 *  elemento. `intro` es texto legacy (mini-test antiguo, aún sin migrar). */
export interface PasoTest { tipo: "test"; src: string; intro?: string[]; testKey?: string; }
export type PasoComic = PasoVineta | PasoTest;

// Fotos del cómic de Madera (/public/recorrido/tcm/madera): 1 intro/qué rige,
// 2 exceso, 3 deficiencia, 4 reequilibrar (nutrición + estilo de vida).
const FOTOS_MADERA = {
  intro: "/recorrido/tcm/madera/madera1.png",
  exceso: "/recorrido/tcm/madera/madera2.png",
  deficiencia: "/recorrido/tcm/madera/madera3.png",
  reequilibrar: "/recorrido/tcm/madera/madera4.png",
};

// Madera · viñetas con el texto del curso (voz de María).
const comicMadera: PasoComic[] = [
  {
    tipo: "vineta",
    src: FOTOS_MADERA.intro,
    paragraphs: [
      "La Madera representa el crecimiento, el ascenso, la dispersión y la fluidez. Es la energía de la primavera: todo lo que brota, se expande y busca moverse con libertad pertenece a la Madera.",
      "Rige el hígado, la vesícula biliar, los ojos y los tendones.",
    ],
  },
  {
    tipo: "vineta",
    src: FOTOS_MADERA.exceso,
    paragraphs: [
      "Cuando la Madera está en exceso, la energía asciende de forma descontrolada. Puede manifestarse como arrebatos de ira, rabia, impaciencia e irritabilidad, acompañados de una constante sensación de bloqueo o de prisa.",
      "Es frecuente encontrar tensión muscular en el cuello, la mandíbula y los hombros, así como ojos rojos o inyectados y dolores de cabeza ascendentes.",
    ],
  },
  {
    tipo: "vineta",
    src: FOTOS_MADERA.deficiencia,
    paragraphs: [
      "Cuando la Madera está deficiente, falta el impulso necesario para avanzar. Puede aparecer falta de iniciativa, dificultad para encontrar una dirección clara o para tomar decisiones. La persona se desanima con facilidad, teme actuar y puede mostrar baja motivación, timidez e indecisión.",
      "A nivel físico pueden aparecer ojos cansados, visión borrosa, tendones débiles, calambres o temblores.",
    ],
  },
  {
    // El paso de test se muestra sin foto: solo el box del test (título +
    // preguntas + botón Guardar). El texto de intro se convirtió en preguntas
    // del mini-test (ver madera-estancamiento y madera-flujo en tcmRecorrido).
    tipo: "test",
    src: FOTOS_MADERA.deficiencia,
    intro: [],
  },
  {
    tipo: "vineta",
    src: FOTOS_MADERA.reequilibrar,
    paragraphs: [
      "Para reequilibrar la Madera, favorece alimentos que apoyen el Hígado y el libre flujo del Qi:",
      "Verduras amargas como diente de león, rúcula o kale; alimentos ácidos como limón, vinagre o encurtidos; hierbas frescas como menta, albahaca y perejil; germinados y té verde.",
    ],
  },
  {
    tipo: "vineta",
    src: FOTOS_MADERA.reequilibrar,
    paragraphs: [
      "La Madera necesita movimiento, dirección y expresión: muévete por la mañana (estiramientos, Qi Gong o artes marciales), da forma a tu creatividad planificando o escribiendo nuevos proyectos y practica límites sanos para no acumular frustración.",
      "Descansa alrededor de las 22:30, cuando su energía empieza a relajarse, y elige un ejercicio dinámico pero no agresivo, de movimiento continuo y flexible, como el crecer de la primavera.",
    ],
  },
];

// Fotos del cómic de Fuego (/public/recorrido/tcm/fuego).
const FOTOS_FUEGO = {
  intro: "/recorrido/tcm/fuego/fuego1.png",
  exceso: "/recorrido/tcm/fuego/fuego2.png",
  deficiencia: "/recorrido/tcm/fuego/fuego3.png",
  nutricion: "/recorrido/tcm/fuego/fuego4.png",
  estilo: "/recorrido/tcm/fuego/fuego5.png",
};

// Fuego · viñetas con el texto del curso (voz de María).
const comicFuego: PasoComic[] = [
  {
    tipo: "vineta",
    src: FOTOS_FUEGO.intro,
    paragraphs: [
      "El Fuego representa el calor, lo ardiente y el ascenso. En el cuerpo, el Fuego es la fuerza que calienta, impulsa y enciende la conciencia, favoreciendo la vitalidad, la comunicación y la presencia. Rige el Corazón, el intestino delgado y la tez.",
      "Un Fuego en equilibrio es cálido, expresivo y carismático. La persona se relaciona con los demás desde la autenticidad, disfrutando de una comunicación y una intimidad sanas. A nivel físico suele manifestarse con un buen descanso, un ritmo cardíaco estable y una sensación general de vitalidad y presencia.",
    ],
  },
  {
    tipo: "vineta",
    src: FOTOS_FUEGO.exceso,
    paragraphs: [
      "Cuando el Fuego está en exceso, la energía asciende de forma descontrolada. Puede manifestarse como inquietud, ansiedad, pánico o insomnio. Es frecuente hablar en exceso, reír de forma nerviosa o mostrar una necesidad constante de estimulación y contacto social.",
      "También pueden aparecer palpitaciones, sensación de calor en el pecho o en la cara, sobreapego, celos y reacciones emocionales intensas o dramáticas, con tendencia a la sobre-socialización.",
    ],
  },
  {
    tipo: "vineta",
    src: FOTOS_FUEGO.deficiencia,
    paragraphs: [
      "Cuando el Fuego está deficiente, disminuye la capacidad de conectar con uno mismo y con los demás. Puede aparecer un aplanamiento emocional, dificultad para expresar afecto o establecer vínculos profundos, así como una sensación de soledad o de no ser comprendido.",
      "A nivel físico son frecuentes las manos y pies fríos, la fatiga en la zona del corazón, los olvidos, la falta de entusiasmo, una voz baja y la tendencia a evitar la interacción social.",
    ],
  },
  {
    // Test sin foto: solo el box del test (título + preguntas + Guardar).
    tipo: "test",
    src: FOTOS_FUEGO.deficiencia,
    intro: [],
  },
  {
    // La foto de esta viñeta es la MISMA que la de la última (estilo/fuego5).
    tipo: "vineta",
    src: FOTOS_FUEGO.estilo,
    paragraphs: [
      "Para reequilibrar el Fuego, favorece alimentos hidratantes como pepino, sandía y lechuga; alimentos amargos como lechuga romana, cacao y quinoa.",
      "Frutos rojos como cerezas y bayas de espino blanco; e infusiones refrescantes de crisantemo e hibisco.",
    ],
  },
  {
    tipo: "vineta",
    src: FOTOS_FUEGO.estilo,
    paragraphs: [
      "El Fuego necesita conexión, alegría y una mente tranquila. Descansa antes de las 23:00 y elige un ejercicio que combine movimiento y disfrute.",
      "El Fuego se revela en la forma en que nos relacionamos, expresamos lo que sentimos y compartimos nuestra presencia con los demás.",
    ],
  },
];

// Fotos del cómic de Metal (/public/recorrido/tcm/metal): 4 fotos; la 4ª se
// reutiliza en las dos viñetas de reequilibrar.
const FOTOS_METAL = {
  intro: "/recorrido/tcm/metal/metal1.png",
  exceso: "/recorrido/tcm/metal/metal2.png",
  deficiencia: "/recorrido/tcm/metal/metal3.png",
  reequilibrar: "/recorrido/tcm/metal/metal4.png",
};

// Metal · viñetas con el texto del curso (voz de María).
const comicMetal: PasoComic[] = [
  {
    tipo: "vineta",
    src: FOTOS_METAL.intro,
    paragraphs: [
      "El Metal representa la capacidad de purificar, descender y astringir. En el cuerpo, el Metal gobierna el intercambio con el exterior: gracias a él respiramos, filtramos y dejamos ir, tanto a nivel físico como emocional. Rige el pulmón, el intestino grueso, la piel y la nariz.",
      "Un Metal en equilibrio es disciplinado, organizado y posee una gran claridad moral. La persona sabe establecer límites sanos, ordenar su vida y soltar aquello que ya ha cumplido su función.",
    ],
  },
  {
    tipo: "vineta",
    src: FOTOS_METAL.exceso,
    paragraphs: [
      "Cuando el Metal está en exceso, la necesidad de orden puede convertirse en perfeccionismo, rigidez y una actitud excesivamente crítica hacia uno mismo y hacia los demás. Es frecuente desarrollar hábitos muy rígidos.",
    ],
  },
  {
    tipo: "vineta",
    src: FOTOS_METAL.deficiencia,
    paragraphs: [
      "Cuando el Metal está deficiente, aparece una profunda tristeza y dificultad para dejar ir personas, situaciones o experiencias del pasado. Puede manifestarse con un sistema inmunitario debilitado, respiración superficial, falta de orden y sensación de desorganización en la vida cotidiana.",
    ],
  },
  {
    // Test sin foto: solo el box del test (título + preguntas + Guardar).
    tipo: "test",
    src: FOTOS_METAL.deficiencia,
    intro: [],
  },
  {
    tipo: "vineta",
    src: FOTOS_METAL.reequilibrar,
    paragraphs: [
      "Para reequilibrar el Metal, favorece alimentos blancos como daikon, ajo y cebolla; rábanos, peras y manzanas; alimentos que humedecen el Pulmón como la miel o el congee de arroz; setas y algas; e infusiones tibias de jengibre o regaliz.",
    ],
  },
  {
    tipo: "vineta",
    src: FOTOS_METAL.reequilibrar,
    paragraphs: [
      "El Metal necesita respirar, ordenar y soltar. Practica ejercicios de respiración y Qi Gong para fortalecer y expandir el Pulmón, y crea rituales que aporten significado y faciliten el cierre de etapas.",
      "Descansa en una habitación profundamente oscura y silenciosa, favoreciendo un descanso reparador y una respiración tranquila, y elige actividades que mejoren la postura, la respiración y la capacidad pulmonar. Aprender a soltar personas, experiencias y etapas de forma saludable protege el Qi del Pulmón y permite que la energía siga fluyendo.",
    ],
  },
];

// Fotos del cómic de Agua (/public/recorrido/tcm/agua).
const FOTOS_AGUA = {
  intro: "/recorrido/tcm/agua/agua1.png",
  exceso: "/recorrido/tcm/agua/agua2.png",
  deficiencia: "/recorrido/tcm/agua/agua3.png",
  nutricion: "/recorrido/tcm/agua/agua4.png",
  estilo: "/recorrido/tcm/agua/agua5.png",
};

// Agua · viñetas con el texto del curso (voz de María).
const comicAgua: PasoComic[] = [
  {
    tipo: "vineta",
    src: FOTOS_AGUA.intro,
    paragraphs: [
      "El Agua representa la capacidad de humedecer, descender, enfriar y almacenar. Representa la esencia, la herencia y la base sobre la que se desarrolla todo crecimiento físico, mental y espiritual. Rige el riñón (donde se almacena la Esencia), la vejiga, los huesos y el cabello.",
      "Un Agua en equilibrio aporta quietud interior, una voluntad fuerte y una profunda sensación de estabilidad.",
    ],
  },
  {
    tipo: "vineta",
    src: FOTOS_AGUA.exceso,
    paragraphs: [
      "Cuando el Agua está en exceso, el miedo puede llegar a ser paralizante, favoreciendo la evitación, el aislamiento y la dificultad para avanzar. Es frecuente la aparición de retención de líquidos, hinchazón, sensación de frío crónico y una preocupación constante.",
    ],
  },
  {
    tipo: "vineta",
    src: FOTOS_AGUA.deficiencia,
    paragraphs: [
      "Cuando el Agua está deficiente, las reservas de energía comienzan a agotarse. Puede manifestarse como envejecimiento precoz, caída del cabello, debilidad en la zona lumbar y las rodillas, así como una profunda sensación de agotamiento que no mejora completamente con el descanso.",
    ],
  },
  {
    // Test sin foto: solo el box del test (título + preguntas + Guardar).
    tipo: "test",
    src: FOTOS_AGUA.deficiencia,
    intro: [],
  },
  {
    tipo: "vineta",
    src: FOTOS_AGUA.nutricion,
    paragraphs: [
      "Para nutrir el Agua, favorece alimentos negros o azulados como frijol negro, algas y arándanos; alimentos ricos en minerales como el sésamo y las nueces; caldo de huesos; especias calientes como el clavo y el ajo; y pescado y marisco.",
      "Para protegerla, evita el exceso de sal, los ambientes que generen miedo o estrés continuado, el exceso de trabajo, la deshidratación y el agotamiento de las reservas, el exceso de crudos o fríos —sobre todo en invierno— y el abuso de cafeína, que agota el Qi del Riñón.",
    ],
  },
  {
    tipo: "vineta",
    src: FOTOS_AGUA.estilo,
    paragraphs: [
      "El Agua necesita descanso, silencio y una adecuada conservación de la energía. Practica el silencio, la meditación o cualquier actividad que favorezca la calma interior, y prioriza el esfuerzo constante frente a los grandes impulsos de voluntad.",
      "Acuéstate temprano durante el invierno, favoreciendo la conservación de la Esencia (Jing), y elige actividades que fortalezcan el cuerpo sin agotar las reservas.",
    ],
  },
];

// Fotos del cómic de Tierra (/public/recorrido/tcm/tierra): 4 fotos.
const FOTOS_TIERRA = {
  intro: "/recorrido/tcm/tierra/tierra1.png",
  exceso: "/recorrido/tcm/tierra/tierra2.png",
  deficiencia: "/recorrido/tcm/tierra/tierra3.png",
  reequilibrar: "/recorrido/tcm/tierra/tierra4.png",
};

// Elementos que aún se arman desde su contenido rico (mismo arco narrativo).
// Los arrays de texto se pasan como párrafos (con saltos de línea) y el test va
// sin foto ni intro (solo el box del test).
const comicDesdeRico = (
  c: ContenidoElementoRico,
  fotos: { intro: string; exceso: string; deficiencia: string; reequilibrar: string },
): PasoComic[] => {
  const guiaTxt = [
    `Para reequilibrar, en la mesa: ${c.guia.nutricion.join("; ")}.`,
    `En tu día a día: ${c.guia.estiloDeVida.join("; ")}. Descanso: ${c.guia.descanso} Ejercicio: ${c.guia.ejercicio.join(", ")}.`,
  ];
  return [
    { tipo: "vineta", src: fotos.intro, paragraphs: c.intro },
    { tipo: "vineta", src: fotos.exceso, paragraphs: c.exceso },
    { tipo: "vineta", src: fotos.deficiencia, paragraphs: c.deficiencia },
    { tipo: "test", src: fotos.deficiencia, intro: [] },
    { tipo: "vineta", src: fotos.reequilibrar, paragraphs: guiaTxt },
  ];
};

// Coloca los 2 tests de balance del elemento AL PRINCIPIO del cómic (antes del
// contenido educativo). Es deliberado: si el usuario leyera antes las
// descripciones de exceso/deficiencia, se autoetiquetaría y respondería sesgado.
// Respondiendo primero, la autoevaluación es más espontánea y el perfil, más
// fiable. Luego llega el aprendizaje (intro → exceso → deficiencia → reequilibrar).
// Si el elemento aún no tiene tests nuevos, deja el marcador legacy en su sitio.
const expandirTests = (el: Elemento, pasos: PasoComic[]): PasoComic[] => {
  const tests = testsDeElemento(el);
  if (tests.length === 0) return pasos;
  const sinTest = pasos.filter((p) => p.tipo !== "test");
  const src = pasos.find((p) => p.tipo === "test")?.src ?? sinTest[0]?.src ?? "";
  const testPasos = tests.map((t) => ({ tipo: "test", src, testKey: t.key }) as PasoComic);
  return [...testPasos, ...sinTest];
};

export const COMIC_ELEMENTO: Record<Elemento, PasoComic[]> = {
  madera: expandirTests("madera", comicMadera),
  fuego: expandirTests("fuego", comicFuego),
  tierra: expandirTests("tierra", comicDesdeRico(tierra, FOTOS_TIERRA)),
  metal: expandirTests("metal", comicMetal),
  agua: expandirTests("agua", comicAgua),
};
