/**
 * Ejecuta `fn` cuando NO hay un cómic (u otro popup a pantalla completa) abierto
 * encima de la página, `extraMs` milisegundos después.
 *
 * Por qué: en la portada de cada disciplina se abre un cómic de entrada. Si las
 * animaciones de la página (el título de la cabecera, las cajas…) corrieran
 * mientras el cómic está delante, se gastarían detrás y al cerrarlo lo
 * encontrarías todo ya colocado. Con esto esperan a que el cómic se cierre y
 * entonces entran de verdad.
 *
 * Cómo se sabe que hay un cómic: los popups de pantalla completa bloquean el
 * scroll de la página (`body.style.overflow = "hidden"`). Se empieza a mirar
 * tras 80 ms (para que el cómic haya tenido tiempo de bloquearlo) y se vuelve a
 * mirar cada 150 ms mientras siga bloqueado. Si no hay cómic, solo espera
 * `extraMs`.
 *
 * Devuelve la función que lo cancela (para el `return` de un useEffect).
 */
export function cuandoSinComic(fn: () => void, extraMs = 0): () => void {
  let id = 0;
  let poll = 0;
  const mirar = () => {
    if (typeof document !== "undefined" && document.body.style.overflow === "hidden") {
      poll = window.setTimeout(mirar, 150);
    } else {
      id = window.setTimeout(fn, extraMs);
    }
  };
  poll = window.setTimeout(mirar, 80);
  return () => { window.clearTimeout(id); window.clearTimeout(poll); };
}
