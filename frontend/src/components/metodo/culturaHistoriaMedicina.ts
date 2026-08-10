import type { HitoHistoria, SubHito } from "./culturaHistoriaUniversal";
import type { Vineta } from "./ComicViewer";

// ─────────────────────────────────────────────────────────────────────────
// HISTORIA DE LA MEDICINA (Cultura). Tagline: «20.000 años buscando la salud —
// cómo la humanidad aprendió a curar, y a curarse».
//
// Mismo modelo que las demás Historias: ETAPAS → SUB-HITOS (cada uno
// con su cómic: cuerpo + dato curioso, foto + texto a la
// derecha). Estructura del índice: Prólogo + 12 pasos (del chamán a la medicina
// integrativa). Cada paso sigue una plantilla implícita: autores y descubrimientos
// (sub-hitos) → en qué se equivocaron / qué sigue válido → «aplícalo a tu vida»
// (sub-hito final, ejercicio).
//
// No es solo historia: es un viaje de autoconocimiento. Cada civilización ofrece
// una lente distinta para conocerse — el chamán la mente, Egipto la observación,
// India el equilibrio, China el flujo, Grecia la razón, el islam la compasión
// clínica, el Renacimiento la evidencia, la medicina moderna la integración.
//
// Fotos planas en /recorrido/cultura/historiamedicina/<subKey>.webp (el nombre
// del archivo = key del sub-hito; la carpeta aún no existe, así que de momento
// todos los círculos pintan su marcador y los cómics el «próximamente»). El
// texto se pinta con `separarFrases` (salto de línea tras cada punto).
//
// CÓMO SE CUENTA (igual que en las demás Historias): que se ENTIENDA, no que se
// cuente. Cada momento es cuerpo (qué problema había y cómo se resolvió) →
// «Dato curioso» (opcional: solo si de verdad hay algo curioso que contar), y
// cuando el tema da para más (cómo
// funciona el placebo, por qué las sangrías duraron dos mil años, el primer
// ensayo clínico, las resistencias a los antibióticos, los tratamientos
// psiquiátricos que hoy nos horrorizan…) se le añaden páginas «Profundiza» con
// el parámetro `extras`: viñetas EXTRA del mismo momento, no círculos nuevos.
//
// Momentos sin fecha (eyebrow "") = pasajes de síntesis/ejercicio (p. ej.
// «Aplícalo a tu vida», «Mensaje final»): el ComicViewer oculta el antetítulo
// cuando va vacío.
// ─────────────────────────────────────────────────────────────────────────

// Todas las fotos (círculo + viñeta) van planas en una sola carpeta, con el
// nombre del sub-hito (misma convención que las demás Historias).
const foto = (_era: string, sub: string) =>
  `/recorrido/cultura/historiamedicina/${sub}.webp`;

/** Página «Profundiza» de un momento: una viñeta más, con la misma foto. */
interface Profundiza {
  titulo: string;
  cuerpo: string[];
  /** Uno o dos datos curiosos (ver `Datos`). */
  dato?: Datos;
}

/** Los datos curiosos de un momento: uno («Dato curioso: …»), dos (el segundo
 *  escrito como «Dato curioso II: …») o ninguno. */
type Datos = string | string[];

const enLista = (x?: Datos) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const esProfundiza = (x: unknown): x is Profundiza[] =>
  Array.isArray(x) && typeof x[0] === "object";

// Sub-hito con su cómic: viñeta principal (`pregunta` gancho + `cuerpo` + hasta
// dos datos curiosos, OPCIONALES) y, opcionalmente, páginas «Profundiza» detrás.
// Si el momento no tiene ningún dato curioso pero sí «Profundiza», se pasan los
// extras directamente en su lugar (sin `undefined` de relleno).
const hito = (
  era: string, key: string, titulo: string, fecha: string,
  pregunta: string, cuerpo: string[],
  datosOExtras?: Datos | Profundiza[], masExtras?: Profundiza[],
): SubHito => {
  const datos = esProfundiza(datosOExtras) ? [] : enLista(datosOExtras);
  const extras = esProfundiza(datosOExtras) ? datosOExtras : masExtras;
  const src = foto(era, key);
  const paragraphs: string[] = [];
  if (pregunta) paragraphs.push(pregunta);
  paragraphs.push(...cuerpo, ...datos);
  const vinetas: Vineta[] = [{ src, eyebrow: fecha, titulo, paragraphs }];
  (extras ?? []).forEach((e) => {
    vinetas.push({
      src,
      eyebrow: "Profundiza",
      titulo: e.titulo,
      paragraphs: [...e.cuerpo, ...enLista(e.dato)],
    });
  });
  return { key, titulo, foto: src, vinetas };
};

