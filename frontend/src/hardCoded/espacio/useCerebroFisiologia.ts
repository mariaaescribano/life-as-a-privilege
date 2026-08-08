import { useIdioma } from "../../i18n";
import {
  PARTES_CEREBRO,
  ZONAS_CEREBRO,
  FRASE_CEREBRO,
  type ParteCerebro,
  type ZonaCerebro,
} from "./CerebroFisiologia";
import { partesCerebroEn, zonasCerebroEn, fraseCerebroEn } from "./CerebroFisiologia.en";

/**
 * Las partes del cerebro en el idioma activo, ya agrupadas por zona.
 *
 * La estructura la manda SIEMPRE el español (orden, `key`, `zona`, `color` y
 * `foto`); del inglés solo se toma el texto, y parte a parte: la que no esté
 * traducida se queda en español en vez de desaparecer.
 *
 * OJO: hay que llamarlo AL PINTAR. Si el texto se resolviera al importar el
 * módulo, se quedaría congelado en el idioma con el que arrancó la página.
 */
export type GrupoCerebro = {
  zona: ZonaCerebro;
  titulo: string;
  entradilla: string;
  partes: ParteCerebro[];
};

export const useCerebroFisiologia = (): {
  partes: ParteCerebro[];
  grupos: GrupoCerebro[];
  frase: string;
} => {
  const { idioma } = useIdioma();

  const partes =
    idioma === "es"
      ? PARTES_CEREBRO
      : PARTES_CEREBRO.map((p) => {
          const en = partesCerebroEn[p.key];
          return en ? { ...p, ...en } : p;
        });

  const grupos = ZONAS_CEREBRO.map((z) => ({
    zona: z.zona,
    titulo: idioma === "es" ? z.titulo : zonasCerebroEn[z.zona]?.titulo ?? z.titulo,
    entradilla: idioma === "es" ? z.entradilla : zonasCerebroEn[z.zona]?.entradilla ?? z.entradilla,
    partes: partes.filter((p) => p.zona === z.zona),
  }));

  return {
    partes,
    grupos,
    frase: idioma === "es" ? FRASE_CEREBRO : fraseCerebroEn,
  };
};
