import { useEffect, useState } from "react";

/**
 * Precarga una lista de imágenes y devuelve `true` solo cuando TODAS han
 * terminado de cargar (o han fallado). Sirve para no mostrar una página hasta
 * que sus fotos estén listas: así todo aparece a la vez (la foto a la par que
 * el resto), sin que las imágenes entren a trozos.
 *
 * Uso típico:
 *   const fotosListas = useImagesReady([SPACE_IMG, ...otrasFotos]);
 *   if (cargandoDatos || !fotosListas) return <Spinner />;
 *
 * - Acepta null/undefined (se ignoran) para poder pasar listas condicionales.
 * - Si la lista queda vacía, devuelve `true` de inmediato (no hay nada que esperar).
 */
export function useImagesReady(srcs: (string | null | undefined)[]): boolean {
  const [ready, setReady] = useState(false);
  // Clave estable de la lista para no reejecutar el efecto en cada render.
  const key = srcs.filter((s): s is string => !!s).join("|");

  useEffect(() => {
    const list = key ? key.split("|") : [];
    if (list.length === 0) {
      setReady(true);
      return;
    }
    setReady(false);
    let cancelled = false;
    let pending = list.length;
    const done = () => {
      if (cancelled) return;
      pending -= 1;
      if (pending <= 0) setReady(true);
    };
    const imgs = list.map((src) => {
      const img = new window.Image();
      img.onload = done;
      img.onerror = done;
      img.src = encodeURI(src);
      return img;
    });
    return () => {
      cancelled = true;
      imgs.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [key]);

  return ready;
}
