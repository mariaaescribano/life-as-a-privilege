import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// Cómics de cada GRUPO de nutrientes. Se muestran en la página de detalle
// (/metodo/nutricion/nutrientes/:key), en el box tipo cómic (foto 1:1 a la
// izquierda + texto a la derecha, con scroll). Uno por grupo.
//
// Imágenes: /viñetas/nutricion/<key>/<key>1.png … (PENDIENTES de subir; hasta
// entonces el cómic pinta un placeholder).
//
// OJO CON LA EXTENSIÓN: unas carpetas ya se han pasado a WebP (scripts/webp) y
// otras siguen en PNG, así que no puede ser fija. Este helper es UNO para todos
// los cómics, así que `rutas.mjs` no podía reescribirlo por carpetas: al
// convertir los lotes, las viñetas ya convertidas se quedaron pidiendo un .png
// que ya no existe y salían como «próximamente». Aquí van las que YA son WebP;
// al convertir una carpeta nueva hay que añadir sus nombres a la lista.
// ─────────────────────────────────────────────────────────────────────────

const EN_WEBP = new Set([
  "agua1", "agua2", "agua3", "agua4",
  "fitoquimicos1", "fitoquimicos2", "fitoquimicos3", "fitoquimicos4",
  "grasas1", "grasas2", "grasas4",
  "minerales1", "minerales2", "minerales4",
  "fibra1", "fibra2",
  // Lote 5.
  "edulcorantes1", "edulcorantes2", "edulcorantes3",
  "edulcorantes4", "edulcorantes5", "edulcorantes6",
]);

