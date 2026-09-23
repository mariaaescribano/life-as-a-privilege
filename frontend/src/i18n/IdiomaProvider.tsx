import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  CLAVE_IDIOMA,
  detectarIdioma,
  IDIOMA_LOCALE,
  IDIOMA_ORIGINAL,
  type Idioma,
} from "./idiomas";
import { es, type ClaveTexto } from "./textos/es";

export type { ClaveTexto };

/** Valores para interpolar: `t("clave", { nombre: "María" })` → «Hola, {nombre}». */
export type Valores = Record<string, string | number>;

/**
 * Diccionarios cargados. El ESPANOL viene siempre: es la fuente de verdad y el
 * respaldo de todo lo que falte, y `traducir()` es sincrona, asi que no puede
 * esperar a nadie.
 *
 * El INGLES, en cambio, se pide aparte (`import()`) y solo si hace falta. Son
 * ~230 KB de texto que, estando aqui arriba, viajaban en el paquete de ENTRADA
 * —el que descarga TODO el mundo, en TODAS las paginas— aunque el 95% de las
 * visitas no lo miren nunca. Mientras no llegue, el respaldo automatico al
 * espanol hace su trabajo: no hay huecos en blanco ni claves peladas.
 */
const DICCIONARIOS: Record<Idioma, Partial<Record<ClaveTexto, string>>> = { es, en: {} };

/**
 * Los textos del RECORRIDO (`metodo.*`), que NO viajan en el paquete de
 * entrada (ver `textos/es/index.ts`). Se piden EN PARALELO con la página que
 * los necesita y se vuelcan sobre el diccionario español; la ruta no se pinta
 * hasta que están (`lazyConMetodo` en App.tsx), así que nadie llega a ver una
 * clave pelada.
 */
let peticionMetodo: Promise<void> | null = null;

export const cargarTextosMetodo = (): Promise<void> => {
  if (!peticionMetodo) {
    peticionMetodo = import("./textos/es/metodo")
      .then((modulo) => { Object.assign(DICCIONARIOS.es, modulo.metodo); })
      .catch(() => { peticionMetodo = null; /* que se pueda reintentar */ });
  }
  return peticionMetodo;
};

/** La peticion del diccionario ingles, una sola vez aunque se pida mil veces. */
let peticionIngles: Promise<void> | null = null;

/** ¿Esta ya el ingles en memoria? */
const inglesListo = () => Object.keys(DICCIONARIOS.en).length > 0;

/** Pide el diccionario ingles. Si falla, se sigue leyendo en espanol. */
const cargarIngles = (): Promise<void> => {
  if (inglesListo()) return Promise.resolve();
  if (!peticionIngles) {
    peticionIngles = import("./textos/en")
      .then((modulo) => { DICCIONARIOS.en = modulo.en; })
      .catch(() => { /* sin ingles se lee en espanol: mejor eso que nada */ });
  }
  return peticionIngles;
};

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
  return interpolar(propio ?? DICCIONARIOS.es[clave] ?? clave, valores);
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
    // Si arranca en ingles, se pide su diccionario YA, en paralelo con el resto
    // de la pagina, para que este cuando haga falta.
    if (inicial !== IDIOMA_ORIGINAL) void cargarIngles();
    return inicial;
  });

  // Sube de 0 a 1 cuando llega un diccionario nuevo: es lo que obliga a repintar
  // con los textos ya traducidos (el diccionario vive fuera de React).
  const [, setCargados] = useState(0);

  // Con el idioma original no hay nada que pedir. Con cualquier otro, se pide y
  // se repinta al llegar; mientras tanto se lee en espanol.
  const esperandoDiccionario = idioma !== IDIOMA_ORIGINAL && !inglesListo();

  useEffect(() => {
    if (idioma === IDIOMA_ORIGINAL || inglesListo()) return;
    let cancel = false;
    void cargarIngles().then(() => { if (!cancel) setCargados((n) => n + 1); });
    return () => { cancel = true; };
  }, [idioma]);

  // Mantener sincronizados el espejo de módulo, el `<html lang>` (lectores de
  // pantalla y buscadores) y el `og:locale`.
  useEffect(() => {
    idiomaActual = idioma;
    document.documentElement.lang = idioma;
    document.querySelector('meta[property="og:locale"]')?.setAttribute("content", IDIOMA_LOCALE[idioma]);
  }, [idioma]);

  const cambiarIdioma = useCallback((nuevo: Idioma) => {
    try { localStorage.setItem(CLAVE_IDIOMA, nuevo); } catch { /* noop */ }
    // Se pide el diccionario ANTES de cambiar: asi la web no parpadea en
    // espanol un instante antes de salir en ingles.
    if (nuevo !== IDIOMA_ORIGINAL && !inglesListo()) {
      void cargarIngles().then(() => {
        idiomaActual = nuevo;
        setIdioma(nuevo);
      });
      return;
    }
    idiomaActual = nuevo;
    setIdioma(nuevo);
  }, []);

  const valor = useMemo<ContextoIdioma>(() => ({
    idioma,
    cambiarIdioma,
    t: (clave, valores) => traducir(clave, valores, idioma),
    segunIdioma: (valores) => valores[idioma] ?? valores.es,
  }), [idioma, cambiarIdioma, esperandoDiccionario]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
};

export const useIdioma = (): ContextoIdioma => {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useIdioma debe usarse dentro de <IdiomaProvider>");
  return ctx;
};

/** Atajo para el caso habitual: `const t = useT();` → `t("header.mapa")`. */
export const useT = () => useIdioma().t;
