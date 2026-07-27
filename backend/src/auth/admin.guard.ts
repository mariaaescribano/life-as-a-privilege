import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { isAdminEmail } from './admin.util';

// Guard de administración. Debe usarse SIEMPRE después de JwtAuthGuard,
// de modo que req.user ya esté poblado con { userId, email }.
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // Doble condición: el email debe estar en ADMIN_EMAILS Y el token debe
    // haberse emitido tras verificar la contraseña de admin (claim `admin`).
    // Estar en la lista de emails ya no basta por sí solo.
    if (!isAdminEmail(req.user?.email) || req.user?.admin !== true) {
      throw new ForbiddenException('Acceso restringido a administración');
    }
    return true;
  }
}
