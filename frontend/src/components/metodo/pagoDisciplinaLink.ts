// ─────────────────────────────────────────────────────────────────────────────
// Pago de las disciplinas de «El Recorrido» con un Payment Link de Stripe.
//
// Las ocho disciplinas se cobran POR SEPARADO (un cobro y un flag por cada una),
// pero todas pasan por el MISMO enlace, porque todas valen lo mismo.
//
// Un Payment Link es una URL estática y no sabe quién la abre, así que le
// colgamos el usuario y la disciplina en el `client_reference_id`:
//
//     https://buy.stripe.com/…?client_reference_id=<scope>__<userId>
//
// Stripe solo admite [A-Za-z0-9_-] ahí (máx. 200 caracteres); el scope son
// letras y el userId un UUID, así que encaja. Al acabar el pago el enlace
// redirige a /home?disciplina_pagada={CHECKOUT_SESSION_ID} y Home llama a
// GET /payment/disciplina/verify, que recupera la referencia y desbloquea.
//
// IMPORTANTE: para que esto funcione, el enlace tiene que tener configurado en
// Stripe → «Después del pago» → «Redirigir a tu sitio web»:
//     https://lifeasaprivilege.onrender.com/home?disciplina_pagada={CHECKOUT_SESSION_ID}
// Sin esa redirección se cobra el dinero pero la disciplina NO se desbloquea.
// ─────────────────────────────────────────────────────────────────────────────

/** Enlace de pago único para las ocho disciplinas (30 € cada una). */
export const STRIPE_LINK_DISCIPLINAS =
  "https://buy.stripe.com/28E14g9TpeXy2bBb6I2VG04";

// ── PRECIO ─ fuente única ───────────────────────────────────────────────────
// Este número tiene que coincidir con el importe configurado en el Payment Link
// de arriba. Todo lo que enseñe un precio en la app (el box de pago, la página
// pública de El Método…) sale de aquí, para que no haya dos cifras distintas.

/** Precio de UNA disciplina, en euros. */
export const PRECIO_DISCIPLINA_EUR = 30;

/** Las disciplinas que forman El Mapa (se pagan una a una; el orden es el
 *  aconsejado, se puede desbloquear cualquiera cuando se quiera). */
export const NUM_DISCIPLINAS = 8;

/** Precio de una disciplina, tal y como se muestra en el box de pago. */
export const PRECIO_DISCIPLINA = `${PRECIO_DISCIPLINA_EUR} €`;

/** Lo que cuesta El Mapa entero si se completan las ocho disciplinas. */
export const PRECIO_MAPA_COMPLETO = `${PRECIO_DISCIPLINA_EUR * NUM_DISCIPLINAS} €`;

export type DisciplinaScope =
  | "metodo"
  | "psicologia"
  | "ayurveda"
  | "tcm"
  | "fisiologia"
  | "nutricion"
  | "cabala"
  | "cultura";

/**
 * Lleva a Stripe a pagar una disciplina. Devuelve un mensaje de error si no se
 * ha podido construir el enlace (y entonces NO navega), o null si todo bien.
 */
export function irAPagoDisciplina(scope: DisciplinaScope): string | null {
  const userId = localStorage.getItem("userId");
  if (!userId) return "Sesión expirada. Vuelve a iniciar sesión.";

  const ref = `${scope}__${userId}`;
  // Si el userId trajera algún carácter raro, Stripe rechazaría la referencia y
  // el pago se cobraría sin poder desbloquear nada: mejor no dejar empezar.
  if (!/^[A-Za-z0-9_-]{1,200}$/.test(ref)) {
    return "No se pudo preparar el pago. Escríbeme y lo soluciono.";
  }

  window.location.href = `${STRIPE_LINK_DISCIPLINAS}?client_reference_id=${ref}`;
  return null;
}
