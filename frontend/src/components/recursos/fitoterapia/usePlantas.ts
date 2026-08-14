import { useMemo } from "react";
import { useIdioma } from "../../../i18n";
import { plantas, type Planta } from "./PlantasData";
import { plantasTraducidas } from "./PlantasData.en";

/**
 * El herbario en el idioma activo.
 *
 * El español manda: el orden, el `id`, el color, la foto, el vídeo y el nombre
 * científico salen siempre de `PlantasData.ts`. Del inglés se toma solo el
 * texto, planta a planta: la que no esté traducida se lee en español en vez de
 * desaparecer.
 *
 * OJO: es un hook, hay que llamarlo AL PINTAR. Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export const usePlantas = (): Planta[] => {
  const { idioma } = useIdioma();
  return useMemo(() => plantasTraducidas(plantas, idioma), [idioma]);
};

/** Una planta suelta por su `id`, en el idioma activo. */
export const usePlanta = (id: number | undefined): Planta | undefined => {
  const ps = usePlantas();
  return id == null ? undefined : ps.find((p) => p.id === id);
};
