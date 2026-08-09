// ─────────────────────────────────────────────────────────────────────────
// PRĀṆĀYĀMA · contenido de la página del recorrido de Ayurveda (paso 9,
// justo antes de los Cursos). Introduce la respiración y la meditación, y
// termina con una práctica guiada distinta para cada doṣha.
//
// Las fotos son OPCIONALES: cada sección tiene un campo `foto` que, mientras
// esté vacío, simplemente no pinta imagen. Cuando subas las tuyas a
// /img/ayurveda/pranayama/, rellena la ruta aquí y aparecen solas.
// ─────────────────────────────────────────────────────────────────────────
import type { DoshaKey } from "./doshaIntro";

export interface SeccionPranayama {
  titulo: string;
  parrafos: string[];
  items?: string[];
  cierre?: string;
  /** Ruta de la ilustración, p. ej. "/img/ayurveda/pranayama/prana.webp". Vacío = sin foto. */
  foto?: string;
}

/** Una fase de la práctica guiada: el círculo crece, se queda o se encoge. */
export interface FasePranayama {
  tipo: "inhala" | "reten" | "exhala" | "rapida" | "descanso";
  texto: string;
  segundos: number;
}

export interface PracticaPranayama {
  /** Nombre sánscrito de la técnica. */
  nombre: string;
  /** Cómo se dice en español. */
  traduccion: string;
  /** Por qué esta técnica para este doṣha. */
  porQue: string[];
  /** Los pasos, para leerlos antes de practicar. */
  pasos: string[];
  /** Cuidado con… */
  precaucion: string;
  /** Ciclos que propone el guía. */
  ciclos: number;
  fases: FasePranayama[];
  foto?: string;
}

export const PRANAYAMA_HERO = {
  titulo: "Prāṇāyāma",
  subtitulo: "La respiración como puerta",
  parrafos: [
    "**Prāṇa** es la energía vital, lo que hace que un cuerpo esté vivo y no solo entero. **Āyāma** significa extender, alargar, dar espacio. Prāṇāyāma no es «respirar hondo»: es aprender a **dirigir** esa energía.",
    "Respiras unas veinte mil veces al día y casi todas se te pasan sin enterarte. Es la única función automática del cuerpo que también puedes gobernar a voluntad — y por eso es la puerta más directa que tienes al sistema nervioso.",
    "*No vas a cambiar tu mente pensando en tu mente. Vas a cambiarla por la puerta de atrás.*",
  ],
  foto: "",
};

