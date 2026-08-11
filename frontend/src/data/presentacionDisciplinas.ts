/* ─────────────────────────────────────────────────────────────────────────────
 *  PÁGINAS DE PRESENTACIÓN DE CADA DISCIPLINA  →  /d/:disciplina
 *
 *  Son páginas PÚBLICAS (sin login) pensadas para el QR de un cartel físico:
 *  una por disciplina, con la misma frase que va impresa en el cartel para que
 *  quien escanea reconozca que ha llegado bien.
 *
 *  El contenido NO se escribe aquí: se reutiliza el de /elMetodo
 *  (recorridoContenido.ts) y las ilustraciones de la galería
 *  (ilustracionesGaleria.ts). Aquí solo vive lo propio del cartel:
 *  la frase gancho, el slug de la URL y el estilo de la disciplina.
 *
 *  Lo editable de verdad es `gancho` (la frase del cartel). Todo lo demás sale
 *  de los archivos que ya alimentan el resto de la web.
 * ───────────────────────────────────────────────────────────────────────────── */

import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  culturaBg, CulturaIcon, culturaNom, culturaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt,
} from "../GlobalVariables";
import { type DisciplinaClave } from "./recorridoContenido";
import { type Texto } from "../i18n";

export type PresentacionDisciplina = {
  /** Slug de la URL: /d/<key>. Corto, porque va impreso debajo del QR. */
  key: string;
  /** Nombre interno (GlobalVariables): fondo propio, filtros, estilos. */
  nom: string;
  /**
   * SOLO para casar la URL escrita a mano (`/d/Cábala`). NO se pinta: el
   * nombre que se muestra sale de `useNombreDisciplinaEnMapa()`, que sí
   * traduce. Por eso este campo se queda en español pase lo que pase.
   */
  titulo: string;
  /** Clave de su contenido; el texto se pide al pintar (useRecorridoContenido). */
  clave: DisciplinaClave;
  bg: string;
  txt: string;
  Icon: React.ComponentType<{ size?: any }>;
  /** Frase del CARTEL. Es lo primero que se lee al escanear el QR: debe ser
   *  literalmente la misma que va impresa, para dar continuidad. */
  gancho: Texto;
  /** Etiqueta con la que esta disciplina aparece en ILUSTRACIONES (galería).
   *  No siempre coincide con `nom`: Hinduismo está etiquetado "Ayurveda". */
  ilustracionesLabel: string;
  /** Numero de paso en el Mapa (1..8). Lo pinta el box de la disciplina. */
  paso: number;
  /** «Primera disciplina», «Segunda disciplina»… el mismo ordinal del box de
   *  pago del recorrido (Pago*Modal), para que la caja de precio de la
   *  presentación diga exactamente lo mismo. */
  ordinal: string;
  /** Resumen de lo que se desbloquea al pagar. Copiado del box de pago de esa
   *  disciplina: es el texto que ya ve quien compra desde dentro. */
  resumenPago: string;
  /** Vídeo de muestra del recorrido (el mismo del mandala de /elMetodo). */
  video: string;
  /** Alias adicionales aceptados en la URL (por si un cartel ya está impreso
   *  con otro nombre). */
  alias?: string[];
};

