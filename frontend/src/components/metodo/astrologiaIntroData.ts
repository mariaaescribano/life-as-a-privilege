// ─────────────────────────────────────────────────────────────────────────────
// LAS TARJETAS DE LA PÁGINA «INTRODUCCIÓN» de astrología: Signos, Casas, Planetas
// y Aspectos. NO se escribe ningún texto nuevo aquí: foto y frase salen de los
// cómics que ya existen (las viñetas de cada cosa), así que lo que se lee en la
// tarjeta es exactamente lo que dice el cómic al pulsarla.
//
//   · Signos y casas → la 2ª línea de la viñeta (la 1ª es el nombre en mayúsculas).
//   · Planetas y aspectos → la 1ª línea de la viñeta.
// ─────────────────────────────────────────────────────────────────────────────
import type { Vineta } from "./ComicViewer";
import { VINETAS_SIGNOS, VINETAS_CASAS, VINETAS_PLANETAS } from "./ComicAstrologiaModal";
import { VINETAS_ASPECTOS } from "./comicAspectos";
import { ZODIAC_SIGNS, cuerpoByKey } from "./astrologiaData";

export interface TarjetaAstro {
  clave: string;
  titulo: string;
  foto: string;
  frase: string;
}

export interface SeccionAstro {
  clave: "signos" | "casas" | "planetas" | "aspectos";
  /** Las viñetas de su cómic, en el mismo orden que las tarjetas (para abrirlo en la tarjeta pulsada). */
  vinetas: Vineta[];
  tarjetas: TarjetaAstro[];
}

const nombreArchivo = (src: string) => (src.split("/").pop() ?? "").replace(/\.\w+$/, "");
/** «CASA VIII» → «Casa VIII». */
const titulo = (s: string) => s.charAt(0) + s.slice(1).toLowerCase().replace(/\b(i{1,3}|iv|vi{0,3}|ix|x{1,2}i{0,3})\b/gi, (m) => m.toUpperCase());

export const seccionesAstro = (): SeccionAstro[] => [
  {
    clave: "signos",
    vinetas: VINETAS_SIGNOS,
    tarjetas: VINETAS_SIGNOS.map((v, i) => ({
      clave: nombreArchivo(v.src),
      titulo: ZODIAC_SIGNS[i]?.name ?? v.paragraphs[0],
      foto: v.src,
      frase: v.paragraphs[1] ?? "",
    })),
  },
  {
    clave: "casas",
    vinetas: VINETAS_CASAS,
    tarjetas: VINETAS_CASAS.map((v) => ({
      clave: nombreArchivo(v.src),
      titulo: titulo(v.paragraphs[0]),
      foto: v.src,
      frase: v.paragraphs[1] ?? "",
    })),
  },
  {
    clave: "planetas",
    vinetas: VINETAS_PLANETAS,
    tarjetas: VINETAS_PLANETAS.map((v) => {
      const k = nombreArchivo(v.src);
      return { clave: k, titulo: cuerpoByKey(k)?.label ?? k, foto: v.src, frase: v.paragraphs[0] ?? "" };
    }),
  },
  {
    clave: "aspectos",
    vinetas: VINETAS_ASPECTOS,
    tarjetas: VINETAS_ASPECTOS.map((v) => ({
      clave: nombreArchivo(v.src),
      titulo: v.titulo ?? nombreArchivo(v.src),
      foto: v.src,
      frase: v.paragraphs[0] ?? "",
    })),
  },
];
