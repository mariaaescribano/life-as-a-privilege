// Lista de emails con permisos de administración (panel de astrología, etc.).
// Se configura con la variable de entorno ADMIN_EMAILS (separados por comas).
// Ej: ADMIN_EMAILS="maria@ejemplo.com, otra@ejemplo.com"
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCESO LIBRE — cuentas invitadas que ven TODO el recorrido sin pagar. No es lo
// mismo que ser admin: son cuentas normales a las que se les regala el acceso.
// Se configura con la variable de entorno ACCESO_LIBRE_EMAILS (separados por
// comas). Al no vivir en la BD, nadie puede dárselo a sí mismo desde la app:
// solo se cambia en el panel del servidor.
// Ej: ACCESO_LIBRE_EMAILS="amiga@ejemplo.com, prueba@ejemplo.com"
//
// La otra vía (puntual, sin tocar el servidor) es el panel de admin:
// /admin/accesos concede o quita las disciplinas de una cuenta concreta.
// ─────────────────────────────────────────────────────────────────────────────
export function getAccesoLibreEmails(): string[] {
  return (process.env.ACCESO_LIBRE_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAccesoLibreEmail(email?: string | null): boolean {
  if (!email) return false;
  return getAccesoLibreEmails().includes(email.trim().toLowerCase());
}

// Contraseña ÚNICA de administración (además de estar en ADMIN_EMAILS). Se
// configura con la variable de entorno ADMIN_PASSWORD. Sin ella, NADIE puede
// desbloquear el panel de admin aunque su email esté en la lista.
export function getAdminPassword(): string {
  return (process.env.ADMIN_PASSWORD ?? '').trim();
}

// Comparación en tiempo (casi) constante para no filtrar la longitud por el
// tiempo de respuesta. Devuelve false si no hay ADMIN_PASSWORD configurada.
export function verifyAdminPassword(password?: string | null): boolean {
  const expected = getAdminPassword();
  if (!expected) return false; // sin contraseña configurada, acceso cerrado
  const given = (password ?? '').trim();
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  }
  return diff === 0;
}
