import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  CLAVE_IDIOMA,
  detectarIdioma,
  IDIOMA_LOCALE,
  IDIOMA_ORIGINAL,
  type Idioma,
} from "./idiomas";
import { es, type ClaveTexto } from "./textos/es";
import { en } from "./textos/en";

export type { ClaveTexto };

/** Valores para interpolar: `t("clave", { nombre: "María" })` → «Hola, {nombre}». */
export type Valores = Record<string, string | number>;

const DICCIONARIOS: Record<Idioma, Partial<Record<ClaveTexto, string>>> = { es, en };

/**
 * Espejo del idioma activo a nivel de módulo, para poder traducir FUERA de un
 * componente de React (ficheros de datos, generadores de PDF, utilidades…).
 * Dentro de un componente usa siempre `useT()`, que además re-renderiza al
 * cambiar de idioma.
 */
let idiomaActual: Idioma = IDIOMA_ORIGINAL;

export const getIdioma = (): Idioma => idiomaActual;

const interpolar = (texto: string, valores?: Valores): string =>
  valores
    ? texto.replace(/\{(\w+)\}/g, (coincidencia, clave) =>
        clave in valores ? String(valores[clave]) : coincidencia,
      )
    : texto;

// En desarrollo avisamos UNA vez por clave sin traducir, para saber qué falta
// sin llenar la consola de ruido.
const yaAvisadas = new Set<string>();
const avisarFalta = (clave: string, idioma: Idioma) => {
  const marca = `${idioma}:${clave}`;
  if (yaAvisadas.has(marca)) return;
  yaAvisadas.add(marca);
  console.warn(`[i18n] falta traducción «${clave}» en «${idioma}» — se muestra en español`);
};

/**
 * Traduce una clave. Si el idioma activo no la tiene, cae al español; y si
 * tampoco existe en español, devuelve la propia clave (así se ve el fallo en
 * pantalla en vez de un hueco en blanco).
 */
export const traducir = (
  clave: ClaveTexto,
  valores?: Valores,
  idioma: Idioma = idiomaActual,
): string => {
  const propio = DICCIONARIOS[idioma]?.[clave];
  if (import.meta.env.DEV && idioma !== IDIOMA_ORIGINAL && propio === undefined) {
    avisarFalta(clave, idioma);
  }
  return interpolar(propio ?? es[clave] ?? clave, valores);
};

type ContextoIdioma = {
  idioma: Idioma;
  cambiarIdioma: (idioma: Idioma) => void;
  /** Traduce una clave del diccionario. */
  t: (clave: ClaveTexto, valores?: Valores) => string;
  /**
   * Elige entre dos valores CUALESQUIERA según el idioma (arrays, objetos de
   * datos, JSX…). Para los ficheros de contenido gordos (astrologiaTextos,
   * culturaHistoria…) que no caben en un diccionario de strings:
   *   `segunIdioma({ es: TEXTOS_ES, en: TEXTOS_EN })`
   */
  segunIdioma: <T,>(valores: { es: T; en?: T }) => T;
};

const Contexto = createContext<ContextoIdioma | null>(null);

export const IdiomaProvider = ({ children }: { children: React.ReactNode }) => {
  const [idioma, setIdioma] = useState<Idioma>(() => {
    const inicial = detectarIdioma();
    idiomaActual = inicial;
    return inicial;
  });

  // Mantener sincronizados el espejo de módulo, el `<html lang>` (lectores de
  // pantalla y buscadores) y el `og:locale`.
  useEffect(() => {
    idiomaActual = idioma;
    document.documentElement.lang = idioma;
    document.querySelector('meta[property="og:locale"]')?.setAttribute("content", IDIOMA_LOCALE[idioma]);
  }, [idioma]);

  const cambiarIdioma = useCallback((nuevo: Idioma) => {
    try { localStorage.setItem(CLAVE_IDIOMA, nuevo); } catch { /* noop */ }
    idiomaActual = nuevo;
    setIdioma(nuevo);
  }, []);

  const valor = useMemo<ContextoIdioma>(() => ({
    idioma,
    cambiarIdioma,
    t: (clave, valores) => traducir(clave, valores, idioma),
    segunIdioma: (valores) => valores[idioma] ?? valores.es,
  }), [idioma, cambiarIdioma]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
};

export const useIdioma = (): ContextoIdioma => {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useIdioma debe usarse dentro de <IdiomaProvider>");
  return ctx;
};

/** Atajo para el caso habitual: `const t = useT();` → `t("header.mapa")`. */
export const useT = () => useIdioma().t;