export const PRANAYAMA_SECCIONES: SeccionPranayama[] = [
  {
    titulo: "Los cinco movimientos del prāṇa",
    parrafos: [
      "El Ayurveda no habla del prāṇa como de una sola cosa, sino de **cinco vāyus**: cinco direcciones en las que la energía se mueve dentro de ti.",
    ],
    items: [
      "**Prāṇa vāyu** — entra. Pecho y cabeza: lo que recibes, inspiras y percibes.",
      "**Apāna vāyu** — baja y suelta. Bajo vientre: lo que eliminas, sueltas y dejas ir.",
      "**Samāna vāyu** — digiere. Ombligo: lo que transformas, tanto la comida como lo que te pasa.",
      "**Udāna vāyu** — sube. Garganta: la voz, la expresión, lo que te empuja hacia arriba.",
      "**Vyāna vāyu** — reparte. Todo el cuerpo: la circulación, el movimiento, lo que distribuye.",
    ],
    cierre: "Cuando respiras conscientemente no mueves aire: reorganizas estos cinco movimientos. *De ahí que una respiración cambie un estado de ánimo.*",
    foto: "",
  },
  {
    titulo: "Cómo respiras cuando nadie te mira",
    parrafos: [
      "Casi todos respiramos con la parte alta del pecho, corto y rápido. Es la respiración del que está en alerta: el cuerpo la lee como «hay peligro» y responde subiendo el pulso, tensando la mandíbula y estrechando la atención.",
      "La respiración **diafragmática** — la que hincha el vientre antes que el pecho — hace lo contrario. Al bajar, el diafragma masajea las vísceras y estimula el **nervio vago**, que es el cable directo del freno del sistema nervioso.",
      "Y hay un detalle que lo cambia todo: **el freno está en la exhalación**. Al inhalar, el corazón se acelera un poco; al exhalar, se frena. Por eso una espiración más larga que la inspiración calma, y ninguna cantidad de inspiraciones profundas lo consigue por sí sola.",
    ],
    cierre: "*Si solo te llevas una cosa de esta página: alarga la salida.*",
    foto: "",
  },
  {
    titulo: "De la respiración a la meditación",
    parrafos: [
      "En los *Yoga Sūtras*, Patañjali coloca el prāṇāyāma en el **cuarto peldaño** de ocho. No es un ejercicio suelto: es el escalón que sostiene a los tres siguientes — retirar los sentidos (*pratyāhāra*), concentrar (*dhāraṇā*) y meditar (*dhyāna*).",
      "El orden no es un capricho. Sentarte a meditar con la respiración descontrolada es intentar que se pose un pájaro con el árbol temblando.",
      "El *Haṭha Yoga Pradīpikā* lo dice sin rodeos: **cuando la respiración se mueve, la mente se mueve; cuando la respiración se aquieta, la mente se aquieta.**",
      "Y la primera frase de Patañjali define el yoga entero como *citta-vṛtti-nirodhaḥ*: aquietar los remolinos de la mente. No vaciarla — **dejar de ser arrastrada por ella**.",
    ],
    foto: "",
  },
  {
    titulo: "Por qué importa meditar",
    parrafos: [
      "Meditar no es dejar de pensar. Es darte cuenta de que estás pensando — y poder elegir si sigues ese pensamiento o lo dejas pasar. Ese hueco entre lo que te ocurre y cómo reaccionas es, literalmente, todo lo que tienes.",
      "Lo que se entrena ahí:",
    ],
    items: [
      "**Atención**: sostenerla donde tú decides, no donde te tiran.",
      "**Interocepción**: enterarte de lo que pasa dentro de ti *antes* de que grite.",
      "**Reactividad**: el espacio entre el estímulo y tu respuesta se ensancha.",
      "**Descanso**: el sueño mejora cuando el sistema nervioso aprende a bajar de marcha a voluntad.",
    ],
    cierre: "No hace falta que sea media hora. **Cinco minutos todos los días valen más que una hora los domingos**, porque lo que estás construyendo es un hábito del sistema nervioso, no una hazaña.",
    foto: "",
  },
  {
    titulo: "Antes de empezar",
    parrafos: [
      "Cuatro cosas que evitan el 90% de los problemas:",
    ],
    items: [
      "**Con el estómago vacío**, o al menos dos horas después de comer.",
      "**Sentada y con la columna larga** — en una silla vale. Si te tumbas, te dormirás; y dormir no es meditar.",
      "**Por la nariz**, salvo que la técnica diga otra cosa. La nariz filtra, calienta y humedece; la boca no.",
      "**Sin forzar nunca**. Si te falta el aire, te mareas o te agobias, sueltas la técnica y vuelves a tu respiración normal. El prāṇāyāma no se gana apretando.",
    ],
    cierre: "Si estás embarazada, tienes la tensión alta, glaucoma, epilepsia o un problema cardíaco, **evita las retenciones y las respiraciones rápidas** y quédate con las suaves. Ante la duda, pregunta a tu médica.",
    foto: "",
  },
];

// ── La práctica, distinta para cada doṣha ────────────────────────────────
// Vata se calma, Pitta se refresca, Kapha se enciende. La misma lógica que
// el resto del recorrido: lo semejante aumenta lo semejante, lo contrario
// equilibra.