const base: Record<string, PresentacionDisciplina> = {
  astrologia: {
    key: "astrologia",
    nom: astrologiaNom,
    titulo: astrologiaNom,
    bg: astrologiaBg,
    txt: astrologiaTxt,
    clave: "astrologia",
    Icon: AstrologiaIcon,
    gancho: {
      es: "La carta natal es el mapa de las circunstancias que te han dado forma. Es la estructura de tu mente, el mapa de tu inconsciente.",
      en: "Your birth chart is a map of the unconscious. It describes the structure of your mind.",
    },
    ilustracionesLabel: "Astrología",
    paso: 1,
    ordinal: "Primera disciplina",
    resumenPago:
      "Empieza el mapa con tu carta natal: descubre tus puntos clave, tus dones y tus conflictos. Encuentra dónde nacieron tus patrones, para qué y por qué los mantienes, y cuál es tu propósito.",
    video: "/videos/astrovideo.mp4",
  },
  psicologia: {
    key: "psicologia",
    nom: neuropsicologiaNom,
    titulo: neuropsicologiaNom,
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    clave: "psicologia",
    Icon: NeuropsicologiaIcon,
    gancho: {
      es: "No estás roto. No eres una etiqueta. Eres un ser humano con una historia que merece ser comprendida.",
      en: "You are not broken. You are not a label. You are a human being with a history that deserves to be understood.",
    },
    ilustracionesLabel: "Psicología",
    paso: 2,
    ordinal: "Segunda disciplina",
    resumenPago:
      "Continúa el Mapa con Psicología: reconstruye tu historia y comprende cómo se fue construyendo tu mente, recorriendo tus huellas, tus miedos y tus heridas para habitarte con más libertad y coherencia.",
    video: "/videos/psicologiavideo.mp4",
    alias: ["neuropsicologia"],
  },
  ayurveda: {
    key: "ayurveda",
    nom: ayurvedaNom,
    // En El Mapa esta disciplina se muestra como "Ayurveda", no "Hinduismo".
    titulo: "Ayurveda",
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    clave: "ayurveda",
    Icon: AyurvedaIcon,
    gancho: {
      es: "No somos iguales. Descubre tu constitución, tus tendencias mentales y vive en coherencia contigo.",
      en: "We are not all alike. Discover your constitution and your mental tendencies, and live in step with yourself.",
    },
    ilustracionesLabel: "Ayurveda",
    paso: 3,
    ordinal: "Tercera disciplina",
    resumenPago:
      "Continúa el Mapa con el Hinduismo: descubre tu Doṣha —tu constitución— y la naturaleza que te define, y aprende a comer, moverte y descansar en equilibrio con lo que de verdad eres.",
    video: "/videos/ayurvedavideo.mp4",
    alias: ["hinduismo"],
  },
  tcm: {
    key: "medicinachina",
    nom: tcmNom,
    titulo: tcmNom,
    bg: tcmBg,
    txt: tcmTxt,
    clave: "tcm",
    Icon: TCMIcon,
    gancho: {
      es: "Escucha. El cuerpo habla. Aprende a escucharlo y a leer sus señales.",
      en: "Listen. The body speaks. Learn to listen to it and to read its signals.",
    },
    ilustracionesLabel: "Medicina China",
    paso: 4,
    ordinal: "Cuarta disciplina",
    resumenPago:
      "Continúa el Mapa con la Medicina China: descubre cómo los Cinco Elementos y sus ciclos te habitan, y lee las señales de tu cuerpo —hasta en tu lengua— para volver al equilibrio entre todo lo que nos forma, que es a lo que llamamos salud.",
    video: "/videos/tcmvideo.mp4",
    alias: ["tcm"],
  },
  fisiologia: {
    key: "fisiologia",
    nom: fisiologiaNom,
    titulo: fisiologiaNom,
    bg: fisiologiaBg,
    txt: fisiologiaTxt,
    clave: "fisiologia",
    Icon: FisiologiaIcon,
    gancho: {
      es: "Eres un ecosistema celular en constante cooperación, segundo a segundo. Comprender tus células también es comprenderte a ti.",
      en: "You are a cellular ecosystem in constant cooperation, second by second. To understand your cells is also to understand yourself.",
    },
    ilustracionesLabel: "Fisiología",
    paso: 5,
    ordinal: "Quinta disciplina",
    resumenPago:
      "Continúa el Mapa con la Fisiología: viaja desde las partículas que te forman hasta el milagro de ser un cuerpo vivo, conoce tus células y tus sistemas y redescúbrete como el ser complejo y fascinante que eres.",
    video: "/videos/fisiovideo.mp4",
  },
  nutricion: {
    key: "nutricion",
    nom: nutricionNom,
    titulo: nutricionNom,
    bg: nutricionBg,
    txt: nutricionTxt,
    clave: "nutricion",
    Icon: NutricionIcon,
    gancho: {
      es: "Estás formado por las moléculas de los alimentos que eliges cada día.",
      en: "You are built from the molecules of the food you choose every day.",
    },
    ilustracionesLabel: "Nutrición",
    paso: 6,
    ordinal: "Sexta disciplina",
    resumenPago:
      "Continúa el Mapa con la Nutrición: descubre qué hay más allá de lo que comes cada día y nútrete con lo que de verdad te reconstruye. Recuerda cómo no destruirte con los alimentos.",
    video: "/videos/nutrivideo.mp4",
  },
  cabala: {
    key: "cabala",
    nom: cabalaNom,
    titulo: cabalaNom,
    bg: cabalaBg,
    txt: cabalaTxt,
    clave: "cabala",
    Icon: CabalaIcon,
    gancho: {
      es: "Explora la estructura del alma según la Cábala, el misticismo judío en el que nació Jesucristo.",
      en: "Explore the structure of the soul according to Kabbalah, the Jewish mysticism Jesus Christ was born into.",
    },
    ilustracionesLabel: "Cábala",
    paso: 7,
    ordinal: "Séptima disciplina",
    resumenPago:
      "Adéntrate en la Cábala y recorre el Árbol de la Vida: descubre las diez sefirot que te habitan, los 22 senderos de la consciencia y aprende a reconocer en ti esas fuerzas para vivir desde tu esencia.",
    video: "/videos/cabalavideo.mp4",
  },
  cultura: {
    key: "cultura",
    nom: culturaNom,
    titulo: culturaNom,
    bg: culturaBg,
    txt: culturaTxt,
    clave: "cultura",
    Icon: CulturaIcon,
    gancho: {
      es: "¿Cómo hemos llegado hasta aquí? Comprender nuestra historia es comprender el mundo en el que vivimos y apreciar la realidad que hemos heredado.",
      en: "How did we get here? To understand our history is to understand the world we live in, and to appreciate the reality we have inherited.",
    },
    ilustracionesLabel: "Cultura",
    paso: 8,
    ordinal: "Octava disciplina",
    resumenPago:
      "Cierra El Mapa recorriendo la Historia de la Filosofía, la Medicina, la Religión y la cultura general: recuerda de dónde venimos para entender dónde estamos y poder crear un futuro más bonito.",
    video: "/videos/culturavideo.mp4",
  },
};

