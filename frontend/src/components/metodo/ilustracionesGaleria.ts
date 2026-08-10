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
import { NUTRICION_MICROBIOTA } from "./comicNutricionMicrobiota";
import { NUTRICION_INTEGRAL } from "./comicNutricionIntegral";
import { HAMBRE_HOLISTICA, sinNegrita } from "./hambreHolistica";
import { COMICS_NUTRIENTES } from "./comicsNutrientes";
import { INTRO_PSICOLOGIA } from "./comicPsicologiaIntro";
import { COMIC_COMPROMISO } from "./comicCompromiso";
import { COMIC_ACE } from "./comicAce";
import { COMIC_CREENCIAS } from "./comicCreencias";
import { COMIC_LINEA_TIEMPO } from "./comicLineaTiempo";
import { COMIC_SINTESIS } from "./comicSintesis";
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
import { HISTORIA_ASTROLOGIA } from "./comicHistoriaAstrologia";
import { ESTRELLA_ATOMOS } from "./comicEstrellaAtomos";
import { CELULA_VIVA } from "./comicCelulaViva";
import { CELULAS_ORGANOS } from "./comicCelulasOrganos";
import { ORIGEN_NUTRIENTES } from "./comicsOrigenNutrientes";
import { CABALA_INTRO } from "./comicCabalaIntro";
import { CABALA_ILUSTRACIONES_VINETAS } from "./cabalaIlustraciones";
import { CABALA_SENDERO_VINETAS } from "./cabalaSenderoIlustraciones";

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
// Astrología: sin brillo en la letra. El crema sobre el cielo estrellado ya
// contrasta de sobra, y el halo del propio color solo ensuciaba el texto.
const astroTextShadow = "none";
const psicoTextShadow = `0 1px 2px #fbf4e8, 0 0 6px #fbf4e8, 0 0 13px ${neuropsicologiaBg}`;

// Nutrición: acento claro (nutricionBg) + letra oscura (nutricionTxt), sin
// sombra. Las negritas **…** se limpian con `sinNegrita` (hambreHolistica), que
// es donde vive esa convención: el visor pinta en plano.
const nutriEntry = (id: string, titulo: string, cover: string, vinetas: Vineta[]): IlustracionEntry => ({
  id, titulo, disciplina: "Nutrición", cover, vinetas,
  themeColor: nutricionBg, textColor: nutricionTxt, cardColor: nutricionTxt,
  disciplinaBgImage: "/img/fondos/nutri.webp", disciplinaBgColor: nutricionBg, textShadow: "none",
});

const psicoEntry = (id: string, titulo: string, cover: string, vinetas: Vineta[]): IlustracionEntry => ({
  id, titulo, disciplina: "Psicología", cover, vinetas,
  themeColor: neuropsicologiaTxt,
  disciplinaBgImage: "/img/fondos/psciologia.webp", disciplinaBgColor: neuropsicologiaBg,
  textShadow: psicoTextShadow,
});

// ── Cómics de Psicología que van INTERCALADOS en el recorrido ──────────────
// Estos cuatro no forman parte de las «Ilustraciones» del material (así lo dice
// cada uno de sus archivos): viven dentro de su paso del recorrido, no en la
// galería. Aquí se listan aparte, SIN entrar en ILUSTRACIONES, porque la
// presentación pública de Psicología (/d/psicologia) sí los enseña: son
// justamente los que explican en qué consiste el método.
export const PSICOLOGIA_COMICS_RECORRIDO: IlustracionEntry[] = [
  psicoEntry("psico-creencias", "Cómo nacen las creencias", "/viñetas/psicologia/creencias/creencias1.webp", COMIC_CREENCIAS),
  psicoEntry("psico-ace", "Los ACE", "/viñetas/psicologia/ace/ace1.webp", COMIC_ACE),
  psicoEntry("psico-linea", "La Línea de Vida", "/viñetas/psicologia/lineatiempo/lineatiempo1.webp", COMIC_LINEA_TIEMPO),
  psicoEntry("psico-sintesis", "El problema nunca es el problema", "/viñetas/psicologia/sintesis/sintesis1.webp", COMIC_SINTESIS),
];