export const HISTORIA_MEDICINA_HITOS: HitoHistoria[] = [
  // ───────────────────────────────────────────────────────────────────────
  // PRÓLOGO
  // ───────────────────────────────────────────────────────────────────────
  {
    key: "prologo",
    titulo: "¿Qué significa estar enfermo?",
    anio: "Antes de hablar de culturas",
    subhitos: [
      hito("prologo", "que-es-enfermedad", "¿Qué es una enfermedad?", "La pregunta de siempre",
        "",
        [
          "Explicar con tus propias palabras qué es estar enfermo parece fácil, pero no lo es. Durante siglos se pensó que la enfermedad era algo que entraba en el cuerpo desde fuera: un espíritu, un aire malo, un castigo divino.",
          "Hoy la entendemos de otra manera. Una enfermedad es una alteración en el funcionamiento del cuerpo o de la mente que rompe el equilibrio que llamamos salud. A veces la provoca un microbio, a veces un órgano que falla, a veces nuestros propios hábitos y a veces las emociones.",
          "Lo interesante es que la salud no es simplemente «no estar enfermo». Es un estado de equilibrio dinámico: el cuerpo se adapta constantemente al frío, al esfuerzo, al hambre o al estrés, y mientras logra volver a su centro, seguimos sanos.",
          "Enfermar, en el fondo, es perder esa capacidad de volver al equilibrio.",
        ],
        "Dato curioso: la Organización Mundial de la Salud define la salud no como la ausencia de enfermedad, sino como un estado completo de bienestar físico, mental y social. Una definición que muchas civilizaciones antiguas habrían compartido."),
      hito("prologo", "cuatro-tipos", "Los cuatro tipos de enfermedad", "Una brújula para entenderlas",
        "",
        [
          "No todas las enfermedades son iguales, y distinguirlas ayuda enormemente a entender la medicina. Podemos agrupar casi todo en cuatro grandes tipos.",
          "Los síntomas pasajeros: molestias leves y breves, como un dolor de cabeza o un catarro. El cuerpo suele resolverlos solo.",
          "Las enfermedades agudas: aparecen de golpe, son claras y normalmente tienen cura, como una infección o una apendicitis.",
          "Las enfermedades crónicas: se instalan durante años o para siempre, como la diabetes o la hipertensión. No siempre se curan, pero sí se pueden controlar.",
          "Y las enfermedades mortales: aquellas que ponen en peligro la vida y que han sido, a lo largo de la historia, el gran enemigo de la medicina.",
          "Casi toda la historia que vas a recorrer es, en realidad, la historia de cómo la humanidad fue aprendiendo a enfrentarse a cada uno de estos cuatro tipos.",
        ]),
      hito("prologo", "tres-formas-curar", "Las tres formas de curar", "El mapa completo",
        "",
        [
          "Cuando alguien se cura, ¿qué es exactamente lo que lo ha curado?",
          "A lo largo de toda la historia, por muy distintas que parezcan, todas las medicinas del mundo han curado usando solo tres grandes caminos.",
          "La curación física: actuar directamente sobre el cuerpo. Colocar un hueso, coser una herida, operar, aplicar calor o frío, masajear, mover. Es la medicina de las manos.",
          "La curación química: introducir una sustancia que cambia lo que ocurre dentro del cuerpo. Una planta, un mineral, un antibiótico, una vacuna. Es la medicina de los remedios.",
          "La curación psicológica: actuar sobre la mente, las emociones y las creencias del enfermo. La confianza, la esperanza, el sentido, la relación con quien cura. Es la medicina invisible, y quizá la más antigua de todas.",
          "Lo fascinante es que ninguna gran cultura usó solo una. Y la medicina más avanzada de hoy está redescubriendo que las tres, juntas, curan mejor que cualquiera por separado.",
        ],
        "Dato curioso: durante mucho tiempo la ciencia despreció la curación psicológica por considerarla «sugestión». Hoy sabemos que el efecto placebo es tan real que hay que medirlo en todos los ensayos médicos para no confundirlo con el efecto del fármaco."),
      hito("prologo", "que-haces-tu", "¿Qué haces tú cuando enfermas?", "",
        "",
        [
          "Antes de seguir, para un momento y mírate a ti.",
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
    subhitos: [
      hito("chaman", "primeros-sanadores", "Los primeros sanadores", "Hace más de 20.000 años",
        "",
        [
          "Mucho antes de las ciudades, de la escritura y de la ciencia, todas las culturas humanas tuvieron una figura parecida: el chamán, el curandero, el hechicero. Una persona que se ocupaba de los enfermos.",
          "No separaban el cuerpo del espíritu. Para ellos, enfermar era haber perdido el equilibrio con el mundo invisible, así que curar consistía en restaurar ese equilibrio mediante rituales, cantos, plantas y ceremonias.",
          "Aunque nos parezca pura superstición, aquellos sanadores acumularon un conocimiento asombroso sobre plantas curativas, aprendido a base de siglos de prueba y error. Muchos de sus remedios contenían principios activos que la farmacia moderna aún utiliza.",
          "Y hacían algo que hoy sabemos que es medicina de verdad: acompañar al enfermo y darle una explicación y una esperanza.",
        ],
        "Dato curioso: se han encontrado cráneos prehistóricos con agujeros hechos a propósito —la llamada trepanación— y con signos de haber cicatrizado. Es decir: el paciente sobrevivió a una operación de cráneo hace miles de años."),
      hito("chaman", "ritual-esperanza", "El ritual y la esperanza", "La primera medicina",
        "",
        [
          "El chamán no daba solo una planta: daba un ritual. Encendía fuego, cantaba, invocaba fuerzas, ponía las manos. Todo eso creaba una experiencia intensa y cargada de significado.",
          "Hoy entendemos por qué funcionaba. El ritual transformaba el miedo del enfermo en esperanza, y la esperanza cambia lo que ocurre en el cuerpo: relaja, reduce el dolor y activa las defensas.",
          "El enfermo dejaba de sentirse solo frente a algo incomprensible. Alguien con autoridad y confianza le decía: «Sé lo que te pasa y sé cómo ayudarte». Ese mensaje, por sí mismo, ya cura una parte.",
          "La primera gran medicina de la humanidad no fue un fármaco. Fue lograr que una persona creyera que podía sanar.",
        ]),
      hito("chaman", "placebo", "El poder de la mente: el placebo", "Un descubrimiento eterno",
        "",
        [
          "Existe un fenómeno tan real que la ciencia moderna lo tiene que medir en todos sus experimentos: el efecto placebo. Cuando una persona confía en que un tratamiento va a funcionar, su cuerpo mejora de verdad, aunque el tratamiento no tenga ningún principio activo.",
          "No es imaginación ni engaño: el cerebro libera sustancias que calman el dolor, reducen la inflamación y mejoran el ánimo. La creencia se convierte en química.",
          "El chamán, sin saber nada de neuronas, dominaba este poder mejor que nadie. Todo su ritual estaba diseñado para maximizar la confianza del enfermo.",
          "Por eso su medicina, tantas veces despreciada como magia, contenía una verdad que seguimos usando hoy: la mente es una farmacia.",
        ],
        "Dato curioso: existe también el efecto contrario, el nocebo: si alguien cree que algo le va a hacer daño, puede llegar a sentir síntomas reales. La mente cura, pero también puede enfermar.",
        [
          {
            titulo: "Cómo funciona el placebo (y qué no puede hacer)",
            cuerpo: [
              "El placebo es la prueba más sólida que tenemos de que la mente y el cuerpo no son dos cosas separadas, y conviene entenderlo bien, porque se usa como excusa para dos errores opuestos: despreciarlo («es solo sugestión») o exagerarlo («la mente lo cura todo»).",
              "QUÉ OCURRE DE VERDAD. No es imaginación. Cuando alguien espera aliviarse, el cerebro pone en marcha respuestas medibles: libera sus propios opioides y dopamina, cambia la actividad de las zonas que procesan el dolor y modifica el ritmo cardiaco y las hormonas del estrés. Se ha visto en escáneres, y se puede bloquear: si a una persona que está respondiendo a un placebo se le da un fármaco que anula los opioides internos, el alivio desaparece. Es decir, había una reacción química real.",
              "QUÉ LO HACE MÁS FUERTE. Y aquí esta parte de la historia se da la mano con la del chamán, porque son exactamente los mismos ingredientes: el ritual —que haya un procedimiento, un tiempo, un gesto—, la seguridad de quien te atiende, la atención dedicada, una explicación que dé sentido a lo que te pasa, la expectativa y la esperanza. Un tratamiento administrado con calma y bien explicado funciona MEJOR que el mismo tratamiento dado con prisa y sin mirar a la cara. Eso está medido.",
              "LO CURIOSO. Funciona incluso cuando el paciente SABE que es un placebo, si se le explica el mecanismo: se llaman placebos abiertos y hay ensayos con buenos resultados en dolor crónico y en colon irritable. Y el envoltorio cuenta: las cápsulas grandes funcionan más que las pequeñas, las inyecciones más que las pastillas y las de marca más que un genérico idéntico.",
              "SUS LÍMITES, que son la parte importante. El placebo actúa sobre SÍNTOMAS —dolor, náuseas, fatiga, ansiedad, insomnio, malestar— y no sobre la enfermedad de fondo. No reduce un tumor, no baja el azúcar de un diabético, no cierra una fractura ni mata una bacteria. Puede hacer que alguien con asma diga que respira mejor mientras su función pulmonar medida sigue igual de mal: se siente mejor y está igual de enfermo. Y ahí está el peligro real, y es el argumento más importante de todo este recorrido: creer que basta con sentirse mejor puede llevar a alguien a abandonar el tratamiento que sí le hace falta.",
              "EL NOCEBO explica muchas cosas del día a día: leer la lista de efectos secundarios aumenta la probabilidad de notarlos, un comentario alarmista de un profesional puede empeorar un dolor y una explicación catastrofista puede cronificar una molestia. Por eso hoy se entrena a los médicos en cómo dar una noticia: las palabras son parte del tratamiento, y también pueden ser parte del daño.",
              "Y LA CONCLUSIÓN PRÁCTICA, que es la lección más antigua y más moderna a la vez: el efecto placebo no es un rival de la medicina, es un componente de TODA medicina. La pastilla correcta administrada por alguien que te escucha, te explica y te acompaña vale más que la misma pastilla dada sin mirarte. Los chamanes llevaban veinte mil años usándolo; la ciencia ha tardado en aprender a medirlo.",
            ],
            dato: "Dato curioso: los ensayos clínicos existen precisamente por esto. Como todo tratamiento arrastra su efecto placebo, la única manera de saber si un fármaco funciona de verdad es compararlo con un grupo que recibe una copia sin principio activo. El placebo es, a la vez, un fenómeno curativo y la herramienta que usamos para no engañarnos.",
          },
        ]),
      hito("chaman", "comunidad-vinculo", "La comunidad y el vínculo", "El sanador y el paciente",
        "",
        [
          "En los pueblos antiguos, el enfermo no se curaba solo en una habitación. Se curaba rodeado de su comunidad, que participaba en el ritual, lo acompañaba y lo sostenía.",
          "Ese apoyo tenía un efecto poderoso. Sentirse querido, acompañado y parte de un grupo reduce el estrés y refuerza la capacidad del cuerpo para recuperarse. La soledad, en cambio, enferma.",
          "Y en el centro estaba la relación entre el sanador y el paciente: una relación de confianza absoluta. El enfermo se entregaba a alguien que lo miraba, lo escuchaba y se ocupaba de él por entero.",
          "Miles de años después, los estudios confirman lo mismo: la calidad de la relación entre el médico y el paciente influye directamente en los resultados del tratamiento.",
        ]),
      hito("chaman", "chaman-aplicalo", "Aplícalo a tu vida", "",
        "",
        [
          "El chamán te enseña el poder de la mente.",
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
    subhitos: [
      hito("egipto", "imhotep", "Imhotep", "≈2650 a. C.",
        "",
        [
          "Imhotep fue arquitecto, sacerdote y médico al servicio del faraón. Diseñó una de las primeras pirámides, pero pasó a la historia sobre todo por su fama como sanador.",
          "Se le considera uno de los primeros médicos con nombre propio de la historia. Trataba enfermedades observando síntomas y aplicando remedios, mezclando saber práctico y religión.",
          "Su prestigio fue tan enorme que, siglos después de morir, los egipcios lo convirtieron en un dios de la medicina. Un ser humano elevado a divinidad por su capacidad de curar.",
          "Con Imhotep aparece una idea nueva: el médico como figura respetada, sabia y admirada por la sociedad.",
        ],
        "Dato curioso: los griegos, siglos después, identificaron a Imhotep con su propio dios de la medicina, Asclepio. Dos culturas coincidieron en divinizar el arte de curar."),
      hito("egipto", "papiros-medicos", "Los papiros médicos", "≈1600 a. C.",
        "",
        [
          "Los egipcios dejaron los primeros tratados médicos de la historia, escritos en papiro. En ellos describían enfermedades, síntomas y tratamientos con un orden sorprendente.",
          "El más famoso, el papiro Edwin Smith, describe casos de heridas y fracturas uno por uno: qué se observa, qué diagnóstico corresponde y si tiene tratamiento, o si es mejor no intervenir.",
          "Por primera vez, el conocimiento médico deja de depender de la memoria de un solo sanador y se convierte en algo que se puede guardar, copiar, enseñar y corregir.",
          "Escribir la medicina fue tan importante como practicarla: permitió que cada generación empezara donde lo dejó la anterior, en lugar de partir de cero.",
        ],
        "Dato curioso: en algunos casos, el papiro Edwin Smith concluye con una frase asombrosamente moderna: «una dolencia que no se debe tratar». Es decir, ya reconocían los límites de la medicina y la honestidad de no dañar."),
      hito("egipto", "higiene-dieta", "Higiene y dieta", "El cuidado cotidiano",
        "",
        [
          "Los egipcios daban una importancia enorme a la limpieza. Se lavaban con frecuencia, cuidaban el agua, prestaban atención a los alimentos y observaban el cuerpo con detalle.",
          "Entendían, de forma intuitiva, que muchas enfermedades tenían que ver con la vida diaria: lo que se come, lo que se bebe, la limpieza, el descanso.",
          "Este cuidado cotidiano —lo que hoy llamaríamos prevención— es una de sus grandes lecciones. No esperaban a estar enfermos: intentaban no enfermar.",
          "Fue uno de los primeros pueblos en comprender que la salud se construye cada día, y no solo se repara cuando se ha roto.",
        ]),
      hito("egipto", "especializacion", "Los primeros especialistas", "Médicos por órganos",
        "",
        [
          "Egipto llegó a tener médicos especializados. Había quienes se ocupaban de los ojos, otros del vientre, otros de los dientes.",
          "El historiador griego Heródoto, al visitar Egipto, quedó impresionado: contaba que cada médico se dedicaba a una sola enfermedad, de modo que el país estaba «lleno de médicos».",
          "Esta especialización, hace más de tres mil años, anticipa la forma en que funciona la medicina hoy, con oftalmólogos, cardiólogos o dentistas.",
          "Reconocieron algo profundo: el cuerpo humano es tan complejo que conviene mirarlo por partes... aunque, como veremos, algún día habrá que volver a mirarlo entero.",
        ]),
      hito("egipto", "egipto-aplicalo", "Aplícalo a tu vida", "",
        "",
        [
          "Egipto te enseña el poder de la observación.",
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
    subhitos: [
      hito("india", "charaka", "Charaka", "≈siglo II a. C.",
        "",
        [
          "Charaka es una de las grandes figuras del Ayurveda. Su tratado, el Charaka Samhita, es uno de los textos médicos más importantes de la antigua India.",
          "Puso el acento en la prevención, la dieta, el estilo de vida y el equilibrio. Para él, un buen médico no era solo el que curaba, sino el que ayudaba a no enfermar.",
          "Describió cientos de enfermedades, plantas medicinales y tratamientos, con una visión del cuerpo como un sistema en constante búsqueda de equilibrio.",
          "También reflexionó sobre la ética del médico y sobre la importancia de la mente y las emociones en la salud, mucho antes de que Occidente lo hiciera.",
        ]),
      hito("india", "sushruta", "Sushruta", "≈siglo VI a. C.",
        "",
        [
          "Sushruta es considerado uno de los padres de la cirugía. Su tratado describe más de trescientas operaciones y decenas de instrumentos quirúrgicos.",
          "Realizaba intervenciones asombrosas para su época: extracción de cálculos, tratamiento de fracturas e incluso cirugía reconstructiva de la nariz, una técnica pionera de la que aún se habla en la historia de la medicina.",
          "Insistía en la práctica: los estudiantes aprendían a cortar y coser con frutas, verduras y modelos antes de tocar a un paciente.",
          "Su obra demuestra que la curación física —la medicina de las manos— alcanzó en la India un nivel extraordinario.",
        ],
        "Dato curioso: la técnica de reconstrucción de la nariz descrita por Sushruta inspiró, siglos después, a los cirujanos europeos. Se le considera un antecesor de la cirugía plástica."),
      hito("india", "doshas", "Los doshas y la constitución", "El corazón del Ayurveda",
        "",
        [
          "El Ayurveda parte de una idea genial: no todos somos iguales. Cada persona tiene una constitución propia, su prakriti, formada por la combinación de tres energías o doshas: Vata, Pitta y Kapha.",
          "Vata se relaciona con el movimiento; Pitta con la transformación y el fuego; Kapha con la estructura y la calma. Todos tenemos las tres, pero en proporciones distintas, y eso define nuestro cuerpo, nuestro carácter y nuestras tendencias a enfermar.",
          "La salud, según el Ayurveda, es mantener tu equilibrio particular. La enfermedad es cuando ese equilibrio se rompe.",
          "Por eso el tratamiento se personaliza: la comida, el ejercicio y el ritmo de vida que curan a una persona pueden desequilibrar a otra.",
        ],
        "Dato curioso: esta idea, tan antigua, se parece muchísimo a lo que hoy llamamos medicina personalizada, que busca adaptar el tratamiento a las características únicas de cada paciente."),
      hito("india", "cinco-elementos-yoga", "Cinco elementos y yoga", "Cuerpo, mente y entorno",
        "",
        [
          "El Ayurveda entiende que todo —el cuerpo y la naturaleza— está formado por cinco elementos: tierra, agua, fuego, aire y espacio. Los doshas nacen de la combinación de estos elementos.",
          "Esto conecta al ser humano con su entorno: las estaciones, los alimentos, el clima y los ritmos de la naturaleza influyen en nuestro equilibrio interior.",
          "Junto a la medicina, la India desarrolló el yoga: un sistema para cuidar el cuerpo y la mente a la vez mediante el movimiento, la respiración y la atención.",
          "Cuerpo, mente y entorno no eran mundos separados, sino un mismo tejido. Cuidar uno era cuidar los tres.",
        ]),
      hito("india", "india-aplicalo", "Aplícalo a tu vida", "",
        "",
        [
          "La India te enseña el poder del equilibrio.",
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
    subhitos: [
      hito("china", "huangdi-neijing", "El Huangdi Neijing", "≈siglo III-II a. C.",
        "",
        [
          "El Huangdi Neijing, o «Clásico interno del Emperador Amarillo», es el texto fundacional de la medicina tradicional china. Está escrito como un diálogo entre el emperador y su médico.",
          "En él se explican las grandes ideas de esta medicina: el Qi, el Yin-Yang, los cinco elementos y la circulación de la energía por el cuerpo.",
          "Lo notable es su enfoque: el mejor médico no es el que cura la enfermedad avanzada, sino el que la evita antes de que aparezca. Curar cuando ya está declarada, decía, es como cavar un pozo cuando ya tienes sed.",
          "Este libro guió la medicina china durante más de dos milenios y aún hoy se estudia.",
        ]),
      hito("china", "qi-yinyang", "El Qi y el Yin-Yang", "La energía y sus opuestos",
        "",
        [
          "Para la medicina china, todo lo vivo está animado por el Qi, una energía vital que circula por el cuerpo. Cuando el Qi fluye libre y en cantidad adecuada, hay salud; cuando se bloquea o se debilita, aparece la enfermedad.",
          "Ese flujo se rige por dos fuerzas opuestas y complementarias: el Yin y el Yang. El frío y el calor, el reposo y la actividad, lo oscuro y lo luminoso. Ninguna es buena ni mala; la salud está en su equilibrio.",
          "Enfermar era tener demasiado de una y poco de la otra. Curar era restaurar la proporción.",
          "Es una forma distinta de pensar el cuerpo: no como órganos aislados, sino como un equilibrio dinámico de fuerzas.",
        ],
        "Dato curioso: el famoso símbolo del Yin-Yang lleva un punto del color contrario en cada mitad. Significa que dentro de cada fuerza vive la semilla de su opuesto: nada es puro ni absoluto."),
      hito("china", "meridianos-acupuntura", "Meridianos y acupuntura", "La medicina de las agujas",
        "",
        [
          "La medicina china describió una red de canales llamados meridianos por los que circula el Qi. A lo largo de ellos existen puntos concretos donde se puede actuar sobre esa energía.",
          "La acupuntura consiste en insertar finísimas agujas en esos puntos para desbloquear, reforzar o reequilibrar el flujo. Junto a ella usaban plantas, masajes, dieta y ejercicios de respiración y movimiento.",
          "Aunque los meridianos no coinciden con lo que la anatomía occidental ve, la acupuntura produce efectos reales que hoy se estudian científicamente, sobre todo en el alivio del dolor.",
          "Fue una medicina extraordinariamente sofisticada, con miles de años de observación clínica detrás.",
        ],
        "Dato curioso: la acupuntura es hoy una de las medicinas tradicionales más extendidas del planeta y se practica, junto a la medicina moderna, en hospitales de todo el mundo."),
      hito("china", "cinco-elementos-chinos", "Los cinco elementos", "Todo está conectado",
        "",
        [
          "La medicina china organiza el mundo en cinco elementos: madera, fuego, tierra, metal y agua. Cada uno se asocia a un órgano, una estación, una emoción, un sabor y un color.",
          "Estos elementos no están aislados: se alimentan y se controlan unos a otros en un ciclo constante. Un desequilibrio en uno repercute en los demás.",
          "Así, una emoción sostenida —como la ira o el miedo— podía afectar a un órgano, y un órgano débil podía alterar el estado de ánimo. Cuerpo y emociones eran inseparables.",
          "Es una visión profundamente ecológica del ser humano: nada ocurre por separado, todo está en relación.",
        ]),
      hito("china", "china-aplicalo", "Aplícalo a tu vida", "",
        "",
        [
          "China te enseña que no todo es estructura: también existe el ritmo.",
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
    subhitos: [
      hito("grecia", "hipocrates", "Hipócrates", "≈460-370 a. C.",
        "",
        [
          "Hipócrates es considerado el padre de la medicina occidental. Su gran aportación fue radical: afirmar que las enfermedades tienen causas naturales, no sobrenaturales.",
          "Hasta entonces, incluso la epilepsia se llamaba «la enfermedad sagrada». Hipócrates dijo que no tenía nada de divino: era una enfermedad como cualquier otra, con causas en el cuerpo.",
          "Enseñó a observar al paciente con atención: sus síntomas, su evolución, su entorno. Y a confiar en la capacidad del propio cuerpo para curarse, ayudándolo con dieta, reposo y hábitos sanos.",
          "También situó al médico en el centro de una responsabilidad moral, resumida en un principio que sigue vivo: primero, no hacer daño.",
        ],
        "Dato curioso: el juramento hipocrático, que compromete al médico a actuar por el bien del paciente, sigue inspirando la ética médica más de dos mil años después."),
      hito("grecia", "cuatro-humores", "La teoría de los cuatro humores", "El modelo que duró siglos",
        "",
        [
          "Los griegos pensaban que el cuerpo contenía cuatro humores o líquidos: sangre, flema, bilis amarilla y bilis negra. La salud era su equilibrio; la enfermedad, su desajuste.",
          "Cada humor se asociaba a un elemento, una estación y un temperamento. De ahí vienen palabras que aún usamos: sanguíneo, flemático, colérico, melancólico.",
          "El tratamiento buscaba reequilibrar los humores mediante la dieta, el ejercicio o, a veces, prácticas como las sangrías.",
          "La teoría era incorrecta, pero tenía una virtud enorme: buscaba una explicación natural y un equilibrio interno, no la voluntad de los dioses. Dominaría la medicina occidental durante casi dos mil años.",
        ],
        [
          {
            titulo: "Por qué una teoría falsa duró dos mil años",
            cuerpo: [
              "Esta es una de las preguntas más útiles de todo el recorrido, porque no habla solo del pasado: habla de cómo nos equivocamos.",
              "PRIMERO, porque explicaba TODO. Cualquier síntoma se podía interpretar como exceso o defecto de alguno de los cuatro humores, y cualquier evolución del paciente confirmaba el diagnóstico. Una teoría que encaja con cualquier resultado posible parece muy potente y en realidad es el peor síntoma que puede tener una idea: no se puede comprobar y no se puede refutar.",
              "SEGUNDO, porque era coherente y elegante. Cuatro humores, cuatro elementos, cuatro estaciones, cuatro edades de la vida, cuatro temperamentos. Todo encajaba con todo, y esa belleza intelectual convence muchísimo. La historia de la ciencia está llena de teorías falsas y hermosas.",
              "TERCERO, por la autoridad. Galeno la sistematizó tan bien que durante siglos la medicina consistió en comentar a Galeno. Discutirlo no era un debate científico, era una falta de respeto, y quien lo intentaba se jugaba la carrera —eso es exactamente lo que le pasó a Vesalio y a Harvey siglos después—.",
              "CUARTO, y este es el punto clave: NADIE CONTABA. No existía la costumbre de comparar dos grupos de pacientes, uno tratado y otro no, y ver qué pasaba. Sin comparación y sin números, el médico solo tenía sus recuerdos, y la memoria es un instrumento tramposo: se recuerdan los casos que curaron y se explican los que murieron («estaba muy débil», «llegó tarde», «era su hora»). Con esa manera de mirar, cualquier tratamiento parece funcionar.",
              "Y AHORA LA PARTE CRUDA: LAS SANGRÍAS. De aquella teoría salió el tratamiento más practicado de la historia de la medicina occidental. Si la enfermedad era exceso de sangre, había que sacarla, y se hizo durante más de dos mil años, con lancetas o con sanguijuelas, para la fiebre, el dolor de cabeza, la neumonía, la locura, el embarazo complicado y casi cualquier cosa.",
              "En la mayoría de los casos era inútil, y en muchos, mortal, porque debilitaba precisamente a quien más necesitaba fuerzas. El caso más famoso es el de George Washington: en 1799, con una infección de garganta, sus médicos le extrajeron en unas horas alrededor de dos litros y medio de sangre. Murió esa misma noche.",
              "Y la lección que deja no es que aquellos médicos fueran tontos ni crueles: eran inteligentes, cuidadosos y estaban convencidos de estar ayudando. Fallaba el MÉTODO, no la intención. Por eso el capítulo siguiente de esta historia —el método científico y el ensayo comparado— es el más importante de todos: no aportó un remedio nuevo, aportó una forma de saber si un remedio sirve.",
              "Y una advertencia para hoy: la teoría de los humores también tenía su versión de las «terapias que funcionan porque llevan siglos usándose». La antigüedad de un tratamiento no dice nada de su eficacia; solo dice que la gente ha creído en él mucho tiempo.",
            ],
            dato: "Dato curioso: no todo era falso. De aquella tradición sobrevive intacto lo mejor: la idea de que la salud es un equilibrio dinámico, la importancia de la dieta, el sueño, el ejercicio y el ambiente, y la costumbre de observar al paciente entero. Hasta el vocabulario emocional que usamos —ser flemático, estar de mal humor, tener mala bilis, ser melancólico— viene de ahí.",
          },
        ]),
      hito("grecia", "observacion-clinica", "La observación clínica", "Mirar al enfermo, no solo la enfermedad",
        "",
        [
          "La escuela hipocrática desarrolló algo esencial: la observación clínica. Los médicos anotaban cuidadosamente cómo evolucionaba cada paciente día a día.",
          "Aprendieron a reconocer los signos de una enfermedad, a prever su curso y a distinguir los casos graves de los leves. Este seguimiento atento es la base de la medicina hasta hoy.",
          "Comprendieron también el poder de la naturaleza sanadora del cuerpo: muchas veces, la mejor medicina era ayudar al organismo a recuperarse por sí mismo, sin estorbarlo.",
          "El médico dejó de ser un mago para convertirse en un observador paciente y honesto de la realidad.",
        ]),
      hito("grecia", "herofilo-erasistrato", "Herófilo y Erasístrato", "≈siglo III a. C.",
        "",
        [
          "En la ciudad de Alejandría, en el Egipto griego, ocurrió algo excepcional: durante un tiempo se permitió estudiar el cuerpo humano por dentro. Allí trabajaron Herófilo y Erasístrato, los grandes anatomistas de la Antigüedad.",
          "Herófilo estudió el cerebro y lo señaló —y no el corazón— como centro del pensamiento y de los nervios. Distinguió los nervios de los tendones y describió el ojo, el hígado y el aparato digestivo con un detalle nunca visto.",
          "Erasístrato investigó el corazón y los vasos sanguíneos, y se acercó muchísimo a comprender cómo circulaba la sangre, casi dos mil años antes de que se demostrara del todo.",
          "Fueron la cima de la anatomía antigua. Después, diseccionar cuerpos humanos volvió a prohibirse durante siglos, y aquel conocimiento tan valioso quedó casi congelado hasta el Renacimiento.",
        ],
        "Dato curioso: la famosa Biblioteca de Alejandría no solo guardaba libros: a su alrededor floreció una comunidad de sabios que convirtió la ciudad en el mayor centro científico del mundo antiguo."),
      hito("grecia", "grecia-aplicalo", "Aplícalo a tu vida", "",
        "",
        [
          "Grecia te enseña el poder de la razón.",
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
    subhitos: [
      hito("galeno-roma", "galeno", "Galeno", "≈129-216 d. C.",
        "",
        [
          "Galeno fue médico de gladiadores y de emperadores. Curando las heridas de la arena aprendió muchísimo sobre el cuerpo humano, y dedicó su vida a estudiarlo y a escribir sobre él.",
          "Reunió y ordenó todo el saber médico de su tiempo en un sistema gigantesco que abarcaba anatomía, fisiología y tratamiento. Fue un trabajo monumental.",
          "Estudió el movimiento, los nervios, la función de muchos órganos, y demostró con experimentos, por ejemplo, que las arterias llevan sangre y no aire, como se creía.",
          "Su autoridad fue tan aplastante que durante siglos cuestionarlo se consideraba casi una herejía.",
        ]),
      hito("galeno-roma", "anatomia-organos", "Anatomía y función de los órganos", "Entender la máquina",
        "",
        [
          "Galeno quería saber cómo funcionan los órganos, no solo cómo son. Se preguntaba para qué sirve cada pieza del cuerpo, un enfoque muy moderno.",
          "Pero tenía un problema enorme: en su época estaba prohibido diseccionar cadáveres humanos. Así que estudió sobre todo animales —monos y cerdos— y trasladó sus conclusiones al ser humano.",
          "Eso le llevó a aciertos notables, pero también a errores importantes, porque el cuerpo humano no es idéntico al de un animal.",
          "Aun así, su idea de estudiar la función de cada órgano marcó el camino de toda la fisiología posterior.",
        ]),
      hito("galeno-roma", "roma-salud-publica", "Roma y la salud pública", "Curar a un pueblo entero",
        "",
        [
          "Roma no destacó tanto por sus teorías como por su enorme capacidad práctica. Construyó acueductos para llevar agua limpia, alcantarillas para retirar los residuos y baños públicos por todas partes.",
          "Estas obras salvaron más vidas que muchos tratamientos, porque prevenían enfermedades a gran escala. Fue una forma temprana de salud pública.",
          "Los romanos crearon también hospitales militares para atender a sus soldados, precursores de los hospitales que conocemos hoy.",
          "Entendieron algo que a veces olvidamos: la salud de una persona depende en gran medida de las condiciones en las que vive.",
        ],
        "Dato curioso: se calcula que el agua limpia de los acueductos y el saneamiento romano hicieron más por la salud de la población que todos los remedios de la época juntos."),
      hito("galeno-roma", "error-1500-anios", "El error que duró 1500 años", "",
        "",
        [
          "Incluso los genios pueden equivocarse durante siglos.",
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
    subhitos: [
      hito("islam", "avicena", "Avicena", "980-1037",
        "",
        [
          "Avicena (Ibn Sina) fue médico, científico y filósofo, uno de los mayores genios de la historia. Escribió el Canon de Medicina, una obra enorme que reunía y ordenaba todo el saber médico de su tiempo.",
          "El Canon era tan claro y completo que se convirtió en el libro de texto de las universidades, tanto islámicas como europeas, durante más de seiscientos años.",
          "En él describió cientos de enfermedades y tratamientos, insistió en la observación clínica y comprendió la importancia de la dieta, el ejercicio y las emociones en la salud.",
          "Intuyó incluso que algunas enfermedades podían transmitirse a través del agua o el aire, adelantándose siglos a la idea del contagio.",
        ],
        "Dato curioso: el Canon de Avicena se siguió usando en algunas facultades de medicina europeas hasta el siglo XVII. Pocos libros han enseñado a tantas generaciones de médicos."),
      hito("islam", "rhazes", "Rhazes", "≈865-925",
        "",
        [
          "Rhazes (Al-Razi) fue un médico brillante y muy observador. Su mayor mérito fue describir con precisión enfermedades que hasta entonces se confundían.",
          "Fue el primero en distinguir claramente la viruela del sarampión, describiendo sus síntomas con un detalle asombroso. Ese tipo de observación cuidadosa es la base del diagnóstico.",
          "Defendía que el médico debía basarse en la experiencia y en los hechos, no solo en la autoridad de los libros antiguos. Si la observación contradecía a un maestro, había que fiarse de la observación.",
          "También escribió sobre la importancia de la relación con el paciente y de no perder nunca la esperanza en la curación.",
        ]),
      hito("islam", "abulcasis", "Abulcasis", "936-1013",
        "",
        [
          "Abulcasis (Al-Zahrawi) vivió en Córdoba y está considerado el mayor cirujano del mundo medieval. Dedicó su vida a convertir la cirugía en una disciplina seria, cuidadosa y que se pudiera enseñar.",
          "Escribió una enorme enciclopedia médica cuya última parte, dedicada a la cirugía, incluía dibujos de más de doscientos instrumentos quirúrgicos, muchos inventados o mejorados por él. Fue el primer tratado ilustrado de cirugía de la historia.",
          "Describió cómo cauterizar heridas, extraer cálculos, tratar fracturas y coser con suturas, e insistía en conocer bien la anatomía y en tratar al paciente con delicadeza.",
          "Su obra se tradujo al latín y se estudió en las universidades europeas durante más de quinientos años, convirtiéndolo en el gran maestro de la cirugía occidental.",
        ],
        "Dato curioso: algunos de los instrumentos que dibujó Abulcasis hace más de mil años —pinzas, bisturís, fórceps— se parecen asombrosamente a los que se siguen usando hoy en los quirófanos."),
      hito("islam", "maimonides", "Maimónides", "1138-1204",
        "",
        [
          "Maimónides nació en Córdoba, en plena edad de oro de Al-Ándalus. Filósofo, médico y sabio judío, tuvo que huir de la persecución y acabó ejerciendo como médico en la corte de Egipto, al servicio del entorno del sultán Saladino.",
          "Escribió varios tratados médicos que se estudiaron durante siglos. En ellos insistía, mucho antes que casi nadie, en la prevención: la dieta moderada, el ejercicio, el descanso y el equilibrio como base de la salud.",
          "Comprendió también que el cuerpo y la mente son inseparables. Aconsejaba cuidar el ánimo del enfermo, evitar las pasiones excesivas y buscar la serenidad, porque las emociones influyen directamente en la salud del cuerpo.",
          "Unía así la mejor ciencia de su tiempo con una profunda humanidad y una ética exigente hacia el enfermo. Es una de las pocas figuras admiradas a la vez por médicos, filósofos y creyentes de tres religiones.",
        ],
        "Dato curioso: se atribuye a Maimónides una «oración del médico» que pide humildad, prudencia y amor al enfermo. Aunque quizá no la escribiera él, resume a la perfección el espíritu de su medicina."),
      hito("islam", "averroes", "Averroes", "1126-1198",
        "",
        [
          "Averroes (Ibn Rushd) nació en Córdoba, la misma ciudad que Maimónides, durante el esplendor de Al-Ándalus. Hoy se le recuerda sobre todo como filósofo —el gran comentarista de Aristóteles—, pero también fue un médico destacado.",
          "Escribió un tratado médico general, el Kulliyat («Generalidades»), que intentaba ordenar toda la medicina de su tiempo en un sistema claro y razonado, y que se tradujo y estudió en Europa durante siglos.",
          "Defendía que la medicina y la filosofía se necesitaban mutuamente: entender el cuerpo exigía entender la naturaleza, y curar bien exigía razonar bien. Para él, observar y pensar eran inseparables.",
          "Su enorme influencia intelectual ayudó a que el saber griego, cuidadosamente comentado, regresara a las universidades europeas y reavivara la curiosidad por el cuerpo humano.",
        ],
        "Dato curioso: en la Europa medieval a Averroes se le llamaba simplemente «el Comentador», por la calidad de sus explicaciones de Aristóteles. Su medicina viajó pegada a su filosofía."),
      hito("islam", "hospitales", "Los primeros hospitales", "El bimaristán",
        "",
        [
          "El mundo islámico creó los bimaristanes, hospitales avanzados que atendían a los enfermos con independencia de su religión, su origen o su dinero.",
          "Eran instituciones sorprendentemente modernas: tenían salas separadas por enfermedades, médicos de guardia, farmacia, biblioteca y espacios para enseñar a los futuros médicos.",
          "Algunos incluían salas dedicadas a la salud mental, tratando a los enfermos con dignidad en una época en que en otros lugares se los abandonaba.",
          "Fue el nacimiento del hospital tal como lo entendemos hoy: un lugar de cuidado, enseñanza e investigación a la vez.",
        ],
        "Dato curioso: en algunos bimaristanes, cuando un paciente se curaba y no tenía recursos, se le entregaba una cantidad de dinero para que pudiera recuperarse sin necesidad de volver a trabajar de inmediato."),
      hito("islam", "metodo-humanismo", "Método clínico y humanismo", "El médico trata personas",
        "",
        [
          "Los médicos islámicos desarrollaron un método clínico riguroso: observar los síntomas, interrogar al paciente, seguir la evolución y registrar los resultados. Muchos llevaban historias clínicas de sus casos.",
          "Pero, junto al rigor, cultivaron una profunda humanidad. Insistían en tratar al enfermo con compasión, escuchándolo y respetándolo como persona.",
          "Entendieron que el estado de ánimo, la confianza y el trato influyen en la curación, uniendo así la razón griega con el cuidado del ser humano completo.",
          "De ellos nos llega una de las lecciones más valiosas de toda la historia de la medicina: nunca se trata una enfermedad en abstracto, siempre se trata a una persona concreta.",
        ]),
      hito("islam", "islam-aplicalo", "Aplícalo a tu vida", "",
        "",
        [
          "El islam te enseña el poder de la compasión clínica.",
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
    subhitos: [
      hito("renacimiento", "paracelso", "Paracelso", "1493-1541",
        "",
        [
          "Paracelso fue un médico rebelde e inconformista. Llegó a quemar en público los libros de Galeno y de Avicena para dejar claro que la medicina no podía seguir viviendo solo de repetir a los antiguos.",
          "Defendía aprender de la observación directa, de la naturaleza y de la experiencia con los enfermos. Viajó sin descanso recogiendo saberes de médicos, cirujanos e incluso curanderos populares.",
          "Fue pionero en usar sustancias químicas y minerales como remedios, abriendo el camino de la farmacología moderna. Todavía mezclaba ciencia, alquimia y misticismo, pero empujó a la medicina hacia lo experimental.",
          "Su idea más famosa sigue siendo la base de la farmacología: cualquier sustancia puede curar o envenenar según la cantidad.",
        ],
        "Dato curioso: la frase de Paracelso «la dosis hace el veneno» significa que hasta el agua puede ser dañina en exceso, y que hasta un veneno puede ser medicina en su dosis justa."),
      hito("renacimiento", "vesalio", "Vesalio", "1514-1564",
        "",
        [
          "Andrés Vesalio hizo algo que casi nadie se había atrevido a hacer: diseccionar cuerpos humanos con sus propias manos y dibujar lo que realmente veía.",
          "Descubrió que Galeno se había equivocado en muchos puntos, porque había estudiado animales. Vesalio corrigió esos errores basándose en la observación directa del cuerpo humano.",
          "En 1543 publicó un tratado de anatomía con ilustraciones extraordinariamente precisas y bellas, que revolucionó el estudio del cuerpo.",
          "Su mensaje era claro: hay que fiarse de lo que se observa, aunque contradiga a las mayores autoridades del pasado.",
        ],
        "Dato curioso: la obra de Vesalio se publicó el mismo año que la de Copérnico sobre el movimiento de la Tierra. 1543 suele considerarse el año en que empezó la revolución científica."),
      hito("renacimiento", "harvey", "William Harvey", "1578-1657",
        "",
        [
          "Se creía, siguiendo a Galeno, que el hígado fabricaba sangre continuamente y que esta se consumía en el cuerpo. Harvey demostró que eso era imposible.",
          "Midió cuánta sangre bombea el corazón y calculó que, si se consumiera, el cuerpo tendría que producir cantidades imposibles cada hora. La única explicación era que la misma sangre circulaba una y otra vez.",
          "Descubrió así la circulación de la sangre: el corazón es una bomba que impulsa la sangre por un circuito cerrado a través de las arterias y las venas.",
          "Fue un triunfo del método científico: observar, medir, razonar y demostrar, en lugar de repetir lo que decían los antiguos.",
        ]),
      hito("renacimiento", "hooke-microscopio", "Hooke y el microscopio", "1665",
        "",
        [
          "El microscopio abrió un mundo completamente nuevo. Robert Hooke lo apuntó hacia un trozo de corcho y vio que estaba formado por pequeñas cavidades, a las que llamó células.",
          "Era la primera vez que alguien veía la unidad básica de la vida, aunque todavía no comprendía del todo su importancia.",
          "El instrumento demostró que la realidad era mucho más rica y compleja de lo que los sentidos podían captar por sí solos.",
          "La medicina empezó a intuir que los grandes secretos del cuerpo estaban en lo muy pequeño, en un mundo invisible que faltaba por explorar.",
        ]),
      hito("renacimiento", "leeuwenhoek", "Leeuwenhoek", "1632-1723",
        "",
        [
          "Antonie van Leeuwenhoek fabricaba lentes de una calidad asombrosa. Con ellas observó una gota de agua y quedó atónito: estaba llena de diminutos seres que se movían.",
          "Los llamó «animálculos». Había descubierto los microorganismos: bacterias y otros seres invisibles que viven por todas partes, incluso dentro de nosotros.",
          "En aquel momento nadie imaginaba que aquellos seres minúsculos podían causar enfermedades. Ese vínculo tardaría casi dos siglos en establecerse.",
          "Pero el descubrimiento fue una semilla decisiva: por primera vez, la humanidad veía a los futuros protagonistas de una de las mayores revoluciones de la medicina.",
        ],
        "Dato curioso: Leeuwenhoek no era médico ni científico de profesión, sino comerciante de telas. Su pasión por las lentes lo convirtió, sin proponérselo, en el descubridor del mundo microscópico."),
      hito("renacimiento", "renacimiento-aplicalo", "Aplícalo a tu vida", "",
        "",
        [
          "El Renacimiento te enseña a pasar de creer a mirar.",
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
    subhitos: [
      hito("revolucion-cientifica", "bacon", "Francis Bacon", "1561-1626",
        "",
        [
          "Francis Bacon criticaba a quienes construían grandes teorías sin observar la realidad. Para él, el conocimiento verdadero debía nacer de la experiencia y del experimento.",
          "Propuso reunir muchos datos, compararlos y extraer de ellos conclusiones generales, comprobándolas una y otra vez. Es lo que hoy llamamos método inductivo.",
          "Insistió en algo esencial: hay que desconfiar de nuestras propias ideas preconcebidas, porque tendemos a ver lo que queremos ver.",
          "Su forma de pensar sentó las bases de la ciencia experimental, incluida la medicina que aprende observando y probando.",
        ]),
      hito("revolucion-cientifica", "descartes", "René Descartes", "1596-1650",
        "",
        [
          "Descartes buscaba una base absolutamente segura para el conocimiento. Decidió dudar de todo lo que pudiera ser falso, hasta encontrar algo indudable.",
          "Llegó a una certeza: aunque dude de todo, no puedo dudar de que estoy pensando. «Pienso, luego existo».",
          "Aplicó a la ciencia una idea influyente: entender el cuerpo como una especie de máquina que funciona según leyes que se pueden estudiar y comprender.",
          "Esta visión ayudó enormemente a estudiar el cuerpo con método, aunque, como veremos, tenía un riesgo: olvidar que el ser humano es mucho más que una máquina.",
        ],
        "Dato curioso: la idea del cuerpo como máquina impulsó la medicina científica, pero también separó durante siglos el cuerpo de la mente, una división que la medicina de hoy intenta volver a unir."),
      hito("revolucion-cientifica", "metodo-cientifico", "El método científico", "La gran herramienta",
        "",
        [
          "La gran conquista de esta época fue el método científico: una forma ordenada de buscar la verdad. Se observa un fenómeno, se plantea una hipótesis, se diseña un experimento y se comprueba el resultado.",
          "Lo esencial es que cualquiera puede repetir el experimento y comprobar si obtiene lo mismo. La verdad deja de depender de la autoridad de una persona y pasa a depender de las pruebas.",
          "Para la medicina, esto fue revolucionario. Por fin habría una manera de saber si un tratamiento cura de verdad o si solo parece hacerlo por casualidad o por sugestión.",
          "Sobre este método se construiría, con el tiempo, la medicina basada en la evidencia que salva millones de vidas hoy.",
        ],
        [
          {
            titulo: "El ensayo clínico: el invento que separa lo que cura de lo que no",
            cuerpo: [
              "Este es probablemente el invento más importante de la historia de la medicina, y no es un aparato ni un fármaco: es una forma de comparar.",
              "EL PRIMERO. En 1747, el médico naval escocés James Lind se enfrentaba al escorbuto, que mataba a más marineros que los combates y las tormentas juntos. Cogió a doce enfermos en condiciones parecidas, los repartió en seis parejas y a cada pareja le dio un tratamiento distinto: sidra, vinagre, agua de mar, un elixir, una pasta de especias… y a dos de ellos, naranjas y limones. Los de los cítricos se recuperaron en menos de una semana. Fue uno de los primeros ensayos comparados de la historia, con grupos, con las mismas condiciones y con resultado medido.",
              "Y ojo con lo que pasó después, porque es muy instructivo: la Marina británica tardó unos cuarenta años en aplicarlo de forma sistemática. Tener la prueba no basta; hay que convencer a una institución.",
              "CÓMO SE HACE HOY, y merece conocerlo porque es lo que hay detrás de cada medicamento que te tomas:",
              "1. DOS GRUPOS. Uno recibe el tratamiento y otro recibe un placebo o el mejor tratamiento disponible. Sin grupo de comparación no se sabe nada, porque muchísimas dolencias mejoran solas y porque el simple hecho de ser atendido mejora los síntomas.",
              "2. AL AZAR. Se decide por sorteo quién va a cada grupo. Esto es más importante de lo que parece: si eligiera el médico, tendería —sin querer— a poner en el grupo del tratamiento nuevo a los pacientes con mejor pronóstico. El azar reparte por igual todo lo que no sabemos.",
              "3. A CIEGAS. El paciente no sabe qué le han dado, y en el doble ciego tampoco lo sabe quien lo evalúa. Porque las expectativas cambian lo que se siente y también lo que se observa: un médico convencido interpreta con más optimismo la mejoría de su paciente.",
              "4. SUFICIENTES PERSONAS. Con diez pacientes cualquier resultado puede ser casualidad; hacen falta cientos o miles para distinguir un efecto real de una coincidencia. De eso se ocupa la estadística.",
              "5. PUBLICAR TODO, incluidos los resultados malos, y decir ANTES de empezar qué se va a medir, para no poder cambiar de objetivo cuando los números no salen como se esperaba.",
              "EL SALTO FINAL fue en los años setenta y noventa, con lo que se llamó medicina basada en la evidencia: en lugar de fiarse de la experiencia personal de cada médico, reunir TODOS los ensayos hechos sobre una pregunta, valorar su calidad y sacar una conclusión conjunta. Así se descubrió que tratamientos usados durante décadas no servían de nada, y que otros muy baratos salvaban muchas vidas.",
              "Y ES LA HERRAMIENTA QUE PUEDES USAR TÚ. Ante cualquier tratamiento, terapia o suplemento, hay tres preguntas que lo aclaran casi todo: ¿se ha comparado con un grupo que no lo tomaba? ¿lo han comprobado personas independientes de quien lo vende? ¿y qué resultado concreto haría que quien me lo recomienda admitiera que no funciona? Si no hay respuesta para ninguna, no estás ante una prueba: estás ante una creencia.",
            ],
            dato: "Dato curioso: el mayor problema actual no es la falta de ensayos, es el sesgo de publicación. Durante años, los estudios con resultados positivos se publicaban mucho más que los negativos, así que un fármaco podía parecer eficaz solo porque los ensayos fallidos se quedaban en un cajón. Hoy es obligatorio registrar los ensayos antes de empezar, precisamente para que no puedan desaparecer.",
          },
        ]),
      hito("revolucion-cientifica", "sesgos", "Los sesgos: cómo nos engañamos", "El enemigo invisible",
        "",
        [
          "Los pensadores de esta época descubrieron un problema incómodo: nuestra mente nos engaña constantemente. Vemos patrones que no existen, recordamos los aciertos y olvidamos los fallos, y creemos con facilidad lo que deseamos creer.",
          "Estos errores del pensamiento se llaman sesgos. Por su culpa, durante siglos se creyó que remedios completamente inútiles funcionaban: la gente sanaba sola y se lo atribuía al remedio.",
          "El método científico nació, en parte, para protegernos de nosotros mismos, obligándonos a comprobar en lugar de suponer.",
          "Reconocer que podemos equivocarnos fue, paradójicamente, uno de los mayores avances de la inteligencia humana.",
        ],
        "Dato curioso: por eso hoy los mejores estudios médicos se hacen «a doble ciego»: ni el paciente ni el médico saben quién recibe el tratamiento real y quién uno falso, para que las expectativas no distorsionen el resultado."),
      hito("revolucion-cientifica", "revolucion-aplicalo", "Aplícalo a tu vida", "",
        "",
        [
          "La revolución científica te enseña a no engañarte.",
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
    subhitos: [
      hito("microbios", "jenner", "Edward Jenner", "1749-1823",
        "",
        [
          "En el siglo XVIII, la viruela mataba y desfiguraba a millones de personas. Jenner observó algo curioso: las ordeñadoras que habían pasado la viruela de las vacas, mucho más leve, no enfermaban de la viruela humana.",
          "Se atrevió a probar una idea audaz: inoculó a un niño con material de la viruela vacuna y, después, comprobó que quedaba protegido frente a la viruela humana.",
          "Había inventado la vacuna, la primera forma de entrenar al cuerpo para defenderse de una enfermedad antes de sufrirla.",
          "Fue el comienzo de una de las herramientas más poderosas de la historia de la medicina.",
        ],
        "Dato curioso: la palabra «vacuna» viene precisamente de «vaca», en recuerdo de aquella viruela vacuna. Gracias a la vacunación, la viruela es hoy la única enfermedad humana totalmente erradicada del planeta.",
        [
          {
            titulo: "Cómo funciona una vacuna, y cómo se borró una enfermedad",
            cuerpo: [
              "CÓMO FUNCIONA. Tu sistema inmunitario aprende. Cuando entra un microbio, tarda días en identificarlo y en fabricar las defensas adecuadas, y en ese tiempo la enfermedad puede haberte hecho un daño enorme. Una vacuna le da los deberes hechos: le enseña un trozo del microbio, o una versión debilitada, o solo sus instrucciones, para que fabrique las defensas y —esto es lo importante— guarde la memoria. Si algún día llega el microbio de verdad, la respuesta que antes tardaba diez días tarda horas.",
              "LO QUE NO ES. No es «meterte la enfermedad». No sustituye a tus defensas: las entrena. Y no protege solo a quien se la pone.",
              "LA INMUNIDAD DE GRUPO. Un microbio necesita encontrar personas susceptibles para seguir circulando. Cuando una proporción alta de la población está vacunada, las cadenas de contagio se rompen y quedan protegidos también los que no pueden vacunarse: los bebés demasiado pequeños, las personas con el sistema inmunitario dañado, quien está en tratamiento oncológico. Por eso vacunarse es a la vez una decisión personal y una contribución a los demás.",
              "CÓMO SE BORRÓ LA VIRUELA. Es la mejor campaña sanitaria de la historia y merece contarse. La viruela mataba a alrededor de un tercio de los infectados, dejaba ciegos y marcados a muchos de los supervivientes y se calcula que en el siglo XX se llevó a unos 300 millones de personas: más que todas las guerras del siglo juntas.",
              "En 1967 la Organización Mundial de la Salud lanzó una campaña mundial, y la estrategia fue tan inteligente como el invento. Se dieron cuenta de que no hacía falta vacunar a todo el planeta: bastaba con detectar cada brote y vacunar en anillo a todos los contactos alrededor, cerrándole el paso al virus. Se recompensaba económicamente a quien informara de un caso, y equipos de vacunadores recorrieron aldeas de la India, Etiopía o Bangladés casa por casa.",
              "El último caso natural fue en Somalia en 1977, en un cocinero de hospital llamado Ali Maow Maalin, que sobrevivió. En 1980 se declaró erradicada. Es la única enfermedad humana que hemos hecho desaparecer del mundo, y el virus solo existe hoy en dos laboratorios de máxima seguridad.",
              "Y una advertencia que la propia historia enseña: cuando una vacuna funciona muy bien, la enfermedad desaparece de la vista, la gente deja de tenerle miedo y empieza a tenérselo a la vacuna. Es la paradoja del éxito, y explica los brotes de sarampión que reaparecen hoy en países donde ya estaba controlado.",
            ],
            dato: "Dato curioso: la idea no era nueva del todo. En China y en la India se practicaba desde siglos antes la variolización —inocular a propósito una dosis pequeña de viruela humana—, y en Europa la introdujo en 1721 Lady Mary Montagu, que la había visto en Estambul y la probó en sus propios hijos. Era eficaz y peligrosa; la aportación de Jenner fue encontrar una versión segura.",
          },
        ]),
      hito("microbios", "semmelweis", "Ignaz Semmelweis", "1818-1865",
        "",
        [
          "En el hospital general de Viena, hacia 1846, había dos salas de maternidad. En una atendían los médicos y los estudiantes de medicina; en la otra, las matronas. Y ocurría algo que todo el mundo sabía y nadie explicaba: en la sala de los médicos morían de fiebre puerperal alrededor del 10 % de las mujeres, y en algunos meses hasta el 18 %; en la de las matronas, en torno al 2 %.",
          "Semmelweis, un joven médico húngaro, se obsesionó con esa diferencia y fue descartando explicaciones una por una: el hacinamiento, el clima, la dieta, la postura del parto, hasta el miedo. Nada cuadraba.",
          "La pista se la dio una desgracia: un amigo suyo, un profesor de medicina legal, se cortó con un bisturí durante una autopsia y murió con exactamente los mismos síntomas que las parturientas. Y entonces lo vio: los médicos y los estudiantes venían de hacer autopsias, se limpiaban las manos con un trapo y entraban a examinar a las mujeres. Las matronas no hacían autopsias.",
          "Concluyó que las manos llevaban «partículas cadavéricas» —no sabía nada de bacterias, faltaban veinte años para Pasteur— e impuso una norma: lavarse las manos con una solución de cal clorada antes de cada exploración. La mortalidad de su sala cayó del 18 % a menos del 2 % en unos meses.",
          "Tenía los datos, tenía el resultado, y fue rechazado. Sus superiores se ofendieron: lo que estaba diciendo, en el fondo, era que los médicos mataban a sus pacientes con sus propias manos. Y en 1847 no había ninguna teoría que explicara POR QUÉ funcionaba, así que se descartó como una manía. No le renovaron el puesto, tuvo que volver a Hungría, publicó tarde y mal, y sus cartas se volvieron cada vez más furiosas y desesperadas.",
          "Acabó ingresado en un manicomio, donde murió a los 47 años a las dos semanas, por una infección provocada por los golpes de los vigilantes. Murió, con una ironía atroz, de lo mismo que había pasado la vida intentando evitar.",
        ],
        "Dato curioso: hoy se llama «reflejo Semmelweis» a la tendencia a rechazar automáticamente una prueba que contradice lo que uno cree o le obliga a cambiar de conducta. Y su medida es todavía, según la OMS, la intervención más eficaz y más barata para evitar infecciones en un hospital: lavarse las manos."),
      hito("microbios", "john-snow", "John Snow y el mapa del cólera", "1854",
        "",
        [
          "En el verano de 1854, un brote de cólera mató a más de 600 personas en pocas semanas en el barrio del Soho, en Londres. La explicación oficial era el «miasma»: un aire corrompido y maloliente que se creía responsable de las epidemias.",
          "John Snow, un médico y anestesista, sospechaba que la culpa era del AGUA, y no tenía forma de demostrarlo con un microscopio. Así que hizo algo nuevo: fue casa por casa, apuntó cada muerte y la dibujó en un plano del barrio.",
          "El mapa habló solo: las muertes se agrupaban alrededor de una fuente pública concreta, la bomba de Broad Street. Y las excepciones confirmaban la regla, que es la parte más elegante de su trabajo. Los trabajadores de una fábrica de cerveza cercana apenas enfermaron: bebían cerveza, no agua de la bomba. En un asilo con cientos de personas casi no hubo casos: tenía su propio pozo. Y hubo una mujer que murió en un barrio lejano, sin contacto con el Soho, y resultó que le gustaba el sabor de aquella agua y se la hacía traer.",
          "Con el mapa en la mano convenció a las autoridades de retirar la palanca de la bomba. El brote se apagó. Después se comprobó que un pozo negro con las deposiciones de un bebé enfermo filtraba a pocos metros del pozo de agua.",
          "Lo importante no es solo que acertara: es el MÉTODO. Snow inventó la epidemiología moderna, es decir, la ciencia de encontrar la causa de una enfermedad estudiando cómo se distribuye entre la población, con datos, mapas y comparaciones. Se puede actuar contra una epidemia antes de conocer al culpable.",
          "Y de ahí salió lo que probablemente ha salvado más vidas que ningún fármaco: la decisión de separar el agua potable de las aguas residuales. El alcantarillado y la potabilización han evitado más muertes que cualquier medicamento inventado después.",
        ],
        "Dato curioso: sus mapas de puntos son el antepasado directo de los mapas de contagios que todos miramos en 2020. Y en Londres, en el lugar de la bomba de Broad Street, hay hoy una réplica sin palanca, en recuerdo del día en que un médico paró una epidemia quitándole el mango a un grifo."),
      hito("microbios", "nightingale", "Florence Nightingale", "1820-1910",
        "",
        [
          "Florence Nightingale venía de una familia acomodada británica y se empeñó, contra la oposición de los suyos, en dedicarse a cuidar enfermos: en aquella época, la enfermería no era una profesión respetable, la ejercían mujeres sin formación y estaba mal pagada y peor considerada.",
          "En 1854 la enviaron con un grupo de enfermeras al hospital militar británico de Scutari, en la guerra de Crimea. Lo que encontró era una carnicería administrativa: soldados tumbados en el suelo entre ratas, sin agua limpia, sin letrinas que funcionaran, con las heridas vendadas con trapos reutilizados, mantas escasas y comida podrida. Morían muchísimos más soldados de tifus, cólera y disentería que de las heridas de combate.",
          "Hizo dos cosas. La primera, lo obvio y agotador: organizar. Limpieza, ventilación, lavandería, letrinas, cocina, agua, camas separadas, cuidados por turnos y presencia constante —de ahí el apodo con el que se hizo célebre, «la dama de la lámpara», por sus rondas nocturnas—. La mortalidad del hospital cayó de forma espectacular.",
          "La segunda es la que la convierte en una figura decisiva de la historia de la medicina: APUNTÓ TODO. Recogió cifras de ingresos, causas de muerte y fechas, y al volver a Londres las presentó al gobierno en unos gráficos que ella misma diseñó —los famosos «diagramas de área polar», que se siguen reproduciendo— para que cualquier político pudiera ver de un vistazo que la mayoría de las muertes eran evitables y de origen infeccioso.",
          "Y fundó en 1860 la primera escuela de enfermería moderna, con formación reglada, exámenes y ética profesional. Convirtió el cuidado en una profesión con conocimiento propio, no en una tarea doméstica improvisada.",
          "Su idea de fondo es la que atraviesa toda esta historia: el cuidado no es el adorno de la medicina, es una parte de la medicina. La limpieza, el descanso, la comida, el aire, la compañía y la atención son tratamiento.",
        ],
        "Dato curioso: fue la primera mujer admitida en la Royal Statistical Society. Pasó buena parte de sus últimas décadas enferma y postrada en su casa, y desde allí, escribiendo informes y cartas, siguió reformando la sanidad de un imperio."),
      hito("microbios", "pasteur", "Louis Pasteur", "1822-1895",
        "",
        [
          "Pasteur demostró que muchos procesos, como la fermentación y la descomposición, los causan microorganismos vivos, no algo que surge de la nada.",
          "De ahí dedujo la teoría germinal: los microbios son responsables de muchas enfermedades infecciosas. Un cambio de mentalidad radical.",
          "Descubrió que calentar los líquidos destruía esos microbios, una técnica que hoy lleva su nombre: la pasteurización, que aún protege la leche y otros alimentos.",
          "Desarrolló además nuevas vacunas, entre ellas la de la rabia, salvando vidas y confirmando el poder de esta idea.",
        ]),
      hito("microbios", "koch", "Robert Koch", "1843-1910",
        "",
        [
          "Koch convirtió la teoría germinal en ciencia precisa. Desarrolló métodos para aislar y cultivar bacterias e identificar exactamente cuál provoca cada enfermedad.",
          "Descubrió el microbio responsable de la tuberculosis, una de las mayores asesinas de la época, y también el del cólera.",
          "Estableció unas reglas claras para demostrar que un germen concreto es la causa de una enfermedad concreta, un método que aún se usa.",
          "Gracias a él, la medicina pudo empezar a poner nombre y apellido a sus enemigos invisibles.",
        ]),
      hito("microbios", "higiene-esterilizacion", "Higiene y esterilización", "Salvar vidas con jabón",
        "",
        [
          "Antes de conocer los microbios, los cirujanos operaban con las manos y los instrumentos sucios, y muchísimos pacientes morían de infección después de la operación.",
          "Cuando se entendió que los gérmenes causaban esas infecciones, todo cambió. Se empezó a lavar las manos, esterilizar el instrumental y desinfectar las heridas.",
          "El médico Ignaz Semmelweis ya había demostrado, incluso antes, que lavarse las manos reducía drásticamente las muertes de las madres en los partos, aunque en su momento no le creyeron.",
          "Estas medidas tan sencillas salvaron y siguen salvando incontables vidas. A veces, el mayor avance no es un aparato complejo, sino la limpieza.",
        ],
        "Dato curioso: Semmelweis fue rechazado y ridiculizado por sus colegas por defender el lavado de manos. Murió sin ser reconocido; hoy se le honra como un pionero que se adelantó a su tiempo."),
      hito("microbios", "microbios-aplicalo", "Aplícalo a tu vida", "",
        "",
        [
          "Los microbios te enseñan que la salud también depende de enemigos invisibles.",
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
    anio: "Siglos XIX-XX",
    subhitos: [
      hito("medicina-moderna", "anestesia", "La anestesia", "1846",
        "",
        [
          "Es la parte de la historia de la medicina que más cuesta leer, y hay que contarla para entender el resto. Hasta mediados del siglo XIX, toda cirugía se hacía con el paciente despierto.",
          "El único recurso era la velocidad. Los cirujanos famosos lo eran por rápidos: se cronometraban las amputaciones y algunos las hacían en menos de treinta segundos. Al paciente se le sujetaba con correas o entre varios hombres, se le daba alcohol, opio si había, un trozo de cuero para morder, y se operaba mientras gritaba. Muchos morían del propio shock, y bastantes preferían morir de la enfermedad antes que pasar por el quirófano.",
          "Eso limitaba la medicina entera: no se podía operar dentro del abdomen, ni del tórax, ni del cráneo, porque hacen falta tiempo y precisión, y ninguna de las dos cosas era posible con una persona consciente y aterrorizada.",
          "El 16 de octubre de 1846, en el Hospital General de Massachusetts, un dentista llamado William Morton administró éter a un paciente delante de una sala llena de médicos escépticos, y el cirujano le extirpó un tumor del cuello sin que se moviera ni gritara. Al terminar, el cirujano se volvió hacia el público y dijo: «señores, esto no es una farsa». La noticia recorrió el mundo en meses.",
          "En Escocia, el obstetra James Simpson probó el cloroformo y lo introdujo en los partos. Hubo resistencia moral: se argumentó que el dolor del parto era natural y hasta que estaba prescrito en la Biblia. La discusión se zanjó en 1853 de forma muy práctica, cuando la reina Victoria pidió cloroformo para el nacimiento de su octavo hijo. Si valía para la reina, valía para todas.",
          "La anestesia no curó ninguna enfermedad, y sin embargo cambió la medicina más que casi cualquier medicamento: hizo posible la cirugía moderna. Con anestesia y, poco después, con asepsia, se pudo por fin abrir un cuerpo con calma.",
        ],
        "Dato curioso: los anestesistas de hoy vigilan constantemente algo que nadie ve: la profundidad exacta de la inconsciencia, la respiración, la tensión y el dolor. Se dice que es la única especialidad en la que el éxito consiste en que el paciente no recuerde absolutamente nada de las horas más peligrosas de su vida."),
      hito("medicina-moderna", "rayos-x", "Los rayos X y ver por dentro", "1895",
        "",
        [
          "Durante toda la historia, el médico solo tuvo acceso a la superficie: mirar, escuchar, palpar, oler, preguntar. Lo que pasaba dentro de un cuerpo vivo era invisible, y la única forma de saberlo con certeza era abrirlo… o esperar la autopsia.",
          "En noviembre de 1895, el físico alemán Wilhelm Röntgen estaba experimentando con tubos de descarga y observó que una pantalla cercana brillaba aunque el tubo estuviera tapado con cartón negro. Había una radiación desconocida que atravesaba materiales opacos. La llamó «rayos X» precisamente porque no sabía lo que era.",
          "La primera radiografía de la historia fue la mano de su mujer, Anna Bertha, con su anillo de boda. Al ver sus propios huesos dijo: «he visto mi muerte».",
          "La difusión fue vertiginosa: en pocos meses se hacían radiografías en hospitales de todo el mundo, y en cuestión de un año ya se usaban para localizar balas y fracturas. Es probablemente la aplicación médica más rápida de un descubrimiento físico en la historia. Röntgen renunció a patentarlo para que estuviera al alcance de todos.",
          "Y a partir de ahí llegó todo lo demás: el electrocardiograma para ver el ritmo del corazón, el ecógrafo —que usa ultrasonidos, sin radiación, y permitió ver por primera vez a un bebé antes de nacer—, la tomografía computarizada, que reconstruye el cuerpo en cortes, y la resonancia magnética, que distingue los tejidos blandos sin usar radiación.",
          "El cambio de fondo es enorme: el diagnóstico deja de depender solo del ojo y la experiencia del médico y pasa a apoyarse en imágenes que se pueden guardar, comparar, medir y enseñar a otro. Y también trajo su propio riesgo, que se aprendió a golpes: los pioneros de la radiología sufrieron quemaduras, amputaciones y cánceres por exponerse sin protección, y hoy toda prueba con radiación se hace con la dosis mínima y solo cuando aporta algo.",
        ],
        "Dato curioso: durante los primeros años, los rayos X fueron una atracción de feria: había máquinas para ver los huesos de tu mano en ferias y espectáculos, e incluso zapaterías con aparatos para «comprobar» cómo encajaba el pie dentro del zapato. Estuvieron en las tiendas hasta los años cincuenta."),
      hito("medicina-moderna", "insulina", "La insulina y las hormonas", "1921-1922",
        "",
        [
          "Antes de 1922, un diagnóstico de diabetes tipo 1 en un niño era una sentencia de muerte a corto plazo. El único tratamiento era una dieta de hambre que alargaba unos meses la vida. Los hospitales tenían salas con niños en coma esperando morir.",
          "En Toronto, un cirujano joven llamado Frederick Banting, con un estudiante, Charles Best, y el apoyo del laboratorio de John Macleod y del bioquímico James Collip, consiguieron extraer del páncreas la sustancia que regula el azúcar en la sangre y purificarla lo suficiente para inyectarla.",
          "La escena de aquel primer ensayo es una de las más impresionantes de la medicina: entraron en una sala con niños en coma diabético, acompañados de sus familias, y fueron poniendo inyecciones uno por uno. Antes de terminar con el último, los primeros estaban despertando.",
          "Y hubo una decisión ética que merece recordarse: vendieron la patente a la Universidad de Toronto por un dólar simbólico, para que nadie pudiera especular con ella. Banting dijo que la insulina no le pertenecía, que pertenecía al mundo. Que hoy el precio de la insulina sea un escándalo en algunos países es una de las ironías más amargas de la historia de la medicina.",
          "Lo importante para esta historia es el CONCEPTO que se abrió: existen sustancias fabricadas en un órgano que viajan por la sangre y dan órdenes a otros órganos —las hormonas—, y si el cuerpo deja de producir una, se puede reponer desde fuera.",
          "De ahí salió media medicina del siglo XX: el tratamiento del hipotiroidismo con hormona tiroidea, la cortisona para la inflamación, las hormonas sexuales, la píldora anticonceptiva —que cambió la vida de las mujeres más que casi cualquier otro fármaco—, los tratamientos de fertilidad, la hormona del crecimiento y los fármacos actuales para la obesidad y la diabetes tipo 2.",
        ],
        "Dato curioso: la insulina fue también la primera proteína humana fabricada por ingeniería genética, en 1978: se metió el gen humano en una bacteria para que la produjera. Hasta entonces se extraía del páncreas de cerdos y vacas, y hacían falta toneladas de páncreas para tratar a un paciente durante un año."),
      hito("medicina-moderna", "fleming", "Alexander Fleming", "1881-1955",
        "",
        [
          "En 1928, Fleming dejó unas placas con bacterias sin cubrir antes de irse de vacaciones. Al volver, encontró que un moho había contaminado una de ellas y que, a su alrededor, las bacterias habían muerto.",
          "Aquel moho producía una sustancia que mataba bacterias: la penicilina, el primer antibiótico.",
          "Los antibióticos transformaron la medicina. Enfermedades que antes eran una sentencia de muerte —una neumonía, una herida infectada— se volvieron curables con unas pocas dosis.",
          "Se calcula que los antibióticos han salvado cientos de millones de vidas. Pocas veces la casualidad y la observación atenta han dado tanto a la humanidad.",
        ],
        "Dato curioso: hoy el uso excesivo de antibióticos está creando bacterias resistentes. Un recordatorio de que hasta los mayores triunfos de la medicina hay que usarlos con sabiduría.",
        [
          {
            titulo: "Lo que hay que saber sobre los antibióticos",
            cuerpo: [
              "PRIMERO: no fue solo Fleming. Él observó el fenómeno en 1928 y no consiguió aislar la sustancia en cantidad útil, así que el asunto quedó parado casi diez años. Lo rescataron en Oxford, ya en plena Segunda Guerra Mundial, Howard Florey, Ernst Chain y su equipo, que lograron purificarla y demostrar que curaba infecciones mortales. Y como Inglaterra estaba siendo bombardeada, la producción industrial se montó en Estados Unidos, a tiempo para el desembarco de Normandía. Es un ejemplo perfecto de que la medicina moderna la hacen equipos, no genios sueltos.",
              "SEGUNDO: qué cambió de verdad. Antes de los antibióticos, un arañazo infectado, una neumonía, una apendicitis, una infección de oído o una infección después de dar a luz podían matar a cualquiera, a cualquier edad y con buena salud. Y hay algo que casi nunca se dice: los antibióticos son los que hacen posible el resto de la medicina moderna. Sin poder controlar las infecciones no habría cirugía compleja, ni trasplantes, ni cuidados intensivos, ni quimioterapia, ni prótesis, ni partos seguros.",
              "TERCERO, y es lo importante ahora: LAS BACTERIAS EVOLUCIONAN. Cada vez que se usa un antibiótico, mueren las bacterias sensibles y sobreviven las que por azar resistían. Esas se multiplican y transmiten su resistencia, incluso entre especies distintas. No es que «el cuerpo se acostumbre»: es que la población de bacterias cambia. Es evolución por selección natural, ocurriendo en tiempo real y en tu propio organismo.",
              "Fleming lo advirtió en su discurso del Nobel en 1945, y su advertencia se ha cumplido: hoy se atribuyen a las bacterias resistentes más de un millón de muertes al año en el mundo, y hay infecciones para las que quedan muy pocas opciones. Y mientras tanto se han desarrollado pocos antibióticos verdaderamente nuevos, porque son un mal negocio: se toman diez días, se recomienda usarlos lo menos posible y se venden baratos.",
              "QUÉ SE PUEDE HACER, en concreto: no tomarlos para virus —una gripe, un catarro, la mayoría de los dolores de garganta y de las bronquitis son víricos y el antibiótico no hace absolutamente nada, salvo daño—; no dejar el tratamiento a medias por sentirse mejor; no reutilizar los que sobraron de otra vez; no darle a nadie los tuyos; y saber que el mayor consumo mundial de antibióticos no está en las personas, sino en la ganadería intensiva, donde se usan para engordar y prevenir en granjas hacinadas.",
              "Y una idea que enlaza con el resto de este recorrido: durante décadas se pensó en las bacterias solo como enemigas. Hoy sabemos que llevamos encima billones de microorganismos —la microbiota— que participan en la digestión, en el sistema inmunitario y probablemente en el estado de ánimo, y que un antibiótico también arrasa con ellos. La medicina ha pasado de querer esterilizar el cuerpo a intentar cuidar su ecosistema.",
            ],
            dato: "Dato curioso: cuando la penicilina era escasísima y carísima, en los hospitales militares se recuperaba de la orina de los pacientes tratados para volver a purificarla y reutilizarla. No se podía desperdiciar ni una gota.",
          },
        ]),
      hito("medicina-moderna", "cannon-homeostasis", "Cannon y la homeostasis", "El equilibrio interior",
        "",
        [
          "Walter Cannon describió una de las ideas más importantes de la fisiología: la homeostasis, la capacidad del cuerpo para mantener estable su medio interno.",
          "Aunque haga frío o calor, aunque comas o ayunes, aunque corras o descanses, tu temperatura, tu azúcar y tu equilibrio se mantienen dentro de unos límites gracias a ajustes constantes.",
          "La salud es, en buena medida, esa capacidad de volver siempre al equilibrio. Enfermar es cuando el cuerpo ya no logra recuperarlo.",
          "Curiosamente, esta idea moderna se parece mucho a lo que intuían el Ayurveda y la medicina china miles de años antes: la salud es equilibrio dinámico.",
        ]),
      hito("medicina-moderna", "osler-hospital", "Osler y el hospital moderno", "Aprender junto al enfermo",
        "",
        [
          "William Osler transformó la manera de formar a los médicos. Sacó a los estudiantes de las aulas y los llevó junto a la cama del paciente, donde debían observar, examinar y aprender de casos reales.",
          "Ayudó a organizar el hospital moderno: un lugar donde se atiende, se investiga y se enseña al mismo tiempo, con especialistas y trabajo en equipo.",
          "Insistía en que el médico no debía perder de vista a la persona detrás de la enfermedad, a pesar de todos los avances técnicos.",
          "Su famoso consejo resume toda una filosofía: es más importante saber qué clase de paciente tiene una enfermedad que qué clase de enfermedad tiene un paciente.",
        ]),
      hito("medicina-moderna", "especializacion-moderna", "La especialización", "Saber mucho de poco",
        "",
        [
          "La explosión de conocimiento del siglo XX obligó a los médicos a especializarse. Aparecieron cardiólogos, neurólogos, oncólogos, cirujanos de cada parte del cuerpo.",
          "Esta especialización permitió avances enormes: cada médico podía dominar en profundidad su campo y ofrecer tratamientos muy precisos.",
          "Pero trajo también un riesgo: mirar tanto una parte que se pierde de vista a la persona entera. El paciente podía convertirse en «un corazón», «un hígado» o «un caso».",
          "De esta tensión nacería la última gran pregunta de la medicina: cómo unir de nuevo todas las piezas para volver a ver al ser humano completo.",
        ]),
      hito("medicina-moderna", "adn-genetica", "El ADN y la genética", "1953-2003",
        "",
        [
          "En 1953, en Cambridge, se describió la estructura del ADN: dos hebras enrolladas en doble hélice, con cuatro letras químicas que se emparejan siempre igual. Esa forma explicaba de golpe dos misterios enormes: cómo se guarda la información de un ser vivo y cómo se copia cada vez que una célula se divide.",
          "El descubrimiento lo firmaron James Watson y Francis Crick, y aquí hay una deuda que hay que nombrar: la imagen que permitió resolver la estructura, la famosa «foto 51», la había obtenido Rosalind Franklin con difracción de rayos X, y se la mostraron sin su permiso. Ella murió de cáncer de ovario a los treinta y siete años, cuatro años antes del Nobel, y no pudo compartirlo.",
          "Lo que abrió esa doble hélice fue una manera nueva de entender la enfermedad. Hay dolencias causadas por un solo gen defectuoso —fibrosis quística, hemofilia, anemia falciforme, Huntington—, y por primera vez se pudo saber exactamente qué falla y en qué punto. Y hay muchísimas otras, las más frecuentes, en las que la genética solo pone una predisposición que se activa o no según cómo vivas: eso es lo que estudia la epigenética, y es una de las mejores noticias de la medicina actual, porque significa que heredar un riesgo no es heredar un destino.",
          "Y un hallazgo con consecuencias sociales enormes: dos personas cualesquiera del planeta comparten en torno al 99,9 % de su ADN, y hay más variación genética dentro de cualquier población que entre poblaciones distintas. Las «razas» humanas no tienen fundamento biológico.",
          "En la consulta ya se nota: diagnóstico de enfermedades raras que antes tardaban años en identificarse, tratamientos oncológicos dirigidos a la mutación concreta de un tumor, farmacogenética para saber qué medicamento y qué dosis tolera cada persona, y cribados prenatales.",
          "Y desde 2012, con la herramienta CRISPR, editar el ADN se ha vuelto relativamente sencillo y barato. Ya hay terapias aprobadas que curan enfermedades de la sangre corrigiendo las células del propio paciente. Y ahí aparece el límite que la humanidad todavía está decidiendo: modificar las células de una persona enferma es medicina; modificar embriones significa cambiar a todas las generaciones siguientes. En 2018, un investigador chino lo hizo y fue condenado internacionalmente y penalmente.",
        ],
        "Dato curioso: secuenciar el primer genoma humano costó unos 2.700 millones de dólares y trece años de trabajo. Hoy se hace en un día por unos cientos de dólares. Ninguna tecnología, ni la informática, ha bajado de precio tan rápido."),
      hito("medicina-moderna", "etica-medica", "La ética médica", "Desde 1947",
        "",
        [
          "Durante casi toda la historia, un médico podía hacer algo por tu bien sin preguntártelo. La relación entre médico y paciente era paternalista: el médico sabía, decidía y a veces ni siquiera informaba del diagnóstico «para no angustiar». Y en el siglo XX se comprobó a dónde puede llevar eso cuando además hay poder y prisa por investigar.",
          "Los experimentos de los médicos nazis en los campos de concentración —congelación, presión, inoculación de enfermedades, mutilaciones, en personas que no podían negarse— se juzgaron en Núremberg en 1947. De aquel juicio salió el primer código de la historia sobre investigación en personas, y su punto número uno es tan sencillo como revolucionario: el consentimiento voluntario del sujeto es absolutamente esencial.",
          "Y no fue solo el nazismo. En Estados Unidos, entre 1932 y 1972, el estudio de Tuskegee siguió durante cuarenta años a cientos de hombres negros con sífilis SIN tratarlos, para observar la evolución natural de la enfermedad, incluso después de que existiera la penicilina. Se les ocultó su diagnóstico. El escándalo, al descubrirse, cambió la legislación estadounidense y dejó en las comunidades afectadas una desconfianza hacia el sistema sanitario que se sigue notando hoy.",
          "También hubo abusos silenciosos y cotidianos. En 1951, a una mujer llamada Henrietta Lacks le tomaron una muestra de su tumor sin informarla ni pedirle permiso; sus células resultaron capaces de multiplicarse indefinidamente en el laboratorio y se han usado desde entonces en decenas de miles de investigaciones —la vacuna de la polio, la fecundación in vitro, la investigación del cáncer y del virus del papiloma—. Su familia no lo supo durante veinte años y vivió sin seguro médico mientras se vendían viales de sus células por todo el mundo.",
          "De todo eso nacieron las reglas que hoy protegen a cualquiera que entra en una consulta o en un estudio, y conviene conocerlas porque son TUS derechos: el consentimiento informado, es decir, que te expliquen en un idioma que entiendas qué te van a hacer, con qué alternativas y qué riesgos, y que puedas decir no; los comités de ética que revisan cada investigación antes de empezar; el derecho a tu historia clínica; la confidencialidad; el derecho a una segunda opinión; y el derecho a decidir sobre el final de tu vida, con el documento de últimas voluntades.",
          "Los cuatro principios que se enseñan hoy en las facultades son fáciles de recordar: no hacer daño, buscar el beneficio del paciente, respetar su autonomía y ser justos en el reparto de los recursos. Y a menudo entran en conflicto entre sí, y ahí es donde empieza la discusión de verdad.",
        ],
        "Dato curioso: el juramento hipocrático tiene 2.400 años y sigue siendo la referencia moral de la profesión. Pero su versión antigua no dice nada de informar al paciente ni de pedirle su opinión: esa idea —que la persona enferma es quien decide sobre su propio cuerpo— es la aportación ética más importante del siglo XX a la medicina."),
      hito("medicina-moderna", "pandemias-arn", "Pandemias y vacunas de ARN", "2020-2023",
        "",
        [
          "Cuando en marzo de 2020 la Organización Mundial de la Salud declaró la pandemia de COVID-19, se dio por hecho que la vacuna tardaría cinco o diez años: era el récord histórico. La primera se estaba administrando en diciembre de ese mismo año.",
          "Cómo fue posible es una lección sobre cómo funciona realmente la ciencia, y son cuatro factores.",
          "UNO: décadas de trabajo previo que parecía no servir para nada. La tecnología del ARN mensajero llevaba treinta años investigándose, con financiación escasa y muchos rechazos; la bioquímica Katalin Karikó pasó años sin conseguir becas y fue degradada en su universidad por insistir en esa línea. En 2023 recibió el Nobel. Cuando llegó la emergencia, la herramienta ya estaba a medio construir.",
          "DOS: información compartida de inmediato. El genoma del virus se secuenció y se publicó en internet en enero de 2020, a disposición de cualquier laboratorio del mundo. Con esa secuencia, diseñar la vacuna de ARN llevó días: por eso se dice que estas vacunas se diseñan en un ordenador.",
          "TRES: dinero público a riesgo y en cantidad, que permitió fabricar millones de dosis ANTES de saber si funcionaban, y solapar fases de ensayo que normalmente van una detrás de otra. No se recortaron los controles de seguridad: se recortó el tiempo de espera entre trámites y el tiempo de fabricación.",
          "CUATRO: voluntarios. Decenas de miles de personas se apuntaron a los ensayos en pocas semanas.",
          "Y CÓMO FUNCIONAN, en corto: en lugar de inyectar el virus debilitado, se inyectan las instrucciones para fabricar una sola pieza suya —la proteína de la espícula— envueltas en una burbuja de grasa. Tus células leen esas instrucciones, fabrican la pieza, el sistema inmunitario la reconoce como extraña y aprende a defenderse. El ARN se degrada en horas y no entra en el núcleo ni modifica tu ADN.",
          "La pandemia dejó otras lecciones menos técnicas. Que las medidas más eficaces al principio fueron las de siempre —distancia, ventilación, aislamiento, higiene, exactamente lo que se aprendió con Snow y Semmelweis—. Que la desigualdad decide quién enferma: no fue lo mismo confinarse en un piso con terraza que en uno de cuarenta metros, ni tener un trabajo que se podía hacer desde casa. Que los países ricos vacunaron primero mientras África esperaba más de un año. Y que la confianza es un recurso sanitario: donde se perdió, ninguna medida funcionó bien.",
        ],
        "Dato curioso: casi todos los expertos coinciden en algo incómodo: no será la última. Con la densidad de población, la ganadería intensiva, la deforestación y la aviación actuales, habrá más pandemias, y lo que decidirá el resultado será la vigilancia temprana, la capacidad de fabricar y —sobre todo— la confianza social."),
      hito("medicina-moderna", "moderna-aplicalo", "Aplícalo a tu vida", "",
        "",
        [
          "Curamos mejor que nunca... pero ¿entendemos mejor al ser humano?",
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
    subhitos: [
      hito("psiquiatria", "locura-historia", "La locura, de la posesión a la enfermedad", "Durante casi toda la historia",
        "",
        [
          "Durante casi toda la historia, la enfermedad mental fue la gran incomprendida. Se veía como un castigo divino, una posesión de espíritus o una vergüenza que había que esconder.",
          "A quienes sufrían trastornos mentales se les temía, se les apartaba y muchas veces se les encerraba en condiciones terribles, encadenados y sin ningún tratamiento ni cuidado.",
          "Faltaba una idea sencilla pero revolucionaria: que la mente, igual que el cuerpo, también puede enfermar, y que quien la sufre es un enfermo que merece ayuda, no un culpable que merece castigo.",
          "Reconocer eso —que el sufrimiento mental es una enfermedad y no un defecto moral— fue el primer gran paso de la psiquiatría.",
        ],
        "Dato curioso: durante siglos existieron lugares donde la gente pagaba una entrada para ver a los enfermos mentales encerrados, como si fueran un espectáculo. Cuesta imaginar hasta qué punto se malinterpretaba su sufrimiento."),
      hito("psiquiatria", "pinel", "Philippe Pinel", "1745-1826",
        "",
        [
          "Philippe Pinel fue un médico francés que, a finales del siglo XVIII, hizo algo que escandalizó a su época: mandó quitar las cadenas a los enfermos mentales de los hospitales de París.",
          "Defendía tratarlos con humanidad, hablar con ellos, observarlos y cuidarlos, en lugar de castigarlos o abandonarlos. Fue el llamado «tratamiento moral».",
          "Empezó a clasificar los distintos trastornos mentales y a estudiarlos como enfermedades, con sus causas y su evolución, igual que la medicina hacía con el resto del cuerpo.",
          "Por eso se le considera uno de los padres de la psiquiatría: convirtió la locura en objeto de la medicina y al enfermo mental en un paciente con derecho a ser cuidado.",
        ],
        "Dato curioso: el gesto de Pinel liberando de sus cadenas a los enfermos se ha pintado muchas veces como símbolo del nacimiento de una medicina más humana."),
      hito("psiquiatria", "freud", "Sigmund Freud", "1856-1939",
        "",
        [
          "Sigmund Freud, médico neurólogo vienés, propuso una idea que cambiaría para siempre la forma de entender la mente: gran parte de lo que sentimos y hacemos nace de una zona oculta de nosotros mismos, el inconsciente.",
          "Según él, experiencias, deseos y conflictos que hemos olvidado o reprimido siguen influyendo en nosotros y pueden provocar sufrimiento. Creó el psicoanálisis para sacarlos a la luz hablando.",
          "Su método consistía en escuchar al paciente durante horas: sus recuerdos, sus sueños, lo que decía sin darse cuenta. Por primera vez, la palabra se convertía en un tratamiento.",
          "Muchas de sus teorías concretas han sido superadas o discutidas, pero su gran intuición sigue viva: hablar de lo que nos duele y comprender nuestra propia historia puede curar.",
        ],
        "Dato curioso: al psicoanálisis se le llamó «la cura por la palabra». Fue el antepasado de todas las psicoterapias que hoy ayudan a millones de personas."),
      hito("psiquiatria", "psicofarmacos", "El nacimiento de los psicofármacos", "Desde 1950",
        "",
        [
          "A mediados del siglo XX ocurrió una de las revoluciones más silenciosas y más importantes de la medicina: se descubrió que ciertas sustancias químicas podían aliviar de verdad los trastornos mentales.",
          "En 1952, en París, la clorpromazina —el primer antipsicótico— demostró que podía calmar los delirios y la agitación de enfermos que hasta entonces parecían perdidos. Poco después llegaron el litio, capaz de estabilizar el ánimo, y los primeros antidepresivos.",
          "El efecto fue extraordinario. Muchos hospitales psiquiátricos, auténticos almacenes de enfermos sin esperanza, empezaron a vaciarse: por fin había tratamientos que permitían a muchas personas volver a vivir fuera del encierro.",
          "Nacía así la psicofarmacología. Se confirmaba algo profundo: la mente tiene una base química en el cerebro, y actuar sobre esa química puede ayudar a devolver el equilibrio perdido.",
        ],
        "Dato curioso: muchos de aquellos primeros psicofármacos se descubrieron casi por casualidad, al observar que fármacos pensados para otra cosa cambiaban el ánimo o la conducta de los pacientes.",
        [
          {
            titulo: "Lo que se hizo antes de la pastilla",
            cuerpo: [
              "Para entender por qué la llegada de los psicofármacos fue una liberación, hay que saber qué había antes. Y es la página más dura de la historia de la medicina.",
              "EL ENCIERRO. Los grandes manicomios del siglo XIX y de la primera mitad del XX albergaban a decenas de miles de personas de por vida, sin tratamiento posible, en condiciones de hacinamiento, con cadenas, celdas de aislamiento y camisas de fuerza. En muchos casos no se separaba a los enfermos mentales de los mendigos, los epilépticos, las madres solteras, los alcohólicos o simplemente los incómodos para su familia.",
              "LOS «TRATAMIENTOS» DE CHOQUE. Ante la impotencia se probó de todo: duchas de agua helada, sillas giratorias hasta el vómito, aislamiento prolongado, comas provocados con insulina, malaria inducida a propósito para provocar fiebre. Casi nada de eso se había comparado nunca con un grupo de control: se aplicaba porque parecía que a veces algo cambiaba.",
              "LA LOBOTOMÍA es el caso más escandaloso. Consistía en destruir las conexiones de la parte frontal del cerebro, y en su versión más difundida se hacía introduciendo un punzón por encima del ojo, sin quirófano y en pocos minutos. Se practicó en decenas de miles de personas, muchas de ellas mujeres internadas por «nerviosismo» o por conducta inapropiada, y dejaba a los pacientes apáticos, infantilizados y con daños irreversibles. Su promotor recibió el Premio Nobel de Medicina en 1949. Es el recordatorio más incómodo posible de que un premio, un prestigio o un consenso profesional no son pruebas de eficacia.",
              "EL ELECTROSHOCK merece un matiz honesto, porque es el ejemplo contrario. Se usó de forma brutal y abusiva —sin anestesia, sin consentimiento, como castigo—, y su imagen quedó marcada por eso y por el cine. Pero la técnica en sí, hecha hoy con anestesia general, relajantes musculares y consentimiento informado, es un tratamiento legítimo y a veces salvador en depresiones gravísimas que no responden a nada y en riesgo alto de suicidio. La misma herramienta puede ser tortura o medicina según cómo, por qué y con qué permiso se aplique.",
              "QUÉ CAMBIÓ CON LOS FÁRMACOS. Con la clorpromazina y el litio, miles de personas pudieron salir de los hospitales y vivir en su casa. En los años sesenta y setenta empezó el cierre de los grandes manicomios en medio mundo. Pero ese proceso tuvo su propio fracaso, y hay que contarlo: en muchos países se cerraron los hospitales sin construir la red de atención comunitaria que debía sustituirlos, y una parte de aquellos pacientes acabó en la calle o en la cárcel. Es un problema todavía sin resolver.",
              "Y LO QUE SABEMOS HOY, con la humildad que toca: los psicofármacos ayudan de verdad a muchísima gente y no son caramelos; la explicación simple de que la depresión es «falta de serotonina» está superada y el mecanismo es mucho más complejo; para la mayoría de los cuadros, lo que mejor funciona es la combinación de fármaco y psicoterapia, no uno solo; y el estigma sigue siendo parte de la enfermedad.",
              "Ese es el hilo de este capítulo: se tardó dos mil años en aceptar que la mente puede enfermar como el cuerpo, y todavía cuesta tratarla con la misma naturalidad con la que se trata una tiroides.",
            ],
            dato: "Dato curioso: el litio, que sigue siendo uno de los tratamientos más eficaces que existen para el trastorno bipolar, es un elemento químico simple, no una molécula diseñada en un laboratorio. Uno de los mejores medicamentos de la psiquiatría es, literalmente, un metal de la tabla periódica.",
          },
        ]),
      hito("psiquiatria", "psiquiatria-aplicalo", "Aplícalo a tu vida", "",
        "",
        [
          "La psiquiatría te enseña que la mente también se cuida.",
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
    subhitos: [
      hito("integrativa", "que-es-integrativa", "¿Qué es la medicina integrativa?", "El reencuentro",
        "",
        [
          "La medicina integrativa parte de una idea sencilla y poderosa: tratar a la persona entera, no solo su enfermedad. Cuerpo, mente, emociones, hábitos y entorno forman un todo.",
          "No se opone a la medicina científica: la usa como base. Pero le suma herramientas que la ciencia había dejado de lado, como la nutrición, la actividad física, la gestión del estrés y la calidad de la relación entre médico y paciente.",
          "Su criterio es siempre la evidencia: incorpora aquello que demuestra funcionar y descarta lo que no, venga de donde venga.",
          "Es, en cierto modo, la síntesis de todo este viaje: la razón griega, la observación egipcia, el equilibrio indio, el flujo chino y el rigor moderno, trabajando juntos.",
        ],
        [
          {
            titulo: "Cómo distinguir lo que funciona de lo que se vende",
            cuerpo: [
              "Este es el punto más delicado de todo el recorrido y merece decirse con claridad, porque bajo la etiqueta de «integrativa», «natural» o «holística» convive lo mejor de la medicina actual con negocios que se aprovechan de la gente enferma.",
              "LO QUE TIENE PRUEBAS SÓLIDAS y ya forma parte de la mejor medicina: el ejercicio físico —que es, medido en resultados, uno de los tratamientos más potentes que existen para el ánimo, el corazón, la diabetes, la artrosis, el sueño y el dolor crónico—; la alimentación y el peso; dormir lo suficiente; dejar de fumar; el manejo del estrés y las técnicas de atención plena en dolor crónico y ansiedad; la fisioterapia; el acompañamiento psicológico; los grupos de apoyo; la relación de confianza con quien te atiende; y la rehabilitación en cualquier enfermedad crónica.",
              "LO QUE TIENE PRUEBAS PARCIALES O DÉBILES: muchas plantas medicinales —algunas funcionan, algunas interaccionan peligrosamente con medicamentos y de la mayoría no se conoce la dosis segura—, la acupuntura para ciertos dolores (donde los estudios muestran un efecto real pero pequeño y muy dependiente del contexto y del ritual), y buena parte de los suplementos, que en una persona bien alimentada casi nunca aportan nada.",
              "LO QUE NO TIENE NINGUNA PRUEBA, dicho sin rodeos: los productos que prometen curar el cáncer, «limpiar toxinas», reforzar el sistema inmunitario de forma genérica o sustituir a un tratamiento eficaz. Y el riesgo aquí no es solo el dinero: hay muertes documentadas de personas que abandonaron una quimioterapia con posibilidades reales de curación por seguir una promesa.",
              "SEÑALES DE ALARMA, y son bastante fiables: promete curar muchas cosas distintas a la vez; usa palabras como «energía», «toxinas» o «cuántico» sin definirlas; dice que la ciencia «no quiere que se sepa»; se apoya solo en testimonios y no en resultados; te pide que dejes tu tratamiento; cobra por adelantado un paquete largo; y no admite ningún resultado que pudiera demostrar que se equivoca.",
              "PREGUNTAS QUE PUEDES HACER SIEMPRE, a cualquier profesional y ante cualquier terapia: ¿esto se ha comparado con un grupo que no lo recibía? ¿qué beneficio concreto se ha medido, y de cuánto? ¿qué riesgos e interacciones tiene? ¿se puede combinar con mi tratamiento actual? ¿y qué pasaría si no hago nada?",
              "Y LA REGLA DE ORO, que resume dos mil años de esta historia: lo que ayuda se SUMA, no se sustituye. La medicina integrativa bien entendida no consiste en cambiar la ciencia por la tradición, sino en no renunciar a nada de lo que funciona: el fármaco correcto, y también el ejercicio, la comida, el sueño, la compañía y una persona que te escuche.",
              "Porque el error de la medicina moderna nunca fue curar demasiado bien. Fue olvidar, por el camino, que quien está enfermo es una persona entera.",
            ],
            dato: "Dato curioso: hay un tratamiento que aparece en casi todas las guías clínicas modernas, no tiene efectos secundarios, es gratis y ninguna cultura de este recorrido lo ignoró: el movimiento. Hipócrates ya lo receta, el Ayurveda y la medicina china lo prescriben, y la investigación actual lo confirma como una de las intervenciones más eficaces que tenemos.",
          },
        ]),
      hito("integrativa", "pilares-integrativa", "Los pilares del cuidado", "Nutrición, mente y estilo de vida",
        "",
        [
          "La medicina integrativa presta especial atención a lo que construye la salud día a día: la alimentación, el sueño, el movimiento, las relaciones y la forma de afrontar el estrés.",
          "La nutrición se entiende como una medicina cotidiana: lo que comes influye en tu energía, tu ánimo y tu riesgo de enfermar.",
          "La psicología se reconoce como parte esencial: las emociones, el estrés y el sentido de la vida afectan directamente al cuerpo, tal como intuía ya el chamán.",
          "Y se recuperan saberes como la fitoterapia —el uso de plantas medicinales—, siempre valorados con criterio científico.",
          "Todo ello se personaliza: el mejor cuidado es el que se adapta a tu constitución, tu historia y tu vida, como enseñaba el Ayurveda.",
        ]),
      hito("integrativa", "andrew-weil", "Andrew Weil", "1942-",
        "",
        [
          "Andrew Weil, médico formado en una de las universidades más prestigiosas del mundo, es uno de los grandes impulsores de la medicina integrativa moderna.",
          "Defiende combinar los avances de la medicina científica con la nutrición, la relajación, el ejercicio y el poder de curación del propio cuerpo.",
          "Insiste en algo que recorre toda esta historia: el organismo tiene una enorme capacidad de sanar por sí mismo, y buena parte de la medicina consiste en crear las condiciones para que lo haga.",
          "Su trabajo ayudó a que hospitales y universidades tomaran en serio el cuidado de la persona completa, con rigor y sin renunciar a la evidencia.",
        ]),
      hito("integrativa", "avicena-steiner", "Inspiraciones y matices", "Avicena y Steiner",
        "",
        [
          "La medicina integrativa mira también atrás en busca de inspiración. Avicena, mil años antes, ya trataba al paciente como un todo, uniendo cuerpo, dieta, emociones y entorno: un precursor histórico de esta visión.",
          "También existen corrientes como la medicina antroposófica, propuesta por Rudolf Steiner, que busca integrar aspectos espirituales en el cuidado del enfermo.",
          "Es importante ser claro: la antroposofía es una corriente filosófico-médica, no una medicina basada en la evidencia. Aporta una mirada sobre la persona, pero no sustituye a los tratamientos comprobados científicamente.",
          "La medicina integrativa seria distingue siempre lo que tiene respaldo científico de lo que pertenece al terreno de las creencias, y coloca la seguridad del paciente por encima de todo.",
        ],
        "Dato curioso: hoy numerosos hospitales y universidades cuentan con centros de medicina integrativa donde investigadores estudian con métodos científicos qué prácticas complementarias funcionan realmente y cuáles no."),
      hito("integrativa", "mensaje-final", "Mensaje final", "",
        "",
        [
          "Después de 20.000 años buscando la salud, descubrimos algo sorprendente.",
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