/** En el orden del Mapa. */
export const PRESENTACIONES: PresentacionDisciplina[] = [
  base.astrologia, base.psicologia, base.ayurveda, base.tcm,
  base.fisiologia, base.nutricion, base.cabala, base.cultura,
];

// Marcas de acento que deja `normalize("NFD")` al descomponer las vocales. Va
// como cadena y no como literal /…/ para que el rango no dependa de que el
// editor conserve unos caracteres combinantes invisibles en el código.
const ACENTOS = new RegExp("[\\u0300-\\u036f]", "g");

/** Quita acentos y pasa a minúsculas: la URL de un cartel puede venir escrita
 *  a mano («/d/Cábala»), y debe funcionar igual. */
const normaliza = (s: string): string =>
  s.trim().toLowerCase().normalize("NFD").replace(ACENTOS, "");

/** Busca la presentación por slug o alias. undefined si no existe. */
export const presentacionPorKey = (
  slug: string | undefined,
): PresentacionDisciplina | undefined => {
  if (!slug) return undefined;
  const s = normaliza(slug);
  return PRESENTACIONES.find(
    (p) => normaliza(p.key) === s
      || normaliza(p.titulo) === s
      || normaliza(p.nom) === s
      || (p.alias ?? []).some((a) => normaliza(a) === s),
  );
};