export const ILUSTRACIONES: IlustracionEntry[] = [
  // ── EL ORIGEN (primero) ──
  {
    id: "origen-ciencia",
    titulo: "El Origen · según la Ciencia",
    disciplina: "Fisiología",
    cover: "/viñetas/comicInicioSegunCiencia/inicio1.webp",
    vinetas: ORIGEN_CIENCIA,
    themeColor: fisiologiaTxt,
    disciplinaBgImage: "/img/fondos/fisio.webp",
    disciplinaBgColor: fisiologiaBg,
  },
  {
    id: "origen-espiritualidad",
    titulo: "El Origen · según la Espiritualidad",
    disciplina: "Astrología",
    cover: "/viñetas/comicInicio/viñeta1.webp",
    vinetas: ORIGEN_ESPIRITUALIDAD,
    themeColor: astrologiaTxt,
    // Las cinco series de Astrología van igual: sin brillo en la letra.
    textShadow: astroTextShadow,
  },
  {
    id: "origen-hinduismo",
    titulo: "El Origen · según el Hinduismo",
    disciplina: "Ayurveda",
    cover: "/viñetas/hinduismo/origen/portada.webp",
    vinetas: HINDU_ORIGEN,
    themeColor: ayurvedaTxt,
    disciplinaBgImage: "/img/fondos/hinduismo.webp",
    disciplinaBgColor: ayurvedaBg,
    textShadow: hinduTextShadow,
  },
  {
    id: "origen-taoismo",
    titulo: "El Origen · según el Taoísmo",
    disciplina: "Medicina China",
    cover: "/viñetas/tcm/origen/origentcm3.webp",
    vinetas: TCM_ORIGEN,
    themeColor: tcmTxt,
    disciplinaBgImage: "/img/fondos/tcm.webp",
    disciplinaBgColor: tcmBg,
  },
  {
    id: "origen-cabala",
    titulo: "El Origen · según la Cábala",
    disciplina: "Cábala",
    cover: "/viñetas/cabala/origen/cabalaorigen1.webp",
    vinetas: CABALA_INTRO,
    themeColor: cabalaTxt,
    disciplinaBgImage: "/img/fondos/cabala.webp",
    disciplinaBgColor: cabalaBg,
  },

  // ── Fisiología ──
  {
    id: "fisio-estrella",
    titulo: "La Estrella",
    disciplina: "Fisiología",
    cover: "/viñetas/fisiologia/estrellas/star6.webp",
    vinetas: ESTRELLA_ATOMOS,
    themeColor: fisiologiaTxt,
    disciplinaBgImage: "/img/fondos/fisio.webp",
    disciplinaBgColor: fisiologiaBg,
  },
  {
    id: "fisio-celula",
    titulo: "La Vida secreta de la célula",
    disciplina: "Fisiología",
    cover: "/viñetas/fisiologia/celulacomic/celula1.webp",
    vinetas: CELULA_VIVA,
    themeColor: fisiologiaTxt,
    disciplinaBgImage: "/img/fondos/fisio.webp",
    disciplinaBgColor: fisiologiaBg,
  },
  {
    // Cuarta serie de Fisiología. La presentación (/d/fisiologia) enseña las
    // ilustraciones en una rejilla de CUATRO y con tres se quedaba un hueco;
    // esta sigue además el orden de la historia: la estrella, la célula y cómo
    // esa célula se convierte en un cuerpo entero.
    id: "fisio-cigoto",
    titulo: "De una célula a un órgano",
    disciplina: "Fisiología",
    cover: "/viñetas/fisiologia/cigoto/cigoto1.webp",
    vinetas: CELULAS_ORGANOS,
    themeColor: fisiologiaTxt,
    disciplinaBgImage: "/img/fondos/fisio.webp",
    disciplinaBgColor: fisiologiaBg,
  },
  // OJO: «Los grandes ciclos de la naturaleza» era de Fisiología y ahora vive en
  // Nutrición (paso «¿De dónde vienen los nutrientes?»), así que su entrada está
  // más abajo, con el resto de las de Nutrición.

  // ── Astrología ──
  {
    id: "astro-historia",
    titulo: "La historia de la Astrología",
    disciplina: "Astrología",
    cover: "/viñetas/astrologia/historia/mesopotamia.webp",
    vinetas: HISTORIA_ASTROLOGIA,
    themeColor: astrologiaTxt,
    textShadow: astroTextShadow,
  },
  {
    id: "astro-signos",
    titulo: "Los Signos",
    disciplina: "Astrología",
    cover: "/viñetas/astrologia/portadasignos.webp",
    vinetas: VINETAS_SIGNOS,
    themeColor: astrologiaTxt,
    textShadow: astroTextShadow,
  },
  {
    id: "astro-casas",
    titulo: "Las Casas",
    disciplina: "Astrología",
    cover: "/viñetas/astrologia/portadacasas.webp",
    vinetas: VINETAS_CASAS,
    themeColor: astrologiaTxt,
    textShadow: astroTextShadow,
  },
  {
    id: "astro-planetas",
    titulo: "Los Planetas",
    disciplina: "Astrología",
    cover: "/viñetas/astrologia/portadaplanetas.webp",
    vinetas: VINETAS_PLANETAS,
    themeColor: astrologiaTxt,
    textShadow: astroTextShadow,
  },

  // ── Ayurveda / Hinduismo ──
  {
    id: "hindu-elementos",
    titulo: "Los Elementos",
    disciplina: "Ayurveda",
    cover: "/viñetas/hinduismo/elementos/elementosayurveda.webp",
    vinetas: HINDU_ELEMENTOS,
    themeColor: ayurvedaTxt,
    disciplinaBgImage: "/img/fondos/hinduismo.webp",
    disciplinaBgColor: ayurvedaBg,
    textShadow: hinduTextShadow,
  },
  {
    id: "hindu-doshas",
    titulo: "Los Doṣhas",
    disciplina: "Ayurveda",
    cover: "/viñetas/hinduismo/doshas/doshasportada.webp",
    vinetas: HINDU_DOSHAS,
    themeColor: ayurvedaTxt,
    disciplinaBgImage: "/img/fondos/hinduismo.webp",
    disciplinaBgColor: ayurvedaBg,
    textShadow: hinduTextShadow,
  },

  // ── Psicología ──
  {
    id: "psicologia-intro",
    titulo: "El origen del sufrimiento",
    disciplina: "Psicología",
    cover: "/viñetas/psicologia/sufrimiento/sufrimiento1.webp",
    vinetas: INTRO_PSICOLOGIA,
    themeColor: neuropsicologiaTxt,
    disciplinaBgImage: "/img/fondos/psciologia.webp",
    disciplinaBgColor: neuropsicologiaBg,
    textShadow: psicoTextShadow,
  },
  {
    id: "psicologia-etapas",
    titulo: "Cómo te construiste",
    disciplina: "Psicología",
    cover: "/viñetas/psicologia/compromiso/compromiso1.webp",
    vinetas: COMIC_COMPROMISO,
    themeColor: neuropsicologiaTxt,
    disciplinaBgImage: "/img/fondos/psciologia.webp",
    disciplinaBgColor: neuropsicologiaBg,
    textShadow: psicoTextShadow,
  },

  // ── Nutrición ── (acento claro nutricionBg + letra oscura nutricionTxt, sin sombra)
  {
    id: "nutricion-intro",
    titulo: "Eres lo que absorbes",
    disciplina: "Nutrición",
    cover: "/viñetas/nutricion/intro/nutricomic1.webp",
    vinetas: NUTRICION_INTRO,
    themeColor: nutricionBg,
    textColor: nutricionTxt,
    cardColor: nutricionTxt,
    disciplinaBgImage: "/img/fondos/nutri.webp",
    disciplinaBgColor: nutricionBg,
    textShadow: "none",
  },
  {
    id: "nutricion-calorias",
    titulo: "Las calorías no existen",
    disciplina: "Nutrición",
    cover: "/viñetas/nutricion/calorias/calorias9.webp",
    vinetas: NUTRICION_CALORIAS,
    themeColor: nutricionBg,
    textColor: nutricionTxt,
    cardColor: nutricionTxt,
    disciplinaBgImage: "/img/fondos/nutri.webp",
    disciplinaBgColor: nutricionBg,
    textShadow: "none",
  },
  nutriEntry("nutricion-carbohidratos", "Carbohidratos", "/viñetas/nutricion/carbohidratos/carbohidratos1.webp", COMICS_NUTRIENTES.carbohidratos),
  nutriEntry("nutricion-vitaminas", "Vitaminas", "/viñetas/nutricion/vitaminas/vitaminas1.webp", COMICS_NUTRIENTES.vitaminas),
  nutriEntry("nutricion-minerales", "Minerales", "/viñetas/nutricion/minerales/minerales1.webp", COMICS_NUTRIENTES.minerales),
  nutriEntry("nutricion-agua", "Agua", "/viñetas/nutricion/agua/agua1.webp", COMICS_NUTRIENTES.agua),
  nutriEntry("nutricion-microbiota", "La microbiota", "/viñetas/nutricion/microbiota/microbiota1.webp", NUTRICION_MICROBIOTA),
  nutriEntry("nutricion-hambre", "El hambre: una mirada holística", "/recorrido/nutricion/hambre/hambre1.webp", sinNegrita(HAMBRE_HOLISTICA)),
  nutriEntry("nutricion-integral", "Lo integral", "/viñetas/nutricion/integral/integral1.webp", NUTRICION_INTEGRAL),
  // ── Las cinco lecturas de «¿De dónde vienen los nutrientes?» ──
  // (los ciclos de la naturaleza, el suelo, la planta, la hoja y el fruto)
  ...ORIGEN_NUTRIENTES.map((l) =>
    nutriEntry(`nutricion-origen-${l.key}`, l.titulo, l.cover, l.vinetas)),

  // ── Cábala ── (el Origen ya va arriba; aquí las dos series del Árbol)
  {
    id: "cabala-sefirot",
    titulo: "Las diez dimensiones del alma",
    disciplina: "Cábala",
    cover: "/recorrido/cabala/sefirot/keter.webp",
    vinetas: CABALA_ILUSTRACIONES_VINETAS,
    themeColor: cabalaTxt,
    disciplinaBgImage: "/img/fondos/cabala.webp",
    disciplinaBgColor: cabalaBg,
  },
  {
    id: "cabala-senderos",
    titulo: "Los 22 senderos",
    disciplina: "Cábala",
    cover: "/recorrido/cabala/senderos/aleph.webp",
    vinetas: CABALA_SENDERO_VINETAS,
    themeColor: cabalaTxt,
    disciplinaBgImage: "/img/fondos/cabala.webp",
    disciplinaBgColor: cabalaBg,
  },

  // ── Medicina China ──
  {
    id: "tcm-yinyang",
    titulo: "El Yin Yang",
    disciplina: "Medicina China",
    cover: "/viñetas/tcm/yinyang/yinyang.webp",
    vinetas: TCM_YINYANG,
    themeColor: tcmTxt,
    disciplinaBgImage: "/img/fondos/tcm.webp",
    disciplinaBgColor: tcmBg,
  },
  {
    id: "tcm-elementos",
    titulo: "Los Cinco Elementos",
    disciplina: "Medicina China",
    cover: "/viñetas/tcm/elementos/portadaelementos.webp",
    vinetas: TCM_ELEMENTOS,
    themeColor: tcmTxt,
    disciplinaBgImage: "/img/fondos/tcm.webp",
    disciplinaBgColor: tcmBg,
  },
  {
    id: "tcm-alma",
    titulo: "El Alma Humana",
    disciplina: "Medicina China",
    cover: "/viñetas/tcm/alma/alma7.webp",
    vinetas: TCM_ALMA,
    themeColor: tcmTxt,
    disciplinaBgImage: "/img/fondos/tcm.webp",
    disciplinaBgColor: tcmBg,
  },
];
