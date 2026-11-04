import { isAdminEmail } from './admin.util';

/** Cabecera con la que María dice «esta petición va sobre la persona X». */
export const CABECERA_PERSONA = 'x-persona';

/**
 * El camino de María y el de la persona llegan al mismo sitio por separado.
 * María NO se hace pasar por nadie ni recibe un token ajeno: sigue con su token de
 * admin y, cuando está en el camino de una persona, el navegador añade la cabecera
 * `X-Persona: <id>`. Aquí se decide si esa cabecera vale.
 *
 * Solo vale si el token es de admin DESBLOQUEADO (email en ADMIN_EMAILS y token
 * emitido tras la contraseña de admin). En cualquier otro caso la cabecera se
 * ignora, así que una persona normal no puede usarla para ver lo de otra.
 *
 * Si vale, `req.user` pasa a ser la persona (para que cada endpoint que mira «de
 * quién es el token» devuelva SUS datos) con `admin: true` (para que los guards de
 * admin y de dueño sigan dejando pasar) y `suplantadoPor` con el id de María (para
 * saber que quien actúa es ella: `esMaria`, y lo que solo puede hacer la persona,
 * como dar el consentimiento de salud o borrar su cuenta, se le sigue negando).
 */
export function resolverPersona(
  payload: { sub?: string; email?: string; admin?: boolean },
  cabecera: string | string[] | undefined,
) {
  const base = {
    userId: payload.sub,
    email: payload.email,
    // Solo es true si el token se emitió tras verificar la contraseña de admin.
    admin: payload.admin === true,
    suplantadoPor: undefined as string | undefined,
  };
  const persona = (Array.isArray(cabecera) ? cabecera[0] : cabecera)?.trim();
  if (!persona || persona === 'admin' || persona === payload.sub) return base;
  if (!base.admin || !isAdminEmail(payload.email)) return base;
  return { ...base, userId: persona, suplantadoPor: payload.sub };
}
