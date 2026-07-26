import type { HitoHistoria, SubHito } from "./culturaHistoriaUniversal";

// ─────────────────────────────────────────────────────────────────────────
// HISTORIA DE LA MEDICINA (Cultura). Tagline: «20.000 años buscando la salud —
// cómo la humanidad aprendió a curar, y a curarse».
//
// Mismo modelo que las demás Historias: ETAPAS (con intro) → SUB-HITOS (cada uno
// con su cómic: pregunta-gancho + cuerpo + dato curioso, foto + texto a la
// derecha). Estructura del índice: Prólogo + 12 pasos (del chamán a la medicina
// integrativa). Cada paso sigue una plantilla implícita: la gran pregunta (intro
// de la etapa) → autores y descubrimientos (sub-hitos) → en qué se equivocaron /
// qué sigue válido → «aplícalo a tu vida» (sub-hito final, ejercicio).
//
// No es solo historia: es un viaje de autoconocimiento. Cada civilización ofrece
// una lente distinta para conocerse — el chamán la mente, Egipto la observación,
// India el equilibrio, China el flujo, Grecia la razón, el islam la compasión
// clínica, el Renacimiento la evidencia, la medicina moderna la integración.
//
// Fotos planas en /recorrido/cultura/historiamedicina/<subKey>.png (el nombre del
// archivo = key del sub-hito). El texto se pinta con `separarFrases` (salto de
// línea tras cada punto).
//
// Momentos sin fecha (eyebrow "") = pasajes de síntesis/ejercicio (p. ej.
// «Aplícalo a tu vida», «Mensaje final»): el ComicViewer oculta el antetítulo
// cuando va vacío.
// ─────────────────────────────────────────────────────────────────────────

// Todas las fotos (círculo + viñeta) van planas en una sola carpeta, con el
// nombre del sub-hito (misma convención que las demás Historias).
const foto = (_era: string, sub: string) =>
  `/recorrido/cultura/historiamedicina/${sub}.png`;

// Sub-hito con su cómic (una viñeta). `pregunta` opcional (gancho, va primero) y
// `dato` opcional (curiosidad, va al final). El `cuerpo` son los párrafos.
const hito = (
  era: string, key: string, titulo: string, fecha: string,
  pregunta: string, cuerpo: string[], dato?: string,
): SubHito => {
  const paragraphs: string[] = [];
  if (pregunta) paragraphs.push(pregunta);
  paragraphs.push(...cuerpo);
  if (dato) paragraphs.push(dato);
  return {
    key, titulo, foto: foto(era, key),
    vinetas: [{ src: foto(era, key), eyebrow: fecha, titulo, paragraphs }],
  };
};

