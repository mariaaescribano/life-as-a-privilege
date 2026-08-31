import { traducir, type ClaveTexto } from "../../i18n";
import type { HitoHistoria } from "./culturaHistoriaUniversal";
import { HISTORIA_UNIVERSAL_HITOS } from "./culturaHistoriaUniversal";
import { HISTORIA_RELIGIONES_HITOS } from "./culturaHistoriaReligiones";
import { HISTORIA_FILOSOFIA_HITOS } from "./culturaHistoriaFilosofia";
import { HISTORIA_CIENCIA_HITOS } from "./culturaHistoriaCiencia";
import { HISTORIA_MEDICINA_HITOS } from "./culturaHistoriaMedicina";
import { HISTORIA_ARTE_HITOS } from "./culturaHistoriaArte";

// Registro de las Historias de Cultura. La clave coincide con el segmento de la
// ruta /metodo/cultura/historia/<historiaKey>. Las páginas genéricas
// (MetodoCulturaHistoria y MetodoCulturaHistoriaEra) leen de aquí. Las seis están
// montadas: la tarjeta de una clave que no exista aquí rebotaría al listado.
export interface HistoriaDef {
  /** Título que se muestra en la cabecera de la Historia. */
  titulo: string;
  /** Eras (círculos de la línea del tiempo de esta Historia). */
  hitos: HitoHistoria[];
}

export const HISTORIAS_CULTURA: Record<string, HistoriaDef> = {
  universal: { titulo: "Historia Universal", hitos: HISTORIA_UNIVERSAL_HITOS },
  religiones: { titulo: "Historia de las religiones", hitos: HISTORIA_RELIGIONES_HITOS },
  filosofia: {
    titulo: "Historia de la filosofía",
    hitos: HISTORIA_FILOSOFIA_HITOS,
  },
  ciencia: {
    titulo: "Historia de la ciencia",
    hitos: HISTORIA_CIENCIA_HITOS,
  },
  medicina: {
    titulo: "Historia de la medicina",
    hitos: HISTORIA_MEDICINA_HITOS,
  },
  arte: {
    titulo: "Historia del arte y la literatura",
    hitos: HISTORIA_ARTE_HITOS,
  },
};

export const getHistoria = (key: string | undefined): HistoriaDef | undefined =>
  key ? HISTORIAS_CULTURA[key] : undefined;

/**
 * El título de una Historia en el idioma activo.
 *
 * El `titulo` de arriba se queda como respaldo (y como lo que se lee en el
 * código), pero lo que se PINTA sale del diccionario: la misma Historia se cita
 * en la rejilla, en la cabecera de su línea del tiempo y en el taller de
 * apuntes, y los tres tienen que decir lo mismo en los dos idiomas.
 *
 * No es un hook a propósito: se llama desde páginas que ya usan `useT()`, así
 * que se vuelven a pintar solas al cambiar de idioma.
 */
export const tituloHistoria = (key: string | undefined): string => {
  const historia = getHistoria(key);
  if (!historia) return "";
  // `traducir` devuelve la propia clave cuando no existe: en ese caso (una
  // Historia nueva a la que aún no se le ha puesto su clave) se pinta su título.
  const clave = `metodo.cultura.historia.${key}` as ClaveTexto;
  const texto = traducir(clave);
  return texto === clave ? historia.titulo : texto;
};
