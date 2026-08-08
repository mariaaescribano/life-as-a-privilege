import { useIdioma } from "../../i18n";
import { temaByKey, type TemaProfundiza } from "./ProfundizaFisiologia";
import { temasProfundizaEn } from "./ProfundizaFisiologia.en";

/**
 * Un tema de Profundiza en el idioma activo.
 *
 * La estructura la manda SIEMPRE el español (orden, `key`, `zona`, `color` y
 * `foto`); del inglés solo se toma el texto, y pieza a pieza: lo que no esté
 * traducido se queda en español en vez de desaparecer. Así se puede ir
 * traduciendo tema a tema.
 *
 * OJO: hay que llamarlo AL PINTAR. Si el texto se resolviera al importar el
 * módulo, se quedaría congelado en el idioma con el que arrancó la página.
 */
export const useTemaProfundiza = (key: string): TemaProfundiza | undefined => {
  const { idioma } = useIdioma();
  const tema = temaByKey(key);
  if (!tema || idioma === "es") return tema;

  const en = temasProfundizaEn[tema.key];
  if (!en) return tema;

  return {
    ...tema,
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
