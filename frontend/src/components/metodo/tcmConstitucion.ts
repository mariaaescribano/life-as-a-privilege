// ─────────────────────────────────────────────────────────────────────────
// TU CONSTITUCIÓN · el elemento predominante de la personalidad
//
// OJO, esto NO es el diagnóstico. Son dos lecturas distintas y el recorrido
// las usa para cosas distintas:
//
//   · CONSTITUCIÓN (esta página) → QUIÉN ERES. Estable, de fondo, casi no
//     cambia con los años. Sale de este test: frases neutras (lo bueno
//     incluido) que se responden sí/no, agrupadas por elemento.
//   · DIAGNÓSTICO (`diagnosticoElemento` en tcmRecorrido) → QUÉ TE PASA HOY.
//     Es la resta carga − recursos de los tres cuestionarios de cada elemento,
//     y se mueve con la temporada que estés viviendo.
//
// Leídas juntas dicen mucho más que por separado: que tu constitución sea
// Metal y hoy el Metal esté en carga significa una cosa; que tu constitución
// sea Metal y lo que te pese sea el Agua, otra muy distinta.
//
// El test sigue el Self-Assessment Profile de «Between Heaven and Earth»
// (Beinfield & Korngold): dos bloques —psicológico y fisiológico— con frases
// repartidas entre los cinco elementos. Allí se marcan con + o con −; aquí se
// responden Sí / No, que es lo mismo y se vuela.
//
// ✍️  EDITAR CONTENIDO: cambia los textos aquí. NO cambies las `key`: son las
//     que guardan la respuesta en la BD y se perderían.
// ─────────────────────────────────────────────────────────────────────────
import { ORDEN_ELEMENTOS, type DatosTcm, type Elemento } from "./tcmRecorrido";
import { FOTO_ELEMENTO } from "./tcmElementosContenido";

// ── Las cinco constituciones (las cinco tarjetas de la página) ──────────────

export interface Constitucion {
  elemento: Elemento;
  /** El nombre del tipo («El Pionero»). */
  arquetipo: string;
  /** Una línea que lo resume, bajo el nombre. */
  lema: string;
  texto: string[];
  /** Lo que este tipo desea y valora (las «afinidades» del libro). */
  afinidades: string[];
  /** Lo que teme y le cuesta (las «aversiones»). */
  aversiones: string[];
  /** Los nudos: las dos mitades son verdad a la vez, y ahí está el conflicto. */
  nudos: { quiere: string; pero: string }[];
  /** Por dónde avisa el cuerpo de este tipo cuando se desequilibra. */
  cuerpo: string[];
  /** Lo que esa constitución te da cuando está en su mejor versión. */
  luz: string;
  /** Por dónde se tuerce cuando se pasa de rosca. */
  sombra: string;
  foto: string;
}

// La foto de cada tarjeta. Hoy se reutiliza la pintura de fondo del elemento;
// si algún día hay fotos propias de las constituciones, se cambian AQUÍ y toda
// la página las coge (es el único sitio que las nombra).
export const FOTO_CONSTITUCION: Record<Elemento, string> = { ...FOTO_ELEMENTO };

