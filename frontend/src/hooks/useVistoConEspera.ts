import { useEffect, useRef, useState } from "react";

/**
 * ¿Se ha visto ya este bloque? — como `useEnPantalla`, pero con una ESPERA
 * inicial: aunque el bloque ya esté en pantalla al cargar la página (pasa en
 * ordenador, donde cabe casi todo de una vez), no se dispara hasta que han
 * pasado `espera` segundos desde que se montó el componente. Así la entrada no
 * se gasta a la vez que el titular y nadie la ve: primero se lee el titular y
 * unos segundos después van llegando las cajas.
 *
 * Si el usuario llega al bloque más tarde de esa espera (scroll), dispara al
 * instante. Red de seguridad: pase lo que pase, se muestra solo pasados 15 s.
 *
 * Se usa como callback ref (`ref={ref}`), igual que `useEnPantalla`.
 */
export function useVistoConEspera(rootMargin = "0px 0px -12% 0px", espera = 0) {
  const [visible, setVisible] = useState(false);
  const [node, setNode] = useState<HTMLElement | null>(null);
  const t0 = useRef(performance.now());

  useEffect(() => {
    if (!node || visible) return;
    let timer = 0;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        const falta = Math.max(0, espera * 1000 - (performance.now() - t0.current));
        timer = window.setTimeout(() => setVisible(true), falta);
      },
      { rootMargin },
    );
    obs.observe(node);
    const rescate = window.setTimeout(() => setVisible(true), 15000 + espera * 1000);
    return () => { obs.disconnect(); window.clearTimeout(timer); window.clearTimeout(rescate); };
  }, [node, visible, rootMargin, espera]);

  return { ref: setNode, visible };
}
