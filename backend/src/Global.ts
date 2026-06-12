import { randomInt } from 'crypto';

export function randomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';

  // randomInt (node:crypto) es criptográficamente seguro, a diferencia de
  // Math.random(), que es predecible y no debe usarse para generar ids.
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomInt(chars.length));
  }

  return result;
}