export const CONSTITUCIONES: Record<Elemento, Constitucion> = {
  madera: {
    elemento: "madera",
    arquetipo: "El Pionero",
    lema: "Abre camino donde no lo había.",
    texto: [
      "La Madera es el empuje del brote que rompe la tierra: una fuerza que necesita una dirección para existir. Si es tu constitución, el mundo se te presenta como una lista de cosas que hay que sacar adelante, y estás bien cuando estás sacándolas. Decides rápido, actúas antes de tenerlo todo claro y prefieres equivocarte moviéndote a acertar quieto.",
      "Ves antes que nadie lo que hay que hacer y no acabas de entender por qué los demás no lo ven. La presión no te desordena: te enfoca. Cuando algo se interpone entre tú y la meta no lo rodeas, empujas; y si el obstáculo es una persona, el conflicto no te asusta, te parece el camino corto.",
      "Tu materia prima es el impulso, y el impulso es un recurso que necesita salida. Con camino por delante te vuelve incansable; contra una pared se te queda dentro. Ahí es donde la Madera se tuerce: no en el esfuerzo, sino en el esfuerzo bloqueado.",
    ],
    afinidades: [
      "La lucha", "La acción", "La activación", "Lo práctico", "Ser único",
      "El desafío", "El logro", "La agilidad", "La independencia", "La competición",
    ],
    aversiones: [
      "La lentitud", "La torpeza", "La ambigüedad", "Que se metan en medio", "La autoridad",
      "Ceder a medias", "La frustración", "Que nada cambie", "Someterse", "El encierro",
    ],
    nudos: [
      { quiere: "Quiere mandar", pero: "y echa de menos tener iguales al lado." },
      { quiere: "Necesita hacer, actuar", pero: "y el impulso se le va de las manos." },
      { quiere: "Pone las normas", pero: "y disfruta saltándoselas." },
      { quiere: "Exige libertad", pero: "y necesita algo contra lo que pelear." },
      { quiere: "Se siente invencible", pero: "y teme la vulnerabilidad y perder el control." },
    ],
    cuerpo: [
      "Tensión que se agarra al cuello y los hombros, calambres, tics y espasmos de músculos y vísceras.",
      "Dolor que cambia de sitio, hinchazón que va y viene, y funciones que se vuelven irregulares sin un motivo claro.",
      "El costado: molestia o plenitud bajo las costillas, náuseas, boca amarga, dolor en el bajo vientre y las ingles, reglas irregulares.",
      "Ojos y uñas, que son su ventana: vista borrosa, ojos secos, sensibilidad a la luz y al ruido, uñas apagadas, blandas o quebradizas.",
      "Por dentro: irritabilidad, impaciencia, decisiones que se atascan y un cuerpo que no afloja aunque se pare.",
    ],
    luz: "Decisión, valentía, visión clara del futuro y una capacidad enorme de sacar las cosas adelante.",
    sombra: "Cuando el camino se cierra, el empuje se vuelve hacia dentro: frustración, prisa, ira y tensión en el cuerpo.",
    foto: FOTO_CONSTITUCION.madera,
  },
  fuego: {
    elemento: "fuego",
    arquetipo: "El Mago",
    lema: "Enciende lo que toca.",
    texto: [
      "El Fuego es el mediodía del año: el momento en que la Vida se expande del todo y se gasta sin reservarse nada. Si es tu constitución, vives hacia fuera. Sientes rápido, contagias lo que sientes, y el contacto con los demás no es un lujo: es alimento.",
      "Sabes lo que le pasa a alguien antes de que lo diga, y cuando alguien te importa te metes entero, sin capas intermedias. Tu medida del tiempo no son los logros, sino la intensidad: un día en el que no has sentido nada es un día que no cuenta.",
      "El Fuego no sabe regularse solo: prende con todo y no tiene botón de apagado. Por eso el Mago acaba teniendo que aprender justo lo que menos le sale —decir que no, quedarse solo, dormir—, porque su problema casi nunca es la falta de energía, sino no saber dónde para.",
    ],
    afinidades: [
      "La emoción", "La intimidad", "La sensualidad", "Lo espontáneo", "Expresarse",
      "Entregarse", "Fundirse con otro", "La pasión", "Mostrarse entero", "Estar en escena",
    ],
    aversiones: [
      "La inactividad", "La separación", "La confusión", "La brusquedad", "Los límites",
      "Pensarlo demasiado", "El aburrimiento", "Lo corriente", "Guardarse", "La desconfianza",
    ],
    nudos: [
      { quiere: "Desea contacto e intimidad", pero: "y necesita soledad." },
      { quiere: "Ama sentirlo todo", pero: "y teme que la intensidad lo desborde." },
      { quiere: "Le encanta decir que sí", pero: "y no sabe decir que no." },
      { quiere: "Anhela fundirse con otro", pero: "y le aterra disolverse." },
      { quiere: "Vive en el presente", pero: "y le da pavor el futuro." },
    ],
    cuerpo: [
      "El corazón y la circulación: latido rápido o irregular, palpitaciones, dolor en el pecho, sofocos.",
      "El sueño: insomnio cuando está nervioso o ilusionado, sueños muy vívidos, despertarse con el corazón acelerado.",
      "La piel y el sudor: sudar con facilidad, ponerse rojo al sobresaltarse, eccemas secos y con picor en la flexura del codo o detrás de la rodilla.",
      "El habla y el pensamiento: hablar demasiado rápido, risa nerviosa, dispersión, memoria que se va.",
      "Por dentro: ansiedad, inquietud, hipersensibilidad, y un vacío grande justo después de la euforia.",
    ],
    luz: "Calidez, entusiasmo, intuición para lo emocional y el don de hacer que la gente se sienta viva a tu lado.",
    sombra: "Te enciendes tanto que te consumes: agitación, ansiedad, insomnio y un vacío grande cuando la chispa se apaga.",
    foto: FOTO_CONSTITUCION.fuego,
  },
  tierra: {
    elemento: "tierra",
    arquetipo: "El Pacificador",
    lema: "Sostiene a los suyos.",
    texto: [
      "La Tierra es la cosecha: el momento en que lo vivido se convierte en alimento. Si es tu constitución, tu centro de gravedad no está en ti, está en el vínculo. Perteneces, cuidas, haces de nudo entre personas que sin ti no se hablarían, y te salen los demás antes que tú sin que te parezca un sacrificio.",
      "Necesitas continuidad. Los cambios bruscos te descolocan más que a nadie, y no por miedo: tu manera de estar bien es tener un sitio y que ese sitio siga estando. Creas hogar donde estés, con muy poco y sin dramatismo, y la gente se relaja a tu alrededor sin saber por qué.",
      "Tu trabajo interno es el reverso de tu virtud: distinguir entre cuidar y necesitar que te necesiten. Cuando sostienes de más te quedas sin suelo, y lo que empezó siendo generosidad se convierte en preocupación que da vueltas y en esperar una devolución que nadie te ha prometido.",
    ],
    afinidades: [
      "Las relaciones", "La estabilidad", "La familia", "Compartir", "La armonía",
      "La lealtad", "El compromiso", "La diplomacia", "Implicarse", "Depender y que dependan",
    ],
    aversiones: [
      "Estar separado", "La deslealtad", "El conflicto", "El cambio", "La soledad",
      "Que nada dure", "La avaricia", "La inseguridad", "El vacío", "Que lo saquen de su sitio",
    ],
    nudos: [
      { quiere: "Está en el punto quieto", pero: "y se siente atascado." },
      { quiere: "Quiere estar lleno", pero: "y acaba pesado, empachado y desbordado." },
      { quiere: "Busca el vacío", pero: "y teme que dentro no haya nada." },
      { quiere: "Desea que algo cambie", pero: "y quiere que todo siga igual." },
      { quiere: "Quiere que lo necesiten", pero: "y teme que lo absorban y perderse." },
    ],
    cuerpo: [
      "La digestión: hinchazón de tripa, gases, apetito que se va o se dispara, heces sueltas, antojos de dulce y de harinas.",
      "Los líquidos y la linfa: retención, hinchazón de párpados y tobillos, sensación de estar lleno y pesado.",
      "Los músculos: blandos y sensibles, sobre todo en brazos y muslos, y flojera de cuello, muñecas y lumbares.",
      "La sangre y las venas: moratones fáciles, varices, hemorroides, encías que sangran, anemia por mala absorción.",
      "Por dentro: preocupación en bucle, obsesión con un tema, inseguridad y un cansancio espeso que no se quita durmiendo.",
    ],
    luz: "Lealtad, empatía, tacto y una capacidad rarísima de crear hogar allí donde estés.",
    sombra: "De tanto sostener a otros te quedas sin suelo: preocupación que da vueltas, necesidad de aprobación y un cuerpo pesado y lleno.",
    foto: FOTO_CONSTITUCION.tierra,
  },
  metal: {
    elemento: "metal",
    arquetipo: "El Alquimista",
    lema: "Separa el oro de la ganga.",
    texto: [
      "El Metal es el otoño: la poda, lo que se suelta para que quede lo esencial. Si es tu constitución, tu manera de estar en el mundo es discriminar, en el sentido literal de la palabra: separar lo que vale de lo que no. Buscas calidad antes que cantidad, criterio antes que impulso, y tienes un sentido finísimo de lo que está bien hecho.",
      "Te mueves mejor con normas claras, un ámbito propio y una distancia cómoda. No necesitas mucha gente alrededor: necesitas que lo que haya alrededor tenga valor. Y prefieres que te midan por tu competencia antes que por tu carácter o tu entusiasmo.",
      "El Metal es también el elemento del duelo, y ahí está su asignatura: soltar es su virtud y su herida. Cuando el criterio se endurece, la exigencia sustituye al gusto, la distancia sustituye al vínculo y queda una tristeza seca, sin un acontecimiento que la explique.",
    ],
    afinidades: [
      "El orden", "La pureza", "La razón", "La estética", "Lo bien definido",
      "La sencillez", "La calidad", "Lo correcto", "Los estándares", "La precisión",
    ],
    aversiones: [
      "La intimidad", "Lo enrevesado", "El caos", "Lo absurdo", "La improvisación",
      "La dejadez", "Lo inapropiado", "El exceso", "La vaguedad", "Lo que no tiene forma",
    ],
    nudos: [
      { quiere: "Quiere vínculo", pero: "y necesita distancia." },
      { quiere: "Sabe lo que está bien", pero: "y se queda con lo que es seguro." },
      { quiere: "Aspira a la belleza", pero: "y se conforma con lo útil." },
      { quiere: "Quiere alegría", pero: "y teme lo espontáneo." },
      { quiere: "Ama la creatividad y el ingenio", pero: "y no tolera el desorden ni la disonancia." },
    ],
    cuerpo: [
      "El pulmón y las vías altas: tos, mocos, catarros de repetición, respiración corta y superficial, congestión de nariz y senos.",
      "La piel y las mucosas, que son su frontera: sequedad, picor, piel fina que se agrieta, granitos secos, poros abiertos.",
      "Las alergias y lo que entra por el aire: estornudos al cambiar la temperatura o la humedad.",
      "La circulación de los líquidos y las venas: arañitas vasculares, varices, heridas que tardan en cerrar, ganglios duros en el cuello.",
      "Por dentro: melancolía, sentimentalismo, entumecimiento emocional, y dolor de cabeza o de pecho después de una pérdida.",
    ],
    luz: "Criterio, integridad, método y la capacidad de destilar lo importante de todo lo que sobra.",
    sombra: "El criterio se endurece y se vuelve exigencia: distancia, rigidez, juicio y una tristeza seca que cuesta nombrar.",
    foto: FOTO_CONSTITUCION.metal,
  },
  agua: {
    elemento: "agua",
    arquetipo: "El Filósofo",
    lema: "Mira debajo de la superficie.",
    texto: [
      "El Agua es el invierno y la semilla: la reserva desde la que empieza todo y que no se ve. Si es tu constitución, vives hacia dentro. La soledad no es lo que te queda cuando no hay nadie, es el sitio donde te recargas; y lo que hay debajo de las cosas te interesa mucho más que lo que se enseña.",
      "Observas desde cierta distancia, con ojo crítico, y mides bien lo que enseñas de ti. Aguantas más que nadie cuando algo importa de verdad, y puedes sostener una idea impopular durante años sin necesitar que nadie te la confirme. La gente tarda en conocerte, y a ti te parece bien.",
      "Tu recurso es la reserva, y una reserva se gasta. El Agua no avisa con estrépito: avisa con cansancio de fondo, con miedo y con la sensación de estar tirando de algo que no se repone. Cuando el retiro deja de ser una elección y se convierte en muro, el Filósofo se queda a solas con lo que más teme: que nadie lo vea.",
    ],
    afinidades: [
      "La soledad", "El misterio", "La continuidad", "La originalidad", "La dureza",
      "La autosuficiencia", "Lo privado", "El anonimato", "La cautela", "Conservar",
    ],
    aversiones: [
      "Tener que compartir", "La precipitación", "La vulnerabilidad", "La ignorancia", "La falsedad",
      "La superficialidad", "La fe ciega", "Quedar expuesto", "El derroche", "La blandura",
    ],
    nudos: [
      { quiere: "Anhela la verdad", pero: "y teme quedar expuesto." },
      { quiere: "Anhela el vínculo", pero: "y no soporta el contacto." },
      { quiere: "Le gusta que lo aprieten", pero: "y teme que lo aplasten." },
      { quiere: "Quiere meterse dentro del otro", pero: "y detesta que lo absorban." },
      { quiere: "Disfruta de que lo dejen en paz", pero: "y teme que lo abandonen." },
    ],
    cuerpo: [
      "Los huesos y la estructura: lumbares, caderas, rodillas y tobillos que duelen o se agarrotan, dientes que se aflojan.",
      "El oído y la vista: pitidos, oído que baja, agudeza visual que se pierde, ojeras oscuras.",
      "La reserva vital: fertilidad, embarazo, libido, y un bajón claro después del sexo o de un esfuerzo mental largo.",
      "Los líquidos: orinar mucho o con dificultad, escapes, hinchazón de cara, manos y tobillos.",
      "Por dentro: desconfianza, cinismo, desesperanza, inercia y la sensación de estar envejeciendo antes de tiempo.",
    ],
    luz: "Profundidad, imaginación, honestidad sin adornos y una resistencia enorme a largo plazo.",
    sombra: "El retiro se hace muro: aislamiento, miedo, desconfianza y la sensación de gastar una reserva que no se repone.",
    foto: FOTO_CONSTITUCION.agua,
  },
};

