import type { Vineta } from "./ComicViewer";
import {
  astrologiaTxt,
  ayurvedaBg, ayurvedaTxt,
  cabalaBg, cabalaTxt,
  fisiologiaBg, fisiologiaTxt,
  neuropsicologiaBg, neuropsicologiaTxt,
  nutricionBg, nutricionTxt,
  tcmBg, tcmTxt,
} from "../../GlobalVariables";
import { ORIGEN_ESPIRITUALIDAD } from "./ComicUniversoModal";
import { ORIGEN_CIENCIA } from "./ComicCienciaModal";
import { NUTRICION_INTRO } from "./comicNutricionIntro";
import { NUTRICION_CALORIAS } from "./comicNutricionCalorias";
import { INTRO_PSICOLOGIA } from "./comicPsicologiaIntro";
import { COMIC_COMPROMISO } from "./comicCompromiso";
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
import { ESTRELLA_ATOMOS } from "./comicEstrellaAtomos";
import { CELULA_VIVA } from "./comicCelulaViva";
import { CABALA_INTRO } from "./comicCabalaIntro";

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
  /** Color de la LETRA si difiere del acento (themeColor). P.ej. Nutrición usa
   *  acento claro (nutricionBg) y letra oscura (nutricionTxt). */
  textColor?: string;
  /** Color del texto/borde de la TARJETA de la galería si difiere del acento del
   *  cómic (themeColor). Útil cuando el acento del cómic es claro (nutricionBg) y
   *  quedaría ilegible sobre la portada clara de la tarjeta → usar nutricionTxt. */
  cardColor?: string;
}

const hinduTextShadow = `0 0 6px ${ayurvedaBg}, 0 0 14px ${ayurvedaBg}, 0 0 26px ${ayurvedaBg}cc`;
const astroTextShadow = `0 0 4px ${astrologiaTxt}aa, 0 0 9px ${astrologiaTxt}66`;
const psicoTextShadow = `0 1px 2px #fbf4e8, 0 0 6px #fbf4e8, 0 0 13px ${neuropsicologiaBg}`;

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
  {
    id: "origen-cabala",
    titulo: "El Origen · según la Cábala",
    disciplina: "Cábala",
    cover: "/viñetas/cabala/origen/cabalaorigen1.png",
    vinetas: CABALA_INTRO,
    themeColor: cabalaTxt,
    disciplinaBgImage: "/img/fondos/cabala.png",
    disciplinaBgColor: cabalaBg,
  },

  // ── Fisiología ──
  {
    id: "fisio-estrella",
    titulo: "La Estrella",
    disciplina: "Fisiología",
    cover: "/viñetas/fisiologia/estrellas/star6.png",
    vinetas: ESTRELLA_ATOMOS,
    themeColor: fisiologiaTxt,
    disciplinaBgImage: "/img/fondos/fisio.png",
    disciplinaBgColor: fisiologiaBg,
  },
  {
    id: "fisio-celula",
    titulo: "La Vida secreta de la célula",
    disciplina: "Fisiología",
    cover: "/viñetas/fisiologia/celulacomic/celula1.png",
    vinetas: CELULA_VIVA,
    themeColor: fisiologiaTxt,
    disciplinaBgImage: "/img/fondos/fisio.png",
    disciplinaBgColor: fisiologiaBg,
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
    titulo: "Los Doṣhas",
    disciplina: "Ayurveda",
    cover: "/viñetas/hinduismo/doshas/doshasportada.png",
    vinetas: HINDU_DOSHAS,
    themeColor: ayurvedaTxt,
    disciplinaBgImage: "/img/fondos/hinduismo.png",
    disciplinaBgColor: ayurvedaBg,
    textShadow: hinduTextShadow,
  },

  // ── Psicología ──
  {
    id: "psicologia-intro",
    titulo: "El origen del sufrimiento",
    disciplina: "Psicología",
    cover: "/viñetas/psicologia/sufrimiento/sufrimiento1.png",
    vinetas: INTRO_PSICOLOGIA,
    themeColor: neuropsicologiaTxt,
    disciplinaBgImage: "/img/fondos/psciologia.png",
    disciplinaBgColor: neuropsicologiaBg,
    textShadow: psicoTextShadow,
  },
  {
    id: "psicologia-etapas",
    titulo: "Cómo te construiste",
    disciplina: "Psicología",
    cover: "/viñetas/psicologia/compromiso/compromiso1.png",
    vinetas: COMIC_COMPROMISO,
    themeColor: neuropsicologiaTxt,
    disciplinaBgImage: "/img/fondos/psciologia.png",
    disciplinaBgColor: neuropsicologiaBg,
    textShadow: psicoTextShadow,
  },

  // ── Nutrición ── (acento claro nutricionBg + letra oscura nutricionTxt, sin sombra)
  {
    id: "nutricion-intro",
    titulo: "Eres lo que absorbes",
    disciplina: "Nutrición",
    cover: "/viñetas/nutricion/intro/nutricomic1.png",
    vinetas: NUTRICION_INTRO,
    themeColor: nutricionBg,
    textColor: nutricionTxt,
    cardColor: nutricionTxt,
    disciplinaBgImage: "/img/fondos/nutri.png",
    disciplinaBgColor: nutricionBg,
    textShadow: "none",
  },
  {
    id: "nutricion-calorias",
    titulo: "Las calorías no existen",
    disciplina: "Nutrición",
    cover: "/viñetas/nutricion/calorias/calorias9.png",
    vinetas: NUTRICION_CALORIAS,
    themeColor: nutricionBg,
    textColor: nutricionTxt,
    cardColor: nutricionTxt,
    disciplinaBgImage: "/img/fondos/nutri.png",
    disciplinaBgColor: nutricionBg,
    textShadow: "none",
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
