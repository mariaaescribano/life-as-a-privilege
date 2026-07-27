// ─────────────────────────────────────────────────────────────────────────────
// Cierre de sesión en el navegador.
//
// Por qué existe esto en vez de un `localStorage.clear()` suelto: en el mismo
// almacén conviven DOS cosas distintas.
//
//   · Datos de SESIÓN (userId, token, name, img, isAdmin…) → tienen que irse.
//   · PREFERENCIAS del navegador, que no son de nadie en concreto → tienen que
//     quedarse. Hoy la única es `cookieConsent`, la decisión sobre las cookies
//     analíticas.
//
// Al borrar el almacén entero también se borraba la decisión de las cookies, así
// que el aviso de abajo volvía a salir cada vez que alguien cerraba sesión (o
// cada vez que le caducaba el token). Y esa decisión es del navegador, no de la
// cuenta: si ya la tomó, no hay que volver a preguntársela.
// ─────────────────────────────────────────────────────────────────────────────

/** Claves que NO son de sesión y sobreviven al cierre. */
const PREFERENCIAS = ["cookieConsent"];

/**
 * Borra la sesión del navegador conservando las preferencias.
 *
 * Se hace por lista de lo que se CONSERVA (y no de lo que se borra) a propósito:
 * si mañana se guarda un dato nuevo de sesión, se irá solo. Al revés habría que
 * acordarse de añadirlo aquí, y es justo lo que no pasa.
 */
export function cerrarSesionLocal() {
  try {
    const guardadas = PREFERENCIAS
      .map((clave) => [clave, localStorage.getItem(clave)] as const)
      .filter(([, valor]) => valor !== null);

    localStorage.clear();
    sessionStorage.clear(); // por si quedaran restos de la sesión antigua

    for (const [clave, valor] of guardadas) localStorage.setItem(clave, valor as string);
  } catch {
    // localStorage puede fallar en el modo privado de algunos navegadores. Si no
    // se puede limpiar, tampoco había nada guardado que limpiar.
  }
}
