import type { Vineta } from "./ComicViewer";
import {
  astrologiaTxt,
  ayurvedaBg, ayurvedaTxt,
  fisiologiaBg, fisiologiaTxt,
  tcmBg, tcmTxt,
} from "../../GlobalVariables";
import { ORIGEN_ESPIRITUALIDAD } from "./ComicUniversoModal";
import { ORIGEN_CIENCIA } from "./ComicCienciaModal";
import {
  VINETAS_ORIGEN as HINDU_ORIGEN,
  VINETAS_ELEMENTOS as HINDU_ELEMENTOS,
  VINETAS_DOSHAS as HINDU_DOSHAS,
} from "./HinduismoIlustracionesModal";
import {
  VINETAS_ORIGEN as TCM_ORIGEN,
  VINETAS_YIN_YANG as TCM_YINYANG,
  VINETAS_ELEMENTOS as TCM_ELEMENTOS,
  VINETAS_ALMA as TCM_ALMA,
} from "./TCMIlustracionesModal";
import { VINETAS_SIGNOS, VINETAS_CASAS, VINETAS_PLANETAS } from "./ComicAstrologiaModal";

// ─────────────────────────────────────────────────────────────────────────
// Galería de ILUSTRACIONES (página /ilustraciones). Reúne todas las series de
// viñetas de todas las disciplinas. Cada entrada abre el popup inmersivo con
// el estilo (colores + fondo) de su disciplina; ese popup NO cambia respecto a
// donde ya vivía, solo lo reunimos aquí en un único sitio.
//
// Orden: primero los cómics de EL ORIGEN (Ciencia → Espiritualidad → Hinduismo
// → Taoísmo), luego el resto de ilustraciones por disciplina.
// ─────────────────────────────────────────────────────────────────────────

export interface IlustracionEntry {
  id: string;
  titulo: string;
  /** Etiqueta pequeña de la disciplina / procedencia. */
  disciplina: string;
  /** Imagen de portada del box. */
  cover: string;
  vinetas: Vineta[];
  themeColor: string;
  /** Modo disciplina (si se omite → fondo estrellado por defecto). */
  disciplinaBgImage?: string;
  disciplinaBgColor?: string;
  textShadow?: string;
}

const hinduTextShadow = `0 0 6px ${ayurvedaBg}, 0 0 14px ${ayurvedaBg}, 0 0 26px ${ayurvedaBg}cc`;
const astroTextShadow = `0 0 4px ${astrologiaTxt}aa, 0 0 9px ${astrologiaTxt}66`;

export const ILUSTRACIONES: IlustracionEntry[] = [
  // ── EL ORIGEN (primero) ──
  {
    id: "origen-ciencia",
    titulo: "El Origen · según la Ciencia",
    disciplina: "Fisiología",
    cover: "/viñetas/comicInicioSegunCiencia/inicio1.png",
    vinetas: ORIGEN_CIENCIA,
    themeColor: fisiologiaTxt,
    disciplinaBgImage: "/img/fondos/fisio.png",
    disciplinaBgColor: fisiologiaBg,
  },
  {
    id: "origen-espiritualidad",
    titulo: "El Origen · según la Espiritualidad",
    disciplina: "Astrología",
    cover: "/viñetas/comicInicio/viñeta1.png",
    vinetas: ORIGEN_ESPIRITUALIDAD,
    themeColor: astrologiaTxt,
  },
  {
    id: "origen-hinduismo",
    titulo: "El Origen · según el Hinduismo",
    disciplina: "Ayurveda",
    cover: "/viñetas/hinduismo/origen/portada.png",
    vinetas: HINDU_ORIGEN,
    themeColor: ayurvedaTxt,
    disciplinaBgImage: "/img/fondos/hinduismo.png",
    disciplinaBgColor: ayurvedaBg,
    textShadow: hinduTextShadow,
  },
  {
    id: "origen-taoismo",
    titulo: "El Origen · según el Taoísmo",
    disciplina: "Medicina China",
    cover: "/viñetas/tcm/origen/origentcm3.png",
    vinetas: TCM_ORIGEN,
    themeColor: tcmTxt,
    disciplinaBgImage: "/img/fondos/tcm.png",
    disciplinaBgColor: tcmBg,
  },

  // ── Astrología ──
  {
    id: "astro-signos",
    titulo: "Los Signos",
    disciplina: "Astrología",
    cover: "/viñetas/astrologia/portadasignos.png",
    vinetas: VINETAS_SIGNOS,
    themeColor: astrologiaTxt,
    textShadow: astroTextShadow,
  },
  {
    id: "astro-casas",
    titulo: "Las Casas",
    disciplina: "Astrología",
    cover: "/viñetas/astrologia/portadacasas.png",
    vinetas: VINETAS_CASAS,
    themeColor: astrologiaTxt,
    textShadow: astroTextShadow,
  },
  {
    id: "astro-planetas",
    titulo: "Los Planetas",
    disciplina: "Astrología",
    cover: "/viñetas/astrologia/portadaplanetas.png",
    vinetas: VINETAS_PLANETAS,
    themeColor: astrologiaTxt,
    textShadow: astroTextShadow,
  },

  // ── Ayurveda / Hinduismo ──
  {
    id: "hindu-elementos",
    titulo: "Los Elementos",
    disciplina: "Ayurveda",
    cover: "/viñetas/hinduismo/elementos/elementosayurveda.png",
    vinetas: HINDU_ELEMENTOS,
    themeColor: ayurvedaTxt,
    disciplinaBgImage: "/img/fondos/hinduismo.png",
    disciplinaBgColor: ayurvedaBg,
    textShadow: hinduTextShadow,
  },
  {
    id: "hindu-doshas",
    titulo: "Los Doshas",
    disciplina: "Ayurveda",
    cover: "/viñetas/hinduismo/doshas/doshasportada.png",
    vinetas: HINDU_DOSHAS,
    themeColor: ayurvedaTxt,
    disciplinaBgImage: "/img/fondos/hinduismo.png",
    disciplinaBgColor: ayurvedaBg,
    textShadow: hinduTextShadow,
  },

  // ── Medicina China ──
  {
    id: "tcm-yinyang",
    titulo: "El Yin Yang",
    disciplina: "Medicina China",
    cover: "/viñetas/tcm/yinyang/yinyang.png",
    vinetas: TCM_YINYANG,
    themeColor: tcmTxt,
    disciplinaBgImage: "/img/fondos/tcm.png",
    disciplinaBgColor: tcmBg,
  },
  {
    id: "tcm-elementos",
    titulo: "Los Cinco Elementos",
    disciplina: "Medicina China",
    cover: "/viñetas/tcm/elementos/portadaelementos.png",
    vinetas: TCM_ELEMENTOS,
    themeColor: tcmTxt,
    disciplinaBgImage: "/img/fondos/tcm.png",
    disciplinaBgColor: tcmBg,
  },
  {
    id: "tcm-alma",
    titulo: "El Alma Humana",
    disciplina: "Medicina China",
    cover: "/viñetas/tcm/alma/alma7.png",
    vinetas: TCM_ALMA,
    themeColor: tcmTxt,
    disciplinaBgImage: "/img/fondos/tcm.png",
    disciplinaBgColor: tcmBg,
  },
];
