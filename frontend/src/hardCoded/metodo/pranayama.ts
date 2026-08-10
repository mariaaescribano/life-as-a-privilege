// ─────────────────────────────────────────────────────────────────────────
// PRĀṆĀYĀMA · contenido de la página. Ya NO forma parte del submapa de un
// doṣha: se llega desde las tarjetas de los tres Doṣhas.
//
// LOS TRES DOṢHAS ESTÁN EN LA MISMA PÁGINA. Debajo del header hay tres
// botones (Vata · Pitta · Kapha) y se cambia de uno a otro cuando se quiera:
// la página NO es de un doṣha concreto aunque la URL traiga uno (ese solo
// decide con cuál se entra). Lo escrito de cada doṣha se guarda por separado
// en `doshaPranayama[dosha]`, así que ir y volver no pierde nada.
//
// QUÉ ES IMPARCIAL Y QUÉ NO. La teoría y los cuidados son iguales para los
// tres doṣhas, así que NO están aquí: se cuentan en el cómic de tres viñetas
// (components/metodo/comicPranayama.ts) que sale al entrar en la página. Lo
// que cambia de un doṣha a otro es su bloque: UNA práctica, su escrito y sus
// preguntas.
//
// La página es de PRACTICAR, no de leer: el texto se mantiene corto a
// propósito. Si hace falta contar teoría larga (los cinco vāyus, el nervio
// vago, Patañjali…), va en un cómic, no aquí.
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
  /** Lo que se le dice a ESTE doṣha justo después de respirar. Dos frases: la
   *  página es de practicar. */
  escrito: string[];
  /** Sus preguntas, cada una con su propio hueco para escribir. Van después
   *  del ejercicio y son distintas para cada doṣha. */
  preguntas: string[];
}

// ── Una práctica por doṣha ───────────────────────────────────────────────
// Vata se calma, Pitta se refresca, Kapha se enciende. La misma lógica que el
// resto del recorrido: lo semejante aumenta lo semejante, lo contrario equilibra.
// En la página se ve la del doṣha SELECCIONADO en los botones, con su escrito
// y sus preguntas; pulsando otro botón se ve la de ese, sin salir de la página.

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
    escrito: [
      "Vata no se calma con fuerza, se calma con ritmo. Lo que acabas de darle a tu mente no es silencio: es un compás al que volver cuando se disperse.",
      "Por eso esta práctica funciona mejor a la misma hora que ayer que muy largo un solo día.",
    ],
    preguntas: [
      "¿En qué momento has notado que la mente se te iba? ¿Adónde se fue?",
      "¿Qué se te ha quedado más quieto al terminar: el cuerpo, la cabeza o ninguno de los dos?",
    ],
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
    escrito: [
      "Pitta no necesita entender mejor: necesita bajar la temperatura. Acabas de hacer algo que no se puede hacer con esfuerzo, y ese es justo el punto.",
      "Si te has descubierto queriendo hacerlo bien, esa prisa por la nota también es Pitta.",
    ],
    preguntas: [
      "¿Dónde tenías el calor antes de empezar: en la cabeza, en el pecho, en el estómago, en la mandíbula?",
      "¿Qué te ha costado más, el frescor de la inhalación o soltar el control de la exhalación?",
    ],
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
    escrito: [
      "Kapha no arranca por convencimiento, arranca por movimiento. Lo interesante de Bhastrikā no es el fuelle: es el silencio de después, cuando el cuerpo sigue encendido y ya no hace nada.",
      "Ahí es donde se nota que la pesadez no eras tú.",
    ],
    preguntas: [
      "¿Qué te ha dado más pereza: empezar o volver a empezar la segunda ronda?",
      "¿Cómo estaba tu cuerpo en el descanso, cuando ya no había que hacer nada?",
    ],
  },
};

/** Lo imparcial de después: el hueco fijo. Las preguntas ya no viven aquí —
 *  cada doṣha tiene las suyas en PRANAYAMA_PRACTICA. */
export const PRANAYAMA_REFLEXION = {
  titulo: "Después de respirar",
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
