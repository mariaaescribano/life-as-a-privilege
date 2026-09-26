import * as crypto from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN DEL REGALO DE CUMPLEAÑOS
//
// Va en el botón del correo de felicitación (/cumple?t=...). Es lo que hace que
// los 15 € existan SOLO para esa persona y SOLO desde ese correo: un Payment
// Link de 15 € sería una dirección fija que cualquiera podría reenviar.
//
// Firmado con JWT_SECRET y un prefijo propio (no vale como token de otra cosa).
// Lleva el año del cumpleaños: el «ya usado» se apunta por año en la BD.
// ─────────────────────────────────────────────────────────────────────────────

/** Siete días para usarlo desde que se manda la felicitación. */
export const CUMPLE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** 50 % de los 30 € de una disciplina, en céntimos. */
export const PRECIO_CUMPLE_CENTIMOS = 1500;

export interface PayloadCumple {
  uid: string;
  anio: number;
  exp: number;
}

const b64url = (buf: Buffer): string => buf.toString('base64url');

function firmar(payloadB64: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET no está configurado en el entorno');
  return b64url(crypto.createHmac('sha256', `cumple|${secret}`).update(payloadB64).digest());
}

export function crearTokenCumple(userId: string, anio: number): string {
  const payload: PayloadCumple = { uid: userId, anio, exp: Date.now() + CUMPLE_TTL_MS };
  const payloadB64 = b64url(Buffer.from(JSON.stringify(payload), 'utf8'));
  return `${payloadB64}.${firmar(payloadB64)}`;
}

/**
 * Devuelve el payload si la firma es buena. La caducidad NO se comprueba aquí
 * para poder decirle a la persona «ha caducado» en vez de «no es válido»:
 * mírala con `payload.exp`.
 */
export function leerTokenCumple(token: string): PayloadCumple | null {
  const partes = (token ?? '').split('.');
  if (partes.length !== 2) return null;
  const [payloadB64, firma] = partes;

  const esperada = Buffer.from(firmar(payloadB64), 'utf8');
  const recibida = Buffer.from(firma, 'utf8');
  if (esperada.length !== recibida.length || !crypto.timingSafeEqual(esperada, recibida)) return null;

  try {
    const p = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (typeof p?.uid !== 'string' || !p.uid || typeof p?.anio !== 'number' || typeof p?.exp !== 'number') return null;
    return p as PayloadCumple;
  } catch {
    return null;
  }
}
