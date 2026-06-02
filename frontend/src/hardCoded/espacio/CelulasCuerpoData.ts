export type Celula = {
  id: string;
  nombre: string;
  foto: string;
  descripcion: string;
  /** Cómo cuidar esta célula concreta (segundo texto del popup). */
  cuidados?: string;
};

// Lista plana de células (Fisiología). Fotos en /viñetas/fisiologia/celulas/.
export const celulas: Celula[] = [
  {
    id: "neuronas",
    nombre: "Neuronas",
    foto: "/viñetas/fisiologia/celulas/neuronas.png",
    descripcion:
      "Las neuronas manifiestan en lo tangible nuestros pensamientos. Cuando una neurona se activa, se genera una corriente eléctrica en la que entra sodio al interior y sale potasio, permitiendo que el impulso eléctrico viaje a través de la célula. Las neuronas se comunican entre sí mediante neurotransmisores, creando la red viva de todo lo que sentimos, pensamos y recordamos.",
    cuidados:
      "Cuídalas con buen sueño (durante el sueño profundo el cerebro se limpia y procesa mejor la información), ejercicio (les encanta el movimiento; favorece la neuroplasticidad) y evitando el exceso de alcohol (interfiere con la comunicación neuronal y puede dañarlas a largo plazo).",
  },
  {
    id: "astrocitos",
    nombre: "Astrocitos",
    foto: "/viñetas/fisiologia/celulas/astrocitos.png",
    descripcion:
      "Sostienen y protegen el ecosistema cerebral. Ayudan a mantener la barrera entre la sangre y el cerebro, nutren a las neuronas y limpian los neurotransmisores una vez han sido utilizados para que la comunicación pueda volver a comenzar en equilibrio.",
    cuidados:
      "Ayúdalas con agua con sal (es importante que las sustancias químicas tengan un equilibrio) y el sueño profundo (les ayuda a limpiar más a fondo).",
  },
  {
    id: "microglia",
    nombre: "Microglía",
    foto: "/viñetas/fisiologia/celulas/microglia.png",
    descripcion:
      "Las guardianas inmunológicas del cerebro. Son capaces de detectar cuando hay algo que no pertenece al ecosistema cerebral —restos celulares, proteínas dañadas o posibles amenazas— y lo fagocitan para limpiar y reciclar el entorno neuronal.",
    cuidados:
      "Reduce la inflamación con descanso (porque pueden limpiar cuando duermes), manejo del estrés (el cortisol las puede llevar a sobrerreaccionar y no hacer bien su trabajo) y una alimentación antiinflamatoria (el cerebro es muy sensible a las señales que le llegan del colon a través del nervio vago).",
  },
  {
    id: "oligodendrocitos",
    nombre: "Oligodendrocitos",
    foto: "/viñetas/fisiologia/celulas/oligodendrocitos.png",
    descripcion:
      "Células encargadas de producir mielina, una capa que envuelve los axones de las neuronas y acelera enormemente la transmisión de información entre ellas. Son esenciales para la coordinación, el pensamiento, el aprendizaje y prácticamente cualquier función cerebral. También participan en la capacidad del cerebro para adaptarse y reorganizarse.",
    cuidados:
      "Favorece su función con grasas saludables (omega-3), vitamina B12 y buena salud metabólica.",
  },
  {
    id: "ependimarias",
    nombre: "Células ependimarias",
    foto: "/viñetas/fisiologia/celulas/ependimarias.png",
    descripcion:
      "Producen y movilizan el líquido cefalorraquídeo, el líquido que protege, nutre y permite el movimiento de los nutrientes y las células en el ecosistema cerebral. Debido a esto, mantienen el equilibrio del entorno donde viven las neuronas y la glía.",
    cuidados:
      "Para cuidarlas (cuidarte) no te olvides de beber agua.",
  },
  {
    id: "hepatocitos",
    nombre: "Hepatocitos",
    foto: "/viñetas/fisiologia/celulas/hepatocitos.png",
    descripcion:
      "Fundamentales. Todo lo que respiramos, comemos o bebemos pasa, de una forma u otra, por ellos. Se encargan de desintoxicar sustancias potencialmente dañinas y transformar nutrientes en energía utilizable. Metabolizan la glucosa y, dependiendo de tu movimiento y gasto energético, deciden si convertirla en ATP (energía inmediata), almacenarla como glucógeno o transformarla en grasa para reserva. También fabrican muchas proteínas y enzimas esenciales a partir de los aminoácidos de la dieta. Gestionan grasas y colesterol, fundamentales para construir membranas celulares y hormonas. Además, producen bilis, imprescindible para digerir y absorber correctamente las grasas y vitaminas liposolubles. Sin suficiente bilis, las grasas se absorben mal y pueden aparecer problemas digestivos, deficiencias vitamínicas y heces pálidas o grasosas.",
    cuidados:
      "Cuídalos evitando el alcohol (porque añade una carga tóxica enorme al sistema de desintoxicación), manteniendo una dieta rica en fibra y evitando los azúcares y grasas ultraprocesadas.",
  },
  {
    id: "kupffer",
    nombre: "Células de Kupffer",
    foto: "/viñetas/fisiologia/celulas/kupffer.png",
    descripcion:
      "Las células inmunitarias del hígado. Filtran la sangre que llega desde el intestino y eliminan bacterias, toxinas y restos celulares antes de que circulen por el resto del cuerpo. Son una especie de centinelas silenciosos entre la digestión y el sistema inmune.",
    cuidados:
      "Se benefician de una buena salud intestinal y alimentos antiinflamatorios como la cúrcuma y el jengibre.",
  },
  {
    id: "estrelladas",
    nombre: "Células estrelladas",
    foto: "/viñetas/fisiologia/celulas/estrelladas.png",
    descripcion:
      "Almacenan vitamina A y participan en la reparación del tejido hepático cuando existe daño. Cuando el hígado se lesiona de forma crónica, pueden activarse en exceso y producir fibrosis, formando cicatrices en el hígado.",
    cuidados:
      "Protégelas evitando daño hepático, el cual ocurre cuando se bebe alcohol, hay inflamación metabólica y acumulación excesiva de grasa hepática.",
  },

  // ── Páncreas ──
  {
    id: "celulas-beta",
    nombre: "Células beta",
    foto: "/viñetas/fisiologia/celulas/celulasbeta.png",
    descripcion:
      "Producen insulina, la hormona que permite que las células absorban glucosa y la utilicen como energía. Cuando existe un exceso de grasa visceral, muchas células dejan de responder bien a la insulina (resistencia a la insulina), por lo que el páncreas intenta compensarlo produciendo cada vez más. Con el tiempo, este exceso favorece inflamación, daño vascular y arterias más rígidas y “pegajosas”, aumentando el riesgo metabólico y cardiovascular.",
    cuidados:
      "Cuídalas evitando picos constantes de azúcar, exceso de ultraprocesados y manteniendo movimiento físico regular.",
  },
  {
    id: "celulas-alfa",
    nombre: "Células alfa",
    foto: "/viñetas/fisiologia/celulas/alfa.png",
    descripcion:
      "Producen glucagón, la hormona que se libera cuando hay baja glucosa en la sangre. El glucagón le indica al cuerpo que movilice reservas almacenadas, especialmente glucógeno y grasa, para transformarlas en energía utilizable. Por eso, cuando no comes durante un tiempo, el cuerpo comienza a utilizar parte de la energía acumulada del tejido adiposo.",
    cuidados:
      "Mantienen mejor su equilibrio con una alimentación estable, buen descanso y sensibilidad adecuada a la insulina.",
  },
  {
    id: "celulas-delta",
    nombre: "Células delta",
    foto: "/viñetas/fisiologia/celulas/celulasdelta.png",
    descripcion:
      "Producen somatostatina, una hormona reguladora que actúa como un “freno inteligente”, ayudando a equilibrar la liberación de insulina, glucagón y otras hormonas digestivas para que el sistema no se descontrole.",
    cuidados:
      "Se benefician de una buena salud metabólica general, lo que quiere decir que es importante que dejes de comer cuando estás lleno.",
  },
  {
    id: "celulas-acinares",
    nombre: "Células acinares",
    foto: "/viñetas/fisiologia/celulas/acinares.png",
    descripcion:
      "Producen enzimas como amilasa, lipasa y proteasas para digerir carbohidratos, grasas y proteínas.",
  },
  {
    id: "celulas-ductales",
    nombre: "Células ductales",
    foto: "/viñetas/fisiologia/celulas/ductales.png",
    descripcion:
      "Producen bicarbonato para neutralizar el ácido procedente del estómago y facilitar la digestión.",
  },
  {
    id: "celulas-pp",
    nombre: "Células PP (gamma)",
    foto: "/viñetas/fisiologia/celulas/gamma.png",
    descripcion:
      "Producen polipéptido pancreático, una hormona que ayuda a coordinar la actividad digestiva, regulando la secreción de enzimas pancreáticas y la función de la vesícula biliar. También parece participar en el control del apetito.",
    cuidados:
      "Se benefician de hábitos alimentarios regulares (tener un horario de comidas).",
  },

  // ── Piel ──
  {
    id: "queratinocitos",
    nombre: "Queratinocitos",
    foto: "/viñetas/fisiologia/celulas/queratinocitos.png",
    descripcion:
      "La piel está formada por múltiples capas de queratinocitos, células que nacen en las capas más profundas y van ascendiendo lentamente hacia la superficie. Las primeras son células madre que se dividen constantemente para generar nuevas generaciones de queratinocitos, construyendo una barrera viva que protege el interior del cuerpo del mundo exterior. A medida que ascienden, se aplastan, se llenan de queratina y se unen cada vez más entre sí, formando una muralla flexible y resistente. Cuando completan su ciclo, mueren, se desprenden y se convierten en polvo.",
    cuidados:
      "Protégelos con buena hidratación, nutrición adecuada y evitando exceso de sol o agresiones constantes a la piel.",
  },
  {
    id: "melanocitos",
    nombre: "Melanocitos",
    foto: "/viñetas/fisiologia/celulas/melanocitos.png",
    descripcion:
      "Producen melanina, el pigmento que da color a la piel y ayuda a absorber parte de la radiación ultravioleta para proteger el ADN celular. Cuando reciben demasiada radiación solar, aumentan su actividad como mecanismo de defensa.",
    cuidados:
      "Usa protector solar y evita exposición solar excesiva para prevenir daño y sobreestimulación celular.",
  },
  {
    id: "langerhans",
    nombre: "Células de Langerhans",
    foto: "/viñetas/fisiologia/celulas/langerhans.png",
    descripcion:
      "Detectan microorganismos, sustancias extrañas y señales de daño, activando respuestas defensivas para proteger la barrera cutánea.",
    cuidados:
      "Cuida la barrera de la piel evitando irritantes agresivos, inflamación crónica y exceso de productos que alteren tu equilibrio natural.",
  },

  // ── Intestino ──
  {
    id: "enterocitos",
    nombre: "Enterocitos",
    foto: "/viñetas/fisiologia/celulas/enterocitos.png",
    descripcion:
      "Son las células que recubren el intestino y absorben los nutrientes de todo lo que comemos. Actúan como una frontera inteligente: dejan pasar hacia la sangre vitaminas, minerales, aminoácidos, grasas y glucosa, e intentan bloquear que entren sustancias potencialmente dañinas a la circulación. Son una de las interfaces más importantes entre el mundo exterior y el interior del cuerpo.",
    cuidados:
      "Cuídalos con fibra, nutrientes de calidad y evitando exceso de ultraprocesados e inflamación intestinal.",
  },
  {
    id: "caliciformes",
    nombre: "Células caliciformes",
    foto: "/viñetas/fisiologia/celulas/caliciformes.png",
    descripcion:
      "Producen el moco que recubre y protege el intestino. Esa capa mucosa funciona como un escudo vivo que mantiene a gran parte de las bacterias intestinales a una distancia segura de los enterocitos, ayudando a evitar inflamación y el paso de sustancias no deseadas hacia la sangre.",
    cuidados:
      "Se benefician de buena hidratación, fibra y una microbiota equilibrada.",
  },
  {
    id: "paneth",
    nombre: "Células de Paneth",
    foto: "/viñetas/fisiologia/celulas/paneth.png",
    descripcion:
      "Son guardianas del intestino. Liberan sustancias antimicrobianas que ayudan a controlar bacterias dañinas y a mantener el equilibrio del ecosistema intestinal cerca de las células madre intestinales.",
    cuidados:
      "Favorece su función con una microbiota sana (come kimchi, bífidus, miso, chucrut), sueño adecuado y baja inflamación crónica.",
  },
  {
    id: "enteroendocrinas",
    nombre: "Células enteroendocrinas",
    foto: "/viñetas/fisiologia/celulas/enteroendocrinas.png",
    descripcion:
      "Son células capaces de “sentir” los nutrientes que llegan al intestino y responder produciendo hormonas digestivas que regulan el hambre, la saciedad y el movimiento intestinal. Son una especie de puente químico entre el intestino y el cerebro.",
    cuidados:
      "Se equilibran con alimentación regular, ritmos circadianos estables y buena salud metabólica.",
  },

  // ── Músculo ──
  {
    id: "miocitos",
    nombre: "Fibra muscular (miocitos)",
    foto: "/viñetas/fisiologia/celulas/miocitos.png",
    descripcion:
      "Son las células encargadas de la contracción muscular, lo que hace posible el movimiento del cuerpo. Están formadas por filamentos muy finos de actina y miosina, organizados de manera altamente ordenada, y utilizan el calcio como señal clave para activar la contracción. Cuando llega una señal nerviosa, se libera acetilcolina en la unión neuromuscular; esta genera un impulso eléctrico que desencadena la liberación de calcio dentro de la fibra muscular. Ese calcio permite que la actina y la miosina interactúen, produciendo la contracción.",
    cuidados:
      "Cuídalas con ejercicio regular, suficiente proteína y descanso adecuado para favorecer su reparación y adaptación.",
  },
  {
    id: "cardiomiocitos",
    nombre: "Cardiomiocitos",
    foto: "/viñetas/fisiologia/celulas/cardiomiocitos.png",
    descripcion:
      "Son las células musculares del corazón, responsables de sus contracciones rítmicas y continuas que mantienen la circulación sanguínea. Funcionan de forma coordinada y automática, generando el latido que sostiene la vida.",
    cuidados:
      "Se fortalecen con ejercicio cardiovascular y una buena regulación del estrés (medita).",
  },
  {
    id: "musculares-lisas",
    nombre: "Células musculares lisas",
    foto: "/viñetas/fisiologia/celulas/musculareslisas.png",
    descripcion:
      "Controlan la contracción involuntaria de órganos internos como el intestino, los vasos sanguíneos y otras estructuras viscerales. Regulan el flujo, el movimiento y el tono de estos sistemas de forma continua y automática.",
    cuidados:
      "Se benefician de buena circulación, actividad física regular y un equilibrio general del sistema nervioso autónomo.",
  },

  // ── Hueso ──
  {
    id: "osteoblastos",
    nombre: "Osteoblastos",
    foto: "/viñetas/fisiologia/celulas/osteoblastos.png",
    descripcion:
      "Son las células encargadas de la formación del hueso. Sintetizan la matriz ósea y facilitan la mineralización, construyendo tejido nuevo continuamente. Su actividad está influida por hormonas como los estrógenos, la testosterona, el cortisol y la vitamina D (que en realidad actúa como una hormona reguladora del metabolismo del calcio).",
    cuidados:
      "Se estimulan con vitamina D, suficiente calcio en la dieta y ejercicio de impacto o resistencia.",
  },
  {
    id: "osteoclastos",
    nombre: "Osteoclastos",
    foto: "/viñetas/fisiologia/celulas/osteoclastos.png",
    descripcion:
      "Son las células responsables de la reabsorción ósea, es decir, la degradación del hueso viejo para permitir que los osteoblastos construyan nuevo hueso. Este proceso es esencial y mantiene un esqueleto sano. Sin embargo, cuando existe estrés crónico o desequilibrios hormonales, la degradación puede superar a la formación. Además, si el calcio en sangre es bajo, el cuerpo puede recurrir al hueso como reserva para mantenerlo estable, lo que aumenta la actividad de los osteoclastos.",
    cuidados:
      "Su equilibrio depende de ejercicio, buena salud hormonal y niveles adecuados de nutrientes esenciales (el calcio debe mantenerse en rango normal bajo control médico, evitando suplementación innecesaria).",
  },
  {
    id: "osteocitos",
    nombre: "Osteocitos",
    foto: "/viñetas/fisiologia/celulas/osteocitos.png",
    descripcion:
      "Son células óseas maduras derivadas de los osteoblastos. Viven dentro de la matriz ósea y forman una red de comunicación a través de canalículos, actuando como sensores mecánicos que detectan presión y carga sobre el hueso, permitiendo la adaptación a cargas pesadas.",
    cuidados:
      "El ejercicio regular, especialmente el de carga o impacto, mejora su señalización y mantiene el hueso fuerte y funcional.",
  },

  // ── Sangre e inmunidad ──
  {
    id: "eritrocitos",
    nombre: "Eritrocitos",
    foto: "/viñetas/fisiologia/celulas/eritrocitos.png",
    descripcion:
      "Transportan oxígeno desde los pulmones hacia todas las células del cuerpo, permitiendo que ocurra la respiración celular y la producción de energía (ATP). No contienen núcleo y están llenos de hemoglobina, una proteína que se une al oxígeno gracias al hierro. La vitamina B12 es esencial para su correcta formación en la médula ósea.",
    cuidados:
      "Se benefician de hierro adecuado, vitamina B12 y una buena salud metabólica general.",
  },
  {
    id: "neutrofilos",
    nombre: "Neutrófilos",
    foto: "/viñetas/fisiologia/celulas/neutrofilos.png",
    descripcion:
      "Son células del sistema inmunitario innato, los primeros en llegar ante una infección. Fagocitan y destruyen microorganismos. Soldados suicidas, suelen sacrificarse para contener la amenaza.",
    cuidados:
      "Apóyalos con buen descanso, nutrición adecuada y un sistema inmune equilibrado.",
  },
  {
    id: "linfocitos-b",
    nombre: "Linfocitos B",
    foto: "/viñetas/fisiologia/celulas/bcells.png",
    descripcion:
      "Son células del sistema inmunitario adaptativo encargadas de producir anticuerpos. Cuando detectan un antígeno específico (con ayuda de otras células inmunes), se activan y generan anticuerpos que se unen a los patógenos, marcándolos para su eliminación.",
    cuidados:
      "Se favorecen con exposición controlada a distintas enfermedades, buena nutrición y un sistema inmune bien regulado.",
  },
  {
    id: "linfocitos-t",
    nombre: "Linfocitos T",
    foto: "/viñetas/fisiologia/celulas/tcells.png",
    descripcion:
      "Son células clave del sistema inmunitario adaptativo. Las células dendríticas les presentan fragmentos de antígenos, y los linfocitos T reconocen si encajan con su receptor específico. Si hay coincidencia, se activan y coordinan la respuesta inmune, ayudando a activar linfocitos B o destruyendo células infectadas. La fluidez y funcionalidad de sus membranas depende en parte de la presencia de grasas insaturadas, que favorecen la comunicación celular.",
    cuidados:
      "Se apoyan con sueño profundo (que es cuando más actúan), control del estrés y buen equilibrio nutricional (grasas insaturadas y aminoácidos esenciales).",
  },
  {
    id: "macrofagos",
    nombre: "Macrófagos",
    foto: "/viñetas/fisiologia/celulas/macrofagos.png",
    descripcion:
      "Son células inmunitarias que fagocitan bacterias, restos celulares y células dañadas. También realizan un papel esencial de reciclaje, eliminando células que han entrado en muerte programada (apoptosis) antes de que generen inflamación o daño en el tejido.",
    cuidados:
      "Se favorecen con una dieta antiinflamatoria rica en frutas, vegetales y omega-3.",
  },
  {
    id: "dendriticas",
    nombre: "Células dendríticas",
    foto: "/viñetas/fisiologia/celulas/dendriticas.png",
    descripcion:
      "Son células centinela del sistema inmunitario. Detectan moléculas extrañas, capturan muestras del patógeno y las presentan a los linfocitos T en los órganos linfoides, iniciando así la respuesta inmune adaptativa.",
    cuidados:
      "Su función se ve muy influida por la salud intestinal y el equilibrio de la microbiota.",
  },

  // ── Pulmón ──
  {
    id: "neumocitos-1",
    nombre: "Neumocitos tipo I",
    foto: "/viñetas/fisiologia/celulas/neumocitos1.png",
    descripcion:
      "Son las células que forman la mayor parte de la superficie de los alvéolos pulmonares y permiten el intercambio de gases. A través de su membrana extremadamente fina, el oxígeno pasa desde el aire de los pulmones hacia las células rojas de la sangre para su transporte. Además, en el intercambio, el dióxido de carbono sale de la sangre para ser expulsado.",
    cuidados:
      "Cuídalos con aire limpio, evitando el tabaco y la exposición a contaminantes.",
  },
  {
    id: "neumocitos-2",
    nombre: "Neumocitos tipo II",
    foto: "/viñetas/fisiologia/celulas/neumocitos2.png",
    descripcion:
      "Producen surfactante pulmonar, una sustancia que reduce la tensión superficial dentro de los alvéolos, evitando que se colapsen al respirar y facilitando su expansión incluso con grandes cambios de volumen de aire. También participan en la reparación del tejido pulmonar cuando hay daño.",
    cuidados:
      "Se favorecen con buena salud respiratoria y ejercicio.",
  },
  {
    id: "macrofagos-alveolares",
    nombre: "Macrófagos alveolares",
    foto: "/viñetas/fisiologia/celulas/pulmonesmacrofagos.png",
    descripcion:
      "Son las células defensivas del pulmón. Eliminan partículas, polvo, microorganismos y toxinas que entran al sistema respiratorio con cada respiración. Cuando se ven sobrecargados, como ocurre con el humo del tabaco, su capacidad de limpieza disminuye y aumenta el riesgo de daño pulmonar e inflamación.",
    cuidados:
      "Se protegen evitando humo, contaminación y favoreciendo un entorno respiratorio limpio.",
  },

  // ── Riñón ──
  {
    id: "podocitos",
    nombre: "Podocitos",
    foto: "/viñetas/fisiologia/celulas/podocitos.png",
    descripcion:
      "Son células especializadas que forman parte de la barrera de filtración del glomérulo renal. Regulan qué sustancias pueden pasar desde la sangre hacia el filtrado inicial de la orina, permitiendo el paso de desechos y reteniendo proteínas y células importantes.",
    cuidados:
      "Se cuidan con buena hidratación y evitando exceso crónico de sal y daño metabólico.",
  },
  {
    id: "celulas-tubulares",
    nombre: "Células tubulares",
    foto: "/viñetas/fisiologia/celulas/tubulares.png",
    descripcion:
      "Forman los túbulos renales y son responsables de reabsorber agua, sales y nutrientes útiles desde el filtrado de la orina de vuelta a la sangre, además de secretar ciertas sustancias de desecho. Son clave para mantener el equilibrio interno del cuerpo.",
    cuidados:
      "Se benefician de hidratación constante, buena presión arterial y equilibrio electrolítico.",
  },

  // ── Tejido conectivo ──
  {
    id: "fibroblastos",
    nombre: "Fibroblastos",
    foto: "/viñetas/fisiologia/celulas/fibroblastos.png",
    descripcion:
      "Son células encargadas de producir y organizar la matriz extracelular, especialmente el colágeno, que aporta estructura, resistencia y elasticidad a tejidos como piel, tendones, ligamentos, vasos sanguíneos, cartílago y otros órganos conectivos. También participan en la reparación de tejidos cuando hay daño.",
    cuidados:
      "Se favorecen con vitamina C, suficiente proteína, péptidos de colágeno (les influencian para que generen más colágeno ellas mismas) y un estilo de vida que reduzca la inflamación crónica.",
  },
  {
    id: "adipocitos-blancos",
    nombre: "Adipocitos blancos",
    foto: "/viñetas/fisiologia/celulas/adipocitos.png",
    descripcion:
      "Son las células que almacenan energía en forma de triglicéridos y funcionan como un órgano endocrino activo. Liberan leptina, una hormona que informa al cerebro sobre el estado de reservas energéticas y la saciedad.",
    cuidados:
      "Se equilibran con balance calórico (escucha a tu cuerpo, sabrás cuándo estás lleno), actividad física regular y buena sensibilidad metabólica.",
  },
  {
    id: "adipocitos-marrones",
    nombre: "Adipocitos marrones",
    foto: "/viñetas/fisiologia/celulas/marron.png",
    descripcion:
      "Almacenan energía en forma de triglicéridos, aunque en menor cantidad que los adipocitos blancos. Poseen numerosas mitocondrias, lo que les permite utilizar la grasa como combustible y generar calor (termogénesis). Son fundamentales para mantener la temperatura corporal y permiten la supervivencia de algunos mamíferos durante la hibernación.",
    cuidados:
      "Cuídalos con exposición regular al frío (como duchas o baños fríos), actividad física frecuente y un buen descanso.",
  },
  {
    id: "endoteliales",
    nombre: "Células endoteliales",
    foto: "/viñetas/fisiologia/celulas/endoteliales.png",
    descripcion:
      "Recubren el interior de los vasos sanguíneos formando una barrera dinámica entre la sangre y los tejidos. Regulan el flujo sanguíneo, la coagulación, la inflamación y el intercambio de sustancias, siendo esenciales para la salud cardiovascular.",
    cuidados:
      "Se benefician enormemente del ejercicio cardiovascular, buena alimentación y con unos niveles de LDL y cortisol bajos.",
  },
];
