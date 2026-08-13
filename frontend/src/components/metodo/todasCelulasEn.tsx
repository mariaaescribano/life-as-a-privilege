// ─────────────────────────────────────────────────────────────────────────
// Los órganos de «Las células de tus órganos» en el idioma activo.
//
// El español MANDA: de él salen el orden, las `key`, las fotos, los hotspots y
// qué células cuelgan de cada órgano. Del inglés se toma SOLO el texto
// (`todasCelulasContenido.en.ts`), y pieza a pieza: lo que no esté traducido se
// lee en español en vez de desaparecer.
//
// OJO: es un hook, hay que llamarlo AL PINTAR. Si el texto se resolviera al
// importar el módulo se quedaría congelado en el idioma con el que arrancó la
// página y no cambiaría al pulsar EN.
//
// El array español llega por parámetro (no se importa) a propósito: vive en la
// propia página, y si este fichero lo importara tendríamos un ciclo de imports.
// ─────────────────────────────────────────────────────────────────────────

import React, { useMemo } from "react";
import { TextoRico, useIdioma } from "../../i18n";
import { celulaEn } from "../../hardCoded/espacio/useCelulas";
import type { Celula } from "../../hardCoded/espacio/CelulasCuerpoData";
import {
  TODAS_CELULAS_EN,
  type ConsejoTexto,
  type FichaTexto,
} from "./todasCelulasContenido.en";

/** Lo que este puente necesita de una curiosidad; la página pone lo demás. */
type ConsejoLike = {
  titular: string;
  texto: React.ReactNode;
  claves?: string[];
  /** Clave estable con la que se guarda lo leído (ver más abajo). */
  id?: string;
};

/** Lo mismo, con el nombre corto que va en la tarjeta. */
type FichaLike = ConsejoLike & { nombre: string };

type OrganoLike = {
  key: string;
  label: string;
  descripcion?: React.ReactNode;
  /** Las células del órgano; su texto vive en `CelulasCuerpoData.en.ts`. */
  celulas: Celula[];
  consejos?: ConsejoLike[];
  fichas?: FichaLike[];
  fichasTitulo?: string;
};

/** Los párrafos ingleses con la misma pinta que el JSX español: **negritas** y
 *  un hueco de línea entre párrafo y párrafo (en el español eran `<br /><br />`). */
const parrafos = (ps: string[]): React.ReactNode => (
  <>
    {ps.map((p, i) => (
      <React.Fragment key={i}>
        {i > 0 && (
          <>
            <br />
            <br />
          </>
        )}
        <TextoRico>{p}</TextoRico>
      </React.Fragment>
    ))}
  </>
);

const yaAvisados = new Set<string>();
const avisarDesajuste = (organo: string, lista: string, es: number, en: number) => {
  const marca = `${organo}.${lista}`;
  if (yaAvisados.has(marca)) return;
  yaAvisados.add(marca);
  console.warn(
    `[i18n] «${organo}»: ${en} ${lista} en inglés y ${es} en español — se leen en ` +
      `español para no cruzar textos (todasCelulasContenido.en.ts empareja por posición)`,
  );
};

/**
 * Texto inglés encima de una curiosidad española.
 *
 * `id` se queda con el titular ESPAÑOL: es la clave con la que la página guarda
 * en la base de datos lo que ya se ha leído. Si se guardara el titular
 * traducido, la misma curiosidad contaría como dos y la marca de leída se
 * perdería al cambiar de idioma.
 */
const conTextoEn = <T extends ConsejoLike>(
  es: T,
  en: (ConsejoTexto & { nombre?: string }) | null,
): T => {
  if (!en) return es;
  const traducida = {
    ...es,
    id: es.id ?? es.titular,
    titular: en.titular,
    claves: en.claves ?? es.claves,
    texto: parrafos(en.texto),
  };
  // Las fichas (los tipos de colágeno, las piezas del músculo) llevan además el
  // nombre corto de la tarjeta.
  return (en.nombre ? { ...traducida, nombre: en.nombre } : traducida) as T;
};

/** Empareja las dos listas POR POSICIÓN. Si no cuadran, se queda el español. */
const mezclarLista = <T extends ConsejoLike>(
  es: T[] | undefined,
  en: (ConsejoTexto | null)[] | undefined,
  organo: string,
  lista: string,
): T[] | undefined => {
  if (!es?.length || !en) return es;
  if (en.length !== es.length) {
    if (import.meta.env.DEV) avisarDesajuste(organo, lista, es.length, en.length);
    return es;
  }
  return es.map((c, i) => conTextoEn(c, en[i]));
};

const organoEn = <T extends OrganoLike>(o: T): T => {
  const en = TODAS_CELULAS_EN[o.key];
  // Las células se traducen siempre, aunque el órgano no esté traducido: su
  // texto es de otro fichero y no depende de este.
  const celulas = o.celulas.map(celulaEn);
  if (!en) return { ...o, celulas };
  return {
    ...o,
    celulas,
    label: en.label ?? o.label,
    descripcion: en.descripcion ? parrafos(en.descripcion) : o.descripcion,
    fichasTitulo: en.fichasTitulo ?? o.fichasTitulo,
    consejos: mezclarLista(o.consejos, en.consejos, o.key, "consejos"),
    fichas: mezclarLista(
      o.fichas,
      en.fichas as (FichaTexto | null)[] | undefined,
      o.key,
      "fichas",
    ),
  };
};

/** Los órganos de la página en el idioma activo. */
export function useOrganosCelulas<T extends OrganoLike>(organosEs: T[]): T[] {
  const { idioma } = useIdioma();
  return useMemo(
    () => (idioma === "es" ? organosEs : organosEs.map(organoEn)),
    [idioma, organosEs],
  );
}

/**
 * Clave con la que se guarda que una curiosidad ya se ha leído. Siempre la
 * española, venga la ficha en el idioma que venga.
 */
export const claveConsejo = (c: ConsejoLike): string => c.id ?? c.titular;
