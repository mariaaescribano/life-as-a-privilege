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
// ── CÓMO CAMBIAR UNA ACUARELA ────────────────────────────────────────────
// Las once están subidas y convertidas a WebP (lote 4 de scripts/webp), y las
// rutas de aquí abajo apuntan ya a los `.webp`. Para sustituir una:
//   1. Deja el PNG nuevo en `frontend/public/viñetas/elMapa/`.
//   2. Pasa la carpeta por el conversor (un lote nuevo en convertir.mjs), que
//      escribe el WebP y borra el PNG. Si se deja en PNG NO se ve: la ruta del
//      código pide `.webp`.
// Mientras un archivo no exista, el box enseña un hueco elegante (el mandala
// latiendo, sin avisos de «próximamente») y el texto se lee igual.
//
// Las acuarelas van CUADRADAS (las que hay son 1254×1254 de origen). Si se sube
// una que no lo sea, el box la recorta por arriba y por abajo para llenar el
// cuadrado.
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
      "Empiezo a ver cómo ciertas de mis emociones y hábitos me desequilibraban.",
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
      "Mi cuerpo está hecho con las moléculas de los alimentos que elijo.",
      "Cuanto mejor coma, mejor me sentiré y mejor pensaré.",
    ],
  },
  {
    src: `${P}/comiciniciocabala.webp`,
    titulo: "Cábala",
    disciplina: cabalaNom,
    lineas: [
      "Después de comprender mi mente y mi cuerpo...",
      "Me empiezo a preguntar si es verdad que tenemos un alma.",
    ],
  },
  {
    // Esta viñeta se añadió después: el mapa tiene OCHO disciplinas y el guion
    // solo contaba siete, así que sin Cultura e Historia el anillo del mapa no
    // llegaba a cerrarse nunca.
    src: `${P}/comiciniciocultura.webp`,
    titulo: "Cultura e Historia",
    disciplina: culturaNom,
    lineas: [
      "Entender la historia de la humanidad me ayuda a entender el contexto actual.",
      "Ahora puedo apreciar más mi realidad.",
    ],
  },
  {
    src: `${P}/comiciniciodescubrimiento.webp`,
    titulo: "El descubrimiento",
    lineas: [
      "Entendí que todas poseen un fragmento de la misma verdad.",
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
      "Life as a Privilege nace para reconstruir ese mapa y ponerlo al servicio del crecimiento.",
    ],
  },
];
