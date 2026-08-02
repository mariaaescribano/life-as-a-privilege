import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Cómics de cada GRUPO de nutrientes. Se muestran en la página de detalle
// (/metodo/nutricion/nutrientes/:key), en el box tipo cómic (foto 1:1 a la
// izquierda + texto a la derecha, con scroll). Uno por grupo.
//
// Imágenes: /viñetas/nutricion/<key>/<key>1.png … (PENDIENTES de subir; hasta
// entonces el cómic pinta un placeholder).
// ─────────────────────────────────────────────────────────────────────────

const src = (key: string, i: number) => `/viñetas/nutricion/${key}/${key}${i}.png`;

export const COMICS_NUTRIENTES: Record<string, Vineta[]> = {
  carbohidratos: [
    {
      src: src("carbohidratos", 1),
      paragraphs: [
        "Sabemos que las verduras y las frutas son saludables. Pero ¿por qué? Casi nadie nos lo ha explicado.",
        "En realidad, la respuesta está en cómo nuestro cuerpo obtiene la energía.",
        "Nuestras células necesitan glucosa para fabricar ATP, la molécula que utilizan para realizar su trabajo.",
        "Si no hay suficiente glucosa, nuestro sabio cuerpo puede recurrir a las grasas como combustible. Pero esa es otra historia llamada cetosis...",
      ],
    },
    {
      src: src("carbohidratos", 2),
      paragraphs: [
        "Necesitamos glucosa, sí. Pero la necesitamos poco a poco. Si llega demasiado rápido a la sangre, el organismo tiene que hacer un gran esfuerzo para mantener el equilibrio.",
        "Lo ideal es que las células la reciban de forma gradual.",
        "Eso es precisamente lo que consiguen las verduras, las frutas y las legumbres: su estructura hace que la digestión sea más lenta y que la glucosa se vaya liberando poco a poco, justo como nuestro cuerpo prefiere.",
      ],
    },
    {
      src: src("carbohidratos", 3),
      paragraphs: [
        "Esta es la razón por la que el azúcar nos gusta tanto.",
        "Apenas necesita digestión y las moléculas llegan muy rápido a la sangre, provocando un pico de glucosa al que el organismo tiene que responder inmediatamente.",
        "El problema no es la glucosa. El problema es la velocidad con la que llega.",
      ],
    },
    {
      src: src("carbohidratos", 4),
      paragraphs: [
        "Por eso, no te juzgues. Tu cuerpo simplemente está respondiendo como ha aprendido a hacerlo durante millones de años.",
        "Pero ahora que entiendes cómo funciona, puedes elegir alimentos que trabajen a favor de tu equilibrio.",
      ],
    },
  ],

  grasas: [
    {
      src: src("grasas", 1),
      paragraphs: [
        "Durante muchos años nos hicieron creer que toda la grasa era mala. Pero la realidad es muy distinta. Sin grasa, no existirías, porque ni tus células ni tus hormonas podrían existir.",
        "Las grasas no solo sirven para almacenar energía. También construyen las membranas de todas las células, participan en la fabricación de hormonas y ayudan a absorber vitaminas esenciales. Son un material de construcción imprescindible.",
      ],
    },
    {
      src: src("grasas", 2),
      paragraphs: [
        "Hay distintos tipos de grasas, no son todas iguales. Su diferencia está en la forma de sus moléculas. Y esa forma cambia cómo funcionan nuestras células.",
        "Las grasas insaturadas tienen una forma curvada. Esa pequeña curva permite que las células puedan comunicarse y mantiene las membranas celulares flexibles. Justo como necesita una célula sana.",
      ],
    },
    {
      src: src("grasas", 3),
      paragraphs: [
        "Las grasas saturadas son completamente rectas. Hacen que las membranas sean más rígidas y, en exceso, pueden dificultar que funcionen con la misma flexibilidad. Nuestro cuerpo las utiliza, pero un equilibrio entre distintos tipos de grasas permite que las células trabajen mejor.",
        "Las grasas trans son especialmente perjudiciales. Su estructura altera el funcionamiento normal de las membranas y favorece procesos relacionados con la inflamación y un aumento del colesterol LDL, incrementando el riesgo de enfermedad cardiovascular.",
      ],
    },
    {
      src: src("grasas", 4),
      paragraphs: [
        "Las grasas no son el enemigo. Lo importante es elegir aquellas con las que nuestras células llevan millones de años trabajando.",
        "Porque cada membrana de tu cuerpo está construida, literalmente, con la grasa que comes.",
      ],
    },
  ],

  proteinas: [
    {
      src: src("proteinas", 1),
      paragraphs: [
        "Cuando comes proteínas, no estás alimentando directamente tus músculos.",
        "En realidad, tu cuerpo primero tiene que desmontarlas por completo.",
        "Solo entonces podrá decidir qué hacer con cada una de sus piezas.",
        "Las enzimas digestivas cortan las proteínas hasta separarlas en moléculas mucho más pequeñas llamadas aminoácidos. Son los auténticos ladrillos con los que trabaja el organismo.",
      ],
    },
    {
      src: src("proteinas", 2),
      paragraphs: [
        "Existen veinte aminoácidos principales. Nuestro cuerpo puede fabricar algunos. Pero otros, llamados esenciales, solo podemos obtenerlos a través de la alimentación.",
        "Una vez dentro de las células, los aminoácidos ya no «pertenecen» a la soja, al huevo o a las lentejas.",
        "Ahora son simplemente piezas disponibles para construir lo que el organismo necesite.",
      ],
    },
    {
      src: src("proteinas", 3),
      paragraphs: [
        "Algunas células los utilizarán para fabricar músculo. Otras crearán colágeno para la piel. Otras producirán anticuerpos, hormonas o miles de proteínas diferentes.",
        "Entre todas esas proteínas hay unas especialmente importantes: las enzimas.",
        "Las enzimas son las responsables de que casi todas las reacciones químicas del cuerpo ocurran a la velocidad necesaria para mantenernos vivos.",
      ],
    },
    {
      src: src("proteinas", 4),
      paragraphs: [
        "Una enzima no aporta energía. Tampoco se consume. Simplemente acerca las moléculas adecuadas y hace posible que la reacción ocurra millones de veces más rápido.",
        "Gracias a las enzimas podemos digerir alimentos, copiar el ADN, fabricar ATP, reparar tejidos y realizar prácticamente todas las funciones necesarias para vivir. Sin ellas, la Vida sería demasiado lenta para existir.",
        "Cada proteína que comes termina convertida en aminoácidos. Y con esos mismos aminoácidos tu cuerpo fabrica músculo, piel, hormonas, anticuerpos... e incluso las enzimas que hacen funcionar todas tus células.",
        "Una vez más, lo que comes acaba literalmente convirtiéndose en ti.",
      ],
    },
  ],

  vitaminas: [
    {
      src: src("vitaminas", 1),
      paragraphs: [
        "Si las proteínas son los ladrillos... y la glucosa proporciona energía... ¿para qué sirven entonces las vitaminas? La respuesta es inesperada.",
        "Las vitaminas no aportan energía. Tampoco construyen músculos ni membranas. Sin embargo, muchísimas reacciones celulares simplemente no podrían ocurrir.",
      ],
    },
    {
      src: src("vitaminas", 2),
      paragraphs: [
        "Las vitaminas activan a las enzimas. Sin las vitaminas, las enzimas se quedarían apagadas, «sin Vida».",
        "Aunque solo las necesitamos en cantidades muy pequeñas... participan en miles de procesos distintos. Fabricar energía, reparar tejidos, producir ADN o proteger nuestras células.",
        "Nuestro cuerpo es sabio y las reutiliza una y otra vez mientras pueda.",
      ],
    },
    {
      src: src("vitaminas", 3),
      paragraphs: [
        "Cada vitamina tiene una función diferente. Algunas ayudan al sistema inmunitario. Otras participan en la visión, los huesos, la sangre o el sistema nervioso.",
        "Además, cuando aparecen radicales libres —moléculas muy inestables porque les falta un electrón— intentan robárselo a otras moléculas, provocando una reacción en cadena. Los antioxidantes pueden donar los electrones necesarios para neutralizarlos y frenar ese proceso.",
      ],
    },
    {
      src: src("vitaminas", 4),
      paragraphs: [
        "Por eso una alimentación variada es tan importante. Ningún alimento contiene todas las vitaminas en la cantidad adecuada. Nuestro cuerpo necesita muchas piezas diferentes.",
        "Las vitaminas no son el combustible. Tampoco los ladrillos. Son las pequeñas herramientas que permiten que toda la maquinaria del organismo siga funcionando.",
      ],
    },
  ],

  minerales: [
    {
      src: src("minerales", 1),
      paragraphs: [
        "Ya conocemos los carbohidratos, las grasas, las proteínas y las vitaminas. Pero todavía falta una pieza. Los minerales. Y sin ellos, la Vida tampoco sería posible.",
        "Los minerales son elementos químicos. Nuestro cuerpo no puede fabricarlos. Cada átomo de calcio, hierro o magnesio que tienes llegó algún día a través de los alimentos o del agua.",
      ],
    },
    {
      src: src("minerales", 2),
      paragraphs: [
        "Algunos minerales forman parte de la estructura de nuestro cuerpo. El calcio y el fósforo ayudan a construir huesos y dientes. No los recubren. Forman parte de ellos.",
        "Otros minerales permiten que las células funcionen. El sodio y el potasio hacen posible que las neuronas transmitan impulsos eléctricos. El calcio permite que los músculos se contraigan.",
      ],
    },
    {
      src: src("minerales", 3),
      paragraphs: [
        "El hierro tiene una función muy especial. Forma parte de la hemoglobina, la proteína que transporta el oxígeno por la sangre. Sin hierro, nuestras células no podrían recibir oxígeno.",
        "Minerales como el magnesio o el zinc ayudan a cientos de enzimas a realizar su trabajo. Sin ellos, muchas reacciones del organismo serían mucho más lentas o simplemente no ocurrirían.",
      ],
    },
    {
      src: src("minerales", 4),
      paragraphs: [
        "Los minerales permiten que las células, los órganos y, por extensión, tú, funcionen. Los minerales permiten la Vida.",
      ],
    },
  ],

  fibra: [
    {
      src: src("fibra", 1),
      paragraphs: [
        "La fibra también es un carbohidrato. Pero hay una gran diferencia. Nuestras enzimas no pueden romperla. Por eso llega casi intacta al intestino grueso.",
        "No toda la fibra es igual. Existen dos grandes tipos. Fibra soluble y fibra insoluble. Ambas son importantes, pero cumplen funciones diferentes.",
      ],
    },
    {
      src: src("fibra", 2),
      paragraphs: [
        "La fibra soluble se mezcla con el agua y forma un gel. Ese gel hace que la digestión sea más lenta y que la glucosa llegue poco a poco a la sangre. Indirectamente baja los niveles de colesterol en la sangre.",
        "La fibra insoluble no forma gel. Aumenta el volumen de las heces y facilita su paso por el intestino. Ayuda a mantener un tránsito intestinal saludable.",
      ],
    },
    {
      src: src("fibra", 3),
      paragraphs: [
        "Pero la fibra tiene otra función aún más sorprendente. Muchas bacterias de nuestro intestino pueden alimentarse de ella. Nosotros no podemos digerirla. Ellas sí.",
        "Al fermentar esa fibra producen pequeñas moléculas llamadas ácidos grasos de cadena corta. Estas moléculas ayudan a mantener sano el intestino y participan en la regulación del sistema inmunitario y del metabolismo.",
      ],
    },
    {
      src: src("fibra", 4),
      paragraphs: [
        "La fibra se encuentra principalmente en frutas, verduras, legumbres, frutos secos y cereales integrales. Cuanto menos procesado está un alimento vegetal, más fibra suele conservar.",
        "La fibra no aporta mucha energía a nuestro cuerpo. Pero alimenta a nuestra microbiota, regula la digestión y ayuda a mantener el equilibrio del organismo. A veces, lo más importante no es lo que tú digieres... sino lo que alimenta a distintas partes de ti.",
      ],
    },
  ],

  colesterol: [
    {
      src: src("colesterol", 1),
      paragraphs: [
        "Durante años hemos oído hablar del colesterol «bueno» y del colesterol «malo». Pero aquí hay un detalle importante:",
        "El colesterol siempre es la misma molécula. Lo que cambia es quién lo transporta.",
        "El colesterol no es un enemigo. De hecho, todas tus células lo necesitan. Forma parte de las membranas celulares y es imprescindible para fabricar hormonas, vitamina D y ácidos biliares.",
      ],
    },
    {
      src: src("colesterol", 2),
      paragraphs: [
        "Como el colesterol no puede viajar solo por la sangre, necesita un transporte. Ese transporte lo realizan unas partículas llamadas lipoproteínas.",
        "Las LDL llevan colesterol desde el hígado hacia los tejidos. Es un trabajo completamente normal. Las células necesitan ese colesterol para funcionar.",
      ],
    },
    {
      src: src("colesterol", 3),
      paragraphs: [
        "El problema aparece cuando hay demasiadas partículas LDL circulando. Algunas pueden quedarse retenidas en la pared de las arterias. Con el tiempo, esto puede iniciar una respuesta inflamatoria.",
        "El sistema inmunitario intenta limpiar ese colesterol. Los macrófagos lo engullen una y otra vez. Pero si la acumulación continúa, acaban transformándose en células espumosas y comienza la formación de la placa.",
      ],
    },
    {
      src: src("colesterol", 4),
      paragraphs: [
        "Las HDL hacen el camino contrario. Recogen parte del colesterol sobrante de los tejidos y de las arterias y lo llevan de vuelta al hígado para reciclarlo o eliminarlo.",
        "Por eso se suele hablar de LDL como «colesterol malo» y HDL como «colesterol bueno». Pero en realidad ninguno de los dos es bueno o malo. Ambos son necesarios. Lo importante es mantener el equilibrio.",
        "El colesterol no es el problema. El problema aparece cuando demasiadas partículas LDL quedan retenidas en la pared de las arterias y el organismo no consigue retirarlas. La salud depende del equilibrio, no de eliminar el colesterol.",
      ],
    },
  ],

  etanol: [
    {
      src: src("etanol", 1),
      paragraphs: [
        "El etanol, el alcohol presente en las bebidas alcohólicas, no es un nutriente. No construye tejidos. No fabrica hormonas. No ayuda a las células a funcionar mejor.",
        "Cuando el alcohol entra en la sangre, el cuerpo cambia sus prioridades. El hígado deja en segundo plano muchas de sus tareas habituales para empezar a eliminarlo cuanto antes.",
      ],
    },
    {
      src: src("etanol", 2),
      paragraphs: [
        "Esto ocurre porque el etanol puede dañar nuestras células. Por eso el organismo intenta transformarlo rápidamente en otras moléculas para poder eliminarlo.",
        "El primer producto de esa transformación es el acetaldehído. Y aquí aparece el verdadero problema. El acetaldehído es aún más tóxico que el propio alcohol.",
        "Si el acetaldehído permanece demasiado tiempo en las células, puede dañar proteínas, membranas y ADN. Por eso el hígado intenta convertirlo rápidamente en una molécula mucho menos dañina: el acetato.",
      ],
    },
    {
      src: src("etanol", 3),
      paragraphs: [
        "Mientras el hígado está ocupado eliminando el alcohol, otras funciones pasan a un segundo plano. Por ejemplo, disminuye la producción de glucosa y se altera el metabolismo de las grasas.",
        "El alcohol también afecta al cerebro. Modifica la comunicación entre las neuronas, alterando el juicio, la coordinación, la memoria y el tiempo de reacción.",
        "Además, al metabolizar el alcohol se generan más radicales libres. Si son demasiados, pueden producir estrés oxidativo y dañar proteínas, grasas y ADN.",
        "Profundiza: el neurotransmisor GABA, encargado de la relajación, aumenta su acción, produciendo relajación y una disminución de la actividad cerebral. En cambio, el glutamato disminuye su actividad, afectando a la memoria y a la capacidad de concentración. La serotonina también se altera, lo que puede modificar el estado de ánimo, las emociones y el comportamiento, favoreciendo cambios como la desinhibición, la impulsividad o la variabilidad emocional.",
      ],
    },
    {
      src: src("etanol", 4),
      paragraphs: [
        "Nuestro cuerpo no necesita alcohol para funcionar.",
        "No es un material de construcción. Aunque puede aportar energía, el organismo no lo considera un nutriente esencial y su prioridad es eliminarlo antes que aprovecharlo.",
        "Lo que haces siempre deja huella.",
      ],
    },
  ],

  agua: [
    {
      src: src("agua", 1),
      paragraphs: [
        "Nuestro cuerpo está formado por unos 37 billones de células. Y la inmensa mayoría vive rodeada de agua. El agua no es solo una bebida. Es el entorno donde ocurre la Vida.",
        "Aproximadamente el 60% de nuestro cuerpo es agua. Dentro de las células, alrededor de ellas y en la sangre. Sin ese medio acuoso, las moléculas ni siquiera podrían encontrarse para reaccionar.",
      ],
    },
    {
      src: src("agua", 2),
      paragraphs: [
        "Todas las reacciones químicas de nuestras células ocurren en agua. Las enzimas, los nutrientes y el ATP necesitan moverse constantemente para encontrarse. El agua hace posible ese movimiento.",
        "El agua también es el gran sistema de transporte del cuerpo. Lleva oxígeno, nutrientes, hormonas y elimina productos de desecho. La sangre es, en gran parte, agua.",
      ],
    },
    {
      src: src("agua", 3),
      paragraphs: [
        "Además, ayuda a mantener estable nuestra temperatura. Cuando sudamos, el agua absorbe calor al evaporarse y evita que el cuerpo se sobrecaliente.",
        "El agua también protege. Lubrica las articulaciones, amortigua golpes y forma parte de líquidos como la saliva, las lágrimas o el líquido cefalorraquídeo.",
        "Nuestro cuerpo pierde agua continuamente al respirar, sudar y orinar. Por eso necesita reponerla cada día. No porque el agua se gaste... sino porque está en constante movimiento.",
      ],
    },
    {
      src: src("agua", 4),
      paragraphs: [
        "El agua no aporta calorías. No construye músculos. No fabrica ATP. Pero sin ella, ninguno de los demás nutrientes podría cumplir su función.",
        "Si los nutrientes son las piezas que mantienen vivo tu cuerpo, el agua es el escenario donde toda esa historia puede ocurrir.",
      ],
    },
  ],

  fitoquimicos: [
    {
      src: src("fitoquimicos", 1),
      paragraphs: [
        "Las plantas no pueden huir de un depredador. Tampoco esconderse del sol. Ni escapar de bacterias, hongos o insectos. Así que tuvieron que desarrollar otra estrategia.",
        "Para sobrevivir, las plantas fabrican miles de moléculas llamadas fitoquímicos. Algunas las protegen de la radiación solar. Otras repelen insectos o combaten microorganismos. Son su sistema de defensa.",
      ],
    },
    {
      src: src("fitoquimicos", 2),
      paragraphs: [
        "Cuando comemos frutas y verduras... También ingerimos esos fitoquímicos. No son vitaminas. No son minerales. Son otra familia completamente distinta de moléculas.",
        "Muchos fitoquímicos actúan como antioxidantes. Ayudan a neutralizar radicales libres antes de que dañen proteínas, grasas o ADN. Así contribuyen a proteger nuestras células.",
      ],
    },
    {
      src: src("fitoquimicos", 3),
      paragraphs: [
        "Otros fitoquímicos no actúan directamente. En lugar de eso, activan genes que hacen que nuestras propias células fabriquen más enzimas protectoras. Es como entrenar al organismo para defenderse mejor.",
        "Cada color suele indicar una familia diferente de fitoquímicos. El rojo, el naranja, el morado o el verde intenso esconden moléculas distintas con funciones distintas.",
      ],
    },
    {
      src: src("fitoquimicos", 4),
      paragraphs: [
        "Por eso comer siempre la misma fruta o la misma verdura no es suficiente. Cuantos más colores diferentes haya en tu plato... Mayor será la variedad de fitoquímicos que recibirán tus células.",
        "Los fitoquímicos no son esenciales para sobrevivir como las vitaminas o los minerales. Pero cada vez sabemos más sobre cómo ayudan a proteger nuestras células y a mantener el organismo en equilibrio. La naturaleza lleva millones de años perfeccionando estas moléculas.",
        "Las plantas no fabricaron estas moléculas para nosotros. Las fabricaron para sobrevivir. Nosotros simplemente aprendimos a beneficiarnos de millones de años de evolución.",
      ],
    },
  ],
};

export const comicNutrienteByKey = (key: string): Vineta[] | undefined =>
  COMICS_NUTRIENTES[key];
