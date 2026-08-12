// ─────────────────────────────────────────────────────────────────────────
// «Tu lengua» en el idioma activo.
//
// El español manda: las `key` (que son lo que se guarda en
// `metodo_tcm.data.observarte`), las fotos, el orden, la variante sana y los
// patrones a los que apunta cada una salen SIEMPRE de `tcmLenguaContenido.ts`.
// Del inglés se toma solo el texto, y capa a capa: la que no esté traducida se
// lee en español en vez de desaparecer. Misma regla que los cinco elementos, los
// órganos de Fisiología y los cómics.
// ─────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import {
  DIMENSIONES_SELECCIONABLES, LENGUA_DIMENSIONES, LENGUA_ZONAS, PATRONES, patronesPredominantes,
  type DimensionLengua, type PatronInfo, type PatronLengua, type ZonaLengua,
} from "./tcmLenguaContenido";
import {
  LENGUA_DIM_EN, LENGUA_OPCIONES_EN, LENGUA_ZONAS_EN, PATRONES_EN,
} from "./tcmLenguaContenido.en";
import type { DatosTcm } from "./tcmRecorrido";

/** Una capa de observación con su texto inglés encima (fotos y `key` intactas). */
function dimensionEn(d: DimensionLengua): DimensionLengua {
  const dim = LENGUA_DIM_EN[d.dim];
  const ops = LENGUA_OPCIONES_EN[d.dim] ?? {};
  return {
    ...d,
    titulo: dim?.titulo ?? d.titulo,
    subtitulo: dim?.subtitulo ?? d.subtitulo,
    opciones: d.opciones.map((o) => {
      const en = ops[o.key];
      return en ? { ...o, nombre: en.nombre, lectura: en.lectura } : o;
    }),
  };
}

/**
 * Las seis capas de la lengua en el idioma activo.
 *
 * OJO: es un hook, hay que llamarlo AL PINTAR. Si el texto se resolviera al
 * importar el módulo se quedaría congelado en el idioma con el que arrancó la
 * página y no cambiaría al pulsar EN.
 */
export function useLenguaDimensiones(): DimensionLengua[] {
  const { idioma } = useIdioma();
  return useMemo(
    () => (idioma === "en" ? LENGUA_DIMENSIONES.map(dimensionEn) : LENGUA_DIMENSIONES),
    [idioma],
  );
}

/** Las cuatro capas que el usuario elige en «Lee tu lengua», en su idioma. */
export function useLenguaSeleccionables(): DimensionLengua[] {
  const { idioma } = useIdioma();
  return useMemo(
    () => (idioma === "en" ? DIMENSIONES_SELECCIONABLES.map(dimensionEn) : DIMENSIONES_SELECCIONABLES),
    [idioma],
  );
}

/** Las cinco zonas del mapa de la lengua, en el idioma activo. */
export function useLenguaZonas(): ZonaLengua[] {
  const { idioma } = useIdioma();
  return useMemo(() => {
    if (idioma !== "en") return LENGUA_ZONAS;
    return LENGUA_ZONAS.map((z) => {
      const en = LENGUA_ZONAS_EN[z.key];
      return en ? { ...z, ...en } : z;
    });
  }, [idioma]);
}

/**
 * Los patrones que sugiere la lengua de esta persona, en el idioma activo.
 *
 * El cálculo (qué patrones y cuántas señales apuntan a cada uno) lo hace SIEMPRE
 * el español: aquí solo se cambia el texto de cada patrón. El `elemento` al que
 * apunta tampoco se toca, que es lo que elige su color en la página.
 */
export function usePatronesLengua(
  observarte: DatosTcm["observarte"],
): { patron: PatronLengua; info: PatronInfo; veces: number }[] {
  const { idioma } = useIdioma();
  return useMemo(() => {
    const base = patronesPredominantes(observarte);
    if (idioma !== "en") return base;
    return base.map((p) => {
      const en = PATRONES_EN[p.patron];
      return en ? { ...p, info: { ...p.info, ...en } } : p;
    });
  }, [observarte, idioma]);
}

/** Un patrón suelto en el idioma activo (para pintarlo fuera de la lista). */
export function usePatronLengua(patron: PatronLengua): PatronInfo {
  const { idioma } = useIdioma();
  const es = PATRONES[patron];
  if (idioma !== "en") return es;
  const en = PATRONES_EN[patron];
  return en ? { ...es, ...en } : es;
}
