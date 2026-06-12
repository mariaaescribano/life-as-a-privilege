import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { isAdminEmail } from './admin.util';

/**
 * Verifica que el usuario autenticado es el DUEÑO del recurso al que accede
 * (o un administrador). Debe usarse SIEMPRE después de `JwtAuthGuard`, de modo
 * que `req.user` ya esté poblado con `{ userId, email }`.
 *
 * Extrae el id del propietario del recurso desde, por orden:
 *   - params: `:userId` o `:id`
 *   - body:   `userId` o `idUser`
 * y lo compara con `req.user.userId`. Los administradores (ADMIN_EMAILS) pasan
 * siempre, para no romper los paneles de administración.
 */
@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authUserId: string | undefined = req.user?.userId;
    if (!authUserId) {
      throw new ForbiddenException('No autenticado');
    }

    // Los administradores pueden operar sobre cualquier usuario.
    if (isAdminEmail(req.user?.email)) return true;

    const target =
      req.params?.userId ??
      req.params?.id ??
      req.body?.userId ??
      req.body?.idUser;

    if (!target) {
      throw new ForbiddenException(
        'No se pudo determinar el propietario del recurso',
      );
    }
    if (String(target) !== String(authUserId)) {
      throw new ForbiddenException('No tienes permiso sobre este recurso');
    }
    return true;
  }
}
