// ─────────────────────────────────────────────────────────────────────────
// TAOÍSMO · las «leyes» del Tao (paso 7 del recorrido de Medicina China)
//
// La Medicina China no es una técnica suelta: nace de una forma de mirar. Este
// paso recoge esa mirada en diez leyes —no mandamientos, sino regularidades de
// la naturaleza— y baja cada una al cuerpo, que es donde la medicina las usa.
//
// FORMATO: cada principio son sus `parrafos`, los que necesite (hay de dos y de
// cuatro). En la página NO se leen: allí las leyes salen de dos en dos, con su
// ilustración arriba y, debajo en una línea, el carácter chino, el nombre y el
// botón «Ver». El texto vive en el visor, con la ilustración al lado.
//
// ✍️  EDITAR CONTENIDO: cambia los textos aquí. No cambies las `key` (son la
//     clave de React y el nombre del archivo de la foto).
// ─────────────────────────────────────────────────────────────────────────
import type { Vineta } from "./ComicViewer";

export interface LeyTao {
  /** Clave estable. Es también el nombre de su foto: /recorrido/tcm/taoismo/<key>.webp */
  key: string;
  /** Nombre en castellano. */
  nombre: string;
  /** Nombre en pinyin: «Tao», «Wu Wei»… */
  pinyin: string;
  /** Carácter chino. */
  hanzi: string;
  /** El texto del principio, un párrafo por elemento. Los hay de dos y de
   *  cuatro: cada principio se explica en lo que necesita, ni una frase más.
   *  Se leen en el visor (LEYES_TAO_VINETAS), uno debajo de otro. */
  parrafos: string[];
}

/** Intro de la página (bajo el header). */
export const TAOISMO_INTRO: string[] = [
  "El taoísmo no es una religión: es una forma de mirar. Lao-Tse llamó Tao al «camino», el orden natural que rige todo lo que existe. De esa mirada nace lo que ya has recorrido: el Qi que nos une, el Yin y el Yang que se equilibran, los cinco elementos que se generan y se controlan.",
  "No son normas que haya que obedecer, sino cómo funciona la naturaleza. Puedes ignorarlas, igual que puedes ignorar la gravedad: la diferencia la paga tu cuerpo.",
];

/** Cierre de la página. */
export const TAOISMO_CIERRE = {
  texto:
    "El taoísmo no te pide ser mejor que ayer, sino dejar de ir en contra de ti. La salud, desde esta mirada, no es un premio: es lo que ocurre cuando dejas de estorbarte.",
  cita: "«El hombre sigue a la tierra, la tierra sigue al cielo, el cielo sigue al Tao, y el Tao se sigue a sí mismo.»",
  autor: "— Lao-Tse, Tao Te King",
};

/**
 * Ilustración de cada ley: CUADRADA (1:1) y en WebP (las sube en PNG y se pasan
 * con `node scripts/webp/convertir.mjs --lote=9`). Se ve en DOS sitios: entera
 * dentro del visor, y recortada a una banda 4:3 arriba de su box en la página.
 * Si el archivo no existe todavía, el visor avisa con su «próximamente» y el
 * texto se lee igual.
 */
export const FOTO_LEY = (key: string) => `/recorrido/tcm/taoismo/${key}.webp`;

