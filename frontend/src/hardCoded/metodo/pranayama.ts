// ─────────────────────────────────────────────────────────────────────────
// PRĀṆĀYĀMA · contenido de la página. Ya NO forma parte del submapa de un
// doṣha: se llega desde las tarjetas de los tres Doṣhas y se muestran las TRES
// prácticas en la misma página (se elige con las pestañas de arriba).
//
// La página es de PRACTICAR, no de leer: el texto se mantiene corto a propósito.
// Si en algún momento hace falta contar la teoría larga (los cinco vāyus, el
// nervio vago, Patañjali…), va en un cómic de las Ilustraciones, no aquí.
//
// Las fotos son OPCIONALES: mientras el campo `foto` esté vacío no se pinta
// imagen. Cuando subas las tuyas a /img/ayurveda/pranayama/, rellena la ruta.
// ─────────────────────────────────────────────────────────────────────────
import type { DoshaKey } from "./doshaIntro";

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
  /** Una sola frase: por qué esta técnica para este doṣha. */
  porQue: string;
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
    "**Prāṇa** es la energía vital; **āyāma**, extender. Prāṇāyāma no es «respirar hondo»: es dirigir esa energía.",
    "Respirar es la única función automática que también puedes gobernar a voluntad. Por eso es la puerta más directa que tienes al sistema nervioso.",
  ],
  foto: "",
};

/** Lo único que hay que saber antes de practicar. Cuatro líneas, no cinco
 *  secciones: lo demás se aprende respirando. */
export const PRANAYAMA_ESENCIAL = {
  titulo: "Antes de empezar",
  items: [
    "**El freno está en la salida.** Al inhalar el corazón se acelera; al exhalar, se frena. Si te llevas una sola cosa: alarga la exhalación.",
    "**Sentada y con el estómago vacío**, o dos horas después de comer. Tumbada te dormirás, y dormir no es meditar.",
    "**Por la nariz**, salvo que la técnica diga otra cosa.",
    "**Sin forzar nunca.** Si te falta el aire o te mareas, sueltas y vuelves a tu respiración normal.",
  ],
  aviso: "Si estás embarazada, tienes la tensión alta, glaucoma, epilepsia o un problema cardíaco, evita las retenciones y las respiraciones rápidas. Ante la duda, pregunta a tu médica.",
  foto: "",
};

// ── Las tres prácticas ───────────────────────────────────────────────────
// Vata se calma, Pitta se refresca, Kapha se enciende. La misma lógica que el
// resto del recorrido: lo semejante aumenta lo semejante, lo contrario equilibra.
// Se muestran las tres en la página; se empieza por la del doṣha de la URL.

export const PRANAYAMA_PRACTICA: Record<DoshaKey, PracticaPranayama> = {
  vata: {
    nombre: "Nāḍī Śodhana",
    traduccion: "Respiración alterna — «limpieza de los canales»",
    porQue: "Vata es móvil, rápido e irregular. Alternar las fosas **impone un ritmo**: le da a una mente dispersa algo simple y regular a lo que agarrarse.",
    pasos: [
      "Espalda larga, hombros sueltos.",
      "Mano derecha en **Viṣṇu mudrā**: el pulgar tapa la fosa derecha y el anular la izquierda.",
      "Tapa la derecha e **inhala por la izquierda**. Tapa las dos un instante.",
      "Suelta la derecha y **exhala por la derecha**, largo.",
      "Inhala por la derecha, retén y exhala por la izquierda. **Eso es un ciclo.**",
    ],
    precaucion: "Si estás muy congestionada, hazlo solo mental: imagina el aire entrando por una fosa y saliendo por la otra.",
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
    porQue: "Pitta es fuego: caliente y agudo. Śītalī es de las poquísimas técnicas que **enfrían de verdad** — el aire entra por la lengua húmeda y llega templado.",
    pasos: [
      "Espalda larga, mandíbula suelta.",
      "Saca un poco la lengua y **enróllala como un canalito**. Si no puedes (es genético), aprieta los dientes y sonríe: eso es *Śītkārī* y sirve igual.",
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
    porQue: "Kapha es pesado y lento. Bhastrikā es un fuelle: **mueve, calienta y despeja**. La única de las tres que sube la energía en vez de bajarla.",
    pasos: [
      "Espalda recta, manos en las rodillas.",
      "Inhala y exhala por la nariz **con fuerza y al mismo ritmo**, una respiración por segundo, moviendo el vientre como un fuelle.",
      "Es el abdomen, no los hombros: si se te suben, baja el ritmo.",
      "Al terminar la ronda, **vuelve a tu respiración normal** y quédate quieta. Ahí es donde pasa lo interesante.",
    ],
    precaucion: "No la hagas embarazada, con la tensión alta, con problemas de corazón, glaucoma, epilepsia ni con la regla. Si te mareas, para: ibas demasiado rápido.",
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
  nota: "Vale «nada», vale «me he aburrido» y vale «me han entrado ganas de llorar». Todo es información.",
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
