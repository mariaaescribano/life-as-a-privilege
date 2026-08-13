// ─────────────────────────────────────────────────────────────────────────
// El contenido de CÁBALA en el idioma activo.
//
// Un único puente para todo el recorrido: las once dimensiones, los 22 senderos,
// la Escala de Equilibrio y las etiquetas del diagnóstico. El español MANDA —de
// él salen las claves, el orden, las fotos, los umbrales y toda la puntuación— y
// del inglés se toma SOLO el texto. Lo que no esté traducido se lee en español,
// pieza a pieza, en vez de desaparecer.
//
// OJO: son hooks, hay que llamarlos AL PINTAR. Si el texto se resolviera al
// importar el módulo se quedaría congelado en el idioma con el que arrancó la
// página y no cambiaría al pulsar EN.
// ─────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { useIdioma } from "../../i18n";
import { useComic } from "../../i18n/comics";
import type { Vineta } from "./ComicViewer";
import { CABALA_ILUSTRACIONES_VINETAS } from "./cabalaIlustraciones";
import { CABALA_SENDERO_VINETAS } from "./cabalaSenderoIlustraciones";
import {
  CABALA_SEFIROT,
  CABALA_SEFIROT_ORDEN,
  cabalaSefirotMap,
  type CabalaPageKey,
  type SefiraContenido,
} from "./cabalaSefirot";
import { CABALA_SEFIROT_EN } from "./cabalaSefirot.en";
import {
  CABALA_SENDEROS,
  senderoPorNum,
  type SenderoContenido,
} from "./cabalaSenderos";
import { CABALA_SENDEROS_EN } from "./cabalaSenderos.en";
import { CABALA_TEST, ESCALA, type DimensionTest } from "./cabalaTest";
import { CABALA_TEST_EN, ESCALA_EN } from "./cabalaTest.en";
import {
  POLARIDAD_LABEL,
  TIPO_LABEL,
  type Polaridad,
  type TransicionTipo,
} from "./cabalaDiagnostico";
import {
  claveTransicion,
  NARRATIVAS_EN,
  POLARIDAD_LABEL_EN,
  TIPO_LABEL_EN,
} from "./cabalaDiagnostico.en";

// ── Las once dimensiones (sefirot) ───────────────────────────────────────

/** Fusiona el texto inglés sobre la sefirá española (clave, número y fotos intactos). */
const sefiraEn = (es: SefiraContenido): SefiraContenido => {
  const en = CABALA_SEFIROT_EN[es.key];
  return en ? { ...es, ...en } : es;
};

/** Una sefirá en el idioma activo. `null` si la clave no existe. */
export function useSefira(key?: CabalaPageKey): SefiraContenido | undefined {
  const { idioma } = useIdioma();
  const es = key ? cabalaSefirotMap[key] : undefined;
  if (!es || idioma === "es") return es;
  return sefiraEn(es);
}

/** Las once, en el orden del recorrido y en el idioma activo. */
export function useSefirot(): SefiraContenido[] {
  const { idioma } = useIdioma();
  return useMemo(
    () => (idioma === "es" ? CABALA_SEFIROT : CABALA_SEFIROT.map(sefiraEn)),
    [idioma],
  );
}

/** Las once por clave, para las páginas que las citan de una en una. */
export function useSefirotMap(): Record<CabalaPageKey, SefiraContenido> {
  const { idioma } = useIdioma();
  return useMemo(() => {
    if (idioma === "es") return cabalaSefirotMap;
    const out = {} as Record<CabalaPageKey, SefiraContenido>;
    for (const k of CABALA_SEFIROT_ORDEN) out[k] = sefiraEn(cabalaSefirotMap[k]);
    return out;
  }, [idioma]);
}

// ── Los 22 senderos ──────────────────────────────────────────────────────

/**
 * Fusiona el texto inglés sobre el sendero español.
 *
 * Las preguntas del test y las bandas de interpretación se emparejan por
 * POSICIÓN: del inglés viene solo su texto, y el `min`/`max` de cada banda sale
 * del español. Así los dos idiomas puntúan igual — una banda con otros límites
 * daría un diagnóstico distinto según el idioma.
 */
const senderoEn = (es: SenderoContenido): SenderoContenido => {
  const en = CABALA_SENDEROS_EN[es.num];
  if (!en) return es;
  return {
    ...es,
    ...en,
    test: es.test.map((p, i) => ({ ...p, texto: en.test[i] ?? p.texto })),
    interpretaciones: es.interpretaciones.map((b, i) => ({
      ...b,
      titulo: en.interpretaciones[i]?.titulo ?? b.titulo,
      texto: en.interpretaciones[i]?.texto ?? b.texto,
    })),
  };
};