export const PRANAYAMA_PRACTICA: Record<DoshaKey, PracticaPranayama> = {
  vata: {
    nombre: "Nāḍī Śodhana",
    traduccion: "Respiración alterna — «limpieza de los canales»",
    porQue: [
      "Vata es aire y éter: móvil, rápido, frío, irregular. Cuando se desequilibra, la respiración se vuelve corta y entrecortada, y la mente salta de rama en rama.",
      "La respiración alterna hace justo lo contrario: **impone un ritmo**. Alternar las fosas equilibra los dos lados y da a una mente dispersa algo simple y regular a lo que agarrarse.",
      "*Para ti la clave es la regularidad, no la intensidad.*",
    ],
    pasos: [
      "Siéntate con la espalda larga y suelta los hombros.",
      "Mano derecha en **Viṣṇu mudrā**: índice y corazón doblados hacia la palma; el pulgar tapará la fosa derecha y el anular la izquierda.",
      "Tapa la derecha con el pulgar e **inhala por la izquierda**.",
      "Tapa las dos un instante, sin apretar.",
      "Suelta la derecha y **exhala por la derecha**, despacio y largo.",
      "Inhala por la derecha, retén un instante y exhala por la izquierda. **Eso es un ciclo.**",
    ],
    precaucion: "Si estás muy congestionada, hazlo solo mental: imagina el aire entrando por una fosa y saliendo por la otra, sin tocarte la nariz.",
    ciclos: 6,
    fases: [
      { tipo: "inhala",  texto: "Inhala por la fosa izquierda", segundos: 4 },
      { tipo: "reten",   texto: "Retén, suave",                 segundos: 2 },
      { tipo: "exhala",  texto: "Exhala por la derecha",        segundos: 6 },
      { tipo: "inhala",  texto: "Inhala por la fosa derecha",   segundos: 4 },
      { tipo: "reten",   texto: "Retén, suave",                 segundos: 2 },
      { tipo: "exhala",  texto: "Exhala por la izquierda",      segundos: 6 },
    ],
    foto: "",
  },
  pitta: {
    nombre: "Śītalī",
    traduccion: "Respiración refrescante — «la que enfría»",
    porQue: [
      "Pitta es fuego y agua: caliente, agudo, penetrante. Cuando se desequilibra aparecen la irritabilidad, la prisa, la acidez y esa sensación de estar ardiendo por dentro.",
      "Śītalī es de las poquísimas técnicas que **enfrían de verdad**: el aire entra por la lengua húmeda y llega templado, y la exhalación por la nariz baja la temperatura interna.",
      "*Para ti la clave es no convertir la práctica en una competición. No hay nota.*",
    ],
    pasos: [
      "Siéntate cómoda, con la espalda larga y la mandíbula suelta.",
      "Saca un poco la lengua y **enróllala como un canalito**. Si no puedes enrollarla (es genético), aprieta los dientes con suavidad y sonríe: eso es *Śītkārī* y sirve igual.",
      "**Inhala por la lengua**, como si sorbieras el aire. Notarás el frescor.",
      "Mete la lengua, cierra la boca y retén un instante.",
      "**Exhala por la nariz**, despacio. Eso es un ciclo.",
    ],
    precaucion: "No la hagas con frío, resfriada ni con tos: enfría de verdad. En invierno, cámbiala por una respiración diafragmática lenta.",
    ciclos: 8,
    fases: [
      { tipo: "inhala", texto: "Inhala por la lengua enrollada", segundos: 4 },
      { tipo: "reten",  texto: "Retén, sin apretar",             segundos: 2 },
      { tipo: "exhala", texto: "Exhala por la nariz, largo",     segundos: 6 },
    ],
    foto: "",
  },
  kapha: {
    nombre: "Bhastrikā",
    traduccion: "Respiración de fuelle — «la que enciende»",
    porQue: [
      "Kapha es tierra y agua: pesado, lento, húmedo, estable. Cuando se desequilibra aparecen la niebla mental, la congestión y esa inercia de no arrancar.",
      "Bhastrikā es un fuelle: **mueve, calienta y despeja**. Es la única de las tres que sube la energía en vez de bajarla, y es exactamente lo que Kapha necesita por la mañana.",
      "*Para ti la clave es empezar. Una vez que arrancas, sostienes mejor que nadie.*",
    ],
    pasos: [
      "Siéntate con la espalda recta y las manos en las rodillas.",
      "Inhala y exhala por la nariz **con fuerza y al mismo ritmo**, aproximadamente una respiración por segundo, moviendo el vientre como un fuelle.",
      "Es un movimiento del abdomen, no de los hombros: si se te suben los hombros, baja el ritmo.",
      "Al terminar la ronda, **vuelve a tu respiración normal** y quédate quieta notando el cuerpo. Ahí es donde pasa lo interesante.",
      "Tres rondas, con su descanso entre medias.",
    ],
    precaucion: "No la hagas embarazada, con la tensión alta, con problemas de corazón, glaucoma, epilepsia ni con la regla. Si te mareas, para y respira normal: es señal de que ibas demasiado rápido.",
    ciclos: 3,
    fases: [
      { tipo: "rapida",    texto: "Fuelle: respira rápido por la nariz", segundos: 15 },
      { tipo: "descanso",  texto: "Suelta. Respira normal y observa",    segundos: 20 },
    ],
    foto: "",
  },
};

export const PRANAYAMA_REFLEXION = {
  titulo: "Después de respirar",
  pregunta: "¿Qué ha cambiado en ti desde que empezaste hasta ahora?",
  nota: "No busques la respuesta bonita. Vale «nada», vale «me he aburrido» y vale «me han entrado ganas de llorar». Todo es información.",
  compromisoTitulo: "Tu momento",
  compromisoIntro: "La práctica que se hace es la que tiene un hueco fijo. Elige el tuyo:",
  compromisos: [
    "Nada más despertarme, antes de coger el móvil",
    "A media mañana, para cortar la inercia",
    "Antes de comer, para llegar a la mesa entera",
    "Al terminar de trabajar, para cerrar el día",
    "Antes de dormir, en la cama",
  ],
};

export const PRANAYAMA_CIERRE = [
  "Empieza por cinco minutos. Mañana otros cinco.",
  "*Lo que estás entrenando no es la respiración: es la capacidad de volver.*",
];