export const HISTORIA_MEDICINA_HITOS: HitoHistoria[] = [
  // ───────────────────────────────────────────────────────────────────────
  // PRÓLOGO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "prologo",
    titulo: "¿Qué significa estar enfermo?",
    anio: "Antes de hablar de culturas",
    intro:
      "Antes de recorrer las grandes civilizaciones, conviene detenerse en una pregunta que parece sencilla pero que la humanidad lleva miles de años intentando responder: ¿qué significa realmente estar enfermo? Durante casi toda la historia, enfermar se vivía como un castigo, un desequilibrio o un misterio. Hoy sabemos mucho más, pero la pregunta sigue abierta. Antes de conocer cómo curaron el chamán, Egipto, la India o Grecia, vamos a entender qué es una enfermedad, de cuántas formas puede aparecer y de cuántas maneras se puede curar. Porque todo este recorrido tiene un objetivo que no es memorizar fechas, sino algo mucho más personal: aprender a mirar tu propia salud con otros ojos.",
    subhitos: [
      hito("prologo", "que-es-enfermedad", "¿Qué es una enfermedad?", "La pregunta de siempre",
        "¿Sabrías explicar con tus propias palabras qué es estar enfermo?",
        [
          "Parece una pregunta fácil, pero no lo es. Durante siglos se pensó que la enfermedad era algo que entraba en el cuerpo desde fuera: un espíritu, un aire malo, un castigo divino.",
          "Hoy la entendemos de otra manera. Una enfermedad es una alteración en el funcionamiento del cuerpo o de la mente que rompe el equilibrio que llamamos salud. A veces la provoca un microbio, a veces un órgano que falla, a veces nuestros propios hábitos y a veces las emociones.",
          "Lo interesante es que la salud no es simplemente «no estar enfermo». Es un estado de equilibrio dinámico: el cuerpo se adapta constantemente al frío, al esfuerzo, al hambre o al estrés, y mientras logra volver a su centro, seguimos sanos.",
          "Enfermar, en el fondo, es perder esa capacidad de volver al equilibrio.",
        ],
        "Dato curioso: la Organización Mundial de la Salud define la salud no como la ausencia de enfermedad, sino como un estado completo de bienestar físico, mental y social. Una definición que muchas civilizaciones antiguas habrían compartido."),
      hito("prologo", "cuatro-tipos", "Los cuatro tipos de enfermedad", "Una brújula para entenderlas",
        "¿Es lo mismo un resfriado que una enfermedad que dura toda la vida?",
        [
          "No todas las enfermedades son iguales, y distinguirlas ayuda enormemente a entender la medicina. Podemos agrupar casi todo en cuatro grandes tipos.",
          "Los síntomas pasajeros: molestias leves y breves, como un dolor de cabeza o un catarro. El cuerpo suele resolverlos solo.",
          "Las enfermedades agudas: aparecen de golpe, son claras y normalmente tienen cura, como una infección o una apendicitis.",
          "Las enfermedades crónicas: se instalan durante años o para siempre, como la diabetes o la hipertensión. No siempre se curan, pero sí se pueden controlar.",
          "Y las enfermedades mortales: aquellas que ponen en peligro la vida y que han sido, a lo largo de la historia, el gran enemigo de la medicina.",
          "Casi toda la historia que vas a recorrer es, en realidad, la historia de cómo la humanidad fue aprendiendo a enfrentarse a cada uno de estos cuatro tipos.",
        ]),
      hito("prologo", "tres-formas-curar", "Las tres formas de curar", "El mapa completo",
        "Cuando alguien se cura, ¿qué es exactamente lo que lo ha curado?",
        [
          "A lo largo de toda la historia, por muy distintas que parezcan, todas las medicinas del mundo han curado usando solo tres grandes caminos.",
          "La curación física: actuar directamente sobre el cuerpo. Colocar un hueso, coser una herida, operar, aplicar calor o frío, masajear, mover. Es la medicina de las manos.",
          "La curación química: introducir una sustancia que cambia lo que ocurre dentro del cuerpo. Una planta, un mineral, un antibiótico, una vacuna. Es la medicina de los remedios.",
          "La curación psicológica: actuar sobre la mente, las emociones y las creencias del enfermo. La confianza, la esperanza, el sentido, la relación con quien cura. Es la medicina invisible, y quizá la más antigua de todas.",
          "Lo fascinante es que ninguna gran cultura usó solo una. Y la medicina más avanzada de hoy está redescubriendo que las tres, juntas, curan mejor que cualquiera por separado.",
        ],
        "Dato curioso: durante mucho tiempo la ciencia despreció la curación psicológica por considerarla «sugestión». Hoy sabemos que el efecto placebo es tan real que hay que medirlo en todos los ensayos médicos para no confundirlo con el efecto del fármaco."),
      hito("prologo", "que-haces-tu", "¿Qué haces tú cuando enfermas?", "",
        "Antes de seguir, para un momento y mírate a ti.",
        [
          "Cuando notas que algo no va bien —un dolor, un cansancio que no se va, una preocupación que no te deja dormir—, ¿qué es lo primero que haces?",
          "¿Buscas una pastilla? ¿Descansas y esperas? ¿Cambias lo que comes? ¿Se lo cuentas a alguien de confianza? ¿Ignoras la señal y sigues adelante?",
          "No hay una respuesta correcta. Pero tu forma de responder dice mucho sobre qué tipo de medicina llevas dentro, casi sin saberlo.",
          "Guarda esa respuesta. A lo largo de este viaje vas a descubrir que el chamán, Egipto, la India, China, Grecia y la medicina moderna hicieron, cada uno a su manera, exactamente lo mismo que tú haces cuando enfermas. Solo que ellos lo convirtieron en sabiduría.",
          "Este no es solo un curso de historia. Es un recorrido para aprender a cuidarte mejor.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // PASO 1 — EL CHAMÁN
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "chaman",
    titulo: "El chamán",
    anio: "Prehistoria",
    intro:
      "La medicina nació mucho antes que la ciencia. Durante decenas de miles de años no existieron médicos: existían sanadores. La gran pregunta de aquellos primeros pueblos no era «¿qué microbio causa esto?», sino «¿por qué me ha pasado esto a mí?». Entendían la enfermedad como un desequilibrio con las fuerzas invisibles del mundo: los espíritus, los antepasados, la naturaleza. Y sin embargo, aunque sus explicaciones eran mágicas, descubrieron algo profundamente cierto que la medicina tardaría milenios en volver a valorar: que la mente, la esperanza y el vínculo con otra persona pueden poner en marcha la curación del cuerpo.",
    subhitos: [
      hito("chaman", "primeros-sanadores", "Los primeros sanadores", "Hace más de 20.000 años",
        "¿Quién curaba cuando aún no existía la medicina?",
        [
          "Mucho antes de las ciudades, de la escritura y de la ciencia, todas las culturas humanas tuvieron una figura parecida: el chamán, el curandero, el hechicero. Una persona que se ocupaba de los enfermos.",
          "No separaban el cuerpo del espíritu. Para ellos, enfermar era haber perdido el equilibrio con el mundo invisible, así que curar consistía en restaurar ese equilibrio mediante rituales, cantos, plantas y ceremonias.",
          "Aunque nos parezca pura superstición, aquellos sanadores acumularon un conocimiento asombroso sobre plantas curativas, aprendido a base de siglos de prueba y error. Muchos de sus remedios contenían principios activos que la farmacia moderna aún utiliza.",
          "Y hacían algo que hoy sabemos que es medicina de verdad: acompañar al enfermo y darle una explicación y una esperanza.",
        ],
        "Dato curioso: se han encontrado cráneos prehistóricos con agujeros hechos a propósito —la llamada trepanación— y con signos de haber cicatrizado. Es decir: el paciente sobrevivió a una operación de cráneo hace miles de años."),
      hito("chaman", "ritual-esperanza", "El ritual y la esperanza", "La primera medicina",
        "¿Puede una ceremonia, por sí sola, ayudar a sanar?",
        [
          "El chamán no daba solo una planta: daba un ritual. Encendía fuego, cantaba, invocaba fuerzas, ponía las manos. Todo eso creaba una experiencia intensa y cargada de significado.",
          "Hoy entendemos por qué funcionaba. El ritual transformaba el miedo del enfermo en esperanza, y la esperanza cambia lo que ocurre en el cuerpo: relaja, reduce el dolor y activa las defensas.",
          "El enfermo dejaba de sentirse solo frente a algo incomprensible. Alguien con autoridad y confianza le decía: «Sé lo que te pasa y sé cómo ayudarte». Ese mensaje, por sí mismo, ya cura una parte.",
          "La primera gran medicina de la humanidad no fue un fármaco. Fue lograr que una persona creyera que podía sanar.",
        ]),
      hito("chaman", "placebo", "El poder de la mente: el placebo", "Un descubrimiento eterno",
        "¿Y si creer que te vas a curar fuera, en parte, curarte?",
        [
          "Existe un fenómeno tan real que la ciencia moderna lo tiene que medir en todos sus experimentos: el efecto placebo. Cuando una persona confía en que un tratamiento va a funcionar, su cuerpo mejora de verdad, aunque el tratamiento no tenga ningún principio activo.",
          "No es imaginación ni engaño: el cerebro libera sustancias que calman el dolor, reducen la inflamación y mejoran el ánimo. La creencia se convierte en química.",
          "El chamán, sin saber nada de neuronas, dominaba este poder mejor que nadie. Todo su ritual estaba diseñado para maximizar la confianza del enfermo.",
          "Por eso su medicina, tantas veces despreciada como magia, contenía una verdad que seguimos usando hoy: la mente es una farmacia.",
        ],
        "Dato curioso: existe también el efecto contrario, el nocebo: si alguien cree que algo le va a hacer daño, puede llegar a sentir síntomas reales. La mente cura, pero también puede enfermar."),
      hito("chaman", "comunidad-vinculo", "La comunidad y el vínculo", "El sanador y el paciente",
        "¿Qué cura más, el remedio o quien te lo da?",
        [
          "En los pueblos antiguos, el enfermo no se curaba solo en una habitación. Se curaba rodeado de su comunidad, que participaba en el ritual, lo acompañaba y lo sostenía.",
          "Ese apoyo tenía un efecto poderoso. Sentirse querido, acompañado y parte de un grupo reduce el estrés y refuerza la capacidad del cuerpo para recuperarse. La soledad, en cambio, enferma.",
          "Y en el centro estaba la relación entre el sanador y el paciente: una relación de confianza absoluta. El enfermo se entregaba a alguien que lo miraba, lo escuchaba y se ocupaba de él por entero.",
          "Miles de años después, los estudios confirman lo mismo: la calidad de la relación entre el médico y el paciente influye directamente en los resultados del tratamiento.",
        ]),
      hito("chaman", "chaman-aplicalo", "Aplícalo a tu vida", "",
        "El chamán te enseña el poder de la mente.",
        [
          "En qué se equivocaba: creía que la enfermedad venía de espíritus y castigos, no de causas naturales. No tenía forma de distinguir qué remedios funcionaban de verdad.",
          "Qué sigue siendo válido: que la esperanza, la confianza, el acompañamiento y el sentido son parte real de la curación. No un adorno, sino un ingrediente activo.",
          "Tu ejercicio: la próxima vez que te encuentres mal, fíjate en tu estado mental. ¿Te hablas con miedo y catástrofe, o con calma y confianza? Esa voz interior es tu propio chamán. Aprende a que juegue a tu favor.",
          "Rodéate también de tu «comunidad»: no atravieses lo difícil en soledad. Pedir ayuda no es debilidad, es medicina antigua.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // PASO 2 — EGIPTO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "egipto",
    titulo: "Egipto: observar la naturaleza",
    anio: "≈3000-500 a. C.",
    intro:
      "En el valle del Nilo, la medicina dio un paso decisivo: empezó a observar. Los egipcios seguían creyendo en dioses y conjuros, pero al mismo tiempo tomaban nota de lo que veían en el cuerpo, describían heridas, ordenaban tratamientos por escrito y separaban las enfermedades según lo que observaban. Fue el nacimiento del empirismo: aprender mirando la realidad, no solo imaginándola. Con Egipto la medicina empieza a parecerse, por primera vez, a un conocimiento que se puede transmitir, comprobar y mejorar.",
    subhitos: [
      hito("egipto", "imhotep", "Imhotep", "≈2650 a. C.",
        "¿Puede un hombre convertirse en dios por curar?",
        [
          "Imhotep fue arquitecto, sacerdote y médico al servicio del faraón. Diseñó una de las primeras pirámides, pero pasó a la historia sobre todo por su fama como sanador.",
          "Se le considera uno de los primeros médicos con nombre propio de la historia. Trataba enfermedades observando síntomas y aplicando remedios, mezclando saber práctico y religión.",
          "Su prestigio fue tan enorme que, siglos después de morir, los egipcios lo convirtieron en un dios de la medicina. Un ser humano elevado a divinidad por su capacidad de curar.",
          "Con Imhotep aparece una idea nueva: el médico como figura respetada, sabia y admirada por la sociedad.",
        ],
        "Dato curioso: los griegos, siglos después, identificaron a Imhotep con su propio dios de la medicina, Asclepio. Dos culturas coincidieron en divinizar el arte de curar."),
      hito("egipto", "papiros-medicos", "Los papiros médicos", "≈1600 a. C.",
        "¿Qué pasa cuando la medicina se empieza a escribir?",
        [
          "Los egipcios dejaron los primeros tratados médicos de la historia, escritos en papiro. En ellos describían enfermedades, síntomas y tratamientos con un orden sorprendente.",
          "El más famoso, el papiro Edwin Smith, describe casos de heridas y fracturas uno por uno: qué se observa, qué diagnóstico corresponde y si tiene tratamiento, o si es mejor no intervenir.",
          "Por primera vez, el conocimiento médico deja de depender de la memoria de un solo sanador y se convierte en algo que se puede guardar, copiar, enseñar y corregir.",
          "Escribir la medicina fue tan importante como practicarla: permitió que cada generación empezara donde lo dejó la anterior, en lugar de partir de cero.",
        ],
        "Dato curioso: en algunos casos, el papiro Edwin Smith concluye con una frase asombrosamente moderna: «una dolencia que no se debe tratar». Es decir, ya reconocían los límites de la medicina y la honestidad de no dañar."),
      hito("egipto", "higiene-dieta", "Higiene y dieta", "El cuidado cotidiano",
        "¿Y si la salud dependiera más de tus hábitos que de tus remedios?",
        [
          "Los egipcios daban una importancia enorme a la limpieza. Se lavaban con frecuencia, cuidaban el agua, prestaban atención a los alimentos y observaban el cuerpo con detalle.",
          "Entendían, de forma intuitiva, que muchas enfermedades tenían que ver con la vida diaria: lo que se come, lo que se bebe, la limpieza, el descanso.",
          "Este cuidado cotidiano —lo que hoy llamaríamos prevención— es una de sus grandes lecciones. No esperaban a estar enfermos: intentaban no enfermar.",
          "Fue uno de los primeros pueblos en comprender que la salud se construye cada día, y no solo se repara cuando se ha roto.",
        ]),
      hito("egipto", "especializacion", "Los primeros especialistas", "Médicos por órganos",
        "¿Un solo médico puede saberlo todo?",
        [
          "Egipto llegó a tener médicos especializados. Había quienes se ocupaban de los ojos, otros del vientre, otros de los dientes.",
          "El historiador griego Heródoto, al visitar Egipto, quedó impresionado: contaba que cada médico se dedicaba a una sola enfermedad, de modo que el país estaba «lleno de médicos».",
          "Esta especialización, hace más de tres mil años, anticipa la forma en que funciona la medicina hoy, con oftalmólogos, cardiólogos o dentistas.",
          "Reconocieron algo profundo: el cuerpo humano es tan complejo que conviene mirarlo por partes... aunque, como veremos, algún día habrá que volver a mirarlo entero.",
        ]),
      hito("egipto", "egipto-aplicalo", "Aplícalo a tu vida", "",
        "Egipto te enseña el poder de la observación.",
        [
          "En qué se equivocaban: seguían mezclando la medicina con conjuros mágicos, y muchos de sus remedios eran ineficaces o dañinos.",
          "Qué sigue siendo válido: observar con atención, anotar lo que ocurre, prevenir mediante la higiene y la dieta, y cuidarse cada día antes de enfermar.",
          "Tu ejercicio: empieza a observar tu cuerpo como los egipcios observaban la naturaleza. ¿Cómo duermes? ¿Cómo va tu digestión? ¿Qué te da energía y qué te la quita?",
          "Durante una semana, apunta cómo te sientes cada día. Verás patrones que nunca habías notado. Conocerte es el primer diagnóstico.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // PASO 3 — INDIA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "india",
    titulo: "India: el equilibrio",
    anio: "≈1500 a. C. en adelante",
    intro:
      "En la India nació una de las medicinas más completas y duraderas de la historia: el Ayurveda, «la ciencia de la vida». Su gran pregunta no era solo cómo curar la enfermedad, sino cómo mantener el equilibrio que evita enfermar. Entendían al ser humano como un todo —cuerpo, mente y entorno— hecho de los mismos elementos que la naturaleza. Y desarrollaron algo revolucionario: la idea de que cada persona es distinta, con una constitución propia, y de que la salud consiste en vivir de acuerdo con ella.",
    subhitos: [
      hito("india", "charaka", "Charaka", "≈siglo II a. C.",
        "¿Y si prevenir importara más que curar?",
        [
          "Charaka es una de las grandes figuras del Ayurveda. Su tratado, el Charaka Samhita, es uno de los textos médicos más importantes de la antigua India.",
          "Puso el acento en la prevención, la dieta, el estilo de vida y el equilibrio. Para él, un buen médico no era solo el que curaba, sino el que ayudaba a no enfermar.",
          "Describió cientos de enfermedades, plantas medicinales y tratamientos, con una visión del cuerpo como un sistema en constante búsqueda de equilibrio.",
          "También reflexionó sobre la ética del médico y sobre la importancia de la mente y las emociones en la salud, mucho antes de que Occidente lo hiciera.",
        ]),
      hito("india", "sushruta", "Sushruta", "≈siglo VI a. C.",
        "¿Se operaba ya hace más de dos mil años?",
        [
          "Sushruta es considerado uno de los padres de la cirugía. Su tratado describe más de trescientas operaciones y decenas de instrumentos quirúrgicos.",
          "Realizaba intervenciones asombrosas para su época: extracción de cálculos, tratamiento de fracturas e incluso cirugía reconstructiva de la nariz, una técnica pionera de la que aún se habla en la historia de la medicina.",
          "Insistía en la práctica: los estudiantes aprendían a cortar y coser con frutas, verduras y modelos antes de tocar a un paciente.",
          "Su obra demuestra que la curación física —la medicina de las manos— alcanzó en la India un nivel extraordinario.",
        ],
        "Dato curioso: la técnica de reconstrucción de la nariz descrita por Sushruta inspiró, siglos después, a los cirujanos europeos. Se le considera un antecesor de la cirugía plástica."),
      hito("india", "doshas", "Los doshas y la constitución", "El corazón del Ayurveda",
        "¿Por qué el mismo remedio sienta bien a uno y mal a otro?",
        [
          "El Ayurveda parte de una idea genial: no todos somos iguales. Cada persona tiene una constitución propia, su prakriti, formada por la combinación de tres energías o doshas: Vata, Pitta y Kapha.",
          "Vata se relaciona con el movimiento; Pitta con la transformación y el fuego; Kapha con la estructura y la calma. Todos tenemos las tres, pero en proporciones distintas, y eso define nuestro cuerpo, nuestro carácter y nuestras tendencias a enfermar.",
          "La salud, según el Ayurveda, es mantener tu equilibrio particular. La enfermedad es cuando ese equilibrio se rompe.",
          "Por eso el tratamiento se personaliza: la comida, el ejercicio y el ritmo de vida que curan a una persona pueden desequilibrar a otra.",
        ],
        "Dato curioso: esta idea, tan antigua, se parece muchísimo a lo que hoy llamamos medicina personalizada, que busca adaptar el tratamiento a las características únicas de cada paciente."),
      hito("india", "cinco-elementos-yoga", "Cinco elementos y yoga", "Cuerpo, mente y entorno",
        "¿Y si estuvieras hecho de lo mismo que el mundo que te rodea?",
        [
          "El Ayurveda entiende que todo —el cuerpo y la naturaleza— está formado por cinco elementos: tierra, agua, fuego, aire y espacio. Los doshas nacen de la combinación de estos elementos.",
          "Esto conecta al ser humano con su entorno: las estaciones, los alimentos, el clima y los ritmos de la naturaleza influyen en nuestro equilibrio interior.",
          "Junto a la medicina, la India desarrolló el yoga: un sistema para cuidar el cuerpo y la mente a la vez mediante el movimiento, la respiración y la atención.",
          "Cuerpo, mente y entorno no eran mundos separados, sino un mismo tejido. Cuidar uno era cuidar los tres.",
        ]),
      hito("india", "india-aplicalo", "Aplícalo a tu vida", "",
        "La India te enseña el poder del equilibrio.",
        [
          "En qué se equivocaba: algunas de sus explicaciones sobre el cuerpo no coinciden con la biología moderna, y no todos sus remedios funcionan.",
          "Qué sigue siendo válido: que cada persona es distinta, que la salud es equilibrio y que cuerpo, mente y entorno forman un todo. Prevenir viviendo bien pesa más que curar.",
          "Tu ejercicio: pregúntate cuál parece ser tu constitución. ¿Eres más inquieto y variable (Vata), más intenso y acalorado (Pitta), o más tranquilo y estable (Kapha)?",
          "No para etiquetarte, sino para conocerte. ¿Qué te desequilibra a ti en concreto? ¿Qué te devuelve a tu centro? Ahí está tu medicina personal.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // PASO 4 — CHINA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "china",
    titulo: "China: la energía",
    anio: "≈2000 a. C. en adelante",
    intro:
      "La medicina china aportó una lente que a Occidente le costaría mucho comprender: la del flujo y el ritmo. No veía el cuerpo como una máquina de piezas, sino como un sistema de energía en movimiento, atravesado por corrientes que deben circular libremente. Su gran pregunta era cómo mantener ese flujo en armonía. Donde Grecia buscaría la estructura, China buscó el equilibrio de fuerzas opuestas y el ritmo que las une. Y de ahí nacieron prácticas que hoy usan millones de personas en todo el mundo.",
    subhitos: [
      hito("china", "huangdi-neijing", "El Huangdi Neijing", "≈siglo III-II a. C.",
        "¿Puede un libro guiar la medicina de un pueblo durante dos mil años?",
        [
          "El Huangdi Neijing, o «Clásico interno del Emperador Amarillo», es el texto fundacional de la medicina tradicional china. Está escrito como un diálogo entre el emperador y su médico.",
          "En él se explican las grandes ideas de esta medicina: el Qi, el Yin-Yang, los cinco elementos y la circulación de la energía por el cuerpo.",
          "Lo notable es su enfoque: el mejor médico no es el que cura la enfermedad avanzada, sino el que la evita antes de que aparezca. Curar cuando ya está declarada, decía, es como cavar un pozo cuando ya tienes sed.",
          "Este libro guió la medicina china durante más de dos milenios y aún hoy se estudia.",
        ]),
      hito("china", "qi-yinyang", "El Qi y el Yin-Yang", "La energía y sus opuestos",
        "¿Y si la salud fuera un equilibrio entre fuerzas contrarias?",
        [
          "Para la medicina china, todo lo vivo está animado por el Qi, una energía vital que circula por el cuerpo. Cuando el Qi fluye libre y en cantidad adecuada, hay salud; cuando se bloquea o se debilita, aparece la enfermedad.",
          "Ese flujo se rige por dos fuerzas opuestas y complementarias: el Yin y el Yang. El frío y el calor, el reposo y la actividad, lo oscuro y lo luminoso. Ninguna es buena ni mala; la salud está en su equilibrio.",
          "Enfermar era tener demasiado de una y poco de la otra. Curar era restaurar la proporción.",
          "Es una forma distinta de pensar el cuerpo: no como órganos aislados, sino como un equilibrio dinámico de fuerzas.",
        ],
        "Dato curioso: el famoso símbolo del Yin-Yang lleva un punto del color contrario en cada mitad. Significa que dentro de cada fuerza vive la semilla de su opuesto: nada es puro ni absoluto."),
      hito("china", "meridianos-acupuntura", "Meridianos y acupuntura", "La medicina de las agujas",
        "¿Cómo se puede tratar un órgano pinchando la piel?",
        [
          "La medicina china describió una red de canales llamados meridianos por los que circula el Qi. A lo largo de ellos existen puntos concretos donde se puede actuar sobre esa energía.",
          "La acupuntura consiste en insertar finísimas agujas en esos puntos para desbloquear, reforzar o reequilibrar el flujo. Junto a ella usaban plantas, masajes, dieta y ejercicios de respiración y movimiento.",
          "Aunque los meridianos no coinciden con lo que la anatomía occidental ve, la acupuntura produce efectos reales que hoy se estudian científicamente, sobre todo en el alivio del dolor.",
          "Fue una medicina extraordinariamente sofisticada, con miles de años de observación clínica detrás.",
        ],
        "Dato curioso: la acupuntura es hoy una de las medicinas tradicionales más extendidas del planeta y se practica, junto a la medicina moderna, en hospitales de todo el mundo."),
      hito("china", "cinco-elementos-chinos", "Los cinco elementos", "Todo está conectado",
        "¿Y si tus órganos, las estaciones y las emociones formaran un mismo sistema?",
        [
          "La medicina china organiza el mundo en cinco elementos: madera, fuego, tierra, metal y agua. Cada uno se asocia a un órgano, una estación, una emoción, un sabor y un color.",
          "Estos elementos no están aislados: se alimentan y se controlan unos a otros en un ciclo constante. Un desequilibrio en uno repercute en los demás.",
          "Así, una emoción sostenida —como la ira o el miedo— podía afectar a un órgano, y un órgano débil podía alterar el estado de ánimo. Cuerpo y emociones eran inseparables.",
          "Es una visión profundamente ecológica del ser humano: nada ocurre por separado, todo está en relación.",
        ]),
      hito("china", "china-aplicalo", "Aplícalo a tu vida", "",
        "China te enseña que no todo es estructura: también existe el ritmo.",
        [
          "En qué se equivocaba: su modelo de energía y meridianos no describe la anatomía real, y muchas de sus explicaciones no resisten la prueba científica.",
          "Qué sigue siendo válido: mirar el cuerpo como un todo conectado, prevenir antes que curar, y entender que las emociones, el descanso y la actividad tienen su ritmo y su equilibrio.",
          "Tu ejercicio: observa tus ritmos. ¿Respetas el equilibrio entre actividad (Yang) y descanso (Yin), o vives siempre acelerado? ¿Escuchas cuándo tu cuerpo pide parar?",
          "La salud, decían los chinos, no está en el esfuerzo máximo, sino en el flujo equilibrado. Busca el tuyo.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // PASO 5 — GRECIA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "grecia",
    titulo: "Grecia: nace la medicina racional",
    anio: "≈siglo V a. C.",
    intro:
      "En Grecia ocurrió una revolución silenciosa: por primera vez alguien afirmó que las enfermedades no las envían los dioses, sino que tienen causas naturales que se pueden observar y comprender. Fue el nacimiento de la medicina racional. La gran pregunta dejó de ser «¿qué dios me castiga?» y pasó a ser «¿qué causa natural provoca esto y qué puedo hacer al respecto?». Con ello, la medicina se separó de la religión y se convirtió en un saber basado en la observación, el razonamiento y la ética.",
    subhitos: [
      hito("grecia", "hipocrates", "Hipócrates", "≈460-370 a. C.",
        "¿Y si la enfermedad no fuera un castigo divino, sino algo natural?",
        [
          "Hipócrates es considerado el padre de la medicina occidental. Su gran aportación fue radical: afirmar que las enfermedades tienen causas naturales, no sobrenaturales.",
          "Hasta entonces, incluso la epilepsia se llamaba «la enfermedad sagrada». Hipócrates dijo que no tenía nada de divino: era una enfermedad como cualquier otra, con causas en el cuerpo.",
          "Enseñó a observar al paciente con atención: sus síntomas, su evolución, su entorno. Y a confiar en la capacidad del propio cuerpo para curarse, ayudándolo con dieta, reposo y hábitos sanos.",
          "También situó al médico en el centro de una responsabilidad moral, resumida en un principio que sigue vivo: primero, no hacer daño.",
        ],
        "Dato curioso: el juramento hipocrático, que compromete al médico a actuar por el bien del paciente, sigue inspirando la ética médica más de dos mil años después."),
      hito("grecia", "cuatro-humores", "La teoría de los cuatro humores", "El modelo que duró siglos",
        "¿Cómo explicaban la enfermedad sin conocer los microbios?",
        [
          "Los griegos pensaban que el cuerpo contenía cuatro humores o líquidos: sangre, flema, bilis amarilla y bilis negra. La salud era su equilibrio; la enfermedad, su desajuste.",
          "Cada humor se asociaba a un elemento, una estación y un temperamento. De ahí vienen palabras que aún usamos: sanguíneo, flemático, colérico, melancólico.",
          "El tratamiento buscaba reequilibrar los humores mediante la dieta, el ejercicio o, a veces, prácticas como las sangrías.",
          "La teoría era incorrecta, pero tenía una virtud enorme: buscaba una explicación natural y un equilibrio interno, no la voluntad de los dioses. Dominaría la medicina occidental durante casi dos mil años.",
        ]),
      hito("grecia", "observacion-clinica", "La observación clínica", "Mirar al enfermo, no solo la enfermedad",
        "¿Qué se aprende sentándose junto a la cama de un enfermo?",
        [
          "La escuela hipocrática desarrolló algo esencial: la observación clínica. Los médicos anotaban cuidadosamente cómo evolucionaba cada paciente día a día.",
          "Aprendieron a reconocer los signos de una enfermedad, a prever su curso y a distinguir los casos graves de los leves. Este seguimiento atento es la base de la medicina hasta hoy.",
          "Comprendieron también el poder de la naturaleza sanadora del cuerpo: muchas veces, la mejor medicina era ayudar al organismo a recuperarse por sí mismo, sin estorbarlo.",
          "El médico dejó de ser un mago para convertirse en un observador paciente y honesto de la realidad.",
        ]),
      hito("grecia", "herofilo-erasistrato", "Herófilo y Erasístrato", "≈siglo III a. C.",
        "¿Qué se descubre cuando, por fin, se puede mirar dentro del cuerpo?",
        [
          "En la ciudad de Alejandría, en el Egipto griego, ocurrió algo excepcional: durante un tiempo se permitió estudiar el cuerpo humano por dentro. Allí trabajaron Herófilo y Erasístrato, los grandes anatomistas de la Antigüedad.",
          "Herófilo estudió el cerebro y lo señaló —y no el corazón— como centro del pensamiento y de los nervios. Distinguió los nervios de los tendones y describió el ojo, el hígado y el aparato digestivo con un detalle nunca visto.",
          "Erasístrato investigó el corazón y los vasos sanguíneos, y se acercó muchísimo a comprender cómo circulaba la sangre, casi dos mil años antes de que se demostrara del todo.",
          "Fueron la cima de la anatomía antigua. Después, diseccionar cuerpos humanos volvió a prohibirse durante siglos, y aquel conocimiento tan valioso quedó casi congelado hasta el Renacimiento.",
        ],
        "Dato curioso: la famosa Biblioteca de Alejandría no solo guardaba libros: a su alrededor floreció una comunidad de sabios que convirtió la ciudad en el mayor centro científico del mundo antiguo."),
      hito("grecia", "grecia-aplicalo", "Aplícalo a tu vida", "",
        "Grecia te enseña el poder de la razón.",
        [
          "En qué se equivocaban: la teoría de los humores era falsa, y algunos tratamientos, como las sangrías, hicieron más daño que bien durante siglos.",
          "Qué sigue siendo válido: buscar causas naturales, observar con honestidad, confiar en la capacidad del cuerpo para curarse y guiarse por una ética que ponga al paciente primero.",
          "Tu ejercicio: pregúntate qué hábitos construyen tu salud. Los griegos sabían que la dieta, el ejercicio, el sueño y la moderación curaban más que casi cualquier remedio.",
          "Elige un solo hábito que sabes que te hace bien y que descuidas. Empieza por él. La razón sirve de poco si no se convierte en acción.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // PASO 6 — GALENO Y ROMA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "galeno-roma",
    titulo: "Galeno y Roma: ordenar el cuerpo",
    anio: "≈siglo II d. C.",
    intro:
      "Roma heredó el saber griego y lo llevó a lo práctico: acueductos, baños, alcantarillado, hospitales militares. Y dio a la medicina una figura descomunal, Galeno, que intentó ordenar todo el conocimiento sobre el cuerpo en un sistema completo. Su gran pregunta era cómo funcionan por dentro los órganos. Su obra fue tan influyente que se convirtió en verdad indiscutible durante mil quinientos años. Y ahí está también su gran lección: incluso el genio más brillante puede equivocarse, y una autoridad demasiado respetada puede frenar el progreso durante siglos.",
    subhitos: [
      hito("galeno-roma", "galeno", "Galeno", "≈129-216 d. C.",
        "¿Puede una sola persona dominar la medicina durante mil años?",
        [
          "Galeno fue médico de gladiadores y de emperadores. Curando las heridas de la arena aprendió muchísimo sobre el cuerpo humano, y dedicó su vida a estudiarlo y a escribir sobre él.",
          "Reunió y ordenó todo el saber médico de su tiempo en un sistema gigantesco que abarcaba anatomía, fisiología y tratamiento. Fue un trabajo monumental.",
          "Estudió el movimiento, los nervios, la función de muchos órganos, y demostró con experimentos, por ejemplo, que las arterias llevan sangre y no aire, como se creía.",
          "Su autoridad fue tan aplastante que durante siglos cuestionarlo se consideraba casi una herejía.",
        ]),
      hito("galeno-roma", "anatomia-organos", "Anatomía y función de los órganos", "Entender la máquina",
        "¿Cómo estudiar el cuerpo humano cuando está prohibido abrirlo?",
        [
          "Galeno quería saber cómo funcionan los órganos, no solo cómo son. Se preguntaba para qué sirve cada pieza del cuerpo, un enfoque muy moderno.",
          "Pero tenía un problema enorme: en su época estaba prohibido diseccionar cadáveres humanos. Así que estudió sobre todo animales —monos y cerdos— y trasladó sus conclusiones al ser humano.",
          "Eso le llevó a aciertos notables, pero también a errores importantes, porque el cuerpo humano no es idéntico al de un animal.",
          "Aun así, su idea de estudiar la función de cada órgano marcó el camino de toda la fisiología posterior.",
        ]),
      hito("galeno-roma", "roma-salud-publica", "Roma y la salud pública", "Curar a un pueblo entero",
        "¿Y si la mejor medicina no fuera individual, sino colectiva?",
        [
          "Roma no destacó tanto por sus teorías como por su enorme capacidad práctica. Construyó acueductos para llevar agua limpia, alcantarillas para retirar los residuos y baños públicos por todas partes.",
          "Estas obras salvaron más vidas que muchos tratamientos, porque prevenían enfermedades a gran escala. Fue una forma temprana de salud pública.",
          "Los romanos crearon también hospitales militares para atender a sus soldados, precursores de los hospitales que conocemos hoy.",
          "Entendieron algo que a veces olvidamos: la salud de una persona depende en gran medida de las condiciones en las que vive.",
        ],
        "Dato curioso: se calcula que el agua limpia de los acueductos y el saneamiento romano hicieron más por la salud de la población que todos los remedios de la época juntos."),
      hito("galeno-roma", "error-1500-anios", "El error que duró 1500 años", "",
        "Incluso los genios pueden equivocarse durante siglos.",
        [
          "El sistema de Galeno era tan completo y tan respetado que, durante casi mil quinientos años, casi nadie se atrevió a corregirlo. Se estudiaba como verdad absoluta.",
          "El problema es que contenía errores, sobre todo por haber estudiado animales en lugar de humanos. Y como nadie lo cuestionaba, esos errores se repitieron generación tras generación.",
          "Aquí aparece una de las grandes lecciones de la historia de la medicina: cuando una autoridad se vuelve intocable, el conocimiento deja de avanzar.",
          "El progreso solo volvería cuando alguien se atreviera, por fin, a mirar el cuerpo con sus propios ojos en lugar de repetir lo que decían los libros.",
          "Tu ejercicio: pregúntate cuántas cosas das por ciertas solo porque «siempre se ha dicho así». Cuestionar, con respeto y con pruebas, es también una forma de cuidar tu salud.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // PASO 7 — EL MUNDO ISLÁMICO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "islam",
    titulo: "El mundo islámico",
    anio: "≈siglos VIII-XIII",
    intro:
      "Mientras Europa atravesaba siglos difíciles, el mundo islámico vivió una edad de oro del conocimiento. Sus sabios tradujeron, conservaron y ampliaron la medicina griega, la india y la persa, y le añadieron algo propio: rigor, organización y, sobre todo, humanidad. Su gran pregunta era cómo tratar mejor al enfermo, y su respuesta incluyó los primeros hospitales modernos y un método clínico cuidadoso. De ellos aprendemos una idea que resume toda buena medicina: el médico trata personas, no solo enfermedades.",
    subhitos: [
      hito("islam", "avicena", "Avicena", "980-1037",
        "¿Puede un libro ser el manual de medicina de medio mundo durante seis siglos?",
        [
          "Avicena (Ibn Sina) fue médico, científico y filósofo, uno de los mayores genios de la historia. Escribió el Canon de Medicina, una obra enorme que reunía y ordenaba todo el saber médico de su tiempo.",
          "El Canon era tan claro y completo que se convirtió en el libro de texto de las universidades, tanto islámicas como europeas, durante más de seiscientos años.",
          "En él describió cientos de enfermedades y tratamientos, insistió en la observación clínica y comprendió la importancia de la dieta, el ejercicio y las emociones en la salud.",
          "Intuyó incluso que algunas enfermedades podían transmitirse a través del agua o el aire, adelantándose siglos a la idea del contagio.",
        ],
        "Dato curioso: el Canon de Avicena se siguió usando en algunas facultades de medicina europeas hasta el siglo XVII. Pocos libros han enseñado a tantas generaciones de médicos."),
      hito("islam", "rhazes", "Rhazes", "≈865-925",
        "¿Cómo se distingue una enfermedad de otra parecida?",
        [
          "Rhazes (Al-Razi) fue un médico brillante y muy observador. Su mayor mérito fue describir con precisión enfermedades que hasta entonces se confundían.",
          "Fue el primero en distinguir claramente la viruela del sarampión, describiendo sus síntomas con un detalle asombroso. Ese tipo de observación cuidadosa es la base del diagnóstico.",
          "Defendía que el médico debía basarse en la experiencia y en los hechos, no solo en la autoridad de los libros antiguos. Si la observación contradecía a un maestro, había que fiarse de la observación.",
          "También escribió sobre la importancia de la relación con el paciente y de no perder nunca la esperanza en la curación.",
        ]),
      hito("islam", "abulcasis", "Abulcasis", "936-1013",
        "¿Quién enseñó a Europa a operar?",
        [
          "Abulcasis (Al-Zahrawi) vivió en Córdoba y está considerado el mayor cirujano del mundo medieval. Dedicó su vida a convertir la cirugía en una disciplina seria, cuidadosa y que se pudiera enseñar.",
          "Escribió una enorme enciclopedia médica cuya última parte, dedicada a la cirugía, incluía dibujos de más de doscientos instrumentos quirúrgicos, muchos inventados o mejorados por él. Fue el primer tratado ilustrado de cirugía de la historia.",
          "Describió cómo cauterizar heridas, extraer cálculos, tratar fracturas y coser con suturas, e insistía en conocer bien la anatomía y en tratar al paciente con delicadeza.",
          "Su obra se tradujo al latín y se estudió en las universidades europeas durante más de quinientos años, convirtiéndolo en el gran maestro de la cirugía occidental.",
        ],
        "Dato curioso: algunos de los instrumentos que dibujó Abulcasis hace más de mil años —pinzas, bisturís, fórceps— se parecen asombrosamente a los que se siguen usando hoy en los quirófanos."),
      hito("islam", "maimonides", "Maimónides", "1138-1204",
        "¿Puede un mismo hombre ser médico del sultán y guía espiritual de su pueblo?",
        [
          "Maimónides nació en Córdoba, en plena edad de oro de Al-Ándalus. Filósofo, médico y sabio judío, tuvo que huir de la persecución y acabó ejerciendo como médico en la corte de Egipto, al servicio del entorno del sultán Saladino.",
          "Escribió varios tratados médicos que se estudiaron durante siglos. En ellos insistía, mucho antes que casi nadie, en la prevención: la dieta moderada, el ejercicio, el descanso y el equilibrio como base de la salud.",
          "Comprendió también que el cuerpo y la mente son inseparables. Aconsejaba cuidar el ánimo del enfermo, evitar las pasiones excesivas y buscar la serenidad, porque las emociones influyen directamente en la salud del cuerpo.",
          "Unía así la mejor ciencia de su tiempo con una profunda humanidad y una ética exigente hacia el enfermo. Es una de las pocas figuras admiradas a la vez por médicos, filósofos y creyentes de tres religiones.",
        ],
        "Dato curioso: se atribuye a Maimónides una «oración del médico» que pide humildad, prudencia y amor al enfermo. Aunque quizá no la escribiera él, resume a la perfección el espíritu de su medicina."),
      hito("islam", "averroes", "Averroes", "1126-1198",
        "¿Y si el mejor médico fuera también el mejor filósofo?",
        [
          "Averroes (Ibn Rushd) nació en Córdoba, la misma ciudad que Maimónides, durante el esplendor de Al-Ándalus. Hoy se le recuerda sobre todo como filósofo —el gran comentarista de Aristóteles—, pero también fue un médico destacado.",
          "Escribió un tratado médico general, el Kulliyat («Generalidades»), que intentaba ordenar toda la medicina de su tiempo en un sistema claro y razonado, y que se tradujo y estudió en Europa durante siglos.",
          "Defendía que la medicina y la filosofía se necesitaban mutuamente: entender el cuerpo exigía entender la naturaleza, y curar bien exigía razonar bien. Para él, observar y pensar eran inseparables.",
          "Su enorme influencia intelectual ayudó a que el saber griego, cuidadosamente comentado, regresara a las universidades europeas y reavivara la curiosidad por el cuerpo humano.",
        ],
        "Dato curioso: en la Europa medieval a Averroes se le llamaba simplemente «el Comentador», por la calidad de sus explicaciones de Aristóteles. Su medicina viajó pegada a su filosofía."),
      hito("islam", "hospitales", "Los primeros hospitales", "El bimaristán",
        "¿Y si existiera un lugar donde cualquiera pudiera ser atendido, gratis?",
        [
          "El mundo islámico creó los bimaristanes, hospitales avanzados que atendían a los enfermos con independencia de su religión, su origen o su dinero.",
          "Eran instituciones sorprendentemente modernas: tenían salas separadas por enfermedades, médicos de guardia, farmacia, biblioteca y espacios para enseñar a los futuros médicos.",
          "Algunos incluían salas dedicadas a la salud mental, tratando a los enfermos con dignidad en una época en que en otros lugares se los abandonaba.",
          "Fue el nacimiento del hospital tal como lo entendemos hoy: un lugar de cuidado, enseñanza e investigación a la vez.",
        ],
        "Dato curioso: en algunos bimaristanes, cuando un paciente se curaba y no tenía recursos, se le entregaba una cantidad de dinero para que pudiera recuperarse sin necesidad de volver a trabajar de inmediato."),
      hito("islam", "metodo-humanismo", "Método clínico y humanismo", "El médico trata personas",
        "¿Se cura mejor una enfermedad... o una persona?",
        [
          "Los médicos islámicos desarrollaron un método clínico riguroso: observar los síntomas, interrogar al paciente, seguir la evolución y registrar los resultados. Muchos llevaban historias clínicas de sus casos.",
          "Pero, junto al rigor, cultivaron una profunda humanidad. Insistían en tratar al enfermo con compasión, escuchándolo y respetándolo como persona.",
          "Entendieron que el estado de ánimo, la confianza y el trato influyen en la curación, uniendo así la razón griega con el cuidado del ser humano completo.",
          "De ellos nos llega una de las lecciones más valiosas de toda la historia de la medicina: nunca se trata una enfermedad en abstracto, siempre se trata a una persona concreta.",
        ]),
      hito("islam", "islam-aplicalo", "Aplícalo a tu vida", "",
        "El islam te enseña el poder de la compasión clínica.",
        [
          "En qué se equivocaban: seguían apoyándose en la teoría de los humores y en muchos remedios ineficaces heredados de la Antigüedad.",
          "Qué sigue siendo válido: el rigor de observar y registrar, la idea del hospital como lugar de cuidado para todos, y el trato humano y compasivo al enfermo.",
          "Tu ejercicio: cuando cuides a alguien que sufre —o cuando te cuides a ti—, recuerda que detrás de un síntoma siempre hay una persona con miedo, historia y emociones.",
          "Escuchar, acompañar y tratar con dignidad no es un extra: es parte de la cura. Practícalo con quien tengas cerca.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // PASO 8 — RENACIMIENTO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "renacimiento",
    titulo: "Renacimiento: mirar dentro",
    anio: "Siglos XVI-XVII",
    intro:
      "Durante siglos, la medicina había creído lo que decían los libros antiguos. En el Renacimiento, por fin, alguien se atrevió a mirar. Se abrieron cuerpos, se dibujó la anatomía real, se inventó el microscopio y se descubrió que la sangre circulaba y que estábamos hechos de células. La gran pregunta cambió por completo: en lugar de «¿qué dijo Galeno?», se empezó a preguntar «¿qué veo yo cuando miro de verdad?». Fue el momento en que la medicina pasó de creer a comprobar. El giro más importante de toda su historia.",
    subhitos: [
      hito("renacimiento", "paracelso", "Paracelso", "1493-1541",
        "¿Y si la naturaleza enseñara más que todos los libros antiguos?",
        [
          "Paracelso fue un médico rebelde e inconformista. Llegó a quemar en público los libros de Galeno y de Avicena para dejar claro que la medicina no podía seguir viviendo solo de repetir a los antiguos.",
          "Defendía aprender de la observación directa, de la naturaleza y de la experiencia con los enfermos. Viajó sin descanso recogiendo saberes de médicos, cirujanos e incluso curanderos populares.",
          "Fue pionero en usar sustancias químicas y minerales como remedios, abriendo el camino de la farmacología moderna. Todavía mezclaba ciencia, alquimia y misticismo, pero empujó a la medicina hacia lo experimental.",
          "Su idea más famosa sigue siendo la base de la farmacología: cualquier sustancia puede curar o envenenar según la cantidad.",
        ],
        "Dato curioso: la frase de Paracelso «la dosis hace el veneno» significa que hasta el agua puede ser dañina en exceso, y que hasta un veneno puede ser medicina en su dosis justa."),
      hito("renacimiento", "vesalio", "Vesalio", "1514-1564",
        "¿Y si los libros llevaran mil años equivocados?",
        [
          "Andrés Vesalio hizo algo que casi nadie se había atrevido a hacer: diseccionar cuerpos humanos con sus propias manos y dibujar lo que realmente veía.",
          "Descubrió que Galeno se había equivocado en muchos puntos, porque había estudiado animales. Vesalio corrigió esos errores basándose en la observación directa del cuerpo humano.",
          "En 1543 publicó un tratado de anatomía con ilustraciones extraordinariamente precisas y bellas, que revolucionó el estudio del cuerpo.",
          "Su mensaje era claro: hay que fiarse de lo que se observa, aunque contradiga a las mayores autoridades del pasado.",
        ],
        "Dato curioso: la obra de Vesalio se publicó el mismo año que la de Copérnico sobre el movimiento de la Tierra. 1543 suele considerarse el año en que empezó la revolución científica."),
      hito("renacimiento", "harvey", "William Harvey", "1578-1657",
        "¿Adónde va toda la sangre?",
        [
          "Se creía, siguiendo a Galeno, que el hígado fabricaba sangre continuamente y que esta se consumía en el cuerpo. Harvey demostró que eso era imposible.",
          "Midió cuánta sangre bombea el corazón y calculó que, si se consumiera, el cuerpo tendría que producir cantidades imposibles cada hora. La única explicación era que la misma sangre circulaba una y otra vez.",
          "Descubrió así la circulación de la sangre: el corazón es una bomba que impulsa la sangre por un circuito cerrado a través de las arterias y las venas.",
          "Fue un triunfo del método científico: observar, medir, razonar y demostrar, en lugar de repetir lo que decían los antiguos.",
        ]),
      hito("renacimiento", "hooke-microscopio", "Hooke y el microscopio", "1665",
        "¿Qué hay más allá de lo que el ojo puede ver?",
        [
          "El microscopio abrió un mundo completamente nuevo. Robert Hooke lo apuntó hacia un trozo de corcho y vio que estaba formado por pequeñas cavidades, a las que llamó células.",
          "Era la primera vez que alguien veía la unidad básica de la vida, aunque todavía no comprendía del todo su importancia.",
          "El instrumento demostró que la realidad era mucho más rica y compleja de lo que los sentidos podían captar por sí solos.",
          "La medicina empezó a intuir que los grandes secretos del cuerpo estaban en lo muy pequeño, en un mundo invisible que faltaba por explorar.",
        ]),
      hito("renacimiento", "leeuwenhoek", "Leeuwenhoek", "1632-1723",
        "¿Y si estuviéramos rodeados de seres vivos que nadie ha visto jamás?",
        [
          "Antonie van Leeuwenhoek fabricaba lentes de una calidad asombrosa. Con ellas observó una gota de agua y quedó atónito: estaba llena de diminutos seres que se movían.",
          "Los llamó «animálculos». Había descubierto los microorganismos: bacterias y otros seres invisibles que viven por todas partes, incluso dentro de nosotros.",
          "En aquel momento nadie imaginaba que aquellos seres minúsculos podían causar enfermedades. Ese vínculo tardaría casi dos siglos en establecerse.",
          "Pero el descubrimiento fue una semilla decisiva: por primera vez, la humanidad veía a los futuros protagonistas de una de las mayores revoluciones de la medicina.",
        ],
        "Dato curioso: Leeuwenhoek no era médico ni científico de profesión, sino comerciante de telas. Su pasión por las lentes lo convirtió, sin proponérselo, en el descubridor del mundo microscópico."),
      hito("renacimiento", "renacimiento-aplicalo", "Aplícalo a tu vida", "",
        "El Renacimiento te enseña a pasar de creer a mirar.",
        [
          "En qué se equivocaban: aún no comprendían el papel de las células ni de los microbios, y muchos tratamientos seguían siendo inútiles.",
          "Qué sigue siendo válido: la actitud de comprobar por uno mismo, medir, observar la realidad y no dar nada por cierto solo porque lo diga una autoridad.",
          "Tu ejercicio: aplica esa mirada a tu propia salud. En lugar de creer lo que «se dice» sobre lo que te conviene, observa qué te ocurre a ti cuando duermes bien, cuando comes de cierta forma, cuando te mueves.",
          "Conviértete en el Vesalio de tu propio cuerpo: mira dentro, con honestidad y sin prejuicios.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // PASO 9 — LA REVOLUCIÓN CIENTÍFICA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "revolucion-cientifica",
    titulo: "La revolución científica",
    anio: "Siglos XVII-XVIII",
    intro:
      "Mirar ya no bastaba: había que aprender a mirar bien. La revolución científica dio a la humanidad una herramienta poderosísima, el método científico, que enseñó a distinguir lo que creemos de lo que podemos demostrar. La gran pregunta pasó a ser: «¿cómo sé que esto es verdad y no solo una creencia mía?». Filósofos como Descartes y Bacon establecieron las reglas del juego, y la medicina, poco a poco, aprendió a someter sus ideas a la prueba de la experiencia. Fue el cimiento sobre el que se construiría toda la medicina moderna.",
    subhitos: [
      hito("revolucion-cientifica", "bacon", "Francis Bacon", "1561-1626",
        "¿Y si dejáramos de adivinar cómo funciona el mundo y empezáramos a comprobarlo?",
        [
          "Francis Bacon criticaba a quienes construían grandes teorías sin observar la realidad. Para él, el conocimiento verdadero debía nacer de la experiencia y del experimento.",
          "Propuso reunir muchos datos, compararlos y extraer de ellos conclusiones generales, comprobándolas una y otra vez. Es lo que hoy llamamos método inductivo.",
          "Insistió en algo esencial: hay que desconfiar de nuestras propias ideas preconcebidas, porque tendemos a ver lo que queremos ver.",
          "Su forma de pensar sentó las bases de la ciencia experimental, incluida la medicina que aprende observando y probando.",
        ]),
      hito("revolucion-cientifica", "descartes", "René Descartes", "1596-1650",
        "¿Cómo estar seguro de algo cuando podríamos estar engañados en todo?",
        [
          "Descartes buscaba una base absolutamente segura para el conocimiento. Decidió dudar de todo lo que pudiera ser falso, hasta encontrar algo indudable.",
          "Llegó a una certeza: aunque dude de todo, no puedo dudar de que estoy pensando. «Pienso, luego existo».",
          "Aplicó a la ciencia una idea influyente: entender el cuerpo como una especie de máquina que funciona según leyes que se pueden estudiar y comprender.",
          "Esta visión ayudó enormemente a estudiar el cuerpo con método, aunque, como veremos, tenía un riesgo: olvidar que el ser humano es mucho más que una máquina.",
        ],
        "Dato curioso: la idea del cuerpo como máquina impulsó la medicina científica, pero también separó durante siglos el cuerpo de la mente, una división que la medicina de hoy intenta volver a unir."),
      hito("revolucion-cientifica", "metodo-cientifico", "El método científico", "La gran herramienta",
        "¿Cómo distinguir un remedio que funciona de uno que solo lo parece?",
        [
          "La gran conquista de esta época fue el método científico: una forma ordenada de buscar la verdad. Se observa un fenómeno, se plantea una hipótesis, se diseña un experimento y se comprueba el resultado.",
          "Lo esencial es que cualquiera puede repetir el experimento y comprobar si obtiene lo mismo. La verdad deja de depender de la autoridad de una persona y pasa a depender de las pruebas.",
          "Para la medicina, esto fue revolucionario. Por fin habría una manera de saber si un tratamiento cura de verdad o si solo parece hacerlo por casualidad o por sugestión.",
          "Sobre este método se construiría, con el tiempo, la medicina basada en la evidencia que salva millones de vidas hoy.",
        ]),
      hito("revolucion-cientifica", "sesgos", "Los sesgos: cómo nos engañamos", "El enemigo invisible",
        "¿Y si tu propia mente te hiciera ver curas donde no las hay?",
        [
          "Los pensadores de esta época descubrieron un problema incómodo: nuestra mente nos engaña constantemente. Vemos patrones que no existen, recordamos los aciertos y olvidamos los fallos, y creemos con facilidad lo que deseamos creer.",
          "Estos errores del pensamiento se llaman sesgos. Por su culpa, durante siglos se creyó que remedios completamente inútiles funcionaban: la gente sanaba sola y se lo atribuía al remedio.",
          "El método científico nació, en parte, para protegernos de nosotros mismos, obligándonos a comprobar en lugar de suponer.",
          "Reconocer que podemos equivocarnos fue, paradójicamente, uno de los mayores avances de la inteligencia humana.",
        ],
        "Dato curioso: por eso hoy los mejores estudios médicos se hacen «a doble ciego»: ni el paciente ni el médico saben quién recibe el tratamiento real y quién uno falso, para que las expectativas no distorsionen el resultado."),
      hito("revolucion-cientifica", "revolucion-aplicalo", "Aplícalo a tu vida", "",
        "La revolución científica te enseña a no engañarte.",
        [
          "En qué se equivocaba: la visión del cuerpo como pura máquina dejó de lado durante mucho tiempo las emociones y la mente.",
          "Qué sigue siendo válido: comprobar antes de creer, desconfiar de las conclusiones fáciles y saber que nuestra mente tiende a engañarnos.",
          "Tu ejercicio: pregúntate cuántas cosas crees sobre tu salud sin haberlas comprobado nunca en ti. ¿De verdad ese hábito te sienta bien, o solo lo supones?",
          "Prueba, observa y saca tus propias conclusiones honestas. Ser un poco científico contigo mismo es una de las mejores formas de cuidarte.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // PASO 10 — LOS MICROBIOS CAMBIAN EL MUNDO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "microbios",
    titulo: "Los microbios cambian el mundo",
    anio: "Siglos XVIII-XIX",
    intro:
      "Durante milenios, la humanidad ignoró a sus mayores enemigos porque eran invisibles. En el siglo XIX se descubrió por fin la verdad: muchas de las enfermedades más mortales las causan microorganismos diminutos. Este hallazgo, la teoría germinal, cambió el mundo más que casi ningún otro. La gran pregunta —«¿por qué enfermamos y morimos de infecciones?»— tuvo por fin respuesta. Y con ella llegaron las vacunas, la higiene médica y la prevención, que salvaron y siguen salvando cientos de millones de vidas.",
    subhitos: [
      hito("microbios", "jenner", "Edward Jenner", "1749-1823",
        "¿Y si una enfermedad leve pudiera protegernos de una mortal?",
        [
          "En el siglo XVIII, la viruela mataba y desfiguraba a millones de personas. Jenner observó algo curioso: las ordeñadoras que habían pasado la viruela de las vacas, mucho más leve, no enfermaban de la viruela humana.",
          "Se atrevió a probar una idea audaz: inoculó a un niño con material de la viruela vacuna y, después, comprobó que quedaba protegido frente a la viruela humana.",
          "Había inventado la vacuna, la primera forma de entrenar al cuerpo para defenderse de una enfermedad antes de sufrirla.",
          "Fue el comienzo de una de las herramientas más poderosas de la historia de la medicina.",
        ],
        "Dato curioso: la palabra «vacuna» viene precisamente de «vaca», en recuerdo de aquella viruela vacuna. Gracias a la vacunación, la viruela es hoy la única enfermedad humana totalmente erradicada del planeta."),
      hito("microbios", "pasteur", "Louis Pasteur", "1822-1895",
        "¿Quién es el culpable invisible de tantas muertes?",
        [
          "Pasteur demostró que muchos procesos, como la fermentación y la descomposición, los causan microorganismos vivos, no algo que surge de la nada.",
          "De ahí dedujo la teoría germinal: los microbios son responsables de muchas enfermedades infecciosas. Un cambio de mentalidad radical.",
          "Descubrió que calentar los líquidos destruía esos microbios, una técnica que hoy lleva su nombre: la pasteurización, que aún protege la leche y otros alimentos.",
          "Desarrolló además nuevas vacunas, entre ellas la de la rabia, salvando vidas y confirmando el poder de esta idea.",
        ]),
      hito("microbios", "koch", "Robert Koch", "1843-1910",
        "¿Cómo demostrar que un microbio concreto causa una enfermedad concreta?",
        [
          "Koch convirtió la teoría germinal en ciencia precisa. Desarrolló métodos para aislar y cultivar bacterias e identificar exactamente cuál provoca cada enfermedad.",
          "Descubrió el microbio responsable de la tuberculosis, una de las mayores asesinas de la época, y también el del cólera.",
          "Estableció unas reglas claras para demostrar que un germen concreto es la causa de una enfermedad concreta, un método que aún se usa.",
          "Gracias a él, la medicina pudo empezar a poner nombre y apellido a sus enemigos invisibles.",
        ]),
      hito("microbios", "higiene-esterilizacion", "Higiene y esterilización", "Salvar vidas con jabón",
        "¿Puede lavarse las manos salvar más vidas que una operación?",
        [
          "Antes de conocer los microbios, los cirujanos operaban con las manos y los instrumentos sucios, y muchísimos pacientes morían de infección después de la operación.",
          "Cuando se entendió que los gérmenes causaban esas infecciones, todo cambió. Se empezó a lavar las manos, esterilizar el instrumental y desinfectar las heridas.",
          "El médico Ignaz Semmelweis ya había demostrado, incluso antes, que lavarse las manos reducía drásticamente las muertes de las madres en los partos, aunque en su momento no le creyeron.",
          "Estas medidas tan sencillas salvaron y siguen salvando incontables vidas. A veces, el mayor avance no es un aparato complejo, sino la limpieza.",
        ],
        "Dato curioso: Semmelweis fue rechazado y ridiculizado por sus colegas por defender el lavado de manos. Murió sin ser reconocido; hoy se le honra como un pionero que se adelantó a su tiempo."),
      hito("microbios", "microbios-aplicalo", "Aplícalo a tu vida", "",
        "Los microbios te enseñan que la salud también depende de enemigos invisibles.",
        [
          "En qué se equivocaban: al principio, el entusiasmo por los microbios hizo pensar que toda enfermedad venía de fuera, olvidando el papel del propio cuerpo y del estilo de vida.",
          "Qué sigue siendo válido: la higiene, la vacunación y la prevención. Evitar la enfermedad sigue siendo mejor que curarla.",
          "Tu ejercicio: valora los gestos sencillos que te protegen: lavarte las manos, cuidar la alimentación, dormir bien para reforzar tus defensas, vacunarte cuando corresponde.",
          "La prevención no es glamurosa, pero es una de las medicinas más poderosas que existen. Y está en tus manos, literalmente.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // PASO 11 — LA MEDICINA MODERNA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "medicina-moderna",
    titulo: "La medicina moderna",
    anio: "Siglo XX",
    intro:
      "El siglo XX fue el siglo de los milagros médicos. Aparecieron los antibióticos, que vencieron infecciones antes mortales; se comprendió cómo el cuerpo se mantiene en equilibrio; se organizó el hospital moderno y la medicina se dividió en especialidades cada vez más precisas. Curamos como nunca antes en la historia. Pero, junto a este triunfo, surgió una pregunta incómoda que abre el último capítulo del viaje: hemos aprendido a curar enfermedades con una eficacia asombrosa, ¿pero entendemos igual de bien al ser humano completo?",
    subhitos: [
      hito("medicina-moderna", "fleming", "Alexander Fleming", "1881-1955",
        "¿Puede un descuido cambiar la historia de la humanidad?",
        [
          "En 1928, Fleming dejó unas placas con bacterias sin cubrir antes de irse de vacaciones. Al volver, encontró que un moho había contaminado una de ellas y que, a su alrededor, las bacterias habían muerto.",
          "Aquel moho producía una sustancia que mataba bacterias: la penicilina, el primer antibiótico.",
          "Los antibióticos transformaron la medicina. Enfermedades que antes eran una sentencia de muerte —una neumonía, una herida infectada— se volvieron curables con unas pocas dosis.",
          "Se calcula que los antibióticos han salvado cientos de millones de vidas. Pocas veces la casualidad y la observación atenta han dado tanto a la humanidad.",
        ],
        "Dato curioso: hoy el uso excesivo de antibióticos está creando bacterias resistentes. Un recordatorio de que hasta los mayores triunfos de la medicina hay que usarlos con sabiduría."),
      hito("medicina-moderna", "cannon-homeostasis", "Cannon y la homeostasis", "El equilibrio interior",
        "¿Cómo consigue el cuerpo mantenerse estable pase lo que pase?",
        [
          "Walter Cannon describió una de las ideas más importantes de la fisiología: la homeostasis, la capacidad del cuerpo para mantener estable su medio interno.",
          "Aunque haga frío o calor, aunque comas o ayunes, aunque corras o descanses, tu temperatura, tu azúcar y tu equilibrio se mantienen dentro de unos límites gracias a ajustes constantes.",
          "La salud es, en buena medida, esa capacidad de volver siempre al equilibrio. Enfermar es cuando el cuerpo ya no logra recuperarlo.",
          "Curiosamente, esta idea moderna se parece mucho a lo que intuían el Ayurveda y la medicina china miles de años antes: la salud es equilibrio dinámico.",
        ]),
      hito("medicina-moderna", "osler-hospital", "Osler y el hospital moderno", "Aprender junto al enfermo",
        "¿Dónde se aprende de verdad a ser médico?",
        [
          "William Osler transformó la manera de formar a los médicos. Sacó a los estudiantes de las aulas y los llevó junto a la cama del paciente, donde debían observar, examinar y aprender de casos reales.",
          "Ayudó a organizar el hospital moderno: un lugar donde se atiende, se investiga y se enseña al mismo tiempo, con especialistas y trabajo en equipo.",
          "Insistía en que el médico no debía perder de vista a la persona detrás de la enfermedad, a pesar de todos los avances técnicos.",
          "Su famoso consejo resume toda una filosofía: es más importante saber qué clase de paciente tiene una enfermedad que qué clase de enfermedad tiene un paciente.",
        ]),
      hito("medicina-moderna", "especializacion-moderna", "La especialización", "Saber mucho de poco",
        "¿Se puede saber demasiado de una parte y perder de vista el todo?",
        [
          "La explosión de conocimiento del siglo XX obligó a los médicos a especializarse. Aparecieron cardiólogos, neurólogos, oncólogos, cirujanos de cada parte del cuerpo.",
          "Esta especialización permitió avances enormes: cada médico podía dominar en profundidad su campo y ofrecer tratamientos muy precisos.",
          "Pero trajo también un riesgo: mirar tanto una parte que se pierde de vista a la persona entera. El paciente podía convertirse en «un corazón», «un hígado» o «un caso».",
          "De esta tensión nacería la última gran pregunta de la medicina: cómo unir de nuevo todas las piezas para volver a ver al ser humano completo.",
        ]),
      hito("medicina-moderna", "moderna-aplicalo", "Aplícalo a tu vida", "",
        "Curamos mejor que nunca... pero ¿entendemos mejor al ser humano?",
        [
          "En qué se equivocaba: al centrarse tanto en la enfermedad y en la técnica, la medicina moderna a veces olvidó a la persona, sus emociones y su forma de vivir.",
          "Qué sigue siendo válido: el poder inmenso de la ciencia para curar, la homeostasis como clave de la salud y la formación rigurosa junto al enfermo.",
          "Tu ejercicio: aprovecha lo mejor de la medicina moderna sin renunciar a mirarte entero. Los medicamentos y los especialistas son valiosísimos, pero tú eres más que la suma de tus órganos.",
          "Cuando busques ayuda, busca también quien te vea como persona, no solo como diagnóstico. Y hazlo tú mismo contigo.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // PASO 12 — LA PSIQUIATRÍA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "psiquiatria",
    titulo: "La psiquiatría: curar la mente",
    anio: "Siglos XIX-XX",
    intro:
      "Durante casi toda la historia, la medicina supo mirar el cuerpo, pero no la mente. La enfermedad mental se vivía como posesión, castigo o vergüenza, y a quien la sufría se le encerraba y se le apartaba. La gran pregunta de esta etapa fue revolucionaria: ¿puede la mente enfermar igual que el cuerpo, y puede curarse? La respuesta llegó en tres oleadas: primero, tratar al enfermo mental como una persona que merece cuidado (Pinel); después, descubrir que hablar de lo que duele puede sanar (Freud); y por fin, en el siglo XX, algo que lo cambió todo: el descubrimiento de que ciertas sustancias podían calmar la mente atormentada. Nacía la psicofarmacología, y con ella se confirmaban las tres formas de curar del principio de este viaje: la física, la química y la psicológica.",
    subhitos: [
      hito("psiquiatria", "locura-historia", "La locura, de la posesión a la enfermedad", "Durante casi toda la historia",
        "¿Qué se hacía, antes, con quien perdía la razón?",
        [
          "Durante casi toda la historia, la enfermedad mental fue la gran incomprendida. Se veía como un castigo divino, una posesión de espíritus o una vergüenza que había que esconder.",
          "A quienes sufrían trastornos mentales se les temía, se les apartaba y muchas veces se les encerraba en condiciones terribles, encadenados y sin ningún tratamiento ni cuidado.",
          "Faltaba una idea sencilla pero revolucionaria: que la mente, igual que el cuerpo, también puede enfermar, y que quien la sufre es un enfermo que merece ayuda, no un culpable que merece castigo.",
          "Reconocer eso —que el sufrimiento mental es una enfermedad y no un defecto moral— fue el primer gran paso de la psiquiatría.",
        ],
        "Dato curioso: durante siglos existieron lugares donde la gente pagaba una entrada para ver a los enfermos mentales encerrados, como si fueran un espectáculo. Cuesta imaginar hasta qué punto se malinterpretaba su sufrimiento."),
      hito("psiquiatria", "pinel", "Philippe Pinel", "1745-1826",
        "¿Y si a los «locos» hubiera que quitarles las cadenas en lugar de ponérselas?",
        [
          "Philippe Pinel fue un médico francés que, a finales del siglo XVIII, hizo algo que escandalizó a su época: mandó quitar las cadenas a los enfermos mentales de los hospitales de París.",
          "Defendía tratarlos con humanidad, hablar con ellos, observarlos y cuidarlos, en lugar de castigarlos o abandonarlos. Fue el llamado «tratamiento moral».",
          "Empezó a clasificar los distintos trastornos mentales y a estudiarlos como enfermedades, con sus causas y su evolución, igual que la medicina hacía con el resto del cuerpo.",
          "Por eso se le considera uno de los padres de la psiquiatría: convirtió la locura en objeto de la medicina y al enfermo mental en un paciente con derecho a ser cuidado.",
        ],
        "Dato curioso: el gesto de Pinel liberando de sus cadenas a los enfermos se ha pintado muchas veces como símbolo del nacimiento de una medicina más humana."),
      hito("psiquiatria", "freud", "Sigmund Freud", "1856-1939",
        "¿Y si algunas heridas no estuvieran en el cuerpo, sino en lo que no recordamos?",
        [
          "Sigmund Freud, médico neurólogo vienés, propuso una idea que cambiaría para siempre la forma de entender la mente: gran parte de lo que sentimos y hacemos nace de una zona oculta de nosotros mismos, el inconsciente.",
          "Según él, experiencias, deseos y conflictos que hemos olvidado o reprimido siguen influyendo en nosotros y pueden provocar sufrimiento. Creó el psicoanálisis para sacarlos a la luz hablando.",
          "Su método consistía en escuchar al paciente durante horas: sus recuerdos, sus sueños, lo que decía sin darse cuenta. Por primera vez, la palabra se convertía en un tratamiento.",
          "Muchas de sus teorías concretas han sido superadas o discutidas, pero su gran intuición sigue viva: hablar de lo que nos duele y comprender nuestra propia historia puede curar.",
        ],
        "Dato curioso: al psicoanálisis se le llamó «la cura por la palabra». Fue el antepasado de todas las psicoterapias que hoy ayudan a millones de personas."),
      hito("psiquiatria", "psicofarmacos", "El nacimiento de los psicofármacos", "Desde 1950",
        "¿Puede una simple pastilla calmar una mente atormentada?",
        [
          "A mediados del siglo XX ocurrió una de las revoluciones más silenciosas y más importantes de la medicina: se descubrió que ciertas sustancias químicas podían aliviar de verdad los trastornos mentales.",
          "En 1952, en París, la clorpromazina —el primer antipsicótico— demostró que podía calmar los delirios y la agitación de enfermos que hasta entonces parecían perdidos. Poco después llegaron el litio, capaz de estabilizar el ánimo, y los primeros antidepresivos.",
          "El efecto fue extraordinario. Muchos hospitales psiquiátricos, auténticos almacenes de enfermos sin esperanza, empezaron a vaciarse: por fin había tratamientos que permitían a muchas personas volver a vivir fuera del encierro.",
          "Nacía así la psicofarmacología. Se confirmaba algo profundo: la mente tiene una base química en el cerebro, y actuar sobre esa química puede ayudar a devolver el equilibrio perdido.",
        ],
        "Dato curioso: muchos de aquellos primeros psicofármacos se descubrieron casi por casualidad, al observar que fármacos pensados para otra cosa cambiaban el ánimo o la conducta de los pacientes."),
      hito("psiquiatria", "psiquiatria-aplicalo", "Aplícalo a tu vida", "",
        "La psiquiatría te enseña que la mente también se cuida.",
        [
          "En qué se equivocó: cayó a veces en los extremos, del encierro y los tratamientos brutales del pasado al riesgo, más moderno, de medicarlo todo y olvidar a la persona que hay detrás.",
          "Qué sigue siendo válido: que el sufrimiento mental es real, que no es una vergüenza ni una debilidad, y que se puede tratar —con palabra, con apoyo y, cuando hace falta, con medicación—.",
          "Tu ejercicio: trata tu salud mental con el mismo respeto que la física. Pedir ayuda a un profesional cuando la mente duele es tan sensato como ir al médico por una herida.",
          "Y recuerda las tres formas de curar del principio del viaje: muchas veces lo que mejor sana la mente es una combinación de las tres —cuidar el cuerpo, ajustar la química y hablar de lo que duele—.",
        ]),
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // PASO 13 — LA MEDICINA INTEGRATIVA
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "integrativa",
    titulo: "La medicina integrativa",
    anio: "Siglos XX-XXI",
    intro:
      "Aquí se cierra el círculo y se conecta con todo tu curso. Tras milenios de historia, la medicina más avanzada está redescubriendo algo que las culturas antiguas ya intuían: que la salud no es solo eliminar enfermedades, sino cuidar a la persona completa. La medicina integrativa no rechaza la ciencia —al contrario, se apoya en la evidencia—, pero suma a ella la nutrición, la psicología, el estilo de vida, la relación humana y la personalización. Es el reencuentro entre la razón de Grecia, la observación de Egipto, el equilibrio de la India, el flujo de China y la evidencia moderna. Todo lo aprendido, por fin, integrado.",
    subhitos: [
      hito("integrativa", "que-es-integrativa", "¿Qué es la medicina integrativa?", "El reencuentro",
        "¿Y si el futuro de la medicina consistiera en unir lo mejor de toda su historia?",
        [
          "La medicina integrativa parte de una idea sencilla y poderosa: tratar a la persona entera, no solo su enfermedad. Cuerpo, mente, emociones, hábitos y entorno forman un todo.",
          "No se opone a la medicina científica: la usa como base. Pero le suma herramientas que la ciencia había dejado de lado, como la nutrición, la actividad física, la gestión del estrés y la calidad de la relación entre médico y paciente.",
          "Su criterio es siempre la evidencia: incorpora aquello que demuestra funcionar y descarta lo que no, venga de donde venga.",
          "Es, en cierto modo, la síntesis de todo este viaje: la razón griega, la observación egipcia, el equilibrio indio, el flujo chino y el rigor moderno, trabajando juntos.",
        ]),
      hito("integrativa", "pilares-integrativa", "Los pilares del cuidado", "Nutrición, mente y estilo de vida",
        "¿Cuánta de tu salud depende de cómo vives cada día?",
        [
          "La medicina integrativa presta especial atención a lo que construye la salud día a día: la alimentación, el sueño, el movimiento, las relaciones y la forma de afrontar el estrés.",
          "La nutrición se entiende como una medicina cotidiana: lo que comes influye en tu energía, tu ánimo y tu riesgo de enfermar.",
          "La psicología se reconoce como parte esencial: las emociones, el estrés y el sentido de la vida afectan directamente al cuerpo, tal como intuía ya el chamán.",
          "Y se recuperan saberes como la fitoterapia —el uso de plantas medicinales—, siempre valorados con criterio científico.",
          "Todo ello se personaliza: el mejor cuidado es el que se adapta a tu constitución, tu historia y tu vida, como enseñaba el Ayurveda.",
        ]),
      hito("integrativa", "andrew-weil", "Andrew Weil", "1942-",
        "¿Puede un médico formado en la mejor ciencia defender la curación natural?",
        [
          "Andrew Weil, médico formado en una de las universidades más prestigiosas del mundo, es uno de los grandes impulsores de la medicina integrativa moderna.",
          "Defiende combinar los avances de la medicina científica con la nutrición, la relajación, el ejercicio y el poder de curación del propio cuerpo.",
          "Insiste en algo que recorre toda esta historia: el organismo tiene una enorme capacidad de sanar por sí mismo, y buena parte de la medicina consiste en crear las condiciones para que lo haga.",
          "Su trabajo ayudó a que hospitales y universidades tomaran en serio el cuidado de la persona completa, con rigor y sin renunciar a la evidencia.",
        ]),
      hito("integrativa", "avicena-steiner", "Inspiraciones y matices", "Avicena y Steiner",
        "¿Qué del pasado sigue inspirando a la medicina del futuro?",
        [
          "La medicina integrativa mira también atrás en busca de inspiración. Avicena, mil años antes, ya trataba al paciente como un todo, uniendo cuerpo, dieta, emociones y entorno: un precursor histórico de esta visión.",
          "También existen corrientes como la medicina antroposófica, propuesta por Rudolf Steiner, que busca integrar aspectos espirituales en el cuidado del enfermo.",
          "Es importante ser claro: la antroposofía es una corriente filosófico-médica, no una medicina basada en la evidencia. Aporta una mirada sobre la persona, pero no sustituye a los tratamientos comprobados científicamente.",
          "La medicina integrativa seria distingue siempre lo que tiene respaldo científico de lo que pertenece al terreno de las creencias, y coloca la seguridad del paciente por encima de todo.",
        ],
        "Dato curioso: hoy numerosos hospitales y universidades cuentan con centros de medicina integrativa donde investigadores estudian con métodos científicos qué prácticas complementarias funcionan realmente y cuáles no."),
      hito("integrativa", "mensaje-final", "Mensaje final", "",
        "Después de 20.000 años buscando la salud, descubrimos algo sorprendente.",
        [
          "La medicina no consiste únicamente en eliminar enfermedades.",
          "Consiste en aprender a vivir de una forma que favorezca la salud.",
          "Cada civilización te ha dado una lente para conocerte: el chamán te enseñó el poder de la mente; Egipto, la observación; la India, el equilibrio; China, el flujo; Grecia, la razón; el islam, la compasión clínica; el Renacimiento, la evidencia; y la medicina moderna, la integración de todo ello.",
          "Al principio te preguntamos qué haces tú cuando enfermas. Ahora ya sabes que, sin saberlo, llevabas dentro veinte mil años de sabiduría.",
          "Tu ejercicio final, para el resto de tu vida: cuídate como una persona completa. Escucha tu mente, observa tu cuerpo, busca tu equilibrio, respeta tu ritmo, exige evidencia y trátate con compasión.",
          "Ese es el verdadero final de este viaje: no aprender historia, sino aprender a vivir sano.",
        ]),
    ],
  },
];
