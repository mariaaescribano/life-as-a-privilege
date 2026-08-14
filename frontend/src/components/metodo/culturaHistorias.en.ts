// ─────────────────────────────────────────────────────────────────────────
// LAS HISTORIAS DE CULTURA, EN INGLÉS · el montaje
//
// Aquí NO hay texto: aquí está la fontanería. El texto vive en un fichero por
// Historia (`culturaHistoriaUniversal.en.ts`, `…Religiones.en.ts`…), y este
// módulo lo empareja con el español y devuelve la Historia lista para pintar.
//
// El español MANDA. De él salen siempre: el orden de las eras, el orden de los
// momentos, las `key` (que son lo que va en la URL y en lo que se guarda del
// recorrido) y las FOTOS. Del inglés se toma solo el texto, momento a momento.
//
// Y se toma momento a momento a propósito: son más de cuatrocientos y no van a
// traducirse de una sentada. Lo que todavía no esté aquí se sigue leyendo en
// español —esa era, ese momento— y el resto de la página ya está en inglés. No
// hay ningún estado intermedio roto.
//
// CÓMO SE ESCRIBE UN MOMENTO TRADUCIDO: igual que en español, con los mismos
// campos que recibe el `hito()` del fichero español (titulo, fecha, pregunta,
// cuerpo, dato, extras). Las viñetas se montan aquí con la misma receta, así que
// no hay que repetir el título dos veces ni acordarse de dónde va el «Dato
// curioso».
// ─────────────────────────────────────────────────────────────────────────
import type { Idioma } from "../../i18n";
import type { Vineta } from "./ComicViewer";
import type { HistoriaDef } from "./culturaHistorias";
import type { HitoHistoria, SubHito } from "./culturaHistoriaUniversal";

import { HISTORIA_UNIVERSAL_EN } from "./culturaHistoriaUniversal.en";
import { HISTORIA_RELIGIONES_EN } from "./culturaHistoriaReligiones.en";
import { HISTORIA_FILOSOFIA_EN } from "./culturaHistoriaFilosofia.en";
import { HISTORIA_CIENCIA_EN } from "./culturaHistoriaCiencia.en";
import { HISTORIA_MEDICINA_EN } from "./culturaHistoriaMedicina.en";
import { HISTORIA_ARTE_EN } from "./culturaHistoriaArte.en";

/** El antetítulo de una página «Profundiza». Constante: no se repite momento a
 *  momento en los ficheros de texto. */
export const PROFUNDIZA_EN = "Go deeper";

/** Una página «Profundiza» traducida (una viñeta más, con la misma foto). */
export interface ProfundizaTexto {
  titulo: string;
  cuerpo: string[];
  /** Uno o dos datos curiosos; el segundo empieza por «Fun fact II: ». */
  dato?: string | string[];
}

/**
 * UN MOMENTO traducido: los mismos campos que se le pasan al `hito()` español.
 *
 * `titulo` sirve para las dos cosas (el círculo de la línea del tiempo y el
 * encabezado del cómic), como en español. `fecha` es el antetítulo del cómic: se
 * traduce siempre («Hace 7 millones de años» → «7 million years ago»), y si se
 * omite se queda la del español (sirve para las que son solo un número: 1789).
 */
export interface MomentoTexto {
  titulo: string;
  fecha?: string;
  /** La pregunta gancho. Casi ningún momento la lleva. */
  pregunta?: string;
  cuerpo?: string[];
  dato?: string | string[];
  extras?: ProfundizaTexto[];
}

/** UNA ERA traducida: su rótulo, su época y los momentos que ya estén escritos. */
export interface EraTexto {
  titulo?: string;
  /** La época que se lee bajo el círculo («hasta ~3500 a. C.»). */
  anio?: string;
  /** Los momentos, por su `key` española. Los que falten se leen en español. */
  momentos?: Record<string, MomentoTexto>;
}

/** UNA HISTORIA traducida: sus eras, por su `key` española. */
export type HistoriaTexto = Record<string, EraTexto>;

