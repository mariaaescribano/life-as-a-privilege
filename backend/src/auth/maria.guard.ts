import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { isAdminEmail } from './admin.util';

/**
 * ¿Es María quien hace la petición? La sesión de admin desbloqueada, con o sin la
 * cabecera de persona (con ella `suplantadoPor` trae su id; ver persona.util.ts).
 * Una persona normal, nunca.
 */
export function esMaria(req: any): boolean {
  const u = req?.user;
  if (!u) return false;
  if (u.suplantadoPor) return true;
  return u.admin === true && isAdminEmail(u.email);
}

/** Deja pasar solo a María. Va SIEMPRE después de `JwtAuthGuard`. */
@Injectable()
export class MariaGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (!esMaria(context.switchToHttp().getRequest())) {
      throw new ForbiddenException('Solo María puede escribir estas notas');
    }
    return true;
  }
}
