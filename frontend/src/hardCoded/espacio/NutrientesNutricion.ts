// ── Datos de la Página 1 del recorrido de Nutrición: los 6 grupos de nutrientes.
// Cada uno con sus tipos, qué hacen en el cuerpo y dónde encontrarlo.

export interface NutrienteTipo {
  nombre: string;
  desc: string;
}

// Tarjeta de la página de detalle (p.ej. Glucosa, Fructosa…). Al pincharla se
// abre una ficha tipo cómic (foto + título + texto), como en Fisiología.
export interface NutrienteTarjeta {
  key: string;
  titulo: string;
  /** Foto cuadrada de la molécula/tipo. PENDIENTE de subir:
   *  /img/nutri/nutrientes/<grupo>/<key>.png */
  foto: string;
  parrafos: string[];
  /** Color propio de la tarjeta (para el círculo de vitaminas: cada una uno). */
  color?: string;
  /** Etiqueta corta para el nodo del círculo (p.ej. «A», «B»). */
  sigla?: string;
  /** Subgrupo al que pertenece la tarjeta (p.ej. «⚡ Electrolitos», «🧱 Minerales»).
   *  Si varias tarjetas tienen distinto `grupo`, la rejilla los separa con un
   *  encabezado y una línea horizontal entre subgrupos. */
  grupo?: string;
  /** Número de orden (1, 2, 3…) para secuencias, p.ej. la ruta metabólica del
   *  etanol. Si se define, la tarjeta muestra un badge con ese número. */
  numero?: number;
}

export interface Nutriente {
  key: string;
  label: string;
  color: string;
  /** Foto de alimentos de este grupo donde se ven sus moléculas. Va en la
   *  tarjeta de la cuadrícula (con el título debajo). */
  img: string;
  resumen: string;
  /** Descripción larga (uno o varios párrafos) que se muestra en el box de
   *  detalle, a la derecha de la foto. Se lee al tamaño de las ilustraciones. */
  descripcion?: string[];
  tipos: NutrienteTipo[];
  queHacen: string[];
  donde: string[];
  /** Tarjetas de detalle (moléculas/tipos), cada una abre su ficha cómic. */
  tarjetas?: NutrienteTarjeta[];
  /** Si true, las tarjetas se muestran como un CÍRCULO de colores (p.ej. las
   *  vitaminas), en vez de la rejilla de tarjetas. */
  tarjetasCirculo?: boolean;
}

