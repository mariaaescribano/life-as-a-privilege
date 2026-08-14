import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import { PLATO_MACROS, PLATO_FUERA, type PlatoAlimento, type PlatoMacro } from "./PlatoHarvard";
import { platoTraducido } from "./PlatoHarvard.en";
import { ALIMENTOS_EN } from "./AlimentosNutricion.en";

/**
 * El plato de Harvard en el idioma activo.
 *
 * El español manda: el orden de los sectores, su color, su proporción, los
 * alimentos que caen en cada uno y las `key` —lo que se guarda como plato
 * hecho— salen de `PlatoHarvard.ts`. Del inglés se toma el rótulo del sector y,
 * alimento a alimento, su nombre de la Biblioteca molecular (fuente única: el
 * plato no tiene nombres propios).
 *
 * OJO: son hooks, hay que llamarlos AL PINTAR. Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
const alimentoPlatoTraducido = (a: PlatoAlimento, idioma: "es" | "en"): PlatoAlimento => {
  if (idioma === "es") return a;
  const en = ALIMENTOS_EN[a.key];
  return en ? { ...a, label: en.nombre } : a;
};

export const usePlatoMacros = (): PlatoMacro[] => {
  const { idioma } = useIdioma();
  return useMemo(
    () => platoTraducido(PLATO_MACROS, idioma).map((m) => ({
      ...m,
      alimentos: m.alimentos.map((a) => alimentoPlatoTraducido(a, idioma)),
    })),
    [idioma],
  );
};

/** Un sector suelto por su `key`, en el idioma activo. */
export const usePlatoMacroByKey = (): ((key: string) => PlatoMacro | undefined) => {
  const macros = usePlatoMacros();
  return useMemo(() => (key: string) => macros.find((m) => m.key === key), [macros]);
};

/** Los alimentos «trampa» que quedan fuera del plato, en el idioma activo. */
export const usePlatoFuera = (): PlatoAlimento[] => {
  const { idioma } = useIdioma();
  return useMemo(() => PLATO_FUERA.map((a) => alimentoPlatoTraducido(a, idioma)), [idioma]);
};
