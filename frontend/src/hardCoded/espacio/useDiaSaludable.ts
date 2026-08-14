import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import {
  ALIMENTOS_DIA, GRUPOS_DIA, REPARTO_COMIDAS,
  type AlimentoDia, type ComidaDia, type GrupoDia,
} from "./DiaSaludable";
import { GRUPOS_DIA_EN, alimentosDiaTraducidos, comidasTraducidas } from "./DiaSaludable.en";

/**
 * «Diseña tu día» en el idioma activo.
 *
 * El español manda: el orden, el color, las kcal, los gramos, el % de cada
 * comida y las `key` —que son lo que se guarda en la BD con el día montado—
 * salen siempre de `DiaSaludable.ts`. Del inglés se toma solo el texto (el «a
 * ojo», el nombre del grupo y el de la comida): lo que no esté traducido se lee
 * en español en vez de desaparecer.
 *
 * OJO: son hooks, hay que llamarlos AL PINTAR. Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export const useAlimentosDia = (): AlimentoDia[] => {
  const { idioma } = useIdioma();
  return useMemo(() => alimentosDiaTraducidos(ALIMENTOS_DIA, idioma), [idioma]);
};

/** Un alimento del día por su `key`, en el idioma activo. */
export const useAlimentoDiaByKey = (): ((k: string) => AlimentoDia | undefined) => {
  const alimentos = useAlimentosDia();
  return useMemo(() => (k: string) => alimentos.find((a) => a.key === k), [alimentos]);
};

/** Las pestañas de la paleta (mismo orden y color; solo cambia el rótulo). */
export const useGruposDia = (): { key: GrupoDia; label: string; color: string }[] => {
  const { idioma } = useIdioma();
  return useMemo(() => {
    if (idioma === "es") return GRUPOS_DIA;
    return GRUPOS_DIA.map((g) => ({ ...g, label: GRUPOS_DIA_EN[g.key] ?? g.label }));
  }, [idioma]);
};

/** El reparto de comidas (3, 4 o 5) con sus rótulos en el idioma activo. */
export const useRepartoComidas = (): Record<number, ComidaDia[]> => {
  const { idioma } = useIdioma();
  return useMemo(() => {
    if (idioma === "es") return REPARTO_COMIDAS;
    return Object.fromEntries(
      Object.entries(REPARTO_COMIDAS).map(([n, cs]) => [Number(n), comidasTraducidas(cs, idioma)]),
    );
  }, [idioma]);
};
