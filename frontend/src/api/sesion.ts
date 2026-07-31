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
 * ¿Esta sesión tiene el panel de administración DESBLOQUEADO?
 *
 * No basta con que el email esté en ADMIN_EMAILS: hay que haber pasado por
 * /admin/login con la contraseña de administración, que es lo que pone esta
 * marca (y lo que la quita cada vez que se vuelve a iniciar sesión).
 */
export function esAdminDesbloqueado(): boolean {
  try {
    return localStorage.getItem("isAdmin") === "1";
  } catch {
    return false;
  }
}

/**
 * A dónde lleva «Home» dentro de la sesión.
 *
 * Para una admin con el panel desbloqueado su casa es el panel, no el home del
 * recorrido: si está administrando, «Home» tiene que devolverla a /admin.
 * Cualquier botón de «volver al inicio» debería usar esto en vez de escribir
 * "/home" a mano, o vuelve a aparecer la incoherencia.
 */
export function rutaHome(): string {
  return esAdminDesbloqueado() ? "/admin" : "/home";
}

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
