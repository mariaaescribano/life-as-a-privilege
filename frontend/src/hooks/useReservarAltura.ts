import { useCallback, useRef, useState } from "react";

/**
 * Reserva la altura del contenido en su estado MÁS LLENO para que, al quitar
 * elementos (p.ej. arrastrar piezas fuera de un box), el contenedor NO encoja.
 *
 * Cómo funciona: usa un ref de callback que mide `scrollHeight` cada vez que el
 * nodo se monta (que es cuando el set de piezas está completo) y guarda el máximo
 * visto. Ese máximo se devuelve como `minH` para fijarlo en el contenedor; como
 * nunca decrece, la caja mantiene su alto aunque se vacíe al arrastrar.
 *
 * El nodo se remonta al cambiar de set (p.ej. hidrógeno→helio, o al reiniciar),
 * así que se re-mide solo, sin necesidad de dependencias.
 */
export function useReservarAltura<T extends HTMLElement = HTMLDivElement>() {
  const [minH, setMinH] = useState<number | undefined>(undefined);
  const maxRef = useRef(0);

  const ref = useCallback((node: T | null) => {
    if (!node) return;
    const h = node.scrollHeight;
    if (h > maxRef.current) {
      maxRef.current = h;
      setMinH(h);
    }
  }, []);

  return { ref, minH } as const;
}
