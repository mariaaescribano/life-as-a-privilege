// ─────────────────────────────────────────────────────────────────────────
// Cómic «¿Por qué existe Life as a Privilege?» (página pública /elMetodo).
//
// No es un cómic de recorrido (nada de ComicViewer a pantalla completa): son
// once viñetas que se pasan DENTRO de un box de la propia página, y AL LADO se
// va armando el mapa: cada viñeta de disciplina coloca su círculo en el anillo
// y en la última los ocho se unen. Lo pintan ComicPorQueExiste.tsx (el box del
// cómic) y MapaSeArma.tsx (el box del mapa). El nombre de ESTE archivo no puede
// ser el mismo que el del componente: en Windows dos rutas que solo difieren en
// mayúsculas rompen tsc.
//
// ── CÓMO SUBIR UNA ACUARELA ──────────────────────────────────────────────
// Se deja el PNG en `frontend/public/viñetas/elMapa/` con el NOMBRE EXACTO que
// ya tiene escrito su viñeta aquí abajo (en el `src`), y aparece sola. No hay
// que tocar código: todas las viñetas tienen su ruta puesta de antemano, y
// mientras el archivo no exista el box enseña un hueco elegante (el mandala
// latiendo, sin avisos de «próximamente») y el texto se lee igual.
//
// Pendientes ahora mismo: comicinicioayurveda, comiciniciocabala,
// comiciniciocultura, comiciniciodescubrimiento, comiciniciofinal.
//
// Las acuarelas van CUADRADAS (las que ya hay son 1254×1254). Si se sube una que
// no lo sea, el box la recorta por arriba y por abajo para llenar el cuadrado.
// ─────────────────────────────────────────────────────────────────────────

import {
  astrologiaNom,
  ayurvedaNom,
  cabalaNom,
  culturaNom,
  fisiologiaNom,
  neuropsicologiaNom,
  nutricionNom,
  tcmNom,
} from "../../GlobalVariables";

export interface VinetaMapa {
  /** Ilustración CUADRADA. Sin `src` = foto pendiente (sale el hueco con aviso). */
  src?: string;
  /** Rótulo del paso; va pequeño, en mayúsculas, sobre el texto. */
  titulo: string;
  /** Frases que se pintan sobre la foto, abajo. Cada una, su propio bloque. */
  lineas: string[];
  /** Disciplina que esta viñeta COLOCA en el mapa de al lado (el `*Nom` de
   *  GlobalVariables). Al pasar la viñeta, su círculo aterriza en su sitio del
   *  anillo y ya no se va. Las viñetas de narración (el comienzo, el
   *  descubrimiento, el cierre) no colocan ninguna. */
  disciplina?: string;
  /** Viñeta de CIERRE: al llegar a ella, los ocho círculos se unen con sus
   *  senderos y el mandala del centro se enciende. El mapa está completo. */
  cierre?: boolean;
}

const P = "/viñetas/elMapa";

export const COMIC_POR_QUE_EXISTE: VinetaMapa[] = [
  {
    src: `${P}/comicinicioinicio.webp`,
    titulo: "El comienzo",
    lineas: [
      "No entiendo qué me pasa.",
      "Creo que necesito ayuda.",
    ],
  },
  // ── LAS OCHO DISCIPLINAS, EN EL ORDEN DEL RECORRIDO ──
  // El mismo orden que las ocho tarjetas de /elMetodo y que el anillo del mapa
  // (MapaSeArma): Astrología → Psicología → Ayurveda → Medicina China →
  // Fisiología → Nutrición → Cábala → Cultura. Si aquí se cambia el orden, el
  // mapa se rellena a saltos y el usuario no entiende el recorrido: este orden
  // manda.
  {
    src: `${P}/comicinicioastro.webp`,
    titulo: "Astrología",
    disciplina: astrologiaNom,
    lineas: [
      "¿Y si muchos de mis patrones siempre hubieran estado ahí?",
      "Empiezo a verme con otros ojos.",
    ],
  },
  {
    src: `${P}/comiciniciopsico.webp`,
    titulo: "Psicología",
    disciplina: neuropsicologiaNom,
    lineas: [
      "Ahora comprendo muchas cosas de mi historia.",
      "Pero siento que todavía falta una pieza.",
    ],
  },
  {
    src: `${P}/comicinicioayurveda.webp`,
    titulo: "Ayurveda",
    disciplina: ayurvedaNom,
    lineas: [
      "Quizá el equilibrio no consiste en hacer lo mismo que todos.",
      "Quizá consiste en comprender mi propia naturaleza.",
    ],
  },
  {
    src: `${P}/comiciniciotcm.webp`,
    titulo: "Medicina Tradicional China",
    disciplina: tcmNom,
    lineas: [
      "Las emociones, el cuerpo y la energía no están separados.",
      "Empiezo a ver cómo ciertas mis emociones y hábitos me desequilibraban.",
    ],
  },
  {
    src: `${P}/comiciniciofisio.webp`,
    titulo: "Fisiología",
    disciplina: fisiologiaNom,
    lineas: [
      "Nunca imaginé lo extraordinario que era mi cuerpo.",
      "Comprender cómo funciona también es una forma de comprenderme.",
    ],
  },
  {
    src: `${P}/comicinicionutri.webp`,
    titulo: "Nutrición",
    disciplina: nutricionNom,
    lineas: [
      "Mi cuerpo también estaba intentando hablar conmigo.",
      "No todo dependía de mi fuerza de voluntad.",
    ],
  },
  {
    src: `${P}/comiciniciocabala.webp`,
    titulo: "Cábala",
    disciplina: cabalaNom,
    lineas: [
      "Después de comprender mi mente y mi cuerpo...",
      "Empiezo a preguntarme quién quiero llegar a ser.",
    ],
  },
  {
    // ── VIÑETA NUEVA ──
    // El mapa tiene OCHO disciplinas y el guion solo contaba siete: faltaba
    // Cultura e Historia, así que el anillo del mapa nunca llegaba a cerrarse.
    // TEXTO PROVISIONAL: está escrito para que el mapa funcione desde ya, pero
    // es tu voz la que tiene que contarlo — reescríbelo cuando quieras (y la
    // acuarela, cuando la tengas, va en el `src`).
    src: `${P}/comiciniciocultura.webp`,
    titulo: "Cultura e Historia",
    disciplina: culturaNom,
    lineas: [
      "Y entendí que nada de esto lo había inventado yo.",
      "Llevamos siglos preguntándonos lo mismo, en cada historia, con otras palabras.",
    ],
  },
  {
    src: `${P}/comiciniciodescubrimiento.webp`,
    titulo: "El descubrimiento",
    lineas: [
      "Entonces lo entendí.",
      "Ninguna disciplina estaba equivocada.",
      "Simplemente todas estaban observando a la misma persona.",
    ],
  },
  {
    // Viñeta de CIERRE: aquí el mapa de al lado se une.
    src: `${P}/comiciniciofinal.webp`,
    titulo: "Life as a Privilege",
    cierre: true,
    lineas: [
      "Durante siglos hemos acumulado conocimiento sobre el ser humano.",
      "Ese conocimiento ha permanecido disperso entre disciplinas que rara vez dialogan entre sí.",
      "Life as a Privilege nace para reconstruir ese mapa y ponerlo al servicio de tu comprensión.",
    ],
  },
];
