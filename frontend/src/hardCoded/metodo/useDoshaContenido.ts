import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import { DOSHA_INTRO, type DoshaIntro, type DoshaKey } from "./doshaIntro";
import { DOSHA_INTRO_EN } from "./doshaIntro.en";
import { DOSHA_DESCUBRE, type DoshaDescubre } from "./doshaDescubre";
import { DOSHA_DESCUBRE_EN } from "./doshaDescubre.en";
import { DOSHA_CUERPO, type DoshaCuerpo } from "./doshaCuerpo";
import { DOSHA_CUERPO_EN } from "./doshaCuerpo.en";
import { DOSHA_DESEQUILIBRIO, type DoshaDesequilibrio } from "./doshaDesequilibrio";
import { DOSHA_DESEQUILIBRIO_EN } from "./doshaDesequilibrio.en";
import { DOSHA_CUIDARTE, type DoshaCuidarte } from "./doshaCuidarte";
import { DOSHA_CUIDARTE_EN } from "./doshaCuidarte.en";
import { PRANAYAMA_CIERRE, PRANAYAMA_PRACTICA, PRANAYAMA_REFLEXION, type PracticaPranayama } from "./pranayama";
import { PRANAYAMA_CIERRE_EN, PRANAYAMA_PRACTICA_EN, PRANAYAMA_REFLEXION_EN } from "./pranayama.en";
import { CHAKRAS, CHAKRAS_INTRO, CHAKRAS_ORDEN, type Chakra, type ChakraKey } from "./chakras";
import { CHAKRAS_EN, CHAKRAS_INTRO_EN } from "./chakras.en";

/**
 * El submapa del doṣha (Ayurveda) en el idioma activo.
 *
 * El español manda: las claves (`vata` / `pitta` / `kapha`) son lo que guarda la
 * base de datos y no se traducen, y qué páginas existen lo dice el español. Del
 * inglés se toma solo el texto, doṣha a doṣha: el que no esté traducido se lee
 * entero en español en vez de quedarse en blanco.
 *
 * OJO: son hooks, hay que llamarlos AL PINTAR. Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 *
 * Los seis textos comparten forma (un `Record` por clave de doṣha), así que
 * comparten también el mismo mezclador: `porDosha`.
 */
const porDosha = <T,>(
  es: Record<DoshaKey, T | null>,
  en: Partial<Record<DoshaKey, T>>,
  idioma: string,
): Record<DoshaKey, T | null> => {
  if (idioma !== "en") return es;
  return {
    vata: en.vata ?? es.vata,
    pitta: en.pitta ?? es.pitta,
    kapha: en.kapha ?? es.kapha,
  };
};

/** «Introducción a tu doṣha». */
export const useDoshaIntro = (): Record<DoshaKey, DoshaIntro | null> => {
  const { idioma } = useIdioma();
  return useMemo(() => porDosha(DOSHA_INTRO, DOSHA_INTRO_EN, idioma), [idioma]);
};

/** «Tu tendencia mental». */
export const useDoshaDescubre = (): Record<DoshaKey, DoshaDescubre | null> => {
  const { idioma } = useIdioma();
  return useMemo(() => porDosha(DOSHA_DESCUBRE, DOSHA_DESCUBRE_EN, idioma), [idioma]);
};

/** «Así funciona tu cuerpo». */
export const useDoshaCuerpo = (): Record<DoshaKey, DoshaCuerpo | null> => {
  const { idioma } = useIdioma();
  return useMemo(() => porDosha(DOSHA_CUERPO, DOSHA_CUERPO_EN, idioma), [idioma]);
};

/** «¿Qué te desequilibra?». */
export const useDoshaDesequilibrio = (): Record<DoshaKey, DoshaDesequilibrio | null> => {
  const { idioma } = useIdioma();
  return useMemo(() => porDosha(DOSHA_DESEQUILIBRIO, DOSHA_DESEQUILIBRIO_EN, idioma), [idioma]);
};

/** «Tu alimentación y tu estilo de Vida» (y el constructor «Crea tu día»). */
export const useDoshaCuidarte = (): Record<DoshaKey, DoshaCuidarte | null> => {
  const { idioma } = useIdioma();
  return useMemo(() => porDosha(DOSHA_CUIDARTE, DOSHA_CUIDARTE_EN, idioma), [idioma]);
};

/** Prāṇāyāma: la práctica de cada doṣha, el hueco fijo y el cierre. */
export const usePranayama = () => {
  const { idioma } = useIdioma();
  return useMemo(() => {
    const practica = porDosha(
      PRANAYAMA_PRACTICA as Record<DoshaKey, PracticaPranayama | null>,
      PRANAYAMA_PRACTICA_EN,
      idioma,
    ) as Record<DoshaKey, PracticaPranayama>;
    return {
      practica,
      reflexion: idioma === "en" ? PRANAYAMA_REFLEXION_EN : PRANAYAMA_REFLEXION,
      cierre: idioma === "en" ? PRANAYAMA_CIERRE_EN : PRANAYAMA_CIERRE,
    };
  }, [idioma]);
};

/**
 * Los chakras en el idioma activo. Igual que los doṣhas: el español dice
 * cuáles hay y en qué orden, y del inglés se toma solo el texto de los que
 * estén traducidos (el resto se lee en español).
 */
export const useChakras = () => {
  const { idioma } = useIdioma();
  return useMemo(() => {
    const porChakra: Record<ChakraKey, Chakra> =
      idioma === "en"
        ? (Object.fromEntries(
            CHAKRAS_ORDEN.map((k) => [k, CHAKRAS_EN[k] ?? CHAKRAS[k]]),
          ) as Record<ChakraKey, Chakra>)
        : CHAKRAS;
    return {
      chakras: porChakra,
      lista: CHAKRAS_ORDEN.map((k) => porChakra[k]),
      intro: idioma === "en" ? CHAKRAS_INTRO_EN : CHAKRAS_INTRO,
    };
  }, [idioma]);
};
