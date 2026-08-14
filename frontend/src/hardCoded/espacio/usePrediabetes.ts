import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import {
  PREDIABETES_PREGUNTAS, PREDIABETES_INTRO, PREDIABETES_ESPERANZA, PREDIABETES_BANDAS,
  SENALES_ALERTA, SENALES_INTRO, CINTURA_AYUDA, bandaPrediabetes, calcularPrediabetes,
  type BandaPrediabetes, type PrediabetesData, type PreguntaPrediabetes,
  type ResultadoPrediabetes, type SenalAlerta,
} from "./PrediabetesNutricion";
import {
  PREDIABETES_INTRO_EN, PREDIABETES_ESPERANZA_EN, SENALES_INTRO_EN, CINTURA_AYUDA_EN,
  bandaTraducida, preguntasPrediabetesTraducidas, resultadoTraducido, senalesTraducidas,
} from "./PrediabetesNutricion.en";

/**
 * «¿Cómo va tu azúcar?» (FINDRISC) en el idioma activo.
 *
 * El español manda: el orden, los puntos de cada opción, los cortes de las
 * bandas, los colores y las `key`/`value` —que son lo que se guarda en
 * `data.prediabetes`— salen siempre de `PrediabetesNutricion.ts`. Del inglés se
 * toma solo el texto: lo que no esté traducido se lee en español en vez de
 * desaparecer.
 *
 * OJO: son hooks, hay que llamarlos AL PINTAR. Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export const usePreguntasPrediabetes = (): PreguntaPrediabetes[] => {
  const { idioma } = useIdioma();
  return useMemo(() => preguntasPrediabetesTraducidas(PREDIABETES_PREGUNTAS, idioma), [idioma]);
};

/** Las señales de alerta (las que sí se notan, cuando ya se notan). */
export const useSenalesAlerta = (): SenalAlerta[] => {
  const { idioma } = useIdioma();
  return useMemo(() => senalesTraducidas(SENALES_ALERTA, idioma), [idioma]);
};

/** Los textos de cabecera, de las señales, de la cintura y del cierre. */
export const useTextosPrediabetes = () => {
  const { idioma } = useIdioma();
  return useMemo(() => (idioma === "en"
    ? {
        intro: PREDIABETES_INTRO_EN,
        senales: SENALES_INTRO_EN,
        cintura: CINTURA_AYUDA_EN,
        esperanza: PREDIABETES_ESPERANZA_EN,
      }
    : {
        intro: PREDIABETES_INTRO,
        senales: SENALES_INTRO,
        cintura: CINTURA_AYUDA,
        esperanza: PREDIABETES_ESPERANZA,
      }), [idioma]);
};

/** Las cinco bandas de riesgo, en el idioma activo (para pintar la escala). */
export const useBandasPrediabetes = (): BandaPrediabetes[] => {
  const { idioma } = useIdioma();
  return useMemo(() => PREDIABETES_BANDAS.map((b) => bandaTraducida(b, idioma)), [idioma]);
};

/** La banda que le toca a una puntuación, en el idioma activo. */
export const useBandaPrediabetes = (puntos: number): BandaPrediabetes => {
  const { idioma } = useIdioma();
  return useMemo(() => bandaTraducida(bandaPrediabetes(puntos), idioma), [puntos, idioma]);
};

/** El resultado del test (puntuación + desglose), en el idioma activo. La
 *  puntuación no depende del idioma: solo se traduce lo que se lee. */
export const useResultadoPrediabetes = (d: PrediabetesData): ResultadoPrediabetes | null => {
  const { idioma } = useIdioma();
  return useMemo(() => {
    const r = calcularPrediabetes(d);
    return r ? resultadoTraducido(r, idioma) : null;
  }, [d, idioma]);
};