/** Un sendero por su número cabalístico (11-32), en el idioma activo. */
export function useSendero(num?: number): SenderoContenido | undefined {
  const { idioma } = useIdioma();
  const es = num ? senderoPorNum[num] : undefined;
  if (!es || idioma === "es") return es;
  return senderoEn(es);
}

/** Los 22, en orden (Aleph→Tav) y en el idioma activo. */
export function useSenderos(): SenderoContenido[] {
  const { idioma } = useIdioma();
  return useMemo(
    () => (idioma === "es" ? CABALA_SENDEROS : CABALA_SENDEROS.map(senderoEn)),
    [idioma],
  );
}

// ── La Escala de Equilibrio (el test de cada dimensión) ───────────────────

/**
 * Las once dimensiones del test en el idioma activo.
 *
 * El `tipo` de cada pregunta (déficit / equilibrio / exceso) y su orden salen
 * SIEMPRE del español: del inglés viene solo el enunciado, emparejado por
 * posición. Si se duplicara el tipo, el mismo test podría puntuar distinto en
 * cada idioma.
 */
export function useTestCabala(): Record<CabalaPageKey, DimensionTest> {
  const { idioma } = useIdioma();
  return useMemo(() => {
    if (idioma === "es") return CABALA_TEST;
    const out = {} as Record<CabalaPageKey, DimensionTest>;
    for (const [k, dim] of Object.entries(CABALA_TEST) as [CabalaPageKey, DimensionTest][]) {
      const en = CABALA_TEST_EN[k];
      out[k] = en
        ? {
            ...dim,
            etiqueta: en.etiqueta,
            preguntas: dim.preguntas.map((p, i) => ({ ...p, texto: en.preguntas[i] ?? p.texto })),
          }
        : dim;
    }
    return out;
  }, [idioma]);
}

/** La escala 1-5 de los tests de sendero (el `valor` no cambia, la etiqueta sí). */
export function useEscala(): { valor: number; label: string }[] {
  const { idioma } = useIdioma();
  return useMemo(
    () =>
      idioma === "es"
        ? ESCALA
        : ESCALA.map((op, i) => ({ ...op, label: ESCALA_EN[i] ?? op.label })),
    [idioma],
  );
}

// ── Las ilustraciones (los dos cómics del visor) ─────────────────────────
// El orden y las fotos salen del fichero español; del inglés, solo la prosa,
// viñeta a viñeta (la que no esté traducida se queda en español). Los ÍNDICES
// —`indiceIlustracionSefira`, `indiceIlustracionSendero`— siguen valiendo: la
// secuencia es la misma en los dos idiomas.

/** Las 11 ilustraciones de las sefirot, en orden y en el idioma activo. */
export function useVinetasSefirot(): Vineta[] {
  return useComic("cabala-sefirot", CABALA_ILUSTRACIONES_VINETAS);
}

/** Las 22 ilustraciones de los senderos, en orden y en el idioma activo. */
export function useVinetasSenderos(): Vineta[] {
  return useComic("cabala-senderos", CABALA_SENDERO_VINETAS);
}

// ── Etiquetas del diagnóstico ────────────────────────────────────────────

/** «Poco desarrollada · Integrada · Sobreexpresada». */
export function usePolaridadLabel(): Record<Polaridad, string> {
  const { idioma } = useIdioma();
  return idioma === "es" ? POLARIDAD_LABEL : POLARIDAD_LABEL_EN;
}

/** «Bloqueo principal», «Transición integrada»… */
export function useTipoLabel(): Record<TransicionTipo, string> {
  const { idioma } = useIdioma();
  return idioma === "es" ? TIPO_LABEL : TIPO_LABEL_EN;
}

/**
 * El relato del paso evolutivo de una transición.
 *
 * Devuelve una FUNCIÓN porque las transiciones se calculan con
 * `calcularTransiciones` (que trae la narrativa española pegada al resultado):
 * al pintar se le pasa el resultado y elige el idioma. La que no esté traducida
 * se lee en español.
 */
export function useNarrativa(): (t: {
  from: CabalaPageKey;
  to: CabalaPageKey;
  narrativa: string;
}) => string {
  const { idioma } = useIdioma();
  return (t) =>
    (idioma === "en" ? NARRATIVAS_EN[claveTransicion(t.from, t.to)] : undefined) ?? t.narrativa;
}