// ── El test ────────────────────────────────────────────────────────────────

/** Los dos bloques del test: cómo eres y cómo va tu cuerpo. */
export type BloqueConstitucion = "psicologico" | "fisiologico";

/** Lo que se lee arriba de cada bloque, antes de las frases. */
export const ENUNCIADO: Record<BloqueConstitucion, string> = {
  psicologico: "Es típico de mí:",
  fisiologico: "Me pasa a menudo:",
};

/** El nombre del bloque (la cabecera del test). */
export const NOMBRE_BLOQUE: Record<BloqueConstitucion, string> = {
  psicologico: "Cómo eres",
  fisiologico: "Cómo va tu cuerpo",
};

export interface FraseConstitucion {
  /** Clave estable con la que se guarda la respuesta ("cons-p-agua-3"). */
  key: string;
  texto: string;
}

/** Un grupo de frases del test. El ELEMENTO no se enseña mientras se responde:
 *  saber que un bloque entero es «de Madera» condicionaría las respuestas. */
export interface GrupoConstitucion {
  key: string;
  bloque: BloqueConstitucion;
  elemento: Elemento;
  frases: FraseConstitucion[];
}

/** Las dos respuestas posibles. Se guardan como texto, igual que la escala. */
export const SI = "1";
export const NO = "0";

