import { useIdioma } from "../../i18n";
import { vinetasEn } from "../../i18n/comics";
import { temaByKey, TEMAS_PROFUNDIZA, type TemaProfundiza } from "./ProfundizaFisiologia";
import { temasProfundizaEn } from "./ProfundizaFisiologia.en";

/**
 * Un tema de Profundiza traducido al inglés.
 *
 * La estructura la manda SIEMPRE el español (orden, `key`, `zona`, `color` y
 * `foto`); del inglés solo se toma el texto, y pieza a pieza: lo que no esté
 * traducido se queda en español en vez de desaparecer. Así se puede ir
 * traduciendo tema a tema.
 *
 * El cómic «antes de empezar» no vive aquí: va por el diccionario común de
 * cómics, con la clave `profundiza-<key>` (ver `i18n/comics`).
 */
const temaEn = (tema: TemaProfundiza): TemaProfundiza => {
  const en = temasProfundizaEn[tema.key];
  const comicIntro = tema.comicIntro
    ? vinetasEn(`profundiza-${tema.key}`, tema.comicIntro)
    : tema.comicIntro;
  if (!en) return { ...tema, comicIntro };

  return {
    ...tema,
    comicIntro,
    label: en.label ?? tema.label,
    resumen: en.resumen ?? tema.resumen,
    intro: en.intro ?? tema.intro,
    pista: en.pista ?? tema.pista,
    cierre: en.cierre ?? tema.cierre,
    zonas: tema.zonas?.map((z) => ({ ...z, ...(en.zonas?.[z.zona] ?? {}) })),
    fichas: tema.fichas.map((f) => {
      const t = en.fichas?.[f.key];
      return t ? { ...f, ...t } : f;
    }),
  };
};

/**
 * Un tema de Profundiza en el idioma activo.
 *
 * OJO: hay que llamarlo AL PINTAR. Si el texto se resolviera al importar el
 * módulo, se quedaría congelado en el idioma con el que arrancó la página.
 */
export const useTemaProfundiza = (key: string): TemaProfundiza | undefined => {
  const { idioma } = useIdioma();
  const tema = temaByKey(key);
  if (!tema || idioma === "es") return tema;
  return temaEn(tema);
};

/**
 * TODOS los temas en el idioma activo, en el orden del español. Lo usa la
 * rejilla del hub, que si no pintaría los nombres siempre en castellano aunque
 * el tema estuviera traducido.
 */
export const useTemasProfundiza = (): TemaProfundiza[] => {
  const { idioma } = useIdioma();
  return idioma === "es" ? TEMAS_PROFUNDIZA : TEMAS_PROFUNDIZA.map(temaEn);
};
