import { useEffect } from "react";
import type { RefObject } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  NADA DE BARRA DE SCROLL DETRÁS DE UN POPUP A PANTALLA COMPLETA
//
//  Los visores de ilustraciones (ComicViewer y compañía) ocupan la pantalla
//  JUSTA: el texto scrollea dentro de su caja y por fuera no hay nada que
//  recorrer. Cualquier barra vertical a la derecha de todo es, por tanto, un
//  error. Salía por dos motivos que se sumaban:
//
//   1. El <Modal> de estos popups va con `scrollBehavior="outside"`, y eso pone
//      `overflow: auto` en el contenedor del diálogo. Un píxel de más (los
//      100vh de `size="full"` contra los 100dvh del visor, el blur del fondo,
//      un margen) y aparece la barra.
//   2. La barra de la PÁGINA de detrás. Chakra la quita con react-remove-scroll,
//      pero solo se activa en el modal que abrió PRIMERO (`index === 1` en
//      modal-focus). Si un popup se abre desde otro modal y el de debajo se
//      cierra, ya no queda nadie bloqueando la página: reaparece su barra —la
//      gorda del sistema, con flechitas— a la derecha del cómic, aunque no
//      scrollee nada.
//
//  En vez de perseguir cada caso, este hook sube desde el propio popup hasta
//  <html> apagando el overflow de TODO lo que tiene por encima (el cuerpo del
//  modal, el diálogo, su contenedor, el portal, <body> y <html>). Se guarda el
//  valor en línea de cada uno y se devuelve al cerrar, así que las galerías de
//  Ilustraciones —cuyo MENÚ sí scrollea en el mismo modal— vuelven a scrollear
//  en cuanto se sale del visor.
//
//  Vale igual en ordenador y en móvil: en móvil, además, evita el rebote de la
//  página por debajo del popup.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Apaga el scroll de todo lo que hay por encima de `ref` mientras `activo`.
 *
 * @param ref    Cualquier elemento DENTRO del popup (basta el cuerpo del modal).
 * @param activo Si el popup está abierto. Con `false` no se toca nada.
 */
export function useSinBarraDeScroll(
  ref: RefObject<HTMLElement | null>,
  activo = true,
) {
  useEffect(() => {
    if (!activo) return;
    const inicio = ref.current;
    if (!inicio) return;

    // Camino completo hasta <html>. Se apunta el `style.overflow` que tenía cada
    // uno (casi siempre "") para poder dejarlo exactamente como estaba.
    const antes: [HTMLElement, string][] = [];
    for (let el: HTMLElement | null = inicio; el; el = el.parentElement) {
      antes.push([el, el.style.overflow]);
      el.style.overflow = "hidden";
    }

    return () => {
      for (const [el, valor] of antes) el.style.overflow = valor;
    };
  }, [activo, ref]);
}
