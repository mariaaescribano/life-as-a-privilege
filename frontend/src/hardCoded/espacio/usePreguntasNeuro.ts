import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import type { Bloque } from "../../dtos/espacio.type";
import { preguntasNeuroPsicologia } from "./PreguntasNeuroPsicologia";
import { BLOQUES_NEURO_EN, PREGUNTAS_NEURO_EN } from "./PreguntasNeuroPsicologia.en";

/**
 * Los siete bloques de preguntas de Psicología en el idioma activo.
 *
 * El español manda: el orden, el icono y el `idPregunta` (con el que se guarda
 * lo que escribe la usuaria) salen de `PreguntasNeuroPsicologia.ts`. Del inglés
 * se toma solo el texto, pregunta a pregunta: la que no esté traducida se lee
 * en español en vez de desaparecer.
 *
 * OJO: es un hook, hay que llamarlo AL PINTAR. Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export const usePreguntasNeuro = (): Bloque[] => {
  const { idioma } = useIdioma();
  return useMemo(() => {
    if (idioma !== "en") return preguntasNeuroPsicologia;
    return preguntasNeuroPsicologia.map((bloque) => ({
      ...bloque,
      title: BLOQUES_NEURO_EN[bloque.title] ?? bloque.title,
      subPreguntas: bloque.subPreguntas.map((sub) => {
        const en = PREGUNTAS_NEURO_EN[sub.idPregunta];
        if (!en) return sub;
        return { ...sub, pregunta: en.pregunta, consejo: en.consejo ?? sub.consejo };
      }),
    }));
  }, [idioma]);
};
