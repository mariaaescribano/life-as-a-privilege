import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import {
  ALIMENTOS, FUNCIONES, GRUPO_MOLECULA_LABEL, MACRO_LABEL, MOLECULAS,
  molsDeAlimento,
  type Alimento, type FuncionMolecula, type GrupoMolecula, type Molecula,
} from "./AlimentosNutricion";
import {
  ALIMENTOS_EN, FUNCIONES_EN, GRUPO_MOLECULA_LABEL_EN, MACRO_LABEL_EN,
  alimentosTraducidos, moleculaTraducida,
} from "./AlimentosNutricion.en";

/**
 * La Biblioteca de alimentos en el idioma activo.
 *
 * El español manda: el orden, la foto, el grupo, los macros, los porcentajes y
 * la `key` —que es lo que se guarda en la BD (el plato, «Diseña tu día», lo
 * leído)— salen siempre de `AlimentosNutricion.ts`. Del inglés se toma solo el
 * texto, alimento a alimento y molécula a molécula: lo que no esté traducido se
 * lee en español en vez de desaparecer.
 *
 * OJO: son hooks, hay que llamarlos AL PINTAR. Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export const useAlimentos = (): Alimento[] => {
  const { idioma } = useIdioma();
  return useMemo(() => alimentosTraducidos(ALIMENTOS, idioma), [idioma]);
};

/** Un alimento suelto por su `key`, en el idioma activo. */
export const useAlimento = (key: string | undefined): Alimento | undefined => {
  const alimentos = useAlimentos();
  return key ? alimentos.find((a) => a.key === key) : undefined;
};

/** Las moléculas de un alimento (con su % si lo tiene), en el idioma activo. */
export const useMolsDeAlimento = (a: Alimento | undefined): { m: Molecula; pct?: number }[] => {
  const { idioma } = useIdioma();
  return useMemo(
    () => (a ? molsDeAlimento(a).map((x) => ({ ...x, m: moleculaTraducida(x.m, idioma) })) : []),
    [a, idioma],
  );
};

/** TODAS las moléculas en el idioma activo, indexadas por `key`. Para listas
 *  donde no se puede llamar a un hook por elemento (dentro de un `.map`). */
export const useMoleculas = (): Record<string, Molecula> => {
  const { idioma } = useIdioma();
  return useMemo(() => {
    if (idioma === "es") return MOLECULAS;
    return Object.fromEntries(
      Object.entries(MOLECULAS).map(([k, m]) => [k, moleculaTraducida(m, idioma)]),
    );
  }, [idioma]);
};

/** Una molécula suelta por su `key`, en el idioma activo. */
export const useMolecula = (key: string | undefined): Molecula | undefined => {
  const { idioma } = useIdioma();
  return useMemo(() => {
    const m = key ? MOLECULAS[key] : undefined;
    return m ? moleculaTraducida(m, idioma) : undefined;
  }, [key, idioma]);
};

/**
 * Los rótulos de la biblioteca en el idioma activo: la píldora de la función,
 * el título del grupo de moléculas y la leyenda de la barra de macros. El COLOR
 * sale siempre del español (no se traduce un color).
 */
export const useEtiquetasAlimentos = () => {
  const { idioma } = useIdioma();
  return useMemo(() => ({
    /** Píldora de la función: { label, color }. */
    funcion: (f: FuncionMolecula) => ({
      ...FUNCIONES[f],
      label: idioma === "en" ? FUNCIONES_EN[f] ?? FUNCIONES[f].label : FUNCIONES[f].label,
    }),
    /** Título del grupo de moléculas («Carbohidratos», «Vitaminas»…). */
    grupoMolecula: (g: GrupoMolecula) =>
      (idioma === "en" ? GRUPO_MOLECULA_LABEL_EN[g] : undefined) ?? GRUPO_MOLECULA_LABEL[g],
    /** Leyenda de la barra de macros («Carbohidrato», «Proteína», «Grasa»). */
    macro: (k: keyof typeof MACRO_LABEL) =>
      (idioma === "en" ? MACRO_LABEL_EN[k] : undefined) ?? MACRO_LABEL[k],
  }), [idioma]);
};

/** Recordatorio: `ALIMENTOS_EN` es solo texto; si un alimento nuevo no está
 *  traducido, `alimentosTraducidos` lo deja en español y no se rompe nada. */
export const alimentosSinTraducir = (): string[] =>
  ALIMENTOS.filter((a) => !ALIMENTOS_EN[a.key]).map((a) => a.key);
