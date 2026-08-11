// ─────────────────────────────────────────────────────────────────────────
// LAS FOTOS DEL TALLER — llevar al papel las ilustraciones de la web.
//
// jsPDF no sabe nada de WebP (solo entiende JPEG y PNG), pero el navegador sí:
// aquí se carga cada archivo en un <img>, se redibuja en un canvas y se saca
// como JPEG. De paso se reduce de tamaño, que es lo que decide si el PDF pesa
// 4 MB o 40.
//
// Dos decisiones que no son adorno:
//  · SE CARGAN DE UNA EN UNA. Sesenta imágenes decodificándose a la vez tumban
//    el navegador de un móvil. Tarda un poco más y llega hasta el final.
//  · UNA FOTO QUE FALTA NO ROMPE NADA. Si el archivo no existe, no entra en la
//    caché y el bloque que la pedía se compone sin ella.
//
// Las rutas llevan eñes y acentos (`/viñetas/...`), así que SIEMPRE se pide con
// encodeURI: sin eso, el navegador da 404 en según qué servidor.
// ─────────────────────────────────────────────────────────────────────────

/** Una foto ya lista para el PDF: JPEG en base64 y el tamaño del bitmap. */
export interface FotoPdf {
  /** data:image/jpeg;base64,… */
  data: string;
  w: number;
  h: number;
}

/** Caché de fotos por su ruta ORIGINAL (sin encodeURI). */
export type FotoCache = Map<string, FotoPdf>;

/** Lado mayor al que se reduce cada foto. 1000 px = nítida en A4 impreso. */
export const LADO_MAX = 1000;

/** Peso aproximado de una foto ya comprimida. Sirve para AVISAR del tamaño
 *  antes de generar nada (el peso real solo se sabe al final). */
export const PESO_FOTO_KB = 115;

const cargarUna = (src: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = encodeURI(src);
  });

/** Redibuja la imagen reducida y la devuelve como JPEG. */
function aJpeg(img: HTMLImageElement, maxPx: number, calidad: number): FotoPdf | null {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh) return null;
  const escala = Math.min(1, maxPx / Math.max(nw, nh));
  const w = Math.max(1, Math.round(nw * escala));
  const h = Math.max(1, Math.round(nh * escala));

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  // Fondo blanco: el JPEG no tiene transparencia y sin esto los PNG con alfa
  // salen con el canal negro.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);
  return { data: c.toDataURL("image/jpeg", calidad), w, h };
}

/**
 * Carga y comprime una lista de fotos. Devuelve solo las que existen.
 * `onProgress` se llama después de cada una: es lo que mueve la barra.
 */
export async function cargarFotos(
  srcs: string[],
  o?: {
    onProgress?: (hechas: number, total: number) => void;
    maxPx?: number;
    calidad?: number;
    /** Para poder abortar si la persona cierra la página a medias. */
    seguir?: () => boolean;
  },
): Promise<FotoCache> {
  const lista = Array.from(new Set(srcs.filter(Boolean)));
  const cache: FotoCache = new Map();
  const maxPx = o?.maxPx ?? LADO_MAX;
  const calidad = o?.calidad ?? 0.72;

  for (let i = 0; i < lista.length; i++) {
    if (o?.seguir && !o.seguir()) break;
    const src = lista[i];
    const img = await cargarUna(src);
    if (img) {
      const foto = aJpeg(img, maxPx, calidad);
      if (foto) cache.set(src, foto);
    }
    o?.onProgress?.(i + 1, lista.length);
  }
  return cache;
}

/** Peso aproximado en KB de un puñado de fotos (para el aviso de la página). */
export const pesoAproxKb = (nFotos: number) => nFotos * PESO_FOTO_KB;
