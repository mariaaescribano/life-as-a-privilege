import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import { preguntasAyurveda, type PreguntaAyurveda } from "./PreguntasAyurveda";
import { PREGUNTAS_AYURVEDA_EN } from "./PreguntasAyurveda.en";

/**
 * Las preguntas del test de los Doṣhas en el idioma activo, SOLO PARA PINTAR.
 *
 * Lo que se guarda en la base de datos (`respuestas[].pregunta`) y lo que sale
 * en el PDF sigue siendo la pregunta ESPAÑOLA: se lee de `preguntasAyurveda`
 * directamente, para que el histórico de una misma persona no quede a medias
 * en dos idiomas.
 *
 * Si las dos listas no tienen la misma longitud, se devuelve la española
 * entera: una pregunta desplazada emparejaría respuestas con la pregunta
 * equivocada.
 *
 * OJO: es un hook, hay que llamarlo AL PINTAR. Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export const usePreguntasAyurveda = (): PreguntaAyurveda[] => {
  const { idioma } = useIdioma();
  return useMemo(() => {
    if (idioma !== "en") return preguntasAyurveda;
    if (PREGUNTAS_AYURVEDA_EN.length !== preguntasAyurveda.length) return preguntasAyurveda;
    return preguntasAyurveda.map((p, i) => PREGUNTAS_AYURVEDA_EN[i] ?? p);
  }, [idioma]);
};
