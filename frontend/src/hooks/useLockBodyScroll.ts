import { useEffect } from "react";

/**
 * Bloquea el scroll del `body` mientras `locked` es true, de modo que al abrir un
 * popup solo se desplace la tarjeta y no el fondo. Restaura el overflow original
 * al desbloquear o al desmontar el componente.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}
