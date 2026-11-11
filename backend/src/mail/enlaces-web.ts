/**
 * La web a la que apuntan los ENLACES de los correos (activación, recuperar contraseña,
 * felicitación, avisos...). Si estás en local pero quieres que el correo lleve a la web
 * real, pon `EMAIL_LINKS_URL=https://...` en el .env; FRONTEND_URL (que sigue siendo
 * localhost para Stripe/CORS) no se toca. Sin esa variable se usa FRONTEND_URL.
 */
export function webParaCorreos(respaldo = 'http://localhost:5173'): string {
  const url = (process.env.EMAIL_LINKS_URL || process.env.FRONTEND_URL || respaldo).trim();
  return url.replace(/\/+$/, '');
}
