import { usePasoMax } from "./usePasoMax";

/* ────────────────────────────────────────────────────────────────────────
 * useAstrologiaProgreso — qué pasos del recorrido de ASTROLOGÍA están abiertos.
 *
 * Los abre María: el techo `pasoMax` de la persona (clave `metodo`), igual que en
 * el resto de disciplinas. Ya NO se abren solos al leer o rellenar la página
 * anterior; lo que se escribe dentro de astrología (la carta, los textos) se
 * sigue haciendo en sus páginas, pero no abre nada.
 * (La cadena antigua sigue en astrologiaDesbloqueo.ts, fijada por los tests del
 * backend, por si algún día vuelve.)
 * ──────────────────────────────────────────────────────────────────────── */

/** Sin `userIdProp`, la persona con la sesión abierta; con él, María en el camino de esa persona (y entonces hay `fijar`). */
export function useAstrologiaProgreso(userIdProp?: string | null, activo = true) {
  const { pasoMax, cargado, recargar, fijar } = usePasoMax(activo ? "metodo" : null, userIdProp);

  // Mientras no ha cargado NO bloqueamos (permisivo), para no marcar por error
  // como cerrada una página que sí está abierta durante ese instante.
  const bloqueada = (n: number): boolean => cargado && n > pasoMax;

  return { bloqueada, cargado, recargar, pasoMax, fijar };
}
