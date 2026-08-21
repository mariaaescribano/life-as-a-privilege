import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../GlobalVariables";

/** Un vídeo corto (short de YouTube) de la sección «Vídeos». */
export interface VideoApi {
  id: string;
  /** Slug de la disciplina — el mismo de DISCIPLINAS_CURSO. */
  disciplina: string;
  titulo: string;
  /** Portada subida desde /admin/videos (o ruta a /img). */
  portada: string;
  /** Enlace al short de YouTube. */
  url: string;
  publicado: boolean;
  orden: number;
  created_at?: string;
}

/**
 * Id del vídeo dentro de un enlace de YouTube. Acepta las formas que se copian
 * de verdad desde el móvil y el escritorio:
 *   youtube.com/shorts/<id> · youtu.be/<id> · youtube.com/watch?v=<id> · /embed/<id>
 * Devuelve "" si no reconoce el enlace (no pasa nada: solo se usa para la
 * portada de reserva).
 */
export const youtubeId = (url: string): string => {
  const u = (url ?? "").trim();
  if (!u) return "";
  const m = u.match(/(?:shorts\/|youtu\.be\/|[?&]v=|\/embed\/|\/live\/)([A-Za-z0-9_-]{6,})/);
  return m?.[1] ?? "";
};

/** Portada de reserva: la miniatura del propio YouTube, si no se ha subido una. */
export const portadaDe = (v: Pick<VideoApi, "portada" | "url">): string => {
  if (v.portada?.trim()) return v.portada.trim();
  const id = youtubeId(v.url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
};

/** Los vídeos publicados. Si el API falla se devuelve la lista vacía: la página
 *  enseña «todavía no hay vídeos» en vez de romperse. */
export async function cargarVideos(): Promise<VideoApi[]> {
  try {
    const r = await axios.get(`${API_URL}/videos`);
    return Array.isArray(r.data) ? (r.data as VideoApi[]) : [];
  } catch {
    return [];
  }
}

export function useVideos() {
  const [videos, setVideos] = useState<VideoApi[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vivo = true;
    (async () => {
      const lista = await cargarVideos();
      if (!vivo) return;
      setVideos(lista);
      setCargando(false);
    })();
    return () => { vivo = false; };
  }, []);

  return { videos, cargando };
}
