import * as crypto from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS DE RECUPERACIÓN DE CONTRASEÑA
//
// El token NO se guarda en base de datos: va firmado con una clave derivada de
// JWT_SECRET **y del hash actual de la contraseña del usuario**. Eso nos da
// gratis dos propiedades que normalmente exigirían una tabla:
//
//   · Un solo uso — al restablecer la contraseña cambia su hash, así que la
//     clave de firma cambia y el token usado deja de validar automáticamente.
//   · Caducidad — la fecha viaja dentro del payload firmado, así que nadie
//     puede alargarla sin invalidar la firma.
//
// Formato: "<payload en base64url>.<firma en base64url>"
// ─────────────────────────────────────────────────────────────────────────────

/** Una hora de validez: suficiente para ir al correo, corto para que no se quede vivo. */
export const RECUPERACION_TTL_MS = 60 * 60 * 1000;

interface PayloadRecuperacion {
  /** id del usuario */
  uid: string;
  /** caducidad, en milisegundos desde epoch */
  exp: number;
}

const b64url = (buf: Buffer): string => buf.toString('base64url');

/** Clave de firma propia de cada usuario: cambia en cuanto cambia su contraseña. */
function claveDe(passwordHash: string): Buffer {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET no está configurado en el entorno');
  return crypto.createHmac('sha256', secret).update(`pwd-reset|${passwordHash}`).digest();
}

function firmar(payloadB64: string, passwordHash: string): string {
  return b64url(crypto.createHmac('sha256', claveDe(passwordHash)).update(payloadB64).digest());
}

/** Genera el token que viaja en el enlace del email. */
export function crearTokenRecuperacion(userId: string, passwordHash: string): string {
  const payload: PayloadRecuperacion = { uid: userId, exp: Date.now() + RECUPERACION_TTL_MS };
  const payloadB64 = b64url(Buffer.from(JSON.stringify(payload), 'utf8'));
  return `${payloadB64}.${firmar(payloadB64, passwordHash)}`;
}

/**
 * Lee el id de usuario de un token SIN comprobar la firma. Solo sirve para saber
 * a quién hay que buscar en la base de datos; el token no se da por bueno hasta
 * pasar por `tokenRecuperacionValido` con el hash real de esa cuenta.
 */
export function leerUserIdDeToken(token: string): string | null {
  const [payloadB64] = (token ?? '').split('.');
  if (!payloadB64) return null;
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    return typeof payload?.uid === 'string' && payload.uid ? payload.uid : null;
  } catch {
    return null;
  }
}

/** Comprueba firma y caducidad contra el hash de contraseña que hay AHORA en la BD. */
export function tokenRecuperacionValido(token: string, passwordHash: string): boolean {
  const partes = (token ?? '').split('.');
  if (partes.length !== 2) return false;
  const [payloadB64, firma] = partes;

  let payload: PayloadRecuperacion;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return false;
  }
  if (typeof payload?.exp !== 'number' || Date.now() > payload.exp) return false;

  // Comparación en tiempo constante para no filtrar la firma esperada.
  const esperada = Buffer.from(firmar(payloadB64, passwordHash), 'utf8');
  const recibida = Buffer.from(firma, 'utf8');
  if (esperada.length !== recibida.length) return false;
  return crypto.timingSafeEqual(esperada, recibida);
}
