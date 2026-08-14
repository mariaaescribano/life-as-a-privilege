// ─────────────────────────────────────────────────────────────────────────
// NOMBRES DE ASTROLOGÍA EN INGLÉS (solo para PINTAR)
//
// Los signos y los cuerpos se guardan SIEMPRE con su nombre español: es la
// clave con la que se indexan los textos (TEXTOS_SIGNO["Géminis"]), la que
// viaja al backend en `metodo_astrologia.data` y la que dibuja el icono
// (GlifoSigno nombre="Géminis"). Si se tradujera el dato, el usuario que
// cambiara de idioma perdería su carta.
//
// Así que aquí no se traduce el DATO, solo su etiqueta. La regla es la de
// siempre en la casa: el español manda, y de aquí sale únicamente el rótulo.
//
// CÓMO USARLO
//   · Dentro de un componente:  const n = useNombresAstro();  n.signo("Géminis")
//     (es un hook: repinta al cambiar de idioma con el selector).
//   · Fuera de React (PDF, utilidades): nombreSigno("Géminis") lee el idioma
//     activo del espejo de módulo de i18n.
// ─────────────────────────────────────────────────────────────────────────
import { getIdioma, useIdioma } from "../../i18n";
import type { Idioma } from "../../i18n";
import { cuerpoByKey, type CuerpoKey } from "./astrologiaData";
import { ASPECTO_LABEL } from "./casasAspectos";
import type { TipoAspecto } from "./CartaAstral3D/types";

/** Los doce signos. Clave = nombre español (el dato), valor = rótulo inglés. */
const SIGNOS_EN: Record<string, string> = {
  "Aries": "Aries",
  "Tauro": "Taurus",
  "Géminis": "Gemini",
  "Cáncer": "Cancer",
  "Leo": "Leo",
  "Virgo": "Virgo",
  "Libra": "Libra",
  "Escorpio": "Scorpio",
  "Sagitario": "Sagittarius",
  "Capricornio": "Capricorn",
  "Acuario": "Aquarius",
  "Piscis": "Pisces",
};

/** Los quince cuerpos. Clave = `CuerpoKey` (que tampoco se traduce nunca). */
const CUERPOS_EN: Record<CuerpoKey, string> = {
  ascendente: "Ascendant",
  sol: "Sun",
  luna: "Moon",
  mercurio: "Mercury",
  venus: "Venus",
  marte: "Mars",
  jupiter: "Jupiter",
  saturno: "Saturn",
  urano: "Uranus",
  neptuno: "Neptune",
  pluton: "Pluto",
  quiron: "Chiron",
  lilith: "Lilith",
  nodoNorte: "North Node",
  nodoSur: "South Node",
};

/** Los siete aspectos. Clave = `TipoAspecto` (el dato, tampoco se traduce). */
const ASPECTOS_EN: Record<string, string> = {
  conjuncion: "Conjunction",
  oposicion: "Opposition",
  trigono: "Trine",
  cuadratura: "Square",
  sextil: "Sextile",
  semisextil: "Semisextile",
  quincuncio: "Quincunx",
};

/** El rótulo de un signo. Lo que no esté traducido se queda en español. */
export const nombreSigno = (
  signo?: string | null,
  idioma: Idioma = getIdioma(),
): string => {
  if (!signo) return "";
  return idioma === "en" ? SIGNOS_EN[signo] ?? signo : signo;
};

/** El rótulo de un cuerpo, por su clave (`sol`, `nodoNorte`…). */
export const nombreCuerpo = (
  key?: CuerpoKey | string | null,
  idioma: Idioma = getIdioma(),
): string => {
  if (!key) return "";
  const cuerpo = cuerpoByKey(String(key));
  if (idioma !== "en") return cuerpo?.label ?? String(key);
  return CUERPOS_EN[key as CuerpoKey] ?? cuerpo?.label ?? String(key);
};

/** El rótulo de un aspecto: «Trígono» / "Trine". El símbolo (☌ △ □…) es el
 *  mismo en los dos idiomas y sale siempre de `ASPECTO_SYMBOL`. */
export const nombreAspecto = (
  tipo?: string | null,
  idioma: Idioma = getIdioma(),
): string => {
  if (!tipo) return "";
  const es = ASPECTO_LABEL[tipo as TipoAspecto] ?? tipo;
  return idioma === "en" ? ASPECTOS_EN[tipo] ?? es : es;
};

/** «Casa 7» / «House 7». */
export const etiquetaCasa = (
  casa: number | string,
  idioma: Idioma = getIdioma(),
): string => (idioma === "en" ? `House ${casa}` : `Casa ${casa}`);

/** «Casa» / «House» a secas (rótulos, pestañas del carrusel). */
export const palabraCasa = (idioma: Idioma = getIdioma()): string =>
  idioma === "en" ? "House" : "Casa";

/** «Signo» / «Sign» a secas. */
export const palabraSigno = (idioma: Idioma = getIdioma()): string =>
  idioma === "en" ? "Sign" : "Signo";

/**
 * «Luna en Géminis» / «Moon in Gemini». En un solo sitio porque el conector
 * cambia de idioma (en/in) y lo pintan cuatro páginas distintas.
 */
export const cuerpoEnSigno = (
  key: CuerpoKey | string,
  signo?: string | null,
  idioma: Idioma = getIdioma(),
): string =>
  `${nombreCuerpo(key, idioma)} ${idioma === "en" ? "in" : "en"} ${nombreSigno(signo, idioma)}`;

/** «Luna en Casa 4» / «Moon in House 4». */
export const cuerpoEnCasa = (
  key: CuerpoKey | string,
  casa: number | string,
  idioma: Idioma = getIdioma(),
): string =>
  `${nombreCuerpo(key, idioma)} ${idioma === "en" ? "in" : "en"} ${etiquetaCasa(casa, idioma)}`;

/**
 * Todos los rótulos de astrología atados al idioma activo. Es un hook: usa el
 * contexto, así que la página repinta sola al cambiar de idioma.
 */
export function useNombresAstro() {
  const { idioma } = useIdioma();
  return {
    idioma,
    signo: (s?: string | null) => nombreSigno(s, idioma),
    cuerpo: (k?: CuerpoKey | string | null) => nombreCuerpo(k, idioma),
    aspecto: (tipo?: string | null) => nombreAspecto(tipo, idioma),
    casa: (c: number | string) => etiquetaCasa(c, idioma),
    palabraCasa: () => palabraCasa(idioma),
    palabraSigno: () => palabraSigno(idioma),
    enSigno: (k: CuerpoKey | string, s?: string | null) => cuerpoEnSigno(k, s, idioma),
    enCasa: (k: CuerpoKey | string, c: number | string) => cuerpoEnCasa(k, c, idioma),
  };
}
