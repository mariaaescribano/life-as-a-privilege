import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import {
  ALIMENTOS_MACROS, GRUPOS_MACRO, TINO, CIERRE_PARTIDA,
  type AlimentoMacros, type GrupoMacro, type Tino,
} from "./MacrosAlimentos";
import {
  GRUPOS_MACRO_EN, TINO_EN, CIERRE_PARTIDA_EN, alimentosMacrosTraducidos,
} from "./MacrosAlimentos.en";

/**
 * «Cuenta los macros» en el idioma activo.
 *
 * El español manda: el orden, la foto, el color, los gramos, las kcal y la
 * `key` salen siempre de `MacrosAlimentos.ts`. Del inglés se toma solo el
 * texto: lo que no esté traducido se lee en español en vez de desaparecer.
 *
 * OJO: son hooks, hay que llamarlos AL PINTAR. Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export const useAlimentosMacros = (): AlimentoMacros[] => {
  const { idioma } = useIdioma();
  return useMemo(() => alimentosMacrosTraducidos(ALIMENTOS_MACROS, idioma), [idioma]);
};

/** Los rótulos del juego: el grupo del alimento, el tino de cada macro y el
 *  cierre de la partida. Los colores salen siempre del español. */
export const useEtiquetasMacros = () => {
  const { idioma } = useIdioma();
  return useMemo(() => ({
    grupo: (g: GrupoMacro) => ({
      ...GRUPOS_MACRO[g],
      label: (idioma === "en" ? GRUPOS_MACRO_EN[g] : undefined) ?? GRUPOS_MACRO[g].label,
    }),
    tino: (tn: Tino) => ({
      ...TINO[tn],
      label: (idioma === "en" ? TINO_EN[tn] : undefined) ?? TINO[tn].label,
    }),
    cierre: idioma === "en" ? CIERRE_PARTIDA_EN : CIERRE_PARTIDA,
  }), [idioma]);
};