// Monta un grupo numerando las frases (las keys salen del índice: no reordenes
// una lista ya publicada, cambiarían todas las respuestas guardadas de debajo).
const grupo = (
  bloque: BloqueConstitucion,
  elemento: Elemento,
  frases: string[],
): GrupoConstitucion => {
  const b = bloque === "psicologico" ? "p" : "f";
  return {
    key: `cons-${b}-${elemento}`,
    bloque,
    elemento,
    frases: frases.map((texto, i) => ({ key: `cons-${b}-${elemento}-${i + 1}`, texto })),
  };
};

export const GRUPOS_CONSTITUCION: GrupoConstitucion[] = [
  // ── Bloque 1 · psicológico ────────────────────────────────────────────
  grupo("psicologico", "agua", [
    "Decir la verdad de forma directa, aunque no sea lo más diplomático.",
    "Ir con cautela y con sentido común.",
    "Disfrutar de ratos largos de soledad y de introspección.",
    "Dejarme llevar por mi imaginación y mi curiosidad.",
    "Guardarme para mí lo que siento, lo que pienso y lo que opino.",
    "Estar a gusto pasando desapercibido, en la periferia de lo social.",
    "Que me consideren una persona rara o excéntrica.",
    "Meterme en asuntos intelectuales.",
    "Tener pocos amigos buenos y poca vida social, y estar bien así.",
    "Preferir resolver las cosas por mi cuenta.",
    "Medir mucho lo que enseño de mí a los demás.",
    "Defender con terquedad la verdad tal y como la veo.",
    "Tener paciencia y perseverar aunque llegue a un callejón sin salida.",
    "Mirar las cosas con objetividad, sin apasionarme.",
    "Sentirme autosuficiente, tenga pareja o no.",
    "Elegir lo privado antes que la intimidad, y la soledad antes que la vida social.",
    "Observar a la gente y lo que ocurre desde lejos, con ojo crítico y escéptico.",
    "Perseguir mis intereses aunque a los demás les parezcan poco importantes.",
    "Disfrutar de proyectos en los que no hay más gente implicada.",
    "Apartarme de lo cotidiano y mirar hacia dentro para pensar con calma qué lugar ocupa mi vida en el conjunto de las cosas.",
  ]),
  grupo("psicologico", "madera", [
    "Tener confianza en mí y actuar con determinación.",
    "Disfrutar de competir y tener ambición.",
    "Sentirme con poder y a prueba de todo.",
    "Reconocer a regañadientes que otra persona está a mi altura.",
    "Hablar abiertamente de lo que valgo y de lo que he conseguido.",
    "Estar a gusto en el conflicto o bajo presión.",
    "Disfrutar de ser el primero, el mejor, el distinto o incluso el estrafalario.",
    "Actuar con aplomo, dé igual lo que los demás piensen o sientan.",
    "Decidir rápido y comprometerme con un camino aunque las probabilidades estén en mi contra.",
    "Estar a gusto en tareas difíciles o en emergencias que exigen pensar sobre la marcha.",
    "Sentir que llevo razón aunque los demás estén en contra o me desaprueben.",
    "Sentirme bien siguiendo mi instinto y satisfaciendo mis impulsos.",
    "Ser directo o provocador aunque incomode o avergüence a otros.",
    "Disfrutar del reconocimiento público y de que admiren mi talento y mis logros.",
    "Estar a gusto dirigiendo o liderando a otras personas.",
    "Guiarme por mi propia corazonada de lo que está bien y lo que está mal.",
    "Tomar las riendas cuando hay que sacar algo adelante rápido y bien.",
    "Actuar con audacia y decisión aunque no tenga toda la información ni toda la experiencia.",
    "Disfrutar de pelear contra las probabilidades por el gusto de hacerlo.",
    "Querer rechazar o discutir la valoración que otros hacen de mí.",
  ]),
  grupo("psicologico", "fuego", [
    "Ser una persona viva y entusiasta.",
    "Disfrutar del placer de mis sentidos.",
    "Saber enseguida lo que otra persona piensa y siente.",
    "Disfrutar del contacto físico y de la intimidad emocional.",
    "Estar a gusto en un ambiente muy estimulante.",
    "Compartir abiertamente lo que siento y lo que deseo más adentro.",
    "Vivir en el aquí y el ahora, sin preocuparme del futuro ni quedarme en el pasado.",
    "Verle el lado divertido a la Vida.",
    "Disfrutar a fondo cuando consigo lo que quiero y lo que necesito.",
    "Tener ternura e intimidad y permitirme ser vulnerable con otra persona.",
    "Estar a gusto recibiendo y mostrando afecto y placer.",
    "Disfrutar de emocionarme.",
    "Meterme de lleno, casi sin querer, en lo que pasa a mi alrededor.",
    "Identificarme profundamente con lo que otra persona siente, piensa y vive.",
    "Tener sensibilidad e intuición para lo emocional, y responder a ello.",
    "Mantener el optimismo y la esperanza a pesar de lo que otros digan o crean.",
    "Mostrarme del todo, sin corazas.",
    "Sentir la alegría o el dolor de otra persona como si fueran míos.",
    "Mostrar mi entusiasmo y mi emoción sin ningún reparo.",
    "Disfrutar de atraer y de tener magnetismo.",
  ]),
  grupo("psicologico", "tierra", [
    "Cuidar y sostener a los demás.",
    "Poner las necesidades de otros por delante de las mías.",
    "Disfrutar de estar a menudo con mis amigos y mi familia.",
    "Ocuparme de los demás y tratar de cubrir lo que necesitan.",
    "Disfrutar de que cuenten conmigo para consolar y para ayudar.",
    "Disfrutar de ser el centro de mi red de familia y amistades.",
    "Ser de trato fácil y acomodarme a los demás.",
    "Disfrutar resolviendo disputas de forma que todas las partes queden satisfechas.",
    "Ayudar a que la gente trabaje junta en armonía.",
    "Crear un ambiente relajado en el que gente muy distinta esté a gusto junta.",
    "Ser leal y estar disponible para quienes son mis amigos, mi familia o parte importante de mi vida y mi trabajo.",
    "Implicarme en la vida de otras personas.",
    "Disfrutar de mantener muchas relaciones distintas, incluso enfrentadas entre sí.",
    "Tener diplomacia y tacto.",
    "Apoyarme en la habilidad y la inteligencia de los demás.",
    "Aceptar la idea que los demás tienen de quién soy.",
    "Disfrutar del simple hecho de estar en compañía.",
    "Ponerme en la situación de los demás y sentirla.",
    "Encontrar la manera de resolver un conflicto y llegar a un acuerdo.",
    "Acercarme a alguien lo bastante como para llegar a necesitarlo.",
    "Estar a gusto y ser sociable con gente a la que apenas conozco.",
  ]),
  grupo("psicologico", "metal", [
    "Mantener mi vida ordenada y pulcra.",
    "Tener una vida social agradable pero que no me exija demasiado.",
    "Tener el control de mi entorno y de cómo hago las cosas.",
    "Sostener con firmeza mis principios morales y mi forma de conducirme.",
    "Sentirme seguro en el trabajo cuando sé que todos siguen el procedimiento correcto.",
    "Disfrutar de las tareas que piden lógica, análisis y método.",
    "Que me tengan por alguien meticuloso y con criterio.",
    "Pensar de mí que soy impecable y que no se me puede reprochar nada.",
    "Bastarme a mí mismo y no meterme demasiado en los asuntos de otros.",
    "Trabajar con facilidad cuando los objetivos y las normas están bien definidos.",
    "Que me valoren por mi destreza y mi conocimiento antes que por mi carácter o mi entusiasmo.",
    "Que me juzguen por criterios objetivos y no por simpatías ni intuiciones.",
    "Aceptar la autoridad de quien sabe más que yo.",
    "Trabajar de forma sistemática y metódica.",
    "Disfrutar del proceso de resolver enigmas y misterios.",
    "Estar bien con pocos vínculos estrechos y pocas relaciones exigentes.",
    "Poner la virtud y los principios por delante del placer y la satisfacción.",
    "Contenerme al expresar lo que siento o lo que opino.",
    "Disfrutar de la templanza y de la moderación.",
    "Tener buen gusto y saber distinguir.",
  ]),

  // ── Bloque 2 · fisiológico ────────────────────────────────────────────
  grupo("fisiologico", "agua", [
    "Falta de semen o de otras secreciones sexuales",
    "Infertilidad, impotencia o falta de libido",
    "Bajón o cansancio después del sexo",
    "Olvidar lo que acabo de vivir o de aprender",
    "Menos agudeza en la vista o en el oído",
    "Hinchazón o dolor en el lagrimal (la esquina interna del ojo)",
    "Dolor en el arco, el talón o la planta del pie",
    "Vista y oído hipersensibles",
    "Rigidez o dolor en articulaciones o columna",
    "Bultos en el hueso, raros o dolorosos",
    "Orinar a menudo, con poca fuerza o con dificultad",
    "Incontinencia de semen, de orina o de heces",
    "Caída de pelo, en la cabeza o en el pubis",
    "Granos en la barbilla o entre la nariz y el labio de arriba",
    "Fatiga o apatía tras un esfuerzo mental largo",
    "Rigidez o dolor al agacharme o al incorporarme",
    "Ojeras marrones, moradas o negras",
    "Dolor de huesos por cansancio, por estar de pie o por exceso de trabajo",
    "Molestia o dureza en próstata, testículos, ovarios o cuello del útero",
  ]),
  grupo("fisiologico", "madera", [
    "Dolor en las sienes, los laterales, la nuca o la coronilla",
    "Vértigo y náuseas",
    "Vista borrosa de repente o pitidos en los oídos",
    "Ojos secos",
    "Dolor de cabeza, de oído o de ojos al darme el aire",
    "Dificultad para tragar o garganta cerrada",
    "Dolor punzante en ojos, oídos, nariz o garganta, sobre todo de noche",
    "Sensación de plenitud o de dolor bajo las costillas",
    "Pinchazos repentinos en el pecho, entre las costillas, en las axilas o en algún órgano interno o genital",
    "Sensibilidad a la luz fuerte o al ruido alto",
    "Uñas partidas, endurecidas o engrosadas",
    "Piel grasa, sobre todo en cara, nariz y cuero cabelludo",
    "Tensión frecuente en el cuello y los hombros",
    "Mal humor y bajón antes de la regla",
    "Irritabilidad después del sexo",
    "Libido excesiva o excitación sexual frecuente e incómoda",
    "Forúnculos o bultos dolorosos en axilas o ingles",
    "Calambres fuertes al empezar la regla",
    "Calambres o tics en los músculos de los ojos, la cara, las orejas, las pantorrillas o los pies",
    "Ojos que lagrimean mucho",
  ]),
  grupo("fisiologico", "fuego", [
    "Sudor excesivo",
    "Sofocos o sensación de estar acalorado",
    "Sed o antojo de bebidas y comidas frías",
    "Latido rápido o irregular",
    "Llagas en la boca o en la lengua",
    "Ardor en la boca, la uretra, el recto o la vagina",
    "Excitarme con facilidad y no poder frenarlo",
    "Mareo o desorientación cuando me sobresalto o me emociono",
    "Memoria a largo plazo más floja",
    "Tartamudear o hablar demasiado rápido",
    "Risa nerviosa o hablar sin parar",
    "Eyaculación u orgasmo precoz",
    "Insomnio cuando estoy nervioso o emocionado",
    "Ansiedad o temor al caer la tarde",
    "Sueños muy vívidos o inquietantes",
    "Despertarme con angustia o con el corazón acelerado",
    "Ponerme rojo al sobresaltarme, al ponerme nervioso o al disgustarme",
    "Erupciones o eccemas secos, rojos y con picor, sobre todo en la flexura del codo, detrás de la rodilla o en palmas y plantas",
    "Percepciones o imágenes mentales distorsionadas",
    "Inflamación de los vasos sanguíneos, la lengua, la oreja o el borde del ojo",
  ]),
  grupo("fisiologico", "tierra", [
    "Engordar rápido y costarme adelgazar",
    "Deseo obsesivo de comer, o justo lo contrario",
    "Hinchazón de tripa, sobre todo por la tarde-noche",
    "Músculos blandos y sensibles, sobre todo en brazos y muslos",
    "Debilidad en cuello, muñecas, tobillos y zona lumbar",
    "Párpados inflamados que tienden a pegarse",
    "Antojos frecuentes de dulce y de harinas",
    "Encías hinchadas, doloridas o que sangran",
    "Uñas deformes que se rompen con facilidad",
    "Cutículas que se levantan o se inflaman con facilidad",
    "Músculos y articulaciones hinchados",
    "Hinchazón general o retención de líquidos",
    "Moratones fáciles o frecuentes",
    "Sensación de estar lleno, pesado y aletargado",
    "Sequedad sin sed",
    "Falta de aguante",
    "Bajón, hinchazón y retención antes de la regla",
    "Granos en el cuero cabelludo, orzuelos, granos en la nariz o alrededor de la boca",
    "Dolor de cabeza tras darle muchas vueltas a algo, preocuparme, discutir o llevarme una decepción",
    "Varices o hemorroides",
  ]),
  grupo("fisiologico", "metal", [
    "Sequedad de nariz, garganta, piel o pelo",
    "Granitos secos y descamados, sobre todo en las mejillas, al lado de la nariz o en la espalda alta",
    "No sudar ni con calor",
    "Picor por sequedad",
    "Orina escasa",
    "Falta de mucosidad",
    "Ganglios grandes o duros, sobre todo a los lados del cuello o bajo la mandíbula",
    "Poros abiertos en la cara, la nariz y la espalda alta",
    "Muchos lunares o verrugas",
    "Estornudos o tos al cambiar la temperatura o la humedad del aire",
    "Arrugas, o piel y mucosas que se encogen",
    "Piel tirante o que se agrieta con facilidad",
    "Congestión de nariz, senos nasales o laringe",
    "Dolor de cabeza en la frente por sequedad o por mocos",
    "Dolor de cabeza o de pecho tras una decepción o una pérdida",
    "Respiración superficial",
    "Muchas arañitas vasculares",
    "Pólipos nasales o intestinales",
    "Piel fina y delicada",
    "Grietas secas y dolorosas en las fosas nasales, los labios o las comisuras",
  ]),
];

