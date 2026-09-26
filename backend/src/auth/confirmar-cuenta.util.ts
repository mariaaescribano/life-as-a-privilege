import * as crypto from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS DE CONFIRMACIÓN DE CUENTA
//
// Mismo esquema que `password-reset.util.ts` (firmado, sin tabla), pero aquí no
// hace falta que sea de un solo uso: confirmar dos veces no hace nada malo. La
// firma sale de JWT_SECRET con un prefijo propio, para que un token de esto no
// valga como token de recuperación ni al revés.
//
// Formato: "<payload en base64url>.<firma en base64url>"
// ─────────────────────────────────────────────────────────────────────────────

/** Treinta días: hay quien abre el correo de bienvenida una semana después. */
export const CONFIRMACION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface PayloadConfirmacion {
  uid: string;
  exp: number;
}

const b64url = (buf: Buffer): string => buf.toString('base64url');

function firmar(payloadB64: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET no está configurado en el entorno');
  return b64url(crypto.createHmac('sha256', `confirmar-cuenta|${secret}`).update(payloadB64).digest());
}

/** Genera el token que viaja en el enlace del correo de bienvenida. */
export function crearTokenConfirmacion(userId: string): string {
  const payload: PayloadConfirmacion = { uid: userId, exp: Date.now() + CONFIRMACION_TTL_MS };
  const payloadB64 = b64url(Buffer.from(JSON.stringify(payload), 'utf8'));
  return `${payloadB64}.${firmar(payloadB64)}`;
}

/** Devuelve el id del usuario si firma y caducidad son buenas; si no, null. */
export function leerTokenConfirmacion(token: string): string | null {
  const partes = (token ?? '').split('.');
  if (partes.length !== 2) return null;
  const [payloadB64, firma] = partes;

  const esperada = Buffer.from(firmar(payloadB64), 'utf8');
  const recibida = Buffer.from(firma, 'utf8');
  if (esperada.length !== recibida.length || !crypto.timingSafeEqual(esperada, recibida)) return null;

  try {
    const payload: PayloadConfirmacion = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (typeof payload?.exp !== 'number' || Date.now() > payload.exp) return null;
    return typeof payload?.uid === 'string' && payload.uid ? payload.uid : null;
  } catch {
    return null;
  }
}
