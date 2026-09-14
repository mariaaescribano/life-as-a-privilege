import * as crypto from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// ENLACE DE BAJA de la lista de correo.
//
// El enlace lleva el correo y una firma. La firma es un HMAC de la propia
// dirección con JWT_SECRET: así nadie puede dar de baja a otra persona
// escribiendo su correo en la barra del navegador, y no hace falta guardar
// ningún token en base de datos.
//
// NO caduca a propósito: un correo enviado hace un año tiene que seguir
// dejando salir de la lista.
// ─────────────────────────────────────────────────────────────────────────────

/** Normaliza igual que al darse de alta (minúsculas y sin espacios). */
export const normalizarEmail = (email: string): string => email.trim().toLowerCase();

export function firmaBaja(email: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET no está configurado en el entorno');
  return crypto
    .createHmac('sha256', secret)
    .update(`baja|${normalizarEmail(email)}`)
    .digest('base64url')
    .slice(0, 32);
}

export function firmaBajaValida(email: string, token: string): boolean {
  try {
    const esperada = Buffer.from(firmaBaja(email));
    const recibida = Buffer.from(token ?? '');
    return esperada.length === recibida.length && crypto.timingSafeEqual(esperada, recibida);
  } catch {
    return false;
  }
}

/** Dirección pública de ESTE servidor (la del propio backend, no la de la web).
 *  Se saca de BACKEND_URL; si no está, del callback de Google, que ya la lleva. */
function urlBackend(): string {
  const directa = process.env.BACKEND_URL;
  if (directa) return directa.replace(/\/$/, '');
  const callback = process.env.GOOGLE_CALLBACK_URL;
  if (callback) {
    try {
      return new URL(callback).origin;
    } catch {
      /* mal formada: se sigue al valor de desarrollo */
    }
  }
  return 'http://localhost:3000';
}

/** El enlace que se pega en los correos. */
export function enlaceBaja(email: string): string {
  const e = normalizarEmail(email);
  return `${urlBackend()}/subscribe/baja?email=${encodeURIComponent(e)}&t=${firmaBaja(e)}`;
}
