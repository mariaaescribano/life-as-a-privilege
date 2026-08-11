// ─────────────────────────────────────────────────────────────────────────
// Un tema por disciplina: el papel, la tinta, el acento, la acuarela y el
// emblema. Todos los PDF salen del mismo taller, así que cambiar aquí un color
// lo cambia en el documento entero.
//
// Los colores son los de la web (GlobalVariables.tsx), pero AJUSTADOS AL PAPEL:
// en pantalla el texto se lee con luz propia y en papel no, así que las tintas
// van un punto más oscuras y los acentos un punto más saturados.
// ─────────────────────────────────────────────────────────────────────────
import {
  type RGB,
  type Emblema,
  emblemaLoto,
  emblemaYinYang,
  emblemaEspiral,
  emblemaHoja,
  emblemaSol,
  emblemaMandala,
  emblemaGlobo,
} from "./formas";

export type { RGB };

export interface Tema {
  /** Nombre de la disciplina tal y como aparece en cabeceras y pies. */
  disciplina: string;
  /** true = papel oscuro (Cábala, Astrología, Medicina China). */
  oscuro: boolean;
  papel: RGB;
  /** Tono de las manchas del papel hecho a mano. */
  papelVeta: RGB;
  tinta: RGB;
  tintaSuave: RGB;
  apagado: RGB;
  acento: RGB;
  acentoSuave: RGB;
  /** Carril vacío de las barras y fondo de las tramas. */
  trama: RGB;
  /** Acuarela de la disciplina, la misma que se ve en la web. */
  acuarela: string;
  emblema: Emblema;
  /** Velo sobre la acuarela de la portada, en hexadecimal CSS. */
  veloPortada: [string, string, string];
}

/* ── Ayurveda ─────────────────────────────────────────────────────────────── */
export const TEMA_AYURVEDA: Tema = {
  disciplina: "Ayurveda",
  oscuro: false,
  papel: [252, 247, 239],
  papelVeta: [232, 216, 194],
  tinta: [66, 34, 12],
  tintaSuave: [124, 74, 38],
  apagado: [162, 128, 96],
  acento: [154, 82, 22],
  acentoSuave: [214, 172, 126],
  trama: [230, 214, 194],
  acuarela: "/img/fondos/hinduismo.webp",
  emblema: emblemaLoto,
  veloPortada: ["rgba(38,20,8,0.60)", "rgba(38,20,8,0.36)", "rgba(38,20,8,0.74)"],
};

/* ── Psicología ───────────────────────────────────────────────────────────── */
export const TEMA_PSICOLOGIA: Tema = {
  disciplina: "Psicología",
  oscuro: false,
  papel: [252, 247, 240],
  papelVeta: [233, 214, 192],
  tinta: [62, 30, 12],
  tintaSuave: [116, 68, 36],
  apagado: [160, 122, 90],
  acento: [140, 68, 22],
  acentoSuave: [212, 166, 134],
  trama: [231, 213, 194],
  acuarela: "/img/fondos/psciologia.webp",
  emblema: emblemaEspiral,
  veloPortada: ["rgba(44,20,8,0.58)", "rgba(44,20,8,0.34)", "rgba(44,20,8,0.72)"],
};

/* ── Nutrición ────────────────────────────────────────────────────────────── */
export const TEMA_NUTRICION: Tema = {
  disciplina: "Nutrición",
  oscuro: false,
  papel: [250, 251, 246],
  papelVeta: [219, 234, 214],
  tinta: [26, 40, 26],
  tintaSuave: [56, 84, 56],
  apagado: [124, 150, 122],
  acento: [46, 104, 62],
  acentoSuave: [156, 196, 160],
  trama: [216, 233, 214],
  acuarela: "/img/fondos/nutri.webp",
  emblema: emblemaHoja,
  veloPortada: ["rgba(12,30,16,0.62)", "rgba(12,30,16,0.38)", "rgba(12,30,16,0.76)"],
};

/* ── Medicina China (papel oscuro) ────────────────────────────────────────── */
export const TEMA_TCM: Tema = {
  disciplina: "Medicina China",
  oscuro: true,
  papel: [34, 12, 12],
  papelVeta: [58, 20, 20],
  tinta: [243, 224, 220],
  tintaSuave: [226, 176, 172],
  apagado: [150, 104, 100],
  acento: [214, 118, 108],
  acentoSuave: [255, 162, 162],
  trama: [72, 30, 30],
  acuarela: "/img/fondos/tcm.webp",
  emblema: emblemaYinYang,
  veloPortada: ["rgba(24,6,6,0.72)", "rgba(24,6,6,0.42)", "rgba(24,6,6,0.86)"],
};

/* ── Cábala (papel oscuro) ────────────────────────────────────────────────── */
export const TEMA_CABALA: Tema = {
  disciplina: "Cábala",
  oscuro: true,
  papel: [28, 18, 10],
  papelVeta: [48, 32, 18],
  tinta: [240, 229, 214],
  tintaSuave: [226, 178, 128],
  apagado: [150, 118, 92],
  acento: [189, 129, 77],
  acentoSuave: [226, 178, 128],
  trama: [62, 43, 27],
  acuarela: "/img/fondos/cabala.webp",
  emblema: emblemaMandala,
  veloPortada: ["rgba(20,12,6,0.74)", "rgba(20,12,6,0.42)", "rgba(20,12,6,0.86)"],
};

/* ── Astrología (papel oscuro) ────────────────────────────────────────────── */
export const TEMA_ASTROLOGIA: Tema = {
  disciplina: "Astrología",
  oscuro: true,
  papel: [7, 11, 26],
  papelVeta: [18, 24, 46],
  tinta: [239, 235, 224],
  tintaSuave: [206, 210, 214],
  apagado: [150, 168, 190],
  acento: [255, 217, 125],
  acentoSuave: [255, 233, 178],
  trama: [30, 41, 74],
  acuarela: "",
  emblema: emblemaSol,
  veloPortada: ["rgba(4,7,20,0.66)", "rgba(4,7,20,0.30)", "rgba(4,7,20,0.74)"],
};

/* ── Cultura (papel oscuro) ───────────────────────────────────────────────── */
// La disciplina va en verde azulado muy oscuro con la tinta menta (#79dcd4 en la
// web), subida un punto para que la letra pequeña aguante en papel.
export const TEMA_CULTURA: Tema = {
  disciplina: "Cultura",
  oscuro: true,
  papel: [10, 32, 32],
  papelVeta: [18, 52, 52],
  tinta: [226, 246, 242],
  tintaSuave: [150, 220, 212],
  apagado: [104, 152, 148],
  acento: [121, 220, 212],
  acentoSuave: [176, 236, 230],
  trama: [24, 62, 62],
  acuarela: "/img/fondos/cultura.webp",
  emblema: emblemaGlobo,
  veloPortada: ["rgba(4,22,22,0.72)", "rgba(4,22,22,0.42)", "rgba(4,22,22,0.86)"],
};

/* ── Colores de los tres doṣhas (comunes a todos los PDF de Ayurveda) ─────── */
export const COLOR_DOSHA: Record<string, RGB> = {
  vata: [108, 78, 176],
  pitta: [186, 74, 34],
  kapha: [46, 124, 80],
};

/* ── Colores de los cinco elementos chinos ────────────────────────────────── */
export const COLOR_ELEMENTO: Record<string, RGB> = {
  madera: [104, 162, 108],
  fuego: [204, 78, 70],
  tierra: [200, 156, 84],
  metal: [198, 200, 206],
  agua: [96, 132, 186],
};
