import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../GlobalVariables";
import { portadaDelProveedor, youtubeVideoId } from "./videoLink";

/** Un vídeo corto (de YouTube, TikTok o Instagram) de la sección «Vídeos». */
export interface VideoApi {
  id: string;
  /** Slug de la disciplina — el mismo de DISCIPLINAS_CURSO. */
  disciplina: string;
  titulo: string;
  /** Portada subida desde /admin/videos (o ruta a /img). */
  portada: string;
  /** Enlace al vídeo: un short de YouTube, un TikTok o un reel de Instagram. */
  url: string;
  publicado: boolean;
  orden: number;
  created_at?: string;
}

/**
 * Id del vídeo dentro de un enlace de YouTube. Se mantiene aquí por comodidad
 * (lo usan el admin y la portada de reserva); el reconocimiento de verdad —y el
 * de TikTok e Instagram— vive en `videoLink.ts`.
 */
export const youtubeId = (url: string): string => youtubeVideoId(url);

/** Portada de reserva: la miniatura que da la propia red, si no se ha subido
 *  una. Solo YouTube regala miniatura; en TikTok e Instagram hay que subirla
 *  desde /admin/videos (si no, la tarjeta sale sin foto). */
export const portadaDe = (v: Pick<VideoApi, "portada" | "url">): string => {
  if (v.portada?.trim()) return v.portada.trim();
  return portadaDelProveedor(v.url);
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
