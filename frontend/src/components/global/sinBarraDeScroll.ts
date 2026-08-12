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
//
//  ── POR QUÉ SE CUENTAN LOS CANDADOS ─────────────────────────────────────────
//  <body> y <html> los comparten TODOS los popups, y dos visores pueden estar
//  vivos a la vez: cuando un cómic encadena con el siguiente (Tu cocina →
//  Qigong: la historia del Qigong y, detrás, los cinco animales), Chakra deja el
//  que se va montado unos milisegundos mientras se desvanece, y el que entra ya
//  se ha montado encima.
//
//  Guardando cada uno «el valor que había» eso terminaba fatal: el segundo se
//  encontraba el `overflow: hidden` que había puesto el primero, lo apuntaba
//  como valor original y, al cerrarse, lo DEVOLVÍA. La página quedaba con
//  `overflow: hidden` puesto para siempre y ya no se podía bajar (se veía al
//  aterrizar en /metodo/tcm/qigong: la página no scrolleaba).
//
//  Por eso el candado se cuenta por elemento: el PRIMERO que llega apunta el
//  valor de verdad y lo apaga; los de en medio solo suman; y el ÚLTIMO en irse
//  es el que devuelve el valor original. Mientras quede un popup abierto, el
//  scroll sigue bloqueado; cuando no queda ninguno, vuelve como estaba.
// ─────────────────────────────────────────────────────────────────────────────

/** Candados vivos por elemento: cuántos popups lo están tapando y qué
 *  `style.overflow` tenía ANTES del primero de todos. */
const candados = new WeakMap<HTMLElement, { n: number; original: string }>();

function apagarOverflow(el: HTMLElement) {
  const abierto = candados.get(el);
  if (abierto) {
    abierto.n += 1;
    return;
  }
  candados.set(el, { n: 1, original: el.style.overflow });
  el.style.overflow = "hidden";
}

function devolverOverflow(el: HTMLElement) {
  const abierto = candados.get(el);
  if (!abierto) return;
  abierto.n -= 1;
  if (abierto.n > 0) return; // aún queda algún popup encima
  candados.delete(el);
  el.style.overflow = abierto.original;
}

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

    // Camino completo hasta <html>. Se apunta la lista para soltar EXACTAMENTE
    // los mismos elementos al cerrar, aunque para entonces el popup ya no
    // cuelgue del documento.
    const tapados: HTMLElement[] = [];
    for (let el: HTMLElement | null = inicio; el; el = el.parentElement) {
      tapados.push(el);
      apagarOverflow(el);
    }

    return () => {
      for (const el of tapados) devolverOverflow(el);
    };
  }, [activo, ref]);
}
