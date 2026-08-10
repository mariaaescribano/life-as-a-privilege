import type { HitoHistoria } from "./culturaHistoriaUniversal";
import { HISTORIA_UNIVERSAL_HITOS } from "./culturaHistoriaUniversal";
import { HISTORIA_RELIGIONES_HITOS } from "./culturaHistoriaReligiones";
import { HISTORIA_FILOSOFIA_HITOS } from "./culturaHistoriaFilosofia";
import { HISTORIA_CIENCIA_HITOS } from "./culturaHistoriaCiencia";
import { HISTORIA_MEDICINA_HITOS } from "./culturaHistoriaMedicina";
import { HISTORIA_ARTE_HITOS } from "./culturaHistoriaArte";

// Registro de las Historias de Cultura. La clave coincide con el segmento de la
// ruta /metodo/cultura/historia/<historiaKey>. Las páginas genéricas
// (MetodoCulturaHistoria y MetodoCulturaHistoriaEra) leen de aquí. Las Historias
// que aún no tienen datos (filosofía, ciencia, medicina, arte…) no aparecen: su
// tarjeta navega a una clave inexistente y la página rebota al listado.
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
