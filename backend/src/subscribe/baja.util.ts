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

/** Dirección pública de la WEB (FRONTEND_URL). La página de baja vive en la web, no en el
 *  backend: el dominio del servicio de Render ya no es el que se enseña a la gente. */
function urlWeb(): string {
  return (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
}

/** El enlace que se pega en los correos: la página /baja de la web, con la firma. */
export function enlaceBaja(email: string): string {
  const e = normalizarEmail(email);
  return `${urlWeb()}/baja?email=${encodeURIComponent(e)}&t=${firmaBaja(e)}`;
}