const enLista = (x?: string | string[]): string[] =>
  x == null ? [] : Array.isArray(x) ? x : [x];

/**
 * Monta las viñetas de un momento con la misma receta que el `hito()` español:
 * viñeta principal (pregunta + cuerpo + datos curiosos) y una viñeta más por
 * cada página «Profundiza». La FOTO es la del español: la misma para todas las
 * viñetas del momento, y la que ya está subida al servidor.
 */
const vinetasDeMomento = (sub: SubHito, m: MomentoTexto): Vineta[] => {
  const src = sub.foto ?? sub.vinetas[0]?.src ?? "";
  const paragraphs = [
    ...(m.pregunta ? [m.pregunta] : []),
    ...(m.cuerpo ?? []),
    ...enLista(m.dato),
  ];
  // Un momento sin cuerpo escrito no tiene cómic que pintar: se deja el español
  // (mejor leerlo en español que abrir un cómic vacío).
  if (!paragraphs.length) return sub.vinetas;

  const vinetas: Vineta[] = [{
    src,
    eyebrow: m.fecha ?? sub.vinetas[0]?.eyebrow,
    titulo: m.titulo,
    paragraphs,
  }];
  (m.extras ?? []).forEach((e) => {
    vinetas.push({
      src,
      eyebrow: PROFUNDIZA_EN,
      titulo: e.titulo,
      paragraphs: [...e.cuerpo, ...enLista(e.dato)],
    });
  });
  return vinetas;
};

/** Un momento en el idioma activo. Sin traducción, el español tal cual. */
const momentoTraducido = (sub: SubHito, m: MomentoTexto | undefined): SubHito =>
  m ? { ...sub, titulo: m.titulo, vinetas: vinetasDeMomento(sub, m) } : sub;

/** Una era en el idioma activo. Los momentos sin traducir siguen en español. */
const eraTraducida = (era: HitoHistoria, txt: EraTexto | undefined): HitoHistoria => {
  if (!txt) return era;
  return {
    ...era,
    titulo: txt.titulo ?? era.titulo,
    anio: txt.anio ?? era.anio,
    subhitos: era.subhitos.map((s) => momentoTraducido(s, txt.momentos?.[s.key])),
  };
};

/** El texto inglés de cada Historia, por la misma clave que usa la ruta. */
const HISTORIAS_TEXTO_EN: Record<string, HistoriaTexto> = {
  universal: HISTORIA_UNIVERSAL_EN,
  religiones: HISTORIA_RELIGIONES_EN,
  filosofia: HISTORIA_FILOSOFIA_EN,
  ciencia: HISTORIA_CIENCIA_EN,
  medicina: HISTORIA_MEDICINA_EN,
  arte: HISTORIA_ARTE_EN,
};

/**
 * Una Historia en el idioma activo.
 *
 * El `titulo` de la Historia NO se toca aquí: sale del diccionario
 * (`tituloHistoria`), porque se cita en tres sitios y los tres tienen que decir
 * lo mismo. Aquí se traduce lo de dentro: eras y momentos.
 */
export const historiaTraducida = (
  historia: HistoriaDef | undefined,
  historiaKey: string | undefined,
  idioma: Idioma,
): HistoriaDef | undefined => {
  if (!historia) return undefined;
  if (idioma === "es") return historia;
  const txt = historiaKey ? HISTORIAS_TEXTO_EN[historiaKey] : undefined;
  if (!txt) return historia;
  return { ...historia, hitos: historia.hitos.map((era) => eraTraducida(era, txt[era.key])) };
};

/** Recordatorio para saber qué queda: los momentos de una Historia que todavía
 *  no tienen texto en inglés, con su `key`. */
export const momentosSinTraducir = (
  historia: HistoriaDef | undefined,
  historiaKey: string,
): string[] => {
  const txt = HISTORIAS_TEXTO_EN[historiaKey] ?? {};
  return (historia?.hitos ?? []).flatMap((era) =>
    era.subhitos
      .filter((s) => !txt[era.key]?.momentos?.[s.key])
      .map((s) => `${era.key}/${s.key}`),
  );
};