// ─────────────────────────────────────────────────────────────────────────
// LAS DIEZ LEYES
// ─────────────────────────────────────────────────────────────────────────
export const LEYES_TAO: LeyTao[] = [
  {
    key: "tao",
    nombre: "El camino",
    pinyin: "Tao",
    hanzi: "道",
    parrafos: [
      "El Tao es el orden profundo de la naturaleza: no una figura que manda, premia o castiga, sino la forma en que la Vida se mueve.",
      "No todos estamos hechos para el mismo ritmo. Eres un pequeño universo dentro de otro mucho mayor, y tu salud depende, en parte, de aprender a reconocer tu propio ciclo.",
    ],
  },
  {
    key: "yin-yang",
    nombre: "Los opuestos que se necesitan",
    pinyin: "Yin Yang",
    hanzi: "陰陽",
    parrafos: [
      "Yin y Yang no son enemigos. Son dos movimientos complementarios que se necesitan para que la Vida pueda tener una manifestación tangible.",
      "Yang expresa calor, movimiento, expansión y actividad. Yin expresa frío, quietud, interiorización y nutrición. Ninguno es absoluto: en el Yin existe Yang y en el Yang existe Yin.",
      "La medicina china observa constantemente estas relaciones: calor y frío, exceso y vacío, actividad y reposo. La salud no consiste en eliminar uno de los dos, sino en permitir que se regulen entre sí.",
    ],
  },
  {
    key: "wu-wei",
    nombre: "No forzar",
    pinyin: "Wu Wei",
    hanzi: "無為",
    parrafos: [
      "Wu Wei significa aceptar que los procesos tienen su tiempo más allá de nuestro deseo y de nuestro conocimiento.",
      "Una semilla necesita agua, tierra y tiempo. Si tiras de ella para que crezca más rápido, la destruyes.",
    ],
  },
  {
    key: "ziran",
    nombre: "Ser lo que eres",
    pinyin: "Ziran",
    hanzi: "自然",
    parrafos: [
      "Ziran significa, literalmente, algo que ocurre «por sí mismo»: aquello que sigue su propia naturaleza.",
      "La salud comienza cuando dejamos de obligarnos a funcionar como algo que no somos. El cuerpo tiene sus propias señales, ritmos y necesidades.",
    ],
  },
  {
    key: "fan",
    nombre: "El retorno",
    pinyin: "Fan",
    hanzi: "反",
    parrafos: [
      "Cuando algo llega a su extremo, comienza a transformarse en su contrario.",
      "La expansión termina dando paso a la contracción. La plenitud abre espacio al vacío. El frío extremo puede terminar generando calor.",
      "La naturaleza se mueve en ciclos, no en líneas rectas. Por eso, muchas veces el desequilibrio y la enfermedad no aparecen de repente: llevan mucho tiempo avisando.",
    ],
  },
  {
    key: "de",
    nombre: "La virtud",
    pinyin: "De",
    hanzi: "德",
    parrafos: [
      "La cualidad propia que aparece cuando cada ser expresa plenamente su naturaleza.",
      "El árbol no necesita esforzarse para ser árbol. El agua no necesita demostrar que sabe fluir.",
      "Quizá la salud no consista siempre en añadir algo más, sino en retirar aquello que impide que el organismo haga lo que ya sabe hacer.",
    ],
  },
  {
    key: "pu",
    nombre: "La simplicidad",
    pinyin: "Pu",
    hanzi: "樸",
    parrafos: [
      "Pu es la madera antes de ser tallada: aquello que todavía conserva su sencillez y sus posibilidades.",
      "A veces acumulamos tanto —objetos, reglas, estímulos, obligaciones e ideas sobre cómo deberíamos vivir— que terminamos alejándonos de lo esencial.",
      "Seguir el Tao también puede ser un ejercicio de quitar. Menos ruido. Menos exceso. Más espacio para percibir lo que realmente necesitamos.",
      "La sencillez no es pobreza: es volver a lo esencial.",
    ],
  },
  {
    key: "xu",
    nombre: "El vacío que permite",
    pinyin: "Xu",
    hanzi: "虛",
    parrafos: [
      "Lo más valioso de una vasija no es la arcilla, sino el espacio que queda dentro.",
      "El vacío no es ausencia inútil. Es lo que permite que algo pueda ser habitado, utilizado y transformado.",
      "También el cuerpo necesita espacio: entre una actividad y otra, entre una comida y la siguiente, entre el esfuerzo y el descanso. Cuando llenamos cada momento, dejamos de tener espacio para recuperarnos, digerir, integrar y simplemente respirar.",
    ],
  },
  {
    key: "qi",
    nombre: "La energía que conecta",
    pinyin: "Qi",
    hanzi: "氣",
    parrafos: [
      "Qi es el movimiento vital que atraviesa y relaciona todas las cosas.",
      "En la visión china, somos parte del mundo que nos rodea. No somos seres individuales, sino una extensión del Tao.",
      "Por eso cuidar de uno mismo no significa aislarse del mundo. Significa comprender que formamos parte de él.",
      "Respiración, alimentación, movimiento, descanso y entorno participan juntos en la manera en que circula nuestra vitalidad.",
    ],
  },
  {
    key: "bu-zheng",
    nombre: "No luchar contra todo",
    pinyin: "Bu Zheng",
    hanzi: "不爭",
    parrafos: [
      "El agua no necesita enfrentarse a la piedra para transformarla. Continúa su camino, encuentra otra dirección y, con el tiempo, cambia lo que parecía imposible de mover.",
      "Bu Zheng no significa rendirse. Significa dejar de desperdiciar fuerza en luchas que no necesitan ser luchadas.",
      "Hay una fuerza distinta en quien no necesita demostrar constantemente su posición. En lugar de competir con todo lo que aparece delante, conserva su energía para aquello que realmente importa.",
    ],
  },
];

export const TAOISMO_TOTAL = LEYES_TAO.length;

/** Las diez leyes EN FORMATO CÓMIC: la ilustración a la izquierda y su
 *  explicación al lado. Es lo que abre el botón «Ver» de cada box de la página;
 *  desde dentro se pasa de una ley a otra con las flechas del visor.
 *
 *  Se genera de LEYES_TAO: las leyes se editan en un solo sitio y aquí no hay
 *  texto que se pueda quedar desincronizado. */
export const LEYES_TAO_VINETAS: Vineta[] = LEYES_TAO.map((ley, i) => ({
  src: FOTO_LEY(ley.key),
  eyebrow: `${i + 1} · ${ley.hanzi} · ${ley.pinyin}`,
  titulo: ley.nombre,
  paragraphs: ley.parrafos,
}));
