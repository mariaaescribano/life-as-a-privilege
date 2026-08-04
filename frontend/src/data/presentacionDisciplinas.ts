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
import { recorridoContenido, type DisciplinaContenido } from "./recorridoContenido";

export type PresentacionDisciplina = DisciplinaContenido & {
  /** Slug de la URL: /d/<key>. Corto, porque va impreso debajo del QR. */
  key: string;
  /** Nombre interno (GlobalVariables): fondo propio, filtros, estilos. */
  nom: string;
  /** Nombre a mostrar. Ayurveda se llama "Hinduismo" por dentro. */
  titulo: string;
  bg: string;
  txt: string;
  Icon: React.ComponentType<{ size?: any }>;
  /** Frase del CARTEL. Es lo primero que se lee al escanear el QR: debe ser
   *  literalmente la misma que va impresa, para dar continuidad. */
  gancho: string;
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
    Icon: AstrologiaIcon,
    gancho: "La carta natal es el mapa del inconsciente. Describe nuestra estructura interna.",
    ilustracionesLabel: "Astrología",
    paso: 1,
    ordinal: "Primera disciplina",
    resumenPago:
      "Empieza el mapa con tu carta natal: descubre tus puntos clave, tus dones y tus conflictos. Encuentra dónde nacieron tus patrones, para qué y por qué los mantienes, y cuál es tu propósito.",
    video: "/videos/astrovideo.mp4",
    ...recorridoContenido.astrologia,
  },
  psicologia: {
    key: "psicologia",
    nom: neuropsicologiaNom,
    titulo: neuropsicologiaNom,
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    Icon: NeuropsicologiaIcon,
    gancho: "No estás roto. No eres una etiqueta. Eres un ser humano con una historia que merece ser comprendida. Reencuéntrate y empieza a avanzar.",
    ilustracionesLabel: "Psicología",
    paso: 2,
    ordinal: "Segunda disciplina",
    resumenPago:
      "Continúa el Mapa con Psicología: reconstruye tu historia y comprende cómo se fue construyendo tu mente, recorriendo tus huellas, tus miedos y tus heridas para habitarte con más libertad y coherencia.",
    video: "/videos/psicovideo.mp4",
    alias: ["neuropsicologia"],
    ...recorridoContenido.psicologia,
  },
  ayurveda: {
    key: "ayurveda",
    nom: ayurvedaNom,
    // En El Mapa esta disciplina se muestra como "Ayurveda", no "Hinduismo".
    titulo: "Ayurveda",
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    Icon: AyurvedaIcon,
    gancho: "No somos iguales. Descubre tu constitución y vive en coherencia con ella.",
    ilustracionesLabel: "Ayurveda",
    paso: 3,
    ordinal: "Tercera disciplina",
    resumenPago:
      "Continúa el Mapa con el Hinduismo: descubre tu Doṣha —tu constitución— y la naturaleza que te define, y aprende a comer, moverte y descansar en equilibrio con lo que de verdad eres.",
    video: "/videos/hinduismovideo.mp4",
    alias: ["hinduismo"],
    ...recorridoContenido.ayurveda,
  },
  tcm: {
    key: "medicinachina",
    nom: tcmNom,
    titulo: tcmNom,
    bg: tcmBg,
    txt: tcmTxt,
    Icon: TCMIcon,
    gancho: "El cuerpo habla. Aprende a escucharlo y a leer sus señales.",
    ilustracionesLabel: "Medicina China",
    paso: 4,
    ordinal: "Cuarta disciplina",
    resumenPago:
      "Continúa el Mapa con la Medicina China: descubre cómo los Cinco Elementos y sus ciclos te habitan, y lee las señales de tu cuerpo —hasta en tu lengua— para volver al equilibrio entre todo lo que nos forma, que es a lo que llamamos salud.",
    video: "/videos/tcm.mp4",
    alias: ["tcm"],
    ...recorridoContenido.tcm,
  },
  fisiologia: {
    key: "fisiologia",
    nom: fisiologiaNom,
    titulo: fisiologiaNom,
    bg: fisiologiaBg,
    txt: fisiologiaTxt,
    Icon: FisiologiaIcon,
    gancho: "Eres un ecosistema celular en constante cooperación, segundo a segundo; conocer tus células también es conocerte a ti.",
    ilustracionesLabel: "Fisiología",
    paso: 5,
    ordinal: "Quinta disciplina",
    resumenPago:
      "Continúa el Mapa con la Fisiología: viaja desde las partículas que te forman hasta el milagro de ser un cuerpo vivo, conoce tus células y tus sistemas y redescúbrete como el ser complejo y fascinante que eres.",
    video: "/videos/fisiologia.mp4",
    ...recorridoContenido.fisiologia,
  },
  nutricion: {
    key: "nutricion",
    nom: nutricionNom,
    titulo: nutricionNom,
    bg: nutricionBg,
    txt: nutricionTxt,
    Icon: NutricionIcon,
    gancho: "Estás formado por las moléculas de los alimentos que eliges cada día.",
    ilustracionesLabel: "Nutrición",
    paso: 6,
    ordinal: "Sexta disciplina",
    resumenPago:
      "Continúa el Mapa con la Nutrición: descubre qué hay más allá de lo que comes cada día y nútrete con lo que de verdad te reconstruye. Recuerda cómo no destruirte con los alimentos.",
    video: "/videos/nutricion.mp4",
    ...recorridoContenido.nutricion,
  },
  cabala: {
    key: "cabala",
    nom: cabalaNom,
    titulo: cabalaNom,
    bg: cabalaBg,
    txt: cabalaTxt,
    Icon: CabalaIcon,
    gancho: "La estructura y arquitectura del alma humana.",
    ilustracionesLabel: "Cábala",
    paso: 7,
    ordinal: "Séptima disciplina",
    resumenPago:
      "Adéntrate en la Cábala y recorre el Árbol de la Vida: descubre las diez sefirot que te habitan, los 22 senderos de la consciencia y aprende a reconocer en ti esas fuerzas para vivir desde tu esencia.",
    video: "/videos/cabala.mp4",
    ...recorridoContenido.cabala,
  },
  cultura: {
    key: "cultura",
    nom: culturaNom,
    titulo: culturaNom,
    bg: culturaBg,
    txt: culturaTxt,
    Icon: CulturaIcon,
    gancho: "¿Cómo hemos llegado hasta aquí? Conocer la historia nos permite no repetirla y valorar nuestra realidad.",
    ilustracionesLabel: "Cultura",
    paso: 8,
    ordinal: "Octava disciplina",
    resumenPago:
      "Cierra El Mapa recorriendo la Historia de la Filosofía, la Medicina, la Religión y la cultura general: recuerda de dónde venimos para entender dónde estamos y poder crear un futuro más bonito.",
    video: "/videos/cultura.mp4",
    ...recorridoContenido.cultura,
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
