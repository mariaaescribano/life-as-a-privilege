// ─────────────────────────────────────────────────────────────────────────
// LOS SEIS VÍDEOS DE «DESARROLLO» (Fisiología · nivel 2, /metodo/fisiologia/desarrollo)
//
// Se ven EN ORDEN: el siguiente se abre al acabar de ver el anterior. Al
// terminar los seis salta el cómic «La vida secreta de las células».
//
// ⚠️ PARA ACTIVAR UN VÍDEO: pegar su enlace de YouTube (Short, youtu.be, watch…
//    o solo el ID) en `url`. Un vídeo SIN enlace cuenta como ya visto (se pinta
//    como «próximamente» y no frena el camino): así el nivel se puede andar hoy
//    y se va activando a medida que María los graba.
// ⚠️ No cambiar las `key` tras publicar: con ellas se guarda lo visto.
// ─────────────────────────────────────────────────────────────────────────
import type { ClaveTexto } from "../../i18n";
import { youtubeId } from "../../components/aprendizaje/youtube";

export interface VideoDesarrollo {
  key: string;
  titulo: ClaveTexto;
  /** Enlace o ID de YouTube. Vacío = aún no hay vídeo. */
  url: string;
}

export const VIDEOS_DESARROLLO: VideoDesarrollo[] = [
  { key: "fecundacion",  titulo: "fisiologia.desarrollo.v1", url: "" },
  { key: "feto-inicial", titulo: "fisiologia.desarrollo.v2", url: "" },
  { key: "feto-mes",     titulo: "fisiologia.desarrollo.v3", url: "" },
  { key: "nacimiento",   titulo: "fisiologia.desarrollo.v4", url: "" },
  { key: "crecimiento",  titulo: "fisiologia.desarrollo.v5", url: "" },
  { key: "adolescencia", titulo: "fisiologia.desarrollo.v6", url: "" },
];

export const hayVideoDesarrollo = (v: VideoDesarrollo) => youtubeId(v.url) !== "";

/** Lo guardado en `data.desarrollo_videos` (blindado: datos antiguos o raros). */
export function leerVistosDesarrollo(data: any): string[] {
  const g = data?.desarrollo_videos;
  return Array.isArray(g) ? g.filter((x: unknown): x is string => typeof x === "string") : [];
}

/** ¿Está ya visto? Sin enlace = visto. */
export const videoDesarrolloVisto = (v: VideoDesarrollo, vistos: string[]) =>
  !hayVideoDesarrollo(v) || vistos.includes(v.key);

/** Un vídeo se puede abrir si todos los anteriores están vistos. */
export const videoDesarrolloAbierto = (i: number, vistos: string[]) =>
  VIDEOS_DESARROLLO.slice(0, i).every((v) => videoDesarrolloVisto(v, vistos));

export const desarrolloVideosCompleto = (data: any) => {
  const vistos = leerVistosDesarrollo(data);
  return VIDEOS_DESARROLLO.every((v) => videoDesarrolloVisto(v, vistos));
};

/** Quien ya anduvo VIDA antes de que existiera este nivel no se queda fuera:
 *  si hay rastro de que pasó de la célula (órganos, cuerpo…), el nivel cuenta
 *  como hecho. */
export function desarrolloHeredado(data: any): boolean {
  const d = data || {};
  return !!d.organismo_hecho || !!d.desarrollo_hecho
    || (d.cuerpo && Array.isArray(d.cuerpo.hechas) && d.cuerpo.hechas.length > 0);
}