export const NUTRIENTES: Nutriente[] = [
  {
    key: "carbohidratos",
    label: "Carbohidratos",
    color: "#e0a92e",
    img: "/recorrido/nutricion/portadas/carbs.png",
    resumen: "Tu principal fuente de energía.",
    descripcion: [
      "Los carbohidratos son la principal fuente de energía del cuerpo. Durante la digestión, las enzimas los descomponen en moléculas simples, principalmente glucosa. Esta permite que las células obtengan energía mediante la respiración celular.",
      "Cuando se consume más de la necesaria, el exceso se almacena como glucógeno o se transforma en triglicéridos los cuales se almacenan en las células de grasa blanca.",
    ],
    tipos: [
      { nombre: "Simples (azúcares)", desc: "Glucosa, fructosa, sacarosa. Energía rápida, pico y bajada." },
      { nombre: "Complejos (almidón)", desc: "Cadenas largas de glucosa. Energía lenta y sostenida." },
    ],
    queHacen: [
      "Son el combustible preferido del cuerpo: se rompen en glucosa.",
      "La glucosa alimenta sobre todo al cerebro y a los músculos.",
      "El exceso se guarda como glucógeno (hígado y músculo) o como grasa.",
    ],
    donde: ["Avena", "Arroz y pan integral", "Legumbres", "Fruta", "Patata y boniato"],
    tarjetas: [
      {
        key: "glucosa",
        titulo: "Glucosa",
        foto: "/recorrido/nutricion/moleculas/glucosa.png",
        parrafos: [
          "Es la molécula que nuestras células utilizan con más frecuencia para fabricar ATP, la energía.",
          "Cuando la ingerimos, pasa a la sangre y se libera insulina, la hormona que les dice a las células que capten la glucosa para usarla. Si hay más glucosa de la que el organismo necesita y las reservas de glucógeno están llenas, el hígado transforma la glucosa en triglicéridos y los almacena en grasa para guardarlo como reserva.",
        ],
      },
      {
        key: "fructosa",
        titulo: "Fructosa",
        foto: "/recorrido/nutricion/moleculas/fructosa.png",
        parrafos: [
          "Es la molécula característica de las frutas y la miel. A diferencia de la glucosa, la mayor parte de la fructosa se procesa primero en el hígado.",
          "Cuando se consume dentro de una fruta, la fibra hace que se absorba lentamente. Sin embargo, cuando se consume en grandes cantidades y sin fibra (como en refrescos o zumos), el hígado recibe una carga muy rápida que favorece la producción de grasa, gasta las reservas y altera el metabolismo.",
        ],
      },
      {
        key: "galactosa",
        titulo: "Galactosa",
        foto: "/recorrido/nutricion/moleculas/galactosa.png",
        parrafos: [
          "La galactosa forma parte de la lactosa, la molécula de carbohidratos presente en la leche.",
          "Para absorberla, primero debemos romper la lactosa gracias a una enzima llamada lactasa, que la divide en glucosa y galactosa.",
          "Las personas con intolerancia a la lactosa producen poca lactasa, por lo que la lactosa llega al intestino sin digerir y provoca síntomas como gases, hinchazón o diarrea.",
          "Una vez absorbida, la galactosa suele transformarse en glucosa para que el organismo pueda utilizarla.",
        ],
      },
    ],
  },
  {
    key: "grasas",
    label: "Grasas",
    color: "#e58a3c",
    img: "/recorrido/nutricion/portadas/grasas.png",
    resumen: "Energía densa y ladrillos de tus membranas.",
    descripcion: [
      "Las grasas forman parte de la membrana de todas tus células. También transportan las vitaminas A, D, E y K y son la base para fabricar muchas hormonas.",
      "No todas son iguales: las insaturadas son las más beneficiosas para la salud, las saturadas conviene moderarlas y las grasas trans, evitarlas.",
    ],
    tipos: [
      { nombre: "Insaturadas", desc: "Mono y poliinsaturadas (omega-3, omega-6). Las más beneficiosas." },
      { nombre: "Saturadas", desc: "En carnes y lácteos. Con moderación." },
      { nombre: "Trans", desc: "Industriales (ultraprocesados). Las que conviene evitar." },
    ],
    queHacen: [
      "Reserva de energía más concentrada que tiene el cuerpo.",
      "Forman las membranas de todas tus células.",
      "Transportan las vitaminas A, D, E y K, y son base de muchas hormonas.",
    ],
    donde: ["Aceite de oliva", "Aguacate", "Frutos secos y semillas", "Pescado azul", "Huevo"],
    tarjetas: [
      {
        key: "insaturadas",
        titulo: "Grasas insaturadas",
        foto: "/recorrido/nutricion/moleculas/insaturado.png",
        parrafos: [
          "Son las grasas más habituales en alimentos como el aceite de oliva, los frutos secos, las semillas, el aguacate y el pescado azul.",
          "Su estructura presenta una o varias curvaturas que ayudan a mantener las membranas celulares flexibles y favorecen el funcionamiento normal de las células.",
          "Son las grasas más eficientes para nuestras células y con las que ha evolucionado durante millones de años.",
        ],
      },
      {
        key: "saturadas",
        titulo: "Grasas saturadas",
        foto: "/recorrido/nutricion/moleculas/saturado.png",
        parrafos: [
          "Se encuentran principalmente en productos de origen animal, como la carne o los lácteos, aunque también en algunos vegetales como el aceite de coco.",
          "Sus moléculas son rectas y pueden empaquetarse con mayor facilidad, haciendo que las membranas celulares sean más rígidas y menos eficientes. Nuestro cuerpo también las utiliza, pero un consumo elevado y mantenido puede favorecer alteraciones cardiovasculares, especialmente cuando su consumo desplaza a las grasas insaturadas.",
        ],
      },
      {
        key: "trans",
        titulo: "Grasas trans",
        foto: "/recorrido/nutricion/moleculas/trans.png",
        parrafos: [
          "La mayoría de las grasas trans presentes en la alimentación se generan durante procesos industriales que modifican aceites vegetales para hacerlos más estables. Es decir, su estructura molecular no existe en la naturaleza, sino que se creó en un laboratorio.",
          "Su forma altera el funcionamiento normal de las membranas celulares y se asocia con un aumento del colesterol LDL, una disminución del HDL y un mayor riesgo de enfermedad cardiovascular. Por eso se recomienda consumir la menor cantidad posible.",
          "Recuerda que no cumplen ninguna función beneficiosa conocida y su consumo debe minimizarse.",
        ],
      },
    ],
  },
  {
    key: "proteinas",
    label: "Proteínas",
    color: "#d75f5a",
    img: "/recorrido/nutricion/portadas/prote.png",
    resumen: "El material con el que te reconstruyes.",
    descripcion: [
      "Las proteínas son el material con el que tu cuerpo construye y repara tejidos. Durante la digestión se descomponen en aminoácidos, los ladrillos con los que el organismo fabrica músculo, piel, enzimas, anticuerpos y muchas hormonas.",
    ],
    tipos: [
      { nombre: "Completas", desc: "De origen animal: aportan todos los aminoácidos esenciales." },
      { nombre: "Incompletas", desc: "De origen vegetal: se combinan (legumbre + cereal) para completarlas." },
    ],
    queHacen: [
      "Se descomponen en aminoácidos, los ladrillos del cuerpo.",
      "Construyen y reparan músculo, piel, pelo y órganos.",
      "Forman enzimas, anticuerpos y muchas hormonas.",
    ],
    donde: ["Huevo", "Pescado y carne", "Lácteos", "Legumbres y tofu", "Frutos secos"],
    tarjetas: [
      {
        key: "esenciales",
        titulo: "Aminoácidos esenciales",
        foto: "/recorrido/nutricion/moleculas/aesencial.png",
        parrafos: [
          "Son los aminoácidos que nuestro cuerpo no puede fabricar o no puede producir en cantidad suficiente pero son necesarios. Por eso debemos obtenerlos a través de la alimentación.",
          "Son imprescindibles para fabricar músculos, enzimas, hormonas, anticuerpos y miles de proteínas diferentes.",
        ],
      },
      {
        key: "no-esenciales",
        titulo: "Aminoácidos no esenciales",
        foto: "/recorrido/nutricion/moleculas/noaesencial.png",
        parrafos: [
          "Nuestro cuerpo puede fabricar estos aminoácidos a partir de otras moléculas, por lo que no es imprescindible obtenerlos directamente de los alimentos. Aun así, siguen siendo igual de importantes, ya que participan en la construcción y reparación de todos los tejidos.",
        ],
      },
      {
        key: "condicionalmente-esenciales",
        titulo: "Aminoácidos condicionalmente esenciales",
        foto: "/recorrido/nutricion/moleculas/acondesencial.png",
        parrafos: [
          "Normalmente nuestro cuerpo puede producirlos, pero en determinadas situaciones —como el crecimiento, una enfermedad, una infección o una lesión importante— la demanda aumenta tanto que es necesario obtener una mayor cantidad a través de la alimentación.",
        ],
      },
    ],
  },
  {
    key: "vitaminas",
    label: "Vitaminas",
    color: "#e8b52e",
    img: "/recorrido/nutricion/portadas/vitaminas.png",
    resumen: "Reguladoras: sin ellas nada funciona.",
    descripcion: [
      "Las vitaminas no aportan energía, pero sin ellas nada funciona correctamente. Permiten que se produzcan las reacciones químicas del organismo, desde la visión hasta las defensas o la coagulación de la sangre.",
      "Las hidrosolubles (grupo B y vitamina C) deben obtenerse regularmente mediante la alimentación, mientras que las liposolubles (A, D, E y K) pueden almacenarse en la grasa corporal.",
    ],
    tipos: [
      { nombre: "Hidrosolubles", desc: "Vitamina C y grupo B. No se almacenan: hay que reponerlas a diario." },
      { nombre: "Liposolubles", desc: "A, D, E y K. Se guardan en la grasa del cuerpo." },
    ],
    queHacen: [
      "No dan energía, pero permiten que las reacciones del cuerpo ocurran.",
      "Intervienen en la visión, las defensas, la coagulación y la energía celular.",
      "La vitamina D se fabrica en la piel con la luz del sol.",
    ],
    donde: ["Fruta y verdura", "Verduras de hoja verde", "Huevo e hígado", "Sol (vitamina D)", "Cereales integrales"],
    tarjetasCirculo: true,
    tarjetas: [
      {
        key: "a", sigla: "A", titulo: "Vitamina A (Retinol)", color: "#ef8e3a",
        foto: "/recorrido/nutricion/moleculas/vitaminaa.png",
        parrafos: [
          "Sin la vitamina A no podríamos ver.",
          "La vitamina A se transforma en retinal, una molécula que forma parte de la rodopsina, el pigmento de la retina que nos permite ver.",
          "Es esencial para el desarrollo del sistema inmunitario y para que su respuesta no sea exagerada.",
          "La vitamina A regula qué genes se activan en las células epiteliales. Gracias a ello, las células de la piel se renuevan correctamente (protegiéndonos eficazmente) y las mucosas producen la cantidad adecuada de moco.",
        ],
      },
      {
        key: "b1", sigla: "B1", titulo: "Vitamina B1 (Tiamina)", color: "#f2c230",
        foto: "/recorrido/nutricion/moleculas/vitb1.png",
        parrafos: [
          "Activa las enzimas que transforman los carbohidratos en energía y es imprescindible para el funcionamiento del cerebro, los nervios y los músculos. Sin ella, las células tendrían muchas dificultades para obtener energía de la glucosa.",
        ],
      },
      {
        key: "b2", sigla: "B2", titulo: "Vitamina B2 (Riboflavina)", color: "#ecbb2f",
        foto: "/recorrido/nutricion/moleculas/vitb2.png",
        parrafos: [
          "Participa en numerosas reacciones metabólicas relacionadas con la producción de energía, para ser exactos que se convierten en activadores de las enzimas que transportan electrones durante la respiración celular.",
          "También ayuda a mantener la piel, los ojos y las mucosas en buen estado y contribuye a proteger las células frente al estrés oxidativo.",
        ],
      },
      {
        key: "b3", sigla: "B3", titulo: "Vitamina B3 (Niacina)", color: "#e6b02c",
        foto: "/recorrido/nutricion/moleculas/vitb3.png",
        parrafos: [
          "Es necesaria para fabricar las moléculas que permiten obtener energía a partir de los alimentos.",
          "Es decir, se transforma en NAD⁺ y NADP⁺, moléculas que transportan electrones entre enzimas durante cientos de reacciones metabólicas.",
          "Además, participa en la reparación del ADN y en el funcionamiento normal del sistema nervioso y la piel.",
        ],
      },
      {
        key: "b5", sigla: "B5", titulo: "Vitamina B5 (Ácido pantoténico)", color: "#dda829",
        foto: "/recorrido/nutricion/moleculas/vitb5.png",
        parrafos: [
          "Forma parte de la coenzima A (CoA), una molécula imprescindible para que las enzimas puedan fabricar y degradar grasas, producir energía y sintetizar colesterol y hormonas.",
        ],
      },
      {
        key: "b6", sigla: "B6", titulo: "Vitamina B6 (Piridoxina)", color: "#efc94c",
        foto: "/recorrido/nutricion/moleculas/vitb6.png",
        parrafos: [
          "Activa a las enzimas que participan en la transformación de los aminoácidos y en la fabricación de neurotransmisores, hemoglobina y anticuerpos.",
          "Debido a esto, es fundamental para el sistema nervioso y el sistema inmunitario.",
        ],
      },
      {
        key: "b7", sigla: "B7", titulo: "Vitamina B7 (Biotina)", color: "#e4be3c",
        foto: "/recorrido/nutricion/moleculas/vitb7.png",
        parrafos: [
          "Actúa como coenzima de las carboxilasas, un grupo de enzimas que permiten fabricar glucosa, sintetizar ácidos grasos y aprovechar algunos aminoácidos para obtener energía. Por ello, participa en el mantenimiento de la piel, el cabello y las uñas.",
        ],
      },
      {
        key: "b9", sigla: "B9", titulo: "Vitamina B9 (Ácido fólico o Folato)", color: "#d6a336",
        foto: "/recorrido/nutricion/moleculas/vitb9.png",
        parrafos: [
          "Activa a la enzima que transporta pequeños fragmentos de carbono necesarios para fabricar ADN y ARN. Sin ella, las células no podrían dividirse correctamente.",
          "Durante el embarazo es especialmente importante porque participa en el correcto desarrollo del sistema nervioso del bebé. Sin esta vitamina, el bebé podría fallecer.",
        ],
      },
      {
        key: "b12", sigla: "B12", titulo: "Vitamina B12 (Cobalamina)", color: "#c99a32",
        foto: "/recorrido/nutricion/moleculas/vitb12.png",
        parrafos: [
          "Activa a las enzimas que regeneran el folato activo y participan en la formación de ADN, glóbulos rojos y mielina, la capa que recubre muchas neuronas.",
          "Solo la producen ciertos microorganismos, por lo que se obtiene principalmente de alimentos de origen animal o de alimentos suplementados.",
        ],
      },
      {
        key: "c", sigla: "C", titulo: "Vitamina C (Ácido ascórbico)", color: "#6fb84c",
        foto: "/recorrido/nutricion/moleculas/vitc.png",
        parrafos: [
          "Actúa como antioxidante, dona electrones a enzimas que fabrican colágeno, permitiendo estabilizar sus fibras. Mejora la absorción del hierro de origen vegetal, manteniéndolo en una forma más fácil de absorber.",
          "Contribuye al funcionamiento normal del sistema inmunitario, es decir ayuda a estimular la producción y función de las células inmunes, además de actuar como antioxidante que protege a estas células de daños.",
        ],
      },
      {
        key: "d", sigla: "D", titulo: "Vitamina D (Calciferol)", color: "#4a90d9",
        foto: "/recorrido/nutricion/moleculas/vitd.png",
        parrafos: [
          "Facilita la absorción del calcio y del fósforo, ayudando a mantener huesos y dientes fuertes.",
          "Además, participa en el funcionamiento del sistema inmunitario y de los músculos. Nuestro cuerpo puede fabricarla gracias a la luz solar, pero es muy complicada de fabricar por lo que se recomienda tomarla como suplemento.",
        ],
      },
      {
        key: "e", sigla: "E", titulo: "Vitamina E (Tocoferol)", color: "#9b6fc7",
        foto: "/recorrido/nutricion/moleculas/vite.png",
        parrafos: [
          "Es uno de los principales antioxidantes del organismo.",
          "Protege las membranas celulares porque se incorpora a ellas y dona electrones para calmar a los radicales libres antes de que puedan dañar los lípidos que forman la membrana.",
        ],
      },
      {
        key: "k", sigla: "K", titulo: "Vitamina K (Filoquinona y Menaquinonas)", color: "#d9534f",
        foto: "/recorrido/nutricion/moleculas/vitk.png",
        parrafos: [
          "Es imprescindible para que la sangre coagule correctamente cuando sufrimos una herida. También participa en el mantenimiento de los huesos regulando el uso del calcio.",
          "Parte de la vitamina K también puede ser producida por algunas bacterias de nuestra microbiota intestinal.",
        ],
      },
    ],
  },
  {
    key: "minerales",
    label: "Minerales",
    color: "#6f93b8",
    img: "/recorrido/nutricion/portadas/minerales.png",
    resumen: "Estructura, transporte y equilibrio.",
    descripcion: [
      "Los minerales dan estructura, transportan sustancias y mantienen el equilibrio del organismo. Muchos actúan como cofactores, ayudando a que las enzimas funcionen correctamente.",
      "Forman huesos y dientes, permiten el impulso nervioso y la contracción muscular, y el hierro transporta el oxígeno en la sangre.",
    ],
    tipos: [
      { nombre: "Macrominerales", desc: "Calcio, fósforo, magnesio, potasio, sodio. En cantidades mayores." },
      { nombre: "Oligoelementos", desc: "Hierro, zinc, yodo, selenio. En cantidades diminutas, pero esenciales." },
    ],
    queHacen: [
      "Dan estructura a huesos y dientes (calcio, fósforo).",
      "El hierro transporta el oxígeno en la sangre.",
      "Permiten el impulso nervioso, la contracción muscular y el equilibrio de líquidos.",
    ],
    donde: ["Lácteos", "Verduras de hoja", "Legumbres", "Marisco y pescado", "Frutos secos"],
    tarjetas: [
      {
        key: "sodio",
        titulo: "Sodio (Na⁺)",
        foto: "/recorrido/nutricion/moleculas/sodio.png",
        grupo: "⚡ Electrolitos",
        parrafos: [
          "Es el principal electrolito fuera de las células.",
          "Regula la cantidad de agua del organismo y permite que los nervios transmitan impulsos eléctricos.",
          "El sodio sube la presión arterial porque retiene agua y por eso, aumenta el volumen de la sangre.",
          "Profundiza: La bomba sodio-potasio (Na⁺/K⁺-ATPasa) utiliza ATP para expulsar sodio de la célula e introducir potasio, creando lo necesario para la transmisión de impulsos nerviosos, la contracción muscular y el transporte de muchas moléculas, como la glucosa o algunos aminoácidos.",
        ],
      },
      {
        key: "potasio",
        titulo: "Potasio (K⁺)",
        foto: "/recorrido/nutricion/moleculas/potasio.png",
        grupo: "⚡ Electrolitos",
        parrafos: [
          "Es el principal electrolito dentro de las células.",
          "Gracias a la diferencia generada por la bomba sodio-potasio, el potasio puede salir temporalmente de la célula durante un impulso nervioso y volver después a su estado inicial.",
          "Este movimiento permite que neuronas, músculos y corazón transmitan señales eléctricas de forma coordinada.",
        ],
      },
      {
        key: "calcio",
        titulo: "Calcio (Ca²⁺)",
        foto: "/recorrido/nutricion/moleculas/calcio.png",
        grupo: "⚡ Electrolitos",
        parrafos: [
          "Además de formar parte de los huesos y dientes, el calcio actúa como una señal química dentro de las células.",
          "Permite que los músculos se contraigan, que las neuronas liberen neurotransmisores y que la sangre pueda coagular correctamente.",
        ],
      },
      {
        key: "magnesio",
        titulo: "Magnesio (Mg²⁺)",
        foto: "/recorrido/nutricion/moleculas/magnesio.png",
        grupo: "⚡ Electrolitos",
        parrafos: [
          "El ATP casi nunca existe libre dentro de las células. Normalmente está unido a un ion de magnesio formando Mg-ATP, la forma que necesitan la mayoría de las enzimas.",
          "Sin magnesio, muchas de ellas no podrían utilizar la energía almacenada en el ATP, por lo que la célula sería mucho menos eficiente.",
          "Además, se necesita para activar cientos de enzimas implicadas en la síntesis de ADN, ARN y proteínas, así como en la respiración celular y la producción de energía.",
        ],
      },
      {
        key: "cloruro",
        titulo: "Cloruro (Cl⁻)",
        foto: "/recorrido/nutricion/moleculas/cloruro.png",
        grupo: "⚡ Electrolitos",
        parrafos: [
          "Presente en gran parte del líquido que rodea a las células y acompaña al sodio para mantener el equilibrio eléctrico y el movimiento del agua entre los distintos tejidos.",
          "También desempeña una función esencial en el estómago: las células de la mucosa gástrica combinan cloruro con protones (H⁺) para formar ácido clorhídrico (HCl), imprescindible para desnaturalizar las proteínas de los alimentos, activar la enzima pepsina y destruir muchos microorganismos que ingerimos.",
        ],
      },
      {
        key: "fosfato",
        titulo: "Fosfato (PO₄³⁻)",
        foto: "/recorrido/nutricion/moleculas/fosfato.png",
        grupo: "⚡ Electrolitos",
        parrafos: [
          "El fosfato es uno de los componentes más importantes de la vida.",
          "Forma parte del ATP, donde almacena la energía química; del ADN y el ARN, donde une los nucleótidos formando su estructura; y de los fosfolípidos, que construyen las membranas celulares.",
          "Además, muchas enzimas regulan la actividad de otras proteínas añadiéndoles o retirándoles un grupo fosfato, un proceso llamado fosforilación, que actúa como un auténtico interruptor molecular.",
        ],
      },
      {
        key: "hierro",
        titulo: "Hierro (Fe)",
        foto: "/recorrido/nutricion/moleculas/hierro.png",
        grupo: "🧱 Minerales",
        parrafos: [
          "Es un componente esencial de la hemoglobina de los glóbulos rojos y de la mioglobina de los músculos.",
          "Permite transportar oxígeno desde los pulmones hasta los tejidos y participar en la producción de energía dentro de las mitocondrias.",
          "Además, forma parte de numerosas enzimas implicadas en la respiración celular y en la síntesis de ADN.",
        ],
      },
      {
        key: "zinc",
        titulo: "Zinc (Zn)",
        foto: "/recorrido/nutricion/moleculas/zinc.png",
        grupo: "🧱 Minerales",
        parrafos: [
          "Participa como cofactor en más de 300 enzimas implicadas en la síntesis de ADN y proteínas, la división celular, la cicatrización y el metabolismo de los nutrientes.",
          "Además, es fundamental para el correcto funcionamiento del sistema inmunitario y ayuda a regular la expresión de numerosos genes.",
        ],
      },
      {
        key: "cobre",
        titulo: "Cobre (Cu)",
        foto: "/recorrido/nutricion/moleculas/cobre.png",
        grupo: "🧱 Minerales",
        parrafos: [
          "El cobre participa en enzimas que intervienen en la producción de energía, la formación del tejido conectivo y la protección frente al estrés oxidativo.",
          "También es necesario para el metabolismo del hierro y para la síntesis de hemoglobina, por lo que contribuye indirectamente al transporte de oxígeno.",
        ],
      },
      {
        key: "yodo",
        titulo: "Yodo (I)",
        foto: "/recorrido/nutricion/moleculas/yodo.png",
        grupo: "🧱 Minerales",
        parrafos: [
          "El yodo es imprescindible para fabricar las hormonas tiroideas (T₃ y T₄).",
          "Estas hormonas regulan el metabolismo, el crecimiento, el desarrollo del sistema nervioso y el consumo de energía por las células.",
        ],
      },
      {
        key: "selenio",
        titulo: "Selenio (Se)",
        foto: "/recorrido/nutricion/moleculas/selenio.png",
        grupo: "🧱 Minerales",
        parrafos: [
          "Forma parte de varias enzimas antioxidantes que protegen a las células frente al daño causado por los radicales libres.",
          "Además, participa en el funcionamiento de la glándula tiroides y contribuye al correcto funcionamiento del sistema inmunitario.",
        ],
      },
      {
        key: "manganeso",
        titulo: "Manganeso (Mn)",
        foto: "/recorrido/nutricion/moleculas/manganeso.png",
        grupo: "🧱 Minerales",
        parrafos: [
          "Actúa como cofactor de diversas enzimas implicadas en el metabolismo de carbohidratos, proteínas y grasas.",
          "También participa en la formación del hueso y en mecanismos antioxidantes celulares.",
        ],
      },
    ],
  },
  {
    key: "fibra",
    label: "Fibra",
    color: "#6fa86b",
    img: "/recorrido/nutricion/portadas/fibra.png",
    resumen: "No se absorbe, pero lo ordena todo.",
    descripcion: [
      "La fibra apenas se digiere ni se absorbe como el resto de nutrientes, pero desempeña un papel fundamental en la salud global del organismo. Regula la digestión, prolonga la sensación de saciedad y sirve de alimento para las bacterias beneficiosas del intestino.",
      "La fibra soluble forma un gel que ayuda a regular el azúcar y el colesterol, mientras que la fibra insoluble aporta volumen a las heces y acelera el tránsito intestinal.",
    ],
    tipos: [
      { nombre: "Soluble", desc: "Forma un gel: regula el azúcar y el colesterol, y alimenta a la microbiota." },
      { nombre: "Insoluble", desc: "Da volumen y acelera el tránsito intestinal." },
    ],
    queHacen: [
      "No se digiere ni se absorbe como el resto de nutrientes.",
      "Regula la digestión y prolonga la sensación de saciedad.",
      "Es el alimento de las bacterias buenas de tu intestino.",
    ],
    donde: ["Verduras", "Fruta con piel", "Legumbres", "Avena", "Cereales integrales"],
    tarjetas: [
      {
        key: "soluble",
        titulo: "Fibra soluble",
        foto: "/recorrido/nutricion/moleculas/fibrasoluble.png",
        parrafos: [
          "Se disuelve en agua y forma un gel dentro del intestino. Ese gel ralentiza la digestión, hace que la glucosa llegue más lentamente a la sangre y ayuda a reducir los niveles de colesterol.",
          "Se encuentra en alimentos como la avena, las legumbres, las manzanas o las semillas de chía.",
        ],
      },
      {
        key: "insoluble",
        titulo: "Fibra insoluble",
        foto: "/recorrido/nutricion/moleculas/fibrainsoluble.png",
        parrafos: [
          "No se disuelve en agua y apenas cambia durante la digestión. Aumenta el volumen del contenido intestinal y facilita su paso, ayudando a mantener un tránsito intestinal saludable.",
          "Se encuentra sobre todo en cereales integrales, verduras, frutos secos y la piel de muchas frutas.",
        ],
      },
      {
        key: "fermentable",
        titulo: "Fibra fermentable",
        foto: "/recorrido/nutricion/moleculas/fibrafermentable.png",
        parrafos: [
          "Algunas fibras pueden ser fermentadas por las bacterias del intestino grueso. Al hacerlo producen ácidos grasos de cadena corta, como el butirato, el propionato y el acetato, que ayudan a mantener sana la pared intestinal y participan en la regulación del metabolismo y del sistema inmunitario.",
        ],
      },
    ],
  },
  {
    key: "colesterol",
    label: "Colesterol",
    color: "#e6c34d",
    img: "/recorrido/nutricion/portadas/colesterolportada.png",
    resumen: "Ni bueno ni malo: materia prima esencial.",
    descripcion: [
      "El colesterol es esencial para el organismo. Forma parte de la membrana de todas tus células y es la base para fabricar hormonas, vitamina D y sales biliares.",
      "El hígado produce la mayor parte del colesterol que necesitas. Lo importante no es solo la cantidad de colesterol, sino también la forma en que se transporta por la sangre, mediante las lipoproteínas HDL y LDL.",
    ],
    tipos: [
      { nombre: "HDL", desc: "El que retira el colesterol sobrante y lo lleva al hígado. El «que limpia»." },
      { nombre: "LDL", desc: "El que reparte colesterol a las células. En exceso se acumula en las arterias." },
    ],
    queHacen: [
      "Forma parte de la membrana de todas tus células y les da firmeza.",
      "Es la base con la que se fabrican hormonas, vitamina D y sales biliares.",
      "El cuerpo fabrica la mayor parte en el hígado; solo una parte viene de la dieta.",
    ],
    donde: ["Huevo", "Vísceras", "Marisco", "Lácteos enteros", "Carnes grasas"],
    tarjetas: [
      {
        key: "colesterol",
        titulo: "Colesterol",
        foto: "/recorrido/nutricion/moleculas/colesterol.png",
        parrafos: [
          "El colesterol es una molécula grasa (un lípido) que forma parte de la membrana de todas tus células, dándoles firmeza y a la vez flexibilidad, es como el cemento de la membrana celular.",
          "Es la materia prima con la que el cuerpo fabrica hormonas (como los estrógenos, la testosterona o el cortisol), también fabrica vitamina D y las sales biliares que ayudan a digerir las grasas.",
          "La mayor parte del colesterol la fabrica tu propio hígado; solo una pequeña parte procede de los alimentos. Por eso no es ni bueno ni malo: es imprescindible. El problema no es el colesterol en sí, sino cómo viaja por la sangre.",
          "Como es grasa, no se disuelve en la sangre (que es agua). Para poder moverse, viaja empaquetado dentro de unas partículas llamadas lipoproteínas: las dos principales son la LDL y la HDL.",
        ],
      },
      {
        key: "hdl",
        titulo: "HDL",
        foto: "/recorrido/nutricion/moleculas/hdl.png",
        parrafos: [
          "La HDL (lipoproteína de alta densidad) es la partícula que hace el camino de vuelta: recoge el colesterol sobrante de los tejidos y de las paredes de las arterias y lo devuelve al hígado para reciclarlo o eliminarlo.",
          "Por eso se le llama coloquialmente «colesterol bueno»: ayuda a retirar el exceso y a mantener las arterias limpias.",
          "Unos niveles altos de HDL se asocian con una mejor salud cardiovascular. El ejercicio físico y las grasas saludables (aceite de oliva, pescado azul, tofu, frutos secos) ayudan a elevarla.",
        ],
      },
      {
        key: "ldl",
        titulo: "LDL",
        foto: "/recorrido/nutricion/moleculas/ldl.png",
        parrafos: [
          "La LDL (lipoproteína de baja densidad) es la partícula que reparte el colesterol desde el hígado hacia las células que lo necesitan.",
          "Se le llama coloquialmente «colesterol malo», pero cumple una función necesaria. El problema aparece cuando hay demasiadas partículas LDL circulando: pueden quedarse pegadas y oxidarse en la pared de las arterias, formando placas que las estrechan (aterosclerosis).",
          "Por eso interesa mantener la LDL en niveles adecuados, sobre todo evitando el exceso de grasas trans, el tabaco y el sobrepeso.",
        ],
      },
    ],
  },
  {
    key: "etanol",
    label: "Etanol",
    color: "#b56576",
    img: "/recorrido/nutricion/portadas/alcohol.png",
    resumen: "Alcohol: energía vacía que el cuerpo prioriza.",
    descripcion: [
      "El etanol es el alcohol presente en las bebidas alcohólicas. Aporta 7 kcal por gramo, pero no contiene vitaminas ni minerales, por lo que se considera una fuente de «calorías vacías». Es más, el organismo lo trata como una sustancia potencialmente tóxica y lo metaboliza en el hígado con prioridad sobre otros nutrientes.",
    ],
    tipos: [
      { nombre: "Etanol", desc: "El único alcohol que bebemos. Se forma al fermentar azúcares." },
      { nombre: "Metanol y otros", desc: "Tóxicos: no son aptos para el consumo." },
    ],
    queHacen: [
      "Aporta 7 kcal por gramo, pero sin vitaminas ni minerales: «calorías vacías».",
      "El cuerpo lo trata como un tóxico y lo procesa en el hígado antes que nada.",
      "Mientras lo elimina, frena la quema de grasa y sobrecarga el hígado.",
    ],
    donde: ["Vino", "Cerveza", "Licores y destilados", "Fermentados alcohólicos"],
    tarjetas: [
      {
        key: "etanol",
        titulo: "Etanol (CH₃CH₂OH)",
        numero: 1,
        foto: "/recorrido/nutricion/moleculas/etanol.png",
        parrafos: [
          "Es la molécula presente en las bebidas alcohólicas.",
          "Aporta energía (7 kcal por gramo, casi las mismas que la grasa, es decir el alcohol es muy calórico), pero no es un nutriente esencial ni participa en la construcción de tejidos.",
          "Cuando llega al hígado, el organismo prioriza eliminarlo porque puede resultar tóxico para las células. Es más, aunque lo elimine rápidamente, siempre causa algún daño secundario. Nuestras acciones no son gratis.",
        ],
      },
      {
        key: "acetaldehido",
        titulo: "Acetaldehído (CH₃CHO)",
        numero: 2,
        foto: "/recorrido/nutricion/moleculas/acetaldehido.png",
        parrafos: [
          "Es la primera molécula que se forma cuando el hígado metaboliza el etanol.",
          "Es mucho más reactiva y tóxica que el propio alcohol, pudiendo dañar proteínas, membranas y ADN si permanece demasiado tiempo en las células. Por eso el organismo intenta transformarla rápidamente.",
        ],
      },
      {
        key: "acetato",
        titulo: "Acetato (CH₃COO⁻)",
        numero: 3,
        foto: "/recorrido/nutricion/moleculas/acetatoalcohol.png",
        parrafos: [
          "Es el producto final del metabolismo del alcohol. Es una molécula mucho menos tóxica que puede utilizarse para producir energía o eliminarse.",
          "Transformar el acetaldehído en acetato es uno de los principales objetivos del hígado tras consumir alcohol.",
        ],
      },
    ],
  },
  {
    key: "agua",
    label: "Agua",
    color: "#4aa3c7",
    img: "/recorrido/nutricion/portadas/agua.png",
    resumen: "El medio donde ocurre toda la vida.",
    descripcion: [
      "El agua es el medio donde ocurre toda la Vida: en ella tienen lugar prácticamente todas las reacciones químicas del organismo.",
      "Transporta oxígeno, nutrientes y hormonas, elimina desechos, regula la temperatura corporal y lubrica articulaciones y órganos. Aproximadamente dos tercios del agua del cuerpo se encuentran dentro de las células y el resto las rodea.",
    ],
    tipos: [
      { nombre: "Agua intracelular", desc: "La que está dentro de las células: unos dos tercios del total." },
      { nombre: "Agua extracelular", desc: "La que rodea las células y forma el plasma de la sangre." },
    ],
    queHacen: [
      "Es el medio donde ocurren todas las reacciones químicas del cuerpo.",
      "Transporta oxígeno, nutrientes y hormonas, y elimina los desechos.",
      "Regula la temperatura y lubrica articulaciones, ojos y cerebro.",
    ],
    donde: ["Agua", "Frutas y verduras", "Caldos y sopas", "Infusiones", "Lácteos"],
  },
  {
    key: "fitoquimicos",
    label: "Fitoquímicos",
    color: "#8e5aa8",
    img: "/recorrido/nutricion/portadas/fitoquimico.png",
    resumen: "La defensa de las plantas, a tu favor.",
    descripcion: [
      "Los fitoquímicos son compuestos naturales que las plantas producen para protegerse y que también benefician a nuestra salud. Muchos actúan como antioxidantes que neutralizan los radicales libres, mientras que otros activan mecanismos de defensa del propio organismo. Cada color de frutas y verduras esconde una familia distinta de fitoquímicos. Por eso, una alimentación variada y rica en vegetales aporta una mayor diversidad de estos compuestos beneficiosos.",
    ],
    tipos: [
      { nombre: "Flavonoides", desc: "Pigmentos antioxidantes de frutas, verduras y té." },
      { nombre: "Carotenoides", desc: "Los pigmentos naranjas y rojos (zanahoria, tomate)." },
      { nombre: "Glucosinolatos", desc: "De las crucíferas (brócoli): activan enzimas protectoras." },
    ],
    queHacen: [
      "Muchos actúan como antioxidantes y neutralizan radicales libres.",
      "Otros activan genes que hacen fabricar enzimas protectoras propias.",
      "Cada color esconde una familia distinta con funciones distintas.",
    ],
    donde: ["Frutas de colores", "Verduras", "Legumbres", "Frutos secos", "Especias (cúrcuma)"],
    tarjetas: [
      {
        key: "antocianinas",
        titulo: "Antocianinas",
        foto: "/recorrido/nutricion/moleculas/antocianinas.png",
        parrafos: [
          "Son los pigmentos que dan el color morado, azul y rojo intenso a alimentos como los arándanos, las moras, las cerezas o la col lombarda.",
          "En las plantas ayudan a proteger frente a la radiación ultravioleta y al estrés ambiental.",
          "En nuestro organismo actúan como antioxidantes, es decir, donan electrones a radicales libres (moléculas que buscan electrones) antes de que dañen proteínas, grasas o ADN.",
          "Además, pueden mejorar la función del endotelio, la capa que recubre el interior de los vasos sanguíneos, favoreciendo una buena salud cardiovascular.",
        ],
      },
      {
        key: "carotenoides",
        titulo: "Carotenoides",
        foto: "/recorrido/nutricion/moleculas/carotenoides.png",
        parrafos: [
          "Son pigmentos amarillos, naranjas y rojos presentes en zanahorias, calabazas, tomates, pimientos y muchas frutas.",
          "En las plantas capturan parte de la energía de la luz y las protegen del exceso de radiación solar.",
          "Algunos, como el betacaroteno, pueden transformarse en vitamina A. Otros, como la luteína y la zeaxantina, se acumulan en la retina, donde ayudan a filtrar la luz azul y protegen las células fotorreceptoras frente al daño oxidativo.",
        ],
      },
      {
        key: "flavonoides",
        titulo: "Flavonoides",
        foto: "/recorrido/nutricion/moleculas/flavonoides.png",
        parrafos: [
          "Constituyen una de las familias más abundantes de fitoquímicos y se encuentran en frutas, verduras, cebolla, cacao, té y cítricos.",
          "Muchas de estas moléculas actúan como antioxidantes, pero también regulan la actividad de enzimas y proteínas implicadas en la inflamación, la coagulación y la función de los vasos sanguíneos.",
          "Algunos incluso favorecen la producción de óxido nítrico, ayudando a que las arterias se relajen.",
        ],
      },
      {
        key: "glucosinolatos",
        titulo: "Glucosinolatos",
        foto: "/recorrido/nutricion/moleculas/glucosinolatos.png",
        parrafos: [
          "Son compuestos característicos del brócoli, la col, la coliflor o las coles de Bruselas.",
          "Mientras la planta permanece intacta apenas reaccionan, pero al cortarla o masticarla entran en contacto con una enzima, que los transforma en moléculas como el sulforafano.",
          "Estas aumentan la producción de enzimas antioxidantes y de desintoxicación propias de nuestras células.",
        ],
      },
      {
        key: "polifenoles",
        titulo: "Polifenoles",
        foto: "/recorrido/nutricion/moleculas/polifenoles.png",
        parrafos: [
          "Los polifenoles son una gran familia que engloba miles de fitoquímicos, incluidos muchos flavonoides.",
          "Se encuentran en el aceite de oliva virgen extra, el cacao, el café, las uvas, el té y numerosos frutos.",
          "Más que actuar directamente como antioxidantes, muchos funcionan como moléculas señalizadoras que modifican la expresión de genes relacionados con la inflamación, el metabolismo y la protección frente al estrés oxidativo.",
        ],
      },
      {
        key: "fitoesteroles",
        titulo: "Fitoesteroles",
        foto: "/recorrido/nutricion/moleculas/fitoesteroles.png",
        parrafos: [
          "Son moléculas vegetales con una estructura muy parecida al colesterol.",
          "Durante la digestión compiten con él por los mismos transportadores del intestino, reduciendo así la cantidad de colesterol que conseguimos absorber.",
          "Como consecuencia, el hígado capta más colesterol de la sangre para compensar esa pérdida, contribuyendo a disminuir los niveles de colesterol LDL.",
        ],
      },
      {
        key: "terpenos",
        titulo: "Terpenos",
        foto: "/recorrido/nutricion/moleculas/terpenos.png",
        parrafos: [
          "Son una enorme familia de moléculas aromáticas presentes en hierbas, especias, cítricos y muchas plantas medicinales.",
          "En la naturaleza sirven para atraer polinizadores, repeler insectos o defenderse de microorganismos.",
          "Algunos, como el limoneno, el mentol o el pineno, también muestran propiedades antioxidantes, antiinflamatorias y antimicrobianas para nosotros.",
        ],
      },
      {
        key: "licopeno",
        titulo: "Licopeno",
        foto: "/recorrido/nutricion/moleculas/licopeno.png",
        parrafos: [
          "El licopeno es un carotenoide responsable del intenso color rojo del tomate, la sandía y el pomelo rosa.",
          "Destaca por su capacidad para neutralizar el oxígeno singlete, una forma muy reactiva del oxígeno que puede dañar las membranas celulares y el ADN.",
          "Diversos estudios lo relacionan con una mejor salud cardiovascular y con la protección de algunos tejidos, como la próstata, aunque todavía se sigue investigando su papel exacto.",
        ],
      },
      {
        key: "isoflavonas",
        titulo: "Isoflavonas",
        foto: "/recorrido/nutricion/moleculas/isoflavonas.png",
        parrafos: [
          "Son flavonoides presentes principalmente en la soja, el tofu, el tempeh y otros derivados.",
          "Su estructura se parece a la de los estrógenos humanos, por lo que pueden unirse a algunos de sus receptores, aunque con una intensidad mucho menor.",
          "Dependiendo del tejido, pueden activar o bloquear parcialmente esos receptores, motivo por el que se estudian por su posible papel en la salud ósea, cardiovascular y en el alivio de algunos síntomas de la menopausia.",
        ],
      },
    ],
  },
];

// El recorrido de nutrientes se divide en DOS páginas para hacer más trayecto:
//   · /metodo/nutricion/nutrientes            → NUTRIENTES_PRINCIPALES (hasta Fibra)
//   · /metodo/nutricion/nutrientes-secundarios → NUTRIENTES_SECUNDARIOS (el resto)
// La página de detalle sigue buscando en NUTRIENTES (la lista completa), así que
// ambos grupos funcionan igual al abrir una tarjeta.
const CORTE_SECUNDARIOS = NUTRIENTES.findIndex((n) => n.key === "fibra") + 1;
export const NUTRIENTES_PRINCIPALES = NUTRIENTES.slice(0, CORTE_SECUNDARIOS);
export const NUTRIENTES_SECUNDARIOS = NUTRIENTES.slice(CORTE_SECUNDARIOS);

// Dado un key de nutriente, indica a qué página de la rejilla pertenece (para
// que el botón «Volver» del detalle regrese a la página correcta).
export const rutaListaNutriente = (key: string): string =>
  NUTRIENTES_SECUNDARIOS.some((n) => n.key === key)
    ? "/metodo/nutricion/nutrientes-secundarios"
    : "/metodo/nutricion/nutrientes";