const src = (key: string, i: number) =>
  `/viñetas/nutricion/${key}/${key}${i}.${EN_WEBP.has(`${key}${i}`) ? "webp" : "png"}`;

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
      // Foto nueva: la molécula de agua, en uve, con su polo + y su polo −.
      src: "/viñetas/nutricion/agua/aguamolecula.png",
      paragraphs: [
        "Antes de para qué sirve, conviene saber qué es. El agua son dos hidrógenos pegados a un oxígeno, pero no en línea recta: forman una uve. Esa forma torcida lo cambia todo.",
        "El oxígeno tira con más fuerza de los electrones compartidos y se queda con una carga ligeramente negativa; los dos hidrógenos quedan ligeramente positivos. Así que cada molécula de agua es un imán diminuto, con un polo más y un polo menos.",
        "Todo lo que el agua hace dentro de ti sale de ahí. De una molécula torcida con dos polos.",
      ],
    },
    {
      // Foto nueva: el agua rodeando y separando la sal en iones; y las grasas
      // juntándose entre ellas para huir del agua (membrana).
      src: "/viñetas/nutricion/agua/aguadisuelve.png",
      paragraphs: [
        "Por ser un imán, el agua rodea a todo lo que tenga carga y lo separa. Cuando echas sal en agua, su polo negativo se pega al sodio y el positivo al cloro, y los arranca uno del otro. La sal no desaparece: queda flotando en piezas sueltas.",
        "Eso es ser un disolvente. Y por eso todo lo que tu cuerpo necesita mover (sales, glucosa, vitaminas, hormonas, desechos) viaja disuelto en agua.",
        "Con las grasas pasa justo lo contrario: no tienen polos, el agua no puede agarrarlas y ellas se juntan entre sí para huir del agua. Parece un defecto y es una genialidad: esa huida es lo que forma las membranas de todas tus células. Cada célula tiene una frontera de grasa precisamente porque el agua no puede cruzarla cuando quiere.",
      ],
    },
    {
      src: src("agua", 1),
      paragraphs: [
        "Alrededor del 60% de tu cuerpo es agua, y dos de cada tres litros están dentro de las células. No es relleno: es el lugar donde vive todo lo demás.",
        "Tienes unos 37 billones de células, y cada una es, por dentro, una gota de agua con cosas disueltas.",
      ],
    },
    {
      src: src("agua", 4),
      paragraphs: [
        "Ninguna reacción química de tu cuerpo ocurre en seco. Las enzimas, los nutrientes y el ATP tienen que moverse y chocar para encontrarse, y eso solo pasa flotando en un líquido.",
        "Pero el agua no es solo el escenario: también actúa. Cuando tu cuerpo parte una molécula grande en trozos (una grasa, una proteína, el propio ATP) lo hace metiendo una molécula de agua en medio para romper el enlace. Se llama hidrólisis, que significa literalmente «romper con agua».",
        "Y funciona en los dos sentidos: tus mitocondrias fabrican agua. El oxígeno que respiras termina convertido en agua al final de la cadena que produce tu energía.",
      ],
    },
    {
      src: src("agua", 2),
      paragraphs: [
        "¿Y qué papel tiene en la sangre? Enorme, porque la sangre es agua con cosas dentro. Más de la mitad de su volumen es plasma, y el plasma es agua en un 90%.",
        "Ahí está la clave que casi nunca se cuenta: el agua es lo que da VOLUMEN a la sangre, y ese volumen es lo que llena tus vasos y sostiene la tensión arterial. Cuando te deshidratas hay menos agua en el plasma, el volumen baja y el corazón tiene que latir más rápido para seguir repartiendo. De ahí el mareo al levantarte, el dolor de cabeza y la sensación de no poder con nada.",
        "En esa agua viaja casi todo: la glucosa, las sales, las hormonas, los aminoácidos, los desechos camino del riñón y el CO₂ de vuelta a los pulmones. El oxígeno es la excepción, porque apenas se disuelve en agua: para él tienes glóbulos rojos cargados de hemoglobina… que a su vez flotan en el agua del plasma.",
        "Y esa agua no está encerrada en el vaso. Entra y sale continuamente de los capilares para bañar a las células. Es la única manera de que lo que comes acabe llegando a una célula del dedo del pie.",
      ],
    },
    {
      // Foto nueva: la ósmosis. El agua cruzando hacia donde hay más sal
      // (plasma / líquido entre células / interior de la célula).
      src: "/viñetas/nutricion/agua/aguaosmosis.png",
      paragraphs: [
        "El agua no se queda donde te la bebes: se mueve sola, y siempre hacia donde hay más sales. Ese movimiento se llama ósmosis, y es la razón de que hidratarse no sea solo cuestión de beber.",
        "El que manda es el sodio. Si a un lado hay más sal, el agua cruza hacia allí hasta igualar la concentración. Así decide tu cuerpo cuánta agua se queda en la sangre, cuánta baña los tejidos y cuánta entra en las células.",
        "De ahí dos cosas que se ven a diario. Si comes muy salado retienes agua y te hinchas, porque el agua acompaña a ese sodio. Y si bebes litros de agua sola después de sudar mucho, puedes diluir tanto el sodio de la sangre que el agua empiece a entrar en las células y estas se hinchen. Por eso las bebidas de rehidratación llevan sal y algo de azúcar: no es marketing.",
        "El riñón lleva la contabilidad. Cuando el agua escasea, el cerebro suelta una hormona (la vasopresina) que le ordena recuperar toda la que pueda, y por eso la orina sale más oscura y concentrada.",
      ],
    },
    {
      src: src("agua", 3),
      paragraphs: [
        "El agua también te mantiene templado, porque aguanta muchísimo calor sin cambiar apenas de temperatura. Y cuando hay que enfriar, el sudor se evapora y se lleva el calor consigo.",
        "Además protege: lubrica las articulaciones, humedece los ojos, forma la saliva y rodea tu cerebro con un colchón de líquido cefalorraquídeo.",
        "La pierdes todo el día sin darte cuenta, al respirar, al sudar y en la orina, y hay que reponerla. No solo bebiendo: buena parte llega en las frutas, las verduras, las sopas y el resto de la comida.",
        "El agua no aporta calorías, no construye músculo y no fabrica ATP. Pero sin ella nada de lo demás ocurre. Si los nutrientes son las piezas, el agua es a la vez el escenario, el transporte y el mensajero.",
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

  edulcorantes: [
    {
      src: src("edulcorantes", 1),
      paragraphs: [
        "En la lengua tienes un receptor del dulce. Y no es un detector de azúcar: es un detector de formas. Si una molécula encaja en él, tu cerebro recibe la palabra «dulce», sea lo que sea esa molécula.",
        "Los edulcorantes son moléculas que encajan en esa cerradura muchísimo mejor que el azúcar: entre 200 y 20.000 veces más fuerte. Pero ahí acaba el parecido. No se pueden quemar, no dan energía y casi todos salen del cuerpo tal como entraron.",
        "Son una llave que abre la puerta del dulce sin traer nada detrás. Y en eso está su gracia… y todo su problema.",
      ],
    },
    {
      src: src("edulcorantes", 2),
      paragraphs: [
        "Para tu cuerpo el dulce nunca fue un placer: era un aviso. Durante millones de años, dulce significó «viene energía», y el organismo aprendió a prepararse antes de que llegara.",
        "En cuanto algo dulce toca la lengua, el cerebro da órdenes por adelantado: más saliva, jugos gástricos y un pequeño adelanto de insulina para recibir la glucosa que está a punto de entrar. Se llama fase cefálica y es, literalmente, una predicción.",
        "Con un edulcorante la predicción se dispara igual… y la glucosa no aparece nunca. El cuerpo se ha preparado para nada. Ese es el engaño, y no es al paladar: es al sistema de previsión.",
      ],
    },
    {
      src: src("edulcorantes", 3),
      paragraphs: [
        "El placer del dulce se cobra en dos plazos. El primero es el sabor, en la boca. El segundo llega después y desde abajo: unos sensores del intestino comprueban que de verdad ha entrado energía y avisan al cerebro por el nervio vago. Ese segundo aviso es el que cierra el círculo y te deja satisfecha.",
        "El edulcorante paga el primer plazo y no el segundo. Sabor sí, energía no. La recompensa se queda a medias, y en muchas personas eso se traduce en seguir buscando algo dulce un rato después.",
        "En animales está muy bien demostrado. En personas es más variable: a algunas les quita el antojo y a otras se lo enciende. Merece la pena que observes qué te pasa a ti.",
      ],
    },
    {
      src: src("edulcorantes", 4),
      paragraphs: [
        "Y hay una segunda lengua de la que nadie habla: el intestino también tiene receptores del dulce. Cuando detectan dulzor, suelta hormonas (entre ellas el GLP-1, el de la saciedad) y prepara más transportadores para absorber glucosa.",
        "O sea que, aunque no lleven calorías, los edulcorantes sí mandan señales metabólicas de verdad. Son pequeñas y muy variables, pero es falso que «pasen de largo sin hacer nada».",
        "Falta una pieza más: la microbiota. Algunos edulcorantes cambian su composición en algunas personas, y justo en esas se ha visto un peor manejo de la glucosa. No le ocurre a todo el mundo: es una respuesta individual, y eso explica por qué los estudios se contradicen tanto.",
      ],
    },
    {
      src: src("edulcorantes", 5),
      paragraphs: [
        "Vamos a la pregunta de verdad: ¿son tan malos? La respuesta honesta es incómoda, porque no son un veneno pero tampoco son la solución.",
        "A favor tienen cosas sólidas y medibles: no producen caries, no elevan la glucosa ni la insulina de forma apreciable, y cambiar un refresco azucarado diario por su versión sin azúcar quita de golpe una cantidad enorme de azúcar. Para quien tiene diabetes o viene de un consumo muy alto, eso no es poco: es una escalera para bajar.",
        "Y en las cantidades a las que se consumen habitualmente, ninguna agencia ha encontrado motivo para retirarlos del mercado.",
      ],
    },
    {
      src: src("edulcorantes", 6),
      paragraphs: [
        "En contra hay tres cosas que conviene saber. La primera: a largo plazo no funcionan para lo que la gente los usa. La Organización Mundial de la Salud revisó la evidencia en 2023 y recomendó no utilizarlos para controlar el peso, porque no aparece un beneficio sostenido y sí una asociación con más riesgo de diabetes tipo 2 y de enfermedad cardiovascular. Asociación, no causa demostrada: en parte puede ser simplemente que quien ya tiene un problema metabólico es quien más los consume.",
        "La segunda: hay casos con dudas abiertas, como la clasificación del aspartamo en 2023 o el hallazgo que relaciona el eritritol con las plaquetas. Nada concluyente, pero suficiente para no construir la alimentación de toda una vida encima de ellos.",
        "La tercera es la que más importa, y no se mide en ningún análisis: mantienen el listón del dulce donde está. Si todo lo que comes es intensamente dulce, una fruta te sabe a nada. Y ese umbral es lo que de verdad decide qué te apetece cada día.",
        "Así que el objetivo no es cambiar de azúcar, es bajar el listón poco a poco hasta no necesitar ninguno de los dos. Los edulcorantes pueden ser un escalón intermedio muy útil. El problema es quedarse a vivir en el escalón.",
      ],
    },
  ],
};

export const comicNutrienteByKey = (key: string): Vineta[] | undefined =>
  COMICS_NUTRIENTES[key];
