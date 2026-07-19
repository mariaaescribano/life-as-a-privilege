import { useCallback, useState } from "react";

// Estado del cómic de intro de una disciplina. Antes se marcaba como «visto» para
// no repetirlo; ahora el cómic de intro SIEMPRE aparece (se puede saltar con la X
// / el tick, pero vuelve a salir la próxima vez). Se mantiene la misma API para
// no tocar las páginas que lo usan; `endpointBase` ya no se usa.
//
//   · checkAndOpen(): abre la intro (siempre). Úsalo cuando la página ya sabe que
//                     el usuario tiene acceso.
//   · openNow():      abre la intro directamente.
//   · finish():       cierra (ya no persiste nada).
//   · close():        cierra.
export function useIntroComic(_endpointBase: string) {
  const [open, setOpen] = useState(false);

  const checkAndOpen = useCallback(async () => { setOpen(true); }, []);
  const openNow = useCallback(() => setOpen(true), []);
  const finish = useCallback(() => setOpen(false), []);
  const close = useCallback(() => setOpen(false), []);

  return { open, checkAndOpen, openNow, finish, close };
}