/** Cuántas frases tiene el test entero. */
export const TOTAL_FRASES_CONSTITUCION = GRUPOS_CONSTITUCION.reduce(
  (n, g) => n + g.frases.length, 0,
);

// ─────────────────────────────────────────────────────────────────────────
// PUNTUACIÓN
//
// Cada elemento se lleva un porcentaje: cuántos «sí» ha dicho de las frases
// que le tocan. Se cuenta sobre las CONTESTADAS y no sobre el total, para que
// un test a medias no hunda a los elementos que aún no ha leído. Y va en
// porcentaje, no en número bruto, porque los grupos no tienen todos el mismo
// número de frases (la Tierra psicológica tiene 21, el Agua física 19).
// ─────────────────────────────────────────────────────────────────────────

export interface PuntoConstitucion {
  elemento: Elemento;
  /** % de «sí» del elemento entero, 0–1 (lo que ordena el resultado). */
  pct: number;
  /** % de «sí» solo del bloque psicológico, 0–1. */
  pctPsico: number;
  /** % de «sí» solo del bloque fisiológico, 0–1. */
  pctFisico: number;
  si: number;
  contestadas: number;
  total: number;
}

const pctDe = (grupos: GrupoConstitucion[], respuestas: Record<string, string>) => {
  let si = 0, contestadas = 0;
  for (const g of grupos) {
    for (const f of g.frases) {
      const r = respuestas[f.key];
      if (r === undefined) continue;
      contestadas += 1;
      if (r === SI) si += 1;
    }
  }
  return { si, contestadas, pct: contestadas ? si / contestadas : 0 };
};

