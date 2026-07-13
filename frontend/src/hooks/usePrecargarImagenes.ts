import { useEffect, useState } from "react";

// Versión imperativa: precarga una lista de imágenes y resuelve cuando TODAS han
// terminado (cargadas o fallidas). Útil dentro de un efecto de carga, para
// retener el spinner inicial sin re-disparar la espera cuando cambie el estado.
export function precargarImagenes(urls: Array<string | undefined | null>): Promise<void> {
  const lista = urls.filter(Boolean) as string[];
  if (lista.length === 0) return Promise.resolve();
  return new Promise((resolve) => {
    let pendientes = lista.length;
    const done = () => { if (--pendientes <= 0) resolve(); };
    lista.forEach((src) => {
      const img = new window.Image();
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });
  });
}

// Precarga una lista de imágenes y devuelve `true` cuando TODAS han terminado
// (cargadas o fallidas). Sirve para no mostrar unas fotos/tarjetas hasta que sus
// imágenes estén listas, y así evitar que el hueco vacío se rellene de golpe
// después. Nunca se queda colgado: los `onerror` también cuentan como listas.
export function usePrecargarImagenes(urls: Array<string | undefined | null>): boolean {
  const [listo, setListo] = useState(false);
  // Clave estable de la lista (ordenar no hace falta: el orden es fijo por página).
  const clave = urls.filter(Boolean).join("|");

  useEffect(() => {
    const lista = clave ? clave.split("|") : [];
    if (lista.length === 0) { setListo(true); return; }
    setListo(false);
    let vivo = true;
    let pendientes = lista.length;
    const done = () => { if (vivo && --pendientes <= 0) setListo(true); };
    const imgs = lista.map((src) => {
      const img = new window.Image();
      img.onload = done;
      img.onerror = done;
      img.src = src;
      return img;
    });
    return () => { vivo = false; imgs.forEach((i) => { i.onload = null; i.onerror = null; }); };
  }, [clave]);

  return listo;
}
