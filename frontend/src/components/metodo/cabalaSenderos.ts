import type { SefiraKey } from "../global/ArbolDeLaVida";

// ─────────────────────────────────────────────────────────────────────────
// Los 22 SENDEROS del Árbol de la Vida (letras hebreas Aleph→Tav = caminos
// 11-32). Cada uno es una página con la MISMA plantilla:
//   cabecera · pregunta de reflexión · ¿qué une? · test (1-5, algunas invertidas)
//   · interpretación por bandas · señales de práctica · «has cruzado este
//     umbral cuando…» · frase de integración.
// Cada sendero tiene además una PALABRA CLAVE fácil de recordar.
//
// Los 22 están redactados (Aleph→Tav) en su versión definitiva.
// ─────────────────────────────────────────────────────────────────────────

// Nombres de las sefirot en castellano (los usa la cabecera "Keter → Chokhmah").
export const NOMBRE_SEFIRA: Record<SefiraKey, string> = {
  kether: "Keter",
  chokmah: "Chokhmah",
  binah: "Binah",
  chesed: "Chesed",
  geburah: "Gevurah",
  tipharet: "Tiferet",
  netzach: "Netzach",
  hod: "Hod",
  yesod: "Yesod",
  malkuth: "Malkhut",
};

export interface SenderoTestPregunta {
  texto: string;
  /** Si true, puntúa invertido (6 - respuesta). */
  invertida?: boolean;
}

export interface SenderoInterpretacion {
  min: number;
  max: number;
  titulo: string;
  texto: string;
}

export interface SenderoContenido {
  num: number;          // 11-32 (numeración cabalística del sendero)
  orden: number;        // 1-22
  letra: string;        // "Aleph"
  hebreo: string;       // "א"
  palabraClave: string; // "Apertura" (opcional, decorativo)
  titulo: string;       // Nombre moderno: "Del Propósito a la Claridad"
  from: SefiraKey;
  to: SefiraKey;
  /** Significado tradicional (Sefer Yetzirah, Zóhar, Cordovero, Luria). SIN Tarot ni astrología. */
  significadoTradicional: string;
  /** Traducción psicológica al lenguaje del desarrollo personal. */
  traduccionPsicologica: string;
  /** Pregunta de reflexión (cabecera). */
  pregunta: string;
  /** Párrafos de "¿Qué une este sendero?". */
  une: string[];
  /** Título del test (p.ej. "¿Cómo reaccionas cuando la realidad desafía tus ideas?"). */
  testTitulo: string;
  test: SenderoTestPregunta[];        // 5 preguntas
  interpretaciones: SenderoInterpretacion[]; // bandas
  senales: string[];                  // señales de práctica
  /** Frase-umbral: "Has cruzado este umbral cuando…". Opcional. */
  umbral?: string;
  integracion: string;                // frase de integración
  /** Brief para la ilustración del cómic (guía interna, no se muestra al usuario). */
  ilustracion: string;
}

export const SENDERO_TEST_NUM = 5;

