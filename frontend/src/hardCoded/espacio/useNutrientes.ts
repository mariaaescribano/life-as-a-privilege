import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import {
  NUTRIENTES, NUTRIENTES_MACRO, NUTRIENTES_MICRO, type Nutriente,
} from "./NutrientesNutricion";
import { nutrientesTraducidos } from "./NutrientesNutricion.en";

/**
 * Los nutrientes en el idioma activo.
 *
 * La estructura la manda SIEMPRE el español (el orden de los grupos, el de las
 * tarjetas —que es el que elige la foto—, los colores y las siglas); del inglés
 * solo se toma el texto, y grupo a grupo: el que no esté traducido se queda en
 * español en vez de desaparecer. Es la misma regla que ya usan los órganos de
 * Fisiología y los elementos de Medicina China.
 *
 * OJO: son hooks, hay que llamarlos AL PINTAR. Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export const useNutrientes = (): Nutriente[] => {
  const { idioma } = useIdioma();
  return useMemo(() => nutrientesTraducidos(NUTRIENTES, idioma), [idioma]);
};

/** Macronutrientes (carbohidratos, fibra, grasas, colesterol, proteínas, agua,
 *  etanol): los de la primera página. */
export const useNutrientesMacro = (): Nutriente[] => {
  const { idioma } = useIdioma();
  return useMemo(() => nutrientesTraducidos(NUTRIENTES_MACRO, idioma), [idioma]);
};

/** Micronutrientes (vitaminas, minerales, fitoquímicos, edulcorantes, drogas):
 *  los de la segunda página. */
export const useNutrientesMicro = (): Nutriente[] => {
  const { idioma } = useIdioma();
  return useMemo(() => nutrientesTraducidos(NUTRIENTES_MICRO, idioma), [idioma]);
};

/** Un grupo suelto por su `key`, en el idioma activo. */
export const useNutriente = (key: string | undefined): Nutriente | undefined => {
  const nutrientes = useNutrientes();
  return key ? nutrientes.find((n) => n.key === key) : undefined;
};
