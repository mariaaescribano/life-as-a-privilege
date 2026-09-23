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
// LA PÁGINA ES SENCILLA, a propósito: cuatro cajas y ninguna más.
//   1. un `resumen` de 3-4 líneas (qué vas a hacer y por qué),
//   2. el guía con el botón de empezar (+ su `precaucion`),
//   3. sus `preguntas`, una caja de escribir por pregunta,
//   4. el cierre, que lleva a los chakras.
//
// NADA DE NOMBRES QUE NO HAGAN FALTA. Los sánscritos (Nāḍī Śodhana, Śītalī,
// Bhastrikā, Viṣṇu mudrā…) y la teoría se cuentan en el cómic que sale al
// entrar (components/metodo/comicPranayama.ts), no en la página: aquí solo se
// respira. Si hace falta contar más, va en el cómic.
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
  /** La explicación entera: 3-4 líneas y ni una más. Qué vas a hacer, cómo se
   *  hace y por qué a este doṣha le viene bien. Sin nombres sánscritos. */
  resumen: string[];
  /** Cuidado con… Una línea, debajo del botón de empezar. */
  precaucion: string;
  /** Ciclos que propone el guía. */
  ciclos: number;
  fases: FasePranayama[];
  foto?: string;
  /** Sus preguntas, cada una con su propio hueco para escribir. Van después
   *  del ejercicio y son distintas para cada doṣha. */
  preguntas: string[];
}

// ── Una práctica por doṣha ───────────────────────────────────────────────
// Vata se calma, Pitta se refresca, Kapha se enciende. La misma lógica que el
// resto del recorrido: lo semejante aumenta lo semejante, lo contrario equilibra.
// En la página se ve la del doṣha SELECCIONADO en los botones, con sus
// preguntas; pulsando otro botón se ve la de ese, sin salir de la página.

export const PRANAYAMA_PRACTICA: Record<DoshaKey, PracticaPranayama> = {
  vata: {
    resumen: [
      "Vas a respirar alternando las fosas nasales: el aire entra por una y sale por la otra.",
      "Tapa la derecha con el pulgar y la izquierda con el anular, y ve cambiando.",
      "Vata es rápido y disperso: lo que le sienta bien no es el silencio, es un ritmo al que agarrarse.",
      "Sigue el círculo: te marca cuándo entra el aire y cuándo sale.",
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
    preguntas: [
      "¿En qué momento has notado que la mente se te iba? ¿Adónde se fue?",
      "¿Qué se te ha quedado más quieto al terminar: el cuerpo, la cabeza o ninguno de los dos?",
    ],
  },
  pitta: {
    resumen: [
      "Vas a inhalar por la boca, con la lengua enrollada como un canalito, y exhalar por la nariz.",
      "Si no puedes enrollarla, aprieta los dientes y sonríe: funciona igual.",
      "Pitta es calor, y esta es de las poquísimas respiraciones que enfrían de verdad.",
      "Sigue el círculo: te marca cuándo entra el aire y cuándo sale.",
    ],
    precaucion: "No la hagas con frío, resfriada ni con tos: enfría de verdad. En invierno, cámbiala por una respiración lenta por la nariz.",
    ciclos: 8,
    fases: [
      { tipo: "inhala", texto: "Inhala por la lengua enrollada", segundos: 4 },
      { tipo: "reten",  texto: "Retén, sin apretar",             segundos: 2 },
      { tipo: "exhala", texto: "Exhala por la nariz, largo",     segundos: 6 },
    ],
    foto: "",
    preguntas: [
      "¿Dónde tenías el calor antes de empezar: en la cabeza, en el pecho, en el estómago, en la mandíbula?",
      "¿Qué te ha costado más, el frescor de la inhalación o soltar el control de la exhalación?",
    ],
  },
  kapha: {
    resumen: [
      "Vas a respirar rápido por la nariz, con fuerza, moviendo el vientre como un fuelle.",
      "Trabaja el abdomen, no los hombros: si se te suben, baja el ritmo.",
      "Kapha es pesado y lento, y esto lo mueve, lo calienta y lo despeja.",
      "Después de cada ronda vuelves a tu respiración normal: ahí es donde pasa lo interesante.",
    ],
    precaucion: "No la hagas embarazada, con la tensión alta, con problemas de corazón, glaucoma, epilepsia ni con la regla. Si te mareas, para: ibas demasiado rápido.",
    ciclos: 3,
    fases: [
      { tipo: "rapida",    texto: "Fuelle: respira rápido por la nariz", segundos: 15 },
      { tipo: "descanso",  texto: "Suelta. Respira normal y observa",    segundos: 20 },
    ],
    foto: "",
    preguntas: [
      "¿Qué te ha dado más pereza: empezar o volver a empezar la segunda ronda?",
      "¿Cómo estaba tu cuerpo en el descanso, cuando ya no había que hacer nada?",
    ],
  },
};

/** Lo imparcial de después: solo el título del box de preguntas. Las preguntas
 *  son de cada doṣha y viven en PRANAYAMA_PRACTICA. */
export const PRANAYAMA_REFLEXION = {
  titulo: "Después de respirar",
};

export const PRANAYAMA_CIERRE = [
  "Empieza por cinco minutos. Mañana otros cinco.",
  "*Lo que estás entrenando no es la respiración: es la capacidad de volver.*",
];
