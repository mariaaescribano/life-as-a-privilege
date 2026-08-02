import { useEffect } from "react";

/** Opciones del bloqueo. */
interface Opciones {
  /** Además del `overflow: hidden`, CLAVA el fondo con `position: fixed` y
   *  devuelve la página a su sitio al cerrar. Es la única forma de que el fondo
   *  no se mueva NADA en iOS (Safari se salta el `overflow: hidden` del body) ni
   *  cuando el scroll se encadena desde dentro del popup. Úsalo en popups que
   *  tienen scroll propio dentro. */
  fijarFondo?: boolean;
}

/**
 * Bloquea el scroll del `body` mientras `locked` es true, de modo que al abrir un
 * popup solo se desplace la tarjeta y no el fondo. Restaura todo lo que toca al
 * desbloquear o al desmontar el componente.
 */
export function useLockBodyScroll(locked: boolean, { fijarFondo = false }: Opciones = {}): void {
  useEffect(() => {
    if (!locked) return;
    const { body } = document;
    const html = document.documentElement;
    const prev = {
      bodyOverflow: body.style.overflow,
      bodyPadding: body.style.paddingRight,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      htmlOverflow: html.style.overflow,
    };
    // Al ocultar la barra de scroll, el fondo daría un salto lateral (se
    // ensancha lo que medía la barra). Se compensa con el mismo ancho de
    // padding mientras el popup está abierto: así el fondo NO se mueve nada.
    const barra = window.innerWidth - html.clientWidth;
    const scrollY = window.scrollY;

    body.style.overflow = "hidden";
    html.style.overflow = "hidden"; // hay páginas cuyo scroll lo lleva el <html>
    if (barra > 0) body.style.paddingRight = `${barra}px`;
    if (fijarFondo) {
      // El body se queda clavado en la posición en la que estaba: aunque el
      // navegador ignore el overflow (iOS) no hay nada que desplazar.
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
    }

    return () => {
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.bodyPadding;
      html.style.overflow = prev.htmlOverflow;
      if (fijarFondo) {
        body.style.position = prev.bodyPosition;
        body.style.top = prev.bodyTop;
        body.style.left = prev.bodyLeft;
        body.style.right = prev.bodyRight;
        body.style.width = prev.bodyWidth;
        // Y la página vuelve exactamente a donde estaba (si no, al cerrar el
        // popup se aparece arriba del todo).
        window.scrollTo(0, scrollY);
      }
    };
  }, [locked, fijarFondo]);
}