/** Los cinco elementos ordenados de más a menos «sí». */
export function puntuacionesConstitucion(
  respuestas: Record<string, string> | undefined,
): PuntoConstitucion[] {
  const r = respuestas ?? {};
  const puntos = ORDEN_ELEMENTOS.map((el): PuntoConstitucion => {
    const suyos = GRUPOS_CONSTITUCION.filter((g) => g.elemento === el);
    const todo = pctDe(suyos, r);
    const psico = pctDe(suyos.filter((g) => g.bloque === "psicologico"), r);
    const fisico = pctDe(suyos.filter((g) => g.bloque === "fisiologico"), r);
    return {
      elemento: el,
      pct: todo.pct,
      pctPsico: psico.pct,
      pctFisico: fisico.pct,
      si: todo.si,
      contestadas: todo.contestadas,
      total: suyos.reduce((n, g) => n + g.frases.length, 0),
    };
  });
  // Empate → gana el que va antes en el ciclo (orden estable y reproducible).
  return puntos.sort((a, b) => b.pct - a.pct);
}

/** Cuántas frases ha respondido ya. */
export function respondidasConstitucion(
  respuestas: Record<string, string> | undefined,
): number {
  if (!respuestas) return 0;
  let n = 0;
  for (const g of GRUPOS_CONSTITUCION) {
    for (const f of g.frases) if (respuestas[f.key] !== undefined) n += 1;
  }
  return n;
}