const ALEPH: SenderoContenido = {
  num: 11,
  orden: 1,
  letra: "Aleph",
  hebreo: "א",
  palabraClave: "Apertura",
  titulo: "Del Propósito a la Claridad",
  from: "kether",
  to: "chokmah",
  significadoTradicional:
    "Aleph (א) es la primera letra del alfabeto hebreo y simboliza el aliento primordial, el Aire y el origen de todo movimiento. En el Sefer Yetzirah representa la energía que precede a toda creación: aquello que aún no tiene forma, pero contiene todas las posibilidades.\n\nEn el Árbol de la Vida une Keter, la voluntad o propósito más elevado, con Chokhmah, el primer destello de sabiduría. Es el momento en que una intención comienza a hacerse consciente.",
  traduccionPsicologica:
    "Toda transformación comienza con una intención, pero un propósito solo cobra verdadero valor cuando cambia nuestra forma de mirar la realidad.\n\nEste sendero representa la capacidad de dejar que la experiencia refine nuestras ideas. Nos invita a sustituir la necesidad de tener razón por el deseo de comprender. La claridad no nace de defender nuestras creencias, sino de permitir que la realidad dialogue con ellas.",
  pregunta: "¿Soy capaz de dejar que la realidad transforme mis ideales?",
  une: [
    "Tener un propósito es importante, pero también puede convertirse en una limitación si interpretamos todo desde nuestras expectativas. Cuando creemos que ya conocemos la respuesta, dejamos de observar con verdadera apertura.",
    "Este sendero representa el paso del ideal a la percepción consciente. Nos enseña que cambiar una idea cuando aparece una verdad mayor no significa perder el rumbo, sino permitir que nuestro propósito evolucione.",
  ],
  testTitulo: "¿Cómo reaccionas cuando la realidad desafía tus ideas?",
  test: [
    { texto: "Cuando la realidad contradice mis planes, me cuesta aceptarlo." },
    { texto: "Suelo interpretar los acontecimientos de forma que confirmen lo que ya pensaba." },
    { texto: "Cuando descubro información nueva, reviso mis ideas antes de seguir adelante.", invertida: true },
    { texto: "Me cuesta abandonar una convicción importante aunque aparezcan evidencias que la cuestionan." },
    { texto: "Cambiar de opinión cuando aprendo algo nuevo me parece una muestra de crecimiento.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Eres capaz de revisar tus ideas sin sentir que pierdes tu identidad. Permites que la realidad enriquezca tu propósito." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones tus expectativas condicionan la forma en que interpretas los hechos. Existe margen para desarrollar una mirada más abierta." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Tiendes a proteger tus ideas antes que revisarlas. El crecimiento comienza cuando permites que la realidad participe en la construcción de tu propósito." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales desafíos consiste en dejar de buscar confirmación y empezar a buscar comprensión. La realidad no viene a destruir tu propósito, sino a hacerlo más auténtico." },
  ],
  senales: [
    "Buscas confirmar tus ideas antes de comprender las de los demás.",
    "Te frustras cuando la realidad no coincide con tus expectativas.",
    "Eres capaz de cambiar de opinión sin sentir que has fracasado.",
  ],
  umbral: "Puedes modificar una idea importante sin sentir que estás perdiendo quién eres.",
  integracion: "La realidad no está aquí para confirmar mis ideas; está aquí para ayudarme a refinarlas.",
  ilustracion:
    "Una persona sostiene una brújula mientras observa un paisaje que cambia frente a sus ojos. El camino dibujado en el mapa no coincide exactamente con el terreno, pero nuevas sendas aparecen iluminadas, invitándola a adaptar su rumbo sin perder el norte.",
};

const BETH: SenderoContenido = {
  num: 12,
  orden: 2,
  letra: "Beth",
  hebreo: "ב",
  palabraClave: "Comprensión",
  titulo: "Del Propósito a la Comprensión",
  from: "kether",
  to: "binah",
  significadoTradicional:
    "Beth (ב), la segunda letra del alfabeto hebreo, significa «casa». En la tradición cabalística representa el principio de contención, estructura y receptividad. Si Aleph es el impulso inicial, Beth es el espacio donde ese impulso puede desarrollarse y adquirir forma.\n\nAl conectar Keter con Binah, este sendero simboliza el paso desde la voluntad primordial hacia la comprensión estructurada. Nos recuerda que una intención solo puede crecer cuando encuentra un marco que le permita organizarse, desarrollarse y convertirse en conocimiento.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de transformar un propósito en una comprensión profunda de uno mismo y de la realidad. Tener un ideal no basta; es necesario detenerse, reflexionar y construir una visión que dé sentido a nuestras experiencias.\n\nNos invita a desarrollar una mente capaz de aprender antes de actuar, comprendiendo que las grandes decisiones necesitan tanto inspiración como reflexión.",
  pregunta: "¿Te das el tiempo necesario para comprender antes de actuar?",
  une: [
    "Todo propósito necesita una estructura que lo sostenga. Sin reflexión, las buenas intenciones pueden convertirse en impulsos pasajeros o decisiones precipitadas.",
    "Este sendero representa el paso de la inspiración a la comprensión. Nos enseña que crecer no consiste solo en saber hacia dónde queremos ir, sino en construir una base sólida que permita avanzar con mayor conciencia y profundidad.",
  ],
  testTitulo: "¿Cómo transformas tus ideales en comprensión?",
  test: [
    { texto: "Suelo actuar antes de comprender completamente una situación." },
    { texto: "Me cuesta dedicar tiempo a reflexionar sobre mis experiencias." },
    { texto: "Antes de tomar decisiones importantes procuro comprender todos los aspectos relevantes.", invertida: true },
    { texto: "Me impaciento cuando un proceso requiere tiempo para entenderse." },
    { texto: "Disfruto reflexionando y aprendiendo antes de sacar conclusiones.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Sabes convertir tus ideales en una comprensión sólida antes de actuar. Tu propósito se apoya en la reflexión y no solo en el impulso." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones avanzas demasiado rápido sin dedicar suficiente tiempo a comprender lo que estás viviendo." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una tendencia a actuar desde la intención sin construir una comprensión profunda. Tu aprendizaje consiste en desarrollar mayor paciencia para integrar las experiencias." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es detenerte antes de avanzar. La comprensión no retrasa el camino; le da profundidad y dirección." },
  ],
  senales: [
    "Tomas decisiones importantes sin haber reflexionado lo suficiente.",
    "Confundes rapidez con claridad.",
    "Dedicas tiempo a comprender una experiencia antes de reaccionar ante ella.",
  ],
  integracion: "Toda transformación profunda necesita un espacio donde comprender antes de actuar.",
  ilustracion:
    "Una persona entra en una casa luminosa después de caminar por un sendero. En el interior hay una mesa con un cuaderno abierto, una lámpara y una ventana desde la que se observa el paisaje. La sensación es de pausa, reflexión y construcción interior.",
};

const GIMEL: SenderoContenido = {
  num: 13,
  orden: 3,
  letra: "Gimel",
  hebreo: "ג",
  palabraClave: "Integración",
  titulo: "Del Propósito a la Autenticidad",
  from: "kether",
  to: "tipharet",
  significadoTradicional:
    "Gimel significa \"camello\", el animal que atraviesa el desierto llevando provisiones entre dos lugares distantes. En la tradición cabalística simboliza el movimiento, el sustento y la capacidad de transportar aquello que es esencial hasta donde realmente hace falta. Al unir Keter con Tiferet, este sendero representa el descenso de la voluntad superior hasta el corazón. No basta con tener un propósito elevado; ese propósito debe alimentar la Vida interior para convertirse en una fuerza transformadora. Gimel enseña que el verdadero propósito no permanece en el mundo de las ideas: llega al corazón y se convierte en una forma de vivir.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de hacer que nuestros valores más profundos dejen de ser ideales abstractos y se conviertan en una parte auténtica de nuestra identidad. Muchas personas saben qué consideran importante, pero viven desconectadas de ello. Este sendero invita a cerrar esa distancia, permitiendo que el propósito no solo guíe nuestras decisiones, sino también nuestra forma de sentir, relacionarnos y estar presentes.",
  pregunta: "¿Tu propósito vive solo en tu mente o también en tu corazón?",
  une: [
    "Tener un propósito no garantiza vivir de acuerdo con él. Con frecuencia sabemos qué queremos ser, pero nuestras emociones, nuestros miedos o nuestras heridas nos alejan de esa dirección.",
    "Este sendero representa el momento en que el propósito deja de ser una idea inspiradora y empieza a convertirse en una identidad vivida. El verdadero cambio ocurre cuando aquello que creemos importante también transforma la forma en que sentimos y nos relacionamos con el mundo.",
  ],
  testTitulo: "¿Hasta qué punto tu propósito forma parte de quién eres?",
  test: [
    { texto: "Con frecuencia siento que mis acciones no reflejan lo que considero importante." },
    { texto: "Me resulta difícil conectar emocionalmente con el propósito que quiero vivir." },
    { texto: "Mis decisiones suelen estar alineadas con los valores que considero esenciales.", invertida: true },
    { texto: "Cuando aparecen dificultades, olvido fácilmente aquello que da sentido a mi Vida." },
    { texto: "Siento que mi propósito forma parte de mi identidad y guía mi manera de vivir.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Tu propósito no solo orienta tus decisiones; también forma parte de la persona que eres. Existe una conexión saludable entre tus valores y tu Vida emocional." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "Sabes qué es importante para ti, pero no siempre consigues mantener esa conexión cuando aparecen las dificultades o las emociones intensas." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una distancia entre tus ideales y la forma en que vives. Tu crecimiento consiste en acercar cada vez más tu propósito a tu identidad cotidiana." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales desafíos es dejar de vivir el propósito como una meta futura y comenzar a experimentarlo como una forma presente de ser." },
  ],
  senales: [
    "Tus decisiones reflejan realmente los valores que dices tener.",
    "Recuerdas tu propósito cuando aparecen emociones difíciles.",
    "Actúas buscando ser coherente contigo mismo más que cumplir expectativas externas.",
  ],
  integracion: "Mi propósito deja de ser una meta cuando se convierte en la forma en que elijo vivir cada día.",
  ilustracion:
    "Un camello avanza sereno por un desierto al atardecer, cargando entre dos alforjas una pequeña luz dorada. Parte de una cumbre luminosa en lo alto (Keter) y desciende hacia un valle donde late un corazón de luz cálida (Tiferet), dejando un sendero de huellas que une la altura con el centro del pecho.",
};

const DALETH: SenderoContenido = {
  num: 14,
  orden: 4,
  letra: "Daleth",
  hebreo: "ד",
  palabraClave: "Confianza",
  titulo: "De la Claridad a la Comprensión",
  from: "chokmah",
  to: "binah",
  significadoTradicional:
    "Daleth (ד) significa \"puerta\". En la tradición cabalística representa el acceso, la apertura y el paso entre dos estados de conciencia. Toda puerta ofrece una posibilidad, pero cruzarla requiere una decisión consciente.\n\nAl conectar Chokhmah con Binah, este sendero simboliza el paso desde el destello de la sabiduría hacia una comprensión estructurada. Enseña que la intuición es solo el comienzo; necesita ser explorada, cuestionada e integrada para convertirse en verdadero conocimiento.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de transformar una percepción en comprensión. Ver algo con claridad no significa comprenderlo en profundidad.\n\nNos recuerda que crecer implica hacer una pausa, cuestionar nuestras primeras impresiones y permitir que la reflexión complete aquello que la intuición apenas ha comenzado a revelar.",
  pregunta: "¿Te detienes a comprender lo que percibes o reaccionas desde la primera impresión?",
  une: [
    "Percibir una realidad y comprenderla son procesos diferentes. La intuición puede abrir una puerta, pero solo la reflexión permite cruzarla y descubrir lo que hay al otro lado.",
    "Este sendero nos enseña a sustituir las respuestas automáticas por una comprensión más profunda. La verdadera sabiduría aparece cuando dejamos de reaccionar inmediatamente y comenzamos a explorar el significado de lo que vivimos.",
  ],
  testTitulo: "¿Cómo transformas una percepción en comprensión?",
  test: [
    { texto: "Suelo sacar conclusiones antes de comprender completamente una situación." },
    { texto: "Me cuesta escuchar perspectivas diferentes cuando ya tengo una opinión formada." },
    { texto: "Antes de decidir, procuro comprender todos los aspectos de una situación.", invertida: true },
    { texto: "Con frecuencia reacciono más rápido de lo que reflexiono." },
    { texto: "Estoy dispuesto a revisar mis conclusiones cuando aparece nueva información.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Sabes convertir tus percepciones en una comprensión más profunda. La reflexión complementa tu intuición y te ayuda a tomar decisiones conscientes." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones confías demasiado en tus primeras impresiones. Dedicar más tiempo a comprender enriquecerá tu manera de interpretar la realidad." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una tendencia a reaccionar antes de comprender. Tu crecimiento consiste en desarrollar la paciencia necesaria para explorar una situación antes de sacar conclusiones." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es atravesar la puerta de la comprensión. La intuición puede mostrar el camino, pero solo la reflexión revela su verdadero significado." },
  ],
  senales: [
    "Sacas conclusiones antes de hacer preguntas.",
    "Escuchas para comprender o para confirmar tu opinión.",
    "Cambias de perspectiva cuando descubres información nueva.",
  ],
  umbral: "Eres capaz de sustituir la reacción inmediata por una comprensión más profunda de la realidad.",
  integracion: "La intuición abre la puerta; la comprensión me invita a cruzarla.",
  ilustracion:
    "Una persona se encuentra frente a una gran puerta de madera entreabierta. A través de la abertura entra una luz cálida que ilumina un paisaje mucho más amplio que el que podía verse desde fuera. La escena transmite que cruzar la puerta requiere una decisión consciente y que al otro lado hay una comprensión más profunda de la realidad.",
};

const HE: SenderoContenido = {
  num: 15,
  orden: 5,
  letra: "He",
  hebreo: "ה",
  palabraClave: "Discernimiento",
  titulo: "De la Claridad a la Armonía",
  from: "chokmah",
  to: "tipharet",
  significadoTradicional:
    "He (ה) significa \"ventana\" o \"aliento revelado\". En la tradición cabalística simboliza la apertura a una nueva perspectiva y la capacidad de dejar entrar la luz. Representa la revelación de aquello que antes permanecía oculto.\n\nAl conectar Chokhmah con Tiferet, este sendero simboliza el paso desde la percepción clara hacia la integración en el corazón. Enseña que la verdadera sabiduría no consiste únicamente en ver con claridad, sino en permitir que esa claridad transforme nuestra manera de sentir, vivir y relacionarnos.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de dejar que una nueva comprensión cambie nuestro mundo interior. Muchas veces entendemos una verdad con la mente, pero seguimos viviendo como si nunca la hubiéramos descubierto.\n\nNos recuerda que el crecimiento ocurre cuando la claridad deja de ser una idea y comienza a influir en nuestras emociones, decisiones y relaciones.",
  pregunta: "¿Permites que aquello que descubres transforme realmente tu manera de vivir?",
  une: [
    "Comprender algo no garantiza que esa comprensión cambie nuestra Vida. Podemos descubrir una verdad importante y, aun así, continuar reaccionando desde los mismos hábitos de siempre.",
    "Este sendero representa el momento en que una nueva visión deja de ser únicamente conocimiento y empieza a convertirse en una experiencia interior. Solo cuando una verdad llega al corazón puede producir una transformación auténtica.",
  ],
  testTitulo: "¿Hasta qué punto permites que una nueva comprensión transforme tu Vida?",
  test: [
    { texto: "Comprendo mis errores, pero sigo reaccionando de la misma manera." },
    { texto: "Me resulta difícil cambiar hábitos, incluso cuando sé que ya no me benefician." },
    { texto: "Cuando aprendo algo importante, procuro aplicarlo en mi Vida.", invertida: true },
    { texto: "A menudo separo lo que pienso de lo que siento." },
    { texto: "Las experiencias importantes suelen transformar mi forma de ver y vivir la Vida.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Permites que aquello que comprendes transforme tu mundo interior. Existe una buena conexión entre tus aprendizajes y tu manera de vivir." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones comprendes una situación, pero necesitas más tiempo para integrarla emocionalmente." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una distancia entre lo que sabes y lo que realmente cambia en tu Vida. Tu crecimiento consiste en permitir que tus aprendizajes lleguen también al corazón." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es transformar el conocimiento en una experiencia interior. Comprender es el primer paso; integrar esa comprensión es lo que produce el cambio." },
  ],
  senales: [
    "Descubres algo importante, pero continúas actuando igual.",
    "Tus emociones acompañan aquello que sabes o parecen ir por un camino diferente.",
    "Das tiempo a que una experiencia te transforme antes de buscar la siguiente.",
  ],
  umbral: "Aquello que comprendes comienza a reflejarse de forma natural en tu manera de sentir, decidir y relacionarte.",
  integracion: "La verdadera comprensión transforma primero el corazón y después la Vida.",
  ilustracion:
    "Una ventana abierta en un muro deja entrar un haz de luz cálida que ilumina una habitación antes en penumbra. Junto a la ventana, una figura respira con los ojos cerrados mientras la luz le alcanza el pecho, sugiriendo que lo que se comprende con la mente desciende hasta el corazón.",
};

const VAV: SenderoContenido = {
  num: 16,
  orden: 6,
  letra: "Vav",
  hebreo: "ו",
  palabraClave: "Unión",
  titulo: "De la Claridad a la Generosidad",
  from: "chokmah",
  to: "chesed",
  significadoTradicional:
    "Vav (ו) significa \"gancho\", \"clavo\" o \"unión\". En la tradición cabalística representa aquello que conecta dos realidades y permite que permanezcan unidas. Es el símbolo del vínculo, la continuidad y la conexión entre el cielo y la tierra.\n\nAl conectar Chokhmah con Chesed, este sendero simboliza el paso desde la sabiduría hacia la expresión del amor y la generosidad. Enseña que la verdadera comprensión no permanece encerrada en la mente, sino que se manifiesta en la manera en que tratamos a los demás.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de convertir la comprensión en generosidad. No basta con entender a las personas; el siguiente paso es actuar desde esa comprensión.\n\nNos recuerda que el conocimiento alcanza su verdadero valor cuando inspira empatía, servicio y una disposición sincera a contribuir al bienestar de los demás.",
  pregunta: "¿Tu comprensión de los demás se convierte en acciones o permanece solo en tus pensamientos?",
  une: [
    "Comprender una situación o a una persona es valioso, pero esa comprensión adquiere un significado más profundo cuando influye en nuestra manera de actuar. La sabiduría encuentra su plenitud cuando genera compasión y servicio.",
    "Este sendero nos invita a construir un puente entre lo que sabemos y la forma en que nos relacionamos con el mundo. Comprender sin actuar puede convertirse en indiferencia; actuar desde la comprensión transforma nuestras relaciones.",
  ],
  testTitulo: "¿Cómo transformas tu comprensión en acciones generosas?",
  test: [
    { texto: "Aunque comprendo las dificultades de otras personas, rara vez hago algo para ayudarlas." },
    { texto: "Suelo mantener mis conocimientos o experiencias para mí en lugar de compartirlos." },
    { texto: "Cuando comprendo que alguien necesita apoyo, procuro actuar dentro de mis posibilidades.", invertida: true },
    { texto: "Con frecuencia pienso que ayudar a los demás no es mi responsabilidad." },
    { texto: "Disfruto poniendo mis capacidades al servicio de otras personas cuando puedo aportar algo valioso.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Eres capaz de transformar tu comprensión en acciones concretas. Tu conocimiento se expresa de forma natural a través de la empatía y la generosidad." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "Comprendes las necesidades de los demás, pero no siempre das el paso hacia la acción. Existe margen para expresar con mayor frecuencia aquello que ya sabes." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Tiendes a mantener la comprensión en el plano intelectual. Tu crecimiento consiste en permitir que ese conocimiento se traduzca en pequeños gestos y acciones cotidianas." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es descubrir que la verdadera sabiduría no termina en comprender; comienza cuando esa comprensión mejora la Vida de otras personas." },
  ],
  senales: [
    "Comprendes una necesidad, pero decides no actuar por comodidad o indiferencia.",
    "Compartes tus conocimientos cuando pueden ser útiles a alguien.",
    "Tus acciones reflejan la empatía que dices sentir.",
  ],
  umbral: "La comprensión deja de ser solo conocimiento y se convierte de forma natural en una manera de servir y cuidar a los demás.",
  integracion: "La sabiduría alcanza su plenitud cuando se expresa a través de la generosidad.",
  ilustracion:
    "Dos alturas de un paisaje —una cumbre luminosa y un valle fértil— quedan enlazadas por un puente firme con forma de clavo o gancho. Sobre el puente, una figura tiende la mano a otra para ayudarla a cruzar, mientras la luz de arriba fluye hacia abajo transformándose en gestos de entrega.",
};

const ZAYIN: SenderoContenido = {
  num: 17,
  orden: 7,
  letra: "Zayin",
  hebreo: "ז",
  palabraClave: "Discernimiento",
  titulo: "De la Comprensión a la Sabiduría",
  from: "binah",
  to: "tipharet",
  significadoTradicional:
    "Zayin (ז) significa \"espada\" o \"arma\". En la tradición cabalística simboliza el discernimiento, la capacidad de separar lo esencial de lo superficial y de actuar con claridad ante la realidad. No representa la violencia, sino la facultad de distinguir con precisión aquello que merece ser conservado de aquello que debe dejarse atrás.\n\nAl conectar Binah con Tiferet, este sendero representa el paso desde la comprensión intelectual hacia la sabiduría del corazón. Enseña que el conocimiento solo alcanza su plenitud cuando transforma nuestra forma de ser.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de convertir el conocimiento en sabiduría. Comprender una idea es importante, pero vivir de acuerdo con ella requiere discernimiento, coherencia y madurez.\n\nNos recuerda que la verdadera sabiduría no consiste en acumular respuestas, sino en saber cuáles merecen formar parte de nuestra Vida.",
  pregunta: "¿Lo que comprendes ha transformado realmente tu manera de vivir?",
  une: [
    "Comprender algo no garantiza que forme parte de nosotros. Muchas veces acumulamos conocimientos, consejos o experiencias que nunca llegan a cambiar nuestra forma de actuar.",
    "Este sendero representa el momento en que el conocimiento deja de ser información y comienza a convertirse en sabiduría. Solo aquello que transforma nuestras decisiones puede considerarse verdaderamente aprendido.",
  ],
  testTitulo: "¿Cómo transformas el conocimiento en sabiduría?",
  test: [
    { texto: "Con frecuencia sé cuál sería la mejor decisión, pero termino actuando de otra manera." },
    { texto: "Aprendo cosas nuevas, pero rara vez cambian mis hábitos o mi forma de vivir." },
    { texto: "Intento aplicar aquello que considero importante, aunque requiera esfuerzo.", invertida: true },
    { texto: "Me resulta más fácil hablar de lo que sé que vivir de acuerdo con ello." },
    { texto: "Las experiencias importantes suelen cambiar mi forma de actuar.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Eres capaz de transformar el conocimiento en sabiduría. Tus aprendizajes se reflejan de forma natural en tus decisiones y en tu manera de vivir." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "Comprendes muchas cosas, pero no siempre consigues integrarlas plenamente en tu Vida cotidiana." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una diferencia significativa entre lo que sabes y lo que practicas. Tu crecimiento consiste en convertir el conocimiento en experiencia vivida." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es descubrir que la sabiduría no se mide por lo que sabes, sino por la manera en que eliges vivir cada día." },
  ],
  senales: [
    "Das consejos que tú mismo no aplicas.",
    "Tomas decisiones coherentes con lo que sabes que es importante.",
    "Diferencias entre acumular información y transformar tu manera de vivir.",
  ],
  umbral: "El conocimiento deja de ser una idea y se convierte en una guía natural para tus decisiones y acciones.",
  integracion: "La sabiduría comienza cuando aquello que comprendo se convierte en la forma en que elijo vivir.",
  ilustracion:
    "Una figura sostiene con serenidad una espada luminosa que separa, sobre una mesa, un montón de objetos: a un lado deja lo superfluo en sombra, al otro conserva unas pocas piezas que brillan. La escena transmite discernimiento sereno, no combate: elegir qué merece formar parte de la propia Vida.",
};

const CHET: SenderoContenido = {
  num: 18,
  orden: 8,
  letra: "Chet",
  hebreo: "ח",
  palabraClave: "Límites",
  titulo: "De la Comprensión a los Límites",
  from: "binah",
  to: "geburah",
  significadoTradicional:
    "Chet (ח) significa \"cerca\" o \"recinto\". En la tradición cabalística simboliza el espacio protegido, los límites que permiten conservar la Vida y el orden. No representa una barrera para aislarse, sino una estructura que protege aquello que tiene valor.\n\nAl conectar Binah con Gevurah, este sendero representa el paso desde la comprensión hacia el discernimiento y la disciplina. Enseña que comprender una situación también implica saber hasta dónde llegar, cuándo actuar y cuándo decir \"no\".",
  traduccionPsicologica:
    "Este sendero representa la capacidad de transformar la comprensión en límites saludables. Comprender a una persona o una situación no significa aceptarlo todo ni renunciar a nuestras necesidades.\n\nNos recuerda que la verdadera madurez consiste en combinar la empatía con la firmeza, estableciendo límites que protejan nuestro bienestar sin dejar de respetar a los demás.",
  pregunta: "¿Eres capaz de poner límites sin dejar de comprender a los demás?",
  une: [
    "Comprender las razones de una persona no significa justificar cualquier comportamiento. Muchas veces confundimos empatía con permisividad y terminamos sacrificando nuestro bienestar por evitar el conflicto.",
    "Este sendero nos enseña que poner límites no contradice la comprensión; la completa. Solo cuando sabemos proteger aquello que es importante para nosotros podemos relacionarnos desde el respeto y no desde el agotamiento o la obligación.",
  ],
  testTitulo: "¿Cómo transformas la comprensión en límites saludables?",
  test: [
    { texto: "Aunque entiendo que una situación me perjudica, me cuesta poner límites." },
    { texto: "Suelo ceder para evitar conflictos, incluso cuando no estoy de acuerdo." },
    { texto: "Soy capaz de expresar mis límites con respeto cuando es necesario.", invertida: true },
    { texto: "Me siento culpable cuando priorizo mis propias necesidades." },
    { texto: "Entiendo que poner límites también es una forma de cuidar las relaciones.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Sabes combinar la comprensión con límites saludables. Eres capaz de cuidar de los demás sin dejar de cuidar de ti." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones comprendes tanto a los demás que olvidas proteger tus propias necesidades. Existe margen para fortalecer tus límites." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Tiendes a confundir comprensión con renuncia personal. Tu crecimiento consiste en descubrir que decir \"no\" también puede ser un acto de respeto y equilibrio." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es desarrollar límites claros y saludables. Comprender no significa permitirlo todo; significa actuar con conciencia, respeto y responsabilidad." },
  ],
  senales: [
    "Dices \"sí\" cuando en realidad quieres decir \"no\".",
    "Justificas comportamientos que vulneran tus propios límites.",
    "Expresas tus necesidades con claridad y respeto.",
  ],
  umbral: "Comprendes que poner límites no rompe las relaciones; las hace más sanas y auténticas.",
  integracion: "La comprensión me acerca a los demás; los límites también me permiten respetarme a mí mismo.",
  ilustracion:
    "Un jardín cuidado y lleno de Vida crece dentro de un cercado de piedra baja. La puerta del recinto está abierta, pero es la persona que está dentro quien decide serena quién pasa y quién no. La cerca no aísla: protege lo que florece.",
};

const TET: SenderoContenido = {
  num: 19,
  orden: 9,
  letra: "Tet",
  hebreo: "ט",
  palabraClave: "Equilibrio",
  titulo: "De la Generosidad a los Límites",
  from: "chesed",
  to: "geburah",
  significadoTradicional:
    "Tet (ט) simboliza el bien oculto. En la tradición cabalística representa la capacidad de descubrir el equilibrio que existe detrás de aquello que, a primera vista, parece contradictorio. Enseña que la verdadera bondad no siempre consiste en dar más, sino en actuar con sabiduría.\n\nAl conectar Chesed con Gevurah, este sendero representa la integración entre la generosidad y la disciplina. Nos recuerda que el amor necesita límites para mantenerse sano y que la firmeza también puede ser una forma de compasión.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de equilibrar el deseo de ayudar con la necesidad de proteger nuestra energía y respetar la responsabilidad de los demás.\n\nNos invita a descubrir que cuidar no significa resolver todos los problemas ajenos, sino ofrecer apoyo sin perder el equilibrio personal.",
  pregunta: "¿Sabes cuidar de los demás sin dejar de cuidar de ti mismo?",
  une: [
    "Dar es una expresión natural del amor, pero cuando no existen límites, la generosidad puede convertirse en agotamiento, dependencia o frustración. Ayudar no siempre significa hacer más; a veces significa permitir que la otra persona crezca por sí misma.",
    "Este sendero enseña que la verdadera compasión sabe cuándo acercarse y cuándo dar espacio. El equilibrio aparece cuando el amor deja de ser sacrificio y se convierte en una elección consciente.",
  ],
  testTitulo: "¿Cómo equilibras la generosidad con los límites?",
  test: [
    { texto: "Me cuesta decir \"no\" cuando alguien necesita mi ayuda." },
    { texto: "Con frecuencia asumo problemas que realmente pertenecen a otras personas." },
    { texto: "Soy capaz de ayudar sin sentir que debo hacerme responsable de todo.", invertida: true },
    { texto: "Me siento culpable cuando priorizo mis propias necesidades antes que las de los demás." },
    { texto: "Entiendo que poner límites también es una forma de cuidar.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Has aprendido a equilibrar la generosidad con límites saludables. Sabes ofrecer apoyo sin perder tu bienestar ni asumir responsabilidades que no te corresponden." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones das más de lo que puedes sostener. Fortalecer tus límites te permitirá ayudar de una forma más sana y sostenible." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una tendencia a confundir amor con sacrificio. Tu crecimiento consiste en descubrir que cuidar de ti también forma parte del cuidado hacia los demás." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es comprender que una generosidad sin límites termina debilitando tanto a quien ayuda como a quien recibe la ayuda. El equilibrio es la expresión más madura del amor." },
  ],
  senales: [
    "Ayudas por elección o por culpa.",
    "Resuelves problemas que otras personas podrían afrontar por sí mismas.",
    "Te permites decir \"no\" sin sentir que estás dejando de ser una buena persona.",
  ],
  umbral: "Descubres que poner límites no reduce tu capacidad de amar; la hace más consciente, libre y sostenible.",
  integracion: "El amor más sabio no es el que más da, sino el que sabe cuándo dar y cuándo dejar crecer.",
  ilustracion:
    "Una balanza serena sostiene en un platillo un corazón cálido y en el otro una mano firme y abierta; ambos quedan a la misma altura. Detrás, una persona ofrece agua a una planta joven sin inundarla, dándole solo lo justo para que crezca por sí misma.",
};

const YOD: SenderoContenido = {
  num: 20,
  orden: 10,
  letra: "Yod",
  hebreo: "י",
  palabraClave: "Acción consciente",
  titulo: "De la Generosidad a la Compasión Consciente",
  from: "chesed",
  to: "tipharet",
  significadoTradicional:
    "Yod (י) significa \"mano\". Es la letra más pequeña del alfabeto hebreo, pero de ella nacen todas las demás. En la tradición cabalística simboliza la acción consciente, el potencial contenido en un gesto y la capacidad de transformar la realidad mediante actos sencillos pero significativos.\n\nAl conectar Chesed con Tiferet, este sendero representa el paso desde la generosidad espontánea hacia una compasión equilibrada. Enseña que el verdadero amor no solo consiste en dar, sino en hacerlo con sabiduría y presencia.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de actuar desde un amor consciente. No toda ayuda produce bienestar, ni toda buena intención genera un buen resultado.\n\nNos invita a desarrollar una generosidad guiada por la reflexión, donde cada acción responda a lo que realmente necesita la otra persona y no únicamente a nuestro deseo de ayudar.",
  pregunta: "¿Ayudas desde la conciencia o desde el impulso de sentirte necesario?",
  une: [
    "La generosidad nace del deseo de contribuir, pero la compasión requiere comprender qué necesita realmente la otra persona. A veces el mayor acto de amor no es hacer más, sino hacer lo adecuado.",
    "Este sendero nos enseña que ayudar también implica escuchar, respetar los tiempos del otro y actuar con equilibrio. La verdadera compasión no busca sentirse útil; busca favorecer el crecimiento.",
  ],
  testTitulo: "¿Cómo transformas la generosidad en una compasión consciente?",
  test: [
    { texto: "Suelo ayudar sin preguntarme si esa ayuda es realmente lo que la otra persona necesita." },
    { texto: "Me cuesta diferenciar entre apoyar a alguien y resolverle sus problemas." },
    { texto: "Antes de ayudar, procuro comprender qué necesita realmente la otra persona.", invertida: true },
    { texto: "Con frecuencia ofrezco ayuda para sentirme útil o valorado." },
    { texto: "Soy capaz de acompañar a alguien sin sentir la necesidad de controlar el resultado.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Tu generosidad está acompañada de comprensión y equilibrio. Sabes ofrecer apoyo respetando la autonomía y el proceso de cada persona." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones ayudas desde el impulso más que desde la reflexión. Dedicar un momento a comprender la situación puede hacer que tu apoyo sea mucho más valioso." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una tendencia a confundir ayudar con hacerse responsable. Tu crecimiento consiste en descubrir que acompañar no siempre significa intervenir." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es transformar la necesidad de ayudar en una compasión consciente. La ayuda más valiosa no siempre es la que más hace, sino la que mejor responde a las necesidades del otro." },
  ],
  senales: [
    "Ofreces ayuda antes de preguntar qué necesita realmente la otra persona.",
    "Intervienes para aliviar tu incomodidad o para favorecer el crecimiento del otro.",
    "Eres capaz de acompañar sin controlar el proceso ni el resultado.",
  ],
  umbral: "Tu forma de ayudar deja de responder al impulso de hacer más y comienza a responder a la verdadera necesidad del otro.",
  integracion: "La compasión no consiste en hacer todo por los demás, sino en ofrecer aquello que realmente necesitan para crecer.",
  ilustracion:
    "Un primer plano de una mano abierta que no agarra ni empuja: sostiene con delicadeza una pequeña semilla luminosa, ofreciéndola sin cerrarse sobre ella. Alrededor, la luz sugiere que de ese gesto mínimo y consciente puede nacer algo mucho mayor.",
};

const KAF: SenderoContenido = {
  num: 21,
  orden: 11,
  letra: "Kaf",
  hebreo: "כ",
  palabraClave: "Perseverancia",
  titulo: "De la Generosidad a la Perseverancia",
  from: "chesed",
  to: "netzach",
  significadoTradicional:
    "Kaf (כ) significa \"palma de la mano\". En la tradición cabalística simboliza la capacidad de sostener, contener y materializar aquello que recibimos. Representa el potencial que solo se desarrolla mediante el compromiso y la acción constante.\n\nAl conectar Chesed con Netzach, este sendero simboliza el paso desde el impulso generoso hacia la perseverancia. Enseña que las buenas intenciones solo producen un impacto duradero cuando se mantienen en el tiempo.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de convertir el entusiasmo inicial en compromiso. Ayudar, amar o iniciar un proyecto resulta relativamente sencillo; lo difícil es permanecer cuando aparecen el cansancio, la rutina o las dificultades.\n\nNos recuerda que la verdadera generosidad no se mide por un acto aislado, sino por la capacidad de sostener aquello que consideramos importante incluso cuando deja de ser fácil.",
  pregunta: "¿Eres capaz de mantener tu compromiso cuando desaparece la motivación?",
  une: [
    "Las buenas intenciones nacen con facilidad, pero solo la perseverancia las convierte en una realidad. Muchas personas comienzan proyectos con entusiasmo y los abandonan cuando aparecen los primeros obstáculos.",
    "Este sendero representa el paso del impulso al compromiso. Nos enseña que aquello que merece la pena construir requiere constancia, incluso cuando los resultados todavía no son visibles.",
  ],
  testTitulo: "¿Cómo transformas la generosidad en perseverancia?",
  test: [
    { texto: "Empiezo proyectos o compromisos con entusiasmo, pero me cuesta mantenerlos en el tiempo." },
    { texto: "Cuando los resultados tardan en llegar, suelo perder la motivación." },
    { texto: "Soy capaz de mantener mis compromisos incluso cuando dejan de ser emocionantes.", invertida: true },
    { texto: "Necesito sentir entusiasmo para seguir adelante con algo importante." },
    { texto: "Disfruto construyendo poco a poco, aunque el progreso sea lento.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Has aprendido a convertir la motivación en compromiso. Tu constancia no depende únicamente del entusiasmo, sino de la importancia que das a aquello que has elegido construir." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones tu perseverancia depende demasiado de cómo te sientes. Desarrollar mayor constancia fortalecerá tus proyectos y relaciones." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una tendencia a abandonar cuando desaparece la motivación inicial. Tu crecimiento consiste en descubrir que la disciplina puede sostener aquello que el entusiasmo no consigue mantener." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es transformar las buenas intenciones en compromiso sostenido. La perseverancia no consiste en avanzar siempre con ganas, sino en continuar porque sabes por qué empezaste." },
  ],
  senales: [
    "Abandonas una tarea porque ha dejado de ser emocionante.",
    "Tomas decisiones basándote únicamente en cómo te sientes en ese momento.",
    "Cumples los compromisos que has asumido contigo mismo incluso cuando nadie te observa.",
  ],
  umbral: "Tus decisiones dejan de depender de la motivación y comienzan a sostenerse en el compromiso con aquello que realmente valoras.",
  integracion: "El entusiasmo inicia el camino; la perseverancia lo convierte en una realidad.",
  ilustracion:
    "Una palma de la mano abierta y firme sostiene una llama que no se apaga pese al viento que se insinúa alrededor. Al fondo, un camino largo asciende con paso constante; las huellas son regulares, sin prisa, mostrando que lo que sostiene el fuego no es la ráfaga, sino la mano que permanece.",
};

const LAMED: SenderoContenido = {
  num: 22,
  orden: 12,
  letra: "Lamed",
  hebreo: "ל",
  palabraClave: "Equilibrio",
  titulo: "De los Límites al Equilibrio",
  from: "geburah",
  to: "tipharet",
  significadoTradicional:
    "Lamed (ל) significa \"aprender\" o \"enseñar\". Es la única letra hebrea que sobresale por encima de las demás, simbolizando la aspiración hacia un nivel más elevado de comprensión. En la tradición cabalística representa el aprendizaje continuo y la capacidad de transformar la disciplina en sabiduría.\n\nAl conectar Gevurah con Tiferet, este sendero simboliza el paso desde la firmeza hacia el equilibrio. Enseña que los límites alcanzan su verdadero propósito cuando dejan de ser una reacción y se convierten en una expresión consciente de nuestros valores.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de equilibrar la firmeza con la compasión. Saber poner límites es importante, pero también lo es hacerlo desde la serenidad y no desde el miedo, la rigidez o el enfado.\n\nNos recuerda que la madurez consiste en encontrar un punto donde la protección de uno mismo y el respeto por los demás puedan convivir sin enfrentarse.",
  pregunta: "¿Tus límites nacen de la calma o de la necesidad de controlar?",
  une: [
    "Los límites son necesarios, pero cuando se vuelven demasiado rígidos pueden alejarnos de los demás. Del mismo modo, la compasión sin límites puede llevarnos al agotamiento o a la pérdida de identidad.",
    "Este sendero nos enseña que el equilibrio no consiste en elegir entre firmeza o amabilidad, sino en aprender cuándo cada una es necesaria. La verdadera fortaleza sabe proteger sin endurecerse.",
  ],
  testTitulo: "¿Cómo transformas los límites en equilibrio?",
  test: [
    { texto: "Cuando pongo límites, suelo hacerlo de forma brusca o impulsiva." },
    { texto: "Me cuesta encontrar un punto intermedio entre ceder y ser demasiado rígido." },
    { texto: "Soy capaz de expresar mis límites con respeto y serenidad.", invertida: true },
    { texto: "Cuando alguien no actúa como espero, tiendo a endurecer mi postura." },
    { texto: "Intento comprender a la otra persona sin renunciar a mis propios límites.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Has aprendido a combinar firmeza y comprensión. Tus límites protegen tus valores sin deteriorar tus relaciones." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones oscilas entre ser demasiado flexible o demasiado rígido. Existe margen para desarrollar un equilibrio más estable." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Tiendes a utilizar los límites como una forma de protegerte del conflicto o del malestar. Tu crecimiento consiste en descubrir una firmeza más serena y consciente." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es comprender que la verdadera fortaleza no necesita imponerse. Los límites más saludables nacen del equilibrio, no del control." },
  ],
  senales: [
    "Reaccionas con dureza cuando alguien sobrepasa un límite.",
    "Evitas el conflicto hasta que terminas explotando.",
    "Eres capaz de mantener la calma mientras expresas lo que necesitas.",
  ],
  umbral: "Tus límites dejan de ser una reacción defensiva y se convierten en una expresión tranquila de quién eres y de lo que valoras.",
  integracion: "La verdadera fortaleza no consiste en endurecerse, sino en mantener el equilibrio incluso cuando es necesario decir 'no'.",
  ilustracion:
    "Una figura serena permanece de pie sobre una roca en equilibrio perfecto, sosteniendo en una mano un escudo y en la otra una rama verde. No hay tensión en su postura: firmeza y suavidad conviven. Por encima de todo, una única línea asciende hacia lo alto, como la letra que sobresale, señalando el aprendizaje.",
};

const MEM: SenderoContenido = {
  num: 23,
  orden: 13,
  letra: "Mem",
  hebreo: "מ",
  palabraClave: "Expresión",
  titulo: "De los Límites a la Expresión",
  from: "geburah",
  to: "hod",
  significadoTradicional:
    "Mem (מ) significa \"agua\". En la tradición cabalística simboliza la profundidad, la reflexión y la capacidad de adaptarse sin perder la propia esencia. El agua encuentra su camino sin necesidad de imponerse, mostrando que la verdadera fuerza puede expresarse con serenidad.\n\nAl conectar Gevurah con Hod, este sendero representa el paso desde la disciplina y los límites hacia una comunicación consciente. Enseña que la firmeza alcanza su mayor valor cuando puede expresarse con claridad, humildad y respeto.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de comunicar nuestros límites de forma sana. Poner límites no consiste únicamente en decir \"no\", sino en expresar nuestras necesidades de manera clara, respetuosa y oportuna.\n\nNos recuerda que una comunicación auténtica no busca imponer ni evitar el conflicto, sino generar comprensión mutua.",
  pregunta: "¿Expresas tus límites con claridad o esperas a que el malestar hable por ti?",
  une: [
    "Un límite que no se comunica difícilmente puede ser respetado. Del mismo modo, un límite expresado desde la rabia o el resentimiento suele generar más distancia que comprensión.",
    "Este sendero nos enseña que la comunicación es el puente entre lo que necesitamos y la forma en que nos relacionamos con los demás. Expresar un límite con serenidad fortalece tanto el respeto propio como la calidad de nuestras relaciones.",
  ],
  testTitulo: "¿Cómo expresas tus límites?",
  test: [
    { texto: "Suelo callarme aquello que me molesta hasta que termino explotando." },
    { texto: "Me cuesta expresar mis necesidades por miedo a generar conflictos." },
    { texto: "Soy capaz de comunicar mis límites con claridad y respeto.", invertida: true },
    { texto: "Cuando pongo un límite, suelo hacerlo desde el enfado o la frustración." },
    { texto: "Expreso lo que necesito antes de que el malestar se acumule.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Sabes expresar tus límites con serenidad y claridad. Tu comunicación favorece el respeto mutuo y evita conflictos innecesarios." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones retrasas conversaciones importantes o esperas demasiado para expresar lo que necesitas. Una comunicación más temprana fortalecerá tus relaciones." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una tendencia a guardar el malestar o a comunicarlo cuando ya es demasiado intenso. Tu crecimiento consiste en expresar tus necesidades antes de que se conviertan en frustración." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es descubrir que comunicar un límite no es generar un conflicto, sino ofrecer a los demás la oportunidad de respetarlo. La claridad evita muchos problemas que el silencio termina alimentando." },
  ],
  senales: [
    "Esperas demasiado antes de expresar aquello que te incomoda.",
    "Confías en que los demás adivinen lo que necesitas sin decirlo.",
    "Comunicas tus límites con calma o únicamente cuando ya no puedes más.",
  ],
  umbral: "Eres capaz de expresar tus necesidades con claridad, respeto y serenidad, sin esperar a que el malestar decida por ti.",
  integracion: "Los límites protegen mis valores; la comunicación les da la oportunidad de ser comprendidos.",
  ilustracion:
    "Un curso de agua clara desciende por un cauce y rodea una gran roca sin chocar con ella: la sortea con serenidad y sigue su camino. La superficie refleja el cielo con calma, sugiriendo que se puede ser firme y fluido a la vez, expresando la fuerza sin estridencia.",
};

const NUN: SenderoContenido = {
  num: 24,
  orden: 14,
  letra: "Nun",
  hebreo: "נ",
  palabraClave: "Resiliencia",
  titulo: "Del Equilibrio a la Perseverancia",
  from: "tipharet",
  to: "netzach",
  significadoTradicional:
    "Nun (נ) significa \"pez\". En la tradición cabalística simboliza la continuidad de la Vida, la capacidad de avanzar incluso en aguas profundas y la resiliencia frente a los cambios. Representa el movimiento constante y la fuerza silenciosa que permite seguir creciendo a pesar de las dificultades.\n\nAl conectar Tiferet con Netzach, este sendero simboliza el paso desde el equilibrio interior hacia la perseverancia. Enseña que la armonía no se demuestra cuando todo va bien, sino cuando somos capaces de mantener nuestro centro en medio de los desafíos.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de sostener nuestros valores y nuestro equilibrio cuando aparecen los obstáculos. Es fácil actuar con serenidad cuando las circunstancias son favorables; el verdadero crecimiento comienza cuando decidimos mantener el rumbo incluso en los momentos difíciles.\n\nNos recuerda que la perseverancia nace del equilibrio interior, no de la obstinación.",
  pregunta: "¿Mantienes tus valores cuando la Vida deja de ser fácil?",
  une: [
    "Encontrar el equilibrio es un logro importante, pero conservarlo cuando aparecen la presión, el cansancio o la frustración es un desafío mucho mayor. Muchas personas pierden rápidamente su centro cuando las circunstancias cambian.",
    "Este sendero nos enseña que la verdadera perseverancia no consiste en resistir por orgullo, sino en continuar avanzando sin perder aquello que nos define. Permanecer fieles a nuestros valores es la forma más profunda de constancia.",
  ],
  testTitulo: "¿Cómo mantienes tu equilibrio frente a las dificultades?",
  test: [
    { texto: "Cuando las cosas se complican, abandono fácilmente aquello que considero importante." },
    { texto: "El estrés o la frustración hacen que actúe de forma muy diferente a como realmente quiero ser." },
    { texto: "Soy capaz de mantener mis principios incluso en momentos difíciles.", invertida: true },
    { texto: "Cuando aparecen obstáculos, suelo perder la motivación rápidamente." },
    { texto: "Las dificultades fortalecen mi compromiso con aquello que considero valioso.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Has desarrollado una perseverancia basada en el equilibrio. Las dificultades no cambian quién eres ni aquello que consideras importante." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones los problemas afectan más de lo que te gustaría a tu constancia. Fortalecer tu equilibrio interior te ayudará a mantener el rumbo." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una tendencia a perder el centro cuando aparecen los obstáculos. Tu crecimiento consiste en aprender a sostener tus valores incluso en los momentos de incertidumbre." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es descubrir que la perseverancia no depende de que todo salga bien, sino de la capacidad de permanecer fiel a lo que realmente importa." },
  ],
  senales: [
    "Tus decisiones cambian cuando aparecen dificultades o presión.",
    "Abandonas compromisos por el cansancio del momento.",
    "Recuerdas tus valores antes de reaccionar ante un problema.",
  ],
  umbral: "Las circunstancias dejan de determinar quién eres, porque tus valores se convierten en el verdadero motor de tus decisiones.",
  integracion: "La perseverancia no consiste en resistirlo todo, sino en permanecer fiel a aquello que da sentido a mi camino.",
  ilustracion:
    "Un pez asciende con fuerza serena por una corriente de aguas profundas, remontándola sin luchar contra cada ola. Alrededor el agua se agita, pero su rumbo es firme y su movimiento continuo, sugiriendo una perseverancia que nace de la calma interior y no del esfuerzo desesperado.",
};

const SAMEKH: SenderoContenido = {
  num: 25,
  orden: 15,
  letra: "Samekh",
  hebreo: "ס",
  palabraClave: "Coherencia",
  titulo: "Del Equilibrio a la Coherencia",
  from: "tipharet",
  to: "yesod",
  significadoTradicional:
    "Samekh (ס) significa \"apoyo\" o \"sostén\". En la tradición cabalística simboliza aquello que mantiene firme una estructura y le permite permanecer estable a lo largo del tiempo. Representa el fundamento sobre el que algo puede crecer sin perder su equilibrio.\n\nAl conectar Tiferet con Yesod, este sendero simboliza el paso desde el equilibrio interior hacia la construcción de una base sólida. Enseña que los valores y la armonía solo se consolidan cuando se traducen en hábitos y acciones consistentes.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de convertir el equilibrio interior en una forma estable de vivir. Sentirse centrado es valioso, pero ese equilibrio necesita reflejarse en nuestras rutinas, decisiones y compromisos cotidianos.\n\nNos recuerda que la coherencia no nace de un momento de inspiración, sino de las pequeñas acciones que repetimos cada día.",
  pregunta: "¿Tus hábitos reflejan el equilibrio que deseas vivir?",
  une: [
    "Encontrar el equilibrio interior es un paso importante, pero mantenerlo requiere una base sólida. Sin hábitos coherentes, incluso las mejores intenciones terminan debilitándose con el tiempo.",
    "Este sendero nos enseña que la estabilidad no depende de cómo nos sentimos en un momento concreto, sino de las decisiones que repetimos de forma constante. La coherencia convierte los valores en una manera de vivir.",
  ],
  testTitulo: "¿Cómo transformas tu equilibrio en una Vida coherente?",
  test: [
    { texto: "Me cuesta mantener hábitos alineados con los valores que considero importantes." },
    { texto: "Mis decisiones cambian con facilidad según mi estado de ánimo." },
    { texto: "Procuro que mis acciones diarias reflejen aquello en lo que creo.", invertida: true },
    { texto: "Con frecuencia dejo para más adelante aquello que sé que me hace bien." },
    { texto: "Mantengo mis compromisos personales incluso cuando nadie me los exige.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Has conseguido transformar tus valores en una forma estable de vivir. Tus hábitos fortalecen el equilibrio que has construido." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones existe una diferencia entre lo que consideras importante y lo que haces cada día. Pequeños cambios sostenidos pueden fortalecer tu coherencia." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Tu equilibrio interior todavía no se refleja de forma constante en tus hábitos y decisiones. Tu crecimiento consiste en construir una base más sólida para sostener aquello que valoras." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es descubrir que una Vida coherente no se construye con grandes decisiones aisladas, sino con pequeñas acciones repetidas cada día." },
  ],
  senales: [
    "Tus hábitos reflejan realmente tus valores.",
    "Cumples los compromisos que asumes contigo mismo.",
    "Tomas decisiones desde tus principios o desde el impulso del momento.",
  ],
  umbral: "Tus valores dejan de ser solo una intención y comienzan a reflejarse de forma constante en la manera en que eliges vivir.",
  integracion: "La coherencia no se demuestra en las grandes decisiones, sino en los pequeños actos que repito cada día.",
  ilustracion:
    "Una columna serena y bien asentada sostiene una estructura luminosa; a sus pies, hileras de piedras iguales, colocadas una tras otra con paciencia, forman el cimiento. La imagen transmite que lo que sostiene la altura no es un gran gesto, sino la repetición constante de pequeños apoyos.",
};

const AYIN: SenderoContenido = {
  num: 26,
  orden: 16,
  letra: "Ayin",
  hebreo: "ע",
  palabraClave: "Autenticidad",
  titulo: "Del Equilibrio a la Expresión",
  from: "tipharet",
  to: "hod",
  significadoTradicional:
    "Ayin (ע) significa \"ojo\". En la tradición cabalística simboliza la visión interior, la percepción profunda y la capacidad de ver más allá de las apariencias. No se limita a observar el mundo exterior; representa la mirada consciente que permite descubrir el significado de las experiencias.\n\nAl conectar Tiferet con Hod, este sendero simboliza el paso desde la armonía interior hacia la expresión consciente. Enseña que la verdad que habita en el corazón necesita ser comunicada para poder transformar nuestras relaciones y nuestra realidad.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de expresar con autenticidad aquello que sentimos y creemos. No basta con conocernos a nosotros mismos; también necesitamos aprender a comunicar nuestra verdad con claridad, humildad y respeto.\n\nNos recuerda que una Vida auténtica no consiste únicamente en sentir coherencia interior, sino en permitir que esa coherencia también se refleje en nuestra forma de hablar, escuchar y relacionarnos.",
  pregunta: "¿Expresas lo que realmente eres o adaptas tu voz para ser aceptado?",
  une: [
    "Encontrar el equilibrio interior es solo una parte del camino. Muchas personas saben quiénes son, pero les cuesta mostrarlo por miedo al rechazo, al conflicto o a no sentirse comprendidas.",
    "Este sendero nos enseña que la autenticidad alcanza su plenitud cuando encuentra una voz. Expresar nuestra verdad con respeto fortalece tanto nuestra identidad como la calidad de nuestras relaciones.",
  ],
  testTitulo: "¿Cómo expresas tu verdad?",
  test: [
    { texto: "Suelo callar lo que realmente pienso para evitar conflictos." },
    { texto: "Adapto mi forma de ser para sentirme aceptado por los demás." },
    { texto: "Expreso mis opiniones con respeto, incluso cuando sé que pueden no gustar.", invertida: true },
    { texto: "Me cuesta mostrar cómo me siento realmente." },
    { texto: "Siento que mi forma de comunicar refleja quién soy de verdad.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Existe una buena coherencia entre lo que sientes y la forma en que lo expresas. Tu comunicación fortalece tu autenticidad." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones ocultas parte de lo que eres para evitar incomodar o decepcionar a los demás. Expresarte con mayor naturalidad fortalecerá tus relaciones." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una diferencia entre tu mundo interior y la manera en que te comunicas. Tu crecimiento consiste en desarrollar una voz más auténtica y confiada." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es descubrir que expresar tu verdad con respeto no pone en riesgo tus relaciones; les permite ser más honestas y profundas." },
  ],
  senales: [
    "Guardas silencio cuando realmente necesitas expresar algo importante.",
    "Modificas tu opinión para obtener aprobación.",
    "Te comunicas desde la autenticidad o desde el miedo a la reacción de los demás.",
  ],
  umbral: "Tu forma de expresarte refleja con naturalidad quién eres, sin necesidad de esconderte ni de imponerte.",
  integracion: "Mi voz tiene más fuerza cuando nace de la autenticidad y no de la necesidad de ser aceptado.",
  ilustracion:
    "Un ojo sereno y luminoso se abre y de su mirada surge un haz de luz que se transforma en palabras visibles, ondas que se propagan hacia fuera con calma. La imagen sugiere que la visión interior encuentra por fin una voz: lo que se ve y se siente por dentro se expresa hacia el mundo.",
};

const PE: SenderoContenido = {
  num: 27,
  orden: 17,
  letra: "Pe",
  hebreo: "פ",
  palabraClave: "Palabra",
  titulo: "De la Perseverancia a la Expresión",
  from: "netzach",
  to: "hod",
  significadoTradicional:
    "Pe (פ) significa \"boca\". En la tradición cabalística simboliza el poder de la palabra, la comunicación y la capacidad de dar forma a la realidad a través de aquello que expresamos. La palabra no solo transmite pensamientos; también crea, inspira y transforma.\n\nAl conectar Netzach con Hod, este sendero representa el paso desde la perseverancia hacia la comunicación consciente. Enseña que el esfuerzo sostenido alcanza un nuevo nivel cuando somos capaces de compartir lo aprendido y expresar con claridad aquello que da sentido a nuestro camino.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de comunicar con autenticidad aquello que hemos construido mediante la experiencia. La perseverancia nos transforma por dentro, pero compartir ese aprendizaje también puede transformar a quienes nos rodean.\n\nNos recuerda que expresar nuestra experiencia con honestidad fortalece tanto nuestro crecimiento como nuestras relaciones.",
  pregunta: "¿Compartes lo que has aprendido o guardas tu experiencia solo para ti?",
  une: [
    "La constancia nos ayuda a crecer, pero ese crecimiento alcanza un nuevo valor cuando podemos ponerlo en palabras. Muchas veces vivimos aprendizajes importantes que nunca llegamos a expresar, perdiendo la oportunidad de comprenderlos mejor o de inspirar a otros.",
    "Este sendero nos enseña que comunicar no consiste en hablar más, sino en compartir aquello que realmente merece ser dicho. La experiencia encuentra un nuevo significado cuando puede convertirse en una fuente de aprendizaje compartido.",
  ],
  testTitulo: "¿Cómo transformas la perseverancia en comunicación?",
  test: [
    { texto: "Me cuesta expresar lo que he aprendido a través de mis experiencias." },
    { texto: "Prefiero guardar mis ideas o aprendizajes antes que compartirlos." },
    { texto: "Comparto mis experiencias cuando creo que pueden aportar valor a otras personas.", invertida: true },
    { texto: "Aunque tenga algo importante que decir, suelo callarlo por inseguridad." },
    { texto: "Expresar mis aprendizajes me ayuda a comprenderlos todavía mejor.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Sabes expresar con claridad aquello que has aprendido. Tu comunicación nace de la experiencia y contribuye tanto a tu crecimiento como al de quienes te rodean." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones dudas antes de compartir lo que sabes o has vivido. Confiar más en tu experiencia enriquecerá tu forma de comunicar." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una tendencia a guardar para ti aprendizajes valiosos. Tu crecimiento consiste en descubrir que compartir tu experiencia también forma parte del aprendizaje." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es encontrar tu propia voz. Aquello que has construido con esfuerzo puede convertirse en una fuente de inspiración y crecimiento cuando decides expresarlo." },
  ],
  senales: [
    "Guardas silencio cuando tu experiencia podría ayudar a alguien.",
    "Restas valor a lo que has aprendido por pensar que \"no es suficiente\".",
    "Compartes tus aprendizajes desde la autenticidad y no desde la necesidad de impresionar.",
  ],
  umbral: "Tu experiencia deja de ser únicamente un crecimiento personal y comienza a convertirse en una fuente de valor para los demás.",
  integracion: "Cuando comparto con autenticidad lo que la Vida me ha enseñado, mi aprendizaje también comienza a crecer en los demás.",
  ilustracion:
    "Una boca entreabierta deja salir un hilo de luz que se despliega en semillas brillantes; algunas caen en las manos de otras personas cercanas y germinan al instante. La imagen transmite que la palabra compartida siembra: lo aprendido con esfuerzo se convierte en fruto que crece también en los demás.",
};

const TSADI: SenderoContenido = {
  num: 28,
  orden: 18,
  letra: "Tsadi",
  hebreo: "צ",
  palabraClave: "Hábitos",
  titulo: "De la Perseverancia a los Hábitos",
  from: "netzach",
  to: "yesod",
  significadoTradicional:
    "Tsadi (צ) significa \"justo\" o \"rectitud\". En la tradición cabalística representa a la persona que vive de acuerdo con sus principios, manteniéndose firme incluso cuando nadie la observa. Simboliza la coherencia entre las convicciones internas y la forma de actuar.\n\nAl conectar Netzach con Yesod, este sendero representa el paso desde la perseverancia hacia la consolidación de una base estable. Enseña que la constancia solo transforma la Vida cuando se convierte en hábitos que sostienen nuestros valores.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de convertir el esfuerzo en una forma de vivir. Perseverar no consiste únicamente en resistir las dificultades, sino en crear rutinas que hagan posible avanzar sin depender constantemente de la motivación.\n\nNos recuerda que la verdadera transformación ocurre cuando aquello que antes requería esfuerzo comienza a formar parte de nuestra identidad.",
  pregunta: "¿Tus hábitos sostienen la persona que quieres llegar a ser?",
  une: [
    "La perseverancia permite avanzar, pero son los hábitos los que consolidan ese avance. Muchas personas tienen la voluntad de cambiar, pero al no construir una estructura diaria, terminan regresando a sus antiguos patrones.",
    "Este sendero nos enseña que el crecimiento no depende de hacer esfuerzos extraordinarios, sino de repetir pequeñas acciones coherentes hasta que se convierten en una forma natural de vivir.",
  ],
  testTitulo: "¿Cómo transformas la perseverancia en hábitos?",
  test: [
    { texto: "Me cuesta mantener hábitos durante mucho tiempo." },
    { texto: "Dependo de la motivación para hacer aquello que considero importante." },
    { texto: "He construido rutinas que apoyan mis objetivos y mis valores.", invertida: true },
    { texto: "Cuando interrumpo un hábito, me resulta difícil retomarlo." },
    { texto: "Mis pequeñas acciones diarias reflejan la persona que quiero llegar a ser.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Has conseguido transformar la perseverancia en hábitos consistentes. Tus rutinas sostienen tus valores y facilitan tu crecimiento." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "Existe constancia, pero todavía depende demasiado de la motivación o de las circunstancias. Consolidar pequeños hábitos fortalecerá tu estabilidad." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Tiendes a confiar más en el esfuerzo puntual que en la construcción de hábitos. Tu crecimiento consiste en desarrollar una estructura que sostenga tus objetivos." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es descubrir que la disciplina no nace del sacrificio constante, sino de construir hábitos que faciliten vivir de acuerdo con tus valores." },
  ],
  senales: [
    "Esperas sentir motivación antes de actuar.",
    "Tus hábitos reflejan realmente tus prioridades.",
    "Retomas una rutina después de interrumpirla, en lugar de abandonarla por completo.",
  ],
  umbral: "Tus hábitos dejan de depender de la motivación y comienzan a convertirse en una expresión natural de quién eres.",
  integracion: "No soy lo que hago de vez en cuando; me convierto en aquello que practico cada día.",
  ilustracion:
    "Un sendero de piedras iguales, colocadas una a una, atraviesa un jardín y se pierde sereno en el horizonte. Sobre él, unas huellas regulares avanzan sin prisa. La imagen transmite que el destino no lo marca un gran salto, sino el paso repetido cada día que termina trazando el camino.",
};

const QOF: SenderoContenido = {
  num: 29,
  orden: 19,
  letra: "Qof",
  hebreo: "ק",
  palabraClave: "Manifestación",
  titulo: "De la Perseverancia a la Manifestación",
  from: "netzach",
  to: "malkuth",
  significadoTradicional:
    "Qof (ק) significa \"nuca\", \"parte posterior de la cabeza\" o aquello que permanece oculto a la vista. En la tradición cabalística simboliza el paso entre lo interno y lo externo, recordándonos que toda transformación visible nace primero de un proceso interior.\n\nAl conectar Netzach con Malkhut, este sendero representa el paso desde la perseverancia hacia la manifestación. Enseña que la constancia acaba dejando una huella visible y que toda realidad construida comienza mucho antes de poder verse.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de convertir el esfuerzo sostenido en resultados reales. Muchas veces esperamos cambios inmediatos y olvidamos que las transformaciones más profundas son el fruto de pequeñas acciones repetidas durante mucho tiempo.\n\nNos recuerda que la manifestación no ocurre por casualidad; es la consecuencia natural de una perseverancia mantenida con intención.",
  pregunta: "¿Confías en el proceso o solo valoras los resultados cuando ya son visibles?",
  une: [
    "La perseverancia puede parecer invisible durante mucho tiempo. Sin embargo, cada pequeño esfuerzo construye una realidad que terminará manifestándose, aunque no podamos verla de inmediato.",
    "Este sendero nos enseña a valorar el proceso tanto como el resultado. Lo que hoy parece un avance pequeño puede convertirse, con el tiempo, en el cambio que transforme por completo nuestra Vida.",
  ],
  testTitulo: "¿Cómo transformas la perseverancia en resultados?",
  test: [
    { texto: "Abandono un proyecto cuando no veo resultados rápidamente." },
    { texto: "Me cuesta confiar en procesos cuyos beneficios tardan en aparecer." },
    { texto: "Soy capaz de seguir avanzando aunque el progreso sea lento.", invertida: true },
    { texto: "Necesito resultados visibles para mantener mi compromiso." },
    { texto: "Entiendo que las grandes transformaciones requieren tiempo y constancia.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Comprendes que los resultados son consecuencia del proceso. Tu perseverancia no depende únicamente de recompensas inmediatas." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones la falta de resultados visibles disminuye tu motivación. Aprender a confiar en el proceso fortalecerá tu capacidad para construir cambios duraderos." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una tendencia a medir el éxito solo por aquello que ya es visible. Tu crecimiento consiste en reconocer el valor de los pequeños avances que todavía no muestran todo su potencial." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es comprender que la realidad se construye antes de manifestarse. La perseverancia produce resultados, aunque durante un tiempo permanezcan ocultos." },
  ],
  senales: [
    "Abandonas un proceso únicamente porque los resultados tardan en llegar.",
    "Reconoces los pequeños avances que estás consiguiendo.",
    "Confías en el valor de la constancia incluso cuando nadie más percibe tu progreso.",
  ],
  umbral: "Dejas de trabajar únicamente por los resultados y aprendes a confiar en el valor transformador del proceso.",
  integracion: "Todo lo que hoy construyo en silencio será la realidad que mañana podré contemplar.",
  ilustracion:
    "Bajo tierra, unas raíces se extienden lentamente en la oscuridad mientras, sobre la superficie, apenas asoma un pequeño brote. La escena muestra las dos capas a la vez: el largo trabajo invisible de abajo y la primera señal visible arriba, sugiriendo que lo manifestado es solo la punta de un proceso sostenido.",
};

const RESH: SenderoContenido = {
  num: 30,
  orden: 20,
  letra: "Resh",
  hebreo: "ר",
  palabraClave: "Coherencia",
  titulo: "De la Expresión a la Coherencia",
  from: "hod",
  to: "yesod",
  significadoTradicional:
    "Resh (ר) significa \"cabeza\". En la tradición cabalística simboliza la conciencia, la dirección y la capacidad de orientar la propia Vida. Representa el momento en que las ideas dejan de ser pensamientos aislados para organizarse en una estructura con sentido.\n\nAl conectar Hod con Yesod, este sendero representa el paso desde la expresión hacia la consolidación de una base firme. Enseña que comunicar nuestras ideas no es suficiente; es necesario convertirlas en una forma consistente de vivir.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de transformar aquello que expresamos en hábitos y comportamientos coherentes. Hablar de nuestros valores, proyectos o aprendizajes tiene poco impacto si nuestra Vida cotidiana no los refleja.\n\nNos recuerda que la credibilidad nace cuando existe coherencia entre nuestras palabras y nuestras acciones.",
  pregunta: "¿Tu forma de vivir confirma aquello que dices creer?",
  une: [
    "Expresar una idea puede inspirar, pero solo las acciones la convierten en una realidad. Muchas veces hablamos de los cambios que queremos hacer sin llegar a incorporarlos en nuestra Vida diaria.",
    "Este sendero nos enseña que la coherencia comienza cuando dejamos de definirnos por lo que decimos y empezamos a hacerlo por aquello que practicamos de forma constante.",
  ],
  testTitulo: "¿Cómo transformas tus palabras en una forma de vivir?",
  test: [
    { texto: "Con frecuencia digo que algo es importante para mí, pero luego actúo de otra manera." },
    { texto: "Me resulta más fácil hablar de mis objetivos que trabajar en ellos." },
    { texto: "Mis acciones suelen reflejar aquello que comunico a los demás.", invertida: true },
    { texto: "Prometo cambios que después me cuesta mantener." },
    { texto: "Procuro que exista coherencia entre lo que pienso, digo y hago.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Existe una buena coherencia entre tus palabras y tus acciones. Lo que comunicas se refleja de forma natural en la manera en que eliges vivir." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "En ocasiones tus intenciones y tus acciones no avanzan al mismo ritmo. Fortalecer pequeños compromisos diarios aumentará tu coherencia." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una diferencia significativa entre aquello que expresas y la forma en que actúas. Tu crecimiento consiste en convertir tus palabras en hábitos concretos." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es descubrir que la verdadera transformación no ocurre cuando hablas del cambio, sino cuando comienzas a vivirlo de forma constante." },
  ],
  senales: [
    "Tus acciones respaldan aquello que dices que es importante.",
    "Haces promesas que luego no cumples, especialmente contigo mismo.",
    "Tomas pequeñas decisiones diarias alineadas con los valores que expresas.",
  ],
  umbral: "Tus acciones hablan con la misma claridad que tus palabras, y ambas reflejan la persona que has elegido ser.",
  integracion: "La coherencia comienza cuando mi Vida expresa con naturalidad aquello que mis palabras anuncian.",
  ilustracion:
    "Una figura camina y su sombra proyectada en el suelo repite fielmente cada uno de sus gestos, sin desajuste alguno. Sobre su cabeza, una luz clara la orienta como un norte. La imagen transmite que palabra y acción avanzan al unísono: lo que se dice y lo que se hace proyectan la misma forma.",
};

const SHIN: SenderoContenido = {
  num: 31,
  orden: 21,
  letra: "Shin",
  hebreo: "ש",
  palabraClave: "Transformación",
  titulo: "De la Expresión a la Manifestación",
  from: "hod",
  to: "malkuth",
  significadoTradicional:
    "Shin (ש) significa \"diente\" y está asociada al fuego transformador. En la tradición cabalística simboliza la energía que purifica, transforma e impulsa el cambio. No destruye por destruir; transforma lo potencial en una realidad nueva.\n\nAl conectar Hod con Malkhut, este sendero representa el paso desde la expresión consciente hacia la manifestación en el mundo. Enseña que aquello que cultivamos en nuestro interior termina reflejándose en nuestra realidad exterior.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de convertir una Vida coherente en resultados visibles. Cuando nuestros pensamientos, emociones, hábitos y acciones están alineados, la realidad comienza a reflejar esa transformación.\n\nNos recuerda que el cambio auténtico no consiste en aparentar ser alguien diferente, sino en permitir que nuestra Vida exprese de forma natural quiénes ya somos.",
  pregunta: "¿La Vida que has construido refleja realmente la persona en la que te estás convirtiendo?",
  une: [
    "Toda transformación comienza en el interior, pero alcanza su plenitud cuando se hace visible en nuestras decisiones, relaciones y forma de vivir. No basta con tener buenos hábitos si estos no terminan creando una realidad coherente.",
    "Este sendero nos enseña que la manifestación no es cuestión de suerte, sino la consecuencia de una identidad construida con constancia. Nuestra realidad exterior acaba siendo el reflejo de aquello que repetimos cada día.",
  ],
  testTitulo: "¿Cómo conviertes tu coherencia en una realidad visible?",
  test: [
    { texto: "Siento que la Vida que llevo no refleja la persona que quiero ser." },
    { texto: "Mis hábitos y decisiones no siempre producen los resultados que deseo." },
    { texto: "Percibo una relación clara entre mis acciones diarias y los resultados que obtengo.", invertida: true },
    { texto: "Espero que mi Vida cambie sin modificar de forma constante mis comportamientos." },
    { texto: "Siento que mi realidad refleja cada vez más mis valores y mis decisiones.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Existe una fuerte coherencia entre quién eres y la realidad que estás construyendo. Tus acciones generan resultados alineados con tus valores." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "Has iniciado un proceso de transformación, aunque todavía existen áreas donde tus resultados no reflejan plenamente tus esfuerzos." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una diferencia entre la persona que deseas ser y la realidad que estás construyendo. Tu crecimiento consiste en revisar qué hábitos necesitan fortalecerse." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es comprender que la realidad cambia cuando cambia la forma en que vivimos cada día. La manifestación comienza mucho antes de que aparezcan los resultados." },
  ],
  senales: [
    "Tus decisiones diarias construyen la Vida que realmente deseas.",
    "Esperas resultados distintos sin cambiar tus hábitos.",
    "Reconoces cómo tus pequeñas acciones están dando forma a tu realidad.",
  ],
  umbral: "La Vida que has construido se convierte en un reflejo natural de tus valores, tus hábitos y la persona que has elegido ser.",
  integracion: "La realidad que vivo hoy es el reflejo de las decisiones que elegí sostener cada día.",
  ilustracion:
    "Una llama serena asciende y, al hacerlo, va dando forma a un paisaje que se vuelve nítido y real a su alrededor: lo que antes era contorno de humo se transforma en tierra firme, casas y caminos. El fuego no arrasa; revela y consolida, mostrando cómo lo interior toma cuerpo en el mundo.",
};

const TAV: SenderoContenido = {
  num: 32,
  orden: 22,
  letra: "Tav",
  hebreo: "ת",
  palabraClave: "Manifestación",
  titulo: "De la Comprensión a la Manifestación",
  from: "yesod",
  to: "malkuth",
  significadoTradicional:
    "Tav (ת) es la última letra del alfabeto hebreo y significa \"marca\", \"sello\" o \"firma\". En la tradición cabalística simboliza la culminación de un proceso, la materialización de lo aprendido y la huella que dejamos en el mundo. Representa el momento en que una verdad deja de ser una posibilidad para convertirse en una realidad.\n\nAl conectar Yesod con Malkhut, este sendero simboliza el paso desde los fundamentos interiores hacia la manifestación concreta. Enseña que el conocimiento solo alcanza su propósito cuando se traduce en acciones que transforman la realidad.",
  traduccionPsicologica:
    "Este sendero representa la capacidad de convertir nuestras ideas, aprendizajes y valores en una forma visible de vivir. No basta con comprender quién queremos ser; el verdadero crecimiento ocurre cuando nuestras decisiones dejan una huella coherente en nuestra Vida y en nuestro entorno.\n\nNos recuerda que cada acción es una firma que revela nuestros valores, mucho más que nuestras palabras o nuestras intenciones.",
  pregunta: "¿La huella que dejas refleja realmente lo que dices valorar?",
  une: [
    "Comprender una verdad tiene poco impacto si nunca llega a expresarse en nuestras decisiones. Muchas personas acumulan conocimiento durante años, pero su Vida apenas cambia porque ese conocimiento nunca se convierte en acción.",
    "Este sendero representa la culminación del recorrido. Nos invita a dejar de medir nuestro crecimiento por lo que sabemos y empezar a medirlo por la huella que dejamos en el mundo a través de nuestras acciones.",
  ],
  testTitulo: "¿Cómo transformas tus aprendizajes en una realidad?",
  test: [
    { texto: "Con frecuencia sé lo que debería hacer, pero no lo llevo a la práctica." },
    { texto: "Mis acciones no siempre reflejan los valores que considero importantes." },
    { texto: "Procuro que mis decisiones diarias sean coherentes con lo que he aprendido.", invertida: true },
    { texto: "Me resulta más fácil aprender que cambiar mis comportamientos." },
    { texto: "Siento que la forma en que vivo refleja cada vez mejor quién soy.", invertida: true },
  ],
  interpretaciones: [
    { min: 0, max: 7, titulo: "Transición fluida", texto: "Has conseguido integrar tus aprendizajes en tu Vida cotidiana. Tus acciones reflejan con naturalidad tus valores y dejan una huella coherente." },
    { min: 8, max: 13, titulo: "Ligera resistencia", texto: "Comprendes el camino que quieres seguir, aunque todavía existen áreas donde tus acciones no reflejan plenamente esa comprensión." },
    { min: 14, max: 18, titulo: "Resistencia importante", texto: "Existe una distancia entre lo que sabes y la forma en que vives. Tu crecimiento consiste en convertir el conocimiento en decisiones concretas y sostenidas." },
    { min: 19, max: 25, titulo: "Aprendizaje prioritario", texto: "Uno de tus principales retos es descubrir que el verdadero aprendizaje no termina cuando comprendes una idea, sino cuando esa idea transforma la manera en que vives y la huella que dejas en el mundo." },
  ],
  senales: [
    "Tus decisiones reflejan realmente aquello que has aprendido.",
    "Actúas de acuerdo con tus valores incluso cuando nadie te observa.",
    "La huella que dejas en tus relaciones y proyectos coincide con la persona que quieres ser.",
  ],
  umbral: "Tu Vida se convierte en la expresión natural de todo lo que has aprendido durante el camino.",
  integracion: "Mi mayor aprendizaje no es lo que sé, sino la huella que dejo con la forma en que elijo vivir.",
  ilustracion:
    "Una mano presiona un sello sobre lacre cálido y deja una marca nítida y luminosa. Alrededor, el largo camino recorrido se ve al fondo como una senda que desemboca justo en esa huella. La imagen transmite culminación: todo lo aprendido queda por fin grabado, firme y visible, en el mundo.",
};

// Orden = numeración cabalística 11-32 (Aleph→Tav). from/to según los 22 senderos.
export const CABALA_SENDEROS: SenderoContenido[] = [
  ALEPH,
  BETH,
  GIMEL,
  DALETH,
  HE,
  VAV,
  ZAYIN,
  CHET,
  TET,
  YOD,
  KAF,
  LAMED,
  MEM,
  NUN,
  SAMEKH,
  AYIN,
  PE,
  TSADI,
  QOF,
  RESH,
  SHIN,
  TAV,
];

export const senderoPorNum = Object.fromEntries(
  CABALA_SENDEROS.map((s) => [s.num, s]),
) as Record<number, SenderoContenido>;

/** Suma del test aplicando la inversión (6 - r) a las preguntas invertidas. */
export function puntuacionSendero(s: SenderoContenido, respuestas: number[]): number {
  return s.test.reduce((acc, preg, i) => {
    const r = respuestas[i] ?? 0;
    if (r < 1) return acc;
    return acc + (preg.invertida ? 6 - r : r);
  }, 0);
}

export function senderoCompleto(s: SenderoContenido, respuestas?: number[]): boolean {
  return Array.isArray(respuestas) && respuestas.length === s.test.length && respuestas.every((v) => v >= 1 && v <= 5);
}

export function interpretacionSendero(s: SenderoContenido, total: number): SenderoInterpretacion | null {
  return s.interpretaciones.find((b) => total >= b.min && total <= b.max) ?? null;
}
