export type Celula = {
  id: string;
  nombre: string;
  foto: string;
  descripcion: string;
  /** Cómo cuidar esta célula concreta (segundo texto del popup). */
  cuidados?: string;
  /** Las 3 cosas clave que hace la célula (resumen de la descripción). Se
   *  muestran en cajas blancas al abrir la ficha, para aprenderla en 3-5 s. */
  claves?: string[];
};

// Lista plana de células (Fisiología). Fotos en /viñetas/fisiologia/celulas/.
export const celulas: Celula[] = [
  {
    id: "neuronas",
    claves: ["Transmiten impulsos eléctricos", "Se comunican con neurotransmisores", "Sostienen pensamiento y memoria"],
    nombre: "Neuronas",
    foto: "/viñetas/fisiologia/celulas/cerebro/neuronas.webp",
    descripcion:
      "Cuando una neurona se activa, se genera una corriente eléctrica en la que entra sodio al interior y sale potasio, permitiendo que el impulso eléctrico viaje a través de la célula. Creando así un pensamiento. Las neuronas se comunican entre sí mediante neurotransmisores, creando la red viva de todo lo que sentimos, pensamos y recordamos.",
    cuidados:
      "Cuídalas con buen sueño (durante el sueño profundo el cerebro se limpia y procesa mejor la información), ejercicio (les encanta el movimiento; favorece la neuroplasticidad) y evitando el exceso de alcohol (interfiere con la comunicación neuronal y puede dañarlas a largo plazo).",
  },
  {
    id: "astrocitos",
    claves: ["Nutren a las neuronas", "Mantienen la barrera sangre-cerebro", "Limpian los neurotransmisores"],
    nombre: "Astrocitos",
    foto: "/viñetas/fisiologia/celulas/cerebro/astrocitos.webp",
    descripcion:
      "Sostienen y protegen el ecosistema cerebral. Ayudan a mantener la barrera entre la sangre y el cerebro, nutren a las neuronas y limpian los neurotransmisores una vez han sido utilizados para que la comunicación pueda volver a comenzar en equilibrio.",
    cuidados:
      "Ayúdalas con agua con sal (es importante que las sustancias químicas tengan un equilibrio) y el sueño profundo (les ayuda a limpiar más a fondo).",
  },
  {
    id: "microglia",
    claves: ["Vigilancia inmune del cerebro", "Detectan restos y amenazas", "Limpian y reciclan el entorno"],
    nombre: "Microglía",
    foto: "/viñetas/fisiologia/celulas/cerebro/microglia.webp",
    descripcion:
      "Las guardianas inmunológicas del cerebro. Son capaces de detectar cuando hay algo que no pertenece al ecosistema cerebral —restos celulares, proteínas dañadas o posibles amenazas— y lo fagocitan para limpiar y reciclar el entorno neuronal.",
    cuidados:
      "Reduce la inflamación con descanso (porque pueden limpiar cuando duermes), manejo del estrés (el cortisol las puede llevar a sobrerreaccionar y no hacer bien su trabajo) y una alimentación antiinflamatoria (el cerebro es muy sensible a las señales que le llegan del colon a través del nervio vago).",
  },
  {
    id: "oligodendrocitos",
    claves: ["Producen mielina", "Aceleran la transmisión nerviosa", "Favorecen aprender y adaptarse"],
    nombre: "Oligodendrocitos",
    foto: "/viñetas/fisiologia/celulas/cerebro/oligodendrocitos.webp",
    descripcion:
      "Células encargadas de producir mielina, una capa que envuelve los axones de las neuronas y acelera enormemente la transmisión de información entre ellas. Son esenciales para la coordinación, el pensamiento, el aprendizaje y prácticamente cualquier función cerebral. También participan en la capacidad del cerebro para adaptarse y reorganizarse.",
    cuidados:
      "Favorece su función con grasas saludables (omega-3), vitamina B12 y buena salud metabólica.",
  },
  {
    id: "ependimarias",
    claves: ["Producen líquido cefalorraquídeo", "Nutren y protegen el cerebro", "Mantienen el equilibrio del entorno"],
    nombre: "Células ependimarias",
    foto: "/viñetas/fisiologia/celulas/cerebro/ependimarias.webp",
    descripcion:
      "Producen y movilizan el líquido cefalorraquídeo, el líquido que protege, nutre y permite el movimiento de los nutrientes y las células en el ecosistema cerebral. Debido a esto, mantienen el equilibrio del entorno donde viven las neuronas y la glía.",
    cuidados:
      "Para cuidarlas (cuidarte) no te olvides de beber agua.",
  },
  {
    id: "hepatocitos",
    claves: ["Desintoxican el cuerpo", "Transforman nutrientes en energía", "Producen bilis y proteínas"],
    nombre: "Hepatocitos",
    foto: "/viñetas/fisiologia/celulas/higado/hepatocitos.webp",
    descripcion:
      "Fundamentales. Todo lo que respiramos, comemos o bebemos pasa, de una forma u otra, por ellos. Se encargan de desintoxicar sustancias potencialmente dañinas y transformar nutrientes en energía utilizable. Metabolizan la glucosa y, dependiendo de tu movimiento y gasto energético, deciden si convertirla en ATP (energía inmediata), almacenarla como glucógeno o transformarla en grasa para reserva. También fabrican muchas proteínas y enzimas esenciales a partir de los aminoácidos de la dieta. Gestionan grasas y colesterol, fundamentales para construir membranas celulares y hormonas. Además, producen bilis, imprescindible para digerir y absorber correctamente las grasas y vitaminas liposolubles. Sin suficiente bilis, las grasas se absorben mal y pueden aparecer problemas digestivos, deficiencias vitamínicas y heces pálidas o grasosas.",
    cuidados:
      "Cuídalos evitando el alcohol (porque añade una carga tóxica enorme al sistema de desintoxicación), manteniendo una dieta rica en fibra y evitando los azúcares y grasas ultraprocesadas.",
  },
  {
    id: "kupffer",
    claves: ["Inmunidad del hígado", "Filtran la sangre del intestino", "Eliminan bacterias y toxinas"],
    nombre: "Células de Kupffer",
    foto: "/viñetas/fisiologia/celulas/higado/kupffer.webp",
    descripcion:
      "Las células inmunitarias del hígado. Filtran la sangre que llega desde el intestino y eliminan bacterias, toxinas y restos celulares antes de que circulen por el resto del cuerpo. Son una especie de centinelas silenciosos entre la digestión y el sistema inmune.",
    cuidados:
      "Se benefician de una buena salud intestinal y alimentos antiinflamatorios como la cúrcuma y el jengibre.",
  },
  {
    id: "estrelladas",
    claves: ["Almacenan vitamina A", "Reparan el tejido del hígado", "En exceso, crean fibrosis"],
    nombre: "Células estrelladas",
    foto: "/viñetas/fisiologia/celulas/higado/estrelladas.webp",
    descripcion:
      "Almacenan vitamina A y participan en la reparación del tejido hepático cuando existe daño. Cuando el hígado se lesiona de forma crónica, pueden activarse en exceso y producir fibrosis, formando cicatrices en el hígado.",
    cuidados:
      "Protégelas evitando daño hepático, el cual ocurre cuando se bebe alcohol, hay inflamación metabólica y acumulación excesiva de grasa hepática.",
  },

  // ── Páncreas ──
  {
    id: "celulas-beta",
    claves: ["Producen insulina", "Permiten usar la glucosa", "Regulan el azúcar en sangre"],
    nombre: "Células beta",
    foto: "/viñetas/fisiologia/celulas/pancreas/celulasbeta.webp",
    descripcion:
      "Producen insulina, la hormona que permite que las células absorban glucosa y la utilicen como energía. Cuando existe un exceso de grasa visceral, muchas células dejan de responder bien a la insulina (resistencia a la insulina), por lo que el páncreas intenta compensarlo produciendo cada vez más. Con el tiempo, este exceso favorece inflamación, daño vascular y arterias más rígidas y “pegajosas”, aumentando el riesgo metabólico y cardiovascular.",
    cuidados:
      "Cuídalas evitando picos constantes de azúcar, exceso de ultraprocesados y manteniendo movimiento físico regular.",
  },
  {
    id: "celulas-alfa",
    claves: ["Producen glucagón", "Se activan con azúcar baja", "Movilizan las reservas de energía"],
    nombre: "Células alfa",
    foto: "/viñetas/fisiologia/celulas/pancreas/alfa.webp",
    descripcion:
      "Producen glucagón, la hormona que se libera cuando hay baja glucosa en la sangre. El glucagón le indica al cuerpo que movilice reservas almacenadas, especialmente glucógeno y grasa, para transformarlas en energía utilizable. Por eso, cuando no comes durante un tiempo, el cuerpo comienza a utilizar parte de la energía acumulada del tejido adiposo.",
    cuidados:
      "Mantienen mejor su equilibrio con una alimentación estable, buen descanso y sensibilidad adecuada a la insulina.",
  },
  {
    id: "celulas-delta",
    claves: ["Producen somatostatina", "Freno hormonal inteligente", "Equilibran insulina y glucagón"],
    nombre: "Células delta",
    foto: "/viñetas/fisiologia/celulas/pancreas/celulasdelta.webp",
    descripcion:
      "Producen somatostatina, una hormona reguladora que actúa como un “freno inteligente”, ayudando a equilibrar la liberación de insulina, glucagón y otras hormonas digestivas para que el sistema no se descontrole.",
    cuidados:
      "Se benefician de una buena salud metabólica general, lo que quiere decir que es importante que dejes de comer cuando estás lleno.",
  },
  {
    id: "celulas-acinares",
    claves: ["Producen enzimas digestivas", "Digieren grasas y proteínas", "Descomponen los carbohidratos"],
    nombre: "Células acinares",
    foto: "/viñetas/fisiologia/celulas/pancreas/acinares.webp",
    descripcion:
      "Producen enzimas como amilasa, lipasa y proteasas para digerir carbohidratos, grasas y proteínas.",
  },
  {
    id: "celulas-ductales",
    claves: ["Producen bicarbonato", "Neutralizan el ácido gástrico", "Facilitan la digestión"],
    nombre: "Células ductales",
    foto: "/viñetas/fisiologia/celulas/pancreas/ductales.webp",
    descripcion:
      "Producen bicarbonato para neutralizar el ácido procedente del estómago y facilitar la digestión.",
  },
  {
    id: "celulas-pp",
    claves: ["Producen polipéptido pancreático", "Coordinan la actividad digestiva", "Ayudan a controlar el apetito"],
    nombre: "Células PP (gamma)",
    foto: "/viñetas/fisiologia/celulas/pancreas/gamma.webp",
    descripcion:
      "Producen polipéptido pancreático, una hormona que ayuda a coordinar la actividad digestiva, regulando la secreción de enzimas pancreáticas y la función de la vesícula biliar. También parece participar en el control del apetito.",
    cuidados:
      "Se benefician de hábitos alimentarios regulares (tener un horario de comidas).",
  },

  // ── Piel ──
  {
    id: "queratinocitos",
    claves: ["Forman la barrera de la piel", "Protegen del mundo exterior", "Se renuevan sin cesar"],
    nombre: "Queratinocitos",
    foto: "/viñetas/fisiologia/celulas/piel/queratinocitos.webp",
    descripcion:
      "La piel está formada por múltiples capas de queratinocitos, células que nacen en las capas más profundas y van ascendiendo lentamente hacia la superficie. Las primeras son células madre que se dividen constantemente para generar nuevas generaciones de queratinocitos, construyendo una barrera viva que protege el interior del cuerpo del mundo exterior. A medida que ascienden, se aplastan, se llenan de queratina y se unen cada vez más entre sí, formando una muralla flexible y resistente. Cuando completan su ciclo, mueren, se desprenden y se convierten en polvo.",
    cuidados:
      "Protégelos con buena hidratación, nutrición adecuada y evitando exceso de sol o agresiones constantes a la piel.",
  },
  {
    id: "melanocitos",
    claves: ["Producen melanina", "Dan color a la piel", "Protegen el ADN del sol"],
    nombre: "Melanocitos",
    foto: "/viñetas/fisiologia/celulas/piel/melanocitos.webp",
    descripcion:
      "Producen melanina, el pigmento que da color a la piel y ayuda a absorber parte de la radiación ultravioleta para proteger el ADN celular. Cuando reciben demasiada radiación solar, aumentan su actividad como mecanismo de defensa.",
    cuidados:
      "Usa protector solar y evita exposición solar excesiva para prevenir daño y sobreestimulación celular.",
  },
  {
    id: "langerhans",
    claves: ["Centinelas de la piel", "Detectan microbios y daño", "Activan la defensa cutánea"],
    nombre: "Células de Langerhans",
    foto: "/viñetas/fisiologia/celulas/piel/langerhans.webp",
    descripcion:
      "Detectan microorganismos, sustancias extrañas y señales de daño, activando respuestas defensivas para proteger la barrera cutánea.",
    cuidados:
      "Cuida la barrera de la piel evitando irritantes agresivos, inflamación crónica y exceso de productos que alteren tu equilibrio natural.",
  },

  // ── Intestino ──
  {
    id: "enterocitos",
    claves: ["Absorben los nutrientes", "Frontera del intestino", "Bloquean sustancias dañinas"],
    nombre: "Enterocitos",
    foto: "/viñetas/fisiologia/celulas/intestino/enterocitos.webp",
    descripcion:
      "Son las células que recubren el intestino y absorben los nutrientes de todo lo que comemos. Actúan como una frontera inteligente: dejan pasar hacia la sangre vitaminas, minerales, aminoácidos, grasas y glucosa, e intentan bloquear que entren sustancias potencialmente dañinas a la circulación. Son una de las interfaces más importantes entre el mundo exterior y el interior del cuerpo.",
    cuidados:
      "Cuídalos con fibra, nutrientes de calidad y evitando exceso de ultraprocesados e inflamación intestinal.",
  },
  {
    id: "caliciformes",
    claves: ["Producen el moco intestinal", "Escudo frente a bacterias", "Evitan la inflamación"],
    nombre: "Células caliciformes",
    foto: "/viñetas/fisiologia/celulas/intestino/caliciformes.webp",
    descripcion:
      "Producen el moco que recubre y protege el intestino. Esa capa mucosa funciona como un escudo vivo que mantiene a gran parte de las bacterias intestinales a una distancia segura de los enterocitos, ayudando a evitar inflamación y el paso de sustancias no deseadas hacia la sangre.",
    cuidados:
      "Se benefician de buena hidratación, fibra y una microbiota equilibrada.",
  },
  {
    id: "paneth",
    claves: ["Guardianas del intestino", "Liberan antimicrobianos", "Equilibran la microbiota"],
    nombre: "Células de Paneth",
    foto: "/viñetas/fisiologia/celulas/intestino/paneth.webp",
    descripcion:
      "Son guardianas del intestino. Liberan sustancias antimicrobianas que ayudan a controlar bacterias dañinas y a mantener el equilibrio del ecosistema intestinal cerca de las células madre intestinales.",
    cuidados:
      "Favorece su función con una microbiota sana (come kimchi, bífidus, miso, chucrut), sueño adecuado y baja inflamación crónica.",
  },
  {
    id: "enteroendocrinas",
    claves: ["Detectan los nutrientes", "Producen hormonas digestivas", "Puente intestino-cerebro"],
    nombre: "Células enteroendocrinas",
    foto: "/viñetas/fisiologia/celulas/intestino/enteroendocrinas.webp",
    descripcion:
      "Son células capaces de “sentir” los nutrientes que llegan al intestino y responder produciendo hormonas digestivas que regulan el hambre, la saciedad y el movimiento intestinal. Son una especie de puente químico entre el intestino y el cerebro.",
    cuidados:
      "Se equilibran con alimentación regular, ritmos circadianos estables y buena salud metabólica.",
  },

  // ── Músculo ──
  {
    id: "miocitos",
    claves: ["Contraen el músculo", "Hacen posible el movimiento", "Usan calcio para activarse"],
    nombre: "Fibra muscular (miocitos)",
    foto: "/viñetas/fisiologia/celulas/musculo/miocitos.webp",
    descripcion:
      "Son las células encargadas de la contracción muscular, lo que hace posible el movimiento del cuerpo. Están formadas por filamentos muy finos de actina y miosina, organizados de manera altamente ordenada, y utilizan el calcio como señal clave para activar la contracción. Cuando llega una señal nerviosa, se libera acetilcolina en la unión neuromuscular; esta genera un impulso eléctrico que desencadena la liberación de calcio dentro de la fibra muscular. Ese calcio permite que la actina y la miosina interactúen, produciendo la contracción.",
    cuidados:
      "Cuídalas con ejercicio regular, suficiente proteína y descanso adecuado para favorecer su reparación y adaptación.",
  },
  {
    id: "cardiomiocitos",
    claves: ["Músculo del corazón", "Laten de forma automática", "Mantienen la circulación"],
    nombre: "Cardiomiocitos",
    foto: "/viñetas/fisiologia/celulas/corazon/cardiomiocitos.webp",
    descripcion:
      "Son las células musculares del corazón, responsables de sus contracciones rítmicas y continuas que mantienen la circulación sanguínea. Funcionan de forma coordinada y automática, generando el latido que sostiene la Vida.",
    cuidados:
      "Se fortalecen con ejercicio cardiovascular y una buena regulación del estrés (medita).",
  },
  {
    id: "musculares-lisas",
    claves: ["Mueven los órganos internos", "Contracción involuntaria", "Regulan flujo y tono"],
    nombre: "Células musculares lisas",
    // .png y no .webp: la que hay en disco es PNG. La WebP del lote 1 se hizo
    // sobre la que estaba en la raíz de celulas/, y esta se repuso después
    // dentro de musculo/, así que la ruta apuntaba a un archivo inexistente.
    foto: "/viñetas/fisiologia/celulas/musculo/musculareslisas.webp",
    descripcion:
      "Controlan la contracción involuntaria de órganos internos como el intestino, los vasos sanguíneos y otras estructuras viscerales. Regulan el flujo, el movimiento y el tono de estos sistemas de forma continua y automática.",
    cuidados:
      "Se benefician de buena circulación, actividad física regular y un equilibrio general del sistema nervioso autónomo.",
  },

  // ── Hueso ──
  {
    id: "osteoblastos",
    claves: ["Construyen hueso nuevo", "Fabrican la matriz ósea", "Mineralizan el esqueleto"],
    nombre: "Osteoblastos",
    foto: "/viñetas/fisiologia/celulas/huesos/osteoblastos.webp",
    descripcion:
      "Son las células encargadas de la formación del hueso. Sintetizan la matriz ósea y facilitan la mineralización, construyendo tejido nuevo continuamente. Su actividad está influida por hormonas como los estrógenos, la testosterona, el cortisol y la vitamina D (que en realidad actúa como una hormona reguladora del metabolismo del calcio).",
    cuidados:
      "Se estimulan con vitamina D, suficiente calcio en la dieta y ejercicio de impacto o resistencia.",
  },
  {
    id: "osteoclastos",
    claves: ["Degradan el hueso viejo", "Permiten renovar el hueso", "Liberan calcio si hace falta"],
    nombre: "Osteoclastos",
    foto: "/viñetas/fisiologia/celulas/huesos/osteoclastos.webp",
    descripcion:
      "Son las células responsables de la reabsorción ósea, es decir, la degradación del hueso viejo para permitir que los osteoblastos construyan nuevo hueso. Este proceso es esencial y mantiene un esqueleto sano. Sin embargo, cuando existe estrés crónico o desequilibrios hormonales, la degradación puede superar a la formación. Además, si el calcio en sangre es bajo, el cuerpo puede recurrir al hueso como reserva para mantenerlo estable, lo que aumenta la actividad de los osteoclastos.",
    cuidados:
      "Su equilibrio depende de ejercicio, buena salud hormonal y niveles adecuados de nutrientes esenciales (el calcio debe mantenerse en rango normal bajo control médico, evitando suplementación innecesaria).",
  },
  {
    id: "osteocitos",
    claves: ["Sensores del hueso", "Detectan presión y carga", "Adaptan el hueso al esfuerzo"],
    nombre: "Osteocitos",
    foto: "/viñetas/fisiologia/celulas/huesos/osteocitos.webp",
    descripcion:
      "Son células óseas maduras derivadas de los osteoblastos. Viven dentro de la matriz ósea y forman una red de comunicación a través de canalículos, actuando como sensores mecánicos que detectan presión y carga sobre el hueso, permitiendo la adaptación a cargas pesadas.",
    cuidados:
      "El ejercicio regular, especialmente el de carga o impacto, mejora su señalización y mantiene el hueso fuerte y funcional.",
  },

  // ── Sangre e inmunidad ──
  {
    id: "eritrocitos",
    claves: ["Transportan oxígeno", "Llenos de hemoglobina", "Permiten producir energía"],
    nombre: "Eritrocitos",
    foto: "/viñetas/fisiologia/celulas/sangre/eritrocitos.webp",
    descripcion:
      "Transportan oxígeno desde los pulmones hacia todas las células del cuerpo, permitiendo que ocurra la respiración celular y la producción de energía (ATP). No contienen núcleo y están llenos de hemoglobina, una proteína que se une al oxígeno gracias al átomo de hierro que se encuentra en el centro de su grupo hemo, tiene cuatro grupos hemo, por lo que puede cargar con cuatro átomos de oxígeno. La vitamina B12 es esencial para su correcta formación en la médula ósea.",
    cuidados:
      "Se benefician de hierro adecuado, vitamina B12 y una buena salud metabólica general.",
  },
  {
    id: "neutrofilos",
    claves: ["Primeros ante la infección", "Fagocitan microorganismos", "Soldados que se sacrifican"],
    nombre: "Neutrófilos",
    foto: "/viñetas/fisiologia/celulas/sangre/neutrofilos.webp",
    descripcion:
      "Son células del sistema inmunitario innato, los primeros en llegar ante una infección. Fagocitan y destruyen microorganismos. Soldados suicidas, suelen sacrificarse para contener la amenaza.",
    cuidados:
      "Apóyalos con buen descanso, nutrición adecuada y un sistema inmune equilibrado.",
  },
  {
    id: "linfocitos-b",
    claves: ["Producen anticuerpos", "Reconocen antígenos", "Marcan patógenos para eliminarlos"],
    nombre: "Linfocitos B",
    foto: "/viñetas/fisiologia/celulas/sangre/bcells.webp",
    descripcion:
      "Son células del sistema inmunitario adaptativo encargadas de producir anticuerpos. Cuando detectan un antígeno específico (con ayuda de otras células inmunes), se activan y generan anticuerpos que se unen a los patógenos, marcándolos para su eliminación.",
    cuidados:
      "Se favorecen con exposición controlada a distintas enfermedades, buena nutrición y un sistema inmune bien regulado.",
  },
  {
    id: "linfocitos-t",
    claves: ["Coordinan la respuesta inmune", "Reconocen antígenos", "Destruyen células infectadas"],
    nombre: "Linfocitos T",
    foto: "/viñetas/fisiologia/celulas/sangre/tcells.webp",
    descripcion:
      "Son células clave del sistema inmunitario adaptativo. Las células dendríticas les presentan fragmentos de antígenos, y los linfocitos T reconocen si encajan con su receptor específico. Si hay coincidencia, se activan y coordinan la respuesta inmune, ayudando a activar linfocitos B o destruyendo células infectadas. La fluidez y funcionalidad de sus membranas depende en parte de la presencia de grasas insaturadas, que favorecen la comunicación celular.",
    cuidados:
      "Se apoyan con sueño profundo (que es cuando más actúan), control del estrés y buen equilibrio nutricional (grasas insaturadas y aminoácidos esenciales).",
  },
  {
    id: "macrofagos",
    claves: ["Fagocitan bacterias y restos", "Reciclan células muertas", "Evitan inflamación en el tejido"],
    nombre: "Macrófagos",
    foto: "/viñetas/fisiologia/celulas/sangre/macrofagos.webp",
    descripcion:
      "Son células inmunitarias que fagocitan bacterias, restos celulares y células dañadas. También realizan un papel esencial de reciclaje, eliminando células que han entrado en muerte programada (apoptosis) antes de que generen inflamación o daño en el tejido.",
    cuidados:
      "Se favorecen con una dieta antiinflamatoria rica en frutas, vegetales y omega-3.",
  },
  {
    id: "dendriticas",
    claves: ["Centinelas del sistema inmune", "Capturan al patógeno", "Activan a los linfocitos T"],
    nombre: "Células dendríticas",
    foto: "/viñetas/fisiologia/celulas/sangre/dendriticas.webp",
    descripcion:
      "Son células centinela del sistema inmunitario. Detectan moléculas extrañas, capturan muestras del patógeno y las presentan a los linfocitos T en los órganos linfoides, iniciando así la respuesta inmune adaptativa.",
    cuidados:
      "Su función se ve muy influida por la salud intestinal y el equilibrio de la microbiota.",
  },

  // ── Pulmón ──
  {
    id: "neumocitos-1",
    claves: ["Forman la pared del alvéolo", "Permiten el intercambio de gases", "Dejan pasar el oxígeno"],
    nombre: "Neumocitos tipo I",
    foto: "/viñetas/fisiologia/celulas/pulmones/neumocitos1.webp",
    descripcion:
      "Son las células que forman la mayor parte de la superficie de los alvéolos pulmonares y permiten el intercambio de gases. A través de su membrana extremadamente fina, el oxígeno pasa desde el aire de los pulmones hacia las células rojas de la sangre para su transporte. Además, en el intercambio, el dióxido de carbono sale de la sangre para ser expulsado.",
    cuidados:
      "Cuídalos con aire limpio, evitando el tabaco y la exposición a contaminantes.",
  },
  {
    id: "neumocitos-2",
    claves: ["Producen surfactante", "Evitan que el alvéolo colapse", "Reparan el pulmón"],
    nombre: "Neumocitos tipo II",
    foto: "/viñetas/fisiologia/celulas/pulmones/neumocitos2.webp",
    descripcion:
      "Producen surfactante pulmonar, una sustancia que reduce la tensión superficial dentro de los alvéolos, evitando que se colapsen al respirar y facilitando su expansión incluso con grandes cambios de volumen de aire. También participan en la reparación del tejido pulmonar cuando hay daño.",
    cuidados:
      "Se favorecen con buena salud respiratoria y ejercicio.",
  },
  {
    id: "macrofagos-alveolares",
    claves: ["Defensa del pulmón", "Eliminan polvo y microbios", "Limpian el aire que entra"],
    nombre: "Macrófagos alveolares",
    foto: "/viñetas/fisiologia/celulas/pulmones/pulmonesmacrofagos.webp",
    descripcion:
      "Son las células defensivas del pulmón. Eliminan partículas, polvo, microorganismos y toxinas que entran al sistema respiratorio con cada respiración. Cuando se ven sobrecargados, como ocurre con el humo del tabaco, su capacidad de limpieza disminuye y aumenta el riesgo de daño pulmonar e inflamación.",
    cuidados:
      "Se protegen evitando humo, contaminación y favoreciendo un entorno respiratorio limpio.",
  },

  // ── Riñón ──
  {
    id: "podocitos",
    claves: ["Filtran la sangre en el riñón", "Dejan pasar los desechos", "Retienen proteínas útiles"],
    nombre: "Podocitos",
    foto: "/viñetas/fisiologia/celulas/rinones/podocitos.webp",
    descripcion:
      "Son células especializadas que forman parte de la barrera de filtración del glomérulo renal. Regulan qué sustancias pueden pasar desde la sangre hacia el filtrado inicial de la orina, permitiendo el paso de desechos y reteniendo proteínas y células importantes.",
    cuidados:
      "Se cuidan con buena hidratación y evitando exceso crónico de sal y daño metabólico.",
  },
  {
    id: "celulas-tubulares",
    claves: ["Reabsorben agua y sales", "Recuperan nutrientes útiles", "Mantienen el equilibrio interno"],
    nombre: "Células tubulares",
    foto: "/viñetas/fisiologia/celulas/rinones/tubulares.webp",
    descripcion:
      "Forman los túbulos renales y son responsables de reabsorber agua, sales y nutrientes útiles desde el filtrado de la orina de vuelta a la sangre, además de secretar ciertas sustancias de desecho. Son clave para mantener el equilibrio interno del cuerpo.",
    cuidados:
      "Se benefician de hidratación constante, buena presión arterial y equilibrio electrolítico.",
  },

  // ── Tejido conectivo ──
  {
    id: "fibroblastos",
    claves: ["Producen colágeno", "Dan estructura y elasticidad", "Reparan los tejidos"],
    nombre: "Fibroblastos",
    foto: "/viñetas/fisiologia/celulas/conectivo/fibroblastos.webp",
    descripcion:
      "Son células encargadas de producir y organizar la matriz extracelular, especialmente el colágeno, que aporta estructura, resistencia y elasticidad a tejidos como piel, tendones, ligamentos, vasos sanguíneos, cartílago y otros órganos conectivos. También participan en la reparación de tejidos cuando hay daño.",
    cuidados:
      "Se favorecen con vitamina C, suficiente proteína, péptidos de colágeno (les influencian para que generen más colágeno ellas mismas) y un estilo de Vida que reduzca la inflamación crónica.",
  },
  {
    id: "adipocitos-blancos",
    claves: ["Almacenan energía", "Liberan leptina", "Informan al cerebro de las reservas"],
    nombre: "Adipocitos blancos",
    foto: "/viñetas/fisiologia/celulas/grasa/adipocitos.webp",
    descripcion:
      "Son las células que almacenan energía en forma de triglicéridos y funcionan como un órgano endocrino activo. Liberan leptina, una hormona que informa al cerebro sobre el estado de reservas energéticas y la saciedad.",
    cuidados:
      "Se equilibran con balance calórico (escucha a tu cuerpo, sabrás cuándo estás lleno), actividad física regular y buena sensibilidad metabólica.",
  },
  {
    id: "adipocitos-marrones",
    claves: ["Queman grasa como combustible", "Generan calor", "Mantienen la temperatura"],
    nombre: "Adipocitos marrones",
    foto: "/viñetas/fisiologia/celulas/grasa/marron.webp",
    descripcion:
      "Almacenan energía en forma de triglicéridos, aunque en menor cantidad que los adipocitos blancos. Poseen numerosas mitocondrias, lo que les permite utilizar la grasa como combustible y generar calor (termogénesis). Son fundamentales para mantener la temperatura corporal y permiten la supervivencia de algunos mamíferos durante la hibernación.",
    cuidados:
      "Cuídalos con exposición regular al frío (como duchas o baños fríos), actividad física frecuente y un buen descanso.",
  },
  {
    id: "endoteliales",
    claves: ["Recubren los vasos sanguíneos", "Regulan flujo y coagulación", "Clave para el corazón"],
    nombre: "Células endoteliales",
    foto: "/viñetas/fisiologia/celulas/piel/endoteliales.webp",
    descripcion:
      "Recubren el interior de los vasos sanguíneos formando una barrera dinámica entre la sangre y los tejidos. Regulan el flujo sanguíneo, la coagulación, la inflamación y el intercambio de sustancias, siendo esenciales para la salud cardiovascular.",
    cuidados:
      "Se benefician enormemente del ejercicio cardiovascular, buena alimentación y con unos niveles de LDL y cortisol bajos.",
  },

  // ── Sistema nervioso (nuevas) ──
  {
    id: "endotelial-cerebral",
    claves: ["Forman la barrera hematoencefálica", "Deciden qué entra al cerebro", "Protegen a las neuronas"],
    nombre: "Célula endotelial cerebral",
    foto: "/viñetas/fisiologia/celulas/cerebro/endotelialcerebral.webp",
    descripcion:
      "Recubren los vasos sanguíneos del cerebro y forman la barrera hematoencefálica: una frontera extraordinariamente selectiva que decide qué entra y qué no al tejido nervioso. Unidas entre sí de forma muy estrecha, protegen a las neuronas de toxinas, patógenos y cambios bruscos de la sangre, mientras dejan pasar el oxígeno y los nutrientes esenciales.",
    cuidados:
      "Se benefician del ejercicio, el control de la tensión arterial y una dieta antiinflamatoria que cuide los vasos.",
  },
  {
    id: "pericito",
    claves: ["Abrazan los capilares", "Regulan el flujo de sangre", "Guardan la microcirculación"],
    nombre: "Pericito",
    foto: "/viñetas/fisiologia/celulas/cerebro/pericito.webp",
    descripcion:
      "Abrazan los capilares más pequeños envolviéndolos por fuera. Regulan el flujo de sangre ajustando el diámetro del capilar y participan en el mantenimiento de la barrera hematoencefálica y en la reparación de los vasos. Son guardianes silenciosos de la microcirculación.",
    cuidados:
      "Se cuidan con buena salud vascular: ejercicio, azúcar en sangre estable y evitar el tabaco.",
  },
  {
    id: "celula-madre-neural",
    claves: ["Generan nuevas neuronas", "Neurogénesis de por Vida", "Apoyan aprendizaje y memoria"],
    nombre: "Célula madre neural",
    foto: "/viñetas/fisiologia/celulas/cerebro/madreneural.webp",
    descripcion:
      "Son las células capaces de generar nuevas neuronas y células gliales. Aunque gran parte del cerebro se forma antes de nacer, en algunas zonas siguen produciendo neuronas durante toda la Vida (neurogénesis), participando en el aprendizaje y la memoria.",
    cuidados:
      "Favorece la neurogénesis con ejercicio, aprendizaje continuo, buen sueño y manejo del estrés.",
  },

  // ── Sistema respiratorio (nuevas) ──
  {
    id: "celula-ciliada",
    claves: ["Cubiertas de cilios", "Arrastran el moco hacia arriba", "Mantienen limpios los pulmones"],
    nombre: "Célula ciliada",
    foto: "/viñetas/fisiologia/celulas/pulmones/ciliada.webp",
    descripcion:
      "Recubren las vías respiratorias y están cubiertas de cilios, diminutos “pelillos” que se mueven de forma coordinada como un campo de trigo al viento. Con ese movimiento arrastran hacia arriba el moco cargado de polvo, partículas y microbios para expulsarlo, manteniendo limpios los pulmones.",
    cuidados:
      "Protégelas evitando el humo del tabaco (que paraliza los cilios) y respirando aire limpio y bien hidratado.",
  },
  {
    id: "celula-club",
    claves: ["Detoxifican el aire inhalado", "Defienden de la inflamación", "Regeneran el epitelio"],
    nombre: "Célula club (Clara)",
    foto: "/viñetas/fisiologia/celulas/pulmones/club.webp",
    descripcion:
      "Viven en las vías respiratorias pequeñas. Secretan sustancias protectoras que ayudan a detoxificar el aire inhalado, defienden frente a la inflamación y participan en la regeneración del epitelio respiratorio cuando se daña.",
    cuidados:
      "Se benefician de un entorno respiratorio limpio y de evitar contaminantes y humo.",
  },

  // ── Sistema cardiovascular (nuevas) ──
  {
    id: "marcapasos",
    claves: ["Marcan el ritmo del corazón", "Generan el impulso del latido", "Coordinan la contracción"],
    nombre: "Célula marcapasos (nodo sinusal)",
    foto: "/viñetas/fisiologia/celulas/corazon/marcapasos.webp",
    descripcion:
      "Son las células que marcan el ritmo del corazón. Generan de forma espontánea el impulso eléctrico que inicia cada latido y lo hacen sin necesidad de una orden externa. Ese impulso se propaga por todo el corazón y coordina la contracción, sosteniendo el pulso de la Vida.",
    cuidados:
      "Se equilibran con buena forma cardiovascular, descanso y regulación del sistema nervioso (respira, medita).",
  },
  {
    id: "purkinje",
    claves: ["Conducción eléctrica rápida", "Llevan el impulso a los ventrículos", "Bombeo fuerte y coordinado"],
    nombre: "Célula de Purkinje",
    foto: "/viñetas/fisiologia/celulas/corazon/purkinje.webp",
    descripcion:
      "Forman una red de conducción rápida que lleva el impulso eléctrico hasta las paredes de los ventrículos del corazón. Gracias a ellas, la contracción del músculo cardíaco es coordinada y potente, permitiendo que la sangre se bombee con fuerza en cada latido.",
    cuidados:
      "Dependen de un corazón sano: ejercicio, buen equilibrio de electrolitos y control del estrés.",
  },

  // ── Sangre e inmunidad (nuevas) ──
  {
    id: "plaquetas",
    claves: ["Fragmentos de un megacariocito", "Forman el tapón de una herida", "Activan la coagulación"],
    nombre: "Plaquetas",
    foto: "/viñetas/fisiologia/celulas/sangre/plaquetas.webp",
    descripcion:
      "No son células completas, sino fragmentos celulares: por eso no tienen núcleo. Nacen de una célula gigante que vive en la médula ósea, el megacariocito, que extiende unas prolongaciones larguísimas y ramificadas llamadas proplaquetas —como tentáculos— e introduce sus puntas dentro de los vasos sanguíneos de la propia médula. El flujo de la sangre va rompiendo y desprendiendo esas puntas, y cada fragmento que se libera a la circulación es una plaqueta. Un solo megacariocito puede producir entre 1.000 y 3.000 antes de agotarse y desaparecer. Ya en la sangre, vigilan la integridad de los vasos sanguíneos: cuando hay una herida acuden rápidamente, se agrupan y forman un tapón inicial que detiene el sangrado, activando después la cascada de coagulación para sellar la lesión. Como no tienen núcleo tampoco pueden repararse, así que viven entre 7 y 10 días y se reponen sin descanso.",
    cuidados:
      "Se benefician de buena hidratación, vitamina K y una alimentación equilibrada.",
  },
  {
    id: "eosinofilos",
    claves: ["Defienden de parásitos", "Participan en las alergias", "Destruyen amenazas grandes"],
    nombre: "Eosinófilos",
    foto: "/viñetas/fisiologia/celulas/sangre/eosinofilos.webp",
    descripcion:
      "Son células del sistema inmunitario especializadas en defender frente a parásitos y en participar en las reacciones alérgicas. Liberan sustancias potentes que destruyen amenazas grandes que no pueden fagocitarse.",
    cuidados:
      "Se equilibran con un sistema inmune sano y evitando la inflamación alérgica crónica.",
  },
  {
    id: "basofilos",
    claves: ["Liberan histamina", "Desencadenan la inflamación", "Atraen otras defensas"],
    nombre: "Basófilos",
    foto: "/viñetas/fisiologia/celulas/sangre/basofilos.webp",
    descripcion:
      "Son células inmunitarias que liberan histamina y otras sustancias que desencadenan la respuesta inflamatoria y alérgica. Ayudan a atraer a otras células defensivas hacia la zona donde hay una amenaza.",
    cuidados:
      "Se benefician de un sistema inmune regulado y de evitar desencadenantes alérgicos innecesarios.",
  },
  {
    id: "monocitos",
    claves: ["Reserva móvil del sistema inmune", "Migran a los tejidos", "Se vuelven macrófagos"],
    nombre: "Monocitos",
    foto: "/viñetas/fisiologia/celulas/sangre/monocitos.webp",
    descripcion:
      "Circulan por la sangre como reserva móvil del sistema inmune. Cuando detectan una infección o daño, migran a los tejidos y se transforman en macrófagos o células dendríticas, fagocitando amenazas y activando la respuesta inmune.",
    cuidados:
      "Se apoyan con buen descanso, nutrición adecuada y una dieta antiinflamatoria.",
  },

  // ── Sistema digestivo · Estómago (nuevas) ──
  {
    id: "parietal",
    claves: ["Producen ácido gástrico", "Descomponen los alimentos", "Permiten absorber la B12"],
    nombre: "Célula parietal",
    foto: "/viñetas/fisiologia/celulas/estomago/parietal.webp",
    descripcion:
      "Producen el ácido clorhídrico del estómago, que ayuda a descomponer los alimentos y a eliminar microorganismos. También fabrican el factor intrínseco, imprescindible para absorber la vitamina B12 más adelante en el intestino.",
    cuidados:
      "Se cuidan con horarios de comida regulares, control del estrés y evitando el abuso de antiácidos sin necesidad.",
  },
  {
    id: "principal",
    claves: ["Secretan pepsinógeno", "Se activa como pepsina", "Empiezan a digerir proteínas"],
    nombre: "Célula principal",
    foto: "/viñetas/fisiologia/celulas/estomago/principal.webp",
    descripcion:
      "Secretan pepsinógeno, que en contacto con el ácido del estómago se transforma en pepsina, la enzima que comienza a digerir las proteínas de los alimentos.",
    cuidados:
      "Se benefician de comer con calma y masticar bien para facilitar la digestión.",
  },
  {
    id: "mucosa-gastrica",
    claves: ["Producen moco protector", "Escudo frente al ácido", "Protegen la pared del estómago"],
    nombre: "Célula mucosa gástrica",
    foto: "/viñetas/fisiologia/celulas/estomago/mucosagastrica.webp",
    descripcion:
      "Producen una capa de moco y bicarbonato que recubre el estómago y lo protege de su propio ácido. Sin este escudo, el ácido dañaría la pared gástrica.",
    cuidados:
      "Protégelas evitando el exceso de alcohol, tabaco y antiinflamatorios que debilitan la capa protectora.",
  },
  {
    id: "enteroendocrinas-gastricas",
    claves: ["Detectan lo que llega al estómago", "Producen gastrina", "Regulan la secreción de ácido"],
    nombre: "Célula enteroendocrina gástrica",
    foto: "/viñetas/fisiologia/celulas/estomago/enteroendocrinasgastricas.webp",
    descripcion:
      "“Sienten” lo que llega al estómago y responden produciendo hormonas como la gastrina, que regula la secreción de ácido y coordina la actividad digestiva con el resto del cuerpo.",
    cuidados:
      "Se equilibran con una alimentación regular y ritmos de comida estables.",
  },

  // ── Sistema digestivo · Intestino (nueva) ──
  {
    id: "celula-madre-intestinal",
    claves: ["Renuevan el intestino", "Se dividen sin descanso", "Mantienen la frontera joven"],
    nombre: "Célula madre intestinal",
    foto: "/viñetas/fisiologia/celulas/intestino/madreintestinal.webp",
    descripcion:
      "Viven en el fondo de las criptas intestinales y se dividen sin descanso para renovar por completo el revestimiento del intestino cada pocos días. Gracias a ellas, la frontera intestinal se mantiene siempre joven y funcional.",
    cuidados:
      "Se favorecen con una microbiota sana, fibra y baja inflamación intestinal.",
  },

  // ── Tiroides (nuevas) ──
  {
    id: "tirocito",
    claves: ["Producen hormonas tiroideas", "Regulan el metabolismo", "Usan yodo para fabricarlas"],
    nombre: "Tirocito",
    foto: "/viñetas/fisiologia/celulas/tiroides/tirocito.webp",
    descripcion:
      "Son las células principales de la tiroides. Producen las hormonas tiroideas (T3 y T4) a partir de yodo, hormonas que regulan el metabolismo de todo el cuerpo: la velocidad a la que quemamos energía, la temperatura, el ritmo cardíaco y hasta el estado de ánimo.",
    cuidados:
      "Se benefician de un aporte adecuado de yodo y selenio, y de un buen equilibrio del estrés.",
  },
  {
    id: "celula-c",
    claves: ["Producen calcitonina", "Bajan el calcio en sangre", "Lo depositan en el hueso"],
    nombre: "Célula C (parafolicular)",
    foto: "/viñetas/fisiologia/celulas/tiroides/celulac.webp",
    descripcion:
      "Producen calcitonina, una hormona que ayuda a bajar el nivel de calcio en la sangre cuando está demasiado alto, favoreciendo su depósito en el hueso. Participan en el delicado equilibrio del calcio del cuerpo.",
    cuidados:
      "Se apoyan con una buena salud ósea y niveles equilibrados de calcio y vitamina D.",
  },

  // ── Riñón (nuevas) ──
  {
    id: "tubulo-proximal",
    claves: ["Primeras en filtrar la orina", "Recuperan agua y glucosa", "Devuelven lo útil a la sangre"],
    nombre: "Célula del túbulo proximal",
    foto: "/viñetas/fisiologia/celulas/rinones/tubuloproximal.webp",
    descripcion:
      "Son las primeras en trabajar sobre el filtrado que sale del glomérulo. Recuperan la mayor parte del agua, la glucosa, los aminoácidos y las sales útiles, devolviéndolos a la sangre para que no se pierdan por la orina.",
    cuidados:
      "Se cuidan con buena hidratación, azúcar en sangre estable y evitando la tensión arterial alta.",
  },
  {
    id: "asa-henle",
    claves: ["Concentran la orina", "Ahorran agua", "Equilibran los líquidos"],
    nombre: "Célula del asa de Henle",
    foto: "/viñetas/fisiologia/celulas/rinones/asahenle.webp",
    descripcion:
      "Crean un gradiente de concentración de sales dentro del riñón que permite concentrar la orina y ahorrar agua cuando el cuerpo la necesita. Son clave para mantener el equilibrio de líquidos.",
    cuidados:
      "Se benefician de una hidratación constante y de un consumo moderado de sal.",
  },
  {
    id: "tubulo-distal",
    claves: ["Ajuste fino del filtrado", "Regulan sal, agua y potasio", "Afinan la tensión arterial"],
    nombre: "Célula del túbulo distal",
    foto: "/viñetas/fisiologia/celulas/rinones/tubulodistal.webp",
    descripcion:
      "Realizan el ajuste fino del filtrado: bajo el control de hormonas como la aldosterona, deciden cuánta sal y agua reabsorber y cuánto potasio eliminar, afinando el equilibrio interno y la tensión arterial.",
    cuidados:
      "Se apoyan con equilibrio electrolítico, hidratación y buena regulación hormonal.",
  },

  // ── Músculo (nueva) ──
  {
    id: "satelite",
    claves: ["Células madre del músculo", "Reparan las fibras", "Hacen crecer el músculo"],
    nombre: "Célula satélite",
    foto: "/viñetas/fisiologia/celulas/musculo/satelite.webp",
    descripcion:
      "Son las células madre del músculo. Descansan junto a las fibras musculares y, cuando el músculo se daña o se somete a esfuerzo, se activan para repararlo y hacerlo crecer. Son la razón por la que el músculo se fortalece con el entrenamiento.",
    cuidados:
      "Se activan con ejercicio de fuerza, suficiente proteína y buen descanso.",
  },

  // ── Esqueleto (nueva) ──
  {
    id: "condrocito",
    claves: ["Células del cartílago", "Amortiguan las articulaciones", "Se reparan con dificultad"],
    nombre: "Condrocito",
    foto: "/viñetas/fisiologia/celulas/huesos/condrocito.webp",
    descripcion:
      "Son las células del cartílago. Fabrican y mantienen la matriz flexible y resistente que recubre las articulaciones y amortigua el roce entre los huesos. El cartílago se nutre lentamente y con poca sangre, por lo que se repara con dificultad.",
    cuidados:
      "Se benefician del movimiento suave y regular, un peso saludable y una buena hidratación de las articulaciones.",
  },

  // ── Piel (nueva) ──
  {
    id: "merkel",
    claves: ["Receptores del tacto", "Detectan la presión suave", "Perciben texturas finas"],
    nombre: "Célula de Merkel",
    foto: "/viñetas/fisiologia/celulas/piel/merkel.webp",
    descripcion:
      "Son receptores del tacto situados en las capas profundas de la piel, sobre todo en zonas muy sensibles como las yemas de los dedos. Detectan la presión suave y los detalles finos de las texturas, conectando la piel con el sistema nervioso.",
    cuidados:
      "Se mantienen sanas cuidando la piel y el sistema nervioso: buena nutrición, hidratación y descanso.",
  },

  // ── Tejido conectivo (nueva) ──
  {
    id: "mastocito",
    claves: ["Centinelas del tejido", "Almacenan histamina", "Protagonistas de las alergias"],
    nombre: "Mastocito",
    foto: "/viñetas/fisiologia/celulas/conectivo/mastocito.webp",
    descripcion:
      "Son centinelas del tejido conectivo. Almacenan histamina y otras sustancias que liberan ante una amenaza o un alérgeno, desencadenando la inflamación y atrayendo a otras células inmunes. Son protagonistas de las reacciones alérgicas.",
    cuidados:
      "Se equilibran evitando desencadenantes alérgicos y manteniendo baja la inflamación crónica.",
  },

  // ── Lengua (gusto) ──
  {
    id: "gustativa-tipo2",
    claves: ["Detectan dulce, amargo y umami", "Reconocen las moléculas del sabor", "Avisan al nervio del gusto"],
    nombre: "Célula gustativa (tipo II)",
    foto: "/viñetas/fisiologia/celulas/lengua/gustativatipo2.webp",
    descripcion:
      "Son las receptoras del dulce, el amargo y el umami. En su membrana llevan receptores acoplados a proteínas G que reconocen las moléculas del sabor; al activarse, liberan ATP como mensajero para avisar a las fibras del nervio del gusto, que llevan la señal hasta el cerebro. Viven dentro de los botones gustativos, apretadas como los gajos de una naranja.",
    cuidados:
      "Cuídalas evitando el tabaco y el exceso de alimentos muy calientes o irritantes, manteniendo una buena higiene bucal y un aporte adecuado de zinc, que ayuda a conservar el sentido del gusto.",
  },
  {
    id: "gustativa-tipo3",
    claves: ["Detectan el sabor ácido", "Forman sinapsis con el nervio", "Afinan la percepción del sabor"],
    nombre: "Célula gustativa ácida (tipo III)",
    foto: "/viñetas/fisiologia/celulas/lengua/gustativatipo3.webp",
    descripcion:
      "Son las receptoras del sabor ácido y las únicas del botón gustativo que forman sinapsis clásicas con las fibras nerviosas, liberando serotonina y otros neurotransmisores. Además integran las señales de sus células vecinas, afinando la percepción final del sabor.",
    cuidados:
      "Se protegen moderando los alimentos y bebidas muy ácidos, que con el tiempo pueden irritar la mucosa, y cuidando la salud bucal general.",
  },
  {
    id: "soporte-gusto",
    claves: ["La glía del gusto", "Sostienen a las receptoras", "Limpian tras cada señal"],
    nombre: "Célula de soporte (tipo I)",
    foto: "/viñetas/fisiologia/celulas/lengua/soportegusto.webp",
    descripcion:
      "Son la glía del gusto: sostienen y envuelven a las células receptoras, mantienen el equilibrio químico a su alrededor y limpian los neurotransmisores tras cada señal, igual que los astrocitos hacen con las neuronas. Se cree que también participan en la detección del sabor salado. Se las llama también células receptoras tipo I, y ese mismo nombre reaparece en otro rincón del cuerpo con un papel completamente distinto: las células glómicas de la carótida, que tienes justo en la tarjeta de al lado.",
    cuidados:
      "Se benefician de una buena hidratación y de una mucosa bucal sana, sin irritantes constantes.",
  },
  {
    id: "glomica-tipo1",
    claves: ["Los sensores de oxígeno", "Están en la carótida, no en la lengua", "Te hacen jadear en altitud"],
    nombre: "Célula glómica (tipo I)",
    foto: "/viñetas/fisiologia/celulas/lengua/glomica.webp",
    descripcion:
      "Comparten nombre con las células tipo I del gusto, pero viven en otro sitio y tienen otro oficio: están en el cuerpo carotídeo, un nódulo del tamaño de un grano de arroz situado en el cuello, donde la carótida se bifurca, bañado por la sangre que sube al cerebro. Son los sensores de oxígeno del organismo. Cuando el oxígeno de la sangre baja, cierran unos canales de su membrana, se activan y liberan neurotransmisores que excitan al nervio que va al tronco cerebral; en segundos, este ordena respirar más rápido y más profundo y acelera el corazón. Es lo que te hace jadear al subir a mucha altitud. El nombre, curiosamente, está cruzado: en el botón gustativo la tipo I es la célula de apoyo, mientras que en el cuerpo carotídeo la tipo I es la protagonista y las de apoyo son las tipo II. Y un detalle revelador de cómo funcionan: miden el oxígeno disuelto en el plasma, no el que llevan los glóbulos rojos. Por eso, en una intoxicación por monóxido de carbono, estas células no se enteran de nada y la persona no siente que le falte el aire.",
    cuidados:
      "No se cuidan de forma directa, pero sí se les puede dar tregua: no fumar y tratar la apnea del sueño, porque las bajadas repetidas de oxígeno durante la noche las mantienen sobreexcitadas y eso contribuye a la tensión alta.",
  },
  {
    id: "basal-gusto",
    claves: ["Madre del gusto", "Renuevan el sabor cada semana", "Recuperan el gusto tras quemarte"],
    nombre: "Célula basal (madre gustativa)",
    foto: "/viñetas/fisiologia/celulas/lengua/basalgusto.webp",
    descripcion:
      "Son las células madre de los botones gustativos. Se dividen sin descanso para reemplazar a las células del gusto, que se renuevan por completo cada una o dos semanas. Gracias a ellas recuperas el sentido del sabor después de quemarte la lengua con algo caliente.",
    cuidados:
      "Favorece su renovación con buena nutrición (proteína y zinc), evitando el tabaco y las agresiones repetidas a la lengua.",
  },

  // ── Bazo ──
  {
    id: "macrofago-esplenico",
    claves: ["Filtran la sangre en el bazo", "Retiran glóbulos rojos viejos", "Reciclan el hierro"],
    nombre: "Macrófago esplénico (pulpa roja)",
    foto: "/viñetas/fisiologia/celulas/bazo/macrofagoesplenico.webp",
    descripcion:
      "Viven en la pulpa roja del bazo, el gran filtro de la sangre. Reconocen los glóbulos rojos viejos o dañados —que ya no logran pasar por los estrechos conductos del bazo— y los fagocitan, reciclando su hierro para fabricar hemoglobina nueva. También retiran bacterias y restos de la sangre que circula por ellos.",
    cuidados:
      "Se benefician de una buena salud general y de niveles adecuados de hierro; el bazo trabaja mejor con una sangre y un sistema inmune equilibrados.",
  },
  {
    id: "pulpa-blanca",
    claves: ["Cuartel inmune del bazo", "Vigilan la sangre", "Fabrican anticuerpos"],
    nombre: "Linfocitos de la pulpa blanca",
    foto: "/viñetas/fisiologia/celulas/bazo/pulpablanca.webp",
    descripcion:
      "En la pulpa blanca del bazo se organizan los linfocitos B y T alrededor de las arterias, vigilando la sangre en busca de microorganismos. Cuando detectan una amenaza que viaja por el torrente sanguíneo, activan la respuesta inmune y fabrican anticuerpos. Es el cuartel defensivo conectado directamente a la sangre.",
    cuidados:
      "Se apoyan con buen descanso, nutrición adecuada y un sistema inmune equilibrado.",
  },

  // ── Vesícula biliar ──
  {
    id: "colangiocito-vesicula",
    claves: ["Recubren la vesícula", "Concentran la bilis", "Absorben agua y sales"],
    nombre: "Célula epitelial (colangiocito)",
    foto: "/viñetas/fisiologia/celulas/vesicula/colangiocito.webp",
    descripcion:
      "Recubren el interior de la vesícula biliar. Su trabajo es concentrar la bilis que llega del hígado: absorben agua y sales del líquido biliar y las devuelven a la sangre, de modo que la bilis se vuelve mucho más concentrada mientras se guarda entre comidas. Están cubiertas de microvellosidades para absorber mejor.",
    cuidados:
      "Se benefician de comidas regulares que vacíen la vesícula y eviten que la bilis se estanque, buena hidratación y grasas saludables.",
  },
  {
    id: "muscular-vesicula",
    claves: ["Músculo de la vesícula", "Responden a la CCK", "Exprimen la bilis al comer"],
    nombre: "Célula muscular lisa (vesícula)",
    foto: "/viñetas/fisiologia/celulas/vesicula/muscularvesicula.webp",
    descripcion:
      "Forman la capa muscular de la pared de la vesícula. Cuando comes —sobre todo grasa—, el intestino libera la hormona colecistoquinina (CCK), que ordena a estas células contraerse y exprimir la vesícula para lanzar la bilis hacia el intestino, donde ayudará a digerir las grasas.",
    cuidados:
      "Se mantienen activas con comidas regulares y grasas saludables; los ayunos muy largos o las dietas muy bajas en grasa hacen que la vesícula se vacíe poco.",
  },
];