/** Cuántas frases de un grupo están respondidas. */
export function respondidasGrupo(
  g: GrupoConstitucion,
  respuestas: Record<string, string> | undefined,
): number {
  if (!respuestas) return 0;
  return g.frases.filter((f) => respuestas[f.key] !== undefined).length;
}

/** El test entero, contestado de arriba abajo. */
export function constitucionCompleta(
  respuestas: Record<string, string> | undefined,
): boolean {
  return respondidasConstitucion(respuestas) === TOTAL_FRASES_CONSTITUCION;
}

/** Las respuestas guardadas del test (nunca `undefined`). */
export function respuestasConstitucion(data: DatosTcm | null | undefined): Record<string, string> {
  const r = data?.constitucion?.respuestas;
  // Blindaje: si lo guardado no es un objeto (forma antigua, dato a medias),
  // se empieza de cero en vez de reventar la página.
  return r && typeof r === "object" && !Array.isArray(r) ? r : {};
}

/** ¿Tiene el test de constitución hecho ENTERO? Es el requisito para pasar de
 *  la página 3: los ciclos y el diagnóstico se leen ya sabiendo tu elemento de
 *  fondo. (El gate del Índice vive en `IndiceTcm`, que compone esta con
 *  `pasoAlcanzableTcm`; aquí no se puede importar `tcmRecorrido` al revés.) */
export function constitucionHecha(data: DatosTcm | null | undefined): boolean {
  return constitucionCompleta(respuestasConstitucion(data));
}

/** El elemento constitucional (y el segundo). `null` si el test no está hecho. */
export function constitucionDe(
  data: DatosTcm | null | undefined,
): { primaria: Elemento; secundaria: Elemento } | null {
  const r = respuestasConstitucion(data);
  if (!constitucionCompleta(r)) return null;
  const orden = puntuacionesConstitucion(r);
  return { primaria: orden[0].elemento, secundaria: orden[1].elemento };
}
